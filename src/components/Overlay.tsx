"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export interface OverlayProps {
  username: string;
  description: string;
  onDoubleTap?: () => void;
  onPrev?: () => void;
  onNext?: () => void;
  isMuted?: boolean;
  onMuteToggle?: () => void;
  className?: string;
}

const DOUBLE_TAP_FEEDBACK_MS = 600;

function ActionButton({
  icon,
  label,
  count,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  count?: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex flex-col items-center gap-0.5 text-white"
      aria-label={label}
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-tiktok-icon-bg/80 text-xl backdrop-blur-sm">
        {icon}
      </span>
      {count != null && <span className="text-xs text-white/90">{count}</span>}
    </button>
  );
}

/**
 * TikTok-style overlay: right rail (profile, like, comment, save, share),
 * bottom-left (username + caption with "more"), mute top-left, prev/next arrows.
 */
export function Overlay({
  username,
  description,
  onDoubleTap,
  onPrev,
  onNext,
  isMuted = true,
  onMuteToggle,
  className = "",
}: OverlayProps) {
  const [showDoubleTapFeedback, setShowDoubleTapFeedback] = useState(false);
  const [captionExpanded, setCaptionExpanded] = useState(false);
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

  const desc = typeof description === "string" ? description : "";
  const name = typeof username === "string" ? username : "";
  const showMore = desc.length > 80;
  const displayCaption = captionExpanded ? desc : (showMore ? desc.slice(0, 80) : desc);
  const initial = name.slice(1, 2).toUpperCase() || "?";

  return (
    <div
      className={`pointer-events-none absolute inset-0 flex flex-col justify-between ${className}`}
      role="region"
      aria-label="Video controls and caption"
    >
      {/* Top-left: mute — z-20 so it sits above the full-screen double-tap layer and receives clicks */}
      <div className="pointer-events-auto relative z-20 flex items-start justify-between gap-2 p-3">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onMuteToggle?.();
          }}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm"
          aria-label={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? (
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
            </svg>
          ) : (
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
            </svg>
          )}
        </button>
        {isMuted && (
          <span className="self-center text-xs text-white/80">Tap for sound</span>
        )}
      </div>

      {/* Right rail: prev/next + actions */}
      <div className="pointer-events-auto relative z-20 flex items-end gap-2 pr-2 pb-20">
        <div className="flex flex-col gap-4">
          {onPrev && (
            <button
              type="button"
              onClick={onPrev}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white/90 backdrop-blur-sm hover:bg-black/60"
              aria-label="Previous video"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"/></svg>
            </button>
          )}
          {onNext && (
            <button
              type="button"
              onClick={onNext}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white/90 backdrop-blur-sm hover:bg-black/60"
              aria-label="Next video"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z"/></svg>
            </button>
          )}
        </div>
        <div className="flex flex-col gap-5">
          {/* Profile + follow */}
          <div className="flex flex-col items-center gap-1">
            <button type="button" className="relative flex flex-col items-center">
              <span className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-white bg-tiktok-icon-bg text-lg font-semibold">
                {initial}
              </span>
              <span className="absolute -bottom-1 flex h-5 w-5 items-center justify-center rounded-full bg-tiktok-red text-xs font-bold text-white">
                +
              </span>
            </button>
          </div>
          <ActionButton icon="❤" label="Like" count="1.3M" onClick={onDoubleTap} />
          <ActionButton icon="💬" label="Comments" count="12.2K" />
          <ActionButton icon="🔖" label="Save" count="134.4K" />
          <ActionButton icon="↗" label="Share" count="303.2K" />
          <div className="flex justify-center">
            <span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white/50 bg-tiktok-icon-bg text-sm">
              {initial}
            </span>
          </div>
        </div>
      </div>

      {/* Double-tap hit area (center) — z-0 so mute/arrows stay clickable above */}
      <div
        className="pointer-events-auto absolute inset-0 z-0 flex items-center justify-center"
        onDoubleClick={handleDoubleTap}
        role="button"
        tabIndex={0}
        aria-label="Double tap to like"
      >
        {showDoubleTapFeedback && (
          <span className="animate-[scale-in_0.3s_ease-out] text-6xl opacity-90">❤️</span>
        )}
      </div>

      {/* Bottom-left: username + caption */}
      <div className="pointer-events-auto relative z-20 max-w-[70%] pb-6 pl-4 pr-2 pt-4">
        <p className="font-semibold text-white drop-shadow-md">{name}</p>
        <p className="mt-1 text-sm text-white/95 drop-shadow-md">
          {displayCaption}
          {showMore && !captionExpanded && "..."}
          {showMore && (
            <button
              type="button"
              onClick={() => setCaptionExpanded(true)}
              className="ml-1 font-medium text-white/90 hover:underline"
            >
              more
            </button>
          )}
        </p>
      </div>
    </div>
  );
}
