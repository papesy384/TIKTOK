"use client";

import { useRef, useEffect } from "react";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { Overlay } from "./Overlay";

export interface VideoCardProps {
  id: string;
  src: string;
  username: string;
  description: string;
  onDoubleTap?: (id: string) => void;
}

/**
 * Single full-screen video segment. Uses Intersection Observer to:
 * - Auto-play only when 100% visible (snap target).
 * - Pause and release focus when scrolled away for resource management.
 * Structure supports low-latency streaming (Cloudinary/Mux) and <300ms playback.
 */
export function VideoCard({
  id,
  src,
  username,
  description,
  onDoubleTap,
}: VideoCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { ref: containerRef, isFullyVisible } = useIntersectionObserver<HTMLDivElement>({
    threshold: 1,
    rootMargin: "0px",
  });

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isFullyVisible) {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Autoplay may be blocked by policy; ignore to avoid unhandled rejection
        });
      }
    } else {
      video.pause();
    }
  }, [isFullyVisible]);

  return (
    <section
      ref={containerRef}
      className="relative h-full w-full flex-shrink-0 snap-start snap-always"
      data-video-id={id}
    >
      {/* Video: object-cover for full-screen fill; preload for low latency */}
      <video
        ref={videoRef}
        src={src}
        className="absolute inset-0 h-full w-full object-cover"
        playsInline
        muted
        loop
        preload="auto"
        aria-label={`Video by ${username}`}
      />

      <Overlay
        username={username}
        description={description}
        onDoubleTap={() => onDoubleTap?.(id)}
      />
    </section>
  );
}
