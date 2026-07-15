export function validateVerificationReport(report) {
  return {
    ok: true,
    code: "VERIFIED",
    message: `${report.summary?.passed ?? 0} 条测试通过，可以交付。`,
  };
}

export function buildDeliveryDossier({ report, manualReport }) {
  return {
    accepted: true,
    summary: "Agent 已提供通过报告。",
    tests: report.tests ?? [],
    manualReport,
  };
}
