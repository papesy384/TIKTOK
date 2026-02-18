"use client";

export class EngageApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public cause?: unknown
  ) {
    super(message);
    this.name = "EngageApiError";
  }
}

/**
 * Record engagement (e.g. double-tap like). POSTs to /api/engage.
 */
export async function engage(
  videoId: string,
  action: string = "like"
): Promise<void> {
  const res = await fetch("/api/engage", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ videoId, action }),
  });

  if (!res.ok) {
    const text = await res.text();
    let msg = `Engage API error: ${res.status}`;
    try {
      const json = JSON.parse(text);
      if (typeof json?.error === "string") msg = json.error;
    } catch {
      if (text) msg = text;
    }
    throw new EngageApiError(msg, res.status);
  }
}
