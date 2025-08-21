# TradeTracker Pro

## Overview

TradeTracker Pro is a comprehensive stock trading portfolio management application built with React and Express. The application allows users to track their stock trades, monitor portfolio performance, analyze quarterly trading patterns, and manage both open and closed positions. It features capital management with cash allocation tracking, a modern dashboard interface with real-time trade management capabilities, detailed performance analytics, and a visual pie chart showing deployed vs. free capital.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript for type safety and modern development practices
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management and caching
- **UI Framework**: Radix UI components with shadcn/ui design system for consistent, accessible components
- **Styling**: Tailwind CSS with custom CSS variables for theming and responsive design
- **Forms**: React Hook Form with Zod validation for robust form handling and data validation
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework for RESTful API development
- **Language**: TypeScript for full-stack type safety
- **API Design**: RESTful endpoints following conventional HTTP methods (GET, POST, PATCH, DELETE)
- **Validation**: Zod schemas for request/response validation shared between frontend and backend
- **Error Handling**: Centralized error middleware with proper HTTP status codes
- **Development**: Hot reload with Vite integration and comprehensive logging

### Data Storage Solutions
- **Database**: PostgreSQL configured through Drizzle ORM
- **ORM**: Drizzle ORM for type-safe database operations and schema management
- **Schema**: Shared TypeScript schemas between frontend and backend using drizzle-zod
- **Development Storage**: In-memory storage implementation for rapid development and testing
- **Migrations**: Drizzle Kit for database schema migrations and management

### Core Data Models
- **Trades**: Complete trade lifecycle tracking including buy/sell prices, dates, quantities, and P&L calculations
- **Portfolio Analytics**: Quarterly performance analysis, total portfolio value, and return calculations
- **Trade Status**: Open and closed position tracking with real-time status updates
- **Capital Management**: Total capital tracking, deployed vs. free capital allocation, and capital utilization metrics

### External Dependencies
- **Database Provider**: Neon Database (serverless PostgreSQL) for production data storage
- **Session Management**: PostgreSQL-backed sessions using connect-pg-simple
- **UI Components**: Comprehensive Radix UI component library for modals, forms, tables, and navigation
- **Date Handling**: date-fns for robust date manipulation and formatting
- **Charts**: Embla Carousel for data visualization components
- **Development Tools**: Replit-specific tooling for cloud development environment optimization

### Security & Performance
- **Type Safety**: End-to-end TypeScript implementation with shared schemas
- **Validation**: Runtime validation using Zod at API boundaries
- **Query Optimization**: React Query for intelligent caching and background updates
- **Responsive Design**: Mobile-first approach with Tailwind CSS breakpoints
- **Error Boundaries**: Comprehensive error handling at component and API levels