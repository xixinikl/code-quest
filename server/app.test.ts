// @vitest-environment node

import { once } from "node:events";
import type { AddressInfo } from "node:net";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { createLearningServer } from "./app.js";
import { openDatabase, type LearningDatabase } from "./db.js";

let db: LearningDatabase;
let server: ReturnType<typeof createLearningServer>;
let baseUrl: string;

type ApiBody = {
  id?: string;
  baseline?: { plan?: string };
  hintLevel?: number;
  steps?: Record<string, { response: Record<string, string> }>;
  error?: string;
  [key: string]: unknown;
};

beforeEach(async () => {
  db = openDatabase(":memory:");
  server = createLearningServer(db);
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  const address = server.address() as AddressInfo;
  baseUrl = `http://127.0.0.1:${address.port}`;
});

afterEach(async () => {
  server.close();
  await once(server, "close");
  db.close();
});

async function jsonRequest(path: string, init?: RequestInit) {
  const response = await fetch(`${baseUrl}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });
  return {
    response,
    body: (await response.json()) as ApiBody,
  };
}

describe("本地学习 API", () => {
  it("公开安全模式与 schema 状态，不公开本地路径", async () => {
    const { response, body } = await jsonRequest("/api/health");

    expect(response.status).toBe(200);
    expect(body).toEqual({
      status: "ok",
      database: "connected",
      schemaVersion: 1,
      safetyMode: "manual-sandbox-no-shell",
    });
    expect(JSON.stringify(body)).not.toContain("/Users/");
  });

  it("完整保存诊断、尝试、步骤和提示", async () => {
    const diagnosticResult = await jsonRequest("/api/diagnostic-sessions", {
      method: "POST",
      body: "{}",
    });
    const diagnosticId = String(diagnosticResult.body.id);
    const savedDiagnostic = await jsonRequest(
      `/api/diagnostic-sessions/${diagnosticId}`,
      {
        method: "PATCH",
        body: JSON.stringify({
          baseline: { plan: "先复现，再查看请求" },
          completed: true,
        }),
      },
    );
    expect(savedDiagnostic.body.baseline?.plan).toBe("先复现，再查看请求");

    const created = await jsonRequest("/api/attempts", {
      method: "POST",
      body: JSON.stringify({ scenarioId: "canvas-save-persistence" }),
    });
    const attemptId = String(created.body.id);
    expect(created.response.status).toBe(201);

    await jsonRequest(`/api/attempts/${attemptId}/steps/baseline-plan`, {
      method: "PATCH",
      body: JSON.stringify({ response: { plan: "检查 Network 和数据库" } }),
    });
    await jsonRequest(`/api/attempts/${attemptId}/hints`, {
      method: "POST",
      body: "{}",
    });

    const restored = await jsonRequest(`/api/attempts/${attemptId}`);
    expect(restored.body.hintLevel).toBe(1);
    expect(restored.body.steps?.["baseline-plan"].response.plan).toBe(
      "检查 Network 和数据库",
    );
  });

  it("拒绝路径式场景 ID 和超出契约的步骤", async () => {
    const invalidScenario = await jsonRequest("/api/attempts", {
      method: "POST",
      body: JSON.stringify({ scenarioId: "../../CanvasStorm" }),
    });
    expect(invalidScenario.response.status).toBe(400);
    expect(invalidScenario.body.error).toBe("UNKNOWN_SCENARIO");

    const created = await jsonRequest("/api/attempts", {
      method: "POST",
      body: JSON.stringify({ scenarioId: "canvas-save-persistence" }),
    });
    const invalidStep = await jsonRequest(
      `/api/attempts/${String(created.body.id)}/steps/not-registered`,
      {
        method: "PATCH",
        body: JSON.stringify({ response: { command: "rm -rf /" } }),
      },
    );
    expect(invalidStep.response.status).toBe(400);
    expect(invalidStep.body.error).toBe("UNKNOWN_STEP");
  });
});
