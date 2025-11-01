// API helper functions for backend communication
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

interface ApiResponse<T = any> {
  success: boolean
  message: string
  data?: T
  code?: string
  error?: string
}

// Helper to make API calls with proper error handling
async function apiCall<T = any>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const token = localStorage.getItem('luminex_token')
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }

    // Add auth token if available
    if (token && !endpoint.includes('/auth/login') && !endpoint.includes('/auth/register')) {
      headers['Authorization'] = `Bearer ${token}`
    }

    // Merge with any additional headers from options
    if (options.headers) {
      Object.assign(headers, options.headers)
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    })

    const data = await response.json()

    if (!response.ok) {
      return {
        success: false,
        message: data.message || 'An error occurred',
        code: data.code,
        error: data.error,
      }
    }

    return data
  } catch (error) {
    console.error('API call failed:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Network error occurred',
      code: 'NETWORK_ERROR',
    }
  }
}

// Auth API calls
export const authApi = {
  // Register new user (Step 1)
  register: async (data: { name: string; email: string; phone: string; password: string; confirmPassword: string }) => {
    return apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  // Verify OTP (for registration, login, password reset)
  verifyOTP: async (data: { 
    userId: string
    otp: string
    type: 'email' | 'sms'
    purpose: 'registration' | 'login' | 'password_reset'
  }) => {
    return apiCall('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  // Resend OTP
  sendOTP: async (data: {
    userId?: string
    type: 'email' | 'sms'
    purpose: 'registration' | 'login' | 'password_reset'
    contact?: string
  }) => {
    return apiCall('/auth/send-otp', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  // Login Step 1 - Send credentials, get OTP
  login: async (data: { identifier: string; password: string; otpType?: 'email' | 'sms' }) => {
    return apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  // Login Step 2 - Verify OTP, get tokens
  loginVerify: async (data: { userId: string; otp: string; type: 'email' | 'sms' }) => {
    return apiCall('/auth/login-verify', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  // Get current user profile
  getMe: async () => {
    return apiCall('/auth/me', {
      method: 'GET',
    })
  },

  // Logout
  logout: async (refreshToken?: string) => {
    return apiCall('/auth/logout', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    })
  },

  // Refresh access token
  refreshToken: async (refreshToken: string) => {
    return apiCall('/auth/refresh-token', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    })
  },

  // Update user profile
  updateProfile: async (data: { name?: string; email?: string; phone?: string }) => {
    return apiCall('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },

  // Change password
  changePassword: async (data: { currentPassword: string; newPassword: string; confirmPassword: string }) => {
    return apiCall('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  // Get current user profile
  getProfile: async () => {
    return apiCall('/auth/me', {
      method: 'GET',
    })
  },
}

// Store tokens in localStorage
export const tokenStorage = {
  setTokens: (accessToken: string, refreshToken: string) => {
    localStorage.setItem('luminex_token', accessToken)
    localStorage.setItem('luminex_refresh_token', refreshToken)
  },

  getAccessToken: () => localStorage.getItem('luminex_token'),
  
  getRefreshToken: () => localStorage.getItem('luminex_refresh_token'),

  clearTokens: () => {
    localStorage.removeItem('luminex_token')
    localStorage.removeItem('luminex_refresh_token')
    localStorage.removeItem('luminex_user')
  },
}
