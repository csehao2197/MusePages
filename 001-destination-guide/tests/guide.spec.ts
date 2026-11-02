import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => { await page.goto("/"); });

test("filters, searches, and persists a meaningful saved shortlist", async ({ page }) => {
  const section = page.locator("#attractions");
  await expect(section.locator("article")).toHaveCount(6);
  await section.getByRole("button", { name: "Food", exact: true }).click();
  await expect(section.locator("article")).toHaveCount(1);
  await expect(section.getByRole("heading", { name: "Tsukiji Outer Market" })).toBeVisible();
  await section.getByRole("button", { name: "Save Tsukiji Outer Market", exact: true }).click();
  await page.reload();
  await section.getByRole("button", { name: "My saved places (1)" }).click();
  await expect(section.locator("article")).toHaveCount(1);
  await section.getByRole("textbox", { name: "Search attractions" }).fill("Atlantis");
  await expect(section.getByRole("heading", { name: "No places found, yet." })).toBeVisible();
  await section.getByRole("button", { name: "Reset filters" }).click();
  await expect(section.locator("article")).toHaveCount(6);
  await section.getByRole("textbox", { name: "Search attractions" }).fill("Harajuku");
  await expect(section.locator("article")).toHaveCount(1);
  await expect(section.getByRole("heading", { name: "Meiji Shrine" })).toBeVisible();
});

test("itinerary tabs change actual day timelines and support keyboard navigation", async ({ page }) => {
  const tabs = page.getByRole("tablist", { name: "Itinerary duration" });
  const panel = page.getByRole("tabpanel");
  await expect(panel.locator("article")).toHaveCount(3);
  await tabs.getByRole("tab", { name: "5 Days Deep Dive" }).click();
  await expect(panel.locator("article")).toHaveCount(5);
  await expect(panel.getByRole("heading", { name: "Digital dreams & waterfront walks" })).toBeVisible();
  await tabs.getByRole("tab", { name: "7 Days Complete Tokyo" }).click();
  await expect(panel.locator("article")).toHaveCount(7);
  await expect(panel.getByRole("heading", { name: "Mount Fuji on the horizon" })).toBeVisible();
  await tabs.getByRole("tab", { name: "7 Days Complete Tokyo" }).press("Home");
  await expect(panel.locator("article")).toHaveCount(3);
  await expect(tabs.getByRole("tab").first()).toBeFocused();
});

test("practical controls reveal seasonal advice and produce a real local PDF", async ({ page }) => {
  const month = page.getByRole("button", { name: "Jul: 28°C, 154 mm rain, Hot/Rainy", exact: true });
  await month.click();
  await expect(month).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator(".weather-detail")).toContainText("Sumidagawa Fireworks");
  const details = page.locator(".glance-card");
  if (!(await details.evaluate(el => (el as HTMLDetailsElement).open))) await details.locator("summary").click();
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download PDF Guide", exact: true }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe("wanderly-tokyo-pocket-guide.pdf");
  const stream = await download.createReadStream();
  const chunks: Buffer[] = [];
  for await (const chunk of stream!) chunks.push(Buffer.from(chunk));
  const contents = Buffer.concat(chunks).toString();
  expect(contents).toMatch(/^%PDF-1.4/);
  expect(contents).toContain("Senso-ji");
  expect(contents).toContain("startxref");
  await expect(page.getByText("Your local pocket guide is ready.", { exact: true })).toBeVisible();
});

test("planner validates fields, customizes a local preview, and restores focus", async ({ page }) => {
  const trigger = page.getByRole("button", { name: "Start Planning", exact: true });
  await trigger.click();
  const dialog = page.getByRole("dialog");
  const submit = dialog.getByRole("button", { name: "Create My Demo Trip" });
  await submit.click();
  await expect(dialog).toBeVisible();
  expect(await dialog.locator('input[name="name"]').evaluate(el => (el as HTMLInputElement).validity.valueMissing)).toBeTruthy();
  await dialog.getByRole("textbox", { name: "Your name" }).fill("   ");
  await dialog.getByRole("textbox", { name: "Email address" }).fill("alex@example.com");
  await dialog.locator('input[type="date"]').fill("2030-04-10");
  await dialog.getByRole("checkbox", { name: /I understand/ }).check();
  await submit.click();
  await expect(dialog.getByRole("alert")).toContainText("not just spaces");
  await dialog.getByRole("textbox", { name: "Your name" }).fill("Alex Demo");
  await dialog.getByRole("checkbox", { name: "Culture", exact: true }).uncheck();
  await dialog.getByRole("checkbox", { name: "Food", exact: true }).uncheck();
  await submit.click();
  await expect(dialog.getByRole("alert")).toContainText("at least one interest");
  await dialog.getByRole("checkbox", { name: "Nature", exact: true }).check();
  await dialog.getByLabel("Trip length").selectOption("5");
  await dialog.getByLabel("Your pace").selectOption("Slow & easy");
  await dialog.getByLabel("Preferred neighborhood").selectOption("Asakusa");
  await submit.click();
  await expect(dialog.getByRole("heading", { name: "Your demo plan is ready." })).toBeVisible();
  await expect(dialog).toContainText("No inquiry was sent, and nothing was booked.");
  await expect(dialog).toContainText("5 days · 2 travelers · Slow & easy");
  await expect(dialog).toContainText("Asakusa");
  await expect(dialog).toContainText("Nature");
  await dialog.getByRole("button", { name: "Close trip planner" }).click();
  await expect(dialog).not.toBeVisible();
  await expect(trigger).toBeFocused();
});

test("hotel and package controls use their selected preferences", async ({ page }) => {
  await page.locator("#stay").getByRole("button", { name: /View All Hotels/ }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog.getByRole("heading", { name: "Find your Tokyo home base" })).toBeVisible();
  await dialog.locator(".hotel-options").getByRole("button", { name: /Asakusa/ }).click();
  await expect(dialog.getByLabel("Preferred neighborhood")).toHaveValue("Asakusa");
  await dialog.getByRole("button", { name: "Close trip planner" }).click();
  await page.getByRole("button", { name: "Browse Tokyo Packages" }).click();
  await dialog.getByRole("button", { name: /Use the 7-day itinerary/ }).click();
  await expect(dialog.getByLabel("Trip length")).toHaveValue("7");
  await dialog.getByRole("button", { name: "Close trip planner" }).click();
});

test("responsive guide stays within viewport with working mobile navigation", async ({ page }, testInfo) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  await expect(page.getByRole("heading", { name: "Tokyo.", exact: true })).toBeVisible();
  if (testInfo.project.name.startsWith("mobile")) {
    await expect(page.locator(".glance-card")).not.toHaveAttribute("open");
    await page.getByRole("button", { name: "Open navigation" }).click();
    await page.getByRole("navigation", { name: "Main navigation" }).getByRole("link", { name: "Blog" }).click();
    await expect(page.getByRole("button", { name: "Open navigation" })).toHaveAttribute("aria-expanded", "false");
    await page.locator(".mobile-bottom").getByRole("button", { name: "Plan My Trip" }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.getByRole("button", { name: "Close trip planner" }).click();
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBeTruthy();
  await page.screenshot({ path: testInfo.outputPath("guide.png"), fullPage: true });
  expect(errors).toEqual([]);
});
