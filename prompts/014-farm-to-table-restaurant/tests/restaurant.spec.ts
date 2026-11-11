import { test, expect, type Page, type Locator } from "@playwright/test";

function futureDay(day: number) {
  const date = new Date(); date.setDate(date.getDate() + 2);
  while (date.getDay() !== day) date.setDate(date.getDate() + 1);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
async function contact(scope: Locator) {
  await scope.getByLabel("Name", { exact: true }).fill("Demo Guest");
  await scope.getByLabel("Email", { exact: true }).fill("guest@example.com");
  await scope.getByLabel("Phone", { exact: true }).fill("555 123 4567");
}
async function course(page: Page, name: string, mobile: boolean) {
  if (mobile) await page.getByRole("combobox", { name: "Menu course", exact: true }).selectOption(name);
  else await page.getByRole("tab", { name, exact: true }).click();
}
test.beforeEach(async ({ page }) => { await page.goto("/"); });

test("source spring courses, dietary empty recovery, full menu and summer adaptation", async ({ page, isMobile }) => {
  await page.getByRole("link", { name: "View Today's Menu", exact: true }).click();
  await expect(page.locator(".dish-row")).toHaveCount(4);
  await expect(page.locator(".dish-row").first()).toContainText("Heirloom Tomato Gazpacho");
  await expect(page.locator(".dish-row").first()).toContainText("$14");
  await course(page, "Mains", isMobile);
  await expect(page.locator(".dish-row")).toHaveCount(4);
  await expect(page.locator(".dish-row")).toContainText(["Pan-Seared Trout", "Grass-Fed Ribeye", "Wild Mushroom Risotto", "Heritage Pork Chop"]);
  await page.getByLabel("Dietary preference").selectOption("Vegetarian");
  await expect(page.locator(".dish-row")).toHaveCount(1);
  await page.getByRole("button", { name: /Wild Mushroom Risotto/ }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toContainText("Milk");
  await expect(dialog).toContainText("Blue Ridge Creamery");
  await expect(dialog).toContainText("Not dietary or allergen advice");
  await page.keyboard.press("Escape");
  await expect(page.getByRole("button", { name: /Wild Mushroom Risotto/ })).toBeFocused();
  await course(page, "Desserts", isMobile);
  await page.getByLabel("Dietary preference").selectOption("Plant-based");
  await expect(page.getByRole("status").filter({ hasText: "No dishes in this patch" })).toBeVisible();
  await page.getByRole("button", { name: "Reset menu filters" }).click();
  await expect(page.locator(".dish-row")).toHaveCount(4);
  await page.getByRole("button", { name: "View Full Menu" }).click();
  await expect(page.locator(".dish-row")).toHaveCount(11);
  await expect(page.locator(".dish-row").last()).toContainText("Dark Chocolate Torte");
  await page.getByLabel("Explore a season").selectOption("Summer 2026");
  await expect(page.locator(".dish-row")).toHaveCount(1);
  await expect(page.locator(".dish-row")).toContainText(["Garden Tomato & Melon"]);
  await course(page, "Mains", isMobile);
  await expect(page.locator(".dish-row")).toContainText(["Ember-Roasted Sweet Corn"]);
});

test("farm profiles reveal specific practices and qualified credentials", async ({ page }) => {
  await page.locator(".farm-card").first().getByRole("button", { name: "Learn More" }).click();
  await expect(page.getByRole("dialog")).toContainText("Seasonal crop rotation");
  await expect(page.getByRole("dialog")).toContainText("No organic");
  await page.getByRole("button", { name: "Close dialog" }).click();
  await expect(page.locator(".farm-card").first().getByRole("button")).toBeFocused();
  await page.locator(".farm-card").nth(1).getByRole("button").click();
  await expect(page.getByRole("dialog")).toContainText("Returnable delivery containers");
  await page.keyboard.press("Escape");
  await page.locator(".farm-card").nth(2).getByRole("button").click();
  await expect(page.getByRole("dialog")).toContainText("Whole-animal menu planning");
  await page.keyboard.press("Escape");
  await expect(page.locator(".chef-copy")).toContainText("Fictional credentials");
});

test("table form native validation, Monday closure, full sitting and confirmation reset", async ({ page }) => {
  const form = page.locator(".reservation-form");
  await page.locator("#reservations").scrollIntoViewIfNeeded();
  await form.getByRole("button", { name: "Book Now" }).click();
  expect(await form.getByLabel("Date", { exact: true }).evaluate((e: HTMLInputElement) => e.validity.valueMissing)).toBe(true);
  await form.getByLabel("Date", { exact: true }).fill("2020-01-01");
  expect(await form.getByLabel("Date", { exact: true }).evaluate((e: HTMLInputElement) => e.validity.rangeUnderflow)).toBe(true);
  await form.getByLabel("Date", { exact: true }).fill(futureDay(1));
  await form.getByRole("combobox", { name: "Time", exact: true }).selectOption("18:00");
  await contact(form);
  await form.getByRole("button", { name: "Book Now" }).click();
  await expect(form.getByRole("alert")).toContainText("rests on Mondays");
  await form.getByLabel("Date", { exact: true }).fill(futureDay(2));
  await expect(form.getByRole("combobox", { name: "Time", exact: true })).toHaveValue("");
  await form.getByRole("combobox", { name: "Time", exact: true }).selectOption("19:00");
  await form.getByRole("button", { name: "Book Now" }).click();
  await expect(form.getByRole("alert")).toContainText("sitting is full");
  await form.getByLabel("Phone", { exact: true }).fill("abc");
  expect(await form.getByLabel("Phone", { exact: true }).evaluate((e: HTMLInputElement) => e.validity.patternMismatch)).toBe(true);
  await form.getByLabel("Phone", { exact: true }).fill("555 123 4567");
  await form.getByRole("combobox", { name: "Time", exact: true }).selectOption("19:30");
  await form.getByLabel("Party Size").selectOption("12");
  await form.getByLabel("Special Requests").fill("A step-free table, please.");
  await form.getByRole("button", { name: "Book Now" }).click();
  await expect(page.locator(".confirmation")).toContainText("12 guests");
  await expect(page.locator(".confirmation")).toContainText("7:30 PM");
  await expect(page.locator(".confirmation")).toContainText("A step-free table");
  await expect(page.locator(".confirmation")).toContainText("This is not a reservation");
  await expect(page.locator(".confirmation")).toBeFocused();
  await page.getByRole("button", { name: "Plan another visit" }).click();
  await expect(form.getByLabel("Date", { exact: true })).toHaveValue("");
  await expect(form.getByLabel("Name", { exact: true })).toHaveValue("");
  await expect(form.getByLabel("Date", { exact: true })).toBeFocused();
});

test("Sunday brunch slots, guest lower bound and tampered capacity/time rejection", async ({ page }) => {
  const form = page.locator(".reservation-form");
  await form.getByLabel("Date", { exact: true }).fill(futureDay(0));
  await expect(form).toContainText("Sunday public service is brunch");
  expect(await form.getByRole("combobox", { name: "Time", exact: true }).evaluate((select: HTMLSelectElement) => select.options.length)).toBe(9);
  await form.getByRole("combobox", { name: "Time", exact: true }).selectOption("10:30");
  await contact(form);
  await form.getByLabel("Party Size").evaluate((select: HTMLSelectElement) => { select.add(new Option("13 guests", "13")); select.value = "13"; });
  await form.getByRole("button", { name: "Book Now" }).click();
  await expect(form.getByRole("alert")).toContainText("1–12 guests");
  await form.getByLabel("Party Size").selectOption("1");
  await form.getByRole("combobox", { name: "Time", exact: true }).evaluate((select: HTMLSelectElement) => select.add(new Option("Invalid dinner", "18:00")));
  await form.getByRole("combobox", { name: "Time", exact: true }).selectOption("18:00");
  await form.getByRole("button", { name: "Book Now" }).click();
  await expect(form.getByRole("alert")).toContainText("available time");
  await form.getByRole("combobox", { name: "Time", exact: true }).selectOption("13:30");
  await form.getByRole("button", { name: "Book Now" }).click();
  await expect(page.locator(".confirmation")).toContainText("1 guest");
  await expect(page.locator(".confirmation")).toContainText("1:30 PM");
});

test("archived farm dinner handles native bounds, remaining capacity and local total", async ({ page }) => {
  const trigger = page.getByRole("button", { name: "Reserve Your Spot", exact: true });
  await trigger.click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toContainText("Archived event replay");
  await expect(dialog).toContainText("April 18, 2026");
  await contact(dialog);
  await dialog.getByLabel("Dinner guests").fill("13");
  expect(await dialog.getByLabel("Dinner guests").evaluate((e: HTMLInputElement) => e.validity.rangeOverflow)).toBe(true);
  await dialog.getByLabel("Dinner guests").fill("0");
  expect(await dialog.getByLabel("Dinner guests").evaluate((e: HTMLInputElement) => e.validity.rangeUnderflow)).toBe(true);
  await dialog.getByLabel("Dinner guests").fill("9");
  await dialog.getByRole("button", { name: "Preview My Farm Dinner" }).click();
  await expect(dialog.getByRole("alert")).toContainText("Only 8 demo places");
  await dialog.getByLabel("Dinner guests").fill("8");
  await dialog.getByRole("button", { name: "Preview My Farm Dinner" }).click();
  await expect(dialog.getByRole("status")).toContainText("$1000");
  await expect(dialog.getByRole("status")).toContainText("No seats are held");
  await dialog.getByRole("button", { name: "Start another farm dinner preview" }).click();
  await expect(dialog.getByLabel("Name", { exact: true })).toHaveValue("");
  await expect(dialog.getByLabel("Dinner guests")).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();
});

test("private inquiry rejects excess capacity and Monday, supports Sunday evening and reset", async ({ page }) => {
  await page.getByRole("button", { name: "Inquire Now" }).click();
  const dialog = page.getByRole("dialog");
  await dialog.getByLabel("Event date").fill(futureDay(1));
  await dialog.getByLabel("Evening time").selectOption("18:30");
  await dialog.getByLabel("Event guests").fill("25");
  await contact(dialog);
  await dialog.getByLabel("Your occasion").fill("A family anniversary with an accessible entrance.");
  await dialog.getByRole("button", { name: "Preview My Inquiry" }).click();
  expect(await dialog.getByLabel("Event guests").evaluate((e: HTMLInputElement) => e.validity.rangeOverflow)).toBe(true);
  await dialog.getByLabel("Event guests").fill("24");
  await dialog.getByRole("button", { name: "Preview My Inquiry" }).click();
  await expect(dialog.getByRole("alert")).toContainText("Tuesday–Sunday");
  await dialog.getByLabel("Event date").fill(futureDay(0));
  await dialog.getByRole("button", { name: "Preview My Inquiry" }).click();
  await expect(dialog.getByRole("status")).toContainText("24 guests");
  await expect(dialog.getByRole("status")).toContainText("6:30 PM");
  await expect(dialog.getByRole("status")).toContainText("family anniversary");
  await expect(dialog.getByRole("status")).toContainText("No reservation or inquiry was sent");
  await dialog.getByRole("button", { name: "Start another inquiry" }).click();
  await expect(dialog.getByLabel("Event date")).toHaveValue("");
  await expect(dialog.getByLabel("Your occasion")).toHaveValue("");
  await page.keyboard.press("Escape");
});

test("lightbox navigation wraps, traps focus, Escape restores trigger", async ({ page }) => {
  const trigger = page.getByRole("button", { name: "Open gallery: A little spring on a plate" });
  await trigger.click();
  const dialog = page.getByRole("dialog");
  await expect(dialog.getByRole("button", { name: "Close dialog" })).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(dialog.getByRole("button", { name: "Next image" })).toBeFocused();
  await dialog.getByRole("button", { name: "Previous image" }).click();
  await expect(dialog).toContainText("6 / 6");
  await page.keyboard.press("ArrowRight");
  await expect(dialog).toContainText("1 / 6");
  await page.keyboard.press("ArrowRight");
  await expect(dialog.getByRole("heading")).toHaveText("The farmhouse dining room");
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(trigger).toBeFocused();
});

test("newsletter validation and retry; social and contact controls remain local", async ({ page }) => {
  const form = page.locator(".newsletter-form");
  await form.getByRole("button", { name: "Subscribe" }).click();
  expect(await form.getByLabel("Your email address").evaluate((e: HTMLInputElement) => e.validity.valueMissing)).toBe(true);
  await form.getByLabel("Your email address").fill("demo@host");
  await form.getByRole("button", { name: "Subscribe" }).click();
  await expect(form.getByRole("alert")).toContainText("complete email");
  await form.getByLabel("Your email address").fill("demo@example.com");
  await form.getByRole("button", { name: "Subscribe" }).click();
  await expect(form.getByRole("status")).toContainText("No email was sent or stored");
  await form.getByRole("button", { name: "Try another email" }).click();
  await expect(form.getByLabel("Your email address")).toHaveValue("");
  await page.getByRole("button", { name: "Preview Instagram information" }).click();
  await expect(page.getByRole("dialog")).toContainText("no connected profile");
  await page.getByRole("button", { name: "Preview a private inquiry" }).click();
  await expect(page.getByRole("dialog")).toContainText("Plan Your Private Gathering");
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: "hello@harvestandhearth.com" }).click();
  await expect(page.getByRole("dialog")).toContainText("No calls, emails, external maps");
  await page.keyboard.press("Escape");
});

test("responsive navigation, keyboard menu and gallery scrolling have no document overflow", async ({ page, isMobile }) => {
  if (isMobile) {
    await page.getByRole("button", { name: "Open navigation" }).click();
    await expect(page.getByRole("navigation")).toBeVisible();
    await page.getByRole("navigation").getByRole("link", { name: "Our farms" }).focus();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("button", { name: "Open navigation" })).toBeFocused();
    await page.getByRole("button", { name: "Open navigation" }).click();
    await page.getByRole("navigation").getByRole("link", { name: "Our farms" }).click();
    await expect(page.getByRole("navigation")).not.toBeVisible();
    await expect(page.locator(".mobile-reserve")).toBeVisible();
    await page.locator(".gallery-grid").evaluate(e => e.scrollTo({ left: e.scrollWidth, behavior: "instant" }));
    expect(await page.locator(".gallery-grid").evaluate(e => e.scrollLeft)).toBeGreaterThan(100);
    await page.setViewportSize({ width: 320, height: 760 });
  } else {
    await page.getByRole("tab", { name: "Starters" }).focus();
    await page.keyboard.press("ArrowRight");
    await expect(page.getByRole("tab", { name: "Mains" })).toBeFocused();
    await expect(page.getByRole("tab", { name: "Mains" })).toHaveAttribute("aria-selected", "true");
    await page.keyboard.press("End");
    await expect(page.getByRole("tab", { name: "Desserts" })).toBeFocused();
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});

test("reduced motion stops animation and testimonial advance; dot control works", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.reload();
  expect(await page.locator(".scroll-cue svg").evaluate(e => getComputedStyle(e).animationName)).toBe("none");
  await page.waitForTimeout(6300);
  await expect(page.locator(".review-by")).toContainText("Sarah M.");
  await page.getByRole("button", { name: "Show guest story 3" }).click();
  await expect(page.locator(".review-by")).toContainText("Devon R.");
  await expect(page.locator(".reviews")).toContainText("not genuine reviews");
});

test("guest stories auto-advance and explicit pause survives pointer exit", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.reload();
  await page.waitForTimeout(6300);
  await expect(page.locator(".review-by")).toContainText("James & Lina T.");
  await page.getByRole("button", { name: "Pause rotation" }).click();
  await expect(page.getByRole("button", { name: "Resume rotation" })).toBeVisible();
  await page.locator("#newsletter-email").focus();
  await page.mouse.move(0, 0);
  await page.waitForTimeout(6300);
  await expect(page.locator(".review-by")).toContainText("James & Lina T.");
  await page.getByRole("button", { name: "Show guest story 1" }).click();
  await expect(page.locator(".review-by")).toContainText("Sarah M.");
});

test("renders final desktop/mobile screenshot with no browser or external request errors", async ({ page }, testInfo) => {
  const errors: string[] = [];
  const external: string[] = [];
  page.on("pageerror", e => errors.push(e.message));
  page.on("request", r => { if (!r.url().startsWith("http://127.0.0.1:3114") && !r.url().startsWith("data:")) external.push(r.url()); });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.reload();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Harvest &Hearth");
  await page.screenshot({ path: testInfo.outputPath(`${testInfo.project.name}-full.png`), fullPage: true });
  await page.screenshot({ path: testInfo.outputPath(`${testInfo.project.name}-hero.png`) });
  expect(errors).toEqual([]);
  expect(external).toEqual([]);
});
