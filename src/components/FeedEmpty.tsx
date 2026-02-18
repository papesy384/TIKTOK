"use client";

/**
 * Empty state when the feed has no videos.
 */
export function FeedEmpty() {
  return (
    <div
      className="flex h-full w-full flex-col items-center justify-center gap-3 bg-feed-bg px-feed-x py-feed-y text-center"
      role="status"
    >
      <p className="text-feed-text">No videos yet</p>
      <p className="max-w-sm text-sm text-feed-text-muted">
        Check back later or pull to refresh.
      </p>
    </div>
  );
}
