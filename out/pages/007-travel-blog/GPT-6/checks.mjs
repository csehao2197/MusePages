export async function exercise(page, assert, width) {
  let scenarios = 0;
  const cards = page.locator(".story-card");
  const close = async () => {
    await page.getByRole("button", { name: "Close dialog", exact: true }).click();
    assert.equal(await page.locator("#content-dialog").evaluate((dialog) => dialog.open), false);
  };
  const reset = async () => {
    await page.locator('[data-filter="All"]').click();
    assert.equal(await cards.count(), 9);
  };
  const bounds = async () => assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, `Overflow at ${width}`);

  assert.equal(await cards.count(), 9);
  assert.equal(await cards.first().getAttribute("data-id"), "rail");
  assert.equal(await page.locator(".writer-card").count(), 4);
  assert.equal(await page.locator(".photo-tile").count(), 6);
  assert.equal(await page.locator(".trending-entry").count(), 5);
  scenarios++;

  await page.locator('[data-filter="Food & Drink"]').click();
  assert.equal(await cards.count(), 3);
  assert.ok((await cards.locator(".card-category").allTextContents()).every((text) => text === "Food & Drink"));
  await page.locator('[data-filter="Travel Tips"]').click();
  assert.equal(await cards.count(), 3);
  await reset();
  scenarios++;

  await page.locator('[data-sort="popular"]').click();
  assert.equal(await cards.first().getAttribute("data-id"), "business");
  await page.locator('[data-sort="recent"]').click();
  assert.equal(await cards.first().getAttribute("data-id"), "rail");
  await page.locator("#load-more").click();
  assert.equal(await cards.count(), 12);
  assert.equal(await page.locator("#load-more").isVisible(), false);
  assert.equal(await page.evaluate(() => document.activeElement?.closest(".story-card")?.dataset.id), "slow-travel");
  scenarios++;

  await page.locator('.story-card[data-id="rail"] .bookmark').click();
  assert.equal(await page.locator('.story-card[data-id="rail"] .bookmark').getAttribute("aria-pressed"), "true");
  await page.reload({ waitUntil: "networkidle" });
  assert.equal(await page.locator('.story-card[data-id="rail"] .bookmark').getAttribute("aria-pressed"), "true");
  await page.locator("#saved-open").click();
  assert.equal(await cards.count(), 1);
  await page.locator('.story-card[data-id="rail"] .bookmark').click();
  assert.equal(await cards.count(), 0);
  assert.equal(await page.locator("#empty-state").isVisible(), true);
  await page.locator("#empty-reset").click();
  assert.equal(await cards.count(), 9);
  await page.locator('.story-card[data-id="rail"] .bookmark').click();
  scenarios++;

  await page.locator("#search-open").click();
  await page.getByLabel("Search stories, places and writers").fill("Japan");
  assert.equal(await page.locator(".search-result").count(), 1);
  await page.locator(".search-result").click();
  assert.match(await page.locator("#dialog-title").innerText(), /Japan Rail Pass/);
  assert.match(await page.locator(".article-notice").innerText(), /not a full reported article/);
  await page.keyboard.press("Escape");
  assert.equal(await page.locator("#content-dialog").evaluate((dialog) => dialog.open), false);
  assert.equal(await page.evaluate(() => document.activeElement.id), "search-open");
  await page.locator("#search-open").click();
  await page.getByLabel("Search stories, places and writers").fill('<img src=x onerror="alert(1)">');
  assert.equal(await page.locator(".search-result").count(), 0);
  assert.equal(await page.locator("#search-results img").count(), 0);
  assert.match(await page.locator("#search-status").innerText(), /No stories found/);
  await close();
  scenarios++;

  await page.locator(".hero-read").click();
  assert.match(await page.locator("#dialog-title").innerText(), /48 Hours in Santorini/);
  await page.locator('#content-dialog [data-save="santorini"]').click();
  assert.equal(await page.locator('#content-dialog [data-save="santorini"]').getAttribute("aria-pressed"), "true");
  await close();
  await page.locator("#saved-open").click();
  assert.equal(await cards.count(), 2);
  await reset();
  scenarios++;

  await page.locator("#portugal-all").click();
  assert.equal(await page.locator(".search-result").count(), 4);
  await page.locator('.search-result[data-post="ceramics"]').click();
  assert.match(await page.locator("#dialog-title").innerText(), /Ceramics Villages/);
  await close();
  await page.locator('[data-author="Priya Sharma"]').click();
  assert.equal(await cards.count(), 3);
  assert.ok((await cards.locator(".card-byline strong").allTextContents()).every((text) => text === "Priya Sharma"));
  await page.locator("#clear-filters").click();
  assert.equal(await cards.count(), 9);
  scenarios++;

  await page.getByLabel("Your next adventure starts in your inbox.").fill("invalid-email");
  await page.getByRole("button", { name: "Subscribe", exact: true }).click();
  assert.match(await page.locator("#newsletter-status").innerText(), /Demo signup/);
  assert.equal(await page.locator("#newsletter-email").evaluate((input) => input.validity.valid), false);
  await page.getByLabel("Your next adventure starts in your inbox.").fill("test@example.invalid");
  await page.getByRole("button", { name: "Subscribe", exact: true }).click();
  assert.match(await page.locator("#newsletter-status").innerText(), /no email was stored or sent/);
  assert.equal(await page.locator("#newsletter-email").inputValue(), "");
  scenarios++;

  await page.locator('[data-info="budget"]').click();
  assert.equal(await page.locator("#budget-total").innerText(), "$747.50");
  await page.getByLabel("Days", { exact: true }).fill("10");
  assert.equal(await page.locator("#budget-total").innerText(), "$920.00");
  await page.getByLabel("Daily costs ($)", { exact: true }).fill("-1");
  assert.match(await page.locator("#budget-total").innerText(), /Enter valid costs/);
  await page.getByLabel("Daily costs ($)", { exact: true }).fill("0");
  await page.getByLabel("Transport ($)", { exact: true }).fill("0");
  assert.equal(await page.locator("#budget-total").innerText(), "$0.00");
  await page.getByLabel("Days", { exact: true }).fill("1.5");
  assert.match(await page.locator("#budget-total").innerText(), /whole days/);
  await close();
  scenarios++;

  await page.locator('[data-info="packing"]').click();
  const firstItem = page.locator(".pack-list input").first();
  await firstItem.check();
  assert.equal(await firstItem.isChecked(), true);
  await close();
  await page.locator('[data-info="packing"]').click();
  assert.equal(await page.locator(".pack-list input").first().isChecked(), false);
  await close();
  await page.locator('[data-info="cookies"]').click();
  await page.getByRole("button", { name: "Clear my saved stories" }).click();
  assert.match(await page.locator("#storage-status").innerText(), /cleared from this device/);
  assert.equal(await page.evaluate(() => localStorage.getItem("wanderlust-saved")), null);
  await close();
  await page.locator("#saved-open").click();
  assert.equal(await cards.count(), 0);
  await reset();
  scenarios++;

  const information = await page.locator("[data-info]").evaluateAll((buttons) => [...new Set(buttons.map((button) => button.dataset.info))].filter((key) => !["packing", "budget", "cookies"].includes(key)));
  for (const key of information) {
    await page.locator(`[data-info="${key}"]`).first().click();
    assert.ok((await page.locator("#dialog-title").innerText()).trim().length > 5);
    await close();
  }
  await page.locator(".photo-tile").first().click();
  assert.match(await page.locator("#dialog-title").innerText(), /Japan Rail Pass/);
  await close();
  scenarios++;

  if (width <= 1000) {
    await page.locator("#menu-open").click();
    assert.equal(await page.locator("#menu-dialog").evaluate((dialog) => dialog.open), true);
    await page.keyboard.press("Shift+Tab");
    assert.equal(await page.evaluate(() => !!document.activeElement.closest("#menu-dialog")), true);
    assert.equal(await page.evaluate(() => document.activeElement.id), "mobile-subscribe");
    await page.keyboard.press("Tab");
    assert.equal(await page.evaluate(() => document.activeElement.id), "menu-close");
    await page.locator('#menu-dialog [data-category="Culture"]').click();
    assert.equal(await page.locator("#menu-dialog").evaluate((dialog) => dialog.open), false);
    assert.equal(await cards.count(), 2);
    await page.locator("#menu-open").click();
    await page.keyboard.press("Escape");
    assert.equal(await page.locator("#menu-dialog").evaluate((dialog) => dialog.open), false);
    await reset();
    scenarios++;
  }
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForFunction(() => !document.querySelector("#back-top").hidden);
  await page.locator("#back-top").click();
  await page.waitForFunction(() => window.scrollY < 3);
  await bounds();
  assert.equal(await page.locator("body").evaluate((element) => getComputedStyle(element).overflowY), "visible");
  scenarios++;
  return scenarios;
}
