import { test, expect, type Page } from "@playwright/test";

async function openProject(page: Page) {
  await page.getByRole("button", { name: "Start a project", exact: true }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
}
async function fillDemo(page: Page) {
  await page.getByLabel("Creative alias").fill("Studio Fox");
  await page.getByLabel("Fictional email").fill("fox@example.com");
  await page.getByLabel("Concept portfolio URL").fill("https://portfolio.example");
  await page.getByLabel("What could we make together?").fill("A fictional neighborhood garden website.");
  await page.getByLabel("Imagined kickoff date").fill("2030-01-15");
}
test.beforeEach(async ({ page }) => { await page.goto("/"); });

test("people discovery has exact departments, expansion, combined search and empty recovery", async ({ page }) => {
  await expect(page.getByRole("heading", { name: "The people behind the pixels." })).toBeVisible();
  await expect(page.locator(".person")).toHaveCount(8);
  await page.getByRole("button", { name: "View all 32 team members" }).click();
  await expect(page.locator(".person")).toHaveCount(32);
  for (const [name, count] of [["Design", 10], ["Engineering", 12], ["Strategy", 5], ["Operations", 5]] as const) {
    await page.getByRole("button", { name: `${name} ${count}`, exact: true }).click();
    await expect(page.locator(".person")).toHaveCount(count);
  }
  await page.getByRole("button", { name: "Design 10", exact: true }).click();
  await page.getByRole("searchbox", { name: "Search the team" }).fill("synthesizers");
  await expect(page.locator(".person")).toHaveCount(1);
  await expect(page.locator(".person")).toContainText("Aiko Tanaka");
  await page.getByRole("button", { name: "Engineering 12", exact: true }).click();
  await expect(page.getByText("No matching humans (yet).")).toBeVisible();
  await page.getByRole("button", { name: "Reset team filters" }).click();
  await expect(page.locator(".person")).toHaveCount(8);
  await expect(page.getByRole("searchbox")).toHaveValue("");
});

test("leadership and crew biographies, safe socials, native keyboard dialog and focus restoration", async ({ page }) => {
  const trigger = page.getByRole("button", { name: "Read Rachel Kim’s biography" });
  await trigger.click();
  const dialog = page.getByRole("dialog");
  await expect(dialog.getByRole("heading", { name: "Rachel Kim", exact: true })).toBeVisible();
  await expect(dialog).toContainText("Invented person");
  await expect(dialog.getByRole("button", { name: "Close dialog" })).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(dialog.getByRole("button", { name: "Twitter demo", exact: true })).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(dialog.getByRole("button", { name: "Close dialog" })).toBeFocused();
  await dialog.getByRole("button", { name: "LinkedIn demo", exact: true }).click();
  await expect(dialog).toContainText("We don’t link to real accounts");
  await dialog.getByRole("button", { name: "Back to biography" }).click();
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(trigger).toBeFocused();
  await page.getByRole("button", { name: "Meet Sofia Reyes", exact: true }).click();
  await expect(dialog).toContainText("typeface");
  await dialog.getByRole("button", { name: "Close dialog" }).click();
  await expect(page.getByRole("button", { name: "Meet Sofia Reyes", exact: true })).toBeFocused();
});

test("culture gallery cycles all four original moments and wraps", async ({ page }) => {
  await expect(page.getByRole("heading", { name: "Craft Over Speed" })).toBeVisible();
  await page.getByRole("button", { name: "Explore the quarterly reset gallery" }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toContainText("1 of 4");
  await dialog.getByRole("button", { name: "Previous culture image" }).click();
  await expect(dialog).toContainText("4 of 4");
  for (let i = 1; i <= 3; i++) {
    await dialog.getByRole("button", { name: "Next culture image" }).click();
    await expect(dialog).toContainText(`${i} of 4`);
  }
  await page.keyboard.press("Escape");
  await expect(page.getByRole("button", { name: "Explore the quarterly reset gallery" })).toBeFocused();
});

test("every career opens details, archival notice and local-only application", async ({ page }) => {
  const roles = ["Senior Product Designer", "Full-Stack Engineer (Next.js)", "Content Strategist", "Design Intern — Summer 2026"];
  for (const role of roles) {
    await page.locator(".job").filter({ hasText: role }).click();
    const dialog = page.getByRole("dialog");
    await expect(dialog.getByRole("heading", { name: role, exact: true })).toBeVisible();
    await expect(dialog).toContainText("Not an actual vacancy");
    if (role.includes("Intern")) await expect(dialog).toContainText("archival");
    await dialog.getByRole("button", { name: "Try the demo application" }).click();
    await expect(page.getByLabel("Creative alias")).toBeVisible();
    await expect(page.getByLabel("Imagined kickoff date")).toHaveCount(0);
    await page.getByRole("button", { name: "Close dialog" }).click();
  }
  await page.getByRole("button", { name: "Send open application" }).click();
  await page.getByLabel("Creative alias").fill("Invented Finch");
  await page.getByLabel("Fictional email").fill("finch@example.com");
  await page.getByLabel("What lights you up?").fill("I imagine playful accessible interactions.");
  await page.getByRole("button", { name: "Confirm locally" }).click();
  await expect(page.getByRole("dialog").getByRole("status")).toContainText("Nothing was sent or saved");
});

test("project form enforces native required email URL date and length validation", async ({ page }) => {
  await openProject(page);
  const submit = page.getByRole("button", { name: "Confirm locally" });
  await submit.click();
  await expect(page.getByLabel("Creative alias")).toBeFocused();
  await fillDemo(page);
  await page.getByLabel("Fictional email").fill("not-an-email");
  await submit.click();
  await expect(page.getByLabel("Fictional email")).toBeFocused();
  expect(await page.getByLabel("Fictional email").evaluate((el: HTMLInputElement) => el.validity.typeMismatch)).toBe(true);
  await page.getByLabel("Fictional email").fill("fox@example.com");
  await page.getByLabel("Concept portfolio URL").fill("not-a-url");
  await submit.click();
  await expect(page.getByLabel("Concept portfolio URL")).toBeFocused();
  await page.getByLabel("Concept portfolio URL").fill("https://portfolio.example");
  await page.getByLabel("Imagined kickoff date").fill("2000-01-01");
  await submit.click();
  expect(await page.getByLabel("Imagined kickoff date").evaluate((el: HTMLInputElement) => el.validity.rangeUnderflow)).toBe(true);
  await page.getByLabel("Imagined kickoff date").fill("2030-01-15");
  await page.getByLabel("What could we make together?").fill("short");
  await submit.click();
  expect(await page.getByLabel("What could we make together?").evaluate((el: HTMLTextAreaElement) => el.validity.tooShort)).toBe(true);
  await expect(page.getByRole("button", { name: "Start a fresh demo" })).toHaveCount(0);
});

test("local error recovery, reset, confirmation and reopening do not retain invented input", async ({ page }) => {
  const requests: string[] = [];
  page.on("request", r => { if (r.method() === "POST") requests.push(r.url()); });
  await openProject(page);
  await fillDemo(page);
  await page.getByLabel("Simulate a local submission error").check();
  await page.getByRole("button", { name: "Confirm locally" }).click();
  await expect(page.getByRole("dialog").getByRole("alert")).toContainText("nothing was sent");
  await expect(page.getByLabel("Creative alias")).toHaveValue("Studio Fox");
  await page.getByRole("button", { name: "Reset fields" }).click();
  await expect(page.getByRole("dialog").getByRole("alert")).toHaveCount(0);
  await expect(page.getByLabel("Creative alias")).toHaveValue("");
  await expect(page.getByLabel("Simulate a local submission error")).not.toBeChecked();
  await fillDemo(page);
  await page.getByLabel("Simulate a local submission error").check();
  await page.getByRole("button", { name: "Confirm locally" }).click();
  await page.getByLabel("Simulate a local submission error").uncheck();
  await page.getByRole("button", { name: "Confirm locally" }).click();
  await expect(page.getByRole("dialog").getByRole("status")).toContainText("Nothing was sent or saved");
  await page.getByRole("button", { name: "Start a fresh demo" }).click();
  await expect(page.getByLabel("Creative alias")).toHaveValue("");
  await page.getByRole("button", { name: "Close dialog" }).click();
  await openProject(page);
  await expect(page.getByLabel("Fictional email")).toHaveValue("");
  expect(requests).toEqual([]);
});

test("concept work CTA has no client claims and connects to project inquiry", async ({ page }) => {
  await page.getByRole("button", { name: "View our work", exact: true }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toContainText("not delivered client work");
  await expect(dialog.locator(".work-concepts article")).toHaveCount(3);
  await dialog.getByRole("button", { name: "Imagine something with us" }).click();
  await expect(dialog.getByRole("heading", { name: "Start a project" })).toBeVisible();
});

test("responsive navigation, reduced motion, overflow and final renders", async ({ page }, testInfo) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  expect(await page.locator("html").evaluate(el => getComputedStyle(el).scrollBehavior)).toBe("auto");
  if (testInfo.project.name === "mobile") {
    await page.getByRole("button", { name: "Open navigation" }).click();
    await expect(page.getByRole("navigation")).toBeVisible();
    await page.getByRole("navigation").getByRole("link", { name: "Studio life" }).click();
    await expect(page.getByRole("navigation")).not.toBeVisible();
    await page.getByRole("button", { name: "Open navigation" }).click();
    await page.getByRole("button", { name: "Close navigation" }).click();
  } else {
    await expect(page.getByRole("button", { name: "Open navigation" })).not.toBeVisible();
  }
  expect(await page.locator(".scene-label svg").first().evaluate(el => el.getBoundingClientRect().width)).toBeLessThanOrEqual(24);
  for (const id of ["main", "crew", "culture", "careers"]) {
    await page.locator(`#${id}`).scrollIntoViewIfNeeded();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  }
  const viewport = page.viewportSize()!;
  for (const width of [320, 768, 1024]) {
    await page.setViewportSize({ width, height: 900 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    if (width === 768) {
      expect(await page.locator(".leaders").evaluate(el => getComputedStyle(el).gridTemplateColumns.split(" ").length)).toBe(2);
    }
  }
  await page.setViewportSize(viewport);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: testInfo.outputPath(`${testInfo.project.name}-full.png`), fullPage: true });
  await page.screenshot({ path: testInfo.outputPath(`${testInfo.project.name}-hero.png`) });
});
