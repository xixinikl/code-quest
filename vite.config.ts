import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";
import { readRuntimeConfig } from "./runtime-config.js";

export default defineConfig(() => {
  const runtime = readRuntimeConfig();
  return {
    plugins: [react()],
    server: {
      host: "127.0.0.1",
      port: runtime.webPort,
      strictPort: true,
      proxy: {
        "/api": `http://127.0.0.1:${runtime.apiPort}`,
      },
    },
    test: {
      environment: "jsdom",
      setupFiles: "./src/test/setup.ts",
      css: true,
      testTimeout: 15000,
    },
  };
});
