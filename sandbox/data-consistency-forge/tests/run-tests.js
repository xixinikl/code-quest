import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { saveDraft } from "../server/draftRepository.js";

const projectRoot = resolve(import.meta.dirname, "..");
const sourcePath = resolve(projectRoot, "server", "draftRepository.js");
const reportPath = resolve(projectRoot, "test-results.json");

function createDatabase() {
  return {
    drafts: [],
    auditLog: [],
  };
}

const baseRequest = {
  method: "POST",
  path: "/api/drafts",
  requestId: "req_draft_001",
  headers: {
    "Idempotency-Key": "draft-save-abc",
  },
  body: {
    userId: "user_apprentice",
    clientMutationId: "mutation_2026_0705_001",
    title: "AI 面试复盘草稿",
  },
};

const results = [];

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

await run("同一个 Idempotency-Key 重试时只能写入一条草稿", async () => {
  const database = createDatabase();

  const first = saveDraft({ request: baseRequest, database });
  const second = saveDraft({
    request: { ...baseRequest, requestId: "req_draft_002" },
    database,
  });

  assert(first.status === 201, "第一次保存应该创建草稿");
  assert(second.status === 200, "幂等重试应该返回已有草稿而不是再次创建");
  assert(database.drafts.length === 1, "重复请求写出了多条草稿");
  assert(
    second.body.draft.id === first.body.draft.id,
    "重试返回的不是同一条草稿",
  );
});

await run("同一用户的 clientMutationId 必须唯一", async () => {
  const database = createDatabase();

  saveDraft({ request: baseRequest, database });
  const duplicate = saveDraft({
    request: {
      ...baseRequest,
      requestId: "req_draft_003",
      headers: { "Idempotency-Key": "draft-save-different-key" },
    },
    database,
  });

  assert(duplicate.status === 409, "重复 clientMutationId 应该被唯一约束拒绝");
  assert(database.drafts.length === 1, "唯一约束失效，数据库出现重复草稿");
  assert(
    /clientMutationId|重复|唯一/.test(duplicate.body.message),
    "错误信息没有说明重复键原因",
  );
});

await run("审计日志失败时不能留下半截草稿", async () => {
  const database = createDatabase();
  const failed = saveDraft({
    request: {
      ...baseRequest,
      requestId: "req_draft_004",
      body: { ...baseRequest.body, simulateAuditFailure: true },
    },
    database,
  });

  assert(failed.status === 500, "预期模拟审计失败");
  assert(database.drafts.length === 0, "事务失败后仍留下了草稿");
  assert(database.auditLog.length === 0, "事务失败后不应有审计日志");
  assert(typeof failed.log === "string", "失败路径需要日志证据");
});

const source = await readFile(sourcePath);
const report = {
  schemaVersion: 1,
  scenarioId: "data-consistency-forge",
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
