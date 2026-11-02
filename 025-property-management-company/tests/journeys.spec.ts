import { test, expect } from "@playwright/test";
import { estimate } from "../app/data";

test.beforeEach(async ({ page }) => { await page.goto("/"); });

test("owner/resident paths, expandable services and FAQ", async ({ page }) => {
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Your property.Our priority.");
  await page.getByRole("link", { name: "Explore Management Services" }).click();
  await page.locator(".service").first().getByText("Learn more").click();
  await expect(page.locator(".service").first()).toContainText("No applications");
  await page.locator(".hero-buttons").getByRole("link", { name: "Browse Available Rentals" }).click();
  await expect(page.getByLabel("Available only")).toBeChecked();
  await expect(page.locator(".rental-card")).toHaveCount(3);
  await page.getByText("Can I still be involved in decisions?", { exact: true }).click();
  await expect(page.locator(".faq-list details[open]")).toContainText("$300");
});

test("plan comparison and coherent calculator math, boundaries and recovery", async ({ page }) => {
  const example = estimate(1, 1800, 10, .08);
  expect(example.fee).toBeCloseTo(1641.6, 2);
  expect(example.benefit).toBeCloseTo(-561.6, 2);
  await expect(page.getByTestId("baseline")).toHaveText("$19,440");
  await expect(page.getByTestId("managed")).toHaveText("$20,520");
  await expect(page.getByTestId("fee")).toHaveText("−$1,642");
  await expect(page.getByTestId("benefit")).toHaveText("−$562");
  await page.locator(".price-card").filter({ has: page.getByRole("heading", { name: "Single Property", exact: true }) }).getByRole("button", { name: "Compare this plan" }).click();
  await expect(page.locator(".comparison")).toContainText("$180 management / month + $900");
  await expect(page.getByLabel("Management plan", { exact: true })).toHaveValue("Single Property");
  await expect(page.getByTestId("fee")).toHaveText("−$2,052");
  await page.getByLabel("Number of units").fill("2");
  await page.getByLabel("Current vacancy rate").fill("0");
  await expect(page.getByTestId("managed")).toHaveText("$43,200");
  await expect(page.getByTestId("benefit")).toHaveText("−$4,320");
  await page.getByLabel("Number of units").fill("51");
  await expect(page.locator("#calculator").getByRole("alert")).toContainText("1–50 whole units");
  await expect(page.getByTestId("net")).toHaveCount(0);
  await page.getByLabel("Number of units").fill("1.5");
  await expect(page.locator("#calculator").getByRole("alert")).toBeVisible();
  await page.getByLabel("Number of units").fill("1");
  await page.getByLabel("Monthly rent per unit").fill("");
  await expect(page.locator("#calculator").getByRole("alert")).toBeVisible();
  await page.locator(".calc-actions").getByRole("button", { name: "Reset", exact: true }).click();
  await expect(page.getByTestId("baseline")).toHaveText("$19,440");
  await page.getByLabel("Management plan", { exact: true }).selectOption("Enterprise");
  await expect(page.locator(".calculator .notice")).toContainText("custom quote");
  await expect(page.getByTestId("fee")).toHaveCount(0);
  await page.getByLabel("Management plan", { exact: true }).selectOption("Portfolio");
  await page.getByLabel("Number of units").fill("50");
  await page.getByLabel("Monthly rent per unit").fill("5000");
  await page.getByLabel("Current vacancy rate").fill("30");
  await expect(page.getByTestId("managed")).toHaveText("$2,850,000");
  await expect(page.getByTestId("fee")).toHaveText("−$228,000");
});

test("rental filtering, empty recovery, whole-building math and occupied details", async ({ page }) => {
  await expect(page.locator(".rental-card")).toHaveCount(6);
  await page.getByLabel("Property type", { exact: true }).selectOption("Condo");
  await page.getByLabel("Neighborhood", { exact: true }).selectOption("East Austin");
  await expect(page.getByRole("heading", { name: "No matching sample homes" })).toBeVisible();
  await page.getByRole("button", { name: "Reset rental filters" }).click();
  await expect(page.locator(".rental-card")).toHaveCount(6);
  await page.getByLabel("Property type", { exact: true }).selectOption("Multi-Family");
  await page.getByRole("button", { name: "View Southwood Eight" }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toContainText("$12,400 / month for the whole building");
  await expect(dialog).toContainText("8 units");
  await expect(dialog.getByRole("button", { name: "Preview inquiry" })).toHaveCount(0);
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
  await expect(page.getByRole("button", { name: "View Southwood Eight" })).toBeFocused();
});

test("rental inquiry requires valid fields and future date, reset and confirmation", async ({ page }) => {
  await page.getByRole("button", { name: "View Juniper Duplex" }).click();
  const dialog = page.getByRole("dialog");
  await dialog.getByRole("button", { name: "Preview inquiry", exact: true }).click();
  await expect(dialog.getByRole("heading", { name: "Your sample inquiry is ready." })).toHaveCount(0);
  await dialog.getByLabel("Fictional name").fill("Demo Resident");
  await dialog.getByLabel("Email", { exact: true }).fill("renter@example.com");
  await dialog.getByLabel("Preferred move-in date").fill("2020-01-01");
  expect(await dialog.getByLabel("Preferred move-in date").evaluate((e: HTMLInputElement) => e.validity.rangeUnderflow)).toBe(true);
  await dialog.getByRole("button", { name: "Clear inquiry" }).click();
  await expect(dialog.getByLabel("Fictional name")).toHaveValue("");
  await dialog.getByLabel("Fictional name").fill("Demo Resident");
  await dialog.getByLabel("Email", { exact: true }).fill("renter@example.com");
  await dialog.getByLabel("Preferred move-in date").fill("2027-06-15");
  await dialog.getByRole("checkbox").check();
  await dialog.getByRole("button", { name: "Preview inquiry", exact: true }).click();
  await expect(dialog.getByRole("heading", { name: "Your sample inquiry is ready." })).toBeVisible();
  await dialog.getByRole("button", { name: "Reset inquiry" }).click();
  await expect(dialog.getByLabel("Fictional name")).toHaveValue("");
});

test("honest owner/resident portals and local maintenance validation", async ({ page }) => {
  await page.getByRole("button", { name: "Owner portal preview", exact: true }).click();
  let dialog = page.getByRole("dialog");
  await expect(dialog).toContainText("$1,214");
  await expect(dialog).toContainText("−$116");
  await dialog.getByRole("button", { name: "Resident", exact: true }).click();
  await expect(dialog).toContainText("$0");
  await expect(dialog).toContainText("No payment button is connected");
  await dialog.getByRole("button", { name: "Preview a maintenance request" }).click();
  dialog = page.getByRole("dialog");
  await expect(dialog).toContainText("No request is sent or monitored");
  await dialog.getByRole("button", { name: "Preview maintenance request", exact: true }).click();
  await expect(dialog.getByRole("heading", { name: "Sample request prepared." })).toHaveCount(0);
  await dialog.getByLabel("Describe the issue").fill("A fictional dripping kitchen faucet.");
  await dialog.getByLabel("Preferred contact date").fill("2027-06-15");
  await dialog.getByRole("checkbox").check();
  await dialog.getByRole("button", { name: "Clear request" }).click();
  await expect(dialog.getByLabel("Describe the issue")).toHaveValue("");
  await dialog.getByLabel("Describe the issue").fill("A fictional dripping kitchen faucet.");
  await dialog.getByLabel("Preferred contact date").fill("2027-06-15");
  await dialog.getByRole("checkbox").check();
  await dialog.getByRole("button", { name: "Preview maintenance request", exact: true }).click();
  await expect(dialog).toContainText("DEMO-025");
  await expect(dialog).toContainText("Not dispatched");
  await dialog.getByRole("button", { name: "Create another sample" }).click();
  await expect(dialog.getByLabel("Describe the issue")).toHaveValue("");
});

test("consultation native validation, phone rules, confirmation and reset", async ({ page }) => {
  const form = page.locator("#analysis form");
  await form.getByRole("button", { name: "Preview My Free Analysis Request" }).click();
  await expect(page.getByRole("heading", { name: "Your sample request is ready." })).toHaveCount(0);
  await form.getByLabel("Property address").fill("123 Fictional Lane");
  await form.getByLabel("Email address").fill("owner@example.com");
  await form.getByLabel("Phone number").fill("not a phone");
  expect(await form.getByLabel("Phone number").evaluate((e: HTMLInputElement) => e.validity.patternMismatch)).toBe(true);
  await form.getByLabel("Phone number").fill("-------");
  expect(await form.getByLabel("Phone number").evaluate((e: HTMLInputElement) => e.validity.patternMismatch)).toBe(true);
  await form.getByRole("button", { name: "Clear form" }).click();
  await expect(form.getByLabel("Property address")).toHaveValue("");
  await form.getByLabel("Property address").fill("123 Fictional Lane");
  await form.getByLabel("Email address").fill("owner@example.com");
  await form.getByLabel("Phone number").fill("512-555-0100");
  await form.getByRole("checkbox").check();
  await form.getByRole("button", { name: "Preview My Free Analysis Request" }).click();
  await expect(page.getByRole("heading", { name: "Your sample request is ready." })).toBeVisible();
  await expect(page.locator(".analysis-form-card")).toContainText("Nothing was sent or saved");
  await page.getByRole("button", { name: "Start another request" }).click();
  await expect(page.locator("#analysis").getByLabel("Property address")).toHaveValue("");
});

test("keyboard dialog trapping, Escape restores trigger; mobile navigation and overflow", async ({ page }, testInfo) => {
  const trigger = page.getByRole("button", { name: "Owner portal preview", exact: true });
  await trigger.click();
  const dialog = page.getByRole("dialog");
  for (let i = 0; i < 10; i++) {
    await page.keyboard.press("Tab");
    expect(await dialog.evaluate(el => el.contains(document.activeElement))).toBe(true);
  }
  await page.keyboard.press("Shift+Tab");
  expect(await dialog.evaluate(el => el.contains(document.activeElement))).toBe(true);
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();
  if (testInfo.project.name === "mobile") {
    await page.getByRole("button", { name: "Open navigation" }).click();
    await page.getByRole("navigation").getByRole("link", { name: "Properties", exact: true }).click();
    await expect(page.getByRole("button", { name: "Open navigation" })).toHaveAttribute("aria-expanded", "false");
    await expect(page.locator(".mobile-bottom")).toContainText("Browse Rentals");
    expect(await page.evaluate(() => matchMedia("(prefers-reduced-motion: reduce)").matches)).toBe(true);
    expect(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior)).toBe("auto");
    await page.setViewportSize({ width: 320, height: 740 });
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test("renders without console errors or external service calls and captures review images", async ({ page }, testInfo) => {
  const errors: string[] = [];
  const external: string[] = [];
  page.on("pageerror", e => errors.push(e.message));
  page.on("console", message => { if (message.type() === "error") errors.push(message.text()); });
  page.on("request", r => { if (!r.url().startsWith("http://127.0.0.1:3125")) external.push(r.url()); });
  await page.reload();
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await page.screenshot({ path: testInfo.outputPath(`${testInfo.project.name}-hero.png`) });
  await page.screenshot({ path: testInfo.outputPath(`${testInfo.project.name}-home.png`), fullPage: true });
  await page.locator("#calculator").scrollIntoViewIfNeeded();
  await page.screenshot({ path: testInfo.outputPath(`${testInfo.project.name}-calculator.png`) });
  expect(errors).toEqual([]);
  expect(external).toEqual([]);
});
