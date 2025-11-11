const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const OTP = require('../models/OTP');
const jwtService = require('../utils/jwt');
const emailService = require('../services/emailService');
const smsService = require('../services/smsService');
const { asyncHandler } = require('../middleware/errorHandler');
const { 
  authenticate, 
  authRateLimit, 
  refreshTokenIfNeeded 
} = require('../middleware/auth');
const {
  validateRegistration,
  validateLogin,
  validateOTPVerification,
  validateSendOTP,
  validatePasswordReset,
  validateForgotPassword,
  validateChangePassword,
  validateRefreshToken,
  validateProfileUpdate
} = require('../middleware/validation');

const router = express.Router();

// Apply rate limiting to auth routes
router.use(authRateLimit(10, 15 * 60 * 1000)); // 10 attempts per 15 minutes

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user (Step 1 - Create account, send OTP)
 * @access  Public
 */
router.post('/register', validateRegistration, asyncHandler(async (req, res) => {
  const { name, email, phone, password } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({
    $or: [{ email }, { phone }]
  });

  if (existingUser) {
    const field = existingUser.email === email ? 'email' : 'phone';
    return res.status(400).json({
      success: false,
      message: `User with this ${field} already exists`,
      code: 'USER_EXISTS',
      field
    });
  }

  // Create user (not activated yet)
  const user = new User({
    name,
    email,
    phone,
    password,
    isEmailVerified: false,
    isPhoneVerified: true, // Skip phone verification for MVP
    isActive: false // Account inactive until email OTP verification
  });

  await user.save();

  // Send OTP to email only (simplified for MVP)
  const emailOTPResult = await OTP.createOTP(user._id, email, 'email', 'registration');

  // Send email OTP
  const emailSent = await emailService.sendOTP(email, emailOTPResult.otp, 'registration');

  res.status(201).json({
    success: true,
    message: 'Registration initiated. Please verify your email with the OTP code sent.',
    data: {
      userId: user._id,
      email: user.email,
      phone: user.phone,
      name: user.name,
      verification: {
        email: {
          sent: emailSent.success,
          expiresAt: emailOTPResult.expiresAt
        }
      }
    }
  });
}));

/**
 * @route   POST /api/auth/verify-otp
 * @desc    Verify OTP for registration, login, or other purposes
 * @access  Public
 */
router.post('/verify-otp', validateOTPVerification, asyncHandler(async (req, res) => {
  const { otp, type, purpose, userId } = req.body;

  if (!userId) {
    return res.status(400).json({
      success: false,
      message: 'User ID is required',
      code: 'USER_ID_REQUIRED'
    });
  }

  // Find user
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found',
      code: 'USER_NOT_FOUND'
    });
  }

  // Verify OTP
  const otpVerification = await OTP.verifyOTP(userId, otp, type, purpose);

  if (!otpVerification.success) {
    // Increment attempts for failed verification
    await OTP.incrementAttempts(userId, otp, type, purpose);
    
    return res.status(400).json({
      success: false,
      message: otpVerification.message,
      code: 'OTP_VERIFICATION_FAILED'
    });
  }

  // Update user verification status based on type and purpose
  const updateData = {};
  
  if (purpose === 'registration') {
    if (type === 'email') {
      updateData.isEmailVerified = true;
      updateData.isActive = true; // Activate account immediately after email verification (simplified MVP)
    } else if (type === 'sms') {
      updateData.isPhoneVerified = true;
    }
  } else if (purpose === 'email_verification') {
    updateData.isEmailVerified = true;
  } else if (purpose === 'phone_verification') {
    updateData.isPhoneVerified = true;
  }

  // Update user
  await User.findByIdAndUpdate(userId, updateData);
  const updatedUser = await User.findById(userId).select('-password');

  // If registration is complete, generate tokens and send welcome messages
  if (purpose === 'registration' && updatedUser.isActive) {
    const tokens = jwtService.generateTokenPair({
      userId: updatedUser._id,
      email: updatedUser.email,
      role: updatedUser.role,
      isEmailVerified: updatedUser.isEmailVerified,
      isPhoneVerified: updatedUser.isPhoneVerified
    });

    // Save refresh token
    updatedUser.refreshTokens.push({
      token: tokens.refreshToken,
      createdAt: new Date()
    });
    await updatedUser.save();

    // Send welcome messages
    emailService.sendWelcomeEmail(updatedUser.email, updatedUser.name);
    // smsService.sendWelcomeSMS(updatedUser.phone, updatedUser.name); // Disabled - SMS not used in MVP

    return res.status(200).json({
      success: true,
      message: 'Registration completed successfully! Welcome to Luminex Trading.',
      data: {
        user: updatedUser,
        tokens
      }
    });
  }

  res.status(200).json({
    success: true,
    message: `${type.toUpperCase()} verification successful`,
    data: {
      user: updatedUser,
      verificationType: type,
      isFullyVerified: updatedUser.isEmailVerified && updatedUser.isPhoneVerified
    }
  });
}));

/**
 * @route   POST /api/auth/send-otp
 * @desc    Send OTP to email or phone
 * @access  Public
 */
router.post('/send-otp', validateSendOTP, asyncHandler(async (req, res) => {
  const { type, purpose, contact, userId } = req.body;

  let user;
  
  if (userId) {
    user = await User.findById(userId);
  } else if (purpose === 'login' || purpose === 'password_reset') {
    user = await User.findByEmailOrPhone(contact);
  }

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found',
      code: 'USER_NOT_FOUND'
    });
  }

  // Create OTP
  const otpResult = await OTP.createOTP(user._id, contact, type, purpose);

  // Send OTP based on type
  let sendResult;
  if (type === 'email') {
    sendResult = await emailService.sendOTP(contact, otpResult.otp, purpose);
  } else if (type === 'sms') {
    // SMS disabled for MVP - just return success
    sendResult = { success: true, message: 'SMS OTP logged to console' };
    console.log(`📱 [MVP - SMS Disabled] SMS OTP for ${contact}: ${otpResult.otp}`);
    // sendResult = await smsService.sendOTP(contact, otpResult.otp, purpose);
  }

  if (!sendResult.success) {
    return res.status(500).json({
      success: false,
      message: `Failed to send ${type.toUpperCase()} OTP`,
      code: 'OTP_SEND_FAILED',
      error: sendResult.message
    });
  }

  res.status(200).json({
    success: true,
    message: `OTP sent successfully to your ${type}`,
    data: {
      type,
      contact: type === 'email' ? contact : `***${contact.slice(-4)}`,
      expiresAt: otpResult.expiresAt,
      expiresIn: `${process.env.OTP_EXPIRY_MINUTES || 10} minutes`
    }
  });
}));

/**
 * @route   POST /api/auth/login
 * @desc    Login user (Step 1 - Verify credentials, send OTP)
 * @access  Public
 */
router.post('/login', validateLogin, asyncHandler(async (req, res) => {
  const { identifier, password, otpType = 'email' } = req.body;

  // Find user by email or phone
  const user = await User.findByEmailOrPhone(identifier).select('+password');

  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials',
      code: 'INVALID_CREDENTIALS'
    });
  }

  // Check if account is locked
  if (user.isLocked) {
    return res.status(401).json({
      success: false,
      message: 'Account is temporarily locked due to multiple failed login attempts',
      code: 'ACCOUNT_LOCKED',
      lockUntil: user.lockUntil
    });
  }

  // Check if account is active
  if (!user.isActive) {
    return res.status(401).json({
      success: false,
      message: 'Account is not activated. Please complete registration.',
      code: 'ACCOUNT_INACTIVE'
    });
  }

  // Verify password
  const isPasswordCorrect = await user.correctPassword(password, user.password);

  if (!isPasswordCorrect) {
    await user.incLoginAttempts();
    
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials',
      code: 'INVALID_CREDENTIALS'
    });
  }

  // Reset login attempts on successful password verification
  await user.resetLoginAttempts();

  // Determine contact based on OTP type preference
  const contact = otpType === 'email' ? user.email : user.phone;
  
  // Create and send OTP
  const otpResult = await OTP.createOTP(user._id, contact, otpType, 'login');

  let sendResult;
  if (otpType === 'email') {
    sendResult = await emailService.sendOTP(contact, otpResult.otp, 'login');
  } else {
    // SMS disabled for MVP - just return success
    sendResult = { success: true, message: 'SMS OTP logged to console' };
    console.log(`📱 [MVP - SMS Disabled] Login SMS OTP for ${contact}: ${otpResult.otp}`);
    // sendResult = await smsService.sendOTP(contact, otpResult.otp, 'login');
  }

  res.status(200).json({
    success: true,
    message: `Login OTP sent to your ${otpType}`,
    data: {
      userId: user._id,
      otpType,
      contact: otpType === 'email' ? contact : `***${contact.slice(-4)}`,
      expiresAt: otpResult.expiresAt,
      otpSent: sendResult.success
    }
  });
}));

/**
 * @route   POST /api/auth/login-verify
 * @desc    Complete login with OTP verification
 * @access  Public
 */
router.post('/login-verify', validateOTPVerification, asyncHandler(async (req, res) => {
  const { otp, type, userId } = req.body;

  // Verify OTP
  const otpVerification = await OTP.verifyOTP(userId, otp, type, 'login');

  if (!otpVerification.success) {
    return res.status(400).json({
      success: false,
      message: otpVerification.message,
      code: 'OTP_VERIFICATION_FAILED'
    });
  }

  // Get user
  const user = await User.findById(userId).select('-password');
  
  if (!user || !user.isActive) {
    return res.status(401).json({
      success: false,
      message: 'User not found or account inactive',
      code: 'USER_INACTIVE'
    });
  }

  // Generate tokens
  const tokens = jwtService.generateTokenPair({
    userId: user._id,
    email: user.email,
    role: user.role,
    isEmailVerified: user.isEmailVerified,
    isPhoneVerified: user.isPhoneVerified
  });

  // Save refresh token
  user.refreshTokens.push({
    token: tokens.refreshToken,
    createdAt: new Date()
  });

  // Update last login
  user.lastLogin = new Date();
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Login successful',
    data: {
      user,
      tokens
    }
  });
}));

/**
 * @route   POST /api/auth/refresh-token
 * @desc    Refresh access token using refresh token
 * @access  Public
 */
router.post('/refresh-token', validateRefreshToken, asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;

  // Verify refresh token
  const verification = jwtService.verifyRefreshToken(refreshToken);

  if (!verification.success) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired refresh token',
      code: 'INVALID_REFRESH_TOKEN'
    });
  }

  // Find user and check if refresh token exists
  const user = await User.findById(verification.payload.userId);
  
  if (!user || !user.isActive) {
    return res.status(401).json({
      success: false,
      message: 'User not found or inactive',
      code: 'USER_INACTIVE'
    });
  }

  // Check if refresh token exists in user's tokens
  const tokenExists = user.refreshTokens.some(token => token.token === refreshToken);
  
  if (!tokenExists) {
    return res.status(401).json({
      success: false,
      message: 'Refresh token not found',
      code: 'REFRESH_TOKEN_NOT_FOUND'
    });
  }

  // Generate new token pair
  const newTokens = jwtService.generateTokenPair({
    userId: user._id,
    email: user.email,
    role: user.role,
    isEmailVerified: user.isEmailVerified,
    isPhoneVerified: user.isPhoneVerified
  });

  // Remove old refresh token and add new one
  user.refreshTokens = user.refreshTokens.filter(token => token.token !== refreshToken);
  user.refreshTokens.push({
    token: newTokens.refreshToken,
    createdAt: new Date()
  });

  await user.save();

  res.status(200).json({
    success: true,
    message: 'Token refreshed successfully',
    data: {
      tokens: newTokens
    }
  });
}));

/**
 * @route   POST /api/auth/forgot-password
 * @desc    Send password reset OTP
 * @access  Public
 */
router.post('/forgot-password', validateForgotPassword, asyncHandler(async (req, res) => {
  const { identifier, otpType = 'email' } = req.body;

  // Find user
  const user = await User.findByEmailOrPhone(identifier);

  if (!user) {
    // Don't reveal if user exists or not
    return res.status(200).json({
      success: true,
      message: 'If an account with this information exists, a password reset OTP has been sent.'
    });
  }

  const contact = otpType === 'email' ? user.email : user.phone;
  
  // Create OTP
  const otpResult = await OTP.createOTP(user._id, contact, otpType, 'password_reset');

  // Send OTP
  let sendResult;
  if (otpType === 'email') {
    sendResult = await emailService.sendOTP(contact, otpResult.otp, 'password_reset');
  } else {
    // SMS disabled for MVP - just return success
    sendResult = { success: true, message: 'SMS OTP logged to console' };
    console.log(`📱 [MVP - SMS Disabled] Password reset SMS OTP for ${contact}: ${otpResult.otp}`);
    // sendResult = await smsService.sendOTP(contact, otpResult.otp, 'password_reset');
  }

  res.status(200).json({
    success: true,
    message: 'If an account with this information exists, a password reset OTP has been sent.',
    data: {
      otpType,
      expiresIn: `${process.env.OTP_EXPIRY_MINUTES || 10} minutes`
    }
  });
}));

/**
 * @route   POST /api/auth/reset-password
 * @desc    Reset password with OTP
 * @access  Public
 */
router.post('/reset-password', asyncHandler(async (req, res) => {
  const { identifier, otp, otpType, newPassword } = req.body;

  // Find user
  const user = await User.findByEmailOrPhone(identifier);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found',
      code: 'USER_NOT_FOUND'
    });
  }

  // Verify OTP
  const otpVerification = await OTP.verifyOTP(user._id, otp, otpType, 'password_reset');

  if (!otpVerification.success) {
    return res.status(400).json({
      success: false,
      message: otpVerification.message,
      code: 'OTP_VERIFICATION_FAILED'
    });
  }

  // Update password
  user.password = newPassword;
  
  // Clear all refresh tokens (logout from all devices)
  user.refreshTokens = [];
  
  // Reset login attempts
  await user.resetLoginAttempts();
  
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Password reset successful. Please login with your new password.'
  });
}));

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user (invalidate refresh token)
 * @access  Private
 */
router.post('/logout', authenticate, asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;

  if (refreshToken) {
    // Remove specific refresh token
    req.user.refreshTokens = req.user.refreshTokens.filter(
      token => token.token !== refreshToken
    );
  } else {
    // Remove all refresh tokens (logout from all devices)
    req.user.refreshTokens = [];
  }

  await req.user.save();

  res.status(200).json({
    success: true,
    message: 'Logged out successfully'
  });
}));

/**
 * @route   GET /api/auth/me
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/me', authenticate, refreshTokenIfNeeded, asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      user: req.user
    }
  });
}));

/**
 * @route   POST /api/auth/change-password
 * @desc    Change user password
 * @access  Private
 */
router.post('/change-password', authenticate, validateChangePassword, asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  // Get user with password
  const user = await User.findById(req.user._id).select('+password');

  // Verify current password
  const isCurrentPasswordCorrect = await user.correctPassword(currentPassword, user.password);

  if (!isCurrentPasswordCorrect) {
    return res.status(400).json({
      success: false,
      message: 'Current password is incorrect',
      code: 'INCORRECT_PASSWORD'
    });
  }

  // Update password
  user.password = newPassword;
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Password changed successfully'
  });
}));

/**
 * @route   PUT /api/auth/profile
 * @desc    Update user profile
 * @access  Private
 */
router.put('/profile', authenticate, validateProfileUpdate, asyncHandler(async (req, res) => {
  const { name, email, phone } = req.body;

  // Check if email is being changed and if it's already taken
  if (email && email !== req.user.email) {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email is already in use',
        code: 'EMAIL_EXISTS',
        field: 'email'
      });
    }
  }

  // Check if phone is being changed and if it's already taken
  if (phone && phone !== req.user.phone) {
    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Phone number is already in use',
        code: 'PHONE_EXISTS',
        field: 'phone'
      });
    }
  }

  // Update user fields
  const updateData = {};
  if (name) updateData.name = name;
  if (email && email !== req.user.email) {
    updateData.email = email;
    updateData.isEmailVerified = false; // Require re-verification
  }
  if (phone && phone !== req.user.phone) {
    updateData.phone = phone;
    updateData.isPhoneVerified = true; // Keep true since SMS disabled
  }

  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    updateData,
    { new: true, runValidators: true }
  ).select('-password');

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    data: {
      user: updatedUser
    }
  });
}));

module.exports = router;
