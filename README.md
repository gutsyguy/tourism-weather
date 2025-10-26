## Weather Insights

An end-to-end web app that explores ASOS historical weather observations via an interactive map and timeline, built to demonstrate full‑stack product skills.

- Live demo: tourism-weather.vercel.app (Unfortunately doesn't work anymore because I cannot afford railway)

### Highlights

- Interactive map of stations with drill‑down views
- Historical weather explorer with charts and responsive UI
- Backend proxy with validation, retries, and CORS
- Handles rate limits (20/min) and intermittent data corruption gracefully

---

## Project structure

```
backend/    # Ruby on Rails API proxy, validators, CORS, caching
frontend/   # Next.js (App Router) UI: Map, Charts, UX
start.sh    # Helper to boot the Rails server locally
railway.json# Railway configuration for backend deployment
```

Key frontend files:

- `frontend/src/components/Map.tsx`
- `frontend/src/components/Chart.tsx`
- `frontend/src/components/Modal.tsx`
- `frontend/src/context/MapContext.tsx`, `frontend/src/context/StationsContext.tsx`

Key backend files:

- `backend/app/controllers/api/station_controller.rb`
- `backend/app/controllers/api/weather_observation_controller.rb`
- `backend/app/validator/*`
- `backend/config/routes.rb`

---

## External API

Base URL: `https://sfc.windbornesystems.com`

- `GET /stations`
- `GET /historical_weather?station={station_id}`

Observed constraints: 20 requests/min; occasional corrupted rows.

---

## Backend API (Rails proxy)

The backend provides a thin proxy with validation, retry, and response shaping. Routes (see `backend/config/routes.rb`):

- `GET /api/station` — basic station info endpoint
- `GET /api/stations/:station/weather` — historical weather for a station
- `POST /api/places/place`— auxiliary example endpoints

Behavior:

- Normalizes/filters obviously invalid records (e.g., impossible ranges)
- Adds retry with jitter for transient failures
- Sends cache and CORS headers suitable for the frontend

---

## Frontend (Next.js)

- Fetches station list and renders an interactive map
- On station selection, requests historical weather and renders charts
- Client‑side caching and request de‑duplication for snappy UX

Environment:

- `NEXT_PUBLIC_API_BASE_URL` (optional). Defaults to `http://localhost:3000` during local development.

---

## Local development

Prerequisites: Ruby 3.x + Bundler, Node 18+, npm or pnpm.

1. Backend (Rails)

```bash
cd backend
bundle install
bin/rails db:prepare
bin/rails server -b 0.0.0.0 -p 3000
```

Runs on http://localhost:3000

Alternatively, you can use the provided helper script:

```bash
./start.sh
```

This installs gems, runs migrations, and boots the Rails server on `$PORT`.

2. Frontend (Next.js)

```bash
cd frontend
npm install
npm run dev
```

Runs on http://localhost:3000 by default. If your Rails backend is also on 3000, pass a different port:

```bash
npm run dev -- -p 3001
```

Open the app in your browser and ensure the frontend can reach the backend (`NEXT_PUBLIC_API_BASE_URL=http://localhost:3000`).

---

## Deployment

Backend (Railway): `railway.json` is configured to run the Rails server.

- Build: `bundle install`
- Start: `bin/rails server -b 0.0.0.0 -p $PORT`

Frontend (Vercel/Netlify): deploy the `frontend/` app.

- Set `NEXT_PUBLIC_API_BASE_URL` to your deployed backend URL
- Enable caching of station list via standard `Cache-Control` headers

---

## DevOps

Environments:

- Dev: local (Rails on :3000, Next.js on :3001)
- Prod: Backend on Railway, Frontend on Vercel

CI/CD:

- GitHub Actions (suggested):
  - Lint/test on PRs for `backend/` and `frontend/`
  - On merge to `main`: deploy backend to Railway and frontend to Vercel

Secrets & config:

- Backend: Configure in Railway project variables (e.g., `RAILS_ENV`, `RAILS_MASTER_KEY` if credentials are used)
- Frontend: `NEXT_PUBLIC_API_BASE_URL` in Vercel Project Settings → Environment Variables

Caching & performance:

- Backend: set `Cache-Control` for `/api/station(s)` responses
- Frontend: client cache and request de‑duplication for stations list

Observability:

- Logging: Rails logs to stdout; configure Railway log retention/alerts
- Metrics/Tracing (optional): Add Rack middleware (Skylight/NewRelic/OpenTelemetry)
- Frontend: enable Vercel Analytics if desired

Reliability:

- Timeouts/retries with jitter on external API calls
- Basic circuit‑breaker behavior recommended if upstream errors spike

Scaling:

- Backend is stateless; scale horizontally on Railway
- Frontend is static/edge cached on Vercel

Runbooks:

- Incident: Check Railway service health and logs; verify external API availability
- Hotfix: Patch branch → deploy backend; frontend redeploy only if API surface changed
- Rate limit exceed: Reduce polling frequency, validate batching/de‑duplication, confirm upstream 20/min policy

---

## Rate limits and data quality

- Throttling: Requests are batched/deduplicated on the client; the backend adds basic retry with jitter.
- Corrupted records: The proxy drops or repairs entries that fail validation and returns partial data with warnings when applicable. The UI renders gaps with transparent affordances.

---

## Testing

Rails:

```bash
cd backend
bin/rails test
```

Frontend (if configured):

```bash
cd frontend
npm test
```

---

## Roadmap (next steps)

- Compare multiple stations side‑by‑side
- Unit toggles and derived metrics (heat index, wind chill)
- Offline cache for last-viewed stations
- CSV export and shareable deep links
