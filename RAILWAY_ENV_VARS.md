# Required Railway Environment Variables

## ❌ Deployment Crashed?

If your deployment crashed with missing environment variables, you need to add these in Railway:

### Go to Railway Dashboard:
1. Click on your service
2. Click **"Variables"** tab
3. Add each variable below

### Required Variables:

```bash
DATABASE_URL=postgresql://username:password@host:port/database
JWT_SECRET=aisai-jwt-secret-2026
NODE_ENV=production
```

### How to Get DATABASE_URL:

**Option 1: Add PostgreSQL Database**
1. In your Railway project, click **"+ New"**
2. Select **"Database"** → **"PostgreSQL"**
3. Railway will automatically create `DATABASE_URL` variable

**Option 2: Use Existing Database**
Copy the connection string from your PostgreSQL service in Railway

### After Adding Variables:

1. Click **"Redeploy"** or push to GitHub
2. Deployment should succeed
3. Check logs for "Server running on port..."

### Optional Variables:

```bash
FRONTEND_URL=https://your-frontend.up.railway.app
ANTHROPIC_API_KEY=sk-ant-your-key-here
```

---

## Quick Checklist:

- [ ] `DATABASE_URL` is set (from PostgreSQL service)
- [ ] `JWT_SECRET` is set
- [ ] `NODE_ENV=production` is set
- [ ] PostgreSQL database is running
- [ ] Redeployed after adding variables

If deployment still fails, check the logs for specific error messages.
