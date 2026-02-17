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
      <body className="h-full min-h-screen overflow-hidden">
        {children}
      </body>
    </html>
  );
}
