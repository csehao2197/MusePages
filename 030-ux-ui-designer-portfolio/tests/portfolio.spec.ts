import { test, expect, type Page } from "@playwright/test";

async function openCase(page: Page, name: string) {
  await page.getByRole("button", { name: `View ${name} case study`, exact: true }).click();
  return page.getByRole("dialog", { name: `${name} case study`, exact: true });
}
async function fillInquiry(page: Page) {
  const form = page.locator(".contact-card");
  await form.getByLabel("Your name", { exact: true }).fill("Alex Example");
  await form.getByLabel("Email address").fill("alex@example.com");
  await form.getByLabel("What do you have in mind?").selectOption("Design System");
  await form.getByLabel("Planning budget").fill("5000");
  await form.getByLabel("Preferred start date").fill("2099-06-18");
  await form.getByLabel("A little about your project").fill("A fictional design system for a local SaaS product concept.");
  await form.getByLabel("I understand this is fictional").check();
  return form;
}

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("tailored portfolio, disclaimers, original screens and responsive renders", async ({ page }, testInfo) => {
  const errors: string[] = [];
  page.on("pageerror", e => errors.push(e.message));
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(/I design digital products that people enjoy using/);
  await expect(page.locator(".project-card")).toHaveCount(4);
  await expect(page.locator(".hero-tablet")).toBeVisible();
  await expect(page.locator(".phone").first()).toBeVisible();
  await expect(page.getByText("Fictional designer. Original work. No brand affiliations.", { exact: false })).toBeVisible();
  await expect(page.getByText("Fictional quotes, not real testimonials.", { exact: false })).toBeVisible();
  for (const selector of [".hero", "#work", "#process", "#about", "#contact", "footer"]) {
    await page.locator(selector).scrollIntoViewIfNeeded();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: testInfo.outputPath(`${testInfo.project.name}-home.png`), fullPage: true });
  if (testInfo.project.name === "desktop") {
    for (const width of [320, 768, 1024]) {
      await page.setViewportSize({ width, height: 900 });
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    }
  }
  expect(errors).toEqual([]);
});

test("category and search filters combine, empty state recovers", async ({ page }) => {
  await page.getByRole("button", { name: "SaaS", exact: true }).click();
  await expect(page.locator(".project-card")).toHaveCount(2);
  await page.getByRole("textbox", { name: "Search projects" }).fill("analytics");
  await expect(page.locator(".project-card")).toHaveCount(1);
  await expect(page.locator(".project-card")).toContainText("Stripe Dashboard Analytics");
  await page.getByRole("textbox", { name: "Search projects" }).fill("nothing matches");
  await expect(page.getByRole("heading", { name: "No projects in this corner." })).toBeVisible();
  await page.getByRole("button", { name: "Reset filters" }).click();
  await expect(page.locator(".project-card")).toHaveCount(4);
  await expect(page.getByRole("textbox", { name: "Search projects" })).toHaveValue("");
  await page.getByRole("button", { name: "Healthcare", exact: true }).click();
  await expect(page.locator(".project-card")).toHaveCount(1);
  await expect(page.locator(".project-card")).toContainText("HealthTrack");
});

test("case narratives, research qualification, before-after and case navigation", async ({ page }, testInfo) => {
  let dialog = await openCase(page, "Notion Calendar Redesign");
  await expect(dialog.getByRole("heading", { name: "The challenge", exact: true })).toBeVisible();
  await expect(dialog).toContainText("not measured outcomes");
  await dialog.getByRole("button", { name: "Research", exact: true }).click();
  await expect(dialog).toContainText("No participants were recruited");
  await expect(dialog.getByLabel("Design iteration flow")).toBeVisible();
  await dialog.getByRole("button", { name: "Design", exact: true }).click();
  await dialog.getByRole("button", { name: "Before / exploration A" }).click();
  await expect(dialog.locator(".comparison-flow")).toContainText("Hidden conflict");
  await dialog.getByRole("button", { name: "After / exploration B" }).click();
  await expect(dialog.locator(".comparison-flow")).toContainText("Conflict check");
  expect(await dialog.evaluate(el => el.scrollWidth <= el.clientWidth)).toBe(true);
  await page.screenshot({ path: testInfo.outputPath(`${testInfo.project.name}-case.png`) });
  for (const name of ["Stripe Dashboard Analytics", "Figma Plugin Manager", "HealthTrack Patient Portal"]) {
    await dialog.getByRole("button", { name: "Next case", exact: true }).click();
    dialog = page.getByRole("dialog", { name: `${name} case study`, exact: true });
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole("heading", { name: "The challenge", exact: true })).toBeVisible();
    await dialog.getByRole("button", { name: "Research", exact: true }).click();
    await expect(dialog).toContainText("No user interviews, usability sessions");
    await dialog.getByRole("button", { name: "Design", exact: true }).click();
    await expect(dialog.getByRole("heading", { name: "What changed, and why" })).toBeVisible();
  }
  await dialog.getByRole("button", { name: "Previous case", exact: true }).click();
  await expect(page.getByRole("dialog", { name: "Figma Plugin Manager case study", exact: true })).toBeVisible();
});

test("calendar prototype validates, detects conflict, confirms and resets", async ({ page }) => {
  const dialog = await openCase(page, "Notion Calendar Redesign");
  await dialog.getByRole("button", { name: "Prototype", exact: true }).click();
  await dialog.getByRole("button", { name: "Create local event" }).click();
  expect(await dialog.getByLabel("Event title").evaluate((el: HTMLInputElement) => el.validity.valueMissing)).toBe(true);
  await dialog.getByLabel("Event title").fill("Focus on the details");
  await dialog.getByLabel("Workspace", { exact: true }).selectOption("Personal");
  await dialog.getByLabel("Event date").fill("2020-01-01");
  expect(await dialog.getByLabel("Event date").evaluate((el: HTMLInputElement) => el.validity.rangeUnderflow)).toBe(true);
  await dialog.getByLabel("Event date").fill("2099-06-18");
  await dialog.getByLabel("Time", { exact: true }).selectOption("11:00");
  await dialog.getByRole("button", { name: "Create local event" }).click();
  await expect(dialog.getByRole("alert")).toContainText("Time conflict");
  await expect(dialog.getByLabel("Event title")).toHaveValue("Focus on the details");
  await dialog.getByLabel("Time", { exact: true }).selectOption("14:00");
  await dialog.getByRole("button", { name: "Create local event" }).click();
  await expect(dialog.getByRole("status")).toContainText("Personal workspace");
  await expect(dialog.getByRole("status")).toContainText("No event or appointment was actually booked");
  await dialog.getByRole("button", { name: "Try another event" }).click();
  await expect(dialog.getByLabel("Event title")).toHaveValue("");
  await expect(dialog.getByLabel("Workspace", { exact: true })).toHaveValue("Studio");
  await dialog.getByLabel("Event title").fill("Another local event");
  await dialog.getByRole("button", { name: "Reset", exact: true }).click();
  await expect(dialog.getByLabel("Event title")).toHaveValue("");
});

test("analytics period values, no-data recovery and simulated error", async ({ page }) => {
  const dialog = await openCase(page, "Stripe Dashboard Analytics");
  await dialog.getByRole("button", { name: "Prototype", exact: true }).click();
  await expect(dialog.locator(".live-stats")).toContainText("$48,290");
  await dialog.getByLabel("Reporting period").selectOption("week");
  await expect(dialog.locator(".live-stats")).toContainText("$12,140");
  await expect(dialog.getByRole("table")).toContainText("$8,000");
  await dialog.getByLabel("Reporting period").selectOption("empty");
  await expect(dialog.getByRole("heading", { name: "No activity in this period" })).toBeVisible();
  await dialog.getByRole("button", { name: "Show this month" }).click();
  await expect(dialog.locator(".live-stats")).toContainText("$48,290");
  await dialog.getByRole("button", { name: "Simulate refresh error" }).click();
  await expect(dialog.getByRole("alert")).toContainText("Existing fictional data is unchanged");
  await dialog.getByRole("button", { name: "Dismiss error" }).click();
  await expect(dialog.getByRole("alert")).toHaveCount(0);
});

test("plugin category, reversible local install, empty state and reset", async ({ page }) => {
  const dialog = await openCase(page, "Figma Plugin Manager");
  await dialog.getByRole("button", { name: "Prototype", exact: true }).click();
  await dialog.getByLabel("Plugin category").selectOption("Color");
  await expect(dialog.locator(".live-plugin-list>div")).toHaveCount(1);
  await dialog.getByRole("button", { name: "Install Palette lab", exact: true }).click();
  await expect(dialog.getByRole("status")).toContainText("installed in this local demo only");
  await dialog.getByRole("button", { name: "Remove Palette lab", exact: true }).click();
  await expect(dialog.getByRole("status")).toContainText("removed");
  await dialog.getByLabel("Plugin category").selectOption("Animation");
  await expect(dialog.getByRole("heading", { name: "No animation plugins yet." })).toBeVisible();
  await dialog.getByRole("button", { name: "Show all plugins" }).click();
  await expect(dialog.locator(".live-plugin-list>div")).toHaveCount(3);
  await dialog.getByRole("button", { name: "Install Type scale", exact: true }).click();
  await dialog.getByRole("button", { name: "Reset toolkit" }).click();
  await expect(dialog.getByRole("button", { name: "Install Type scale", exact: true })).toBeVisible();
  await expect(dialog.getByRole("status")).toContainText("No plugins installed");
});

test("patient appointment date validation, confirmation and reset", async ({ page }) => {
  const dialog = await openCase(page, "HealthTrack Patient Portal");
  await dialog.getByRole("button", { name: "Prototype", exact: true }).click();
  await dialog.getByRole("button", { name: "Confirm local appointment" }).click();
  expect(await dialog.getByLabel("Appointment date").evaluate((el: HTMLInputElement) => el.validity.valueMissing)).toBe(true);
  await dialog.getByLabel("Appointment date").fill("2099-06-18");
  await dialog.getByLabel("Time", { exact: true }).selectOption("10:00");
  await dialog.getByRole("button", { name: "Confirm local appointment" }).click();
  await expect(dialog.getByRole("status")).toContainText("2099-06-18 at 10:00");
  await dialog.getByRole("button", { name: "Try another appointment" }).click();
  await expect(dialog.getByLabel("Appointment date")).toHaveValue("");
});

test("process steps change substantive detail and concept profiles stay local", async ({ page }) => {
  await page.getByRole("button", { name: /02 Define/ }).click();
  await expect(page.locator(".process-detail")).toContainText("job to be done");
  await page.getByRole("button", { name: /03 Design/ }).click();
  await expect(page.locator(".process-detail")).toContainText("not completed usability studies");
  await page.getByRole("button", { name: /04 Deliver/ }).click();
  await expect(page.locator(".process-detail")).toContainText("no production impact");
  await page.getByRole("button", { name: "Connect on LinkedIn" }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toContainText("no verified profile");
  await dialog.getByRole("button", { name: "Try the local inquiry" }).click();
  await expect(dialog).not.toBeVisible();
  await expect(page.locator("#contact")).toBeInViewport();
});

test("fictional resume download is a real local document", async ({ page }) => {
  const event = page.waitForEvent("download");
  await page.getByRole("link", { name: "Download Resume" }).click();
  const download = await event;
  expect(download.suggestedFilename()).toBe("ava-chen-concept-resume.txt");
  expect(await download.failure()).toBeNull();
  const response = await page.request.get("/ava-chen-concept-resume.txt");
  expect(response.ok()).toBe(true);
  expect(await response.text()).toContain("not a real person's employment history");
  await expect(page.getByRole("status").filter({ hasText: "résumé downloaded" })).toBeVisible();
});

test("inquiry uses native validation for email, dates, budget and required fields", async ({ page }) => {
  const form = page.locator(".contact-card");
  await form.getByRole("button", { name: "Review Message" }).click();
  expect(await form.getByLabel("Your name", { exact: true }).evaluate((el: HTMLInputElement) => el.validity.valueMissing)).toBe(true);
  await fillInquiry(page);
  await form.getByLabel("Email address").fill("not-an-email");
  expect(await form.getByLabel("Email address").evaluate((el: HTMLInputElement) => el.validity.typeMismatch)).toBe(true);
  await form.getByRole("button", { name: "Review Message" }).click();
  await expect(form.locator(".review-state")).toHaveCount(0);
  await form.getByLabel("Email address").fill("alex@example.com");
  await form.getByLabel("Planning budget").fill("400");
  expect(await form.getByLabel("Planning budget").evaluate((el: HTMLInputElement) => el.validity.rangeUnderflow)).toBe(true);
  await form.getByLabel("Planning budget").fill("550");
  expect(await form.getByLabel("Planning budget").evaluate((el: HTMLInputElement) => el.validity.stepMismatch)).toBe(true);
  await form.getByLabel("Planning budget").fill("5000");
  await form.getByLabel("Preferred start date").fill("2020-01-01");
  expect(await form.getByLabel("Preferred start date").evaluate((el: HTMLInputElement) => el.validity.rangeUnderflow)).toBe(true);
  await form.getByRole("button", { name: "Review Message" }).click();
  await expect(form.locator(".review-state")).toHaveCount(0);
  await form.getByRole("button", { name: "Reset", exact: true }).click();
  await expect(form.getByLabel("Your name", { exact: true })).toHaveValue("");
  await expect(form.getByLabel("Planning budget")).toHaveValue("");
});

test("inquiry review, edit, simulated send error, retry, confirmation and reset", async ({ page }) => {
  const network: string[] = [];
  page.on("request", r => { if (!r.url().startsWith("http://127.0.0.1:3130")) network.push(r.url()); });
  const form = await fillInquiry(page);
  await form.getByText("Demo testing options", { exact: true }).click();
  await form.getByLabel("Simulate a local send failure").check();
  await form.getByRole("button", { name: "Review Message" }).click();
  await expect(form.getByRole("heading", { name: "A quick check before “send”." })).toBeFocused();
  await expect(form.locator("dl")).toContainText("$5000 USD");
  await form.getByRole("button", { name: "Edit draft" }).click();
  await expect(form.getByLabel("Your name", { exact: true })).toHaveValue("Alex Example");
  await expect(form.getByLabel("Your name", { exact: true })).toBeFocused();
  await form.getByRole("button", { name: "Review Message" }).click();
  await form.getByRole("button", { name: "Confirm Local Message" }).click();
  await expect(form.getByRole("alert")).toContainText("Your draft is intact");
  await form.getByRole("button", { name: "Retry local confirmation" }).click();
  await expect(form.getByRole("heading", { name: "A thoughtful beginning." })).toBeFocused();
  await expect(form).toContainText("No email was sent");
  await form.getByRole("button", { name: "Start a new inquiry" }).click();
  await expect(form.getByLabel("Your name", { exact: true })).toHaveValue("");
  await expect(form.getByLabel("I understand this is fictional")).not.toBeChecked();
  expect(network).toEqual([]);
});

test("keyboard dialog containment, escape focus return, nav and reduced motion", async ({ page }, testInfo) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const opener = page.getByRole("button", { name: "View Notion Calendar Redesign case study", exact: true });
  await opener.focus();
  await page.keyboard.press("Enter");
  const dialog = page.getByRole("dialog", { name: "Notion Calendar Redesign case study", exact: true });
  const close = dialog.getByRole("button", { name: "Close dialog" });
  await expect(close).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(dialog.getByRole("button", { name: "Next case", exact: true })).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(close).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(opener).toBeFocused();
  expect(await page.locator(".hero-copy").evaluate(el => getComputedStyle(el).animationName)).toBe("none");
  if (testInfo.project.name === "mobile") {
    const menu = page.getByRole("button", { name: "Open navigation" });
    await menu.click();
    const drawer = page.getByRole("dialog", { name: "Mobile navigation" });
    await expect(drawer.getByRole("button", { name: "Close navigation" })).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(menu).toBeFocused();
    await menu.click();
    await drawer.getByRole("link", { name: /03 Process/ }).click();
    await expect(drawer).not.toBeVisible();
    await expect(page.locator("#process")).toBeInViewport();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  } else {
    await page.getByRole("navigation", { name: "Main navigation" }).getByRole("link", { name: "About", exact: true }).click();
    await expect(page.locator("#about")).toBeInViewport();
  }
});
