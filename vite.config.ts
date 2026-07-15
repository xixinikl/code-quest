import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

const apiProxyTarget =
  process.env.CODE_QUEST_API_TARGET ?? "http://127.0.0.1:4317";

export default defineConfig({
  plugins: [react()],
  build: {
    manifest: true,
  },
  server: {
    host: "127.0.0.1",
    proxy: {
      "/api": apiProxyTarget,
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts",
    include: ["src/**/*.test.{ts,tsx}", "server/**/*.test.ts"],
    css: true,
    testTimeout: 60000,
  },
});
