# Bader Abdulrahim Portfolio

[![CI/CD](https://github.com/bader1919/bader1919.github.io/workflows/Portfolio%20CI/CD/badge.svg)](https://github.com/bader1919/bader1919.github.io/actions)
[![Lighthouse](https://img.shields.io/badge/Lighthouse-90%2B-brightgreen)](https://github.com/bader1919/bader1919.github.io/actions)

Professional portfolio showcasing data analytics, business intelligence, and smart home automation projects.

🌐 **Live Site**: [https://bader1919.github.io](https://bader1919.github.io)

## 🚀 Quick Start

### Prerequisites

- Python 3.11+
- Node.js 20+
- Git

### Setup

```powershell
# Clone repository
git clone https://github.com/bader1919/bader1919.github.io.git
cd bader1919.github.io

# Create Python virtual environment
python -m venv .venv
.\.venv\Scripts\Activate.ps1

# Install dependencies
pip install -r requirements.txt
npm install

# Initialize database
python scripts/manage_projects.py init-db
python scripts/manage_projects.py migrate

# Sync content
python scripts/manage_projects.py sync

# Build site
python scripts/build_site.py

# Preview locally
cd dist
python -m http.server 8000
# Visit http://localhost:8000
```

## 📁 Project Structure

```
bader1919.github.io/
├── content/projects/           # Project content (Markdown + metadata)
│   └── <slug>/
│       ├── project.yaml        # Project metadata
│       └── narrative.md        # Project story
├── scripts/                    # Build and management scripts
│   ├── build_site.py          # Static site generator
│   ├── manage_projects.py     # Content sync & database
│   ├── validate_assets.py     # Asset validation
│   └── migrations/            # Database migrations
├── templates/                  # Jinja2 templates
│   ├── base.html
│   ├── index.html
│   ├── project.html
│   └── partials/
├── data/                       # SQLite database & cache
├── dist/                       # Generated static site
├── tests/                      # Test suites
└── reports/                    # Build & validation reports
```

## ✍️ Adding a New Project

### 1. Create Project Directory

```powershell
mkdir content\projects\my-new-project
```

### 2. Create `project.yaml`

```yaml
slug: my-new-project
title: My New Project
summary: A brief description (max 160 characters for SEO)
description_path: content/projects/my-new-project/narrative.md
published_on: 2024-03-15
last_updated_on: 2024-03-20
hero_image: /assets/img/my-project-hero.jpg
status: published
tech_stack: Python, SQL, Power BI
primary_metric: 25% increase in efficiency
github_url: https://github.com/bader1919/my-project
tags:
  - Data Analytics
  - Python
  - Business Intelligence
```

### 3. Write `narrative.md`

```markdown
# My New Project

## Overview
Project description...

## Challenge
What problem did this solve?

## Approach
How did you tackle it?

## Results
What was the impact?
```

### 4. Add Assets

Place images in `assets/img/` or use placeholders from `assets/img/placeholder/`.

### 5. Sync & Build

```powershell
python scripts/manage_projects.py sync
python scripts/build_site.py
```

## 🧪 Testing

### Run All Tests

```powershell
pytest
```

### Run Specific Test Suites

```powershell
# Unit & integration tests
pytest tests/unit tests/integration

# Contract tests
pytest tests/contract

# Accessibility tests
pytest tests/accessibility -m accessibility

# With coverage
pytest --cov=scripts --cov-report=html
```

### Run Validation

```powershell
# Validate assets
python scripts/validate_assets.py

# Build with validation
python scripts/build_site.py --validate

# Lighthouse CI
npm run lhci
```

## 📊 Quality Gates

All pull requests must pass:

- ✅ **Python Tests**: Unit, integration, and contract tests
- ✅ **Test Coverage**: ≥85% coverage
- ✅ **Accessibility**: Playwright + axe-core audits (AA compliance)
- ✅ **Performance**: Lighthouse (Performance ≥90, LCP ≤1.5s)
- ✅ **Asset Validation**: Hero ≤200KB, gallery ≤300KB, alt text required

## 🛠️ CLI Reference

### Content Management

```powershell
# Initialize database
python scripts/manage_projects.py init-db

# Run migrations
python scripts/manage_projects.py migrate

# Sync all projects
python scripts/manage_projects.py sync

# Sync specific project
python scripts/manage_projects.py sync --slug my-project
```

### Site Building

```powershell
# Build to dist/
python scripts/build_site.py

# Build to custom directory
python scripts/build_site.py --output public

# Build with validation
python scripts/build_site.py --validate
```

### Asset Validation

```powershell
# Validate all assets
python scripts/validate_assets.py

# View validation report
cat reports/assets.json
```

## 🎨 Customization

### Templates

Edit Jinja2 templates in `templates/`:
- `base.html`: Base layout with header/footer
- `index.html`: Homepage template
- `project.html`: Project detail page
- `partials/`: Reusable components

### Styles

CSS files are in `assets/css/`:
- `main.css`: Main styles
- `animations.css`: Animation effects

### Database Schema

Migrations in `scripts/migrations/` define the schema. To modify:

1. Create new migration file (e.g., `007_add_field.sql`)
2. Run `python scripts/manage_projects.py migrate`

## 🚢 Deployment

Deployment is automated via GitHub Actions:

1. Push to `main` branch
2. CI runs tests, builds site, validates quality
3. On success, deploys to GitHub Pages
4. Site updates at https://bader1919.github.io

Manual deployment:

```powershell
# Build production site
python scripts/build_site.py --validate

# Deploy dist/ to GitHub Pages
git add dist/
git commit -m "Deploy: update site"
git push origin main
```

## 📈 Performance

Current metrics:
- **Lighthouse Performance**: 90+
- **Accessibility**: 95+
- **Best Practices**: 90+
- **LCP**: <1.5s
- **Critical Assets**: <100KB

## 🤝 Contributing

This is a personal portfolio, but suggestions are welcome!

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests: `pytest`
5. Submit a pull request

## 📄 License

© 2024 Bader Abdulrahim. All rights reserved.

## 📧 Contact

**Bader Abdulrahim**
- Email: bader.abdulrahim@gmail.com
- LinkedIn: [linkedin.com/in/bader-abdulrahim](https://linkedin.com/in/bader-abdulrahim)
- GitHub: [@bader1919](https://github.com/bader1919)

---

Built with ❤️ using Python, Jinja2, and GitHub Pages
