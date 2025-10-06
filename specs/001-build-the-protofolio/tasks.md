# Tasks: Portfolio Project Organization Framework

**Input**: Design documents from `/specs/001-build-the-protofolio/`
**Prerequisites**: `plan.md` (required), `research.md`, `data-model.md`, `contracts/`, `quickstart.md`

## Execution Flow (main)

```text
1. Load plan.md from feature directory
   → Extract tech stack, folder structure, quality gates
2. Load optional design documents:
   → data-model.md: Entities → migration/model tasks
   → contracts/: Each contract → contract test task
   → research.md: Operational decisions → setup tasks
   → quickstart.md: Scenarios → integration tests & polish tasks
3. Generate tasks by category:
   → Setup, Tests (TDD), Core implementation, Integration, Polish
4. Apply task rules:
   → Different files = mark [P] for parallel
   → Same file = sequential (no [P])
   → Tests before implementation (TDD enforcement)
5. Number tasks sequentially (T001, T002, ...)
6. Capture dependencies & parallel guidance
7. Validate completeness vs. design docs
8. Return: SUCCESS (tasks ready for execution)
```

## Format: `[ID] [P?] Description`

- **[P]**: Can run in parallel (different files, no blocking dependency)
- Include exact file paths in descriptions

## Path Conventions

- Single static-site workspace rooted at repository root
- Generated site output under `dist/`
- Scripts live in `scripts/`, SQL migrations under `scripts/migrations/`
- Tests organised beneath `tests/`

## Phase 3.1: Setup

- [X] T001 Configure Python dependencies by creating `requirements.txt` with markdown, jinja2, pytest, pytest-playwright, pillow, and update `.gitignore` to exclude `.venv/`.
- [X] T002 Define Node tooling by adding `package.json` with devDependencies (`@lhci/cli`, `playwright`, `axe-playwright`) and npm scripts for `lint`, `lhci`, and an end-to-end Playwright run command.
- [X] T003 Scaffold project structure per plan by creating `scripts/` (with stubs for `build_site.py`, `manage_projects.py`, `validate_assets.py`), `scripts/migrations/`, `templates/` (including `partials/`), `content/projects/.gitkeep`, `data/cache/.gitkeep`, and initial test package directories under `tests/`.

## Phase 3.2: Tests First (TDD) ⚠️ MUST COMPLETE BEFORE 3.3

> CRITICAL: These tests MUST be written and MUST FAIL before ANY implementation

- [X] T004 [P] Author contract tests for content sync contract in `tests/contract/test_content_sync.py` covering slug validation, YAML ingestion, and JSON cache generation.
- [X] T005 [P] Author contract tests for static build pipeline in `tests/contract/test_build_pipeline.py` validating deterministic renders, Open Graph tags, and placeholder injection.
- [X] T006 [P] Author contract tests for quality assurance gates in `tests/contract/test_quality_gates.py` exercising pytest, axe, and Lighthouse budget enforcement.
- [X] T007 [P] Add integration test for new project surfacing and chronological ordering in `tests/integration/test_project_listing.py` (covers FR-001/FR-002/FR-008).
- [X] T008 [P] Add integration test for zero-project fallback messaging in `tests/integration/test_zero_projects_state.py`.
- [X] T009 [P] Add integration test for placeholder asset warnings in `tests/integration/test_placeholder_assets.py` ensuring validation reports flag missing media.
- [X] T010 [P] Add Playwright mobile navigation accessibility test in `tests/accessibility/test_mobile_navigation.spec.ts` validating responsive menus and keyboard traversal.
- [X] T011 [P] Add Playwright project detail accessibility test in `tests/accessibility/test_project_detail.spec.ts` confirming hero media, headings, and skip links work.

## Phase 3.3: Core Implementation (ONLY after tests are failing)

- [X] T012 [P] Create migration `scripts/migrations/001_create_projects.sql` defining the `projects` table per data model (including constraints and indices).
- [X] T013 [P] Create migration `scripts/migrations/002_create_tags.sql` for the `tags` table with uniqueness enforcement.
- [X] T014 [P] Create migration `scripts/migrations/003_create_project_tags.sql` implementing the join table and foreign keys.
- [X] T015 [P] Create migration `scripts/migrations/004_create_assets.sql` covering asset metadata and placeholder flags.
- [X] T016 [P] Create migration `scripts/migrations/005_create_page_sections.sql` defining site section Markdown references.
- [X] T017 [P] Create migration `scripts/migrations/006_create_performance_snapshots.sql` storing Lighthouse metrics with constraints.
- [X] T018 Implement migration runner CLI scaffold in `scripts/manage_projects.py`, loading SQL files in order and wiring `init-db`/`migrate` commands.
- [X] T019 Implement content ingestion and upsert logic in `scripts/manage_projects.py sync`, including YAML parsing, tag normalisation, and SQLite writes.
- [X] T020 Emit JSON cache (`data/cache/projects.json`) and sync report (`reports/content-sync.json`) within `scripts/manage_projects.py` per contract outputs.
- [X] T021 Build Jinja templates `templates/base.html`, `templates/index.html`, `templates/project.html`, and shared partials to reflect the standardised layout.
- [X] T022 Implement static site renderer in `scripts/build_site.py` to pull SQLite data, render templates, inject Open Graph metadata, and write `dist/` artefacts plus `dist/manifest.json`.
- [X] T023 Extend static build to enforce chronological ordering, handle zero-state messaging, and swap in placeholders when assets are missing.
- [X] T024 Implement validator CLI in `scripts/validate_assets.py` enforcing asset size limits, alt text coverage, and generating `reports/assets.json`.
- [X] T025 Wire Playwright test entry in `tests/playwright.config.ts`, including device emulation for mobile viewport and tagging accessibility marks.
- [X] T026 Add Lighthouse configuration in `lighthouse.config.js` with budgets (LCP ≤ 1.5s, critical assets ≤ 100KB) and CI upload settings.
- [X] T027 Update `pytest.ini` (or create if missing) to register accessibility marker, Playwright options, and default coverage thresholds.

## Phase 3.4: Integration

- [X] T028 Connect build + validation pipeline in `scripts/build_site.py` and `scripts/validate_assets.py` so validation runs automatically post-build when invoked from CI script.
- [X] T029 Prepare GitHub Actions workflow `.github/workflows/ci.yml` running Python tests, Playwright axe checks, Lighthouse CI, and uploading reports.
- [X] T030 Seed exemplar project content under `content/projects/sample-project/` (narrative Markdown, `project.yaml`, hero/gallery placeholders) to exercise automated flow.

## Phase 3.5: Polish

- [X] T031 [P] Update existing HTML pages (`index.html`, `projects/index.html`, etc.) to delegate to generated output or redirect to `dist/`, ensuring no duplicate sources.
- [X] T032 [P] Refresh `README.md` and `specs/001-build-the-protofolio/quickstart.md` with final command references, CI status, and placeholder guidance.
- [X] T033 [P] Run full quickstart (venv bootstrap → sync → build → tests) documenting outcomes in `reports/build-summary.json` and commit artefacts.

## Dependencies

- T004–T011 must complete (tests failing) before starting T012.
- T012–T017 provide schema foundations and must finish before T018–T024 modify the scripts consuming them.
- T021 precedes T022–T023; templates must exist before renderer implementation.
- T022 and T024 must complete before T028 integrates build + validation.
- T028 must pass before T029 (CI workflow) to ensure composite command availability.
- T029 must complete before T033 final verification run.

## Parallel Example

```bash
# Launch T004-T011 together once setup is done:
task run T004
task run T005
task run T006
task run T007
task run T008
task run T009
task run T010
task run T011

# After schema migrations (T012-T017) finish, run these in parallel:
task run T021
task run T024
task run T025
```

## Notes

- [P] tasks target distinct files to allow true parallelism per constitution guidelines.
- Commit after completing each task; ensure tests added in Phase 3.2 fail before implementation tasks begin.
- Maintain chronological project ordering and accessibility budgets throughout implementation.
