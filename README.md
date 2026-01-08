# Mckay's App Template

A production-ready full-stack SaaS template with authentication, payments, and real-time database.

To learn how to use this template with the best AI tools & workflows, check out my workshops on [Takeoff](https://JoinTakeoff.com/)!

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | [Next.js 15](https://nextjs.org/docs) (App Router) |
| Styling | [Tailwind CSS](https://tailwindcss.com/docs), [Shadcn UI](https://ui.shadcn.com/) |
| Animations | [Framer Motion](https://www.framer.com/motion/) |
| Database | [Convex](https://convex.dev/) (real-time) |
| Auth | [Clerk](https://clerk.com/) |
| Payments | [Polar](https://polar.sh/) |
| Deployment | [Railway](https://railway.com/) |

## Prerequisites

Create accounts for these services (all have free tiers):

- [GitHub](https://github.com/) - Source control
- [Convex](https://convex.dev/) - Database
- [Clerk](https://clerk.com/) - Authentication
- [Polar](https://polar.sh/) - Payments
- [Railway](https://railway.com/) - Deployment

## Quick Start

```bash
# 1. Clone and install
git clone <your-repo>
cd <your-repo>
npm install

# 2. Set up environment
cp .env.example .env.local
# Fill in your environment variables (see below)

# 3. Initialize Convex
npx convex dev
# This creates the database and generates types

# 4. Run development server
npm run dev
```

## Environment Variables

Copy `.env.example` to `.env.local` and configure:

### Convex Database
```bash
NEXT_PUBLIC_CONVEX_URL=https://your-project.convex.cloud
```
Get this by running `npx convex dev` and creating a project.

### Clerk Authentication
```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_JWT_ISSUER_DOMAIN=https://your-instance.clerk.accounts.dev
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/login
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/signup
```

### Polar Payments
```bash
POLAR_ACCESS_TOKEN=polar_pat_...
POLAR_WEBHOOK_SECRET=...
NEXT_PUBLIC_POLAR_PRODUCT_ID_MONTHLY=prod_...
NEXT_PUBLIC_POLAR_PRODUCT_ID_YEARLY=prod_...
```

### App URL
```bash
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Setup Guides

### 1. Convex Setup

1. Run `npx convex dev` - log in and create a project
2. Copy `NEXT_PUBLIC_CONVEX_URL` from the terminal output
3. The `convex/_generated` folder will be created automatically

### 2. Clerk + Convex Integration

1. Go to [Clerk Dashboard](https://dashboard.clerk.com) → JWT Templates
2. Click "New template" → Select "Blank"
3. Name it exactly `convex`
4. Copy the "Issuer" URL → Set as `CLERK_JWT_ISSUER_DOMAIN`

### 3. Polar Setup

1. Create an organization at [polar.sh](https://polar.sh)
2. Go to Products → Create two subscription products:
   - **Pro Monthly**: $19/month
   - **Pro Yearly**: $190/year
3. Copy Product IDs → Set as `NEXT_PUBLIC_POLAR_PRODUCT_ID_*`
4. Go to Settings → Developers → Create Access Token → Set as `POLAR_ACCESS_TOKEN`
5. Go to Settings → Webhooks → Add Endpoint:
   - URL: `https://your-domain.com/api/webhooks/polar`
   - Copy secret → Set as `POLAR_WEBHOOK_SECRET`

### 4. Railway Deployment

1. Create project at [railway.com](https://railway.com)
2. Connect your GitHub repository
3. Add all environment variables
4. Set `NEXT_PUBLIC_APP_URL` to your Railway domain
5. Deploy Convex to production:
   ```bash
   npx convex deploy
   ```

## Project Structure

```
├── app/                      # Next.js App Router
│   ├── (authenticated)/      # Protected routes (pro members)
│   │   └── dashboard/        # Dashboard pages
│   ├── (unauthenticated)/    # Public routes
│   │   ├── (marketing)/      # Landing, pricing, features
│   │   └── (auth)/           # Login, signup
│   └── api/                  # API routes
│       ├── checkout/         # Polar checkout
│       └── webhooks/polar/   # Polar webhooks
├── actions/                  # Server actions
├── components/               # React components
│   ├── payments/             # Checkout components
│   ├── providers/            # Context providers
│   └── ui/                   # Shadcn UI components
├── convex/                   # Convex backend
│   ├── schema.ts             # Database schema
│   ├── customers.ts          # Customer queries/mutations
│   └── http.ts               # HTTP endpoints
└── lib/                      # Utilities
```

## Commands

```bash
# Development
npm run dev          # Start dev server + Convex

# Database
npx convex dev       # Run Convex dev server
npx convex deploy    # Deploy to production

# Code Quality
npm run lint         # Run ESLint
npm run types        # TypeScript check
npm run clean        # Lint + format

# Testing
npm run test         # Run all tests
npm run test:unit    # Jest unit tests
npm run test:e2e     # Playwright e2e tests
```

## Features

- **Authentication**: Clerk with protected routes
- **Payments**: Polar subscriptions (monthly/yearly)
- **Database**: Convex real-time database
- **Dashboard**: Pro member access only
- **Marketing**: Landing page with pricing
- **Dark Mode**: Theme toggle support

## License

MIT
