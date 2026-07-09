import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { handleBriefRequest } from "../server/briefRoutes.js";

const projectRoot = resolve(import.meta.dirname, "..");
const sourcePath = resolve(projectRoot, "server", "briefRoutes.js");
const reportPath = resolve(projectRoot, "test-results.json");

const invalidRequest = {
  method: "POST",
  path: "/api/briefs",
  requestId: "req_brief_042",
  body: {
    projectName: "CanvasStorm",
    userGoal: "",
    audience: "独立开发者",
  },
};

const validRequest = {
  ...invalidRequest,
  requestId: "req_brief_043",
  body: {
    ...invalidRequest.body,
    userGoal: "把模糊 AI 点子拆成可执行产品路线",
  },
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

await run("缺少 userGoal 时返回 400 和字段级错误", async () => {
  const response = handleBriefRequest(invalidRequest);

  assert(response.status === 400, "请求体缺字段不应该返回 500");
  assert(response.body.error === "VALIDATION_ERROR", "缺少结构化校验错误码");
  assert(
    response.body.fields?.userGoal === "用户目标不能为空",
    "错误响应没有指出 userGoal 字段问题",
  );
});

await run("错误响应和日志必须带同一个 requestId", async () => {
  const response = handleBriefRequest(invalidRequest);

  assert(
    response.body.requestId === invalidRequest.requestId,
    "响应缺少 requestId",
  );
  assert(typeof response.log === "string", "缺少后端日志");
  assert(
    response.log.includes(invalidRequest.requestId),
    "日志没有同一个 requestId",
  );
  assert(response.log.includes("validation"), "日志没有标明这是参数校验问题");
});

await run("正确请求仍能创建 Brief，不被错误处理破坏", async () => {
  const response = handleBriefRequest(validRequest);

  assert(response.status === 201, "正确请求应该创建成功");
  assert(
    response.body.brief.userGoal === validRequest.body.userGoal,
    "Brief 内容丢失",
  );
  assert(
    response.body.requestId === validRequest.requestId,
    "成功响应也需要 requestId",
  );
});

const source = await readFile(sourcePath);
const report = {
  schemaVersion: 1,
  scenarioId: "api-error-court",
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
