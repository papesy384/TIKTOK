/**
 * Server-side engagement store. In-memory, capped size.
 * Replace with DB (e.g. Prisma + table) or remove when using ENGAGEMENT_SERVICE_URL only.
 */

export type EngagementRecord = {
  videoId: string;
  action: string;
  at: number;
};

const MAX_RECORDS = 100;
const store: EngagementRecord[] = [];

export function recordEngagement(videoId: string, action: string): void {
  store.push({ videoId, action, at: Date.now() });
  if (store.length > MAX_RECORDS) {
    store.shift();
  }
}

export function getRecentEngagements(limit: number = 20): EngagementRecord[] {
  return store.slice(-limit).reverse();
}
