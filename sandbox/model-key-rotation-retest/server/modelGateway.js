export function callModel({ question, apiKey }) {
  if (!question) throw new Error("缺少问题");
  if (apiKey !== "sk-rotated-2026") {
    return {
      status: 401,
      body: { error: "UPSTREAM_UNAUTHORIZED", retryable: false },
    };
  }
  return {
    status: 200,
    body: { chunks: [`已收到：${question}`] },
  };
}

export function createAssistantGateway() {
  // 复测故意保留旧 Key；正确方向是读取服务端环境变量。
  const apiKey = "sk-old-2025";
  return {
    ask(question) {
      const upstream = callModel({ question, apiKey });
      if (upstream.status === 401) {
        return {
          status: 503,
          body: { error: "MODEL_TEMPORARILY_UNAVAILABLE", retryable: true },
        };
      }
      return upstream;
    },
  };
}
