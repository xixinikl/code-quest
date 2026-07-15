import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const controllerPath = resolve(root, "server/UserController.java");
const servicePath = resolve(root, "server/UserService.java");
const reportPath = resolve(root, "test-results.json");
const controller = await readFile(controllerPath, "utf8");
const service = await readFile(servicePath, "utf8");
const tests = [];

function check(name, condition, message) {
  tests.push({
    name,
    status: condition ? "passed" : "failed",
    ...(condition ? {} : { message }),
  });
}

check(
  "Controller 把查询交给 Service",
  controller.includes("userService.findUser"),
  "UserController 仍然直接调用 userRepository.findById",
);
check(
  "Service 保留权限校验",
  service.includes("viewer cannot read this user"),
  "UserService 缺少 viewerId 不匹配时的拒绝规则",
);
check(
  "Controller 不直接依赖 Repository 查询",
  !controller.includes("userRepository.findById"),
  "Controller 仍然越过业务层访问 Repository",
);

const report = {
  schemaVersion: 1,
  scenarioId: "java-layered-request",
  generatedAt: new Date().toISOString(),
  sourceHash: createHash("sha256").update(controller).digest("hex"),
  summary: {
    passed: tests.filter((test) => test.status === "passed").length,
    failed: tests.filter((test) => test.status === "failed").length,
  },
  tests,
};
await writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");

for (const test of tests) {
  console.log(`${test.status === "passed" ? "✓" : "✗"} ${test.name}`);
  if (test.message) console.log(`  ${test.message}`);
}
console.log(
  `\n${report.summary.passed} passed, ${report.summary.failed} failed`,
);
if (report.summary.failed > 0) process.exitCode = 1;
