// @vitest-environment node

import { describe, expect, it } from "vitest";
import { readRuntimeConfig } from "./runtime-config.js";

describe("分支预览运行配置", () => {
  it("读取动态网页端口、API 端口和数据库路径", () => {
    expect(
      readRuntimeConfig(
        {
          PORT: "5188",
          API_PORT: "4318",
          CODE_QUEST_DB_PATH: "/tmp/code-quest-preview.sqlite",
        },
        "/project",
      ),
    ).toEqual({
      webPort: 5188,
      apiPort: 4318,
      databasePath: "/tmp/code-quest-preview.sqlite",
    });
  });

  it("为普通本地开发保留稳定默认值", () => {
    const runtime = readRuntimeConfig({}, "/project");

    expect(runtime.webPort).toBe(5173);
    expect(runtime.apiPort).toBe(4317);
    expect(runtime.databasePath).toBe("/project/.data/code-quest.sqlite");
  });

  it("拒绝端口冲突和非法值", () => {
    expect(() => readRuntimeConfig({ PORT: "4317", API_PORT: "4317" })).toThrow(
      "不能相同",
    );
    expect(() => readRuntimeConfig({ PORT: "wrong" })).toThrow("PORT");
  });
});
