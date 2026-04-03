# Production Deployment Guide

## Overview
This guide explains how to deploy the AI-SAI Teacher Hub to Railway as a monorepo (frontend + backend in one service).

## Architecture
- **Backend**: Express.js API server (port from Railway's PORT env variable)
- **Frontend**: React app built and served as static files by the backend
- **Database**: PostgreSQL (Railway provided)

## Railway Deployment Steps

### 1. Create a New Railway Project
1. Go to [railway.app](https://railway.app)
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your repository: `Ai_Sai`

### 2. Configure Environment Variables
In Railway dashboard, add these environment variables:

**Required:**
- `NODE_ENV` = `production`
- `DATABASE_URL` = (Railway will auto-provide if you add PostgreSQL service)
- `JWT_SECRET` = `aisai-jwt-secret-2026` (or generate a new secure secret)
- `ANTHROPIC_API_KEY` = `your-actual-anthropic-api-key`

**Optional:**
- `PORT` = (Railway auto-provides, don't set manually)

### 3. Configure Build Settings

**Install Command:**
```bash
npm install && cd client && npm install && cd ../server && npm install
```

**Build Command:**
```bash
npm run build
```

**Start Command:**
```bash
npm start
```

**Root Directory:** `/` (project root)

### 4. Add PostgreSQL Database
1. In Railway project, click "New Service"
2. Select "Database" → "PostgreSQL"
3. Railway will automatically set `DATABASE_URL` environment variable
4. After database is created, run migrations:
   - Go to your service settings
   - Add a "Deploy" trigger to run: `npm run db:push`

### 5. Deploy
1. Push your code to GitHub
2. Railway will automatically build and deploy
3. Your app will be available at: `https://your-project.up.railway.app`

## How It Works

### Development Mode
- Frontend: `http://localhost:5173` (Vite dev server with HMR)
- Backend: `http://localhost:3001` (Express API server)
- Vite proxy forwards `/api/*` requests to backend

### Production Mode
- Single server on Railway's assigned port
- Backend serves built React app from `client/dist`
- All requests to `/api/*` → API routes
- All other requests → React app (SPA routing)

## Environment Variables Explained

### Local Development
**File:** `client/.env.local`
```
VITE_API_URL=http://localhost:3001/api
```

**File:** `.env` (root)
```
DATABASE_URL=postgresql://...
ANTHROPIC_API_KEY=sk-ant-...
JWT_SECRET=your-secret-here
PORT=3001
```

### Production (Railway)
No `VITE_API_URL` needed - the app uses relative URLs (`/api`)
The backend serves both API and frontend from the same domain.

## Build Process

1. **Client Build** (`npm run build:client`):
   - Runs `cd client && npm run build`
   - Creates `client/dist` folder with optimized React app

2. **Server Build** (`npm run build:server`):
   - Runs `cd server && npm run build`
   - Compiles TypeScript to JavaScript in `server/dist`
   - Runs `prisma generate` to create Prisma Client

3. **Start Production** (`npm start`):
   - Sets `NODE_ENV=production`
   - Runs `node server/dist/index.js`
   - Server serves API routes on `/api/*`
   - Server serves React app for all other routes

## Troubleshooting

### 404 Errors on API Routes
- Check that `DATABASE_URL` is set in Railway
- Verify server logs: `npm run db:push` completed successfully
- Check that build completed without errors

### React App Not Loading
- Verify build created `client/dist/index.html`
- Check server logs for "Environment: production"
- Ensure `NODE_ENV=production` is set in Railway

### Database Connection Issues
- Verify `DATABASE_URL` format in Railway env vars
- Run `npm run db:push` to sync database schema
- Check Prisma connection in server logs

## Updating the Deployment

1. Push changes to GitHub
2. Railway auto-deploys on push
3. Monitor deployment in Railway dashboard
4. Check logs for any errors

## Database Migrations

To update the database schema:
```bash
# Locally
npm run db:push

# On Railway (run in service settings or via Railway CLI)
npm run db:push
```

## Security Notes

1. **Never commit secrets** - Use environment variables
2. **Use strong JWT_SECRET** - Generate with: `openssl rand -base64 32`
3. **Update ANTHROPIC_API_KEY** - Replace placeholder with real key
4. **CORS is enabled for all origins** - Consider restricting in production

## Next Steps After Deployment

1. Test registration at: `https://your-project.up.railway.app/register`
2. Test login functionality
3. Verify API endpoints work correctly
4. Run database seed if needed: `npm run db:seed`
