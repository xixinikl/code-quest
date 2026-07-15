import { mkdir, writeFile } from "node:fs/promises";
import { getRegistry, invokeTool } from "../server/toolGateway.js";

const results = [];
function check(name, fn) {
  try {
    fn();
    results.push({ name, status: "passed" });
  } catch (error) {
    results.push({ name, status: "failed", message: error.message });
  }
}

check("注册表声明工具输入和权限", () => {
  const tool = getRegistry().readOrder;
  if (tool.input.orderId !== "string" || tool.permission !== "orders:read") {
    throw new Error("工具契约没有同时声明输入和权限");
  }
});

check("权限门按资源归属拒绝调用", () => {
  const implementation = invokeTool.toString();
  if (!/resourceOwner|ownerId|canAccessResource/.test(implementation)) {
    throw new Error("当前只有路径前缀拦截，没有通用资源归属检查");
  }
});

check("拒绝结果保留 requestId 且不泄露路径", () => {
  const response = invokeTool(
    "readOrder",
    { orderId: "ord-2048", path: "/internal/secrets" },
    { requestId: "req-tool-2048" },
  );
  if (response.ok || response.error !== "TOOL_DENIED") {
    throw new Error("越权路径没有被安全拒绝");
  }
  if (response.requestId !== "req-tool-2048") {
    throw new Error("拒绝响应缺少 requestId");
  }
});

const passed = results.filter((result) => result.status === "passed").length;
const failed = results.length - passed;
await mkdir(new URL("../", import.meta.url), { recursive: true });
await writeFile(
  new URL("../test-results.json", import.meta.url),
  JSON.stringify({ passed, failed, results }, null, 2) + "\n",
);
console.log(`${passed} passed, ${failed} failed`);
for (const result of results) {
  console.log(`${result.status === "passed" ? "PASS" : "FAIL"} ${result.name}`);
}
process.exitCode = failed > 0 ? 1 : 0;
