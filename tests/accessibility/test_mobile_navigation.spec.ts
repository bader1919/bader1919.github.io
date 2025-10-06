// @ts-nocheck
import { test, expect } from '@playwright/test';
import { runAxe } from 'axe-playwright';

test.describe('mobile navigation accessibility', () => {
  test('exposes an accessible mobile menu', async ({ page }) => {
    await page.goto('/');

    const skipLink = page.getByRole('link', { name: /skip to main content/i });
    await expect(skipLink).toBeVisible();

    await page.keyboard.press('Tab');
    await expect(skipLink).toBeFocused();

    const menuButton = page.getByRole('button', { name: /menu/i });
    await expect(menuButton).toBeVisible();
    await expect(menuButton).toHaveAttribute('aria-expanded', 'false');

    await menuButton.press('Enter');

    await expect(menuButton).toHaveAttribute('aria-expanded', 'true');
    const navigation = page.getByRole('navigation');
    await expect(navigation).toBeVisible();

    const projectLink = navigation.getByRole('link', { name: /projects/i });
    await expect(projectLink).toBeVisible();

    await runAxe(page);
  });

  test('keeps focus within the open navigation drawer', async ({ page }) => {
    await page.goto('/');
    const menuButton = page.getByRole('button', { name: /menu/i });
    await menuButton.click();

    const firstNavLink = page.getByRole('navigation').getByRole('link').first();
    await expect(firstNavLink).toBeVisible();
    await firstNavLink.focus();
    await page.keyboard.press('Shift+Tab');
    await expect(menuButton).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(firstNavLink).toBeFocused();
  });
});
