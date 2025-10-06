# Data Model Reference

**Feature**: 003-review-fix-and  
**Date**: 2025-10-06  
**Status**: No changes to existing data model  

---

## Overview

This feature uses the **existing data model** established in Feature 001 (build-the-portfolio) with no modifications required. The SQLite database schema and content structure remain unchanged.

---

## Database Schema (Existing)

See complete data model documentation:  
**Location**: `specs/001-build-the-portfolio/data-model.md`

**Summary**:
- `projects` table: slug, title, summary, description_path, published_on, last_updated_on, hero_image, status, tech_stack, primary_metric, github_url, live_url, tags
- File-based content: `content/projects/{slug}/project.yaml` + `narrative.md`
- Static assets: `content/projects/{slug}/assets/`

---

## Content Structure (Existing)

```yaml
# project.yaml schema
slug: string (unique identifier, URL-safe)
title: string (display name)
summary: string (short description)
description_path: string (relative path to narrative.md)
published_on: string (ISO date: YYYY-MM-DD)
last_updated_on: string (ISO date: YYYY-MM-DD, optional)
hero_image: string (path to thumbnail, optional)
status: string (published|draft)
tech_stack: list<string> (technologies used)
primary_metric: string (key outcome metric, optional)
github_url: string (repository link, optional)
live_url: string (live demo link, optional)
tags: list<string> (categorization tags)
links: list<object> (additional resources, optional)
  - name: string
    url: string
    type: string
```

---

## Projects Count

**Before Feature 003**: 6 projects  
- 1 sample-project (Feature 001)
- 5 migrated projects (Feature 002)

**After Feature 003**: 8 projects  
- 6 existing (unchanged)
- 1 home-assistant-automation-analysis (NEW)
- 1 sql-fundamentals-advanced-techniques (NEW)

---

## No Schema Changes

**Rationale**:
- Existing schema supports all Feature 003 requirements
- `links` field (optional) handles multiple technical resource links
- `tags` field supports "Learning Journey" classification
- No new fields or tables needed

**Validation**: Feature 003 projects comply with existing YAML schema exactly.

---

## References

- Full data model: `specs/001-build-the-portfolio/data-model.md`
- Database location: `data/portfolio.db`
- Schema migrations: `scripts/manage_projects.py` (deterministic)
