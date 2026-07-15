import { describe, expect, it } from "vitest";
import {
  aiCareerRoadmap,
  careerRoutes,
  chapterContract,
  sharedCoreAbilities,
  type CareerChapter,
} from "./careerRoadmap";

const requiredChapterFields: Array<keyof CareerChapter> = [
  "storyScene",
  "workBackground",
  "flow",
  "glossary",
  "codeFocus",
  "evidenceTask",
  "agentCollaboration",
  "acceptanceAction",
  "interviewReview",
];

describe("AI 职业路线学习契约", () => {
  it("按顺序提供 15 个不重复章节", () => {
    expect(aiCareerRoadmap).toHaveLength(15);
    expect(aiCareerRoadmap.map((chapter) => chapter.chapter)).toEqual(
      Array.from({ length: 15 }, (_, index) => index + 1),
    );
    expect(new Set(aiCareerRoadmap.map((chapter) => chapter.id)).size).toBe(15);
    expect(new Set(aiCareerRoadmap.map((chapter) => chapter.title)).size).toBe(
      15,
    );
  });

  it.each(aiCareerRoadmap)(
    "第 $chapter 章具备剧情到面试的九件套",
    (chapter) => {
      for (const field of requiredChapterFields) {
        const value = chapter[field];
        if (Array.isArray(value)) {
          expect(value.length, `${field} 不能为空`).toBeGreaterThan(0);
          expect(value.every((item) => item.trim().length > 0)).toBe(true);
        } else {
          expect(
            String(value).trim().length,
            `${field} 不能为空`,
          ).toBeGreaterThan(0);
        }
      }

      const flowStops = chapter.flow
        .split("→")
        .map((stop) => stop.trim())
        .filter(Boolean);
      expect(flowStops.length).toBeGreaterThanOrEqual(5);
      expect(chapter.flowPayloads).toHaveLength(flowStops.length - 1);
      expect(
        chapter.flowPayloads.every((payload) => payload.trim().length > 0),
      ).toBe(true);

      expect(chapter.rewards.length).toBeGreaterThan(0);
      expect(chapter.companionUnlock.name.trim()).not.toBe("");
      expect(chapter.companionUnlock.description.trim()).not.toBe("");
    },
  );

  it("路线 manifest 公开完整契约并加载同一份 AI 章节事实源", () => {
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

    const aiRoute = careerRoutes.find((route) => route.id === "ai-development");
    expect(aiRoute?.status).toBe("可进入");
    expect(aiRoute?.chapters).toBe(aiCareerRoadmap);
  });

  it("Java 和前端路线也有可继续接入的完整章节 manifest", () => {
    for (const routeId of ["java-backend", "frontend-engineering"] as const) {
      const route = careerRoutes.find((item) => item.id === routeId);
      expect(route?.status).toBe("可进入");
      expect(route?.chapters).toHaveLength(
        routeId === "frontend-engineering" ? 5 : 5,
      );
      expect(route?.chapters.map((chapter) => chapter.chapter)).toEqual([
        ...(routeId === "frontend-engineering"
          ? [1, 2, 3, 4, 5]
          : [1, 2, 3, 4, 5]),
      ]);
      for (const chapter of route?.chapters ?? []) {
        for (const field of requiredChapterFields) {
          const value = chapter[field];
          if (Array.isArray(value)) {
            expect(
              value.length,
              `${routeId}:${chapter.id}:${field}`,
            ).toBeGreaterThan(0);
            expect(
              value.every((item) => item.trim().length > 0),
              `${routeId}:${chapter.id}:${field}`,
            ).toBe(true);
          } else {
            expect(
              String(value).trim().length,
              `${routeId}:${chapter.id}:${field}`,
            ).toBeGreaterThan(0);
          }
        }
        expect(chapter.flow.split("→").filter(Boolean)).toHaveLength(
          chapter.flowPayloads.length + 1,
        );
        expect(chapter.companionUnlock.name).not.toBe("");
      }
      const chapters = route?.chapters ?? [];
      expect(new Set(chapters.map((chapter) => chapter.world)).size).toBe(
        chapters.length,
      );
      expect(new Set(chapters.map((chapter) => chapter.storyScene)).size).toBe(
        chapters.length,
      );
    }
  });

  it("跨岗位核心能力映射到真实 AI 章节和三个岗位用途", () => {
    expect(sharedCoreAbilities.map((ability) => ability.label)).toEqual([
      "读懂项目",
      "追踪数据流",
      "定位故障",
      "读取证据",
      "委托 Agent",
      "验收交付",
      "讲清项目",
    ]);

    const chapterIds = new Set(aiCareerRoadmap.map((chapter) => chapter.id));
    for (const ability of sharedCoreAbilities) {
      expect(ability.workAction.trim()).not.toBe("");
      expect(ability.evidence.trim()).not.toBe("");
      expect(ability.aiChapterIds.length).toBeGreaterThan(0);
      expect(ability.aiChapterIds.every((id) => chapterIds.has(id))).toBe(true);
      for (const route of careerRoutes) {
        expect(ability.transferTo[route.id].trim()).not.toBe("");
      }
    }
  });
});
