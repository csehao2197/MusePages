import { test as base, expect, Page } from "@playwright/test";

const test = base.extend<{ runtimeCheck: void }>({
  runtimeCheck: [async ({ page }, use) => {
    const errors: string[] = [];
    const external: string[] = [];
    page.on("pageerror", error => errors.push(error.message));
    page.on("console", message => { if (message.type() === "error") errors.push(message.text()); });
    page.on("request", request => { if (!request.url().startsWith("http://127.0.0.1:3109") && !request.url().startsWith("data:")) external.push(request.url()); });
    await use();
    expect(errors, "No browser runtime errors").toEqual([]);
    expect(external, "No external APIs, fonts, imagery or services").toEqual([]);
  }, { auto: true }],
});
async function planner(page: Page, mobile: boolean) {
  if (mobile) await page.locator(".mobile-booking-bar").getByRole("button", { name: "Reserve", exact: true }).click();
  return page.getByRole("complementary", { name: "Reservation planner" });
}
async function dates(page: Page, mobile: boolean, from = "2026-11-10", to = "2026-11-17") {
  const panel = await planner(page, mobile);
  await panel.getByLabel("Check-in", { exact: true }).fill(from);
  await panel.getByLabel("Check-out", { exact: true }).fill(to);
  return panel;
}
test.beforeEach(async ({ page }) => { await page.goto("/"); });

test("source-tailored render, mobile navigation, motion and no overflow", async ({ page, isMobile }, testInfo) => {
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Casa Azul");
  await expect(page.getByText("Original architectural illustrations, not property photographs.")).toBeVisible();
  await expect(page.locator(".mosaic")).toBeVisible({ visible: !isMobile });
  if (isMobile) {
    await expect(page.locator(".mobile-booking-bar")).toBeVisible();
    await page.getByRole("button", { name: "Open menu" }).click();
    await page.getByRole("navigation", { name: "Main navigation" }).getByRole("button", { name: "How It Works" }).click();
    await expect(page.getByRole("dialog")).toContainText("never creates a booking");
    await page.getByRole("button", { name: "Close dialog" }).click();
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior)).toBe("auto");
  await page.screenshot({ path: testInfo.outputPath("listing-top.png"), fullPage: false });
  await page.screenshot({ path: testInfo.outputPath("listing-full.png"), fullPage: true });
  await page.getByRole("heading", { name: "More beachfront stays in Tulum" }).scrollIntoViewIfNeeded();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  if (isMobile) {
    await page.setViewportSize({ width: 320, height: 740 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.screenshot({ path: testInfo.outputPath("listing-320.png") });
  }
});

test("gallery controls, keyboard navigation, focus trap and focus restoration", async ({ page, isMobile }) => {
  const trigger = page.locator(isMobile ? ".mobile-carousel" : ".mosaic").getByRole("button").first();
  await trigger.click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toContainText("5 original scenes");
  await expect(dialog.getByRole("button", { name: "Close dialog" })).toBeFocused();
  await dialog.getByRole("button", { name: "Next view" }).click();
  await expect(dialog.locator(".lightbox-caption")).toContainText("2 / 8");
  await page.keyboard.press("ArrowRight");
  await expect(dialog.locator(".lightbox-caption")).toContainText("3 / 8");
  await dialog.getByRole("button", { name: "Previous view" }).click();
  await expect(dialog.locator(".lightbox-caption")).toContainText("2 / 8");
  await dialog.getByRole("button", { name: "Close dialog" }).focus();
  await page.keyboard.press("Shift+Tab");
  expect(await page.evaluate(() => !!document.activeElement?.closest("dialog"))).toBe(true);
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(trigger).toBeFocused();
  if (isMobile) {
    const carousel = page.locator(".mobile-carousel");
    await carousel.scrollIntoViewIfNeeded();
    const box = (await carousel.boundingBox())!;
    const session = await page.context().newCDPSession(page);
    const y = Math.min(box.y + box.height / 2, 700);
    await session.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: 320, y }] });
    for (const x of [280, 240, 190, 140, 90, 50]) {
      await session.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x, y }] });
      await page.waitForTimeout(35);
    }
    await session.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
    await session.detach();
    await expect(page.getByRole("button", { name: "Go to view 2", exact: true })).toHaveAttribute("aria-current", "true");
    await page.getByRole("button", { name: "Go to view 3", exact: true }).click();
    await expect(page.getByRole("button", { name: "Go to view 3", exact: true })).toHaveAttribute("aria-current", "true");
    await expect(page.locator(".carousel-dots")).toContainText("3 / 8");
  }
});

test("description, categorized amenities, filtered reviews and empty search states", async ({ page }) => {
  await expect(page.locator(".description-more")).not.toBeVisible();
  await page.getByRole("button", { name: "Show more", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Guest access" })).toBeVisible();
  await page.getByRole("button", { name: "Show less", exact: true }).click();
  await page.getByRole("button", { name: /Explore all \d+ amenities/ }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog.getByRole("heading", { name: "Bathroom", exact: true })).toBeVisible();
  await dialog.getByLabel("Find an amenity").fill("shower");
  await expect(dialog).toContainText("Rainfall shower");
  await expect(dialog).not.toContainText("Gas stove");
  await dialog.getByLabel("Find an amenity").fill("spaceship");
  await expect(dialog.getByRole("status")).toContainText("No amenities match");
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: "Browse the 6 sample reviews" }).click();
  await dialog.getByLabel("Search sample reviews").fill("seaweed");
  await expect(dialog.getByRole("status")).toContainText("1 sample review");
  await expect(dialog).toContainText("James W.");
  await dialog.getByLabel("Search sample reviews").fill("spaceship");
  await expect(dialog).toContainText("No stories match");
  await page.keyboard.press("Escape");
  await page.locator(".listing-meta").getByRole("link", { name: /127 illustrative reviews/ }).click();
  await expect(page).toHaveURL(/#reviews$/);
});

test("calendar selection, unavailable nights, clear dates and bounded month controls", async ({ page, isMobile }) => {
  await page.getByRole("heading", { name: "A little time for yourself" }).scrollIntoViewIfNeeded();
  await expect(page.getByRole("button", { name: "Previous month" })).toBeDisabled();
  if (isMobile) {
    await page.getByRole("button", { name: "Next month" }).click();
    await expect(page.locator(".month").first().getByRole("heading")).toHaveText("November 2026");
    await expect(page.locator(".second-month")).not.toBeVisible();
  } else await expect(page.locator(".second-month")).toBeVisible();
  await expect(page.getByRole("button", { name: "2026-11-05 unavailable", exact: true })).toBeDisabled();
  await page.getByRole("button", { name: "2026-11-10 available", exact: true }).click();
  await page.getByRole("button", { name: "2026-11-17 available", exact: true }).click();
  await expect(page.getByRole("button", { name: "2026-11-10 check-in", exact: true })).toHaveAttribute("aria-pressed", "true");
  const panel = await planner(page, isMobile);
  await expect(panel.getByLabel("Check-in", { exact: true })).toHaveValue("2026-11-10");
  await expect(panel.getByTestId("total-price")).toHaveText("$3,332.68");
  if (isMobile) await page.getByRole("button", { name: "Close reservation planner" }).click();
  await page.getByRole("button", { name: "Clear dates", exact: true }).click();
  await expect(page.locator(".calendar-foot")).toContainText("not a live feed");
  if (isMobile) {
    await page.locator(".calendars").evaluate(element => {
      const start = new Touch({ identifier: 1, target: element, clientX: 320, clientY: 100 });
      const end = new Touch({ identifier: 1, target: element, clientX: 90, clientY: 100 });
      element.dispatchEvent(new TouchEvent("touchstart", { bubbles: true, touches: [start] }));
      element.dispatchEvent(new TouchEvent("touchend", { bubbles: true, changedTouches: [end] }));
    });
    await expect(page.locator(".month").first().getByRole("heading")).toHaveText("December 2026");
  }
  while (await page.getByRole("button", { name: "Next month" }).isEnabled()) {
    await page.getByRole("button", { name: "Next month" }).click();
  }
  await expect(page.getByRole("button", { name: "Next month" })).toBeDisabled();
  await expect(page.locator(".month").first().getByRole("heading")).toHaveText("April 2027");
});

test("native date validation, invalid ranges, minimum nights and blocked-range errors", async ({ page, isMobile }) => {
  const panel = await planner(page, isMobile);
  await expect(panel.locator(".empty-quote")).toBeVisible();
  await panel.getByRole("button", { name: "Reserve · preview only" }).click();
  expect(await panel.getByLabel("Check-in", { exact: true }).evaluate(input => (input as HTMLInputElement).validity.valueMissing)).toBe(true);
  await panel.getByLabel("Check-in", { exact: true }).fill("2026-10-30");
  await panel.getByLabel("Check-out", { exact: true }).fill("2026-11-03");
  await panel.getByRole("button", { name: "Reserve · preview only" }).click();
  expect(await panel.getByLabel("Check-in", { exact: true }).evaluate(input => (input as HTMLInputElement).validity.rangeUnderflow)).toBe(true);
  await panel.getByLabel("Check-in", { exact: true }).fill("2026-11-10");
  await panel.getByLabel("Check-out", { exact: true }).fill("2026-11-09");
  await expect(panel.getByRole("alert")).toContainText("after check-in");
  await panel.getByLabel("Check-out", { exact: true }).fill("2026-11-12");
  await expect(panel.getByRole("alert")).toContainText("3-night minimum");
  await panel.getByLabel("Check-in", { exact: true }).fill("2026-11-03");
  await panel.getByLabel("Check-out", { exact: true }).fill("2026-11-10");
  await expect(panel.getByRole("alert")).toContainText("unavailable nights");
  await panel.getByRole("button", { name: "Reserve · preview only" }).click();
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await expect(panel.getByTestId("price-breakdown")).not.toBeVisible();
});

test("capacity steppers, pet pricing, complete breakdown and currency conversion", async ({ page, isMobile }, testInfo) => {
  const panel = await dates(page, isMobile);
  await expect(panel.getByTestId("price-breakdown")).toContainText("$389 × 7 nights");
  await expect(panel.getByTestId("price-breakdown")).toContainText("$459.68");
  await expect(panel.getByTestId("total-price")).toHaveText("$3,332.68");
  await panel.getByRole("button", { name: /GUESTS/ }).click();
  for (let index = 0; index < 3; index++) await panel.getByRole("button", { name: "Add children" }).click();
  await panel.getByRole("button", { name: "Add infants" }).click();
  await expect(panel.getByRole("button", { name: "Add adults" })).toBeDisabled();
  await expect(panel.getByRole("button", { name: "Add children" })).toBeDisabled();
  await expect(panel.getByRole("button", { name: "Add infants" })).toBeDisabled();
  await panel.getByRole("button", { name: "Add pets" }).click();
  await expect(panel.getByRole("button", { name: "Add pets" })).toBeDisabled();
  await expect(panel.getByTestId("price-breakdown")).toContainText("$350");
  await expect(panel.getByTestId("total-price")).toHaveText("$3,738.68");
  await panel.getByRole("button", { name: "Remove adults" }).click();
  await expect(panel.getByRole("button", { name: "Remove adults" })).toBeDisabled();
  await panel.getByRole("button", { name: /GUESTS/ }).click();
  await page.screenshot({ path: testInfo.outputPath("reservation-planner.png") });
  if (isMobile) await page.keyboard.press("Escape");
  await page.getByLabel("Footer currency", { exact: true }).selectOption("EUR");
  const updated = await planner(page, isMobile);
  await expect(updated.getByTestId("total-price")).toHaveText("€3,439.59");
  await expect(updated.locator(".conversion-note")).toContainText("1 USD = 0.92 EUR");
  if (isMobile) await page.keyboard.press("Escape");
  await page.getByLabel("Footer currency", { exact: true }).selectOption("GBP");
  await planner(page, isMobile);
  await expect(updated.getByTestId("total-price")).toHaveText("£2,953.56");
});

test("reservation preview uses native form validation, consent and truthful confirmation", async ({ page, isMobile }, testInfo) => {
  const panel = await dates(page, isMobile);
  await panel.getByRole("button", { name: "Reserve · preview only" }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog.locator(".reservation-summary")).toContainText("$3,332.68 total");
  await dialog.getByRole("button", { name: "Create reservation preview" }).click();
  expect(await dialog.getByLabel("Your name", { exact: true }).evaluate(input => (input as HTMLInputElement).validity.valueMissing)).toBe(true);
  await dialog.getByLabel("Your name", { exact: true }).fill("Alex Example");
  await dialog.getByLabel("Email", { exact: true }).fill("invalid-email");
  await dialog.getByRole("button", { name: "Create reservation preview" }).click();
  expect(await dialog.getByLabel("Email", { exact: true }).evaluate(input => (input as HTMLInputElement).validity.typeMismatch)).toBe(true);
  await dialog.getByLabel("Email", { exact: true }).fill("alex@example.com");
  await dialog.getByRole("button", { name: "Create reservation preview" }).click();
  await expect(dialog.locator(".confirmation")).not.toBeVisible();
  await dialog.getByRole("checkbox").check();
  await dialog.getByRole("button", { name: "Create reservation preview" }).click();
  await expect(dialog.getByRole("status")).toContainText("7 nights · 2 guests · $3,332.68");
  await expect(dialog.getByRole("status")).toContainText("Nothing was booked, charged, sent, or saved");
  await page.screenshot({ path: testInfo.outputPath("reservation-confirmation.png") });
  await dialog.getByRole("button", { name: "Back to Casa Azul" }).click();
  await expect(dialog).not.toBeVisible();
});

test("contact and concern previews reject whitespace and never send messages", async ({ page }) => {
  await page.getByRole("button", { name: "Message host", exact: true }).click();
  const dialog = page.getByRole("dialog");
  await dialog.getByRole("button", { name: "Preview message", exact: true }).click();
  expect(await dialog.getByLabel("Your name", { exact: true }).evaluate(input => (input as HTMLInputElement).validity.valueMissing)).toBe(true);
  await dialog.getByLabel("Your name", { exact: true }).fill("  ");
  await dialog.getByLabel("Email", { exact: true }).fill("alex@example.com");
  await dialog.getByLabel("Your message", { exact: true }).fill("            ");
  await dialog.getByRole("checkbox").check();
  await dialog.getByRole("button", { name: "Preview message", exact: true }).click();
  await expect(dialog.getByRole("alert")).toContainText("non-whitespace");
  await dialog.getByLabel("Your name", { exact: true }).fill("Alex Example");
  await dialog.getByLabel("Your message", { exact: true }).fill("Is the chef available for a fictional dinner?");
  await dialog.getByRole("button", { name: "Preview message", exact: true }).click();
  await expect(dialog.getByRole("status")).toContainText("Your message preview is ready");
  await expect(dialog.getByRole("status")).toContainText("Is the chef available for a fictional dinner?");
  await expect(dialog.getByRole("status")).toContainText("Nothing was booked, charged, sent");
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: "Report listing", exact: true }).click();
  await dialog.getByLabel("Concern category").selectOption("Safety concern");
  await dialog.getByLabel("Your name", { exact: true }).fill("Alex Example");
  await dialog.getByLabel("Email", { exact: true }).fill("alex@example.com");
  await dialog.getByLabel("Describe your concern").fill("Please clarify the illustrative unfenced pool.");
  await dialog.getByRole("checkbox").check();
  await dialog.getByRole("button", { name: "Preview concern", exact: true }).click();
  await expect(dialog.getByRole("status")).toContainText("Your concern preview is ready");
});

test("location, cancellation boundaries and pool disclosures are honestly illustrative", async ({ page }) => {
  await page.locator(".listing-meta").getByRole("link", { name: "Tulum Beach Road, Mexico" }).click();
  await expect(page).toHaveURL(/#location$/);
  await expect(page.getByRole("img", { name: /Illustrative, non-geographic map/ })).toBeVisible();
  await page.getByRole("button", { name: "About the approximate location" }).click();
  await expect(page.getByRole("dialog")).toContainText("not a geographic map");
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: "Read full policy" }).click();
  await expect(page.getByRole("dialog")).toContainText("Exactly 7 days is full; exactly 3 is 50%");
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: "View disclosures" }).click();
  await expect(page.getByRole("dialog")).toContainText("unfenced with no gate or lock");
  await expect(page.getByRole("dialog")).toContainText("not verified amenities or safety guarantees");
});

test("session saves, alternative listing previews and clipboard fallback", async ({ page }) => {
  await page.getByRole("button", { name: "Save", exact: true }).click();
  await expect(page.getByRole("button", { name: "Saved", exact: true })).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "Saved", exact: true }).click();
  await expect(page.getByRole("button", { name: "Save", exact: true })).toHaveAttribute("aria-pressed", "false");
  await page.getByRole("button", { name: "Save Oceanview Treehouse Loft", exact: true }).click();
  await expect(page.getByRole("button", { name: "Save Oceanview Treehouse Loft", exact: true })).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "Preview Oceanview Treehouse Loft", exact: true }).click();
  await expect(page.getByRole("dialog")).toContainText("does not depict a separate real property");
  await page.keyboard.press("Escape");
  await page.evaluate(() => Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText: () => Promise.reject(new Error("denied")) } }));
  await page.getByRole("button", { name: "Share", exact: true }).click();
  await page.getByRole("button", { name: "Copy demo link" }).click();
  await expect(page.getByRole("dialog").getByRole("status")).toContainText("Clipboard unavailable");
  await expect(page.getByLabel("Share link")).toHaveValue("http://127.0.0.1:3109/#about");
  await page.evaluate(() => Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText: () => Promise.resolve() } }));
  await page.getByRole("button", { name: "Copy demo link" }).click();
  await expect(page.getByRole("dialog").getByRole("status")).toContainText("Copied the local demo link");
});

test("mobile planner keyboard focus and Escape; no account or language service", async ({ page, isMobile }) => {
  if (isMobile) {
    const panel = await planner(page, true);
    await expect(page.getByRole("button", { name: "Close reservation planner" })).toBeFocused();
    await page.keyboard.press("Shift+Tab");
    expect(await page.evaluate(() => !!document.activeElement?.closest("#booking"))).toBe(true);
    await page.keyboard.press("Escape");
    await expect(panel).not.toBeVisible();
    await expect(page.locator(".mobile-booking-bar").getByRole("button", { name: "Reserve", exact: true })).toBeFocused();
  } else {
    await page.getByRole("button", { name: "Sign In", exact: true }).click();
    await expect(page.getByRole("dialog")).toContainText("do not enter credentials");
    await page.keyboard.press("Escape");
  }
  await page.getByRole("button", { name: "English", exact: true }).click();
  await expect(page.getByRole("dialog")).toContainText("English only");
});
