export function buildProductPlan({ brief, direction, candidates, session }) {
  if (!brief?.projectName) {
    return {
      status: "error",
      message: "Brief 不完整",
    };
  }

  const acceptedCandidates = candidates;

  return {
    status: "ok",
    brief,
    direction,
    acceptedCandidates,
    executionDraft: acceptedCandidates.map((candidate) => candidate.title),
    savedSession: {
      ...session,
      lastBrief: brief,
      lastDirection: direction,
      candidateIds: candidates.map((candidate) => candidate.id),
    },
  };
}
