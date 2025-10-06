# Contract: Content Structure & Metadata Synchronisation

## Purpose

Define how project content, narrative Markdown, and asset prompts are ingested into the SQLite metadata store so the static site build can render consistent pages.

## Inputs

- Markdown narrative per project located at `content/projects/<slug>/narrative.md`
- Optional additional Markdown sections (e.g., `insights.md`) referenced via front matter
- Image files placed under `assets/img/projects/<slug>/`
- `project.yaml` manifest describing hero image, gallery list, publication date, and tags

## Outputs

- SQLite rows in `projects`, `assets`, `page_sections`, and `project_tags`
- Derived JSON cache at `data/cache/projects.json` for quick previews (non-authoritative)
- Validation report (`reports/content-sync.json`) enumerating missing or oversized assets

## Behaviour

- Slug in `project.yaml` must match directory name; mismatch is a fatal error
- Missing required hero image triggers warning and placeholder injection but does not abort
- Tags auto-create if absent; duplicates normalised to lowercase kebab-case
- Narrative Markdown is stored raw; conversion to HTML occurs during build
- Sync uses idempotent upsert semantics keyed by `slug`

## Error Modes & Logging

- Hard failure if YAML or Markdown fails schema validation (logged to stderr and report)
- Asset checksum mismatches produce warnings; rebuild attempts continue
- Returns non-zero exit code when fatal errors occur to prevent CI success

## Consumers

- `scripts/manage_projects.py sync`
- Static site builder reading SQLite and cache data
- Quality assurance scripts validating metadata completeness
