import { describe, expect, it } from "vitest";
import {
  getTransferRetestConfig,
  transferRetestSourceIds,
} from "./transferRetests";

describe("延迟迁移复测配置", () => {
  it("前十五章使用不同业务、地图与镜头", () => {
    const first = getTransferRetestConfig("canvas-save-persistence");
    const second = getTransferRetestConfig("canvasstorm-product-brief");
    const third = getTransferRetestConfig("identity-session-corridor");
    const fourth = getTransferRetestConfig("api-error-court");
    const fifth = getTransferRetestConfig("data-consistency-forge");
    const sixth = getTransferRetestConfig("performance-fog-lab");
    const seventh = getTransferRetestConfig("ai-api-key-vault");
    const eighth = getTransferRetestConfig("hallucination-mirror-hall");
    const ninth = getTransferRetestConfig("rag-knowledge-maze");
    const tenth = getTransferRetestConfig("agent-tool-tower");
    const eleventh = getTransferRetestConfig("verification-trial-arena");
    const twelfth = getTransferRetestConfig("agent-brief-forge");
    const thirteenth = getTransferRetestConfig("delivery-review-court");
    const fourteenth = getTransferRetestConfig("release-readiness-gate");
    const fifteenth = getTransferRetestConfig("interview-answer-forge");

    expect(transferRetestSourceIds).toHaveLength(15);
    expect(second.scenarioId).toBe("meeting-assistant-retest");
    expect(second.caseTitle).toContain("AI 会议助手");
    expect(third.scenarioId).toBe("support-shift-session-retest");
    expect(third.caseTitle).toContain("认证服务重启");
    expect(fourth.scenarioId).toBe("model-rate-limit-retest");
    expect(fourth.caseTitle).toContain("上游 429");
    expect(fifth.scenarioId).toBe("rag-index-concurrency-retest");
    expect(fifth.caseTitle).toContain("一次上传");
    expect(sixth.scenarioId).toBe("ai-briefing-latency-retest");
    expect(sixth.caseTitle).toContain("第一句话");
    expect(seventh.scenarioId).toBe("model-key-rotation-retest");
    expect(seventh.caseTitle).toContain("密钥轮换");
    expect(eighth.scenarioId).toBe("citation-grounding-retest");
    expect(eighth.caseTitle).toContain("不存在的退款条款");
    expect(ninth.scenarioId).toBe("retrieval-mismatch-retest");
    expect(ninth.caseTitle).toContain("旧版本规则");
    expect(tenth.scenarioId).toBe("tool-boundary-retest");
    expect(tenth.caseTitle).toContain("越权");
    expect(eleventh.scenarioId).toBe("verification-proof-retest");
    expect(eleventh.caseTitle).toContain("全绿");
    expect(twelfth.scenarioId).toBe("brief-contract-retest");
    expect(twelfth.caseTitle).toContain("委托");
    expect(thirteenth.scenarioId).toBe("review-evidence-retest");
    expect(thirteenth.caseTitle).toContain("合并");
    expect(fourteenth.scenarioId).toBe("release-proof-retest");
    expect(fourteenth.caseTitle).toContain("上线");
    expect(fifteenth.scenarioId).toBe("interview-proof-retest");
    expect(fifteenth.caseTitle).toContain("可信");
    expect(
      new Set([
        first.mapVariant,
        second.mapVariant,
        third.mapVariant,
        fourth.mapVariant,
        fifth.mapVariant,
        sixth.mapVariant,
        seventh.mapVariant,
        eighth.mapVariant,
        ninth.mapVariant,
        tenth.mapVariant,
        eleventh.mapVariant,
        twelfth.mapVariant,
        thirteenth.mapVariant,
        fourteenth.mapVariant,
        fifteenth.mapVariant,
      ]),
    ).toHaveLength(15);
    expect(
      new Set([
        first.cameraVariant,
        second.cameraVariant,
        third.cameraVariant,
        fourth.cameraVariant,
        fifth.cameraVariant,
        sixth.cameraVariant,
        seventh.cameraVariant,
        eighth.cameraVariant,
        ninth.cameraVariant,
        tenth.cameraVariant,
        eleventh.cameraVariant,
        twelfth.cameraVariant,
        thirteenth.cameraVariant,
        fourteenth.cameraVariant,
        fifteenth.cameraVariant,
      ]),
    ).toHaveLength(15);
    expect(second.command).toContain("meeting-assistant-retest");
    expect(third.command).toContain("support-shift-session-retest");
    expect(fourth.command).toContain("model-rate-limit-retest");
    expect(fifth.command).toContain("rag-index-concurrency-retest");
    expect(sixth.command).toContain("ai-briefing-latency-retest");
    expect(seventh.command).toContain("model-key-rotation-retest");
    expect(eighth.command).toContain("citation-grounding-retest");
    expect(ninth.command).toContain("retrieval-mismatch-retest");
    expect(tenth.command).toContain("tool-boundary-retest");
    expect(eleventh.command).toContain("verification-proof-retest");
    expect(twelfth.command).toContain("brief-contract-retest");
    expect(thirteenth.command).toContain("review-evidence-retest");
    expect(fourteenth.command).toContain("release-proof-retest");
    expect(fifteenth.command).toContain("interview-proof-retest");
    expect(second.stages.flatMap((stage) => stage.artifactIds)).toEqual(
      expect.arrayContaining(["request", "candidates", "session"]),
    );
    expect(third.stages.flatMap((stage) => stage.artifactIds)).toEqual(
      expect.arrayContaining(["repository", "refresh-network", "delivery"]),
    );
    expect(fourth.stages.flatMap((stage) => stage.artifactIds)).toEqual(
      expect.arrayContaining([
        "request-network",
        "upstream-response",
        "policy",
      ]),
    );
    expect(fifth.stages.flatMap((stage) => stage.artifactIds)).toEqual(
      expect.arrayContaining([
        "upload-network",
        "worker-timeline",
        "duplicate-chunks",
        "schema",
      ]),
    );
    expect(sixth.stages.flatMap((stage) => stage.artifactIds)).toEqual(
      expect.arrayContaining([
        "first-network",
        "server-timing",
        "second-network",
        "render-profile",
      ]),
    );
    expect(seventh.stages.flatMap((stage) => stage.artifactIds)).toEqual(
      expect.arrayContaining(["frontend-network", "env-config", "upstream"]),
    );
    expect(eighth.stages.flatMap((stage) => stage.artifactIds)).toEqual(
      expect.arrayContaining(["answer", "source-doc", "citation-check"]),
    );
    expect(ninth.stages.flatMap((stage) => stage.artifactIds)).toEqual(
      expect.arrayContaining(["chunks", "matches", "answer"]),
    );
    expect(tenth.stages.flatMap((stage) => stage.artifactIds)).toEqual(
      expect.arrayContaining(["agent-request", "registry", "audit-log"]),
    );
    expect(eleventh.stages.flatMap((stage) => stage.artifactIds)).toEqual(
      expect.arrayContaining(["failing-before", "passing-stale", "logs"]),
    );
    expect(twelfth.stages.flatMap((stage) => stage.artifactIds)).toEqual(
      expect.arrayContaining(["request", "vague-brief", "validator"]),
    );
    expect(thirteenth.stages.flatMap((stage) => stage.artifactIds)).toEqual(
      expect.arrayContaining([
        "delivery-note",
        "test-evidence",
        "browser-checks",
      ]),
    );
    expect(fourteenth.stages.flatMap((stage) => stage.artifactIds)).toEqual(
      expect.arrayContaining([
        "release-plan",
        "backup",
        "monitoring",
        "rollback",
      ]),
    );
    expect(fifteenth.stages.flatMap((stage) => stage.artifactIds)).toEqual(
      expect.arrayContaining([
        "story-bank",
        "star-draft",
        "tradeoff",
        "follow-ups",
      ]),
    );
  });
});
