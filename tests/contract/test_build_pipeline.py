from __future__ import annotations

import json
import sqlite3
from pathlib import Path
from textwrap import dedent

import pytest

from scripts import build_site


def _create_template(root: Path, relative_path: str, contents: str) -> None:
    template_path = root / "templates" / relative_path
    template_path.parent.mkdir(parents=True, exist_ok=True)
    template_path.write_text(contents, encoding="utf-8")


@pytest.fixture()
def seeded_portfolio(tmp_path: Path) -> Path:
    root = tmp_path

    templates = {
        "base.html": dedent(
            """<!doctype html>
            <html>
              <head>
                <title>{{ page_title }}</title>
                <meta property="og:title" content="{{ og_title }}">
                <meta property="og:description" content="{{ og_description }}">
                <meta property="og:image" content="{{ og_image }}">
              </head>
              <body>
                {% block content %}{% endblock %}
              </body>
            </html>
            """
        ),
        "index.html": dedent(
            """{% extends 'base.html' %}
            {% block content %}
              {% for project in projects %}
                <article data-slug="{{ project.slug }}">
                  <h2>{{ project.title }}</h2>
                  <p>{{ project.summary }}</p>
                </article>
              {% endfor %}
            {% endblock %}
            """
        ),
        "project.html": dedent(
            """{% extends 'base.html' %}
            {% block content %}
              <main>
                <h1>{{ project.title }}</h1>
                <img class="hero" src="{{ project.hero_image }}" alt="{{ project.hero_alt }}">
              </main>
            {% endblock %}
            """
        ),
    }

    for relative_path, contents in templates.items():
        _create_template(root, relative_path, contents)

    # SQLite schema + seed data
    db_path = root / "data" / "portfolio.db"
    db_path.parent.mkdir(parents=True, exist_ok=True)
    with sqlite3.connect(db_path) as conn:
        conn.executescript(
            """
            CREATE TABLE projects (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                slug TEXT UNIQUE NOT NULL,
                title TEXT NOT NULL,
                summary TEXT NOT NULL,
                description_path TEXT NOT NULL,
                published_on DATE NOT NULL,
                hero_image TEXT NOT NULL,
                status TEXT NOT NULL
            );
            CREATE TABLE assets (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                project_id INTEGER NOT NULL,
                path TEXT NOT NULL,
                alt_text TEXT NOT NULL,
                kind TEXT NOT NULL,
                FOREIGN KEY(project_id) REFERENCES projects(id) ON DELETE CASCADE
            );
            INSERT INTO projects (slug, title, summary, description_path, published_on, hero_image, status)
            VALUES ('sample-project', 'Sample Project', 'Summary text', 'content/projects/sample-project/narrative.md', '2024-01-01', 'assets/img/projects/sample-project/hero.jpg', 'published');
            INSERT INTO assets (project_id, path, alt_text, kind)
            VALUES (1, 'assets/img/projects/sample-project/hero.jpg', 'Hero image', 'hero');
            """
        )

    # Markdown narrative referenced by description_path
    narrative_path = root / "content" / "projects" / "sample-project"
    narrative_path.mkdir(parents=True, exist_ok=True)
    (narrative_path / "narrative.md").write_text("# Sample Project\nBody", encoding="utf-8")

    # Asset files
    hero_path = root / "assets" / "img" / "projects" / "sample-project"
    hero_path.mkdir(parents=True, exist_ok=True)
    (hero_path / "hero.jpg").write_bytes(b"binary-image")

    placeholder_path = root / "assets" / "img" / "placeholder"
    placeholder_path.mkdir(parents=True, exist_ok=True)
    (placeholder_path / "project-placeholder.jpg").write_bytes(b"placeholder")

    # Output directories expected by build
    (root / "data" / "cache").mkdir(parents=True, exist_ok=True)
    (root / "reports").mkdir(parents=True, exist_ok=True)

    return root


def test_build_pipeline_generates_html_and_manifest(seeded_portfolio: Path) -> None:
    root = seeded_portfolio
    output_dir = root / "dist"
    report = build_site.build_site(root_path=root, output_dir=output_dir)

    index_path = output_dir / "index.html"
    project_path = output_dir / "projects" / "sample-project" / "index.html"
    manifest_path = output_dir / "manifest.json"

    assert index_path.exists(), "Index page should be rendered"
    assert project_path.exists(), "Project detail page should be rendered"
    assert manifest_path.exists(), "Build manifest should be generated"

    index_html = index_path.read_text(encoding="utf-8")
    project_html = project_path.read_text(encoding="utf-8")
    manifest_data = json.loads(manifest_path.read_text(encoding="utf-8"))

    assert "Sample Project" in index_html
    assert "Sample Project" in project_html
    assert '<meta property="og:title" content="Sample Project"' in project_html
    assert any(entry["logical_path"] == "index.html" for entry in manifest_data["files"])
    assert report.rendered_pages >= 2


def test_build_pipeline_uses_placeholder_for_missing_assets(seeded_portfolio: Path) -> None:
    root = seeded_portfolio
    missing_hero = root / "assets" / "img" / "projects" / "sample-project" / "hero.jpg"
    missing_hero.unlink()

    output_dir = root / "dist"
    report = build_site.build_site(root_path=root, output_dir=output_dir)

    project_html = (output_dir / "projects" / "sample-project" / "index.html").read_text(encoding="utf-8")

    assert "assets/img/placeholder/project-placeholder.jpg" in project_html
    assert any("placeholder" in warning.lower() for warning in report.warnings)
    assert "assets/img/placeholder/project-placeholder.jpg" in report.placeholder_usage