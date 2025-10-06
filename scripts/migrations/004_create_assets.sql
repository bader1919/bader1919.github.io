-- Migration: 004_create_assets.sql
-- Purpose: Cover asset metadata and placeholder flags

CREATE TABLE IF NOT EXISTS assets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id INTEGER NOT NULL,
    path TEXT NOT NULL,
    alt_text TEXT NOT NULL,
    kind TEXT NOT NULL CHECK (kind IN ('hero','gallery','thumbnail','dataset')),
    checksum TEXT NULL,
    placeholder_replaced INTEGER NOT NULL DEFAULT 0 CHECK (placeholder_replaced IN (0,1)),
    width INTEGER NULL,
    height INTEGER NULL,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

-- Index for project asset lookups
CREATE INDEX IF NOT EXISTS idx_assets_project_id ON assets(project_id);

-- Index for kind filtering (e.g., finding all hero images)
CREATE INDEX IF NOT EXISTS idx_assets_kind ON assets(kind);

-- Index for placeholder detection
CREATE INDEX IF NOT EXISTS idx_assets_placeholder ON assets(placeholder_replaced);
