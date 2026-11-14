const designs=[
  {id:'birthday',name:'Birthday',phrase:'a little celebration.',bg:'#dcc7e7',fg:'#785d88'},
  {id:'thanks',name:'Thank You',phrase:'you make life lovely.',bg:'#d8dfce',fg:'#697b59'},
  {id:'congrats',name:'Congratulations',phrase:'look at you go.',bg:'#e9d8b8',fg:'#9a7b45'},
  {id:'holiday',name:'Holiday',phrase:'a little winter wonder.',bg:'#cbd8d9',fg:'#5e7f81'},
  {id:'love',name:'Love',phrase:'all my love, always.',bg:'#e7cbd4',fg:'#a06f80'},
  {id:'because',name:'Just Because',phrase:'no reason needed.',bg:'#c8c9dd',fg:'#6b6c8c'},
  {id:'wedding',name:'Wedding',phrase:'to your beautiful beginning.',bg:'#e9e3d6',fg:'#a38958'},
  {id:'graduation',name:'Graduation',phrase:'your next chapter.',bg:'#616c68',fg:'#e3dfce'}
];
let selected='birthday',amount=7500,delivery='digital',uploaded=null,uploadVersion=0;
const saved=new Set(),cart=[];
const form=document.querySelector('#gift-form'),dialog=document.querySelector('#dialog'),dialogContent=document.querySelector('#dialog-content');
const $=selector=>document.querySelector(selector);
const money=cents=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(cents/100);
const localDate=date=>`${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
const tomorrow=new Date();tomorrow.setDate(tomorrow.getDate()+1);$('#send-date').min=localDate(tomorrow);
const design=()=>designs.find(item=>item.id===selected)||{id:'custom',name:'Your own image',phrase:'a little something for you.',bg:'#54435f',fg:'#fff9ff'};
function text(tag,value,className){const element=document.createElement(tag);element.textContent=value;if(className)element.className=className;return element;}
function artwork(item){
  let shape='';
  if(item.id==='birthday')shape='<circle cx="330" cy="68" r="73" fill="none" stroke-width="23"/><path d="M253 198L281 212M319 180L330 211M351 142L373 151M40 23L32 44M57 155L33 164M91 225L102 202" stroke-width="5"/><circle cx="213" cy="39" r="4"/><circle cx="342" cy="235" r="4"/>';
  if(item.id==='thanks')shape='<path d="M296 250Q244 149 332 34M276 200Q315 207 342 181M278 153Q248 141 255 111M294 106Q327 112 346 88M311 63Q283 52 294 26" fill="none" stroke-width="2"/><g stroke="none"><ellipse cx="328" cy="187" rx="26" ry="9" transform="rotate(-20 328 187)"/><ellipse cx="257" cy="126" rx="10" ry="24" transform="rotate(-20 257 126)"/><ellipse cx="334" cy="93" rx="23" ry="8" transform="rotate(-25 334 93)"/><ellipse cx="291" cy="42" rx="9" ry="23" transform="rotate(-20 291 42)"/></g>';
  if(item.id==='congrats')shape='<path d="M309 48L318 84 354 93 318 102 309 138 300 102 264 93 300 84ZM351 153L357 176 380 182 357 188 351 211 345 188 322 182 345 176ZM238 20L241 33 254 36 241 39 238 52 235 39 222 36 235 33Z" stroke="none"/>';
  if(item.id==='holiday')shape='<g fill="none" stroke-width="2"><path d="M316 29V168M256 64L376 133M256 133L376 64M305 43L316 53 327 43M305 154L316 144 327 154M273 61L276 76 261 78M371 118L357 120 360 135M261 117L276 120 273 135M359 61L356 77 371 78"/><circle cx="316" cy="99" r="42"/></g>';
  if(item.id==='love')shape='<path d="M308 194C283 172 233 137 233 97C233 46 294 37 308 76C324 37 385 46 385 97C385 137 333 172 308 194Z" stroke="none"/><path d="M50 24C31 0 7 28 50 53C93 28 69 0 50 24Z" stroke="none"/>';
  if(item.id==='because')shape='<g stroke-width="25" fill="none"><path d="M304 -30C214 51 385 61 297 144S340 244 275 282"/><path d="M363 -30C273 51 444 61 356 144S399 244 334 282"/></g>';
  if(item.id==='wedding')shape='<g stroke-width="4" fill="none"><circle cx="284" cy="113" r="49"/><circle cx="335" cy="132" r="49"/><path d="M274 63L284 47 294 63M284 47V27"/></g>';
  if(item.id==='graduation')shape='<path d="M298 61L376 98 298 134 220 98Z" stroke-width="2" fill="none"/><path d="M252 118V153Q298 184 345 153V118M373 101V163M365 160H381V181H365Z" stroke-width="3" fill="none"/>';
  return `<svg viewBox="0 0 400 250" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><rect width="400" height="250" fill="${item.bg}"/><g fill="${item.fg}" stroke="${item.fg}" opacity=".28">${shape}</g></svg>`;
}
function paintCard(container){
  const item=design(),custom=selected==='custom'&&uploaded;
  container.innerHTML=custom?`<img alt="Your locally selected gift card artwork" src="${uploaded.url}">`:artwork(item);
  const overlay=text('span','','card-overlay');overlay.style.color=item.fg;
  if(custom){overlay.style.background='linear-gradient(90deg,#23162b99,transparent)';}
  const bottom=text('span','','card-bottom');bottom.append(text('span','LOCAL DEMO · NOT REDEEMABLE'),text('span',amount===null?'—':money(amount),'card-value'));
  overlay.append(text('span','LUMINA','card-wordmark'),text('span',item.phrase,'card-phrase'),bottom);container.append(overlay);
}
function updateDateValidity(){
  const field=$('#send-date');
  const next=new Date();next.setDate(next.getDate()+1);field.min=localDate(next);
  field.setCustomValidity(!field.disabled&&(!field.value||field.value<field.min)?'Choose a date after today for this local preview.':'');
}
function update(){
  const item=design(),recipient=$('#recipient').value.trim(),sender=$('#sender').value.trim(),message=$('#message').value;
  paintCard($('#card-front'));paintCard($('#summary-card'));
  $('#back-message').textContent=message||'A little something, just for you.';
  $('#back-recipient').textContent=`To ${recipient||'someone wonderful'} · From ${sender||'you'}`;
  $('#summary-design').textContent=item.name;
  $('#summary-recipient').textContent=`For ${recipient||'someone wonderful'}`;
  $('#summary-sender').textContent=`From ${sender||'you'}`;
  $('#summary-message').textContent=message||'A little something, just for you.';
  $('#message-count').textContent=`${message.length} / 200`;
  const premium=delivery==='physical'&&$('#premium').checked;
  $('#summary-value').textContent=amount===null?'Choose a valid amount':money(amount);
  $('#summary-packaging').textContent=delivery==='digital'?'Not applicable':premium?'Gift box + ribbon · +$5':'Standard · $0';
  $('#summary-total').textContent=amount===null?'—':money(amount+(premium?500:0));
  $('#mobile-total').textContent=$('#summary-total').textContent;
  const scheduled=$('[name="timing"]:checked').value==='schedule';
  $('#summary-delivery').textContent=delivery==='physical'?'Physical · no delivery':scheduled?`Digital · ${$('#send-date').value||'choose a date'}`:'Digital · preview now';
  $('#preview-mode').textContent=`${delivery.toUpperCase()} GIFT CARD · LIVE PREVIEW`;
  $('#preview-stage').classList.toggle('physical',delivery==='physical');
  $('#preview-stage').classList.toggle('premium',premium);
  $('#physical-preview-label').hidden=delivery!=='physical';
  $('#physical-preview-label').textContent=premium?'Premium ribbon-and-box concept · +$5.00':'Standard physical-card concept · no fulfillment';
  for(const id of ['add-cart','buy-now','mobile-add'])document.getElementById(id).disabled=amount===null;
  document.querySelectorAll('[data-amount]').forEach(button=>button.setAttribute('aria-pressed',String(Number(button.dataset.amount)*100===amount&&$('#custom-amount').value==='')));
  document.querySelectorAll('[data-design]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.design===selected)));
  $('#save-design').textContent=saved.has(selected)?'♥':'♡';$('#save-design').setAttribute('aria-pressed',String(saved.has(selected)));
  $('#saved-count').textContent=saved.size;$('#cart-count').textContent=cart.length;
  updateDateValidity();
}
function changeDelivery(){
  const physical=delivery==='physical',scheduled=$('[name="timing"]:checked').value==='schedule';
  $('#digital-fields').hidden=physical;$('#physical-fields').hidden=!physical;
  $('#recipient-email').disabled=physical;$('#recipient-email').required=!physical;
  for(const id of ['address','city','region','postal','country']){document.getElementById(id).disabled=!physical;document.getElementById(id).required=physical;}
  $('#premium').disabled=!physical;$('#reminder').disabled=physical;
  document.querySelectorAll('[name="timing"]').forEach(input=>input.disabled=physical);
  $('#send-date').disabled=physical||!scheduled;$('#send-date').required=!physical&&scheduled;$('#date-label').hidden=physical||!scheduled;
  $('#download-reminder').hidden=physical||!$('#reminder').checked;
  document.querySelectorAll('[data-delivery]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.delivery===delivery)));update();
}
function chooseDesign(id){selected=id;$('#card-flip').classList.remove('flipped');$('#card-flip').setAttribute('aria-pressed','false');$('#card-flip').setAttribute('aria-label','Show gift card back');update();}
function validate(){
  if(amount===null){$('#custom-amount').focus();return false;}
  for(const input of form.querySelectorAll('input[required]'))if(!input.disabled&&input.type!=='date'&&input.type!=='file')input.setCustomValidity(input.value.trim()?'':'Complete this field for the local preview.');
  updateDateValidity();return form.reportValidity();
}
function snapshot(){return {design:design().name,amount,recipient:$('#recipient').value.trim(),sender:$('#sender').value.trim(),message:$('#message').value,delivery,email:delivery==='digital'?$('#recipient-email').value.trim():'',date:delivery==='digital'&&$('[name="timing"]:checked').value==='schedule'?$('#send-date').value:'Preview now',address:delivery==='physical'?['address','city','region','postal','country'].map(id=>document.getElementById(id).value.trim()).join(', '):'',premium:delivery==='physical'&&$('#premium').checked};}
const subtotal=item=>item.amount+(item.premium?500:0);
function describe(item){return `${item.design} · ${money(item.amount)}\nTo ${item.recipient} · From ${item.sender}\n${item.message||'No personal message'}\n${item.delivery==='digital'?`Digital preview · ${item.email} · ${item.date}`:`Physical preview · ${item.address}\n${item.premium?'Premium packaging +$5.00':'Standard packaging'}`}`;}
function renderCart(title='Your thoughtful little cart.'){
  dialogContent.replaceChildren(text('p','LOCAL CART · NO GIFT CARD ISSUED','eyebrow'),text('h2',title),text('p','These are configuration snapshots only. No payment, email, scheduled job, shipping or redeemable code is created.'));
  if(!cart.length)dialogContent.append(text('p','Your local cart is empty.'));
  cart.forEach((item,index)=>{const line=text('article','','cart-line');line.append(text('h3',`${money(subtotal(item))} · ${item.design}`),text('p',describe(item)));const remove=text('button','Remove this configuration');remove.type='button';remove.addEventListener('click',()=>{cart.splice(index,1);update();renderCart();});line.append(remove);dialogContent.append(line);});
  if(cart.length)dialogContent.append(text('div',`Sample subtotal · ${money(cart.reduce((sum,item)=>sum+subtotal(item),0))}`,'cart-total'),text('small','USD. Shipping and tax not calculated. There is no payment step.'));
  dialog.showModal();
}
form.addEventListener('submit',event=>{event.preventDefault();if(!validate())return;cart.push(snapshot());update();renderCart('Added a little possibility.');});
$('#mobile-add').addEventListener('click',()=>form.requestSubmit());
$('#buy-now').addEventListener('click',()=>{
  if(!validate())return;const item=snapshot();dialogContent.replaceChildren(text('p','EXPRESS CHECKOUT · LOCAL PREVIEW ONLY','eyebrow'),text('h2','A thoughtful idea, ready to review.'),text('p',describe(item)),text('div',`Sample subtotal · ${money(subtotal(item))}`,'cart-total'),text('p','Nothing purchased. No financial details collected, account created, email sent, delivery scheduled, or gift card issued. Shipping and tax are not calculated.'));dialog.showModal();
});
document.querySelectorAll('[data-amount]').forEach(button=>button.addEventListener('click',()=>{amount=Number(button.dataset.amount)*100;$('#custom-amount').value='';$('#custom-amount').setCustomValidity('');$('#custom-amount').setAttribute('aria-invalid','false');$('#amount-error').textContent='';update();}));
$('#custom-amount').addEventListener('input',event=>{
  const value=event.target.value.trim();let cents=null;
  if(/^\d{1,4}(?:\.\d{1,2})?$/.test(value)){const [whole,fraction='']=value.split('.');cents=Number(whole)*100+Number(fraction.padEnd(2,'0'));}
  amount=cents!==null&&cents>=1000&&cents<=100000?cents:null;
  const error=amount===null?'Choose $10–$1,000 with up to two decimal places.':'';
  event.target.setCustomValidity(error);event.target.setAttribute('aria-invalid',String(!!error));$('#amount-error').textContent=error;update();
});
document.querySelectorAll('[data-delivery]').forEach(button=>button.addEventListener('click',()=>{delivery=button.dataset.delivery;changeDelivery();}));
for(const id of ['recipient','sender','message','recipient-email','send-date','address','city','region','postal','country'])document.getElementById(id).addEventListener('input',event=>{event.target.setCustomValidity?.('');update();});
for(const input of document.querySelectorAll('[name="timing"],#premium,#reminder'))input.addEventListener('change',changeDelivery);
$('#card-flip').addEventListener('click',()=>{const flipped=$('#card-flip').classList.toggle('flipped');$('#card-flip').setAttribute('aria-pressed',String(flipped));$('#card-flip').setAttribute('aria-label',`Show gift card ${flipped?'front':'back'}`);});
$('#save-design').addEventListener('click',()=>{saved.has(selected)?saved.delete(selected):saved.add(selected);update();});
$('#edit-design').addEventListener('click',()=>$('#design-options').scrollIntoView());
async function upload(file){
  if(!file)return;
  const version=++uploadVersion;
  if(!['image/png','image/jpeg','image/webp'].includes(file.type)||file.size>5*1024*1024){$('#upload-status').textContent='Choose a PNG, JPEG or WebP no larger than 5 MB. Your previous design is unchanged.';return;}
  let url;
  try{
    const bytes=new Uint8Array(await file.slice(0,12).arrayBuffer());
    const hex=Array.from(bytes).map(byte=>byte.toString(16).padStart(2,'0')).join('');
    const signature=file.type==='image/png'?hex.startsWith('89504e470d0a1a0a'):file.type==='image/jpeg'?hex.startsWith('ffd8ff'):hex.startsWith('52494646')&&hex.slice(16,24)==='57454250';
    if(!signature)throw Error('Invalid image signature');
    url=URL.createObjectURL(file);const image=new Image();image.src=url;await image.decode();
    if(image.naturalWidth>4096||image.naturalHeight>4096||image.naturalWidth<1||image.naturalHeight<1)throw Error('Image dimensions outside local limit');
    if(version!==uploadVersion){URL.revokeObjectURL(url);return;}
    if(uploaded)URL.revokeObjectURL(uploaded.url);uploaded={url,name:file.name};chooseDesign('custom');$('#upload-status').textContent=`${file.name} selected locally. ${image.naturalWidth} × ${image.naturalHeight}px. Nothing uploaded to a service.`;
  }catch{if(url)URL.revokeObjectURL(url);if(version===uploadVersion)$('#upload-status').textContent='The image could not be decoded. Use a valid PNG, JPEG or WebP up to 4096 × 4096px. Your previous design is unchanged.';}
}
$('#upload').addEventListener('change',event=>upload(event.target.files[0]));
const zone=$('#upload-zone');
for(const name of ['dragenter','dragover'])zone.addEventListener(name,event=>{event.preventDefault();zone.classList.add('drag');});
for(const name of ['dragleave','drop'])zone.addEventListener(name,event=>{event.preventDefault();zone.classList.remove('drag');});
zone.addEventListener('drop',event=>{if(event.dataTransfer.files.length!==1){$('#upload-status').textContent='Choose one image at a time.';return;}upload(event.dataTransfer.files[0]);});
$('#email-preview').addEventListener('click',()=>{
  const item=snapshot();dialogContent.replaceChildren(text('p','EMAIL TEMPLATE · LOCAL PREVIEW','eyebrow'),text('h2',`${item.recipient||'Someone wonderful'}, a little something for you.`),text('p',`${item.sender||'Someone thoughtful'} picked a ${amount===null?'gift card':money(amount)+' gift card'} concept, just for you.`),text('p',item.message||'A little possibility for your next favourite thing.'),text('p',`Destination preview: ${item.email||'email not entered'}\n${item.date}`),text('small','No email sent, delivery scheduled or redeemable code created.'));dialog.showModal();
});
$('#download-reminder').addEventListener('click',()=>{
  updateDateValidity();if(delivery!=='digital')return;
  const scheduled=$('[name="timing"]:checked').value==='schedule';if(scheduled&&!$('#send-date').reportValidity())return;
  const date=scheduled?new Date(`${$('#send-date').value}T12:00:00`):new Date(),end=new Date(date);end.setDate(end.getDate()+1);
  const compact=value=>localDate(value).replaceAll('-','');
  const stamp=new Date().toISOString().replaceAll(/[-:]/g,'').replace(/\.\d{3}Z$/,'Z');
  const ics=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Lumina Concept//Local Reminder//EN','BEGIN:VEVENT',`UID:${crypto.randomUUID()}@lumina.invalid`,`DTSTAMP:${stamp}`,`DTSTART;VALUE=DATE:${compact(date)}`,`DTEND;VALUE=DATE:${compact(end)}`,'SUMMARY:Review your Lumina gift card concept','DESCRIPTION:Local reminder only. No email or gift card delivery is scheduled.','END:VEVENT','END:VCALENDAR',''].join('\r\n');
  const url=URL.createObjectURL(new Blob([ics],{type:'text/calendar'})),link=document.createElement('a');link.href=url;link.download='gift-card-reminder.ics';document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
});
$('#balance-form').addEventListener('submit',event=>{
  event.preventDefault();const clean=$('#card-number').value.replace(/[ -]/g,'');const result=$('#balance-result');result.replaceChildren();
  if(!/^\d{16}$/.test(clean)){result.textContent='Use the 16-digit local example, with optional spaces or hyphens.';return;}
  if(clean!=='1111222233334444'){result.textContent='No matching local demo card. No server lookup was made. Keep real card numbers private.';return;}
  result.append(text('p','DEMO CARD · ENDING 4444'),text('strong','Sample balance · $62.50'),text('p','No expiration in the proposed policy. Not redeemable.'));
  const list=document.createElement('ul');for(const line of ['Mar 1, 2026 · Example opening credit +$100.00','Mar 5, 2026 · Example purchase −$24.50','Mar 10, 2026 · Example purchase −$13.00'])list.append(text('li',line));result.append(list);
});
function designSearch(savedOnly=false){
  dialogContent.replaceChildren(text('p','LOCAL DESIGN COLLECTION','eyebrow'),text('h2',savedOnly?'Your saved little favourites.':'Find the right feeling.'));
  const input=document.createElement('input');input.className='dialog-input';input.placeholder='Search designs…';input.setAttribute('aria-label','Search local gift card designs');
  const list=text('div','','dialog-design-list');
  const render=()=>{list.replaceChildren();const options=designs.filter(item=>(!savedOnly||saved.has(item.id))&&item.name.toLowerCase().includes(input.value.toLowerCase()));if(savedOnly&&saved.has('custom')&&uploaded&&'your own image'.includes(input.value.toLowerCase()))options.push({id:'custom',name:'Your own image'});
    if(!options.length)list.append(text('p','No matching designs. Save a design from the card preview or try another search.'));
    options.forEach(item=>{const button=text('button',item.name);button.type='button';button.addEventListener('click',()=>{chooseDesign(item.id);dialog.close();$('#design-options').scrollIntoView();});list.append(button);});
  };input.addEventListener('input',render);dialogContent.append(input,list);render();dialog.showModal();
}
$('#search-open').addEventListener('click',()=>designSearch());
$('#saved-open').addEventListener('click',()=>designSearch(true));
$('#cart-open').addEventListener('click',()=>renderCart());
const info={
  Shop:'Only the gift-card customization concept is implemented. No real product catalog, payment, redemption or sale is available.',
  Categories:'Explore the eight original gift-card designs in the builder. A broader merchandise catalog is not connected.',
  Sale:'There are no active offers or price promotions. Card values and packaging costs are local examples, not real purchase terms.',
  Account:'No account or identity service is connected. Your card, cart, saved designs and form values stay in this document’s memory and reset on refresh.',
  Support:'This is a fictional shop concept. No email address, support desk, lost-card replacement, refund or order service is connected.',
  Privacy:'Personalization, email and address previews stay in this page’s memory. Images are decoded locally and never sent to a service. No storage, analytics, cookies, account or payment data is used. Refresh clears this session. Calendar files are downloaded only when you explicitly choose the reminder action.',
  'Corporate gifting':'Custom branding, CSV import, bulk email, a dedicated account manager and volume discounts are proposed features from the brief. No sales contact or bulk fulfillment is connected. No inquiry has been sent.'
};
document.addEventListener('click',event=>{const designButton=event.target.closest('[data-design]');if(designButton){chooseDesign(designButton.dataset.design);return;}const infoButton=event.target.closest('[data-info]');if(infoButton){dialogContent.replaceChildren(text('p','LUMINA · CONCEPT NOTE','eyebrow'),text('h2',infoButton.dataset.info),text('p',info[infoButton.dataset.info]));dialog.showModal();closeMenu();}});
$('.dialog-close').addEventListener('click',()=>dialog.close());
function closeMenu(){$('#nav').classList.remove('open');$('#menu').setAttribute('aria-expanded','false');}
$('#menu').addEventListener('click',()=>{const open=$('#nav').classList.toggle('open');$('#menu').setAttribute('aria-expanded',String(open));});
$('#nav a').addEventListener('click',closeMenu);document.addEventListener('keydown',event=>{if(event.key==='Escape')closeMenu();});
const mobile=matchMedia('(max-width:600px)');function summaryLayout(){$('#summary-details').open=!mobile.matches;}mobile.addEventListener('change',summaryLayout);summaryLayout();
$('#design-options').innerHTML=designs.map(item=>`<button type="button" class="design-button" data-design="${item.id}" aria-pressed="${item.id===selected}"><span class="mini-design">${artwork(item)}</span><small>${item.name}</small></button>`).join('');
changeDelivery();
window.addEventListener('pagehide',()=>{if(uploaded)URL.revokeObjectURL(uploaded.url);});
