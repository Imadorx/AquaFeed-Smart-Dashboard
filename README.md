# AquaFeed Smart Dashboard

A full-stack IoT dashboard that simulates a solar-powered hydroponic smart farm: live environmental telemetry, automated irrigation and cooling, anomaly alerts, and historical analytics — built for a hackathon demo, structured like a real industrial product.

---

## 1. Tech Stack

**Frontend** — React 18, TypeScript, Vite, TailwindCSS, React Router, Axios, Socket.io Client, Recharts, Lucide React
**Backend** — Node.js, Express, TypeScript, Socket.io, MongoDB, Mongoose

---

## 2. Architecture

Both the realtime engine and the REST API sit on top of the same Clean Architecture layering:

```
Routes  →  Controllers  →  Services  →  Repositories  →  Models  →  MongoDB
                                ↑
                    Simulation Engine (physics)
                                ↓
                    Automation Engine (thresholds)
                                ↓
                    Socket.io  →  emits "dashboard:update" every second
```

- **Models** define the Mongoose schemas only.
- **Repositories** are the only layer allowed to touch Mongoose — every query lives here.
- **Services** hold all business logic (simulation physics, automation decisions, alert lifecycle, analytics, settings validation). Controllers never contain logic.
- **Controllers** translate HTTP in/out and delegate to services.
- **Realtime runtime** (`server/src/realtime/simulationRuntime.ts`) is the tick loop: every second it advances the simulation, runs automation, evaluates alerts, and emits the new snapshot over Socket.io. Once an hour it persists a snapshot to MongoDB — raw per-second data is intentionally never stored.

```
┌─────────────────────────────┐        ┌──────────────────────────────┐
│           CLIENT            │        │            SERVER             │
│  React + Vite + Tailwind    │        │  Express + Socket.io + Mongo  │
│                              │ REST   │                                │
│  Dashboard / Analytics /    │◄──────►│  /api/dashboard /history       │
│  Alerts / Settings pages    │        │  /api/alerts /pump /settings   │
│                              │ WS     │                                │
│  useRealtimeDashboard hook  │◄──────►│  Socket.io "dashboard:update"  │
└─────────────────────────────┘        └──────────────────────────────┘
                                                     │
                                          ┌──────────┴──────────┐
                                          │  Simulation Engine  │
                                          │  Automation Engine  │
                                          │  Reminder Engine    │
                                          └──────────┬──────────┘
                                                     │
                                              ┌──────┴──────┐
                                              │  MongoDB    │
                                              │  4 collections │
                                              └─────────────┘
```

---

## 3. Folder Structure

```
aquafeed/
├── server/
│   ├── src/
│   │   ├── config/          env loading, MongoDB connection
│   │   ├── models/          Mongoose schemas (SensorData, Alert, Settings, SystemLog)
│   │   ├── repositories/    all database access, one file per collection
│   │   ├── services/        business logic: simulation, automation, alerts,
│   │   │                    dashboard, analytics, settings, system health, reminders
│   │   ├── controllers/     thin HTTP handlers
│   │   ├── routes/          Express routers, mounted under /api
│   │   ├── realtime/        Socket.io server + the tick-loop runtime
│   │   ├── middleware/      error handling
│   │   ├── types/           shared domain types
│   │   └── server.ts        app bootstrap
│   ├── package.json
│   └── tsconfig.json
│
└── client/
    ├── src/
    │   ├── components/
    │   │   ├── ui/          Button, Toggle, Badge, GlassCard primitives
    │   │   ├── layout/      Sidebar, Navbar, MobileNav, AppShell
    │   │   ├── dashboard/   sensor/actuator cards, system health ring, reminder, pump control
    │   │   ├── charts/      reusable Recharts history chart
    │   │   └── alerts/      alert row component
    │   ├── pages/           DashboardPage, AnalyticsPage, AlertsPage, SettingsPage
    │   ├── hooks/           useRealtimeDashboard, useHistory
    │   ├── services/        apiClient (Axios), api.ts, socket.ts
    │   ├── context/         ThemeContext (dark/light mode)
    │   ├── types/           shared domain types (mirrors backend)
    │   └── lib/              cn(), formatting helpers
    ├── package.json
    └── tailwind.config.js
```

---

## 4. Installation

### Prerequisites
- Node.js 18+
- A MongoDB instance (local `mongod`, Docker, or MongoDB Atlas)

### Backend

```bash
cd server
cp .env.example .env      # edit MONGODB_URI if needed
npm install
npm run dev                # starts on http://localhost:4000
```

### Frontend

```bash
cd client
cp .env.example .env       # points VITE_API_URL at the backend
npm install
npm run dev                 # starts on http://localhost:5173
```

Open `http://localhost:5173`. The dashboard connects over Socket.io automatically and the simulation starts producing live readings the moment the server boots — no seed data required.

> **Demo tip:** the spec calls for hourly MongoDB snapshots (never per-second), so the Analytics charts will be empty for the first hour on a fresh instance. For a live hackathon demo, temporarily lower `SNAPSHOT_INTERVAL_MS` in `server/.env` (e.g. to `60000` for a snapshot a minute) so charts fill in visibly during judging.

---

## 5. API Documentation

All routes are prefixed with `/api`. All responses are JSON.

| Method | Endpoint | Description |
|---|---|---|
| GET | `/dashboard` | Latest sensor reading + system health + active alert count + next irrigation countdown |
| GET | `/history?hours=24` | Hourly-snapshotted sensor readings for the given window (default 24h, max 30d) |
| GET | `/history/statistics` | Daily and weekly averages for temperature, humidity, water level, solar power |
| GET | `/alerts` | Currently active (unresolved) alerts |
| GET | `/alerts/history?limit=100` | Most recent alerts, resolved or not |
| POST | `/alerts/:id/resolve` | Marks an alert as resolved |
| POST | `/pump/on` | Manually turns the pump on (409 if automation is enabled) |
| POST | `/pump/off` | Manually turns the pump off (409 if automation is enabled) |
| GET | `/settings` | Current thresholds and automation config |
| PUT | `/settings` | Update thresholds, automation toggle, or reminder interval |
| GET | `/health` | Liveness check (outside `/api`) |

**Socket.io event:** the server emits `dashboard:update` once per second with the same shape as `GET /dashboard`. The client's `useRealtimeDashboard` hook bootstraps with a REST call, then switches to the socket stream.

**Alert types:** `HIGH_TEMPERATURE`, `LOW_WATER`, `PUMP_FAILURE`, `COOLING_FAILURE`, `HUMIDITY_TOO_LOW`, `IRRIGATION_REMINDER`.
**System health:** `healthy` (no active alerts), `warning` (an active warning alert), `critical` (an active critical alert).

---

## 6. Automation Logic

When automation is enabled (default, toggle in Settings):
- Humidity below threshold → pump ON. Above threshold → pump OFF.
- Temperature above threshold → cooling ON. Below threshold → cooling OFF.
- Water level below 20% → the recycling system kicks in automatically and a critical `LOW_WATER` alert fires.
- Pump running but humidity not recovering for an extended period → `PUMP_FAILURE` alert.
- Cooling running but temperature keeps climbing → `COOLING_FAILURE` alert.
- Every `notificationIntervalHours` (default 4h) → an `IRRIGATION_REMINDER` alert with a live countdown on the dashboard.

When automation is disabled, the pump/cooling hold their last state and the manual `/pump/on` and `/pump/off` endpoints take direct control.

---

## 7. Deployment Guide

### Backend
1. `npm run build` (compiles to `server/dist`).
2. Set production env vars: `MONGODB_URI` (Atlas or managed Mongo), `CLIENT_ORIGIN` (your deployed frontend URL), `PORT`.
3. `npm start` runs `dist/server.js`. Deployable as-is to any Node host (Render, Railway, Fly.io, a VPS with PM2, or a container).
4. Ensure the platform allows long-lived WebSocket connections for Socket.io.

### Frontend
1. Set `VITE_API_URL` to the backend's public URL.
2. `npm run build` produces a static `client/dist` bundle.
3. Deploy `dist` to any static host (Vercel, Netlify, Cloudflare Pages, S3+CDN, or served by the backend itself via `express.static`).

### Docker (optional pattern)
Run MongoDB, the backend, and the frontend as three services — a `docker-compose.yml` with a `mongo:7` image, a Node 18-alpine image running `server`, and an Nginx or Node static server for the built `client/dist`, wired together with the env vars above.

---

## 8. Known Constraints

- The simulation is fully deterministic-with-jitter, not fed by real hardware — it's designed to behave like a believable hydroponic bay (gradual temperature drift, a compressed day/night solar cycle, water depletion and recycling) rather than emit random noise.
- Per the spec, only hourly snapshots are persisted; per-second data lives only in memory and over the socket stream.
- Manual pump control is intentionally blocked while automation is enabled, to avoid the automation loop silently overriding a manual command every second — this is called out in the UI.
