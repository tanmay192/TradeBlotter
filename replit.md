# TradeTracker Pro

## Overview

TradeTracker Pro is a comprehensive stock trading portfolio management application designed to help traders track their trades, analyze performance, and manage capital allocation. The application provides features for trade management (buy/sell transactions with editable dates and prices), portfolio analytics with quarterly performance analysis, capital management with visual allocation tracking, trading insights through interactive charts, and real-time dashboard monitoring of open positions and closed trades.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The application uses React with TypeScript as the foundation, providing type safety and modern development practices. Client-side routing is handled by Wouter for lightweight navigation. State management relies on TanStack Query (React Query) for server state management and caching. The UI framework combines Radix UI components with shadcn/ui design system for consistent, accessible components. Styling is implemented with Tailwind CSS using custom CSS variables for theming and responsive design. Form handling uses React Hook Form with Zod validation for robust data validation. The build process is powered by Vite for fast development and optimized production builds.

### Backend Architecture
The backend runs on Node.js with Express.js framework providing RESTful API endpoints. TypeScript is used throughout for full-stack type safety. The API follows RESTful conventions with standard HTTP methods (GET, POST, PATCH, DELETE). Request and response validation is handled by Zod schemas shared between frontend and backend. The system includes centralized error handling middleware with proper HTTP status codes. Development features hot reload through Vite integration with comprehensive logging.

### Data Storage Solutions
PostgreSQL serves as the primary database with persistent data storage managed through Drizzle ORM. The ORM provides type-safe database operations and schema management. Database schemas are shared between frontend and backend using drizzle-zod for consistency. The system ensures full data persistence where trades and capital settings survive application restarts. Database schema migrations are handled by Drizzle Kit for version control and deployment management.

### Core Data Models
The Trade model tracks the complete trade lifecycle including buy/sell prices, dates, quantities, and profit/loss calculations. Portfolio Analytics provides quarterly performance analysis, total portfolio value tracking, and return calculations. Trade Status management handles open and closed position tracking with real-time status updates. Capital Management includes total capital tracking, deployed versus free capital allocation, and capital utilization metrics.

### Authentication and Session Management
The application uses PostgreSQL-backed sessions through connect-pg-simple for reliable session storage and management.

## External Dependencies

- **Database Provider**: Neon Database provides serverless PostgreSQL for production data storage with automatic scaling and management
- **UI Component Library**: Radix UI offers a comprehensive set of accessible components including modals, forms, tables, navigation, and interactive elements
- **Development Tools**: Modern cloud development environment supporting hot reload, debugging, and rapid iteration
- **Date Handling**: date-fns library for robust date manipulation, formatting, and timezone handling
- **Data Visualization**: Embla Carousel for implementing interactive charts and data visualization components
- **Form Validation**: Zod schema validation library ensuring data integrity across the application
- **HTTP Client**: Built-in fetch API with custom wrapper functions for API communication
- **Styling Framework**: Tailwind CSS with PostCSS for utility-first styling and responsive design