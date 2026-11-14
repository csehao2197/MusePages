import test from "node:test";
import assert from "node:assert/strict";
import {mkdir,readFile,writeFile} from "node:fs/promises";
import {createHash} from "node:crypto";
import path from "node:path";
import {fileURLToPath} from "node:url";
import {chromium,expect} from "@playwright/test";
import {startPreviewServer} from "../../../../src/workflows/generate-preview.mjs";
import {validateStaticOutput} from "../../../../src/workflows/render-prompt-pages.mjs";
import {tracks} from "./assets/tracks.js";

const model=fileURLToPath(new URL(".",import.meta.url));
const workspace=fileURLToPath(new URL("../../../../",import.meta.url));
const checks=path.join(model,".checks");
test("KVOLT original audio portfolio", {timeout:180000}, async t => {
  const service=await startPreviewServer(path.join(model,"out"),{workspace});
  const browser=await chromium.launch();
  t.after(async()=>{await browser.close();await service.close();});
  await mkdir(checks,{recursive:true});
  let failures=0;
  const errors=[],requests=[],cancelledMedia=[];
  const check=(name,fn)=>t.test(name,async()=>{try{await fn();}catch(error){failures++;throw error;}});
  async function visit(options={}) {
    const context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:"reduce",...options});
    const page=await context.newPage();
    page.on("pageerror",error=>errors.push(String(error)));
    page.on("requestfailed",request=>{
      const failure=request.failure()?.errorText;
      if(request.url().startsWith(`blob:${new URL(service.url).origin}/`)&&failure==="net::ERR_ABORTED")cancelledMedia.push(request.url());
      else errors.push(`${request.url()}: ${failure}`);
    });
    page.on("response",response=>{if(response.status()>=400)errors.push(`${response.status()} ${response.url()}`);});
    page.on("request",request=>requests.push({method:request.method(),url:request.url()}));
    await page.goto(service.url,{waitUntil:"networkidle"});
    await page.evaluate(()=>document.fonts.ready);
    return{context,page};
  }
  async function images(page) {
    await page.locator("img[src]").evaluateAll(async elements=>{
      await Promise.all(elements.map(async image=>{image.loading="eager";await image.decode();if(!image.naturalWidth)throw Error(`Empty image ${image.src}`);}));
    });
  }

  await check("six distinct original WAV compositions, real artwork, all symbols, static source and public paths",async()=>{
    assert.equal(tracks.length,6);
    const hashes=new Set();
    for(const track of tracks) {
      const wav=await readFile(path.join(model,"assets",`${track.id}.wav`));
      assert.equal(wav.toString("ascii",0,4),"RIFF");assert.equal(wav.toString("ascii",8,12),"WAVE");
      assert.equal(wav.readUInt32LE(24),24000);assert.equal(wav.readUInt16LE(34),16);
      assert.ok(Math.abs((wav.length-44)/48000-track.duration)<.001);
      let energy=0,peak=0;for(let i=44;i<wav.length;i+=194){const sample=wav.readInt16LE(i)/32768;energy+=sample*sample;peak=Math.max(peak,Math.abs(sample));}
      assert.ok(energy>20&&peak>.5,"Preview contains non-silent musical audio");
      hashes.add(createHash("sha256").update(wav).digest("hex"));
      assert.ok((await readFile(path.join(model,"assets",`${track.id}.webp`))).length>5000);
    }
    assert.equal(hashes.size,6);
    for(const file of["index.html","style.css","app.js"])assert.deepEqual(await readFile(path.join(model,file)),await readFile(path.join(model,"out",file)));
    const {context,page}=await visit();
    try {
      await expect(page.locator(".beat-card")).toHaveCount(6);
      await expect(page.locator("#player")).toBeHidden();
      assert.equal(await page.locator("audio").evaluate(audio=>audio.paused&&audio.currentTime===0),true);
      const ids=new Set([...(await readFile(path.join(model,"assets","icons.svg"),"utf8")).matchAll(/id="([^"]+)"/g)].map(match=>match[1]));
      for(const href of await page.locator("use").evaluateAll(items=>items.map(item=>item.getAttribute("href"))))assert.ok(ids.has(href.split("#")[1]),href);
      await images(page);
      assert.ok(!(await page.content()).includes("029-music-producer-portfolio"));
      await page.screenshot({path:path.join(checks,"hero-1440.png")});
    } finally {await context.close();}
  });

  await check("actual playback of every WAV, changing audio waveform, one source, seek, volume, mute and track transport",async()=>{
    const {context,page}=await visit({reducedMotion:"no-preference"});
    try {
      for(const track of tracks) {
        await page.locator(`.beat-card [data-play="${track.id}"]`).click();
        await expect(page.locator("#player-title")).toHaveText(track.title);
        await expect.poll(()=>page.locator("#audio").evaluate(audio=>audio.currentTime)).toBeGreaterThan(.15);
        assert.ok(Math.abs(await page.locator("#audio").evaluate(audio=>audio.duration)-track.duration)<.03);
        await expect(page.locator(`.beat-card [data-play="${track.id}"]`)).toHaveAttribute("aria-label",`Pause ${track.title} preview`);
        await page.locator("#player-play").click();
        assert.equal(await page.locator("#audio").evaluate(audio=>audio.paused),true);
      }
      assert.equal(await page.locator("audio").count(),1);
      await page.locator('.beat-card [data-play="midnight-drive"]').click();
      const wave=page.locator('[data-beat="midnight-drive"] canvas');
      await page.waitForTimeout(100);
      const first=await wave.screenshot({animations:"allow"});
      await page.waitForTimeout(150);
      const second=await wave.screenshot({animations:"allow"});
      assert.notDeepEqual(first,second,"Real analyser waveform changes with the playing audio");
      await page.locator("#next-track").click();await expect(page.locator("#player-title")).toHaveText("Silk Route");
      await expect.poll(()=>page.locator("#audio").evaluate(audio=>audio.currentTime)).toBeGreaterThan(.15);
      const progress=page.locator("#progress"),box=await progress.boundingBox();
      await progress.click({position:{x:box.width*.6,y:22}});
      assert.ok(await page.locator("#audio").evaluate(audio=>audio.currentTime/audio.duration)>.4);
      await page.locator("#volume").focus();await page.keyboard.press("Home");
      assert.equal(await page.locator("#audio").evaluate(audio=>audio.volume),0);
      await page.keyboard.press("End");assert.equal(await page.locator("#audio").evaluate(audio=>audio.volume),1);
      await page.locator("#mute").click();assert.equal(await page.locator("#audio").evaluate(audio=>audio.muted),true);
      await page.locator("#mute").click();assert.equal(await page.locator("#audio").evaluate(audio=>audio.muted),false);
      await page.locator("#player-play").click();
      const paused=await page.locator("#audio").evaluate(audio=>audio.currentTime);
      await page.waitForTimeout(180);assert.equal(await page.locator("#audio").evaluate(audio=>audio.currentTime),paused);
      await page.locator("#previous-track").click();await expect(page.locator("#player-title")).toHaveText("Midnight Drive");
      assert.equal(await page.locator("#audio").evaluate(audio=>audio.paused),true);
      await page.locator("#previous-track").click();await expect(page.locator("#player-title")).toHaveText("Eastbound");
      await page.locator("#player-play").click();
      await expect.poll(()=>page.locator("#audio").evaluate(audio=>audio.currentTime)).toBeGreaterThan(.15);
      await page.locator("#progress").focus();await page.keyboard.press("End");
      await expect.poll(()=>page.locator("#audio").evaluate(audio=>audio.ended)).toBe(true);
      await expect(page.locator("#player-play")).toHaveAttribute("aria-label","Play Eastbound preview");
      await page.locator("#player-license").click();await expect(page.locator("#license-beat")).toHaveValue("eastbound");
      await page.keyboard.press("Escape");await expect(page.locator("#player-license")).toBeFocused();
      await page.screenshot({path:path.join(checks,"player-1440.png")});
    } finally {await context.close();}
  });

  await check("all license tiers and real beat selection, services, safe local inquiry, loading, validation and clearing",async()=>{
    const {context,page}=await visit();
    try {
      for(const [tier,price] of [["Basic","$29.99"],["Premium","$79.99"],["Exclusive","$499+"]]) {
        await page.locator(`[data-tier="${tier}"]`).click();
        await expect(page.locator("#license-tier")).toHaveValue(tier);
        await expect(page.locator("#license-summary")).toContainText(price);
        await page.locator("#license-beat").selectOption("blue-hour");
        await expect(page.locator("#license-summary")).toContainText("BLUE HOUR");
        await page.screenshot({path:path.join(checks,`license-${tier.toLowerCase()}-1440.png`)});
        await page.locator("#request-license").click();
        await expect(page.locator('[name=service]')).toHaveValue("Beat License");
        await expect(page.locator('[name=message]')).toHaveValue(new RegExp(`${tier} license for Blue Hour`));
        await expect(page.locator('#contact-form [name=name]')).toBeFocused();
      }
      for(const service of["Studio Session","Custom Production","Mixing & Mastering","Sync Licensing"]) {
        await page.locator(`[data-service="${service}"]`).first().click();
        await expect(page.locator("[name=service]")).toHaveValue(service);
      }
      await page.locator('#contact-form [name=name]').fill(" ");
      await page.locator('#contact-form [name=email]').fill("reader@example.com");
      await page.locator("[name=budget]").selectOption("Under $500");
      await page.locator("[name=message]").fill("                        ");
      await page.locator('#contact-form [type=submit]').click();
      await expect(page.locator("#receipt")).toBeHidden();
      assert.equal(await page.locator('#contact-form [name=name]').evaluate(input=>input.checkValidity()),false);
      await page.locator('#contact-form [name=name]').fill("<svg onload=alert(1)>");
      await page.locator("[name=message]").fill("An original cinematic track for our independent short film.");
      await page.locator("[name=reference]").fill("ftp://example.com/demo");
      await page.locator('#contact-form [type=submit]').click();
      assert.equal(await page.locator("[name=reference]").evaluate(input=>input.checkValidity()),false);
      await page.locator("[name=reference]").fill("https://example.com/reference");
      await page.locator('#contact-form [type=submit]').click();
      await expect(page.locator('#contact-form [type=submit]')).toHaveAttribute("aria-busy","true");
      await expect(page.locator("#receipt")).toBeVisible();
      await expect(page.locator("#receipt-text")).toContainText("<svg onload=alert(1)>");
      await expect(page.locator("#receipt svg")).toHaveCount(0);
      await expect(page.locator("#form-status")).toContainText("Nothing has been sent");
      await page.screenshot({path:path.join(checks,"inquiry-1440.png")});
      await page.locator("#clear-draft").click();
      await expect(page.locator('#contact-form [name=email]')).toHaveValue("");
      await expect(page.locator("#receipt-text")).toHaveText("");
      assert.equal(await page.evaluate(()=>localStorage.length+sessionStorage.length),0);
    } finally {await context.close();}
  });

  await check("complete beat catalog, reference discography, legal dialogs, focus restoration and honest newsletter",async()=>{
    const {context,page}=await visit();
    try {
      await page.locator("#open-catalog").click();await expect(page.locator("#catalog-list .catalog-item")).toHaveCount(6);
      await page.locator('#catalog-list [data-play="no-signal"]').click();
      await expect(page.locator("#player-title")).toHaveText("No Signal");
      await page.locator('#catalog-list [data-license="no-signal"]').click();
      await expect(page.locator("#license-beat")).toHaveValue("no-signal");
      await page.keyboard.press("Escape");await expect(page.locator("#open-catalog")).toBeFocused();
      await page.locator("#player-play").click();
      await page.locator("#open-credits").click();await expect(page.locator(".reference-item")).toHaveCount(6);
      await expect(page.locator("#credits-dialog")).toContainText(/not verified/i);
      await page.keyboard.press("Escape");await expect(page.locator("#open-credits")).toBeFocused();
      await expect(page.locator(".credit-overlay a")).toHaveCount(12);
      assert.ok((await page.locator(".credit-overlay a").evaluateAll(links=>links.map(link=>link.href))).every(href=>href.includes("search")));
      for(const policy of ["terms","license","privacy","refund"]) {
        await page.locator(`[data-policy="${policy}"]`).click();await expect(page.locator("#policy-content")).not.toBeEmpty();
        await page.keyboard.press("Escape");await expect(page.locator(`[data-policy="${policy}"]`)).toBeFocused();
      }
      await page.locator("#newsletter-email").fill("reader@example.com");
      await page.locator("#newsletter [type=submit]").click();
      await expect(page.locator("#newsletter-status")).toContainText("No subscription was created");
      await expect(page.locator("#newsletter-email")).toHaveValue("");
      await page.locator("#about").scrollIntoViewIfNeeded();
      await page.screenshot({path:path.join(checks,"about-1440.png")});
    } finally {await context.close();}
  });

  await check("five viewport widths, real phone menu and inert focus boundaries, native discography swipe and mobile audio",async()=>{
    for(const width of[1440,1024,768,390,320]) {
      const phone=width<700;
      const {context,page}=await visit({viewport:{width,height:1000},isMobile:phone,hasTouch:phone});
      try {
        await images(page);
        assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth)<=width+1,`Body overflow at ${width}`);
        const columns=await page.locator("#beat-grid").evaluate(grid=>getComputedStyle(grid).gridTemplateColumns.split(" ").length);
        assert.equal(columns,width>1000?3:width>700?2:1);
        if(width===1440||width===390)await page.screenshot({path:path.join(checks,`homepage-${width}.png`)});
        if(phone) {
          await page.locator("#menu").tap();await expect(page.locator("#menu")).toHaveAttribute("aria-expanded","true");
          assert.equal(await page.locator("main").evaluate(main=>main.inert),true);
          await page.keyboard.press("Shift+Tab");await expect(page.locator("#menu")).toBeFocused();
          await page.keyboard.press("Escape");await expect(page.locator("#menu")).toBeFocused();
          assert.equal(await page.locator("main").evaluate(main=>main.inert),false);
          const basic=await page.locator('[data-tier="Basic"]').boundingBox(),premium=await page.locator('[data-tier="Premium"]').boundingBox();
          assert.ok(premium.y<basic.y,"Premium appears first on mobile");
        }
        if(width===390) {
          await page.locator('.beat-card [data-play="midnight-drive"]').tap();
          await expect.poll(()=>page.locator("#audio").evaluate(audio=>audio.currentTime)).toBeGreaterThan(.15);
          await page.screenshot({path:path.join(checks,"player-390.png")});
          await page.locator("#player-license").tap();await expect(page.locator("#license-beat")).toHaveValue("midnight-drive");
          await page.screenshot({path:path.join(checks,"license-390.png")});
          await page.keyboard.press("Escape");
          await page.locator("#player-play").tap();
          await page.locator("#credits").scrollIntoViewIfNeeded();
          const area=await page.locator("#credits").boundingBox(),session=await context.newCDPSession(page);
          const y=Math.min(800,Math.max(150,area.y+100));
          await session.send("Input.dispatchTouchEvent",{type:"touchStart",touchPoints:[{x:320,y}]});
          for(let x=300;x>=80;x-=20)await session.send("Input.dispatchTouchEvent",{type:"touchMove",touchPoints:[{x,y}]});
          await session.send("Input.dispatchTouchEvent",{type:"touchEnd",touchPoints:[]});
          await expect.poll(()=>page.locator("#credits").evaluate(element=>element.scrollLeft)).toBeGreaterThan(40);
          await session.detach();
          await page.screenshot({path:path.join(checks,"discography-390.png")});
          assert.equal(await page.locator("#hero-photo").evaluate(image=>getComputedStyle(image).animationName),"none");
        }
      } finally {await context.close();}
    }
  });
  assert.equal(failures,0);
  assert.deepEqual(errors,[]);
  const origin=new URL(service.url).origin;
  assert.ok(requests.every(request=>request.method==="GET"&&(request.url.startsWith(origin)||request.url.startsWith(`blob:${origin}/`))),"Only same-origin static requests and locally created audio blobs");
  const digest=await validateStaticOutput(path.join(model,"out"),"music-producer-portfolio","GPT-6");
  await writeFile(path.join(checks,"validation.json"),JSON.stringify({checkedAt:new Date().toISOString(),digest,errors,requests:requests.length,cancelledLocalMedia:cancelledMedia.length,checks:["six distinct non-silent original WAV compositions","actual playback of all six files and changing analyser pixels","seek, pause, volume, mute, previous/next, ended state and persistent licensing","all sample tiers, selection and local inquiry","catalog, reference discography, legal notes and newsletter","five widths, real touch swipe and mobile player"]},null,2)+"\n");
});
