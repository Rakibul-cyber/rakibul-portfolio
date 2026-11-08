import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('./');
});

test('every header nav link scrolls its section into view', async ({ page }) => {
  const links = page.getByRole('navigation', { name: 'Primary' }).getByRole('link');
  const count = await links.count();
  expect(count).toBe(6);
  for (let i = 0; i < count; i++) {
    const link = links.nth(i);
    const hash = (await link.getAttribute('href')) ?? '';
    await link.click();
    await expect(page).toHaveURL(new RegExp(`${hash}$`));
    await expect(page.locator(hash)).toBeInViewport({ ratio: 0.1 });
  }
});

test('every "Shown in" link targets an existing project anchor', async ({ page }) => {
  const hrefs = await page
    .locator('#expertise a[href^="#project-"]')
    .evaluateAll((as) => as.map((a) => a.getAttribute('href')));
  expect(hrefs.length).toBeGreaterThan(0);
  for (const href of hrefs) await expect(page.locator(href ?? '')).toHaveCount(1);
});

test('project filters show 2 / 1 / 5 / 3 / 7 and announce the result', async ({ page }) => {
  const visible = page.locator('[data-project-index] [data-categories]:visible');
  const status = page.locator('[data-filter-status]');
  const cases: [string, number][] = [
    ['ai-ml', 2],
    ['data', 1],
    ['mobile', 5],
    ['backend-cloud', 3],
    ['all', 7],
  ];
  for (const [filter, expected] of cases) {
    const button = page.locator(`[data-filter="${filter}"]`);
    await expect(button.locator('.count')).toHaveText(String(expected));
    await button.click();
    await expect(button).toHaveAttribute('aria-pressed', 'true');
    await expect(visible).toHaveCount(expected);
    await expect(status).toContainText(String(expected));
  }
  await expect(page.locator('[data-filter][aria-pressed="true"]')).toHaveCount(1);
});

test('workflow tabs: arrow keys, Home and End with roving tabindex', async ({ page }) => {
  const tabs = page.getByRole('tab');
  await expect(tabs).toHaveCount(6);
  await tabs.first().focus();
  await expect(tabs.first()).toHaveAttribute('aria-selected', 'true');

  await page.keyboard.press('ArrowRight');
  await expect(tabs.nth(1)).toHaveAttribute('aria-selected', 'true');
  await expect(tabs.nth(1)).toBeFocused();
  await expect(tabs.nth(1)).toHaveAttribute('tabindex', '0');
  await expect(tabs.nth(0)).toHaveAttribute('tabindex', '-1');
  await expect(page.locator('#stage-panel-prepare')).toBeVisible();
  await expect(page.locator('#stage-panel-define')).toBeHidden();

  await page.keyboard.press('End');
  await expect(tabs.nth(5)).toHaveAttribute('aria-selected', 'true');
  await expect(page.locator('#stage-panel-ship')).toBeVisible();

  await page.keyboard.press('ArrowRight'); // wraps around
  await expect(tabs.nth(0)).toHaveAttribute('aria-selected', 'true');

  await page.keyboard.press('ArrowLeft');
  await expect(tabs.nth(5)).toHaveAttribute('aria-selected', 'true');

  await page.keyboard.press('Home');
  await expect(tabs.nth(0)).toHaveAttribute('aria-selected', 'true');
  await expect(page.getByRole('tabpanel')).toHaveCount(1);

  // Auto-advance stopped on interaction: selection stays put.
  await page.waitForTimeout(5200);
  await expect(tabs.nth(0)).toHaveAttribute('aria-selected', 'true');
});

test('"How it was built" disclosures open', async ({ page }) => {
  const details = page.locator('#project-louco details');
  await expect(details).not.toHaveAttribute('open', '');
  await details.locator('summary').click();
  await expect(details).toHaveAttribute('open', '');
  await expect(details.getByText('Flutter UI → GetX controllers')).toBeVisible();
});

test('contact form: empty submit shows errors and does not navigate', async ({ page }) => {
  const form = page.locator('[data-contact-form]');
  const url = page.url();
  await form.getByRole('button', { name: /open in my email app/i }).click();
  await expect(page.locator('[data-form-summary]')).toBeVisible();
  await expect(page.locator('#cf-name')).toHaveAttribute('aria-invalid', 'true');
  await expect(page.locator('#cf-email')).toHaveAttribute('aria-invalid', 'true');
  await expect(page.locator('#cf-message')).toHaveAttribute('aria-invalid', 'true');
  await expect(page.locator('#cf-name')).toBeFocused();
  await expect(form).not.toHaveAttribute('data-mailto', /.+/);
  expect(page.url()).toBe(url);
});

test('contact form: valid input composes a correctly encoded mailto: link', async ({ page }) => {
  const form = page.locator('[data-contact-form]');
  await page.fill('#cf-name', 'Ada Lovelace');
  await page.fill('#cf-email', 'ada@example.com');
  await page.fill('#cf-message', 'Hello & welcome?\nLine two = 100% done.');
  await form.getByRole('button', { name: /open in my email app/i }).click();
  await expect(form).toHaveAttribute('data-mailto', /^mailto:/);
  const mailto = (await form.getAttribute('data-mailto')) ?? '';
  const parsed = new URL(mailto);
  expect(parsed.protocol).toBe('mailto:');
  expect(parsed.pathname).toBe('hassanrakibul029@gmail.com');
  expect(parsed.searchParams.get('subject')).toBe('Portfolio enquiry from Ada Lovelace');
  expect(parsed.searchParams.get('body')).toBe(
    'Hello & welcome?\nLine two = 100% done.\n\n— Ada Lovelace\nada@example.com',
  );
  // Raw string must be percent-encoded (no bare &, =, newline or space in values).
  expect(mailto).toContain('subject=Portfolio%20enquiry%20from%20Ada%20Lovelace');
  expect(mailto).toContain('Hello%20%26%20welcome%3F%0ALine%20two%20%3D%20100%25%20done.');
  await expect(page.locator('[data-form-summary]')).toBeHidden();
});
