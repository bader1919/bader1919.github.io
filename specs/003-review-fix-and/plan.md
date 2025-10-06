# Implementation Plan: Review, Fix, and Migrate Remaining Projects

**Branch**: `003-review-fix-and` | **Date**: 2025-10-06 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/003-review-fix-and/spec.md`

## Execution Flow (/plan command scope)
```
1. Load feature spec from Input path
   → ✅ Loaded successfully
2. Fill Technical Context (scan for NEEDS CLARIFICATION)
   → ✅ Project Type: Static site generation (Python + HTML/CSS)
   → ✅ Structure Decision: Single Python project with content management
3. Fill the Constitution Check section
   → ✅ Completed based on constitution v1.1.0
4. Evaluate Constitution Check section
   → ✅ No violations - follows Content Migration Workflow
   → ✅ Progress Tracking: Initial Constitution Check PASSED
5. Execute Phase 0 → research.md
   → ✅ No unknowns - leveraging Feature 002 migration workflow
6. Execute Phase 1 → contracts, data-model.md, quickstart.md, .github/copilot-instructions.md
   → ✅ Data model exists (from Feature 001)
   → ✅ Migration contracts exist (from Feature 002)
   → ✅ Quickstart workflow documented
7. Re-evaluate Constitution Check section
   → ✅ No new violations
   → ✅ Progress Tracking: Post-Design Constitution Check PASSED
8. Plan Phase 2 → Describe task generation approach
   → ✅ Task generation strategy documented
9. STOP - Ready for /tasks command
```

## Summary

This feature completes the portfolio migration by reviewing, enhancing, and migrating the final two projects (capstone and sql-resources) to the content management system established in Feature 001-002. The technical approach follows the proven migration workflow from Feature 002, with added quality gates for content enhancement and user approval before migration execution.

**Primary Requirements**:
- Review existing project content quality (capstone HTML slideshow, sql-resources PDFs)
- Generate enhanced content with improved narratives (user approval required)
- Migrate approved content using Feature 002 workflow
- Test complete website with 8 total projects
- Deploy to GitHub repository

**Technical Approach**:
- Leverage existing `manage_projects.py` and `build_site.py` scripts
- Follow constitution's Content Migration Workflow (9 steps)
- Use validation gates from Feature 002 (file structure, metadata, database, build)
- Create migration checklists for quality tracking
- User approval gate before migration execution (Phase 2 FR-010 to FR-012)

## Technical Context

**Language/Version**: Python 3.11  
**Primary Dependencies**: python-markdown, PyYAML, Pillow, Jinja2, pytest, Playwright  
**Storage**: SQLite database (`data/portfolio.db`) with deterministic migrations  
**Testing**: pytest (unit tests), Playwright + axe-core (E2E + accessibility)  
**Target Platform**: Static site generation → GitHub Pages deployment  
**Project Type**: Single Python project (static site generator with content management)  
**Performance Goals**: Build time <5 seconds for 8 projects, LCP <1.5s  
**Constraints**: Follow constitution's Content Migration Workflow, maintain accessibility (WCAG 2.1 AA)  
**Scale/Scope**: 8 total projects (1 sample + 5 from Feature 002 + 2 from this feature)

**User-Provided Context**:
- Phase 1 & 2 already complete with user approval
- Capstone project: Home Assistant automation analysis (HTML slideshow → narrative)
- SQL resources: Learning journey project (PDFs → narrative)
- Enhanced content generated and approved
- Ready for migration execution (Phase 3-5)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**Quality-First Codebase**: ✅
- Reuses existing semantic HTML templates from Feature 001
- Maintains modular CSS with no duplication
- Enhanced narratives follow proper heading hierarchy (H2+)
- All content changes documented in migration checklists

**Test-Driven Insights**: ✅
- Validation gates: file structure, metadata schema, database sync, build success
- Accessibility audits via Playwright + axe-core (existing from Feature 001)
- Migration checklists track quality gates per project
- Manual visual inspection at localhost:8000 before deployment

**Consistent Experience**: ✅
- Uses established Jinja2 templates for project pages
- Maintains responsive breakpoints from Feature 001
- All projects follow same narrative structure (problem → approach → findings → impact)
- Metadata schema consistent across all 8 projects

**Performance Transparency**: ✅
- Build validation confirms <5s build time
- Asset validation checks image sizes
- Performance budget maintained: LCP <1.5s, critical path <100KB
- Build metrics logged: "Built 8 projects, 8 pages in 0.XXs"

**Implementation Constraints**: ✅
- Data provenance: Original files in `bader1919.github.io-main/projects/` (read-only)
- Accessibility: Templates already WCAG 2.1 AA compliant
- No new dependencies required
- Follow existing migration workflow from constitution v1.1.0

## Project Structure

### Documentation (this feature)

```
specs/003-review-fix-and/
├── spec.md                           # Feature specification (✅ complete)
├── plan.md                           # This file (Phase 0-1 output)
├── research.md                       # Phase 0 output (N/A - no unknowns)
├── data-model.md                     # Reference to Feature 001 data model
├── quickstart.md                     # Phase 1 output (migration quickstart)
├── contracts/                        # Phase 1 output (validation contracts)
│   └── migration-validation.md       # Reference to Feature 002 contracts
├── CAPSTONE_REVIEW_REPORT.md        # Phase 1 review (✅ complete)
├── SQL_RESOURCES_REVIEW_REPORT.md   # Phase 1 review (✅ complete)
├── ENHANCED_CONTENT_CAPSTONE.md     # Phase 2 output (✅ complete)
├── ENHANCED_CONTENT_SQL.md          # Phase 2 output (✅ complete)
├── APPROVAL_REQUIRED.md             # Phase 2 approval doc (✅ complete)
├── PROGRESS_TRACKER.md              # Progress tracking (✅ updated)
└── tasks.md                          # Phase 2 output (/tasks command - pending)
```

### Source Code (repository root)

```
content/projects/
├── sample-project/                   # From Feature 001
├── airbnb-cape-town-analysis/        # From Feature 002
├── ba-service-quality-review/        # From Feature 002
├── customer-churn-analysis/          # From Feature 002
├── global-food-supply-chain/         # From Feature 002
├── kickstarter-growth-analysis/      # From Feature 002
├── home-assistant-automation-analysis/  # THIS FEATURE (Phase 3)
│   ├── project.yaml
│   ├── narrative.md
│   └── assets/
│       └── home-assistant-dashboard.png
└── sql-fundamentals-advanced-techniques/  # THIS FEATURE (Phase 3)
    ├── project.yaml
    ├── narrative.md
    └── assets/
        └── sql-learning-path.png

bader1919.github.io-main/projects/
├── capstone/                         # Original (read-only)
│   ├── index.html
│   ├── final.ipynb
│   ├── orgnized.ipynb
│   ├── dbquery/SQL.sql
│   └── power_point/The Power of Data.pptx
└── sql-resources/                    # Original (read-only)
    ├── README.md
    ├── annotated-TheBasics.pdf
    ├── annotated-Column-Operations.pdf
    └── annotated.pdf

scripts/
├── manage_projects.py                # Existing from Feature 001
├── build_site.py                     # Existing from Feature 001
└── validate_assets.py                # Existing from Feature 001

data/
└── portfolio.db                      # SQLite database (6→8 projects)

dist/                                 # Built static site (7→9 pages)
└── projects/
    ├── home-assistant-automation-analysis/
    └── sql-fundamentals-advanced-techniques/
```

**Structure Decision**: Single Python project with content management system. This feature extends the existing structure from Features 001-002 by adding two new project directories in `content/projects/` following the established pattern: `project.yaml` + `narrative.md` + `assets/` subdirectory.

## Phase 0: Outline & Research

✅ **Status**: Complete

**No Unknowns Identified**: All technical decisions resolved by reusing proven Feature 002 migration workflow.

**Research Completed**:
1. Migration workflow approach (Feature 002 proven successful with 5 projects)
2. Content enhancement strategy (user approval gate before migration)
3. Tools & scripts assessment (existing scripts sufficient, no modifications needed)
4. Validation strategy (6-gate validation per project from Feature 002)
5. Thumbnail handling (placeholders acceptable, can enhance later)

**Key Decisions Documented** in `research.md`:
- **Decision 1**: Reuse Feature 002 Content Migration Workflow (constitution v1.1.0)
- **Decision 2**: Generate enhanced content with user approval gate
- **Decision 3**: Use existing manage_projects.py and build_site.py (no mods)
- **Decision 4**: Six-gate validation per project
- **Decision 5**: Create simple thumbnails/placeholders

**No Technology Changes**: All functionality achievable with existing stack (Python 3.11, python-markdown, PyYAML, Pillow, Jinja2, SQLite, pytest, Playwright)

**Output**: ✅ `research.md` created with complete analysis

## Phase 1: Design & Contracts

✅ **Status**: Complete

**Prerequisites**: ✅ research.md complete

**Phase 1 Deliverables**:

### 1. Data Model

✅ **Created**: `data-model.md`

**Summary**: No changes to existing data model from Feature 001. SQLite schema supports all Feature 003 requirements (8 projects total, existing YAML schema with optional `links` field).

### 2. Validation Contracts

✅ **Created**: `contracts/migration-validation.md`

**Summary**: Reuses Feature 002 validation contracts exactly. Six-gate validation per project:
1. File structure check
2. Metadata schema validation
3. Narrative quality check
4. Database sync validation
5. Build success validation
6. Visual inspection

### 3. Quickstart Guide

✅ **Created**: `quickstart.md`

**Summary**: Complete step-by-step migration workflow (Phases 3-5):
- Phase 3: Migration Execution (7 steps, 10-15 min)
- Phase 4: Testing & QA (3 steps, 5 min)
- Phase 5: GitHub Deployment (3 steps, 3 min)
- Includes validation commands, success criteria, troubleshooting

### 4. Agent Context Update

✅ **Updated**: `.github/copilot-instructions.md`

**Changes Applied**:
- Added Python 3.11 + python-markdown, PyYAML, Pillow, Jinja2, pytest, Playwright
- Added SQLite database context
- Updated project structure with Feature 003 additions
- Documented content migration workflow

**Script Used**: `.specify/scripts/powershell/update-agent-context.ps1 -AgentType copilot`

### 5. Enhanced Content (Phase 1 & 2 Already Complete)

✅ **Phase 1 Review Reports**:
- `CAPSTONE_REVIEW_REPORT.md` (280 lines) - Issues identified, improvements recommended
- `SQL_RESOURCES_REVIEW_REPORT.md` (249 lines) - Portfolio fit analysis, migration options

✅ **Phase 2 Enhanced Content** (User Approved):
- `ENHANCED_CONTENT_CAPSTONE.md` (285 lines) - Complete project.yaml + narrative.md
- `ENHANCED_CONTENT_SQL.md` (340 lines) - Complete project.yaml + narrative.md
- `APPROVAL_REQUIRED.md` (200 lines) - Approval summary and checklist

**Content Statistics**:
- Capstone narrative: ~1,850 words, 8 sections
- SQL narrative: ~2,100 words with code examples
- Total new portfolio content: ~4,000 words

**Output**: ✅ All Phase 1 artifacts created, constitution check passed

## Phase 2: Task Planning Approach

*This section describes what the /tasks command will do - DO NOT execute during /plan*

**Task Generation Strategy**:

The `/tasks` command will generate implementation tasks based on the quickstart guide workflow and validation contracts.

**Task Categories**:

1. **Content Creation Tasks** (Phase 3: Migration Execution):
   - Create directory structures for both projects
   - Create project.yaml files from enhanced content
   - Create narrative.md files from enhanced content
   - Create thumbnail images or placeholders
   - Each task references specific enhanced content files

2. **Validation Tasks** (Phase 3: Validation Gates):
   - Run validation: `manage_projects.py sync --validate-only`
   - Fix any YAML or content errors
   - Verify metadata schema compliance

3. **Database & Build Tasks** (Phase 3: Sync & Build):
   - Sync projects to database
   - Verify database count (expect 8 projects)
   - Build static site with validation
   - Verify build output (expect 9 pages)

4. **Testing Tasks** (Phase 4: QA):
   - Start local preview server
   - Test homepage (8 projects visible)
   - Test capstone project page
   - Test SQL resources project page
   - Test navigation and responsive design
   - Create migration checklist document

5. **Deployment Tasks** (Phase 5: GitHub):
   - Stage all changes
   - Commit with descriptive message
   - Push to remote branch
   - Verify remote deployment

**Task Dependencies**:
- Content creation → Validation → Database sync → Build → Testing → Deployment
- Sequential workflow (not parallelizable due to dependencies)
- Each phase gates the next (validation must pass before sync, build must pass before testing)

**Ordering Strategy**:
- Follow quickstart.md step-by-step (Steps 1-12)
- Group by phase (3, 4, 5)
- Include validation checkpoints after each major step
- Final verification task confirms all success criteria met

**Estimated Task Count**: 20-25 tasks

**Estimated Output**: tasks.md with numbered tasks following quickstart workflow

---

**IMPORTANT**: The `/tasks` command will execute this approach. The `/plan` command stops here.

## Phase 3+: Future Implementation
*These phases are beyond the scope of the /plan command*

**Phase 3**: Task execution (/tasks command creates tasks.md)  
**Phase 4**: Implementation (execute tasks.md following constitutional principles)  
**Phase 5**: Validation (run tests, execute quickstart.md, performance validation)

## Complexity Tracking

*Fill ONLY if Constitution Check has violations that must be justified*

**No Violations Detected**: ✅

All constitutional principles satisfied:
- Quality-First Codebase: Reusing proven templates, no code duplication
- Test-Driven Insights: Six validation gates per project
- Consistent Experience: Existing Jinja2 templates maintained
- Performance Transparency: Build time monitoring, asset validation
- Implementation Constraints: Data provenance documented, accessibility maintained

**No Complexity Deviations**: This feature follows established patterns from Features 001-002 exactly.

---

## Progress Tracking

*This checklist is updated during execution flow*

**Phase Status**:
- [x] Phase 0: Research complete (/plan command) ✅
- [x] Phase 1: Design complete (/plan command) ✅
- [x] Phase 2: Task planning complete (/plan command - approach documented) ✅
- [ ] Phase 3: Tasks generated (/tasks command - NEXT STEP)
- [ ] Phase 4: Implementation complete
- [ ] Phase 5: Validation passed

**Gate Status**:
- [x] Initial Constitution Check: PASS ✅
- [x] Post-Design Constitution Check: PASS ✅
- [x] All NEEDS CLARIFICATION resolved (N/A - no unknowns) ✅
- [x] Complexity deviations documented (N/A - no deviations) ✅

**Artifacts Created**:
- [x] research.md ✅
- [x] data-model.md ✅
- [x] contracts/migration-validation.md ✅
- [x] quickstart.md ✅
- [x] .github/copilot-instructions.md (updated) ✅
- [x] CAPSTONE_REVIEW_REPORT.md ✅
- [x] SQL_RESOURCES_REVIEW_REPORT.md ✅
- [x] ENHANCED_CONTENT_CAPSTONE.md ✅
- [x] ENHANCED_CONTENT_SQL.md ✅
- [x] APPROVAL_REQUIRED.md ✅
- [x] tasks.md ✅

**Status**: ✅ Planning complete - Ready for task execution

---

*Based on Constitution v1.1.0 - See `.specify/memory/constitution.md`*
