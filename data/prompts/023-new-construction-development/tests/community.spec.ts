import { test, expect, type Page } from "@playwright/test";

const isMobile = (page: Page) => (page.viewportSize()?.width ?? 1440) < 760;
async function openFilters(page: Page) {
  if (isMobile(page)) await page.getByRole("button", { name: "Refine floor plans" }).click();
}
async function fillContact(page: Page) {
  await page.getByLabel("First name", { exact: true }).fill("Alex");
  await page.getByLabel("Last name", { exact: true }).fill("River");
  await page.getByLabel("Email", { exact: true }).fill("alex@example.test");
  await page.getByLabel("Phone", { exact: true }).fill("919-555-0101");
}
function nextDate(day?: number) {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  while (day === undefined ? [2, 3].includes(date.getDay()) : date.getDay() !== day) date.setDate(date.getDate() + 1);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
async function lot47(page: Page) {
  if (isMobile(page)) await page.getByRole("article").filter({ has: page.getByRole("heading", { name: "Lot 47", exact: true }) }).getByRole("button", { name: "View homesite" }).click();
  else await page.getByRole("button", { name: "Lot 47, Available, Phase 2", exact: true }).click();
}
test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("#main")).toHaveAttribute("data-ready", "true");
});

test("floor-plan discovery, intersections, range and empty recovery", async ({ page }) => {
  await openFilters(page);
  await page.getByLabel("Bedrooms", { exact: true }).selectOption("4");
  await expect(page.locator(".plan-card")).toHaveCount(2);
  await page.getByLabel("Maximum base price").selectOption("500000");
  await expect(page.locator(".plan-card")).toHaveCount(1);
  await expect(page.locator(".plan-card h3")).toHaveText("The Ashford");
  await page.getByLabel("Stories", { exact: true }).selectOption("1");
  await expect(page.getByRole("heading", { name: "No plans match this combination." })).toBeVisible();
  await page.getByRole("button", { name: "Show all floor plans" }).click();
  await expect(page.locator(".plan-card")).toHaveCount(4);
  const slider = page.getByLabel(/Maximum area/);
  await slider.fill("1800");
  await expect(page.locator(".plan-card")).toHaveCount(0);
  await page.getByRole("button", { name: "Reset filters", exact: true }).click();
  await expect(page.locator(".plan-card")).toHaveCount(4);
});

test("plan levels, dimensions, modal keyboard containment and focus return", async ({ page }) => {
  const card = page.locator(".plan-card").filter({ has: page.getByRole("heading", { name: "The Ashford", exact: true }) });
  const trigger = card.getByRole("button", { name: "View Floor Plan" });
  await trigger.click();
  const dialog = page.getByRole("dialog");
  await expect(dialog.getByRole("heading", { name: "The Ashford", exact: true })).toBeVisible();
  await expect(dialog.getByText("342 sq ft", { exact: true })).toBeVisible();
  await dialog.getByRole("button", { name: "Level 2", exact: true }).click();
  await expect(dialog.getByText("272 sq ft", { exact: true })).toBeVisible();
  await expect(dialog.getByRole("img", { name: "The Ashford level 2 schematic floor plan" })).toBeVisible();
  await dialog.getByRole("button", { name: "Close dialog" }).focus();
  await page.keyboard.press("Shift+Tab");
  await expect(dialog.getByRole("button", { name: "Request Pricing", exact: true })).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(dialog.getByRole("button", { name: "Close dialog" })).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(trigger).toBeFocused();
  await trigger.click();
  await page.getByRole("dialog").getByRole("button", { name: "Request Pricing", exact: true }).click();
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await expect(page.getByText("The Ashford pricing", { exact: true })).toBeVisible();
  await expect(page.getByLabel("First name", { exact: true })).toBeFocused();
  await expect(page.getByRole("checkbox", { name: "The Ashford", exact: true })).toBeChecked();
  await expect(page.getByRole("radio", { name: "Get Pricing Info" })).toBeChecked();
});

test("all 86 sites, status filtering, plan compatibility and phase empty recovery", async ({ page }) => {
  await expect(page.locator(".svg-lot")).toHaveCount(86);
  await expect(page.locator('.svg-lot[aria-label*=", Available,"]')).toHaveCount(14);
  await expect(page.locator('.svg-lot[aria-label*=", Under contract,"]')).toHaveCount(23);
  await expect(page.locator('.svg-lot[aria-label*=", Sold,"]')).toHaveCount(46);
  await expect(page.locator('.svg-lot[aria-label*=", Model home,"]')).toHaveCount(3);
  if (!isMobile(page)) {
    await page.getByRole("button", { name: "Zoom in site plan" }).click();
    await expect(page.locator(".zoom-controls")).toContainText("125%");
    await page.getByRole("button", { name: "Zoom out site plan" }).click();
    await page.getByRole("button", { name: "Lot list", exact: true }).click();
  }
  await page.getByLabel("Lot status", { exact: true }).selectOption("Available");
  await page.getByLabel("Compatible plan", { exact: true }).selectOption("crestview");
  await expect(page.locator("#availability").getByRole("status")).toContainText("8 of 86");
  await expect(page.locator(".lot-card")).toHaveCount(8);
  await page.getByLabel("Phase", { exact: true }).selectOption("1");
  await expect(page.getByRole("heading", { name: "No homesites in this selection." })).toBeVisible();
  await page.getByRole("button", { name: "Show all homesites" }).click();
  await expect(page.locator("#availability").getByRole("status")).toContainText("86 of 86");
  await page.getByLabel("Phase", { exact: true }).selectOption("3");
  await expect(page.locator("#availability").getByRole("status")).toContainText("0 of 86");
  await page.getByRole("button", { name: "Reset homesites", exact: true }).click();
});

test("lot detail, acre conversion, options arithmetic and contextual inquiry", async ({ page }) => {
  await lot47(page);
  const dialog = page.getByRole("dialog");
  await expect(dialog).toContainText("0.37");
  await expect(dialog).toContainText("16,117 sq ft lot");
  await expect(dialog.getByTestId("lot-total")).toHaveText("$437,000");
  await dialog.getByLabel("Compatible floor plan").selectOption("crestview");
  await dialog.getByRole("checkbox", { name: /Premium interior/ }).check();
  await dialog.getByRole("checkbox", { name: /Screened porch/ }).check();
  await expect(dialog.getByTestId("lot-total")).toHaveText("$694,000");
  await dialog.getByRole("checkbox", { name: /Premium interior/ }).uncheck();
  await expect(dialog.getByTestId("lot-total")).toHaveText("$669,000");
  await dialog.getByRole("button", { name: "Request Info on This Lot" }).click();
  await expect(page.locator(".context-line")).toContainText("Lot 47");
  await expect(page.getByRole("checkbox", { name: "The Crestview", exact: true })).toBeChecked();
  await expect(page.getByRole("radio", { name: "Get Pricing Info" })).toBeChecked();
  await page.getByRole("button", { name: "Clear context" }).click();
  await expect(page.locator(".context-line")).toContainText("General community inquiry");
});

test("check availability carries selected plan into actual filtered list", async ({ page }) => {
  const card = page.locator(".plan-card").filter({ has: page.getByRole("heading", { name: "The Crestview", exact: true }) });
  await card.getByRole("button", { name: "Check Availability" }).click();
  await expect(page.getByRole("dialog")).toContainText("8 fictional available");
  await page.keyboard.press("Escape");
  await expect(page.getByLabel("Compatible plan", { exact: true })).toHaveValue("crestview");
  await expect(page.locator(".lot-card")).toHaveCount(8);
  await expect(page.locator(".lot-card").first()).toContainText("Lot 47");
});

test("gallery lightbox, tour rooms, context, and original asset notices", async ({ page }) => {
  const trigger = page.getByRole("button", { name: "Expand Kitchen image", exact: true });
  await trigger.click();
  const dialog = page.getByRole("dialog");
  await expect(dialog.getByRole("heading", { name: "Kitchen", exact: true })).toBeVisible();
  await dialog.getByRole("button", { name: "Next gallery image" }).click();
  await expect(dialog.getByRole("heading", { name: "Primary bath", exact: true })).toBeVisible();
  await dialog.getByRole("button", { name: "Previous gallery image" }).click();
  await expect(dialog).toContainText("1 / 6");
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();
  const model = page.locator(".model-card").filter({ has: page.getByRole("heading", { name: "The Crestview", exact: true }) });
  await model.getByRole("button", { name: "Take Virtual Tour" }).click();
  await dialog.getByRole("button", { name: "Kitchen", exact: true }).click();
  await expect(dialog.getByRole("img")).toHaveAccessibleName(/Original kitchen/);
  await expect(dialog).toContainText("substitute for a 360° tour");
  await dialog.getByRole("button", { name: "Schedule In-Person Tour" }).click();
  await expect(page.locator(".context-line")).toContainText("The Crestview model home tour");
  await expect(page.getByRole("radio", { name: "Schedule a Tour", exact: true })).toBeChecked();
});

test("brochure download, specifications and timeline recovery", async ({ page }) => {
  await page.getByRole("button", { name: "Download Community Brochure" }).click();
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("link", { name: "Download local brochure" }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe("ridgeline-concept-brochure.html");
  expect(await download.failure()).toBeNull();
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: "Request Full Specifications Sheet" }).click();
  await expect(page.getByRole("dialog")).toContainText("certification and performance are unverified");
  await page.getByRole("dialog").getByRole("button", { name: "Preview a specifications inquiry" }).click();
  await expect(page.locator(".context-line")).toContainText("Full specifications and upgrades");
  await page.getByRole("button", { name: "Phase 3", exact: true }).click();
  await expect(page.locator(".timeline-panel")).toContainText("No lots are released here");
  await page.getByRole("button", { name: "Your build", exact: true }).click();
  await expect(page.locator(".timeline-panel")).toContainText("inspections");
  await page.getByRole("button", { name: "Phase 2", exact: true }).click();
  await expect(page.locator(".timeline-panel")).toContainText("48 schematic homesites");
});

test("financing arithmetic, zero rate, bounds, reset and no prequal offer", async ({ page }) => {
  await page.getByLabel("Home price ($)").fill("498000");
  await page.getByLabel("Down payment (%)").fill("20");
  await page.getByLabel("Annual interest (%)").fill("6.5");
  await page.getByRole("button", { name: "Calculate illustration" }).click();
  await expect(page.locator(".calc-result strong")).toHaveText("$2,518 / month");
  await page.getByLabel("Annual interest (%)").fill("0");
  await page.getByRole("button", { name: "Calculate illustration" }).click();
  await expect(page.locator(".calc-result strong")).toHaveText("$1,107 / month");
  await page.getByLabel("Down payment (%)").fill("100");
  await page.getByRole("button", { name: "Calculate illustration" }).click();
  await expect(page.locator(".calc-result strong")).toHaveText("$0 / month");
  await page.getByLabel("Down payment (%)").fill("101");
  await page.getByRole("button", { name: "Calculate illustration" }).click();
  expect(await page.getByLabel("Down payment (%)").evaluate((el: HTMLInputElement) => el.validity.rangeOverflow)).toBe(true);
  await expect(page.locator(".calc-result")).toHaveCount(0);
  await page.getByRole("button", { name: "Reset calculator", exact: true }).click();
  await expect(page.getByLabel("Annual interest (%)")).toHaveValue("6.5");
  await page.getByRole("button", { name: "Learn about pre-qualification" }).click();
  await expect(page.getByRole("dialog")).toContainText("No lender, credit check or account is connected");
});

test("tour native validation, closed dates, preview edit, error retry, confirm and reset", async ({ page }) => {
  await page.getByRole("button", { name: "Preview My Tour Request" }).click();
  await expect(page.getByLabel("First name", { exact: true })).toBeFocused();
  await fillContact(page);
  await page.getByLabel("Email", { exact: true }).fill("not-email");
  await page.getByLabel("Preferred tour date", { exact: false }).fill(nextDate());
  await page.getByRole("button", { name: "Preview My Tour Request" }).click();
  expect(await page.getByLabel("Email", { exact: true }).evaluate((el: HTMLInputElement) => el.validity.typeMismatch)).toBe(true);
  await page.getByLabel("Email", { exact: true }).fill("alex@example.test");
  await page.getByRole("button", { name: "Preview My Tour Request" }).click();
  await expect(page.locator(".form-error")).toContainText("Choose at least one floor plan");
  await page.getByRole("checkbox", { name: "The Oakmont", exact: true }).check();
  await page.getByLabel("Preferred tour date", { exact: false }).fill("2020-01-01");
  await page.getByRole("button", { name: "Preview My Tour Request" }).click();
  expect(await page.getByLabel("Preferred tour date", { exact: false }).evaluate((el: HTMLInputElement) => el.validity.rangeUnderflow)).toBe(true);
  await page.getByLabel("Preferred tour date", { exact: false }).fill(nextDate(2));
  await page.getByRole("button", { name: "Preview My Tour Request" }).click();
  await expect(page.locator(".form-error")).toContainText("closed Tuesday and Wednesday");
  await page.getByLabel("Preferred tour date", { exact: false }).fill(nextDate());
  await page.getByRole("button", { name: "Preview My Tour Request" }).click();
  await expect(page.getByRole("heading", { name: "Your local request preview" })).toBeVisible();
  await expect(page.getByLabel("Review local request")).toBeFocused();
  await page.getByRole("button", { name: "Edit request" }).click();
  await expect(page.getByLabel("First name", { exact: true })).toHaveValue("Alex");
  await page.getByRole("button", { name: "Preview My Tour Request" }).click();
  await page.getByRole("button", { name: "Simulate preview error" }).click();
  await expect(page.locator(".form-error")).toContainText("Nothing was sent");
  await page.getByRole("button", { name: "Confirm local preview" }).click();
  await expect(page.getByRole("heading", { name: "Preview confirmed. Your next chapter can wait." })).toBeVisible();
  await expect(page.getByLabel("Request confirmed locally")).toBeFocused();
  await page.getByRole("button", { name: "Start a new request" }).click();
  await expect(page.getByLabel("First name", { exact: true })).toHaveValue("");
  await expect(page.getByRole("checkbox", { name: "The Oakmont", exact: true })).not.toBeChecked();
});

test("pricing journey without date, native name/phone validation and reload privacy", async ({ page }) => {
  await fillContact(page);
  await page.getByRole("radio", { name: "Get Pricing Info" }).check();
  await expect(page.locator('input[type="date"]')).toHaveCount(0);
  await page.getByRole("checkbox", { name: "The Belmont", exact: true }).check();
  await page.getByLabel("First name", { exact: true }).fill("   ");
  await page.getByRole("button", { name: "Preview My Inquiry" }).click();
  expect(await page.getByLabel("First name", { exact: true }).evaluate((el: HTMLInputElement) => el.validity.patternMismatch)).toBe(true);
  await page.getByLabel("First name", { exact: true }).fill("Alex");
  await page.getByLabel("Phone", { exact: true }).fill("letters");
  await page.getByRole("button", { name: "Preview My Inquiry" }).click();
  expect(await page.getByLabel("Phone", { exact: true }).evaluate((el: HTMLInputElement) => el.validity.patternMismatch)).toBe(true);
  await page.getByLabel("Phone", { exact: true }).fill("(919) 555-0101");
  await page.getByRole("button", { name: "Preview My Inquiry" }).click();
  await expect(page.locator(".request-review")).toContainText("Get Pricing Info");
  await page.getByRole("button", { name: "Confirm local preview" }).click();
  await page.reload();
  await expect(page.getByLabel("First name", { exact: true })).toHaveValue("");
  expect(await page.evaluate(() => localStorage.length + sessionStorage.length)).toBe(0);
});

test("responsive navigation, feature tabs, footer accordions and no page overflow", async ({ page }) => {
  if (isMobile(page)) {
    const menu = page.getByRole("button", { name: "Open navigation" });
    await menu.click();
    await expect(page.getByRole("navigation", { name: "Main navigation" })).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(menu).toBeFocused();
    await menu.click();
    await page.getByRole("navigation").getByRole("link", { name: "Floor Plans", exact: true }).click();
    await expect(page.getByRole("navigation")).not.toBeVisible();
    await page.locator(".feature-tabs").getByRole("button", { name: "Premium", exact: true }).click();
    await expect(page.getByRole("heading", { name: "Premium upgrade package" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "What’s included — standard" })).not.toBeVisible();
    await page.locator(".feature-tabs").getByRole("button", { name: "Standard", exact: true }).click();
    await page.locator(".mobile-tour").getByRole("button", { name: "Schedule a Tour", exact: true }).click();
    await expect(page.getByLabel("First name", { exact: true })).toBeFocused();
  } else await expect(page.getByRole("heading", { name: "Premium upgrade package" })).toBeVisible();
  const footerGroup = page.locator(".footer-links details").filter({ has: page.locator("summary").filter({ hasText: "Buying" }) });
  await footerGroup.locator("summary").click();
  await expect(footerGroup.getByRole("button", { name: "FAQ", exact: true })).not.toBeVisible();
  await footerGroup.locator("summary").click();
  await footerGroup.getByRole("button", { name: "FAQ", exact: true }).click();
  await expect(page.getByRole("dialog")).toContainText("Is this a real community? No");
  await page.keyboard.press("Escape");
  await page.evaluate(() => scrollTo(0, 0));
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test("reduced motion, no external services, no runtime errors and render evidence", async ({ page }, testInfo) => {
  const errors: string[] = [];
  const external: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  page.on("request", request => { if (!request.url().startsWith("http://127.0.0.1:3123") && !request.url().startsWith("data:")) external.push(request.url()); });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.reload();
  await expect(page.locator("#main")).toHaveAttribute("data-ready", "true");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  expect(await page.locator(".pulse").evaluate(el => getComputedStyle(el).animationName)).toBe("none");
  await page.screenshot({ path: testInfo.outputPath("home-viewport.png"), scale: "css" });
  await page.screenshot({ path: testInfo.outputPath("home.png"), fullPage: true, scale: "css" });
  await page.locator("#plans").evaluate(el => scrollTo(0, el.getBoundingClientRect().top + scrollY - 100));
  await page.screenshot({ path: testInfo.outputPath("plans.png"), scale: "css" });
  await lot47(page);
  await page.screenshot({ path: testInfo.outputPath("homesite.png"), scale: "css" });
  await page.keyboard.press("Escape");
  expect(errors).toEqual([]);
  expect(external).toEqual([]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  if (isMobile(page)) {
    await page.setViewportSize({ width: 320, height: 740 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
});
