import test from "node:test";
import assert from "node:assert/strict";
import {mkdir,readFile,writeFile} from "node:fs/promises";
import path from "node:path";
import {fileURLToPath} from "node:url";
import {chromium,expect} from "@playwright/test";
import {startPreviewServer} from "../../../../src/workflows/generate-preview.mjs";
import { StaticHomepage } from "../../../../src/workflows/render-prompt-pages.mjs";
const model=fileURLToPath(new URL(".",import.meta.url));
const workspace=fileURLToPath(new URL("../../../../",import.meta.url));
test("Meridian independent cinematic luxury residence",{timeout:180000},async(t)=>{
  const server=await startPreviewServer(path.join(model,"out"),{workspace});
  const browser=await chromium.launch({headless:true});
  t.after(async()=>{await browser.close();await server.close();});
  const errors=[],requests=[];
  await mkdir(path.join(model,".checks"),{recursive:true});
  async function visit(options={}) {
    const context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:"reduce",...options});
    const page=await context.newPage();page.setDefaultTimeout(10000);
    page.on("pageerror",(error)=>errors.push(error.message));
    page.on("console",(message)=>{if(message.type()==="error")errors.push(message.text());});
    page.on("requestfailed",(request)=>errors.push(`Failed: ${request.url()}`));
    page.on("response",(response)=>{if(response.status()>=400)errors.push(`${response.status()} ${response.url()}`);});
    await context.route("**/*",(route)=>{
      requests.push({url:route.request().url(),method:route.request().method()});
      return new URL(route.request().url()).origin===new URL(server.url).origin ? route.continue() : route.abort();
    });
    await page.goto(server.url,{waitUntil:"networkidle"});await page.evaluate(()=>document.fonts.ready);
    return {context,page};
  }
  async function loadImages(page) {
    await page.locator("img[src]").evaluateAll((images)=>images.forEach((image)=>{image.loading="eager";}));
    await page.locator("img[src]").evaluateAll((images)=>Promise.all(images.map((image)=>image.decode())));
  }
  async function closeInfo(page) {await page.getByRole("button",{name:"Close information",exact:true}).click();await expect(page.locator("#info-content")).toBeEmpty();}
  const valid=(locator)=>locator.evaluate((node)=>node.checkValidity());
  await t.test("public subpath, complete local export, fonts, all icon references and real PDF download",async()=>{
    const {page,context}=await visit();
    try {
      assert.equal(new URL(page.url()).pathname,"/pages/luxury-property-showcase/GPT-6/index.html");
      await expect(page).toHaveTitle("The Meridian Penthouse | A Life Above");
      await loadImages(page);
      assert.equal(await page.evaluate(()=>document.fonts.check("16px Playfair")&&document.fonts.check("16px Source")),true);
      for(const file of ["index.html","style.css","app.js"])assert.equal(await readFile(path.join(model,file),"utf8"),await readFile(path.join(model,"out",file),"utf8"));
      assert.deepEqual(await page.locator('a[href^="#"]').evaluateAll((links)=>links.filter((link)=>!document.getElementById(link.hash.slice(1))).map((link)=>link.hash)),[]);
      const sprite=await readFile(path.join(model,"out","assets","icons.svg"),"utf8");
      for(const id of new Set(await page.locator("use").evaluateAll((uses)=>uses.map((use)=>use.getAttribute("href").split("#")[1]))))assert.ok(sprite.includes(`id="${id}"`),id);
      const download=page.waitForEvent("download");
      await page.getByRole("link",{name:"Download Floor Plan PDF",exact:true}).click();
      const file=await download;assert.equal(file.suggestedFilename(),"meridian-floor-plan.pdf");
      const pdf=await readFile(await file.path());assert.equal(pdf.subarray(0,5).toString(),"%PDF-");assert.ok(pdf.length>10000);
      await expect(page.locator(".details-inner dd")).toHaveText(["4","3.5","3,800","42nd","2"]);
      await expect(page.locator(".photo-tile")).toHaveCount(14);await expect(page.locator(".amenity-card")).toHaveCount(8);
      assert.match(await StaticHomepage.validateStaticOutput(path.join(model,"out"),"luxury-property-showcase","GPT-6"),/^[a-f0-9]{64}$/);
      assert.equal(await page.evaluate(()=>localStorage.length+sessionStorage.length),0);
    } finally {await context.close();}
  });
  await t.test("gallery opens actual selected images, loops through all 14, supports arrow keys and restores focus",async()=>{
    const {page,context}=await visit();
    try {
      const opener=page.getByRole("button",{name:"View all 14 photographs",exact:true});
      await opener.click();await expect(page.locator("#photo-count")).toHaveText("1 of 14");
      await page.keyboard.press("ArrowLeft");await expect(page.locator("#photo-count")).toHaveText("14 of 14");
      for(let index=0;index<14;index++){
        await page.getByRole("button",{name:"Next photograph",exact:true}).click();
        await expect(page.locator("#photo-count")).toHaveText(`${index+1} of 14`);
        await page.locator("#lightbox-image").evaluate((image)=>image.decode());
      }
      await page.getByRole("button",{name:"Previous photograph",exact:true}).click();await expect(page.locator("#photo-count")).toHaveText("13 of 14");
      await page.keyboard.press("Escape");await expect(page.locator("#photo-dialog")).not.toBeVisible();await expect(opener).toBeFocused();
      await page.getByRole("button",{name:"Open photograph: Primary suite",exact:true}).click();
      await expect(page.locator("#photo-title")).toHaveText("Primary suite");await expect(page.locator("#photo-count")).toHaveText("4 of 14");
      await page.getByRole("button",{name:"Close photograph",exact:true}).click();await expect(page.locator("#lightbox-image")).not.toHaveAttribute("src");
    } finally {await context.close();}
  });
  await t.test("room highlights and real zoom/pan, complete finishes, horizontal amenity controls and keyboard",async()=>{
    const {page,context}=await visit();
    try {
      const sizes=["18' × 22'","24' × 30'","16' × 20'","12' × 14'","14' × 16'","12' × 14'","12' × 12'"];
      await expect(page.locator(".room-option span")).toHaveText(sizes);
      for(let index=0;index<7;index++){
        await page.locator(".room-option").nth(index).click();
        await expect(page.locator(".room-hotspot").nth(index)).toHaveAttribute("aria-pressed","true");
        await expect(page.locator("#room-detail")).toContainText(sizes[index]);
      }
      await page.getByRole("button",{name:"Zoom in floor plan",exact:true}).click();await expect(page.locator("#floor-zoom")).toHaveText("125%");
      const frame=page.locator("#floor-viewport");
      await frame.focus();for(let index=0;index<10;index++)await frame.press("+");
      await expect(page.locator("#floor-zoom")).toHaveText("300%");
      assert.ok(await frame.evaluate((node)=>node.scrollWidth>node.clientWidth&&node.scrollLeft>0));
      await frame.press("0");await expect(page.locator("#floor-zoom")).toHaveText("100%");
      await page.getByRole("button",{name:"Reset floor plan",exact:true}).click();assert.equal(await frame.evaluate((node)=>node.scrollLeft),0);
      await expect(page.locator(".feature-item")).toHaveCount(6);
      for(const item of await page.locator(".feature-item").all())await expect(item.locator("li")).toHaveCount(4);
      await expect(page.locator(".feature-item").first()).toContainText("Sub-Zero refrigerator");
      const strip=page.locator("#amenity-strip");await page.getByRole("button",{name:"Next building amenity",exact:true}).click();
      assert.ok(await strip.evaluate((node)=>node.scrollLeft)>0);
      await page.getByRole("button",{name:"Previous building amenity",exact:true}).click();assert.equal(await strip.evaluate((node)=>node.scrollLeft),0);
      await strip.focus();await strip.press("ArrowRight");assert.ok(await strip.evaluate((node)=>node.scrollLeft)>0);
      for(let index=0;index<10;index++){
        if(await strip.evaluate((node)=>node.scrollLeft+node.clientWidth>=node.scrollWidth-2))break;
        const left=await strip.evaluate((node)=>node.scrollLeft);
        await page.locator("#amenity-next").click();
        await expect.poll(()=>strip.evaluate((node)=>node.scrollLeft)).toBeGreaterThan(left);
      }
      await expect(page.locator("#amenity-next")).toBeDisabled();
    } finally {await context.close();}
  });
  await t.test("schematic map markers, proximity links, scores, real mouse drag and zoom/reset",async()=>{
    const {page,context}=await visit();
    try {
      await expect(page.locator(".scores strong")).toHaveText(["96","92","88"]);
      await expect(page.locator(".nearby-button span")).toHaveText(["3 min walk","5 min walk","8 min drive","22 min drive","10 min walk"]);
      await page.locator(".nearby-button").last().click();await expect(page.locator("#map-callout")).toContainText("Central Park");await expect(page.locator("#map-callout")).toContainText("unverified");
      await page.getByRole("button",{name:"Harbor Walk: 3 min walk, unverified",exact:true}).click();await expect(page.locator("#map-callout strong")).toHaveText("Harbor Walk");
      const art=page.locator("#map-art"),before=await art.getAttribute("style");
      await page.getByRole("button",{name:"Zoom in neighborhood map",exact:true}).click();assert.notEqual(await art.getAttribute("style"),before);
      const map=page.locator("#neighborhood-map");await map.scrollIntoViewIfNeeded();
      const box=await map.boundingBox(),old=await art.getAttribute("style");
      await page.mouse.move(box.x+70,box.y+box.height*.40);await page.mouse.down();await page.mouse.move(box.x+130,box.y+box.height*.45,{steps:10});await page.mouse.up();
      assert.notEqual(await art.getAttribute("style"),old);
      await map.focus();await map.press("ArrowLeft");await map.press("+");
      await page.getByRole("button",{name:"Reset neighborhood map",exact:true}).click();await expect(page.locator("#map-callout strong")).toHaveText("The Meridian");
      await expect(page.locator(".map-note")).toContainText("not a real navigation map");
      await page.locator(".map-frame").screenshot({path:path.join(model,".checks","map-1440.png")});
    } finally {await context.close();}
  });
  await t.test("honest four-room photo walkthrough, zoom and mouse/keyboard pan, full-window toggle and close",async()=>{
    const {page,context}=await visit();
    try {
      const opener=page.getByRole("button",{name:"Start illustrative photo walkthrough",exact:true});await opener.click();
      await expect(page.locator("#tour-title")).toHaveText("Living Room");
      await page.getByRole("button",{name:"Previous walkthrough room",exact:true}).click();await expect(page.locator("#tour-title")).toHaveText("Private Terrace");
      await page.getByRole("button",{name:"Next walkthrough room",exact:true}).click();await expect(page.locator("#tour-title")).toHaveText("Living Room");
      await page.locator("[data-tour-room='2']").click();await expect(page.locator("#tour-title")).toHaveText("Primary Suite");
      await page.locator("#tour-image").evaluate((image)=>image.decode());
      await page.getByRole("button",{name:"Zoom in walkthrough",exact:true}).click();
      const scene=page.locator("#tour-scene"),image=page.locator("#tour-image");await scene.focus();
      const old=await image.getAttribute("style");await scene.press("ArrowRight");assert.notEqual(await image.getAttribute("style"),old);
      const box=await scene.boundingBox(),dragStart=await image.getAttribute("style");
      await page.mouse.move(box.x+box.width*.3,box.y+box.height*.4);await page.mouse.down();await page.mouse.move(box.x+box.width*.3+40,box.y+box.height*.4+20,{steps:8});await page.mouse.up();
      assert.notEqual(await image.getAttribute("style"),dragStart);
      await page.getByRole("button",{name:"Expand photo walkthrough",exact:true}).click();
      const expanded=await page.locator("#tour-dialog").boundingBox();assert.equal(expanded.width,1440);assert.equal(expanded.height,1000);
      await expect(page.locator("#tour-expand")).toHaveAttribute("aria-pressed","true");
      await page.getByRole("button",{name:"Restore photo walkthrough",exact:true}).click();
      await page.getByRole("button",{name:"Reset walkthrough view",exact:true}).click();await expect(page.locator("#tour-out")).toBeDisabled();
      await page.locator("#tour-dialog").screenshot({path:path.join(model,".checks","tour-1440.png")});
      await page.keyboard.press("Escape");await expect(opener).toBeFocused();await expect(image).not.toHaveAttribute("src");
      await page.getByRole("button",{name:"Open full-window photo walkthrough",exact:true}).click();
      await expect(page.locator("#tour-expand")).toHaveAttribute("aria-pressed","true");await page.getByRole("button",{name:"Close photo walkthrough",exact:true}).click();
    } finally {await context.close();}
  });
  await t.test("financial edge cases and safe viewing preview with native validation, date/phone/consent guards and field cleanup",async()=>{
    const {page,context}=await visit();
    try {
      const payment=3360000*(.0675/12)/(1-Math.pow(1+.0675/12,-360));
      await expect(page.locator("#monthly-payment")).toHaveText(`$${payment.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2})}/mo`);
      await page.locator("#interest-rate").fill("0");await expect(page.locator("#monthly-payment")).toHaveText("$9,333.33/mo");
      await page.locator("#down-percent").fill("100");await expect(page.locator("#monthly-payment")).toHaveText("$0.00/mo");
      for(const [id,value] of [["down-percent","101"],["down-percent","-1"],["interest-rate","31"],["loan-years","2.5"],["purchase-price","0"]]){
        await page.locator(`#${id}`).fill(value);assert.equal(await valid(page.locator(`#${id}`)),false);await expect(page.locator("#monthly-payment")).toHaveText("—");
        await page.locator(`#${id}`).fill({ "down-percent":"20","interest-rate":"6.75","loan-years":"30","purchase-price":"4200000"}[id]);
      }
      await page.getByRole("button",{name:"Get Pre-Approved",exact:true}).click();await expect(page.locator("#info-content")).toContainText("No lender");await closeInfo(page);
      const form=page.locator("#viewing-form"),submit=page.getByRole("button",{name:"Request Private Viewing",exact:true});
      await submit.click();assert.equal(await valid(form),false);
      await page.locator("#full-name").fill("   ");assert.equal(await valid(page.locator("#full-name")),false);
      const unsafe='<img src=x onerror="window.pwned=1">';await page.locator("#full-name").fill(unsafe);
      await page.locator("#email").fill("invalid");assert.equal(await valid(page.locator("#email")),false);
      await page.locator("#email").fill("viewer@example.invalid");
      for(const value of ["abc1234567","123","1234567890123456"]){await page.locator("#phone").fill(value);assert.equal(await valid(page.locator("#phone")),false);}
      await page.locator("#phone").fill("+1 (212) 555-0148");
      const tomorrow=await page.locator("#viewing-date").getAttribute("min");
      await page.locator("#viewing-date").fill("2020-01-01");assert.equal(await valid(page.locator("#viewing-date")),false);
      await page.locator("#viewing-date").fill(tomorrow);await page.locator("#viewing-time").selectOption("2:00 PM");
      await page.locator("#viewing-message").fill(unsafe);await submit.click();await expect(page.locator("#info-dialog")).not.toBeVisible();
      await form.getByRole("checkbox").check();await submit.click();await expect(page.locator("#info-title")).toHaveText("Your viewing enquiry preview");
      await expect(page.locator("#info-content")).toContainText(unsafe);await expect(page.locator("#info-content")).toContainText("no appointment is booked");
      await expect(page.locator("#info-content img")).toHaveCount(0);assert.equal(await page.evaluate(()=>window.pwned),undefined);
      for(const input of await form.locator("input:not([type=checkbox]),textarea").all())await expect(input).toHaveValue("");
      await expect(form.getByRole("checkbox")).not.toBeChecked();
      await page.keyboard.press("Escape");await expect(page.locator("#info-content")).toBeEmpty();await expect(submit).toBeFocused();
      for(const button of await page.locator("[data-panel]").all()){
        await button.click();await expect(page.locator("#info-dialog")).toBeVisible();await expect(page.locator("#info-content")).not.toBeEmpty();await closeInfo(page);
      }
      for(let index=0;index<3;index++){await page.locator("[data-listing]").nth(index).click();await expect(page.locator("#info-content")).toContainText("unverified");await closeInfo(page);}
    } finally {await context.close();}
  });
  await t.test("five widths, desktop/mobile visual captures, native collapse, real CDP swipes, touch map and phone-size tour",async()=>{
    for(const width of [1440,1024,768,390,320]){
      const isMobile=width<700,{page,context}=await visit({viewport:{width,height:width<700 ? 844 : 1000},isMobile,hasTouch:isMobile});
      try{
        await loadImages(page);
        assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`Page overflow at ${width}`);
        const hero=await page.locator(".hero").boundingBox();assert.equal(hero.height,width<700 ? 844 : 1000);
        const embed=await page.locator(".tour-embed").boundingBox();
        assert.ok(Math.abs(embed.width/embed.height-16/9)<.02,`Tour embed aspect ratio at ${width}`);
        if(isMobile){
          await expect(page.locator("#key-details")).not.toHaveAttribute("open");
          await page.locator("#key-details summary").click();await expect(page.locator("#key-details dl")).toBeVisible();
          await page.locator("#key-details summary").click();
          const menu=page.getByRole("button",{name:"Open navigation",exact:true});await menu.click();
          await expect(menu).toHaveAttribute("aria-expanded","true");
          await page.locator("#nav-dialog").getByRole("link",{name:"Floor Plan",exact:true}).click();
          await expect(menu).toHaveAttribute("aria-expanded","false");
          const features=page.locator(".feature-item");
          await features.nth(1).locator("summary").click();await expect(features.nth(1)).toHaveAttribute("open");
          await expect(features.first()).not.toHaveAttribute("open");
          await page.getByRole("button",{name:"Zoom in floor plan",exact:true}).click();await expect(page.locator("#floor-zoom")).toHaveText("125%");
          const size=await page.locator("#floor-in").boundingBox();assert.ok(size.width>=44&&size.height>=44);
          await page.getByRole("button",{name:"Reset floor plan",exact:true}).click();
          const cdp=await context.newCDPSession(page);
          async function swipe(locator,dx,dy=0,startX=.7,startY=.45){
            await locator.scrollIntoViewIfNeeded();const box=await locator.boundingBox(),x=box.x+box.width*startX,y=box.y+box.height*startY;
            await cdp.send("Input.dispatchTouchEvent",{type:"touchStart",touchPoints:[{x,y}]});
            for(let step=1;step<=8;step++){await cdp.send("Input.dispatchTouchEvent",{type:"touchMove",touchPoints:[{x:x+dx*step/8,y:y+dy*step/8}]});await page.waitForTimeout(20);}
            await cdp.send("Input.dispatchTouchEvent",{type:"touchEnd",touchPoints:[]});
            if(await locator.evaluate((node)=>node.scrollWidth>node.clientWidth)){
              await locator.evaluate((node)=>new Promise((resolve)=>{
                let last=node.scrollLeft,stable=0;
                function settled(){
                  if(Math.abs(node.scrollLeft-last)<.1)stable++;else stable=0;
                  last=node.scrollLeft;
                  if(stable>=10)resolve();else requestAnimationFrame(settled);
                }
                requestAnimationFrame(settled);
              }));
            }
          }
          await page.locator(".nearby-button").last().tap();await expect(page.locator("#map-callout strong")).toHaveText("Central Park");
          await page.getByRole("button",{name:"Reset neighborhood map",exact:true}).tap();
          await expect(page.locator("#map-callout strong")).toHaveText("The Meridian");
          if(width===390){
            await page.locator(".map-frame").evaluate((node)=>node.scrollIntoView({block:"center"}));
            await page.locator(".map-frame").screenshot({path:path.join(model,".checks","map-390.png")});
          }
          await page.getByRole("button",{name:"Open full-window photo walkthrough",exact:true}).tap();
          const tour=await page.locator("#tour-dialog").boundingBox();assert.equal(tour.width,width);assert.equal(tour.height,844);
          await page.locator("[data-tour-room='3']").tap();await expect(page.locator("#tour-title")).toHaveText("Private Terrace");
          if(width===390)await page.locator("#tour-dialog").screenshot({path:path.join(model,".checks","tour-390.png")});
          await page.getByRole("button",{name:"Close photo walkthrough",exact:true}).tap();
          await expect(page.locator("#tour-dialog")).not.toBeVisible();
          await page.getByRole("button",{name:"View all 14 photographs",exact:true}).tap();
          await expect(page.locator("#photo-count")).toHaveText("1 of 14");
          await page.getByRole("button",{name:"Close photograph",exact:true}).tap();
          await expect(page.locator("#photo-dialog")).not.toBeVisible();
          await swipe(page.locator("#photo-grid"),-Math.min(220,width*.65));await expect.poll(()=>page.locator("#photo-grid").evaluate((node)=>node.scrollLeft)).toBeGreaterThan(0);
          await swipe(page.locator("#amenity-strip"),-Math.min(220,width*.65));await expect.poll(()=>page.locator("#amenity-strip").evaluate((node)=>node.scrollLeft)).toBeGreaterThan(0);
          const mapBefore=await page.locator("#map-art").getAttribute("style");await swipe(page.locator("#neighborhood-map"),-65,25,.4,.57);assert.notEqual(await page.locator("#map-art").getAttribute("style"),mapBefore);
          await page.getByRole("button",{name:"View all 14 photographs",exact:true}).press("Enter");
          await expect(page.locator("#photo-count")).toHaveText("1 of 14");
          await swipe(page.locator("#lightbox-image"),-130);await expect(page.locator("#photo-count")).toHaveText("2 of 14");
          await page.keyboard.press("Escape");await expect(page.locator("#photo-dialog")).not.toBeVisible();
          await cdp.detach();
          const target=await page.locator(".floating-viewing").boundingBox();assert.ok(target.height>=44);
        }
        if(width===1440||width===390){
          await page.evaluate(async()=>{for(let y=0;y<document.documentElement.scrollHeight;y+=650){scrollTo(0,y);await new Promise((resolve)=>setTimeout(resolve,12));}scrollTo(0,0);});
          await page.locator("#photo-grid").evaluate((node)=>{node.scrollLeft=0;});
          await page.locator("#amenity-strip").evaluate((node)=>{node.scrollLeft=0;});
          await expect(page.locator("dialog[open]")).toHaveCount(0);
          await expect.poll(()=>page.evaluate(()=>scrollY)).toBe(0);
          await expect(page.locator(".site-header")).not.toHaveClass(/light/);
          await page.screenshot({path:path.join(model,".checks",`desktop-mobile-${width}.png`),fullPage:true});
        }
        assert.equal(await page.evaluate(()=>localStorage.length+sessionStorage.length),0);
        assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`Page overflow after interactions at ${width}`);
      }finally{await context.close();}
    }
  });
  assert.deepEqual(errors,[]);
  assert.ok(requests.every((request)=>request.method==="GET"&&new URL(request.url).origin===new URL(server.url).origin));
  await writeFile(path.join(model,".checks","validation.json"),JSON.stringify({
    checkedAt:new Date().toISOString(),digest:await StaticHomepage.validateStaticOutput(path.join(model,"out"),"luxury-property-showcase","GPT-6"),
    widths:[1440,1024,768,390,320],browser:"Playwright Chromium",errors,
    checks:["Independent public subpath and matching source/export; local fonts, decoded images, icon symbols and actual PDF download","Fourteen-photo lightbox loop, keyboard, touch swipe and focus return","Seven exact room dimensions, selection, actual 100–300% zoom and contained scrolling","Six original finish groups and eight scrollable amenity cards","Interactive schematic neighborhood pins, proximity selection, genuine mouse/touch pan, zoom/reset and original unverified scores","Four-room illustrative 2D walkthrough, scene selection, image pan/zoom and real full-window expansion","Amortization formula and zero-rate/all-down/boundary cases; native viewing guards, safe local preview and personal-field cleanup","All contact, social, policy, comparable listing actions; five responsive widths, mobile native accordions, drawer, fixed action and CDP touch gestures","Every application request local GET; no page/console/resource errors or browser storage"]
  },null,2)+"\n");
});
