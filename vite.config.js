import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// GitHub Pages serves this project under /reset-2026/.
const base = "/reset-2026/";

export default defineConfig({
  base,
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["apple-touch-icon.png", "favicon-64.png"],
      manifest: {
        name: "Jimmy's 2026 Reset",
        short_name: "Reset",
        description: "A daily reset — one circle at a time.",
        start_url: base,
        scope: base,
        display: "standalone",
        orientation: "portrait",
        background_color: "#E9E5DB",
        theme_color: "#E9E5DB",
        icons: [
          { src: "icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "icon-512.png", sizes: "512x512", type: "image/png" },
          { src: "icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
        ],
      },
      workbox: {
        // Bundle everything for offline — the app already stores its data locally.
        globPatterns: ["**/*.{js,css,html,woff,woff2,png,svg,ico}"],
      },
    }),
  ],
  server: { port: 5173, open: true },
});
