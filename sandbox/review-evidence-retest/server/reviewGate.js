export function reviewDelivery(delivery) {
  if (!delivery.diff?.files?.length)
    return { accepted: false, code: "MISSING_DIFF" };
  if (!delivery.browserChecks?.desktop)
    return { accepted: false, code: "MISSING_BROWSER" };

  // Migration bug: the reviewer never compares the test report to the current source.
  return { accepted: true, code: "READY_TO_MERGE" };
}

export function buildDecision(delivery, verdict) {
  return {
    decision: verdict.accepted ? "accept" : "request_changes",
    reasons: verdict.accepted ? [] : [verdict.code],
    next: "补齐当前版本测试、390px 浏览器和文档同步证据",
    interviewLine:
      "我审查了 Diff 范围、测试版本、移动端路径和文档，而不是只看绿色 CI。",
  };
}
