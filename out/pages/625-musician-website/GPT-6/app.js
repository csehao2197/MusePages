import { content as c } from "./content.js";
import { SamplePlayer } from "./player.js";

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const artistSlug = c.artist.toLowerCase().replace(/[^a-z0-9]+/g, "-");
const storageKey = `${artistSlug}:listener`;
const money = (value) => `$${value.toFixed(2)}`;
let storageAvailable = true;
let state = { email: "", joined: false, bag: [] };
try
{
    const saved = JSON.parse(localStorage.getItem(storageKey) ?? "null");
    if (saved && typeof saved.email === "string" && typeof saved.joined === "boolean" && Array.isArray(saved.bag))
    {
        state = { email: saved.email, joined: saved.joined, bag: saved.bag.filter((slug) => c.merch.items.some((item) => item.slug === slug)).slice(0, 100) };
    }
}
catch
{
    storageAvailable = false;
}

const iconPaths =
{
    play: '<polygon points="6 3 20 12 6 21 6 3"/>',
    pause: '<rect x="14" y="3" width="4" height="18" rx="1"/><rect x="6" y="3" width="4" height="18" rx="1"/>',
    bag: '<path d="M16 10a4 4 0 0 1-8 0M3.103 6.034h17.794M3.4 5.467a2 2 0 0 0-.4 1.2V20a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6.667a2 2 0 0 0-.4-1.2l-2-2.667A2 2 0 0 0 17 2H7a2 2 0 0 0-1.6.8z"/>',
    plus: '<path d="M5 12h14M12 5v14"/>',
    minus: '<path d="M5 12h14"/>',
    x: '<path d="m18 6-12 12M6 6l12 12"/>',
    menu: '<path d="M4 5h16M4 12h16M4 19h16"/>',
    volume: '<path d="M11 4.7a.7.7 0 0 0-1.2-.5L5.5 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.5l4.3 3.8a.7.7 0 0 0 1.2-.5zM16 9a5 5 0 0 1 0 6M19.4 5.6a9 9 0 0 1 0 12.8"/>',
    mail: '<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
    download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>',
    ticket: '<path d="M2 9a3 3 0 0 1 0 6v3a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1v-3a3 3 0 0 1 0-6V6a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1Zm11-4v2m0 4v2m0 4v2"/>'
};
const icon = (name) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${iconPaths[name]}</svg>`;
const nav = () => c.nav.map(([label, id]) => `<a href="#${id}">${label}</a>`).join("");
const heading = (section) => `<div class="section-title reveal"><div><p class="eyebrow">${section.eyebrow}</p><h2>${section.heading}</h2></div><p class="section-note">${section.note}</p></div>`;
const playButton = (extra = "") => `<button class="play-circle ${extra}" data-play aria-label="${c.ui.play}" aria-pressed="false">${icon("play")}</button>`;
const vinyl = `<div class="turntable" aria-label="Original drawn Slow Static vinyl record"><div class="turntable-corner"></div><div class="record"><span class="record-label"><small>MARISOL WAVE</small><strong>slow<br>static</strong><small>AMBIENT SOUL</small></span></div><div class="tonearm"></div><span class="turntable-mark">MW / SIDE A</span></div>`;

$("#site").innerHTML = `
    <header class="header">
        <div class="header-inner">
            <a class="wordmark" href="./index.html">${c.artist}</a>
            <nav class="desktop-nav" aria-label="Main navigation">${nav()}</nav>
            <div class="header-actions">
                <button class="bag-button" id="open-bag" aria-haspopup="dialog" aria-controls="bag-dialog">${icon("bag")}<span>${c.bag.count}</span><b id="bag-count">0</b></button>
                <button class="icon-button mobile-menu" id="open-menu" aria-label="${c.ui.openMenu}" aria-haspopup="dialog" aria-controls="menu-dialog">${icon("menu")}</button>
            </div>
        </div>
    </header>
    <main>
        <section class="hero" aria-labelledby="artist-title">
            <img class="hero-image" src="${c.hero.image}" alt="${c.hero.alt}" fetchpriority="high">
            <div class="hero-wash"></div>
            <span class="hero-side">${c.hero.side}</span>
            <div class="hero-content">
                <p class="eyebrow"><span class="live-dot"></span>${c.hero.eyebrow}</p>
                <h1 id="artist-title">${c.hero.words.map((word) => `<span>${word}</span>`).join("")}</h1>
                <p class="hero-subline">${c.hero.subline}<br><span>${c.hero.detail}</span></p>
                ${playButton("hero-play")}
                <p class="hero-caption">${c.hero.caption}</p>
            </div>
            <div class="hero-floor"><span>${c.hero.bottom[0]}</span><a href="#music">${c.hero.bottom[1]} <span aria-hidden="true">↓</span></a></div>
        </section>
        <section class="section release-section" id="music">
            <div class="container">
                ${heading(c.music)}
                <div class="music-grid">
                    <div class="album reveal">
                        ${vinyl}
                        <div class="track-list"><p class="eyebrow">${c.ui.trackList}</p>${c.music.tracks.map(([title, time], i) => `<div class="track-row ${i === 2 ? "sample-row" : ""}"><span class="track-number">${String(i + 1).padStart(2, "0")}</span>${i === 2 ? `<button data-play class="track-button" aria-label="${c.ui.play}" aria-pressed="false">${title}<span class="sample-tag">${c.ui.sample}</span></button>` : `<span class="track-title">${title}</span>`}<span class="track-duration">${time}</span></div>`).join("")}</div>
                        <p class="caption album-caption">${c.music.streaming}</p>
                    </div>
                    <div class="listening-column reveal">
                        <div class="player" id="player" tabindex="0" role="region" aria-label="Sample audio player">
                            <p class="eyebrow"><span class="live-dot"></span><span id="player-state">${c.ui.ready}</span></p>
                            <h3>${c.music.title}</h3>
                            <p class="caption">${c.music.label}</p>
                            <div class="visualizer" aria-hidden="true">${Array.from({ length: 24 }, (_, i) => `<i style="--bar:${12 + ((i * 13 + 7) % 46)}%"></i>`).join("")}</div>
                            <div class="transport">${playButton()}<div class="seek-wrap"><label class="sr-only" for="seek">${c.ui.seek}</label><input id="seek" type="range" min="0" max="12" step="0.05" value="0" aria-valuetext="0:00 of 0:12"><div class="time-labels"><output id="elapsed">0:00</output><span>0:12 ↺</span></div></div></div>
                            <div class="volume-row"><button id="mute" class="icon-button" aria-label="${c.ui.mute}" aria-pressed="false">${icon("volume")}</button><label for="volume">${c.ui.volume}</label><input id="volume" type="range" min="0" max="100" step="1" value="65"><output id="volume-value">65%</output></div>
                            <p class="caption player-help">${c.music.help}</p>
                            <p class="player-notice">${c.music.caption}</p>
                            <p class="caption">${c.music.disclosure}</p>
                            <p id="audio-error" class="error" role="status"></p>
                        </div>
                        <figure class="keys-photo"><img src="${c.music.image}" alt="${c.music.alt}" loading="lazy"><figcaption>${c.music.imageCaption}</figcaption></figure>
                    </div>
                </div>
            </div>
        </section>
        <section class="section tour-section" id="tour">
            <div class="container">
                ${heading(c.tour)}
                <div class="marquee" aria-hidden="true"><div class="marquee-track">${Array.from({ length: 2 }, () => c.tour.rows.map((row) => `<span>${row.city}</span><i></i>`).join("")).join("")}</div></div>
                <div class="tour-list reveal">${c.tour.rows.map((row, i) => `<article class="tour-row"><span class="room-number">0${i + 1}</span><h3>${row.city}</h3><div class="venue">${row.venue}<span>${row.note}</span></div><button class="status ${row.status === "sold out" ? "sold-out" : row.status}" data-show="${i}" ${row.status === "sold out" ? "disabled" : ""} aria-label="${row.status} — ${row.city}">${row.status === "tickets" ? icon("ticket") : ""}${row.status}</button></article>`).join("")}</div>
                <p class="caption tour-disclosure">${c.tour.disclosure}</p>
            </div>
        </section>
        <section class="section merch-section" id="merch">
            <div class="container">
                ${heading(c.merch)}
                <div class="merch-grid">${c.merch.items.map((item, i) => `<article class="merch-card reveal"><div class="merch-image"><img src="${item.image}" alt="${item.alt}" loading="lazy"><span class="item-number">MW / 0${i + 1}</span></div><div class="merch-info"><div class="merch-name"><h3>${item.name}</h3><span class="price">$${item.price}</span></div><p class="caption">${item.detail}</p><button class="secondary add-button" data-add="${item.slug}" aria-label="${c.merch.add}: ${item.name}">${icon("plus")}${c.merch.add}</button></div></article>`).join("")}</div>
                <p class="caption merch-caption">${c.merch.caption}</p>
            </div>
        </section>
        <section class="section press-section" id="press">
            <div class="container">
                ${heading(c.press)}
                <div class="press-grid">
                    <div class="press-assets reveal">${c.press.assets.map((asset, i) => `<button class="press-asset" data-press="${i}"><span class="asset-number">0${i + 1}</span><span><strong>${asset.title}</strong><small>${asset.detail}</small></span>${icon("download")}</button>`).join("")}<p class="caption">${c.press.caption}</p></div>
                    <div class="quotes reveal">${c.press.quotes.map(([quote, outlet]) => `<blockquote><p>“${quote}”</p><cite>${outlet}</cite></blockquote>`).join("")}</div>
                </div>
            </div>
        </section>
        <section class="join-section" id="join">
            <div class="join-image"><img src="${c.join.image}" alt="${c.join.alt}" loading="lazy"></div>
            <div class="join-content reveal"><p class="eyebrow">${c.join.eyebrow}</p><h2>${c.join.heading}</h2><p>${c.join.detail}</p>
                <form id="join-form" novalidate><label class="sr-only" for="email">${c.join.label}</label><div class="join-fields"><input id="email" name="email" type="email" autocomplete="email" maxlength="254" placeholder="${c.join.placeholder}" required aria-describedby="join-local join-error"><button class="primary" type="submit">${c.join.button}${icon("mail")}</button></div><p id="join-error" class="error" role="status"></p><p id="join-local" class="caption">${c.join.local}</p></form>
                <div id="join-success" hidden><div class="envelope-stamp">${icon("mail")}</div><p class="success-copy">${c.join.joined}</p><p class="caption">${c.join.successNote}</p><button class="text-button" id="forget-email">${c.join.reset}</button></div>
                <p id="storage-warning" class="error" role="status"></p>
            </div>
        </section>
    </main>
    <footer class="footer"><div class="container"><div class="footer-grid"><div><a class="wordmark" href="./index.html">${c.artist}</a><p>${c.footer.description}<br>${c.footer.release}</p></div><div><h3 class="eyebrow">${c.footer.write}</h3><p>${c.footer.email}<br><span class="caption">${c.footer.emailNote}</span></p></div><div><h3 class="eyebrow">${c.footer.around}</h3><nav aria-label="Footer navigation">${nav()}<a href="#join">${c.footer.join}</a></nav></div></div><div class="footer-bottom"><p>${c.footer.legal}<br><span>${c.footer.demo}</span></p><a href="${c.footer.creditUrl}" target="_blank" rel="noopener noreferrer">${c.footer.credit}</a></div></div></footer>
    <dialog id="bag-dialog" class="bag-dialog" aria-labelledby="bag-title"><div class="drawer-header"><div><p class="eyebrow">${c.bag.eyebrow}</p><h2 id="bag-title">${c.bag.title}</h2></div><button class="icon-button" data-close aria-label="${c.ui.close}">${icon("x")}</button></div><div id="bag-items"></div><div class="bag-summary"><p><span>${c.bag.total}</span><strong id="bag-total">$0.00</strong></p><p class="caption">${c.bag.caption}</p><button class="primary full" data-close>${c.bag.continue}</button></div></dialog>
    <dialog id="info-dialog" class="info-dialog" aria-labelledby="info-title"><button class="icon-button info-close" data-close aria-label="${c.ui.close}">${icon("x")}</button><p class="eyebrow" id="info-eyebrow"></p><h2 id="info-title"></h2><p id="info-detail"></p><p class="caption" id="info-copy"></p><button class="secondary" data-close>${c.ui.closeRoom}</button></dialog>
    <dialog id="menu-dialog" class="menu-dialog" aria-labelledby="menu-title"><div class="menu-top"><span class="wordmark">${c.artist}</span><button class="icon-button" data-close aria-label="${c.ui.close}">${icon("x")}</button></div><p class="eyebrow" id="menu-title">${c.ui.menu}</p><nav aria-label="Mobile navigation">${nav()}<a href="#join">${c.footer.join}</a></nav></dialog>
    <div class="toast" id="toast" role="status" aria-live="polite"></div>
`;

function save()
{
    try
    {
        localStorage.setItem(storageKey, JSON.stringify(state));
    }
    catch
    {
        storageAvailable = false;
    }
    $("#storage-warning").textContent = storageAvailable ? "" : c.ui.storageWarning;
}

function renderJoin()
{
    $("#join-form").hidden = state.joined;
    $("#join-success").hidden = !state.joined;
    $("#email").value = state.email;
    $("#storage-warning").textContent = storageAvailable ? "" : c.ui.storageWarning;
}

function renderBag()
{
    $("#bag-count").textContent = state.bag.length;
    $("#open-bag").setAttribute("aria-label", `${c.bag.count}, ${state.bag.length} items`);
    const items = c.merch.items.filter((item) => state.bag.includes(item.slug));
    $("#bag-items").innerHTML = items.length ? items.map((item) =>
    {
        const quantity = state.bag.filter((slug) => slug === item.slug).length;
        return `<article class="bag-item"><img src="${item.image}" alt=""><div><h3>${item.name}</h3><p class="price">${money(item.price * quantity)}</p><div class="quantity"><button class="icon-button" data-quantity="-1" data-slug="${item.slug}" aria-label="${c.ui.decrease} ${item.name}">${icon("minus")}</button><output aria-label="Quantity of ${item.name}">${quantity}</output><button class="icon-button" data-quantity="1" data-slug="${item.slug}" aria-label="${c.ui.increase} ${item.name}" ${state.bag.length >= 100 ? "disabled" : ""}>${icon("plus")}</button></div><button class="text-button" data-remove="${item.slug}">${c.bag.remove}<span class="sr-only"> ${item.name}</span></button></div></article>`;
    }).join("") : `<p class="empty-bag">${c.bag.empty}</p>`;
    $("#bag-total").textContent = money(state.bag.reduce((sum, slug) => sum + c.merch.items.find((item) => item.slug === slug).price, 0));
    $$("[data-add]").forEach((button) => { button.disabled = state.bag.length >= 100; });
}

let toastTimer;
function toast(message)
{
    $("#toast").textContent = message;
    $("#toast").classList.add("visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => $("#toast").classList.remove("visible"), 2600);
}

function openDialog(dialog)
{
    dialog.showModal();
    document.body.classList.add("dialog-open");
}

$$("dialog").forEach((dialog) =>
{
    dialog.addEventListener("close", () => document.body.classList.remove("dialog-open"));
    dialog.addEventListener("click", (event) =>
    {
        if (event.target !== dialog) return;
        const rect = dialog.getBoundingClientRect();
        if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
    });
});
$$("[data-close]").forEach((button) => button.addEventListener("click", () => button.closest("dialog").close()));
$("#open-bag").addEventListener("click", () => openDialog($("#bag-dialog")));
$("#open-menu").addEventListener("click", () => openDialog($("#menu-dialog")));
$$("#menu-dialog a").forEach((link) => link.addEventListener("click", () => $("#menu-dialog").close()));

$$("[data-add]").forEach((button) => button.addEventListener("click", () =>
{
    const item = c.merch.items.find((entry) => entry.slug === button.dataset.add);
    if (state.bag.length >= 100) return;
    state.bag.push(item.slug);
    save();
    renderBag();
    toast(`${item.name} ${c.ui.added}`);
    $("#bag-count").animate([{ transform: "scale(1)" }, { transform: "scale(1.3)" }, { transform: "scale(1)" }], { duration: reducedMotion.matches ? 0 : 360 });
    if (!reducedMotion.matches)
    {
        const from = button.getBoundingClientRect();
        const to = $("#open-bag").getBoundingClientRect();
        const flight = document.createElement("span");
        flight.className = "vinyl-flight";
        document.body.append(flight);
        const animation = flight.animate([{ left: `${from.left + from.width / 2}px`, top: `${from.top}px`, transform: "scale(1)", opacity: 1 }, { left: `${to.left}px`, top: `${to.top}px`, transform: "scale(.3)", opacity: 0 }], { duration: 600, easing: "ease-in-out" });
        animation.onfinish = () => flight.remove();
    }
}));

$("#bag-items").addEventListener("click", (event) =>
{
    const button = event.target.closest("button");
    if (!button) return;
    const slug = button.dataset.slug ?? button.dataset.remove;
    const action = button.dataset.remove ? "remove" : button.dataset.quantity;
    if (action === "remove") state.bag = state.bag.filter((entry) => entry !== slug);
    else if (action === "1" && state.bag.length < 100) state.bag.push(slug);
    else if (action === "-1") state.bag.splice(state.bag.indexOf(slug), 1);
    save();
    renderBag();
    const replacement = [...$("#bag-items").querySelectorAll("button")].find((entry) => entry.dataset.slug === slug && entry.dataset.quantity === action);
    (replacement ?? $("#bag-dialog [data-close]")).focus();
});

function showInfo(eyebrow, title, detail, copy)
{
    $("#info-eyebrow").textContent = eyebrow;
    $("#info-title").textContent = title;
    $("#info-detail").textContent = detail;
    $("#info-copy").textContent = copy;
    openDialog($("#info-dialog"));
}
$$("[data-show]").forEach((button) => button.addEventListener("click", () =>
{
    const row = c.tour.rows[Number(button.dataset.show)];
    showInfo(c.ui.showing, row.city, `${row.venue} · ${row.note}`, row.status === "invite" ? c.tour.invite : c.tour.modal);
}));
$$("[data-press]").forEach((button) => button.addEventListener("click", () =>
{
    const asset = c.press.assets[Number(button.dataset.press)];
    showInfo(c.ui.preview, asset.title, asset.detail, asset.text);
}));

$("#join-form").addEventListener("submit", (event) =>
{
    event.preventDefault();
    const input = $("#email");
    input.value = input.value.trim();
    if (!input.validity.valid)
    {
        $("#join-error").textContent = c.join.invalid;
        input.setAttribute("aria-invalid", "true");
        input.focus();
        if (!reducedMotion.matches) input.animate([{ transform: "translateX(0)" }, { transform: "translateX(-4px)" }, { transform: "translateX(4px)" }, { transform: "translateX(0)" }], { duration: 240 });
        return;
    }
    state.email = input.value;
    state.joined = true;
    save();
    renderJoin();
    $("#forget-email").focus();
});
$("#email").addEventListener("input", () =>
{
    $("#email").removeAttribute("aria-invalid");
    $("#join-error").textContent = "";
});
$("#forget-email").addEventListener("click", () =>
{
    state.email = "";
    state.joined = false;
    save();
    renderJoin();
    $("#email").focus();
});

const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
const formatTime = (time) => `0:${String(Math.floor(time)).padStart(2, "0")}`;
let frame;
let previousVolume = 65;
const bars = $$(".visualizer i");
const player = new SamplePlayer(c.music.audio, (status) =>
{
    document.body.classList.toggle("is-playing", status === "playing");
    $("#player-state").textContent = ({ loading: c.ui.loading, playing: c.ui.playing, paused: c.ui.paused, error: c.ui.ready })[status];
    $("#audio-error").textContent = status === "error" ? c.ui.audioError : "";
    $$("[data-play]").forEach((button) =>
    {
        button.setAttribute("aria-pressed", String(status === "playing"));
        button.setAttribute("aria-label", status === "playing" ? c.ui.pause : c.ui.play);
        button.disabled = status === "loading";
        if (button.classList.contains("play-circle")) button.innerHTML = icon(status === "playing" ? "pause" : "play");
    });
    cancelAnimationFrame(frame);
    if (status === "playing") updateFrame();
    else bars.forEach((bar) => { bar.style.height = ""; });
});

function updateTime()
{
    const time = player.time;
    $("#seek").value = time;
    $("#seek").style.setProperty("--fill", `${time / player.duration * 100}%`);
    $("#seek").setAttribute("aria-valuetext", `${formatTime(time)} of 0:12`);
    $("#elapsed").textContent = formatTime(time);
}

function updateFrame()
{
    updateTime();
    if (!reducedMotion.matches)
    {
        const levels = player.getLevels();
        bars.forEach((bar, i) => { bar.style.height = `${Math.max(7, levels[i] * 100)}%`; });
    }
    frame = requestAnimationFrame(updateFrame);
}

$$("[data-play]").forEach((button) => button.addEventListener("click", () =>
{
    player.toggle();
    if (button.classList.contains("hero-play")) $("#music").scrollIntoView({ behavior: reducedMotion.matches ? "instant" : "smooth" });
}));
$("#seek").addEventListener("input", (event) =>
{
    player.seek(Number(event.target.value));
    updateTime();
});
$("#player").addEventListener("keydown", (event) =>
{
    if (event.target !== $("#player")) return;
    if ([" ", "ArrowRight", "ArrowLeft", "Home", "End"].includes(event.key)) event.preventDefault();
    if (event.key === " ") player.toggle();
    if (event.key === "ArrowRight") player.seek(player.time + 1);
    if (event.key === "ArrowLeft") player.seek(player.time - 1);
    if (event.key === "Home") player.seek(0);
    if (event.key === "End") player.seek(player.duration - 0.01);
    updateTime();
});
function setVolume(value)
{
    player.setVolume(value / 100);
    $("#volume").value = value;
    $("#volume").style.setProperty("--fill", `${value}%`);
    $("#volume-value").textContent = `${value}%`;
    $("#mute").setAttribute("aria-label", value ? c.ui.mute : c.ui.unmute);
    $("#mute").setAttribute("aria-pressed", String(!value));
    $("#mute").style.opacity = value ? "1" : ".5";
}
$("#volume").addEventListener("input", (event) => setVolume(Number(event.target.value)));
$("#mute").addEventListener("click", () =>
{
    const current = Number($("#volume").value);
    if (current) previousVolume = current;
    setVolume(current ? 0 : previousVolume);
});
reducedMotion.addEventListener("change", () =>
{
    if (reducedMotion.matches) bars.forEach((bar) => { bar.style.height = ""; });
});
window.addEventListener("pagehide", () =>
{
    cancelAnimationFrame(frame);
    player.pause();
    player.context?.close();
});
const revealObserver = new IntersectionObserver((entries) =>
{
    entries.forEach((entry) =>
    {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("revealed");
        revealObserver.unobserve(entry.target);
    });
}, { threshold: 0.12 });
$$(".reveal").forEach((element, i) =>
{
    element.style.setProperty("--delay", `${i % 3 * 80}ms`);
    revealObserver.observe(element);
});
renderBag();
renderJoin();
setVolume(65);
