import { verify } from "../../../196-student-new-grad-portfolio/GPT-6/.checks/qa.mjs";
import { fileURLToPath } from "node:url";
import path from "node:path";

export async function checks(page, check)
{
    check((await page.locator("#result-title").textContent()).startsWith("5 sample"), "Initial count reflects actual sample data");
    check(await page.locator(".card").count() === 4, "Initial page size");
    await page.locator("#load").click();
    check(await page.locator(".card").count() === 5, "Load more reveals remainder");
    await page.locator("#sort").selectOption("low");
    check(await page.locator(".card").first().getAttribute("data-id") === "foundry", "Price ascending sort");
    await page.locator("[name=beds]").selectOption("4");
    await page.locator("#apply").click();
    check((await page.locator("#result-title").textContent()).startsWith("3 sample"), "Bedrooms filter");
    await page.locator("[name=max]").fill("100000");
    await page.locator("#apply").click();
    check(await page.locator("#empty").isVisible(), "Friendly no-match state");
    await page.locator("#broaden").click();
    check((await page.locator("#result-title").textContent()).startsWith("6 sample"), "Broaden clears preferences and location");
    await page.locator("[data-market=Rent]").click();
    check((await page.locator("#result-title").textContent()).startsWith("1 sample rentals"), "Rent market");
    await page.locator("[data-market=Buy]").click();
    await page.locator("[data-view=map]").click();
    check(await page.locator(".map-panel").isVisible(), "Map view");
    check(await page.locator(".marker").count() < 6, "Nearby samples cluster");
    await page.locator("#move-search").check();
    await page.locator("#west").click();
    check((await page.locator("#result-title").textContent()).startsWith("4 sample"), "Search-as-move west filters coordinates");
    await page.locator("#reset-map").click();
    await page.locator("#draw").click();
    const box = await page.locator(".map").boundingBox();
    await page.mouse.move(box.x+box.width*.05,box.y+box.height*.1);
    await page.mouse.down();
    await page.mouse.move(box.x+box.width*.5,box.y+box.height*.85,{ steps:5 });
    await page.mouse.up();
    check((await page.locator("#result-title").textContent()).startsWith("4 sample"), "Drawn rectangle filters coordinates");
    await page.locator("#reset-map").click();
    await page.locator("[data-view=list]").click();
    check(await page.locator("#cards").evaluate(element => element.classList.contains("list")), "List view");
    const favorite = page.locator(".favorite").first();
    await favorite.click();
    check(await favorite.getAttribute("aria-pressed") === "true", "Favorite toggle");
    await favorite.click();
    await page.locator("#save-search").click();
    await page.locator("[name=searchname]").fill("QA sample search");
    await page.getByRole("button",{ name:"Save on this browser",exact:true }).click();
    check(await page.locator(".saved-item").count() === 1, "Named search saved locally");
    await page.keyboard.press("Escape");
    await page.reload();
    await page.locator("#manage").click();
    check((await page.locator("#saved-list").textContent()).includes("QA sample search"), "Saved search persists after reload");
    await page.getByRole("button",{ name:"Delete saved search" }).click();
    check(await page.locator(".saved-item").count() === 0, "Saved search deletion");
    await page.keyboard.press("Escape");
    await page.locator("#share-search").click();
    const shared = await page.locator("#share-link").inputValue();
    check(new URL(shared).searchParams.has("search"), "Share link encodes search criteria");
    await page.keyboard.press("Escape");
    await page.goto(shared);
    check((await page.locator("#result-title").textContent()).startsWith("5 sample"), "Shared URL restores location and criteria");
    await page.locator(".tour-button").first().click();
    await page.locator("[name=name]").fill("Visitor");
    await page.locator("[name=email]").fill("visitor@example.com");
    await page.locator("[name=date]").fill("2030-01-20");
    await page.getByRole("button",{ name:"Request demo tour",exact:true }).click();
    check((await page.locator("#tour-result").textContent()).includes("Nothing sent"), "Tour form local-only");
    await page.keyboard.press("Escape");
    await page.setViewportSize({ width:390, height:844 });
    await page.locator("#filter-toggle").click();
    check(await page.locator("#filters").isVisible(), "Mobile filter drawer opens");
    await page.locator("[name=keywords]").fill("pool");
    await page.locator("#apply").click();
    check(!await page.locator("#filters").isVisible(), "Applying mobile filters collapses drawer");
    check((await page.locator("#result-title").textContent()).startsWith("1 sample"), "Mobile keyword filter applies");
    await page.locator("#mobile-map").click();
    check(await page.locator(".map-panel").isVisible(), "Sticky mobile map toggle opens map");
    await page.locator("#mobile-map").click();
    check(!await page.locator(".map-panel").isVisible(), "Sticky mobile map toggle returns to homes");
    await page.setViewportSize({ width:1200, height:900 });
}

if (process.argv[1] === fileURLToPath(import.meta.url))
{
    await verify(path.resolve(path.dirname(fileURLToPath(import.meta.url)), ".."), checks);
}
