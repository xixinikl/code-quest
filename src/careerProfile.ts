import {
  aiCareerRoadmap,
  careerRoutes,
  type CareerChapter,
} from "./careerRoadmap";

/** AI 应用开发成长身份 */
export type DeveloperRank =
  | "见习开发者"
  | "AI 应用学徒"
  | "项目修复手"
  | "证据调查员"
  | "AI 工程新星"
  | "Agent 协作师"
  | "交付守门人"
  | "AI 应用工程师";

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
  项目修复手: 360,
  证据调查员: 720,
  "AI 工程新星": 1080,
  "Agent 协作师": 1320,
  交付守门人: 1560,
  "AI 应用工程师": 1800,
};

export const XP_PER_ADVENTURE_LEVEL = 120;
export const MAX_ADVENTURE_LEVEL = aiCareerRoadmap.length + 1;

const RANK_ORDER = Object.keys(RANK_THRESHOLDS) as DeveloperRank[];

export function getRank(xp: number): DeveloperRank {
  const safeXp = Math.max(0, xp);
  return (
    [...RANK_ORDER].reverse().find((rank) => safeXp >= RANK_THRESHOLDS[rank]) ??
    "见习开发者"
  );
}

export function getNextRank(
  xp: number,
): { name: DeveloperRank; need: number } | null {
  const current = getRank(xp);
  const nextRank = RANK_ORDER[RANK_ORDER.indexOf(current) + 1];
  if (!nextRank) return null;
  return { name: nextRank, need: RANK_THRESHOLDS[nextRank] - xp };
}

export type AdventureProgress = {
  level: number;
  currentLevelXp: number;
  xpPerLevel: number;
  xpToNextLevel: number;
  percent: number;
  isMaxLevel: boolean;
};

export function getAdventureProgress(xp: number): AdventureProgress {
  const safeXp = Math.max(0, Math.floor(xp));
  const level = Math.min(
    MAX_ADVENTURE_LEVEL,
    Math.floor(safeXp / XP_PER_ADVENTURE_LEVEL) + 1,
  );
  const isMaxLevel = level === MAX_ADVENTURE_LEVEL;
  const currentLevelXp = isMaxLevel
    ? XP_PER_ADVENTURE_LEVEL
    : safeXp % XP_PER_ADVENTURE_LEVEL;

  return {
    level,
    currentLevelXp,
    xpPerLevel: XP_PER_ADVENTURE_LEVEL,
    xpToNextLevel: isMaxLevel ? 0 : XP_PER_ADVENTURE_LEVEL - currentLevelXp,
    percent: isMaxLevel
      ? 100
      : Math.round((currentLevelXp / XP_PER_ADVENTURE_LEVEL) * 100),
    isMaxLevel,
  };
}

export function getChapterXp(chapterId: string): number {
  return chapterId === "1" || chapterId.endsWith("-1") ? 150 : 120;
}

export function getMinimumXpForClearedChapters(
  clearedChapterIds: string[],
): number {
  const allCareerChapters = careerRoutes.flatMap(
    (route) => route.chapters as readonly CareerChapter[],
  );
  const validChapterIds = new Set<string>(
    allCareerChapters.map((chapter) => chapter.id),
  );
  return uniqueStrings(clearedChapterIds)
    .filter((chapterId) => validChapterIds.has(chapterId))
    .reduce((total, chapterId) => total + getChapterXp(chapterId), 0);
}

export function reconcileCareerXp(
  storedXp: number,
  clearedChapterIds: string[],
): number {
  return Math.max(
    Number.isFinite(storedXp) ? storedXp : 0,
    getMinimumXpForClearedChapters(clearedChapterIds),
  );
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
      const storedXp = Number.isFinite(parsed.xp) ? Number(parsed.xp) : 0;
      const missionsCleared = Number.isFinite(parsed.missionsCleared)
        ? Number(parsed.missionsCleared)
        : Number.isFinite(parsed.casesSolved)
          ? Number(parsed.casesSolved)
          : 0;
      const clearedChapterIds = normalizeClearedChapters(
        parsed.clearedChapterIds,
        missionsCleared,
      );
      const xp = reconcileCareerXp(storedXp, clearedChapterIds);
      const unlockedCompanionNames = reconcileCompanionUnlocks(
        clearedChapterIds,
        Array.isArray(parsed.unlockedCompanionNames)
          ? parsed.unlockedCompanionNames
          : [],
      );
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
  ]).sort(compareChapterIds);
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

export function reconcileCompanionUnlocks(
  clearedChapterIds: string[],
  storedNames: unknown[],
): string[] {
  const allCareerChapters = careerRoutes.flatMap(
    (route) => route.chapters as readonly CareerChapter[],
  );
  const clearedNames = allCareerChapters
    .filter((chapter) => clearedChapterIds.includes(chapter.id))
    .map((chapter) => chapter.companionUnlock.name);
  return uniqueStrings([...storedNames, ...clearedNames]);
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
  return uniqueStrings([...fromLegacy, ...fromStored]).sort(compareChapterIds);
}

function compareChapterIds(a: string, b: string) {
  const aNumber = /^\d+$/u.test(a);
  const bNumber = /^\d+$/u.test(b);
  if (aNumber && bNumber) return Number(a) - Number(b);
  if (aNumber) return -1;
  if (bNumber) return 1;
  return a.localeCompare(b);
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
