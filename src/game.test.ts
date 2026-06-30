import { describe, expect, it } from "vitest";
import {
  completeLesson,
  initialProgress,
  isLessonUnlocked,
  lessons,
  levelFromXp,
  sanitizeProgress,
} from "./game";

describe("成长规则", () => {
  it("完成首关增加经验、技能与连续学习，并解锁第二关", () => {
    const diagnosed = { ...initialProgress, diagnosed: true };
    const result = completeLesson(
      diagnosed,
      lessons[0],
      new Date("2026-06-30T10:00:00"),
    );

    expect(result.xp).toBe(80);
    expect(result.skills.workflow).toBe(2);
    expect(result.streak).toBe(1);
    expect(result.completedLessons).toEqual(["workflow-loop"]);
    expect(isLessonUnlocked(result, lessons[1])).toBe(true);
  });

  it("重复完成同一关不会重复获得奖励", () => {
    const once = completeLesson(initialProgress, lessons[0]);
    expect(completeLesson(once, lessons[0])).toBe(once);
  });

  it("每 200 XP 提升一级", () => {
    expect(levelFromXp(0)).toBe(1);
    expect(levelFromXp(199)).toBe(1);
    expect(levelFromXp(200)).toBe(2);
  });
});

describe("本地数据防护", () => {
  it("损坏数据回退到初始状态", () => {
    expect(sanitizeProgress(null)).toEqual(initialProgress);
    expect(sanitizeProgress({ version: 99 })).toEqual(initialProgress);
  });

  it("钳制非法技能值并移除未知关卡", () => {
    const result = sanitizeProgress({
      version: 1,
      diagnosed: true,
      skills: {
        workflow: 99,
        git: -4,
        debugging: 3,
        api: 2,
        database: 4,
      },
      completedLessons: ["workflow-loop", "不存在的关卡"],
      xp: -50,
      streak: 1,
      dictionary: [],
    });

    expect(result.skills.workflow).toBe(5);
    expect(result.skills.git).toBe(1);
    expect(result.completedLessons).toEqual(["workflow-loop"]);
    expect(result.xp).toBe(0);
    expect(result.dictionary.length).toBeGreaterThan(0);
  });
});
