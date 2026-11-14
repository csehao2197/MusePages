import test from "node:test";
import assert from "node:assert/strict";
import {mkdir,readFile,writeFile} from "node:fs/promises";
import path from "node:path";
import {fileURLToPath} from "node:url";
import {chromium,expect} from "@playwright/test";
import {startPreviewServer} from "../../../../src/workflows/generate-preview.mjs";
import { StaticHomepage } from "../../../../src/workflows/render-prompt-page.mjs";
const model=fileURLToPath(new URL(".",import.meta.url)),workspace=fileURLToPath(new URL("../../../../",import.meta.url)),checks=path.join(model,".checks");
test("Alder independent immersive virtual-property tour",{timeout:240000},async(t)=>{
 const service=await startPreviewServer(path.join(model,"out"),{workspace}),browser=await chromium.launch();
 t.after(async()=>{await browser.close();await service.close();});await mkdir(checks,{recursive:true});
 const errors=[],requests=[];let failures=0;
 const check=(name,fn)=>t.test(name,async()=>{try{await fn();}catch(error){failures++;throw error;}});
 async function visit(options={},init){
  const context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:"no-preference",...options}),page=await context.newPage();page.setDefaultTimeout(10000);
  if(init)await context.addInitScript(init);
  page.on("pageerror",e=>errors.push(e.message));page.on("console",m=>{if(m.type()==="error")errors.push(m.text());});page.on("requestfailed",r=>{if(!r.failure()?.errorText.includes("ERR_ABORTED"))errors.push(`${r.url()}: ${r.failure()?.errorText}`);});page.on("response",r=>{if(r.status()>=400)errors.push(`${r.status()} ${r.url()}`);});
  await context.route("**/*",route=>{const r=route.request();requests.push({url:r.url(),method:r.method()});return new URL(r.url()).origin===new URL(service.url).origin?route.continue():route.abort();});
  await page.goto(service.url,{waitUntil:"networkidle"});await ready(page);await page.evaluate(()=>document.fonts.ready);return{context,page};
 }
 async function ready(page,id){await expect(page.locator("#panorama")).toHaveAttribute("data-ready","true");if(id)await expect(page.locator("#panorama")).toHaveAttribute("data-room",id);}
 const number=(page,name,selector="#panorama")=>page.locator(selector).evaluate((el,n)=>Number(el.dataset[n]),name);
 async function panel(page,name){await page.locator(`[data-panel="${name}"]:visible`).first().click();await expect(page.locator("#drawer")).toBeVisible();}
 async function close(page){await page.keyboard.press("Escape");}
 await check("actual WebGL texture, complete static subpath and assets, projection, drag, wheel, buttons, keyboard and fullscreen",async()=>{
  const{context,page}=await visit();try{
   assert.equal(new URL(page.url()).pathname,"/pages/virtual-property-tour/GPT-6/index.html");await expect(page).toHaveTitle("The Alder House | A Different Perspective");await expect(page.locator("#panorama")).toHaveAttribute("data-renderer","webgl");await expect(page.locator(".room-thumb")).toHaveCount(4);await expect(page.locator("#fallback")).toBeHidden();
   const colors=await page.locator("#panorama").evaluate(c=>{const g=c.getContext("webgl"),p=new Uint8Array(32*32*4);g.readPixels(Math.floor(c.width/2),Math.floor(c.height/2),32,32,g.RGBA,g.UNSIGNED_BYTE,p);return new Set([...p]).size;});assert.ok(colors>20,"A textured scene, not a flat clear color");
   const before=await page.locator("#panorama").evaluate(c=>c.toDataURL());await page.locator("#panorama").focus();await page.keyboard.press("ArrowRight");assert.equal(await number(page,"yaw"),53);assert.notEqual(before,await page.locator("#panorama").evaluate(c=>c.toDataURL()));
   await page.keyboard.press("+");assert.equal(await number(page,"fov"),60);await page.locator("#zoom-out").click();assert.equal(await number(page,"fov"),65);
   await page.mouse.move(660,350);await page.mouse.down();await page.mouse.move(820,380,{steps:6});await page.mouse.up();assert.notEqual(await number(page,"yaw"),53);
   await page.mouse.move(600,300);await page.mouse.wheel(0,-100);await expect.poll(()=>number(page,"fov")).toBe(61);
   await page.locator("#reset").click();assert.equal(await number(page,"yaw"),45);assert.equal(await number(page,"pitch"),0);assert.equal(await number(page,"fov"),65);
   await page.locator("#auto-rotate").click();await expect(page.locator("#auto-rotate")).toHaveAttribute("aria-pressed","true");await expect.poll(()=>number(page,"yaw")).toBeGreaterThan(46);await page.locator("#auto-rotate").click();
   await page.locator("#fullscreen").click();await expect.poll(()=>page.evaluate(()=>!!document.fullscreenElement)).toBe(true);await page.locator("#fullscreen").click();await expect.poll(()=>page.evaluate(()=>!!document.fullscreenElement)).toBe(false);
   for(const file of["index.html","style.css","app.js"])assert.equal(await readFile(path.join(model,file),"utf8"),await readFile(path.join(model,"out",file),"utf8"));
   const sprite=await readFile(path.join(model,"assets","icons.svg"),"utf8");for(const id of new Set(await page.locator("use").evaluateAll(uses=>uses.map(u=>u.getAttribute("href").split("#")[1]))))assert.ok(sprite.includes(`id="${id}"`),id);
   await page.screenshot({path:path.join(checks,"desktop-1440.png")});
  }finally{await context.close();}
 });
 await check("four rooms, URL state, synchronous plan and thumbnails, all hotspot kinds, guided autoplay and transcript",async()=>{
  const{context,page}=await visit();try{
   const ids=["living-room","kitchen","primary-bedroom","studio"];for(let i=0;i<4;i++){await page.locator(".room-thumb").nth(i).click();await ready(page,ids[i]);await expect(page.locator(".room-thumb").nth(i)).toHaveAttribute("aria-current","true");await expect(page.locator("#minimap .plan-room").nth(i)).toHaveAttribute("aria-current","true");assert.equal(new URL(page.url()).hash,`#room=${ids[i]}`);}
   await page.locator('#minimap [data-room="0"]').click();await ready(page,"living-room");await page.locator('[data-point="0"]').click();await expect(page.locator("#hotspot-title")).toHaveText("Hardwood floors throughout");await expect(page.locator("#hotspot-body")).toContainText("shows carpet");await page.locator("#panorama").click({position:{x:120,y:250}});await expect(page.locator("#hotspot-card")).toBeHidden();
   await panel(page,"room");await expect(page.locator(".panel-gallery .photo-button")).toHaveCount(4);await page.locator('[data-panel-point="1"]').click();await expect(page.locator("#hotspot-title")).toHaveText("Custom built-in shelving");await close(page);
   await panel(page,"room");await page.locator('[data-panel-point="2"]').click();await expect(page.locator("#hotspot-title")).toHaveText("New HVAC system (2023)");await close(page);
   await panel(page,"room");await page.locator('[data-panel-point="5"]').click();await expect(page.locator("#hotspot-link")).toHaveAttribute("href","https://www.energystar.gov/products/heating_cooling");await close(page);
   await panel(page,"room");await page.locator('[data-panel-point="3"]').click();await ready(page,"kitchen");
   await panel(page,"floorplan");await expect(page.locator(".large-plan .plan-room")).toHaveCount(4);await page.locator('.large-plan [data-room="2"]').click();await ready(page,"primary-bedroom");
   await page.locator("#play").click();await expect(page.locator("#play")).toHaveAttribute("aria-pressed","true");await expect(page.locator("#narration")).toHaveAttribute("aria-pressed","false");await expect.poll(()=>page.locator("#panorama").getAttribute("data-room"),{timeout:15000}).toBe("studio");await ready(page);await page.locator("#play").click();await expect(page.locator("#play")).toHaveAttribute("aria-pressed","false");
   await page.locator('[data-panel="transcript"]').click();await expect(page.locator(".transcript-item")).toHaveCount(4);await expect(page.locator("#drawer-content")).toContainText("local English system voice");await close(page);
   await page.locator("#next-room").click();await ready(page,"living-room");await page.locator("#previous-room").click();await ready(page,"studio");
  }finally{await context.close();}
 });
 await check("schematic Euclidean measurement, sofa dimensions, rotation, drag, invalid input and independent comparison cameras",async()=>{
  const{context,page}=await visit();try{
   await panel(page,"settings");await page.locator('[data-panel="measure"]').click();await expect(page.locator("#drawer-title")).toHaveText("Will your couch fit?");
   const box=await page.locator("#measure-surface").boundingBox(),usable={w:box.width-4,h:box.height-4};await page.mouse.click(box.x+2+usable.w*.1,box.y+2+usable.h*.1);await page.mouse.click(box.x+2+usable.w*.9,box.y+2+usable.h*.9);const expected=.8*Math.hypot(22,18);assert.ok(Math.abs(parseFloat(await page.locator("#measure-result").textContent())-expected)<.1,"Mouse-coordinate quantization remains below one tenth of a foot");await expect(page.locator("#fit-result")).toContainText("Fits within");
   await page.locator("#sofa-width").fill("300");await expect(page.locator("#fit-result")).toContainText("Does not fit");await page.locator("#sofa-width").fill("240");await page.locator("#sofa-depth").fill("36");await expect(page.locator("#fit-result")).toContainText("Fits within");await page.locator("#rotate-sofa").click();await expect(page.locator("#fit-result")).toContainText("Does not fit");
   await page.locator("#sofa-width").fill("84");await page.locator("#rotate-sofa").click();await page.locator("#sofa").focus();const left=await page.locator("#sofa").evaluate(el=>el.style.left);await page.keyboard.press("ArrowRight");assert.notEqual(left,await page.locator("#sofa").evaluate(el=>el.style.left));
   const sb=await page.locator("#sofa").boundingBox();await page.mouse.move(sb.x+sb.width/2,sb.y+sb.height/2);await page.mouse.down();await page.mouse.move(sb.x+sb.width/2+40,sb.y+sb.height/2+25,{steps:4});await page.mouse.up();await expect(page.locator("#measurement-lines circle")).toHaveCount(2);
   await page.locator("#sofa-width").fill("");await expect(page.locator("#fit-result")).toContainText("Enter whole-inch");await expect(page.locator("#sofa")).toBeHidden();await page.locator("#sofa-width").fill("84");
   await page.locator("#clear-measure").click();await expect(page.locator("#measure-result")).toHaveText("Choose a first point");await page.locator("#measure-surface").focus();await page.keyboard.press("Home");await page.keyboard.press("Enter");await page.keyboard.press("End");await page.keyboard.press("Enter");await expect(page.locator("#measure-result")).toHaveText(`${Math.hypot(22,18).toFixed(2)} ft · illustrative plan`);await page.screenshot({path:path.join(checks,"measurement-1440.png")});await close(page);
   await page.locator("#compare").click();await expect(page.locator("#comparison-panorama")).toHaveAttribute("data-ready","true");const primaryYaw=await number(page,"yaw");await page.locator("#comparison-panorama").focus();await page.keyboard.press("ArrowRight");assert.equal(await number(page,"yaw"),primaryYaw);assert.equal(await number(page,"yaw","#comparison-panorama"),98);
   await page.locator("#comparison-room").selectOption("2");await expect(page.locator("#comparison-panorama")).toHaveAttribute("data-room","primary-bedroom");await expect(page.locator("#comparison-panorama")).toHaveAttribute("data-ready","true");await page.screenshot({path:path.join(checks,"comparison-1440.png")});await page.locator("#close-compare").click();await expect(page.locator("#comparison-view")).toBeHidden();
  }finally{await context.close();}
 });
 await check("same-image lighting slider, every photograph and real playable video, details and no invented school/HOA records",async()=>{
  const{context,page}=await visit();try{
   await panel(page,"gallery");await expect(page.locator("[data-gallery-room]")).toHaveCount(4);
   for(let i=0;i<4;i++){await page.locator(`[data-gallery-room="${i}"]`).click();await expect(page.locator("#media-dialog")).toBeVisible();await page.locator("#media-content img").evaluate(im=>im.decode());await close(page);}
   for(const kind of["walkthrough","aerial","neighborhood"]){await page.locator(`[data-video="${kind}"]`).click();await expect.poll(()=>page.locator("#tour-video").evaluate(v=>v.readyState)).toBeGreaterThanOrEqual(1);const duration=await page.locator("#tour-video").evaluate(v=>v.duration);assert.ok(duration>3);await page.locator("#tour-video").evaluate(v=>v.play());await expect.poll(()=>page.locator("#tour-video").evaluate(v=>v.currentTime)).toBeGreaterThan(.1);await close(page);}
   await page.locator('[data-panel="lighting"]').click();assert.equal(await page.locator(".lighting-frame>img").getAttribute("src"),await page.locator(".lighting-warm img").getAttribute("src"));await page.locator("#lighting-slider").fill("75");await expect(page.locator("#lighting-warm")).toHaveCSS("clip-path","inset(0px 25% 0px 0px)");await close(page);
   await panel(page,"settings");await page.locator('#drawer [data-panel="details"]').click();await expect(page.locator(".data-list")).toContainText("Not supplied or verified");await expect(page.locator(".data-list")).toContainText("No live agent supplied");await close(page);
  }finally{await context.close();}
 });
 await check("safe local inquiry, future dates, alternate keyboard tabs, share/embed/QR, save and clipboard fallback",async()=>{
  const{context,page}=await visit();try{
   await page.locator("#save").click();await expect(page.locator("#save")).toHaveAttribute("aria-pressed","true");await page.reload({waitUntil:"networkidle"});await ready(page);await expect(page.locator("#save")).toHaveAttribute("aria-pressed","false");
   await page.locator(".schedule-header").click();const form=page.locator("#inquiry-form");assert.equal(await form.evaluate(f=>f.checkValidity()),false);await page.locator('[name=date]').fill("2020-01-01");assert.equal(await page.locator('[name=date]').evaluate(el=>el.checkValidity()),false);
   await page.locator("#visit-tab").focus();await page.keyboard.press("End");await expect(page.locator("#info-tab")).toHaveAttribute("aria-selected","true");await expect(page.locator("#visit-fields")).toBeHidden();
   await page.locator('[name=name]').fill("    ");await page.locator('[name=email]').fill("preview@example.com");await page.locator('[name=consent]').check();await form.locator("button").click();await expect(form).toBeVisible();
   const malicious='<img src=x onerror="window.__injected=true">';await page.locator('[name=name]').fill(malicious);await page.locator('[name=message]').fill(malicious);await form.locator("button").click();await expect(page.locator("#inquiry-receipt")).toContainText("Nothing was sent");await expect(page.locator("#inquiry-receipt")).toContainText(malicious);await expect(page.locator("#inquiry-receipt img")).toHaveCount(0);assert.equal(await page.evaluate(()=>window.__injected),undefined);await close(page);await expect(page.locator("#inquiry-receipt")).toBeEmpty();
   await page.locator(".schedule-header").click();await page.locator('[name=date]').fill(await page.locator('[name=date]').getAttribute("min"));await page.locator('[name=time]').selectOption("2:00 PM");await page.locator('[name=name]').fill("Preview Visitor");await page.locator('[name=email]').fill("preview@example.com");await page.locator('[name=consent]').check();await form.locator("button").click();await expect(page.locator("#inquiry-receipt")).toContainText("No appointment has been booked");await close(page);
   await page.locator(".header [data-share]").click();const link=await page.locator("#share-url").inputValue();assert.equal(new URL(link).hash,"#room=living-room");assert.equal(new URL(link).origin,new URL(service.url).origin);assert.ok(!(await page.locator("#embed-code").inputValue()).includes("example.com"));await expect(page.locator("#email-tour")).toHaveAttribute("href",/^mailto:\?/);await expect(page.locator("#qr-frame svg")).toHaveCount(1);await page.locator("#qr-frame").screenshot({path:path.join(checks,"tour-qr.png")});
   await page.evaluate(()=>Object.defineProperty(navigator,"clipboard",{value:{writeText:()=>Promise.reject(Error("denied"))},configurable:true}));await page.locator('[data-copy="share-url"]').click();await expect(page.locator("#copy-status")).toContainText("text is selected");assert.equal(await page.locator("#share-url").evaluate(el=>el.selectionEnd-el.selectionStart),link.length);
   await page.screenshot({path:path.join(checks,"share-1440.png")});await close(page);
  }finally{await context.close();}
 });
 await check("connection-aware real 1K assets, motion/contrast preferences, permission denial, VR fallback and default silent audio",async()=>{
  const{context,page}=await visit({reducedMotion:"reduce"},()=>{Object.defineProperty(navigator,"connection",{value:{saveData:true,effectiveType:"2g",downlink:.5},configurable:true});Object.defineProperty(window,"DeviceOrientationEvent",{value:class{static requestPermission(){return Promise.resolve("denied");}},configurable:true});});
  try{
   await expect(page.locator("#panorama")).toHaveAttribute("data-quality","1k");assert.ok(await page.locator("body").evaluate(b=>b.classList.contains("reduced-motion")));await page.locator("#auto-rotate").click();await expect(page.locator("#auto-rotate")).toHaveAttribute("aria-pressed","false");
   await panel(page,"settings");await expect(page.locator("#music-toggle")).not.toBeChecked();await page.locator("#contrast-toggle").check();await expect(page.locator("body")).toHaveClass(/high-contrast/);await page.locator("#gyro-toggle").click();await expect(page.locator("#gyro-toggle")).not.toBeChecked();await expect(page.locator("#device-note")).toContainText("Motion access was denied");
   await page.locator("#vr-start").click();await expect(page.locator("#device-note")).toContainText("No compatible immersive VR");await page.locator("#quality-select").selectOption("2k");await expect(page.locator("#panorama")).toHaveAttribute("data-quality","2k");await page.locator("#music-toggle").check();await expect(page.locator("#music-toggle")).toBeChecked();await page.locator("#music-toggle").uncheck();await close(page);
  }finally{await context.close();}
  const{context:motionContext,page:motionPage}=await visit({},()=>Object.defineProperty(window,"DeviceOrientationEvent",{value:class{static requestPermission(){return Promise.resolve("granted");}},configurable:true}));
  try{await panel(motionPage,"settings");await motionPage.locator("#gyro-toggle").check();const original=await number(motionPage,"yaw");await motionPage.evaluate(()=>{for(const alpha of[0,12]){const event=new Event("deviceorientation");Object.assign(event,{alpha,beta:90,gamma:0});window.dispatchEvent(event);}});assert.ok(Math.abs(await number(motionPage,"yaw")-original)>5,"Synthetic orientation readings actually change the camera");await motionPage.locator("#gyro-toggle").uncheck();}finally{await motionContext.close();}
 });
 await check("five widths, phone controls, landscape, native mobile navigation, real drag and two-pointer pinch",async()=>{
  const{context,page}=await visit({viewport:{width:390,height:1000},isMobile:true,hasTouch:true,reducedMotion:"reduce"});try{
   for(const width of[320,390,768,1200,1440]){await page.setViewportSize({width,height:1000});assert.ok(await page.evaluate(w=>document.documentElement.scrollWidth<=w+1,width),`No document overflow at ${width}`);}
   await page.setViewportSize({width:844,height:390});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=845));assert.equal(await page.locator("#tour").evaluate(el=>el.clientHeight),390);for(const selector of[".room-navigation",".side-tools",".view-tools"]){const b=await page.locator(selector).boundingBox();assert.ok(b.y>=0&&b.y+b.height<=391,`${selector} visible in landscape`);}await page.screenshot({path:path.join(checks,"landscape-844.png")});
   await page.setViewportSize({width:390,height:1000});await expect(page.locator("#minimap")).toBeHidden();
   for(const b of await page.locator(".header button,.guide-bar button,.view-tools button,.room-thumb,.mobile-nav button").all()){if(await b.isVisible()){const box=await b.boundingBox();assert.ok(box.width>=43.9&&box.height>=43.9,`44px phone target ${await b.getAttribute("id")}`);}}
   await page.locator('.mobile-nav [data-panel="floorplan"]').tap();await page.locator('.large-plan [data-room="1"]').tap();await ready(page,"kitchen");await expect(page.locator("#current-room")).toHaveText("Kitchen");
   await page.locator('.mobile-nav [data-panel="room"]').tap();await page.screenshot({path:path.join(checks,"room-390.png")});await page.locator("[data-close-drawer]").tap();
   await page.locator('.mobile-nav [data-panel="settings"]').tap();await page.locator('[data-panel="measure"]').tap();await page.screenshot({path:path.join(checks,"measurement-390.png")});await page.locator("[data-close-drawer]").tap();
   await page.locator('.mobile-nav [data-panel="gallery"]').tap();await expect(page.locator("[data-gallery-room]")).toHaveCount(4);await page.locator("[data-close-drawer]").tap();
   await page.locator('.mobile-nav [data-schedule]').tap();await expect(page.locator("#schedule-dialog")).toBeVisible();await page.locator("[data-close-schedule]").tap();await page.locator("#room-strip [data-room='0']").tap();await ready(page,"living-room");await page.screenshot({path:path.join(checks,"mobile-390.png")});
   const cdp=await context.newCDPSession(page);const start=await number(page,"yaw");await cdp.send("Input.dispatchTouchEvent",{type:"touchStart",touchPoints:[{x:140,y:420,id:1}]});for(let i=1;i<=8;i++)await cdp.send("Input.dispatchTouchEvent",{type:"touchMove",touchPoints:[{x:140+i*12,y:420,id:1}]});await cdp.send("Input.dispatchTouchEvent",{type:"touchEnd",touchPoints:[]});assert.notEqual(await number(page,"yaw"),start);
   const fov=await number(page,"fov");await cdp.send("Input.dispatchTouchEvent",{type:"touchStart",touchPoints:[{x:130,y:450,id:1},{x:210,y:450,id:2}]});for(let i=1;i<=6;i++)await cdp.send("Input.dispatchTouchEvent",{type:"touchMove",touchPoints:[{x:130-i*5,y:450,id:1},{x:210+i*5,y:450,id:2}]});await cdp.send("Input.dispatchTouchEvent",{type:"touchEnd",touchPoints:[]});assert.ok(await number(page,"fov")<fov);await cdp.detach();
  }finally{await context.close();}
 });
 assert.equal(failures,0,"Every browser subtest must pass before writing a successful receipt");assert.deepEqual(errors,[]);assert.ok(requests.every(r=>r.method==="GET"&&new URL(r.url).origin===new URL(service.url).origin));
 const digest=await StaticHomepage.validateStaticOutput(path.join(model,"out"),"virtual-property-tour","GPT-6");await writeFile(path.join(checks,"validation.json"),JSON.stringify({checkedAt:new Date().toISOString(),digest,errors,requests:requests.length,tests:"7 focused browser subtests plus parent; genuine WebGL pixels, real desktop/mobile gestures, media, safety and responsive checks",hardware:"WebXR unsupported/permission behavior only; no physical headset or orientation sensor verified"},null,2)+"\n");
});
