import { useState } from "react";

export function GroundedAnswerPanel() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState(null);

  async function ask() {
    const response = await fetch("/api/ai/grounded-answer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question }),
    });
    const body = await response.json();
    setAnswer(body);
  }

  return (
    <section>
      <label>
        问镜厅校对师
        <textarea
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
        />
      </label>
      <button type="button" onClick={ask}>
        生成回答
      </button>
      {answer ? (
        <article>
          <h2>AI 回答</h2>
          <p>{answer.answer}</p>
          <small>置信度：{answer.confidence || "unknown"}</small>
        </article>
      ) : null}
    </section>
  );
}
