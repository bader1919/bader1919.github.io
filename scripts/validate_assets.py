"""Asset validation script for portfolio builds.

Ensures hero and gallery images meet size and accessibility expectations.
"""

import argparse
import json
import sqlite3
import sys
from pathlib import Path
from typing import Any, Dict, List

from PIL import Image


# Size limits (in bytes)
HERO_MAX_SIZE = 200 * 1024  # 200KB
GALLERY_MAX_SIZE = 300 * 1024  # 300KB

# Placeholder phrases that indicate missing alt text
PLACEHOLDER_ALT_PHRASES = [
    "placeholder",
    "image",
    "photo",
    "picture",
    "untitled",
    ""
]


def validate_assets(root: Path) -> Dict[str, Any]:
    """Validate all project assets against quality standards.
    
    Args:
        root: Portfolio root directory
        
    Returns:
        Validation report dictionary
    """
    db_path = root / "data" / "portfolio.db"
    reports_dir = root / "reports"
    
    reports_dir.mkdir(parents=True, exist_ok=True)
    
    # Connect to database
    if not db_path.exists():
        print(f"ERROR: Database not found at {db_path}", file=sys.stderr)
        sys.exit(1)
    
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    
    # Validation report
    report: Dict[str, Any] = {
        "validated_at": "",
        "total_assets": 0,
        "passed": 0,
        "warnings": [],
        "errors": []
    }
    
    # Fetch all assets
    assets_data = cursor.execute(
        """
        SELECT 
            a.id, a.path, a.alt_text, a.kind, a.placeholder_replaced,
            p.slug as project_slug
        FROM assets a
        JOIN projects p ON a.project_id = p.id
        WHERE p.status = 'published'
        """
    ).fetchall()
    
    report["total_assets"] = len(assets_data)
    
    for row in assets_data:
        asset = dict(row)
        asset_path = root / asset['path']
        slug = asset['project_slug']
        kind = asset['kind']
        
        # Check if asset file exists
        if not asset_path.exists():
            if asset['placeholder_replaced'] == 0:
                report["warnings"].append(
                    f"{slug}/{kind}: Asset not found at {asset['path']}, "
                    "placeholder will be used"
                )
            continue
        
        # Validate file size
        file_size = asset_path.stat().st_size
        max_size = HERO_MAX_SIZE if kind == 'hero' else GALLERY_MAX_SIZE
        
        if file_size > max_size:
            report["errors"].append(
                f"{slug}/{kind}: File size {file_size / 1024:.1f}KB exceeds "
                f"limit of {max_size / 1024:.0f}KB"
            )
        
        # Validate alt text
        alt_text = asset['alt_text'].lower().strip()
        if not alt_text or any(phrase in alt_text for phrase in PLACEHOLDER_ALT_PHRASES):
            report["warnings"].append(
                f"{slug}/{kind}: Missing or placeholder alt text: '{asset['alt_text']}'"
            )
        
        # Validate image dimensions (optional, informational)
        try:
            with Image.open(asset_path) as img:
                width, height = img.size
                if width < 800 or height < 600:
                    report["warnings"].append(
                        f"{slug}/{kind}: Small dimensions {width}x{height}, "
                        "consider higher resolution"
                    )
        except Exception as e:
            report["warnings"].append(
                f"{slug}/{kind}: Could not read image dimensions: {e}"
            )
    
    conn.close()
    
    # Calculate passed count
    report["passed"] = report["total_assets"] - len(report["errors"])
    
    # Save validation report
    from datetime import datetime
    report["validated_at"] = datetime.utcnow().isoformat()
    
    report_path = reports_dir / "assets.json"
    with open(report_path, "w", encoding="utf-8") as f:
        json.dump(report, f, indent=2)
    
    # Print summary
    print(f"\n[OK] Asset validation complete")
    print(f"  Total assets: {report['total_assets']}")
    print(f"  Passed: {report['passed']}")
    print(f"  Warnings: {len(report['warnings'])}")
    print(f"  Errors: {len(report['errors'])}")
    print(f"\nReport saved to {report_path}")
    
    return report


def main() -> None:
    """CLI entry point."""
    parser = argparse.ArgumentParser(description="Validate portfolio assets")
    args = parser.parse_args()
    
    # Get repository root
    root = Path(__file__).parent.parent
    
    report = validate_assets(root)
    
    # Exit with error if there were critical errors
    if report["errors"]:
        print(f"\n✗ Validation failed with {len(report['errors'])} error(s)", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
