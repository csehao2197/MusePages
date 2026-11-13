import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { readFile, readdir, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { chromium, expect } from "@playwright/test";
import { startPreviewServer } from "../../../../src/workflows/generate-preview.mjs";
import { validateStaticOutput } from "../../../../src/workflows/render-prompt-pages.mjs";

const root = process.cwd();
const folder = path.join(root, "out", "pages", "038-membership-comparison", "GPT-6");
const exported = path.join(folder, "out");
const checks = path.join(folder, ".checks");
const requests = [];
const problems = [];
let browser;
let service;
let digest;
let contexts = 0;
const testNames = [];

async function guard() {
  const lock = JSON.parse(await readFile(path.join(root, "out", ".generation-locks", "038-membership-comparison.lock"), "utf8"));
  assert.ok(process.env.MUSEPAGES_GENERATION_SESSION, "Run under the active generation session lock");
  assert.equal(lock.session, process.env.MUSEPAGES_GENERATION_SESSION);
  assert.equal(lock.prompt, "038-membership-comparison");
  process.kill(lock.pid, 0);
}
before(async () => {
  await guard();
  await mkdir(checks, { recursive: true });
  service = await startPreviewServer(exported, { workspace: root });
  const response = await fetch(service.url);
  assert.equal(response.status, 200);
  browser = await chromium.launch({ headless: true });
});
after(async () => {
  try { await browser?.close(); } finally { await service?.close(); }
});
async function visit(options = {}) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: "reduce", ...options });
  contexts++;
  await context.addInitScript(() => {
    window.__storageWrites = 0;
    Storage.prototype.setItem = function () { window.__storageWrites++; throw Error("Unexpected browser storage write"); };
  });
  const page = await context.newPage();
  page.setDefaultTimeout(10000);
  page.on("pageerror", (error) => problems.push(error.message));
  page.on("response", (response) => { if (response.status() >= 400) problems.push(`HTTP ${response.status()} ${response.url()}`); });
  page.on("requestfailed", (request) => problems.push(`Failed: ${request.url()} ${request.failure()?.errorText}`));
  page.on("request", (request) => {
    requests.push({ method: request.method(), url: request.url() });
    if (!request.url().startsWith(new URL(service.url).origin) && !request.url().startsWith("blob:")) problems.push(`External request: ${request.url()}`);
    if (request.method() !== "GET") problems.push(`Unexpected method ${request.method()}`);
  });
  await page.goto(service.url, { waitUntil: "networkidle" });
  for (const image of await page.locator("img").all()) await image.scrollIntoViewIfNeeded();
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all([...document.images].map((image) => image.decode()));
  });
  return { page, context };
}
async function done(page, context) {
  assert.equal(await page.evaluate(() => window.__storageWrites), 0);
  assert.deepEqual(problems, []);
  await context.close();
}
function check(name, run) {
  test(name, { timeout: 90000 }, async () => { await run(); testNames.push(name); });
}
check("Source/export equality, actual static validator and asset bounds", async () => {
  for (const file of ["index.html", "style.css", "app.js"]) assert.deepEqual(await readFile(path.join(folder, file)), await readFile(path.join(exported, file)));
  const assets = await readdir(path.join(folder, "assets"));
  assert.ok(assets.includes("icons.svg") && assets.includes("lucide-LICENSE.txt"));
  for (const file of assets) assert.deepEqual(await readFile(path.join(folder, "assets", file)), await readFile(path.join(exported, "assets", file)));
  for (const file of await readdir(exported)) assert.ok(["index.html", "style.css", "app.js", "assets", "preview.png"].includes(file), `Unexpected public file ${file}`);
  digest = await validateStaticOutput(exported, "membership-comparison", "GPT-6");
  assert.ok(digest);
});
check("Billing toggle updates all cards and sticky comparison prices accurately", async () => {
  const { page, context } = await visit();
  try {
    await expect(page.locator("h1")).toHaveText("Find Your PerfectMembership.");
    assert.equal(await page.locator("tbody tr").count(), 15);
    await page.getByRole("button", { name: "Annual Save 16–20%" }).click();
    for (const [plan, price, total] of [["basic", 24, 288], ["standard", 39, 468], ["premium", 65, 780], ["elite", 125, 1500]]) {
      await expect(page.locator(`[data-price="${plan}"]`)).toHaveText(`$${price}`);
      await expect(page.locator(`[data-table-price="${plan}"]`)).toHaveText(`$${price}/mo · prepaid`);
      await expect(page.locator(`[data-bill="${plan}"]`)).toContainText(total.toLocaleString("en-US"));
    }
    await expect(page.locator("[data-billing=annual]")).toHaveAttribute("aria-pressed", "true");
    await page.locator("[data-billing=monthly]").click();
    await expect(page.locator("[data-price=standard]")).toHaveText("$49");
    await page.locator("#compare").scrollIntoViewIfNeeded();
    await page.evaluate(() => window.scrollBy(0, 340));
    const sticky = await page.locator("thead th").first().evaluate((element) => ({ position: getComputedStyle(element).position, top: element.getBoundingClientRect().top }));
    assert.equal(sticky.position, "sticky");
    assert.ok(sticky.top >= -1 && sticky.top <= 2, `Sticky header top ${sticky.top}`);
  } finally { await done(page, context); }
});
check("Add-ons, annual prepayment, offer arithmetic and included-towel edge case", async () => {
  const { page, context } = await visit();
  try {
    await page.locator('.addons input[value="locker"]').check();
    await page.locator('.addons input[value="guests"]').check();
    await expect(page.locator("#estimate-price")).toHaveText("$64");
    await expect(page.locator("#estimate-note")).toContainText("initial total: $40");
    await page.locator("#review-estimate").click();
    await expect(page.locator("#quote-summary .total")).toHaveText("Estimated initial total$40");
    await page.locator("#enroll-billing").selectOption("annual");
    await page.locator("#discount").selectOption("student");
    // Standard annual base: 39*.8 = 31.20; 11 paid months + 15 locker + 25 pack.
    await expect(page.locator("#quote-summary .total")).toHaveText("Estimated initial total$383.20");
    await expect(page.locator("#quote-summary")).toContainText("$374.40/year");
    await page.keyboard.press("Escape");
    await page.locator('.addons input[value="towels"]').check();
    await page.locator("#quote-plan").selectOption("premium");
    await expect(page.locator('.addons input[value="towels"]')).toBeDisabled();
    await expect(page.locator('.addons input[value="towels"]')).not.toBeChecked();
    await expect(page.locator("#towel-note")).toContainText("Already included");
    await page.locator("#quote-plan").selectOption("basic");
    await expect(page.locator('.addons input[value="towels"]')).toBeEnabled();
    await expect(page.locator('.addons input[value="towels"]')).not.toBeChecked();
  } finally { await done(page, context); }
});
check("Enrollment native date/time validation, eligibility variants, edit and real local download", async () => {
  const { page, context } = await visit();
  try {
    await page.getByRole("button", { name: "Start Basic" }).click();
    await page.locator("#start-date").fill("2000-01-01");
    await page.locator("#orientation").selectOption("Morning · 8:00");
    await page.getByRole("button", { name: "Preview enrollment", exact: true }).click();
    assert.equal(await page.locator("#start-date").evaluate((element) => element.validity.rangeUnderflow), true);
    await expect(page.locator("#enroll-result")).toBeHidden();
    const today = await page.locator("#start-date").getAttribute("min");
    await page.locator("#start-date").fill(today);
    await page.locator("#orientation").selectOption("");
    await page.getByRole("button", { name: "Preview enrollment", exact: true }).click();
    assert.equal(await page.locator("#orientation").evaluate((element) => element.validity.valueMissing), true);
    await page.locator("#orientation").selectOption("Evening · 18:00");
    await page.locator("#discount").selectOption("senior");
    await expect(page.locator("#quote-summary")).toContainText("From month two: $24.65/month");
    await page.locator("#discount").selectOption("service");
    await expect(page.locator("#quote-summary")).toContainText("From month two: $24.65/month");
    await page.locator("#enroll-location").selectOption("park");
    await page.getByRole("button", { name: "Preview enrollment", exact: true }).click();
    await expect(page.locator("#enroll-result")).toBeVisible();
    await expect(page.locator("#enroll-result-text")).toContainText("Basic · monthly · Parkside");
    const downloadPromise = page.waitForEvent("download");
    await page.locator("#download-quote").click();
    const download = await downloadPromise;
    assert.equal(download.suggestedFilename(), "form-membership-estimate.txt");
    const stream = await download.createReadStream();
    let text = "";
    for await (const chunk of stream) text += chunk.toString();
    assert.match(text, /Not a payment receipt, membership or reservation/);
    assert.match(text, /initial total: \$0/);
    assert.match(text, /Military \/ first responder/);
    await page.locator("#edit-estimate").click();
    await expect(page.locator("#enroll-form")).toBeVisible();
    await expect(page.locator("#enroll-plan")).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(page.locator("#enroll-dialog")).not.toBeVisible();
    await expect(page.getByRole("button", { name: "Start Basic" })).toBeFocused();
  } finally { await done(page, context); }
});
check("Class and facility inclusion, full weekly filters, locations and FAQ work locally", async () => {
  const { page, context } = await visit();
  try {
    await page.locator('[data-tier="basic"]').click();
    await expect(page.locator("#class-inclusion")).toContainText("aren’t included");
    await expect(page.locator('[data-access="standard"] [data-access-label]')).toHaveText("Standard+");
    await page.locator('[data-tier="elite"]').click();
    await expect(page.locator("#class-inclusion")).toContainText("Every class");
    await expect(page.locator("#recovery-access")).toHaveText("Included with Elite");
    await page.locator("#full-schedule").click();
    assert.equal(await page.locator("#schedule-list .class-row").count(), 7);
    for (const day of ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]) {
      await page.locator("#schedule-day").selectOption(day);
      assert.equal(await page.locator("#schedule-list .class-row").count(), 1);
      await expect(page.locator("#schedule-list")).toContainText(day);
    }
    await page.keyboard.press("Escape");
    for (const location of ["central", "park", "river"]) {
      await page.locator("#home-gym").selectOption(location);
      await expect(page.locator(`[data-map="${location}"]`)).toHaveClass("active");
      await expect(page.locator("#location-access")).toContainText("all 3 clubs included");
    }
    await page.locator("#facility-tier").selectOption("basic");
    await expect(page.locator("#location-access")).toContainText("Riverfront access only");
    for (const summary of await page.locator(".faqs summary").all()) {
      await summary.click();
      await expect(summary.locator("..")).toHaveAttribute("open", "");
      await summary.click();
    }
  } finally { await done(page, context); }
});
check("Request whitespace rejection, unsafe text containment, keyboard focus trap and three inquiry kinds", async () => {
  const { page, context } = await visit();
  try {
    await page.getByRole("button", { name: "Try a day on us" }).click();
    await page.locator("#inquiry-message").fill("                   ");
    await page.getByRole("button", { name: "Preview request", exact: true }).click();
    await expect(page.locator("#inquiry-error")).toContainText("10–240");
    await expect(page.locator("#inquiry-result")).toBeHidden();
    const unsafe = '<img src=x onerror="window.__injected=true"> I want a sample tour.';
    await page.locator("#inquiry-message").fill(unsafe);
    await page.getByRole("button", { name: "Preview request", exact: true }).click();
    await expect(page.locator("#inquiry-output")).toHaveText(`Free day pass: ${unsafe}`);
    assert.equal(await page.locator("#inquiry-output img").count(), 0);
    assert.equal(await page.evaluate(() => window.__injected), undefined);
    await page.keyboard.press("Escape");
    await expect(page.getByRole("button", { name: "Try a day on us" })).toBeFocused();
    for (const [name, title] of [["Schedule a tour", "Gym tour"], ["Talk to an advisor", "Membership advisor"]]) {
      await page.getByRole("button", { name, exact: true }).click();
      await expect(page.locator("#inquiry-title")).toHaveText(title);
      await expect(page.locator("#inquiry-message")).toHaveValue("");
      for (let i = 0; i < 9; i++) {
        await page.keyboard.press("Tab");
        assert.equal(await page.evaluate(() => document.activeElement === document.body || Boolean(document.activeElement.closest("#inquiry-dialog"))), true);
      }
      await page.locator("#inquiry-message").fill("I would like to explore this sample club.");
      await page.getByRole("button", { name: "Preview request", exact: true }).click();
      await expect(page.locator("#inquiry-output")).toContainText(title);
      await page.keyboard.press("Escape");
    }
    await page.goto(service.url);
    await expect(page.locator("#inquiry-message")).toHaveValue("");
    await expect(page.locator("#quote-plan")).toHaveValue("standard");
  } finally { await done(page, context); }
});
check("Responsive 1440/1024/768/390/320 layouts, decoded imagery, 44px mobile targets and inspected capture candidates", async () => {
  for (const width of [1440, 1024, 768, 390, 320]) {
    const { page, context } = await visit({ viewport: { width, height: 1000 }, hasTouch: width < 600, isMobile: width < 600 });
    try {
      const dimensions = await page.evaluate(() => ({ document: document.documentElement.scrollWidth, viewport: innerWidth, images: [...document.images].every((image) => image.complete && image.naturalWidth > 0) }));
      assert.equal(dimensions.viewport, width, `Expanded layout viewport at ${width}`);
      assert.ok(dimensions.document <= dimensions.viewport + 1, `Overflow ${width}: ${JSON.stringify(dimensions)}`);
      assert.equal(dimensions.images, true);
      const reduced = await page.evaluate(() => ({ reduced: matchMedia("(prefers-reduced-motion: reduce)").matches, behavior: getComputedStyle(document.documentElement).scrollBehavior }));
      assert.deepEqual(reduced, { reduced: true, behavior: "auto" });
      if (width < 600) {
        const undersized = await page.evaluate(() => [...document.querySelectorAll("button,a,summary,select,input,textarea")].filter((element) => {
          if (element.closest("dialog") || element.closest(".skip") || element.matches("input[type=checkbox]")) return false;
          const box = element.getBoundingClientRect();
          return box.width > 0 && box.height > 0 && box.height < 43.9;
        }).map((element) => ({ text: element.textContent.trim().slice(0, 50), height: element.getBoundingClientRect().height })));
        assert.deepEqual(undersized, [], `Small targets at ${width}`);
        const table = page.locator(".table-scroll");
        await table.scrollIntoViewIfNeeded();
        await table.evaluate((element) => { element.scrollLeft = element.scrollWidth; });
        assert.ok(await table.evaluate((element) => element.scrollLeft > 0));
        await page.locator("#mobile-join").tap();
        await expect(page.locator("#enroll-dialog")).toBeVisible();
        assert.ok(await page.locator("#enroll-dialog").evaluate((element) => element.scrollWidth <= element.clientWidth + 1));
        await page.getByRole("button", { name: "Close membership preview" }).tap();
        await page.locator("[data-billing=annual]").tap();
        await expect(page.locator("[data-price=standard]")).toHaveText("$39");
        await page.locator("[data-billing=monthly]").tap();
      }
      if (width === 1440 || width === 390) {
        await guard();
        await page.evaluate(() => window.scrollTo(0, 0));
        await page.screenshot({ path: path.join(checks, width === 1440 ? "desktop.png" : "mobile.png") });
        await page.screenshot({ path: path.join(checks, width === 1440 ? "desktop-full.png" : "mobile-full.png"), fullPage: true });
        if (width === 390) {
          await page.locator("#spaces").scrollIntoViewIfNeeded();
          await page.screenshot({ path: path.join(checks, "mobile-spaces.png") });
        }
      }
    } finally { await done(page, context); }
  }
});
check("Final fresh browser receipt records only successful actual checks and no network/storage failures", async () => {
  await guard();
  assert.equal(testNames.length, 7, "Every previous test must pass before a success receipt is written");
  assert.deepEqual(problems, []);
  const finalDigest = await validateStaticOutput(exported, "membership-comparison", "GPT-6");
  assert.equal(digest, finalDigest);
  await writeFile(path.join(checks, "validation.json"), JSON.stringify({
    checkedAt: new Date().toISOString(), digest: finalDigest, errors: [],
    command: "node --test out\\pages\\038-membership-comparison\\GPT-6\\page.test.mjs",
    browser: "Installed Playwright Chromium, real nested static mount /pages/membership-comparison/GPT-6/index.html",
    tests: [...testNames, "Final receipt integrity"], testCount: 8, contexts,
    viewports: [1440, 1024, 768, 390, 320], mobileTargets: "44px or larger, checkbox targets use full wrapping labels",
    network: { requestCount: requests.length, methods: [...new Set(requests.map((request) => request.method))], externalRequests: 0, pageErrors: 0, httpErrors: 0, requestFailures: 0, storageWrites: 0 },
    details: "Cards/table billing, live sticky headers, discount rounding, first-month credit, add-on recurrence, included towel reset, date/time validity, local download bytes, classes/schedules/facilities/location synchronization, six FAQs, whitespace and unsafe text, native dialog keyboard/escape/focus restoration, touch controls, horizontal matrix, image decode, fonts ready, reduced motion, public/source asset equality",
    screenshots: ["desktop.png", "desktop-full.png", "mobile.png", "mobile-full.png", "mobile-spaces.png"].map((file) => `.checks\\${file}`),
    cleanup: "Each browser context closed in finally; browser and temporary random-port static server closed in after hook.",
  }, null, 2) + "\n");
});
