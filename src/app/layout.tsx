import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TikTok Clone — Vertical Snap Feed",
  description: "Full-screen, gesture-driven vertical video feed with mandatory snapping.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full min-h-screen min-h-dvh overflow-hidden bg-black text-white">
        <div id="root-loading" className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-4 bg-black text-white">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          <p className="text-sm text-white/80">Loading feed…</p>
          <p id="root-loading-hint" className="hidden text-sm text-white/60" />
        </div>
        <script
          dangerouslySetInnerHTML={{
            __html: `
(function() {
  var el = document.getElementById('root-loading');
  var hint = document.getElementById('root-loading-hint');
  if (!el || !hint) return;
  var hide = function() { el.style.display = 'none'; };
  var showRefresh = function() {
    hint.textContent = 'Still loading? Refresh the page.';
    hint.classList.remove('hidden');
    hint.classList.add('cursor-pointer', 'underline');
    hint.onclick = function() { location.reload(); };
  };
  setTimeout(function() {
    if (el.style.display !== 'none') showRefresh();
  }, 10000);
  setTimeout(function() {
    if (el.style.display !== 'none') hide();
  }, 15000);
})();
`,
          }}
        />
        <div id="app-root">
          {children}
        </div>
      </body>
    </html>
  );
}
