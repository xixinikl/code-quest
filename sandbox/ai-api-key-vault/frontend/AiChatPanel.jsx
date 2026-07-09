import { useState } from "react";

const demoApiKey = "sk-demo-leaked-key-in-browser";

export function AiChatPanel() {
  const [prompt, setPrompt] = useState("");
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState("");

  async function sendMessage() {
    setError("");
    setAnswer("");

    const response = await fetch("https://api.example.ai/v1/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${demoApiKey}`,
      },
      body: JSON.stringify({
        apiKey: demoApiKey,
        prompt,
        stream: false,
      }),
    });

    const body = await response.json();
    if (!response.ok) {
      setError(body.message || "AI 暂时不可用");
      return;
    }

    setAnswer(body.text);
  }

  return (
    <section>
      <textarea
        aria-label="给 AI 的任务"
        value={prompt}
        onChange={(event) => setPrompt(event.target.value)}
      />
      <button type="button" onClick={sendMessage}>
        点燃模型熔炉
      </button>
      {answer ? <p>{answer}</p> : null}
      {error ? <p role="alert">{error}</p> : null}
    </section>
  );
}
