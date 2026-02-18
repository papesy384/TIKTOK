"use client";

import { useState, useCallback, useEffect } from "react";
import { fetchVideos } from "@/lib/api/videos";
import type { VideoItem } from "@/types/feed";

export interface UseInfiniteVideosOptions {
  fallbackVideos?: VideoItem[];
}

export interface UseInfiniteVideosResult {
  videos: VideoItem[];
  error: Error | null;
  isLoading: boolean;
  isLoadingMore: boolean;
  hasMore: boolean;
  retry: () => void;
  loadMore: () => void;
}

export function useInfiniteVideos(
  options: UseInfiniteVideosOptions = {}
): UseInfiniteVideosResult {
  const { fallbackVideos = [] } = options;
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | null>(null);

  const loadInitial = useCallback(async () => {
    setError(null);
    setIsLoading(true);
    try {
      const { videos: next, nextCursor: cursor } = await fetchVideos();
      setVideos(next.length > 0 ? next : fallbackVideos);
      setNextCursor(cursor ?? null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      setVideos(fallbackVideos);
      setNextCursor(null);
    } finally {
      setIsLoading(false);
    }
  }, [fallbackVideos]);

  useEffect(() => {
    loadInitial();
  }, [loadInitial]);

  const loadMore = useCallback(async () => {
    if (isLoadingMore || !nextCursor) return;
    setIsLoadingMore(true);
    try {
      const { videos: next, nextCursor: cursor } = await fetchVideos(nextCursor);
      setVideos((prev) => (next.length > 0 ? [...prev, ...next] : prev));
      setNextCursor(cursor ?? null);
    } catch {
      setNextCursor(null);
    } finally {
      setIsLoadingMore(false);
    }
  }, [nextCursor, isLoadingMore]);

  return {
    videos,
    error,
    isLoading,
    isLoadingMore,
    hasMore: nextCursor != null && nextCursor !== "",
    retry: loadInitial,
    loadMore,
  };
}
