const javaScenarioIds = new Set([
  "java-layered-request",
  "java-transaction-consistency",
  "java-cache-observability",
  "java-release-harbor",
  "java-production-incident",
]);

const frontendScenarioIds = new Set([
  "frontend-component-state",
  "frontend-request-states",
  "frontend-performance-proof",
  "frontend-accessibility-proof",
  "frontend-testing-proof",
]);

export function getScenarioRouteIdentity(scenarioId: string) {
  if (javaScenarioIds.has(scenarioId)) {
    return { label: "Java 后端", kind: "岗位路线" };
  }
  if (frontendScenarioIds.has(scenarioId)) {
    return { label: "前端工程", kind: "岗位路线" };
  }
  return { label: "AI 应用开发", kind: "主线" };
}

export function getChapterRouteIdentity(chapterId: string) {
  if (chapterId.startsWith("java-")) {
    return { label: "Java 后端", kind: "岗位路线" };
  }
  if (chapterId.startsWith("frontend-")) {
    return { label: "前端工程", kind: "岗位路线" };
  }
  return { label: "AI 应用开发", kind: "主线" };
}
