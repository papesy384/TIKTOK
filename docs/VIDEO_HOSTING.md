# Video Hosting (Cloudinary / Mux) & Playback Latency

## Overview

The feed supports three source types for each video:

| Source | How it works | Use case |
|--------|--------------|----------|
| **Direct URL** | `src` is a full URL (e.g. MP4). | Local files, CDN, or any direct link. |
| **Cloudinary** | API returns `cloudinaryPublicId`. App builds optimized URL with `f_auto,q_auto`. | Low-latency MP4 delivery with automatic format/quality. |
| **Mux** | API returns `muxPlaybackId`. App resolves to `https://stream.mux.com/{id}.m3u8` and plays with HLS.js. | HLS streaming; use Mux Player or signed URLs for restricted content. |

## Configuration

### Cloudinary

1. Set `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` in `.env.local` (or use `"demo"` for Cloudinary’s demo cloud).
2. API or fallback returns items with `cloudinaryPublicId` (e.g. `"v1234567890/sample"`).
3. Resolved URL: `https://res.cloudinary.com/{cloudName}/video/upload/f_auto,q_auto/{publicId}`.

### Mux

1. No env required for **public** playback IDs.
2. API returns items with `muxPlaybackId`. The app builds the HLS URL and plays it with **hls.js** (Safari can play HLS natively; Chrome/Firefox use hls.js).
3. For **signed** playback, your API should return a full URL including the token, or you implement a token endpoint and append `?token=...` when building the src.

## Playback latency (&lt;300ms target)

- **Measurement:** From `video.play()` (when the card becomes visible) to the `playing` event (first frame).
- **Reporting:** Optional callback `onPlaybackLatency(videoId, ms)` is passed from `HomeClient` → `Feed` → `VideoCard`. In development it is logged to the console; in production you can send it to your analytics/RUM.
- **Tips:** Use Cloudinary’s **eager** transformations or Mux’s encoding so the first segment is ready; keep segments short; use `preload="auto"` (already set) for the active card.
