# Migration Validation Contracts

**Feature**: 003-review-fix-and  
**Date**: 2025-10-06  
**Reference**: Feature 002 validation contracts  

---

## Overview

This feature uses the **exact same validation contracts** established in Feature 002 (migrate-existing-portfolio). No new validation gates or contracts required.

---

## Complete Contract Documentation

**Location**: `specs/002-migrate-existing-portfolio/contracts/migration-validation.md`

---

## Validation Gates (6 per project)

### Gate 1: File Structure Check

**Contract**: Project directory must contain required files

```
content/projects/{slug}/
├── project.yaml       ← REQUIRED
├── narrative.md       ← REQUIRED
└── assets/           ← REQUIRED (can be empty)
```

**Validation Method**: File system check

---

### Gate 2: Metadata Schema Validation

**Contract**: `project.yaml` must parse and contain required fields

**Required Fields**:
- `slug` (string, URL-safe)
- `title` (string, non-empty)
- `summary` (string, non-empty)
- `description_path` (string, value="narrative.md")
- `published_on` (string, ISO date format YYYY-MM-DD)
- `tags` (list, at least 1 tag)

**Validation Method**: `python scripts/manage_projects.py sync --validate-only --slug {slug}`

---

### Gate 3: Narrative Quality Check

**Contract**: `narrative.md` must follow quality standards

**Requirements**:
- Valid Markdown syntax
- Headings start at H2 (##) for semantic hierarchy
- Minimum 500 words of content
- No broken internal links
- Asset references use correct relative paths (`./assets/`)

**Validation Method**: Manual review + Markdown linting

---

### Gate 4: Database Sync Validation

**Contract**: Project syncs to database without errors

**Validation Method**: `python scripts/manage_projects.py sync --validate-only`

**Success Criteria**:
- YAML parses without errors
- All required fields present
- No duplicate slugs
- Foreign key constraints satisfied

---

### Gate 5: Build Success Validation

**Contract**: Static site builds successfully with new project

**Validation Method**: `python scripts/build_site.py --validate`

**Success Criteria**:
- Build completes without errors
- Project page generated at `dist/projects/{slug}/index.html`
- Assets copied correctly
- Build time <5 seconds
- Asset validation passes (images <500KB, valid formats)

---

### Gate 6: Visual Inspection

**Contract**: Project renders correctly in browser

**Validation Method**: Manual check at `http://localhost:8000/projects/{slug}/`

**Requirements**:
- Page loads without errors
- Navigation works
- Images display correctly
- Metadata displays properly
- Responsive design functions
- No console errors

---

## Projects to Validate

### Project 1: home-assistant-automation-analysis

**Enhanced Content**: ENHANCED_CONTENT_CAPSTONE.md  
**Original Source**: bader1919.github.io-main/projects/capstone/

**Validation Checklist**:
- [ ] Gate 1: File structure
- [ ] Gate 2: Metadata schema
- [ ] Gate 3: Narrative quality (1,850 words)
- [ ] Gate 4: Database sync
- [ ] Gate 5: Build success
- [ ] Gate 6: Visual inspection

### Project 2: sql-fundamentals-advanced-techniques

**Enhanced Content**: ENHANCED_CONTENT_SQL.md  
**Original Source**: bader1919.github.io-main/projects/sql-resources/

**Validation Checklist**:
- [ ] Gate 1: File structure
- [ ] Gate 2: Metadata schema
- [ ] Gate 3: Narrative quality (2,100 words)
- [ ] Gate 4: Database sync
- [ ] Gate 5: Build success
- [ ] Gate 6: Visual inspection

---

## Success Criteria

**Feature 003 Complete When**:
- Both projects pass all 6 validation gates
- Database contains 8 total projects (verified query)
- Build produces 9 pages (index + 8 project pages)
- Website tests locally without errors
- Changes pushed to GitHub successfully

---

## References

- Feature 002 contracts: `specs/002-migrate-existing-portfolio/contracts/migration-validation.md`
- Migration checklists (Feature 002): `specs/002-migrate-existing-portfolio/migration-checklists.md`
- Constitution v1.1.0: `.specify/memory/constitution.md` (Content Migration Workflow)
