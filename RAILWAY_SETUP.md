# Railway Setup - Quick Guide

## What You Need to Do (3 Steps)

### Step 1: Add Environment Variables
Go to: https://railway.app/dashboard

1. Find your project
2. Click on your service
3. Click **"Variables"** tab
4. Click **"+ New Variable"** for each:

```
NODE_ENV=production
JWT_SECRET=aisai-jwt-secret-2026
ANTHROPIC_API_KEY=sk-ant-your-real-key-here
```

**IMPORTANT:** You must replace `sk-ant-your-real-key-here` with your actual Anthropic API key!

### Step 2: Add PostgreSQL Database (if not already added)

1. In your Railway project, click **"+ New"**
2. Select **"Database"**
3. Choose **"PostgreSQL"**
4. Railway automatically creates `DATABASE_URL` variable

### Step 3: Wait for Auto-Deploy

Railway will automatically deploy when it detects the GitHub push. Check the **"Deployments"** tab.

## After Deployment Succeeds

Run this command once in Railway's shell:
```bash
npm run db:push
```

To open Railway shell:
- Click your service → "..." menu → "Shell"
- Or use the deployment console

## Test Your App

After deployment, visit:
```
https://your-app-name.up.railway.app/register
```

Fill out the registration form and click submit. It should work!

## Troubleshooting

### Build Failed?
Check that all environment variables are set correctly.

### 404 Errors Still?
Make sure you ran `npm run db:push` after deployment.

### Can't connect to database?
Verify PostgreSQL service is running and `DATABASE_URL` is set.

## What Was Fixed

✅ Server now serves both API and frontend from one service
✅ Production build includes both client and server
✅ API routes work on `/api/*`
✅ React app handles all other routes
✅ Railway auto-detects build settings from `railway.json`

## Your Environment Variables Should Look Like:

```
NODE_ENV=production
DATABASE_URL=postgresql://postgres:password@host:port/database
JWT_SECRET=aisai-jwt-secret-2026
ANTHROPIC_API_KEY=sk-ant-api03-...your-actual-key...
PORT=(auto-provided by Railway, don't set this)
```

---

Need help? Check the main [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.
