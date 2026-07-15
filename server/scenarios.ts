export type ScenarioDefinition = {
  id: string;
  title: string;
  skillIds: string[];
  stepIds: string[];
  reportRelativePath: string;
  verificationSourceRelativePath: string;
  transferRetest?: {
    sourceScenarioId: string;
    delayHours: number;
  };
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
  "java-layered-request": {
    id: "java-layered-request",
    title: "请求为什么要经过三层",
    skillIds: ["java", "api", "architecture", "debugging"],
    stepIds: [
      "baseline-plan",
      "inspect-evidence",
      "trace-flow",
      "practical-fix",
      "agent-brief",
      "delivery-review",
      "causal-explanation",
      "interview-dossier",
    ],
    reportRelativePath: "java-layered-request/test-results.json",
    verificationSourceRelativePath:
      "java-layered-request/server/UserController.java",
    artifacts: [
      {
        id: "controller",
        label: "Controller 入口",
        relativePath: "java-layered-request/server/UserController.java",
        language: "java",
      },
      {
        id: "service",
        label: "Service 业务层",
        relativePath: "java-layered-request/server/UserService.java",
        language: "java",
      },
      {
        id: "repository",
        label: "Repository 数据层",
        relativePath: "java-layered-request/server/UserRepository.java",
        language: "java",
      },
      {
        id: "dto",
        label: "DTO 数据合同",
        relativePath: "java-layered-request/server/UserResponse.java",
        language: "java",
      },
      {
        id: "schema",
        label: "数据库结构",
        relativePath: "java-layered-request/database/schema.sql",
        language: "sql",
      },
      {
        id: "network",
        label: "请求记录",
        relativePath: "java-layered-request/evidence/network.json",
        language: "json",
      },
      {
        id: "logs",
        label: "服务日志",
        relativePath: "java-layered-request/evidence/backend.log",
        language: "log",
      },
      {
        id: "database",
        label: "数据库查询",
        relativePath: "java-layered-request/evidence/database-query.txt",
        language: "text",
      },
      {
        id: "delivery",
        label: "Agent 交付说明",
        relativePath: "java-layered-request/evidence/agent-delivery.md",
        language: "markdown",
      },
    ],
  },
  "frontend-component-state": {
    id: "frontend-component-state",
    title: "按钮为什么一点击就乱跳",
    skillIds: ["frontend", "react", "state", "debugging"],
    stepIds: [
      "baseline-plan",
      "inspect-evidence",
      "trace-render-flow",
      "practical-fix",
      "agent-brief",
      "delivery-review",
      "causal-explanation",
      "interview-dossier",
    ],
    reportRelativePath: "frontend-component-state/test-results.json",
    verificationSourceRelativePath:
      "frontend-component-state/frontend/ProfilePanel.jsx",
    artifacts: [
      {
        id: "component",
        label: "ProfilePanel 组件",
        relativePath: "frontend-component-state/frontend/ProfilePanel.jsx",
        language: "jsx",
      },
      {
        id: "component-tree",
        label: "组件树说明",
        relativePath: "frontend-component-state/evidence/component-tree.md",
        language: "markdown",
      },
      {
        id: "network",
        label: "交互记录",
        relativePath: "frontend-component-state/evidence/network.json",
        language: "json",
      },
      {
        id: "console",
        label: "浏览器日志",
        relativePath: "frontend-component-state/evidence/browser.log",
        language: "log",
      },
      {
        id: "delivery",
        label: "Agent 交付说明",
        relativePath: "frontend-component-state/evidence/agent-delivery.md",
        language: "markdown",
      },
    ],
  },
  "frontend-request-states": {
    id: "frontend-request-states",
    title: "表单错误怎样被用户看懂",
    skillIds: ["frontend", "react", "state", "debugging", "accessibility"],
    stepIds: [
      "baseline-plan",
      "inspect-evidence",
      "trace-render-flow",
      "practical-fix",
      "agent-brief",
      "delivery-review",
      "causal-explanation",
      "interview-dossier",
    ],
    reportRelativePath: "frontend-request-states/test-results.json",
    verificationSourceRelativePath:
      "frontend-request-states/frontend/SubmitPanel.jsx",
    artifacts: [
      {
        id: "component",
        label: "SubmitPanel 组件",
        relativePath: "frontend-request-states/frontend/SubmitPanel.jsx",
        language: "jsx",
      },
      {
        id: "component-tree",
        label: "组件与状态说明",
        relativePath: "frontend-request-states/evidence/component-tree.md",
        language: "markdown",
      },
      {
        id: "network",
        label: "提交请求 Network",
        relativePath: "frontend-request-states/evidence/network.json",
        language: "json",
      },
      {
        id: "console",
        label: "浏览器日志",
        relativePath: "frontend-request-states/evidence/browser.log",
        language: "log",
      },
      {
        id: "delivery",
        label: "Agent 交付说明",
        relativePath: "frontend-request-states/evidence/agent-delivery.md",
        language: "markdown",
      },
    ],
  },
  "avatar-persistence-retest": {
    id: "avatar-persistence-retest",
    title: "记忆回声：头像更新后又变回旧图",
    skillIds: ["api", "database", "debugging"],
    stepIds: [
      "independent-diagnosis",
      "evidence-plan",
      "practical-fix",
      "agent-brief",
      "verification-reflection",
    ],
    reportRelativePath: "avatar-persistence-retest/test-results.json",
    verificationSourceRelativePath:
      "avatar-persistence-retest/server/avatarRepository.js",
    transferRetest: {
      sourceScenarioId: "canvas-save-persistence",
      delayHours: 24,
    },
    artifacts: [
      {
        id: "frontend",
        label: "头像上传面板",
        relativePath:
          "avatar-persistence-retest/frontend/AvatarUploadPanel.jsx",
        language: "jsx",
      },
      {
        id: "route",
        label: "个人资料 API",
        relativePath: "avatar-persistence-retest/server/profileRoutes.js",
        language: "javascript",
      },
      {
        id: "repository",
        label: "头像数据访问层",
        relativePath: "avatar-persistence-retest/server/avatarRepository.js",
        language: "javascript",
      },
      {
        id: "schema",
        label: "用户资料表结构",
        relativePath: "avatar-persistence-retest/database/schema.sql",
        language: "sql",
      },
      {
        id: "upload-network",
        label: "上传请求 Network",
        relativePath: "avatar-persistence-retest/evidence/network-upload.json",
        language: "json",
      },
      {
        id: "relogin-network",
        label: "重新登录后的资料请求",
        relativePath:
          "avatar-persistence-retest/evidence/network-profile-after-relogin.json",
        language: "json",
      },
      {
        id: "logs",
        label: "个人资料服务日志",
        relativePath: "avatar-persistence-retest/evidence/backend.log",
        language: "log",
      },
      {
        id: "database",
        label: "用户资料数据库查询",
        relativePath: "avatar-persistence-retest/evidence/database-query.txt",
        language: "text",
      },
    ],
  },
  "meeting-assistant-retest": {
    id: "meeting-assistant-retest",
    title: "需求回声：AI 会议助手选错方向并忘记取舍",
    skillIds: ["product", "ai-application", "agent-brief"],
    stepIds: [
      "independent-diagnosis",
      "evidence-plan",
      "practical-fix",
      "agent-brief",
      "verification-reflection",
    ],
    reportRelativePath: "meeting-assistant-retest/test-results.json",
    verificationSourceRelativePath:
      "meeting-assistant-retest/server/meetingPlanner.js",
    transferRetest: {
      sourceScenarioId: "canvasstorm-product-brief",
      delayHours: 24,
    },
    artifacts: [
      {
        id: "frontend",
        label: "会议助手 Brief 表单",
        relativePath: "meeting-assistant-retest/frontend/MeetingBriefForm.jsx",
        language: "jsx",
      },
      {
        id: "planner",
        label: "会议助手候选规划器",
        relativePath: "meeting-assistant-retest/server/meetingPlanner.js",
        language: "javascript",
      },
      {
        id: "session-store",
        label: "会话存储",
        relativePath: "meeting-assistant-retest/server/sessionStore.js",
        language: "javascript",
      },
      {
        id: "request",
        label: "原始产品需求",
        relativePath: "meeting-assistant-retest/evidence/product-request.json",
        language: "json",
      },
      {
        id: "candidates",
        label: "候选方向与取舍",
        relativePath: "meeting-assistant-retest/evidence/candidate-set.json",
        language: "json",
      },
      {
        id: "session",
        label: "刷新后的会话证据",
        relativePath:
          "meeting-assistant-retest/evidence/session-after-refresh.json",
        language: "json",
      },
      {
        id: "delivery",
        label: "Agent 交付说明",
        relativePath: "meeting-assistant-retest/evidence/agent-delivery.md",
        language: "markdown",
      },
    ],
  },
  "support-shift-session-retest": {
    id: "support-shift-session-retest",
    title: "夜班中转：认证服务重启后全员掉线",
    skillIds: ["authentication", "api", "database", "debugging"],
    stepIds: [
      "independent-diagnosis",
      "evidence-plan",
      "practical-fix",
      "agent-brief",
      "verification-reflection",
    ],
    reportRelativePath: "support-shift-session-retest/test-results.json",
    verificationSourceRelativePath:
      "support-shift-session-retest/server/sessionRepository.js",
    transferRetest: {
      sourceScenarioId: "identity-session-corridor",
      delayHours: 24,
    },
    artifacts: [
      {
        id: "frontend",
        label: "客服登录态提示",
        relativePath:
          "support-shift-session-retest/frontend/SupportSessionBanner.jsx",
        language: "jsx",
      },
      {
        id: "route",
        label: "登录与续期路由",
        relativePath: "support-shift-session-retest/server/authRoutes.js",
        language: "javascript",
      },
      {
        id: "repository",
        label: "刷新会话仓库",
        relativePath:
          "support-shift-session-retest/server/sessionRepository.js",
        language: "javascript",
      },
      {
        id: "schema",
        label: "刷新会话表",
        relativePath: "support-shift-session-retest/database/schema.sql",
        language: "sql",
      },
      {
        id: "login-network",
        label: "登录请求 Network",
        relativePath:
          "support-shift-session-retest/evidence/network-login.json",
        language: "json",
      },
      {
        id: "refresh-network",
        label: "重启后的续期请求",
        relativePath:
          "support-shift-session-retest/evidence/network-refresh-after-restart.json",
        language: "json",
      },
      {
        id: "logs",
        label: "认证服务日志",
        relativePath: "support-shift-session-retest/evidence/backend.log",
        language: "log",
      },
      {
        id: "database",
        label: "刷新会话数据库查询",
        relativePath:
          "support-shift-session-retest/evidence/database-query.txt",
        language: "text",
      },
      {
        id: "delivery",
        label: "Agent 初步交付说明",
        relativePath: "support-shift-session-retest/evidence/agent-delivery.md",
        language: "markdown",
      },
    ],
  },
  "model-rate-limit-retest": {
    id: "model-rate-limit-retest",
    title: "信号风暴：模型限流被伪装成系统错误",
    skillIds: ["api", "error-handling", "logging", "ai-application"],
    stepIds: [
      "independent-diagnosis",
      "evidence-plan",
      "practical-fix",
      "agent-brief",
      "verification-reflection",
    ],
    reportRelativePath: "model-rate-limit-retest/test-results.json",
    verificationSourceRelativePath:
      "model-rate-limit-retest/server/summaryRoutes.js",
    transferRetest: {
      sourceScenarioId: "api-error-court",
      delayHours: 24,
    },
    artifacts: [
      {
        id: "frontend",
        label: "批量摘要提交面板",
        relativePath: "model-rate-limit-retest/frontend/BatchSummaryPanel.jsx",
        language: "jsx",
      },
      {
        id: "route",
        label: "摘要网关路由",
        relativePath: "model-rate-limit-retest/server/summaryRoutes.js",
        language: "javascript",
      },
      {
        id: "provider",
        label: "模型供应商边界",
        relativePath: "model-rate-limit-retest/server/providerClient.js",
        language: "javascript",
      },
      {
        id: "request-network",
        label: "浏览器合法请求",
        relativePath:
          "model-rate-limit-retest/evidence/network-batch-request.json",
        language: "json",
      },
      {
        id: "gateway-response",
        label: "网关通用 500 响应",
        relativePath:
          "model-rate-limit-retest/evidence/network-generic-500.json",
        language: "json",
      },
      {
        id: "upstream-response",
        label: "模型供应商 429 响应",
        relativePath:
          "model-rate-limit-retest/evidence/upstream-rate-limit.json",
        language: "json",
      },
      {
        id: "logs",
        label: "摘要网关关联日志",
        relativePath: "model-rate-limit-retest/evidence/gateway.log",
        language: "log",
      },
      {
        id: "policy",
        label: "模型限流处理约定",
        relativePath: "model-rate-limit-retest/evidence/retry-policy.md",
        language: "markdown",
      },
      {
        id: "delivery",
        label: "Agent 初步交付说明",
        relativePath: "model-rate-limit-retest/evidence/agent-delivery.md",
        language: "markdown",
      },
    ],
  },
  "rag-index-concurrency-retest": {
    id: "rag-index-concurrency-retest",
    title: "双星索引：两个 Worker 重复处理同一份文档",
    skillIds: ["database", "idempotency", "transaction", "rag"],
    stepIds: [
      "independent-diagnosis",
      "evidence-plan",
      "practical-fix",
      "agent-brief",
      "verification-reflection",
    ],
    reportRelativePath: "rag-index-concurrency-retest/test-results.json",
    verificationSourceRelativePath:
      "rag-index-concurrency-retest/server/indexJobRepository.js",
    transferRetest: {
      sourceScenarioId: "data-consistency-forge",
      delayHours: 24,
    },
    artifacts: [
      {
        id: "frontend",
        label: "知识文档上传面板",
        relativePath:
          "rag-index-concurrency-retest/frontend/KnowledgeUploadPanel.jsx",
        language: "jsx",
      },
      {
        id: "repository",
        label: "索引任务领取仓库",
        relativePath:
          "rag-index-concurrency-retest/server/indexJobRepository.js",
        language: "javascript",
      },
      {
        id: "schema",
        label: "索引任务与 Chunk 表结构",
        relativePath: "rag-index-concurrency-retest/database/schema.sql",
        language: "sql",
      },
      {
        id: "upload-network",
        label: "单次上传 Network",
        relativePath:
          "rag-index-concurrency-retest/evidence/network-upload.json",
        language: "json",
      },
      {
        id: "worker-timeline",
        label: "双 Worker 竞争时间线",
        relativePath:
          "rag-index-concurrency-retest/evidence/worker-race-timeline.json",
        language: "json",
      },
      {
        id: "duplicate-chunks",
        label: "重复 Chunk 数据库快照",
        relativePath:
          "rag-index-concurrency-retest/evidence/database-duplicate-chunks.json",
        language: "json",
      },
      {
        id: "logs",
        label: "双星索引井 Worker 日志",
        relativePath: "rag-index-concurrency-retest/evidence/backend.log",
        language: "log",
      },
      {
        id: "delivery",
        label: "Agent 初步交付说明",
        relativePath: "rag-index-concurrency-retest/evidence/agent-delivery.md",
        language: "markdown",
      },
    ],
  },
  "ai-briefing-latency-retest": {
    id: "ai-briefing-latency-retest",
    title: "晨星时序：AI 客服晨报首字迟到",
    skillIds: ["performance", "network", "cache", "ai-application"],
    stepIds: [
      "independent-diagnosis",
      "evidence-plan",
      "practical-fix",
      "agent-brief",
      "verification-reflection",
    ],
    reportRelativePath: "ai-briefing-latency-retest/test-results.json",
    verificationSourceRelativePath:
      "ai-briefing-latency-retest/server/briefingPerformance.js",
    transferRetest: {
      sourceScenarioId: "performance-fog-lab",
      delayHours: 24,
    },
    artifacts: [
      {
        id: "frontend",
        label: "AI 晨报加载面板",
        relativePath:
          "ai-briefing-latency-retest/frontend/MorningBriefingPanel.jsx",
        language: "jsx",
      },
      {
        id: "service",
        label: "晨报性能与缓存服务",
        relativePath:
          "ai-briefing-latency-retest/server/briefingPerformance.js",
        language: "javascript",
      },
      {
        id: "first-network",
        label: "首次打开 Network",
        relativePath:
          "ai-briefing-latency-retest/evidence/network-first-load.json",
        language: "json",
      },
      {
        id: "server-timing",
        label: "服务端耗时分段",
        relativePath: "ai-briefing-latency-retest/evidence/server-timing.json",
        language: "json",
      },
      {
        id: "second-network",
        label: "第二次打开对照",
        relativePath:
          "ai-briefing-latency-retest/evidence/network-second-load.json",
        language: "json",
      },
      {
        id: "render-profile",
        label: "浏览器渲染画像",
        relativePath: "ai-briefing-latency-retest/evidence/render-profile.json",
        language: "json",
      },
      {
        id: "logs",
        label: "晨报服务关联日志",
        relativePath: "ai-briefing-latency-retest/evidence/backend.log",
        language: "log",
      },
      {
        id: "delivery",
        label: "Agent 初步交付说明",
        relativePath: "ai-briefing-latency-retest/evidence/agent-delivery.md",
        language: "markdown",
      },
    ],
  },
  "model-key-rotation-retest": {
    id: "model-key-rotation-retest",
    title: "模型密钥轮换后 AI 助手失声",
    skillIds: ["ai-application", "security", "api", "debugging"],
    stepIds: [
      "independent-diagnosis",
      "evidence-plan",
      "practical-fix",
      "agent-brief",
      "verification-reflection",
    ],
    reportRelativePath: "model-key-rotation-retest/test-results.json",
    verificationSourceRelativePath:
      "model-key-rotation-retest/server/modelGateway.js",
    transferRetest: {
      sourceScenarioId: "ai-api-key-vault",
      delayHours: 24,
    },
    artifacts: [
      {
        id: "frontend",
        label: "AI 对话面板",
        relativePath: "model-key-rotation-retest/frontend/AssistantPanel.jsx",
        language: "jsx",
      },
      {
        id: "route",
        label: "自有模型 API 路由",
        relativePath: "model-key-rotation-retest/server/modelGateway.js",
        language: "javascript",
      },
      {
        id: "frontend-network",
        label: "浏览器 Network 密钥扫描",
        relativePath:
          "model-key-rotation-retest/evidence/frontend-network.json",
        language: "json",
      },
      {
        id: "env-config",
        label: "服务端环境变量检查",
        relativePath: "model-key-rotation-retest/evidence/env-config.json",
        language: "json",
      },
      {
        id: "upstream",
        label: "模型供应商响应",
        relativePath: "model-key-rotation-retest/evidence/upstream-401.json",
        language: "json",
      },
      {
        id: "logs",
        label: "模型网关安全日志",
        relativePath: "model-key-rotation-retest/evidence/gateway.log",
        language: "log",
      },
      {
        id: "delivery",
        label: "Agent 初步交付说明",
        relativePath: "model-key-rotation-retest/evidence/agent-delivery.md",
        language: "markdown",
      },
    ],
  },
  "citation-grounding-retest": {
    id: "citation-grounding-retest",
    title: "客服回答引用了不存在的退款条款",
    skillIds: ["ai-application", "prompt", "rag", "debugging"],
    stepIds: [
      "independent-diagnosis",
      "evidence-plan",
      "practical-fix",
      "agent-brief",
      "verification-reflection",
    ],
    reportRelativePath: "citation-grounding-retest/test-results.json",
    verificationSourceRelativePath:
      "citation-grounding-retest/server/answerGrounding.js",
    transferRetest: {
      sourceScenarioId: "hallucination-mirror-hall",
      delayHours: 24,
    },
    artifacts: [
      {
        id: "frontend",
        label: "客服回答面板",
        relativePath: "citation-grounding-retest/frontend/AnswerPanel.jsx",
        language: "jsx",
      },
      {
        id: "answer",
        label: "模型回答与引用",
        relativePath: "citation-grounding-retest/evidence/answer.json",
        language: "json",
      },
      {
        id: "source-doc",
        label: "允许引用的退款资料",
        relativePath: "citation-grounding-retest/evidence/source-policy.md",
        language: "markdown",
      },
      {
        id: "prompt-contract",
        label: "Prompt 回答契约",
        relativePath: "citation-grounding-retest/server/answerGrounding.js",
        language: "javascript",
      },
      {
        id: "citation-check",
        label: "引用命中校验",
        relativePath: "citation-grounding-retest/evidence/citation-check.json",
        language: "json",
      },
      {
        id: "logs",
        label: "回答校验日志",
        relativePath: "citation-grounding-retest/evidence/grounding.log",
        language: "log",
      },
      {
        id: "delivery",
        label: "Agent 初步交付说明",
        relativePath: "citation-grounding-retest/evidence/agent-delivery.md",
        language: "markdown",
      },
    ],
  },
  "retrieval-mismatch-retest": {
    id: "retrieval-mismatch-retest",
    title: "RAG 检索到了旧版本退款规则",
    skillIds: ["rag", "retrieval", "citation", "debugging"],
    stepIds: [
      "independent-diagnosis",
      "evidence-plan",
      "practical-fix",
      "agent-brief",
      "verification-reflection",
    ],
    reportRelativePath: "retrieval-mismatch-retest/test-results.json",
    verificationSourceRelativePath:
      "retrieval-mismatch-retest/server/retriever.js",
    transferRetest: {
      sourceScenarioId: "rag-knowledge-maze",
      delayHours: 24,
    },
    artifacts: [
      {
        id: "upload",
        label: "文档上传 Network",
        relativePath: "retrieval-mismatch-retest/evidence/upload.json",
        language: "json",
      },
      {
        id: "chunks",
        label: "新旧文档 Chunk 来源",
        relativePath: "retrieval-mismatch-retest/evidence/chunks.json",
        language: "json",
      },
      {
        id: "matches",
        label: "TopK 检索命中列表",
        relativePath: "retrieval-mismatch-retest/evidence/matches.json",
        language: "json",
      },
      {
        id: "retriever",
        label: "检索器代码",
        relativePath: "retrieval-mismatch-retest/server/retriever.js",
        language: "javascript",
      },
      {
        id: "answer",
        label: "带引用的错误回答",
        relativePath: "retrieval-mismatch-retest/evidence/answer.json",
        language: "json",
      },
      {
        id: "logs",
        label: "检索关联日志",
        relativePath: "retrieval-mismatch-retest/evidence/retrieval.log",
        language: "log",
      },
      {
        id: "delivery",
        label: "Agent 初步交付说明",
        relativePath: "retrieval-mismatch-retest/evidence/agent-delivery.md",
        language: "markdown",
      },
    ],
  },
  "tool-boundary-retest": {
    id: "tool-boundary-retest",
    title: "Agent 调用工具越过资源权限边界",
    skillIds: ["agent", "security", "schema", "debugging"],
    stepIds: [
      "independent-diagnosis",
      "evidence-plan",
      "practical-fix",
      "agent-brief",
      "verification-reflection",
    ],
    reportRelativePath: "tool-boundary-retest/test-results.json",
    verificationSourceRelativePath:
      "tool-boundary-retest/server/toolGateway.js",
    transferRetest: {
      sourceScenarioId: "agent-tool-tower",
      delayHours: 24,
    },
    artifacts: [
      {
        id: "agent-request",
        label: "Agent 工具调用请求",
        relativePath: "tool-boundary-retest/evidence/agent-request.json",
        language: "json",
      },
      {
        id: "registry",
        label: "工具注册表",
        relativePath: "tool-boundary-retest/server/toolGateway.js",
        language: "javascript",
      },
      {
        id: "schema",
        label: "参数 Schema",
        relativePath: "tool-boundary-retest/evidence/schema.json",
        language: "json",
      },
      {
        id: "audit-log",
        label: "权限审计日志",
        relativePath: "tool-boundary-retest/evidence/audit.log",
        language: "log",
      },
      {
        id: "fallback",
        label: "失败回退响应",
        relativePath: "tool-boundary-retest/evidence/fallback.json",
        language: "json",
      },
      {
        id: "delivery",
        label: "Agent 初步交付说明",
        relativePath: "tool-boundary-retest/evidence/agent-delivery.md",
        language: "markdown",
      },
    ],
  },
  "verification-proof-retest": {
    id: "verification-proof-retest",
    title: "全绿验收报告为什么仍然不可信",
    skillIds: ["testing", "verification", "delivery-review", "debugging"],
    stepIds: [
      "independent-diagnosis",
      "evidence-plan",
      "practical-fix",
      "agent-brief",
      "verification-reflection",
    ],
    reportRelativePath: "verification-proof-retest/test-results.json",
    verificationSourceRelativePath:
      "verification-proof-retest/server/reportVerifier.js",
    transferRetest: {
      sourceScenarioId: "verification-trial-arena",
      delayHours: 24,
    },
    artifacts: [
      {
        id: "failing-before",
        label: "失败复现报告",
        relativePath: "verification-proof-retest/evidence/failing-before.json",
        language: "json",
      },
      {
        id: "report-validator",
        label: "验收报告校验器",
        relativePath: "verification-proof-retest/server/reportVerifier.js",
        language: "javascript",
      },
      {
        id: "passing-stale",
        label: "旧源码全绿报告",
        relativePath: "verification-proof-retest/evidence/passing-stale.json",
        language: "json",
      },
      {
        id: "network",
        label: "保存链路 Network",
        relativePath:
          "verification-proof-retest/evidence/network-test-run.json",
        language: "json",
      },
      {
        id: "manual-report",
        label: "手动复测报告",
        relativePath: "verification-proof-retest/evidence/manual-report.md",
        language: "markdown",
      },
      {
        id: "logs",
        label: "源码指纹日志",
        relativePath: "verification-proof-retest/evidence/backend.log",
        language: "log",
      },
      {
        id: "delivery",
        label: "Agent 交付说明",
        relativePath: "verification-proof-retest/evidence/agent-delivery.md",
        language: "markdown",
      },
    ],
  },
  "brief-contract-retest": {
    id: "brief-contract-retest",
    title: "Agent 委托缺少边界与回滚",
    skillIds: ["agent", "task-brief", "acceptance", "delivery-review"],
    stepIds: [
      "independent-diagnosis",
      "evidence-plan",
      "practical-fix",
      "agent-brief",
      "verification-reflection",
    ],
    reportRelativePath: "brief-contract-retest/test-results.json",
    verificationSourceRelativePath:
      "brief-contract-retest/server/briefContract.js",
    transferRetest: {
      sourceScenarioId: "agent-brief-forge",
      delayHours: 24,
    },
    artifacts: [
      {
        id: "request",
        label: "业务请求背景",
        relativePath: "brief-contract-retest/evidence/request.json",
        language: "json",
      },
      {
        id: "vague-brief",
        label: "模糊委托反例",
        relativePath: "brief-contract-retest/evidence/vague-brief.json",
        language: "json",
      },
      {
        id: "unsafe-brief",
        label: "越界委托反例",
        relativePath: "brief-contract-retest/evidence/unsafe-brief.json",
        language: "json",
      },
      {
        id: "clear-brief",
        label: "清晰委托样例",
        relativePath: "brief-contract-retest/evidence/clear-brief.json",
        language: "json",
      },
      {
        id: "validator",
        label: "委托契约校验器",
        relativePath: "brief-contract-retest/server/briefContract.js",
        language: "javascript",
      },
      {
        id: "delivery",
        label: "Agent 交付说明",
        relativePath: "brief-contract-retest/evidence/agent-delivery.md",
        language: "markdown",
      },
    ],
  },
  "review-evidence-retest": {
    id: "review-evidence-retest",
    title: "交付证据与 Diff 不一致",
    skillIds: ["delivery-review", "diff-review", "quality-gate", "testing"],
    stepIds: [
      "independent-diagnosis",
      "evidence-plan",
      "practical-fix",
      "agent-brief",
      "verification-reflection",
    ],
    reportRelativePath: "review-evidence-retest/test-results.json",
    verificationSourceRelativePath:
      "review-evidence-retest/server/reviewGate.js",
    transferRetest: {
      sourceScenarioId: "delivery-review-court",
      delayHours: 24,
    },
    artifacts: [
      {
        id: "delivery-note",
        label: "Agent 交付说明",
        relativePath: "review-evidence-retest/evidence/agent-delivery.md",
        language: "markdown",
      },
      {
        id: "diff-summary",
        label: "Diff 范围摘要",
        relativePath: "review-evidence-retest/evidence/diff-summary.json",
        language: "json",
      },
      {
        id: "test-evidence",
        label: "过期测试证据",
        relativePath: "review-evidence-retest/evidence/test-evidence.json",
        language: "json",
      },
      {
        id: "browser-checks",
        label: "浏览器验收记录",
        relativePath: "review-evidence-retest/evidence/browser-checks.json",
        language: "json",
      },
      {
        id: "docs-sync",
        label: "文档同步缺口",
        relativePath: "review-evidence-retest/evidence/docs-sync.json",
        language: "json",
      },
      {
        id: "logs",
        label: "审查日志",
        relativePath: "review-evidence-retest/evidence/backend.log",
        language: "log",
      },
      {
        id: "decision",
        label: "拒收决定书",
        relativePath: "review-evidence-retest/evidence/review-decision.md",
        language: "markdown",
      },
    ],
  },
  "release-proof-retest": {
    id: "release-proof-retest",
    title: "上线门禁缺少恢复与监控证据",
    skillIds: [
      "release-readiness",
      "ops-checklist",
      "rollback",
      "observability",
    ],
    stepIds: [
      "independent-diagnosis",
      "evidence-plan",
      "practical-fix",
      "agent-brief",
      "verification-reflection",
    ],
    reportRelativePath: "release-proof-retest/test-results.json",
    verificationSourceRelativePath:
      "release-proof-retest/server/releaseGate.js",
    transferRetest: {
      sourceScenarioId: "release-readiness-gate",
      delayHours: 24,
    },
    artifacts: [
      {
        id: "release-plan",
        label: "上线计划",
        relativePath: "release-proof-retest/evidence/release-plan.json",
        language: "json",
      },
      {
        id: "environment",
        label: "生产环境变量",
        relativePath: "release-proof-retest/evidence/environment.json",
        language: "json",
      },
      {
        id: "backup",
        label: "备份恢复证据",
        relativePath: "release-proof-retest/evidence/backup.json",
        language: "json",
      },
      {
        id: "smoke-test",
        label: "390px 冒烟缺口",
        relativePath: "release-proof-retest/evidence/smoke-test.json",
        language: "json",
      },
      {
        id: "monitoring",
        label: "监控信号",
        relativePath: "release-proof-retest/evidence/monitoring.json",
        language: "json",
      },
      {
        id: "rollback",
        label: "回滚方案",
        relativePath: "release-proof-retest/evidence/rollback.md",
        language: "markdown",
      },
      {
        id: "logs",
        label: "上线门禁日志",
        relativePath: "release-proof-retest/evidence/backend.log",
        language: "log",
      },
    ],
  },
  "interview-proof-retest": {
    id: "interview-proof-retest",
    title: "把新事故讲成有证据的工程故事",
    skillIds: ["interview-story", "star", "project-retrospective", "evidence"],
    stepIds: [
      "independent-diagnosis",
      "evidence-plan",
      "practical-fix",
      "agent-brief",
      "verification-reflection",
    ],
    reportRelativePath: "interview-proof-retest/test-results.json",
    verificationSourceRelativePath:
      "interview-proof-retest/server/answerGate.js",
    transferRetest: {
      sourceScenarioId: "interview-answer-forge",
      delayHours: 24,
    },
    artifacts: [
      {
        id: "story-bank",
        label: "新项目素材库",
        relativePath: "interview-proof-retest/evidence/story-bank.json",
        language: "json",
      },
      {
        id: "star-draft",
        label: "STAR 草稿",
        relativePath: "interview-proof-retest/evidence/star-draft.json",
        language: "json",
      },
      {
        id: "incident-review",
        label: "故障复盘",
        relativePath: "interview-proof-retest/evidence/incident-review.json",
        language: "json",
      },
      {
        id: "tradeoff",
        label: "技术取舍与代价",
        relativePath: "interview-proof-retest/evidence/tradeoff.json",
        language: "json",
      },
      {
        id: "follow-ups",
        label: "追问演练",
        relativePath: "interview-proof-retest/evidence/follow-ups.json",
        language: "json",
      },
      {
        id: "rubric",
        label: "答辩 Rubric",
        relativePath: "interview-proof-retest/evidence/rubric.json",
        language: "json",
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
  "java-transaction-consistency": {
    id: "java-transaction-consistency",
    title: "事务、锁与一致性",
    skillIds: ["java", "database", "idempotency", "transaction"],
    stepIds: [
      "duplicate-reproduction",
      "idempotency-key",
      "unique-constraint",
      "transaction-boundary",
      "agent-brief",
      "delivery-review",
      "interview-dossier",
    ],
    reportRelativePath: "java-transaction-consistency/test-results.json",
    verificationSourceRelativePath:
      "java-transaction-consistency/server/OrderService.java",
    artifacts: [
      {
        id: "frontend",
        label: "重复下单入口",
        relativePath:
          "java-transaction-consistency/frontend/SaveDraftButton.jsx",
        language: "jsx",
      },
      {
        id: "repository",
        label: "订单与库存事务数据层",
        relativePath: "java-transaction-consistency/server/draftRepository.js",
        language: "javascript",
      },
      {
        id: "service",
        label: "OrderService 事务边界",
        relativePath: "java-transaction-consistency/server/OrderService.java",
        language: "java",
      },
      {
        id: "order-repository",
        label: "OrderRepository 数据接口",
        relativePath:
          "java-transaction-consistency/server/OrderRepository.java",
        language: "java",
      },
      {
        id: "double-submit",
        label: "重复请求 Network 记录",
        relativePath:
          "java-transaction-consistency/evidence/network-double-submit.json",
        language: "json",
      },
      {
        id: "database-before",
        label: "事务前数据库",
        relativePath:
          "java-transaction-consistency/evidence/database-before.json",
        language: "json",
      },
      {
        id: "database-after",
        label: "失败后的数据库状态",
        relativePath:
          "java-transaction-consistency/evidence/database-after.json",
        language: "json",
      },
      {
        id: "logs",
        label: "事务熔炉后端日志",
        relativePath: "java-transaction-consistency/evidence/backend.log",
        language: "log",
      },
      {
        id: "delivery",
        label: "Agent 交付说明",
        relativePath: "java-transaction-consistency/evidence/agent-delivery.md",
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
  "java-cache-observability": {
    id: "java-cache-observability",
    title: "缓存为什么留下旧数据",
    skillIds: ["java", "performance", "cache", "observability"],
    stepIds: [
      "waterfall-reading",
      "server-timing",
      "render-bottleneck",
      "cache-retest",
      "agent-brief",
      "delivery-review",
      "interview-dossier",
    ],
    reportRelativePath: "java-cache-observability/test-results.json",
    verificationSourceRelativePath:
      "java-cache-observability/server/ProjectCacheService.java",
    artifacts: [
      {
        id: "frontend",
        label: "项目状态读取入口",
        relativePath: "java-cache-observability/frontend/ProjectList.jsx",
        language: "jsx",
      },
      {
        id: "performance-service",
        label: "ProjectCacheService 服务",
        relativePath:
          "java-cache-observability/server/ProjectCacheService.java",
        language: "java",
      },
      {
        id: "waterfall",
        label: "请求时间线",
        relativePath:
          "java-cache-observability/evidence/network-waterfall.json",
        language: "json",
      },
      {
        id: "render-profile",
        label: "客户端读取画像",
        relativePath: "java-cache-observability/evidence/render-profile.json",
        language: "json",
      },
      {
        id: "cache-retest",
        label: "缓存复测记录",
        relativePath: "java-cache-observability/evidence/cache-retest.json",
        language: "json",
      },
      {
        id: "logs",
        label: "缓存与数据库日志",
        relativePath: "java-cache-observability/evidence/backend.log",
        language: "log",
      },
      {
        id: "delivery",
        label: "Agent 交付说明",
        relativePath: "java-cache-observability/evidence/agent-delivery.md",
        language: "markdown",
      },
    ],
  },
  "frontend-performance-proof": {
    id: "frontend-performance-proof",
    title: "首屏性能与渲染证据",
    skillIds: ["frontend", "performance", "network", "react"],
    stepIds: [
      "waterfall-reading",
      "server-timing",
      "render-bottleneck",
      "cache-retest",
      "agent-brief",
      "delivery-review",
      "interview-dossier",
    ],
    reportRelativePath: "frontend-performance-proof/test-results.json",
    verificationSourceRelativePath:
      "frontend-performance-proof/frontend/ProjectList.jsx",
    artifacts: [
      {
        id: "frontend",
        label: "ProjectList 页面",
        relativePath: "frontend-performance-proof/frontend/ProjectList.jsx",
        language: "jsx",
      },
      {
        id: "performance-service",
        label: "接口性能逻辑",
        relativePath: "frontend-performance-proof/server/projectPerformance.js",
        language: "javascript",
      },
      {
        id: "waterfall",
        label: "首屏 Network 瀑布图",
        relativePath:
          "frontend-performance-proof/evidence/network-waterfall.json",
        language: "json",
      },
      {
        id: "render-profile",
        label: "React 渲染画像",
        relativePath: "frontend-performance-proof/evidence/render-profile.json",
        language: "json",
      },
      {
        id: "cache-retest",
        label: "优化后复测记录",
        relativePath: "frontend-performance-proof/evidence/cache-retest.json",
        language: "json",
      },
      {
        id: "logs",
        label: "接口耗时日志",
        relativePath: "frontend-performance-proof/evidence/backend.log",
        language: "log",
      },
      {
        id: "delivery",
        label: "Agent 交付说明",
        relativePath: "frontend-performance-proof/evidence/agent-delivery.md",
        language: "markdown",
      },
    ],
  },
  "java-release-harbor": {
    id: "java-release-harbor",
    title: "服务上线前如何留退路",
    skillIds: ["java", "release", "configuration", "observability"],
    stepIds: [
      "release-plan",
      "environment-check",
      "backup-restore",
      "monitoring-signals",
      "rollback-plan",
      "agent-brief",
      "delivery-review",
      "interview-dossier",
    ],
    reportRelativePath: "java-release-harbor/test-results.json",
    verificationSourceRelativePath:
      "java-release-harbor/server/ReleaseGate.java",
    artifacts: [
      {
        id: "release-plan",
        label: "上线计划",
        relativePath: "java-release-harbor/evidence/release-plan.json",
        language: "json",
      },
      {
        id: "environment",
        label: "环境配置检查",
        relativePath: "java-release-harbor/evidence/environment-check.json",
        language: "json",
      },
      {
        id: "backup",
        label: "备份记录",
        relativePath: "java-release-harbor/evidence/backup-record.json",
        language: "json",
      },
      {
        id: "smoke",
        label: "冒烟测试",
        relativePath: "java-release-harbor/evidence/smoke-test.json",
        language: "json",
      },
      {
        id: "monitoring",
        label: "监控快照",
        relativePath: "java-release-harbor/evidence/monitoring-snapshot.json",
        language: "json",
      },
      {
        id: "rollback",
        label: "回滚计划",
        relativePath: "java-release-harbor/evidence/rollback-plan.md",
        language: "markdown",
      },
      {
        id: "gate",
        label: "ReleaseGate.java",
        relativePath: "java-release-harbor/server/ReleaseGate.java",
        language: "java",
      },
      {
        id: "delivery",
        label: "Agent 交付说明",
        relativePath: "java-release-harbor/evidence/agent-delivery.md",
        language: "markdown",
      },
    ],
  },
  "java-production-incident": {
    id: "java-production-incident",
    title: "线上故障怎样从日志走到回滚",
    skillIds: ["java", "incident-response", "observability", "rollback"],
    stepIds: [
      "release-plan",
      "environment-check",
      "backup-restore",
      "monitoring-signals",
      "rollback-plan",
      "agent-brief",
      "delivery-review",
      "interview-dossier",
    ],
    reportRelativePath: "java-production-incident/test-results.json",
    verificationSourceRelativePath:
      "java-production-incident/server/IncidentTimeline.java",
    artifacts: [
      {
        id: "release-plan",
        label: "事故时间线",
        relativePath: "java-production-incident/evidence/release-plan.json",
        language: "json",
      },
      {
        id: "environment",
        label: "运行环境检查",
        relativePath:
          "java-production-incident/evidence/environment-check.json",
        language: "json",
      },
      {
        id: "backup",
        label: "恢复演练记录",
        relativePath: "java-production-incident/evidence/backup-record.json",
        language: "json",
      },
      {
        id: "smoke",
        label: "止血后冒烟结果",
        relativePath: "java-production-incident/evidence/smoke-test.json",
        language: "json",
      },
      {
        id: "monitoring",
        label: "日志与指标快照",
        relativePath:
          "java-production-incident/evidence/monitoring-snapshot.json",
        language: "json",
      },
      {
        id: "rollback",
        label: "回滚决定",
        relativePath: "java-production-incident/evidence/rollback-plan.md",
        language: "markdown",
      },
      {
        id: "gate",
        label: "IncidentTimeline.java",
        relativePath: "java-production-incident/server/IncidentTimeline.java",
        language: "java",
      },
      {
        id: "delivery",
        label: "Agent 事故交付说明",
        relativePath: "java-production-incident/evidence/agent-delivery.md",
        language: "markdown",
      },
    ],
  },
  "frontend-accessibility-proof": {
    id: "frontend-accessibility-proof",
    title: "可访问性与前端交付",
    skillIds: ["frontend", "accessibility", "responsive", "regression"],
    stepIds: [
      "release-plan",
      "environment-check",
      "backup-restore",
      "monitoring-signals",
      "rollback-plan",
      "agent-brief",
      "delivery-review",
      "interview-dossier",
    ],
    reportRelativePath: "frontend-accessibility-proof/test-results.json",
    verificationSourceRelativePath:
      "frontend-accessibility-proof/frontend/ReleaseGatePanel.jsx",
    artifacts: [
      {
        id: "release-plan",
        label: "交互验收计划",
        relativePath: "frontend-accessibility-proof/evidence/release-plan.json",
        language: "json",
      },
      {
        id: "environment",
        label: "键盘与语义检查",
        relativePath:
          "frontend-accessibility-proof/evidence/environment-check.json",
        language: "json",
      },
      {
        id: "backup",
        label: "移动端复测",
        relativePath:
          "frontend-accessibility-proof/evidence/backup-record.json",
        language: "json",
      },
      {
        id: "smoke",
        label: "浏览器主流程",
        relativePath: "frontend-accessibility-proof/evidence/smoke-test.json",
        language: "json",
      },
      {
        id: "monitoring",
        label: "可访问性检查结果",
        relativePath:
          "frontend-accessibility-proof/evidence/monitoring-snapshot.json",
        language: "json",
      },
      {
        id: "rollback",
        label: "回归风险说明",
        relativePath: "frontend-accessibility-proof/evidence/rollback-plan.md",
        language: "markdown",
      },
      {
        id: "component",
        label: "交互组件代码",
        relativePath:
          "frontend-accessibility-proof/frontend/ReleaseGatePanel.jsx",
        language: "jsx",
      },
      {
        id: "delivery",
        label: "Agent 交付说明",
        relativePath: "frontend-accessibility-proof/evidence/agent-delivery.md",
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
  "frontend-testing-proof": {
    id: "frontend-testing-proof",
    title: "前端测试怎么证明修好了",
    skillIds: ["frontend", "testing", "regression", "verification"],
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
    reportRelativePath: "frontend-testing-proof/test-results.json",
    verificationSourceRelativePath:
      "frontend-testing-proof/server/verificationReport.js",
    artifacts: [
      {
        id: "frontend",
        label: "前端验收报告面板",
        relativePath:
          "frontend-testing-proof/frontend/VerificationReportPanel.jsx",
        language: "jsx",
      },
      {
        id: "report-validator",
        label: "前端交付验收校验器",
        relativePath: "frontend-testing-proof/server/verificationReport.js",
        language: "javascript",
      },
      {
        id: "failing-before",
        label: "旧问题失败复现报告",
        relativePath: "frontend-testing-proof/evidence/failing-before.json",
        language: "json",
      },
      {
        id: "passing-stale",
        label: "过期通过报告",
        relativePath:
          "frontend-testing-proof/evidence/passing-after-stale.json",
        language: "json",
      },
      {
        id: "network",
        label: "前端 Network 复测",
        relativePath: "frontend-testing-proof/evidence/network-test-run.json",
        language: "json",
      },
      {
        id: "manual-report",
        label: "浏览器手动复测报告",
        relativePath: "frontend-testing-proof/evidence/manual-report.md",
        language: "markdown",
      },
      {
        id: "logs",
        label: "前端回归后端日志",
        relativePath: "frontend-testing-proof/evidence/backend.log",
        language: "log",
      },
      {
        id: "delivery",
        label: "Agent 前端交付说明",
        relativePath: "frontend-testing-proof/evidence/agent-delivery.md",
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

const requiredStepIdsByScenario: Record<string, string[]> = {
  "canvas-save-persistence": [
    "inspect-evidence",
    "trace-data-flow",
    "agent-brief",
    "delivery-review",
    "causal-explanation",
    "transfer-check",
  ],
  "java-layered-request": [
    "inspect-evidence",
    "trace-flow",
    "agent-brief",
    "delivery-review",
    "causal-explanation",
  ],
  "frontend-component-state": [
    "inspect-evidence",
    "trace-render-flow",
    "agent-brief",
    "delivery-review",
    "causal-explanation",
  ],
  "frontend-request-states": [
    "inspect-evidence",
    "trace-render-flow",
    "agent-brief",
    "delivery-review",
    "causal-explanation",
  ],
  "avatar-persistence-retest": [
    "independent-diagnosis",
    "evidence-plan",
    "agent-brief",
    "verification-reflection",
  ],
  "meeting-assistant-retest": [
    "independent-diagnosis",
    "evidence-plan",
    "agent-brief",
    "verification-reflection",
  ],
  "support-shift-session-retest": [
    "independent-diagnosis",
    "evidence-plan",
    "agent-brief",
    "verification-reflection",
  ],
  "model-rate-limit-retest": [
    "independent-diagnosis",
    "evidence-plan",
    "agent-brief",
    "verification-reflection",
  ],
  "rag-index-concurrency-retest": [
    "independent-diagnosis",
    "evidence-plan",
    "agent-brief",
    "verification-reflection",
  ],
  "ai-briefing-latency-retest": [
    "independent-diagnosis",
    "evidence-plan",
    "agent-brief",
    "verification-reflection",
  ],
  "model-key-rotation-retest": [
    "independent-diagnosis",
    "evidence-plan",
    "agent-brief",
    "verification-reflection",
  ],
  "citation-grounding-retest": [
    "independent-diagnosis",
    "evidence-plan",
    "agent-brief",
    "verification-reflection",
  ],
  "retrieval-mismatch-retest": [
    "independent-diagnosis",
    "evidence-plan",
    "agent-brief",
    "verification-reflection",
  ],
  "tool-boundary-retest": [
    "independent-diagnosis",
    "evidence-plan",
    "agent-brief",
    "verification-reflection",
  ],
  "canvasstorm-product-brief": [
    "product-brief",
    "candidate-direction",
    "agent-brief",
    "delivery-review",
    "interview-dossier",
  ],
  "identity-session-corridor": [
    "identity-map",
    "credential-storage",
    "protected-request",
    "agent-brief",
    "delivery-review",
    "interview-dossier",
  ],
  "api-error-court": [
    "payload-inspection",
    "status-code-judgement",
    "log-correlation",
    "agent-brief",
    "delivery-review",
    "interview-dossier",
  ],
  "data-consistency-forge": [
    "duplicate-reproduction",
    "idempotency-key",
    "unique-constraint",
    "agent-brief",
    "delivery-review",
    "interview-dossier",
  ],
  "java-transaction-consistency": [
    "duplicate-reproduction",
    "idempotency-key",
    "unique-constraint",
    "transaction-boundary",
    "agent-brief",
    "delivery-review",
    "interview-dossier",
  ],
  "performance-fog-lab": [
    "waterfall-reading",
    "server-timing",
    "render-bottleneck",
    "agent-brief",
    "delivery-review",
    "interview-dossier",
  ],
  "java-cache-observability": [
    "waterfall-reading",
    "server-timing",
    "render-bottleneck",
    "cache-retest",
    "agent-brief",
    "delivery-review",
    "interview-dossier",
  ],
  "frontend-performance-proof": [
    "waterfall-reading",
    "server-timing",
    "render-bottleneck",
    "cache-retest",
    "agent-brief",
    "delivery-review",
    "interview-dossier",
  ],
  "ai-api-key-vault": [
    "frontend-secret-scan",
    "server-env-key",
    "failure-fallback",
    "agent-brief",
    "delivery-review",
    "interview-dossier",
  ],
  "hallucination-mirror-hall": [
    "prompt-contract",
    "context-boundary",
    "refusal-policy",
    "agent-brief",
    "delivery-review",
    "interview-dossier",
  ],
  "rag-knowledge-maze": [
    "chunk-indexing",
    "embedding-search",
    "topk-evidence",
    "agent-brief",
    "delivery-review",
    "interview-dossier",
  ],
  "agent-tool-tower": [
    "tool-registry",
    "schema-validation",
    "permission-check",
    "failure-review",
    "agent-brief",
    "delivery-review",
    "interview-dossier",
  ],
  "verification-proof-retest": [
    "independent-diagnosis",
    "evidence-plan",
    "agent-brief",
    "verification-reflection",
  ],
  "brief-contract-retest": [
    "independent-diagnosis",
    "evidence-plan",
    "agent-brief",
    "verification-reflection",
  ],
  "review-evidence-retest": [
    "independent-diagnosis",
    "evidence-plan",
    "agent-brief",
    "verification-reflection",
  ],
  "release-proof-retest": [
    "independent-diagnosis",
    "evidence-plan",
    "agent-brief",
    "verification-reflection",
  ],
  "interview-proof-retest": [
    "independent-diagnosis",
    "evidence-plan",
    "agent-brief",
    "verification-reflection",
  ],
  "verification-trial-arena": [
    "repro-case",
    "unit-boundary",
    "integration-flow",
    "regression-risk",
    "agent-brief",
    "delivery-review",
    "interview-dossier",
  ],
  "frontend-testing-proof": [
    "repro-case",
    "unit-boundary",
    "integration-flow",
    "regression-risk",
    "agent-brief",
    "delivery-review",
    "interview-dossier",
  ],
  "agent-brief-forge": [
    "context-evidence",
    "observable-goal",
    "scope-constraints",
    "risk-rollback",
    "delivery-format",
    "agent-brief",
    "interview-dossier",
  ],
  "delivery-review-court": [
    "delivery-summary",
    "diff-scope",
    "test-evidence",
    "docs-sync",
    "review-decision",
    "interview-dossier",
  ],
  "release-readiness-gate": [
    "release-plan",
    "environment-check",
    "backup-restore",
    "monitoring-signals",
    "rollback-plan",
    "agent-brief",
    "interview-dossier",
  ],
  "java-release-harbor": [
    "release-plan",
    "environment-check",
    "backup-restore",
    "monitoring-signals",
    "rollback-plan",
    "agent-brief",
    "interview-dossier",
  ],
  "java-production-incident": [
    "release-plan",
    "environment-check",
    "backup-restore",
    "monitoring-signals",
    "rollback-plan",
    "agent-brief",
    "delivery-review",
    "interview-dossier",
  ],
  "frontend-accessibility-proof": [
    "release-plan",
    "environment-check",
    "backup-restore",
    "monitoring-signals",
    "rollback-plan",
    "agent-brief",
    "delivery-review",
    "interview-dossier",
  ],
  "interview-answer-forge": [
    "story-bank",
    "star-answer",
    "incident-review",
    "tradeoff",
    "follow-up-drill",
    "interview-dossier",
  ],
};

export function requiredScenarioSteps(scenarioId: string) {
  const scenario = requireScenario(scenarioId);
  const required = requiredStepIdsByScenario[scenario.id];
  if (!required) {
    throw new ContractError("UNKNOWN_SCENARIO", "未知的练习场景");
  }
  for (const stepId of required) {
    requireScenarioStep(scenario.id, stepId);
  }
  return required;
}

export function getTransferRetestScenario(sourceScenarioId: string) {
  return (Object.values(scenarios) as ScenarioDefinition[]).find(
    (scenario) =>
      "transferRetest" in scenario &&
      scenario.transferRetest?.sourceScenarioId === sourceScenarioId,
  );
}

export class ContractError extends Error {
  constructor(
    public readonly code: string,
    message: string,
  ) {
    super(message);
  }
}
