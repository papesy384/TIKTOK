"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export interface OverlayProps {
  username: string;
  description: string;
  /** Placeholder for double-tap engagement (e.g. like animation). */
  onDoubleTap?: () => void;
  className?: string;
}

const DOUBLE_TAP_FEEDBACK_MS = 600;

/**
 * Persistent UI overlay for each video: metadata (username, description)
 * and a double-tap target for engagement. Does not block video interaction.
 */
export function Overlay({
  username,
  description,
  onDoubleTap,
  className = "",
}: OverlayProps) {
  const [showDoubleTapFeedback, setShowDoubleTapFeedback] = useState(false);
  const feedbackTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleDoubleTap = useCallback(() => {
    onDoubleTap?.();
    if (feedbackTimeoutRef.current) clearTimeout(feedbackTimeoutRef.current);
    setShowDoubleTapFeedback(true);
    feedbackTimeoutRef.current = setTimeout(
      () => setShowDoubleTapFeedback(false),
      DOUBLE_TAP_FEEDBACK_MS
    );
  }, [onDoubleTap]);

  useEffect(() => {
    return () => {
      if (feedbackTimeoutRef.current) clearTimeout(feedbackTimeoutRef.current);
    };
  }, []);

  return (
    <div
      className={`pointer-events-none absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/70 via-transparent to-transparent p-4 ${className}`}
      aria-hidden
    >
      {/* Double-tap hit area (pointer-events enabled only on this layer) */}
      <div
        className="pointer-events-auto absolute inset-0 flex items-center justify-center"
        onDoubleClick={handleDoubleTap}
        role="button"
        tabIndex={0}
        aria-label="Double tap to like"
      >
        {showDoubleTapFeedback && (
          <span className="animate-[scale-in_0.3s_ease-out] text-6xl opacity-90">
            ❤️
          </span>
        )}
      </div>

      {/* Metadata — bottom-aligned, non-interactive */}
      <div className="relative z-10 pointer-events-none">
        <p className="font-semibold text-white drop-shadow-md">{username}</p>
        <p className="mt-1 line-clamp-2 text-sm text-white/95 drop-shadow-md">
          {description}
        </p>
      </div>
    </div>
  );
}
