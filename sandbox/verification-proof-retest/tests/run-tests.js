import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { validateVerificationReport } from "../server/reportVerifier.js";

const root = resolve(import.meta.dirname, "..");
const evidence = resolve(root, "evidence");
const results = [];
const readJson = async (name) =>
  JSON.parse(await readFile(resolve(evidence, name), "utf8"));
const assert = (condition, message) => {
  if (!condition) throw new Error(message);
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

const before = await readJson("failing-before.json");
const stale = await readJson("passing-stale.json");
const network = await readJson("network-test-run.json");
const manual = await readFile(resolve(evidence, "manual-report.md"), "utf8");
const log = await readFile(resolve(evidence, "backend.log"), "utf8");
const source = await readFile(resolve(root, "server/reportVerifier.js"));
const currentHash = createHash("sha256").update(source).digest("hex");

await run("验收材料必须保留旧问题失败复现", () => {
  assert(before.phase === "before-fix", "没有旧问题阶段标记");
  assert(before.summary.failed > 0, "失败复现报告没有失败用例");
});

await run("全绿报告必须绑定当前源码指纹", () => {
  const verdict = validateVerificationReport(stale, currentHash);
  assert(verdict.ok === false, "旧源码全绿报告不应该直接通过");
  assert(verdict.code === "STALE_REPORT", "应返回 STALE_REPORT");
});

await run("Network、手动报告和日志要分别说明证据边界", () => {
  assert(
    network.steps.some((step) => step.status === 201),
    "缺少保存成功请求",
  );
  assert(manual.includes("回归风险"), "手动报告没有回归风险");
  assert(log.includes("runtime_hash_mismatch"), "日志没有暴露版本不一致");
});

await mkdir(root, { recursive: true });
const passed = results.filter((result) => result.status === "passed").length;
const failed = results.length - passed;
await writeFile(
  resolve(root, "test-results.json"),
  `${JSON.stringify(
    {
      schemaVersion: 1,
      scenarioId: "verification-proof-retest",
      sourceHash: currentHash,
      summary: { passed, failed },
      tests: results,
    },
    null,
    2,
  )}\n`,
);
for (const result of results) {
  console.log(`${result.status === "passed" ? "PASS" : "FAIL"} ${result.name}`);
}
console.log(`${passed} passed, ${failed} failed`);
process.exitCode = failed > 0 ? 1 : 0;
