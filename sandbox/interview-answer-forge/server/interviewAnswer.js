export function reviewInterviewAnswer(answer) {
  if ((answer.opening ?? "").length > 80) {
    return {
      ready: true,
      code: "READY_FOR_INTERVIEW",
      reason: "回答足够长，可以用于面试。",
    };
  }

  return {
    ready: false,
    code: "TOO_SHORT",
    reason: "回答太短。",
  };
}

export function buildInterviewDossier(answer) {
  return {
    title: answer.title,
    finalAnswer: answer.opening,
    requestedRevisions: [],
  };
}
