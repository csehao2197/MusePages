import { content as c } from "./content.js";
import { icons } from "./icons.js";

const $ = (selector, root = document) => root.querySelector(selector);
const main = $("#main");
const dialog = $("#drawer");
const ui = c.ui;
const escape = (value) => String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
const icon = (name) => icons[name] || "";
const url = (route = "") => `./index.html${route ? `#/${route}` : ""}`;
const link = (route, label, cls = "") => `<a class="${cls}" href="${url(route)}">${label}${icon("ArrowUpRight")}</a>`;
const money = (value) => `€${value.toFixed(2)}`;
let route = "";
let filter = "All";
let storyIndex = 0;
let playerIndex = 0;
let productIndex = 0;
let restoreFocus;
let checkout = {};
let cart = [];
let lastOrder = null;
try
{
    const stored = JSON.parse(localStorage.getItem("static-vale-bag") || "[]");
    cart = Array.isArray(stored) ? stored.filter((row) => Number.isInteger(row.id) && c.products[row.id] && c.products[row.id].sizes.includes(row.size) && Number.isInteger(row.qty) && row.qty > 0 && row.qty <= 99) : [];
    lastOrder = JSON.parse(localStorage.getItem("static-vale-order") || "null");
}
catch
{
    cart = [];
}

function persist()
{
    try
    {
        localStorage.setItem("static-vale-bag", JSON.stringify(cart));
        if (lastOrder) localStorage.setItem("static-vale-order", JSON.stringify(lastOrder));
        else localStorage.removeItem("static-vale-order");
    }
    catch
    {
        $("#notice").textContent = ui.unavailable;
    }
    updateCount();
}

function mark()
{
    return `<svg class="mark" viewBox="0 0 64 54" aria-hidden="true"><path d="M1 43 20 3h10L11 43zm19 8L39 11h10L30 51zm21-8L60 3h10L51 43z" fill="currentColor"/></svg>`;
}

function header()
{
    $("#header").innerHTML = `<a class="announcement" href="${url("matches")}"><span>NEXT / ${c.team.code} vs ${c.matches[0].opponent}</span><span>SAT 19:00 CET ${icon("ArrowUpRight")}</span></a>
        <div class="nav-shell"><a class="brand" href="${url()}">${mark()}<span>${c.team.brand}</span></a>
        <nav class="desktop-nav" aria-label="Main">${c.nav.map((name, i) => `<a href="${url(c.routes[i])}" ${route === c.routes[i] ? 'aria-current="page"' : ""}>${name}</a>`).join("")}</nav>
        <div class="nav-actions"><button data-action="cart" class="bag" aria-label="${ui.cart}">${icon("ShoppingBag")}<span class="bag-label">${ui.cart}</span><span id="cart-count">0</span></button><button data-action="menu" class="menu-button">${icon("Menu")} ${ui.menu}</button></div></div>
        <nav class="mobile-nav" aria-label="Mobile" hidden>${c.nav.map((name, i) => `<a href="${url(c.routes[i])}">${name}${icon("ArrowUpRight")}</a>`).join("")}</nav>`;
    updateCount();
}

function updateCount()
{
    if ($("#cart-count")) $("#cart-count").textContent = cart.reduce((sum, row) => sum + row.qty, 0);
}

function footer()
{
    $("#footer").innerHTML = `<div class="footer-top"><div><p class="eyebrow">${c.team.brand} / ${c.team.city}</p><p class="footer-statement">${ui.stay}</p></div><nav aria-label="Footer">${c.nav.map((name, i) => link(c.routes[i], name)).join("")}</nav><div class="footer-contact"><a href="mailto:${c.team.email}">${ui.contact}${icon("ArrowUpRight")}</a><p>${ui.footer}</p></div></div><div class="footer-bottom"><span>© 2026 ${c.team.brand}. Fictional team / local demo.</span><a href="${c.team.creditUrl}" target="_blank" rel="noopener noreferrer">${c.team.credit} ↗</a></div>`;
}

function playerCard(player, index)
{
    return `<button class="player-card" data-action="player" data-id="${index}" aria-label="${player.handle}, ${player.role}">
        <div class="portrait"><img src="./images/player-${player.image}.webp" alt="${player.alt}" loading="lazy"><span class="jersey-number">${player.number}</span><span class="portrait-label">${c.team.code} / ACTIVE FIVE</span></div>
        <div class="player-caption"><div><span class="eyebrow">${player.role} / #${player.number}</span><h3>${player.handle}</h3>${route === "roster" ? `<p>${player.name}</p>` : ""}</div>${icon("ArrowUpRight")}</div>
        <div class="stat-rail">${(route === "roster" ? player.stats.slice(0, 2) : [player.stats[index === 2 ? 1 : 0]]).map(([label, value]) => `<span><b>${value}</b> ${label}</span>`).join("")}</div></button>`;
}

function art(kind, title = "")
{
    const common = `<defs><linearGradient id="fabric-${kind}" x2="1" y2="1"><stop stop-color="#39413f"/><stop offset=".5" stop-color="#171e1d"/><stop offset="1" stop-color="#080c0c"/></linearGradient></defs>`;
    const slash = `<path d="m134 82-8 20h5l8-20zm9 3-8 20h5l8-20zm9-3-8 20h5l8-20z" fill="#c8ff3d"/>`;
    const shapes =
    {
        jersey:`<path d="m109 38-42 17-28 48 33 19 18-25-3 116h124l-3-116 18 25 33-19-28-48-42-17q-40 20-80 0z" fill="url(#fabric-jersey)" stroke="#505a53"/><path d="m109 38 40 22 40-22-8 19-32 15-32-15z" fill="#080b0b" stroke="#64725e"/><path d="m68 57 20 12m144-12-20 12M89 199h121" stroke="#c8ff3d" stroke-width="4"/><path d="m92 88 8 100m106-100-8 100" stroke="#303b34"/>${slash}`,
        hoodie:`<path d="m118 46-18 25-32 18-25 112 31 8 25-76-5 88h112l-5-88 25 76 31-8-25-112-32-18-18-25z" fill="url(#fabric-hoodie)" stroke="#4d5950"/><path d="M118 46q30-45 60 0l11 30-40 18-40-18z" fill="#111918" stroke="#596250"/><path d="m123 60 25 22 25-22m-25 22v63m-33 34 8-20h52l8 20z" fill="none" stroke="#65735b"/><path d="M96 215h109m-57-132-7 58m10-58 7 58" stroke="#c8ff3d" stroke-width="2"/>${slash}`,
        overshirt:`<path d="m111 39-41 22-27 139 30 9 23-98-4 108h116l-4-108 23 98 30-9-27-139-41-22-39 19z" fill="url(#fabric-overshirt)" stroke="#606954"/><path d="m111 39 15 35 24-16 24 16 15-35M150 58v159M105 88h29v28h-29zm62 0h29v28h-29z" fill="none" stroke="#8c9b76"/><path d="M109 90h21m41 0h21" stroke="#c8ff3d" stroke-width="3"/><g fill="#c8ff3d"><circle cx="150" cy="92" r="2"/><circle cx="150" cy="123" r="2"/><circle cx="150" cy="154" r="2"/><circle cx="150" cy="185" r="2"/></g>`,
        cap:`<path d="M68 145q0-80 75-83 70-2 77 77l-61 24z" fill="url(#fabric-cap)" stroke="#58644e"/><path d="M68 145q72-9 152-6l50 31q-53 34-157-5z" fill="#0c1211" stroke="#8b9b70"/><path d="M143 63q-18 32-13 83m13-83q35 24 41 78" fill="none" stroke="#4b5845"/><path d="m98 163 145 8" stroke="#c8ff3d" stroke-width="3"/>${slash}`,
        scarf:`<path d="m71 54 62-14 40 159-62 16zm80-11 60 10-28 166-61-10z" fill="url(#fabric-scarf)" stroke="#717e5c"/><path d="m84 97 64-14m-54 52 64-14m-54 52 64-14m-5-72 47 8m-54 31 47 8m-55 33 48 8" stroke="#c8ff3d" stroke-width="11"/><path d="m112 215 5 17m7-20 5 17m7-20 5 17m7-20 5 17m-23-18-3 18m16-16-3 18m16-16-3 18m16-16-3 18" stroke="#b3c58e" stroke-width="3"/>`,
        duffel:`<path d="m64 102 37-19h111l30 28 8 78-31 16H76l-21-19z" fill="url(#fabric-duffel)" stroke="#69795c"/><path d="M106 100V66q35-25 68 0v34m-54-4V73q21-13 40 0v23M82 112v76m132-76v77M83 112h130m-91 45h63v27h-63z" fill="none" stroke="#637053" stroke-width="4"/><path d="M81 118h132m-30 39v27" stroke="#c8ff3d" stroke-width="3"/>${slash}`
    };
    return `<svg viewBox="0 0 300 250" class="product-art" role="img" aria-label="${escape(title || kind)}">${common}<ellipse cx="150" cy="225" rx="96" ry="9" fill="#000" opacity=".3"/>${shapes[kind]}</svg>`;
}

function productCard(product, index)
{
    return `<article class="product-card"><div class="product-image"><span class="product-number">0${index + 1} / ${c.team.code}</span>${art(product.kind, product.name)}</div><div class="product-title"><h3>${product.name}</h3><span>€${product.price}</span></div><p>${ui.blackVolt} · ${product.material}</p><div class="product-actions"><button data-action="product" data-id="${index}">${ui.quick}${icon("ArrowUpRight")}</button><button data-action="add" data-id="${index}">${ui.add}${icon("Plus")}</button></div></article>`;
}

function matchRow(match, index)
{
    return `<details class="match-row"><summary><span class="status ${match.type === "Upcoming" ? "volt" : ""}">${match.type === "Upcoming" ? ui.next : ui.results}<small>${match.stage}</small></span><span class="fixture"><b>${c.team.code}</b><strong>${match.score}</strong><b>${match.code}</b><small>${c.team.brand} / ${match.opponent}</small></span><span class="match-time">${match.time}<small>${match.format}</small></span>${icon("ChevronDown")}</summary><div class="match-details"><div><p class="eyebrow">${ui.mapPool}</p>${match.maps.map((map) => `<p class="map-score">${map}</p>`).join("")}</div><div><p>${match.note}</p><button class="button secondary" data-action="download" data-id="${index}">${ui.download}${icon("Download")}</button></div></div></details>`;
}

function storyImage(story)
{
    return story.image === "jersey" ? `<div class="story-art">${art("jersey", story.title)}</div>` : `<img src="./images/${story.image}.webp" alt="${story.image === "hero-arena" ? c.hero.alt : c.players.find((p) => `player-${p.image}` === story.image)?.alt}" loading="lazy">`;
}

function storyCard(story, index)
{
    return `<article class="story-card"><button class="story-image" data-action="story" data-id="${index}" aria-label="${escape(story.title)}">${storyImage(story)}</button><div class="story-meta eyebrow">${story.category} <span>${story.time}</span></div><h3>${story.title}</h3><p>${story.dek}</p><button class="text-link" data-action="story" data-id="${index}">${ui.read}${icon("ArrowUpRight")}</button></article>`;
}

function sectionHead(number, title, copy, routeName, label)
{
    return `<div class="section-head"><div><p class="eyebrow section-number">${number} / ${c.team.code}</p><h2>${title}</h2>${copy ? `<p>${copy}</p>` : ""}</div>${routeName ? link(routeName, label, "text-link") : ""}</div>`;
}

function home()
{
    return `<section class="hero"><div class="hero-image"><img src="${c.hero.image}" alt="${c.hero.alt}" fetchpriority="high"></div><div class="hero-grain"></div><div class="hero-top"><p class="eyebrow">${c.hero.eyebrow}</p><span class="eyebrow season-index">SEASON / 026</span></div><div class="hero-copy"><h1>${c.hero.title}<span>${c.hero.outline}</span></h1><p>${c.hero.copy}</p><div class="hero-buttons">${link("roster", c.hero.primary, "button primary")}${link("matches", c.hero.secondary, "button secondary")}</div></div><div class="hero-bottom"><span class="vertical-note eyebrow">${ui.scroll}</span><a class="next-series" href="${url("matches")}"><div class="eyebrow"><span class="dot"></span>${ui.nextSeries}${icon("ArrowUpRight")}</div><div class="next-codes">${c.team.code} <span>vs</span> IRU</div><p>${ui.semifinal}</p><small>Saturday / 19:00 CET</small></a></div></section>
        <section class="numbers" aria-label="Season statistics">${c.metrics.map(([value, label]) => `<div><strong>${value}</strong><span class="eyebrow">${label}</span></div>`).join("")}<p>${ui.sample}</p></section>
        <section class="section roster-preview">${sectionHead("01", ui.rosterHeading, ui.rosterCopy, "roster", ui.fullRoster)}<div class="carousel-controls"><button data-action="scroll-roster" data-id="-1" aria-label="Previous players">${icon("ChevronLeft")}</button><button data-action="scroll-roster" data-id="1" aria-label="Next players">${icon("ChevronRight")}</button></div><div class="player-grid featured">${c.players.slice(0, 3).map(playerCard).join("")}</div></section>
        <section class="section carbon">${sectionHead("02", ui.matchesHeading, "", "matches", ui.allMatches)}<div class="match-preview"><a class="upcoming-panel" href="${url("matches")}"><p class="eyebrow volt">NEXT / ${c.team.season}</p><div class="giant-score">${c.team.code}<span>vs</span>IRU</div><p>${c.matches[0].stage} / ${c.matches[0].format}</p><small>${c.matches[0].time}</small>${icon("ArrowUpRight")}</a><div class="result-panel"><p class="eyebrow">${ui.latest} / WEEK 6</p><div class="result-score">${c.team.code} <strong>2–1</strong> OCH</div>${c.matches[2].maps.map((map) => `<p class="map-score">${map}</p>`).join("")}<small>Mako 1.42 series rating</small></div></div></section>
        <section class="partners"><p class="eyebrow">${ui.partners}</p><div class="partner-window"><div class="partner-track">${[0, 1].map((repeat) => `<div class="partner-group" ${repeat ? 'aria-hidden="true"' : ""}>${c.sponsors.map((name, i) => `<span><svg viewBox="0 0 32 32" aria-hidden="true"><path d="${["M5 5h21v8H13v14H5z","M4 23 16 3l12 20H4zm7-5h10L16 9z","M4 16 16 4l12 12-12 12zM10 16h12","M4 6h24v7H4zm0 13h24v7H4z","M3 25 16 4l13 21H19L16 17l-3 8z"][i]}" fill="none" stroke="currentColor" stroke-width="2"/></svg>${name}</span>`).join("")}</div>`).join("")}</div></div><a href="mailto:${c.team.email}">${ui.partnership}${icon("ArrowUpRight")}</a></section>
        <section class="section">${sectionHead("03", ui.shopHeading, ui.shopCopy, "shop", ui.allShop)}<div class="product-grid preview-products">${[0, 1, 3, 4].map((index) => productCard(c.products[index], index)).join("")}</div></section>
        <section class="section carbon">${sectionHead("04", ui.newsHeading, "", "news", ui.allNews)}<div class="story-grid home-stories">${c.stories.slice(0, 3).map(storyCard).join("")}</div></section>`;
}

function intro(eyebrow, title, copy, extra = "")
{
    return `<section class="page-intro"><div><p class="eyebrow volt">${eyebrow}</p><h1>${title}</h1><p>${copy}</p></div>${extra}</section>`;
}

function filters(values)
{
    return `<div class="filter-row">${values.map((value) => `<button data-action="filter" data-value="${value}" aria-pressed="${filter === value}">${value} <span>${filterCount(value)}</span></button>`).join("")}<span class="result-count" aria-live="polite">${filterCount(filter)} ${ui.count}</span></div>`;
}

function filterCount(value)
{
    const list = route === "roster" ? c.players : route === "matches" ? c.matches : route === "shop" ? c.products : c.stories;
    return list.filter((item) => value === "All" || (item.role || item.type || item.category) === value).length;
}

function roster()
{
    return `${intro(ui.active, ui.rosterTitle, ui.rosterIntro, '<span class="outline-count">05</span>')}<div class="section route-section"><p class="glossary">${ui.glossary}</p><p class="sample">${ui.sample}</p>${filters(c.roles)}<div class="player-grid">${c.players.map((player, index) => filter === "All" || player.role === filter ? playerCard(player, index) : "").join("")}</div><div class="principles">${c.principles.map(([title, copy], i) => `<article><span class="eyebrow volt">0${i + 1}</span><h3>${title}</h3><p>${copy}</p></article>`).join("")}</div>${link("matches", "See how the season is going", "text-link")}</div>`;
}

function matches()
{
    return `${intro(ui.seasonHeader, ui.matchesTitle, ui.matchesIntro, `<div class="summary-chips">${ui.summary.map((text) => `<span>${text}</span>`).join("")}</div>`)}<div class="section route-section"><p class="sample">${ui.sample}</p>${filters(ui.matchFilters)}<div class="match-list">${c.matches.map((match, index) => filter === "All" || match.type === filter ? matchRow(match, index) : "").join("")}</div><div class="preparation"><div><h2>${ui.prepare}</h2><p>${ui.prepareCopy}</p></div><svg viewBox="0 0 580 180" role="img" aria-label="Fictional semifinal preparation bracket: STV and IRU; OCH and DFN"><g fill="none" stroke="#56624b"><path d="M100 30h80v50h90m-170 50h80V80m90 0h80v30h80M350 40h80v70"/></g><g fill="#f3f6ef" font-family="monospace" font-size="18"><text x="40" y="35">STV</text><text x="40" y="135">IRU</text><text x="280" y="45">OCH</text><text x="455" y="115">DFN</text></g><circle cx="270" cy="80" r="6" fill="#c8ff3d"/></svg></div></div>`;
}

function shop()
{
    return `${intro(ui.teamGoods, ui.shopTitle, ui.shopIntro, `<div class="shop-intro-art">${art("jersey", c.products[0].name)}</div>`)}<div class="section route-section"><p class="demo-note">${ui.demo}</p>${filters(ui.filters)}<div class="product-grid">${c.products.map((product, index) => filter === "All" || product.category === filter ? productCard(product, index) : "").join("")}</div><div class="principles">${ui.care.map(([title, copy]) => `<article>${icon("Check")}<h3>${title}</h3><p>${copy}</p></article>`).join("")}</div><p class="sample">${ui.fitNote}</p></div>`;
}

function article()
{
    const story = c.stories[storyIndex];
    return `<p class="eyebrow volt">${story.category} / ${story.time}</p><h2 id="article-title" tabindex="-1">${story.title}</h2><p class="article-dek">${story.dek}</p>${story.paragraphs.map((paragraph, i) => `<p>${paragraph}</p>${i === 0 ? `<blockquote>${story.quote}</blockquote>` : ""}`).join("")}<div class="article-nav"><button data-action="prev-story">${icon("ChevronLeft")}${ui.previous} story</button><button data-action="next-story">${ui.next} story${icon("ChevronRight")}</button></div>`;
}

function news()
{
    return `${intro(ui.newsroom, ui.newsTitle, ui.newsIntro)}<div class="section route-section">${filters(ui.storyFilters)}<div class="story-grid">${c.stories.map((story, index) => filter === "All" || story.category === filter ? storyCard(story, index) : "").join("")}</div><article id="reader" class="article-reader">${article()}</article></div>`;
}

function render(keepScroll = false)
{
    const candidate = location.hash.replace(/^#\/?/, "");
    route = c.routes.includes(candidate) ? candidate : "";
    if (candidate && !c.routes.includes(candidate)) history.replaceState(null, "", url());
    header();
    main.innerHTML = ({ roster, matches, shop, news }[route] || home)();
    footer();
    if (!keepScroll) window.scrollTo(0, 0);
}

function openDrawer(html, label, fresh = true)
{
    if (!dialog.open)
    {
        restoreFocus = document.activeElement;
        dialog.showModal();
        $("#site").inert = true;
        document.body.classList.add("drawer-open");
    }
    dialog.setAttribute("aria-label", label);
    dialog.innerHTML = `<div class="drawer-header"><span class="eyebrow">${label}</span><button data-action="close" aria-label="${ui.close}">${icon("X")}</button></div><div class="drawer-body">${html}</div>`;
    if (fresh) $(".drawer-header button", dialog).focus();
}

function closeDrawer()
{
    dialog.close();
    $("#site").inert = false;
    document.body.classList.remove("drawer-open");
    if (restoreFocus?.isConnected) restoreFocus.focus();
}

function showPlayer(index)
{
    playerIndex = (index + c.players.length) % c.players.length;
    const player = c.players[playerIndex];
    openDrawer(`<img class="drawer-portrait" src="./images/player-${player.image}.webp" alt="${player.alt}"><p class="eyebrow volt">${player.role} / #${player.number}</p><h2>${player.handle}</h2><p>${player.name}</p><p>${player.bio}</p><p class="sample">${ui.sample}</p><div class="stat-bars">${player.stats.map(([label, value], i) => `<div><span>${label}<b>${value}</b></span><div class="stat-track"><i style="width:${player.bars[i]}%"></i></div></div>`).join("")}</div><h3 class="eyebrow">${ui.recent}</h3>${player.recent.map((line) => `<p class="map-score">${line}</p>`).join("")}<div class="article-nav"><button data-action="prev-player">${icon("ChevronLeft")}${ui.previous} ${ui.player}</button><button data-action="next-player">${ui.next} ${ui.player}${icon("ChevronRight")}</button></div>`, player.handle);
}

function showProduct(index)
{
    productIndex = index;
    const product = c.products[index];
    openDrawer(`${art(product.kind, product.name)}<p class="eyebrow volt">${ui.blackVolt}</p><h2>${product.name}</h2><p class="price">${money(product.price)}</p><p>${product.material} / ${product.fit}</p><p class="sample">${ui.demo}</p><label for="size">${ui.size}</label><select id="size">${product.sizes.map((size) => `<option ${size === "M" ? "selected" : ""}>${size}</option>`).join("")}</select><label for="quantity">${ui.quantity}</label><div class="quantity-picker"><button data-action="product-minus" aria-label="Decrease quantity">${icon("Minus")}</button><input id="quantity" type="number" min="1" max="99" value="1" inputmode="numeric"><button data-action="product-plus" aria-label="Increase quantity">${icon("Plus")}</button></div><button class="button primary wide" data-action="add-selected">${ui.addCart}${icon("Plus")}</button>`, ui.quick);
}

function add(id, size, qty = 1)
{
    const product = c.products[id];
    size ||= product.sizes.includes("M") ? "M" : product.sizes[0];
    const row = cart.find((entry) => entry.id === id && entry.size === size);
    if (row) row.qty = Math.min(99, row.qty + qty);
    else cart.push({ id, size, qty });
    persist();
    showCart();
}

function total()
{
    return cart.reduce((sum, row) => sum + row.qty * c.products[row.id].price, 0);
}

function showCart()
{
    if (lastOrder && !cart.length)
    {
        showSaved();
        return;
    }
    openDrawer(`<h2>${ui.cart}</h2><p class="sample">${ui.local}</p>${cart.length ? `<div class="cart-items">${cart.map((row, i) => `<article class="cart-row"><div class="cart-art">${art(c.products[row.id].kind, c.products[row.id].name)}</div><div><h3>${c.products[row.id].name}</h3><p>${escape(row.size)} / ${money(c.products[row.id].price)}</p><div class="cart-quantity"><button data-action="minus" data-id="${i}" aria-label="Decrease ${c.products[row.id].name} quantity">${icon("Minus")}</button><span>${row.qty}</span><button data-action="plus" data-id="${i}" aria-label="Increase ${c.products[row.id].name} quantity" ${row.qty === 99 ? "disabled" : ""}>${icon("Plus")}</button><button class="remove" data-action="remove" data-id="${i}">${ui.remove}</button></div></div></article>`).join("")}</div><div class="cart-total"><p>${ui.subtotal}<strong>${money(total())}</strong></p><p>${ui.shipping}<span>€0.00</span></p><button class="button primary wide" data-action="checkout">${ui.checkout}${icon("ArrowUpRight")}</button></div>` : `<div class="empty-state">${icon("ShoppingBag")}<h3>${ui.empty}</h3><button class="button primary" data-action="continue">${ui.continue}${icon("ArrowUpRight")}</button></div>`}`, ui.cart);
}

function showCheckout()
{
    openDrawer(`<button class="text-link" data-action="cart">${icon("ArrowLeft")}${ui.back}</button><h2>${ui.checkout}</h2><p>${ui.local}</p><form id="checkout-form"><label for="email">${ui.email}</label><input id="email" name="email" type="email" autocomplete="email" required maxlength="200" value="${escape(checkout.email || "")}"><label for="country">${ui.country}</label><input id="country" name="country" required minlength="2" maxlength="80" autocomplete="country-name" value="${escape(checkout.country || "")}"><button type="submit" class="button primary wide">${ui.review}${icon("ArrowUpRight")}</button></form>`, ui.checkout);
}

function showReview()
{
    openDrawer(`<button class="text-link" data-action="checkout">${icon("ArrowLeft")}${ui.previous}</button><h2>${ui.noPayment}</h2><p>${escape(checkout.email)}<br>${escape(checkout.country)}</p>${cart.map((row) => `<p class="map-score">${row.qty} × ${c.products[row.id].name} / ${escape(row.size)} <b>${money(c.products[row.id].price * row.qty)}</b></p>`).join("")}<p class="price">${ui.subtotal}: ${money(total())}</p><p>${ui.local}</p><button class="button primary wide" data-action="place">${ui.place}${icon("Check")}</button>`, ui.review);
}

function showSaved()
{
    openDrawer(`${icon("Check")}<h2>${ui.saved}</h2><p class="eyebrow volt">${escape(lastOrder.reference)}</p><p>${money(lastOrder.total)} / ${lastOrder.items} ${ui.items}</p><button class="button secondary wide" data-action="clear-order">${ui.clear}${icon("X")}</button>`, ui.checkout);
}

function selectStory(index)
{
    storyIndex = (index + c.stories.length) % c.stories.length;
    if (route !== "news")
    {
        location.hash = "/news";
        return;
    }
    $("#reader").innerHTML = article();
    $("#article-title").focus({ preventScroll: true });
    $("#reader").scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth", block: "start" });
}

document.addEventListener("click", (event) =>
{
    const button = event.target.closest("[data-action]");
    if (!button) return;
    const id = Number(button.dataset.id);
    switch (button.dataset.action)
    {
        case "close": closeDrawer(); break;
        case "menu":
        {
            const nav = $(".mobile-nav");
            nav.hidden = !nav.hidden;
            button.setAttribute("aria-expanded", String(!nav.hidden));
            if (!nav.hidden) $("a", nav).focus();
            break;
        }
        case "cart": showCart(); break;
        case "player": showPlayer(id); break;
        case "prev-player": showPlayer(playerIndex - 1); break;
        case "next-player": showPlayer(playerIndex + 1); break;
        case "product": showProduct(id); break;
        case "add": add(id); break;
        case "add-selected":
        {
            const quantity = $("#quantity");
            if (quantity.reportValidity()) add(productIndex, $("#size").value, Number(quantity.value));
            break;
        }
        case "product-minus":
        case "product-plus":
        {
            const quantity = $("#quantity");
            quantity.value = Math.max(1, Math.min(99, (Number(quantity.value) || 1) + (button.dataset.action === "product-plus" ? 1 : -1)));
            break;
        }
        case "minus":
        case "plus":
        case "remove":
        {
            const action = button.dataset.action;
            if (action === "remove") cart.splice(id, 1);
            else
            {
                cart[id].qty = Math.min(99, cart[id].qty + (action === "plus" ? 1 : -1));
                if (!cart[id].qty) cart.splice(id, 1);
            }
            persist();
            showCart();
            break;
        }
        case "continue": closeDrawer(); location.hash = "/shop"; break;
        case "checkout": showCheckout(); break;
        case "place":
        {
            if (!cart.length || !checkout.email || !checkout.country) break;
            lastOrder = { reference: `STV-DEMO-${crypto.randomUUID().slice(0, 8).toUpperCase()}`, total: total(), items: cart.reduce((sum, row) => sum + row.qty, 0) };
            cart = [];
            checkout = {};
            persist();
            showSaved();
            break;
        }
        case "clear-order": lastOrder = null; persist(); showCart(); break;
        case "filter":
        {
            filter = button.dataset.value;
            const scroll = window.scrollY;
            render(true);
            $(`[data-value="${filter}"]`)?.focus({ preventScroll: true });
            window.scrollTo(0, scroll);
            break;
        }
        case "story": selectStory(id); break;
        case "prev-story": selectStory(storyIndex - 1); break;
        case "next-story": selectStory(storyIndex + 1); break;
        case "scroll-roster": $(".featured").scrollBy({ left: id * 310, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" }); break;
        case "download":
        {
            const match = c.matches[id];
            const blob = new Blob([`${c.team.brand} / ${c.team.season}\n${ui.sample}\n${c.team.code} ${match.score} ${match.opponent}\n${match.stage} / ${match.time}\n${match.format}\n${match.maps.join("\n")}\n${match.note}`], { type: "text/plain" });
            const objectUrl = URL.createObjectURL(blob);
            const anchor = document.createElement("a");
            anchor.href = objectUrl;
            anchor.download = `static-vale-${match.code.toLowerCase()}-match-card.txt`;
            anchor.click();
            setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
            break;
        }
    }
});

document.addEventListener("submit", (event) =>
{
    if (event.target.id !== "checkout-form") return;
    event.preventDefault();
    checkout = { email: $("#email").value.trim(), country: $("#country").value.trim() };
    if (checkout.country.length < 2)
    {
        $("#country").setCustomValidity("Enter at least two non-space characters.");
        $("#country").reportValidity();
        return;
    }
    showReview();
});
document.addEventListener("input", (event) =>
{
    if (event.target.id === "country") event.target.setCustomValidity("");
});
dialog.addEventListener("cancel", (event) =>
{
    event.preventDefault();
    closeDrawer();
});
dialog.addEventListener("click", (event) =>
{
    if (event.target === dialog)
    {
        const bounds = dialog.getBoundingClientRect();
        if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) closeDrawer();
    }
});
document.addEventListener("keydown", (event) =>
{
    if (event.key === "Escape" && !dialog.open && $(".mobile-nav") && !$(".mobile-nav").hidden)
    {
        $(".mobile-nav").hidden = true;
        $(".menu-button").setAttribute("aria-expanded", "false");
        $(".menu-button").focus();
    }
});
window.addEventListener("hashchange", () =>
{
    if (dialog.open) closeDrawer();
    filter = "All";
    render();
    main.focus({ preventScroll: true });
    if (route === "news" && storyIndex) selectStory(storyIndex);
});
render();
