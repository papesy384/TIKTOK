"use client";

import { Header } from "./Header";
import { Sidebar } from "./Sidebar";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col bg-tiktok-bg text-white">
      <Header />
      <div className="flex min-h-0 flex-1">
        <Sidebar />
        <main className="min-h-0 flex-1 overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
