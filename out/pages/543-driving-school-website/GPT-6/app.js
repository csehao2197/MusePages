import { content as c } from "./content.js";
import { icons } from "./icons.js";

const text = c.copy;
const escape = (value) => String(value).replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]);
const icon = (name) => icons[name];
const photo = (image, extra = "") => `<img src="./images/${image.file}" alt="${escape(image.alt)}" ${extra}>`;
const brand = () => `<span class="logomark">${icon("Car")}</span><span class="brand-name">${escape(c.brand)}</span>`;
const heading = (eyebrow, title, intro = "") => `<div class="section-heading"><p class="eyebrow">${eyebrow}</p><h2>${title}</h2>${intro ? `<p>${intro}</p>` : ""}</div>`;
const divider = () => `<div class="road-divider" aria-hidden="true"><svg width="100%" height="40"><line x1="-120" y1="20" x2="2000" y2="20" stroke="#CDD3E0" stroke-width="3" stroke-dasharray="26 34"/></svg></div>`;
const nav = c.nav.map(([label, id]) => `<a href="#${id}">${label}</a>`).join("");
document.querySelector(".skip").textContent = text.skip;

document.querySelector("#site").innerHTML = `
    <header>
        <div class="shell header-row">
            <a class="brand" href="#main" aria-label="${escape(c.brand)} ${text.home}">${brand()}</a>
            <nav aria-label="${text.mainNav}">${nav}</nav>
            <a class="button navy header-book" href="#booking">${text.book} ${icon("ArrowRight")}</a>
        </div>
    </header>
    <main id="main">
        <section class="hero">
            <div class="shell hero-grid">
                <div class="hero-copy">
                    <p class="badge">${icon("MapPin")}${text.heroBadge}</p>
                    <h1>${text.heroLines[0]}<br><span>${text.heroLines[1]}</span></h1>
                    <p class="hero-intro">${text.teach} ${c.audience}.</p>
                    <p class="promise">${c.promise}</p>
                    <p class="hero-ending">${text.heroEnding}</p>
                    <div class="hero-actions"><a class="button yellow" href="#booking">${text.heroPrimary}${icon("ArrowRight")}</a><a class="button outline" href="#quiz">${text.heroSecondary}</a></div>
                    <div class="proof">${icon("Star")}<span>${text.proof}</span></div>
                    <p class="small">${text.proofNote}</p>
                </div>
                <div class="hero-art">
                    <div class="car-frame">${photo(c.images.hero, 'fetchpriority="high"')}<span class="car-label">${icon("Car")} ${text.carLabel}</span></div>
                    <svg class="hero-route" aria-hidden="true" viewBox="0 0 560 130"><path d="M555 30H220Q155 30 155 85T75 115H25" fill="none" stroke="#FFC72C" stroke-width="3" stroke-dasharray="26 34"/><path d="m38 102-15 13 15 13" fill="none" stroke="#1E3A6E" stroke-width="3"/></svg>
                    <p class="photo-note"><span>${text.photoEyebrow}</span>${text.photoNote}</p>
                </div>
            </div>
        </section>
        ${divider()}
        <section id="packages" class="section shell">
            ${heading(text.packageEyebrow, text.packageTitle, text.packageIntro)}
            <div class="packages-grid">
                ${c.packages.map((p, i) => `<article class="package-card ${p.popular ? "popular" : ""} reveal">
                    ${p.popular ? `<span class="popular-tag">${text.popular}</span>` : `<span class="package-number">0${i + 1}</span>`}
                    <h3>${p.name}</h3><p class="price">${p.price}<span> · ${p.lessons}</span></p><p class="package-description">${p.description}</p>
                    <ul>${p.features.map((f) => `<li>${icon("Check")}<span>${f}</span></li>`).join("")}</ul>
                    <a href="#booking" class="package-link" data-package="${escape(p.name)}">${text.packageLink}${icon("ArrowRight")}</a>
                </article>`).join("")}
            </div>
            <div class="cockpit-strip reveal">${photo(c.images.cockpit, 'loading="lazy"')}<div><h3>${text.cockpitTitle}</h3><p>${text.cockpitText}</p></div><span class="strip-icon">${icon("Car")}</span></div>
        </section>
        <section id="quiz" class="section quiz-band">
            <div class="shell">${heading(text.quizEyebrow, text.quizTitle, text.quizIntro)}<div id="quiz-panel" class="quiz-panel" tabindex="-1"></div></div>
        </section>
        <section id="instructors" class="section shell">
            ${heading(text.coachEyebrow, text.coachTitle)}
            <div class="coaches-grid">${c.instructors.map((p) => `<article class="coach-card reveal"><img src="./images/${p.image}" alt="${escape(p.alt)}" loading="lazy"><div class="coach-copy"><h3>${p.name}</h3><p class="role">${p.role}</p><p>${p.line}</p><span class="badge">${icon("Award")}${p.years}</span></div></article>`).join("")}</div>
            <p class="small coach-note">${text.coachNote}</p>
        </section>
        ${divider()}
        <section id="tips" class="section tips-section">
            <div class="shell tips-grid">
                <div>${heading(text.tipsEyebrow, text.tipsTitle)}
                    <ol class="tips-list"><svg class="tip-route" width="3" height="100%" aria-hidden="true"><line x1="1.5" y1="24" x2="1.5" y2="100%" stroke="#CDD3E0" stroke-width="3" stroke-dasharray="26 34"/></svg>${c.tips.map((tip, i) => `<li class="reveal"><span class="tip-number">${String(i + 1).padStart(2, "0")}</span><p>${tip}</p></li>`).join("")}</ol>
                </div>
                <aside id="areas" class="areas-card reveal"><div class="area-icon">${icon("MapPin")}</div>${heading(text.areasEyebrow, text.areasTitle)}<div class="area-chips">${c.areas.map((area) => `<span>${area}</span>`).join("")}</div><p>${text.areasText}</p>${photo(c.images.curb, 'loading="lazy"')}</aside>
            </div>
        </section>
        <section id="booking" class="section booking-band">
            <div class="shell">${heading(text.bookingEyebrow, text.bookingTitle, text.bookingIntro)}
                <div class="booking-card">
                    <form id="booking-form" novalidate>
                        <fieldset><legend>${text.dayLabel}</legend><div class="chips">${c.days.map((d) => `<button type="button" data-day="${d}" aria-pressed="false">${d}</button>`).join("")}</div></fieldset>
                        <fieldset><legend>${text.slotLabel}</legend><div class="chips slots">${c.slots.map((s) => `<button type="button" data-slot="${s}" aria-pressed="false">${s}</button>`).join("")}</div></fieldset>
                        <p class="error" id="day-error" aria-live="polite"></p>
                        <label for="package">${text.packageLabel}</label><select id="package" name="package">${[text.undecided, ...c.packages.map((p) => p.name)].map((p) => `<option>${p}</option>`).join("")}</select>
                        <div class="input-row"><div><label for="name">${text.nameLabel}</label><input id="name" name="name" autocomplete="name" maxlength="100" placeholder="${text.namePlaceholder}" aria-describedby="name-error"><p class="error" id="name-error" aria-live="polite"></p></div><div><label for="email">${text.emailLabel}</label><input id="email" name="email" type="email" autocomplete="email" maxlength="254" placeholder="${text.emailPlaceholder}" aria-describedby="email-error"><p class="error" id="email-error" aria-live="polite"></p></div></div>
                        <button class="button yellow hold-button" type="submit">${text.hold}${icon("CalendarCheck")}</button><p class="small local-note">${text.privacy}</p>
                    </form>
                    <div id="confirmation" hidden aria-live="polite"></div>
                </div><p class="booking-note">${icon("Check")}${text.quiet}</p>
            </div>
        </section>
        <section class="section shell faq-section">
            ${heading(text.faqEyebrow, text.faqTitle)}
            <div class="faq-list">${c.faq.map(([q, a]) => `<details><summary>${q}${icon("ChevronDown")}</summary><p>${a}</p></details>`).join("")}</div>
        </section>
    </main>
    <footer><div class="shell"><div class="footer-top"><div><a class="brand" href="#main">${brand()}</a><p>${c.promise}</p></div><nav aria-label="${text.footerNav}">${nav}<a href="#booking">${text.footerBook}</a></nav></div><div class="footer-bottom"><p>${text.footerArea}</p><p>${text.fictional}</p><a href="${c.credit}" target="_blank" rel="noopener">${text.credit} ${icon("ArrowRight")}</a></div></div></footer>
`;

const quizPanel = document.querySelector("#quiz-panel");
let quiz = { phase: "intro", index: 0, answers: [] };
function renderQuiz(focus = false)
{
    if (quiz.phase === "intro")
    {
        quizPanel.innerHTML = `<div class="quiz-intro"><span class="quiz-symbol">${icon("Car")}</span><p class="eyebrow">${text.quizDuration}</p><h3>${text.quizStartTitle}</h3><p>${text.quizStartText}</p><button class="button navy" id="start-quiz">${text.quizStart}${icon("ArrowRight")}</button></div>`;
        document.querySelector("#start-quiz").onclick = () =>
        {
            quiz.phase = "question";
            renderQuiz(true);
        };
    }
    else if (quiz.phase === "results")
    {
        const score = quiz.answers.filter((a, i) => a === c.questions[i].correct).length;
        quizPanel.innerHTML = `<div class="quiz-results"><div class="score-dial" style="--score:${score * 20}%">${score}<small>/ 5</small></div><h3>${text.scoreTitle.replace("{n}", score)}</h3><p>${c.tiers[score]}</p><div class="recap" aria-label="${score} ${text.correctAnswers}">${quiz.answers.map((a, i) => `<span class="${a === c.questions[i].correct ? "right-dot" : "wrong-dot"}" aria-label="${text.question} ${i + 1}: ${a === c.questions[i].correct ? text.correct : text.incorrect}">${icon(a === c.questions[i].correct ? "Check" : "X")}</span>`).join("")}</div><button class="button navy" id="retake">${icon("RotateCcw")}${text.retake}</button><p class="small">${text.scoreNote}</p></div>`;
        document.querySelector("#retake").onclick = () =>
        {
            quiz = { phase: "intro", index: 0, answers: [] };
            renderQuiz(true);
        };
    }
    else
    {
        const question = c.questions[quiz.index];
        const answer = quiz.answers[quiz.index];
        const locked = answer !== undefined;
        const correct = answer === question.correct;
        quizPanel.innerHTML = `<div class="quiz-progress"><div class="progress-dots" aria-hidden="true">${c.questions.map((_, i) => `<span class="${i <= quiz.index ? "active" : ""}"></span>`).join("")}</div><span>${text.questionCounter.replace("{n}", quiz.index + 1)}</span></div><h3>${question.question}</h3><div class="answers">${question.options.map((option, i) => `<button class="answer ${locked && i === answer ? (correct ? "correct" : "wrong") : locked && i === question.correct ? "revealed" : ""}" data-answer="${i}" ${locked ? "disabled" : ""}><span class="letter">${"ABCD"[i]}</span><span>${option}</span>${locked && i === answer ? icon(correct ? "Check" : "X") : ""}</button>`).join("")}</div><div class="feedback" aria-live="polite">${locked ? `<p>${correct ? text.right : text.wrong} ${question.explanation}</p><button class="button navy" id="next-question">${quiz.index === 4 ? text.results : text.next}${icon("ArrowRight")}</button>` : ""}</div>`;
        quizPanel.querySelectorAll("[data-answer]").forEach((button) =>
        {
            button.onclick = () =>
            {
                if (quiz.answers[quiz.index] !== undefined) return;
                quiz.answers[quiz.index] = Number(button.dataset.answer);
                renderQuiz();
                document.querySelector("#next-question").focus({ preventScroll: true });
            };
        });
        if (locked)
        {
            document.querySelector("#next-question").onclick = () =>
            {
                if (quiz.index === 4) quiz.phase = "results";
                else quiz.index += 1;
                renderQuiz(true);
            };
        }
    }
    if (focus) quizPanel.focus({ preventScroll: true });
}
renderQuiz();

const key = `${c.slug}-lesson-request`;
const form = document.querySelector("#booking-form");
const confirmation = document.querySelector("#confirmation");
const packageSelect = document.querySelector("#package");
let selection = { day: "", slot: "" };
let request = null;
function validRequest(value)
{
    return value && typeof value === "object" && c.days.includes(value.day) && c.slots.includes(value.slot) &&
        [text.undecided, ...c.packages.map((p) => p.name)].includes(value.package) &&
        typeof value.name === "string" && value.name.trim().length > 0 && value.name.length <= 100 &&
        typeof value.email === "string" && value.email.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.email);
}
function updateChips()
{
    document.querySelectorAll("[data-day]").forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.day === selection.day)));
    document.querySelectorAll("[data-slot]").forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.slot === selection.slot)));
}
function showConfirmation(saved = true)
{
    form.hidden = true;
    confirmation.hidden = false;
    confirmation.innerHTML = `<span class="confirmation-icon">${icon("CalendarCheck")}</span><h3>${text.held} — ${escape(request.day)} at ${escape(request.slot)} · ${escape(request.package)}.</h3><p>${text.heldText}</p>${saved ? "" : `<p class="error">${text.storageError}</p>`}<button type="button" class="button outline" id="change-request">${text.change}</button>`;
    document.querySelector("#change-request").onclick = editRequest;
}
function editRequest()
{
    form.hidden = false;
    confirmation.hidden = true;
    if (request)
    {
        selection = { day: request.day, slot: request.slot };
        packageSelect.value = request.package;
        form.elements.name.value = request.name;
        form.elements.email.value = request.email;
        updateChips();
    }
}
try
{
    const restored = JSON.parse(localStorage.getItem(key));
    if (validRequest(restored))
    {
        request = restored;
        showConfirmation();
    }
}
catch
{
    // Storage may be disabled or contain an interrupted/malformed previous request.
}
document.querySelectorAll("[data-day]").forEach((button) => button.onclick = () =>
{
    selection.day = button.dataset.day;
    updateChips();
});
document.querySelectorAll("[data-slot]").forEach((button) => button.onclick = () =>
{
    selection.slot = button.dataset.slot;
    updateChips();
});
document.querySelectorAll("[data-package]").forEach((link) => link.onclick = () =>
{
    editRequest();
    packageSelect.value = link.dataset.package;
});
form.addEventListener("submit", (event) =>
{
    event.preventDefault();
    const name = form.elements.name.value.trim();
    const email = form.elements.email.value.trim();
    const nameValid = name.length > 0;
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    document.querySelector("#name-error").textContent = nameValid ? "" : text.nameError;
    document.querySelector("#email-error").textContent = emailValid ? "" : text.emailError;
    document.querySelector("#day-error").textContent = selection.day && selection.slot ? "" : text.dayError;
    form.elements.name.setAttribute("aria-invalid", String(!nameValid));
    form.elements.email.setAttribute("aria-invalid", String(!emailValid));
    if (!nameValid || !emailValid || !selection.day || !selection.slot)
    {
        if (!nameValid) form.elements.name.focus();
        else if (!emailValid) form.elements.email.focus();
        else document.querySelector("[data-day]").focus();
        return;
    }
    request = { ...selection, package: packageSelect.value, name, email };
    let saved = true;
    try
    {
        localStorage.setItem(key, JSON.stringify(request));
    }
    catch
    {
        saved = false;
    }
    showConfirmation(saved);
});

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
if (!reducedMotion.matches && "IntersectionObserver" in window)
{
    const observer = new IntersectionObserver((entries) =>
    {
        for (const entry of entries)
        {
            if (entry.isIntersecting)
            {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
            }
        }
    }, { threshold: 0.08 });
    document.querySelectorAll(".reveal").forEach((element, index) =>
    {
        element.style.setProperty("--delay", `${index % 4 * 60}ms`);
        element.classList.add("will-reveal");
        observer.observe(element);
    });
}
