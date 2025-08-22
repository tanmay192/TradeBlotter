# TradeTracker Pro

A comprehensive stock trading portfolio management application that helps you track trades, analyze performance, and manage capital allocation.

## Features

- **Trade Management**: Track buy/sell transactions with editable dates and prices
- **Portfolio Analytics**: Quarterly performance analysis (Q1-Q4) with ROI calculations
- **Capital Management**: Visual allocation tracking with deployed vs. free capital
- **Trading Insights**: Interactive charts showing quarterly and yearly ROI percentages
- **Real-time Dashboard**: Monitor open positions and closed trades
- **Data Persistence**: PostgreSQL database for reliable data storage

## Getting Started

### Prerequisites

- **Node.js** (version 18 or higher)
- **PostgreSQL** database
- **npm** or **yarn** package manager

### Local Development Setup

1. **Clone the Repository**
   ```bash
   git clone <your-repository-url>
   cd tradetracker-pro
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Database Setup**
   
   Create a PostgreSQL database and get your connection URL. Set up the following environment variables:
   
   ```bash
   # Create a .env file in the root directory
   DATABASE_URL=postgresql://username:password@localhost:5432/tradetracker
   PGHOST=localhost
   PGPORT=5432
   PGDATABASE=tradetracker
   PGUSER=your_username
   PGPASSWORD=your_password
   ```

4. **Initialize Database Schema**
   ```bash
   npm run db:push
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:5000`

### Project Structure

```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Application pages
│   │   ├── hooks/         # Custom React hooks
│   │   └── lib/           # Utility functions
├── server/                # Backend Express application
│   ├── index.ts          # Server entry point
│   ├── routes.ts         # API routes
│   ├── storage.ts        # Database operations
│   └── db.ts             # Database connection
├── shared/                # Shared types and schemas
│   └── schema.ts         # Database schemas
└── package.json
```

### Available Scripts

- `npm run dev` - Start development server (frontend + backend)
- `npm run build` - Build for production
- `npm run db:push` - Push database schema changes
- `npm run db:studio` - Open database management interface

## Technology Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Radix UI** component library
- **TanStack Query** for state management
- **Recharts** for data visualization
- **Wouter** for routing

### Backend
- **Node.js** with Express
- **TypeScript** for type safety
- **Drizzle ORM** for database operations
- **Zod** for validation

### Database
- **PostgreSQL** with persistent storage
- **Neon Database** (for cloud deployment)

## Deployment

### Deploy to Replit

1. **Fork/Import to Replit**
   - Go to [Replit](https://replit.com)
   - Import this repository or fork from existing Repl

2. **Set Environment Variables**
   - In Replit, go to the "Secrets" tab
   - Add your database credentials:
     ```
     DATABASE_URL=your_neon_database_url
     ```

3. **Deploy**
   - Replit will automatically handle deployment
   - Your app will be available at `https://your-repl-name.replit.app`

### Deploy to Other Platforms

#### Vercel
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy with automatic builds

#### Railway
1. Connect repository to Railway
2. Add PostgreSQL service
3. Set environment variables
4. Deploy

#### Heroku
1. Create Heroku app
2. Add PostgreSQL add-on
3. Set config vars for database
4. Deploy via Git

### Environment Variables for Production

```bash
DATABASE_URL=postgresql://user:password@host:port/database
NODE_ENV=production
PORT=5000
```

## Database Migration

When you make changes to the database schema in `shared/schema.ts`:

1. **Development**
   ```bash
   npm run db:push
   ```

2. **Production** 
   ```bash
   npm run db:push --force
   ```

## Usage

### Adding Trades
1. Enter stock symbol, buy/sell prices, and quantities
2. Dates are editable for historical trade entry
3. Capital is automatically allocated for open positions

### Viewing Analytics
- **Dashboard**: Overview of portfolio performance
- **Quarterly View**: Performance by quarters (Q1-Q4)
- **Trading Insights**: Interactive charts with ROI analysis
- **Capital Management**: Visual breakdown of deployed capital

### Managing Capital
- Set total capital amount in Capital Management
- View deployed vs. free capital allocation
- Track capital utilization across positions

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Support

For issues or questions:
1. Check the documentation
2. Review existing issues
3. Create a new issue with detailed description

## License

This project is for personal use. Modify as needed for your trading analysis requirements.