import test from "node:test";
import assert from "node:assert/strict";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium, expect } from "@playwright/test";
import { startPreviewServer } from "../../../../src/workflows/generate-preview.mjs";
import { validateStaticOutput } from "../../../../src/workflows/render-prompt-pages.mjs";
const model = fileURLToPath(new URL(".",import.meta.url));
const workspace = fileURLToPath(new URL("../../../../",import.meta.url));
test("Vanguard Commercial independent static search", {timeout:150000}, async (t) => {
  const service = await startPreviewServer(path.join(model,"out"),{workspace});
  const browser = await chromium.launch({headless:true});
  t.after(async () => { await browser.close(); await service.close(); });
  const errors = [], requests = [];
  await mkdir(path.join(model,".checks"),{recursive:true});
  async function visit(options = {}) {
    const context = await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:"reduce",...options});
    const page = await context.newPage(); page.setDefaultTimeout(10000);
    page.on("pageerror",(error) => errors.push(error.message));
    page.on("console",(message) => { if (message.type() === "error") errors.push(message.text()); });
    page.on("requestfailed",(request) => errors.push(`Failed: ${request.url()}`));
    page.on("response",(response) => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
    await context.route("**/*",(route) => {
      requests.push({url:route.request().url(),method:route.request().method()});
      return new URL(route.request().url()).origin === new URL(service.url).origin ? route.continue() : route.abort();
    });
    await page.goto(service.url,{waitUntil:"networkidle"}); await page.evaluate(() => document.fonts.ready);
    return {page,context};
  }
  async function images(page) {
    await page.locator("img[src]").evaluateAll((list) => list.forEach((image) => { image.loading = "eager"; }));
    await page.locator("img[src]").evaluateAll((list) => Promise.all(list.map((image) => image.decode())));
  }
  async function close(page) { await page.locator("#info-dialog .close").click(); await expect(page.locator("#info-content")).toBeEmpty(); }
  async function search(page,query="",type="",transaction="") {
    await page.locator("#location").fill(query); await page.locator("#search-type").selectOption(type); await page.locator("#transaction").selectOption(transaction);
    await page.getByRole("button",{name:"Search Properties",exact:true}).click();
  }
  const valid = (input) => input.evaluate((element) => element.checkValidity());
  function future(days) { const date = new Date(); date.setDate(date.getDate()+days); return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,"0")}-${String(date.getDate()).padStart(2,"0")}`; }
  await t.test("actual subpath, local resources, all original listings and source/static agreement",async () => {
    const {page,context} = await visit();
    try {
      assert.equal(new URL(page.url()).pathname,"/pages/commercial-property-listings/GPT-6/index.html");
      await expect(page).toHaveTitle("Vanguard Commercial | A Better View of Opportunity");
      await images(page); assert.equal(await page.evaluate(() => document.fonts.check("16px Inter")),true);
      const sprite = await readFile(path.join(model,"out","assets","icons.svg"),"utf8");
      for (const id of new Set(await page.locator("use").evaluateAll((uses) => uses.map((use) => use.getAttribute("href").split("#")[1])))) assert.ok(sprite.includes(`id="${id}"`),id);
      for (const file of ["index.html","style.css","app.js"]) assert.equal(await readFile(path.join(model,file),"utf8"),await readFile(path.join(model,"out",file),"utf8"));
      assert.match(await validateStaticOutput(path.join(model,"out"),"commercial-property-listings","GPT-6"),/^[a-f0-9]{64}$/);
      assert.deepEqual(await page.locator('a[href^="#"]').evaluateAll((links) => links.filter((link) => !document.getElementById(link.hash.slice(1))).map((link) => link.hash)),[]);
      await expect(page.locator(".property-card h3")).toHaveText(["Frost Tower — Suite 2400","Domain NORTHSIDE — Retail Pad 8","East Austin Distribution Center"]);
      await expect(page.locator(".card-price strong")).toHaveText(["$52.00","$42.00","$6,750,000"]);
      await expect(page.locator(".card-price small")).toHaveText(["$54,167/month","$11,200/month","$150/SF"]);
      await expect(page.locator(".card-specs")).toHaveText([/12,500 SF.*24th Floor.*Built 2003.*Renovated 2022/,/3,200 SF.*Ground Floor.*Built 2019.*Endcap/,/45,000 SF.*24' Clear Height.*Built 2015.*4 Loading Docks/]);
      await expect(page.locator(".stat-grid strong")).toHaveText(["14.2%","$48.50/SF","+320,000SF","5.8%"]);
      await expect(page.locator("#featured-title")).toHaveText("The Austin Tech CenterFull Building");
      await expect(page.locator(".featured-description")).toContainText("500-space parking garage");
      await expect(page.locator(".license")).toContainText("License #987654");
      const download = page.waitForEvent("download");
      await page.getByRole("link",{name:"Download Full Market Report"}).click();
      const file = await download; assert.equal(file.suggestedFilename(),"austin-q1-2026-market-snapshot.txt");
      const report = await readFile(await file.path(),"utf8");
      assert.match(report,/14.2%/); assert.match(report,/not a listing offer|Not independently researched/);
      await expect(page.locator("body")).not.toContainText("019-");
      await page.locator("#contact").scrollIntoViewIfNeeded();
      assert.ok(Math.abs((await page.locator(".site-header").boundingBox()).y) < 1);
    } finally { await context.close(); }
  });
  await t.test("location autocomplete, all types and transactions, quick filters, price units, real pagination and sorting",async () => {
    const {page,context} = await visit();
    try {
      await expect(page.locator("#locations option")).toHaveCount(12);
      await search(page,"78758"); await expect(page.locator(".property-card h3")).toHaveText("Domain NORTHSIDE — Retail Pad 8");
      await search(page,"Austin","Industrial","sale"); await expect(page.locator(".property-card h3")).toHaveText("East Austin Distribution Center");
      await expect(page.locator("#price-unit")).toContainText("$500K–$50M");
      await expect(page.locator("#price-min")).toHaveValue("500000");
      await search(page,"Austin","","sublease"); await expect(page.locator("#empty-state")).toBeVisible();
      await search(page,"Dallas"); await expect(page.locator("#empty-state")).toBeVisible();
      await search(page,"Austin","Mixed-Use"); await expect(page.locator("#empty-state")).toBeVisible();
      await page.locator("#empty-state [data-clear]").click();
      await page.locator("#sort").selectOption("price-low");
      await expect(page.locator(".property-card h3")).toHaveText(["Domain NORTHSIDE — Retail Pad 8","Frost Tower — Suite 2400","East Austin Distribution Center"]);
      await page.locator("#sort").selectOption("size-high"); await expect(page.locator(".property-card h3")).toHaveText(["East Austin Distribution Center","Frost Tower — Suite 2400","Domain NORTHSIDE — Retail Pad 8"]);
      await page.locator("#page-size").selectOption("1"); await expect(page.locator("#page-summary")).toHaveText("Showing 1–1 of 3 samples");
      await page.getByRole("button",{name:"Next results page"}).click(); await expect(page.locator(".property-card h3")).toHaveText("Frost Tower — Suite 2400");
      await page.getByRole("button",{name:"Results page 3",exact:true}).click(); await expect(page.locator(".property-card h3")).toHaveText("Domain NORTHSIDE — Retail Pad 8");
      await expect(page.getByRole("button",{name:"Next results page"})).toBeDisabled();
      await page.locator("#page-size").selectOption("3");
      await page.getByRole("button",{name:"Coworking Ready",exact:true}).click(); await expect(page.locator(".property-card h3")).toHaveText("Frost Tower — Suite 2400");
      await page.getByRole("button",{name:"Remove Coworking Ready filter"}).click(); await expect(page.locator(".property-card")).toHaveCount(3);
      await page.getByRole("button",{name:"New Construction",exact:true}).click(); await expect(page.locator("#empty-state")).toBeVisible();
      await page.locator("#empty-state [data-clear]").click();
      await page.getByRole("button",{name:"Green Certified",exact:true}).click(); await expect(page.locator(".property-card")).toHaveCount(2);
      await page.getByRole("button",{name:"Green Certified",exact:true}).click();
      await page.getByRole("button",{name:"List view",exact:true}).click(); await expect(page.locator(".workspace")).toHaveAttribute("data-layout","list");
      assert.equal(await page.locator(".property-grid").evaluate((element) => getComputedStyle(element).gridTemplateColumns.split(" ").length),1);
    } finally { await context.close(); }
  });
  await t.test("all eight filter groups, paired range sliders and invalid ranges work without cross-unit price errors",async () => {
    const {page,context} = await visit();
    try {
      await expect(page.locator(".filter-group")).toHaveCount(8);
      for (const key of ["className","year","amenities","certifications","availability"]) await page.locator(`[data-group="${key}"] summary`).click();
      await page.locator('input[name="amenities"][value="Loading Docks"]').check(); await expect(page.locator(".property-card h3")).toHaveText("East Austin Distribution Center");
      await page.locator('#filter-panel [data-clear]').click();
      await page.locator('input[name="certifications"][value="WELL Building"]').check(); await expect(page.locator(".property-card h3")).toHaveText("Frost Tower — Suite 2400");
      await page.locator('#filter-panel [data-clear]').click();
      await page.locator('input[name="year"][value="2000-2010"]').check(); await expect(page.locator(".property-card h3")).toHaveText("Frost Tower — Suite 2400");
      await page.locator('#filter-panel [data-clear]').click();
      await page.locator('input[name="className"][value="B"]').check(); await expect(page.locator(".property-card")).toHaveCount(2);
      await page.locator('input[name="availability"][value="30"]').check(); await expect(page.locator(".property-card h3")).toHaveText("Domain NORTHSIDE — Retail Pad 8");
      await page.locator('#filter-panel [data-clear]').click();
      await page.locator('input[name="type"][value="Office"]').check(); await expect(page.locator(".property-card h3")).toHaveText("Frost Tower — Suite 2400");
      await page.locator('#filter-panel [data-clear]').click();
      await page.locator("#price-max").fill("45"); await page.getByRole("button",{name:"Apply Filters",exact:true}).click(); await expect(page.locator(".property-card h3")).toHaveText(["Domain NORTHSIDE — Retail Pad 8","East Austin Distribution Center"]);
      await page.locator("#price-min").fill("60"); await page.locator("#price-min").blur();
      assert.equal(await valid(page.locator("#price-min")),false);
      await expect(page.locator("#filter-error")).toContainText("minimum");
      await page.locator('#filter-panel [data-clear]').click();
      await page.locator('[data-range="size-max"]').focus(); await page.keyboard.press("Home");
      for (let step=0;step<19;step++) await page.keyboard.press("ArrowRight");
      await expect(page.locator("#size-max")).toHaveValue("10000"); await expect(page.locator(".property-card h3")).toHaveText("Domain NORTHSIDE — Retail Pad 8");
      await page.locator('#filter-panel [data-clear]').click();
      await search(page,"Austin","","sale");
      await page.locator("#price-max").fill("6000000"); await page.getByRole("button",{name:"Apply Filters",exact:true}).click(); await expect(page.locator("#empty-state")).toBeVisible();
      await page.locator('#filter-panel [data-clear]').click(); await expect(page.locator("#price-unit")).toContainText("lease samples"); await expect(page.locator(".property-card")).toHaveCount(3);
    } finally { await context.close(); }
  });
  await t.test("saved properties, all detail specs, guarded tour dates, alert and listing previews are safe, local and cleared",async () => {
    const {page,context} = await visit();
    try {
      await page.locator('[data-save="office"]').click(); await expect(page.locator('[data-save="office"]')).toHaveAttribute("aria-pressed","true");
      await page.locator("#saved-only").click(); await expect(page.locator(".property-card h3")).toHaveText("Frost Tower — Suite 2400");
      await page.locator('[data-save="office"]').click(); await expect(page.locator("#empty-state")).toBeVisible();
      await page.locator("#saved-only").click();
      for (const id of ["office","retail","industrial"]) {
        await page.locator(`[data-property-id="${id}"] [data-details]`).click();
        await expect(page.locator(".detail-table")).toContainText("Vanguard Commercial");
        await expect(page.locator("#info-content")).toContainText("unverified examples");
        await close(page);
      }
      await page.locator('[data-tour="office"]').click();
      let form = page.locator("#action-form");
      await form.locator('[name="name"]').fill('<img src=x onerror="window.unsafe=1">');
      await form.locator('[name="email"]').fill("preview@example.test");
      await form.locator('[name="date"]').fill(future(-1)); assert.equal(await valid(form.locator('[name="date"]')),false);
      await form.locator('[name="date"]').fill(future(2));
      await form.locator('[name="notes"]').fill("<script>window.unsafe=1</script>");
      await form.getByRole("button",{name:"Preview Tour Request"}).click(); await expect(form).toBeVisible();
      await form.locator('[name="consent"]').check(); await form.getByRole("button",{name:"Preview Tour Request"}).click();
      await expect(page.locator("#info-content .preview-result")).toContainText("<script>window.unsafe=1</script>"); await expect(page.locator("#info-content script,#info-content img")).toHaveCount(0);
      assert.equal(await page.evaluate(() => window.unsafe),undefined); await close(page);
      await page.getByRole("button",{name:"Save Search",exact:true}).click();
      await expect(page.locator("#saved-criteria")).toContainText("3 matching sample records");
      form = page.locator("#action-form");
      await form.locator('[name="name"]').fill("Local Guest"); await form.locator('[name="email"]').fill("preview@example.test"); await form.locator('[name="frequency"]').selectOption("Weekly"); await form.locator('[name="consent"]').check(); await form.getByRole("button",{name:"Preview Search Alert"}).click(); await expect(page.locator("#info-content .preview-result")).toContainText("Weekly search alert preview"); await close(page);
      await page.getByRole("button",{name:"List a Property",exact:true}).first().click();
      form = page.locator("#action-form"); await form.locator('[name="name"]').fill("Local Guest"); await form.locator('[name="email"]').fill("preview@example.test");
      await form.locator('[name="address"]').fill("Sample address"); await form.locator('[name="size"]').fill("1250.5"); assert.equal(await valid(form.locator('[name="size"]')),false);
      await form.locator('[name="size"]').fill("1250"); await form.locator('[name="consent"]').check(); await form.getByRole("button",{name:"Preview Listing Enquiry"}).click(); await expect(page.locator("#info-content .preview-result")).toContainText("1,250 SF"); await close(page);
      await page.getByRole("button",{name:"Schedule a Tour",exact:true}).click(); await expect(page.locator("#info-title")).toContainText("Austin Tech Center"); await close(page);
      await page.reload({waitUntil:"networkidle"}); await expect(page.locator("#saved-only")).toContainText("Saved (0)");
    } finally { await context.close(); }
  });
  await t.test("split map supports colored pins, tooltips, overlay, zoom clustering, pan, rectangular area filtering and fullscreen",async () => {
    const {page,context} = await visit();
    try {
      await page.getByRole("button",{name:"Map view",exact:true}).click(); await expect(page.locator(".map-pin")).toHaveCount(3);
      await page.locator("#map-panel").screenshot({path:path.join(model,".checks","map-1440.png")});
      for (const type of ["Office","Retail","Industrial"]) await expect(page.locator(`.map-pin[data-type="${type}"]`)).toHaveCount(1);
      await page.locator('[data-pin="office"]').hover(); await expect(page.locator("#pin-tooltip")).toContainText("12,500 SF");
      await page.locator('[data-pin="office"]').click(); await expect(page.locator("#map-selection")).toContainText("Frost Tower");
      await page.locator("#map-selection [data-details]").click(); await expect(page.locator("#info-title")).toContainText("Frost Tower"); await close(page);
      await page.getByRole("button",{name:"Close selected property"}).click();
      await page.getByRole("button",{name:"Satellite style",exact:true}).click(); await expect(page.locator("#map-panel")).toHaveClass(/satellite-style/);
      for (let step=0;step<3;step++) await page.getByRole("button",{name:"Zoom out",exact:true}).click();
      await expect(page.locator(".map-cluster")).toHaveCount(1);
      await page.locator(".map-cluster").click(); await expect(page.locator(".map-pin")).toHaveCount(3);
      await page.getByRole("button",{name:"Reset map",exact:true}).click();
      const canvas = page.locator("#map-canvas");
      await canvas.focus(); const before = await page.locator("#map-art").getAttribute("viewBox"); await page.keyboard.press("ArrowRight"); assert.notEqual(await page.locator("#map-art").getAttribute("viewBox"),before);
      const panBefore = await page.locator("#map-art").getAttribute("viewBox"), panBox = await canvas.boundingBox();
      await page.mouse.move(panBox.x+80,panBox.y+300); await page.mouse.down(); await page.mouse.move(panBox.x+120,panBox.y+320,{steps:6}); await page.mouse.up();
      assert.notEqual(await page.locator("#map-art").getAttribute("viewBox"),panBefore);
      await expect(page.getByRole("button",{name:"Search this area",exact:true})).toBeVisible();
      await page.getByRole("button",{name:"Search this area",exact:true}).click(); await expect(page.locator("#clear-area")).toBeVisible();
      await page.locator("#clear-area").click(); await page.getByRole("button",{name:"Reset map",exact:true}).click();
      await page.getByRole("button",{name:"Draw on Map",exact:true}).click(); await expect(canvas).toHaveClass(/drawing/);
      const box = await canvas.boundingBox();
      await page.mouse.move(box.x+box.width*.17,box.y+box.height*.12); await page.mouse.down(); await page.mouse.move(box.x+box.width*.4,box.y+box.height*.36,{steps:10}); await page.mouse.up();
      await expect(page.locator(".property-card h3")).toHaveText("Domain NORTHSIDE — Retail Pad 8");
      await expect(page.locator("#drawn-area")).not.toHaveAttribute("hidden","");
      await page.locator("#clear-area").click(); await expect(page.locator(".property-card")).toHaveCount(3);
      await page.getByRole("button",{name:"Draw on Map",exact:true}).click(); await page.keyboard.press("Enter"); await expect(page.locator("#clear-area")).toBeVisible();
      await page.locator("#clear-area").click();
      await page.getByRole("button",{name:"Expand map",exact:true}).click(); await expect(page.locator("body")).toHaveClass(/expanded-map/);
      await page.keyboard.press("Escape"); await expect(page.locator("body")).not.toHaveClass(/expanded-map/);
      await expect(page.getByRole("button",{name:"Expand map",exact:true})).toBeFocused();
    } finally { await context.close(); }
  });
  await t.test("all local footer and contact routes work, safe requirement previews honor multiple submarkets and clear personal fields",async () => {
    const {page,context} = await visit();
    try {
      for (const button of await page.locator("footer [data-info],#broker-profiles [data-broker],.desktop-nav [data-info],.header-actions [data-info]").all()) {
        await button.click(); await expect(page.locator("#info-dialog")).toBeVisible(); assert.ok((await page.locator("#info-content").innerText()).trim().length>40); await close(page);
      }
      for (const button of await page.locator("footer [data-property]").all()) {
        const type = await button.getAttribute("data-property"); await button.click(); await expect(page.locator("#search-type")).toHaveValue(type);
        assert.equal(await page.locator(".property-card").count(),["Office","Retail","Industrial"].includes(type) ? 1 : 0);
      }
      for (const button of await page.locator("footer [data-market]").all()) {
        const market = await button.getAttribute("data-market"); await button.click(); assert.equal(await page.locator(".property-card").count(),market==="Austin" ? 3 : 0);
      }
      const form = page.locator("#requirement-form");
      await form.locator('[name="name"]').fill('<img src=x onerror="window.unsafe=1">');
      await form.locator('[name="company"]').fill("Local Concept");
      await form.locator('[name="email"]').fill("preview@example.test"); await form.locator('[name="phone"]').fill("555-0100"); await form.locator('[name="type"]').selectOption("Industrial"); await form.locator('[name="size"]').selectOption("15,000-50,000");
      await form.locator('[name="submarket"][value="Downtown"]').check(); await form.locator('[name="submarket"][value="East Austin"]').check(); await form.locator('[name="notes"]').fill("<script>window.unsafe=1</script>");
      await form.getByRole("button",{name:"Submit Requirement"}).click(); await expect(page.locator("#requirement-result")).toContainText("Downtown, East Austin"); await expect(page.locator("#requirement-result")).toContainText("Industrial · 15,000-50,000");
      await expect(page.locator("#requirement-result img,#requirement-result script")).toHaveCount(0);
      assert.deepEqual(await form.locator("input").evaluateAll((inputs) => inputs.map((input) => input.type==="checkbox" ? input.checked : input.value)),["","","","",false,false,false,false,false]);
      await page.getByRole("button",{name:"New requirement",exact:true}).click(); await expect(page.locator("#requirement-result")).toBeEmpty(); await expect(form.locator('[name="name"]')).toBeFocused();
      assert.deepEqual(await page.evaluate(() => [localStorage.length,sessionStorage.length,document.cookie]),[0,0,""]);
    } finally { await context.close(); }
  });
  await t.test("five responsive widths, mobile filter drawer/nav/map, 44px actions and actual photo touch swipes",async () => {
    for (const width of [1440,1024,768,390,320]) {
      const {page,context} = await visit({viewport:{width,height:1000}});
      try {
        await images(page); assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),true,`Overflow ${width}`);
        if (width <= 650) {
          assert.equal(await page.locator(".property-grid").evaluate((element) => getComputedStyle(element).gridTemplateColumns.split(" ").length),1);
          await page.getByRole("button",{name:"Open navigation",exact:true}).click(); await expect(page.locator("#mobile-nav")).toBeVisible(); await page.keyboard.press("Escape"); await expect(page.locator(".nav-toggle")).toBeFocused();
          await page.getByRole("button",{name:"Open navigation",exact:true}).click(); await page.locator("#mobile-nav").getByRole("link",{name:"Properties",exact:true}).click(); await expect(page.locator(".nav-toggle")).toHaveAttribute("aria-expanded","false");
          await page.locator(".mobile-bottom [data-filters]").click(); await expect(page.locator("#filter-dialog")).toBeVisible();
          await page.locator('#filter-dialog input[name="type"][value="Retail"]').check(); await expect(page.locator(".mobile-filter .filter-count")).toHaveText("1");
          await page.getByRole("button",{name:"Apply Filters",exact:true}).click(); await expect(page.locator("#filter-dialog")).not.toBeVisible(); await expect(page.locator(".property-card h3")).toHaveText("Domain NORTHSIDE — Retail Pad 8");
          await page.locator(".mobile-bottom [data-filters]").click(); await page.locator('#filter-dialog [data-clear]').click(); await page.getByRole("button",{name:"Apply Filters",exact:true}).click();
          const tiny = await page.locator("button:visible,a:visible").evaluateAll((elements) => elements.filter((element) => element.getBoundingClientRect().height<43.9 || element.getBoundingClientRect().width<43.9).map((element) => element.textContent.trim() || element.getAttribute("aria-label")));
          assert.deepEqual(tiny,[],`Small touch targets ${width}`);
          await page.locator(".mobile-bottom [data-view=map]").click(); await expect(page.locator(".workspace")).toHaveAttribute("data-layout","map");
          const mapBox = await page.locator("#map-panel").boundingBox(); assert.ok(Math.abs(mapBox.y)<1); assert.ok(mapBox.height > 500);
          await page.getByRole("button",{name:"Expand map",exact:true}).click();
          assert.ok(Math.abs((await page.locator("#map-panel").boundingBox()).height-1000)<1);
          await page.getByRole("button",{name:"Restore map size",exact:true}).click();
          assert.ok((await page.locator("#map-panel").boundingBox()).height<700);
          if (width===390) await page.screenshot({path:path.join(model,".checks","map-390.png")});
          await page.getByRole("button",{name:"Close map",exact:true}).click(); await expect(page.locator(".workspace")).toHaveAttribute("data-layout","grid");
        }
        if (width===1440 || width===390) { await page.evaluate(() => scrollTo({top:0,behavior:"instant"})); await page.screenshot({path:path.join(model,".checks",`desktop-mobile-${width}.png`),fullPage:true}); }
      } finally { await context.close(); }
    }
    const {page,context} = await visit({viewport:{width:390,height:900},isMobile:true,hasTouch:true});
    try {
      const strip = page.locator(".photo-strip").first(); await strip.scrollIntoViewIfNeeded(); const box = await strip.boundingBox(); const cdp = await context.newCDPSession(page);
      const x = box.x+box.width-35, y = box.y+Math.min(100,box.height/2);
      await cdp.send("Input.dispatchTouchEvent",{type:"touchStart",touchPoints:[{x,y}]});
      for (let step=1;step<=8;step++) { await cdp.send("Input.dispatchTouchEvent",{type:"touchMove",touchPoints:[{x:x-step*26,y}]}); await new Promise((resolve) => setTimeout(resolve,20)); }
      await cdp.send("Input.dispatchTouchEvent",{type:"touchEnd",touchPoints:[]}); await page.waitForFunction(() => document.querySelector(".photo-strip").scrollLeft>30); await cdp.detach();
      await strip.focus(); await page.keyboard.press("ArrowLeft"); await expect.poll(() => strip.evaluate((element) => element.scrollLeft)).toBe(0);
    } finally { await context.close(); }
  });
  assert.deepEqual(errors,[]);
  assert.equal(requests.every((request) => request.method==="GET" && new URL(request.url).origin===new URL(service.url).origin),true);
  await writeFile(path.join(model,".checks","validation.json"),JSON.stringify({
    checkedAt:new Date().toISOString(),digest:await validateStaticOutput(path.join(model,"out"),"commercial-property-listings","GPT-6"),browser:browser.version(),widths:[1440,1024,768,390,320],errors,
    checks:["Actual public subpath, local font/images/sprites, source/static agreement","Original three records, prices, specs, feature, four market stats and honest downloaded report","Location/type/transaction search, all filter groups, range validation and dual slider agreement","Transaction-aware price units, size sorting, real pagination, zero states and memory-only favorites","Safe age-neutral listing/alert/tour previews, future local tour dates and contact cleanup","Schematic map: pin tooltip/overlay, clustering, zoom, keyboard pan, rectangle and visible-area filters, palette and fullscreen","Every footer/contact route, multi-submarket requirement preview and safe text rendering","Five widths, mobile nav/filter/map, actual photo touch swipe, 44px actions","Actual full-page desktop/mobile screenshots; no external calls, errors or storage"],
  },null,2)+"\n");
});
