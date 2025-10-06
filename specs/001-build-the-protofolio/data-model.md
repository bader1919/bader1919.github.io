# Data Model – Portfolio Project Organization Framework

## Overview

The portfolio stores project metadata in a local SQLite database (`data/portfolio.db`). The schema is designed to keep navigation, filtering, and performance metrics in sync with Markdown content while enforcing the "no nested projects" constraint.

## Entities

### projects

- `id` INTEGER PRIMARY KEY AUTOINCREMENT
- `slug` TEXT UNIQUE NOT NULL (kebab-case identifier, matches folder in `content/projects/`)
- `title` TEXT NOT NULL
- `summary` TEXT NOT NULL (≤160 chars for SEO snippet)
- `description_path` TEXT NOT NULL (relative path to Markdown narrative)
- `published_on` DATE NOT NULL (drives chronological ordering)
- `last_updated_on` DATE NOT NULL DEFAULT CURRENT_DATE
- `hero_image` TEXT NOT NULL (relative path under `assets/img/projects/`)
- `status` TEXT NOT NULL CHECK (status IN ('draft','published','archived'))
- `tech_stack` TEXT NOT NULL (comma-delimited list mirrored into tags table)
- `primary_metric` TEXT NULL (key insight for the project card)
- `github_url` TEXT NULL
- `live_url` TEXT NULL
- `lighthouse_score` REAL NULL (most recent overall Lighthouse score)
- `accessibility_score` REAL NULL (axe-based score)
- `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP

#### Constraints & Notes

- `published_on` determines the default ordering (newest first).
- Ingestion scripts ensure every project has a corresponding Markdown narrative and hero image.
- `tech_stack` is denormalised for quick display; canonical values live in `tags`.

### tags

- `id` INTEGER PRIMARY KEY AUTOINCREMENT
- `name` TEXT UNIQUE NOT NULL (lowercase snake_case)
- `display_name` TEXT NOT NULL

### project_tags (join table)

- `project_id` INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE
- `tag_id` INTEGER NOT NULL REFERENCES tags(id) ON DELETE CASCADE
- PRIMARY KEY (`project_id`, `tag_id`)

### assets

- `id` INTEGER PRIMARY KEY AUTOINCREMENT
- `project_id` INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE
- `path` TEXT NOT NULL (relative path to the asset)
- `alt_text` TEXT NOT NULL
- `kind` TEXT NOT NULL CHECK (kind IN ('hero','gallery','thumbnail','dataset'))
- `checksum` TEXT NULL (used to detect stale uploads)
- `placeholder_replaced` INTEGER NOT NULL DEFAULT 0 CHECK (placeholder_replaced IN (0,1))
- `width` INTEGER NULL
- `height` INTEGER NULL

### page_sections

- `id` INTEGER PRIMARY KEY AUTOINCREMENT
- `page` TEXT NOT NULL (e.g., 'about', 'contact', 'home')
- `section` TEXT NOT NULL
- `content_path` TEXT NOT NULL (Markdown snippet)
- UNIQUE (`page`, `section`)

### performance_snapshots

- `id` INTEGER PRIMARY KEY AUTOINCREMENT
- `project_id` INTEGER REFERENCES projects(id) ON DELETE CASCADE
- `captured_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
- `lcp_ms` INTEGER NOT NULL
- `cls` REAL NOT NULL
- `ttfb_ms` INTEGER NOT NULL
- `total_js_kb` REAL NOT NULL
- `total_css_kb` REAL NOT NULL
- `notes` TEXT NULL

## Relationships

- `projects` 1—N `assets`
- `projects` N—N `tags` through `project_tags`
- `projects` 1—N `performance_snapshots`
- `page_sections` is independent and maps Markdown snippets to static pages.

## Derived Views (to be created for convenience)

- `vw_project_cards`: surfaces project slug, title, summary, hero image, primary metric, and top three tags ordered by `published_on DESC`.
- `vw_asset_gaps`: lists projects missing required hero images or with `placeholder_replaced = 0` for validation.
- `vw_recent_performance`: displays the latest performance snapshot per project, used to show Lighthouse results on the project page.

## Migration Strategy

1. Create schema migrations managed via `scripts/manage_projects.py migrate` (idempotent).
2. Seed initial data from existing HTML pages by extracting headings, summaries, and tech stacks before deleting old duplicates.
3. Enforce foreign keys (`PRAGMA foreign_keys = ON`) in all scripts.
4. Version the database schema by incrementing a numeric `schema_version` stored in `PRAGMA user_version`.

## Data Quality Checks

- Ensure every `project` row has at least one `asset` flagged as `hero`.
- Validate that `alt_text` is non-empty and not using placeholder phrases.
- Confirm each `project` has ≥1 `performance_snapshot` within the last 90 days; otherwise mark for re-audit.
- Verify `page_sections` Markdown exists and can be rendered without broken links.
