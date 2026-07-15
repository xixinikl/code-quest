import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { DatabaseSync } from "node:sqlite";
import { createAuthRoutes } from "../server/authRoutes.js";
import { createSessionRepository } from "../server/sessionRepository.js";

const projectRoot = resolve(import.meta.dirname, "..");
const sourcePath = resolve(projectRoot, "server", "sessionRepository.js");
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

await run("服务重启后刷新凭证仍能续期", async () => {
  const firstRoutes = createAuthRoutes(createSessionRepository(db));
  const login = firstRoutes.login({ body: { staffCode: "night-17" } });
  assert(login.status === 200, `预期登录 200，实际 ${login.status}`);

  const restartedRoutes = createAuthRoutes(createSessionRepository(db));
  const refreshed = restartedRoutes.refresh({
    cookies: { refreshToken: "refresh_night_17" },
  });
  assert(
    refreshed.status === 200,
    `预期服务重启后续期 200，实际 ${refreshed.status}`,
  );
});

await run("注销后的刷新凭证不能再次使用", async () => {
  const repository = createSessionRepository(db);
  const routes = createAuthRoutes(repository);
  routes.login({ body: { staffCode: "night-17" } });
  routes.logout({ cookies: { refreshToken: "refresh_night_17" } });
  const refreshed = routes.refresh({
    cookies: { refreshToken: "refresh_night_17" },
  });
  assert(refreshed.status === 401, `预期注销后 401，实际 ${refreshed.status}`);
});

await run("未知刷新凭证不会获得访问令牌", async () => {
  const routes = createAuthRoutes(createSessionRepository(db));
  const refreshed = routes.refresh({
    cookies: { refreshToken: "refresh_unknown" },
  });
  assert(refreshed.status === 401, `预期 401，实际 ${refreshed.status}`);
});

const source = await readFile(sourcePath);
const report = {
  schemaVersion: 1,
  scenarioId: "support-shift-session-retest",
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
