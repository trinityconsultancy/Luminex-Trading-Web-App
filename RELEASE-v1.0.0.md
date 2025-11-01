# Luminex Trading Platform - Version 1.0.0

**Release Date**: November 1, 2025  
**Release Type**: Faculty Submission - Final Year Project  
**Status**: Stable ✅

---

## 📋 Project Overview

Luminex is a **Virtual Trading Platform** designed as a demo application for educational purposes. This project demonstrates a full-stack web application with modern technologies and best practices.

### 🎯 Purpose
- Final Year Project Demonstration
- Learning platform for stock market trading
- Showcase of full-stack development skills

---

## ✨ Features Included in v1.0.0

### 🔐 Authentication System
- **Email-based OTP Verification** (2-step process)
- **JWT Token Management** (Access + Refresh tokens)
- **Secure User Registration** with validation
- **Login System** with OTP verification
- **Session Management** with automatic token refresh

### 📊 Dashboard & Portfolio
- **Portfolio Overview** with total balance, invested amount, and P&L
- **Market Indices** display (NIFTY, SENSEX, etc.)
- **Holdings Chart** with visual representation
- **AI Trading Suggestions** (mock data)
- **Market News Feed** (mock data)
- **Privacy Mode** to hide sensitive financial data

### 📈 Trading Features
- **Real-time Stock Prices** (simulated with 3-second updates)
- **Interactive Charts** with stock data visualization
- **Holdings Management** with detailed view
- **Positions Tracking** (Intraday & Long-term)
- **Futures & Options (F&O)** interface
- **Watchlist** for monitoring favorite stocks
- **Trade Modal** for buy/sell operations (demo)

### 👤 Account Management
- **Profile Settings** with editable user information
- **Password Change** with security requirements
- **Email & Phone Update** with validation
- **Account Security** features
- **Logout Functionality** across all pages

### 🎨 User Interface
- **Responsive Design** (Mobile, Tablet, Desktop)
- **Reusable Navbar** with user dropdown menu
- **Professional Footer** with quick links
- **Custom Loading Screens** with brand animations
- **404 Error Page** with trading theme
- **Global Error Handler** with retry functionality
- **Stock Ticker** with infinite scroll animation
- **Privacy Toggle** for hiding sensitive data

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Icons**: Lucide React
- **Fonts**: Geist Sans & Geist Mono
- **State Management**: React Context API
- **Analytics**: Vercel Analytics

### Backend
- **Server**: Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **Validation**: express-validator
- **Email Service**: Nodemailer (Gmail)
- **Environment**: dotenv
- **CORS**: cors middleware

### Development Tools
- **Package Manager**: pnpm
- **Version Control**: Git & GitHub
- **Code Quality**: TypeScript strict mode
- **API Testing**: REST Client (test-api.http)

---

## 📁 Project Structure

```
luminex-Trading-app/
├── app/                      # Next.js App Router pages
│   ├── dashboard/           # Main dashboard
│   ├── charts/              # Stock charts
│   ├── holdings/            # User holdings
│   ├── positions/           # Trading positions
│   ├── fno/                 # Futures & Options
│   ├── watchlist/           # Stock watchlist
│   ├── account/             # User account settings
│   ├── login/               # Login page
│   ├── signup/              # Registration page
│   ├── error.tsx            # Global error handler
│   └── not-found.tsx        # 404 page
│
├── backend/                 # Express.js backend
│   ├── routes/             # API routes
│   ├── models/             # MongoDB models
│   ├── middleware/         # Auth & validation
│   ├── services/           # Email & SMS services
│   └── utils/              # Helper functions
│
├── components/             # Reusable React components
│   ├── ui/                # shadcn/ui components
│   ├── navbar.tsx         # Navigation bar
│   ├── footer.tsx         # Footer component
│   └── loading-screen.tsx # Loading components
│
├── contexts/              # React Context providers
│   ├── auth-context.tsx   # Authentication state
│   └── price-context.tsx  # Stock price updates
│
└── lib/                   # Utility functions
    └── api.ts             # API client
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** 16+ installed
- **MongoDB** running (local or cloud)
- **pnpm** package manager
- **Gmail account** (for OTP emails - optional)

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/dhananjaykakade/luminex-Trading-app.git
   cd luminex-Trading-app
   ```

2. **Install dependencies**
   ```bash
   # Frontend
   pnpm install
   
   # Backend
   cd backend
   npm install
   ```

3. **Configure environment variables**
   ```bash
   # Backend (.env)
   cd backend
   npm run setup  # Creates .env file
   
   # Update with your values:
   MONGODB_URI=mongodb://localhost:27017/luminex
   JWT_SECRET=your-secret-key
   EMAIL_USER=your-gmail@gmail.com  # Optional
   EMAIL_PASS=your-app-password      # Optional
   ```

4. **Start the backend**
   ```bash
   cd backend
   npm run dev  # Runs on http://localhost:5000
   ```

5. **Start the frontend** (new terminal)
   ```bash
   pnpm dev  # Runs on http://localhost:3000
   ```

6. **Access the application**
   - Open browser: http://localhost:3000
   - Sign up for a new account
   - Explore the trading platform

---

## 📖 User Guide

### Registration Process
1. Navigate to `/signup`
2. Fill in: Name, Email, Phone, Password
3. Receive OTP via email
4. Enter OTP to verify and complete registration

### Login Process
1. Navigate to `/login`
2. Enter email/phone and password
3. Receive OTP via email
4. Enter OTP to access dashboard

### Dashboard Features
- View portfolio summary
- Monitor market indices
- Check holdings and positions
- Access quick actions (Trade, Add Funds)
- Toggle privacy mode to hide amounts

### Account Settings
- Update profile information
- Change password
- Logout from account

---

## 🔒 Security Features

- **Password Requirements**: 8+ characters, uppercase, lowercase, number, special char
- **JWT Tokens**: Secure authentication with refresh mechanism
- **OTP Verification**: Email-based two-factor authentication
- **Rate Limiting**: Protection against brute force (backend)
- **Input Validation**: Real-time and server-side validation
- **CORS Protection**: Configured for specific origins
- **Password Hashing**: bcrypt with salt rounds

---

## 📊 Database Schema

### User Model
```javascript
{
  name: String (required),
  email: String (unique, required),
  phone: String (unique, required),
  password: String (hashed, required),
  isEmailVerified: Boolean,
  isPhoneVerified: Boolean,
  role: String (default: 'user'),
  createdAt: Date,
  updatedAt: Date
}
```

### OTP Model
```javascript
{
  userId: ObjectId (ref: User),
  otp: String (hashed),
  type: String (email/sms),
  purpose: String (registration/login),
  expiresAt: Date,
  attempts: Number,
  createdAt: Date
}
```

---

## ⚠️ Important Notes

### Demo Platform Disclaimer
- **Virtual Trading Only**: No real money involved
- **Educational Purpose**: For learning and demonstration
- **Mock Data**: Stock prices are simulated
- **Not Financial Advice**: Do not use for actual trading decisions

### Known Limitations
- Stock prices are randomly generated (not real market data)
- Trade execution is simulated (no actual orders placed)
- Portfolio data is stored client-side (demo purposes)
- SMS OTP is disabled (email-only verification)

---

## 🎓 Faculty Evaluation Points

### Technical Highlights
1. **Full-Stack Development**: Complete frontend and backend integration
2. **Modern Architecture**: Next.js 15 App Router, TypeScript, MongoDB
3. **Authentication**: Secure OTP-based login system
4. **Responsive Design**: Works on all devices
5. **Code Quality**: TypeScript strict mode, clean architecture
6. **State Management**: React Context API
7. **API Design**: RESTful endpoints with proper error handling
8. **Database**: MongoDB with Mongoose ODM
9. **Security**: JWT tokens, password hashing, validation
10. **User Experience**: Custom loading, error pages, animations

### Project Scope
- **Hours Invested**: 100+ hours
- **Lines of Code**: 9,000+ lines
- **Components**: 30+ reusable components
- **API Endpoints**: 10+ backend routes
- **Pages**: 15+ application pages

---

## 📞 Contact & Support

**Developer**: Dhananjay Kakade  
**Email**: [Your Email]  
**GitHub**: https://github.com/dhananjaykakade  
**Repository**: https://github.com/dhananjaykakade/luminex-Trading-app

---

## 📝 License

This project is developed as a **Final Year Project** for educational purposes.  
© 2025 Luminex Trading Platform. All rights reserved.

---

## 🙏 Acknowledgments

- **shadcn/ui** for beautiful UI components
- **Next.js** team for the amazing framework
- **MongoDB** for the database solution
- **Vercel** for hosting and analytics
- Faculty members for guidance and support

---

**Version**: 1.0.0  
**Build Date**: November 1, 2025  
**Status**: Ready for Faculty Submission ✅
