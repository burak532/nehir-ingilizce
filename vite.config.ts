import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  // GitHub Pages alt-yol dağıtımı Aşama 4 sonunda repo adıyla netleşince ayarlanacak (bkz. technical-plan.md §10).
  base: "./",
  build: {
    target: "es2022"
  },
  plugins: [
    VitePWA({
      strategies: "injectManifest",
      srcDir: "src",
      filename: "sw.ts",
      injectRegister: false,
      manifest: {
        name: "Nehir'in İngilizcesi",
        short_name: "Nehir EN",
        description:
          "4 yaşındaki Nehir için ebeveynle birlikte oynanan, tamamen offline çalışan İngilizce öğrenme uygulaması.",
        lang: "en",
        start_url: ".",
        scope: ".",
        display: "standalone",
        orientation: "landscape",
        background_color: "#2a3d66",
        theme_color: "#2a3d66",
        icons: [
          { src: "icons/icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "icons/icon-512.png", sizes: "512x512", type: "image/png" },
          {
            src: "icons/icon-512-maskable.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable"
          }
        ]
      },
      injectManifest: {
        globPatterns: ["**/*.{js,css,html,svg,png,mp3,webmanifest}"],
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024
      },
      devOptions: {
        enabled: false
      }
    })
  ]
});
