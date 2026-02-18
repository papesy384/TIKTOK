# Testing: Error Handling & Integration

Run all tests: **`npm run test:run`** (or `npm test` for watch mode).

---

## Test suites

| Suite | File | Focus |
|-------|------|--------|
| **API** | `src/lib/api/videos.test.ts` | `fetchVideos`: no-API fallback, API 4xx/5xx throws `VideosApiError`, invalid response throws, valid response returns videos + cursor. |
| **useInfiniteVideos** | `src/hooks/useInfiniteVideos.test.tsx` | Initial load success/failure, error + fallback, retry clears error, loadMore appends and updates hasMore, loadMore failure keeps list and sets hasMore false. |
| **useNearBottom** | `src/hooks/useNearBottom.test.tsx` | Sentinel + Intersection Observer: options, callback when intersecting, disabled, disconnect. See `docs/TESTING_NEAR_BOTTOM.md`. |
| **FeedError** | `src/components/FeedError.test.tsx` | Renders message, “Try again” button when `onRetry` provided, `onRetry` called on click, role alert. |
| **FeedEmpty** | `src/components/FeedEmpty.test.tsx` | “No videos yet” and hint text. |
| **FeedLoading** | `src/components/FeedLoading.test.tsx` | Loading status and “Loading videos…”. |
| **VideoCard** | `src/components/VideoCard.test.tsx` | Renders video with src, shows “Video unavailable” on error, double-tap calls `onDoubleTap(id)`. |
| **Feed integration** | `src/components/Feed.integration.test.tsx` | Feed shows Loading when loading + no videos; Error with retry when error; Empty when no videos; feed with N videos renders N cards; loading with existing videos shows feed (no full-screen loader). |

---

## Error-handling coverage

- **API:** Non-ok response and invalid JSON/missing `videos` throw `VideosApiError` with message and optional status.
- **useInfiniteVideos:** Initial failure sets `error` and `videos` to fallback; `retry` refetches and clears error; loadMore failure does not clear list, sets `hasMore` false.
- **UI:** FeedError shows message and retry; VideoCard shows “Video unavailable” on `<video>` error.

---

## Integration coverage

- **Feed states:** Loading (no videos), Error (with retry), Empty, and feed with video list are rendered correctly; retry button invokes `onRetry`.
- **Feed + videos:** Correct number of cards (by `data-video-id`) when passing a videos array.
- **useInfiniteVideos flow:** Mocked `fetchVideos`; assert loading → success, error → fallback, retry → success, loadMore → appended list and hasMore.

---

## Setup notes

- **jest-dom:** `src/test/setup.ts` imports `@testing-library/jest-dom/vitest` for matchers like `toBeInTheDocument()`.
- **jsdom:** `HTMLMediaElement.prototype.pause` / `play` are stubbed in VideoCard and Feed integration tests so VideoCard’s effects don’t throw in jsdom.
- **Mocks:** `fetch` is stubbed in API tests when `NEXT_PUBLIC_VIDEOS_API_URL` is set; `fetchVideos` is mocked in useInfiniteVideos tests; `IntersectionObserver` and `hls.js` are stubbed where needed.
