import { afterEach, describe, expect, it } from "vitest";
import {
  completeChapter,
  getAdventureProgress,
  getChapterXp,
  getMinimumXpForClearedChapters,
  getNextRank,
  getRank,
  isChapterCleared,
  loadDeveloper,
  type DeveloperProfile,
} from "./careerProfile";

afterEach(() => {
  localStorage.clear();
});

describe("developer career profile", () => {
  it("migrates old progress into explicit cleared chapters", () => {
    localStorage.setItem(
      "codequest_developer",
      JSON.stringify({
        name: "见习开发者",
        xp: 300,
        missionsCleared: 3,
        joinedAt: "2026-07-01T00:00:00.000Z",
      }),
    );

    const profile = loadDeveloper();

    expect(profile.clearedChapterIds).toEqual(["1", "2", "3"]);
    expect(profile.missionsCleared).toBe(3);
    expect(profile.xp).toBe(390);
    expect(profile.rank).toBe("项目修复手");
  });

  it("keeps adventure levels meaningful from the first chapter to the finale", () => {
    expect(getAdventureProgress(0)).toMatchObject({
      level: 1,
      percent: 0,
      xpToNextLevel: 120,
      isMaxLevel: false,
    });
    expect(getAdventureProgress(150)).toMatchObject({
      level: 2,
      currentLevelXp: 30,
      xpToNextLevel: 90,
    });
    expect(getAdventureProgress(1830)).toMatchObject({
      level: 16,
      percent: 100,
      xpToNextLevel: 0,
      isMaxLevel: true,
    });
  });

  it("spreads rank promotions across the fifteen chapter route", () => {
    expect(getRank(0)).toBe("见习开发者");
    expect(getRank(390)).toBe("项目修复手");
    expect(getRank(750)).toBe("证据调查员");
    expect(getRank(1110)).toBe("AI 工程新星");
    expect(getRank(1350)).toBe("Agent 协作师");
    expect(getRank(1590)).toBe("交付守门人");
    expect(getRank(1830)).toBe("AI 应用工程师");
    expect(getNextRank(1590)).toEqual({
      name: "AI 应用工程师",
      need: 210,
    });
  });

  it("backfills old profiles from cleared chapters without inventing replay XP", () => {
    const allChapterIds = Array.from({ length: 15 }, (_, index) =>
      String(index + 1),
    );

    expect(getChapterXp("1")).toBe(150);
    expect(getChapterXp("2")).toBe(120);
    expect(getMinimumXpForClearedChapters(allChapterIds)).toBe(1830);

    localStorage.setItem(
      "codequest_developer",
      JSON.stringify({
        name: "见习开发者",
        xp: 1170,
        missionsCleared: 15,
        clearedChapterIds: allChapterIds,
        unlockedCompanionNames: [],
        joinedAt: "2026-07-01T00:00:00.000Z",
      }),
    );

    const profile = loadDeveloper();
    expect(profile.xp).toBe(1830);
    expect(profile.rank).toBe("AI 应用工程师");
    expect(getAdventureProgress(profile.xp).level).toBe(16);
  });

  it("records chapter unlocks without duplicating collection progress", () => {
    const profile: DeveloperProfile = {
      name: "见习开发者",
      rank: "AI 应用学徒",
      xp: 120,
      missionsCleared: 1,
      clearedChapterIds: ["1"],
      unlockedCompanionNames: ["档案馆记录员"],
      joinedAt: "2026-07-01T00:00:00.000Z",
    };

    const unlocked = completeChapter(profile, "15", "终章答辩官");
    const replayed = completeChapter(unlocked, "15", "终章答辩官");

    expect(isChapterCleared(replayed, "15")).toBe(true);
    expect(replayed.clearedChapterIds).toEqual(["1", "15"]);
    expect(replayed.missionsCleared).toBe(2);
    expect(replayed.unlockedCompanionNames).toEqual([
      "档案馆记录员",
      "终章答辩官",
    ]);
  });

  it("backfills companions added after an existing chapter was cleared", () => {
    localStorage.setItem(
      "codequest_developer",
      JSON.stringify({
        name: "见习开发者",
        xp: 1170,
        missionsCleared: 15,
        clearedChapterIds: Array.from({ length: 15 }, (_, index) =>
          String(index + 1),
        ),
        unlockedCompanionNames: ["档案馆记录员", "灵感萤火"],
        joinedAt: "2026-07-01T00:00:00.000Z",
      }),
    );

    const profile = loadDeveloper();

    expect(profile.unlockedCompanionNames).toHaveLength(15);
    expect(profile.unlockedCompanionNames).toContain("终章答辩官");
    expect(profile.unlockedCompanionNames).toContain("密钥匣");
  });

  it("records route-specific chapter rewards and companions", () => {
    expect(getChapterXp("java-1")).toBe(150);
    expect(getChapterXp("frontend-2")).toBe(120);

    const profile: DeveloperProfile = {
      name: "见习开发者",
      rank: "见习开发者",
      xp: 0,
      missionsCleared: 0,
      clearedChapterIds: [],
      unlockedCompanionNames: [],
      joinedAt: "2026-07-01T00:00:00.000Z",
    };
    const cleared = completeChapter(profile, "frontend-1", "状态编舞师");

    expect(cleared.clearedChapterIds).toContain("frontend-1");
    expect(cleared.unlockedCompanionNames).toContain("状态编舞师");
    expect(getMinimumXpForClearedChapters(["frontend-1", "java-2"])).toBe(270);
  });

  it("keeps mixed AI and job-route chapter ids in a deterministic order", () => {
    const profile: DeveloperProfile = {
      name: "见习开发者",
      rank: "见习开发者",
      xp: 0,
      missionsCleared: 0,
      clearedChapterIds: ["java-2", "1"],
      unlockedCompanionNames: [],
      joinedAt: "2026-07-01T00:00:00.000Z",
    };

    const updated = completeChapter(profile, "frontend-1");

    expect(updated.clearedChapterIds).toEqual(["1", "frontend-1", "java-2"]);
  });
});
