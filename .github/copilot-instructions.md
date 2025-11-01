# Luminex Trading App - AI Agent Instructions

**Final Year Project - Demo Trading Platform (MVP)**

This is a **demo trading app** with OTP-based authentication. The frontend (Next.js) connects to a real backend (Express + MongoDB) for user registration and login.

## Quick Start (Development)

```bash
# 1. Start backend (required for auth)
cd backend
npm install
npm run setup              # One-time: creates .env, tests services
npm run dev                # Runs on http://localhost:5000

# 2. Start frontend (in new terminal)
pnpm install
pnpm dev                   # Runs on http://localhost:3000
```

**Important**: Backend MUST be running for signup/login to work. Stock data and trading features use mock data.

## Project Architecture

**Connected Full-Stack App**
- **Frontend**: Next.js 15 + TypeScript + Tailwind + shadcn/ui
- **Backend**: Express.js + MongoDB (Mongoose) on port 5000
- **Auth Flow**: OTP-based (email + SMS verification)
- **Mock Data**: Stock prices, holdings, trades (client-side only)
- **Real Data**: User authentication, registration (backend API)

## Authentication Flow (OTP-Based)

### Signup Flow (2 Steps)
1. **Register** (`POST /api/auth/register`) → User fills form → Backend sends OTP to email
2. **Verify Email** (`POST /api/auth/verify-otp`) → User enters email OTP → Account activated + JWT tokens returned

### Login Flow (2 Steps)
1. **Login** (`POST /api/auth/login`) → User enters email/phone + password → Backend sends OTP to email
2. **Verify OTP** (`POST /api/auth/login-verify`) → User enters OTP → JWT tokens returned

**See it in action**:
- Signup page: `app/signup/page.tsx` (2-step with OTP input for email only)
- Login page: `app/login/page.tsx` (credentials → OTP verification)
- Auth context: `contexts/auth-context.tsx` (calls backend API via `lib/api.ts`)

## Key Files to Understand

### Backend Integration
- `lib/api.ts` - API helper functions, token management, all `/api/auth/*` calls
- `contexts/auth-context.tsx` - Auth state using backend API (register, login, verifyOTP, resendOTP)
- Backend auth: `backend/routes/auth.js` (complete OTP flow with rate limiting, **email-only for MVP**)
- Backend models: `backend/models/User.js`, `backend/models/OTP.js`

### UI Components
- `components/otp-input.tsx` - 6-digit OTP input component (auto-focus, paste support)
- `components/ui/*` - shadcn/ui components (Radix + Tailwind)
- `app/signup/page.tsx`, `app/login/page.tsx` - 2-step auth pages (email OTP only)

### Mock Data (Still Client-Side)
- `contexts/price-context.tsx` - Fake stock prices every 3 seconds
- `app/dashboard/page.tsx` - Mock holdings, watchlist, portfolio

## Environment Setup

### Frontend (.env.local)
```bash
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### Backend (.env)
```bash
MONGODB_URI=mongodb://localhost:27017/luminex
JWT_SECRET=your-secret-here
JWT_REFRESH_SECRET=your-refresh-secret
# Optional for OTP emails/SMS:
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=your-app-password
TWILIO_ACCOUNT_SID=your-sid
TWILIO_AUTH_TOKEN=your-token
TWILIO_PHONE_NUMBER=+1234567890
```

Run `cd backend && npm run setup` to create `.env` and test services.

## Backend Requirements

**Must Install & Run**:
- MongoDB (local or Atlas cloud)
- Node.js 16+

**Optional** (for OTP sending - app works without):
- Gmail App Password (for email OTPs)

**Note**: Backend validates everything but can't send actual OTPs without email configured. Phone verification is disabled for MVP simplicity. Use `backend/test-api.http` to test endpoints directly.

## Common Tasks

### Adding New Mock Stocks
Edit `contexts/price-context.tsx`:
```typescript
const TOP_STOCKS = ["RELIANCE", "TCS", "YOUR_STOCK"]
const basePrices = { YOUR_STOCK: 1500.0 }
```

### Testing Auth Flow
1. Start backend: `cd backend && npm run dev`
2. Start frontend: `pnpm dev`
3. Go to http://localhost:3000/signup
4. Fill form → Backend sends email OTP (check console logs if email not configured)
5. Enter 6-digit code to complete registration

### Debugging API Calls
- Check browser console for API errors
- Backend logs show all requests/errors
- Use `backend/test-api.http` (VS Code REST Client) to test endpoints manually

## Code Conventions

- **TypeScript**: Strict mode, use `type` over `interface`
- **Client Components**: Add `"use client"` when using hooks/state
- **API Calls**: Use `lib/api.ts` helpers (handles tokens, errors)
- **Error Handling**: Show user-friendly messages in `<Alert>` components
- **Styling**: Tailwind classes with `cn()` utility for conditional styles

## Deployment Notes

**Frontend**: Vercel (set `NEXT_PUBLIC_API_URL` to backend URL)  
**Backend**: Deploy to Render/Railway/Heroku (set MongoDB Atlas URI)
