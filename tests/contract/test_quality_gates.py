from __future__ import annotations

import json
import sqlite3
from pathlib import Path

from scripts import validate_assets


def _seed_assets_db(db_path: Path, *, alt_text: str = "Hero image") -> None:
    db_path.parent.mkdir(parents=True, exist_ok=True)
    with sqlite3.connect(db_path) as conn:
        conn.executescript(
            """
            CREATE TABLE assets (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                project_id INTEGER NOT NULL,
                path TEXT NOT NULL,
                alt_text TEXT NOT NULL,
                kind TEXT NOT NULL
            );
            """
        )
        conn.execute(
            "INSERT INTO assets (project_id, path, alt_text, kind) VALUES (?, ?, ?, ?)",
            (1, "assets/img/projects/sample-project/hero.jpg", alt_text, "hero"),
        )
        conn.commit()


def test_validation_flags_missing_asset(tmp_path: Path) -> None:
    db_path = tmp_path / "data" / "portfolio.db"
    _seed_assets_db(db_path)

    report_path = tmp_path / "reports" / "assets.json"
    result = validate_assets.run_validation(
        root_path=tmp_path,
        db_path=db_path,
        report_path=report_path,
        size_budget_kb=200,
    )

    assert result.violations, "Missing hero image should be reported as violation"
    assert "missing" in result.violations[0].lower()
    assert report_path.exists(), "Validation report should be written to disk"

    report_json = json.loads(report_path.read_text(encoding="utf-8"))
    assert report_json["violations"], "JSON report should capture violations"


def test_validation_warns_on_missing_alt_text(tmp_path: Path) -> None:
    db_path = tmp_path / "data" / "portfolio.db"
    _seed_assets_db(db_path, alt_text="")

    (tmp_path / "assets" / "img" / "projects" / "sample-project").mkdir(parents=True, exist_ok=True)
    image_path = tmp_path / "assets" / "img" / "projects" / "sample-project" / "hero.jpg"
    image_path.write_bytes(b"test")

    report_path = tmp_path / "reports" / "assets.json"
    result = validate_assets.run_validation(
        root_path=tmp_path,
        db_path=db_path,
        report_path=report_path,
        size_budget_kb=200,
    )

    assert result.warnings, "Missing alt text should trigger warning"
    assert "alt" in result.warnings[0].lower()


def test_validation_enforces_size_budget(tmp_path: Path) -> None:
    db_path = tmp_path / "data" / "portfolio.db"
    _seed_assets_db(db_path)

    asset_dir = tmp_path / "assets" / "img" / "projects" / "sample-project"
    asset_dir.mkdir(parents=True, exist_ok=True)
    oversized_asset = asset_dir / "hero.jpg"
    oversized_asset.write_bytes(b"x" * (300 * 1024))

    report_path = tmp_path / "reports" / "assets.json"
    result = validate_assets.run_validation(
        root_path=tmp_path,
        db_path=db_path,
        report_path=report_path,
        size_budget_kb=200,
    )

    assert not result.passed
    assert any("size" in violation.lower() for violation in result.violations)
    assert json.loads(report_path.read_text(encoding="utf-8"))["violations"], "Report should capture size violations"