import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { FeedError } from "./FeedError";

describe("FeedError", () => {
  it("renders default message when message prop is not provided", () => {
    render(<FeedError />);
    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
  });

  it("renders custom message when provided", () => {
    render(<FeedError message="Network error" />);
    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
    expect(screen.getByText("Network error")).toBeInTheDocument();
  });

  it("renders Try again button when onRetry is provided", () => {
    const onRetry = vi.fn();
    render(<FeedError onRetry={onRetry} />);
    const button = screen.getByRole("button", { name: /try again/i });
    expect(button).toBeInTheDocument();
    fireEvent.click(button);
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it("does not render Try again button when onRetry is not provided", () => {
    render(<FeedError message="Error" />);
    expect(screen.queryByRole("button", { name: /try again/i })).not.toBeInTheDocument();
  });

  it("has role alert for accessibility", () => {
    render(<FeedError />);
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });
});
