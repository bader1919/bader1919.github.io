"""Static site builder entry point.

Parses SQLite metadata and renders Jinja2 templates into dist/.
"""

import argparse
import json
import shutil
import sqlite3
import sys
from datetime import datetime
from pathlib import Path
from typing import Any, Dict, List, Optional

import markdown
from jinja2 import Environment, FileSystemLoader, select_autoescape


def build_site(root: Path, output_dir: Path) -> Dict[str, Any]:
    """Build the static site from database and templates.
    
    Args:
        root: Portfolio root directory
        output_dir: Output directory for generated site
        
    Returns:
        Build summary dictionary
    """
    start_time = datetime.now()
    
    # Setup paths
    db_path = root / "data" / "portfolio.db"
    templates_dir = root / "templates"
    assets_dir = root / "bader1919.github.io-main" / "assets"
    placeholder_dir = root / "assets" / "img" / "placeholder"
    reports_dir = root / "reports"
    
    # Ensure output directory exists
    output_dir.mkdir(parents=True, exist_ok=True)
    reports_dir.mkdir(parents=True, exist_ok=True)
    
    # Initialize Jinja2 environment
    env = Environment(
        loader=FileSystemLoader(templates_dir),
        autoescape=select_autoescape(['html', 'xml']),
        trim_blocks=True,
        lstrip_blocks=True
    )
    
    # Initialize Markdown converter
    md = markdown.Markdown(extensions=['fenced_code', 'tables', 'toc'])
    
    # Connect to database
    if not db_path.exists():
        print(f"ERROR: Database not found at {db_path}", file=sys.stderr)
        print("Run 'python scripts/manage_projects.py init-db && migrate' first", file=sys.stderr)
        sys.exit(1)
    
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    
    # Build summary
    summary: Dict[str, Any] = {
        "timestamp": datetime.utcnow().isoformat(),
        "pages_generated": 0,
        "warnings": [],
        "errors": []
    }
    
    try:
        # Build index page
        _build_index(conn, env, output_dir, summary, placeholder_dir)
        
        # Build project pages
        _build_project_pages(conn, env, md, output_dir, root, summary, placeholder_dir)
        
        # Copy static assets
        _copy_assets(assets_dir, output_dir, summary)
        
        # Generate manifest
        _generate_manifest(output_dir, summary)
        
    except Exception as e:
        summary["errors"].append(f"Build failed: {str(e)}")
        print(f"ERROR: {e}", file=sys.stderr)
        conn.close()
        sys.exit(1)
    finally:
        conn.close()
    
    # Calculate duration
    duration = (datetime.now() - start_time).total_seconds()
    summary["duration_seconds"] = duration
    
    # Save build report
    report_path = reports_dir / "build-summary.json"
    with open(report_path, "w", encoding="utf-8") as f:
        json.dump(summary, f, indent=2)
    
    print(f"\n✓ Build completed in {duration:.2f}s")
    print(f"  Pages generated: {summary['pages_generated']}")
    print(f"  Warnings: {len(summary['warnings'])}")
    print(f"  Errors: {len(summary['errors'])}")
    
    return summary


def _build_index(
    conn: sqlite3.Connection,
    env: Environment,
    output_dir: Path,
    summary: Dict[str, Any],
    placeholder_dir: Path
) -> None:
    """Build the index (home) page.
    
    Args:
        conn: Database connection
        env: Jinja2 environment
        output_dir: Output directory
        summary: Build summary to update
        placeholder_dir: Path to placeholder assets
    """
    cursor = conn.cursor()
    
    # Fetch published projects ordered chronologically (newest first)
    projects_data = cursor.execute(
        """
        SELECT 
            p.slug, p.title, p.summary, p.hero_image,
            p.published_on, p.tech_stack, p.primary_metric,
            GROUP_CONCAT(t.display_name, ', ') as tags
        FROM projects p
        LEFT JOIN project_tags pt ON p.id = pt.project_id
        LEFT JOIN tags t ON pt.tag_id = t.id
        WHERE p.status = 'published'
        GROUP BY p.id
        ORDER BY p.published_on DESC
        LIMIT 6
        """
    ).fetchall()
    
    # Convert to dictionaries and process tags
    projects = []
    for row in projects_data:
        project = dict(row)
        if project['tags']:
            project['tags'] = [tag.strip() for tag in project['tags'].split(',')]
        else:
            project['tags'] = []
        
        # Check for missing hero image and inject placeholder
        hero_path = Path(project['hero_image'])
        if not (output_dir.parent / project['hero_image']).exists():
            project['hero_image'] = "assets/img/placeholder/project-placeholder.jpg"
            summary["warnings"].append(
                f"Missing hero image for {project['slug']}, using placeholder"
            )
        
        projects.append(project)
    
    # Render template
    template = env.get_template('index.html')
    html = template.render(projects=projects)
    
    # Write output
    index_path = output_dir / "index.html"
    with open(index_path, "w", encoding="utf-8") as f:
        f.write(html)
    
    summary["pages_generated"] += 1
    print(f"✓ Generated {index_path}")


def _build_project_pages(
    conn: sqlite3.Connection,
    env: Environment,
    md: markdown.Markdown,
    output_dir: Path,
    root: Path,
    summary: Dict[str, Any],
    placeholder_dir: Path
) -> None:
    """Build individual project detail pages.
    
    Args:
        conn: Database connection
        env: Jinja2 environment
        md: Markdown converter
        output_dir: Output directory
        root: Portfolio root directory
        summary: Build summary to update
        placeholder_dir: Path to placeholder assets
    """
    cursor = conn.cursor()
    
    # Fetch all published projects
    projects_data = cursor.execute(
        """
        SELECT 
            p.id, p.slug, p.title, p.summary, p.description_path,
            p.published_on, p.tech_stack, p.primary_metric,
            p.hero_image, p.github_url, p.live_url,
            GROUP_CONCAT(t.display_name, ', ') as tags
        FROM projects p
        LEFT JOIN project_tags pt ON p.id = pt.project_id
        LEFT JOIN tags t ON pt.tag_id = t.id
        WHERE p.status = 'published'
        GROUP BY p.id
        ORDER BY p.published_on DESC
        """
    ).fetchall()
    
    for row in projects_data:
        project = dict(row)
        project_id = project['id']
        slug = project['slug']
        
        # Process tags
        if project['tags']:
            project['tags'] = [tag.strip() for tag in project['tags'].split(',')]
        else:
            project['tags'] = []
        
        # Load and convert narrative Markdown
        narrative_path = root / project['description_path']
        if narrative_path.exists():
            with open(narrative_path, "r", encoding="utf-8") as f:
                narrative_md = f.read()
            md.reset()
            narrative_html = md.convert(narrative_md)
        else:
            narrative_html = "<p>Project narrative coming soon.</p>"
            summary["warnings"].append(f"Missing narrative for {slug}")
        
        # Fetch gallery assets
        gallery_assets = cursor.execute(
            """
            SELECT path, alt_text
            FROM assets
            WHERE project_id = ? AND kind = 'gallery'
            ORDER BY id
            """,
            (project_id,)
        ).fetchall()
        
        gallery_assets = [dict(asset) for asset in gallery_assets]
        
        # Check for placeholder replacements
        for asset in gallery_assets:
            asset_path = root / asset['path']
            if not asset_path.exists():
                asset['path'] = "assets/img/placeholder/image-placeholder.jpg"
                summary["warnings"].append(
                    f"Missing gallery asset for {slug}, using placeholder"
                )
        
        # Fetch latest performance snapshot
        latest_performance = cursor.execute(
            """
            SELECT lcp_ms, cls, ttfb_ms, total_js_kb, total_css_kb
            FROM performance_snapshots
            WHERE project_id = ?
            ORDER BY captured_at DESC
            LIMIT 1
            """,
            (project_id,)
        ).fetchone()
        
        if latest_performance:
            latest_performance = dict(latest_performance)
        
        # Render template
        template = env.get_template('project.html')
        html = template.render(
            project=project,
            narrative_html=narrative_html,
            gallery_assets=gallery_assets,
            latest_performance=latest_performance
        )
        
        # Write output
        project_dir = output_dir / "projects" / slug
        project_dir.mkdir(parents=True, exist_ok=True)
        project_path = project_dir / "index.html"
        
        with open(project_path, "w", encoding="utf-8") as f:
            f.write(html)
        
        summary["pages_generated"] += 1
        print(f"✓ Generated {project_path}")


def _copy_assets(
    assets_dir: Path,
    output_dir: Path,
    summary: Dict[str, Any]
) -> None:
    """Copy static assets to output directory.
    
    Args:
        assets_dir: Source assets directory
        output_dir: Output directory
        summary: Build summary to update
    """
    output_assets = output_dir / "assets"
    
    if assets_dir.exists():
        if output_assets.exists():
            shutil.rmtree(output_assets)
        shutil.copytree(assets_dir, output_assets)
        print(f"✓ Copied assets to {output_assets}")
    else:
        summary["warnings"].append(f"Assets directory not found: {assets_dir}")


def _generate_manifest(
    output_dir: Path,
    summary: Dict[str, Any]
) -> None:
    """Generate asset manifest.
    
    Args:
        output_dir: Output directory
        summary: Build summary to update
    """
    manifest = {
        "generated_at": datetime.utcnow().isoformat(),
        "pages": summary["pages_generated"],
        "assets": {}
    }
    
    # Scan for CSS and JS files
    assets_dir = output_dir / "assets"
    if assets_dir.exists():
        for css_file in assets_dir.glob("css/*.css"):
            manifest["assets"][css_file.name] = str(css_file.relative_to(output_dir))
        for js_file in assets_dir.glob("js/*.js"):
            manifest["assets"][js_file.name] = str(js_file.relative_to(output_dir))
    
    manifest_path = output_dir / "manifest.json"
    with open(manifest_path, "w", encoding="utf-8") as f:
        json.dump(manifest, f, indent=2)
    
    print(f"✓ Generated {manifest_path}")


def main() -> None:
    """CLI entry point."""
    parser = argparse.ArgumentParser(description="Build static portfolio site")
    parser.add_argument(
        "--output",
        type=Path,
        default=Path("dist"),
        help="Output directory (default: dist)"
    )
    parser.add_argument(
        "--validate",
        action="store_true",
        default=False,
        help="Run asset validation after build"
    )
    
    args = parser.parse_args()
    
    # Get repository root
    root = Path(__file__).parent.parent
    output_dir = root / args.output
    
    summary = build_site(root, output_dir)
    
    # Run validation if requested (for CI pipeline)
    if args.validate:
        import subprocess
        print("\n🔍 Running asset validation...")
        validate_script = root / "scripts" / "validate_assets.py"
        result = subprocess.run(
            [sys.executable, str(validate_script)],
            capture_output=True,
            text=True
        )
        print(result.stdout)
        if result.returncode != 0:
            print(result.stderr, file=sys.stderr)
            sys.exit(1)
    
    # Exit with error if there were errors
    if summary["errors"]:
        sys.exit(1)


if __name__ == "__main__":
    main()
