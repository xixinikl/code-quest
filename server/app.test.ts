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
        response: { checked: "front-to-db" },
        completed: true,
      }),
    });

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
          teachingResponse: { checked: "front-to-db" },
        }),
      ]);
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
