import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { reviewRelease } from "../server/releaseGate.js";

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

const plan = await readJson("release-plan.json");
const environment = await readJson("environment.json");
const backup = await readJson("backup.json");
const smoke = await readJson("smoke-test.json");
const monitoring = await readJson("monitoring.json");
const rollback = await readFile(resolve(evidence, "rollback.md"), "utf8");
const release = { plan, environment, backup, smoke, monitoring, rollback };

await run("上线必须有负责人、值守人和安全环境变量", () => {
  assert(release.plan.owner && release.plan.observer, "缺少发布责任人");
  assert(release.environment.AI_API_KEY.safeToShow === false, "密钥不应暴露");
});

await run("数据变更必须先证明备份可以恢复", () => {
  const verdict = reviewRelease(release);
  assert(verdict.ready === false, "没有恢复演练不应该放行");
  assert(
    verdict.code === "UNVERIFIED_BACKUP_RESTORE",
    "应返回 UNVERIFIED_BACKUP_RESTORE",
  );
});

await run("上线后要有移动端冒烟、AI 失败率监控和回滚验证", () => {
  assert(smoke.mobile390 === true, "缺少 390px 冒烟");
  assert(monitoring.aiFailureRate === true, "缺少 AI 失败率监控");
  assert(
    rollback.includes("触发") && rollback.includes("验证"),
    "回滚方案不完整",
  );
});

const passed = results.filter((result) => result.status === "passed").length;
const failed = results.length - passed;
await writeFile(
  resolve(root, "test-results.json"),
  `${JSON.stringify({ schemaVersion: 1, scenarioId: "release-proof-retest", summary: { passed, failed }, tests: results }, null, 2)}\n`,
);
for (const result of results)
  console.log(`${result.status === "passed" ? "PASS" : "FAIL"} ${result.name}`);
console.log(`${passed} passed, ${failed} failed`);
process.exitCode = failed > 0 ? 1 : 0;
