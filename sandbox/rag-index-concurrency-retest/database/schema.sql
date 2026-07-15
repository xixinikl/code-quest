CREATE TABLE index_jobs (
  id INTEGER PRIMARY KEY,
  document_id TEXT NOT NULL,
  document_version INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  worker_id TEXT,
  started_at TEXT
);

CREATE TABLE document_chunks (
  id INTEGER PRIMARY KEY,
  document_id TEXT NOT NULL,
  document_version INTEGER NOT NULL,
  chunk_index INTEGER NOT NULL,
  content TEXT NOT NULL
);

-- 故意缺少 (document_id, document_version, chunk_index) 唯一约束。
