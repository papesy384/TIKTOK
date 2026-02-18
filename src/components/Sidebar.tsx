"use client";

const navItems = [
  { label: "For You", icon: "⌂", active: true },
  { label: "Shop", icon: "🛒" },
  { label: "Explore", icon: "◇" },
  { label: "Following", icon: "👤" },
  { label: "LIVE", icon: "●" },
  { label: "Upload", icon: "+" },
  { label: "Profile", icon: "👤" },
  { label: "More", icon: "⋯" },
];

export function Sidebar() {
  return (
    <aside className="hidden w-[72px] shrink-0 flex-col border-r border-white/10 bg-tiktok-sidebar-bg md:flex lg:w-56 lg:px-3">
      <div className="flex h-14 items-center gap-2 px-3 lg:px-0">
        <span className="flex h-9 w-9 items-center justify-center rounded text-xl lg:mr-2">♪</span>
        <span className="hidden text-xl font-bold text-white lg:inline">TikTok</span>
      </div>
      <div className="mt-2 hidden lg:block">
        <div className="flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2 text-sm text-white/60">
          <span>🔍</span>
          <span>Search</span>
        </div>
      </div>
      <nav className="mt-4 flex flex-1 flex-col gap-1">
        {navItems.map((item) => (
          <a
            key={item.label}
            href="#"
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-[15px] transition-colors hover:bg-tiktok-sidebar-hover ${
              item.active ? "text-tiktok-red" : "text-white"
            }`}
          >
            <span className="flex h-8 w-8 items-center justify-center text-xl">{item.icon}</span>
            <span className="hidden lg:inline">{item.label}</span>
          </a>
        ))}
      </nav>
      <button
        type="button"
        className="mx-3 mt-4 rounded-lg bg-tiktok-red py-2.5 text-sm font-semibold text-white hover:bg-tiktok-red-hover lg:mb-4"
      >
        Log in
      </button>
      <div className="hidden border-t border-white/10 py-4 lg:block">
        <div className="flex flex-wrap gap-3 px-2 text-xs text-white/50">
          <a href="#" className="hover:underline">Company</a>
          <a href="#" className="hover:underline">Program</a>
          <a href="#" className="hover:underline">Terms & Policies</a>
        </div>
        <p className="mt-3 px-2 text-xs text-white/40">© 2026 TikTok</p>
      </div>
    </aside>
  );
}
