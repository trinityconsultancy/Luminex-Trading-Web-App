# Luminex Trading App

**Virtual Stock Trading Platform - Final Year Project Demo**

## Overview

Luminex is a demo trading application built as a final year project MVP. It features OTP-based authentication, real-time mock stock prices, and a modern trading interface.

## Tech Stack

- **Frontend**: Next.js 15 + TypeScript + Tailwind CSS + shadcn/ui
- **Backend**: Express.js + MongoDB (Mongoose)
- **Authentication**: OTP-based email verification with JWT tokens
- **Features**: Mock stock trading, portfolio management, real-time price updates

## Quick Start

### Option 1: Run Both Together (Recommended) 🚀

**Windows (Command Prompt)**:
```bash
start-dev.bat
```

**Windows (PowerShell)**:
```powershell
.\start-dev.ps1
```

**Linux/Mac (Bash)**:
```bash
chmod +x start-dev.sh
./start-dev.sh
```

**Or using pnpm**:
```bash
pnpm dev:all
```

This will start:
- Backend on http://localhost:5000
- Frontend on http://localhost:3000

### Option 2: Manual Start

**1. Start Backend**:
```bash
cd backend
npm install
npm run setup  # One-time setup (creates .env, tests services)
npm run dev    # Runs on http://localhost:5000
```

**2. Start Frontend** (in new terminal):
```bash
pnpm install
pnpm dev       # Runs on http://localhost:3000
```

## Project Structure

```
├── app/              # Next.js pages (signup, login, dashboard, etc.)
├── components/       # React components (UI, charts, modals)
├── contexts/         # React Context (auth, price data)
├── lib/              # API helpers, utilities
├── backend/          # Express server, MongoDB models, routes
└── public/           # Static assets
```

## Features

✅ Email OTP authentication  
✅ Real-time stock price simulation  
✅ Portfolio & holdings management  
✅ Mock trading (buy/sell stocks)  
✅ Funds management  
✅ Responsive design (mobile + desktop)  

## Environment Variables

### Frontend (.env.local)
```bash
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### Backend (.env)
```bash
MONGODB_URI=mongodb://127.0.0.1:27017/luminex-trading
JWT_SECRET=your-secret-here
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

## Documentation

- **[AUTH_FLOW.md](./AUTH_FLOW.md)** - Authentication flow documentation
- **[VALIDATION_RULES.md](./VALIDATION_RULES.md)** - Form validation rules
- **[.github/copilot-instructions.md](./.github/copilot-instructions.md)** - AI agent guidance

## License

Educational project - Final Year Demo

