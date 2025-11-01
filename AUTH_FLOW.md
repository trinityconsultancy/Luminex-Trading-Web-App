# Backend-Frontend Integration Guide

## Authentication Flow Documentation

This document explains how the frontend connects to the backend for **email-only OTP-based authentication** (simplified for MVP).

### Architecture

```
Frontend (Next.js)          Backend (Express)
Port 3000                   Port 5000
     │                           │
     │   HTTP POST requests      │
     ├──────────────────────────>│
     │   /api/auth/register      │
     │   /api/auth/verify-otp    │
     │   /api/auth/login         │
     │   /api/auth/login-verify  │
     │                           │
     │<──────────────────────────┤
     │   JSON responses          │
     │   (JWT tokens, user data) │
```

### Complete Registration Flow (2 Steps - Email Only)

#### Step 1: User Registration
**Frontend**: `app/signup/page.tsx` → `contexts/auth-context.tsx` → `lib/api.ts`

```typescript
// User fills signup form
const result = await register(name, email, phone, password)

// Backend creates user, sends email OTP only
POST http://localhost:5000/api/auth/register
{
  name: "John Doe",
  email: "john@example.com",
  phone: "+91 98765 43210",
  password: "password123"
}

// Response
{
  success: true,
  message: "Registration initiated. Please verify your email...",
  data: {
    userId: "507f1f77bcf86cd799439011",
    email: "john@example.com",
    phone: "+91 98765 43210",
    verification: {
      email: { sent: true, expiresAt: "..." }
    }
  }
}
```

#### Step 2: Verify Email OTP (Registration Complete)
```typescript
const result = await verifyOTP(userId, emailOTP, 'email', 'registration')

POST http://localhost:5000/api/auth/verify-otp
{
  userId: "507f1f77bcf86cd799439011",
  otp: "123456",
  type: "email",
  purpose: "registration"
}

// Response (email verified + account activated immediately)
{
  success: true,
  message: "Registration completed successfully!",
  data: {
    user: {
      _id: "507f1f77bcf86cd799439011",
      name: "John Doe",
      email: "john@example.com",
      phone: "+91 98765 43210",
      isEmailVerified: true,
      isPhoneVerified: true,  // Auto-set to true (skipped for MVP)
      isActive: true  // Activated immediately after email verification
    },
    tokens: {
      accessToken: "eyJhbGciOiJIUzI1...",
      refreshToken: "eyJhbGciOiJIUzI1..."
    }
  }
}
```

Frontend then:
1. Stores tokens in localStorage via `tokenStorage.setTokens()`
2. Stores user object in `auth-context.tsx` state
3. Redirects to `/dashboard`

### Complete Login Flow

#### Step 1: Submit Credentials
```typescript
const result = await login(identifier, password, otpType)

POST http://localhost:5000/api/auth/login
{
  identifier: "john@example.com",  // or phone number
  password: "password123",
  otpType: "email"  // or "sms"
}

// Response
{
  success: true,
  message: "Login OTP sent to your email",
  data: {
    userId: "507f1f77bcf86cd799439011",
    otpType: "email",
    contact: "john@example.com",
    expiresAt: "2024-01-01T12:10:00Z",
    otpSent: true
  }
}
```

#### Step 2: Verify Login OTP
```typescript
const result = await verifyOTP(userId, otp, otpType, 'login')

POST http://localhost:5000/api/auth/login-verify
{
  userId: "507f1f77bcf86cd799439011",
  otp: "123456",
  type: "email"
}

// Response (login complete with tokens)
{
  success: true,
  message: "Login successful",
  data: {
    user: {
      _id: "507f1f77bcf86cd799439011",
      name: "John Doe",
      email: "john@example.com",
      phone: "+91 98765 43210",
      isEmailVerified: true,
      isPhoneVerified: true,
      isActive: true,
      lastLogin: "2024-01-01T12:00:00Z"
    },
    tokens: {
      accessToken: "eyJhbGciOiJIUzI1...",
      refreshToken: "eyJhbGciOiJIUzI1..."
    }
  }
}
```

Frontend stores tokens and redirects to `/dashboard`.

### Resending OTP

```typescript
const result = await resendOTP(userId, type, purpose)

POST http://localhost:5000/api/auth/send-otp
{
  userId: "507f1f77bcf86cd799439011",
  type: "email",
  purpose: "registration"
}
```

### File Structure

```
Frontend Auth Flow:
├── app/signup/page.tsx         # 2-step signup UI (email OTP only)
├── app/login/page.tsx          # 2-step login UI (email OTP only)
├── components/otp-input.tsx    # 6-digit OTP input
├── contexts/auth-context.tsx   # Auth state management
├── lib/api.ts                  # API helpers + token storage
└── .env.local                  # NEXT_PUBLIC_API_URL

Backend Auth System:
├── routes/auth.js              # All auth endpoints (email OTP only)
├── models/User.js              # User schema
├── models/OTP.js               # OTP schema
├── middleware/auth.js          # JWT verification
├── middleware/validation.js    # Input validation
├── utils/jwt.js                # Token generation
├── services/emailService.js    # Email OTP sending
└── .env                        # Secrets + config

**Note**: Phone verification is skipped for MVP. `isPhoneVerified` auto-set to `true` in backend.
```

### Token Management

**Access Token**:
- Stored in `localStorage` as `luminex_token`
- Expires in 15 minutes
- Sent with every authenticated request: `Authorization: Bearer <token>`

**Refresh Token**:
- Stored in `localStorage` as `luminex_refresh_token`
- Expires in 7 days
- Used to get new access token when expired

**Auto-refresh** (not yet implemented):
```typescript
// Check if token expires soon and refresh
if (tokenExpiresInLessThan5Minutes) {
  const newTokens = await authApi.refreshToken(refreshToken)
  tokenStorage.setTokens(newTokens.accessToken, newTokens.refreshToken)
}
```

### Error Handling

All API calls return consistent structure:
```typescript
{
  success: boolean
  message: string      // User-friendly message
  code?: string        // Error code (e.g., "INVALID_OTP")
  data?: any           // Response data if successful
  error?: string       // Detailed error (dev only)
}
```

Frontend shows errors in `<Alert>` components.

### Security Features

1. **Rate Limiting**: 10 auth attempts per 15 minutes
2. **Account Lockout**: 5 failed login attempts → 2 hour lock
3. **OTP Expiry**: 10 minutes
4. **OTP Attempts**: Max 3 attempts per OTP
5. **Password**: Min 8 characters, bcrypt hashing
6. **JWT**: Secure token signing with secrets
7. **CORS**: Only allows `localhost:3000` in development

### Testing Without Email

Backend works without email configured:
- OTPs are generated and logged to console
- Check backend terminal for OTP codes
- Copy and paste into frontend OTP input

Example backend log:
```
📧 Email OTP for john@example.com: 123456 (expires in 10 minutes)
```

**Note**: SMS/phone verification removed for MVP simplicity.

### Development Workflow

1. **Start Backend**:
   ```bash
   cd backend
   npm install
   npm run dev  # Runs on port 5000
   ```

2. **Start Frontend**:
   ```bash
   pnpm install
   pnpm dev     # Runs on port 3000
   ```

3. **Test Signup**:
   - Go to http://localhost:3000/signup
   - Fill form and submit
   - Check backend terminal for email OTP code
   - Enter OTP in frontend
   - Registration complete - redirected to dashboard

4. **Test Login**:
   - Go to http://localhost:3000/login
   - Enter email + password
   - Choose email for OTP (SMS option removed)
   - Check backend terminal for OTP
   - Enter OTP and login

### Production Deployment

**Frontend** (Vercel):
```bash
# Set environment variable
NEXT_PUBLIC_API_URL=https://your-backend.herokuapp.com/api
```

**Backend** (Heroku/Render/Railway):
```bash
# Set environment variables
MONGODB_URI=mongodb+srv://...
CORS_ORIGIN=https://your-frontend.vercel.app
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
# Twilio not needed - phone verification disabled
```

### Troubleshooting

**"Network error occurred"**:
- Check if backend is running on port 5000
- Check `NEXT_PUBLIC_API_URL` in `.env.local`

**"Invalid credentials"**:
- User doesn't exist or wrong password
- Account might be locked after failed attempts

**"Invalid or expired OTP"**:
- OTP expired (10 min limit)
- Wrong OTP entered
- Check backend logs for generated OTP

**CORS errors**:
- Backend only allows `localhost:3000`
- Update `CORS_ORIGIN` in backend `.env`
