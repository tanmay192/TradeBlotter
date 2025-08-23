# Vercel Deployment Guide - TradeTracker Pro

This guide will help you deploy TradeTracker Pro to Vercel with serverless functions and PostgreSQL database.

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **PostgreSQL Database**: Get a database from Neon, PlanetScale, or Supabase
3. **GitHub Repository**: Your code should be in a GitHub repository

## Step 1: Database Setup

### Option A: Neon Database (Recommended)
1. Go to [neon.tech](https://neon.tech) and create a free account
2. Create a new project
3. Copy the connection string (it looks like: `postgresql://user:pass@host/db?sslmode=require`)

### Option B: Supabase
1. Go to [supabase.com](https://supabase.com) and create a project
2. Go to Settings > Database
3. Copy the connection string

### Option C: PlanetScale
1. Create a PlanetScale database
2. Get the connection string from the dashboard

## Step 2: Deploy to Vercel

### Method 1: Vercel Dashboard (Recommended)

1. **Connect Repository**
   - Go to [vercel.com/dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository

2. **Configure Environment Variables**
   Add these environment variables in the Vercel dashboard:
   ```
   DATABASE_URL=your_postgresql_connection_string
   NODE_ENV=production
   ```

3. **Deploy**
   - Click "Deploy"
   - Vercel will automatically build and deploy your app

### Method 2: Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Set environment variables
vercel env add DATABASE_URL
# Paste your database URL when prompted

vercel env add NODE_ENV
# Enter "production" when prompted

# Redeploy with environment variables
vercel --prod
```

## Step 3: Initialize Database Schema

After deployment, you need to initialize your database schema:

### Option A: Local Push (Recommended)
```bash
# Set your DATABASE_URL locally
export DATABASE_URL="your_postgresql_connection_string"

# Push schema to production database
npm run db:push
```

### Option B: Using Vercel CLI
```bash
# Run database migration on Vercel
vercel env pull .env.local
npm run db:push
```

## Step 4: Verify Deployment

1. **Check Application**
   - Visit your Vercel URL (e.g., `https://your-app.vercel.app`)
   - Test trade creation and data persistence

2. **Check API Endpoints**
   - Test: `https://your-app.vercel.app/api/trades`
   - Test: `https://your-app.vercel.app/api/capital`

3. **Check Database Connection**
   - Create a test trade
   - Refresh the page to confirm data persists

## Project Structure for Vercel

```
├── api/                    # Serverless API functions
│   ├── trades.ts          # /api/trades endpoint
│   ├── capital.ts         # /api/capital endpoint
│   └── trades/
│       └── [id].ts        # /api/trades/[id] endpoint
├── client/                # React frontend
├── shared/                # Shared schemas
├── dist/public/           # Built frontend (generated)
├── vercel.json           # Vercel configuration
└── package.json
```

## Configuration Files

### vercel.json
```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist/public"
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/dist/public/$1"
    }
  ],
  "functions": {
    "api/**/*.ts": {
      "runtime": "nodejs20.x"
    }
  }
}
```

## Environment Variables

Set these in your Vercel dashboard under Settings > Environment Variables:

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |
| `NODE_ENV` | Environment mode | `production` |

## Troubleshooting

### Build Failures

1. **Check Build Logs**
   - Go to Vercel dashboard > Deployments
   - Click on failed deployment to see logs

2. **Common Issues**
   ```bash
   # Clear node_modules and reinstall
   rm -rf node_modules package-lock.json
   npm install
   
   # Test build locally
   npm run build:vercel
   ```

### Database Connection Issues

1. **Test Connection Locally**
   ```bash
   # Test with your production DATABASE_URL
   export DATABASE_URL="your_production_url"
   npm run db:push
   ```

2. **Check Environment Variables**
   - Verify DATABASE_URL is set correctly in Vercel
   - Ensure the URL includes SSL mode for Neon: `?sslmode=require`

### API Function Errors

1. **Check Function Logs**
   - Go to Vercel dashboard > Functions tab
   - View runtime logs for each API function

2. **Test API Endpoints**
   ```bash
   # Test trades endpoint
   curl https://your-app.vercel.app/api/trades
   
   # Test capital endpoint
   curl https://your-app.vercel.app/api/capital
   ```

## Performance Optimization

### Cold Start Optimization
- Vercel functions may have cold starts
- Database connections are optimized for serverless
- Connection pooling is handled automatically

### Caching
- Static assets are cached automatically
- API responses can be cached using Vercel's headers

## Security Considerations

1. **Environment Variables**
   - Never commit database URLs to code
   - Use Vercel's environment variable system

2. **Database Security**
   - Use SSL connections (automatically handled by Neon)
   - Keep database credentials secure

3. **CORS**
   - API functions include CORS headers
   - Configured for production domain

## Updating Your App

```bash
# Make changes to your code
git add .
git commit -m "Update feature"
git push origin main

# Vercel automatically deploys on git push
```

## Cost Considerations

- **Vercel**: Free tier includes 100GB bandwidth, 100 serverless function invocations per day
- **Database**: Neon free tier includes 3GB storage, 100 hours compute per month
- **Scaling**: Both scale automatically with usage

## Support

If you encounter issues:

1. Check Vercel documentation: [vercel.com/docs](https://vercel.com/docs)
2. Check database provider documentation
3. Review function logs in Vercel dashboard
4. Test API endpoints directly

Your TradeTracker Pro app is now production-ready on Vercel with serverless architecture!