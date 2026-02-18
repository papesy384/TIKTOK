import type { VideoItem } from "@/types/feed";

const MUX_HLS_BASE = "https://stream.mux.com";
const CLOUDINARY_BASE = "https://res.cloudinary.com";

/**
 * True if the URL is HLS (.m3u8). Native <video> only plays HLS on Safari; use hls.js elsewhere.
 */
export function isHlsUrl(url: string): boolean {
  return url.includes(".m3u8") || url.endsWith(".m3u8");
}

/**
 * Resolve a playable URL for a feed item. Prefers Mux → Cloudinary → direct src
 * so the app can use low-latency streaming (Mux HLS, Cloudinary optimized MP4).
 */
export function getPlayableUrl(item: VideoItem): string {
  if (item.muxPlaybackId?.trim()) {
    return `${MUX_HLS_BASE}/${item.muxPlaybackId.trim()}.m3u8`;
  }
  if (item.cloudinaryPublicId?.trim()) {
    const cloudName =
      process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME?.trim() || "demo";
    const publicId = item.cloudinaryPublicId.trim();
    return `${CLOUDINARY_BASE}/${cloudName}/video/upload/f_auto,q_auto/${publicId}`;
  }
  return item.src ?? "";
}
