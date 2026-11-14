import path from "node:path";
import {fileURLToPath} from "node:url";
export async function verify(page,assert){
  let count=0;const same=(a,b,message="")=>{assert.equal(a,b,message);count++;},ok=(a,message="")=>{assert.ok(a,message);count++;},text=s=>page.locator(s).textContent(),click=s=>page.locator(s+":visible").click(),idle=()=>page.waitForFunction(()=>document.querySelector("#results").getAttribute("aria-busy")==="false");
  const key="loopline-demo.routes.v1",screens=path.join(path.dirname(fileURLToPath(import.meta.url)),".checks"),external=[],base=new URL(page.url());base.search="";base.hash="";
  page.on("request",r=>{if(new URL(r.url()).origin!==base.origin)external.push(r.url());});
  await page.locator("#auto").uncheck();same(await page.locator("#origin option").count(),32);same(await page.locator("#destination option").count(),32);same(await page.locator(".train-row").count(),5);
  same(await text("#clock"),"8:10 AM PST");same(await text(".train-row:first-child .time:first-child strong"),"8:20");ok((await text(".train-row:first-child")).includes("59 min"));ok((await text(".train-row:first-child")).includes("Southbound"));
  same(await page.locator(".next-badge").count(),1);same(await page.locator(".weather-card").count(),2);same(await page.locator(".forecast-hour").count(),3);ok((await text("#difference")).includes("10°F warmer at Palo Alto"));ok((await text(".demo-banner")).includes("fictional"));ok((await page.locator(".intro-visual img").evaluate(i=>i.complete&&i.naturalWidth>0)));
  const plan=async(from,to)=>{await page.locator("#origin").selectOption(from);await page.locator("#destination").selectOption(to);await click("#find-trains");await idle();};
  await plan("palo-alto","palo-alto");ok((await text("#route-error")).includes("different stations"));same(await page.locator(".train-row").count(),5);ok((await text("#route-heading")).startsWith("San Francisco"));
  await plan("palo-alto","san-francisco");ok((await text(".train-row:first-child")).includes("Northbound"));ok((await text("#route-heading")).startsWith("Palo Alto"));ok((await text("#weather")).includes("San Francisco"));ok(page.url().includes("from=palo-alto"));
  await click("#swap");await idle();ok((await text(".train-row:first-child")).includes("Southbound"));same(await page.locator("#origin").inputValue(),"san-francisco");
  await page.locator("#scenario").selectOption("delay");await idle();same(await page.locator(".notice.warning").count(),1);ok((await text("#alerts")).includes("six-minute hold"));ok((await text("#trains")).includes("+6m hold"));
  await page.locator("#scenario").selectOption("no-service");await idle();same(await page.locator(".train-row").count(),0);same(await page.locator(".notice.critical").count(),1);ok((await text("#trains")).includes("sample suspension"));
  await page.screenshot({path:path.join(screens,"sample-suspension.png"),fullPage:true});
  await page.locator("#scenario").selectOption("regular");await idle();same(await page.locator(".train-row").count(),5);
  await plan("atherton","palo-alto");same(await page.locator(".train-row").count(),0);ok((await text("#trains")).includes("legacy listing"));ok((await text("#weather")).includes("No weather fixture"));same(await page.locator(".weather-card").count(),1);same(await page.locator(".notice.warning").count(),1);
  await plan("san-francisco","stanford");same(await page.locator(".forecast-hour").count(),0);ok((await text("#forecast")).includes("legacy stop"));await plan("san-francisco","palo-alto");
  const openSave=()=>click('.planner-foot [data-action="save"]'),save=()=>click("#favorite-form .form-actions .red"),name=value=>page.locator('#favorite-form [name="name"]').fill(value);
  await openSave();await name("Home to campus");await save();same(await page.locator(".favorite").count(),1);same(await page.locator("#dialog").isVisible(),false);
  let saved=await page.evaluate(k=>JSON.parse(localStorage.getItem(k)),key);same(saved.length,1);same(saved[0].name,"Home to campus");same(saved[0].from,"san-francisco");same(saved[0].to,"palo-alto");
  await click('.favorite [data-action="edit"]');await page.locator('#favorite-form [name="from"]').selectOption("mountain-view");await page.locator('#favorite-form [name="to"]').selectOption("mountain-view");await save();ok((await text("#favorite-error")).includes("different listed stops"));
  await page.locator('#favorite-form [name="to"]').selectOption("san-jose-diridon");await save();ok((await text(".favorite")).includes("Mountain View"));ok((await text(".favorite")).includes("San Jose Diridon"));
  await openSave();await name(" home TO campus ");await save();ok((await text("#favorite-error")).includes("already saved"));await name("<img src=x onerror=alert(1)>");await save();same(await page.locator(".favorite").count(),2);same(await page.locator(".favorite img").count(),0);ok((await text("#favorites")).includes("<img src=x onerror=alert(1)>"));
  await page.locator(".favorite").filter({hasText:"<img src=x onerror=alert(1)>"}).locator('[data-action="delete"]').click();await click('[data-action="close"]');same(await page.locator(".favorite").count(),2);
  await page.locator(".favorite").filter({hasText:"<img src=x onerror=alert(1)>"}).locator('[data-action="delete"]').click();await click('[data-action="confirm-delete"]');same(await page.locator(".favorite").count(),1);
  await click('.favorite [data-action="load"]');await idle();same(await page.locator("#origin").inputValue(),"mountain-view");same(await page.locator("#destination").inputValue(),"san-jose-diridon");
  await click("#swap");await idle();same(await page.locator("#origin").inputValue(),"san-jose-diridon");ok((await text(".train-row:first-child")).includes("Northbound"));
  await page.goBack();await idle();same(await page.locator("#origin").inputValue(),"mountain-view");same(await page.locator("#destination").inputValue(),"san-jose-diridon");
  for(const [index,to] of ["millbrae","san-mateo","redwood-city","gilroy"].entries()){await plan("san-francisco",to);await openSave();await name("Route "+(index+2));await save();}
  same(await page.locator(".favorite").count(),5);await openSave();same(await page.locator("#dialog").isVisible(),false);ok((await text("#toast")).includes("Five routes"));
  await page.locator('.favorite [data-action="edit"]').first().click();await page.locator('#favorite-form [name="from"]').selectOption("san-francisco");await page.locator('#favorite-form [name="to"]').selectOption("millbrae");await save();ok((await text("#favorite-error")).includes("station pair is already"));await page.keyboard.press("Escape");
  await page.locator('.favorite [data-action="delete"]').last().click();await click('[data-action="confirm-delete"]');same(await page.locator(".favorite").count(),4);
  saved=await page.evaluate(k=>JSON.parse(localStorage.getItem(k)),key);same(saved.length,4);ok(saved.every(r=>Object.keys(r).sort().join(",")==="from,id,name,to"));
  await page.evaluate(k=>{localStorage.setItem("loopline-test.unrelated","keep");const data=JSON.parse(localStorage.getItem(k));localStorage.setItem(k,JSON.stringify([...data,{id:"invalid",name:"bad",from:"missing",to:"gilroy"},data[0],{...data[0],id:"different",extra:"discard"}]));},key);
  await page.reload();await idle();await page.locator("#auto").uncheck();same(await page.locator(".favorite").count(),4);same(await page.evaluate(()=>localStorage.getItem("loopline-test.unrelated")),"keep");same(await page.evaluate(k=>JSON.parse(localStorage.getItem(k)).length,key),4);
  await page.evaluate(()=>localStorage.removeItem("loopline-test.unrelated"));
  await click('nav [data-action="about"]');ok((await text("#dialog-content")).includes("not the current time"));ok((await text("#dialog-content")).includes("not the Next.js/API integration"));await page.keyboard.press("Escape");same(await page.locator("#dialog").isVisible(),false);
  for(const width of [1440,1024,768,390,320]){await page.setViewportSize({width,height:900});ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`Overflow at ${width}`);}
  await openSave();ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));await page.screenshot({path:path.join(screens,"mobile-saved-route.png")});await page.keyboard.press("Escape");
  await page.goto(base.href+"?from=missing&to=gilroy&at=bad");await idle();same(await page.locator("#origin").inputValue(),"san-francisco");ok((await text("#route-error")).includes("invalid route"));same(await page.locator(".favorite").count(),4);
  await page.goto(base.href+"?from=san-francisco&to=palo-alto&at=1439&scenario=regular");await idle();await page.locator("#auto").uncheck();same(await page.locator(".train-row").count(),0);ok((await text("#trains")).includes("No more fictional"));await click('[data-action="reset-clock"]');await idle();same(await text("#clock"),"8:10 AM PST");same(await page.locator(".train-row").count(),5);
  await click("#refresh");same(await page.locator("#results").getAttribute("aria-busy"),"true");ok((await text("#trains")).includes("No network request"));await idle();same(await page.locator(".train-row").count(),5);
  const browser=page.context().browser(),timedContext=await browser.newContext(),blockedContext=await browser.newContext();
  try{
    const timed=await timedContext.newPage();await timed.clock.install();await timed.goto(base.href);await timed.clock.runFor(250);await timed.clock.fastForward(60000);await timed.clock.runFor(250);same(await timed.locator("#clock").textContent(),"8:11 AM PST");
    await timed.locator("#auto").uncheck();await timed.clock.fastForward(60000);same(await timed.locator("#clock").textContent(),"8:11 AM PST");
    await timed.locator("#advance").click();await timed.clock.runFor(250);same(await timed.locator("#clock").textContent(),"8:26 AM PST");
    await timed.goto(base.href+"?at=1435");await timed.clock.runFor(250);await timed.locator("#advance").click();await timed.clock.runFor(250);same(await timed.locator("#clock").textContent(),"11:59 PM PST");await timed.clock.fastForward(120000);await timed.clock.runFor(250);same(await timed.locator("#clock").textContent(),"11:59 PM PST");
    await blockedContext.addInitScript(()=>{for(const method of ["getItem","setItem"]){const original=Storage.prototype[method];Storage.prototype[method]=function(key,...args){if(key==="loopline-demo.routes.v1")throw new DOMException("Test unavailable","SecurityError");return original.call(this,key,...args);};}});
    const blocked=await blockedContext.newPage();await blocked.goto(base.href);same(await blocked.locator(".favorite").count(),0);ok((await blocked.locator("#storage-note").textContent()).includes("storage unavailable"));
    await blocked.locator('.planner-foot [data-action="save"]').click();await blocked.locator('#favorite-form [name="name"]').fill("Memory only");await blocked.locator("#favorite-form .red").click();same(await blocked.locator(".favorite").count(),1);ok((await blocked.locator("#toast").textContent()).includes("tab memory"));
    await blocked.reload();same(await blocked.locator(".favorite").count(),0);
  }finally{await timedContext.close();await blockedContext.close();}
  same(await page.evaluate(()=>document.cookie),"");same(external.length,0);same(await page.locator("a[href='https://www.caltrain.com/schedules']").getAttribute("rel"),"noopener noreferrer");
  return count;
}
