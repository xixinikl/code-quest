import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import {
  answerWithSources,
  indexDocuments,
  searchTopK,
  splitIntoChunks,
} from "../server/ragEngine.js";

const projectRoot = resolve(import.meta.dirname, "..");
const sourcePath = resolve(projectRoot, "server", "ragEngine.js");
const reportPath = resolve(projectRoot, "test-results.json");
const results = [];

const documents = [
  {
    id: "doc-login",
    path: "docs/login.md",
    title: "登录状态说明",
    text: "登录状态通过 httpOnly Cookie 保存。刷新页面时，前端应该请求 /api/me 恢复当前用户。",
  },
  {
    id: "doc-brief",
    path: "docs/project-brief.md",
    title: "Project Brief 说明",
    text: "Project Brief 必须包含用户目标、输入材料、输出格式和保存位置。AI 只能根据 Brief 生成候选方向。",
  },
  {
    id: "doc-rag",
    path: "docs/rag.md",
    title: "RAG 知识库说明",
    text: "RAG 会先把文档切成带来源的 chunk，再根据用户问题检索 topK 命中片段，最后让模型带引用回答。",
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

await run("chunk 必须保留稳定 id、标题、来源路径和原文片段", () => {
  const chunks = splitIntoChunks(documents[2]);

  assert(chunks.length >= 1, "RAG 文档应该至少切出一个 chunk");
  assert(/^doc-rag#chunk-\d+$/.test(chunks[0].id), "chunk id 不稳定或不可引用");
  assert(chunks[0].sourcePath === "docs/rag.md", "chunk 丢失来源路径");
  assert(chunks[0].title === "RAG 知识库说明", "chunk 丢失标题");
  assert(chunks[0].text.includes("topK"), "chunk 应保留可回答问题的原文");
});

await run("检索 Project Brief 问题时，top1 必须命中 Brief 文档", () => {
  const index = indexDocuments(documents);
  const matches = searchTopK({
    question: "Project Brief 需要包含哪些内容？",
    index,
    topK: 3,
  });

  assert(matches.length === 3, "应该返回 topK 个候选片段");
  assert(matches[0].id.startsWith("doc-brief#"), "top1 没有命中 Brief 文档");
  assert(matches[0].score >= matches[1].score, "matches 应按 score 降序排列");
  assert(matches[0].sourcePath, "命中结果缺少来源路径");
});

await run("检索 RAG 问题时，答案必须展示 matches 和 citations", () => {
  const result = answerWithSources({
    question: "RAG 是怎么让资料进入回答的？",
    documents,
  });

  assert(result.matches.length > 0, "回答没有暴露检索命中的 chunks");
  assert(result.citations.length > 0, "回答没有引用来源");
  assert(
    result.citations.every((id) =>
      result.matches.some((match) => match.id === id),
    ),
    "citations 必须来自本次 matches",
  );
  assert(/chunk|检索|topK|引用/.test(result.answer), "回答没有解释 RAG 证据链");
});

await run("无关问题不能拿错误资料硬答", () => {
  const result = answerWithSources({
    question: "公司年假政策是什么？",
    documents,
  });

  assert(result.confidence === "low", "无关问题应该低置信");
  assert(result.citations.length === 0, "无关问题不应引用不相关资料");
  assert(
    /资料不足|无法确认|补充/.test(result.answer),
    "无关问题应该明确要求补资料",
  );
});

const source = await readFile(sourcePath);
const report = {
  schemaVersion: 1,
  scenarioId: "rag-knowledge-maze",
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
