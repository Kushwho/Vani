import { defineConfig } from "vite";

import react from "@vitejs/plugin-react";
import VitePluginSitemap  from "vite-plugin-sitemap";

import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePluginSitemap({
      hostname: "https://vanii.ai",
      generateRobotsTxt: true,
      exclude: ["/admin", "/private"],
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
