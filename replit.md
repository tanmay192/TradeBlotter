# TradeTracker Pro

## Overview

TradeTracker Pro is a comprehensive stock trading portfolio management application that helps users track trades, analyze performance, and manage capital allocation. The system provides real-time portfolio analytics, quarterly performance analysis, and capital management features with a modern web interface.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript for type-safe development
- **UI Library**: shadcn/ui components built on Radix UI primitives for accessible, modern interface design
- **Styling**: Tailwind CSS with custom design tokens and responsive layouts
- **Routing**: Wouter for lightweight client-side navigation
- **State Management**: TanStack Query (React Query) for server state caching and synchronization
- **Forms**: React Hook Form with Zod validation for type-safe form handling
- **Build System**: Vite for fast development and optimized production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js for RESTful API services
- **Language**: TypeScript throughout the stack for end-to-end type safety
- **API Design**: RESTful endpoints with proper HTTP methods and status codes
- **Validation**: Shared Zod schemas between frontend and backend for consistent data validation
- **Error Handling**: Centralized middleware with structured error responses
- **Development**: Hot module replacement and comprehensive request/response logging

### Data Storage Solutions
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Schema Management**: Drizzle Kit for migrations and schema evolution
- **Connection**: Neon Database serverless PostgreSQL for production hosting
- **Data Models**: 
  - Trades table with complete transaction lifecycle tracking
  - Capital settings for portfolio management
  - UUID primary keys and decimal precision for financial data

### Core Features
- **Trade Management**: Buy/sell transaction tracking with editable dates, prices, and P&L calculations
- **Portfolio Analytics**: Quarterly performance analysis (Q1-Q4) with ROI calculations and metrics
- **Capital Allocation**: Visual tracking of deployed vs. free capital with utilization percentages
- **Performance Insights**: Interactive charts showing quarterly and yearly returns
- **Real-time Dashboard**: Live portfolio status with open positions and closed trades

## External Dependencies

### Database & Infrastructure
- **Neon Database**: Serverless PostgreSQL hosting with WebSocket connections
- **Database Driver**: @neondatabase/serverless for optimized serverless connections

### UI Components & Styling
- **Radix UI**: Complete set of accessible UI primitives (dialogs, forms, navigation, data display)
- **Tailwind CSS**: Utility-first CSS framework with custom design system
- **Lucide Icons**: Modern icon library for consistent visual elements
- **Class Variance Authority**: Type-safe component variants

### Development & Build Tools
- **Vite**: Fast build tool with HMR and development server
- **ESBuild**: JavaScript bundler for production builds
- **TypeScript**: Static type checking across the entire application
- **Replit Integration**: Cloud development environment with runtime error handling

### Data & Forms
- **Zod**: Runtime type validation and schema definition
- **React Hook Form**: Performant form library with minimal re-renders
- **date-fns**: Date manipulation and formatting utilities
- **TanStack Query**: Server state management with caching and background updates

### Session Management
- **connect-pg-simple**: PostgreSQL-backed session storage for user state persistence