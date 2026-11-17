"use strict";

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const film = $("#film");
const filmToggle = $("#film-toggle");
const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");

function updateFilmControl()
{
    const paused = film.paused;
    filmToggle.setAttribute("aria-label", paused ? "Play background video" : "Pause background video");
    filmToggle.querySelector("use").setAttribute("href", paused ? "#play" : "#pause");
    filmToggle.querySelector("span").textContent = paused ? "Play film" : "Pause film";
}

film.addEventListener("play", updateFilmControl);
film.addEventListener("pause", updateFilmControl);
film.addEventListener("error", () =>
{
    $("#film-status").textContent = "The background film is unavailable. All course features remain available.";
    filmToggle.disabled = true;
    filmToggle.querySelector("span").textContent = "Film unavailable";
});
filmToggle.addEventListener("click", async () =>
{
    if (film.paused)
    {
        try
        {
            await film.play();
            $("#film-status").textContent = "Background film playing.";
        }
        catch
        {
            $("#film-status").textContent = "Your browser could not play the background film.";
        }
    }
    else
    {
        film.pause();
        $("#film-status").textContent = "Background film paused.";
    }
    updateFilmControl();
});
function respectMotionPreference()
{
    if (motionPreference.matches)
    {
        film.autoplay = false;
        film.pause();
    }
    updateFilmControl();
}
motionPreference.addEventListener("change", respectMotionPreference);
respectMotionPreference();

const menuButton = $(".menu-button");
const navigation = $("#navigation");
function closeNavigation(returnFocus = false)
{
    navigation.classList.remove("is-open");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Open navigation");
    if (returnFocus) menuButton.focus();
}
menuButton.addEventListener("click", () =>
{
    const expanded = menuButton.getAttribute("aria-expanded") !== "true";
    menuButton.setAttribute("aria-expanded", String(expanded));
    menuButton.setAttribute("aria-label", expanded ? "Close navigation" : "Open navigation");
    navigation.classList.toggle("is-open", expanded);
});
navigation.addEventListener("click", (event) =>
{
    if (event.target.closest("a, button")) closeNavigation();
});
document.addEventListener("keydown", (event) =>
{
    if (event.key === "Escape" && navigation.classList.contains("is-open")) closeNavigation(true);
});
window.matchMedia("(min-width: 1024px)").addEventListener("change", () => closeNavigation());

let dialogOpener;
let resumeFilm = false;
function openDialog(id, opener)
{
    const dialog = $(`#${id}`);
    dialogOpener = opener;
    resumeFilm = !film.paused;
    film.pause();
    dialog.showModal();
    document.body.classList.add("modal-open");
}
$$("[data-open]").forEach((button) =>
{
    button.addEventListener("click", () => openDialog(button.dataset.open, button));
});
$$("dialog").forEach((dialog) =>
{
    dialog.querySelector(".dialog-close").addEventListener("click", () => dialog.close());
    dialog.addEventListener("keydown", (event) =>
    {
        if (event.key !== "Tab") return;
        const controls = [...dialog.querySelectorAll('a[href], button, input, select, textarea, [tabindex]')]
            .filter((element) => !element.disabled && element.tabIndex >= 0 && element.getClientRects().length);
        const first = controls[0];
        const last = controls.at(-1);
        if (event.shiftKey && document.activeElement === first)
        {
            event.preventDefault();
            last.focus();
        }
        else if (!event.shiftKey && document.activeElement === last)
        {
            event.preventDefault();
            first.focus();
        }
    });
    dialog.addEventListener("click", (event) =>
    {
        const bounds = dialog.getBoundingClientRect();
        if (event.target === dialog && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) dialog.close();
    });
    dialog.addEventListener("close", async () =>
    {
        document.body.classList.remove("modal-open");
        const target = dialogOpener?.getBoundingClientRect().width ? dialogOpener : menuButton;
        target?.focus({ preventScroll: true });
        if (resumeFilm && !motionPreference.matches)
        {
            try
            {
                await film.play();
            }
            catch
            {
                updateFilmControl();
            }
        }
    });
});

const stages =
{
    discover:
    {
        weeks: "WEEKS 01—04",
        title: ["Start with people.", "Not assumptions."],
        description: "Turn a broad problem into a focused opportunity. Practice interviewing, map a journey, and make evidence your most powerful design tool.",
        topics: ["Research questions that reveal real needs", "Journey mapping & opportunity framing", "A research-backed product brief"],
        lesson: "Ask a better question.",
        brief: "A team is building a budgeting app for freelancers. They want to understand why people struggle to track expenses. You have 20 minutes with a potential user.",
        question: "Which question is most likely to reveal a real need?",
        options: ["Would you use an app that tracks your expenses?", "Tell me about the last time you organized your expenses.", "Do you agree that budgeting apps should be simpler?"],
        correct: 1,
        feedback: "Ask for a specific past experience. It reveals actual behavior, workarounds, and constraints without suggesting an answer.",
        hint: "This question leads the participant toward your idea. Try asking about something they have already done instead."
    },
    create:
    {
        weeks: "WEEKS 05—08",
        title: ["Make it useful.", "Then make it feel right."],
        description: "Translate insights into clear interactions. Prototype key journeys, test with people, and create accessible components that work together.",
        topics: ["Interaction patterns & rapid prototyping", "Accessible, reusable component systems", "A tested end-to-end product flow"],
        lesson: "Build beyond the happy path.",
        brief: "Your new checkout button looks great at rest. Now you are defining its behavior for a shared component library.",
        question: "Which specification is the most useful for other designers?",
        options: ["A high-resolution image of the default button", "A unique color for every screen", "Default, hover, focus, loading, and disabled states with usage guidance"],
        correct: 2,
        feedback: "A component is behavior as well as appearance. Complete states and usage guidance make it reusable and accessible.",
        hint: "A visual alone does not explain behavior. Consider keyboard access, loading, and when the component should be used."
    },
    lead:
    {
        weeks: "WEEKS 09—12",
        title: ["Give your ideas", "a way forward."],
        description: "Connect design decisions to outcomes. Build alignment, communicate trade-offs, and tell a compelling story about the impact of your work.",
        topics: ["Product strategy & measurable outcomes", "Stakeholder critique & design storytelling", "A decision-led portfolio case study"],
        lesson: "Tell the story of a decision.",
        brief: "You are presenting a redesigned onboarding flow. The team needs to decide whether to test it with real customers.",
        question: "What makes the strongest case for the next step?",
        options: ["The problem, evidence, trade-offs, and a measurable testing hypothesis", "A tour of every pixel you changed", "The number of hours spent making the prototype"],
        correct: 0,
        feedback: "Make the decision clear. Connect evidence to a hypothesis and an outcome the team can test, rather than claiming unproven impact.",
        hint: "Effort and polish do not establish impact. Explain the problem, your evidence, and what you would measure next."
    }
};

let selectedStage = "discover";
const tabs = $$('[role="tab"]');
function selectStage(stage, focus = false)
{
    selectedStage = stage;
    const data = stages[stage];
    tabs.forEach((tab) =>
    {
        const selected = tab.dataset.stage === stage;
        tab.setAttribute("aria-selected", String(selected));
        tab.tabIndex = selected ? 0 : -1;
        if (selected && focus) tab.focus();
    });
    $("#course-panel").setAttribute("aria-labelledby", `tab-${stage}`);
    $("#course-weeks").textContent = data.weeks;
    $("#course-title").replaceChildren(document.createTextNode(data.title[0]), document.createElement("br"), document.createTextNode(data.title[1]));
    $("#course-description").textContent = data.description;
    $("#course-topics").replaceChildren(...data.topics.map((topic) =>
    {
        const item = document.createElement("li");
        item.textContent = topic;
        return item;
    }));
}
tabs.forEach((tab, index) =>
{
    tab.addEventListener("click", () => selectStage(tab.dataset.stage));
    tab.addEventListener("keydown", (event) =>
    {
        let next;
        if (event.key === "ArrowDown" || event.key === "ArrowRight") next = (index + 1) % tabs.length;
        if (event.key === "ArrowUp" || event.key === "ArrowLeft") next = (index + tabs.length - 1) % tabs.length;
        if (event.key === "Home") next = 0;
        if (event.key === "End") next = tabs.length - 1;
        if (next !== undefined)
        {
            event.preventDefault();
            selectStage(tabs[next].dataset.stage, true);
        }
    });
});
$("#lesson-open").addEventListener("click", (event) =>
{
    const data = stages[selectedStage];
    $("#lesson-meta").textContent = `SAMPLE LESSON · ${selectedStage.toUpperCase()}`;
    $("#lesson-title").textContent = data.lesson;
    $("#lesson-brief").textContent = data.brief;
    $("#lesson-question").textContent = data.question;
    $("#lesson-feedback").textContent = "";
    $("#lesson-options").replaceChildren(...data.options.map((option, index) =>
    {
        const label = document.createElement("label");
        const input = document.createElement("input");
        input.type = "radio";
        input.name = "answer";
        input.value = String(index);
        input.required = true;
        label.append(input, document.createTextNode(option));
        return label;
    }));
    openDialog("lesson", event.currentTarget);
});
$("#lesson-form").addEventListener("submit", (event) =>
{
    event.preventDefault();
    const data = stages[selectedStage];
    const correct = Number(new FormData(event.currentTarget).get("answer")) === data.correct;
    $("#lesson-feedback").textContent = correct ? `Exactly. ${data.feedback}` : `Not quite. ${data.hint} You can try again.`;
});
$("#enrollment-form").addEventListener("submit", (event) =>
{
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.elements.name.value.trim())
    {
        form.elements.name.setCustomValidity("Please enter your name, not just spaces.");
        form.elements.name.reportValidity();
        return;
    }
    const values = new FormData(form);
    $("#application-summary").textContent = `${String(values.get("name")).trim()}, your interest is noted in this tab: ${values.get("experience")}. Your preview email is ${values.get("email")}.`;
    form.hidden = true;
    $("#application-result").hidden = false;
    $("#application-result").focus();
});
$("#applicant-name").addEventListener("input", (event) => event.target.setCustomValidity(""));
$("#edit-application").addEventListener("click", () =>
{
    $("#application-result").hidden = true;
    $("#enrollment-form").hidden = false;
    $("#applicant-name").focus();
});
$("#contact-form").addEventListener("submit", (event) =>
{
    event.preventDefault();
    const message = $("#message");
    if (message.value.trim().length < 10)
    {
        message.setCustomValidity("Write a question with at least 10 non-space characters.");
        message.reportValidity();
        return;
    }
    $("#contact-result").textContent = `Your local draft: “${message.value.trim()}” — Not sent. No messaging service is connected.`;
});
$("#message").addEventListener("input", (event) => event.target.setCustomValidity(""));
