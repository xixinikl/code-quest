export function validateVerificationReport(report) {
  if ((report.summary?.failed ?? 0) > 0) {
    return { ok: false, code: "HAS_FAILURES" };
  }

  // The migration bug: a green report is accepted without checking its source hash.
  return { ok: true, code: "VERIFIED" };
}

export function buildDeliveryDossier({ report, manualReport, risks }) {
  return {
    accepted: risks.length === 0,
    reportSummary: report.summary,
    manualReport,
    risks,
    interviewLine: "先复现旧问题，再用自动化、手动路径和源码版本共同验收。",
  };
}
