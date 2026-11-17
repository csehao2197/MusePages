export const content =
{
    brand: "Mara Ellison Tutoring",
    tutor: "Mara Ellison",
    subjects: ["Mathematics", "Physics"],
    location: "Cambridge, Massachusetts",
    timezone: "America/New_York",
    rate: "$68",
    navigation: [["subjects", "Subjects"], ["process", "How it works"], ["progress", "Sample progress"], ["pricing", "Pricing"], ["availability", "Availability"]],
    levels:
    {
        Mathematics:
        [
            ["Foundations", "Grades 8–9", "Fractions, linear equations, and turning word problems into workable steps", ["Fractions & proportions", "Linear equations", "Word-problem setup"]],
            ["Core high school", "Grades 9–11", "Algebra I and II, geometry, functions, and clear written reasoning", ["Algebra I & II", "Geometry & functions", "Written reasoning"]],
            ["Advanced and exam prep", "Grades 11–12", "Precalculus, calculus readiness, and timed mixed-problem practice", ["Precalculus", "Calculus readiness", "Timed mixed practice"]]
        ],
        Physics:
        [
            ["Foundations", "Grades 8–9", "Measurement, graphs, and scientific reasoning", ["Measurement", "Reading graphs", "Scientific reasoning"]],
            ["Core high school", "Grades 10–11", "Forces, energy, circuits, and diagram-first problem solving", ["Forces & energy", "Circuits", "Diagram-first solving"]],
            ["Advanced and exam prep", "Grades 11–12", "Momentum, fields, and structured exam-style problems", ["Momentum", "Fields", "Exam-style problems"]]
        ]
    },
    steps:
    [
        ["Free intro", "A 20-minute conversation about current work, goals, and fit."],
        ["Personal starting plan", "Mara Ellison identifies two priorities and agrees on a manageable weekly rhythm."],
        ["Focused 60-minute session", "Work through one concept, guided examples, and increasingly independent practice."],
        ["Short weekly recap", "Receive what clicked, what needs another look, and one concrete practice priority."]
    ],
    samples:
    [
        ["Algebra II", "8 weekly sessions", "Practice-set accuracy", "61%", "79%", 61, 79, "on equivalent mixed sets", "functions and multi-step setup", "timed practice without a worked example"],
        ["Physics", "6 weekly sessions", "Five-problem check", "2", "4", 40, 80, "correct out of five", "drawing and labeling force diagrams before calculating", "mixed force and energy problems"],
        ["Study routine", "4 weekly sessions", "Planned review blocks", "0", "3", 0, 75, "completed per week", "a short weekly plan and closed-book recall", "protect the routine during a busy assessment week"]
    ],
    packages:
    [
        ["Free intro", 0, "20 minutes", "Talk through current work and goals, ask about fit, and decide whether to continue.", "Book free intro"],
        ["Single session", 1, "60 minutes", "One tailored lesson, a short session note, and three targeted practice prompts.", "Choose single session"],
        ["Four-session plan", 4, "Four weekly 60-minute lessons", "Includes everything in Single session plus a weekly recap and one agreed practice plan.", "Choose four sessions"]
    ],
    faqs:
    [
        ["What happens on the free intro call?", "We discuss current work, what feels difficult, and what a useful first month could look like. There is no sales script and no obligation to continue."],
        ["Do sessions include homework?", "Only when it helps. The tutor suggests a short, specific practice task rather than an automatic worksheet pile."],
        ["Can a parent join?", "A parent or caregiver is welcome for the first few minutes of an intro call and can receive the agreed weekly recap."],
        ["What should we have ready?", "A recent assignment, practice test, or piece of work is useful, but not required for the intro."],
        ["What is the rescheduling policy?", "Sessions can be moved without charge up to 24 hours before the agreed start time; later changes are discussed case by case."],
        ["Are the student results real?", "No. The progress cards are illustrative samples for this demo, not verified claims or guarantees."]
    ],
    images:
    {
        hero: ["images/hero-tutor.webp", "A fictional tutor preparing a lesson at a sunlit oak table"],
        session: ["images/session-progress.webp", "A fictional tutor and student working through a lesson at a wooden table"],
        portrait: ["images/tutor-portrait.webp", "Mara Ellison, a fictional private tutor, in a warm home studio"],
        studio: ["images/study-space.webp", "A quiet tutoring studio with an oak table and midnight-blue shelves"]
    },
    ui:
    {
        chooseDate: "Choose an available date to see sample times.",
        chooseTime: "Choose a time below.",
        noTimes: "No future sample times on this date.",
        chooseSlot: "Choose a sample date and time.",
        saved: "Draft restored from this browser.",
        storageUnavailable: "Browser storage is unavailable. You can explore the form, but a request cannot be saved.",
        errorHeading: "Please check the highlighted fields.",
        required: "This field is required.",
        name: "Enter your name.",
        email: "Enter a plausible email address.",
        goals: "Tell us a little more (at least 20 characters).",
        slotError: "Select a future sample intro-call time.",
        change: "Change time",
        duration: "20 minutes",
        localTime: "Tutor local time · America/New_York",
        success: (name) => `Thanks, ${name}. Your demo request is saved in this browser.`,
        notSent: "Nothing has been sent and no real appointment is booked.",
        copy: "Copy request summary",
        copied: "Request summary copied.",
        fallback: "Copy the request summary below.",
        edit: "Edit request",
        reset: "Start over",
        weekdays: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]
    }
};

export function price(multiplier)
{
    const amount = Number(content.rate.replace(/[^\d.]/g, ""));
    const symbol = content.rate.replace(/[\d.\s]/g, "");
    return `${symbol}${new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(amount * multiplier)}`;
}

export function levelCards(subject)
{
    return content.levels[subject].map(([title, grade, best, topics], index) => `
        <article class="level-card">
            <span class="chip">${grade}</span>
            <h3>${title}</h3>
            <p><strong>Best for</strong><br>${best}.</p>
            <ul>${topics.map((topic) => `<li>${topic}</li>`).join("")}</ul>
            <button class="text-button" data-level="${index}">Ask about this level <span data-icon="ArrowUpRight"></span></button>
        </article>`).join("");
}

export function renderHome()
{
    const links = content.navigation.map(([id, label]) => `<a href="#${id}">${label}</a>`).join("");
    const image = (key, extra = "") => `<img src="${content.images[key][0]}" alt="${content.images[key][1]}" ${extra}>`;
    return `<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="Patient, one-to-one mathematics and physics tutoring for high school students. Explore subjects, transparent prices, and a browser-only sample intro request.">
    <meta name="theme-color" content="#F7F4EC">
    <title>${content.brand} — Patient tutoring. Clear next steps.</title>
    <link rel="stylesheet" href="styles.css">
    <script type="module" src="app.js"></script>
</head>
<body>
    <a class="skip" href="#main">Skip to content</a>
    <header>
        <div class="container header-inner">
            <a class="wordmark" href="#main" aria-label="${content.brand}, home"><svg viewBox="0 0 38 34" aria-hidden="true"><path d="M19 29V8C13 3 7 4 3 5v21c6-2 11-1 16 3Zm0 0V8c6-5 12-4 16-3v21c-6-2-11-1-16 3Z" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="19" cy="3" r="2.5" fill="#D89A3D"/></svg><span>Mara Ellison<small>TUTORING</small></span></a>
            <nav class="desktop-nav" aria-label="Main navigation">${links}</nav>
            <a href="#availability" class="button header-cta"><span class="desktop-label">Book a free intro</span><span class="mobile-label">Free intro</span> <span data-icon="ArrowUpRight"></span></a>
            <button class="menu-button" aria-expanded="false" aria-controls="mobile-nav">Menu <span data-icon="Menu"></span></button>
        </div>
        <nav id="mobile-nav" aria-label="Mobile navigation" hidden>${links}<a href="#availability">Book a free intro</a></nav>
    </header>
    <main id="main">
        <section class="hero container">
            <div class="hero-copy">
                <p class="eyebrow hero-eyebrow">ONE-TO-ONE MATHEMATICS AND PHYSICS TUTORING<br>CAMBRIDGE, MASSACHUSETTS + ONLINE</p>
                <h1>Patient tutoring.<br><em>Clear next steps.</em></h1>
                <p class="hero-body">Personal mathematics and physics support for high school students preparing for exams, built around clear explanations, thoughtful practice, and a plan you can see.</p>
                <div class="hero-actions"><a class="button" href="#availability">Book a free intro call <span data-icon="ArrowUpRight"></span></a><a class="button secondary" href="#subjects">Explore subjects</a></div>
                <p class="facts">60-minute sessions <span>·</span> Weekly progress note <span>·</span> No long-term contract</p>
            </div>
            <div class="hero-image">${image("hero", 'fetchpriority="high" width="1400" height="1050"')}<div class="intro-note"><span data-icon="Clock"></span><div><strong>Free 20-minute intro</strong><span>Talk through goals<br>No preparation needed</span></div></div><div class="image-footnote"><span class="small-rule"></span>A little clarity goes a long way.</div></div>
        </section>
        <div class="section-rule container"><span>GOOD QUESTIONS. THOUGHTFUL PRACTICE. YOUR PACE.</span><span>01 / A CLEAR START</span></div>
        <section class="container section" id="subjects">
            <div class="section-heading split-heading"><div><p class="eyebrow">SUBJECTS & LEVELS</p><h2>Find the right<br>starting point.</h2></div><div><p>Choose a subject to see how Mara Ellison breaks down support by level. Every path starts with the student's current work, not an assumed syllabus.</p><div class="tabs" role="tablist" aria-label="Tutoring subjects">${content.subjects.map((subject, index) => `<button role="tab" id="tab-${index}" aria-controls="level-panel" aria-selected="${index === 0}" tabindex="${index === 0 ? 0 : -1}" data-subject="${subject}">${subject}</button>`).join("")}</div></div></div>
            <div id="level-panel" class="three-grid" role="tabpanel" aria-labelledby="tab-0">${levelCards("Mathematics")}</div>
        </section>
        <section class="process-wrap" id="process"><div class="container section">
            <div class="section-heading"><p class="eyebrow">HOW IT WORKS</p><h2>A lesson is only one<br>part of the progress.</h2><p>A simple four-part rhythm keeps student, tutor, and family aligned.</p></div>
            <div class="process-grid"><figure>${image("session", 'loading="lazy" width="1400" height="788"')}<figcaption>Enough structure to move forward, enough room to ask why.</figcaption></figure><ol class="steps">${content.steps.map(([title, text], index) => `<li><span class="step-number">0${index + 1}</span><div><h3>${title}</h3><p>${text}</p></div></li>`).join("")}</ol></div>
        </div></section>
        <section class="container section tutor-grid">
            <figure class="portrait">${image("portrait", 'loading="lazy" width="750" height="1000"')}<figcaption>Demo profile with a fictional portrait placeholder.</figcaption></figure>
            <div class="tutor-copy"><p class="eyebrow">YOUR TUTOR, FROM FIRST CALL TO FINAL SESSION</p><h2>Clear explanations,<br>without the performance.</h2><blockquote>“I start by finding the exact step where a problem stops making sense. Then we rebuild it with plain language, a visual example, and practice that gradually removes my help.”</blockquote><p>Sessions are calm and focused. You leave with a short recap, one priority for the week, and practice matched to what happened in the lesson.</p><p class="signature">Mara Ellison <span>Your mathematics & physics tutor</span></p><div class="tutor-facts"><span>One tutor throughout</span><span>Online or in person in Cambridge, Massachusetts</span><span>Reschedule up to 24 hours ahead</span></div></div>
        </section>
        <section class="progress-wrap" id="progress"><div class="container section">
            <div class="section-heading"><p class="eyebrow">ILLUSTRATIVE EXAMPLES</p><h2>Progress you can discuss<br>in plain language.</h2><p>These fictional samples show how Mara Ellison Tutoring would report a starting point, a focus, and a change. They are not verified outcomes or promises.</p></div>
            <div class="three-grid">${content.samples.map(([subject, duration, metric, before, after, beforeWidth, afterWidth, context, focus, next]) => `<article class="sample-card"><span class="chip apricot">ILLUSTRATIVE</span><div class="sample-meta"><h3>${subject}</h3><span>${duration}</span></div><p>${metric}</p><div class="metric">${before} <span>→</span> ${after}</div><p class="metric-context">${context}</p><div class="bar-row"><span>Before ${before}</span><div class="track"><i style="width:${beforeWidth}%"></i></div></div><div class="bar-row"><span>After ${after}</span><div class="track"><i style="width:${afterWidth}%"></i></div></div><div class="sample-notes"><p><strong>Focus</strong>${focus}</p><p><strong>Next step</strong>${next}</p></div></article>`).join("")}</div>
        </div></section>
        <section class="container section" id="pricing">
            <div class="pricing-intro"><div class="section-heading"><p class="eyebrow">PRICING, WITHOUT THE GUESSWORK</p><h2>Start with a conversation,<br>then choose the rhythm.</h2><p>No registration fee, no payment on this demo, and no long-term contract.</p></div>${image("studio", 'loading="lazy" width="320" height="240"')}</div>
            <div class="three-grid">${content.packages.map(([title, multiplier, duration, description, button], index) => `<article class="price-card ${index === 1 ? "emphasized" : ""}"><h3>${title}</h3><div class="price">${price(multiplier)}${multiplier === 4 ? `<small>4 × ${price(1)}</small>` : ""}</div><p class="duration">${duration}</p><p>${description}</p><button class="button ${index === 1 ? "" : "secondary"}" data-package="${title}">${button} <span data-icon="ArrowUpRight"></span></button></article>`).join("")}</div><p class="pricing-note">Prices are in USD. Rescheduling is available up to 24 hours before a session. Paid choices still begin with the free intro call.</p>
        </section>
        <section class="availability-wrap" id="availability"><div class="container section">
            <div class="section-heading"><p class="eyebrow">LET'S FIND A STARTING POINT</p><h2>Pick a time for a<br>first conversation.</h2><p>Choose a sample slot, then tell Mara Ellison what you would like help with. This demo saves the request only in this browser; it does not send information or book a real appointment.</p></div>
            <div class="booking-grid">
                <div class="calendar-panel"><div class="calendar-label"><span data-icon="Calendar"></span><strong>Sample availability</strong><span>Tutor local time</span></div><p class="timezone">Cambridge, Massachusetts · America/New_York</p><div class="week-navigation"><button aria-label="Previous week" id="prev-week"><span data-icon="ChevronLeft"></span></button><h3 id="week-label"></h3><button aria-label="Next week" id="next-week"><span data-icon="ChevronRight"></span></button></div><div class="calendar-days" id="calendar-days"></div><p class="calendar-legend"><i></i>Sample intro-call dates · four weeks ahead</p><div id="slots"></div><div id="slot-summary" aria-live="polite"></div><div class="calendar-note"><span data-icon="Clock"></span><div><strong>A conversation, not a commitment.</strong><p>Intro calls Tuesday, Thursday, and Saturday by request. All slots are illustrative, not live availability.</p></div></div></div>
                <div class="booking-panel"><form id="booking-form" novalidate><h3>Your free intro request</h3><p class="form-intro">A few details help us start in the right place.</p><p id="draft-status" role="status"></p><div id="form-errors" role="alert" tabindex="-1"></div><div class="field-grid">
                    <div class="field"><label for="name">Your name</label><input id="name" name="name" autocomplete="name" required><small id="name-error"></small></div>
                    <div class="field"><label for="email">Email</label><input id="email" name="email" type="email" autocomplete="email" required><small id="email-error"></small></div>
                    <div class="field"><label for="level">Student level</label><select id="level" name="level" required><option value="">Choose a level</option>${content.levels.Mathematics.map(([title]) => `<option>${title}</option>`).join("")}</select><small id="level-error"></small></div>
                    <div class="field"><label for="subject">Subject</label><select id="subject" name="subject" required><option value="">Choose a subject</option>${content.subjects.map((subject) => `<option>${subject}</option>`).join("")}</select><small id="subject-error"></small></div>
                </div><fieldset><legend>Format</legend><label><input type="radio" name="format" value="Online" required> Online</label><label><input type="radio" name="format" value="In person"> In person</label><small id="format-error"></small></fieldset>
                <div class="field"><label for="package">Package interest</label><select id="package" name="package" required>${content.packages.map(([title]) => `<option>${title}</option>`).join("")}</select><small id="package-error"></small></div>
                <div class="field"><label for="goals">What would you like help with?</label><textarea id="goals" name="goals" rows="4" minlength="20" required placeholder="Current topics, an upcoming exam, or where things stop making sense…"></textarea><small id="goals-error"></small></div>
                <button class="button submit" type="submit">Request free intro call <span data-icon="ArrowUpRight"></span></button><p class="privacy-note">Browser-only demo. Nothing is sent. No payment required.</p>
                </form><div id="success-panel" aria-live="polite" hidden></div></div>
            </div>
        </div></section>
        <section class="container section faq-grid"><div><p class="eyebrow">A FEW PRACTICAL DETAILS</p><h2>Before we meet.</h2></div><div class="accordions">${content.faqs.map(([question, answer], index) => `<div class="faq"><h3><button aria-expanded="false" aria-controls="answer-${index}">${question}<span data-icon="Plus"></span></button></h3><div id="answer-${index}" hidden><p>${answer}</p></div></div>`).join("")}</div></section>
    </main>
    <footer><div class="container footer-grid"><div><h3>${content.brand}</h3><p>Personal mathematics and physics tutoring in Cambridge, Massachusetts and online.</p></div><nav aria-label="Footer navigation">${links}<a href="#availability">Book a free intro</a></nav><div><p class="eyebrow">GET IN TOUCH</p><p><a href="mailto:hello@mara-ellison-tutoring.example">hello@mara-ellison-tutoring.example</a><br><a href="tel:+16175550136">(617) 555-0136</a></p><p>Intro calls Tuesday, Thursday, and Saturday by request.</p><small>Invented contact details for this demo.</small></div></div><div class="container footer-bottom"><span>© ${content.brand}</span><a href="https://vibefather.ai/t/private-tutor-website">Template by VibeFather</a></div></footer>
</body>
</html>`;
}
