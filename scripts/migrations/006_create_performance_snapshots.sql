-- Migration: 006_create_performance_snapshots.sql
-- Purpose: Store Lighthouse metrics with constraints

CREATE TABLE IF NOT EXISTS performance_snapshots (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id INTEGER NULL,
    captured_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    lcp_ms INTEGER NOT NULL,
    cls REAL NOT NULL,
    ttfb_ms INTEGER NOT NULL,
    total_js_kb REAL NOT NULL,
    total_css_kb REAL NOT NULL,
    notes TEXT NULL,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

-- Index for project performance lookups
CREATE INDEX IF NOT EXISTS idx_performance_project_id ON performance_snapshots(project_id);

-- Index for chronological queries
CREATE INDEX IF NOT EXISTS idx_performance_captured_at ON performance_snapshots(captured_at DESC);
