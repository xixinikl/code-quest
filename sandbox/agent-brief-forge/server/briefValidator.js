export function validateAgentBrief(brief) {
  const wordCount = JSON.stringify(brief).length;

  if (wordCount < 80) {
    return {
      ok: false,
      code: "TOO_SHORT",
      message: "任务太短。",
    };
  }

  return {
    ok: true,
    code: "READY_FOR_AGENT",
    message: "任务描述足够长，可以交给 Agent。",
  };
}

export function buildAgentHandoff(brief) {
  return {
    title: brief.title,
    prompt: `${brief.context}\n${brief.goal}\n${brief.constraints}`,
    expectedDelivery: "完成后告诉我结果。",
  };
}
