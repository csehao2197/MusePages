import test from "node:test";
import assert from "node:assert/strict";
import {mkdir,readFile,writeFile} from "node:fs/promises";
import path from "node:path";
import {fileURLToPath} from "node:url";
import {chromium,expect} from "@playwright/test";
import {startPreviewServer} from "../../../../src/workflows/generate-preview.mjs";
import { StaticHomepage } from "../../../../src/workflows/render-prompt-page.mjs";
const model=fileURLToPath(new URL(".",import.meta.url)),workspace=fileURLToPath(new URL("../../../../",import.meta.url)),checks=path.join(model,".checks");
test("Ridgeline independent new-construction homepage",{timeout:150000},async(t)=>{
 const service=await startPreviewServer(path.join(model,"out"),{workspace}),browser=await chromium.launch();
 t.after(async()=>{await browser.close();await service.close();});await mkdir(checks,{recursive:true});
 const errors=[],requests=[],expectedMediaAborts=[];
 async function visit(options={}){
  const context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:"reduce",...options}),page=await context.newPage();page.setDefaultTimeout(10000);
  page.on("pageerror",e=>errors.push(e.message));page.on("console",m=>{if(m.type()==="error")errors.push(m.text());});
  page.on("requestfailed",r=>{
   const failure=r.failure()?.errorText;
   if(r.url().startsWith("blob:"+new URL(service.url).origin+"/")&&r.resourceType()==="media"&&failure==="net::ERR_ABORTED")expectedMediaAborts.push(r.url());
   else errors.push(`${r.url()}: ${failure}`);
  });
  page.on("response",r=>{if(r.status()>=400)errors.push(`${r.status()} ${r.url()}`);});
  await context.route("**/*",route=>{requests.push({url:route.request().url(),method:route.request().method()});return new URL(route.request().url()).origin===new URL(service.url).origin?route.continue():route.abort();});
  await page.goto(service.url,{waitUntil:"networkidle"});await page.evaluate(()=>document.fonts.ready);return{context,page};
 }
 async function images(page){await page.locator("img[src]").evaluateAll(list=>list.forEach(im=>im.loading="eager"));await page.locator("img[src]").evaluateAll(list=>Promise.all(list.map(im=>im.decode())));}
 const valid=locator=>locator.evaluate(n=>n.checkValidity());
 await t.test("independent subpath, actual local resources, four plans, original PDF downloads and valid navigation",async()=>{
  const{context,page}=await visit();try{
   assert.equal(new URL(page.url()).pathname,"/pages/new-construction-development/GPT-6/index.html");await expect(page).toHaveTitle("Ridgeline at Cedar Creek | Crestwood Homes");await images(page);
   await expect(page.locator(".plan-card")).toHaveCount(4);await expect(page.locator(".stats")).toContainText("$425,000");
   for(const file of["index.html","style.css","app.js"])assert.equal(await readFile(path.join(model,file),"utf8"),await readFile(path.join(model,"out",file),"utf8"));
   for(const file of["community-brochure.pdf","specifications.pdf"]){const response=await page.request.get(new URL("assets/"+file,page.url()).href);assert.equal(response.status(),200);assert.equal((await response.body()).subarray(0,8).toString(),"%PDF-1.4");}
   const sprite=await readFile(path.join(model,"out","assets","icons.svg"),"utf8");for(const id of new Set(await page.locator("use").evaluateAll(uses=>uses.map(u=>u.getAttribute("href").split("#")[1]))))assert.ok(sprite.includes(`id="${id}"`),id);
   assert.deepEqual(await page.locator('a[href^="#"]').evaluateAll(links=>links.filter(a=>!document.getElementById(a.hash.slice(1))).map(a=>a.hash)),[]);
   assert.match(await StaticHomepage.validateStaticOutput(path.join(model,"out"),"new-construction-development","GPT-6"),/^[a-f0-9]{64}$/);
  }finally{await context.close();}
 });
 await t.test("combined filters, empty state, reset, distinct level drawings, dimensions, features and pricing handoff",async()=>{
  const{context,page}=await visit();try{
   await page.locator("#bed-filter").selectOption("4");await expect(page.locator(".plan-card")).toHaveCount(2);
   await page.locator("#price-filter").selectOption("500000");await expect(page.locator(".plan-card")).toHaveCount(1);await expect(page.locator(".plan-card")).toContainText("The Ashford");
   await page.locator("#story-filter").selectOption("1");await expect(page.locator(".empty")).toBeVisible();await page.getByRole("button",{name:"Reset filters",exact:true}).click();
   await page.locator("#size-filter").fill("2000");await expect(page.locator(".plan-card")).toHaveCount(1);await expect(page.locator("#size-output")).toHaveText("2,000 sq ft");await page.getByRole("button",{name:"Reset filters",exact:true}).click();
   for(const[name,levels]of[["The Oakmont",1],["The Ashford",2],["The Belmont",2],["The Crestview",2]]){
    await page.locator(".plan-card").filter({has:page.getByRole("heading",{name,exact:true})}).getByRole("button",{name:"View Floor Plan",exact:true}).click();
    await expect(page.locator("#plan-title")).toHaveText(name);await expect(page.locator(".floor-drawings figure")).toHaveCount(levels);await expect(page.locator("#plan-detail")).toContainText("Room dimensions");
    if(levels===2)assert.notEqual(await page.locator(".floor-drawings svg").nth(0).textContent(),await page.locator(".floor-drawings svg").nth(1).textContent());
    await expect(page.locator("#plan-detail")).toContainText("Make it your own");if(name==="The Crestview")await page.locator("#plan-dialog").screenshot({path:path.join(checks,"floor-plan-1440.png")});
    await page.getByRole("button",{name:"Close floor plan",exact:true}).click();
   }
   await page.locator('[data-plan="ashford"]').click();await page.getByRole("button",{name:"Request Pricing",exact:true}).click();await expect(page.locator("#plan-dialog")).not.toBeVisible();await expect(page.locator('input[name="interest"][value="ashford"]')).toBeChecked();await expect(page.locator('input[name="purpose"][value="Get Pricing Info"]')).toBeChecked();await expect(page.locator("#tour-date")).toBeDisabled();
  }finally{await context.close();}
 });
 await t.test("all 86 sites and exact states, tooltip-only unavailable sites, keyboard selection, zoom limits and compatibility",async()=>{
  const{context,page}=await visit();try{
   await expect(page.locator("#site-svg > g")).toHaveCount(86);
   for(const[status,count]of[["available",14],["under contract",23],["sold",46],["model home",3]])await expect(page.locator(`#site-svg > g[aria-label*=", ${status},"]`)).toHaveCount(count);
   assert.equal(await page.locator('#site-svg [aria-label^="Lot 61,"]').getAttribute("role"),"img");assert.equal(await page.locator('#site-svg [aria-label^="Lot 61,"]').getAttribute("data-lot"),null);
   const lot=page.locator('#site-svg [data-lot="47"]');await lot.focus();await lot.press("Enter");await expect(page.locator("#lot-detail")).toContainText("Lot 47");await expect(page.locator("#lot-detail")).toContainText("Compatible floor plans");
   for(let i=0;i<6;i++)await page.locator("#zoom-in").click();await expect(page.locator("#zoom-in")).toBeDisabled();await expect(page.locator("#zoom-label")).toHaveText("250%");await page.locator("#zoom-reset").click();await expect(page.locator("#zoom-out")).toBeDisabled();
   await page.locator("#availability").screenshot({path:path.join(checks,"site-plan-1440.png")});
   await page.locator("#site-map").scrollIntoViewIfNeeded();await page.screenshot({path:path.join(checks,"site-viewport-1440.png")});
   const hit=await page.locator('#site-svg [data-lot="47"] > rect').first().boundingBox();assert.ok(hit.width>=44&&hit.height>=44);
   await page.locator("#lot-filter").selectOption("sold");await expect(page.locator("#site-svg [role=button]")).toHaveCount(0);await page.locator("#list-view").click();await expect(page.locator("#lot-list article")).toHaveCount(46);
   await page.locator('[data-availability="crestview"]').click();await expect(page.locator("#lot-list")).toContainText("compatible with The Crestview");await expect(page.locator("#lot-detail")).toContainText("The Crestview");
   await page.getByRole("button",{name:"Request Info on This Lot",exact:true}).click();await expect(page.locator("#contact-form .local-note")).toContainText("Lot ");await expect(page.locator('input[name="first"]')).toBeFocused();
  }finally{await context.close();}
 });
 await t.test("both real local videos play and are cleaned up, six-image lightbox and honest expired finance actions",async()=>{
  const{context,page}=await visit();try{
   for(const id of["crestview","ashford"]){
    await page.locator(`.play-button[data-video="${id}"]`).click();await expect(page.locator("#media-content")).toContainText("Not this property");
    await expect(page.locator("#tour-video")).toHaveAttribute("aria-busy","false");
    await page.locator("#tour-video").evaluate(async v=>{v.muted=true;await v.play();});
    await expect.poll(()=>page.locator("#tour-video").evaluate(v=>v.currentTime)).toBeGreaterThan(.3);
    assert.ok(await page.locator("#tour-video").evaluate(v=>Number.isFinite(v.duration)&&v.duration>11&&v.duration<16));
    await page.locator("#tour-video").evaluate(v=>{v.pause();v.currentTime=5;});
    await expect.poll(()=>page.locator("#tour-video").evaluate(v=>!v.seeking&&v.readyState>=2&&v.currentTime>=5)).toBe(true);
    await page.locator("#media-dialog").screenshot({path:path.join(checks,`video-${id}.png`)});
    await page.getByRole("button",{name:"Close media",exact:true}).click();await expect(page.locator("#media-content")).toBeEmpty();
   }
   await page.locator('[data-photo="0"]').click();await expect(page.locator("#media-title")).toHaveText("Kitchen");await page.getByRole("button",{name:"Next →",exact:true}).click();await expect(page.locator("#media-title")).toHaveText("Primary bath");await page.keyboard.press("ArrowLeft");await page.keyboard.press("ArrowLeft");await expect(page.locator("#media-title")).toHaveText("Home office");await page.keyboard.press("Escape");
   await expect(page.locator("#financing")).toContainText("This brief deadline has passed.");await page.getByRole("button",{name:"Get Pre-Qualified in 10 Minutes",exact:true}).click();await expect(page.locator("#info-content")).toContainText("cannot pre-qualify");await page.keyboard.press("Escape");await expect(page.locator("#info-content")).toBeEmpty();
  }finally{await context.close();}
 });
 await t.test("tour boundaries, real field validation, required choices, malicious text, private previews and newsletter cleanup",async()=>{
  const{context,page}=await visit();try{
   const form=page.locator("#contact-form");
   await form.locator('[name="first"]').fill("   ");await form.locator('[name="last"]').fill("Example");await form.locator('[name="email"]').fill("hello@example.invalid");await form.locator('[name="phone"]').fill("-------");await form.locator('[name="consent"]').check();
   const dates=await page.evaluate(()=>{const fmt=d=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;const open=new Date(),closed=new Date();open.setDate(open.getDate()+1);closed.setDate(closed.getDate()+1);while([2,3].includes(open.getDay()))open.setDate(open.getDate()+1);while(![2,3].includes(closed.getDay()))closed.setDate(closed.getDate()+1);return{open:fmt(open),closed:fmt(closed)};});
   await page.locator("#tour-date").fill(dates.open);await page.locator("#contact-submit").click();assert.equal(await valid(form.locator('[name="first"]')),false);
   await form.locator('[name="first"]').fill('<img src=x onerror="window.bad=1">');await page.locator("#contact-submit").click();assert.equal(await valid(form.locator('[name="phone"]')),false);
   await form.locator('[name="phone"]').fill("+1 919 555 0199");await page.locator("#contact-submit").click();assert.equal(await valid(form.locator('[name="interest"]').first()),false);
   await form.locator('[name="interest"][value="belmont"]').check();assert.equal(await valid(form.locator('[name="interest"]').first()),true);
   await page.locator("#tour-date").fill(dates.closed);await page.locator("#contact-submit").click();assert.equal(await valid(page.locator("#tour-date")),false);
   await page.locator("#tour-date").fill("2020-01-01");assert.equal(await valid(page.locator("#tour-date")),false);await page.locator("#tour-date").fill(dates.open);
   await form.locator('[name="notes"]').fill('<script>window.bad=1</script>');await page.locator("#contact-submit").click();
   await expect(page.locator("#info-title")).toHaveText("Your local request preview");await expect(page.locator("#info-content")).toContainText('<img src=x onerror="window.bad=1">');assert.equal(await page.evaluate(()=>window.bad),undefined);await expect(page.locator("#info-content img,#info-content script")).toHaveCount(0);
   await expect(form.locator('[name="first"]')).toHaveValue("");await expect(form.locator('[name="email"]')).toHaveValue("");await page.getByRole("button",{name:"Close information",exact:true}).click();await expect(page.locator("#info-content")).toBeEmpty();
   await page.getByRole("button",{name:"Newsletter",exact:true}).click();await page.locator("#info-content input[type=email]").fill("newsletter@example.invalid");await page.locator("#info-content input[type=checkbox]").check();await page.getByRole("button",{name:"Preview newsletter preference",exact:true}).click();await expect(page.locator("#info-content")).toContainText("No subscription was made");await page.keyboard.press("Escape");await expect(page.locator("#info-content")).toBeEmpty();
   for(const name of["About","Other Communities","Careers","Warranty","Refer a Friend","Instagram","Facebook","Privacy","Terms"]){await page.getByRole("button",{name,exact:true}).click();await expect(page.locator("#info-content")).not.toBeEmpty();await page.keyboard.press("Escape");}
   assert.equal(await page.evaluate(()=>localStorage.length+sessionStorage.length),0);
  }finally{await context.close();}
 });
 await t.test("five widths, native mobile navigation/list/tabs/filters, real gallery swipe and desktop/phone visual captures",async()=>{
  for(const width of[1440,1024,768,390,320]){
   const{context,page}=await visit({viewport:{width,height:width<760?844:1000},hasTouch:width<760,isMobile:width<760});
   try{
    await images(page);assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`Overflow ${width}`);
    if(width<760){
     await expect(page.locator("#lot-list")).toBeVisible();await page.locator("#lot-list").getByRole("button").first().tap();await expect(page.locator("#lot-detail h3")).toContainText("Lot 47");
     await page.locator("#premium-tab").tap();await expect(page.locator("#premium-panel")).toBeVisible();await expect(page.locator("#standard-panel")).not.toBeVisible();await page.locator("#premium-tab").press("ArrowLeft");await expect(page.locator("#standard-panel")).toBeVisible();
     await page.locator("#plan-filters summary").tap();await expect(page.locator("#filters")).toBeVisible();await page.locator("#bed-filter").selectOption("5");await expect(page.locator(".plan-card")).toHaveCount(1);await page.getByRole("button",{name:"Reset filters",exact:true}).tap();await page.locator("#plan-filters summary").tap();
     await page.locator("#menu-open").tap();await expect(page.locator("#nav-dialog")).toBeVisible();await page.locator('#nav-dialog a[href="#community"]').tap();await expect(page.locator("#nav-dialog")).not.toBeVisible();
     await page.locator('[data-plan="oakmont"]').tap();await expect(page.locator("#plan-title")).toHaveText("The Oakmont");await page.getByRole("button",{name:"Close floor plan",exact:true}).tap();
     await page.locator('[data-photo="0"]').tap();await page.getByRole("button",{name:"Next →",exact:true}).tap();await expect(page.locator("#media-title")).toHaveText("Primary bath");await page.getByRole("button",{name:"Close media",exact:true}).tap();
     if(width===390){
      await page.locator("#availability").screenshot({path:path.join(checks,"site-list-390.png")});await page.locator("#contact-form").screenshot({path:path.join(checks,"contact-390.png")});
      await page.evaluate(()=>window.scrollTo(0,document.querySelector("#availability").getBoundingClientRect().top+scrollY-90));await page.screenshot({path:path.join(checks,"site-viewport-390.png")});
      await page.locator('.play-button[data-video="ashford"]').tap();await expect(page.locator("#tour-video")).toHaveAttribute("aria-busy","false");await expect.poll(()=>page.locator("#tour-video").evaluate(v=>v.readyState)).toBeGreaterThanOrEqual(2);
      const videoBox=await page.locator("#tour-video").boundingBox();await page.locator("#tour-video").tap({position:{x:24,y:videoBox.height-22}});await expect.poll(()=>page.locator("#tour-video").evaluate(v=>v.currentTime)).toBeGreaterThan(.1);
      await page.locator("#media-dialog").screenshot({path:path.join(checks,"video-390.png")});await page.getByRole("button",{name:"Close media",exact:true}).tap();await expect(page.locator("#media-content")).toBeEmpty();
      const strip=page.locator("#gallery-strip");await strip.scrollIntoViewIfNeeded();const r=await strip.boundingBox(),cdp=await context.newCDPSession(page),y=r.y+r.height*.4,x=r.x+r.width*.83;
      await cdp.send("Input.dispatchTouchEvent",{type:"touchStart",touchPoints:[{x,y,id:1}]});for(let i=1;i<=16;i++)await cdp.send("Input.dispatchTouchEvent",{type:"touchMove",touchPoints:[{x:x-r.width*.62*i/16,y,id:1}]});await cdp.send("Input.dispatchTouchEvent",{type:"touchEnd",touchPoints:[]});await expect.poll(()=>strip.evaluate(n=>n.scrollLeft)).toBeGreaterThan(30);await cdp.detach();
     }
    }else{
     await expect(page.locator("#site-map")).toBeVisible();await expect(page.locator("#standard-panel")).toBeVisible();await expect(page.locator("#premium-panel")).toBeVisible();
    }
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`Interaction overflow ${width}`);
    if(width===1440||width===390){await page.evaluate(()=>{document.querySelector("#gallery-strip").scrollLeft=0;window.scrollTo(0,0);});await expect(page.locator("dialog[open]")).toHaveCount(0);await page.screenshot({path:path.join(checks,`desktop-mobile-${width}.png`),fullPage:true});}
   }finally{await context.close();}
  }
 });
 assert.deepEqual(errors,[]);assert.ok(requests.every(r=>new URL(r.url).origin===new URL(service.url).origin&&r.method==="GET"));
 await writeFile(path.join(checks,"validation.json"),JSON.stringify({checkedAt:new Date().toISOString(),digest:await StaticHomepage.validateStaticOutput(path.join(model,"out"),"new-construction-development","GPT-6"),tests:7,errors,intentionalBlobMediaAborts:expectedMediaAborts.length,checks:"Independent real Chromium: public subpath, local resources/PDF, floor filters and both levels, exact 86 statuses, keyboard map/zoom/compatibility, two playing and seekable local videos with cleanup, lightbox, expired offers, safe private form edges, newsletter, five widths, native mobile taps and CDP gallery swipe"},null,2)+"\n");
});
