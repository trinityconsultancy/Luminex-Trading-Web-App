const jwt = require('jsonwebtoken');
const crypto = require('crypto');

class JWTService {
  constructor() {
    this.accessTokenSecret = process.env.JWT_SECRET || 'your-super-secret-jwt-key';
    this.refreshTokenSecret = process.env.JWT_REFRESH_SECRET || 'your-refresh-token-secret';
    this.accessTokenExpiry = process.env.JWT_EXPIRES_IN || '15m';
    this.refreshTokenExpiry = process.env.JWT_REFRESH_EXPIRES_IN || '7d';
  }

  // Generate access token
  generateAccessToken(payload) {
    try {
      const tokenPayload = {
        userId: payload.userId,
        email: payload.email,
        role: payload.role || 'user',
        isEmailVerified: payload.isEmailVerified || false,
        isPhoneVerified: payload.isPhoneVerified || false,
        type: 'access'
      };

      return jwt.sign(tokenPayload, this.accessTokenSecret, {
        expiresIn: this.accessTokenExpiry,
        issuer: 'luminex-trading',
        audience: 'luminex-users'
      });
    } catch (error) {
      throw new Error(`Failed to generate access token: ${error.message}`);
    }
  }

  // Generate refresh token
  generateRefreshToken(payload) {
    try {
      const tokenPayload = {
        userId: payload.userId,
        email: payload.email,
        tokenId: crypto.randomBytes(16).toString('hex'),
        type: 'refresh'
      };

      return jwt.sign(tokenPayload, this.refreshTokenSecret, {
        expiresIn: this.refreshTokenExpiry,
        issuer: 'luminex-trading',
        audience: 'luminex-users'
      });
    } catch (error) {
      throw new Error(`Failed to generate refresh token: ${error.message}`);
    }
  }

  // Generate both tokens
  generateTokenPair(payload) {
    try {
      const accessToken = this.generateAccessToken(payload);
      const refreshToken = this.generateRefreshToken(payload);

      return {
        accessToken,
        refreshToken,
        tokenType: 'Bearer',
        expiresIn: this.getExpiryTime(this.accessTokenExpiry)
      };
    } catch (error) {
      throw new Error(`Failed to generate token pair: ${error.message}`);
    }
  }

  // Verify access token
  verifyAccessToken(token) {
    try {
      const decoded = jwt.verify(token, this.accessTokenSecret, {
        issuer: 'luminex-trading',
        audience: 'luminex-users'
      });

      if (decoded.type !== 'access') {
        throw new Error('Invalid token type');
      }

      return {
        success: true,
        payload: decoded
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        expired: error.name === 'TokenExpiredError'
      };
    }
  }

  // Verify refresh token
  verifyRefreshToken(token) {
    try {
      const decoded = jwt.verify(token, this.refreshTokenSecret, {
        issuer: 'luminex-trading',
        audience: 'luminex-users'
      });

      if (decoded.type !== 'refresh') {
        throw new Error('Invalid token type');
      }

      return {
        success: true,
        payload: decoded
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        expired: error.name === 'TokenExpiredError'
      };
    }
  }

  // Decode token without verification (for debugging)
  decodeToken(token) {
    try {
      return jwt.decode(token, { complete: true });
    } catch (error) {
      return null;
    }
  }

  // Get token expiry time in seconds
  getExpiryTime(expiry) {
    const timeUnits = {
      's': 1,
      'm': 60,
      'h': 3600,
      'd': 86400
    };

    const match = expiry.match(/^(\d+)([smhd])$/);
    if (!match) {
      return 900; // Default 15 minutes
    }

    const [, value, unit] = match;
    return parseInt(value) * timeUnits[unit];
  }

  // Extract token from Authorization header
  extractTokenFromHeader(authHeader) {
    if (!authHeader) {
      return null;
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return null;
    }

    return parts[1];
  }

  // Generate password reset token
  generatePasswordResetToken(payload) {
    try {
      const tokenPayload = {
        userId: payload.userId,
        email: payload.email,
        purpose: 'password_reset',
        type: 'reset'
      };

      return jwt.sign(tokenPayload, this.accessTokenSecret, {
        expiresIn: '1h', // Password reset tokens expire in 1 hour
        issuer: 'luminex-trading',
        audience: 'luminex-users'
      });
    } catch (error) {
      throw new Error(`Failed to generate password reset token: ${error.message}`);
    }
  }

  // Verify password reset token
  verifyPasswordResetToken(token) {
    try {
      const decoded = jwt.verify(token, this.accessTokenSecret, {
        issuer: 'luminex-trading',
        audience: 'luminex-users'
      });

      if (decoded.type !== 'reset' || decoded.purpose !== 'password_reset') {
        throw new Error('Invalid token type or purpose');
      }

      return {
        success: true,
        payload: decoded
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        expired: error.name === 'TokenExpiredError'
      };
    }
  }

  // Generate email verification token
  generateEmailVerificationToken(payload) {
    try {
      const tokenPayload = {
        userId: payload.userId,
        email: payload.email,
        purpose: 'email_verification',
        type: 'verification'
      };

      return jwt.sign(tokenPayload, this.accessTokenSecret, {
        expiresIn: '24h', // Email verification tokens expire in 24 hours
        issuer: 'luminex-trading',
        audience: 'luminex-users'
      });
    } catch (error) {
      throw new Error(`Failed to generate email verification token: ${error.message}`);
    }
  }

  // Verify email verification token
  verifyEmailVerificationToken(token) {
    try {
      const decoded = jwt.verify(token, this.accessTokenSecret, {
        issuer: 'luminex-trading',
        audience: 'luminex-users'
      });

      if (decoded.type !== 'verification' || decoded.purpose !== 'email_verification') {
        throw new Error('Invalid token type or purpose');
      }

      return {
        success: true,
        payload: decoded
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        expired: error.name === 'TokenExpiredError'
      };
    }
  }

  // Get token info (without verification)
  getTokenInfo(token) {
    try {
      const decoded = this.decodeToken(token);
      if (!decoded) {
        return null;
      }

      const now = Math.floor(Date.now() / 1000);
      const isExpired = decoded.payload.exp < now;
      const timeToExpiry = decoded.payload.exp - now;

      return {
        header: decoded.header,
        payload: decoded.payload,
        isExpired,
        timeToExpiry: Math.max(0, timeToExpiry),
        expiresAt: new Date(decoded.payload.exp * 1000),
        issuedAt: new Date(decoded.payload.iat * 1000)
      };
    } catch (error) {
      return null;
    }
  }
}

module.exports = new JWTService();
