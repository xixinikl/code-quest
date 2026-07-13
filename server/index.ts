import { resolve } from "node:path";
import { createLearningServer } from "./app.js";
import { openDatabase } from "./db.js";
import { readRuntimeConfig } from "../runtime-config.js";

const runtime = readRuntimeConfig();
const projectRoot = resolve(import.meta.dirname, "..");
const database = openDatabase(runtime.databasePath);
const server = createLearningServer(database, projectRoot);

server.listen(runtime.apiPort, "127.0.0.1", () => {
  console.log(`学习记录服务已启动：http://127.0.0.1:${runtime.apiPort}`);
  console.log("安全模式：不执行 shell，只读固定沙盒测试报告");
});

function shutdown() {
  server.close(() => {
    database.close();
    process.exit(0);
  });
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
