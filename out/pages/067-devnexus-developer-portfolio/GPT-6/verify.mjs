import {readFile} from "node:fs/promises";
import path from "node:path";
import {fileURLToPath} from "node:url";
import {projects,skills,posts} from "./assets/data.js";
const root=path.dirname(fileURLToPath(import.meta.url));
export async function verify(page,assert){
  let count=0;const eq=(a,b,message="")=>{assert.deepEqual(a,b,message);count++;},ok=(a,message="")=>{assert.ok(a,message);count++;};
  const url=page.url().split("#")[0],localOrigin=new URL(url).origin,external=[];
  page.on("request",r=>{if(new URL(r.url()).origin!==localOrigin)external.push(r.url());});
  const text=selector=>page.locator(selector).textContent();
  const open=async id=>{await page.evaluate(hash=>{location.hash=hash;},`project-${id}`);await page.locator(`.sandbox[data-demo="${id}"]`).waitFor();};
  const close=async()=>{await page.locator("#close-dialog").click();await page.waitForFunction(()=>!document.querySelector("dialog").open);};
  await page.emulateMedia({reducedMotion:"reduce"});await page.goto(url);
  eq(await page.locator(".project-card").count(),6);
  eq(await page.locator("#motion-toggle").textContent(),"Resume motion");
  ok(["webgl","static"].includes(await page.locator("#particles").getAttribute("data-renderer")));
  eq(await page.evaluate(()=>document.querySelector("#skill-sphere").getContext("2d").getImageData(0,0,1,1).data.length),4);
  await page.locator("#skills").scrollIntoViewIfNeeded();
  await page.waitForFunction(()=>{const c=document.querySelector("#skill-sphere");return c.getContext("2d").getImageData(0,0,c.width,c.height).data.some((v,i)=>i%4===3&&v>0);});
  ok(true,"Sphere has drawn pixels");
  const before=await page.locator("#skill-sphere").evaluate(c=>c.toDataURL());await page.locator("#skill-sphere").focus();await page.keyboard.press("ArrowRight");
  ok(before!==await page.locator("#skill-sphere").evaluate(c=>c.toDataURL()),"Keyboard rotates actual projected graphic");
  await page.locator("#theme-toggle").click();eq(await page.locator("html").getAttribute("data-theme"),"light");await page.locator("#theme-toggle").click();eq(await page.locator("html").getAttribute("data-theme"),"dark");
  for(const domain of Object.keys(skills)){await page.locator(`[data-domain="${domain}"]`).click();eq(await page.locator(".skill-row>div>span:first-child").allTextContents(),skills[domain].map(s=>s[0]));eq(await page.locator("progress").evaluateAll(nodes=>nodes.map(n=>n.value)),skills[domain].map(s=>s[1]));}
  await page.locator("#tab-Frontend").click();await page.keyboard.press("End");eq(await page.locator("[role=tab][aria-selected=true]").textContent(),"Tools");await page.keyboard.press("ArrowRight");eq(await page.locator("[role=tab][aria-selected=true]").textContent(),"Frontend");
  for(const filter of ["Web","Mobile","AI","Full-stack","All"]){await page.locator(`[data-filter="${filter}"]`).click();eq(await page.locator(".project-card").count(),projects.filter(p=>filter==="All"||p.type===filter).length);eq(new URL(page.url()).searchParams.get("category"),filter==="All"?null:filter);}
  await page.locator('[data-filter="AI"]').click();await page.reload();eq(await page.locator(".project-card h3").textContent(),"AIChatbot");
  await page.locator('[data-filter="All"]').click();
  for(const p of projects){await open(p.id);eq(await text("#dialog-title"),p.name);eq(await page.locator(".architecture span").allTextContents(),p.nodes);eq(await text(".case-result"),p.result);await close();}
  await page.locator('.project-image[href="#project-nexuscommerce"]').click();await page.locator(".sandbox").waitFor();await page.keyboard.press("Escape");await page.waitForFunction(()=>!document.querySelector("dialog").open);eq(await page.evaluate(()=>document.activeElement?.getAttribute("href")),"#project-nexuscommerce");
  await open("nexuscommerce");eq(await page.locator(".product").count(),6);await page.locator("#interest").selectOption("Desk");eq(await page.locator(".product").count(),2);await page.locator('[data-add="0"]').click();await page.locator('[data-add="0"]').click();await page.locator('[data-add="1"]').click();eq(await text("#cart-total"),"$220.00 · 3 items");await page.locator('[data-remove="0"]').click();eq(await text("#cart-total"),"$131.00 · 2 items");await page.locator("#interest").selectOption("Outdoor");eq(await text("#cart-total"),"$131.00 · 2 items");await close();
  await open("securevault");await page.locator("#vault-password").fill("short");await page.locator("#encrypt").click();ok((await text("#vault-status")).includes("at least 8"));
  const secret="Only a local sample <script>not executable</script>";
  await page.locator("#vault-text").fill(secret);await page.locator("#vault-password").fill("sample-password-123");await page.locator("#encrypt").click();await page.waitForFunction(()=>document.querySelector("#vault-status").textContent.startsWith("Encrypted locally"));
  const first=JSON.parse(await text("#envelope"));eq(first.algorithm,"AES-256-GCM");eq(first.iterations,210000);eq(Buffer.from(first.iv,"base64").length,12);eq(Buffer.from(first.salt,"base64").length,16);ok(!JSON.stringify(first).includes(secret));eq(await page.locator("#vault-password").inputValue(),"");eq(await page.locator("#vault-text").inputValue(),"");
  const envelopeDownload=page.waitForEvent("download");await page.locator("#export-envelope").click();eq(JSON.parse(await readFile(await (await envelopeDownload).path(),"utf8")),first);
  await page.locator("#vault-password").fill("wrong-password");await page.locator("#decrypt").click();await page.waitForFunction(()=>document.querySelector("#vault-status").textContent.startsWith("Could not decrypt"));eq(await text("#decrypted"),"");
  await page.locator("#vault-password").fill("sample-password-123");await page.locator("#decrypt").click();await page.waitForFunction(()=>document.querySelector("#vault-status").textContent.startsWith("Decrypted locally"));eq(await text("#decrypted"),secret);eq(await page.locator("#decrypted script").count(),0);
  await page.locator("#vault-text").fill(secret);await page.locator("#vault-password").fill("sample-password-123");await page.locator("#encrypt").click();await page.waitForFunction(()=>document.querySelector("#vault-status").textContent.startsWith("Encrypted locally"));const second=JSON.parse(await text("#envelope"));ok(first.iv!==second.iv);ok(first.salt!==second.salt);ok(first.ciphertext!==second.ciphertext);await close();await open("securevault");eq(await text("#envelope"),"");eq(await page.locator("#decrypt").isDisabled(),true);await close();
  await open("datastream");eq(await text("#stream-total"),"98 total · 4 samples");await page.locator("#next-sample").click();eq(await text("#stream-total"),"127 total · 5 samples");eq(await page.locator(".chart circle").count(),5);eq(await page.locator(".sandbox tbody tr").count(),5);for(let i=0;i<7;i++)await page.locator("#next-sample").click();eq(await page.locator("#next-sample").isDisabled(),true);eq(await text("#stream-total"),"429 total · 12 samples");await page.locator("#reset-stream").click();eq(await text("#stream-total"),"98 total · 4 samples");await close();
  await open("aichatbot");
  for(const [q,fragment] of [["What about privacy?","No chat messages"],["pricing","no commercial plans"],["integration","No model or API"],["support","no support service"],["<img src=x onerror=alert(1)>","No matching local answer"]]){
    await page.locator("#question").fill(q);await page.locator("#chat-form button").click();ok((await page.locator(".messages p").last().textContent()).includes(fragment));}
  eq(await page.locator(".messages img").count(),0);eq(await page.locator(".messages p").count(),10);await close();await open("aichatbot");eq(await page.locator(".messages p").count(),0);await close();
  await open("devflow");await page.locator("#scenario").selectOption("failure");await page.locator("#pipeline-next").click();await page.locator("#pipeline-next").click();eq(await page.locator(".pipeline small").allTextContents(),["sample passed","sample failed","skipped"]);eq(await page.locator("#pipeline-next").isDisabled(),true);await page.locator("#pipeline-reset").click();await page.locator("#scenario").selectOption("success");for(let i=0;i<3;i++)await page.locator("#pipeline-next").click();eq(await page.locator(".pipeline small").allTextContents(),["sample passed","sample passed","sample passed"]);ok((await text("#pipeline-status")).includes("No real checks"));await close();
  for(const p of posts){await page.evaluate(hash=>{location.hash=hash;},`post-${p.id}`);await page.waitForFunction(title=>document.querySelector("#dialog-title")?.textContent===title,p.title);eq(await page.locator(".article>p:not(.article-meta):not(.article-intro):not(.section-note)").allTextContents(),p.paragraphs);eq(await text(".article code"),p.code);ok((await page.title()).startsWith(p.title));await close();}
  await page.locator("#contact-form button[type=submit]").click();eq(await page.locator("#contact-form [aria-invalid=true]").count(),4);eq(await page.evaluate(()=>document.activeElement.name),"name");
  for(const name of ["name","subject","message"])await page.locator(`[name="${name}"]`).fill("   ");
  await page.locator('[name="email"]').fill("valid@example.com");await page.locator("#contact-form button[type=submit]").click();eq(await page.locator("#contact-form [aria-invalid=true]").count(),3);
  const fields={name:"  Sample Visitor  ",email:"visitor@example.com",subject:"  Static interface exploration  ",message:"  A local sample brief with <script>plain text</script>.  "};
  for(const [name,value] of Object.entries(fields))await page.locator(`[name="${name}"]`).fill(value);
  const briefDownload=page.waitForEvent("download");await page.locator("#contact-form button[type=submit]").click();const brief=JSON.parse(await readFile(await (await briefDownload).path(),"utf8"));eq(brief.name,"Sample Visitor");eq(brief.message,fields.message.trim());eq(brief.delivery,"Not sent. Local download only.");eq(await page.locator('[name="email"]').inputValue(),"");ok((await text("#form-status")).includes("Nothing was sent"));
  const pdf=await page.request.get(new URL("./assets/devnexus-cv.pdf",url).href);eq(pdf.status(),200);const pdfBytes=await pdf.body();eq(pdfBytes.subarray(0,5).toString(),"%PDF-");eq((pdfBytes.toString("latin1").match(/\/Type\s*\/Page\b/g)||[]).length,1);
  for(const p of projects){const image=await readFile(path.join(root,"assets",`${p.id}.png`));eq(image.subarray(0,8).toString("hex"),"89504e470d0a1a0a");}
  for(const width of [1440,390,320]){await page.setViewportSize({width,height:900});await open("nexuscommerce");ok(await page.locator(".dialog-shell").evaluate(e=>e.scrollWidth<=e.clientWidth+1),`Expanded case fits ${width}`);await page.screenshot({path:path.join(root,".checks",width===1440?"case-desktop.png":`case-${width}.png`)});await close();}
  await page.setViewportSize({width:390,height:900});await page.locator(".mobile-toggle").click();eq(await page.locator(".mobile-toggle").getAttribute("aria-expanded"),"true");await page.locator("#navigation a[href='#blog']").click();eq(await page.locator(".mobile-toggle").getAttribute("aria-expanded"),"false");
  await open("securevault");await page.screenshot({path:path.join(root,".checks","vault-mobile.png")});await close();
  await page.clock.install();await open("pocketui");await page.locator("#timer-start").click();await page.clock.fastForward(2500);eq(await text("#timer-value"),"00:58");await page.locator("#timer-start").click();const paused=await text("#timer-value");await page.clock.fastForward(5000);eq(await text("#timer-value"),paused);await page.locator("#timer-start").click();await page.clock.fastForward(60000);eq(await text("#timer-value"),"00:00");eq(await text("#timer-status"),"Focus minute complete.");eq(await page.locator("#timer-start").isDisabled(),true);await page.locator("#timer-reset").click();eq(await text("#timer-value"),"01:00");await close();
  eq(external,[]);eq(await page.evaluate(()=>[localStorage.length,sessionStorage.length,document.cookie]),[0,0,""]);
  const fallbackContext=await page.context().browser().newContext({reducedMotion:"reduce"});
  try{
    await fallbackContext.addInitScript(()=>{const original=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(type,...args){return type==="webgl"?null:original.call(this,type,...args);};});
    const fallback=await fallbackContext.newPage();await fallback.goto(url);
    eq(await fallback.locator("#particles").getAttribute("data-renderer"),"static");
    eq(await fallback.locator("#graphics-status").textContent(),"static fallback");
    eq(await fallback.locator("h1").isVisible(),true);await fallback.locator(".project-image").first().click();await fallback.locator(".sandbox").waitFor();eq(await fallback.locator("#dialog-title").textContent(),"NexusCommerce");
  }finally{await fallbackContext.close();}
  return count;
}
