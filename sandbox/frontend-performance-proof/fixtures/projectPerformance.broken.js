export function createProjectDatabase(size = 2500) {
  return {
    queryCount: 0,
    queryProjectsWithStats() {
      this.queryCount += 1;
      return Array.from({ length: size }, (_, index) => ({
        id: `project_${index + 1}`,
        name: `CanvasStorm 训练项目 ${index + 1}`,
        owner: index % 2 === 0 ? "AI 应用学徒" : "产品副官",
        openIssueCount: (index * 7) % 19,
        updatedAt: `2026-07-${String((index % 28) + 1).padStart(2, "0")}`,
      }));
    },
  };
}

export function createMemoryCache() {
  return {
    reads: 0,
    writes: 0,
    value: undefined,
    get() {
      this.reads += 1;
      return undefined;
    },
    set(_key, value) {
      this.writes += 1;
      this.value = value;
    },
  };
}

export function getProjectDashboard({ database, cache, requestId }) {
  const cacheKey = "projects:list:with-stats";
  const cached = cache.get(cacheKey);
  if (cached) {
    return {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "X-Cache": "HIT",
      },
      body: cached,
      log: `[performance] requestId=${requestId} cache=hit`,
    };
  }

  const projects = database.queryProjectsWithStats();
  const responseBody = {
    projects,
    renderPlan: {
      mode: "full-list",
      virtualized: false,
      itemCount: projects.length,
    },
  };

  cache.set(cacheKey, responseBody);

  return {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "X-Cache": "MISS",
    },
    body: responseBody,
    log:
      `[performance] requestId=${requestId} cache=miss ` +
      `dbRows=${projects.length}`,
  };
}
