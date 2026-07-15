import { useState } from "react";

export function AssistantPanel() {
  const [answer, setAnswer] = useState("");

  async function ask(question) {
    const response = await fetch("/api/assistant/stream", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question }),
    });
    if (!response.ok) {
      setAnswer("模型暂时不可用，请稍后重试。");
      return;
    }
    setAnswer(await response.text());
  }

  return (
    <button onClick={() => ask("今天的客服重点是什么？")}>询问助手</button>
  );
}
