import test from "node:test";
import assert from "node:assert/strict";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { chromium, expect } from "@playwright/test";
import { startPreviewServer } from "../../../../src/workflows/generate-preview.mjs";
import { StaticHomepage } from "../../../../src/workflows/render-prompt-pages.mjs";

const model = fileURLToPath(new URL(".", import.meta.url));
const workspace = fileURLToPath(new URL("../../../../", import.meta.url));
const checks = path.join(model, ".checks");
test("Ava Chen independent, local-only product design portfolio", { timeout: 180000 }, async (t) => {
  const service = await startPreviewServer(path.join(model, "out"), { workspace });
  const browser = await chromium.launch();
  t.after(async () => { await browser.close(); await service.close(); });
  await mkdir(checks, { recursive: true });
  const errors = [], requests = [];
  let failures = 0;
  const check = (name, action) => t.test(name, async () => { try { await action(); } catch (error) { failures++; throw error; } });
  async function visit(options = {}, hash = "") {
    const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: "reduce", ...options });
    const page = await context.newPage(); page.setDefaultTimeout(10000);
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("response", (response) => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
    page.on("requestfailed", (request) => errors.push(`${request.failure()?.errorText} ${request.url()}`));
    await context.route("**/*", (route) => {
      const request = route.request(); requests.push([request.url(), request.method()]);
      return new URL(request.url()).origin === new URL(service.url).origin ? route.continue() : route.abort();
    });
    await page.goto(`${service.url}${hash}`, { waitUntil: "networkidle" }); await page.evaluate(() => document.fonts.ready);
    return { context, page };
  }
  async function images(page) {
    await page.locator("img[src]").evaluateAll((list) => Promise.all(list.map((image) => { image.loading = "eager"; return image.decode(); })));
  }
  await check("public nested mount, original assets, four cases, actual resume and truthful profile references", async () => {
    const { context, page } = await visit();
    try {
      await images(page);
      assert.equal(new URL(page.url()).pathname, "/pages/ux-ui-designer-portfolio/GPT-6/index.html");
      await expect(page.locator("h1")).toHaveText("I design digital products that people actually enjoy using.");
      await expect(page.locator(".project")).toHaveCount(4); await expect(page.locator(".quote-grid figure")).toHaveCount(4);
      await expect(page.locator(".concept-note")).toContainText("fictional examples");
      const resume = await page.request.get(new URL("assets/ava-chen-resume.txt", service.url).href);
      assert.equal(resume.status(), 200); assert.ok((await resume.text()).includes("FICTIONAL CONCEPT RESUME"));
      await expect(page.getByRole("link", { name: "Download Resume", exact: true })).toHaveAttribute("download", "ava-chen-concept-resume.txt");
      for (const [key, title] of [["calendar", "Notion Calendar Redesign"], ["analytics", "Stripe Dashboard Analytics"], ["plugins", "Figma Plugin Manager"], ["health", "HealthTrack Patient Portal"]]) {
        await page.locator(`[data-case="${key}"]`).focus(); await page.keyboard.press("Enter");
        await expect(page.locator("#case-dialog")).toBeVisible(); await expect(page.locator("#case-title")).toHaveText(title);
        assert.equal(new URL(page.url()).hash, `#case-${key}`);
        await expect(page.locator("#case-overview")).toContainText("The challenge");
        await page.locator("#tab-overview").focus(); await page.keyboard.press("ArrowRight");
        await expect(page.locator("#tab-approach")).toBeFocused(); await expect(page.locator("#panel-approach")).toBeVisible();
        await expect(page.locator("#case-approach h3")).toHaveCount(5);
        await expect(page.locator("#case-approach")).toContainText("tradeoff");
        await page.keyboard.press("Escape"); await expect(page.locator("#case-dialog")).toBeHidden();
        await expect(page.locator(`[data-case="${key}"]`)).toBeFocused();
      }
      await page.locator('.about-copy [data-profile="LinkedIn"]').click();
      await expect(page.locator("#profile-dialog")).toContainText("No verified profile");
      await page.keyboard.press("Escape");
      for (const file of ["index.html", "style.css", "app.js"]) assert.equal(await readFile(path.join(model, file), "utf8"), await readFile(path.join(model, "out", file), "utf8"));
    } finally { await context.close(); }
  });
  await check("four substantive local interaction sketches and deep-link/history navigation", async () => {
    const { context, page } = await visit({}, "#case-calendar");
    try {
      await expect(page.locator("#case-dialog")).toBeVisible();
      await page.locator("#tab-prototype").click(); await expect(page.locator("#event-list li")).toHaveCount(2);
      await page.locator("#event-title").fill("   "); await page.locator("#event-form button").click();
      assert.equal(await page.locator("#event-title").evaluate((input) => input.validity.customError), true);
      await page.locator("#event-title").fill("<b>Focus time</b>"); await page.locator("#event-form button").click();
      await expect(page.locator("#event-list li")).toHaveCount(3); await expect(page.locator("#event-list b")).toHaveCount(0);
      await page.locator("#workspace").selectOption("Personal"); await expect(page.locator("#event-list li")).toHaveCount(1);
      await page.locator("#workspace").selectOption("Work"); await expect(page.locator("#event-list li")).toHaveCount(3);
      await page.locator("#close-case").click();
      await page.locator('[data-case="analytics"]').click(); await page.locator("#tab-prototype").click();
      await expect(page.locator("#revenue")).toContainText("$24,180"); await expect(page.locator(".demo-bars>div")).toHaveCount(5);
      await page.locator('[data-period="month"]').click(); await expect(page.locator("#revenue")).toContainText("$96,420"); await expect(page.locator(".demo-bars>div")).toHaveCount(4);
      await page.locator("#close-case").click();
      await page.locator('[data-case="plugins"]').click(); await page.locator("#tab-prototype").click();
      await page.locator("#plugin-search").fill("contrast"); await expect(page.locator("#plugin-list li")).toHaveCount(1);
      await page.getByRole("button", { name: "Install Contrast Notes", exact: true }).click();
      await expect(page.getByRole("button", { name: "Uninstall Contrast Notes", exact: true })).toHaveAttribute("aria-pressed", "true");
      await page.keyboard.press("Enter"); await expect(page.getByRole("button", { name: "Install Contrast Notes", exact: true })).toBeVisible();
      await page.locator("#plugin-search").fill("no-such-tool"); await expect(page.locator("#plugin-list li")).toHaveCount(0);
      await expect(page.locator("#plugin-status")).toContainText("No tools match");
      await page.locator("#close-case").click();
      await page.locator('[data-case="health"]').click(); await page.locator("#tab-prototype").click();
      await page.locator("#visit-type").selectOption("Follow-up conversation"); await page.locator("#visit-form button").click();
      await expect(page.locator("#visit-status")).toContainText("no appointment has been booked");
      await page.locator("#visit-slot").selectOption({ index: 1 }); await expect(page.locator("#visit-status")).toBeEmpty();
      await page.goBack(); await expect(page.locator("#case-dialog")).toBeHidden();
      assert.equal(await page.evaluate(() => localStorage.length + sessionStorage.length), 0);
    } finally { await context.close(); }
  });
  await check("safe local message validation, loading, editing races and full clearing", async () => {
    const { context, page } = await visit();
    try {
      await page.locator('[name="name"]').fill("   "); await page.locator('[name="email"]').fill("alex@example.com");
      await page.locator('[name="type"]').selectOption("Design System"); await page.locator('[name="message"]').fill("A clear component system for a local concept project.");
      await page.locator(".submit").click(); await expect(page.locator("#receipt")).toBeHidden();
      assert.equal(await page.locator('[name="name"]').evaluate((input) => input.validity.customError), true);
      await page.locator('[name="name"]').fill("<img src=x onerror=alert(1)>"); await page.locator(".submit").click();
      await expect(page.locator(".submit")).toHaveAttribute("aria-busy", "true"); await expect(page.locator("#receipt")).toBeVisible();
      await expect(page.locator("#receipt-text")).toContainText("<img src=x onerror=alert(1)>"); await expect(page.locator("#receipt img")).toHaveCount(0);
      await page.locator('[name="message"]').fill("Changed scope for a second local concept."); await expect(page.locator("#receipt")).toBeHidden();
      await page.locator(".submit").click(); await expect(page.locator(".submit")).toHaveAttribute("aria-busy", "true");
      await page.locator('[name="message"]').fill("A further edit while preparing the local preview.");
      await page.waitForTimeout(600); await expect(page.locator("#receipt")).toBeHidden(); await expect(page.locator(".submit")).toBeEnabled();
      await page.locator(".submit").click(); await expect(page.locator("#receipt")).toBeVisible();
      await page.locator("#clear-message").click(); await expect(page.locator('[name="name"]')).toHaveValue("");
      await expect(page.locator("#receipt-text")).toBeEmpty(); await expect(page.locator("#receipt")).toBeHidden();
      await expect(page.locator('[name="name"]')).toBeFocused();
      assert.equal(await page.evaluate(() => localStorage.length + sessionStorage.length), 0);
    } finally { await context.close(); }
  });
  await check("five responsive widths, mobile targets, real drawer taps and reduced-motion screenshots", async () => {
    for (const width of [1440, 1024, 768, 390, 320]) {
      const { context, page } = await visit({ viewport: { width, height: 1000 }, isMobile: width < 600, hasTouch: width < 600 });
      try {
        await images(page);
        assert.ok(await page.evaluate((w) => document.documentElement.scrollWidth <= w + 1, width), `${width}px document overflow`);
        if (width < 600) {
          const small = await page.locator('a:not(.skip):visible,button:visible,input:visible,select:visible,textarea:visible').evaluateAll((list) => list.filter((element) => { const r = element.getBoundingClientRect(); return r.width < 44 || r.height < 44; }).map((element) => element.textContent.trim().slice(0, 45)));
          assert.deepEqual(small, [], `${width}px actions have 44px targets`);
          await page.locator(".menu").tap(); await expect(page.locator("#mobile-menu")).toBeVisible();
          await expect(page.locator(".menu")).toHaveAttribute("aria-expanded", "true"); await page.keyboard.press("Escape");
          await expect(page.locator(".menu")).toBeFocused(); await expect(page.locator(".menu")).toHaveAttribute("aria-expanded", "false");
          await page.locator(".menu").tap(); await page.locator('#mobile-menu a[href="#contact"]').tap();
          await expect(page.locator("#mobile-menu")).toBeHidden(); assert.equal(new URL(page.url()).hash, "#contact");
          await page.locator('[data-case="calendar"]').tap(); await expect(page.locator("#case-dialog")).toBeVisible();
          await page.locator("#tab-prototype").tap(); await expect(page.locator("#event-form")).toBeVisible();
          assert.ok(await page.locator("#case-dialog").evaluate((element) => element.scrollWidth <= element.clientWidth + 1));
          await page.locator("#close-case").tap();
        }
        if (width === 1440 || width === 390) {
          await page.evaluate(() => scrollTo(0, 0)); await page.screenshot({ path: path.join(checks, `homepage-${width}.png`) });
          await page.locator("#work").scrollIntoViewIfNeeded(); await page.screenshot({ path: path.join(checks, `work-${width}.png`) });
          await page.locator("#about").scrollIntoViewIfNeeded(); await page.screenshot({ path: path.join(checks, `about-${width}.png`) });
          await page.locator("#contact").scrollIntoViewIfNeeded(); await page.screenshot({ path: path.join(checks, `contact-${width}.png`) });
          await page.locator('[data-case="analytics"]').click(); await page.locator("#tab-prototype").click();
          await page.screenshot({ path: path.join(checks, `case-${width}.png`) }); await page.locator("#close-case").click();
        }
      } finally { await context.close(); }
    }
  });
  assert.equal(failures, 0); assert.deepEqual(errors, []);
  assert.ok(requests.every(([url, method]) => method === "GET" && new URL(url).origin === new URL(service.url).origin));
  const digest = await StaticHomepage.validateStaticOutput(path.join(model, "out"), "ux-ui-designer-portfolio", "GPT-6");
  await writeFile(path.join(checks, "validation.json"), JSON.stringify({
    checkedAt: new Date().toISOString(), digest, errors, requests: requests.length,
    tests: "4 browser subtests plus parent; all case dialogs, local sketches, truthful resume/profile, safe form, history and five responsive widths",
  }, null, 2) + "\n");
});
