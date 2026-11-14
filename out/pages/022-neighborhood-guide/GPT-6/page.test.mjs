import test from "node:test";
import assert from "node:assert/strict";
import {mkdir,readFile,writeFile} from "node:fs/promises";
import path from "node:path";
import {fileURLToPath} from "node:url";
import {chromium,expect} from "@playwright/test";
import {startPreviewServer} from "../../../../src/workflows/generate-preview.mjs";
import { StaticHomepage } from "../../../../src/workflows/render-prompt-pages.mjs";
const model=fileURLToPath(new URL(".",import.meta.url)),workspace=fileURLToPath(new URL("../../../../",import.meta.url));
test("HomeScope independent interactive neighborhood guide",{timeout:150000},async(t)=>{
  const service=await startPreviewServer(path.join(model,"out"),{workspace}),browser=await chromium.launch({headless:true});
  t.after(async()=>{await browser.close();await service.close();});
  const errors=[],requests=[];
  await mkdir(path.join(model,".checks"),{recursive:true});
  async function visit(options={}){
    const context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:"reduce",...options}),page=await context.newPage();
    page.setDefaultTimeout(10000);
    page.on("pageerror",(error)=>errors.push(error.message));
    page.on("console",(message)=>{if(message.type()==="error")errors.push(message.text());});
    page.on("requestfailed",(request)=>errors.push(`Failed: ${request.url()}`));
    page.on("response",(response)=>{if(response.status()>=400)errors.push(`${response.status()} ${response.url()}`);});
    await context.route("**/*",(route)=>{
      requests.push({url:route.request().url(),method:route.request().method()});
      return new URL(route.request().url()).origin===new URL(service.url).origin?route.continue():route.abort();
    });
    await page.goto(service.url,{waitUntil:"networkidle"});await page.evaluate(()=>document.fonts.ready);
    return{context,page};
  }
  async function images(page){
    await page.locator("img[src]").evaluateAll((list)=>list.forEach((image)=>image.loading="eager"));
    await page.locator("img[src]").evaluateAll((list)=>Promise.all(list.map((image)=>image.decode())));
  }
  const valid=(locator)=>locator.evaluate((node)=>node.checkValidity());
  async function closeInfo(page){await page.getByRole("button",{name:"Close information",exact:true}).click();await expect(page.locator("#info-content")).toBeEmpty();}
  await t.test("public subpath, independent matching export, decoded local assets and complete navigation",async()=>{
    const{context,page}=await visit();
    try{
      assert.equal(new URL(page.url()).pathname,"/pages/neighborhood-guide/GPT-6/index.html");
      await expect(page).toHaveTitle("HomeScope Realty | Find Your Neighborhood");await images(page);
      assert.ok(await page.evaluate(()=>document.fonts.check('16px "DM Sans"')&&document.fonts.check("16px Inter")));
      for(const file of["index.html","style.css","app.js"])assert.equal(await readFile(path.join(model,file),"utf8"),await readFile(path.join(model,"out",file),"utf8"));
      const sprite=await readFile(path.join(model,"out","assets","icons.svg"),"utf8");
      for(const id of new Set(await page.locator("use").evaluateAll((uses)=>uses.map((use)=>use.getAttribute("href").split("#")[1]))))assert.ok(sprite.includes(`id="${id}"`),id);
      assert.deepEqual(await page.locator('a[href^="#"]').evaluateAll((links)=>links.filter((link)=>!document.getElementById(link.hash.slice(1))).map((link)=>link.hash)),[]);
      assert.match(await StaticHomepage.validateStaticOutput(path.join(model,"out"),"neighborhood-guide","GPT-6"),/^[a-f0-9]{64}$/);
      await expect(page.locator(".neighborhood-card")).toHaveCount(6);
      await expect(page.locator(".score-card")).toHaveCount(4);await expect(page.locator(".score-card").first()).toContainText("82");
      assert.equal(await page.evaluate(()=>localStorage.length+sessionStorage.length),0);
    }finally{await context.close();}
  });
  await t.test("keyboard and pointer autocomplete, city and ZIP matching, whitespace and unknown-search safety",async()=>{
    const{context,page}=await visit();
    try{
      const input=page.locator("#area-search"),options=page.locator("#search-options");
      await input.focus();await expect(options.getByRole("option")).toHaveCount(6);
      await input.press("ArrowUp");await expect(input).toHaveAttribute("aria-activedescendant","area-option-5");
      await input.press("Escape");await expect(options).not.toBeVisible();
      await input.fill("97000");await expect(options.getByRole("option")).toHaveCount(1);
      await input.press("ArrowDown");await input.press("Enter");
      await expect(page.locator("#overview-title")).toBeFocused();await expect(page.locator("dialog[open]")).toHaveCount(0);
      await input.fill("riverside");await options.getByRole("option").click();
      await expect(page.locator("#guide-title")).toHaveText("Riverside Commons");await expect(page.locator("#guide-stats")).toContainText("$525,000");
      await page.keyboard.press("Escape");await expect(page.locator("#guide-dialog")).not.toBeVisible();
      await input.fill("Fairhaven");await input.press("Enter");await expect(page.locator("#search-status")).toContainText("Choose a matching");await expect(options.getByRole("option")).toHaveCount(6);
      await input.fill("not a real example");await input.press("Enter");await expect(page.locator("#search-status")).toContainText("No example guide matches");
      await input.fill('<img src=x onerror="window.bad=1">');await input.press("Enter");assert.equal(await page.evaluate(()=>window.bad),undefined);
      await input.fill("   ");await input.press("Enter");assert.equal(await valid(input),false);
      await input.focus();assert.equal(await valid(input),false);
      await input.fill("Old Town");assert.equal(await valid(input),true);await input.press("Enter");
      await expect(page.locator("#guide-title")).toHaveText("Old Town");
    }finally{await context.close();}
  });
  await t.test("featured strip controls and keyboard endpoints, each preview and comparison handoff",async()=>{
    const{context,page}=await visit();
    try{
      const strip=page.locator("#neighborhood-strip");
      await expect(page.locator("#area-prev")).toBeDisabled();await page.locator("#area-next").click();
      await expect.poll(()=>strip.evaluate((node)=>node.scrollLeft)).toBeGreaterThan(0);
      await strip.focus();await strip.press("End");await expect(page.locator("#area-next")).toBeDisabled();
      await strip.press("Home");await expect.poll(()=>strip.evaluate((node)=>node.scrollLeft)).toBe(0);
      for(const name of["Riverside Commons","Old Town","Cedar Grove","Lakewood Park","Westhaven"]){
        await page.getByRole("button",{name:`Explore ${name}`,exact:true}).click();
        await expect(page.locator("#guide-title")).toHaveText(name);
        await expect(page.locator("#guide-description")).toContainText("fictional");
        await expect(page.locator("#guide-stats")).not.toBeEmpty();
        await page.getByRole("button",{name:"Close neighborhood preview",exact:true}).click();
      }
      await page.getByRole("button",{name:"Explore Cedar Grove",exact:true}).click();
      await page.getByRole("button",{name:"Compare with Maplewood Heights",exact:true}).click();
      await expect(page.locator("#guide-dialog")).not.toBeVisible();
      await expect(page.locator("#compare-dialog")).toBeVisible();await expect(page.locator("#compare-first")).toHaveValue("cedar-grove");
      await expect(page.locator("#comparison-result")).toContainText("$565,000");
    }finally{await context.close();}
  });
  await t.test("five map categories sync pins and sidebar, selection, real mouse drag and keyboard zoom boundaries",async()=>{
    const{context,page}=await visit();
    try{
      for(const[category,count]of[["schools",3],["parks",3],["dining",1],["shopping",2],["healthcare",2]]){
        await page.locator(`[data-category="${category}"]`).click();
        await expect(page.locator("[data-map-place]")).toHaveCount(count);await expect(page.locator("[data-list-place]")).toHaveCount(count);
        await expect(page.locator(`[data-category="${category}"]`)).toHaveAttribute("aria-pressed","true");
        const last=page.locator("[data-list-place]").last(),name=await last.locator("strong").textContent();
        await last.click();await expect(page.locator("#selection-name")).toHaveText(name);await expect(last).toHaveAttribute("aria-pressed","true");
        const id=await last.getAttribute("data-list-place");await expect(page.locator(`[data-map-place="${id}"]`)).toHaveAttribute("aria-pressed","true");
      }
      await page.locator('[data-category="all"]').click();await expect(page.locator("[data-map-place]")).toHaveCount(11);
      await page.locator('[data-map-place="middle"]').click();await expect(page.locator("#selection-name")).toHaveText("Lincoln Middle School");
      await page.locator('[data-list-place="middle"]').click();await expect(page.locator("#map-art")).not.toHaveAttribute("style",/translate\(0px, 0px\)/);
      await page.locator("#map-reset").click();await expect(page.locator("#map-art")).toHaveAttribute("style",/translate\(0px, 0px\) scale\(1\)/);
      const map=page.locator("#amenity-map");await map.evaluate((node)=>node.scrollIntoView({block:"center"}));
      const box=await map.boundingBox(),x=box.x+box.width*.4,y=box.y+box.height*.37;
      await page.mouse.move(x,y);await page.mouse.down();await page.mouse.move(x+65,y+30,{steps:8});await page.mouse.up();
      await expect(page.locator("#map-art")).not.toHaveAttribute("style",/translate\(0px, 0px\)/);
      await map.focus();await map.press("ArrowRight");await map.press("+");await expect(page.locator("#map-art")).toHaveAttribute("style",/scale\(1.25\)/);
      for(let index=0;index<10;index++)await map.press("+");
      await expect(page.locator("#map-in")).toBeDisabled();await expect(page.locator("#map-art")).toHaveAttribute("style",/scale\(2.5\)/);
      for(let index=0;index<10;index++)await map.press("-");
      await expect(page.locator("#map-out")).toBeDisabled();await expect(page.locator("#map-art")).toHaveAttribute("style",/scale\(0.75\)/);
      await page.locator('[data-list-place="elementary"]').click();await page.locator("#map-reset").click();
      await page.locator(".map-panel").screenshot({path:path.join(model,".checks","map-1440.png")});
    }finally{await context.close();}
  });
  await t.test("school and commute information, transparent rating attribution and expanded monthly chart data",async()=>{
    const{context,page}=await visit();
    try{
      await expect(page.locator(".school-row")).toHaveCount(4);
      await expect(page.locator(".school-row").last()).toContainText("Little Acorns Montessori");
      await expect(page.locator(".school-row").last()).toContainText("Private school");
      await expect(page.locator(".school-row").last()).toContainText("85");
      await expect(page.locator(".schools-section .small-note")).toContainText("not retrieved from or verified");
      await expect(page.locator(".schools-section a")).toHaveAttribute("href","https://www.greatschools.org/");
      await expect(page.locator(".commute-card")).toHaveCount(4);await expect(page.locator(".commute-mode")).toHaveCount(7);
      await page.locator(".chart-data summary").click();await expect(page.locator("#chart-data tr")).toHaveCount(12);
      await expect(page.locator("#chart-data tr").last()).toContainText("$485,000");
      await expect(page.locator("#chart-data tr").first()).toBeVisible();
      await expect(page.locator("#price-chart")).toHaveAttribute("aria-labelledby","chart-title chart-desc");
      await expect(page.locator(".review-card")).toHaveCount(3);
      await expect(page.locator(".review-card").nth(1).locator(".stars")).toHaveAttribute("aria-label","4 out of 5 stars");
    }finally{await context.close();}
  });
  await t.test("comparison choices update displayed values and reject duplicate nearby neighborhoods",async()=>{
    const{context,page}=await visit();
    try{
      await page.getByRole("button",{name:"Compare Neighborhoods Side by Side",exact:true}).click();
      const first=page.locator("#compare-first"),second=page.locator("#compare-second"),result=page.locator("#comparison-result");
      await first.selectOption("lakewood");await second.selectOption("westhaven");
      await page.getByRole("button",{name:"Update comparison",exact:true}).click();
      await expect(result).toContainText("Lakewood Park");await expect(result).toContainText("$610,000");await expect(result).toContainText("$445,000");
      await first.selectOption("old-town");await second.selectOption("old-town");await page.getByRole("button",{name:"Update comparison",exact:true}).click();
      assert.equal(await valid(second),false);await expect(result).toContainText("Lakewood Park");
      await first.selectOption("cedar-grove");assert.equal(await valid(second),true);await page.getByRole("button",{name:"Update comparison",exact:true}).click();
      await expect(result).toContainText("Cedar Grove");await expect(result).not.toContainText("Lakewood Park");
      await page.keyboard.press("Escape");await expect(page.locator("#compare-dialog")).not.toBeVisible();
    }finally{await context.close();}
  });
  await t.test("validated private local form previews, no false contact, listing or policy actions, and data cleanup",async()=>{
    const{context,page}=await visit();
    try{
      const alert=page.locator("#alert-form");await alert.getByRole("button",{name:"Preview market alerts",exact:true}).click();assert.equal(await valid(alert),false);
      await page.locator("#alert-email").fill("local+test@example.test");assert.equal(await valid(alert),false);
      await alert.locator("[name=consent]").check();await alert.getByRole("button",{name:"Preview market alerts",exact:true}).click();
      await expect(page.locator("#info-content")).toContainText("local+test@example.test");await expect(page.locator("#info-content")).toContainText("No subscription");
      await expect(page.locator("#alert-email")).toHaveValue("");await closeInfo(page);await expect(page.locator("#info-content")).not.toContainText("local+test@example.test");
      await page.locator("#tour-open").click();const form=page.locator("#tour-form"),name=form.locator("[name=name]"),date=page.locator("#tour-date");
      await form.getByRole("button",{name:"Preview tour request",exact:true}).click();assert.equal(await valid(form),false);
      await name.fill("   ");await form.locator("[name=email]").fill("tour@example.test");await date.fill("2000-01-01");
      await form.locator("[name=time]").selectOption({label:"Morning · 9 am–12 pm"});await form.locator("[name=consent]").check();
      assert.equal(await valid(date),false);await date.fill(await date.getAttribute("min"));
      await form.getByRole("button",{name:"Preview tour request",exact:true}).click();assert.equal(await valid(name),false);
      await name.focus();assert.equal(await valid(name),false);
      const payload='<img src=x onerror="window.bad=1">';await name.fill(payload);assert.equal(await valid(name),true);
      await form.getByRole("button",{name:"Preview tour request",exact:true}).click();
      await expect(page.locator("#info-content")).toContainText(payload);await expect(page.locator("#info-content")).toContainText("not a confirmed appointment");
      await expect(page.locator("#info-content img")).toHaveCount(0);assert.equal(await page.evaluate(()=>window.bad),undefined);
      await expect(name).toHaveValue("");await closeInfo(page);
      await page.locator("#tour-open").click();await name.fill("Cancelled request");await page.getByRole("button",{name:"Close neighborhood tour",exact:true}).click();await expect(name).toHaveValue("");
      for(const selector of["#agent-contact","#agent-email","#listings-button",'[data-policy="privacy"]','[data-policy="terms"]']){
        await page.locator(selector).click();await expect(page.locator("#info-content")).not.toBeEmpty();await closeInfo(page);
      }
      assert.equal(await page.evaluate(()=>localStorage.length+sessionStorage.length),0);
    }finally{await context.close();}
  });
  await t.test("five responsive widths, mobile navigation and native taps, real CDP swipes/pan, desktop/mobile visual captures",async()=>{
    for(const width of[1440,1024,768,390,320]){
      const mobile=width<700,{context,page}=await visit({viewport:{width,height:mobile?844:1000},isMobile:mobile,hasTouch:mobile});
      try{
        await images(page);assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`Page overflow at ${width}`);
        await expect(page.locator("h1")).toHaveText("Find the Neighborhood That Fits Your Life.");
        await expect(page.locator("#compare-title")).toHaveText("The right fit is in the details.");
        const sidebar=page.locator("#amenity-sidebar");
        if(width<=1024){await expect(sidebar).not.toHaveAttribute("open");await sidebar.locator("summary").click();await expect(page.locator("#place-list")).toBeVisible();await sidebar.locator("summary").click();}
        if(mobile){
          const menu=page.getByRole("button",{name:"Open navigation",exact:true});await menu.tap();await expect(menu).toHaveAttribute("aria-expanded","true");
          await page.locator("#nav-dialog").getByRole("link",{name:"Schools",exact:true}).tap();await expect(page.locator("#nav-dialog")).not.toBeVisible();await expect(menu).toHaveAttribute("aria-expanded","false");
          await page.locator('[data-category="parks"]').tap();await expect(page.locator("[data-map-place]")).toHaveCount(3);
          await sidebar.locator("summary").tap();await page.locator('[data-list-place="playground"]').tap();await expect(page.locator("#selection-name")).toHaveText("Community Playground");
          await sidebar.locator("summary").tap();await page.locator('[data-category="all"]').tap();await page.locator("#map-reset").tap();
          await expect(page.locator("#map-art")).toHaveAttribute("style",/translate\(0px, 0px\) scale\(1\)/);
          if(width===390){await page.locator(".map-panel").evaluate((node)=>node.scrollIntoView({block:"center"}));await page.locator(".map-panel").screenshot({path:path.join(model,".checks","map-390.png")});}
          await page.getByRole("button",{name:"Explore Old Town",exact:true}).tap();await expect(page.locator("#guide-title")).toHaveText("Old Town");
          await page.getByRole("button",{name:"Close neighborhood preview",exact:true}).tap();await expect(page.locator("#guide-dialog")).not.toBeVisible();
          await page.getByRole("button",{name:"Compare Neighborhoods Side by Side",exact:true}).tap();await expect(page.locator("#compare-dialog")).toBeVisible();
          assert.ok(await page.locator("#comparison-result").evaluate((node)=>node.scrollWidth>node.clientWidth));
          if(width===390)await page.locator("#compare-dialog").screenshot({path:path.join(model,".checks","comparison-390.png")});
          await page.getByRole("button",{name:"Close neighborhood comparison",exact:true}).tap();await expect(page.locator("#compare-dialog")).not.toBeVisible();
          const controls=await page.locator("#map-in").boundingBox();assert.ok(controls.width>=44&&controls.height>=44);
          const cdp=await context.newCDPSession(page);
          async function swipe(locator,dx,dy=0,startX=.75,startY=.45){
            await locator.scrollIntoViewIfNeeded();const box=await locator.boundingBox(),x=box.x+box.width*startX,y=box.y+box.height*startY;
            await cdp.send("Input.dispatchTouchEvent",{type:"touchStart",touchPoints:[{x,y}]});
            for(let step=1;step<=8;step++){await cdp.send("Input.dispatchTouchEvent",{type:"touchMove",touchPoints:[{x:x+dx*step/8,y:y+dy*step/8}]});await page.waitForTimeout(20);}
            await cdp.send("Input.dispatchTouchEvent",{type:"touchEnd",touchPoints:[]});
            if(await locator.evaluate((node)=>node.scrollWidth>node.clientWidth))await locator.evaluate((node)=>new Promise((resolve)=>{
              let last=node.scrollLeft,stable=0;
              function settle(){stable=Math.abs(node.scrollLeft-last)<.1?stable+1:0;last=node.scrollLeft;if(stable>=10)resolve();else requestAnimationFrame(settle);}
              requestAnimationFrame(settle);
            }));
          }
          await page.locator("#neighborhood-strip").evaluate((node)=>node.scrollLeft=0);
          await swipe(page.locator("#neighborhood-strip"),-Math.min(230,width*.65));await expect.poll(()=>page.locator("#neighborhood-strip").evaluate((node)=>node.scrollLeft)).toBeGreaterThan(0);
          const before=await page.locator("#map-art").getAttribute("style");await swipe(page.locator("#amenity-map"),-55,20,.4,.37);
          assert.notEqual(await page.locator("#map-art").getAttribute("style"),before);await expect(page.locator("#amenity-map")).not.toHaveClass(/dragging/);await cdp.detach();
        }
        if(width===1440||width===390){
          if(width===390)await page.locator("#contact").screenshot({path:path.join(model,".checks","contact-390.png")});
          else await page.locator("#maplewood").screenshot({path:path.join(model,".checks","overview-1440.png")});
          await page.evaluate(()=>{scrollTo(0,0);document.getElementById("neighborhood-strip").scrollLeft=0;});
          await expect.poll(()=>page.evaluate(()=>scrollY)).toBe(0);await expect(page.locator("dialog[open]")).toHaveCount(0);
          await page.screenshot({path:path.join(model,".checks",`desktop-mobile-${width}.png`),fullPage:true});
        }
        assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`Overflow after interaction at ${width}`);
        assert.equal(await page.evaluate(()=>localStorage.length+sessionStorage.length),0);
      }finally{await context.close();}
    }
  });
  assert.deepEqual(errors,[]);assert.ok(requests.every((request)=>request.method==="GET"&&new URL(request.url).origin===new URL(service.url).origin));
  await writeFile(path.join(model,".checks","validation.json"),JSON.stringify({
    checkedAt:new Date().toISOString(),digest:await StaticHomepage.validateStaticOutput(path.join(model,"out"),"neighborhood-guide","GPT-6"),widths:[1440,1024,768,390,320],browser:"Playwright Chromium",errors,
    checks:["Independent matching export and public subpath; local images, DM Sans/Inter and Lucide references decoded","Six-area accessible keyboard/pointer autocomplete, city/ZIP matching and unknown/whitespace/XSS-safe searches","Horizontal discovery strip controls, keyboard endpoints, five distinct previews and comparison handoff","Five category filters synchronize 11 schematic map pins and sidebar; actual pointer/touch/keyboard pan, bounded zoom and reset","Original Maplewood overview, scores, four schools, seven commute modes, honest source attribution and accessible twelve-month chart data","Three-column selectable comparison, displayed value updates and duplicate-area validation","Native email/name/date/consent guards, local-only alert/tour previews, safe rendering and personal-field cleanup; contact/listing/policy feedback","Five widths, mobile drawer, native taps, CDP scroll-snap swipe and unobstructed map drag, desktop/mobile screenshots; no storage or external application requests"]
  },null,2)+"\n");
});
