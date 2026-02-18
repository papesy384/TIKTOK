"use client";

import { useState, useEffect, useCallback } from "react";
import { fetchVideos } from "@/lib/api/videos";
import type { VideoItem } from "@/types/feed";

export interface UseVideosOptions {
  /** Fallback list when API URL is not set or fetch fails. */
  fallbackVideos?: VideoItem[];
}

export interface UseVideosResult {
  videos: VideoItem[];
  error: Error | null;
  isLoading: boolean;
  retry: () => void;
}

export function useVideos(options: UseVideosOptions = {}): UseVideosResult {
  const { fallbackVideos = [] } = options;
  const [videos, setVideos] = useState<VideoItem[]>(fallbackVideos);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(async () => {
    setError(null);
    setIsLoading(true);
    try {
      const { videos: next } = await fetchVideos();
      setVideos(next.length > 0 ? next : fallbackVideos);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      setVideos(fallbackVideos);
    } finally {
      setIsLoading(false);
    }
  }, [fallbackVideos]);

  useEffect(() => {
    load();
  }, [load]);

  return { videos, error, isLoading, retry: load };
}
