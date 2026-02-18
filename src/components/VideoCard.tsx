"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { isHlsUrl } from "@/lib/video-urls";
import { Overlay } from "./Overlay";

export interface VideoCardProps {
  id: string;
  src: string;
  username: string;
  description: string;
  /** When provided, mute state is controlled by the feed (unmute once, applies to all videos). */
  muted?: boolean;
  onMuteToggle?: () => void;
  onDoubleTap?: (id: string) => void;
  onPrev?: () => void;
  onNext?: () => void;
  /** Scroll container to observe visibility against (so video plays when in feed view). */
  observerRoot?: Element | null;
  /** Called with ms from play() to first frame (for &lt;300ms target). */
  onPlaybackLatency?: (videoId: string, ms: number) => void;
  /** Called when video has been viewed (playing). Used for session retention (10+ videos/session). */
  onVideoViewed?: (videoId: string) => void;
}

/**
 * Single full-screen video segment. Uses Intersection Observer to:
 * - Auto-play only when 100% visible (snap target).
 * - Pause and release focus when scrolled away for resource management.
 * Supports direct MP4, Cloudinary (optimized MP4), and Mux (HLS via hls.js). Measures playback latency.
 */
export function VideoCard({
  id,
  src,
  username,
  description,
  muted: controlledMuted,
  onMuteToggle: onMuteToggleFromParent,
  onDoubleTap,
  onPrev,
  onNext,
  observerRoot = null,
  onPlaybackLatency,
  onVideoViewed,
}: VideoCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<InstanceType<typeof import("hls.js").default> | null>(null);
  const playStartTimeRef = useRef<number>(0);
  const [videoError, setVideoError] = useState(false);
  const [internalMuted, setInternalMuted] = useState(true);
  const useHls = src ? isHlsUrl(src) : false;

  const isControlled = controlledMuted !== undefined;
  const isMuted = isControlled ? controlledMuted : internalMuted;

  const { ref: containerRef, isFullyVisible } = useIntersectionObserver<HTMLDivElement>({
    threshold: 0.8,
    rootMargin: "0px",
    root: observerRoot,
  });

  // HLS (Mux): lazy-load hls.js only when needed so initial page load is faster
  useEffect(() => {
    if (!useHls || !src) return;
    const video = videoRef.current;
    if (!video) return;

    let cancelled = false;
    import("hls.js").then(({ default: Hls }) => {
      if (cancelled) return;
      if (Hls.isSupported()) {
        const hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
        });
        hlsRef.current = hls;
        hls.loadSource(src);
        hls.attachMedia(video);
        hls.on(Hls.Events.ERROR, (_, data) => {
          if (data.fatal) setVideoError(true);
        });
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = src;
      } else {
        setVideoError(true);
      }
    }).catch(() => {
      if (!cancelled) setVideoError(true);
    });
    return () => {
      cancelled = true;
      const h = hlsRef.current;
      if (h) {
        h.destroy();
        hlsRef.current = null;
      }
      if (video && useHls) {
        video.removeAttribute("src");
      }
    };
  }, [src, useHls]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isFullyVisible) {
      playStartTimeRef.current = performance.now();
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {});
      }
    } else {
      video.pause();
    }
  }, [isFullyVisible]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = isMuted;
    if (!isMuted) {
      video.play().catch(() => {});
    }
  }, [isMuted]);

  const handlePlaying = useCallback(() => {
    const start = playStartTimeRef.current;
    if (start > 0 && onPlaybackLatency) {
      const ms = Math.round(performance.now() - start);
      onPlaybackLatency(id, ms);
    }
    onVideoViewed?.(id);
  }, [id, onPlaybackLatency, onVideoViewed]);

  const handleError = () => setVideoError(true);

  const handleMuteToggle = useCallback(() => {
    const next = !isMuted;
    // Unmute + play in same tick as click so browser allows sound (user gesture)
    if (next === false && videoRef.current) {
      const v = videoRef.current;
      v.muted = false;
      v.volume = 1;
      v.play().catch(() => {});
    }
    if (onMuteToggleFromParent) {
      onMuteToggleFromParent();
    } else {
      setInternalMuted(next);
    }
  }, [isMuted, onMuteToggleFromParent]);

  return (
    <section
      ref={containerRef}
      className="relative h-full w-full flex-shrink-0 snap-start snap-always"
      data-video-id={id}
    >
      {videoError ? (
        <div
          className="flex h-full w-full items-center justify-center bg-feed-bg px-feed-x py-feed-y text-center"
          role="img"
          aria-label="Video unavailable"
        >
          <p className="text-sm text-feed-text-muted">Video unavailable</p>
        </div>
      ) : (
        <video
          ref={videoRef}
          src={useHls ? undefined : src}
          className="absolute inset-0 h-full w-full object-cover"
          playsInline
          muted={isMuted}
          loop
          preload="auto"
          aria-label={`Video by ${username}`}
          onError={handleError}
          onPlaying={handlePlaying}
        />
      )}

      <Overlay
        username={username}
        description={description}
        onDoubleTap={() => onDoubleTap?.(id)}
        onPrev={onPrev}
        onNext={onNext}
        isMuted={isMuted}
        onMuteToggle={handleMuteToggle}
      />
    </section>
  );
}
