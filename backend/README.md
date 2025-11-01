# Luminex Trading Backend API

A comprehensive Node.js Express backend for the Luminex Trading application with MongoDB, featuring secure authentication with OTP verification via email (Nodemailer) and SMS (Twilio).

## 🚀 Features

- **Secure Authentication System**
  - User registration with email and phone verification
  - Two-factor authentication (2FA) with OTP
  - JWT-based authentication with refresh tokens
  - Password reset functionality
  - Account lockout protection

- **OTP Verification**
  - Email OTP using Nodemailer
  - SMS OTP using Twilio
  - Configurable OTP expiry and retry limits
  - Multiple verification purposes (registration, login, password reset)

- **Security Features**
  - Rate limiting on authentication endpoints
  - Password hashing with bcrypt
  - Input validation and sanitization
  - CORS protection
  - Helmet security headers
  - Account lockout after failed attempts

- **Database**
  - MongoDB with Mongoose ODM
  - User and OTP models with proper indexing
  - Automatic cleanup of expired OTPs

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- Gmail account (for email OTP)
- Twilio account (for SMS OTP)

## 🛠️ Installation

1. **Clone and navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   # Copy environment example file
   cp env.example .env
   
   # Edit .env file with your configurations
   ```

4. **Configure Environment Variables**
   
   Edit `.env` file with your settings:

   ```env
   # Database
   MONGODB_URI=mongodb://localhost:27017/luminex-trading
   
   # JWT Secrets (Generate strong secrets)
   JWT_SECRET=your-super-secret-jwt-key-here
   JWT_REFRESH_SECRET=your-refresh-token-secret-here
   
   # Email Configuration (Gmail)
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password  # Use App Password, not regular password
   EMAIL_FROM=noreply@luminex.com
   
   # Twilio Configuration
   TWILIO_ACCOUNT_SID=your-twilio-account-sid
   TWILIO_AUTH_TOKEN=your-twilio-auth-token
   TWILIO_PHONE_NUMBER=+1234567890
   
   # Server Configuration
   PORT=5000
   NODE_ENV=development
   CORS_ORIGIN=http://localhost:3000
   ```

## 🚀 Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on `http://localhost:5000`

## 📚 API Endpoints

### Authentication Routes (`/api/auth`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/register` | Register new user (sends OTP) | Public |
| POST | `/verify-otp` | Verify OTP for various purposes | Public |
| POST | `/send-otp` | Send/resend OTP | Public |
| POST | `/login` | Login user (sends OTP) | Public |
| POST | `/login-verify` | Complete login with OTP | Public |
| POST | `/refresh-token` | Refresh access token | Public |
| POST | `/forgot-password` | Send password reset OTP | Public |
| POST | `/reset-password` | Reset password with OTP | Public |
| POST | `/logout` | Logout user | Private |
| GET | `/me` | Get current user profile | Private |
| POST | `/change-password` | Change user password | Private |

### Health Check
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | API health status |

## 🔐 Authentication Flow

### Registration Flow
1. **POST `/api/auth/register`** - Create account
   - Validates user data
   - Creates inactive user account
   - Sends OTP to both email and phone
   - Returns user ID for verification

2. **POST `/api/auth/verify-otp`** - Verify email OTP
   - Verifies email OTP
   - Marks email as verified

3. **POST `/api/auth/verify-otp`** - Verify phone OTP
   - Verifies phone OTP
   - Marks phone as verified
   - Activates account if both email and phone verified
   - Returns JWT tokens and sends welcome messages

### Login Flow
1. **POST `/api/auth/login`** - Initiate login
   - Validates credentials
   - Sends OTP to preferred method (email/SMS)
   - Returns user ID for OTP verification

2. **POST `/api/auth/login-verify`** - Complete login
   - Verifies OTP
   - Returns JWT tokens
   - Updates last login timestamp

### Password Reset Flow
1. **POST `/api/auth/forgot-password`** - Request reset
   - Sends OTP to email or phone

2. **POST `/api/auth/reset-password`** - Reset password
   - Verifies OTP
   - Updates password
   - Clears all refresh tokens

## 🛡️ Security Features

### Rate Limiting
- 10 attempts per 15 minutes for auth endpoints
- Account lockout after 5 failed login attempts
- 2-hour lockout duration

### OTP Security
- 6-digit numeric OTPs
- 10-minute expiry time
- Maximum 3 verification attempts
- Automatic cleanup of expired OTPs

### Password Security
- Minimum 8 characters
- Must contain uppercase, lowercase, number, and special character
- Hashed using bcrypt with salt rounds of 12

### JWT Tokens
- Access tokens: 15 minutes expiry
- Refresh tokens: 7 days expiry
- Automatic token refresh when near expiry

## 📧 Email Configuration (Gmail)

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password**:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
   - Use this password in `EMAIL_PASS`

## 📱 SMS Configuration (Twilio)

1. **Create Twilio Account** at [twilio.com](https://twilio.com)
2. **Get Credentials**:
   - Account SID
   - Auth Token
   - Phone Number (purchase from Twilio)
3. **Add to Environment Variables**

## 🗃️ Database Models

### User Model
```javascript
{
  name: String,
  email: String (unique),
  phone: String (unique),
  password: String (hashed),
  isEmailVerified: Boolean,
  isPhoneVerified: Boolean,
  isActive: Boolean,
  role: String (user/admin),
  profile: {
    avatar: String,
    dateOfBirth: Date,
    address: Object,
    kycStatus: String
  },
  trading: {
    accountBalance: Number (default: 100000),
    totalInvested: Number,
    totalReturns: Number,
    riskTolerance: String
  },
  loginAttempts: Number,
  lockUntil: Date,
  lastLogin: Date,
  refreshTokens: Array
}
```

### OTP Model
```javascript
{
  userId: ObjectId,
  email: String,
  phone: String,
  otp: String,
  type: String (email/sms),
  purpose: String (registration/login/password_reset/etc),
  attempts: Number,
  isUsed: Boolean,
  expiresAt: Date
}
```

## 🔧 Development

### Project Structure
```
backend/
├── models/           # Database models
├── routes/           # API routes
├── middleware/       # Custom middleware
├── services/         # External services (email, SMS)
├── utils/            # Utility functions
├── server.js         # Main server file
├── package.json      # Dependencies
└── README.md         # Documentation
```

### Adding New Routes
1. Create route file in `routes/` directory
2. Add middleware and validation
3. Import and use in `server.js`

### Environment Variables
All configuration is done via environment variables. See `env.example` for all available options.

## 🚨 Error Handling

The API uses consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "code": "ERROR_CODE",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "path": "/api/auth/login",
  "method": "POST"
}
```

## 📊 Monitoring

### Health Check
```bash
curl http://localhost:5000/health
```

### Logs
- All authentication attempts are logged
- Failed attempts include IP and user agent
- OTP sending status is logged

## 🤝 Integration with Frontend

The backend is designed to work with the Luminex Trading Next.js frontend. Update your frontend API calls to use:

```javascript
const API_BASE_URL = 'http://localhost:5000/api';
```

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For issues and questions:
1. Check the logs for detailed error messages
2. Verify environment variables are correctly set
3. Ensure MongoDB and external services are accessible
4. Check rate limiting if requests are being blocked

---

**Happy Trading! 📈**
