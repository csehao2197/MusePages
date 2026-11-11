import { test, expect, type Page } from "@playwright/test";
async function contact(page: Page) {
  const d = page.getByRole("dialog");
  await d.getByLabel("Name", {exact:true}).fill("Alex Example");
  await d.getByLabel("Email", {exact:true}).fill("alex@example.test");
  if(await d.getByLabel("Phone", {exact:true}).count()) await d.getByLabel("Phone", {exact:true}).fill("555-010-0123");
  await d.getByRole("checkbox").check();
}
function nextDate(day:number) {
  const d=new Date(); d.setDate(d.getDate()+1);
  while(d.getDay()!==day)d.setDate(d.getDate()+1);
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
}
test.beforeEach(async({page})=>{await page.goto("/");});
test("all source sections, desktop artwork and render",async({page})=>{
  await page.setViewportSize({width:1440,height:1000});
  await expect(page.getByRole("heading",{name:"Brewed in the mountains. Best at the source."})).toBeVisible();
  await expect(page.locator(".beer-card")).toHaveCount(12);
  for(const id of ["beers","taproom","tours","events","finder","shop","story"])await expect(page.locator(`#${id}`)).toBeAttached();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
  await page.screenshot({path:"test-results/desktop.png",fullPage:true});
});
test("style filter, name search, empty recovery and beer detail",async({page})=>{
  await page.getByRole("button",{name:"IPA",exact:true}).click();
  await expect(page.locator(".beer-card")).toHaveCount(3);
  await page.getByRole("searchbox",{name:"Search beers"}).fill("missing");
  await expect(page.getByRole("heading",{name:"No beers found."})).toBeVisible();
  await page.getByRole("button",{name:"Clear filters"}).click();
  await page.getByRole("button",{name:"Summit Haze",exact:true}).click();
  await expect(page.getByRole("dialog")).toContainText("6.8% ABV · 55 IBU");
  await page.getByRole("button",{name:"Back to tap list"}).click();
  await expect(page.getByRole("button",{name:"Summit Haze",exact:true})).toBeFocused();
});
test("flight limit, remove, replace and reset",async({page})=>{
  for(let i=0;i<4;i++)await page.getByRole("button",{name:"Add to flight",exact:true}).first().click();
  await page.getByRole("button",{name:"Add to flight",exact:true}).first().click();
  await expect(page.getByRole("status").filter({hasText:"Your flight has four"})).toBeVisible();
  await expect(page.locator(".flight-tray")).toContainText("$12.00");
  await page.getByRole("button",{name:"Remove from flight"}).first().click();
  await page.getByRole("button",{name:"Add to flight",exact:true}).first().click();
  await page.getByRole("button",{name:"Reset flight"}).click();
  await expect(page.locator(".flight-tray")).toContainText("0/4");
});
test("tour date error, recovery, price and local success reset",async({page})=>{
  await page.getByRole("button",{name:"Book Standard",exact:false}).click();
  const d=page.getByRole("dialog");
  await d.getByLabel("Tour date").fill(nextDate(1));
  await d.getByLabel("Number of guests").fill("3");
  await contact(page);
  await expect(d.locator(".total")).toContainText("$45.00");
  await d.getByRole("button",{name:"Preview reservation"}).click();
  await expect(d.getByRole("alert")).toContainText("weekend");
  await d.getByLabel("Tour date").fill(nextDate(6));
  await d.getByLabel("Tour time").selectOption("3PM");
  await d.getByRole("button",{name:"Preview reservation"}).click();
  await expect(d.getByRole("status")).toContainText("3 guest(s) · $45.00");
  await expect(d.getByRole("status")).toContainText("3PM");
  await expect(d.getByRole("status")).toContainText("9 demo spaces");
  await d.getByRole("button",{name:"Reset preview"}).click();
  await expect(d.getByLabel("Tour date")).toHaveValue("");
  await expect(d.getByLabel("Number of guests")).toHaveAttribute("max","9");
});
test("VIP weekday and native capacity, email, phone, age and past date validation",async({page})=>{
  await page.getByRole("button",{name:"Book VIP",exact:false}).click();
  const d=page.getByRole("dialog"); const submit=d.getByRole("button",{name:"Preview reservation"});
  await submit.click();
  expect(await d.getByLabel("Tour date").evaluate((e:HTMLInputElement)=>e.validity.valueMissing)).toBeTruthy();
  await d.getByLabel("Tour date").fill("2020-01-01");
  expect(await d.getByLabel("Tour date").evaluate((e:HTMLInputElement)=>e.validity.rangeUnderflow)).toBeTruthy();
  await d.getByLabel("Tour date").fill(nextDate(5));
  await d.getByLabel("Number of guests").fill("7");
  expect(await d.getByLabel("Number of guests").evaluate((e:HTMLInputElement)=>e.validity.rangeOverflow)).toBeTruthy();
  await d.getByLabel("Number of guests").fill("6");
  await d.getByLabel("Name",{exact:true}).fill("Test");
  await d.getByLabel("Email",{exact:true}).fill("invalid");
  expect(await d.getByLabel("Email",{exact:true}).evaluate((e:HTMLInputElement)=>e.validity.typeMismatch)).toBeTruthy();
  await d.getByLabel("Phone",{exact:true}).fill("abc");
  expect(await d.getByLabel("Phone",{exact:true}).evaluate((e:HTMLInputElement)=>e.validity.patternMismatch)).toBeTruthy();
  expect(await d.getByRole("checkbox").evaluate((e:HTMLInputElement)=>e.validity.valueMissing)).toBeTruthy();
  await contact(page);
  await expect(d.locator(".total")).toContainText("$270.00");
  await submit.click();
  await expect(d.getByRole("status")).toContainText("0 demo spaces");
  await d.getByRole("button",{name:"Reset preview"}).click();
  await expect(d.getByRole("button",{name:"Preview reservation"})).toHaveCount(0);
});
test("dinner capacity, price, local reservation and free RSVP",async({page})=>{
  await page.getByRole("button",{name:"Preview a reservation"}).click();
  const d=page.getByRole("dialog");
  await d.getByLabel("Number of guests").fill("5");
  expect(await d.getByLabel("Number of guests").evaluate((e:HTMLInputElement)=>e.validity.rangeOverflow)).toBeTruthy();
  await d.getByLabel("Number of guests").fill("2"); await contact(page);
  await expect(d.locator(".total")).toContainText("$170.00");
  await d.getByRole("button",{name:"Preview reservation"}).click();
  await expect(d.getByRole("status")).toContainText("2 demo spaces");
  await d.getByRole("button",{name:"Close",exact:true}).click();
  await page.getByRole("button",{name:"View event & RSVP"}).first().click();
  await expect(d.locator(".total")).toContainText("$0.00");
  await contact(page); await d.getByRole("button",{name:"Preview reservation"}).click();
  await expect(d.getByRole("status")).toContainText("No real transaction");
});
test("fictional finder ZIP empty reset and synchronized pin selection",async({page})=>{
  await page.getByLabel("Enter your zip code").fill("99999");
  await expect(page.getByText("No demo locations in this ZIP.")).toBeVisible();
  await page.getByRole("button",{name:"Reset ZIP search"}).click();
  await page.getByLabel("Enter your zip code").fill("28801");
  await expect(page.locator(".location-list button")).toHaveCount(3);
  await page.getByRole("button",{name:"Select Warehouse Guest Taps"}).click();
  await expect(page.locator(".location-list button.selected")).toContainText("Dark Hollow");
});
test("merch quantity native validation, gift value and no alcohol ordering",async({page})=>{
  await page.getByRole("button",{name:"Preview Flagship Hoodie"}).click();
  const d=page.getByRole("dialog");
  await d.getByLabel("Hoodie size").selectOption("L");
  await d.getByLabel("Quantity",{exact:true}).fill("0");
  expect(await d.getByLabel("Quantity",{exact:true}).evaluate((e:HTMLInputElement)=>e.validity.rangeUnderflow)).toBeTruthy();
  await d.getByLabel("Quantity",{exact:true}).fill("2");
  await expect(d.locator(".total")).toContainText("$110.00");
  await d.getByRole("button",{name:"Save to local wishlist"}).click();
  await expect(d.getByRole("status")).toContainText("Wishlist preview saved");
  await d.getByRole("button",{name:"Close",exact:true}).click();
  await expect(page.locator(".saved-count")).toContainText("2 items");
  await page.getByRole("button",{name:"Preview Gift Card",exact:true}).click();
  await d.getByLabel("Gift card value").selectOption("100");
  await expect(d.locator(".total")).toContainText("$100.00");
  await d.getByRole("button",{name:"Close dialog"}).click();
  await page.getByRole("button",{name:"Preview Mixed 12-Pack"}).click();
  await expect(d).toContainText("Alcohol display only");
  await expect(d.getByRole("button",{name:"Save to local wishlist"})).toHaveCount(0);
});
test("food, gallery, accessible beer menu and inquiry preview",async({page})=>{
  await page.getByRole("button",{name:"Show Garden illustration"}).click();
  await expect(page.locator(".gallery-main")).toHaveAttribute("src","/garden.svg");
  await page.getByRole("button",{name:"View Food Menu"}).click();
  await expect(page.getByRole("dialog")).toContainText("Wood-fired margherita");
  await page.keyboard.press("Escape");
  await page.getByRole("button",{name:"See Full Beer Menu",exact:false}).click();
  await expect(page.getByRole("dialog").locator(".menu-list p")).toHaveCount(12);
  await page.keyboard.press("Escape");
  await page.getByRole("button",{name:"Want to carry our beer?",exact:false}).click();
  await contact(page);
  await page.getByRole("dialog").getByLabel("Tell us about your idea").fill("A fictional tasting gathering for adult visitors.");
  await page.getByRole("button",{name:"Preview inquiry"}).click();
  await expect(page.getByRole("status").filter({hasText:"Inquiry preview ready"})).toBeVisible();
});
test("newsletter native email validation and reset; no external requests",async({page})=>{
  const remote:string[]=[];
  page.on("request",r=>{if(!r.url().startsWith("http://127.0.0.1:3113")&&!r.url().startsWith("data:"))remote.push(r.url());});
  await page.getByLabel("Newsletter email").fill("bad");
  await page.getByRole("button",{name:"Subscribe",exact:false}).click();
  expect(await page.getByLabel("Newsletter email").evaluate((e:HTMLInputElement)=>e.validity.typeMismatch)).toBeTruthy();
  await page.getByLabel("Newsletter email").fill("demo@example.test");
  await page.getByRole("button",{name:"Subscribe",exact:false}).click();
  await expect(page.getByText("Your subscription preview is saved")).toBeVisible();
  await page.getByRole("button",{name:"Reset signup"}).click();
  await expect(page.getByLabel("Newsletter email")).toHaveValue("");
  expect(remote).toEqual([]);
});
test("native dialog focus trap, keyboard escape and focus return",async({page})=>{
  const trigger=page.getByRole("button",{name:"Book a Tour",exact:false}).first();
  await trigger.focus();await page.keyboard.press("Enter");
  await expect(page.getByRole("dialog")).toBeVisible();
  for(let i=0;i<17;i++){await page.keyboard.press("Tab");expect(await page.evaluate(()=>!!document.activeElement?.closest("dialog"))).toBeTruthy();}
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await expect(trigger).toBeFocused();
});
test("mobile reduced motion navigation, footer accordion and no overflow",async({page})=>{
  await page.setViewportSize({width:390,height:844});
  await page.emulateMedia({reducedMotion:"reduce"});
  await page.getByRole("button",{name:"Open navigation"}).click();
  await page.getByRole("navigation",{name:"Main navigation"}).getByRole("link",{name:"Our Beers"}).click();
  await expect(page.getByRole("button",{name:"Open navigation"})).toHaveAttribute("aria-expanded","false");
  await page.getByRole("button",{name:"Summit Haze",exact:true}).click();
  await expect(page.getByRole("dialog")).toBeVisible();await page.keyboard.press("Escape");
  const visit=page.locator(".footer-col").first();
  await expect(visit).not.toHaveAttribute("open");
  await visit.locator("summary").click();
  await expect(visit.getByRole("button",{name:"Hours",exact:true})).toBeVisible();
  await visit.locator("summary").click();
  await expect(visit).not.toHaveAttribute("open");
  const grid=page.locator(".beer-grid");
  expect(await grid.evaluate(el=>el.scrollWidth>el.clientWidth)).toBeTruthy();
  await grid.evaluate(el=>el.scrollLeft=el.clientWidth);
  expect(await grid.evaluate(el=>el.scrollLeft>0)).toBeTruthy();
  expect(await page.evaluate(()=>getComputedStyle(document.documentElement).scrollBehavior)).toBe("auto");
  for(const w of [360,390,768]){
    await page.setViewportSize({width:w,height:844});
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
  }
  await page.setViewportSize({width:390,height:844});await page.evaluate(()=>scrollTo(0,0));
  await page.screenshot({path:"test-results/mobile.png",fullPage:true});
});
