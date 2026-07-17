import { useMemo } from "react";

export function VerificationReportPanel({ report, manualReport }) {
  const passed = report?.summary?.passed ?? 0;
  const failed = report?.summary?.failed ?? 0;

  const verdict = useMemo(() => {
    if (failed === 0) return "可以交付";
    return "还有风险";
  }, [failed]);

  return (
    <section className="verification-panel">
      <p className="eyebrow">前端回归证据庭</p>
      <h2>Agent 说修好了，证据真的够吗？</h2>
      <div className="verification-score">
        <strong>{verdict}</strong>
        <span>
          自动测试 {passed} 通过 / {failed} 失败
        </span>
      </div>
      <pre>{manualReport}</pre>
    </section>
  );
}
