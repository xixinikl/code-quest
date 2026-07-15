export class ProviderRateLimitError extends Error {
  constructor(retryAfterSeconds) {
    super("Model provider rate limited the request");
    this.name = "ProviderRateLimitError";
    this.status = 429;
    this.code = "MODEL_RATE_LIMITED";
    this.retryAfterSeconds = retryAfterSeconds;
  }
}

export function createProviderClient({ mode = "healthy" } = {}) {
  return {
    async createSummaryBatch(conversations) {
      if (mode === "rate-limited") {
        throw new ProviderRateLimitError(30);
      }

      return {
        batchId: `summary-${conversations.length}-night`,
        accepted: conversations.length,
      };
    },
  };
}
