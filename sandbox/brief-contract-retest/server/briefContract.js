export function validateBrief(brief) {
  if (!brief.context || !brief.goal)
    return { ok: false, code: "MISSING_CONTEXT" };
  if (!brief.constraints?.allowed || !brief.acceptance?.expectedResult) {
    return { ok: false, code: "MISSING_BOUNDARY" };
  }

  // Migration bug: a task can pass without a rollback plan.
  return { ok: true, code: "READY" };
}

export function buildAgentPrompt(brief) {
  return [
    brief.context,
    brief.goal,
    brief.constraints.allowed,
    brief.acceptance.expectedResult,
  ].join("\n");
}
