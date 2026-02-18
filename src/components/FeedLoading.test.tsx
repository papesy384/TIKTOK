import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { FeedLoading } from "./FeedLoading";

describe("FeedLoading", () => {
  it("renders loading status and message", () => {
    render(<FeedLoading />);
    expect(screen.getByRole("status", { name: /loading feed/i })).toBeInTheDocument();
    expect(screen.getByText("Loading videos…")).toBeInTheDocument();
  });
});
