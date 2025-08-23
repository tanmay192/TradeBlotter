# Deployment Guide - TradeTracker Pro

## Cloud Platform Deployment

### 1. Vercel Deployment (Recommended)

**Setup and Deploy:**
```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod
```

**Environment Variables:**
Add in Vercel Dashboard:
```
DATABASE_URL=your_postgresql_url
NODE_ENV=production
```

### 2. Railway Deployment

1. **Connect Repository**
   - Go to [Railway](https://railway.app)
   - Connect your GitHub repository

2. **Add Database**
   - Click "New Service" → "PostgreSQL"
   - Copy connection URL

3. **Set Variables**
   ```
   DATABASE_URL=${{Postgres.DATABASE_URL}}
   NODE_ENV=production
   ```

### 3. Initialize Database Schema

Run in your deployment platform's console:
```bash
npm install
npm run db:push
```

## Alternative Cloud Platforms

### Vercel (Frontend + Serverless)

1. **Setup**
   ```bash
   npm install -g vercel
   vercel login
   ```

2. **Deploy**
   ```bash
   vercel --prod
   ```

3. **Environment Variables**
   Add in Vercel Dashboard:
   ```
   DATABASE_URL=your_postgresql_url
   ```

### Railway

1. **Connect Repository**
   - Go to [Railway](https://railway.app)
   - Connect your GitHub repo

2. **Add Database**
   - Click "New Service" → "PostgreSQL"
   - Copy connection URL

3. **Set Variables**
   ```
   DATABASE_URL=${{Postgres.DATABASE_URL}}
   NODE_ENV=production
   ```

### Heroku

1. **Create App**
   ```bash
   heroku create your-app-name
   ```

2. **Add PostgreSQL**
   ```bash
   heroku addons:create heroku-postgresql:mini
   ```

3. **Deploy**
   ```bash
   git push heroku main
   ```

### DigitalOcean App Platform

1. **Create App from GitHub**
2. **Add Managed Database** (PostgreSQL)
3. **Configure Environment Variables**
4. **Deploy**

## Production Environment Setup

### Required Environment Variables
```bash
# Database
DATABASE_URL=postgresql://user:password@host:port/database

# Application
NODE_ENV=production
PORT=5000

# Optional: Security
SESSION_SECRET=your-random-secret-key
```

### Production Optimizations

1. **Package.json Scripts**
   ```json
   {
     "scripts": {
       "start": "node dist/server/index.js",
       "build": "tsc && npm run build:client",
       "build:client": "vite build",
       "postinstall": "npm run build"
     }
   }
   ```

2. **Production Build**
   ```bash
   npm run build
   npm start
   ```

## Monitoring & Maintenance

### Health Checks
Your app includes basic health endpoints:
- `GET /api/health` - Application status
- `GET /api/trades` - Database connectivity

### Database Backups
- **Cloud Platforms**: Most providers include automatic backups
- **Railway/Heroku**: Configure periodic backups
- **Self-hosted**: Setup pg_dump cron jobs

### Scaling
- **Cloud Autoscale**: Automatic scaling based on traffic
- **Vercel**: Serverless scaling by default
- **Railway**: Configure auto-scaling in dashboard

## Security Considerations

1. **Environment Variables**
   - Never commit `.env` files
   - Use platform-specific secret management

2. **Database Security**
   - Use connection pooling
   - Enable SSL connections in production

3. **CORS Configuration**
   ```typescript
   // Add to server/index.ts for production
   app.use(cors({
     origin: process.env.FRONTEND_URL || 'https://yourapp.example.com',
     credentials: true
   }));
   ```

## Troubleshooting Deployment

### Common Issues

1. **Build Failures**
   ```bash
   # Clear cache and rebuild
   npm cache clean --force
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Database Connection**
   ```bash
   # Test connection
   npx drizzle-kit studio
   ```

3. **Port Issues**
   ```bash
   # Ensure correct port binding
   const port = process.env.PORT || 5000;
   app.listen(port, '0.0.0.0');
   ```

### Logs and Debugging
- **Cloud Platforms**: Check platform console/logs
- **Vercel**: View function logs in dashboard
- **Railway**: Check deployment logs
- **Heroku**: `heroku logs --tail`

## Post-Deployment Checklist

- [ ] Database schema initialized
- [ ] Environment variables configured
- [ ] Application accessible via public URL
- [ ] Database connection working
- [ ] Trade entry and retrieval functional
- [ ] Charts and analytics displaying correctly
- [ ] Mobile responsiveness verified

## Support

If you encounter deployment issues:
1. Check platform-specific documentation
2. Verify environment variable configuration
3. Review application logs
4. Test database connectivity
5. Ensure all dependencies are installed