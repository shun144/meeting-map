import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import paths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  build: {
    assetsInlineLimit: 0,
  },
  plugins: [
    react(),
    paths(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      strategies: "injectManifest",
      srcDir: "src",
      filename: "serviceWorker.ts",
      injectManifest: {
        globPatterns: ["**/*.{js,css,html}", "**/*.{png,jpg,svg}"],
        globIgnores: ["**/*.{pmtiles}"],
      },

      // 開発環境でもService Workerを有効にする
      devOptions: {
        enabled: true,
        type: "module", // ES Modulesを有効化
      },

      manifest: {
        name: "offline-map",
        short_name: "offmap",
        description: "オフライン待ち合わせアプリ",
        theme_color: "#ffffff",
        icons: [
          {
            src: "manifest-icon-192.maskable.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any",
          },

          {
            src: "manifest-icon-512.maskable.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "manifest-icon-512.maskable.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      "@styles": path.resolve(__dirname, "./src/styles"),
    },
  },

  css: {
    modules: {
      localsConvention: "dashes",
    },
  },
});
