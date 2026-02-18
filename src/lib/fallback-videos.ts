import type { VideoItem } from "@/types/feed";

/**
 * Public demo video URLs that work on Vercel (no local files needed).
 * When deploying, local /videos/*.mp4 are not in the repo (.gitignore), so we use these by default.
 */
const DEFAULT_FALLBACK: VideoItem[] = [
  { id: "1", src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4", username: "@elephantsdream", description: "Elephant's Dream - short film." },
  { id: "2", src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4", username: "@sintel_movie", description: "Sintel - short movie." },
  { id: "3", src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", username: "@bigbuckbunny", description: "Big Buck Bunny - animation." },
  { id: "4", src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4", username: "@sample", description: "For Bigger Blazes - sample clip." },
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
