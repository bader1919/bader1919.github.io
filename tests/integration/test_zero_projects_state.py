from __future__ import annotations

from pathlib import Path

from scripts import build_site, manage_projects

FALLBACK_MESSAGE = "No projects published yet. Duplicate the project template to add your first case study."


def _prepare_environment(root: Path) -> None:
    (root / "assets" / "img" / "placeholder").mkdir(parents=True, exist_ok=True)
    (root / "assets" / "img" / "placeholder" / "project-placeholder.jpg").write_bytes(b"placeholder")
    (root / "data" / "cache").mkdir(parents=True, exist_ok=True)
    (root / "reports").mkdir(parents=True, exist_ok=True)


def test_zero_state_displays_guidance(tmp_path: Path) -> None:
    portfolio_root = tmp_path
    _prepare_environment(portfolio_root)

    manager = manage_projects.PortfolioManager(portfolio_root)
    manager.init_db()
    manager.migrate()

    output_dir = portfolio_root / "dist"
    report = build_site.build_site(root_path=portfolio_root, output_dir=output_dir)

    index_html = (output_dir / "index.html").read_text(encoding="utf-8")
    assert FALLBACK_MESSAGE in index_html, "Portfolio index should guide users when no projects exist"
    assert report.rendered_pages >= 1, "Build report should record at least one rendered page"
