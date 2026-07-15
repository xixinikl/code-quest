export function createMemoryCache() {
  const values = new Map();
  return {
    get(key) {
      return values.get(key);
    },
    set(key, value) {
      values.set(key, value);
    },
  };
}

export function createBriefingModel() {
  return {
    calls: 0,
    generate({ teamId, date }) {
      this.calls += 1;
      return {
        title: `${date} · ${teamId} 晨报`,
        items: Array.from({ length: 24 }, (_, index) => ({
          id: `incident-${index + 1}`,
          summary: `需要关注的客服事件 ${index + 1}`,
        })),
      };
    },
  };
}

export function getMorningBriefing({ cache, model, teamId, date, requestId }) {
  // requestId 每次请求都会变化，因此这个键永远无法复用同一份业务晨报。
  const cacheKey = `morning-briefing:${teamId}:${date}:${requestId}`;
  const cached = cache.get(cacheKey);

  if (cached) {
    return {
      status: 200,
      headers: {
        "Server-Timing": "cache;dur=2, total;dur=4",
        "X-Cache": "HIT",
      },
      body: cached,
    };
  }

  const body = {
    ...model.generate({ teamId, date }),
    renderPlan: { itemCount: 24, virtualized: true },
  };
  cache.set(cacheKey, body);

  return {
    status: 200,
    headers: {
      "Server-Timing": "data;dur=82, model;dur=3210, total;dur=3292",
      "X-Cache": "MISS",
    },
    body,
  };
}
