CREATE TABLE profiles (
  id TEXT PRIMARY KEY,
  avatar_url TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

INSERT INTO profiles (id, avatar_url, updated_at)
VALUES ('user_01', '/avatars/old-sun.webp', '2026-07-01T00:00:00.000Z');
