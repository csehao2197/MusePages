import { test, expect, type Page } from "@playwright/test";

function futureDay(weekend = false) {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() + 2);
  while (weekend ? date.getUTCDay() !== 6 : [0, 6].includes(date.getUTCDay())) date.setUTCDate(date.getUTCDate() + 1);
  return date.toISOString().slice(0, 10);
}
async function fillRequest(page: Page) {
  await page.getByLabel("Choose a date").fill(futureDay());
  await page.getByRole("radio", { name: "11:00" }).check();
  await page.getByLabel("Your name", { exact: true }).fill("Jamie Example");
  await page.getByLabel("Work email", { exact: true }).fill("jamie@example.test");
  await page.getByLabel("What are you building?").fill("A collaborative SaaS planning workspace.");
  await page.getByLabel("I understand this is a local demo").check();
}
test.beforeEach(async ({ page }) => { await page.goto("/"); });

test("responsive original process artwork, disclosures and reduced-motion render", async ({ page }, testInfo) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  await expect(page.getByRole("heading", { name: "From idea to launch. In 12 weeks." })).toBeVisible();
  await expect(page.getByRole("img", { name: /Four connected process blocks/ })).toBeVisible();
  await expect(page.getByText("No client endorsements or live bookings.")).toBeAttached();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior)).toBe("auto");
  await page.screenshot({ path: testInfo.outputPath("hero.png"), fullPage: false });
  await page.screenshot({ path: testInfo.outputPath("full-page.png"), fullPage: true });
  await page.locator("#consultation").scrollIntoViewIfNeeded();
  await page.screenshot({ path: testInfo.outputPath("consultation.png"), fullPage: false });
  expect(errors).toEqual([]);
});

test("four-phase navigation and artifact dialogs preserve keyboard focus", async ({ page }) => {
  const phaseNames = ["Discover", "Design", "Develop", "Deliver"];
  for (let i = 0; i < phaseNames.length; i++) {
    const link = page.getByRole("navigation", { name: "Project phases" }).getByRole("link").nth(i);
    await link.click();
    await expect(link).toHaveAttribute("aria-current", "step");
    const section = page.locator(`#phase-${i}`);
    await expect(section.getByRole("heading", { level: 2 })).toBeVisible();
    const button = section.getByRole("button", { name: /^Explore / });
    await button.focus();
    await page.keyboard.press("Enter");
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await expect(dialog).toContainText("not commissioned research");
    for (let count = 0; count < 4; count++) await page.keyboard.press("Tab");
    expect(await dialog.evaluate(el => el.contains(document.activeElement))).toBe(true);
    await page.keyboard.press("Escape");
    await expect(dialog).not.toBeVisible();
    await expect(button).toBeFocused();
    await section.locator(".gate summary").click();
    await expect(section.locator(".gate")).toHaveAttribute("open", "");
  }
});

test("scope arithmetic, engagement switches and reset remain coherent", async ({ page }) => {
  await expect(page.getByTestId("weeks")).toHaveText("12 weeks");
  await expect(page.getByTestId("budget")).toHaveText("$60,000");
  await page.getByLabel("Additional core flow").check();
  await page.getByLabel("Complex integration").check();
  await page.getByLabel("Multi-role workspace").check();
  await expect(page.getByTestId("weeks")).toHaveText("17 weeks");
  await expect(page.getByTestId("budget")).toHaveText("$95,000");
  await page.getByLabel("Complex integration").uncheck();
  await expect(page.getByTestId("weeks")).toHaveText("15 weeks");
  await expect(page.getByTestId("budget")).toHaveText("$80,000");
  await page.getByLabel("Start with", { exact: true }).selectOption("design");
  await expect(page.getByTestId("weeks")).toHaveText("6 weeks");
  await expect(page.getByTestId("budget")).toHaveText("$30,000");
  await expect(page.getByLabel("Additional core flow")).not.toBeChecked();
  await page.getByLabel("Start with", { exact: true }).selectOption("discovery");
  await page.getByLabel("Complex integration").check();
  await expect(page.getByTestId("weeks")).toHaveText("4 weeks");
  await expect(page.getByTestId("budget")).toHaveText("$25,000");
  await page.getByRole("button", { name: "Reset scope" }).click();
  await expect(page.getByTestId("budget")).toHaveText("$60,000");
  await expect(page.getByTestId("weeks")).toHaveText("12 weeks");
});

test("calendar empty states, weekend recovery and native date validity", async ({ page }) => {
  await expect(page.getByText("No times to show yet.")).toBeVisible();
  const date = page.getByLabel("Choose a date");
  await date.fill(futureDay(true));
  await expect(page.getByText("No demo sessions on weekends. Choose a weekday.")).toBeVisible();
  await expect(page.getByRole("radio")).toHaveCount(0);
  await date.fill("2020-01-01");
  expect(await date.evaluate((el: HTMLInputElement) => el.validity.rangeUnderflow)).toBe(true);
  await date.fill(futureDay());
  await expect(page.getByRole("radio")).toHaveCount(3);
  await page.getByRole("radio", { name: "09:00" }).check();
  await date.fill(futureDay(true));
  await date.fill(futureDay());
  await expect(page.getByRole("radio", { checked: true })).toHaveCount(0);
});

test("consultation native input validation, error retry, local confirmation and reset", async ({ page }) => {
  const submit = page.getByRole("button", { name: "Book discovery call", exact: true });
  await submit.click();
  await expect(page.getByText("DEMO REQUEST COMPLETE")).toHaveCount(0);
  expect(await page.getByLabel("Choose a date").evaluate((el: HTMLInputElement) => el.validity.valueMissing)).toBe(true);
  await fillRequest(page);
  await page.getByLabel("Work email", { exact: true }).fill("invalid");
  await submit.click();
  expect(await page.getByLabel("Work email", { exact: true }).evaluate((el: HTMLInputElement) => el.validity.typeMismatch)).toBe(true);
  await page.getByLabel("Work email", { exact: true }).fill("jamie@example.test");
  await page.getByLabel("Your name", { exact: true }).fill("   ");
  await submit.click();
  expect(await page.getByLabel("Your name", { exact: true }).evaluate((el: HTMLInputElement) => el.validity.patternMismatch)).toBe(true);
  await page.getByLabel("Your name", { exact: true }).fill("Jamie Example");
  await page.getByText("Demo recovery controls", { exact: true }).click();
  await page.getByLabel("Simulate a submission error").check();
  await submit.click();
  await expect(page.getByRole("alert").filter({ hasText: "Simulated connection error" })).toBeVisible();
  await expect(page.getByLabel("Your name", { exact: true })).toHaveValue("Jamie Example");
  await page.getByLabel("Simulate a submission error").uncheck();
  await page.getByLabel("Additional core flow").check();
  await submit.click();
  await expect(page.getByRole("status").filter({ hasText: "DEMO REQUEST COMPLETE" })).toContainText("13 weeks · $67,500");
  await expect(page.getByRole("status").filter({ hasText: "DEMO REQUEST COMPLETE" })).toContainText(`${futureDay()}`);
  await page.getByRole("button", { name: "Start a new request" }).click();
  await expect(page.getByLabel("Your name", { exact: true })).toHaveValue("");
  await expect(page.getByLabel("Choose a date")).toHaveValue("");
  await fillRequest(page);
  await page.getByRole("button", { name: "Clear request" }).click();
  await expect(page.getByLabel("Work email", { exact: true })).toHaveValue("");
  await expect(page.getByRole("radio")).toHaveCount(0);
});

test("FAQ keyboard disclosure and concept evidence, toolkit and privacy previews", async ({ page }) => {
  const question = page.getByText("How much does a typical project cost?", { exact: true });
  await question.focus();
  await page.keyboard.press("Enter");
  await expect(page.locator(".faqs details").first()).toHaveAttribute("open", "");
  await expect(page.locator(".faqs details").first()).toContainText("$60K and $150K");
  await page.keyboard.press("Enter");
  await expect(page.locator(".faqs details").first()).not.toHaveAttribute("open", "");
  const notes = page.getByRole("button", { name: "Read concept notes" }).first();
  await notes.click();
  await expect(page.getByRole("dialog")).toContainText("No real product was built");
  await page.getByRole("button", { name: "Close preview" }).click();
  await expect(notes).toBeFocused();
  await page.getByRole("button", { name: "Ne Next.js", exact: true }).click();
  await expect(page.getByRole("dialog")).toContainText("does not connect to Next.js");
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: "Privacy", exact: true }).click();
  await expect(page.getByRole("dialog")).toContainText("no analytics, storage");
  await page.keyboard.press("Escape");
});

test("newsletter requires valid email and resets local-only confirmation", async ({ page }) => {
  const email = page.getByLabel("Newsletter email");
  await page.getByRole("button", { name: "Subscribe", exact: true }).click();
  expect(await email.evaluate((el: HTMLInputElement) => el.validity.valueMissing)).toBe(true);
  await email.fill("not-email");
  await page.getByRole("button", { name: "Subscribe", exact: true }).click();
  expect(await email.evaluate((el: HTMLInputElement) => el.validity.typeMismatch)).toBe(true);
  await email.fill("reader@example.test");
  await page.getByRole("button", { name: "Subscribe", exact: true }).click();
  await expect(page.getByRole("status").filter({ hasText: "Demo subscription" })).toBeVisible();
  await page.getByRole("button", { name: "Reset", exact: true }).click();
  await expect(email).toHaveValue("");
});

test("navigation, mobile dialog dismissal and CTA move focus to booking", async ({ page }, testInfo) => {
  if (testInfo.project.name === "mobile") {
    const menu = page.getByRole("button", { name: "Open menu" });
    await menu.click();
    await expect(menu).toHaveAttribute("aria-expanded", "true");
    await page.keyboard.press("Escape");
    await expect(menu).toBeFocused();
    await menu.click();
    await page.getByRole("dialog").getByRole("link", { name: "Services" }).click();
    await expect(page.getByRole("dialog")).not.toBeVisible();
    await expect(page.locator("#scope")).toBeInViewport();
    await menu.click();
    await page.getByRole("dialog").getByRole("button", { name: "Book a discovery call" }).click();
  } else {
    await page.getByRole("navigation", { name: "Main navigation" }).getByRole("link", { name: "Services" }).click();
    await expect(page.locator("#scope")).toBeInViewport();
    await page.getByRole("button", { name: "Let's talk", exact: true }).click();
  }
  await expect(page.getByLabel("Choose a date")).toBeFocused();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test("download is a real self-authored PDF, no external service requests", async ({ page, request }) => {
  const external: string[] = [];
  page.on("request", req => { if (!req.url().startsWith("http://127.0.0.1:3132")) external.push(req.url()); });
  await page.reload();
  const link = page.getByRole("link", { name: "Process PDF" });
  await expect(link).toHaveAttribute("download", "");
  const response = await request.get("/process-guide.pdf");
  expect(response.status()).toBe(200);
  expect(response.headers()["content-type"]).toContain("application/pdf");
  expect((await response.body()).toString("ascii").startsWith("%PDF-1.4")).toBe(true);
  expect(external).toEqual([]);
});
