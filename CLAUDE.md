# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
- `npm run dev` - Start development server with Turbopack + Convex
- `npm run build` - Build for production
- `npm run start` - Start production server

### Code Quality
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Run ESLint with auto-fix
- `npm run types` - Run TypeScript type checking
- `npm run format:write` - Format code with Prettier
- `npm run clean` - Run both lint:fix and format:write

### Database (Convex)
- `npx convex dev` - Start Convex development server (syncs schema and functions)
- `npx convex deploy` - Deploy Convex to production

### Testing
- `npm run test` - Run all tests (unit + e2e)
- `npm run test:unit` - Run Jest unit tests
- `npm run test:e2e` - Run Playwright e2e tests

### Shadcn UI Components
- `npx shadcn@latest add [component-name]` - Install new Shadcn UI components

## Architecture

This is a Next.js 15 SaaS template using the App Router with clear separation between authenticated and unauthenticated routes.

### Route Structure
- `/app/(unauthenticated)` - Public routes
  - `(marketing)` - Landing pages, pricing, features
  - `(auth)` - Login and signup flows
- `/app/(authenticated)` - Protected routes requiring Clerk auth
  - `dashboard` - Main application with account, billing, support sections
- `/app/api` - API routes including Polar webhook handler

### Key Patterns
- **Server Actions** in `/actions` for data mutations (customers, Polar operations)
- **Database Schema** in `/convex/schema.ts` using Convex
- **Database Functions** in `/convex/customers.ts` for queries and mutations
- **UI Components** in `/components/ui` from Shadcn UI library
- **Authentication** handled by Clerk middleware with protected route groups
- **Payments** integrated via Polar with webhook handling

### Data Flow
1. Authentication state managed by Clerk (`@clerk/nextjs`)
2. Customer data stored in Convex (real-time database)
3. Polar integration for subscription management
4. Server actions handle all data mutations with proper auth checks

### Environment Variables Required
- `NEXT_PUBLIC_CONVEX_URL` - Convex deployment URL
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - Clerk public key
- `CLERK_SECRET_KEY` - Clerk secret key
- `CLERK_JWT_ISSUER_DOMAIN` - Clerk JWT issuer for Convex auth
- `POLAR_ACCESS_TOKEN` - Polar API access token
- `POLAR_WEBHOOK_SECRET` - Polar webhook signing secret
- `NEXT_PUBLIC_POLAR_PRODUCT_ID_MONTHLY` - Polar monthly product ID
- `NEXT_PUBLIC_POLAR_PRODUCT_ID_YEARLY` - Polar yearly product ID
