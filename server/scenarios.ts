export type ScenarioDefinition = {
  id: string;
  title: string;
  skillIds: string[];
  stepIds: string[];
  reportRelativePath: string;
  verificationSourceRelativePath: string;
  artifacts: Array<{
    id: string;
    label: string;
    relativePath: string;
    language: string;
  }>;
};

export const scenarios = {
  "canvas-save-persistence": {
    id: "canvas-save-persistence",
    title: "保存成功，但刷新后消失",
    skillIds: ["api", "database", "debugging"],
    stepIds: [
      "baseline-plan",
      "inspect-evidence",
      "trace-data-flow",
      "practical-fix",
      "agent-brief",
      "delivery-review",
      "causal-explanation",
      "transfer-check",
      "interview-dossier",
    ],
    reportRelativePath: "canvas-save-persistence/test-results.json",
    verificationSourceRelativePath:
      "canvas-save-persistence/server/canvasRepository.js",
    artifacts: [
      {
        id: "frontend",
        label: "前端保存按钮",
        relativePath: "canvas-save-persistence/frontend/SaveCanvasButton.jsx",
        language: "jsx",
      },
      {
        id: "route",
        label: "后端 API 路由",
        relativePath: "canvas-save-persistence/server/canvasRoutes.js",
        language: "javascript",
      },
      {
        id: "repository",
        label: "数据访问层",
        relativePath: "canvas-save-persistence/server/canvasRepository.js",
        language: "javascript",
      },
      {
        id: "schema",
        label: "数据库结构",
        relativePath: "canvas-save-persistence/database/schema.sql",
        language: "sql",
      },
      {
        id: "network",
        label: "Network 记录",
        relativePath: "canvas-save-persistence/evidence/network.json",
        language: "json",
      },
      {
        id: "logs",
        label: "后端日志",
        relativePath: "canvas-save-persistence/evidence/backend.log",
        language: "log",
      },
      {
        id: "database",
        label: "数据库查询",
        relativePath: "canvas-save-persistence/evidence/database-query.txt",
        language: "text",
      },
      {
        id: "delivery",
        label: "Agent 交付说明",
        relativePath: "canvas-save-persistence/evidence/agent-delivery.md",
        language: "markdown",
      },
    ],
  },
  "canvasstorm-product-brief": {
    id: "canvasstorm-product-brief",
    title: "AI 点子为什么空泛",
    skillIds: ["product", "ai-application", "agent-brief"],
    stepIds: [
      "product-brief",
      "candidate-direction",
      "session-save",
      "agent-brief",
      "delivery-review",
      "interview-dossier",
    ],
    reportRelativePath: "canvasstorm-product-brief/test-results.json",
    verificationSourceRelativePath:
      "canvasstorm-product-brief/server/briefPlanner.js",
    artifacts: [
      {
        id: "frontend",
        label: "Project Brief 表单",
        relativePath: "canvasstorm-product-brief/frontend/ProjectBriefForm.jsx",
        language: "jsx",
      },
      {
        id: "planner",
        label: "产品规划逻辑",
        relativePath: "canvasstorm-product-brief/server/briefPlanner.js",
        language: "javascript",
      },
      {
        id: "network",
        label: "Network 记录",
        relativePath: "canvasstorm-product-brief/evidence/network.json",
        language: "json",
      },
      {
        id: "logs",
        label: "后端日志",
        relativePath: "canvasstorm-product-brief/evidence/backend.log",
        language: "log",
      },
      {
        id: "session-before",
        label: "保存前会话",
        relativePath: "canvasstorm-product-brief/evidence/session-before.json",
        language: "json",
      },
      {
        id: "session-after",
        label: "错误保存结果",
        relativePath: "canvasstorm-product-brief/evidence/session-after.json",
        language: "json",
      },
      {
        id: "delivery",
        label: "Agent 交付说明",
        relativePath: "canvasstorm-product-brief/evidence/agent-delivery.md",
        language: "markdown",
      },
    ],
  },
  "identity-session-corridor": {
    id: "identity-session-corridor",
    title: "登录状态为什么丢",
    skillIds: ["auth", "session", "debugging"],
    stepIds: [
      "identity-map",
      "credential-storage",
      "protected-request",
      "refresh-restore",
      "agent-brief",
      "delivery-review",
      "interview-dossier",
    ],
    reportRelativePath: "identity-session-corridor/test-results.json",
    verificationSourceRelativePath:
      "identity-session-corridor/server/sessionGateway.js",
    artifacts: [
      {
        id: "frontend",
        label: "登录状态入口",
        relativePath: "identity-session-corridor/frontend/LoginGate.jsx",
        language: "jsx",
      },
      {
        id: "session-gateway",
        label: "身份会话守卫",
        relativePath: "identity-session-corridor/server/sessionGateway.js",
        language: "javascript",
      },
      {
        id: "login-network",
        label: "登录 Network 记录",
        relativePath: "identity-session-corridor/evidence/network-login.json",
        language: "json",
      },
      {
        id: "me-401-network",
        label: "/api/me 401 记录",
        relativePath: "identity-session-corridor/evidence/network-me-401.json",
        language: "json",
      },
      {
        id: "storage-before",
        label: "登录前浏览器凭证",
        relativePath:
          "identity-session-corridor/evidence/browser-storage-before.json",
        language: "json",
      },
      {
        id: "storage-after",
        label: "错误登录后浏览器凭证",
        relativePath:
          "identity-session-corridor/evidence/browser-storage-after.json",
        language: "json",
      },
      {
        id: "logs",
        label: "身份回廊后端日志",
        relativePath: "identity-session-corridor/evidence/backend.log",
        language: "log",
      },
      {
        id: "delivery",
        label: "Agent 交付说明",
        relativePath: "identity-session-corridor/evidence/agent-delivery.md",
        language: "markdown",
      },
    ],
  },
  "api-error-court": {
    id: "api-error-court",
    title: "接口为什么报错",
    skillIds: ["api", "validation", "logging"],
    stepIds: [
      "payload-inspection",
      "status-code-judgement",
      "error-shape",
      "log-correlation",
      "agent-brief",
      "delivery-review",
      "interview-dossier",
    ],
    reportRelativePath: "api-error-court/test-results.json",
    verificationSourceRelativePath: "api-error-court/server/briefRoutes.js",
    artifacts: [
      {
        id: "frontend",
        label: "Project Brief 提交按钮",
        relativePath: "api-error-court/frontend/BriefSubmitButton.jsx",
        language: "jsx",
      },
      {
        id: "route",
        label: "接口处理与校验",
        relativePath: "api-error-court/server/briefRoutes.js",
        language: "javascript",
      },
      {
        id: "invalid-payload",
        label: "缺字段请求体",
        relativePath: "api-error-court/evidence/network-invalid-payload.json",
        language: "json",
      },
      {
        id: "wrong-response",
        label: "错误 500 响应",
        relativePath: "api-error-court/evidence/network-500-response.json",
        language: "json",
      },
      {
        id: "logs",
        label: "接口审判庭后端日志",
        relativePath: "api-error-court/evidence/backend.log",
        language: "log",
      },
      {
        id: "delivery",
        label: "Agent 交付说明",
        relativePath: "api-error-court/evidence/agent-delivery.md",
        language: "markdown",
      },
    ],
  },
  "data-consistency-forge": {
    id: "data-consistency-forge",
    title: "数据为什么重复/错乱",
    skillIds: ["database", "idempotency", "transaction"],
    stepIds: [
      "duplicate-reproduction",
      "idempotency-key",
      "unique-constraint",
      "transaction-boundary",
      "agent-brief",
      "delivery-review",
      "interview-dossier",
    ],
    reportRelativePath: "data-consistency-forge/test-results.json",
    verificationSourceRelativePath:
      "data-consistency-forge/server/draftRepository.js",
    artifacts: [
      {
        id: "frontend",
        label: "重复提交保存按钮",
        relativePath: "data-consistency-forge/frontend/SaveDraftButton.jsx",
        language: "jsx",
      },
      {
        id: "repository",
        label: "草稿保存数据层",
        relativePath: "data-consistency-forge/server/draftRepository.js",
        language: "javascript",
      },
      {
        id: "double-submit",
        label: "重复提交 Network 记录",
        relativePath:
          "data-consistency-forge/evidence/network-double-submit.json",
        language: "json",
      },
      {
        id: "database-before",
        label: "保存前数据库",
        relativePath: "data-consistency-forge/evidence/database-before.json",
        language: "json",
      },
      {
        id: "database-after",
        label: "重复写入后的数据库",
        relativePath: "data-consistency-forge/evidence/database-after.json",
        language: "json",
      },
      {
        id: "logs",
        label: "一致性熔炉后端日志",
        relativePath: "data-consistency-forge/evidence/backend.log",
        language: "log",
      },
      {
        id: "delivery",
        label: "Agent 交付说明",
        relativePath: "data-consistency-forge/evidence/agent-delivery.md",
        language: "markdown",
      },
    ],
  },
  "performance-fog-lab": {
    id: "performance-fog-lab",
    title: "页面为什么慢",
    skillIds: ["performance", "network", "cache"],
    stepIds: [
      "waterfall-reading",
      "server-timing",
      "render-bottleneck",
      "cache-retest",
      "agent-brief",
      "delivery-review",
      "interview-dossier",
    ],
    reportRelativePath: "performance-fog-lab/test-results.json",
    verificationSourceRelativePath:
      "performance-fog-lab/server/projectPerformance.js",
    artifacts: [
      {
        id: "frontend",
        label: "慢速项目列表",
        relativePath: "performance-fog-lab/frontend/ProjectList.jsx",
        language: "jsx",
      },
      {
        id: "performance-service",
        label: "项目列表性能逻辑",
        relativePath: "performance-fog-lab/server/projectPerformance.js",
        language: "javascript",
      },
      {
        id: "waterfall",
        label: "首屏 Network 瀑布图",
        relativePath: "performance-fog-lab/evidence/network-waterfall.json",
        language: "json",
      },
      {
        id: "render-profile",
        label: "前端渲染画像",
        relativePath: "performance-fog-lab/evidence/render-profile.json",
        language: "json",
      },
      {
        id: "cache-retest",
        label: "缓存复测记录",
        relativePath: "performance-fog-lab/evidence/cache-retest.json",
        language: "json",
      },
      {
        id: "logs",
        label: "慢速迷雾后端日志",
        relativePath: "performance-fog-lab/evidence/backend.log",
        language: "log",
      },
      {
        id: "delivery",
        label: "Agent 交付说明",
        relativePath: "performance-fog-lab/evidence/agent-delivery.md",
        language: "markdown",
      },
    ],
  },
  "ai-api-key-vault": {
    id: "ai-api-key-vault",
    title: "AI 接口怎么接",
    skillIds: ["ai-api", "secrets", "streaming"],
    stepIds: [
      "frontend-secret-scan",
      "server-env-key",
      "streaming-response",
      "failure-fallback",
      "agent-brief",
      "delivery-review",
      "interview-dossier",
    ],
    reportRelativePath: "ai-api-key-vault/test-results.json",
    verificationSourceRelativePath: "ai-api-key-vault/server/aiGateway.js",
    artifacts: [
      {
        id: "frontend",
        label: "AI 聊天前端面板",
        relativePath: "ai-api-key-vault/frontend/AiChatPanel.jsx",
        language: "jsx",
      },
      {
        id: "gateway",
        label: "AI 服务端转发逻辑",
        relativePath: "ai-api-key-vault/server/aiGateway.js",
        language: "javascript",
      },
      {
        id: "bundle-scan",
        label: "前端密钥扫描",
        relativePath: "ai-api-key-vault/evidence/frontend-bundle-scan.json",
        language: "json",
      },
      {
        id: "network",
        label: "浏览器 AI 请求记录",
        relativePath: "ai-api-key-vault/evidence/network-chat.json",
        language: "json",
      },
      {
        id: "stream-trace",
        label: "流式响应追踪",
        relativePath: "ai-api-key-vault/evidence/stream-trace.json",
        language: "json",
      },
      {
        id: "provider-error",
        label: "上游失败响应",
        relativePath: "ai-api-key-vault/evidence/provider-error.json",
        language: "json",
      },
      {
        id: "logs",
        label: "模型熔炉后端日志",
        relativePath: "ai-api-key-vault/evidence/backend.log",
        language: "log",
      },
      {
        id: "delivery",
        label: "Agent 交付说明",
        relativePath: "ai-api-key-vault/evidence/agent-delivery.md",
        language: "markdown",
      },
    ],
  },
  "hallucination-mirror-hall": {
    id: "hallucination-mirror-hall",
    title: "AI 回复为什么胡说",
    skillIds: ["prompt", "citations", "ai-safety"],
    stepIds: [
      "prompt-contract",
      "context-boundary",
      "citation-verification",
      "refusal-policy",
      "agent-brief",
      "delivery-review",
      "interview-dossier",
    ],
    reportRelativePath: "hallucination-mirror-hall/test-results.json",
    verificationSourceRelativePath:
      "hallucination-mirror-hall/server/groundedAnswer.js",
    artifacts: [
      {
        id: "frontend",
        label: "可验证回答前端",
        relativePath:
          "hallucination-mirror-hall/frontend/GroundedAnswerPanel.jsx",
        language: "jsx",
      },
      {
        id: "grounded-answer",
        label: "引用校验服务端逻辑",
        relativePath: "hallucination-mirror-hall/server/groundedAnswer.js",
        language: "javascript",
      },
      {
        id: "context",
        label: "本轮上下文资料",
        relativePath: "hallucination-mirror-hall/evidence/context-chunks.json",
        language: "json",
      },
      {
        id: "unsupported-answer",
        label: "编造引用的模型输出",
        relativePath:
          "hallucination-mirror-hall/evidence/model-answer-unsupported.json",
        language: "json",
      },
      {
        id: "no-context-answer",
        label: "无资料硬答反例",
        relativePath:
          "hallucination-mirror-hall/evidence/no-context-answer.json",
        language: "json",
      },
      {
        id: "network",
        label: "可验证回答 Network 记录",
        relativePath:
          "hallucination-mirror-hall/evidence/network-grounded-answer.json",
        language: "json",
      },
      {
        id: "logs",
        label: "幻觉镜厅后端日志",
        relativePath: "hallucination-mirror-hall/evidence/backend.log",
        language: "log",
      },
      {
        id: "delivery",
        label: "Agent 交付说明",
        relativePath: "hallucination-mirror-hall/evidence/agent-delivery.md",
        language: "markdown",
      },
    ],
  },
  "rag-knowledge-maze": {
    id: "rag-knowledge-maze",
    title: "RAG 知识库",
    skillIds: ["rag", "retrieval", "citations"],
    stepIds: [
      "chunk-indexing",
      "embedding-search",
      "topk-evidence",
      "citation-grounding",
      "agent-brief",
      "delivery-review",
      "interview-dossier",
    ],
    reportRelativePath: "rag-knowledge-maze/test-results.json",
    verificationSourceRelativePath: "rag-knowledge-maze/server/ragEngine.js",
    artifacts: [
      {
        id: "frontend",
        label: "RAG 回答前端",
        relativePath: "rag-knowledge-maze/frontend/RagAnswerPanel.jsx",
        language: "jsx",
      },
      {
        id: "rag-engine",
        label: "RAG 检索服务端逻辑",
        relativePath: "rag-knowledge-maze/server/ragEngine.js",
        language: "javascript",
      },
      {
        id: "source-docs",
        label: "原始知识库资料",
        relativePath: "rag-knowledge-maze/evidence/source-docs.json",
        language: "json",
      },
      {
        id: "chunk-index",
        label: "错误 chunk 索引",
        relativePath: "rag-knowledge-maze/evidence/chunk-index.json",
        language: "json",
      },
      {
        id: "search-miss",
        label: "检索命中错误反例",
        relativePath: "rag-knowledge-maze/evidence/search-miss.json",
        language: "json",
      },
      {
        id: "network",
        label: "RAG 回答 Network 记录",
        relativePath: "rag-knowledge-maze/evidence/network-rag-answer.json",
        language: "json",
      },
      {
        id: "logs",
        label: "知识迷宫后端日志",
        relativePath: "rag-knowledge-maze/evidence/backend.log",
        language: "log",
      },
      {
        id: "delivery",
        label: "Agent 交付说明",
        relativePath: "rag-knowledge-maze/evidence/agent-delivery.md",
        language: "markdown",
      },
    ],
  },
  "agent-tool-tower": {
    id: "agent-tool-tower",
    title: "Agent 工具调用",
    skillIds: ["agent", "tool-calling", "permissions"],
    stepIds: [
      "tool-registry",
      "schema-validation",
      "permission-check",
      "failure-fallback",
      "failure-review",
      "agent-brief",
      "delivery-review",
      "interview-dossier",
    ],
    reportRelativePath: "agent-tool-tower/test-results.json",
    verificationSourceRelativePath: "agent-tool-tower/server/agentTools.js",
    artifacts: [
      {
        id: "frontend",
        label: "Agent 工具控制台",
        relativePath: "agent-tool-tower/frontend/AgentToolConsole.jsx",
        language: "jsx",
      },
      {
        id: "tool-executor",
        label: "Agent 工具注册与执行器",
        relativePath: "agent-tool-tower/server/agentTools.js",
        language: "javascript",
      },
      {
        id: "registry",
        label: "工具注册表",
        relativePath: "agent-tool-tower/evidence/tool-registry.json",
        language: "json",
      },
      {
        id: "network",
        label: "工具调用 Network 记录",
        relativePath: "agent-tool-tower/evidence/network-tool-call.json",
        language: "json",
      },
      {
        id: "permission",
        label: "越权调用反例",
        relativePath: "agent-tool-tower/evidence/permission-denied.json",
        language: "json",
      },
      {
        id: "failure",
        label: "工具失败回退反例",
        relativePath: "agent-tool-tower/evidence/tool-failure.json",
        language: "json",
      },
      {
        id: "logs",
        label: "Agent 高塔后端日志",
        relativePath: "agent-tool-tower/evidence/backend.log",
        language: "log",
      },
      {
        id: "delivery",
        label: "Agent 交付说明",
        relativePath: "agent-tool-tower/evidence/agent-delivery.md",
        language: "markdown",
      },
    ],
  },
  "verification-trial-arena": {
    id: "verification-trial-arena",
    title: "测试怎么证明修好了",
    skillIds: ["testing", "verification", "delivery-review"],
    stepIds: [
      "repro-case",
      "unit-boundary",
      "integration-flow",
      "manual-report",
      "regression-risk",
      "agent-brief",
      "delivery-review",
      "interview-dossier",
    ],
    reportRelativePath: "verification-trial-arena/test-results.json",
    verificationSourceRelativePath:
      "verification-trial-arena/server/verificationReport.js",
    artifacts: [
      {
        id: "frontend",
        label: "验收报告面板",
        relativePath:
          "verification-trial-arena/frontend/VerificationReportPanel.jsx",
        language: "jsx",
      },
      {
        id: "report-validator",
        label: "验收报告校验器",
        relativePath: "verification-trial-arena/server/verificationReport.js",
        language: "javascript",
      },
      {
        id: "failing-before",
        label: "旧问题失败复现报告",
        relativePath: "verification-trial-arena/evidence/failing-before.json",
        language: "json",
      },
      {
        id: "passing-stale",
        label: "过期通过报告",
        relativePath:
          "verification-trial-arena/evidence/passing-after-stale.json",
        language: "json",
      },
      {
        id: "network",
        label: "保存链路 Network 复测",
        relativePath: "verification-trial-arena/evidence/network-test-run.json",
        language: "json",
      },
      {
        id: "manual-report",
        label: "手动复测报告",
        relativePath: "verification-trial-arena/evidence/manual-report.md",
        language: "markdown",
      },
      {
        id: "logs",
        label: "验收试炼后端日志",
        relativePath: "verification-trial-arena/evidence/backend.log",
        language: "log",
      },
      {
        id: "delivery",
        label: "Agent 交付说明",
        relativePath: "verification-trial-arena/evidence/agent-delivery.md",
        language: "markdown",
      },
    ],
  },
  "agent-brief-forge": {
    id: "agent-brief-forge",
    title: "Agent 任务怎么写",
    skillIds: ["agent", "task-brief", "acceptance"],
    stepIds: [
      "context-evidence",
      "observable-goal",
      "scope-constraints",
      "acceptance-plan",
      "risk-rollback",
      "delivery-format",
      "agent-brief",
      "interview-dossier",
    ],
    reportRelativePath: "agent-brief-forge/test-results.json",
    verificationSourceRelativePath:
      "agent-brief-forge/server/briefValidator.js",
    artifacts: [
      {
        id: "frontend",
        label: "Agent 委托书编辑器",
        relativePath: "agent-brief-forge/frontend/AgentBriefEditor.jsx",
        language: "jsx",
      },
      {
        id: "brief-validator",
        label: "委托书校验器",
        relativePath: "agent-brief-forge/server/briefValidator.js",
        language: "javascript",
      },
      {
        id: "vague-brief",
        label: "空泛委托反例",
        relativePath: "agent-brief-forge/evidence/vague-brief.json",
        language: "json",
      },
      {
        id: "unsafe-brief",
        label: "越界委托反例",
        relativePath: "agent-brief-forge/evidence/unsafe-brief.json",
        language: "json",
      },
      {
        id: "clear-brief",
        label: "清晰委托样例",
        relativePath: "agent-brief-forge/evidence/clear-brief.json",
        language: "json",
      },
      {
        id: "network",
        label: "Agent 任务提交 Network 记录",
        relativePath: "agent-brief-forge/evidence/network-agent-request.json",
        language: "json",
      },
      {
        id: "logs",
        label: "委托书工坊后端日志",
        relativePath: "agent-brief-forge/evidence/backend.log",
        language: "log",
      },
      {
        id: "delivery",
        label: "Agent 交付说明",
        relativePath: "agent-brief-forge/evidence/agent-delivery.md",
        language: "markdown",
      },
    ],
  },
  "delivery-review-court": {
    id: "delivery-review-court",
    title: "怎么审查交付",
    skillIds: ["delivery-review", "diff-review", "quality-gate"],
    stepIds: [
      "delivery-summary",
      "diff-scope",
      "test-evidence",
      "browser-boundary",
      "docs-sync",
      "review-decision",
      "interview-dossier",
    ],
    reportRelativePath: "delivery-review-court/test-results.json",
    verificationSourceRelativePath:
      "delivery-review-court/server/deliveryReview.js",
    artifacts: [
      {
        id: "frontend",
        label: "交付审查面板",
        relativePath: "delivery-review-court/frontend/DeliveryReviewPanel.jsx",
        language: "jsx",
      },
      {
        id: "reviewer",
        label: "交付审查器",
        relativePath: "delivery-review-court/server/deliveryReview.js",
        language: "javascript",
      },
      {
        id: "delivery-note",
        label: "Agent 交付说明",
        relativePath: "delivery-review-court/evidence/agent-delivery.md",
        language: "markdown",
      },
      {
        id: "diff-summary",
        label: "Diff 范围摘要",
        relativePath: "delivery-review-court/evidence/diff-summary.json",
        language: "json",
      },
      {
        id: "test-evidence",
        label: "过期测试证据",
        relativePath: "delivery-review-court/evidence/test-evidence.json",
        language: "json",
      },
      {
        id: "browser-checks",
        label: "浏览器验收记录",
        relativePath: "delivery-review-court/evidence/browser-checks.json",
        language: "json",
      },
      {
        id: "docs-sync",
        label: "文档同步缺口",
        relativePath: "delivery-review-court/evidence/docs-sync.json",
        language: "json",
      },
      {
        id: "logs",
        label: "交付审查后端日志",
        relativePath: "delivery-review-court/evidence/backend.log",
        language: "log",
      },
      {
        id: "decision",
        label: "拒收决定书",
        relativePath: "delivery-review-court/evidence/review-decision.md",
        language: "markdown",
      },
    ],
  },
  "release-readiness-gate": {
    id: "release-readiness-gate",
    title: "上线前检查什么",
    skillIds: ["release-readiness", "ops-checklist", "rollback"],
    stepIds: [
      "release-plan",
      "environment-check",
      "backup-restore",
      "smoke-test",
      "monitoring-signals",
      "rollback-plan",
      "interview-dossier",
    ],
    reportRelativePath: "release-readiness-gate/test-results.json",
    verificationSourceRelativePath:
      "release-readiness-gate/server/releaseGate.js",
    artifacts: [
      {
        id: "frontend",
        label: "上线门禁面板",
        relativePath: "release-readiness-gate/frontend/ReleaseGatePanel.jsx",
        language: "jsx",
      },
      {
        id: "release-gate",
        label: "上线门禁校验器",
        relativePath: "release-readiness-gate/server/releaseGate.js",
        language: "javascript",
      },
      {
        id: "release-plan",
        label: "上线计划草稿",
        relativePath: "release-readiness-gate/evidence/release-plan.json",
        language: "json",
      },
      {
        id: "environment",
        label: "生产环境变量检查",
        relativePath: "release-readiness-gate/evidence/environment-check.json",
        language: "json",
      },
      {
        id: "backup",
        label: "备份与恢复记录",
        relativePath: "release-readiness-gate/evidence/backup-record.json",
        language: "json",
      },
      {
        id: "smoke-test",
        label: "冒烟测试记录",
        relativePath: "release-readiness-gate/evidence/smoke-test.json",
        language: "json",
      },
      {
        id: "monitoring",
        label: "上线监控快照",
        relativePath:
          "release-readiness-gate/evidence/monitoring-snapshot.json",
        language: "json",
      },
      {
        id: "rollback",
        label: "回滚方案草稿",
        relativePath: "release-readiness-gate/evidence/rollback-plan.md",
        language: "markdown",
      },
      {
        id: "logs",
        label: "上线门禁后端日志",
        relativePath: "release-readiness-gate/evidence/backend.log",
        language: "log",
      },
      {
        id: "delivery",
        label: "Agent 交付说明",
        relativePath: "release-readiness-gate/evidence/agent-delivery.md",
        language: "markdown",
      },
    ],
  },
  "interview-answer-forge": {
    id: "interview-answer-forge",
    title: "面试怎么讲项目",
    skillIds: ["interview-story", "star", "project-retrospective"],
    stepIds: [
      "story-bank",
      "star-answer",
      "incident-review",
      "tradeoff",
      "follow-up-drill",
      "answer-dossier",
      "interview-dossier",
    ],
    reportRelativePath: "interview-answer-forge/test-results.json",
    verificationSourceRelativePath:
      "interview-answer-forge/server/interviewAnswer.js",
    artifacts: [
      {
        id: "frontend",
        label: "答辩故事板",
        relativePath: "interview-answer-forge/frontend/InterviewStoryBoard.jsx",
        language: "jsx",
      },
      {
        id: "reviewer",
        label: "面试稿校验器",
        relativePath: "interview-answer-forge/server/interviewAnswer.js",
        language: "javascript",
      },
      {
        id: "story-bank",
        label: "项目素材库",
        relativePath: "interview-answer-forge/evidence/story-bank.json",
        language: "json",
      },
      {
        id: "star-draft",
        label: "STAR 草稿",
        relativePath: "interview-answer-forge/evidence/star-draft.json",
        language: "json",
      },
      {
        id: "incident-review",
        label: "故障复盘草稿",
        relativePath: "interview-answer-forge/evidence/incident-review.json",
        language: "json",
      },
      {
        id: "tradeoff",
        label: "技术取舍笔记",
        relativePath: "interview-answer-forge/evidence/tradeoff-notes.json",
        language: "json",
      },
      {
        id: "follow-ups",
        label: "追问演练清单",
        relativePath:
          "interview-answer-forge/evidence/follow-up-questions.json",
        language: "json",
      },
      {
        id: "rubric",
        label: "答辩验收 Rubric",
        relativePath: "interview-answer-forge/evidence/answer-rubric.json",
        language: "json",
      },
      {
        id: "agent-interviewer",
        label: "Agent 面试官追问",
        relativePath: "interview-answer-forge/evidence/agent-interviewer.md",
        language: "markdown",
      },
      {
        id: "logs",
        label: "答辩厅后端日志",
        relativePath: "interview-answer-forge/evidence/backend.log",
        language: "log",
      },
    ],
  },
} as const satisfies Record<string, ScenarioDefinition>;

export type ScenarioId = keyof typeof scenarios;

export function getScenario(id: string): ScenarioDefinition | undefined {
  return scenarios[id as ScenarioId];
}

export function requireScenario(id: string): ScenarioDefinition {
  const scenario = getScenario(id);
  if (!scenario) throw new ContractError("UNKNOWN_SCENARIO", "未知的练习场景");
  return scenario;
}

export function requireScenarioStep(scenarioId: string, stepId: string) {
  const scenario = requireScenario(scenarioId);
  if (!scenario.stepIds.includes(stepId)) {
    throw new ContractError("UNKNOWN_STEP", "该步骤不属于当前练习场景");
  }
  return scenario;
}

export class ContractError extends Error {
  constructor(
    public readonly code: string,
    message: string,
  ) {
    super(message);
  }
}
