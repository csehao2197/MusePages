import { content as c } from "./content.js";
import { courseCards, scheduleRows, quizStart, escape, icon } from "./templates.js";

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const quizKey = "cedar-verb-latest-quiz";
const draftKey = "cedar-verb-enrollment-draft";
let language = "Spanish";
let level = c.ui.all;
let format = "In person";
let quizLanguage = "";
let answers = [];
let questionIndex = 0;
let result = null;
let savedResult = false;
const form = $("#enrollment-form");
const fields = Object.keys(c.enrollment.labels);

function read(key)
{
    try
    {
        return JSON.parse(localStorage.getItem(key));
    }
    catch
    {
        return null;
    }
}

function save(key, value)
{
    try
    {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    }
    catch
    {
        return false;
    }
}

function focusHeading(selector)
{
    $(selector)?.focus({ preventScroll: true });
}

function go(id)
{
    document.getElementById(id).scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth", block: "start" });
}

function updateCourses()
{
    $$("[data-language]").forEach((button) =>
    {
        const active = button.dataset.language === language;
        button.setAttribute("aria-pressed", String(active));
        button.classList.toggle("active", active);
    });
    $$("[data-level]").forEach((button) =>
    {
        const active = button.dataset.level === level;
        button.setAttribute("aria-pressed", String(active));
        button.classList.toggle("active", active);
    });
    $("#course-results").innerHTML = courseCards(language, level);
    $("#course-results").classList.remove("changed");
    requestAnimationFrame(() => $("#course-results").classList.add("changed"));
}

function availableSchedules()
{
    const selectedLanguage = form.elements.language.value;
    const selectedLevel = form.elements.level.value;
    return c.courses.filter((course) => course.language === selectedLanguage && course.level === selectedLevel);
}

function updateSchedules(preserve = "")
{
    const courses = availableSchedules();
    const select = form.elements.schedule;
    select.innerHTML = `<option value="">${c.enrollment.choose}</option>${courses.length ? courses.map((course) => `<option value="${course.id}">${course.title} · ${course.days} ${course.time} PT · ${c.price}</option>`).join("") : `<option value="teacher-advice">${c.enrollment.advisory}</option>`}`;
    if ([...select.options].some((option) => option.value === preserve)) select.value = preserve;
}

function draft()
{
    return Object.fromEntries(fields.map((field) => [field, form.elements[field].value]));
}

function saveDraft()
{
    if (!save(draftKey, draft())) $("#enroll-status").textContent = c.enrollment.draftError;
}

function openForm()
{
    form.hidden = false;
    $("#enrollment-success").hidden = true;
}

function enroll(course, requestedLanguage, requestedLevel)
{
    openForm();
    form.elements.language.value = course?.language || requestedLanguage;
    form.elements.level.value = course?.level || requestedLevel;
    updateSchedules(course?.id || "teacher-advice");
    form.elements.format.value = format;
    $("#enroll-status").textContent = course ? c.enrollment.preselected(course.title) : c.enrollment.unlisted(requestedLanguage, requestedLevel);
    saveDraft();
    go("enroll");
    focusHeading("#enroll-name");
}

function question()
{
    const [text, choices, correct] = c.banks[quizLanguage][questionIndex];
    const offset = questionIndex % 4;
    const arranged = choices.map((choice, index) => ({ choice, index })).slice(offset).concat(choices.map((choice, index) => ({ choice, index })).slice(0, offset));
    $("#quiz-panel").innerHTML = `<div class="quiz-progress"><span>${quizLanguage}</span><span>${c.quiz.counter(questionIndex + 1)}</span></div><div class="progress-track" role="progressbar" aria-label="${c.quiz.counter(questionIndex + 1)}" aria-valuemin="0" aria-valuemax="10" aria-valuenow="${questionIndex + 1}"><span style="width:${(questionIndex + 1) * 10}%"></span></div><fieldset class="question-fieldset"><legend><h3 id="quiz-question" tabindex="-1">${escape(text)}</h3></legend><div class="answer-grid">${arranged.map(({ choice, index }, i) => `<label class="answer ${answers[questionIndex] === index ? "selected" : ""}"><input type="radio" name="answer" value="${index}" ${answers[questionIndex] === index ? "checked" : ""}><span class="answer-letter">${"ABCD"[i]}</span><span>${escape(choice)}</span></label>`).join("")}</div></fieldset><div class="quiz-controls"><button id="quiz-back" class="button outline">${icon("ArrowLeft")}${c.quiz.back}</button><button id="quiz-next" class="button primary" ${answers[questionIndex] === undefined ? "disabled" : ""}>${questionIndex === 9 ? c.quiz.finish : c.quiz.next}${icon("ArrowRight")}</button></div>`;
    $("#quiz-panel").classList.remove("changed");
    requestAnimationFrame(() => $("#quiz-panel").classList.add("changed"));
    focusHeading("#quiz-question");
}

function recommendedLevel(score)
{
    return score <= 2 ? "A1" : score <= 5 ? "A2" : score <= 8 ? "B1" : "B2";
}

function showResult()
{
    const hasCourse = c.courses.some((course) => course.language === result.language && course.level === result.level);
    $("#quiz-panel").innerHTML = `<div class="result-panel"><span class="result-symbol">${icon("Check")}</span><p class="eyebrow">${result.language} · ${c.quiz.score(result.score)}</p><h3 id="quiz-result" tabindex="-1">${c.quiz.result(result.level)}</h3><p>${c.quiz.explanations[result.level]}</p><p class="quiet">${c.quiz.englishNote}</p>${hasCourse ? "" : `<p class="unlisted-note">${c.quiz.noCourse(result.language, result.level)}</p>`}<div class="result-actions"><button class="button primary" id="quiz-matching">${c.quiz.matching}${icon("ArrowRight")}</button><button class="button outline" id="quiz-enroll">${c.quiz.enroll}</button><button class="text-button" id="quiz-retake">${c.quiz.retake}</button></div><p class="quiet" role="status">${savedResult ? c.quiz.saved : c.quiz.notSaved}</p></div>`;
    $("#quiz-panel").setAttribute("aria-live", "polite");
    focusHeading("#quiz-result");
}

$("#menu-toggle").addEventListener("click", () =>
{
    const expanded = $("#menu-toggle").getAttribute("aria-expanded") === "true";
    $("#menu-toggle").setAttribute("aria-expanded", String(!expanded));
    $("#mobile-nav").hidden = expanded;
    $("#menu-toggle span").textContent = expanded ? c.ui.menu : c.ui.close;
});

function closeMenu()
{
    $("#menu-toggle").setAttribute("aria-expanded", "false");
    $("#mobile-nav").hidden = true;
    $("#menu-toggle span").textContent = c.ui.menu;
}

$("#mobile-nav").addEventListener("click", (event) =>
{
    if (event.target.closest("a")) closeMenu();
});
document.addEventListener("keydown", (event) =>
{
    if (event.key === "Escape" && !$("#mobile-nav").hidden)
    {
        closeMenu();
        $("#menu-toggle").focus();
    }
});

document.addEventListener("click", (event) =>
{
    const button = event.target.closest("button");
    if (!button) return;
    if (button.dataset.language)
    {
        language = button.dataset.language;
        updateCourses();
    }
    if (button.dataset.level)
    {
        level = button.dataset.level;
        updateCourses();
    }
    if (button.hasAttribute("data-clear"))
    {
        level = c.ui.all;
        updateCourses();
        $("#language-filters button.active").focus();
    }
    if (button.dataset.enroll) enroll(c.courses.find((course) => course.id === button.dataset.enroll));
    if (button.dataset.format)
    {
        format = button.dataset.format;
        $$("[data-format]").forEach((tab) =>
        {
            const active = tab === button;
            tab.setAttribute("aria-selected", String(active));
            tab.tabIndex = active ? 0 : -1;
        });
        $("#schedule-table").setAttribute("aria-labelledby", button.id);
        $("#schedule-rows").innerHTML = scheduleRows(format);
    }
    if (button.id === "schedule-enroll") enroll(c.courses[0]);
    if (button.id === "quiz-start")
    {
        quizLanguage = $("#quiz-language").value;
        if (!c.languages.includes(quizLanguage)) return;
        answers = [];
        questionIndex = 0;
        $("#quiz-panel").removeAttribute("aria-live");
        question();
    }
    if (button.id === "quiz-back")
    {
        if (questionIndex === 0)
        {
            $("#quiz-panel").innerHTML = quizStart();
            $("#quiz-language").value = quizLanguage;
            $("#quiz-start").disabled = false;
            $("#quiz-language").focus();
        }
        else
        {
            questionIndex--;
            question();
        }
    }
    if (button.id === "quiz-next" && answers[questionIndex] !== undefined)
    {
        if (questionIndex < 9)
        {
            questionIndex++;
            question();
        }
        else
        {
            const score = answers.reduce((total, answer, index) => total + Number(answer === c.banks[quizLanguage][index][2]), 0);
            result = { language: quizLanguage, answers: [...answers], score, level: recommendedLevel(score) };
            savedResult = save(quizKey, result);
            showResult();
        }
    }
    if (button.id === "quiz-matching")
    {
        language = result.language;
        level = result.level;
        updateCourses();
        go("courses");
        focusHeading("#language-filters button.active");
    }
    if (button.id === "quiz-enroll")
    {
        enroll(c.courses.find((course) => course.language === result.language && course.level === result.level), result.language, result.level);
    }
    if (button.id === "quiz-retake")
    {
        $("#quiz-panel").removeAttribute("aria-live");
        $("#quiz-panel").innerHTML = quizStart();
        $("#quiz-language").focus();
    }
    if (button.id === "edit-request")
    {
        openForm();
        form.elements.name.focus();
    }
    if (button.id === "reset-request")
    {
        openForm();
        form.reset();
        updateSchedules();
        $("#enroll-status").textContent = "";
        fields.forEach((field) =>
        {
            if ($(`#error-${field}`)) $(`#error-${field}`).textContent = "";
            form.elements[field].removeAttribute("aria-invalid");
        });
        saveDraft();
        form.elements.name.focus();
    }
});

$("#quiz-panel").addEventListener("change", (event) =>
{
    if (event.target.id === "quiz-language") $("#quiz-start").disabled = !event.target.value;
    if (event.target.name === "answer")
    {
        answers[questionIndex] = Number(event.target.value);
        $$(".answer").forEach((label) => label.classList.toggle("selected", label.querySelector("input").checked));
        $("#quiz-next").disabled = false;
    }
});

$(".schedule-tabs").addEventListener("keydown", (event) =>
{
    if (!["ArrowRight", "ArrowLeft", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const tabs = $$("[data-format]");
    const index = tabs.indexOf(event.target);
    const next = event.key === "Home" ? 0 : event.key === "End" ? tabs.length - 1 : (index + (event.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length;
    tabs[next].click();
    tabs[next].focus();
});

form.addEventListener("input", saveDraft);
form.addEventListener("change", (event) =>
{
    if (["language", "level"].includes(event.target.name)) updateSchedules();
    saveDraft();
});
form.addEventListener("submit", (event) =>
{
    event.preventDefault();
    let firstError = null;
    const values = draft();
    for (const field of ["name", "email", "language", "level", "schedule", "format"])
    {
        let valid = values[field].trim().length > 0;
        if (field === "email") valid = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email.trim());
        if (field === "language") valid = c.languages.includes(values.language);
        if (field === "level") valid = c.levels.includes(values.level);
        if (field === "format") valid = c.schedule.formats.includes(values.format);
        if (field === "schedule") valid = [...form.elements.schedule.options].some((option) => option.value === values.schedule && option.value);
        $(`#error-${field}`).textContent = valid ? "" : c.enrollment.errors[field];
        form.elements[field].setAttribute("aria-invalid", String(!valid));
        if (!valid && !firstError) firstError = form.elements[field];
    }
    if (firstError)
    {
        firstError.focus();
        return;
    }
    if (!save(draftKey, { ...values, submitted: true }))
    {
        $("#enroll-status").textContent = c.enrollment.storageError;
        return;
    }
    showConfirmation(values);
});

function showConfirmation(values)
{
    form.hidden = true;
    const firstName = values.name.trim().split(/\s+/)[0];
    $("#enroll-status").textContent = "";
    $("#enrollment-success").hidden = false;
    $("#enrollment-success").innerHTML = `<div class="confirmation"><span class="result-symbol">${icon("Check")}</span><h3 id="confirmation-heading" tabindex="-1">${escape(c.enrollment.success(firstName))}</h3><p>${c.enrollment.successBody}</p><dl><div><dt>${c.enrollment.labels.language}</dt><dd>${escape(values.language)} · ${escape(values.level)}</dd></div><div><dt>${c.enrollment.labels.schedule}</dt><dd>${escape(c.courses.find((course) => course.id === values.schedule)?.title || c.enrollment.advisory)}</dd></div><div><dt>${c.enrollment.labels.format}</dt><dd>${escape(values.format)}</dd></div></dl><div class="result-actions"><button id="edit-request" class="button outline">${c.enrollment.edit}</button><button id="reset-request" class="text-button">${c.enrollment.reset}</button></div></div>`;
    focusHeading("#confirmation-heading");
}

const storedDraft = read(draftKey);
if (storedDraft && typeof storedDraft === "object")
{
    fields.forEach((field) =>
    {
        if (typeof storedDraft[field] === "string") form.elements[field].value = storedDraft[field];
    });
    updateSchedules(storedDraft.schedule);
    if (storedDraft.submitted && storedDraft.name && c.languages.includes(storedDraft.language) && c.levels.includes(storedDraft.level) && form.elements.schedule.value && c.schedule.formats.includes(storedDraft.format)) showConfirmation(storedDraft);
}
else updateSchedules();

const storedResult = read(quizKey);
if (storedResult && c.languages.includes(storedResult.language) && Array.isArray(storedResult.answers) && storedResult.answers.length === 10 && storedResult.answers.every((answer) => Number.isInteger(answer) && answer >= 0 && answer < 4))
{
    const score = storedResult.answers.reduce((total, answer, index) => total + Number(answer === c.banks[storedResult.language][index][2]), 0);
    result = { ...storedResult, score, level: recommendedLevel(score) };
    savedResult = true;
    showResult();
}

if ("IntersectionObserver" in window && !matchMedia("(prefers-reduced-motion: reduce)").matches)
{
    const observer = new IntersectionObserver((entries) =>
    {
        entries.forEach((entry) =>
        {
            if (entry.isIntersecting)
            {
                entry.target.classList.add("revealed");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.08 });
    $$(".section-heading, .teacher-card, .method-steps article").forEach((element) => observer.observe(element));
}
