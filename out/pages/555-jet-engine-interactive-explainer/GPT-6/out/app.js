import { content as c } from "./content.js";

const state =
{
    throttle: .35,
    motionPaused: matchMedia("(prefers-reduced-motion: reduce)").matches,
    showCoreFlow: true,
    showBypassFlow: true,
    scrollProgress: 0,
    activeStage: 0,
    selectedStage: 0,
    controlMode: "scroll"
};
const reduced = matchMedia("(prefers-reduced-motion: reduce)");
const root = document.querySelector("#app");
const scenes = [];
let phase1 = 0;
let phase2 = 0;
let flowPhase = 0;
let frame = 0;
let last = 0;

function controls(id)
{
    return `<div class="controls">
        <label class="throttle" for="${id}-throttle">${c.controls.throttle}<input id="${id}-throttle" type="range" min="0" max="100" step="1" value="35"><output for="${id}-throttle">35%</output></label>
        <button class="motion-toggle" type="button" aria-pressed="${state.motionPaused}">${state.motionPaused ? c.controls.play : c.controls.pause}</button>
        <button class="flow-toggle" data-flow="bypass" type="button" aria-pressed="true">${c.controls.bypass}</button>
        <button class="flow-toggle" data-flow="core" type="button" aria-pressed="true">${c.controls.core}</button>
        <div class="spools"><span class="n1">N1 1.68 rad/s</span> &nbsp; / &nbsp; <span class="n2">N2 4.38 rad/s</span></div>
    </div>`;
}

function panel(id, extra = "")
{
    return `<div class="scene-panel ${extra}">
        <div class="scene-top"><span class="scene-title">${c.hero.badge}</span><span class="live">${state.motionPaused ? c.controls.stopped : c.controls.running}</span></div>
        <svg class="scene" data-scene="${id}" viewBox="0 0 1000 337" role="img" aria-label="Original longitudinal cutaway: fan, bypass duct, two coaxial shafts, compressor, combustor, turbine and exhaust"></svg>
        ${controls(id)}
    </div>`;
}

root.innerHTML = `
    <header class="wrap">
        <a class="brand" href="#main"><span class="mark" aria-hidden="true">≋</span>${c.brand}</a>
        <nav aria-label="Main navigation"><a href="#engine">${c.nav[0]}</a><a href="#tour">${c.nav[1]}</a><a href="#knowledge">${c.nav[2]}</a></nav>
        <span class="edition">FIELD GUIDE &nbsp; № 01</span>
    </header>
    <main id="main" class="wrap">
        <section class="intro">
            <p class="eyebrow">${c.hero.eyebrow}</p>
            <div class="hero-copy"><h1>${c.hero.title}</h1><div><p class="hero-description">${c.hero.description}</p><a class="button" href="#tour">${c.cta}<span aria-hidden="true">↘</span></a></div></div>
            <div class="hero-meta"><span>${c.hero.aside}</span><span>SCROLL TO DISCOVER ↓</span></div>
        </section>
        <section id="engine" aria-label="Interactive engine overview">
            ${panel("hero", "hero-scene")}
            <p class="scene-note"><span>${c.hero.note}</span><span>${c.controls.teaching}</span></p>
        </section>
        <div class="stats">${c.facts.map(([n, title, copy]) => `<div class="stat"><strong>${n}</strong><div><span>${title}</span><p>${copy}</p></div></div>`).join("")}</div>
        <section id="tour">
            <div class="section-intro"><p class="eyebrow">${c.tour.eyebrow}</p><h2>${c.tour.title}</h2><p>${c.tour.description}</p></div>
            <div class="tour-layout">
                <div class="sticky">
                    <div class="stage-tabs" aria-label="Engine stages">${c.stages.map((s, i) => `<button type="button" data-stage="${i}" aria-pressed="${i === 0}">${s.name}</button>`).join("")}</div>
                    ${panel("tour", "tour-panel")}
                    <p class="annotation" aria-live="polite">${c.stages[0].fact}</p>
                    <button class="quiz-reset reset-view" type="button">${c.controls.reset}</button>
                </div>
                <div class="chapters">${c.stages.map((s, i) => `<article class="chapter" id="step-${i}" data-chapter="${i}"><span class="step-number">${s.kicker}</span><h3>${s.title}</h3><p>${s.copy}</p><p class="detail">${s.detail}</p></article>`).join("")}</div>
            </div>
        </section>
        <section id="knowledge" class="lab">
            <div class="lab-grid"><div><p class="eyebrow">${c.lab.eyebrow}</p><h2>${c.lab.title}</h2><p class="lab-description">${c.lab.description}</p>${panel("lab")}<p class="scene-note">${c.controls.teaching}</p></div>
            <div class="quiz"><small>KNOWLEDGE CHECK / 01</small><h3>${c.lab.title2}</h3><p class="lab-description">${c.lab.hint}</p><div class="answers">${c.lab.options.map((s, i) => `<button type="button" data-answer="${i}" aria-pressed="false"><span>${String.fromCharCode(65 + i)}</span>${s}</button>`).join("")}</div><p class="feedback" aria-live="polite"></p><button class="quiz-reset" type="button">${c.lab.reset}</button></div></div>
        </section>
    </main>
    <footer class="wrap"><div class="footer-top"><span class="brand">${c.footer.line}</span><p>${c.footer.text}</p></div><div class="footer-bottom"><span>© ${new Date().getFullYear()} ${c.brand} / MADE FOR UNDERSTANDING</span><span><a href="${c.footer.url}" target="_blank" rel="noopener noreferrer">${c.footer.credit}</a> · <a href="${c.footer.licenseUrl}" target="_blank" rel="noopener noreferrer">${c.footer.license}</a></span></div></footer>`;

function makeScene(svg)
{
    const id = svg.dataset.scene;
    const rowData =
    [
        {x: 210, r: 111, n: c.geometry.fanBlades, spool: 1, zone: "fan"},
        ...Array.from({length: c.geometry.lpc}, (_, i) => ({x: 322 + i * 31, r: 62 - i * 7, n: 16, spool: 1, zone: "compressor"})),
        ...Array.from({length: c.geometry.hpc}, (_, i) => ({x: 422 + i * 24, r: 43 - i * 3, n: 16, spool: 2, zone: "compressor"})),
        {x: 693, r: 38, n: 18, spool: 2, zone: "turbine"},
        ...Array.from({length: c.geometry.lpt}, (_, i) => ({x: 730 + i * 31, r: 43 + i * 7, n: 16, spool: 1, zone: "turbine"}))
    ];
    const rowMarkup = rowData.map((r, i) => `<g class="zone" data-zone="${r.zone}"><ellipse cx="${r.x}" cy="175" rx="${r.r * .22}" ry="${r.r}" fill="none" stroke="#718884" stroke-width=".7" opacity=".6"/>${Array.from({length: r.n}, (_, j) => `<path data-rotor="${i}" data-blade="${j}" fill="url(#metal-${id})" stroke="#c1d0c8" stroke-width=".45"/>`).join("")}</g>`).join("");
    const stators = rowData.filter((r) => r.zone === "compressor").map((r) => `<path d="M${r.x + 14} ${175 - r.r} l8 ${r.r - 10} M${r.x + 14} ${175 + r.r} l8 -${r.r - 10}" stroke="#728b80" stroke-width="4" fill="none"/>`).join("");
    const nozzles = Array.from({length: c.geometry.nozzles}, (_, i) =>
    {
        const a = i / c.geometry.nozzles * Math.PI * 2;
        return `<circle cx="${600 + Math.sin(a) * 7}" cy="${175 + Math.cos(a) * 39}" r="2" fill="#ffc997"/>`;
    }).join("");
    svg.innerHTML = `<defs>
        <linearGradient id="metal-${id}" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#f0f3db"/><stop offset=".37" stop-color="#91aaa0"/><stop offset=".6" stop-color="#d5ddc8"/><stop offset="1" stop-color="#425e59"/></linearGradient>
        <linearGradient id="case-${id}" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#95a79c"/><stop offset=".45" stop-color="#435b55"/><stop offset="1" stop-color="#789187"/></linearGradient>
        <linearGradient id="heat-${id}"><stop stop-color="#d56837" stop-opacity=".2"/><stop offset=".5" stop-color="#ffa15b" stop-opacity=".8"/><stop offset="1" stop-color="#f3bf80" stop-opacity=".25"/></linearGradient>
    </defs>
    <g fill="#a8bdb1"><text x="64" y="185">${c.hero.direction}</text><text x="893" y="185">${c.hero.exhaust}</text></g>
    <path d="M127 175 H878" stroke="#83978c" stroke-dasharray="3 7" opacity=".4"/>
    <ellipse cx="505" cy="295" rx="322" ry="12" fill="#071c1f" opacity=".65"/>
    <g class="zone" data-zone="fan">
        <path d="M210 59 C296 48 376 56 458 75 L754 104 L806 122 L780 135 L442 105 C342 77 284 82 223 87Z" fill="url(#case-${id})" stroke="#b3c2b4" stroke-width="1"/>
        <path d="M210 291 C296 302 376 294 458 275 L754 246 L806 228 L780 215 L442 245 C342 273 284 268 223 263Z" fill="url(#case-${id})" stroke="#b3c2b4" stroke-width="1"/>
        <ellipse cx="210" cy="175" rx="32" ry="116" fill="#193634" stroke="#c0cec0" stroke-width="5"/>
        <ellipse cx="210" cy="175" rx="26" ry="109" fill="#142b2e" stroke="#56756a"/>
    </g>
    <g class="zone" data-zone="compressor">
        <path d="M290 105 L398 126 L554 141 L579 131 M290 245 L398 224 L554 209 L579 219" stroke="#b2c4b5" stroke-width="4" fill="none"/>
        ${stators}
    </g>
    <g class="zone" data-zone="combustor"><path d="M578 130 Q622 119 676 132 L676 152 L590 152Z M578 220 Q622 231 676 218 L676 198 L590 198Z" fill="url(#heat-${id})" stroke="#d7915b" stroke-width="1.5"/>
        <path d="M611 138 Q629 146 650 137 M610 211 Q633 199 654 214" fill="none" stroke="#ffd19a" stroke-width="3"/>${nozzles}
    </g>
    <g class="zone" data-zone="turbine"><path d="M678 132 L737 122 L801 112 L831 137 M678 218 L737 228 L801 238 L831 213" stroke="#b2c4b5" stroke-width="4" fill="none"/>
        <path d="M796 162 Q836 164 870 175 Q836 186 796 188Z" fill="url(#metal-${id})" stroke="#81988b"/>
    </g>
    <path d="M204 175 L799 175" stroke="#86dcc8" stroke-width="5"/>
    <path d="M414 168 L700 168 M414 182 L700 182" stroke="#e9b46b" stroke-width="3"/>
    ${rowMarkup}
    <path d="M159 175 Q186 155 215 160 L281 170 L281 180 L215 190 Q186 195 159 175Z" fill="url(#metal-${id})" stroke="#c5d3c4"/>
    <g class="bypass-path" fill="none" stroke="#86dcc8" stroke-width="1.3" opacity=".7"><path d="M116 112 C255 84 310 96 435 115 L853 144"/><path d="M116 238 C255 266 310 254 435 235 L853 206"/></g>
    <g class="core-path" fill="none" stroke="#efb16b" stroke-width="1.3" opacity=".8"><path d="M117 149 C269 136 329 142 449 150 L558 158 Q620 143 668 155 L862 160"/><path d="M117 201 C269 214 329 208 449 200 L558 192 Q620 207 668 195 L862 190"/></g>
    <g class="particles"></g>
    <g stroke="#829a8d" stroke-width=".7" fill="none"><path d="M212 55 V27 H315"/><path d="M448 122 V48 H529"/><path d="M624 121 V35 H702"/><path d="M751 239 V285 H829"/></g>
    <g fill="#d2dfd3"><text x="242" y="21">01 / FAN + BYPASS</text><text x="455" y="42">02 / COMPRESSOR</text><text x="634" y="29">03 / COMBUSTOR</text><text x="716" y="301">04 / TURBINE</text></g>
    <g font-size="8"><text x="390" y="271" fill="#86dcc8">N1 · INNER SHAFT</text><text x="529" y="286" fill="#efb16b">N2 · OUTER SHAFT</text></g>`;
    const particleGroup = svg.querySelector(".particles");
    const particles = Array.from({length: matchMedia("(max-width: 760px)").matches ? 80 : 160}, (_, i) =>
    {
        const node = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        const bypass = i % 3 !== 0;
        node.setAttribute("r", bypass ? "1.5" : "1.25");
        node.setAttribute("fill", bypass ? "#9debd9" : "#ffd199");
        particleGroup.append(node);
        return {node, bypass, seed: ((i * 73 + 19) % 161) / 161, side: i % 2 ? 1 : -1};
    });
    const blades = [...svg.querySelectorAll("[data-rotor]")].map((node) => ({node, row: rowData[Number(node.dataset.rotor)], i: Number(node.dataset.blade)}));
    const scene = {svg, blades, particles, visible: false};
    scenes.push(scene);
    draw(scene);
}

function draw(scene)
{
    for (const {node, row: r, i} of scene.blades)
    {
        const a = (r.spool === 1 ? phase1 : phase2) + i / r.n * Math.PI * 2;
        const y = Math.cos(a);
        const z = Math.sin(a);
        const x = r.x + z * r.r * .22;
        const tip = 175 + y * r.r;
        const inner = 175 + y * 12;
        node.setAttribute("d", `M${r.x - 3} ${inner} Q${x - 10} ${tip - y * 14} ${x - 5} ${tip} L${x + 5} ${tip + 2} Q${x + 12} ${tip - y * 9} ${r.x + 5} ${inner + 3}Z`);
        node.setAttribute("opacity", String(.55 + (z + 1) * .22));
    }
    for (const p of scene.particles)
    {
        const t = (p.seed + flowPhase) % 1;
        const x = 112 + t * 755;
        const arc = Math.sin(Math.PI * t);
        const y = p.bypass ? 175 + p.side * (57 + 28 * arc) : 175 + p.side * (26 - 10 * arc);
        p.node.setAttribute("cx", x.toFixed(2));
        p.node.setAttribute("cy", y.toFixed(2));
        p.node.style.display = (p.bypass ? state.showBypassFlow : state.showCoreFlow) ? "" : "none";
    }
}

function canAnimate()
{
    return !document.hidden && !state.motionPaused && !reduced.matches && state.throttle > 0 && scenes.some((s) => s.visible);
}

function tick(time)
{
    frame = 0;
    if (!canAnimate())
    {
        last = 0;
        return;
    }
    const dt = last ? Math.min((time - last) / 1000, .05) : 0;
    last = time;
    phase1 += dt * c.geometry.n1 * state.throttle;
    phase2 += dt * c.geometry.n2 * state.throttle;
    flowPhase += dt * state.throttle * .18;
    for (const scene of scenes)
    {
        if (scene.visible) draw(scene);
    }
    frame = requestAnimationFrame(tick);
}

function animate()
{
    if (!canAnimate())
    {
        cancelAnimationFrame(frame);
        frame = 0;
        last = 0;
    }
    else if (!frame)
    {
        frame = requestAnimationFrame(tick);
    }
}

function sync()
{
    root.querySelectorAll('input[type="range"]').forEach((input) =>
    {
        input.value = String(Math.round(state.throttle * 100));
        input.nextElementSibling.textContent = `${input.value}%`;
    });
    root.querySelectorAll(".motion-toggle").forEach((b) =>
    {
        b.textContent = state.motionPaused ? c.controls.play : c.controls.pause;
        b.setAttribute("aria-pressed", String(state.motionPaused));
    });
    root.querySelectorAll(".n1").forEach((s) => s.textContent = `N1 ${(state.throttle * c.geometry.n1).toFixed(2)} rad/s`);
    root.querySelectorAll(".n2").forEach((s) => s.textContent = `N2 ${(state.throttle * c.geometry.n2).toFixed(2)} rad/s`);
    root.querySelectorAll(".live").forEach((s) => s.textContent = reduced.matches ? c.controls.reduced : state.motionPaused || state.throttle === 0 ? c.controls.stopped : c.controls.running);
    root.querySelectorAll("[data-flow]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.flow === "bypass" ? state.showBypassFlow : state.showCoreFlow)));
    root.querySelectorAll(".bypass-path").forEach((p) => p.style.display = state.showBypassFlow ? "" : "none");
    root.querySelectorAll(".core-path").forEach((p) => p.style.display = state.showCoreFlow ? "" : "none");
    scenes.forEach(draw);
    animate();
}

function stage(index)
{
    state.activeStage = index;
    state.selectedStage = index;
    const data = c.stages[index];
    root.querySelectorAll("[data-stage]").forEach((b) => b.setAttribute("aria-pressed", String(Number(b.dataset.stage) === index)));
    root.querySelector(".annotation").textContent = data.fact;
    const tour = root.querySelector('[data-scene="tour"]');
    tour.querySelectorAll("[data-zone]").forEach((g) => g.classList.toggle("muted-zone", data.focus !== "all" && g.dataset.zone !== data.focus));
    tour.setAttribute("aria-label", `${data.name}: ${data.fact}`);
}

root.querySelectorAll(".scene").forEach(makeScene);
const sceneObserver = new IntersectionObserver((entries) =>
{
    for (const entry of entries)
    {
        const scene = scenes.find((s) => s.svg === entry.target);
        scene.visible = entry.isIntersecting;
        if (scene.visible) draw(scene);
    }
    animate();
});
scenes.forEach((s) => sceneObserver.observe(s.svg));
root.addEventListener("input", (event) =>
{
    if (event.target.matches('input[type="range"]'))
    {
        state.throttle = Number(event.target.value) / 100;
        sync();
    }
});
root.addEventListener("click", (event) =>
{
    const button = event.target.closest("button");
    if (!button) return;
    if (button.matches(".motion-toggle"))
    {
        state.motionPaused = !state.motionPaused;
        sync();
    }
    if (button.dataset.flow)
    {
        const key = button.dataset.flow === "core" ? "showCoreFlow" : "showBypassFlow";
        state[key] = !state[key];
        sync();
    }
    if (button.dataset.stage !== undefined)
    {
        state.controlMode = "manual";
        stage(Number(button.dataset.stage));
    }
    if (button.matches(".reset-view"))
    {
        state.throttle = .35;
        state.motionPaused = reduced.matches;
        state.showCoreFlow = true;
        state.showBypassFlow = true;
        state.controlMode = "scroll";
        root.querySelector("#tour").scrollIntoView({behavior: "instant", block: "start"});
        stage(0);
        sync();
    }
    if (button.dataset.answer !== undefined)
    {
        const correct = Number(button.dataset.answer) === c.lab.answer;
        root.querySelectorAll("[data-answer]").forEach((b) => b.setAttribute("aria-pressed", String(b === button)));
        const feedback = root.querySelector(".feedback");
        feedback.textContent = correct ? c.lab.correct : c.lab.incorrect;
        feedback.dataset.correct = String(correct);
    }
    if (button.matches(".quiz .quiz-reset"))
    {
        root.querySelectorAll("[data-answer]").forEach((b) => b.setAttribute("aria-pressed", "false"));
        root.querySelector(".feedback").textContent = "";
        root.querySelector("[data-answer]").focus();
    }
});
window.addEventListener("scroll", () =>
{
    const tour = root.querySelector("#tour").getBoundingClientRect();
    state.scrollProgress = Math.max(0, Math.min(1, -tour.top / Math.max(1, tour.height - innerHeight)));
    if (state.controlMode !== "scroll") return;
    let active = 0;
    root.querySelectorAll("[data-chapter]").forEach((el) =>
    {
        if (el.getBoundingClientRect().top < innerHeight * .52) active = Number(el.dataset.chapter);
    });
    if (active !== state.activeStage) stage(active);
}, {passive: true});
document.addEventListener("visibilitychange", animate);
reduced.addEventListener("change", () =>
{
    if (reduced.matches) state.motionPaused = true;
    sync();
});
sync();
