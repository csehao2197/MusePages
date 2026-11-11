import { test, expect, type Page } from "@playwright/test";

async function openCollection(page: Page) {
  await page.getByRole("button", { name: "View Full Wine List" }).click();
  return page.getByRole("dialog");
}
function nextDay(weekday: number) {
  const d = new Date();
  d.setDate(d.getDate() + ((weekday - d.getDay() + 7) % 7 || 7));
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
}
async function fillPlan(page: Page, guests = "2", date = nextDay(2), time = "19:00") {
  const dialog = page.getByRole("dialog");
  await dialog.getByLabel("Your name", { exact: true }).fill("Demo Guest");
  await dialog.getByLabel("Guests (21+)", { exact: true }).fill(guests);
  await dialog.getByLabel("Date", { exact: true }).fill(date);
  await dialog.getByLabel("Arrival time", { exact: true }).fill(time);
  await dialog.getByRole("checkbox").check();
  return dialog;
}

test.beforeEach(async ({ page }) => { await page.goto("/"); });

test("source sections render with disclosures and no page overflow", async ({ page }, testInfo) => {
  await expect(page.getByRole("heading", { level: 1 })).toContainText("vineyard");
  for (const heading of ["Where Every Glass", "A glass worth", "Private Tastings", "On the calendar", "A place to linger", "Find your", "Join the Vine Club"]) {
    await expect(page.getByRole("heading", { name: new RegExp(heading) }).first()).toBeVisible();
  }
  await expect(page.getByText("No real bookings or purchases.", { exact: false }).first()).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBeTruthy();
  await page.screenshot({ path: `render-${testInfo.project.name}.png`, fullPage: true });
});

test("cellar search, region and style intersect with empty recovery", async ({ page }) => {
  const d = await openCollection(page);
  await expect(d.getByText("7 selections found")).toBeVisible();
  await d.getByLabel("Region", { exact: true }).selectOption("Loire Valley");
  await d.getByLabel("Style", { exact: true }).selectOption("Red");
  await expect(d.getByRole("heading", { name: "No bottles in this corner." })).toBeVisible();
  await d.getByRole("button", { name: "Clear filters" }).click();
  await d.getByLabel("Search the cellar").fill("passionfruit");
  await expect(d.getByRole("heading", { name: /Tideline/ })).toBeVisible();
  await expect(d.getByText("1 selections found")).toBeVisible();
  await d.getByLabel("Search the cellar").fill("");
  await d.getByLabel("Style", { exact: true }).selectOption("Sparkling");
  await expect(d.getByRole("heading", { name: /Le Piccole Stelle/ })).toBeVisible();
});

test("five-pour custom flight pricing, selection limit, save and reset", async ({ page }) => {
  const d = await openCollection(page);
  await expect(d.getByRole("button", { name: "Save flight plan" })).toBeDisabled();
  for (const name of ["Château Clairmont", "Ember Ridge · Blend 389", "Tideline Sauvignon Blanc", "Pietra Alta Barolo", "Domaine de la Lune"]) {
    await d.getByRole("button", { name: `Add ${name} to flight`, exact: true }).click();
  }
  await expect(d.getByText("5 / 5 pours · $57 per guest")).toBeVisible();
  await expect(d.getByRole("button", { name: "Add Rosa del Camino to flight" })).toBeDisabled();
  await d.getByRole("button", { name: "Save flight plan" }).click();
  await expect(d.getByRole("status")).toContainText("No order placed");
  await d.getByRole("button", { name: "Remove Château Clairmont from flight" }).click();
  await expect(d.getByRole("status")).toHaveCount(0);
  await expect(d.getByText("4 / 5 pours · $43 per guest")).toBeVisible();
  await d.getByRole("button", { name: "Reset flight" }).click();
  await expect(d.getByText("0 / 5 pours · $0 per guest")).toBeVisible();
});

test("wine details, quantities and food pairing calculate local plan", async ({ page }) => {
  await page.getByRole("button", { name: "Explore Château Clairmont" }).click();
  const d = page.getByRole("dialog");
  await expect(d.getByRole("heading", { name: "Château Clairmont", exact: true })).toBeVisible();
  await d.getByLabel("Include food pairing").check();
  await d.getByLabel("Glasses in your illustrative plan").fill("3");
  await expect(d.getByText("Plan total: $126")).toBeVisible();
  await d.getByLabel("Glasses in your illustrative plan").fill("7");
  await expect(d.getByRole("button", { name: "Save pairing plan" })).toBeDisabled();
  await d.getByLabel("Glasses in your illustrative plan").fill("0");
  await expect(d.getByRole("button", { name: "Save pairing plan" })).toBeDisabled();
  await d.getByLabel("Glasses in your illustrative plan").fill("2");
  await d.getByRole("button", { name: "Save pairing plan" }).click();
  await expect(d.getByRole("status")).toContainText("No alcohol purchase");
  await d.getByRole("button", { name: "Reset pairing" }).click();
  await expect(d.getByText("Plan total: $28")).toBeVisible();
  await expect(d.getByLabel("Include food pairing")).not.toBeChecked();
  await d.getByRole("button", { name: "Back to wine list" }).click();
  await expect(d.getByRole("heading", { name: "The cellar collection" })).toBeVisible();
});

test("tasting validates required fields, adult declaration and guest bounds", async ({ page }) => {
  await page.getByRole("button", { name: "Book a Tasting", exact: true }).click();
  const d = page.getByRole("dialog");
  await d.getByRole("button", { name: "Confirm local plan" }).click();
  expect(await d.getByLabel("Your name", { exact: true }).evaluate((el: HTMLInputElement) => el.validity.valueMissing)).toBeTruthy();
  await fillPlan(page, "9");
  await d.getByRole("button", { name: "Confirm local plan" }).click();
  expect(await d.getByLabel("Guests (21+)").evaluate((el: HTMLInputElement) => el.validity.rangeOverflow)).toBeTruthy();
  await d.getByLabel("Guests (21+)").fill("1.5");
  expect(await d.getByLabel("Guests (21+)").evaluate((el: HTMLInputElement) => el.validity.stepMismatch)).toBeTruthy();
  await d.getByLabel("Guests (21+)").fill("2");
  await d.getByRole("checkbox").uncheck();
  await d.getByRole("button", { name: "Confirm local plan" }).click();
  expect(await d.getByRole("checkbox").evaluate((el: HTMLInputElement) => el.validity.valueMissing)).toBeTruthy();
  await d.getByRole("checkbox").check();
  await expect(d.getByText("$150", { exact: true })).toBeVisible();
  await d.getByRole("button", { name: "Confirm local plan" }).click();
  await expect(d.getByRole("status")).toContainText("No booking, inquiry, email, or payment was sent");
  await d.getByRole("button", { name: "Plan another visit" }).click();
  await expect(d.getByLabel("Your name", { exact: true })).toHaveValue("");
  await expect(d.getByRole("checkbox")).not.toBeChecked();
});

test("closed days and time errors recover; past and distant dates use native validation", async ({ page }) => {
  await page.getByRole("button", { name: "Book a Tasting", exact: true }).click();
  const d = await fillPlan(page, "2", nextDay(1));
  await d.getByRole("button", { name: "Confirm local plan" }).click();
  await expect(d.getByRole("alert")).toContainText("closed Monday");
  await d.getByLabel("Date", { exact: true }).fill(nextDay(2));
  await d.getByLabel("Arrival time").fill("14:00");
  await d.getByRole("button", { name: "Confirm local plan" }).click();
  await expect(d.getByRole("alert")).toContainText("16:00 and 22:00");
  await d.getByLabel("Arrival time").fill("19:15");
  expect(await d.getByLabel("Arrival time").evaluate((el: HTMLInputElement) => el.validity.stepMismatch)).toBeTruthy();
  await d.getByLabel("Date", { exact: true }).fill("2020-01-01");
  expect(await d.getByLabel("Date", { exact: true }).evaluate((el: HTMLInputElement) => el.validity.rangeUnderflow)).toBeTruthy();
  await d.getByLabel("Date", { exact: true }).fill("2099-01-01");
  expect(await d.getByLabel("Date", { exact: true }).evaluate((el: HTMLInputElement) => el.validity.rangeOverflow)).toBeTruthy();
  await d.getByRole("button", { name: "Reset form" }).click();
  await expect(d.getByRole("alert")).toHaveCount(0);
  await fillPlan(page);
  await d.getByRole("button", { name: "Confirm local plan" }).click();
  await expect(d.getByRole("status")).toContainText("Your evening, imagined");
});

test("private event inquiry enforces 8–24 and illustrative price", async ({ page }) => {
  await page.getByRole("button", { name: "Inquire About Events" }).click();
  const d = await fillPlan(page, "7");
  await d.getByRole("button", { name: "Save event inquiry" }).click();
  expect(await d.getByLabel("Guests (21+)").evaluate((el: HTMLInputElement) => el.validity.rangeUnderflow)).toBeTruthy();
  await d.getByLabel("Guests (21+)").fill("25");
  expect(await d.getByLabel("Guests (21+)").evaluate((el: HTMLInputElement) => el.validity.rangeOverflow)).toBeTruthy();
  await d.getByLabel("Guests (21+)").fill("24");
  await expect(d.getByText("$1800", { exact: true })).toBeVisible();
  await d.getByRole("button", { name: "Save event inquiry" }).click();
  await expect(d.getByRole("status")).toContainText("private tasting inquiry");
});

test("all named events fix date/time and enforce seat capacity and totals", async ({ page }) => {
  for (const [index, capacity, total] of [[0,8,520],[1,12,1020],[2,20,900]]) {
    const card = page.locator(".event-card").nth(index);
    await card.getByRole("button", { name: "Plan a seat" }).click();
    const d = page.getByRole("dialog");
    await expect(d.getByLabel("Date", { exact: true })).toHaveAttribute("readonly", "");
    await expect(d.getByLabel("Arrival time")).toHaveAttribute("readonly", "");
    await d.getByLabel("Your name", { exact: true }).fill("Event Guest");
    await d.getByLabel("Guests (21+)").fill(String(capacity + 1));
    await d.getByRole("checkbox").check();
    await d.getByRole("button", { name: "Confirm local plan" }).click();
    expect(await d.getByLabel("Guests (21+)").evaluate((el: HTMLInputElement) => el.validity.rangeOverflow)).toBeTruthy();
    await d.getByLabel("Guests (21+)").fill(String(capacity));
    await expect(d.getByText(`$${total}`, { exact: true })).toBeVisible();
    await d.getByRole("button", { name: "Confirm local plan" }).click();
    await expect(d.getByRole("status")).toContainText(`${capacity} adults, 21+`);
    await expect(d.getByRole("status")).toContainText("no seats are held");
    await d.getByRole("button", { name: "Close dialog" }).click();
  }
});

test("reservation has no fee and no provider; no persistence after closing", async ({ page }) => {
  await page.getByRole("button", { name: "Plan your visit" }).click();
  const d = await fillPlan(page, "4");
  await expect(d.getByText("$0", { exact: true })).toBeVisible();
  await d.getByRole("button", { name: "Confirm local plan" }).click();
  await expect(d.getByRole("status")).toContainText("table visit");
  await expect(d.getByRole("status")).toContainText("$0 · no reservation fee");
  await d.getByRole("button", { name: "Close dialog" }).click();
  await page.getByRole("button", { name: "Plan your visit" }).click();
  await expect(d.getByLabel("Your name", { exact: true })).toHaveValue("");
});

test("club email and age validation, local confirmation and reset", async ({ page }) => {
  const form = page.locator(".club-form");
  await form.getByRole("button", { name: "Subscribe" }).click();
  expect(await form.getByLabel("Your email address").evaluate((el: HTMLInputElement) => el.validity.valueMissing)).toBeTruthy();
  await form.getByLabel("Your email address").fill("invalid");
  expect(await form.getByLabel("Your email address").evaluate((el: HTMLInputElement) => el.validity.typeMismatch)).toBeTruthy();
  await form.getByLabel("Your email address").fill("demo@example.test");
  await form.getByRole("button", { name: "Subscribe" }).click();
  expect(await form.getByRole("checkbox").evaluate((el: HTMLInputElement) => el.validity.valueMissing)).toBeTruthy();
  await form.getByRole("checkbox").check();
  await form.getByRole("button", { name: "Subscribe" }).click();
  await expect(page.locator(".club-confirm")).toContainText("No email was sent or stored");
  await page.getByRole("button", { name: "Reset subscription" }).click();
  await expect(form.getByLabel("Your email address")).toHaveValue("");
  await expect(form.getByRole("checkbox")).not.toBeChecked();
});

test("gallery keyboard escape, focus return, and lightbox navigation", async ({ page }) => {
  const opener = page.getByRole("button", { name: "View A seat at the counter", exact: true });
  await opener.scrollIntoViewIfNeeded();
  await opener.focus();
  await page.keyboard.press("Enter");
  const d = page.getByRole("dialog");
  await expect(d.getByRole("button", { name: "Close dialog" })).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(d.getByRole("button", { name: "Next gallery image" })).toBeFocused();
  await d.getByRole("button", { name: "Next gallery image" }).click();
  await expect(d.getByRole("heading", { name: "Better together" })).toBeVisible();
  await d.getByRole("button", { name: "Previous gallery image" }).click();
  await expect(d.getByRole("heading", { name: "A seat at the counter" })).toBeVisible();
  await expect(d.locator(".lightbox-controls")).toContainText("1 / 6");
  expect(await d.evaluate(el => el.scrollWidth <= el.clientWidth + 1)).toBeTruthy();
  await page.keyboard.press("Escape");
  await expect(d).not.toBeVisible();
  await expect(opener).toBeFocused();
  expect(await page.evaluate(() => document.body.style.overflow)).toBe("");
});

test("mobile drawer or desktop nav, scroll header, footer CTAs", async ({ page }, testInfo) => {
  if (testInfo.project.name === "mobile") {
    const opener = page.getByRole("button", { name: "Open navigation" });
    await opener.click();
    const d = page.getByRole("dialog");
    await expect(d.getByRole("navigation")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(opener).toBeFocused();
    await opener.click();
    await d.getByRole("link", { name: "Wines", exact: true }).click();
    await expect(d).not.toBeVisible();
  } else {
    await page.getByRole("navigation", { name: "Main navigation" }).getByRole("link", { name: "Wines", exact: true }).click();
  }
  await expect(page.locator(".site-header")).toHaveClass(/solid/);
  await page.locator("footer").getByRole("button", { name: "Gift Cards" }).click();
  await expect(page.getByRole("dialog")).toContainText("No value is issued");
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: "Yelp demo information" }).click();
  await expect(page.getByRole("dialog")).toContainText("not published reviews");
});

test("reduced motion disables autoplay and parallax with manual carousel controls", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.getByRole("button", { name: "Autoplay off · reduced motion" })).toBeDisabled();
  await page.getByRole("button", { name: "Show guest story 2" }).click();
  await expect(page.getByRole("blockquote")).toContainText("anniversary");
  await page.waitForTimeout(5200);
  await expect(page.getByRole("blockquote")).toContainText("anniversary");
  expect(await page.locator(".hero-art").evaluate(el => getComputedStyle(el).transform)).toBe("none");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBeTruthy();
});

test("no browser errors, external service calls or credentials in demo", async ({ page }) => {
  const errors: string[] = [];
  const external: string[] = [];
  page.on("pageerror", e => errors.push(e.message));
  page.on("request", req => { if (!req.url().startsWith("http://127.0.0.1:3118") && !req.url().startsWith("data:")) external.push(req.url()); });
  await page.reload();
  await openCollection(page);
  await page.getByRole("dialog").getByRole("button", { name: "Details & pairing" }).first().click();
  await expect(page.getByRole("dialog").getByText("Fictional cellar label")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.locator('input[autocomplete="cc-number"],input[type="password"],iframe')).toHaveCount(0);
  expect(errors).toEqual([]);
  expect(external).toEqual([]);
});

test("odd-price flight samples retain cents instead of rounding totals", async ({ page }) => {
  const d = await openCollection(page);
  await d.getByRole("button", { name: "Add Le Piccole Stelle to flight" }).click();
  await expect(d.getByText("1 / 5 pours · $9.50 per guest")).toBeVisible();
  await d.getByRole("button", { name: "Add Rosa del Camino to flight" }).click();
  await expect(d.getByText("2 / 5 pours · $17.50 per guest")).toBeVisible();
});

test("Sunday arrival boundaries, whitespace name recovery and form reset", async ({ page }) => {
  await page.getByRole("button", { name: "Plan your visit" }).click();
  const d = await fillPlan(page, "2", nextDay(0), "20:30");
  await d.getByRole("button", { name: "Confirm local plan" }).click();
  await expect(d.getByRole("alert")).toContainText("15:00 and 20:00");
  await d.getByLabel("Arrival time").fill("15:00");
  await d.getByLabel("Your name", { exact: true }).fill("   ");
  await d.getByRole("button", { name: "Confirm local plan" }).click();
  await expect(d.getByRole("alert")).toContainText("enter a name");
  await d.getByRole("button", { name: "Reset form" }).click();
  await expect(d.getByRole("checkbox")).not.toBeChecked();
  await expect(d.getByLabel("Date", { exact: true })).toHaveValue("");
  await fillPlan(page, "2", nextDay(0), "20:00");
  await d.getByRole("button", { name: "Confirm local plan" }).click();
  await expect(d.getByRole("status")).toContainText("20:00");
});

test("stories auto-advance, pause and manual controls; informational footer actions", async ({ page }) => {
  await expect(page.getByRole("button", { name: "Show guest story 1" })).toHaveAttribute("aria-pressed", "true");
  await page.waitForTimeout(5200);
  await expect(page.getByRole("button", { name: "Show guest story 2" })).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "Pause stories", exact: true }).click();
  await page.getByRole("button", { name: "Show guest story 3" }).click();
  await page.waitForTimeout(5200);
  await expect(page.getByRole("blockquote")).toContainText("ambiance");
  await page.locator("footer").getByRole("button", { name: "Careers", exact: true }).click();
  await expect(page.getByRole("dialog")).toContainText("no vacancies");
  await page.keyboard.press("Escape");
  await page.locator("footer").getByRole("button", { name: "Press", exact: true }).click();
  await expect(page.getByRole("dialog")).toContainText("no real awards");
  await page.getByRole("dialog").getByRole("button", { name: "Explore a tasting plan" }).click();
  await expect(page.getByRole("dialog").getByRole("heading", { name: "Book a tasting" })).toBeVisible();
});
