import { content as c } from "./content.js";
import { icons } from "./icons.js";

const state =
{
    ageBand: "5–6",
    lessonMode: "read",
    lessonIndex: 0,
    feedback: null,
    selectedWord: null,
    parentPeriod: 0,
    billingPeriod: 0,
    menuOpen: false,
    routineOpen: false
};
const $ = (selector) => document.querySelector(selector);
const escape = (value) => String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
const icon = (name) => icons[name] || "";
const image = (asset, className = "") => `<img class="${className}" src="${asset.src}" alt="${escape(asset.alt)}" width="1000" height="730" decoding="async">`;
const lessonLink = (text, className = "button") => `<a class="${className}" data-focus-lesson href="${c.links.lesson}">${escape(text)}${icon("arrow")}</a>`;
const routineButton = (text) => `<button class="button" type="button" data-open-routine>${escape(text)}${icon("arrow")}</button>`;
const ageControls = (location) => `<fieldset class="age-picker"><legend>${c.hero.choose}</legend><div>${c.ages.map((age, index) => `<label><input type="radio" name="age-${location}" value="${age}" data-age ${age === state.ageBand ? "checked" : ""}><span>${age}</span></label>`).join("")}</div></fieldset>`;
const brand = () => `<span class="brand"><span class="motif" aria-hidden="true"><i></i><i></i><i></i><i></i></span>${c.brand}</span>`;

document.title = c.title;
$("#app").innerHTML = `
    <a class="skip" href="./index.html#content">${c.header.skip}</a>
    <header class="site-header wrap">
        <a href="./index.html" class="home-link">${brand()}</a>
        <nav class="desktop-nav" aria-label="${c.header.navigation}">${c.header.items.map(([label, key]) => `<a href="${c.links[key]}">${label}</a>`).join("")}</nav>
        ${lessonLink(c.hero.try, "button header-cta")}
        <button type="button" class="menu-button" aria-expanded="false" aria-controls="mobile-navigation">${c.header.menu}${icon("plus")}</button>
        <nav id="mobile-navigation" aria-label="${c.header.navigation}" hidden>${c.header.items.map(([label, key]) => `<a href="${c.links[key]}">${label}</a>`).join("")}</nav>
    </header>
    <main id="content" tabindex="-1">
        <section class="hero wrap">
            <div class="hero-copy">
                <p class="eyebrow"><span class="mini-sun" aria-hidden="true"></span>${c.hero.eyebrow}</p>
                <h1>${c.hero.headline.map((line) => `<span>${line}</span>`).join("")}</h1>
                <p class="hero-description">${c.hero.description}</p>
                <div class="hero-actions">${lessonLink(c.hero.try)}<a class="text-link" href="${c.links.parents}">${c.hero.parents}${icon("arrow")}</a></div>
                ${ageControls("hero")}
                <p class="small-note">${icon("check")}${c.hero.note}</p>
            </div>
            <div class="hero-stage">
                <div class="scene float">${image(c.assets.hero)}<div class="arch" aria-hidden="true"></div><div class="orb" aria-hidden="true"></div></div>
                <section class="phone" id="lesson-preview" aria-label="${c.phone.label}"></section>
            </div>
        </section>
        <section class="learning section-band" id="learning">
            <div class="wrap">
                <div class="section-top"><div><p class="eyebrow">${c.learning.eyebrow}</p><h2>${c.learning.heading}</h2><p>${c.learning.intro}</p></div>${ageControls("learning")}</div>
                <div id="path-card" class="path-card"></div>
            </div>
        </section>
        <section class="play wrap section-gap">
            <div class="play-art">${image(c.assets.play, "play-image")}</div>
            <div><h2>${c.play.heading}</h2><p>${c.play.intro}</p>${c.play.blocks.map((block) => `<article class="play-block ${block.mode}"><h3>${block.heading}</h3><p>${block.body}</p><button type="button" class="button secondary" data-mode-link="${block.mode}">${block.button}${icon("arrow")}</button></article>`).join("")}<p class="small-note">${c.play.note}</p></div>
        </section>
        <section class="parents wrap section-gap" id="parents">
            <p class="eyebrow">${c.parents.eyebrow}</p><h2>${c.parents.heading}</h2><p class="section-intro">${c.parents.intro}</p>
            <div class="parent-layout">
                <div class="dashboard">
                    <div class="dashboard-heading"><h3>${c.parents.title}</h3><span class="sample-label">${c.parents.illustrative}</span></div>
                    <div class="segments period-controls" aria-label="${c.parents.title}">${c.parents.periods.map((label, index) => `<button type="button" data-period="${index}" aria-pressed="${index === 0}">${label}</button>`).join("")}</div>
                    <div id="dashboard-data"></div>
                    <p id="parent-announcement" class="sr-only" aria-live="polite"></p>
                </div>
                <aside class="next-step"><span class="sprout small" aria-hidden="true"></span><h3>${c.parents.next}</h3><p id="next-step"></p>${routineButton(c.parents.routine)}<p class="sample-note">${c.parents.sampleNote}</p></aside>
            </div>
        </section>
        <section class="safety section-band section-gap" id="safety">
            <div class="wrap safety-layout">
                <div class="safety-intro"><p class="eyebrow">${c.safety.eyebrow}</p><h2>${c.safety.heading}</h2><p>${c.safety.intro}</p></div>
                <div class="safety-art">${image(c.assets.calm)}</div>
                <div class="principles">${c.safety.principles.map(([heading, body, name]) => `<article>${icon(name)}<div><h3>${heading}</h3><p>${body}</p></div></article>`).join("")}<a class="text-link" data-memory href="${c.links.memory}">${c.safety.memory}${icon("arrow")}</a></div>
            </div>
        </section>
        <section class="pricing wrap section-gap" id="plans">
            <h2>${c.pricing.heading}</h2><p>${c.pricing.intro}</p>
            <div class="segments billing-controls" aria-label="${c.pricing.heading}">${c.pricing.periods.map((label, index) => `<button type="button" data-billing="${index}" aria-pressed="${index === 0}">${label}</button>`).join("")}</div>
            <div class="price-cards">
                <article class="price-card starter"><p class="plan-kicker">${c.pricing.starterNote}</p><h3>${c.pricing.starter}</h3><p class="price">${c.pricing.free}</p><ul>${c.pricing.starterFeatures.map((feature) => `<li>${icon("check")}${feature}</li>`).join("")}</ul>${lessonLink(c.hero.try, "button secondary")}</article>
                <article class="price-card family"><span class="plan-kicker family-label">${c.pricing.label}</span><h3>${c.pricing.family}</h3><div id="family-price" aria-live="polite"></div><ul>${c.pricing.familyFeatures.map((feature) => `<li>${icon("check")}${feature}</li>`).join("")}</ul>${routineButton(c.pricing.routine)}</article>
            </div><p class="small-note">${c.pricing.note}</p>
        </section>
        <section class="questions wrap section-gap" id="questions"><h2>${c.questions.heading}</h2>${c.questions.items.map(([question, answer], index) => `<details ${index === 0 ? "open" : ""} ${index === 3 ? 'id="preview-memory"' : ""}><summary>${question}${icon("plus")}</summary><p>${answer}</p></details>`).join("")}</section>
        <section class="invitation section-gap"><div class="wrap"><div class="edge-pebbles" aria-hidden="true"><i></i><i></i></div><h2>${c.footer.heading}</h2><p>${c.footer.intro}</p><div class="invitation-actions">${lessonLink(c.hero.try)}${routineButton(c.pricing.routine)}</div></div></section>
    </main>
    <footer class="site-footer wrap"><div>${brand()}<p>${c.footer.tagline}</p></div><div><nav aria-label="${c.questions.heading}">${c.footer.links.map(([label, key]) => `<a href="${c.links[key]}">${label}</a>`).join("")}</nav><a class="credit" href="${c.links.credit}">${c.footer.credit}</a></div></footer>
    <dialog id="routine-dialog" aria-labelledby="routine-title"></dialog>`;

function currentLesson()
{
    return c.lessons[state.ageBand][state.lessonMode][state.lessonIndex];
}

function cancelSpeech()
{
    window.speechSynthesis?.cancel();
}

function lessonArt(lesson)
{
    if (state.lessonMode === "math")
    {
        let ordinal = 0;
        const total = lesson.groups.reduce((sum, value) => sum + value, 0);
        return `<div class="pebble-groups" role="img" aria-label="${c.phone.pebbles(lesson.groups)}">${lesson.groups.map((count) => `<div class="pebble-tray">${Array.from({ length: count }, () => `<i class="pebble ${++ordinal > total - (lesson.removed || 0) ? "removed" : ""}"></i>`).join("")}</div>`).join("")}</div><p class="equation">${lesson.equation}</p>`;
    }
    const labels = { sun: c.phone.sunArt, map: c.phone.mapArt, cap: c.phone.capArt, sprout: c.phone.sproutArt };
    return `<div class="lesson-art" role="img" aria-label="${labels[lesson.art]}"><span class="${lesson.art}"></span></div>`;
}

function renderPhone()
{
    const lesson = currentLesson();
    const long = lesson.words?.length > 8;
    $(".hero-stage").classList.toggle("long-lesson", Boolean(long));
    $("#lesson-preview").innerHTML = `
        <div class="phone-screen ${long ? "long-read" : ""}">
            <div class="phone-header"><span class="phone-brand">${c.brand}</span><span class="tiny-motif" aria-hidden="true"></span></div>
            <p class="phone-subtitle">${c.phone.subtitle}</p>
            <div class="phone-tabs" role="tablist" aria-label="${c.phone.modes}">${["read", "math"].map((mode) => `<button type="button" role="tab" id="tab-${mode}" aria-controls="lesson-panel" aria-selected="${state.lessonMode === mode}" tabindex="${state.lessonMode === mode ? 0 : -1}" data-mode="${mode}">${c.phone[mode]}</button>`).join("")}</div>
            <div class="lesson-panel" role="tabpanel" id="lesson-panel" aria-labelledby="tab-${state.lessonMode}">
                <p class="progress">${c.ages.includes(state.ageBand) ? state.ageBand : ""}<span>${c.phone.progress(state.lessonIndex)}</span></p>
                ${lessonArt(lesson)}
                ${state.lessonMode === "read" ? `<div class="word-tiles">${lesson.words.map(([word, sound], index) => `<button type="button" class="word-tile" data-word="${index}" aria-label="${c.phone.wordLabel} ${escape(word)}" aria-pressed="false">${escape(word)}</button>`).join("")}</div><div class="sound-row"><p id="word-sound" aria-live="polite">${c.phone.soundDefault}</p><button type="button" class="sound-button" data-speak aria-label="${c.phone.readAloud}">${icon("volume")}</button></div><p class="voice-message" id="voice-message" hidden></p>` : ""}
                <h3 class="lesson-question">${lesson.question}</h3>
                <div class="answers">${lesson.answers.map((answer) => `<button type="button" class="answer" data-answer="${escape(answer)}">${escape(answer)}</button>`).join("")}</div>
                <div id="feedback" class="feedback" aria-live="polite"></div>
                <div id="lesson-action"></div>
            </div>
        </div>`;
}

function resetLesson()
{
    cancelSpeech();
    state.lessonIndex = 0;
    state.feedback = null;
    state.selectedWord = null;
    renderPhone();
}

function renderPath()
{
    const path = c.learning.stages[state.ageBand];
    $("#path-card").innerHTML = `<div class="path-title"><h3>${path.title}</h3><span class="age-label">${state.ageBand}</span></div><div class="path-columns">${path.skills.map((skill, index) => `<article><span class="skill-label skill-${index}">${c.learning.labels[index]}</span><h4>${skill}</h4><span class="path-drawing drawing-${index}" aria-hidden="true"></span></article>`).join("")}</div><div class="path-bottom"><p>${path.hint}</p>${lessonLink(c.learning.try, "text-link")}</div>`;
    $("#next-step").textContent = path.next;
}

function renderDashboard()
{
    const sample = c.parents.samples[state.parentPeriod];
    const total = sample.values.reduce((sum, value) => sum + value, 0);
    const math = total - sample.reading;
    const readingPercent = Math.round(sample.reading / total * 100);
    const labels = [total, sample.reading, math];
    const existing = $("#dashboard-data .metrics");
    if (!existing)
    {
        $("#dashboard-data").innerHTML = `<div class="metrics">${labels.map((value, index) => `<div><strong data-metric="${index}">${value}</strong><span>${c.parents.metrics[index]}</span></div>`).join("")}</div><div class="chart" aria-hidden="true">${sample.values.map((value, index) => `<div class="bar-column"><span class="bar-value" data-chart-value="${index}">${value}</span><div class="bar-space"><span class="bar" data-bar="${index}" style="--bar-height:${value / 16 * 100}%"></span></div><span>${index + 1}</span></div>`).join("")}</div><p class="chart-caption">${c.parents.chart}</p><details class="chart-details"><summary>${c.parents.chart}${icon("plus")}</summary><table><thead><tr>${c.parents.table.map((text) => `<th scope="col">${text}</th>`).join("")}</tr></thead><tbody>${sample.values.map((value, index) => `<tr><th scope="row">${index + 1}</th><td data-table-value="${index}">${value}</td></tr>`).join("")}</tbody></table></details><div class="balance-labels"><span id="reading-balance"></span><span id="math-balance"></span></div><div class="balance" aria-hidden="true"><i id="reading-fill"></i><i></i></div>`;
    }
    labels.forEach((value, index) => $(`[data-metric="${index}"]`).textContent = value);
    sample.values.forEach((value, index) =>
    {
        $(`[data-chart-value="${index}"]`).textContent = value;
        $(`[data-table-value="${index}"]`).textContent = value;
        $(`[data-bar="${index}"]`).style.setProperty("--bar-height", `${value / 16 * 100}%`);
    });
    $("#reading-balance").textContent = `${c.parents.balance[0]} ${c.parents.proportion(sample.reading, readingPercent)}`;
    $("#math-balance").textContent = `${c.parents.balance[1]} ${c.parents.proportion(math, 100 - readingPercent)}`;
    $("#reading-fill").style.width = `${readingPercent}%`;
    $$(".period-controls button").forEach((button) => button.setAttribute("aria-pressed", Number(button.dataset.period) === state.parentPeriod));
    $("#parent-announcement").textContent = c.parents.summary(total);
}

function $$(selector)
{
    return [...document.querySelectorAll(selector)];
}

function planPrice()
{
    return state.billingPeriod ? c.pricing.yearly(c.monthlyPrice * 10) : c.pricing.monthly(c.monthlyPrice);
}

function renderPrice()
{
    $("#family-price").innerHTML = `<p class="price">${planPrice()}</p><p class="price-detail">${state.billingPeriod ? `${c.pricing.equivalent(c.monthlyPrice * 10 / 12)}<br>${c.pricing.included}` : c.pricing.periods[0]}</p>`;
    $$(".billing-controls button").forEach((button) => button.setAttribute("aria-pressed", Number(button.dataset.billing) === state.billingPeriod));
}

function focusLesson()
{
    const first = $("#lesson-preview .word-tile") || $("#lesson-preview .answer");
    first?.focus({ preventScroll: true });
    $("#lesson-preview").scrollIntoView({ block: "center", behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
}

function setMode(mode)
{
    state.lessonMode = mode;
    resetLesson();
}

function answerLesson(answer)
{
    const lesson = currentLesson();
    cancelSpeech();
    if (state.feedback === "correct") return;
    const correct = answer === lesson.correct;
    state.feedback = correct ? "correct" : "hint";
    $("#feedback").className = `feedback ${correct ? "correct" : "hint"}`;
    $("#feedback").innerHTML = `${correct ? icon("check") : ""}<span>${correct ? c.phone.success : lesson.hint}</span>${correct ? '<span class="stars" aria-hidden="true"><i>✦</i><i>✦</i><i>✦</i></span>' : ""}`;
    if (correct)
    {
        $$(".answer").forEach((button) =>
        {
            button.setAttribute("aria-disabled", "true");
            if (button.dataset.answer === answer) button.classList.add("correct-answer");
        });
        if (lesson.successSound && $("#word-sound")) $("#word-sound").textContent = lesson.successSound;
        $("#lesson-action").innerHTML = state.lessonIndex === 0 ? `<button type="button" class="phone-next" data-next>${c.phone.next}${icon("arrow")}</button>` : `<p class="pause-note">${c.phone.pause}</p><button type="button" class="phone-next" data-restart>${c.phone.again}${icon("arrow")}</button>`;
        $("#lesson-action button").focus({ preventScroll: true });
    }
}

function speakWord()
{
    const lesson = currentLesson();
    const word = lesson.words[state.selectedWord ?? 0][0].replace(/[.]/g, "");
    const voice = window.speechSynthesis?.getVoices().find((item) => item.localService && /^en(?:[-_]|$)/i.test(item.lang));
    if (!voice)
    {
        $("#voice-message").textContent = c.phone.noVoice;
        $("#voice-message").hidden = false;
        return;
    }
    cancelSpeech();
    $("#voice-message").hidden = true;
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.voice = voice;
    utterance.lang = voice.lang;
    utterance.rate = 0.8;
    window.speechSynthesis.speak(utterance);
}

let routineOpener;
let routineFields;
function openRoutine(opener)
{
    routineOpener = opener;
    state.routineOpen = true;
    routineFields = { age: state.ageBand, preference: "2", duration: String(c.sessionMinutes) };
    renderRoutine();
    $("#routine-dialog").showModal();
    document.body.classList.add("modal-open");
    $("#routine-age").focus();
}

function closeRoutine()
{
    $("#routine-dialog").close();
}

function renderRoutine()
{
    $("#routine-dialog").innerHTML = `<div class="dialog-header"><div><p class="eyebrow">${c.routine.eyebrow}</p><h2 id="routine-title">${c.routine.heading}</h2></div><button type="button" class="close-dialog" data-close-routine aria-label="${c.routine.close}">${icon("close")}<span class="sr-only">${c.routine.close}</span></button></div><form id="routine-form"><label class="field-label" for="routine-age">${c.routine.age}</label><select id="routine-age" name="age">${c.ages.map((age) => `<option ${age === routineFields.age ? "selected" : ""}>${age}</option>`).join("")}</select><fieldset class="routine-preferences"><legend>${c.routine.preference}</legend>${c.routine.preferences.map((label, index) => `<label><input type="radio" name="preference" value="${index}" ${String(index) === routineFields.preference ? "checked" : ""}>${label}</label>`).join("")}</fieldset><label class="field-label" for="routine-duration">${c.routine.duration}</label><select id="routine-duration" name="duration">${[...new Set(c.routine.durations)].map((value) => `<option value="${value}" ${String(value) === routineFields.duration ? "selected" : ""}>${c.routine.minutes(value)}</option>`).join("")}</select><p class="routine-plan">${c.routine.plan}: <strong>${c.pricing.family} · ${planPrice()}</strong></p><button type="submit" class="button">${c.routine.submit}${icon("arrow")}</button></form><div id="routine-result" hidden tabindex="-1"></div><p class="sample-note">${c.routine.note}</p>`;
}

function showRoutine(event)
{
    event.preventDefault();
    const values = new FormData(event.target);
    routineFields = { age: values.get("age"), preference: values.get("preference"), duration: values.get("duration") };
    const duration = Number(routineFields.duration);
    const both = routineFields.preference === "2";
    const reading = both ? Math.floor(duration * 0.4) : routineFields.preference === "0" ? duration - 2 : 0;
    const math = both ? Math.floor(duration * 0.4) : routineFields.preference === "1" ? duration - 2 : 0;
    $("#routine-form").hidden = true;
    $("#routine-result").hidden = false;
    $("#routine-result").innerHTML = `<h3>${c.routine.success}</h3><p>${c.routine.result(reading, math, duration - reading - math)}</p><p><strong>${c.routine.idea} · ${routineFields.age}</strong><br>${c.learning.stages[routineFields.age].skills[2]}.</p><p>${c.pricing.family} · ${planPrice()}</p><button type="button" class="button secondary" data-adjust>${c.routine.adjust}${icon("arrow")}</button>`;
    $("#routine-result").focus();
}

function setMenu(open)
{
    state.menuOpen = open;
    $(".menu-button").setAttribute("aria-expanded", String(open));
    $("#mobile-navigation").hidden = !open;
}

document.addEventListener("change", (event) =>
{
    if (event.target.matches("[data-age]"))
    {
        state.ageBand = event.target.value;
        $$("[data-age]").forEach((radio) => radio.checked = radio.value === state.ageBand);
        resetLesson();
        renderPath();
    }
});

document.addEventListener("click", (event) =>
{
    const target = event.target.closest("button,a");
    if (!target) return;
    if (target.matches("[data-focus-lesson]"))
    {
        event.preventDefault();
        history.replaceState(null, "", c.links.lesson);
        focusLesson();
    }
    if (target.matches("[data-mode]"))
    {
        setMode(target.dataset.mode);
        $(`#tab-${state.lessonMode}`).focus({ preventScroll: true });
    }
    if (target.matches("[data-mode-link]"))
    {
        setMode(target.dataset.modeLink);
        focusLesson();
    }
    if (target.matches("[data-word]"))
    {
        cancelSpeech();
        state.selectedWord = Number(target.dataset.word);
        $$(".word-tile").forEach((tile) => tile.setAttribute("aria-pressed", tile === target));
        $("#word-sound").textContent = currentLesson().words[state.selectedWord][1];
    }
    if (target.matches("[data-answer]")) answerLesson(target.dataset.answer);
    if (target.matches("[data-next]"))
    {
        cancelSpeech();
        state.lessonIndex = 1;
        state.feedback = null;
        state.selectedWord = null;
        renderPhone();
        ($("#lesson-preview .word-tile") || $("#lesson-preview .answer")).focus({ preventScroll: true });
    }
    if (target.matches("[data-restart]"))
    {
        resetLesson();
        focusLesson();
    }
    if (target.matches("[data-speak]")) speakWord();
    if (target.matches("[data-period]"))
    {
        state.parentPeriod = Number(target.dataset.period);
        renderDashboard();
    }
    if (target.matches("[data-billing]"))
    {
        state.billingPeriod = Number(target.dataset.billing);
        renderPrice();
    }
    if (target.matches("[data-open-routine]")) openRoutine(target);
    if (target.matches("[data-close-routine]")) closeRoutine();
    if (target.matches("[data-adjust]"))
    {
        renderRoutine();
        $("#routine-age").focus();
    }
    if (target.matches(".menu-button")) setMenu(!state.menuOpen);
    if (target.closest("#mobile-navigation")) setMenu(false);
    if (target.matches("[data-memory]")) $("#preview-memory").open = true;
});

document.addEventListener("keydown", (event) =>
{
    if (event.key === "Escape" && state.menuOpen)
    {
        setMenu(false);
        $(".menu-button").focus();
    }
    if (event.target.matches('[role="tab"]') && ["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key))
    {
        event.preventDefault();
        setMode(event.key === "Home" ? "read" : event.key === "End" ? "math" : state.lessonMode === "read" ? "math" : "read");
        $(`#tab-${state.lessonMode}`).focus({ preventScroll: true });
    }
    if (state.routineOpen && event.key === "Tab")
    {
        const controls = [...$("#routine-dialog").querySelectorAll("button,select,input,a[href]")].filter((element) => element.getClientRects().length && !element.disabled);
        const first = controls[0];
        const last = controls.at(-1);
        if (event.shiftKey && (document.activeElement === first || document.activeElement === $("#routine-result")))
        {
            event.preventDefault();
            last.focus();
        }
        else if (!event.shiftKey && document.activeElement === last)
        {
            event.preventDefault();
            first.focus();
        }
    }
});

$("#routine-dialog").addEventListener("close", () =>
{
    state.routineOpen = false;
    routineFields = null;
    document.body.classList.remove("modal-open");
    $("#routine-dialog").innerHTML = "";
    routineOpener?.focus({ preventScroll: true });
});
document.addEventListener("submit", (event) =>
{
    if (event.target.id === "routine-form") showRoutine(event);
});
window.addEventListener("pagehide", cancelSpeech);
document.addEventListener("visibilitychange", () =>
{
    document.body.classList.toggle("document-hidden", document.hidden);
    if (document.hidden) cancelSpeech();
});

renderPhone();
renderPath();
renderDashboard();
renderPrice();
if ("IntersectionObserver" in window)
{
    const observer = new IntersectionObserver((entries) =>
    {
        entries.forEach((entry) =>
        {
            if (entry.target.matches(".float")) entry.target.classList.toggle("offscreen", !entry.isIntersecting);
            else if (entry.isIntersecting)
            {
                entry.target.classList.add("revealed");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.08 });
    $$(".section-gap,.learning,.float").forEach((section) => observer.observe(section));
}
