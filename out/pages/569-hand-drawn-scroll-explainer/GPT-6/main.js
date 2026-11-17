import { VARS, copy, scenes } from "./content.js";
import { glyph, narrator } from "./glyphs.js";

const app = document.querySelector("#app");
const arrow = '<svg class="arrow-icon" viewBox="0 0 40 20" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M1 11 Q18 8 36 10 M28 2 L37 10 L28 18"/></svg>';
const sceneMarkup = scenes.map((scene) => `
    <section class="scene" id="scene-${scene.id}" aria-labelledby="title-${scene.id}" style="--accent:${scene.accent}" data-scene="${scene.id}">
        <div class="scene-inner">
            <div class="scene-copy">
                <p class="eyebrow">${copy.chapter} <span>0${scene.id} / 06</span></p>
                <span class="part">${scene.part}</span>
                <h2 id="title-${scene.id}">${scene.title}</h2>
                <p>${scene.note}</p>
                <a class="text-link" href="${scene.id === 6 ? "#recap" : `#scene-${scene.id + 1}`}">${scene.id === 6 ? copy.recapLink : copy.next} ${arrow}</a>
            </div>
            <div class="scene-paper paper">
                <span class="tape" aria-hidden="true"></span>
                <span class="page-number" aria-hidden="true">0${scene.id}</span>
                <div class="scene-doodle">${glyph(scene.glyph)}<svg class="scribble" viewBox="0 0 300 100" aria-hidden="true"><path d="M25 42 Q141 19 272 37 M32 59 Q165 40 266 55 M40 76 Q172 57 258 73"/></svg></div>
                ${scene.labels.map((label) => `<span class="label ${label.corner}">${label.text}<svg viewBox="0 0 100 60" fill="none" aria-hidden="true"><path d="M5 8 Q27 57 88 38 M74 30 L90 38 L76 48"/></svg></span>`).join("")}
                <div class="narration">${narrator(scene.pose)}<p class="bubble" aria-label="${scene.bubble}"><span class="bubble-text" aria-hidden="true" data-text="${scene.bubble}">${scene.bubble}</span></p></div>
            </div>
        </div>
    </section>`).join("");

app.innerHTML = `
    <a class="skip" href="#scene-1">${copy.skip}</a>
    <header class="topbar">
        <a class="brand" href="#top" aria-label="${VARS.BRAND}"><span class="brand-mark" aria-hidden="true">s<span>✳</span></span>${VARS.BRAND}<span class="brand-dot">.</span></a>
        <p>${copy.headerNote}</p>
        <a class="header-link" href="#recap">${copy.recapLink} ${arrow}</a>
    </header>
    <main id="top">
        <section class="intro" aria-labelledby="intro-title">
            <div class="intro-copy">
                <p class="eyebrow">${copy.lesson}<span>${copy.reading}</span></p>
                <h1 id="intro-title">${copy.title[0]}<br><span class="highlight">${copy.title[1]}</span></h1>
                <p class="intro-body">${copy.intro}</p>
                <p class="hand intro-end">${copy.introEnd}</p>
                <a class="primary" href="#scene-1">${copy.start} ${arrow}</a>
                <p class="small-note">${copy.heroFoot}</p>
            </div>
            <div class="hero-illustration">
                <div class="hero-paper paper" role="img" aria-label="${copy.diagramLabel}">
                    <span class="tape tape-left" aria-hidden="true"></span><span class="tape tape-right" aria-hidden="true"></span>
                    <p class="paper-heading">${copy.heroCard}</p>
                    <div class="hero-sun">${glyph("sun")}</div>
                    <div class="hero-leaf">${glyph("leaf")}</div>
                    <svg class="hero-lines" viewBox="0 0 440 450" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M125 136 Q158 134 181 164 M171 151 L183 166 L165 163 M290 210 Q362 189 363 141 M351 154 L364 139 L371 158 M156 336 Q155 292 181 274 M164 279 L182 272 L178 291 M296 321 Q320 302 329 275 M318 283 L330 273 L336 288"/><path d="M226 295 Q216 350 233 395 M228 365 Q192 343 174 363 Q184 391 230 381 M229 344 Q264 318 278 339 Q271 361 230 362"/></svg>
                    <span class="hero-label sun-label">${copy.heroSun}</span>
                    <span class="hero-label leaf-label">${copy.heroLeaf}</span>
                    <span class="hero-label food-label">${copy.heroFood}</span>
                    <span class="molecule m1">${copy.heroSupplies[2]}</span><span class="molecule m2">${copy.heroSupplies[3]}</span>
                    <span class="water-drop" aria-hidden="true"></span>
                    <span class="leaf-fill" aria-hidden="true"></span>
                </div>
                <div class="hero-pip">${narrator()}<p class="bubble">${copy.heroBubble.replace("\n", "<br>")}</p></div>
                <span class="hand hero-margin">${VARS.TOPIC}<svg viewBox="0 0 150 15" fill="none" aria-hidden="true"><path d="M3 9 Q69 0 146 8 M18 14 L132 12"/></svg></span>
            </div>
            <div class="scroll-note"><span class="scroll-icon" aria-hidden="true">↓</span>${copy.scroll}</div>
        </section>
        <nav class="trail" aria-label="${copy.trail}">${scenes.map((scene) => `<a href="#scene-${scene.id}" aria-label="${copy.jump} ${scene.part}" data-trail="${scene.id}"><span>0${scene.id}</span><b>${scene.part}</b></a>`).join("")}<a href="#recap" aria-label="${copy.recapLink}" data-trail="7"><span>✓</span><b>${copy.recapLink}</b></a></nav>
        ${sceneMarkup}
        <section id="recap" class="recap" aria-labelledby="recap-title">
            <p class="eyebrow">${copy.recapEyebrow}</p>
            <h2 id="recap-title">${copy.recapTitle}</h2>
            <p class="recap-note">${copy.recapNote}</p>
            <div class="flow paper">
                <p class="flow-power">${glyph("sun")}<span>${copy.formulaPower}</span>${glyph("leaf")}</p>
                <div class="flow-line">
                    <div class="flow-group"><p class="eyebrow">${copy.formulaIn}</p><div>${[2, 3].map((index) => `<div class="flow-item">${glyph(scenes[index].glyph)}<span>${scenes[index].part}</span></div>`).join('<span class="plus">+</span>')}</div></div>
                    <span class="flow-arrow" aria-hidden="true">${arrow}</span>
                    <div class="flow-group"><p class="eyebrow">${copy.formulaOut}</p><div>${[4, 5].map((index) => `<div class="flow-item">${glyph(scenes[index].glyph)}<span>${scenes[index].part}</span></div>`).join('<span class="plus">+</span>')}</div></div>
                </div>
                <p class="formula">${copy.formula}</p>
            </div>
            <section class="lab" aria-labelledby="lab-title">
                <div><p class="eyebrow">${copy.experimentLabel}</p><h3 id="lab-title">${copy.experimentTitle}</h3><p>${copy.experimentNote}</p></div>
                <div class="lab-controls">
                    <div class="supply-buttons">${copy.supplies.map((supply, index) => `<button type="button" class="supply" aria-pressed="true" data-supply="${index}">${glyph(["sun", "water", "cloud"][index])}<span>${supply}</span><b>${copy.supplyOn}</b></button>`).join("")}</div>
                    <div class="lab-result" role="status" aria-live="polite"></div>
                    <button class="text-link restore" type="button">${copy.restore} ${arrow}</button>
                </div>
            </section>
            <aside class="cheat-sheet"><h3>${copy.sheetTitle}</h3><dl>${copy.sheet.map(([title, text]) => `<div><dt>${title}</dt><dd>${text}</dd></div>`).join("")}</dl></aside>
            <div class="recap-actions"><a class="primary replay" href="#top">${copy.replay} ${arrow}</a><button type="button" class="print">${copy.print} ${glyph("book")}</button><p>${copy.printNote}</p></div>
        </section>
    </main>
    <footer><a class="brand" href="#top">${VARS.BRAND}<span class="brand-dot">.</span></a><p>${copy.footer}</p><div><a href="${copy.creditHref}">${copy.credit}</a><a href="${copy.licenseHref}">${copy.license}</a></div></footer>`;

const reduce = matchMedia("(prefers-reduced-motion: reduce)");
const tracked = [...document.querySelectorAll(".scene")].map((element) =>
{
    const strokes = [...element.querySelectorAll("svg path")].map((path) =>
    {
        const length = path.getTotalLength();
        path.style.strokeDasharray = `${length}`;
        return { path, length };
    });
    const bubble = element.querySelector(".bubble-text");
    const text = bubble.dataset.text;
    bubble.innerHTML = [...text].map((character) => `<span>${character}</span>`).join("");
    return { element, strokes, letters: [...bubble.children] };
});

let scheduled = false;
function renderProgress()
{
    scheduled = false;
    let active = 0;
    const height = innerHeight;
    for (const { element, strokes, letters } of tracked)
    {
        const box = element.getBoundingClientRect();
        const progress = reduce.matches ? 1 : Math.max(0, Math.min(1, (height * 0.94 - box.top) / (height * 0.8)));
        element.dataset.progress = progress.toFixed(3);
        strokes.forEach(({ path, length }, index) =>
        {
            const local = Math.max(0, Math.min(1, progress * 1.65 - index / strokes.length * 0.65));
            path.style.strokeDashoffset = `${length * (1 - local)}`;
        });
        letters.forEach((letter, index) =>
        {
            letter.style.opacity = progress >= 0.18 + index / letters.length * 0.76 ? "1" : "0";
        });
        if (box.top < height * 0.55)
        {
            active = Number(element.dataset.scene);
        }
    }
    if (document.querySelector("#recap").getBoundingClientRect().top < height * 0.55)
    {
        active = 7;
    }
    document.querySelectorAll("[data-trail]").forEach((item) =>
    {
        if (Number(item.dataset.trail) === active)
        {
            item.setAttribute("aria-current", "step");
        }
        else
        {
            item.removeAttribute("aria-current");
        }
    });
}

function requestProgress()
{
    if (!scheduled)
    {
        scheduled = true;
        requestAnimationFrame(renderProgress);
    }
}

addEventListener("scroll", requestProgress, { passive: true });
let resizeTimer;
addEventListener("resize", () =>
{
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(requestProgress, 200);
});
reduce.addEventListener("change", requestProgress);
document.fonts.ready.then(requestProgress);
renderProgress();

const supplies = [true, true, true];
function updateLab()
{
    const missing = copy.supplies.filter((_, index) => !supplies[index]);
    document.querySelectorAll(".supply").forEach((button, index) =>
    {
        button.setAttribute("aria-pressed", String(supplies[index]));
        button.querySelector("b").textContent = supplies[index] ? copy.supplyOn : copy.supplyOff;
    });
    const result = document.querySelector(".lab-result");
    result.dataset.active = String(!missing.length);
    result.innerHTML = `<h4>${missing.length ? copy.blockedTitle : copy.readyTitle}</h4><p>${missing.length ? missing.map((name) => copy.blocked[name]).join(" ") : copy.ready}</p><strong>${missing.length ? copy.outputPaused : copy.outputActive}</strong>`;
}
document.querySelectorAll(".supply").forEach((button, index) =>
{
    button.addEventListener("click", () =>
    {
        supplies[index] = !supplies[index];
        updateLab();
    });
});
document.querySelector(".restore").addEventListener("click", () =>
{
    supplies.fill(true);
    updateLab();
});
document.querySelector(".print").addEventListener("click", () => window.print());
updateLab();
