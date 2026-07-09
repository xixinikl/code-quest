export function handleBriefRequest(request) {
  if (request.method !== "POST" || request.path !== "/api/briefs") {
    return {
      status: 404,
      body: {
        error: "NOT_FOUND",
        message: "接口不存在",
      },
    };
  }

  try {
    const brief = createBrief(request.body);
    return {
      status: 201,
      body: {
        requestId: request.requestId,
        brief,
      },
    };
  } catch (error) {
    return {
      status: 500,
      body: {
        error: "INTERNAL_ERROR",
        message: "服务器开小差了，请稍后再试",
      },
      log: `[brief] requestId=${request.requestId} level=error message=${error.message}`,
    };
  }
}

function createBrief(body) {
  if (!body.projectName) {
    throw new Error("projectName is required");
  }
  if (!body.userGoal) {
    throw new Error("userGoal is required");
  }

  return {
    id: `brief_${body.projectName.toLowerCase()}`,
    projectName: body.projectName,
    userGoal: body.userGoal,
    status: "draft",
  };
}
