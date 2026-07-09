import { useMemo } from "react";

export function InterviewStoryBoard({ answer, verdict }) {
  const missing = useMemo(() => verdict?.requestedRevisions ?? [], [verdict]);

  return (
    <section className="interview-story-board">
      <p className="eyebrow">终章答辩厅</p>
      <h2>把关卡证据锻造成面试回答</h2>
      <blockquote>{answer.opening}</blockquote>
      <ol>
        {missing.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ol>
    </section>
  );
}
