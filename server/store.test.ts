// @vitest-environment node

import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { currentSchemaVersion, openDatabase } from "./db.js";
import { LearningStore } from "./store.js";

const cleanup: Array<() => void> = [];

afterEach(() => {
  while (cleanup.length) cleanup.pop()?.();
});

describe("SQLite 学习记录", () => {
  it("从空库创建 schema 且迁移可重复执行", () => {
    const db = openDatabase(":memory:");
    cleanup.push(() => db.close());

    expect(currentSchemaVersion(db)).toBe(2);
    expect(() =>
      db.exec(
        "INSERT OR IGNORE INTO schema_migrations(version, applied_at) VALUES (1, 'existing')",
      ),
    ).not.toThrow();
  });

  it("服务重开后仍能恢复原始回答、提示和步骤", () => {
    const directory = mkdtempSync(join(tmpdir(), "code-quest-"));
    const path = join(directory, "learning.sqlite");
    cleanup.push(() => rmSync(directory, { recursive: true, force: true }));

    const firstDb = openDatabase(path);
    const firstStore = new LearningStore(firstDb);
    const diagnostic = firstStore.startDiagnostic();
    firstStore.saveDiagnosticBaseline(
      diagnostic.id,
      {
        firstChecks: ["看 Network", "看后端日志"],
        reason: "先确认请求有没有离开前端",
      },
      true,
    );
    const attempt = firstStore.startAttempt("canvas-save-persistence");
    firstStore.saveStep(attempt.id, "baseline-plan", {
      plan: "先复现，再沿数据流找断点",
    });
    firstStore.takeHint(attempt.id);
    firstDb.close();

    const secondDb = openDatabase(path);
    cleanup.push(() => secondDb.close());
    const secondStore = new LearningStore(secondDb);
    const restored = secondStore.getAttempt(attempt.id);
    const restoredDiagnostic = secondStore.getDiagnostic(diagnostic.id);

    expect(restored.hintLevel).toBe(1);
    expect(restored.steps["baseline-plan"].response).toEqual({
      plan: "先复现，再沿数据流找断点",
    });
    expect(restoredDiagnostic.baseline).toEqual({
      firstChecks: ["看 Network", "看后端日志"],
      reason: "先确认请求有没有离开前端",
    });
  });

  it("拒绝未知场景和不属于场景的步骤", () => {
    const db = openDatabase(":memory:");
    cleanup.push(() => db.close());
    const store = new LearningStore(db);

    expect(() => store.startAttempt("../../真实项目")).toThrow(
      "未知的练习场景",
    );

    const attempt = store.startAttempt("canvas-save-persistence");
    expect(() =>
      store.saveStep(attempt.id, "../../secret", { answer: "x" }),
    ).toThrow("该步骤不属于当前练习场景");
  });

  it("延迟变式复测必须先通关并等待 24 小时", () => {
    const db = openDatabase(":memory:");
    cleanup.push(() => db.close());
    const store = new LearningStore(db);

    expect(store.getTransferRetestStatus("canvas-save-persistence")).toEqual(
      expect.objectContaining({
        scenarioId: "avatar-persistence-retest",
        status: "prerequisite",
        delayHours: 24,
      }),
    );
    expect(() => store.startAttempt("avatar-persistence-retest")).toThrow(
      "先完成原始实战",
    );

    const source = store.startAttempt("canvas-save-persistence");
    const submittedAt = new Date("2026-07-13T08:00:00.000Z");
    db.prepare(
      `UPDATE attempts SET status = 'submitted', submitted_at = ? WHERE id = ?`,
    ).run(submittedAt.toISOString(), source.id);

    expect(
      store.getTransferRetestStatus(
        "canvas-save-persistence",
        new Date("2026-07-14T07:59:59.000Z"),
      ),
    ).toEqual(
      expect.objectContaining({
        status: "waiting",
        availableAt: "2026-07-14T08:00:00.000Z",
        remainingMs: 1000,
      }),
    );

    db.prepare("UPDATE attempts SET submitted_at = ? WHERE id = ?").run(
      new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString(),
      source.id,
    );
    expect(
      store.getTransferRetestStatus("canvas-save-persistence").status,
    ).toBe("available");
    expect(
      store.startTransferRetest("canvas-save-persistence").scenarioId,
    ).toBe("avatar-persistence-retest");
  });

  it("第 2 章在 24 小时后解锁独立的会议助手迁移复测", () => {
    const db = openDatabase(":memory:");
    cleanup.push(() => db.close());
    const store = new LearningStore(db);

    expect(store.getTransferRetestStatus("canvasstorm-product-brief")).toEqual(
      expect.objectContaining({
        scenarioId: "meeting-assistant-retest",
        status: "prerequisite",
        delayHours: 24,
      }),
    );
    expect(() =>
      store.startTransferRetest("canvasstorm-product-brief"),
    ).toThrow("先完成原始实战");

    const source = store.startAttempt("canvasstorm-product-brief");
    db.prepare(
      `UPDATE attempts SET status = 'submitted', submitted_at = ? WHERE id = ?`,
    ).run(new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString(), source.id);

    expect(
      store.getTransferRetestStatus("canvasstorm-product-brief").status,
    ).toBe("available");
    expect(
      store.startTransferRetest("canvasstorm-product-brief").scenarioId,
    ).toBe("meeting-assistant-retest");
  });

  it("第 3 章在 24 小时后解锁客服夜班会话迁移复测", () => {
    const db = openDatabase(":memory:");
    cleanup.push(() => db.close());
    const store = new LearningStore(db);

    expect(store.getTransferRetestStatus("identity-session-corridor")).toEqual(
      expect.objectContaining({
        scenarioId: "support-shift-session-retest",
        status: "prerequisite",
        delayHours: 24,
      }),
    );
    expect(() =>
      store.startTransferRetest("identity-session-corridor"),
    ).toThrow("先完成原始实战");

    const source = store.startAttempt("identity-session-corridor");
    db.prepare(
      `UPDATE attempts SET status = 'submitted', submitted_at = ? WHERE id = ?`,
    ).run(new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString(), source.id);

    expect(
      store.getTransferRetestStatus("identity-session-corridor").status,
    ).toBe("available");
    expect(
      store.startTransferRetest("identity-session-corridor").scenarioId,
    ).toBe("support-shift-session-retest");
  });

  it("第 4 章在 24 小时后解锁模型限流迁移复测", () => {
    const db = openDatabase(":memory:");
    cleanup.push(() => db.close());
    const store = new LearningStore(db);

    expect(store.getTransferRetestStatus("api-error-court")).toEqual(
      expect.objectContaining({
        scenarioId: "model-rate-limit-retest",
        status: "prerequisite",
        delayHours: 24,
      }),
    );
    expect(() => store.startTransferRetest("api-error-court")).toThrow(
      "先完成原始实战",
    );

    const source = store.startAttempt("api-error-court");
    db.prepare(
      `UPDATE attempts SET status = 'submitted', submitted_at = ? WHERE id = ?`,
    ).run(new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString(), source.id);

    expect(store.getTransferRetestStatus("api-error-court").status).toBe(
      "available",
    );
    expect(store.startTransferRetest("api-error-court").scenarioId).toBe(
      "model-rate-limit-retest",
    );
  });

  it("第 5 章在 24 小时后解锁 RAG 索引并发迁移复测", () => {
    const db = openDatabase(":memory:");
    cleanup.push(() => db.close());
    const store = new LearningStore(db);

    expect(store.getTransferRetestStatus("data-consistency-forge")).toEqual(
      expect.objectContaining({
        scenarioId: "rag-index-concurrency-retest",
        status: "prerequisite",
        delayHours: 24,
      }),
    );
    expect(() => store.startTransferRetest("data-consistency-forge")).toThrow(
      "先完成原始实战",
    );

    const source = store.startAttempt("data-consistency-forge");
    db.prepare(
      `UPDATE attempts SET status = 'submitted', submitted_at = ? WHERE id = ?`,
    ).run(new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString(), source.id);

    expect(store.getTransferRetestStatus("data-consistency-forge").status).toBe(
      "available",
    );
    expect(store.startTransferRetest("data-consistency-forge").scenarioId).toBe(
      "rag-index-concurrency-retest",
    );
  });

  it("第 6 章在 24 小时后解锁 AI 晨报性能迁移复测", () => {
    const db = openDatabase(":memory:");
    cleanup.push(() => db.close());
    const store = new LearningStore(db);

    expect(store.getTransferRetestStatus("performance-fog-lab")).toEqual(
      expect.objectContaining({
        scenarioId: "ai-briefing-latency-retest",
        status: "prerequisite",
        delayHours: 24,
      }),
    );
    expect(() => store.startTransferRetest("performance-fog-lab")).toThrow(
      "先完成原始实战",
    );

    const source = store.startAttempt("performance-fog-lab");
    db.prepare(
      `UPDATE attempts SET status = 'submitted', submitted_at = ? WHERE id = ?`,
    ).run(new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString(), source.id);

    expect(store.getTransferRetestStatus("performance-fog-lab").status).toBe(
      "available",
    );
    expect(store.startTransferRetest("performance-fog-lab").scenarioId).toBe(
      "ai-briefing-latency-retest",
    );
  });

  it("第 7 章在 24 小时后解锁模型密钥安全迁移复测", () => {
    const db = openDatabase(":memory:");
    cleanup.push(() => db.close());
    const store = new LearningStore(db);

    expect(store.getTransferRetestStatus("ai-api-key-vault")).toEqual(
      expect.objectContaining({
        scenarioId: "model-key-rotation-retest",
        status: "prerequisite",
        delayHours: 24,
      }),
    );
    expect(() => store.startTransferRetest("ai-api-key-vault")).toThrow(
      "先完成原始实战",
    );

    const source = store.startAttempt("ai-api-key-vault");
    db.prepare(
      `UPDATE attempts SET status = 'submitted', submitted_at = ? WHERE id = ?`,
    ).run(new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString(), source.id);

    expect(store.getTransferRetestStatus("ai-api-key-vault").status).toBe(
      "available",
    );
    expect(store.startTransferRetest("ai-api-key-vault").scenarioId).toBe(
      "model-key-rotation-retest",
    );
  });

  it("第 8 章在 24 小时后解锁引用可验证迁移复测", () => {
    const db = openDatabase(":memory:");
    cleanup.push(() => db.close());
    const store = new LearningStore(db);

    expect(store.getTransferRetestStatus("hallucination-mirror-hall")).toEqual(
      expect.objectContaining({
        scenarioId: "citation-grounding-retest",
        status: "prerequisite",
        delayHours: 24,
      }),
    );
    expect(() =>
      store.startTransferRetest("hallucination-mirror-hall"),
    ).toThrow("先完成原始实战");

    const source = store.startAttempt("hallucination-mirror-hall");
    db.prepare(
      `UPDATE attempts SET status = 'submitted', submitted_at = ? WHERE id = ?`,
    ).run(new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString(), source.id);

    expect(
      store.getTransferRetestStatus("hallucination-mirror-hall").status,
    ).toBe("available");
    expect(
      store.startTransferRetest("hallucination-mirror-hall").scenarioId,
    ).toBe("citation-grounding-retest");
  });

  it("第 9 章在 24 小时后解锁 RAG 检索错配迁移复测", () => {
    const db = openDatabase(":memory:");
    cleanup.push(() => db.close());
    const store = new LearningStore(db);

    expect(store.getTransferRetestStatus("rag-knowledge-maze")).toEqual(
      expect.objectContaining({
        scenarioId: "retrieval-mismatch-retest",
        status: "prerequisite",
        delayHours: 24,
      }),
    );
    expect(() => store.startTransferRetest("rag-knowledge-maze")).toThrow(
      "先完成原始实战",
    );

    const source = store.startAttempt("rag-knowledge-maze");
    db.prepare(
      `UPDATE attempts SET status = 'submitted', submitted_at = ? WHERE id = ?`,
    ).run(new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString(), source.id);

    expect(store.getTransferRetestStatus("rag-knowledge-maze").status).toBe(
      "available",
    );
    expect(store.startTransferRetest("rag-knowledge-maze").scenarioId).toBe(
      "retrieval-mismatch-retest",
    );
  });

  it("第 10 章在 24 小时后解锁 Agent 工具越权迁移复测", () => {
    const db = openDatabase(":memory:");
    cleanup.push(() => db.close());
    const store = new LearningStore(db);

    expect(store.getTransferRetestStatus("agent-tool-tower")).toEqual(
      expect.objectContaining({
        scenarioId: "tool-boundary-retest",
        status: "prerequisite",
        delayHours: 24,
      }),
    );
    expect(() => store.startTransferRetest("agent-tool-tower")).toThrow(
      "先完成原始实战",
    );

    const source = store.startAttempt("agent-tool-tower");
    db.prepare(
      `UPDATE attempts SET status = 'submitted', submitted_at = ? WHERE id = ?`,
    ).run(new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString(), source.id);

    expect(store.getTransferRetestStatus("agent-tool-tower").status).toBe(
      "available",
    );
    expect(store.startTransferRetest("agent-tool-tower").scenarioId).toBe(
      "tool-boundary-retest",
    );
  });

  it("第 11 章在 24 小时后解锁验收证据迁移复测", () => {
    const db = openDatabase(":memory:");
    cleanup.push(() => db.close());
    const store = new LearningStore(db);

    expect(store.getTransferRetestStatus("verification-trial-arena")).toEqual(
      expect.objectContaining({
        scenarioId: "verification-proof-retest",
        status: "prerequisite",
        delayHours: 24,
      }),
    );
    expect(() => store.startTransferRetest("verification-trial-arena")).toThrow(
      "先完成原始实战",
    );

    const source = store.startAttempt("verification-trial-arena");
    db.prepare(
      `UPDATE attempts SET status = 'submitted', submitted_at = ? WHERE id = ?`,
    ).run(new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString(), source.id);

    expect(
      store.getTransferRetestStatus("verification-trial-arena").status,
    ).toBe("available");
    expect(
      store.startTransferRetest("verification-trial-arena").scenarioId,
    ).toBe("verification-proof-retest");
  });

  it("第 12 章在 24 小时后解锁 Agent 委托契约迁移复测", () => {
    const db = openDatabase(":memory:");
    cleanup.push(() => db.close());
    const store = new LearningStore(db);

    expect(store.getTransferRetestStatus("agent-brief-forge")).toEqual(
      expect.objectContaining({
        scenarioId: "brief-contract-retest",
        status: "prerequisite",
        delayHours: 24,
      }),
    );
    expect(() => store.startTransferRetest("agent-brief-forge")).toThrow(
      "先完成原始实战",
    );

    const source = store.startAttempt("agent-brief-forge");
    db.prepare(
      `UPDATE attempts SET status = 'submitted', submitted_at = ? WHERE id = ?`,
    ).run(new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString(), source.id);

    expect(store.getTransferRetestStatus("agent-brief-forge").status).toBe(
      "available",
    );
    expect(store.startTransferRetest("agent-brief-forge").scenarioId).toBe(
      "brief-contract-retest",
    );
  });

  it("第 13 章在 24 小时后解锁交付证据迁移复测", () => {
    const db = openDatabase(":memory:");
    cleanup.push(() => db.close());
    const store = new LearningStore(db);

    expect(store.getTransferRetestStatus("delivery-review-court")).toEqual(
      expect.objectContaining({
        scenarioId: "review-evidence-retest",
        status: "prerequisite",
        delayHours: 24,
      }),
    );
    expect(() => store.startTransferRetest("delivery-review-court")).toThrow(
      "先完成原始实战",
    );

    const source = store.startAttempt("delivery-review-court");
    db.prepare(
      `UPDATE attempts SET status = 'submitted', submitted_at = ? WHERE id = ?`,
    ).run(new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString(), source.id);

    expect(store.getTransferRetestStatus("delivery-review-court").status).toBe(
      "available",
    );
    expect(store.startTransferRetest("delivery-review-court").scenarioId).toBe(
      "review-evidence-retest",
    );
  });

  it("第 14 章在 24 小时后解锁上线门禁迁移复测", () => {
    const db = openDatabase(":memory:");
    cleanup.push(() => db.close());
    const store = new LearningStore(db);

    expect(store.getTransferRetestStatus("release-readiness-gate")).toEqual(
      expect.objectContaining({
        scenarioId: "release-proof-retest",
        status: "prerequisite",
        delayHours: 24,
      }),
    );
    expect(() => store.startTransferRetest("release-readiness-gate")).toThrow(
      "先完成原始实战",
    );

    const source = store.startAttempt("release-readiness-gate");
    db.prepare(
      `UPDATE attempts SET status = 'submitted', submitted_at = ? WHERE id = ?`,
    ).run(new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString(), source.id);

    expect(store.getTransferRetestStatus("release-readiness-gate").status).toBe(
      "available",
    );
    expect(store.startTransferRetest("release-readiness-gate").scenarioId).toBe(
      "release-proof-retest",
    );
  });

  it("第 15 章在 24 小时后解锁面试表达迁移复测", () => {
    const db = openDatabase(":memory:");
    cleanup.push(() => db.close());
    const store = new LearningStore(db);

    expect(store.getTransferRetestStatus("interview-answer-forge")).toEqual(
      expect.objectContaining({
        scenarioId: "interview-proof-retest",
        status: "prerequisite",
        delayHours: 24,
      }),
    );
    expect(() => store.startTransferRetest("interview-answer-forge")).toThrow(
      "先完成原始实战",
    );

    const source = store.startAttempt("interview-answer-forge");
    db.prepare(
      `UPDATE attempts SET status = 'submitted', submitted_at = ? WHERE id = ?`,
    ).run(new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString(), source.id);

    expect(store.getTransferRetestStatus("interview-answer-forge").status).toBe(
      "available",
    );
    expect(store.startTransferRetest("interview-answer-forge").scenarioId).toBe(
      "interview-proof-retest",
    );
  });

  it("零提示延迟复测只形成可审查的 L3 候选证据", () => {
    const db = openDatabase(":memory:");
    cleanup.push(() => db.close());
    const store = new LearningStore(db);
    const source = store.startAttempt("canvas-save-persistence");
    db.prepare(
      `UPDATE attempts SET status = 'submitted', submitted_at = ? WHERE id = ?`,
    ).run(new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString(), source.id);
    const retest = store.startTransferRetest("canvas-save-persistence");

    for (const stepId of [
      "independent-diagnosis",
      "evidence-plan",
      "agent-brief",
      "verification-reflection",
    ]) {
      store.saveStep(retest.id, stepId, { text: `独立作答：${stepId}` });
    }
    store.recordVerification(retest.id, {
      status: "passed",
      observedAt: new Date().toISOString(),
      report: { summary: { passed: 2, failed: 0 }, tests: [] },
    });
    store.submitAttempt(retest.id);

    const evidence = store
      .getEvidence()
      .filter((entry) => entry.attemptId === retest.id);
    expect(evidence).toHaveLength(3);
    expect(evidence).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          evidenceType: "delayed_transfer",
          levelCandidate: 3,
          reason: expect.objectContaining({
            delayedTransfer: true,
            limitation: expect.stringContaining("候选证据"),
          }),
        }),
      ]),
    );
    expect(
      store.getTransferRetestStatus("canvas-save-persistence").status,
    ).toBe("completed");
  });
});
