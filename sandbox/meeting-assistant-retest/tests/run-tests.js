import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { planMeetingAssistant } from "../server/meetingPlanner.js";
import { createSessionStore } from "../server/sessionStore.js";

const projectRoot = resolve(import.meta.dirname, "..");
const sourcePath = resolve(projectRoot, "server", "meetingPlanner.js");
const reportPath = resolve(projectRoot, "test-results.json");
const candidates = JSON.parse(
  await readFile(
    resolve(projectRoot, "evidence", "candidate-set.json"),
    "utf8",
  ),
).candidates;
const brief = {
  sessionId: "meeting_weekly_01",
  user: "每周项目会主持人",
  problem: "会后没人知道谁要做什么",
  stage: "follow-up",
  success: "会后 2 分钟内得到带负责人和截止时间的行动项",
};
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

await run("只保留当前会后阶段的候选并选择行动项摘要", () => {
  const sessionStore = createSessionStore();
  const result = planMeetingAssistant({ brief, candidates, sessionStore });
  assert(
    result.eligible.every((candidate) => candidate.stage === "follow-up"),
    `候选中混入了其他阶段：${result.eligible.map((item) => item.id).join(", ")}`,
  );
  assert(
    result.selected?.id === "action-summary",
    `预期选择 action-summary，实际为 ${result.selected?.id ?? "空"}`,
  );
});

await run("刷新后恢复 Brief、选中方案和取舍理由", () => {
  const sessionStore = createSessionStore();
  const result = planMeetingAssistant({ brief, candidates, sessionStore });
  const restored = sessionStore.load(brief.sessionId);
  assert(restored?.brief?.problem === brief.problem, "刷新后 Brief 丢失");
  assert(
    restored?.selectedCandidateId === result.selected?.id,
    "刷新后选中方案丢失",
  );
  assert(
    restored?.selectionReason === result.selected?.reason,
    "刷新后取舍理由丢失",
  );
});

const source = await readFile(sourcePath);
const report = {
  schemaVersion: 1,
  scenarioId: "meeting-assistant-retest",
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
