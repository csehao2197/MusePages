import { test, expect, type Page } from "@playwright/test";
import { dateValue, pickupError, reservationError } from "../components/data";
function futureDate(day: number, offset = 7) {
  const date = new Date(); date.setDate(date.getDate() + offset);
  while (date.getDay() !== day) date.setDate(date.getDate() + 1);
  return dateValue(date);
}
async function beginReservation(page: Page) {
  await page.locator("#reservations").scrollIntoViewIfNeeded();
  await page.getByLabel("Your name", { exact: true }).fill("Demo Guest");
}
async function addOtoro(page: Page) {
  await page.getByRole("button", { name: "Add Otoro to bag", exact: true }).click();
  await page.getByRole("button", { name: /Takeout bag,/ }).click();
}
test.beforeEach(async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.route("**/*", async route => {
    const url = new URL(route.request().url());
    if (url.hostname !== "127.0.0.1") errors.push(`Unexpected external request: ${url.hostname}`);
    await route.continue();
  });
  await page.goto("/");
  (page as Page & { demoErrors: string[] }).demoErrors = errors;
});
test.afterEach(async ({ page }) => {
  expect((page as Page & { demoErrors: string[] }).demoErrors).toEqual([]);
});
test("seasonal menu categories, raw/allergen details, counter-only CTA and focus return", async ({ page }) => {
  await page.getByRole("button", { name: "Explore Otoro", exact: true }).click();
  const modal = page.getByRole("dialog");
  await expect(modal).toContainText("Fish, soy, wheat");
  await expect(modal).toContainText("food-safety risks");
  await expect(modal).toContainText("$24.00");
  await page.keyboard.press("Escape");
  await expect(page.getByRole("button", { name: "Explore Otoro", exact: true })).toBeFocused();
  await page.getByRole("button", { name: "Plant-based", exact: true }).click();
  await expect(page.locator(".menu-row")).toHaveCount(1);
  await expect(page.locator(".menu-row")).toContainText("White miso aubergine");
  await page.getByRole("button", { name: "Small plates", exact: true }).click();
  await page.getByRole("button", { name: "Details", exact: true }).click();
  await expect(modal).toContainText("Egg, shellfish");
  await expect(modal.getByRole("button", { name: "Add to Takeout Bag" })).toHaveCount(0);
  await modal.getByRole("link", { name: "Reserve the Bar" }).click();
  await expect(modal).not.toBeVisible();
  await expect(page.getByRole("radio", { name: "À La Carte Bar" })).toBeChecked();
});
test("takeout quantities, pricing, item limit, clearing and empty recovery", async ({ page }) => {
  await addOtoro(page);
  const modal = page.getByRole("dialog");
  await modal.getByRole("button", { name: "Increase Otoro" }).click();
  await expect(modal.locator(".estimate")).toContainText("$48.00");
  await modal.getByRole("button", { name: "Decrease Otoro" }).click();
  await expect(modal.locator(".estimate")).toContainText("$24.00");
  for (let i = 0; i < 7; i++) await modal.getByRole("button", { name: "Increase Otoro" }).click();
  await expect(modal.getByRole("button", { name: "Increase Otoro" })).toBeDisabled();
  await expect(modal.locator(".estimate")).toContainText("$192.00");
  await modal.getByRole("button", { name: "Clear bag", exact: true }).click();
  await expect(modal).toContainText("A quiet bag, for now.");
  await modal.getByRole("button", { name: "Return to Menu" }).click();
  await expect(page.getByRole("button", { name: "Takeout bag, 0 items" })).toBeFocused();
});
test("pickup native validation, closed-day error, local confirmation and new bag", async ({ page }) => {
  await addOtoro(page);
  const modal = page.getByRole("dialog");
  await modal.getByRole("button", { name: "Confirm Local Order" }).click();
  expect(await modal.getByLabel("Pickup date").evaluate((input: HTMLInputElement) => input.validity.valueMissing)).toBe(true);
  expect(await modal.locator("form").evaluate((form: HTMLFormElement) => form.checkValidity())).toBe(false);
  await modal.getByLabel("Pickup date").fill(futureDate(0));
  await modal.getByLabel("Pickup name").fill("Demo Collector");
  await modal.getByRole("button", { name: "Confirm Local Order" }).click();
  await expect(modal.getByRole("alert")).toContainText("Tuesday–Saturday");
  await modal.getByLabel("Pickup date").fill(futureDate(2));
  await modal.getByRole("button", { name: "Confirm Local Order" }).click();
  await expect(modal).toContainText("Local order confirmed");
  await expect(modal).toContainText("1 items · $24.00");
  await expect(modal).toContainText("No food prepared");
  await modal.getByRole("button", { name: "Start a new bag" }).click();
  await expect(modal).toContainText("A quiet bag, for now.");
});
test("omakase courses, seat capacity recovery, tea estimate and reset", async ({ page }) => {
  await page.getByText("Discover the 18-course journey", { exact: true }).click();
  await expect(page.getByText("12 hand-shaped nigiri — chef’s seasonal selection")).toBeVisible();
  await page.getByRole("link", { name: "Reserve Omakase Seats" }).click();
  await beginReservation(page);
  await page.getByLabel("Date", { exact: true }).fill(futureDate(2));
  await page.getByLabel("Party size").selectOption("8");
  await page.getByRole("button", { name: "Request Reservation" }).click();
  await expect(page.locator("#reservations").getByRole("alert")).toContainText("Only 6 of 14 demo seats");
  await page.getByRole("combobox", { name: "Time", exact: true }).selectOption("20:30");
  await page.getByRole("combobox", { name: "Pairing", exact: true }).selectOption("tea");
  await expect(page.locator("#reservations .estimate")).toContainText("$1,680.00");
  await page.getByRole("button", { name: "Request Reservation" }).click();
  await expect(page.locator(".confirmation")).toContainText("8 guests · Omakase, tea pairing · $1,680.00");
  await expect(page.locator(".confirmation")).toContainText("No seats reserved, email sent");
  await page.getByRole("button", { name: "Make another demo request" }).click();
  await expect(page.getByLabel("Date", { exact: true })).toHaveValue("");
  await expect(page.getByLabel("Party size")).toHaveValue("2");
  await expect(page.getByLabel("Your name", { exact: true })).toHaveValue("");
});
test("reservation native required fields, closed day and adult-only sake", async ({ page }) => {
  await page.locator("#reservations").scrollIntoViewIfNeeded();
  await page.getByRole("button", { name: "Request Reservation" }).click();
  expect(await page.locator("#reservations form").evaluate((form: HTMLFormElement) => form.checkValidity())).toBe(false);
  await beginReservation(page);
  await page.getByLabel("Date", { exact: true }).fill(futureDate(0));
  await page.getByRole("button", { name: "Request Reservation" }).click();
  await expect(page.locator("#reservations").getByRole("alert")).toContainText("closed Sunday and Monday");
  await page.getByLabel("Date", { exact: true }).fill(futureDate(2));
  await page.getByRole("combobox", { name: "Pairing", exact: true }).selectOption("sake");
  await expect(page.locator("#reservations .estimate")).toContainText("$500.00");
  await page.getByRole("button", { name: "Request Reservation" }).click();
  await expect(page.locator(".confirmation")).toHaveCount(0);
  await page.getByRole("checkbox", { name: /I self-declare/ }).check();
  await page.getByRole("button", { name: "Request Reservation" }).click();
  await expect(page.locator(".confirmation")).toContainText("sake pairing · $500.00");
});
test("à la carte selection restores time choices and has no fixed omakase charge", async ({ page }) => {
  await beginReservation(page);
  await page.getByRole("radio", { name: "À La Carte Bar" }).check();
  await expect(page.getByRole("combobox", { name: "Pairing", exact: true })).toHaveCount(0);
  await expect(page.getByRole("combobox", { name: "Time", exact: true }).locator("option")).toHaveCount(7);
  await page.getByLabel("Date", { exact: true }).fill(futureDate(3));
  await page.getByRole("combobox", { name: "Time", exact: true }).selectOption("19:30");
  await page.getByLabel("Special requests").fill("Illustrative private dinner");
  await page.getByRole("button", { name: "Request Reservation" }).click();
  await expect(page.locator(".confirmation")).toContainText("7:30 PM");
  await expect(page.locator(".confirmation")).toContainText("À la carte bar · priced by selection");
});
test("gallery arrows, wrap, keyboard trap and Escape focus restoration", async ({ page }) => {
  const opener = page.getByRole("button", { name: "Open gallery: The hinoki counter", exact: true });
  await opener.click();
  const modal = page.getByRole("dialog");
  await expect(modal).toContainText("1 / 6");
  await modal.getByRole("button", { name: "Previous image" }).click();
  await expect(modal).toContainText("6 / 6");
  await page.keyboard.press("ArrowRight");
  await expect(modal).toContainText("1 / 6");
  await modal.getByRole("button", { name: "Next image" }).click();
  await expect(modal.getByRole("heading")).toHaveText("A moment of precision");
  for (let i = 0; i < 7; i++) {
    await page.keyboard.press("Tab");
    expect(await page.evaluate(() => !!document.activeElement?.closest("dialog"))).toBe(true);
  }
  await page.keyboard.press("Escape");
  await expect(opener).toBeFocused();
  expect(await page.evaluate(() => document.body.style.overflow)).toBe("");
});
test("newsletter local validation, confirmation and reset", async ({ page }) => {
  await page.locator("#newsletter").fill("invalid");
  await page.getByRole("button", { name: "Subscribe locally" }).click();
  expect(await page.locator("#newsletter").evaluate((input: HTMLInputElement) => input.validity.typeMismatch)).toBe(true);
  await page.locator("#newsletter").fill("guest@example.com");
  await page.getByRole("button", { name: "Subscribe locally" }).click();
  await expect(page.locator(".newsletter")).toContainText("No email stored or sent");
  await page.getByRole("button", { name: "Reset signup" }).click();
  await expect(page.locator("#newsletter")).toHaveValue("");
});
test("responsive navigation, reduced motion, render capture and overflow", async ({ page }, testInfo) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator(".hero-art")).toHaveCSS("animation-name", "none");
  if (testInfo.project.name === "mobile") {
    const opener = page.locator(".nav-toggle");
    await opener.click();
    await expect(opener).toHaveAttribute("aria-expanded", "true");
    await page.keyboard.press("Escape");
    await expect(opener).toBeFocused();
    await opener.click();
    await page.getByRole("navigation", { name: "Mobile navigation" }).getByRole("link", { name: "Gallery", exact: true }).click();
    await expect(page.getByRole("navigation", { name: "Mobile navigation" })).toHaveCount(0);
  }
  for (const section of ["#home", "#menu", "#gallery", "#reservations", "#location"]) {
    await page.locator(section).scrollIntoViewIfNeeded();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  }
  await page.locator("#home").scrollIntoViewIfNeeded();
  await page.screenshot({ path: testInfo.outputPath("hikari-home.png"), fullPage: true });
  await page.locator("#reservations").scrollIntoViewIfNeeded();
  await page.screenshot({ path: testInfo.outputPath("hikari-reservation.png") });
});
test("calendar guard deterministic boundaries, guest limits and lead time", () => {
  const now = new Date("2026-11-03T18:00:00");
  expect(reservationError("2026-11-04", "18:00", 2, "counter", now)).toContain("48 hours");
  expect(reservationError("2026-11-05", "18:00", 2, "counter", now)).toBe("");
  expect(reservationError("2026-11-03", "17:30", 2, "bar", now)).toContain("future");
  expect(reservationError("2026-11-05", "19:00", 2, "counter", now)).toContain("6:00 PM");
  expect(reservationError("2026-11-05", "18:00", 9, "bar", now)).toContain("1 and 8");
  expect(reservationError("2026-11-05", "18:00", 0, "bar", now)).toContain("1 and 8");
  expect(reservationError("2026-11-05", "18:00", 2.5, "bar", now)).toContain("1 and 8");
  expect(reservationError("not-a-date", "18:00", 2, "counter", now)).toContain("valid date");
  expect(pickupError("2026-11-03", "18:30", now)).toContain("one hour");
  expect(pickupError("2026-11-03", "19:00", now)).toBe("");
  expect(pickupError("2026-11-08", "18:30", now)).toContain("Tuesday–Saturday");
  expect(pickupError("invalid", "18:30", now)).toContain("one hour");
});
