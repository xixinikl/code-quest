import {
  createServer,
  type IncomingMessage,
  type ServerResponse,
} from "node:http";
import { readScenarioArtifacts } from "./artifacts.js";
import { currentSchemaVersion, type LearningDatabase } from "./db.js";
import { readScenarioReport } from "./report.js";
import { ContractError } from "./scenarios.js";
import { LearningStore } from "./store.js";

const MAX_BODY_BYTES = 64 * 1024;

export function createLearningServer(
  db: LearningDatabase,
  projectRoot = new URL("..", import.meta.url).pathname,
) {
  const store = new LearningStore(db);

  return createServer(async (request, response) => {
    try {
      await route(request, response, store, db, projectRoot);
    } catch (error) {
      handleError(response, error);
    }
  });
}

async function route(
  request: IncomingMessage,
  response: ServerResponse,
  store: LearningStore,
  db: LearningDatabase,
  projectRoot: string,
) {
  const method = request.method ?? "GET";
  const url = new URL(request.url ?? "/", "http://127.0.0.1");

  if (method === "GET" && url.pathname === "/api/health") {
    return sendJson(response, 200, {
      status: "ok",
      database: "connected",
      schemaVersion: currentSchemaVersion(db),
      safetyMode: "manual-sandbox-no-shell",
    });
  }

  const scenarioMatch = url.pathname.match(/^\/api\/scenarios\/([^/]+)$/);
  if (method === "GET" && scenarioMatch) {
    return sendJson(response, 200, {
      scenarioId: scenarioMatch[1],
      artifacts: readScenarioArtifacts(projectRoot, scenarioMatch[1]),
    });
  }

  if (method === "POST" && url.pathname === "/api/diagnostic-sessions") {
    return sendJson(response, 201, store.startDiagnostic());
  }

  const diagnosticMatch = url.pathname.match(
    /^\/api\/diagnostic-sessions\/([^/]+)$/,
  );
  if (method === "PATCH" && diagnosticMatch) {
    const body = await readJson(request);
    return sendJson(
      response,
      200,
      store.saveDiagnosticBaseline(
        diagnosticMatch[1],
        body.baseline,
        body.completed === true,
      ),
    );
  }

  if (method === "POST" && url.pathname === "/api/attempts") {
    const body = await readJson(request);
    if (typeof body.scenarioId !== "string") {
      throw new ContractError("INVALID_BODY", "scenarioId 必须是字符串");
    }
    return sendJson(response, 201, store.startAttempt(body.scenarioId));
  }

  const attemptMatch = url.pathname.match(/^\/api\/attempts\/([^/]+)$/);
  if (method === "GET" && attemptMatch) {
    return sendJson(response, 200, store.getAttempt(attemptMatch[1]));
  }

  const stepMatch = url.pathname.match(
    /^\/api\/attempts\/([^/]+)\/steps\/([^/]+)$/,
  );
  if (method === "PATCH" && stepMatch) {
    const body = await readJson(request);
    return sendJson(
      response,
      200,
      store.saveStep(stepMatch[1], stepMatch[2], body.response),
    );
  }

  const hintMatch = url.pathname.match(/^\/api\/attempts\/([^/]+)\/hints$/);
  if (method === "POST" && hintMatch) {
    return sendJson(response, 200, store.takeHint(hintMatch[1]));
  }

  const verifyMatch = url.pathname.match(/^\/api\/attempts\/([^/]+)\/verify$/);
  if (method === "POST" && verifyMatch) {
    const attempt = store.getAttempt(verifyMatch[1]);
    const verification = readScenarioReport(
      projectRoot,
      attempt.scenarioId,
      attempt.startedAt,
    );
    return sendJson(
      response,
      200,
      store.recordVerification(attempt.id, verification),
    );
  }

  const submitMatch = url.pathname.match(/^\/api\/attempts\/([^/]+)\/submit$/);
  if (method === "POST" && submitMatch) {
    return sendJson(response, 200, store.submitAttempt(submitMatch[1]));
  }

  if (method === "GET" && url.pathname === "/api/evidence") {
    return sendJson(response, 200, { evidence: store.getEvidence() });
  }

  throw new ContractError("NOT_FOUND", "接口不存在");
}

async function readJson(
  request: IncomingMessage,
): Promise<Record<string, unknown>> {
  const chunks: Buffer[] = [];
  let total = 0;
  for await (const chunk of request) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    total += buffer.length;
    if (total > MAX_BODY_BYTES) {
      throw new ContractError("BODY_TOO_LARGE", "请求内容超过 64KB");
    }
    chunks.push(buffer);
  }

  try {
    const value = JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}");
    if (!value || typeof value !== "object" || Array.isArray(value)) {
      throw new Error("not an object");
    }
    return value as Record<string, unknown>;
  } catch {
    throw new ContractError("INVALID_JSON", "请求内容不是有效 JSON 对象");
  }
}

function sendJson(response: ServerResponse, status: number, value: unknown) {
  response.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
  });
  response.end(JSON.stringify(value));
}

function handleError(response: ServerResponse, error: unknown) {
  if (error instanceof ContractError) {
    const status =
      error.code === "NOT_FOUND"
        ? 404
        : error.code === "BODY_TOO_LARGE"
          ? 413
          : 400;
    return sendJson(response, status, {
      error: error.code,
      message: error.message,
    });
  }

  console.error("Unhandled API error", error);
  return sendJson(response, 500, {
    error: "INTERNAL_ERROR",
    message: "本地学习服务发生未预期错误",
  });
}
