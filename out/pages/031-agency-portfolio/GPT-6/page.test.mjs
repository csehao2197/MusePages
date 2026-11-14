import test from "node:test";
import assert from "node:assert/strict";
import {readFile,writeFile,readdir,rm} from "node:fs/promises";
import path from "node:path";
import {chromium,expect} from "@playwright/test";
import {startPreviewServer} from "../../../../src/workflows/generate-preview.mjs";
import { StaticHomepage } from "../../../../src/workflows/render-prompt-page.mjs";
const root=import.meta.dirname;
const exported=path.join(root,"out");
const checks=path.join(root,".checks");
test("Forge & Co. static homepage acceptance",async t=>{
  await rm(path.join(checks,"validation.json"),{force:true});
  const server=await startPreviewServer(exported);
  let browser;
  const errors=[];
  const requests=[];
  const completed=[];
  const run=async(name,body)=>t.test(name,async()=>{await body();completed.push(name);});
  try{
    browser=await chromium.launch({headless:true});
    const context=await browser.newContext({viewport:{width:1440,height:1000}});
    context.on("request",request=>{requests.push({method:request.method(),url:request.url()});if(request.method()!=="GET"||!request.url().startsWith(new URL(server.url).origin))errors.push(`Unexpected request: ${request.method()} ${request.url()}`);});
    context.on("response",response=>{if(response.status()>=400)errors.push(`HTTP ${response.status()}: ${response.url()}`);});
    context.on("requestfailed",request=>errors.push(`Request failed: ${request.url()} ${request.failure()?.errorText}`));
    await context.addInitScript(()=>{for(const storage of [localStorage,sessionStorage]){storage.setItem=()=>{throw Error("Storage is forbidden in this demo");};}});
    const page=await context.newPage();
    page.on("pageerror",error=>errors.push(error.message));
    const load=async()=>{await page.goto(server.url,{waitUntil:"networkidle"});await page.evaluate(()=>document.fonts.ready);};
    await run("source/export equality and nested static assets",async()=>{
      for(const file of ["index.html","style.css","app.js"])assert.deepEqual(await readFile(path.join(root,file)),await readFile(path.join(exported,file)));
      for(const file of await readdir(path.join(root,"assets")))assert.deepEqual(await readFile(path.join(root,"assets",file)),await readFile(path.join(exported,"assets",file)));
      await load();
      await expect(page).toHaveTitle("Forge & Co. — Work That Works");
      await expect(page.locator(".project-card")).toHaveCount(24);
      assert.equal(await page.evaluate(()=>document.fonts.check('16px Space')&&document.fonts.check('16px Inter')),true);
      await page.locator("#projects-after").scrollIntoViewIfNeeded();
      await page.evaluate(async()=>{for(const img of document.images){img.loading="eager";await img.decode();}});
      assert.equal(await page.locator('a[href^="http"],script[src^="http"],img[src^="http"]').count(),0);
    });
    await run("all categories, list/grid state, and all 24 case studies",async()=>{
      await load();
      for(const [category,count] of [["Branding",8],["Web Design",8],["E-commerce",6],["Mobile Apps",4],["Digital Marketing",4],["Product Design",5]]){
        await page.locator(`[data-filter="${category}"]`).click();
        await expect(page.locator(".project-card")).toHaveCount(count);
        await expect(page.locator("#results-count")).toHaveText(`Showing ${count} projects · ${category}`);
        await expect(page.locator("#featured")).toBeHidden();
        await expect(page.locator(`[data-filter="${category}"]`)).toHaveAttribute("aria-pressed","true");
      }
      await page.getByRole("button",{name:"List view",exact:true}).click();
      await expect(page.locator("#projects-before")).toHaveClass(/list/);
      await page.locator('[data-filter="All"]').click();
      await expect(page.locator(".project-card")).toHaveCount(24);
      await expect(page.locator("#featured")).toBeVisible();
      await page.getByRole("button",{name:"Grid view",exact:true}).click();
      for(const button of await page.locator(".case-open").all()){
        const label=await button.getAttribute("aria-label");
        await button.click();
        await expect(page.locator("#detail-title")).toHaveText(label.replace("View case study: ",""));
        await expect(page.locator(".dialog-art")).toBeVisible();
        await page.keyboard.press("Escape");
        await expect(page.locator("#detail-dialog")).not.toBeVisible();
      }
      await page.locator('[data-case="solaris"]').first().click();
      await page.getByRole("button",{name:"Previous project"}).click();
      await expect(page.locator("#detail-title")).toHaveText("Folio Platform");
      await page.getByRole("button",{name:"Next project"}).click();
      await expect(page.locator("#detail-title")).toHaveText("Solaris Rebrand");
      await page.keyboard.press("Escape");
      await page.getByRole("button",{name:"Read Full Case Study"}).click();
      await expect(page.locator("#detail-title")).toHaveText("Solaris Rebrand");
      await page.getByRole("button",{name:"Close details",exact:true}).click();
    });
    await run("services, studio content, keyboard focus, and pausable logos",async()=>{
      await load();
      await expect(page.locator(".hero-stats strong").first()).toHaveText("180+");
      await page.locator(".results-grid").scrollIntoViewIfNeeded();
      await expect(page.locator(".results-grid strong").first()).toHaveText("$42M+");
      await expect(page.locator(".results-grid strong").last()).toHaveText("4.9★");
      for(const [key,title] of [["branding","Brand Strategy & Identity"],["web","Web Design & Development"],["marketing","Digital Marketing"]]){
        await page.locator(`[data-service="${key}"]`).first().click();
        await expect(page.locator("#detail-title")).toHaveText(title);
        await page.keyboard.press("Escape");
      }
      for(const key of ["insights","careers","process","email","social"]){
        await page.locator(`[data-info="${key}"]`).first().click();
        await expect(page.locator("#detail-dialog")).toBeVisible();
        await page.keyboard.press("Escape");
      }
      const pause=page.locator("#marquee-toggle");
      await pause.click();
      await expect(pause).toHaveAttribute("aria-label","Play client logos");
      assert.equal(await page.locator(".logo-track").first().evaluate(node=>getComputedStyle(node).animationPlayState),"paused");
      await pause.click();
      await expect(pause).toHaveAttribute("aria-label","Pause client logos");
      const trigger=page.locator(".header-cta");
      await trigger.focus();await page.keyboard.press("Enter");
      await expect(page.locator("#project-dialog")).toBeVisible();
      await page.keyboard.press("Shift+Tab");
      assert.equal(await page.evaluate(()=>document.activeElement.closest("dialog")?.id),"project-dialog");
      await page.keyboard.press("Escape");
      await expect(trigger).toBeFocused();
    });
    await run("trimmed form validation, safe text preview, editing, and clearing",async()=>{
      await load();
      await page.locator(".header-cta").click();
      const form=page.locator("#project-form");
      await form.locator('[name="name"]').fill("   ");
      await form.getByRole("button",{name:"Preview My Brief"}).click();
      await expect(page.locator("#form-error")).toContainText("valid name");
      await form.locator('[name="name"]').fill('  <img src=x onerror=alert(1)>  ');
      await form.locator('[name="email"]').fill("not-an-email");
      await form.getByRole("button",{name:"Preview My Brief"}).click();
      await expect(page.locator("#form-error")).toContainText("valid email");
      await form.locator('[name="email"]').fill("  alex@example.com  ");
      await form.getByRole("button",{name:"Preview My Brief"}).click();
      await expect(page.locator("#form-error")).toContainText("service selection");
      await form.locator('[name="service"]').selectOption("Brand Strategy & Identity");
      await form.locator('[name="brief"]').fill("                     ");
      await form.getByRole("button",{name:"Preview My Brief"}).click();
      await expect(page.locator("#form-error")).toContainText("20 non-whitespace");
      await form.locator('[name="brief"]').fill("  We need a distinctive brand system for our new community project. <script>alert(1)</script>  ");
      await form.getByRole("button",{name:"Preview My Brief"}).click();
      await expect(page.locator("#brief-preview")).toBeVisible();
      await expect(page.locator("#brief-output")).toContainText("<img src=x onerror=alert(1)>");
      await expect(page.locator("#brief-output")).toContainText("<script>alert(1)</script>");
      assert.equal(await page.locator("#brief-output img,#brief-output script").count(),0);
      await page.locator("#edit-brief").click();
      await expect(form.locator('[name="email"]')).toHaveValue("alex@example.com");
      await page.keyboard.press("Escape");
      await page.locator(".header-cta").click();
      await expect(form.locator('[name="name"]')).toHaveValue("");
      await expect(page.locator("#brief-preview")).toBeHidden();
      await page.keyboard.press("Escape");
    });
    await run("responsive layouts, touch, reduced motion, and actual screenshots",async()=>{
      await page.emulateMedia({reducedMotion:"reduce"});
      for(const width of [1440,1024,768,390,320]){
        await page.setViewportSize({width,height:1000});await load();
        const overflow=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,width:innerWidth}));
        assert.ok(overflow.scroll<=overflow.width,`Overflow at ${width}: ${JSON.stringify(overflow)}`);
        await page.evaluate(async()=>{for(const img of document.images){img.loading="eager";await img.decode();}});
        await expect(page.locator(".hero-stats strong").first()).toHaveText("180+");
        assert.equal(await page.locator(".logo-track").first().evaluate(node=>getComputedStyle(node).animationName),"none");
        if(width<=390){
          const targets=await page.locator(".mobile-cta,.menu-button,.filters button,.view-controls button").evaluateAll(nodes=>nodes.map(node=>({label:node.textContent||node.getAttribute("aria-label"),w:node.getBoundingClientRect().width,h:node.getBoundingClientRect().height})));
          for(const target of targets)assert.ok(target.w>=44&&target.h>=44,`Small target at ${width}: ${JSON.stringify(target)}`);
          await page.locator(".menu-button").click();await expect(page.locator("#navigation")).toBeVisible();
          await page.locator("#navigation a").filter({hasText:"Services"}).click();
          await expect(page.locator(".menu-button")).toHaveAttribute("aria-expanded","false");
          await page.locator(".mobile-cta").click();await expect(page.locator("#project-dialog")).toBeVisible();await page.keyboard.press("Escape");
        }
        await page.evaluate(()=>{document.activeElement?.blur();scrollTo(0,0);});
        if(width===1440||width===390){
          const label=width===1440?"desktop":"mobile";
          await page.screenshot({path:path.join(checks,`${label}.png`),fullPage:true});
          await page.screenshot({path:path.join(checks,`${label}-viewport.png`)});
        }
      }
      const touch=await browser.newContext({viewport:{width:390,height:844},hasTouch:true,isMobile:true,reducedMotion:"reduce"});
      touch.on("request",request=>{requests.push({method:request.method(),url:request.url()});if(request.method()!=="GET"||!request.url().startsWith(new URL(server.url).origin))errors.push("Unexpected touch-context request");});
      touch.on("response",response=>{if(response.status()>=400)errors.push(`Touch HTTP ${response.status()}: ${response.url()}`);});
      touch.on("requestfailed",request=>errors.push(`Touch request failed: ${request.url()}`));
      const mobile=await touch.newPage();mobile.on("pageerror",error=>errors.push(error.message));
      await mobile.goto(server.url,{waitUntil:"networkidle"});
      await mobile.locator('[data-filter="Branding"]').tap();await expect(mobile.locator(".project-card")).toHaveCount(8);
      await mobile.locator(".case-open").first().tap();await expect(mobile.locator("#detail-dialog")).toBeVisible();
      await mobile.getByRole("button",{name:"Close details",exact:true}).tap();
      await mobile.locator(".mobile-cta").tap();await expect(mobile.locator("#project-dialog")).toBeVisible();
      await mobile.getByRole("button",{name:"Close project inquiry"}).tap();
      await touch.close();
    });
    await run("runtime/network integrity and final static validation",async()=>{
      assert.deepEqual(errors,[]);
      assert.ok(requests.length>30);
      assert.ok(requests.every(request=>request.method==="GET"&&request.url.startsWith(new URL(server.url).origin)));
      assert.equal(await page.evaluate(()=>localStorage.length+sessionStorage.length),0);
      assert.match(await StaticHomepage.validateStaticOutput(exported,"agency-portfolio","GPT-6"),/^[a-f0-9]{64}$/);
    });
    await context.close();
    if(completed.length===6){
      await writeFile(path.join(checks,"validation.json"),JSON.stringify({checkedAt:new Date().toISOString(),digest:await StaticHomepage.validateStaticOutput(exported,"agency-portfolio","GPT-6"),errors:[],tests:completed,testCount:6,viewports:[1440,1024,768,390,320],requests:requests.length,requestMethods:[...new Set(requests.map(request=>request.method))],externalRequests:0,storageWrites:0,screenshots:[".checks/desktop.png",".checks/mobile.png",".checks/desktop-viewport.png",".checks/mobile-viewport.png"],command:"node --test out\\pages\\031-agency-portfolio\\GPT-6\\page.test.mjs"},null,2)+"\n");
    }
  }finally{await browser?.close();await server.close();}
});
