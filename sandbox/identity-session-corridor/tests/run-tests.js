import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import {
  callProtectedApi,
  restoreCurrentUser,
  signIn,
} from "../server/sessionGateway.js";

const projectRoot = resolve(import.meta.dirname, "..");
const sourcePath = resolve(projectRoot, "server", "sessionGateway.js");
const reportPath = resolve(projectRoot, "test-results.json");

function createBrowserStorage() {
  return {
    memory: {},
    cookies: {},
    localStorage: {},
  };
}

function createServerSessions() {
  return {
    bySessionId: {},
    byToken: {},
  };
}

const credentials = {
  email: "apprentice@canvasstorm.dev",
  password: "demo-password",
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

await run("登录成功后必须写入可刷新恢复的浏览器凭证", async () => {
  const browserStorage = createBrowserStorage();
  const serverSessions = createServerSessions();

  const result = signIn({ ...credentials, browserStorage, serverSessions });

  assert(result.status === "ok", "预期登录成功");
  assert(
    typeof browserStorage.cookies.sessionId === "string",
    "缺少 sessionId Cookie，刷新后浏览器没有门牌",
  );
  assert(
    serverSessions.bySessionId[browserStorage.cookies.sessionId],
    "服务端会话登记册没有记录这个 sessionId",
  );
});

await run("刷新页面后能从 Cookie 或 Token 还原当前用户", async () => {
  const browserStorage = createBrowserStorage();
  const serverSessions = createServerSessions();

  signIn({ ...credentials, browserStorage, serverSessions });
  browserStorage.memory = {};
  const restored = restoreCurrentUser({ browserStorage, serverSessions });

  assert(restored.status === "ok", "刷新后没有恢复登录状态");
  assert(
    restored.user.email === credentials.email,
    "恢复出的用户不是刚登录的人",
  );
});

await run("访问 /api/me 时必须携带有效凭证，不能返回 401", async () => {
  const browserStorage = createBrowserStorage();
  const serverSessions = createServerSessions();

  signIn({ ...credentials, browserStorage, serverSessions });
  const response = callProtectedApi({
    path: "/api/me",
    browserStorage,
    serverSessions,
  });

  assert(response.status === "ok", "/api/me 仍然返回未登录");
  assert(response.user.email === credentials.email, "接口返回的用户不正确");
});

const source = await readFile(sourcePath);
const report = {
  schemaVersion: 1,
  scenarioId: "identity-session-corridor",
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
