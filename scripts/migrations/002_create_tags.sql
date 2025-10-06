-- Migration: 002_create_tags.sql
-- Purpose: Define the tags table with uniqueness enforcement

CREATE TABLE IF NOT EXISTS tags (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    display_name TEXT NOT NULL
);

-- Index for tag name lookups
CREATE UNIQUE INDEX IF NOT EXISTS idx_tags_name ON tags(name);
