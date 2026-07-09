import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import {
  buildInterviewDossier,
  reviewInterviewAnswer,
} from "../server/interviewAnswer.js";

const projectRoot = resolve(import.meta.dirname, "..");
const sourcePath = resolve(projectRoot, "server", "interviewAnswer.js");
const reportPath = resolve(projectRoot, "test-results.json");
const evidenceRoot = resolve(projectRoot, "evidence");
const results = [];

async function readJson(path) {
  return JSON.parse(await readFile(path, "utf8"));
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

const source = await readFile(sourcePath);
const currentSourceHash = createHash("sha256").update(source).digest("hex");
const storyBank = await readJson(resolve(evidenceRoot, "story-bank.json"));
const starDraft = await readJson(resolve(evidenceRoot, "star-draft.json"));
const incidentReview = await readJson(
  resolve(evidenceRoot, "incident-review.json"),
);
const tradeoff = await readJson(resolve(evidenceRoot, "tradeoff-notes.json"));
const followUps = await readJson(
  resolve(evidenceRoot, "follow-up-questions.json"),
);
const backendLog = await readFile(resolve(evidenceRoot, "backend.log"), "utf8");

function createAnswer(overrides = {}) {
  return {
    ...starDraft,
    storyBank,
    incidentReview,
    tradeoff,
    followUps,
    ...overrides,
  };
}

await run("STAR 回答必须包含可验证结果", () => {
  const verdict = reviewInterviewAnswer(createAnswer());

  assert(verdict.ready === false, "缺少 Result 不应该进入面试稿");
  assert(
    verdict.code === "MISSING_STAR_SECTION",
    "缺 STAR 结果应返回 MISSING_STAR_SECTION",
  );
});

await run("项目素材必须至少包含一条两项以上证据链", () => {
  const verdict = reviewInterviewAnswer(
    createAnswer({
      star: { ...starDraft.star, result: "主路径通过 verify 和浏览器验收。" },
      storyBank: storyBank.map((item) => ({ ...item, evidence: [] })),
    }),
  );

  assert(verdict.ready === false, "没有证据链不应该进入面试稿");
  assert(
    verdict.code === "MISSING_PROJECT_EVIDENCE",
    "缺项目证据应返回 MISSING_PROJECT_EVIDENCE",
  );
});

await run("故障复盘必须包含修复后的验证动作", () => {
  const verdict = reviewInterviewAnswer(
    createAnswer({
      star: { ...starDraft.star, result: "主路径通过 verify 和浏览器验收。" },
    }),
  );

  assert(verdict.ready === false, "缺验证的故障复盘不应该通过");
  assert(
    verdict.code === "INCOMPLETE_INCIDENT_REVIEW",
    "缺复盘验证应返回 INCOMPLETE_INCIDENT_REVIEW",
  );
});

await run("技术取舍必须说明代价，不能只说选择", () => {
  const verdict = reviewInterviewAnswer(
    createAnswer({
      star: { ...starDraft.star, result: "主路径通过 verify 和浏览器验收。" },
      incidentReview: {
        ...incidentReview,
        verification: "刷新后仍能看到数据，测试报告通过。",
      },
    }),
  );

  assert(verdict.ready === false, "没有代价的技术取舍不应该通过");
  assert(
    verdict.code === "MISSING_TRADEOFF",
    "缺取舍代价应返回 MISSING_TRADEOFF",
  );
});

await run("终章答辩至少准备 3 个追问答案", () => {
  const verdict = reviewInterviewAnswer(
    createAnswer({
      star: { ...starDraft.star, result: "主路径通过 verify 和浏览器验收。" },
      incidentReview: {
        ...incidentReview,
        verification: "刷新后仍能看到数据，测试报告通过。",
      },
      tradeoff: {
        ...tradeoff,
        cost: "多一层服务端接口和错误处理，但保护了密钥边界。",
      },
    }),
  );

  assert(verdict.ready === false, "追问不足不应该通过");
  assert(
    verdict.code === "MISSING_FOLLOW_UPS",
    "缺追问应返回 MISSING_FOLLOW_UPS",
  );
  assert(
    backendLog.includes("MISSING_FOLLOW_UPS"),
    "后端日志需要保留追问不足线索",
  );
});

await run("面试稿不能夸大真人学习效果", () => {
  const verdict = reviewInterviewAnswer(
    createAnswer({
      star: { ...starDraft.star, result: "主路径通过 verify 和浏览器验收。" },
      incidentReview: {
        ...incidentReview,
        verification: "刷新后仍能看到数据，测试报告通过。",
      },
      tradeoff: {
        ...tradeoff,
        cost: "多一层服务端接口和错误处理，但保护了密钥边界。",
      },
      followUps: [
        ...followUps,
        {
          question: "上线失败怎么办？",
          answer: "先看错误率和关键路径，达到回滚条件就恢复上一版本并复测。",
        },
      ],
    }),
  );

  assert(verdict.ready === false, "夸大掌握程度不应该通过");
  assert(
    verdict.code === "OVERCLAIMED_LEARNING_RESULT",
    "夸大效果应返回 OVERCLAIMED_LEARNING_RESULT",
  );
});

await run("答辩卷宗必须给出修订清单和面试表达", () => {
  const verdict = { ready: false, code: "MISSING_TRADEOFF" };
  const dossier = buildInterviewDossier(createAnswer(), verdict);

  assert(dossier.decision === "revise", "缺取舍时应要求修订");
  assert(
    dossier.requestedRevisions.some((item) => item.includes("代价")),
    "修订清单需要点名技术取舍代价",
  );
  assert(
    /STAR|故障复盘|技术取舍|追问/.test(dossier.interviewLine ?? ""),
    "答辩卷宗需要给出可用于面试的表达",
  );
});

const report = {
  schemaVersion: 1,
  scenarioId: "interview-answer-forge",
  generatedAt: new Date().toISOString(),
  sourceHash: currentSourceHash,
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
