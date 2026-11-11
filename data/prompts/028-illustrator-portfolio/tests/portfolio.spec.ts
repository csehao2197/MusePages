import { test, expect, type Page } from "@playwright/test";

async function completeInquiry(page: Page) {
  await page.getByLabel("Your name", { exact: true }).fill("Alex Example");
  await page.getByLabel("Email address", { exact: true }).fill("alex@example.test");
  await page.getByLabel("Budget range").selectOption("$3K–5K");
  const date = new Date(Date.now() + 86400000 * 45).toISOString().slice(0, 10);
  await page.getByLabel("Preferred delivery date").fill(date);
  await page.getByLabel("Tell me a little about your project").fill("An illustrated book about the extraordinary life of ordinary trees.");
  await page.getByLabel("I understand this is a fictional demo. No inquiry is sent.").check();
}

test.beforeEach(async ({ page }) => { await page.goto("/"); });

test("art-led landing, responsive render, no overflow or runtime errors", async ({ page }, testInfo) => {
  const errors: string[] = [];
  page.on("pageerror", e => errors.push(e.message));
  await expect(page.getByRole("heading", { name: "Maya Torres", exact: true })).toBeVisible();
  await expect(page.getByRole("img", { name: /An original moonlit garden/ })).toBeVisible();
  await expect(page.locator(".work-card")).toHaveCount(6);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: `test-results\\${testInfo.project.name}-landing.png`, fullPage: true });
  await page.screenshot({ path: `test-results\\${testInfo.project.name}-hero.png` });
  expect(errors).toEqual([]);
});

test("all eighteen works load progressively and filters isolate categories", async ({ page }) => {
  await page.getByRole("button", { name: "Load More" }).click();
  await expect(page.locator(".work-card")).toHaveCount(12);
  await page.getByRole("button", { name: "Load More" }).click();
  await expect(page.locator(".work-card")).toHaveCount(18);
  await expect(page.getByRole("button", { name: "Load More" })).toHaveCount(0);
  for (const [name, count] of [["Editorial", 4], ["Book Covers", 4], ["Branding", 4], ["Personal", 4], ["Motion", 2]] as const) {
    await page.getByRole("button", { name, exact: true }).click();
    await expect(page.locator(".work-card")).toHaveCount(count);
    await expect(page.getByRole("button", { name, exact: true })).toHaveAttribute("aria-pressed", "true");
    const categories = await page.locator(".tile-caption>span").allTextContents();
    expect(categories.every(c => c === name)).toBe(true);
  }
});

test("search empty state and reset restore the initial collection", async ({ page }) => {
  await page.getByRole("textbox", { name: "Search artwork" }).fill("unfindable-moon-potato");
  await expect(page.getByRole("heading", { name: "No stories found (yet)." })).toBeVisible();
  await expect(page.locator(".work-card")).toHaveCount(0);
  await page.getByRole("button", { name: "Reset collection" }).click();
  await expect(page.locator(".work-card")).toHaveCount(6);
  await expect(page.getByRole("textbox", { name: "Search artwork" })).toHaveValue("");
  await page.getByRole("textbox", { name: "Search artwork" }).fill("Dreamscape");
  await expect(page.locator(".work-card")).toHaveCount(1);
  await expect(page.locator(".motion-badge")).toBeVisible();
});

test("project detail carousel, process, keyboard focus trap and escape restore", async ({ page }, testInfo) => {
  const trigger = page.getByRole("button", { name: "View project: Bloomberg Businessweek: AI Issue", exact: true });
  await trigger.click();
  const dialog = page.getByRole("dialog");
  await expect(dialog.getByRole("heading", { name: "Bloomberg Businessweek: AI Issue", exact: true })).toBeVisible();
  await expect(dialog.getByText("Bloomberg · hypothetical brief", { exact: true })).toBeVisible();
  await page.screenshot({ path: `test-results\\${testInfo.project.name}-project.png` });
  await dialog.getByRole("button", { name: "Next artwork view" }).click();
  await expect(dialog.getByText("2 / 3 · A closer look", { exact: true })).toBeVisible();
  await dialog.getByRole("button", { name: "Previous artwork view" }).click();
  await expect(dialog.getByText("1 / 3 · Final illustration", { exact: true })).toBeVisible();
  await expect(dialog.getByRole("heading", { name: "From a small idea to a whole world." })).toBeAttached();
  await dialog.getByRole("button", { name: "Close dialog" }).focus();
  await page.keyboard.press("Shift+Tab");
  expect(await page.evaluate(() => !!document.activeElement?.closest("dialog"))).toBe(true);
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(trigger).toBeFocused();
});

test("touch swipe changes the full-screen mobile project view", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile", "Touch-specific journey");
  await page.getByRole("button", { name: "View project: The Midnight Garden", exact: true }).click();
  await page.locator(".carousel-art").dispatchEvent("touchstart", { changedTouches: [{ identifier: 0, clientX: 300, clientY: 200 }] });
  await page.locator(".carousel-art").dispatchEvent("touchend", { changedTouches: [{ identifier: 0, clientX: 100, clientY: 200 }] });
  await expect(page.getByText("2 / 3 · A closer look", { exact: true })).toBeVisible();
  expect(await page.getByRole("dialog").evaluate(e => Math.abs(e.getBoundingClientRect().width - innerWidth) < 2)).toBe(true);
  expect(await page.locator(".carousel-art").evaluate(e => Math.abs(e.getBoundingClientRect().width - innerWidth) < 2)).toBe(true);
});

test("commission inquiries preselect services and apply licensing arithmetic", async ({ page }) => {
  await page.locator(".service-card").nth(1).getByRole("button", { name: "Inquire", exact: true }).click();
  await expect(page.getByLabel("Project type", { exact: true })).toHaveValue("Book");
  await expect(page.getByLabel("Commission estimate")).toHaveText("$2,000");
  await page.getByLabel("Number of pieces").fill("3");
  await page.getByLabel("Usage license").selectOption("extended");
  await expect(page.getByLabel("Commission estimate")).toHaveText("$9,000");
  await page.getByLabel("Usage license").selectOption("exclusive");
  await expect(page.getByLabel("Commission estimate")).toHaveText("$12,000");
  await page.getByRole("button", { name: "Reset form" }).click();
  await expect(page.getByLabel("Project type", { exact: true })).toHaveValue("Editorial");
  await expect(page.getByLabel("Commission estimate")).toHaveText("$800");
});

test("contact native constraints enforce email, dates, pieces and message length", async ({ page }) => {
  await completeInquiry(page);
  const email = page.getByLabel("Email address", { exact: true });
  await email.fill("not-an-email");
  expect(await email.evaluate((e: HTMLInputElement) => e.validity.typeMismatch)).toBe(true);
  await email.fill("alex@example.test");
  const deadline = page.getByLabel("Preferred delivery date");
  await deadline.fill("2020-01-01");
  expect(await deadline.evaluate((e: HTMLInputElement) => e.validity.rangeUnderflow)).toBe(true);
  await deadline.fill(new Date(Date.now()+86400000*45).toISOString().slice(0,10));
  const pieces = page.getByLabel("Number of pieces");
  await pieces.fill("0");
  expect(await pieces.evaluate((e: HTMLInputElement) => e.validity.rangeUnderflow)).toBe(true);
  await pieces.fill("21");
  expect(await pieces.evaluate((e: HTMLInputElement) => e.validity.rangeOverflow)).toBe(true);
  await pieces.fill("1.5");
  expect(await pieces.evaluate((e: HTMLInputElement) => e.validity.stepMismatch)).toBe(true);
  await pieces.fill("1");
  const message = page.getByLabel("Tell me a little about your project");
  await message.fill("Short");
  await page.getByRole("button", { name: "Send Inquiry", exact: true }).click();
  expect(await message.evaluate((e: HTMLTextAreaElement) => !e.validity.valid)).toBe(true);
  await expect(page.getByRole("heading", { name: "Your idea has a starting point." })).toHaveCount(0);
});

test("contact simulated failure preserves input then confirms and resets", async ({ page }) => {
  await completeInquiry(page);
  await page.getByLabel("Simulate delivery failure (demo testing)").check();
  await page.getByRole("button", { name: "Send Inquiry", exact: true }).click();
  await expect(page.locator("main").getByRole("alert")).toContainText("Demo delivery is unavailable");
  await expect(page.getByLabel("Your name", { exact: true })).toHaveValue("Alex Example");
  await page.getByLabel("Simulate delivery failure (demo testing)").uncheck();
  await page.getByRole("button", { name: "Send Inquiry", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Your idea has a starting point." })).toBeVisible();
  await expect(page.getByRole("status")).toContainText("No message was sent");
  await page.getByRole("button", { name: "Start a new inquiry" }).click();
  await expect(page.getByLabel("Your name", { exact: true })).toHaveValue("");
  await expect(page.getByLabel("Commission estimate")).toHaveText("$800");
});

test("print formats, stock limits, quantity pricing and local confirmation", async ({ page }) => {
  await page.getByRole("button", { name: "View print: The Midnight Garden", exact: true }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog.getByLabel("Print total")).toHaveText("$120");
  await dialog.getByLabel("Print format").selectOption("large");
  await dialog.getByLabel("Quantity", { exact: true }).fill("3");
  await expect(dialog.getByLabel("Print total")).toHaveText("$495");
  await dialog.getByLabel("Quantity", { exact: true }).fill("13");
  await dialog.getByRole("button", { name: "Preview reservation" }).click();
  expect(await dialog.getByLabel("Quantity", { exact: true }).evaluate((e: HTMLInputElement) => e.validity.rangeOverflow)).toBe(true);
  await dialog.getByLabel("Quantity", { exact: true }).fill("0");
  expect(await dialog.getByLabel("Quantity", { exact: true }).evaluate((e: HTMLInputElement) => e.validity.rangeUnderflow)).toBe(true);
  await dialog.getByLabel("Quantity", { exact: true }).fill("3");
  await dialog.getByRole("button", { name: "Preview reservation" }).click();
  await expect(dialog.getByRole("status")).toContainText("3 × A2 · $495");
  await expect(dialog.getByRole("status")).toContainText("No edition was reserved");
  await dialog.getByRole("button", { name: "Reset print preview" }).click();
  await expect(dialog.getByLabel("Print total")).toHaveText("$120");
  await expect(dialog.getByLabel("Quantity", { exact: true })).toHaveValue("1");
});

test("project-to-commission link closes detail and selects correct brief", async ({ page }) => {
  await page.getByRole("button", { name: "View project: Fauna Coffee Branding", exact: true }).click();
  await page.getByRole("button", { name: "Create something like this" }).click();
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await expect(page.getByLabel("Project type", { exact: true })).toHaveValue("Brand");
  await expect(page.getByLabel("Your name", { exact: true })).toBeFocused();
  await expect(page.getByLabel("Commission estimate")).toHaveText("$1,500");
});

test("theme, privacy, concept social profiles and CV download", async ({ page }) => {
  await page.getByRole("button", { name: "Use dark theme" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.getByRole("button", { name: "Use light theme" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await page.getByRole("button", { name: "Privacy Policy", exact: true }).click();
  await expect(page.getByRole("dialog")).toContainText("no backend, cookies, analytics");
  await page.getByRole("button", { name: "Got it" }).click();
  await page.locator("footer").getByRole("button", { name: "Instagram", exact: true }).click();
  await expect(page.getByRole("dialog")).toContainText("No real social profile");
  await page.keyboard.press("Escape");
  const download = page.waitForEvent("download");
  await page.getByRole("link", { name: "Download Full CV" }).click();
  expect((await download).suggestedFilename()).toBe("maya-torres-concept-cv.txt");
});

test("navigation journey, reduced motion and final contact layout", async ({ page }, testInfo) => {
  if (testInfo.project.name === "mobile") {
    await page.getByRole("button", { name: "Open navigation" }).click();
    const nav = page.getByRole("dialog", { name: "Mobile navigation" });
    await expect(nav).toBeVisible();
    await nav.getByRole("link", { name: /Contact/ }).click();
    await expect(nav).not.toBeVisible();
    await page.getByRole("button", { name: "Open navigation" }).click();
    await page.keyboard.press("Escape");
    await expect(nav).not.toBeVisible();
    await expect(page.getByRole("button", { name: "Open navigation" })).toBeFocused();
  } else {
    await page.getByRole("navigation", { name: "Main navigation" }).getByRole("link", { name: "Contact", exact: true }).click();
  }
  await expect(page.getByRole("button", { name: "Send Inquiry", exact: true })).toBeAttached();
  expect(await page.locator(".scroll-indicator").evaluate(e => getComputedStyle(e).animationName)).toBe("none");
  await page.getByRole("button", { name: "Pause quotes" }).click();
  await expect(page.getByRole("button", { name: "Play quotes" })).toBeAttached();
  await page.locator("#contact").scrollIntoViewIfNeeded();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: `test-results\\${testInfo.project.name}-contact.png` });
});

test("narrow phones and tablet gallery layouts stay within the viewport", async ({ page }) => {
  for (const width of [320, 768, 1024]) {
    await page.setViewportSize({ width, height: 900 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await expect(page.getByRole("heading", { name: "Maya Torres", exact: true })).toBeVisible();
    expect(await page.locator(".masonry").evaluate(e => getComputedStyle(e).columnCount)).toBe(width === 320 ? "1" : width === 768 ? "2" : "3");
  }
});
