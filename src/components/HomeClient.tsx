"use client";

import { useMemo, useCallback, useState, useEffect } from "react";
import { AppShell } from "./AppShell";
import { Feed } from "./Feed";
import { useInfiniteVideos } from "@/hooks/useInfiniteVideos";
import { useSessionRetention } from "@/hooks/useSessionRetention";
import { engage } from "@/lib/api/engage";
import { getFallbackVideos } from "@/lib/fallback-videos";

const PLAYBACK_LATENCY_TARGET_MS = 300;
const RETENTION_TOAST_MS = 3000;

export function HomeClient() {
  const fallback = useMemo(() => getFallbackVideos(), []);
  const [showRetentionToast, setShowRetentionToast] = useState(false);
  const {
    videos,
    error,
    isLoading,
    isLoadingMore,
    hasMore,
    retry,
    loadMore,
  } = useInfiniteVideos({ fallbackVideos: fallback });

  const handleRetentionGoalReached = useCallback(() => {
    setShowRetentionToast(true);
    if (process.env.NODE_ENV === "development") {
      console.log("[Session retention] 10+ videos viewed this session ✓");
    }
    // Production: send to analytics
  }, []);

  const { recordView } = useSessionRetention({
    onRetentionGoalReached: handleRetentionGoalReached,
  });

  useEffect(() => {
    if (!showRetentionToast) return;
    const t = setTimeout(() => setShowRetentionToast(false), RETENTION_TOAST_MS);
    return () => clearTimeout(t);
  }, [showRetentionToast]);

  const handleEngage = useCallback((videoId: string) => {
    engage(videoId, "like").catch(() => {
      // Fire-and-forget; optional: toast or retry
    });
  }, []);

  const handlePlaybackLatency = useCallback((videoId: string, ms: number) => {
    if (process.env.NODE_ENV === "development") {
      const ok = ms <= PLAYBACK_LATENCY_TARGET_MS;
      console.log(
        `[Playback latency] ${videoId}: ${ms}ms ${ok ? "✓" : `(target ${PLAYBACK_LATENCY_TARGET_MS}ms)`}`
      );
    }
    // Production: send to analytics / RUM e.g. onPlaybackLatency(ms)
  }, []);

  return (
    <AppShell>
      {showRetentionToast && (
        <div
          className="fixed bottom-24 left-1/2 z-50 -translate-x-1/2 rounded-full bg-tiktok-red px-4 py-2 text-sm font-medium text-white shadow-lg"
          role="status"
          aria-live="polite"
        >
          10+ videos this session ✓
        </div>
      )}
      <Feed
        videos={videos}
        isLoading={isLoading}
        error={error}
        onRetry={retry}
        onLoadMore={loadMore}
        hasMore={hasMore}
        isLoadingMore={isLoadingMore}
        onPlaybackLatency={handlePlaybackLatency}
        onVideoViewed={recordView}
        onEngage={handleEngage}
      />
    </AppShell>
  );
}
