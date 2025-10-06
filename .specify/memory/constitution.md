<!-- Sync Impact Report
Version change: template → 1.0.0
Modified principles: N/A (initial publication)
Added sections: Core Principles, Implementation Constraints, Delivery Workflow & Quality Gates, Governance
Removed sections: None
Templates requiring updates:
	✅ .specify/templates/plan-template.md
	✅ .specify/templates/spec-template.md
	✅ .specify/templates/tasks-template.md
Follow-up TODOs: None
-->

# Data Analysis Portfolio Constitution

## Core Principles

### Quality-First Codebase

- Author semantic, accessible HTML and modular CSS/JS; eliminate dead code and duplicated styling.
- Keep data sources, transformation scripts, and visual assets version-controlled with clear provenance.
- Document component intent inline (comments) or in `README.md` updates when behavior changes.

Rationale: Maintainable, transparent code ensures portfolio updates remain fast and safe as the showcase evolves.

### Test-Driven Insights

- Treat every data story as a contract: write unit checks for helpers, regression snapshots for datasets, and visual diff checks for charts before publishing.
- Automate link, accessibility, and lighthouse audits in CI; block merges if audits fail.
- Record manual exploratory notes for new visuals and store in project docs.

Rationale: Rigorous testing protects data credibility and prevents regressions that erode trust.

### Consistent Experience

- Preserve shared layout patterns, typography scales, and interaction behaviors across all pages.
- Provide responsive breakpoints (mobile ≤480px, tablet ≤1024px, desktop) and keyboard navigation parity.
- Accompany each visualization with plain-language insights and clear legends.

Rationale: A unified experience keeps diverse audiences engaged and reflects professional polish.

### Performance Transparency

- Target ≤1.5s Largest Contentful Paint and ≤100KB critical path assets on standard 4G.
- Lazy-load heavy media, compress imagery, and prefetch frequently visited project pages.
- Quantify and publish performance budgets in `README.md`; revisit after significant content additions.

Rationale: Fast delivery reinforces the portfolio’s data excellence and keeps visitors exploring.

## Implementation Constraints

- Use static-site friendly tooling (HTML, CSS, vanilla JS) unless a new dependency demonstrably improves maintainability.
- Data files must declare source, refresh cadence, and transformation steps in accompanying project docs.
- Secrets, API keys, or private datasets must never be committed; reference secure storage procedures instead.
- Accessibility conformance: meet WCAG 2.1 AA for color contrast, focus states, and alternative text.

## Delivery Workflow & Quality Gates

1. Draft changes in branches named `feature/<descriptor>`; open a pull request referencing affected project pages.
2. Run automated tests: dataset validators, linting, accessibility audits, and performance checks (Lighthouse or equivalent).
3. Conduct peer or self-review against Core Principles; record findings in PR notes.
4. Ship only after tests pass, performance budgets remain within limits, and UX copy has been proof-read.

## Content Migration Workflow

When migrating existing HTML-based projects to the new content management system:

1. **Create structure**: `mkdir -p content/projects/{slug}/assets`
2. **Extract metadata**: Create `project.yaml` with title, summary, description_path, published_on, tags, tech_stack, and primary_metric
3. **Craft narrative**: Create `narrative.md` with project story (headings start at H2 for proper semantic structure)
4. **Copy images**: Move images to `assets/` subdirectory, update Markdown references to use relative paths (`./assets/`)
5. **Validate**: Run `python scripts/manage_projects.py sync --slug {project-slug}` to check metadata and sync to database
6. **Build & preview**: Run `python scripts/build_site.py --validate` to generate static site with validation
7. **Verify**: Visual inspection at `http://localhost:8000/projects/{slug}/` to ensure correct rendering
8. **Document**: Update migration checklist in specs/
9. **Commit**: `git add content/projects/{slug}/ && git commit -m "Migrate {slug} from legacy HTML structure"`

**Important migration guidelines**:
- Original project files in `projects/` or `bader1919.github.io-main/projects/` are read-only (link with relative paths like `../../bader1919.github.io-main/projects/{folder}/file.ext`)
- Large assets (PPTX, XLSX, PDF) stay in original location
- Images referenced in narrative go to `content/projects/{slug}/assets/`
- Use Git history for publication dates when available: `git log --follow --format=%aI --reverse -- "projects/{folder}" | head -1`
- Follow YAML schema exactly: slug, title, summary, description_path, published_on, last_updated_on, hero_image, status, tech_stack, primary_metric, github_url, live_url, tags

## Governance

- This constitution governs every repository update impacting the portfolio's content or platform.
- Amendments require written justification, pull request discussion, and consensus approval.
- Versioning follows Semantic Versioning: MAJOR for principle changes, MINOR for new sections, PATCH for clarifications.
- Reviewers must log constitution compliance outcomes in each PR.
- Schedule quarterly reviews to reassess testing coverage, performance targets, and UX guidelines.

**Version**: 1.1.0 | **Ratified**: 2025-10-05 | **Last Amended**: 2025-10-06
