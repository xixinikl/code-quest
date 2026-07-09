export function createFakeProvider({ mode = "success" } = {}) {
  return {
    calls: [],
    complete({ apiKey, prompt, stream }) {
      this.calls.push({ apiKey, prompt, stream });
      if (mode === "failure") {
        return {
          ok: false,
          status: 429,
          body: {
            error: "rate_limit_exceeded",
            message: "Provider quota exceeded",
          },
        };
      }

      return {
        ok: true,
        status: 200,
        body: {
          text: `AI 完整回复：${prompt}`,
        },
      };
    },
  };
}

export function handleAiChat({ request, env, provider }) {
  if (request.method !== "POST" || request.path !== "/api/ai/chat") {
    return {
      status: 404,
      headers: { "Content-Type": "application/json" },
      body: { error: "NOT_FOUND", message: "接口不存在" },
    };
  }

  const apiKey = request.body?.apiKey || env.AI_API_KEY;

  if (!apiKey) {
    return {
      status: 200,
      headers: { "Content-Type": "application/json" },
      body: {
        message: "请在前端填写 AI API Key",
      },
      log: `[ai] requestId=${request.requestId} missing-key`,
    };
  }

  const upstream = provider.complete({
    apiKey,
    prompt: request.body?.prompt || "",
    stream: false,
  });

  if (!upstream.ok) {
    return {
      status: 200,
      headers: { "Content-Type": "application/json" },
      body: {
        message: "AI 调用失败",
        debug: {
          apiKey,
          providerStatus: upstream.status,
          providerBody: upstream.body,
        },
      },
      log:
        `[ai] requestId=${request.requestId} provider=${upstream.status} ` +
        `apiKey=${apiKey}`,
    };
  }

  return {
    status: 200,
    headers: { "Content-Type": "application/json" },
    body: {
      text: upstream.body.text,
      stream: false,
    },
    log: `[ai] requestId=${request.requestId} stream=false`,
  };
}
