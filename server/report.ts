import { createHash } from "node:crypto";
import { lstatSync, readFileSync, realpathSync, statSync } from "node:fs";
import { isAbsolute, relative, resolve } from "node:path";
import { getScenario } from "./scenarios.js";

const MAX_REPORT_BYTES = 128 * 1024;

export type VerificationStatus =
  "not_run" | "failed" | "passed" | "invalid_report";

export type SafeVerificationReport = {
  status: VerificationStatus;
  observedAt: string;
  report: Record<string, unknown>;
};

export function readScenarioReport(
  projectRoot: string,
  scenarioId: string,
  attemptStartedAt: string,
): SafeVerificationReport {
  const observedAt = new Date().toISOString();
  const scenario = getScenario(scenarioId);
  if (!scenario) {
    return invalid(observedAt, "场景未注册");
  }

  const sandboxRoot = realpathSync(resolve(projectRoot, "sandbox"));
  const configuredPath = resolve(sandboxRoot, scenario.reportRelativePath);
  const relativePath = relative(sandboxRoot, configuredPath);
  if (
    relativePath.startsWith("..") ||
    isAbsolute(relativePath) ||
    lstatSafe(configuredPath)?.isSymbolicLink()
  ) {
    return invalid(observedAt, "报告路径越出固定沙盒边界");
  }

  try {
    const realReportPath = realpathSync(configuredPath);
    const realRelativePath = relative(sandboxRoot, realReportPath);
    if (realRelativePath.startsWith("..") || isAbsolute(realRelativePath)) {
      return invalid(observedAt, "报告真实路径越出固定沙盒边界");
    }
    if (statSync(realReportPath).size > MAX_REPORT_BYTES) {
      return invalid(observedAt, "测试报告超过 128KB");
    }

    const sourcePath = resolve(
      sandboxRoot,
      scenario.verificationSourceRelativePath,
    );
    const realSourcePath = realpathSync(sourcePath);
    const sourceRelativePath = relative(sandboxRoot, realSourcePath);
    if (sourceRelativePath.startsWith("..") || isAbsolute(sourceRelativePath)) {
      return invalid(observedAt, "验证源码越出固定沙盒边界");
    }
    const currentSourceHash = createHash("sha256")
      .update(readFileSync(realSourcePath))
      .digest("hex");

    const raw = JSON.parse(readFileSync(realReportPath, "utf8")) as unknown;
    const parsed = validateReport(
      raw,
      scenarioId,
      attemptStartedAt,
      currentSourceHash,
    );
    if (!parsed.ok) return invalid(observedAt, parsed.reason);

    return {
      status: parsed.report.summary.failed === 0 ? "passed" : "failed",
      observedAt,
      report: parsed.report,
    };
  } catch (error) {
    if (isMissingFileError(error)) {
      return {
        status: "not_run",
        observedAt,
        report: { message: "尚未找到测试报告，请在练习目录手动运行 npm test" },
      };
    }
    return invalid(observedAt, "测试报告无法读取或不是有效 JSON");
  }
}

function validateReport(
  value: unknown,
  scenarioId: string,
  attemptStartedAt: string,
  currentSourceHash: string,
):
  | { ok: true; report: ValidReport }
  | {
      ok: false;
      reason: string;
    } {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return { ok: false, reason: "测试报告不是对象" };
  }
  const report = value as Partial<ValidReport>;
  if (report.schemaVersion !== 1 || report.scenarioId !== scenarioId) {
    return { ok: false, reason: "测试报告版本或场景不匹配" };
  }
  if (
    typeof report.generatedAt !== "string" ||
    Number.isNaN(Date.parse(report.generatedAt)) ||
    Date.parse(report.generatedAt) < Date.parse(attemptStartedAt)
  ) {
    return { ok: false, reason: "测试报告早于本次练习或时间无效" };
  }
  if (
    typeof report.sourceHash !== "string" ||
    !/^[a-f0-9]{64}$/.test(report.sourceHash)
  ) {
    return { ok: false, reason: "测试报告缺少有效源码指纹" };
  }
  if (report.sourceHash !== currentSourceHash) {
    return {
      ok: false,
      reason: "测试报告与当前沙盒源码不匹配，请重新运行测试",
    };
  }
  if (
    !report.summary ||
    !Number.isInteger(report.summary.passed) ||
    !Number.isInteger(report.summary.failed) ||
    !Array.isArray(report.tests) ||
    report.tests.some(
      (test) =>
        !test ||
        typeof test.name !== "string" ||
        !["passed", "failed"].includes(test.status),
    )
  ) {
    return { ok: false, reason: "测试报告结构无效" };
  }
  const passed = report.tests.filter((test) => test.status === "passed").length;
  const failed = report.tests.filter((test) => test.status === "failed").length;
  if (passed !== report.summary.passed || failed !== report.summary.failed) {
    return { ok: false, reason: "测试报告汇总与测试明细不一致" };
  }
  return { ok: true, report: report as ValidReport };
}

type ValidReport = {
  schemaVersion: 1;
  scenarioId: string;
  generatedAt: string;
  sourceHash: string;
  summary: { passed: number; failed: number };
  tests: Array<{
    name: string;
    status: "passed" | "failed";
    message?: string;
  }>;
};

function invalid(observedAt: string, reason: string): SafeVerificationReport {
  return {
    status: "invalid_report",
    observedAt,
    report: { message: reason },
  };
}

function lstatSafe(path: string) {
  try {
    return lstatSync(path);
  } catch {
    return undefined;
  }
}

function isMissingFileError(error: unknown) {
  return (
    error instanceof Error &&
    "code" in error &&
    (error as NodeJS.ErrnoException).code === "ENOENT"
  );
}
