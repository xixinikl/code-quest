import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import {
  buildReviewDecision,
  reviewDelivery,
} from "../server/deliveryReview.js";

const projectRoot = resolve(import.meta.dirname, "..");
const sourcePath = resolve(projectRoot, "server", "deliveryReview.js");
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
const deliveryNote = await readFile(
  resolve(evidenceRoot, "agent-delivery.md"),
  "utf8",
);
const diffSummary = await readJson(resolve(evidenceRoot, "diff-summary.json"));
const testEvidence = await readJson(
  resolve(evidenceRoot, "test-evidence.json"),
);
const browserChecks = await readJson(
  resolve(evidenceRoot, "browser-checks.json"),
);
const docsSync = await readJson(resolve(evidenceRoot, "docs-sync.json"));
const backendLog = await readFile(resolve(evidenceRoot, "backend.log"), "utf8");

function createDelivery(overrides = {}) {
  return {
    title: "第 13 章交付审查沙盒",
    summary: "Agent 声称已完成交付审查功能。",
    sections: ["摘要", "验证证据", "风险"],
    allowedPaths: diffSummary.allowedPaths,
    diff: diffSummary,
    tests: testEvidence,
    browserChecks,
    docsUpdated: docsSync.updated,
    deliveryNote,
    ...overrides,
  };
}

await run("交付说明必须包含摘要、验证证据、风险和后续", () => {
  const verdict = reviewDelivery(createDelivery());

  assert(verdict.accepted === false, "缺少后续章节的交付不应该接收");
  assert(
    verdict.code === "MISSING_DELIVERY_SECTION",
    "缺少交付章节时应返回 MISSING_DELIVERY_SECTION",
  );
});

await run("Diff 不能包含任务范围外文件，除非交付说明解释原因", () => {
  const verdict = reviewDelivery(
    createDelivery({
      sections: ["摘要", "验证证据", "风险", "后续"],
    }),
    currentSourceHash,
  );

  assert(verdict.accepted === false, "越界 Diff 不应该接收");
  assert(verdict.code === "OUT_OF_SCOPE_DIFF", "越界应返回 OUT_OF_SCOPE_DIFF");
  assert(
    backendLog.includes("OUT_OF_SCOPE_DIFF"),
    "后端日志需要保留越界文件线索",
  );
});

await run("测试证据必须对应当前源码 hash，旧报告不能接收", () => {
  const safeDiff = {
    ...diffSummary,
    files: diffSummary.files.filter((file) => file.path !== "src/game.ts"),
  };
  const verdict = reviewDelivery(
    createDelivery({
      sections: ["摘要", "验证证据", "风险", "后续"],
      diff: safeDiff,
    }),
    currentSourceHash,
  );

  assert(verdict.accepted === false, "过期测试报告不应该接收");
  assert(
    verdict.code === "STALE_TEST_EVIDENCE",
    "过期测试应返回 STALE_TEST_EVIDENCE",
  );
});

await run("浏览器验收必须覆盖 390px 移动端", () => {
  const safeDiff = {
    ...diffSummary,
    files: diffSummary.files.filter((file) => file.path !== "src/game.ts"),
  };
  const verdict = reviewDelivery(
    createDelivery({
      sections: ["摘要", "验证证据", "风险", "后续"],
      diff: safeDiff,
      tests: { ...testEvidence, sourceHash: currentSourceHash },
    }),
    currentSourceHash,
  );

  assert(verdict.accepted === false, "缺移动端验收不应该接收");
  assert(
    verdict.code === "MISSING_MOBILE_CHECK",
    "缺移动端验收应返回 MISSING_MOBILE_CHECK",
  );
});

await run("审查决定必须写出拒收理由和需要补的证据", () => {
  const verdict = { accepted: false, code: "MISSING_DOC_SYNC" };
  const decision = buildReviewDecision(createDelivery(), verdict);

  assert(decision.decision === "request_changes", "缺证据时应要求修改");
  assert(
    decision.requestedEvidence.some((item) => item.includes("README")),
    "审查决定需要点名缺失文档同步",
  );
  assert(
    /Diff|测试证据|移动端|拒收/.test(decision.interviewLine ?? ""),
    "审查决定需要给出可用于面试的表达",
  );
});

const report = {
  schemaVersion: 1,
  scenarioId: "delivery-review-court",
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
