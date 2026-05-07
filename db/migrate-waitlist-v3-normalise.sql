CREATE TABLE waitlist_signups_new (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL UNIQUE,
  source TEXT,
  page TEXT,
  referrer TEXT,
  user_agent TEXT,
  ip_hash TEXT,
  status TEXT NOT NULL DEFAULT 'joined',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  confirmation_sent_at TEXT
);

INSERT INTO waitlist_signups_new (
  id,
  email,
  source,
  page,
  referrer,
  user_agent,
  ip_hash,
  status,
  created_at,
  updated_at,
  confirmation_sent_at
)
SELECT
  id,
  email,
  source,
  page,
  referrer,
  user_agent,
  ip_hash,
  COALESCE(status, 'joined'),
  created_at,
  COALESCE(updated_at, created_at, CURRENT_TIMESTAMP),
  confirmation_sent_at
FROM waitlist_signups;

DROP TABLE waitlist_signups;
ALTER TABLE waitlist_signups_new RENAME TO waitlist_signups;

CREATE INDEX IF NOT EXISTS idx_waitlist_created_at ON waitlist_signups(created_at);
CREATE INDEX IF NOT EXISTS idx_waitlist_status ON waitlist_signups(status);
