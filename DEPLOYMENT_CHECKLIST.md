# ArchiveBase Deployment Checklist

## 1. Backend Deployment (Vercel)

- [ ] `cd backend && npm install`
- [ ] Deploy to Vercel: `npx vercel` (or connect GitHub repo)
- [ ] Set environment variables in Vercel dashboard:
  - `LEMONSQUEEZY_API_KEY` — Your Lemon Squeezy API key
  - `LEMONSQUEEZY_STORE_ID` — Your store ID
  - `LEMONSQUEEZY_PRO_VARIANT_ID` — Variant ID for Pro plan
  - `LEMONSQUEEZY_TEAM_VARIANT_ID` — Variant ID for Team plan
  - `LEMONSQUEEZY_WEBHOOK_SECRET` — Webhook signing secret
- [ ] Note the deployed URL (e.g., `https://archivebase-api.vercel.app`)
- [ ] Update `frontend/utils/api.ts` → set `API_BASE` to your deployed URL

## 2. Lemon Squeezy Setup

- [ ] Create a Lemon Squeezy account at https://lemonsqueezy.com
- [ ] Create a Store
- [ ] Create two Products:
  - **ArchiveBase Pro** — $29/month subscription
  - **ArchiveBase Team** — $79/month subscription
- [ ] Note the Variant IDs for each product (set in Vercel env vars)
- [ ] Set up Webhook:
  - URL: `https://your-backend.vercel.app/api/billing/webhook`
  - Events: `subscription_created`, `subscription_updated`, `subscription_cancelled`, `subscription_expired`
  - Note the signing secret (set as `LEMONSQUEEZY_WEBHOOK_SECRET`)
- [ ] Switch from test mode to live mode when ready

## 3. Database (Optional but Recommended)

The current backend uses in-memory storage (resets on cold start). For production:

- [ ] Add a database (Supabase, PlanetScale, Vercel KV, etc.)
- [ ] Update `backend/lib/storage.ts` to use persistent storage
- [ ] Migrate subscription data from Lemon Squeezy webhooks

## 4. Extension Publishing

- [ ] Update `frontend/utils/api.ts` with production backend URL
- [ ] Test the extension end-to-end:
  - [ ] Dashboard loads and shows stats
  - [ ] Archive rules can be created/toggled/deleted
  - [ ] Archive scan finds matching records
  - [ ] Archive + CSV export works
  - [ ] Pricing page loads, upgrade button creates checkout
  - [ ] License check returns correct tier
- [ ] Build the extension: `block release`
- [ ] Submit to Airtable Marketplace:
  - Go to https://airtable.com/developers/extensions
  - Fill in extension details, screenshots, description
  - Submit for review

## 5. Post-Launch

- [ ] Monitor Vercel logs for errors
- [ ] Set up error tracking (Sentry, etc.)
- [ ] Create landing page / marketing site
- [ ] Set up customer support channel
- [ ] Plan v1.1 features:
  - [ ] Scheduled/automated archives
  - [ ] Cloud storage for archived data (S3/GCS)
  - [ ] Restore from archive
  - [ ] Audit logs for Team plan
  - [ ] Custom retention policies
