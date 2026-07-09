import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import {
  buildAgentHandoff,
  validateAgentBrief,
} from "../server/briefValidator.js";

const projectRoot = resolve(import.meta.dirname, "..");
const sourcePath = resolve(projectRoot, "server", "briefValidator.js");
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

const vagueBrief = await readJson(resolve(evidenceRoot, "vague-brief.json"));
const unsafeBrief = await readJson(resolve(evidenceRoot, "unsafe-brief.json"));
const clearBrief = await readJson(resolve(evidenceRoot, "clear-brief.json"));
const networkAgentRequest = await readJson(
  resolve(evidenceRoot, "network-agent-request.json"),
);
const backendLog = await readFile(resolve(evidenceRoot, "backend.log"), "utf8");

await run("空泛任务必须因为缺少背景证据被拒绝", () => {
  const verdict = validateAgentBrief(vagueBrief);

  assert(verdict.ok === false, "空泛委托不应该交给 Agent");
  assert(
    verdict.code === "MISSING_CONTEXT",
    "缺少现象和证据时应返回 MISSING_CONTEXT",
  );
});

await run("目标必须可观察，不能只写更好看或更专业", () => {
  const brief = {
    ...clearBrief,
    goal: "把它做得更专业、更好看、更有感觉。",
  };
  const verdict = validateAgentBrief(brief);

  assert(verdict.ok === false, "不可观察目标不应该通过");
  assert(
    verdict.code === "UNTESTABLE_GOAL",
    "不可观察目标应返回 UNTESTABLE_GOAL",
  );
});

await run("约束必须保护项目边界，不能允许任意读取或任意命令", () => {
  const verdict = validateAgentBrief(unsafeBrief);

  assert(verdict.ok === false, "危险委托不应该通过");
  assert(
    verdict.code === "MISSING_CONSTRAINTS",
    "缺少安全边界时应返回 MISSING_CONSTRAINTS",
  );
});

await run("委托书必须写清验收命令、浏览器路径和可见结果", () => {
  const brief = {
    ...clearBrief,
    acceptance: {
      commands: [],
      browserPath: "",
      expectedResult: "",
    },
  };
  const verdict = validateAgentBrief(brief);

  assert(verdict.ok === false, "缺少验收标准不应该通过");
  assert(
    verdict.code === "MISSING_ACCEPTANCE",
    "缺少验收标准时应返回 MISSING_ACCEPTANCE",
  );
  assert(
    networkAgentRequest.response.code === "MISSING_ACCEPTANCE",
    "Network 证据应展示后端拒绝空泛任务",
  );
});

await run("交付给 Agent 的 handoff 必须包含风险、回滚和交付格式", () => {
  const verdict = validateAgentBrief(clearBrief);
  const handoff = buildAgentHandoff(clearBrief);

  assert(verdict.ok === true, "清晰委托应该通过");
  assert(
    handoff.prompt.includes("风险") && handoff.prompt.includes("回滚"),
    "handoff 需要包含风险和回滚",
  );
  assert(
    Array.isArray(handoff.expectedDelivery) &&
      handoff.expectedDelivery.includes("验证证据"),
    "handoff 需要要求 Agent 按交付格式返回验证证据",
  );
  assert(
    backendLog.includes("brief accepted"),
    "后端日志需要记录清晰委托被接收",
  );
});

const source = await readFile(sourcePath);
const report = {
  schemaVersion: 1,
  scenarioId: "agent-brief-forge",
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
