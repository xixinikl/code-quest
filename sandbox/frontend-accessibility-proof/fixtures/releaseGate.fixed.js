const REQUIRED_ENV = ["DATABASE_URL", "AI_API_KEY", "APP_ORIGIN"];
const REQUIRED_MONITORING = [
  "errorRate",
  "p95LatencyMs",
  "saveSuccessRate",
  "aiFailureRate",
];

export function reviewReleaseReadiness(release) {
  if (!release.plan?.owner || !release.plan?.observer) {
    return { ready: false, code: "MISSING_RELEASE_OWNER" };
  }

  const missingEnv = REQUIRED_ENV.find(
    (name) => release.environment?.[name]?.status !== "present",
  );
  if (missingEnv) {
    return { ready: false, code: "MISSING_ENV_VAR" };
  }

  if (release.environment?.frontendBundleContainsSecret) {
    return { ready: false, code: "SECRET_EXPOSED_IN_FRONTEND" };
  }

  if (release.dataChange?.requiresBackup && !release.backup?.restoreTested) {
    return { ready: false, code: "UNVERIFIED_BACKUP_RESTORE" };
  }

  if (
    !release.smokeTest?.paths?.some(
      (path) => path.viewport === "390px" && path.result === "passed",
    )
  ) {
    return { ready: false, code: "MISSING_MOBILE_SMOKE" };
  }

  const missingSignal = REQUIRED_MONITORING.find(
    (signal) => release.monitoring?.[signal] === undefined,
  );
  if (missingSignal) {
    return { ready: false, code: "MISSING_MONITORING_SIGNAL" };
  }

  if (!release.rollback?.trigger || !release.rollback?.verifyAfterRollback) {
    return { ready: false, code: "MISSING_ROLLBACK_PLAN" };
  }

  return { ready: true, code: "READY_TO_RELEASE" };
}

export function buildReleaseDecision(release, verdict) {
  const requestedEvidence = [];
  if (verdict.code === "MISSING_RELEASE_OWNER") {
    requestedEvidence.push("补发布负责人、观察人和影响范围确认。");
  }
  if (verdict.code === "MISSING_ENV_VAR") {
    requestedEvidence.push("补生产环境变量、密钥和功能开关检查。");
  }
  if (verdict.code === "UNVERIFIED_BACKUP_RESTORE") {
    requestedEvidence.push("补数据备份位置和恢复验证。");
  }
  if (verdict.code === "MISSING_MOBILE_SMOKE") {
    requestedEvidence.push("补 390px 移动端冒烟测试路径。");
  }
  if (verdict.code === "MISSING_MONITORING_SIGNAL") {
    requestedEvidence.push("补错误率、耗时、保存成功率和 AI 失败率监控。");
  }
  if (verdict.code === "MISSING_ROLLBACK_PLAN") {
    requestedEvidence.push("补回滚触发条件、步骤和回滚后验证。");
  }

  return {
    decision: verdict.ready ? "release" : "hold",
    title: release.name,
    requestedEvidence,
    interviewLine:
      "我不会把构建成功当成可上线；我会核环境变量、备份、冒烟测试、监控和回滚证据，再决定放行或暂缓。",
  };
}
