# 🚀 Deployment Checklist

## ✅ Pre-Deployment Verification

### Code Quality
- [x] Production build succeeds (`pnpm build`)
- [x] No TypeScript errors
- [x] No critical lint errors
- [x] All dependencies installed

### Frontend Configuration
- [x] `vercel.json` created
- [x] `.env.example` documented
- [x] Environment variables defined
- [x] AuthGuard applied to all protected routes
- [x] GuestGuard applied to auth pages

### Backend Configuration
- [x] Backend runs independently
- [x] MongoDB connection working
- [x] OTP system functional
- [x] JWT authentication working
- [x] `.env.example` complete

---

## 🎯 Deployment Steps

### 1. Frontend (Vercel)

#### A. Prepare Repository
```bash
git add .
git commit -m "chore: prepare for deployment"
git push origin main
```

#### B. Deploy to Vercel
1. Visit [vercel.com/new](https://vercel.com/new)
2. Import repository: `luminex-Trading-app`
3. Configure:
   - Framework Preset: **Next.js**
   - Root Directory: **/** (leave default)
   - Build Command: `pnpm build`
   - Output Directory: `.next`

#### C. Add Environment Variable
```
NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com/api
```

⚠️ **Important**: Update this after deploying backend!

#### D. Deploy
- Click "Deploy"
- Wait 2-3 minutes
- Get URL: `https://luminex-trading-app.vercel.app`

---

### 2. Backend (Render)

#### A. Setup MongoDB Atlas
1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create free cluster (M0 tier)
3. Create database user:
   - Username: `luminex_admin`
   - Password: Generate strong password
4. Network Access:
   - Add IP: `0.0.0.0/0` (allow all)
5. Get connection string:
   ```
   mongodb+srv://luminex_admin:PASSWORD@cluster.mongodb.net/luminex
   ```

#### B. Deploy to Render
1. Visit [render.com](https://render.com/register)
2. Click "New +" → "Web Service"
3. Connect GitHub repository
4. Configure:
   - Name: `luminex-backend`
   - Environment: **Node**
   - Region: Choose nearest
   - Branch: `main`
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`

#### C. Add Environment Variables
```env
MONGODB_URI=mongodb+srv://luminex_admin:PASSWORD@cluster.mongodb.net/luminex
JWT_SECRET=generate-with-openssl-rand-base64-32
JWT_REFRESH_SECRET=generate-different-secret-also-32-chars
NODE_ENV=production
PORT=5000
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=your-gmail-app-password
```

**Generate JWT Secrets**:
```bash
openssl rand -base64 32
```

#### D. Deploy
- Click "Create Web Service"
- Wait 5-7 minutes (free tier can be slow)
- Get URL: `https://luminex-backend.onrender.com`

---

### 3. Connect Frontend to Backend

#### Update Vercel Environment Variable
1. Go to Vercel Dashboard → Project Settings
2. Environment Variables
3. Update `NEXT_PUBLIC_API_URL`:
   ```
   https://luminex-backend.onrender.com/api
   ```
4. Redeploy (automatic)

---

## 🧪 Post-Deployment Testing

### Backend Health Check
```bash
curl https://luminex-backend.onrender.com/health
```

Expected response:
```json
{
  "status": "OK",
  "timestamp": "2025-01-15T...",
  "uptime": 123.45,
  "environment": "production"
}
```

### Frontend Tests
- [ ] Landing page loads: `https://your-app.vercel.app`
- [ ] Navigation works (all pages)
- [ ] Signup page accessible
- [ ] Login page accessible

### Integration Tests
- [ ] Register new user (email OTP sent)
- [ ] Verify email OTP (account created)
- [ ] Login with credentials (OTP sent)
- [ ] Verify login OTP (token received)
- [ ] Dashboard shows mock data
- [ ] Logout works
- [ ] Protected routes redirect to login
- [ ] Auth redirects work correctly

---

## 📊 Monitoring & Logs

### Vercel (Frontend)
- **Deployments**: [vercel.com/dashboard](https://vercel.com/dashboard)
- **Analytics**: Built-in analytics tab
- **Logs**: Real-time function logs

### Render (Backend)
- **Dashboard**: [dashboard.render.com](https://dashboard.render.com)
- **Logs**: Click service → Logs tab
- **Shell**: Click service → Shell (for debugging)
- **Metrics**: CPU, Memory, Request count

### MongoDB Atlas
- **Clusters**: [cloud.mongodb.com](https://cloud.mongodb.com)
- **Metrics**: Database performance
- **Browse Collections**: View user data

---

## 🔐 Security Checklist

- [ ] Strong JWT secrets (32+ characters)
- [ ] MongoDB Atlas IP whitelist configured
- [ ] Environment variables not in git
- [ ] CORS configured for production domain
- [ ] HTTPS enabled (automatic on Vercel/Render)
- [ ] Rate limiting enabled on backend
- [ ] Input validation on all endpoints

---

## 💰 Cost Breakdown (Free Tier)

| Service | Plan | Cost | Limitations |
|---------|------|------|-------------|
| Vercel | Hobby | Free | 100GB bandwidth/month |
| Render | Free | Free | 750 hours/month, sleeps after 15min inactive |
| MongoDB Atlas | M0 | Free | 512MB storage |
| **Total** | | **$0/month** | Perfect for demo/MVP |

⚠️ **Note**: Render free tier sleeps after 15 minutes of inactivity. First request after sleep takes ~30 seconds.

---

## 🔄 Continuous Deployment

Both services auto-deploy on git push:

```bash
git add .
git commit -m "fix: update feature"
git push origin main
```

- **Vercel**: Auto-deploys in ~2 minutes
- **Render**: Auto-deploys in ~5-7 minutes

---

## 🐛 Common Issues & Solutions

### Issue: Frontend can't connect to backend
**Solution**:
1. Check backend is awake (visit `/health`)
2. Verify `NEXT_PUBLIC_API_URL` in Vercel
3. Check CORS headers in `backend/server.js`

### Issue: MongoDB connection failed
**Solution**:
1. Verify IP whitelist includes `0.0.0.0/0`
2. Check connection string format
3. Ensure password has no special characters (or URL-encode them)

### Issue: OTP emails not sending
**Solution**:
1. Verify Gmail App Password (not regular password)
2. Check `EMAIL_USER` and `EMAIL_PASS` in Render
3. View backend logs for error details

### Issue: Render service sleeping
**Solution**:
- Upgrade to paid tier ($7/month) for always-on
- Or use a cron job to ping every 14 minutes:
  ```bash
  */14 * * * * curl https://your-backend.onrender.com/health
  ```

---

## 📝 Environment Variables Quick Reference

### Frontend (Vercel)
```env
NEXT_PUBLIC_API_URL=https://luminex-backend.onrender.com/api
```

### Backend (Render)
```env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/luminex
JWT_SECRET=your-32-char-secret
JWT_REFRESH_SECRET=your-other-32-char-secret
NODE_ENV=production
PORT=5000
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=your-app-password
```

---

## 🎉 Deployment Complete!

Your app is now live:
- **Frontend**: `https://luminex-trading-app.vercel.app`
- **Backend**: `https://luminex-backend.onrender.com`
- **Health**: `https://luminex-backend.onrender.com/health`

Share with faculty, test thoroughly, and good luck! 🚀

---

## 📞 Support Resources

- **Vercel Docs**: https://vercel.com/docs
- **Render Docs**: https://render.com/docs
- **MongoDB Atlas**: https://docs.atlas.mongodb.com
- **Next.js Deployment**: https://nextjs.org/docs/deployment

**Project by**: Luminex Trading Team
**Version**: v1.0.0
**Date**: 2025
