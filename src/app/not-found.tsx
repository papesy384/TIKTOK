import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-black text-white">
      <h1 className="text-xl font-semibold">Page not found</h1>
      <p className="text-sm text-white/80">
        The feed is on the home page.
      </p>
      <Link
        href="/"
        className="rounded-full bg-[#FE2C55] px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90"
      >
        Go to feed
      </Link>
    </div>
  );
}
