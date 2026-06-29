# Just-In-Time Consultancy

A premium full-stack business website for a global procurement consultancy, with a public-facing landing page, multi-step request form, and a secure admin dashboard.

## Run & Operate

- `PORT=8080 pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- `PORT=22870 BASE_PATH=/ pnpm --filter @workspace/jit-website run dev` — run the frontend (port 22870)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/scripts run seed-admin` — seed admin user (username: admin, password: admin123)
- Required env: `DATABASE_URL`, `SESSION_SECRET`, `PORT`

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite + Tailwind CSS + shadcn/ui + Framer Motion + Recharts
- API: Express 5 + tsx (dev), esbuild (production)
- DB: PostgreSQL + Drizzle ORM
- Session: express-session + connect-pg-simple (PostgreSQL session store)
- Validation: Zod, drizzle-zod
- API codegen: Orval (from OpenAPI spec)

## Where things live

- `artifacts/jit-website/` — React frontend
  - `src/pages/Home.tsx` — Full landing page (10 sections)
  - `src/pages/Request.tsx` — Multi-step procurement request form (4 steps)
  - `src/pages/admin/Login.tsx` — Admin login page
  - `src/pages/admin/Dashboard.tsx` — Admin dashboard (Overview + Requests tabs)
- `artifacts/api-server/` — Express API
  - `src/routes/requests.ts` — Public procurement request submission
  - `src/routes/contact.ts` — Contact form submission
  - `src/routes/admin.ts` — Admin auth + request management + analytics
  - `src/app.ts` — Express app setup with session middleware
- `lib/db/src/schema/index.ts` — Database schema (serviceRequests, adminUsers, contactMessages)
- `lib/api-spec/` — OpenAPI spec (source of truth for codegen)
- `scripts/src/seed-admin.ts` — Admin user seeding script

## Architecture decisions

- Contract-first: OpenAPI spec → Orval codegen → React Query hooks + Zod schemas used throughout
- Session auth for admin: PostgreSQL-backed sessions via connect-pg-simple
- tsx for API dev mode: single process with proper SIGTERM propagation (avoids port collision on restart)
- Admin seeded via script, not env vars, for flexibility
- CSV export is client-side (built from the already-fetched requests list)

## Product

**Public site**: Full landing page at `/` with Hero, About (with timeline), Services (8 cards), Why Choose Us (8 points), interactive 7-step Process, 8 Industry cards, animated Statistics counters, 4 Testimonials, 8-item FAQ accordion, Contact form, and Footer.

**Request form**: Multi-step form at `/request` (Company Info → Product Info → Requirements → Confirmation), generates a unique request ID (format: `JIT-TIMESTAMP-RANDOM`).

**Admin portal**: Protected at `/admin` (login) and `/admin/dashboard`. Overview tab shows 5 stat cards + BarChart by category + LineChart monthly trend + recent requests. Requests tab shows searchable/filterable table with pagination, edit modal (status + notes), delete, and CSV export.

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- **tsx for API dev**: The `dev` script uses `tsx` (not build+start) to avoid port EADDRINUSE on workflow restarts. Never revert to build+start for dev.
- **Port 8080 after crashes**: If port 8080 is stuck after a crash, find and kill via `/proc/net/tcp` inode lookup (fuser/lsof/ss/netstat are not available in this environment).
- **Admin credentials**: username=`admin`, password=`admin123`. Re-run `pnpm --filter @workspace/scripts run seed-admin` to reset.
- **zod import**: Use `"zod"` (not `"zod/v4"`) in server route files.
- **Express 5 params types**: `req.params.id` is typed as `string | string[]` — always cast with `String(req.params.id)`.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
