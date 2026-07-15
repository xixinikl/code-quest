// App uses descriptive scenario ids; older teaching records used case aliases.
// Keep this compatibility boundary in one place so old progress remains readable.
const legacyScenarioIds: Record<string, string> = {
  "canvasstorm-product-brief": "case-002",
  "identity-session-corridor": "case-003-login-state",
  "api-error-court": "case-004-api-error",
  "data-consistency-forge": "case-005-data-consistency",
  "performance-fog-lab": "case-006-performance",
  "ai-api-key-vault": "case-007-ai-api",
  "hallucination-mirror-hall": "case-008-hallucination",
  "rag-knowledge-maze": "case-009-rag",
  "agent-tool-tower": "case-010-agent-tools",
  "verification-trial-arena": "case-011-testing-proof",
  "agent-brief-forge": "case-012-agent-brief",
  "delivery-review-court": "case-013-delivery-review",
  "release-readiness-gate": "case-014-release-readiness",
  "interview-answer-forge": "case-015-interview-review",
};

export function normalizeScenarioId(scenarioId: string) {
  return legacyScenarioIds[scenarioId] ?? scenarioId;
}

export const canonicalScenarioIds = Object.keys(legacyScenarioIds);
