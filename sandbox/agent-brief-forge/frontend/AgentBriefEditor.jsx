import { useState } from "react";

export function AgentBriefEditor({ initialBrief, onSubmit }) {
  const [brief, setBrief] = useState(initialBrief);

  function updateField(field, value) {
    setBrief((current) => ({ ...current, [field]: value }));
  }

  return (
    <section className="agent-brief-editor">
      <p className="eyebrow">委托书工坊</p>
      <h2>把“帮我改一下”锻造成 Agent 能执行的任务</h2>
      <label>
        背景和证据
        <textarea
          value={brief.context}
          onChange={(event) => updateField("context", event.target.value)}
        />
      </label>
      <label>
        目标
        <textarea
          value={brief.goal}
          onChange={(event) => updateField("goal", event.target.value)}
        />
      </label>
      <label>
        约束和禁止事项
        <textarea
          value={brief.constraints}
          onChange={(event) => updateField("constraints", event.target.value)}
        />
      </label>
      <button type="button" onClick={() => onSubmit(brief)}>
        交给 Agent
      </button>
    </section>
  );
}
