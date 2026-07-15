export function saveDraft({ request, database }) {
  if (request.method !== "POST" || request.path !== "/api/drafts") {
    return {
      status: 404,
      body: { error: "NOT_FOUND", message: "接口不存在" },
    };
  }

  if (!request.body?.title) {
    return {
      status: 400,
      body: { error: "VALIDATION_ERROR", message: "标题不能为空" },
    };
  }

  const draft = {
    id: `draft_${database.drafts.length + 1}`,
    userId: request.body.userId,
    clientMutationId: request.body.clientMutationId,
    title: request.body.title,
    idempotencyKey: request.headers?.["Idempotency-Key"],
  };

  database.drafts.push(draft);

  if (request.body.simulateAuditFailure) {
    return {
      status: 500,
      body: {
        error: "AUDIT_WRITE_FAILED",
        message: "保存审计日志失败",
      },
      log: `[draft] requestId=${request.requestId} inserted=${draft.id} audit=failed`,
    };
  }

  database.auditLog.push({
    event: "draft.created",
    draftId: draft.id,
    requestId: request.requestId,
  });

  return {
    status: 201,
    body: {
      requestId: request.requestId,
      draft,
      created: true,
    },
    log: `[draft] requestId=${request.requestId} inserted=${draft.id}`,
  };
}
