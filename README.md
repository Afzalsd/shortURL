# relay — URL shortener

A full-stack URL shortener: paste a link, get a short code, and see click
analytics (referrer, location, browser, device) as people use it.

## Stack

- **Backend:** Node.js, Express, MongoDB (Mongoose)
- **Frontend:** React (Vite), Tailwind CSS, Recharts

## Project structure

```
url-shortener/
  backend/     Express API + redirect server
  frontend/    React dashboard (Vite)
```

## Running locally

### 1. MongoDB

You need a MongoDB instance — either local (`mongod`) or a free
[MongoDB Atlas](https://www.mongodb.com/atlas) cluster.

### 2. Backend

```bash
cd backend
cp .env.example .env      # edit MONGODB_URI if needed
npm install
npm run dev                # http://localhost:3000
```

### 3. Frontend

```bash
cd frontend
npm install
npm run dev                # http://localhost:5173
```

The Vite dev server proxies `/api` to `http://localhost:3000`, so just open
`http://localhost:5173`.

## API

| Method | Path                          | Description                                              |
|--------|-------------------------------|------------------------------------------------------------|
| POST   | `/api/urls`                   | Create a short URL (`url`, optional `shortcode`). Always expires 4 hours after creation. |
| GET    | `/api/urls?limit=10`          | List the most recently created short URLs (default limit 10) |
| GET    | `/api/urls/:shortcode/stats`  | Full click analytics for one shortcode                     |
| GET    | `/:shortcode`                 | Redirect + record a click                                   |

## Behavior notes

- Every link is active for a fixed **4 hours** (`LINK_LIFETIME_MINUTES` in `.env`), then requests to it 404 automatically — no cron job needed, the check happens at redirect/list time against `expiryDate`.
- The homepage polls `GET /api/urls?limit=10` every 5 seconds to show a live "recently shortened worldwide" feed of the last 10 links created by anyone.
- No authentication — all links are public and visible in that feed. A natural next step is user accounts (JWT) so people only see their own links in a private dashboard.
- Storage is MongoDB (persistent), replacing the original in-memory `Map`.
- Deploy: backend to Render/Railway/Fly, frontend to Vercel/Netlify, set `BASE_URL` (backend) and `CORS_ORIGIN` accordingly.
