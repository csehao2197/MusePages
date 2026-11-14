import test from "node:test";
import assert from "node:assert/strict";
import {mkdir,readFile,writeFile} from "node:fs/promises";
import path from "node:path";
import {fileURLToPath} from "node:url";
import {chromium,expect} from "@playwright/test";
import {startPreviewServer} from "../../../../src/workflows/generate-preview.mjs";
import {validateStaticOutput} from "../../../../src/workflows/render-prompt-pages.mjs";
const model=fileURLToPath(new URL(".",import.meta.url)),workspace=fileURLToPath(new URL("../../../../",import.meta.url)),checks=path.join(model,".checks");
test("Pinnacle independent open-house homepage",{timeout:150000},async(t)=>{
 const service=await startPreviewServer(path.join(model,"out"),{workspace}),browser=await chromium.launch();
 t.after(async()=>{await browser.close();await service.close();});await mkdir(checks,{recursive:true});
 const errors=[],requests=[];
 async function visit(options={}){
  const context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:"reduce",...options}),page=await context.newPage();page.setDefaultTimeout(10000);
  page.on("pageerror",e=>errors.push(e.message));page.on("console",m=>{if(m.type()==="error")errors.push(m.text());});
  page.on("requestfailed",r=>errors.push(`${r.url()}: ${r.failure()?.errorText}`));page.on("response",r=>{if(r.status()>=400)errors.push(`${r.status()} ${r.url()}`);});
  await context.route("**/*",route=>{requests.push({url:route.request().url(),method:route.request().method()});return new URL(route.request().url()).origin===new URL(service.url).origin?route.continue():route.abort();});
  await page.goto(service.url,{waitUntil:"networkidle"});await page.evaluate(()=>document.fonts.ready);return{context,page};
 }
 async function images(page){await page.locator("img[src]").evaluateAll(list=>list.forEach(im=>im.loading="eager"));await page.locator("img[src]").evaluateAll(list=>Promise.all(list.map(im=>im.decode())));}
 const form="#rsvp-form";
 async function fillForm(page,name="Taylor Example"){
  await page.locator(`${form} [name=name]`).fill(name);await page.locator(`${form} [name=email]`).fill("taylor@example.invalid");await page.locator(`${form} [name=phone]`).fill("(480) 555-0123");
  if(await page.locator(`${form} [name=time]`).isEnabled())await page.locator(`${form} [name=time]`).selectOption({label:"12:30 PM"});
  await page.locator(`${form} [name=agent][value=No]`).check();await page.locator(`${form} [name=consent]`).check();
 }
 await t.test("real local subpath, complete resources, real PDF, specifications and matching export",async()=>{
  const{context,page}=await visit();try{
   assert.equal(new URL(page.url()).pathname,"/pages/open-house-landing-page/GPT-6/index.html");await expect(page).toHaveTitle("Ridgewood Terrace | Pinnacle Realty");await images(page);
   await expect(page.locator(".highlight")).toHaveCount(8);await expect(page.locator(".photo-tile")).toHaveCount(12);await expect(page.locator(".specifications>div")).toHaveCount(14);await expect(page.locator(".listing-card")).toHaveCount(3);
   await expect(page.locator(".archive-note")).toContainText("April 4, 2026 event has passed");await expect(page.locator(".event-facts")).toContainText("Arizona time");
   for(const file of["index.html","style.css","app.js"])assert.equal(await readFile(path.join(model,file),"utf8"),await readFile(path.join(model,"out",file),"utf8"));
   const pdf=await page.request.get(new URL("assets/property-specifications.pdf",page.url()).href);assert.equal(pdf.status(),200);assert.equal((await pdf.body()).subarray(0,8).toString(),"%PDF-1.4");
   const sprite=await readFile(path.join(model,"out","assets","icons.svg"),"utf8");for(const id of new Set(await page.locator("use").evaluateAll(uses=>uses.map(u=>u.getAttribute("href").split("#")[1]))))assert.ok(sprite.includes(`id="${id}"`),id);
   assert.deepEqual(await page.locator('a[href^="#"]').evaluateAll(links=>links.filter(a=>!document.getElementById(a.hash.slice(1))).map(a=>a.hash)),[]);
   assert.match(await validateStaticOutput(path.join(model,"out"),"open-house-landing-page","GPT-6"),/^[a-f0-9]{64}$/);
  }finally{await context.close();}
 });
 await t.test("all twelve image lightboxes, wrap, keyboard focus, crop and Escape",async()=>{
  const{context,page}=await visit();try{
   for(let i=0;i<12;i++){
    await page.locator(`[data-photo="${i}"]`).click();await expect(page.locator("#photo-counter")).toHaveText(`${i+1} of 12`);await page.locator("#lightbox-image").evaluate(im=>im.decode());
    await expect(page.locator("#photo-description")).not.toBeEmpty();await page.locator(".lightbox-close").click();
   }
   await page.locator('[data-photo="11"]').click();await page.locator(".next").focus();await page.keyboard.press("ArrowRight");await expect(page.locator("#photo-counter")).toHaveText("1 of 12");await expect(page.locator(".next")).toBeFocused();
   await page.keyboard.press("ArrowLeft");await expect(page.locator("#photo-counter")).toHaveText("12 of 12");await page.keyboard.press("Escape");await expect(page.locator("#lightbox")).not.toBeVisible();await expect(page.locator('[data-photo="11"]')).toBeFocused();
   await page.locator('[data-photo="3"]').click();await expect(page.locator(".lightbox-frame")).toHaveClass(/detail-crop/);await page.locator("#lightbox-image").evaluate(im=>im.decode());await page.screenshot({path:path.join(checks,"lightbox-1440.png")});await page.keyboard.press("Escape");
  }finally{await context.close();}
 });
 await t.test("six map/list destinations update together, real keyboard controls and full schematic",async()=>{
  const{context,page}=await visit();try{
   await expect(page.locator(".map-point")).toHaveCount(6);
   for(let i=0;i<6;i++){
    const point=page.locator(`.map-point[data-place="${i}"]`);await point.focus();await point.press("Enter");
    await expect(point).toHaveAttribute("aria-pressed","true");await expect(page.locator(`#nearby-list [data-place="${i}"]`)).toHaveAttribute("aria-pressed","true");
    await expect(page.locator("#nearby-detail")).toContainText(["2.1","4.3","3.8","5.1","6.2","8.7"][i]+" miles");
   }
   await page.locator('#nearby-list [data-place="0"]').click();await expect(page.locator('.map-point[data-place="0"]')).toHaveAttribute("aria-pressed","true");
   await page.locator("#neighborhood").scrollIntoViewIfNeeded();await page.screenshot({path:path.join(checks,"map-1440.png")});
   await page.locator("#details").scrollIntoViewIfNeeded();await page.screenshot({path:path.join(checks,"floor-plan-1440.png")});
  }finally{await context.close();}
 });
 await t.test("actual amortization, editable costs, 15/20/30 years, zero rate, down-payment limits and invalid values",async()=>{
  const{context,page}=await visit();try{
   const amount=async()=>Number(await page.locator("#monthly-payment").getAttribute("data-amount"));
   const r=.0675/12,loan=1960000,expected=loan*r/(1-(1+r)**-360)+1190+285+300;assert.ok(Math.abs(await amount()-expected)<.00001);
   await expect(page.locator("#down-output")).toHaveText("$490,000 · 20%");await expect(page.locator("#breakdown>div")).toHaveCount(4);await expect(page.locator("#payment-chart")).toHaveAttribute("aria-label",/Principal & Interest/);
   await page.locator("#mortgage").scrollIntoViewIfNeeded();await page.screenshot({path:path.join(checks,"mortgage-1440.png")});
   for(const years of["15","20","30"]){await page.locator(`input[name=term][value="${years}"]`).check();const expected=loan*r/(1-(1+r)**(-Number(years)*12))+1775;assert.ok(Math.abs(await amount()-expected)<.00001);}
   await page.locator("#interest-rate").fill("0");assert.ok(Math.abs(await amount()-(1960000/360+1775))<.00001);
   await page.locator("#home-price").fill("1000000");await page.locator("#down-payment").fill("50");await page.locator("#property-tax").fill("0");await page.locator("#hoa").fill("0");await page.locator("#insurance").fill("0");assert.ok(Math.abs(await amount()-500000/360)<.00001);await expect(page.locator("#down-output")).toHaveText("$500,000 · 50%");
   await page.locator("#down-payment").fill("5");assert.ok(Math.abs(await amount()-950000/360)<.00001);
   for(const[selector,value]of[["#home-price","0"],["#interest-rate","26"],["#property-tax","-1"],["#insurance",""]]){
    const old=await page.locator(selector).inputValue();await page.locator(selector).fill(value);await expect(page.locator("#monthly-payment")).toHaveText("—");await expect(page.locator("#calculator-status")).toContainText("Enter valid amounts");await expect(page.locator("#breakdown>div")).toHaveCount(0);await page.locator(selector).fill(old);
   }
   await page.locator("#home-price").fill("50000000");await page.locator("#interest-rate").fill("25");assert.ok(Number.isFinite(await amount()));assert.ok(await amount()>0);
   await page.locator("#home-price").fill("1000000");await page.locator("#interest-rate").fill("0.01");assert.ok(Number.isFinite(await amount()));
  }finally{await context.close();}
 });
 await t.test("private local form validation, archived RSVPs, inert malicious text, future showings, message and resource actions",async()=>{
  const{context,page}=await visit();try{
   assert.equal(await page.locator(form).evaluate(f=>f.checkValidity()),false);await fillForm(page,"   ");await page.locator("#submit-label").click();await expect(page.locator("#info-dialog")).not.toBeVisible();await expect(page.locator("#full-name")).toBeFocused();
   const malicious='<img src=x onerror="window.__injected=true">';await page.locator("#full-name").fill(malicious);await page.locator(`${form} [name=phone]`).fill(".......");await page.locator("#submit-label").click();await expect(page.locator("#info-dialog")).not.toBeVisible();
   await page.locator(`${form} [name=phone]`).fill("1234567");await page.locator(`${form} [name=message]`).fill("<script>window.__injected=true</script>");await page.locator("#submit-label").click();
   await expect(page.locator("#info-title")).toHaveText("Your RSVP preview");await expect(page.locator("#info-content")).toContainText("This date has passed");await expect(page.locator(".receipt-name")).toHaveText(malicious);await expect(page.locator("#info-content img,#info-content script")).toHaveCount(0);assert.equal(await page.evaluate(()=>window.__injected),undefined);
   for(const name of["name","email","phone","message"])await expect(page.locator(`${form} [name=${name}]`)).toHaveValue("");
   await page.locator(".info-close").click();await expect(page.locator("#info-content")).toBeEmpty();
   await page.locator('button[data-mode="showing"]').first().click();await expect(page.locator("#full-name")).toBeFocused();await expect(page.locator("#date-label")).toBeVisible();await fillForm(page);
   await page.locator(`${form} [name=date]`).fill("2026-04-04");assert.equal(await page.locator(form).evaluate(f=>f.checkValidity()),false);
   const min=await page.locator(`${form} [name=date]`).getAttribute("min");await page.locator(`${form} [name=date]`).fill(min);await page.locator("#submit-label").click();await expect(page.locator("#info-title")).toHaveText("Your showing-request preview");await expect(page.locator("#info-content")).toContainText(min);await page.keyboard.press("Escape");
   await page.getByRole("button",{name:"Send a Message",exact:true}).click();await expect(page.locator("#time-label")).not.toBeVisible();await fillForm(page);await page.locator("#submit-label").click();await expect(page.locator("#info-title")).toHaveText("Your message preview");await page.keyboard.press("Escape");
   for(const key of["contact","lender","buying","moving","schools","social","privacy","credits"]){await page.locator(`[data-info="${key}"]`).first().click();await expect(page.locator("#info-content")).not.toBeEmpty();if(key==="lender"){await expect(page.locator("#info-content a")).toHaveAttribute("href","https://www.desertfinancial.com/en/borrow/home-loans/mortgage");await expect(page.locator("#info-content a")).toHaveAttribute("rel","noopener noreferrer");}await page.keyboard.press("Escape");}
   for(let i=0;i<3;i++){await page.locator(`[data-listing="${i}"]`).click();await expect(page.locator("#info-title")).toHaveText(["7930 E Raintree Dr","22614 N Pinnacle Peak Rd","10585 E Crescent Moon Dr"][i]);await expect(page.locator("#info-content")).toContainText("live listing URL were not provided");await page.keyboard.press("Escape");}
   await page.locator('[data-listing="2"]').click();await page.locator("#info-content [data-mode]").click();await expect(page.locator(`${form} [name=message]`)).toHaveValue("I’m interested in 10585 E Crescent Moon Dr.");await page.locator("#reset-mode").click();await expect(page.locator("#submit-label")).toContainText("Reserve My Spot");
   assert.equal(await page.evaluate(()=>localStorage.length+sessionStorage.length),0);
  }finally{await context.close();}
 });
 await t.test("five responsive widths, real phone taps, native carousel, scrollable floor plan, mobile map and swipe lightbox",async()=>{
  for(const width of[1440,1024,768,390,320]){
   const mobile=width<600,{context,page}=await visit({viewport:{width,height:1000},isMobile:mobile,hasTouch:mobile,deviceScaleFactor:1});
   try{
    await images(page);assert.ok(await page.evaluate(width=>document.documentElement.scrollWidth<=width+1,width),`body overflow at ${width}`);
    await expect(page.locator("h1")).toHaveText("Desert living. Exceptionally elevated.");await expect(page.locator("#event-title")).toHaveText("Join Us for the Open House");
    if(width===1440||width===390)await page.screenshot({path:path.join(checks,`desktop-mobile-${width}.png`),fullPage:true});
    if(width===390){
     await page.locator(".menu").tap();await expect(page.locator(".menu")).toHaveAttribute("aria-expanded","true");await page.locator("#navigation a[href='#gallery']").tap();await expect(page.locator(".menu")).toHaveAttribute("aria-expanded","false");
     await page.locator('[data-slide="5"]').tap();await expect(page.locator('[data-slide="5"]')).toHaveAttribute("aria-current","true");assert.ok(await page.locator("#photo-grid").evaluate(n=>n.scrollLeft>100));
     await page.locator("#photo-grid").focus();await page.keyboard.press("End");await expect(page.locator('[data-slide="11"]')).toHaveAttribute("aria-current","true");await page.keyboard.press("Home");await expect(page.locator('[data-slide="0"]')).toHaveAttribute("aria-current","true");
     assert.ok(await page.locator(".floor-scroll").evaluate(n=>n.scrollWidth>n.clientWidth));await page.locator(".floor-scroll").evaluate(n=>n.scrollLeft=200);assert.ok(await page.locator(".floor-scroll").evaluate(n=>n.scrollLeft>0));
     await page.locator("#neighborhood").scrollIntoViewIfNeeded();await expect(page.locator(".map-point").first()).toBeDisabled();await page.locator('#nearby-list [data-place="4"]').tap();await expect(page.locator("#nearby-detail")).toContainText("6.2 miles");await page.screenshot({path:path.join(checks,"map-390.png")});
     await page.locator(".rsvp-card").scrollIntoViewIfNeeded();await expect(page.locator(".mobile-rsvp")).not.toBeVisible();await page.screenshot({path:path.join(checks,"rsvp-390.png")});
     await page.locator("#mortgage").scrollIntoViewIfNeeded();await page.screenshot({path:path.join(checks,"mortgage-390.png")});await page.locator('#mortgage-form [name=term][value="15"]').tap();await expect(page.locator('#mortgage-form [name=term][value="15"]')).toBeChecked();
     await page.locator('[data-photo="0"]').tap();await page.locator(".next").tap();await expect(page.locator("#photo-counter")).toHaveText("2 of 12");await page.locator("#lightbox-image").evaluate(im=>im.decode());await page.screenshot({path:path.join(checks,"lightbox-390.png")});
     const client=await context.newCDPSession(page);await client.send("Input.dispatchTouchEvent",{type:"touchStart",touchPoints:[{x:310,y:370}]});await client.send("Input.dispatchTouchEvent",{type:"touchMove",touchPoints:[{x:140,y:375}]});await client.send("Input.dispatchTouchEvent",{type:"touchEnd",touchPoints:[]});await expect(page.locator("#photo-counter")).toHaveText("3 of 12");await page.keyboard.press("Escape");
    }
   }finally{await context.close();}
  }
 });
 assert.deepEqual(errors,[]);assert.ok(requests.length>30);assert.ok(requests.every(r=>r.method==="GET"&&new URL(r.url).origin===new URL(service.url).origin));
 const digest=await validateStaticOutput(path.join(model,"out"),"open-house-landing-page","GPT-6");
 await writeFile(path.join(checks,"validation.json"),JSON.stringify({checkedAt:new Date().toISOString(),digest,errors,tests:"6 real Chromium subtests: resources/PDF/subpath, twelve-photo keyboard/wrap lightbox, map synchronization, actual amortization and edge cases, private form/resources/listings, five widths/native phone tap/swipe",requests:requests.length,widths:[1440,1024,768,390,320],build:"not run",publish:"not run"},null,2)+"\n");
});
