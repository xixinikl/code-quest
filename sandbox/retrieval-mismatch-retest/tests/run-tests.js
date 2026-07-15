import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { answer, getChunks, retrieve } from "../server/retriever.js";

const sandboxRoot = resolve(import.meta.dirname, "..");
const sourcePath = resolve(sandboxRoot, "server/retriever.js");

const cases = [
  {
    name: "Chunk 保留来源、版本和生效状态",
    run() {
      const source = getChunks();
      if (
        !source.every(
          (chunk) => chunk.source && chunk.version && "active" in chunk,
        )
      ) {
        throw new Error("Chunk 丢失来源或版本元数据，后续无法解释引用");
      }
    },
  },
  {
    name: "当前生效版本应该优先于旧版本",
    run() {
      const matches = retrieve("最新退款规则");
      if (matches[0].active !== true || matches[0].version !== "2026-07") {
        throw new Error("检索只按相似度排序，返回了旧版本政策");
      }
    },
  },
  {
    name: "回答引用必须指向实际命中的 Chunk",
    run() {
      const result = answer("退款期限是多少？");
      const matches = retrieve("退款期限是多少？");
      if (
        !result.citations.every((id) =>
          matches.some((match) => match.id === id),
        )
      ) {
        throw new Error("回答引用没有对应实际命中结果");
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
      scenarioId: "retrieval-mismatch-retest",
      command: "npm test --prefix sandbox/retrieval-mismatch-retest",
      sourceFile: "server/retriever.js",
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
