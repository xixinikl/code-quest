export function reviewRelease(release) {
  if (!release.plan?.owner || !release.plan?.observer)
    return { ready: false, code: "MISSING_OWNER" };
  if (release.environment?.AI_API_KEY?.safeToShow !== false)
    return { ready: false, code: "UNSAFE_ENV" };
  if (!release.smoke?.mobile390)
    return { ready: false, code: "MISSING_MOBILE_SMOKE" };
  if (!release.monitoring?.aiFailureRate)
    return { ready: false, code: "MISSING_MONITORING" };

  // Migration bug: backup existence is checked, but restore proof is ignored.
  return { ready: true, code: "READY" };
}

export function buildReleaseDecision(release, verdict) {
  return {
    decision: verdict.ready ? "release" : "hold",
    code: verdict.code,
    next: "补齐恢复演练和回滚后的验证",
  };
}
