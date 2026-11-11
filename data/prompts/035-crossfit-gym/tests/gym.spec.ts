import { test, expect, type Locator, type Page } from "@playwright/test";

async function visit(page: Page) {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "STRONGER STARTS HERE." })).toBeVisible();
}
async function fillContact(dialog: Locator) {
  await dialog.getByLabel("Your name").fill("Demo Visitor");
  await dialog.getByLabel("Email for this preview").fill("visitor@example.com");
  await dialog.getByRole("checkbox").check();
}
async function intro(page: Page) {
  await page.locator(".header-cta").click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  return dialog;
}

test("distinctive source sections, sample notices and safe WOD options", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  await visit(page);
  await expect(page.locator(".demo-banner")).toContainText("NO CROSSFIT AFFILIATION");
  for (const id of ["programs", "schedule", "coaches", "pricing", "community", "blog", "faq", "contact"]) {
    await expect(page.locator(`#${id}`)).toBeAttached();
  }
  await page.getByRole("link", { name: "View Today's WOD" }).click();
  const scale = page.getByRole("button", { name: "Scale", exact: true });
  await scale.click();
  await expect(page.getByRole("button", { name: "Hide options" })).toHaveAttribute("aria-expanded", "true");
  await expect(page.locator("#scale-options")).toContainText("not individualized advice");
  await page.getByRole("button", { name: "Hide options" }).click();
  await expect(page.locator("#scale-options")).toHaveCount(0);
  await expect(page.locator("#wod")).toContainText("No prescribed loads, rounds or repetitions");
  expect(errors).toEqual([]);
});

test("day and class filters change real fixtures and recover from an empty day", async ({ page }) => {
  await visit(page);
  await page.locator("#schedule").scrollIntoViewIfNeeded();
  await expect(page.locator(".schedule-row")).toHaveCount(8);
  await page.getByRole("button", { name: "Sat 7", exact: true }).click();
  await expect(page.locator(".schedule-row")).toHaveCount(3);
  await expect(page.locator(".class-time").first()).toHaveText("8:00 AM");
  await page.getByLabel("Class filter").selectOption("Iron Foundations");
  await expect(page.locator(".schedule-row")).toHaveCount(1);
  await expect(page.locator(".coach-name")).toHaveText("Alex");
  await page.getByRole("button", { name: "Sun 8", exact: true }).click();
  await expect(page.getByText("No Iron Foundations classes on Sun.")).toBeVisible();
  await page.getByRole("button", { name: "Clear filter" }).click();
  await expect(page.locator(".schedule-row")).toHaveCount(2);
  await expect(page.getByLabel("Class filter")).toHaveValue("All classes");
});

test("class detail keyboard dialog traps focus and restores its trigger", async ({ page }) => {
  await visit(page);
  await page.locator("#schedule").scrollIntoViewIfNeeded();
  const trigger = page.getByRole("button", { name: "Details for Iron Foundations at 10:00 AM" });
  await trigger.focus();
  await page.keyboard.press("Enter");
  const dialog = page.getByRole("dialog");
  await expect(dialog).toContainText("Thu, Nov 5, 2026");
  await expect(dialog).toContainText("4 fictional spots");
  await expect(dialog).toContainText("$25 / person");
  for (let i = 0; i < 8; i++) {
    await page.keyboard.press("Tab");
    expect(await dialog.evaluate(el => el.contains(document.activeElement))).toBe(true);
  }
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(trigger).toBeFocused();
  await trigger.click();
  await page.getByRole("button", { name: "Preview reservation", exact: true }).click();
  await expect(page.getByRole("dialog").getByLabel("Visit date")).toHaveValue("2026-11-05");
  await expect(page.getByRole("dialog").getByLabel("Class time")).toHaveValue("Thu-3");
});

test("intro native validation, date range, empty date recovery, confirmation and reset", async ({ page }) => {
  await visit(page);
  const dialog = await intro(page);
  await dialog.getByRole("button", { name: "Confirm local preview" }).click();
  await expect(dialog.locator("select:invalid")).toHaveCount(1);
  await dialog.getByLabel("Visit date").fill("2026-11-01");
  expect(await dialog.getByLabel("Visit date").evaluate((el: HTMLInputElement) => el.validity.rangeUnderflow)).toBe(true);
  await dialog.getByLabel("Visit date").fill("2026-11-08");
  await expect(dialog.getByText("No intro classes on this date.")).toBeVisible();
  await dialog.getByRole("button", { name: "Try Monday, Nov 2" }).click();
  await dialog.getByLabel("Class time").selectOption("Mon-3");
  await dialog.getByLabel("Your name").fill("   ");
  expect(await dialog.getByLabel("Your name").evaluate((el: HTMLInputElement) => el.validity.patternMismatch)).toBe(true);
  await dialog.getByLabel("Your name").fill("Demo Visitor");
  await dialog.getByLabel("Email for this preview").fill("not-an-email");
  expect(await dialog.getByLabel("Email for this preview").evaluate((el: HTMLInputElement) => el.validity.typeMismatch)).toBe(true);
  await fillContact(dialog);
  await dialog.getByRole("button", { name: "Confirm local preview" }).click();
  await expect(dialog.getByRole("status")).toContainText("Your visit preview is ready");
  await expect(dialog.getByRole("status")).toContainText("No payment · $0 preview");
  await expect(dialog.getByRole("status")).toContainText("Nothing was sent");
  await dialog.getByRole("button", { name: "Start a new preview" }).click();
  await expect(dialog.getByLabel("Your name")).toHaveValue("");
  await expect(dialog.getByLabel("Class time")).toHaveValue("");
  await expect(dialog.getByRole("checkbox")).not.toBeChecked();
  await dialog.getByLabel("Your name").fill("Erase me");
  await dialog.getByRole("button", { name: "Reset form" }).click();
  await expect(dialog.getByLabel("Your name")).toHaveValue("");
});

test("capacity error recovers and full class produces an explicit waitlist preview", async ({ page }) => {
  await visit(page);
  await page.locator("#schedule").scrollIntoViewIfNeeded();
  await page.getByTestId("session-Thu-6").getByRole("button", { name: "Reserve Your Spot" }).click();
  let dialog = page.getByRole("dialog");
  await fillContact(dialog);
  await dialog.getByLabel("Visitors").fill("4");
  await dialog.getByRole("button", { name: "Confirm local preview" }).click();
  await expect(dialog.getByRole("alert")).toContainText("Only 3 sample spots remain");
  await dialog.getByLabel("Visitors").fill("3");
  await dialog.getByRole("button", { name: "Confirm local preview" }).click();
  await expect(dialog.getByRole("status")).toContainText("3 visitors");
  await page.keyboard.press("Escape");
  await page.getByTestId("session-Thu-1").getByRole("button", { name: "Waitlist", exact: true }).click();
  dialog = page.getByRole("dialog");
  await expect(dialog).toContainText("Full: this will be a waitlist preview");
  await fillContact(dialog);
  await dialog.getByRole("button", { name: "Confirm waitlist preview" }).click();
  await expect(dialog.getByRole("status")).toContainText("Waitlist preview saved");
  await expect(dialog.getByRole("status")).toContainText("no waitlist was joined");
});

test("monthly and annual plan math plus per-class drop-in quantity", async ({ page }) => {
  await visit(page);
  await page.locator("#pricing").scrollIntoViewIfNeeded();
  await expect(page.getByTestId("plan-Unlimited").locator(".price")).toContainText("$185");
  const annual = page.getByRole("switch", { name: "Pay annually and save 15%" });
  await annual.click();
  await expect(annual).toHaveAttribute("aria-checked", "true");
  await expect(page.getByTestId("plan-Unlimited")).toContainText("$157.25");
  await expect(page.getByTestId("plan-Unlimited")).toContainText("$1,887 / year · save $333");
  await expect(page.getByTestId("plan-Competitor")).toContainText("$2,295 / year · save $405");
  await expect(page.getByTestId("plan-Drop-In").locator(".price")).toContainText("$25/class");
  await page.getByTestId("plan-Unlimited").getByRole("button", { name: "Start Free Week" }).click();
  let dialog = page.getByRole("dialog");
  await expect(dialog.locator(".estimate")).toContainText("$1,887 / year");
  await dialog.getByLabel("Class time").selectOption("Mon-3");
  await fillContact(dialog);
  await dialog.getByRole("button", { name: "Confirm local preview" }).click();
  await expect(dialog.getByRole("status")).toContainText("Estimate: $1,887 / year");
  await page.keyboard.press("Escape");
  await annual.click();
  await expect(page.getByTestId("plan-Competitor").locator(".price")).toContainText("$225");
  await page.getByTestId("plan-Drop-In").getByRole("button", { name: "Buy a Drop-In" }).click();
  dialog = page.getByRole("dialog");
  await dialog.getByLabel("Class time").selectOption("Mon-0");
  await dialog.getByLabel("Visitors").fill("3");
  await expect(dialog.locator(".estimate")).toContainText("$75");
  await dialog.getByLabel("Visitors").fill("5");
  expect(await dialog.getByLabel("Visitors").evaluate((el: HTMLInputElement) => el.validity.rangeOverflow)).toBe(true);
  await dialog.getByLabel("Visitors").fill("3");
  await fillContact(dialog);
  await dialog.getByRole("button", { name: "Confirm local preview" }).click();
  await expect(dialog.getByRole("status")).toContainText("Estimate: $75");
});

test("programs, fictional coaches, journal, FAQs and location have working journeys", async ({ page }) => {
  await visit(page);
  await page.getByRole("button", { name: "Learn more about Iron Foundations" }).click();
  let dialog = page.getByRole("dialog");
  await expect(dialog).toContainText("weekly for four weeks");
  await dialog.getByRole("button", { name: "Preview an intro" }).click();
  await expect(page.getByRole("dialog").getByLabel("Class time")).toContainText("Iron Foundations");
  await page.keyboard.press("Escape");
  const coach = page.getByRole("button", { name: "Meet Priya Sharma" });
  await coach.scrollIntoViewIfNeeded();
  await coach.click();
  dialog = page.getByRole("dialog");
  await expect(dialog).toContainText("Olympic lifting and mobility");
  await expect(dialog).toContainText("unverified");
  await page.keyboard.press("Escape");
  await expect(coach).toBeFocused();
  await page.getByRole("button", { name: /What to expect on day one/ }).click();
  await expect(page.getByRole("dialog")).toContainText("no performance test");
  await page.keyboard.press("Escape");
  await page.locator("#faq").scrollIntoViewIfNeeded();
  await page.getByText("Do I need experience?", { exact: true }).click();
  await expect(page.getByText("No. In this fictional gym", { exact: false })).toBeVisible();
  await page.getByRole("button", { name: "Get Directions" }).click();
  await expect(page.getByRole("dialog")).toContainText("not a navigational map");
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: "Member Portal", exact: true }).click();
  await expect(page.getByRole("dialog")).toContainText("no accounts, passwords");
});

test("local inquiry validates, resets, confirms and clears without requests or storage", async ({ page }) => {
  const external: string[] = [];
  const posts: string[] = [];
  page.on("request", request => {
    if (!request.url().startsWith("http://127.0.0.1:3135")) external.push(request.url());
    if (request.method() === "POST") posts.push(request.url());
  });
  await visit(page);
  const form = page.locator(".inquiry form");
  await form.scrollIntoViewIfNeeded();
  await form.getByRole("button", { name: "Preview inquiry" }).click();
  await expect(form.locator("input:invalid")).toHaveCount(3);
  await form.getByLabel("Name", { exact: true }).fill("Demo Visitor");
  await form.getByLabel("Email", { exact: true }).fill("visitor@example.com");
  await form.getByLabel("What would you like to know?").selectOption("Drop-in classes");
  await form.getByRole("checkbox").check();
  await form.getByRole("button", { name: "Reset", exact: true }).click();
  await expect(form.getByLabel("Name", { exact: true })).toHaveValue("");
  await expect(form.getByRole("checkbox")).not.toBeChecked();
  await form.getByLabel("Name", { exact: true }).fill("Demo Visitor");
  await form.getByLabel("Email", { exact: true }).fill("visitor@example.com");
  await form.getByLabel("What would you like to know?").selectOption("My first intro");
  await form.getByRole("checkbox").check();
  await form.getByRole("button", { name: "Preview inquiry" }).click();
  await expect(page.locator(".inquiry").getByRole("status")).toContainText("Nothing was sent or stored");
  await page.getByRole("button", { name: "Write another inquiry" }).click();
  await expect(form.getByLabel("Email", { exact: true })).toHaveValue("");
  expect(await page.evaluate(() => [localStorage.length, sessionStorage.length])).toEqual([0, 0]);
  expect(external).toEqual([]);
  expect(posts).toEqual([]);
});

test("responsive navigation, reduced motion, overflow and final renders", async ({ page }, testInfo) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await visit(page);
  expect(await page.locator(".ticker>div").evaluate(el => getComputedStyle(el).animationName)).toBe("none");
  if (testInfo.project.name === "mobile") {
    const menu = page.locator(".menu-toggle");
    await menu.click();
    await expect(menu).toHaveAttribute("aria-expanded", "true");
    await page.keyboard.press("Escape");
    await expect(menu).toBeFocused();
    await menu.click();
    await page.getByRole("navigation", { name: "Main navigation" }).getByRole("link", { name: "Schedule", exact: true }).click();
    await expect(menu).toHaveAttribute("aria-expanded", "false");
    await expect(page.locator(".mobile-sticky")).toBeVisible();
    await page.locator(".mobile-sticky").getByRole("button", { name: "Free Intro Class" }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.keyboard.press("Escape");
  }
  for (const id of ["top", "schedule", "coaches", "pricing", "contact"]) {
    await page.locator(`#${id}`).scrollIntoViewIfNeeded();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  }
  await page.goto("/");
  await page.screenshot({ path: testInfo.outputPath(`${testInfo.project.name}-full.png`), fullPage: true });
  await page.screenshot({ path: testInfo.outputPath(`${testInfo.project.name}-hero.png`) });
});
