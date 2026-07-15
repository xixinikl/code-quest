import { useState } from "react";

export function SubmitPanel({ submit }) {
  const [status, setStatus] = useState("idle");

  async function handleSubmit() {
    // 事故现场：请求还没返回，界面就先宣布成功。
    setStatus("success");
    const response = await submit();
    if (response.ok) return;
  }

  return (
    <section>
      <button onClick={handleSubmit}>提交申请</button>
      {status === "success" && <p>申请已提交</p>}
    </section>
  );
}
