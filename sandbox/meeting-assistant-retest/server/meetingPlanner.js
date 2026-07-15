export function planMeetingAssistant({ brief, candidates, sessionStore }) {
  const eligible = candidates.filter(
    (candidate) => candidate.stage !== brief.stage,
  );
  const selected = eligible.sort((a, b) => b.fitScore - a.fitScore)[0] ?? null;

  sessionStore.save(brief.sessionId, {
    brief,
    selectedCandidateId: selected?.id ?? null,
  });

  return { brief, eligible, selected };
}
