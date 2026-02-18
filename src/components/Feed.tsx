"use client";

import { useRef, useEffect, useCallback, useState } from "react";
import { VideoCard } from "./VideoCard";
import { FeedLoading } from "./FeedLoading";
import { FeedEmpty } from "./FeedEmpty";
import { FeedError } from "./FeedError";
import { useNearBottom } from "@/hooks/useNearBottom";
import { getPlayableUrl } from "@/lib/video-urls";
import type { VideoItem } from "@/types/feed";

export type { VideoItem };

export interface FeedProps {
  videos: VideoItem[];
  isLoading?: boolean;
  error?: Error | null;
  onRetry?: () => void;
  /** When provided, enables infinite scroll: load more when user is near bottom. */
  onLoadMore?: () => void;
  hasMore?: boolean;
  isLoadingMore?: boolean;
  /** Called when a video reaches first frame (for &lt;300ms latency target). */
  onPlaybackLatency?: (videoId: string, ms: number) => void;
  /** Called when a video has been viewed (for 10+ videos/session retention). */
  onVideoViewed?: (videoId: string) => void;
  /** Called when user double-taps (like). Backend can record via POST /api/engage. */
  onEngage?: (videoId: string) => void;
}

/** Default mute state for the feed (videos start muted for autoplay). Lifted so unmute persists across videos. */
const DEFAULT_FEED_MUTED = true;

/**
 * Full-screen vertical feed with mandatory snap. Each child is a snap-start
 * section so the viewport locks to one video at a time — no manual alignment.
 * Uses snap-y snap-mandatory for 100% snap accuracy (P0).
 * Desktop: scroll with mouse wheel, trackpad, or Arrow Down/Up (or Page Down/Up).
 */
export function Feed({
  videos,
  isLoading = false,
  error = null,
  onRetry,
  onLoadMore,
  hasMore = false,
  isLoadingMore = false,
  onPlaybackLatency,
  onVideoViewed,
  onEngage,
}: FeedProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollRoot, setScrollRoot] = useState<HTMLDivElement | null>(null);
  const [feedMuted, setFeedMuted] = useState(DEFAULT_FEED_MUTED);

  const { sentinelRef } = useNearBottom({
    root: scrollRoot,
    onNearBottom: onLoadMore ?? (() => {}),
    disabled: !onLoadMore || !hasMore || isLoadingMore,
    rootMargin: "200px",
  });

  const setScrollRef = useCallback((el: HTMLDivElement | null) => {
    (scrollRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
    setScrollRoot(el);
  }, []);

  const getCurrentSlideIndex = useCallback(() => {
    const el = scrollRef.current;
    if (!el || el.children.length === 0) return 0;
    const scrollTop = el.scrollTop;
    const slideHeight = el.clientHeight;
    if (slideHeight <= 0) return 0;
    const index = Math.floor(scrollTop / slideHeight);
    const lastVideoIndex = videos.length - 1;
    return Math.min(Math.max(0, index), lastVideoIndex);
  }, [videos.length]);

  const scrollToNext = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const currentIndex = getCurrentSlideIndex();
    const nextIndex = Math.min(currentIndex + 1, videos.length - 1);
    if (nextIndex === currentIndex) return;
    const nextChild = el.children[nextIndex] as HTMLElement;
    if (nextChild) {
      el.scrollTo({ top: nextChild.offsetTop, behavior: "instant" });
    }
  }, [videos.length, getCurrentSlideIndex]);

  const scrollToPrev = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const currentIndex = getCurrentSlideIndex();
    const prevIndex = Math.max(currentIndex - 1, 0);
    if (prevIndex === currentIndex) return;
    const prevChild = el.children[prevIndex] as HTMLElement;
    if (prevChild) {
      el.scrollTo({ top: prevChild.offsetTop, behavior: "instant" });
    }
  }, [getCurrentSlideIndex]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;
      if (e.key === "ArrowDown" || e.key === "PageDown") {
        e.preventDefault();
        scrollToNext();
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        e.preventDefault();
        scrollToPrev();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [scrollToNext, scrollToPrev]);

  const handleDoubleTap = useCallback(
    (id: string) => {
      onEngage?.(id);
    },
    [onEngage]
  );

  if (isLoading && videos.length === 0) return <FeedLoading />;
  if (error) {
    return (
      <FeedError
        message={error.message}
        onRetry={onRetry}
      />
    );
  }
  if (videos.length === 0) return <FeedEmpty />;

  return (
    <div
      ref={setScrollRef}
      className="snap-feed relative h-full w-full overflow-y-auto overflow-x-hidden snap-y snap-mandatory"
      role="feed"
      aria-label="Vertical video feed"
    >
      {videos.map((video, index) => (
        <div
          key={video.id}
          className="h-screen-dynamic min-h-full w-full flex-shrink-0 snap-start snap-always sm:min-h-screen"
        >
          <VideoCard
            id={video.id}
            src={getPlayableUrl(video)}
            username={video.username}
            description={video.description}
            muted={feedMuted}
            onMuteToggle={() => setFeedMuted((m) => !m)}
            onDoubleTap={handleDoubleTap}
            onPrev={index > 0 ? () => scrollToPrev() : undefined}
            onNext={index < videos.length - 1 ? () => scrollToNext() : undefined}
            observerRoot={scrollRoot}
            onPlaybackLatency={onPlaybackLatency}
            onVideoViewed={onVideoViewed}
          />
        </div>
      ))}
      {/* Sentinel for infinite scroll: when this is visible, onLoadMore fires */}
      {onLoadMore && hasMore && (
        <div
          ref={sentinelRef}
          className="min-h-[1px] w-full flex-shrink-0"
          aria-hidden
        />
      )}
      {isLoadingMore && (
        <div className="flex min-h-[80px] w-full items-center justify-center py-4">
          <span className="text-sm text-white/70">Loading more…</span>
        </div>
      )}
    </div>
  );
}
