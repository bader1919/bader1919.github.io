# Tasks: Content Migration

**Input**: Design documents from `/specs/002-migrate-existing-portfolio/`
**Prerequisites**: plan.md (required), research.md, data-model.md, contracts/, quickstart.md

## Execution Flow (main)

```text
1. Load plan.md from feature directory
   → Found: Content migration for 5 projects
   → Extract: Python 3.11, YAML, Markdown, existing build pipeline
2. Load design documents:
   → data-model.md: No schema changes (uses existing Feature 001 structure)
   → contracts/migration-validation.md: 6 validation gates per project
   → research.md: Manual conversion with validation approach
   → quickstart.md: 10-step migration workflow per project
3. Generate tasks by category:
   → Setup: Migration checklist file creation
   → Migration: 5 projects × 10 steps each = 50 tasks
   → Integration: Constitution update, final validation, documentation
4. Apply task rules:
   → Different projects = mark [P] for parallel
   → Same project steps = sequential (no [P])
   → Validation after each project migration
5. Number tasks sequentially (T001-T053)
6. Return: SUCCESS (53 tasks ready for execution)
```

## Format: `[ID] [P?] Description`

- **[P]**: Can run in parallel (different projects, no dependencies)
- Projects can be migrated in parallel; steps within a project are sequential

## Path Conventions

- Content destination: `content/projects/{slug}/`
- Original sources: `projects/{original-folder}/`
- Database: `data/portfolio.db`
- Build output: `dist/`

## Phase 3.1: Setup

- [x] T001 Create migration checklist tracking file at `specs/002-migrate-existing-portfolio/migration-checklists.md`

## Phase 3.2: Airbnb Cape Town Analysis Migration [P]

**Source**: `projects/Airbnb Market Analysis - Cape Town/`
**Target**: `content/projects/airbnb-cape-town-analysis/`

- [x] T002 [P] Create directory `content/projects/airbnb-cape-town-analysis/` and `content/projects/airbnb-cape-town-analysis/assets/`
- [x] T003 [P] Extract publication date using `git log --follow --format=%aI --reverse -- "projects/Airbnb Market Analysis - Cape Town" | head -1`
- [x] T004 [P] Create `content/projects/airbnb-cape-town-analysis/project.yaml` with metadata (title: "Airbnb Market Analysis - Cape Town", description from README, tags: Excel, Data Analytics, Market Research, Hospitality, published_date from T003)
- [x] T005 [P] Craft `content/projects/airbnb-cape-town-analysis/narrative.md` from README and AAMB & Co. - FINAL.pptx insights (headings start at H2, include sections: Overview, Business Challenge, Approach, Key Findings, Recommendations, Supporting Materials)
- [x] T006 [P] Copy relevant images to `content/projects/airbnb-cape-town-analysis/assets/` and update narrative.md references to use `./assets/` paths
- [x] T007 [P] Validate metadata with `python scripts/manage_projects.py sync --validate-only` (check for airbnb-cape-town-analysis)
- [x] T008 [P] Sync to database with `python scripts/manage_projects.py sync`
- [x] T009 [P] Build and validate with `python scripts/build_site.py --validate`
- [x] T010 [P] Visual inspection: Start preview server `python -m http.server -d dist 8000`, verify http://localhost:8000/projects/airbnb-cape-town-analysis/ (check thumbnail, narrative formatting, images, links to PPTX/XLSX)
- [x] T011 [P] Complete migration checklist in `specs/002-migrate-existing-portfolio/migration-checklists.md` and commit: `git add content/projects/airbnb-cape-town-analysis/ && git commit -m "Migrate airbnb-cape-town-analysis from legacy HTML structure"`

## Phase 3.3: BA Service Quality Review Migration [P]

**Source**: `projects/BA-Service-Quality-Review/`
**Target**: `content/projects/ba-service-quality-review/`

- [x] T012 [P] Create directory `content/projects/ba-service-quality-review/` and `content/projects/ba-service-quality-review/assets/`
- [x] T013 [P] Extract publication date using `git log --follow --format=%aI --reverse -- "projects/BA-Service-Quality-Review" | head -1`
- [x] T014 [P] Create `content/projects/ba-service-quality-review/project.yaml` with metadata (title: "British Airways Service Quality Review", description from README, tags: Excel, Tableau, Data Visualization, Customer Service, Aviation, published_date from T013)
- [x] T015 [P] Craft `content/projects/ba-service-quality-review/narrative.md` from README and annotated PDFs (headings start at H2, include sections: Overview, Business Challenge, Approach, Key Findings, Recommendations, Supporting Materials)
- [x] T016 [P] Copy relevant images to `content/projects/ba-service-quality-review/assets/` and update narrative.md references to use `./assets/` paths
- [x] T017 [P] Validate metadata with `python scripts/manage_projects.py sync --validate-only` (check for ba-service-quality-review)
- [x] T018 [P] Sync to database with `python scripts/manage_projects.py sync`
- [x] T019 [P] Build and validate with `python scripts/build_site.py --validate`
- [x] T020 [P] Visual inspection: Verify http://localhost:8000/projects/ba-service-quality-review/ (check thumbnail, narrative formatting, images, links to annotated PDFs)
- [x] T021 [P] Complete migration checklist in `specs/002-migrate-existing-portfolio/migration-checklists.md` and commit: `git add content/projects/ba-service-quality-review/ && git commit -m "Migrate ba-service-quality-review from legacy HTML structure"`

## Phase 3.4: Customer Churn Analysis Migration [P]

**Source**: `projects/Customer-Churn-Analysis/`
**Target**: `content/projects/customer-churn-analysis/`

- [x] T022 [P] Create directory `content/projects/customer-churn-analysis/` and `content/projects/customer-churn-analysis/assets/`
- [x] T023 [P] Extract publication date using `git log --follow --format=%aI --reverse -- "projects/Customer-Churn-Analysis" | head -1`
- [x] T024 [P] Create `content/projects/customer-churn-analysis/project.yaml` with metadata (title: "Customer Churn Analysis", description from README, tags: Tableau, Data Analytics, Customer Retention, Banking, published_date from T023)
- [x] T025 [P] Craft `content/projects/customer-churn-analysis/narrative.md` from README and tableau dashboard insights (headings start at H2, include sections: Overview, Business Challenge, Approach, Key Findings, Recommendations, Supporting Materials)
- [x] T026 [P] Copy relevant images to `content/projects/customer-churn-analysis/assets/` and update narrative.md references to use `./assets/` paths
- [x] T027 [P] Validate metadata with `python scripts/manage_projects.py sync --validate-only` (check for customer-churn-analysis)
- [x] T028 [P] Sync to database with `python scripts/manage_projects.py sync`
- [x] T029 [P] Build and validate with `python scripts/build_site.py --validate`
- [x] T030 [P] Visual inspection: Verify http://localhost:8000/projects/customer-churn-analysis/ (check thumbnail, narrative formatting, images, links to Excel data)
- [x] T031 [P] Complete migration checklist in `specs/002-migrate-existing-portfolio/migration-checklists.md` and commit: `git add content/projects/customer-churn-analysis/ && git commit -m "Migrate customer-churn-analysis from legacy HTML structure"`

## Phase 3.5: Global Food Supply Chain Migration [P]

**Source**: `projects/Global-Food-Supply-Chain/`
**Target**: `content/projects/global-food-supply-chain/`

- [x] T032 [P] Create directory `content/projects/global-food-supply-chain/` and `content/projects/global-food-supply-chain/assets/`
- [x] T033 [P] Extract publication date using `git log --follow --format=%aI --reverse -- "projects/Global-Food-Supply-Chain" | head -1`
- [x] T034 [P] Create `content/projects/global-food-supply-chain/project.yaml` with metadata (title: "Global Food Supply Chain Analysis", description from README, tags: Data Analytics, Supply Chain, Agriculture, Trade, published_date from T033)
- [x] T035 [P] Craft `content/projects/global-food-supply-chain/narrative.md` from README (headings start at H2, include sections: Overview, Business Challenge, Approach, Key Findings, Recommendations, Supporting Materials)
- [x] T036 [P] Copy `global-food-supply-chain.jpg` to `content/projects/global-food-supply-chain/assets/` and update narrative.md references to use `./assets/` paths
- [x] T037 [P] Validate metadata with `python scripts/manage_projects.py sync --validate-only` (check for global-food-supply-chain)
- [x] T038 [P] Sync to database with `python scripts/manage_projects.py sync`
- [x] T039 [P] Build and validate with `python scripts/build_site.py --validate`
- [x] T040 [P] Visual inspection: Verify http://localhost:8000/projects/global-food-supply-chain/ (check thumbnail, narrative formatting, images)
- [x] T041 [P] Complete migration checklist in `specs/002-migrate-existing-portfolio/migration-checklists.md` and commit: `git add content/projects/global-food-supply-chain/ && git commit -m "Migrate global-food-supply-chain from legacy HTML structure"`

## Phase 3.6: Kickstarter Growth Analysis Migration [P]

**Source**: `projects/Kickstarter Growth Analysis/`
**Target**: `content/projects/kickstarter-growth-analysis/`

- [x] T042 [P] Create directory `content/projects/kickstarter-growth-analysis/` and `content/projects/kickstarter-growth-analysis/assets/`
- [x] T043 [P] Extract publication date using `git log --follow --format=%aI --reverse -- "projects/Kickstarter Growth Analysis" | head -1`
- [x] T044 [P] Create `content/projects/kickstarter-growth-analysis/project.yaml` with metadata (title: "Kickstarter Growth Analysis (2009-2012)", description from README, tags: Excel, Data Analytics, Crowdfunding, Market Research, published_date from T043)
- [x] T045 [P] Craft `content/projects/kickstarter-growth-analysis/narrative.md` from README and annotated PPTX/XLSX insights (headings start at H2, include sections: Overview, Business Challenge, Approach, Key Findings, Recommendations, Supporting Materials)
- [x] T046 [P] Copy relevant images to `content/projects/kickstarter-growth-analysis/assets/` and update narrative.md references to use `./assets/` paths
- [x] T047 [P] Validate metadata with `python scripts/manage_projects.py sync --validate-only` (check for kickstarter-growth-analysis)
- [x] T048 [P] Sync to database with `python scripts/manage_projects.py sync`
- [x] T049 [P] Build and validate with `python scripts/build_site.py --validate`
- [x] T050 [P] Visual inspection: Verify http://localhost:8000/projects/kickstarter-growth-analysis/ (check thumbnail, narrative formatting, images, links to PPTX/XLSX)
- [x] T051 [P] Complete migration checklist in `specs/002-migrate-existing-portfolio/migration-checklists.md` and commit: `git add content/projects/kickstarter-growth-analysis/ && git commit -m "Migrate kickstarter-growth-analysis from legacy HTML structure"`

## Phase 3.7: Integration & Polish

- [x] T052 Update `.specify/memory/constitution.md` to version 1.1.0 with migration workflow documentation (add section: "Content Migration Workflow" describing 10-step process from quickstart.md)
- [x] T053 Final validation: Run `python scripts/manage_projects.py sync && python scripts/build_site.py --validate`, verify database has 6 projects total (1 sample + 5 migrated), verify all projects display at http://localhost:8000/projects/

## Dependencies

- T001 (setup) must complete before any migration tasks
- Each project's steps (T002-T011, T012-T021, etc.) must run sequentially within that project
- Projects can run in parallel (Phases 3.2-3.6 are independent)
- T052-T053 (integration) require all migration phases (3.2-3.6) complete

## Parallel Execution Example

Projects can be migrated simultaneously:

```bash
# All 5 projects can start in parallel
# Project 1: Airbnb (T002-T011)
# Project 2: BA Service Quality (T012-T021)
# Project 3: Customer Churn (T022-T031)
# Project 4: Global Food Supply Chain (T032-T041)
# Project 5: Kickstarter (T042-T051)
```

Each project follows the 10-step quickstart workflow:

1. Create directory structure
2. Extract publication date
3. Create project.yaml
4. Craft narrative.md
5. Copy image assets
6. Validate metadata
7. Sync to database
8. Build and validate
9. Visual inspection
10. Complete checklist and commit

## Notes

- **[P] on project phases**: Different projects can be migrated in parallel
- **No [P] on steps within a project**: Sequential workflow ensures validation gates are met
- Original files in `projects/` remain unchanged (read-only)
- Large assets (PPTX, XLSX, PDF) stay in original location, linked via relative paths
- Images referenced in narratives move to `content/projects/{slug}/assets/`
- Each project must pass all 6 validation gates (per contracts/migration-validation.md)
- Final database count: 7 projects (2 sample + 5 migrated)

## Validation Checklist

*GATE: Must pass before marking feature complete*

- [x] All 5 projects have complete directory structure (project.yaml + narrative.md + assets/)
- [x] All projects synced to database (verified with SQL query)
- [x] Build pipeline succeeds with `--validate` flag
- [x] All 5 migration checklists completed in migration-checklists.md
- [x] Constitution updated to version 1.1.0
- [x] Visual inspection passed for all 5 project pages
- [x] Performance budget maintained (build time < 1s per project)
