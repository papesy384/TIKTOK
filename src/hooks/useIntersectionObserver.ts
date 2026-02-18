"use client";

import { useEffect, useRef, useState, useCallback } from "react";

export interface UseIntersectionObserverOptions {
  /**
   * Trigger when this ratio of the element is visible (0–1).
   * Use 1 for "100% visible" (auto-play only when fully in viewport).
   */
  threshold?: number;
  /**
   * Root margin (e.g. "0px" or "-10% 0px" to require full visibility).
   */
  rootMargin?: string;
  /**
   * Optional root element (defaults to viewport).
   */
  root?: Element | null;
}

/**
 * Hook to observe element visibility and manage video lifecycle.
 * Returns { ref, isFullyVisible } so the video plays only when 100% visible,
 * reducing resource usage and supporting mandatory snap behavior.
 */
export function useIntersectionObserver<T extends HTMLElement = HTMLDivElement>(
  options: UseIntersectionObserverOptions = {}
) {
  const {
    threshold = 1,
    rootMargin = "0px",
    root = null,
  } = options;

  const ref = useRef<T>(null);
  const [isFullyVisible, setIsFullyVisible] = useState(false);

  // When root is null we don't observe; keep visibility false so video doesn't play against viewport
  useEffect(() => {
    if (root === null) setIsFullyVisible(false);
  }, [root]);

  const handleIntersect = useCallback<IntersectionObserverCallback>(
    (entries) => {
      const [entry] = entries;
      if (!entry) return;
      setIsFullyVisible(entry.isIntersecting && entry.intersectionRatio >= threshold);
    },
    [threshold]
  );

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    // When root is null (e.g. scroll container not yet set), don't observe — otherwise
    // the browser uses the viewport and play/pause is wrong for a scrollable feed.
    if (root === null) return;

    const observer = new IntersectionObserver(handleIntersect, {
      threshold,
      rootMargin,
      root: root ?? undefined,
    });

    observer.observe(node);
    return () => observer.disconnect();
  }, [handleIntersect, threshold, rootMargin, root]);

  return { ref, isFullyVisible };
}
