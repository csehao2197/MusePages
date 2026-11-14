export async function exercise(page, assert) {
  await page.getByRole("button", { name: "Marine", exact: true }).click();
  assert.equal(await page.locator(".trip").count(), 1);
  await page.getByRole("button", { name: "View Trip" }).click();
  assert.ok(await page.locator("dialog").isVisible());
  await page.getByRole("button", { name: "Note my interest" }).click();
  assert.match(await page.locator("#interest-status").innerText(), /No request/);
  await page.getByRole("button", { name: "Close details" }).click();
  await page.getByRole("button", { name: "All adventures" }).click();
  assert.equal(await page.locator(".trip").count(), 6);
  await page.getByLabel("Departure city", { exact: true }).fill("London");
  await page.getByRole("button", { name: "Calculate my footprint" }).click();
  const first = await page.locator("#carbon-result b").innerText();
  await page.getByRole("button", { name: "More travelers" }).click();
  await page.getByRole("button", { name: "Calculate my footprint" }).click();
  assert.notEqual(await page.locator("#carbon-result b").innerText(), first);
  for (let i=0;i<8;i++) {
    if (await page.getByRole("button", { name: "More travelers" }).isEnabled()) await page.getByRole("button", { name: "More travelers" }).click();
  }
  assert.equal(await page.locator("#travelers").innerText(), "8");
  await page.getByRole("button", { name: "Next story", exact: true }).click();
  assert.match(await page.locator("#quote").innerText(), /Akira/);
  await page.getByRole("button", { name: "Next lodge", exact: true }).click();
  await page.waitForTimeout(100);
  assert.ok(await page.locator("#lodge-track").evaluate(e=>e.scrollLeft>0));
  await page.getByRole("textbox", { name: "Email address", exact: true }).fill("test@example.invalid");
  await page.getByRole("button", { name: "Subscribe", exact: true }).click();
  assert.match(await page.locator("#subscribe-status").innerText(), /no email was stored/);
}
