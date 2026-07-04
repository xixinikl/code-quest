/** 侦探身份系统 */
export type DetectiveRank = "见习侦探" | "初级侦探" | "资深侦探" | "大神探";

export type DetectiveProfile = {
  name: string;
  rank: DetectiveRank;
  xp: number;
  casesSolved: number;
  joinedAt: string;
};

export const RANK_THRESHOLDS: Record<DetectiveRank, number> = {
  见习侦探: 0,
  初级侦探: 100,
  资深侦探: 300,
  大神探: 600,
};

export const RANK_ICONS: Record<DetectiveRank, string> = {
  见习侦探: "🔍",
  初级侦探: "🕵️",
  资深侦探: "🕵️‍♂️",
  大神探: "🕵️‍♀️✨",
};

export function getRank(xp: number): DetectiveRank {
  if (xp >= 600) return "大神探";
  if (xp >= 300) return "资深侦探";
  if (xp >= 100) return "初级侦探";
  return "见习侦探";
}

export function getNextRank(
  xp: number,
): { name: DetectiveRank; need: number } | null {
  const current = getRank(xp);
  if (current === "大神探") return null;
  const ranks: DetectiveRank[] = ["见习侦探", "初级侦探", "资深侦探", "大神探"];
  const nextIdx = ranks.indexOf(current) + 1;
  const nextRank = ranks[nextIdx];
  return { name: nextRank, need: RANK_THRESHOLDS[nextRank] - xp };
}

const STORAGE_KEY = "codequest_detective";

export function loadDetective(): DetectiveProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return {
    name: "见习侦探",
    rank: "见习侦探",
    xp: 0,
    casesSolved: 0,
    joinedAt: new Date().toISOString(),
  };
}

export function saveDetective(profile: DetectiveProfile) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
}

export function awardXP(
  current: DetectiveProfile,
  amount: number,
): DetectiveProfile {
  const xp = current.xp + amount;
  const rank = getRank(xp);
  const casesSolved = current.casesSolved;
  const updated = { ...current, xp, rank, casesSolved };
  saveDetective(updated);
  return updated;
}

export function markCaseSolved(current: DetectiveProfile): DetectiveProfile {
  const updated = { ...current, casesSolved: current.casesSolved + 1 };
  saveDetective(updated);
  return updated;
}
