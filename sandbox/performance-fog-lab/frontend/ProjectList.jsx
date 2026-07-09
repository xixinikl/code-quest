import { useEffect, useState } from "react";

export function ProjectList() {
  const [status, setStatus] = useState("idle");
  const [projects, setProjects] = useState([]);
  const [timing, setTiming] = useState(null);

  useEffect(() => {
    let alive = true;
    async function load() {
      const startedAt = performance.now();
      setStatus("loading");
      const response = await fetch("/api/projects?includeStats=true");
      const body = await response.json();
      const totalMs = Math.round(performance.now() - startedAt);

      if (!alive) return;
      setProjects(body.projects);
      setTiming({
        totalMs,
        serverTiming: response.headers.get("Server-Timing"),
        cache: response.headers.get("X-Cache"),
      });
      setStatus("ready");
    }

    load().catch(() => {
      if (alive) setStatus("error");
    });

    return () => {
      alive = false;
    };
  }, []);

  if (status === "loading") return <p>正在穿过慢速迷雾...</p>;
  if (status === "error") return <p>项目列表加载失败，请查看 Network。</p>;

  return (
    <section>
      <p>
        接口耗时：{timing?.totalMs ?? "-"}ms · 服务端计时：
        {timing?.serverTiming ?? "缺失"} · 缓存：{timing?.cache ?? "缺失"}
      </p>
      <ul>
        {projects.map((project) => (
          <li key={project.id}>
            <strong>{project.name}</strong>
            <span>{project.owner}</span>
            <span>{project.openIssueCount} 个待处理问题</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
