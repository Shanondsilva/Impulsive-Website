ALTER TABLE waitlist_signups ADD COLUMN page TEXT;
ALTER TABLE waitlist_signups ADD COLUMN referrer TEXT;
ALTER TABLE waitlist_signups ADD COLUMN status TEXT NOT NULL DEFAULT 'joined';
ALTER TABLE waitlist_signups ADD COLUMN updated_at TEXT;
ALTER TABLE waitlist_signups ADD COLUMN confirmation_sent_at TEXT;

UPDATE waitlist_signups
SET updated_at = created_at
WHERE updated_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_waitlist_created_at ON waitlist_signups(created_at);
CREATE INDEX IF NOT EXISTS idx_waitlist_status ON waitlist_signups(status);
