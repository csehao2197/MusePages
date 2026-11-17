import { content as c } from "./content.js";

const icon = (name, className = "") => `<svg class="icon ${className}" aria-hidden="true"><use href="${c.icons}#${name}"></use></svg>`;
const lines = (text) => text.replaceAll("\n", "<br>");
const app = document.querySelector("#app");

app.innerHTML = `
    <a class="skip" href="#story">${c.navigation.skip}</a>
    <header class="header">
        <a class="studio-mark" href="#home" aria-label="${c.navigation.home}">
            ${icon("flame")}<span>${c.navigation.wordmark}<span class="studio-small">${c.navigation.wordmarkSubline}</span></span>
        </a>
        <button class="menu-toggle" aria-label="${c.navigation.menu}" aria-expanded="false" aria-controls="navigation">${icon("menu")}</button>
        <nav id="navigation" aria-label="${c.navigation.label}">
            ${c.navigation.items.map((item) => `<a href="${item.href}">${item.label}</a>`).join("")}
        </nav>
        <a class="nav-wishlist" href="${c.navigation.wishlistHref}">${icon("heart")}<span>${c.navigation.wishlist}</span></a>
    </header>
    <main>
        <section class="hero" id="home">
            <img class="hero-painting" src="${c.hero.image}" alt="${c.hero.alt}" fetchpriority="high">
            <div class="hero-shade"></div>
            <div class="motes" aria-hidden="true"></div>
            <div class="hero-copy">
                <p class="eyebrow ornament">${c.hero.eyebrow}</p>
                <h1>${c.game}</h1>
                <p class="hero-line">${c.hero.line}</p>
                <p class="hero-description">${c.hero.description}</p>
                <div class="hero-actions">
                    <a class="button button-parchment" href="${c.hero.enterHref}">${c.hero.enter}${icon("arrow-down")}</a>
                    <a class="button button-ghost" href="${c.hero.trailerHref}">${icon("play")}${c.hero.trailer}</a>
                </div>
                <p class="hero-credit">${c.hero.credit}</p>
            </div>
            <div class="hero-bottom">
                <span>${c.hero.footnote}</span>
                <a href="${c.hero.scrollHref}"><span>${c.hero.scroll}</span>${icon("arrow-down")}</a>
                <span>${c.hero.genre}</span>
            </div>
        </section>
        <section class="story section-shell" id="story">
            <div class="section-intro reveal">
                <div class="small-flame">${icon("flame")}</div>
                <p class="eyebrow">${c.story.eyebrow}</p>
                <h2>${lines(c.story.title)}</h2>
                <p class="section-description">${c.story.body}</p>
            </div>
            <div class="beats">
                ${c.story.beats.map((beat, index) => `
                    <article class="beat ${index % 2 ? "reverse" : ""} reveal">
                        <div class="scene" data-parallax>
                            <img src="${beat.image}" alt="${beat.alt}" loading="lazy">
                            <span class="scene-number" aria-hidden="true">${beat.number}</span>
                        </div>
                        <div class="beat-copy">
                            <p class="eyebrow"><span class="beat-number">${beat.number}</span>${beat.eyebrow}</p>
                            <h3>${lines(beat.title)}</h3>
                            <p>${beat.body}</p>
                            <div class="beat-note">${icon(beat.icon)}<span>${beat.note}</span></div>
                        </div>
                    </article>
                `).join("")}
            </div>
        </section>
        <section class="trailer-section section-shell" id="trailer">
            <div class="section-intro reveal">
                <p class="eyebrow">${c.trailer.eyebrow}</p>
                <h2>${c.trailer.title}</h2>
            </div>
            <div class="trailer-poster reveal">
                <img src="${c.trailer.image}" alt="${c.trailer.alt}" loading="lazy">
                <div class="poster-shade"></div>
                <span class="poster-title" aria-hidden="true">${c.game}</span>
                <button class="play-button" aria-label="${c.trailer.button}">${icon("play")}</button>
                <span class="poster-caption">${c.trailer.caption}</span>
            </div>
            <p class="trailer-disclosure">${c.trailer.subline}</p>
        </section>
        <section class="world-section" id="world">
            <div class="section-intro section-shell reveal">
                <p class="eyebrow">${c.map.eyebrow}</p>
                <h2>${c.map.title}</h2>
                <p class="section-description">${c.map.body}</p>
            </div>
            <div class="map-layout section-shell reveal">
                <div class="map">
                    <img src="${c.map.image}" alt="${c.map.alt}" loading="lazy">
                    <div class="map-chips" role="group" aria-label="${c.map.label}">
                        ${c.map.locations.map((location, index) => `<button class="map-chip ${index === 0 ? "active" : ""}" data-location="${index}" style="--x:${location.x}%;--y:${location.y}%" aria-pressed="${index === 0}" aria-controls="location-detail"><span class="map-dot"></span><span>${location.name}</span></button>`).join("")}
                    </div>
                    <span class="map-north" aria-hidden="true">${c.map.north}</span>
                    <span class="map-note">${c.map.marker}</span>
                </div>
                <div id="location-detail" class="location-detail" role="region" aria-label="${c.map.detailLabel}" aria-live="polite">
                    <span class="location-index"></span>
                    <p class="eyebrow location-tag"></p>
                    <h3 class="location-name"></h3>
                    <p class="location-text"></p>
                    <p class="location-hint"></p>
                </div>
            </div>
        </section>
        <section class="release-section section-shell reveal" id="release">
            <div class="release-line"></div>
            <p class="eyebrow">${c.release.eyebrow}</p>
            <p class="coming">${c.release.prefix}</p>
            <h2>${c.window}</h2>
            <p class="release-studio">${c.release.studioLine}</p>
            <p class="release-platforms">${c.release.platforms}</p>
            <div class="stores">${c.release.stores.map((store) => `<a class="store-button" href="${store.href}">${icon(store.icon)}${store.label}</a>`).join("")}</div>
            <p class="store-caption">${c.release.storeCaption}</p>
            <div class="release-line"></div>
        </section>
        <section class="wishlist-section" id="wishlist">
            <div class="wishlist-glow" aria-hidden="true"></div>
            <div class="section-shell wishlist-inner reveal">
                <div class="small-flame">${icon("flame")}</div>
                <p class="eyebrow">${c.wishlist.eyebrow}</p>
                <h2>${lines(c.wishlist.title)}</h2>
                <p>${c.wishlist.body}</p>
                <button class="button button-ember wishlist-toggle" aria-pressed="false">${icon("heart")}<span>${c.wishlist.button}</span></button>
                <p class="wishlist-status" role="status">${c.wishlist.idle}</p>
                <form id="newsletter" novalidate>
                    <div class="email-row">
                        <label class="sr-only" for="email">${c.wishlist.emailLabel}</label>
                        <input id="email" name="email" type="email" autocomplete="email" placeholder="${c.wishlist.placeholder}" required aria-describedby="form-disclosure form-status">
                        <button class="button button-parchment" type="submit">${c.wishlist.submit}${icon("arrow-right")}</button>
                    </div>
                    <label class="consent"><input type="checkbox" id="consent" required><span>${c.wishlist.consent}</span></label>
                    <p id="form-disclosure">${c.wishlist.disclosure}</p>
                    <p id="form-status" role="status"></p>
                    <button class="reset-form" type="button" hidden>${c.wishlist.reset}</button>
                </form>
            </div>
        </section>
    </main>
    <footer class="footer section-shell">
        <div class="footer-top"><a class="footer-game" href="#home">${c.game}</a><p>${c.footer.note}</p><a class="back-top" href="${c.footer.backHref}" aria-label="${c.footer.back}">${icon("arrow-up")}</a></div>
        <div class="footer-bottom"><p>${c.footer.fiction}</p><div><a href="${c.footer.creditHref}" target="_blank" rel="noopener noreferrer">${c.footer.credit}</a><a href="${c.footer.licenseHref}" target="_blank" rel="noopener noreferrer">${c.footer.license}</a></div></div>
    </footer>
`;

const media = window.matchMedia("(prefers-reduced-motion: reduce)");
const finePointer = window.matchMedia("(pointer: fine)");
const motes =
[
    [8, 88, 12, 0], [17, 74, 10, -5], [25, 96, 14, -2],
    [33, 83, 9, -6], [41, 90, 13, -3], [48, 71, 11, -7],
    [57, 98, 8, -1], [64, 82, 12, -6], [73, 94, 10, -4],
    [81, 69, 14, -8], [88, 87, 9, -2], [94, 96, 13, -5]
];
document.querySelector(".motes").innerHTML = motes.map(([x, y, duration, delay]) => `<i style="left:${x}%;top:${y}%;--duration:${duration}s;--delay:${delay}s"></i>`).join("");

const menu = document.querySelector(".menu-toggle");
const nav = document.querySelector("#navigation");
function closeMenu()
{
    menu.setAttribute("aria-expanded", "false");
    nav.classList.remove("open");
}
menu.addEventListener("click", () =>
{
    const expanded = menu.getAttribute("aria-expanded") !== "true";
    menu.setAttribute("aria-expanded", String(expanded));
    nav.classList.toggle("open", expanded);
});
nav.addEventListener("click", (event) =>
{
    if (event.target.closest("a")) closeMenu();
});
document.addEventListener("keydown", (event) =>
{
    if (event.key === "Escape" && menu.getAttribute("aria-expanded") === "true")
    {
        closeMenu();
        menu.focus();
    }
});

const observer = new IntersectionObserver((entries) =>
{
    entries.forEach((entry) =>
    {
        if (entry.isIntersecting)
        {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });
document.querySelectorAll(".reveal").forEach((element, index) =>
{
    element.style.setProperty("--stagger", `${index % 3 * 110}ms`);
    observer.observe(element);
});

const scenes = [...document.querySelectorAll("[data-parallax]")].map((element) =>
{
    const state = { element, x: 0, y: 0, targetX: 0, targetY: 0 };
    element.addEventListener("pointermove", (event) =>
    {
        if (!finePointer.matches || media.matches) return;
        const bounds = element.getBoundingClientRect();
        state.targetX = ((event.clientX - bounds.left) / bounds.width - 0.5) * 5;
        state.targetY = ((event.clientY - bounds.top) / bounds.height - 0.5) * 5;
    });
    element.addEventListener("pointerleave", () =>
    {
        state.targetX = 0;
        state.targetY = 0;
    });
    return state;
});
let animation;
function animateScenes()
{
    for (const scene of scenes)
    {
        const bounds = scene.element.getBoundingClientRect();
        const progress = Math.max(0, Math.min(1, (innerHeight - bounds.top) / (innerHeight + bounds.height)));
        scene.x += (scene.targetX - scene.x) * 0.07;
        scene.y += (scene.targetY - scene.y) * 0.07;
        scene.element.style.setProperty("--px", `${finePointer.matches ? scene.x : 0}%`);
        scene.element.style.setProperty("--py", `${(finePointer.matches ? scene.y : 0) + (progress - 0.5) * 8}%`);
    }
    animation = requestAnimationFrame(animateScenes);
}
function setMotion()
{
    cancelAnimationFrame(animation);
    if (!media.matches) animateScenes();
    else for (const scene of scenes)
    {
        scene.element.style.setProperty("--px", "0%");
        scene.element.style.setProperty("--py", "0%");
    }
}
media.addEventListener("change", setMotion);
setMotion();

document.querySelector(".play-button").addEventListener("click", (event) =>
{
    const button = event.currentTarget;
    button.classList.remove("nudged");
    void button.offsetWidth;
    button.classList.add("nudged");
});

const locationButtons = [...document.querySelectorAll(".map-chip")];
function selectLocation(index)
{
    const place = c.map.locations[index];
    document.querySelector(".location-index").textContent = `0${index + 1} / 03`;
    document.querySelector(".location-tag").textContent = place.tag;
    document.querySelector(".location-name").textContent = place.name;
    document.querySelector(".location-text").textContent = place.text;
    document.querySelector(".location-hint").textContent = place.detail;
    locationButtons.forEach((button, buttonIndex) =>
    {
        button.classList.toggle("active", buttonIndex === index);
        button.setAttribute("aria-pressed", String(buttonIndex === index));
    });
}
locationButtons.forEach((button, index) =>
{
    button.addEventListener("click", () => selectLocation(index));
    button.addEventListener("keydown", (event) =>
    {
        let next;
        if (["ArrowRight", "ArrowDown"].includes(event.key)) next = (index + 1) % locationButtons.length;
        if (["ArrowLeft", "ArrowUp"].includes(event.key)) next = (index - 1 + locationButtons.length) % locationButtons.length;
        if (event.key === "Home") next = 0;
        if (event.key === "End") next = locationButtons.length - 1;
        if (next !== undefined)
        {
            event.preventDefault();
            selectLocation(next);
            locationButtons[next].focus();
        }
    });
});
selectLocation(0);

let wishlisted = false;
let persistent = true;
try
{
    wishlisted = localStorage.getItem("emberveil-wishlist") === "saved";
}
catch
{
    persistent = false;
}
const wishlistButton = document.querySelector(".wishlist-toggle");
const wishlistStatus = document.querySelector(".wishlist-status");
function renderWishlist(message)
{
    wishlistButton.setAttribute("aria-pressed", String(wishlisted));
    wishlistButton.querySelector("span").textContent = wishlisted ? c.wishlist.savedButton : c.wishlist.button;
    wishlistStatus.textContent = message || (wishlisted ? c.wishlist.saved : c.wishlist.idle);
}
renderWishlist();
wishlistButton.addEventListener("click", () =>
{
    wishlisted = !wishlisted;
    try
    {
        if (wishlisted) localStorage.setItem("emberveil-wishlist", "saved");
        else localStorage.removeItem("emberveil-wishlist");
    }
    catch
    {
        persistent = false;
    }
    renderWishlist(wishlisted ? (persistent ? c.wishlist.saved : c.wishlist.unavailable) : c.wishlist.removed);
});

const form = document.querySelector("#newsletter");
const email = document.querySelector("#email");
const consent = document.querySelector("#consent");
const formStatus = document.querySelector("#form-status");
const reset = document.querySelector(".reset-form");
form.addEventListener("submit", (event) =>
{
    event.preventDefault();
    email.removeAttribute("aria-invalid");
    consent.removeAttribute("aria-invalid");
    if (!email.validity.valid)
    {
        formStatus.textContent = c.wishlist.invalid;
        email.setAttribute("aria-invalid", "true");
        email.focus();
        return;
    }
    if (!consent.checked)
    {
        formStatus.textContent = c.wishlist.consentRequired;
        consent.setAttribute("aria-invalid", "true");
        consent.focus();
        return;
    }
    formStatus.textContent = c.wishlist.success;
    email.value = "";
    email.disabled = true;
    consent.disabled = true;
    form.querySelector('[type="submit"]').disabled = true;
    reset.hidden = false;
    reset.focus();
});
reset.addEventListener("click", () =>
{
    form.reset();
    email.disabled = false;
    consent.disabled = false;
    form.querySelector('[type="submit"]').disabled = false;
    formStatus.textContent = "";
    reset.hidden = true;
    email.focus();
});
