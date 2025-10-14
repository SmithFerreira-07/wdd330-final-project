import { defineConfig } from "vite";
import { resolve } from "path";
import { fileURLToPath } from "url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  root: "./",
  build: {
    outDir: "dist",
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        about: resolve(__dirname, "src/pages/about.html"),
        recipes: resolve(__dirname, "recipes.html"),
        favorites: resolve(__dirname, "src/pages/favorites.html"),
        nutrition: resolve(__dirname, "src/pages/nutrition.html"),
      },
    },
  },
});
