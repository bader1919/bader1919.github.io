# Migration Validation Contract

## Content Quality Gates

All migrated projects must pass these validation checks before being marked as complete.

### 1. File Structure Validation

**Check**: Each project directory contains exactly `project.yaml` and `narrative.md`

**Acceptance Criteria**:
- `content/projects/{slug}/project.yaml` exists
- `content/projects/{slug}/narrative.md` exists
- No extraneous files in project directory (assets go in `assets/` subdirectory)

### 2. Metadata Schema Validation

**Check**: `project.yaml` contains all required fields with correct types and constraints

**Acceptance Criteria**:
- `title`: String, 1-120 characters
- `description`: String, 1-300 characters, single sentence
- `tags`: List of strings, minimum 1 tag
- `published_date`: String, YYYY-MM-DD format, valid date
- `thumbnail`: String or null, if provided must be valid path relative to project dir

**Validation Command**:
```bash
python scripts/manage_projects.py sync --validate-only
```

### 3. Narrative Content Validation

**Check**: `narrative.md` follows Markdown best practices and content structure

**Acceptance Criteria**:
- Valid Markdown syntax (no broken formatting)
- Headings start at `##` (H2), not `#` (H1)
- All image links have alt text: `![Alt text](path)`
- All relative image paths exist on filesystem
- Links to external resources use absolute URLs with `https://`
- Links to supporting files (PPTX, XLSX, PDF) have valid relative paths

**Validation Tool**:
```bash
markdownlint content/projects/{slug}/narrative.md
```

### 4. Database Sync Validation

**Check**: Project successfully syncs to database without errors

**Acceptance Criteria**:
- `python scripts/manage_projects.py sync` exits with code 0
- Project appears in `SELECT * FROM projects WHERE slug = '{slug}'`
- All tags created/linked in `tags` and `project_tags` tables
- Asset references created in `assets` table for images

**Verification Query**:
```sql
SELECT p.*, GROUP_CONCAT(t.name) as tags
FROM projects p
LEFT JOIN project_tags pt ON p.id = pt.project_id
LEFT JOIN tags t ON pt.tag_id = t.id
WHERE p.slug = '{slug}'
GROUP BY p.id;
```

### 5. Build Pipeline Validation

**Check**: Project renders correctly in static site build

**Acceptance Criteria**:
- `python scripts/build_site.py --validate` succeeds
- Project detail page generated at `dist/projects/{slug}/index.html`
- Project appears in projects index at `dist/projects/index.html`
- All images load (verified by asset validation report)
- No broken links in rendered HTML

**Validation Command**:
```bash
python scripts/build_site.py --validate
```

### 6. Visual Inspection

**Check**: Manually verify rendered page matches intent

**Acceptance Criteria**:
- Thumbnail displays correctly on projects index
- Project narrative is readable and well-formatted
- Images display with proper alt text
- Links to supporting documents work
- Page loads in local preview server

**Preview Command**:
```bash
python scripts/build_site.py
python -m http.server -d dist 8000
# Open http://localhost:8000/projects/{slug}/
```

## Migration Checklist Template

For each project, complete this checklist:

```markdown
## Project: {Project Title}

- [ ] File structure validation passed
- [ ] Metadata schema validation passed
- [ ] Narrative content validation passed
- [ ] Database sync validation passed
- [ ] Build pipeline validation passed
- [ ] Visual inspection completed
- [ ] Supporting documents linked correctly
- [ ] Git commit created: `git commit -m "Migrate {project-slug}"`
```

## Acceptance Criteria for Feature Completion

**All 5 projects** must:
1. Pass all 6 validation gates above
2. Be synced to database
3. Be built and deployed to `dist/`
4. Have migration checklist completed and saved in `specs/002-migrate-existing-portfolio/migration-checklists.md`

**Constitution update** must:
1. Document migration workflow in `.specify/memory/constitution.md`
2. Add content migration best practices
3. Update version to 1.1.0
