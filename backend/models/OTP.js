const mongoose = require('mongoose');
const crypto = require('crypto');

const otpSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  email: {
    type: String,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  otp: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['email', 'sms'],
    required: true
  },
  purpose: {
    type: String,
    enum: ['registration', 'login', 'password_reset', 'phone_verification', 'email_verification'],
    required: true
  },
  attempts: {
    type: Number,
    default: 0,
    max: 3
  },
  isUsed: {
    type: Boolean,
    default: false
  },
  expiresAt: {
    type: Date,
    required: true,
    default: function() {
      return new Date(Date.now() + (parseInt(process.env.OTP_EXPIRY_MINUTES) || 10) * 60 * 1000);
    }
  }
}, {
  timestamps: true
});

// Index for automatic document expiration
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Index for better query performance
otpSchema.index({ userId: 1, type: 1, purpose: 1 });
otpSchema.index({ email: 1, type: 1, purpose: 1 });
otpSchema.index({ phone: 1, type: 1, purpose: 1 });

// Static method to generate OTP
otpSchema.statics.generateOTP = function(length = 6) {
  const digits = '0123456789';
  let otp = '';
  
  for (let i = 0; i < length; i++) {
    otp += digits[Math.floor(Math.random() * digits.length)];
  }
  
  return otp;
};

// Static method to create and save OTP
otpSchema.statics.createOTP = async function(userId, contact, type, purpose) {
  try {
    // Delete any existing OTPs for this user, type, and purpose
    await this.deleteMany({
      userId,
      type,
      purpose,
      isUsed: false
    });

    // Generate new OTP
    const otpCode = this.generateOTP();
    
    // Create OTP document
    const otpData = {
      userId,
      otp: otpCode,
      type,
      purpose,
      expiresAt: new Date(Date.now() + (parseInt(process.env.OTP_EXPIRY_MINUTES) || 10) * 60 * 1000)
    };

    // Add contact information based on type
    if (type === 'email') {
      otpData.email = contact.toLowerCase();
    } else if (type === 'sms') {
      otpData.phone = contact;
    }

    const otpDoc = new this(otpData);
    await otpDoc.save();

    return {
      otp: otpCode,
      expiresAt: otpDoc.expiresAt,
      otpId: otpDoc._id
    };
  } catch (error) {
    throw new Error(`Failed to create OTP: ${error.message}`);
  }
};

// Static method to verify OTP
otpSchema.statics.verifyOTP = async function(userId, otpCode, type, purpose) {
  try {
    const otpDoc = await this.findOne({
      userId,
      otp: otpCode,
      type,
      purpose,
      isUsed: false,
      expiresAt: { $gt: new Date() }
    });

    if (!otpDoc) {
      return {
        success: false,
        message: 'Invalid or expired OTP'
      };
    }

    // Check attempts
    if (otpDoc.attempts >= 3) {
      return {
        success: false,
        message: 'Maximum OTP verification attempts exceeded'
      };
    }

    // Mark OTP as used
    otpDoc.isUsed = true;
    otpDoc.attempts += 1;
    await otpDoc.save();

    return {
      success: true,
      message: 'OTP verified successfully',
      otpId: otpDoc._id
    };
  } catch (error) {
    throw new Error(`Failed to verify OTP: ${error.message}`);
  }
};

// Static method to increment attempts
otpSchema.statics.incrementAttempts = async function(userId, otpCode, type, purpose) {
  try {
    const otpDoc = await this.findOne({
      userId,
      otp: otpCode,
      type,
      purpose,
      isUsed: false,
      expiresAt: { $gt: new Date() }
    });

    if (otpDoc) {
      otpDoc.attempts += 1;
      await otpDoc.save();
      
      return {
        attempts: otpDoc.attempts,
        maxAttempts: 3,
        remainingAttempts: Math.max(0, 3 - otpDoc.attempts)
      };
    }

    return null;
  } catch (error) {
    throw new Error(`Failed to increment OTP attempts: ${error.message}`);
  }
};

// Static method to clean up expired OTPs
otpSchema.statics.cleanupExpired = async function() {
  try {
    const result = await this.deleteMany({
      expiresAt: { $lt: new Date() }
    });
    
    console.log(`Cleaned up ${result.deletedCount} expired OTP records`);
    return result.deletedCount;
  } catch (error) {
    console.error('Failed to cleanup expired OTPs:', error.message);
    throw error;
  }
};

// Instance method to check if OTP is valid
otpSchema.methods.isValid = function() {
  return !this.isUsed && this.expiresAt > new Date() && this.attempts < 3;
};

// Instance method to get remaining time
otpSchema.methods.getRemainingTime = function() {
  const now = new Date();
  const remaining = this.expiresAt - now;
  
  if (remaining <= 0) {
    return 0;
  }
  
  return Math.ceil(remaining / 1000); // Return seconds
};

module.exports = mongoose.model('OTP', otpSchema);
