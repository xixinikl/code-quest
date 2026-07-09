import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { executeToolCall, toolRegistry } from "../server/agentTools.js";

const projectRoot = resolve(import.meta.dirname, "..");
const sourcePath = resolve(projectRoot, "server", "agentTools.js");
const reportPath = resolve(projectRoot, "test-results.json");
const results = [];

function createContext({ permissions = ["docs:read"] } = {}) {
  return {
    requestId: "req_tool_001",
    user: {
      id: "user_apprentice",
      permissions,
    },
    docs: [
      {
        id: "doc_agent",
        text: "Agent 工具必须先注册、校验参数、检查权限，再执行。",
      },
    ],
    auditLog: [],
  };
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

await run("工具注册表必须写清描述、schema、权限和只读/写入边界", () => {
  const searchTool = toolRegistry.searchProjectDocs;
  const updateTool = toolRegistry.updateProjectStatus;

  assert(
    searchTool.description.includes("只读"),
    "搜索工具描述没有说明只读边界",
  );
  assert(searchTool.permission === "docs:read", "搜索工具权限不明确");
  assert(
    searchTool.schema.query === "string",
    "搜索工具缺少 query 参数 schema",
  );
  assert(updateTool.permission === "project:write", "写入工具权限不明确");
  assert(
    Array.isArray(updateTool.schema.status) &&
      updateTool.schema.status.includes("released"),
    "写入工具 status 枚举不完整",
  );
});

await run("缺失参数或非法枚举值必须被 VALIDATION_FAILED 拦截", () => {
  const missingArg = executeToolCall({
    toolName: "searchProjectDocs",
    args: {},
    context: createContext(),
  });
  const invalidEnum = executeToolCall({
    toolName: "updateProjectStatus",
    args: { projectId: "project_1", status: "shipped" },
    context: createContext({ permissions: ["project:write"] }),
  });

  assert(missingArg.ok === false, "缺失 query 不应该执行工具");
  assert(
    missingArg.code === "VALIDATION_FAILED",
    "缺失参数应返回 VALIDATION_FAILED",
  );
  assert(invalidEnum.ok === false, "非法 status 不应该执行写入工具");
  assert(
    invalidEnum.code === "VALIDATION_FAILED",
    "非法枚举应返回 VALIDATION_FAILED",
  );
});

await run("没有权限时不能执行写入工具，必须返回 PERMISSION_DENIED", () => {
  const context = createContext({ permissions: ["docs:read"] });
  const result = executeToolCall({
    toolName: "updateProjectStatus",
    args: { projectId: "project_1", status: "released" },
    context,
  });

  assert(result.ok === false, "越权写入不应该成功");
  assert(result.code === "PERMISSION_DENIED", "越权应该返回 PERMISSION_DENIED");
  assert(context.auditLog.length === 0, "越权调用不应产生写入审计事件");
});

await run("工具内部失败时必须结构化回退，不泄露内部错误", () => {
  const result = executeToolCall({
    toolName: "updateProjectStatus",
    args: { projectId: "project_fail", status: "review" },
    context: createContext({ permissions: ["project:write"] }),
  });

  assert(result.ok === false, "工具失败不应该伪装成功");
  assert(result.code === "TOOL_FAILED", "失败应返回 TOOL_FAILED");
  assert(
    result.requestId === "req_tool_001",
    "失败结果需要 requestId 方便排查",
  );
  assert(
    !/database connection refused/i.test(JSON.stringify(result)),
    "不应向前端泄露内部错误",
  );
});

await run("合法只读工具调用必须返回结果并写入审计日志", () => {
  const context = createContext();
  const result = executeToolCall({
    toolName: "searchProjectDocs",
    args: { query: "Agent 工具" },
    context,
  });

  assert(result.ok === true, "合法只读工具应该成功");
  assert(result.data.matches.length === 1, "搜索结果不符合预期");
  assert(
    context.auditLog.some((entry) => entry.event === "tool.called"),
    "工具调用需要审计日志",
  );
});

const source = await readFile(sourcePath);
const report = {
  schemaVersion: 1,
  scenarioId: "agent-tool-tower",
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
