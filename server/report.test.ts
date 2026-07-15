// @vitest-environment node

import { createHash } from "node:crypto";
import {
  mkdirSync,
  mkdtempSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { readScenarioReport } from "./report.js";

const cleanup: Array<() => void> = [];

afterEach(() => {
  while (cleanup.length) cleanup.pop()?.();
});

describe("固定沙盒测试报告读取", () => {
  it("读取真实失败报告但不执行任何命令", () => {
    const projectRoot = createProjectWithReport();
    const result = readScenarioReport(
      projectRoot,
      "canvas-save-persistence",
      "2026-01-01T00:00:00.000Z",
    );

    expect(result.status).toBe("failed");
    expect(result.report.summary).toEqual({ passed: 1, failed: 1 });
    expect(JSON.stringify(result)).not.toContain(projectRoot);
  });

  it("拒绝早于当前练习的旧报告", () => {
    const projectRoot = createProjectWithReport();
    const result = readScenarioReport(
      projectRoot,
      "canvas-save-persistence",
      "2099-01-01T00:00:00.000Z",
    );

    expect(result.status).toBe("invalid_report");
    expect(result.report.message).toBe("测试报告早于本次练习或时间无效");
  });

  it("拒绝与当前源码不匹配的旧通过报告", () => {
    const projectRoot = createProjectWithReport();
    const sourcePath = resolve(
      projectRoot,
      "sandbox",
      "canvas-save-persistence",
      "server",
      "canvasRepository.js",
    );
    writeFileSync(sourcePath, "export const repositoryVersion = 'changed';\n");

    const result = readScenarioReport(
      projectRoot,
      "canvas-save-persistence",
      "2026-01-01T00:00:00.000Z",
    );

    expect(result.status).toBe("invalid_report");
    expect(result.report.message).toBe(
      "测试报告与当前沙盒源码不匹配，请重新运行测试",
    );
  });

  it("拒绝通过符号链接逃出 sandbox 的报告", () => {
    const projectRoot = mkdtempSync(join(tmpdir(), "code-quest-report-"));
    cleanup.push(() => rmSync(projectRoot, { recursive: true, force: true }));
    const reportPath = join(
      projectRoot,
      "sandbox",
      "canvas-save-persistence",
      "test-results.json",
    );
    const outsidePath = join(projectRoot, "outside.json");
    mkdirSync(dirname(reportPath), { recursive: true });
    writeFileSync(outsidePath, "{}");
    symlinkSync(outsidePath, reportPath);

    const result = readScenarioReport(
      projectRoot,
      "canvas-save-persistence",
      "2026-01-01T00:00:00.000Z",
    );

    expect(result.status).toBe("invalid_report");
    expect(result.report.message).toBe("报告路径越出固定沙盒边界");
  });

  it("报告尚未生成时返回可操作的等待状态", () => {
    const projectRoot = mkdtempSync(join(tmpdir(), "code-quest-report-"));
    cleanup.push(() => rmSync(projectRoot, { recursive: true, force: true }));
    const sourcePath = resolve(
      projectRoot,
      "sandbox",
      "canvas-save-persistence",
      "server",
      "canvasRepository.js",
    );
    mkdirSync(dirname(sourcePath), { recursive: true });
    writeFileSync(sourcePath, "export const repositoryVersion = 'test';\n");

    const result = readScenarioReport(
      projectRoot,
      "canvas-save-persistence",
      "2026-01-01T00:00:00.000Z",
    );

    expect(result.status).toBe("not_run");
    expect(result.report.message).toContain("尚未找到测试报告");
  });

  it("拒绝损坏的 JSON 报告并提示重新运行测试", () => {
    const projectRoot = mkdtempSync(join(tmpdir(), "code-quest-report-"));
    cleanup.push(() => rmSync(projectRoot, { recursive: true, force: true }));
    const reportPath = join(
      projectRoot,
      "sandbox",
      "canvas-save-persistence",
      "test-results.json",
    );
    const sourcePath = join(
      projectRoot,
      "sandbox",
      "canvas-save-persistence",
      "server",
      "canvasRepository.js",
    );
    mkdirSync(dirname(reportPath), { recursive: true });
    mkdirSync(dirname(sourcePath), { recursive: true });
    writeFileSync(sourcePath, "export const repositoryVersion = 'test';\n");
    writeFileSync(reportPath, "{ this is not valid JSON", "utf8");

    const result = readScenarioReport(
      projectRoot,
      "canvas-save-persistence",
      "2026-01-01T00:00:00.000Z",
    );

    expect(result.status).toBe("invalid_report");
    expect(result.report.message).toBe("测试报告无法读取或不是有效 JSON");
  });
});

function createProjectWithReport() {
  const projectRoot = mkdtempSync(join(tmpdir(), "code-quest-report-"));
  cleanup.push(() => rmSync(projectRoot, { recursive: true, force: true }));
  const reportPath = resolve(
    projectRoot,
    "sandbox",
    "canvas-save-persistence",
    "test-results.json",
  );
  const sourcePath = resolve(
    projectRoot,
    "sandbox",
    "canvas-save-persistence",
    "server",
    "canvasRepository.js",
  );
  mkdirSync(dirname(reportPath), { recursive: true });
  mkdirSync(dirname(sourcePath), { recursive: true });
  const source = "export const repositoryVersion = 'test';\n";
  writeFileSync(sourcePath, source);
  writeFileSync(
    reportPath,
    JSON.stringify({
      schemaVersion: 1,
      scenarioId: "canvas-save-persistence",
      generatedAt: "2026-06-30T10:00:00.000Z",
      sourceHash: createHash("sha256").update(source).digest("hex"),
      summary: { passed: 1, failed: 1 },
      tests: [
        { name: "持久化后可读取", status: "failed" },
        { name: "未登录请求被拒绝", status: "passed" },
      ],
    }),
  );
  return projectRoot;
}
