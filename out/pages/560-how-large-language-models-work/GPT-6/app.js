import { content as c } from "./content.js";
import { mulberry32, applyTemperature, sample } from "./sampler.js";

const star = '<svg viewBox="0 0 32 32" fill="none" aria-hidden="true"><path d="M16 2v28M2 16h28M6 6l20 20M6 26 26 6" stroke="currentColor" stroke-width="2"/></svg>';
const icons = [
    '<path d="M4 5h5v14H4zM15 5h5v14h-5z"/>',
    '<circle cx="7" cy="7" r="2"/><circle cx="17" cy="17" r="2"/><path d="M9 8l6 7M7 11v9M12 7h8"/>',
    '<path d="M3 19Q12 0 21 19M6 19Q12 9 18 19M9 19h6"/>',
    '<path d="M5 20v-6M12 20V4M19 20V9"/>',
    '<rect x="4" y="4" width="16" height="16" rx="3"/><path d="M8 8h.1M16 8h.1M12 12h.1M8 16h.1M16 16h.1"/>'
];
let activeStep = 0;
let selectedToken = 13;
let temperature = 1;
let randomGenerator = mulberry32(c.seed);
let draw = 0;
let chosen = null;
let randomValue = null;
try
{
    document.documentElement.dataset.theme = localStorage.getItem("theme") || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
}
catch
{
    document.documentElement.dataset.theme = "light";
}

document.querySelector("#app").innerHTML = `
    <a class="skip" href="#journey">${c.start}</a>
    <header class="header wrap"><a class="brand" href="#top">${star}${c.brand}</a><nav aria-label="${c.mainNavigation}"><a href="#journey">${c.nav[0]}</a><a href="#notes">${c.nav[1]}</a><button id="theme" class="theme" aria-label="${c.themeLabel}" aria-pressed="${document.documentElement.dataset.theme === "dark"}">◐</button></nav></header>
    <main id="top">
        <section class="hero wrap">
            <div class="hero-copy"><p class="eyebrow">${c.kicker}</p><h1>${c.headline[0]}<br>${c.headline[1]}<br><em>${c.headline[2]}</em></h1><p class="intro">${c.intro}</p><a class="primary" href="#journey">${c.start}<span aria-hidden="true">↓</span></a><p class="read-time">${c.meta}</p></div>
            <div class="hero-art"><div class="art-corner">${c.figure} <span>${c.figureTitle}</span></div><div class="orbit orbit-one"></div><div class="orbit orbit-two"></div><span class="orbit-dot dot-one"></span><span class="orbit-dot dot-two"></span><span class="art-cross">+</span><div class="sentence-paper"><span class="eyebrow">${c.heroLabel}</span><p>${c.sentence} <span class="empty-word">…</span></p><div class="paper-bottom"><span>${c.inputLabel}</span><span>${c.tokenCountLabel}</span></div></div><svg class="connector" viewBox="0 0 400 180" aria-hidden="true"><path d="M100 0C100 90 300 20 300 140M100 0C100 90 170 50 170 170M100 0C100 90 60 60 60 135" fill="none" stroke="currentColor" stroke-dasharray="3 5"/></svg><div class="possibilities">${c.heroCandidates.map((candidate) => `<span class="candidate ${candidate.style}">${candidate.word} <b>${candidate.probability}</b></span>`).join("")}</div><p class="art-caption">${c.heroAside}</p><div class="art-baseline"><span class="tiny-dot"></span>${c.heroFoot}</div></div>
        </section>
        <div class="pipeline wrap">${c.path.map((label, index) => `<span><b>0${index + 1}</b>${label}</span>${index < 4 ? '<i aria-hidden="true">→</i>' : ""}`).join("")}</div>
        <section class="journey wrap" id="journey"><div class="section-heading"><p class="eyebrow">${c.sectionKicker}</p><h2>${c.sectionTitle}</h2><p>${c.sectionIntro}</p></div>
            <div class="scrolly"><div class="step-cards">${c.steps.map((step, index) => `<article class="step-card" id="step-${index}" data-step="${index}"><span class="step-number">0${index + 1} / 08</span><p class="eyebrow">${step.label}</p><h3>${step.title}</h3><p>${step.body}</p><blockquote><span>${c.ui.analogy}</span>${step.analogy}</blockquote><p class="detail">${step.detail}</p></article>`).join("")}</div>
            <aside class="stage"><div class="stage-header"><span>${c.stage}</span><span id="step-counter">01 / 08</span></div><div class="stage-input"><span class="eyebrow">${c.ui.input}</span><p>${c.sentence} <mark id="ending">…</mark></p></div><div id="diagram" aria-live="polite"></div><div id="controls" hidden><label for="temperature">${c.ui.temperature} <output id="temperature-value">1.0</output></label><input id="temperature" type="range" min="0.2" max="2" step="0.1" value="1"><div class="range-ends"><span>${c.ui.focused}</span><span>${c.ui.varied}</span></div><div class="roll-row"><button id="roll" class="primary">${c.ui.roll} <span aria-hidden="true">↻</span></button><button id="reset" class="text-button">${c.ui.reset}</button></div><p id="draw-info" class="detail">Seed 42 · ${c.ui.sum}</p></div><div class="stage-bottom"><button id="previous" aria-label="${c.ui.previous}">←</button><div class="step-dots">${c.steps.map((step, index) => `<button data-go="${index}" aria-label="${index + 1}. ${step.label}" ${index === 0 ? 'aria-current="step"' : ""}></button>`).join("")}</div><button id="next" aria-label="${c.ui.next}">→</button></div><p class="stage-note">${c.stageNote}</p></aside></div>
        </section>
        <section class="honesty wrap"><div>${star}<h3>${c.disclaimer}</h3></div><p>${c.disclaimerBody}</p></section>
        <section class="recap wrap"><p class="eyebrow">${c.recapKicker}</p><h2>${c.recapTitle}</h2><div class="recap-strip">${c.path.map((name, index) => `<article><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true">${icons[index]}</svg><h3>${name}</h3><p>${c.recap[index]}</p></article>`).join("")}</div></section>
        <section class="notes wrap" id="notes"><div><p class="eyebrow">${c.nav[1]}</p><h2>${c.glossaryTitle}</h2><dl>${c.glossary.map(([term, definition]) => `<div><dt>${term}</dt><dd>${definition}</dd></div>`).join("")}</dl></div><div class="faq"><h2>${c.faqTitle}</h2>${c.faq.map(([question, answer]) => `<details><summary>${question}<span aria-hidden="true">+</span></summary><p>${answer}</p></details>`).join("")}<a class="back-link" href="#top">${c.ui.replay} ↑</a></div></section>
        <section class="closing wrap"><span>${star}</span><p>${c.closing}</p></section>
    </main>
    <footer class="wrap"><div><a class="brand" href="#top">${c.brand}</a><p>${c.footer}</p></div><div><a href="${c.creditUrl}">${c.credit}</a><a href="${c.licenseUrl}">${c.license}</a></div></footer>`;

function probabilities()
{
    return applyTemperature(c.candidates.map((candidate) => candidate.probability), temperature);
}

function renderDiagram()
{
    const diagram = document.querySelector("#diagram");
    const tokens = c.tokens;
    if (activeStep === 0)
    {
        diagram.innerHTML = `<div class="input-visual"><span>${star}</span><p>${c.steps[0].analogy}</p><div class="context-line"></div><div class="context-line short"></div></div>`;
    }
    else if (activeStep <= 2)
    {
        diagram.innerHTML = `<p class="diagram-label">${activeStep === 1 ? c.ui.tokens : c.ui.ids}</p><div class="token-grid">${tokens.map((token, index) => `<div class="token ${token.category}" style="--i:${index}"><span>${token.text}</span>${activeStep === 2 ? `<small>${token.id}</small>` : ""}</div>`).join("")}</div>`;
    }
    else if (activeStep === 3)
    {
        diagram.innerHTML = `<p class="diagram-label">${c.ui.map}</p><svg class="map" viewBox="0 0 540 380" role="img" aria-label="${c.ui.map}"><path class="map-axis" d="M35 10V360H520"/><ellipse cx="145" cy="176" rx="106" ry="138" class="region"/><ellipse cx="409" cy="219" rx="105" ry="103" class="region comfort"/>${c.regions.map((region) => `<text x="${region.x}" y="${region.y}" class="region-label">${region.text}</text>`).join("")}${c.ghostWords.map((word) => `<text x="${word.x}" y="${word.y}" class="ghost">${word.text}</text>`).join("")}${tokens.map((token) => `<g transform="translate(${token.mapX},${token.mapY})"><circle r="4" class="map-dot"/><text x="8" y="4">${token.text}</text></g>`).join("")}</svg>`;
    }
    else if (activeStep === 4)
    {
        const row = c.attentionRows[selectedToken];
        const total = row.reduce((sum, value) => sum + value, 0);
        diagram.innerHTML = `<p class="diagram-label">${c.ui.tokenHelp}</p><div class="attention-scene"><svg role="img" aria-label="${c.ui.attention} ${tokens[selectedToken].text}"></svg><div class="attention-tokens">${tokens.map((token, index) => `<button data-token="${index}" aria-pressed="${index === selectedToken}" ${index > selectedToken ? 'class="future"' : ""}>${token.text}<small>${index <= selectedToken ? (row[index] / total * 100).toFixed(0) + "%" : "—"}</small></button>`).join("")}</div></div><p class="detail">${c.ui.row}</p>`;
        const scene = diagram.querySelector(".attention-scene");
        const bounds = scene.getBoundingClientRect();
        const points = [...scene.querySelectorAll("button")].map((button) =>
        {
            const rect = button.getBoundingClientRect();
            return { x: rect.left + rect.width / 2 - bounds.left, y: rect.top - bounds.top };
        });
        const svg = scene.querySelector("svg");
        svg.setAttribute("viewBox", `0 0 ${bounds.width} ${bounds.height}`);
        const from = points[selectedToken];
        svg.innerHTML = row.map((weight, index) =>
        {
            if (index === selectedToken) return "";
            const to = points[index];
            return `<path d="M${from.x} ${from.y} Q${(from.x + to.x) / 2} ${8 + index * 2} ${to.x} ${to.y}" fill="none" stroke="var(--green)" stroke-width="${weight / total * 17 + 0.5}" opacity="${0.2 + weight / total}"/>`;
        }).join("");
        diagram.querySelectorAll("[data-token]").forEach((button) => button.addEventListener("click", () =>
        {
            selectedToken = Number(button.dataset.token);
            renderDiagram();
        }));
    }
    else
    {
        const probs = probabilities();
        diagram.innerHTML = `<div class="bar-chart">${c.candidates.map((candidate, index) => `<div class="bar-row ${index === chosen ? "selected" : ""}"><span>${candidate.word}</span><div><i style="width:${probs[index] * 100}%"></i></div><b>${(probs[index] * 100).toFixed(1)}%</b></div>`).join("")}</div>`;
    }
    document.querySelector("#controls").hidden = activeStep < 6;
    document.querySelector("#ending").textContent = activeStep >= 7 && chosen !== null ? c.candidates[chosen].word : "…";
}

function setStep(step)
{
    activeStep = Math.max(0, Math.min(7, step));
    document.querySelectorAll(".step-card").forEach((card, index) => card.classList.toggle("active", index === activeStep));
    document.querySelectorAll("[data-go]").forEach((button, index) =>
    {
        if (index === activeStep) button.setAttribute("aria-current", "step");
        else button.removeAttribute("aria-current");
    });
    document.querySelector("#step-counter").textContent = `0${activeStep + 1} / 08`;
    document.querySelector("#previous").disabled = activeStep === 0;
    document.querySelector("#next").disabled = activeStep === 7;
    renderDiagram();
}

function go(step)
{
    const target = Math.max(0, Math.min(7, step));
    setStep(target);
    const card = document.querySelector(`#step-${target}`);
    if (matchMedia("(max-width: 600px)").matches)
    {
        const stageHeight = document.querySelector(".stage").getBoundingClientRect().height;
        window.scrollTo({ top: window.scrollY + card.getBoundingClientRect().top - stageHeight - 20, behavior: "instant" });
    }
    else card.scrollIntoView({ behavior: "instant", block: "center" });
}

function roll()
{
    randomValue = randomGenerator();
    chosen = sample(probabilities(), randomValue);
    draw++;
    document.querySelector("#draw-info").textContent = `${c.seedLabel} ${c.seed} · ${c.ui.seed} ${draw} · ${c.ui.random} ${randomValue.toFixed(5)}`;
    renderDiagram();
    document.querySelector("#ending").textContent = c.candidates[chosen].word;
}

document.querySelector("#theme").addEventListener("click", (event) =>
{
    const dark = document.documentElement.dataset.theme !== "dark";
    document.documentElement.dataset.theme = dark ? "dark" : "light";
    event.currentTarget.setAttribute("aria-pressed", String(dark));
    try
    {
        localStorage.setItem("theme", dark ? "dark" : "light");
    }
    catch {}
});
document.querySelectorAll("[data-go]").forEach((button) => button.addEventListener("click", () => go(Number(button.dataset.go))));
document.querySelector("#previous").addEventListener("click", () => go(activeStep - 1));
document.querySelector("#next").addEventListener("click", () => go(activeStep + 1));
document.querySelector("#temperature").addEventListener("input", (event) =>
{
    temperature = Number(event.target.value);
    chosen = null;
    document.querySelector("#temperature-value").value = temperature.toFixed(1);
    document.querySelector("#draw-info").textContent = `${c.seedLabel} ${c.seed} · ${c.ui.sum}`;
    renderDiagram();
});
document.querySelector("#roll").addEventListener("click", roll);
document.querySelector("#reset").addEventListener("click", () =>
{
    randomGenerator = mulberry32(c.seed);
    draw = 0;
    chosen = null;
    randomValue = null;
    document.querySelector("#draw-info").textContent = `${c.seedLabel} ${c.seed} · ${c.ui.sum}`;
    renderDiagram();
});
let queued = false;
window.addEventListener("scroll", () =>
{
    if (queued) return;
    queued = true;
    requestAnimationFrame(() =>
    {
        queued = false;
        const stageHeight = document.querySelector(".stage").getBoundingClientRect().height;
        const position = matchMedia("(max-width: 600px)").matches
            ? stageHeight + (window.innerHeight - stageHeight) / 2
            : window.innerHeight * 0.55;
        const cards = [...document.querySelectorAll(".step-card")];
        let nearest = 0;
        let distance = Infinity;
        cards.forEach((card, index) =>
        {
            const rect = card.getBoundingClientRect();
            const gap = Math.abs(rect.top + rect.height / 2 - position);
            if (gap < distance)
            {
                nearest = index;
                distance = gap;
            }
        });
        if (nearest !== activeStep) setStep(nearest);
    });
}, { passive: true });
setStep(0);
window.addEventListener("resize", () =>
{
    if (activeStep === 4) renderDiagram();
});
