export function validateVerificationReport(report, currentSourceHash) {
  const tests = report.tests ?? [];
  const hasReproduction = tests.some(
    (test) => test.phase === "reproduction" && test.status === "failed",
  );
  const hasUnit = tests.some(
    (test) => test.phase === "unit" && test.status === "passed",
  );
  const hasIntegration = tests.some(
    (test) => test.phase === "integration" && test.status === "passed",
  );
  const hasManual = Boolean(report.manual?.steps && report.manual.actual);

  if (report.sourceHash !== currentSourceHash) {
    return {
      ok: false,
      code: "STALE_REPORT",
      message: "报告 sourceHash 与当前代码不一致，不能用旧绿灯冒充新交付。",
    };
  }

  if (!hasReproduction) {
    return {
      ok: false,
      code: "MISSING_REPRODUCTION",
      message: "缺少旧问题失败复现，不能证明测试抓住了原来的故障。",
    };
  }

  if (!hasUnit || !hasIntegration || !hasManual) {
    return {
      ok: false,
      code: "INCOMPLETE_EVIDENCE",
      message: "验收证据必须同时包含单测、集成测试和手动复测。",
    };
  }

  return {
    ok: true,
    code: "VERIFIED",
    message: "复现、单测、集成、手动复测和当前源码指纹都已对齐。",
  };
}

export function buildDeliveryDossier({ report, manualReport, risks = [] }) {
  return {
    accepted: risks.length === 0,
    summary: "验收证据包含复现、单测、集成测试和手动复测。",
    tests: report.tests ?? [],
    manualReport,
    regressionRisks: risks,
    interviewLine:
      "我不是只看通过截图，而是先复现旧问题，再用自动化和手动路径证明修复对应当前代码。",
  };
}
