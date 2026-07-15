import { resolve } from "node:path";
import { createLearningServer } from "./app.js";
import { openDatabase } from "./db.js";

const projectRoot = resolve(import.meta.dirname, "..");
const databasePath =
  process.env.CODE_QUEST_DB_PATH ??
  resolve(projectRoot, ".data", "code-quest.sqlite");
const port = Number(process.env.CODE_QUEST_PORT ?? 4317);
const database = openDatabase(databasePath);
const server = createLearningServer(database, projectRoot);

server.listen(port, "127.0.0.1", () => {
  console.log(`学习记录服务已启动：http://127.0.0.1:${port}`);
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
