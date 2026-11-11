import { test, expect, type Page } from "@playwright/test";

const future = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
};
async function openSearch(page: Page) {
  const toggle = page.getByRole("button", { name: "Find your next adventure" });
  if (await toggle.isVisible() && await toggle.getAttribute("aria-expanded") === "false") await toggle.click();
}
async function openPlan(page: Page, mobile: boolean) {
  await page.locator(mobile ? ".mobile-bottom" : ".nav-actions").getByRole("button", { name: "Plan My Trip" }).click();
}
async function noOverflow(page: Page) {
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true);
}
const runtimeErrors = new WeakMap<Page, string[]>();
const unwantedRequests = new WeakMap<Page, string[]>();
test.beforeEach(async ({ page }) => {
  const errors: string[] = [], requests: string[] = [];
  runtimeErrors.set(page, errors);
  unwantedRequests.set(page, requests);
  page.on("pageerror", error => errors.push(error.message));
  page.on("request", request => {
    if (request.method() !== "GET" || new URL(request.url()).origin !== "http://127.0.0.1:3106") requests.push(`${request.method()} ${request.url()}`);
  });
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});
test.afterEach(async ({ page }) => {
  expect(runtimeErrors.get(page), "No browser runtime errors").toEqual([]);
  expect(unwantedRequests.get(page), "No external calls or form transmissions").toEqual([]);
});

test("all source-specific sections render with qualified claims and responsive art", async ({ page }, testInfo) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  await expect(page.getByRole("heading", { name: "Popular Destinations", exact: true })).toBeVisible();
  await expect(page.locator(".destination-card")).toHaveCount(4);
  await expect(page.locator(".style-card")).toHaveCount(6);
  await expect(page.locator(".review-card")).toHaveCount(3);
  await expect(page.locator(".blog-card")).toHaveCount(3);
  for (const name of ["How Do You Travel?", "Planning Your Trip Is Easy", "What Our Travelers Say", "Travel Stories & Guides", "Get Exclusive Deals in Your Inbox"]) {
    await expect(page.getByRole("heading", { name, exact: true })).toBeAttached();
  }
  await expect(page.locator(".demo-strip")).toContainText("fictional");
  await expect(page.locator(".trust-disclaimer").first()).toContainText("not real");
  await expect(page.locator(".countdown-card")).toContainText("Simulated countdown");
  await page.locator(".stats").scrollIntoViewIfNeeded();
  await expect(page.locator(".stats").getByText("15,000+", { exact: true })).toBeVisible();
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.evaluate(() => document.fonts.ready);
  await noOverflow(page);
  await page.screenshot({ path: `test-results\\${testInfo.project.name}-hero.png` });
  await page.screenshot({ path: `test-results\\${testInfo.project.name}-home.png`, fullPage: true });
  expect(errors).toEqual([]);
});

test("search filters trips, validates date range, and preserves travelers for inquiry", async ({ page }) => {
  await openSearch(page);
  await page.getByLabel("Search departure date").fill(future(20));
  await page.getByLabel("Search return date").fill(future(19));
  await page.getByRole("button", { name: "Search Trips", exact: true }).click();
  await expect(page.locator(".search-error")).toContainText("Return must be after departure");
  await page.getByLabel("Search return date").fill(future(30));
  await page.getByLabel("Search destination").selectOption("kyoto");
  await page.getByLabel("Search trip style").selectOption("Cultural");
  await page.getByRole("button", { name: "Add traveler" }).click();
  await expect(page.locator(".stepper output")).toHaveText("3 Adults");
  await page.getByRole("button", { name: "Search Trips", exact: true }).click();
  await expect(page.locator(".destination-card")).toHaveCount(1);
  await expect(page.locator(".results-bar")).toContainText("1 journey · Cultural · Kyoto");
  await expect(page.locator(".results-bar")).toContainText("3 travelers");
  await page.getByRole("button", { name: "Explore Kyoto, Japan", exact: true }).click();
  await expect(page.getByRole("dialog")).toHaveAccessibleName("Beyond the Torii Gates");
  await page.getByRole("button", { name: "Plan This Trip" }).click();
  await expect(page.getByLabel("Number of travelers", { exact: true })).toHaveValue("3");
  await expect(page.getByLabel("Departure date", { exact: true })).toHaveValue(future(20));
  await expect(page.getByLabel("Travel style", { exact: true })).toHaveValue("Cultural");
  await noOverflow(page);
});

test("empty search, reset, view-all, and all six styles discover meaningful results", async ({ page }) => {
  await openSearch(page);
  await page.getByLabel("Search destination").selectOption("kyoto");
  await page.getByLabel("Search trip style").selectOption("Beach");
  await page.getByRole("button", { name: "Search Trips", exact: true }).click();
  await expect(page.getByRole("heading", { name: "A different path might be calling." })).toBeVisible();
  await page.getByRole("button", { name: "Explore all trips", exact: true }).click();
  await expect(page.locator(".destination-card")).toHaveCount(8);
  await page.getByRole("button", { name: "Reset filters" }).click();
  await expect(page.locator(".destination-card")).toHaveCount(4);
  for (const [style, count] of [["Beach & Island", 4], ["Adventure", 4], ["Cultural", 3], ["Luxury", 2], ["Family", 3], ["Food & Wine", 4]] as const) {
    await page.getByRole("button", { name: `Discover ${style} trips`, exact: true }).click();
    await expect(page.locator(".destination-card")).toHaveCount(count);
    await expect(page.locator(".results-bar")).toContainText(style === "Beach & Island" ? "Beach" : style);
  }
});

test("wishlist saves locally, survives reload, supports details and removal", async ({ page }) => {
  const save = page.getByRole("button", { name: "Save Santorini", exact: true });
  await save.click();
  await expect(page.getByRole("button", { name: "Unsave Santorini", exact: true })).toHaveAttribute("aria-pressed", "true");
  await page.reload();
  await page.getByRole("button", { name: "Open wishlist, 1 saved trips" }).click();
  await expect(page.getByRole("dialog")).toHaveAccessibleName("Your Wishlist");
  await expect(page.locator(".wishlist-row")).toHaveCount(1);
  await page.locator(".wishlist-row").getByRole("button", { name: /Santorini 7 days/ }).click();
  await expect(page.getByRole("dialog")).toHaveAccessibleName("Aegean Slow Days");
  await page.getByRole("button", { name: "Saved", exact: true }).click();
  await page.getByRole("button", { name: "Close dialog" }).click();
  await page.getByRole("button", { name: "Open wishlist, 0 saved trips" }).click();
  await expect(page.getByRole("heading", { name: "Your next adventure belongs here." })).toBeVisible();
  await page.getByRole("button", { name: "Discover destinations", exact: true }).click();
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await expect(page.locator(".destination-card")).toHaveCount(8);
});

test("wishlist tolerates stale storage and degrades gracefully when saving is blocked", async ({ page }) => {
  await page.evaluate(() => localStorage.setItem("wanderly-favorites", JSON.stringify(["kyoto", "kyoto", "unknown", 9])));
  await page.reload();
  await page.getByRole("button", { name: "Open wishlist, 1 saved trips" }).click();
  await expect(page.locator(".wishlist-row")).toHaveCount(1);
  await expect(page.locator(".wishlist-row")).toContainText("Kyoto");
  await page.getByRole("button", { name: "Close dialog" }).click();
  await page.evaluate(() => { Storage.prototype.setItem = () => { throw new Error("Storage unavailable"); }; });
  await page.getByRole("button", { name: "Save Santorini", exact: true }).click();
  await expect(page.locator(".toast")).toContainText("this visit only");
  await expect(page.getByRole("button", { name: "Unsave Santorini", exact: true })).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "Clear saved preferences", exact: true }).click();
  await expect(page.locator(".toast")).toContainText("cleared");
  expect(await page.evaluate(() => localStorage.getItem("wanderly-favorites"))).toBeNull();
});

test("inquiry validates required, future dates, traveler bounds, budget and acknowledgment", async ({ page }, testInfo) => {
  await openPlan(page, testInfo.project.name === "mobile");
  const modal = page.getByRole("dialog");
  await modal.getByRole("button", { name: "Preview My Inquiry" }).click();
  await expect(modal.getByRole("alert")).toContainText("highlighted");
  await expect(page.getByLabel("Your name", { exact: true })).toBeFocused();
  await page.getByLabel("Your name", { exact: true }).fill("Jamie Traveler");
  await modal.getByLabel("Email address", { exact: true }).fill("invalid");
  await modal.getByLabel("Destination", { exact: true }).selectOption("amalfi");
  await modal.getByLabel("Travel style", { exact: true }).selectOption("Luxury");
  await modal.getByLabel("Departure date", { exact: true }).fill(future(-1));
  await modal.getByLabel("Return date", { exact: true }).fill(future(12));
  await modal.getByLabel("Number of travelers", { exact: true }).fill("13");
  await modal.getByLabel("Budget / person (USD)").fill("100");
  await modal.getByRole("button", { name: "Preview My Inquiry" }).click();
  await expect(modal).toContainText("Enter a valid email");
  await expect(modal).toContainText("Departure must be today or later");
  await expect(modal).toContainText("Choose between 1 and 12 travelers");
  await expect(modal).toContainText("between $500 and $50,000");
  await expect(modal).toContainText("Acknowledge that this is a local preview");
  await page.screenshot({ path: `test-results\\${testInfo.project.name}-inquiry-errors.png` });
  await modal.getByLabel("Email address", { exact: true }).fill("jamie@example.test");
  await modal.getByLabel("Departure date", { exact: true }).fill(future(10));
  await modal.getByLabel("Return date", { exact: true }).fill(future(10));
  await modal.getByLabel("Number of travelers", { exact: true }).fill("2.5");
  await modal.getByLabel("Budget / person (USD)").fill("4000");
  await modal.getByRole("checkbox").check();
  await modal.getByRole("button", { name: "Preview My Inquiry" }).click();
  await expect(modal).toContainText("Return must be after departure");
  await expect(modal).toContainText("Choose between 1 and 12 travelers");
  await modal.getByLabel("Return date", { exact: true }).fill(future(19));
  await modal.getByLabel("Number of travelers", { exact: true }).fill("2");
  await modal.getByRole("button", { name: "Preview My Inquiry" }).click();
  await expect(modal).toHaveAccessibleName("Adventure looks good on you, Jamie.");
  await expect(modal).toContainText("No booking was made and no email was sent.");
  await expect(modal).toContainText("Amalfi Coast");
  await expect(modal).toContainText("$4,000");
  await expect(modal).toContainText("WL-DEMO-");
  await noOverflow(page);
  await page.screenshot({ path: `test-results\\${testInfo.project.name}-inquiry-confirmation.png` });
});

test("Bali trending and weekly deal preselect actual deal journey", async ({ page }) => {
  await page.locator(".trending").getByRole("button", { name: "Bali", exact: true }).click();
  await expect(page.locator(".destination-card")).toHaveCount(1);
  await expect(page.locator(".destination-card")).toContainText("$2,399");
  await page.getByRole("button", { name: "Claim This Deal", exact: true }).click();
  const modal = page.getByRole("dialog");
  await expect(modal).toHaveAccessibleName("Plan your Bali escape");
  await expect(modal.getByLabel("Destination", { exact: true })).toHaveValue("bali");
  await expect(modal.getByLabel("Budget / person (USD)")).toHaveValue("2399");
  await expect(modal).toContainText("not live availability");
  await page.getByRole("button", { name: "Close dialog" }).click();
  await expect(page.getByRole("button", { name: "Claim This Deal", exact: true })).toBeFocused();
});

test("newsletter validates, stores only preference, unsubscribes and handles unavailable storage", async ({ page }) => {
  await page.getByRole("button", { name: "Subscribe", exact: true }).click();
  await expect(page.locator("#newsletter-error")).toContainText("valid email");
  await page.locator("#newsletter-email").fill("explorer@example.test");
  await page.getByRole("button", { name: "Subscribe", exact: true }).click();
  await expect(page.locator(".newsletter-message")).toContainText("no email was sent");
  expect(await page.evaluate(() => localStorage.getItem("wanderly-newsletter"))).toBe("opted-in");
  expect(await page.evaluate(() => JSON.stringify(localStorage))).not.toContain("explorer@example.test");
  await page.reload();
  await expect(page.locator(".newsletter-message")).toContainText("saved in this browser");
  await page.getByRole("button", { name: "Unsubscribe locally" }).click();
  await expect(page.locator(".newsletter-message")).toContainText("removed");
  expect(await page.evaluate(() => localStorage.getItem("wanderly-newsletter"))).toBeNull();
  await page.evaluate(() => { Storage.prototype.setItem = () => { throw new Error("Storage unavailable"); }; });
  await page.locator("#newsletter-email").fill("again@example.test");
  await page.getByRole("button", { name: "Subscribe", exact: true }).click();
  await expect(page.locator(".newsletter-message")).toContainText("Storage is unavailable");
});

test("keyboard modal trap, Escape, focus return, blog content and privacy panel", async ({ page }) => {
  const opener = page.getByRole("button", { name: "Explore Santorini, Greece", exact: true });
  await opener.focus();
  await page.keyboard.press("Enter");
  const modal = page.getByRole("dialog");
  await expect(modal).toBeVisible();
  await expect(page.getByRole("button", { name: "Close dialog" })).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(page.getByRole("button", { name: "Save Trip", exact: true })).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(page.getByRole("button", { name: "Close dialog" })).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(modal).not.toBeVisible();
  await expect(opener).toBeFocused();
  await page.getByRole("button", { name: "Read A Foodie's Guide to Mexico City", exact: true }).click();
  await expect(modal).toHaveAccessibleName("A Foodie's Guide to Mexico City");
  await expect(modal).toContainText("Begin with a neighborhood breakfast");
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: "Privacy", exact: true }).click();
  await expect(modal).toHaveAccessibleName("Privacy");
  await expect(modal).toContainText("no backend");
  await page.keyboard.press("Escape");
});

test("mobile drawer, sticky planning, scroll navigation and narrow overflow", async ({ page }, testInfo) => {
  if (testInfo.project.name === "mobile") {
    await expect(page.locator("#trip-search")).not.toBeVisible();
    await expect(page.locator(".mobile-bottom")).toBeVisible();
    await page.getByRole("button", { name: "Open navigation menu" }).click();
    const drawer = page.getByRole("dialog", { name: "Wanderly." });
    await expect(drawer).toBeVisible();
    await drawer.getByRole("link", { name: "Trip Styles", exact: true }).click();
    await expect(drawer).not.toBeVisible();
    await expect(page.locator("#styles")).toBeInViewport();
    await expect(page.locator(".site-header")).toHaveClass(/scrolled/);
    await page.getByRole("button", { name: "Open navigation menu" }).click();
    await page.keyboard.press("Escape");
    await expect(drawer).not.toBeVisible();
    await expect(page.getByRole("button", { name: "Open navigation menu" })).toBeFocused();
    await page.setViewportSize({ width: 320, height: 720 });
    await page.goto("/");
    await openSearch(page);
    await noOverflow(page);
    await page.getByRole("button", { name: "View All", exact: true }).click();
    const carousel = page.locator(".destination-grid");
    expect(await carousel.evaluate(el => el.scrollWidth > el.clientWidth)).toBe(true);
    await carousel.evaluate(el => el.scrollLeft = el.scrollWidth);
    await noOverflow(page);
  } else {
    await page.getByRole("navigation", { name: "Main navigation" }).getByRole("link", { name: "Deals", exact: true }).click();
    await expect(page.locator("#deals")).toBeInViewport();
    await expect(page.locator(".site-header")).toHaveClass(/scrolled/);
    await page.setViewportSize({ width: 1024, height: 768 });
    await page.goto("/");
    await noOverflow(page);
  }
});
