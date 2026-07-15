export function createSummaryBatchHandler({ provider, logger }) {
  return async function handleSummaryBatch(request) {
    const requestId = request.requestId;
    const conversations = request.body?.conversations;

    if (!Array.isArray(conversations) || conversations.length === 0) {
      return {
        status: 400,
        body: {
          code: "CONVERSATIONS_REQUIRED",
          message: "至少提交一段客服会话",
          requestId,
        },
      };
    }

    try {
      const batch = await provider.createSummaryBatch(conversations);
      return {
        status: 202,
        body: { ...batch, requestId },
      };
    } catch (error) {
      logger.error({
        requestId,
        event: "summary_batch_failed",
        upstreamStatus: error.status,
        upstreamCode: error.code,
      });

      return {
        status: 500,
        body: {
          code: "INTERNAL_ERROR",
          message: "系统错误",
        },
      };
    }
  };
}
