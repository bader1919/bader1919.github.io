# Quickstart – Portfolio Project Organization Framework

This guide explains how to set up the static portfolio, manage project metadata, and run quality gates.

## Prerequisites

- Windows PowerShell 5.1+ (already in use)
- Python 3.11
- Node.js 20+ (for Lighthouse CI)
- Git and SQLite3 CLI tools on PATH

## 1. Clone & Branch

1. `git clone https://github.com/bader1919/bader1919.github.io.git`
2. `cd bader1919.github.io`
3. `git checkout 001-build-the-protofolio`

## 2. Bootstrap Environment

1. `python -m venv .venv`
2. `.venv\Scripts\Activate.ps1`
3. `pip install -r requirements.txt` *(packages: markdown, jinja2, pytest, pytest-playwright, pillow)*
4. `npm install` *(devDependencies: @lhci/cli, axe-playwright)*

## 3. Initialise SQLite Metadata

1. `python scripts/manage_projects.py init-db`
2. `python scripts/manage_projects.py migrate`
3. Verify database: `sqlite3 data/portfolio.db "SELECT name FROM sqlite_master WHERE type='table';"`

## 4. Add or Update a Project

1. Copy `templates/project-template` into `content/projects/<slug>/` (slug must match directory name)
2. Update `narrative.md` with project story (Markdown)
3. Place hero and gallery images under `assets/img/projects/<slug>/`
4. Run `python scripts/manage_projects.py sync --slug <slug>` to populate metadata from prompts/CLI
5. If the script reports missing imagery or alt text, address items or prepare to provide assets

## 5. Build the Static Site

1. `python scripts/build_site.py --output dist`
2. Confirm generated HTML uses the shared templates and includes project cards sorted newest-first
3. Optional: `python -m http.server --directory dist 8000` and browse `http://localhost:8000`

## 6. Run Quality Gates

1. `pytest` *(unit + integration checks)*
2. `pytest -m accessibility` *(Playwright + axe audits)*
3. `npx @lhci/cli autorun --config lighthouse.config.js`
4. Review reports; ensure LCP ≤ 1.5s and critical assets ≤ 100KB

## 7. Validate Assets & Placeholders

1. `python scripts/validate_assets.py`
2. Provide any missing images flagged by the script before merging

## 8. Commit & Push

1. `git status` / `git add .`
2. `git commit -m "feat: scaffold portfolio structure"`
3. `git push origin 001-build-the-protofolio`

## 9. Deployment

- Open a pull request to `main`
- GitHub Actions will run build, tests, accessibility, and Lighthouse budgets
- On success, merge to publish via GitHub Pages

## Troubleshooting

- Regenerate the database schema with `python scripts/manage_projects.py reset` if migrations fail (back up first)
- If Playwright browsers are missing, run `pytest --browser chromium --browser firefox` once to trigger downloads
- For performance regressions, inspect `dist/assets` sizes and reconsider image compression or lazy-loading
