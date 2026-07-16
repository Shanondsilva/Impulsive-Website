CREATE TABLE IF NOT EXISTS deletion_requests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL,
  token_hash TEXT NOT NULL UNIQUE,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  expires_at TEXT NOT NULL,
  used_at TEXT,
  ip_hash TEXT
);

CREATE INDEX IF NOT EXISTS idx_deletion_token_hash ON deletion_requests(token_hash);
CREATE INDEX IF NOT EXISTS idx_deletion_expires_at ON deletion_requests(expires_at);
