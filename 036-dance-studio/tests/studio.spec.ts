import { test, expect, type Locator, type Page } from "@playwright/test";
async function schedule(page: Page) {
  await page.goto("/");
  await page.locator("#schedule").scrollIntoViewIfNeeded();
  await page.getByRole("button", { name: "Mon 2", exact: true }).click();
}
async function identity(form: Locator) {
  await form.getByLabel("Demo alias").fill("River Demo");
  await form.getByLabel("Fictional email").fill("river@example.test");
  await form.getByLabel("Adult age category").selectOption("25–34");
}
test("style explorer filters the complete week; day, level and adult filters recover", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Explore Contemporary classes", exact: true }).click();
  await expect(page.locator(".class-row")).toHaveCount(7);
  await expect(page.locator(".class-row").first()).toContainText("Contemporary Flow");
  await page.getByRole("button", { name: "Tue 3", exact: true }).click();
  await expect(page.locator(".class-row")).toHaveCount(1);
  await page.getByLabel("Filter by level").selectOption("Beginner");
  await expect(page.getByRole("heading", { name: "No matching classes" })).toBeVisible();
  await page.getByRole("button", { name: "Reset filters" }).click();
  await expect(page.locator(".class-row")).toHaveCount(5);
  await page.getByLabel("Filter by age").selectOption("Under 18");
  await expect(page.getByText("This demo is adult-only. No children’s enrollment")).toBeVisible();
  await page.getByRole("button", { name: "Show adult classes" }).click();
  await page.getByLabel("Filter by age").selectOption("46+");
  await expect(page.locator(".class-row")).toHaveCount(5);
});
test("class details, booking capacity, date, total, local confirmation and reset", async ({ page }) => {
  await schedule(page);
  const trigger = page.getByRole("button", { name: "Hip-Hop Foundations", exact: true });
  await trigger.click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toContainText("Studio A");
  await expect(dialog).toContainText("Fictional capacity: 4");
  await dialog.getByRole("button", { name: "Select this class" }).click();
  await identity(dialog);
  await dialog.getByLabel("Adult places").fill("5");
  await dialog.getByRole("button", { name: "Confirm Demo Class" }).click();
  expect(await dialog.locator('input[name="quantity"]').evaluate((e: HTMLInputElement) => e.validity.rangeOverflow)).toBe(true);
  await dialog.getByLabel("Adult places").fill("2");
  await expect(dialog.locator(".total")).toContainText("$44");
  await dialog.getByLabel("Session date").fill("2026-11-03");
  await dialog.getByRole("button", { name: "Confirm Demo Class" }).click();
  expect(await dialog.getByLabel("Session date").evaluate((e: HTMLInputElement) => e.validity.rangeOverflow)).toBe(true);
  await dialog.getByLabel("Session date").fill("2026-11-02");
  await dialog.getByLabel("Session time").selectOption("");
  await dialog.getByRole("button", { name: "Confirm Demo Class" }).click();
  expect(await dialog.getByLabel("Session time").evaluate((e: HTMLSelectElement) => e.validity.valueMissing)).toBe(true);
  await dialog.getByLabel("Session time").selectOption("18:00");
  await dialog.getByRole("button", { name: "Confirm Demo Class" }).click();
  await expect(dialog.getByRole("status")).toContainText("2 adult place(s) · $44");
  await expect(dialog).toContainText("No booking, payment or email was sent");
  await dialog.getByRole("button", { name: "Make another selection" }).click();
  await expect(dialog.getByLabel("Demo alias")).toHaveValue("");
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();
});
test("trial requires native fields and handles fictional-email error and reset", async ({ page }) => {
  await page.goto("/");
  await page.locator(".header-book").click();
  const dialog = page.getByRole("dialog");
  await dialog.getByRole("button", { name: "Reserve My Free Class" }).click();
  expect(await dialog.getByLabel("Demo alias").evaluate((e: HTMLInputElement) => e.validity.valueMissing)).toBe(true);
  await identity(dialog);
  await dialog.getByLabel("Which style interests you?").selectOption("Ballet");
  await dialog.getByLabel("Never Danced", { exact: true }).check();
  await dialog.getByLabel("Trial session").selectOption("0-4");
  await expect(dialog.getByLabel("Session time")).toHaveValue("17:00");
  await dialog.getByLabel("Fictional email").fill("wrong");
  expect(await dialog.getByLabel("Fictional email").evaluate((e: HTMLInputElement) => e.validity.typeMismatch)).toBe(true);
  await dialog.getByLabel("Fictional email").fill("river@invalid.test");
  await dialog.getByRole("button", { name: "Reserve My Free Class" }).click();
  await expect(dialog.getByRole("alert")).toContainText("@example.test");
  await dialog.getByLabel("Fictional email").fill("river@example.test");
  await dialog.getByRole("button", { name: "Reserve My Free Class" }).click();
  await expect(dialog.getByRole("status")).toContainText("Ballet Basics");
  await expect(dialog.getByRole("status")).toContainText("$0 free trial");
  await dialog.getByRole("button", { name: "Make another selection" }).click();
  await dialog.getByLabel("Demo alias").fill("Reset Alias");
  await dialog.getByRole("button", { name: "Reset form", exact: true }).click();
  await expect(dialog.getByLabel("Demo alias")).toHaveValue("");
  await expect(dialog.getByLabel("Trial session")).toHaveValue("");
});
test("inline trial supports style changes and experience choices", async ({ page }) => {
  await page.goto("/");
  const form = page.locator("#trial form");
  await form.scrollIntoViewIfNeeded();
  await identity(form);
  await form.getByLabel("Which style interests you?").selectOption("Hip-Hop");
  await form.getByLabel("Some Experience", { exact: true }).check();
  await form.getByLabel("Trial session").selectOption("0-0");
  await form.getByLabel("Which style interests you?").selectOption("Contemporary");
  await expect(form.getByLabel("Trial session")).toHaveValue("");
  await form.getByLabel("Experienced Dancer", { exact: true }).check();
  await form.getByLabel("Trial session").selectOption("1-1");
  await form.getByRole("button", { name: "Reserve My Free Class" }).click();
  await expect(page.locator("#trial").getByRole("status")).toContainText("Contemporary Flow · 2026-11-03 · 7:15 PM");
});
test("teacher profile qualifies affiliations and returns to filtered classes", async ({ page }) => {
  await page.goto("/");
  const card = page.locator(".teacher-card").filter({ hasText: "Ava Williams" });
  await card.getByRole("button", { name: "View Profile" }).click();
  await expect(page.getByRole("dialog")).toContainText("Juilliard and Alvin Ailey affiliations are unverified");
  await page.getByRole("button", { name: "Explore their style" }).click();
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await expect(page.getByLabel("Filter by style")).toHaveValue("Contemporary");
  await expect(page.locator(".class-row")).toHaveCount(7);
});
test("event details and ticket selection validate capacity and price; full event recovers", async ({ page }) => {
  await page.goto("/");
  const event = page.locator(".event-card").filter({ hasText: "Friday, with a little salsa" });
  await event.getByRole("button", { name: "Event details" }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toContainText("2026-11-20");
  await dialog.getByRole("button", { name: "Select Demo Tickets" }).click();
  await identity(dialog);
  await dialog.getByLabel("Adult tickets").fill("0");
  await dialog.getByRole("button", { name: "Confirm Demo Tickets" }).click();
  expect(await dialog.getByLabel("Adult tickets").evaluate((e: HTMLInputElement) => e.validity.rangeUnderflow)).toBe(true);
  await dialog.getByLabel("Adult tickets").fill("3");
  await expect(dialog.locator(".total")).toContainText("$24");
  await dialog.getByRole("button", { name: "Confirm Demo Tickets" }).click();
  await expect(dialog.getByRole("status")).toContainText("3 adult ticket(s) · $24");
  await page.keyboard.press("Escape");
  await page.locator(".event-card").filter({ hasText: "Open floor / open minds" }).getByRole("button", { name: "Event details" }).click();
  await expect(dialog.getByRole("button", { name: "Event full" })).toBeDisabled();
  await dialog.getByRole("button", { name: "Explore other events" }).click();
  await expect(dialog).not.toBeVisible();
});
test("pricing journeys distinguish drop-in, unlimited trial and ten-class pack", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Book a Class", exact: true }).click();
  await expect(page.getByLabel("Filter by style")).toHaveValue("All styles");
  await expect(page.locator(".class-row")).toHaveCount(35);
  await page.getByRole("button", { name: "Start Free Trial", exact: true }).click();
  await expect(page.getByRole("dialog")).toContainText("Your first class is free");
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: "Buy Pack", exact: true }).click();
  const dialog = page.getByRole("dialog");
  await identity(dialog);
  await expect(dialog.locator(".total")).toContainText("$180 / 10 classes");
  await dialog.getByRole("button", { name: "Confirm Demo Pack" }).click();
  await expect(dialog.getByRole("status")).toContainText("1 pack · $180");
});
test("gallery and video substitution dialogs have keyboard trapping and focus return", async ({ page }) => {
  await page.goto("/");
  const trigger = page.getByRole("button", { name: "Watch Us Dance", exact: true });
  await trigger.click();
  await expect(page.getByRole("dialog")).toContainText("not filmed choreography");
  await page.getByRole("button", { name: "Close dialog", exact: true }).focus();
  await page.keyboard.press("Shift+Tab");
  await expect(page.getByRole("button", { name: "Back to the studio", exact: true })).toBeFocused();
  await page.keyboard.press("Tab");
  expect(await page.evaluate(() => !!document.activeElement?.closest("dialog"))).toBe(true);
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();
  const moment = page.getByRole("button", { name: "Open Practice diary / two imagined moments", exact: true });
  await moment.click();
  await expect(page.getByRole("dialog")).toContainText("not a before/after claim");
  await page.getByRole("button", { name: "Close dialog", exact: true }).click();
  await expect(moment).toBeFocused();
  await expect(page.locator(".gallery-card")).toHaveCount(8);
});
test("full class stays unavailable and daily tabs recover", async ({ page }) => {
  await schedule(page);
  await page.getByRole("button", { name: "Wed 4", exact: true }).click();
  const row = page.locator(".class-row").filter({ hasText: "Breaking Lab" });
  await expect(row.getByRole("button", { name: "Full", exact: true })).toBeDisabled();
  await row.getByRole("button", { name: "Breaking Lab", exact: true }).click();
  await expect(page.getByRole("dialog").getByRole("button", { name: "Class full", exact: true })).toBeDisabled();
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: "Sat 7", exact: true }).click();
  await expect(page.locator(".class-row").first()).toContainText("10:00 AM");
});
test("navigation, local contact/social/privacy previews and narrow overflow", async ({ page }, testInfo) => {
  await page.goto("/");
  if (testInfo.project.name === "mobile") {
    await page.getByRole("button", { name: "Open menu", exact: true }).click();
    await expect(page.getByRole("button", { name: "Close menu", exact: true })).toHaveAttribute("aria-expanded", "true");
  }
  await page.getByRole("navigation", { name: "Main navigation" }).getByRole("link", { name: "Contact", exact: true }).click();
  await expect(page.locator("#contact")).toBeInViewport();
  if (testInfo.project.name === "mobile") await expect(page.getByRole("button", { name: "Open menu", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Privacy Policy", exact: true }).click();
  await expect(page.getByRole("dialog")).toContainText("No analytics, accounts, storage");
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: "Follow Us @rhythmandflow", exact: false }).click();
  await expect(page.getByRole("dialog")).toContainText("does not open or imply ownership");
  await page.keyboard.press("Escape");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  if (testInfo.project.name === "mobile") {
    await page.setViewportSize({ width: 320, height: 700 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    await page.locator(".mobile-sticky").click();
    await expect(page.getByRole("dialog")).toBeVisible();
  }
});
test("reduced motion, final render and no unexpected application requests", async ({ page }, testInfo) => {
  const external: string[] = [];
  const errors: string[] = [];
  page.on("request", request => { if (!request.url().startsWith("http://127.0.0.1:3136")) external.push(request.url()); });
  page.on("pageerror", e => errors.push(e.message));
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("TRANSFORM.");
  await page.screenshot({ path: `test-results/${testInfo.project.name}-final.png`, fullPage: true });
  await page.getByRole("button", { name: "Watch Us Dance", exact: true }).click();
  expect(await page.locator(".motion-preview>svg").evaluate(e => getComputedStyle(e).animationName)).toBe("none");
  await page.keyboard.press("Escape");
  expect(external).toEqual([]);
  expect(errors).toEqual([]);
});
test("schedule is swipeable on touch screens and all days have direct controls", async ({ page }, testInfo) => {
  await schedule(page);
  if (testInfo.project.name === "mobile") {
    await page.locator(".class-list").dispatchEvent("touchstart", { touches: [{ identifier: 0, clientX: 300, clientY: 300 }] });
    await page.locator(".class-list").dispatchEvent("touchend", { changedTouches: [{ identifier: 0, clientX: 100, clientY: 300 }] });
    await expect(page.getByRole("button", { name: "Tue 3", exact: true })).toHaveAttribute("aria-pressed", "true");
    await page.locator(".class-list").dispatchEvent("touchstart", { touches: [{ identifier: 0, clientX: 100, clientY: 300 }] });
    await page.locator(".class-list").dispatchEvent("touchend", { changedTouches: [{ identifier: 0, clientX: 300, clientY: 300 }] });
    await expect(page.getByRole("button", { name: "Mon 2", exact: true })).toHaveAttribute("aria-pressed", "true");
  }
  await page.getByRole("button", { name: "Sun 8", exact: true }).focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("button", { name: "Sun 8", exact: true })).toHaveAttribute("aria-pressed", "true");
});
