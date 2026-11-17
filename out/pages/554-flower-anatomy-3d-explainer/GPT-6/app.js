import { content } from "./content.js";
import { FlowerScene, FlowerFallback } from "./flowerScene.js";
import { icons } from "./icons.js";

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const icon = (name) => icons[name] || "";
function hydrateIcons()
{
    $$("[data-icon]").forEach((node) => node.outerHTML = icon(node.dataset.icon));
}
const state =
{
    route: "anatomy",
    step: 0,
    selected: "",
    labels: true,
    allMobileLabels: false,
    time: 0,
    playing: false,
    speed: 1,
    question: 0,
    answers: [],
    result: false,
    best: 0
};
try
{
    const saved = Number(localStorage.getItem(content.storageKey));
    if (Number.isInteger(saved) && saved >= 0 && saved <= 5) state.best = saved;
}
catch {}
let scene;
let cachedAnchors;
let playback;
let previousTime;
const reduced = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
const pollStage = () => state.time < 2 ? 0 : state.time < 5 ? 1 : state.time < 9 ? 2 : 3;
const syncScene = () => scene?.setState(state);

function renderLabels(anchors)
{
    cachedAnchors = anchors;
    const available = state.labels && state.route !== "quiz";
    $("#labels").hidden = !available;
    $("#leaders").style.display = available ? "" : "none";
    if (!available) return;
    const width = $(".stage").clientWidth;
    const height = $(".stage").clientHeight;
    const mobile = width < 440;
    let paths = "";
    const names = content.parts.filter((part) => !mobile || state.allMobileLabels || ["stamen", "stigma", "ovary", state.selected].includes(part.id));
    const columns = [[], []];
    names.forEach((part, i) =>
    {
        const left = ["tepals", "stamen", "ovule"].includes(part.id);
        columns[left ? 0 : 1].push({ part, anchor: anchors[part.id], i });
    });
    columns.forEach((items, side) =>
    {
        items.sort((a, b) => a.anchor.y - b.anchor.y);
        let last = 130;
        items.forEach(({ part, anchor }, index) =>
        {
            const button = $(`#label-${part.id}`);
            if (!button) return;
            button.hidden = false;
            const x = side === 0 ? 14 : width - button.offsetWidth - 14;
            const gap = 58;
            const y = Math.max(last, Math.min(height - 78 - (items.length - index - 1) * gap, anchor.y - 22));
            last = y + gap;
            button.style.transform = `translate(${x}px, ${y}px)`;
            button.classList.toggle("selected", part.id === state.selected);
            const endX = side === 0 ? x + button.offsetWidth : x;
            paths += `<path d="M${anchor.x.toFixed(1)} ${anchor.y.toFixed(1)} L${endX + (side ? -12 : 12)} ${y + 22} H${endX}"/><circle cx="${anchor.x.toFixed(1)}" cy="${anchor.y.toFixed(1)}" r="2"/>`;
        });
    });
    content.parts.filter((part) => !names.includes(part)).forEach((part) => $(`#label-${part.id}`).hidden = true);
    $("#leaders").innerHTML = paths;
}

$("#labels").innerHTML = content.parts.map((part) => `<button class="projected" id="label-${part.id}" data-part="${part.id}">${part.name}</button>`).join("");
try
{
    scene = new FlowerScene($("#model"), renderLabels);
    $("#model").dataset.renderer = "webgl";
}
catch (error)
{
    $("#model").replaceChildren();
    scene = new FlowerFallback($("#model"), renderLabels);
    $("#model").dataset.renderer = "svg-fallback";
}

function selectPart(id)
{
    const part = content.parts.find((part) => part.id === id);
    state.selected = id;
    state.step = Math.max(state.step, part.reveal);
    state.labels = true;
    render();
}

function anatomyInspector()
{
    const part = content.parts.find((part) => part.id === state.selected);
    return `<div class="inspector-eyebrow">${part ? `PART ${part.index} / 06 · ${part.sub.toUpperCase()}` : "THE ANATOMY NOTEBOOK"}</div>
        <div class="anatomy-emblem"><img src="./favicon.svg" alt=""></div>
        <h2>${part ? part.name : content.whole.title}</h2>
        <p>${part ? part.text : content.whole.text}</p>
        ${part ? `<button class="primary" data-action="focus">${icon("focus")} Focus on ${part.name.toLowerCase()}</button>` : `<button class="primary" data-action="start">Start dissection ${icon("chevron-right")}</button>`}
        <div class="part-list-title">EXPLORE THE SIX PARTS</div>
        <div class="part-list">${content.parts.map((item) => `<button data-part="${item.id}" class="${item.id === state.selected ? "active" : ""}" aria-pressed="${item.id === state.selected}"><span>${item.index}</span>${item.name}<b>↗</b></button>`).join("")}</div>
        <div class="fact">${part ? part.fact : "OBSERVE → OPEN → UNDERSTAND"}</div>`;
}

function pollinationInspector()
{
    const stage = pollStage();
    const item = content.pollination[stage];
    return `<div class="inspector-eyebrow">POLLINATION LAB · 0${stage + 1} / 04</div>
        <div class="anatomy-emblem">${icon(stage === 3 ? "check" : "rotate3d")}</div>
        <h2>${item.name}</h2><p>${item.text}</p>
        <div class="timeline">${content.pollination.map((s, i) => `<button data-poll-stage="${i}" class="${i === stage ? "active" : ""}" aria-pressed="${i === stage}"><span>0${i + 1}</span>${s.name}</button>`).join("")}</div>
        <p>The sequence is simplified. Timing, grain size, and pollen numbers are illustrative.</p>
        <div class="fact">POLLINATION ≠ FERTILIZATION</div>`;
}

function quizInspector()
{
    if (state.result)
    {
        const score = state.answers.filter((answer, i) => answer === content.questions[i].answer).length;
        const missed = content.questions.filter((q, i) => state.answers[i] !== q.answer).map((q) => q.part);
        return `<div class="inspector-eyebrow">FIELD CHECK COMPLETE ${icon("award")}</div><h2>Your specimen score</h2>
            <div class="score">${score}<small> / 5</small></div>
            <p>${missed.length ? `Take another look at ${missed.join(", ")} in the lesson.` : "You can trace the whole journey, from pollen to a potential seed."}</p>
            <div class="fact">BEST IN THIS BROWSER · ${state.best} / 5</div>
            <ol class="review">${content.questions.map((q, i) => `<li>${state.answers[i] === q.answer ? "✓" : "×"} ${i + 1}. ${q.part}<br><small>Your answer: ${q.options[state.answers[i]]}<br>Correct: ${q.options[q.answer]}</small></li>`).join("")}</ol>
            <a class="review-link" href="#/anatomy">Review anatomy</a><button class="primary" data-action="try-again">Try again ${icon("rotate-ccw")}</button>`;
    }
    const index = state.question;
    const q = content.questions[index];
    const answer = state.answers[index];
    const answered = answer !== undefined;
    return `<div class="quiz-count">QUESTION ${index + 1} OF 5 · BEST ${state.best} / 5</div>
        <div class="quiz-progress">${content.questions.map((q, i) => `<span class="${i <= index ? "filled" : ""}"></span>`).join("")}</div>
        <h2 class="question">${q.question}</h2>
        <div class="answers">${q.options.map((option, i) => `<button data-answer="${i}" class="answer ${answered && i === q.answer ? "correct" : answered && i === answer ? "wrong" : ""}" ${answered ? "disabled" : ""}>${answered && i === q.answer ? icon("check") : answered && i === answer ? icon("x") : `<span>${String.fromCharCode(65 + i)}.</span>`}${option}</button>`).join("")}</div>
        ${answered ? `<div class="feedback" role="status"><strong>${answer === q.answer ? "That's right." : "Not quite. Follow the marked answer."}</strong><p>${q.why}</p></div>` : ""}
        <button class="primary" data-action="next-question" ${answered ? "" : "disabled"}>${index === 4 ? "See your results" : "Next question"} ${icon("chevron-right")}</button>
        <p>Your best numeric score is saved on this device only. No account or network is used.</p>`;
}

function renderToolbar()
{
    const toolbar = $("#toolbar");
    if (state.route === "anatomy")
    {
        toolbar.innerHTML = `<div class="step-grid">${content.steps.map((name, i) => `<button data-step="${i}" class="${i === state.step ? "active" : ""}" aria-pressed="${i === state.step}"><span class="step-num">0${i}</span>${name}</button>`).join("")}</div>
            <div class="toolbar-bottom"><span>DISSECTION / 0${state.step}</span><div><button data-action="previous" ${state.step === 0 ? "disabled" : ""}>${icon("chevron-left")} Previous</button><button data-action="next" ${state.step === 3 ? "disabled" : ""}>Next ${icon("chevron-right")}</button></div></div>`;
    }
    else if (state.route === "pollination")
    {
        toolbar.innerHTML = `<div class="poll-controls">
            <button class="primary" data-action="play">${icon(state.playing ? "pause" : "play")} ${state.playing ? "Pause" : reduced() ? "Advance stage" : "Play sequence"}</button>
            <button data-action="previous">${icon("chevron-left")}<span>Previous</span></button>
            <button data-action="next"><span>Next</span>${icon("chevron-right")}</button>
            <button data-action="replay" title="Replay sequence">${icon("rotate-ccw")} Replay</button>
            <select id="speed" aria-label="Playback speed"><option value="1" ${state.speed === 1 ? "selected" : ""}>1×</option><option value="0.5" ${state.speed === .5 ? "selected" : ""}>0.5×</option></select>
            </div><progress class="poll-progress" max="12" value="${state.time}" aria-label="Pollination sequence progress"></progress>
            <div class="toolbar-bottom"><span id="time-readout">${state.time.toFixed(1)} / 12 SEC</span><span>Release · Transfer · Tube · Fertilization</span></div>`;
    }
    else
    {
        toolbar.innerHTML = `<div class="toolbar-bottom"><span>YOUR LIVING REFERENCE</span>${icon("rotate3d")}</div><p class="simplification">Turn the flower as you think. The labels are tucked away for this chapter.</p>`;
    }
}

function renderInspector()
{
    $("#inspector").innerHTML = state.route === "anatomy" ? anatomyInspector() : state.route === "pollination" ? pollinationInspector() : quizInspector();
}

function render()
{
    const active = document.activeElement;
    const focusAttribute = ["data-part", "data-step", "data-action"].find((attribute) => active?.hasAttribute(attribute));
    const focusValue = focusAttribute && active.getAttribute(focusAttribute);
    const focusInInspector = active?.closest("#inspector");
    const focusInLabels = active?.closest("#labels");
    const chapter = content.chapters[state.route];
    $("#chapter-number").textContent = `BOTANY / ${chapter[0]}`;
    $("#chapter-title").textContent = chapter[1];
    $("#chapter-intro").textContent = chapter[2];
    $$('a[href^="#/"]').forEach((link) =>
    {
        if (link.hash === `#/${state.route}`) link.setAttribute("aria-current", "page");
        else link.removeAttribute("aria-current");
    });
    document.body.classList.toggle("quiz-view", state.route === "quiz");
    $("#labels-toggle").setAttribute("aria-pressed", String(state.labels));
    $("#labels-toggle").innerHTML = `${icon(state.labels ? "eye" : "eye-off")}<span>Labels</span>`;
    renderToolbar();
    renderInspector();
    syncScene();
    if (cachedAnchors) renderLabels(cachedAnchors);
    if (focusAttribute)
    {
        const scope = focusInInspector ? "#inspector " : focusInLabels ? "#labels " : "#toolbar ";
        $(`${scope}[${focusAttribute}="${focusValue}"]`)?.focus({ preventScroll: true });
    }
}

function route()
{
    const next = location.hash.slice(2);
    const nextRoute = Object.hasOwn(content.chapters, next) ? next : "anatomy";
    state.playing = false;
    cancelAnimationFrame(playback);
    previousTime = undefined;
    state.route = nextRoute;
    state.labels = nextRoute !== "quiz";
    state.selected = "";
    state.step = 0;
    if (nextRoute === "pollination") state.time = 0;
    render();
    scene.reset();
}

function stopPlayback()
{
    state.playing = false;
    cancelAnimationFrame(playback);
    previousTime = undefined;
}

function jump(stage)
{
    stopPlayback();
    state.time = content.pollination[Math.max(0, Math.min(3, stage))].time;
    render();
}

function animateSequence(now)
{
    if (!state.playing) return;
    if (document.hidden)
    {
        previousTime = undefined;
        playback = requestAnimationFrame(animateSequence);
        return;
    }
    const previousStage = pollStage();
    if (previousTime !== undefined) state.time = Math.min(12, state.time + (now - previousTime) / 1000 * state.speed);
    previousTime = now;
    syncScene();
    $(".poll-progress").value = state.time;
    $("#time-readout").textContent = `${state.time.toFixed(1)} / 12 SEC`;
    if (previousStage !== pollStage()) renderInspector();
    if (state.time === 12)
    {
        stopPlayback();
        renderToolbar();
        return;
    }
    playback = requestAnimationFrame(animateSequence);
}

function togglePlay()
{
    if (reduced())
    {
        jump((pollStage() + 1) % 4);
        return;
    }
    if (state.playing) stopPlayback();
    else
    {
        if (state.time >= 12) state.time = 0;
        state.playing = true;
        previousTime = undefined;
        playback = requestAnimationFrame(animateSequence);
    }
    renderToolbar();
}

document.addEventListener("click", (event) =>
{
    const part = event.target.closest("[data-part]");
    if (part)
    {
        selectPart(part.dataset.part);
        return;
    }
    const step = event.target.closest("[data-step]");
    if (step)
    {
        state.step = Number(step.dataset.step);
        render();
        return;
    }
    const stage = event.target.closest("[data-poll-stage]");
    if (stage)
    {
        jump(Number(stage.dataset.pollStage));
        return;
    }
    const answer = event.target.closest("[data-answer]");
    if (answer && state.answers[state.question] === undefined)
    {
        state.answers[state.question] = Number(answer.dataset.answer);
        renderInspector();
        $("[data-action='next-question']").focus({ preventScroll: true });
        return;
    }
    const action = event.target.closest("[data-action]")?.dataset.action;
    if (action === "focus") scene.focus(state.selected);
    if (action === "start")
    {
        state.step = 1;
        render();
    }
    if (["next", "previous"].includes(action))
    {
        const delta = action === "next" ? 1 : -1;
        if (state.route === "pollination") jump(pollStage() + delta);
        else
        {
            state.step = Math.max(0, Math.min(3, state.step + delta));
            render();
        }
    }
    if (action === "play") togglePlay();
    if (action === "replay")
    {
        jump(0);
        if (!reduced()) togglePlay();
    }
    if (action === "next-question")
    {
        if (state.question < 4) state.question++;
        else
        {
            state.result = true;
            state.best = Math.max(state.best, state.answers.filter((answer, i) => answer === content.questions[i].answer).length);
            try { localStorage.setItem(content.storageKey, String(state.best)); } catch {}
        }
        renderInspector();
    }
    if (action === "try-again")
    {
        state.question = 0;
        state.answers = [];
        state.result = false;
        renderInspector();
    }
});
$("#labels-toggle").addEventListener("click", () =>
{
    if (innerWidth < 761 && !state.allMobileLabels && state.labels)
    {
        state.allMobileLabels = true;
    }
    else state.labels = !state.labels;
    render();
});
$("#reset-view").addEventListener("click", () => scene.reset());
document.addEventListener("change", (event) =>
{
    if (event.target.id === "speed") state.speed = Number(event.target.value);
});
$("#model").addEventListener("keydown", (event) =>
{
    if (state.route !== "pollination") return;
    if (event.key === " ")
    {
        event.preventDefault();
        togglePlay();
    }
    if (event.key === "[") jump(pollStage() - 1);
    if (event.key === "]") jump(pollStage() + 1);
});
document.querySelector("nav").addEventListener("click", (event) =>
{
    if (event.target.closest("a") && innerWidth < 761) $(".workspace").scrollIntoView({ block: "start" });
});
window.addEventListener("hashchange", route);
hydrateIcons();
$(".brand").lastChild.textContent = content.brand;
$(".stage-heading h2").textContent = content.specimen;
$("#model").setAttribute("aria-label", `Three-dimensional ${content.specimen}. Drag to rotate; arrow keys turn; plus and minus zoom; zero resets.`);
document.title = `${content.brand} — Flower Anatomy`;
$("footer > span:first-child").innerHTML = `<b>${content.brand}</b> · An interactive specimen study`;
$("footer > span:nth-child(2)").textContent = `Designed for ${content.audience.toLowerCase()}`;
$("footer > a").href = content.links.credit;
route();
window.addEventListener("pagehide", stopPlayback);
