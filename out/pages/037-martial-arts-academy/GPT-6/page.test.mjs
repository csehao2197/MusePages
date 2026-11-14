import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, writeFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from '@playwright/test';
import { startPreviewServer } from '../../../../src/workflows/generate-preview.mjs';
import { validateStaticOutput } from '../../../../src/workflows/render-prompt-pages.mjs';
const root = 'C:\\Code\\MusePages';
const folder = import.meta.dirname;
const exported = path.join(folder, 'out');
async function guard() {
  const file = path.join(root, 'out', '.generation-locks', '037-martial-arts-academy.lock');
  const contents = await readFile(file, 'utf8');
  const [pid, session] = contents.trim().split(/\r?\n/);
  const lock = contents.trimStart().startsWith('{') ? JSON.parse(contents) : { pid: Number(pid), session };
  assert.ok(lock.session);
  if (lock.prompt !== undefined) assert.equal(lock.prompt, '037-martial-arts-academy');
  assert.ok(Number.isInteger(lock.pid) && lock.pid > 0);
  assert.ok(Date.now() - (await stat(file)).mtimeMs < 1800000, 'Live bounded guard');
  process.kill(lock.pid, 0);
}
async function sameFiles(directory, relative = '') {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = path.join(relative, entry.name);
    if (entry.isDirectory()) await sameFiles(path.join(directory, entry.name), file);
    else assert.deepEqual(await readFile(path.join(folder, file)), await readFile(path.join(exported, file)), `Exact export: ${file}`);
  }
}
test('Iron Path static homepage: eight focused browser and export checks', { timeout: 180000 }, async () => {
  await guard();
  const checks = [];
  const errors = [];
  const requests = [];
  const check = async (label, fn) => { await fn(); checks.push(label); console.log(`PASS ${label}`); };
  let browser;
  let context;
  let service;
  try {
    service = await startPreviewServer(exported, { workspace: root });
    browser = await chromium.launch({ headless: true });
    context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
    const page = await context.newPage();
    const origin = new URL(service.url).origin;
    page.on('pageerror', error => errors.push(`pageerror: ${error.message}`));
    page.on('requestfailed', request => errors.push(`requestfailed: ${request.url()} ${request.failure()?.errorText}`));
    page.on('response', response => { if (response.status() >= 400) errors.push(`HTTP ${response.status()}: ${response.url()}`); });
    page.on('request', request => { requests.push({ url: request.url(), method: request.method() }); if (!request.url().startsWith(origin + '/')) errors.push(`External runtime request: ${request.url()}`); if (request.method() !== 'GET') errors.push(`Non-GET request: ${request.method()}`); });
    await page.goto(service.url, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await check('Nested static mount, exact export and all local images/fonts', async () => {
      assert.match(service.url, /\/pages\/martial-arts-academy\/GPT-6\/index.html$/);
      for (const file of ['index.html', 'style.css', 'app.js']) assert.deepEqual(await readFile(path.join(folder, file)), await readFile(path.join(exported, file)));
      await sameFiles(path.join(folder, 'assets'), 'assets');
      await page.locator('footer').scrollIntoViewIfNeeded();
      await page.evaluate(async () => { await Promise.all([...document.images].map(image => image.decode())); });
      assert.ok(await page.evaluate(() => document.fonts.check('600 20px Oswald') && document.fonts.check('400 14px Inter')));
      assert.equal(await page.locator('.coach-card').count(), 4);
      assert.equal(await page.locator('#tour figure').count(), 6);
      assert.equal(await page.locator('a[href^="#"]').evaluateAll(anchors => anchors.every(a => !!document.getElementById(a.hash.slice(1)))), true);
    });
    await check('Program tabs, keyboard wrap and program-specific trial selection', async () => {
      await page.locator('#tab-muay').click();
      assert.match(await page.locator('#program-title').innerText(), /RHYTHM/);
      assert.equal(await page.locator('.class-card').count(), 4);
      await page.locator('#tab-muay').press('ArrowRight');
      assert.equal(await page.locator('#tab-mma').getAttribute('aria-selected'), 'true');
      assert.equal(await page.locator('.class-card').count(), 3);
      await page.locator('#tab-mma').press('ArrowRight');
      assert.equal(await page.locator('#tab-bjj').getAttribute('aria-selected'), 'true');
      await page.locator('#tab-bjj').press('End');
      await page.locator('#program-trial').click();
      assert.equal(await page.locator('[name=program]').inputValue(), 'mma');
      await page.locator('#tab-mma').click();
      await page.locator('#tab-mma').press('Home');
    });
    await check('Schedule filters, coach and resource dialogs with Escape/focus return', async () => {
      await page.selectOption('#schedule-filter', 'mma');
      assert.equal(await page.locator('.schedule-row').count(), 3);
      await page.getByRole('button', { name: 'Try MMA Fundamentals', exact: true }).click();
      assert.equal(await page.locator('[name=program]').inputValue(), 'mma');
      await page.selectOption('#schedule-filter', 'all');
      assert.equal(await page.locator('.schedule-row').count(), 11);
      const bio = page.getByRole('button', { name: 'View bio: Marcus Torres' });
      await bio.click();
      assert.match(await page.locator('#info-body').innerText(), /Fictional profile/);
      await page.keyboard.press('Escape');
      assert.equal(await page.locator('#info-dialog').evaluate(dialog => dialog.open), false);
      assert.ok(await bio.evaluate(element => element === document.activeElement));
      await page.locator('.journal-card').first().click();
      assert.match(await page.locator('#info-title').innerText(), /first class/);
      await page.locator('#info-done').click();
    });
    await check('Pricing, offer and local form edge cases with literal unsafe text', async () => {
      await page.locator('[data-plan="All Access"]').click();
      await page.locator('#offer-button').click();
      assert.match(await page.locator('#offer-status').innerText(), /applied/);
      const name = page.locator('[name=name]');
      await name.fill('   ');
      await page.locator('[name=email]').fill('demo@example.com');
      await page.locator('[name=phone]').fill('7045550100');
      await page.selectOption('[name=program]', 'bjj');
      const future = new Date(Date.now() + 86400000 * 7);
      const date = `${future.getFullYear()}-${String(future.getMonth() + 1).padStart(2, '0')}-${String(future.getDate()).padStart(2, '0')}`;
      await page.locator('[name=date]').fill(date);
      await page.locator('[name=consent]').check();
      await page.locator('#trial-form button[type=submit]').click();
      assert.match(await page.locator('#form-error').innerText(), /not just spaces/);
      assert.equal(await page.locator('#booking-result').isVisible(), false);
      await name.fill('<img src=x onerror=alert(1)>');
      await page.locator('[name=phone]').fill('abc');
      await page.locator('#trial-form button[type=submit]').click();
      assert.match(await page.locator('#form-error').innerText(), /10–15 digits/);
      await page.locator('[name=phone]').fill('7045550100');
      await page.locator('[name=date]').fill('2020-01-01');
      assert.ok(await page.locator('[name=date]').evaluate(input => input.validity.rangeUnderflow));
      await page.locator('[name=date]').fill(date);
      await page.locator('#trial-form button[type=submit]').click();
      assert.equal(await page.locator('#booking-result').isVisible(), true);
      assert.match(await page.locator('#booking-text').innerText(), /<img src=x onerror=alert\(1\)>/);
      assert.match(await page.locator('#booking-text').innerText(), /All Access/);
      assert.match(await page.locator('#booking-text').innerText(), /IRONPATH50/);
      assert.equal(await page.locator('#booking-result img').count(), 0);
      assert.equal(await page.locator('[name=email]').inputValue(), '');
      assert.equal(await page.locator('[name=phone]').inputValue(), '');
      await page.locator('#clear-preview').click();
      assert.equal(await name.inputValue(), '');
      assert.equal(await page.locator('#booking-result').isVisible(), false);
    });
    await check('Tour manual, keyboard, playback and pause controls', async () => {
      await page.locator('#tour-next').click();
      assert.match(await page.locator('#tour-status').innerText(), /View 2/);
      await page.locator('#tour-prev').click();
      assert.match(await page.locator('#tour-status').innerText(), /View 1/);
      await page.locator('#tour').focus();
      await page.keyboard.press('ArrowRight');
      assert.match(await page.locator('#tour-status').innerText(), /View 2/);
      await page.locator('#tour-pause').click();
      assert.equal(await page.locator('#tour-pause').innerText(), 'Pause tour');
      await page.waitForTimeout(4700);
      assert.match(await page.locator('#tour-status').innerText(), /View 3/);
      await page.locator('#tour-pause').click();
      assert.equal(await page.locator('#tour-pause').innerText(), 'Play tour');
    });
    await check('Responsive 1440/1024/768/390/320 widths and desktop/mobile captures', async () => {
      for (const width of [1440, 1024, 768, 390, 320]) {
        await page.setViewportSize({ width, height: 1000 });
        await page.evaluate(() => window.scrollTo(0, 0));
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `No horizontal overflow at ${width}`);
        if (width <= 600) {
          assert.equal(await page.locator('#program-select').isVisible(), true);
          assert.equal(await page.locator('.mobile-trial').isVisible(), true);
          assert.ok(await page.locator('.menu-button').evaluate(e => e.getBoundingClientRect().width >= 44 && e.getBoundingClientRect().height >= 44));
          assert.equal(await page.locator('.pricing-grid article').evaluateAll(cards => [...cards].sort((a,b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top)[0].classList.contains('popular')), true);
          const undersized = await page.locator('button').evaluateAll(nodes => nodes.filter(e => e.getClientRects().length && !e.closest('dialog:not([open])')).filter(e => e.getBoundingClientRect().height < 44).map(e => e.textContent.trim()));
          assert.deepEqual(undersized, [], `44px mobile button heights at ${width}`);
        }
      }
      await page.setViewportSize({ width: 1440, height: 1000 });
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.screenshot({ path: path.join(folder, '.checks', 'desktop.png'), fullPage: true });
      await page.screenshot({ path: path.join(folder, '.checks', 'desktop-first.png') });
      await page.setViewportSize({ width: 390, height: 844 });
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.screenshot({ path: path.join(folder, '.checks', 'mobile.png'), fullPage: true });
      await page.screenshot({ path: path.join(folder, '.checks', 'mobile-first.png') });
      await page.locator('#trial-form').screenshot({ path: path.join(folder, '.checks', 'mobile-form.png') });
    });
    await check('Touch context, mobile drawer, dropdown and reduced motion', async () => {
      const touch = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
      try {
        const mobile = await touch.newPage();
        mobile.on('pageerror', e => errors.push(`mobile pageerror: ${e.message}`));
        mobile.on('requestfailed', r => errors.push(`mobile requestfailed: ${r.url()}`));
        mobile.on('response', r => { if (r.status() >= 400) errors.push(`mobile HTTP ${r.status()}`); });
        mobile.on('request', r => { requests.push({ url: r.url(), method: r.method() }); if (!r.url().startsWith(origin + '/') || r.method() !== 'GET') errors.push('Mobile external or non-GET request'); });
        await mobile.goto(service.url, { waitUntil: 'networkidle' });
        await mobile.locator('.menu-button').tap();
        assert.equal(await mobile.locator('#mobile-menu').evaluate(dialog => dialog.open), true);
        await mobile.getByRole('navigation', { name: 'Mobile navigation' }).getByRole('link', { name: 'Programs', exact: true }).tap();
        assert.equal(await mobile.locator('.menu-button').getAttribute('aria-expanded'), 'false');
        await mobile.selectOption('#program-select', 'muay');
        assert.match(await mobile.locator('#program-title').innerText(), /RHYTHM/);
        await mobile.locator('#tour-next').tap();
        assert.match(await mobile.locator('#tour-status').innerText(), /View 2/);
        await mobile.locator('#tour').scrollIntoViewIfNeeded();
        await mobile.locator('#tour').evaluate(element => { element.scrollLeft = 0; });
        const bounds = await mobile.locator('#tour').boundingBox();
        const session = await touch.newCDPSession(mobile);
        await session.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: 310, y: bounds.y + 100 }] });
        for (const x of [260, 210, 160, 110, 60]) {
          await session.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x, y: bounds.y + 100 }] });
          await mobile.waitForTimeout(35);
        }
        await session.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
        await mobile.waitForTimeout(500);
        assert.ok(await mobile.locator('#tour').evaluate(element => element.scrollLeft > 50), 'Actual touch swipe scrolls facility gallery');
        await session.detach();
        assert.equal(await mobile.locator('.hero-photo img').evaluate(image => getComputedStyle(image).animationName), 'none');
        assert.equal(await mobile.locator('#tour-pause').innerText(), 'Play tour');
        await mobile.locator('.mobile-trial').tap();
        assert.equal(await mobile.locator('#trial-form').isVisible(), true);
      } finally { await touch.close(); }
    });
    await check('No runtime failures, external calls, submissions or persistent personal data', async () => {
      assert.deepEqual(errors, []);
      assert.equal(await page.evaluate(() => localStorage.length + sessionStorage.length), 0);
      assert.ok(requests.length > 10);
      assert.ok(requests.every(request => request.method === 'GET' && request.url.startsWith(origin + '/')));
      const script = await readFile(path.join(folder, 'app.js'), 'utf8');
      assert.doesNotMatch(script, /\blocalStorage\b|\bsessionStorage\b|\bfetch\s*\(|XMLHttpRequest/);
      const noScript = await browser.newContext({ javaScriptEnabled: false });
      try {
        const fallback = await noScript.newPage();
        await fallback.goto(service.url);
        assert.equal(await fallback.locator('#trial-form button[type=submit]').isDisabled(), true, 'No-JavaScript fallback cannot submit personal fields');
        assert.equal(await fallback.locator('noscript').isVisible(), true);
      } finally { await noScript.close(); }
    });
    await guard();
    const digest = await validateStaticOutput(exported, 'martial-arts-academy', 'GPT-6');
    await writeFile(path.join(folder, '.checks', 'validation.json'), JSON.stringify({ checkedAt: new Date().toISOString(), digest, errors: [], checks, focusedChecks: checks.length, browser: 'Playwright Chromium', mount: '/pages/martial-arts-academy/GPT-6/index.html', requests: requests.length, methods: ['GET'], externalRequests: 0, widths: [1440,1024,768,390,320], touchSwipe: true, screenshots: ['desktop.png','desktop-first.png','mobile.png','mobile-first.png','mobile-form.png'], sourceExportEqual: true }, null, 2) + '\n');
  } finally {
    await context?.close();
    await browser?.close();
    await service?.close();
  }
});
