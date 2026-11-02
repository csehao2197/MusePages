import { test, expect, type Page } from "@playwright/test";

async function openFree(page: Page) {
  await page.getByRole("button", { name: "Join Free", exact: true }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
}
async function activate(page: Page, alias = "PracticeMango") {
  await page.getByLabel("Made-up alias").fill(alias);
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: /Activate .* practice pass/ }).click();
  await expect(page.getByRole("heading", { name: "You're in. Your pace, your way." })).toBeVisible();
}
test.beforeEach(async ({ page }) => { await page.goto("/"); });

test("archival dates, brand, safe claims, local assets, and responsive render", async ({ page }, testInfo) => {
  const errors: string[] = [];
  const external: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  page.on("request", request => { if (!request.url().startsWith("http://127.0.0.1:3134")) external.push(request.url()); });
  await page.reload();
  await expect(page).toHaveTitle(/IGNITE 30.*Local demo/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("30 DAYS.YOUR PACE.ALL HEART.");
  await expect(page.getByLabel("Archived countdown: 0 days, 0 hours, 0 minutes, 0 seconds")).toHaveCount(2);
  await expect(page.getByText("April 1–30, 2026 has ended. Practice demo is open.")).toHaveCount(2);
  await expect(page.getByText("FICTIONAL COMMUNITY STORY", { exact: true })).toHaveCount(3);
  await expect(page.getByRole("img", { name: /Original illustration/ })).toBeVisible();
  expect(await page.locator("body").evaluate(el => el.scrollWidth <= window.innerWidth)).toBe(true);
  await page.screenshot({ path: testInfo.outputPath(`${testInfo.project.name}-full.png`), fullPage: true });
  await page.screenshot({ path: testInfo.outputPath(`${testInfo.project.name}-hero.png`) });
  expect(errors).toEqual([]);
  expect(external).toEqual([]);
});

test("schedule weeks, source exercises, level filters, empty recovery, modal focus return", async ({ page }) => {
  const rail = page.getByLabel("Week 1 workout schedule", { exact: true });
  await expect(rail.locator("article")).toHaveCount(7);
  const preview = page.getByRole("button", { name: "Preview day 1: Full Body Fire" });
  await preview.click();
  const dialog = page.getByRole("dialog");
  await expect(dialog.getByRole("heading", { name: "Full Body Fire", exact: true })).toBeVisible();
  await expect(dialog.getByText("DAY 1 · 28 MIN · BEGINNER")).toBeVisible();
  await expect(dialog.locator(".exercise-list li")).toHaveCount(5);
  await expect(dialog.getByText("Mountain climbers", { exact: true })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(preview).toBeFocused();
  await page.getByLabel("Workout level", { exact: true }).selectOption("Intermediate");
  await expect(rail.locator("article")).toHaveCount(3);
  await page.getByRole("button", { name: "Finish 29–30", exact: true }).click();
  await expect(page.getByText("No matching workouts in this week.")).toBeVisible();
  await page.getByRole("button", { name: "Show all workouts", exact: true }).click();
  const finish = page.getByLabel("Week 5 workout schedule", { exact: true });
  await expect(finish.locator("article")).toHaveCount(2);
  await expect(finish.getByText("Your Favorite Flow", { exact: true })).toBeVisible();
  await expect(finish.getByText("Reset & Reflect", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Week 2 8–14", exact: true }).click();
  await expect(page.getByLabel("Week 2 workout schedule", { exact: true }).locator("article")).toHaveCount(7);
});

test("native signup validation, local error recovery, confirmation and no requests", async ({ page }) => {
  await openFree(page);
  const dialog = page.getByRole("dialog");
  await page.getByRole("button", { name: "Activate Free practice pass" }).click();
  expect(await page.getByLabel("Made-up alias").evaluate((el: HTMLInputElement) => el.validity.valueMissing)).toBe(true);
  await page.getByLabel("Made-up alias").fill("A");
  expect(await page.getByLabel("Made-up alias").evaluate((el: HTMLInputElement) => el.validity.tooShort)).toBe(true);
  await page.getByLabel("Made-up alias").fill("  ");
  await page.getByRole("button", { name: "Activate Free practice pass" }).click();
  expect(await page.getByRole("checkbox").evaluate((el: HTMLInputElement) => el.validity.valueMissing)).toBe(true);
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Activate Free practice pass" }).click();
  await expect(dialog.getByRole("alert")).toHaveText("Use a made-up alias with at least 2 non-space characters.");
  const submissions: string[] = [];
  page.on("request", request => { if (request.method() !== "GET") submissions.push(request.url()); });
  await activate(page);
  await expect(dialog).toContainText("Sample total: $0 USD one-time. Charged today: $0.");
  await page.getByRole("button", { name: "Got it", exact: true }).click();
  await expect(page.getByRole("heading", { name: "PracticeMango's practice progress", exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Unlock day 4: Core Crusher" })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Preview day 4: Core Crusher" })).toBeVisible();
  expect(submissions).toEqual([]);
  expect(await page.evaluate(() => [localStorage.length, sessionStorage.length])).toEqual([0, 0]);
});

test("pricing math, free/pro gating, plan switching, completion undo and refresh clearing", async ({ page }) => {
  await expect(page.locator(".price-card.free .price>strong")).toHaveText("$0");
  await expect(page.locator(".price-card.pro .price>strong")).toHaveText("$29");
  await page.getByRole("button", { name: "Unlock day 6: HIIT Storm" }).click();
  await expect(page.getByRole("heading", { name: "Your Pro practice pass" })).toBeVisible();
  await expect(page.locator(".order-summary")).toHaveText("Sample one-time total$29 USDCharged today / actual charge$0 USD");
  await page.getByRole("button", { name: "Free $0 USD", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Your Free practice pass" })).toBeVisible();
  await page.getByRole("button", { name: "Pro $29 USD", exact: true }).click();
  await activate(page, "OrangeOrbit");
  await expect(page.getByRole("dialog")).toContainText("Sample total: $29 USD one-time. Charged today: $0.");
  await page.getByRole("button", { name: "Got it", exact: true }).click();
  await page.getByRole("button", { name: "Preview day 6: HIIT Storm" }).click();
  await expect(page.getByRole("dialog").locator(".exercise-list li")).toHaveCount(4);
  await page.getByRole("button", { name: "Mark day 6 complete (demo)", exact: true }).click();
  await expect(page.getByRole("progressbar")).toHaveAttribute("value", "1");
  await page.getByRole("button", { name: "Undo day 6 selection", exact: true }).click();
  await expect(page.getByRole("progressbar")).toHaveAttribute("value", "0");
  await page.getByRole("button", { name: "Mark day 6 complete (demo)", exact: true }).click();
  await page.keyboard.press("Escape");
  await page.reload();
  await expect(page.getByRole("progressbar")).toHaveAttribute("value", "0");
  await expect(page.getByRole("button", { name: "Unlock day 6: HIIT Storm" })).toHaveCount(1);
});

test("reset cancellation preserves state and reset clears all selections", async ({ page }) => {
  await openFree(page); await activate(page);
  await page.getByRole("button", { name: "Got it", exact: true }).click();
  await page.getByRole("button", { name: "Preview day 1: Full Body Fire" }).click();
  await page.getByRole("button", { name: "Mark day 1 complete (demo)", exact: true }).click();
  await page.keyboard.press("Escape");
  await page.getByLabel("Workout level", { exact: true }).selectOption("Intermediate");
  await page.getByRole("button", { name: "Week 3 15–21", exact: true }).click();
  await page.getByRole("button", { name: "Reset demo", exact: true }).click();
  await page.getByRole("button", { name: "Keep my selections", exact: true }).click();
  await expect(page.getByRole("progressbar")).toHaveAttribute("value", "1");
  await expect(page.getByLabel("Workout level", { exact: true })).toHaveValue("Intermediate");
  await page.getByRole("button", { name: "Reset demo", exact: true }).click();
  await page.getByRole("button", { name: "Reset all selections", exact: true }).click();
  await expect(page.getByRole("progressbar")).toHaveAttribute("value", "0");
  await expect(page.getByLabel("Workout level", { exact: true })).toHaveValue("All workouts");
  await expect(page.getByRole("button", { name: "Week 1 1–7", exact: true })).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByRole("heading", { name: /PracticeMango/ })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Unlock day 4: Core Crusher" })).toHaveCount(1);
});

test("FAQs, coach, points explainer, privacy and keyboard modal confinement", async ({ page }) => {
  const faq = page.getByRole("button", { name: "When does the challenge start?" });
  await faq.click();
  await expect(faq).toHaveAttribute("aria-expanded", "true");
  await expect(page.locator("#faq-5")).toContainText("April 1–30, 2026 cohort is archival");
  await faq.press("Enter");
  await expect(faq).toHaveAttribute("aria-expanded", "false");
  await page.getByRole("button", { name: "How points work", exact: true }).click();
  await expect(page.locator("#points-info")).toBeVisible();
  await expect(page.locator("#points-info")).toContainText("not calculated from this local tracker");
  await page.getByRole("button", { name: "Read the coach note", exact: true }).click();
  await expect(page.getByRole("dialog")).toContainText("not a qualified trainer's assessment");
  await page.keyboard.press("Escape");
  await expect(page.getByRole("button", { name: "Read the coach note", exact: true })).toBeFocused();
  const privacy = page.getByRole("button", { name: "Privacy & demo terms", exact: true });
  await privacy.click();
  for (let i = 0; i < 7; i++) {
    await page.keyboard.press("Tab");
    // Chromium may place focus on the dialog itself at the wrap boundary.
    expect(await page.evaluate(() => !!document.activeElement?.closest("dialog"))).toBe(true);
  }
  await page.keyboard.press("Escape");
  await expect(privacy).toBeFocused();
});

test("responsive navigation, small-screen overflow, reduced motion and anchor journeys", async ({ page }, testInfo) => {
  if (testInfo.project.name === "mobile") {
    const toggle = page.getByRole("button", { name: "Open navigation", exact: true });
    await toggle.click();
    await expect(page.getByRole("navigation", { name: "Mobile navigation" })).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("navigation", { name: "Mobile navigation" })).not.toBeVisible();
    await expect(toggle).toBeFocused();
    await toggle.click();
    await page.getByRole("navigation", { name: "Mobile navigation" }).getByRole("link", { name: "Workouts", exact: true }).click();
    await expect(page).toHaveURL(/#workouts$/);
    await expect(page.getByRole("navigation", { name: "Mobile navigation" })).not.toBeVisible();
    await expect(page.locator(".mobile-sticky")).toBeVisible();
    await expect(page.locator(".price-card.pro")).toHaveCSS("order", "-1");
  } else {
    await page.getByRole("navigation", { name: "Main navigation" }).getByRole("link", { name: "Pricing", exact: true }).click();
    await expect(page).toHaveURL(/#pricing$/);
  }
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator("html")).toHaveCSS("scroll-behavior", "auto");
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    expect(await page.locator("body").evaluate(el => el.scrollWidth <= window.innerWidth), `overflow at ${width}px`).toBe(true);
  }
});

test("all enrollment journeys and local information actions are connected", async ({ page }) => {
  for (const name of ["Explore my free spot", "Join IGNITE 30 — it's free", "Join the local demo"]) {
    await page.getByRole("button", { name, exact: true }).click();
    await expect(page.getByRole("heading", { name: "Your Free practice pass", exact: true })).toBeVisible();
    await page.getByRole("button", { name: "Close dialog", exact: true }).click();
  }
  await page.getByRole("button", { name: "Explore Pro — $29", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Your Pro practice pass", exact: true })).toBeVisible();
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: "Nutrition philosophy", exact: true }).click();
  await expect(page.getByRole("dialog")).toContainText("no macro calculations");
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: "Community guidelines", exact: true }).click();
  await expect(page.getByRole("dialog")).toContainText("welcome rest");
});
