export function splitIntoChunks(document) {
  const chunks = [];
  for (let index = 0; index < document.text.length; index += 120) {
    chunks.push({
      id: `${document.id}-${chunks.length + 1}`,
      text: document.text.slice(index, index + 120),
    });
  }
  return chunks;
}

export function indexDocuments(documents) {
  return documents.flatMap((document) => splitIntoChunks(document));
}

export function searchTopK({ question: _question, index, topK = 3 }) {
  return index.slice(0, topK).map((chunk, rank) => ({
    ...chunk,
    score: 1 - rank * 0.1,
  }));
}

export function answerWithSources({ question, documents }) {
  const index = indexDocuments(documents);
  const matches = searchTopK({ question, index, topK: 3 });
  const answer = `根据知识库，答案是：${matches[0]?.text || "暂无资料"}`;

  return {
    answer,
    citations: [],
    matches: [],
  };
}
