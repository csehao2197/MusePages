import { test, expect, type Page, type Locator } from "@playwright/test";

async function openModify(page: Page) {
  if (test.info().project.name === "mobile") await page.getByRole("button", { name: "Modify", exact: true }).click();
}
async function filterScope(page: Page): Promise<Locator> {
  if (test.info().project.name === "mobile") {
    await page.locator(".mobile-bottom").getByRole("button", { name: /Filters/ }).click();
    return page.getByRole("dialog", { name: "Filter your flights" });
  }
  return page.locator(".sidebar .filter-panel");
}
async function closeFilters(page: Page) {
  if (test.info().project.name === "mobile") await page.getByRole("button", { name: /^Show \d+ flights$/ }).click();
}
test.beforeEach(async ({ page }) => { await page.goto("/"); });

test("polished results render locally without overflow or console errors", async ({ page }, testInfo) => {
  const errors: string[] = [];
  const external: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  page.on("request", request => { if (!request.url().startsWith("http://127.0.0.1:3103")) external.push(request.url()); });
  await page.reload();
  await expect(page.getByRole("heading", { name: "A little closer to Tokyo." })).toBeVisible();
  await expect(page.getByTestId("result-count")).toHaveText("247");
  await expect(page.locator(".flight-card")).toHaveCount(10);
  await expect(page.getByTestId("flight-1")).toContainText("$1,784 total");
  await expect(page.locator(".sponsored")).toContainText("$1,190/person");
  await expect(page.locator(".trust-bar")).toContainText("Demo policies");
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: `test-results/render-${testInfo.project.name}.png` });
  await page.screenshot({ path: `test-results/full-${testInfo.project.name}.png`, fullPage: true });
  const widths = await page.evaluate(() => ({ scroll: document.documentElement.scrollWidth, viewport: window.innerWidth }));
  expect(widths.scroll).toBeLessThanOrEqual(widths.viewport);
  expect(errors).toEqual([]);
  expect(external).toEqual([]);
  await page.getByTestId("flight-1").scrollIntoViewIfNeeded();
  await page.screenshot({ path: `test-results/cards-${testInfo.project.name}.png` });
  if (testInfo.project.name === "mobile") {
    await page.setViewportSize({ width: 320, height: 740 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
  }
});

test("combined airline, stops, times and alliance filters support empty and reset", async ({ page }) => {
  const scope = await filterScope(page);
  await scope.getByRole("checkbox", { name: /Nonstop/ }).check();
  await scope.getByRole("checkbox", { name: /All Nippon/ }).check();
  await expect(page.getByTestId("result-count")).toHaveText("2");
  await scope.getByRole("button", { name: /Morning/ }).first().click();
  await expect(page.getByTestId("result-count")).toHaveText("1");
  await scope.getByRole("checkbox", { name: "SkyTeam" }).check();
  await expect(page.getByTestId("result-count")).toHaveText("0");
  await closeFilters(page);
  await expect(page.getByRole("heading", { name: "No flights match this combination." })).toBeVisible();
  await page.getByRole("button", { name: "Reset filters", exact: true }).click();
  await expect(page.getByTestId("result-count")).toHaveText("247");
  await expect(page.locator(".flight-card")).toHaveCount(10);
});

test("price range, duration and layover filters constrain the actual cards", async ({ page }) => {
  const scope = await filterScope(page);
  const maximum = scope.getByRole("slider", { name: "Maximum price" });
  await maximum.fill("950");
  const duration = scope.getByRole("slider", { name: /Up to/ });
  await duration.fill("20");
  await scope.getByRole("button", { name: "ICN", exact: true }).click();
  await expect(page.getByTestId("result-count")).toHaveText("1");
  await closeFilters(page);
  await expect(page.getByTestId("flight-3")).toBeVisible();
  await page.getByTestId("flight-3").getByRole("button", { name: "Flight details" }).click();
  await expect(page.getByTestId("flight-3")).toContainText("Seoul Incheon");
  await expect(page.getByTestId("flight-3")).toContainText("Terminal change T1 → T2");
});

test("sorts, flexible dates, travelers and one-way arithmetic change results", async ({ page }) => {
  await page.getByRole("combobox", { name: "Sort flights" }).selectOption("Cheapest");
  await expect(page.locator(".flight-card").first()).toHaveAttribute("data-testid", "flight-3");
  const prices = await page.locator(".flight-card").evaluateAll(cards => cards.map(card => Number(card.getAttribute("data-price"))));
  expect(prices).toEqual([...prices].sort((a, b) => a - b));
  await page.getByRole("combobox", { name: "Sort flights" }).selectOption("Fastest");
  await expect(page.locator(".flight-card").first()).toHaveAttribute("data-testid", "flight-2");
  await page.getByRole("combobox", { name: "Sort flights" }).selectOption("Latest Departure");
  const departures = await page.locator(".flight-card").evaluateAll(cards => cards.map(card => Number(card.getAttribute("data-departure"))));
  expect(departures).toEqual([...departures].sort((a, b) => b - a));
  await page.getByRole("combobox", { name: "Sort flights" }).selectOption("Best");
  await openModify(page);
  await page.getByRole("combobox", { name: "Travelers", exact: true }).selectOption("3");
  await page.getByRole("button", { name: "Search", exact: true }).click();
  await expect(page.getByTestId("flight-1")).toContainText("$2,676 total");
  await page.locator(".calendar-days").getByRole("button", { name: "Depart Apr 18, $876", exact: true }).click();
  await expect(page.getByTestId("flight-1")).toContainText("$2,628 total");
  await expect(page.locator(".results-summary")).toContainText("Apr 18 – May 2");
  await openModify(page);
  await page.getByRole("button", { name: "One Way", exact: true }).click();
  await page.getByRole("button", { name: "Search", exact: true }).click();
  await expect(page.getByTestId("flight-1")).toContainText("$1,629 total");
  await expect(page.getByTestId("flight-1").locator(".flight-leg")).toHaveCount(1);
  await page.getByRole("button", { name: "Show full month view" }).click();
  await expect(page.locator(".month-grid").getByRole("button")).toHaveCount(30);
});

test("invalid itinerary, swap and multi-city search operate rather than decorate", async ({ page }) => {
  await openModify(page);
  await page.getByLabel("Return", { exact: true }).fill("2026-04-14");
  await page.getByRole("button", { name: "Search", exact: true }).click();
  await expect(page.locator(".search-bar").getByRole("alert")).toContainText("later return or onward date");
  await expect(page.getByTestId("result-count")).toHaveText("247");
  await page.getByLabel("Return", { exact: true }).fill("2026-04-29");
  await page.getByRole("combobox", { name: "To", exact: true }).selectOption("JFK");
  await page.getByRole("button", { name: "Search", exact: true }).click();
  await expect(page.locator(".search-bar").getByRole("alert")).toContainText("different airports");
  await page.getByRole("combobox", { name: "To", exact: true }).selectOption("NRT");
  await page.getByRole("button", { name: "Swap origin and destination" }).click();
  await expect(page.getByRole("combobox", { name: "From", exact: true })).toHaveValue("NRT");
  await expect(page.getByRole("combobox", { name: "To", exact: true })).toHaveValue("JFK");
  await page.getByRole("button", { name: "Multi-City", exact: true }).click();
  await page.getByRole("combobox", { name: "Next destination (from JFK)", exact: true }).selectOption("KIX");
  await page.getByRole("button", { name: "Search", exact: true }).click();
  await expect(page.locator(".results-summary")).toContainText("NRT → JFK → KIX");
  await expect(page.getByTestId("flight-1")).toContainText("ONWARD");
  await expect(page.getByTestId("flight-1").locator(".flight-leg").last()).toContainText("KIX");
});

test("fare comparison, traveler validation, per-leg seats and simulated confirmation", async ({ page }) => {
  const card = page.getByTestId("flight-1");
  await card.getByRole("button", { name: "Select", exact: true }).click();
  await expect(card).toContainText("31″ pitch · 17.2″ width");
  await expect(card.locator(".fare-option").nth(1)).toContainText("$958");
  await expect(card.locator(".fare-option").nth(1)).toContainText("$1,916 total for 2 adults");
  await card.getByRole("button", { name: "Select Economy fare", exact: true }).click();
  const dialog = page.getByRole("dialog", { name: "Make it your journey" });
  await dialog.getByRole("button", { name: "Continue to seats" }).click();
  await expect(dialog.getByRole("alert")).toContainText("every traveler");
  await dialog.getByLabel("First name", { exact: true }).nth(0).fill("Alex");
  await dialog.getByLabel("Last name", { exact: true }).nth(0).fill("Demo");
  await dialog.getByLabel("First name", { exact: true }).nth(1).fill("Sam");
  await dialog.getByLabel("Last name", { exact: true }).nth(1).fill("Demo");
  await dialog.getByLabel("Demo contact email").fill("demo@example.com");
  await dialog.getByRole("button", { name: "Continue to seats" }).click();
  await dialog.getByRole("button", { name: "Review booking" }).click();
  await expect(dialog.getByRole("alert")).toContainText("each flight leg");
  await expect(dialog.getByRole("button", { name: "Seat 21C, unavailable", exact: true })).toBeDisabled();
  await dialog.getByRole("button", { name: "Seat 20A", exact: true }).click();
  await dialog.getByRole("button", { name: "Seat 20B", exact: true }).click();
  await dialog.getByRole("button", { name: "Seat 20D", exact: true }).click();
  await expect(dialog.getByRole("alert")).toContainText("Deselect one");
  await dialog.getByRole("button", { name: "Return · 0/2", exact: true }).click();
  await dialog.getByRole("button", { name: "Seat 20D", exact: true }).click();
  await dialog.getByRole("button", { name: "Seat 20E", exact: true }).click();
  await dialog.getByRole("button", { name: "Review booking" }).click();
  await expect(dialog).toContainText("20A, 20B");
  await expect(dialog).toContainText("20D, 20E");
  await expect(dialog.locator(".review")).toContainText("$1,916");
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(await page.evaluate(() => window.innerWidth));
  await page.screenshot({ path: `test-results/booking-${test.info().project.name}.png` });
  await dialog.getByRole("button", { name: "Confirm simulated booking" }).click();
  await expect(dialog.getByRole("alert")).toContainText("acknowledge");
  await dialog.getByRole("checkbox", { name: /I understand/ }).check();
  await dialog.getByRole("button", { name: "Confirm simulated booking" }).click();
  await expect(page.getByRole("dialog")).toContainText("DEMO-001-2");
  await expect(page.getByRole("dialog")).toContainText("Nothing was charged or sent");
  await page.getByRole("button", { name: "Back to flights" }).click();
  await page.getByRole("button", { name: /My Trips/ }).click();
  await expect(page.getByRole("dialog")).toContainText("Alex Demo & Sam Demo");
  await page.getByRole("button", { name: "Remove local preview" }).click();
  await expect(page.getByRole("dialog")).toContainText("No trips yet");
});

test("basic fare skips paid seats, modal traps focus and Escape restores trigger", async ({ page }) => {
  const card = page.getByTestId("flight-1");
  await card.getByRole("button", { name: "Flight details" }).click();
  const trigger = card.getByRole("button", { name: "Select Basic Economy fare", exact: true });
  await trigger.click();
  await page.keyboard.press("Tab");
  expect(await page.evaluate(() => document.activeElement?.closest("dialog") !== null)).toBe(true);
  await page.keyboard.press("Shift+Tab");
  expect(await page.evaluate(() => document.activeElement?.closest("dialog") !== null)).toBe(true);
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(trigger).toBeFocused();
  await trigger.click();
  const dialog = page.getByRole("dialog");
  for (let i = 0; i < 2; i++) {
    await dialog.getByLabel("First name", { exact: true }).nth(i).fill("Demo");
    await dialog.getByLabel("Last name", { exact: true }).nth(i).fill("Traveler");
  }
  await dialog.getByLabel("Demo contact email").fill("mock@example.com");
  await dialog.getByRole("button", { name: "Continue to seats" }).click();
  await expect(dialog).toContainText("seat assigned at check-in");
  await expect(dialog.getByRole("button", { name: /^Seat / })).toHaveCount(0);
  await dialog.getByRole("button", { name: "Review booking" }).click();
  await expect(dialog.locator(".review")).toContainText("$1,784");
});

test("load more, alerts, alternate routes and local currency controls", async ({ page }) => {
  await page.getByRole("button", { name: "Show 20 more flights" }).click();
  await expect(page.locator(".flight-card")).toHaveCount(30);
  await expect(page.locator(".load-area")).toContainText("Showing 30 of 247 flights");
  await page.getByLabel("Price alert email").fill("invalid");
  await page.getByRole("button", { name: "Set Alert", exact: true }).click();
  await expect(page.locator(".alert-widget").getByRole("alert")).toContainText("valid demo email");
  await page.getByLabel("Price alert email").fill("demo@example.com");
  await page.getByRole("button", { name: "Set Alert", exact: true }).click();
  await expect(page.locator(".alert-widget")).toContainText("No email will be sent");
  await page.locator(".similar-widget").getByRole("button", { name: "JFK HND" }).click();
  await expect(page.locator(".results-summary")).toContainText("JFK → HND");
  await expect(page.getByTestId("flight-1")).toContainText("$940");
  if (test.info().project.name === "desktop") {
    await page.getByRole("combobox", { name: "Currency", exact: true }).selectOption("EUR");
    await expect(page.getByTestId("flight-1")).toContainText("€865");
  } else {
    await page.locator(".mobile-bottom").getByRole("button", { name: "Sort", exact: true }).click();
    await page.getByRole("dialog").getByRole("button", { name: "Cheapest", exact: true }).click();
    await expect(page.locator(".flight-card").first()).toHaveAttribute("data-testid", "flight-3");
  }
});

test("arrival slots and passenger inventory remain combined with airline choices", async ({ page }) => {
  const scope = await filterScope(page);
  await scope.getByRole("checkbox", { name: /Nonstop/ }).check();
  await scope.getByRole("checkbox", { name: /All Nippon/ }).check();
  await scope.getByRole("button", { name: /Afternoon/ }).nth(1).click();
  await expect(page.getByTestId("result-count")).toHaveText("1");
  await closeFilters(page);
  await expect(page.getByTestId("flight-1")).toBeVisible();
  await openModify(page);
  await page.getByRole("combobox", { name: "Travelers", exact: true }).selectOption("6");
  await page.getByRole("button", { name: "Search", exact: true }).click();
  await expect(page.getByTestId("flight-1")).toContainText("$5,352 total");
  await openModify(page);
  await page.getByRole("combobox", { name: "Class", exact: true }).selectOption("Business");
  await page.getByRole("button", { name: "Search", exact: true }).click();
  await expect(page.getByTestId("flight-1")).toContainText("$12,846 total");
});

test("opt-in infinite loading adds inventory and can be turned off", async ({ page }) => {
  await expect(page.locator(".flight-card")).toHaveCount(10);
  await page.getByRole("checkbox", { name: "Load more automatically as I scroll" }).check();
  await page.locator(".load-area").scrollIntoViewIfNeeded();
  await expect.poll(() => page.locator(".flight-card").count()).toBeGreaterThanOrEqual(30);
  await page.getByRole("checkbox", { name: "Load more automatically as I scroll" }).uncheck();
  await expect(page.locator(".skeletons")).toHaveCount(0);
  const count = await page.locator(".flight-card").count();
  await expect(page.locator(".load-area")).toContainText(`Showing ${count} of 247 flights`);
});

test("the sponsored premium fare uses its displayed local bundle price", async ({ page }) => {
  await page.locator(".sponsored").getByRole("button", { name: "View Deal" }).click();
  await expect(page.getByRole("dialog")).toContainText("$2,380");
  await expect(page.getByRole("dialog")).toContainText("Premium Economy");
  await expect(page.getByRole("dialog")).toContainText("No payment, email or ticket");
  await page.keyboard.press("Escape");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.getByRole("dialog")).toHaveCount(0);
  expect(await page.getByTestId("flight-1").evaluate(el => getComputedStyle(el).transitionDuration)).toBe("0s");
});
