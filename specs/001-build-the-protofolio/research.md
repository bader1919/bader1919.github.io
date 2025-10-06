# Phase 0 Research – Portfolio Project Organization Framework

## Decision Log

### Static Site Generation Pipeline

- **Decision**: Build the site with a Python 3.11 tooling layer (`scripts/build_site.py`) that reads Markdown content and SQLite metadata, then renders HTML using lightweight templating.
- **Rationale**: Keeps runtime static (no server dependencies), allows deterministic builds, and aligns with the "minimal libraries" directive while retaining flexibility to regenerate pages.
- **Alternatives Considered**:
  - **Eleventy / Astro / Next.js**: rejected because they introduce heavier Node-based stacks and more dependencies than required.
  - **Pure manual HTML editing**: rejected because it is error-prone and makes synchronising metadata and navigation tedious.

### Markdown Processing Strategy

- **Decision**: Use the `markdown` Python package with a minimal extension set (tables, fenced code) to convert project narratives stored in `content/projects/<slug>/narrative.md`.
- **Rationale**: Provides consistent Markdown rendering with little overhead and keeps content authoring ergonomic.
- **Alternatives Considered**:
  - **Hand-written Markdown parser**: rejected due to maintenance complexity.
  - **Client-side rendering**: rejected to avoid shipping unused JavaScript and to keep HTML crawlable.

### HTML Templating Approach

- **Decision**: Use `jinja2` templates housed in `templates/` to compose `base.html`, `project.html`, and reusable partials (hero, project card, footer).
- **Rationale**: Encourages DRY layouts, supports componentised partials, and integrates cleanly with Python build scripts; extra dependency is acceptable because it avoids reinventing templating.
- **Alternatives Considered**:
  - **String concatenation**: rejected for readability and maintainability concerns.
  - **Handlebars/JS templating**: rejected to avoid adding a Node toolchain.

### Metadata Persistence

- **Decision**: Persist portfolio metadata in `data/portfolio.db` (SQLite) with tables for projects, assets, tags, and performance metrics managed via `scripts/manage_projects.py`.
- **Rationale**: SQLite is file-based, version-controllable, and satisfies the requirement for local metadata storage; Python ships with `sqlite3`, removing extra dependencies.
- **Alternatives Considered**:
  - **JSON/YAML files**: rejected because joins/filtering become cumbersome and harder to validate.
  - **Remote DB (e.g., Supabase, Airtable)**: rejected to keep the site fully static and offline-friendly.

### Image & Asset Handling

- **Decision**: Store production images under `assets/img/projects/<slug>/` and retain placeholders under `assets/img/placeholders/`. Provide `scripts/validate_assets.py` to flag unresolved placeholders or missing alt text before publishing.
- **Rationale**: Enforces completion of visual assets, keeps repository self-contained, and provides a hook to prompt the owner for any missing images.
- **Alternatives Considered**:
  - **Remote CDN uploads**: rejected due to added operational overhead and dependency on external services.
  - **Unchecked manual uploads**: rejected because it risks shipping placeholder imagery.

### Quality & Test Strategy

- **Decision**: Adopt `pytest` for unit and integration tests (builder functions, SQLite migrations, navigation output), `pytest-playwright` + `axe-core` for accessibility regression, and `lighthouse-ci` (Node CLI) for performance budgets (≤1.5s LCP, ≤100KB critical assets).
- **Rationale**: Provides automated assurance aligned with the constitution while keeping the dependency set small and purpose-driven.
- **Alternatives Considered**:
  - **Manual testing only**: rejected because it conflicts with the Test-Driven Insights principle.
  - **Cypress/Storybook**: rejected as heavier test stacks than required.

### Deployment Workflow

- **Decision**: Use GitHub Actions CI to run build, validation, accessibility, and performance checks on pull requests. Publish the static output in `dist/` to GitHub Pages after successful checks.
- **Rationale**: Automates constitutional gates, keeps deployment reproducible, and integrates with existing hosting.
- **Alternatives Considered**:
  - **Manual publishing**: rejected due to higher risk of skipped checks.
  - **Third-party deployment platforms**: unnecessary for a GitHub Pages-hosted static site.

## Outstanding Questions

- None. All critical ambiguities were resolved during clarification; additional assets (e.g., new project images) will be requested as needed via validation scripts.
