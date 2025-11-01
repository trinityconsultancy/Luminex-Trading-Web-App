# 🚀 Luminex Trading Backend - Quick Start Guide

Get your Luminex Trading backend up and running in 5 minutes!

## ⚡ Quick Setup

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Environment Configuration
```bash
# Copy the example environment file
copy env.example .env

# Edit .env with your settings (see configuration below)
```

### 3. Configure Environment Variables

**Minimum Required Configuration:**
```env
# Database
MONGODB_URI=mongodb://localhost:27017/luminex-trading

# JWT Secrets (Generate strong secrets!)
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random
JWT_REFRESH_SECRET=your-refresh-token-secret-here-also-long-and-random

# Server
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

**For Email OTP (Gmail):**
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password
EMAIL_FROM=noreply@luminex.com
```

**For SMS OTP (Twilio):**
```env
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_PHONE_NUMBER=+1234567890
```

### 4. Setup Database & Run
```bash
# Setup database indexes and create admin user
npm run setup

# Start development server
npm run dev
```

**Or run both in one command:**
```bash
npm run setup:dev
```

## 🎯 Quick Test

Once the server is running, test it:

```bash
# Health check
curl http://localhost:5000/health

# Should return:
{
  "status": "OK",
  "message": "Luminex Trading API is running",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "environment": "development"
}
```

## 🔑 Default Admin Account

After running setup, you'll have a default admin account:
- **Email:** `admin@luminex.com`
- **Password:** `Admin@123456`
- **Phone:** `+919999999999`

⚠️ **Change this password immediately after first login!**

## 📱 Testing the API

Use the provided `test-api.http` file with VS Code REST Client extension or any API testing tool.

### Registration Flow Test:
1. **Register:** POST `/api/auth/register`
2. **Verify Email OTP:** POST `/api/auth/verify-otp`
3. **Verify SMS OTP:** POST `/api/auth/verify-otp`
4. **Account activated!** ✅

### Login Flow Test:
1. **Login:** POST `/api/auth/login` (sends OTP)
2. **Verify OTP:** POST `/api/auth/login-verify`
3. **Get JWT tokens!** ✅

## 🛠️ Gmail Setup for Email OTP

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password:**
   - Go to [Google Account Settings](https://myaccount.google.com/)
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
   - Use this password in `EMAIL_PASS`

## 📱 Twilio Setup for SMS OTP

1. **Create Account:** [twilio.com](https://twilio.com)
2. **Get Credentials:**
   - Account SID
   - Auth Token
   - Buy a phone number
3. **Add to `.env` file**

## 🔧 Troubleshooting

### MongoDB Connection Issues
```bash
# Make sure MongoDB is running
# Windows: Start MongoDB service
# Mac: brew services start mongodb/brew/mongodb-community
# Linux: sudo systemctl start mongod
```

### Email Not Sending
- Check Gmail app password (not regular password)
- Verify EMAIL_HOST and EMAIL_PORT
- Check firewall/antivirus blocking SMTP

### SMS Not Sending
- Verify Twilio credentials
- Check phone number format (+country code)
- Ensure Twilio account has sufficient balance

### Port Already in Use
```bash
# Change PORT in .env file or kill existing process
# Windows: netstat -ano | findstr :5000
# Mac/Linux: lsof -ti:5000 | xargs kill
```

## 📊 API Endpoints Summary

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Health check |
| `/api/auth/register` | POST | Register new user |
| `/api/auth/verify-otp` | POST | Verify OTP |
| `/api/auth/send-otp` | POST | Send/resend OTP |
| `/api/auth/login` | POST | Login (step 1) |
| `/api/auth/login-verify` | POST | Login (step 2) |
| `/api/auth/me` | GET | Get user profile |
| `/api/auth/logout` | POST | Logout |
| `/api/auth/forgot-password` | POST | Password reset |
| `/api/auth/refresh-token` | POST | Refresh JWT |

## 🎉 You're Ready!

Your Luminex Trading backend is now running with:
- ✅ Secure authentication with OTP
- ✅ Email and SMS verification
- ✅ JWT token management
- ✅ Rate limiting and security
- ✅ MongoDB integration
- ✅ Admin account ready

**Next Steps:**
1. Update your frontend to use `http://localhost:5000/api`
2. Test the registration and login flows
3. Customize the email/SMS templates if needed
4. Deploy to production when ready

**Need Help?** Check the full README.md for detailed documentation.

---
**Happy Trading! 📈**
