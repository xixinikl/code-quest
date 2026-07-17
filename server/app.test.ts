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
      schemaVersion: 2,
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
    await jsonRequest(`/api/attempts/${attemptId}/steps/interview-dossier`, {
      method: "PATCH",
      body: JSON.stringify({
        response: { "chapter-1-phenomenon": "保存成功但刷新后消失" },
      }),
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
    expect(
      restored.body.steps?.["interview-dossier"].response[
        "chapter-1-phenomenon"
      ],
    ).toBe("保存成功但刷新后消失");
  });

  it("练习详情返回最近一次测试报告，供前端解释失败原因", async () => {
    const created = await jsonRequest("/api/attempts", {
      method: "POST",
      body: JSON.stringify({ scenarioId: "canvasstorm-product-brief" }),
    });
    const attemptId = String(created.body.id);
    const observedAt = "2026-07-05T00:00:00.000Z";
    db.prepare(
      `INSERT INTO verification_events
       (attempt_id, status, report_json, observed_at)
       VALUES (?, 'failed', ?, ?)`,
    ).run(
      attemptId,
      JSON.stringify({
        tests: [
          {
            name: "只把所选方向的候选放进执行草案",
            status: "failed",
            message: "执行草案包含了非 MVP 方向候选",
          },
        ],
      }),
      observedAt,
    );
    db.prepare(
      "UPDATE attempts SET verification_status = 'failed' WHERE id = ?",
    ).run(attemptId);

    const restored = await jsonRequest(`/api/attempts/${attemptId}`);

    expect(restored.response.status).toBe(200);
    expect(restored.body.latestVerification).toEqual({
      status: "failed",
      observedAt,
      report: {
        tests: [
          {
            name: "只把所选方向的候选放进执行草案",
            status: "failed",
            message: "执行草案包含了非 MVP 方向候选",
          },
        ],
      },
    });
  });

  it("导出并恢复完整本地学习记录备份", async () => {
    const diagnosticResult = await jsonRequest("/api/diagnostic-sessions", {
      method: "POST",
      body: "{}",
    });
    const diagnosticId = String(diagnosticResult.body.id);
    await jsonRequest(`/api/diagnostic-sessions/${diagnosticId}`, {
      method: "PATCH",
      body: JSON.stringify({
        baseline: { plan: "先看请求链路" },
        completed: true,
      }),
    });

    const created = await jsonRequest("/api/attempts", {
      method: "POST",
      body: JSON.stringify({ scenarioId: "canvas-save-persistence" }),
    });
    const attemptId = String(created.body.id);
    await jsonRequest(`/api/attempts/${attemptId}/steps/baseline-plan`, {
      method: "PATCH",
      body: JSON.stringify({ response: { plan: "保存链路备份测试" } }),
    });
    await jsonRequest(`/api/attempts/${attemptId}/steps/interview-dossier`, {
      method: "PATCH",
      body: JSON.stringify({
        response: { "chapter-1-phenomenon": "刷新后记录消失" },
      }),
    });
    await jsonRequest(`/api/attempts/${attemptId}/teaching/flow-map`, {
      method: "PATCH",
      body: JSON.stringify({
        response: {
          checked: "front-to-db",
          activeRecall: "用户把草稿交给前端，最后由数据库留下可恢复记录。",
        },
        completed: true,
      }),
    });

    const recallsResult = await jsonRequest("/api/learning-recalls");
    expect(recallsResult.response.status).toBe(200);
    expect(recallsResult.body.recalls).toEqual([
      {
        scenarioId: "canvas-save-persistence",
        stepId: "flow-map",
        activeRecall: "用户把草稿交给前端，最后由数据库留下可恢复记录。",
        updatedAt: expect.any(String),
      },
    ]);
    expect(JSON.stringify(recallsResult.body)).not.toContain("checked");

    const backupResult = await jsonRequest("/api/learning-backup");
    expect(backupResult.response.status).toBe(200);
    expect(backupResult.body.format).toBe("code-quest-learning-backup");
    expect(JSON.stringify(backupResult.body)).not.toContain("/Users/");

    const restoreDb = openDatabase(":memory:");
    const restoreServer = createLearningServer(restoreDb);
    restoreServer.listen(0, "127.0.0.1");
    await once(restoreServer, "listening");
    const restoreAddress = restoreServer.address() as AddressInfo;
    const restoreBaseUrl = `http://127.0.0.1:${restoreAddress.port}`;

    try {
      const imported = await fetch(
        `${restoreBaseUrl}/api/learning-backup/import`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ backup: backupResult.body }),
        },
      );
      expect(imported.status).toBe(200);

      const restored = await fetch(
        `${restoreBaseUrl}/api/attempts/${attemptId}`,
      );
      const restoredBody = (await restored.json()) as ApiBody;
      expect(restored.status).toBe(200);
      expect(
        restoredBody.steps?.["interview-dossier"].response[
          "chapter-1-phenomenon"
        ],
      ).toBe("刷新后记录消失");

      const restoredTeaching = await fetch(
        `${restoreBaseUrl}/api/attempts/${attemptId}/teaching`,
      );
      expect(await restoredTeaching.json()).toEqual([
        expect.objectContaining({
          stepId: "flow-map",
          completed: true,
          teachingResponse: {
            checked: "front-to-db",
            activeRecall: "用户把草稿交给前端，最后由数据库留下可恢复记录。",
          },
        }),
      ]);

      await fetch(
        `${restoreBaseUrl}/api/attempts/${attemptId}/steps/agent-brief`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            response: { text: "这条记录不在备份里，恢复时必须被删除" },
          }),
        },
      );

      const reimported = await fetch(
        `${restoreBaseUrl}/api/learning-backup/import`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ backup: backupResult.body }),
        },
      );
      expect(reimported.status).toBe(200);

      const restoredAgain = await fetch(
        `${restoreBaseUrl}/api/attempts/${attemptId}`,
      );
      const restoredAgainBody = (await restoredAgain.json()) as ApiBody;
      expect(restoredAgainBody.steps?.["agent-brief"]).toBeUndefined();
    } finally {
      restoreServer.close();
      await once(restoreServer, "close");
      restoreDb.close();
    }
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

  it("注册第 2 章 CanvasStorm 产品链路沙盒材料", async () => {
    const created = await jsonRequest("/api/attempts", {
      method: "POST",
      body: JSON.stringify({ scenarioId: "canvasstorm-product-brief" }),
    });
    expect(created.response.status).toBe(201);

    const scenario = await jsonRequest(
      "/api/scenarios/canvasstorm-product-brief",
    );
    expect(scenario.response.status).toBe(200);
    expect(JSON.stringify(scenario.body)).toContain("Project Brief 表单");
    expect(JSON.stringify(scenario.body)).toContain("产品规划逻辑");
    expect(JSON.stringify(scenario.body)).not.toContain("/Users/");

    const invalidStep = await jsonRequest(
      `/api/attempts/${String(created.body.id)}/steps/practical-fix`,
      {
        method: "PATCH",
        body: JSON.stringify({ response: { plan: "错误复用第一章步骤" } }),
      },
    );
    expect(invalidStep.response.status).toBe(400);
    expect(invalidStep.body.error).toBe("UNKNOWN_STEP");
  });

  it("延迟复测 API 返回门禁状态并拒绝提前开始", async () => {
    const initial = await jsonRequest(
      "/api/transfer-retests/canvas-save-persistence",
    );
    expect(initial.response.status).toBe(200);
    expect(initial.body).toEqual(
      expect.objectContaining({
        scenarioId: "avatar-persistence-retest",
        status: "prerequisite",
        delayHours: 24,
      }),
    );

    const blocked = await jsonRequest(
      "/api/transfer-retests/canvas-save-persistence/start",
      { method: "POST", body: "{}" },
    );
    expect(blocked.response.status).toBe(400);
    expect(blocked.body.error).toBe("TRANSFER_PREREQUISITE_REQUIRED");

    const source = await jsonRequest("/api/attempts", {
      method: "POST",
      body: JSON.stringify({ scenarioId: "canvas-save-persistence" }),
    });
    db.prepare(
      `UPDATE attempts SET status = 'submitted', submitted_at = ? WHERE id = ?`,
    ).run(
      new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString(),
      String(source.body.id),
    );

    const available = await jsonRequest(
      "/api/transfer-retests/canvas-save-persistence",
    );
    expect(available.body.status).toBe("available");

    const started = await jsonRequest(
      "/api/transfer-retests/canvas-save-persistence/start",
      { method: "POST", body: "{}" },
    );
    expect(started.response.status).toBe(201);
    expect(started.body.scenarioId).toBe("avatar-persistence-retest");

    const scenario = await jsonRequest(
      "/api/scenarios/avatar-persistence-retest",
    );
    expect(scenario.response.status).toBe(200);
    expect(JSON.stringify(scenario.body)).toContain("头像数据访问层");
    expect(JSON.stringify(scenario.body)).not.toContain("/Users/");
  });

  it("第 2 章延迟复测换成会议助手业务与独立证物", async () => {
    const initial = await jsonRequest(
      "/api/transfer-retests/canvasstorm-product-brief",
    );
    expect(initial.body).toEqual(
      expect.objectContaining({
        scenarioId: "meeting-assistant-retest",
        status: "prerequisite",
        delayHours: 24,
      }),
    );

    const source = await jsonRequest("/api/attempts", {
      method: "POST",
      body: JSON.stringify({ scenarioId: "canvasstorm-product-brief" }),
    });
    db.prepare(
      `UPDATE attempts SET status = 'submitted', submitted_at = ? WHERE id = ?`,
    ).run(
      new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString(),
      String(source.body.id),
    );

    const started = await jsonRequest(
      "/api/transfer-retests/canvasstorm-product-brief/start",
      { method: "POST", body: "{}" },
    );
    expect(started.response.status).toBe(201);
    expect(started.body.scenarioId).toBe("meeting-assistant-retest");

    const scenario = await jsonRequest(
      "/api/scenarios/meeting-assistant-retest",
    );
    const serialized = JSON.stringify(scenario.body);
    expect(scenario.response.status).toBe(200);
    expect(serialized).toContain("会议助手候选规划器");
    expect(serialized).toContain("刷新后的会话证据");
    expect(serialized).not.toContain("/Users/");
  });

  it("第 3 章延迟复测换成客服夜班业务与重启证物", async () => {
    const initial = await jsonRequest(
      "/api/transfer-retests/identity-session-corridor",
    );
    expect(initial.body).toEqual(
      expect.objectContaining({
        scenarioId: "support-shift-session-retest",
        status: "prerequisite",
        delayHours: 24,
      }),
    );

    const source = await jsonRequest("/api/attempts", {
      method: "POST",
      body: JSON.stringify({ scenarioId: "identity-session-corridor" }),
    });
    db.prepare(
      `UPDATE attempts SET status = 'submitted', submitted_at = ? WHERE id = ?`,
    ).run(
      new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString(),
      String(source.body.id),
    );

    const started = await jsonRequest(
      "/api/transfer-retests/identity-session-corridor/start",
      { method: "POST", body: "{}" },
    );
    expect(started.response.status).toBe(201);
    expect(started.body.scenarioId).toBe("support-shift-session-retest");

    const scenario = await jsonRequest(
      "/api/scenarios/support-shift-session-retest",
    );
    const serialized = JSON.stringify(scenario.body);
    expect(scenario.response.status).toBe(200);
    expect(serialized).toContain("刷新会话仓库");
    expect(serialized).toContain("重启后的续期请求");
    expect(serialized).toContain("Agent 初步交付说明");
    expect(serialized).not.toContain("/Users/");
  });

  it("第 4 章延迟复测换成模型限流业务与跨层证物", async () => {
    const initial = await jsonRequest("/api/transfer-retests/api-error-court");
    expect(initial.body).toEqual(
      expect.objectContaining({
        scenarioId: "model-rate-limit-retest",
        status: "prerequisite",
        delayHours: 24,
      }),
    );

    const source = await jsonRequest("/api/attempts", {
      method: "POST",
      body: JSON.stringify({ scenarioId: "api-error-court" }),
    });
    db.prepare(
      `UPDATE attempts SET status = 'submitted', submitted_at = ? WHERE id = ?`,
    ).run(
      new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString(),
      String(source.body.id),
    );

    const started = await jsonRequest(
      "/api/transfer-retests/api-error-court/start",
      { method: "POST", body: "{}" },
    );
    expect(started.response.status).toBe(201);
    expect(started.body.scenarioId).toBe("model-rate-limit-retest");

    const scenario = await jsonRequest(
      "/api/scenarios/model-rate-limit-retest",
    );
    const serialized = JSON.stringify(scenario.body);
    expect(scenario.response.status).toBe(200);
    expect(serialized).toContain("浏览器合法请求");
    expect(serialized).toContain("模型供应商 429 响应");
    expect(serialized).toContain("模型限流处理约定");
    expect(serialized).not.toContain("/Users/");
  });

  it("第 5 章延迟复测换成双 Worker RAG 索引并发现场", async () => {
    const initial = await jsonRequest(
      "/api/transfer-retests/data-consistency-forge",
    );
    expect(initial.body).toEqual(
      expect.objectContaining({
        scenarioId: "rag-index-concurrency-retest",
        status: "prerequisite",
        delayHours: 24,
      }),
    );

    const source = await jsonRequest("/api/attempts", {
      method: "POST",
      body: JSON.stringify({ scenarioId: "data-consistency-forge" }),
    });
    db.prepare(
      `UPDATE attempts SET status = 'submitted', submitted_at = ? WHERE id = ?`,
    ).run(
      new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString(),
      String(source.body.id),
    );

    const started = await jsonRequest(
      "/api/transfer-retests/data-consistency-forge/start",
      { method: "POST", body: "{}" },
    );
    expect(started.response.status).toBe(201);
    expect(started.body.scenarioId).toBe("rag-index-concurrency-retest");

    const scenario = await jsonRequest(
      "/api/scenarios/rag-index-concurrency-retest",
    );
    const serialized = JSON.stringify(scenario.body);
    expect(scenario.response.status).toBe(200);
    expect(serialized).toContain("单次上传 Network");
    expect(serialized).toContain("双 Worker 竞争时间线");
    expect(serialized).toContain("索引任务与 Chunk 表结构");
    expect(serialized).not.toContain("/Users/");
  });

  it("第 6 章延迟复测换成 AI 晨报首字性能现场", async () => {
    const initial = await jsonRequest(
      "/api/transfer-retests/performance-fog-lab",
    );
    expect(initial.body).toEqual(
      expect.objectContaining({
        scenarioId: "ai-briefing-latency-retest",
        status: "prerequisite",
        delayHours: 24,
      }),
    );

    const source = await jsonRequest("/api/attempts", {
      method: "POST",
      body: JSON.stringify({ scenarioId: "performance-fog-lab" }),
    });
    db.prepare(
      `UPDATE attempts SET status = 'submitted', submitted_at = ? WHERE id = ?`,
    ).run(
      new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString(),
      String(source.body.id),
    );

    const started = await jsonRequest(
      "/api/transfer-retests/performance-fog-lab/start",
      { method: "POST", body: "{}" },
    );
    expect(started.response.status).toBe(201);
    expect(started.body.scenarioId).toBe("ai-briefing-latency-retest");

    const scenario = await jsonRequest(
      "/api/scenarios/ai-briefing-latency-retest",
    );
    const serialized = JSON.stringify(scenario.body);
    expect(scenario.response.status).toBe(200);
    expect(serialized).toContain("首次打开 Network");
    expect(serialized).toContain("服务端耗时分段");
    expect(serialized).toContain("第二次打开对照");
    expect(serialized).not.toContain("/Users/");
  });

  it("第 7 章延迟复测换成模型密钥轮换安全现场", async () => {
    const initial = await jsonRequest("/api/transfer-retests/ai-api-key-vault");
    expect(initial.body).toEqual(
      expect.objectContaining({
        scenarioId: "model-key-rotation-retest",
        status: "prerequisite",
        delayHours: 24,
      }),
    );

    const source = await jsonRequest("/api/attempts", {
      method: "POST",
      body: JSON.stringify({ scenarioId: "ai-api-key-vault" }),
    });
    db.prepare(
      `UPDATE attempts SET status = 'submitted', submitted_at = ? WHERE id = ?`,
    ).run(
      new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString(),
      String(source.body.id),
    );

    const started = await jsonRequest(
      "/api/transfer-retests/ai-api-key-vault/start",
      { method: "POST", body: "{}" },
    );
    expect(started.response.status).toBe(201);
    expect(started.body.scenarioId).toBe("model-key-rotation-retest");

    const scenario = await jsonRequest(
      "/api/scenarios/model-key-rotation-retest",
    );
    const serialized = JSON.stringify(scenario.body);
    expect(scenario.response.status).toBe(200);
    expect(serialized).toContain("浏览器 Network 密钥扫描");
    expect(serialized).toContain("服务端环境变量检查");
    expect(serialized).toContain("模型供应商响应");
    expect(serialized).not.toContain("/Users/");
  });

  it("第 8 章延迟复测换成引用可验证回答现场", async () => {
    const initial = await jsonRequest(
      "/api/transfer-retests/hallucination-mirror-hall",
    );
    expect(initial.body).toEqual(
      expect.objectContaining({
        scenarioId: "citation-grounding-retest",
        status: "prerequisite",
        delayHours: 24,
      }),
    );

    const source = await jsonRequest("/api/attempts", {
      method: "POST",
      body: JSON.stringify({ scenarioId: "hallucination-mirror-hall" }),
    });
    db.prepare(
      `UPDATE attempts SET status = 'submitted', submitted_at = ? WHERE id = ?`,
    ).run(
      new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString(),
      String(source.body.id),
    );

    const started = await jsonRequest(
      "/api/transfer-retests/hallucination-mirror-hall/start",
      { method: "POST", body: "{}" },
    );
    expect(started.response.status).toBe(201);
    expect(started.body.scenarioId).toBe("citation-grounding-retest");

    const scenario = await jsonRequest(
      "/api/scenarios/citation-grounding-retest",
    );
    const serialized = JSON.stringify(scenario.body);
    expect(scenario.response.status).toBe(200);
    expect(serialized).toContain("模型回答与引用");
    expect(serialized).toContain("允许引用的退款资料");
    expect(serialized).toContain("引用命中校验");
    expect(serialized).not.toContain("/Users/");
  });

  it("第 9 章延迟复测换成 RAG 检索版本错配现场", async () => {
    const initial = await jsonRequest(
      "/api/transfer-retests/rag-knowledge-maze",
    );
    expect(initial.body).toEqual(
      expect.objectContaining({
        scenarioId: "retrieval-mismatch-retest",
        status: "prerequisite",
        delayHours: 24,
      }),
    );

    const source = await jsonRequest("/api/attempts", {
      method: "POST",
      body: JSON.stringify({ scenarioId: "rag-knowledge-maze" }),
    });
    db.prepare(
      `UPDATE attempts SET status = 'submitted', submitted_at = ? WHERE id = ?`,
    ).run(
      new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString(),
      String(source.body.id),
    );

    const started = await jsonRequest(
      "/api/transfer-retests/rag-knowledge-maze/start",
      { method: "POST", body: "{}" },
    );
    expect(started.response.status).toBe(201);
    expect(started.body.scenarioId).toBe("retrieval-mismatch-retest");

    const scenario = await jsonRequest(
      "/api/scenarios/retrieval-mismatch-retest",
    );
    const serialized = JSON.stringify(scenario.body);
    expect(scenario.response.status).toBe(200);
    expect(serialized).toContain("新旧文档 Chunk 来源");
    expect(serialized).toContain("TopK 检索命中列表");
    expect(serialized).toContain("带引用的错误回答");
    expect(serialized).not.toContain("/Users/");
  });

  it("第 2 章按自己的必填步骤结算，不再复用第 1 章步骤", async () => {
    const created = await jsonRequest("/api/attempts", {
      method: "POST",
      body: JSON.stringify({ scenarioId: "canvasstorm-product-brief" }),
    });
    const attemptId = String(created.body.id);
    db.prepare(
      "UPDATE attempts SET verification_status = 'passed' WHERE id = ?",
    ).run(attemptId);

    await jsonRequest(`/api/attempts/${attemptId}/steps/product-brief`, {
      method: "PATCH",
      body: JSON.stringify({ response: { text: "Brief 已说明目标和约束" } }),
    });

    const incomplete = await jsonRequest(`/api/attempts/${attemptId}/submit`, {
      method: "POST",
      body: "{}",
    });
    expect(incomplete.response.status).toBe(400);
    expect(incomplete.body.error).toBe("INCOMPLETE_ATTEMPT");
    expect(String(incomplete.body.message)).toContain("仍缺少 4 项学习证据");

    for (const stepId of [
      "candidate-direction",
      "agent-brief",
      "delivery-review",
      "interview-dossier",
    ]) {
      await jsonRequest(`/api/attempts/${attemptId}/steps/${stepId}`, {
        method: "PATCH",
        body: JSON.stringify({ response: { text: `${stepId} 证据已记录` } }),
      });
    }

    const submitted = await jsonRequest(`/api/attempts/${attemptId}/submit`, {
      method: "POST",
      body: "{}",
    });
    expect(submitted.response.status).toBe(200);
    expect(submitted.body.status).toBe("submitted");

    const evidence = await jsonRequest("/api/evidence");
    expect(JSON.stringify(evidence.body)).toContain("product");
    expect(JSON.stringify(evidence.body)).toContain("ai-application");
    expect(JSON.stringify(evidence.body)).toContain("agent-brief");
    expect(JSON.stringify(evidence.body)).not.toContain("database");
  });

  it("注册第 3 章登录态身份回廊沙盒材料", async () => {
    const created = await jsonRequest("/api/attempts", {
      method: "POST",
      body: JSON.stringify({ scenarioId: "identity-session-corridor" }),
    });
    expect(created.response.status).toBe(201);

    const scenario = await jsonRequest(
      "/api/scenarios/identity-session-corridor",
    );
    expect(scenario.response.status).toBe(200);
    expect(JSON.stringify(scenario.body)).toContain("登录状态入口");
    expect(JSON.stringify(scenario.body)).toContain("身份会话守卫");
    expect(JSON.stringify(scenario.body)).toContain("/api/me 401 记录");
    expect(JSON.stringify(scenario.body)).not.toContain("/Users/");

    const invalidStep = await jsonRequest(
      `/api/attempts/${String(created.body.id)}/steps/product-brief`,
      {
        method: "PATCH",
        body: JSON.stringify({ response: { plan: "错误复用第二章步骤" } }),
      },
    );
    expect(invalidStep.response.status).toBe(400);
    expect(invalidStep.body.error).toBe("UNKNOWN_STEP");
  });

  it("注册第 4 章接口审判庭沙盒材料", async () => {
    const created = await jsonRequest("/api/attempts", {
      method: "POST",
      body: JSON.stringify({ scenarioId: "api-error-court" }),
    });
    expect(created.response.status).toBe(201);

    const scenario = await jsonRequest("/api/scenarios/api-error-court");
    expect(scenario.response.status).toBe(200);
    expect(JSON.stringify(scenario.body)).toContain("Project Brief 提交按钮");
    expect(JSON.stringify(scenario.body)).toContain("接口处理与校验");
    expect(JSON.stringify(scenario.body)).toContain("错误 500 响应");
    expect(JSON.stringify(scenario.body)).not.toContain("/Users/");

    const invalidStep = await jsonRequest(
      `/api/attempts/${String(created.body.id)}/steps/credential-storage`,
      {
        method: "PATCH",
        body: JSON.stringify({ response: { plan: "错误复用第三章步骤" } }),
      },
    );
    expect(invalidStep.response.status).toBe(400);
    expect(invalidStep.body.error).toBe("UNKNOWN_STEP");
  });

  it("注册第 5 章一致性熔炉沙盒材料", async () => {
    const created = await jsonRequest("/api/attempts", {
      method: "POST",
      body: JSON.stringify({ scenarioId: "data-consistency-forge" }),
    });
    expect(created.response.status).toBe(201);

    const scenario = await jsonRequest("/api/scenarios/data-consistency-forge");
    expect(scenario.response.status).toBe(200);
    expect(JSON.stringify(scenario.body)).toContain("重复提交保存按钮");
    expect(JSON.stringify(scenario.body)).toContain("草稿保存数据层");
    expect(JSON.stringify(scenario.body)).toContain("重复写入后的数据库");
    expect(JSON.stringify(scenario.body)).not.toContain("/Users/");

    const invalidStep = await jsonRequest(
      `/api/attempts/${String(created.body.id)}/steps/error-shape`,
      {
        method: "PATCH",
        body: JSON.stringify({ response: { plan: "错误复用第四章步骤" } }),
      },
    );
    expect(invalidStep.response.status).toBe(400);
    expect(invalidStep.body.error).toBe("UNKNOWN_STEP");
  });

  it("注册第 6 章慢速迷雾性能沙盒材料", async () => {
    const created = await jsonRequest("/api/attempts", {
      method: "POST",
      body: JSON.stringify({ scenarioId: "performance-fog-lab" }),
    });
    expect(created.response.status).toBe(201);

    const scenario = await jsonRequest("/api/scenarios/performance-fog-lab");
    expect(scenario.response.status).toBe(200);
    expect(JSON.stringify(scenario.body)).toContain("慢速项目列表");
    expect(JSON.stringify(scenario.body)).toContain("首屏 Network 瀑布图");
    expect(JSON.stringify(scenario.body)).toContain("缓存复测记录");
    expect(JSON.stringify(scenario.body)).not.toContain("/Users/");

    const invalidStep = await jsonRequest(
      `/api/attempts/${String(created.body.id)}/steps/transaction-boundary`,
      {
        method: "PATCH",
        body: JSON.stringify({ response: { plan: "错误复用第五章步骤" } }),
      },
    );
    expect(invalidStep.response.status).toBe(400);
    expect(invalidStep.body.error).toBe("UNKNOWN_STEP");
  });

  it("注册第 7 章模型熔炉 AI API 沙盒材料", async () => {
    const created = await jsonRequest("/api/attempts", {
      method: "POST",
      body: JSON.stringify({ scenarioId: "ai-api-key-vault" }),
    });
    expect(created.response.status).toBe(201);

    const scenario = await jsonRequest("/api/scenarios/ai-api-key-vault");
    expect(scenario.response.status).toBe(200);
    expect(JSON.stringify(scenario.body)).toContain("AI 聊天前端面板");
    expect(JSON.stringify(scenario.body)).toContain("前端密钥扫描");
    expect(JSON.stringify(scenario.body)).toContain("流式响应追踪");
    expect(JSON.stringify(scenario.body)).not.toContain("/Users/");

    const invalidStep = await jsonRequest(
      `/api/attempts/${String(created.body.id)}/steps/cache-retest`,
      {
        method: "PATCH",
        body: JSON.stringify({ response: { plan: "错误复用第六章步骤" } }),
      },
    );
    expect(invalidStep.response.status).toBe(400);
    expect(invalidStep.body.error).toBe("UNKNOWN_STEP");
  });

  it("注册第 8 章幻觉镜厅可验证回答沙盒材料", async () => {
    const created = await jsonRequest("/api/attempts", {
      method: "POST",
      body: JSON.stringify({ scenarioId: "hallucination-mirror-hall" }),
    });
    expect(created.response.status).toBe(201);

    const scenario = await jsonRequest(
      "/api/scenarios/hallucination-mirror-hall",
    );
    expect(scenario.response.status).toBe(200);
    expect(JSON.stringify(scenario.body)).toContain("可验证回答前端");
    expect(JSON.stringify(scenario.body)).toContain("编造引用的模型输出");
    expect(JSON.stringify(scenario.body)).toContain("无资料硬答反例");
    expect(JSON.stringify(scenario.body)).not.toContain("/Users/");

    const invalidStep = await jsonRequest(
      `/api/attempts/${String(created.body.id)}/steps/streaming-response`,
      {
        method: "PATCH",
        body: JSON.stringify({ response: { plan: "错误复用第七章步骤" } }),
      },
    );
    expect(invalidStep.response.status).toBe(400);
    expect(invalidStep.body.error).toBe("UNKNOWN_STEP");
  });

  it("注册第 9 章知识迷宫 RAG 沙盒材料", async () => {
    const created = await jsonRequest("/api/attempts", {
      method: "POST",
      body: JSON.stringify({ scenarioId: "rag-knowledge-maze" }),
    });
    expect(created.response.status).toBe(201);

    const scenario = await jsonRequest("/api/scenarios/rag-knowledge-maze");
    expect(scenario.response.status).toBe(200);
    expect(JSON.stringify(scenario.body)).toContain("RAG 回答前端");
    expect(JSON.stringify(scenario.body)).toContain("错误 chunk 索引");
    expect(JSON.stringify(scenario.body)).toContain("检索命中错误反例");
    expect(JSON.stringify(scenario.body)).not.toContain("/Users/");

    const invalidStep = await jsonRequest(
      `/api/attempts/${String(created.body.id)}/steps/refusal-policy`,
      {
        method: "PATCH",
        body: JSON.stringify({ response: { plan: "错误复用第八章步骤" } }),
      },
    );
    expect(invalidStep.response.status).toBe(400);
    expect(invalidStep.body.error).toBe("UNKNOWN_STEP");
  });

  it("注册第 10 章 Agent 高塔工具调用沙盒材料", async () => {
    const created = await jsonRequest("/api/attempts", {
      method: "POST",
      body: JSON.stringify({ scenarioId: "agent-tool-tower" }),
    });
    expect(created.response.status).toBe(201);

    const scenario = await jsonRequest("/api/scenarios/agent-tool-tower");
    expect(scenario.response.status).toBe(200);
    expect(JSON.stringify(scenario.body)).toContain("Agent 工具控制台");
    expect(JSON.stringify(scenario.body)).toContain("工具注册表");
    expect(JSON.stringify(scenario.body)).toContain("越权调用反例");
    expect(JSON.stringify(scenario.body)).not.toContain("/Users/");

    const invalidStep = await jsonRequest(
      `/api/attempts/${String(created.body.id)}/steps/topk-evidence`,
      {
        method: "PATCH",
        body: JSON.stringify({ response: { plan: "错误复用第九章步骤" } }),
      },
    );
    expect(invalidStep.response.status).toBe(400);
    expect(invalidStep.body.error).toBe("UNKNOWN_STEP");
  });

  it("注册第 11 章验收试炼迁移复测材料", async () => {
    const initial = await jsonRequest(
      "/api/transfer-retests/verification-trial-arena",
    );
    expect(initial.body).toEqual(
      expect.objectContaining({
        scenarioId: "verification-proof-retest",
        status: "prerequisite",
        delayHours: 24,
      }),
    );

    const source = await jsonRequest("/api/attempts", {
      method: "POST",
      body: JSON.stringify({ scenarioId: "verification-trial-arena" }),
    });
    db.prepare(
      `UPDATE attempts SET status = 'submitted', submitted_at = ? WHERE id = ?`,
    ).run(
      new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString(),
      String(source.body.id),
    );

    const started = await jsonRequest(
      "/api/transfer-retests/verification-trial-arena/start",
      { method: "POST", body: "{}" },
    );
    expect(started.response.status).toBe(201);
    expect(started.body.scenarioId).toBe("verification-proof-retest");

    const scenario = await jsonRequest(
      "/api/scenarios/verification-proof-retest",
    );
    const serialized = JSON.stringify(scenario.body);
    expect(scenario.response.status).toBe(200);
    expect(serialized).toContain("旧源码全绿报告");
    expect(serialized).toContain("手动复测报告");
    expect(serialized).toContain("源码指纹日志");
    expect(serialized).not.toContain("/Users/");
  });

  it("注册第 11 章验收试炼场测试证据沙盒材料", async () => {
    const created = await jsonRequest("/api/attempts", {
      method: "POST",
      body: JSON.stringify({ scenarioId: "verification-trial-arena" }),
    });
    expect(created.response.status).toBe(201);

    const scenario = await jsonRequest(
      "/api/scenarios/verification-trial-arena",
    );
    expect(scenario.response.status).toBe(200);
    expect(JSON.stringify(scenario.body)).toContain("验收报告面板");
    expect(JSON.stringify(scenario.body)).toContain("旧问题失败复现报告");
    expect(JSON.stringify(scenario.body)).toContain("过期通过报告");
    expect(JSON.stringify(scenario.body)).not.toContain("/Users/");

    const invalidStep = await jsonRequest(
      `/api/attempts/${String(created.body.id)}/steps/permission-check`,
      {
        method: "PATCH",
        body: JSON.stringify({ response: { plan: "错误复用第十章步骤" } }),
      },
    );
    expect(invalidStep.response.status).toBe(400);
    expect(invalidStep.body.error).toBe("UNKNOWN_STEP");
  });

  it("注册前端第 5 关回归验收沙盒材料，不回退保存画布链路", async () => {
    const created = await jsonRequest("/api/attempts", {
      method: "POST",
      body: JSON.stringify({ scenarioId: "frontend-testing-proof" }),
    });
    expect(created.response.status).toBe(201);

    const scenario = await jsonRequest("/api/scenarios/frontend-testing-proof");
    const serialized = JSON.stringify(scenario.body);

    expect(scenario.response.status).toBe(200);
    expect(serialized).toContain("前端验收报告面板");
    expect(serialized).toContain("旧问题失败复现报告");
    expect(serialized).toContain("前端 Network 复测");
    expect(serialized).toContain("frontend-testing-proof");
    expect(serialized).not.toContain("/api/canvases");
    expect(serialized).not.toContain("canvas-save-persistence");
    expect(serialized).not.toContain("保存画布");
    expect(serialized).not.toContain("验收试炼画布");
    expect(serialized).not.toContain("/Users/");
  });

  it("注册第 12 章 Agent 委托迁移复测材料", async () => {
    const initial = await jsonRequest(
      "/api/transfer-retests/agent-brief-forge",
    );
    expect(initial.body).toEqual(
      expect.objectContaining({
        scenarioId: "brief-contract-retest",
        status: "prerequisite",
        delayHours: 24,
      }),
    );

    const source = await jsonRequest("/api/attempts", {
      method: "POST",
      body: JSON.stringify({ scenarioId: "agent-brief-forge" }),
    });
    db.prepare(
      `UPDATE attempts SET status = 'submitted', submitted_at = ? WHERE id = ?`,
    ).run(
      new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString(),
      String(source.body.id),
    );

    const started = await jsonRequest(
      "/api/transfer-retests/agent-brief-forge/start",
      { method: "POST", body: "{}" },
    );
    expect(started.response.status).toBe(201);
    expect(started.body.scenarioId).toBe("brief-contract-retest");

    const scenario = await jsonRequest("/api/scenarios/brief-contract-retest");
    const serialized = JSON.stringify(scenario.body);
    expect(scenario.response.status).toBe(200);
    expect(serialized).toContain("业务请求背景");
    expect(serialized).toContain("越界委托反例");
    expect(serialized).toContain("委托契约校验器");
    expect(serialized).not.toContain("/Users/");
  });

  it("注册第 12 章委托书工坊 Agent 任务沙盒材料", async () => {
    const created = await jsonRequest("/api/attempts", {
      method: "POST",
      body: JSON.stringify({ scenarioId: "agent-brief-forge" }),
    });
    expect(created.response.status).toBe(201);

    const scenario = await jsonRequest("/api/scenarios/agent-brief-forge");
    expect(scenario.response.status).toBe(200);
    expect(JSON.stringify(scenario.body)).toContain("Agent 委托书编辑器");
    expect(JSON.stringify(scenario.body)).toContain("空泛委托反例");
    expect(JSON.stringify(scenario.body)).toContain("清晰委托样例");
    expect(JSON.stringify(scenario.body)).not.toContain("/Users/");

    const invalidStep = await jsonRequest(
      `/api/attempts/${String(created.body.id)}/steps/regression-risk`,
      {
        method: "PATCH",
        body: JSON.stringify({ response: { plan: "错误复用第十一章步骤" } }),
      },
    );
    expect(invalidStep.response.status).toBe(400);
    expect(invalidStep.body.error).toBe("UNKNOWN_STEP");
  });

  it("注册第 13 章交付审查迁移复测材料", async () => {
    const initial = await jsonRequest(
      "/api/transfer-retests/delivery-review-court",
    );
    expect(initial.body).toEqual(
      expect.objectContaining({
        scenarioId: "review-evidence-retest",
        status: "prerequisite",
        delayHours: 24,
      }),
    );

    const source = await jsonRequest("/api/attempts", {
      method: "POST",
      body: JSON.stringify({ scenarioId: "delivery-review-court" }),
    });
    db.prepare(
      `UPDATE attempts SET status = 'submitted', submitted_at = ? WHERE id = ?`,
    ).run(
      new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString(),
      String(source.body.id),
    );

    const started = await jsonRequest(
      "/api/transfer-retests/delivery-review-court/start",
      { method: "POST", body: "{}" },
    );
    expect(started.response.status).toBe(201);
    expect(started.body.scenarioId).toBe("review-evidence-retest");

    const scenario = await jsonRequest("/api/scenarios/review-evidence-retest");
    const serialized = JSON.stringify(scenario.body);
    expect(scenario.response.status).toBe(200);
    expect(serialized).toContain("过期测试证据");
    expect(serialized).toContain("浏览器验收记录");
    expect(serialized).toContain("拒收决定书");
    expect(serialized).not.toContain("/Users/");
  });

  it("注册第 13 章交付审查庭沙盒材料", async () => {
    const created = await jsonRequest("/api/attempts", {
      method: "POST",
      body: JSON.stringify({ scenarioId: "delivery-review-court" }),
    });
    expect(created.response.status).toBe(201);

    const scenario = await jsonRequest("/api/scenarios/delivery-review-court");
    expect(scenario.response.status).toBe(200);
    expect(JSON.stringify(scenario.body)).toContain("交付审查面板");
    expect(JSON.stringify(scenario.body)).toContain("Diff 范围摘要");
    expect(JSON.stringify(scenario.body)).toContain("拒收决定书");
    expect(JSON.stringify(scenario.body)).not.toContain("/Users/");

    const invalidStep = await jsonRequest(
      `/api/attempts/${String(created.body.id)}/steps/risk-rollback`,
      {
        method: "PATCH",
        body: JSON.stringify({ response: { plan: "错误复用第十二章步骤" } }),
      },
    );
    expect(invalidStep.response.status).toBe(400);
    expect(invalidStep.body.error).toBe("UNKNOWN_STEP");
  });

  it("注册第 14 章上线门禁迁移复测材料", async () => {
    const initial = await jsonRequest(
      "/api/transfer-retests/release-readiness-gate",
    );
    expect(initial.body).toEqual(
      expect.objectContaining({
        scenarioId: "release-proof-retest",
        status: "prerequisite",
        delayHours: 24,
      }),
    );

    const source = await jsonRequest("/api/attempts", {
      method: "POST",
      body: JSON.stringify({ scenarioId: "release-readiness-gate" }),
    });
    db.prepare(
      `UPDATE attempts SET status = 'submitted', submitted_at = ? WHERE id = ?`,
    ).run(
      new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString(),
      String(source.body.id),
    );

    const started = await jsonRequest(
      "/api/transfer-retests/release-readiness-gate/start",
      { method: "POST", body: "{}" },
    );
    expect(started.response.status).toBe(201);
    expect(started.body.scenarioId).toBe("release-proof-retest");

    const scenario = await jsonRequest("/api/scenarios/release-proof-retest");
    const serialized = JSON.stringify(scenario.body);
    expect(scenario.response.status).toBe(200);
    expect(serialized).toContain("备份恢复证据");
    expect(serialized).toContain("390px 冒烟缺口");
    expect(serialized).toContain("回滚方案");
    expect(serialized).not.toContain("/Users/");
  });

  it("注册第 14 章上线前夜门禁沙盒材料", async () => {
    const created = await jsonRequest("/api/attempts", {
      method: "POST",
      body: JSON.stringify({ scenarioId: "release-readiness-gate" }),
    });
    expect(created.response.status).toBe(201);

    const scenario = await jsonRequest("/api/scenarios/release-readiness-gate");
    expect(scenario.response.status).toBe(200);
    expect(JSON.stringify(scenario.body)).toContain("上线门禁面板");
    expect(JSON.stringify(scenario.body)).toContain("生产环境变量检查");
    expect(JSON.stringify(scenario.body)).toContain("回滚方案草稿");
    expect(JSON.stringify(scenario.body)).not.toContain("/Users/");

    const invalidStep = await jsonRequest(
      `/api/attempts/${String(created.body.id)}/steps/diff-scope`,
      {
        method: "PATCH",
        body: JSON.stringify({ response: { plan: "错误复用第十三章步骤" } }),
      },
    );
    expect(invalidStep.response.status).toBe(400);
    expect(invalidStep.body.error).toBe("UNKNOWN_STEP");
  });

  it("注册第 15 章面试表达迁移复测材料", async () => {
    const initial = await jsonRequest(
      "/api/transfer-retests/interview-answer-forge",
    );
    expect(initial.body).toEqual(
      expect.objectContaining({
        scenarioId: "interview-proof-retest",
        status: "prerequisite",
        delayHours: 24,
      }),
    );

    const source = await jsonRequest("/api/attempts", {
      method: "POST",
      body: JSON.stringify({ scenarioId: "interview-answer-forge" }),
    });
    db.prepare(
      `UPDATE attempts SET status = 'submitted', submitted_at = ? WHERE id = ?`,
    ).run(
      new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString(),
      String(source.body.id),
    );

    const started = await jsonRequest(
      "/api/transfer-retests/interview-answer-forge/start",
      { method: "POST", body: "{}" },
    );
    expect(started.response.status).toBe(201);
    expect(started.body.scenarioId).toBe("interview-proof-retest");

    const scenario = await jsonRequest("/api/scenarios/interview-proof-retest");
    const serialized = JSON.stringify(scenario.body);
    expect(scenario.response.status).toBe(200);
    expect(serialized).toContain("新项目素材库");
    expect(serialized).toContain("技术取舍与代价");
    expect(serialized).toContain("追问演练");
    expect(serialized).not.toContain("/Users/");
  });

  it("注册第 15 章终章答辩沙盒材料", async () => {
    const created = await jsonRequest("/api/attempts", {
      method: "POST",
      body: JSON.stringify({ scenarioId: "interview-answer-forge" }),
    });
    expect(created.response.status).toBe(201);

    const scenario = await jsonRequest("/api/scenarios/interview-answer-forge");
    expect(scenario.response.status).toBe(200);
    expect(JSON.stringify(scenario.body)).toContain("答辩故事板");
    expect(JSON.stringify(scenario.body)).toContain("项目素材库");
    expect(JSON.stringify(scenario.body)).toContain("Agent 面试官追问");
    expect(JSON.stringify(scenario.body)).not.toContain("/Users/");

    const invalidStep = await jsonRequest(
      `/api/attempts/${String(created.body.id)}/steps/smoke-test`,
      {
        method: "PATCH",
        body: JSON.stringify({ response: { plan: "错误复用第十四章步骤" } }),
      },
    );
    expect(invalidStep.response.status).toBe(400);
    expect(invalidStep.body.error).toBe("UNKNOWN_STEP");
  });
});
