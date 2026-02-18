/**
 * Session retention: 10+ videos/session (PRD success metric).
 * Persists view count in sessionStorage so it survives refresh within the same tab.
 */

const STORAGE_KEY = "tiktok_feed_session_views";
const RETENTION_GOAL = 10;

export function getStoredSessionViewCount(): number {
  if (typeof window === "undefined") return 0;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (raw == null) return 0;
    const n = parseInt(raw, 10);
    return Number.isFinite(n) && n >= 0 ? n : 0;
  } catch {
    return 0;
  }
}

export function setStoredSessionViewCount(count: number): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(STORAGE_KEY, String(Math.max(0, count)));
  } catch {
    // ignore quota / private mode
  }
}

export { RETENTION_GOAL };
