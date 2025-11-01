const crypto = require('crypto');

/**
 * Generate a random string of specified length
 * @param {number} length - Length of the random string
 * @returns {string} Random string
 */
const generateRandomString = (length = 32) => {
  return crypto.randomBytes(length).toString('hex');
};

/**
 * Generate a secure random number within a range
 * @param {number} min - Minimum value (inclusive)
 * @param {number} max - Maximum value (inclusive)
 * @returns {number} Random number
 */
const generateRandomNumber = (min = 100000, max = 999999) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Format phone number to international format
 * @param {string} phone - Phone number
 * @param {string} countryCode - Country code (default: +91 for India)
 * @returns {string} Formatted phone number
 */
const formatPhoneNumber = (phone, countryCode = '+91') => {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  
  // If it's already international format, return as is
  if (cleaned.startsWith('91') && cleaned.length === 12) {
    return '+' + cleaned;
  }
  
  // If it's a 10-digit Indian number, add country code
  if (cleaned.length === 10) {
    return countryCode + cleaned;
  }
  
  return phone; // Return original if format is unclear
};

/**
 * Mask email address for privacy
 * @param {string} email - Email address
 * @returns {string} Masked email
 */
const maskEmail = (email) => {
  if (!email || !email.includes('@')) return email;
  
  const [username, domain] = email.split('@');
  const maskedUsername = username.length > 2 
    ? username.substring(0, 2) + '*'.repeat(username.length - 2)
    : username;
  
  return `${maskedUsername}@${domain}`;
};

/**
 * Mask phone number for privacy
 * @param {string} phone - Phone number
 * @returns {string} Masked phone number
 */
const maskPhoneNumber = (phone) => {
  if (!phone) return phone;
  
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.length >= 10) {
    return `***-***-${cleaned.slice(-4)}`;
  }
  
  return `***${phone.slice(-4)}`;
};

/**
 * Calculate time difference in human readable format
 * @param {Date} date - Date to compare
 * @returns {string} Human readable time difference
 */
const getTimeAgo = (date) => {
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);
  
  if (diffInSeconds < 60) {
    return `${diffInSeconds} seconds ago`;
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minutes ago`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hours ago`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `${diffInDays} days ago`;
  }
  
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} months ago`;
  }
  
  const diffInYears = Math.floor(diffInMonths / 12);
  return `${diffInYears} years ago`;
};

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} Is valid email
 */
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate phone number format
 * @param {string} phone - Phone number to validate
 * @returns {boolean} Is valid phone number
 */
const isValidPhoneNumber = (phone) => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  const cleaned = phone.replace(/\s/g, '');
  return phoneRegex.test(cleaned);
};

/**
 * Generate a strong password
 * @param {number} length - Password length (default: 12)
 * @returns {string} Generated password
 */
const generateStrongPassword = (length = 12) => {
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
  
  const allChars = lowercase + uppercase + numbers + symbols;
  let password = '';
  
  // Ensure at least one character from each category
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += symbols[Math.floor(Math.random() * symbols.length)];
  
  // Fill the rest randomly
  for (let i = 4; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }
  
  // Shuffle the password
  return password.split('').sort(() => Math.random() - 0.5).join('');
};

/**
 * Sanitize user input
 * @param {string} input - Input to sanitize
 * @returns {string} Sanitized input
 */
const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  return input
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .trim(); // Remove leading/trailing whitespace
};

/**
 * Check password strength
 * @param {string} password - Password to check
 * @returns {object} Password strength analysis
 */
const checkPasswordStrength = (password) => {
  const result = {
    score: 0,
    feedback: [],
    isStrong: false
  };
  
  if (!password) {
    result.feedback.push('Password is required');
    return result;
  }
  
  // Length check
  if (password.length >= 8) {
    result.score += 1;
  } else {
    result.feedback.push('Password should be at least 8 characters long');
  }
  
  // Lowercase check
  if (/[a-z]/.test(password)) {
    result.score += 1;
  } else {
    result.feedback.push('Password should contain lowercase letters');
  }
  
  // Uppercase check
  if (/[A-Z]/.test(password)) {
    result.score += 1;
  } else {
    result.feedback.push('Password should contain uppercase letters');
  }
  
  // Number check
  if (/\d/.test(password)) {
    result.score += 1;
  } else {
    result.feedback.push('Password should contain numbers');
  }
  
  // Special character check
  if (/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password)) {
    result.score += 1;
  } else {
    result.feedback.push('Password should contain special characters');
  }
  
  // Length bonus
  if (password.length >= 12) {
    result.score += 1;
  }
  
  result.isStrong = result.score >= 5;
  
  if (result.feedback.length === 0) {
    result.feedback.push('Password is strong!');
  }
  
  return result;
};

/**
 * Generate API response format
 * @param {boolean} success - Success status
 * @param {string} message - Response message
 * @param {object} data - Response data
 * @param {string} code - Error/success code
 * @returns {object} Formatted API response
 */
const formatApiResponse = (success, message, data = null, code = null) => {
  const response = {
    success,
    message,
    timestamp: new Date().toISOString()
  };
  
  if (data !== null) {
    response.data = data;
  }
  
  if (code) {
    response.code = code;
  }
  
  return response;
};

/**
 * Sleep/delay function
 * @param {number} ms - Milliseconds to sleep
 * @returns {Promise} Promise that resolves after delay
 */
const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Deep clone an object
 * @param {object} obj - Object to clone
 * @returns {object} Cloned object
 */
const deepClone = (obj) => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime());
  if (obj instanceof Array) return obj.map(item => deepClone(item));
  if (typeof obj === 'object') {
    const clonedObj = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj;
  }
};

/**
 * Remove sensitive fields from user object
 * @param {object} user - User object
 * @returns {object} Sanitized user object
 */
const sanitizeUserObject = (user) => {
  const userObj = user.toObject ? user.toObject() : user;
  const sanitized = deepClone(userObj);
  
  // Remove sensitive fields
  delete sanitized.password;
  delete sanitized.refreshTokens;
  delete sanitized.loginAttempts;
  delete sanitized.lockUntil;
  delete sanitized.__v;
  
  return sanitized;
};

module.exports = {
  generateRandomString,
  generateRandomNumber,
  formatPhoneNumber,
  maskEmail,
  maskPhoneNumber,
  getTimeAgo,
  isValidEmail,
  isValidPhoneNumber,
  generateStrongPassword,
  sanitizeInput,
  checkPasswordStrength,
  formatApiResponse,
  sleep,
  deepClone,
  sanitizeUserObject
};
