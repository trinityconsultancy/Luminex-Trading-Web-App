const User = require('../models/User');
const jwtService = require('../utils/jwt');

// Middleware to authenticate user using JWT
const authenticate = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.header('Authorization');
    const token = jwtService.extractTokenFromHeader(authHeader);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.',
        code: 'NO_TOKEN'
      });
    }

    // Verify token
    const verification = jwtService.verifyAccessToken(token);
    
    if (!verification.success) {
      const statusCode = verification.expired ? 401 : 403;
      const code = verification.expired ? 'TOKEN_EXPIRED' : 'INVALID_TOKEN';
      
      return res.status(statusCode).json({
        success: false,
        message: verification.expired ? 'Token has expired' : 'Invalid token',
        code,
        error: verification.error
      });
    }

    // Get user from database
    const user = await User.findById(verification.payload.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found',
        code: 'USER_NOT_FOUND'
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated',
        code: 'ACCOUNT_DEACTIVATED'
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

    // Add user to request object
    req.user = user;
    req.token = token;
    req.tokenPayload = verification.payload;

    next();
  } catch (error) {
    console.error('Authentication middleware error:', error);
    
    res.status(500).json({
      success: false,
      message: 'Authentication failed',
      code: 'AUTH_ERROR',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Middleware to check if user is admin
const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required',
      code: 'AUTH_REQUIRED'
    });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Admin access required',
      code: 'ADMIN_REQUIRED'
    });
  }

  next();
};

// Middleware to check if email is verified
const requireEmailVerification = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required',
      code: 'AUTH_REQUIRED'
    });
  }

  if (!req.user.isEmailVerified) {
    return res.status(403).json({
      success: false,
      message: 'Email verification required',
      code: 'EMAIL_VERIFICATION_REQUIRED'
    });
  }

  next();
};

// Middleware to check if phone is verified
const requirePhoneVerification = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required',
      code: 'AUTH_REQUIRED'
    });
  }

  if (!req.user.isPhoneVerified) {
    return res.status(403).json({
      success: false,
      message: 'Phone verification required',
      code: 'PHONE_VERIFICATION_REQUIRED'
    });
  }

  next();
};

// Middleware to check if both email and phone are verified
const requireFullVerification = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required',
      code: 'AUTH_REQUIRED'
    });
  }

  if (!req.user.isEmailVerified || !req.user.isPhoneVerified) {
    return res.status(403).json({
      success: false,
      message: 'Complete account verification required',
      code: 'FULL_VERIFICATION_REQUIRED',
      verification: {
        email: req.user.isEmailVerified,
        phone: req.user.isPhoneVerified
      }
    });
  }

  next();
};

// Optional authentication middleware (doesn't fail if no token)
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    const token = jwtService.extractTokenFromHeader(authHeader);

    if (!token) {
      return next();
    }

    const verification = jwtService.verifyAccessToken(token);
    
    if (verification.success) {
      const user = await User.findById(verification.payload.userId).select('-password');
      
      if (user && user.isActive && !user.isLocked) {
        req.user = user;
        req.token = token;
        req.tokenPayload = verification.payload;
      }
    }

    next();
  } catch (error) {
    // Don't fail on optional auth errors, just continue without user
    next();
  }
};

// Middleware to refresh token if it's about to expire
const refreshTokenIfNeeded = async (req, res, next) => {
  try {
    if (!req.token) {
      return next();
    }

    const tokenInfo = jwtService.getTokenInfo(req.token);
    
    if (tokenInfo && tokenInfo.timeToExpiry < 300) { // Less than 5 minutes
      const newTokens = jwtService.generateTokenPair({
        userId: req.user._id,
        email: req.user.email,
        role: req.user.role,
        isEmailVerified: req.user.isEmailVerified,
        isPhoneVerified: req.user.isPhoneVerified
      });

      // Add new tokens to response headers
      res.set('X-New-Access-Token', newTokens.accessToken);
      res.set('X-New-Refresh-Token', newTokens.refreshToken);
      res.set('X-Token-Refreshed', 'true');
    }

    next();
  } catch (error) {
    // Don't fail the request if token refresh fails
    next();
  }
};

// Rate limiting middleware for authentication endpoints
const authRateLimit = (maxAttempts = 5, windowMs = 15 * 60 * 1000) => {
  const attempts = new Map();

  return (req, res, next) => {
    const key = req.ip + ':' + (req.body.email || req.body.phone || 'unknown');
    const now = Date.now();
    
    // Clean up old entries
    for (const [k, v] of attempts.entries()) {
      if (now - v.firstAttempt > windowMs) {
        attempts.delete(k);
      }
    }

    const userAttempts = attempts.get(key);
    
    if (!userAttempts) {
      attempts.set(key, { count: 1, firstAttempt: now });
      return next();
    }

    if (userAttempts.count >= maxAttempts) {
      const timeLeft = Math.ceil((windowMs - (now - userAttempts.firstAttempt)) / 1000 / 60);
      
      return res.status(429).json({
        success: false,
        message: `Too many authentication attempts. Please try again in ${timeLeft} minutes.`,
        code: 'RATE_LIMIT_EXCEEDED',
        retryAfter: timeLeft * 60
      });
    }

    userAttempts.count++;
    next();
  };
};

module.exports = {
  authenticate,
  requireAdmin,
  requireEmailVerification,
  requirePhoneVerification,
  requireFullVerification,
  optionalAuth,
  refreshTokenIfNeeded,
  authRateLimit
};
