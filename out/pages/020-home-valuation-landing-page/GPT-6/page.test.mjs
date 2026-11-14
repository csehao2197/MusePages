import test from "node:test";
import assert from "node:assert/strict";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium, expect } from "@playwright/test";
import { startPreviewServer } from "../../../../src/workflows/generate-preview.mjs";
import { StaticHomepage } from "../../../../src/workflows/render-prompt-page.mjs";
const model = fileURLToPath(new URL(".",import.meta.url));
const workspace = fileURLToPath(new URL("../../../../",import.meta.url));
test("Keystone independent static home valuation",{timeout:150000},async (t) => {
  const service = await startPreviewServer(path.join(model,"out"),{workspace});
  const browser = await chromium.launch({headless:true});
  t.after(async () => { await browser.close(); await service.close(); });
  const errors = [], requests = [];
  await mkdir(path.join(model,".checks"),{recursive:true});
  async function visit(options = {}) {
    const context = await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:"reduce",...options});
    const page = await context.newPage(); page.setDefaultTimeout(10000);
    page.on("pageerror",(error) => errors.push(error.message));
    page.on("console",(message) => { if (message.type()==="error") errors.push(message.text()); });
    page.on("requestfailed",(request) => errors.push(`Failed: ${request.url()}`));
    page.on("response",(response) => { if (response.status()>=400) errors.push(`${response.status()} ${response.url()}`); });
    await context.route("**/*",(route) => {
      requests.push({url:route.request().url(),method:route.request().method()});
      return new URL(route.request().url()).origin===new URL(service.url).origin ? route.continue() : route.abort();
    });
    await page.goto(service.url,{waitUntil:"networkidle"}); await page.evaluate(() => document.fonts.ready);
    return {page,context};
  }
  async function images(page) {
    await page.locator("img[src]").evaluateAll((list) => list.forEach((image) => { image.loading="eager"; }));
    await page.locator("img[src]").evaluateAll((list) => Promise.all(list.map((image) => image.decode())));
  }
  const valid = (locator) => locator.evaluate((node) => node.checkValidity());
  async function close(page) { await page.getByRole("button",{name:"Close information",exact:true}).click(); await expect(page.locator("#info-content")).toBeEmpty(); }
  async function estimate(page,value,footer=false) {
    const form = page.locator(footer ? "#footer-address-form" : "#hero-address-form");
    await form.locator("input").fill(value); await form.getByRole("button",{name:"Get My Estimate",exact:true}).click();
  }
  await t.test("real public subpath, local font/images/icons and independent export",async () => {
    const {page,context} = await visit();
    try {
      assert.equal(new URL(page.url()).pathname,"/pages/home-valuation-landing-page/GPT-6/index.html");
      await expect(page).toHaveTitle("Keystone Realty Group | A Clearer Picture of Home");
      await images(page); assert.equal(await page.evaluate(() => document.fonts.check('16px "DM Sans"')),true);
      for (const file of ["index.html","style.css","app.js"]) assert.equal(await readFile(path.join(model,file),"utf8"),await readFile(path.join(model,"out",file),"utf8"));
      const sprite = await readFile(path.join(model,"out","assets","icons.svg"),"utf8");
      for (const id of new Set(await page.locator("use").evaluateAll((uses) => uses.map((use) => use.getAttribute("href").split("#")[1])))) assert.ok(sprite.includes(`id="${id}"`),id);
      assert.deepEqual(await page.locator('a[href^="#"]').evaluateAll((links) => links.filter((link) => !document.getElementById(link.hash.slice(1))).map((link) => link.hash)),[]);
      assert.match(await StaticHomepage.validateStaticOutput(path.join(model,"out"),"home-valuation-landing-page","GPT-6"),/^[a-f0-9]{64}$/);
      await expect(page.locator("h1")).toHaveText("What's Your Home Worth?");
      await expect(page.locator(".steps li")).toHaveCount(3); await expect(page.locator(".review-card")).toHaveCount(3);
      assert.equal(await page.evaluate(() => localStorage.length+sessionStorage.length),0);
    } finally { await context.close(); }
  });
  await t.test("both address forms offer keyboard/pointer autocomplete and honest sample/unknown results without sign-up",async () => {
    const {page,context} = await visit();
    try {
      const hero = page.locator("#hero-address");
      await hero.fill("Evergreen"); await expect(hero).toHaveAttribute("aria-expanded","true");
      await expect(page.locator("#hero-suggestions").getByRole("option")).toContainText("Illustrative sample address");
      await hero.press("ArrowDown"); await expect(hero).toHaveAttribute("aria-activedescendant","hero-address-sample");
      await hero.press("Enter"); await expect(hero).toHaveValue("742 Evergreen Terrace, Springfield");
      await expect(hero).toHaveAttribute("aria-expanded","false"); await expect(page.locator("#property-address")).toHaveValue("742 Evergreen Terrace, Springfield");
      await hero.press("Enter"); await expect(page.locator("#estimate-result")).toContainText("Your sample report is ready.");
      await expect(page.locator("#estimate-result")).toContainText("not a live estimate");
      await page.getByRole("button",{name:"Dismiss estimate result",exact:true}).click(); await expect(hero).toBeFocused();
      await hero.fill("Spring"); await hero.press("Escape"); await expect(hero).toHaveAttribute("aria-expanded","false");
      await hero.fill("742"); await page.locator("#hero-suggestions").getByRole("option").click(); await expect(hero).toHaveValue("742 Evergreen Terrace, Springfield");
      await estimate(page,"742 Evergreen Terrace",true); await expect(page.locator("#estimate-result")).toContainText("Your sample report is ready.");
      const malicious = '<img src=x onerror="window.pwned=1"> Unknown Road';
      await estimate(page,malicious,true); await expect(page.locator("#estimate-result")).toContainText(malicious);
      await expect(page.locator("#estimate-result")).toContainText("No property data was fetched");
      await expect(page.locator("#estimate-result img")).toHaveCount(0); assert.equal(await page.evaluate(() => window.pwned),undefined);
      await expect(page.locator("#property-address")).toHaveValue(malicious);
      await page.getByRole("button",{name:"Preview a Free CMA",exact:true}).click(); await expect(page.locator("#property-address")).toBeFocused();
      await estimate(page,"    "); assert.equal(await valid(hero),false);
      await page.getByRole("button",{name:"Try the sample address",exact:true}).click();
      await expect(page.locator("#estimate-result")).toContainText("Your sample report is ready.");
      await hero.fill("Unknown Place"); assert.equal(await valid(hero),true);
      await page.getByRole("button",{name:"Try the sample address",exact:true}).click(); await expect(page.locator("#estimate-result")).toContainText("Your sample report is ready.");
    } finally { await context.close(); }
  });
  await t.test("original sample, comparable sales and snapshot remain intact; chart and exclusive FAQ respond to real keyboard input",async () => {
    const {page,context} = await visit();
    try {
      await expect(page.locator(".report-value strong")).toHaveText("$485,000 – $520,000");
      await expect(page.locator(".property-factors dd")).toHaveText(["4","2.5","2,100","0.28 acres","1998","2-car"]);
      await expect(page.locator(".comparables tbody tr")).toHaveText([/738 Evergreen Terrace.*\$498,000.*Jan 2026/,/801 Oak Avenue.*\$512,000.*Feb 2026/,/655 Maple Drive.*\$475,000.*Dec 2025/]);
      await expect(page.locator(".market-stats strong")).toHaveText(["$472,000","18 days","342","$228"]);
      await expect(page.locator(".report-trend strong")).toHaveText("6.2%"); await expect(page.locator(".source-note")).toContainText("no live MLS feed");
      const range = page.locator("#market-month"); await range.focus(); await range.press("Home");
      await expect(page.locator("#market-point")).toHaveText("April 2025 · $448,000");
      await range.press("ArrowRight"); await expect(page.locator("#market-point")).toHaveText("May 2025 · $450,000");
      await range.press("End"); await expect(page.locator("#market-point")).toHaveText("March 2026 · $472,000");
      const box = await page.locator("#market-chart").boundingBox(); await page.mouse.move(box.x+box.width*.5,box.y+40);
      await expect(page.locator("#market-point")).toContainText("2025");
      const summaries = page.locator(".faq-list summary");
      for (let index=0;index<5;index++) {
        await summaries.nth(index).focus(); await page.keyboard.press("Enter");
        await expect(page.locator(".faq-list details[open]")).toHaveCount(1);
        await expect(page.locator(".faq-list details").nth(index)).toHaveAttribute("open","");
      }
      await expect(page.locator(".faq-list details[open]")).toContainText("no submission or agent connection");
      await summaries.last().press("Space"); await expect(page.locator(".faq-list details[open]")).toHaveCount(0);
    } finally { await context.close(); }
  });
  await t.test("CMA prefill, required fields, phone/email/consent guards, safe preview and personal-field cleanup",async () => {
    const {page,context} = await visit();
    try {
      await estimate(page,"742 Evergreen Terrace");
      const form = page.locator("#cma-form");
      await expect(page.locator("#property-address")).toHaveValue("742 Evergreen Terrace, Springfield");
      await form.getByRole("button",{name:"Request Free CMA",exact:true}).click(); await expect(page.locator("#info-dialog")).not.toBeVisible();
      await page.locator("#full-name").fill("   "); assert.equal(await valid(page.locator("#full-name")),false);
      const payload = '<svg onload="window.pwned=2">Local preview</svg>';
      await page.locator("#full-name").fill(payload); await page.locator("#email").fill("not-email");
      assert.equal(await valid(page.locator("#email")),false); await page.locator("#email").fill("review@example.invalid");
      for (const phone of ["abc1234567","123","1234567890123456"]) { await page.locator("#phone").fill(phone); assert.equal(await valid(page.locator("#phone")),false); }
      await page.locator("#phone").fill("(555) 329-8100"); assert.equal(await valid(page.locator("#phone")),true);
      await page.locator("#property-address").fill("   "); assert.equal(await valid(page.locator("#property-address")),false);
      await page.locator("#property-address").fill(payload);
      await expect(page.locator("#selling-time option")).toHaveText(["Just curious","0–3 months","3–6 months","6–12 months","Not selling"]);
      await page.locator("#selling-time").selectOption("6–12 months"); await page.locator("#message").fill(payload);
      await form.getByRole("button",{name:"Request Free CMA",exact:true}).click(); await expect(page.locator("#info-dialog")).not.toBeVisible();
      await form.locator('[name="consent"]').check(); await form.getByRole("button",{name:"Request Free CMA",exact:true}).click();
      await expect(page.locator("#info-title")).toHaveText("Your local CMA request preview");
      await expect(page.locator("#info-content")).toContainText("Nothing was sent");
      await expect(page.locator(".preview-list dd")).toHaveText([payload,"review@example.invalid","(555) 329-8100",payload,"6–12 months",payload]);
      await expect(page.locator("#info-content svg")).toHaveCount(0); assert.equal(await page.evaluate(() => window.pwned),undefined);
      for (const selector of ["#full-name","#email","#phone","#property-address","#message","#hero-address","#footer-address"]) await expect(page.locator(selector)).toHaveValue("");
      await expect(form.locator('[name="consent"]')).not.toBeChecked(); await expect(page.locator("#estimate-result")).toBeEmpty();
      await page.keyboard.press("Escape"); await expect(page.locator("#info-content")).toBeEmpty();
      await expect(form.getByRole("button",{name:"Request Free CMA",exact:true})).toBeFocused();
      assert.deepEqual(await page.evaluate(() => [localStorage.length,sessionStorage.length,document.cookie]),[0,0,""]);
    } finally { await context.close(); }
  });
  await t.test("editable mortgage calculation handles interest, zero interest, full down payment and invalid terms",async () => {
    const {page,context} = await visit();
    try {
      await page.getByRole("button",{name:"Mortgage Calculator",exact:true}).click();
      const form = page.locator(".calculator"), output = page.locator(".calculator-output");
      const set = async (name,value) => page.locator(`#calc-${name}`).fill(String(value));
      const calculate = () => form.getByRole("button",{name:"Calculate payment",exact:true}).click();
      await calculate(); await expect(output).toContainText("Loan amount $377,600"); await expect(output).toContainText("360 monthly payments");
      await set("price",1200); await set("down",0); await set("rate",12); await set("years",1); await calculate(); await expect(output.locator("strong")).toHaveText("$106.62");
      await set("price",120000); await set("down",20000); await set("rate",0); await set("years",20); await calculate(); await expect(output.locator("strong")).toHaveText("$416.67");
      await set("down",120000); await calculate(); await expect(output.locator("strong")).toHaveText("$0.00");
      await set("down",120001); assert.equal(await valid(page.locator("#calc-down")),false); await expect(output).toBeHidden();
      await set("down",0); await set("years",1.5); assert.equal(await valid(page.locator("#calc-years")),false); await calculate(); await expect(output).toBeHidden();
      await set("years",30); await set("rate",-1); assert.equal(await valid(page.locator("#calc-rate")),false);
      await set("rate",31); assert.equal(await valid(page.locator("#calc-rate")),false);
      await set("rate",6.5); await set("price",0); assert.equal(await valid(page.locator("#calc-price")),false);
      await close(page); await expect(page.locator(".calculator")).toHaveCount(0);
    } finally { await context.close(); }
  });
  await t.test("all footer/social/phone information actions work without unrelated external destinations",async () => {
    const {page,context} = await visit();
    try {
      const keys = await page.locator("[data-panel]").evaluateAll((nodes) => nodes.map((node) => node.dataset.panel));
      for (const key of keys) {
        await page.locator(`[data-panel="${key}"]`).click();
        await expect(page.locator("#info-dialog")).toBeVisible();
        await expect(page.locator("#info-content>p")).not.toBeEmpty();
        await close(page);
      }
      await page.locator('[data-panel="phone"]').click();
      await expect(page.locator("#info-content")).toContainText("(555) 329-8100");
      await page.getByRole("button",{name:"Explore the local CMA preview",exact:true}).click();
      await expect(page.locator("#info-dialog")).not.toBeVisible(); await expect(page.locator("#full-name")).toBeFocused();
      await page.locator(".report-intro .focus-estimate").click(); await expect(page.locator("#hero-address")).toBeFocused();
      await expect(page.locator('a[href^="http"],a[href^="mailto:"],a[href^="tel:"]')).toHaveCount(0);
    } finally { await context.close(); }
  });
  await t.test("five widths, mobile navigation/floating CTA, stacked inputs, scrolling report and 44px actions",async () => {
    for (const width of [1440,1024,768,390,320]) {
      const {page,context} = await visit({viewport:{width,height:1000},hasTouch:width<651,isMobile:width<651});
      try {
        await images(page);
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth<=innerWidth),`overflow at ${width}`);
        if (width<651) {
          for (const node of await page.locator("button,a").all()) {
            if (!await node.isVisible()) continue;
            const box = await node.boundingBox();
            assert.ok(box.width>=43.9 && box.height>=43.9,`small action at ${width}: ${await node.textContent()} ${box.width}x${box.height}`);
          }
          await page.getByRole("button",{name:"Open navigation",exact:true}).click(); await expect(page.locator(".mobile-menu")).toHaveAttribute("aria-expanded","true");
          await page.locator("#nav-dialog a").filter({hasText:"Sample report"}).click(); await expect(page.locator("#nav-dialog")).not.toBeVisible();
          await expect(page.locator(".mobile-menu")).toHaveAttribute("aria-expanded","false");
          await page.getByRole("button",{name:"Get Your Estimate",exact:true}).click(); await expect(page.locator("#hero-address")).toBeFocused();
          const inputBox = await page.locator("#hero-address").boundingBox(), buttonBox = await page.locator("#hero-address-form button").boundingBox();
          assert.ok(buttonBox.y>=inputBox.y+inputBox.height);
          await page.locator("#hero-address").fill("Evergreen"); await page.locator("#hero-suggestions").getByRole("option").tap();
          await expect(page.locator("#hero-address")).toHaveValue("742 Evergreen Terrace, Springfield");
          await page.locator("#hero-address").fill(""); await page.locator("#hero-address").blur();
          const table = page.locator(".table-scroll"); assert.ok(await table.evaluate((node) => node.scrollWidth>=node.clientWidth));
          if (width===320) {
            await table.scrollIntoViewIfNeeded();
            const box = await table.boundingBox(), session = await context.newCDPSession(page);
            await session.send("Input.dispatchTouchEvent",{type:"touchStart",touchPoints:[{x:box.x+box.width*.85,y:box.y+box.height*.5}]});
            for (let step=1;step<=8;step++) {
              await session.send("Input.dispatchTouchEvent",{type:"touchMove",touchPoints:[{x:box.x+box.width*(.85-step*.075),y:box.y+box.height*.5}]});
              await new Promise((resolve) => setTimeout(resolve,20));
            }
            await session.send("Input.dispatchTouchEvent",{type:"touchEnd",touchPoints:[]});
            await expect.poll(() => table.evaluate((node) => node.scrollLeft)).toBeGreaterThan(0);
            await session.detach();
          }
        }
        if ([1440,390].includes(width)) {
          await page.evaluate(() => scrollTo(0,0));
          await page.screenshot({path:path.join(model,".checks",`desktop-mobile-${width}.png`),fullPage:true});
        }
      } finally { await context.close(); }
    }
  });
  assert.deepEqual(errors,[]);
  assert.ok(requests.length>0 && requests.every((request) => new URL(request.url).origin===new URL(service.url).origin && request.method==="GET"));
  await writeFile(path.join(model,".checks","validation.json"),JSON.stringify({
    checkedAt:new Date().toISOString(),digest:await StaticHomepage.validateStaticOutput(path.join(model,"out"),"home-valuation-landing-page","GPT-6"),
    widths:[1440,1024,768,390,320],browser:"Playwright Chromium",errors,
    checks:["Independent unnumbered public subpath; local DM Sans, images and SVG icons; source/export match","Both autocomplete inputs support keyboard and pointer; sample address report and unknown-address honesty; safe text and CMA prefill","Original sample range/specs/comparables, market stats, actual chart keyboard/hover and mutually exclusive FAQ","Required/email/phone/consent guards; safe CMA preview; reset fields, Escape cleanup, focus restoration; no storage","Editable amortization; interest, zero-interest and full-down-payment boundaries; invalid down payment/rate/term/price guards","All footer, social and phone information routes; genuine local calculator; no unrelated external destinations","Five widths, mobile navigation/floating estimate and stacked address forms; narrow report scroll; 44px buttons/links","All runtime requests local GET; no page/console/resource errors; actual desktop/mobile full-page screenshots"],
  },null,2)+"\n");
});
