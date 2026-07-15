import { useEffect, useState } from "react";

export function SupportSessionBanner() {
  const [status, setStatus] = useState("checking");

  useEffect(() => {
    fetch("/api/auth/refresh", {
      method: "POST",
      credentials: "include",
    }).then((response) => {
      setStatus(response.ok ? "ready" : "expired");
    });
  }, []);

  if (status === "checking") return <p>正在确认夜班身份...</p>;
  if (status === "expired") return <p>会话已失效，请重新登录</p>;
  return <p>夜班工作台已连接</p>;
}
