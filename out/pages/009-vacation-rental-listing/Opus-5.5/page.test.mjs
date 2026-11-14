// Browser checks for the static homepage. Run from the repo root:
//   node out/pages/009-vacation-rental-listing/Opus-5.5/page.test.mjs
import assert from "node:assert/strict";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "../../../..");
const { chromium } = await import(pathToFileURL(path.join(root, "node_modules/playwright/index.mjs")).href);
const { startPreviewServer } = await import(pathToFileURL(path.join(root, "src/workflows/generate-preview.mjs")).href);

const server = await startPreviewServer(path.join(here, "out"), { workspace: root });
const browser = await chromium.launch();
const errors = [];
const results = [];
const check = async (name, fn) => { await fn(); results.push(`ok - ${name}`); };

async function open(viewport, mobile = false) {
  const context = await browser.newContext({ viewport, isMobile: mobile, hasTouch: mobile });
  const page = await context.newPage();
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
  page.on("requestfailed", (r) => errors.push(`failed ${r.url()}`));
  page.on("request", (r) => { if (r.method() !== "GET") errors.push(`non-GET ${r.method()} ${r.url()}`); });
  await page.goto(server.url, { waitUntil: "networkidle" });
  return { context, page };
}

// Pick a 7-night window that has no booked nights, starting from the first free day.
async function pickSevenNights(page, scope) {
  return page.evaluate((scope) => {
    const days = [...document.querySelectorAll(`[data-calendar="${scope}"] .day`)];
    for (let i = 0; i + 7 < days.length; i++) {
      const run = days.slice(i, i + 8);
      if (run.every((d) => !d.disabled) && Math.round((+run[7].dataset.day - +run[0].dataset.day) / 86400000) === 7) {
        return [run[0].dataset.day, run[7].dataset.day];
      }
    }
    return null;
  }, scope);
}

try {
  const { context, page } = await open({ width: 1440, height: 900 });

  await check("breakdown hidden until dates chosen", async () => {
    assert.equal(await page.locator("[data-breakdown]").isVisible(), false);
  });

  await check("3-night minimum enforced, 7 nights priced per spec", async () => {
    await page.locator('[data-calendar="main"]').scrollIntoViewIfNeeded();
    const pair = await pickSevenNights(page, "main");
    assert.ok(pair, "no free 7-night window found");
    const [a, b] = pair;
    await page.click(`[data-calendar="main"] [data-day="${a}"]`);
    const twoLater = String(+a + 2 * 86400000);
    await page.click(`[data-calendar="main"] [data-day="${twoLater}"]`);
    assert.match(await page.textContent("[data-cal-msg]"), /3-night minimum/);
    await page.click(`[data-calendar="main"] [data-day="${b}"]`);
    assert.equal(await page.locator("[data-breakdown]").isVisible(), true);
    assert.equal(await page.textContent("[data-sub]"), "$2,723");
    assert.equal(await page.textContent("[data-tax]"), "$459");
    assert.equal(await page.textContent("[data-total]"), "$3,332");
    assert.equal(await page.locator('[data-calendar="main"] .day.start').count(), 1);
    assert.equal(await page.locator('[data-calendar="main"] .day.end').count(), 1);
  });

  await check("booked dates are not selectable", async () => {
    const booked = page.locator('[data-calendar="main"] .day.booked').first();
    assert.equal(await booked.isDisabled(), true);
  });

  await check("guest stepper caps at 6 guests and 1 pet", async () => {
    await page.click("[data-guests-toggle]");
    for (let i = 0; i < 8; i++) {
      const plus = page.locator('[data-g="adults"] [data-step="1"]');
      if (await plus.isDisabled()) break;
      await plus.click();
    }
    assert.equal(await page.textContent('[data-g="adults"] output'), "6");
    assert.equal(await page.locator('[data-g="children"] [data-step="1"]').isDisabled(), true);
    await page.click('[data-g="pets"] [data-step="1"]');
    assert.equal(await page.locator('[data-g="pets"] [data-step="1"]').isDisabled(), true);
    assert.equal(await page.locator("[data-pet-row]").isVisible(), true);
    assert.equal(await page.textContent("[data-pet]"), "$350");
    await page.click('[data-g="pets"] [data-step="-1"]');
    await page.click("[data-guests-toggle]");
  });

  await check("currency switch converts prices", async () => {
    await page.selectOption(".header-actions [data-currency]", "EUR");
    assert.equal(await page.textContent(".price b"), "€358");
    await page.selectOption(".header-actions [data-currency]", "USD");
    assert.equal(await page.textContent(".price b"), "$389");
  });

  await check("reserve opens request modal and creates demo reference", async () => {
    await page.click("[data-reserve]");
    assert.equal(await page.locator('[data-modal="reserve"]').isVisible(), true);
    await page.click("[data-res-confirm]");
    assert.match(await page.textContent("[data-res-ref]"), /SD-[A-Z0-9]{6}/);
    await page.keyboard.press("Escape");
  });

  await check("lightbox navigates 42 photos with keyboard", async () => {
    await page.click(".ph-c");
    assert.equal(await page.locator("[data-lightbox]").isVisible(), true);
    assert.equal(await page.textContent("[data-lb-index]"), "4");
    await page.keyboard.press("ArrowRight");
    assert.equal(await page.textContent("[data-lb-index]"), "5");
    await page.keyboard.press("ArrowLeft");
    await page.keyboard.press("ArrowLeft");
    assert.equal(await page.textContent("[data-lb-index]"), "3");
    assert.equal(await page.textContent("[data-lb-total]"), "42");
    assert.equal(await page.locator("[data-lb-thumbs] button").count(), 42);
    await page.keyboard.press("Escape");
    assert.equal(await page.locator("[data-lightbox]").isVisible(), false);
  });

  await check("description expands and collapses", async () => {
    await page.click("[data-toggle-desc]");
    assert.equal(await page.getAttribute("#description", "data-collapsed"), "false");
    await page.click("[data-toggle-desc]");
    assert.equal(await page.getAttribute("#description", "data-collapsed"), "true");
  });

  await check("amenities modal lists categories", async () => {
    await page.click('[data-open="amenities"]');
    assert.equal(await page.locator("[data-amen-cats] h3").count(), 6);
    await page.click('[data-modal="amenities"] [data-close]');
  });

  await check("message form validates then confirms", async () => {
    await page.click('[data-open="message"]');
    await page.click('[data-form="message"] [type="submit"]');
    assert.notEqual(await page.textContent('[data-form="message"] [data-err]'), "");
    await page.fill('[data-form="message"] [name="name"]', "Ana");
    await page.fill('[data-form="message"] [name="email"]', "ana@example.com");
    await page.fill('[data-form="message"] [name="msg"]', "Is the villa available for New Year?");
    await page.click('[data-form="message"] [type="submit"]');
    assert.equal(await page.locator('[data-modal="message"] .done').isVisible(), true);
    await page.keyboard.press("Escape");
  });

  await check("report requires a reason", async () => {
    await page.click('.head-actions [data-open="report"]');
    await page.click('[data-form="report"] [type="submit"]');
    assert.match(await page.textContent('[data-form="report"] [data-err]'), /reason/);
    await page.check('[name="reason"][value="inaccurate"]');
    await page.click('[data-form="report"] [type="submit"]');
    assert.equal(await page.locator('[data-modal="report"] .done').isVisible(), true);
    await page.keyboard.press("Escape");
  });

  await check("save toggles and review search filters", async () => {
    await page.click('.head-actions [data-save="casa-azul"]');
    assert.equal(await page.getAttribute('.head-actions [data-save="casa-azul"]', "aria-pressed"), "true");
    await page.click('[data-open="reviews"]');
    await page.fill("[data-review-search]", "seaweed");
    assert.equal(await page.locator("[data-review-list] .review").count(), 1);
    await page.click('[data-modal="reviews"] [data-close]');
    assert.equal(await page.locator('[data-modal="reviews"]').isVisible(), false);
  });

  await check("map zoom limits", async () => {
    await page.click('[data-zoom="in"]');
    assert.match(await page.getAttribute("[data-map-canvas]", "style"), /scale\(1\.25\)/);
    assert.equal(await page.locator('[data-zoom="out"]').isDisabled(), false);
  });
  await context.close();

  const m = await open({ width: 390, height: 844 }, true);
  await check("mobile: no horizontal overflow", async () => {
    assert.equal(await m.page.evaluate(() => document.documentElement.scrollWidth), 390);
  });
  await check("mobile: Reserve bar opens booking sheet with date picker", async () => {
    await m.page.click("[data-mb-reserve]");
    await m.page.waitForTimeout(400);
    assert.equal(await m.page.locator(".booking-card.open").count(), 1);
    assert.equal(await m.page.locator("[data-date-pop]").isVisible(), true);
    const pair = await pickSevenNights(m.page, "pop");
    if (pair) {
      await m.page.click(`[data-calendar="pop"] [data-day="${pair[0]}"]`);
      await m.page.click(`[data-calendar="pop"] [data-day="${pair[1]}"]`);
      assert.match(await m.page.textContent("[data-mb-dates]"), /\$3,332 total/);
    }
    await m.page.click("[data-sheet-close]");
    await m.page.waitForTimeout(400);
    assert.equal(await m.page.locator(".booking-card.open").count(), 0);
  });
  await check("mobile: gallery swipe updates counter", async () => {
    await m.page.evaluate(() => { const c = document.querySelector("[data-carousel]"); c.scrollTo({ left: c.clientWidth * 2 }); });
    await m.page.waitForTimeout(400);
    assert.equal(await m.page.textContent("[data-carousel-index]"), "3");
  });
  await check("mobile: menu toggles", async () => {
    await m.page.click(".menu-btn");
    assert.equal(await m.page.locator("#mobile-nav").isVisible(), true);
    await m.page.click(".menu-btn");
    assert.equal(await m.page.locator("#mobile-nav").isVisible(), false);
  });
  await m.context.close();

  assert.deepEqual(errors, [], `runtime errors: ${errors.join("; ")}`);
  console.log(results.join("\n"));
  console.log(`\n${results.length} checks passed`);
} finally {
  await browser.close();
  await server.close();
}
