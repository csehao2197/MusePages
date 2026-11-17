import { content as c } from "./content.js";
import { mountHero, mountPressure } from "./figures/pressure.js";
import { mountPhaseLab } from "./figures/phaseLab.js";
import { earcupSvg, updateEarcup } from "./figures/earcup.js";
import { bandsSvg, mountBands } from "./figures/bands.js";
import { mountScrolly } from "./scrolly.js";
import { quizMarkup, mountQuiz } from "./quiz.js";

function legend(items)
{
    return `<div class="legend">${items.map((item) => `<span><i aria-hidden="true"></i>${item}</span>`).join("")}</div>`;
}

function chapterHead(index, id, title, intro)
{
    return `<div class="chapter-head"><div><p class="chapter-number">${c.chapters[index]}</p><h2 id="${id}">${title}</h2></div><p class="lede">${intro}</p></div>`;
}

function steps(items)
{
    return `<div class="scroll-steps">${items.map((step, i) => `<article class="step" data-active="${i === 0}"><p class="micro">0${i + 1}</p><h3>${step.title}</h3><p>${step.text}</p></article>`).join("")}</div>`;
}

function stepControls(items, label)
{
    return `<div class="figure-controls" role="group" aria-label="${label}">${items.map((step, i) => `<button type="button" data-select-step="${i}" aria-pressed="${i === 0}">${step.label}</button>`).join("")}</div>`;
}

document.getElementById("masthead").innerHTML = `<a class="skip" href="#chapter-1">${c.skip}</a><div class="wrap">
    <div class="masthead-left"><a class="brand" href="#hero">${c.brand}</a><p class="micro issue">${c.issue}</p></div>
    <nav aria-label="${c.brand}"><a href="#chapter-1">${c.navigation[0]}</a><a href="#chapter-2">${c.navigation[1]}</a><a href="#quiz">${c.navigation[2]}</a></nav>
</div>`;

document.getElementById("hero").innerHTML = `<div class="wrap">
    <div class="hero-grid"><div>
        <p class="eyebrow">${c.hero.eyebrow}</p><h1 id="hero-title">${c.hero.title}</h1>
        <p class="hero-dek">${c.hero.dek}</p><p class="byline">${c.hero.byline}</p><p class="caption reading">${c.hero.reading}</p>
        <a class="hero-link" href="#chapter-1">${c.hero.start}<span aria-hidden="true">${c.hero.arrow}</span></a>
    </div>
    <figure class="hero-art"><span class="corner" aria-hidden="true">∑</span><p class="figure-number">${c.hero.figure}</p>
        <h3>${c.hero.figureTitle}</h3><canvas id="hero-canvas" role="img" aria-label="${c.hero.caption}"></canvas>
        ${legend(c.hero.legend)}<figcaption class="caption">${c.hero.caption}</figcaption>
    </figure></div>
    <div class="story-strip"><span>${c.hero.note}</span><a href="#chapter-2">${c.hero.experiment} →</a></div>
</div>`;

document.getElementById("chapter-1").innerHTML = `<div class="wrap chapter">
    ${chapterHead(0, "pressure-title", c.pressure.title, c.pressure.intro)}
    <div class="scrolly"><figure class="sticky-figure" id="pressure-figure" data-step="0">
        <p class="figure-number">${c.pressure.figure}</p><canvas id="pressure-canvas" role="img" aria-label="${c.pressure.canvasLabel}"></canvas>
        ${stepControls(c.pressure.steps, c.pressure.controlsLabel)}<figcaption class="caption" id="pressure-caption">${c.pressure.steps[0].caption}</figcaption>
        <p class="caption">${c.pressure.footer}</p></figure>${steps(c.pressure.steps)}
    </div>
</div>`;

document.getElementById("chapter-2").innerHTML = `<div class="wrap chapter">
    ${chapterHead(1, "phase-title", c.phase.title, c.phase.intro)}
    <div class="phase-panel" id="phase-panel" data-state="partial">
        <div class="phase-top"><p class="figure-number">${c.phase.figure}</p>${legend(c.phase.legend)}</div>
        <canvas id="phase-canvas" role="img" aria-label="${c.phase.canvasLabel}"></canvas>
        <div class="lab-bottom"><div>
            <label class="slider-label" for="phase-slider">${c.phase.slider}<output id="phase-value" for="phase-slider">90°</output></label>
            <input id="phase-slider" type="range" min="0" max="360" step="1" value="90" aria-describedby="phase-learn phase-feedback">
            <div class="range-labels"><span>0°<br>${c.phase.endpoints[0]}</span><span>180°<br>${c.phase.endpoints[1]}</span><span>360°<br>${c.phase.endpoints[2]}</span></div>
            <div class="presets">${c.phase.presets.map((preset) => `<button type="button" data-phase="${preset.phase}" aria-pressed="false">${preset.label}</button>`).join("")}</div>
            <p id="phase-feedback" aria-live="polite"></p>
        </div><div class="readout"><p class="micro">${c.phase.level}</p><strong id="phase-level"></strong><p class="level-reference">${c.phase.reference}</p><p class="caption" id="remaining-amplitude"></p></div></div>
    </div><div class="model-note"><p class="caption" id="phase-learn">${c.phase.learn}</p><p class="caption">${c.phase.model}</p></div>
</div>`;

document.getElementById("chapter-3").innerHTML = `<div class="wrap chapter">
    ${chapterHead(2, "earcup-title", c.earcup.title, c.earcup.intro)}
    <div class="scrolly"><figure class="sticky-figure" id="earcup-figure" data-step="0"><p class="figure-number">${c.earcup.figure}</p>
        ${earcupSvg()}${stepControls(c.earcup.steps, c.earcup.controls)}<figcaption class="caption">${c.earcup.caption}</figcaption>
    </figure>${steps(c.earcup.steps)}</div><p class="earcup-note">${c.earcup.note}</p>
</div>`;

document.getElementById("chapter-4").innerHTML = `<div class="wrap chapter">
    ${chapterHead(3, "limits-title", c.limits.title, c.limits.intro)}
    <div class="bands-panel"><div class="phase-top"><p class="figure-number">${c.limits.figure}</p>${legend(c.limits.legend)}</div>
        ${bandsSvg()}<div class="figure-controls" role="group" aria-label="${c.limits.controls}">${c.limits.bands.map((band, i) => `<button type="button" data-select-band="${i}" aria-pressed="false">${band.hz.toLocaleString("en-US")} ${c.limits.unit}</button>`).join("")}</div>
        <div class="band-feedback"><span class="micro">${c.limits.reading}</span><p id="band-explanation" aria-live="polite"></p><p class="band-stats" id="band-stats"></p></div>
        <p class="caption">${c.limits.caption}</p>
    </div><p class="limits-note">${c.limits.note}</p>
</div>`;

document.getElementById("quiz").innerHTML = `<div class="wrap">
    <div class="quiz-head"><div><p class="eyebrow">${c.quiz.eyebrow}</p><h2 id="quiz-title">${c.quiz.title}</h2><p>${c.quiz.intro}</p></div><output id="quiz-score" class="score" aria-live="polite"></output></div>
    <div class="questions">${quizMarkup()}</div><div class="quiz-tail"><p id="quiz-completion" aria-live="polite"></p><button type="button" id="quiz-reset">${c.quiz.reset}</button></div>
</div>`;

document.getElementById("footer").innerHTML = `<div class="wrap footer-grid"><div><a class="brand" href="#hero">${c.brand}</a><p>${c.footer.description}</p><p>${c.footer.closing}</p></div>
    <div class="footer-links"><a href="#hero">${c.footer.top}</a><a href="${c.footer.creditUrl}">${c.footer.credit}</a><a href="${c.footer.licenseUrl}">${c.footer.license}</a></div>
</div>`;

const owned = [];
const disconnect = [];
owned.push(mountHero(document.getElementById("hero-canvas")));
const pressureFigure = document.getElementById("pressure-figure");
const pressureDrawing = mountPressure(document.getElementById("pressure-canvas"), pressureFigure);
owned.push(pressureDrawing);
disconnect.push(mountScrolly(document.getElementById("chapter-1"), (index) =>
{
    document.getElementById("pressure-caption").textContent = c.pressure.steps[index].caption;
    pressureDrawing.redraw();
}));
owned.push(mountPhaseLab(document.getElementById("phase-canvas"), document.getElementById("phase-panel")));
const earcup = document.getElementById("chapter-3");
disconnect.push(mountScrolly(earcup, (index) => updateEarcup(earcup, index)));
disconnect.push(mountBands(document.getElementById("chapter-4")));
mountQuiz(document.getElementById("quiz"));
window.addEventListener("pagehide", () =>
{
    owned.forEach((drawing) => drawing.dispose());
    disconnect.forEach((stop) => stop());
}, { once: true });
