import { test, expect, type Page } from "@playwright/test";

async function fillBrief(page: Page) {
  await page.getByLabel("Your name").fill("Alex Example");
  await page.getByLabel("Email address").fill("alex@example.test");
  await page.getByLabel("Company / organization").fill("Example Arts");
  await page.getByLabel("Website", { exact: true }).fill("https://example.test");
  await page.getByLabel("Project type").selectOption("Brand identity");
  await page.getByLabel("Budget range").selectOption("Not sure yet");
  await page.getByLabel("Ideal start date").fill("2027-12-01");
  await page.getByLabel("How did you find me?").selectOption("Referral");
  await page.getByLabel("A little about your project").fill("We are exploring a clear new identity for a community art space.");
  await page.getByRole("checkbox", { name: /I understand/ }).check();
}

test("selected work filters, keyboard states, search empty and recovery", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /Thoughtful/ })).toBeVisible();
  await expect(page.locator(".project-card")).toHaveCount(6);
  for (const [category, count] of [["Brand Identity", 2], ["Campaign", 1], ["Packaging", 1], ["Editorial", 1], ["Digital", 1]] as const) {
    const filter = page.getByRole("button", { name: category, exact: true });
    await filter.focus();
    await page.keyboard.press("Enter");
    await expect(filter).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator(".project-card")).toHaveCount(count);
    await expect(page.getByRole("status").first()).toContainText(`${count}`);
  }
  await page.getByLabel("Search projects").fill("No such project");
  await expect(page.getByRole("heading", { name: "No projects in this selection." })).toBeVisible();
  await page.getByRole("button", { name: "Reset filters" }).click();
  await expect(page.locator(".project-card")).toHaveCount(6);
  await page.getByLabel("Search projects").fill("fieldwork");
  await expect(page.locator(".project-card")).toHaveCount(1);
  await page.getByRole("link", { name: "View Fieldwork case study" }).click();
  await expect(page).toHaveURL(/work\/fieldwork/);
  await expect(page.getByRole("heading", { name: "Fieldwork." })).toBeVisible();
});

test("all six detailed case studies, metadata, next-project and unknown route", async ({ page, request }) => {
  const slugs = ["common-ground", "offbeat", "fieldwork", "margin-notes", "open-index", "slow-days"];
  for (const slug of slugs) {
    await page.goto(`/work/${slug}`);
    await expect(page).toHaveTitle(/concept \/ Mara Vale/);
    await expect(page.locator(".case-story section")).toHaveCount(5);
    await expect(page.getByText("Role / collaborators", { exact: true })).toBeVisible();
    await expect(page.locator(".case-story")).toContainText(/concept|hypothetical|imagined|speculative/);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", `https://mara-vale.example/work/${slug}`);
    await expect(page.locator(".gallery-trigger")).toHaveCount(3);
  }
  await page.getByRole("link", { name: /NEXT PROJECT/ }).click();
  await expect(page).toHaveURL(/work\/common-ground/);
  const missing = await request.get("/work/missing-project");
  expect(missing.status()).toBe(404);
  await page.goto("/work/missing-project");
  await page.getByRole("link", { name: /Return to selected work/ }).click();
  await expect(page).toHaveURL(/\/#work$/);
});

test("gallery keyboard wrap, native modal trap and focus restoration", async ({ page }) => {
  await page.goto("/work/common-ground");
  const trigger = page.getByRole("button", { name: "Enlarge Identity / primary mark" });
  await trigger.focus();
  await page.keyboard.press("Enter");
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(page.getByRole("button", { name: "Close gallery" })).toBeFocused();
  await page.keyboard.press("ArrowLeft");
  await expect(dialog).toContainText("Study 3 of 3");
  await expect(dialog.getByRole("img")).toHaveAttribute("aria-label", /Three original vector sketches/);
  await page.keyboard.press("ArrowRight");
  await expect(dialog).toContainText("Study 1 of 3");
  await page.getByRole("button", { name: "Next artwork" }).click();
  await expect(dialog).toContainText("Study 2 of 3");
  await expect(dialog.getByRole("img")).toHaveAttribute("aria-label", /six-column grid/);
  await page.getByRole("button", { name: "Previous artwork" }).click();
  await page.getByRole("button", { name: "Close gallery" }).focus();
  await page.keyboard.press("Shift+Tab");
  await expect(page.getByRole("button", { name: "Next artwork" })).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(trigger).toBeFocused();
});

test("service-specific inquiry and case contextual inquiry preserve selection", async ({ page }) => {
  await page.goto("/#services");
  await page.getByRole("link", { name: /Let’s talk campaign art direction/ }).click();
  await expect(page.getByLabel("Project type")).toHaveValue("Campaign art direction");
  await page.goto("/work/fieldwork");
  await page.getByRole("link", { name: "Discuss a packaging project" }).click();
  await expect(page.getByLabel("Project type")).toHaveValue("Packaging & editorial");
  await page.goto("/inquiry?service=unknown");
  await expect(page.getByLabel("Project type")).toHaveValue("");
});

test("native required, email, URL, date, summary, budget and consent validation", async ({ page }) => {
  await page.goto("/inquiry");
  await page.getByRole("button", { name: "Send project inquiry" }).click();
  await expect(page.getByLabel("Your name")).toBeFocused();
  await fillBrief(page);
  await page.getByLabel("Your name").fill("   ");
  await page.getByRole("button", { name: "Send project inquiry" }).click();
  await expect(page.getByLabel("Your name")).toBeFocused();
  await page.getByLabel("Your name").fill("Alex Example");
  for (const [field, invalid, valid, property] of [
    ["Email address", "bad-email", "alex@example.test", "typeMismatch"],
    ["Website", "not-a-url", "https://example.test", "typeMismatch"],
    ["Ideal start date", "2020-01-01", "2027-12-01", "rangeUnderflow"]
  ] as const) {
    const input = page.getByLabel(field, { exact: field === "Website" });
    await input.fill(invalid);
    expect(await input.evaluate((element, prop) => (element as HTMLInputElement).validity[prop as keyof ValidityState], property)).toBe(true);
    await input.fill(valid);
  }
  await page.getByLabel("A little about your project").fill("Too short");
  await page.getByRole("button", { name: "Send project inquiry" }).click();
  await expect(page.getByLabel("A little about your project")).toBeFocused();
  await page.getByLabel("A little about your project").fill("                           ");
  expect(await page.getByLabel("A little about your project").evaluate(e => (e as HTMLTextAreaElement).validity.customError)).toBe(true);
  await page.getByLabel("A little about your project").fill("A valid summary with enough meaningful detail.");
  await page.getByLabel("Budget range").selectOption("");
  expect(await page.getByLabel("Budget range").evaluate(e => (e as HTMLSelectElement).validity.valueMissing)).toBe(true);
  await page.getByLabel("Budget range").selectOption("Not sure yet");
  await page.getByRole("checkbox", { name: /I understand/ }).uncheck();
  await page.getByRole("button", { name: "Send project inquiry" }).click();
  await expect(page.getByRole("checkbox", { name: /I understand/ })).toBeFocused();
  await expect(page.getByRole("heading", { name: /Brief received/ })).not.toBeVisible();
  await page.getByLabel("A little about your project").fill("   ");
  await page.getByRole("button", { name: "Reset form" }).click();
  await expect(page.getByLabel("Your name")).toHaveValue("");
  await expect(page.getByLabel("Your name")).toBeFocused();
  expect(await page.getByLabel("A little about your project").evaluate(e => (e as HTMLTextAreaElement).validity.customError)).toBe(false);
});

test("local inquiry loading, error preservation, retry, confirmation and reset", async ({ page }) => {
  const submissions: string[] = [];
  page.on("request", req => { if (req.method() === "POST") submissions.push(req.url()); });
  await page.goto("/inquiry");
  await fillBrief(page);
  await page.getByText("Demo testing options", { exact: true }).click();
  await page.getByRole("checkbox", { name: /Simulate a delivery error/ }).check();
  await page.getByRole("button", { name: "Send project inquiry" }).click();
  await expect(page.getByRole("button", { name: "Preparing your brief…" })).toBeDisabled();
  await expect(page.locator(".inquiry-panel").getByRole("alert")).toContainText("Your brief is still here");
  await expect(page.getByLabel("Your name")).toHaveValue("Alex Example");
  await expect(page.getByRole("checkbox", { name: /Simulate a delivery error/ })).not.toBeChecked();
  await page.getByRole("button", { name: "Send project inquiry" }).click();
  await expect(page.getByRole("heading", { name: "Brief received, Alex Example." })).toBeVisible();
  await expect(page.locator(".confirmation")).toBeFocused();
  await expect(page.locator(".confirmation")).toContainText("Nothing was sent or saved");
  expect(submissions).toEqual([]);
  await page.getByRole("button", { name: "Start another inquiry" }).click();
  await expect(page.getByLabel("Your name")).toHaveValue("");
  await expect(page.getByLabel("Your name")).toBeFocused();
  await expect(page.getByLabel("Budget range")).toHaveValue("");
});

test("navigation, capabilities download, SEO and content honesty", async ({ page, request, isMobile }) => {
  await page.goto("/");
  if (isMobile) {
    await page.getByRole("button", { name: "Open menu" }).click();
    await expect(page.getByRole("button", { name: "Close menu" })).toHaveAttribute("aria-expanded", "true");
    await page.keyboard.press("Tab");
    await page.keyboard.press("Escape");
    await expect(page.getByRole("button", { name: "Open menu" })).toBeFocused();
    await page.getByRole("button", { name: "Open menu" }).click();
    await page.getByRole("navigation", { name: "Mobile navigation" }).getByRole("link", { name: "About" }).click();
    await expect(page.getByRole("navigation", { name: "Mobile navigation" })).not.toBeVisible();
  } else {
    await page.getByRole("navigation", { name: "Main navigation" }).getByRole("link", { name: "About" }).click();
  }
  await expect(page).toHaveURL(/#about/);
  const download = page.waitForEvent("download");
  await page.getByRole("link", { name: "Download the concept capabilities deck" }).click();
  expect((await download).suggestedFilename()).toBe("mara-vale-capabilities.txt");
  const file = await request.get("/mara-vale-capabilities.txt");
  expect(await file.text()).toContain("Fictional designer");
  expect(await (await request.get("/robots.txt")).text()).toContain("Disallow: /");
  const sitemap = await (await request.get("/sitemap.xml")).text();
  expect(sitemap.match(/<loc>/g)).toHaveLength(8);
  await expect(page.locator(".demo-banner")).toContainText("FICTIONAL DESIGNER");
  await expect(page.locator(".testimonial")).toHaveCount(2);
  await expect(page.getByRole("link", { name: "hello@mara-vale.example" })).toHaveAttribute("href", "mailto:hello@mara-vale.example");
});

test("reduced motion, no overflow, original art and final render capture", async ({ page }, testInfo) => {
  const errors: string[] = [];
  page.on("pageerror", e => errors.push(e.message));
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator(".project-art > svg")).toHaveCount(6);
  await expect(page.locator(".project-art > svg").first()).toHaveAttribute("aria-label", /interlocking arches/);
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior)).toBe("auto");
  for (const route of ["/", "/work/common-ground", "/inquiry"]) {
    await page.goto(route);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  }
  await page.goto("/");
  await page.screenshot({ path: testInfo.outputPath("home-full.png"), fullPage: true });
  await page.locator("#work").scrollIntoViewIfNeeded();
  await page.screenshot({ path: testInfo.outputPath("selected-work.png") });
  await page.goto("/work/common-ground");
  await page.screenshot({ path: testInfo.outputPath("case-study.png"), fullPage: true });
  expect(errors).toEqual([]);
});
