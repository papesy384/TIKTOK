import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Feed } from "./Feed";

const mockVideos = [
  { id: "1", src: "/a.mp4", username: "@a", description: "Video A" },
  { id: "2", src: "/b.mp4", username: "@b", description: "Video B" },
];

beforeEach(() => {
  HTMLMediaElement.prototype.pause = vi.fn();
  HTMLMediaElement.prototype.play = vi.fn().mockResolvedValue(undefined);
  vi.stubGlobal(
    "IntersectionObserver",
    vi.fn(() => ({ observe: vi.fn(), disconnect: vi.fn() }))
  );
});

describe("Feed integration", () => {
  it("shows FeedLoading when loading and no videos", () => {
    render(
      <Feed videos={[]} isLoading error={null} />
    );
    expect(screen.getByRole("status", { name: /loading feed/i })).toBeInTheDocument();
  });

  it("shows FeedError with message and retry when error is set", () => {
    const onRetry = vi.fn();
    render(
      <Feed
        videos={[]}
        isLoading={false}
        error={new Error("Network failed")}
        onRetry={onRetry}
      />
    );
    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByText("Network failed")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /try again/i }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it("shows FeedEmpty when not loading, no error, and no videos", () => {
    render(
      <Feed videos={[]} isLoading={false} error={null} />
    );
    expect(screen.getByText("No videos yet")).toBeInTheDocument();
  });

  it("renders feed with correct number of video cards when videos provided", () => {
    render(
      <Feed videos={mockVideos} isLoading={false} error={null} />
    );
    expect(screen.getByRole("feed", { name: /vertical video feed/i })).toBeInTheDocument();
    const sections = document.querySelectorAll("[data-video-id]");
    expect(sections).toHaveLength(2);
    expect(sections[0]).toHaveAttribute("data-video-id", "1");
    expect(sections[1]).toHaveAttribute("data-video-id", "2");
  });

  it("when loading but videos already present, shows feed not loading spinner", () => {
    render(
      <Feed videos={mockVideos} isLoading isLoadingMore={false} />
    );
    expect(screen.getByRole("feed")).toBeInTheDocument();
    expect(screen.queryByRole("status", { name: /loading feed/i })).not.toBeInTheDocument();
  });

  it("mute toggle is shared across videos: unmute once, both cards show Mute button", () => {
    render(
      <Feed videos={mockVideos} isLoading={false} error={null} />
    );
    const unmuteButtons = screen.getAllByRole("button", { name: /unmute/i, hidden: true });
    expect(unmuteButtons.length).toBeGreaterThanOrEqual(1);
    fireEvent.click(unmuteButtons[0]);
    expect(screen.getAllByRole("button", { name: /mute/i, hidden: true })).toHaveLength(2);
  });

  it("Arrow Down scrolls to next video (scrollTo called)", () => {
    const scrollTo = vi.fn();
    render(
      <Feed videos={mockVideos} isLoading={false} error={null} />
    );
    const feedEl = screen.getByRole("feed", { name: /vertical video feed/i });
    Object.defineProperty(feedEl, "scrollTo", { value: scrollTo, configurable: true });
    Object.defineProperty(feedEl, "scrollTop", { value: 0, writable: true, configurable: true });
    Object.defineProperty(feedEl, "clientHeight", { value: 400, configurable: true });
    const firstChild = feedEl.children[0] as HTMLElement;
    const secondChild = feedEl.children[1] as HTMLElement;
    if (firstChild) Object.defineProperty(firstChild, "offsetTop", { value: 0, configurable: true });
    if (secondChild) Object.defineProperty(secondChild, "offsetTop", { value: 400, configurable: true });

    fireEvent.keyDown(window, { key: "ArrowDown" });
    expect(scrollTo).toHaveBeenCalledWith({ top: 400, behavior: "instant" });
  });

  it("Arrow Up scrolls to previous video (scrollTo called)", () => {
    const scrollTo = vi.fn();
    render(
      <Feed videos={mockVideos} isLoading={false} error={null} />
    );
    const feedEl = screen.getByRole("feed", { name: /vertical video feed/i });
    Object.defineProperty(feedEl, "scrollTo", { value: scrollTo, configurable: true });
    Object.defineProperty(feedEl, "scrollTop", { value: 400, writable: true, configurable: true });
    Object.defineProperty(feedEl, "clientHeight", { value: 400, configurable: true });
    const firstChild = feedEl.children[0] as HTMLElement;
    const secondChild = feedEl.children[1] as HTMLElement;
    if (firstChild) Object.defineProperty(firstChild, "offsetTop", { value: 0, configurable: true });
    if (secondChild) Object.defineProperty(secondChild, "offsetTop", { value: 400, configurable: true });

    fireEvent.keyDown(window, { key: "ArrowUp" });
    expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: "instant" });
  });

  it("double-tap on first video calls onEngage with that video id", () => {
    const onEngage = vi.fn();
    render(
      <Feed videos={mockVideos} isLoading={false} error={null} onEngage={onEngage} />
    );
    const doubleTapButtons = screen.getAllByRole("button", { name: /double tap to like/i, hidden: true });
    fireEvent.doubleClick(doubleTapButtons[0]);
    expect(onEngage).toHaveBeenCalledTimes(1);
    expect(onEngage).toHaveBeenCalledWith("1");
  });

  it("when near bottom, onLoadMore is called", () => {
    const onLoadMore = vi.fn();
    let triggerIntersect: () => void;
    vi.stubGlobal(
      "IntersectionObserver",
      vi.fn(function (this: unknown, callback: IntersectionObserverCallback) {
        triggerIntersect = () =>
          callback(
            [{ isIntersecting: true } as IntersectionObserverEntry],
            {} as IntersectionObserver
          );
        return { observe: vi.fn(), disconnect: vi.fn() };
      })
    );
    render(
      <Feed videos={mockVideos} isLoading={false} error={null} onLoadMore={onLoadMore} hasMore />
    );
    triggerIntersect!();
    expect(onLoadMore).toHaveBeenCalledTimes(1);
  });
});
