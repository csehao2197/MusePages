import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => { await page.goto("/"); });

test("source-specific sections, local artwork and responsive render", async ({ page }, info) => {
  await expect(page.getByRole("heading", { name: /Roasted with intention/ })).toBeVisible();
  for (const heading of ["What's Brewing", "The Menu", "Find Us", "Brew at Home", "Stay in the Loop", "Ember Rewards"]) {
    await expect(page.getByRole("heading", { name: heading, exact: true })).toHaveCount(1);
  }
  await expect(page.locator(".drink-card")).toHaveCount(4);
  await expect(page.locator(".location-card")).toHaveCount(4);
  await expect(page.locator(".bean-card")).toHaveCount(3);
  expect(await page.evaluate(() => [...document.images].every(image => image.complete && image.naturalWidth > 0))).toBe(true);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: info.outputPath(`${info.project.name}-full.png`), fullPage: true });
  await page.screenshot({ path: info.outputPath(`${info.project.name}-hero.png`) });
});

test("menu filtering, options, arithmetic and demo pickup", async ({ page }) => {
  await page.getByRole("button", { name: "Espresso Drinks", exact: true }).click();
  await expect(page.locator(".menu-card")).toHaveCount(1);
  await expect(page.getByRole("button", { name: "Latte $6.00" })).toBeVisible();
  await page.getByRole("button", { name: "Latte $6.00", exact: true }).click();
  const dialog = page.getByRole("dialog");
  await dialog.getByLabel("Milk / preparation").selectOption("Oat milk (+$0.75)");
  await dialog.getByLabel("Quantity").fill("2");
  await dialog.getByRole("button", { name: "Add selection to basket" }).click();
  await page.getByRole("button", { name: "Open basket, 2 items" }).click();
  await expect(page.getByTestId("total")).toHaveText("$13.50");
  await dialog.getByRole("button", { name: "Increase Latte", exact: true }).click();
  await expect(page.getByTestId("total")).toHaveText("$20.25");
  await dialog.getByRole("button", { name: "Decrease Latte", exact: true }).click();
  await dialog.getByRole("button", { name: "Confirm demo pickup" }).click();
  expect(await dialog.getByLabel("Your name").evaluate((el: HTMLInputElement) => el.validity.valueMissing)).toBe(true);
  await dialog.getByLabel("Your name").fill("Coffee friend");
  await dialog.getByLabel("Pickup location").selectOption("Alberta Arts");
  await dialog.getByRole("button", { name: "Confirm demo pickup" }).click();
  await expect(dialog.getByRole("status")).toContainText("Alberta Arts for $13.50");
  await expect(dialog.getByRole("status")).toContainText("No payment taken");
  await dialog.getByRole("button", { name: "Back to the cafe" }).click();
  await page.getByRole("button", { name: "Open basket, 0 items" }).click();
  await expect(dialog.getByRole("heading", { name: "Your basket is taking a coffee break." })).toBeVisible();
});

test("bean grind options remain separate and removals restore empty state", async ({ page }) => {
  const first = page.locator(".bean-card").first();
  await first.getByRole("button", { name: "Add to Cart" }).click();
  const dialog = page.getByRole("dialog");
  await dialog.getByRole("combobox", { name: "Grind", exact: true }).selectOption("Filter grind");
  await dialog.getByLabel("Quantity").fill("2");
  await dialog.getByRole("button", { name: "Add selection to basket" }).click();
  await first.getByRole("button", { name: "Add to Cart" }).click();
  await expect(dialog.getByLabel("Quantity")).toHaveValue("1");
  await expect(dialog.getByRole("combobox", { name: "Grind", exact: true })).toHaveValue("Whole bean");
  await dialog.getByRole("button", { name: "Add selection to basket" }).click();
  await page.getByRole("button", { name: "Open basket, 3 items" }).click();
  await expect(page.locator(".basket-line")).toHaveCount(2);
  await expect(page.getByTestId("total")).toHaveText("$57.00");
  await expect(dialog).toContainText("Filter grind");
  await expect(dialog).toContainText("Whole bean");
  await dialog.getByRole("button", { name: "Remove Ethiopia Yirgacheffe" }).first().click();
  await expect(page.getByTestId("total")).toHaveText("$19.00");
  await dialog.getByRole("button", { name: "Decrease Ethiopia Yirgacheffe" }).click();
  await expect(dialog).toContainText("Your basket is taking a coffee break.");
});

test("native option limits and modal keyboard focus return", async ({ page }) => {
  const trigger = page.locator(".drink-card").first().getByRole("button", { name: "Make it yours" });
  await trigger.click();
  const dialog = page.getByRole("dialog");
  await dialog.getByLabel("Quantity").fill("0");
  await dialog.getByRole("button", { name: "Add selection to basket" }).click();
  expect(await dialog.getByLabel("Quantity").evaluate((el: HTMLInputElement) => el.validity.rangeUnderflow)).toBe(true);
  await dialog.getByLabel("Quantity").fill("21");
  await dialog.getByRole("button", { name: "Add selection to basket" }).click();
  expect(await dialog.getByLabel("Quantity").evaluate((el: HTMLInputElement) => el.validity.rangeOverflow)).toBe(true);
  await page.keyboard.press("Tab");
  expect(await dialog.evaluate(el => el.contains(document.activeElement))).toBe(true);
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(trigger).toBeFocused();
});

test("subscription pricing and newsletter invalid email", async ({ page }) => {
  await page.getByRole("button", { name: "Shop All Coffee & Subscriptions" }).click();
  const dialog = page.getByRole("dialog");
  await dialog.getByRole("combobox", { name: "Coffee", exact: true }).selectOption("Colombia Huila");
  await dialog.getByRole("combobox", { name: "Grind", exact: true }).selectOption("Espresso grind");
  await dialog.getByLabel("Frequency").selectOption("4");
  await dialog.getByLabel("Email", { exact: true }).fill("invalid");
  await dialog.getByRole("button", { name: "Preview demo subscription" }).click();
  expect(await dialog.getByLabel("Email", { exact: true }).evaluate((el: HTMLInputElement) => el.validity.typeMismatch)).toBe(true);
  await dialog.getByLabel("Email", { exact: true }).fill("coffee@example.test");
  await dialog.getByRole("button", { name: "Preview demo subscription" }).click();
  await expect(dialog.getByRole("status")).toContainText("every 4 weeks — $17.00 per 12oz delivery");
  await dialog.getByRole("button", { name: "Back to the cafe" }).click();
  await page.getByLabel("Newsletter email").fill("not-email");
  await page.getByRole("button", { name: "Subscribe", exact: true }).click();
  expect(await page.getByLabel("Newsletter email").evaluate((el: HTMLInputElement) => el.validity.typeMismatch)).toBe(true);
  await page.getByLabel("Newsletter email").fill("coffee@example.test");
  await page.getByRole("button", { name: "Subscribe", exact: true }).click();
  await expect(page.locator(".newsletter [role=status]")).toContainText("No email sent or address stored");
});

test("Saturday-only tour and local directions adaptation", async ({ page }) => {
  await page.getByRole("button", { name: "Saturday roastery tours" }).click();
  const dialog = page.getByRole("dialog");
  await dialog.getByLabel("Tour date").fill("2026-11-08");
  await dialog.getByLabel("Email", { exact: true }).fill("tour@example.test");
  await dialog.getByRole("button", { name: "Request demo tour" }).click();
  expect(await dialog.getByLabel("Tour date").evaluate((el: HTMLInputElement) => el.validity.customError)).toBe(true);
  await dialog.getByLabel("Tour date").fill("2026-11-07");
  await dialog.getByLabel("Guests").fill("3");
  await dialog.getByRole("button", { name: "Request demo tour" }).click();
  await expect(dialog.getByRole("status")).toContainText("3 guest(s) on 2026-11-07 at 10am");
  await dialog.getByRole("button", { name: "Back to the cafe" }).click();
  await page.getByRole("button", { name: "Get Directions" }).first().click();
  await expect(dialog).toContainText("1028 NW Glisan St");
  await expect(dialog).toContainText("Live Google Maps links are intentionally replaced");
});

test("local inquiry, rewards and downloadable PDF", async ({ page }) => {
  await page.getByRole("button", { name: "Wholesale", exact: true }).click();
  const dialog = page.getByRole("dialog");
  await dialog.getByLabel("Name", { exact: true }).fill("Demo roaster");
  await dialog.getByLabel("Email", { exact: true }).fill("roaster@example.test");
  await dialog.getByLabel("Message").fill("A fictional wholesale tasting inquiry.");
  await dialog.getByRole("button", { name: "Complete local preview" }).click();
  await expect(dialog.getByRole("status")).toContainText("wholesale demo request");
  await dialog.getByRole("button", { name: "Back to the cafe" }).click();
  await page.getByRole("button", { name: "Join Rewards" }).click();
  await expect(dialog).toContainText("No account is created");
  await dialog.getByRole("button", { name: "Close dialog" }).click();
  const download = page.waitForEvent("download");
  await page.getByRole("link", { name: "Download Full Menu (PDF)" }).click();
  expect((await download).suggestedFilename()).toBe("ember-menu.pdf");
  const pdf = await page.request.get("/ember-menu.pdf");
  expect(pdf.ok()).toBe(true);
  expect((await pdf.body()).subarray(0, 5).toString()).toBe("%PDF-");
});

test("reduced motion, mobile drawer and no external services", async ({ page }, info) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior)).toBe("auto");
  expect(await page.locator(".button").first().evaluate(el => getComputedStyle(el).transitionDuration)).toBe("0s");
  if (info.project.name === "mobile") {
    const trigger = page.getByRole("button", { name: "Open navigation" });
    await trigger.click();
    const drawer = page.getByRole("dialog");
    await expect(drawer.getByRole("button", { name: "Order Ahead" })).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(trigger).toBeFocused();
    await trigger.click();
    await drawer.getByRole("link", { name: "Shop Online" }).click();
    await expect(drawer).not.toBeVisible();
    await expect(page).toHaveURL(/#shop$/);
    await trigger.click();
    await drawer.getByRole("button", { name: "Order Ahead" }).click();
    await expect(page.getByRole("dialog")).toContainText("Your basket is taking a coffee break.");
  }
  const external = await page.evaluate(() => performance.getEntriesByType("resource").map(r => r.name).filter(url => !url.startsWith(location.origin)));
  expect(external).toEqual([]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
