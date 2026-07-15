import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { validateBrief } from "../server/briefContract.js";

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

const request = await readJson("request.json");
const vague = await readJson("vague-brief.json");
const unsafe = await readJson("unsafe-brief.json");
const clear = await readJson("clear-brief.json");
const delivery = await readFile(resolve(evidence, "agent-delivery.md"), "utf8");

await run("委托必须从真实业务背景和可观察目标开始", () => {
  assert(request.user === "客服运营", "缺少业务角色");
  assert(vague.goal === "接入上传功能", "没有读取模糊目标");
  const verdict = validateBrief(vague);
  assert(verdict.ok === false, "模糊委托不应直接启动");
});

await run("委托必须限制范围并要求回滚方案", () => {
  const verdict = validateBrief(clear);
  assert(verdict.ok === true, "清晰委托应该通过基础契约");
  assert(clear.constraints.forbidden.includes("部署配置"), "缺少禁止修改范围");
  const withoutRollback = { ...clear, rollback: undefined };
  const missingRollback = validateBrief(withoutRollback);
  assert(missingRollback.ok === false, "没有回滚方案的委托不应该通过");
  assert(
    missingRollback.code === "MISSING_ROLLBACK",
    "应返回 MISSING_ROLLBACK",
  );
});

await run("Agent 交付必须说明越界风险和验收结果", () => {
  assert(unsafe.constraints.forbidden.length > 0, "越界委托没有禁止项");
  assert(delivery.includes("回滚"), "交付说明没有回滚");
  assert(delivery.includes("验收"), "交付说明没有验收");
});

await mkdir(root, { recursive: true });
const passed = results.filter((result) => result.status === "passed").length;
const failed = results.length - passed;
await writeFile(
  resolve(root, "test-results.json"),
  `${JSON.stringify({ schemaVersion: 1, scenarioId: "brief-contract-retest", summary: { passed, failed }, tests: results }, null, 2)}\n`,
);
for (const result of results)
  console.log(`${result.status === "passed" ? "PASS" : "FAIL"} ${result.name}`);
console.log(`${passed} passed, ${failed} failed`);
process.exitCode = failed > 0 ? 1 : 0;
