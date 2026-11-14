const products=[
  {id:'sony',name:'Sony WH-1000XM5 Wireless Headphones',category:'Audio',art:'headphones',reference:34999,sale:18999,stock:12,capacity:55,rating:'4.8',reviews:'2,341'},
  {id:'macbook',name:'MacBook Air M3',category:'Laptops',art:'laptop',reference:119900,sale:89900,stock:8,capacity:40,rating:'4.9',reviews:'1,248'},
  {id:'airpods',name:'AirPods Pro 2',category:'Audio',art:'earbuds',reference:24900,sale:16900,stock:23,capacity:50,rating:'4.8',reviews:'3,612'},
  {id:'samsung',name:'Samsung 65" OLED TV',category:'Smart Home',art:'tv',reference:219900,sale:139900,stock:3,capacity:20,rating:'4.7',reviews:'892'},
  {id:'switch',name:'Nintendo Switch OLED',category:'Gaming',art:'gaming',reference:34900,sale:27900,stock:18,capacity:30,rating:'4.9',reviews:'2,057'},
  {id:'gopro',name:'GoPro Hero 12',category:'Cameras',art:'camera',reference:39900,sale:24900,stock:6,capacity:30,rating:'4.6',reviews:'746'},
  {id:'kindle',name:'Kindle Paperwhite',category:'Readers',art:'reader',reference:14900,sale:9400,stock:31,capacity:50,rating:'4.8',reviews:'1,109'},
  {id:'bose',name:'Bose SoundLink Flex',category:'Audio',art:'speaker',reference:14900,sale:8900,stock:2,capacity:24,rating:'4.7',reviews:'984'},
  {id:'ipad',name:'iPad 10th Generation',category:'Tablets',art:'tablet',reference:44900,sale:32900,stock:15,capacity:30,rating:'4.8',reviews:'1,523'},
  {id:'logitech',name:'Logitech MX Master 3S',category:'Accessories',art:'mouse',reference:9900,sale:6400,stock:22,capacity:40,rating:'4.9',reviews:'1,782'}
];
const byId=new Map(products.map(product=>[product.id,product])),gridProducts=products.slice(1);
const lightningIds=['airpods','gopro','bose','kindle','logitech','ipad'];
const categories=['All Deals','Laptops','Audio','Smartphones','Cameras','Gaming','Accessories','Smart Home','Tablets','Readers'];
const start=Date.now(),midnight=new Date();midnight.setHours(24,0,0,0);
const saleEnd=midnight.getTime(),lightningEnd=Math.min(saleEnd,start+2*3600000);
const deadlines=new Map(products.map(product=>[product.id,Math.min(saleEnd,start+(product.id==='sony'?(4*3600+22*60+8):(6*3600+22*60))*1000)]));
const cart=new Map(),saved=new Set(),recent=[];
let category='All Deals',query='',savedOnly=false,sorting='featured',toastTimer,cartExpiryKey='';
const detail=document.querySelector('#detail-dialog'),detailContent=document.querySelector('#detail-content'),cartDialog=document.querySelector('#cart-dialog');
const money=cents=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(cents/100);
const discount=product=>Math.round((1-product.sale/product.reference)*100);
const remaining=id=>byId.get(id).stock-(cart.get(id)?.quantity||0);
const expires=(id,lightning=false)=>lightning?lightningEnd:deadlines.get(id);
const art=(product,className='')=>`<svg class="${className}" viewBox="0 0 400 300" role="img" aria-label="Original generic ${product.art} illustration"><use href="assets/devices.svg#${product.art}"/></svg>`;
function text(tag,value,className){const element=document.createElement(tag);element.textContent=value;if(className)element.className=className;return element;}
function toast(message){const element=document.querySelector('#toast');element.textContent=message;element.classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>element.classList.remove('visible'),3200);}
function stockMarkup(product){
  const count=remaining(product.id),percent=count/product.capacity*100;
  return `<div class="stock-track"><i class="${percent<20?'low':percent<=50?'medium':''}" style="width:${Math.max(0,percent)}%"></i></div><div class="stock-description"><strong>${count===0?'Demo allocation full':`${count} demo units available`}</strong><span>${Math.round(percent)}% left</span></div>`;
}
function card(product,lightning=false){
  const price=lightning?Math.round(product.sale*.9):product.sale;
  return `<article class="product-card" data-product="${product.id}"><div class="card-art"><span class="discount-badge">${lightning?'EXTRA 10% OFF':`−${discount(product)}%`}</span><button data-detail="${product.id}" aria-label="View ${product.name.replaceAll('"','&quot;')} demo details">${art(product)}</button><button class="save-button" data-save="${product.id}" aria-label="${saved.has(product.id)?'Unsave':'Save'} ${product.name.replaceAll('"','&quot;')}" aria-pressed="${saved.has(product.id)}">${saved.has(product.id)?'♥':'♡'}</button></div><div class="card-details"><span class="category-label">${product.category.toUpperCase()} · DEMO OFFER</span><h3><button data-detail="${product.id}">${product.name.replaceAll('&','&amp;').replaceAll('<','&lt;')}</button></h3><p class="card-rating"><b>★★★★★</b> ${product.rating} · ${product.reviews} sample reviews</p><div class="card-price"><strong>${money(price)}</strong><s>${money(lightning?product.sale:product.reference)}</s></div><p class="card-timer">Preview ends in <strong data-timer="${lightning?'lightning':product.id}"></strong></p><div data-stock="${product.id}">${stockMarkup(product)}</div><button class="amber-button full-button" data-add="${product.id}"${lightning?' data-lightning="true"':''}>Add to demo cart <span>+</span></button></div></article>`;
}
function renderGrid(){
  const matches=gridProducts.filter(product=>(category==='All Deals'||product.category===category)&&(!savedOnly||saved.has(product.id))&&`${product.name} ${product.category}`.toLowerCase().includes(query.toLowerCase()));
  if(sorting==='price-low')matches.sort((a,b)=>a.sale-b.sale);
  if(sorting==='price-high')matches.sort((a,b)=>b.sale-a.sale);
  if(sorting==='saving')matches.sort((a,b)=>(1-b.sale/b.reference)-(1-a.sale/a.reference));
  document.querySelector('#deals-grid').innerHTML=matches.map((product,index)=>`${card(product)}${index===2&&matches.length>3?'<aside class="urgency-banner"><div><strong>Good timing looks good on you.</strong><small>“42 sold in the last hour” is a brief example, not a live sales claim.</small></div><span>DEMO PRICES. NO REAL SCARCITY.</span></aside>':''}`).join('');
  document.querySelector('#empty').hidden=matches.length>0;
  document.querySelector('#results').textContent=`${matches.length} of 9 additional demo deals${category!=='All Deals'?` · ${category}`:''}${savedOnly?' · Saved items':''}${query?` · “${query}”`:''}`;
  document.querySelectorAll('[data-category]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.category===category)));
  document.querySelector('#wishlist-filter').setAttribute('aria-pressed',String(savedOnly));updateTimers();
}
function renderRecent(){
  const ids=recent.length?recent.slice(0,4):['macbook','airpods','gopro','logitech'];
  document.querySelector('#recent-label').textContent=recent.length?'Viewed during this page session. No stored browsing history.':'Curated examples until you open a product. No previous browsing history is claimed.';
  document.querySelector('#recent-grid').innerHTML=ids.map(id=>{const product=byId.get(id);return `<article class="recent-card"><button data-detail="${id}" aria-label="View ${product.name.replaceAll('"','&quot;')} demo details">${art(product)}</button><small>${recent.length?'VIEWED THIS SESSION':'CURATED EXAMPLE'} · ${discount(product)}% SAMPLE SAVING</small><h3>${product.name}</h3><p>${money(product.sale)}<s>${money(product.reference)}</s></p></article>`;}).join('');
}
function renderCart(){
  cartExpiryKey=[...cart].filter(([,line])=>Date.now()>=line.deadline).map(([id])=>id).join(',');
  let count=0,subtotal=0;
  const lines=[...cart].map(([id,line])=>{
    const product=byId.get(id);count+=line.quantity;subtotal+=line.quantity*line.price;
    return `<article class="cart-line" data-cart-id="${id}">${art(product)}<div><h3>${product.name}</h3><p>${money(line.price)} each · ${line.lightning?'10% extra demo saving':'Sample sale price'}${Date.now()>=line.deadline?' · OFFER EXPIRED':''}</p><div class="quantity"><button data-quantity="${id}" data-delta="-1" aria-label="Decrease ${product.name.replaceAll('"','&quot;')} quantity">−</button><span data-line-quantity>${line.quantity}</span><button data-quantity="${id}" data-delta="1" aria-label="Increase ${product.name.replaceAll('"','&quot;')} quantity"${remaining(id)<=0||Date.now()>=line.deadline?' disabled':''}>+</button><button data-remove="${id}">Remove</button></div></div><strong class="line-price">${money(line.price*line.quantity)}</strong></article>`;
  });
  const shipping=subtotal===0||subtotal>=5000?0:690;
  document.querySelector('#cart-lines').innerHTML=lines.join('')||'<p class="cart-empty">Your demo cart is empty. Find your next upgrade.</p>';
  document.querySelector('#cart-totals').innerHTML=count?`<div class="cart-totals"><p>Sample subtotal <strong id="cart-subtotal">${money(subtotal)}</strong></p><p>Demo shipping <strong>${shipping===0?'Free':money(shipping)}</strong></p><small>Tax is not calculated. There is no checkout or fulfillment service.</small><p>Sample pre-tax total <strong id="cart-total">${money(subtotal+shipping)}</strong></p></div>`:'';
  document.querySelector('#cart-count').textContent=count;
  document.querySelector('#sticky-count').textContent=count;
  document.querySelector('#sticky-total').textContent=money(subtotal+shipping);
  document.querySelector('#cart-sticky').hidden=!count;
  const expired=[...cart.values()].some(line=>Date.now()>=line.deadline);
  document.querySelector('#checkout').disabled=!count||expired;
  document.querySelector('#checkout-status').textContent=expired?'A sample offer in your cart has expired. Remove it before previewing checkout. No order has been placed.':'Local preview only. No account, payment or order will be created.';
}
function sync(){
  document.querySelector('#saved-count').textContent=saved.size;
  document.querySelector('#featured-stock').innerHTML=stockMarkup(byId.get('sony'));
  document.querySelectorAll('[data-stock]').forEach(element=>{element.innerHTML=stockMarkup(byId.get(element.dataset.stock));});
  document.querySelectorAll('[data-save]').forEach(button=>{const active=saved.has(button.dataset.save);button.textContent=active?'♥':'♡';button.setAttribute('aria-pressed',String(active));button.setAttribute('aria-label',`${active?'Unsave':'Save'} ${byId.get(button.dataset.save).name}`);});
  updateTimers();renderCart();
}
function add(id,lightning=false){
  const product=byId.get(id),deadline=expires(id,lightning);
  if(Date.now()>=deadline){toast('This sample offer has ended. No item added.');return;}
  if(remaining(id)<=0){toast('All demo units are in your local cart. No more can be added.');return;}
  const price=lightning?Math.round(product.sale*.9):product.sale;
  const previous=cart.get(id);
  if(previous){
    if(Date.now()>=previous.deadline){toast('Remove the expired sample item before adding this offer.');return;}
    previous.quantity++;
    if(price<previous.price){previous.price=price;previous.lightning=lightning;previous.deadline=deadline;}
  }else cart.set(id,{quantity:1,price,lightning,deadline});
  sync();toast(`${product.name} added to your local demo cart.`);
}
function detailProduct(id){
  const product=byId.get(id);const index=recent.indexOf(id);if(index>=0)recent.splice(index,1);recent.unshift(id);renderRecent();
  detailContent.innerHTML=`${art(product,'detail-art')}<p class="eyebrow">${product.category.toUpperCase()} · ILLUSTRATIVE PRODUCT</p><h2>${product.name}</h2><div class="detail-price">${money(product.sale)}<s>${money(product.reference)}</s></div><p>Sample saving: ${money(product.reference-product.sale)} (${((1-product.sale/product.reference)*100).toFixed(1)}%). This is a fictional local offer using the brief’s reference price, not a current market price or verified promotion.</p><p>Artwork is an original generic illustration, not an official product photograph. Model specifications, reviews, warranty, seller authorization and stock are unverified. Cart allocations only affect this page’s demo inventory.</p><div data-stock="${id}">${stockMarkup(product)}</div><button class="amber-button detail-action" data-add="${id}">Add to demo cart +</button>`;
  updateTimers();detail.showModal();
}
function openCart(){if(detail.open)detail.close();renderCart();cartDialog.showModal();}
function formatTime(deadline){
  const value=Math.max(0,Math.ceil((deadline-Date.now())/1000));
  return [Math.floor(value/3600),Math.floor(value%3600/60),value%60].map(number=>String(number).padStart(2,'0')).join(':');
}
function updateTimers(){
  const master=formatTime(saleEnd).split(':');
  for(const [index,id] of ['hours','minutes','seconds'].entries())document.getElementById(id).textContent=master[index];
  document.querySelectorAll('[data-timer]').forEach(element=>{const deadline=element.dataset.timer==='lightning'?lightningEnd:deadlines.get(element.dataset.timer);element.textContent=Date.now()>=deadline?'Offer ended':formatTime(deadline);});
  document.querySelectorAll('[data-add]').forEach(button=>{const expired=Date.now()>=expires(button.dataset.add,button.dataset.lightning==='true');const unavailable=remaining(button.dataset.add)<=0;button.disabled=expired||unavailable;button.innerHTML=expired?'Demo offer ended':unavailable?'Demo allocation full':'Add to demo cart <span>+</span>';});
}
const infos={
  'Account':'No account system is connected. Your demo cart and saved items remain in this page’s memory and reset on refresh. No identity or password is collected.',
  'New arrivals':'Only the displayed sample deal catalog is implemented. No real-time arrivals, manufacturer feed or additional products are available.',
  'Support':'This is a fictional store. No contact center, email address, order status service or support request is connected.',
  'Shipping & returns':'The brief proposes free shipping over $50 and 30-day returns. The cart models free shipping at $50 or more and $6.90 below, before tax. These are sample policies only; no real delivery, return eligibility or purchase exists.',
  'Price matching':'The price-match guarantee is a concept from the brief. No actual guarantee, claim submission or retailer agreement is provided. Always independently check current prices, specifications and seller authorization.',
  'Privacy':'Search, filters, saved items, viewed products, cart allocations and email previews stay in this document’s memory. No analytics, cookies, browser storage, user accounts or network APIs are used. Refresh resets everything. Countdown deadlines are calculated once on opening this demo: local midnight, up to 6h22m for grid offers, 4h22m08s for headphones, and 2h for lightning offers, capped by midnight. They do not automatically restart while the page is open.'
};
document.addEventListener('click',event=>{
  const addButton=event.target.closest('[data-add]');if(addButton){add(addButton.dataset.add,addButton.dataset.lightning==='true');return;}
  const saveButton=event.target.closest('[data-save]');if(saveButton){const id=saveButton.dataset.save;saved.has(id)?saved.delete(id):saved.add(id);if(savedOnly)renderGrid();sync();return;}
  const detailButton=event.target.closest('[data-detail]');if(detailButton){detailProduct(detailButton.dataset.detail);return;}
  const categoryButton=event.target.closest('[data-category]');if(categoryButton){category=categoryButton.dataset.category;renderGrid();return;}
  const quantityButton=event.target.closest('[data-quantity]');if(quantityButton){
    const id=quantityButton.dataset.quantity,line=cart.get(id);
    if(quantityButton.dataset.delta==='1'){add(id,line.lightning);return;}
    if(line.quantity>1)line.quantity--;else cart.delete(id);sync();return;
  }
  const remove=event.target.closest('[data-remove]');if(remove){cart.delete(remove.dataset.remove);sync();return;}
  const info=event.target.closest('[data-info]');if(info){detailContent.replaceChildren(text('p','VOLTEDGE · LOCAL DEMO','eyebrow'),text('h2',info.dataset.info),text('p',infos[info.dataset.info]));detail.showModal();return;}
  const categoryLink=event.target.closest('[data-category-link]');if(categoryLink){category=categoryLink.dataset.categoryLink;renderGrid();document.querySelector('#deals').scrollIntoView();closeMenu();}
});
document.querySelector('#account').addEventListener('click',()=>{detailContent.replaceChildren(text('p','VOLTEDGE · LOCAL DEMO','eyebrow'),text('h2','Your account, reimagined later.'),text('p',infos.Account));detail.showModal();});
document.querySelector('.dialog-close').addEventListener('click',()=>detail.close());
document.querySelector('.cart-close').addEventListener('click',()=>cartDialog.close());
document.querySelector('#open-cart').addEventListener('click',openCart);
document.querySelector('#sticky-cart').addEventListener('click',openCart);
document.querySelector('#checkout').addEventListener('click',()=>{
  if(!cart.size||[...cart.values()].some(line=>Date.now()>=line.deadline)){renderCart();return;}
  document.querySelector('#checkout-status').textContent=`Checkout preview only: ${[...cart.values()].reduce((sum,line)=>sum+line.quantity,0)} sample items, ${document.querySelector('#cart-total').textContent} before tax. No payment collected, stock reserved or order placed.`;
});
document.querySelector('#sort').addEventListener('change',event=>{sorting=event.target.value;renderGrid();});
for(const id of ['search','mobile-search'])document.getElementById(id).addEventListener('input',event=>{query=event.target.value.trim();document.querySelector('#search').value=event.target.value;document.querySelector('#mobile-search').value=event.target.value;renderGrid();});
document.querySelector('#search-form').addEventListener('submit',event=>{event.preventDefault();document.querySelector('#deals').scrollIntoView();});
document.querySelector('#wishlist-filter').addEventListener('click',()=>{savedOnly=!savedOnly;renderGrid();});
document.querySelector('#reset').addEventListener('click',()=>{query='';category='All Deals';savedOnly=false;document.querySelector('#search').value='';document.querySelector('#mobile-search').value='';renderGrid();});
document.querySelector('#alert-form').addEventListener('submit',event=>{event.preventDefault();if(!event.currentTarget.reportValidity())return;document.querySelector('#email-status').textContent=`Preview ready for ${event.currentTarget.elements.email.value.trim()}. No subscription created or email sent.`;event.currentTarget.reset();});
function closeMenu(){document.querySelector('#nav').classList.remove('open');document.querySelector('#menu').setAttribute('aria-expanded','false');}
document.querySelector('#menu').addEventListener('click',()=>{const open=document.querySelector('#nav').classList.toggle('open');document.querySelector('#menu').setAttribute('aria-expanded',String(open));});
document.querySelectorAll('#nav a').forEach(link=>link.addEventListener('click',closeMenu));
document.addEventListener('keydown',event=>{if(event.key==='Escape')closeMenu();});
const track=document.querySelector('#lightning-track');
const scrollBehavior=()=>matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth';
document.querySelector('#lightning-prev').addEventListener('click',()=>track.scrollBy({left:-252,behavior:scrollBehavior()}));
document.querySelector('#lightning-next').addEventListener('click',()=>track.scrollBy({left:252,behavior:scrollBehavior()}));
let drag=null,suppressClick=false;
track.addEventListener('pointerdown',event=>{if(event.pointerType!=='mouse'||event.button!==0||event.target.closest('button'))return;drag={start:event.clientX,scroll:track.scrollLeft,moved:false};track.setPointerCapture(event.pointerId);});
track.addEventListener('pointermove',event=>{if(!drag)return;const distance=event.clientX-drag.start;if(Math.abs(distance)>5){drag.moved=true;track.classList.add('dragging');track.scrollLeft=drag.scroll-distance;}});
function endDrag(){if(drag?.moved)suppressClick=true;drag=null;track.classList.remove('dragging');}
track.addEventListener('pointerup',endDrag);track.addEventListener('pointercancel',endDrag);
track.addEventListener('click',event=>{if(suppressClick){event.preventDefault();event.stopPropagation();suppressClick=false;}},true);
document.querySelector('#category-tabs').innerHTML=categories.map(name=>`<button data-category="${name}" aria-pressed="${name==='All Deals'}">${name}<small>${name==='All Deals'?gridProducts.length:gridProducts.filter(product=>product.category===name).length}</small></button>`).join('');
document.querySelector('#featured-percent').textContent=`${discount(byId.get('sony'))}%`;
const featured=byId.get('sony');
document.querySelector('#featured-saving').textContent=`You save ${money(featured.reference-featured.sale)} (${((1-featured.sale/featured.reference)*100).toFixed(1)}% of sample reference price)`;
document.querySelector('#max-discount').textContent=`${Math.max(...products.map(product=>(1-(lightningIds.includes(product.id)?Math.round(product.sale*.9):product.sale)/product.reference)*100)).toFixed(1)}%`;
track.innerHTML=lightningIds.map(id=>card(byId.get(id),true)).join('');
renderGrid();renderRecent();sync();
const ticker=setInterval(()=>{updateTimers();const expired=[...cart].filter(([,line])=>Date.now()>=line.deadline).map(([id])=>id).join(',');if(expired!==cartExpiryKey)renderCart();},1000);
window.addEventListener('pagehide',()=>{clearInterval(ticker);clearTimeout(toastTimer);});
