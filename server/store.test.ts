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
});
