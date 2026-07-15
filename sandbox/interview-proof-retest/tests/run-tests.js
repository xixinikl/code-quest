import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { reviewAnswer } from "../server/answerGate.js";

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

const story = await readJson("story-bank.json");
const star = await readJson("star-draft.json");
const incident = await readJson("incident-review.json");
const tradeoff = await readJson("tradeoff.json");
const followUps = await readJson("follow-ups.json");
const answer = {
  star,
  evidence: story.flatMap((item) => item.evidence),
  incident,
  tradeoff,
  followUps,
};

await run("面试回答必须把行动连接到真实证据", () => {
  assert(answer.star.action.includes("Network"), "行动没有证据动作");
  assert(answer.evidence.length >= 2, "证据链不足两项");
});

await run("回答不能用一句全能掌握掩盖未验证边界", () => {
  const verdict = reviewAnswer({
    ...answer,
    claim: "我已经完全掌握并能解决所有类似问题",
  });
  assert(verdict.ready === false, "夸大掌握程度不应该通过");
  assert(
    verdict.code === "OVERCLAIMED_LEARNING_RESULT",
    "应返回 OVERCLAIMED_LEARNING_RESULT",
  );
});

await run("追问必须能讲清取舍、代价和下一步", () => {
  assert(followUps.length >= 3, "追问答案不足");
  assert(tradeoff.cost && tradeoff.alternative, "缺少取舍代价和替代方案");
  assert(incident.nextStep, "缺少下一步验证");
});

const passed = results.filter((result) => result.status === "passed").length;
const failed = results.length - passed;
await writeFile(
  resolve(root, "test-results.json"),
  `${JSON.stringify({ schemaVersion: 1, scenarioId: "interview-proof-retest", summary: { passed, failed }, tests: results }, null, 2)}\n`,
);
for (const result of results)
  console.log(`${result.status === "passed" ? "PASS" : "FAIL"} ${result.name}`);
console.log(`${passed} passed, ${failed} failed`);
process.exitCode = failed > 0 ? 1 : 0;
