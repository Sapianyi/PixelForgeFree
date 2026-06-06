import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  base: "/PixelForgeFree/",

  server: {
    port: 3000,
    headers: {
      "Cross-Origin-Opener-Policy": "same-origin",
      "Cross-Origin-Embedder-Policy": "require-corp",
    },
  },

  preview: {
    headers: {
      "Cross-Origin-Opener-Policy": "same-origin",
      "Cross-Origin-Embedder-Policy": "require-corp",
    },
  },

  optimizeDeps: {
    exclude: ["heic-decode"],
  },

  worker: {
    format: "es",
  },

  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },

  build: {
    target: "esnext",
    minify: "esbuild", // Тепер, коли esbuild встановлено, він відпрацює як годинник
  },

  // Використовуємо стандартний esbuild опціонал для чистки консолі,
  // оскільки тепер пакет встановлено фізично і типи підтягнуться коректно!
  esbuild: {
    drop: ["console", "debugger"],
  },
});
