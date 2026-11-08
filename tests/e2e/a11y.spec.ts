import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

// Reduced motion makes every revealed element fully opaque, so contrast is measured on final colours.
test.use({ reducedMotion: 'reduce' });

const pages = ['./', 'privacy/', 'this-page-does-not-exist/'];

for (const path of pages) {
  test(`no serious or critical axe violations: ${path}`, async ({ page }) => {
    await page.goto(path);
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      .analyze();
    const serious = results.violations.filter(
      (v) => v.impact === 'serious' || v.impact === 'critical',
    );
    const summary = serious.map(
      (v) => `${v.id} (${v.impact}): ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`,
    );
    expect(summary).toEqual([]);
  });
}

test('no serious or critical axe violations with the mobile menu open', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('./');
  await page.locator('[data-menu-toggle]').click();
  await expect(page.getByRole('dialog')).toBeVisible();
  const results = await new AxeBuilder({ page }).include('#mobile-menu').analyze();
  const serious = results.violations.filter(
    (v) => v.impact === 'serious' || v.impact === 'critical',
  );
  expect(serious.map((v) => v.id)).toEqual([]);
});

test('all workflow stage panels and the contact form pass axe once revealed', async ({ page }) => {
  await page.goto('./');
  await page.fill('#cf-name', 'A');
  await page.locator('[data-contact-form] button[type="submit"]').click(); // show error state
  const results = await new AxeBuilder({ page }).include('#process').include('#contact').analyze();
  const serious = results.violations.filter(
    (v) => v.impact === 'serious' || v.impact === 'critical',
  );
  expect(
    serious.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`),
  ).toEqual([]);
});
