import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { DatabaseSync } from "node:sqlite";
import { createAvatarRepository } from "../server/avatarRepository.js";
import { createProfileRoutes } from "../server/profileRoutes.js";

const projectRoot = resolve(import.meta.dirname, "..");
const sourcePath = resolve(projectRoot, "server", "avatarRepository.js");
const schemaPath = resolve(projectRoot, "database", "schema.sql");
const reportPath = resolve(projectRoot, "test-results.json");
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

const db = new DatabaseSync(":memory:");
db.exec(await readFile(schemaPath, "utf8"));
const repository = createAvatarRepository(db);
const routes = createProfileRoutes(repository);

await run("上传成功后重新登录仍读取新头像", async () => {
  const updated = routes.updateAvatar({
    user: { id: "user_01" },
    body: { avatarUrl: "/avatars/new-moon.webp" },
  });
  assert(updated.status === 200, `预期 200，实际 ${updated.status}`);

  const afterRelogin = routes.getProfile({ user: { id: "user_01" } });
  assert(
    afterRelogin.body.avatarUrl === "/avatars/new-moon.webp",
    `预期重新登录后读取新头像，实际为 ${afterRelogin.body.avatarUrl}`,
  );
});

await run("无效头像地址不会改变数据库", async () => {
  const response = routes.updateAvatar({
    user: { id: "user_01" },
    body: { avatarUrl: "https://evil.example/avatar.png" },
  });
  assert(response.status === 400, `预期 400，实际 ${response.status}`);
  const profile = repository.getProfile("user_01");
  assert(
    profile.avatarUrl !== "https://evil.example/avatar.png",
    "无效地址产生了数据库副作用",
  );
});

const source = await readFile(sourcePath);
const report = {
  schemaVersion: 1,
  scenarioId: "avatar-persistence-retest",
  generatedAt: new Date().toISOString(),
  sourceHash: createHash("sha256").update(source).digest("hex"),
  summary: {
    passed: results.filter((result) => result.status === "passed").length,
    failed: results.filter((result) => result.status === "failed").length,
  },
  tests: results,
};

await writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");
db.close();

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
