import { expect, test, Page } from "@playwright/test";

const trial = (page: Page) => page.locator("#trial");
async function chooseProgram(page: Page, name: string, mobile: boolean) {
  if (mobile) await page.getByLabel("Choose a discipline", { exact: true }).selectOption({ label: name });
  else await page.getByRole("tab", { name: new RegExp(name) }).click();
}
async function prepareTrial(page: Page) {
  await trial(page).getByLabel("Fictional visitor alias").fill("River");
  await trial(page).getByLabel("Program interest").selectOption("BJJ");
  await trial(page).getByRole("radio", { name: /Fundamentals/ }).check();
}
test.beforeEach(async ({ page }) => { await page.goto("/"); });

test("original academy identity, safety disclosures and local-only requests", async ({ page }) => {
  const errors: string[] = [];
  const external: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  page.on("request", request => { if (!request.url().startsWith("http://127.0.0.1:3137/")) external.push(request.url()); });
  await page.reload();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("FORGE YOURSTRENGTH.FIND YOUR PATH.");
  await expect(page.locator(".demo-banner")).toContainText("FICTIONAL ACADEMY");
  await expect(page.locator(".hero")).toContainText("CHARLOTTE, NC");
  await expect(page.locator("#coaches")).toContainText("No real ranks, credentials");
  await expect(page.locator("#community")).toContainText("not testimonials");
  await expect(page.locator('input[type="email"], input[type="tel"], input[type="password"]')).toHaveCount(0);
  await expect(page.locator('a[href^="https:"], a[href^="mailto:"], a[href^="tel:"]')).toHaveCount(0);
  expect(await page.locator('a[href^="#"]').evaluateAll(anchors => anchors.every(anchor => document.getElementById(anchor.getAttribute("href")!.slice(1))))).toBe(true);
  expect(errors).toEqual([]);
  expect(external).toEqual([]);
});

test("discipline exploration has distinct groups and accessible selection", async ({ page, isMobile }) => {
  await chooseProgram(page, "Muay Thai", isMobile);
  await expect(page.getByRole("tabpanel")).toContainText("Focus has a rhythm.");
  await expect(page.getByRole("tabpanel").getByRole("button", { name: /Fight Team/ })).toBeVisible();
  await chooseProgram(page, "MMA", isMobile);
  await expect(page.getByRole("tabpanel").getByRole("button", { name: /Advanced MMA/ })).toBeVisible();
  await expect(page.getByRole("tabpanel")).not.toContainText("Kids BJJ");
  await chooseProgram(page, "Brazilian Jiu-Jitsu", isMobile);
  await expect(page.getByRole("tabpanel").getByRole("button", { name: /Kids BJJ/ })).toBeVisible();
  if (!isMobile) {
    await page.getByRole("tab", { name: /Brazilian/ }).focus();
    await page.keyboard.press("ArrowRight");
    await expect(page.getByRole("tab", { name: /Muay Thai/ })).toBeFocused();
    await expect(page.getByRole("tab", { name: /Muay Thai/ })).toHaveAttribute("aria-selected", "true");
    await page.keyboard.press("End");
    await expect(page.getByRole("tab", { name: /MMA/ })).toBeFocused();
  }
});

test("schedule filters, dates, full groups, empty state and recovery", async ({ page }) => {
  const schedule = page.locator("#schedule");
  await schedule.getByLabel("Discipline", { exact: true }).selectOption("Muay Thai");
  await schedule.getByLabel("Day", { exact: true }).selectOption("6");
  await expect(schedule.locator(".schedule-row")).toHaveCount(1);
  await expect(schedule.locator(".schedule-row")).toContainText("Cardio Kickboxing");
  await expect(schedule.locator(".schedule-row")).toContainText("Sat · 9 AM");
  await expect(schedule.locator(".schedule-row")).toContainText("Sample full");
  await schedule.getByLabel("Age group").selectOption("Youth 5–12");
  await expect(schedule.getByRole("heading", { name: "No class groups match." })).toBeVisible();
  await schedule.getByRole("button", { name: "Show all classes" }).click();
  await expect(schedule.locator(".schedule-row")).toHaveCount(11);
  await schedule.getByLabel("Find a class").fill("unlisted");
  await expect(schedule.locator(".schedule-row")).toHaveCount(0);
  await schedule.getByRole("button", { name: "Reset filters" }).click();
  await expect(schedule.locator(".schedule-row")).toHaveCount(11);
});

test("class details exclude experienced cohorts from trials and recover from full group", async ({ page }) => {
  const schedule = page.locator("#schedule");
  await schedule.getByRole("button", { name: "View Advanced BJJ details" }).click();
  const dialog = page.getByRole("dialog", { name: "Advanced BJJ" });
  await expect(dialog).toContainText("Coach approval required");
  await expect(dialog.getByRole("button", { name: "Choose this trial group" })).toHaveCount(0);
  await dialog.getByRole("button", { name: "Close details" }).click();
  await schedule.getByRole("button", { name: "View Cardio Kickboxing details" }).click();
  await expect(page.getByRole("dialog")).toContainText("sample group is full");
  await page.getByRole("dialog").getByRole("button", { name: "Find an introductory class" }).click();
  await expect(trial(page).getByLabel("Program interest")).toHaveValue("Muay Thai");
  await expect(trial(page).getByRole("radio", { name: /Foundations/ })).toBeVisible();
});

test("coach bio native modal traps keyboard focus, Escape restores trigger", async ({ page }) => {
  const trigger = page.getByRole("button", { name: "View bio for Sana Patel" });
  await trigger.click();
  const dialog = page.getByRole("dialog", { name: "Coach Sana Patel" });
  await expect(dialog).toBeVisible();
  await expect(dialog).toContainText("fictional coach persona");
  await dialog.getByRole("button", { name: "Explore this coach’s groups" }).focus();
  await page.keyboard.press("Tab");
  await expect(dialog.getByRole("button", { name: "Close details" })).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(dialog.getByRole("button", { name: "Explore this coach’s groups" })).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(dialog.getByRole("button", { name: "Close details" })).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(trigger).toBeFocused();
});

test("trial selection carries exact class, date, time, local capacity, confirmation and reset", async ({ page }) => {
  await page.locator("#schedule").getByRole("button", { name: "View MMA Fundamentals details" }).click();
  await page.getByRole("dialog").getByRole("button", { name: "Choose this trial group" }).click();
  await expect(trial(page).getByLabel("Program interest")).toHaveValue("MMA");
  await expect(trial(page).getByLabel("Preferred sample date")).toHaveValue("2026-11-03");
  await expect(trial(page).getByRole("radio", { name: /MMA Fundamentals/ })).toBeChecked();
  await trial(page).getByLabel("Fictional visitor alias").fill("River");
  await trial(page).getByRole("button", { name: "Book My Free Class" }).click();
  await expect(page.locator("#trial-confirmation")).toBeFocused();
  await expect(page.locator("#trial-confirmation")).toContainText("Tue, Nov 3, 2026 · 5 PM EST");
  await expect(page.locator("#trial-confirmation")).toContainText("No class was booked");
  await expect(page.locator("#trial-confirmation")).toContainText("$0.00");
  await trial(page).getByRole("button", { name: "Reset local trial" }).click();
  await expect(trial(page).getByLabel("Fictional visitor alias")).toHaveValue("");
  await expect(trial(page).getByLabel("Fictional visitor alias")).toBeFocused();
  await trial(page).getByLabel("Program interest").selectOption("MMA");
  await trial(page).getByLabel("Preferred sample date").fill("2026-11-03");
  await expect(trial(page).getByRole("radio", { name: /3 sample spaces/ })).toBeVisible();
});

test("trial validation and simulated service failure recover without a reservation", async ({ page }) => {
  await prepareTrial(page);
  await trial(page).getByLabel("Fictional visitor alias").fill("river@example.com");
  await trial(page).getByRole("button", { name: "Book My Free Class" }).click();
  await expect(trial(page).getByRole("alert")).toContainText("fictional alias");
  await trial(page).getByLabel("Fictional visitor alias").fill("River");
  await trial(page).getByLabel("Simulate a service error").check();
  await trial(page).getByRole("button", { name: "Book My Free Class" }).click();
  await expect(trial(page).getByRole("alert")).toContainText("Nothing was reserved");
  await expect(trial(page).getByRole("radio", { name: /5 sample spaces/ })).toBeVisible();
  await trial(page).getByLabel("Simulate a service error").uncheck();
  await trial(page).getByRole("button", { name: "Book My Free Class" }).click();
  await expect(page.locator("#trial-confirmation")).toBeVisible();
  await page.reload();
  await expect(page.locator("#trial-confirmation")).toHaveCount(0);
  await expect(trial(page).getByLabel("Fictional visitor alias")).toHaveValue("");
});

test("trial missing session, fixed date validity, full capacity and empty combination", async ({ page }) => {
  await trial(page).getByLabel("Fictional visitor alias").fill("River");
  await trial(page).getByRole("button", { name: "Book My Free Class" }).click();
  await expect(trial(page).getByRole("alert")).toContainText("Choose an available");
  await trial(page).getByLabel("Preferred sample date").fill("2026-11-01");
  expect(await trial(page).getByLabel("Preferred sample date").evaluate(el => (el as HTMLInputElement).validity.rangeUnderflow)).toBe(true);
  await trial(page).getByLabel("Preferred sample date").fill("2026-11-07");
  await trial(page).getByLabel("Program interest").selectOption("Muay Thai");
  await expect(trial(page).getByRole("radio", { name: /Cardio Kickboxing/ })).toBeDisabled();
  await trial(page).getByLabel("Age group").selectOption("Youth 5–12");
  await expect(trial(page)).toContainText("No introductory sessions");
  await trial(page).getByRole("button", { name: "Show Monday options" }).click();
  await expect(trial(page).getByRole("radio", { name: /Kids BJJ/ })).toBeVisible();
});

test("youth journey uses guardian alias and broad band without child identity", async ({ page }) => {
  await page.locator("#programs").getByRole("button", { name: /Kids BJJ/ }).click();
  await page.getByRole("dialog").getByRole("button", { name: "Choose this trial group" }).click();
  await expect(trial(page).getByLabel("Age group")).toHaveValue("Youth 5–12");
  await trial(page).getByLabel("Fictional guardian alias").fill("Oak");
  await expect(trial(page).getByRole("radio", { name: /Kids BJJ/ })).toBeChecked();
  await trial(page).getByRole("button", { name: "Book My Free Class" }).click();
  await expect(page.locator("#trial-confirmation")).toContainText("Fictional guardian");
  await expect(page.locator("#trial-confirmation")).toContainText("Mon, Nov 2, 2026 · 4:30 PM EST");
  await expect(page.locator("#trial-confirmation")).toContainText("Youth 5–12");
});

test("family price calculation, invalid coupon, first-month offer, preview and reset", async ({ page }) => {
  await page.getByRole("button", { name: "Start Training with Family Plan" }).click();
  const dialog = page.getByRole("dialog", { name: /Family Plan/ });
  await dialog.getByLabel("Number of fictional family members").selectOption("4");
  await expect(dialog.locator(".price-summary")).toContainText("$367.00");
  await dialog.getByLabel("Demo offer code").fill("WRONG");
  await dialog.getByRole("button", { name: "Confirm local membership preview" }).click();
  await expect(dialog.getByRole("alert")).toContainText("Unknown demo code");
  await dialog.getByLabel("Demo offer code").fill("ironpath50");
  await expect(dialog.locator(".price-summary")).toContainText("$183.50");
  await dialog.getByRole("button", { name: "Confirm local membership preview" }).click();
  await expect(dialog.locator(".plan-confirmation")).toBeFocused();
  await expect(dialog.locator(".plan-confirmation")).toContainText("4 members");
  await expect(dialog.locator(".plan-confirmation")).toContainText("$183.50");
  await expect(dialog.locator(".plan-confirmation")).toContainText("$367.00 / month");
  await expect(dialog.locator(".plan-confirmation")).toContainText("Due now$0.00");
  await dialog.getByRole("button", { name: "Reset membership preview" }).click();
  await expect(dialog.getByLabel("Number of fictional family members")).toBeFocused();
  await expect(dialog.getByLabel("Number of fictional family members")).toHaveValue("2");
  await expect(dialog.getByLabel("Demo offer code")).toHaveValue("");
  await expect(dialog.locator(".price-summary")).toContainText("$249.00");
});

test("single-discipline and all-access membership selections remain distinct", async ({ page }) => {
  await page.getByRole("button", { name: "Start Training with Single Discipline" }).click();
  await page.getByRole("dialog").getByLabel("Chosen discipline").selectOption("Muay Thai");
  await page.getByRole("dialog").getByRole("button", { name: "Confirm local membership preview" }).click();
  await expect(page.getByRole("dialog")).toContainText("Single Discipline · Muay Thai");
  await expect(page.getByRole("dialog")).toContainText("$129.00");
  await page.getByRole("dialog").getByRole("button", { name: "Close details" }).click();
  await page.getByRole("button", { name: "Start Training with All Access" }).click();
  await expect(page.getByRole("dialog").getByLabel("Chosen discipline")).toHaveCount(0);
  await page.getByRole("dialog").getByLabel("Demo offer code").fill("IRONPATH50");
  await expect(page.getByRole("dialog").locator(".price-summary")).toContainText("$84.50");
});

test("belts, gallery navigation and resource panels are functional", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.getByRole("button", { name: /Purple Belt/ }).click();
  await expect(page.locator(".belt-detail")).toContainText("PURPLE /");
  await page.getByRole("button", { name: "Previous facility", exact: true }).click();
  await expect(page.locator(".gallery-controls")).toContainText("6 / 6");
  await page.getByRole("button", { name: "Next facility", exact: true }).click();
  await expect(page.locator(".gallery-controls")).toContainText("1 / 6");
  await page.getByRole("button", { name: "Next facility", exact: true }).click();
  await expect(page.locator(".gallery-controls")).toContainText("2 / 6");
  await page.getByRole("button", { name: "Explore The MMA space" }).click();
  await expect(page.getByRole("dialog")).toContainText("Not a measured or safety-certified plan");
  await page.getByRole("dialog").getByRole("button", { name: "Next space" }).click();
  await expect(page.getByRole("dialog")).toContainText("The bag area");
  await page.getByRole("dialog").getByRole("button", { name: "Close details" }).click();
  await page.getByRole("button", { name: "FAQ", exact: true }).click();
  await expect(page.getByRole("dialog")).toContainText("Everything is held in memory");
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: "Charlotte, NC", exact: false }).click();
  await expect(page.getByRole("dialog")).toContainText("schematic, not navigation");
});

test("mobile navigation traps focus, Escape returns focus, links close drawer", async ({ page, isMobile }) => {
  test.skip(!isMobile, "The drawer is a mobile-only interaction.");
  const toggle = page.getByRole("button", { name: "Open navigation" });
  await toggle.click();
  const drawer = page.getByRole("dialog", { name: "Mobile navigation", exact: true });
  await expect(drawer).toBeVisible();
  await drawer.getByRole("link", { name: "Try a Free Class" }).focus();
  await page.keyboard.press("Tab");
  await expect(drawer.getByRole("button", { name: "Close navigation" })).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(toggle).toBeFocused();
  await toggle.click();
  await drawer.getByRole("link", { name: /Schedule/ }).click();
  await expect(drawer).not.toBeVisible();
  await expect(page).toHaveURL(/#schedule$/);
  await expect(page.locator(".mobile-trial")).toBeVisible();
});

test("reduced motion, narrow overflow and final screenshots", async ({ page, isMobile }, testInfo) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.reload();
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior)).toBe("auto");
  await expect(page.getByRole("button", { name: /Start auto-tour/ })).toBeDisabled();
  await expect(page.getByRole("button", { name: /Start auto-tour/ })).toHaveAttribute("aria-pressed", "false");
  for (const width of isMobile ? [320,390] : [768,1440]) {
    await page.setViewportSize({ width, height: isMobile ? 844 : 1000 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    for (const id of ["programs","pricing","trial"]) {
      await page.locator(`#${id}`).scrollIntoViewIfNeeded();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    }
  }
  await page.evaluate(() => window.scrollTo(0,0));
  await page.screenshot({ path: testInfo.outputPath(`${isMobile ? "mobile" : "desktop"}-home.png`), animations: "disabled" });
  await page.locator("#programs").evaluate(element => element.scrollIntoView({ block: "start" }));
  await page.screenshot({ path: testInfo.outputPath(`${isMobile ? "mobile" : "desktop"}-programs.png`), animations: "disabled" });
  await page.locator(".trial-form-card").evaluate(element => element.scrollIntoView({ block: "start" }));
  await page.screenshot({ path: testInfo.outputPath(`${isMobile ? "mobile" : "desktop"}-trial.png`), animations: "disabled" });
  await page.getByRole("button", { name: "Start Training with Family Plan" }).click();
  const dialog = page.getByRole("dialog", { name: /Family Plan/ });
  expect(await dialog.evaluate(element => element.scrollWidth <= element.clientWidth)).toBe(true);
  await page.screenshot({ path: testInfo.outputPath(`${isMobile ? "mobile" : "desktop"}-membership.png`), animations: "disabled" });
  await page.keyboard.press("Escape");
});

test("facility auto-tour advances, manual navigation pauses it, swipe syncs the counter", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.locator(".gallery").scrollIntoViewIfNeeded();
  await page.clock.install();
  await page.getByRole("button", { name: "Start auto-tour", exact: true }).click();
  await expect(page.getByRole("button", { name: "Pause auto-tour" })).toHaveAttribute("aria-pressed", "true");
  await page.clock.runFor(5_500);
  await expect(page.locator(".gallery-controls")).toContainText("2 / 6");
  await page.getByRole("button", { name: "Next facility", exact: true }).click();
  await expect(page.getByRole("button", { name: "Start auto-tour", exact: true })).toHaveAttribute("aria-pressed", "false");
  await page.locator(".gallery").evaluate(element => {
    const target = element.children[3] as HTMLElement;
    element.scrollTo({ left: target.offsetLeft - (element as HTMLElement).offsetLeft, behavior: "instant" });
  });
  await page.clock.runFor(500);
  await expect(page.locator(".gallery-controls")).toContainText("4 / 6");
});
