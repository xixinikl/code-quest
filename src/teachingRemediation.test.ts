import { describe, expect, it } from "vitest";
import {
  case02Scenario,
  case03Scenario,
  case04Scenario,
  case05Scenario,
  case06Scenario,
  case07Scenario,
  case08Scenario,
  case09Scenario,
  case10Scenario,
  case11Scenario,
  case12Scenario,
  case13Scenario,
  case14Scenario,
  case15Scenario,
  frontendTestingProofScenario,
  type TeachingScenario,
} from "./teaching";
import { withChapterRemediation } from "./remediation";

const chapterRemediationContracts: Array<{
  chapter: number;
  scenario: TeachingScenario;
  anchors: string[];
}> = [
  {
    chapter: 2,
    scenario: case02Scenario,
    anchors: ["Project Brief", "方向筛选", "候选取舍", "会话"],
  },
  {
    chapter: 3,
    scenario: case03Scenario,
    anchors: ["Token", "Cookie", "Session", "401"],
  },
  {
    chapter: 4,
    scenario: case04Scenario,
    anchors: ["Payload", "400", "500", "requestId"],
  },
  {
    chapter: 5,
    scenario: case05Scenario,
    anchors: ["Idempotency-Key", "唯一约束", "并发", "事务"],
  },
  {
    chapter: 6,
    scenario: case06Scenario,
    anchors: ["Network 瀑布图", "TTFB", "渲染", "缓存"],
  },
  {
    chapter: 7,
    scenario: case07Scenario,
    anchors: ["API Key", "环境变量", "流式响应", "错误兜底"],
  },
  {
    chapter: 8,
    scenario: case08Scenario,
    anchors: ["Prompt", "上下文", "引用", "拒答边界"],
  },
  {
    chapter: 9,
    scenario: case09Scenario,
    anchors: ["RAG", "chunk", "embedding", "命中率"],
  },
  {
    chapter: 10,
    scenario: case10Scenario,
    anchors: ["工具调用", "参数 schema", "权限", "失败回退"],
  },
  {
    chapter: 11,
    scenario: case11Scenario,
    anchors: ["复现用例", "单元测试", "集成测试", "手动报告"],
  },
  {
    chapter: 12,
    scenario: case12Scenario,
    anchors: ["背景", "目标", "约束", "验收", "风险"],
  },
  {
    chapter: 13,
    scenario: case13Scenario,
    anchors: ["交付说明", "Diff", "回归风险", "边界条件", "文档同步"],
  },
  {
    chapter: 14,
    scenario: case14Scenario,
    anchors: ["上线计划", "环境变量", "数据备份", "监控", "回滚"],
  },
  {
    chapter: 15,
    scenario: case15Scenario,
    anchors: ["STAR", "故障复盘", "技术取舍", "成长证据", "追问"],
  },
];

describe("第 2-15 章专属补课契约", () => {
  it.each(chapterRemediationContracts)(
    "第 $chapter 章概念卡和代码导读均提供四类补课",
    ({ scenario }) => {
      const learnableSteps = scenario.steps
        .filter(
          (step) => (step.concepts?.length ?? 0) > 0 || Boolean(step.codeFocus),
        )
        .map((step) => withChapterRemediation(scenario.scenarioId, step));

      expect(learnableSteps.length).toBeGreaterThan(1);
      for (const step of learnableSteps) {
        expect(step.remediation?.map((item) => item.trigger)).toEqual([
          "term",
          "syntax",
          "project-position",
          "causality",
        ]);
        expect(
          step.remediation?.every(
            (item) =>
              item.microLesson.summary.trim().length > 0 &&
              item.microLesson.notes.length >= 3 &&
              item.microLesson.takeaway.trim().length > 0,
          ),
        ).toBe(true);
      }
    },
  );

  it.each(chapterRemediationContracts)(
    "第 $chapter 章补课包含本章事实锚点",
    ({ scenario, anchors }) => {
      const rawConceptStep = scenario.steps.find(
        (step) => (step.concepts?.length ?? 0) > 0,
      );
      const conceptStep = rawConceptStep
        ? withChapterRemediation(scenario.scenarioId, rawConceptStep)
        : undefined;
      const lessonText = JSON.stringify(conceptStep?.remediation);

      for (const anchor of anchors) {
        expect(lessonText, `缺少本章锚点：${anchor}`).toContain(anchor);
      }
    },
  );

  it("十四章补课不是同一份通用文案", () => {
    const getTakeaway = (
      scenario: TeachingScenario,
      trigger: "term" | "causality",
    ) => {
      const step = scenario.steps.find(
        (candidate) => (candidate.concepts?.length ?? 0) > 0,
      );
      return step
        ? withChapterRemediation(scenario.scenarioId, step)
            .remediation?.find((item) => item.trigger === trigger)
            ?.microLesson.takeaway.trim()
        : undefined;
    };
    const termTakeaways = chapterRemediationContracts.map(({ scenario }) =>
      getTakeaway(scenario, "term"),
    );
    const causalityTakeaways = chapterRemediationContracts.map(({ scenario }) =>
      getTakeaway(scenario, "causality"),
    );

    expect(new Set(termTakeaways).size).toBe(
      chapterRemediationContracts.length,
    );
    expect(new Set(causalityTakeaways).size).toBe(
      chapterRemediationContracts.length,
    );
  });

  it("前端第 5 关教学剧情不再露出旧 AI 保存链路", () => {
    const teachingText = JSON.stringify(frontendTestingProofScenario);

    expect(teachingText).toContain("frontend-testing-proof");
    expect(teachingText).toContain("执行筛选交互后复核可见列表");
    expect(teachingText).toContain("筛选后列表仍匹配");
    expect(teachingText).not.toContain("/api/canvases");
    expect(teachingText).not.toContain("canvas-save-persistence");
    expect(teachingText).not.toContain("POST 保存后再 GET");
    expect(teachingText).not.toContain("保存后刷新丢数据");
    expect(teachingText).not.toContain("保存链路");
    expect(teachingText).not.toContain("保存画布");
    expect(teachingText).not.toContain("验收试炼画布");
  });
});
