import { useState } from "react";

export function RagAnswerPanel() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState(null);

  async function ask() {
    const response = await fetch("/api/rag/answer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question }),
    });
    setAnswer(await response.json());
  }

  return (
    <section>
      <label>
        问知识迷宫
        <textarea
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
        />
      </label>
      <button type="button" onClick={ask}>
        检索资料并回答
      </button>
      {answer ? (
        <article>
          <h2>AI 回答</h2>
          <p>{answer.answer}</p>
          <small>引用：{answer.citations?.join(", ") || "无"}</small>
        </article>
      ) : null}
    </section>
  );
}
