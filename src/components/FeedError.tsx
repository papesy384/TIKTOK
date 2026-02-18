"use client";

export interface FeedErrorProps {
  message?: string;
  onRetry?: () => void;
}

/**
 * Error state for the feed with optional retry.
 */
export function FeedError({ message, onRetry }: FeedErrorProps) {
  return (
    <div
      className="flex h-full w-full flex-col items-center justify-center gap-4 bg-feed-bg px-feed-x py-feed-y text-center"
      role="alert"
    >
      <p className="text-feed-text">Something went wrong</p>
      {message && (
        <p className="max-w-sm text-sm text-feed-text-muted">{message}</p>
      )}
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="rounded-lg bg-feed-text px-4 py-2 text-sm font-medium text-feed-bg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-feed-text-muted"
        >
          Try again
        </button>
      )}
    </div>
  );
}
