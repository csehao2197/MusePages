import { content as c } from "./content.js";
import { FestivalScene } from "./scene.js";
import { loadWishes, saveWishes, paperTones } from "./storage.js";
import { icon } from "./icons.js";

const escape = (text) => String(text).replace(/[&<>"']/g, (char) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
const loaded = loadWishes();
let wishes = loaded.wishes;
let storageUnavailable = loaded.unavailable;
let state = "write";
let draft = "";
let foldedText = "";
let releaseTimer;
let foldTimer;
let foldReady = false;
let confirmedId = null;
let windValue = 1;
let paused = false;
let scene;

function lantern(tone = "cream", folding = false)
{
    const fill = { cream: "#f7eac8", honey: "#f6b85f", apricot: "#f5c59c" }[tone];
    return `<svg class="${folding ? "fold-preview" : "lantern"}" viewBox="0 0 160 160" aria-hidden="true">
        ${folding ? `<g class="flat-paper"><polygon points="80,28 132,80 80,132 28,80" fill="${fill}"/><path d="M54 54 106 106M106 54 54 106M80 28V132M28 80H132" stroke="#8a6848" stroke-opacity=".5" fill="none"/></g>` : ""}
        <g transform="translate(80 80)">
            <g class="${folding ? "corner" : ""}" data-panel="upper-left"><polygon points="-43,-50 0,-62 0,58 -34,49" fill="${fill}"/></g>
            <g class="${folding ? "corner" : ""}" data-panel="upper-right"><polygon points="0,-62 43,-50 34,49 0,58" fill="#f6b85f"/></g>
            <g class="${folding ? "side" : ""}" data-panel="left-side"><polygon points="-43,-50 -24,-57 -19,54 -34,49" fill="#d59654"/></g>
            <g class="${folding ? "side" : ""}" data-panel="right-side"><polygon points="24,-57 43,-50 34,49 19,54" fill="${fill}"/></g>
            <g class="${folding ? "corner glow" : ""}" data-panel="center-left"><polygon points="-24,-57 0,-62 0,58 -19,54" fill="#ffe6a3"/></g>
            <g class="${folding ? "corner glow" : ""}" data-panel="center-right"><polygon points="0,-62 24,-57 19,54 0,58" fill="#f7eac8"/></g>
            <g fill="none" stroke="#8a6848" stroke-opacity=".5" stroke-width="1.5">
                <path d="M-24-57-19 54M-9-60-6 57M9-60 6 57M24-57 19 54"/>
                <path d="M-43-50Q0-73 43-50"/>
            </g>
            <g class="${folding ? "base" : ""}"><ellipse cy="50" rx="34" ry="8" fill="#805a37"/><ellipse cy="50" rx="18" ry="3" fill="#ffe6a3"/></g>
        </g>
    </svg>`;
}

function announce(message)
{
    document.querySelector("#status").textContent = message;
}

document.title = c.title;
document.querySelector("#app").innerHTML = `
    <a class="sr-only skip-link" href="#composer">${escape(c.composer.title)}</a>
    <div class="shell">
        <header class="header">
            <a class="brand" href="#festival">${lantern()}<span>${escape(c.brand)}</span></a>
            <nav class="nav" aria-label="Main">
                <a class="desktop-link" href="#festival">${c.nav.festival}</a>
                <a href="#gallery">${c.nav.gallery}</a>
                <a class="outline desktop-link" href="#notes">${c.nav.how}</a>
            </nav>
        </header>
        <main>
            <section id="festival" class="stage" aria-labelledby="welcome-title">
                <div class="landscape"><canvas id="river" role="img"></canvas></div>
                <div class="welcome">
                    <p class="eyebrow">${escape(c.festival)} · ${escape(c.river)}</p>
                    <h1 id="welcome-title">${escape(c.headline)}</h1>
                    <p class="welcome-body">${escape(c.welcome)}</p>
                    <p class="theme-line desktop-theme">${escape(c.themeLine)}</p>
                </div>
                <p class="festival-pill"><span class="desktop-pill">${c.scene.pill}</span><span class="mobile-pill">${c.scene.mobilePill}</span></p>
                <div class="scene-controls">
                    <div class="motion-controls">
                        <div class="wind-group">
                            <label for="wind">${icon("Wind")}${c.scene.wind}</label>
                            <output for="wind" id="wind-label">${c.scene.winds[1]}</output>
                            <input id="wind" type="range" min="0" max="2" step="1" value="1" aria-valuetext="${c.scene.winds[1]}">
                        </div>
                        <button id="pause">${icon("Pause")}<span>${c.scene.pause}</span></button>
                    </div>
                    <div class="reset-wrap">
                        <button id="reset">${icon("RotateCcw")}${c.scene.reset}</button>
                        <span class="scene-caption">${c.scene.caption}</span>
                    </div>
                </div>
                <p class="theme-line mobile-theme" hidden>${escape(c.themeLine)}</p>
                <section id="composer" class="composer" aria-labelledby="composer-title">
                    <p class="eyebrow">${c.composer.eyebrow}</p>
                    <h2 id="composer-title">${c.composer.title}</h2>
                    <p class="privacy">${c.composer.privacy}</p>
                    <ol class="steps">${c.composer.steps.map((label, index) => `<li><button data-step="${index}" disabled><span>0${index + 1}</span>${label}</button></li>`).join("")}</ol>
                    <div id="composer-body"></div>
                    <p id="storage-error" class="error" ${storageUnavailable ? "" : "hidden"}>${c.composer.storageError}</p>
                    <p class="composer-foot">${icon("LockKeyhole")}${c.composer.helper}</p>
                </section>
            </section>
            <div class="inner">
                <section id="gallery" class="gallery" aria-labelledby="gallery-title">
                    <div class="section-heading">
                        <div><p class="eyebrow">${c.gallery.eyebrow}</p><h2 id="gallery-title">${c.gallery.title}</h2></div>
                        <span id="gallery-count" class="gallery-count"></span>
                    </div>
                    <p class="privacy">${c.gallery.privacy}</p>
                    <div id="gallery-grid" class="gallery-grid"></div>
                </section>
                <section id="notes" class="notes" aria-labelledby="notes-title">
                    <div>
                        <p class="eyebrow">${c.notes.eyebrow}</p>
                        <h2 id="notes-title">${c.notes.title}</h2>
                        <div class="private-note"><h3>${c.notes.privacyTitle}</h3><p>${c.notes.privacy}</p></div>
                        <p class="digital-note">${c.notes.digital}</p>
                    </div>
                    <div>${c.notes.steps.map((step, index) => `<div class="ritual-step"><span>0${index + 1}</span><div><h3>${step.title}</h3><p>${escape(step.text)}</p></div></div>`).join("")}</div>
                </section>
                <footer>
                    <a href="#festival" class="brand">${lantern()}${c.brand}</a>
                    <div><p>${c.footer.sentence}</p><p>${c.footer.privacy}</p></div>
                    <a href="${c.footer.creditUrl}" rel="noreferrer">${c.footer.credit}</a>
                </footer>
            </div>
        </main>
    </div>
    <p id="status" class="sr-only" role="status" aria-live="polite" aria-atomic="true"></p>`;

const mobileQuery = matchMedia("(max-width: 759px)");
function positionTheme()
{
    document.querySelector(".desktop-theme").hidden = mobileQuery.matches;
    document.querySelector(".mobile-theme").hidden = !mobileQuery.matches;
}
mobileQuery.addEventListener("change", positionTheme);
positionTheme();

function updateSummary()
{
    document.querySelector("#river").setAttribute("aria-label", c.scene.summary(c.scene.winds[windValue], wishes.length));
}

function persist()
{
    if (!saveWishes(wishes)) storageUnavailable = true;
    document.querySelector("#storage-error").hidden = !storageUnavailable;
}

function currentStep()
{
    return state === "write" ? 0 : state === "folded" ? 1 : 2;
}

function renderComposer(focusId)
{
    document.querySelector("#composer").classList.toggle("long-composer", state !== "write" && foldedText.length > 90);
    for (const button of document.querySelectorAll("[data-step]"))
    {
        const index = Number(button.dataset.step);
        const active = currentStep() === index;
        if (active) button.setAttribute("aria-current", "step");
        else button.removeAttribute("aria-current");
        button.disabled = !((state === "folded" && index === 0) || active);
    }
    const panel = document.querySelector("#composer-body");
    if (state === "write")
    {
        panel.innerHTML = `
            <div class="field-heading"><label for="wish">${c.composer.label}</label><span id="char-count">${draft.length}/120</span></div>
            <textarea id="wish" maxlength="120" minlength="3" aria-describedby="wish-helper" placeholder="${c.composer.placeholder}">${escape(draft)}</textarea>
            <p class="helper" id="wish-helper">${c.composer.helper}</p>
            <p class="prompt-label">${c.composer.promptLabel}</p>
            <div class="prompt-buttons">${c.prompts.map((prompt, index) => `<button data-prompt="${index}">${prompt.label}</button>`).join("")}</div>
            <button id="fold" class="primary" ${draft.trim().length < 3 ? "disabled" : ""}>${c.composer.fold}${icon("ArrowUpRight")}</button>`;
        document.querySelector("#wish").addEventListener("input", (event) =>
        {
            draft = event.target.value;
            document.querySelector("#char-count").textContent = `${draft.length}/120`;
            document.querySelector("#fold").disabled = draft.trim().length < 3;
        });
    }
    else if (state === "folded")
    {
        panel.innerHTML = `${lantern(paperTones[wishes.length % 3], true)}
            <p class="wish-excerpt ${foldedText.length > 90 ? "long-wish" : ""}">${escape(foldedText)}</p>
            <p class="error" id="capacity" ${wishes.length >= 24 ? "" : "hidden"}>${c.composer.full}</p>
            <button id="release" class="primary" ${!foldReady || wishes.length >= 24 ? "disabled" : ""}>${c.composer.release}${icon("ArrowUp")}</button>
            <button id="back" class="secondary">${icon("PenLine")}${c.composer.back}</button>`;
    }
    else if (state === "releasing")
    {
        panel.innerHTML = `${lantern(paperTones[(wishes.length - 1) % 3])}<p class="state-note">${c.composer.releasing}</p><p class="wish-excerpt ${foldedText.length > 90 ? "long-wish" : ""}">${escape(foldedText)}</p><button class="primary" disabled>${c.composer.releasing}</button>`;
    }
    else
    {
        panel.innerHTML = `<span class="success-icon">${icon("Check")}</span>
            <h3 class="success-heading" tabindex="-1" id="success">${c.composer.success}</h3>
            <p class="state-note">${c.composer.saved}</p>
            <p class="wish-excerpt ${foldedText.length > 90 ? "long-wish" : ""}">${escape(foldedText)}</p>
            <a class="primary" href="#gallery">${c.composer.view}${icon("ArrowDown")}</a>
            <button id="another" class="secondary">${c.composer.another}</button>`;
    }
    if (focusId) document.getElementById(focusId)?.focus({ preventScroll: true });
}

function renderGallery(focusIndex)
{
    document.querySelector("#gallery-count").textContent = c.gallery.count(wishes.length);
    const grid = document.querySelector("#gallery-grid");
    grid.innerHTML = wishes.length ? wishes.map((wish) => `
        <article class="wish-card" data-wish-id="${wish.id}">
            <div class="card-content">${lantern(wish.paperTone)}<div>
                <p class="card-number">${c.gallery.lantern} ${String(wish.ordinal).padStart(2, "0")}</p>
                <p class="card-wish">${escape(wish.text)}</p>
            </div></div>
            <div class="card-actions">${confirmedId === wish.id ?
                `<p class="confirm-text">${c.gallery.confirm}</p><button data-keep="${wish.id}">${c.gallery.keep}</button><button data-confirm="${wish.id}">${icon("Trash2")}${c.gallery.remove}</button>` :
                `<button data-again="${wish.id}">${icon("Send")}${c.gallery.again}</button><button data-remove="${wish.id}">${icon("Trash2")}${c.gallery.remove}</button>`}
            </div>
        </article>`).join("") :
        `<div class="empty-state">${lantern()}<div><h3>${c.gallery.empty}</h3><p>${c.gallery.emptyBody}</p></div><a id="empty-write" class="text-link" href="#composer">${c.gallery.write}${icon("ArrowUpRight")}</a></div>`;
    if (focusIndex !== undefined)
    {
        const actions = grid.querySelectorAll("[data-again]");
        (actions[Math.min(focusIndex, actions.length - 1)] || document.querySelector("#empty-write"))?.focus({ preventScroll: true });
    }
    updateSummary();
}

function backToWish()
{
    if (state !== "folded") return;
    clearTimeout(foldTimer);
    state = "write";
    renderComposer("wish");
    announce(c.composer.draftFeedback);
}

function completeRelease()
{
    clearTimeout(releaseTimer);
    if (state !== "releasing") return;
    state = "released";
    renderComposer("success");
    announce(storageUnavailable ? `${c.composer.releaseFeedback} ${c.composer.storageError}` : c.composer.releaseFeedback);
}

document.querySelector("#composer").addEventListener("click", (event) =>
{
    const button = event.target.closest("button");
    if (!button || button.disabled) return;
    if (button.dataset.prompt !== undefined && state === "write")
    {
        draft = c.prompts[Number(button.dataset.prompt)].text;
        renderComposer("wish");
        announce(c.composer.suggestionFeedback);
    }
    else if (button.id === "fold" && state === "write" && draft.trim().length >= 3 && draft.trim().length <= 120)
    {
        foldedText = draft.trim();
        state = "folded";
        foldReady = scene.reduced;
        renderComposer("back");
        announce(c.composer.foldFeedback);
        foldTimer = setTimeout(() =>
        {
            foldReady = true;
            const release = document.querySelector("#release");
            if (release) release.disabled = wishes.length >= 24;
        }, scene.reduced ? 0 : 1100);
    }
    else if (button.id === "back" || button.dataset.step === "0")
    {
        backToWish();
    }
    else if (button.id === "release" && state === "folded" && wishes.length < 24 && foldReady)
    {
        state = "releasing";
        const wish =
        {
            id: crypto.randomUUID(),
            text: foldedText,
            ordinal: wishes.length + 1,
            paperTone: paperTones[wishes.length % 3]
        };
        wishes.push(wish);
        persist();
        scene.release(wish);
        renderGallery();
        renderComposer();
        announce(c.composer.releasing);
        if (scene.reduced) completeRelease();
        else releaseTimer = setTimeout(completeRelease, 1400);
    }
    else if (button.id === "another" && state === "released")
    {
        state = "write";
        draft = "";
        foldedText = "";
        renderComposer("wish");
        announce(c.composer.nextFeedback);
    }
});

document.querySelector("#gallery-grid").addEventListener("click", (event) =>
{
    const button = event.target.closest("button");
    if (!button) return;
    if (button.dataset.again)
    {
        const wish = wishes.find((item) => item.id === button.dataset.again);
        if (wish) scene.release(wish);
        announce(c.gallery.relaunched);
    }
    else if (button.dataset.remove)
    {
        confirmedId = button.dataset.remove;
        renderGallery();
        document.querySelector(`[data-keep="${confirmedId}"]`).focus({ preventScroll: true });
    }
    else if (button.dataset.keep)
    {
        const id = confirmedId;
        confirmedId = null;
        renderGallery();
        document.querySelector(`[data-remove="${id}"]`).focus({ preventScroll: true });
    }
    else if (button.dataset.confirm)
    {
        const id = button.dataset.confirm;
        const index = wishes.findIndex((wish) => wish.id === id);
        if (index < 0) return;
        wishes = wishes.filter((wish) => wish.id !== id).map((wish, ordinal) => ({ ...wish, ordinal: ordinal + 1 }));
        confirmedId = null;
        scene.remove(id);
        persist();
        renderGallery(index);
        if (state === "folded")
        {
            document.querySelector("#capacity").hidden = wishes.length < 24;
            document.querySelector("#release").disabled = !foldReady || wishes.length >= 24;
        }
        announce(c.gallery.removed);
    }
});

document.querySelector("#wind").addEventListener("input", (event) =>
{
    windValue = Number(event.target.value);
    document.querySelector("#wind-label").textContent = c.scene.winds[windValue];
    event.target.setAttribute("aria-valuetext", c.scene.winds[windValue]);
    scene.setWind(windValue);
    updateSummary();
});
document.querySelector("#pause").addEventListener("click", (event) =>
{
    paused = !paused;
    scene.setPaused(paused);
    const button = event.currentTarget;
    button.innerHTML = `${icon(paused ? "Play" : "Pause")}<span>${paused ? c.scene.resume : c.scene.pause}</span>`;
    button.setAttribute("aria-pressed", String(paused));
});
document.querySelector("#reset").addEventListener("click", () =>
{
    windValue = 1;
    document.querySelector("#wind").value = "1";
    document.querySelector("#wind").setAttribute("aria-valuetext", c.scene.winds[1]);
    document.querySelector("#wind-label").textContent = c.scene.winds[1];
    scene.reset();
    updateSummary();
    announce(c.scene.resetFeedback);
});

scene = new FestivalScene(document.querySelector("#river"), (reduced) =>
{
    if (reduced && state === "releasing") completeRelease();
    if (reduced && state === "folded")
    {
        foldReady = true;
        const release = document.querySelector("#release");
        if (release) release.disabled = wishes.length >= 24;
    }
});
renderComposer();
renderGallery();

function destroy()
{
    clearTimeout(releaseTimer);
    clearTimeout(foldTimer);
    scene.destroy();
    mobileQuery.removeEventListener("change", positionTheme);
}
window.addEventListener("pagehide", (event) =>
{
    if (!event.persisted) destroy();
});
