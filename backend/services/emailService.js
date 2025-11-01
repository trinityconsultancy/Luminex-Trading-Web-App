const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = null;
    this.initializeTransporter();
  }

  initializeTransporter() {
    try {
      if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.warn('⚠️  Email credentials not found. Email service will not be available.');
        return;
      }

      this.transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.EMAIL_PORT) || 587,
        secure: true, // true for 465, false for other ports
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        },
        tls: {
          rejectUnauthorized: false
        }
      });

      // Verify connection configuration
      this.transporter.verify((error, success) => {
        if (error) {
          console.error('❌ Email service configuration error:', error.message);
        } else {
          console.log('✅ Email service is ready to send messages');
        }
      });
    } catch (error) {
      console.error('❌ Failed to initialize email transporter:', error.message);
    }
  }

  async sendOTP(email, otp, purpose = 'verification') {
    try {
      if (!this.transporter) {
        throw new Error('Email transporter not initialized');
      }

      const subject = this.getSubjectByPurpose(purpose);
      const htmlContent = this.generateOTPEmailTemplate(otp, purpose);

      const mailOptions = {
        from: `"Luminex Trading" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
        to: email,
        subject: subject,
        html: htmlContent,
        text: `Your Luminex Trading ${purpose} OTP is: ${otp}. This OTP will expire in ${process.env.OTP_EXPIRY_MINUTES || 10} minutes.`
      };

      const result = await this.transporter.sendMail(mailOptions);
      
      console.log(`OTP email sent successfully to ${email}:`, result.messageId);
      
      return {
        success: true,
        messageId: result.messageId,
        message: 'OTP sent successfully to your email'
      };
    } catch (error) {
      console.error('Failed to send OTP email:', error);
      
      return {
        success: false,
        error: error.message,
        message: 'Failed to send OTP email'
      };
    }
  }

  async sendWelcomeEmail(email, name) {
    try {
      if (!this.transporter) {
        throw new Error('Email transporter not initialized');
      }

      const htmlContent = this.generateWelcomeEmailTemplate(name);

      const mailOptions = {
        from: `"Luminex Trading" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Welcome to Luminex Trading Platform! 🚀',
        html: htmlContent,
        text: `Welcome to Luminex Trading, ${name}! Your account has been successfully created. Start your virtual trading journey today.`
      };

      const result = await this.transporter.sendMail(mailOptions);
      
      console.log(`Welcome email sent successfully to ${email}:`, result.messageId);
      
      return {
        success: true,
        messageId: result.messageId,
        message: 'Welcome email sent successfully'
      };
    } catch (error) {
      console.error('Failed to send welcome email:', error);
      
      return {
        success: false,
        error: error.message,
        message: 'Failed to send welcome email'
      };
    }
  }

  getSubjectByPurpose(purpose) {
    const subjects = {
      'registration': 'Complete Your Luminex Trading Registration',
      'login': 'Your Luminex Trading Login Verification Code',
      'password_reset': 'Reset Your Luminex Trading Password',
      'email_verification': 'Verify Your Email Address - Luminex Trading',
      'verification': 'Your Luminex Trading Verification Code'
    };

    return subjects[purpose] || 'Your Luminex Trading Verification Code';
  }

  generateOTPEmailTemplate(otp, purpose) {
    const purposeText = {
      'registration': 'complete your registration',
      'login': 'sign in to your account',
      'password_reset': 'reset your password',
      'email_verification': 'verify your email address',
      'verification': 'verify your account'
    };

    const actionText = purposeText[purpose] || 'verify your account';

    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Luminex Trading - OTP Verification</title>
        <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5; }
            .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center; }
            .logo { color: #ffffff; font-size: 28px; font-weight: bold; margin-bottom: 10px; }
            .header-text { color: #ffffff; font-size: 16px; opacity: 0.9; }
            .content { padding: 40px 30px; }
            .otp-container { background-color: #f8f9ff; border: 2px dashed #667eea; border-radius: 12px; padding: 30px; text-align: center; margin: 30px 0; }
            .otp-code { font-size: 36px; font-weight: bold; color: #667eea; letter-spacing: 8px; margin: 20px 0; font-family: 'Courier New', monospace; }
            .otp-text { color: #666; font-size: 14px; margin-bottom: 20px; }
            .warning { background-color: #fff3cd; border: 1px solid #ffeaa7; border-radius: 8px; padding: 15px; margin: 20px 0; color: #856404; }
            .footer { background-color: #f8f9fa; padding: 30px; text-align: center; color: #666; font-size: 14px; }
            .button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 20px 0; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">📈 Luminex Trading</div>
                <div class="header-text">Your Verification Code</div>
            </div>
            
            <div class="content">
                <h2 style="color: #333; margin-bottom: 20px;">Verification Required</h2>
                <p style="color: #666; line-height: 1.6;">
                    We received a request to ${actionText}. Please use the verification code below to proceed:
                </p>
                
                <div class="otp-container">
                    <div class="otp-text">Your verification code is:</div>
                    <div class="otp-code">${otp}</div>
                    <div class="otp-text">This code will expire in ${process.env.OTP_EXPIRY_MINUTES || 10} minutes</div>
                </div>
                
                <div class="warning">
                    <strong>Security Notice:</strong> Never share this code with anyone. Luminex Trading will never ask for your verification code via phone or email.
                </div>
                
                <p style="color: #666; line-height: 1.6;">
                    If you didn't request this verification code, please ignore this email or contact our support team if you have concerns.
                </p>
            </div>
            
            <div class="footer">
                <p>© 2024 Luminex Trading Platform. All rights reserved.</p>
                <p>This is an automated message, please do not reply to this email.</p>
            </div>
        </div>
    </body>
    </html>
    `;
  }

  generateWelcomeEmailTemplate(name) {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Luminex Trading</title>
        <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5; }
            .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center; }
            .logo { color: #ffffff; font-size: 28px; font-weight: bold; margin-bottom: 10px; }
            .header-text { color: #ffffff; font-size: 18px; opacity: 0.9; }
            .content { padding: 40px 30px; }
            .welcome-box { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); border-radius: 12px; padding: 30px; text-align: center; margin: 30px 0; color: white; }
            .feature { display: flex; align-items: center; margin: 20px 0; padding: 15px; background-color: #f8f9ff; border-radius: 8px; }
            .feature-icon { font-size: 24px; margin-right: 15px; }
            .footer { background-color: #f8f9fa; padding: 30px; text-align: center; color: #666; font-size: 14px; }
            .button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; padding: 15px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 20px 0; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">📈 Luminex Trading</div>
                <div class="header-text">Welcome to the Future of Trading</div>
            </div>
            
            <div class="content">
                <div class="welcome-box">
                    <h2 style="margin: 0 0 15px 0;">Welcome, ${name}! 🎉</h2>
                    <p style="margin: 0; opacity: 0.9;">Your trading journey starts here with $100,000 virtual money</p>
                </div>
                
                <h3 style="color: #333; margin: 30px 0 20px 0;">What you can do now:</h3>
                
                <div class="feature">
                    <div class="feature-icon">💰</div>
                    <div>
                        <strong>Virtual Trading</strong><br>
                        <span style="color: #666;">Practice with $100,000 virtual money</span>
                    </div>
                </div>
                
                <div class="feature">
                    <div class="feature-icon">📊</div>
                    <div>
                        <strong>Real-time Market Data</strong><br>
                        <span style="color: #666;">Access live stock prices and charts</span>
                    </div>
                </div>
                
                <div class="feature">
                    <div class="feature-icon">📈</div>
                    <div>
                        <strong>Portfolio Tracking</strong><br>
                        <span style="color: #666;">Monitor your investments and performance</span>
                    </div>
                </div>
                
                <div class="feature">
                    <div class="feature-icon">🎯</div>
                    <div>
                        <strong>Watchlists</strong><br>
                        <span style="color: #666;">Track your favorite stocks</span>
                    </div>
                </div>
                
                <div style="text-align: center; margin: 40px 0;">
                    <a href="${process.env.CORS_ORIGIN || 'http://localhost:3000'}/dashboard" class="button">
                        Start Trading Now 🚀
                    </a>
                </div>
                
                <p style="color: #666; line-height: 1.6; text-align: center;">
                    Need help getting started? Check out our <a href="#" style="color: #667eea;">trading guides</a> or contact our support team.
                </p>
            </div>
            
            <div class="footer">
                <p>© 2024 Luminex Trading Platform. All rights reserved.</p>
                <p>Happy Trading! 📈</p>
            </div>
        </div>
    </body>
    </html>
    `;
  }
}

module.exports = new EmailService();
