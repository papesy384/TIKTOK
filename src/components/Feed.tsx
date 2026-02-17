"use client";

import { useRef, useEffect, useCallback, useState } from "react";
import { VideoCard } from "./VideoCard";

export interface VideoItem {
  id: string;
  src: string;
  username: string;
  description: string;
}

export interface FeedProps {
  videos: VideoItem[];
}

/**
 * Full-screen vertical feed with mandatory snap. Each child is a snap-start
 * section so the viewport locks to one video at a time — no manual alignment.
 * Uses snap-y snap-mandatory for 100% snap accuracy (P0).
 * Desktop: scroll with mouse wheel, trackpad, or Arrow Down/Up (or Page Down/Up).
 */
export function Feed({ videos }: FeedProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showScrollHint, setShowScrollHint] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setShowScrollHint(false), 5000);
    return () => clearTimeout(t);
  }, []);

  const scrollToNext = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ top: el.clientHeight, behavior: "smooth" });
  }, []);

  const scrollToPrev = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ top: -el.clientHeight, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
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

  const handleDoubleTap = (id: string) => {
    // Placeholder: wire to engagement (e.g. like API, animation)
    console.log("Double-tap engagement:", id);
  };

  return (
    <div
      ref={scrollRef}
      className="snap-feed relative h-full w-full overflow-y-auto overflow-x-hidden snap-y snap-mandatory"
      role="feed"
      aria-label="Vertical video feed"
    >
      {showScrollHint && (
        <div
          className="pointer-events-none fixed bottom-24 left-1/2 z-20 -translate-x-1/2 rounded bg-black/60 px-3 py-2 text-center text-sm text-white/90"
          aria-live="polite"
        >
          Scroll: mouse wheel, trackpad, or <kbd className="font-mono">↓</kbd> <kbd className="font-mono">↑</kbd> keys
        </div>
      )}
      {videos.map((video) => (
        <div
          key={video.id}
          className="h-screen-dynamic h-screen min-h-full w-full"
        >
          <VideoCard
            id={video.id}
            src={video.src}
            username={video.username}
            description={video.description}
            onDoubleTap={handleDoubleTap}
          />
        </div>
      ))}
    </div>
  );
}
