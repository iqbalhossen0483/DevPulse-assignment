CREATE TABLE IF NOT EXISTS issues (
  id          SERIAL PRIMARY KEY,
  title       VARCHAR(150) NOT NULL,
  description TEXT         NOT NULL,
  type        VARCHAR(20)  NOT NULL
                CHECK (type IN ('bug', 'feature_request')),
  status      VARCHAR(20)  NOT NULL DEFAULT 'open'
                CHECK (status IN ('open', 'in_progress', 'resolved')),
  reporter_id INTEGER      NOT NULL,
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);
