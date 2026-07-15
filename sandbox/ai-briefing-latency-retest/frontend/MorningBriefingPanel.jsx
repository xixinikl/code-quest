import { useEffect, useState } from "react";

export function MorningBriefingPanel({ teamId, date }) {
  const [briefing, setBriefing] = useState(null);

  useEffect(() => {
    fetch(`/api/briefings/morning?teamId=${teamId}&date=${date}`)
      .then((response) => response.json())
      .then(setBriefing);
  }, [teamId, date]);

  if (!briefing) return <p>正在等待晨报第一句话...</p>;

  return (
    <section>
      <h1>{briefing.title}</h1>
      <ul>
        {briefing.items.map((item) => (
          <li key={item.id}>{item.summary}</li>
        ))}
      </ul>
    </section>
  );
}
