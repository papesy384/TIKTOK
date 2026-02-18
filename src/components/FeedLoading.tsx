"use client";

/**
 * Loading state for the feed (skeleton).
 */
export function FeedLoading() {
  return (
    <div
      className="flex h-full w-full flex-col items-center justify-center gap-4 bg-feed-bg px-feed-x py-feed-y"
      role="status"
      aria-label="Loading feed"
    >
      <div className="h-12 w-12 animate-spin rounded-full border-2 border-feed-text-muted border-t-feed-text" />
      <p className="text-sm text-feed-text-muted">Loading videos…</p>
    </div>
  );
}
