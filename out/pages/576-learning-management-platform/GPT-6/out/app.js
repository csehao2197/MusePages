const STORAGE_KEY = "forma-learning-v1";
const icon = (name) => `<svg aria-hidden="true"><use href="icons.svg#${name}"></use></svg>`;
const escapeHTML = (value) => String(value).replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[character]));
const courses = [
    { id: "design", title: "Foundations of user experience", category: "Design", instructor: "Olivia Chen", art: "design", artTitle: "Design for<br>the human.", time: "2h 40m", lessons: ["Start with empathy", "Frame the right problem", "Test your assumptions"] },
    { id: "strategy", title: "Brand strategy, from the ground up", category: "Business", instructor: "Marcus Williams", art: "strategy", artTitle: "Ideas into<br>impact.", time: "3h 15m", lessons: ["Find your purpose", "Know your audience", "Tell a clear story"] },
    { id: "code", title: "Creative coding for the curious", category: "Development", instructor: "Alex Morgan", art: "code", artTitle: "Make it.<br>Make it yours.", time: "4h 10m", lessons: ["A canvas of possibilities", "Patterns and loops", "Create a small system"] },
    { id: "writing", title: "Write stories that stay with people", category: "Writing", instructor: "Emma Rivera", art: "writing", artTitle: "Find your<br>own voice.", time: "2h 20m", lessons: ["Notice the ordinary", "Build a narrative", "Edit with intention"] }
];
let state = { name: "Jamie Lee", role: "Student", enrolled: ["design", "strategy", "code"], progress: { design: 1, strategy: 2, code: 1 }, weekly: true, reminders: false, read: false, custom: [] };
let storageAvailable = true;
try
{
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    if (saved && typeof saved === "object")
    {
        if (typeof saved.name === "string" && saved.name.trim()) state.name = saved.name.slice(0, 40);
        if (["Student", "Instructor", "Admin"].includes(saved.role)) state.role = saved.role;
        if (Array.isArray(saved.custom))
        {
            state.custom = saved.custom.filter((item) => item && /^custom-\d+$/.test(item.id) && typeof item.title === "string" && typeof item.description === "string").slice(0, 10).map((item) => ({ ...item, title: item.title.slice(0, 70), description: item.description.slice(0, 500) }));
        }
        const valid = [...courses.map((item) => item.id), ...state.custom.map((item) => item.id)];
        if (Array.isArray(saved.enrolled)) state.enrolled = [...new Set(saved.enrolled.filter((id) => valid.includes(id)))];
        if (saved.progress && typeof saved.progress === "object")
        {
            for (const id of valid) state.progress[id] = Math.max(0, Math.min(3, Number.isInteger(saved.progress[id]) ? saved.progress[id] : 0));
        }
        for (const key of ["weekly", "reminders", "read"]) if (typeof saved[key] === "boolean") state[key] = saved[key];
    }
}
catch
{
    storageAvailable = false;
}
let currentFilter = "progress";
let query = "";
let searchNavigation = false;
let month = 10;
let year = 2026;
let toastTimer;
const $ = (selector) => document.querySelector(selector);
const dialog = $("#dialog");
function save()
{
    try
    {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
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
    $("#toast").classList.add("visible");
    toastTimer = setTimeout(() => $("#toast").classList.remove("visible"), 4500);
}
function allCourses()
{
    return [...courses, ...state.custom.map((item) => ({ ...item, category: "Your studio", instructor: state.name, art: "writing", artTitle: "Your next<br>chapter.", time: "Self-paced", lessons: ["Read the course brief", "Practice the idea", "Reflect and review"] }))];
}
function openDialog(title, content, kicker = "FORMA WORKSPACE")
{
    $("#dialog-title").textContent = title;
    $("#dialog-kicker").textContent = kicker;
    $("#dialog-content").innerHTML = content;
    if (!dialog.open) dialog.showModal();
}
$("#close-dialog").addEventListener("click", () => dialog.close());
dialog.addEventListener("keydown", (event) =>
{
    if (event.key !== "Tab") return;
    const controls = [...dialog.querySelectorAll("button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), a[href]")].filter((element) => element.getClientRects().length);
    const first = controls[0];
    const last = controls[controls.length - 1];
    if (event.shiftKey && document.activeElement === first)
    {
        event.preventDefault();
        last?.focus();
    }
    else if (!event.shiftKey && document.activeElement === last)
    {
        event.preventDefault();
        first?.focus();
    }
});
dialog.addEventListener("click", (event) =>
{
    if (event.target === dialog)
    {
        const bounds = dialog.getBoundingClientRect();
        if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
    }
});
function card(course, catalog = false)
{
    const complete = state.progress[course.id] || 0;
    const percent = Math.round(complete / 3 * 100);
    const enrolled = state.enrolled.includes(course.id);
    return `<article class="course-card"><div class="course-art art-${course.art}" aria-hidden="true"><span class="art-word">${course.artTitle}</span></div><div class="course-content"><span class="course-category">${escapeHTML(course.category)}</span><h3>${escapeHTML(course.title)}</h3><p class="instructor">with ${escapeHTML(course.instructor)}</p><div class="progress-label"><span>${enrolled ? `${complete} of 3 lessons complete` : "A new direction awaits"}</span><strong>${enrolled ? percent + "%" : "Free demo"}</strong></div><progress value="${enrolled ? complete : 0}" max="3" aria-label="${escapeHTML(course.title)} progress"></progress><div class="course-bottom"><span>${icon("clock-3")} ${course.time}</span><button data-${catalog && !enrolled ? "enroll" : "resume"}="${course.id}" aria-label="${catalog && !enrolled ? "Enroll in" : "Open"} ${escapeHTML(course.title)}">${catalog && !enrolled ? "Enroll free" : complete === 3 ? "Review" : "Continue"} ${icon("arrow-right")}</button></div></div></article>`;
}
function render()
{
    const view = ["learning", "catalog", "calendar", "certificates"].includes(location.hash.slice(1)) ? location.hash.slice(1) : "learning";
    const titles = { learning: "My learning", catalog: "Explore courses", calendar: "My calendar", certificates: "Certificates" };
    $("#page-title").textContent = titles[view];
    $("#breadcrumb").textContent = titles[view];
    document.title = `${titles[view]} — Forma`;
    $("#page-subtitle").textContent = { learning: "A little more curious. A little further along.", catalog: "Follow your curiosity. Find your next chapter.", calendar: "Make a little time for your future self.", certificates: "Small steps deserve to be celebrated." }[view];
    document.querySelectorAll("[data-nav]").forEach((link) =>
    {
        const active = link.dataset.nav === view;
        link.classList.toggle("active", active);
        if (active) link.setAttribute("aria-current", "page");
        else link.removeAttribute("aria-current");
    });
    $("#learning-view").hidden = view !== "learning";
    $("#other-view").hidden = view === "learning";
    $("#customize").hidden = view !== "learning";
    $("#profile-name").textContent = state.name;
    $("#profile-name").nextElementSibling.textContent = `${state.role} · Local demo`;
    $("#greeting-name").textContent = state.name.split(" ")[0];
    document.querySelectorAll(".avatar").forEach((avatar) => avatar.textContent = state.name.split(" ").slice(0, 2).map((part) => part[0] || "").join("").toUpperCase());
    const enrolled = allCourses().filter((course) => state.enrolled.includes(course.id));
    const active = enrolled.filter((course) => (state.progress[course.id] || 0) < 3);
    const completed = enrolled.filter((course) => state.progress[course.id] === 3);
    const total = enrolled.reduce((sum, course) => sum + (state.progress[course.id] || 0), 0);
    $("#active-stat").textContent = active.length;
    $("#lesson-stat").innerHTML = `${total} <em>lessons</em>`;
    $("#certificate-stat").textContent = completed.length;
    $("#weekly-total").textContent = total;
    $("#weekly-widget").hidden = !state.weekly;
    $(".notification-button i").hidden = state.read;
    $("#notifications").setAttribute("aria-label", state.read ? "Notifications, all read" : "Notifications, 2 unread");
    $("#search").placeholder = view === "catalog" ? "Search all courses" : "Search your courses";
    if (view === "learning")
    {
        const list = (currentFilter === "progress" ? active : currentFilter === "completed" ? completed : enrolled).filter(matches);
        $("#course-count").textContent = list.length;
        $("#courses").innerHTML = list.map((course) => card(course)).join("") || `<div class="empty"><h3>${query ? "No courses found" : currentFilter === "completed" ? "Your first milestone is ahead" : "A fresh start"}</h3><p>${query ? "Try a title, topic, or instructor name." : "Explore a course or complete three lessons to earn a demo certificate."}</p><a class="button secondary" href="#catalog">Explore courses ${icon("arrow-right")}</a></div>`;
        document.querySelectorAll("[data-filter]").forEach((button) =>
        {
            button.classList.toggle("selected", button.dataset.filter === currentFilter);
            button.setAttribute("aria-pressed", String(button.dataset.filter === currentFilter));
        });
    }
    if (view === "catalog")
    {
        const list = allCourses().filter(matches);
        $("#other-view").innerHTML = `<div class="catalog-intro"><p class="eyebrow">LEARN SOMETHING THAT MOVES YOU</p><h2>Curiosity looks good on you.</h2><p>Short, thoughtful courses. Room to practice. Your own pace.</p><span class="notice">Local demo: enrollment is free and stored only in this browser.</span></div><div class="section-heading"><h2>Find your next chapter</h2>${state.role !== "Student" ? '<button class="button dark" id="create-course">Create demo course</button>' : "<span>4 curated sample courses</span>"}</div><p class="calendar-help">${list.length} course${list.length === 1 ? "" : "s"} · Search by title, topic, or instructor</p><div class="course-grid">${list.map((course) => card(course, true)).join("") || '<div class="empty">No courses match your search. Try another topic.</div>'}</div>`;
    }
    if (view === "calendar") renderCalendar();
    if (view === "certificates")
    {
        $("#other-view").innerHTML = `<div class="catalog-intro"><h2>Look how far you’ve come.</h2><p>Complete all three lessons in any course to unlock a keepsake.</p><span class="notice">Demo certificates are not accredited or independently verified credentials.</span></div><div class="course-grid">${completed.map((course) => `<article class="certificate">${icon("award")}<p class="eyebrow">CERTIFICATE OF COMPLETION</p><h3>${escapeHTML(course.title)}</h3><p>Awarded to ${escapeHTML(state.name)}</p><button class="button dark" data-certificate="${course.id}">Download demo certificate ${icon("download")}</button></article>`).join("") || '<div class="empty"><h3>Your next milestone is waiting.</h3><p>Finish a course to see your first certificate here.</p><a class="button dark" href="#learning">Continue learning</a></div>'}</div>`;
    }
}
function matches(course)
{
    return `${course.title} ${course.category} ${course.instructor}`.toLowerCase().includes(query);
}
function renderCalendar()
{
    const start = new Date(year, month, 1).getDay();
    const count = new Date(year, month + 1, 0).getDate();
    const title = new Date(year, month, 1).toLocaleString("en-US", { month: "long", year: "numeric" });
    $("#other-view").innerHTML = `<div class="calendar-heading"><h2>${title}</h2><button class="icon-button" id="previous-month" aria-label="Previous month">${icon("chevron-left")}</button><button class="button secondary" id="calendar-today">Sample month</button><button class="icon-button" id="next-month" aria-label="Next month">${icon("chevron-right")}</button></div><div class="calendar-grid" aria-label="${title} calendar">${["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => `<div class="weekday">${day}</div>`).join("")}${Array.from({ length: start }, () => "<div></div>").join("")}${Array.from({ length: count }, (_, index) => `<div>${index + 1}${year === 2026 && month === 10 && index === 18 ? '<button class="calendar-event" id="calendar-session">10 AM<br>Design studio</button>' : ""}</div>`).join("")}</div><p class="calendar-help">Sample schedule · November 19, 2026 · Times shown in local time. No live classroom or calendar service is connected.</p><button class="button secondary" id="schedule-settings">Manage local reminder</button>`;
}
function lesson(id)
{
    const course = allCourses().find((item) => item.id === id);
    if (!course || !state.enrolled.includes(id)) return;
    const complete = state.progress[id] || 0;
    const index = Math.min(complete, 2);
    const content = {
        design: [
            ["Start with a person, not a feature.", "A useful product begins with a real situation. Ask someone to describe the last time they tried to solve a problem. Look for what they did, not only what they say they want.", "Write one observation without adding a solution."],
            ["A better question makes room for a better answer.", "Turn an observation into a focused problem statement. Name the person, the need, and the reason it matters. Avoid deciding on a feature before you understand the need.", "Rewrite “We need an app” as a question beginning “How might we…”."],
            ["Make it small enough to learn from.", "A prototype is a question you can put in front of someone. Sketch one essential flow, give a participant a task, and watch quietly. Note where expectations and actions differ.", "Sketch three screens. Ask someone to complete one task without your help."]
        ],
        strategy: [
            ["Start with why it matters.", "A brand is a promise people learn to recognize. Write down what you help people do and why that outcome is worth caring about.", "Describe your purpose in one sentence without using a product name."],
            ["Specific is more useful than everyone.", "An audience is a group with shared needs, not just shared ages. Listen for frustrations, motivations, and the trade-offs people already make.", "List a need, a barrier, and a desired outcome for one audience."],
            ["Clarity is a generous choice.", "A strong brand story connects a real customer need to a credible promise. Use plain language, choose one idea, and support it with something concrete.", "Write a two-sentence brand promise and one piece of evidence."]
        ],
        code: [
            ["Every system begins with a mark.", "Creative code uses instructions to make visual decisions. Think in coordinates, shapes, and rules before thinking about complexity.", "On paper, describe a drawing using only circles and coordinates."],
            ["Let a simple rule do the work.", "A loop repeats a set of instructions. Change a value each time and a simple mark becomes a pattern. Try varying position, scale, and spacing one at a time.", "Sketch six circles. Increase each radius by the same amount."],
            ["Constraints can be creative tools.", "A small generative system combines a few rules. Choose a palette, repeat a shape, and set a boundary. Change one parameter and compare the results.", "Write three rules for a pattern and create two variations."]
        ],
        writing: [
            ["Attention is where a story starts.", "Small details make a scene feel lived in. Record what you can see, hear, and touch before explaining what it means.", "Describe one room in three specific sentences."],
            ["Give the reader a reason to follow.", "A narrative moves when someone wants something and meets an obstacle. Make the desire clear, then show what changes.", "Write a beginning, a turning point, and an ending."],
            ["Leave what matters.", "Revision is a conversation with your first draft. Read aloud. Remove repeated ideas and replace abstract language with concrete details.", "Cut one paragraph by a third while preserving its meaning."]
        ]
    };
    const block = content[id]?.[index] || ["Put your idea into practice.", course.description || "Read the brief, practice the concept, and reflect on what you learned.", "Write down one thing you will try next."];
    openDialog(course.lessons[index], `<p>${escapeHTML(course.title)} · Lesson ${index + 1} of 3 · Reading lesson</p><div class="lesson-outline">${course.lessons.map((title, number) => `<span class="${number < complete ? "done" : ""}">${number < complete ? "✓ " : ""}${number + 1}. ${escapeHTML(title)}</span>`).join("")}</div><article class="lesson-paper"><h3>${escapeHTML(block[0])}</h3><p>${escapeHTML(block[1])}</p><strong>Try it yourself</strong><p>${escapeHTML(block[2])}</p></article><p class="notice">This static demo contains short original reading lessons, not a video library. Progress is saved on this browser only.</p><div class="dialog-actions">${complete < 3 ? `<button class="button dark" id="complete-lesson">Mark lesson complete ${icon("check")}</button>` : '<button class="button dark" id="show-certificates">View your certificate</button>'}<button class="button secondary" id="practice-quiz">Try a knowledge check</button></div>`, complete === 3 ? "COURSE COMPLETED · REVIEW" : "YOUR NEXT SMALL STEP");
    $("#complete-lesson")?.addEventListener("click", () =>
    {
        state.progress[id] = Math.min(3, complete + 1);
        save();
        render();
        if (state.progress[id] === 3)
        {
            toast("Course complete. Your demo certificate is ready!");
            lesson(id);
        }
        else
        {
            toast("Progress saved. One step further.");
            lesson(id);
        }
    });
    $("#show-certificates")?.addEventListener("click", () =>
    {
        dialog.close();
        location.hash = "certificates";
    });
    $("#practice-quiz").addEventListener("click", () => quiz(id));
}
function quiz(id)
{
    openDialog("A quick reflection", `<form id="quiz-form"><fieldset><legend>What is the best first step when solving a new problem?</legend><label class="quiz-option"><input required type="radio" name="answer" value="feature"> Build every feature you can imagine</label><label class="quiz-option"><input required type="radio" name="answer" value="need"> Understand the person and their needs</label><label class="quiz-option"><input required type="radio" name="answer" value="guess"> Choose a solution without asking questions</label></fieldset><p id="quiz-result" role="status"></p><div class="dialog-actions"><button class="button dark" type="submit">Check answer</button><button class="button secondary" type="button" id="back-lesson">Back to lesson</button></div></form>`, "OPTIONAL PRACTICE · NOT GRADED");
    $("#quiz-form").addEventListener("submit", (event) =>
    {
        event.preventDefault();
        const correct = new FormData(event.target).get("answer") === "need";
        $("#quiz-result").textContent = correct ? "Exactly. Understanding a real need gives your work direction." : "Not quite. Start by learning who you are helping and what they need. Try again.";
    });
    $("#back-lesson").addEventListener("click", () => lesson(id));
}
function profile()
{
    openDialog("Make this space yours", `<p class="notice">Demo profile only. There is no sign-in, authorization, or secure account. Roles change the local preview, not access permissions.</p><form id="profile-form"><label class="form-field">Display name<input name="name" required maxlength="40" value="${escapeHTML(state.name)}" autocomplete="off"></label><label class="form-field">Preview role<select name="role">${["Student", "Instructor", "Admin"].map((role) => `<option${role === state.role ? " selected" : ""}>${role}</option>`).join("")}</select></label><p>Instructor and Admin previews can create a local text course in Explore courses. No student records, publishing, or backend management are available.</p><button class="button dark" type="submit">Save demo profile</button></form>`);
    $("#profile-form").addEventListener("submit", (event) =>
    {
        event.preventDefault();
        const values = new FormData(event.target);
        if (!values.get("name").trim()) return;
        state.name = values.get("name").trim();
        state.role = values.get("role");
        save();
        render();
        dialog.close();
        toast("Demo profile updated.");
    });
}
function session()
{
    openDialog("Designing with intention", `<p>Thursday, November 19, 2026 · 10:00–11:00 AM local time</p><div class="lesson-paper"><h3>A thoughtful hour in the studio.</h3><p>Sample agenda with Olivia Chen:</p><ol><li>10:00 — Welcome and a design observation</li><li>10:15 — Reframe a real-world problem</li><li>10:40 — Share a sketch and reflect</li></ol></div><p class="notice">Sample event only. No live call, real instructor attendance, email, push notifications, or background reminders are connected.</p><label class="check-field"><input type="checkbox" id="reminder" ${state.reminders ? "checked" : ""}><span>Save an in-app reminder preference on this browser</span></label>`, "YOUR CALENDAR · SAMPLE SESSION");
    $("#reminder").addEventListener("change", (event) =>
    {
        state.reminders = event.target.checked;
        save();
        toast(state.reminders ? "Local reminder preference saved." : "Local reminder preference removed.");
    });
}
function createCourse()
{
    if (state.role === "Student") return;
    openDialog("Start a small learning journey", `<p class="notice">Local text-course authoring demo. Not a publishing service or rich-text editor. Maximum 10 personal courses.</p><form id="course-form"><label class="form-field">Course title<input name="title" required maxlength="70"></label><label class="form-field">Course brief<textarea name="description" required maxlength="500" rows="5"></textarea></label><button class="button dark" type="submit">Create local course</button></form>`, "INSTRUCTOR STUDIO · LOCAL PREVIEW");
    $("#course-form").addEventListener("submit", (event) =>
    {
        event.preventDefault();
        const values = new FormData(event.target);
        if (!values.get("title").trim() || !values.get("description").trim()) return;
        if (state.custom.length >= 10)
        {
            toast("This demo supports up to 10 personal courses.");
            return;
        }
        const id = `custom-${Date.now()}`;
        state.custom.push({ id, title: values.get("title").trim(), description: values.get("description").trim() });
        state.enrolled.push(id);
        state.progress[id] = 0;
        save();
        render();
        dialog.close();
        toast("Local course created and added to your learning.");
    });
}
document.addEventListener("click", (event) =>
{
    const enroll = event.target.closest("[data-enroll]");
    const resume = event.target.closest("[data-resume]");
    const certificate = event.target.closest("[data-certificate]");
    const filter = event.target.closest("[data-filter]");
    if (enroll)
    {
        const id = enroll.dataset.enroll;
        if (!state.enrolled.includes(id)) state.enrolled.push(id);
        state.progress[id] ||= 0;
        save();
        render();
        toast("Enrolled locally. Your next chapter is ready.");
    }
    if (resume) lesson(resume.dataset.resume);
    if (certificate)
    {
        const course = allCourses().find((item) => item.id === certificate.dataset.certificate);
        const text = `FORMA — DEMO CERTIFICATE OF COMPLETION\n\n${state.name}\n\nhas completed the three short sample lessons in\n${course.title}\n\nThis is a local demonstration keepsake, not an accredited,\nverified, blockchain-backed, or professional credential.\n`;
        const url = URL.createObjectURL(new Blob([text], { type: "text/plain;charset=utf-8" }));
        const link = document.createElement("a");
        link.href = url;
        link.download = `forma-${course.id}-demo-certificate.txt`;
        link.click();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
        toast("Demo certificate downloaded.");
    }
    if (filter)
    {
        currentFilter = filter.dataset.filter;
        render();
    }
    if (event.target.closest("#create-course")) createCourse();
    if (event.target.closest("#calendar-session, #schedule-settings")) session();
    if (event.target.closest("#previous-month"))
    {
        if (--month < 0)
        {
            month = 11;
            year--;
        }
        renderCalendar();
    }
    if (event.target.closest("#next-month"))
    {
        if (++month > 11)
        {
            month = 0;
            year++;
        }
        renderCalendar();
    }
    if (event.target.closest("#calendar-today"))
    {
        month = 10;
        year = 2026;
        renderCalendar();
    }
});
$("#hero-resume").addEventListener("click", () =>
{
    const next = allCourses().find((course) => state.enrolled.includes(course.id) && (state.progress[course.id] || 0) < 3);
    if (next) lesson(next.id);
    else location.hash = "catalog";
});
$("#profile").addEventListener("click", profile);
$("#top-profile").addEventListener("click", profile);
$("#session-details").addEventListener("click", session);
$("#find-course").addEventListener("click", () => location.hash = "catalog");
$("#view-all").addEventListener("click", () =>
{
    currentFilter = "all";
    query = "";
    $("#search").value = "";
    render();
});
$("#search").addEventListener("input", (event) =>
{
    query = event.target.value.trim().toLowerCase();
    if (!["learning", "catalog", ""].includes(location.hash.slice(1)))
    {
        searchNavigation = true;
        location.hash = "catalog";
    }
    render();
});
document.addEventListener("keydown", (event) =>
{
    if (event.key === "/" && !["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement.tagName) && !dialog.open)
    {
        event.preventDefault();
        $("#search").focus();
    }
});
$("#customize").addEventListener("click", () =>
{
    openDialog("Your dashboard, your rhythm", `<p>Keep the things that help you focus. This preference stays on this browser.</p><label class="check-field"><input id="show-weekly" type="checkbox" ${state.weekly ? "checked" : ""}> Show the learning rhythm widget</label><p class="notice">The initial streak and activity bars are sample data. Course completion totals reflect your local progress.</p><button class="button dark" id="save-customization">Save dashboard</button>`);
    $("#save-customization").addEventListener("click", () =>
    {
        state.weekly = $("#show-weekly").checked;
        save();
        render();
        dialog.close();
        toast("Your dashboard is updated.");
    });
});
$("#notifications").addEventListener("click", () =>
{
    openDialog("A little heads-up", `<article class="lesson-paper"><strong>Make time for your next chapter</strong><p>Your sample Design Studio is scheduled for November 19 at 10 AM.</p><strong>Your learning space is ready</strong><p>Three sample courses are waiting. Try a lesson, check your understanding, and save your progress.</p></article><p class="notice">Seeded in-app demo notifications. No live forum, email, or server notifications.</p><button class="button dark" id="mark-read">${state.read ? "All caught up" : "Mark all as read"}</button>`);
    $("#mark-read").addEventListener("click", () =>
    {
        state.read = true;
        save();
        render();
        $("#mark-read").textContent = "All caught up";
        toast("All notifications marked as read.");
    });
});
$("#demo-info").addEventListener("click", () =>
{
    openDialog("A small, self-contained learning space", `<p>Forma is a static homepage demonstration with four original short courses, a practice quiz, local enrollment, lesson progress, sample scheduling, demo profiles, and text certificate downloads.</p><p>Everything stays in this browser. ${storageAvailable ? "Browser storage is available." : "Browser storage is unavailable; changes last only for this visit."} No personal information is sent to a server.</p><p class="notice">No real authentication, payments, video, chat, plagiarism checks, AI tutoring, proctoring, accreditation, or live classes. Role previews do not provide authorization. This is not a production LMS.</p><p>Sample instructors and events are fictional. Artwork is original. Icons: Lucide.</p>`);
});
window.addEventListener("hashchange", () =>
{
    if (!searchNavigation)
    {
        query = "";
        $("#search").value = "";
    }
    render();
    if (!searchNavigation) $("#main").focus({ preventScroll: true });
    searchNavigation = false;
});
render();
