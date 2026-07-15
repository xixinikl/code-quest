import { useMemo } from "react";

export function ReleaseGatePanel({ release, decision }) {
  const status = decision?.ready ? "可以放行" : "暂缓上线";
  const missing = useMemo(() => decision?.requestedEvidence ?? [], [decision]);

  return (
    <section className="release-gate-panel">
      <p className="eyebrow">上线城门</p>
      <h2>上线不是点部署，是逐项过门</h2>
      <p>
        {release.name} 需要同时通过计划、配置、数据、冒烟、监控和回滚六道门。
      </p>
      <strong>{status}</strong>
      <ul>
        {missing.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}
