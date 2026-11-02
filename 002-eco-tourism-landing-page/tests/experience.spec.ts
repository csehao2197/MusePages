import { test, expect } from "@playwright/test";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";

test.beforeEach(async ({ page }) => { await page.goto("/"); });

test("brief preserved; responsive render, sections and local-only assets", async ({ page }, testInfo) => {
  const errors: string[] = [];
  page.on("pageerror", e => errors.push(e.message));
  const external: string[] = [];
  page.on("request", r => { if (!r.url().startsWith("http://127.0.0.1:3102")) external.push(r.url()); });
  await page.reload();
  await expect(page.getByRole("heading", { name: "Travel the World. Leave Only Footprints." })).toBeVisible();
  for (const title of ["Sustainable Adventures Await", "Green Travel, Simplified", "Where You'll Stay", "Your Trip's Carbon Footprint", "Stories from the Trail", "Join 12,000+ Conscious Travelers"]) {
    await expect(page.getByRole("heading", { name: title, exact: true })).toBeAttached();
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
  await expect(page.locator(".trip-card")).toHaveCount(6);
  await expect(page.locator(".stat")).toHaveCount(4);
  await expect(page.locator(".stat").first()).toContainText("12,400+");
  const columns = await page.locator(".trip-grid").evaluate(el => getComputedStyle(el).gridTemplateColumns.split(" ").length);
  expect(columns).toBe(testInfo.project.name === "mobile" ? 1 : 3);
  await page.screenshot({ path: testInfo.outputPath("hero.png"), fullPage: false });
  await page.locator("#trips").scrollIntoViewIfNeeded();
  await page.screenshot({ path: testInfo.outputPath("trips.png"), fullPage: false });
  await page.locator("#calculator").scrollIntoViewIfNeeded();
  await page.screenshot({ path: testInfo.outputPath("calculator.png"), fullPage: false });
  await page.screenshot({ path: testInfo.outputPath("full-page.png"), fullPage: true });
  await page.setViewportSize({ width: 320, height: 800 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
  await page.locator(".calculator-card").scrollIntoViewIfNeeded();
  await page.screenshot({ path: testInfo.outputPath("narrow-calculator.png"), fullPage: false });
  expect(errors).toEqual([]);
  expect(external).toEqual([]);
  expect(createHash("sha256").update(readFileSync(join(process.cwd(), "002-eco-tourism-landing-page.md"))).digest("hex")).toBe("67a517ba2b61d60bdde0a99e5c6d1f38713026ac3d6b2dafbb30e9576f963dc2");
});

test("destination/activity/impact filters, empty recovery and full 24-trip catalog", async ({ page }) => {
  const filters = page.locator(".filters");
  await filters.getByLabel("Destination", { exact: true }).selectOption("Norway");
  await expect(page.locator(".trip-card")).toHaveCount(1);
  await expect(page.locator(".trip-card")).toContainText("Norwegian Fjord Kayaking");
  await filters.getByLabel("Activity", { exact: true }).selectOption("Wildlife");
  await expect(page.getByRole("heading", { name: "No journeys match this combination." })).toBeVisible();
  await page.getByRole("button", { name: "Clear filters", exact: true }).click();
  await filters.getByLabel("Impact type").selectOption("Conservation");
  await expect(page.locator(".trip-card")).toHaveCount(2);
  await filters.getByRole("button", { name: "Reset filters" }).click();
  await page.getByRole("button", { name: "View All 24 Trips" }).click();
  await expect(page.locator(".trip-card")).toHaveCount(24);
  await filters.getByLabel("Destination", { exact: true }).selectOption("Costa Rica");
  await expect(page.locator(".trip-card")).toHaveCount(4);
  await page.getByRole("button", { name: "View Cloud Forest Birding Escape" }).click();
  await expect(page.getByRole("dialog").getByRole("heading", { name: "Cloud Forest Birding Escape", exact: true })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
});

test("carbon calculation arithmetic, 1–8 bounds, invalid routes and stale result clearing", async ({ page }) => {
  const calc = page.locator("#calculator");
  await calc.getByRole("button", { name: "Calculate", exact: true }).click();
  await expect(page.getByTestId("co2")).toHaveText("2,101 kg");
  await expect(page.getByTestId("trees")).toHaveText("96");
  await expect(page.getByTestId("offset-cost")).toHaveText("$42");
  await expect(calc).toContainText("4,202 kg");
  await expect(calc.getByRole("button", { name: "Fewer travelers" })).toBeDisabled();
  for (let i = 1; i < 8; i++) await calc.getByRole("button", { name: "More travelers" }).click();
  await expect(calc.getByRole("button", { name: "More travelers" })).toBeDisabled();
  await expect(page.getByTestId("co2")).toHaveCount(0);
  await calc.getByLabel("Trip destination").selectOption("Norway");
  await calc.getByRole("button", { name: "Calculate", exact: true }).click();
  await expect(page.getByTestId("co2")).toHaveText("3,008 kg");
  await expect(page.getByTestId("trees")).toHaveText("137");
  await expect(page.getByTestId("offset-cost")).toHaveText("$60");
  await calc.getByLabel("Departure city").fill("Atlantis");
  await calc.getByRole("button", { name: "Calculate", exact: true }).click();
  await expect(calc.getByRole("alert")).toContainText("supported departure city");
  await expect(page.getByTestId("co2")).toHaveCount(0);
  await calc.getByLabel("Departure city").fill(" tokyo ");
  await calc.getByRole("button", { name: "Calculate", exact: true }).click();
  await expect(page.getByTestId("co2")).toHaveText("16,256 kg");
});

test("trip details, validation, local inquiry total, focus trap and restoration", async ({ page }) => {
  const trigger = page.getByRole("button", { name: "View Costa Rica Rainforest Retreat" });
  await trigger.click();
  const modal = page.getByRole("dialog");
  await expect(modal.getByRole("heading", { name: "Your journey, at a glance" })).toBeVisible();
  await expect(modal.locator(".itinerary li")).toHaveCount(3);
  await modal.getByRole("button", { name: "Create local inquiry" }).click();
  await expect(modal.getByRole("heading", { name: "Local inquiry created" })).toHaveCount(0);
  await expect(modal.getByLabel("Your name")).toBeFocused();
  await modal.getByLabel("Your name").fill("Demo Traveler");
  await modal.getByLabel("Email address").fill("not-an-email");
  await modal.getByLabel("Preferred departure").fill("2000-01-01");
  await modal.getByRole("button", { name: "Create local inquiry" }).click();
  expect(await modal.getByLabel("Email address").evaluate((el: HTMLInputElement) => el.validity.typeMismatch)).toBeTruthy();
  await modal.getByLabel("Email address").fill("traveler@example.test");
  await modal.getByRole("button", { name: "Create local inquiry" }).click();
  expect(await modal.getByLabel("Preferred departure").evaluate((el: HTMLInputElement) => el.validity.rangeUnderflow)).toBeTruthy();
  await modal.getByLabel("Preferred departure").fill("2027-06-15");
  await modal.getByLabel("Travelers", { exact: true }).selectOption("2");
  await modal.getByRole("button", { name: "Create local inquiry" }).click();
  await expect(modal.getByRole("heading", { name: "Local inquiry created" })).toHaveCount(0);
  await modal.getByRole("checkbox").check();
  await modal.getByRole("button", { name: "Create local inquiry" }).click();
  await expect(modal.getByRole("status")).toContainText("$4,900");
  await expect(modal.getByRole("status")).toContainText("No reservation, payment or email");
  for (let i = 0; i < 6; i++) {
    await page.keyboard.press("Tab");
    expect(await page.evaluate(() => document.querySelector("dialog")?.contains(document.activeElement))).toBeTruthy();
  }
  await page.keyboard.press("Escape");
  await expect(modal).not.toBeVisible();
  await expect(trigger).toBeFocused();
});

test("eco-lodge scrolling and details; stories manual controls and pause", async ({ page }) => {
  await page.getByRole("button", { name: "Show Desert Eco-Dome", exact: true }).click();
  await expect(page.getByRole("button", { name: "Show Desert Eco-Dome", exact: true })).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "Learn about Desert Eco-Dome" }).click();
  await expect(page.getByRole("dialog")).toContainText("No real rooms");
  await page.getByRole("button", { name: "Close dialog" }).click();
  await page.getByRole("button", { name: "Read story by Akira Tanaka" }).click();
  await expect(page.locator(".story-card[aria-hidden=false]")).toContainText("40+ countries");
  await page.getByRole("button", { name: "Next story", exact: true }).click();
  await expect(page.locator(".story-card[aria-hidden=false]")).toContainText("Sarah Mitchell");
  await expect(page.getByRole("button", { name: "Play stories", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Play stories", exact: true }).click();
  await expect(page.getByRole("button", { name: "Pause stories", exact: true })).toBeVisible();
});

test("newsletter email validation, local-only confirmation and privacy explanation", async ({ page }) => {
  await page.getByRole("button", { name: "Subscribe", exact: true }).click();
  await expect(page.getByRole("status").filter({ hasText: "local demo list" })).toHaveCount(0);
  await page.getByLabel("Newsletter email").fill("invalid");
  await page.getByRole("button", { name: "Subscribe", exact: true }).click();
  expect(await page.getByLabel("Newsletter email").evaluate((el: HTMLInputElement) => el.validity.typeMismatch)).toBeTruthy();
  await page.getByLabel("Newsletter email").fill("demo@example.test");
  await page.getByRole("button", { name: "Subscribe", exact: true }).click();
  await expect(page.getByRole("status").filter({ hasText: "local demo list" })).toContainText("No email was sent and no tree was planted");
  await page.getByRole("button", { name: "Privacy", exact: true }).click();
  await expect(page.getByRole("dialog")).toContainText("disappear on reload");
  await page.keyboard.press("Escape");
  await page.reload();
  await expect(page.getByLabel("Newsletter email")).toBeAttached();
});

test("navigation, destination footer links and clear unaudited certification claims", async ({ page }, testInfo) => {
  if (testInfo.project.name === "mobile") {
    await page.getByRole("button", { name: "Toggle navigation" }).click();
    await expect(page.getByRole("navigation", { name: "Main navigation" })).toBeVisible();
  }
  await page.getByRole("navigation", { name: "Main navigation" }).getByRole("link", { name: "Eco-lodges", exact: true }).click();
  await expect(page).toHaveURL(/#lodges$/);
  if (testInfo.project.name === "mobile") {
    await expect(page.locator(".mobile-bottom")).toBeVisible();
    await expect(page.getByRole("button", { name: "Toggle navigation" })).toHaveAttribute("aria-expanded", "false");
  }
  await page.locator("footer").getByRole("link", { name: "Kenya", exact: true }).click();
  await expect(page.locator(".trip-card")).toHaveCount(1);
  await expect(page.locator(".trip-card")).toContainText("Kenyan Safari");
  await page.getByRole("button", { name: "Learn about our sustainability standards" }).click();
  await expect(page.getByRole("dialog")).toContainText("not verified certifications or partnerships");
});

test("keyboard skip link and reduced-motion presentation", async ({ page }) => {
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Skip to content" })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#main$/);
  expect(await page.locator(".floating-leaf").first().evaluate(el => getComputedStyle(el).display)).toBe("none");
  await expect(page.getByRole("button", { name: "Play stories", exact: true })).toBeAttached();
});

test("normal-motion stories rotate every six seconds and can be paused", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.clock.install();
  await page.reload();
  await expect(page.locator(".story-card[aria-hidden=false]")).toContainText("Emma & Jake");
  await page.clock.runFor(6100);
  await expect(page.locator(".story-card[aria-hidden=false]")).toContainText("Akira Tanaka");
  await page.getByRole("button", { name: "Pause stories", exact: true }).click();
  await page.clock.runFor(12000);
  await expect(page.locator(".story-card[aria-hidden=false]")).toContainText("Akira Tanaka");
});
