import { useState } from "react";

export function AnswerPanel({ question }) {
  const [answer, setAnswer] = useState(null);

  async function submit() {
    const response = await fetch("/api/support/answer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question }),
    });
    setAnswer(await response.json());
  }

  return <button onClick={submit}>{answer?.text ?? "获取回答"}</button>;
}
