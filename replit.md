# Zamonaviy Ta'lim - Online Contract System

## Overview

This is an online contract management system for "Zamonaviy Ta'lim" (Modern Education) learning center. The application allows students to sign educational contracts online through a web-based wizard interface. It features a multi-step form for contract creation, contract preview with A4 paper styling, and an admin panel for managing all signed contracts.

The system is built with a React frontend and Express backend, using PostgreSQL for data persistence. The UI is in Uzbek language, targeting students enrolling in language courses at different CEFR levels (A0-A1 through CEFR-PRO).

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight router)
- **State Management**: TanStack React Query for server state, React Context for contract template state
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS v4 with custom theme configuration
- **Animations**: Framer Motion for wizard transitions
- **Fonts**: Inter (UI) and Merriweather (contract documents for official appearance)

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **API Design**: RESTful endpoints under `/api/` prefix
- **Build System**: Vite for development with HMR, esbuild for production bundling
- **Static Serving**: Express serves built client assets in production

### Data Storage
- **Database**: PostgreSQL with Drizzle ORM
- **Schema Location**: `shared/schema.ts` - contains `users` and `contracts` tables
- **Migrations**: Drizzle Kit with `db:push` command
- **Contract Fields**: id, contractNumber (auto-generated), studentName, phone, age, course, format, status, createdAt

### Key Design Patterns
- **Shared Types**: Schema definitions in `/shared/` directory are shared between frontend and backend
- **Validation**: Zod schemas generated from Drizzle schema using drizzle-zod
- **Path Aliases**: `@/` for client source, `@shared/` for shared code, `@assets/` for attached assets
- **Storage Abstraction**: `IStorage` interface in `server/storage.ts` allows for different storage implementations

### Application Flow
1. Student visits home page with multi-step WebWizard component
2. Wizard collects: name, phone, age, course level
3. Contract preview shown as styled A4 paper document
4. On confirmation, contract saved to database with auto-generated number (CN-YEAR-XXX format)
5. Admin panel at `/admin` shows all contracts with search and template editing

## External Dependencies

### Database
- **PostgreSQL**: Primary database, connection via `DATABASE_URL` environment variable
- **pg**: Node.js PostgreSQL client
- **connect-pg-simple**: PostgreSQL session store (available but not currently used)

### UI Framework
- **Radix UI**: Full suite of accessible primitives (dialog, dropdown, tabs, etc.)
- **shadcn/ui**: Pre-built component configurations
- **Lucide React**: Icon library

### Build & Development
- **Vite**: Development server with React plugin and Tailwind CSS integration
- **Replit Plugins**: cartographer, dev-banner, runtime-error-modal for Replit integration
- **esbuild**: Production bundling for server

### Form & Validation
- **React Hook Form**: Form state management
- **@hookform/resolvers**: Zod integration for form validation
- **zod-validation-error**: Human-readable validation error messages