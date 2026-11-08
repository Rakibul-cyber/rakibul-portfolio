import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('./');
});

test('mobile menu opens as a dialog with focus inside and locks page scroll', async ({ page }) => {
  const toggle = page.locator('[data-menu-toggle]');
  const menu = page.getByRole('dialog', { name: 'Site menu' });
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(menu).toBeHidden();
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await expect(menu).toBeVisible();
  await expect(menu.locator('[data-menu-link]').first()).toBeFocused();
  expect(await page.evaluate(() => document.documentElement.style.overflow)).toBe('hidden');
});

test('menu links close the menu and land on their section', async ({ page }) => {
  const toggle = page.locator('[data-menu-toggle]');
  for (const target of ['#work', '#process', '#contact']) {
    await toggle.click();
    await page
      .getByRole('navigation', { name: 'Mobile' })
      .locator(`li a[href="${target}"]`)
      .click();
    await expect(page.getByRole('dialog')).toBeHidden();
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await expect(page.locator(target)).toBeInViewport({ ratio: 0.05 });
    expect(await page.evaluate(() => document.documentElement.style.overflow)).toBe('');
  }
});

test('Escape closes the menu and returns focus to the toggle', async ({ page }) => {
  const toggle = page.locator('[data-menu-toggle]');
  await toggle.click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toBeHidden();
  await expect(toggle).toBeFocused();
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
});

test('focus is trapped inside the open menu', async ({ page }) => {
  await page.locator('[data-menu-toggle]').click();
  const dialog = page.getByRole('dialog');
  for (let i = 0; i < 12; i++) {
    await page.keyboard.press('Tab');
    expect(await dialog.evaluate((d) => d.contains(document.activeElement))).toBe(true);
  }
});

test('hero chips never cover the centre of the monogram', async ({ page }) => {
  const circle = await page.locator('.portrait-circle').boundingBox();
  expect(circle).not.toBeNull();
  if (!circle) return;
  const cx = circle.x + circle.width / 2;
  const cy = circle.y + circle.height / 2;
  const r = circle.width * 0.25;
  for (const chip of await page.locator('.chip').all()) {
    const b = await chip.boundingBox();
    if (!b) continue;
    const overlaps =
      b.x < cx + r && b.x + b.width > cx - r && b.y < cy + r && b.y + b.height > cy - r;
    expect(overlaps, 'chip overlaps the monogram centre').toBe(false);
  }
});

test('touch targets in the header and menu are at least 44px', async ({ page }) => {
  const toggle = await page.locator('[data-menu-toggle]').boundingBox();
  expect(toggle?.height).toBeGreaterThanOrEqual(44);
  expect(toggle?.width).toBeGreaterThanOrEqual(44);
  await page.locator('[data-menu-toggle]').click();
  for (const link of await page.locator('[data-menu-link]').all()) {
    expect((await link.boundingBox())?.height).toBeGreaterThanOrEqual(44);
  }
});
