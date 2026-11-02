import { test, expect } from "@playwright/test";
import { earliestDeparture, estimate } from "../components/data";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});

test("illustrated homepage, assets and responsive layouts render without client errors", async ({ page }, testInfo) => {
  const failures: string[] = [];
  page.on("pageerror", (error) => failures.push(error.message));
  await page.reload();
  await page.evaluate(() => document.fonts.ready);
  await expect(page.getByText("Fictional travel demo", { exact: false })).toBeVisible();
  await expect(page.locator(".trip-card")).toHaveCount(6);
  expect(await page.locator("img").evaluateAll((images) => images.every((image) => (image as HTMLImageElement).complete && (image as HTMLImageElement).naturalWidth > 0))).toBe(true);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.screenshot({ path: `test-results/${testInfo.project.name}-home.png` });
  await page.locator("#calculator").scrollIntoViewIfNeeded();
  await page.screenshot({ path: `test-results/${testInfo.project.name}-calculator.png` });
  await page.locator("#planning").scrollIntoViewIfNeeded();
  await page.screenshot({ path: `test-results/${testInfo.project.name}-planning.png` });
  if (testInfo.project.name === "mobile") {
    await expect(page.locator(".mobile-bottom")).toBeVisible();
    expect(await page.locator(".package-grid").evaluate((element) => element.scrollWidth > element.clientWidth)).toBe(true);
    await page.getByRole("button", { name: "Open navigation" }).click();
    await expect(page.getByRole("navigation", { name: "Main navigation" })).toBeVisible();
    await page.getByRole("navigation").getByRole("link", { name: "Corporate Retreats" }).click();
    await expect(page.getByRole("button", { name: "Open navigation" })).toHaveAttribute("aria-expanded", "false");
  }
  expect(failures).toEqual([]);
});

test("group size limits, tier and destination produce actual price and savings calculations", async ({ page }) => {
  const calculator = page.locator("#calculator");
  await expect(page.getByTestId("per-person")).toContainText("$1,120");
  await expect(page.getByTestId("group-total")).toHaveText("$13,440");
  await expect(page.getByTestId("savings")).toHaveText("$3,360");
  await calculator.getByLabel("How many in your tribe?").fill("6");
  await expect(calculator.getByRole("button", { name: "Decrease group size" })).toBeDisabled();
  await expect(page.getByTestId("per-person")).toContainText("$1,232");
  await expect(page.getByTestId("group-total")).toHaveText("$7,392");
  await calculator.getByLabel("How many in your tribe?").fill("50");
  await expect(calculator.getByRole("button", { name: "Increase group size" })).toBeDisabled();
  await expect(page.getByTestId("group-total")).toHaveText("$52,500");
  await expect(page.getByTestId("savings")).toHaveText("$17,500");
  await calculator.getByRole("combobox", { name: "Destination", exact: true }).selectOption("Japan");
  await calculator.getByLabel("Trip length").selectOption("10");
  await calculator.getByRole("radio", { name: "Premium" }).check();
  const expected = estimate("Japan", 50, 10, "Premium");
  await expect(page.getByTestId("group-total")).toHaveText(`$${expected.total.toLocaleString("en-US")}`);
  await calculator.getByLabel("Trip length").selectOption("custom");
  await calculator.getByLabel("Custom days").fill("2");
  await expect(calculator.getByText("Enter a whole number from 3 to 30 days.")).toBeVisible();
  await expect(calculator.getByRole("button", { name: "Get Detailed Quote" })).toBeDisabled();
  await calculator.getByLabel("Custom days").fill("12");
  await expect(calculator.getByRole("button", { name: "Get Detailed Quote" })).toBeEnabled();
});

test("keyboard range and calculator quote retain selected group details", async ({ page }) => {
  const calculator = page.locator("#calculator");
  const range = calculator.getByLabel("How many in your tribe?");
  await range.focus();
  await range.press("ArrowRight");
  await expect(page.getByTestId("group-size")).toContainText("13");
  await calculator.getByRole("button", { name: "Get Detailed Quote" }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog.getByLabel("Group size")).toHaveValue("13");
  await expect(dialog.getByLabel("Dream destination")).toHaveValue("Bali");
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(calculator.getByRole("button", { name: "Get Detailed Quote" })).toBeFocused();
});

test("source packages filter and selected itinerary uses correct package size and price", async ({ page }, testInfo) => {
  const packages = page.locator("#packages");
  await packages.getByRole("button", { name: "Adventure", exact: true }).click();
  await expect(packages.locator(".trip-card")).toHaveCount(2);
  await expect(packages.getByRole("heading", { name: "Iceland Ring Road" })).toBeVisible();
  await page.locator("#calculator").getByLabel("How many in your tribe?").fill("50");
  await packages.getByRole("button", { name: "View Iceland Ring Road trip" }).click();
  let dialog = page.getByRole("dialog");
  await expect(dialog.getByText("Days 4–6 · Glacier lagoon & eastern fjords")).toBeVisible();
  await expect(dialog.getByText("15 travelers · $36,000 estimated total")).toBeVisible();
  await page.screenshot({ path: `test-results/${testInfo.project.name}-trip-dialog.png` });
  await dialog.getByRole("button", { name: "Plan This Trip" }).click();
  dialog = page.getByRole("dialog");
  await expect(dialog.getByLabel("Group size")).toHaveValue("15");
  expect(await dialog.getByLabel("Group size").locator("option").count()).toBe(10);
  await dialog.getByLabel("Departure date").fill(earliestDeparture());
  await dialog.getByLabel("Example email").fill("traveler@example.com");
  await dialog.getByRole("button", { name: "Get Free Demo Quote" }).click();
  await expect(dialog.getByText("$2,400", { exact: false })).toBeVisible();
  await expect(dialog.getByText("/ person · $36,000 group estimate")).toBeVisible();
  await expect(dialog.getByText("No email was sent", { exact: false })).toBeVisible();
});

test("corporate empty state provides tailored quote with minimum ten travelers", async ({ page }) => {
  await page.locator("#packages").getByRole("button", { name: "Corporate", exact: true }).click();
  await expect(page.locator(".trip-card")).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "No off-the-shelf corporate packages" })).toBeVisible();
  await page.locator(".empty-state").getByRole("button", { name: "Plan a Corporate Retreat" }).click();
  const select = page.getByRole("dialog").getByLabel("Group size");
  await expect(select.locator("option").first()).toHaveAttribute("value", "10");
  await expect(select.locator("option").last()).toHaveAttribute("value", "50");
});

test("inquiry rejects missing and past dates and invalid emails, focuses errors, then confirms locally", async ({ page }) => {
  await page.getByRole("button", { name: "Build Custom Trip", exact: true }).click();
  const dialog = page.getByRole("dialog");
  const submit = dialog.getByRole("button", { name: "Get Free Demo Quote" });
  await submit.click();
  await expect(dialog.getByLabel("Departure date")).toBeFocused();
  await expect(dialog.getByLabel("Departure date")).toHaveAttribute("aria-invalid", "true");
  await expect(dialog.getByText("Enter a valid example email", { exact: false })).toBeVisible();
  await dialog.getByLabel("Departure date").fill("2001-01-01");
  await dialog.getByLabel("Example email").fill("not-an-email");
  await submit.click();
  await expect(dialog.getByText("Choose a departure date from tomorrow onward.")).toBeVisible();
  await dialog.getByLabel("Departure date").fill(earliestDeparture());
  await dialog.getByLabel("Example email").fill("crew@example.com");
  await submit.click();
  await expect(dialog.getByRole("heading", { name: "Your demo trip brief is ready!" })).toBeVisible();
  await expect(dialog.getByRole("heading", { name: "Your demo trip brief is ready!" })).toBeFocused();
  await expect(dialog.getByText("Bali · 12 travelers · 7 days")).toBeVisible();
  await expect(dialog.getByText("/ person · $13,440 group estimate")).toBeVisible();
  await dialog.getByRole("button", { name: "Edit demo inquiry" }).click();
  await expect(dialog.getByLabel("Example email")).toHaveValue("");
});

test("inline custom destination rejects blank input and never fabricates unknown destination prices", async ({ page }) => {
  const quote = page.locator("#quote");
  await quote.getByLabel("Dream destination").fill("  ");
  await quote.getByRole("button", { name: "Get Free Demo Quote" }).click();
  await expect(quote.getByLabel("Dream destination")).toBeFocused();
  await expect(quote.getByText("Tell us your dream destination.")).toBeVisible();
  await quote.getByLabel("Dream destination").fill("Patagonia");
  await quote.getByLabel("Departure date").fill(earliestDeparture());
  await quote.getByLabel("Example email").fill("dream@example.com");
  await quote.getByRole("button", { name: "Get Free Demo Quote" }).click();
  await expect(quote.getByText("A custom destination needs a tailored estimate; no automatic price is available.")).toBeVisible();
});

test("planning votes, days, local chat, confirmation and reminders have meaningful state", async ({ page }) => {
  const preview = page.locator("#planning");
  const vote = preview.getByRole("button", { name: "Sunrise at Mount Batur" });
  await vote.click();
  await expect(vote).toHaveAttribute("aria-pressed", "true");
  await expect(vote).toContainText("7/12");
  await preview.getByRole("button", { name: "Try the Planning Tool" }).click();
  const dialog = page.getByRole("dialog");
  const expandedVote = dialog.getByRole("button", { name: "Sunrise at Mount Batur" });
  await expect(expandedVote).toHaveAttribute("aria-pressed", "true");
  await expandedVote.click();
  await expect(expandedVote).toContainText("6/12");
  await dialog.getByRole("button", { name: "Day 2", exact: true }).click();
  await expect(dialog.getByText("Rice terraces & a local food walk")).toBeVisible();
  await dialog.getByRole("button", { name: "Group chat", exact: true }).click();
  await dialog.getByRole("button", { name: "Send sample message" }).click();
  await expect(dialog.getByText("Write a sample message first.")).toBeVisible();
  await dialog.getByRole("textbox", { name: "Sample message", exact: true }).fill("Let's bring refillable bottles!");
  await dialog.getByRole("button", { name: "Send sample message" }).click();
  await expect(dialog.getByText("You · Let's bring refillable bottles!")).toBeVisible();
  await dialog.getByRole("button", { name: "Members", exact: true }).click();
  await dialog.getByRole("button", { name: "Simulate Taylor confirming" }).click();
  await expect(dialog.getByText("10 confirmed", { exact: true })).toBeVisible();
  await expect(dialog.getByText("2 pending", { exact: true })).toBeVisible();
  await dialog.getByRole("button", { name: "Preview reminders" }).click();
  await expect(dialog.getByText("No notification was sent.", { exact: false })).toBeVisible();
  await dialog.getByRole("button", { name: "Share demo" }).click();
  await expect(dialog.getByText(/Demo page link copied|Copy this demo page link manually/)).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(vote).toHaveAttribute("aria-pressed", "false");
});

test("split payment installments, member selection, full payment and cancellation boundary", async ({ page }) => {
  const payments = page.locator("#payments");
  await payments.getByRole("button", { name: "Preview cancellation" }).click();
  await expect(payments.getByText("No simulated payment to refund for this traveler.")).toBeVisible();
  await payments.getByRole("button", { name: "Simulate $500 payment" }).click();
  await expect(payments.getByText("$500 of $12,000 simulated paid · 0/8 settled")).toBeVisible();
  await payments.getByLabel("Departure in").selectOption("20");
  await expect(payments.getByText("In 6 days", { exact: true })).toBeVisible();
  await expect(payments.getByText("In 13 days", { exact: true })).toBeVisible();
  await payments.getByRole("button", { name: "Preview cancellation" }).click();
  await expect(payments.getByText("Full refund unavailable within 30 days.", { exact: false })).toBeVisible();
  await payments.getByLabel("Departure in").selectOption("30");
  await payments.getByRole("button", { name: "Preview cancellation" }).click();
  await expect(payments.getByText("Alex: $500 simulated refund recorded. No money moved.")).toBeVisible();
  await expect(payments.getByText("$0 of $12,000 simulated paid · 0/8 settled")).toBeVisible();
  await payments.getByRole("button", { name: "Select Maya", exact: false }).click();
  await payments.getByLabel("Payment plan").selectOption("full");
  await payments.getByRole("button", { name: "Simulate $1,500 payment" }).click();
  await expect(payments.getByRole("button", { name: "Fully simulated paid" })).toBeDisabled();
  await expect(payments.getByText("$1,500 of $12,000 simulated paid · 1/8 settled")).toBeVisible();
  await payments.getByRole("button", { name: "Select Alex", exact: false }).click();
  await payments.getByLabel("Payment plan").selectOption("installments");
  await payments.getByRole("button", { name: "Simulate $500 payment" }).click();
  await payments.getByLabel("Payment plan").selectOption("full");
  await payments.getByRole("button", { name: "Simulate $1,000 payment" }).click();
  await expect(payments.getByText("$3,000 of $12,000 simulated paid · 2/8 settled")).toBeVisible();
  await page.reload();
  await expect(page.locator("#payments").getByText("$0 of $12,000 simulated paid · 0/8 settled")).toBeVisible();
});

test("interactions do not call external services or persist personal data", async ({ page }) => {
  const externalRequests: string[] = [];
  page.on("request", (request) => {
    if (!["localhost", "127.0.0.1"].includes(new URL(request.url()).hostname)) externalRequests.push(request.url());
  });
  await page.reload();
  await page.locator("#payments").getByRole("button", { name: "Simulate $500 payment" }).click();
  await page.locator(".footer-column").getByRole("button", { name: "Privacy", exact: true }).click();
  await expect(page.getByRole("dialog").getByText("Interactions are stored only in page memory", { exact: false })).toBeVisible();
  await page.keyboard.press("Escape");
  expect(await page.evaluate(() => ({ local: localStorage.length, session: sessionStorage.length, cookies: document.cookie }))).toEqual({ local: 0, session: 0, cookies: "" });
  expect(externalRequests).toEqual([]);
});

test("modal traps keyboard focus, FAQ and carousel are keyboard operable with reduced motion", async ({ page }, testInfo) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.getByRole("button", { name: "Build Custom Trip", exact: true }).click();
  const dialog = page.getByRole("dialog");
  await dialog.getByRole("button", { name: "Close dialog" }).focus();
  await page.keyboard.press("Shift+Tab");
  expect(await page.evaluate(() => !!document.activeElement?.closest("dialog"))).toBe(true);
  await page.keyboard.press("Tab");
  await expect(dialog.getByRole("button", { name: "Close dialog" })).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("button", { name: "Build Custom Trip", exact: true })).toBeFocused();
  const question = page.locator("summary").filter({ hasText: "What's the minimum group size?" });
  await question.focus();
  await question.press("Enter");
  await expect(page.getByText("6 travelers for standard packages and 10 for corporate retreats.", { exact: false })).toBeVisible();
  const carousel = page.locator(".story-grid");
  await carousel.focus();
  await carousel.press("ArrowRight");
  await expect(page.getByText("Story 2 of 4", { exact: false })).toBeVisible();
  await expect(page.locator(".story-0").getByText("Sarah K.", { exact: true })).toBeVisible();
  if (testInfo.project.name === "mobile") {
    await expect(page.locator(".story-1")).not.toBeVisible();
    await carousel.evaluate((element) => {
      element.dispatchEvent(new TouchEvent("touchstart", { bubbles: true, touches: [new Touch({ identifier: 1, target: element, clientX: 300 })] }));
      element.dispatchEvent(new TouchEvent("touchend", { bubbles: true, changedTouches: [new Touch({ identifier: 1, target: element, clientX: 80 })] }));
    });
    await expect(page.getByText("Story 3 of 4", { exact: false })).toBeVisible();
  }
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior)).toBe("auto");
  expect(await page.locator(".step").first().evaluate((element) => getComputedStyle(element, "::before").animationName)).toBe("none");
});
