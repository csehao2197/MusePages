import { test, expect, type Page } from "@playwright/test";

async function openTool(page: Page, name: "Floor plan" | "Gallery" | "Property details") {
  if (await page.getByRole("button", { name: "Open navigation", exact: true }).isVisible()) {
    await page.getByRole("button", { name: "Open navigation", exact: true }).click();
  }
  await page.getByRole("navigation", { name: "Tour navigation" }).getByRole("button", { name, exact: true }).click();
}
async function preferences(page: Page) {
  await page.getByRole("button", { name: "Accessibility and preferences", exact: true }).click();
}
async function closeDialog(page: Page) {
  await page.getByRole("button", { name: "Close dialog", exact: true }).click();
  await expect(page.getByRole("dialog")).not.toBeVisible();
}
async function openRequest(page: Page, inquiry = false) {
  if (inquiry) await page.getByRole("button", { name: "Contact Avery, fictional host" }).click();
  else await page.getByRole("button", { name: "Schedule an in-person tour", exact: true }).click();
}
async function fillContact(page: Page) {
  await page.getByLabel("Your name", { exact: true }).fill("Demo Visitor");
  await page.getByLabel("Email address", { exact: true }).fill("visitor@example.com");
  await page.getByLabel("I understand this is a fictional property", { exact: false }).check();
}
test.beforeEach(async ({ page }) => { await page.goto("/"); });

test("original tour renders without external requests, errors, or horizontal overflow", async ({ page }, testInfo) => {
  const errors: string[] = [];
  const outside: string[] = [];
  page.on("pageerror", e => errors.push(e.message));
  page.on("request", r => { if (!r.url().startsWith("http://127.0.0.1:3126")) outside.push(r.url()); });
  await page.reload();
  await expect(page.getByRole("heading", { name: "18 Juniper Lane", exact: true })).toBeVisible();
  await expect(page.getByText("ILLUSTRATED VIEW · NOT 360°", { exact: true })).toBeVisible();
  await expect(page.locator("#tour-viewer")).toHaveAttribute("data-zoom", "1");
  await expect(page.getByRole("button", { name: "View Living Room", exact: true })).toHaveAttribute("aria-pressed", "true");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  expect(errors).toEqual([]);
  expect(outside).toEqual([]);
  await page.screenshot({ path: `test-results/${testInfo.project.name}-tour.png`, fullPage: true, animations: "disabled" });
});

test("room thumbnails, navigation hotspots and floor plan keep the room state synchronized", async ({ page }) => {
  await page.getByRole("button", { name: "Hotspot: Explore the kitchen", exact: true }).click();
  await expect(page.locator(".room-heading h2")).toHaveText("Kitchen");
  await expect(page.locator(".room-info .dimensions strong")).toHaveText("18′ × 16′");
  await expect(page.getByRole("button", { name: "View Kitchen", exact: true })).toHaveAttribute("aria-pressed", "true");
  await openTool(page, "Floor plan");
  await expect(page.getByRole("dialog").getByRole("button", { name: "Floor plan: Kitchen", exact: true })).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("dialog").getByRole("button", { name: "Floor plan: Primary Bedroom", exact: true }).click();
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await expect(page.locator(".room-heading h2")).toHaveText("Primary Bedroom");
  await page.getByRole("button", { name: "View Garden Terrace", exact: true }).click();
  await page.getByRole("button", { name: "Hotspot: Explore the neighborhood", exact: true }).click();
  await expect(page.getByRole("dialog")).toContainText("not a map");
  await closeDialog(page);
});

test("information hotspots expand, close on background, and support Escape focus return", async ({ page }) => {
  const hotspot = page.getByRole("button", { name: "Hotspot: Grounded in natural materials" });
  await hotspot.click();
  await expect(page.getByRole("region", { name: "Grounded in natural materials", exact: true })).toContainText("fictional design specifications");
  await page.keyboard.press("Escape");
  await expect(page.locator(".hotspot-card")).toHaveCount(0);
  await expect(hotspot).toBeFocused();
  await hotspot.click();
  await page.locator("#tour-viewer").click({ position: { x: 25, y: 180 } });
  await expect(page.locator(".hotspot-card")).toHaveCount(0);
  await page.getByRole("button", { name: "Hotspot: A place for your stories" }).click();
  await page.getByRole("button", { name: "Close hotspot", exact: true }).click();
  await expect(page.locator(".hotspot-card")).toHaveCount(0);
});

test("pan, zoom, reset and keyboard navigation are bounded and coherent", async ({ page }) => {
  const view = page.locator("#tour-viewer");
  for (let i = 0; i < 8; i++) await page.getByRole("button", { name: "Zoom in", exact: true }).click();
  await expect(view).toHaveAttribute("data-zoom", "1.8");
  await expect(page.getByRole("button", { name: "Zoom in", exact: true })).toBeDisabled();
  await view.focus();
  for (let i = 0; i < 15; i++) await page.keyboard.press("ArrowRight");
  await expect(view).toHaveAttribute("data-pan-x", "70");
  for (let i = 0; i < 15; i++) await page.keyboard.press("ArrowUp");
  await expect(view).toHaveAttribute("data-pan-y", "-35");
  await page.keyboard.press("Home");
  await expect(view).toHaveAttribute("data-zoom", "1");
  await expect(view).toHaveAttribute("data-pan-x", "0");
  await expect(page.getByRole("button", { name: "Zoom out", exact: true })).toBeDisabled();
  await page.keyboard.press("PageDown");
  await expect(page.locator(".room-heading h2")).toHaveText("Kitchen");
  await page.keyboard.press("PageUp");
  await expect(page.locator(".room-heading h2")).toHaveText("Living Room");
  await page.getByRole("button", { name: "Pan left", exact: true }).click();
  await expect(view).toHaveAttribute("data-pan-x", "-10");
  await page.getByRole("button", { name: "Reset view", exact: true }).click();
  await expect(view).toHaveAttribute("data-pan-x", "0");
  await view.focus();
  for (let i = 0; i < 10; i++) await page.keyboard.press("ArrowRight");
  const initialBounds = await view.evaluate(element => Math.min(70, element.clientWidth * .06));
  expect(Number(await view.getAttribute("data-pan-x"))).toBeLessThanOrEqual(Math.round(initialBounds));
});

test("full view supports keyboard containment, room changes, and Escape recovery", async ({ page }) => {
  await page.getByRole("button", { name: "Enter full view", exact: true }).click();
  await expect(page.locator(".viewer-wrap")).toHaveClass(/expanded/);
  await expect(page.locator(".header")).toHaveJSProperty("inert", true);
  await page.getByRole("button", { name: "Next room in full view", exact: true }).click();
  await expect(page.locator(".room-heading h2")).toHaveText("Kitchen");
  await page.keyboard.press("Tab");
  await expect(page.locator("#tour-viewer")).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(page.locator(".viewer-wrap")).not.toHaveClass(/expanded/);
  await expect(page.locator(".header")).toHaveJSProperty("inert", false);
  await expect(page.getByRole("button", { name: "Enter full view", exact: true })).toBeVisible();
});

test("guided tour plays, pauses, advances, and finishes with a transcript", async ({ page }) => {
  await page.clock.install();
  await page.getByRole("button", { name: "Guided tour", exact: true }).click();
  await expect(page.locator(".transcript")).toContainText("Welcome to the living room");
  await expect(page.getByRole("button", { name: "Turn narration on", exact: true })).toHaveAttribute("aria-pressed", "false");
  await page.getByRole("button", { name: "Play guided tour", exact: true }).click();
  await page.clock.fastForward(10100);
  await expect(page.locator(".room-heading h2")).toHaveText("Kitchen");
  await page.getByRole("button", { name: "Pause guided tour", exact: true }).click();
  await page.clock.fastForward(20000);
  await expect(page.locator(".room-heading h2")).toHaveText("Kitchen");
  await page.getByRole("button", { name: "Next guided room", exact: true }).click();
  await expect(page.locator(".transcript")).toContainText("primary bedroom");
  await page.getByRole("button", { name: "Play guided tour", exact: true }).click();
  await page.clock.fastForward(10100);
  await expect(page.locator(".room-heading h2")).toHaveText("Garden Terrace");
  await page.clock.fastForward(10100);
  await expect(page.getByRole("button", { name: "Play guided tour", exact: true })).toBeVisible();
  await expect(page.getByRole("status")).toContainText(["Guided tour complete"]);
  await page.getByRole("button", { name: "Self-guided", exact: true }).click();
  await expect(page.getByRole("region", { name: "Guided tour controls", exact: true })).toHaveCount(0);
});

test("gallery, room photos substitute and illustrated sequence are navigable and honest", async ({ page }) => {
  await page.getByRole("button", { name: "Room gallery", exact: true }).click();
  await expect(page.getByRole("dialog")).toContainText("no drone");
  await page.getByRole("button", { name: "Next gallery image", exact: true }).click();
  await expect(page.getByRole("dialog").getByRole("heading", { name: "Kitchen", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Gallery: Garden Terrace", exact: true }).click();
  await expect(page.getByRole("button", { name: "Gallery: Garden Terrace", exact: true })).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "Watch illustrated sequence", exact: true }).click();
  await expect(page.getByRole("dialog")).toContainText("NOT VIDEO FOOTAGE");
  await page.clock.install();
  await page.getByRole("button", { name: "Play illustrated sequence", exact: true }).click();
  await page.clock.fastForward(2600);
  await expect(page.getByRole("dialog").getByRole("heading", { name: "Living Room", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Pause illustrated sequence", exact: true }).click();
  await closeDialog(page);
});

test("schematic measuring and couch fit have useful results and reset behavior", async ({ page }) => {
  await page.getByRole("button", { name: "Measure & furnish", exact: true }).click();
  const canvas = page.getByRole("button", { name: "Measurement canvas:", exact: false });
  await canvas.focus();
  await page.keyboard.press("Enter");
  await page.keyboard.press("Enter");
  await expect(page.getByText("Illustrative distance: 11.0 ft", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Clear measurement", exact: true }).click();
  await expect(page.getByText("0/2 points selected", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Check fit", exact: true }).click();
  await expect(page.getByRole("status").filter({ hasText: "Fits the conceptual wall" })).toBeVisible();
  await page.getByLabel("Will my couch fit?", { exact: false }).fill("300");
  await expect(page.locator(".furniture")).toHaveCount(0);
  await page.getByRole("button", { name: "Check fit", exact: true }).click();
  await expect(page.getByRole("status").filter({ hasText: "Too wide" })).toBeVisible();
  await page.getByLabel("Will my couch fit?", { exact: false }).fill("0");
  await page.getByRole("button", { name: "Check fit", exact: true }).click();
  expect(await page.getByLabel("Will my couch fit?", { exact: false }).evaluate((e: HTMLInputElement) => e.validity.rangeUnderflow)).toBe(true);
});

test("staging slider and split layout comparison work without invented listings", async ({ page }) => {
  await page.getByRole("button", { name: "Staged / empty", exact: true }).click();
  const range = page.getByRole("slider", { name: "Staged versus empty comparison", exact: true });
  await range.fill("0");
  await expect(page.locator(".staged-layer")).toHaveCSS("clip-path", "inset(0px 100% 0px 0px)");
  await range.fill("50");
  await expect(page.locator(".comparison-slider")).toContainText("Staged 50% / empty 50%");
  await page.getByRole("button", { name: "Close staging comparison", exact: true }).click();
  await expect(page.locator(".staged-layer")).toHaveCount(0);
  await openTool(page, "Property details");
  await page.getByRole("button", { name: "Open layout comparison", exact: true }).click();
  await expect(page.getByRole("dialog")).toContainText("no second real listing");
  await page.getByLabel("Compare room", { exact: true }).selectOption("bedroom");
  await expect(page.locator(".split-comparison")).toContainText("Primary Bedroom · Empty concept");
  await closeDialog(page);
  await expect(page.locator(".room-heading h2")).toHaveText("Primary Bedroom");
});

test("viewing validates natively, preserves failed entries, recovers, and resets", async ({ page }) => {
  await openRequest(page);
  const submit = page.getByRole("button", { name: "Request demo viewing", exact: true });
  await submit.click();
  await expect(page.locator(".confirmation")).toHaveCount(0);
  expect(await page.locator("form").evaluate((e: HTMLFormElement) => e.checkValidity())).toBe(false);
  const date = new Date(Date.now() + 86400000 * 2);
  const dateValue = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  await page.getByLabel("Preferred date", { exact: true }).fill("2020-01-01");
  expect(await page.getByLabel("Preferred date", { exact: true }).evaluate((e: HTMLInputElement) => e.validity.rangeUnderflow)).toBe(true);
  await page.getByLabel("Preferred date", { exact: true }).fill(dateValue);
  await page.getByLabel("Preferred time", { exact: true }).selectOption("1:00 PM");
  await fillContact(page);
  await page.getByLabel("Email address", { exact: true }).fill("bad-email");
  await submit.click();
  expect(await page.getByLabel("Email address", { exact: true }).evaluate((e: HTMLInputElement) => e.validity.typeMismatch)).toBe(true);
  await page.getByLabel("Email address", { exact: true }).fill("visitor@example.com");
  await page.getByText("Demo testing options", { exact: true }).click();
  await page.getByLabel("Simulate request failure", { exact: true }).check();
  await submit.click();
  await expect(page.getByRole("dialog").getByRole("alert")).toContainText("Your entries are retained");
  await expect(page.getByLabel("Your name", { exact: true })).toHaveValue("Demo Visitor");
  await page.getByLabel("Simulate request failure", { exact: true }).uncheck();
  await submit.click();
  await expect(page.locator(".confirmation")).toContainText("not a confirmed appointment");
  await expect(page.locator(".confirmation")).toContainText("No message was sent");
  await page.getByRole("button", { name: "Start a new request", exact: true }).click();
  await expect(page.getByLabel("Your name", { exact: true })).toHaveValue("");
  await fillContact(page);
  await page.getByRole("button", { name: "Reset form", exact: true }).click();
  await expect(page.getByLabel("Your name", { exact: true })).toHaveValue("");
  await expect(page.getByLabel("I understand this is a fictional property", { exact: false })).not.toBeChecked();
});

test("inquiry is local, requires a message, and can be repeated", async ({ page }) => {
  await openRequest(page, true);
  await fillContact(page);
  await page.getByRole("button", { name: "Complete demo inquiry", exact: true }).click();
  await expect(page.locator(".confirmation")).toHaveCount(0);
  await page.getByLabel("What would you like to know?", { exact: true }).fill("Demo question about the concept finishes.");
  await page.getByRole("button", { name: "Complete demo inquiry", exact: true }).click();
  await expect(page.locator(".confirmation")).toContainText("Your demo inquiry is ready");
  await page.getByRole("button", { name: "Start a new request", exact: true }).click();
  await expect(page.getByLabel("What would you like to know?", { exact: true })).toHaveValue("");
});

test("save persists locally and sharing links restore room state", async ({ page }) => {
  await page.getByRole("button", { name: "Save property", exact: true }).click();
  await page.reload();
  await expect(page.getByRole("button", { name: "Unsave property", exact: true })).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "Unsave property", exact: true }).click();
  await page.goto("/?room=kitchen");
  await expect(page.locator(".room-heading h2")).toHaveText("Kitchen");
  if (await page.getByRole("button", { name: "Open navigation", exact: true }).isVisible()) {
    await page.getByRole("button", { name: "Open navigation", exact: true }).click();
    await page.getByRole("navigation", { name: "Tour navigation" }).getByRole("button", { name: "Share tour", exact: true }).click();
  } else await page.getByRole("button", { name: "Share tour", exact: true }).click();
  await expect(page.getByLabel("Local room link", { exact: true })).toHaveValue("http://127.0.0.1:3126/?room=kitchen");
  await page.evaluate(() => Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText: () => Promise.reject(new Error("demo denied")) } }));
  await page.getByRole("button", { name: "Copy room link", exact: true }).click();
  await expect(page.getByRole("dialog")).toContainText("Clipboard unavailable");
  await page.evaluate(() => Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText: () => Promise.resolve() } }));
  await page.getByRole("button", { name: "Copy embed code", exact: true }).click();
  await expect(page.getByRole("dialog")).toContainText("Embed code copied");
  await page.getByRole("button", { name: "Create local email draft", exact: true }).click();
  await expect(page.getByLabel("Local email draft", { exact: true })).toHaveCount(0);
  await page.getByLabel("Recipient email", { exact: true }).fill("friend@example.com");
  await page.getByRole("button", { name: "Create local email draft", exact: true }).click();
  await expect(page.getByLabel("Local email draft", { exact: true })).toHaveValue(/Kitchen/);
  await page.getByRole("button", { name: "Reset draft", exact: true }).click();
  await expect(page.getByLabel("Recipient email", { exact: true })).toHaveValue("");
  await expect(page.getByLabel("Local email draft", { exact: true })).toHaveCount(0);
  await closeDialog(page);
});

test("auto-pan, mini map controls and unsupported orientation have clear recovery", async ({ page }) => {
  await page.clock.install();
  await page.getByRole("button", { name: "Auto-pan illustrated scene", exact: true }).click();
  await page.clock.fastForward(1200);
  expect(Number(await page.locator("#tour-viewer").getAttribute("data-pan-x"))).toBeGreaterThan(0);
  await page.getByRole("button", { name: "Reset view", exact: true }).click();
  await page.getByRole("button", { name: "Hide mini map", exact: true }).click();
  await expect(page.locator(".mini-map")).toHaveCount(0);
  await page.getByRole("button", { name: "Show mini map", exact: true }).click();
  await expect(page.locator(".mini-map")).toHaveCount(1);
  await preferences(page);
  await page.evaluate(() => Object.defineProperty(window, "DeviceOrientationEvent", { configurable: true, value: undefined }));
  await page.getByRole("button", { name: "Try device orientation", exact: true }).click();
  await expect(page.locator(".status-toast")).toContainText("Orientation is unavailable");
  await page.getByRole("button", { name: "VR & viewer limitations", exact: true }).click();
  await expect(page.getByRole("dialog")).toContainText("VR headset mode is not available");
  await closeDialog(page);
  await expect(page.locator("#tour-viewer")).toHaveAttribute("data-pan-x", "0");
});

test("dialogs trap focus and restore their trigger; preferences honor reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.reload();
  const trigger = page.getByRole("button", { name: "Accessibility and preferences", exact: true });
  await trigger.click();
  await expect(page.getByRole("dialog")).toBeVisible();
  for (let i = 0; i < 14; i++) {
    await page.keyboard.press("Tab");
    expect(await page.evaluate(() => !!document.activeElement?.closest("dialog"))).toBe(true);
  }
  await page.getByLabel("High contrast interface", { exact: true }).check();
  await page.getByLabel("Reduce motion", { exact: false }).check();
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();
  await expect(page.locator(".site")).toHaveClass(/high-contrast/);
  await expect(page.getByRole("button", { name: "Auto-pan illustrated scene", exact: true })).toBeDisabled();
  expect(await page.locator(".hotspot").first().evaluate(e => getComputedStyle(e).animationName)).toBe("none");
});

test("property details, exit and return are complete local journeys", async ({ page }) => {
  await openTool(page, "Property details");
  await expect(page.getByRole("dialog")).toContainText("Not for sale");
  await expect(page.getByRole("dialog")).toContainText("No financial or tax advice");
  await page.getByRole("button", { name: "Ask a question", exact: true }).click();
  await expect(page.getByLabel("What would you like to know?", { exact: true })).toBeVisible();
  await closeDialog(page);
  await page.getByRole("button", { name: "Exit tour", exact: true }).click();
  await page.getByRole("button", { name: "Keep exploring", exact: true }).click();
  await expect(page.locator("#tour-viewer")).toBeVisible();
  await page.getByRole("button", { name: "Exit tour", exact: true }).click();
  await page.getByRole("button", { name: "Exit to overview", exact: true }).click();
  await expect(page.locator("#tour-viewer")).toHaveCount(0);
  await page.getByRole("button", { name: "Return to tour", exact: true }).click();
  await expect(page.locator("#tour-viewer")).toBeVisible();
});

test("drag and wheel work on desktop; swipe, pinch and landscape work on mobile", async ({ page, isMobile }) => {
  const viewer = page.locator("#tour-viewer");
  await viewer.scrollIntoViewIfNeeded();
  const box = (await viewer.boundingBox())!;
  if (!isMobile) {
    await page.mouse.move(box.x + box.width * .4, box.y + box.height * .45);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width * .65, box.y + box.height * .48, { steps: 8 });
    await page.mouse.up();
    expect(Number(await viewer.getAttribute("data-pan-x"))).toBeGreaterThan(0);
    await page.mouse.wheel(0, -600);
    await expect(viewer).not.toHaveAttribute("data-zoom", "1");
  } else {
    const cdp = await page.context().newCDPSession(page);
    const y = box.y + box.height * .45;
    await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: box.x + 260, y }] });
    await cdp.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: box.x + 85, y }] });
    await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
    await expect(page.locator(".room-heading h2")).toHaveText("Kitchen");
    const center = box.x + box.width / 2;
    await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ id: 1, x: center - 30, y }, { id: 2, x: center + 30, y }] });
    await cdp.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ id: 1, x: center - 80, y }, { id: 2, x: center + 80, y }] });
    await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
    await expect(viewer).not.toHaveAttribute("data-zoom", "1");
    await page.setViewportSize({ width: 844, height: 390 });
    await page.getByRole("button", { name: "Enter full view", exact: true }).click();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    await expect(page.getByRole("button", { name: "Exit full view", exact: true })).toBeInViewport();
    await page.getByRole("button", { name: "Exit full view", exact: true }).click();
  }
});
