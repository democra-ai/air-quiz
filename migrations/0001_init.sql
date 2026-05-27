-- AIR: D1 schema (replaces Firestore collections)
-- Applied via: wrangler d1 migrations apply AIR_DB --remote

-- ─── quiz_sessions ──────────────────────────────────────────────────────────
-- Detailed per-session record. Previously Firestore `quiz_sessions` collection.
CREATE TABLE IF NOT EXISTS quiz_sessions (
  session_id           TEXT PRIMARY KEY,
  uid                  TEXT,
  created_at           INTEGER NOT NULL,          -- unix ms
  language             TEXT NOT NULL,
  preset               TEXT,
  profile_code         TEXT NOT NULL,
  profile_name         TEXT,
  risk_tier            TEXT NOT NULL,
  probability          REAL NOT NULL,
  predicted_year       INTEGER,
  ai_capability        REAL,
  confidence_earliest  INTEGER,
  confidence_latest    INTEGER,
  answers_json         TEXT NOT NULL,             -- {core, snapshot, survey}
  dimensions_json      TEXT NOT NULL,             -- per-dimension scores
  share_url            TEXT,
  duration_seconds     INTEGER,
  user_agent           TEXT,
  screen_size          TEXT,
  referrer             TEXT
);

CREATE INDEX IF NOT EXISTS idx_qs_created  ON quiz_sessions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_qs_profile  ON quiz_sessions(profile_code);
CREATE INDEX IF NOT EXISTS idx_qs_lang     ON quiz_sessions(language);
CREATE INDEX IF NOT EXISTS idx_qs_risktier ON quiz_sessions(risk_tier);

-- ─── answer_distributions ──────────────────────────────────────────────────
-- Per-session answers for aggregation. Previously Firestore `answer_distributions`.
CREATE TABLE IF NOT EXISTS answer_distributions (
  session_id    TEXT PRIMARY KEY,
  created_at    INTEGER NOT NULL,
  language      TEXT NOT NULL,
  profile_code  TEXT NOT NULL,
  answers_json  TEXT NOT NULL,                   -- { "Q1": 3, "Q2": 5, ... }
  device        TEXT
);

CREATE INDEX IF NOT EXISTS idx_ad_profile ON answer_distributions(profile_code);
CREATE INDEX IF NOT EXISTS idx_ad_lang    ON answer_distributions(language);

-- ─── answer_aggregate ──────────────────────────────────────────────────────
-- Rolled-up counts: how often each answer value was picked per question.
-- Updated on each submission; readers get O(1) lookups for "% of people who
-- answered X to question Y".
CREATE TABLE IF NOT EXISTS answer_aggregate (
  question_id   TEXT NOT NULL,
  answer_value  INTEGER NOT NULL,
  language      TEXT NOT NULL,
  count         INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (question_id, answer_value, language)
);
