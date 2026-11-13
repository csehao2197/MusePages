import {readFile} from "node:fs/promises";
import {fileURLToPath} from "node:url";
import {initialCategories,initialProducts,analytics} from "./assets/data.js";
export async function verify(page,assert){
  let count=0;const eq=(a,b,message="")=>{assert.deepEqual(a,b,message);count++;},ok=(a,message="")=>{assert.ok(a,message);count++;};
  const base=page.url().split("?")[0].split("#")[0],external=[],errors=[],shot=name=>fileURLToPath(new URL(`.checks/${name}.png`,import.meta.url));
  page.on("request",r=>{if(new URL(r.url()).origin!==new URL(base).origin)external.push(r.url());});
  const ready=async p=>{await p.locator(".product-card").first().waitFor();};
  const readDownload=async action=>{const wait=page.waitForEvent("download");await action();const d=await wait;return {name:d.suggestedFilename(),text:await readFile(await d.path(),"utf8")};};
  await ready(page);
  eq(await page.locator(".product-card").count(),initialProducts.length);
  ok(await page.evaluate(()=>document.fonts.check("12px Inter")));
  eq(await page.evaluate(()=>document.querySelector(".brand").textContent.includes("®")),false);
  eq(await page.locator('input[type="password"],input[type="email"]').count(),0);
  await page.locator('[data-category-filter="move"]').click();
  eq(await page.locator(".product-card").count(),3);
  await page.locator("#search").pressSequentially("Room to Move");
  eq(await page.locator("#search").inputValue(),"Room to Move");
  eq(await page.locator(".product-card").count(),1);
  eq(new URL(page.url()).searchParams.get("q"),"Room to Move");
  await page.reload();await ready(page);
  eq(await page.locator("#search").inputValue(),"Room to Move");
  eq(await page.locator('[data-category-filter="move"]').getAttribute("aria-pressed"),"true");
  await page.locator("#search").fill("not a product");
  eq(await page.locator(".product-card").count(),0);
  ok((await page.locator("#product-grid").textContent()).includes("No essentials"));
  await page.locator("#search").fill("");await page.locator('[data-category-filter="all"]').click();
  await page.locator('.product-art[href="#product-bottle"]').click();
  await page.locator("#add-item").click();
  ok((await page.locator("#dialog-content").textContent()).includes("not secure accounts"));
  eq(await page.locator("#start-customer").count(),1);
  await page.locator("#start-customer").click();await page.locator(".quantity").waitFor();
  eq(await page.locator("#cart-count").textContent(),"1");
  eq(await page.locator("#cart-subtotal").textContent(),"$28.00");
  await page.getByRole("button",{name:"Increase The Daily Bottle",exact:true}).click();
  eq(await page.locator("#cart-subtotal").textContent(),"$56.00");
  await page.getByRole("button",{name:"Decrease The Daily Bottle",exact:true}).click();
  eq(await page.locator("#cart-subtotal").textContent(),"$28.00");
  eq(await page.evaluate(()=>JSON.parse(localStorage.getItem("gohealth-demo-cart-v1"))),[{id:"bottle",quantity:1}]);
  await page.reload();await page.locator("#start-customer").waitFor();
  eq(await page.locator("#cart-count").textContent(),"1");
  ok((await page.locator("#session-label").textContent()).includes("NOT SIGNED IN"));
  await page.locator("#start-customer").click();await page.locator("#cart-subtotal").waitFor();
  await page.locator('a[href="#checkout"]').click();await page.locator("#simulation-ack").waitFor();
  eq(await page.locator("#create-simulation").isDisabled(),true);
  await page.locator("#simulation-ack").check();
  eq(await page.locator("#create-simulation").isDisabled(),false);
  await page.locator("#create-simulation").click();await page.locator(".order-card").waitFor();
  eq(await page.locator("#cart-count").textContent(),"0");
  ok((await page.locator(".order-card").textContent()).includes("Not submitted or paid"));
  const orderDownload=await readDownload(()=>page.locator("[data-download-order]").click()),order=JSON.parse(orderDownload.text);
  eq(orderDownload.name,"gohealth-local-simulation.json");
  eq(order,{id:"DEMO-0001",status:"Local simulation only. Not submitted or paid.",items:[{id:"bottle",quantity:1,name:"The Daily Bottle",unitPriceCents:2800}],currency:"USD",sampleSubtotalCents:2800,shippingCents:null,finalTotalCents:null});
  await page.screenshot({path:shot("local-order")});
  await page.locator("#close-dialog").click();
  await page.evaluate(()=>localStorage.setItem("other-application-demo","preserve"));
  await page.locator('a[href="#workspace"]').click();await page.locator("#start-editor").click();await page.locator(".kpis").waitFor();
  const totals=[analytics.reduce((n,d)=>n+d.orders,0),analytics.reduce((n,d)=>n+d.revenue,0)];
  eq(await page.locator(".kpis strong").allTextContents(),[String(totals[0]),"$950.00","$30.65"]);
  eq(await page.locator("tbody tr").count(),analytics.length);
  for(let i=0;i<analytics.length;i++){
    const d=analytics[i];eq(await page.locator("tbody tr").nth(i).locator("td").allTextContents(),[d.date,String(d.orders),`$${(d.revenue/100).toFixed(2)}`]);
    await page.locator(`[data-day="${i}"]`).click();
    eq(await page.locator("#day-detail").textContent(),`${d.date} · ${d.orders} sample orders`);
  }
  await page.locator('[data-metric="revenue"]').click();
  for(let i=0;i<analytics.length;i++){
    const d=analytics[i];eq(await page.locator(`[data-day="${i}"]`).getAttribute("aria-label"),`${d.date}: $${(d.revenue/100).toFixed(2)} sample revenue`);
  }
  await page.locator('[data-day="0"]').click();
  eq(await page.locator("#day-detail").textContent(),"2026-11-07 · $64.00 sample revenue");
  const csv=await readDownload(()=>page.locator("#export-analytics").click());
  eq(csv.name,"gohealth-sample-analytics.csv");
  eq(csv.text,["date,orders,revenue_usd",...analytics.map(d=>`${d.date},${d.orders},${(d.revenue/100).toFixed(2)}`)].join("\r\n")+"\r\n");
  await page.screenshot({path:shot("analytics")});
  await page.locator('[data-workspace-tab="categories"]').click();
  await page.locator("#category-name").fill("  hydrate  ");await page.locator("#create-category button").click();
  ok((await page.locator("#editor-status").textContent()).includes("already exists"));
  await page.locator("#category-name").fill("<script>");await page.locator("#create-category button").click();
  ok((await page.locator("#editor-status").textContent()).includes("2–36"));
  await page.locator("#category-name").fill("  Mindful   Breaks  ");await page.locator("#create-category button").click();
  eq(await page.locator(".category-row").count(),4);
  eq(await page.locator('.category-row[data-category="local-category-1"] input').inputValue(),"Mindful Breaks");
  const hydration=page.locator('.category-row[data-category="hydrate"]');
  await hydration.locator("input").fill("Daily Hydration");await hydration.getByRole("button",{name:"Save name"}).click();
  eq(await page.locator('[data-category-filter="hydrate"]').textContent(),"Daily Hydration");
  await page.locator('[data-delete="hydrate"]').click();
  ok((await page.locator("#editor-status").textContent()).includes("Reassign"));
  eq(await page.locator(".category-row").count(),4);
  await page.locator("#move-product").selectOption("bottle");await page.locator("#move-category").selectOption("local-category-1");await page.locator("#reassign-product button").click();
  eq(await page.locator('.category-row[data-category="local-category-1"] span').textContent(),"1 sample products");
  await page.locator('[data-delete="local-category-1"]').click();
  ok((await page.locator("#editor-status").textContent()).includes("Reassign"));
  for(let i=0;i<8;i++){await page.locator("#category-name").fill(`Sample ${i}`);await page.locator("#create-category button").click();}
  eq(await page.locator(".category-row").count(),12);
  await page.locator("#category-name").fill("Too Many");await page.locator("#create-category button").click();
  ok((await page.locator("#editor-status").textContent()).includes("twelve"));
  await page.locator("#close-dialog").click();
  await page.locator('[data-category-filter="local-category-1"]').click();
  eq(await page.locator(".product-card").count(),1);
  eq(await page.locator(".product-title h3").textContent(),"The Daily Bottle");
  await page.locator('a[href="#workspace"]').click();await page.locator("#reassign-product").waitFor();
  await page.locator("#move-product").selectOption("bottle");await page.locator("#move-category").selectOption("hydrate");await page.locator("#reassign-product button").click();
  await page.locator('[data-delete="local-category-1"]').click();
  eq(await page.locator(".category-row").count(),11);
  eq(await page.locator('[data-category-filter="local-category-1"]').count(),0);
  await page.setViewportSize({width:320,height:900});
  ok(await page.evaluate(()=>document.querySelector("dialog").scrollWidth<=document.querySelector("dialog").clientWidth+1),"Category manager fits at 320px");
  await page.screenshot({path:shot("categories-mobile")});
  await page.keyboard.press("Escape");eq(await page.locator("#dialog").evaluate(d=>d.open),false);
  await page.locator("#end-demo").click();
  eq(await page.evaluate(()=>localStorage.getItem("gohealth-demo-cart-v1")),null);
  eq(await page.evaluate(()=>localStorage.getItem("other-application-demo")),"preserve");
  eq(await page.locator("#category-filters button").count(),initialCategories.length+1);
  await page.locator(".mobile-toggle").click();eq(await page.locator(".mobile-toggle").getAttribute("aria-expanded"),"true");
  await page.keyboard.press("Escape");eq(await page.locator(".mobile-toggle").getAttribute("aria-expanded"),"false");
  eq(await page.locator(".mobile-toggle").evaluate(el=>el===document.activeElement),true);
  const browser=page.context().browser();
  for(const mode of ["sanitized","blocked","malformed"]){
    const context=await browser.newContext({viewport:{width:390,height:900}});
    try{
      await context.addInitScript(({mode,key})=>{if(mode==="blocked"){for(const method of ["getItem","setItem","removeItem"])Storage.prototype[method]=()=>{throw new DOMException("Unavailable","SecurityError");};}else localStorage.setItem(key,mode==="malformed"?"{broken":JSON.stringify([{id:"bottle",quantity:100},{id:"unknown",quantity:2},{id:"mat",quantity:-1},{id:"cup",quantity:"2"}]));},{mode,key:"gohealth-demo-cart-v1"});
      const p=await context.newPage();p.on("pageerror",e=>errors.push(e.message));await p.goto(base);await ready(p);
      if(mode==="sanitized"){
        eq(await p.locator("#cart-count").textContent(),"10");
        await p.locator('a[href="#cart"]').click();await p.locator("#start-customer").click();await p.locator(".quantity").waitFor();
        eq(await p.getByRole("button",{name:"Increase The Daily Bottle",exact:true}).isDisabled(),true);
        await p.getByRole("button",{name:"Decrease The Daily Bottle",exact:true}).click();
        eq(await p.evaluate(()=>JSON.parse(localStorage.getItem("gohealth-demo-cart-v1"))),[{id:"bottle",quantity:9}]);
        await p.screenshot({path:shot("cart-mobile")});
      }else{
        eq(await p.locator("#cart-count").textContent(),"0");
        ok((await p.locator("#storage-status").textContent()).includes("unavailable or unreadable"));
        await p.locator('.product-art[href="#product-bottle"]').click();await p.locator("#add-item").click();await p.locator("#start-customer").click();await p.locator(".quantity").waitFor();
        eq(await p.locator("#cart-subtotal").textContent(),"$28.00");
        if(mode==="blocked")ok((await p.locator("#storage-status").textContent()).includes("this tab only"));
      }
    }finally{await context.close();}
  }
  await page.setViewportSize({width:1440,height:1000});await page.goto(base+"?visual=final");await ready(page);
  await page.evaluate(async()=>{for(const image of document.images)image.loading="eager";await Promise.all([...document.images].map(image=>image.decode()));});
  ok(await page.evaluate(()=>[...document.images].every(i=>i.complete&&i.naturalWidth>0)));
  eq(external,[]);eq(errors,[]);
  await page.evaluate(()=>{localStorage.removeItem("other-application-demo");});
  return count;
}
