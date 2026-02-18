import type { VideoItem } from "@/types/feed";

/**
 * Public demo video URLs that work on Vercel (no local files needed).
 * 10 unique videos including soccer and Atlantic Ocean.
 */
const DEFAULT_FALLBACK: VideoItem[] = [
  { id: "1", src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4", username: "@elephantsdream", description: "Elephant's Dream - short film." },
  { id: "2", src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4", username: "@sintel_movie", description: "Sintel - short movie." },
  { id: "3", src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", username: "@bigbuckbunny", description: "Big Buck Bunny - animation." },
  { id: "4", src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4", username: "@sample", description: "For Bigger Blazes - sample clip." },
  { id: "5", src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4", username: "@soccer_highlights", description: "Soccer highlights - goals and action." },
  { id: "6", src: "https://test-videos.co.uk/vids/jellyfish/mp4/h264/360/Jellyfish_360_10s_1MB.mp4", username: "@atlantic_ocean", description: "Atlantic Ocean - jellyfish in the deep sea." },
  { id: "7", src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4", username: "@fun", description: "For Bigger Fun - sample." },
  { id: "8", src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4", username: "@joyrides", description: "For Bigger Joyrides - sample." },
  { id: "9", src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4", username: "@meltdowns", description: "For Bigger Meltdowns - sample." },
  { id: "10", src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4", username: "@tearsofsteel", description: "Tears of Steel - short film." },
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
