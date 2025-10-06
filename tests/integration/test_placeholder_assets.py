from __future__ import annotations

from pathlib import Path
from textwrap import dedent

from scripts import build_site, manage_projects, validate_assets

PLACEHOLDER_PATH = "assets/img/placeholder/project-placeholder.jpg"


def _prepare_environment(root: Path) -> None:
    for relative in (
        "content/projects",
        "assets/img/placeholder",
        "data/cache",
        "reports",
    ):
        (root / relative).mkdir(parents=True, exist_ok=True)
    (root / PLACEHOLDER_PATH).write_bytes(b"placeholder-bytes")


def _write_project_template(root: Path, slug: str) -> None:
    project_dir = root / "content" / "projects" / slug
    project_dir.mkdir(parents=True, exist_ok=True)

    manifest = dedent(
        f"""
        slug: {slug}
        title: Placeholder Required Project
        summary: Waiting on final imagery.
        published_on: 2025-01-10
        tech_stack:
          - python
          - sqlite
        hero_image: assets/img/projects/{slug}/hero.jpg
        gallery:
          - assets/img/projects/{slug}/gallery-1.jpg
        status: published
        """
    ).strip()
    (project_dir / "project.yaml").write_text(manifest, encoding="utf-8")
    (project_dir / "narrative.md").write_text("# Placeholder\nImagery pending", encoding="utf-8")

    (root / "assets" / "img" / "projects" / slug).mkdir(parents=True, exist_ok=True)


def test_missing_assets_trigger_placeholder_warnings(tmp_path: Path) -> None:
    portfolio_root = tmp_path
    _prepare_environment(portfolio_root)

    manager = manage_projects.PortfolioManager(portfolio_root)
    manager.init_db()
    manager.migrate()

    _write_project_template(portfolio_root, "awaiting-assets")
    manager.sync_project("awaiting-assets")
    manager.generate_cache()

    output_dir = portfolio_root / "dist"
    report = build_site.build_site(root_path=portfolio_root, output_dir=output_dir)

    project_html = (output_dir / "projects" / "awaiting-assets" / "index.html").read_text(encoding="utf-8")
    assert PLACEHOLDER_PATH in project_html, "Placeholder image should be injected when hero assets are missing"
    assert any("placeholder" in warning.lower() for warning in report.warnings), "Build report should flag placeholder usage"

    assets_report_path = portfolio_root / "reports" / "assets.json"
    result = validate_assets.run_validation(
        root_path=portfolio_root,
        db_path=manager.db_path,
        report_path=assets_report_path,
        size_budget_kb=200,
    )

    assert result.violations, "Asset validator should raise violations for missing hero imagery"
    assert assets_report_path.exists(), "Validator should write a report to disk"
