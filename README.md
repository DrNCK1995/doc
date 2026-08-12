# Dr. Chaitanya Krishna — Portfolio & Pediatric Growth Monitor

Production-ready Next.js application combining a pediatrician portfolio with a clinical **Pediatric Growth Monitoring** workspace for Indian children.

Parents can register a child, enter measurements, view **WHO (0–5y)** / **IAP (5–18y)** growth charts, see nutritional interpretation, add unlimited follow-ups, and download **PDF / CSV** reports — no login required.

## Features

- Human-readable immutable Patient IDs (`ARJ202608121430-001`) — UUID primary keys never exposed
- Automatic age (Y/M/D), BMI, LMS Z-scores & percentiles
- WHO Child Growth Standards (birth–5 years) and IAP Growth Charts (5–18 years)
- Longitudinal visits (never overwritten)
- Clinical interpretation with green / yellow / orange / red coding
- Interactive Recharts (WFA, HFA, BMI, WFH, HC, velocity)
- Search by Patient ID, name, mobile, DOB
- PDF + CSV export, print report, Patient ID QR
- Optional admin cookie auth
- Vaccination + developmental milestone models (extensible)
- Versioned LMS reference datasets (JSON + DB import)
- Docker Compose (PostgreSQL + app) and local embedded Postgres script
- Dark mode, responsive hospital-grade blue/white UI

## Stack

| Layer | Tech |
|-------|------|
| Frontend | Next.js 15, React 19, TypeScript, Tailwind CSS 4, shadcn-style UI, Recharts |
| Backend | Next.js Route Handlers |
| Database | PostgreSQL + Prisma ORM |
| PDF | jsPDF + autotable |
| Deploy | Docker / Vercel (+ managed Postgres) |

## Quick start (local, no Docker)

Requires Node.js 20+.

```bash
# Install
npm install

# Start embedded PostgreSQL (terminal 1) — uses port 54329
npm run db:local

# Point .env at embedded DB (already written to .env.local.db by the script)
# Or set:
# DATABASE_URL="postgresql://postgres:postgres@127.0.0.1:54329/growth_monitor?schema=public"

cp .env.example .env   # then update DATABASE_URL if needed

# Migrate + seed (terminal 2)
npx prisma migrate dev
npm run db:seed

# Run app
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

- Portfolio home with **Growth Monitoring** entry
- Growth app: [http://localhost:3000/growth](http://localhost:3000/growth)
- Sample patients from seed (IDs printed in seed output)

Admin password (optional): value of `ADMIN_PASSWORD` in `.env` (default `admin123`).

## Docker

```bash
docker compose up --build
```

App: http://localhost:3000 · Postgres: localhost:5432

Then seed once:

```bash
docker compose exec app npx prisma db seed
# or from host with DATABASE_URL pointing at localhost:5432
npm run db:seed
```

## Environment

See `.env.example`:

| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | PostgreSQL connection string |
| `PATIENT_ID_PREFIX` | Clinic code for Patient IDs (default `ARJ`) |
| `ADMIN_PASSWORD` | Optional admin gate |
| `NEXT_PUBLIC_APP_URL` | Public base URL |

## Growth references (versioned)

LMS datasets live under `data/growth-references/`:

```
data/growth-references/
  who-2006/   # WHO Child Growth Standards 2006 (0–60 months)
  iap-2015/   # IAP 2015 charts (60–216 months)
```

Each folder has a `manifest.json` plus indicator JSON files (`weight-for-age.json`, etc.).  
Re-generate or replace files, then re-run `npm run db:seed` (or a dedicated import) — **no application code changes** required for new versions.

Regenerate from anchors:

```bash
npm run lms:generate
```

Z-scores use the official LMS method; percentiles use the normal CDF.

## API overview

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/patients` | Register child + first visit |
| GET | `/api/patients?q=` | Search |
| GET/PATCH | `/api/patients/[patientId]` | Fetch / update |
| GET/POST | `/api/patients/[patientId]/visits` | List / add follow-up |
| GET | `/api/patients/[patientId]/charts` | Chart payloads |
| GET | `/api/patients/[patientId]/export/pdf` | PDF report |
| GET | `/api/patients/[patientId]/export/csv` | CSV export |
| POST/DELETE | `/api/auth/admin` | Admin login / logout |
| GET | `/api/health` | Health check |

## Project structure

```
src/
  app/                 # Portfolio + /growth pages + API routes
  components/          # UI, growth charts, forms
  lib/
    growth/            # LMS engine, interpretation, reference loader
    services/          # Patient, visit, chart, export services
    validations/       # Zod schemas
  hooks/
data/growth-references/
prisma/                # Schema, migrations, seed
scripts/               # LMS generator, embedded Postgres
legacy/                # Previous static HTML portfolio
```

## Vercel deployment

1. Create a managed Postgres (Neon, Supabase, Vercel Postgres).
2. Set `DATABASE_URL`, `ADMIN_PASSWORD`, `PATIENT_ID_PREFIX`, `NEXT_PUBLIC_APP_URL`.
3. Build command: `prisma generate && prisma migrate deploy && next build`
4. Run seed once against production DB: `npm run db:seed`

## Screenshots / demo flow

1. Open `/` → click **Pediatric Growth Monitoring**
2. Register a child or search a seeded Patient ID
3. View dashboard Z-scores, charts, alerts
4. Add follow-up → new points on charts
5. Export PDF / CSV / Print

## Clinical notes

- Charts use **WHO** under 5 years and **IAP** from 5–18 years (never CDC).
- LMS JSON is anchored to published WHO/IAP-style parameters for clinical demos; replace with full official table dumps for regulatory deployments.
- This tool supports clinical workflow — it does not replace professional medical judgment.

## License

Private clinic demo for Dr. Chaitanya Krishna.
