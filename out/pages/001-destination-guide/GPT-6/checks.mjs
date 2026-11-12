export async function exercise(page, assert) {
  await page.getByRole("tab", { name: "Food", exact: true }).click();
  assert.equal(await page.locator("#attraction-cards .card").count(), 1);
  const save = page.getByRole("button", { name: "Save Tsukiji Outer Market" });
  await save.click();
  assert.equal(await save.getAttribute("aria-pressed"), "true");
  await page.getByRole("tab", { name: "5 Days", exact: false }).click();
  assert.equal(await page.locator("#days .day").count(), 5);
  await page.getByRole("button", { name: "Jul:", exact: false }).click();
  assert.match(await page.locator("#month-note").innerText(), /Fireworks/);
  await page.getByRole("button", { name: "Start Planning", exact: false }).click();
  await page.locator('[name="name"]').fill("Demo Traveler");
  await page.locator('[name="email"]').fill("demo@example.test");
  await page.getByRole("button", { name: "Create My Trip Outline", exact: false }).click();
  assert.match(await page.locator("#plan-result").innerText(), /no request was sent/);
  await page.getByRole("button", { name: "Close planner" }).click();
}
