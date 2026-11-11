import { test, expect, type Page } from "@playwright/test";
import { readFile } from "node:fs/promises";

async function fillRSVP(page:Page) {
  const form = page.locator(".rsvp-form");
  await form.getByLabel("Full name").fill("Alex Morgan");
  await form.getByLabel("Email address").fill("alex@example.com");
  await form.getByLabel("Phone number").fill("(480) 555-0123");
  await form.getByLabel("Preferred tour time").selectOption("11:00");
  await form.getByLabel("No", {exact:true}).check();
  return form;
}
test.beforeEach(async ({page})=>{await page.goto("/");});

test("property identity, archival event and honest illustrated presentation",async({page},info)=>{
  await expect(page.getByRole("heading",{name:"Extraordinary views. Exceptional living."})).toBeVisible();
  await expect(page.locator(".hero-address")).toContainText("4821 Ridgewood Terrace");
  await expect(page.locator(".hero-price")).toContainText("$2,450,000");
  await expect(page.locator(".highlights article")).toHaveCount(8);
  await expect(page.locator(".gallery-item")).toHaveCount(12);
  await expect(page.locator(".archive-note")).toContainText("April 4, 2026");
  await expect(page.locator(".event-card")).toContainText("Saturday, November 14, 2026");
  await expect(page.locator(".hero .art-caption")).toContainText("NOT A PROPERTY PHOTOGRAPH");
  await expect(page.locator(".agent-info")).toContainText("not actual certifications");
  await page.screenshot({path:info.outputPath("final-top.png"),fullPage:false});
  await page.screenshot({path:info.outputPath("final-full.png"),fullPage:true});
});

test("gallery wraps, arrow keyboard navigation, focus trap and Escape return",async({page},info)=>{
  const opener = page.getByRole("button",{name:"Open Twilight arrival illustration",exact:true});
  await opener.click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await page.screenshot({path:info.outputPath("final-gallery.png")});
  await expect(dialog.getByText("1 of 12",{exact:true})).toBeVisible();
  await dialog.getByRole("button",{name:"Previous illustration"}).click();
  await expect(dialog.getByText("12 of 12",{exact:true})).toBeVisible();
  await dialog.getByRole("button",{name:"Next illustration"}).focus();
  await page.keyboard.press("ArrowRight");
  await expect(dialog.getByText("1 of 12",{exact:true})).toBeVisible();
  await page.keyboard.press("ArrowLeft");
  await expect(dialog.getByText("12 of 12",{exact:true})).toBeVisible();
  for(let i=0;i<7;i++)await page.keyboard.press("Tab");
  expect(await dialog.evaluate(el=>el.contains(document.activeElement))).toBe(true);
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(opener).toBeFocused();
});

test("RSVP native validation, local confirmation, calendar and reset",async({page})=>{
  const form = page.locator(".rsvp-form");
  await form.getByRole("button",{name:"Reserve My Spot"}).click();
  expect(await form.evaluate(el=>(el as HTMLFormElement).checkValidity())).toBe(false);
  await fillRSVP(page);
  await form.getByLabel("Email address").fill("invalid");
  await form.getByRole("button",{name:"Reserve My Spot"}).click();
  expect(await form.getByLabel("Email address").evaluate(el=>(el as HTMLInputElement).validity.typeMismatch)).toBe(true);
  await form.getByLabel("Email address").fill("alex@example.com");
  await form.getByLabel("Phone number").fill("abcdefg");
  await form.getByRole("button",{name:"Reserve My Spot"}).click();
  expect(await form.getByLabel("Phone number").evaluate(el=>(el as HTMLInputElement).validity.patternMismatch)).toBe(true);
  await form.getByLabel("Phone number").fill("-------");
  await form.getByRole("button",{name:"Reserve My Spot"}).click();
  expect(await form.getByLabel("Phone number").evaluate(el=>(el as HTMLInputElement).validity.patternMismatch)).toBe(true);
  await form.getByLabel("Phone number").fill("480-555-0123");
  await form.getByLabel("Party size").fill("0");
  await form.getByRole("button",{name:"Reserve My Spot"}).click();
  expect(await form.getByLabel("Party size").evaluate(el=>(el as HTMLInputElement).validity.rangeUnderflow)).toBe(true);
  await form.getByLabel("Party size").fill("7");
  await form.getByRole("button",{name:"Reserve My Spot"}).click();
  expect(await form.getByLabel("Party size").evaluate(el=>(el as HTMLInputElement).validity.rangeOverflow)).toBe(true);
  await form.getByLabel("Party size").fill("1.5");
  await form.getByRole("button",{name:"Reserve My Spot"}).click();
  expect(await form.getByLabel("Party size").evaluate(el=>(el as HTMLInputElement).validity.stepMismatch)).toBe(true);
  await form.getByLabel("Party size").fill("2");
  await form.getByRole("button",{name:"Reserve My Spot"}).click();
  await expect(page.getByRole("status")).toContainText("Alex Morgan");
  await expect(page.getByRole("status")).toContainText("2 guests");
  const pending = page.waitForEvent("download");
  await page.getByRole("button",{name:"Save tour to calendar"}).click();
  const calendar = await pending;
  const text = await readFile((await calendar.path())!,"utf8");
  expect(text).toContain("DTSTART:20261114T180000Z");
  expect(text).toContain("DTEND:20261114T183000Z");
  expect(text).toContain("No real event or reservation");
  await page.getByRole("button",{name:"Reset reservation"}).click();
  await expect(form.getByLabel("Full name")).toHaveValue("");
  await expect(form.getByLabel("Preferred tour time")).toHaveValue("");
});

test("RSVP capacity, full slot, failure recovery and empty reset",async({page})=>{
  const form = await fillRSVP(page);
  await form.getByLabel("Preferred tour time").selectOption("12:30");
  await form.getByRole("button",{name:"Reserve My Spot"}).click();
  await expect(form.getByRole("alert")).toContainText("full");
  await form.getByLabel("Preferred tour time").selectOption("12:00");
  await form.getByLabel("Party size").fill("3");
  await form.getByRole("button",{name:"Reserve My Spot"}).click();
  await expect(form.getByRole("alert")).toContainText("Only 2");
  await form.getByLabel("Party size").fill("2");
  await form.locator("summary").click();
  await form.getByLabel("Simulate local service failure").check();
  await form.getByRole("button",{name:"Reserve My Spot"}).click();
  await expect(form.getByRole("alert")).toContainText("unavailable");
  await expect(form.getByLabel("Full name")).toHaveValue("Alex Morgan");
  await form.getByLabel("Simulate local service failure").uncheck();
  await form.getByRole("button",{name:"Reserve My Spot"}).click();
  await expect(page.getByRole("status")).toContainText("12:00 PM");
  await page.getByRole("button",{name:"Reset reservation"}).click();
  await fillRSVP(page);
  await form.getByLabel("Full name").fill("   ");
  await form.getByRole("button",{name:"Reserve My Spot"}).click();
  await expect(form.getByRole("alert")).toContainText("not only spaces");
  await form.getByRole("button",{name:"Clear form",exact:true}).click();
  await expect(form.getByLabel("Full name")).toHaveValue("");
  await expect(form.getByRole("alert")).toHaveCount(0);
});

test("event calendar and PDF spec sheet contain real demo details",async({page,request})=>{
  const pending = page.waitForEvent("download");
  await page.getByRole("button",{name:"Add demo event to calendar"}).click();
  const download=await pending;
  const text=await readFile((await download.path())!,"utf8");
  expect(text).toContain("DTSTART:20261114T180000Z");
  expect(text).toContain("DTEND:20261114T220000Z");
  expect(text).toContain("STATUS:TENTATIVE");
  const response = await request.get("/spec-sheet");
  expect(response.status()).toBe(200);
  expect(response.headers()["content-type"]).toBe("application/pdf");
  const pdf = (await response.body()).toString();
  expect(pdf).toMatch(/^%PDF-1.4/);
  expect(pdf).toContain("4,820 sq ft");
  expect(pdf).toContain("Not a real listing");
  expect(pdf).toContain("%%EOF");
});

test("private viewing date/time/capacity validation and unavailable recovery",async({page},info)=>{
  await page.getByRole("button",{name:/Can’t make it/}).click();
  const dialog=page.getByRole("dialog");
  await dialog.getByLabel("Full name").fill("Alex Morgan");
  await dialog.getByLabel("Email address").fill("alex@example.com");
  await dialog.getByLabel("Viewing interests").fill("I would like to see the guest casita.");
  await dialog.getByLabel("Preferred date").fill("2026-11-14");
  await dialog.getByLabel("Arizona time").selectOption("10:00");
  await dialog.getByRole("button",{name:"Request private viewing",exact:true}).click();
  expect(await dialog.getByLabel("Preferred date").evaluate(el=>(el as HTMLInputElement).validity.rangeUnderflow)).toBe(true);
  await dialog.getByLabel("Preferred date").fill("2026-12-16");
  await dialog.getByRole("button",{name:"Request private viewing",exact:true}).click();
  expect(await dialog.getByLabel("Preferred date").evaluate(el=>(el as HTMLInputElement).validity.rangeOverflow)).toBe(true);
  await dialog.getByLabel("Preferred date").fill("2026-11-15");
  await dialog.getByLabel("Number of guests").fill("7");
  await dialog.getByRole("button",{name:"Request private viewing",exact:true}).click();
  expect(await dialog.getByLabel("Number of guests").evaluate(el=>(el as HTMLInputElement).validity.rangeOverflow)).toBe(true);
  await dialog.getByLabel("Number of guests").fill("2");
  await page.screenshot({path:info.outputPath("final-private-viewing.png")});
  await dialog.getByRole("button",{name:"Request private viewing",exact:true}).click();
  await expect(dialog.getByRole("alert")).toContainText("unavailable");
  await dialog.getByLabel("Arizona time").selectOption("12:00");
  await dialog.getByRole("button",{name:"Request private viewing",exact:true}).click();
  await expect(dialog.getByRole("status")).toContainText("no appointment is booked");
  await expect(dialog.getByRole("status")).toContainText("2026-11-15 · 12:00 PM Arizona MST · 2 guests");
  await dialog.getByRole("button",{name:"Start a new request"}).click();
  await expect(dialog.getByLabel("Preferred date")).toHaveValue("");
  await dialog.getByRole("button",{name:"Close dialog"}).click();
});

test("inquiry failure, draft retention, confirmation and reset",async({page})=>{
  await page.getByRole("button",{name:"Send a Message",exact:true}).click();
  const dialog=page.getByRole("dialog");
  await dialog.getByLabel("Full name").fill("Alex Morgan");
  await dialog.getByLabel("Email address").fill("alex@example.com");
  await dialog.getByLabel("Your message").fill("   ");
  await dialog.getByRole("button",{name:"Send local message"}).click();
  await expect(dialog.getByRole("alert")).toContainText("not only spaces");
  await dialog.getByLabel("Your message").fill("Could you describe the casita concept?");
  await dialog.getByLabel("Simulate local message failure").check();
  await dialog.getByRole("button",{name:"Send local message"}).click();
  await expect(dialog.getByRole("alert")).toContainText("failed");
  await expect(dialog.getByLabel("Your message")).toHaveValue("Could you describe the casita concept?");
  await dialog.getByLabel("Simulate local message failure").uncheck();
  await dialog.getByRole("button",{name:"Send local message"}).click();
  await expect(dialog.getByRole("status")).toContainText("No message was sent");
  await dialog.getByRole("button",{name:"Start a new request"}).click();
  await expect(dialog.getByLabel("Your message")).toHaveValue("");
  await dialog.getByLabel("Full name").fill("Draft");
  await dialog.getByRole("button",{name:"Clear draft"}).click();
  await expect(dialog.getByLabel("Full name")).toHaveValue("");
  await page.keyboard.press("Escape");
});

test("neighborhood selection and honest directions recovery",async({page})=>{
  await page.locator(".places").getByRole("button",{name:/Grayhawk Golf Club/}).click();
  await expect(page.locator(".place-detail")).toContainText("memberships");
  await expect(page.getByRole("button",{name:"Show Grayhawk Golf Club",exact:true})).toHaveAttribute("aria-pressed","true");
  await page.getByRole("button",{name:"Directions preview",exact:true}).click();
  await expect(page.getByRole("dialog")).toContainText("Do not travel to this address");
  await page.getByRole("link",{name:"See neighborhood schematic"}).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(page).toHaveURL(/#neighborhood$/);
});

test("mortgage mathematics, zero-interest edge, invalid empty recovery",async({page})=>{
  const output=page.getByTestId("payment");
  const principal=1960000*(.0675/12)/(1-(1+.0675/12)**(-360));
  await expect(output).toContainText(new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",maximumFractionDigits:0}).format(principal+14280/12+285+300));
  await page.getByLabel("Interest rate (%)").fill("0");
  await expect(output).toContainText("$7,219");
  await page.getByRole("button",{name:"15 years",exact:true}).click();
  await expect(output).toContainText("$12,664");
  await page.getByLabel("Down payment").fill("50");
  await expect(output).toContainText("$8,581");
  await page.getByLabel("Home price ($)",{exact:true}).fill("");
  await expect(output).toContainText("—");
  await expect(page.locator(".calc-output").getByRole("alert")).toBeVisible();
  await page.getByRole("button",{name:"Reset estimate"}).click();
  await expect(page.getByLabel("Home price ($)",{exact:true})).toHaveValue("2450000");
  await expect(page.locator(".calc-output").getByRole("alert")).toHaveCount(0);
});

test("related listings, lender, broker and resources have local actions",async({page})=>{
  await page.locator(".listings").getByRole("button",{name:"View Listing"}).nth(2).click();
  await expect(page.getByRole("dialog")).toContainText("10585 E Crescent Moon Dr");
  await expect(page.getByRole("dialog")).toContainText("No real sale");
  await page.getByRole("button",{name:"Ask about this demo listing"}).click();
  await expect(page.getByRole("dialog").getByLabel("Your message")).toBeVisible();
  await page.keyboard.press("Escape");
  await page.getByRole("button",{name:"About pre-approval",exact:true}).click();
  await expect(page.getByRole("dialog")).toContainText("no partnership");
  await page.keyboard.press("Escape");
  await page.getByRole("button",{name:"Call Victoria",exact:true}).click();
  await expect(page.getByRole("dialog")).toContainText("No call will be placed");
  await page.keyboard.press("Escape");
  for(const label of ["Home Buying Guide","Moving Checklist","School Ratings","Pre-Approval"]){
    await page.locator("footer").getByRole("button",{name:label,exact:true}).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.getByRole("button",{name:"Close dialog"}).click();
  }
});

test("responsive navigation, reduced motion, overflow and runtime health",async({page},info)=>{
  const errors:string[]=[];page.on("pageerror",e=>errors.push(e.message));
  await page.emulateMedia({reducedMotion:"reduce"});
  await page.reload();
  expect(await page.locator(".hero-art .scene").evaluate(el=>getComputedStyle(el).animationName)).toBe("none");
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);
  if(info.project.name==="mobile"){
    await page.getByRole("button",{name:"Open navigation"}).click();
    await expect(page.getByRole("button",{name:"Close navigation"})).toHaveAttribute("aria-expanded","true");
    await page.getByRole("navigation",{name:"Mobile navigation"}).getByRole("link",{name:"Property Details"}).click();
    await expect(page.getByRole("navigation",{name:"Mobile navigation"})).toHaveCount(0);
    await expect(page).toHaveURL(/#details$/);
    await page.locator(".plan-scroll").evaluate(el=>el.scrollLeft=180);
    expect(await page.locator(".plan-scroll").evaluate(el=>el.scrollLeft)).toBeGreaterThan(0);
    await page.getByRole("button",{name:"Scroll to The golden hour",exact:true}).click();
    await expect(page.getByRole("button",{name:"Scroll to The golden hour",exact:true})).toHaveAttribute("aria-current","true");
    await page.locator(".floating-rsvp").click();
    await expect(page).toHaveURL(/#open-house$/);
    await page.screenshot({path:info.outputPath("final-rsvp.png"),fullPage:false});
  } else {
    await page.getByRole("navigation",{name:"Main navigation"}).getByRole("link",{name:"Open House",exact:true}).click();
    await expect(page).toHaveURL(/#open-house$/);
    await page.screenshot({path:info.outputPath("final-rsvp.png"),fullPage:false});
  }
  expect(errors).toEqual([]);
  expect(await page.locator('a[href^="http"],a[href^="mailto:"],a[href^="tel:"]').count()).toBe(0);
});
