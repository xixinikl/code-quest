import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { createAssistantGateway } from "../server/modelGateway.js";

const sandboxRoot = resolve(import.meta.dirname, "..");
const sourcePath = resolve(sandboxRoot, "server/modelGateway.js");
const frontendPath = resolve(sandboxRoot, "frontend/AssistantPanel.jsx");
const source = readFileSync(sourcePath, "utf8");
const frontend = readFileSync(frontendPath, "utf8");

const cases = [
  {
    name: "浏览器请求不能携带 API Key",
    run() {
      if (/apiKey|Authorization.*Bearer|sk-/.test(frontend)) {
        throw new Error("前端源码或请求中出现供应商密钥");
      }
    },
  },
  {
    name: "供应商 401 应转换成不泄露内部配置的 503",
    run() {
      const result = createAssistantGateway().ask("今天的客服重点是什么？");
      if (
        result.status !== 503 ||
        result.body.error !== "MODEL_TEMPORARILY_UNAVAILABLE"
      ) {
        throw new Error("上游认证失败没有转换成可行动的安全错误");
      }
      if (JSON.stringify(result.body).includes("sk-")) {
        throw new Error("错误响应泄露了 API Key");
      }
    },
  },
  {
    name: "网关必须从服务端环境变量读取轮换后的 Key",
    run() {
      if (!/process\.env\.AI_API_KEY/.test(source)) {
        throw new Error("代码仍然写死旧 Key，轮换后无法更新");
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
      scenarioId: "model-key-rotation-retest",
      command: "npm test --prefix sandbox/model-key-rotation-retest",
      sourceFile: "server/modelGateway.js",
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
