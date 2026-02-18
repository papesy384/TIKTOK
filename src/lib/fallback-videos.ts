import type { VideoItem } from "@/types/feed";

/** Default clips when env is unset (paths under public/videos/). */
const DEFAULT_FALLBACK: VideoItem[] = [
  { id: "1", src: "/videos/messi.mp4", username: "@leomessi", description: "Leo Messi - football." },
  { id: "2", src: "/videos/placeholder-1.mp4", username: "@sintel_movie", description: "Movie - Sintel." },
  { id: "3", src: "/videos/bunny.mp4", username: "@bigbuckbunny", description: "Animation - Big Buck Bunny." },
  { id: "4", src: "/videos/jellyfish.mp4", username: "@nature_chill", description: "Nature - jellyfish." },
];

/**
 * Fallback video list when API is not configured or fails.
 * Uses NEXT_PUBLIC_FALLBACK_VIDEOS (JSON array) when set; otherwise DEFAULT_FALLBACK.
 */
export function getFallbackVideos(): VideoItem[] {
  try {
    const raw = process.env.NEXT_PUBLIC_FALLBACK_VIDEOS;
    if (typeof raw === "string" && raw.trim()) {
      const parsed = JSON.parse(raw) as unknown;
      if (Array.isArray(parsed)) {
        const list = parsed.filter(
          (v): v is VideoItem =>
            v != null &&
            typeof v === "object" &&
            typeof (v as VideoItem).id === "string" &&
            (typeof (v as VideoItem).src === "string" ||
              typeof (v as VideoItem).muxPlaybackId === "string" ||
              typeof (v as VideoItem).cloudinaryPublicId === "string") &&
            typeof (v as VideoItem).username === "string" &&
            typeof (v as VideoItem).description === "string"
        );
        if (list.length > 0) return list;
      }
    }
  } catch {
    // ignore invalid JSON
  }
  return DEFAULT_FALLBACK;
}
