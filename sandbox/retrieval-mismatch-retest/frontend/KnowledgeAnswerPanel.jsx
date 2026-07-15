export function KnowledgeAnswerPanel({ question }) {
  return fetch(`/api/knowledge/answer?q=${encodeURIComponent(question)}`).then(
    (response) => response.json(),
  );
}
