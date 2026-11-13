const stories=[
  {id:'trecime',title:'First Light on the Tre Cime: A Dolomites Morning',category:'Photo Essay',destination:'Italian Dolomites',image:'peaks',date:'MAR 2026',meta:'12-PHOTO CONCEPT · 8 MIN LABEL',text:['In this imagined field note, the walk begins before the path has a color. A headlamp traces the next few steps. By the time the ridgeline appears, the morning has become less about a photograph and more about paying attention.','This is original fictional prose, not a verified hike or location report. The bundled alpine photograph is an illustrative stock image; its exact location and capture details have not been verified. There is one cover image, not a twelve-frame reported essay.','Before any real mountain trip, check current weather, trail access, refuge opening dates and your own experience. Carry appropriate equipment and follow local safety guidance.']},
  {id:'iceland',title:"Iceland’s Diamond Beach at Midnight Sun",category:'Photo Essay',destination:'Iceland',image:'waterfall',date:'JUN 2025',meta:'18-PHOTO CONCEPT',text:['Water, wind and a long northern evening are the starting points for this imagined essay. Look for a quieter frame at the edge of a busy scene, and give the weather time to change.','The cover is a waterfall mood illustration, not Diamond Beach. No trip, midnight-sun conditions or eighteen-photo sequence has been verified. Respect local access rules and keep a safe distance from surf, ice and unstable ground.']},
  {id:'kit',title:'The Gear I Actually Use: 2026 Kit Breakdown',category:'Gear Review',destination:'Field Notes',image:'gear',date:'FEB 2026',meta:'14 MIN LABEL · SHORT PREVIEW',text:['This is a fictional kit concept, not a tested inventory. An interchangeable-lens body, a wide lens, a stable tripod and weather protection are an outline for discussion, not a shopping list everyone needs.','Think about weight, access, repairability and the conditions you actually photograph. The generic camera artwork is original; it is not a Sony or accessory product photograph.']},
  {id:'patagonia',title:'Patagonia in Autumn: Torres del Paine',category:'Destination Guide',destination:'Patagonia',image:'valley',date:'APR 2025',meta:'LOCATION CONCEPT',text:['A proposed autumn journal follows the changing edge between low cloud and mountain. This short original preview is about visual attention, not a route or booking guide.','The image is a general mountain-valley illustration, with no verified Torres del Paine location. Park permits, seasonality, trail access and weather require current local research before travel.']},
  {id:'edit',title:'How I Edit Moody Landscapes in Lightroom',category:'Behind the Scenes',destination:'Italian Dolomites',image:'peaks',date:'JAN 2026',meta:'EDITING CONCEPT',text:['Begin by deciding what drew you to the frame. A gentle white-balance adjustment and considered contrast can support that memory without making every shadow black.','A fuller workflow might combine exposure brackets, luminosity masks and local adjustments. Those operations are not performed on this page: its comparison slider applies two CSS treatments to the same JPEG. No RAW files or Lightroom presets are bundled.']},
  {id:'scotland',title:'Scottish Highlands: Rain, Fog, and Perfect Light',category:'Photo Essay',destination:'Scottish Highlands',image:'loch',date:'NOV 2025',meta:'22-PHOTO CONCEPT',text:['An imagined wet afternoon makes a quiet subject of a roofline, a reflection and a slow-moving cloud. Sometimes waiting is a more useful compositional tool than walking farther.','This is a fictional preview, not a verified Scottish trip or twenty-two-frame essay. The lakeside cottage image is mood photography with an unverified location.']},
  {id:'drone',title:'Why I Sold My Drone (And Why I Might Buy Another)',category:'Newsletter Preview',destination:'Field Notes',image:'night',date:'SAMPLE ISSUE',meta:'ORIGINAL SHORT PREVIEW',text:['This fictional newsletter asks what a new viewpoint adds to a story, and what it asks of the place being photographed. A compelling image does not automatically justify disturbance.','Check local flight rules, permissions, wildlife protections and privacy requirements before flying. No actual drone purchase, sale or product review is claimed.']}
];
const byId=new Map(stories.map(story=>[story.id,story]));
const recentIds=['iceland','kit','patagonia','edit','scotland'];
const destinationData=[['Iceland',8,'waterfall'],['Italian Dolomites',5,'peaks'],['Patagonia',4,'valley'],['Scottish Highlands',6,'loch'],['Norway',7,'aurora'],['New Zealand',3,'lake']];
const frames=[
  ['Milky Way over Kirkjufell','Iceland','night','24mm · f/2.8 · 15s · ISO 3200'],
  ['The lone tree at Wanaka','New Zealand','lake','35mm · f/8 · 1/60s · ISO 100'],
  ['A foggy morning in Glencoe','Scotland','loch','50mm · f/8 · 1/30s · ISO 100'],
  ['First light on the Seceda ridge','Dolomites','peaks','16mm · f/11 · 1/15s · ISO 100'],
  ['Aurora over Reine','Norway','aurora','20mm · f/2.8 · 8s · ISO 1600'],
  ['Fitz Roy alpenglow','Patagonia','valley','70mm · f/8 · 1/125s · ISO 200'],
  ['The far side of the islands','Faroe Islands','ocean','35mm · f/11 · 1/4s · ISO 100'],
  ['Wild horses in winter','Iceland','horses','85mm · f/4 · 1/500s · ISO 400'],
  ['Still water at Lago di Braies','Dolomites','lake','24mm · f/11 · 1/15s · ISO 100']
];
const gears=[
  {id:'sony',title:'Sony A7R V: 14 months later',rating:'9.2',note:'A proposed look at resolution, autofocus, and the cost of carrying more.',body:'A concept review, not fourteen months of testing. The 9.2 score is supplied in the brief and is not an independent rating. No performance or autofocus claim has been verified. Compare current manufacturer specifications and independent hands-on testing before buying.'},
  {id:'tripod',title:'Peak Design Travel Tripod',rating:'8.5',note:'A closer look at packing small, and the compromises worth considering.',body:'A concept discussion, not a tested stability assessment. The 8.5 score and wind-stiffness verdict in the brief are illustrative. Consider load ratings, working height, access and return policies; no particular product is recommended.'},
  {id:'filters',title:'NiSi V7 filter system',rating:'9.0',note:'Slowing things down, controlling reflections, and keeping a kit considered.',body:'A concept review, not a hands-on test. The 9.0 score is illustrative. The brief’s magnetic-system assertion has not been verified and is not repeated as fact. Check the precise model, mounting method, compatibility and current specifications with the manufacturer.'}
];
const prints=[['Tre Cime Sunrise','peaks','24 × 36 in',189],['Diamond Beach Ice','waterfall','20 × 30 in',149],['Milford Sound Mirror','lake','30 × 20 in',169],['Aurora Over Reine','aurora','24 × 36 in',199]];
const reader=document.querySelector('#reader'),content=document.querySelector('#reader-content'),lightbox=document.querySelector('#lightbox');
let frameIndex=0;
const asset=image=>`assets/${image}.${image==='gear'?'svg':'jpg'}`;
function node(tag,text,className){const element=document.createElement(tag);element.textContent=text;if(className)element.className=className;return element;}
function show(dialog){document.querySelectorAll('dialog[open]').forEach(open=>{if(open!==dialog)open.close();});dialog.showModal();}
function image(source,alt){const element=document.createElement('img');element.src=source;element.alt=alt;element.className='dialog-image';return element;}
function read(id){
  const story=byId.get(id);
  content.replaceChildren(node('p',story.category.toUpperCase(),'eyebrow'),node('h2',story.title),node('small',`${story.date} · ${story.meta} · Original short preview`),image(asset(story.image),'Illustrative source imagery; not a verified trip photograph'));
  story.text.forEach(paragraph=>content.append(node('p',paragraph)));
  content.append(node('small','Fictional photographer. Stock-image rights belong to their creators. Photo counts, locations, dates and experiences are concept details.'));
  show(reader);
}
function storyList(title,list,note){
  content.replaceChildren(node('p','APERTURE JOURNAL · LOCAL ARCHIVE','eyebrow'),node('h2',title),node('p',note));
  const container=node('div','','reader-list');
  list.forEach(story=>{const button=node('button',story.title);button.dataset.read=story.id;button.append(node('small',`${story.category} · ${story.date}`));container.append(button);});
  if(!list.length)container.append(node('p','No local story has been implemented for this destination yet. Explore another destination or the selected-work gallery.'));
  content.append(container);show(reader);
}
function destination(name){storyList(name,stories.filter(story=>story.destination===name),'The story count in the brief describes an imagined archive. The previews below are the available local content; their photographs are mood illustrations.');}
function openFrame(index){
  frameIndex=(index+frames.length)%frames.length;
  const [title,location,file,settings]=frames[frameIndex];
  document.querySelector('#lightbox-image').src=asset(file);
  document.querySelector('#lightbox-image').alt=`${title}, a stock-image mood study; exact location unverified`;
  document.querySelector('#lightbox-title').textContent=title;
  document.querySelector('#lightbox-index').textContent=`SELECTED FRAME ${String(frameIndex+1).padStart(2,'0')} / ${frames.length}`;
  document.querySelector('#lightbox-meta').textContent=`CONCEPT LOCATION: ${location} · SAMPLE: Sony A7R V · ${settings}. These are illustrative settings, not embedded EXIF. The stock image may depict a different place or season.`;
  show(lightbox);
}
function printPreview(index){
  const [title,file,size,base]=prints[index];
  content.replaceChildren(node('p','THE PRINT COLLECTION · LOCAL PREVIEW','eyebrow'),node('h2',title),image(asset(file),'Sample framed print photograph, not a real product'),node('p',`${size} · Proposed giclée edition. Concept title and image location are not a verified match.`));
  const form=document.createElement('form');form.className='print-options';
  const label=node('label','Frame presentation');
  const select=document.createElement('select');select.name='finish';select.setAttribute('aria-label','Frame presentation');
  for(const [text,value] of [['Unframed',0],['Oak frame mockup (+$60)',60]]){const option=node('option',text);option.value=value;select.append(option);}
  label.append(select);
  const price=node('p',`Illustrative estimate: $${base}`,'print-estimate');price.setAttribute('role','status');
  const button=node('button','Preview my selection ↗','gold-button');button.type='submit';
  const status=node('p','No inventory, order, tax, shipping charge or payment service is connected.','print-confirm');status.setAttribute('role','status');
  select.addEventListener('change',()=>{price.textContent=`Illustrative estimate: $${base+Number(select.value)}`;status.textContent='Selection changed. No order has been created.';});
  form.addEventListener('submit',event=>{event.preventDefault();status.textContent=`Local selection: ${title}, ${size}, ${select.selectedOptions[0].textContent}. No order created and no payment taken.`;});
  form.append(label,price,button,status);content.append(form);show(reader);
}
const infos={
  'About Elena':'Elena Voss is a fictional photographer based on the design brief. The six-year career, Portland base, country count, readership and publication mentions have not been verified. The portrait is an original illustration. All landscape photographs are locally bundled Unsplash stock imagery, not photographs taken by this character.',
  'Recommended books':'No published book recommendations or affiliate links have been implemented. An original practice instead: choose one landscape photograph, describe its light without naming the subject, and notice how that changes the frame.',
  'Social channels':'No real Instagram or YouTube profile is connected. The proposed @aperturejournal handle and audience figures are fictional concept details.',
  'Email':'No email or contact service is connected. The address in the brief has not been verified and is not used as a live destination.',
  'Privacy':'Search queries, newsletter previews and print selections stay in this page’s memory and reset on refresh. No tracking, analytics, accounts, payment collection or external network requests are used.',
  'Terms':'This is a fictional static portfolio, not a real travel service, product-testing publication or print shop. Travel requires current independent safety research. No purchases, shipping commitments or professional services are offered.',
  'Cookie preferences':'This page uses no cookies, advertising trackers or browser storage. There are no consent preferences to save.',
  'Licensing':'Stock photographs were downloaded from Unsplash under its website-use license; their creators retain the rights. Sources and restrictions are listed in assets/NOTICE.txt. Fictional Elena does not own those photographs. Original illustrations and prose are separate. No additional image rights, model endorsement or relicensing is implied.'
};
document.querySelector('#story-grid').innerHTML=recentIds.map(id=>{const story=byId.get(id);return `<article class="story ${id==='edit'?'story-edit':''}"><img src="${asset(story.image)}" width="1000" height="900" alt="Illustrative cover for ${story.category.toLowerCase()}" loading="lazy"><button class="story-button" data-read="${id}"><span class="category">${story.category.toUpperCase()}</span><h3>${story.title}</h3><small>${story.date} · ${story.meta}</small></button></article>`;}).join('');
document.querySelector('#destination-grid').innerHTML=destinationData.map(([name,count,file])=>`<button class="destination" data-destination="${name}"><img src="${asset(file)}" width="500" height="650" alt="Landscape mood image; exact destination unverified" loading="lazy"><span><strong>${name}</strong><small>${count} STORIES IN THE BRIEF ↗</small></span></button>`).join('');
document.querySelector('#gallery').innerHTML=frames.map(([title,location,file],index)=>`<button class="gallery-item" data-frame="${index}" aria-label="Open ${title}"><img src="${asset(file)}" width="1000" height="1000" alt="${title} — concept mood image, not a verified location" loading="lazy"><span>${title} · ${location} ↗</span></button>`).join('');
document.querySelector('#gear-grid').innerHTML=gears.map(gear=>`<article class="gear-card"><div class="gear-visual"><img src="assets/gear.svg" width="1000" height="600" alt="Original generic camera and accessory illustration, not a product photograph" loading="lazy"><span class="rating">${gear.rating}<small>SAMPLE / 10</small></span></div><h3>${gear.title}</h3><p>${gear.note}</p><small>Illustrative score · No hands-on test</small><button class="text-link" data-gear="${gear.id}">Read the concept review ↗</button></article>`).join('');
document.querySelector('#print-grid').innerHTML=prints.map(([title,file,size,price],index)=>`<article class="print-card"><button class="frame-wall" data-print="${index}" aria-label="Preview ${title}"><img src="${asset(file)}" width="400" height="500" alt="Illustrative framed landscape mockup" loading="lazy">${index===3?'<span class="bestseller">BEST SELLER · CONCEPT</span>':''}</button><h3>${title}</h3><p><span>${size}</span><span>From $${price}</span></p><button class="text-link" data-print="${index}">Preview this print ↗</button></article>`).join('');
document.addEventListener('click',event=>{
  const article=event.target.closest('[data-read]');if(article){read(article.dataset.read);return;}
  const place=event.target.closest('[data-destination]');if(place){destination(place.dataset.destination);return;}
  const frame=event.target.closest('[data-frame]');if(frame){openFrame(Number(frame.dataset.frame));return;}
  const print=event.target.closest('[data-print]');if(print){printPreview(Number(print.dataset.print));return;}
  const gear=event.target.closest('[data-gear]');if(gear){const item=gears.find(g=>g.id===gear.dataset.gear);content.replaceChildren(node('p','GEAR TALK · CONCEPT REVIEW','eyebrow'),node('h2',item.title),image('assets/gear.svg','Original generic kit diagram'),node('p',item.body));show(reader);return;}
  const info=event.target.closest('[data-info]');if(info){content.replaceChildren(node('p','APERTURE JOURNAL · CONCEPT NOTE','eyebrow'),node('h2',info.dataset.info),node('p',infos[info.dataset.info]));show(reader);}
});
document.querySelectorAll('.close').forEach(button=>button.addEventListener('click',()=>button.closest('dialog').close()));
document.querySelector('#lightbox-prev').addEventListener('click',()=>openFrame(frameIndex-1));
document.querySelector('#lightbox-next').addEventListener('click',()=>openFrame(frameIndex+1));
document.addEventListener('keydown',event=>{if(lightbox.open&&['ArrowLeft','ArrowRight'].includes(event.key)){event.preventDefault();openFrame(frameIndex+(event.key==='ArrowRight'?1:-1));}});
document.querySelector('#portfolio').addEventListener('click',()=>openFrame(0));
for(const [id,delta] of [['dest-prev',-1],['dest-next',1]])document.getElementById(id).addEventListener('click',()=>document.querySelector('#destination-grid').scrollBy({left:delta*500,behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth'}));
document.querySelector('#compare-range').addEventListener('input',event=>{const value=Number(event.target.value);document.querySelector('.comparison').style.setProperty('--split',`${value}%`);document.querySelector('#compare-output').textContent=`${value}% flat preview`;event.target.setAttribute('aria-valuetext',`${value} percent flat preview`);});
document.querySelector('#open-search').addEventListener('click',()=>show(document.querySelector('#search-dialog')));
document.querySelector('#mobile-search').addEventListener('click',()=>show(document.querySelector('#search-dialog')));
document.querySelector('#search-form').addEventListener('submit',event=>{event.preventDefault();const query=document.querySelector('#search').value.trim().toLowerCase();const found=stories.filter(story=>`${story.title} ${story.category} ${story.destination}`.toLowerCase().includes(query));storyList(query?`Search: ${document.querySelector('#search').value.trim()}`:'All local stories',found,`${found.length} original short previews. No external search service.`);});
document.querySelector('#open-menu').addEventListener('click',()=>show(document.querySelector('#mobile-nav')));
document.querySelectorAll('#mobile-nav a').forEach(link=>link.addEventListener('click',()=>document.querySelector('#mobile-nav').close()));
document.querySelector('#signup').addEventListener('submit',event=>{event.preventDefault();if(!event.currentTarget.reportValidity())return;document.querySelector('#signup-status').textContent=`Preview ready for ${event.currentTarget.elements.email.value.trim()}. No subscription created or email sent.`;event.currentTarget.reset();});
document.querySelector('#all-prints').addEventListener('click',()=>{content.replaceChildren(node('p','PRINT COLLECTION · CONCEPT ONLY','eyebrow'),node('h2','A window to somewhere else.'));const list=node('div','','reader-list');prints.forEach(([title,,size,price],index)=>{const button=node('button',title);button.dataset.print=index;button.append(node('small',`${size} · From $${price} · No real inventory`));list.append(button);});content.append(list);show(reader);});
function headerState(){document.querySelector('#header').classList.toggle('solid',scrollY>60);}
window.addEventListener('scroll',headerState,{passive:true});headerState();
