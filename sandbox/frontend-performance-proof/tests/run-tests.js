import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import {
  createMemoryCache,
  createProjectDatabase,
  getProjectDashboard,
} from "../server/projectPerformance.js";

const projectRoot = resolve(import.meta.dirname, "..");
const sourcePath = resolve(projectRoot, "server", "projectPerformance.js");
const reportPath = resolve(projectRoot, "test-results.json");
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

await run("接口响应必须带 Server-Timing，能区分后端等待和下载耗时", () => {
  const response = getProjectDashboard({
    database: createProjectDatabase(),
    cache: createMemoryCache(),
    requestId: "req_perf_001",
  });

  assert(response.status === 200, "项目列表接口应该成功返回");
  assert(
    typeof response.headers["Server-Timing"] === "string",
    "缺少 Server-Timing，用户无法判断 TTFB 高是不是后端慢",
  );
  assert(
    /db|cache|total/.test(response.headers["Server-Timing"]),
    "Server-Timing 需要包含 db/cache/total 这类可解释分段",
  );
});

await run("第二次访问应该命中缓存，不能再次完整查询数据库", () => {
  const database = createProjectDatabase();
  const cache = createMemoryCache();

  const first = getProjectDashboard({
    database,
    cache,
    requestId: "req_perf_002",
  });
  const second = getProjectDashboard({
    database,
    cache,
    requestId: "req_perf_003",
  });

  assert(first.headers["X-Cache"] === "MISS", "第一次访问应该标记缓存未命中");
  assert(second.headers["X-Cache"] === "HIT", "第二次访问应该命中缓存");
  assert(database.queryCount === 1, "重复访问又查了一次数据库");
});

await run("前端不应该一次性渲染 2500 条项目记录", () => {
  const response = getProjectDashboard({
    database: createProjectDatabase(),
    cache: createMemoryCache(),
    requestId: "req_perf_004",
  });

  assert(
    response.body.renderPlan.virtualized === true,
    "列表需要分页或虚拟滚动，而不是 full-list 全量渲染",
  );
  assert(
    response.body.projects.length <= 80,
    "首屏返回项目太多，用户会把接口慢和渲染卡顿混在一起",
  );
});

const source = await readFile(sourcePath);
const report = {
  schemaVersion: 1,
  scenarioId: "frontend-performance-proof",
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
