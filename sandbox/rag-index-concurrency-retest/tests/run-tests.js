import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { DatabaseSync } from "node:sqlite";
import { createIndexJobRepository } from "../server/indexJobRepository.js";

const sandboxRoot = resolve(import.meta.dirname, "..");
const sourcePath = resolve(sandboxRoot, "server/indexJobRepository.js");
const schema = readFileSync(
  resolve(sandboxRoot, "database/schema.sql"),
  "utf8",
);

function createDatabase(status = "pending") {
  const database = new DatabaseSync(":memory:");
  database.exec(schema);
  database
    .prepare(
      "INSERT INTO index_jobs (id, document_id, document_version, status) VALUES (?, ?, ?, ?)",
    )
    .run(417, "handbook-ai-101", 7, status);
  return database;
}

function createTwoPartyGate() {
  let arrivals = 0;
  let release;
  const ready = new Promise((resolveReady) => {
    release = resolveReady;
  });

  return async () => {
    arrivals += 1;
    if (arrivals === 2) release();
    await ready;
  };
}

const cases = [
  {
    name: "两个 Worker 并发领取时只有一个成功",
    async run() {
      const database = createDatabase();
      const repository = createIndexJobRepository(database);
      const afterRead = createTwoPartyGate();
      const claims = await Promise.all([
        repository.claimNextJob("worker-a", { afterRead }),
        repository.claimNextJob("worker-b", { afterRead }),
      ]);
      const claimed = claims.filter(Boolean);

      if (claimed.length !== 1) {
        throw new Error(
          `预期只有一个 Worker 领取成功，实际 ${claimed.length} 个`,
        );
      }
      database.close();
    },
  },
  {
    name: "没有待处理任务时返回 null",
    async run() {
      const database = createIndexJobRepository(createDatabase("completed"));
      const claim = await database.claimNextJob("worker-a");
      if (claim !== null) throw new Error("已完成任务不应再次被领取");
    },
  },
  {
    name: "领取成功后任务记录 Worker 身份",
    async run() {
      const database = createDatabase();
      const repository = createIndexJobRepository(database);
      const claim = await repository.claimNextJob("worker-a");
      if (claim?.worker_id !== "worker-a" || claim.status !== "running") {
        throw new Error("领取结果没有记录 Worker 和运行状态");
      }
      database.close();
    },
  },
];

const results = [];
for (const testCase of cases) {
  try {
    await testCase.run();
    results.push({ name: testCase.name, status: "passed" });
    console.log(`✓ ${testCase.name}`);
  } catch (error) {
    results.push({
      name: testCase.name,
      status: "failed",
      message: error instanceof Error ? error.message : String(error),
    });
    console.log(`✗ ${testCase.name}`);
    console.log(`  ${results.at(-1).message}`);
  }
}

const sourceHash = createHash("sha256")
  .update(readFileSync(sourcePath))
  .digest("hex");
writeFileSync(
  resolve(sandboxRoot, "test-results.json"),
  `${JSON.stringify(
    {
      schemaVersion: 1,
      scenarioId: "rag-index-concurrency-retest",
      command: "npm test --prefix sandbox/rag-index-concurrency-retest",
      sourceFile: "server/indexJobRepository.js",
      sourceHash,
      generatedAt: new Date().toISOString(),
      tests: results,
    },
    null,
    2,
  )}\n`,
);

const passed = results.filter((result) => result.status === "passed").length;
const failed = results.length - passed;
console.log(`\n${passed} passed, ${failed} failed`);
console.log("已生成 test-results.json，学习应用可以读取这份报告。");
process.exitCode = failed > 0 ? 1 : 0;
