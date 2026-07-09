import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { createFakeProvider, handleAiChat } from "../server/aiGateway.js";

const projectRoot = resolve(import.meta.dirname, "..");
const sourcePath = resolve(projectRoot, "server", "aiGateway.js");
const frontendPath = resolve(projectRoot, "frontend", "AiChatPanel.jsx");
const reportPath = resolve(projectRoot, "test-results.json");
const results = [];

const baseRequest = {
  method: "POST",
  path: "/api/ai/chat",
  requestId: "req_ai_001",
  body: {
    prompt: "帮我总结这个 Project Brief",
  },
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

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function stringify(value) {
  return JSON.stringify(value);
}

await run("前端代码和浏览器请求不能出现 AI API Key", async () => {
  const frontend = await readFile(frontendPath, "utf8");
  assert(!/sk-[a-z0-9-]+/i.test(frontend), "前端源码出现 sk- 风格密钥");
  assert(
    !/Authorization/i.test(frontend),
    "前端不应该直接设置第三方 AI Authorization",
  );
  assert(!/apiKey/i.test(frontend), "前端不应该把 apiKey 放进请求体");
});

await run("后端缺少 AI_API_KEY 时必须返回结构化 503", () => {
  const response = handleAiChat({
    request: baseRequest,
    env: {},
    provider: createFakeProvider(),
  });

  assert(response.status === 503, "未配置密钥时应该返回 503");
  assert(response.body.error === "AI_NOT_CONFIGURED", "错误 code 不清楚");
  assert(
    !/sk-/.test(stringify(response)),
    "未配置密钥时不应要求用户在前端填写或暴露 key",
  );
});

await run("后端只能使用环境变量密钥，不能信任前端传来的 apiKey", () => {
  const provider = createFakeProvider();
  const response = handleAiChat({
    request: {
      ...baseRequest,
      requestId: "req_ai_002",
      body: {
        ...baseRequest.body,
        apiKey: "sk-user-sent-from-browser",
      },
    },
    env: { AI_API_KEY: "sk-server-only-key" },
    provider,
  });

  assert(response.status === 200, "配置了服务端密钥时应该可调用");
  assert(
    provider.calls[0]?.apiKey === "sk-server-only-key",
    "没有使用服务端环境变量密钥",
  );
  assert(
    provider.calls[0]?.apiKey !== "sk-user-sent-from-browser",
    "后端信任了浏览器传来的 apiKey",
  );
});

await run("成功路径应该返回流式片段，而不是一次性完整文本", () => {
  const provider = createFakeProvider();
  const response = handleAiChat({
    request: { ...baseRequest, requestId: "req_ai_003" },
    env: { AI_API_KEY: "sk-server-only-key" },
    provider,
  });

  assert(
    /text\/event-stream|application\/x-ndjson/.test(
      response.headers["Content-Type"] || "",
    ),
    "成功响应需要是可流式消费的内容类型",
  );
  assert(provider.calls[0]?.stream === true, "调用上游时没有开启 stream");
  assert(Array.isArray(response.body.chunks), "响应没有提供可验证的流式片段");
});

await run("上游失败时不能泄露密钥，必须给用户和日志各自可读的信息", () => {
  const response = handleAiChat({
    request: { ...baseRequest, requestId: "req_ai_004" },
    env: { AI_API_KEY: "sk-server-only-key" },
    provider: createFakeProvider({ mode: "failure" }),
  });
  const bodyText = stringify(response.body);
  const logText = response.log || "";

  assert(response.status === 502, "上游失败应该返回 502");
  assert(response.body.error === "AI_PROVIDER_FAILED", "缺少结构化错误 code");
  assert(!bodyText.includes("sk-server-only-key"), "错误响应泄露了服务端密钥");
  assert(!logText.includes("sk-server-only-key"), "后端日志泄露了服务端密钥");
  assert(/req_ai_004/.test(logText), "日志需要保留 requestId 方便定位");
});

const source = await readFile(sourcePath);
const report = {
  schemaVersion: 1,
  scenarioId: "ai-api-key-vault",
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
