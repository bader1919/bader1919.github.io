-- Migration: 005_create_page_sections.sql
-- Purpose: Define site section Markdown references

CREATE TABLE IF NOT EXISTS page_sections (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    page TEXT NOT NULL,
    section TEXT NOT NULL,
    content_path TEXT NOT NULL,
    UNIQUE (page, section)
);

-- Index for page+section lookups
CREATE UNIQUE INDEX IF NOT EXISTS idx_page_sections_page_section ON page_sections(page, section);
