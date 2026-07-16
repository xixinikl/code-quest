import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import App, {
  CareerDossier,
  getLabConfig,
  Lab,
  VerificationPanel,
} from "./App";
import {
  getTeachingStorySceneImages,
  GuidedCodeTour,
  TeachingBridge,
} from "./TeachingBridge";
import {
  case02Scenario,
  frontendPerformanceProofScenario,
  javaTransactionConsistencyScenario,
  teachingScenario,
} from "./teaching";

const diagnosticActive = {
  id: "diagnostic-001",
  status: "active",
  baseline: {},
};

const diagnosticCompleted = {
  ...diagnosticActive,
  status: "completed",
  baseline: { firstChecks: "先复现并查看 Network" },
};

describe("岗位路线实战场景契约", () => {
  it("AI 主线十五章和岗位路线都具备完整实战九件套", () => {
    const scenarioIds = [
      "canvas-save-persistence",
      "canvasstorm-product-brief",
      "identity-session-corridor",
      "api-error-court",
      "data-consistency-forge",
      "performance-fog-lab",
      "ai-api-key-vault",
      "hallucination-mirror-hall",
      "rag-knowledge-maze",
      "agent-tool-tower",
      "verification-trial-arena",
      "agent-brief-forge",
      "delivery-review-court",
      "release-readiness-gate",
      "interview-answer-forge",
      "java-layered-request",
      "java-transaction-consistency",
      "java-cache-observability",
      "java-release-harbor",
      "java-production-incident",
      "frontend-component-state",
      "frontend-request-states",
      "frontend-performance-proof",
      "frontend-accessibility-proof",
      "frontend-testing-proof",
    ];

    const configs = scenarioIds.map((scenarioId) => getLabConfig(scenarioId));

    expect(configs.map((config) => config.scenarioId)).toEqual(scenarioIds);
    for (const config of configs) {
      expect(config.backgroundImage).toBeTruthy();
      expect(config.flowItems.length).toBeGreaterThanOrEqual(4);
      expect(config.baseline.body).toBeTruthy();
      expect(config.practical.sandboxPath).toMatch(/^sandbox\//);
      expect(config.result.proved).toBeTruthy();
      expect(config.result.recorded).toBeTruthy();
      expect(config.result.nextItems.length).toBeGreaterThanOrEqual(3);
      expect(config.steps.some((step) => step.kind === "verification")).toBe(
        true,
      );
      expect(config.requiredResponseStepIds.length).toBeGreaterThanOrEqual(3);
      expect(
        config.requiredResponseStepIds.every((stepId) =>
          config.steps.some((step) => step.id === stepId),
        ),
      ).toBe(true);
      expect(Object.keys(config.artifactGuides).length).toBeGreaterThanOrEqual(
        4,
      );
    }
  });

  it("每条岗位路线的关卡有独立实战场景，不回退到默认关卡", () => {
    const routeScenes = {
      java: [
        "java-layered-request",
        "java-transaction-consistency",
        "java-cache-observability",
        "java-release-harbor",
        "java-production-incident",
      ],
      frontend: [
        "frontend-component-state",
        "frontend-request-states",
        "frontend-performance-proof",
        "frontend-accessibility-proof",
        "frontend-testing-proof",
      ],
    };

    for (const scenarioIds of Object.values(routeScenes)) {
      const configs = scenarioIds.map((scenarioId) => getLabConfig(scenarioId));
      expect(configs.map((config) => config.scenarioId)).toEqual(scenarioIds);
      expect(
        new Set(configs.map((config) => config.backgroundImage)).size,
      ).toBe(scenarioIds.length);
      expect(configs.every((config) => config.practical.sandboxPath)).toBe(
        true,
      );
    }
  });

  it("Java 事务和前端性能教学桥使用岗位专属角色与地点", async () => {
    const user = userEvent.setup();
    vi.stubGlobal(
      "fetch",
      vi.fn((input: RequestInfo | URL) => {
        const url = String(input);
        if (url.includes("/teaching")) return response([]);
        return response({ error: "NOT_FOUND", message: "unexpected" }, 404);
      }),
    );

    const developer = {
      name: "见习开发者",
      rank: "见习开发者" as const,
      xp: 0,
      missionsCleared: 0,
      clearedChapterIds: [],
      unlockedCompanionNames: [],
      joinedAt: "2026-07-05T00:00:00.000Z",
    };

    const { unmount } = render(
      <TeachingBridge
        attemptId="attempt-java-transaction-scene"
        scenario={javaTransactionConsistencyScenario}
        developer={developer}
        onComplete={vi.fn()}
      />,
    );
    await user.click(await screen.findByRole("button", { name: /开始闯关/ }));
    expect(await screen.findByLabelText("剧情角色")).toHaveTextContent(
      "订单值守官",
    );
    expect(screen.getByLabelText("本章地点航线")).toHaveTextContent(
      "订单锻造台",
    );
    expect(screen.getByLabelText("剧情角色")).toHaveTextContent("订单锻造台");
    expect(
      screen.getByLabelText("剧情角色").querySelector("img"),
    ).toHaveAttribute("src", expect.stringContaining("portrait-api-clerk-v2"));

    unmount();
    render(
      <TeachingBridge
        attemptId="attempt-frontend-performance-scene"
        scenario={frontendPerformanceProofScenario}
        developer={developer}
        onComplete={vi.fn()}
      />,
    );
    await user.click(await screen.findByRole("button", { name: /开始闯关/ }));
    expect(await screen.findByLabelText("剧情角色")).toHaveTextContent(
      "时序领航员",
    );
    expect(screen.getByLabelText("本章地点航线")).toHaveTextContent(
      "首屏计时港",
    );
    expect(screen.getByLabelText("剧情角色")).toHaveTextContent("首屏计时港");
    expect(
      screen.getByLabelText("剧情角色").querySelector("img"),
    ).toHaveAttribute(
      "src",
      expect.stringContaining("portrait-timing-navigator"),
    );
  });

  it("每个剧情关卡的地点都使用不同背景，避免换地点却停在原地", () => {
    const scenarioIds = [
      "canvas-save-persistence",
      "case-002",
      "case-003-login-state",
      "case-004-api-error",
      "case-005-data-consistency",
      "case-006-performance",
      "case-007-ai-api",
      "case-008-hallucination",
      "case-009-rag",
      "case-010-agent-tools",
      "case-011-testing-proof",
      "case-012-agent-brief",
      "case-013-delivery-review",
      "case-014-release-readiness",
      "case-015-interview-review",
      "java-layered-request",
      "java-transaction-consistency",
      "java-cache-observability",
      "java-release-harbor",
      "java-production-incident",
      "frontend-component-state",
      "frontend-request-states",
      "frontend-performance-proof",
      "frontend-accessibility-proof",
      "frontend-testing-proof",
    ];

    for (const scenarioId of scenarioIds) {
      const images = getTeachingStorySceneImages(scenarioId);
      expect(images.length).toBeGreaterThanOrEqual(4);
      expect(new Set(images).size).toBe(images.length);
    }
  });
});

const attempt = {
  id: "attempt-001",
  scenarioId: "canvas-save-persistence",
  status: "active",
  hintLevel: 0,
  verificationStatus: "not_run",
  steps: {},
};

const artifacts = [
  {
    id: "network",
    label: "Network 记录",
    language: "json",
    relativePath: "sandbox/canvas-save-persistence/evidence/network.json",
    content: '{"status":201,"visibleCanvases":[]}',
  },
];

const case02Attempt = {
  ...attempt,
  id: "attempt-case-02",
  scenarioId: "canvasstorm-product-brief",
};

const case03Attempt = {
  ...attempt,
  id: "attempt-case-03",
  scenarioId: "identity-session-corridor",
};

const case04Attempt = {
  ...attempt,
  id: "attempt-case-04",
  scenarioId: "api-error-court",
};

const case05Attempt = {
  ...attempt,
  id: "attempt-case-05",
  scenarioId: "data-consistency-forge",
};

const case06Attempt = {
  ...attempt,
  id: "attempt-case-06",
  scenarioId: "performance-fog-lab",
};

const case07Attempt = {
  ...attempt,
  id: "attempt-case-07",
  scenarioId: "ai-api-key-vault",
};

const case08Attempt = {
  ...attempt,
  id: "attempt-case-08",
  scenarioId: "hallucination-mirror-hall",
};

const case09Attempt = {
  ...attempt,
  id: "attempt-case-09",
  scenarioId: "rag-knowledge-maze",
};

const case10Attempt = {
  ...attempt,
  id: "attempt-case-10",
  scenarioId: "agent-tool-tower",
};

const case11Attempt = {
  ...attempt,
  id: "attempt-case-11",
  scenarioId: "verification-trial-arena",
};

const case12Attempt = {
  ...attempt,
  id: "attempt-case-12",
  scenarioId: "agent-brief-forge",
};

const case13Attempt = {
  ...attempt,
  id: "attempt-case-13",
  scenarioId: "delivery-review-court",
};

const case14Attempt = {
  ...attempt,
  id: "attempt-case-14",
  scenarioId: "release-readiness-gate",
};

const case15Attempt = {
  ...attempt,
  id: "attempt-case-15",
  scenarioId: "interview-answer-forge",
};

const case02Artifacts = [
  {
    id: "frontend",
    label: "Project Brief 表单",
    language: "jsx",
    relativePath:
      "sandbox/canvasstorm-product-brief/frontend/ProjectBriefForm.jsx",
    content: "fetch('/api/storm/brief-plan', { method: 'POST' })",
  },
  {
    id: "planner",
    label: "产品规划逻辑",
    language: "javascript",
    relativePath: "sandbox/canvasstorm-product-brief/server/briefPlanner.js",
    content: "const acceptedCandidates = candidates;",
  },
  {
    id: "delivery",
    label: "Agent 交付说明",
    language: "markdown",
    relativePath:
      "sandbox/canvasstorm-product-brief/evidence/agent-delivery.md",
    content: "POST 返回 200，但未说明为什么增长方案也进入 MVP 草案。",
  },
];

const case03Artifacts = [
  {
    id: "frontend",
    label: "登录状态入口",
    language: "jsx",
    relativePath: "sandbox/identity-session-corridor/frontend/LoginGate.jsx",
    content: "restoreCurrentUser({ browserStorage, serverSessions })",
  },
  {
    id: "session-gateway",
    label: "身份会话守卫",
    language: "javascript",
    relativePath: "sandbox/identity-session-corridor/server/sessionGateway.js",
    content: "browserStorage.memory.currentUser = demoUser;",
  },
  {
    id: "me-401-network",
    label: "/api/me 401 记录",
    language: "json",
    relativePath:
      "sandbox/identity-session-corridor/evidence/network-me-401.json",
    content: '{"status":401,"headers":{"cookie":"","authorization":""}}',
  },
  {
    id: "delivery",
    label: "Agent 交付说明",
    language: "markdown",
    relativePath:
      "sandbox/identity-session-corridor/evidence/agent-delivery.md",
    content: "没有证明登录后写入 Cookie 或其他可刷新恢复的凭证。",
  },
];

const case04Artifacts = [
  {
    id: "frontend",
    label: "Project Brief 提交按钮",
    language: "jsx",
    relativePath: "sandbox/api-error-court/frontend/BriefSubmitButton.jsx",
    content: "setMessage('提交失败，请稍后再试')",
  },
  {
    id: "route",
    label: "接口处理与校验",
    language: "javascript",
    relativePath: "sandbox/api-error-court/server/briefRoutes.js",
    content: "if (!body.userGoal) throw new Error('userGoal is required')",
  },
  {
    id: "wrong-response",
    label: "错误 500 响应",
    language: "json",
    relativePath: "sandbox/api-error-court/evidence/network-500-response.json",
    content: '{"status":500,"expectedShape":{"status":400}}',
  },
  {
    id: "delivery",
    label: "Agent 交付说明",
    language: "markdown",
    relativePath: "sandbox/api-error-court/evidence/agent-delivery.md",
    content: "没有区分 400 参数错误和 500 服务器异常。",
  },
];

const case05Artifacts = [
  {
    id: "frontend",
    label: "重复提交保存按钮",
    language: "jsx",
    relativePath: "sandbox/data-consistency-forge/frontend/SaveDraftButton.jsx",
    content: "headers: { 'Idempotency-Key': idempotencyKey }",
  },
  {
    id: "repository",
    label: "草稿保存数据层",
    language: "javascript",
    relativePath: "sandbox/data-consistency-forge/server/draftRepository.js",
    content: "database.drafts.push(draft)",
  },
  {
    id: "double-submit",
    label: "重复提交 Network 记录",
    language: "json",
    relativePath:
      "sandbox/data-consistency-forge/evidence/network-double-submit.json",
    content: '{"requests":[{"headers":{"Idempotency-Key":"draft-save-abc"}}]}',
  },
  {
    id: "database-after",
    label: "重复写入后的数据库",
    language: "json",
    relativePath: "sandbox/data-consistency-forge/evidence/database-after.json",
    content: "mutation_2026_0705_001",
  },
  {
    id: "delivery",
    label: "Agent 交付说明",
    language: "markdown",
    relativePath: "sandbox/data-consistency-forge/evidence/agent-delivery.md",
    content: "没有证明同一个 Idempotency-Key 只会写一条记录。",
  },
];

const case06Artifacts = [
  {
    id: "frontend",
    label: "慢速项目列表",
    language: "jsx",
    relativePath: "sandbox/performance-fog-lab/frontend/ProjectList.jsx",
    content: "fetch('/api/projects?includeStats=true')",
  },
  {
    id: "performance-service",
    label: "项目列表性能逻辑",
    language: "javascript",
    relativePath: "sandbox/performance-fog-lab/server/projectPerformance.js",
    content: "cache.get('projects:list')",
  },
  {
    id: "waterfall",
    label: "首屏 Network 瀑布图",
    language: "json",
    relativePath: "sandbox/performance-fog-lab/evidence/network-waterfall.json",
    content: '{"ttfbMs":1640,"cache":"MISS"}',
  },
  {
    id: "render-profile",
    label: "前端渲染画像",
    language: "json",
    relativePath: "sandbox/performance-fog-lab/evidence/render-profile.json",
    content: '{"commitMs":1180,"renderedItems":2500}',
  },
  {
    id: "delivery",
    label: "Agent 交付说明",
    language: "markdown",
    relativePath: "sandbox/performance-fog-lab/evidence/agent-delivery.md",
    content: "没有回答最长的是资源、TTFB，还是接口下载。",
  },
];

const case07Artifacts = [
  {
    id: "frontend",
    label: "AI 聊天前端面板",
    language: "jsx",
    relativePath: "sandbox/ai-api-key-vault/frontend/AiChatPanel.jsx",
    content: "const demoApiKey = 'sk-demo-leaked-key-in-browser'",
  },
  {
    id: "gateway",
    label: "AI 服务端转发逻辑",
    language: "javascript",
    relativePath: "sandbox/ai-api-key-vault/server/aiGateway.js",
    content: "request.body?.apiKey || env.AI_API_KEY",
  },
  {
    id: "bundle-scan",
    label: "前端密钥扫描",
    language: "json",
    relativePath: "sandbox/ai-api-key-vault/evidence/frontend-bundle-scan.json",
    content: "sk-demo-leaked-key-in-browser",
  },
  {
    id: "network",
    label: "浏览器 AI 请求记录",
    language: "json",
    relativePath: "sandbox/ai-api-key-vault/evidence/network-chat.json",
    content: "https://api.example.ai/v1/chat",
  },
  {
    id: "stream-trace",
    label: "流式响应追踪",
    language: "json",
    relativePath: "sandbox/ai-api-key-vault/evidence/stream-trace.json",
    content: '{"contentType":"text/event-stream","stream":false}',
  },
  {
    id: "provider-error",
    label: "上游失败响应",
    language: "json",
    relativePath: "sandbox/ai-api-key-vault/evidence/provider-error.json",
    content: "AI_PROVIDER_FAILED",
  },
  {
    id: "delivery",
    label: "Agent 交付说明",
    language: "markdown",
    relativePath: "sandbox/ai-api-key-vault/evidence/agent-delivery.md",
    content: "没有提供前端包扫描结果。",
  },
];

const case08Artifacts = [
  {
    id: "frontend",
    label: "可验证回答前端",
    language: "jsx",
    relativePath:
      "sandbox/hallucination-mirror-hall/frontend/GroundedAnswerPanel.jsx",
    content: "置信度：{answer.confidence || 'unknown'}",
  },
  {
    id: "grounded-answer",
    label: "引用校验服务端逻辑",
    language: "javascript",
    relativePath: "sandbox/hallucination-mirror-hall/server/groundedAnswer.js",
    content: "allowedCitationCount",
  },
  {
    id: "context",
    label: "本轮上下文资料",
    language: "json",
    relativePath:
      "sandbox/hallucination-mirror-hall/evidence/context-chunks.json",
    content: "没有任何自动发布信息",
  },
  {
    id: "unsupported-answer",
    label: "编造引用的模型输出",
    language: "json",
    relativePath:
      "sandbox/hallucination-mirror-hall/evidence/model-answer-unsupported.json",
    content: "deploy#auto 不在本轮 context 里",
  },
  {
    id: "no-context-answer",
    label: "无资料硬答反例",
    language: "json",
    relativePath:
      "sandbox/hallucination-mirror-hall/evidence/no-context-answer.json",
    content: "资料不足，无法确认",
  },
  {
    id: "network",
    label: "可验证回答 Network 记录",
    language: "json",
    relativePath:
      "sandbox/hallucination-mirror-hall/evidence/network-grounded-answer.json",
    content: "allowedCitationCount",
  },
  {
    id: "delivery",
    label: "Agent 交付说明",
    language: "markdown",
    relativePath:
      "sandbox/hallucination-mirror-hall/evidence/agent-delivery.md",
    content: "没有证明 citation 是否真的来自本轮 context。",
  },
];

const case09Artifacts = [
  {
    id: "frontend",
    label: "RAG 回答前端",
    language: "jsx",
    relativePath: "sandbox/rag-knowledge-maze/frontend/RagAnswerPanel.jsx",
    content: "没有渲染 matches/sourcePath",
  },
  {
    id: "rag-engine",
    label: "RAG 检索服务端逻辑",
    language: "javascript",
    relativePath: "sandbox/rag-knowledge-maze/server/ragEngine.js",
    content: "index.slice(0, topK)",
  },
  {
    id: "source-docs",
    label: "原始知识库资料",
    language: "json",
    relativePath: "sandbox/rag-knowledge-maze/evidence/source-docs.json",
    content: "docs/project-brief.md",
  },
  {
    id: "chunk-index",
    label: "错误 chunk 索引",
    language: "json",
    relativePath: "sandbox/rag-knowledge-maze/evidence/chunk-index.json",
    content: "missing: ['sourcePath', 'title', 'stable citation id']",
  },
  {
    id: "search-miss",
    label: "检索命中错误反例",
    language: "json",
    relativePath: "sandbox/rag-knowledge-maze/evidence/search-miss.json",
    content: "expectedTop1: doc-brief#chunk-1",
  },
  {
    id: "network",
    label: "RAG 回答 Network 记录",
    language: "json",
    relativePath: "sandbox/rag-knowledge-maze/evidence/network-rag-answer.json",
    content: "matches: []",
  },
  {
    id: "logs",
    label: "知识迷宫后端日志",
    language: "log",
    relativePath: "sandbox/rag-knowledge-maze/evidence/backend.log",
    content: "strategy=slice-first",
  },
  {
    id: "delivery",
    label: "Agent 交付说明",
    language: "markdown",
    relativePath: "sandbox/rag-knowledge-maze/evidence/agent-delivery.md",
    content: "没有证明四件事",
  },
];

const case10Artifacts = [
  {
    id: "frontend",
    label: "Agent 工具控制台",
    language: "jsx",
    relativePath: "sandbox/agent-tool-tower/frontend/AgentToolConsole.jsx",
    content: "没有区分 PERMISSION_DENIED，也没有 requestId 提示",
  },
  {
    id: "tool-executor",
    label: "Agent 工具注册与执行器",
    language: "javascript",
    relativePath: "sandbox/agent-tool-tower/server/agentTools.js",
    content: "const data = tool.run(args || {}, context)",
  },
  {
    id: "registry",
    label: "工具注册表",
    language: "json",
    relativePath: "sandbox/agent-tool-tower/evidence/tool-registry.json",
    content: "searchProjectDocs docs:read updateProjectStatus project:write",
  },
  {
    id: "network",
    label: "工具调用 Network 记录",
    language: "json",
    relativePath: "sandbox/agent-tool-tower/evidence/network-tool-call.json",
    content: "status=shipped 不在允许枚举里，但 ok=true",
  },
  {
    id: "permission",
    label: "越权调用反例",
    language: "json",
    relativePath: "sandbox/agent-tool-tower/evidence/permission-denied.json",
    content: "user_apprentice docs:read updateProjectStatus PERMISSION_DENIED",
  },
  {
    id: "failure",
    label: "工具失败回退反例",
    language: "json",
    relativePath: "sandbox/agent-tool-tower/evidence/tool-failure.json",
    content: "database connection refused TOOL_FAILED requestId req_tool_001",
  },
  {
    id: "logs",
    label: "Agent 高塔后端日志",
    language: "log",
    relativePath: "sandbox/agent-tool-tower/evidence/backend.log",
    content: "validation=skipped permission=skipped leaked_to_client=true",
  },
  {
    id: "delivery",
    label: "Agent 交付说明",
    language: "markdown",
    relativePath: "sandbox/agent-tool-tower/evidence/agent-delivery.md",
    content: "没有证明五件事：schema、权限、失败回退、审计和边界",
  },
];

const case11Artifacts = [
  {
    id: "frontend",
    label: "验收报告面板",
    language: "jsx",
    relativePath:
      "sandbox/verification-trial-arena/frontend/VerificationReportPanel.jsx",
    content: "accepted tests manualReport",
  },
  {
    id: "report-validator",
    label: "验收报告校验器",
    language: "javascript",
    relativePath:
      "sandbox/verification-trial-arena/server/verificationReport.js",
    content: "ok: true code: VERIFIED Agent 已提供通过报告",
  },
  {
    id: "failing-before",
    label: "旧问题失败复现报告",
    language: "json",
    relativePath:
      "sandbox/verification-trial-arena/evidence/failing-before.json",
    content: "before-fix failed 刷新页面后，GET /api/canvases 返回空数组",
  },
  {
    id: "passing-stale",
    label: "过期通过报告",
    language: "json",
    relativePath:
      "sandbox/verification-trial-arena/evidence/passing-after-stale.json",
    content: "old_source_hash_from_before_latest_change passed 3",
  },
  {
    id: "network",
    label: "保存链路 Network 复测",
    language: "json",
    relativePath:
      "sandbox/verification-trial-arena/evidence/network-test-run.json",
    content: "POST /api/canvases status 201 GET /api/canvases status 200",
  },
  {
    id: "manual-report",
    label: "手动复测报告",
    language: "markdown",
    relativePath: "sandbox/verification-trial-arena/evidence/manual-report.md",
    content: "刷新后，画布仍然存在 只测了单用户保存",
  },
  {
    id: "logs",
    label: "验收试炼后端日志",
    language: "log",
    relativePath: "sandbox/verification-trial-arena/evidence/backend.log",
    content:
      "sourceHash=old_source_hash_from_before_latest_change currentHash=runtime_hash_mismatch",
  },
  {
    id: "delivery",
    label: "Agent 交付说明",
    language: "markdown",
    relativePath: "sandbox/verification-trial-arena/evidence/agent-delivery.md",
    content: "测试全部通过，可以合并 风险：暂无 没有展示失败复现",
  },
];

const case12Artifacts = [
  {
    id: "frontend",
    label: "Agent 委托书编辑器",
    language: "jsx",
    relativePath: "sandbox/agent-brief-forge/frontend/AgentBriefEditor.jsx",
    content: "context goal constraints acceptance",
  },
  {
    id: "brief-validator",
    label: "委托书校验器",
    language: "javascript",
    relativePath: "sandbox/agent-brief-forge/server/briefValidator.js",
    content: "wordCount < 80 READY_FOR_AGENT 完成后告诉我结果",
  },
  {
    id: "vague-brief",
    label: "空泛委托反例",
    language: "json",
    relativePath: "sandbox/agent-brief-forge/evidence/vague-brief.json",
    content: "帮我优化一下项目 做得更好看、更专业 你看着办",
  },
  {
    id: "unsafe-brief",
    label: "越界委托反例",
    language: "json",
    relativePath: "sandbox/agent-brief-forge/evidence/unsafe-brief.json",
    content: "可以读取任何项目 可以运行任意终端命令 risks: []",
  },
  {
    id: "clear-brief",
    label: "清晰委托样例",
    language: "json",
    relativePath: "sandbox/agent-brief-forge/evidence/clear-brief.json",
    content: "现象：第 12 章只有剧情教学 browserPath 验证证据",
  },
  {
    id: "network",
    label: "Agent 任务提交 Network 记录",
    language: "json",
    relativePath:
      "sandbox/agent-brief-forge/evidence/network-agent-request.json",
    content: "status: 422 MISSING_ACCEPTANCE 任务缺少可执行验收标准",
  },
  {
    id: "logs",
    label: "委托书工坊后端日志",
    language: "log",
    relativePath: "sandbox/agent-brief-forge/evidence/backend.log",
    content: "code=MISSING_ACCEPTANCE code=MISSING_RISK_PLAN brief accepted",
  },
  {
    id: "delivery",
    label: "Agent 交付说明",
    language: "markdown",
    relativePath: "sandbox/agent-brief-forge/evidence/agent-delivery.md",
    content: "摘要 验证证据 风险 后续 当前只是种子沙盒",
  },
];

const case13Artifacts = [
  {
    id: "frontend",
    label: "交付审查面板",
    language: "jsx",
    relativePath:
      "sandbox/delivery-review-court/frontend/DeliveryReviewPanel.jsx",
    content: "review?.accepted 需要补证 delivery.summary",
  },
  {
    id: "reviewer",
    label: "交付审查器",
    language: "javascript",
    relativePath: "sandbox/delivery-review-court/server/deliveryReview.js",
    content: 'delivery.summary failed === 0 decision: "accept"',
  },
  {
    id: "delivery-note",
    label: "Agent 交付说明",
    language: "markdown",
    relativePath: "sandbox/delivery-review-court/evidence/agent-delivery.md",
    content: "测试通过，可以接收 npm run test 风险：暂无",
  },
  {
    id: "diff-summary",
    label: "Diff 范围摘要",
    language: "json",
    relativePath: "sandbox/delivery-review-court/evidence/diff-summary.json",
    content: "allowedPaths src/game.ts 不在本章允许范围",
  },
  {
    id: "test-evidence",
    label: "过期测试证据",
    language: "json",
    relativePath: "sandbox/delivery-review-court/evidence/test-evidence.json",
    content: "sourceHash old_delivery_review_hash failed: 0 npm run verify",
  },
  {
    id: "browser-checks",
    label: "浏览器验收记录",
    language: "json",
    relativePath: "sandbox/delivery-review-court/evidence/browser-checks.json",
    content: "1280px desktop-refresh 缺少 390px",
  },
  {
    id: "docs-sync",
    label: "文档同步缺口",
    language: "json",
    relativePath: "sandbox/delivery-review-court/evidence/docs-sync.json",
    content: "README.md HANDOFF.md docs/ai-career-rpg-tasks.md missing",
  },
  {
    id: "logs",
    label: "交付审查后端日志",
    language: "log",
    relativePath: "sandbox/delivery-review-court/evidence/backend.log",
    content:
      "OUT_OF_SCOPE_DIFF STALE_TEST_EVIDENCE MISSING_MOBILE_CHECK MISSING_DOC_SYNC",
  },
  {
    id: "decision",
    label: "拒收决定书",
    language: "markdown",
    relativePath: "sandbox/delivery-review-court/evidence/review-decision.md",
    content: "要求补证，不接收 src/game.ts 390px 移动端路径",
  },
];

const case14Artifacts = [
  {
    id: "frontend",
    label: "上线门禁面板",
    language: "jsx",
    relativePath:
      "sandbox/release-readiness-gate/frontend/ReleaseGatePanel.jsx",
    content: "可以放行 暂缓上线 requestedEvidence release.name",
  },
  {
    id: "release-gate",
    label: "上线门禁校验器",
    language: "javascript",
    relativePath: "sandbox/release-readiness-gate/server/releaseGate.js",
    content: 'build?.status === "passed" smokeTest?.passed decision: "release"',
  },
  {
    id: "release-plan",
    label: "上线计划草稿",
    language: "json",
    relativePath: "sandbox/release-readiness-gate/evidence/release-plan.json",
    content: "2026-07-05 22:00-23:00 owner observer smokePath",
  },
  {
    id: "environment",
    label: "生产环境变量检查",
    language: "json",
    relativePath:
      "sandbox/release-readiness-gate/evidence/environment-check.json",
    content: "AI_API_KEY missing frontendBundleContainsSecret false",
  },
  {
    id: "backup",
    label: "备份与恢复记录",
    language: "json",
    relativePath: "sandbox/release-readiness-gate/evidence/backup-record.json",
    content: "requiresBackup backup_release_014 restoreTested false",
  },
  {
    id: "smoke-test",
    label: "冒烟测试记录",
    language: "json",
    relativePath: "sandbox/release-readiness-gate/evidence/smoke-test.json",
    content: "1280px desktop-refresh 390px 移动端路径 登录后保存主路径",
  },
  {
    id: "monitoring",
    label: "上线监控快照",
    language: "json",
    relativePath:
      "sandbox/release-readiness-gate/evidence/monitoring-snapshot.json",
    content: "errorRate p95LatencyMs saveSuccessRate 缺少 AI 调用失败率",
  },
  {
    id: "rollback",
    label: "回滚方案草稿",
    language: "markdown",
    relativePath: "sandbox/release-readiness-gate/evidence/rollback-plan.md",
    content: "没有量化触发条件 没有说明回滚步骤 没有写回滚后验证路径",
  },
  {
    id: "logs",
    label: "上线门禁后端日志",
    language: "log",
    relativePath: "sandbox/release-readiness-gate/evidence/backend.log",
    content:
      "MISSING_RELEASE_OWNER MISSING_ENV_VAR UNVERIFIED_BACKUP_RESTORE MISSING_MOBILE_SMOKE MISSING_MONITORING_SIGNAL MISSING_ROLLBACK_PLAN",
  },
  {
    id: "delivery",
    label: "Agent 交付说明",
    language: "markdown",
    relativePath: "sandbox/release-readiness-gate/evidence/agent-delivery.md",
    content: "构建通过，可以上线 npm run verify 风险：暂无",
  },
];

const case15Artifacts = [
  {
    id: "frontend",
    label: "答辩故事板",
    language: "jsx",
    relativePath:
      "sandbox/interview-answer-forge/frontend/InterviewStoryBoard.jsx",
    content: "answer.opening requestedRevisions missing.map",
  },
  {
    id: "reviewer",
    label: "面试稿校验器",
    language: "javascript",
    relativePath: "sandbox/interview-answer-forge/server/interviewAnswer.js",
    content: 'answer.opening ?? "" length > 80 requestedRevisions: []',
  },
  {
    id: "story-bank",
    label: "项目素材库",
    language: "json",
    relativePath: "sandbox/interview-answer-forge/evidence/story-bank.json",
    content: "Network POST 201 SQLite SELECT 0 rows Diff 范围摘要",
  },
  {
    id: "star-draft",
    label: "STAR 草稿",
    language: "json",
    relativePath: "sandbox/interview-answer-forge/evidence/star-draft.json",
    content: '已经完全掌握 "result": "" 缺少可验证结果',
  },
  {
    id: "incident-review",
    label: "故障复盘草稿",
    language: "json",
    relativePath:
      "sandbox/interview-answer-forge/evidence/incident-review.json",
    content: 'POST 返回 201 数据库查询是 0 rows "verification": ""',
  },
  {
    id: "tradeoff",
    label: "技术取舍笔记",
    language: "json",
    relativePath: "sandbox/interview-answer-forge/evidence/tradeoff-notes.json",
    content: '前端直接调模型 API 服务端代理模型 API "cost": ""',
  },
  {
    id: "follow-ups",
    label: "追问演练清单",
    language: "json",
    relativePath:
      "sandbox/interview-answer-forge/evidence/follow-up-questions.json",
    content: "为什么 201 不能证明数据落库？ 如果 RAG 引用错了怎么办？",
  },
  {
    id: "rubric",
    label: "答辩验收 Rubric",
    language: "json",
    relativePath: "sandbox/interview-answer-forge/evidence/answer-rubric.json",
    content: "STAR 四段完整 至少两个项目证据 不夸大真人学习效果",
  },
  {
    id: "agent-interviewer",
    label: "Agent 面试官追问",
    language: "markdown",
    relativePath:
      "sandbox/interview-answer-forge/evidence/agent-interviewer.md",
    content: "怎么证明不是只改了提示文案？ 什么情况下你会拒收？ 什么时候回滚？",
  },
  {
    id: "logs",
    label: "答辩厅后端日志",
    language: "log",
    relativePath: "sandbox/interview-answer-forge/evidence/backend.log",
    content:
      "MISSING_STAR_SECTION MISSING_PROJECT_EVIDENCE INCOMPLETE_INCIDENT_REVIEW MISSING_TRADEOFF MISSING_FOLLOW_UPS OVERCLAIMED_LEARNING_RESULT",
  },
];

function response(body: unknown, status = 200) {
  return Promise.resolve(
    new Response(JSON.stringify(body), {
      status,
      headers: { "Content-Type": "application/json" },
    }),
  );
}

async function enterMainQuest(user: ReturnType<typeof userEvent.setup>) {
  await screen.findByRole("heading", { name: /码上冒险/ }, { timeout: 3000 });
  expect(screen.getByText(/代码城失去了记忆/)).toBeInTheDocument();
  expect(screen.getByRole("img", { name: "档案馆记录员" })).toBeInTheDocument();

  await user.click(screen.getByRole("button", { name: /走进档案馆/ }));
  await user.click(screen.getByRole("button", { name: /调取现场证据/ }));
  expect(screen.getByText(/真正的调试师/)).toBeInTheDocument();

  await user.click(screen.getByRole("button", { name: /领取委托/ }));
  expect(screen.getAllByText(/15 章/).length).toBeGreaterThan(0);
  expect(
    screen.getByText("点击章节查看卷宗；只有当前章节可以进入实战。"),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: /AI 应用开发.*可进入/ }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: /Java 后端.*可进入/ }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: /前端工程.*可进入/ }),
  ).toBeInTheDocument();
  const sharedCoreTrail = screen.getByRole("region", {
    name: /跨岗位核心能力/,
  });
  expect(sharedCoreTrail).toHaveTextContent("7 项可迁移工程能力");
  expect(sharedCoreTrail).toHaveTextContent("读懂项目");
  expect(sharedCoreTrail).toHaveTextContent("验收交付");
  await user.click(screen.getByRole("button", { name: /Java 后端.*可进入/ }));
  expect(
    screen.getAllByText(/规划路线：让用户能读懂后端服务/).length,
  ).toBeGreaterThan(0);
  expect(screen.getByText("5 章")).toBeInTheDocument();
  expect(screen.getAllByText(/事务熔炉|事务和锁/).length).toBeGreaterThan(0);
  expect(screen.getByLabelText("路线状态")).toHaveTextContent("下一章");
  const lockedRouteSummary = screen.getByRole("region", {
    name: /当前路线目标/,
  });
  expect(lockedRouteSummary).toHaveTextContent("从请求、业务、数据到上线");
  expect(
    screen.getByRole("button", { name: /进入第 1 章教学关卡/ }),
  ).toBeInTheDocument();
  await user.click(screen.getByRole("button", { name: /AI 应用开发.*可进入/ }));
  expect(screen.getAllByText(/找回消失的登录状态/).length).toBeGreaterThan(0);
  expect(screen.getAllByText(/安全接入 AI API/).length).toBeGreaterThan(0);
  expect(screen.getByText(/让资料进入 AI 回答/)).toBeInTheDocument();
  expect(screen.getByText(/把项目经历讲成面试回答/)).toBeInTheDocument();
  const firstChapterDossier = screen.getByRole("region", {
    name: /选中章节卷宗/,
  });
  expect(firstChapterDossier).toHaveTextContent("第 1 章现场：数据断层");
  expect(firstChapterDossier).toHaveTextContent(
    "交接物：POST /api/canvases + 草稿 JSON",
  );
  expect(firstChapterDossier).toHaveTextContent("交接物：INSERT 写入动作");
  expect(firstChapterDossier).toHaveTextContent(
    "收到「POST /api/canvases + 草稿 JSON」",
  );
  const secondMapNode = screen.getByRole("button", {
    name: /2产品密室待练习/,
  });
  expect(secondMapNode).toHaveAttribute("aria-pressed", "false");
  await user.click(secondMapNode);
  expect(
    screen.getByRole("region", { name: /选中章节卷宗/ }),
  ).toHaveTextContent("第 2 章现场：产品密室");
  expect(secondMapNode).toHaveAttribute("aria-pressed", "true");
  expect(secondMapNode).toHaveClass("selected");
  const evidenceDrawer = within(firstChapterDossier)
    .getByText(/展开“谁把什么交给谁”/)
    .closest("details");
  const workDrawer = within(firstChapterDossier)
    .getByText(/展开代码、证据与面试资料/)
    .closest("details");
  expect(evidenceDrawer).not.toHaveAttribute("open");
  expect(workDrawer).not.toHaveAttribute("open");
  await user.click(
    screen.getByRole("button", { name: /第 2 章 · AI 点子为什么空泛/ }),
  );
  expect(screen.getByAltText("传送门书记官")).toHaveAttribute(
    "src",
    expect.stringContaining("portrait-portal-scribe-v2"),
  );
  await user.click(
    screen.getByRole("button", { name: /第 3 章 · 登录状态为什么丢/ }),
  );
  expect(screen.getByText(/身份回廊的门牌一刷新就掉落/)).toBeInTheDocument();
  expect(screen.getByText(/登录表单 → 后端校验/)).toBeInTheDocument();
  expect(
    screen.getByRole("region", { name: /选中章节卷宗/ }),
  ).toHaveTextContent("交接物：Token 或 Set-Cookie");
  expect(screen.getByText(/Application、Network/)).toBeInTheDocument();
  expect(screen.getAllByText(/当前委托/).length).toBeGreaterThan(0);
  expect(screen.getByText(/下一章主线：第 1 章/)).toBeInTheDocument();
  expect(
    screen.getByRole("region", { name: /下一章主线/ }),
  ).toBeInTheDocument();
  expect(screen.getByText(/为什么要去/)).toBeInTheDocument();
  expect(screen.getAllByText(/谁把什么交给谁/).length).toBeGreaterThan(0);
  expect(screen.getByText(/通关产出/)).toBeInTheDocument();
  expect(
    screen.getAllByText(/用户 → 前端页面 → 后端接口/).length,
  ).toBeGreaterThan(0);
  expect(screen.getByText(/只需要完成这一章的证据链/)).toBeInTheDocument();
  expect(screen.getByText(/成长契约/)).toBeInTheDocument();
  expect(screen.getByText(/当前身份/)).toBeInTheDocument();
  expect(screen.getByText(/下一位可解锁：档案馆记录员/)).toBeInTheDocument();
  expect(screen.getByAltText("档案馆记录员")).toBeInTheDocument();
  expect(screen.getByText(/先记住你在哪里：数据断层/)).toBeInTheDocument();
  expect(
    document.querySelector(".visual-novel")?.getAttribute("style"),
  ).toContain("quest-archive");
  expect(screen.queryByRole("region", { name: /伙伴背包/ })).toBeNull();
  await user.click(screen.getByRole("button", { name: /伙伴图鉴/ }));
  expect(screen.getAllByText(/伙伴图鉴/).length).toBeGreaterThan(0);
  expect(screen.getByText(/收集角色、宠物与装备/)).toBeInTheDocument();
  expect(screen.getByText(/伙伴背包/)).toBeInTheDocument();
  expect(screen.getByText(/已收集能力 0\/15/)).toBeInTheDocument();
  expect(
    screen.getByRole("combobox", { name: /选择伙伴或收藏物/ }),
  ).toBeInTheDocument();
  expect(screen.getAllByText(/能力印记/).length).toBeGreaterThan(0);
  expect(screen.getAllByText(/面试复盘/).length).toBeGreaterThan(0);
  expect(
    screen.queryByRole("region", { name: /选中章节卷宗/ }),
  ).not.toBeInTheDocument();
  await user.click(
    screen.getByRole("button", { name: /第 2 章 · 宠物.*灵感萤火/ }),
  );
  expect(screen.getByAltText("灵感萤火")).toHaveAttribute(
    "src",
    expect.stringContaining("pet-inspiration-glow-v2"),
  );
  await user.selectOptions(
    screen.getByRole("combobox", { name: /选择伙伴或收藏物/ }),
    "9",
  );
  expect(screen.getByAltText("检索狐")).toHaveAttribute(
    "src",
    expect.stringContaining("pet-retrieval-fox-v2"),
  );
  await user.click(screen.getByRole("button", { name: /面试复盘/ }));
  expect(screen.getAllByText(/面试复盘册/).length).toBeGreaterThan(0);
  expect(screen.getAllByText(/现象/).length).toBeGreaterThan(0);
  expect(screen.getAllByText(/定位证据/).length).toBeGreaterThan(0);
  expect(screen.getAllByText(/行动\/修改/).length).toBeGreaterThan(0);
  expect(screen.getAllByText(/验证动作/).length).toBeGreaterThan(0);
  expect(screen.getAllByText(/可迁移经验/).length).toBeGreaterThan(0);
  expect(
    screen.getByRole("button", { name: /进入复盘房间/ }),
  ).toBeInTheDocument();
  expect(
    screen.queryByRole("region", { name: /选中章节卷宗/ }),
  ).not.toBeInTheDocument();

  await user.click(screen.getByRole("button", { name: /当前委托/ }));
  expect(
    screen.getByRole("region", { name: /选中章节卷宗/ }),
  ).toBeInTheDocument();

  await user.click(
    screen.getByRole("button", { name: /第 5 章 · 数据为什么重复/ }),
  );
  expect(screen.getByText(/一致性熔炉被连敲三下/)).toBeInTheDocument();
  expect(screen.getByText(/唯一索引、提交按钮锁定/)).toBeInTheDocument();
  expect(screen.getByText(/连续点击、刷新重试和并发请求/)).toBeInTheDocument();

  await user.click(screen.getByRole("button", { name: /进入当前委托/ }));
}

afterEach(() => {
  vi.unstubAllGlobals();
  localStorage.clear();
  window.history.replaceState(null, "", "/");
});

describe("AI 职业路线入口", () => {
  it("启动连接本地学习记录时显示统一的暗色状态屏内容", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() => new Promise(() => undefined)),
    );

    render(<App />);

    expect(screen.getByText("码上冒险")).toBeInTheDocument();
    expect(screen.getByText("AI CAREER RPG")).toBeInTheDocument();
    expect(screen.getByText(/正在连接本地学习记录/)).toBeInTheDocument();
  });

  it("岗位路线大厅的当前委托和后续地图不会串回 AI 十五章", async () => {
    const user = userEvent.setup();
    vi.stubGlobal(
      "fetch",
      vi.fn((input: RequestInfo | URL) => {
        const url = String(input);
        if (url === "/api/health") return response({ status: "ok" });
        if (url === "/api/diagnostic-sessions") {
          return response(diagnosticActive, 201);
        }
        if (url.includes("/teaching")) return response([]);
        return response({ error: "NOT_FOUND", message: "unexpected" }, 404);
      }),
    );

    render(<App />);

    await screen.findByRole("heading", { name: /码上冒险/ }, { timeout: 3000 });
    await user.click(screen.getByRole("button", { name: /走进档案馆/ }));
    await user.click(screen.getByRole("button", { name: /调取现场证据/ }));
    await user.click(screen.getByRole("button", { name: /领取委托/ }));

    await user.click(screen.getByRole("button", { name: /Java 后端.*可进入/ }));
    expect(screen.getByText(/Java 后端成长主线/)).toBeInTheDocument();
    expect(screen.getByText(/不需要一次吃下全部 5 章/)).toBeInTheDocument();
    expect(screen.getByText(/查看第 2 至 5 章/)).toBeInTheDocument();
    expect(screen.getByLabelText("Java 后端世界地图")).toHaveTextContent(
      "事故回声塔",
    );
    expect(screen.queryByText(/查看第 2 至 15 章/)).toBeNull();
    expect(screen.queryByText("面试议会")).toBeNull();
    const javaMap = screen.getByLabelText("Java 后端世界地图");
    for (const [nodeName, dossierText] of [
      [/2事务熔炉待练习/, "第 2 章现场：事务熔炉"],
      [/3缓存风廊待练习/, "第 3 章现场：缓存风廊"],
      [/4服务上线港待练习/, "第 4 章现场：服务上线港"],
      [/5事故回声塔待练习/, "第 5 章现场：事故回声塔"],
    ] as const) {
      await user.click(within(javaMap).getByRole("button", { name: nodeName }));
      const javaDossier = screen.getByRole("region", {
        name: /选中章节卷宗/,
      });
      expect(javaDossier).toHaveTextContent(dossierText);
      expect(javaDossier).not.toHaveTextContent("产品密室");
      expect(javaDossier).not.toHaveTextContent("面试议会");
    }

    await user.click(screen.getByRole("button", { name: /前端工程.*可进入/ }));
    expect(screen.getByText(/前端工程成长主线/)).toBeInTheDocument();
    expect(screen.getByText(/不需要一次吃下全部 5 章/)).toBeInTheDocument();
    expect(screen.getByText(/查看第 2 至 5 章/)).toBeInTheDocument();
    expect(screen.getByLabelText("前端工程世界地图")).toHaveTextContent(
      "回归试炼场",
    );
    expect(screen.queryByText(/查看第 2 至 15 章/)).toBeNull();
    expect(screen.queryByText("面试议会")).toBeNull();
    const frontendMap = screen.getByLabelText("前端工程世界地图");
    for (const [nodeName, dossierText] of [
      [/2表单传送厅待练习/, "第 2 章现场：表单传送厅"],
      [/3首屏观测塔待练习/, "第 3 章现场：首屏观测塔"],
      [/4无障碍交付庭待练习/, "第 4 章现场：无障碍交付庭"],
      [/5回归试炼场待练习/, "第 5 章现场：回归试炼场"],
    ] as const) {
      await user.click(
        within(frontendMap).getByRole("button", { name: nodeName }),
      );
      const frontendDossier = screen.getByRole("region", {
        name: /选中章节卷宗/,
      });
      expect(frontendDossier).toHaveTextContent(dossierText);
      expect(frontendDossier).not.toHaveTextContent("产品密室");
      expect(frontendDossier).not.toHaveTextContent("面试议会");
    }
  });

  it.each([
    {
      hash: "#chapter-java-2",
      scenarioId: "java-transaction-consistency",
      title: /事务熔炉：两张表不能只成功一张/,
      routeText: /最后用失败复测证明系统没有留下半成品/,
      routePrefix: /Java 后端成长路线 · Java 后端 · 第 2 关/,
      forbiddenText: /AI 点子为什么会空泛/,
    },
    {
      hash: "#chapter-frontend-4",
      scenarioId: "frontend-accessibility-proof",
      title: /无障碍交付庭：漂亮的页面是否真的可用/,
      routeText: /键盘操作、读屏反馈、焦点可见性和 390px 移动端回归/,
      routePrefix: /前端工程成长路线 · 前端工程 · 第 4 关/,
      forbiddenText: /事务熔炉：两张表不能只成功一张/,
    },
  ])(
    "岗位章节深链 $hash 直接进入对应 TeachingBridge，不跳回 AI 主线",
    async ({
      hash,
      scenarioId,
      title,
      routeText,
      routePrefix,
      forbiddenText,
    }) => {
      window.history.replaceState(null, "", `/${hash}`);
      const fetchMock = vi.fn(
        (input: RequestInfo | URL, init?: RequestInit) => {
          const url = String(input);
          if (url === "/api/health") return response({ status: "ok" });
          if (url === "/api/diagnostic-sessions") {
            return response(diagnosticActive, 201);
          }
          if (url === "/api/diagnostic-sessions/diagnostic-001") {
            return response(diagnosticCompleted);
          }
          if (url === "/api/attempts" && init?.method === "POST") {
            const body = JSON.parse(String(init.body ?? "{}")) as {
              scenarioId?: string;
            };
            return response(
              {
                ...attempt,
                id: `attempt-${body.scenarioId ?? "unknown"}`,
                scenarioId: body.scenarioId ?? "canvas-save-persistence",
              },
              201,
            );
          }
          if (url === `/api/scenarios/${scenarioId}`) {
            return response({ scenarioId, artifacts });
          }
          if (url.includes("/teaching")) return response([]);
          return response({ error: "NOT_FOUND", message: "unexpected" }, 404);
        },
      );
      vi.stubGlobal("fetch", fetchMock);

      render(<App />);

      expect(
        await screen.findByRole("heading", { name: title }, { timeout: 3000 }),
      ).toBeInTheDocument();
      expect(screen.getByText(routeText)).toBeInTheDocument();
      expect(screen.getByText(routePrefix)).toBeInTheDocument();
      expect(screen.queryByText(/AI 开发主线 ·/)).not.toBeInTheDocument();
      expect(screen.queryByText(forbiddenText)).not.toBeInTheDocument();
      expect(fetchMock).toHaveBeenCalledWith(
        `/api/scenarios/${scenarioId}`,
        expect.any(Object),
      );
    },
  );

  it("当前委托会根据成长档案推进到下一章主线", async () => {
    const user = userEvent.setup();
    localStorage.setItem(
      "codequest_developer",
      JSON.stringify({
        name: "见习开发者",
        xp: 150,
        rank: "AI 应用学徒",
        missionsCleared: 1,
        clearedChapterIds: ["1"],
        unlockedCompanionNames: ["档案馆记录员"],
        joinedAt: "2026-07-05T00:00:00.000Z",
      }),
    );
    vi.stubGlobal(
      "fetch",
      vi.fn((input: RequestInfo | URL) => {
        const url = String(input);
        if (url === "/api/health") return response({ status: "ok" });
        if (url === "/api/diagnostic-sessions") {
          return response(diagnosticActive, 201);
        }
        if (url === "/api/diagnostic-sessions/diagnostic-001") {
          return response(diagnosticCompleted);
        }
        if (url.includes("/teaching")) return response([]);
        return response({ error: "NOT_FOUND", message: "unexpected" }, 404);
      }),
    );

    render(<App />);

    await screen.findByRole(
      "heading",
      { name: /欢迎归队，AI 应用学徒/ },
      { timeout: 3000 },
    );
    expect(screen.queryByRole("button", { name: /走进档案馆/ })).toBeNull();
    expect(screen.getByAltText("传送门书记官")).toBeInTheDocument();
    expect(screen.getByText(/第 2 章卷宗已在产品密室展开/)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /继续第 2 章委托/ }));

    expect(screen.getByLabelText("路线状态")).toHaveTextContent("02");
    expect(screen.getByLabelText("路线状态")).toHaveTextContent("下一章");
    expect(screen.getByText(/下一章主线：第 2 章/)).toBeInTheDocument();
    expect(screen.getByLabelText("当前主线追踪")).toHaveTextContent("冒险日志");
    expect(screen.getByLabelText("当前主线追踪")).toHaveTextContent(
      "通关后写入成长档案",
    );
    expect(screen.getAllByText(/AI 点子为什么空泛/).length).toBeGreaterThan(0);
    expect(
      screen.getAllByText(/创意工坊里冒出一堆 AI 点子/).length,
    ).toBeGreaterThan(0);
    expect(screen.getAllByText(/用户目标 → Brief/).length).toBeGreaterThan(0);
    expect(screen.getByText(/解锁奖励：宠物 · 灵感萤火/)).toBeInTheDocument();
    expect(screen.getAllByAltText("传送门书记官").length).toBeGreaterThan(0);
    expect(screen.getByText(/先记住你在哪里：产品密室/)).toBeInTheDocument();
    expect(
      document.querySelector(".visual-novel")?.getAttribute("style"),
    ).toContain("quest-workbench");
    expect(
      screen.getByRole("region", { name: /选中章节卷宗/ }),
    ).toHaveTextContent("第 2 章现场：产品密室");
    expect(
      screen.getByRole("button", { name: /进入第 2 章主线/ }),
    ).toBeInTheDocument();
  });

  it("十五章全部通关后进入职业授勋状态，不再把第十五章显示成下一章", async () => {
    const user = userEvent.setup();
    localStorage.setItem(
      "codequest_developer",
      JSON.stringify({
        name: "见习开发者",
        xp: 1170,
        rank: "AI 工程新星",
        missionsCleared: 15,
        clearedChapterIds: Array.from({ length: 15 }, (_, index) =>
          String(index + 1),
        ),
        unlockedCompanionNames: [
          "档案馆记录员",
          "灵感萤火",
          "回廊守卫",
          "审判庭书记员",
          "幂等石灵",
          "雾灯猫",
          "密钥匣",
          "镜厅校对师",
          "检索狐",
          "塔楼副官",
          "验收试炼官",
          "委托书锻造师",
          "交付审查官",
          "上线守门人",
          "终章答辩官",
        ],
        joinedAt: "2026-07-05T00:00:00.000Z",
      }),
    );
    vi.stubGlobal(
      "fetch",
      vi.fn((input: RequestInfo | URL) => {
        const url = String(input);
        if (url === "/api/health") return response({ status: "ok" });
        if (url === "/api/diagnostic-sessions") {
          return response(diagnosticActive, 201);
        }
        if (url.includes("/teaching")) return response([]);
        return response({ error: "NOT_FOUND", message: "unexpected" }, 404);
      }),
    );

    render(<App />);

    await screen.findByRole(
      "heading",
      { name: /欢迎归队，AI 应用工程师/ },
      { timeout: 3000 },
    );
    expect(screen.getByAltText("终章答辩官")).toBeInTheDocument();
    expect(screen.getByText(/十五章证据已经归档/)).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /走进档案馆/ })).toBeNull();
    await user.click(screen.getByRole("button", { name: /打开职业档案/ }));

    const routeStatus = screen.getByLabelText("路线状态");
    expect(routeStatus).toHaveTextContent("15/15");
    expect(routeStatus).toHaveTextContent("主线完成");
    expect(
      screen.getByRole("region", { name: "AI 工程主线结业授勋" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: /AI 工程主线完成，真正的独立训练从这里开始/,
      }),
    ).toBeInTheDocument();
    expect(screen.queryByText(/下一章主线：第 15 章/)).toBeNull();
    expect(screen.queryByRole("region", { name: "下一章主线" })).toBeNull();
    expect(
      screen.getByRole("button", { name: /整理面试复盘/ }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /打开面试作品集/ }),
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText("AI 应用开发世界地图").querySelectorAll(".solved"),
    ).toHaveLength(15);

    await user.click(screen.getByRole("button", { name: /整理面试复盘/ }));
    expect(screen.getByLabelText("面试复盘册")).toBeInTheDocument();
  });

  it("代码导读会把关键行翻译成新手能懂的流程和证据边界", async () => {
    const user = userEvent.setup();
    const firstCodeStep = case02Scenario.steps.find(
      (step) => step.id === "c2-tour-brief",
    );
    expect(firstCodeStep).toBeDefined();

    render(
      <GuidedCodeTour
        step={firstCodeStep!}
        stepIndex={0}
        totalSteps={3}
        onComplete={vi.fn()}
        onRemediation={vi.fn()}
      />,
    );

    expect(screen.getByText(/这一棒/)).toBeInTheDocument();
    expect(screen.getByText(/入口/)).toBeInTheDocument();
    expect(screen.getByText(/出口/)).toBeInTheDocument();
    expect(screen.getByAltText("传送门书记官")).toBeInTheDocument();
    expect(screen.getByText(/产品链路带读官/)).toBeInTheDocument();
    expect(screen.getByLabelText("本页导师台词")).toHaveTextContent(
      "传送门书记官",
    );
    expect(screen.getByText(/剧情里的交接镜头/)).toBeInTheDocument();
    expect(
      screen.getAllByText(/用户输入 → Brief 表单状态/).length,
    ).toBeGreaterThan(0);
    expect(screen.getByText(/逐行翻译/)).toBeInTheDocument();
    expect(screen.getByText(/先看人话，再看语法/)).toBeInTheDocument();
    expect(screen.getByLabelText("谁把什么交给谁")).toHaveTextContent(
      "用户输入",
    );
    expect(screen.getByLabelText("谁把什么交给谁")).toHaveTextContent(
      "生成候选请求",
    );
    expect(screen.getByText(/当前代码处理后/)).toBeInTheDocument();
    expect(screen.getAllByLabelText("读码交接单")).toHaveLength(1);
    expect(screen.getByText("收到")).toBeInTheDocument();
    expect(screen.getByText("动作")).toBeInTheDocument();
    expect(screen.getByText("交出")).toBeInTheDocument();
    expect(screen.getByText("证明")).toBeInTheDocument();
    expect(screen.getByText(/把分散的信息装进一个对象/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "下一行" })).toBeEnabled();
    await user.click(screen.getByRole("button", { name: "下一行" }));
    await user.click(screen.getByRole("button", { name: "下一行" }));
    await user.click(screen.getByRole("button", { name: "下一行" }));
    await user.click(screen.getByRole("button", { name: "下一行" }));
    expect(
      screen.getByText(/调用「onBriefChange」，把「brief」交给上一层或下一棒/),
    ).toBeInTheDocument();
    expect(
      screen.queryByText(/这一行负责把当前这棒的材料继续加工/),
    ).not.toBeInTheDocument();
    expect(screen.getByText("能证明")).toBeInTheDocument();
    expect(screen.getByText("不能证明")).toBeInTheDocument();
    expect(screen.getByText("交给 Agent")).toBeInTheDocument();
    expect(
      screen.getByText(/还要继续看 Network、后端日志、数据库记录或测试结果/),
    ).toBeInTheDocument();
    expect(screen.getByText(/请只围绕/)).toBeInTheDocument();
  });

  it("第一章代码导读会使用档案馆记录员带读保存链路", async () => {
    const firstCodeStep = teachingScenario.steps.find((step) => step.codeFocus);
    expect(firstCodeStep).toBeDefined();

    render(
      <GuidedCodeTour
        step={firstCodeStep!}
        stepIndex={0}
        totalSteps={3}
        onComplete={vi.fn()}
        onRemediation={vi.fn()}
      />,
    );

    const user = userEvent.setup();
    expect(screen.getByAltText("档案馆记录员")).toBeInTheDocument();
    expect(screen.getByText(/代码证据带读官/)).toBeInTheDocument();
    expect(screen.getAllByText(/上一棒交来/).length).toBeGreaterThan(0);
    for (let index = 0; index < 6; index += 1) {
      await user.click(screen.getByRole("button", { name: "下一行" }));
    }
    expect(screen.getByText(/判断这次接口回信是否成功/)).toBeInTheDocument();
    expect(screen.getByText(/不能证明数据库已保存/)).toBeInTheDocument();
  });

  it("教学进度只统计当前章节步骤并封顶 100%", async () => {
    const progressScenario = {
      ...case02Scenario,
      scenarioId: "progress-capping-test",
    };
    vi.stubGlobal(
      "fetch",
      vi.fn((input: RequestInfo | URL) => {
        const url = String(input);
        if (url === "/api/attempts/attempt-progress/teaching") {
          return response([
            ...case02Scenario.steps.map((step) => ({
              stepId: step.id,
              completed: true,
              teachingResponse: {},
              remediationEvents: [],
              updatedAt: "2026-07-05T00:00:00.000Z",
            })),
            {
              stepId: "old-story-scene",
              completed: true,
              teachingResponse: {},
              remediationEvents: [],
              updatedAt: "2026-07-05T00:00:00.000Z",
            },
          ]);
        }
        return response({ error: "NOT_FOUND", message: "unexpected" }, 404);
      }),
    );

    render(
      <TeachingBridge
        attemptId="attempt-progress"
        scenario={progressScenario}
        developer={{
          name: "见习开发者",
          rank: "见习开发者",
          xp: 0,
          missionsCleared: 0,
          clearedChapterIds: [],
          unlockedCompanionNames: [],
          joinedAt: "2026-07-05T00:00:00.000Z",
        }}
        onComplete={vi.fn()}
      />,
    );

    expect(
      await screen.findByRole("heading", { name: /章节教学完成/ }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("结算前夜导师")).toBeInTheDocument();
    expect(screen.getByLabelText("已收录的学习证据")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /前往伙伴会合/ })).toBeEnabled();
    expect(screen.queryByText(/进度 125%/)).not.toBeInTheDocument();
  });

  it("教学进度已全部完成时刷新会直接回到完成庆祝入口", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn((input: RequestInfo | URL) => {
        const url = String(input);
        if (url === "/api/attempts/attempt-complete/teaching") {
          return response(
            case02Scenario.steps.map((step) => ({
              stepId: step.id,
              completed: true,
              teachingResponse: {},
              remediationEvents: [],
              updatedAt: "2026-07-05T00:00:00.000Z",
            })),
          );
        }
        return response({ error: "NOT_FOUND", message: "unexpected" }, 404);
      }),
    );

    render(
      <TeachingBridge
        attemptId="attempt-complete"
        scenario={case02Scenario}
        developer={{
          name: "见习开发者",
          rank: "见习开发者",
          xp: 0,
          missionsCleared: 0,
          clearedChapterIds: [],
          unlockedCompanionNames: [],
          joinedAt: "2026-07-05T00:00:00.000Z",
        }}
        onComplete={vi.fn()}
      />,
    );

    expect(
      await screen.findByRole("heading", { name: /章节教学完成/ }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("结算前夜导师")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /前往伙伴会合/ })).toBeEnabled();
  });

  it("教学桥会持续显示上一站、当前棒和下一步，避免用户忘记流程", async () => {
    const user = userEvent.setup();
    const clipboardWrite = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal("navigator", {
      ...navigator,
      clipboard: { writeText: clipboardWrite },
    });

    vi.stubGlobal(
      "fetch",
      vi.fn((input: RequestInfo | URL) => {
        const url = String(input);
        if (url === "/api/attempts/attempt-memory/teaching") {
          return response([
            {
              stepId: "c2-map",
              completed: true,
              teachingResponse: {},
              remediationEvents: [],
              updatedAt: "2026-07-05T00:00:00.000Z",
            },
          ]);
        }
        return response({ error: "NOT_FOUND", message: "unexpected" }, 404);
      }),
    );

    render(
      <TeachingBridge
        attemptId="attempt-memory"
        scenario={case02Scenario}
        developer={{
          name: "见习开发者",
          rank: "见习开发者",
          xp: 0,
          missionsCleared: 0,
          clearedChapterIds: [],
          unlockedCompanionNames: [],
          joinedAt: "2026-07-05T00:00:00.000Z",
        }}
        onComplete={vi.fn()}
      />,
    );

    expect(await screen.findByLabelText("本章导师同行")).toBeInTheDocument();
    const supportDrawer = screen
      .getByText(/需要时展开流程回放、导师试炼与能力护照/)
      .closest("details");
    expect(supportDrawer).not.toBeNull();
    expect(supportDrawer).not.toHaveAttribute("open");
    expect(screen.getByLabelText("本章导师同行")).toHaveTextContent("导师同行");
    expect(screen.getByLabelText("本章导师同行")).toHaveTextContent("方向守卫");
    expect(screen.getByLabelText("本章导师同行")).toHaveTextContent(
      "方向选择大厅",
    );
    expect(screen.getByLabelText("本章导师同行")).toHaveTextContent(
      "先抓住哪个词",
    );
    expect(screen.getByLabelText("本章导师同行")).toHaveTextContent(
      "CanvasStorm 从想法到草案的路线",
    );
    expect(screen.getByLabelText("本章导师同行")).toHaveTextContent(
      "第一眼看哪条线索",
    );
    expect(screen.getByLabelText("本关交付契约")).toHaveTextContent(
      "现在要证明",
    );
    expect(screen.getByLabelText("本关交付契约")).toHaveTextContent(
      "学完能带走",
    );
    expect(screen.getByLabelText("同行伙伴反应")).toHaveTextContent("灵感萤火");
    expect(screen.getByLabelText("同行伙伴反应")).toHaveTextContent(
      "一次只解锁一个词",
    );
    expect(screen.getByLabelText("同行伙伴反应")).toHaveTextContent("产品链路");
    expect(screen.getByAltText("灵感萤火")).toHaveAttribute(
      "src",
      expect.stringContaining("pet-inspiration-glow-v2"),
    );
    expect(screen.getByLabelText("本章记忆线")).toBeInTheDocument();
    expect(screen.getByLabelText("章节冒险日志")).toHaveTextContent("冒险日志");
    expect(screen.getByLabelText("章节冒险日志")).toHaveTextContent("当前任务");
    expect(screen.getByLabelText("本章流程回放")).toHaveTextContent("流程回放");
    expect(screen.getByLabelText("本章流程回放")).toHaveTextContent(
      "当前站点：Project Brief",
    );
    expect(screen.getByLabelText("本章流程回放")).toHaveTextContent("收到：");
    expect(screen.getByLabelText("本章流程回放")).toHaveTextContent("交出：");
    expect(screen.getByLabelText("本章流程回放")).toHaveTextContent(
      "上一棒交来",
    );
    expect(screen.getByLabelText("本章流程回放")).toHaveTextContent(
      "当前要证明",
    );
    expect(screen.getByLabelText("本章流程回放")).toHaveTextContent(
      "交给下一棒",
    );
    expect(screen.getByLabelText("导师试炼三印章")).toHaveTextContent(
      "导师试炼",
    );
    expect(screen.getByLabelText("导师试炼三印章")).toHaveTextContent(
      "0/3 已点亮",
    );
    expect(screen.getByLabelText("导师试炼三印章")).toHaveTextContent(
      "还差：流程印章、证据印章、委托印章。",
    );
    const flowSeal = screen.getByRole("button", { name: /流程印章/ });
    expect(flowSeal).toHaveAttribute("aria-pressed", "false");
    await user.click(flowSeal);
    expect(flowSeal).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByLabelText("导师试炼三印章")).toHaveTextContent(
      "1/3 已点亮",
    );
    expect(screen.getByLabelText("导师试炼三印章")).toHaveTextContent(
      "还差：证据印章、委托印章。",
    );
    await user.click(screen.getByRole("button", { name: /证据印章/ }));
    await user.click(screen.getByRole("button", { name: /委托印章/ }));
    expect(screen.getByLabelText("导师试炼三印章")).toHaveTextContent(
      "3/3 已点亮",
    );
    expect(screen.getByLabelText("导师试炼三印章")).not.toHaveTextContent(
      "还差：",
    );
    expect(screen.getByLabelText("导师试炼三印章")).toHaveTextContent(
      "试炼完成",
    );
    expect(screen.getByLabelText("导师试炼三印章")).toHaveTextContent(
      "下一步：代码线索：Project Brief 表单",
    );
    expect(screen.getByLabelText("导师试炼三印章")).toHaveTextContent(
      "面试里可以说",
    );
    expect(screen.getByLabelText("导师试炼三印章")).toHaveTextContent(
      "获得能力印记",
    );
    expect(screen.getByLabelText("导师试炼三印章")).toHaveTextContent(
      "产品链路小抄 · 证据接力印记",
    );
    expect(screen.getByLabelText("试炼收获三格")).toHaveTextContent("工作能力");
    expect(screen.getByLabelText("试炼收获三格")).toHaveTextContent(
      "Agent 委托",
    );
    expect(screen.getByLabelText("试炼收获三格")).toHaveTextContent("面试素材");
    await user.click(screen.getByRole("button", { name: "复制本步收获" }));
    expect(clipboardWrite).toHaveBeenCalledWith(
      expect.stringContaining("导师试炼本步收获"),
    );
    expect(clipboardWrite).toHaveBeenCalledWith(
      expect.stringContaining("能力印记：产品链路小抄 · 证据接力印记"),
    );
    expect(clipboardWrite).toHaveBeenCalledWith(
      expect.stringContaining("步骤：产品链路小抄"),
    );
    expect(clipboardWrite).toHaveBeenCalledWith(
      expect.stringContaining("流程：Project Brief"),
    );
    expect(clipboardWrite).toHaveBeenCalledWith(
      expect.stringContaining("Agent：委托时写清背景、边界、验收"),
    );
    expect(clipboardWrite).toHaveBeenCalledWith(
      expect.stringContaining("面试：面试里可以说"),
    );
    expect(
      screen.getByRole("button", { name: "已复制本步收获" }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("本章能力护照")).toHaveTextContent("能力护照");
    expect(screen.getByLabelText("本章能力护照")).toHaveTextContent(
      "工作里怎么用",
    );
    expect(screen.getByLabelText("本章能力护照")).toHaveTextContent("证据工具");
    expect(screen.getByLabelText("本章能力护照")).toHaveTextContent(
      "Agent 协作",
    );
    expect(screen.getByLabelText("Agent 委托骨架")).toBeInTheDocument();
    expect(screen.getByLabelText("本章能力护照")).toHaveTextContent("背景");
    expect(screen.getByLabelText("本章能力护照")).toHaveTextContent("边界");
    expect(screen.getByLabelText("本章能力护照")).toHaveTextContent("验收");
    await user.click(screen.getByRole("button", { name: "复制委托骨架" }));
    expect(clipboardWrite).toHaveBeenCalledWith(
      expect.stringContaining("背景：我正在学习"),
    );
    expect(clipboardWrite).toHaveBeenCalledWith(
      expect.stringContaining("边界：只能基于本章材料和证据工具分析"),
    );
    expect(clipboardWrite).toHaveBeenCalledWith(
      expect.stringContaining("验收：请交回"),
    );
    expect(
      screen.getByRole("button", { name: "已复制委托骨架" }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("本章能力护照")).toHaveTextContent("验收动作");
    expect(screen.getByLabelText("本章能力护照")).toHaveTextContent(
      "用证据证明这一棒真的成立",
    );
    expect(screen.getByLabelText("本章能力护照")).toHaveTextContent("面试产出");
    expect(screen.getByLabelText("面试复盘骨架")).toBeInTheDocument();
    expect(screen.getByLabelText("本章能力护照")).toHaveTextContent("现象");
    expect(screen.getByLabelText("本章能力护照")).toHaveTextContent("证据");
    expect(screen.getByLabelText("本章能力护照")).toHaveTextContent("行动");
    await user.click(screen.getByRole("button", { name: "复制复盘骨架" }));
    expect(clipboardWrite).toHaveBeenCalledWith(
      expect.stringContaining("现象：我遇到的场景是"),
    );
    expect(clipboardWrite).toHaveBeenCalledWith(
      expect.stringContaining("证据：我会引用"),
    );
    expect(clipboardWrite).toHaveBeenCalledWith(
      expect.stringContaining("行动：我先画清"),
    );
    expect(clipboardWrite).toHaveBeenCalledWith(
      expect.stringContaining("验证："),
    );
    expect(
      screen.getByRole("button", { name: "已复制复盘骨架" }),
    ).toBeInTheDocument();
    expect(screen.getByText("刚刚看过")).toBeInTheDocument();
    expect(screen.getAllByText("产品密室勘测").length).toBeGreaterThan(0);
    expect(screen.getByText("当前这一棒")).toBeInTheDocument();
    expect(screen.getAllByText("产品链路小抄").length).toBeGreaterThan(0);
    expect(screen.getByText("接下来")).toBeInTheDocument();
    expect(
      screen.getAllByText("代码线索：Project Brief 表单").length,
    ).toBeGreaterThan(0);
  });

  it("章节结案页会把结论整理成工作、证据和面试三格复盘", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn((input: RequestInfo | URL) => {
        const url = String(input);
        if (url === "/api/attempts/attempt-close-recap/teaching") {
          return response(
            case02Scenario.steps
              .filter((step) => step.id !== "c2-close")
              .map((step) => ({
                stepId: step.id,
                completed: true,
                teachingResponse: {},
                remediationEvents: [],
                updatedAt: "2026-07-05T00:00:00.000Z",
              })),
          );
        }
        return response({ error: "NOT_FOUND", message: "unexpected" }, 404);
      }),
    );

    render(
      <TeachingBridge
        attemptId="attempt-close-recap"
        scenario={case02Scenario}
        developer={{
          name: "见习开发者",
          rank: "见习开发者",
          xp: 0,
          missionsCleared: 0,
          clearedChapterIds: [],
          unlockedCompanionNames: [],
          joinedAt: "2026-07-05T00:00:00.000Z",
        }}
        onComplete={vi.fn()}
      />,
    );

    expect(
      await screen.findByRole("heading", { name: /主线 1-2 已通关/ }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("章节结案复盘")).toBeInTheDocument();
    expect(screen.getAllByText("工作里怎么用").length).toBeGreaterThan(0);
    expect(screen.getByText("证据链怎么验")).toBeInTheDocument();
    expect(screen.getByText("面试怎么讲")).toBeInTheDocument();
    expect(
      screen.getAllByText(/把模糊 AI 需求拆成产品链路/).length,
    ).toBeGreaterThan(0);
    expect(screen.getByLabelText("结案导师")).toBeInTheDocument();
    expect(screen.getByText(/结案导师 ·/)).toBeInTheDocument();
    expect(screen.getByLabelText("本章能力印记")).toBeInTheDocument();
    const closeAgentBrief = screen.getByLabelText("给 Agent 的委托口令");
    expect(closeAgentBrief).toBeInTheDocument();
    expect(within(closeAgentBrief).getByText("背景")).toBeInTheDocument();
    expect(within(closeAgentBrief).getByText("边界")).toBeInTheDocument();
    expect(within(closeAgentBrief).getByText("验收")).toBeInTheDocument();
    expect(screen.getByText(/不要读取真实项目/)).toBeInTheDocument();
    expect(
      screen.getAllByText(/候选请求、取舍记录和会话保存/).length,
    ).toBeGreaterThan(0);
  });

  it("进入实战前会显示作战简报、边界和验收口径", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn((input: RequestInfo | URL) => {
        const url = String(input);
        if (url === "/api/attempts/attempt-coaching/teaching") {
          return response(
            teachingScenario.steps
              .filter((step) => step.id !== "coaching-hints")
              .map((step) => ({
                stepId: step.id,
                completed: true,
                teachingResponse: {},
                remediationEvents: [],
                updatedAt: "2026-07-05T00:00:00.000Z",
              })),
          );
        }
        return response({ error: "NOT_FOUND", message: "unexpected" }, 404);
      }),
    );

    render(
      <TeachingBridge
        attemptId="attempt-coaching"
        scenario={teachingScenario}
        developer={{
          name: "见习开发者",
          rank: "见习开发者",
          xp: 0,
          missionsCleared: 0,
          clearedChapterIds: [],
          unlockedCompanionNames: [],
          joinedAt: "2026-07-05T00:00:00.000Z",
        }}
        onComplete={vi.fn()}
      />,
    );

    expect(
      await screen.findByLabelText("实战前夜作战简报"),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("同行伙伴反应")).toHaveTextContent(
      "档案馆记录员",
    );
    expect(screen.getByLabelText("同行伙伴反应")).toHaveTextContent(
      "先完成眼前这一小步",
    );
    expect(screen.getByLabelText("同行伙伴反应")).toHaveTextContent(
      "数据流证据",
    );
    expect(screen.getByText("档案馆记录员")).toBeInTheDocument();
    expect(screen.getByLabelText("实战作战规则")).toBeInTheDocument();
    expect(screen.getByText(/只改沙盒，不读取真实项目/)).toBeInTheDocument();
    expect(
      screen.getByText(/测试报告 \+ 刷新恢复 \+ 数据库证据/),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /已完成 0\/6 步后继续/ }),
    ).toBeDisabled();
  });

  it("完成教学步骤后先由伙伴收录证据，再进入下一站", async () => {
    const user = userEvent.setup();
    const transitionFetch = vi.fn(
      (input: RequestInfo | URL, init?: RequestInit) => {
        const url = String(input);
        if (url === "/api/attempts/attempt-transition/teaching") {
          return response([
            {
              stepId: "visual-novel-investigation",
              completed: true,
              teachingResponse: {},
              remediationEvents: [],
              updatedAt: "2026-07-05T00:00:00.000Z",
            },
          ]);
        }
        if (
          url.includes("/api/attempts/attempt-transition/teaching/") &&
          init?.method === "PATCH"
        ) {
          return response([]);
        }
        return response({ error: "NOT_FOUND", message: "unexpected" }, 404);
      },
    );
    vi.stubGlobal("fetch", transitionFetch);

    render(
      <TeachingBridge
        attemptId="attempt-transition"
        scenario={case02Scenario}
        developer={{
          name: "见习开发者",
          rank: "见习开发者",
          xp: 0,
          missionsCleared: 0,
          clearedChapterIds: [],
          unlockedCompanionNames: [],
          joinedAt: "2026-07-05T00:00:00.000Z",
        }}
        onComplete={vi.fn()}
      />,
    );

    const mapHeading = await screen.findByRole("heading", {
      name: "项目地图",
    });
    const mapShell = mapHeading.closest("section");
    expect(mapShell).not.toBeNull();
    for (const name of ["用户想法", "Project Brief", "方向罗盘"]) {
      await user.click(
        within(mapShell!).getByRole("button", { name: new RegExp(name) }),
      );
      await user.click(
        within(mapShell!).getByRole("button", { name: /我懂了/ }),
      );
    }
    await user.click(
      within(mapShell!).getByRole("button", {
        name: /已了解基本结构，继续教学/,
      }),
    );

    const transition = await screen.findByRole("dialog", {
      name: "伙伴证据收录",
    });
    expect(transition).toHaveTextContent("证据已收录 · 产品密室勘测");
    expect(transition).toHaveTextContent("灵感萤火 替你守住了这一棒");
    expect(transition).toHaveTextContent("交给下一站");
    expect(transition).toHaveTextContent("产品链路小抄");
    expect(transition).toHaveTextContent("主动复述 · 不评分");
    expect(mapHeading).toBeInTheDocument();

    const continueButton = screen.getByRole("button", {
      name: /收下证据，前往下一站/,
    });
    expect(continueButton).toBeDisabled();
    await user.type(
      screen.getByRole("textbox", { name: /主动复述/ }),
      "用户先把项目目标交给 Brief，最后保存成可以恢复的会话。",
    );
    expect(continueButton).toBeEnabled();
    await user.click(continueButton);
    expect(
      await screen.findByRole("heading", { name: "Project Brief" }),
    ).toBeInTheDocument();
    expect(screen.queryByRole("dialog", { name: "伙伴证据收录" })).toBeNull();
    const savedMap = transitionFetch.mock.calls.find(
      ([input, init]) =>
        String(input).endsWith("/teaching/c2-map") && init?.method === "PATCH",
    );
    expect(JSON.parse(String(savedMap?.[1]?.body))).toMatchObject({
      response: {
        activeRecall: "用户先把项目目标交给 Brief，最后保存成可以恢复的会话。",
      },
      completed: true,
    });
  });

  it("微知识卡允许选择补课方向、切换卡点并记录求助", async () => {
    const user = userEvent.setup();
    const remediationFetch = vi.fn(
      (input: RequestInfo | URL, init?: RequestInit) => {
        const url = String(input);
        if (url === "/api/attempts/attempt-remediation/teaching") {
          return response([
            {
              stepId: "project-map",
              completed: true,
              teachingResponse: {},
              remediationEvents: [],
              updatedAt: "2026-07-05T00:00:00.000Z",
            },
          ]);
        }
        if (
          url ===
            "/api/attempts/attempt-remediation/teaching/micro-lessons/remediation" &&
          init?.method === "POST"
        ) {
          return response({ saved: true });
        }
        return response({ error: "NOT_FOUND", message: "unexpected" }, 404);
      },
    );
    vi.stubGlobal("fetch", remediationFetch);

    render(
      <TeachingBridge
        attemptId="attempt-remediation"
        scenario={teachingScenario}
        developer={{
          name: "见习开发者",
          rank: "见习开发者",
          xp: 0,
          missionsCleared: 0,
          clearedChapterIds: [],
          unlockedCompanionNames: [],
          joinedAt: "2026-07-05T00:00:00.000Z",
        }}
        onComplete={vi.fn()}
      />,
    );

    expect(
      await screen.findByRole("heading", { name: "内存数组" }),
    ).toBeInTheDocument();
    await user.click(
      screen.getByRole("button", { name: "我有点卡住，需要补课" }),
    );
    expect(screen.getByLabelText("选择补课方向")).toHaveTextContent(
      "补课不会扣分",
    );
    await user.click(screen.getByRole("button", { name: "不懂专业术语" }));

    const termLesson = screen.getByLabelText("补课：不懂专业术语");
    expect(termLesson).toHaveAttribute("aria-modal", "true");
    expect(document.body.style.overflow).toBe("hidden");
    expect(termLesson).toHaveTextContent("HTTP 201");
    expect(termLesson).toHaveTextContent("数据库查询结果才是入库证据");
    expect(termLesson).not.toHaveTextContent("**HTTP 201**");

    await user.click(screen.getByRole("button", { name: "换一个卡点" }));
    await user.click(screen.getByRole("button", { name: "不理解因果关系" }));
    expect(screen.getByLabelText("补课：不理解因果关系")).toHaveTextContent(
      "写入走内存、读取走数据库",
    );
    await user.click(screen.getByRole("button", { name: "带着这句话继续" }));
    expect(
      screen.getByRole("button", { name: "我有点卡住，需要补课" }),
    ).toBeInTheDocument();
    expect(document.body.style.overflow).toBe("");

    await vi.waitFor(() => {
      const savedTriggers = remediationFetch.mock.calls
        .filter(
          ([input, init]) =>
            String(input).endsWith("/micro-lessons/remediation") &&
            init?.method === "POST",
        )
        .map(([, init]) => JSON.parse(String(init?.body)).trigger);
      expect(savedTriggers).toEqual(["term", "causality"]);
    });
  });

  it("打开显示 AI 应用开发路线，点击后直接进入教学桥", async () => {
    const user = userEvent.setup();
    vi.stubGlobal(
      "fetch",
      vi.fn((input: RequestInfo | URL, init?: RequestInit) => {
        const url = String(input);
        if (url === "/api/health") return response({ status: "ok" });
        if (url === "/api/diagnostic-sessions") {
          return response(diagnosticActive, 201);
        }
        if (url === "/api/diagnostic-sessions/diagnostic-001") {
          return response(diagnosticCompleted);
        }
        if (url === "/api/attempts" && init?.method === "POST") {
          const body = JSON.parse(String(init.body ?? "{}")) as {
            scenarioId?: string;
          };
          return response(
            body.scenarioId === "canvasstorm-product-brief"
              ? case02Attempt
              : attempt,
            201,
          );
        }
        if (url === "/api/scenarios/canvas-save-persistence") {
          return response({ scenarioId: "canvas-save-persistence", artifacts });
        }
        if (url === "/api/scenarios/canvasstorm-product-brief") {
          return response({
            scenarioId: "canvasstorm-product-brief",
            artifacts: case02Artifacts,
          });
        }
        if (url.includes("/steps/baseline-plan")) {
          return response(attempt);
        }
        if (url.includes("/teaching")) return response([]);
        return response({ error: "NOT_FOUND", message: "unexpected" }, 404);
      }),
    );

    render(<App />);

    // 职业路线封面先以剧情方式显示
    await screen.findByRole("heading", { name: /码上冒险/ }, { timeout: 3000 });
    expect(screen.getByText(/AI 应用开发/)).toBeInTheDocument();
    await enterMainQuest(user);

    // 直接进入教学桥
    expect(await screen.findByText(/AI 开发主线/)).toBeInTheDocument();
    expect(localStorage.length).toBe(0);
  });

  it("根地址重新打开时会继续未完成的第一章剧情", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn((input: RequestInfo | URL, init?: RequestInit) => {
        const url = String(input);
        if (url === "/api/health") return response({ status: "ok" });
        if (url === "/api/diagnostic-sessions") {
          return response(diagnosticCompleted, 201);
        }
        if (url === "/api/attempts" && init?.method === "POST") {
          return response(attempt, 201);
        }
        if (url === "/api/scenarios/canvas-save-persistence") {
          return response({ scenarioId: "canvas-save-persistence", artifacts });
        }
        if (url === "/api/attempts/attempt-001/teaching") {
          return response([
            {
              stepId: "canvasstorm-investigation",
              completed: false,
              teachingResponse: {
                sceneIndex: 0,
                discovered: { "frontend-stage": ["frontend-ok"] },
                sceneRecalls: {},
                sceneDecisions: {},
              },
              remediationEvents: [],
              updatedAt: "2026-07-15T00:00:00.000Z",
            },
          ]);
        }
        return response({ error: "NOT_FOUND", message: "unexpected" }, 404);
      }),
    );

    render(<App />);

    expect(
      await screen.findByRole("heading", { name: "灯亮了，但戏还没演完" }),
    ).toBeInTheDocument();
    expect(
      await screen.findByText("卷宗已收录 · 点击回看"),
    ).toBeInTheDocument();
    expect((await screen.findAllByText(/response\.ok/)).length).toBeGreaterThan(
      0,
    );
    expect(screen.queryByRole("heading", { name: /码上冒险/ })).toBeNull();
  });

  it("刷新章节深链会恢复到对应教学桥并跳过已完成的前置剧情", async () => {
    window.history.replaceState(null, "", "/#chapter-2");
    vi.stubGlobal(
      "fetch",
      vi.fn((input: RequestInfo | URL, init?: RequestInit) => {
        const url = String(input);
        if (url === "/api/health") return response({ status: "ok" });
        if (url === "/api/diagnostic-sessions") {
          return response(diagnosticActive, 201);
        }
        if (url === "/api/diagnostic-sessions/diagnostic-001") {
          return response(diagnosticCompleted);
        }
        if (url === "/api/attempts" && init?.method === "POST") {
          const body = JSON.parse(String(init.body ?? "{}")) as {
            scenarioId?: string;
          };
          return response(
            body.scenarioId === "canvasstorm-product-brief"
              ? case02Attempt
              : attempt,
            201,
          );
        }
        if (url === "/api/scenarios/canvasstorm-product-brief") {
          return response({
            scenarioId: "canvasstorm-product-brief",
            artifacts: case02Artifacts,
          });
        }
        if (url === "/api/attempts/attempt-case-02/teaching") {
          return response([
            {
              stepId: "c2-map",
              completed: true,
              teachingResponse: {},
              remediationEvents: [],
              updatedAt: "2026-07-05T00:00:00.000Z",
            },
            {
              stepId: "c2-concepts",
              completed: true,
              teachingResponse: {},
              remediationEvents: [],
              updatedAt: "2026-07-05T00:00:00.000Z",
            },
          ]);
        }
        return response({ error: "NOT_FOUND", message: "unexpected" }, 404);
      }),
    );

    render(<App />);

    expect(
      await screen.findByRole("heading", {
        name: /代码线索：Project Brief 表单/,
      }),
    ).toBeInTheDocument();
    expect(window.location.hash).toBe("#chapter-2");
    expect(screen.queryByRole("heading", { name: /码上冒险/ })).toBeNull();
    expect(screen.getByText(/把分散的信息装进一个对象/)).toBeInTheDocument();
  });

  it("实战通关后的成长档案会给出工作、Agent 和面试迁移口令", async () => {
    const careerDossierConfig = {
      missionLabel: "主线 1-2 · AI 应用开发",
      missionTitle: "产品链路密室",
      backgroundImage: "/quest-workbench.webp",
      result: {
        label: "产品链路闭环通过 · 成长档案已更新",
        title: "这次通关可以讲成 AI 产品能力",
        body: (hintLevel: number) =>
          `你不只是让页面返回 200，而是证明了 Project Brief、方向筛选、候选取舍和会话保存之间的关系。本次独立程度：L${hintLevel >= 3 ? "1" : "2"}。`,
        proved: "执行草案只接收符合方向的候选",
        recorded: "Brief、取舍理由、下一步动作与验收证据",
        pending: "换一个 AI 功能继续练产品拆解",
        nextTitle: "下一步怎么变成面试里的产品能力？",
        nextItems: [
          "把“AI 点子”讲成用户目标、输入、处理、输出和约束。",
          "说明为什么拒绝不符合阶段的候选，而不是把所有想法都塞进去。",
          "用测试结果证明会话保存了取舍理由，不只证明接口返回 200。",
        ],
      },
    } as Parameters<typeof CareerDossier>[0]["config"];

    const onBackToRoadmap = vi.fn();

    render(
      <CareerDossier
        config={careerDossierConfig}
        hintLevel={1}
        onBackToRoadmap={onBackToRoadmap}
      />,
    );

    expect(screen.getByLabelText("迁移口令")).toBeInTheDocument();
    expect(screen.getByLabelText("结案后下一步")).toBeInTheDocument();
    expect(screen.getByText("工作复盘")).toBeInTheDocument();
    expect(screen.getByText("Agent 委托")).toBeInTheDocument();
    expect(screen.getByText("面试讲法")).toBeInTheDocument();
    expect(screen.getByText(/产品链路密室/)).toBeInTheDocument();
    expect(
      screen.getAllByText(/执行草案只接收符合方向的候选/).length,
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByText(/Brief、取舍理由、下一步动作与验收证据/).length,
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByText(/把“AI 点子”讲成用户目标/).length,
    ).toBeGreaterThan(0);
    fireEvent.click(screen.getByRole("button", { name: /回到路线图/ }));
    expect(onBackToRoadmap).toHaveBeenCalledTimes(1);
  });

  it("只有服务端接受实战提交后才触发成长奖励结算", async () => {
    const user = userEvent.setup();
    const onSubmitted = vi.fn();
    const completeAttempt = {
      ...case02Attempt,
      status: "active" as const,
      verificationStatus: "passed" as const,
      steps: {
        "product-brief": {
          response: { text: "已完成产品 Brief 证据说明。" },
          savedAt: "2026-07-13T00:00:00.000Z",
        },
        "candidate-direction": {
          response: { text: "已完成候选方向证据说明。" },
          savedAt: "2026-07-13T00:00:00.000Z",
        },
        "agent-brief": {
          response: { text: "已完成 Agent 委托说明。" },
          savedAt: "2026-07-13T00:00:00.000Z",
        },
        "delivery-review": {
          response: { text: "已完成交付审查说明。" },
          savedAt: "2026-07-13T00:00:00.000Z",
        },
        "interview-dossier": {
          response: { text: "已完成面试复盘说明。" },
          savedAt: "2026-07-13T00:00:00.000Z",
        },
      },
    } as Parameters<typeof Lab>[0]["attempt"];
    vi.stubGlobal(
      "fetch",
      vi.fn((input: RequestInfo | URL, init?: RequestInit) => {
        if (
          String(input) === "/api/attempts/attempt-case-02/submit" &&
          init?.method === "POST"
        ) {
          return response({ ...completeAttempt, status: "submitted" });
        }
        return response({ error: "NOT_FOUND", message: "unexpected" }, 404);
      }),
    );

    render(
      <Lab
        artifacts={case02Artifacts}
        attempt={completeAttempt}
        onBackToRoadmap={vi.fn()}
        onSubmitted={onSubmitted}
        setAttempt={vi.fn()}
      />,
    );

    expect(onSubmitted).not.toHaveBeenCalled();
    await user.click(screen.getByRole("button", { name: /生成成长档案/ }));
    expect(onSubmitted).toHaveBeenCalledTimes(1);
  });

  it("重新打开已提交实战时会静默同步成长档案", async () => {
    const onSubmitted = vi.fn();
    const submittedAttempt = {
      ...case02Attempt,
      status: "submitted" as const,
    } as Parameters<typeof Lab>[0]["attempt"];

    render(
      <Lab
        artifacts={case02Artifacts}
        attempt={submittedAttempt}
        onBackToRoadmap={vi.fn()}
        onSubmitted={onSubmitted}
        setAttempt={vi.fn()}
      />,
    );

    expect(screen.getByLabelText("成长档案结案")).toBeInTheDocument();
    await waitFor(() =>
      expect(onSubmitted).toHaveBeenCalledWith({ showReward: false }),
    );
  });

  it("实战测试失败后会把失败报告翻译成可读证据", () => {
    const failedAttempt = {
      ...case02Attempt,
      verificationStatus: "failed",
      latestVerification: {
        status: "failed",
        observedAt: "2026-07-05T00:00:00.000Z",
        report: {
          tests: [
            {
              name: "只把所选方向的候选放进执行草案",
              status: "failed",
              message: "执行草案包含了非 MVP 方向候选",
            },
            {
              name: "保存会话时记录 Brief、方向、取舍理由和下一步",
              status: "failed",
              message: "缺少已接收候选 id",
            },
          ],
        },
      },
    } as Parameters<typeof VerificationPanel>[0]["attempt"];
    const config = {
      flowItems: [
        { label: "用户", title: "写 Brief", detail: "说明目标和约束" },
        { label: "后端规划器", title: "筛候选", detail: "按方向取舍" },
        { label: "会话记录", title: "保存取舍", detail: "留下证据" },
      ],
      practical: {
        title: "在 CanvasStorm Brief 沙盒里修正产品链路",
        sandboxPath: "sandbox/canvasstorm-product-brief",
        statusPassed: "产品取舍、会话保存和错误提示已经有测试证据。",
        statusFailed:
          "失败报告会告诉你：方向筛选、会话记录或空目标处理哪里还没成立。",
      },
      artifactGuides: {
        planner: {
          place: "第 2 棒：规划器决定哪些候选进入草案",
          focus: "只看 acceptedCandidates 从哪里来。",
          keyLines: ["const acceptedCandidates = candidates"],
          proves: "当前实现没有做方向取舍。",
          cannotProve: "只能证明故障点。",
        },
      },
    } as unknown as Parameters<typeof VerificationPanel>[0]["config"];

    render(
      <VerificationPanel
        attempt={failedAttempt}
        config={config}
        onVerify={vi.fn()}
      />,
    );

    expect(screen.getByLabelText("测试报告译文")).toBeInTheDocument();
    expect(screen.getByLabelText("本次验收目标")).toHaveTextContent(
      "修复不是“看起来对”，而是测试能复现、能通过",
    );
    expect(screen.getByLabelText("本次验收目标")).toHaveTextContent(
      "解锁下一棒，并把这份证据写入成长档案",
    );
    expect(screen.getByText("还有 2 个红灯")).toBeInTheDocument();
    expect(
      screen.getByText("只把所选方向的候选放进执行草案"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("执行草案包含了非 MVP 方向候选"),
    ).toBeInTheDocument();
    expect(screen.getByText("缺少已接收候选 id")).toBeInTheDocument();
    expect(screen.getAllByText("流程断点").length).toBeGreaterThan(0);
    expect(screen.getAllByText("先查材料").length).toBeGreaterThan(0);
    expect(screen.getAllByText("下一步").length).toBeGreaterThan(0);
    expect(
      screen.getAllByText(/方向筛选这一棒还没成立/).length,
    ).toBeGreaterThan(0);
    expect(screen.getAllByText(/第 2 棒：规划器决定/).length).toBeGreaterThan(
      0,
    );
    expect(screen.getAllByText(/回到规划器逻辑/).length).toBeGreaterThan(0);
  });

  it("实战测试通过后会展示通过测试作为可复述证据", () => {
    const passedAttempt = {
      ...case02Attempt,
      verificationStatus: "passed",
      latestVerification: {
        status: "passed",
        observedAt: "2026-07-05T00:00:00.000Z",
        report: {
          generatedAt: "2026-07-05T01:02:03.000Z",
          sourceHash:
            "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
          summary: { passed: 2, failed: 0 },
          tests: [
            { name: "只保留 MVP 候选", status: "passed" },
            { name: "保存取舍理由", status: "passed" },
          ],
        },
      },
    } as Parameters<typeof VerificationPanel>[0]["attempt"];

    render(
      <VerificationPanel
        attempt={passedAttempt}
        config={
          {
            practical: {
              title: "在 CanvasStorm Brief 沙盒里修正产品链路",
              sandboxPath: "sandbox/canvasstorm-product-brief",
              statusPassed: "产品链路测试已通过。",
              statusFailed: "还有失败证据。",
            },
          } as unknown as Parameters<typeof VerificationPanel>[0]["config"]
        }
        onVerify={vi.fn()}
      />,
    );

    expect(screen.getByText("全部通过 · 2 项证据")).toBeInTheDocument();
    expect(screen.getByText("只保留 MVP 候选")).toBeInTheDocument();
    expect(screen.getByText("保存取舍理由")).toBeInTheDocument();
    const passport = screen.getByLabelText("报告证据护照");
    expect(passport).toHaveTextContent("生成时间");
    expect(passport).toHaveTextContent("源码指纹");
    expect(passport).toHaveTextContent("0123456789");
    expect(passport).toHaveTextContent("2 通过 / 0 失败");
    expect(passport).toHaveTextContent("哪些路径没覆盖");
  });

  it("第 2 章教学完成后只与伙伴会合，不提前发 XP 或标记通关", async () => {
    const user = userEvent.setup();
    window.history.replaceState(null, "", "/#chapter-2");
    vi.stubGlobal(
      "fetch",
      vi.fn((input: RequestInfo | URL, init?: RequestInit) => {
        const url = String(input);
        if (url === "/api/health") return response({ status: "ok" });
        if (url === "/api/diagnostic-sessions") {
          return response(diagnosticActive, 201);
        }
        if (url === "/api/diagnostic-sessions/diagnostic-001") {
          return response(diagnosticCompleted);
        }
        if (url === "/api/attempts" && init?.method === "POST") {
          return response(case02Attempt, 201);
        }
        if (url === "/api/scenarios/canvasstorm-product-brief") {
          return response({
            scenarioId: "canvasstorm-product-brief",
            artifacts: case02Artifacts,
          });
        }
        if (url === "/api/attempts/attempt-case-02/teaching") {
          return response(
            case02Scenario.steps
              .filter((step) => step.id !== "c2-close")
              .map((step) => ({
                stepId: step.id,
                completed: true,
                teachingResponse: {},
                remediationEvents: [],
                updatedAt: "2026-07-05T00:00:00.000Z",
              })),
          );
        }
        if (
          url === "/api/attempts/attempt-case-02/teaching/c2-close" &&
          init?.method === "PATCH"
        ) {
          return response({ ok: true });
        }
        if (
          url === "/api/attempts/attempt-case-02/steps/product-brief" &&
          init?.method === "PATCH"
        ) {
          const body = JSON.parse(String(init.body ?? "{}")) as {
            response?: Record<string, unknown>;
          };
          return response({
            ...case02Attempt,
            steps: {
              "product-brief": {
                response: body.response,
                savedAt: "2026-07-05T00:02:00.000Z",
              },
            },
          });
        }
        return response({ error: "NOT_FOUND", message: "unexpected" }, 404);
      }),
    );

    render(<App />);

    expect(
      await screen.findByRole("heading", { name: /主线 1-2 已通关/ }),
    ).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /完成这一关/ }));
    expect(
      await screen.findByRole("dialog", { name: "伙伴证据收录" }),
    ).toHaveTextContent("交给下一站");
    await user.type(
      screen.getByRole("textbox", { name: /主动复述/ }),
      "我会查看会话保存结果和刷新恢复，证明产品链路真的完成。",
    );
    await user.click(
      screen.getByRole("button", { name: /收下证据，前往伙伴会合/ }),
    );
    expect(
      await screen.findByRole("heading", { name: /章节教学完成/ }),
    ).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /前往伙伴会合/ }));

    expect(
      await screen.findByRole("heading", {
        name: /第 2 章路线已解读：AI 点子为什么空泛/,
      }),
    ).toBeInTheDocument();
    expect(screen.getAllByText(/灵感萤火/).length).toBeGreaterThan(0);
    expect(
      screen.getByText(/XP、阶位和伙伴收藏都要等实战证据通过后结算/),
    ).toBeInTheDocument();
    expect(localStorage.getItem("codequest_developer")).toBeNull();
    expect(screen.getByLabelText("实战会合简报")).toBeInTheDocument();
    expect(screen.getByText("现在只做一件事")).toBeInTheDocument();
    expect(screen.getByText("通关门槛")).toBeInTheDocument();
    expect(screen.getByText("通过后领取")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /与伙伴进入实战/ }));
    expect((await screen.findAllByText(/产品链路密室/)).length).toBeGreaterThan(
      0,
    );
    expect(screen.getAllByText(/读 Project Brief/).length).toBeGreaterThan(0);
    expect(screen.getByLabelText("实战剧情向导")).toHaveTextContent("灵感萤火");
    expect(screen.getByAltText("灵感萤火实战向导")).toBeInTheDocument();
    expect(screen.getByLabelText("实战剧情向导")).toHaveTextContent(
      "Brief 星图桌",
    );
    expect(screen.getByLabelText("实战剧情向导")).toHaveTextContent(
      "点亮 Brief 星图",
    );
    expect(screen.getByLabelText("本步任务卷轴")).toHaveTextContent(
      "Project Brief 是 AI 功能的任务契约",
    );
    expect(screen.getByLabelText("本步任务卷轴")).toHaveTextContent("userGoal");
    expect(screen.getByLabelText("流程接力小剧场")).toHaveTextContent(
      "Brief 不是介绍文案",
    );
    expect(screen.getByLabelText("流程接力小剧场")).toHaveTextContent(
      "后端规划器会拿这把尺子去筛候选",
    );
    await user.type(
      screen.getByRole("textbox"),
      "用户想要把 AI 点子变成可执行草案。输入是项目名、用户目标、阶段和约束，输出应该是符合 MVP 方向的候选和下一步。当前阶段不能把增长方案也塞进执行草案。",
    );
    await user.click(screen.getByRole("button", { name: /保存并继续/ }));
    expect(await screen.findByLabelText("实战剧情向导")).toHaveTextContent(
      "产品链路带读官",
    );
    expect(screen.getByAltText("产品链路带读官实战向导")).toBeInTheDocument();
    expect(screen.getByLabelText("实战剧情向导")).toHaveTextContent(
      "方向筛选台",
    );
    expect(screen.getByLabelText("本步任务卷轴")).toHaveTextContent(
      "真实 AI 产品不是把所有点子都做进去",
    );
    expect(screen.getByLabelText("流程接力小剧场")).toHaveTextContent(
      "候选池像装备栏",
    );
    expect(screen.getByLabelText("刚刚收录的证据")).toHaveTextContent(
      "读 Project Brief",
    );
    expect(window.location.hash).toBe("");
  });

  it("面试复盘房间可以保存五段草稿到本地学习记录", async () => {
    const user = userEvent.setup();
    let savedDossier: Record<string, unknown> | null = null;
    vi.stubGlobal(
      "fetch",
      vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
        const url = String(input);
        if (url === "/api/health") return response({ status: "ok" });
        if (url === "/api/diagnostic-sessions") {
          return response(diagnosticActive, 201);
        }
        if (url === "/api/diagnostic-sessions/diagnostic-001") {
          return response(diagnosticCompleted);
        }
        if (url === "/api/attempts" && init?.method === "POST") {
          const body = JSON.parse(String(init.body ?? "{}")) as {
            scenarioId?: string;
          };
          return response(
            body.scenarioId === "canvasstorm-product-brief"
              ? case02Attempt
              : attempt,
            201,
          );
        }
        if (url === "/api/scenarios/canvas-save-persistence") {
          return response({ scenarioId: "canvas-save-persistence", artifacts });
        }
        if (url === "/api/learning-recalls") {
          return response({
            recalls: [
              {
                scenarioId: "canvas-save-persistence",
                stepId: "project-map",
                activeRecall:
                  "用户把草稿交给前端，最后由数据库留下可恢复记录。",
                updatedAt: "2026-07-05T00:00:00.000Z",
              },
              {
                scenarioId: "canvas-save-persistence",
                stepId: "chapter-close",
                activeRecall:
                  "我会看数据库记录和刷新恢复，再确认自动化测试通过。",
                updatedAt: "2026-07-05T00:01:00.000Z",
              },
            ],
          });
        }
        if (url === "/api/scenarios/canvasstorm-product-brief") {
          return response({
            scenarioId: "canvasstorm-product-brief",
            artifacts: case02Artifacts,
          });
        }
        if (url.includes("/steps/baseline-plan")) {
          return response(attempt);
        }
        if (url.includes("/steps/interview-dossier")) {
          const body = JSON.parse(String(init?.body ?? "{}")) as {
            response: Record<string, unknown>;
          };
          savedDossier = body.response;
          return response({
            ...attempt,
            steps: {
              "interview-dossier": {
                response: body.response,
                savedAt: "2026-07-05T00:00:00.000Z",
              },
            },
          });
        }
        if (url.includes("/teaching")) return response([]);
        return response({ error: "NOT_FOUND", message: "unexpected" }, 404);
      }),
    );

    render(<App />);

    await screen.findByRole("heading", { name: /码上冒险/ }, { timeout: 3000 });
    await user.click(screen.getByRole("button", { name: /走进档案馆/ }));
    await user.click(screen.getByRole("button", { name: /调取现场证据/ }));
    await user.click(screen.getByRole("button", { name: /领取委托/ }));
    await user.click(screen.getByRole("button", { name: /面试复盘/ }));
    await user.click(screen.getByRole("button", { name: /进入复盘房间/ }));

    expect(
      await screen.findByRole("heading", {
        name: /把通关经历写成你自己的项目回答/,
      }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("我的原始复述")).toHaveTextContent(
      "用户把草稿交给前端",
    );
    await user.type(
      screen.getByLabelText("现象复盘"),
      "页面提示保存成功，但刷新后记录消失。",
    );
    await user.type(
      screen.getByLabelText("定位证据复盘"),
      "Network 返回 201，但数据库查询没有新增记录。",
    );
    await user.type(
      screen.getByLabelText("行动/修改复盘"),
      "沿前端、接口、数据层逐段定位，并要求 Agent 补测试。",
    );
    await user.type(
      screen.getByLabelText("验证动作复盘"),
      "重新保存、刷新、查库并运行测试。",
    );
    await user.type(
      screen.getByLabelText("可迁移经验复盘"),
      "以后不只看成功提示，要看真实副作用。",
    );
    await user.click(screen.getByRole("button", { name: /保存复盘草稿/ }));

    expect(await screen.findByText(/已封存到本地学习记录/)).toBeInTheDocument();
    expect(savedDossier?.["chapter-1-phenomenon"]).toContain("刷新后记录消失");
    expect(savedDossier?.["chapter-1-evidence"]).toContain("数据库查询");
    expect(savedDossier?.["chapter-1-transfer"]).toContain("真实副作用");
  });

  it("面试作品集可以从任务简报打开并生成 Markdown", async () => {
    const user = userEvent.setup();
    const portfolioAttempt = {
      ...attempt,
      steps: {
        "interview-dossier": {
          response: {
            "chapter-1-phenomenon": "页面提示保存成功，但刷新后记录消失。",
            "chapter-1-evidence": "Network 返回 201，但数据库 SELECT 是 0 行。",
            "chapter-1-action":
              "沿前端、接口、数据层逐段定位，并要求 Agent 补测试。",
            "chapter-1-verification": "重新保存、刷新、查库并运行测试。",
            "chapter-1-transfer": "以后不只看成功提示，要看真实副作用。",
          },
          savedAt: "2026-07-05T00:00:00.000Z",
        },
      },
    };
    vi.stubGlobal(
      "fetch",
      vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
        const url = String(input);
        if (url === "/api/health") return response({ status: "ok" });
        if (url === "/api/diagnostic-sessions") {
          return response(diagnosticActive, 201);
        }
        if (url === "/api/diagnostic-sessions/diagnostic-001") {
          return response(diagnosticCompleted);
        }
        if (url === "/api/attempts" && init?.method === "POST") {
          return response(portfolioAttempt, 201);
        }
        if (url === "/api/scenarios/canvas-save-persistence") {
          return response({ scenarioId: "canvas-save-persistence", artifacts });
        }
        if (url === "/api/learning-recalls") {
          return response({
            recalls: [
              {
                scenarioId: "canvas-save-persistence",
                stepId: "project-map",
                activeRecall:
                  "用户把草稿交给前端，最后由数据库留下可恢复记录。",
                updatedAt: "2026-07-05T00:00:00.000Z",
              },
              {
                scenarioId: "canvas-save-persistence",
                stepId: "chapter-close",
                activeRecall:
                  "我会看数据库记录和刷新恢复，再确认自动化测试通过。",
                updatedAt: "2026-07-05T00:01:00.000Z",
              },
            ],
          });
        }
        if (url.includes("/steps/baseline-plan")) {
          return response(portfolioAttempt);
        }
        if (url.includes("/teaching")) return response([]);
        return response({ error: "NOT_FOUND", message: "unexpected" }, 404);
      }),
    );

    render(<App />);

    await screen.findByRole("heading", { name: /码上冒险/ }, { timeout: 3000 });
    await user.click(screen.getByRole("button", { name: /走进档案馆/ }));
    await user.click(screen.getByRole("button", { name: /调取现场证据/ }));
    await user.click(screen.getByRole("button", { name: /领取委托/ }));
    await user.click(screen.getByRole("button", { name: /面试复盘/ }));
    await user.click(screen.getByRole("button", { name: /打开作品集/ }));

    expect(
      await screen.findByRole("heading", {
        name: /把 15 章通关经历整理成可讲的项目证据/,
      }),
    ).toBeInTheDocument();
    expect(screen.getByText(/Markdown 导出稿/)).toBeInTheDocument();
    expect(screen.getAllByText(/页面提示保存成功/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Network 返回 201/).length).toBeGreaterThan(0);
    expect(screen.getByLabelText("我的原始复述")).toHaveTextContent(
      "用户把草稿交给前端",
    );
    expect(
      screen.getByText(/我的流程复述：用户把草稿交给前端/),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/我的验收复述：我会看数据库记录/),
    ).toBeInTheDocument();
    expect(screen.getByText(/自动化只能证明工程路径可用/)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /补本章草稿/ }),
    ).toBeInTheDocument();
  });

  it("本地备份库可以生成并恢复学习记录 JSON", async () => {
    const user = userEvent.setup();
    const learningBackup = {
      format: "code-quest-learning-backup",
      formatVersion: 1,
      schemaVersion: 2,
      exportedAt: "2026-07-05T00:00:00.000Z",
      tables: {
        learner_profiles: [{ id: "local-learner" }],
        diagnostic_sessions: [{ id: "diagnostic-001" }],
        attempts: [{ id: "attempt-001" }],
        step_responses: [{ step_id: "interview-dossier" }],
        verification_events: [],
        evidence_records: [],
        teaching_progress: [{ step_id: "flow-map" }],
      },
    };
    vi.stubGlobal(
      "fetch",
      vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
        const url = String(input);
        if (url === "/api/health") return response({ status: "ok" });
        if (url === "/api/diagnostic-sessions") {
          return response(diagnosticActive, 201);
        }
        if (url === "/api/diagnostic-sessions/diagnostic-001") {
          return response(diagnosticCompleted);
        }
        if (url === "/api/attempts" && init?.method === "POST") {
          return response(attempt, 201);
        }
        if (url === "/api/scenarios/canvas-save-persistence") {
          return response({ scenarioId: "canvas-save-persistence", artifacts });
        }
        if (url.includes("/steps/baseline-plan")) {
          return response(attempt);
        }
        if (url === "/api/learning-backup") {
          return response(learningBackup);
        }
        if (url === "/api/learning-backup/import") {
          const body = JSON.parse(String(init?.body ?? "{}")) as {
            backup?: { format?: string };
          };
          expect(body.backup?.format).toBe("code-quest-learning-backup");
          return response({
            importedAt: "2026-07-05T00:01:00.000Z",
            counts: {
              learner_profiles: 1,
              diagnostic_sessions: 1,
              attempts: 1,
              step_responses: 1,
              verification_events: 0,
              evidence_records: 0,
              teaching_progress: 1,
            },
          });
        }
        if (url.includes("/teaching")) return response([]);
        return response({ error: "NOT_FOUND", message: "unexpected" }, 404);
      }),
    );

    render(<App />);

    await screen.findByRole("heading", { name: /码上冒险/ }, { timeout: 3000 });
    await user.click(screen.getByRole("button", { name: /走进档案馆/ }));
    await user.click(screen.getByRole("button", { name: /调取现场证据/ }));
    await user.click(screen.getByRole("button", { name: /领取委托/ }));
    await user.click(screen.getByRole("button", { name: /本地备份/ }));
    await user.click(screen.getByRole("button", { name: /打开备份库/ }));

    expect(
      await screen.findByRole("heading", {
        name: /把你的通关证据封存成一份可恢复的本地备份/,
      }),
    ).toBeInTheDocument();
    expect(screen.getByText("粘贴 JSON 覆盖恢复")).toBeInTheDocument();
    expect(screen.getAllByText(/覆盖当前本地学习记录/).length).toBeGreaterThan(
      0,
    );
    expect(screen.queryByText(/合并恢复/)).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /生成备份 JSON/ }));
    expect(
      await screen.findByText(/已生成本地学习记录备份/),
    ).toBeInTheDocument();
    expect(
      (screen.getByLabelText("备份 JSON") as HTMLTextAreaElement).value,
    ).toContain("code-quest-learning-backup");

    const restoreButton = screen.getByRole("button", {
      name: /恢复这份备份/,
    });
    expect(restoreButton).toBeDisabled();
    await user.click(
      screen.getByRole("checkbox", {
        name: /我知道恢复会覆盖当前本地学习记录/,
      }),
    );
    expect(restoreButton).toBeEnabled();
    await user.click(restoreButton);
    expect(
      await screen.findByText(/已覆盖恢复学习记录：5 条记录已写入/),
    ).toBeInTheDocument();
  });

  it("第 2 章从路线卷宗直接进入 CanvasStorm 产品链路关卡", async () => {
    const user = userEvent.setup();
    const sealRecall = async (text: string) => {
      await user.click(screen.getByRole("button", { name: /沿证据继续追到/ }));
      await user.type(screen.getByLabelText("本幕复述原话"), text);
      await user.click(screen.getByRole("button", { name: /^封存本幕复述$/ }));
    };
    const fetchMock = vi.fn((input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input);
      if (url === "/api/health") return response({ status: "ok" });
      if (url === "/api/diagnostic-sessions") {
        return response(diagnosticActive, 201);
      }
      if (url === "/api/diagnostic-sessions/diagnostic-001") {
        return response(diagnosticCompleted);
      }
      if (url === "/api/attempts" && init?.method === "POST") {
        const body = JSON.parse(String(init.body ?? "{}")) as {
          scenarioId?: string;
        };
        return response(
          body.scenarioId === "canvasstorm-product-brief"
            ? case02Attempt
            : attempt,
          201,
        );
      }
      if (url === "/api/scenarios/canvas-save-persistence") {
        return response({ scenarioId: "canvas-save-persistence", artifacts });
      }
      if (url === "/api/scenarios/canvasstorm-product-brief") {
        return response({
          scenarioId: "canvasstorm-product-brief",
          artifacts: case02Artifacts,
        });
      }
      if (url.includes("/steps/baseline-plan")) {
        return response(attempt);
      }
      if (url.includes("/teaching")) return response([]);
      return response({ error: "NOT_FOUND", message: "unexpected" }, 404);
    });
    vi.stubGlobal("fetch", fetchMock);

    render(<App />);

    await screen.findByRole("heading", { name: /码上冒险/ }, { timeout: 3000 });
    await user.click(screen.getByRole("button", { name: /走进档案馆/ }));
    await user.click(screen.getByRole("button", { name: /调取现场证据/ }));
    await user.click(screen.getByRole("button", { name: /领取委托/ }));
    await user.click(
      screen.getByRole("button", { name: /第 2 章 · AI 点子为什么空泛/ }),
    );

    expect(screen.getByText(/创意工坊里冒出一堆 AI 点子/)).toBeInTheDocument();
    expect(
      screen.getAllByText(/Project Brief、方向筛选/).length,
    ).toBeGreaterThan(0);
    expect(
      screen.getByRole("button", { name: /进入第 2 章教学关卡/ }),
    ).toBeInTheDocument();
    await user.click(
      screen.getByRole("button", { name: /进入第 2 章教学关卡/ }),
    );

    expect(
      await screen.findByRole("heading", {
        name: /AI 点子为什么会空泛/,
      }),
    ).toBeInTheDocument();
    expect(screen.getAllByText(/Project Brief/).length).toBeGreaterThan(0);
    expect(screen.getByText(/候选看板 \+ 执行草案/)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /开始闯关/ }));
    expect(
      await screen.findByRole("heading", { name: /先把项目说清楚/ }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/CanvasStorm 从想法到草案的路线/),
    ).toBeInTheDocument();
    expect(
      screen.getAllByText(/项目、用户、阶段、约束/).length,
    ).toBeGreaterThan(0);

    await user.click(screen.getByRole("button", { name: /先看背景卡/ }));
    expect(screen.getByText(/先把项目背景写成一张 Brief/)).toBeInTheDocument();
    expect(
      screen.getByText(/项目：CanvasStorm 功能拓展工作台/),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /为什么会空泛/ }));
    await sealRecall("这一幕先把项目目标和约束说清楚，下一幕继续筛选方向。");
    await user.click(screen.getByRole("button", { name: /^继续下一地点$/ }));
    expect(
      await screen.findByRole("heading", { name: /不是多生成，而是选方向/ }),
    ).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /翻开方向罗盘/ }));
    await user.click(screen.getByRole("button", { name: /筛候选不是全都要/ }));
    await sealRecall(
      "候选不能全部都要，要用目标和约束筛出真正值得验证的方向。",
    );
    await user.click(screen.getByRole("button", { name: /^继续下一地点$/ }));
    expect(
      await screen.findByRole("heading", { name: /用户的选择不能丢/ }),
    ).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /追踪保存路线/ }));
    await user.click(screen.getByRole("button", { name: /看懂备用仓库/ }));
    await sealRecall(
      "保存路线要能解释数据从哪里来、交给谁，以及之后如何再次读回来。",
    );
    await user.click(screen.getByRole("button", { name: /^继续下一地点$/ }));
    expect(
      await screen.findByRole("heading", { name: /连上 AI，也不能泄露钥匙/ }),
    ).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /检查 AI 灯塔/ }));
    await user.click(screen.getByRole("button", { name: /AI 熄灯后怎么办/ }));
    await sealRecall(
      "接上 AI 也要说明边界和失败处理，不能把不确定的结果当成完成。",
    );
    await user.click(screen.getByRole("button", { name: /进入实战修复/ }));

    expect(
      await screen.findByRole("heading", { name: /项目地图/ }),
    ).toBeInTheDocument();
    expect(screen.getAllByText(/用户想法/).length).toBeGreaterThan(0);
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/scenarios/canvasstorm-product-brief",
      expect.any(Object),
    );
    expect(screen.queryByText(/第 2 章已通关/)).not.toBeInTheDocument();
  });

  it("第 3 章从路线卷宗进入登录态剧情关卡", async () => {
    const user = userEvent.setup();
    const fetchMock = vi.fn((input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input);
      if (url === "/api/health") return response({ status: "ok" });
      if (url === "/api/diagnostic-sessions") {
        return response(diagnosticActive, 201);
      }
      if (url === "/api/diagnostic-sessions/diagnostic-001") {
        return response(diagnosticCompleted);
      }
      if (url === "/api/attempts" && init?.method === "POST") {
        const body = JSON.parse(String(init.body ?? "{}")) as {
          scenarioId?: string;
        };
        return response(
          body.scenarioId === "identity-session-corridor"
            ? case03Attempt
            : attempt,
          201,
        );
      }
      if (url === "/api/scenarios/canvas-save-persistence") {
        return response({ scenarioId: "canvas-save-persistence", artifacts });
      }
      if (url === "/api/scenarios/identity-session-corridor") {
        return response({
          scenarioId: "identity-session-corridor",
          artifacts: case03Artifacts,
        });
      }
      if (url.includes("/steps/baseline-plan")) {
        return response(attempt);
      }
      if (url.includes("/teaching")) return response([]);
      return response({ error: "NOT_FOUND", message: "unexpected" }, 404);
    });
    vi.stubGlobal("fetch", fetchMock);

    render(<App />);

    await screen.findByRole("heading", { name: /码上冒险/ }, { timeout: 3000 });
    await user.click(screen.getByRole("button", { name: /走进档案馆/ }));
    await user.click(screen.getByRole("button", { name: /调取现场证据/ }));
    await user.click(screen.getByRole("button", { name: /领取委托/ }));

    await user.click(
      screen.getByRole("button", { name: /第 3 章 · 登录状态为什么丢/ }),
    );
    expect(
      screen.getByRole("button", { name: /进入第 3 章教学关卡/ }),
    ).toBeInTheDocument();
    await user.click(
      screen.getByRole("button", { name: /进入第 3 章教学关卡/ }),
    );

    expect(
      await screen.findByRole("heading", {
        name: /登录状态为什么会丢/,
      }),
    ).toBeInTheDocument();
    expect(screen.getByText(/Cookie、Token 和 Session/)).toBeInTheDocument();
    expect(screen.getByText(/GET \/me → 401/)).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/scenarios/identity-session-corridor",
      expect.any(Object),
    );

    await user.click(screen.getByRole("button", { name: /开始闯关/ }));
    expect(
      await screen.findByRole("heading", {
        name: /门牌发出来了，但谁来认它/,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/登录态从页面到后端验证的路线/),
    ).toBeInTheDocument();
    expect(screen.getByText(/登录表单 → 后端登录路由/)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /查看登录委托/ }));
    expect(
      screen.getByText(/后端发了一张以后可验证的凭证/),
    ).toBeInTheDocument();
    expect(screen.getAllByText(/Set-Cookie: sessionId=token/).length).toBe(2);
  });

  it("第 4 章从路线卷宗进入接口报错剧情关卡", async () => {
    const user = userEvent.setup();
    const fetchMock = vi.fn((input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input);
      if (url === "/api/health") return response({ status: "ok" });
      if (url === "/api/diagnostic-sessions") {
        return response(diagnosticActive, 201);
      }
      if (url === "/api/diagnostic-sessions/diagnostic-001") {
        return response(diagnosticCompleted);
      }
      if (url === "/api/attempts" && init?.method === "POST") {
        const body = JSON.parse(String(init.body ?? "{}")) as {
          scenarioId?: string;
        };
        return response(
          body.scenarioId === "api-error-court" ? case04Attempt : attempt,
          201,
        );
      }
      if (url === "/api/scenarios/canvas-save-persistence") {
        return response({ scenarioId: "canvas-save-persistence", artifacts });
      }
      if (url === "/api/scenarios/api-error-court") {
        return response({
          scenarioId: "api-error-court",
          artifacts: case04Artifacts,
        });
      }
      if (url.includes("/steps/baseline-plan")) {
        return response(attempt);
      }
      if (url.includes("/teaching")) return response([]);
      return response({ error: "NOT_FOUND", message: "unexpected" }, 404);
    });
    vi.stubGlobal("fetch", fetchMock);

    render(<App />);

    await screen.findByRole("heading", { name: /码上冒险/ }, { timeout: 3000 });
    await user.click(screen.getByRole("button", { name: /走进档案馆/ }));
    await user.click(screen.getByRole("button", { name: /调取现场证据/ }));
    await user.click(screen.getByRole("button", { name: /领取委托/ }));
    await user.click(
      screen.getByRole("button", { name: /第 4 章 · 接口为什么报错/ }),
    );

    expect(screen.getByText(/接口审判庭只丢出/)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /进入第 4 章教学关卡/ }),
    ).toBeInTheDocument();
    await user.click(
      screen.getByRole("button", { name: /进入第 4 章教学关卡/ }),
    );

    expect(
      await screen.findByRole("heading", {
        name: /接口为什么会报错/,
      }),
    ).toBeInTheDocument();
    expect(screen.getByText(/Network Payload/)).toBeInTheDocument();
    expect(screen.getByText(/400 \/ 500/)).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/scenarios/api-error-court",
      expect.any(Object),
    );

    await user.click(screen.getByRole("button", { name: /开始闯关/ }));
    expect(
      await screen.findByRole("heading", {
        name: /红色状态码不是一句“坏了”/,
      }),
    ).toBeInTheDocument();
    expect(screen.getByText(/接口失败从页面到日志的路线/)).toBeInTheDocument();
    expect(screen.getByText(/前端表单 → 接口路由/)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /查看申请表复印件/ }));
    expect(
      screen.getByText(/Payload 能证明前端实际发了哪些字段/),
    ).toBeInTheDocument();
    expect(screen.getByText(/TITLE_REQUIRED/)).toBeInTheDocument();
  });

  it("第 5 章从路线卷宗进入数据一致性剧情关卡", async () => {
    const user = userEvent.setup();
    const fetchMock = vi.fn((input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input);
      if (url === "/api/health") return response({ status: "ok" });
      if (url === "/api/diagnostic-sessions") {
        return response(diagnosticActive, 201);
      }
      if (url === "/api/diagnostic-sessions/diagnostic-001") {
        return response(diagnosticCompleted);
      }
      if (url === "/api/attempts" && init?.method === "POST") {
        const body = JSON.parse(String(init.body ?? "{}")) as {
          scenarioId?: string;
        };
        return response(
          body.scenarioId === "data-consistency-forge"
            ? case05Attempt
            : attempt,
          201,
        );
      }
      if (url === "/api/scenarios/canvas-save-persistence") {
        return response({ scenarioId: "canvas-save-persistence", artifacts });
      }
      if (url === "/api/scenarios/data-consistency-forge") {
        return response({
          scenarioId: "data-consistency-forge",
          artifacts: case05Artifacts,
        });
      }
      if (url.includes("/steps/baseline-plan")) {
        return response(attempt);
      }
      if (url.includes("/teaching")) return response([]);
      return response({ error: "NOT_FOUND", message: "unexpected" }, 404);
    });
    vi.stubGlobal("fetch", fetchMock);

    render(<App />);

    await screen.findByRole("heading", { name: /码上冒险/ }, { timeout: 3000 });
    await user.click(screen.getByRole("button", { name: /走进档案馆/ }));
    await user.click(screen.getByRole("button", { name: /调取现场证据/ }));
    await user.click(screen.getByRole("button", { name: /领取委托/ }));
    await user.click(
      screen.getByRole("button", { name: /第 5 章 · 数据为什么重复/ }),
    );

    expect(screen.getByText(/一致性熔炉被连敲三下/)).toBeInTheDocument();
    expect(screen.getAllByText(/幂等石灵/).length).toBeGreaterThan(0);
    expect(screen.getByAltText("幂等石灵")).toHaveAttribute(
      "src",
      expect.stringContaining("pet-idempotency-stone-v2"),
    );
    expect(
      screen.getByRole("button", { name: /进入第 5 章教学关卡/ }),
    ).toBeInTheDocument();
    await user.click(
      screen.getByRole("button", { name: /进入第 5 章教学关卡/ }),
    );

    expect(
      await screen.findByRole("heading", {
        name: /数据为什么重复\/错乱/,
      }),
    ).toBeInTheDocument();
    expect(screen.getAllByText(/Idempotency-Key/).length).toBeGreaterThan(0);
    expect(screen.getByText(/SELECT count\(\*\) → 1/)).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/scenarios/data-consistency-forge",
      expect.any(Object),
    );

    await user.click(screen.getByRole("button", { name: /开始闯关/ }));
    expect(
      await screen.findByRole("heading", {
        name: /同一锤，不该敲出三把剑/,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/重复提交从页面到数据库的路线/),
    ).toBeInTheDocument();
    expect(screen.getByText(/前端按钮 → 后端接口/)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /查看连点现场/ }));
    expect(screen.getByText(/同一动作被重复送到了后端/)).toBeInTheDocument();
    expect(screen.getAllByText(/POST \/api\/orders/).length).toBeGreaterThan(0);
  });

  it("第 6 章从路线卷宗进入性能排查剧情关卡", async () => {
    const user = userEvent.setup();
    const fetchMock = vi.fn((input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input);
      if (url === "/api/health") return response({ status: "ok" });
      if (url === "/api/diagnostic-sessions") {
        return response(diagnosticActive, 201);
      }
      if (url === "/api/diagnostic-sessions/diagnostic-001") {
        return response(diagnosticCompleted);
      }
      if (url === "/api/attempts" && init?.method === "POST") {
        const body = JSON.parse(String(init.body ?? "{}")) as {
          scenarioId?: string;
        };
        return response(
          body.scenarioId === "performance-fog-lab" ? case06Attempt : attempt,
          201,
        );
      }
      if (url === "/api/scenarios/canvas-save-persistence") {
        return response({ scenarioId: "canvas-save-persistence", artifacts });
      }
      if (url === "/api/scenarios/performance-fog-lab") {
        return response({
          scenarioId: "performance-fog-lab",
          artifacts: case06Artifacts,
        });
      }
      if (url.includes("/steps/baseline-plan")) {
        return response(attempt);
      }
      if (url.includes("/teaching")) return response([]);
      return response({ error: "NOT_FOUND", message: "unexpected" }, 404);
    });
    vi.stubGlobal("fetch", fetchMock);

    render(<App />);

    await screen.findByRole("heading", { name: /码上冒险/ }, { timeout: 3000 });
    await user.click(screen.getByRole("button", { name: /走进档案馆/ }));
    await user.click(screen.getByRole("button", { name: /调取现场证据/ }));
    await user.click(screen.getByRole("button", { name: /领取委托/ }));
    await user.click(
      screen.getByRole("button", { name: /第 6 章 · 页面为什么慢/ }),
    );

    expect(screen.getByText(/慢速迷雾笼罩页面/)).toBeInTheDocument();
    expect(screen.getAllByText(/雾灯猫/).length).toBeGreaterThan(0);
    expect(screen.getByAltText("雾灯猫")).toHaveAttribute(
      "src",
      expect.stringContaining("pet-foglamp-cat-v2"),
    );
    expect(
      screen.getByRole("button", { name: /进入第 6 章教学关卡/ }),
    ).toBeInTheDocument();
    await user.click(
      screen.getByRole("button", { name: /进入第 6 章教学关卡/ }),
    );

    expect(
      await screen.findByRole("heading", {
        name: /页面为什么慢/,
      }),
    ).toBeInTheDocument();
    expect(screen.getAllByText(/Network 瀑布图/).length).toBeGreaterThan(0);
    expect(screen.getByText(/TTFB \+ 后端日志/)).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/scenarios/performance-fog-lab",
      expect.any(Object),
    );

    await user.click(screen.getByRole("button", { name: /开始闯关/ }));
    expect(
      await screen.findByRole("heading", {
        name: /别急着优化，先点亮时间账本/,
      }),
    ).toBeInTheDocument();
    expect(screen.getByText(/页面变慢从用户到复测的路线/)).toBeInTheDocument();
    expect(screen.getByText(/浏览器 → Network 瀑布图/)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /记录用户体感/ }));
    expect(screen.getByText(/把抱怨翻译成可观察现象/)).toBeInTheDocument();
    expect(screen.getByText(/首次打开项目列表/)).toBeInTheDocument();
  });

  it("第 7 章从路线卷宗进入 AI API 安全接入剧情关卡", async () => {
    const user = userEvent.setup();
    const fetchMock = vi.fn((input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input);
      if (url === "/api/health") return response({ status: "ok" });
      if (url === "/api/diagnostic-sessions") {
        return response(diagnosticActive, 201);
      }
      if (url === "/api/diagnostic-sessions/diagnostic-001") {
        return response(diagnosticCompleted);
      }
      if (url === "/api/attempts" && init?.method === "POST") {
        const body = JSON.parse(String(init.body ?? "{}")) as {
          scenarioId?: string;
        };
        return response(
          body.scenarioId === "ai-api-key-vault" ? case07Attempt : attempt,
          201,
        );
      }
      if (url === "/api/scenarios/canvas-save-persistence") {
        return response({ scenarioId: "canvas-save-persistence", artifacts });
      }
      if (url === "/api/scenarios/ai-api-key-vault") {
        return response({
          scenarioId: "ai-api-key-vault",
          artifacts: case07Artifacts,
        });
      }
      if (url.includes("/steps/baseline-plan")) {
        return response(case07Attempt);
      }
      if (url.includes("/teaching")) return response([]);
      return response({ error: "NOT_FOUND", message: "unexpected" }, 404);
    });
    vi.stubGlobal("fetch", fetchMock);

    render(<App />);

    await screen.findByRole("heading", { name: /码上冒险/ }, { timeout: 3000 });
    await user.click(screen.getByRole("button", { name: /走进档案馆/ }));
    await user.click(screen.getByRole("button", { name: /调取现场证据/ }));
    await user.click(screen.getByRole("button", { name: /领取委托/ }));
    await user.click(
      screen.getByRole("button", { name: /第 7 章 · AI 接口怎么接/ }),
    );

    expect(screen.getByText(/模型熔炉需要密钥才能点火/)).toBeInTheDocument();
    expect(screen.getAllByText(/密钥匣/).length).toBeGreaterThan(0);
    expect(screen.getByAltText("模型熔炉执钥人")).toHaveAttribute(
      "src",
      expect.stringContaining("portrait-model-warden-v2"),
    );
    expect(
      screen.getByRole("button", { name: /进入第 7 章教学关卡/ }),
    ).toBeInTheDocument();
    await user.click(
      screen.getByRole("button", { name: /进入第 7 章教学关卡/ }),
    );

    expect(
      await screen.findByRole("heading", {
        name: /AI 接口怎么接/,
      }),
    ).toBeInTheDocument();
    expect(screen.getByText(/server-only API Key/)).toBeInTheDocument();
    expect(screen.getByText(/stream reader \+ fallback/)).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/scenarios/ai-api-key-vault",
      expect.any(Object),
    );

    await user.click(screen.getByRole("button", { name: /开始闯关/ }));
    expect(
      await screen.findByRole("heading", {
        name: /钥匙不在舞台上/,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/AI 请求从用户到模型再回到页面的路线/),
    ).toBeInTheDocument();
    expect(screen.getByText(/前端页面 → 本地后端接口/)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /查看用户委托/ }));
    expect(screen.getByText(/前端只请求自己的后端接口/)).toBeInTheDocument();
    expect(screen.getAllByText(/POST \/api\/ai\/chat/).length).toBeGreaterThan(
      0,
    );
  });

  it("第 8 章从路线卷宗进入幻觉控制剧情关卡", async () => {
    const user = userEvent.setup();
    const fetchMock = vi.fn((input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input);
      if (url === "/api/health") return response({ status: "ok" });
      if (url === "/api/diagnostic-sessions") {
        return response(diagnosticActive, 201);
      }
      if (url === "/api/diagnostic-sessions/diagnostic-001") {
        return response(diagnosticCompleted);
      }
      if (url === "/api/attempts" && init?.method === "POST") {
        const body = JSON.parse(String(init.body ?? "{}")) as {
          scenarioId?: string;
        };
        return response(
          body.scenarioId === "hallucination-mirror-hall"
            ? case08Attempt
            : attempt,
          201,
        );
      }
      if (url === "/api/scenarios/canvas-save-persistence") {
        return response({ scenarioId: "canvas-save-persistence", artifacts });
      }
      if (url === "/api/scenarios/hallucination-mirror-hall") {
        return response({
          scenarioId: "hallucination-mirror-hall",
          artifacts: case08Artifacts,
        });
      }
      if (url.includes("/steps/baseline-plan")) {
        return response(case08Attempt);
      }
      if (url.includes("/teaching")) return response([]);
      return response({ error: "NOT_FOUND", message: "unexpected" }, 404);
    });
    vi.stubGlobal("fetch", fetchMock);

    render(<App />);

    await screen.findByRole("heading", { name: /码上冒险/ }, { timeout: 3000 });
    await user.click(screen.getByRole("button", { name: /走进档案馆/ }));
    await user.click(screen.getByRole("button", { name: /调取现场证据/ }));
    await user.click(screen.getByRole("button", { name: /领取委托/ }));
    await user.click(
      screen.getByRole("button", { name: /第 8 章 · AI 回复为什么胡说/ }),
    );

    expect(screen.getByText(/幻觉镜厅里的 AI 说得很顺/)).toBeInTheDocument();
    expect(screen.getAllByText(/镜厅校对师/).length).toBeGreaterThan(0);
    expect(screen.getByAltText("镜厅校对师")).toHaveAttribute(
      "src",
      expect.stringContaining("portrait-mirror-editor-v2"),
    );
    expect(
      screen.getByRole("button", { name: /进入第 8 章教学关卡/ }),
    ).toBeInTheDocument();
    await user.click(
      screen.getByRole("button", { name: /进入第 8 章教学关卡/ }),
    );

    expect(
      await screen.findByRole("heading", {
        name: /AI 回复为什么胡说/,
      }),
    ).toBeInTheDocument();
    expect(screen.getByText(/grounded Prompt/)).toBeInTheDocument();
    expect(screen.getByText(/context chunks \+ citations/)).toBeInTheDocument();
    expect(screen.getByText(/无资料时拒答/)).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/scenarios/hallucination-mirror-hall",
      expect.any(Object),
    );

    await user.click(screen.getByRole("button", { name: /开始闯关/ }));
    expect(
      await screen.findByRole("heading", {
        name: /镜子会补全空白/,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/AI 回答从问题到引用校验的路线/),
    ).toBeInTheDocument();
    expect(screen.getByText(/用户 → Prompt 委托书/)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /阅读镜厅委托书/ }));
    expect(screen.getAllByText(/只根据 context 回答/).length).toBeGreaterThan(
      0,
    );
    expect(
      screen.getAllByText(/每句话必须对应 citation/).length,
    ).toBeGreaterThan(0);
  });

  it("第 9 章从路线卷宗进入 RAG 知识库剧情关卡", async () => {
    const user = userEvent.setup();
    const fetchMock = vi.fn((input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input);
      if (url === "/api/health") return response({ status: "ok" });
      if (url === "/api/diagnostic-sessions") {
        return response(diagnosticActive, 201);
      }
      if (url === "/api/diagnostic-sessions/diagnostic-001") {
        return response(diagnosticCompleted);
      }
      if (url === "/api/attempts" && init?.method === "POST") {
        const body = JSON.parse(String(init.body ?? "{}")) as {
          scenarioId?: string;
        };
        return response(
          body.scenarioId === "rag-knowledge-maze" ? case09Attempt : attempt,
          201,
        );
      }
      if (url === "/api/scenarios/canvas-save-persistence") {
        return response({ scenarioId: "canvas-save-persistence", artifacts });
      }
      if (url === "/api/scenarios/rag-knowledge-maze") {
        return response({
          scenarioId: "rag-knowledge-maze",
          artifacts: case09Artifacts,
        });
      }
      if (url.includes("/steps/baseline-plan")) {
        return response(case09Attempt);
      }
      if (url.includes("/teaching")) return response([]);
      return response({ error: "NOT_FOUND", message: "unexpected" }, 404);
    });
    vi.stubGlobal("fetch", fetchMock);

    render(<App />);

    await screen.findByRole("heading", { name: /码上冒险/ }, { timeout: 3000 });
    await user.click(screen.getByRole("button", { name: /走进档案馆/ }));
    await user.click(screen.getByRole("button", { name: /调取现场证据/ }));
    await user.click(screen.getByRole("button", { name: /领取委托/ }));
    await user.click(
      screen.getByRole("button", { name: /第 9 章 · RAG 知识库/ }),
    );

    expect(screen.getByText(/知识迷宫藏着答案/)).toBeInTheDocument();
    expect(screen.getAllByText(/检索狐/).length).toBeGreaterThan(0);
    expect(
      screen.getByRole("button", { name: /进入第 9 章教学关卡/ }),
    ).toBeInTheDocument();
    await user.click(
      screen.getByRole("button", { name: /进入第 9 章教学关卡/ }),
    );

    expect(
      await screen.findByRole("heading", {
        name: /RAG 知识库/,
      }),
    ).toBeInTheDocument();
    expect(screen.getByText(/source \+ chunk id/)).toBeInTheDocument();
    expect(screen.getByText(/topK matches \+ score/)).toBeInTheDocument();
    expect(screen.getByText(/citations 指回原文/)).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/scenarios/rag-knowledge-maze",
      expect.any(Object),
    );

    await user.click(screen.getByRole("button", { name: /开始闯关/ }));
    expect(
      await screen.findByRole("heading", {
        name: /答案不在模型脑子里/,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/RAG 资料从文档到回答引用的路线/),
    ).toBeInTheDocument();
    expect(screen.getByText(/原始资料 → 知识库入口/)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /查看资料来源/ }));
    expect(screen.getByText(/docs\/refund-policy\.md/)).toBeInTheDocument();
    expect(screen.getByText(/AI 不能空口说/)).toBeInTheDocument();
  });

  it("第 10 章从路线卷宗进入 Agent 工具调用剧情关卡", async () => {
    const user = userEvent.setup();
    const fetchMock = vi.fn((input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input);
      if (url === "/api/health") return response({ status: "ok" });
      if (url === "/api/diagnostic-sessions") {
        return response(diagnosticActive, 201);
      }
      if (url === "/api/diagnostic-sessions/diagnostic-001") {
        return response(diagnosticCompleted);
      }
      if (url === "/api/attempts" && init?.method === "POST") {
        const body = JSON.parse(String(init.body ?? "{}")) as {
          scenarioId?: string;
        };
        return response(
          body.scenarioId === "agent-tool-tower" ? case10Attempt : attempt,
          201,
        );
      }
      if (url === "/api/scenarios/canvas-save-persistence") {
        return response({ scenarioId: "canvas-save-persistence", artifacts });
      }
      if (url === "/api/scenarios/agent-tool-tower") {
        return response({
          scenarioId: "agent-tool-tower",
          artifacts: case10Artifacts,
        });
      }
      if (url.includes("/steps/baseline-plan")) {
        return response(case10Attempt);
      }
      if (url.includes("/teaching")) return response([]);
      return response({ error: "NOT_FOUND", message: "unexpected" }, 404);
    });
    vi.stubGlobal("fetch", fetchMock);

    render(<App />);

    await screen.findByRole("heading", { name: /码上冒险/ }, { timeout: 3000 });
    await user.click(screen.getByRole("button", { name: /走进档案馆/ }));
    await user.click(screen.getByRole("button", { name: /调取现场证据/ }));
    await user.click(screen.getByRole("button", { name: /领取委托/ }));
    await user.click(
      screen.getByRole("button", { name: /第 10 章 · Agent 工具调用/ }),
    );

    expect(
      screen.getByText(/Agent 高塔的副官拿到了工具钥匙/),
    ).toBeInTheDocument();
    expect(screen.getAllByText(/塔楼副官/).length).toBeGreaterThan(0);
    expect(screen.getByAltText("塔楼副官")).toHaveAttribute(
      "src",
      expect.stringContaining("portrait-tool-warden-v2"),
    );
    expect(
      screen.getByRole("button", { name: /进入第 10 章教学关卡/ }),
    ).toBeInTheDocument();
    await user.click(
      screen.getByRole("button", { name: /进入第 10 章教学关卡/ }),
    );

    expect(
      await screen.findByRole("heading", {
        name: /Agent 工具调用/,
      }),
    ).toBeInTheDocument();
    expect(screen.getByText(/tool registry/)).toBeInTheDocument();
    expect(screen.getByText(/schema \+ permission/)).toBeInTheDocument();
    expect(screen.getByText(/TOOL_FAILED \+ requestId/)).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/scenarios/agent-tool-tower",
      expect.any(Object),
    );

    await user.click(screen.getByRole("button", { name: /开始闯关/ }));
    expect(
      await screen.findByRole("heading", {
        name: /副官不能凭空拿钥匙/,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Agent 工具从计划到受控执行的路线/),
    ).toBeInTheDocument();
    expect(screen.getByText(/用户目标 → Agent 计划/)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /查看工具清单/ }));
    expect(screen.getAllByText(/searchOrders/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/orders:read/).length).toBeGreaterThan(0);
  });

  it("第 11 章从路线卷宗进入测试验收剧情关卡", async () => {
    const user = userEvent.setup();
    const fetchMock = vi.fn((input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input);
      if (url === "/api/health") return response({ status: "ok" });
      if (url === "/api/diagnostic-sessions") {
        return response(diagnosticActive, 201);
      }
      if (url === "/api/diagnostic-sessions/diagnostic-001") {
        return response(diagnosticCompleted);
      }
      if (url === "/api/attempts" && init?.method === "POST") {
        const body = JSON.parse(String(init.body ?? "{}")) as {
          scenarioId?: string;
        };
        return response(
          body.scenarioId === "verification-trial-arena"
            ? case11Attempt
            : attempt,
          201,
        );
      }
      if (url === "/api/scenarios/canvas-save-persistence") {
        return response({ scenarioId: "canvas-save-persistence", artifacts });
      }
      if (url === "/api/scenarios/verification-trial-arena") {
        return response({
          scenarioId: "verification-trial-arena",
          artifacts: case11Artifacts,
        });
      }
      if (url.includes("/steps/baseline-plan")) {
        return response(case11Attempt);
      }
      if (url.includes("/teaching")) return response([]);
      return response({ error: "NOT_FOUND", message: "unexpected" }, 404);
    });
    vi.stubGlobal("fetch", fetchMock);

    render(<App />);

    await screen.findByRole("heading", { name: /码上冒险/ }, { timeout: 3000 });
    await user.click(screen.getByRole("button", { name: /走进档案馆/ }));
    await user.click(screen.getByRole("button", { name: /调取现场证据/ }));
    await user.click(screen.getByRole("button", { name: /领取委托/ }));
    await user.click(
      screen.getByRole("button", {
        name: /第 11 章 · 测试怎么证明修好了/,
      }),
    );

    expect(screen.getByText(/验收仪式厅不接受口头承诺/)).toBeInTheDocument();
    expect(screen.getAllByText(/验收试炼官/).length).toBeGreaterThan(0);
    expect(screen.getByAltText("验收试炼官")).toHaveAttribute(
      "src",
      expect.stringContaining("portrait-test-arbiter-v2"),
    );
    expect(
      screen.getByRole("button", { name: /进入第 11 章教学关卡/ }),
    ).toBeInTheDocument();
    await user.click(
      screen.getByRole("button", { name: /进入第 11 章教学关卡/ }),
    );

    expect(
      await screen.findByRole("heading", {
        name: /测试怎么证明修好了/,
      }),
    ).toBeInTheDocument();
    expect(screen.getByText(/red → green/)).toBeInTheDocument();
    expect(screen.getByText(/unit \+ integration/)).toBeInTheDocument();
    expect(screen.getByText(/generatedAt \+ fingerprint/)).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/scenarios/verification-trial-arena",
      expect.any(Object),
    );

    await user.click(screen.getByRole("button", { name: /开始闯关/ }));
    expect(
      await screen.findByRole("heading", {
        name: /先让旧故障现形/,
      }),
    ).toBeInTheDocument();
    expect(screen.getByText(/可信验收从复现到报告的路线/)).toBeInTheDocument();
    expect(screen.getByText(/故障现象 → 复现用例/)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /复现旧故障/ }));
    expect(screen.getAllByText(/postJson/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/getJson/).length).toBeGreaterThan(0);
  });

  it("第 12 章从路线卷宗进入 Agent 委托书剧情关卡", async () => {
    const user = userEvent.setup();
    const fetchMock = vi.fn((input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input);
      if (url === "/api/health") return response({ status: "ok" });
      if (url === "/api/diagnostic-sessions") {
        return response(diagnosticActive, 201);
      }
      if (url === "/api/diagnostic-sessions/diagnostic-001") {
        return response(diagnosticCompleted);
      }
      if (url === "/api/attempts" && init?.method === "POST") {
        const body = JSON.parse(String(init.body ?? "{}")) as {
          scenarioId?: string;
        };
        return response(
          body.scenarioId === "agent-brief-forge" ? case12Attempt : attempt,
          201,
        );
      }
      if (url === "/api/scenarios/canvas-save-persistence") {
        return response({ scenarioId: "canvas-save-persistence", artifacts });
      }
      if (url === "/api/scenarios/agent-brief-forge") {
        return response({
          scenarioId: "agent-brief-forge",
          artifacts: case12Artifacts,
        });
      }
      if (url.includes("/steps/baseline-plan")) {
        return response(case12Attempt);
      }
      if (url.includes("/teaching")) return response([]);
      return response({ error: "NOT_FOUND", message: "unexpected" }, 404);
    });
    vi.stubGlobal("fetch", fetchMock);

    render(<App />);

    await screen.findByRole("heading", { name: /码上冒险/ }, { timeout: 3000 });
    await user.click(screen.getByRole("button", { name: /走进档案馆/ }));
    await user.click(screen.getByRole("button", { name: /调取现场证据/ }));
    await user.click(screen.getByRole("button", { name: /领取委托/ }));
    await user.click(
      screen.getByRole("button", {
        name: /第 12 章 · Agent 任务怎么写/,
      }),
    );

    expect(
      screen.getByText(/模糊命令会把副官带向错误房间/),
    ).toBeInTheDocument();
    expect(screen.getAllByText(/委托书锻造师/).length).toBeGreaterThan(0);
    expect(screen.getByAltText("委托书锻造师")).toHaveAttribute(
      "src",
      expect.stringContaining("portrait-brief-forgemaster-v2"),
    );
    expect(
      screen.getByRole("button", { name: /进入第 12 章教学关卡/ }),
    ).toBeInTheDocument();
    await user.click(
      screen.getByRole("button", { name: /进入第 12 章教学关卡/ }),
    );

    expect(
      await screen.findByRole("heading", {
        name: /Agent 任务怎么写/,
      }),
    ).toBeInTheDocument();
    expect(screen.getByText(/现象 \+ 证据/)).toBeInTheDocument();
    expect(screen.getByText(/scope \+ constraints/)).toBeInTheDocument();
    expect(screen.getByText(/verify \+ browser path/)).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/scenarios/agent-brief-forge",
      expect.any(Object),
    );

    await user.click(screen.getByRole("button", { name: /开始闯关/ }));
    expect(
      await screen.findByRole("heading", {
        name: /一句“你自己看着办”/,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Agent 委托从现场到验收的路线/),
    ).toBeInTheDocument();
    expect(screen.getByText(/问题现场 → 任务背景/)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /拆开坏委托/ }));
    expect(
      screen.getAllByText(/帮我把这个项目优化一下/).length,
    ).toBeGreaterThan(0);
    expect(screen.getAllByText(/背景 \/ 目标 \/ 约束/).length).toBeGreaterThan(
      0,
    );
  });

  it("第 13 章从路线卷宗进入交付审查剧情关卡", async () => {
    const user = userEvent.setup();
    const fetchMock = vi.fn((input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input);
      if (url === "/api/health") return response({ status: "ok" });
      if (url === "/api/diagnostic-sessions") {
        return response(diagnosticActive, 201);
      }
      if (url === "/api/diagnostic-sessions/diagnostic-001") {
        return response(diagnosticCompleted);
      }
      if (url === "/api/attempts" && init?.method === "POST") {
        const body = JSON.parse(String(init.body ?? "{}")) as {
          scenarioId?: string;
        };
        return response(
          body.scenarioId === "delivery-review-court" ? case13Attempt : attempt,
          201,
        );
      }
      if (url === "/api/scenarios/canvas-save-persistence") {
        return response({ scenarioId: "canvas-save-persistence", artifacts });
      }
      if (url === "/api/scenarios/delivery-review-court") {
        return response({
          scenarioId: "delivery-review-court",
          artifacts: case13Artifacts,
        });
      }
      if (url.includes("/steps/baseline-plan")) {
        return response(case13Attempt);
      }
      if (url.includes("/teaching")) return response([]);
      return response({ error: "NOT_FOUND", message: "unexpected" }, 404);
    });
    vi.stubGlobal("fetch", fetchMock);

    render(<App />);

    await screen.findByRole("heading", { name: /码上冒险/ }, { timeout: 3000 });
    await user.click(screen.getByRole("button", { name: /走进档案馆/ }));
    await user.click(screen.getByRole("button", { name: /调取现场证据/ }));
    await user.click(screen.getByRole("button", { name: /领取委托/ }));
    await user.click(
      screen.getByRole("button", {
        name: /第 13 章 · 怎么审查交付/,
      }),
    );

    expect(screen.getByText(/漂亮说明/)).toBeInTheDocument();
    expect(screen.getAllByText(/交付审查官/).length).toBeGreaterThan(0);
    expect(screen.getByAltText("交付审查官")).toHaveAttribute(
      "src",
      expect.stringContaining("portrait-delivery-judge-v2"),
    );
    expect(
      screen.getByRole("button", { name: /进入第 13 章教学关卡/ }),
    ).toBeInTheDocument();
    await user.click(
      screen.getByRole("button", { name: /进入第 13 章教学关卡/ }),
    );

    expect(
      await screen.findByRole("heading", {
        name: /怎么审查 Agent 交付/,
      }),
    ).toBeInTheDocument();
    expect(screen.getByText(/delivery note/)).toBeInTheDocument();
    expect(screen.getByText(/diff \+ tests/)).toBeInTheDocument();
    expect(screen.getByText(/accept \/ request changes/)).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/scenarios/delivery-review-court",
      expect.any(Object),
    );

    await user.click(screen.getByRole("button", { name: /开始闯关/ }));
    expect(
      await screen.findByRole("heading", {
        name: /漂亮结案陈词/,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Agent 交付从说明到接收决定的路线/),
    ).toBeInTheDocument();
    expect(screen.getByText(/Agent 交付 → 交付说明/)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /核对交付说明/ }));
    expect(screen.getAllByText(/npm run verify/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/回归风险/).length).toBeGreaterThan(0);
  });

  it("第 14 章从路线卷宗进入上线前夜剧情关卡", async () => {
    const user = userEvent.setup();
    const fetchMock = vi.fn((input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input);
      if (url === "/api/health") return response({ status: "ok" });
      if (url === "/api/diagnostic-sessions") {
        return response(diagnosticActive, 201);
      }
      if (url === "/api/diagnostic-sessions/diagnostic-001") {
        return response(diagnosticCompleted);
      }
      if (url === "/api/attempts" && init?.method === "POST") {
        const body = JSON.parse(String(init.body ?? "{}")) as {
          scenarioId?: string;
        };
        return response(
          body.scenarioId === "release-readiness-gate"
            ? case14Attempt
            : attempt,
          201,
        );
      }
      if (url === "/api/scenarios/canvas-save-persistence") {
        return response({ scenarioId: "canvas-save-persistence", artifacts });
      }
      if (url === "/api/scenarios/release-readiness-gate") {
        return response({
          scenarioId: "release-readiness-gate",
          artifacts: case14Artifacts,
        });
      }
      if (url.includes("/steps/baseline-plan")) {
        return response(case14Attempt);
      }
      if (url.includes("/teaching")) return response([]);
      return response({ error: "NOT_FOUND", message: "unexpected" }, 404);
    });
    vi.stubGlobal("fetch", fetchMock);

    render(<App />);

    await screen.findByRole("heading", { name: /码上冒险/ }, { timeout: 3000 });
    await user.click(screen.getByRole("button", { name: /走进档案馆/ }));
    await user.click(screen.getByRole("button", { name: /调取现场证据/ }));
    await user.click(screen.getByRole("button", { name: /领取委托/ }));
    await user.click(
      screen.getByRole("button", {
        name: /第 14 章 · 上线前检查什么/,
      }),
    );

    expect(screen.getAllByText(/上线城门/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/上线守门人/).length).toBeGreaterThan(0);
    expect(screen.getByAltText("上线守门人")).toHaveAttribute(
      "src",
      expect.stringContaining("portrait-release-gatekeeper-v2"),
    );
    expect(
      screen.getByRole("button", { name: /进入第 14 章教学关卡/ }),
    ).toBeInTheDocument();
    await user.click(
      screen.getByRole("button", { name: /进入第 14 章教学关卡/ }),
    );

    expect(
      await screen.findByRole("heading", {
        name: /上线前检查什么/,
      }),
    ).toBeInTheDocument();
    expect(screen.getByText(/release checklist/)).toBeInTheDocument();
    expect(screen.getByText(/env \+ backup \+ monitoring/)).toBeInTheDocument();
    expect(screen.getByText(/rollback \+ smoke test/)).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/scenarios/release-readiness-gate",
      expect.any(Object),
    );

    await user.click(screen.getByRole("button", { name: /开始闯关/ }));
    expect(
      await screen.findByRole("heading", {
        name: /城门要开/,
      }),
    ).toBeInTheDocument();
    expect(screen.getByText(/上线从交付到回滚决定的路线/)).toBeInTheDocument();
    expect(screen.getByText(/已审查交付 → 上线计划/)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /打开上线卷轴/ }));
    expect(screen.getAllByText(/发布窗口/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/回滚条件/).length).toBeGreaterThan(0);
  });

  it("第 15 章从路线卷宗进入终章答辩剧情关卡", async () => {
    const user = userEvent.setup();
    const fetchMock = vi.fn((input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input);
      if (url === "/api/health") return response({ status: "ok" });
      if (url === "/api/diagnostic-sessions") {
        return response(diagnosticActive, 201);
      }
      if (url === "/api/diagnostic-sessions/diagnostic-001") {
        return response(diagnosticCompleted);
      }
      if (url === "/api/attempts" && init?.method === "POST") {
        const body = JSON.parse(String(init.body ?? "{}")) as {
          scenarioId?: string;
        };
        return response(
          body.scenarioId === "interview-answer-forge"
            ? case15Attempt
            : attempt,
          201,
        );
      }
      if (url === "/api/scenarios/canvas-save-persistence") {
        return response({ scenarioId: "canvas-save-persistence", artifacts });
      }
      if (url === "/api/scenarios/interview-answer-forge") {
        return response({
          scenarioId: "interview-answer-forge",
          artifacts: case15Artifacts,
        });
      }
      if (url.includes("/steps/baseline-plan")) {
        return response(case15Attempt);
      }
      if (url.includes("/teaching")) return response([]);
      return response({ error: "NOT_FOUND", message: "unexpected" }, 404);
    });
    vi.stubGlobal("fetch", fetchMock);

    render(<App />);

    await screen.findByRole("heading", { name: /码上冒险/ }, { timeout: 3000 });
    await user.click(screen.getByRole("button", { name: /走进档案馆/ }));
    await user.click(screen.getByRole("button", { name: /调取现场证据/ }));
    await user.click(screen.getByRole("button", { name: /领取委托/ }));
    await user.click(
      screen.getByRole("button", {
        name: /第 15 章 · 面试怎么讲项目/,
      }),
    );

    expect(screen.getAllByText(/面试议会/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/终章答辩官/).length).toBeGreaterThan(0);
    expect(screen.getByAltText("终章答辩官")).toHaveAttribute(
      "src",
      expect.stringContaining("portrait-interview-councilor-v2"),
    );
    expect(
      screen.getByRole("button", { name: /进入第 15 章教学关卡/ }),
    ).toBeInTheDocument();
    await user.click(
      screen.getByRole("button", { name: /进入第 15 章教学关卡/ }),
    );

    expect(
      await screen.findByRole("heading", {
        name: /面试怎么讲项目/,
      }),
    ).toBeInTheDocument();
    expect(screen.getByText(/STAR \+ incident review/)).toBeInTheDocument();
    expect(screen.getByText(/tradeoff \+ boundary/)).toBeInTheDocument();
    expect(screen.getByText(/follow-up ready answer/)).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/scenarios/interview-answer-forge",
      expect.any(Object),
    );

    await user.click(screen.getByRole("button", { name: /开始闯关/ }));
    expect(
      await screen.findByRole("heading", {
        name: /证据不是简历装饰/,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/面试回答从证据到追问定稿的路线/),
    ).toBeInTheDocument();
    expect(screen.getByText(/通关记录 → 关卡证据/)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /收集通关证据/ }));
    expect(screen.getAllByText(/保存丢失/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/STAR/).length).toBeGreaterThan(0);
  });

  it("进入主线后进入教学地图，并显示安全边界", async () => {
    const user = userEvent.setup();
    let completed = false;
    vi.stubGlobal(
      "fetch",
      vi.fn((input: RequestInfo | URL, init?: RequestInit) => {
        const url = String(input);
        if (url === "/api/health") return response({ status: "ok" });
        if (url === "/api/diagnostic-sessions") {
          return response(
            completed ? diagnosticCompleted : diagnosticActive,
            201,
          );
        }
        if (url === "/api/diagnostic-sessions/diagnostic-001") {
          completed = true;
          return response(diagnosticCompleted);
        }
        if (url === "/api/attempts" && init?.method === "POST") {
          return response(attempt, 201);
        }
        if (url === "/api/scenarios/canvas-save-persistence") {
          return response({ scenarioId: "canvas-save-persistence", artifacts });
        }
        if (url.includes("/steps/inspect-evidence")) {
          return response({
            ...attempt,
            steps: {
              "inspect-evidence": {
                response: { text: "已保存项目材料证据说明。" },
                savedAt: "2026-06-30T00:00:00Z",
              },
            },
          });
        }
        if (url.includes("/steps/baseline-plan")) {
          return response({
            ...attempt,
            steps: {
              "baseline-plan": {
                response: { firstChecks: "已封存" },
                savedAt: "2026-06-30T00:00:00Z",
              },
            },
          });
        }
        // 教学桥进度：未完成 → 显示教学桥
        if (url.includes("/teaching")) {
          return response([]);
        }
        return response({ error: "NOT_FOUND", message: "unexpected" }, 404);
      }),
    );

    render(<App />);

    // 职业路线封面 → 剧情选择 → 主线入口
    await enterMainQuest(user);

    // 自动创建任务记录，直接进入教学桥
    expect(await screen.findByText(/AI 开发主线/)).toBeInTheDocument();

    // 点击教学桥的「开始闯关」进入剧情探索
    const teachStartBtn = screen.getByRole("button", { name: /开始闯关/ });
    await user.click(teachStartBtn);

    expect(
      await screen.findByRole("heading", {
        name: /灯亮了，但戏还没演完/,
      }),
    ).toBeInTheDocument();
    expect(screen.getAllByText(/前端舞台/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/保存数据的完整旅行路线/)).toBeInTheDocument();
    expect(screen.getByText(/用户 → 前端页面/)).toBeInTheDocument();
    expect(screen.getByLabelText("本章地点航线")).toHaveTextContent("前端舞台");
    expect(screen.getByLabelText("本章地点航线")).toHaveTextContent("传送门");
    expect(screen.getByLabelText("本幕任务契约")).toHaveTextContent(
      "现在在哪前端舞台",
    );
    expect(screen.getByLabelText("本幕任务契约")).toHaveTextContent(
      "找到后交给前端页面",
    );
    expect(screen.getByLabelText("本幕任务契约")).toHaveTextContent(
      "真实工作现场",
    );
    expect(screen.getByLabelText("本幕任务契约")).toHaveTextContent("保存失败");

    const firstClueButton = screen.getByRole("button", {
      name: /检查绿色灯牌/,
    });
    await user.click(firstClueButton);
    expect(screen.getAllByText(/界面反馈/).length).toBeGreaterThan(0);
    expect(screen.getByText(/前端页面 → 后端接口/)).toBeInTheDocument();
    expect(
      screen.getAllByText(/response.ok 不是“继续传东西”/).length,
    ).toBeGreaterThan(0);
    expect(screen.getByLabelText("伙伴线索回应")).toHaveTextContent(
      "档案馆记录员 · 线索回应",
    );
    expect(screen.getByLabelText("伙伴线索回应")).toHaveTextContent(
      "学会区分“界面反馈”和“真实副作用”",
    );
    expect(screen.getByText("档案馆记录员默契")).toBeInTheDocument();
    expect(screen.getByText("1/2")).toBeInTheDocument();
    expect(screen.getByText(/卷宗已收录/)).toBeInTheDocument();
    expect(firstClueButton).toBeEnabled();
    await user.click(firstClueButton);
    expect(
      screen.getAllByText(/前端先把数据发给后端接口/).length,
    ).toBeGreaterThan(0);
    await user.click(screen.getByRole("button", { name: /追踪发出的委托/ }));
    expect(screen.getByText(/本幕收获/)).toBeInTheDocument();
    expect(screen.getByText(/前端舞台 已完成/)).toBeInTheDocument();
    expect(
      screen.getByText(/学会区分“界面反馈”和“真实副作用”/),
    ).toBeInTheDocument();
    expect(
      screen.getAllByText(/知道前端只负责发请求和呈现结果/).length,
    ).toBeGreaterThan(0);
    expect(screen.getByText(/本幕复盘/)).toBeInTheDocument();
    expect(screen.getByText("现象")).toBeInTheDocument();
    expect(screen.getByText("证据")).toBeInTheDocument();
    expect(screen.getByText("结论")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /先把「检查绿色灯牌」当作结果/ }),
    ).toBeInTheDocument();
    expect(screen.getAllByText(/灯亮了，但戏还没演完/).length).toBeGreaterThan(
      0,
    );
    expect(screen.getAllByText(/检查绿色灯牌/).length).toBeGreaterThan(0);
    expect(screen.getByText(/面试一句话/)).toBeInTheDocument();
    expect(screen.getByText(/我会这样讲：在「前端舞台」/)).toBeInTheDocument();
    expect(screen.getByText(/下一地点预告/)).toBeInTheDocument();
    expect(screen.getByText(/传送门大厅/)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /沿证据继续追到/ }));
    await user.type(
      screen.getByLabelText("本幕复述原话"),
      "页面收到成功回信，但还不能证明数据库真的写入。",
    );
    await user.click(screen.getByRole("button", { name: /^封存本幕复述$/ }));
    expect(screen.getByLabelText("本幕主动复述")).toHaveTextContent(
      "已封存原话",
    );
    await user.click(screen.getByRole("button", { name: /^继续下一地点$/ }));
    expect(screen.getByText(/场景转移/)).toBeInTheDocument();
    expect(screen.getByText(/前往：传送门大厅/)).toBeInTheDocument();
    expect(screen.getByAltText("传送门守卫")).toBeInTheDocument();
    expect(screen.getByText(/调查：201 印章不是档案收据/)).toBeInTheDocument();

    expect(
      await screen.findByRole("heading", {
        name: /201 印章不是档案收据/,
      }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("上一幕回声")).toHaveTextContent(
      "前端舞台 · 舞台记录员",
    );
    expect(screen.getByLabelText("上一幕回声")).toHaveTextContent(
      "继续追踪它交出的下一份证据",
    );
    expect(screen.getByLabelText("上一幕判断回声")).toHaveTextContent(
      "你选择继续追证据",
    );
    expect(screen.getByLabelText("上一幕判断回声")).toHaveTextContent(
      "这一选择会把",
    );

    await user.click(screen.getByRole("button", { name: /查看传送门回执/ }));
    await user.click(screen.getByRole("button", { name: /审问守卫的证词/ }));
    await user.click(screen.getByRole("button", { name: /沿证据继续追到/ }));
    await user.type(
      screen.getByLabelText("本幕复述原话"),
      "传送门回了成功章，但我要继续核对后端是否接住并交给数据层。",
    );
    await user.click(screen.getByRole("button", { name: /^封存本幕复述$/ }));
    await user.click(screen.getByRole("button", { name: /^继续下一地点$/ }));

    await user.click(
      await screen.findByRole("button", { name: /照亮空档案格/ }),
    );
    await user.click(screen.getByRole("button", { name: /比对读写路径/ }));
    await user.click(screen.getByRole("button", { name: /沿证据继续追到/ }));
    await user.type(
      screen.getByLabelText("本幕复述原话"),
      "读取路径和写入路径没有对上，所以刷新后档案仍然为空。",
    );
    await user.click(screen.getByRole("button", { name: /^封存本幕复述$/ }));
    await user.click(screen.getByRole("button", { name: /^继续下一地点$/ }));

    await user.click(
      await screen.findByRole("button", { name: /铸造 INSERT 符文/ }),
    );
    await user.click(screen.getByRole("button", { name: /封存验收仪式/ }));
    await user.click(screen.getByRole("button", { name: /沿证据继续追到/ }));
    await user.type(
      screen.getByLabelText("本幕复述原话"),
      "修复后要重新保存、刷新查库并跑测试，才能证明证据链闭合。",
    );
    await user.click(screen.getByRole("button", { name: /^封存本幕复述$/ }));
    await user.click(screen.getByRole("button", { name: /进入实战修复/ }));

    expect((await screen.findAllByText(/档案馆记录员/)).length).toBeGreaterThan(
      0,
    );
    expect(screen.getByLabelText("实战会合简报")).toBeInTheDocument();
    expect(screen.getByText(/测试通过 \+ 必填作答/)).toBeInTheDocument();
    expect(screen.queryByText(/下一章预告/)).toBeNull();

    await user.click(
      await screen.findByRole("button", { name: /与伙伴进入实战/ }),
    );

    expect(
      await screen.findByText(/保存数据从哪里来，又在哪里断掉/),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/实战追踪/)).toHaveTextContent("冒险日志");
    expect(screen.getByLabelText(/实战追踪/)).toHaveTextContent("当前任务");
    expect(screen.getByLabelText("实战剧情向导")).toBeInTheDocument();
    expect(screen.getByLabelText("实战剧情向导")).toHaveTextContent(
      "传送门书记官",
    );
    expect(screen.getByAltText("传送门书记官实战向导")).toBeInTheDocument();
    expect(screen.getByLabelText("实战剧情向导")).toHaveTextContent(
      "这一幕先看懂：读取项目材料",
    );
    expect(screen.getByLabelText("实战剧情向导")).toHaveTextContent(
      "前端讯号窗",
    );
    expect(screen.getByLabelText("实战剧情向导")).toHaveTextContent("当前地点");
    expect(screen.getByLabelText("实战剧情向导")).toHaveTextContent("本幕目标");
    expect(screen.getByLabelText("实战剧情向导")).toHaveTextContent("通关收获");
    expect(screen.getByLabelText("本步任务卷轴")).toBeInTheDocument();
    expect(screen.getByLabelText("本步任务卷轴")).toHaveTextContent("为什么学");
    expect(screen.getByLabelText("本步任务卷轴")).toHaveTextContent("先看什么");
    expect(screen.getByLabelText("本步任务卷轴")).toHaveTextContent(
      "最后交什么",
    );
    expect(screen.getByLabelText("本步任务卷轴")).toHaveTextContent(
      "先看这一棒在流程里的位置",
    );
    expect(screen.getByLabelText("流程接力小剧场")).toBeInTheDocument();
    expect(screen.getByLabelText("流程接力小剧场")).toHaveTextContent("上一棒");
    expect(screen.getByLabelText("流程接力小剧场")).toHaveTextContent("当前棒");
    expect(screen.getByLabelText("流程接力小剧场")).toHaveTextContent("下一棒");
    expect(screen.getByLabelText("流程接力小剧场")).toHaveTextContent("前端");
    expect(screen.getByLabelText("流程接力小剧场")).toHaveTextContent(
      "后端接口",
    );
    expect(screen.getByLabelText("代码三步翻译卡")).toBeInTheDocument();
    expect(screen.getByLabelText("代码三步翻译卡")).toHaveTextContent(
      "把动作送出去",
    );
    expect(screen.getByLabelText("代码三步翻译卡")).toHaveTextContent(
      "判断接口有没有接住",
    );
    expect(screen.getByLabelText("代码三步翻译卡")).toHaveTextContent(
      "不能直接证明数据库已经写入",
    );
    expect(screen.getByLabelText("当前能力印记")).toBeInTheDocument();
    expect(screen.getByText("正在练")).toBeInTheDocument();
    expect(screen.getByText("会沉淀成")).toBeInTheDocument();
    expect(screen.getByLabelText("当前能力印记")).toHaveTextContent(
      "排查路径、提示次数与解释",
    );
    expect(screen.getAllByText(/当前这一棒/).length).toBeGreaterThan(0);
    expect(
      screen.getByText(/前端\s*把「发出 POST」交给\s*后端接口/),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("本关案件路线牌")).toBeInTheDocument();
    expect(screen.getByText("案件路线牌")).toBeInTheDocument();
    expect(screen.getByLabelText("本关完整路线")).toHaveTextContent("用户");
    expect(screen.getByLabelText("本关完整路线")).toHaveTextContent("数据库");
    expect(screen.getByText("事故从哪来")).toBeInTheDocument();
    expect(screen.getByText("谁传给谁")).toBeInTheDocument();
    expect(screen.getByText("第一眼看哪里")).toBeInTheDocument();
    expect(screen.getByText("最后交出什么")).toBeInTheDocument();
    expect(screen.getByLabelText("实战接力板")).toBeInTheDocument();
    expect(screen.getByText("上一棒交来")).toBeInTheDocument();
    expect(screen.getByText("当前要证明")).toBeInTheDocument();
    expect(screen.getByText("交给下一棒")).toBeInTheDocument();
    expect(screen.getByLabelText("这一题的证据路线")).toBeInTheDocument();
    expect(screen.getByLabelText("新手先读卡")).toBeInTheDocument();
    expect(screen.getByText("这题到底在问什么")).toBeInTheDocument();
    expect(screen.getByText("先看哪里")).toBeInTheDocument();
    expect(screen.getByText("不要怎么写")).toBeInTheDocument();
    expect(screen.getByText(/作答支架/)).toBeInTheDocument();
    expect(screen.getByText(/1\. 我看到/)).toBeInTheDocument();
    expect(screen.getByText(/2\. 它说明/)).toBeInTheDocument();
    expect(screen.getByText(/3\. 下一步/)).toBeInTheDocument();
    expect(screen.getByLabelText("证据表达示范卡")).toBeInTheDocument();
    expect(screen.getByLabelText("证据表达示范卡")).toHaveTextContent(
      "前端发出了 POST",
    );
    expect(screen.getByLabelText("证据表达示范卡")).toHaveTextContent(
      "还不能证明数据库真的写入",
    );
    expect(screen.getByLabelText("证据表达示范卡")).toHaveTextContent(
      "继续查后端日志和 SELECT 结果",
    );
    expect(screen.getByText(/表达完整度 0\/3/)).toBeInTheDocument();
    expect(screen.getAllByText(/写出至少一条证据/).length).toBeGreaterThan(0);
    expect(screen.getByText(/说明这条证据能证明什么/)).toBeInTheDocument();
    expect(screen.getByText(/写出下一步验证动作/)).toBeInTheDocument();
    expect(screen.getByText(/还差：写出至少一条证据/)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /填入骨架/ }));
    expect(screen.getByRole("textbox")).toHaveValue(
      "我看到：\n它说明：\n下一步：",
    );
    await user.clear(screen.getByRole("textbox"));
    await user.type(
      screen.getByRole("textbox"),
      "我看到：Network 返回 201，但数据库 SELECT 还是 0 行。它说明：201 只能证明接口接待请求。下一步：我会用测试验证刷新后仍能读到记录。",
    );
    expect(screen.getByText(/表达完整度 3\/3/)).toBeInTheDocument();
    expect(screen.getByText(/可以保存并继续/)).toBeInTheDocument();
    expect(screen.getByText(/阅读导览 · 第 2 棒/)).toBeInTheDocument();
    expect(screen.getByLabelText("材料导师")).toBeInTheDocument();
    expect(screen.getByAltText("传送门书记官")).toBeInTheDocument();
    expect(screen.getByText(/请求和日志要按时间线读/)).toBeInTheDocument();
    expect(screen.getByLabelText("材料接力解释")).toBeInTheDocument();
    expect(screen.getByText("材料接力")).toBeInTheDocument();
    expect(screen.getByText("浏览器 Network 或测试报告")).toBeInTheDocument();
    expect(screen.getByText("后端接口与验收判断")).toBeInTheDocument();
    expect(
      screen.getByText(/这次请求或测试到底返回了什么结果/),
    ).toBeInTheDocument();
    expect(screen.getByText(/这次只盯住/)).toBeInTheDocument();
    expect(screen.getByLabelText("关键行聚焦")).toBeInTheDocument();
    expect(screen.getByText(/先看这几行/)).toBeInTheDocument();
    expect(screen.getByText("json · 关键行")).toBeInTheDocument();
    expect(
      screen.getByText(/先只看关键行和前后一行上下文/),
    ).toBeInTheDocument();
    expect(document.querySelector(".code-window pre")).toHaveTextContent("201");
    expect(document.querySelector(".code-window pre")).toHaveTextContent(
      "visibleCanvases",
    );
    expect(
      screen.getByRole("button", { name: /查看完整卷宗/ }),
    ).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /查看完整卷宗/ }));
    expect(
      screen.getByRole("button", { name: /收起完整卷宗/ }),
    ).toHaveAttribute("aria-expanded", "true");
    expect(document.body.textContent ?? "").toContain("201 不是数据库收据");
    expect(document.querySelector(".lab-rpg-shell")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /保存并继续/ }));
    expect(await screen.findByLabelText("刚刚收录的证据")).toHaveTextContent(
      "证据已收录",
    );
    expect(screen.getByLabelText("刚刚收录的证据")).toHaveTextContent(
      "读取项目材料",
    );
    expect(screen.getByLabelText("刚刚收录的证据")).toHaveTextContent(
      "继续把上一棒证据交给下一棒",
    );
    expect(screen.getByLabelText("刚刚收录的证据")).toHaveTextContent(
      "刚刚沉淀",
    );
    expect(screen.getByLabelText("刚刚收录的证据")).toHaveTextContent(
      "下一步验证",
    );
    expect(screen.getByLabelText("刚刚收录的证据")).toHaveTextContent(
      "以后可复盘",
    );
    expect(screen.getByLabelText("刚刚收录的证据")).toHaveTextContent(
      "一段可复查的读取项目材料判断",
    );
    expect(screen.getByLabelText("实战剧情向导")).toHaveTextContent(
      "接口接待员",
    );
    expect(screen.getByAltText("接口接待员实战向导")).toBeInTheDocument();
    expect(screen.getByLabelText("实战剧情向导")).toHaveTextContent(
      "请求中转门",
    );
    await user.click(screen.getByRole("button", { name: /给 Agent 写任务/ }));
    expect(screen.getByText(/1\. 背景/)).toBeInTheDocument();
    expect(screen.getByText(/2\. 边界/)).toBeInTheDocument();
    expect(screen.getByText(/3\. 验收/)).toBeInTheDocument();
    expect(screen.getAllByText(/写出背景和现象/).length).toBeGreaterThan(0);
    await user.click(screen.getByRole("button", { name: /填入骨架/ }));
    expect(screen.getByRole("textbox")).toHaveValue(
      "背景：\n目标：\n范围/约束：\n验收标准：\n风险和回滚：",
    );
    expect(screen.getByText(/表达完整度 0\/3/)).toBeInTheDocument();
    expect(localStorage.getItem("codequest_detective")).toBeNull();
  }, 60000);
});
