import { content as c } from "./content.js";
import { coverArt, vinyl, stamp } from "./lib/cover.js";
import { icons } from "./lib/icons.js";

const $ = selector => document.querySelector(selector);
const money = number => `$${number.toFixed(2)}`;
const icon = name => icons[name];
const artistFor = slug => c.artists.find(artist => artist.slug === slug);
const releaseFor = seed => c.releases.find(release => release.seed === seed);
const eyebrow = text => `<p class="eyebrow">${text}</p>`;
const nav = () => c.nav.map(([label, href]) => `<a href="${href}">${label}</a>`).join("");
const logo = () => `<span class="logomark" aria-hidden="true"><svg viewBox="0 0 42 42"><circle cx="23" cy="21" r="18" fill="none" stroke="#FF4B33" stroke-width="3"/><circle cx="20" cy="20" r="18" fill="#17130E"/><text x="20" y="27" text-anchor="middle" fill="#F3EDDE" font-family="Anton,sans-serif" font-size="18">${c.initials}</text></svg></span>`;
const heading = (label, title, intro = "") => `<div class="section-heading reveal"><div>${eyebrow(label)}<h2 class="riso-shift">${title}</h2></div>${intro ? `<p>${intro}</p>` : ""}</div>`;
const sleeve = release => `<button type="button" class="sleeve-scene" data-sleeve aria-pressed="false" aria-label="${c.catalog.sleeve}: ${release.title}"><span class="sleeve-record">${vinyl(c.initial, c.brand)}</span><span class="sleeve">${coverArt(release.seed)}</span><span class="sleeve-tab">${icon("Disc3")}</span></button>`;
const releaseCard = release => `<article class="release-card reveal" data-release="${release.seed}">${sleeve(release)}<div class="release-info"><div><h3>${release.title}</h3><a href="./artist.html?artist=${release.artist}">${artistFor(release.artist).name}</a></div><button class="listen" data-listen="${release.seed}" aria-label="${c.catalog.listen}: ${release.title}">${icon("Disc3")}</button></div><p class="meta">${release.cat} · ${release.format}</p></article>`;
const productCard = product =>
{
    const release = releaseFor(product.release);
    return `<article class="product-card reveal">${sleeve(release)}<p class="meta">${release.cat} · ${product.edition}</p><h3>${release.title}</h3><p class="variant">${product.variant}</p><div class="product-bottom"><span class="price">$${product.price}</span><button class="button ink" data-add="${product.id}">${c.shop.add}${icon("Plus")}</button></div></article>`;
};

function home()
{
    return `<section class="hero shell">
        <div class="hero-copy">${eyebrow(c.hero.eyebrow)}<h1 class="riso-shift">${c.hero.heading.map(line => `<span>${line}</span>`).join("")}</h1>
        <p class="hero-intro">${c.hero.intro} <strong>${c.creed}</strong></p>
        <div class="hero-actions"><a class="button ink" href="./index.html#catalog">${c.hero.primary}${icon("ArrowRight")}</a><a class="button outline" href="./index.html#tour">${c.hero.secondary}${icon("ArrowUpRight")}</a></div>
        <p class="meta hero-cat">${c.hero.catalog}</p></div>
        <div class="hero-art"><div class="hero-record">${vinyl(c.initial, c.brand)}</div><span class="print-stamp">${c.hero.stamp.join("<br>")}</span><p class="meta record-caption">${c.hero.caption}</p></div>
    </section>
    <div class="ticker" aria-label="${c.hero.ticker}"><div class="ticker-track" aria-hidden="true"><span>${c.hero.ticker}</span><span>${c.hero.ticker}</span></div></div>
    <section id="catalog" class="section shell">${heading(c.catalog.eyebrow, c.catalog.title, c.catalog.intro)}
        <div class="catalog-tools"><div class="filters" role="group" aria-label="${c.catalog.searchLabel}">${c.catalog.filters.map((filter, index) => `<button data-filter="${filter}" aria-pressed="${index === 0}">${filter}</button>`).join("")}</div><label class="search"><span class="sr-only">${c.catalog.searchLabel}</span><input id="record-search" type="search" placeholder="${c.catalog.searchPlaceholder}">${icon("ArrowRight")}</label></div>
        <p class="meta result-count" id="result-count" role="status"></p><div class="release-grid" id="release-grid"></div>
    </section>
    <section id="roster" class="section roster-section"><div class="shell">${heading(c.roster.eyebrow, c.roster.title, c.roster.intro)}<div class="roster-grid">${c.artists.map(artist => `<a class="artist-card reveal" href="./artist.html?artist=${artist.slug}"><div class="artist-stamp">${stamp(artist)}</div><div class="artist-heading"><h3>${artist.name}</h3>${icon("ArrowUpRight")}</div><p>${artist.line}</p><span class="meta">${artist.range}</span></a>`).join("")}</div></div></section>
    <section id="tour" class="section tour-section"><div class="shell narrow">${heading(c.tour.eyebrow, c.tour.title)}<div class="tour-list">${c.tour.rows.map(([season, city, venue, status]) => `<div class="tour-row reveal"><span class="meta season">${season}</span><div><h3>${city}</h3><span>${venue}</span></div><a class="status ${status.toLowerCase().replace(" ", "-")}" href="#" data-ticket aria-label="${city}, ${venue}: ${status}. Demo only.">${status}</a>${icon("ArrowUpRight")}</div>`).join("")}</div><p class="meta tour-note">${c.tour.note}</p><p id="ticket-message" class="meta" role="status"></p></div></section>
    <section class="section shell">${heading(c.shop.eyebrow, c.shop.title)}<div class="product-grid">${c.products.slice(0, 3).map(productCard).join("")}</div><a class="text-link" href="./shop.html">${c.shop.full}${icon("ArrowRight")}</a></section>`;
}

function shop()
{
    return `<section class="section shell shop-page">${eyebrow(c.shop.eyebrow)}<h1 class="riso-shift">${c.shop.pageTitle}</h1><p class="page-intro">${c.shop.intro}</p><div class="product-grid">${c.products.map(productCard).join("")}</div><div class="pressing-notes">${eyebrow(c.shop.notesTitle)}<div>${c.shop.notes.map(note => `<p class="meta">${note}</p>`).join("")}</div></div></section>`;
}

function artistPage()
{
    const artist = artistFor(new URLSearchParams(location.search).get("artist")) || c.artists[0];
    document.title = `${artist.name} — ${c.brand}`;
    const releases = c.releases.filter(release => release.artist === artist.slug);
    return `<section class="artist-hero shell"><div><div class="artist-stamp">${stamp(artist)}</div>${eyebrow(c.artist.eyebrow)}<h1 class="riso-shift">${artist.name}</h1><p class="meta">${releases.map(release => release.cat).join(" · ")}</p></div><p class="artist-bio">${artist.bio}</p></section><section class="section shell">${heading(c.artist.releases, c.artist.title)}<div class="release-grid">${releases.map(releaseCard).join("")}</div><a class="text-link back-link" href="./index.html#roster">← ${c.artist.back}</a></section>`;
}

const page = document.body.dataset.page;
$("#site").innerHTML = `<header id="top"><div class="shell header-inner"><a class="brand" href="./index.html">${logo()}<span>${c.brand}</span></a><nav aria-label="Main navigation">${nav()}</nav><button id="open-cart" class="cart-toggle" aria-label="${c.cart.open}" aria-haspopup="dialog">${icon("ShoppingBag")}<span id="cart-count">0</span></button></div></header>
    <main id="main">${page === "shop" ? shop() : page === "artist" ? artistPage() : home()}</main>
    <section class="listening-room shell" aria-label="${c.player.eyebrow}"><span class="listening-icon">${icon("Disc3")}</span><div>${eyebrow(c.player.eyebrow)}<p id="track-title" aria-live="polite">${c.player.idle}</p><p class="meta audio-note">${c.player.note}</p></div><div class="player-controls"><button id="play-toggle" class="button ink" disabled>${c.player.play}</button><label class="position"><span class="sr-only">${c.player.progress}</span><input id="audio-position" type="range" min="0" max="18" step=".1" value="0" disabled></label><span id="audio-time" class="meta">0:00 / 0:18</span><label class="volume"><span class="meta">${c.player.volume}</span><input id="audio-volume" type="range" min="0" max="1" step=".05" value=".5"></label></div><button id="dismiss-player" class="listen" aria-label="${c.player.dismiss}" hidden>${icon("X")}</button></section>
    <footer><div class="footer-wordmark" aria-hidden="true">${c.brand}</div><div class="shell footer-content"><div class="footer-main"><div><a class="brand" href="./index.html">${logo()}<span>${c.brand}</span></a><p class="meta">${c.footer.pressed}</p></div><nav aria-label="Footer navigation">${nav()}</nav></div><div class="footer-bottom"><p>${c.footer.honest}</p><div><span>${c.footer.copyright}</span><a href="${c.footer.creditUrl}" target="_blank" rel="noopener noreferrer">${c.footer.credit}${icon("ArrowUpRight")}</a></div></div></div></footer>`;

let filter = c.catalog.filters[0];
function renderCatalog()
{
    const query = $("#record-search")?.value.trim().toLocaleLowerCase() || "";
    const releases = c.releases.filter(release => (filter === c.catalog.filters[0] || release.type === filter) && `${release.title} ${artistFor(release.artist).name} ${release.cat}`.toLocaleLowerCase().includes(query));
    $("#release-grid").innerHTML = releases.length ? releases.map(releaseCard).join("") : `<p class="empty-results">${c.catalog.empty}</p>`;
    $("#result-count").textContent = `${releases.length} / ${c.releases.length} ${c.catalog.result}`;
    observeReveals();
    updateListenButtons();
}

const motion = matchMedia("(prefers-reduced-motion: reduce)");
const observer = new IntersectionObserver(entries =>
{
    for (const entry of entries)
    {
        if (entry.isIntersecting)
        {
            entry.target.classList.add("in");
            observer.unobserve(entry.target);
        }
    }
}, { threshold: 0.06 });

function observeReveals()
{
    document.querySelectorAll(".reveal:not(.in)").forEach((element, index) =>
    {
        element.style.setProperty("--stagger", `${index % 5 * (element.classList.contains("tour-row") ? 40 : 60)}ms`);
        if (motion.matches) element.classList.add("in");
        else observer.observe(element);
    });
}
document.documentElement.classList.add("js-reveals");
motion.addEventListener("change", () =>
{
    if (motion.matches) document.querySelectorAll(".reveal").forEach(element => element.classList.add("in"));
});

let cart = [];
try
{
    const stored = JSON.parse(localStorage.getItem(`${c.slug}-cart`) || "[]");
    if (Array.isArray(stored))
    {
        for (const item of stored)
        {
            if (!item || !c.products.some(product => product.id === item.id) || !Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 99 || cart.some(line => line.id === item.id)) continue;
            cart.push({ id: item.id, quantity: item.quantity });
        }
    }
}
catch
{
    cart = [];
}

let returnFocus;
function persistCart()
{
    try
    {
        localStorage.setItem(`${c.slug}-cart`, JSON.stringify(cart));
    }
    catch
    {
        // The cart remains usable when browser storage is unavailable.
    }
    $("#cart-count").textContent = cart.reduce((total, item) => total + item.quantity, 0);
}

function renderCart()
{
    const subtotal = cart.reduce((total, item) => total + c.products.find(product => product.id === item.id).price * item.quantity, 0);
    const items = cart.map(item =>
    {
        const product = c.products.find(product => product.id === item.id);
        const release = releaseFor(product.release);
        return `<article class="cart-line"><div class="cart-art">${coverArt(release.seed)}</div><div class="cart-line-info"><h3>${release.title}</h3><p>${product.variant}</p><p class="meta">${money(product.price)}</p><div class="quantity"><button data-quantity="-1" data-id="${item.id}" aria-label="${c.cart.decrease}: ${product.variant}">${icon("Minus")}</button><output aria-label="${c.cart.unit}">${item.quantity}</output><button data-quantity="1" data-id="${item.id}" aria-label="${c.cart.increase}: ${product.variant}" ${item.quantity >= 99 ? "disabled" : ""}>${icon("Plus")}</button></div></div><button class="remove" data-remove="${item.id}" aria-label="${c.cart.remove}: ${product.variant}">${icon("X")}</button></article>`;
    }).join("");
    $("#overlay").innerHTML = `<button class="backdrop" data-close aria-label="${c.cart.close}" tabindex="-1"></button><section class="drawer" role="dialog" aria-modal="true" aria-labelledby="cart-title"><div class="drawer-heading"><h2 id="cart-title">${c.cart.title}</h2><button class="close-cart" data-close aria-label="${c.cart.close}">${icon("X")}</button></div><div class="cart-items">${items || `<div class="cart-empty">${icon("Disc3")}<h3>${c.cart.empty}</h3><p>${c.cart.hint}</p></div>`}</div><div class="cart-summary"><div><span>${c.cart.subtotal}</span><strong>${money(subtotal)}</strong></div><div><span>${c.cart.shipping}</span><span>${money(cart.length ? 4 : 0)}</span></div><div class="total"><span>${c.cart.total}</span><strong>${money(subtotal + (cart.length ? 4 : 0))}</strong></div><p class="demo-line">${c.cart.demo}</p><button class="button ink" data-close>${c.cart.keep}${icon("ArrowRight")}</button></div></section>`;
}

function openCart()
{
    returnFocus = document.activeElement;
    renderCart();
    $("#overlay").hidden = false;
    $("#site").inert = true;
    document.body.classList.add("cart-open");
    requestAnimationFrame(() => $("#overlay").classList.add("is-open"));
    $(".close-cart").focus();
}

function closeCart()
{
    $("#overlay").classList.remove("is-open");
    $("#overlay").hidden = true;
    $("#site").inert = false;
    document.body.classList.remove("cart-open");
    if (returnFocus?.isConnected) returnFocus.focus();
    else $("#open-cart").focus();
}

$("#overlay").hidden = true;
persistCart();
$("#open-cart").addEventListener("click", openCart);
$("#record-search")?.addEventListener("input", renderCatalog);
$("#overlay").addEventListener("keydown", event =>
{
    if (event.key === "Escape")
    {
        event.preventDefault();
        closeCart();
    }
    if (event.key !== "Tab") return;
    const focusable = [...$(".drawer").querySelectorAll("button:not(:disabled), a[href], input")];
    const first = focusable[0];
    const last = focusable.at(-1);
    if (event.shiftKey && document.activeElement === first)
    {
        event.preventDefault();
        last.focus();
    }
    else if (!event.shiftKey && document.activeElement === last)
    {
        event.preventDefault();
        first.focus();
    }
});

document.addEventListener("click", event =>
{
    const target = event.target.closest("button, a");
    if (!target) return;
    if (target.hasAttribute("data-close")) closeCart();
    if (target.hasAttribute("data-sleeve"))
    {
        const pressed = target.getAttribute("aria-pressed") !== "true";
        target.setAttribute("aria-pressed", String(pressed));
        target.classList.toggle("revealed", pressed);
    }
    if (target.dataset.filter)
    {
        filter = target.dataset.filter;
        document.querySelectorAll("[data-filter]").forEach(button => button.setAttribute("aria-pressed", String(button === target)));
        renderCatalog();
    }
    if (target.hasAttribute("data-ticket"))
    {
        event.preventDefault();
        $("#ticket-message").textContent = c.tour.feedback;
    }
    if (target.dataset.add)
    {
        const existing = cart.find(item => item.id === target.dataset.add);
        if (existing) existing.quantity = Math.min(99, existing.quantity + 1);
        else cart.push({ id: target.dataset.add, quantity: 1 });
        persistCart();
        if (!motion.matches) $("#cart-count").animate([{ transform: "scale(1)" }, { transform: "scale(1.15)" }, { transform: "scale(1)" }], { duration: 160 });
        openCart();
    }
    if (target.dataset.quantity || target.dataset.remove)
    {
        const id = target.dataset.id || target.dataset.remove;
        const item = cart.find(line => line.id === id);
        if (target.dataset.remove) cart = cart.filter(line => line.id !== id);
        else
        {
            item.quantity = Math.min(99, item.quantity + Number(target.dataset.quantity));
            if (item.quantity <= 0) cart = cart.filter(line => line.id !== id);
        }
        persistCart();
        const selector = target.dataset.quantity ? `[data-id="${id}"][data-quantity="${target.dataset.quantity}"]` : `[data-remove="${id}"]`;
        renderCart();
        const next = $(selector);
        if (next && !next.disabled) next.focus();
        else $(".close-cart").focus();
    }
    if (target.dataset.listen) selectTrack(Number(target.dataset.listen));
});

document.addEventListener("pointerleave", event =>
{
    if (!event.target.classList?.contains("sleeve-scene")) return;
    event.target.classList.remove("revealed");
    event.target.setAttribute("aria-pressed", "false");
}, true);

let audio;
let gain;
let source;
let buffer;
let selected;
let started = 0;
let offset = 0;
let playing = false;

function makeSketch(seed)
{
    const rate = audio.sampleRate;
    const result = audio.createBuffer(1, rate * 18, rate);
    const data = result.getChannelData(0);
    const roots = [130.81, 146.83, 164.81, 174.61, 196];
    const root = roots[seed % roots.length];
    const pattern = [0, 7, 12, 3, 0, 10, 7, 15];
    for (let index = 0; index < data.length; index++)
    {
        const time = index / rate;
        const step = Math.floor(time / .375);
        const local = time % .375;
        const note = root * 2 ** (pattern[(step + seed) % pattern.length] / 12);
        const pluck = Math.sin(2 * Math.PI * note * time) * Math.exp(-local * 11) * .19;
        const bass = Math.sin(2 * Math.PI * root / 2 * time) * Math.exp(-(time % 1.5) * 4) * .14;
        const kickTime = time % .75;
        const kick = Math.sin(2 * Math.PI * (48 * kickTime + 2.8 * (1 - Math.exp(-kickTime * 28)))) * Math.exp(-kickTime * 22) * .22;
        const fade = Math.min(1, time * 10, (18 - time) * 3);
        data[index] = (pluck + bass + kick) * fade;
    }
    return result;
}

function currentPosition()
{
    return playing ? Math.min(18, offset + audio.currentTime - started) : offset;
}

function updateListenButtons()
{
    document.querySelectorAll("[data-listen]").forEach(button =>
    {
        const active = Number(button.dataset.listen) === selected && playing;
        button.classList.toggle("active", active);
        button.setAttribute("aria-pressed", String(active));
        button.setAttribute("aria-label", `${active ? c.player.pause : c.catalog.listen}: ${releaseFor(Number(button.dataset.listen)).title}`);
    });
}

function updatePlayer()
{
    $("#play-toggle").textContent = playing ? c.player.pause : c.player.play;
    $("#play-toggle").dataset.playing = String(playing);
    const position = currentPosition();
    $("#audio-position").value = position;
    $("#audio-time").textContent = `0:${String(Math.floor(position)).padStart(2, "0")} / 0:18`;
    updateListenButtons();
}

function stopAudio()
{
    if (source)
    {
        source.onended = null;
        source.stop();
        source.disconnect();
        source = undefined;
    }
}

function pauseAudio()
{
    offset = currentPosition();
    stopAudio();
    playing = false;
    updatePlayer();
}

async function playAudio()
{
    try
    {
        await audio.resume();
        if (offset >= 18) offset = 0;
        stopAudio();
        source = audio.createBufferSource();
        source.buffer = buffer;
        source.connect(gain);
        started = audio.currentTime;
        source.start(0, offset);
        source.onended = () =>
        {
            playing = false;
            offset = 0;
            updatePlayer();
        };
        playing = true;
        updatePlayer();
    }
    catch
    {
        $("#track-title").textContent = c.player.unavailable;
    }
}

async function selectTrack(seed)
{
    try
    {
        if (!audio)
        {
            audio = new AudioContext();
            gain = audio.createGain();
            gain.gain.value = Number($("#audio-volume").value);
            gain.connect(audio.destination);
        }
        if (selected === seed && playing)
        {
            pauseAudio();
            return;
        }
        if (selected !== seed)
        {
            stopAudio();
            playing = false;
            selected = seed;
            offset = 0;
            buffer = makeSketch(seed);
        }
        const release = releaseFor(seed);
        $("#track-title").textContent = `${release.title} — ${artistFor(release.artist).name}`;
        $("#play-toggle").disabled = false;
        $("#audio-position").disabled = false;
        $(".listening-room").classList.add("has-track");
        document.body.classList.add("audio-active");
        $("#dismiss-player").hidden = false;
        await playAudio();
    }
    catch
    {
        $("#track-title").textContent = c.player.unavailable;
    }
}

$("#play-toggle").addEventListener("click", () => playing ? pauseAudio() : playAudio());
$("#audio-position").addEventListener("input", () =>
{
    const wasPlaying = playing;
    stopAudio();
    playing = false;
    offset = Number($("#audio-position").value);
    if (wasPlaying) playAudio();
    else updatePlayer();
});
$("#audio-volume").addEventListener("input", () =>
{
    if (gain) gain.gain.value = Number($("#audio-volume").value);
});
$("#dismiss-player").addEventListener("click", () =>
{
    pauseAudio();
    $(".listening-room").classList.remove("has-track");
    document.body.classList.remove("audio-active");
    $("#dismiss-player").hidden = true;
    document.querySelector(`[data-listen="${selected}"]`)?.focus();
});
document.addEventListener("visibilitychange", () =>
{
    if (document.hidden && playing) pauseAudio();
});
window.addEventListener("pagehide", () =>
{
    stopAudio();
    audio?.close();
    observer.disconnect();
});
setInterval(() =>
{
    if (playing) updatePlayer();
}, 180);

if (page === "home") renderCatalog();
observeReveals();
