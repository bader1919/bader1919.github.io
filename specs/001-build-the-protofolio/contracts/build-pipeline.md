# Contract: Static Site Build Pipeline

## Purpose

Generate deterministic HTML pages for the portfolio from SQLite metadata, shared templates, and Markdown content while enforcing quality budgets.

## Inputs

- SQLite database at `data/portfolio.db`
- Jinja2 templates in `templates/`
- Markdown converter configuration (extensions: fenced_code, tables, toc)
- `site.config.json` defining nav structure and contact metadata

## Outputs

- Rendered HTML files under `dist/`
- Asset manifest `dist/manifest.json` (maps logical asset names to file paths and hashes)
- Build report `reports/build-summary.json` capturing counts, durations, and warnings

## Behaviour

- Builds pages in dependency order: index → project detail → auxiliary pages
- Applies shared header/footer partials via Jinja2 includes; no inline duplication allowed
- Injects Open Graph metadata per page based on project records
- Automatically swaps missing imagery with placeholder assets and records prompts in report
- Minifies CSS/JS via existing `assets/css/main.css` and `assets/js/main.js`; no additional bundlers introduced

## Error Modes & Logging

- Fails fast if templates reference missing variables or blocks
- Emits warnings (non-fatal) for pages exceeding 100KB or missing alt text; fatal once count > 3
- Non-zero exit code when render pass emits any errors classified as fatal

## Consumers

- `scripts/build_site.py`
- GitHub Actions CI build job
- Local preview server when running `python -m http.server --directory dist`
