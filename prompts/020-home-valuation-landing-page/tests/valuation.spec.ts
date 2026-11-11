import { test, expect, type Page } from "@playwright/test";
import { estimate, properties, validateDetails, type Details } from "../components/valuation";

async function openHome(page: Page, address = "742 Evergreen") {
  await page.locator("#hero-address").fill(address);
  await page.getByRole("button", { name: /fictional .* synthetic details only/i }).first().click();
  await expect(page.getByRole("dialog")).toBeVisible();
}
async function calculate(page: Page) {
  await page.getByRole("button", { name: "Calculate demo estimate" }).click();
  await expect(page.getByRole("heading", { name: "Putting your demo report together…" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Your home’s imagined next chapter." })).toBeVisible();
}
test.beforeEach(async ({ page }) => { await page.goto("/"); });

test("address empty, unknown, recovery and native submission", async ({ page }) => {
  const form = page.locator("#hero-address").locator("..").locator("..");
  await form.getByRole("button", { name: "Get My Estimate" }).click();
  await expect(page.getByRole("dialog")).not.toBeVisible();
  expect(await page.locator("#hero-address").evaluate((e: HTMLInputElement) => e.validity.valueMissing)).toBe(true);
  await page.locator("#hero-address").fill("Unknown demo home");
  await form.getByRole("button", { name: "Get My Estimate" }).click();
  await expect(page.getByText("No demo property matches.")).toBeVisible();
  await expect(page.getByText("Choose one of the three fictional addresses below.")).toBeVisible();
  await page.getByRole("button", { name: "Show all demo addresses" }).click();
  await expect(page.getByRole("button", { name: /fictional .* synthetic details only/i })).toHaveCount(3);
  await page.locator("#hero-address").fill(properties[0].address);
  await page.getByRole("button", { name: "Close address suggestions" }).click();
  await page.locator("#hero-address").press("Enter");
  await expect(page.getByRole("dialog")).toBeVisible();
});

test("home details, loading, range, report and reset journey", async ({ page }) => {
  await openHome(page);
  const modal = page.getByRole("dialog");
  await calculate(page);
  await expect(modal.getByRole("heading", { name: "$460,000 – $530,000" })).toBeVisible();
  await expect(modal.getByText("$495,000", { exact: true }).first()).toBeVisible();
  await expect(modal.getByText("2,100", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "View full demo report & formula" }).click();
  await expect(modal.getByText("Transparent, not predictive.")).toBeVisible();
  await expect(modal.getByText(/not model inputs/)).toBeVisible();
  await page.getByRole("button", { name: "Hide report methodology" }).click();
  await expect(modal.getByText("Transparent, not predictive.")).not.toBeVisible();
  await page.getByRole("button", { name: "Reset & edit details" }).click();
  await expect(modal.getByLabel("Living area (sq ft)")).toHaveValue("2100");
  await modal.getByLabel("Living area (sq ft)").fill("2500");
  await calculate(page);
  await expect(modal.getByRole("heading", { name: "$545,000 – $629,000" })).toBeVisible();
});

test("unsupported type and numeric native boundaries do not yield results", async ({ page }) => {
  await openHome(page);
  const modal = page.getByRole("dialog");
  await modal.getByLabel("Property type", { exact: true }).selectOption("land");
  await page.getByRole("button", { name: "Calculate demo estimate" }).click();
  await expect(modal.getByRole("alert")).toContainText("supported property type");
  await modal.getByLabel("Property type", { exact: true }).selectOption("house");
  for (const [name, value, validity] of [
    ["Living area (sq ft)", "499", "rangeUnderflow"], ["Living area (sq ft)", "5001", "rangeOverflow"],
    ["Bedrooms", "2.5", "stepMismatch"], ["Bathrooms", ".5", "rangeUnderflow"],
    ["Bathrooms", "2.2", "stepMismatch"], ["Lot size (acres)", "-1", "rangeUnderflow"],
    ["Year built", "2027", "rangeOverflow"], ["Garage spaces", "4", "rangeOverflow"],
  ]) {
    const input = modal.getByLabel(name, { exact: true });
    const original = await input.inputValue();
    await input.fill(value);
    await page.getByRole("button", { name: "Calculate demo estimate" }).click();
    expect(await input.evaluate((e: HTMLInputElement, key) => e.validity[key as keyof ValidityState], validity)).toBe(true);
    await expect(modal.getByRole("heading", { name: "Every home has its details." })).toBeVisible();
    await input.fill(original);
  }
  await modal.getByLabel("Living area (sq ft)").fill("");
  await page.getByRole("button", { name: "Calculate demo estimate" }).click();
  expect(await modal.getByLabel("Living area (sq ft)").evaluate((e: HTMLInputElement) => e.validity.valueMissing)).toBe(true);
});

test("toy formula changes coherently by type and condition with bounded units", async ({ page }) => {
  const original: Details = { ...properties[0], condition: "standard" };
  expect(estimate(original)).toEqual({ center: 495000, low: 460000, high: 530000 });
  expect(estimate({ ...original, condition: "updated" }).center).toBeGreaterThan(estimate(original).center);
  expect(estimate({ ...original, type: "condo" }).center).toBeLessThan(estimate(original).center);
  expect(estimate({ ...original, condition: "needs-work" }).center).toBeLessThan(estimate(original).center);
  const minimum: Details = { type: "condo", condition: "needs-work", bedrooms: 1, bathrooms: 1, sqft: 500, lot: 0, year: 1900, garage: 0 };
  const maximum: Details = { type: "house", condition: "updated", bedrooms: 6, bathrooms: 5, sqft: 5000, lot: 2, year: 2026, garage: 3 };
  expect(validateDetails(minimum)).toBeNull();
  expect(validateDetails(maximum)).toBeNull();
  expect(estimate(minimum).center).toBe(80000);
  expect(estimate(maximum).center).toBeLessThanOrEqual(1300000);
  for (const invalid of [{ sqft: NaN }, { lot: Infinity }, { year: 1899 }, { bedrooms: 0 }, { bathrooms: 5.5 }, { type: "land" }, { condition: "unknown" }]) {
    expect(() => estimate({ ...original, ...invalid } as Details)).toThrow();
  }
  await openHome(page, "655 Maple");
  const modal = page.getByRole("dialog");
  await expect(modal.getByLabel("Property type", { exact: true })).toHaveValue("condo");
  await modal.getByLabel("Condition", { exact: true }).selectOption("updated");
  await calculate(page);
  const condo = estimate({ ...properties[2], condition: "updated" });
  await expect(modal.getByRole("heading", { name: `${new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(condo.low)} – ${new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(condo.high)}` })).toBeVisible();
});

test("intentional error, successful retry and loading cancellation", async ({ page }) => {
  await openHome(page, "801 Oak");
  await page.getByLabel("Simulate service failure").check();
  await page.getByRole("button", { name: "Calculate demo estimate" }).click();
  await expect(page.getByRole("heading", { name: "The demo service took a pause." })).toBeVisible();
  await expect(page.getByRole("dialog").getByRole("alert")).toContainText("deliberately simulated error");
  await page.getByRole("button", { name: "Retry demo estimate" }).click();
  await expect(page.getByRole("heading", { name: "Your home’s imagined next chapter." })).toBeVisible();
  await page.getByRole("button", { name: "Reset & edit details" }).click();
  await page.getByRole("button", { name: "Calculate demo estimate" }).click();
  await page.getByRole("button", { name: "Cancel calculation" }).click();
  await page.waitForTimeout(1100);
  await expect(page.getByRole("heading", { name: "Every home has its details." })).toBeVisible();
});

test("keyboard dialog traps focus and Escape returns to surviving opener", async ({ page }) => {
  await page.locator("#hero-address").fill("742 Evergreen");
  await page.getByRole("button", { name: /fictional house .* synthetic details only/i }).focus();
  await page.keyboard.press("Enter");
  const modal = page.getByRole("dialog");
  await expect(modal).toBeVisible();
  await expect(page.getByRole("heading", { name: "Every home has its details." })).toBeFocused();
  for (let i = 0; i < 18; i++) {
    await page.keyboard.press("Tab");
    expect(await page.evaluate(() => Boolean(document.activeElement?.closest("dialog")))).toBe(true);
  }
  await page.keyboard.press("Escape");
  await expect(modal).not.toBeVisible();
  await expect(page.locator("#hero-address")).toBeFocused();
  await page.getByRole("button", { name: "Close address suggestions" }).click();
  await page.locator("#hero-address").press("Enter");
  await page.getByRole("button", { name: "Change address" }).click();
  await expect(page.locator("#estimate").getByRole("button", { name: "Get My Estimate" })).toBeFocused();
});

test("local inquiry prefill, required fields, synthetic contacts and reset without transmissions", async ({ page }) => {
  const outbound: string[] = [];
  page.on("request", req => { if (req.method() !== "GET" || !req.url().startsWith("http://127.0.0.1:3120")) outbound.push(req.url()); });
  await openHome(page);
  await calculate(page);
  await page.getByRole("button", { name: "Try local CMA inquiry" }).click();
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await expect(page.locator("#inquiry-property")).toHaveValue("evergreen");
  await expect(page.locator("#inquiry-property")).toBeFocused();
  await page.getByRole("button", { name: "Request Free CMA", exact: true }).click();
  await expect(page.getByText("Demo request complete", { exact: true })).not.toBeVisible();
  await page.getByLabel("Full name (fictional)").selectOption("alex");
  await expect(page.getByLabel("Demo email")).toHaveValue("alex@example.invalid");
  await expect(page.getByLabel("Demo phone")).toHaveAttribute("readonly", "");
  await page.getByLabel("When are you considering selling?").selectOption("Just curious");
  await page.getByLabel("Message (optional, synthetic only)").selectOption("I would like to understand the demo report.");
  await page.getByRole("button", { name: "Request Free CMA", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("No details were sent");
  await page.getByRole("button", { name: "Reset demo request" }).click();
  await expect(page.getByLabel("Full name (fictional)")).toHaveValue("");
  await expect(page.locator("#inquiry-property")).toHaveValue("");
  await expect(page.getByLabel("Demo email")).toHaveValue("");
  expect(outbound).toEqual([]);
  expect(await page.evaluate(() => ({ local: localStorage.length, session: sessionStorage.length }))).toEqual({ local: 0, session: 0 });
});

test("FAQ single expansion, lower address CTA and internal destinations", async ({ page }) => {
  const accuracy = page.getByRole("button", { name: "How accurate is the online estimate?" });
  await accuracy.click();
  await expect(accuracy).toHaveAttribute("aria-expanded", "true");
  await expect(page.getByText(/no measured accuracy/)).toBeVisible();
  const privacy = page.getByRole("button", { name: "Is my personal information safe?" });
  await privacy.click();
  await expect(accuracy).toHaveAttribute("aria-expanded", "false");
  await expect(privacy).toHaveAttribute("aria-expanded", "true");
  await privacy.click();
  await expect(privacy).toHaveAttribute("aria-expanded", "false");
  const links = await page.locator('a[href^="#"]').evaluateAll(els => els.map(e => e.getAttribute("href")!));
  for (const link of new Set(links)) expect(await page.locator(link).count()).toBe(1);
  await page.locator("#bottom-address").fill(properties[1].address);
  await page.getByRole("button", { name: "Close address suggestions" }).click();
  await page.locator(".bottom-cta").getByRole("button", { name: "Get My Estimate" }).click();
  await expect(page.getByRole("dialog").getByLabel("Property type", { exact: true })).toHaveValue("townhome");
});

test("responsive navigation, mobile CTA, reduced motion and overflow", async ({ page }, info) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  if (info.project.name === "mobile") {
    await page.getByRole("button", { name: "Open navigation" }).click();
    await expect(page.getByRole("navigation")).toBeVisible();
    await page.getByRole("navigation").getByRole("link", { name: "Sample report" }).click();
    await expect(page.getByRole("navigation")).not.toBeVisible();
    await page.getByRole("button", { name: "Get Your Estimate", exact: true }).click();
    await expect(page.locator("#hero-address")).toBeFocused();
  } else await expect(page.getByRole("navigation")).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await openHome(page);
  await page.getByRole("button", { name: "Calculate demo estimate" }).click();
  expect(await page.locator(".spinner").evaluate(e => getComputedStyle(e).animationName)).toBe("none");
  await expect(page.getByRole("heading", { name: "Your home’s imagined next chapter." })).toBeVisible();
  expect(await page.getByRole("dialog").evaluate(e => e.scrollWidth <= e.clientWidth)).toBe(true);
});

test("final rendered page and report have no browser errors or broken artwork", async ({ page }, info) => {
  const errors: string[] = [];
  page.on("pageerror", e => errors.push(e.message));
  await page.reload();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("What’s yourhome worth?");
  for (const image of await page.locator("img").all()) expect(await image.evaluate((e: HTMLImageElement) => e.complete && e.naturalWidth > 0)).toBe(true);
  await page.screenshot({ path: `test-results\\${info.project.name}-page.png`, fullPage: true });
  await openHome(page);
  await calculate(page);
  await page.screenshot({ path: `test-results\\${info.project.name}-report.png` });
  expect(errors).toEqual([]);
});

test("unhydrated native forms cannot transmit typed address data", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  try {
    const page = await context.newPage();
    await page.goto("http://127.0.0.1:3120");
    const navigationRequests: string[] = [];
    page.on("request", req => { if (req.isNavigationRequest()) navigationRequests.push(`${req.url()} ${req.postData() || ""}`); });
    await page.locator("#hero-address").fill("999 Unlisted Demo Lane");
    await page.locator("#estimate").getByRole("button", { name: "Get My Estimate" }).click();
    await page.waitForLoadState();
    expect(navigationRequests.length).toBeGreaterThan(0);
    expect(navigationRequests.join(" ")).not.toMatch(/999|Unlisted|demoAddress/);
  } finally { await context.close(); }
});
