# Data Model – Content Migration

## Database Schema

**No schema changes required.** Feature 002 uses the existing database structure created in Feature 001.

### Existing Tables (Reference)

```sql
-- Projects table (001_create_projects_table.sql)
CREATE TABLE projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    narrative TEXT,
    thumbnail TEXT,
    published_date TEXT NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);

-- Tags table (002_create_tags_table.sql)
CREATE TABLE tags (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    created_at TEXT NOT NULL
);

-- Project-tags junction (003_create_project_tags_table.sql)
CREATE TABLE project_tags (
    project_id INTEGER NOT NULL,
    tag_id INTEGER NOT NULL,
    PRIMARY KEY (project_id, tag_id),
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);

-- Assets table (004_create_assets_table.sql)
CREATE TABLE assets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id INTEGER NOT NULL,
    type TEXT NOT NULL CHECK(type IN ('image', 'document', 'data')),
    path TEXT NOT NULL,
    alt_text TEXT,
    created_at TEXT NOT NULL,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);
```

## Content File Structure

Each migrated project will have:

```text
content/projects/{project-slug}/
├── project.yaml          # Metadata (title, description, tags, published_date, thumbnail)
└── narrative.md          # Full project narrative in Markdown
```

### project.yaml Schema

```yaml
title: string (required, 1-120 chars)
description: string (required, 1-300 chars, one-sentence summary)
tags: list[string] (required, min 1 tag)
published_date: string (required, YYYY-MM-DD format)
thumbnail: string (optional, relative path from project dir)
```

### narrative.md Format

- Standard Markdown with optional YAML frontmatter
- Headings start at `##` (H2) since project title is H1 in template
- Images use relative paths: `![Alt text](./assets/image.jpg)`
- External links absolute: `[Link](https://example.com)`

## Migration Mapping

| Source | Target |
|--------|--------|
| `projects/Airbnb Market Analysis - Cape Town/` | `content/projects/airbnb-cape-town-analysis/` |
| `projects/BA-Service-Quality-Review/` | `content/projects/ba-service-quality-review/` |
| `projects/Customer-Churn-Analysis/` | `content/projects/customer-churn-analysis/` |
| `projects/Global-Food-Supply-Chain/` | `content/projects/global-food-supply-chain/` |
| `projects/Kickstarter Growth Analysis/` | `content/projects/kickstarter-growth-analysis/` |

Slug generation: lowercase, replace spaces/special chars with hyphens, strip trailing hyphens.

## Asset Handling Strategy

- **Images**: Copy to `content/projects/{slug}/assets/` if referenced in narrative
- **Documents** (PDF, PPTX, XLSX): Keep in original location, link using relative paths to `../../projects/{original-name}/`
- **Asset registration**: Images only registered in `assets` table (type='image')
