# Curio Critters v1.0.0 Architecture

## Monorepo Structure

```
curio-critters/
├── apps/
│   ├── game/          # Phaser 3 PWA game (Vite + TypeScript)
│   ├── parent/        # Next.js parent dashboard
│   └── landing/       # Next.js static landing page
├── services/
│   └── api/           # FastAPI + Postgres backend
├── packages/
│   ├── algo-spaced/   # Adaptive spaced repetition engine
│   ├── curriculum/    # K-3 math curriculum definitions
│   ├── ui/           # Shared UI components
│   └── telemetry/    # Privacy-first telemetry interface
├── deploy/           # Docker compose for local development
├── docs/            # Documentation
└── sample/          # Demo data and seeded curriculum
```

## Technology Stack

### Game App (`/apps/game`)
- **Framework**: Phaser 3 + TypeScript
- **Build Tool**: Vite
- **PWA**: Service Worker + Manifest
- **Storage**: IndexedDB (local-first)
- **i18n**: i18next framework

### Parent Dashboard (`/apps/parent`)
- **Framework**: Next.js 14 + TypeScript
- **UI**: Tailwind CSS + React
- **Charts**: Recharts for analytics
- **PDF**: jsPDF for printable reports
- **Auth**: Magic links + JWT

### API Service (`/services/api`)
- **Framework**: FastAPI + Python
- **Database**: PostgreSQL + SQLAlchemy
- **Auth**: JWT tokens
- **Sync**: RESTful API for progress sync
- **Payments**: Stripe integration

### Core Packages
- **algo-spaced**: SM-2 derivative for math facts
- **curriculum**: JSON/YAML fact families and standards
- **ui**: Shared React components
- **telemetry**: NO-OP default with PostHog optional

## Data Flow

1. **Local-First**: Game progress stored in IndexedDB
2. **Anonymous IDs**: Child profiles use generated UUIDs
3. **Optional Sync**: Parent can enable cloud sync via subscription
4. **Privacy**: No child PII stored server-side

## Development Setup

```bash
# Install dependencies
npm run setup

# Start development servers
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

## Deployment

- **Game**: Vercel/Netlify (static PWA)
- **Parent**: Vercel (Next.js)
- **API**: Railway/Render (Docker)
- **Database**: PostgreSQL (managed)

## Compliance

- COPPA/GDPR compliant design
- Privacy-by-default telemetry
- Data minimization principles
- Parental consent flows
