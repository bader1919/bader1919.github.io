# bader1919.github.io Development Guidelines

Auto-generated from all feature plans. Last updated: 2025-10-06

## Active Technologies
- Python 3.11, HTML5, CSS3, vanilla ES6 + Jinja2, python-markdown, sqlite3 (stdlib), pytest, Playwright + axe-core, Lighthouse CI (001-build-the-protofolio)
- SQLite database (`data/portfolio.db`) with deterministic migrations (001-build-the-protofolio)
- Python 3.11 + python-markdown, PyYAML, Pillow, Jinja2, pytest, Playwright (003-review-fix-and)

## Project Structure

```text
content/projects/{slug}/     # Project content (YAML + Markdown)
  ├── project.yaml           # Metadata
  ├── narrative.md           # Full narrative
  └── assets/                # Images referenced in narrative
data/portfolio.db            # SQLite database (generated)
dist/                        # Built static site (generated)
scripts/
  ├── manage_projects.py     # Content sync: init, migrate, sync
  ├── build_site.py          # Static site generation
  └── validate_assets.py     # Asset validation
templates/                   # Jinja2 templates
tests/                       # Pytest + Playwright tests
```

## Commands

### Content Management

```bash
# Initialize database and run migrations
python scripts/manage_projects.py init

# Sync content from content/projects/ to database
python scripts/manage_projects.py sync

# Validate content without syncing
python scripts/manage_projects.py sync --validate-only
```

### Build and Preview

```bash
# Build static site
python scripts/build_site.py

# Build with asset validation
python scripts/build_site.py --validate

# Preview locally
python -m http.server -d dist 8000
# Open http://localhost:8000
```

### Testing

```bash
# Run all tests
pytest

# Run specific test types
pytest tests/unit/
pytest tests/integration/
pytest tests/e2e/
```

## Code Style
General: Follow standard conventions

## Content Migration Workflow (002-migrate-existing-portfolio)

When migrating existing HTML-based projects to the new content structure:

1. **Create structure**: `mkdir -p content/projects/{slug}/{assets}`
2. **Extract metadata**: Create `project.yaml` with title, description, tags, published_date, thumbnail
3. **Craft narrative**: Create `narrative.md` with project story (headings start at H2)
4. **Copy images**: Move images to `assets/`, update Markdown references
5. **Validate**: Run `python scripts/manage_projects.py sync --validate-only`
6. **Sync**: Run `python scripts/manage_projects.py sync`
7. **Build & preview**: Run `python scripts/build_site.py --validate && python -m http.server -d dist 8000`
8. **Verify**: Visual inspection at http://localhost:8000/projects/{slug}/
9. **Commit**: `git commit -m "Migrate {slug} from legacy HTML structure"`

**Important**:
- Original project files in `projects/` are read-only (link with relative paths)
- Large assets (PPTX, XLSX, PDF) stay in original location
- Images referenced in narrative go to `content/projects/{slug}/assets/`
- Use Git history for publication dates: `git log --follow --format=%aI --reverse -- "projects/{folder}" | head -1`

## Recent Changes
- 003-review-fix-and: Added Python 3.11 + python-markdown, PyYAML, Pillow, Jinja2, pytest, Playwright
- 001-build-the-protofolio: Added Python 3.11, HTML5, CSS3, vanilla ES6 + Jinja2, python-markdown, sqlite3 (stdlib), pytest, Playwright + axe-core, Lighthouse CI
- 002-migrate-existing-portfolio: Added content migration workflow and validation contracts


<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->
