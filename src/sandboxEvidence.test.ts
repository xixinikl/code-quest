import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

function readTextFiles(directory: string): string[] {
  const entries = readdirSync(directory);

  return entries.flatMap((entry) => {
    const path = join(directory, entry);
    const stat = statSync(path);

    if (stat.isDirectory()) return readTextFiles(path);
    if (!stat.isFile()) return [];

    return readFileSync(path, "utf8");
  });
}

describe("sandbox evidence ownership", () => {
  it("前端第 5 关沙盒证物不再回退到 AI 保存画布链路", () => {
    const corpus = readTextFiles("sandbox/frontend-testing-proof").join("\n");

    expect(corpus).not.toContain("/api/canvases");
    expect(corpus).not.toContain("canvas-save-persistence");
    expect(corpus).not.toContain("保存画布");
    expect(corpus).not.toContain("验收试炼画布");
    expect(corpus).not.toContain("保存后刷新");
    expect(corpus).not.toContain("打开画布页面");
    expect(corpus).toContain("/api/tasks?status=blocked");
    expect(corpus).toContain("/api/reports/verification");
    expect(corpus).toContain("sourceHash");
  });
});
