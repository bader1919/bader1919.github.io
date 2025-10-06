# Quickstart: Migrate Remaining Projects (Feature 003)

**Feature**: 003-review-fix-and  
**Date**: 2025-10-06  
**Prerequisites**: Enhanced content approved (APPROVAL_REQUIRED.md)  

---

## Overview

This quickstart guide provides step-by-step instructions to migrate the final two projects (home-assistant-automation-analysis and sql-fundamentals-advanced-techniques) to the portfolio content management system.

**Estimated Time**: 20-25 minutes  
**Success Criteria**: 8 projects in database, website builds successfully, changes pushed to GitHub

---

## Prerequisites

✅ **Before Starting**:
- [ ] Virtual environment activated: `.\.venv\Scripts\Activate.ps1`
- [ ] On branch `003-review-fix-and`
- [ ] User approved enhanced content (see APPROVAL_REQUIRED.md)
- [ ] Enhanced content files ready:
  - ENHANCED_CONTENT_CAPSTONE.md
  - ENHANCED_CONTENT_SQL.md

---

## Phase 3: Migration Execution (10-15 minutes)

### Step 1: Create Directory Structures

```powershell
# Create project directories
New-Item -ItemType Directory -Path "content\projects\home-assistant-automation-analysis\assets" -Force
New-Item -ItemType Directory -Path "content\projects\sql-fundamentals-advanced-techniques\assets" -Force
```

**Validation**: Verify directories exist

---

### Step 2: Create project.yaml Files

**From**: ENHANCED_CONTENT_CAPSTONE.md section "Enhanced project.yaml"  
**To**: `content/projects/home-assistant-automation-analysis/project.yaml`

**From**: ENHANCED_CONTENT_SQL.md section "Enhanced project.yaml"  
**To**: `content/projects/sql-fundamentals-advanced-techniques/project.yaml`

**Validation**: Both files created with correct YAML syntax

---

### Step 3: Create narrative.md Files

**From**: ENHANCED_CONTENT_CAPSTONE.md section "Enhanced narrative.md"  
**To**: `content/projects/home-assistant-automation-analysis/narrative.md`

**From**: ENHANCED_CONTENT_SQL.md section "Enhanced narrative.md"  
**To**: `content/projects/sql-fundamentals-advanced-techniques/narrative.md`

**Validation**: Both files created, minimum 500 words each

---

### Step 4: Create Thumbnail Placeholders

```powershell
# Create simple placeholder images (or use custom thumbnails)
# For capstone: home-assistant-dashboard.png (800x600)
# For SQL: sql-learning-path.png (800x600)
```

**Options**:
- Create custom thumbnails (recommended)
- Use placeholder images temporarily
- Skip for now (add later)

**Validation**: Thumbnails exist in respective assets/ directories (or noted as TODO)

---

### Step 5: Validate Content (Before Sync)

```powershell
# Activate virtual environment if not already active
.\.venv\Scripts\Activate.ps1

# Validate capstone project
python scripts/manage_projects.py sync --validate-only

# Check for errors in output
```

**Expected Output**: Validation passes, no errors reported

**If Errors**: Fix YAML syntax or missing fields, re-run validation

---

### Step 6: Sync to Database

```powershell
# Sync projects to database
python scripts/manage_projects.py sync

# Expected output:
# "Processing projects from content/projects"
# "Synced 8 projects successfully"
```

**Validation**: Database contains 8 projects

```powershell
# Verify project count
python -c "import sqlite3; conn = sqlite3.connect('data/portfolio.db'); print('Projects:', conn.execute('SELECT COUNT(*) FROM projects').fetchone()[0]); conn.close()"
```

**Expected**: `Projects: 8`

---

### Step 7: Build Static Site with Validation

```powershell
# Build site with asset validation
python scripts/build_site.py --validate

# Expected output:
# "Building site..."
# "Asset validation: PASSED"
# "Built 8 projects, 9 pages in 0.XXs"
```

**Validation**: Build completes successfully, all pages generated

---

## Phase 4: Testing & QA (5 minutes)

### Step 8: Start Local Server

```powershell
# Start local preview server
python -m http.server -d dist 8000

# Open in browser: http://localhost:8000
```

**Validation Tests**:

1. **Homepage**:
   - [ ] Loads without errors
   - [ ] Shows 8 projects (excluding sample)
   - [ ] Navigation works

2. **Capstone Project** (`/projects/home-assistant-automation-analysis/`):
   - [ ] Page loads
   - [ ] Title: "Home Assistant Automation Performance Analysis"
   - [ ] Narrative renders correctly
   - [ ] Links to notebooks/SQL/PowerPoint work
   - [ ] Thumbnail displays (or placeholder noted)
   - [ ] No console errors

3. **SQL Resources Project** (`/projects/sql-fundamentals-advanced-techniques/`):
   - [ ] Page loads
   - [ ] Title: "SQL Fundamentals & Advanced Techniques"
   - [ ] Narrative renders correctly
   - [ ] Links to PDF guides work
   - [ ] Thumbnail displays (or placeholder noted)
   - [ ] No console errors

4. **Navigation**:
   - [ ] Project links work from homepage
   - [ ] Back navigation works
   - [ ] Responsive design functions

**Stop server**: `Ctrl+C`

---

### Step 9: Create Migration Checklist

Create `specs/003-review-fix-and/migration-checklist.md`:

```markdown
# Migration Validation Checklist

## Project 1: home-assistant-automation-analysis

- [x] Gate 1: File structure complete
- [x] Gate 2: Metadata schema valid
- [x] Gate 3: Narrative quality (1,850 words)
- [x] Gate 4: Database sync successful
- [x] Gate 5: Build passed (9 pages)
- [x] Gate 6: Visual inspection passed

## Project 2: sql-fundamentals-advanced-techniques

- [x] Gate 1: File structure complete
- [x] Gate 2: Metadata schema valid
- [x] Gate 3: Narrative quality (2,100 words)
- [x] Gate 4: Database sync successful
- [x] Gate 5: Build passed (9 pages)
- [x] Gate 6: Visual inspection passed

**Status**: ✅ Both projects validated successfully
**Database Count**: 8 projects
**Build Result**: 9 pages in <5s
**Date**: 2025-10-06
```

---

## Phase 5: GitHub Deployment (3 minutes)

### Step 10: Commit Changes

```powershell
# Stage all changes
git add content/projects/home-assistant-automation-analysis/
git add content/projects/sql-fundamentals-advanced-techniques/
git add specs/003-review-fix-and/migration-checklist.md
git add data/portfolio.db

# Commit with descriptive message
git commit -m "feat: migrate capstone and SQL resources projects

- Add home-assistant-automation-analysis (Home Assistant automation performance analysis)
- Add sql-fundamentals-advanced-techniques (SQL learning journey)
- Enhanced content with comprehensive narratives
- Database updated: 8 total projects
- Build validated: 9 pages generated

Feature 003 complete: All portfolio projects migrated"
```

**Validation**: Commit created successfully

---

### Step 11: Push to GitHub

```powershell
# Push branch to remote
git push origin 003-review-fix-and

# Expected: Push successful
```

**Validation**: Branch pushed, no errors

---

### Step 12: Verify Remote

1. Open repository on GitHub
2. Navigate to branch `003-review-fix-and`
3. Verify files exist:
   - `content/projects/home-assistant-automation-analysis/`
   - `content/projects/sql-fundamentals-advanced-techniques/`
4. Check commit message

---

## Success Checklist

**Feature 003 Complete When**:

- [x] Phase 1: Content Review & Analysis completed
- [x] Phase 2: Content Enhancement completed
- [x] Phase 3: Migration Execution completed
  - [x] Directory structures created
  - [x] project.yaml files created
  - [x] narrative.md files created
  - [x] Thumbnails created/noted
  - [x] Validation passed
  - [x] Database synced (8 projects)
  - [x] Site built (9 pages)
- [x] Phase 4: Testing & QA completed
  - [x] Local preview tested
  - [x] All pages render correctly
  - [x] Navigation works
  - [x] No console errors
  - [x] Migration checklist created
- [x] Phase 5: GitHub Deployment completed
  - [x] Changes committed
  - [x] Branch pushed
  - [x] Remote verified

**Final Status**: ✅ All 8 projects successfully migrated and deployed!

---

## Troubleshooting

### Database Sync Errors

**Problem**: `python scripts/manage_projects.py sync` fails

**Solutions**:
1. Check YAML syntax: `python -c "import yaml; yaml.safe_load(open('content/projects/{slug}/project.yaml'))"`
2. Verify required fields present
3. Check for duplicate slugs
4. Run with `--validate-only` first

### Build Failures

**Problem**: `python scripts/build_site.py --validate` fails

**Solutions**:
1. Check Markdown syntax in narrative.md
2. Verify asset paths (relative: `./assets/`)
3. Check image file sizes (<500KB)
4. Review build error messages

### Missing Projects

**Problem**: Website shows fewer than 8 projects

**Solutions**:
1. Verify database: `SELECT COUNT(*) FROM projects`
2. Check `status` field (must be "published", not "draft")
3. Re-run sync: `python scripts/manage_projects.py sync`
4. Rebuild: `python scripts/build_site.py`

---

## Rollback Procedure

If migration fails critically:

```powershell
# Discard changes
git checkout -- content/projects/home-assistant-automation-analysis/
git checkout -- content/projects/sql-fundamentals-advanced-techniques/
git checkout -- data/portfolio.db

# Rebuild from Feature 002 state
python scripts/manage_projects.py sync
python scripts/build_site.py

# Verify 6 projects restored
python -m http.server -d dist 8000
```

---

## References

- Enhanced content: ENHANCED_CONTENT_CAPSTONE.md, ENHANCED_CONTENT_SQL.md
- Validation contracts: contracts/migration-validation.md
- Feature 002 migration checklists: ../002-migrate-existing-portfolio/migration-checklists.md
- Constitution: .specify/memory/constitution.md (v1.1.0 Content Migration Workflow)
