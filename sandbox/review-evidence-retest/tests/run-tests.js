import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { reviewDelivery } from "../server/reviewGate.js";

const root = resolve(import.meta.dirname, "..");
const evidence = resolve(root, "evidence");
const results = [];
const readJson = async (name) =>
  JSON.parse(await readFile(resolve(evidence, name), "utf8"));
const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};
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

const diff = await readJson("diff-summary.json");
const tests = await readJson("test-evidence.json");
const browser = await readJson("browser-checks.json");
const docs = await readJson("docs-sync.json");
const decision = await readFile(
  resolve(evidence, "review-decision.md"),
  "utf8",
);

await run("审查必须先对照交付说明和实际 Diff", () => {
  assert(
    diff.files.some((file) => file.path === "src/ImportPanel.jsx"),
    "没有读取实际 Diff",
  );
  assert(
    diff.files.some((file) => file.path === "README.md"),
    "没有发现文档变化缺口",
  );
  assert(decision.includes("拒收"), "没有保留拒收决定");
});

await run("测试证据必须属于当前源码版本", () => {
  const verdict = reviewDelivery({ diff, tests, browserChecks: browser });
  assert(verdict.accepted === false, "过期测试报告不应该直接合并");
  assert(verdict.code === "STALE_TEST_EVIDENCE", "应返回 STALE_TEST_EVIDENCE");
});

await run("审查必须看移动端和文档同步", () => {
  assert(browser.desktop === true, "缺少桌面验收");
  assert(browser.mobile390 === false, "应识别缺少 390px 验收");
  assert(docs.updated === false, "应识别 README 没有同步");
});

const passed = results.filter((result) => result.status === "passed").length;
const failed = results.length - passed;
await writeFile(
  resolve(root, "test-results.json"),
  `${JSON.stringify({ schemaVersion: 1, scenarioId: "review-evidence-retest", summary: { passed, failed }, tests: results }, null, 2)}\n`,
);
for (const result of results)
  console.log(`${result.status === "passed" ? "PASS" : "FAIL"} ${result.name}`);
console.log(`${passed} passed, ${failed} failed`);
process.exitCode = failed > 0 ? 1 : 0;
