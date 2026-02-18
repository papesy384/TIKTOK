"use client";

import type { FeedResponse, VideoItem } from "@/types/feed";
import { getFallbackVideos } from "@/lib/fallback-videos";

const PAGE_SIZE = 2;

export class VideosApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public cause?: unknown
  ) {
    super(message);
    this.name = "VideosApiError";
  }
}

/**
 * Fetch feed videos. Uses NEXT_PUBLIC_VIDEOS_API_URL when set;
 * otherwise returns paginated fallback (first page of 2, then next 2 with cursor) for testing infinite scroll.
 */
export async function fetchVideos(cursor?: string | null): Promise<FeedResponse> {
  const baseUrl = process.env.NEXT_PUBLIC_VIDEOS_API_URL;
  if (!baseUrl?.trim()) {
    const all = getFallbackVideos();
    if (!cursor) {
      const videos = all.slice(0, PAGE_SIZE);
      return {
        videos,
        nextCursor: all.length > PAGE_SIZE ? "1" : null,
      };
    }
    const page = parseInt(cursor, 10);
    if (isNaN(page) || page < 1) return { videos: [], nextCursor: null };
    const start = PAGE_SIZE * page;
    const end = start + PAGE_SIZE;
    const videos = all.slice(start, end);
    const nextCursor: string | null = end < all.length ? String(page + 1) : null;
    return { videos, nextCursor };
  }

  const url = cursor
    ? `${baseUrl}${baseUrl.includes("?") ? "&" : "?"}cursor=${encodeURIComponent(cursor)}`
    : baseUrl;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { Accept: "application/json" },
    });
    clearTimeout(timeout);

    if (!res.ok) {
      throw new VideosApiError(
        `Videos API error: ${res.status} ${res.statusText}`,
        res.status
      );
    }

    const data = (await res.json()) as FeedResponse;
    if (!Array.isArray(data?.videos)) {
      throw new VideosApiError("Invalid response: missing videos array");
    }
    return {
      videos: data.videos,
      nextCursor: data.nextCursor ?? null,
    };
  } catch (err) {
    clearTimeout(timeout);
    if (err instanceof VideosApiError) throw err;
    if (err instanceof Error) {
      throw new VideosApiError(err.message, undefined, err);
    }
    throw new VideosApiError("Failed to fetch videos", undefined, err);
  }
}
