"use strict";

(async () =>
{
    const $ = (selector) => document.querySelector(selector);
    const iconResponse = await fetch("./icons.svg");
    if (!iconResponse.ok)
    {
        throw new Error("The local icon resource could not be loaded.");
    }
    const sprite = new DOMParser().parseFromString(await iconResponse.text(), "image/svg+xml");
    const iconMarkup = Object.fromEntries([...sprite.querySelectorAll("symbol")].map((symbol) => [symbol.id, symbol.innerHTML]));
    const icons = (name) => `<svg aria-hidden="true" viewBox="0 0 24 24">${iconMarkup[name] || ""}</svg>`;
    document.querySelectorAll('use[href^="./icons.svg#"]').forEach((use) =>
    {
        const name = use.getAttribute("href").split("#")[1];
        use.parentElement.setAttribute("viewBox", "0 0 24 24");
        use.parentElement.setAttribute("aria-hidden", "true");
        use.parentElement.innerHTML = iconMarkup[name] || "";
    });
    const escape = (value) => String(value).replace(/[&<>"']/g, (character) => ({"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"}[character]));
    const storageKey = "stride-growth-v1";
    const topics = ["Productivity", "Mindfulness", "Leadership", "Emotional intelligence"];
    const lesson = (title, text, practice, question, answers, correct, reason, minutes) => ({title, text, practice, question, answers, correct, reason, minutes});
    const catalog =
    [
        {
            id: "intentional", title: "The art of intentional productivity", topic: "Productivity", coach: "Maya Brooks", level: "Beginner", description: "Do less on autopilot. Make more room for what matters.", color: "#e8d5be", art: "steps",
            lessons:
            [
                lesson("Choose what matters", "Being busy and making progress are not the same thing. Start with an outcome: what would be meaningfully different by the end of the week? Connect each task to that outcome. Tasks without a clear connection can be reduced, delegated, or dropped.\nFor example, “improve team alignment” is an intention. “Write a one-page project brief and ask two teammates for feedback by Friday” is an observable next step.", "Write one outcome for this week and one concrete action that supports it.", "Which task is the clearest next step toward better team alignment?", ["Check messages more often", "Draft a project brief and request feedback by Friday", "Attend every optional meeting"], 1, "A specific deliverable, feedback loop, and date make the action both meaningful and observable.", 8),
                lesson("Protect a focus block", "Attention has a switching cost. A focus block is a short appointment with one important task, not a promise to work without rest all day. Choose a 25-minute block, silence nonessential alerts, and put the needed material in one place.\nDefine what “finished for now” looks like before you start. End the block by noting your next action. Plan a short break, and leave room for unexpected work.", "Name a 25-minute focus block, its time, and what you will put out of reach.", "What makes a focus block sustainable?", ["Fill every minute of the day", "Choose one outcome, reduce distractions, then take a break", "Keep all notifications on for motivation"], 1, "A bounded task and a planned break help preserve attention without creating an unrealistic schedule.", 10),
                lesson("Review without judgment", "A weekly review is information, not a verdict on your character. Ask: What moved forward? What got in the way? What will I change? Look for friction in the system before blaming motivation.\nIf a plan repeatedly fails, make the next step smaller or change its context. “Write for ten minutes after breakfast” is often more useful than “be more disciplined.”", "Write one thing to keep, one friction point, and one small adjustment for next week.", "You missed three planned focus blocks. What is the most useful response?", ["Give up on planning", "Double the target without changing anything", "Identify the friction and try a smaller, better-timed block"], 2, "Adjusting the system turns a missed goal into usable feedback.", 7)
            ]
        },
        {
            id: "calm", title: "Find your calm in a busy world", topic: "Mindfulness", coach: "Sam Rivera", level: "Beginner", description: "Create a little breathing room in your everyday.", color: "#d8dfe8", art: "stones",
            lessons:
            [
                lesson("Notice the present", "Mindfulness is the practice of noticing your current experience with less judgment. You do not need to empty your mind. Try noticing three things you can see, two physical sensations, and one sound.\nIf attending inward feels uncomfortable, keep your eyes open and focus on an object nearby. This educational exercise is not therapy or medical treatment; pause whenever you need to.", "Describe three neutral things you notice around you right now.", "What is the aim of a brief mindfulness practice?", ["Never have distracting thoughts", "Notice your experience and gently return attention", "Force yourself to feel happy"], 1, "Returning gently is the practice; distraction is a normal part of attention.", 5),
                lesson("Create a pause", "A pause can interrupt an automatic reaction. Before replying to a stressful message, put your feet on the floor, relax your shoulders if comfortable, and notice a normal breath. There is no need to hold or control your breath.\nAsk: What do I know? What am I assuming? What response fits my values? A pause creates a choice; it does not mean accepting unreasonable behavior.", "Write a situation where you could pause, and a response that would reflect your values.", "What can a short pause help you do?", ["Remove every difficult emotion", "Avoid all conversations", "Choose a response instead of reacting automatically"], 2, "A pause gives you space to choose even when the feeling remains.", 6),
                lesson("Build a gentle habit", "Attach a tiny practice to an existing routine: notice your surroundings before opening your laptop, or feel your feet on the floor after a meeting. Consistency is easier when the cue is clear and the action is small.\nIf you miss a day, start again with the next cue. Track whether the practice supports you, not whether you achieve a perfect streak.", "Finish this plan: After I ___, I will notice ___ for one minute.", "Which plan has the clearest cue?", ["Be mindful sometime", "After my first meeting, notice my feet for one minute", "Practice only when I have no stress"], 1, "An existing event provides a reliable cue for a small action.", 7)
            ]
        },
        {
            id: "lead", title: "Lead with clarity, not a title", topic: "Leadership", coach: "Alex Morgan", level: "Intermediate", description: "Build trust. Start better conversations. Bring people with you.", color: "#e4dfec", art: "arches",
            lessons:
            [
                lesson("Make the outcome clear", "Leadership begins with shared understanding, not a job title. Explain the desired outcome, why it matters, what constraints are real, and where others have room to decide.\nInstead of “make this better,” try “help new teammates find the onboarding checklist in under a minute; we can change navigation but not the content this week.” Invite questions before assigning work.", "Write a short brief with an outcome, a reason, and one constraint.", "Which brief gives someone useful autonomy?", ["Do exactly what I would do", "Improve everything", "Name the outcome and constraints, then invite a proposed approach"], 2, "Clear boundaries make independent decisions safer and more effective.", 9),
                lesson("Give actionable feedback", "Helpful feedback separates observation, impact, and request. “In yesterday’s review, I noticed two people were interrupted. We missed their context. Could we let each person finish before responding?” is more useful than labeling someone inconsiderate.\nAsk for their perspective. Feedback is a two-way conversation, not a diagnosis of a person’s intentions.", "Draft feedback using an observation, its impact, and a concrete request.", "Which feedback is most actionable?", ["You are careless", "In the handoff, two links were missing; can we use a checklist next time?", "Everyone thinks you should improve"], 1, "A specific observation and request help someone understand what they can change.", 10),
                lesson("Delegate with support", "Delegate an outcome, not just a pile of tasks. Agree on the decision owner, definition of done, resources, and a proportionate check-in. Ask what support would help.\nAvoid silently taking work back at the first difference in approach. If a risk appears, discuss it and revise the agreement together. Accountability and support can coexist.", "Choose one responsibility to delegate and write its outcome and check-in agreement.", "What should a delegation agreement include?", ["Outcome, decision boundaries, support, and a check-in", "Only a deadline", "A promise never to ask questions"], 0, "A complete agreement gives both clarity and room to learn.", 8)
            ]
        },
        {
            id: "empathy", title: "Emotional intelligence at work", topic: "Emotional intelligence", coach: "Sam Rivera", level: "Beginner", description: "Understand your reactions and connect with more empathy.", color: "#eddbd2", art: "arches",
            lessons:
            [
                lesson("Separate feeling from story", "An emotion is real; your first explanation for it may be incomplete. “I feel anxious” is a feeling. “My colleague is trying to undermine me” is an interpretation.\nName the feeling, the observable event, and at least one alternative explanation. This does not dismiss the impact. It helps you choose a proportionate next step.", "Describe an event, your feeling, and two possible explanations without naming real people.", "Which statement is an observation rather than an interpretation?", ["They do not respect me", "They replied to the message two days later", "They want the project to fail"], 1, "The reply time is observable; motives need more evidence.", 7),
                lesson("Listen before solving", "When someone shares a challenge, ask whether they want listening, advice, or practical help. Reflect what you heard in your own words and check whether you understood.\nDo not treat empathy as agreement with every conclusion. You can acknowledge frustration while asking questions about facts and needs.", "Write a question that checks whether someone wants advice or a listening ear.", "What is a useful first response to a colleague’s frustration?", ["Immediately explain why they are wrong", "Tell a longer story about yourself", "Reflect what you heard and ask what kind of support would help"], 2, "Checking the support someone wants prevents well-meant but unhelpful advice.", 8),
                lesson("Set a respectful boundary", "A boundary describes what you can do and what you will do, rather than trying to control another person. Be specific: “I can review this tomorrow morning. For urgent issues tonight, please use the on-call channel.”\nYou can be warm and clear at the same time. Offer an alternative when appropriate, without making promises you cannot sustain.", "Draft one kind, specific boundary and an appropriate alternative.", "Which response sets a clear boundary?", ["Fine, I will always be available", "I can review it tomorrow; urgent issues can go to the on-call channel", "You should know better"], 1, "It states availability and an alternative without blame.", 8)
            ]
        },
        {
            id: "habits", title: "Build habits that actually stick", topic: "Productivity", coach: "Maya Brooks", level: "Beginner", description: "Design a repeatable routine, not another resolution.", color: "#dce4ca", art: "steps",
            lessons:
            [
                lesson("Make the action tiny", "A useful habit starts smaller than your ambition. Define an action that can happen even on a difficult day: open the workbook and write one sentence, rather than complete an entire chapter.\nThe small version keeps the routine available. You can do more when energy allows, but do not make more the entry requirement.", "Turn one ambitious habit into a two-minute version.", "Which action is easiest to repeat on a busy day?", ["Read an entire book", "Become a better person", "Read one paragraph after lunch"], 2, "A concrete, tiny action is easier to start and repeat.", 6),
                lesson("Design the environment", "Make your intended action visible and convenient. Put the notebook beside your morning cup. Remove one obstacle before relying on willpower.\nLook at the opposite habit too. If you want less distracted scrolling, placing the phone outside your workspace can introduce helpful friction.", "Name one object to put in reach and one distraction to move away.", "What is an environment change?", ["Promise to try harder", "Put your practice notebook on the desk before bed", "Wait until you feel inspired"], 1, "Changing the setting makes the desired action easier to begin.", 7),
                lesson("Use a flexible review", "Track repetitions as feedback, not a measure of worth. If a routine keeps slipping, check the cue, size, and timing. A flexible restart rule helps: return at the next opportunity rather than waiting for Monday.\nEvaluate whether the habit still serves your goal. You are allowed to revise a routine that no longer helps.", "Write a restart rule for the next time your routine is interrupted.", "After missing a practice, what is a useful restart?", ["Wait for a perfect week", "Punish yourself with twice as much", "Return to the tiny version at the next cue"], 2, "A small restart reduces the cost of returning.", 7)
            ]
        },
        {
            id: "career", title: "Navigate your next career chapter", topic: "Leadership", coach: "Alex Morgan", level: "Intermediate", description: "Turn your strengths into a realistic next-step plan.", color: "#e9dcb9", art: "stones",
            lessons:
            [
                lesson("Map strengths with evidence", "A strength is more useful when you can point to evidence. List a task you enjoyed, what you contributed, and what changed because of it. Ask a trusted colleague for a concrete example rather than a general compliment.\nPatterns across examples can guide exploration. They do not guarantee a particular role or job offer.", "Write one strength, a specific example, and the result of your contribution.", "Which statement is strongest evidence?", ["I am a natural leader", "I coordinated a handoff that reduced missed tasks from five to one", "I would probably be good at management"], 1, "A concrete contribution and result make a strength easier to evaluate.", 9),
                lesson("Test a career hypothesis", "A career hypothesis connects an interest to a small test. “I might enjoy learning design; I will interview two practitioners and create a ten-minute tutorial.” A test is cheaper and more informative than committing based only on a job title.\nDefine what you hope to learn and how you will reflect on the experience. Check constraints such as time, access, and financial risk.", "Choose a possible direction and a low-risk experiment you can finish in two weeks.", "Which experiment gives useful career information?", ["Buy an expensive credential without research", "Wait until you are completely certain", "Interview a practitioner and try a small relevant project"], 2, "Conversation plus hands-on practice can reveal both interest and fit.", 10),
                lesson("Build a 30-day plan", "Choose one learning action, one relationship action, and one evidence-building action for the next month. Assign realistic dates and decide what you can defer.\nAt the review, ask what you learned, not only what you completed. Revise your direction using the evidence. A plan supports agency; it cannot promise an employment outcome.", "Write a 30-day plan with a learning action, a conversation, and a small deliverable.", "What should a career review consider?", ["Only whether you got a job offer", "What you learned, what evidence changed, and what to try next", "Whether your plan stayed unchanged"], 1, "Career exploration is a learning process, so evidence should update the plan.", 8)
            ]
        }
    ];
    const freshState = () =>
    ({
        profile: {name: "Jamie Chen", interest: "Productivity", style: "Practical and structured", target: 60},
        enrolled: [],
        completed: {},
        completionEvents: [],
        saved: [],
        goals: [{id: "first-goal", title: "Build a more intentional workweek", due: "", course: "intentional", steps: [{text: "Choose one outcome that matters", done: false}, {text: "Protect a 25-minute focus block", done: false}, {text: "Reflect and adjust at the end of the week", done: false}]}],
        sessions: [],
        settings: {releases: true, reminders: true},
        reflections: "",
        posts: [],
        customCourses: [],
        event: false
    });
    let storageAvailable = true;
    let state = freshState();
    try
    {
        const raw = JSON.parse(localStorage.getItem(storageKey) || "null");
        if (raw && raw.profile && typeof raw.profile.name === "string" && Array.isArray(raw.enrolled) && Array.isArray(raw.goals) && raw.completed && typeof raw.completed === "object" && Array.isArray(raw.saved) && Array.isArray(raw.sessions) && Array.isArray(raw.customCourses) && Array.isArray(raw.posts) && raw.settings)
        {
            if (raw.goals.every((goal) => typeof goal.title === "string" && Array.isArray(goal.steps) && goal.steps.every((step) => typeof step.text === "string" && typeof step.done === "boolean")) && raw.customCourses.every((course) => typeof course.title === "string" && Array.isArray(course.lessons) && course.lessons.length > 0) && Object.values(raw.completed).every((items) => Array.isArray(items) && items.every(Number.isInteger)))
            {
                state = {...state, ...raw, profile: {...state.profile, ...raw.profile}};
            }
        }
    }
    catch
    {
        storageAvailable = false;
    }
    let currentTopic = "All";
    let allCourses = false;
    let modalOpener;
    let toastTimer;
    let activeLesson;
    const modal = $("#modal");
    const courses = () => [...catalog, ...state.customCourses];
    const findCourse = (id) => courses().find((course) => course.id === id);
    const completedFor = (id) => state.completed[id] || [];
    const totalLessons = () => courses().reduce((sum, course) => sum + completedFor(course.id).length, 0);
    const totalMinutes = () => courses().reduce((sum, course) => sum + course.lessons.reduce((value, item, index) => value + (completedFor(course.id).includes(index) ? item.minutes : 0), 0), 0);
    const finishedCourses = () => courses().filter((course) => completedFor(course.id).length === course.lessons.length);
    function persist()
    {
        try
        {
            localStorage.setItem(storageKey, JSON.stringify(state));
        }
        catch
        {
            storageAvailable = false;
            toast("Browser storage is unavailable. Changes last only for this visit.");
        }
    }
    function toast(message)
    {
        clearTimeout(toastTimer);
        $("#toast").textContent = message;
        $("#toast").hidden = false;
        toastTimer = setTimeout(() => { $("#toast").hidden = true; }, 4500);
    }
    function openModal(title, html, kicker = "YOUR GROWTH SPACE")
    {
        if (!modal.open)
        {
            modalOpener = document.activeElement;
        }
        $("#modal-kicker").textContent = kicker;
        $("#modal-body").innerHTML = `<h2 id="modal-title">${escape(title)}</h2>${html}`;
        if (!modal.open)
        {
            modal.showModal();
        }
        modal.scrollTop = 0;
        $("#modal-title").setAttribute("tabindex", "-1");
        $("#modal-title").focus();
    }
    function closeModal()
    {
        modal.close();
    }
    modal.addEventListener("close", () =>
    {
        if (modalOpener?.isConnected)
        {
            modalOpener.focus();
        }
    });
    modal.addEventListener("click", (event) =>
    {
        if (event.target === modal)
        {
            const rect = modal.getBoundingClientRect();
            if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)
            {
                closeModal();
            }
        }
    });
    function artwork(type, color)
    {
        let shapes;
        if (type === "steps")
        {
            shapes = '<path d="M75 160v-30h42V98h42V66h42V34h43v126z" fill="#b68e64"/><path d="M117 160v-30h42V98h42V66h43v94z" fill="#d2b18a"/><circle cx="92" cy="50" r="23" fill="#ede5d0"/><path d="M164 109c-9-24-9-49 5-70M164 81c-25-3-31-16-29-33 20 1 32 12 29 33M169 57c2-20 13-27 28-29-1 18-11 27-28 29" fill="#426343" stroke="#426343" stroke-width="2"/><path d="M29 161h265" stroke="#b48f6e" stroke-width="1"/>';
        }
        else if (type === "stones")
        {
            shapes = '<circle cx="235" cy="41" r="25" fill="#f3e5c4"/><path d="M0 141q80-37 160 0t160 0v59H0z" fill="#c6d1de"/><ellipse cx="153" cy="147" rx="66" ry="15" fill="#6d8496"/><ellipse cx="153" cy="120" rx="48" ry="22" fill="#9baeb7"/><ellipse cx="157" cy="88" rx="32" ry="16" fill="#ede5d4"/><ellipse cx="155" cy="61" rx="21" ry="13" fill="#80958b"/><path d="M35 165q28-10 53 0M223 166q26-7 52 0" fill="none" stroke="#a1b3c2"/>';
        }
        else
        {
            shapes = '<path d="M60 167V88a46 46 0 0 1 92 0v79" fill="#b4a1c9"/><path d="M83 167V88a23 23 0 0 1 46 0v79" fill="#e4dfec"/><path d="M168 167V65a46 46 0 0 1 92 0v102" fill="#7e6a98"/><path d="M191 167V65a23 23 0 0 1 46 0v102" fill="#e4dfec"/><circle cx="146" cy="37" r="13" fill="#eacb87"/><path d="M34 168h252" stroke="#a394b4"/><path d="m140 102 20-20 20 20-20 20z" fill="#d1bb82"/>';
        }
        return `<svg viewBox="0 0 320 180" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path fill="${color}" d="M0 0h320v180H0z"/>${shapes}</svg>`;
    }
    function renderCourses()
    {
        const query = $("#course-search").value.trim().toLowerCase();
        const level = $("#level-filter").value;
        const coach = $("#coach-filter").value;
        let filtered = courses().filter((course) => (currentTopic === "All" || course.topic === currentTopic) && (!level || course.level === level) && (!coach || course.coach === coach) && `${course.title} ${course.coach} ${course.topic}`.toLowerCase().includes(query));
        if (currentTopic === "All" && !query && !level && !coach && !allCourses)
        {
            filtered = filtered.slice(0, 3);
        }
        $("#course-grid").innerHTML = filtered.map((course) =>
        {
            const initials = course.coach.split(" ").map((word) => word[0]).slice(0, 2).join("");
            const coachClass = course.coach.startsWith("Maya") ? "coach-maya" : course.coach.startsWith("Alex") ? "coach-alex" : "coach-sam";
            return `<article class="course-card">
                <div class="course-cover">${artwork(course.art, course.color)}<span class="cover-label">${escape(course.level)} friendly${course.level === "Intermediate" ? " · Grow further" : ""}</span></div>
                <button class="icon-button save-course" data-save="${escape(course.id)}" aria-label="Save ${escape(course.title)}" aria-pressed="${state.saved.includes(course.id)}">${icons("Bookmark")}</button>
                <div class="course-info"><span class="course-topic">${escape(course.topic)}</span><h3><a href="#courses" data-course="${escape(course.id)}">${escape(course.title)}</a></h3><p class="course-description">${escape(course.description)}</p><div class="course-author"><span class="avatar ${coachClass}">${escape(initials)}</span><span>${escape(course.coach)}</span></div><div class="course-meta"><span>${icons("Clock3")}${course.lessons.reduce((sum, item) => sum + item.minutes, 0)} min · ${course.lessons.length} lessons</span><button class="text-button" data-course="${escape(course.id)}">View course ${icons("ArrowUpRight")}</button></div></div>
            </article>`;
        }).join("") || '<div class="empty-state"><h3>No courses found. There’s still room to explore.</h3><p>Try another topic, coach, or search term.</p><button class="button button-outline" data-action="clear-filters">Reset filters</button></div>';
        $("#result-count").textContent = `${filtered.length} courses shown`;
    }
    function renderDashboard()
    {
        const name = state.profile.name.trim() || "Jamie Chen";
        $("#greeting-name").textContent = name.split(/\s+/)[0];
        $("#sidebar-name").textContent = name;
        const initials = name.split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
        document.querySelectorAll(".avatar-user").forEach((avatar) => { avatar.textContent = initials; });
        const now = new Date();
        const start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - (now.getDay() + 6) % 7);
        const weeklyEvents = (state.completionEvents || []).filter((item) => new Date(item.at) >= start && new Date(item.at) <= now);
        const weeklyMinutes = weeklyEvents.reduce((sum, item) => sum + (findCourse(item.course)?.lessons[item.lesson]?.minutes || 0), 0);
        $("#minutes-stat").innerHTML = `${weeklyMinutes}<span> min</span>`;
        $("#weekly-target-label").textContent = `of ${state.profile.target} min goal`;
        const learned = totalLessons();
        document.querySelectorAll(".week-days > span").forEach((day, index) =>
        {
            day.classList.toggle("today", index === (now.getDay() + 6) % 7);
            day.classList.toggle("learned", weeklyEvents.some((item) => (new Date(item.at).getDay() + 6) % 7 === index));
        });
        $("#badge-count").textContent = learned ? `${finishedCourses().length + 1} ${finishedCourses().length ? "badges" : "badge"} earned` : "Your first win is waiting";
        $("#badge-description").textContent = learned ? "Small steps are adding up" : "Finish a lesson to earn a badge";
        const enrolledCourse = state.enrolled.map(findCourse).filter(Boolean).find((course) => completedFor(course.id).length < course.lessons.length) || state.enrolled.map(findCourse).filter(Boolean)[0];
        const next = enrolledCourse || catalog[0];
        const done = completedFor(next.id).length;
        $("#continue-title").textContent = next.title;
        $("#continue-kicker").textContent = enrolledCourse ? "YOUR PERSONAL LEARNING PATH" : "YOUR SUGGESTED STARTING POINT";
        $("#continue-detail").textContent = enrolledCourse ? `${done} of ${next.lessons.length} lessons complete · ${next.coach}` : "A calmer approach to doing what matters · 3 short lessons";
        $("#continue-progress-label").textContent = done ? `${Math.round(done / next.lessons.length * 100)}% complete` : "Ready when you are";
        $("#continue-progress").style.width = `${done / next.lessons.length * 100}%`;
        $("#continue-button").innerHTML = `${enrolledCourse ? (done === next.lessons.length ? "Review course" : "Continue learning") : "Start learning"} ${icons("Play")}`;
        $("#continue-button").dataset.course = next.id;
        $("#goal-list").innerHTML = state.goals.map((goal) =>
        {
            const checked = goal.steps.filter((step) => step.done).length;
            return `<div class="goal-item"><h3>${escape(goal.title)}</h3><span class="small">${checked} of ${goal.steps.length} milestones complete${goal.due ? ` · Due ${escape(goal.due)}` : ""}</span><div class="progress-track"><div style="width:${checked / goal.steps.length * 100}%"></div></div><button class="text-button" data-goal="${escape(goal.id)}">Check in ${icons("ArrowRight")}</button></div>`;
        }).join("");
        $("#saved-count").textContent = `${state.saved.filter((id) => id.startsWith("resource-")).length} saved`;
    }
    function courseDetail(id)
    {
        const course = findCourse(id);
        if (!course)
        {
            return;
        }
        const enrolled = state.enrolled.includes(id);
        const done = completedFor(id);
        openModal(course.title, `<p class="modal-description">${escape(course.description)}</p><span class="pill pale">${escape(course.topic)} · ${escape(course.level)}</span><p class="notice">Original short-form learning material · Illustrative coach: ${escape(course.coach)}. Free local enrollment. No payment, live instruction, accredited certificate, or real account.</p><ol class="lesson-list">${course.lessons.map((item, index) => `<li><span class="number">${done.includes(index) ? "✓" : `0${index + 1}`}</span><span>${escape(item.title)}</span><small>${item.minutes} min</small></li>`).join("")}</ol><p class="small muted">Read, reflect, and answer a knowledge check in each lesson. Your progress stays in this browser.</p><div class="modal-actions"><button class="button button-dark" data-enroll="${escape(id)}">${enrolled ? (done.length === course.lessons.length ? "View completion" : "Continue course") : "Enroll locally · Free"} ${icons("ArrowRight")}</button><button class="button button-outline" data-save="${escape(id)}">${state.saved.includes(id) ? "Saved to my list" : "Save for later"} ${icons("Bookmark")}</button></div>`, "LEARN AT YOUR OWN PACE");
    }
    function showLesson(id)
    {
        const course = findCourse(id);
        if (!course)
        {
            return;
        }
        const done = completedFor(id);
        if (done.length === course.lessons.length)
        {
            openModal("Look how far you’ve come.", `<div class="badge-tile">${icons("Award")}<span><strong>Course explorer</strong><small>${escape(course.title)}</small></span></div><p class="modal-description">You completed ${course.lessons.length} lessons, reflected on each idea, and passed every knowledge check. Now choose one idea to put into practice.</p><p class="notice">This is a local completion badge, not an accredited credential or evidence of professional certification.</p><div class="modal-actions"><button class="button button-dark" data-action="goal">Turn learning into a goal ${icons("Target")}</button><button class="button button-outline" data-review="${escape(id)}">Review lessons</button><button class="button button-outline" data-action="share">Share my progress</button></div>`, "A MOMENT WORTH CELEBRATING");
            return;
        }
        renderLesson(course, course.lessons.findIndex((item, index) => !done.includes(index)), false);
    }
    function renderLesson(course, index, review)
    {
        const item = course.lessons[index];
        activeLesson = {id: course.id, index};
        const reading = `<div class="lesson-text">${item.text.split("\n").map((paragraph) => `<p>${escape(paragraph)}</p>`).join("")}</div>`;
        if (review)
        {
            openModal(item.title, `${reading}<p class="notice"><strong>Practice prompt:</strong> ${escape(item.practice)}</p><p class="small muted">${escape(item.reason)}</p><div class="modal-actions"><button class="button button-outline" data-review="${escape(course.id)}" data-index="${Math.max(0, index - 1)}">Previous</button><button class="button button-dark" data-review="${escape(course.id)}" data-index="${Math.min(course.lessons.length - 1, index + 1)}">Next lesson</button><button class="button button-outline" data-course="${escape(course.id)}">Course overview</button></div>`, `REVIEW · LESSON ${index + 1} OF ${course.lessons.length}`);
            return;
        }
        openModal(item.title, `${reading}<form id="lesson-form"><label class="modal-form">Your reflection<textarea id="lesson-reflection" required minlength="10" maxlength="1500" placeholder="${escape(item.practice)}" aria-label="${escape(item.practice)}"></textarea></label><p class="small muted">At least 10 characters. Keep reflections free of sensitive information.</p><fieldset class="quiz"><legend>${escape(item.question)}</legend>${item.answers.map((answer, answerIndex) => `<label><input type="radio" name="answer" value="${answerIndex}" required>${escape(answer)}</label>`).join("")}</fieldset><p class="feedback" id="lesson-feedback" role="status"></p><button class="button button-dark" type="submit">Check & complete lesson ${icons("Check")}</button></form>`, `LESSON ${index + 1} OF ${course.lessons.length} · ${item.minutes} MIN READ & PRACTICE`);
    }
    function goalForm()
    {
        openModal("Give your next chapter a direction.", `<p class="modal-description">Make it personal, specific, and small enough to start.</p><form class="modal-form" id="goal-form"><label>What do you want to work toward?<input name="title" required maxlength="100" placeholder="Build confidence leading team meetings"></label><div class="form-row"><label>Target date<input name="due" type="date" min="${localDate(new Date())}" required></label><label>Related course<select name="course">${courses().map((course) => `<option value="${escape(course.id)}">${escape(course.title)}</option>`).join("")}</select></label></div><label>Three small milestones, one per line<textarea name="steps" required placeholder="Prepare a one-page meeting agenda&#10;Lead one team check-in&#10;Ask a teammate for feedback"></textarea></label><p class="small muted">Add 1–5 milestones. Progress is based on your own check-ins, not a verified career outcome.</p><p class="feedback" id="goal-feedback" role="status"></p><button class="button button-dark" type="submit">Create my plan ${icons("ArrowRight")}</button></form>`, "INTENTION → ACTION");
    }
    function goalDetail(id)
    {
        const goal = state.goals.find((item) => item.id === id);
        if (!goal)
        {
            return;
        }
        openModal(goal.title, `<p class="modal-description">Check off the steps you have actually taken. Small progress counts.</p>${goal.steps.map((step, index) => `<label class="check-row"><input type="checkbox" data-milestone="${index}" data-goal-id="${escape(id)}" ${step.done ? "checked" : ""}>${escape(step.text)}</label>`).join("")}<p class="notice" id="goal-status">${goal.steps.filter((step) => step.done).length} of ${goal.steps.length} milestones complete${goal.due ? ` · Target: ${escape(goal.due)}` : ""}</p><div class="modal-actions"><button class="button button-dark" data-course="${escape(goal.course)}">Open related course ${icons("BookOpen")}</button><button class="button button-outline" data-delete-goal="${escape(id)}">Remove goal</button></div>`, "YOUR PERSONAL GROWTH PLAN");
    }
    function localDate(date)
    {
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    }
    function coachDetail(name)
    {
        const alex = name === "Alex Morgan";
        openModal(name, `<p class="modal-description">${alex ? "A practical, reflective approach to leadership and career transitions. Explore your strengths, practice clearer conversations, and build a realistic next-step plan." : "A calm, structured approach to focus and sustainable habits. Bring one challenge; leave with one manageable experiment."}</p><span class="pill pale">${alex ? "Leadership · Career planning" : "Productivity · Habit design"}</span><p class="notice">Illustrative profile. Qualifications are not verified. All displayed times are simulated; no real availability, certification, video provider, or coach partnership is implied.</p><form class="modal-form" id="booking-form" data-name="${escape(name)}"><div class="form-row"><label>Preferred date<input type="date" name="date" min="${localDate(new Date())}" required></label><label>Local time<select name="time"><option>09:00</option><option>13:00</option><option>16:00</option></select></label></div><label>Session format<select name="format"><option>Video · 30 minutes</option><option>In person · 30 minutes</option></select></label><label>Focus for the conversation<input name="focus" required maxlength="150" placeholder="One area you would like to explore"></label><p class="small muted">Free simulation. No payment details requested. A local request is not a confirmed appointment.</p><p class="feedback" id="booking-feedback" role="status"></p><button class="button button-dark" type="submit">Save a demo request ${icons("CalendarDays")}</button></form>`, "A FRESH PERSPECTIVE");
    }
    function profileForm(onboarding = false)
    {
        openModal(onboarding ? "Let’s make room for your growth." : "A space that feels like you.", `<p class="modal-description">${onboarding ? "1. Choose a focus. 2. Try one short lesson. 3. Turn an idea into a goal. Start by making this space your own." : "Your preferences help you choose a starting point. No account or authentication is created."}</p><form class="modal-form" id="profile-form"><label>Display name<input name="name" value="${escape(state.profile.name)}" required maxlength="45" autocomplete="off"></label><label>Your current focus<select name="interest">${topics.map((topic) => `<option ${state.profile.interest === topic ? "selected" : ""}>${topic}</option>`).join("")}</select></label><label>Preferred coaching style<select name="style">${["Practical and structured", "Reflective and supportive", "Challenging and direct"].map((style) => `<option ${style === state.profile.style ? "selected" : ""}>${style}</option>`).join("")}</select></label><label>Weekly learning intention<select name="target">${[30, 60, 90, 120].map((minutes) => `<option value="${minutes}" ${Number(state.profile.target) === minutes ? "selected" : ""}>${minutes} minutes</option>`).join("")}</select></label><p class="notice">Browser-only profile. Use a nickname and avoid personal or sensitive information.</p><button class="button button-dark" type="submit">Save & explore my focus ${icons("ArrowRight")}</button></form>`, onboarding ? "A SIMPLE START" : "MY PREFERENCES");
    }
    function progressModal()
    {
        const lessons = totalLessons();
        const completedGoals = state.goals.filter((goal) => goal.steps.every((step) => step.done)).length;
        openModal("Every step is a step forward.", `<div class="progress-metrics"><div><strong>${lessons}</strong>lessons completed</div><div><strong>${finishedCourses().length}</strong>courses finished</div><div><strong>${completedGoals}</strong>goals achieved</div></div><p class="notice">Learning time: ${totalMinutes()} estimated lesson minutes. This adds the suggested durations of completed lessons, not measured screen time. Goals are self-reported. No third-party analytics or AI profiling.</p>${lessons ? `<div class="badge-tile">${icons("Sprout")}<span><strong>First step</strong><small>Earned by completing your first lesson</small></span></div>` : '<p class="modal-description">Your first badge starts with a single lesson. No previous activity is assumed.</p>'}${finishedCourses().map((course) => `<div class="badge-tile">${icons("Award")}<span><strong>Course explorer</strong><small>${escape(course.title)} · Local, non-accredited badge</small></span></div>`).join("")}<h3>My saved courses</h3>${state.saved.filter(findCourse).map((id) => `<p><button class="text-button" data-course="${escape(id)}">${escape(findCourse(id).title)} ${icons("ArrowRight")}</button></p>`).join("") || '<p class="small muted">Use the bookmark on a course to save it here.</p>'}<h3 style="margin-top:20px">My demo session requests</h3>${state.sessions.map((session) => `<div class="session-item"><strong>${escape(session.coach)}</strong><small>${escape(session.date)} · ${escape(session.time)} · ${escape(session.format)}</small><p>${escape(session.focus)}</p><span class="pill pale">Local request · not confirmed</span><button class="text-button" data-cancel-session="${escape(session.id)}">Remove request ${icons("X")}</button></div>`).join("") || '<p class="small muted">No local requests yet.</p>'}<div class="modal-actions"><button class="button button-dark" data-action="close">Keep growing</button><button class="button button-outline" data-action="share">Share progress ${icons("Share2")}</button></div>`, "YOUR PROGRESS, NOT A COMPETITION");
    }
    function resourceModal(id)
    {
        const reflection = id === "reflection";
        openModal(reflection ? "Your weekly reset" : "Listen to understand", reflection ? `<p class="modal-description">Take five minutes to look back with kindness. What gave you energy? What drained it? What is one small thing you will do differently next week?</p><form id="reflection-form" class="modal-form"><label>Your three-part reflection<textarea name="reflection" required minlength="10" maxlength="2000" placeholder="Keep: one thing that worked&#10;Release: one thing to simplify&#10;Try: one small next step">${escape(state.reflections || "")}</textarea></label><p class="small muted">Stored only in this browser. Keep sensitive information out of your notes.</p><button class="button button-dark" type="submit">Save my reflection ${icons("Check")}</button></form><div class="modal-actions"><button class="button button-outline" data-action="download-worksheet">Download blank worksheet ${icons("Download")}</button><button class="button button-outline" data-save-resource="${id}">${state.saved.includes(`resource-${id}`) ? "Unsave resource" : "Save resource"}</button></div>` : `<div class="lesson-text"><p>Most conversations contain a quiet choice: are you listening to understand, or waiting for your turn to speak? Understanding starts with a little space.</p><p><strong>Ask one open question.</strong> “What part of this feels hardest?” invites detail. “Why didn’t you just…?” can sound like a judgment before you know the context.</p><p><strong>Reflect before advising.</strong> Try “It sounds like the shifting deadline is making it hard to plan. Did I get that right?” Let the other person correct your understanding.</p><p><strong>Check the kind of help.</strong> Ask “Would a sounding board or a practical suggestion be more useful?” You do not have to solve everything to be helpful.</p><p>Try it today: in your next conversation, ask one follow-up question before sharing your own experience.</p></div><button class="button button-dark" data-save-resource="${id}">${state.saved.includes(`resource-${id}`) ? "Unsave resource" : "Save to my library"} ${icons("Bookmark")}</button>`, reflection ? "ORIGINAL WORKSHEET · 5 MIN" : "ORIGINAL ARTICLE · 4 MIN");
    }
    function communityModal()
    {
        openModal("There’s room for your small win.", `<p class="notice">Local demonstration forum. The starter prompt is editorial, not a real member post. Your replies are stored only in your browser and are not shared.</p><div class="community-post"><strong>This week’s reflection</strong><p>What is one small change that made your working day a little better?</p></div>${state.posts.map((post) => `<div class="community-post"><strong>${escape(post.name)} · Your local reply</strong><p>${escape(post.text)}</p></div>`).join("")}<form class="modal-form" id="community-form"><label>Share a small win<textarea name="post" required minlength="5" maxlength="600" placeholder="This week, I tried…"></textarea></label><button class="button button-dark" type="submit">Post locally ${icons("MessageCircle")}</button></form><div class="session-item"><span class="eyebrow">ILLUSTRATIVE WORKSHOP</span><h3>Your next chapter: a guided reflection</h3><p>A sample 30-minute online workshop · Last Friday of next month, 12:00 local time. No real host or event.</p><button class="text-button" data-action="event">${state.event ? "Remove local RSVP" : "Save a local RSVP"} ${icons("CalendarDays")}</button></div>`, "BETTER, TOGETHER");
    }
    function creatorModal()
    {
        openModal("Turn an idea into a short lesson.", `<p class="notice">Local coach studio demo. No coach role is authenticated. Publishing adds one course to this browser’s catalog only, not a public marketplace.</p><form class="modal-form" id="creator-form"><label>Course title<input name="title" required maxlength="90"></label><div class="form-row"><label>Topic<select name="topic">${topics.map((topic) => `<option>${topic}</option>`).join("")}</select></label><label>Level<select name="level"><option>Beginner</option><option>Intermediate</option></select></label></div><label>Learning outcome<input name="outcome" required minlength="10" maxlength="140" placeholder="What will a learner be able to do?"></label><label>Lesson title<input name="lessonTitle" required maxlength="90"></label><label>Lesson content<textarea name="text" required minlength="60" maxlength="4000" placeholder="Explain a useful idea with an example. At least 60 characters."></textarea></label><label>Reflection prompt<input name="practice" required minlength="10" maxlength="180"></label><label>Knowledge-check question<input name="question" required minlength="10" maxlength="180"></label><label>Correct answer<input name="correct" required maxlength="150"></label><label>One plausible incorrect answer<input name="incorrect" required maxlength="150"></label><button class="button button-dark" type="submit">Publish to this browser ${icons("Plus")}</button></form>`, "SHARE WHAT YOU KNOW");
    }
    function settingsModal()
    {
        openModal("A gentler kind of notification.", `<p class="modal-description">Choose what appears in your local notification center. No email, operating-system push, or background reminders are sent.</p><label class="check-row"><input type="checkbox" data-setting="releases" ${state.settings.releases ? "checked" : ""}>New learning suggestions</label><label class="check-row"><input type="checkbox" data-setting="reminders" ${state.settings.reminders ? "checked" : ""}>Goal check-in and session-request reminders</label><p class="notice">English-only homepage adaptation. Preferences and notifications stay in this browser.</p><button class="button button-dark" data-action="close">Done</button>`, "PREFERENCES");
    }
    function notificationsModal()
    {
        openModal("A little nudge, just for you.", `${state.settings.releases ? `<div class="session-item"><strong>Something to explore</strong><p>Your current focus is ${escape(state.profile.interest)}. Find one useful idea to try this week.</p></div>` : ""}${state.settings.reminders ? `<div class="session-item"><strong>Make time for a check-in</strong><p>You have ${state.goals.filter((goal) => goal.steps.some((step) => !step.done)).length} open goals and ${state.sessions.length} local session requests.</p></div>` : ""}${!state.settings.releases && !state.settings.reminders ? '<p class="modal-description">All suggestions are turned off. Your space, your pace.</p>' : ""}<p class="notice">These messages are computed locally when you open this panel. They are not real-time push notifications.</p><button class="button button-outline" data-action="settings">Manage preferences ${icons("Settings")}</button>`, "NOTIFICATION CENTER");
    }
    function setTopic(topic)
    {
        currentTopic = topic;
        document.querySelectorAll("[data-topic]").forEach((button) =>
        {
            button.classList.toggle("active", button.dataset.topic === topic);
            button.setAttribute("aria-pressed", String(button.dataset.topic === topic));
        });
        renderCourses();
    }
    function resetFilters()
    {
        $("#course-search").value = "";
        $("#level-filter").value = "";
        $("#coach-filter").value = "";
        allCourses = true;
        setTopic("All");
    }
    function revealSearch()
    {
        $("#filter-panel").hidden = false;
        $(".filter-toggle").setAttribute("aria-expanded", "true");
        $("#courses").scrollIntoView({behavior: "instant"});
        $("#course-search").focus();
    }
    const mobileNavigation = matchMedia("(max-width: 800px)");
    function syncNavigation()
    {
        $("#sidebar").inert = mobileNavigation.matches && !$("#sidebar").classList.contains("open");
    }
    mobileNavigation.addEventListener("change", syncNavigation);
    function download(filename, content)
    {
        const url = URL.createObjectURL(new Blob([content], {type: "text/plain;charset=utf-8"}));
        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        link.click();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
    }
    const actions =
    {
        close: closeModal,
        goal: goalForm,
        profile: () => profileForm(),
        onboarding: () => profileForm(true),
        progress: progressModal,
        privacy: () => openModal("A thoughtful demo. Honest boundaries.", '<p class="modal-description">Stride is a static, local professional-development learning demo. Short lessons, reflections, goal checklists, course creation, and learning progress work in your browser. The name and coach profiles are illustrative.</p><p class="notice">No production authentication, authorization, database, TLS configuration, OAuth, payment service, certified coaching, video meetings, public forum, third-party API, push service, machine-learning personalization, or accredited credentials are implemented. Enrollment is free and simulated. No real transactions are possible.</p><p class="modal-description">All notes and preferences remain in local browser storage. Nothing is sent to a server. No external fonts, tracking pixels, or analytics services are loaded. Clearing site data removes your work. Treat local storage as private to this device, not as secure storage.</p><p class="small muted">Original prompt: KingLeoJr, MIT License. Original artwork and educational text generated for this adaptation. This content is not medical advice, therapy, or a guarantee of career outcomes.</p>'),
        search: revealSearch,
        filters: () =>
        {
            $("#filter-panel").hidden = !$("#filter-panel").hidden;
            $(".filter-toggle").setAttribute("aria-expanded", String(!$("#filter-panel").hidden));
            if (!$("#filter-panel").hidden)
            {
                $("#course-search").focus();
            }
        },
        "clear-filters": resetFilters,
        "all-courses": () =>
        {
            resetFilters();
            toast("All courses are ready to explore.");
        },
        "create-course": creatorModal,
        notifications: notificationsModal,
        settings: settingsModal,
        community: communityModal,
        event: () =>
        {
            state.event = !state.event;
            persist();
            communityModal();
            toast(state.event ? "Sample event saved locally. No real reservation made." : "Local RSVP removed.");
        },
        menu: () =>
        {
            const open = $("#sidebar").classList.toggle("open");
            syncNavigation();
            $(".mobile-menu").setAttribute("aria-expanded", String(open));
            $(".mobile-menu").setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
        },
        share: () =>
        {
            const message = `I completed ${totalLessons()} lessons and ${finishedCourses().length} courses in my local Stride learning demo. One small step at a time.`;
            openModal("Progress worth putting into words.", `<p class="modal-description">Copy this text into a place of your choosing. No social account is connected and nothing is posted automatically.</p><textarea id="share-text" readonly aria-label="Your shareable progress">${escape(message)}</textarea><div class="modal-actions"><button class="button button-dark" data-action="copy-share">Copy progress ${icons("Share2")}</button></div>`);
        },
        "copy-share": async () =>
        {
            try
            {
                await navigator.clipboard.writeText($("#share-text").value);
                toast("Progress copied. Share it on your terms.");
            }
            catch
            {
                $("#share-text").focus();
                $("#share-text").select();
                toast("Select and copy the text with your keyboard.");
            }
        },
        "download-worksheet": () => download("stride-weekly-reset.txt", "YOUR WEEKLY RESET\n\nKeep: What worked this week?\n\nRelease: What could I simplify?\n\nTry: What is one small next step?\n\nPersonal reflection only. Do not include sensitive information.\n")
    };
    document.addEventListener("click", (event) =>
    {
        const button = event.target.closest("button, a");
        if (!button)
        {
            return;
        }
        const data = button.dataset;
        if (data.topic)
        {
            setTopic(data.topic);
        }
        else if (data.course)
        {
            event.preventDefault();
            courseDetail(data.course);
        }
        else if (data.enroll)
        {
            if (!state.enrolled.includes(data.enroll))
            {
                state.enrolled.push(data.enroll);
                persist();
                renderDashboard();
            }
            showLesson(data.enroll);
        }
        else if (data.save)
        {
            state.saved = state.saved.includes(data.save) ? state.saved.filter((id) => id !== data.save) : [...state.saved, data.save];
            persist();
            renderCourses();
            button.setAttribute("aria-pressed", String(state.saved.includes(data.save)));
            if (modal.open)
            {
                courseDetail(data.save);
            }
            toast(state.saved.includes(data.save) ? "Course saved to My learning." : "Course removed from your list.");
        }
        else if (data.review)
        {
            renderLesson(findCourse(data.review), Number(data.index || 0), true);
        }
        else if (data.goal)
        {
            goalDetail(data.goal);
        }
        else if (data.deleteGoal)
        {
            state.goals = state.goals.filter((goal) => goal.id !== data.deleteGoal);
            persist();
            renderDashboard();
            closeModal();
            toast("Goal removed. You can always start again.");
        }
        else if (data.coach)
        {
            coachDetail(data.coach);
        }
        else if (data.resource)
        {
            resourceModal(data.resource);
        }
        else if (data.saveResource)
        {
            const id = `resource-${data.saveResource}`;
            state.saved = state.saved.includes(id) ? state.saved.filter((item) => item !== id) : [...state.saved, id];
            persist();
            renderDashboard();
            resourceModal(data.saveResource);
            toast(state.saved.includes(id) ? "Resource saved in this browser." : "Resource removed from your saved list.");
        }
        else if (data.cancelSession)
        {
            state.sessions = state.sessions.filter((session) => session.id !== data.cancelSession);
            persist();
            progressModal();
            toast("Local session request removed.");
        }
        else if (data.nextLesson)
        {
            showLesson(data.nextLesson);
        }
        else if (data.action && actions[data.action])
        {
            actions[data.action]();
        }
        if (button.closest("#sidebar") && button.tagName === "A")
        {
            $("#sidebar").classList.remove("open");
            syncNavigation();
            $(".mobile-menu").setAttribute("aria-expanded", "false");
            $(".mobile-menu").setAttribute("aria-label", "Open navigation");
        }
    });
    document.addEventListener("change", (event) =>
    {
        const field = event.target;
        if (field.matches("#level-filter, #coach-filter"))
        {
            renderCourses();
        }
        if (field.dataset.milestone !== undefined)
        {
            const goal = state.goals.find((item) => item.id === field.dataset.goalId);
            goal.steps[Number(field.dataset.milestone)].done = field.checked;
            persist();
            renderDashboard();
            $("#goal-status").textContent = `${goal.steps.filter((step) => step.done).length} of ${goal.steps.length} milestones complete${goal.due ? ` · Target: ${goal.due}` : ""}`;
        }
        if (field.dataset.setting)
        {
            state.settings[field.dataset.setting] = field.checked;
            persist();
            toast("Local preferences saved.");
        }
    });
    $("#course-search").addEventListener("input", renderCourses);
    document.addEventListener("keydown", (event) =>
    {
        if (event.key === "/" && !modal.open && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName))
        {
            event.preventDefault();
            revealSearch();
        }
        if (event.key === "Escape" && $("#sidebar").classList.contains("open"))
        {
            $("#sidebar").classList.remove("open");
            syncNavigation();
            $(".mobile-menu").setAttribute("aria-expanded", "false");
            $(".mobile-menu").setAttribute("aria-label", "Open navigation");
            $(".mobile-menu").focus();
        }
    });
    document.addEventListener("submit", (event) =>
    {
        const form = event.target;
        event.preventDefault();
        const values = Object.fromEntries(new FormData(form));
        if (form.id === "lesson-form")
        {
            const course = findCourse(activeLesson.id);
            const item = course.lessons[activeLesson.index];
            if (Number(values.answer) !== item.correct)
            {
                $("#lesson-feedback").textContent = `Not quite. ${item.reason} Try another answer.`;
                return;
            }
            if (!completedFor(course.id).includes(activeLesson.index))
            {
                state.completed[course.id] = [...completedFor(course.id), activeLesson.index];
                state.completionEvents = [...(state.completionEvents || []), {course: course.id, lesson: activeLesson.index, at: new Date().toISOString()}];
                persist();
                renderDashboard();
            }
            $("#lesson-feedback").classList.add("success");
            $("#lesson-feedback").textContent = `Exactly. ${item.reason} Your reflection was used for this exercise and is not retained.`;
            form.querySelector('button[type="submit"]').outerHTML = `<button type="button" class="button button-dark" data-next-lesson="${escape(course.id)}">${completedFor(course.id).length === course.lessons.length ? "See my achievement" : "Next lesson"} ${icons("ArrowRight")}</button>`;
            form.querySelectorAll("input, textarea").forEach((field) => { field.disabled = true; });
        }
        if (form.id === "goal-form")
        {
            const steps = values.steps.split("\n").map((text) => text.trim()).filter(Boolean);
            if (!values.title.trim() || steps.length < 1 || steps.length > 5 || steps.some((text) => text.length > 160) || values.due < localDate(new Date()))
            {
                $("#goal-feedback").textContent = "Add a goal title, a current or future date, and 1–5 milestones of up to 160 characters each.";
                return;
            }
            const id = `goal-${crypto.randomUUID()}`;
            state.goals.push({id, title: values.title.trim(), due: values.due, course: values.course, steps: steps.map((text) => ({text, done: false}))});
            persist();
            renderDashboard();
            goalDetail(id);
            toast("A new direction, one small step at a time.");
        }
        if (form.id === "booking-form")
        {
            const selected = new Date(`${values.date}T${values.time}:00`);
            if (!values.focus.trim() || !Number.isFinite(selected.getTime()) || selected <= new Date())
            {
                $("#booking-feedback").textContent = "Choose a future local date and time, and enter a focus for the conversation.";
                return;
            }
            state.sessions.push({id: crypto.randomUUID(), coach: form.dataset.name, ...values, focus: values.focus.trim()});
            persist();
            progressModal();
            toast("Demo request saved locally. No coach was contacted.");
        }
        if (form.id === "profile-form")
        {
            if (!values.name.trim())
            {
                return;
            }
            state.profile = {name: values.name.trim(), interest: values.interest, style: values.style, target: Number(values.target)};
            persist();
            renderDashboard();
            setTopic(values.interest);
            closeModal();
            $("#courses").scrollIntoView({behavior: "instant"});
            toast("Preferences saved. Explore courses in your chosen focus.");
        }
        if (form.id === "reflection-form")
        {
            state.reflections = values.reflection.trim();
            persist();
            toast("Your weekly reflection is saved in this browser.");
        }
        if (form.id === "community-form")
        {
            if (!values.post.trim())
            {
                return;
            }
            state.posts.push({name: state.profile.name, text: values.post.trim()});
            persist();
            communityModal();
            toast("Reply saved locally. It is not publicly visible.");
        }
        if (form.id === "creator-form")
        {
            if (Object.values(values).some((value) => !value.trim()) || values.correct.trim().toLowerCase() === values.incorrect.trim().toLowerCase())
            {
                toast("Complete every field and use two different answers.");
                return;
            }
            const id = `local-${crypto.randomUUID()}`;
            state.customCourses.push({id, title: values.title.trim(), topic: values.topic, coach: state.profile.name, level: values.level, description: values.outcome.trim(), color: "#dce4ca", art: "steps", lessons: [lesson(values.lessonTitle.trim(), values.text.trim(), values.practice.trim(), values.question.trim(), [values.correct.trim(), values.incorrect.trim()], 0, `The key idea: ${values.correct.trim()}`, 5)]});
            persist();
            resetFilters();
            closeModal();
            $("#courses").scrollIntoView({behavior: "instant"});
            toast("Course published to this browser only.");
        }
    });
    renderCourses();
    renderDashboard();
    syncNavigation();
    if (!storageAvailable)
    {
        toast("Storage could not be read. You can learn for this visit; persistent saving may be unavailable.");
    }
})();
