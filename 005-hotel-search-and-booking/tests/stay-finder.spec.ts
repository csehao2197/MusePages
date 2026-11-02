import { test, expect, type Page } from "@playwright/test";

async function editSearch(page: Page) {
  const toggle = page.getByRole("button", { name: /Edit search/ });
  if (await toggle.isVisible()) await toggle.click();
}
async function openFilters(page: Page) {
  const mobile = page.getByRole("button", { name: /^Filters/ });
  if (await mobile.isVisible()) { await mobile.click(); return page.getByRole("dialog", { name: "Filter your stay" }); }
  return page.getByRole("complementary", { name: "Hotel filters" });
}
async function closeFilters(page: Page) {
  const dialog = page.getByRole("dialog", { name: "Filter your stay" });
  if (await dialog.isVisible()) await dialog.getByRole("button", { name: /^Show \d+ stays$/ }).click();
}
async function searchSubmit(page: Page) { await page.getByRole("button", { name: "Search", exact: true }).click(); }

test("combinable filters, chips, price ranges, sort, empty state and reset", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByTestId("results-count")).toHaveText("7 hotels found");
  await page.getByLabel("Sort hotels").selectOption("Price: Low to High");
  await expect(page.getByTestId("hotel-card").first()).toHaveAttribute("aria-label", "Circuit Social Hostel");
  let filters = await openFilters(page);
  await filters.getByLabel("Shinjuku", { exact: false }).check();
  await filters.getByLabel("Free Cancellation", { exact: false }).check();
  await closeFilters(page);
  await expect(page.getByTestId("results-count")).toHaveText("1 hotels found");
  await expect(page.getByTestId("hotel-card")).toHaveAttribute("aria-label", "Skyline House Tokyo");
  await page.getByRole("button", { name: "Remove Shinjuku filter" }).click();
  await expect(page.getByTestId("results-count")).toHaveText("6 hotels found");
  filters = await openFilters(page);
  await filters.getByLabel("Maximum nightly price").press("Home");
  await closeFilters(page);
  await expect(page.getByRole("heading", { name: "No stays match this search" })).toBeVisible();
  await page.getByRole("button", { name: "Reset search and filters" }).click();
  await expect(page.getByTestId("results-count")).toHaveText("7 hotels found");
  await page.getByLabel("Sort hotels").selectOption("Guest Rating");
  await expect(page.getByTestId("hotel-card").first()).toHaveAttribute("aria-label", "Sakura Ryokan Tokyo");
  await page.getByLabel("Sort hotels").selectOption("Price: High to Low");
  await expect(page.getByTestId("hotel-card").first()).toHaveAttribute("aria-label", "Sakura Ryokan Tokyo");
  await page.getByLabel("Sort hotels").selectOption("Distance to Center");
  await expect(page.getByTestId("hotel-card").first()).toHaveAttribute("aria-label", "Sakura Ryokan Tokyo");
});

test("search date validation, night/guest/room arithmetic and unsupported destinations", async ({ page }) => {
  await page.goto("/");
  await editSearch(page);
  await page.getByLabel("Check-out", { exact: true }).fill("2026-04-14");
  await searchSubmit(page);
  await expect(page.locator("#search").getByRole("alert")).toHaveText("Check-out must be after check-in.");
  await page.getByLabel("Check-out", { exact: true }).fill("2026-04-17");
  await page.getByRole("button", { name: /2 adults, 0 children/ }).click();
  await page.getByRole("button", { name: "Increase children" }).click();
  await page.getByRole("button", { name: "Increase rooms" }).click();
  await page.getByRole("button", { name: "Done", exact: true }).click();
  await searchSubmit(page);
  await expect(page.locator(".search-summary")).toContainText("3 nights");
  const skyline = page.getByTestId("hotel-card").filter({ has: page.getByRole("heading", { name: "Skyline House Tokyo" }) });
  await expect(skyline).toContainText("$2,472 total for 3 nights · 2 rooms");
  await skyline.getByRole("button", { name: "Book now", exact: true }).click();
  const booking = page.getByRole("dialog");
  await expect(booking.getByTestId("booking-total")).toHaveText("$2,472");
  await expect(booking).toContainText("2 adults, 1 children");
  await booking.getByLabel("Booking room").selectOption("Panorama Suite");
  await expect(booking.getByTestId("booking-total")).toHaveText("$4,080");
  await booking.getByRole("button", { name: "Close dialog" }).click();
  await editSearch(page);
  await page.getByLabel("Destination", { exact: true }).fill("Paris");
  await page.getByLabel("Destination", { exact: true }).press("Tab");
  await searchSubmit(page);
  await expect(page.getByTestId("results-count")).toHaveText("0 hotels found");
  await page.getByRole("button", { name: "Reset search and filters" }).click();
  await editSearch(page);
  await page.getByLabel("Destination", { exact: true }).fill("Tok");
  await page.getByLabel("Destination", { exact: true }).press("ArrowDown");
  await expect(page.getByRole("option", { name: /Tokyo, Japan.*8 illustrated/ })).toBeFocused();
  await page.keyboard.press("Enter");
  await searchSubmit(page);
  await expect(page.getByTestId("results-count")).toHaveText("7 hotels found");
});

test("details, carousel/gallery, room selection, reviews, comparison, saved and recent", async ({ page, isMobile }) => {
  await page.goto("/");
  const skyline = page.getByTestId("hotel-card").first();
  await skyline.getByRole("button", { name: "Next Skyline House Tokyo illustration" }).click();
  await expect(skyline.getByRole("button", { name: "Skyline House Tokyo illustration 2", exact: true })).toHaveAttribute("aria-pressed", "true");
  await skyline.getByRole("button", { name: "Save Skyline House Tokyo", exact: true }).click();
  await skyline.getByRole("checkbox", { name: /Compare Skyline House Tokyo/ }).check();
  await page.getByTestId("hotel-card").nth(1).getByRole("checkbox", { name: /Compare Paper & Pine Ginza/ }).check();
  await page.getByRole("button", { name: "Compare hotels", exact: true }).click();
  let dialog = page.getByRole("dialog");
  await expect(dialog).toContainText("$2,884");
  await expect(dialog).toContainText("$1,386");
  await dialog.getByRole("button", { name: "Close dialog" }).click();
  await page.getByRole("button", { name: "Clear comparison" }).click();
  await skyline.getByRole("button", { name: "View Skyline House Tokyo details", exact: true }).click();
  dialog = page.getByRole("dialog");
  await expect(dialog.getByRole("heading", { name: "Choose your room" })).toBeVisible();
  await expect(dialog).toContainText("Shinjuku Station · 8 min walk");
  await expect(dialog).toContainText("Cleanliness");
  await dialog.getByRole("button", { name: "View all 5 illustrations" }).click();
  await expect(page.getByRole("dialog")).toContainText("1 of 5");
  await page.getByRole("button", { name: "Next gallery illustration" }).click();
  await expect(page.getByRole("dialog")).toContainText("2 of 5");
  await page.getByRole("button", { name: "Close dialog" }).click();
  dialog = page.getByRole("dialog");
  const suite = dialog.locator(".room-row").filter({ has: page.getByRole("heading", { name: "Panorama Suite" }) });
  await suite.getByRole("button", { name: "Select", exact: true }).click();
  await expect(dialog.locator(".detail-booking-bar")).toContainText("$4,760");
  await dialog.getByRole("button", { name: "Read all 6 sample reviews" }).click();
  await expect(dialog.locator(".reviews-grid article")).toHaveCount(6);
  await dialog.getByRole("button", { name: "Reserve now", exact: true }).click();
  await expect(page.getByRole("dialog").getByLabel("Booking room")).toHaveValue("Panorama Suite");
  await page.getByRole("button", { name: "Close dialog" }).click();
  await expect(page.locator(".recent-card")).toHaveCount(1);
  await page.reload();
  await page.getByRole("button", { name: "Saved hotels (1)" }).click();
  await expect(page.getByRole("dialog").getByTestId("hotel-card")).toHaveCount(1);
  await page.getByRole("dialog").getByRole("button", { name: "Unsave Skyline House Tokyo", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Your shortlist starts here" })).toBeVisible();
  await page.getByRole("button", { name: "Close dialog" }).click();
  if (!isMobile) {
    await page.getByRole("button", { name: "Grid view", exact: true }).click();
    await expect(page.locator(".hotel-results")).toHaveClass(/grid-view/);
    await page.getByRole("button", { name: "List view", exact: true }).click();
  }
});

test("map cluster, markers, zoom, satellite, area filtering and pagination", async ({ page }) => {
  await page.goto("/");
  await editSearch(page);
  await page.getByRole("button", { name: /2 adults, 0 children/ }).click();
  await page.getByRole("button", { name: "Increase rooms" }).click();
  await page.getByRole("button", { name: "Done", exact: true }).click();
  await searchSubmit(page);
  await expect(page.getByTestId("results-count")).toHaveText("8 hotels found");
  await page.getByRole("button", { name: "Next page", exact: true }).click();
  await expect(page.getByTestId("hotel-card").first()).toHaveAttribute("aria-label", "River Lantern Asakusa");
  await page.getByRole("button", { name: "Previous page", exact: true }).click();
  await page.getByRole("button", { name: "Load all 8 stays" }).click();
  await expect(page.getByTestId("hotel-card")).toHaveCount(8);
  const mobileMap = page.getByRole("button", { name: "Map", exact: true });
  if (await mobileMap.isVisible()) await mobileMap.click();
  else await page.getByRole("button", { name: "Show map", exact: true }).click();
  const dialog = page.getByRole("dialog");
  await dialog.getByRole("button", { name: "Expand Shinjuku cluster of 2 hotels" }).click();
  await dialog.getByRole("button", { name: "Nest Capsule Shinjuku, $38", exact: true }).click();
  await expect(dialog.locator(".map-mini-card")).toContainText("Nest Capsule Shinjuku");
  await dialog.getByRole("button", { name: "Close map hotel preview" }).click();
  await dialog.getByRole("button", { name: "Garden Terrace Roppongi, $320, sold out" }).click();
  await expect(dialog.locator(".map-mini-card")).toContainText("Sold out in demo");
  await dialog.getByRole("button", { name: "Zoom in", exact: true }).click();
  await expect(dialog.getByLabel("Map zoom")).toHaveText("125%");
  await dialog.getByRole("button", { name: "Satellite style (simulated)", exact: true }).click();
  await expect(dialog.locator(".tokyo-map")).toHaveClass(/satellite/);
  await dialog.getByLabel("Map area", { exact: true }).selectOption("Ginza");
  await dialog.getByRole("button", { name: "Search this area" }).click();
  await expect(dialog.getByRole("button", { name: "Paper & Pine Ginza, $198", exact: true })).toBeVisible();
  await dialog.getByRole("button", { name: "Paper & Pine Ginza, $198", exact: true }).click();
  await dialog.getByRole("button", { name: "View hotel details" }).click();
  await expect(page.getByRole("dialog").getByRole("heading", { name: "Paper & Pine Ginza", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Close dialog" }).click();
  await expect(page.getByTestId("results-count")).toHaveText("1 hotels found");
  await page.getByRole("button", { name: "Map area: Ginza" }).click();
  await expect(page.getByTestId("results-count")).toHaveText("8 hotels found");
});

test("booking validates fictional guest details and confirms only locally", async ({ page }) => {
  const externalRequests: string[] = [];
  page.on("request", request => { if (!request.url().startsWith("http://127.0.0.1:3105")) externalRequests.push(request.url()); });
  await page.goto("/");
  await page.getByTestId("hotel-card").first().getByRole("button", { name: "Book now", exact: true }).click();
  const dialog = page.getByRole("dialog");
  await dialog.getByRole("button", { name: "Confirm demo reservation" }).click();
  await expect(dialog.getByLabel("Guest full name")).toBeFocused();
  expect(await dialog.getByLabel("Guest full name").evaluate(element => (element as HTMLInputElement).validity.valueMissing)).toBe(true);
  await dialog.getByLabel("Guest full name").fill("  ");
  await dialog.getByLabel("Email (for preview only)").fill("alex@example.com");
  await dialog.getByRole("checkbox").check();
  await dialog.getByRole("button", { name: "Confirm demo reservation" }).click();
  await expect(dialog.getByRole("alert")).toHaveText("Enter your full name (at least 2 characters).");
  await dialog.getByLabel("Guest full name").fill("Alex Example");
  await dialog.getByLabel("Email (for preview only)").fill("invalid");
  await dialog.getByRole("button", { name: "Confirm demo reservation" }).click();
  await expect(dialog.getByLabel("Email (for preview only)")).toBeFocused();
  await dialog.getByLabel("Email (for preview only)").fill("alex@example.com");
  await dialog.getByRole("checkbox").uncheck();
  await dialog.getByRole("button", { name: "Confirm demo reservation" }).click();
  await expect(dialog.getByRole("checkbox")).toBeFocused();
  await dialog.getByRole("checkbox").check();
  await dialog.getByRole("button", { name: "Confirm demo reservation" }).click();
  await expect(page.getByRole("heading", { name: "Your demo stay is confirmed." })).toBeVisible();
  await expect(page.getByRole("dialog")).toContainText("$2,884 total");
  await expect(page.getByRole("dialog")).toContainText("Nothing has been booked with a hotel");
  await expect(page.getByRole("dialog")).toContainText("SF-DEMO-");
  await page.getByRole("button", { name: "Back to hotels" }).click();
  expect(externalRequests).toEqual([]);
});

test("capacity, adult-per-room, stay-length, sold-out and currency policies", async ({ page }) => {
  await page.goto("/");
  await editSearch(page);
  await page.getByRole("button", { name: /2 adults, 0 children/ }).click();
  await page.getByRole("button", { name: "Increase rooms" }).click();
  await page.getByRole("button", { name: "Increase rooms" }).click();
  await page.getByRole("button", { name: "Done", exact: true }).click();
  await searchSubmit(page);
  await expect(page.locator("#search").getByRole("alert")).toHaveText("Each room needs at least one adult.");
  await page.getByRole("button", { name: /2 adults, 0 children/ }).click();
  await page.getByRole("button", { name: "Decrease rooms" }).click();
  await page.getByRole("button", { name: "Decrease rooms" }).click();
  await page.getByRole("button", { name: "Increase children" }).click();
  await page.getByRole("button", { name: "Done", exact: true }).click();
  await searchSubmit(page);
  await page.getByTestId("hotel-card").first().getByRole("button", { name: "Book now", exact: true }).click();
  await expect(page.getByRole("dialog").getByRole("button", { name: "Confirm demo reservation" })).toBeDisabled();
  await page.getByRole("dialog").getByLabel("Booking room").selectOption("Panorama Suite");
  await expect(page.getByRole("dialog").getByRole("button", { name: "Confirm demo reservation" })).toBeEnabled();
  await page.getByRole("button", { name: "Close dialog" }).click();
  await page.getByLabel("Currency", { exact: true }).selectOption("JPY");
  await expect(page.getByTestId("hotel-card").first().getByTestId("nightly-price")).toHaveText("¥61,800");
  await editSearch(page);
  await page.getByLabel("Check-out", { exact: true }).fill("2026-05-20");
  await searchSubmit(page);
  await expect(page.locator("#search").getByRole("alert")).toHaveText("Choose a stay of 30 nights or fewer for this demo.");
  await page.getByLabel("Check-out", { exact: true }).fill("2026-04-21");
  await searchSubmit(page);
  await page.getByRole("button", { name: /^Load all/ }).click();
  const soldOut = page.getByTestId("hotel-card").filter({ has: page.getByRole("heading", { name: "Garden Terrace Roppongi" }) });
  await expect(soldOut.getByRole("button", { name: "Unavailable" })).toBeDisabled();
});

test("desktop/mobile renders, keyboard dialog containment, reduced motion and no client errors", async ({ page }, testInfo) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  page.on("console", message => { if (message.type() === "error") errors.push(message.text()); });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Find your kind of Tokyo.");
  await page.screenshot({ path: `${testInfo.outputDir}\\${testInfo.project.name}-results.png`, fullPage: true });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  expect(await page.locator("img").evaluateAll(images => images.every(element => {
    const image = element as HTMLImageElement;
    return image.complete && image.naturalWidth > 0 && !!image.alt;
  }))).toBe(true);
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Skip to hotel results" })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("region", { name: "Hotel results" })).toBeFocused();
  const trigger = page.getByTestId("hotel-card").first().getByRole("button", { name: "View Skyline House Tokyo details" });
  await trigger.click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await page.screenshot({ path: `${testInfo.outputDir}\\${testInfo.project.name}-details.png`, fullPage: true });
  for (let index = 0; index < 8; index++) {
    await page.keyboard.press("Tab");
    expect(await page.evaluate(() => !!document.activeElement?.closest("dialog"))).toBe(true);
  }
  expect(await dialog.evaluate(element => element.scrollWidth <= element.clientWidth + 1)).toBe(true);
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(trigger).toBeFocused();
  expect(errors).toEqual([]);
});
