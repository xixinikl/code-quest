import { afterEach, describe, expect, it } from "vitest";
import {
  completeChapter,
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
    expect(profile.rank).toBe("项目修复手");
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
});
