import { defineConfig } from "vite";

export default defineConfig({
  // GitHub Pages alt-yol dağıtımı Aşama 4 sonunda repo adıyla netleşince ayarlanacak (bkz. technical-plan.md §10).
  base: "./",
  build: {
    target: "es2022"
  }
});
