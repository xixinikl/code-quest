export function reviewReleaseReadiness(release) {
  if (release.build?.status === "passed" && release.smokeTest?.passed) {
    return {
      ready: true,
      code: "READY_TO_RELEASE",
      reason: "构建和冒烟测试通过，可以上线。",
    };
  }

  return {
    ready: false,
    code: "BUILD_OR_SMOKE_FAILED",
    reason: "构建或冒烟测试没有通过。",
  };
}

export function buildReleaseDecision(release) {
  return {
    decision: "release",
    title: release.name,
    requestedEvidence: [],
  };
}
