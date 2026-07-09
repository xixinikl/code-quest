const REQUIRED_DELIVERY_FIELDS = ["摘要", "验证证据", "风险", "后续"];

export function validateAgentBrief(brief) {
  if (!brief.context?.includes("现象") || !brief.context?.includes("证据")) {
    return { ok: false, code: "MISSING_CONTEXT" };
  }

  if (!/看到|返回|通过|生成|保存/.test(brief.goal ?? "")) {
    return { ok: false, code: "UNTESTABLE_GOAL" };
  }

  if (!/不要|禁止|不得|只能/.test(brief.constraints ?? "")) {
    return { ok: false, code: "MISSING_CONSTRAINTS" };
  }

  if (
    !brief.acceptance?.commands?.length ||
    !brief.acceptance?.browserPath ||
    !brief.acceptance?.expectedResult
  ) {
    return { ok: false, code: "MISSING_ACCEPTANCE" };
  }

  if (!brief.risks?.length || !brief.rollback) {
    return { ok: false, code: "MISSING_RISK_PLAN" };
  }

  const delivery = brief.deliveryFormat ?? [];
  const missingDeliveryField = REQUIRED_DELIVERY_FIELDS.find(
    (field) => !delivery.includes(field),
  );
  if (missingDeliveryField) {
    return { ok: false, code: "MISSING_DELIVERY_FORMAT" };
  }

  return { ok: true, code: "READY_FOR_AGENT" };
}

export function buildAgentHandoff(brief) {
  return {
    title: brief.title,
    prompt: [
      `背景：${brief.context}`,
      `目标：${brief.goal}`,
      `约束：${brief.constraints}`,
      `验收：${brief.acceptance.commands.join(" && ")}；浏览器路径 ${brief.acceptance.browserPath}；期望 ${brief.acceptance.expectedResult}`,
      `风险：${brief.risks.join("；")}`,
      `回滚：${brief.rollback}`,
      `交付格式：${brief.deliveryFormat.join("、")}`,
    ].join("\n"),
    expectedDelivery: REQUIRED_DELIVERY_FIELDS,
  };
}
