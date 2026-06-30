import { randomUUID } from "node:crypto";
import type { LearningDatabase } from "./db.js";
import {
  ContractError,
  requireScenario,
  requireScenarioStep,
} from "./scenarios.js";
import type { SafeVerificationReport } from "./report.js";

const LEARNER_ID = "local-learner";

type AttemptRow = {
  id: string;
  learner_id: string;
  scenario_id: string;
  status: "active" | "submitted";
  hint_level: number;
  verification_status: "not_run" | "failed" | "passed" | "invalid_report";
  started_at: string;
  submitted_at: string | null;
};

type StepRow = {
  step_id: string;
  response_json: string;
  saved_at: string;
};

export class LearningStore {
  constructor(private readonly db: LearningDatabase) {
    this.ensureLearner();
  }

  private ensureLearner() {
    const now = new Date().toISOString();
    this.db
      .prepare(
        `INSERT INTO learner_profiles (id, created_at, updated_at)
         VALUES (?, ?, ?)
         ON CONFLICT(id) DO UPDATE SET updated_at = excluded.updated_at`,
      )
      .run(LEARNER_ID, now, now);
  }

  startDiagnostic() {
    const latest = this.db
      .prepare(
        `SELECT * FROM diagnostic_sessions
         WHERE learner_id = ?
         ORDER BY started_at DESC LIMIT 1`,
      )
      .get(LEARNER_ID);
    if (latest) return this.deserializeDiagnostic(latest);

    const id = randomUUID();
    const now = new Date().toISOString();
    this.db
      .prepare(
        `INSERT INTO diagnostic_sessions
         (id, learner_id, status, baseline_json, started_at)
         VALUES (?, ?, 'active', '{}', ?)`,
      )
      .run(id, LEARNER_ID, now);
    return this.getDiagnostic(id);
  }

  getDiagnostic(id: string) {
    const row = this.db
      .prepare("SELECT * FROM diagnostic_sessions WHERE id = ?")
      .get(id);
    if (!row) throw new ContractError("NOT_FOUND", "诊断会话不存在");
    return this.deserializeDiagnostic(row);
  }

  saveDiagnosticBaseline(id: string, baseline: unknown, completed: boolean) {
    this.getDiagnostic(id);
    const now = new Date().toISOString();
    this.db
      .prepare(
        `UPDATE diagnostic_sessions
         SET baseline_json = ?, status = ?, completed_at = ?
         WHERE id = ?`,
      )
      .run(
        JSON.stringify(baseline),
        completed ? "completed" : "active",
        completed ? now : null,
        id,
      );
    return this.getDiagnostic(id);
  }

  private deserializeDiagnostic(row: Record<string, unknown>) {
    return {
      id: String(row.id),
      status: String(row.status),
      baseline: JSON.parse(String(row.baseline_json)),
      startedAt: String(row.started_at),
      completedAt: row.completed_at ? String(row.completed_at) : null,
    };
  }

  startAttempt(scenarioId: string) {
    requireScenario(scenarioId);
    const latest = this.db
      .prepare(
        `SELECT * FROM attempts
         WHERE learner_id = ? AND scenario_id = ?
         ORDER BY started_at DESC LIMIT 1`,
      )
      .get(LEARNER_ID, scenarioId) as AttemptRow | undefined;
    if (latest) return this.getAttempt(latest.id);

    const id = randomUUID();
    this.db
      .prepare(
        `INSERT INTO attempts
         (id, learner_id, scenario_id, status, started_at)
         VALUES (?, ?, ?, 'active', ?)`,
      )
      .run(id, LEARNER_ID, scenarioId, new Date().toISOString());
    return this.getAttempt(id);
  }

  getAttempt(id: string) {
    const row = this.db
      .prepare("SELECT * FROM attempts WHERE id = ?")
      .get(id) as AttemptRow | undefined;
    if (!row) throw new ContractError("NOT_FOUND", "练习记录不存在");

    const steps = this.db
      .prepare(
        `SELECT step_id, response_json, saved_at
         FROM step_responses WHERE attempt_id = ? ORDER BY saved_at`,
      )
      .all(id) as StepRow[];

    return {
      id: row.id,
      scenarioId: row.scenario_id,
      status: row.status,
      hintLevel: row.hint_level,
      verificationStatus: row.verification_status,
      startedAt: row.started_at,
      submittedAt: row.submitted_at,
      steps: Object.fromEntries(
        steps.map((step) => [
          step.step_id,
          {
            response: JSON.parse(step.response_json),
            savedAt: step.saved_at,
          },
        ]),
      ),
    };
  }

  saveStep(attemptId: string, stepId: string, response: unknown) {
    const attempt = this.getAttempt(attemptId);
    if (attempt.status !== "active") {
      throw new ContractError("ATTEMPT_CLOSED", "已提交的练习不能继续修改");
    }
    requireScenarioStep(attempt.scenarioId, stepId);
    const now = new Date().toISOString();
    this.db
      .prepare(
        `INSERT INTO step_responses
         (attempt_id, step_id, response_json, saved_at)
         VALUES (?, ?, ?, ?)
         ON CONFLICT(attempt_id, step_id)
         DO UPDATE SET response_json = excluded.response_json,
                       saved_at = excluded.saved_at`,
      )
      .run(attemptId, stepId, JSON.stringify(response), now);
    return this.getAttempt(attemptId);
  }

  takeHint(attemptId: string) {
    const attempt = this.getAttempt(attemptId);
    if (attempt.status !== "active") {
      throw new ContractError("ATTEMPT_CLOSED", "已提交的练习不能领取提示");
    }
    const nextLevel = Math.min(3, attempt.hintLevel + 1);
    this.db
      .prepare("UPDATE attempts SET hint_level = ? WHERE id = ?")
      .run(nextLevel, attemptId);
    return this.getAttempt(attemptId);
  }

  recordVerification(attemptId: string, verification: SafeVerificationReport) {
    const attempt = this.getAttempt(attemptId);
    if (attempt.status !== "active") {
      throw new ContractError("ATTEMPT_CLOSED", "已提交的练习不能继续验证");
    }
    this.db.exec("BEGIN IMMEDIATE");
    try {
      this.db
        .prepare(
          `INSERT INTO verification_events
           (attempt_id, status, report_json, observed_at)
           VALUES (?, ?, ?, ?)`,
        )
        .run(
          attemptId,
          verification.status,
          JSON.stringify(verification.report),
          verification.observedAt,
        );
      this.db
        .prepare("UPDATE attempts SET verification_status = ? WHERE id = ?")
        .run(verification.status, attemptId);
      this.db.exec("COMMIT");
    } catch (error) {
      this.db.exec("ROLLBACK");
      throw error;
    }
    return this.getAttempt(attemptId);
  }

  submitAttempt(attemptId: string) {
    const attempt = this.getAttempt(attemptId);
    if (attempt.status !== "active") return attempt;
    if (attempt.verificationStatus !== "passed") {
      throw new ContractError(
        "VERIFICATION_REQUIRED",
        "实际测试尚未通过，不能结算能力证据",
      );
    }

    const requiredSteps = [
      "inspect-evidence",
      "trace-data-flow",
      "agent-brief",
      "delivery-review",
      "causal-explanation",
    ];
    const missing = requiredSteps.filter((step) => !attempt.steps[step]);
    if (missing.length) {
      throw new ContractError(
        "INCOMPLETE_ATTEMPT",
        `仍缺少 ${missing.length} 项学习证据`,
      );
    }

    const now = new Date().toISOString();
    const levelCandidate = attempt.hintLevel >= 3 ? 1 : 2;
    const reason = {
      behaviorVerified: true,
      explanationCaptured: true,
      hintLevel: attempt.hintLevel,
      limitation:
        "仅形成引导完成候选证据；尚未经过延迟变式复测与解释语义审查，不能判定 L3。",
    };

    this.db.exec("BEGIN IMMEDIATE");
    try {
      for (const skillId of ["api", "database", "debugging"]) {
        this.db
          .prepare(
            `INSERT INTO evidence_records
             (attempt_id, skill_id, evidence_type, level_candidate,
              reason_json, created_at)
             VALUES (?, ?, 'guided_practical', ?, ?, ?)`,
          )
          .run(attemptId, skillId, levelCandidate, JSON.stringify(reason), now);
      }
      this.db
        .prepare(
          `UPDATE attempts SET status = 'submitted', submitted_at = ?
           WHERE id = ?`,
        )
        .run(now, attemptId);
      this.db.exec("COMMIT");
    } catch (error) {
      this.db.exec("ROLLBACK");
      throw error;
    }
    return this.getAttempt(attemptId);
  }

  getEvidence() {
    const rows = this.db
      .prepare(
        `SELECT e.*, a.scenario_id
         FROM evidence_records e
         JOIN attempts a ON a.id = e.attempt_id
         WHERE a.learner_id = ?
         ORDER BY e.created_at DESC`,
      )
      .all(LEARNER_ID);
    return rows.map((row) => ({
      id: Number(row.id),
      attemptId: String(row.attempt_id),
      scenarioId: String(row.scenario_id),
      skillId: String(row.skill_id),
      evidenceType: String(row.evidence_type),
      levelCandidate: Number(row.level_candidate),
      reason: JSON.parse(String(row.reason_json)),
      createdAt: String(row.created_at),
    }));
  }
}
