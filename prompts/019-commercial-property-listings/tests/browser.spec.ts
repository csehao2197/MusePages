import { test, expect, type Page, type Locator } from "@playwright/test";
import { localDate } from "../components/listings";

async function filterPanel(page: Page): Promise<Locator> {
  if ((page.viewportSize()?.width || 0) < 760) {
    await page.locator(".mobile-filter").click();
    return page.getByRole("dialog");
  }
  return page.locator(".filter-sidebar");
}
async function apply(page: Page) {
  if ((page.viewportSize()?.width || 0) < 760) await page.getByRole("button", { name: /Apply Filters/ }).click();
}
async function fillIdentity(scope: Locator) {
  await scope.getByLabel("Full name", { exact: true }).fill("Demo Tenant");
  await scope.getByLabel("Company", { exact: true }).fill("Example Studio");
  await scope.getByLabel("Email", { exact: true }).fill("tenant@example.com");
  await scope.getByLabel("Phone", { exact: true }).fill("512-555-0100");
}
test.beforeEach(async ({ page }) => { await page.goto("/"); await expect(page.getByTestId("result-count")).toContainText("12 properties"); });

test("desktop and mobile renders, responsive overflow and local-only assets", async ({ page }, testInfo) => {
  const errors: string[] = [];
  page.on("pageerror", e => errors.push(e.message));
  const external: string[] = [];
  page.on("request", request => { if (!request.url().startsWith("http://127.0.0.1:3119") && !request.url().startsWith("blob:")) external.push(request.url()); });
  await page.reload();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Find the right space.Build what’s next.");
  await expect(page.getByTestId("property-1")).toContainText("$54,167/month base rent");
  await expect(page.getByTestId("property-2")).toContainText("$11,200/month base rent");
  await expect(page.getByTestId("property-3")).toContainText("$150.00/SF");
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: testInfo.outputPath("hero.png") });
  await page.getByTestId("property-1").scrollIntoViewIfNeeded();
  await page.screenshot({ path: testInfo.outputPath("listings.png") });
  await page.locator("#contact").scrollIntoViewIfNeeded();
  await page.screenshot({ path: testInfo.outputPath("contact.png") });
  expect(errors).toEqual([]); expect(external).toEqual([]);
});
test("location autocomplete, combined type transaction quick filters and reset", async ({ page }) => {
  await page.getByLabel("City, ZIP, or neighborhood").fill("Downtown");
  await page.getByLabel("Search property type").selectOption("Office");
  await page.getByLabel("Search transaction").selectOption("Lease");
  await page.getByRole("button", { name: "Search properties", exact: true }).click();
  await expect(page.getByTestId("result-count")).toContainText("1 properties");
  await expect(page.getByTestId("property-1")).toBeVisible();
  await page.getByRole("button", { name: "Move-in Ready", exact: true }).click();
  await expect(page.getByRole("button", { name: "Move-in Ready", exact: true })).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "Clear all filters", exact: true }).click();
  await expect(page.getByTestId("result-count")).toContainText("12 properties");
  await expect(page.getByLabel("City, ZIP, or neighborhood")).toHaveValue("");
});
test("rental price and size ranges, invalid input recovery and sale units", async ({ page }) => {
  const scope = await filterPanel(page);
  await scope.getByLabel("Filter transaction").selectOption("Lease");
  await scope.getByLabel("Min price", { exact: true }).fill("40");
  await scope.getByLabel("Max price", { exact: true }).fill("55");
  await scope.getByLabel("Min size", { exact: true }).fill("3000");
  await scope.getByLabel("Max size", { exact: true }).fill("13000");
  await apply(page);
  await expect(page.getByTestId("result-count")).toContainText("2 properties");
  const bad = await filterPanel(page);
  await bad.getByLabel("Min size", { exact: true }).fill("90000");
  await expect(bad.getByRole("alert")).toContainText("minimum cannot exceed");
  await bad.getByRole("button", { name: "Clear all", exact: true }).click();
  await bad.getByLabel("Filter transaction").selectOption("Sale");
  await bad.getByLabel("Max price", { exact: true }).fill("3000000");
  await apply(page);
  await expect(page.getByTestId("result-count")).toContainText("2 properties");
  await expect(page.getByTestId("property-8")).toContainText("$2,400,000");
});
test("class year amenities certifications and simulated availability combine", async ({ page }) => {
  const scope = await filterPanel(page);
  await scope.getByRole("checkbox", { name: /^Office/ }).check();
  await scope.getByRole("checkbox", { name: /^Class A/ }).check();
  for (const label of ["YEAR BUILT", "AMENITIES", "CERTIFICATIONS · DEMO", "AVAILABILITY · SIMULATED"]) await scope.locator("summary").filter({ hasText: label }).click();
  await scope.getByRole("checkbox", { name: "2000–2009", exact: true }).check();
  await scope.getByRole("checkbox", { name: "Conference Rooms", exact: true }).check();
  await scope.getByRole("checkbox", { name: "ENERGY STAR", exact: true }).check();
  await scope.getByLabel("Availability", { exact: true }).selectOption("0");
  await apply(page);
  await expect(page.getByTestId("result-count")).toContainText("1 properties");
  await expect(page.getByTestId("property-1")).toBeVisible();
});
test("sort, pagination, list view and no-results recovery", async ({ page }) => {
  await page.getByLabel("Sort properties").selectOption("size-asc");
  await expect(page.locator(".property-card").first()).toHaveAttribute("data-testid", "property-11");
  await page.getByLabel("Sort properties").selectOption("size-desc");
  await expect(page.locator(".property-card").first()).toHaveAttribute("data-testid", "property-4");
  await page.getByLabel("Sort properties").selectOption("newest");
  await page.getByRole("button", { name: "Next page", exact: true }).click();
  await expect(page.getByTestId("property-7")).toBeVisible();
  await page.getByRole("button", { name: "Previous page", exact: true }).click();
  await page.getByRole("button", { name: "list view", exact: true }).click();
  await expect(page.getByTestId("property-1")).toHaveClass(/row-card/);
  await page.getByLabel("City, ZIP, or neighborhood").fill("No such market");
  await page.getByRole("button", { name: "Search properties", exact: true }).click();
  await expect(page.getByRole("heading", { name: "No matching properties" })).toBeVisible();
  await page.getByRole("button", { name: "Reset filters", exact: true }).click();
  await expect(page.getByTestId("result-count")).toContainText("12 properties");
});
test("saved properties persist, saved-only view and unsave empty recovery", async ({ page }) => {
  await page.getByRole("button", { name: "Save Frost Tower — Suite 2400", exact: true }).click();
  await page.reload();
  await page.getByRole("button", { name: "Saved properties (1)", exact: true }).click();
  await expect(page.getByTestId("result-count")).toContainText("1 properties");
  await page.getByRole("button", { name: "Unsave Frost Tower — Suite 2400", exact: true }).click();
  await expect(page.getByRole("heading", { name: "No matching properties" })).toBeVisible();
  await page.getByRole("button", { name: "Reset filters", exact: true }).click();
  await expect(page.getByTestId("result-count")).toContainText("12 properties");
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem("vanguard-019-saved") || "[]"))).toEqual([]);
});
test("comparison caps selections, separates units and removes all", async ({ page }) => {
  for (const id of [1, 2, 3]) await page.getByTestId(`property-${id}`).getByRole("checkbox", { name: "Compare", exact: true }).check();
  await page.getByTestId("property-4").getByRole("checkbox", { name: "Compare", exact: true }).click();
  await expect(page.getByTestId("property-4").getByRole("checkbox", { name: "Compare", exact: true })).not.toBeChecked();
  await expect(page.getByRole("status")).toContainText("Compare up to 3");
  await page.getByRole("button", { name: "Compare properties", exact: true }).click();
  const d = page.getByRole("dialog");
  await expect(d).toContainText("$150.00/SF");
  await expect(d).toContainText("$54,167/month base rent");
  for (const name of ["Frost Tower — Suite 2400", "Domain NORTHSIDE — Retail Pad 8", "East Austin Distribution Center"]) await d.getByRole("button", { name: `Remove ${name}`, exact: true }).click();
  await expect(d).toContainText("No properties selected.");
  await page.keyboard.press("Escape");
  await expect(d).not.toBeVisible();
});
test("detail gallery, rent and sale calculators reject zero negative and extreme input", async ({ page }) => {
  await page.getByTestId("property-1").getByRole("button", { name: "Details", exact: true }).click();
  let d = page.getByRole("dialog");
  await expect(d.getByTestId("calculator-output")).toContainText("$54,166.67/month");
  await d.getByRole("button", { name: "Next illustration", exact: true }).click();
  await expect(d).toContainText("2 / 3");
  await d.getByLabel("Area (SF)", { exact: true }).fill("3200");
  await d.getByLabel("Annual rate ($/SF/year)", { exact: true }).fill("42");
  await expect(d.getByTestId("calculator-output")).toContainText("$11,200.00/month");
  await d.getByLabel("Area (SF)", { exact: true }).fill("0");
  await expect(d.getByTestId("calculator-output")).toContainText("positive area");
  await d.getByLabel("Area (SF)", { exact: true }).fill("10000000000");
  await expect(d.getByTestId("calculator-output")).toContainText("demo limits");
  await d.getByLabel("Area (SF)", { exact: true }).fill("3200");
  await d.getByLabel("Annual rate ($/SF/year)", { exact: true }).fill("-2");
  await expect(d.getByTestId("calculator-output")).toContainText("non-negative");
  await page.keyboard.press("Escape");
  await page.getByTestId("property-3").getByRole("button", { name: "Details", exact: true }).click();
  d = page.getByRole("dialog");
  await expect(d.getByTestId("calculator-output")).toContainText("$150.00/SF");
});
test("tour native required email phone and date validation then confirm and reset", async ({ page }) => {
  await page.getByTestId("property-1").getByRole("button", { name: "Tour", exact: true }).click();
  const d = page.getByRole("dialog");
  await d.getByRole("button", { name: "Preview Tour Request" }).click();
  expect(await d.locator("input[name=name]").evaluate((e: HTMLInputElement) => e.validity.valueMissing)).toBe(true);
  await fillIdentity(d);
  await d.getByLabel("Email", { exact: true }).fill("invalid");
  await d.getByLabel("Preferred date").fill(localDate(-1));
  await d.getByLabel("Preferred time").selectOption("11:00 AM");
  await d.getByRole("button", { name: "Preview Tour Request" }).click();
  expect(await d.getByLabel("Email", { exact: true }).evaluate((e: HTMLInputElement) => e.validity.typeMismatch)).toBe(true);
  await d.getByLabel("Email", { exact: true }).fill("tenant@example.com");
  await d.getByRole("button", { name: "Preview Tour Request" }).click();
  expect(await d.getByLabel("Preferred date").evaluate((e: HTMLInputElement) => e.validity.rangeUnderflow)).toBe(true);
  await d.getByLabel("Preferred date").fill(localDate(91));
  expect(await d.getByLabel("Preferred date").evaluate((e: HTMLInputElement) => e.validity.rangeOverflow)).toBe(true);
  await d.getByLabel("Preferred date").fill(localDate(1));
  await d.getByLabel("Phone", { exact: true }).fill("-------");
  await d.getByRole("button", { name: "Preview Tour Request" }).click();
  await expect(d.getByRole("alert")).toContainText("at least 7 digits");
  await d.getByLabel("Phone", { exact: true }).fill("512-555-0100");
  await d.getByRole("button", { name: "Preview Tour Request" }).click();
  await expect(d.getByRole("status")).toContainText("no tour is booked");
  await d.getByRole("button", { name: "Start a new request" }).click();
  await expect(d.getByLabel("Full name", { exact: true })).toHaveValue("");
});
test("requirement multi-select whitespace recovery local confirmation and form reset", async ({ page }) => {
  const f = page.locator("#contact .lead-form");
  await fillIdentity(f);
  await f.getByLabel("Property type", { exact: true }).selectOption("Retail");
  await f.getByLabel("Size needed").selectOption("2,000–5,000 SF");
  await f.getByRole("checkbox", { name: "Downtown", exact: true }).check();
  await f.getByRole("checkbox", { name: "East Austin", exact: true }).check();
  await f.getByLabel("Full name", { exact: true }).fill("   ");
  await f.getByRole("button", { name: "Submit Requirement" }).click();
  await expect(f.getByRole("alert")).toContainText("not only spaces");
  await f.getByLabel("Full name", { exact: true }).fill("Demo Tenant");
  await f.getByRole("button", { name: "Submit Requirement" }).click();
  await expect(page.locator("#contact").getByRole("status")).toContainText("nothing was sent or stored");
  await page.locator("#contact").getByRole("button", { name: "Start a new request" }).click();
  await f.getByLabel("Full name", { exact: true }).fill("Reset me");
  await f.getByRole("button", { name: "Reset form" }).click();
  await expect(f.getByLabel("Full name", { exact: true })).toHaveValue("");
});
test("save search local preview validates and resets without email delivery", async ({ page }) => {
  await page.getByRole("button", { name: "Save search", exact: true }).click();
  const d = page.getByRole("dialog");
  await d.getByRole("button", { name: "Save local search preview" }).click();
  await expect(d.getByLabel("Email for preview only")).toBeVisible();
  await d.getByLabel("Email for preview only").fill("alerts@example.com");
  await d.getByRole("button", { name: "Save local search preview" }).click();
  await expect(d.getByRole("status")).toContainText("No email alert was created");
  await d.getByRole("button", { name: "Reset saved search" }).click();
  await expect(d.getByLabel("Email for preview only")).toHaveValue("");
});
test("map pins detail overlay zoom satellite expand and keyboard area search", async ({ page }) => {
  await page.getByRole("button", { name: "map view", exact: true }).click();
  await page.getByRole("button", { name: /^Map pin: East Austin Distribution Center/ }).click();
  await expect(page.locator(".map-popup")).toContainText("$6,750,000");
  await page.locator(".map-popup").getByRole("button", { name: "View property" }).click();
  await expect(page.getByRole("dialog")).toContainText("45,000 SF");
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: "Close map property" }).click();
  await page.getByRole("button", { name: "Zoom in", exact: true }).click();
  await page.getByRole("button", { name: "Zoom out", exact: true }).click();
  await page.getByRole("button", { name: "Toggle satellite schematic" }).click();
  await expect(page.locator(".map-panel")).toHaveClass(/satellite/);
  await page.getByRole("button", { name: "Expand map", exact: true }).click();
  await expect(page.locator(".map-panel")).toHaveClass(/map-expanded/);
  await page.getByRole("button", { name: "Exit fullscreen map" }).click();
  await page.getByRole("button", { name: "Select East Austin area (keyboard alternative)", exact: true }).click();
  await page.getByRole("button", { name: "Search this area", exact: true }).click();
  await expect(page.getByTestId("result-count")).toContainText("3 properties");
  await page.getByRole("button", { name: "Clear all filters", exact: true }).click();
  await expect(page.getByTestId("result-count")).toContainText("12 properties");
});
test("keyboard modal focus containment return, reduced motion and mobile navigation", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const trigger = page.getByTestId("property-1").getByRole("button", { name: "Details", exact: true });
  await trigger.focus();
  await page.keyboard.press("Enter");
  const d = page.getByRole("dialog");
  await expect(d.getByRole("button", { name: "Close dialog", exact: true })).toBeFocused();
  for (let i = 0; i < 14; i++) {
    await page.keyboard.press("Tab");
    expect(await page.evaluate(() => !!document.activeElement?.closest("dialog"))).toBe(true);
  }
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior)).toBe("auto");
  if ((page.viewportSize()?.width || 0) < 760) {
    await page.getByRole("button", { name: "Toggle navigation" }).click();
    await expect(page.locator(".main-nav")).toBeVisible();
    await page.locator(".main-nav").getByRole("link", { name: "Markets", exact: true }).click();
    await expect(page.locator(".main-nav")).not.toBeVisible();
    await page.locator(".mobile-bottom").getByRole("button", { name: /^Filters/ }).click();
    await expect(d.getByRole("heading", { name: "Property filters" })).toBeVisible();
    await page.keyboard.press("Escape");
    await page.locator(".mobile-bottom").getByRole("button", { name: "Map", exact: true }).click();
    await expect(page.locator(".map-panel")).toBeVisible();
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
});
test("corrupt saves recover, source placeholders explain and report download is qualified", async ({ page }) => {
  await page.evaluate(() => localStorage.setItem("vanguard-019-saved", "{broken"));
  await page.reload();
  await expect(page.getByRole("status")).toContainText("Saved properties could not be loaded");
  await page.getByRole("button", { name: "Save Frost Tower — Suite 2400", exact: true }).click();
  await page.getByRole("button", { name: "Licensing", exact: true }).click();
  await expect(page.getByRole("dialog")).toContainText("not a licensed brokerage");
  await page.keyboard.press("Escape");
  const download = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download demo report" }).click();
  expect((await download).suggestedFilename()).toBe("vanguard-fictional-market-report.txt");
});
test("map cluster and drawn custom rectangle filter real sample coordinates", async ({ page }, testInfo) => {
  await page.getByRole("button", { name: "map view", exact: true }).click();
  await page.getByRole("button", { name: "Cluster: 2 downtown properties. Zoom to expand", exact: true }).click();
  await expect(page.getByRole("button", { name: /^Map pin: Frost Tower/ })).toBeVisible();
  await page.getByRole("button", { name: "Draw custom area", exact: true }).click();
  const canvas = page.getByTestId("map-canvas");
  await canvas.scrollIntoViewIfNeeded();
  const box = await canvas.boundingBox();
  if (!box) throw new Error("Map canvas must be visible");
  await page.mouse.move(box.x + box.width * .55, box.y + box.height * .05);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width * .96, box.y + box.height * .74, { steps: 8 });
  await page.mouse.up();
  await expect(page.locator(".drawn-area")).toBeVisible();
  await page.getByRole("button", { name: "Search this area", exact: true }).click();
  await expect(page.getByTestId("result-count")).toContainText("3 properties");
  await page.locator(".map-panel").scrollIntoViewIfNeeded();
  await page.screenshot({ path: testInfo.outputPath("map.png") });
});
test("price sliders, Green Certified qualification and mobile carousel", async ({ page }) => {
  const scope = await filterPanel(page);
  await scope.getByLabel("Filter transaction").selectOption("Lease");
  await scope.getByLabel("Minimum price slider", { exact: true }).fill("50");
  await scope.getByLabel("Maximum price slider", { exact: true }).fill("60");
  await apply(page);
  await expect(page.getByTestId("result-count")).toContainText("2 properties");
  await page.getByRole("button", { name: /Green Certified/ }).click();
  await expect(page.getByTestId("result-count")).toContainText("2 properties");
  await page.getByTestId("property-1").getByRole("button", { name: "Details", exact: true }).click();
  await expect(page.getByRole("dialog")).toContainText("Not a claim of actual certification");
  await page.keyboard.press("Escape");
  if ((page.viewportSize()?.width || 0) < 760) {
    await page.getByRole("button", { name: "Next illustration for Frost Tower — Suite 2400", exact: true }).click();
    await expect(page.getByTestId("property-1").locator(".cover>img")).toHaveClass("gallery-1");
  }
});
