"use strict";

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const icon = (name) => `<svg class="icon" aria-hidden="true"><use href="icons.svg#${name}"></use></svg>`;
const storageKey = "fluent-learning-space-v1";
const dayKey = (date = new Date()) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
const freshState = () => ({
    profile: { name: "Alex", level: "beginner", focus: "vocabulary", goal: "conversation" },
    completed: {},
    events: [],
    words: {},
    journal: "",
    reminder: { enabled: false, time: "18:00" }
});
let storageAvailable = true;
let state = freshState();

try
{
    const saved = JSON.parse(localStorage.getItem(storageKey) || "null");
    if (saved && typeof saved === "object")
    {
        const defaults = freshState();
        const profile = saved.profile || {};
        state.profile = {
            name: typeof profile.name === "string" && profile.name.trim() ? profile.name.trim().slice(0, 30) : "Alex",
            level: ["beginner", "intermediate"].includes(profile.level) ? profile.level : defaults.profile.level,
            focus: ["vocabulary", "grammar", "reading"].includes(profile.focus) ? profile.focus : defaults.profile.focus,
            goal: ["conversation", "work", "travel"].includes(profile.goal) ? profile.goal : defaults.profile.goal
        };
        state.completed = saved.completed && typeof saved.completed === "object" ? saved.completed : {};
        state.events = Array.isArray(saved.events) ? saved.events.filter((event) => event && ["lesson", "word"].includes(event.type) && typeof event.day === "string" && typeof event.id === "string").slice(-2000) : [];
        state.words = saved.words && typeof saved.words === "object" ? saved.words : {};
        state.journal = typeof saved.journal === "string" ? saved.journal.slice(0, 1200) : "";
        state.reminder = saved.reminder && /^\d{2}:\d{2}$/.test(saved.reminder.time) ? { enabled: saved.reminder.enabled === true, time: saved.reminder.time } : defaults.reminder;
    }
}
catch
{
    storageAvailable = false;
}

const lessons = [
    {
        id: "connection", title: "Make a first connection", short: "First connections", level: "beginner", skill: "vocabulary", goal: "conversation", color: "sage", art: "messages", description: "A few words can open a whole conversation.",
        reading: "Alex: Hello, I'm Alex. It's nice to meet you.\nSam: Nice to meet you, too. What do you enjoy doing?\nAlex: I enjoy reading and taking long walks.",
        questions: [
            { question: "Which phrase is a friendly introduction?", options: ["I'm leaving now.", "Hello, I'm Alex.", "That is expensive."], answer: 1, explanation: "“Hello, I'm…” is a friendly way to introduce yourself." },
            { question: "Someone says, “Nice to meet you.” What fits next?", options: ["Nice to meet you, too.", "It is on the left.", "I need two tickets."], answer: 0, explanation: "Adding “too” politely returns the greeting." },
            { question: "What does Alex enjoy?", options: ["Buying tickets", "Cooking dinner", "Reading and taking walks"], answer: 2, explanation: "Alex says, “I enjoy reading and taking long walks.”" }
        ]
    },
    {
        id: "routines", title: "Find your everyday rhythm", short: "Everyday rhythm", level: "beginner", skill: "grammar", goal: "work", color: "sand", art: "sun", description: "Talk about your day with the simple present.",
        reading: "I start work at nine. My friend starts work at ten.\nWe use the simple present for routines. With he, she, or it, we usually add -s to the verb: she starts, he walks.",
        questions: [
            { question: "Choose the sentence about a daily routine.", options: ["She work at nine.", "She working at nine.", "She starts work at nine."], answer: 2, explanation: "With “she,” add -s: “She starts work at nine.”" },
            { question: "Complete: “I ___ English every morning.”", options: ["practice", "practices", "practicing"], answer: 0, explanation: "Use the base form after “I”: “I practice.”" },
            { question: "Complete: “My friend ___ to work.”", options: ["walk", "walks", "walking"], answer: 1, explanation: "“My friend” is one person, like “he” or “she,” so use “walks.”" }
        ]
    },
    {
        id: "cafe", title: "A table by the window", short: "At the little café", level: "beginner", skill: "reading", goal: "travel", color: "blue", art: "coffee", description: "Find your way through an everyday café visit.",
        reading: "The Green Café opens at eight in the morning. Tea costs three dollars. A sandwich costs six dollars. You can sit inside or in the garden. The café closes at four in the afternoon.",
        questions: [
            { question: "When does the café open?", options: ["At four", "At eight", "At six"], answer: 1, explanation: "The first sentence says the café opens at eight in the morning." },
            { question: "How much are a tea and a sandwich together?", options: ["Three dollars", "Six dollars", "Nine dollars"], answer: 2, explanation: "Tea is three dollars and a sandwich is six: three plus six is nine." },
            { question: "Where can visitors sit?", options: ["Inside or in the garden", "Only by the road", "Only inside"], answer: 0, explanation: "The passage offers two places: inside or in the garden." }
        ]
    },
    {
        id: "discovery", title: "Leave room for discovery", short: "A little discovery", level: "intermediate", skill: "vocabulary", goal: "travel", color: "sand", art: "compass", description: "Make room in your travel plans for new words.",
        reading: "An itinerary is a plan for a journey. A flexible itinerary leaves room for changes. If a museum is crowded, you might explore a quieter neighborhood instead. A detour is a different route from the one you planned.",
        questions: [
            { question: "What is an itinerary?", options: ["A plan for a journey", "A type of luggage", "A train station"], answer: 0, explanation: "An itinerary lists the places or activities planned for a journey." },
            { question: "A flexible plan is a plan that…", options: ["never changes.", "can change.", "has no destination."], answer: 1, explanation: "“Flexible” means able to adapt when your needs or situation change." },
            { question: "You take a detour. What have you changed?", options: ["Your language", "Your luggage", "Your route"], answer: 2, explanation: "A detour uses a different route, often to avoid a problem or see something new." }
        ]
    },
    {
        id: "requests", title: "A kinder way to ask", short: "Thoughtful requests", level: "intermediate", skill: "grammar", goal: "conversation", color: "sage", art: "messages", description: "Turn everyday requests into thoughtful conversations.",
        reading: "“Could you help me?” and “Would you mind helping me?” are polite requests. Use the base verb after “could you.” Use an -ing form after “would you mind.” “Could you possibly…” makes a request even more tentative.",
        questions: [
            { question: "Complete: “Would you mind ___ the window?”", options: ["open", "opening", "to open"], answer: 1, explanation: "“Would you mind” is followed by an -ing form: “opening.”" },
            { question: "Which request uses the correct verb form?", options: ["Could you help me?", "Could you helping me?", "Could you to help me?"], answer: 0, explanation: "“Could you” is followed by the base verb: “help.”" },
            { question: "Which phrase makes a request more tentative?", options: ["Right now", "You must", "Could you possibly"], answer: 2, explanation: "“Could you possibly” softens the request and gives the listener room to respond." }
        ]
    },
    {
        id: "email", title: "A message that makes sense", short: "Clearer work emails", level: "intermediate", skill: "reading", goal: "work", color: "blue", art: "mail", description: "Read between the lines of a friendly work email.",
        reading: "Hi Alex,\nCould you send the revised outline by Thursday afternoon? We moved Friday's meeting to Monday so everyone has time to review it. Please flag any questions before you finalize the outline.\nThanks,\nJordan",
        questions: [
            { question: "When is the revised outline due?", options: ["Monday morning", "Friday afternoon", "Thursday afternoon"], answer: 2, explanation: "Jordan asks for the outline by Thursday afternoon, before the rescheduled meeting." },
            { question: "Why was the meeting moved?", options: ["To allow time to review", "Because the outline is cancelled", "To finish on Thursday"], answer: 0, explanation: "The email says the move gives everyone time to review the outline." },
            { question: "What does “flag any questions” mean here?", options: ["Hide the questions", "Draw attention to the questions", "Answer every question alone"], answer: 1, explanation: "In a work context, to “flag” something is to highlight it for attention." }
        ]
    }
];

const vocabulary = [
    { id: "possibility", word: "possibility", type: "noun", meaning: "Something that could happen or become true.", example: "Every conversation brings a new possibility." },
    { id: "confident", word: "confident", type: "adjective", meaning: "Feeling sure that you can do something.", example: "I feel more confident when I practice." },
    { id: "curious", word: "curious", type: "adjective", meaning: "Wanting to learn or know more about something.", example: "Stay curious about the world around you." },
    { id: "routine", word: "routine", type: "noun", meaning: "A set of things you do regularly.", example: "Reading is part of my morning routine." },
    { id: "flexible", word: "flexible", type: "adjective", meaning: "Able to change to suit a new situation.", example: "A flexible plan leaves time for discovery." },
    { id: "encourage", word: "encourage", type: "verb", meaning: "To give someone support or confidence.", example: "My friends encourage me to keep learning." }
];
const goalNames = { conversation: "Everyday conversation", work: "English at work", travel: "Travel and discovery" };
let skillFilter = "all";
let difficultyFilter = "all";
let toastTimer;
let activeLesson = null;
let flashQueue = [];
let currentWord = null;
let flashRevealed = false;
let reminderShown = "";

function installIcons(root = document)
{
    $$("[data-icon]", root).forEach((element) => element.outerHTML = icon(element.dataset.icon));
}

function toast(message)
{
    clearTimeout(toastTimer);
    $("#toast").textContent = message;
    $("#toast").classList.add("visible");
    toastTimer = setTimeout(() => $("#toast").classList.remove("visible"), 4500);
}

function persist()
{
    try
    {
        localStorage.setItem(storageKey, JSON.stringify(state));
        storageAvailable = true;
        return true;
    }
    catch
    {
        storageAvailable = false;
        toast("Browser storage is unavailable. Changes last only while this page stays open.");
        return false;
    }
}

function learningPath()
{
    return lessons.filter((lesson) => lesson.level === state.profile.level).sort((a, b) =>
    {
        const score = (lesson) => (lesson.skill === state.profile.focus ? 3 : 0) + (lesson.goal === state.profile.goal ? 2 : 0);
        return score(b) - score(a);
    });
}

function nextLesson()
{
    const path = learningPath();
    return path.find((lesson) => !state.completed[lesson.id]) || path[0];
}

function weekStart()
{
    const date = new Date();
    date.setDate(date.getDate() - (date.getDay() + 6) % 7);
    date.setHours(0, 0, 0, 0);
    return date;
}

function renderDashboard()
{
    const { profile } = state;
    $("#learner-name").textContent = profile.name;
    $(".avatar").textContent = [...profile.name][0].toUpperCase();
    $("#header-level").textContent = profile.level === "beginner" ? "Beginner · A1–A2" : "Intermediate · B1–B2";
    $("#path-summary").textContent = `Your ${profile.level} path · ${goalNames[profile.goal]}`;
    $("#hero-description").textContent = profile.goal === "work" ? "Find the words for your working world. Build confidence, one clear message at a time." : profile.goal === "travel" ? "Make new places feel a little more familiar. Your next discovery starts with a few words." : "Find your words. Build your confidence. Your English journey starts right here.";
    const completed = lessons.filter((lesson) => state.completed[lesson.id]);
    $("#completed-count").textContent = completed.length;
    $("#mastered-count").textContent = vocabulary.filter((word) => state.words[word.id]?.reviews > 0).length;
    const attempts = state.events.filter((event) => event.type === "lesson" && Number.isInteger(event.correct) && event.correct >= 0 && event.correct <= 3);
    $("#accuracy").textContent = attempts.length ? `${Math.round(attempts.reduce((sum, event) => sum + event.correct, 0) / (attempts.length * 3) * 100)}%` : "—";
    $("#task-lesson").textContent = nextLesson().title;
    $("#continue-lesson").innerHTML = `${completed.length ? "Continue my journey" : "Start my lesson"} ${icon("arrow-right")}`;
    $("#path-steps").innerHTML = learningPath().map((lesson, index) => `<button class="path-step ${state.completed[lesson.id] ? "completed" : ""}" data-lesson="${lesson.id}"><span class="step-marker">${state.completed[lesson.id] ? icon("check") : String(index + 1).padStart(2, "0")}</span><b>${lesson.short}</b><small>${state.completed[lesson.id] ? "COMPLETED · PRACTICE AGAIN" : `${lesson.skill.toUpperCase()} · 5 MIN`}</small></button>`).join("");
    const today = dayKey();
    const todayEvents = state.events.filter((event) => event.day === today);
    const count = todayEvents.length;
    $("#daily-count").innerHTML = `${count}<span>/ 3</span>`;
    $("#goal-ring").style.background = `conic-gradient(#668052 ${Math.min(count / 3, 1) * 360}deg, #edf0e3 0deg)`;
    $("#daily-caption").textContent = count >= 3 ? "You made time for yourself. Well done." : count ? "Look at you, making room to grow." : "A fresh start is a good start.";
    const days = new Set(state.events.map((event) => event.day));
    const cursor = new Date();
    if (!days.has(dayKey(cursor)))
    {
        cursor.setDate(cursor.getDate() - 1);
    }
    let streak = 0;
    while (days.has(dayKey(cursor)) && streak < 3650)
    {
        streak++;
        cursor.setDate(cursor.getDate() - 1);
    }
    $("#streak").textContent = streak;
    const start = weekStart();
    $("#week-days").innerHTML = Array.from({ length: 7 }, (_, index) =>
    {
        const date = new Date(start);
        date.setDate(date.getDate() + index);
        const key = dayKey(date);
        const practiced = days.has(key);
        return `<div class="week-day ${key === today ? "today" : ""} ${practiced ? "done" : ""}" aria-label="${date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}: ${practiced ? "practiced" : "no practice"}"><span>${practiced ? icon("check") : date.getDate()}</span>${["M", "T", "W", "T", "F", "S", "S"][index]}</div>`;
    }).join("");
    const weekLessons = new Set(state.events.filter((event) => event.type === "lesson" && event.day >= dayKey(start)).map((event) => event.id)).size;
    $("#challenge-fill").style.width = `${Math.min(weekLessons / 3, 1) * 100}%`;
    $("#challenge-progress").textContent = `${Math.min(weekLessons, 3)} of 3 completed`;
    $("#badge-status").textContent = weekLessons >= 3 ? "Consistency badge earned" : "Keep growing";
    $(".notification-dot").hidden = !state.reminder.enabled;
    $("#word-count").textContent = vocabulary.filter((word) => !state.words[word.id]?.due || state.words[word.id].due <= Date.now()).length;
    renderLibrary();
}

function renderLibrary()
{
    const sorted = [...lessons].sort((a, b) => Number(b.level === state.profile.level) - Number(a.level === state.profile.level));
    const visible = sorted.filter((lesson) => (skillFilter === "all" || lesson.skill === skillFilter) && (difficultyFilter === "all" || lesson.level === difficultyFilter));
    $("#lesson-total").textContent = `${visible.length} ${visible.length === 1 ? "lesson" : "lessons"}`;
    $("#lesson-grid").innerHTML = visible.length ? visible.map((lesson) => `<button class="lesson-card" data-lesson="${lesson.id}" aria-label="${state.completed[lesson.id] ? "Review" : "Start"} ${lesson.title}"><div class="lesson-illustration ${lesson.color}">${icon(lesson.art)}</div><span class="label">${lesson.skill.toUpperCase()} · ${lesson.level.toUpperCase()}</span><h3>${lesson.title}</h3><p>${lesson.description}</p><div class="lesson-card-footer"><span>${state.completed[lesson.id] ? "Completed · Practice again" : "5 min · 3 questions"}</span>${icon(state.completed[lesson.id] ? "check" : "arrow-right")}</div></button>`).join("") : '<p class="no-results">No lessons match both filters. Try another skill or choose all levels.</p>';
}

function openDialog(id)
{
    if (window.speechSynthesis)
    {
        speechSynthesis.cancel();
    }
    const dialog = $(id);
    dialog.returnFocus = document.activeElement;
    dialog.showModal();
}

function openProfile()
{
    const form = $("#profile-form");
    for (const [name, value] of Object.entries(state.profile))
    {
        form.elements[name].value = value;
    }
    openDialog("#profile-dialog");
}

function startLesson(id)
{
    const lesson = lessons.find((entry) => entry.id === id);
    if (!lesson)
    {
        return;
    }
    activeLesson = { lesson, index: 0, selected: null, checked: false, correct: 0, finished: false };
    $("#lesson-title").textContent = lesson.title;
    renderQuestion();
    openDialog("#lesson-dialog");
}

function renderQuestion()
{
    const session = activeLesson;
    const question = session.lesson.questions[session.index];
    $("#lesson-label").textContent = `${session.lesson.skill.toUpperCase()} · ${session.lesson.level.toUpperCase()}`;
    $("#lesson-content").innerHTML = `<div class="lesson-progress" aria-label="Question ${session.index + 1} of 3">${[0, 1, 2].map((index) => `<span class="${index <= session.index ? "done" : ""}"></span>`).join("")}</div><p class="small muted">Read the short lesson. Then put it into practice.</p><div class="lesson-reading" style="white-space: pre-line"></div><button class="listen-button" id="listen">${icon("volume")} Listen to the passage</button><div class="small muted" id="audio-status" role="status"></div><h3 class="quiz-question" id="quiz-question">${session.index + 1}. ${question.question}</h3><div class="answer-options" role="group" aria-labelledby="quiz-question">${question.options.map((option, index) => `<button class="answer-option" data-answer="${index}" aria-pressed="false">${String.fromCharCode(65 + index)}. ${option}</button>`).join("")}</div><div class="quiz-feedback" role="status"></div><button class="button dark" id="check-answer" disabled>Check my answer ${icon("arrow-right")}</button>`;
    $(".lesson-reading", $("#lesson-dialog")).textContent = session.lesson.reading;
    if (!("speechSynthesis" in window))
    {
        $("#listen").disabled = true;
        $("#audio-status").textContent = "Audio is unavailable in this browser. The full passage is written above.";
    }
}

function selectAnswer(index)
{
    if (!activeLesson || activeLesson.checked)
    {
        return;
    }
    activeLesson.selected = index;
    $$(".answer-option").forEach((button) =>
    {
        const selected = Number(button.dataset.answer) === index;
        button.classList.toggle("selected", selected);
        button.setAttribute("aria-pressed", String(selected));
    });
    $("#check-answer").disabled = false;
}

function checkAnswer()
{
    const session = activeLesson;
    if (!session || session.finished)
    {
        return;
    }
    if (session.checked)
    {
        if (window.speechSynthesis)
        {
            speechSynthesis.cancel();
        }
        session.index++;
        session.selected = null;
        session.checked = false;
        if (session.index === session.lesson.questions.length)
        {
            finishLesson();
        }
        else
        {
            renderQuestion();
            $("#quiz-question").tabIndex = -1;
            $("#quiz-question").focus();
        }
        return;
    }
    if (session.selected === null)
    {
        return;
    }
    session.checked = true;
    const question = session.lesson.questions[session.index];
    const correct = session.selected === question.answer;
    if (correct)
    {
        session.correct++;
    }
    $$(".answer-option").forEach((button, index) =>
    {
        button.disabled = true;
        button.classList.toggle("correct", index === question.answer);
        button.classList.toggle("incorrect", index === session.selected && !correct);
    });
    $(".quiz-feedback").textContent = `${correct ? "That's it!" : "A useful learning moment."} ${question.explanation}`;
    $("#check-answer").innerHTML = `${session.index === 2 ? "See my progress" : "Next question"} ${icon("arrow-right")}`;
}

function finishLesson()
{
    const session = activeLesson;
    session.finished = true;
    state.completed[session.lesson.id] = true;
    state.events.push({ type: "lesson", id: session.lesson.id, correct: session.correct, day: dayKey() });
    const saved = persist();
    renderDashboard();
    $("#lesson-content").innerHTML = `<div class="completion">${icon("award")}<h2>A small step. A real achievement.</h2><p>You answered ${session.correct} of 3 questions correctly.<br>${session.correct === 3 ? "Keep that confidence with you." : "Every correction is a chance to learn. Review the lesson whenever you like."}</p><p>${saved ? "Your progress is saved on this device." : "Progress is in memory only. Browser storage is unavailable."}</p><button class="button dark" id="finish-lesson">Back to my learning space ${icon("check")}</button></div>`;
    $("#finish-lesson").focus();
}

function openVocabulary()
{
    flashQueue = vocabulary.filter((word) => !state.words[word.id]?.due || state.words[word.id].due <= Date.now());
    renderFlashcard();
    openDialog("#vocab-dialog");
}

function renderFlashcard()
{
    currentWord = flashQueue[0] || null;
    flashRevealed = false;
    if (!currentWord)
    {
        $("#flashcard-content").innerHTML = `<div class="completion">${icon("check")}<h2>A little more familiar.</h2><p>You're caught up on your due words. “Keep learning” returns a word in one minute; “I knew it” returns it tomorrow or later as its interval grows.</p><button class="button secondary" id="review-all">Practice all words anyway ${icon("arrow-right")}</button></div>`;
        return;
    }
    $("#flashcard-content").innerHTML = `<div class="review-meta"><span>${flashQueue.length} ${flashQueue.length === 1 ? "word" : "words"} in this session</span><span>${Number(state.words[currentWord.id]?.reviews) || 0} previous reviews</span></div><button class="flashcard" id="reveal-word" aria-label="Reveal the meaning of ${currentWord.word}"><strong>${currentWord.word}</strong><span>${currentWord.type}</span><small>Think of its meaning. Then tap to reveal.</small></button><div class="rating-buttons"><button class="button secondary" id="rate-again" disabled>Keep learning · 1 min</button><button class="button dark" id="rate-known" disabled>I knew it · 1 day</button></div><p class="small muted">Simple, local spaced repetition. This is self-rating, not an assessed score.</p>`;
}

function revealWord()
{
    if (!currentWord || flashRevealed)
    {
        return;
    }
    flashRevealed = true;
    $("#reveal-word").innerHTML = `<strong>${currentWord.word}</strong><p>${currentWord.meaning}</p><small>“${currentWord.example}”</small>`;
    $("#reveal-word").setAttribute("aria-label", `${currentWord.word}: ${currentWord.meaning}`);
    $("#rate-again").disabled = false;
    $("#rate-known").disabled = false;
    const days = Math.min(30, Math.max(1, (Number(state.words[currentWord.id]?.interval) || 0) * 2));
    $("#rate-known").textContent = `I knew it · ${days} ${days === 1 ? "day" : "days"}`;
}

function rateWord(known)
{
    if (!currentWord || !flashRevealed)
    {
        return;
    }
    const previous = state.words[currentWord.id];
    const interval = known ? Math.min(30, Math.max(1, (Number(previous?.interval) || 0) * 2)) : 0;
    state.words[currentWord.id] = {
        interval,
        due: Date.now() + (known ? interval * 86400000 : 60000),
        reviews: (Number(previous?.reviews) || 0) + 1
    };
    state.events.push({ type: "word", id: currentWord.id, day: dayKey() });
    persist();
    flashQueue.shift();
    renderFlashcard();
    renderDashboard();
    const target = $("#reveal-word") || $("#review-all");
    target.focus();
}

const guides = {
    habit: {
        title: "Build a five-minute habit.",
        content: "<p>Small, repeatable practice is easier to return to than an ambitious plan you cannot fit into your day.</p><h3>1. Attach it to something familiar.</h3><p>After your morning drink or before you put your phone away, open one short lesson. A specific cue makes the decision simpler.</p><h3>2. Practice actively.</h3><p>Read the passage, look away, and recall one idea. Then answer the questions. Notice what surprised you.</p><h3>3. Leave an easy next step.</h3><p>Write one sentence in your learning journal about what you want to try tomorrow. A missed day is not a failure. Start again with one small step.</p><p class='small muted'>Fluent editorial study notes. General learning suggestions, not a promise of proficiency gains.</p>"
    },
    words: {
        title: "Make new words stick.",
        content: "<p>A word becomes more useful when you can recall it in a real situation, not just recognize it on a page.</p><h3>Recall before you reveal.</h3><p>Look at a flashcard and try to explain the word in your own English. Reveal the meaning to check your memory.</p><h3>Give it a home.</h3><p>Write a sentence connected to your own day. For “routine,” try: “A short walk is part of my evening routine.”</p><h3>Come back with a little space.</h3><p>Our local flashcards return difficult words after a minute. Familiar words return after one day, then two, four, and up to thirty days. You choose the rating; no hidden assessment is involved.</p><p class='small muted'>Fluent editorial study notes. Review times are simple local scheduling rules.</p>"
    }
};

function checkReminder()
{
    const now = new Date();
    const time = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    if (state.reminder.enabled && time >= state.reminder.time && reminderShown !== dayKey(now))
    {
        reminderShown = dayKey(now);
        toast("Your daily moment is here. A little practice can make a lovely difference.");
    }
}

document.addEventListener("click", (event) =>
{
    const action = event.target.closest("[data-action]")?.dataset.action;
    if (action === "profile")
    {
        openProfile();
    }
    if (action === "vocabulary")
    {
        openVocabulary();
    }
    if (action === "reminders")
    {
        $("#reminder-form").elements.time.value = state.reminder.time;
        $("#reminder-form").elements.enabled.checked = state.reminder.enabled;
        openDialog("#reminder-dialog");
    }
    const lesson = event.target.closest("[data-lesson]")?.dataset.lesson;
    if (lesson)
    {
        startLesson(lesson);
    }
    const filter = event.target.closest("[data-skill]");
    if (filter)
    {
        skillFilter = filter.dataset.skill;
        $$(".filter").forEach((button) =>
        {
            button.classList.toggle("active", button === filter);
            button.setAttribute("aria-pressed", String(button === filter));
        });
        renderLibrary();
    }
    if (event.target.closest(".close-dialog"))
    {
        event.target.closest("dialog").close();
    }
    const answer = event.target.closest("[data-answer]");
    if (answer)
    {
        selectAnswer(Number(answer.dataset.answer));
    }
    if (event.target.closest("#check-answer"))
    {
        checkAnswer();
    }
    if (event.target.closest("#finish-lesson"))
    {
        $("#lesson-dialog").close();
    }
    if (event.target.closest("#listen"))
    {
        if (!window.speechSynthesis)
        {
            return;
        }
        speechSynthesis.cancel();
        const voice = speechSynthesis.getVoices().find((entry) => entry.localService && entry.lang.startsWith("en"));
        if (!voice)
        {
            $("#audio-status").textContent = "No local English voice is available. Read the full transcript above instead.";
            return;
        }
        const utterance = new SpeechSynthesisUtterance(activeLesson.lesson.reading);
        utterance.voice = voice;
        utterance.lang = "en-US";
        utterance.rate = .88;
        utterance.onend = () =>
        {
            const status = $("#audio-status");
            if (status)
            {
                status.textContent = "Playback finished. You can listen again.";
            }
        };
        utterance.onerror = () =>
        {
            const status = $("#audio-status");
            if (status)
            {
                status.textContent = "Playback is unavailable. Use the written passage above.";
            }
        };
        speechSynthesis.speak(utterance);
        $("#audio-status").textContent = "Playing with your device's local English voice.";
    }
    if (event.target.closest("#reveal-word"))
    {
        revealWord();
    }
    if (event.target.closest("#rate-again"))
    {
        rateWord(false);
    }
    if (event.target.closest("#rate-known"))
    {
        rateWord(true);
    }
    if (event.target.closest("#review-all"))
    {
        flashQueue = [...vocabulary];
        renderFlashcard();
    }
    const guide = event.target.closest("[data-guide]")?.dataset.guide;
    if (guide && guides[guide])
    {
        $("#guide-title").textContent = guides[guide].title;
        $("#guide-content").innerHTML = guides[guide].content;
        openDialog("#guide-dialog");
    }
});

$("#difficulty").addEventListener("change", (event) =>
{
    difficultyFilter = event.target.value;
    renderLibrary();
});
$("#continue-lesson").addEventListener("click", () => startLesson(nextLesson().id));
$("#today-lesson").addEventListener("click", () => startLesson(nextLesson().id));
$("#profile-form").addEventListener("submit", (event) =>
{
    event.preventDefault();
    const form = event.target;
    const name = form.elements.name.value.trim();
    if (!name)
    {
        form.elements.name.setCustomValidity("Please enter a first name.");
        form.elements.name.reportValidity();
        return;
    }
    state.profile = { name, level: form.elements.level.value, goal: form.elements.goal.value, focus: form.elements.focus.value };
    const saved = persist();
    renderDashboard();
    $("#profile-dialog").close();
    if (saved)
    {
        toast("Your path is ready. A few small steps, chosen around your goals.");
    }
});
$("#profile-form").elements.name.addEventListener("input", (event) => event.target.setCustomValidity(""));
$("#save-journal").addEventListener("click", () =>
{
    state.journal = $("#reflection").value.trim();
    const saved = persist();
    $("#journal-status").textContent = saved ? "Reflection saved on this device." : "Not saved. Browser storage is unavailable.";
    if (saved)
    {
        toast("A little reflection, saved just for you.");
    }
});
$("#reflection").addEventListener("input", () => $("#journal-status").textContent = "Unsaved changes");
$("#reminder-form").addEventListener("submit", (event) =>
{
    event.preventDefault();
    state.reminder = { enabled: event.target.elements.enabled.checked, time: event.target.elements.time.value };
    const saved = persist();
    renderDashboard();
    $("#reminder-dialog").close();
    if (saved)
    {
        toast(state.reminder.enabled ? `On-page reminder set for ${state.reminder.time}. Keep this page open.` : "Practice reminder turned off.");
    }
});
$("#reset-data").addEventListener("click", () =>
{
    if (confirm("Clear your local profile, progress, word reviews, reminder, and journal? This cannot be undone."))
    {
        state = freshState();
        skillFilter = "all";
        difficultyFilter = "all";
        $("#difficulty").value = "all";
        $$(".filter").forEach((button) =>
        {
            button.classList.toggle("active", button.dataset.skill === "all");
            button.setAttribute("aria-pressed", String(button.dataset.skill === "all"));
        });
        $("#reflection").value = "";
        $("#journal-status").textContent = "Your thoughts stay with you.";
        const saved = persist();
        renderDashboard();
        if (saved)
        {
            toast("Your local learning space has been reset.");
        }
    }
});
$$("dialog").forEach((dialog) =>
{
    dialog.addEventListener("close", () =>
    {
        if (window.speechSynthesis)
        {
            speechSynthesis.cancel();
        }
        const target = dialog.returnFocus?.isConnected ? dialog.returnFocus : $("#continue-lesson");
        target.focus({ preventScroll: true });
    });
});
window.addEventListener("pagehide", () =>
{
    if (window.speechSynthesis)
    {
        speechSynthesis.cancel();
    }
});
installIcons();
$("#reflection").value = state.journal;
renderDashboard();
if (!storageAvailable)
{
    toast("Saved data could not be loaded. This session starts fresh; avoid sensitive information.");
}
checkReminder();
setInterval(checkReminder, 30000);
