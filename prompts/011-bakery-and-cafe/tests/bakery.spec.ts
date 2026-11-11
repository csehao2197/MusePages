import { test, expect, type Page } from "@playwright/test";

function nextDate(day: number) {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  while (date.getDay() !== day) date.setDate(date.getDate() + 1);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
async function bag(page: Page) {
  await page.getByRole("button", { name: /Open shopping bag/ }).click();
}
async function addBread(page: Page) {
  await page.locator("#menu").getByRole("button", { name: "Add Sourdough Boule", exact: true }).click();
  await page.getByRole("button", { name: /Add to Bag/ }).click();
}
test.beforeEach(async ({ page }) => { await page.goto("/"); });

test("source sections, tab keyboard, full menu, gallery and focus restoration", async ({ page }, testInfo) => {
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Artisan Breads,Pastries & Coffee");
  await expect(page.locator("#specials .special-card")).toHaveCount(3);
  await expect(page.locator("#specials")).toContainText("Lavender Honey Latte");
  await expect(page.locator("#specials")).toContainText("$6.25");
  await expect(page.locator("#menu-panel .menu-item")).toHaveCount(6);
  await page.getByRole("tab", { name: "Breads", exact: true }).focus();
  await page.keyboard.press("ArrowRight");
  await expect(page.getByRole("tab", { name: "Pastries", exact: true })).toBeFocused();
  await expect(page.locator("#menu-panel")).toContainText("Almond Croissant");
  await page.getByRole("button", { name: "View Full Menu" }).click();
  await expect(page.locator("#menu-panel .menu-item")).toHaveCount(22);
  await page.getByRole("button", { name: "Show Selected Category" }).click();
  await expect(page.locator("#menu-panel .menu-item")).toHaveCount(4);
  const trigger = page.getByRole("button", { name: "Open gallery: A seat at the neighborhood table" });
  await trigger.click();
  await expect(page.getByRole("dialog", { name: "A seat at the neighborhood table" })).toBeVisible();
  await page.getByRole("button", { name: "Next gallery image" }).click();
  await expect(page.getByRole("heading", { name: "A thousand little buttery layers" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();
  await page.evaluate(() => scrollTo(0, 0));
  await page.screenshot({ path: testInfo.outputPath("homepage.png"), fullPage: true });
  await page.screenshot({ path: testInfo.outputPath("hero.png") });
});

test("options, integer quantities, exact prices and empty bag recovery", async ({ page }) => {
  await bag(page);
  await expect(page.getByText("A fresh start.")).toBeVisible();
  await page.getByRole("button", { name: "Browse the Menu" }).click();
  await page.getByRole("tab", { name: "Coffee & Drinks" }).click();
  await page.getByRole("button", { name: "Add Lavender Honey Latte", exact: true }).click();
  await page.getByLabel("Preparation").selectOption("Oat milk");
  await page.getByLabel("Quantity", { exact: true }).fill("2");
  await expect(page.getByRole("button", { name: "Add to Bag · $14.00" })).toBeVisible();
  await page.getByLabel("Quantity", { exact: true }).fill("1.5");
  await page.getByRole("button", { name: /Add to Bag/ }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  expect(await page.getByLabel("Quantity", { exact: true }).evaluate((input: HTMLInputElement) => input.validity.stepMismatch)).toBe(true);
  await page.getByLabel("Quantity", { exact: true }).fill("0");
  await page.getByRole("button", { name: /Add to Bag/ }).click();
  expect(await page.getByLabel("Quantity", { exact: true }).evaluate((input: HTMLInputElement) => input.validity.valueMissing)).toBe(true);
  await page.getByLabel("Quantity", { exact: true }).fill("21");
  await page.getByRole("button", { name: /Add to Bag/ }).click();
  expect(await page.getByLabel("Quantity", { exact: true }).evaluate((input: HTMLInputElement) => input.validity.rangeOverflow)).toBe(true);
  await page.getByLabel("Quantity", { exact: true }).fill("2");
  await page.getByRole("button", { name: "Add to Bag · $14.00" }).click();
  await bag(page);
  await expect(page.getByTestId("cart-total")).toHaveText("$14.00");
  await page.getByRole("button", { name: "Increase Lavender Honey Latte" }).click();
  await expect(page.getByTestId("cart-total")).toHaveText("$21.00");
  await page.getByRole("button", { name: "Decrease Lavender Honey Latte" }).click();
  await expect(page.getByTestId("cart-total")).toHaveText("$14.00");
  await page.getByRole("button", { name: "Remove Lavender Honey Latte" }).click();
  await expect(page.getByText("A fresh start.")).toBeVisible();
});

test("pickup native inputs, closed days, Sunday restriction and confirmation reset", async ({ page }) => {
  await addBread(page); await bag(page);
  await page.getByLabel("Pickup date").fill(nextDate(1));
  await page.getByLabel("Pickup window").selectOption("9:00–9:30 AM");
  await page.getByLabel("Your name", { exact: true }).fill("Test Baker");
  await page.getByLabel("Email", { exact: true }).fill("not-email");
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Confirm Pickup Preview" }).click();
  expect(await page.getByLabel("Email", { exact: true }).evaluate((input: HTMLInputElement) => input.validity.typeMismatch)).toBe(true);
  await page.getByLabel("Email", { exact: true }).fill("baker@example.test");
  await page.getByRole("button", { name: "Confirm Pickup Preview" }).click();
  await expect(page.getByRole("dialog").getByRole("alert")).toContainText("Monday is our baking day");
  await page.getByLabel("Pickup date").fill(nextDate(0));
  await page.getByRole("button", { name: "Confirm Pickup Preview" }).click();
  await expect(page.getByRole("dialog").getByRole("alert")).toContainText("Sunday is pastries & drinks only");
  await page.getByLabel("Pickup date").fill(nextDate(2));
  await page.getByRole("button", { name: "Confirm Pickup Preview" }).click();
  await expect(page.getByRole("dialog").getByRole("status")).toContainText("$8.50");
  await expect(page.getByRole("dialog").getByRole("status")).toContainText("Nothing was ordered or charged");
  await page.getByRole("button", { name: "Done", exact: true }).click();
  await bag(page);
  await expect(page.getByText("A fresh start.")).toBeVisible();
});

test("catering cake journey validates group size, future date and email; preview resets", async ({ page }) => {
  await page.getByRole("button", { name: "Request a Catering Quote" }).click();
  await page.getByLabel("Occasion").selectOption("Celebration cake");
  await page.getByLabel("Event date").fill(nextDate(4));
  await page.getByLabel("Guests").fill("9");
  await page.getByLabel("Your name", { exact: true }).fill("Elena Example");
  await page.getByLabel("Email", { exact: true }).fill("elena@example.test");
  await page.getByLabel("Menu, cake flavor & dietary preferences").fill("Lemon cake for a gathering. Ask about nut cross-contact.");
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Create Quote Preview" }).click();
  expect(await page.getByLabel("Guests").evaluate((input: HTMLInputElement) => input.validity.rangeUnderflow)).toBe(true);
  await page.getByLabel("Guests").fill("201");
  await page.getByRole("button", { name: "Create Quote Preview" }).click();
  expect(await page.getByLabel("Guests").evaluate((input: HTMLInputElement) => input.validity.rangeOverflow)).toBe(true);
  await page.getByLabel("Guests").fill("35");
  await page.getByLabel("Event date").fill("2020-01-01");
  await page.getByRole("button", { name: "Create Quote Preview" }).click();
  expect(await page.getByLabel("Event date").evaluate((input: HTMLInputElement) => input.validity.rangeUnderflow)).toBe(true);
  await page.getByLabel("Event date").fill(nextDate(4));
  await page.getByRole("button", { name: "Create Quote Preview" }).click();
  await expect(page.getByRole("dialog").getByRole("status")).toContainText("Celebration cake request preview for 35 guests");
  await page.getByRole("button", { name: "Done", exact: true }).click();
  await page.getByRole("button", { name: "Request a Catering Quote" }).click();
  await expect(page.getByLabel("Your name", { exact: true })).toHaveValue("");
});

test("gift bread box Saturday recovery, newsletter validation and local reset", async ({ page }) => {
  await page.getByRole("button", { name: "Subscribe Now" }).click();
  await page.getByLabel("First Saturday").fill(nextDate(3));
  await page.getByLabel("Email", { exact: true }).fill("gift@example.test");
  await page.getByLabel("Delivery address (fictional preview)").fill("123 Fictional Lane");
  for (const checkbox of await page.getByRole("checkbox").all()) await checkbox.check();
  await page.getByRole("button", { name: "Preview Bread Box · $32/week" }).click();
  await expect(page.getByRole("dialog").getByRole("alert")).toContainText("Please choose a Saturday");
  await page.getByLabel("First Saturday").fill(nextDate(6));
  await page.getByRole("button", { name: "Preview Bread Box · $32/week" }).click();
  await expect(page.getByRole("dialog").getByRole("status")).toContainText("Gift bread box preview");
  await expect(page.getByRole("dialog").getByRole("status")).toContainText("No subscription");
  await page.getByRole("button", { name: "Done", exact: true }).click();
  await page.getByLabel("Email for the Crumb Club").fill("bad");
  await page.getByRole("button", { name: "Join", exact: true }).click();
  expect(await page.getByLabel("Email for the Crumb Club").evaluate((input: HTMLInputElement) => input.validity.typeMismatch)).toBe(true);
  await page.getByLabel("Email for the Crumb Club").fill("crumb@example.test");
  await page.getByRole("button", { name: "Join", exact: true }).click();
  await expect(page.getByText("Welcome preview! Code CRUMB10")).toBeVisible();
  await page.getByRole("button", { name: "Reset preview" }).click();
  await expect(page.getByLabel("Email for the Crumb Club")).toHaveValue("");
});

test("dialog keyboard containment, mobile navigation, reduced motion and overflow", async ({ page }, testInfo) => {
  const browserErrors: string[] = [];
  page.on("pageerror", error => browserErrors.push(error.message));
  const trigger = page.getByRole("button", { name: /Open shopping bag/ });
  await trigger.click();
  await page.keyboard.press("Tab");
  expect(await page.evaluate(() => !!document.activeElement?.closest("dialog"))).toBe(true);
  await page.keyboard.press("Shift+Tab");
  expect(await page.evaluate(() => !!document.activeElement?.closest("dialog"))).toBe(true);
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();
  if (testInfo.project.name === "mobile") {
    const nav = page.getByRole("button", { name: "Open mobile navigation" });
    await nav.click();
    await expect(page.getByRole("dialog", { name: "Mobile navigation" })).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(nav).toBeFocused();
    await nav.click();
    await page.getByRole("navigation", { name: "Mobile", exact: true }).getByRole("button", { name: "Catering", exact: true }).click();
    await expect(page.getByRole("dialog", { name: "Mobile navigation" })).not.toBeVisible();
    await expect(page.locator("#catering")).toBeFocused();
    await expect(page.getByRole("button", { name: "Order Now" })).toBeVisible();
    expect(await page.locator(".hero-art").evaluate(element => getComputedStyle(element).animationName)).toBe("none");
    await page.getByRole("button", { name: "Show review 2" }).click();
    await page.waitForTimeout(5300);
    await expect(page.getByRole("button", { name: "Show review 2" })).toHaveAttribute("aria-pressed", "true");
  }
  for (const id of ["specials", "menu", "story", "gallery", "catering", "subscription", "visit"]) {
    await page.locator(`#${id}`).scrollIntoViewIfNeeded();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  }
  await page.locator("#specials").scrollIntoViewIfNeeded();
  await page.screenshot({ path: testInfo.outputPath("specials.png") });
  expect(browserErrors).toEqual([]);
});

test("cart cumulative cap and distinct preparation lines", async ({ page }) => {
  await page.getByRole("button", { name: "Add Baguette", exact: true }).click();
  await page.getByLabel("Quantity", { exact: true }).fill("20");
  await page.getByRole("button", { name: /Add to Bag/ }).click();
  await page.getByRole("button", { name: "Add Baguette", exact: true }).click();
  await page.getByRole("button", { name: /Add to Bag/ }).click();
  await expect(page.getByRole("dialog").getByRole("alert")).toContainText("Maximum 20");
  await page.getByLabel("Preparation").selectOption("Sliced");
  await page.getByRole("button", { name: /Add to Bag/ }).click();
  await bag(page);
  await expect(page.locator(".cart-line")).toHaveCount(2);
  await expect(page.getByTestId("cart-total")).toHaveText("$94.50");
  await expect(page.getByRole("button", { name: "Increase Baguette" }).first()).toBeDisabled();
});

test("review controls, autoplay pause, founder story and fictional social preview", async ({ page }, testInfo) => {
  if (testInfo.project.name === "desktop") {
    await page.mouse.move(0, 0);
    await expect(page.getByRole("button", { name: "Show review 1" })).toHaveAttribute("aria-pressed", "true");
    await expect(page.getByRole("button", { name: "Show review 2" })).toHaveAttribute("aria-pressed", "true", { timeout: 7000 });
    await page.locator(".reviews-section").hover();
    await page.waitForTimeout(5300);
    await expect(page.getByRole("button", { name: "Show review 2" })).toHaveAttribute("aria-pressed", "true");
    await page.getByRole("button", { name: "Pause", exact: true }).click();
    await page.mouse.move(0, 0);
    await page.getByRole("heading", { level: 1 }).evaluate(element => { element.setAttribute("tabindex", "-1"); (element as HTMLElement).focus(); });
    await page.waitForTimeout(5300);
    await expect(page.getByRole("button", { name: "Show review 2" })).toHaveAttribute("aria-pressed", "true");
    await expect(page.getByRole("button", { name: "Play", exact: true })).toHaveAttribute("aria-pressed", "true");
  } else {
    await page.getByRole("button", { name: "Show review 1" }).click();
    await page.locator(".reviews-section").evaluate(element => {
      const start = new Touch({ identifier: 1, target: element, clientX: 250, clientY: 200 });
      const end = new Touch({ identifier: 1, target: element, clientX: 100, clientY: 200 });
      element.dispatchEvent(new TouchEvent("touchstart", { bubbles: true, touches: [start] }));
      element.dispatchEvent(new TouchEvent("touchend", { bubbles: true, changedTouches: [end] }));
    });
    await expect(page.getByRole("button", { name: "Show review 2" })).toHaveAttribute("aria-pressed", "true");
  }
  await page.getByRole("button", { name: "Next review" }).click();
  await expect(page.getByRole("button", { name: "Show review 3" })).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "Read Our Full Story" }).click();
  await expect(page.getByRole("dialog")).toContainText("not verified sourcing");
  await page.getByRole("button", { name: "Close dialog" }).click();
  await page.locator("footer").getByRole("button", { name: "Instagram" }).click();
  await expect(page.getByRole("dialog")).toContainText("No external account");
  await page.keyboard.press("Escape");
  await expect(page.locator("footer").getByRole("button", { name: "Instagram" })).toBeFocused();
});
