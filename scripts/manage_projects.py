"""Portfolio metadata management CLI.

Handles SQLite migrations, project sync operations, and cache generation.
"""

import argparse
import json
import sqlite3
import sys
from datetime import datetime
from pathlib import Path
from typing import Any, Dict, List, Optional

import yaml


class PortfolioManager:
    """Manages portfolio database operations and content synchronization."""

    def __init__(self, root: Path) -> None:
        """Initialize with portfolio root directory.
        
        Args:
            root: Root directory of the portfolio repository
        """
        self.root = Path(root)
        self.db_path = self.root / "data" / "portfolio.db"
        self.migrations_dir = self.root / "scripts" / "migrations"
        self.content_dir = self.root / "content" / "projects"
        self.cache_dir = self.root / "data" / "cache"
        self.reports_dir = self.root / "reports"
        
        # Ensure required directories exist
        self.db_path.parent.mkdir(parents=True, exist_ok=True)
        self.cache_dir.mkdir(parents=True, exist_ok=True)
        self.reports_dir.mkdir(parents=True, exist_ok=True)

    def _get_connection(self) -> sqlite3.Connection:
        """Get database connection with foreign keys enabled."""
        conn = sqlite3.connect(self.db_path)
        conn.execute("PRAGMA foreign_keys = ON")
        conn.row_factory = sqlite3.Row
        return conn

    def init_db(self) -> None:
        """Initialize the database file."""
        conn = self._get_connection()
        conn.execute("PRAGMA user_version = 0")
        conn.commit()
        conn.close()
        print(f"Database initialized at {self.db_path}")

    def migrate(self) -> None:
        """Run all pending migrations in order."""
        if not self.db_path.exists():
            print("Database not found. Run 'init-db' first.", file=sys.stderr)
            sys.exit(1)

        conn = self._get_connection()
        cursor = conn.cursor()
        
        # Get current schema version
        current_version = cursor.execute("PRAGMA user_version").fetchone()[0]
        
        # Find all migration files
        migration_files = sorted(self.migrations_dir.glob("*.sql"))
        
        executed_count = 0
        for migration_file in migration_files:
            # Extract migration number from filename (e.g., 001_create_projects.sql -> 1)
            migration_num = int(migration_file.stem.split("_")[0])
            
            if migration_num > current_version:
                print(f"Running migration {migration_file.name}...")
                with open(migration_file, "r", encoding="utf-8") as f:
                    sql = f.read()
                
                try:
                    conn.executescript(sql)
                    conn.execute(f"PRAGMA user_version = {migration_num}")
                    conn.commit()
                    executed_count += 1
                    print(f"✓ Migration {migration_file.name} completed")
                except sqlite3.Error as e:
                    print(f"✗ Migration {migration_file.name} failed: {e}", file=sys.stderr)
                    conn.rollback()
                    conn.close()
                    sys.exit(1)
        
        conn.close()
        
        if executed_count == 0:
            print("No pending migrations.")
        else:
            print(f"Successfully executed {executed_count} migration(s).")

    def sync(self, slug: Optional[str] = None) -> Dict[str, Any]:
        """Sync project content to database.
        
        Args:
            slug: Specific project slug to sync, or None to sync all
            
        Returns:
            Sync report dictionary
        """
        conn = self._get_connection()
        cursor = conn.cursor()
        
        report: Dict[str, Any] = {
            "timestamp": datetime.utcnow().isoformat(),
            "synced": [],
            "warnings": [],
            "errors": []
        }
        
        # Determine which projects to sync
        if slug:
            project_dirs = [self.content_dir / slug]
            if not project_dirs[0].exists():
                report["errors"].append(f"Project directory not found: {slug}")
                self._save_sync_report(report)
                return report
        else:
            project_dirs = [d for d in self.content_dir.iterdir() if d.is_dir()]
        
        for project_dir in project_dirs:
            try:
                self._sync_project(cursor, project_dir, report)
            except Exception as e:
                report["errors"].append(f"Failed to sync {project_dir.name}: {str(e)}")
        
        conn.commit()
        conn.close()
        
        # Generate JSON cache
        self._generate_cache()
        
        # Save sync report
        self._save_sync_report(report)
        
        return report

    def _sync_project(
        self,
        cursor: sqlite3.Cursor,
        project_dir: Path,
        report: Dict[str, Any]
    ) -> None:
        """Sync a single project to the database.
        
        Args:
            cursor: Database cursor
            project_dir: Path to project directory
            report: Report dictionary to update
        """
        slug = project_dir.name
        yaml_path = project_dir / "project.yaml"
        
        if not yaml_path.exists():
            report["warnings"].append(f"Missing project.yaml for {slug}")
            return
        
        # Load project metadata
        with open(yaml_path, "r", encoding="utf-8") as f:
            metadata = yaml.safe_load(f)
        
        # Validate slug matches directory
        if metadata.get("slug") != slug:
            report["errors"].append(
                f"Slug mismatch in {slug}: YAML has '{metadata.get('slug')}'"
            )
            return
        
        # Upsert project
        cursor.execute(
            """
            INSERT INTO projects (
                slug, title, summary, description_path, published_on,
                last_updated_on, hero_image, status, tech_stack,
                primary_metric, github_url, live_url
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(slug) DO UPDATE SET
                title = excluded.title,
                summary = excluded.summary,
                description_path = excluded.description_path,
                published_on = excluded.published_on,
                last_updated_on = excluded.last_updated_on,
                hero_image = excluded.hero_image,
                status = excluded.status,
                tech_stack = excluded.tech_stack,
                primary_metric = excluded.primary_metric,
                github_url = excluded.github_url,
                live_url = excluded.live_url
            """,
            (
                slug,
                metadata["title"],
                metadata["summary"],
                metadata.get("description_path", f"content/projects/{slug}/narrative.md"),
                metadata["published_on"],
                metadata.get("last_updated_on", datetime.now().date().isoformat()),
                metadata["hero_image"],
                metadata.get("status", "published"),
                metadata.get("tech_stack", ""),
                metadata.get("primary_metric"),
                metadata.get("github_url"),
                metadata.get("live_url")
            )
        )
        
        project_id = cursor.lastrowid or cursor.execute(
            "SELECT id FROM projects WHERE slug = ?", (slug,)
        ).fetchone()[0]
        
        # Sync tags
        tags = metadata.get("tags", [])
        for tag_name in tags:
            # Normalize tag name
            normalized = tag_name.lower().replace(" ", "-")
            
            # Insert or get tag
            cursor.execute(
                "INSERT OR IGNORE INTO tags (name, display_name) VALUES (?, ?)",
                (normalized, tag_name)
            )
            tag_id = cursor.execute(
                "SELECT id FROM tags WHERE name = ?", (normalized,)
            ).fetchone()[0]
            
            # Link project to tag
            cursor.execute(
                "INSERT OR IGNORE INTO project_tags (project_id, tag_id) VALUES (?, ?)",
                (project_id, tag_id)
            )
        
        report["synced"].append(slug)

    def _generate_cache(self) -> None:
        """Generate JSON cache of projects for quick previews."""
        conn = self._get_connection()
        cursor = conn.cursor()
        
        projects = cursor.execute(
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
            """
        ).fetchall()
        
        cache_data = [dict(row) for row in projects]
        
        cache_path = self.cache_dir / "projects.json"
        with open(cache_path, "w", encoding="utf-8") as f:
            json.dump(cache_data, f, indent=2)
        
        conn.close()
        print(f"Generated cache at {cache_path}")

    def _save_sync_report(self, report: Dict[str, Any]) -> None:
        """Save sync report to reports directory."""
        report_path = self.reports_dir / "content-sync.json"
        with open(report_path, "w", encoding="utf-8") as f:
            json.dump(report, f, indent=2)
        print(f"Sync report saved to {report_path}")


def main() -> None:
    """CLI entry point."""
    parser = argparse.ArgumentParser(description="Portfolio metadata management")
    subparsers = parser.add_subparsers(dest="command", help="Command to execute")
    
    # init-db command
    subparsers.add_parser("init-db", help="Initialize database")
    
    # migrate command
    subparsers.add_parser("migrate", help="Run pending migrations")
    
    # sync command
    sync_parser = subparsers.add_parser("sync", help="Sync project content to database")
    sync_parser.add_argument("--slug", help="Specific project slug to sync")
    
    args = parser.parse_args()
    
    if not args.command:
        parser.print_help()
        sys.exit(1)
    
    # Get repository root (assuming script is in scripts/ directory)
    root = Path(__file__).parent.parent
    manager = PortfolioManager(root)
    
    if args.command == "init-db":
        manager.init_db()
    elif args.command == "migrate":
        manager.migrate()
    elif args.command == "sync":
        report = manager.sync(args.slug)
        if report["errors"]:
            print(f"Sync completed with {len(report['errors'])} error(s)", file=sys.stderr)
            sys.exit(1)
        else:
            print(f"Successfully synced {len(report['synced'])} project(s)")


if __name__ == "__main__":
    main()
