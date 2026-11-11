import { test, expect, type Page } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import path from "node:path";

test.beforeEach(async ({ page }) => { await page.goto("/"); await expect(page.getByRole("heading", { name: "The Meridian Penthouse" })).toBeVisible(); });

async function contact(page: Page) {
  await page.locator("#full-name").fill("Demo Visitor");
  await page.getByLabel("Email", { exact: true }).fill("demo@example.com");
  await page.getByLabel("Phone", { exact: true }).fill("+1 (555) 123-4567");
}
async function viewing(page: Page) {
  await contact(page);
  const date = new Date(); date.setDate(date.getDate()+2);
  const dateString = `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,"0")}-${String(date.getDate()).padStart(2,"0")}`;
  await page.getByLabel("Preferred date").fill(dateString);
  await page.getByLabel("Preferred time").selectOption("14:00");
}

test("editorial render, fictional qualifications, mobile navigation and no overflow", async ({ page }, testInfo) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.reload();
  await expect(page.locator(".hero-price")).toContainText("$4,200,000");
  await expect(page.locator(".demo-note")).toContainText("fictional");
  if (testInfo.project.name === "mobile") {
    await page.getByRole("button", { name: "Open navigation" }).click();
    await page.getByRole("link", { name: "The neighborhood", exact: true }).click();
    await expect(page.getByRole("button", { name: "Open navigation" })).toHaveAttribute("aria-expanded","false");
    await page.locator(".mobile-stats summary").click();
    await expect(page.locator(".mobile-stats p")).toBeVisible();
    await expect(page.locator(".mobile-viewing")).toBeVisible();
    await page.locator(".feature summary").first().click();
    await expect(page.locator(".feature").first()).not.toHaveAttribute("open","");
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
  expect(await page.locator(".hero-art").evaluate(element => getComputedStyle(element).animationName)).toBe("none");
  await page.evaluate(() => window.scrollTo(0,0));
  await mkdir(path.join(testInfo.config.rootDir,"artifacts"), { recursive: true });
  await page.screenshot({ path: path.join(testInfo.config.rootDir,"artifacts",`${testInfo.project.name}-hero.png`) });
  await page.screenshot({ path: path.join(testInfo.config.rootDir,"artifacts",`${testInfo.project.name}-full.png`), fullPage: true });
  expect(errors).toEqual([]);
});

test("discovery combines search, neighborhood, beds and price then recovers empty state", async ({ page }) => {
  await page.getByLabel("Find a residence").fill("Harbor");
  await page.getByRole("combobox", { name: /^Neighborhood/ }).selectOption("Harbor");
  await page.getByRole("combobox", { name: /^Bedrooms/ }).selectOption("4");
  await expect(page.locator(".home-card")).toHaveCount(1);
  await expect(page.locator(".home-card")).toContainText("$4,500,000");
  await page.getByLabel("Maximum price (USD)").selectOption("4000000");
  await expect(page.getByRole("heading", { name: "No residences match your selection." })).toBeVisible();
  await page.getByRole("button", { name: "Reset discovery" }).click();
  await expect(page.locator(".home-card")).toHaveCount(4);
  await page.getByLabel("Sort listings").selectOption("low");
  await expect(page.locator(".home-card").first()).toContainText("The Apex, Unit 38A");
  await page.getByLabel("Sort listings").selectOption("high");
  await expect(page.locator(".home-card").first()).toContainText("Harborview Tower, PH2");
  await page.getByLabel("Sort listings").selectOption("area");
  await expect(page.locator(".home-card").first()).toContainText("4,100 sq ft");
});

test("saved residences persist locally, detail dialog traps focus and restores opener", async ({ page }) => {
  await page.getByRole("button", { name: "Save The Apex, Unit 38A", exact: true }).click();
  await page.reload();
  await page.getByRole("button", { name: "Saved homes (1)", exact: true }).click();
  await expect(page.locator(".home-card")).toHaveCount(1);
  const trigger = page.getByRole("button", { name: "View details for The Apex, Unit 38A", exact: true });
  await trigger.click();
  const modal = page.getByRole("dialog");
  await expect(modal).toContainText("3 bedrooms · 3 bathrooms · 3,200 sq ft");
  for (let i = 0; i < 9; i++) {
    await page.keyboard.press("Tab");
    expect(await page.evaluate(() => document.querySelector("dialog")?.contains(document.activeElement))).toBeTruthy();
  }
  await page.keyboard.press("Escape");
  await expect(modal).not.toBeVisible();
  await expect(trigger).toBeFocused();
  await page.getByRole("button", { name: "Unsave The Apex, Unit 38A", exact: true }).click();
  await expect(page.locator(".empty-state")).toBeVisible();
  await page.getByRole("button", { name: "Reset discovery" }).click();
  await expect(page.locator(".home-card")).toHaveCount(4);
});

test("gallery has sixteen scenes, wraparound arrows, keyboard and focus return", async ({ page }) => {
  await expect(page.locator(".gallery-item")).toHaveCount(16);
  const trigger = page.getByRole("button", { name: "Open gallery: Living room · west view", exact: true });
  await trigger.click();
  const modal = page.getByRole("dialog");
  await expect(modal).toContainText("1 of 16");
  await page.getByRole("button", { name: "Previous photo" }).click();
  await expect(modal).toContainText("16 of 16");
  await page.keyboard.press("ArrowRight");
  await expect(modal).toContainText("1 of 16");
  await page.getByRole("button", { name: "Next photo" }).click();
  await expect(modal).toContainText("2 of 16");
  await page.keyboard.press("ArrowRight");
  await expect(modal).toContainText("3 of 16");
  await page.getByRole("button", { name: "Close dialog" }).click();
  await expect(trigger).toBeFocused();
});

test("schematic rooms, bounded zoom, download PDF and neighborhood interaction", async ({ page, request }) => {
  await page.getByRole("button", { name: "Living Room 24′ × 30′" }).click();
  await expect(page.locator(".plan-summary")).toContainText("24′ × 30′ · dimensions in feet");
  await page.getByRole("button", { name: "Zoom floor plan in" }).click();
  await expect(page.locator(".plan-controls")).toContainText("125%");
  for (let i=0;i<3;i++) await page.getByRole("button", { name: "Zoom floor plan in" }).click();
  await expect(page.getByRole("button", { name: "Zoom floor plan in" })).toBeDisabled();
  await page.getByRole("button", { name: "Reset zoom" }).click();
  await expect(page.getByRole("button", { name: "Zoom floor plan out" })).toBeDisabled();
  const response = await request.get("/floor-plan");
  expect(response.headers()["content-type"]).toBe("application/pdf");
  expect((await response.body()).toString()).toContain("%PDF-1.4");
  expect((await response.body()).toString()).toContain("Guest Bedroom 3 12 x 12 ft");
  await page.getByRole("button", { name: "Explore Harbor Walk" }).click();
  await expect(page.locator(".map-description")).toContainText("Harbor Walk · 3 min walk");
  await page.getByRole("button", { name: "Explore Central Park" }).click();
  await expect(page.locator(".map-description")).toContainText("not a real address");
});

test("amenities scroll and local tour switches rooms inside expanded preview", async ({ page }) => {
  await page.getByRole("button", { name: "Next amenities" }).click();
  expect(await page.locator("#amenity-strip").evaluate(element => element.scrollLeft)).toBeGreaterThan(0);
  await page.getByRole("button", { name: "Previous amenities" }).click();
  await page.locator(".tour-preview").getByRole("button", { name: "Kitchen", exact: true }).click();
  await expect(page.locator(".tour-preview svg.scene")).toHaveAttribute("aria-label", /Kitchen & dining/);
  const trigger = page.getByRole("button", { name: "Open immersive virtual tour" });
  await trigger.click();
  await page.getByRole("dialog").getByRole("button", { name: "Primary suite", exact: true }).click();
  await expect(page.getByRole("dialog").locator("svg.scene")).toHaveAttribute("aria-label", /Primary suite/);
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();
});

test("mortgage uses correct USD amortization, zero rate and native bounds", async ({ page }) => {
  await page.getByRole("button", { name: "Calculate estimate" }).click();
  await expect(page.locator(".payment")).toContainText("$21,793");
  await expect(page.getByLabel("Down payment (%)").locator("..")).toContainText("$840,000");
  await page.getByLabel("Purchase price (USD)").fill("120000");
  await page.getByLabel("Down payment (%)").fill("0");
  await page.getByLabel("Annual interest (%)").fill("0");
  await page.getByLabel("Loan term (years)").fill("10");
  await page.getByRole("button", { name: "Calculate estimate" }).click();
  await expect(page.locator(".payment")).toContainText("$1,000");
  await page.getByLabel("Down payment (%)").fill("100");
  await page.getByRole("button", { name: "Calculate estimate" }).click();
  await expect(page.locator(".payment")).toContainText("$0");
  await page.getByLabel("Down payment (%)").fill("101");
  expect(await page.getByLabel("Down payment (%)").evaluate((element: HTMLInputElement) => element.checkValidity())).toBeFalsy();
  await page.getByRole("button", { name: "Calculate estimate" }).click();
  await expect(page.locator(".payment")).toContainText("$0");
  await page.getByRole("button", { name: "Get pre-approved — demo information" }).click();
  await expect(page.getByRole("dialog")).toContainText("cannot pre-approve");
  await page.keyboard.press("Escape");
});

test("native contact and past-date validation; unavailable viewing retries, confirms and resets", async ({ page }) => {
  await page.locator(".viewing-section").scrollIntoViewIfNeeded();
  await page.getByRole("button", { name: "Request private viewing", exact: true }).click();
  expect(await page.locator("#full-name").evaluate((element: HTMLInputElement) => element.validity.valueMissing)).toBeTruthy();
  await viewing(page);
  await page.getByLabel("Email", { exact: true }).fill("not-email");
  expect(await page.getByLabel("Email", { exact: true }).evaluate((element: HTMLInputElement) => element.validity.typeMismatch)).toBeTruthy();
  await page.getByLabel("Email", { exact: true }).fill("demo@example.com");
  await page.getByLabel("Preferred date").fill("2020-01-01");
  expect(await page.getByLabel("Preferred date").evaluate((element: HTMLInputElement) => element.validity.rangeUnderflow)).toBeTruthy();
  await viewing(page);
  await page.getByLabel("Phone", { exact: true }).fill("(((((((");
  await page.getByRole("button", { name: "Request private viewing", exact: true }).click();
  await expect(page.locator(".form-error[role=alert]")).toContainText("at least 7 digits");
  await page.getByLabel("Phone", { exact: true }).fill("+1 (555) 123-4567");
  await page.getByLabel("Preferred time").selectOption("18:00");
  await page.getByRole("button", { name: "Request private viewing", exact: true }).click();
  await expect(page.locator(".form-error[role=alert]")).toContainText("unavailable");
  await page.getByLabel("Preferred time").selectOption("14:00");
  await page.getByRole("button", { name: "Request private viewing", exact: true }).click();
  await expect(page.locator("#confirmation")).toContainText("The Meridian, PH42");
  await expect(page.locator("#confirmation")).toContainText("Nothing was sent, booked or saved");
  await expect(page.locator("#confirmation")).toBeFocused();
  await page.getByRole("button", { name: "Create another preview" }).click();
  await expect(page.locator("#full-name")).toHaveValue("");
  await expect(page.locator("#full-name")).toBeFocused();
  await page.locator("#full-name").fill("New Demo");
  await page.getByRole("button", { name: "Reset form", exact: true }).click();
  await expect(page.locator("#full-name")).toHaveValue("");
});

test("inquiry is local, selected comparable viewing retains property context", async ({ page }) => {
  await page.getByRole("button", { name: "Contact agent", exact: true }).click();
  await expect(page.getByLabel("Preferred date")).toHaveCount(0);
  await contact(page);
  await page.getByRole("button", { name: "Preview inquiry", exact: true }).click();
  await expect(page.locator("#confirmation")).toContainText("inquiry preview");
  await page.getByRole("button", { name: "View details for Harborview Tower, PH2", exact: true }).click();
  await page.getByRole("button", { name: "Preview a viewing", exact: true }).click();
  await viewing(page);
  await page.getByRole("button", { name: "Request private viewing", exact: true }).click();
  await expect(page.locator("#confirmation")).toContainText("Harborview Tower, PH2");
});

test("footer policy and social previews have no external connections", async ({ page }) => {
  const external: string[] = [];
  page.on("request", request => { if (!request.url().startsWith("http://127.0.0.1:3121")) external.push(request.url()); });
  await page.reload();
  await page.getByRole("button", { name: "Privacy policy", exact: true }).click();
  await expect(page.getByRole("dialog")).toContainText("no tracking");
  await page.getByRole("button", { name: "Understood", exact: true }).click();
  await page.getByRole("button", { name: "Instagram", exact: true }).click();
  await expect(page.getByRole("dialog")).toContainText("No real Instagram account");
  await page.keyboard.press("Escape");
  await expect(page.getByRole("button", { name: "Instagram", exact: true })).toBeFocused();
  expect(external).toEqual([]);
});
