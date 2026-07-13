import { resolve } from "node:path";

type RuntimeEnvironment = Record<string, string | undefined>;

function readPort(value: string | undefined, fallback: number, name: string) {
  const port = Number.parseInt(value ?? String(fallback), 10);
  if (!Number.isInteger(port) || port < 1 || port > 65_535) {
    throw new Error(`${name} 必须是 1-65535 之间的端口`);
  }
  return port;
}

export function readRuntimeConfig(
  environment: RuntimeEnvironment = process.env,
  projectRoot = import.meta.dirname,
) {
  const webPort = readPort(environment.PORT, 5173, "PORT");
  const apiPort = readPort(environment.API_PORT, 4317, "API_PORT");
  if (webPort === apiPort) {
    throw new Error("PORT 与 API_PORT 不能相同");
  }
  return {
    webPort,
    apiPort,
    databasePath:
      environment.CODE_QUEST_DB_PATH ??
      resolve(projectRoot, ".data", "code-quest.sqlite"),
  };
}
