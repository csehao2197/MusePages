import { test, expect } from "@playwright/test";
import { localDate } from "../components/fixtures";

function futureDay(day: number) {
  const d = new Date(); d.setDate(d.getDate() + 2);
  while(d.getDay()!==day) d.setDate(d.getDate()+1);
  return localDate(d);
}
test.beforeEach(async ({page}) => { await page.goto("/"); await expect(page.getByRole("heading", {name:"AURELIAN",exact:true})).toBeVisible(); });

test("seasonal, vegetarian and botanical journeys; course modal keyboard focus",async({page})=>{
  const menu=page.locator("#menu");
  await expect(menu.getByRole("heading",{name:"Hokkaido Scallop"})).toBeVisible();
  await menu.getByRole("button",{name:"Vegetarian",exact:true}).click();
  await expect(menu.getByRole("heading",{name:"Roasted King Oyster Mushroom"})).toBeVisible();
  await menu.getByLabel("Pairing accompaniment").selectOption("botanical");
  await expect(menu.getByText("$230 per guest with your selection")).toBeVisible();
  await expect(menu.getByText("↳ Pear & thyme · alcohol-free")).toBeVisible();
  const opener=menu.getByRole("button",{name:"Course notes +"}).nth(1);
  await opener.focus();await page.keyboard.press("Enter");
  const modal=page.getByRole("dialog");
  await expect(modal.getByRole("heading",{name:"Roasted King Oyster Mushroom"})).toBeVisible();
  await expect(modal.getByText(/No allergen-free guarantee/)).toBeVisible();
  await page.keyboard.press("Tab");await expect.poll(()=>page.evaluate(()=>!!document.activeElement?.closest("dialog"))).toBe(true);
  await page.keyboard.press("Escape");await expect(opener).toBeFocused();
  await menu.getByRole("button",{name:"Seasonal",exact:true}).click();
  await expect(menu.getByRole("heading",{name:"Hokkaido Scallop"})).toBeVisible();
});

test("adult-only wine selection, coherent reservation preview, confirmation and invalidation",async({page})=>{
  await page.getByLabel("Pairing accompaniment").selectOption("wine");
  await expect(page.locator("#menu").getByText(/2024 Chablis Premier Cru/)).toBeVisible();
  const section=page.locator("#reservations");
  await section.getByLabel("Date",{exact:true}).fill(futureDay(3));
  await section.getByLabel("Party size").selectOption("3");
  await section.getByRole("combobox",{name:"Seating",exact:true}).selectOption("20:30");
  await section.getByLabel("Special occasion").selectOption("Anniversary");
  await section.getByRole("button",{name:"Check Availability"}).click();
  await expect(section.getByRole("alert")).toContainText("Wine is adult-only");
  await page.getByRole("checkbox").check();
  await section.getByRole("button",{name:"Check Availability"}).click();
  await expect(section.getByText("Estimated subtotal $840")).toBeVisible();
  await expect(section.locator(".booking-preview")).toContainText("8:30 PM · 3 guests");
  await expect(section.locator(".booking-preview")).toContainText("Anniversary");
  await section.getByRole("button",{name:"Confirm local preview"}).click();
  await expect(section.getByRole("status")).toContainText("not a reservation");
  await section.getByLabel("Party size").selectOption("1");
  await expect(section.locator(".booking-preview")).toHaveCount(0);
  await section.getByRole("button",{name:"Check Availability"}).click();
  await expect(section.getByText("Estimated subtotal $280")).toBeVisible();
  await section.getByRole("button",{name:"Start over"}).click();
  await expect(section.locator(".booking-preview")).toHaveCount(0);
});

test("closed and empty-availability recovery; required and past dates",async({page})=>{
  const s=page.locator("#reservations"),date=s.getByLabel("Date",{exact:true});
  await date.fill("");
  await s.getByRole("button",{name:"Check Availability"}).click();
  expect(await date.evaluate((el:HTMLInputElement)=>el.validity.valueMissing)).toBe(true);
  await date.fill("2020-01-01");expect(await date.evaluate((el:HTMLInputElement)=>el.validity.rangeUnderflow)).toBe(true);
  await date.fill(futureDay(1));await s.getByRole("button",{name:"Check Availability"}).click();
  await expect(s.getByRole("alert")).toContainText("closed Monday and Tuesday");
  await date.fill(futureDay(0));await s.getByRole("combobox",{name:"Seating",exact:true}).selectOption("20:30");
  await s.getByRole("button",{name:"Check Availability"}).click();
  await expect(s.getByRole("alert")).toContainText("No illustrative tables");
  await s.getByRole("combobox",{name:"Seating",exact:true}).selectOption("17:30");
  await s.getByRole("button",{name:"Check Availability"}).click();
  await expect(s.getByText("Estimated subtotal $370")).toBeVisible();
  await s.getByLabel("Party size").selectOption("8");
  await s.getByRole("button",{name:"Check Availability"}).click();
  await expect(s.getByText("Estimated subtotal $1,480")).toBeVisible();
});

test("private event capacity, contact validation, estimate and local reset",async({page})=>{
  const opener=page.getByRole("button",{name:"Inquire About Private Dining"});
  await opener.click();const d=page.getByRole("dialog");
  await d.getByRole("button",{name:"Preview local inquiry"}).click();
  expect(await d.getByLabel("Your name").evaluate((el:HTMLInputElement)=>el.validity.valueMissing)).toBe(true);
  await d.getByLabel("Your name").fill("   ");
  expect(await d.getByLabel("Your name").evaluate((el:HTMLInputElement)=>el.validity.patternMismatch)).toBe(true);
  await d.getByLabel("Your name").fill("Demo Guest");
  await d.getByLabel("Email",{exact:true}).fill("invalid");
  expect(await d.getByLabel("Email",{exact:true}).evaluate((el:HTMLInputElement)=>el.validity.typeMismatch)).toBe(true);
  await d.getByLabel("Email",{exact:true}).fill("guest@example.test");
  await d.getByLabel("Guests",{exact:true}).fill("25");
  expect(await d.getByLabel("Guests",{exact:true}).evaluate((el:HTMLInputElement)=>el.validity.rangeOverflow)).toBe(true);
  await d.getByLabel("Guests",{exact:true}).fill("7");
  expect(await d.getByLabel("Guests",{exact:true}).evaluate((el:HTMLInputElement)=>el.validity.rangeUnderflow)).toBe(true);
  await d.getByLabel("Guests",{exact:true}).fill("24");
  await d.getByLabel("Event date").fill(futureDay(5));
  await d.getByLabel("Event type").selectOption("Wine dinner (adults 21+ only)");
  await expect(d.getByText("Starting estimate: $3,600")).toBeVisible();
  await d.getByRole("button",{name:"Preview local inquiry"}).click();
  await expect(d.getByRole("status")).toContainText("No request has been sent");
  await expect(d.getByRole("status")).toContainText("24 guests");
  await d.getByRole("button",{name:"Create another inquiry"}).focus();
  await page.keyboard.press("Tab");await expect(d.getByRole("button",{name:"Close inquiry"})).toBeFocused();
  await page.keyboard.press("Shift+Tab");await expect(d.getByRole("button",{name:"Create another inquiry"})).toBeFocused();
  await d.getByRole("button",{name:"Create another inquiry"}).click();
  await expect(d.getByLabel("Your name")).toHaveValue("");
  await page.keyboard.press("Escape");await expect(opener).toBeFocused();
});

test("gallery navigation restores original focus; wine list and bottle details",async({page})=>{
  const g=page.getByRole("button",{name:"Open gallery: A study in restraint"});
  await g.click();let d=page.getByRole("dialog");
  await expect(d.getByRole("heading",{name:"A study in restraint"})).toBeVisible();
  await d.getByRole("button",{name:"Next image →"}).click();
  await expect(d.getByRole("heading",{name:"The room after dusk"})).toBeVisible();
  await d.getByRole("button",{name:"← Previous image"}).click();
  await expect(d.getByRole("heading",{name:"A study in restraint"})).toBeVisible();
  await d.getByRole("button",{name:"Close dialog"}).click();await expect(g).toBeFocused();
  await page.getByRole("button",{name:"View Full Wine List →"}).click();
  await expect(page.getByRole("dialog")).toContainText("Botanical alcohol-free pairing $45");
  await page.keyboard.press("Escape");
  await page.locator(".bottle-card").nth(3).click();
  await expect(page.getByRole("dialog")).toContainText("$320 per bottle");
  await expect(page.getByRole("dialog")).toContainText("fictional producer");
  await page.keyboard.press("Escape");
});

test("newsletter validation/reset, information actions and no external services",async({page})=>{
  const external:string[]=[];
  page.on("request",r=>{if(!new URL(r.url()).hostname.match(/^(127\.0\.0\.1|localhost)$/))external.push(r.url());});
  const email=page.getByRole("textbox",{name:"Newsletter email"});
  await email.fill("bad");
  await page.getByRole("button",{name:"Subscribe",exact:true}).click();
  expect(await email.evaluate((el:HTMLInputElement)=>el.validity.typeMismatch)).toBe(true);
  await email.fill("reader@example.test");
  await page.getByRole("button",{name:"Subscribe",exact:true}).click();
  await expect(page.getByRole("status")).toContainText("No email was stored or sent");
  await page.getByRole("button",{name:"Use another email"}).click();await expect(email).toBeEnabled();
  for(const label of ["Get Directions →","Privacy","Terms","Instagram preview","Facebook preview"]){
    await page.getByRole("button",{name:label,exact:true}).click();
    await expect(page.getByRole("dialog")).toBeVisible();await page.keyboard.press("Escape");
  }
  expect(external).toEqual([]);
  await page.reload();await expect(page.getByRole("status")).toHaveCount(0);
});

test("responsive navigation, reduced motion, no overflow and rendered screenshots",async({page},info)=>{
  const mobile=info.project.name==="mobile";
  if(mobile){
    await page.getByRole("button",{name:"Open navigation"}).click();
    const nav=page.getByRole("dialog",{name:"Mobile navigation"});
    await expect(nav).toBeVisible();
    await page.keyboard.press("Escape");await expect(page.getByRole("button",{name:"Open navigation"})).toBeFocused();
    await page.getByRole("button",{name:"Open navigation"}).click();
    await nav.getByRole("link",{name:"Menu",exact:true}).click();
    await expect(nav).not.toBeVisible();
    await expect(page.getByRole("link",{name:"Reserve your evening ↗"})).toBeVisible();
    await page.setViewportSize({width:320,height:700});
    await expect.poll(()=>page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);
    await page.setViewportSize({width:390,height:664});
  }else{await page.getByRole("navigation",{name:"Main navigation"}).getByRole("link",{name:"Menu",exact:true}).click();}
  await expect.poll(()=>page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);
  expect(await page.locator(".hero-art").evaluate(el=>getComputedStyle(el).animationName)).toBe("none");
  await page.evaluate(()=>window.scrollTo(0,0));
  await page.screenshot({path:info.outputPath(`${info.project.name}-hero.png`),fullPage:false});
  await page.screenshot({path:info.outputPath(`${info.project.name}-full.png`),fullPage:true});
});
