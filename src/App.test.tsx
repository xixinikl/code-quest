import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import App from "./App";
import { GuidedCodeTour, TeachingBridge } from "./TeachingBridge";
import { case02Scenario } from "./teaching";

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

  await user.click(screen.getByRole("button", { name: /走进档案馆/ }));
  await user.click(screen.getByRole("button", { name: /调取现场证据/ }));
  expect(screen.getByText(/真正的调试师/)).toBeInTheDocument();

  await user.click(screen.getByRole("button", { name: /领取委托/ }));
  expect(screen.getAllByText(/15 章/).length).toBeGreaterThan(0);
  expect(
    screen.getByRole("button", { name: /AI 应用开发.*可进入/ }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: /Java 后端.*即将解锁/ }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: /前端工程.*即将解锁/ }),
  ).toBeInTheDocument();
  await user.click(screen.getByRole("button", { name: /Java 后端.*即将解锁/ }));
  expect(
    screen.getByText(/规划路线：让用户能读懂后端服务/),
  ).toBeInTheDocument();
  expect(screen.getByText(/这条路线未开放/)).toBeInTheDocument();
  expect(screen.getAllByText(/事务和锁/).length).toBeGreaterThan(0);
  await user.click(screen.getByRole("button", { name: /AI 应用开发.*可进入/ }));
  expect(screen.getAllByText(/找回消失的登录状态/).length).toBeGreaterThan(0);
  expect(screen.getAllByText(/安全接入 AI API/).length).toBeGreaterThan(0);
  expect(screen.getByText(/让资料进入 AI 回答/)).toBeInTheDocument();
  expect(screen.getByText(/把项目经历讲成面试回答/)).toBeInTheDocument();
  expect(screen.getByText(/身份回廊的门牌一刷新就掉落/)).toBeInTheDocument();
  expect(screen.getByText(/登录表单 → 后端校验/)).toBeInTheDocument();
  expect(screen.getByText(/Application、Network/)).toBeInTheDocument();
  expect(screen.getByText(/伙伴图鉴/)).toBeInTheDocument();
  expect(screen.getByText(/收集角色、宠物与装备/)).toBeInTheDocument();
  expect(screen.getByText(/伙伴背包/)).toBeInTheDocument();
  expect(screen.getByText(/已收集能力 0\/15/)).toBeInTheDocument();
  expect(screen.getAllByText(/能力印记/).length).toBeGreaterThan(0);
  expect(screen.getAllByText(/面试复盘/).length).toBeGreaterThan(0);
  expect(screen.getByText(/面试复盘册/)).toBeInTheDocument();
  expect(screen.getAllByText(/现象/).length).toBeGreaterThan(0);
  expect(screen.getAllByText(/定位证据/).length).toBeGreaterThan(0);
  expect(screen.getAllByText(/行动\/修改/).length).toBeGreaterThan(0);
  expect(screen.getAllByText(/验证动作/).length).toBeGreaterThan(0);
  expect(screen.getAllByText(/可迁移经验/).length).toBeGreaterThan(0);
  expect(
    screen.getByRole("button", { name: /进入复盘房间/ }),
  ).toBeInTheDocument();
  expect(screen.getAllByText(/审判庭书记员/).length).toBeGreaterThan(0);

  await user.click(
    screen.getByRole("button", { name: /第 5 章 · 数据为什么重复/ }),
  );
  expect(screen.getByText(/一致性熔炉被连敲三下/)).toBeInTheDocument();
  expect(screen.getByText(/唯一索引、提交按钮锁定/)).toBeInTheDocument();
  expect(screen.getByText(/连续点击、刷新重试和并发请求/)).toBeInTheDocument();

  await user.click(screen.getByRole("button", { name: /进入主线/ }));
}

afterEach(() => {
  vi.unstubAllGlobals();
  localStorage.clear();
});

describe("AI 职业路线入口", () => {
  it("代码导读会把关键行翻译成新手能懂的流程和证据边界", () => {
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
    expect(
      screen.getAllByText(/用户输入 → Brief 表单状态/).length,
    ).toBeGreaterThan(0);
    expect(screen.getByText(/逐行翻译/)).toBeInTheDocument();
    expect(screen.getByText(/先看人话，再看语法/)).toBeInTheDocument();
    expect(screen.getByText("能证明")).toBeInTheDocument();
    expect(screen.getByText("不能证明")).toBeInTheDocument();
    expect(screen.getByText("交给 Agent")).toBeInTheDocument();
    expect(
      screen.getByText(/还要继续看 Network、后端日志、数据库记录或测试结果/),
    ).toBeInTheDocument();
    expect(screen.getByText(/请只围绕/)).toBeInTheDocument();
  });

  it("教学进度只统计当前章节步骤并封顶 100%", async () => {
    const user = userEvent.setup();
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

    await screen.findByRole("button", { name: /开始闯关/ });
    await user.click(screen.getByRole("button", { name: /开始闯关/ }));

    expect(await screen.findByText(/进度 100%/)).toBeInTheDocument();
    expect(screen.queryByText(/进度 125%/)).not.toBeInTheDocument();
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
    await user.click(screen.getByRole("button", { name: /进入复盘房间/ }));

    expect(
      await screen.findByRole("heading", {
        name: /把通关经历写成你自己的项目回答/,
      }),
    ).toBeInTheDocument();
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
    await user.click(screen.getByRole("button", { name: /打开作品集/ }));

    expect(
      await screen.findByRole("heading", {
        name: /把 15 章通关经历整理成可讲的项目证据/,
      }),
    ).toBeInTheDocument();
    expect(screen.getByText(/Markdown 导出稿/)).toBeInTheDocument();
    expect(screen.getAllByText(/页面提示保存成功/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Network 返回 201/).length).toBeGreaterThan(0);
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
    await user.click(screen.getByRole("button", { name: /打开备份库/ }));

    expect(
      await screen.findByRole("heading", {
        name: /把你的通关证据封存成一份可恢复的本地备份/,
      }),
    ).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /生成备份 JSON/ }));
    expect(
      await screen.findByText(/已生成本地学习记录备份/),
    ).toBeInTheDocument();
    expect(
      (screen.getByLabelText("备份 JSON") as HTMLTextAreaElement).value,
    ).toContain("code-quest-learning-backup");

    await user.click(screen.getByRole("button", { name: /恢复这份备份/ }));
    expect(
      await screen.findByText(/已恢复学习记录：5 条记录/),
    ).toBeInTheDocument();
  });

  it("第 2 章从路线卷宗直接进入 CanvasStorm 产品链路关卡", async () => {
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
    await user.click(screen.getByRole("button", { name: /前往下一地点/ }));
    await user.click(screen.getByRole("button", { name: /翻开方向罗盘/ }));
    await user.click(screen.getByRole("button", { name: /筛候选不是全都要/ }));
    await user.click(screen.getByRole("button", { name: /前往下一地点/ }));
    await user.click(screen.getByRole("button", { name: /追踪保存路线/ }));
    await user.click(screen.getByRole("button", { name: /看懂备用仓库/ }));
    await user.click(screen.getByRole("button", { name: /前往下一地点/ }));
    await user.click(screen.getByRole("button", { name: /检查 AI 灯塔/ }));
    await user.click(screen.getByRole("button", { name: /AI 熄灯后怎么办/ }));
    await user.click(screen.getByRole("button", { name: /进入实战修复/ }));

    expect(
      await screen.findByRole("heading", { name: /项目地图/ }),
    ).toBeInTheDocument();
    expect(screen.getByText(/用户想法/)).toBeInTheDocument();
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

    await user.click(screen.getByRole("button", { name: /检查绿色灯牌/ }));
    expect(screen.getByText(/界面反馈/)).toBeInTheDocument();
    expect(screen.getByText(/前端页面 → 后端接口/)).toBeInTheDocument();
    expect(
      screen.getByText(/response.ok 不是“继续传东西”/),
    ).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /追踪发出的委托/ }));
    await user.click(screen.getByRole("button", { name: /前往下一地点/ }));

    expect(
      await screen.findByRole("heading", {
        name: /201 印章不是档案收据/,
      }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /查看传送门回执/ }));
    await user.click(screen.getByRole("button", { name: /审问守卫的证词/ }));
    await user.click(screen.getByRole("button", { name: /前往下一地点/ }));

    await user.click(
      await screen.findByRole("button", { name: /照亮空档案格/ }),
    );
    await user.click(screen.getByRole("button", { name: /比对读写路径/ }));
    await user.click(screen.getByRole("button", { name: /前往下一地点/ }));

    await user.click(
      await screen.findByRole("button", { name: /铸造 INSERT 符文/ }),
    );
    await user.click(screen.getByRole("button", { name: /封存验收仪式/ }));
    await user.click(screen.getByRole("button", { name: /进入实战修复/ }));

    await user.click(
      await screen.findByRole("button", { name: /进入实战练习/ }),
    );

    expect(
      await screen.findByText(/保存数据从哪里来，又在哪里断掉/),
    ).toBeInTheDocument();
    expect(screen.getByText(/阅读导览 · 第 2 棒/)).toBeInTheDocument();
    expect(screen.getByText(/这次只盯住/)).toBeInTheDocument();
    expect(document.body.textContent ?? "").toContain("201 不是数据库收据");
    expect(document.querySelector(".lab-rpg-shell")).toBeInTheDocument();
    expect(localStorage.getItem("codequest_detective")).toBeNull();
  });
});
