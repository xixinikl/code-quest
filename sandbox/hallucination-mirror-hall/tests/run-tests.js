import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import {
  answerQuestion,
  buildGroundedPrompt,
  createFakeModel,
  validateGroundedAnswer,
} from "../server/groundedAnswer.js";

const projectRoot = resolve(import.meta.dirname, "..");
const sourcePath = resolve(projectRoot, "server", "groundedAnswer.js");
const reportPath = resolve(projectRoot, "test-results.json");
const results = [];

const contextChunks = [
  {
    id: "brief#goal",
    title: "Project Brief 目标",
    text: "CanvasStorm 的 AI 助手只能根据用户填写的 Project Brief 生成候选方向。",
  },
  {
    id: "brief#save",
    title: "会话保存规则",
    text: "候选方向必须保存到当前会话，并记录 accepted 与 rejected 的候选 id。",
  },
];

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

await run(
  "Prompt 必须声明只根据 context 回答、必须引用、资料不足要拒答",
  () => {
    const messages = buildGroundedPrompt({
      question: "CanvasStorm 是否会自动发布到线上？",
      contextChunks,
    });
    const promptText = JSON.stringify(messages);

    assert(/context|上下文|资料/.test(promptText), "Prompt 没有明确资料范围");
    assert(/citation|引用/.test(promptText), "Prompt 没有要求引用来源");
    assert(
      /UNKNOWN|资料不足|不知道|无法确认/.test(promptText),
      "Prompt 没有写清无资料时必须拒答",
    );
  },
);

await run("引用必须来自本轮 context，不允许编造 citation id", () => {
  const result = validateGroundedAnswer({
    contextChunks,
    modelAnswer: {
      answer: "CanvasStorm 会自动发布到线上。",
      citations: ["deploy#auto"],
      confidence: "high",
    },
  });

  assert(result.confidence === "low", "编造引用时应该降为低置信或拒答");
  assert(result.citations.length === 0, "无效引用不应该继续展示给用户");
  assert(
    /资料不足|无法确认|UNKNOWN/.test(result.answer),
    "无效引用时应该明确拒答",
  );
});

await run("没有 context 时不能硬答，必须告诉用户需要补充资料", () => {
  const model = createFakeModel({
    answer: "可以，系统已经支持自动发布。",
    citations: [],
    confidence: "high",
  });
  const result = answerQuestion({
    question: "这个项目是否支持自动发布？",
    contextChunks: [],
    model,
  });

  assert(result.confidence === "low", "无资料时不能给 high confidence");
  assert(result.citations.length === 0, "无资料时不应该有引用");
  assert(
    /资料不足|无法确认|补充/.test(result.answer),
    "无资料时应该说明需要补资料",
  );
});

await run("有效回答必须保留引用、置信度和可展示来源", () => {
  const result = validateGroundedAnswer({
    contextChunks,
    modelAnswer: {
      answer: "候选方向需要保存到当前会话。",
      citations: ["brief#save"],
      confidence: "high",
    },
  });

  assert(result.answer.includes("当前会话"), "有效回答内容不应被覆盖");
  assert(result.citations.includes("brief#save"), "有效引用应该保留");
  assert(result.confidence === "high", "有效引用可以保持 high confidence");
  assert(
    Array.isArray(result.sources) && result.sources[0]?.title,
    "结果需要带可展示来源，方便用户检查依据",
  );
});

const source = await readFile(sourcePath);
const report = {
  schemaVersion: 1,
  scenarioId: "hallucination-mirror-hall",
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
