import { useState } from "react";
import { saveDraft } from "../server/draftRepository.js";

export function SaveDraftButton({ database }) {
  const [message, setMessage] = useState("");

  async function saveTwice() {
    const request = {
      method: "POST",
      path: "/api/drafts",
      requestId: "req_draft_001",
      headers: {
        "Idempotency-Key": "draft-save-abc",
      },
      body: {
        userId: "user_apprentice",
        clientMutationId: "mutation_2026_0705_001",
        title: "AI 面试复盘草稿",
      },
    };

    const first = saveDraft({ request, database });
    const second = saveDraft({
      request: { ...request, requestId: "req_draft_002" },
      database,
    });

    setMessage(`第一次 ${first.status}，第二次 ${second.status}`);
  }

  return (
    <section>
      <p>一致性熔炉：同一个动作会不会烧出两份草稿？</p>
      <button onClick={saveTwice}>模拟重复点击保存</button>
      <output>{message}</output>
    </section>
  );
}
