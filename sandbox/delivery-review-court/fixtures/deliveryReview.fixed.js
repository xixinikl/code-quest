const REQUIRED_DELIVERY_SECTIONS = ["摘要", "验证证据", "风险", "后续"];
const REQUIRED_DOCS = [
  "README.md",
  "HANDOFF.md",
  "docs/ai-career-rpg-tasks.md",
];

export function reviewDelivery(delivery, currentSourceHash) {
  const missingSection = REQUIRED_DELIVERY_SECTIONS.find(
    (section) => !delivery.sections?.includes(section),
  );
  if (missingSection) {
    return { accepted: false, code: "MISSING_DELIVERY_SECTION" };
  }

  const outOfScopeFile = delivery.diff?.files?.find(
    (file) =>
      !delivery.allowedPaths?.some((prefix) => file.path.startsWith(prefix)),
  );
  if (outOfScopeFile) {
    return { accepted: false, code: "OUT_OF_SCOPE_DIFF" };
  }

  if (delivery.tests?.sourceHash !== currentSourceHash) {
    return { accepted: false, code: "STALE_TEST_EVIDENCE" };
  }

  if (!delivery.browserChecks?.some((check) => check.viewport === "390px")) {
    return { accepted: false, code: "MISSING_MOBILE_CHECK" };
  }

  const missingDoc = REQUIRED_DOCS.find(
    (doc) => !delivery.docsUpdated?.includes(doc),
  );
  if (missingDoc) {
    return { accepted: false, code: "MISSING_DOC_SYNC" };
  }

  return { accepted: true, code: "ACCEPTED" };
}

export function buildReviewDecision(delivery, verdict) {
  const requestedEvidence = [];
  if (verdict.code === "OUT_OF_SCOPE_DIFF") {
    requestedEvidence.push("解释为什么修改范围外文件，或回退这些改动。");
  }
  if (verdict.code === "STALE_TEST_EVIDENCE") {
    requestedEvidence.push("重新运行测试，提交与当前源码 hash 匹配的报告。");
  }
  if (verdict.code === "MISSING_MOBILE_CHECK") {
    requestedEvidence.push("补 390px 移动端浏览器路径验收。");
  }
  if (verdict.code === "MISSING_DOC_SYNC") {
    requestedEvidence.push("同步 README、HANDOFF 和任务清单。");
  }

  return {
    decision: verdict.accepted ? "accept" : "request_changes",
    summary: delivery.summary,
    requestedEvidence,
    interviewLine:
      "我审查 Agent 交付时不只看说明，还会核 Diff、测试证据、移动端路径、文档同步和拒收理由。",
  };
}
