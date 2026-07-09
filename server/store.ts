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

const BACKUP_FORMAT = "code-quest-learning-backup";
const BACKUP_FORMAT_VERSION = 1;

const tableNames = [
  "learner_profiles",
  "diagnostic_sessions",
  "attempts",
  "step_responses",
  "verification_events",
  "evidence_records",
  "teaching_progress",
] as const;

type BackupTableName = (typeof tableNames)[number];
type BackupRow = Record<string, unknown>;

type LearningBackup = {
  format: typeof BACKUP_FORMAT;
  formatVersion: typeof BACKUP_FORMAT_VERSION;
  schemaVersion: number;
  exportedAt: string;
  tables: Record<BackupTableName, BackupRow[]>;
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

  /** 获取教学步骤进度 */
  getTeachingProgress(attemptId: string) {
    this.getAttempt(attemptId); // 验证 attempt 存在
    const rows = this.db
      .prepare(
        `SELECT step_id, completed, teaching_response_json,
                remediation_events_json, updated_at
         FROM teaching_progress
         WHERE attempt_id = ?
         ORDER BY updated_at`,
      )
      .all(attemptId) as Array<{
      step_id: string;
      completed: number;
      teaching_response_json: string;
      remediation_events_json: string;
      updated_at: string;
    }>;

    return rows.map((row) => ({
      stepId: row.step_id,
      completed: row.completed === 1,
      teachingResponse: JSON.parse(row.teaching_response_json),
      remediationEvents: JSON.parse(row.remediation_events_json),
      updatedAt: row.updated_at,
    }));
  }

  /** 保存教学步骤进度 */
  saveTeachingProgress(
    attemptId: string,
    stepId: string,
    response: unknown,
    completed: boolean,
  ) {
    this.getAttempt(attemptId); // 验证 attempt 存在
    const now = new Date().toISOString();
    const existing = this.db
      .prepare(
        `SELECT teaching_response_json FROM teaching_progress
         WHERE attempt_id = ? AND step_id = ?`,
      )
      .get(attemptId, stepId) as { teaching_response_json: string } | undefined;

    const existingResponse = existing
      ? JSON.parse(existing.teaching_response_json)
      : {};
    const mergedResponse = { ...existingResponse, ...(response as object) };

    this.db
      .prepare(
        `INSERT INTO teaching_progress
         (attempt_id, step_id, completed, teaching_response_json,
          remediation_events_json, updated_at)
         VALUES (?, ?, ?, ?, '[]', ?)
         ON CONFLICT(attempt_id, step_id)
         DO UPDATE SET completed = excluded.completed,
                       teaching_response_json = excluded.teaching_response_json,
                       updated_at = excluded.updated_at`,
      )
      .run(
        attemptId,
        stepId,
        completed ? 1 : 0,
        JSON.stringify(mergedResponse),
        now,
      );
    return this.getTeachingProgress(attemptId);
  }

  /** 记录补课事件 */
  recordRemediation(attemptId: string, stepId: string, trigger: string) {
    this.getAttempt(attemptId);
    const now = new Date().toISOString();
    const existing = this.db
      .prepare(
        `SELECT remediation_events_json FROM teaching_progress
         WHERE attempt_id = ? AND step_id = ?`,
      )
      .get(attemptId, stepId) as
      { remediation_events_json: string } | undefined;

    const events = existing ? JSON.parse(existing.remediation_events_json) : [];
    events.push({ trigger, timestamp: now });

    this.db
      .prepare(
        `INSERT INTO teaching_progress
         (attempt_id, step_id, completed, teaching_response_json,
          remediation_events_json, updated_at)
         VALUES (?, ?, 0, '{}', ?, ?)
         ON CONFLICT(attempt_id, step_id)
         DO UPDATE SET remediation_events_json = excluded.remediation_events_json,
                       updated_at = excluded.updated_at`,
      )
      .run(attemptId, stepId, JSON.stringify(events), now);
    return this.getTeachingProgress(attemptId);
  }

  /** 重置教学进度 */
  resetTeachingProgress(attemptId: string) {
    this.getAttempt(attemptId);
    this.db
      .prepare("DELETE FROM teaching_progress WHERE attempt_id = ?")
      .run(attemptId);
    return [];
  }

  exportLearningBackup(schemaVersion: number): LearningBackup {
    return {
      format: BACKUP_FORMAT,
      formatVersion: BACKUP_FORMAT_VERSION,
      schemaVersion,
      exportedAt: new Date().toISOString(),
      tables: {
        learner_profiles: this.rows(
          "SELECT id, created_at, updated_at FROM learner_profiles ORDER BY id",
        ),
        diagnostic_sessions: this.rows(
          `SELECT id, learner_id, status, baseline_json, started_at, completed_at
           FROM diagnostic_sessions ORDER BY started_at, id`,
        ),
        attempts: this.rows(
          `SELECT id, learner_id, scenario_id, status, hint_level,
                  verification_status, started_at, submitted_at
           FROM attempts ORDER BY started_at, id`,
        ),
        step_responses: this.rows(
          `SELECT attempt_id, step_id, response_json, saved_at
           FROM step_responses ORDER BY saved_at, attempt_id, step_id`,
        ),
        verification_events: this.rows(
          `SELECT id, attempt_id, status, report_json, observed_at
           FROM verification_events ORDER BY id`,
        ),
        evidence_records: this.rows(
          `SELECT id, attempt_id, skill_id, evidence_type, level_candidate,
                  reason_json, created_at
           FROM evidence_records ORDER BY id`,
        ),
        teaching_progress: this.rows(
          `SELECT attempt_id, step_id, completed, teaching_response_json,
                  remediation_events_json, updated_at
           FROM teaching_progress ORDER BY updated_at, attempt_id, step_id`,
        ),
      },
    };
  }

  importLearningBackup(input: unknown) {
    const backup = parseLearningBackup(input);
    const attemptScenarioById = new Map<string, string>();

    for (const row of backup.tables.learner_profiles) {
      if (stringField(row, "id") !== LEARNER_ID) {
        throw new ContractError("INVALID_BACKUP", "备份只能恢复本地学习者记录");
      }
    }

    for (const row of backup.tables.diagnostic_sessions) {
      ensureLocalLearner(row);
      const status = stringField(row, "status");
      if (!["active", "completed"].includes(status)) {
        throw new ContractError("INVALID_BACKUP", "诊断状态不合法");
      }
      ensureJsonField(row, "baseline_json");
    }

    for (const row of backup.tables.attempts) {
      ensureLocalLearner(row);
      const scenarioId = stringField(row, "scenario_id");
      requireScenario(scenarioId);
      const status = stringField(row, "status");
      const verificationStatus = stringField(row, "verification_status");
      if (!["active", "submitted"].includes(status)) {
        throw new ContractError("INVALID_BACKUP", "练习状态不合法");
      }
      if (
        !["not_run", "failed", "passed", "invalid_report"].includes(
          verificationStatus,
        )
      ) {
        throw new ContractError("INVALID_BACKUP", "验证状态不合法");
      }
      const hintLevel = numberField(row, "hint_level");
      if (!Number.isInteger(hintLevel) || hintLevel < 0 || hintLevel > 3) {
        throw new ContractError("INVALID_BACKUP", "提示等级不合法");
      }
      attemptScenarioById.set(stringField(row, "id"), scenarioId);
    }

    for (const row of backup.tables.step_responses) {
      const scenarioId = attemptScenarioById.get(
        stringField(row, "attempt_id"),
      );
      if (!scenarioId) {
        throw new ContractError("INVALID_BACKUP", "步骤缺少对应练习记录");
      }
      requireScenarioStep(scenarioId, stringField(row, "step_id"));
      ensureJsonField(row, "response_json");
    }

    for (const row of backup.tables.verification_events) {
      if (!attemptScenarioById.has(stringField(row, "attempt_id"))) {
        throw new ContractError("INVALID_BACKUP", "验证事件缺少对应练习记录");
      }
      ensureJsonField(row, "report_json");
    }

    for (const row of backup.tables.evidence_records) {
      if (!attemptScenarioById.has(stringField(row, "attempt_id"))) {
        throw new ContractError("INVALID_BACKUP", "能力证据缺少对应练习记录");
      }
      const level = numberField(row, "level_candidate");
      if (!Number.isInteger(level) || level < 0 || level > 5) {
        throw new ContractError("INVALID_BACKUP", "能力等级候选不合法");
      }
      ensureJsonField(row, "reason_json");
    }

    for (const row of backup.tables.teaching_progress) {
      if (!attemptScenarioById.has(stringField(row, "attempt_id"))) {
        throw new ContractError("INVALID_BACKUP", "教学进度缺少对应练习记录");
      }
      const completed = numberField(row, "completed");
      if (![0, 1].includes(completed)) {
        throw new ContractError("INVALID_BACKUP", "教学完成状态不合法");
      }
      ensureJsonField(row, "teaching_response_json");
      ensureJsonField(row, "remediation_events_json");
    }

    this.db.exec("BEGIN IMMEDIATE");
    try {
      for (const row of backup.tables.learner_profiles) {
        this.db
          .prepare(
            `INSERT INTO learner_profiles (id, created_at, updated_at)
             VALUES (?, ?, ?)
             ON CONFLICT(id) DO UPDATE SET
               created_at = excluded.created_at,
               updated_at = excluded.updated_at`,
          )
          .run(
            stringField(row, "id"),
            stringField(row, "created_at"),
            stringField(row, "updated_at"),
          );
      }

      for (const row of backup.tables.diagnostic_sessions) {
        this.db
          .prepare(
            `INSERT INTO diagnostic_sessions
             (id, learner_id, status, baseline_json, started_at, completed_at)
             VALUES (?, ?, ?, ?, ?, ?)
             ON CONFLICT(id) DO UPDATE SET
               learner_id = excluded.learner_id,
               status = excluded.status,
               baseline_json = excluded.baseline_json,
               started_at = excluded.started_at,
               completed_at = excluded.completed_at`,
          )
          .run(
            stringField(row, "id"),
            stringField(row, "learner_id"),
            stringField(row, "status"),
            stringField(row, "baseline_json"),
            stringField(row, "started_at"),
            nullableStringField(row, "completed_at"),
          );
      }

      for (const row of backup.tables.attempts) {
        this.db
          .prepare(
            `INSERT INTO attempts
             (id, learner_id, scenario_id, status, hint_level,
              verification_status, started_at, submitted_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)
             ON CONFLICT(id) DO UPDATE SET
               learner_id = excluded.learner_id,
               scenario_id = excluded.scenario_id,
               status = excluded.status,
               hint_level = excluded.hint_level,
               verification_status = excluded.verification_status,
               started_at = excluded.started_at,
               submitted_at = excluded.submitted_at`,
          )
          .run(
            stringField(row, "id"),
            stringField(row, "learner_id"),
            stringField(row, "scenario_id"),
            stringField(row, "status"),
            numberField(row, "hint_level"),
            stringField(row, "verification_status"),
            stringField(row, "started_at"),
            nullableStringField(row, "submitted_at"),
          );
      }

      for (const row of backup.tables.step_responses) {
        this.db
          .prepare(
            `INSERT INTO step_responses
             (attempt_id, step_id, response_json, saved_at)
             VALUES (?, ?, ?, ?)
             ON CONFLICT(attempt_id, step_id) DO UPDATE SET
               response_json = excluded.response_json,
               saved_at = excluded.saved_at`,
          )
          .run(
            stringField(row, "attempt_id"),
            stringField(row, "step_id"),
            stringField(row, "response_json"),
            stringField(row, "saved_at"),
          );
      }

      for (const row of backup.tables.verification_events) {
        this.db
          .prepare(
            `INSERT INTO verification_events
             (id, attempt_id, status, report_json, observed_at)
             VALUES (?, ?, ?, ?, ?)
             ON CONFLICT(id) DO UPDATE SET
               attempt_id = excluded.attempt_id,
               status = excluded.status,
               report_json = excluded.report_json,
               observed_at = excluded.observed_at`,
          )
          .run(
            numberField(row, "id"),
            stringField(row, "attempt_id"),
            stringField(row, "status"),
            stringField(row, "report_json"),
            stringField(row, "observed_at"),
          );
      }

      for (const row of backup.tables.evidence_records) {
        this.db
          .prepare(
            `INSERT INTO evidence_records
             (id, attempt_id, skill_id, evidence_type, level_candidate,
              reason_json, created_at)
             VALUES (?, ?, ?, ?, ?, ?, ?)
             ON CONFLICT(id) DO UPDATE SET
               attempt_id = excluded.attempt_id,
               skill_id = excluded.skill_id,
               evidence_type = excluded.evidence_type,
               level_candidate = excluded.level_candidate,
               reason_json = excluded.reason_json,
               created_at = excluded.created_at`,
          )
          .run(
            numberField(row, "id"),
            stringField(row, "attempt_id"),
            stringField(row, "skill_id"),
            stringField(row, "evidence_type"),
            numberField(row, "level_candidate"),
            stringField(row, "reason_json"),
            stringField(row, "created_at"),
          );
      }

      for (const row of backup.tables.teaching_progress) {
        this.db
          .prepare(
            `INSERT INTO teaching_progress
             (attempt_id, step_id, completed, teaching_response_json,
              remediation_events_json, updated_at)
             VALUES (?, ?, ?, ?, ?, ?)
             ON CONFLICT(attempt_id, step_id) DO UPDATE SET
               completed = excluded.completed,
               teaching_response_json = excluded.teaching_response_json,
               remediation_events_json = excluded.remediation_events_json,
               updated_at = excluded.updated_at`,
          )
          .run(
            stringField(row, "attempt_id"),
            stringField(row, "step_id"),
            numberField(row, "completed"),
            stringField(row, "teaching_response_json"),
            stringField(row, "remediation_events_json"),
            stringField(row, "updated_at"),
          );
      }

      this.db.exec("COMMIT");
    } catch (error) {
      this.db.exec("ROLLBACK");
      throw error;
    }

    return {
      importedAt: new Date().toISOString(),
      counts: Object.fromEntries(
        tableNames.map((table) => [table, backup.tables[table].length]),
      ),
    };
  }

  private rows(sql: string): BackupRow[] {
    return this.db.prepare(sql).all() as BackupRow[];
  }
}

function parseLearningBackup(input: unknown): LearningBackup {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    throw new ContractError("INVALID_BACKUP", "备份内容必须是 JSON 对象");
  }
  const backup = input as Record<string, unknown>;
  if (backup.format !== BACKUP_FORMAT) {
    throw new ContractError("INVALID_BACKUP", "备份格式不属于码上冒险");
  }
  if (backup.formatVersion !== BACKUP_FORMAT_VERSION) {
    throw new ContractError("INVALID_BACKUP", "备份版本暂不支持");
  }
  if (backup.schemaVersion !== 2) {
    throw new ContractError("INVALID_BACKUP", "备份 schema 版本暂不支持");
  }
  if (!backup.tables || typeof backup.tables !== "object") {
    throw new ContractError("INVALID_BACKUP", "备份缺少学习记录表");
  }
  const rawTables = backup.tables as Record<string, unknown>;
  const tables = Object.fromEntries(
    tableNames.map((table) => {
      const rows = rawTables[table];
      if (!Array.isArray(rows)) {
        throw new ContractError("INVALID_BACKUP", `备份缺少 ${table} 表`);
      }
      return [table, rows as BackupRow[]];
    }),
  ) as Record<BackupTableName, BackupRow[]>;

  return {
    format: BACKUP_FORMAT,
    formatVersion: BACKUP_FORMAT_VERSION,
    schemaVersion: 2,
    exportedAt: stringField(backup, "exportedAt"),
    tables,
  };
}

function ensureLocalLearner(row: BackupRow) {
  if (stringField(row, "learner_id") !== LEARNER_ID) {
    throw new ContractError("INVALID_BACKUP", "备份只能恢复本地学习者记录");
  }
}

function ensureJsonField(row: BackupRow, key: string) {
  try {
    JSON.parse(stringField(row, key));
  } catch {
    throw new ContractError("INVALID_BACKUP", `${key} 不是有效 JSON`);
  }
}

function stringField(row: BackupRow, key: string) {
  const value = row[key];
  if (typeof value !== "string") {
    throw new ContractError("INVALID_BACKUP", `${key} 必须是字符串`);
  }
  return value;
}

function nullableStringField(row: BackupRow, key: string) {
  const value = row[key];
  if (value === null || value === undefined) return null;
  if (typeof value !== "string") {
    throw new ContractError("INVALID_BACKUP", `${key} 必须是字符串或 null`);
  }
  return value;
}

function numberField(row: BackupRow, key: string) {
  const value = row[key];
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new ContractError("INVALID_BACKUP", `${key} 必须是数字`);
  }
  return value;
}
