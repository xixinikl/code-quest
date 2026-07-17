import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import {
  buildDeliveryDossier,
  validateVerificationReport,
} from "../server/verificationReport.js";

const projectRoot = resolve(import.meta.dirname, "..");
const sourcePath = resolve(projectRoot, "server", "verificationReport.js");
const reportPath = resolve(projectRoot, "test-results.json");
const evidenceRoot = resolve(projectRoot, "evidence");
const results = [];

async function readJson(path) {
  return JSON.parse(await readFile(path, "utf8"));
}

async function run(name, test) {
  try {
    await test();
    results.push({ name, status: "passed" });
  } catch (error) {
    results.push({
      name,
      status: "failed",
      message: error instanceof Error ? error.message : String(error),
    });
  }
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const source = await readFile(sourcePath);
const currentSourceHash = createHash("sha256").update(source).digest("hex");
const failingBefore = await readJson(
  resolve(evidenceRoot, "failing-before.json"),
);
const passingAfterStale = await readJson(
  resolve(evidenceRoot, "passing-after-stale.json"),
);
const networkRun = await readJson(
  resolve(evidenceRoot, "network-test-run.json"),
);
const manualReport = await readFile(
  resolve(evidenceRoot, "manual-report.md"),
  "utf8",
);
const backendLog = await readFile(resolve(evidenceRoot, "backend.log"), "utf8");

await run("验收报告必须保留旧问题的失败复现，不能只有通过截图", () => {
  const passedOnlyReport = {
    ...passingAfterStale,
    sourceHash: currentSourceHash,
    tests: passingAfterStale.tests.filter((test) => test.status === "passed"),
  };
  const verdict = validateVerificationReport(
    passedOnlyReport,
    currentSourceHash,
  );

  assert(verdict.ok === false, "没有失败复现的报告不应该通过验收");
  assert(
    verdict.code === "MISSING_REPRODUCTION",
    "缺少复现用例时应返回 MISSING_REPRODUCTION",
  );
});

await run("验收报告必须同时包含单测、集成测试和手动复测", () => {
  const incompleteReport = {
    ...passingAfterStale,
    sourceHash: currentSourceHash,
    tests: [
      ...failingBefore.tests,
      {
        name: "筛选状态归一化保持用户选择",
        phase: "unit",
        status: "passed",
      },
    ],
    manual: undefined,
  };
  const verdict = validateVerificationReport(
    incompleteReport,
    currentSourceHash,
  );

  assert(verdict.ok === false, "证据不完整的报告不应该通过验收");
  assert(
    verdict.code === "INCOMPLETE_EVIDENCE",
    "缺少集成或手动复测时应返回 INCOMPLETE_EVIDENCE",
  );
});

await run("通过报告必须绑定当前源码 hash，过期报告要被拒绝", () => {
  const verdict = validateVerificationReport(
    passingAfterStale,
    currentSourceHash,
  );

  assert(verdict.ok === false, "sourceHash 不一致的旧报告不应该通过");
  assert(verdict.code === "STALE_REPORT", "过期报告应返回 STALE_REPORT");
});

await run("Network 和日志只能作为证据，不能替代测试报告", () => {
  assert(
    networkRun.steps.some(
      (step) =>
        step.method === "GET" && step.url === "/api/tasks?status=blocked",
    ),
    "Network 证据需要包含筛选请求",
  );
  assert(
    networkRun.steps.some(
      (step) =>
        step.method === "POST" && step.url === "/api/reports/verification",
    ),
    "Network 证据需要包含报告提交请求",
  );
  assert(
    backendLog.includes("sourceHash=old_source_hash_from_before_latest_change"),
    "后端日志需要暴露报告过期线索",
  );

  const networkOnlyReport = {
    schemaVersion: 1,
    scenarioId: "frontend-testing-proof",
    sourceHash: currentSourceHash,
    summary: { passed: 1, failed: 0 },
    tests: [],
    manual: {
      steps: ["看 Network 里筛选请求和报告提交都是 200/201"],
      expected: "筛选请求成功",
      actual: "筛选请求成功",
    },
  };
  const verdict = validateVerificationReport(
    networkOnlyReport,
    currentSourceHash,
  );

  assert(verdict.ok === false, "只有 Network 不能证明旧 bug 修好了");
});

await run("交付卷宗必须写清回归风险和面试表达", () => {
  const dossier = buildDeliveryDossier({
    report: {
      ...passingAfterStale,
      sourceHash: currentSourceHash,
      tests: [...failingBefore.tests, ...passingAfterStale.tests],
    },
    manualReport,
    risks: ["状态切换组合筛选", "390px 移动端筛选结果"],
  });

  assert(Array.isArray(dossier.regressionRisks), "卷宗需要列出回归风险");
  assert(
    dossier.regressionRisks.includes("状态切换组合筛选"),
    "卷宗没有保留具体回归风险",
  );
  assert(
    /面试|复现|验收|当前代码/.test(dossier.interviewLine ?? ""),
    "卷宗需要给出可用于面试的验收表达",
  );
  assert(
    dossier.accepted === false,
    "仍有回归风险时不应该把交付标为可直接接收",
  );
});

const report = {
  schemaVersion: 1,
  scenarioId: "frontend-testing-proof",
  generatedAt: new Date().toISOString(),
  sourceHash: currentSourceHash,
  summary: {
    passed: results.filter((result) => result.status === "passed").length,
    failed: results.filter((result) => result.status === "failed").length,
  },
  tests: results,
};

await writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");

for (const result of results) {
  const symbol = result.status === "passed" ? "✓" : "✗";
  console.log(`${symbol} ${result.name}`);
  if (result.message) console.log(`  ${result.message}`);
}

console.log(
  `\n${report.summary.passed} passed, ${report.summary.failed} failed`,
);
console.log("已生成 test-results.json，学习应用可以读取这份报告。");

if (report.summary.failed > 0) process.exitCode = 1;
