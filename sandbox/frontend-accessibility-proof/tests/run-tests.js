import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import {
  buildReleaseDecision,
  reviewReleaseReadiness,
} from "../server/releaseGate.js";

const projectRoot = resolve(import.meta.dirname, "..");
const sourcePath = resolve(projectRoot, "server", "releaseGate.js");
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
const plan = await readJson(resolve(evidenceRoot, "release-plan.json"));
const environment = await readJson(
  resolve(evidenceRoot, "environment-check.json"),
);
const backup = await readJson(resolve(evidenceRoot, "backup-record.json"));
const smokeTest = await readJson(resolve(evidenceRoot, "smoke-test.json"));
const monitoring = await readJson(
  resolve(evidenceRoot, "monitoring-snapshot.json"),
);
const rollback = await readFile(
  resolve(evidenceRoot, "rollback-plan.md"),
  "utf8",
);
const backendLog = await readFile(resolve(evidenceRoot, "backend.log"), "utf8");

function createRelease(overrides = {}) {
  return {
    name: "第 14 章上线前夜",
    build: { status: "passed", sourceHash: currentSourceHash },
    plan,
    environment,
    dataChange: { requiresBackup: true },
    backup,
    smokeTest,
    monitoring,
    rollback: {
      draft: rollback,
      trigger: "",
      verifyAfterRollback: "",
    },
    ...overrides,
  };
}

await run("上线计划必须写清负责人和值守人", () => {
  const verdict = reviewReleaseReadiness(createRelease());

  assert(verdict.ready === false, "缺少负责人和值守人不应该放行");
  assert(
    verdict.code === "MISSING_RELEASE_OWNER",
    "缺少负责人应返回 MISSING_RELEASE_OWNER",
  );
});

await run("生产环境变量缺失时不能上线", () => {
  const verdict = reviewReleaseReadiness(
    createRelease({
      plan: { ...plan, owner: "发布人", observer: "观察人" },
    }),
  );

  assert(verdict.ready === false, "缺少 AI_API_KEY 不应该放行");
  assert(verdict.code === "MISSING_ENV_VAR", "缺配置应返回 MISSING_ENV_VAR");
});

await run("涉及数据变更时，备份必须证明可恢复", () => {
  const verdict = reviewReleaseReadiness(
    createRelease({
      plan: { ...plan, owner: "发布人", observer: "观察人" },
      environment: {
        ...environment,
        AI_API_KEY: { status: "present", safeToShow: false },
      },
    }),
  );

  assert(verdict.ready === false, "没有恢复验证的备份不应该放行");
  assert(
    verdict.code === "UNVERIFIED_BACKUP_RESTORE",
    "备份未恢复应返回 UNVERIFIED_BACKUP_RESTORE",
  );
});

await run("冒烟测试必须覆盖 390px 移动端关键路径", () => {
  const verdict = reviewReleaseReadiness(
    createRelease({
      plan: { ...plan, owner: "发布人", observer: "观察人" },
      environment: {
        ...environment,
        AI_API_KEY: { status: "present", safeToShow: false },
      },
      backup: { ...backup, restoreTested: true, recoveryTimeMinutes: 8 },
    }),
  );

  assert(verdict.ready === false, "缺少 390px 冒烟不应该放行");
  assert(
    verdict.code === "MISSING_MOBILE_SMOKE",
    "缺移动端冒烟应返回 MISSING_MOBILE_SMOKE",
  );
});

await run("上线后监控必须覆盖 AI 调用失败率", () => {
  const verdict = reviewReleaseReadiness(
    createRelease({
      plan: { ...plan, owner: "发布人", observer: "观察人" },
      environment: {
        ...environment,
        AI_API_KEY: { status: "present", safeToShow: false },
      },
      backup: { ...backup, restoreTested: true, recoveryTimeMinutes: 8 },
      smokeTest: {
        ...smokeTest,
        paths: [
          ...smokeTest.paths,
          {
            viewport: "390px",
            path: "首页 -> 第 14 章 -> 教学关卡",
            result: "passed",
          },
        ],
      },
    }),
  );

  assert(verdict.ready === false, "缺少 AI 失败率监控不应该放行");
  assert(
    verdict.code === "MISSING_MONITORING_SIGNAL",
    "缺监控信号应返回 MISSING_MONITORING_SIGNAL",
  );
  assert(
    backendLog.includes("MISSING_MONITORING_SIGNAL"),
    "后端日志需要保留缺监控信号线索",
  );
});

await run("上线决定必须写出暂缓理由和补证清单", () => {
  const verdict = { ready: false, code: "MISSING_ROLLBACK_PLAN" };
  const decision = buildReleaseDecision(createRelease(), verdict);

  assert(decision.decision === "hold", "缺回滚计划时应暂缓上线");
  assert(
    decision.requestedEvidence.some((item) => item.includes("回滚")),
    "上线决定需要点名补回滚证据",
  );
  assert(
    /环境变量|备份|冒烟|监控|回滚/.test(decision.interviewLine ?? ""),
    "上线决定需要给出可用于面试的表达",
  );
});

const report = {
  schemaVersion: 1,
  scenarioId: "frontend-accessibility-proof",
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
