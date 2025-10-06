# Contract: Quality Assurance Gates

## Purpose

Guarantee that accessibility, performance, and correctness standards from the constitution are verifiably enforced before merge.

## Inputs

- Built site artifacts under `dist/`
- Playwright configuration `tests/playwright.config.ts`
- Lighthouse configuration `lighthouse.config.js`
- pytest suite within `tests/`
- Asset validation rules defined in `scripts/validate_assets.py`

## Outputs

- JUnit XML reports in `reports/tests/`
- Accessibility audit artifacts in `reports/accessibility/`
- Lighthouse summary `reports/lighthouse/summary.json`
- Asset validation log `reports/assets.json`
- GitHub Actions job status (pass/fail)

## Behaviour

- `pytest` executes unit and integration tests; must exit 0 with coverage ≥ 85%
- `pytest -m accessibility` runs Playwright + axe-core; failures block merge
- `npx @lhci/cli autorun` must meet budgets (Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 90, LCP ≤ 1.5s)
- Asset validator enforces hero image ≤ 200KB, gallery images ≤ 300KB, presence of alt text
- All reports uploaded as CI artifacts for traceability

## Error Modes & Logging

- Any test failure causes pipeline halt; reruns permitted after fixes
- Accessibility scans that cannot reach pages due to navigation errors mark test as failed with screenshot capture
- Lighthouse CLI errors (e.g., Chrome install) surface as fatal; pipeline advises rerun after environment fix

## Consumers

- Local developer workflow prior to push
- GitHub Actions CI pipeline
- Release manager verifying readiness before merging to `main`
