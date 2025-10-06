// @ts-nocheck
import { test, expect } from '@playwright/test';
import { runAxe } from 'axe-playwright';

test.describe('project detail accessibility', () => {
  test('ensures hero media and headings are accessible', async ({ page }) => {
    await page.goto('/projects/sample-project/');

    const skipLink = page.getByRole('link', { name: /skip to main content/i });
    await expect(skipLink).toBeVisible();

    const pageHeading = page.getByRole('heading', { level: 1, name: /sample project/i });
    await expect(pageHeading).toBeVisible();

    const heroImage = page.getByRole('img', { name: /hero/i });
    await expect(heroImage).toHaveAttribute('src', /sample-project/);
    await expect(heroImage).toHaveAttribute('alt', /\S+/);

    const metricsSection = page.getByRole('heading', { level: 2, name: /project overview|insights/i });
    await expect(metricsSection).toBeVisible();

    await runAxe(page);
  });

  test('provides skip links and focus management', async ({ page }) => {
    await page.goto('/projects/sample-project/');

    await page.keyboard.press('Tab');
    const skipLink = page.getByRole('link', { name: /skip to main content/i });
    await expect(skipLink).toBeFocused();

    await page.keyboard.press('Enter');
    const mainRegion = page.getByRole('main');
    await expect(mainRegion).toBeVisible();
    await expect(mainRegion).toBeFocused();
  });
});
