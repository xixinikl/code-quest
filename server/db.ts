import { mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { DatabaseSync } from "node:sqlite";

export const SCHEMA_VERSION = 2;

const migrationV1 = `
  CREATE TABLE IF NOT EXISTS schema_migrations (
    version INTEGER PRIMARY KEY,
    applied_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS learner_profiles (
    id TEXT PRIMARY KEY,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS diagnostic_sessions (
    id TEXT PRIMARY KEY,
    learner_id TEXT NOT NULL REFERENCES learner_profiles(id),
    status TEXT NOT NULL CHECK(status IN ('active', 'completed')),
    baseline_json TEXT NOT NULL DEFAULT '{}',
    started_at TEXT NOT NULL,
    completed_at TEXT
  );

  CREATE TABLE IF NOT EXISTS attempts (
    id TEXT PRIMARY KEY,
    learner_id TEXT NOT NULL REFERENCES learner_profiles(id),
    scenario_id TEXT NOT NULL,
    status TEXT NOT NULL CHECK(status IN ('active', 'submitted')),
    hint_level INTEGER NOT NULL DEFAULT 0 CHECK(hint_level BETWEEN 0 AND 3),
    verification_status TEXT NOT NULL DEFAULT 'not_run'
      CHECK(verification_status IN ('not_run', 'failed', 'passed', 'invalid_report')),
    started_at TEXT NOT NULL,
    submitted_at TEXT
  );

  CREATE TABLE IF NOT EXISTS step_responses (
    attempt_id TEXT NOT NULL REFERENCES attempts(id) ON DELETE CASCADE,
    step_id TEXT NOT NULL,
    response_json TEXT NOT NULL,
    saved_at TEXT NOT NULL,
    PRIMARY KEY (attempt_id, step_id)
  );

  CREATE TABLE IF NOT EXISTS verification_events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    attempt_id TEXT NOT NULL REFERENCES attempts(id) ON DELETE CASCADE,
    status TEXT NOT NULL,
    report_json TEXT NOT NULL,
    observed_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS evidence_records (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    attempt_id TEXT NOT NULL REFERENCES attempts(id) ON DELETE CASCADE,
    skill_id TEXT NOT NULL,
    evidence_type TEXT NOT NULL,
    level_candidate INTEGER NOT NULL CHECK(level_candidate BETWEEN 0 AND 5),
    reason_json TEXT NOT NULL,
    created_at TEXT NOT NULL
  );

  CREATE INDEX IF NOT EXISTS idx_attempts_learner
    ON attempts(learner_id, started_at DESC);
  CREATE INDEX IF NOT EXISTS idx_evidence_learner
    ON evidence_records(skill_id, created_at DESC);
`;

const migrationV2 = `
  CREATE TABLE IF NOT EXISTS teaching_progress (
    attempt_id TEXT NOT NULL REFERENCES attempts(id) ON DELETE CASCADE,
    step_id TEXT NOT NULL,
    completed INTEGER NOT NULL DEFAULT 0,
    teaching_response_json TEXT NOT NULL DEFAULT '{}',
    remediation_events_json TEXT NOT NULL DEFAULT '[]',
    updated_at TEXT NOT NULL,
    PRIMARY KEY (attempt_id, step_id)
  );

  CREATE INDEX IF NOT EXISTS idx_teaching_progress_attempt
    ON teaching_progress(attempt_id);
`;

export type LearningDatabase = DatabaseSync;

export function openDatabase(path: string): LearningDatabase {
  if (path !== ":memory:") mkdirSync(dirname(path), { recursive: true });
  const db = new DatabaseSync(path);
  db.exec("PRAGMA foreign_keys = ON; PRAGMA journal_mode = WAL;");
  migrate(db);
  return db;
}

function migrate(db: LearningDatabase) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      version INTEGER PRIMARY KEY,
      applied_at TEXT NOT NULL
    )
  `);

  const applied = db
    .prepare("SELECT version FROM schema_migrations")
    .all()
    .map((row) => Number(row.version));

  if (!applied.includes(1)) {
    db.exec("BEGIN IMMEDIATE");
    try {
      db.exec(migrationV1);
      db.prepare(
        "INSERT INTO schema_migrations (version, applied_at) VALUES (?, ?)",
      ).run(1, new Date().toISOString());
      db.exec("COMMIT");
    } catch (error) {
      db.exec("ROLLBACK");
      throw error;
    }
  }

  if (!applied.includes(2)) {
    db.exec("BEGIN IMMEDIATE");
    try {
      db.exec(migrationV2);
      db.prepare(
        "INSERT INTO schema_migrations (version, applied_at) VALUES (?, ?)",
      ).run(2, new Date().toISOString());
      db.exec("COMMIT");
    } catch (error) {
      db.exec("ROLLBACK");
      throw error;
    }
  }
}

export function currentSchemaVersion(db: LearningDatabase) {
  const row = db
    .prepare("SELECT MAX(version) AS version FROM schema_migrations")
    .get();
  return Number(row?.version ?? 0);
}
