# Local Development Setup - TradeTracker Pro

## Quick Start Guide

### 1. Prerequisites
```bash
# Install Node.js (18+)
node --version  # Should be 18+
npm --version   # Should be 8+

# Install PostgreSQL locally
# macOS: brew install postgresql
# Ubuntu: sudo apt install postgresql postgresql-contrib
# Windows: Download from postgresql.org
```

### 2. Database Setup
```bash
# Start PostgreSQL service
# macOS: brew services start postgresql
# Ubuntu: sudo systemctl start postgresql
# Windows: Use Services app

# Create database
createdb tradetracker

# Or use psql:
psql -U postgres
CREATE DATABASE tradetracker;
\q
```

### 3. Environment Configuration
Create a `.env` file in the project root:
```bash
# Database Configuration
DATABASE_URL=postgresql://postgres:password@localhost:5432/tradetracker
PGHOST=localhost
PGPORT=5432
PGDATABASE=tradetracker
PGUSER=postgres
PGPASSWORD=your_password

# Development
NODE_ENV=development
PORT=5000
```

### 4. Install and Run
```bash
# Install dependencies
npm install

# Initialize database schema
npm run db:push

# Start development server
npm run dev
```

Visit `http://localhost:5000` to access your application.

## Development Commands

```bash
# Development
npm run dev              # Start dev server (hot reload)

# Database
npm run db:push          # Push schema changes
npm run db:studio        # Open database viewer
npm run db:push --force  # Force schema update

# Production Build
npm run build            # Build for production
npm start                # Start production server
```

## Troubleshooting

### Database Connection Issues
```bash
# Check PostgreSQL is running
pg_isready -h localhost -p 5432

# Test connection
psql -h localhost -p 5432 -U postgres -d tradetracker
```

### Port Already in Use
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Or use different port
PORT=3000 npm run dev
```

### Permission Issues
```bash
# Fix npm permissions (macOS/Linux)
sudo chown -R $(whoami) ~/.npm

# Clear npm cache
npm cache clean --force
```

## Docker Setup (Alternative)

If you prefer Docker:

```dockerfile
# Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5000
CMD ["npm", "run", "dev"]
```

```yaml
# docker-compose.yml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "5000:5000"
    environment:
      - DATABASE_URL=postgresql://postgres:password@db:5432/tradetracker
    depends_on:
      - db
  
  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=tradetracker
      - POSTGRES_PASSWORD=password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

Run with: `docker-compose up`