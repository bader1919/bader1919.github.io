from __future__ import annotations

import json
from pathlib import Path
from textwrap import dedent

import pytest

from scripts import manage_projects


def _write_project_template(root: Path, slug: str, manifest_slug: str | None = None) -> None:
    project_dir = root / "content" / "projects" / slug
    project_dir.mkdir(parents=True, exist_ok=True)
    manifest_slug_value = manifest_slug or slug
    manifest = dedent(
        f"""
        slug: {manifest_slug_value}
        title: Sample Project
        summary: An illustrative data analysis.
        published_on: 2024-01-01
        tech_stack:
          - python
          - sqlite
        hero_image: assets/img/projects/sample-project/hero.jpg
        gallery:
          - assets/img/projects/sample-project/gallery-1.jpg
        status: published
        """
    ).strip()
    (project_dir / "project.yaml").write_text(manifest, encoding="utf-8")
    (project_dir / "narrative.md").write_text("# Heading\nBody copy", encoding="utf-8")


def test_sync_rejects_slug_mismatch(tmp_path: Path) -> None:
    portfolio_root = tmp_path
    _write_project_template(portfolio_root, "sample-project", manifest_slug="wrong-slug")
    manager = manage_projects.PortfolioManager(portfolio_root)
    manager.init_db()
    manager.migrate()

    with pytest.raises(manage_projects.SlugMismatchError):
        manager.sync_project("sample-project")


def test_sync_persists_project_and_updates_cache(tmp_path: Path) -> None:
    portfolio_root = tmp_path
    _write_project_template(portfolio_root, "sample-project")
    (portfolio_root / "data").mkdir(exist_ok=True)
    (portfolio_root / "data" / "cache").mkdir(parents=True, exist_ok=True)
    (portfolio_root / "reports").mkdir(exist_ok=True)

    manager = manage_projects.PortfolioManager(portfolio_root)
    manager.init_db()
    manager.migrate()
    manager.sync_project("sample-project")
    manager.generate_cache()

    with manage_projects.connect_db(manager.db_path) as conn:
        cursor = conn.execute("SELECT slug, title, summary FROM projects")
        row = cursor.fetchone()

    assert row == ("sample-project", "Sample Project", "An illustrative data analysis.")

    cache_path = manager.cache_path
    assert cache_path.exists(), "Cache file should be generated after sync"
    data = json.loads(cache_path.read_text(encoding="utf-8"))
    assert any(project["slug"] == "sample-project" for project in data)