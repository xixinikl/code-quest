import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const sourcePath = resolve(root, "frontend", "ProfilePanel.jsx");
const reportPath = resolve(root, "test-results.json");
const source = await readFile(sourcePath, "utf8");
const tests = [];

function check(name, condition, message) {
  tests.push({
    name,
    status: condition ? "passed" : "failed",
    ...(condition ? {} : { message }),
  });
}

check(
  "点击后先进入 loading",
  source.includes('setStatus("loading")'),
  "点击事件没有先把界面置为 loading",
);
check(
  "成功状态依赖 response.ok",
  source.includes("response.ok") && source.includes('setStatus("success")'),
  "没有看到根据 response.ok 决定 success 的证据",
);
check(
  "失败状态可被用户看见",
  source.includes('setStatus("error")') && source.includes("aria-live"),
  "失败分支没有 error 状态或可读提示",
);
check(
  "状态来源只有一个",
  (source.match(/useState\("(idle|loading|success|error)"\)/g) ?? []).length ===
    1,
  "页面存在多个互相竞争的请求状态来源",
);

const report = {
  schemaVersion: 1,
  scenarioId: "frontend-component-state",
  generatedAt: new Date().toISOString(),
  sourceHash: createHash("sha256").update(source).digest("hex"),
  summary: {
    passed: tests.filter((test) => test.status === "passed").length,
    failed: tests.filter((test) => test.status === "failed").length,
  },
  tests,
};
await writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");

for (const test of tests) {
  console.log(`${test.status === "passed" ? "✓" : "✗"} ${test.name}`);
  if (test.message) console.log(`  ${test.message}`);
}
console.log(
  `\n${report.summary.passed} passed, ${report.summary.failed} failed`,
);
if (report.summary.failed > 0) process.exitCode = 1;
