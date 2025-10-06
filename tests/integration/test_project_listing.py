from __future__ import annotations

import json
from pathlib import Path
from textwrap import dedent

from scripts import build_site, manage_projects


def _prepare_directories(root: Path) -> None:
    for relative in (
        "content/projects",
        "assets/img/projects",
        "assets/img/placeholder",
        "data/cache",
        "reports",
    ):
        (root / relative).mkdir(parents=True, exist_ok=True)


def _write_project_template(
    root: Path,
    *,
    slug: str,
    title: str,
    summary: str,
    published_on: str,
    hero_filename: str,
) -> None:
    project_dir = root / "content" / "projects" / slug
    project_dir.mkdir(parents=True, exist_ok=True)

    manifest = dedent(
        f"""
        slug: {slug}
        title: {title}
        summary: {summary}
        published_on: {published_on}
        tech_stack:
          - python
          - sqlite
        hero_image: assets/img/projects/{slug}/{hero_filename}
        gallery:
          - assets/img/projects/{slug}/gallery-1.jpg
        status: published
        """
    ).strip()
    (project_dir / "project.yaml").write_text(manifest, encoding="utf-8")
    (project_dir / "narrative.md").write_text("# Heading\nBody copy", encoding="utf-8")

    assets_dir = root / "assets" / "img" / "projects" / slug
    assets_dir.mkdir(parents=True, exist_ok=True)
    (assets_dir / hero_filename).write_bytes(b"image-bytes")
    (assets_dir / "gallery-1.jpg").write_bytes(b"image-bytes")


def test_project_listing_orders_newest_first(tmp_path: Path) -> None:
    portfolio_root = tmp_path
    _prepare_directories(portfolio_root)

    manager = manage_projects.PortfolioManager(portfolio_root)
    manager.init_db()
    manager.migrate()

    _write_project_template(
        portfolio_root,
        slug="newest-project",
        title="Newest Insight",
        summary="Latest success story.",
        published_on="2025-03-01",
        hero_filename="hero.jpg",
    )
    _write_project_template(
        portfolio_root,
        slug="older-project",
        title="Archived Analysis",
        summary="Historical engagement study.",
        published_on="2024-07-15",
        hero_filename="hero.jpg",
    )

    manager.sync_project("newest-project")
    manager.sync_project("older-project")
    manager.generate_cache()

    output_dir = portfolio_root / "dist"
    build_site.build_site(root_path=portfolio_root, output_dir=output_dir)

    index_html = (output_dir / "index.html").read_text(encoding="utf-8")
    newest_position = index_html.index("Newest Insight")
    older_position = index_html.index("Archived Analysis")

    assert newest_position < older_position, "Newest project should surface first on the index page"

    cache_data = json.loads((portfolio_root / "data" / "cache" / "projects.json").read_text(encoding="utf-8"))
    assert cache_data[0]["slug"] == "newest-project", "Cache should order projects newest-first"

    project_detail = output_dir / "projects" / "newest-project" / "index.html"
    assert project_detail.exists(), "Newest project detail page should be generated"
