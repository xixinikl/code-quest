import { useState } from "react";

export function ProjectBriefForm({ onPlan }) {
  const [brief, setBrief] = useState({
    projectName: "CanvasStorm",
    userGoal: "帮助独立开发者把模糊 AI 点子拆成可执行产品路线",
    stage: "prototype",
    constraints: ["先做单人使用", "不做复杂协作"],
  });
  const [direction, setDirection] = useState("mvp");

  async function submit(event) {
    event.preventDefault();
    const response = await fetch("/api/storm/brief-plan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ brief, direction }),
    });
    const plan = await response.json();
    onPlan(plan);
  }

  return (
    <form onSubmit={submit}>
      <label>
        用户目标
        <textarea
          value={brief.userGoal}
          onChange={(event) =>
            setBrief({ ...brief, userGoal: event.target.value })
          }
        />
      </label>
      <label>
        本轮方向
        <select
          value={direction}
          onChange={(event) => setDirection(event.target.value)}
        >
          <option value="mvp">先做 MVP</option>
          <option value="growth">增长实验</option>
          <option value="ops">运营效率</option>
        </select>
      </label>
      <button type="submit">生成执行草案</button>
    </form>
  );
}
