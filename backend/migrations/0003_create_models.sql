CREATE TABLE IF NOT EXISTS models (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  tagline TEXT NOT NULL,
  description TEXT NOT NULL,
  content TEXT NOT NULL,
  banner_image_url TEXT,
  card_image_url TEXT,
  parameters TEXT,
  context_length TEXT,
  base_model TEXT,
  required_hardware TEXT,
  huggingface_url TEXT,
  github_url TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_models_slug ON models(slug);
