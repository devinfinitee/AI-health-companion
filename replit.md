# AI Health Companion

## Overview

AI Health Companion is a voice-first Progressive Web App (PWA) designed to provide accessible health navigation, symptom checking, and appointment booking. The application combines the trustworthiness of medical software with the approachability of consumer health apps, drawing inspiration from healthcare leaders like Zocdoc and Headspace.

**Core Features:**
- Voice-guided health navigation with visual reinforcement
- AI-powered symptom assessment and health education
- Appointment booking and management
- Personalized health resources and tips
- Multi-language support with accessibility-first design

**Tech Stack:**
- Frontend: React with TypeScript, Vite build system
- UI Framework: shadcn/ui components with Radix UI primitives
- Styling: Tailwind CSS with custom design system
- Animations: GSAP for smooth page transitions
- Routing: Wouter for lightweight client-side routing
- State Management: TanStack Query for server state
- Backend: Express.js server
- Database ORM: Drizzle with PostgreSQL dialect

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Component-Based Design:**
- React functional components with TypeScript for type safety
- Reusable UI components from shadcn/ui library (buttons, cards, dialogs, forms)
- Custom health-specific components (VoiceButton, HealthCard, ThemeToggle)
- Page-level components for each route (Dashboard, Chat, Symptoms, BookAppointment, etc.)

**Routing Strategy:**
- Client-side routing using Wouter (lightweight alternative to React Router)
- Route definitions centralized in App.tsx
- Page components: Dashboard (/), Chat (/chat), Symptoms (/symptoms), BookAppointment (/book-appointment), AppointmentConfirmed (/appointment-confirmed), Resources (/resources), Profile (/profile)

**State Management:**
- TanStack Query for server state management and caching
- Local component state with React hooks (useState, useEffect)
- Custom hooks for shared logic (useIsMobile, useToast)

**Design System:**
- Hybrid healthcare design with medical trustworthiness and modern app aesthetics
- CSS custom properties for theming (light/dark mode support)
- Medical Purple (270 70% 55%) as primary brand color
- Inter font for body text, Plus Jakarta Sans for headings
- Tailwind utility classes with custom configuration
- Responsive design with mobile-first approach

**Animation Strategy:**
- GSAP library for page transitions and micro-interactions
- Staggered animations for card grids and lists
- Fade and slide effects for improved user experience

### Backend Architecture

**Server Framework:**
- Express.js for HTTP server and API routing
- TypeScript for type-safe server code
- Development and production build processes separated

**API Structure:**
- RESTful API endpoints prefixed with /api
- Route registration in server/routes.ts
- Middleware for request logging and error handling
- JSON request/response format

**Storage Layer:**
- Storage interface (IStorage) for data operations abstraction
- MemStorage implementation for in-memory data (development)
- Designed to support PostgreSQL database via Drizzle ORM
- User management with CRUD operations (getUser, getUserByUsername, createUser)

**Build & Development:**
- Vite dev server with HMR for frontend development
- tsx for running TypeScript server code directly
- esbuild for production server bundling
- Separate client and server build outputs

### Data Architecture

**Database Schema (Drizzle ORM):**
- Users table: id (UUID primary key), username (unique text), password (text)
- Schema validation with Zod for type safety
- PostgreSQL dialect configuration
- Migration support via drizzle-kit

**Data Models:**
- Type-safe models generated from Drizzle schema
- Insert schemas for validation before database operations
- Separation of insert types and select types

### External Dependencies

**UI Component Libraries:**
- Radix UI primitives for accessible, unstyled components (accordion, alert-dialog, avatar, checkbox, dialog, dropdown-menu, popover, select, slider, switch, tabs, toast, tooltip, etc.)
- shadcn/ui design system for pre-styled healthcare UI patterns
- Lucide React for consistent iconography

**Database & ORM:**
- Drizzle ORM for type-safe database operations
- @neondatabase/serverless for Neon PostgreSQL connection
- connect-pg-simple for session storage (if sessions are implemented)
- Drizzle Zod for runtime schema validation

**Styling & Animation:**
- Tailwind CSS for utility-first styling
- class-variance-authority for component variant management
- GSAP (GreenSock Animation Platform) for advanced animations
- embla-carousel-react for carousel components

**Forms & Validation:**
- React Hook Form for form state management
- @hookform/resolvers for validation integration
- Zod for schema validation

**Utilities:**
- date-fns for date manipulation
- clsx and tailwind-merge for className composition
- wouter for lightweight routing
- nanoid for unique ID generation

**Development Tools:**
- Vite for fast frontend builds and HMR
- TypeScript for type safety across the stack
- PostCSS with Autoprefixer for CSS processing
- @replit plugins for development experience (error modal, cartographer, dev banner)

**Note:** The application is currently using in-memory storage but is architected to integrate with PostgreSQL. The database connection requires DATABASE_URL environment variable to be configured.