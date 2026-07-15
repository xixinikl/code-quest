import { useState } from "react";

export function ProfilePanel({ loadProfile }) {
  const [status, setStatus] = useState("idle");
  const [profile, setProfile] = useState(null);

  async function load() {
    // 事故现场：界面先宣布成功，真正的请求结果还没有回来。
    setStatus("success");
    const response = await loadProfile();
    if (response.ok) setProfile(response.data);
  }

  return (
    <section>
      <button onClick={load}>加载资料</button>
      {status === "success" && <p>资料已加载</p>}
      {profile && <strong>{profile.displayName}</strong>}
    </section>
  );
}
