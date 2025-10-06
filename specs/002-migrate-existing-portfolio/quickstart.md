# Quickstart Guide – Content Migration

## Prerequisites

- Feature 001 (build-the-protofolio) fully implemented and operational
- Database initialized: `python scripts/manage_projects.py init`
- Original project content in `projects/` directory (read-only, do not modify)

## Migration Workflow (Per Project)

### Step 1: Create Project Directory

```bash
mkdir -p "content/projects/{project-slug}"
mkdir -p "content/projects/{project-slug}/assets"
```

**Slug naming**:

- Lowercase only
- Replace spaces with hyphens
- Remove special characters except hyphens
- Example: "Airbnb Market Analysis - Cape Town" → "airbnb-cape-town-analysis"

### Step 2: Extract Publication Date

Use Git history to find original commit date:

```bash
git log --follow --format=%aI --reverse -- "projects/{original-folder-name}" | head -1
```

Extract date portion (YYYY-MM-DD). If no Git history, use manual inspection or current date as fallback.

### Step 3: Create project.yaml

Create `content/projects/{project-slug}/project.yaml`:

```yaml
title: "Original Project Title"
description: "One-sentence summary extracted from README or presentation."
tags:
  - "Tag1"
  - "Tag2"
  - "Tag3"
published_date: "YYYY-MM-DD"
thumbnail: "./assets/thumbnail.jpg"  # Optional, omit if no image
```

**Tag selection guidelines**:

- Include technology/tools used (Excel, Python, Tableau, SQL, etc.)
- Include domain keywords (Data Analytics, Market Research, Customer Insights, etc.)
- 3-6 tags recommended

### Step 4: Craft Narrative

Create `content/projects/{project-slug}/narrative.md`:

1. **Review source materials**: README, presentations (PPTX), annotated PDFs, data files
2. **Extract key insights**: Business questions, methodology, findings, recommendations
3. **Structure narrative**:

```markdown
## Overview

Brief introduction to the project context and objectives.

## Business Challenge

What problem was being solved? What questions needed answers?

## Approach

Methodology, tools used, data sources, analytical techniques.

## Key Findings

Major insights discovered through analysis.

## Recommendations

Actionable next steps or business impact.

## Supporting Materials

- [Download Excel Analysis](../../projects/{original-folder}/file.xlsx)
- [View Presentation](../../projects/{original-folder}/presentation.pdf)
```

**Formatting rules**:

- Start headings at `##` (H2), not `#` (project title is H1 in template)
- Use relative paths for images: `![Alt text](./assets/image.jpg)`
- Use absolute paths for external links: `[Link](https://example.com)`
- Use relative paths for original project files: `../../projects/{original-folder}/file.ext`

### Step 5: Copy Image Assets

If narrative references images:

```bash
cp "projects/{original-folder}/image.jpg" "content/projects/{project-slug}/assets/"
```

Update narrative Markdown to reference copied images:

```markdown
![Descriptive alt text](./assets/image.jpg)
```

**Note**: Large files (PPTX, XLSX, PDF) stay in original `projects/` location, link with relative paths.

### Step 6: Validate Metadata

```bash
python scripts/manage_projects.py sync --validate-only
```

Fix any validation errors reported.

### Step 7: Sync to Database

```bash
python scripts/manage_projects.py sync
```

Verify sync succeeded:

```bash
sqlite3 data/portfolio.db "SELECT * FROM projects WHERE slug = '{project-slug}';"
```

### Step 8: Build and Preview

```bash
python scripts/build_site.py --validate
python -m http.server -d dist 8000
```

Open browser to `http://localhost:8000/projects/{project-slug}/` and verify:

- Thumbnail displays correctly
- Narrative formatting is correct
- Images load
- Links to supporting documents work

### Step 9: Complete Migration Checklist

In `specs/002-migrate-existing-portfolio/migration-checklists.md`, mark all items complete for this project.

### Step 10: Commit Changes

```bash
git add content/projects/{project-slug}/
git commit -m "Migrate {project-slug} from legacy HTML structure"
```

## Repeat for All Projects

Follow Steps 1-10 for each of the 5 projects:

1. airbnb-cape-town-analysis
2. ba-service-quality-review
3. customer-churn-analysis
4. global-food-supply-chain
5. kickstarter-growth-analysis

## Final Validation

After all projects migrated:

```bash
# Sync all projects
python scripts/manage_projects.py sync

# Build site with validation
python scripts/build_site.py --validate

# Check project count
sqlite3 data/portfolio.db "SELECT COUNT(*) FROM projects;"
# Should return: 7 (2 sample + 5 migrated)

# Preview full site
python -m http.server -d dist 8000
# Visit http://localhost:8000/projects/ to see all projects
```

## Troubleshooting

**Issue**: "Project already exists in database"

**Solution**: Delete and re-sync:

```bash
sqlite3 data/portfolio.db "DELETE FROM projects WHERE slug = '{project-slug}';"
python scripts/manage_projects.py sync
```

**Issue**: "Image not found in narrative"

**Solution**: Verify path is relative to project directory, e.g., `./assets/image.jpg` not `/assets/image.jpg`.

**Issue**: "Invalid YAML syntax"

**Solution**: Check indentation (2 spaces), quote strings with special characters, ensure list format.

## Time Estimate

- Per project: 30-60 minutes (varies by content complexity)
- Total for 5 projects: 3-5 hours
