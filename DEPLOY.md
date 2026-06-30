# Deploy to Render

This app runs as **one Web Service** on Render: Express serves the API at `/api` and the React frontend as static files. Admin session cookies work because everything is on the same domain.

Repo: [https://github.com/Isaacdev2004/just-in-consultancy](https://github.com/Isaacdev2004/just-in-consultancy)

---

## What you need

| Resource | Purpose |
|----------|---------|
| **Render account** | [render.com](https://render.com) |
| **GitHub repo** | Connected to Render for auto-deploy |
| **PostgreSQL** | Render managed database (free tier available) |
| **Environment variables** | See below |

---

## Required environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string (auto-linked from Render Postgres) |
| `SESSION_SECRET` | Yes | Long random string for session encryption (min 32 chars) |
| `NODE_ENV` | Yes | Set to `production` |
| `PORT` | Auto | Render sets this automatically — do not hardcode |

**Generate a session secret** (run locally):

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## Option A — Blueprint (recommended)

The repo includes `render.yaml` for one-click setup.

1. Go to [Render Dashboard](https://dashboard.render.com) → **New** → **Blueprint**
2. Connect GitHub and select `Isaacdev2004/just-in-consultancy`
3. Render creates:
   - **Web Service** — `just-in-consultancy`
   - **PostgreSQL** — `just-in-consultancy-db`
4. Review env vars (Render auto-generates `SESSION_SECRET` and links `DATABASE_URL`)
5. Click **Apply**

First deploy takes ~5–10 minutes (install + build + DB schema push + admin seed).

---

## Option B — Manual setup

### Step 1: Create PostgreSQL

1. **New** → **PostgreSQL**
2. Name: `just-in-consultancy-db`
3. Plan: **Free** (or paid for production)
4. Region: choose closest to your users
5. Create database
6. Copy the **Internal Database URL** (for services in the same region)

### Step 2: Create Web Service

1. **New** → **Web Service**
2. Connect repo: `Isaacdev2004/just-in-consultancy`
3. Settings:

| Setting | Value |
|---------|-------|
| **Name** | `just-in-consultancy` |
| **Region** | Same as database |
| **Branch** | `main` |
| **Runtime** | Node |
| **Build Command** | `pnpm install && pnpm run build:render` |
| **Start Command** | `pnpm run start:render` |
| **Health Check Path** | `/api/healthz` |

4. **Environment** → Add:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `SESSION_SECRET` | *(your generated secret)* |
| `DATABASE_URL` | *(paste Internal Database URL from Step 1)* |

5. **Create Web Service**

---

## After deploy

### Verify

- **Site:** `https://<your-service>.onrender.com/`
- **API health:** `https://<your-service>.onrender.com/api/healthz` → `{"status":"ok"}`
- **Request form:** `/request`
- **Admin login:** `/admin`

### Default admin credentials

| Field | Value |
|-------|-------|
| Username | `admin@justinconsultancy.com` |
| Password | `Admin@123!` |

Re-run `pnpm --filter @workspace/scripts run seed-admin` to reset the password after deploy.

### Custom domain (optional)

1. Web Service → **Settings** → **Custom Domains**
2. Add your domain and follow DNS instructions
3. Render provisions HTTPS automatically

---

## Build pipeline (what Render runs)

```bash
pnpm install
pnpm run build:render
# which runs:
#   1. Build React frontend → artifacts/jit-website/dist/public
#   2. Build API server     → artifacts/api-server/dist/
#   3. Push DB schema       → drizzle-kit push
#   4. Seed admin user      → admin@justinconsultancy.com
```

Start command:

```bash
pnpm run start:render
# → node artifacts/api-server/dist/index.mjs (serves /api + static site)
```

---

## Free tier notes

- **Web Service** spins down after ~15 min inactivity; first request may take 30–60s (cold start)
- **PostgreSQL free** expires after 90 days (upgrade to paid for production)
- For a client-facing site, consider the **Starter** plan ($7/mo) to avoid cold starts

---

## Troubleshooting

### Build fails on `pnpm install`

Render uses Linux — the `preinstall` script works there. If you see pnpm errors, ensure `pnpm-lock.yaml` is committed.

### `DATABASE_URL must be set`

Link the Postgres database to the web service, or paste the Internal Database URL manually.

### Admin login fails / session not persisting

- Confirm `SESSION_SECRET` is set
- Confirm `NODE_ENV=production`
- Use HTTPS (Render provides this by default)
- Frontend and API must be on the **same** Render service URL (do not split into separate static + API services without code changes)

### `relation does not exist` errors

Re-run deploy or manually run:

```bash
pnpm --filter @workspace/db run push
pnpm --filter @workspace/scripts run seed-admin
```

Use Render **Shell** (paid plans) or trigger a redeploy.

### Port errors

Do not set `PORT` manually — Render injects it automatically.

---

## Local production test (before deploying)

```bash
# Set env vars
export DATABASE_URL="postgresql://..."
export SESSION_SECRET="your-local-test-secret"
export NODE_ENV=production
export PORT=8080

pnpm install
pnpm run build:render
pnpm run start:render
```

Open `http://localhost:8080`
