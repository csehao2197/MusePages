'use strict';
(() => {
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => [...document.querySelectorAll(selector)];
  const money = (cents) => new Intl.NumberFormat('en-US', {style:'currency',currency:'USD',maximumFractionDigits:cents % 100 ? 2 : 0}).format(cents / 100);
  const exactMoney = (cents) => new Intl.NumberFormat('en-US', {style:'currency',currency:'USD'}).format(cents / 100);
  const icon = (name) => `<svg aria-hidden="true"><use href="assets/icons.svg#${name}"/></svg>`;
  const colors = {
    sony:[['Black','#252a31'],['Silver','#d8d2c8'],['Midnight Blue','#283d56']],
    bose:[['Black','#2b2f36'],['White Smoke','#e4dfd4'],['Lunar Blue','#58677f']],
    apple:[['Space Gray','#697078'],['Silver','#d9dcdf'],['Sky Blue','#a9c5d5'],['Pink','#e5b7ac'],['Green','#b5c6b0']]
  };
  const products = [
    {id:'sony',brand:'Sony',name:'WH-1000XM5',full:'Sony WH-1000XM5',generation:'2022 · WH series',price:34800,original:39900,rating:4.7,reviews:'2,341',score:'9.2',badge:'THE VALUE PICK',art:'sony',tone:'#2563eb',source:'https://helpguide.sony.net/mdr/wh1000xm5/v1/en/index.html',
      pros:['Up to 30 hours with ANC','Approx. 250g, the lightest listed','LDAC on compatible sources','Multipoint Bluetooth','3.5mm audio cable included'],
      cons:['Earcups swivel; do not fold inward','Not waterproof or sweat-rated','Plastic construction','LDAC is not lossless audio'],
      summary:'The longest quoted ANC battery life, a light build and the lowest sample price make the XM5 a compelling starting point. LDAC and multipoint add flexibility, but the non-folding design takes more bag space.',
      detail:'The XM5 is our spec-based value pick for this comparison. Sony specifies Bluetooth 5.2, SBC/AAC/LDAC, and approximately 250g. Its 30-hour ANC battery claim depends on settings and use. The 30mm driver is not inherently better or worse than a larger driver. Fit and your own listening preferences still matter.',
      quote:'Upgraded from XM4 — the difference in noise cancellation on my daily commute is night and day. Battery lasts my entire work week.',buyer:'Michael R.',quoteStars:'★★★★★',best:'Best overall value',bestCopy:'Lowest sample price, longest quoted ANC battery life, lightest listed build.'},
    {id:'bose',brand:'Bose',name:'QuietComfort Ultra',full:'Bose QuietComfort Ultra',generation:'1st generation · 2023',price:37900,original:42900,rating:4.6,reviews:'1,892',score:'9.0',badge:'COMFORT-FOCUSED',art:'bose',tone:'#059669',source:'https://www.bose.com/p/headphones/bose-quietcomfort-ultra-headphones/QCUH-HEADPHONEARN.html',
      pros:['CustomTune personalization','Bose Immersive Audio','Folds into a carrying case','Multipoint with updated firmware','Adaptive microphone system'],
      cons:['No water-resistance claim here','24-hour claim drops to 18 with Immersive Audio','Must be powered on for wired use','Higher sample price than Sony'],
      summary:'A comfort-focused design with a folding frame, CustomTune and Immersive Audio. The first-generation Ultra offers multipoint after its July 2024 update. Using Immersive Audio cuts the 24-hour battery claim to 18.',
      detail:'Bose describes soft earcups, pressure-spreading headband design and CustomTune calibration. Comfort is personal, so this is a fit-oriented recommendation rather than an independently tested award. Its first-generation model is distinct from the second-generation Ultra; verify your exact product and firmware. Bose publishes a weight of 0.56lb, approximately 254g.',
      quote:"Most comfortable headphones I've ever worn. The immersive audio mode makes movies feel like a theater.",buyer:'Sarah T.',quoteStars:'★★★★★',best:'Best for a comfort-first shortlist',bestCopy:'Soft-fit design, a folding frame and personalized CustomTune audio.'},
    {id:'apple',brand:'Apple',name:'AirPods Max',full:'Apple AirPods Max',generation:'Lightning model · 2020',price:54900,rating:4.5,reviews:'3,104',score:'8.8',badge:'APPLE ECOSYSTEM',art:'apple',tone:'#6b7280',source:'https://support.apple.com/en-us/111858',
      pros:['Automatic switching on supported Apple devices','Personalized Spatial Audio','Aluminum earcups and steel frame','Digital Crown controls','Transparency mode'],
      cons:['384.8g including cushions','Highest sample price: $549','No standard Bluetooth multipoint','Lightning audio cable sold separately','Settings depend on your Apple devices'],
      summary:'For listeners already using supported Apple devices, automatic switching and Personalized Spatial Audio are the main draw. The Lightning model is heavier and more expensive in this sample lineup, with a separate cable needed for analog audio.',
      detail:'This is the original 2020 Lightning model, not the USB-C version. Apple lists 384.8g, Bluetooth 5.0 and up to 20 hours with ANC or Transparency enabled. Automatic Apple-device switching is not general-purpose Bluetooth multipoint. Its original colors are Space Gray, Silver, Sky Blue, Pink and Green. A generic Lightning adapter does not replace the required compatible analog audio cable.',
      quote:"If you're all-in on Apple, these are magical. The seamless switching between my iPhone, iPad, and MacBook is worth the premium.",buyer:'David L.',quoteStars:'★★★★☆',best:'Best for Apple-focused listening',bestCopy:'Supported-device switching, spatial features and a substantial metal build.'}
  ];
  const related = [
    {id:'sony-buds',full:'Sony WF-1000XM5 Earbuds',price:27800,rating:4.6,art:'earbuds',tag:'In-ear alternative',generation:'Illustrative catalog entry'},
    {id:'bose-buds',full:'Bose QuietComfort Earbuds II',price:24900,rating:4.5,art:'earbuds',tag:'A smaller way to tune out',generation:'Illustrative catalog entry'},
    {id:'sennheiser',full:'Sennheiser Momentum 4',price:29900,rating:4.4,art:'sony',tag:'Another over-ear option',generation:'Illustrative catalog entry'},
    {id:'audio-technica',full:'Audio-Technica ATH-M50xBT2',price:17900,rating:4.3,art:'bose',tag:'Studio-inspired listening',generation:'Illustrative catalog entry'}
  ];
  const catalog = [...products,...related];
  const find = (id) => catalog.find((product) => product.id === id);
  const choices = {sony:0,bose:0,apple:0};
  const wish = new Set();
  const cart = [];
  let lineSerial = 0;
  const parameters = new URLSearchParams(location.search);
  const initialModels = [...new Set((parameters.get('models') || '').split(','))].filter((id) => products.some((p) => p.id === id));
  let selected = initialModels.length >= 2 ? products.filter((p) => initialModels.includes(p.id)).map((p) => p.id) : products.map((p) => p.id);
  let group = ['audio','battery','design','connectivity'].includes(parameters.get('specs')) ? parameters.get('specs') : 'all';
  let differences = parameters.get('differences') === '1';
  let current = selected.includes(parameters.get('product')) ? parameters.get('product') : selected[0];
  let toastTimer;
  let frame = 0;
  let aligning = false;
  const picked = () => products.filter((p) => selected.includes(p.id));
  const colorName = (id) => colors[id] ? colors[id][choices[id]][0] : 'Standard demo finish';
  const art = (product, small = false) => `<svg class="product-art${small ? ' small-art' : ''}" viewBox="0 0 400 320" role="img" aria-label="Original concept illustration, not an official product photograph"><use href="assets/headphones.svg#${product.art}"/></svg>`;
  const specs = [
    {name:'Price',group:'all',values:['$348','$379','$549'],numeric:[34800,37900,54900],best:'min'},
    {name:'Noise cancellation',group:'audio',values:['Active ANC · Auto NC Optimizer','Active ANC · CustomTune','Active ANC'],boolean:[true,true,true]},
    {name:'Battery with ANC',group:'battery',values:['Up to 30 hours','Up to 24 hours','Up to 20 hours'],numeric:[30,24,20],best:'max'},
    {name:'Weight',group:'design',values:['Approx. 250g','Approx. 254g (0.56lb)','384.8g'],numeric:[250,254,384.8],best:'min'},
    {name:'Driver',group:'audio',values:['30mm dynamic','Proprietary · size not cited','Apple dynamic · size not cited']},
    {name:'Bluetooth version',group:'connectivity',values:['5.2','5.3','5.0']},
    {name:'Codec support',group:'audio',values:['LDAC · SBC · AAC','aptX Adaptive¹ · SBC · AAC','AAC · SBC'],note:'¹ Compatible source and software required.'},
    {name:'Standard multipoint',group:'connectivity',values:['Yes','Yes · firmware update','No · Apple switching differs'],boolean:[true,true,false]},
    {name:'Wired option',group:'connectivity',values:['3.5mm audio cable included','3.5mm → 2.5mm cable included','Compatible Lightning → 3.5mm cable, sold separately']},
    {name:'Folds inward',group:'design',values:['No · swivels flat','Yes','No · swivels flat'],boolean:[false,true,false]},
    {name:'Carrying case',group:'design',values:['Included · full-size','Included · folding case','Smart Case included']},
    {name:'Water / sweat rating',group:'design',values:['Not water-resistant','No rating claimed here','No rating claimed here'],boolean:[false,false,false]},
    {name:'Transparency mode',group:'audio',values:['Yes','Yes','Yes'],boolean:[true,true,true]},
    {name:'Spatial audio',group:'audio',values:['360 Reality Audio²','Bose Immersive Audio','Personalized Spatial Audio²'],note:'² Compatible content, devices and services required.'},
    {name:'Voice assistant',group:'connectivity',values:['Supported device assistant','Device assistant via shortcut','Siri on supported devices']},
    {name:'App / settings',group:'connectivity',values:['Sony | Sound Connect','Bose app','Apple device settings']},
    {name:'Warranty',group:'design',values:['Confirm regional terms','Confirm regional terms','Confirm regional terms']}
  ];
  const ratings = [
    ['Sound quality',[4.8,4.7,4.8]],['Noise cancellation',[4.9,4.8,4.6]],['Comfort',[4.7,4.6,4.3]],
    ['Battery life',[4.8,4.5,4.2]],['Build quality',[4.5,4.6,4.9]],['Value for money',[4.7,4.4,3.8]]
  ];
  function toast(message) {
    clearTimeout(toastTimer);
    $('#toast').textContent = message;
    $('#toast').hidden = false;
    toastTimer = setTimeout(() => { $('#toast').hidden = true; },4000);
  }
  function openDialog(id) {
    $$('dialog[open]').forEach((dialog) => dialog.close());
    $('#mobile-nav').hidden = true;
    $('#menu-button').setAttribute('aria-expanded','false');
    $('#menu-button').setAttribute('aria-label','Open navigation');
    $('.account').open = false;
    $(id).showModal();
  }
  function showInfo(title, paragraphs) {
    $('#info-title').textContent = title;
    $('#info-content').replaceChildren(...paragraphs.map((text) => {
      const paragraph = document.createElement('p');
      paragraph.textContent = text;
      return paragraph;
    }));
    openDialog('#info-dialog');
  }
  function renderProducts() {
    document.documentElement.style.setProperty('--cols',selected.length);
    $('#selection-count').textContent = `${selected.length} products compared`;
    $('#product-row').innerHTML = `<div class="product-spacer"><div>${icon('headphones')}<p>FIND YOUR<br>EVERYDAY ESCAPE.</p></div></div>` + picked().map((p) => `
      <article class="product-card${p.id === current ? ' current-card' : ''}" data-product="${p.id}">
        <span class="product-badge${p.id === 'sony' ? '' : ' muted'}">${p.badge}</span>
        <button class="icon-button product-heart" data-wish="${p.id}" aria-label="Save ${p.full} to wishlist" aria-pressed="${wish.has(p.id)}">${icon('heart')}</button>
        ${art(p)}<p class="image-caption">CONCEPT ILLUSTRATION · NOT COLOR-ACCURATE</p><p class="brand">${p.brand}</p><h2>${p.name}</h2><p class="model-generation">${p.generation}</p>
        <div class="sample-rating"><span class="stars" aria-label="Illustrative rating">★★★★★</span><strong>${p.rating.toFixed(1)}</strong><span>(${p.reviews} sample reviews)</span></div>
        <div class="product-price"><strong>${money(p.price)}</strong>${p.original ? `<del>${money(p.original)}</del>` : ''}</div>
        <button class="primary" data-add="${p.id}">${icon('shopping-cart')}Add to demo cart</button>
        <div class="swatch-row" role="group" aria-label="${p.full} demo color">${colors[p.id].map(([name,hex],index) => `<button class="swatch" data-color="${p.id}" data-index="${index}" aria-label="${p.brand} ${name}" aria-pressed="${choices[p.id] === index}" style="--swatch:${hex}"><span></span></button>`).join('')}</div>
        <p class="color-name" data-color-label="${p.id}">${colorName(p.id)}</p>
      </article>`).join('');
    $('#compact-content').innerHTML = `<span class="compact-label">YOUR COMPARISON</span><button class="icon-button previous-product" aria-label="Previous product">${icon('chevron-left')}</button>` + picked().map((p) => `<div class="compact-product${p.id === current ? ' current-compact' : ''}" data-compact="${p.id}"><div><strong>${p.full}</strong><small>${money(p.price)} · sample price</small></div><button class="primary" data-add="${p.id}">Add to cart</button></div>`).join('') + `<button class="icon-button next-product" aria-label="Next product">${icon('chevron-right')}</button>`;
    renderCurrent(false);
  }
  function renderCurrent(align) {
    if (!selected.includes(current)) current = selected[0];
    const product = find(current);
    $$('.current-product').forEach((element) => { element.textContent = `${selected.indexOf(current) + 1} of ${selected.length} · ${product.brand}`; });
    $$('.product-card').forEach((element) => element.classList.toggle('current-card',element.dataset.product === current));
    $$('.compact-product').forEach((element) => element.classList.toggle('current-compact',element.dataset.compact === current));
    $('#mobile-product').textContent = product.full;
    $('#mobile-price').textContent = money(product.price);
    $('#mobile-add').setAttribute('aria-label',`Add ${product.full}, ${colorName(current)}, to demo cart`);
    if (align && innerWidth < 768) {
      aligning = true;
      $('#spec-scroll').scrollLeft = selected.indexOf(current) * productWidth();
      requestAnimationFrame(() => { aligning = false; });
    }
  }
  function productWidth() { return $('#spec-table').getBoundingClientRect().width > $('#spec-scroll').clientWidth ? ($('#spec-table').getBoundingClientRect().width - 120) / selected.length : 0; }
  function stepProduct(delta) {
    current = selected[(selected.indexOf(current) + delta + selected.length) % selected.length];
    renderCurrent(true);
  }
  function renderSpecs() {
    const indexes = products.flatMap((p,index) => selected.includes(p.id) ? [index] : []);
    const visible = specs.filter((row) => (group === 'all' || row.group === group) && (!differences || new Set(indexes.map((index) => row.values[index])).size > 1));
    $('#spec-columns').innerHTML = '<col>' + selected.map(() => '<col>').join('');
    $('#spec-head').innerHTML = '<tr><th scope="col">Specification</th>' + picked().map((p) => `<th scope="col">${p.brand}<br>${p.name}</th>`).join('') + '</tr>';
    $('#spec-body').innerHTML = visible.length ? visible.map((row) => {
      const best = row.best ? Math[row.best](...indexes.map((index) => row.numeric[index])) : null;
      return `<tr data-spec="${row.name}"><th scope="row">${row.name}</th>` + indexes.map((index) => {
        const winner = row.best && row.numeric[index] === best && new Set(indexes.map((i) => row.numeric[i])).size > 1;
        const boolean = row.boolean ? `<span class="${row.boolean[index] ? 'spec-yes' : 'spec-no'}" aria-hidden="true">${row.boolean[index] ? '✓' : '✕'}</span> ` : '';
        return `<td${winner ? ' class="best"' : ''}${row.note ? ` title="${row.note}"` : ''}>${boolean}${row.values[index]}${winner ? '<span class="best-badge">Best</span>' : ''}</td>`;
      }).join('') + '</tr>';
    }).join('') : `<tr><td colspan="${selected.length + 1}">No differing specifications in this category. Choose All specs or turn off Only differences.</td></tr>`;
    $('#spec-count').textContent = `${visible.length} of ${specs.length} specifications${differences ? ' · differences only' : ''}`;
    $('#differences').checked = differences;
    $$('[data-group]').forEach((button) => {
      const active = button.dataset.group === group;
      button.classList.toggle('selected',active);
      button.setAttribute('aria-pressed',String(active));
    });
    renderCurrent(true);
  }
  function renderStories() {
    $('#rating-grid').innerHTML = ratings.map(([name,values]) => {
      const maximum = Math.max(...products.flatMap((p,i) => selected.includes(p.id) ? [values[i]] : []));
      return `<article class="rating-card"><h3>${name}</h3>` + products.flatMap((p,i) => selected.includes(p.id) ? [`<div class="rating-line" aria-label="${p.brand} ${name} ${values[i].toFixed(1)} out of 5${values[i] === maximum ? ', shared or sole highest score' : ''}"><div class="bar-track"><div class="bar" style="--bar:${p.tone};--width:${values[i] / 5 * 100}%"></div></div><strong>${values[i].toFixed(1)}</strong><span class="winner-dot" aria-hidden="true">${values[i] === maximum ? '●' : ''}</span></div>`] : []).join('') + '</article>';
    }).join('');
    $$('.rating-legend>span').forEach((span,i) => { span.hidden = !selected.includes(products[i].id); });
    $('#tradeoff-grid').innerHTML = picked().map((p) => `<article class="tradeoff-card"><div class="tradeoff-heading">${art(p,true)}<div><h3>${p.full}</h3><p>${p.generation}</p></div></div><ul>${p.pros.map((text) => `<li><span aria-hidden="true">✓</span><span>${text}</span></li>`).join('')}</ul><ul class="cons">${p.cons.map((text) => `<li><span aria-hidden="true">✕</span><span>${text}</span></li>`).join('')}</ul></article>`).join('');
    $('#expert-grid').innerHTML = picked().map((p) => `<article class="expert-card"><div><h3>${p.full}</h3><span class="score-badge">${p.score}<small>/10 · sample</small></span></div><p>${p.summary}</p><button class="text-button" data-review="${p.id}">Read example review <span aria-hidden="true">↗</span></button><div class="reviewer"><span class="avatar" aria-hidden="true">AC</span><span><strong>Alex Chen</strong><small>Fictional audio editor</small></span></div></article>`).join('');
    $('#buyer-grid').innerHTML = picked().map((p) => `<article class="buyer-card"><span>${p.full}</span><span class="stars" aria-label="Illustrative star rating">${p.quoteStars}</span><blockquote>“${p.quote}”</blockquote><p><strong>${p.buyer}</strong><small>Fictional quote · not a verified purchase</small></p></article>`).join('');
    $('#recommendation-grid').innerHTML = picked().map((p) => `<article class="recommendation-card"><p class="eyebrow">${icon('award')}${p.best}</p><h3>${p.full}</h3><p>${p.bestCopy}</p><button class="primary" data-add="${p.id}">Add to demo cart · ${money(p.price)}</button></article>`).join('');
  }
  function renderRelated() {
    $('#related-track').innerHTML = related.map((p) => `<article class="related-card" id="related-${p.id}"><div class="related-art">${art(p)}<span>GENERIC CONCEPT ILLUSTRATION</span></div><span>${p.tag}</span><h3>${p.full}</h3><div class="related-price"><strong>${money(p.price)}</strong><span>★ ${p.rating} · sample</span></div><button class="outline" data-add="${p.id}">Add to demo cart</button></article>`).join('');
  }
  function renderWishlist() {
    $('#wish-count').textContent = wish.size;
    $('#wishlist-open').setAttribute('aria-label',`Wishlist, ${wish.size} items`);
    $$('[data-wish]').forEach((button) => {
      const saved = wish.has(button.dataset.wish);
      button.setAttribute('aria-pressed',String(saved));
      button.setAttribute('aria-label',`${saved ? 'Remove' : 'Save'} ${find(button.dataset.wish).full} ${saved ? 'from' : 'to'} wishlist`);
    });
    $('#wishlist-lines').innerHTML = wish.size ? [...wish].map((id) => `<div class="wishlist-line"><div><strong>${find(id).full}</strong><small>${money(find(id).price)} · sample price</small></div><button class="text-button" data-wish="${id}">Remove</button></div>`).join('') : '<p class="empty-state">No saved headphones yet. Use a heart in the lineup.</p>';
  }
  function addToCart(id) {
    const product = find(id);
    if (!product) return;
    const color = colorName(id);
    const line = cart.find((entry) => entry.id === id && entry.color === color);
    if (line && line.quantity >= 9) { toast('Demo limit: 9 of each product and color.'); return; }
    if (line) line.quantity++;
    else cart.push({key:String(++lineSerial),id,color,quantity:1,price:product.price});
    renderCart();
    toast(`${product.full} · ${color} added to demo cart.`);
  }
  function renderCart() {
    const count = cart.reduce((sum,line) => sum + line.quantity,0);
    $('#cart-count').textContent = count;
    $('#cart-open').setAttribute('aria-label',`Demo cart, ${count} items`);
    $('#cart-total').textContent = exactMoney(cart.reduce((sum,line) => sum + line.quantity * line.price,0));
    $('#cart-lines').innerHTML = cart.length ? cart.map((line) => {
      const p = find(line.id);
      return `<article class="cart-line" data-line="${line.key}">${art(p,true)}<div><h3>${p.full}</h3><p>${line.color}</p><p class="line-price">${exactMoney(line.price * line.quantity)}</p><div class="quantity-controls"><button class="icon-button" data-quantity="-1" data-key="${line.key}" aria-label="Decrease ${p.full}, ${line.color}"${line.quantity === 1 ? ' disabled' : ''}>−</button><span aria-label="Quantity">${line.quantity}</span><button class="icon-button" data-quantity="1" data-key="${line.key}" aria-label="Increase ${p.full}, ${line.color}"${line.quantity === 9 ? ' disabled' : ''}>+</button><button data-remove="${line.key}" aria-label="Remove ${p.full}, ${line.color} from cart">Remove</button></div></div></article>`;
    }).join('') : '<p class="empty-state">Your next great listen starts above.<br>The demo cart is empty.</p>';
    $('#cart-summary').disabled = count === 0;
    $('#cart-status').textContent = '';
  }
  function editComparison() {
    $('#edit-options').innerHTML = products.map((p) => `<label class="edit-option"><input type="checkbox" name="model" value="${p.id}"${selected.includes(p.id) ? ' checked' : ''}><span><strong>${p.full}</strong><small>${p.generation} · ${money(p.price)} sample price</small></span></label>`).join('');
    $('#edit-status').textContent = '';
    openDialog('#edit-dialog');
  }
  function showProduct(id, review = false) {
    const p = find(id);
    if (!p) return;
    $('#info-title').textContent = p.full;
    $('#info-content').innerHTML = `${art(p)}<p class="dialog-note">Original concept illustration · ${p.generation}</p><h3>${review ? 'Example editorial review' : 'Demo catalog preview'}</h3><p>${p.detail || 'This related product is an illustrative suggestion from the design brief. Its price and rating are sample data; full specifications and availability have not been independently checked.'}</p>${p.summary ? `<p>${p.summary}</p><p><strong>Sample editorial score: ${p.score}/10.</strong> No physical test was performed and no manufacturer affiliation is implied.</p>` : ''}<p><strong>${money(p.price)}</strong> · sample price · ${colorName(p.id)}</p>${p.source ? `<a href="${p.source}" target="_blank" rel="noopener noreferrer">Read the manufacturer’s documentation ↗</a><br>` : ''}<button class="primary" data-add="${p.id}">Add to demo cart</button>`;
    openDialog('#info-dialog');
  }
  function renderSearch() {
    const query = $('#search-input').value.trim().toLocaleLowerCase();
    const matches = catalog.filter((p) => `${p.full} ${p.generation}`.toLocaleLowerCase().includes(query));
    $('#search-results').innerHTML = matches.length ? matches.map((p) => `<button class="search-result" data-product-info="${p.id}"><span><strong>${p.full}</strong><small>${money(p.price)} · sample price</small></span>${icon('arrow-up-right')}</button>`).join('') : '<p class="empty-state">No matching products in this seven-item demo catalog.</p>';
  }
  const information = {
    account:['A demo, not an account',['Everything runs locally in this tab. The cart, wishlist and newsletter simulation have no backend or sign-in. Refreshing clears shopping state.','A shared comparison link can preserve only comparison settings, never your cart, wishlist or email.']],
    gifts:['Gift-card information',['Gift cards are outside this comparison demo. No redeemable card, balance or purchase is created.']],
    support:['Customer-service information',['Start with the model-specific FAQ and official source links. TechVault is a fictional retailer and has no customer-service operation.']],
    shipping:['Shipping & returns',['This is a local shopping simulation. There is no checkout, stock reservation, shipment, delivery commitment or returns contract. Consult the actual retailer before purchasing.']],
    warranty:['Warranty information',['Warranty terms depend on the exact product, seller, country and local consumer rights. The comparison links to official manufacturers so you can verify the applicable terms.']],
    orders:['Order tracking',['No orders are created by this demo. The cart summary is a local price calculation, not an order confirmation or tracking record.']],
    story:['Thoughtful tech. Confident choices.',['TechVault is an independent design concept for a clear, accessible product-comparison experience. It is not affiliated with Sony, Bose or Apple. Product names belong to their respective owners.']],
    reviews:['Reviews & scores policy',['Ratings, counts, editorial scores and buyer quotes are illustrative data supplied by the brief. Alex Chen is a fictional editor. No review is marked as a verified purchase, and no physical product testing has been performed.','The green Best markers use only numeric price, quoted battery life and listed weight among the currently selected models. They do not measure subjective audio quality.']],
    affiliate:['Affiliate disclosure',['This demo has no affiliate links, paid placement or commissioned sales. Official links are provided for specification checking.']],
    blog:['Editorial notes',['The central comparison corrects model and specification inconsistencies in the supplied brief. Subjective score charts are explicitly illustrative; product size, firmware and supported source devices still matter.']],
    careers:['Careers',['TechVault is a fictional design concept. No job openings or application service are offered.']],
    privacy:['Privacy in this demo',['There are no analytics, accounts, API requests, cookies or shopping-state storage. The site hosts its own Inter font and illustrations. Search and email checks stay in your browser tab.','Using Copy comparison link requests clipboard access only after your click. Visiting an official manufacturer link opens that third-party website under its own privacy policy.']],
    terms:['Demo terms',['Sample prices and discounts are not offers for sale. No payment, tax calculation, stock or fulfillment service exists. Confirm current details with the actual seller.','Product names are used for identification. The original concept illustrations are not manufacturer photographs or a guarantee of exact appearance.']],
    accessibility:['Accessibility',['The comparison supports keyboard navigation, native dialog focus management, reduced motion, labeled color selections and a horizontally scrollable specification region on small screens. All meaningful values are provided as text, not color alone.','Use the mobile arrow controls or scroll the table to choose the current product. The bottom purchase action follows that selection.']]
  };
  document.addEventListener('click',(event) => {
    const button = event.target.closest('button');
    if (!button) return;
    if (button.hasAttribute('data-close')) { button.closest('dialog').close(); return; }
    if (button.classList.contains('previous-product')) { stepProduct(-1); return; }
    if (button.classList.contains('next-product')) { stepProduct(1); return; }
    if (button.dataset.add) { addToCart(button.dataset.add); return; }
    if (button.dataset.wish) {
      const id = button.dataset.wish;
      wish.has(id) ? wish.delete(id) : wish.add(id);
      renderWishlist();
      return;
    }
    if (button.dataset.color) {
      const id = button.dataset.color;
      choices[id] = Number(button.dataset.index);
      $$(`[data-color="${id}"]`).forEach((swatch) => swatch.setAttribute('aria-pressed',String(Number(swatch.dataset.index) === choices[id])));
      $(`[data-color-label="${id}"]`).textContent = colorName(id);
      renderCurrent(false);
      return;
    }
    if (button.dataset.group) { group = button.dataset.group; renderSpecs(); return; }
    if (button.dataset.quantity) {
      const line = cart.find((entry) => entry.key === button.dataset.key);
      if (line) line.quantity = Math.min(9,Math.max(1,line.quantity + Number(button.dataset.quantity)));
      renderCart();
      return;
    }
    if (button.dataset.remove) { const i = cart.findIndex((entry) => entry.key === button.dataset.remove); if (i >= 0) cart.splice(i,1); renderCart(); return; }
    if (button.dataset.review) { showProduct(button.dataset.review,true); return; }
    if (button.dataset.productInfo) { showProduct(button.dataset.productInfo); return; }
    if (button.dataset.info) { const [title,text] = information[button.dataset.info]; showInfo(title,text); return; }
    if (button.dataset.social) { showInfo(`${button.dataset.social} · demo`,['This design concept has no configured social profile. No external account is opened and nothing is shared.']); return; }
    if (button.dataset.action === 'wishlist') { renderWishlist(); openDialog('#wishlist-dialog'); }
  });
  $('#edit-open').addEventListener('click',editComparison);
  $('#edit-form').addEventListener('submit',(event) => {
    event.preventDefault();
    const next = new FormData(event.currentTarget).getAll('model');
    if (next.length < 2 || next.length > 3) { $('#edit-status').textContent = 'Select at least two models to compare.'; return; }
    selected = products.filter((p) => next.includes(p.id)).map((p) => p.id);
    if (!selected.includes(current)) current = selected[0];
    renderProducts(); renderSpecs(); renderStories(); renderWishlist();
    $('#edit-dialog').close();
    updateCompact();
    toast(`${selected.length} models in your comparison.`);
  });
  $('#differences').addEventListener('change',(event) => { differences = event.target.checked; renderSpecs(); });
  $('#cart-open').addEventListener('click',() => { renderCart(); openDialog('#cart-dialog'); });
  $('#wishlist-open').addEventListener('click',() => { renderWishlist(); openDialog('#wishlist-dialog'); });
  $('#cart-summary').addEventListener('click',() => {
    const count = cart.reduce((sum,line) => sum + line.quantity,0);
    if (!count) return;
    $('#cart-status').textContent = `${count} demo item${count === 1 ? '' : 's'} · ${exactMoney(cart.reduce((sum,line) => sum + line.quantity * line.price,0))} subtotal. No tax, shipping, payment or order has been created.`;
  });
  $('#search-open').addEventListener('click',() => { $('#search-input').value = ''; renderSearch(); openDialog('#search-dialog'); $('#search-input').focus(); });
  $('#search-input').addEventListener('input',renderSearch);
  $('#menu-button').addEventListener('click',() => {
    const open = $('#mobile-nav').hidden;
    $('#mobile-nav').hidden = !open;
    $('#menu-button').setAttribute('aria-expanded',String(open));
    $('#menu-button').setAttribute('aria-label',`${open ? 'Close' : 'Open'} navigation`);
  });
  $$('#mobile-nav a').forEach((link) => link.addEventListener('click',() => { $('#mobile-nav').hidden = true; $('#menu-button').setAttribute('aria-expanded','false'); $('#menu-button').setAttribute('aria-label','Open navigation'); }));
  $('#mobile-add').addEventListener('click',() => addToCart(current));
  $('#newsletter-form').addEventListener('submit',(event) => {
    event.preventDefault();
    const input = $('#newsletter-email');
    if (!input.checkValidity() || !input.value.trim()) { input.reportValidity(); return; }
    $('#newsletter-status').textContent = 'Email format checked locally. No subscription was created, and nothing was sent or stored.';
  });
  $('#share-button').addEventListener('click',async () => {
    const url = new URL(location.href);
    url.search = '';
    url.hash = '';
    url.searchParams.set('models',selected.join(','));
    url.searchParams.set('specs',group);
    url.searchParams.set('differences',differences ? '1' : '0');
    url.searchParams.set('product',current);
    $('#share-link').value = url.href;
    $('#share-status').textContent = 'Copying comparison settings…';
    openDialog('#share-dialog');
    try { await navigator.clipboard.writeText(url.href); $('#share-status').textContent = 'Comparison link copied. Only comparison settings are included.'; }
    catch { $('#share-status').textContent = 'Clipboard access is unavailable. Select and copy the link below.'; $('#share-link').focus(); $('#share-link').select(); }
  });
  $('#related-prev').addEventListener('click',() => $('#related-track').scrollBy({left:-$('#related-track').clientWidth * .85,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'}));
  $('#related-next').addEventListener('click',() => $('#related-track').scrollBy({left:$('#related-track').clientWidth * .85,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'}));
  $('#spec-scroll').addEventListener('scroll',() => {
    if (aligning || innerWidth >= 768 || !productWidth()) return;
    const index = Math.min(selected.length - 1,Math.max(0,Math.round($('#spec-scroll').scrollLeft / productWidth())));
    if (current !== selected[index]) { current = selected[index]; renderCurrent(false); }
  },{passive:true});
  function updateCompact() {
    $('#compact-header').hidden = $('#product-row').getBoundingClientRect().bottom >= $('.site-header').getBoundingClientRect().bottom;
  }
  const onScroll = () => { if (!frame) frame = requestAnimationFrame(() => { updateCompact(); frame = 0; }); };
  addEventListener('scroll',onScroll,{passive:true});
  addEventListener('resize',() => { if (innerWidth >= 768) { $('#mobile-nav').hidden = true; $('#menu-button').setAttribute('aria-expanded','false'); $('#menu-button').setAttribute('aria-label','Open navigation'); } renderCurrent(true); updateCompact(); });
  $$('dialog').forEach((dialog) => dialog.addEventListener('click',(event) => {
    const rect = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) dialog.close();
  }));
  addEventListener('keydown',(event) => { if (event.key === 'Escape') { $('#mobile-nav').hidden = true; $('#menu-button').setAttribute('aria-expanded','false'); $('#menu-button').setAttribute('aria-label','Open navigation'); $('.account').open = false; } });
  addEventListener('pagehide',() => { clearTimeout(toastTimer); cancelAnimationFrame(frame); });
  renderProducts(); renderSpecs(); renderStories(); renderRelated(); renderWishlist(); renderCart(); updateCompact();
})();
