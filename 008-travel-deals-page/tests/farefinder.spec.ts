import { test, expect, type Page } from "@playwright/test";

async function loaded(page: Page) {
  await page.goto("/");
  await expect(page.getByTestId("card-santorini")).toBeVisible();
}
async function filters(page: Page) {
  if(await page.locator(".filter-toggle").isVisible()) {
    if(await page.locator(".filter-toggle").getAttribute("aria-expanded")==="false") await page.locator(".filter-toggle").click();
  }
}
const grid = (page:Page)=>page.locator("#deals .grid");

test("source inventory, Portugal discovery and working categories",async({page})=>{
  await loaded(page);
  await expect(page.getByRole("heading",{name:"Deals That Won't Wait."})).toBeVisible();
  await expect(page.locator(".flash-card")).toHaveCount(4);
  await expect(grid(page).locator("article")).toHaveCount(6);
  await page.getByRole("button",{name:"Load More Deals"}).click();
  await expect(page.getByTestId("card-phuket")).toBeVisible();
  await page.getByRole("button",{name:"See All Portugal Deals"}).click();
  await expect(grid(page).locator("article")).toHaveCount(4);
  await expect(grid(page).getByTestId("card-lisbon")).toBeVisible();
  await page.getByRole("button",{name:"Car Rental Deals 45 deals · simulated"}).click();
  await expect(grid(page).locator("article")).toHaveCount(1);
  await expect(grid(page).getByTestId("card-car")).toBeVisible();
  await page.getByRole("button",{name:"Experience & Tours 56 deals · simulated"}).click();
  await expect(grid(page).getByTestId("card-tour")).toBeVisible();
});

test("combined search, region, budget, dates and sorting; empty recovery",async({page})=>{
  await loaded(page);
  await page.getByRole("textbox",{name:"From city"}).fill("London");
  await page.getByRole("textbox",{name:"To destination"}).fill("Japan");
  await page.getByLabel("Search dates").selectOption("Next Month");
  await page.getByRole("button",{name:"Find Deals"}).click();
  await filters(page);
  await page.getByLabel("Deal type",{exact:true}).selectOption("Packages");
  await page.getByLabel("Destination region").selectOption("Asia");
  await page.getByLabel("Budget",{exact:true}).selectOption("$700–$1500");
  await page.getByLabel("Sort deals").selectOption("Price Low-High");
  await expect(grid(page).locator("article")).toHaveCount(1);
  await expect(grid(page).getByTestId("card-kyoto")).toBeVisible();
  await page.getByLabel("Budget",{exact:true}).selectOption("Under $300");
  await expect(page.getByRole("heading",{name:"No escapes found just yet."})).toBeVisible();
  await page.getByRole("button",{name:"Explore all deals"}).click();
  await filters(page);
  await page.getByLabel("Sort deals").selectOption("Price Low-High");
  await expect(grid(page).locator("article").first()).toHaveAttribute("data-testid","card-tour");
  await page.getByLabel("Sort deals").selectOption("Biggest Savings");
  await expect(grid(page).locator("article").first()).toHaveAttribute("data-testid","card-barcelona");
  await page.getByLabel("Sort deals").selectOption("Departing Soon");
  await expect(grid(page).locator("article").first()).toHaveAttribute("data-testid","card-tokyo");
});

test("detail savings, native validation, claim preview and keyboard focus return",async({page})=>{
  await loaded(page);
  const opener=page.getByTestId("card-santorini").getByRole("button",{name:"View Deal"});
  await opener.click();
  const modal=page.getByRole("dialog");
  await expect(modal).toBeVisible();
  await expect(modal.locator(".total-saving")).toContainText("$1,882");
  await page.getByLabel("Deal travelers").fill("3");
  await expect(modal.locator(".breakdown")).toContainText("$2,697");
  await expect(modal.locator(".total-saving")).toContainText("$2,823");
  await page.getByLabel("Deal travelers").fill("0");
  await expect(modal.getByRole("button",{name:"Claim demo deal"})).toBeDisabled();
  await expect(modal.getByRole("alert")).toContainText("Choose 1 to 8");
  await page.getByLabel("Deal travelers").fill("3");
  await modal.getByRole("button",{name:"Claim demo deal"}).click();
  await expect(page.getByLabel("Claim email")).toBeFocused();
  await expect(modal.getByRole("status")).toHaveCount(0);
  await page.getByLabel("Claim email").fill("traveler@example.com");
  await modal.getByRole("button",{name:"Claim demo deal"}).click();
  await expect(modal.getByRole("status")).toContainText("Demo deal claimed!");
  await expect(modal.getByRole("status")).toContainText("$2,697");
  await expect(modal.getByRole("status")).toContainText("No booking");
  for(let n=0;n<12;n++){await page.keyboard.press("Tab");expect(await modal.evaluate(el=>el.contains(document.activeElement))).toBeTruthy();}
  await page.keyboard.press("Escape");
  await expect(modal).not.toBeVisible();
  await expect(opener).toBeFocused();
});

test("saved persistence, recent browsing and tailored recommendations",async({page})=>{
  await loaded(page);
  await page.getByTestId("card-santorini").getByRole("button",{name:"Save Santorini, Greece",exact:true}).click();
  await page.reload();
  await expect(page.getByTestId("card-santorini").getByRole("button",{name:"Unsave Santorini, Greece",exact:true})).toHaveAttribute("aria-pressed","true");
  await page.locator(".saved-link").click();
  await expect(grid(page).locator("article")).toHaveCount(1);
  await grid(page).getByRole("button",{name:"View Deal"}).click();
  await page.keyboard.press("Escape");
  await expect(page.locator(".recent-row")).toContainText("Santorini, Greece");
  await expect(page.locator(".recommendation").nth(1)).toContainText("Lisbon City Break");
  await grid(page).getByRole("button",{name:"Unsave Santorini, Greece",exact:true}).click();
  await expect(page.getByRole("heading",{name:"No escapes found just yet."})).toBeVisible();
  await page.reload();
  await expect(page.locator(".recent-row")).toContainText("Santorini, Greece");
  for(const id of ["cancun","kyoto","amalfi","maldives"]){
    await grid(page).getByTestId(`card-${id}`).getByRole("button",{name:"View Deal"}).click();
    await page.keyboard.press("Escape");
  }
  await expect(page.locator(".recent-row button")).toHaveCount(4);
  await expect(page.locator(".recent-row")).not.toContainText("Santorini, Greece");
  await page.reload();
  await expect(page.locator(".recent-row button")).toHaveCount(4);
});

test("alert journey includes prefilled destination, invalid inputs, loading and retryable error",async({page})=>{
  await loaded(page);
  await page.getByTestId("card-santorini").getByRole("button",{name:"View Deal"}).click();
  await page.getByRole("dialog").getByRole("button",{name:"Set a price alert"}).click();
  await expect(page.getByLabel("Where do you want to go?")).toHaveValue("Greece");
  await expect(page.getByLabel("Where do you want to go?")).toBeFocused();
  const alert=page.locator(".alert-form");
  await page.getByLabel("Where do you want to go?").fill("   ");
  expect(await page.getByLabel("Where do you want to go?").evaluate((el:HTMLInputElement)=>el.checkValidity())).toBeFalsy();
  await page.getByLabel("Where do you want to go?").fill("Greece");
  await alert.getByRole("button",{name:"Set Alert"}).click();
  await expect(page.getByLabel("Your max price")).toBeFocused();
  await page.getByLabel("Your max price").fill("0");
  expect(await page.getByLabel("Your max price").evaluate((el:HTMLInputElement)=>el.checkValidity())).toBeFalsy();
  await page.getByLabel("Your max price").fill("500");
  await alert.getByLabel("Email address").fill("fail@example.invalid");
  await alert.getByRole("button",{name:"Set Alert"}).click();
  await expect(alert.getByRole("button",{name:"Setting your demo alert…"})).toBeDisabled();
  await expect(alert.getByRole("alert")).toContainText("Demo service unavailable");
  await alert.getByLabel("Email address").fill("test@example.com");
  await alert.getByRole("button",{name:"Set Alert"}).click();
  await expect(alert.getByRole("status")).toContainText("Greece at $500 per person");
  await expect(alert.getByRole("status")).toContainText("no email will be sent");
});

test("newsletter, trust information and flash CTAs remain local",async({page})=>{
  await loaded(page);
  await page.getByRole("button",{name:"Best Price Guarantee*"}).click();
  await expect(page.getByRole("dialog")).toContainText("No commercial promise");
  await page.getByRole("button",{name:"Got it"}).click();
  await page.locator(".flash-card").first().getByRole("button",{name:"Book Now"}).click();
  await expect(page.getByRole("dialog")).toContainText("New York → Barcelona");
  await expect(page.getByRole("dialog").locator(".total-saving")).toContainText("$720");
  await page.keyboard.press("Escape");
  await page.getByLabel("Newsletter email").fill("reader@example.com");
  await page.getByRole("button",{name:"Subscribe",exact:true}).click();
  await expect(page.locator(".newsletter").getByRole("status")).toContainText("No email was sent or stored");
});

test("reduced motion, responsive filters, horizontal swipes and no page overflow",async({page},testInfo)=>{
  const browserErrors: string[]=[];
  page.on("pageerror",error=>browserErrors.push(error.message));
  await page.emulateMedia({reducedMotion:"reduce"});
  await loaded(page);
  await expect(page.locator(".pulse")).toHaveCSS("animation-name","none");
  const scroll=await page.locator(".flash-row").evaluate(el=>{el.scrollLeft=180;return el.scrollLeft;});
  expect(scroll).toBeGreaterThan(0);
  if(testInfo.project.name==="mobile"){
    await page.locator(".mobile-bottom").getByRole("button",{name:"Filter"}).click();
    await expect(page.locator(".filter-toggle")).toHaveAttribute("aria-expanded","true");
    await page.getByLabel("Deal type",{exact:true}).selectOption("Cruises");
    await expect(grid(page).getByTestId("card-cruise")).toBeVisible();
    await expect(page.locator(".mobile-bottom")).toContainText("1 Deals");
    await page.getByRole("button",{name:"Reset filters"}).click();
    await page.getByRole("button",{name:"Toggle navigation"}).click();
    await expect(page.locator(".nav")).toBeVisible();
    await page.locator(".nav").getByRole("link",{name:"Price alerts"}).click();
    await expect(page.locator(".nav")).not.toBeVisible();
  }
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBeTruthy();
  await page.reload();
  await expect(page.getByTestId("card-santorini")).toBeVisible();
  await page.evaluate(()=>window.scrollTo(0,0));
  await page.screenshot({path:`test-results/${testInfo.project.name}-full.png`,fullPage:true,animations:"disabled"});
  await page.getByTestId("card-santorini").scrollIntoViewIfNeeded();
  await page.screenshot({path:`test-results/${testInfo.project.name}-deals.png`,animations:"disabled"});
  if(testInfo.project.name==="mobile"){
    await page.setViewportSize({width:320,height:740});
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBeTruthy();
  }
  expect(browserErrors).toEqual([]);
});

test("browser storage failure is disclosed without blocking saving",async({page})=>{
  await page.addInitScript(()=>{Storage.prototype.setItem=()=>{throw new Error("Storage blocked");};});
  await loaded(page);
  await page.getByTestId("card-santorini").getByRole("button",{name:"Save Santorini, Greece",exact:true}).click();
  await expect(page.locator("#deals").getByRole("alert")).toContainText("Changes are kept for this visit only");
  await expect(page.locator(".saved-link")).toContainText("1");
});
