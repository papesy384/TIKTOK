# Gap Analysis (PRD vs Codebase)

**Date:** February 2026  
**Reference:** PRD.md — TikTok Clone Infinite Vertical Snap-Feed

---

## 1. Discrepancies Found

### 1.1 PRD structure note
The PRD does not include explicit **"Features"** or **"Design Requirements"** sections. The following are derived from **Requirements (P0)**, **Technical Approach**, and **Success Metrics**.

### 1.2 Functional audit (missing or partial)

| PRD requirement / feature | Status before | Change made |
|---------------------------|---------------|-------------|
| Vertical snap-to-page scrolling | ✅ Implemented | — |
| Instant auto-play upon snapping | ✅ Implemented | — |
| Persistent UI overlays for metadata | ✅ Implemented | — |
| Double-tap gesture for engagement | ✅ Implemented | UI (heart) + backend: POST /api/engage, `lib/api/engage.ts`, Feed `onEngage` → HomeClient calls `engage(videoId, 'like')`. See `docs/ENGAGE_API.md`. |
| Video hosting via Cloudinary or Mux | ✅ Implemented | `lib/video-urls.ts` resolves `muxPlaybackId` → HLS (hls.js) and `cloudinaryPublicId` → optimized MP4. See `docs/VIDEO_HOSTING.md`. |
| Infinite feed / load more | ✅ Implemented | `useInfiniteVideos` + sentinel + `useNearBottom`; load more on scroll. |
| 100% snap accuracy | ✅ CSS snap | — |
| &lt;300ms playback latency | ✅ Measured | Time from `play()` to `playing` event; `onPlaybackLatency(id, ms)`; dev console log; target 300ms. |
| 10+ videos/session retention | ✅ Implemented | `useSessionRetention` + sessionStorage; `onVideoViewed` from VideoCard; toast at 10; see `docs/SESSION_RETENTION.md`. |

### 1.3 Robustness

| Gap | Change made |
|-----|-------------|
| No error handling for data fetching | `fetchVideos()` try/catch, timeout, `VideosApiError`; `useVideos` exposes `error` and `retry`. |
| No Loading state for list (feed) | `FeedLoading` component; Feed shows it when `isLoading`. |
| No Empty state for list | `FeedEmpty` component; Feed shows it when `videos.length === 0`. |
| No video-level error handling | `VideoCard` `onError` sets `videoError` and shows “Video unavailable”. |

### 1.4 UI/UX consistency

| Gap | Change made |
|-----|-------------|
| No explicit Design Requirements in PRD | Introduced design tokens in Tailwind: `feed.bg`, `feed.overlay`, `feed.text`, `feed.text-muted`, `feed-x` / `feed-y`, `overlay-padding`. |
| Layout not explicitly responsive | `sm:` breakpoints on hint and overlay; `h-screen-dynamic` (100dvh); viewport `viewportFit: "cover"`; `pb-safe` for safe area. |
| Typography / spacing not standardized | Spacing and overlay padding use design tokens; body uses `bg-feed-bg` and `text-feed-text`. |

### 1.5 Cleanup

| Gap | Change made |
|-----|-------------|
| Hardcoded `MOCK_VIDEOS` in page | Removed; feed data from `useVideos()` (API or fallback). |
| Fallback data source | `getFallbackVideos()` reads `NEXT_PUBLIC_FALLBACK_VIDEOS` (JSON array); no mock array in code. |
| `console.log` in double-tap handler | Removed; handler is a no-op skeleton for future engagement API. |

---

## 2. Files added/updated

- **Added:** `src/types/feed.ts` — `VideoItem`, `FeedResponse`, `FeedFetchResult`.
- **Added:** `src/lib/api/videos.ts` — `fetchVideos()`, error handling, timeout.
- **Added:** `src/lib/fallback-videos.ts` — `getFallbackVideos()` from env.
- **Added:** `src/hooks/useVideos.ts` — loading, error, retry, fallback.
- **Added:** `src/components/FeedLoading.tsx`, `FeedEmpty.tsx`, `FeedError.tsx`.
- **Added:** `.env.example` — `NEXT_PUBLIC_VIDEOS_API_URL`, `NEXT_PUBLIC_FALLBACK_VIDEOS`.
- **Added:** `docs/GAP_ANALYSIS.md` — this document.
- **Updated:** `Feed.tsx` — Loading/Empty/Error, design tokens, responsive hint, no `console.log`.
- **Updated:** `VideoCard.tsx` — `onError` and “Video unavailable” state.
- **Updated:** `Overlay.tsx` — design tokens, safe area, responsive icon size.
- **Updated:** `page.tsx` — client component using `useVideos(getFallbackVideos())`; no mock data.
- **Updated:** `tailwind.config.ts` — design tokens; safe-area and touch-target utilities.
- **Updated:** `globals.css` — `pb-safe`, feed colors.

---

## 3. How to use

- **API:** Set `NEXT_PUBLIC_VIDEOS_API_URL` to a GET endpoint returning `{ videos: VideoItem[], nextCursor?: string }`.
- **Fallback:** Set `NEXT_PUBLIC_FALLBACK_VIDEOS` to a JSON array of `VideoItem` (e.g. for dev or when API is down).
- **Empty feed:** If both are unset or API returns empty and fallback is empty, the Empty state is shown.
