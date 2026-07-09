import { useState } from "react";

export function AgentToolConsole() {
  const [result, setResult] = useState(null);

  async function runTool() {
    const response = await fetch("/api/agent/tools/run", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        toolName: "updateProjectStatus",
        args: { projectId: "project_1", status: "shipped" },
      }),
    });
    setResult(await response.json());
  }

  return (
    <section>
      <button type="button" onClick={runTool}>
        让 Agent 执行工具
      </button>
      {result ? (
        <article>
          <h2>工具结果</h2>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </article>
      ) : null}
    </section>
  );
}
