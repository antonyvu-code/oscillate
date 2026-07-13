import { defineConfig } from "vite";

// OSCILLATE dev/preview both run on 5620 (see webdesign-digest memory: one port per project).
export default defineConfig({
  server: { port: 5620, strictPort: true },
  preview: { port: 5620, strictPort: true },
});
