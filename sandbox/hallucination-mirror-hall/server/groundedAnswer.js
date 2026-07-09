export function buildGroundedPrompt({ question, contextChunks }) {
  return [
    {
      role: "system",
      content: "你是一个有帮助的 AI 助手，请尽量回答用户问题。",
    },
    {
      role: "user",
      content: JSON.stringify({
        question,
        context: contextChunks.map((chunk) => chunk.text).join("\n"),
      }),
    },
  ];
}

export function createFakeModel(response) {
  return {
    calls: [],
    answer(messages) {
      this.calls.push(messages);
      return response;
    },
  };
}

export function validateGroundedAnswer({ modelAnswer, contextChunks }) {
  const allowedIds = new Set(contextChunks.map((chunk) => chunk.id));
  const citations = Array.isArray(modelAnswer.citations)
    ? modelAnswer.citations
    : [];

  return {
    answer: modelAnswer.answer,
    citations,
    confidence: modelAnswer.confidence || "high",
    allowedCitationCount: citations.filter((id) => allowedIds.has(id)).length,
  };
}

export function answerQuestion({ question, contextChunks, model }) {
  const messages = buildGroundedPrompt({ question, contextChunks });
  const modelAnswer = model.answer(messages);
  return validateGroundedAnswer({ modelAnswer, contextChunks });
}
