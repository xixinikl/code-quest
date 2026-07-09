const REQUIRED_STAR = ["situation", "task", "action", "result"];
const REQUIRED_INCIDENT = [
  "phenomenon",
  "evidence",
  "rootCause",
  "fix",
  "verification",
];
const REQUIRED_TRADEOFF = ["options", "choice", "cost", "verification"];
const REQUIRED_FOLLOW_UPS = 3;

export function reviewInterviewAnswer(answer) {
  const missingStar = REQUIRED_STAR.find((field) => !answer.star?.[field]);
  if (missingStar) {
    return { ready: false, code: "MISSING_STAR_SECTION" };
  }

  if (!answer.storyBank?.some((item) => item.evidence?.length >= 2)) {
    return { ready: false, code: "MISSING_PROJECT_EVIDENCE" };
  }

  const missingIncident = REQUIRED_INCIDENT.find(
    (field) => !answer.incidentReview?.[field],
  );
  if (missingIncident) {
    return { ready: false, code: "INCOMPLETE_INCIDENT_REVIEW" };
  }

  const missingTradeoff = REQUIRED_TRADEOFF.find(
    (field) => !answer.tradeoff?.[field],
  );
  if (missingTradeoff) {
    return { ready: false, code: "MISSING_TRADEOFF" };
  }

  if ((answer.followUps ?? []).length < REQUIRED_FOLLOW_UPS) {
    return { ready: false, code: "MISSING_FOLLOW_UPS" };
  }

  if (/已经完全掌握|保证不会出错|精通所有/.test(answer.opening ?? "")) {
    return { ready: false, code: "OVERCLAIMED_LEARNING_RESULT" };
  }

  return { ready: true, code: "READY_FOR_INTERVIEW" };
}

export function buildInterviewDossier(answer, verdict) {
  const requestedRevisions = [];
  if (verdict.code === "MISSING_STAR_SECTION") {
    requestedRevisions.push("补 STAR 的背景、任务、行动和结果。");
  }
  if (verdict.code === "MISSING_PROJECT_EVIDENCE") {
    requestedRevisions.push("补 Network、日志、数据库、测试或截图等项目证据。");
  }
  if (verdict.code === "INCOMPLETE_INCIDENT_REVIEW") {
    requestedRevisions.push("补现象、证据、根因、修复和验证闭环。");
  }
  if (verdict.code === "MISSING_TRADEOFF") {
    requestedRevisions.push("补方案选择、代价、边界和验证方式。");
  }
  if (verdict.code === "MISSING_FOLLOW_UPS") {
    requestedRevisions.push("至少准备 3 个面试追问和证据答案。");
  }
  if (verdict.code === "OVERCLAIMED_LEARNING_RESULT") {
    requestedRevisions.push("删除夸大掌握表述，改成工程证据和待真人验证边界。");
  }

  return {
    title: answer.title,
    decision: verdict.ready ? "ready" : "revise",
    finalAnswer: answer.opening,
    requestedRevisions,
    interviewLine:
      "我会把项目经历整理成 STAR、故障复盘、技术取舍和追问答案，并用证据说明结果和边界。",
  };
}
