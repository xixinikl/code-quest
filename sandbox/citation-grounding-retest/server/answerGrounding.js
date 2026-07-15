const allowedSources = new Set(["refund-policy-2026#3.2"]);

export function validateCitation(citation) {
  return allowedSources.has(citation);
}

export function answer(question, context = []) {
  if (!question) throw new Error("缺少问题");
  // 复测故意漏掉上下文边界，产生一条看似完整的回答。
  return {
    text: "根据退款条款 9.4，超过 30 天仍可自动退款。",
    citations: ["refund-policy-2026#9.4"],
    usedContext: context.length,
  };
}
