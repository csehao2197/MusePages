import {products,emptyCart,restoreCart,setQuantity,totals,browse,money,cartFingerprint,checkoutDraft,assistantReply} from "./assets/engine.js";
const $=(id)=>document.getElementById(id);
const escape=(value)=>String(value).replace(/[&<>"']/g,(char)=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));
const icon=(id)=>`<svg aria-hidden="true"><use href="assets/icons.svg#${id}"/></svg>`;
const catalog=new Map(products.map((product)=>[product.id,product]));
const storageKey="leekshop-demo-cart-v1";
let cart=emptyCart(),expectedRaw=null,storageIssue="",temporary=false,query="",category="All",sort="featured",selected=null,selectedQuantity=1,checkout=null,lastReceipt=null,confirmation=null,toastTimer,chat=[];
function toast(message,viewCart=false){
  clearTimeout(toastTimer); $("toast-text").textContent=message; $("toast-cart").hidden=!viewCart; $("toast").classList.add("show");
  toastTimer=setTimeout(()=>$("toast").classList.remove("show"),3500);
}
function open(id){ if(!$(id).open) $(id).showModal(); }
function hide(id){ $(id).close(); }
function readStored(){
  try{ const raw=localStorage.getItem(storageKey); const next=restoreCart(raw); cart=next;expectedRaw=raw;storageIssue=""; }
  catch{ storageIssue="The saved cart is unavailable or unreadable. Its original data is untouched. Reload, reset it explicitly, or use a temporary cart."; }
  renderStorage();
}
function renderStorage(){
  $("storage-warning").hidden=!storageIssue;
  $("storage-message").textContent=storageIssue;
  $("storage-status").textContent=temporary ? "Temporary cart · resets on refresh" : storageIssue ? "Saved cart needs attention" : "Cart saved on this browser";
}
function saveCart(next){
  if(!temporary){
    if(storageIssue) throw new Error("Choose how to handle the saved cart before making changes.");
    try{
      if(localStorage.getItem(storageKey)!==expectedRaw) throw new Error("Another tab changed the saved cart. Reload it before continuing.");
      const raw=JSON.stringify(next);localStorage.setItem(storageKey,raw);expectedRaw=raw;
    }catch(error){ storageIssue=error.message==="Another tab changed the saved cart. Reload it before continuing." ? error.message : "The browser could not save this cart. No change was applied. Retry, or choose temporary mode.";renderStorage();throw new Error(storageIssue); }
  }
  cart=next;renderCart();renderCatalog();
}
function add(id,quantity=1){
  const old=cart.items.find((item)=>item.id===id)?.quantity||0;
  try{ saveCart(setQuantity(cart,id,old+quantity));toast(`Added ${quantity} × ${catalog.get(id).name}.`,true);return true; }
  catch(error){toast(error.message);return false;}
}
function renderCatalog(){
  const matches=browse({query,category,sort});
  $("product-count").textContent=`${matches.length} little green thing${matches.length===1?"":"s"}`;
  $("product-grid").innerHTML=matches.map((product)=>`<article class="product-card" data-product="${product.id}" style="--product-bg:${product.color}"><button class="product-image" data-detail="${product.id}" aria-label="View ${escape(product.name)}"><img src="assets/${product.image}" alt="Original illustration of ${escape(product.name)}" width="480" height="480"><span class="product-badge">${product.badge}</span><span class="view-detail">A CLOSER LOOK ${icon("arrow-up-right")}</span></button><div class="product-info"><div><button class="product-name" data-detail="${product.id}">${escape(product.name)}</button><p class="product-category">${product.category}</p></div><span class="product-price">${money(product.price)}</span></div><div class="product-bottom"><span class="stock-label ${product.stock?"":"unavailable"}"><i></i>${product.stock?"Available in demo":"Unavailable in demo"}</span><button class="add-button" data-add="${product.id}" ${product.stock?"":"disabled"}>${product.stock?"Add to cart":"Taking a nap"}${icon(product.stock?"plus":"moon")}</button></div></article>`).join("");
  $("catalog-empty").hidden=!!matches.length;$("product-grid").hidden=!matches.length;
  document.querySelectorAll("[data-category]").forEach((button)=>{button.classList.toggle("active",button.dataset.category===category);button.setAttribute("aria-pressed",String(button.dataset.category===category));});
}
function renderDetail(){
  if(!selected)return;
  const product=catalog.get(selected);
  const inCart=cart.items.find((item)=>item.id===product.id)?.quantity||0,remaining=product.stock-inCart;
  selectedQuantity=Math.min(Math.max(1,selectedQuantity),Math.max(1,remaining));
  $("product-detail").innerHTML=`<div class="product-detail-grid" style="--product-bg:${product.color}"><div class="product-detail-image"><img src="assets/${product.image}" alt="Original illustration of ${escape(product.name)}" width="480" height="480"></div><div class="product-detail-copy"><p class="eyebrow">${product.category.toUpperCase()} · ILLUSTRATED CONCEPT</p><h2 id="product-title">${escape(product.name)}</h2><p class="detail-price">${money(product.price)}</p><p class="detail-description">${escape(product.description)}</p><p class="detail-spec">${escape(product.detail)}</p><div class="detail-quantity"><label>Quantity · ${remaining} left for this cart</label><div class="quantity-control"><button data-detail-change="-1" aria-label="Decrease product quantity" ${selectedQuantity<=1?"disabled":""}>${icon("minus")}</button><span id="detail-quantity">${selectedQuantity}</span><button data-detail-change="1" aria-label="Increase product quantity" ${selectedQuantity>=remaining?"disabled":""}>${icon("plus")}</button></div></div><button class="button primary detail-add" id="detail-add" ${remaining<=0?"disabled":""}>${remaining<=0?"Not available for this cart":`Add to cart — ${money(product.price*selectedQuantity)}`}${icon("shopping-bag")}</button><p class="detail-disclaimer">Sample merchandise only. No real purchase, inventory reservation or payment occurs.</p></div></div>`;
  if(remaining===0)$("detail-quantity").textContent="0";
}
function showProduct(id){
  if(!catalog.has(id))return;selected=id;selectedQuantity=1;renderDetail();open("product-dialog");
  const url=new URL(location.href);url.hash=`product-${id}`;history.replaceState(null,"",url);
}
function totalMarkup(quote){
  return `<div class="cart-totals"><div><span>Merchandise</span><span>${money(quote.subtotal)}</span></div><div><span>Demo delivery</span><span>${quote.shipping?money(quote.shipping):"Free"}</span></div><div><small>Tax service not connected</small><small>Not calculated</small></div><div class="total"><span>Demo total</span><span>${money(quote.total)}</span></div></div>`;
}
function renderCart(){
  const quote=totals(cart);$("cart-count").textContent=quote.count;
  $("cart-items").innerHTML=cart.items.length?cart.items.map((item)=>{const product=catalog.get(item.id);return `<article class="cart-item" data-cart-item="${item.id}" style="--product-bg:${product.color}"><img src="assets/${product.image}" alt="" width="78" height="82"><div class="cart-item-info"><h3>${escape(product.name)}</h3><p>${money(product.price)} each · sample stock ${product.stock}</p><div class="cart-item-controls"><div class="quantity-control"><button data-cart-change="${item.id}" data-delta="-1" aria-label="Decrease ${escape(product.name)}">${icon("minus")}</button><span data-cart-quantity="${item.id}">${item.quantity}</span><button data-cart-change="${item.id}" data-delta="1" aria-label="Increase ${escape(product.name)}" ${item.quantity>=product.stock?"disabled":""}>${icon("plus")}</button></div><button class="cart-remove" data-remove="${item.id}">Remove</button></div></div><span class="cart-item-total">${money(product.price*item.quantity)}</span></article>`;}).join(""):`<div class="cart-empty">${icon("sprout")}<h3>A little room for green.</h3><p>Your demo cart is empty.<br>Find a little thing that makes you smile.</p><button id="empty-shop" class="button primary">Back to the greens${icon("arrow-right")}</button></div>`;
  const left=Math.max(0,6000-quote.subtotal);
  $("cart-summary").innerHTML=cart.items.length?`<p class="free-shipping">${left?`${money(left)} away from free standard local demo delivery.`:"Your standard local demo delivery is free."}<span><i style="width:${Math.min(100,quote.subtotal/6000*100)}%"></i></span></p>${totalMarkup(quote)}<button id="start-checkout" class="button primary cart-checkout">Try demo checkout${icon("arrow-right")}</button><p class="cart-fine">Local, standard delivery estimate. You choose the zone next.<br>No purchase. No payment. No actual fulfillment.</p><button id="clear-cart" class="cart-clear">Clear local cart</button>`:"";
  renderStorage();
  if(selected&&$("product-dialog").open)renderDetail();
}
function confirmCart(resetStorage=false){
  $("confirm-title").textContent=resetStorage?"Reset this browser’s saved cart?":"Clear this local cart?";
  $("confirm-description").textContent=resetStorage?"This replaces this shop’s saved cart, including unreadable data, with an empty supported cart. Other browser data is left alone.":"This only changes this browser’s demo cart. No real order is involved.";
  $("confirm-action").textContent=resetStorage?"Reset saved cart":"Clear local cart";
  confirmation=()=>{
    if(resetStorage){
      try{const next=emptyCart(),raw=JSON.stringify(next);localStorage.setItem(storageKey,raw);cart=next;expectedRaw=raw;storageIssue="";temporary=false;renderCart();renderCatalog();toast("Saved demo cart reset.");}
      catch{storageIssue="This browser cannot save the cart. Choose temporary mode to continue.";renderStorage();toast(storageIssue);}
    }else{
      try{saveCart({schema:1,revision:cart.revision+1,items:[]});toast("Local cart cleared.");}catch(error){toast(error.message);}
    }
  };open("confirm-dialog");
}
function quotePreferences(){return {zone:$("delivery-zone").value,speed:$("delivery-speed").value};}
function freshCheckout(){
  if(!cart.items.length||storageIssue){toast(storageIssue||"Add a little green thing first.");return;}
  hide("cart-dialog");checkout={stage:1,fingerprint:cartFingerprint(cart),cart:structuredClone(cart),stale:false};
  $("checkout-form").reset();$("checkout-error").textContent="";lastReceipt=null;
  renderCheckout();open("checkout-dialog");
}
function isCheckoutFresh(){
  if(!checkout)return false;
  let valid=checkout.fingerprint===cartFingerprint(cart);
  if(!temporary){try{valid=valid&&localStorage.getItem(storageKey)===expectedRaw&&!storageIssue;}catch{valid=false;}}
  if(!valid){checkout.stale=true;renderCheckout();}return valid;
}
function renderCheckout(){
  if(!checkout)return;
  const stage=checkout.stage;$("checkout-stale").hidden=!checkout.stale;
  document.querySelectorAll("[data-step]").forEach((step)=>step.classList.toggle("active",Number(step.dataset.step)===stage));
  $("checkout-preferences").hidden=stage!==1;$("checkout-review").hidden=stage!==2;$("checkout-complete").hidden=stage!==3;
  $("checkout-next").hidden=stage===3;$("checkout-next").disabled=checkout.stale;
  $("checkout-back").textContent=stage===3?"Back to the greens":stage===2?"Edit preferences":"Return to cart";
  $("checkout-next").innerHTML=stage===2?`Create demo receipt${icon("check")}`:`Review demo receipt${icon("arrow-right")}`;
  $("nickname").required=stage===1;
  if(stage!==2)$("checkout-review").innerHTML="";
  if(stage===1){
    const prefs=quotePreferences(),quote=totals(checkout.cart,prefs);
    $("delivery-preview").textContent=`${prefs.zone==="local"?"Local":"Farther-away"} ${prefs.speed} demo delivery: ${quote.shipping?money(quote.shipping):"free"}. Demo total ${money(quote.total)}. Tax not calculated.`;
  }
  if(stage===2){
    const prefs=quotePreferences(),quote=totals(checkout.cart,prefs);
    $("checkout-review").innerHTML=`<p class="review-intro">For <strong>${escape($("nickname").value.trim())}</strong>. This is a practice receipt only.</p>${checkout.cart.items.map((item)=>`<div class="review-item"><span>${escape(catalog.get(item.id).name)} × ${item.quantity}</span><span>${money(catalog.get(item.id).price*item.quantity)}</span></div>`).join("")}<p class="review-delivery">${prefs.zone==="local"?"Local":"Farther-away"} · ${prefs.speed} sample delivery<br>No address, payment or real order information is collected.</p>${totalMarkup(quote)}<label class="review-consent"><input id="demo-consent" type="checkbox" required><span>I understand this creates an unsent demo receipt and clears this local cart. Nothing will be purchased or shipped.</span></label>`;
  }
}
function downloadReceipt(){
  if(!lastReceipt)return;
  const url=URL.createObjectURL(new Blob([JSON.stringify(lastReceipt,null,2)+"\n"],{type:"application/json"}));
  const link=document.createElement("a");link.href=url;link.download="leekshop-unsent-demo-receipt.json";document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
function renderChat(){
  $("chat-messages").innerHTML=`<div class="chat-message">Hi, I’m your shopping side-leek. Try a product, category, budget, or “my cart”. I only match fixed rules in this sample shop.</div>${chat.map((message)=>message.role==="user"?`<div class="chat-message user">${escape(message.text)}</div>`:`<div class="chat-message">${escape(message.message)}${message.ids.length?`<div class="chat-products">${message.ids.map((id)=>{const product=catalog.get(id);return `<button data-chat-product="${id}" style="--product-bg:${product.color}"><img src="assets/${product.image}" alt="" width="35" height="38"><span>${escape(product.name)}<strong>${money(product.price)} · sample product</strong></span>${icon("arrow-up-right")}</button>`;}).join("")}</div>`:""}<p class="chat-rule">FIXED RULE: ${escape(message.rule)}</p></div>`).join("")}`;
  const turns=chat.filter((message)=>message.role==="user").length;
  $("chat-input").disabled=turns>=10;$("chat-form").querySelector("button").disabled=turns>=10;
  $("chat-limit").textContent=turns>=10?"10-message limit reached. Clear chat to start over.":`${10-turns} messages left in this local conversation.`;
  $("chat-messages").scrollTop=$("chat-messages").scrollHeight;
}
function sendChat(text){
  if(chat.filter((message)=>message.role==="user").length>=10){toast("Clear chat before starting a new conversation.");return;}
  try{const reply=assistantReply(text,cart);chat.push({role:"user",text},{role:"assistant",...reply});$("chat-input").value="";renderChat();}
  catch(error){toast(error.message);}
}
function openBot(prompt=""){open("bot-dialog");if(prompt)sendChat(prompt);else $("chat-input").focus();}
function closeMobileNav(){$("mobile-nav").hidden=true;$("mobile-menu").setAttribute("aria-expanded","false");}
$("category-buttons").innerHTML=["All","Collectibles","Wearables","Home","Stationery"].map((value)=>`<button data-category="${value}" class="${value==="All"?"active":""}" aria-pressed="${value==="All"}">${value==="All"?"All the greens":value}</button>`).join("");
readStored();renderCatalog();renderCart();renderChat();
$("search").addEventListener("input",(event)=>{query=event.target.value;renderCatalog();});
$("sort").addEventListener("change",(event)=>{sort=event.target.value;renderCatalog();});
$("category-buttons").addEventListener("click",(event)=>{const button=event.target.closest("[data-category]");if(button){category=button.dataset.category;renderCatalog();}});
$("reset-catalog").addEventListener("click",()=>{query="";category="All";$("search").value="";renderCatalog();});
$("search-focus").addEventListener("click",()=>{$("shop").scrollIntoView();$("search").focus({preventScroll:true});});
$("product-grid").addEventListener("click",(event)=>{const button=event.target.closest("button");if(button?.dataset.detail)showProduct(button.dataset.detail);if(button?.dataset.add)add(button.dataset.add);});
$("product-detail").addEventListener("click",(event)=>{
  const button=event.target.closest("button");if(!button)return;
  if(button.dataset.detailChange){selectedQuantity+=Number(button.dataset.detailChange);renderDetail();document.querySelector(`[data-detail-change="${button.dataset.detailChange}"]`)?.focus({preventScroll:true});}
  if(button.id==="detail-add"&&add(selected,selectedQuantity)){renderDetail();}
});
for(const id of ["open-cart","toast-cart"])$(id).addEventListener("click",()=>{renderCart();open("cart-dialog");$("toast").classList.remove("show");});
$("cart-dialog").addEventListener("click",(event)=>{
  const button=event.target.closest("button");if(!button)return;
  if(button.dataset.cartChange||button.dataset.remove){
    const id=button.dataset.cartChange||button.dataset.remove,old=cart.items.find((item)=>item.id===id)?.quantity||0;
    try{saveCart(setQuantity(cart,id,button.dataset.remove?0:old+Number(button.dataset.delta)));}catch(error){toast(error.message);}
  }
  if(button.id==="empty-shop"){hide("cart-dialog");$("shop").scrollIntoView();}
  if(button.id==="clear-cart")confirmCart();
  if(button.id==="start-checkout")freshCheckout();
});
$("checkout-form").addEventListener("submit",(event)=>{
  event.preventDefault();if(!checkout||checkout.stage===3)return;
  if(!isCheckoutFresh())return;
  try{
    checkoutDraft(checkout.cart,{nickname:$("nickname").value,...quotePreferences(),confirmed:true});
    if(checkout.stage===1){checkout.stage=2;renderCheckout();return;}
    const receipt=checkoutDraft(checkout.cart,{nickname:$("nickname").value,...quotePreferences(),confirmed:$("demo-consent").checked});
    saveCart({schema:1,revision:cart.revision+1,items:[]});lastReceipt=receipt;checkout.stage=3;renderCheckout();$("checkout-error").textContent="";
  }catch(error){$("checkout-error").textContent=error.message;}
});
$("checkout-back").addEventListener("click",()=>{
  if(checkout?.stage===2&&!checkout.stale){checkout.stage=1;renderCheckout();$("checkout-error").textContent="";return;}
  const done=checkout?.stage===3;hide("checkout-dialog");if(!done){renderCart();open("cart-dialog");}
});
for(const id of ["delivery-zone","delivery-speed"])$(id).addEventListener("change",()=>{if(checkout?.stage===1)renderCheckout();});
$("download-receipt").addEventListener("click",downloadReceipt);
for(const id of ["open-story","mobile-story","story-footer","scope-footer"])$(id).addEventListener("click",()=>{closeMobileNav();open("story-dialog");});
for(const id of ["open-bot-nav","mobile-bot","hero-bot","open-bot-feature","floating-bot"])$(id).addEventListener("click",()=>{closeMobileNav();openBot();});
document.querySelectorAll("[data-bot-prompt]").forEach((button)=>button.addEventListener("click",()=>openBot(button.dataset.botPrompt)));
$("chat-form").addEventListener("submit",(event)=>{event.preventDefault();sendChat($("chat-input").value);});
$("chat-messages").addEventListener("click",(event)=>{const button=event.target.closest("[data-chat-product]");if(button){hide("bot-dialog");showProduct(button.dataset.chatProduct);}});
$("clear-chat").addEventListener("click",()=>{chat=[];renderChat();$("chat-input").focus();});
$("mobile-menu").addEventListener("click",()=>{$("mobile-nav").hidden=!$("mobile-nav").hidden;$("mobile-menu").setAttribute("aria-expanded",String(!$("mobile-nav").hidden));});
$("mobile-nav").querySelector("a").addEventListener("click",closeMobileNav);
document.querySelectorAll("[data-close]").forEach((button)=>button.addEventListener("click",()=>hide(button.dataset.close)));
$("product-dialog").addEventListener("close",()=>{if(location.hash.startsWith("#product-")){const url=new URL(location.href);url.hash="shop";history.replaceState(null,"",url);}});
$("confirm-action").addEventListener("click",()=>{confirmation?.();confirmation=null;hide("confirm-dialog");});
$("reload-storage").addEventListener("click",()=>{readStored();renderCart();renderCatalog();if(checkout&&checkout.stage!==3){checkout.stale=true;renderCheckout();}});
$("reset-storage").addEventListener("click",()=>confirmCart(true));
$("temporary-cart").addEventListener("click",()=>{temporary=true;storageIssue="";cart=emptyCart();renderCart();renderCatalog();if(checkout&&checkout.stage!==3){checkout.stale=true;renderCheckout();}toast("Temporary mode selected. This cart resets on refresh.");});
addEventListener("storage",(event)=>{if((event.key!==storageKey&&event.key!==null)||temporary)return;readStored();renderCart();renderCatalog();if(checkout&&checkout.stage!==3){checkout.stale=true;renderCheckout();}toast("Saved cart changed in another tab. Review the current cart.");});
function deepLink(){const id=location.hash.replace(/^#product-/,"");if(location.hash.startsWith("#product-")&&catalog.has(id))showProduct(id);}
addEventListener("hashchange",deepLink);deepLink();
