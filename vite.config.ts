import { defineConfig, type Plugin } from "vite";
import { resolve } from "node:path";
import { readFileSync, writeFileSync } from "node:fs";

const stripDevOnlyMarkup = (): Plugin => {
  let isProduction = false;

  return {
    name: "strip-dev-only-markup",
    configResolved(config) {
      isProduction = config.mode === "production";
    },
    writeBundle(options) {
      if (!isProduction) return;

      const outDir = typeof options.dir === "string" ? options.dir : resolve(__dirname, "dist");
      const panelHtmlPath = resolve(outDir, "panel.html");
      const html = readFileSync(panelHtmlPath, "utf8");
      const nextHtml = html.replace(/\s*<button\b[^>]*\bid="devRefreshBtn"[\s\S]*?<\/button>/g, "");

      if (nextHtml !== html) {
        writeFileSync(panelHtmlPath, nextHtml);
      }
    }
  };
};

export default defineConfig({
  plugins: [stripDevOnlyMarkup()],
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        devtools: resolve(__dirname, "devtools.html"),
        panel: resolve(__dirname, "panel.html"),
        background: resolve(__dirname, "src/background/service-worker.ts"),
        content: resolve(__dirname, "src/content/content.ts"),
        "page-hook": resolve(__dirname, "src/injected/page-hook.ts")
      },
      output: {
        entryFileNames: "[name].js",
        chunkFileNames: "chunks/[name].js",
        assetFileNames: "assets/[name][extname]"
      }
    }
  }
});
