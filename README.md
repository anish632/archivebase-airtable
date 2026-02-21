# ArchiveBase — Smart Archive & Data Lifecycle Manager for Airtable

ArchiveBase is an Airtable custom extension (block) that helps you manage data lifecycle by archiving old or completed records. Keep your bases fast, stay within record limits, and maintain compliance — all from within Airtable.

## Features

- **Rule-based archiving** — Archive records by age (date fields) or status (select fields)
- **CSV export** — Archived records are exported to CSV before deletion
- **Dashboard** — Track archive stats, usage, and plan limits
- **Tiered pricing** — Free (500 records/mo), Pro ($29/mo, unlimited), Team ($79/mo, compliance features)
- **Lemon Squeezy billing** — Subscription management via Lemon Squeezy

## Architecture

```
archivebase-airtable/
├── frontend/          # Airtable extension (React + @airtable/blocks)
│   ├── index.tsx      # Main app entry
│   ├── components/    # Dashboard, ArchiveRules, ArchiveExecutor, Pricing
│   ├── types/         # TypeScript interfaces
│   └── utils/         # CSV export, record filtering, API client
├── backend/           # Next.js App Router API (deploys to Vercel)
│   ├── app/api/       # API routes (archive, license, billing)
│   └── lib/           # Lemon Squeezy, storage, CORS helpers
├── block.json         # Airtable block config
└── package.json       # Extension dependencies
```

## Getting Started

### Prerequisites

- Node.js 18+
- Airtable account with a base
- [Airtable CLI](https://www.npmjs.com/package/@airtable/blocks-cli) (`npm install -g @airtable/blocks-cli`)

### Extension Development

```bash
# Install dependencies
npm install

# Run the extension dev server
npm run dev
# or: block run
```

Then add the extension to your Airtable base and point it to the dev server URL.

### Backend Development

```bash
cd backend
npm install
cp .env.example .env.local
# Fill in your Lemon Squeezy credentials
npm run dev
```

The backend runs on `http://localhost:3001`.

### Deploying the Backend

```bash
cd backend
npx vercel
# Follow prompts, set environment variables in Vercel dashboard
```

Update `frontend/utils/api.ts` with your deployed backend URL.

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/license?baseId=...` | Check license/tier for a base |
| POST | `/api/archive` | Log an archive operation |
| GET | `/api/archive?baseId=...` | Get archive history |
| POST | `/api/billing/checkout` | Create Lemon Squeezy checkout |
| GET | `/api/billing/subscription?baseId=...` | Get subscription status |
| POST | `/api/billing/webhook` | Lemon Squeezy webhook handler |

## Pricing Tiers

| Feature | Free | Pro ($29/mo) | Team ($79/mo) |
|---------|------|-------------|---------------|
| Monthly records | 500 | Unlimited | Unlimited |
| Bases | 1 | 10 | Unlimited |
| Scheduled archives | ✗ | ✓ | ✓ |
| Team management | ✗ | ✗ | ✓ |
| Compliance features | ✗ | ✗ | ✓ |
| Support | Community | Priority | Dedicated |

## License

MIT
