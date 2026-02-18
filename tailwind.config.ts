import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // TikTok-style design tokens
      colors: {
        feed: {
          bg: "#000000",
          overlay: "rgba(0,0,0,0.7)",
          text: "#ffffff",
          "text-muted": "rgba(255,255,255,0.9)",
        },
        tiktok: {
          red: "#FE2C55",
          "red-hover": "#ff4d6a",
          bg: "#000000",
          "sidebar-bg": "#161823",
          "sidebar-hover": "#2c2c2e",
          "icon-bg": "#2c2c2e",
        },
      },
      spacing: {
        "feed-x": "1rem",
        "feed-y": "1rem",
        "overlay-padding": "1rem",
      },
      fontFamily: {
        sans: ["system-ui", "sans-serif"],
      },
      height: {
        "screen-dynamic": "100dvh",
      },
      padding: {
        "safe": "env(safe-area-inset-bottom, 0)",
      },
      minHeight: {
        "touch-target": "44px",
      },
      minWidth: {
        "touch-target": "44px",
      },
    },
  },
  plugins: [],
};

export default config;
