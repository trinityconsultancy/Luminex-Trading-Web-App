const twilio = require('twilio');

class SMSService {
  constructor() {
    this.client = null;
    this.fromNumber = process.env.TWILIO_PHONE_NUMBER;
    this.initializeClient();
  }

  initializeClient() {
    try {
      if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
        console.warn('⚠️  Twilio credentials not found. SMS service will not be available.');
        return;
      }

      // Validate Twilio Account SID format
      if (!process.env.TWILIO_ACCOUNT_SID.startsWith('AC')) {
        console.warn('⚠️  Invalid Twilio Account SID format. Must start with "AC". SMS service will not be available.');
        return;
      }

      this.client = twilio(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_AUTH_TOKEN
      );

      console.log('✅ SMS service (Twilio) initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize Twilio client:', error.message);
    }
  }

  async sendOTP(phoneNumber, otp, purpose = 'verification') {
    try {
      if (!this.client) {
        throw new Error('SMS service not initialized. Please check Twilio credentials.');
      }

      if (!this.fromNumber) {
        throw new Error('Twilio phone number not configured');
      }

      // Format phone number (ensure it starts with +)
      const formattedPhone = this.formatPhoneNumber(phoneNumber);
      
      // Generate message based on purpose
      const message = this.generateOTPMessage(otp, purpose);

      const result = await this.client.messages.create({
        body: message,
        from: this.fromNumber,
        to: formattedPhone
      });

      console.log(`OTP SMS sent successfully to ${formattedPhone}:`, result.sid);

      return {
        success: true,
        messageSid: result.sid,
        message: 'OTP sent successfully to your phone',
        phoneNumber: formattedPhone
      };
    } catch (error) {
      console.error('Failed to send OTP SMS:', error);

      // Handle specific Twilio errors
      let errorMessage = 'Failed to send OTP SMS';
      
      if (error.code === 21211) {
        errorMessage = 'Invalid phone number format';
      } else if (error.code === 21408) {
        errorMessage = 'Permission to send SMS to this number denied';
      } else if (error.code === 21610) {
        errorMessage = 'Phone number is blacklisted';
      } else if (error.code === 21614) {
        errorMessage = 'Phone number is not a valid mobile number';
      }

      return {
        success: false,
        error: error.message,
        errorCode: error.code,
        message: errorMessage
      };
    }
  }

  async sendWelcomeSMS(phoneNumber, name) {
    try {
      if (!this.client) {
        throw new Error('SMS service not initialized. Please check Twilio credentials.');
      }

      const formattedPhone = this.formatPhoneNumber(phoneNumber);
      const message = `Welcome to Luminex Trading, ${name}! 🚀 Your account is ready. Start virtual trading with $100,000. Download our app or visit our website to begin your trading journey!`;

      const result = await this.client.messages.create({
        body: message,
        from: this.fromNumber,
        to: formattedPhone
      });

      console.log(`Welcome SMS sent successfully to ${formattedPhone}:`, result.sid);

      return {
        success: true,
        messageSid: result.sid,
        message: 'Welcome SMS sent successfully'
      };
    } catch (error) {
      console.error('Failed to send welcome SMS:', error);

      return {
        success: false,
        error: error.message,
        message: 'Failed to send welcome SMS'
      };
    }
  }

  formatPhoneNumber(phoneNumber) {
    // Remove all non-digit characters
    let cleaned = phoneNumber.replace(/\D/g, '');
    
    // If number doesn't start with country code, assume it's Indian (+91)
    if (!cleaned.startsWith('91') && cleaned.length === 10) {
      cleaned = '91' + cleaned;
    }
    
    // Add + prefix if not present
    if (!cleaned.startsWith('+')) {
      cleaned = '+' + cleaned;
    }
    
    return cleaned;
  }

  generateOTPMessage(otp, purpose) {
    const purposeText = {
      'registration': 'complete your Luminex Trading registration',
      'login': 'sign in to your Luminex Trading account',
      'password_reset': 'reset your Luminex Trading password',
      'phone_verification': 'verify your phone number',
      'verification': 'verify your Luminex Trading account'
    };

    const actionText = purposeText[purpose] || 'verify your account';
    const expiryMinutes = process.env.OTP_EXPIRY_MINUTES || 10;

    return `Your Luminex Trading verification code is: ${otp}

Use this code to ${actionText}.

⏰ Expires in ${expiryMinutes} minutes
🔒 Never share this code with anyone

- Luminex Trading Team`;
  }

  async getMessageStatus(messageSid) {
    try {
      if (!this.client) {
        throw new Error('SMS service not initialized');
      }

      const message = await this.client.messages(messageSid).fetch();
      
      return {
        success: true,
        status: message.status,
        errorCode: message.errorCode,
        errorMessage: message.errorMessage,
        dateCreated: message.dateCreated,
        dateSent: message.dateSent,
        dateUpdated: message.dateUpdated
      };
    } catch (error) {
      console.error('Failed to get message status:', error);
      
      return {
        success: false,
        error: error.message
      };
    }
  }

  async validatePhoneNumber(phoneNumber) {
    try {
      if (!this.client) {
        return {
          success: false,
          message: 'SMS service not initialized'
        };
      }

      const formattedPhone = this.formatPhoneNumber(phoneNumber);
      
      // Use Twilio Lookup API to validate phone number
      const phoneNumberInfo = await this.client.lookups.v1
        .phoneNumbers(formattedPhone)
        .fetch();

      return {
        success: true,
        isValid: true,
        phoneNumber: phoneNumberInfo.phoneNumber,
        nationalFormat: phoneNumberInfo.nationalFormat,
        countryCode: phoneNumberInfo.countryCode
      };
    } catch (error) {
      if (error.code === 20404) {
        return {
          success: true,
          isValid: false,
          message: 'Phone number is not valid'
        };
      }

      return {
        success: false,
        error: error.message,
        message: 'Failed to validate phone number'
      };
    }
  }

  // Method to check if SMS service is available
  isAvailable() {
    return !!(this.client && this.fromNumber);
  }

  // Method to get account balance (for monitoring)
  async getAccountBalance() {
    try {
      if (!this.client) {
        throw new Error('SMS service not initialized');
      }

      const account = await this.client.api.accounts(process.env.TWILIO_ACCOUNT_SID).fetch();
      
      return {
        success: true,
        balance: account.balance,
        currency: 'USD'
      };
    } catch (error) {
      console.error('Failed to get Twilio account balance:', error);
      
      return {
        success: false,
        error: error.message
      };
    }
  }
}

module.exports = new SMSService();
