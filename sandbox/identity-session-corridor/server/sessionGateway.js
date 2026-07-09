const demoUser = {
  id: "user_apprentice",
  name: "见习开发者",
  email: "apprentice@canvasstorm.dev",
};

export function signIn({ email, password, browserStorage, serverSessions }) {
  if (!email || !password) {
    return {
      status: "error",
      message: "邮箱和密码不能为空",
    };
  }

  const sessionId = `session_${demoUser.id}`;

  browserStorage.memory.currentUser = demoUser;
  browserStorage.memory.accessToken = `token_for_${demoUser.id}`;
  serverSessions.pendingSessionId = sessionId;

  return {
    status: "ok",
    user: demoUser,
    accessToken: browserStorage.memory.accessToken,
  };
}

export function restoreCurrentUser({ browserStorage }) {
  const user = browserStorage.memory.currentUser;
  if (!user) {
    return {
      status: "anonymous",
      message: "刷新后内存状态消失，找不到当前用户",
    };
  }

  return {
    status: "ok",
    user,
  };
}

export function callProtectedApi({ path, browserStorage, serverSessions }) {
  if (path !== "/api/me") {
    return {
      status: "error",
      code: 404,
      message: "接口不存在",
    };
  }

  const token = browserStorage.memory.accessToken;
  const session = serverSessions.byToken?.[token];

  if (!token || !session) {
    return {
      status: "error",
      code: 401,
      message: "缺少有效登录凭证",
    };
  }

  return {
    status: "ok",
    user: session.user,
  };
}
