/** Shared type for feed video items (API + UI). */
export interface VideoItem {
  id: string;
  /** Direct URL (MP4, etc.). Used when muxPlaybackId and cloudinaryPublicId are not set. */
  src?: string;
  username: string;
  description: string;
  /** Mux playback ID — resolved to HLS URL (stream.mux.com). */
  muxPlaybackId?: string;
  /** Cloudinary public ID — resolved to optimized MP4 URL. */
  cloudinaryPublicId?: string;
}

export interface FeedResponse {
  videos: VideoItem[];
  nextCursor?: string | null;
}

export interface FeedFetchResult {
  data: VideoItem[] | null;
  error: Error | null;
  isLoading: boolean;
}
