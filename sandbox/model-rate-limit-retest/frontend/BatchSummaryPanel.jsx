import { useState } from "react";

export function BatchSummaryPanel({ conversations }) {
  const [message, setMessage] = useState("");

  async function createBatch() {
    setMessage("正在把会话交给摘要服务…");
    const response = await fetch("/api/support-summaries/batches", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ conversations }),
    });
    const result = await response.json();

    if (!response.ok) {
      const wait = result.retryAfterSeconds
        ? `，${result.retryAfterSeconds} 秒后可重试`
        : "";
      setMessage(`${result.message ?? "摘要服务暂时不可用"}${wait}`);
      return;
    }

    setMessage(`批次 ${result.batchId} 已进入处理队列`);
  }

  return (
    <section>
      <h2>夜班客服会话摘要</h2>
      <p>本批次包含 {conversations.length} 段会话。</p>
      <button type="button" onClick={createBatch}>
        生成交接摘要
      </button>
      <p role="status">{message}</p>
    </section>
  );
}
