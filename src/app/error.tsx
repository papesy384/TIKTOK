"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("App error:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-black p-6 text-white">
      <h1 className="text-xl font-semibold">Something went wrong</h1>
      <p className="max-w-md text-center text-sm text-white/80">{error.message}</p>
      <button
        type="button"
        onClick={reset}
        className="rounded-lg bg-[#FE2C55] px-4 py-2 text-sm font-medium hover:opacity-90"
      >
        Try again
      </button>
    </div>
  );
}
