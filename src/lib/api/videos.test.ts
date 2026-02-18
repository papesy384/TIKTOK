import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { fetchVideos, VideosApiError } from "./videos";

describe("fetchVideos", () => {
  const originalEnv = process.env.NEXT_PUBLIC_VIDEOS_API_URL;

  afterEach(() => {
    process.env.NEXT_PUBLIC_VIDEOS_API_URL = originalEnv;
    vi.restoreAllMocks();
  });

  describe("when NEXT_PUBLIC_VIDEOS_API_URL is not set", () => {
    beforeEach(() => {
      process.env.NEXT_PUBLIC_VIDEOS_API_URL = "";
    });

    it("returns first page of fallback videos and nextCursor when fallback has multiple items", async () => {
      const result = await fetchVideos();
      expect(Array.isArray(result.videos)).toBe(true);
      expect(result.videos.length).toBeGreaterThan(0);
      expect(result.nextCursor).toBeDefined();
    });

    it("returns next page when cursor is provided", async () => {
      const first = await fetchVideos();
      if (!first.nextCursor) return;
      const second = await fetchVideos(first.nextCursor);
      expect(second.videos.length).toBeGreaterThan(0);
    });
  });

  describe("when NEXT_PUBLIC_VIDEOS_API_URL is set", () => {
    beforeEach(() => {
      process.env.NEXT_PUBLIC_VIDEOS_API_URL = "https://api.test/videos";
    });

    it("throws VideosApiError when response is not ok", async () => {
      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue({ ok: false, status: 500, statusText: "Internal Server Error" })
      );

      await expect(fetchVideos()).rejects.toThrow(VideosApiError);
      await expect(fetchVideos()).rejects.toMatchObject({
        message: expect.stringContaining("500"),
        status: 500,
      });
    });

    it("throws VideosApiError when response has no videos array", async () => {
      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue({
          ok: true,
          json: () => Promise.resolve({}),
        })
      );

      await expect(fetchVideos()).rejects.toThrow(VideosApiError);
      await expect(fetchVideos()).rejects.toThrow(/missing videos array/i);
    });

    it("returns videos and nextCursor when response is valid", async () => {
      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue({
          ok: true,
          json: () =>
            Promise.resolve({
              videos: [
                { id: "1", src: "/a.mp4", username: "@u", description: "d" },
              ],
              nextCursor: "next",
            }),
        })
      );

      const result = await fetchVideos();
      expect(result.videos).toHaveLength(1);
      expect(result.videos[0].id).toBe("1");
      expect(result.nextCursor).toBe("next");
    });
  });
});
