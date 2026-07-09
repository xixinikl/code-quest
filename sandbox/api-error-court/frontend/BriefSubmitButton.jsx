import { useState } from "react";
import { handleBriefRequest } from "../server/briefRoutes.js";

export function BriefSubmitButton({ draft }) {
  const [message, setMessage] = useState("");

  async function submit() {
    const request = {
      method: "POST",
      path: "/api/briefs",
      requestId: "req_brief_042",
      body: draft,
    };
    const response = handleBriefRequest(request);

    if (response.status >= 400) {
      setMessage("提交失败，请稍后再试");
      return;
    }

    setMessage(`已保存：${response.body.brief.projectName}`);
  }

  return (
    <section>
      <p>接口审判庭：这次失败到底是谁的证词不完整？</p>
      <button onClick={submit}>提交 Project Brief</button>
      <output>{message}</output>
    </section>
  );
}
