"use client";

export function Header() {
  return (
    <header className="flex h-14 shrink-0 items-center justify-end gap-6 border-b border-white/10 bg-tiktok-bg px-4 md:px-6">
      <nav className="hidden items-center gap-5 md:flex">
        <a href="#" className="text-sm text-white/80 hover:text-white">Get Coins</a>
        <a href="#" className="text-sm text-white/80 hover:text-white">Get App</a>
        <a href="#" className="text-sm text-white/80 hover:text-white">PC App</a>
      </nav>
      <button
        type="button"
        className="rounded-md bg-tiktok-red px-5 py-2 text-sm font-semibold text-white hover:bg-tiktok-red-hover"
      >
        Log in
      </button>
    </header>
  );
}
