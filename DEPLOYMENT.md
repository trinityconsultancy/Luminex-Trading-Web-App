# Luminex Trading App - Deployment Guide

## 🚀 Deployment Options

This guide covers deploying both **Frontend (Next.js)** and **Backend (Express + MongoDB)**.

---

## 📦 Prerequisites

- Git repository pushed to GitHub
- MongoDB Atlas account (for production database)
- Vercel account (for frontend)
- Render/Railway/Heroku account (for backend)

---

## 🎨 Frontend Deployment (Vercel)

### Option 1: Deploy via Vercel Dashboard

1. **Push to GitHub**:
   ```bash
   git push origin main
   ```

2. **Import to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Select root directory (not `/backend`)

3. **Configure Environment Variables**:
   Add in Vercel dashboard:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com/api
   ```

4. **Deploy**:
   - Click "Deploy"
   - Wait for build to complete
   - Get your URL: `https://your-app.vercel.app`

### Option 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

---

## 🔧 Backend Deployment (Render)

### 1. Prepare MongoDB Atlas

1. **Create MongoDB Atlas Cluster**:
   - Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
   - Create free cluster
   - Add database user
   - Whitelist IP: `0.0.0.0/0` (allow from anywhere)
   - Get connection string

2. **Connection String Format**:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/luminex?retryWrites=true&w=majority
   ```

### 2. Deploy to Render

1. **Create New Web Service**:
   - Go to [render.com](https://render.com)
   - Click "New +" → "Web Service"
   - Connect GitHub repository

2. **Configure Service**:
   - **Name**: `luminex-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

3. **Environment Variables**:
   Add in Render dashboard:
   ```
   MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/luminex
   JWT_SECRET=your-super-secret-key-min-32-characters-long
   JWT_REFRESH_SECRET=your-refresh-secret-key-also-32-chars
   NODE_ENV=production
   PORT=5000
   
   # Optional (for OTP emails)
   EMAIL_USER=your-gmail@gmail.com
   EMAIL_PASS=your-gmail-app-password
   
   # Optional (for SMS - leave empty if not using)
   TWILIO_ACCOUNT_SID=
   TWILIO_AUTH_TOKEN=
   TWILIO_PHONE_NUMBER=
   ```

4. **Deploy**:
   - Click "Create Web Service"
   - Wait for deployment
   - Get your URL: `https://luminex-backend.onrender.com`

### Alternative: Deploy to Railway

1. **Create New Project**:
   - Go to [railway.app](https://railway.app)
   - Click "New Project"
   - Select "Deploy from GitHub repo"

2. **Configure**:
   - Root directory: `/backend`
   - Add same environment variables as above
   - Railway auto-detects Node.js

3. **Deploy**: Automatic on push

---

## 🔗 Connect Frontend to Backend

After deploying backend, update frontend environment variable:

### In Vercel Dashboard:
1. Go to Project Settings → Environment Variables
2. Update `NEXT_PUBLIC_API_URL`:
   ```
   https://luminex-backend.onrender.com/api
   ```
3. Redeploy frontend

---

## ✅ Post-Deployment Checklist

### Frontend:
- [ ] Deployed to Vercel
- [ ] Environment variable `NEXT_PUBLIC_API_URL` set
- [ ] Build completed successfully
- [ ] Site is accessible

### Backend:
- [ ] Deployed to Render/Railway
- [ ] MongoDB Atlas connected
- [ ] Environment variables configured
- [ ] Health check works: `https://your-backend.onrender.com/health`
- [ ] CORS configured for frontend URL

### Integration:
- [ ] Frontend can call backend API
- [ ] User registration works
- [ ] Login with OTP works
- [ ] Auth token storage works

---

## 🧪 Testing Deployment

### 1. Test Backend Health

```bash
curl https://your-backend.onrender.com/health
```

Expected response:
```json
{
  "status": "OK",
  "timestamp": "2025-01-15T10:30:00.000Z",
  "uptime": 123.45,
  "environment": "production"
}
```

### 2. Test Frontend

Visit: `https://your-app.vercel.app`

- [ ] Landing page loads
- [ ] Can navigate to /signup
- [ ] Can navigate to /login
- [ ] Signup sends OTP (check backend logs)
- [ ] Login works

---

## 🔐 Security Notes

### Backend `.env` (Production):
```env
# Use strong secrets (32+ characters)
JWT_SECRET=use-a-very-long-random-string-here-minimum-32-chars
JWT_REFRESH_SECRET=another-different-long-random-string-32-chars

# Use MongoDB Atlas connection string
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/luminex

# Set production environment
NODE_ENV=production
```

### CORS Configuration:
Update `backend/server.js` to allow your Vercel domain:
```javascript
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'https://your-app.vercel.app'
  ],
  credentials: true
}
```

---

## 📊 Monitoring

### Vercel:
- Dashboard: Analytics tab
- Logs: Deployments → View Logs
- Performance: Speed Insights

### Render:
- Dashboard: Metrics tab
- Logs: Logs section
- Health: Shell access available

---

## 🐛 Troubleshooting

### Frontend can't reach backend:
1. Check `NEXT_PUBLIC_API_URL` is correct
2. Verify backend is running: visit `/health` endpoint
3. Check CORS headers in backend
4. Check browser console for errors

### Backend MongoDB connection fails:
1. Verify MongoDB Atlas IP whitelist includes `0.0.0.0/0`
2. Check connection string format
3. Ensure database user has correct permissions
4. Check Render/Railway logs for error details

### OTP emails not sending:
1. Verify Gmail App Password is correct
2. Check EMAIL_USER and EMAIL_PASS are set
3. Review backend logs for email service errors

---

## 🔄 Continuous Deployment

Both Vercel and Render support automatic deployments:

### Vercel (Frontend):
- Auto-deploys on push to `main` branch
- Preview deployments for PRs

### Render (Backend):
- Auto-deploys on push to `main` branch
- Manual deploy from dashboard available

---

## 💰 Cost Estimate

### Free Tier (Suitable for Demo/MVP):
- **Vercel**: Free (Hobby plan) - Unlimited deployments
- **Render**: Free - 750 hours/month (enough for 1 service)
- **MongoDB Atlas**: Free - 512MB storage
- **Total**: $0/month

### Production Tier:
- **Vercel Pro**: $20/month
- **Render Starter**: $7/month
- **MongoDB Atlas M10**: $0.08/hour (~$57/month)
- **Total**: ~$84/month

---

## 📝 Environment Variables Reference

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=https://your-backend-url.com/api
```

### Backend (.env)
```env
# Required
MONGODB_URI=mongodb+srv://...
JWT_SECRET=min-32-characters
JWT_REFRESH_SECRET=min-32-characters
NODE_ENV=production

# Optional
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=your-gmail-app-password
TWILIO_ACCOUNT_SID=ACxxxxxxxxx
TWILIO_AUTH_TOKEN=your-token
TWILIO_PHONE_NUMBER=+1234567890
```

---

## 🎉 You're Live!

Once deployed, share your app:
- **Frontend**: `https://your-app.vercel.app`
- **Backend API**: `https://your-backend.onrender.com/api`
- **Health Check**: `https://your-backend.onrender.com/health`

For faculty presentation, use the Vercel URL!

---

## 📞 Need Help?

- Vercel Docs: https://vercel.com/docs
- Render Docs: https://render.com/docs
- MongoDB Atlas Docs: https://docs.atlas.mongodb.com/

**Good luck with your deployment! 🚀**
