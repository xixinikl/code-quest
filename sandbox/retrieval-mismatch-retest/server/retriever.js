const chunks = [
  {
    id: "refund-v1-03",
    source: "refund-policy.md",
    version: "2025-12",
    active: false,
    score: 0.94,
    text: "签收后 7 天内可退款。",
  },
  {
    id: "refund-v2-03",
    source: "refund-policy.md",
    version: "2026-07",
    active: true,
    score: 0.91,
    text: "签收后 30 天内可退款。",
  },
];

export function retrieve() {
  // 复测故意只按相似度排序，旧版本先进入回答上下文。
  return [...chunks]
    .sort((left, right) => right.score - left.score)
    .slice(0, 1);
}

export function answer(question) {
  const matches = retrieve(question);
  return {
    text: `根据资料：${matches[0].text}`,
    citations: matches.map((match) => match.id),
    question,
  };
}

export function getChunks() {
  return chunks;
}
