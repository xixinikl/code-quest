import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  chapterScenarioIds,
  type ChapterScenarioId,
  getChapterCinematic,
  getChapterShot,
  getMapNodePlacement,
  getTopologySignature,
} from "./chapterCinematics";
import { case13Scenario } from "./teaching";
import { canonicalScenarioIds, normalizeScenarioId } from "./scenarioIds";
import {
  getTeachingStorySceneImages,
  getTeachingStoryScenes,
} from "./TeachingBridge";

const aiScenarioIds = chapterScenarioIds.filter((scenarioId) =>
  /^\d+$/.test(getChapterCinematic(scenarioId).chapterId),
);

const jobScenarioIds: ChapterScenarioId[] = [
  "java-layered-request",
  "java-transaction-consistency",
  "java-cache-observability",
  "java-release-harbor",
  "java-production-incident",
  "frontend-component-state",
  "frontend-request-states",
  "frontend-performance-proof",
  "frontend-accessibility-proof",
  "frontend-testing-proof",
];

describe("十五章镜头与地图契约", () => {
  it("运行时入口不再导入旧风格角色宠物 SVG 或旧 PNG 场景", () => {
    const runtimeFiles = [
      "App.tsx",
      "TeachingBridge.tsx",
      "transferRetests.ts",
    ];

    for (const file of runtimeFiles) {
      const source = readFileSync(join(process.cwd(), "src", file), "utf8");

      expect(source).not.toMatch(
        /from "\.\/assets\/(?:portrait|pet)-[^"]+\.svg"/,
      );
      expect(source).not.toMatch(
        /from "\.\/assets\/(?:quest-[^"]+|code-archive-night)\.png"/,
      );
    }
  });

  it("教学桥关键学习控件保持暗色 RPG 覆盖，不退回白色课件壳", () => {
    const styles = readFileSync(
      join(process.cwd(), "src", "styles.css"),
      "utf8",
    );
    const requiredSelectors = [
      ".teaching-bridge .prediction-option.wrong",
      ".teaching-bridge .teaching-footer .map-hint",
      ".concept-section::before",
      ".explanation-box.correct",
      ".explanation-box.incorrect",
      ".flowchart-node-idx",
      ".flowchart-arrow-label",
    ];

    for (const selector of requiredSelectors) {
      expect(styles).toContain(selector);
    }

    const selectorBlock = (selector: string) => {
      const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const match = styles.match(new RegExp(`${escaped}\\s*\\{[^}]+\\}`));
      expect(
        match,
        `${selector} should have a concrete CSS block`,
      ).toBeTruthy();
      return match?.[0] ?? "";
    };

    for (const selector of requiredSelectors) {
      const block = selectorBlock(selector);
      expect(block).not.toMatch(/background:\s*white;/);
      expect(block).not.toMatch(/background:\s*#fff(?:;|\s)/i);
    }

    expect(
      selectorBlock(".teaching-bridge .teaching-footer .map-hint"),
    ).toContain("rgba(217, 184, 110");
  });

  it("每章都有独立地图拓扑与可解释的镜头契约", () => {
    const configs = aiScenarioIds.map(getChapterCinematic);

    expect(configs).toHaveLength(15);
    expect(new Set(configs.map((config) => config.chapterId)).size).toBe(15);
    expect(new Set(configs.map((config) => config.mapTopology)).size).toBe(15);
    expect(new Set(configs.map((config) => config.mapLabel)).size).toBe(15);
    expect(new Set(configs.map((config) => config.mapTerrain)).size).toBe(15);
    expect(new Set(configs.map((config) => config.mapLandmark)).size).toBe(15);
    expect(new Set(configs.map((config) => config.mapAccent)).size).toBe(15);
    expect(new Set(configs.map((config) => config.shots.join("|"))).size).toBe(
      15,
    );
    for (const config of configs) {
      expect(config.cameraLabel.length).toBeGreaterThan(8);
      expect(config.mapInstruction.length).toBeGreaterThan(20);
      expect(config.focus).toMatch(/^\d+% \d+%$/);
      expect(config.cameraDuration).toMatch(/^\d+s$/);
      expect(Number.parseInt(config.cameraDuration, 10)).toBeGreaterThanOrEqual(
        10,
      );
      expect(config.cameraEasing).toMatch(/^(linear|cubic-bezier\(.+\))$/);
      expect(config.mapTerrain.length).toBeGreaterThanOrEqual(5);
      expect(config.mapLandmark.length).toBeGreaterThanOrEqual(5);
      expect(config.mapAccent).toMatch(/^#[0-9a-f]{6}$/i);
      expect(config.mapAccentSoft).toMatch(/^rgba\(.+\)$/);
    }
  });

  it("十五种拓扑坐标签名不同且节点始终落在十二列地图内", () => {
    const configs = aiScenarioIds.map(getChapterCinematic);
    const signatures = configs.map((config) =>
      getTopologySignature(config.mapTopology),
    );

    expect(new Set(signatures).size).toBe(15);
    for (const config of configs) {
      for (let index = 0; index < 8; index += 1) {
        const placement = getMapNodePlacement(config.mapTopology, index);
        expect(placement.column).toBeGreaterThanOrEqual(1);
        expect(placement.span).toBeGreaterThanOrEqual(1);
        expect(placement.column + placement.span - 1).toBeLessThanOrEqual(12);
        expect(placement.row).toBeGreaterThanOrEqual(1);
      }
    }
  });

  it("同一章切换地点时会切换景别而不是重复同一个漂移动画", () => {
    const productShots = [0, 1, 2].map(
      (index) => getChapterShot("case-002", index).shot,
    );
    const reviewShots = [0, 1, 2].map(
      (index) => getChapterShot("case-013-delivery-review", index).shot,
    );

    expect(productShots).toEqual([
      "top-down",
      "over-shoulder-right",
      "close-up",
    ]);
    expect(reviewShots).toEqual([
      "over-shoulder-left",
      "over-shoulder-right",
      "locked",
    ]);
    expect(getChapterShot("case-002", 0)).toEqual(
      expect.objectContaining({
        duration: "14s",
        easing: "cubic-bezier(0.16, 1, 0.3, 1)",
      }),
    );
    expect(getChapterShot("case-006-performance", 0).duration).toBe("22s");
  });

  it("新项目章节 ID 会命中对应的旧教学注册表，而不是回退到第一章", () => {
    expect(canonicalScenarioIds).toHaveLength(14);
    expect(normalizeScenarioId("canvasstorm-product-brief")).toBe("case-002");
    expect(getChapterCinematic("canvasstorm-product-brief")).toEqual(
      expect.objectContaining({ chapterId: "2", chapterTitle: "产品密室" }),
    );
    expect(getChapterShot("interview-answer-forge", 0).shot).toBe(
      "establishing",
    );
    expect(getChapterCinematic("interview-answer-forge").chapterId).toBe("15");
    expect(
      getTeachingStorySceneImages("canvasstorm-product-brief").some((image) =>
        image.includes("quest-archive"),
      ),
    ).toBe(true);
    const case02Scenes = getTeachingStoryScenes("canvasstorm-product-brief");
    expect(case02Scenes.map((scene) => scene.place)).toContain("产品复盘厅");
    expect(case02Scenes.map((scene) => scene.place)).not.toContain("AI 状态台");
    expect(JSON.stringify(case02Scenes)).not.toContain("API Key");
  });

  it("岗位路线第 2-5 章都有自己的地图镜头，不回退到第一章失忆数据库", () => {
    const configs = jobScenarioIds.map(getChapterCinematic);

    expect(configs.map((config) => config.chapterId)).toEqual([
      "java-1",
      "java-2",
      "java-3",
      "java-4",
      "java-5",
      "frontend-1",
      "frontend-2",
      "frontend-3",
      "frontend-4",
      "frontend-5",
    ]);
    for (const config of configs) {
      expect(config.mapLabel).not.toBe("数据接力路线");
      expect(config.mapTerrain).not.toBe("断流档案河");
      expect(config.mapLandmark).not.toBe("失忆数据库");
      expect(config.mapInstruction.length).toBeGreaterThan(24);
    }

    expect(getChapterCinematic("java-release-harbor")).toEqual(
      expect.objectContaining({
        mapLabel: "Java 上线连续门禁",
        mapLandmark: "回滚吊桥",
      }),
    );
    expect(getChapterCinematic("frontend-testing-proof")).toEqual(
      expect.objectContaining({
        mapLabel: "前端回归双轨场",
        mapLandmark: "sourceHash 证据门",
      }),
    );
  });

  it("每个章节的每个地点都有角色、背景和可理解的证据任务", () => {
    const scenarioIds = [
      "canvas-save-persistence",
      "case-002",
      "case-003-login-state",
      "case-004-api-error",
      "case-005-data-consistency",
      "case-006-performance",
      "case-007-ai-api",
      "case-008-hallucination",
      "case-009-rag",
      "case-010-agent-tools",
      "case-011-testing-proof",
      "case-012-agent-brief",
      "case-013-delivery-review",
      "case-014-release-readiness",
      "case-015-interview-review",
      "java-layered-request",
      "java-transaction-consistency",
      "java-cache-observability",
      "java-release-harbor",
      "java-production-incident",
      "frontend-component-state",
      "frontend-request-states",
      "frontend-performance-proof",
      "frontend-accessibility-proof",
      "frontend-testing-proof",
    ];

    const singleSpeakerScenarioIds: string[] = [];
    for (const scenarioId of scenarioIds) {
      const scenes = getTeachingStoryScenes(scenarioId);
      expect(scenes.length).toBeGreaterThanOrEqual(4);
      expect(new Set(scenes.map((scene) => scene.image)).size).toBe(
        scenes.length,
      );
      expect(new Set(scenes.map((scene) => scene.place)).size).toBe(
        scenes.length,
      );
      if (new Set(scenes.map((scene) => scene.speaker)).size < 2) {
        singleSpeakerScenarioIds.push(scenarioId);
      }

      for (const scene of scenes) {
        expect(scene.image).toMatch(/\.(webp|png|svg)$/);
        expect(scene.portrait || scene.portraitOverride).toBeTruthy();
        expect(scene.dialogue.length).toBeGreaterThan(24);
        expect(scene.mentor.length).toBeGreaterThanOrEqual(24);
        expect(scene.goal.length).toBeGreaterThan(8);
        expect(scene.clues.length).toBeGreaterThanOrEqual(2);
        expect(scene.clues.every((clue) => clue.label && clue.result)).toBe(
          true,
        );
      }
    }
    expect(singleSpeakerScenarioIds).toEqual([]);
  });

  it("交付审查菱形的 Diff 与测试证据是真分流并在边界审查汇合", () => {
    expect(case13Scenario.projectMap.edges).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ from: "c13-delivery", to: "c13-diff" }),
        expect.objectContaining({ from: "c13-delivery", to: "c13-tests" }),
        expect.objectContaining({ from: "c13-diff", to: "c13-boundary" }),
        expect.objectContaining({ from: "c13-tests", to: "c13-boundary" }),
      ]),
    );
  });
});
