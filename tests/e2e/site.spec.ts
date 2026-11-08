import { expect, test, type Page } from '@playwright/test';

/** Collect console errors and uncaught exceptions for the lifetime of a page. */
function trackErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  page.on('pageerror', (err) => errors.push(err.message));
  return errors;
}

test('home page loads cleanly: 200, no overflow, no broken images, no console errors', async ({
  page,
}) => {
  const errors = trackErrors(page);
  const response = await page.goto('./');
  expect(response?.status()).toBe(200);
  await expect(page.locator('h1')).toHaveCount(1);
  await expect(page.locator('h1')).toContainText('Building intelligent software');

  // Scroll through so lazy/reveal content is exercised.
  await page.evaluate(async () => {
    for (let y = 0; y < document.documentElement.scrollHeight; y += 600) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 30));
    }
  });

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - window.innerWidth,
  );
  expect(overflow, 'horizontal overflow in px').toBeLessThanOrEqual(0);

  const broken = await page.evaluate(() =>
    Array.from(document.images)
      .filter((img) => img.complete && img.naturalWidth === 0)
      .map((img) => img.src),
  );
  expect(broken).toEqual([]);
  expect(errors).toEqual([]);
});

test('all 7 visible projects are listed in the index', async ({ page }) => {
  await page.goto('./');
  await expect(page.locator('[data-project-index] [data-categories]')).toHaveCount(7);
});

test('reduced motion: everything is visible immediately and the terminal shows its full output', async ({
  browser,
}) => {
  const context = await browser.newContext({ reducedMotion: 'reduce' });
  const page = await context.newPage();
  await page.goto('./');
  const hidden = await page.evaluate(
    () =>
      Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]')).filter(
        (el) => getComputedStyle(el).opacity !== '1',
      ).length,
  );
  expect(hidden).toBe(0);
  const lines = page.locator('[data-terminal] [data-line]');
  const count = await lines.count();
  expect(count).toBeGreaterThan(10);
  for (let i = 0; i < count; i++) await expect(lines.nth(i)).toBeVisible();
  // The marquee becomes one static list (its duplicate copy is hidden).
  await expect(page.locator('.marquee-list[aria-hidden="true"]')).toBeHidden();
  await context.close();
});

test('without JavaScript all content is visible', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('./');
  await expect(page.locator('h1')).toBeVisible();
  const invisible = await page.evaluate(
    () =>
      Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]')).filter(
        (el) => getComputedStyle(el).opacity !== '1',
      ).length,
  );
  expect(invisible).toBe(0);
  await expect(page.locator('[role="tabpanel"]')).toHaveCount(6);
  for (const panel of await page.locator('[role="tabpanel"]').all())
    await expect(panel).toBeVisible();
  for (const line of await page.locator('[data-terminal] [data-line]').all())
    await expect(line).toBeVisible();
  await expect(page.locator('#project-driver-stress')).toBeVisible();
  await context.close();
});

test('CV is served as a PDF from the legacy URL', async ({ request }) => {
  const res = await request.get('CV_MD_Rakibul_Hassan.pdf');
  expect(res.status()).toBe(200);
  expect(res.headers()['content-type']).toContain('application/pdf');
  expect((await res.body()).subarray(0, 5).toString('latin1')).toBe('%PDF-');
});

test('privacy policy and 404 pages render', async ({ page }) => {
  const errors = trackErrors(page);
  let res = await page.goto('privacy/');
  expect(res?.status()).toBe(200);
  await expect(page.locator('h1')).toHaveText('Privacy policy');
  await expect(page.getByText('The contact form sends and stores nothing.')).toBeVisible();

  res = await page.goto('this-page-does-not-exist/');
  expect(res?.status()).toBe(404);
  await expect(page.locator('h1')).toHaveText('Page not found');
  const home = page.getByRole('link', { name: 'Back to the home page' });
  await expect(home).toHaveAttribute('href', '/rakibul-portfolio/');
  await home.click();
  await expect(page).toHaveURL(/\/rakibul-portfolio\/$/);
  expect(errors.filter((e) => !/404/.test(e))).toEqual([]);
});

test('hero chips stay inside the viewport and never overlap hero text', async ({ browser }) => {
  // Reduced motion freezes the float animation so the geometry is stable.
  const context = await browser.newContext({
    reducedMotion: 'reduce',
    viewport: test.info().project.use.viewport,
  });
  const page = await context.newPage();
  await page.goto('./');
  const result = await page.evaluate(() => {
    const textRects: DOMRect[] = [];
    const column = document.querySelector('#hero-title')?.parentElement;
    if (column) {
      const walker = document.createTreeWalker(column, NodeFilter.SHOW_TEXT);
      while (walker.nextNode()) {
        const range = document.createRange();
        range.selectNodeContents(walker.currentNode);
        textRects.push(...Array.from(range.getClientRects()));
      }
    }
    const hit = (a: DOMRect, b: DOMRect) =>
      a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
    const chips = Array.from(document.querySelectorAll('.chip')).map((c) =>
      c.getBoundingClientRect(),
    );
    return {
      overlaps: chips.filter((c) => textRects.some((t) => hit(c, t))).length,
      outside: chips.filter((c) => c.left < 0 || c.right > window.innerWidth).length,
    };
  });
  expect(result).toEqual({ overlaps: 0, outside: 0 });
  await context.close();
});

test('no content is clipped past the viewport (catches overflow hidden by overflow:hidden)', async ({
  browser,
}) => {
  const context = await browser.newContext({
    reducedMotion: 'reduce',
    viewport: test.info().project.use.viewport,
  });
  const page = await context.newPage();
  await page.goto('./');
  const offenders = await page.evaluate(() => {
    const skip =
      '.marquee, [data-terminal], .overflow-x-auto, .sr-only, [aria-hidden="true"], .chips';
    const out: string[] = [];
    for (const el of Array.from(document.querySelectorAll<HTMLElement>('main *'))) {
      if (el.closest(skip)) continue;
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) continue;
      if (r.right > window.innerWidth + 1 || r.left < -1) {
        out.push(
          `${el.tagName.toLowerCase()}.${(el.className || '').toString().slice(0, 60)} → ${Math.round(r.left)}..${Math.round(r.right)}`,
        );
      }
    }
    return out.slice(0, 10);
  });
  expect(offenders).toEqual([]);
  await context.close();
});
