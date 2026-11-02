import { expect, test, type Page } from "@playwright/test";

async function openBrief(page: Page) {
  const mobile = await page.locator(".mobile-project").isVisible();
  await page.locator(mobile ? ".mobile-project" : ".header-cta").click();
  await expect(page.getByRole("dialog")).toBeVisible();
}
async function fillBrief(page: Page) {
  const dialog = page.getByRole("dialog");
  await dialog.getByLabel("Brand Strategy & Identity", { exact: true }).check();
  await dialog.getByLabel("Your name", { exact: true }).fill("Taylor Example");
  await dialog.getByLabel("Email", { exact: true }).fill("taylor@example.test");
  await dialog.getByLabel("Budget range", { exact: true }).selectOption("$15k–$30k");
  const date = new Date();
  date.setDate(date.getDate() + 30);
  await dialog.getByLabel("Preferred start date", { exact: true }).fill(`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`);
  await dialog.getByLabel("03 / What are you hoping to change?", { exact: true }).fill("Make our fictional organization easier to understand with a coherent identity.");
  await dialog.getByLabel("I understand this is a fictional", { exact: false }).check();
}

test.beforeEach(async ({ page }) => { await page.goto("/"); });

test("original portfolio renders, counters settle, and responsive layout has no overflow", async ({ page }, testInfo) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  await expect(page.getByRole("heading", { name: "Work That Works." })).toBeVisible();
  await expect(page.locator(".project-card")).toHaveCount(12);
  await expect(page.locator(".hero-stats .counter").first()).toContainText("180+");
  await expect(page.locator(".concept-banner")).toContainText("fictional");
  const columns = await page.locator(".project-collection").evaluate(element => getComputedStyle(element).gridTemplateColumns.split(" ").length);
  expect(columns).toBe(testInfo.project.name === "mobile" ? 1 : 3);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.screenshot({ path: testInfo.outputPath("home-top.png") });
  await page.locator(".results-grid").scrollIntoViewIfNeeded();
  await expect(page.locator(".results-grid .counter").first()).toHaveClass(/count-visible/);
  await expect(page.locator(".results-grid .counter").first()).toContainText("$42M+");
  await page.locator(".results-grid").screenshot({ path: testInfo.outputPath("results.png") });
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await page.screenshot({ path: testInfo.outputPath("home-full.png"), fullPage: true });
  expect(errors).toEqual([]);
});

test("every discipline filters honestly, list view works, empty results reset", async ({ page }) => {
  const filters = page.getByRole("group", { name: "Filter by discipline" });
  for (const [category, count] of [["Branding", 4], ["Web Design", 5], ["E-commerce", 3], ["Mobile Apps", 2], ["Digital Marketing", 2], ["Product Design", 2]] as const) {
    await filters.getByRole("button", { name: category, exact: true }).click();
    await expect(page.locator(".project-card")).toHaveCount(count);
    await expect(page.getByRole("status")).toHaveText(`Showing ${count} projects`);
    await expect(filters.getByRole("button", { name: category, exact: true })).toHaveAttribute("aria-pressed", "true");
  }
  await page.getByRole("button", { name: "List view", exact: true }).click();
  await expect(page.locator(".project-collection")).toHaveClass(/list/);
  await page.getByRole("searchbox", { name: "Search projects" }).fill("no matching agency");
  await expect(page.getByRole("heading", { name: "No projects in this mix." })).toBeVisible();
  await page.getByRole("button", { name: "Reset filters" }).click();
  await expect(page.locator(".project-card")).toHaveCount(12);
  await expect(page.getByRole("searchbox")).toHaveValue("");
  await page.getByRole("button", { name: "Grid view", exact: true }).click();
  await page.getByRole("searchbox").fill("bloom");
  await expect(page.locator(".project-card")).toHaveCount(1);
  await expect(page.getByRole("status")).toHaveText("Showing 1 project");
});

test("all twelve case studies expose distinct decisions and qualified outcomes with navigation", async ({ page }) => {
  const dialog = page.getByRole("dialog");
  for (const title of ["Solaris Rebrand", "Bloom E-commerce", "Nexus Dashboard", "Wander App", "Crest Brewing", "Pulse Fitness", "Arborist", "Kindred", "Volt EV", "Nourish", "StudioX", "Clarity"]) {
    await page.getByRole("button", { name: `View case study: ${title}`, exact: true }).click();
    await expect(dialog.getByRole("heading", { name: title, exact: true })).toBeVisible();
    await expect(dialog.getByText("03 / THE KEY DECISION", { exact: true })).toBeVisible();
    await expect(dialog.getByRole("heading", { name: "Direction, not evidence." })).toBeVisible();
    await expect(dialog.getByText("No real commission", { exact: false })).toBeVisible();
    await dialog.getByRole("button", { name: "Close detail" }).click();
  }
  await page.getByRole("button", { name: "View case study: Solaris Rebrand", exact: true }).click();
  await expect(dialog).toContainText("not measured results");
  await dialog.getByRole("button", { name: "Next: Bloom E-commerce" }).click();
  await expect(dialog.getByRole("heading", { name: "Bloom E-commerce", exact: true })).toBeVisible();
  await dialog.getByRole("button", { name: "Previous project" }).click();
  await expect(dialog.getByRole("heading", { name: "Solaris Rebrand", exact: true })).toBeVisible();
});

test("featured Solaris case is after six projects and opens the complete scenario", async ({ page }) => {
  const items = await page.locator(".project-collection").evaluate(element => [...element.querySelectorAll(".project-card, .featured")].map(item => item.className));
  expect(items[6]).toBe("featured");
  await page.getByRole("button", { name: "Inside the Solaris concept" }).click();
  await expect(page.getByRole("dialog")).toContainText("+340% qualified leads");
  await expect(page.getByRole("dialog")).toContainText("consented analytics");
});

test("services open substantive scopes, preselect brief and support direct routes", async ({ page }) => {
  const dialog = page.getByRole("dialog");
  for (const title of ["Brand Strategy & Identity", "Web Design & Development", "Digital Marketing"]) {
    await page.locator(".service-card").filter({ hasText: title }).click();
    await expect(dialog.getByRole("heading", { name: title, exact: true })).toBeVisible();
    await expect(dialog.locator(".deliverables li")).toHaveCount(4);
    await dialog.getByRole("button", { name: "Build a brief for this service" }).click();
    await expect(dialog.getByLabel(title, { exact: true })).toBeChecked();
    await dialog.getByRole("button", { name: "Close detail" }).click();
  }
  for (const slug of ["branding", "web", "marketing"]) {
    const response = await page.goto(`/services/${slug}`);
    expect(response?.status()).toBe(200);
    await expect(page.locator(".deliverables li")).toHaveCount(4);
  }
  await page.getByRole("link", { name: "Explore the studio & brief" }).click();
  await expect(page.getByRole("dialog").getByRole("heading", { name: "Tell us what’s next." })).toBeVisible();
  await page.getByRole("button", { name: "Close detail" }).click();
  expect((await page.goto("/services/not-a-service"))?.status()).toBe(404);
});

test("process, team, careers and original insights are navigable and disclosed", async ({ page }) => {
  const dialog = page.getByRole("dialog");
  await page.getByRole("button", { name: "Good work starts with a good process" }).click();
  await expect(dialog.locator(".process-steps li")).toHaveCount(4);
  await expect(dialog).toContainText("measurement baseline");
  await dialog.getByRole("button", { name: "Close detail" }).click();
  await page.getByRole("button", { name: "Meet the studio", exact: true }).click();
  await expect(dialog).toContainText("eight-year narrative");
  await dialog.getByRole("button", { name: "Alex Rowan", exact: false }).click();
  await expect(dialog.getByRole("heading", { name: "Alex Rowan" })).toBeVisible();
  await expect(dialog).toContainText("No employment history");
  await dialog.getByRole("button", { name: "Back to the studio" }).click();
  await dialog.getByRole("button", { name: "Mika Chen", exact: false }).click();
  await expect(dialog).toContainText("information architecture");
  await dialog.getByRole("button", { name: "Back to the studio" }).click();
  await dialog.getByRole("button", { name: "Sam Ellis", exact: false }).click();
  await expect(dialog).toContainText("performance budgets");
  await dialog.getByRole("button", { name: "Close detail" }).click();
  await page.locator(".footer-main").getByRole("button", { name: "Careers", exact: true }).click();
  await expect(dialog).toContainText("No open positions");
  await dialog.getByRole("button", { name: "Close detail" }).click();
  await page.locator(".insight-card").first().click();
  for (const title of ["A brand is a decision-making tool", "Less dashboard. More direction.", "The brief before the beautiful"]) {
    await expect(dialog.getByRole("heading", { name: title, exact: true })).toBeVisible();
    await expect(dialog).toContainText("not reported research");
    await dialog.getByRole("button", { name: "Next studio note" }).click();
  }
});

test("native brief constraints enforce services, email, budget, date, detail and consent", async ({ page }) => {
  await openBrief(page);
  const dialog = page.getByRole("dialog");
  const submit = dialog.getByRole("button", { name: "Confirm local brief" });
  await submit.click();
  expect(await dialog.locator("form").evaluate(form => (form as HTMLFormElement).checkValidity())).toBe(false);
  await fillBrief(page);
  const email = dialog.getByLabel("Email", { exact: true });
  await email.fill("not-an-email");
  expect(await email.evaluate(input => (input as HTMLInputElement).validity.typeMismatch)).toBe(true);
  await submit.click();
  await expect(dialog.getByRole("heading", { name: "Tell us what’s next." })).toBeVisible();
  await email.fill("taylor@example.test");
  const budget = dialog.getByLabel("Budget range", { exact: true });
  await budget.selectOption("");
  expect(await budget.evaluate(input => (input as HTMLSelectElement).validity.valueMissing)).toBe(true);
  await budget.selectOption("$15k–$30k");
  const date = dialog.getByLabel("Preferred start date", { exact: true });
  await date.fill("2020-01-01");
  expect(await date.evaluate(input => (input as HTMLInputElement).validity.rangeUnderflow)).toBe(true);
  await submit.click();
  await expect(dialog.getByRole("heading", { name: "Tell us what’s next." })).toBeVisible();
  await date.fill("2031-01-01");
  expect(await date.evaluate(input => (input as HTMLInputElement).validity.rangeOverflow)).toBe(true);
  await dialog.getByLabel("03 / What are you hoping to change?", { exact: true }).fill("Too short");
  expect(await dialog.getByLabel("03 / What are you hoping to change?", { exact: true }).evaluate(input => (input as HTMLTextAreaElement).validity.tooShort)).toBe(true);
  await dialog.getByRole("button", { name: "Reset brief" }).click();
  await expect(email).toHaveValue("");
  await expect(budget).toHaveValue("");
  await expect(date).toHaveValue("");
  await expect(dialog.getByLabel("Brand Strategy & Identity", { exact: true })).not.toBeChecked();
  await expect(dialog.getByLabel("I understand this is a fictional", { exact: false })).not.toBeChecked();
});

test("brief simulated error retains inputs, retries locally, confirms, resets and does not persist", async ({ page }) => {
  const externalRequests: string[] = [];
  page.on("request", request => { if (!request.url().startsWith("http://127.0.0.1:3131")) externalRequests.push(request.url()); });
  await openBrief(page);
  await fillBrief(page);
  const dialog = page.getByRole("dialog");
  await dialog.getByLabel("Simulate a local submission error once").check();
  await dialog.getByRole("button", { name: "Confirm local brief" }).click();
  await expect(dialog.getByRole("alert")).toBeFocused();
  await expect(dialog.getByLabel("Your name", { exact: true })).toHaveValue("Taylor Example");
  await dialog.getByRole("button", { name: "Confirm local brief" }).click();
  await expect(dialog.getByRole("heading", { name: "A good start, Taylor Example." })).toBeFocused();
  await expect(dialog).toContainText("$15k–$30k");
  await expect(dialog).toContainText("Nothing was sent or saved");
  await dialog.getByRole("button", { name: "Start a fresh brief" }).click();
  await expect(dialog.getByLabel("Your name", { exact: true })).toHaveValue("");
  await expect(dialog.getByLabel("Simulate a local submission error once")).not.toBeChecked();
  await dialog.getByLabel("Your name", { exact: true }).fill("Discarded Example");
  await dialog.getByRole("button", { name: "Close detail" }).click();
  await openBrief(page);
  await expect(dialog.getByLabel("Your name", { exact: true })).toHaveValue("");
  expect(externalRequests).toEqual([]);
});

test("modal traps keyboard focus, escape closes and returns focus to exact trigger", async ({ page }) => {
  const trigger = page.getByRole("button", { name: "View case study: Bloom E-commerce", exact: true });
  await trigger.focus();
  await page.keyboard.press("Enter");
  const dialog = page.getByRole("dialog");
  await expect(dialog.getByRole("button", { name: "Close detail" })).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(dialog.getByRole("button", { name: "Next: Nexus Dashboard" })).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(dialog.getByRole("button", { name: "Close detail" })).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(trigger).toBeFocused();
});

test("navigation, contact, social previews and reduced motion stay local", async ({ page }, testInfo) => {
  if (testInfo.project.name === "mobile") {
    const toggle = page.getByRole("button", { name: "Open navigation", exact: true });
    await toggle.click();
    const nav = page.getByRole("navigation", { name: "Mobile navigation", exact: true });
    await expect(nav).toBeVisible();
    await nav.getByRole("link", { name: "Services", exact: true }).click();
    await expect(nav).not.toBeVisible();
    await expect(page.locator("#services")).toBeFocused();
    await toggle.click();
      await page.getByRole("navigation", { name: "Mobile navigation", exact: true }).getByRole("button", { name: "About", exact: true }).click();
      await expect(page.getByRole("dialog")).toBeVisible();
      await page.getByRole("button", { name: "Close detail" }).click();
      await expect(page.getByRole("button", { name: "Open navigation", exact: true })).toBeFocused();
      await toggle.click();
    await page.keyboard.press("Tab");
    await page.keyboard.press("Escape");
    await expect(page.getByRole("button", { name: "Open navigation", exact: true })).toBeFocused();
    expect(await page.locator(".logo-track").evaluate(element => getComputedStyle(element).animationName)).toBe("none");
  } else {
    await page.getByRole("navigation", { name: "Main navigation", exact: true }).getByRole("link", { name: "Services", exact: true }).click();
    await expect(page.locator("#services")).toBeFocused();
  }
  await page.locator(".footer-main").getByRole("button", { name: "Instagram" }).click();
  await expect(page.getByRole("dialog")).toContainText("No real account or inbox");
  await page.getByRole("button", { name: "Close detail" }).click();
  await page.getByRole("button", { name: "Open local contact preview" }).click();
  await expect(page.getByRole("dialog").getByRole("heading", { name: "Let’s make a start." })).toBeVisible();
  await page.getByRole("button", { name: "Try the project brief" }).click();
  await expect(page.getByRole("dialog").getByRole("heading", { name: "Tell us what’s next." })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test("tablet uses two columns without horizontal document overflow", async ({ page }) => {
  await page.setViewportSize({ width: 800, height: 1000 });
  const columns = await page.locator(".project-collection").evaluate(element => getComputedStyle(element).gridTemplateColumns.split(" ").length);
  expect(columns).toBe(2);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test("small phones keep artwork, controls and brief inside the viewport", async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 320, height: 740 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await expect(page.locator(".menu-toggle")).toBeVisible();
  await expect(page.locator(".desktop-nav")).not.toBeVisible();
  await openBrief(page);
  const dialog = page.getByRole("dialog");
  expect(await dialog.evaluate(element => element.scrollWidth <= element.clientWidth)).toBe(true);
  await fillBrief(page);
  await dialog.getByLabel("03 / What are you hoping to change?", { exact: true }).fill("                        ");
  expect(await dialog.locator("form").evaluate(form => (form as HTMLFormElement).checkValidity())).toBe(false);
  await dialog.getByRole("button", { name: "Reset brief" }).click();
  expect(await dialog.locator("textarea").evaluate(input => (input as HTMLTextAreaElement).validity.customError)).toBe(false);
  await fillBrief(page);
  await dialog.getByRole("button", { name: "Confirm local brief" }).click();
  await expect(dialog.getByRole("heading", { name: "A good start, Taylor Example." })).toBeVisible();
  await dialog.screenshot({ path: testInfo.outputPath("brief-confirm-small.png") });
});
