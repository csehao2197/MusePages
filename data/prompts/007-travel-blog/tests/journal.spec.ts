import { test, expect, type Page } from "@playwright/test";

const cards = (page: Page) => page.locator(".story-card");
const reader = (page: Page) => page.getByRole("dialog");
async function openArticle(page: Page, name: string) {
  await page.getByRole("heading", { name, exact: true }).getByRole("button").click();
  await expect(reader(page)).toBeVisible();
  await expect(reader(page).getByRole("heading", { name, exact: true })).toBeVisible();
}
async function noOverflow(page: Page) {
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true);
}
test.beforeEach(async ({ page }) => { await page.goto("/"); await expect(page.getByRole("heading", { level: 1 })).toBeVisible(); });

test("editorial spread, original artwork, nine stories and responsive renders", async ({ page }, testInfo) => {
  const errors: string[] = [];
  page.on("pageerror", e => errors.push(e.message));
  await expect(cards(page)).toHaveCount(9);
  await expect(page.locator(".hero h1")).toContainText("48 Hours in Santorini");
  await expect(page.locator(".demo-line")).toContainText("Sample archive");
  await expect(page.locator(".hero-art")).toBeVisible();
  expect(await page.locator(".hero-art").evaluate((el: HTMLImageElement) => el.naturalWidth)).toBeGreaterThan(0);
  await noOverflow(page);
  await page.screenshot({ path: testInfo.outputPath("home.png"), animations: "disabled" });
  await page.locator("#stories").evaluate(el => el.scrollIntoView({ block: "start", behavior: "instant" }));
  await page.screenshot({ path: testInfo.outputPath("stories.png"), animations: "disabled" });
  await page.locator(".destination").evaluate(el => el.scrollIntoView({ block: "start", behavior: "instant" }));
  await page.screenshot({ path: testInfo.outputPath("portugal.png"), animations: "disabled" });
  for (const selector of [".writer-grid", ".trending", "#newsletter", ".photo-grid", "footer"]) {
    await page.locator(selector).scrollIntoViewIfNeeded();
    await noOverflow(page);
  }
  expect(errors).toEqual([]);
});

test("featured article is readable, keyboard dismissible and restores focus", async ({ page }) => {
  const trigger = page.getByRole("button", { name: "Read Article", exact: true });
  await trigger.click();
  await expect(reader(page)).toBeVisible();
  await expect(reader(page).getByRole("heading", { name: "Day one: trade the queue for a quiet lane" })).toBeVisible();
  await expect(reader(page)).toContainText("not recommend an actual business");
  await expect(reader(page).getByRole("button", { name: "Close dialog" })).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  expect(await reader(page).evaluate(el => el.contains(document.activeElement))).toBe(true);
  await page.keyboard.press("Escape");
  await expect(reader(page)).not.toBeVisible();
  await expect(trigger).toBeFocused();
  await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
});

test("categories, useful search, empty state, sorting and load more", async ({ page }) => {
  await page.getByRole("navigation", { name: "Story categories" }).getByRole("button", { name: "Food & Drink" }).click();
  await expect(cards(page)).toHaveCount(3);
  await page.getByRole("searchbox", { name: "Search the journal" }).fill(" OAXACA ");
  await expect(cards(page)).toHaveCount(1);
  await expect(cards(page).first()).toContainText("Farm to Glass");
  await page.getByRole("searchbox", { name: "Search the journal" }).fill("no-such-place-987");
  await expect(cards(page)).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "No stories on this route" })).toBeVisible();
  await page.getByRole("button", { name: "Explore all stories", exact: true }).click();
  await expect(cards(page)).toHaveCount(9);
  await page.getByRole("button", { name: "Most Popular", exact: true }).click();
  await expect(cards(page).first()).toContainText("How to Fly Business Class");
  await page.getByRole("button", { name: "Load More Stories" }).click();
  await expect(cards(page)).toHaveCount(12);
  await expect(page.getByRole("button", { name: "Load More Stories" })).toHaveCount(0);
  await page.getByRole("searchbox", { name: "Search the journal" }).fill("Sophie");
  await expect(cards(page)).toHaveCount(1);
  await expect(cards(page).first()).toContainText("Ceramics Villages");
});

test("saved reading persists, unsaves from article and handles empty reading list", async ({ page }) => {
  await page.getByRole("button", { name: "Saved reading (0)", exact: true }).click();
  await expect(page.getByRole("heading", { name: "A little inspiration for later" })).toBeVisible();
  await page.getByRole("button", { name: "Explore all stories", exact: true }).click();
  await page.getByRole("button", { name: "Save The Complete Japan Rail Pass Guide for 2026", exact: true }).click();
  await page.reload();
  await expect(page.getByRole("button", { name: "Saved reading (1)", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Saved reading (1)", exact: true }).click();
  await expect(cards(page)).toHaveCount(1);
  await openArticle(page, "The Complete Japan Rail Pass Guide for 2026");
  await expect(reader(page)).toContainText("Seven easy mistakes to avoid");
  await reader(page).getByRole("button", { name: "Saved", exact: true }).click();
  await page.keyboard.press("Escape");
  await expect(cards(page)).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "A little inspiration for later" })).toBeVisible();
});

test("newsletter validates input and acknowledgment without requests or retaining email", async ({ page }) => {
  const requests: string[] = [];
  page.on("request", r => { if (r.method() !== "GET") requests.push(r.url()); });
  await page.locator("#newsletter").scrollIntoViewIfNeeded();
  const email = page.getByRole("textbox", { name: "Your next chapter starts here." });
  const submit = page.locator("#newsletter").getByRole("button", { name: "Subscribe", exact: true });
  await submit.click();
  await expect(page.locator("#newsletter").getByRole("alert")).toContainText("Enter a valid email");
  await expect(email).toBeFocused();
  await email.fill("not-an-email");
  await submit.click();
  await expect(email).toHaveAttribute("aria-invalid", "true");
  await email.fill("reader@example.com");
  await submit.click();
  await expect(page.locator("#newsletter").getByRole("alert")).toContainText("acknowledge");
  const consent = page.getByRole("checkbox", { name: "I understand this is a local demo" });
  await expect(consent).toBeFocused();
  await consent.check();
  await submit.click();
  await expect(page.getByRole("heading", { name: "You’re on the demo list." })).toBeVisible();
  expect(await page.evaluate(() => JSON.stringify(localStorage))).not.toContain("reader@example.com");
  expect(requests).toEqual([]);
  await page.reload();
  await expect(page.getByRole("heading", { name: "You’re on the demo list." })).toBeVisible();
  await page.getByRole("button", { name: "Reset demo signup" }).click();
  await expect(email).toHaveValue("");
  await expect(consent).not.toBeChecked();
});

test("mobile or desktop navigation, Portugal collection and fictional author journeys", async ({ page }, testInfo) => {
  if (testInfo.project.name === "mobile") {
    await page.getByRole("button", { name: "Open navigation" }).click();
    await expect(reader(page)).toBeVisible();
    await expect(reader(page).getByRole("heading", { name: "Where to next?" })).toBeVisible();
    await expect(reader(page).getByRole("navigation")).toContainText("42 sample");
    await reader(page).getByRole("button", { name: "Culture" }).click();
    await expect(reader(page)).not.toBeVisible();
  } else {
    await page.getByRole("navigation", { name: "Main navigation" }).getByRole("button", { name: "Culture", exact: true }).click();
  }
  await expect(cards(page)).toHaveCount(1);
  await expect(cards(page).first()).toContainText("Ceramics Villages");
  await page.getByRole("button", { name: "Explore All Portugal Posts" }).click();
  await expect(cards(page)).toHaveCount(4);
  await expect(page.getByRole("heading", { name: "The Portugal Collection" })).toBeVisible();
  await page.locator(".writer-card").filter({ hasText: "Elena Vasquez" }).getByRole("button", { name: "View All Posts" }).click();
  await expect(cards(page)).toHaveCount(4);
  await expect(page.getByRole("heading", { name: "Stories by Elena Vasquez" })).toBeVisible();
  await page.getByRole("button", { name: "Clear filters", exact: true }).click();
  await expect(cards(page)).toHaveCount(9);
});

test("footer guides, privacy, cookie preferences and photo links are useful local actions", async ({ page }) => {
  await page.getByRole("button", { name: "Privacy Policy", exact: true }).click();
  await expect(reader(page)).toContainText("email address is never stored or sent");
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: "Cookie Settings", exact: true }).click();
  await reader(page).getByRole("radio", { name: "Remember this demo preference locally" }).check();
  await reader(page).getByRole("button", { name: "Save preference" }).click();
  await expect(reader(page).getByRole("status")).toContainText("No trackers are enabled");
  await page.keyboard.press("Escape");
  await page.reload();
  await page.getByRole("button", { name: "Cookie Settings", exact: true }).click();
  await expect(reader(page).getByRole("radio", { name: "Remember this demo preference locally" })).toBeChecked();
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: "Flight Deals", exact: true }).click();
  await expect(reader(page)).toContainText("no live deal feed");
  await reader(page).getByRole("button", { name: "Read the travel-hacking guide" }).click();
  await expect(reader(page)).toContainText("Points are not free money");
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: "Explore Kyoto, Japan", exact: true }).click();
  await expect(reader(page)).toContainText("Start with the journey, not the pass");
});

test("keyboard search, reduced motion, corrupt local data and narrow overflow safety", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator(".scroll-cue svg")).toHaveCSS("animation-name", "none");
  await page.getByRole("button", { name: "Search stories", exact: true }).focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("searchbox", { name: "Search the journal" })).toBeFocused();
  await page.keyboard.type("Jordan");
  await expect(cards(page)).toHaveCount(1);
  await noOverflow(page);
  await page.evaluate(() => { localStorage.setItem("wc-saved", '["unknown",123,"jordan"]'); });
  await page.reload();
  await expect(page.getByRole("button", { name: "Saved reading (1)", exact: true })).toBeVisible();
  await page.setViewportSize({ width: 320, height: 800 });
  await noOverflow(page);
  await page.locator("#newsletter").scrollIntoViewIfNeeded();
  await noOverflow(page);
  await page.locator("footer").scrollIntoViewIfNeeded();
  await page.getByRole("button", { name: "Back to top", exact: true }).click();
  await expect(page.locator(".masthead .brand")).toBeFocused();
  expect(await page.evaluate(() => window.scrollY)).toBeLessThan(5);
});
