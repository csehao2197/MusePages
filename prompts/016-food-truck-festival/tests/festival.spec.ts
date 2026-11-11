import { test, expect, type Page } from "@playwright/test";

async function openCheckout(page: Page, label = "Buy Day Pass") {
  await page.getByRole("button", { name: label, exact: true }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  return dialog;
}
async function fillPurchaser(page: Page) {
  const dialog = page.getByRole("dialog");
  await dialog.getByLabel("Purchaser name").fill("Demo Guest");
  await dialog.getByLabel("Email (demo only)").fill("guest@example.com");
  await dialog.getByRole("checkbox", { name: "I understand this is a fictional demo" }).check();
}

test.beforeEach(async ({ page }) => { await page.goto("/"); });

test("food discovery combines cuisine, food, recipe and zone; menu and empty-state recovery", async ({ page }) => {
  const lineup = page.locator("#lineup");
  await lineup.getByRole("button", { name: "Mexican", exact: true }).click();
  await expect(lineup.getByRole("status")).toContainText("1 of 8");
  const opener = lineup.getByRole("button", { name: "Explore Taco Libre menu" });
  await opener.click();
  const dialog = page.getByRole("dialog");
  await expect(dialog.getByRole("heading", { name: "Birria taco trio" })).toBeVisible();
  await expect(dialog).toContainText("Milk; shared wheat preparation");
  await dialog.getByRole("button", { name: "Add truck to my plan" }).click();
  await expect(dialog.getByRole("button", { name: "Remove truck from my plan" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(opener).toBeFocused();
  await lineup.getByLabel("Search trucks and food").fill("lobster");
  await expect(lineup.getByRole("heading", { name: "No bites found" })).toBeVisible();
  await lineup.getByRole("button", { name: "Show all demo trucks" }).click();
  await lineup.getByLabel("Search trucks and food").fill("falafel");
  await expect(lineup.getByRole("status")).toContainText("1 of 8");
  await expect(lineup.getByRole("button", { name: "Naan Stop", exact: true })).toBeVisible();
  await lineup.getByRole("button", { name: "Reset filters" }).click();
  await lineup.getByLabel("Filter dietary recipe").selectOption("Vegan");
  await expect(lineup.getByRole("status")).toContainText("2 of 8");
  await lineup.getByLabel("Filter truck zone").selectOption("C");
  await expect(lineup.getByRole("status")).toContainText("1 of 8");
  await expect(lineup.getByRole("button", { name: "Green Machine", exact: true })).toBeVisible();
});

test("interactive schematic, list view, zoom and genuine PDF download", async ({ page }) => {
  const map = page.locator("#map");
  await map.getByRole("button", { name: "Explore Zone B trucks" }).click();
  await expect(page.locator("#lineup").getByRole("status")).toContainText("3 of 8 demo trucks · Zone B");
  await map.getByLabel("Map zoom").selectOption("2");
  const size = await map.locator(".park-map").evaluate(el => el.getBoundingClientRect().width);
  expect(size).toBeGreaterThan(1300);
  await map.getByRole("button", { name: "Accessible list view" }).click();
  await expect(map.getByRole("heading", { name: "Stages & amenities" })).toBeVisible();
  await map.getByRole("button", { name: "Zone C · East" }).click();
  await expect(page.locator("#lineup").getByRole("status")).toContainText("2 of 8 demo trucks · Zone C");
  const download = page.waitForEvent("download");
  await map.getByRole("link", { name: "Download PDF map" }).click();
  expect((await download).suggestedFilename()).toBe("festival-map.pdf");
  const pdf = await page.request.get("/festival-map.pdf");
  expect(pdf.ok()).toBeTruthy();
  expect((await pdf.body()).subarray(0, 8).toString()).toBe("%PDF-1.4");
});

test("calendar-correct day tabs, keyboard navigation, stage filtering and favorite planning", async ({ page }) => {
  const schedule = page.locator("#schedule");
  await schedule.getByRole("tab", { name: "Saturday" }).click();
  await page.keyboard.press("ArrowRight");
  await expect(schedule.getByRole("tab", { name: "Sunday" })).toBeFocused();
  await expect(schedule.getByRole("tab", { name: "Sunday" })).toHaveAttribute("aria-selected", "true");
  await schedule.getByLabel("Filter schedule stage").selectOption("Main Stage");
  await expect(schedule.getByRole("heading", { name: "Neon Flavor" })).toBeVisible();
  await expect(schedule.getByRole("heading", { name: "Kids cooking demo" })).toHaveCount(0);
  await schedule.getByRole("button", { name: "Save Neon Flavor", exact: true }).click();
  await schedule.getByRole("checkbox", { name: "Only my saved events" }).check();
  await expect(schedule.locator(".timeline article")).toHaveCount(1);
  await schedule.getByRole("tab", { name: "Monday" }).click();
  await expect(schedule.getByRole("heading", { name: "No events on this plate" })).toBeVisible();
  await schedule.getByRole("button", { name: "Show this day’s schedule" }).click();
  await expect(schedule.getByRole("heading", { name: "Rosemary & Thyme" })).toBeVisible();
  await schedule.getByRole("button", { name: "Open my plan" }).click();
  await expect(page.getByRole("dialog")).toContainText("Neon Flavor");
  await expect(page.getByRole("dialog")).toContainText("Sunday · Jul 26 · 7:00 PM");
  await page.getByRole("button", { name: "Clear my plan" }).click();
  await expect(page.getByRole("heading", { name: "Your plate is still empty" })).toBeVisible();
  await page.keyboard.press("Escape");
});

test("ticket type, visit date, quantities, group pricing, confirmation and full reset", async ({ page }) => {
  const dialog = await openCheckout(page, "Buy Weekend Pass");
  await expect(dialog.getByLabel("Visit date")).toBeDisabled();
  await expect(dialog.getByTestId("ticket-total")).toHaveText("$35.00");
  await dialog.getByLabel("Paid passes").fill("8");
  await dialog.getByLabel("Children under 10").fill("2");
  await dialog.getByLabel("Group code").fill("crew20");
  await expect(dialog.getByTestId("ticket-total")).toHaveText("$224.00");
  await fillPurchaser(page);
  await dialog.getByRole("button", { name: "Confirm local demo order" }).click();
  await expect(dialog.getByRole("status")).toContainText("8 × Weekend Pass");
  await expect(dialog.getByRole("status")).toContainText("2 children under 10");
  await expect(dialog.getByRole("status")).toContainText("$224.00");
  await expect(dialog.getByRole("status")).toContainText("No money charged");
  await dialog.getByRole("button", { name: "Start a new demo order" }).click();
  await expect(dialog.getByLabel("Paid passes")).toHaveValue("1");
  await expect(dialog.getByLabel("Purchaser name")).toHaveValue("");
  await dialog.getByLabel("Ticket type").selectOption("vip");
  await dialog.getByLabel("Paid passes").fill("2");
  await expect(dialog.getByTestId("ticket-total")).toHaveText("$178.00");
  await dialog.getByLabel("Ticket type").selectOption("day");
  await expect(dialog.getByLabel("Visit date")).toBeEnabled();
  await expect(dialog.getByLabel("Visit date").locator("option")).toHaveCount(3);
  await dialog.getByLabel("Visit date").selectOption("2026-07-27");
  await fillPurchaser(page);
  await dialog.getByRole("button", { name: "Confirm local demo order" }).click();
  await expect(dialog.getByRole("status")).toContainText("Monday · Jul 27");
  await expect(dialog.getByRole("status")).toContainText("$30.00");
});

test("ticket native validity and invalid promo/date/21+ class recover without lost draft", async ({ page }) => {
  const dialog = await openCheckout(page);
  await fillPurchaser(page);
  const quantity = dialog.getByLabel("Paid passes");
  for (const invalid of ["0", "13", "1.5", ""]) {
    await quantity.fill(invalid);
    expect(await quantity.evaluate((el: HTMLInputElement) => el.checkValidity())).toBeFalsy();
    await dialog.getByRole("button", { name: "Confirm local demo order" }).click();
    await expect(dialog.getByTestId("ticket-total")).toBeVisible();
  }
  await quantity.fill("1");
  const kids = dialog.getByLabel("Children under 10");
  await kids.fill("7");
  expect(await kids.evaluate((el: HTMLInputElement) => el.checkValidity())).toBeFalsy();
  await kids.fill("0");
  const age = dialog.getByLabel("Purchaser age");
  await age.fill("17");
  expect(await age.evaluate((el: HTMLInputElement) => el.validity.rangeUnderflow)).toBeTruthy();
  await age.fill("18");
  await dialog.getByLabel("Email (demo only)").fill("not-an-email");
  expect(await dialog.getByLabel("Email (demo only)").evaluate((el: HTMLInputElement) => el.validity.typeMismatch)).toBeTruthy();
  await dialog.getByLabel("Email (demo only)").fill("guest@example.com");
  await dialog.getByLabel("Group code").fill("BADCODE");
  await dialog.getByRole("button", { name: "Confirm local demo order" }).click();
  await expect(dialog.getByRole("alert")).toContainText("Unknown demo code");
  await dialog.getByLabel("Group code").fill("CREW20");
  await dialog.getByRole("button", { name: "Confirm local demo order" }).click();
  await expect(dialog.getByRole("alert")).toContainText("at least 8");
  await dialog.getByLabel("Group code").fill("");
  await dialog.getByRole("checkbox", { name: "One cocktail masterclass" }).check();
  await age.fill("21");
  await dialog.getByRole("button", { name: "Confirm local demo order" }).click();
  await expect(dialog.getByRole("alert")).toContainText("July 26 entry");
  await dialog.getByLabel("Visit date").selectOption("2026-07-26");
  await age.fill("20");
  await dialog.getByRole("button", { name: "Confirm local demo order" }).click();
  await expect(dialog.getByRole("alert")).toContainText("aged 21+");
  await age.fill("21");
  await expect(dialog.getByTestId("ticket-total")).toHaveText("$30.00");
  await expect(dialog.getByLabel("Purchaser name")).toHaveValue("Demo Guest");
  await dialog.getByRole("button", { name: "Confirm local demo order" }).click();
  await expect(dialog.getByRole("status")).toContainText("One 21+ cocktail class add-on");
  await dialog.getByRole("button", { name: "Start a new demo order" }).click();
  await dialog.getByLabel("Paid passes").fill("5");
  await dialog.getByLabel("Purchaser name").fill("Different Name");
  await dialog.getByRole("button", { name: "Reset selections" }).click();
  await expect(dialog.getByLabel("Paid passes")).toHaveValue("1");
  await expect(dialog.getByLabel("Purchaser name")).toHaveValue("");
});

test("vendor inquiry validates, simulates failure, preserves draft and confirms locally", async ({ page }) => {
  await page.getByRole("button", { name: "Vendor Applications", exact: true }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog.getByLabel("Inquiry topic")).toHaveValue("Vendor application");
  await dialog.getByRole("button", { name: "Preview local inquiry" }).click();
  expect(await dialog.getByLabel("Your name").evaluate((el: HTMLInputElement) => el.validity.valueMissing)).toBeTruthy();
  await dialog.getByLabel("Your name").fill("Demo Vendor");
  await dialog.getByLabel("Your email").fill("vendor@example.com");
  await dialog.getByLabel("Your message").fill("We would love to bring our imaginary falafel truck.");
  await dialog.getByRole("checkbox", { name: "I understand that nothing" }).check();
  await dialog.getByRole("checkbox", { name: "Simulate a submission error" }).check();
  await dialog.getByRole("button", { name: "Preview local inquiry" }).click();
  await expect(dialog.getByRole("alert")).toContainText("Simulated service unavailable");
  await expect(dialog.getByLabel("Your message")).toHaveValue("We would love to bring our imaginary falafel truck.");
  await dialog.getByRole("checkbox", { name: "Simulate a submission error" }).uncheck();
  await dialog.getByRole("button", { name: "Preview local inquiry" }).click();
  await expect(dialog.getByRole("status")).toContainText("Nothing was sent");
  await dialog.getByRole("button", { name: "Create another inquiry" }).click();
  await expect(dialog.getByLabel("Your name")).toHaveValue("");
  await dialog.getByLabel("Your name").fill("Reset Me");
  await dialog.getByRole("button", { name: "Reset form" }).click();
  await expect(dialog.getByLabel("Your name")).toHaveValue("");
  await page.keyboard.press("Escape");
  await page.locator("#sponsors").getByRole("button", { name: "Become a Sponsor" }).click();
  await expect(page.getByRole("dialog").getByLabel("Inquiry topic")).toHaveValue("Sponsor interest");
});

test("newsletter native email, retry, local confirmation, reset; FAQ and audio preview", async ({ page }) => {
  const newsletter = page.locator("#newsletter");
  await newsletter.getByRole("button", { name: "Sign Me Up" }).click();
  expect(await newsletter.getByLabel("Newsletter email").evaluate((el: HTMLInputElement) => el.validity.valueMissing)).toBeTruthy();
  await newsletter.getByLabel("Newsletter email").fill("reader@example.com");
  await newsletter.getByRole("checkbox", { name: "Try a simulated signup error" }).check();
  await newsletter.getByRole("button", { name: "Sign Me Up" }).click();
  await expect(newsletter.getByRole("alert")).toContainText("Simulated signup unavailable");
  await expect(newsletter.getByLabel("Newsletter email")).toHaveValue("reader@example.com");
  await newsletter.getByRole("checkbox", { name: "Try a simulated signup error" }).uncheck();
  await newsletter.getByRole("button", { name: "Sign Me Up" }).click();
  await expect(newsletter.getByRole("status")).toContainText("No email sent or saved");
  await newsletter.getByRole("button", { name: "Reset signup" }).click();
  await expect(newsletter.getByLabel("Newsletter email")).toHaveValue("");
  const question = page.locator("#faq summary").filter({ hasText: "What are the age restrictions?" });
  await question.click();
  await expect(page.locator("#faq details[open]")).toContainText("under-10s free");
  await question.focus(); await page.keyboard.press("Enter");
  await expect(page.locator("#faq details[open]")).toHaveCount(0);
  await page.locator("#soundtrack").getByRole("button", { name: "Try a local preview" }).first().click();
  const dialog = page.getByRole("dialog");
  await dialog.getByRole("button", { name: "Play demo melody" }).click();
  await expect(dialog.getByRole("status")).toContainText("Playing an original local demo melody");
  await dialog.getByRole("button", { name: "Stop demo melody" }).click();
  await expect(dialog.getByRole("status")).toHaveText("Audio stopped.");
  await page.keyboard.press("Escape");
});

test("modal traps keyboard focus and restores opener; mobile yellow navigation works", async ({ page }, testInfo) => {
  const opener = page.getByRole("button", { name: "Privacy", exact: true });
  await opener.click();
  const dialog = page.getByRole("dialog");
  const close = dialog.getByRole("button", { name: "Close dialog" });
  await expect(close).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(dialog.getByRole("button", { name: "Got it" })).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(close).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(opener).toBeFocused();
  if (testInfo.project.name === "mobile") {
    const menu = page.getByRole("button", { name: "Open navigation" });
    await menu.click();
    await expect(page.getByRole("dialog")).toHaveCSS("background-color", "rgb(254, 240, 138)");
    await page.getByRole("dialog").getByRole("link", { name: "Schedule", exact: true }).click();
    await expect(page.getByRole("dialog")).toHaveCount(0);
    await expect(page).toHaveURL(/#schedule/);
    await expect(page.locator(".mobile-ticket-bar")).toBeVisible();
  } else await expect(page.getByRole("button", { name: "Open navigation" })).toBeHidden();
});

test("final responsive renders, reduced motion, overflow and clean local-only runtime", async ({ page }, testInfo) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  page.on("console", message => { if (message.type() === "error") errors.push(message.text()); });
  const external: string[] = [];
  page.on("request", request => { if (!request.url().startsWith("http://127.0.0.1:3116") && !request.url().startsWith("data:")) external.push(request.url()); });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.reload();
  await expect(page.getByRole("heading", { name: "Portland’s biggest" })).toBeVisible();
  await expect(page.locator(".sparkle-one")).toHaveCSS("animation-name", "none");
  await expect(page.locator("html")).toHaveCSS("scroll-behavior", "auto");
  for (const id of ["main", "lineup", "map", "schedule", "tickets", "soundtrack", "faq", "newsletter"]) {
    await page.locator(`#${id}`).scrollIntoViewIfNeeded();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1), `${id} has no document overflow`).toBeTruthy();
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: testInfo.outputPath("festival-full.png"), fullPage: true });
  await page.screenshot({ path: testInfo.outputPath("festival-hero.png") });
  await page.locator("#lineup").scrollIntoViewIfNeeded();
  await page.screenshot({ path: testInfo.outputPath("festival-lineup.png") });
  if (testInfo.project.name === "mobile") {
    await page.setViewportSize({ width: 360, height: 800 });
    await expect(page.locator(".truck-grid")).toHaveCSS("grid-template-columns", /^[0-9.]+px$/);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= 360)).toBeTruthy();
    await page.screenshot({ path: testInfo.outputPath("festival-narrow.png") });
  }
  expect(errors).toEqual([]);
  expect(external).toEqual([]);
});
