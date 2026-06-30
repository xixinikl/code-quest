import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { DatabaseSync } from "node:sqlite";
import { createCanvasRoutes } from "../server/canvasRoutes.js";
import { createCanvasRepository } from "../server/canvasRepository.js";

const projectRoot = resolve(import.meta.dirname, "..");
const sourcePath = resolve(projectRoot, "server", "canvasRepository.js");
const schemaPath = resolve(projectRoot, "database", "schema.sql");
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

const db = new DatabaseSync(":memory:");
db.exec(await readFile(schemaPath, "utf8"));
const repository = createCanvasRepository(db);
const routes = createCanvasRoutes(repository);

await run("POST 成功后重新查询仍能读到画布", async () => {
  const response = await routes.create({
    user: { id: "user_01" },
    body: { title: "首页构思", content: '{"objects":[]}' },
  });
  assert(response.status === 201, `预期 201，实际 ${response.status}`);

  const canvasesAfterRefresh = repository.listCanvases("user_01");
  assert(
    canvasesAfterRefresh.length === 1,
    `预期数据库中有 1 条记录，实际 ${canvasesAfterRefresh.length} 条`,
  );
  assert(
    canvasesAfterRefresh[0].title === "首页构思",
    "持久化后的标题与请求不一致",
  );
});

await run("未登录用户不能创建画布", async () => {
  const response = await routes.create({
    user: null,
    body: { title: "不应保存", content: "{}" },
  });
  assert(response.status === 401, `预期 401，实际 ${response.status}`);
  assert(
    repository.listCanvases("anonymous").length === 0,
    "未授权请求产生了数据库副作用",
  );
});

const source = await readFile(sourcePath);
const report = {
  schemaVersion: 1,
  scenarioId: "canvas-save-persistence",
  generatedAt: new Date().toISOString(),
  sourceHash: createHash("sha256").update(source).digest("hex"),
  summary: {
    passed: results.filter((result) => result.status === "passed").length,
    failed: results.filter((result) => result.status === "failed").length,
  },
  tests: results,
};

await writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");
db.close();

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
