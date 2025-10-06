-- Migration: 001_create_projects.sql
-- Purpose: Define the projects table per data model (including constraints and indices)

CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    summary TEXT NOT NULL,
    description_path TEXT NOT NULL,
    published_on DATE NOT NULL,
    last_updated_on DATE NOT NULL DEFAULT CURRENT_DATE,
    hero_image TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('draft','published','archived')),
    tech_stack TEXT NOT NULL,
    primary_metric TEXT NULL,
    github_url TEXT NULL,
    live_url TEXT NULL,
    lighthouse_score REAL NULL,
    accessibility_score REAL NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Index for chronological ordering (newest first)
CREATE INDEX IF NOT EXISTS idx_projects_published_on ON projects(published_on DESC);

-- Index for status filtering
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);

-- Index for slug lookups
CREATE UNIQUE INDEX IF NOT EXISTS idx_projects_slug ON projects(slug);
