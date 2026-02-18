"use client";

import { useState, useCallback, useEffect } from "react";
import {
  getStoredSessionViewCount,
  setStoredSessionViewCount,
  RETENTION_GOAL,
} from "@/lib/session-retention";

export interface UseSessionRetentionOptions {
  /** Called when session view count reaches the retention goal (10). */
  onRetentionGoalReached?: () => void;
}

export interface UseSessionRetentionResult {
  /** Number of videos viewed this session (persisted in sessionStorage). */
  sessionViewCount: number;
  /** Call when a video has been viewed (e.g. on first frame / playing). */
  recordView: (videoId: string) => void;
  /** True when sessionViewCount >= 10. */
  hasReachedRetentionGoal: boolean;
}

export function useSessionRetention(
  options: UseSessionRetentionOptions = {}
): UseSessionRetentionResult {
  const { onRetentionGoalReached } = options;
  const [sessionViewCount, setSessionViewCount] = useState(0);

  useEffect(() => {
    setSessionViewCount(getStoredSessionViewCount());
  }, []);

  const recordView = useCallback(
    (videoId: string) => {
      setSessionViewCount((prev) => {
        const next = prev + 1;
        setStoredSessionViewCount(next);
        if (next === RETENTION_GOAL && onRetentionGoalReached) {
          onRetentionGoalReached();
        }
        return next;
      });
    },
    [onRetentionGoalReached]
  );
  const hasReachedRetentionGoal = sessionViewCount >= RETENTION_GOAL;

  return {
    sessionViewCount,
    recordView,
    hasReachedRetentionGoal,
  };
}
