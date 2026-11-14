import test from "node:test";
import assert from "node:assert/strict";
import {mkdir,readFile,writeFile} from "node:fs/promises";
import path from "node:path";
import {fileURLToPath} from "node:url";
import {chromium,expect} from "@playwright/test";
import {startPreviewServer} from "../../../../src/workflows/generate-preview.mjs";
import { StaticHomepage } from "../../../../src/workflows/render-prompt-page.mjs";
const model=fileURLToPath(new URL(".",import.meta.url)),workspace=fileURLToPath(new URL("../../../../",import.meta.url)),checks=path.join(model,".checks");
test("Keystone independent property-management homepage",{timeout:180000},async(t)=>{
 const service=await startPreviewServer(path.join(model,"out"),{workspace}),browser=await chromium.launch();
 t.after(async()=>{await browser.close();await service.close();});await mkdir(checks,{recursive:true});
 const errors=[],requests=[];
 async function visit(options={}){
  const context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:"reduce",...options}),page=await context.newPage();page.setDefaultTimeout(10000);
  page.on("pageerror",e=>errors.push(e.message));page.on("console",m=>{if(m.type()==="error")errors.push(m.text());});page.on("requestfailed",r=>errors.push(`${r.url()}: ${r.failure()?.errorText}`));page.on("response",r=>{if(r.status()>=400)errors.push(`${r.status()} ${r.url()}`);});
  await context.route("**/*",route=>{requests.push({url:route.request().url(),method:route.request().method()});return new URL(route.request().url()).origin===new URL(service.url).origin?route.continue():route.abort();});
  await page.goto(service.url,{waitUntil:"networkidle"});await page.evaluate(()=>document.fonts.ready);return{context,page};
 }
 async function images(page){await page.locator("img[src]").evaluateAll(list=>list.forEach(im=>im.loading="eager"));await page.locator("img[src]").evaluateAll(list=>Promise.all(list.map(im=>im.decode())));}
 const currency=(n,signed=false)=>new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",minimumFractionDigits:2,maximumFractionDigits:2,...(signed?{signDisplay:"always"}:{})}).format(n);
 async function range(page,name,value){await page.locator(`[name="${name}"]`).evaluate((el,value)=>{el.value=value;el.dispatchEvent(new Event("input",{bubbles:true}));},String(value));}
 await t.test("complete independent subpath, six services and properties, four desktop cards, PDFs and exported resources",async()=>{
  const{context,page}=await visit();try{
   assert.equal(new URL(page.url()).pathname,"/pages/property-management-company/GPT-6/index.html");await expect(page).toHaveTitle("Keystone Property Group | Property, Prioritized");await images(page);
   for(const[selector,count]of[[".service-card",6],[".property-card",6],[".difference",4],[".testimonial",3],[".plan-card",3],["#faq-list details",6]])await expect(page.locator(selector)).toHaveCount(count);
   assert.equal(await page.locator("#property-carousel").evaluate(el=>{const r=el.getBoundingClientRect();return[...el.children].filter(c=>{const t=c.getBoundingClientRect();return t.left>=r.left-1&&t.right<=r.right+1;}).length;}),4);
   for(const file of["index.html","style.css","app.js"])assert.equal(await readFile(path.join(model,file),"utf8"),await readFile(path.join(model,"out",file),"utf8"));
   for(const pdf of["sample-lease.pdf","sample-owner-statement.pdf"]){const response=await page.request.get(new URL(`assets/${pdf}`,page.url()).href);assert.equal(response.status(),200);assert.equal((await response.body()).subarray(0,8).toString(),"%PDF-1.4");}
   const sprite=await readFile(path.join(model,"assets","icons.svg"),"utf8");for(const id of new Set(await page.locator("use").evaluateAll(uses=>uses.map(u=>u.getAttribute("href").split("#")[1]))))assert.ok(sprite.includes(`id="${id}"`),id);
   assert.deepEqual(await page.locator('a[href^="#"]').evaluateAll(links=>links.filter(a=>!document.getElementById(a.hash.slice(1))).map(a=>a.hash)),[]);
   assert.match(await StaticHomepage.validateStaticOutput(path.join(model,"out"),"property-management-company","GPT-6"),/^[a-f0-9]{64}$/);
  }finally{await context.close();}
 });
 await t.test("all expandable services and FAQs, real carousel controls and availability filters",async()=>{
  const{context,page}=await visit();try{
   for(let i=0;i<6;i++){await page.locator(".service-card summary").nth(i).click();await expect(page.locator(".service-card details").nth(i)).toHaveAttribute("open","");await expect(page.locator(".service-detail").nth(i)).toContainText("50% or 40%");}
   for(let i=0;i<6;i++){await page.locator("#faq-list summary").nth(i).click();await expect(page.locator("#faq-list details[open]")).toHaveCount(1);await expect(page.locator("#faq-list details").nth(i)).toHaveAttribute("open","");}
   await page.locator("#property-next").click();await expect.poll(()=>carouselPosition(page)).toBeGreaterThan(100);await page.locator("#property-carousel").focus();await page.keyboard.press("End");await expect(page.locator("#property-next")).toBeDisabled();await page.keyboard.press("Home");await expect(page.locator("#property-prev")).toBeDisabled();
   await page.locator('[data-filter="available"]').click();await expect(page.locator(".property-card")).toHaveCount(3);await expect(page.locator(".property-card a")).toHaveCount(3);await expect(page.locator("#property-count")).toContainText("3 available");
   await page.locator("[data-all-properties]").click();await expect(page.locator(".property-card")).toHaveCount(6);
   await page.locator(".tenants [data-browse]").click();await expect(page.locator(".property-card")).toHaveCount(3);
  }finally{await context.close();}
 });
 async function carouselPosition(page){return page.locator("#property-carousel").evaluate(el=>el.scrollLeft);}
 await t.test("real ROI arithmetic, both fees, vacancy boundaries, 50 units, negative results, invalid input and contextual CTA",async()=>{
  const{context,page}=await visit();try{
   await expect(page.locator("#net-benefit")).toHaveText("+$34.56/year");await expect(page.locator("#monthly-benefit")).toContainText("$2.88/month");await expect(page.locator("#roi-breakdown")).toContainText("$1,693.44");
   for(const units of[1,50])for(const vacancy of[0,2,30])for(const fee of[.08,.1]){
    await page.locator('[name="units"]').fill(String(units));await range(page,"vacancy",vacancy);await range(page,"rent",units===50?5000:800);await page.locator('[name="fee"]').selectOption(String(fee));
    const gross=units*(units===50?5000:800)*12,current=gross*(1-vacancy/100),managed=gross*(1-Math.min(vacancy,2)/100),net=managed-managed*fee-current;
    await expect(page.locator("#net-benefit")).toHaveText(`${currency(net,true)}/year`);await expect(page.locator("#roi-breakdown")).toContainText(currency(managed*fee));
    if(net<0){await expect(page.locator("#net-benefit")).toHaveClass("negative");await expect(page.locator("#monthly-benefit")).toContainText("lower");}
   }
   await page.locator('[name="units"]').fill("1.5");await expect(page.locator("#net-benefit")).toHaveText("—");await expect(page.locator("#roi-breakdown")).toBeEmpty();
   for(const value of["0","51",""]){await page.locator('[name="units"]').fill(value);await expect(page.locator("#roi-error")).not.toBeEmpty();}
   await page.locator('[name="units"]').fill("2");await page.locator('[name="type"]').selectOption("Townhome");await page.locator("[data-roi-analysis]").click();await expect(page.locator("#analysis-context")).toContainText("Townhome, 2 unit(s)");
   await page.locator('.popular [data-analysis]').click();await expect(page.locator("#analysis-context")).toContainText("Portfolio management plan");await expect(page.locator('#analysis-form [name=interest]')).toHaveValue("Portfolio management plan");
  }finally{await context.close();}
 });
 await t.test("tenant/owner portals, keyboard tabs, inert payment preview, local maintenance draft and real documents",async()=>{
  const{context,page}=await visit();try{
   const opener=page.locator(".portal-button");await opener.click();await expect(page.locator("#portal-title")).toHaveText("Tenant Portal");await page.locator("[data-payment]").click();await page.locator("[data-confirm-payment]").click();await expect(page.locator("#info-title")).toHaveText("Local Preview — No Payment Made");await page.keyboard.press("Escape");await expect(page.locator(".account-balance strong")).toHaveText("$2,150.00");
   await page.locator('#portal-tabs [role="tab"]').first().focus();await page.keyboard.press("End");await expect(page.locator('#portal-tabs [aria-selected="true"]')).toHaveText("Documents");await expect(page.locator("#portal-content a")).toHaveAttribute("href","assets/sample-lease.pdf");
   await page.keyboard.press("Home");await page.keyboard.press("ArrowRight");await expect(page.locator('#portal-tabs [aria-selected="true"]')).toHaveText("Maintenance");
   await page.locator('#maintenance-form [name=description]').fill("        ");await page.locator('#maintenance-form [name=consent]').check();await page.locator('#maintenance-form button').click();await expect(page.locator("#maintenance-form")).toBeVisible();
   const malicious='<img src=x onerror="window.__injected=true">';await page.locator('#maintenance-form [name=description]').fill(malicious);await page.locator('#maintenance-form button').click();await expect(page.locator(".draft-description")).toHaveText(malicious);await expect(page.locator(".maintenance-receipt img")).toHaveCount(0);assert.equal(await page.evaluate(()=>window.__injected),undefined);
   await page.screenshot({path:path.join(checks,"maintenance-1440.png")});await page.keyboard.press("Escape");await expect(opener).toBeFocused();await expect(page.locator("#portal-content")).toBeEmpty();
   await page.locator('[data-portal="owner"]').click();await expect(page.locator(".portal-summary")).toContainText("$1,935");await page.locator('#portal-tabs [data-portal-tab="statements"]').click();await expect(page.locator(".portal-statement")).toContainText("$215.00");await page.screenshot({path:path.join(checks,"owner-1440.png")});
   await page.locator('#portal-tabs [data-portal-tab="documents"]').click();await expect(page.locator("#portal-content a")).toHaveAttribute("href","assets/sample-owner-statement.pdf");await page.keyboard.press("Escape");
  }finally{await context.close();}
 });
 await t.test("local analysis safeguards, every resource/contact/legal action and all three independent rental inquiries",async()=>{
  const{context,page}=await visit();try{
   const form=page.locator("#analysis-form");assert.equal(await form.evaluate(f=>f.checkValidity()),false);
   await page.locator('#analysis-form [name=address]').fill("        ");await page.locator('#analysis-form [name=email]').fill("taylor@example.invalid");await page.locator('#analysis-form [name=phone]').fill(".......");await page.locator('#analysis-form [name=consent]').check();await form.locator("button").click();await expect(page.locator("#info-dialog")).not.toBeVisible();
   const malicious='<img src=x onerror="window.__injected=true">';await page.locator('#analysis-form [name=address]').fill(malicious);await form.locator("button").click();await expect(page.locator("#info-dialog")).not.toBeVisible();await page.locator('#analysis-form [name=phone]').fill("1234567");await form.locator("button").click();
   await expect(page.locator(".receipt-line")).toHaveText(malicious);await expect(page.locator("#info-content img")).toHaveCount(0);assert.equal(await page.evaluate(()=>window.__injected),undefined);for(const field of["address","email","phone"])await expect(page.locator(`#analysis-form [name=${field}]`)).toHaveValue("");
   await page.keyboard.press("Escape");await expect(page.locator("#info-content")).toBeEmpty();
   for(const key of["resources","about","team","careers","referral","guarantee","insurance","phone","email","address","hours","directions","privacy","terms","housing","accessibility","credits"]){await page.locator(`[data-info="${key}"]`).first().click();await expect(page.locator("#info-content")).not.toBeEmpty();if(key==="resources")for(const article of["screening","statements","preparing"]){if(article!=="screening"){await page.keyboard.press("Escape");await page.locator('[data-info="resources"]').first().click();}await page.locator(`[data-info="${article}"]`).click();await expect(page.locator("#info-content")).not.toBeEmpty();}await page.keyboard.press("Escape");}
   for(const[slug,title]of[["east-austin","2BR/1BA Duplex Unit"],["downtown","1BR/1BA Condo"],["cedar-park","3BR/2BA Townhome"]]){
    await page.goto(new URL(`assets/rentals/${slug}.html`,service.url).href,{waitUntil:"networkidle"});await images(page);await expect(page.locator("h1")).toHaveText(title);assert.equal(await page.locator("#interest-form").evaluate(f=>f.checkValidity()),false);
    await page.locator('[name=name]').fill(malicious);await page.locator('[name=email]').fill("taylor@example.invalid");await page.locator('[name=date]').fill("2020-01-01");await page.locator('[name=consent]').check();assert.equal(await page.locator("#interest-form").evaluate(f=>f.checkValidity()),false);
    const date=await page.locator('[name=date]').getAttribute("min");await page.locator('[name=date]').fill(date);await page.locator('#interest-form button').click();await expect(page.locator(".interest-name")).toHaveText(malicious);await expect(page.locator(".interest-summary")).toContainText(title);await expect(page.locator("#interest-receipt img")).toHaveCount(0);await expect(page.locator('[name=name]')).toHaveValue("");await page.locator("#clear-interest").click();await expect(page.locator(".interest-name")).toBeEmpty();
    assert.equal(await page.evaluate(()=>localStorage.length+sessionStorage.length),0);
   }
  }finally{await context.close();}
 });
 await t.test("five responsive widths, touch targets, phone navigation, native swipe, audience action and listing layout",async()=>{
  for(const width of[1440,1024,768,390,320]){
   const mobile=width<600,{context,page}=await visit({viewport:{width,height:1000},isMobile:mobile,hasTouch:mobile,deviceScaleFactor:1});
   try{
    await images(page);assert.ok(await page.evaluate(width=>document.documentElement.scrollWidth<=width+1,width),`body overflow ${width}`);
    if(width===1440||width===390)await page.screenshot({path:path.join(checks,`desktop-mobile-${width}.png`),fullPage:true});
    await page.locator('[name="units"]').fill("50");await range(page,"rent",5000);await range(page,"vacancy",30);assert.ok(await page.evaluate(width=>document.documentElement.scrollWidth<=width+1,width),`maximum ROI overflow ${width}`);await page.locator('[name="units"]').fill("1");await range(page,"rent",1800);await range(page,"vacancy",10);
    if(width===390){
     await page.locator(".menu").tap();await expect(page.locator(".menu")).toHaveAttribute("aria-expanded","true");await page.locator('#navigation a[href="#services"]').tap();await expect(page.locator(".menu")).toHaveAttribute("aria-expanded","false");
     await page.locator("#properties").evaluate(e=>e.scrollIntoView({block:"start"}));await expect(page.locator("#mobile-action")).toContainText("Browse Rentals");await page.locator("#mobile-action").tap();await expect(page.locator(".property-card")).toHaveCount(3);
     await page.locator('[data-filter="all"]').tap();await expect(page.locator(".property-card")).toHaveCount(6);await page.locator("#property-carousel").scrollIntoViewIfNeeded();
     await page.locator("#roi").evaluate(e=>e.scrollIntoView({block:"start"}));await expect(page.locator("#mobile-action")).toContainText("Free Analysis");await page.screenshot({path:path.join(checks,"roi-390.png")});await page.locator(".roi-results").scrollIntoViewIfNeeded();await page.screenshot({path:path.join(checks,"roi-results-390.png")});
     await page.locator(".portal-button").tap();await page.locator('#portal-tabs [data-portal-tab="maintenance"]').tap();await page.screenshot({path:path.join(checks,"portal-390.png")});await page.locator(".portal-close").tap();
     const targets=await page.locator('button,a,input[type="range"],summary').evaluateAll(nodes=>nodes.filter(n=>{const s=getComputedStyle(n),r=n.getBoundingClientRect();return s.display!=="none"&&s.visibility!=="hidden"&&r.width>0&&r.height>0;}).map(n=>({label:n.textContent.trim().slice(0,35)||n.getAttribute("aria-label")||n.name,width:n.getBoundingClientRect().width,height:n.getBoundingClientRect().height})).filter(n=>n.width<43.5||n.height<43.5));assert.deepEqual(targets,[]);
     await page.locator("#property-carousel").scrollIntoViewIfNeeded();
     const box=await page.locator("#property-carousel").boundingBox(),cdp=await context.newCDPSession(page),y=box.y+120,x=box.x+box.width-22;
     await cdp.send("Input.dispatchTouchEvent",{type:"touchStart",touchPoints:[{x,y}]});for(let i=1;i<=8;i++)await cdp.send("Input.dispatchTouchEvent",{type:"touchMove",touchPoints:[{x:x-i*28,y}]});await cdp.send("Input.dispatchTouchEvent",{type:"touchEnd",touchPoints:[]});await expect.poll(()=>carouselPosition(page)).toBeGreaterThan(100);await cdp.detach();
    }
    if(mobile){
     const popularFirst=await page.locator(".pricing-grid").evaluate(el=>[...el.children].sort((a,b)=>a.getBoundingClientRect().top-b.getBoundingClientRect().top)[0].classList.contains("popular"));assert.equal(popularFirst,true);
     await page.goto(new URL("assets/rentals/downtown.html",service.url).href,{waitUntil:"networkidle"});await images(page);assert.ok(await page.evaluate(width=>document.documentElement.scrollWidth<=width+1,width),`rental overflow ${width}`);const photo=await page.locator(".rental-photo").boundingBox();assert.ok(Math.abs(photo.height/photo.width-.75)<.01,"rental image keeps its intended 4:3 crop");if(width===390)await page.screenshot({path:path.join(checks,"rental-390.png"),fullPage:true});
    }
   }finally{await context.close();}
  }
 });
 assert.deepEqual(errors,[]);assert.ok(requests.every(r=>r.method==="GET"&&new URL(r.url).origin===new URL(service.url).origin));
 const digest=await StaticHomepage.validateStaticOutput(path.join(model,"out"),"property-management-company","GPT-6");
 await writeFile(path.join(checks,"validation.json"),JSON.stringify({checkedAt:new Date().toISOString(),digest,errors,requests:requests.length,widths:[1440,1024,768,390,320],checks:["complete static subpath and assets","six expandable services and FAQ","six-property carousel and three actual rental pages","independent real ROI arithmetic and negative/invalid boundaries","owner/tenant portals, inert payments and private draft","safe local analysis and rental inquiry forms","keyboard, actual phone taps/swipe and 44px targets","five responsive widths and Portfolio-first mobile pricing","no network submissions, external assets or storage"]},null,2)+"\n");
});
