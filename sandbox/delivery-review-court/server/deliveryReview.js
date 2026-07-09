export function reviewDelivery(delivery) {
  if (delivery.summary && delivery.tests?.summary?.failed === 0) {
    return {
      accepted: true,
      code: "ACCEPTED",
      reason: "Agent 提供了说明，并且测试通过。",
    };
  }

  return {
    accepted: false,
    code: "NEEDS_WORK",
    reason: "测试没有通过。",
  };
}

export function buildReviewDecision(delivery) {
  return {
    decision: "accept",
    summary: delivery.summary,
    requestedEvidence: [],
  };
}
