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
