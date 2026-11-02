import { test, expect, type Page } from "@playwright/test";

async function open(page: Page) {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1, name: /KVOLT/ })).toBeVisible();
}

async function play(page: Page, title = "Midnight Drive") {
  await page.getByRole("button", { name: `Play ${title}`, exact: true }).click();
  await expect(page.getByRole("button", { name: "Pause preview", exact: true })).toBeVisible();
  await expect.poll(() => page.locator("audio").evaluate((audio: HTMLAudioElement) => !audio.paused && audio.currentTime > 0)).toBe(true);
}

async function fillInquiry(page: Page) {
  await page.getByRole("textbox", { name: "Your name", exact: true }).fill("Demo Artist");
  await page.getByRole("textbox", { name: "Email address", exact: true }).fill("artist@example.test");
  await page.getByRole("combobox", { name: "Your budget", exact: true }).selectOption("$500–$1,000");
  await page.getByRole("textbox", { name: "Tell me about your project" }).fill("An original late-night R&B single with warm vocals.");
}

test("cinematic source sections render without autoplay, requests, or page errors", async ({ page }) => {
  const errors: string[] = [];
  const external: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("request", (request) => { if (!request.url().startsWith("http://127.0.0.1:3129") && !request.url().startsWith("data:")) external.push(request.url()); });
  await open(page);
  await expect(page.locator("audio")).not.toHaveAttribute("src");
  await expect(page.locator(".beat-card")).toHaveCount(6);
  await expect(page.locator(".license-card")).toHaveCount(3);
  await expect(page.locator(".credit")).toHaveCount(6);
  await expect(page.locator(".service-card")).toHaveCount(4);
  await expect(page.getByText("No real artist or label affiliations.", { exact: false })).toBeVisible();
  await expect(page.locator("body")).not.toHaveText(/undefined|NaN/);
  expect(errors).toEqual([]);
  expect(external).toEqual([]);
});

test("genre and search combine, empty state recovers, view all resets filters", async ({ page }) => {
  await open(page);
  await page.getByRole("button", { name: "R&B", exact: true }).click();
  await expect(page.locator(".beat-card")).toHaveCount(3);
  await page.getByRole("textbox", { name: "Search beats" }).fill("blue");
  await expect(page.locator(".beat-card")).toHaveCount(1);
  await expect(page.locator(".track-title")).toHaveText("Blue Room");
  await page.getByRole("textbox", { name: "Search beats" }).fill("missing beat");
  await expect(page.getByRole("heading", { name: "No beats in this mix." })).toBeVisible();
  await page.getByRole("button", { name: "Reset filters" }).click();
  await expect(page.locator(".beat-card")).toHaveCount(6);
  await page.getByRole("button", { name: "Cinematic", exact: true }).click();
  await expect(page.locator(".beat-card")).toHaveCount(1);
  await page.getByRole("link", { name: "View All", exact: true }).click();
  await expect(page.locator(".beat-card")).toHaveCount(6);
});

test("real original preview plays, pauses, seeks, changes volume, and releases", async ({ page }) => {
  await open(page);
  await play(page);
  await expect(page.locator(".track-wave")).toHaveAttribute("aria-label", "Playing preview");
  const seek = page.getByRole("slider", { name: "Seek preview", exact: true });
  await page.getByRole("button", { name: "Pause preview", exact: true }).click();
  await expect.poll(() => page.locator("audio").evaluate((audio: HTMLAudioElement) => audio.paused)).toBe(true);
  const pausedTime = await page.locator("audio").evaluate((audio: HTMLAudioElement) => audio.currentTime);
  await page.waitForTimeout(300);
  expect(await page.locator("audio").evaluate((audio: HTMLAudioElement) => audio.currentTime)).toBeCloseTo(pausedTime, 1);
  await seek.fill("6");
  await expect.poll(() => page.locator("audio").evaluate((audio: HTMLAudioElement) => audio.currentTime)).toBeCloseTo(6, 0);
  await expect(page.getByLabel("Playback position")).toHaveText("0:06");
  await page.getByRole("slider", { name: "Volume", exact: true }).fill("0.25");
  await expect.poll(() => page.locator("audio").evaluate((audio: HTMLAudioElement) => audio.volume)).toBe(.25);
  await expect(page.locator("audio")).toHaveJSProperty("duration", 14);
  await page.getByRole("button", { name: "Play preview", exact: true }).click();
  await expect(page.getByRole("button", { name: "Pause preview", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Close player and stop audio" }).click();
  await expect(page.getByRole("complementary", { name: "Beat player" })).toHaveCount(0);
  await expect(page.locator("audio")).not.toHaveAttribute("src");
  await expect(page.locator("audio")).toHaveJSProperty("paused", true);
});

test("single playlist state: next, previous wrap, filters do not interrupt, ended advances", async ({ page }) => {
  await open(page);
  await play(page);
  await page.getByRole("button", { name: "Previous beat", exact: true }).click();
  await expect(page.locator(".player-track strong")).toHaveText("Blue Room");
  await page.getByRole("button", { name: "Next beat", exact: true }).click();
  await expect(page.locator(".player-track strong")).toHaveText("Midnight Drive");
  await page.getByRole("button", { name: "Next beat", exact: true }).click();
  await expect(page.locator(".player-track strong")).toHaveText("No Signal");
  await page.getByRole("button", { name: "R&B", exact: true }).click();
  await expect(page.locator(".player-track strong")).toHaveText("No Signal");
  await expect(page.locator("audio")).toHaveCount(1);
  await expect.poll(() => page.locator("audio").evaluate((audio: HTMLAudioElement) => audio.duration)).toBe(14);
  await page.getByRole("slider", { name: "Seek preview" }).fill("13.8");
  await expect(page.locator(".player-track strong")).toHaveText("Violet Hour");
  await expect(page.getByRole("button", { name: "Pause preview", exact: true })).toBeVisible();
});

test("missing audio has a retry recovery with coherent player state", async ({ page }) => {
  await page.route("**/audio/midnight-drive.wav", (route) => route.abort());
  await open(page);
  await page.getByRole("button", { name: "Play Midnight Drive", exact: true }).click();
  await expect(page.locator(".audio-error")).toContainText("Preview unavailable");
  await expect(page.getByRole("button", { name: "Play preview", exact: true })).toBeVisible();
  await page.unroute("**/audio/midnight-drive.wav");
  await page.getByRole("button", { name: "Retry preview" }).click();
  await expect(page.locator(".audio-error")).toHaveCount(0);
  await expect.poll(() => page.locator("audio").evaluate((audio: HTMLAudioElement) => !audio.paused)).toBe(true);
  await page.getByRole("button", { name: "Next beat", exact: true }).click();
  await expect(page.locator(".player-track strong")).toHaveText("No Signal");
});

test("track details are a keyboard modal, restore focus, and transfer inquiry selection", async ({ page }) => {
  await open(page);
  const details = page.getByRole("button", { name: "Details for Midnight Drive", exact: true });
  await details.click();
  const dialog = page.getByRole("dialog", { name: "Midnight Drive", exact: true });
  await expect(dialog).toBeVisible();
  await expect(dialog).toContainText("142 BPM");
  await page.keyboard.press("Tab");
  expect(await dialog.evaluate((element) => element.contains(document.activeElement))).toBe(true);
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
  await expect(details).toBeFocused();
  await details.click();
  await page.getByRole("button", { name: "Inquire about license" }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(page.locator(".selection-summary")).toContainText("Midnight Drive");
  await expect(page.getByRole("combobox", { name: "What do you need?", exact: true })).toHaveValue("Beat License");
  await expect(page.getByRole("textbox", { name: "Your name", exact: true })).toBeFocused();
  await page.getByRole("button", { name: "Clear beat selection" }).click();
  await expect(page.locator(".selection-summary")).toHaveCount(0);
});

test("license tiers and each service route to the correct local inquiry", async ({ page }) => {
  await open(page);
  await page.getByRole("button", { name: "Select Premium", exact: true }).click();
  await expect(page.locator(".selection-summary")).toContainText("Premium · $79.99");
  for (const [title, type] of [["Beat Production", "Custom Production"], ["Recording Sessions", "Studio Session"], ["Mixing & Mastering", "Mixing & Mastering"], ["Sync Licensing", "Sync Licensing"]]) {
    await page.locator(".service-card").filter({ has: page.getByRole("heading", { name: title, exact: true }) }).click();
    await expect(page.getByRole("combobox", { name: "What do you need?", exact: true })).toHaveValue(type);
  }
  await page.getByRole("button", { name: "Book a Session", exact: true }).click();
  await expect(page.getByLabel("Preferred session date", { exact: false })).toBeVisible();
});

test("native inquiry validation rejects empty, email, budget, past date, short description, and bad URL", async ({ page }) => {
  await open(page);
  await page.getByRole("button", { name: "Book a Session", exact: true }).click();
  const submit = page.getByRole("button", { name: "Send Message", exact: true });
  await submit.click();
  await expect(page.getByRole("textbox", { name: "Your name", exact: true })).toBeFocused();
  await fillInquiry(page);
  const email = page.getByRole("textbox", { name: "Email address", exact: true });
  await email.fill("not-an-email");
  await submit.click();
  await expect(email).toBeFocused();
  await email.fill("artist@example.test");
  await page.getByRole("combobox", { name: "Your budget", exact: true }).selectOption("");
  await submit.click();
  await expect(page.getByRole("combobox", { name: "Your budget", exact: true })).toBeFocused();
  await page.getByRole("combobox", { name: "Your budget", exact: true }).selectOption("Let's Discuss");
  const date = page.getByLabel("Preferred session date", { exact: false });
  await date.fill("2020-01-01");
  await submit.click();
  expect(await date.evaluate((input: HTMLInputElement) => input.validity.rangeUnderflow)).toBe(true);
  await date.fill("2030-12-01");
  const description = page.getByRole("textbox", { name: "Tell me about your project" });
  await description.fill("too short");
  await submit.click();
  await expect(description).toBeFocused();
  const reference = page.getByRole("textbox", { name: "Reference track URL", exact: false });
  await description.fill("An original late-night R&B single with warm vocals.");
  await reference.fill("not a url");
  await submit.click();
  await expect(reference).toBeFocused();
  await reference.fill("https://example.test/reference");
  await submit.click();
  await expect(page.getByRole("heading", { name: "Your next chapter starts here." })).toBeVisible();
});

test("inquiry timer, error preservation, confirmation, and clean reset are local only", async ({ page }) => {
  const posts: string[] = [];
  page.on("request", (request) => { if (request.method() === "POST") posts.push(request.url()); });
  await open(page);
  await fillInquiry(page);
  await page.getByLabel("Simulate a delivery error", { exact: false }).check();
  await page.getByRole("button", { name: "Send Message", exact: true }).click();
  await expect(page.getByRole("button", { name: "Simulating delivery…" })).toBeDisabled();
  await expect(page.locator(".form-error")).toContainText("Your fields are intact");
  await expect(page.getByRole("textbox", { name: "Your name", exact: true })).toHaveValue("Demo Artist");
  await page.getByLabel("Simulate a delivery error", { exact: false }).uncheck();
  await page.getByRole("button", { name: "Send Message", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Your next chapter starts here." })).toBeVisible();
  await expect(page.locator(".success-panel")).toBeFocused();
  await page.getByRole("button", { name: "Start a new inquiry" }).click();
  await expect(page.getByRole("textbox", { name: "Your name", exact: true })).toHaveValue("");
  await expect(page.getByRole("textbox", { name: "Your name", exact: true })).toBeFocused();
  await expect(page.getByRole("combobox", { name: "Your budget", exact: true })).toHaveValue("");
  await expect(page.getByLabel("Simulate a delivery error", { exact: false })).not.toBeChecked();
  expect(posts).toEqual([]);
});

test("changing the service while a demo submission is pending cancels the old result", async ({ page }) => {
  await open(page);
  await fillInquiry(page);
  await page.clock.install();
  await page.getByRole("button", { name: "Send Message", exact: true }).click();
  await expect(page.getByRole("button", { name: "Simulating delivery…" })).toBeDisabled();
  await expect(page.getByRole("textbox", { name: "Your name", exact: true })).toBeDisabled();
  await page.locator(".service-card").filter({ has: page.getByRole("heading", { name: "Sync Licensing", exact: true }) }).click();
  await page.clock.fastForward(1000);
  await expect(page.getByRole("combobox", { name: "What do you need?", exact: true })).toHaveValue("Sync Licensing");
  await expect(page.getByRole("heading", { name: "Your next chapter starts here." })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Send Message", exact: true })).toBeEnabled();
});

test("credits, fictional social channels, legal notes and newsletter have working feedback", async ({ page }) => {
  await open(page);
  await page.locator(".credit").first().click();
  await expect(page.getByRole("dialog")).toContainText("fictional placement");
  await page.getByRole("button", { name: "Got it", exact: true }).click();
  await page.getByRole("button", { name: "View all credits" }).click();
  await expect(page.getByRole("dialog")).toContainText("LUNE 6");
  await page.keyboard.press("Escape");
  await page.locator("footer").getByRole("button", { name: "Instagram demo channel" }).click();
  await expect(page.getByRole("dialog")).toContainText("not connected to social");
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: "Privacy Policy", exact: true }).click();
  await expect(page.getByRole("dialog")).toContainText("No inquiry data");
  await page.keyboard.press("Escape");
  await page.getByRole("textbox", { name: "Newsletter email" }).fill("demo@example.test");
  await page.getByRole("button", { name: "Subscribe to demo newsletter" }).click();
  await expect(page.getByRole("status").filter({ hasText: "Demo subscribed" })).toBeVisible();
  await page.getByRole("button", { name: "Reset", exact: true }).click();
  await expect(page.getByRole("textbox", { name: "Newsletter email" })).toHaveValue("");
});

test("responsive navigation, keyboard, reduced motion and overflow", async ({ page, isMobile }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await open(page);
  await expect.poll(() => page.locator(".hero-wave i").first().evaluate((element) => getComputedStyle(element).animationName)).toBe("none");
  const sizes = await page.evaluate(() => ({ viewport: window.innerWidth, document: document.documentElement.scrollWidth }));
  expect(sizes.document).toBeLessThanOrEqual(sizes.viewport);
  if (isMobile) {
    await page.getByRole("button", { name: "Open navigation", exact: true }).click();
    const navigation = page.getByRole("dialog", { name: "Mobile navigation" });
    await expect(navigation).toBeVisible();
    await page.keyboard.press("Tab");
    expect(await navigation.evaluate((element) => element.contains(document.activeElement))).toBe(true);
    await page.keyboard.press("Escape");
    await expect(navigation).not.toBeVisible();
    await expect(page.getByRole("button", { name: "Open navigation", exact: true })).toBeFocused();
    await page.getByRole("button", { name: "Open navigation", exact: true }).click();
    await navigation.getByRole("link", { name: "Beats", exact: false }).click();
    await expect(navigation).not.toBeVisible();
  } else {
    await page.getByRole("navigation", { name: "Main navigation" }).getByRole("link", { name: "Beats", exact: true }).click();
  }
  await expect(page.getByRole("heading", { name: "Latest Beats." })).toBeVisible();
  await play(page);
  const playerSizes = await page.evaluate(() => ({ viewport: window.innerWidth, document: document.documentElement.scrollWidth }));
  expect(playerSizes.document).toBeLessThanOrEqual(playerSizes.viewport);
  for (const id of ["licenses", "discography", "about", "clients", "studio", "contact"]) {
    await page.locator(`#${id}`).evaluate((element) => element.scrollIntoView({ block: "start" }));
    const sectionSizes = await page.evaluate(() => ({ viewport: window.innerWidth, document: document.documentElement.scrollWidth }));
    expect(sectionSizes.document, `${id} must not create horizontal page overflow`).toBeLessThanOrEqual(sectionSizes.viewport);
  }
});

test("save inspectable desktop/mobile production renders", async ({ page }, testInfo) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await open(page);
  await page.screenshot({ path: testInfo.outputPath("hero.png"), fullPage: false });
  await page.locator("#beats").evaluate((element) => element.scrollIntoView({ block: "start" }));
  await page.screenshot({ path: testInfo.outputPath("beats.png"), fullPage: false });
  await play(page);
  await page.screenshot({ path: testInfo.outputPath("player.png"), fullPage: false });
  await page.getByRole("button", { name: "Close player and stop audio" }).click();
  await page.locator("#contact").evaluate((element) => element.scrollIntoView({ block: "start" }));
  await page.screenshot({ path: testInfo.outputPath("contact.png"), fullPage: false });
  await page.locator(".contact-panel").evaluate((element) => element.scrollIntoView({ block: "start" }));
  await page.screenshot({ path: testInfo.outputPath("inquiry-form.png"), fullPage: false });
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: testInfo.outputPath("full-page.png"), fullPage: true });
});
