import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => { await page.goto("/"); });

test("neighborhood autocomplete, unmatched recovery, and area-specific content", async ({ page }) => {
  const search = page.getByRole("textbox", { name: "Search neighborhoods", exact: true });
  await search.fill("nowhere"); await page.getByRole("button", { name: "Find neighborhood", exact: true }).click();
  await expect(page.getByText("No neighborhood found.", { exact: false })).toBeVisible();
  await page.getByRole("button", { name: "Show all neighborhoods" }).click();
  await search.fill("97002");
  await page.locator("#area-suggestions").getByRole("button", { name: /Riverside Commons/ }).click();
  await expect(page.locator("#overview").getByRole("heading", { name: "Riverside Commons", exact: true })).toBeVisible();
  await expect(page.locator("#overview").getByText("$432,000")).toBeVisible();
  await expect(page.getByRole("button", { name: "Map: Riverside Primary School", exact: true })).toHaveCount(1);
  await page.getByRole("button", { name: "Explore Cedar Grove", exact: true }).click();
  await expect(page.locator("#overview").getByRole("heading", { name: "Cedar Grove", exact: true })).toBeVisible();
});

test("category pins sync with directory, empty recovery, place detail and saved guide", async ({ page }) => {
  await page.getByRole("button", { name: "Parks", exact: true }).click();
  await expect(page.getByRole("button", { name: /^Map:/ })).toHaveCount(3);
  await expect(page.getByRole("button", { name: "Map: Maplewood Elementary" })).toHaveCount(0);
  await page.getByRole("textbox", { name: "Search local places" }).fill("missing");
  await expect(page.getByRole("heading", { name: "No stops found" })).toBeVisible();
  await page.getByRole("button", { name: "Reset place filters" }).click();
  await expect(page.getByRole("button", { name: /^Map:/ })).toHaveCount(12);
  await page.getByRole("button", { name: "Map: Maplewood Central Park", exact: true }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toContainText("0.3 mi");
  await expect(dialog).toContainText("18-acre");
  await dialog.getByRole("button", { name: "Save stop to my guide" }).click();
  await expect(dialog.getByRole("button", { name: "Saved to guide — remove stop" })).toHaveAttribute("aria-pressed", "true");
  await page.keyboard.press("Escape");
  await expect(page.getByRole("button", { name: "Map: Maplewood Central Park", exact: true })).toBeFocused();
  await page.reload();
  await page.getByRole("button", { name: /My guide/ }).click();
  await expect(page.getByRole("dialog")).toContainText("Maplewood Central Park");
  const download = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download illustrative guide" }).click();
  expect((await download).suggestedFilename()).toBe("homescope-neighborhood-guide.txt");
  await page.getByRole("button", { name: "Remove Maplewood Central Park" }).click();
  await expect(page.getByRole("heading", { name: "Your guide is a blank canvas." })).toBeVisible();
  await page.getByRole("button", { name: "Explore local stops" }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
});

test("comparison selections update values with units", async ({ page }) => {
  await page.getByRole("button", { name: "Compare neighborhoods side by side" }).click();
  const dialog = page.getByRole("dialog");
  await dialog.getByLabel("Neighborhood 2").selectOption("harbor");
  await expect(dialog.getByRole("columnheader", { name: "Harbor Point" })).toBeVisible();
  await expect(dialog.getByRole("cell", { name: "$620,000", exact: true })).toBeVisible();
  await expect(dialog).toContainText("Average rent · USD/mo");
  await expect(dialog.getByRole("cell", { name: "$2,700", exact: true })).toBeVisible();
});

test("housing filters, numeric constraints, empty reset and local inquiry", async ({ page }) => {
  await page.getByRole("button", { name: /View all Maplewood Heights listings/i }).click();
  const dialog = page.getByRole("dialog");
  const price = dialog.getByLabel("Maximum price (USD)");
  await price.fill("-1000");
  expect(await price.evaluate((input: HTMLInputElement) => input.validity.rangeUnderflow)).toBe(true);
  await expect(dialog.getByRole("alert")).toContainText("price filter is paused");
  await price.fill("400000");
  await expect(dialog.getByRole("heading", { name: "108 Market Mews" })).toBeVisible();
  await expect(dialog.getByRole("heading", { name: "24 Canopy Lane" })).toHaveCount(0);
  await dialog.getByLabel("Home type").selectOption("Condo");
  await expect(dialog.getByRole("heading", { name: "No illustrative homes match" })).toBeVisible();
  await dialog.getByRole("button", { name: "Reset housing filters" }).click();
  await expect(dialog.locator(".housing-list article")).toHaveCount(3);
  await dialog.getByRole("button", { name: "Inquire about this home" }).first().click();
  await expect(dialog.getByRole("heading", { name: "Inquire about 24 Canopy Lane" })).toBeVisible();
  await expect(dialog.getByLabel("Your name")).toBeVisible();
});

test("tour native validation, whitespace/date constraints, error retry, confirmation and reset", async ({ page }) => {
  await page.getByRole("button", { name: "Schedule a neighborhood tour" }).click();
  const dialog = page.getByRole("dialog");
  const name = dialog.getByLabel("Your name");
  await dialog.getByRole("button", { name: "Create demo request" }).click();
  expect(await name.evaluate((input: HTMLInputElement) => input.validity.valueMissing)).toBe(true);
  await name.fill("   ");
  await dialog.getByLabel("Email", { exact: true }).fill("invalid");
  expect(await dialog.getByLabel("Email", { exact: true }).evaluate((input: HTMLInputElement) => input.validity.typeMismatch)).toBe(true);
  await dialog.getByLabel("Email", { exact: true }).fill("visitor@example.com");
  const date = dialog.getByLabel("Preferred visit date");
  await date.fill("2020-01-01");
  expect(await date.evaluate((input: HTMLInputElement) => input.validity.rangeUnderflow)).toBe(true);
  const future = new Date(); future.setDate(future.getDate() + 2);
  await date.fill(`${future.getFullYear()}-${String(future.getMonth() + 1).padStart(2, "0")}-${String(future.getDate()).padStart(2, "0")}`);
  await dialog.getByLabel("I understand this is a simulation, not a real appointment.").check();
  await dialog.getByRole("button", { name: "Create demo request" }).click();
  expect(await name.evaluate((input: HTMLInputElement) => input.validity.customError)).toBe(true);
  await name.fill("Demo Visitor");
  await dialog.getByLabel("Simulate an error (test recovery)").check();
  await dialog.getByRole("button", { name: "Create demo request" }).click();
  await expect(dialog.getByRole("alert")).toContainText("Demo service unavailable");
  await expect(name).toHaveValue("Demo Visitor");
  await dialog.getByLabel("Simulate an error (test recovery)").uncheck();
  await dialog.getByRole("button", { name: "Create demo request" }).click();
  await expect(dialog.getByRole("heading", { name: "Visit request drafted." })).toBeVisible();
  await expect(dialog.getByRole("status")).toContainText("No appointment");
  await dialog.getByRole("button", { name: "Start another request" }).click();
  await expect(name).toHaveValue("");
  await name.fill("Reset me"); await dialog.getByRole("button", { name: "Reset form" }).click(); await expect(name).toHaveValue("");
});

test("market alerts validate email and confirm without sending", async ({ page }) => {
  const email = page.getByRole("textbox", { name: "Email for market alerts" });
  await email.fill("bad");
  await page.getByRole("button", { name: "Get market alerts", exact: true }).click();
  expect(await email.evaluate((input: HTMLInputElement) => input.validity.typeMismatch)).toBe(true);
  await email.fill("demo@example.com");
  await page.getByRole("button", { name: "Get market alerts", exact: true }).click();
  await expect(page.locator(".alert-status")).toContainText("No email was sent");
  await expect(email).toHaveValue("");
});

test("dialog traps keyboard focus and restores trigger", async ({ page }) => {
  const button = page.getByRole("button", { name: /My guide/ });
  await button.click();
  await expect(page.getByRole("button", { name: "Close dialog" })).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(page.getByRole("button", { name: "Download illustrative guide" })).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(page.getByRole("button", { name: "Close dialog" })).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(button).toBeFocused();
});

test("storage failure recovery remains usable and no external requests", async ({ page }) => {
  await page.addInitScript(() => {
    Storage.prototype.getItem = () => { throw new Error("Storage disabled"); };
    Storage.prototype.setItem = () => { throw new Error("Storage disabled"); };
  });
  const external: string[] = [];
  page.on("request", req => { if (!req.url().startsWith("http://127.0.0.1:3122")) external.push(req.url()); });
  await page.reload();
  await expect(page.getByText("Saved stops could not be loaded.", { exact: false })).toBeVisible();
  await page.getByRole("button", { name: "Map: The Maple Table" }).click();
  await page.getByRole("button", { name: "Save stop to my guide" }).click();
  await page.getByRole("button", { name: "Close dialog" }).click();
  await expect(page.getByText("Browser storage is unavailable.", { exact: false })).toBeVisible();
  await page.getByRole("button", { name: /My guide/ }).click();
  await expect(page.getByRole("dialog")).toContainText("The Maple Table");
  expect(external).toEqual([]);
});

test("responsive navigation, directory collapse, reduced motion, overflow and render", async ({ page }, testInfo) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior)).toBe("auto");
  if (testInfo.project.name === "mobile") {
    const toggle = page.getByRole("button", { name: "Toggle navigation" });
    await toggle.click(); await expect(toggle).toHaveAttribute("aria-expanded", "true");
    await page.getByRole("navigation", { name: "Main navigation" }).getByRole("link", { name: "Local life" }).click();
    await expect(toggle).toHaveAttribute("aria-expanded", "false");
    const directory = page.getByRole("button", { name: "Toggle local directory" });
    await directory.click(); await expect(page.getByRole("textbox", { name: "Search local places" })).toHaveCount(0);
    await directory.click(); await expect(page.getByRole("textbox", { name: "Search local places" })).toBeVisible();
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.screenshot({ path: `test-results\\${testInfo.project.name}-full.png`, fullPage: true });
  await page.getByRole("button", { name: "Compare neighborhoods side by side" }).click();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});
