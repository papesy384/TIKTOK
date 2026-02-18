import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, act, fireEvent } from "@testing-library/react";
import { useInfiniteVideos } from "./useInfiniteVideos";

const mockVideos = [
  { id: "1", src: "/a.mp4", username: "@a", description: "A" },
  { id: "2", src: "/b.mp4", username: "@b", description: "B" },
];

vi.mock("@/lib/api/videos", () => ({
  fetchVideos: vi.fn(),
}));

import { fetchVideos } from "@/lib/api/videos";

function TestHarness({
  fallback = [],
}: {
  fallback?: { id: string; src: string; username: string; description: string }[];
}) {
  const result = useInfiniteVideos({ fallbackVideos: fallback });
  return (
    <div>
      <span data-testid="loading">{String(result.isLoading)}</span>
      <span data-testid="loadingMore">{String(result.isLoadingMore)}</span>
      <span data-testid="hasMore">{String(result.hasMore)}</span>
      <span data-testid="count">{result.videos.length}</span>
      {result.error && (
        <span data-testid="error">{result.error.message}</span>
      )}
      <button onClick={result.retry}>Retry</button>
      <button onClick={result.loadMore}>Load more</button>
    </div>
  );
}

describe("useInfiniteVideos", () => {
  beforeEach(() => {
    vi.mocked(fetchVideos).mockReset();
  });

  it("shows loading then videos when initial fetch succeeds", async () => {
    vi.mocked(fetchVideos).mockResolvedValue({
      videos: mockVideos,
      nextCursor: "1",
    });

    render(<TestHarness fallback={[]} />);

    expect(screen.getByTestId("loading").textContent).toBe("true");

    await waitFor(() => {
      expect(screen.getByTestId("loading").textContent).toBe("false");
    });

    expect(screen.getByTestId("count").textContent).toBe("2");
    expect(screen.getByTestId("hasMore").textContent).toBe("true");
    expect(screen.queryByTestId("error")).not.toBeInTheDocument();
  });

  it("sets error and fallback videos when initial fetch fails", async () => {
    vi.mocked(fetchVideos).mockRejectedValue(new Error("Network error"));
    const fallback = [{ id: "f1", src: "/f.mp4", username: "@f", description: "F" }];

    render(<TestHarness fallback={fallback} />);

    await waitFor(() => {
      expect(screen.getByTestId("loading").textContent).toBe("false");
    });

    expect(screen.getByTestId("error").textContent).toBe("Network error");
    expect(screen.getByTestId("count").textContent).toBe("1");
    expect(screen.getByTestId("hasMore").textContent).toBe("false");
  });

  it("retry clears error and refetches", async () => {
    vi.mocked(fetchVideos)
      .mockRejectedValueOnce(new Error("Network error"))
      .mockResolvedValueOnce({ videos: mockVideos, nextCursor: null });

    render(<TestHarness fallback={[]} />);

    await waitFor(() => {
      expect(screen.getByTestId("error")).toBeInTheDocument();
    });

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /retry/i }));
    });

    await waitFor(() => {
      expect(screen.queryByTestId("error")).not.toBeInTheDocument();
      expect(screen.getByTestId("count").textContent).toBe("2");
    });
  });

  it("loadMore appends videos and updates hasMore", async () => {
    vi.mocked(fetchVideos)
      .mockResolvedValueOnce({ videos: mockVideos, nextCursor: "1" })
      .mockResolvedValueOnce({
        videos: [{ id: "3", src: "/c.mp4", username: "@c", description: "C" }],
        nextCursor: null,
      });

    render(<TestHarness fallback={[]} />);

    await waitFor(() => {
      expect(screen.getByTestId("count").textContent).toBe("2");
    });

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /load more/i }));
    });

    await waitFor(() => {
      expect(screen.getByTestId("loadingMore").textContent).toBe("false");
    });

    expect(screen.getByTestId("count").textContent).toBe("3");
    expect(screen.getByTestId("hasMore").textContent).toBe("false");
  });

  it("loadMore on failure sets hasMore false and keeps existing videos", async () => {
    vi.mocked(fetchVideos)
      .mockResolvedValueOnce({ videos: mockVideos, nextCursor: "1" })
      .mockRejectedValueOnce(new Error("Load more failed"));

    render(<TestHarness fallback={[]} />);

    await waitFor(() => {
      expect(screen.getByTestId("count").textContent).toBe("2");
    });

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /load more/i }));
    });

    await waitFor(() => {
      expect(screen.getByTestId("loadingMore").textContent).toBe("false");
    });

    expect(screen.getByTestId("count").textContent).toBe("2");
    expect(screen.getByTestId("hasMore").textContent).toBe("false");
  });
});
