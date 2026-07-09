import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { buildProductPlan } from "../server/briefPlanner.js";

const projectRoot = resolve(import.meta.dirname, "..");
const sourcePath = resolve(projectRoot, "server", "briefPlanner.js");
const reportPath = resolve(projectRoot, "test-results.json");

const baseBrief = {
  projectName: "CanvasStorm",
  userGoal: "帮助独立开发者把模糊 AI 点子拆成可执行产品路线",
  stage: "prototype",
  constraints: ["先做单人使用", "不做复杂协作"],
};

const candidates = [
  {
    id: "mvp-brief-board",
    direction: "mvp",
    title: "先做 Project Brief 看板",
    reason: "能立刻让用户把目标、输入、输出写清楚",
  },
  {
    id: "growth-share-loop",
    direction: "growth",
    title: "上线分享增长闭环",
    reason: "适合产品稳定后再扩散",
  },
  {
    id: "mvp-session-save",
    direction: "mvp",
    title: "保存本轮筛选会话",
    reason: "让用户下次能复盘为什么选择这个方向",
  },
];

const results = [];

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

await run("只把所选方向的候选放进执行草案", async () => {
  const plan = buildProductPlan({
    brief: baseBrief,
    direction: "mvp",
    candidates,
    session: { id: "session_01" },
  });

  assert(plan.status === "ok", "预期生成成功计划");
  assert(
    plan.acceptedCandidates.every((candidate) => candidate.direction === "mvp"),
    "执行草案包含了非 MVP 方向候选",
  );
  assert(
    !plan.executionDraft.includes("上线分享增长闭环"),
    "增长方案不应该进入 MVP 执行草案",
  );
});

await run("保存会话时记录 Brief、方向、取舍理由和下一步", async () => {
  const plan = buildProductPlan({
    brief: baseBrief,
    direction: "mvp",
    candidates,
    session: { id: "session_01" },
  });

  assert(
    plan.savedSession.lastBrief.userGoal === baseBrief.userGoal,
    "缺少 Brief",
  );
  assert(plan.savedSession.lastDirection === "mvp", "缺少本轮方向");
  assert(
    Array.isArray(plan.savedSession.acceptedCandidateIds),
    "缺少已接收候选 id",
  );
  assert(
    Array.isArray(plan.savedSession.rejectedCandidateIds),
    "缺少被放弃候选 id",
  );
  assert(typeof plan.savedSession.nextAction === "string", "缺少下一步动作");
});

await run("用户目标为空时给出可操作错误，而不是生成空泛方案", async () => {
  const plan = buildProductPlan({
    brief: { ...baseBrief, userGoal: "" },
    direction: "mvp",
    candidates,
    session: { id: "session_01" },
  });

  assert(plan.status === "error", "用户目标为空时不应生成计划");
  assert(
    /用户目标|userGoal/.test(plan.message),
    "错误提示要指出需要补充用户目标",
  );
});

const source = await readFile(sourcePath);
const report = {
  schemaVersion: 1,
  scenarioId: "canvasstorm-product-brief",
  generatedAt: new Date().toISOString(),
  sourceHash: createHash("sha256").update(source).digest("hex"),
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
