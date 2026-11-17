import { content as c } from "./content.js";
import { buildScene, buildHorizon } from "./scene.js";
import { startFlows } from "./flows.js";
import { startStory } from "./story.js";
import { startScenario } from "./scenario.js";
import { createIcons, icons } from "./icons.js";

const icon = (name) => `<i data-lucide="${name}" aria-hidden="true"></i>`;
const tag = () => `<span class="illustrative">${c.illustrative}</span>`;
const mark = `<svg class="mark" viewBox="0 0 32 32" aria-hidden="true"><path d="M8 17a8 8 0 0 1 14-6l-1-5m1 5-5-1" stroke="var(--lime)"/><path d="M24 15a8 8 0 0 1-14 6l1 5m-1-5 5 1" stroke="var(--orange)"/></svg>`;
const links = () => c.nav.map(([name, href]) => `<a href="${href}">${name}</a>`).join("");

document.querySelector("#app").innerHTML = `
    <header id="header"><a class="wordmark" href="#story">${mark}${c.brand}</a><nav aria-label="Main">${links()}</nav><a class="figure-chip" href="#sources">${icon("info")}<span class="figure-desktop">${c.figureChip}</span><span class="figure-mobile">${c.illustrative}</span></a></header>
    <main>
        <section id="story" aria-label="${c.hero.sceneTitle}">
            <div class="scene-sticky">
                <div id="scene"></div>
                <div class="scene-shade"></div>
                <aside id="gauge" aria-label="${c.hud}" hidden>
                    <p class="eyebrow">${c.hud}</p>
                    ${c.reservoirs.map((r, i) => `<div class="gauge-row" data-reservoir="${i}">${icon(r.icon)}<span>${r.name}<small>${r.display} · ${c.illustrative}</small></span><b style="--stock:${Math.log10(r.stock) / Math.log10(Math.max(...c.reservoirs.map((r) => r.stock))) * 100}%"></b></div>`).join("")}
                </aside>
                <div class="scene-legend">${c.hero.legend.map((name, i) => `<span class="legend-item" style="--dot:var(--${["lime", "cyan", "orange"][i]})">${name}</span>`).join("")}</div>
                <button id="motion-toggle" class="motion-toggle" aria-pressed="false">${c.hero.pause}</button>
            </div>
            <div class="steps">
                <div class="step hero" data-step="0">
                    <div class="hero-copy">
                        <p class="eyebrow">${c.hero.eyebrow}</p>
                        <h1>${c.hero.heading}</h1>
                        <p class="hero-body">${c.hero.body}</p>
                        <div class="hero-actions"><a class="button primary" href="#step-1">${c.hero.start}${icon("arrow-down")}</a><a class="button outline" href="#scenarios">${c.hero.jump}</a></div>
                        <div class="hero-chips">${c.hero.chips.map((text) => `<span>${text}</span>`).join("")}</div>
                    </div>
                    <span class="scroll-cue">${icon("arrow-down")}${c.hero.scroll}</span>
                </div>
                ${c.steps.map((s, i) => `
                    <article class="step" id="step-${i + 1}" data-step="${i + 1}">
                        <div class="step-panel">
                            <span class="step-index">${String(i + 1).padStart(2, "0")} / ${String(c.steps.length).padStart(2, "0")}</span>
                            <p class="eyebrow">${icon(s.icon)}${s.tag}</p><h2>${s.title}</h2><p>${s.body}</p>
                            ${s.counter ? `<div class="counter"><strong id="counter-${i + 1}">${s.from}</strong><span>${s.counter}</span></div>` : ""}
                            ${tag()}${s.button ? `<a class="button primary" href="#scenarios">${s.button}${icon("arrow-down")}</a>` : ""}
                        </div>
                    </article>`).join("")}
            </div>
        </section>
        <section id="ledger" class="ledger band">
            <div class="wrap ledger-grid"><div><p class="eyebrow">${c.ledger.eyebrow}</p><h2>${c.ledger.heading}</h2><p>${c.ledger.intro}</p><p class="unit-note">${c.ledger.unit}</p></div>
                <div class="ledger-rows">${c.ledger.rows.map((r) => `
                    <div class="ledger-row ${r.net ? "net" : ""}" style="--flow:var(--${r.color});--fill:${r.width}%;${r.dim ? "--opacity:.6" : ""}">
                        <div class="row-heading">${icon(r.icon)}<h3>${r.name}</h3><span>${r.direction}</span></div>
                        <div class="bar-track"><div class="bar ${r.double ? "double" : ""}"></div></div>
                        <p class="row-value">${r.value} ${tag()}</p>
                    </div>`).join("")}<p class="ledger-note">${c.ledger.note}</p></div>
            </div>
        </section>
        <section id="scenarios" class="lab band">
            <div class="wrap">
                <p class="eyebrow">${c.lab.eyebrow}</p><h2>${c.lab.heading}</h2><p class="section-intro">${c.lab.intro}</p>
                <div class="lab-grid">
                    <div class="chart-card"><div id="chart"></div><div class="chart-legend"><span>${c.lab.historical}</span><span>${c.lab.projected}</span></div><p class="print-legend">${c.lab.printLegend}</p></div>
                    <div class="readout-stack"><output id="warming" for="scenario">+2.5 <small>${c.lab.unit}</small></output><p>${c.lab.caption}</p><p id="scenario-description"></p><div id="horizon"></div></div>
                    <div class="slider-wrap">
                        <label class="sr-only" for="scenario">${c.lab.sliderLabel}</label>
                        <input id="scenario" type="range" min="0" max="100" step="1" value="50">
                        <div class="stop-labels">${c.lab.stops.map((s, i) => `<button data-stop="${i * 50}" aria-pressed="${i === 1}"><span class="stop-dot"></span>${s.name}<small>+${s.end.toFixed(1)} ${c.lab.unit} · ${c.illustrative}</small></button>`).join("")}</div>
                        <p class="keyboard-hint">${c.lab.keyboardHint}</p><p class="baseline">${c.lab.baseline}</p>
                    </div>
                </div>
            </div>
        </section>
        <section class="faq band wrap narrow"><h2>${c.faq.title}</h2>${c.faq.items.map(([q, a], i) => `<div class="faq-item"><h3><button id="faq-button-${i}" aria-expanded="false" aria-controls="faq-answer-${i}">${q}${icon("plus")}</button></h3><div class="faq-answer" id="faq-answer-${i}" role="region" aria-labelledby="faq-button-${i}" hidden><p>${a}</p></div></div>`).join("")}</section>
        <section class="teachers band wrap"><p class="eyebrow">${c.teachers.eyebrow}</p><h2>${c.teachers.title}</h2>
            <div class="teacher-grid">
                <article><span class="icon-tile lime">${icon("trees")}</span><h3>${c.teachers.walkthrough}</h3><ol>${c.teachers.minutes.map((v) => `<li>${v}</li>`).join("")}</ol></article>
                <article><span class="icon-tile cyan">${icon("info")}</span><h3>${c.teachers.discussion}</h3><ul>${c.teachers.questions.map((v) => `<li>${v}</li>`).join("")}</ul></article>
                <article><span class="icon-tile orange">${icon("printer")}</span><h3>${c.teachers.printTitle}</h3><p>${c.teachers.printBody}</p><button id="print" class="button outline">${icon("printer")}${c.teachers.printButton}</button></article>
            </div>
        </section>
        <section id="sources" class="sources band"><div class="wrap narrow"><p class="eyebrow">${c.sources.eyebrow}</p><h2>${c.sources.title}</h2><p>${c.sources.body}</p><ul class="source-notes">${c.sources.notes.map((n) => `<li>${icon("info")}${n}</li>`).join("")}</ul><div class="source-links">${c.sources.links.map(([label, url]) => `<a href="${url}" target="_blank" rel="noopener noreferrer">${label} ↗</a>`).join("")}</div><p class="credits">${c.sources.credits}</p><p class="disclosure">${c.sources.disclosure}</p><p class="correction">${c.sources.corrections}<small>${c.sources.correctionNote}</small></p></div></section>
    </main>
    <footer><div class="wrap"><div class="footer-top"><div><a class="wordmark" href="#story">${mark}${c.brand}</a><p>${c.footer.tagline}</p></div><nav aria-label="Footer">${links()}</nav></div><div class="footer-bottom"><span>${c.footer.copyright}</span><a href="${c.footer.creditUrl}" target="_blank" rel="noopener noreferrer">${c.footer.credit}</a></div></div></footer>`;

buildScene(document.querySelector("#scene"));
buildHorizon(document.querySelector("#horizon"));
createIcons({ icons, attrs: { width: 20, height: 20, "stroke-width": 1.75, "aria-hidden": "true" } });
const motionQuery = matchMedia("(prefers-reduced-motion: reduce)");
const flows = startFlows(document.querySelector("#scene-svg"), motionQuery);
startStory(flows, motionQuery);
startScenario(motionQuery);
document.querySelectorAll(".faq-item button").forEach((button) =>
{
    button.addEventListener("click", () =>
    {
        const expanded = button.getAttribute("aria-expanded") === "true";
        document.querySelectorAll(".faq-item button").forEach((other) =>
        {
            other.setAttribute("aria-expanded", "false");
            document.querySelector(`#${other.getAttribute("aria-controls")}`).hidden = true;
        });
        button.setAttribute("aria-expanded", String(!expanded));
        document.querySelector(`#${button.getAttribute("aria-controls")}`).hidden = expanded;
    });
});
document.querySelector("#print").addEventListener("click", () => window.print());
