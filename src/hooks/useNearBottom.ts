"use client";

import { useEffect, useRef, useCallback } from "react";

export interface UseNearBottomOptions {
  /** Scroll container to observe against (required for feed). */
  root: Element | null;
  /** Fire when sentinel is this far from entering view (e.g. "200px" = load before user hits bottom). */
  rootMargin?: string;
  /** Called when sentinel enters (or is about to enter) the visible area. */
  onNearBottom: () => void;
  /** When true, do not fire onNearBottom (e.g. already loading or no more data). */
  disabled?: boolean;
}

/**
 * Detects when the user is near the bottom of a scroll container by observing
 * a sentinel element with Intersection Observer. Use the returned ref on a
 * sentinel element placed after the last feed item; when it intersects, the
 * callback runs so you can load more.
 */
export function useNearBottom({
  root,
  rootMargin = "200px",
  onNearBottom,
  disabled = false,
}: UseNearBottomOptions) {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const onNearBottomRef = useRef(onNearBottom);
  onNearBottomRef.current = onNearBottom;

  const handleIntersect = useCallback<IntersectionObserverCallback>(
    (entries) => {
      if (disabled) return;
      const [entry] = entries;
      if (!entry?.isIntersecting) return;
      onNearBottomRef.current();
    },
    [disabled]
  );

  useEffect(() => {
    if (!root) return;
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(handleIntersect, {
      root,
      rootMargin,
      threshold: 0,
    });
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [root, rootMargin, handleIntersect]);

  return { sentinelRef };
}
