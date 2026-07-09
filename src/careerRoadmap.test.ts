import { describe, expect, it } from "vitest";
import {
  aiCareerRoadmap,
  careerRoutes,
  chapterContract,
} from "./careerRoadmap";

describe("AI career roadmap manifest", () => {
  it("defines the full 15-chapter engineering RPG route", () => {
    expect(aiCareerRoadmap).toHaveLength(15);
    expect(aiCareerRoadmap.map((chapter) => chapter.id)).toEqual(
      Array.from({ length: 15 }, (_, index) => String(index + 1)),
    );

    expect(aiCareerRoadmap[0].status).toBe("当前");
    expect(aiCareerRoadmap[1].status).toBe("预览");
    expect(
      aiCareerRoadmap.slice(2).every((chapter) => chapter.status === "待解锁"),
    ).toBe(true);

    expect(aiCareerRoadmap.map((chapter) => chapter.theme)).toEqual([
      "数据为什么消失",
      "AI 点子为什么空泛",
      "登录状态为什么丢",
      "接口为什么报错",
      "数据为什么重复/错乱",
      "页面为什么慢",
      "AI 接口怎么接",
      "AI 回复为什么胡说",
      "RAG 知识库",
      "Agent 工具调用",
      "测试怎么证明修好了",
      "Agent 任务怎么写",
      "怎么审查交付",
      "上线前检查什么",
      "面试怎么讲项目",
    ]);
  });

  it("keeps every chapter tied to work evidence and interview output", () => {
    expect(chapterContract).toEqual([
      "剧情场景",
      "工作背景",
      "完整流程图",
      "名词小抄",
      "关键代码",
      "证据任务",
      "Agent 协作",
      "验收动作",
      "面试复盘",
      "伙伴/宠物解锁",
    ]);

    for (const chapter of aiCareerRoadmap) {
      expect(chapter.world).not.toHaveLength(0);
      expect(chapter.title).not.toHaveLength(0);
      expect(chapter.summary).not.toHaveLength(0);
      expect(chapter.storyScene).not.toHaveLength(0);
      expect(chapter.learn).not.toHaveLength(0);
      expect(chapter.validation).not.toHaveLength(0);
      expect(chapter.workBackground).not.toHaveLength(0);
      expect(chapter.flow).toContain("→");
      expect(chapter.glossary.length).toBeGreaterThanOrEqual(3);
      expect(chapter.codeFocus).not.toHaveLength(0);
      expect(chapter.evidenceTask).not.toHaveLength(0);
      expect(chapter.agentCollaboration).toContain("Agent");
      expect(chapter.acceptanceAction).not.toHaveLength(0);
      expect(chapter.interviewReview).not.toHaveLength(0);
      expect(chapter.rewards.length).toBeGreaterThanOrEqual(3);
      expect(chapter.companionUnlock.name).not.toHaveLength(0);
      expect(chapter.companionUnlock.description).not.toHaveLength(0);
    }
  });

  it("defines simple job-route loading metadata without exposing empty routes", () => {
    expect(careerRoutes.map((route) => route.id)).toEqual([
      "ai-development",
      "java-backend",
      "frontend-engineering",
    ]);
    expect(careerRoutes[0].status).toBe("可进入");
    expect(careerRoutes[0].chapters).toBe(aiCareerRoadmap);
    expect(careerRoutes[0].coreSkills).toContain("Agent 协作");

    for (const route of careerRoutes.slice(1)) {
      expect(route.status).toBe("即将解锁");
      expect(route.chapters).toHaveLength(0);
      expect(route.previewChapters.length).toBeGreaterThanOrEqual(4);
      expect(route.promise).toContain("规划路线");
    }
  });
});
