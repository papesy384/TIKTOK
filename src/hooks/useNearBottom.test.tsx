import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render } from "@testing-library/react";
import React from "react";
import { useNearBottom } from "./useNearBottom";

describe("useNearBottom", () => {
  let mockObserve: ReturnType<typeof vi.fn>;
  let mockDisconnect: ReturnType<typeof vi.fn>;
  let observerCallback: IntersectionObserverCallback;

  beforeEach(() => {
    mockObserve = vi.fn();
    mockDisconnect = vi.fn();
    vi.stubGlobal(
      "IntersectionObserver",
      vi.fn((callback: IntersectionObserverCallback) => {
        observerCallback = callback;
        return { observe: mockObserve, disconnect: mockDisconnect };
      })
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  type WrapperProps = {
    onNearBottom: () => void;
    disabled?: boolean;
    rootMargin?: string;
  };

  function NearBottomWrapper({ onNearBottom, disabled, rootMargin }: WrapperProps) {
    const [root, setRoot] = React.useState<HTMLDivElement | null>(null);
    const { sentinelRef } = useNearBottom({
      root,
      onNearBottom,
      disabled,
      rootMargin,
    });
    return (
      <div ref={(el) => el && setRoot(el)}>
        <div ref={sentinelRef} data-testid="sentinel" />
      </div>
    );
  }

  it("observes the sentinel with root and correct options when mounted", () => {
    const onNearBottom = vi.fn();
    render(<NearBottomWrapper onNearBottom={onNearBottom} />);

    expect(IntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      expect.objectContaining({ rootMargin: "200px", threshold: 0 })
    );
    expect(mockObserve).toHaveBeenCalled();
  });

  it("calls onNearBottom when sentinel intersects", () => {
    const onNearBottom = vi.fn();
    render(<NearBottomWrapper onNearBottom={onNearBottom} />);

    observerCallback(
      [{ isIntersecting: true, intersectionRatio: 0.5 } as IntersectionObserverEntry],
      {} as IntersectionObserver
    );

    expect(onNearBottom).toHaveBeenCalledTimes(1);
  });

  it("does not call onNearBottom when sentinel is not intersecting", () => {
    const onNearBottom = vi.fn();
    render(<NearBottomWrapper onNearBottom={onNearBottom} />);

    observerCallback(
      [{ isIntersecting: false, intersectionRatio: 0 } as IntersectionObserverEntry],
      {} as IntersectionObserver
    );

    expect(onNearBottom).not.toHaveBeenCalled();
  });

  it("does not call onNearBottom when disabled is true", () => {
    const onNearBottom = vi.fn();
    const { rerender } = render(
      <NearBottomWrapper onNearBottom={onNearBottom} disabled />
    );

    observerCallback(
      [{ isIntersecting: true, intersectionRatio: 1 } as IntersectionObserverEntry],
      {} as IntersectionObserver
    );

    expect(onNearBottom).not.toHaveBeenCalled();

    rerender(
      <NearBottomWrapper onNearBottom={onNearBottom} disabled={false} />
    );
    observerCallback(
      [{ isIntersecting: true, intersectionRatio: 1 } as IntersectionObserverEntry],
      {} as IntersectionObserver
    );

    expect(onNearBottom).toHaveBeenCalledTimes(1);
  });

  it("uses custom rootMargin when provided", () => {
    const onNearBottom = vi.fn();
    render(
      <NearBottomWrapper onNearBottom={onNearBottom} rootMargin="400px" />
    );

    expect(IntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      expect.objectContaining({ rootMargin: "400px" })
    );
  });

  it("disconnects observer on unmount", () => {
    const onNearBottom = vi.fn();
    const { unmount } = render(
      <NearBottomWrapper onNearBottom={onNearBottom} />
    );

    unmount();

    expect(mockDisconnect).toHaveBeenCalled();
  });
});
