import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { createProviderClient } from "../server/providerClient.js";
import { createSummaryBatchHandler } from "../server/summaryRoutes.js";

const sandboxRoot = resolve(import.meta.dirname, "..");
const sourcePath = resolve(sandboxRoot, "server/summaryRoutes.js");

function createLogger() {
  const entries = [];
  return {
    entries,
    error(entry) {
      entries.push(entry);
    },
  };
}

const cases = [
  {
    name: "模型限流时返回可行动的依赖错误",
    async run() {
      const logger = createLogger();
      const handler = createSummaryBatchHandler({
        provider: createProviderClient({ mode: "rate-limited" }),
        logger,
      });
      const result = await handler({
        requestId: "req-night-429",
        body: { conversations: [{ id: "chat-101" }] },
      });

      if (result.status !== 503) {
        throw new Error(`预期自有 API 返回 503，实际 ${result.status}`);
      }
      if (result.body.code !== "MODEL_DEPENDENCY_BUSY") {
        throw new Error(`预期结构化错误码，实际 ${result.body.code}`);
      }
      if (result.body.requestId !== "req-night-429") {
        throw new Error("错误响应没有保留 requestId");
      }
      if (result.body.retryAfterSeconds !== 30) {
        throw new Error("错误响应没有保留重试时间");
      }
    },
  },
  {
    name: "缺少会话时仍由自有 API 返回 400",
    async run() {
      const handler = createSummaryBatchHandler({
        provider: createProviderClient(),
        logger: createLogger(),
      });
      const result = await handler({
        requestId: "req-empty",
        body: { conversations: [] },
      });

      if (
        result.status !== 400 ||
        result.body.code !== "CONVERSATIONS_REQUIRED"
      ) {
        throw new Error("输入校验边界没有返回 400");
      }
    },
  },
  {
    name: "模型健康时批次进入队列",
    async run() {
      const handler = createSummaryBatchHandler({
        provider: createProviderClient(),
        logger: createLogger(),
      });
      const result = await handler({
        requestId: "req-healthy",
        body: { conversations: [{ id: "chat-101" }, { id: "chat-102" }] },
      });

      if (result.status !== 202 || result.body.accepted !== 2) {
        throw new Error("健康模型没有接受合法批次");
      }
    },
  },
];

const results = [];
for (const testCase of cases) {
  try {
    await testCase.run();
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
const report = {
  schemaVersion: 1,
  scenarioId: "model-rate-limit-retest",
  command: "npm test --prefix sandbox/model-rate-limit-retest",
  sourceFile: "server/summaryRoutes.js",
  sourceHash,
  generatedAt: new Date().toISOString(),
  tests: results,
};

writeFileSync(
  resolve(sandboxRoot, "test-results.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);

const passed = results.filter((result) => result.status === "passed").length;
const failed = results.length - passed;
console.log(`\n${passed} passed, ${failed} failed`);
console.log("已生成 test-results.json，学习应用可以读取这份报告。");

process.exitCode = failed > 0 ? 1 : 0;
