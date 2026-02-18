import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { FeedEmpty } from "./FeedEmpty";

describe("FeedEmpty", () => {
  it("renders No videos yet message", () => {
    render(<FeedEmpty />);
    expect(screen.getByText("No videos yet")).toBeInTheDocument();
  });

  it("renders hint text", () => {
    render(<FeedEmpty />);
    expect(screen.getByText(/check back later or pull to refresh/i)).toBeInTheDocument();
  });
});
