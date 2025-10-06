
# Implementation Plan: [FEATURE]

**Branch**: `[###-feature-name]` | **Date**: [DATE] | **Spec**: [link]
**Input**: Feature specification from `/specs/[###-feature-name]/spec.md`

## Execution Flow (/plan command scope)
```
1. Load feature spec from Input path
   → If not found: ERROR "No feature spec at {path}"
2. Fill Technical Context (scan for NEEDS CLARIFICATION)
   → Detect Project Type from file system structure or context (web=frontend+backend, mobile=app+api)
   → Set Structure Decision based on project type
3. Fill the Constitution Check section based on the content of the constitution document.
4. Evaluate Constitution Check section below
   → If violations exist: Document in Complexity Tracking
   → If no justification possible: ERROR "Simplify approach first"
   → Update Progress Tracking: Initial Constitution Check
5. Execute Phase 0 → research.md
   → If NEEDS CLARIFICATION remain: ERROR "Resolve unknowns"
6. Execute Phase 1 → contracts, data-model.md, quickstart.md, agent-specific template file (e.g., `CLAUDE.md` for Claude Code, `.github/copilot-instructions.md` for GitHub Copilot, `GEMINI.md` for Gemini CLI, `QWEN.md` for Qwen Code, or `AGENTS.md` for all other agents).
7. Re-evaluate Constitution Check section
   → If new violations: Refactor design, return to Phase 1
   → Update Progress Tracking: Post-Design Constitution Check
8. Plan Phase 2 → Describe task generation approach (DO NOT create tasks.md)
9. STOP - Ready for /tasks command
```

**IMPORTANT**: The /plan command STOPS at step 7. Phases 2-4 are executed by other commands:
- Phase 2: /tasks command creates tasks.md
- Phase 3-4: Implementation execution (manual or via tools)

## Summary
Implement a static-site generation workflow that organises portfolio projects chronologically, centralises metadata in SQLite, and renders HTML via shared templates while preserving existing assets. The approach uses lightweight Python tooling to transform Markdown narratives and prompts into accessible, performant pages suitable for GitHub Pages deployment.

## Technical Context

**Language/Version**: Python 3.11, HTML5, CSS3, vanilla ES6

**Primary Dependencies**: Jinja2, python-markdown, sqlite3 (stdlib), pytest, Playwright + axe-core, Lighthouse CI

**Storage**: SQLite database (`data/portfolio.db`) with deterministic migrations

**Testing**: pytest (unit/integration), pytest-playwright (accessibility), Lighthouse CI budgets

**Target Platform**: GitHub Pages (static hosting)

**Project Type**: Single (static site with generator scripts)

**Performance Goals**: Largest Contentful Paint ≤ 1.5s on cable profile; Lighthouse Performance ≥ 90

**Constraints**: No SPA framework or bundler; CSS/JS limited to existing `assets` files; hero ≤ 200KB, gallery ≤ 300KB; accessibility AA compliance

**Scale/Scope**: ~25 projects, each with narrative + assets, supporting growth to 50 without structural changes

## Constitution Check

> Gate: Must pass before Phase 0 research. Re-check after Phase 1 design.

- **Quality-First Codebase**: Templates enforce semantic sectioning (`<header>`, `<main>`, `<article>`), partials live in `components/`, and duplication is handled via Jinja includes plus shared CSS, satisfying the mandate for intentional structure.
- **Test-Driven Insights**: Unit tests will cover `scripts/manage_projects.py` sync logic and template helpers; Playwright+axe suites exercise key flows (home listing, project detail, contact), and Lighthouse CI ensures regressions surface pre-merge.
- **Consistent Experience**: Shared layout tokens (spacing, typography) remain in `assets/css/main.css`; component snippets for hero cards and project tiles reference the same CSS classes, preserving responsive breakpoints defined today.
- **Performance Transparency**: Budgets (hero ≤ 200KB, gallery ≤ 300KB, LCP ≤ 1.5s) are tracked in CI via asset validator and Lighthouse. Reports land in `reports/` for review, meeting transparency expectations.
- **Implementation Constraints**: SQLite acts as single source of truth with migration history; no new network dependencies introduced; placeholders + prompts documented for missing images, and accessibility alt text captured in metadata per constitution requirements.

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/plan command output)
├── research.md          # Phase 0 output (/plan command)
├── data-model.md        # Phase 1 output (/plan command)
├── quickstart.md        # Phase 1 output (/plan command)
├── contracts/           # Phase 1 output (/plan command)
└── tasks.md             # Phase 2 output (/tasks command - NOT created by /plan)
```

### Source Code (repository root)

```text
assets/
├── css/
│   ├── main.css
│   └── animations.css
├── img/
│   ├── project/<slug>/...
│   └── placeholder/
└── js/
   ├── main.js
   └── components.js

components/
├── header.html
└── footer.html

content/
└── projects/
   └── <slug>/
      ├── narrative.md
      ├── project.yaml
      └── assets/

data/
└── portfolio.db (generated)

scripts/
├── build_site.py
├── manage_projects.py
└── validate_assets.py

templates/
├── base.html
├── index.html
├── project.html
└── partials/

tests/
├── unit/
│   └── test_manage_projects.py
├── integration/
│   └── test_build_pipeline.py
└── accessibility/
   └── test_accessibility.spec.ts
```

**Structure Decision**: Single static-site workspace with Python helper scripts driving generation; directories above either exist or will be introduced to support content-driven builds.

## Phase 0: Outline & Research

1. **Extract unknowns from Technical Context** above:
   - For each NEEDS CLARIFICATION → research task
   - For each dependency → best practices task
   - For each integration → patterns task

2. **Generate and dispatch research agents**:

   ```text
   For each unknown in Technical Context:
     Task: "Research {unknown} for {feature context}"
   For each technology choice:
     Task: "Find best practices for {tech} in {domain}"
   ```

3. **Consolidate findings** in `research.md` using format:
   - Decision: [what was chosen]
   - Rationale: [why chosen]
   - Alternatives considered: [what else evaluated]

**Output**: research.md with all NEEDS CLARIFICATION resolved

## Phase 1: Design & Contracts

> Prerequisites: research.md complete

1. **Extract entities from feature spec** → `data-model.md`:
   - Entity name, fields, relationships
   - Validation rules from requirements
   - State transitions if applicable

2. **Generate API contracts** from functional requirements:
   - For each user action → endpoint
   - Use standard REST/GraphQL patterns
   - Output OpenAPI/GraphQL schema to `/contracts/`

3. **Generate contract tests** from contracts:
   - One test file per endpoint
   - Assert request/response schemas
   - Tests must fail (no implementation yet)

4. **Extract test scenarios** from user stories:
   - Each story → integration test scenario
   - Quickstart test = story validation steps

5. **Update agent file incrementally** (O(1) operation):
   - Run `.specify/scripts/powershell/update-agent-context.ps1 -AgentType copilot`
     **IMPORTANT**: Execute it exactly as specified above. Do not add or remove any arguments.
   - If exists: Add only NEW tech from current plan
   - Preserve manual additions between markers
   - Update recent changes (keep last 3)
   - Keep under 150 lines for token efficiency
   - Output to repository root

**Output**: data-model.md, /contracts/*, failing tests, quickstart.md, agent-specific file

## Phase 2: Task Planning Approach

> This section describes what the /tasks command will do - DO NOT execute during /plan

**Task Generation Strategy**:

- Load `.specify/templates/tasks-template.md` as base
- Generate tasks from Phase 1 design docs (contracts, data model, quickstart)
- Each contract → contract test task [P]
- Each entity → model creation task [P]
- Each user story → integration test task
- Implementation tasks to make tests pass

**Ordering Strategy**:

- TDD order: Tests before implementation
- Dependency order: Models before services before UI
- Mark [P] for parallel execution (independent files)

**Estimated Output**: 25-30 numbered, ordered tasks in tasks.md

**IMPORTANT**: This phase is executed by the /tasks command, NOT by /plan

## Phase 3+: Future Implementation

> These phases are beyond the scope of the /plan command

**Phase 3**: Task execution (/tasks command creates tasks.md)  
**Phase 4**: Implementation (execute tasks.md following constitutional principles)  
**Phase 5**: Validation (run tests, execute quickstart.md, performance validation)

## Complexity Tracking

> Fill ONLY if Constitution Check has violations that must be justified

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |


## Progress Tracking

> This checklist is updated during execution flow

**Phase Status**:

- [x] Phase 0: Research complete (/plan command)
- [x] Phase 1: Design complete (/plan command)
- [ ] Phase 2: Task planning complete (/plan command - describe approach only)
- [ ] Phase 3: Tasks generated (/tasks command)
- [ ] Phase 4: Implementation complete
- [ ] Phase 5: Validation passed

**Gate Status**:

- [x] Initial Constitution Check: PASS
- [x] Post-Design Constitution Check: PASS
- [x] All NEEDS CLARIFICATION resolved
- [ ] Complexity deviations documented

---
*Based on Constitution v1.0.0 - See `/memory/constitution.md`*
