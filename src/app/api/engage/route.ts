import { NextRequest, NextResponse } from "next/server";
import { recordEngagement, getRecentEngagements } from "@/lib/engagement-store";

export const dynamic = "force-dynamic";

export type EngageBody = {
  videoId: string;
  action: string;
};

function parseBody(body: unknown): EngageBody | null {
  if (body == null || typeof body !== "object") return null;
  const o = body as Record<string, unknown>;
  if (typeof o.videoId !== "string" || typeof o.action !== "string") return null;
  if (!o.videoId.trim() || !o.action.trim()) return null;
  return { videoId: o.videoId.trim(), action: o.action.trim() };
}

async function forwardToEngagementService(
  videoId: string,
  action: string
): Promise<boolean> {
  const url = process.env.ENGAGEMENT_SERVICE_URL?.trim();
  if (!url) return false;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ videoId, action }),
      signal: controller.signal,
    });
    clearTimeout(timeout);
    return res.ok;
  } catch (err) {
    clearTimeout(timeout);
    if (process.env.NODE_ENV === "development") {
      console.warn("[Engage] forward failed:", err);
    }
    return false;
  }
}

/**
 * POST /api/engage — record double-tap (like) or other engagement.
 * Body: { videoId: string, action: string } (e.g. action: "like").
 * Persists to in-memory store and optionally forwards to ENGAGEMENT_SERVICE_URL.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = parseBody(body);
    if (!parsed) {
      return NextResponse.json(
        { error: "Missing or invalid videoId / action" },
        { status: 400 }
      );
    }

    const { videoId, action } = parsed;

    const allowed = ["like", "unlike"];
    if (!allowed.includes(action.toLowerCase())) {
      return NextResponse.json(
        { error: `Unsupported action: ${action}` },
        { status: 400 }
      );
    }

    recordEngagement(videoId, action);

    await forwardToEngagementService(videoId, action);

    if (process.env.NODE_ENV === "development") {
      console.log("[Engage]", { videoId, action });
    }

    return NextResponse.json(
      { ok: true, videoId, action },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}

/**
 * GET /api/engage — return recent engagements (for debugging or "liked" state).
 * Query: limit (default 20).
 */
export async function GET(request: NextRequest) {
  const limit = Math.min(
    100,
    Math.max(1, parseInt(request.nextUrl.searchParams.get("limit") ?? "20", 10) || 20)
  );
  const recent = getRecentEngagements(limit);
  return NextResponse.json({ engagements: recent });
}
