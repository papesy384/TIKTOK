# Double-tap engagement API

## Overview

Double-tap on a video records a **like** (or other action) via `POST /api/engage`. The UI (heart animation) is unchanged. The backend (1) persists to an in-memory store and (2) optionally forwards to an external URL.

## API

**POST /api/engage**

- **Body:** `{ "videoId": string, "action": string }`
- **Actions:** `"like"` | `"unlike"` (allowlist in the route)
- **Success:** `200` with `{ ok: true, videoId, action }`
- **Errors:** `400` for missing/invalid body or unsupported action
- **Persistence:** Each event is appended to a server-side in-memory store (capped at 100). If `ENGAGEMENT_SERVICE_URL` is set, the same payload is POSTed to that URL (5s timeout).

**GET /api/engage?limit=20**

- Returns `{ engagements: Array<{ videoId, action, at }> }` (most recent first). Use for debugging or to drive a “liked” state. `limit` default 20, max 100.

## Client

- **`engage(videoId, action?)`** in `src/lib/api/engage.ts` — POSTs to `/api/engage`; `action` defaults to `"like"`. Throws `EngageApiError` on non-ok response.

## Wiring

- **VideoCard** → **Feed** `handleDoubleTap(id)` → **Feed** calls **`onEngage?.(id)`** → **HomeClient** passes **`handleEngage`**, which calls **`engage(id, "like")`**. Failures are caught (fire-and-forget); you can add a toast or retry if needed.

## Persistence

- **In-memory store** (`src/lib/engagement-store.ts`): Events are pushed to an array (max 100). Survives until the server restarts. Use GET `/api/engage` to read recent engagements.
- **External service:** Set `ENGAGEMENT_SERVICE_URL` in `.env.local`. Each POST to `/api/engage` is forwarded there (same JSON body). Use this to write to your DB or analytics pipeline.
- **Replace with a DB:** Swap `engagement-store` for a Prisma/Drizzle model or any DB client; keep the same `recordEngagement` call in the route.

## Extending

- **Auth:** Add session or token validation in the route and send `userId` in the payload or headers to your engagement service.
- **More actions:** Extend the `allowed` array (e.g. `"save"`, `"share"`) and call `engage(videoId, action)` from the right UI handlers.
