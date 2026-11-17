import { content as C } from "./content.js";
import { timeModel } from "./lighting.js";
import Menu from "./vendor/icons/menu.js";
import X from "./vendor/icons/x.js";
import ArrowDown from "./vendor/icons/arrow-down.js";
import ChevronLeft from "./vendor/icons/chevron-left.js";
import ChevronRight from "./vendor/icons/chevron-right.js";
import RotateCcw from "./vendor/icons/rotate-ccw.js";
import Sun from "./vendor/icons/sun.js";
import BookOpen from "./vendor/icons/book-open.js";

const icons = { Menu, X, ArrowDown, ChevronLeft, ChevronRight, RotateCcw, Sun, BookOpen };
const number = i => String(i).padStart(2, "0");
const nav = () => C.navigation.map(([label, id]) => `<a href="./index.html#${id}">${label}</a>`).join("");
const icon = name => `<span data-icon="${name}" aria-hidden="true"></span>`;
const range = id => `<label for="${id}">${C.labels.time}</label><input id="${id}" class="time-range" type="range" min="360" max="1200" step="15" value="990"><div class="range-ends"><span>06:00</span><span>20:00</span></div>`;

function fallbackSVG()
{
    return `<svg viewBox="0 0 1200 900" preserveAspectRatio="xMidYMid slice" role="img" aria-label="${C.labels.renderer}">
        <rect width="1200" height="900" fill="#24211b"/>
        <path d="M0 900L477 492H723L1200 900" fill="#6a5e4c"/>
        <path d="M0 0L477 128V492L0 900M1200 0L723 128V492L1200 900" fill="#92816a" opacity=".8"/>
        <g id="fallback-vault" stroke="#c4b399" stroke-width="5" fill="none">
            <path d="M-50 760V270Q-50 8 600-110Q1250 8 1250 270V760M130 674V277Q130 88 600 7Q1070 88 1070 277V674M292 598V275Q292 141 600 100Q908 141 908 275V598M400 546V275Q400 198 600 164Q800 198 800 275V546M477 492V271Q477 224 600 203Q723 224 723 271V492"/>
            <path d="M-50 270L600 203L1250 270M130 277L600 203L1070 277M292 275L600 203L908 275"/>
        </g>
        <g id="fallback-piers" stroke="#bcab91" stroke-width="18" fill="none"><path d="M130 277V674M1070 277V674M292 275V598M908 275V598M400 275V546M800 275V546M477 271V492M723 271V492"/></g>
        <g id="fallback-glass" fill="#d9a44a" stroke="#24211b" stroke-width="3"><path d="M173 302V201Q197 162 221 201V286Z"/><path d="M979 286V201Q1003 162 1027 201V302Z"/><path d="M326 310V245Q342 216 358 245V300Z"/><path d="M842 300V245Q858 216 874 245V310Z"/></g>
        <g id="fallback-apse" fill="#4c8078" stroke="#c4b399" stroke-width="3"><circle cx="600" cy="350" r="57"/><path d="M600 293V407M543 350H657M560 310L640 390M560 390L640 310" fill="none"/></g>
        <g id="fallback-floor" opacity=".5"><path d="M920 578L564 790L736 822L999 600" fill="#d9a44a"/><path d="M886 589L517 713L560 748L929 612" fill="#a83b4b"/><path d="M746 535L514 621L544 650L789 550" fill="#3d628e"/></g>
        <g stroke="#b8aa93" opacity=".3"><path d="M0 812H1200M137 710H1063M260 625H940M600 492V900M520 492L315 900M680 492L885 900" fill="none"/></g>
    </svg>`;
}

export function mountDOM(state)
{
    document.title = C.title;
    document.querySelector("#app").innerHTML = `
        <a class="skip-link" href="./index.html#notes">${C.labels.notes}</a>
        <header>
            <a class="brand" href="./index.html#tour"><span class="arch-mark" aria-hidden="true"></span>${C.brand}</a>
            <span class="header-study">${C.labels.mode}</span>
            <nav aria-label="${C.labels.navLabel}">${nav()}</nav>
            <button class="menu-button icon-button" aria-label="${C.labels.menu}" aria-expanded="false" aria-controls="mobile-menu">${icon("Menu")}${icon("X")}</button>
        </header>
        <nav id="mobile-menu" aria-label="${C.labels.navLabel}" hidden>${nav()}</nav>
        <main>
            <section id="tour" aria-label="${C.labels.renderer}">
                <div class="scene">
                    <canvas id="nave" tabindex="0" aria-label="${C.labels.keys}"></canvas>
                    <div class="fallback" hidden>${fallbackSVG()}<p class="fallback-message">${C.labels.fallback}</p></div>
                    <div class="readability"></div>
                    <div class="scene-index"><span>${C.labels.tourEyebrow}</span><span class="stop-readout">00 / 05</span></div>
                    <article class="hero" data-caption="0">
                        <p class="eyebrow">${C.hero.eyebrow}</p>
                        <h1 id="stop-heading-0" tabindex="-1">${C.hero.title}</h1>
                        <p class="hero-body">${C.hero.body}</p>
                        <div class="actions"><button class="primary" data-go="1">${C.primaryCTA}${icon("ArrowDown")}</button><a class="secondary" href="./index.html#notes">${icon("BookOpen")}${C.labels.notes}</a></div>
                        <div class="facts">${C.hero.facts.map(fact => `<span>${fact}</span>`).join("")}</div>
                        <p class="audience">${C.labels.intro}</p>
                    </article>
                    ${C.stops.slice(1).map((stop, i) => `
                        <article class="caption" data-caption="${i + 1}" hidden>
                            <div class="caption-copy"><p class="eyebrow">${number(i + 1)} / ${stop.name}</p>
                            <h2 id="stop-heading-${i + 1}" tabindex="-1">${stop.title}</h2><p>${stop.body}</p></div>
                            <div class="caption-navigation">
                                <span class="mono">${number(i + 2)} / 06 · ${C.labels.compactLook}</span>
                                <div><button class="icon-button" data-go="${i}" aria-label="${C.labels.previous} — ${C.stops[i].name}">${icon("ChevronLeft")}</button>
                                <button class="icon-button" data-reset aria-label="${C.labels.reset}">${icon("RotateCcw")}</button>
                                <button class="icon-button" data-go="${Math.min(5, i + 2)}" ${i === 4 ? "disabled" : ""} aria-label="${C.labels.next}">${icon("ChevronRight")}</button></div>
                            </div>
                        </article>`).join("")}
                    <div class="tour-controls">
                        <div class="stop-dots" aria-label="Architectural stops">${C.stops.map((stop, i) => `<button data-go="${i}" aria-label="${C.labels.step} ${number(i)} — ${stop.name}" aria-current="${i === 0 ? "step" : "false"}"><span></span></button>`).join("")}</div>
                        <div class="light-console">
                            <div class="console-top"><span>${icon("Sun")}${C.labels.time}</span><output class="time-output" for="tour-time"></output></div>
                            <div class="console-range">${range("tour-time")}</div>
                        </div>
                    </div>
                    <div class="look-hint">${C.labels.look}</div>
                </div>
            </section>
            <section id="light" class="editorial">
                <p class="eyebrow">${C.light.eyebrow}</p>
                <h2>${C.light.title}</h2>
                <div class="light-grid">
                    <figure class="section-diagram">${C.light.svg}<figcaption>${C.light.caption}</figcaption></figure>
                    <div class="study-controls">
                        <p class="lead">${C.light.lead}</p>
                        <div class="presets">${C.presets.map(preset => `<button data-time="${preset.time}" aria-pressed="false"><span class="mono">${formatTime(preset.time)}</span><span>${preset.label}</span></button>`).join("")}</div>
                        <div class="study-range">${range("study-time")}</div>
                        <div class="readouts"><div><span>${C.labels.studyTime}</span><output id="study-time-value">16:30</output></div><div><span>${C.labels.elevation}</span><output id="elevation">41°</output></div><div><span>${C.labels.length}</span><output id="length">21 m</output></div></div>
                        <p class="model-label">${C.labels.illustrative}</p>
                        <button class="return-light secondary" data-go="4">${C.labels.seeLight}${icon("ArrowDown")}</button>
                    </div>
                </div>
            </section>
            <section id="notes" class="editorial notes-grid">
                <div class="notes-heading"><p class="eyebrow">${C.notes.eyebrow}</p><h2>${C.notes.title}</h2><p>${C.notes.intro}</p></div>
                <div class="note-rows">${C.stops.map((stop, i) => `<article class="note-row"><span class="note-number">${number(i + 1)}</span><div class="note-term"><h3>${stop.noteName || stop.name}</h3><span>${stop.dimension}</span></div><p>${stop.note || stop.body}</p><button class="note-return" data-go="${i}">${C.labels.view}${icon("ChevronRight")}</button></article>`).join("")}<p class="disclaimer">${C.notes.disclaimer}</p></div>
            </section>
            <section class="closing editorial"><div><p class="eyebrow">${C.closing.eyebrow}</p><h2>${C.closing.title}</h2></div><div><p>${C.closing.body}</p><div class="actions"><button class="primary" id="restart">${C.labels.restart}${icon("RotateCcw")}</button><a class="secondary" href="./index.html#light">${C.labels.explore}</a></div></div></section>
        </main>
        <footer><div>${C.footer.brand}</div><div>${C.footer.note}</div><div class="footer-links">${nav()}<a href="${C.footer.creditURL}">${C.footer.credit}</a><a href="${C.footer.licenseURL}">${C.footer.license}</a></div></footer>`;
    for (const element of document.querySelectorAll("[data-icon]"))
    {
        const [tag, attrs, nodes] = icons[element.dataset.icon];
        const svg = document.createElementNS("http://www.w3.org/2000/svg", tag);
        for (const [key, value] of Object.entries(attrs))
        {
            svg.setAttribute(key, value);
        }
        for (const [nodeTag, nodeAttrs] of nodes)
        {
            const child = document.createElementNS("http://www.w3.org/2000/svg", nodeTag);
            for (const [key, value] of Object.entries(nodeAttrs))
            {
                child.setAttribute(key, value);
            }
            svg.append(child);
        }
        element.append(svg);
    }
    syncTime(state);
}

export function formatTime(minutes)
{
    return `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;
}

export function syncTime(state)
{
    const model = timeModel(state.timeMinutes);
    const time = formatTime(state.timeMinutes);
    const period = state.timeMinutes < 690 ? C.labels.morning : state.timeMinutes < 840 ? C.labels.midday : state.timeMinutes < 1080 ? C.labels.afternoon : C.labels.evening;
    for (const input of document.querySelectorAll(".time-range"))
    {
        input.value = state.timeMinutes;
        input.setAttribute("aria-valuetext", time);
    }
    document.querySelector(".time-output").textContent = `${time} / ${period}`;
    document.querySelector("#study-time-value").textContent = time;
    document.querySelector("#elevation").textContent = `${Math.round(model.elevation)}°`;
    document.querySelector("#length").textContent = `${Math.round(model.length)} m`;
    for (const button of document.querySelectorAll("[data-time]"))
    {
        button.setAttribute("aria-pressed", String(Number(button.dataset.time) === state.timeMinutes));
    }
    const startX = model.u < .5 ? 77 : 563;
    const windowX = model.u < .5 ? 165 : 475;
    const floorX = model.u < .5 ? Math.min(495, 165 + model.length * 10) : Math.max(145, 475 - model.length * 10);
    document.querySelector("#diagram-ray").setAttribute("d", `M${startX} ${260 - model.elevation * 2.2}L${windowX} 229L${floorX} 389`);
    document.querySelector("#diagram-projection").setAttribute("points", `${windowX},391 ${floorX},391 ${floorX + 40},379 ${windowX + 40},379`);
    document.querySelector("#diagram-projection").style.opacity = model.projectionOpacity;
    document.querySelector("#fallback-floor").setAttribute("transform", `translate(${(model.u - .5) * 110} 0) scale(${.65 + model.length / 40} 1)`);
    document.querySelector("#fallback-floor").style.opacity = model.projectionOpacity;
}

export function syncStop(state)
{
    for (const caption of document.querySelectorAll("[data-caption]"))
    {
        caption.hidden = Number(caption.dataset.caption) !== state.activeStop;
    }
    for (const dot of document.querySelectorAll(".stop-dots button"))
    {
        dot.setAttribute("aria-current", Number(dot.dataset.go) === state.activeStop ? "step" : "false");
    }
    document.querySelector(".stop-readout").textContent = `${number(state.activeStop)} / 05`;
    const highlights = ["fallback-floor", "fallback-piers", "fallback-vault", "fallback-vault", "fallback-glass", "fallback-apse"];
    for (const id of new Set(highlights))
    {
        document.getElementById(id).classList.toggle("highlight", id === highlights[state.activeStop]);
    }
}
