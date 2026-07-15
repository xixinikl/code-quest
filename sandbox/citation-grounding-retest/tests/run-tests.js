import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { answer, validateCitation } from "../server/answerGrounding.js";

const sandboxRoot = resolve(import.meta.dirname, "..");
const sourcePath = resolve(sandboxRoot, "server/answerGrounding.js");
const frontendPath = resolve(sandboxRoot, "frontend/AnswerPanel.jsx");
const source = readFileSync(sourcePath, "utf8");
const frontend = readFileSync(frontendPath, "utf8");

const cases = [
  {
    name: "回答面板不把资料库内部路径暴露给用户",
    run() {
      if (/\/Users\/|node_modules|process\.env/.test(frontend)) {
        throw new Error("前端暴露了内部资料或运行环境信息");
      }
    },
  },
  {
    name: "引用校验能识别不存在的条款编号",
    run() {
      const result = answer("我能退款吗？", ["refund-policy-2026#3.2"]);
      if (result.citations.some(validateCitation)) {
        throw new Error("不存在的引用被当成了有效资料");
      }
    },
  },
  {
    name: "没有命中资料时必须拒答而不是补全事实",
    run() {
      if (!/资料不足|无法确认|拒答|不要编造/.test(source)) {
        throw new Error("Prompt/回答边界没有要求资料不足时拒答");
      }
    },
  },
];

const results = [];
for (const testCase of cases) {
  try {
    testCase.run();
    results.push({ name: testCase.name, status: "passed" });
    console.log(`✓ ${testCase.name}`);
  } catch (error) {
    results.push({
      name: testCase.name,
      status: "failed",
      message: error instanceof Error ? error.message : String(error),
    });
    console.log(`✗ ${testCase.name}`);
    console.log(`  ${results.at(-1).message}`);
  }
}

const sourceHash = createHash("sha256")
  .update(readFileSync(sourcePath))
  .digest("hex");
writeFileSync(
  resolve(sandboxRoot, "test-results.json"),
  `${JSON.stringify(
    {
      schemaVersion: 1,
      scenarioId: "citation-grounding-retest",
      command: "npm test --prefix sandbox/citation-grounding-retest",
      sourceFile: "server/answerGrounding.js",
      sourceHash,
      generatedAt: new Date().toISOString(),
      tests: results,
    },
    null,
    2,
  )}\n`,
);

const passed = results.filter((result) => result.status === "passed").length;
const failed = results.length - passed;
console.log(`\n${passed} passed, ${failed} failed`);
console.log("已生成 test-results.json，学习应用可以读取这份报告。");
process.exitCode = failed > 0 ? 1 : 0;
