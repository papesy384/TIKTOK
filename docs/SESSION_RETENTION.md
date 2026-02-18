# 10+ Videos/Session Retention

## PRD success metric

**Engagement: 10+ Videos/Session Retention Loop** — the product aims for users to watch at least 10 videos per session.

## Implementation

### Tracking

- **When:** A video is counted as “viewed” when it fires the **`playing`** event (first frame). Revisiting a video (scroll back) counts again.
- **Where:** `VideoCard` calls `onVideoViewed?.(id)` from its `onPlaying` handler. `Feed` forwards the prop; `HomeClient` passes `recordView` from `useSessionRetention`.
- **Persistence:** Count is stored in **sessionStorage** under `tiktok_feed_session_views`, so it survives refresh in the same tab and resets when the tab is closed.

### Hook: `useSessionRetention`

- **`sessionViewCount`** — current count for this session.
- **`recordView(videoId)`** — call when a video has been viewed; increments count and persists.
- **`hasReachedRetentionGoal`** — `true` when `sessionViewCount >= 10`.
- **`onRetentionGoalReached`** — optional callback when the count first hits 10 (e.g. for analytics or UI).

### UI

- When the user reaches **10 views**, a short **toast** appears: “10+ videos this session ✓” (TikTok red pill, bottom center). It auto-hides after 3 seconds.
- In development, reaching the goal also logs to the console.

### Analytics

- Use `onRetentionGoalReached` in `HomeClient` to send an event to your analytics (e.g. “retention_goal_reached”) when the user hits 10 views.
