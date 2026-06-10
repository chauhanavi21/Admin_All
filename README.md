# Agency Admin Panel

Central admin panel for managing apps, users, and settings. Built to connect to your projects later (Zaptax, Noir Bean Coffee, etc.).

## Stack

- **Client:** React + Vite + Tailwind (port `5180`)
- **Server:** Express + JWT (port `4000`)
- **Storage:** JSON file (`server/data/store.json`)

## Run

```bash
cd admin-panel
npm install
npm run dev
```

- Admin UI: http://localhost:5180
- API: http://localhost:4000/api/health

**Default login:** `admin@agency.local` / `admin123`

## Controllers (server)

| Controller | Route prefix | Purpose |
|------------|--------------|---------|
| `authController` | `/api/auth` | Login, logout, me |
| `dashboardController` | `/api/dashboard` | Stats & activity overview |
| `usersController` | `/api/users` | Admin user CRUD |
| `appsController` | `/api/apps` | Register apps to connect later |
| `settingsController` | `/api/settings` | Platform settings & activity log |

## Folder structure

```
admin-panel/
  server/
    controllers/     # Business logic — attach app APIs here later
    routes/          # Express routes → controllers
    middleware/      # Auth, errors
    services/        # Data store
    data/store.json  # Persistent JSON DB
  src/               # React admin UI
```

## Connecting apps later

1. Register the app under **Apps** (or use seeded entries).
2. Extend `appsController.testAppConnection` to call your app's API.
3. Add new controllers/routes per app as needed (e.g. `zaptaxController.js`).

Copy `.env.example` to `.env` and change `JWT_SECRET` before production.

## Deploy (Vercel + Render)

**Frontend → Vercel** · **API → Render**

Because this repo is a monorepo, set **Root Directory** to `admin-panel` on both platforms.

### 1. Render (API)

Create a **Web Service** (or use `render.yaml` Blueprint):

| Setting | Value |
|---------|--------|
| Root Directory | `admin-panel` |
| Build Command | `npm install --omit=dev` |
| Start Command | `npm start` |
| Health Check | `/api/health` |

**Environment variables (Render):**

```env
JWT_SECRET=long-random-production-secret
JWT_EXPIRES=7d
CLIENT_ORIGIN=https://your-admin.vercel.app
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=strong-password-here
ALLOW_VERCEL_PREVIEWS=true
```

Optional for extra preview URLs:

```env
CORS_ORIGINS=https://your-admin.vercel.app,https://your-admin-git-main.vercel.app
```

Do **not** set `PORT` on Render — it is assigned automatically.

After deploy, test: `https://your-api.onrender.com/api/health`

> **Note:** Data is stored in `server/data/store.json`. On Render’s free tier the filesystem is ephemeral — redeploys reset data and re-seed the default admin from env vars.

### 2. Vercel (frontend)

Import the repo as a **Vite** project:

| Setting | Value |
|---------|--------|
| Root Directory | `admin-panel` |
| Build Command | `npm run build` |
| Output Directory | `dist` |

**Environment variable (Vercel):**

```env
VITE_API_URL=https://your-api.onrender.com/api
```

`vercel.json` is included for React Router SPA routing.

Redeploy Vercel whenever `VITE_API_URL` changes — Vite bakes it in at build time.

### Env summary

| Variable | Local | Render | Vercel |
|----------|-------|--------|--------|
| `JWT_SECRET` | ✅ | ✅ | ❌ |
| `JWT_EXPIRES` | ✅ | ✅ | ❌ |
| `ADMIN_EMAIL` | optional | ✅ | ❌ |
| `ADMIN_PASSWORD` | optional | ✅ | ❌ |
| `CLIENT_ORIGIN` | optional | ✅ | ❌ |
| `CORS_ORIGINS` | optional | optional | ❌ |
| `ALLOW_VERCEL_PREVIEWS` | optional | ✅ | ❌ |
| `PORT` | ✅ | ❌ (auto) | ❌ |
| `VITE_API_URL` | ✅ | ❌ | ✅ |
