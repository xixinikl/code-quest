/** AI 应用开发成长身份 */
export type DeveloperRank =
  "见习开发者" | "AI 应用学徒" | "项目修复手" | "AI 工程新星";

export type DeveloperProfile = {
  name: string;
  rank: DeveloperRank;
  xp: number;
  missionsCleared: number;
  clearedChapterIds: string[];
  unlockedCompanionNames: string[];
  joinedAt: string;
};

export const RANK_THRESHOLDS: Record<DeveloperRank, number> = {
  见习开发者: 0,
  "AI 应用学徒": 100,
  项目修复手: 300,
  "AI 工程新星": 600,
};

export function getRank(xp: number): DeveloperRank {
  if (xp >= 600) return "AI 工程新星";
  if (xp >= 300) return "项目修复手";
  if (xp >= 100) return "AI 应用学徒";
  return "见习开发者";
}

export function getNextRank(
  xp: number,
): { name: DeveloperRank; need: number } | null {
  const current = getRank(xp);
  if (current === "AI 工程新星") return null;
  const ranks: DeveloperRank[] = [
    "见习开发者",
    "AI 应用学徒",
    "项目修复手",
    "AI 工程新星",
  ];
  const nextIdx = ranks.indexOf(current) + 1;
  const nextRank = ranks[nextIdx];
  return { name: nextRank, need: RANK_THRESHOLDS[nextRank] - xp };
}

const STORAGE_KEY = "codequest_developer";
const LEGACY_STORAGE_KEY = "codequest_detective";

export function loadDeveloper(): DeveloperProfile {
  try {
    const raw =
      localStorage.getItem(STORAGE_KEY) ??
      localStorage.getItem(LEGACY_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<
        DeveloperProfile & { casesSolved: number }
      >;
      const xp = Number.isFinite(parsed.xp) ? Number(parsed.xp) : 0;
      const missionsCleared = Number.isFinite(parsed.missionsCleared)
        ? Number(parsed.missionsCleared)
        : Number.isFinite(parsed.casesSolved)
          ? Number(parsed.casesSolved)
          : 0;
      const clearedChapterIds = normalizeClearedChapters(
        parsed.clearedChapterIds,
        missionsCleared,
      );
      const unlockedCompanionNames = Array.isArray(
        parsed.unlockedCompanionNames,
      )
        ? uniqueStrings(parsed.unlockedCompanionNames)
        : [];
      const profile = {
        name: parsed.name || "见习开发者",
        xp,
        rank: getRank(xp),
        missionsCleared: clearedChapterIds.length,
        clearedChapterIds,
        unlockedCompanionNames,
        joinedAt: parsed.joinedAt || new Date().toISOString(),
      };
      saveDeveloper(profile);
      localStorage.removeItem(LEGACY_STORAGE_KEY);
      return profile;
    }
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(LEGACY_STORAGE_KEY);
  }
  return {
    name: "见习开发者",
    rank: "见习开发者",
    xp: 0,
    missionsCleared: 0,
    clearedChapterIds: [],
    unlockedCompanionNames: [],
    joinedAt: new Date().toISOString(),
  };
}

export function saveDeveloper(profile: DeveloperProfile) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
}

export function awardXP(
  current: DeveloperProfile,
  amount: number,
): DeveloperProfile {
  const xp = current.xp + amount;
  const rank = getRank(xp);
  const updated = { ...current, xp, rank };
  saveDeveloper(updated);
  return updated;
}

export function markMissionCleared(
  current: DeveloperProfile,
): DeveloperProfile {
  const updated = completeChapter(current, "1");
  saveDeveloper(updated);
  return updated;
}

export function completeChapter(
  current: DeveloperProfile,
  chapterId: string,
  unlockName?: string,
): DeveloperProfile {
  const clearedChapterIds = uniqueStrings([
    ...current.clearedChapterIds,
    chapterId,
  ]).sort((a, b) => Number(a) - Number(b));
  const unlockedCompanionNames = unlockName
    ? uniqueStrings([...current.unlockedCompanionNames, unlockName])
    : current.unlockedCompanionNames;
  const updated = {
    ...current,
    missionsCleared: clearedChapterIds.length,
    clearedChapterIds,
    unlockedCompanionNames,
  };
  saveDeveloper(updated);
  return updated;
}

export function isChapterCleared(
  profile: DeveloperProfile,
  chapterId: string,
): boolean {
  return profile.clearedChapterIds.includes(chapterId);
}

function normalizeClearedChapters(
  raw: unknown,
  missionsCleared: number,
): string[] {
  const fromStored = Array.isArray(raw) ? uniqueStrings(raw) : [];
  const fromLegacy = Array.from(
    { length: Math.max(0, missionsCleared) },
    (_, index) => String(index + 1),
  );
  return uniqueStrings([...fromLegacy, ...fromStored]).sort(
    (a, b) => Number(a) - Number(b),
  );
}

function uniqueStrings(values: unknown[]): string[] {
  return Array.from(
    new Set(
      values
        .map((value) => String(value).trim())
        .filter((value) => value.length > 0),
    ),
  );
}
