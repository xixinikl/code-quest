import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  createBriefingModel,
  createMemoryCache,
  getMorningBriefing,
} from "../server/briefingPerformance.js";

const sandboxRoot = resolve(import.meta.dirname, "..");
const sourcePath = resolve(sandboxRoot, "server/briefingPerformance.js");

function request(overrides = {}) {
  return {
    teamId: "east",
    date: "2026-07-14",
    requestId: "req-dawn-101",
    ...overrides,
  };
}

const cases = [
  {
    name: "Server-Timing 能证明模型首字是最长等待",
    run() {
      const response = getMorningBriefing({
        cache: createMemoryCache(),
        model: createBriefingModel(),
        ...request(),
      });
      const timing = response.headers["Server-Timing"];
      if (!/data;dur=82/.test(timing) || !/model;dur=3210/.test(timing)) {
        throw new Error("缺少数据查询或模型首字分段");
      }
    },
  },
  {
    name: "相同团队和日期第二次打开应命中缓存",
    run() {
      const cache = createMemoryCache();
      const model = createBriefingModel();
      const first = getMorningBriefing({ cache, model, ...request() });
      const second = getMorningBriefing({
        cache,
        model,
        ...request({ requestId: "req-dawn-102" }),
      });

      if (first.headers["X-Cache"] !== "MISS") {
        throw new Error("第一次访问应为 MISS");
      }
      if (second.headers["X-Cache"] !== "HIT") {
        throw new Error("业务条件相同，第二次访问却没有命中缓存");
      }
      if (model.calls !== 1) {
        throw new Error(`预期模型调用 1 次，实际 ${model.calls} 次`);
      }
    },
  },
  {
    name: "前端渲染计划保持在可控范围",
    run() {
      const response = getMorningBriefing({
        cache: createMemoryCache(),
        model: createBriefingModel(),
        ...request(),
      });
      if (
        response.body.renderPlan.itemCount > 30 ||
        response.body.renderPlan.virtualized !== true
      ) {
        throw new Error("前端渲染量会干扰性能归因");
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
      scenarioId: "ai-briefing-latency-retest",
      command: "npm test --prefix sandbox/ai-briefing-latency-retest",
      sourceFile: "server/briefingPerformance.js",
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
