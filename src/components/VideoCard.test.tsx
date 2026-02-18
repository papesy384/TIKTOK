import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { VideoCard } from "./VideoCard";

// jsdom does not implement HTMLMediaElement.play/pause; stub to avoid "Not implemented"
beforeEach(() => {
  HTMLMediaElement.prototype.pause = vi.fn();
  HTMLMediaElement.prototype.play = vi.fn().mockResolvedValue(undefined);
});

// Intersection Observer: video only plays when visible
beforeEach(() => {
  vi.stubGlobal(
    "IntersectionObserver",
    vi.fn(() => ({ observe: vi.fn(), disconnect: vi.fn() }))
  );
});

// Hls.js: avoid loading real HLS in tests
vi.mock("hls.js", () => ({
  default: {
    isSupported: () => false,
    Events: { ERROR: "error" },
  },
}));

describe("VideoCard", () => {
  const defaultProps = {
    id: "1",
    src: "/test.mp4",
    username: "@user",
    description: "Test video",
  };

  it("renders video element with src", () => {
    render(<VideoCard {...defaultProps} />);
    const video = document.querySelector("video");
    expect(video).toBeInTheDocument();
    expect(video).toHaveAttribute("src", "/test.mp4");
  });

  it("shows Video unavailable when video errors", () => {
    render(<VideoCard {...defaultProps} />);
    const video = document.querySelector("video");
    expect(video).toBeInTheDocument();

    fireEvent.error(video!);

    expect(screen.getByText("Video unavailable")).toBeInTheDocument();
  });

  it("calls onDoubleTap when double-tap is triggered via Overlay", () => {
    const onDoubleTap = vi.fn();
    render(<VideoCard {...defaultProps} onDoubleTap={onDoubleTap} />);
    const doubleTapArea = screen.getByRole("button", {
      name: /double tap to like/i,
      hidden: true,
    });
    fireEvent.doubleClick(doubleTapArea);
    expect(onDoubleTap).toHaveBeenCalledWith("1");
  });
});
