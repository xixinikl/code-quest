import { useEffect, useState } from "react";
import {
  callProtectedApi,
  restoreCurrentUser,
  signIn,
} from "../server/sessionGateway.js";

export function LoginGate({ browserStorage, serverSessions }) {
  const [status, setStatus] = useState("checking");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const restored = restoreCurrentUser({ browserStorage, serverSessions });
    if (restored.status === "ok") {
      setUser(restored.user);
      setStatus("signed-in");
    } else {
      setStatus("guest");
    }
  }, [browserStorage, serverSessions]);

  async function handleLogin() {
    const result = signIn({
      email: "apprentice@canvasstorm.dev",
      password: "demo-password",
      browserStorage,
      serverSessions,
    });

    if (result.status === "ok") {
      setUser(result.user);
      setStatus("signed-in");
    }
  }

  async function checkProfile() {
    const result = callProtectedApi({
      path: "/api/me",
      browserStorage,
      serverSessions,
    });

    setStatus(result.status === "ok" ? "signed-in" : "lost");
  }

  return (
    <section>
      <p>身份回廊：刷新后还能认出你吗？</p>
      <button onClick={handleLogin}>登录</button>
      <button onClick={checkProfile}>检查 /api/me</button>
      <output>
        {status}
        {user ? ` · ${user.name}` : ""}
      </output>
    </section>
  );
}
