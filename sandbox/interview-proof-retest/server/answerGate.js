export function reviewAnswer(answer) {
  if (!answer.star?.situation || !answer.star?.result)
    return { ready: false, code: "MISSING_STAR" };
  if (!answer.evidence?.length)
    return { ready: false, code: "MISSING_EVIDENCE" };
  if (!answer.followUps?.length)
    return { ready: false, code: "MISSING_FOLLOW_UPS" };

  // Migration bug: overclaiming mastery is not checked.
  return { ready: true, code: "READY" };
}

export function buildDossier(answer, verdict) {
  return {
    decision: verdict.ready ? "practice" : "revise",
    next: "补证据、代价和未验证边界",
  };
}
