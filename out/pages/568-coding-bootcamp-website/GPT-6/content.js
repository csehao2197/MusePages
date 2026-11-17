export const content =
{
    school: "Copperline",
    program: "full-stack web development",
    skip: "Skip to content",
    brandLabel: "Sixteen-week bootcamp",
    nav:
    [
        { label: "Curriculum", href: "#curriculum" },
        { label: "Tuition", href: "#tuition" },
        { label: "Apply", href: "#apply" }
    ],
    hero:
    {
        eyebrow: "Cohorts forming now (sample)",
        title: "Sixteen weeks to full-stack web development.",
        intro: "Small cohorts, named projects, and a schedule that respects a career change. Taught by people who still ship.",
        apply: "Apply for the autumn cohort",
        curriculum: "Read the curriculum",
        nextLabel: "Next cohort",
        next: "Autumn · 4 seats (sample)",
        trust: ["14 students per cohort", "Fully remote", "Scholarship seats (sample)"],
        note: "A fictional school. A concrete plan."
    },
    curriculum:
    {
        eyebrow: "The sixteen weeks",
        title: "A plan, week by week.",
        intro: "Four phases. Something shipped at every step.",
        milestoneLabel: "Milestone",
        phases:
        [
            {
                weeks: "Weeks 1–4",
                title: "Foundations",
                topics: ["HTML & CSS the honest way", "JavaScript, gently at first", "git, and apologizing to git", "pair programming"],
                milestone: "Ship a personal site you’re not embarrassed by"
            },
            {
                weeks: "Weeks 5–8",
                title: "Full-stack, really",
                topics: ["React with guardrails", "APIs you build, not just call", "databases beyond SELECT *", "auth without fear"],
                milestone: "A full app with login, data and deployment"
            },
            {
                weeks: "Weeks 9–12",
                title: "Product weeks",
                topics: ["working from tickets", "code review, giving and taking", "testing that pays rent", "accessibility pass"],
                milestone: "A team-built product for a real brief (sample)"
            },
            {
                weeks: "Weeks 13–16",
                title: "Career sprint",
                topics: ["portfolio sharpening", "interview practice, kindly", "salary conversations", "alumni show-and-tell"],
                milestone: "A portfolio, a story, and a plan"
            }
        ]
    },
    cohorts:
    {
        eyebrow: "Cohorts",
        title: "Three ways in (sample schedule).",
        headers: ["Cohort", "Format", "Schedule", "Seats"],
        rows:
        [
            { name: "Autumn cohort", format: "Full-time", schedule: "Mon–Fri, 9–5", seats: "4 seats left (sample)" },
            { name: "Winter cohort", format: "Part-time", schedule: "Tue/Thu eve + Sat am", seats: "12 seats (sample)" },
            { name: "Spring cohort", format: "Full-time", schedule: "Mon–Fri, 9–5", seats: "opening soon" }
        ],
        caption: "Formats and seats are sample content — the next real cohort updates here."
    },
    outcomes:
    {
        eyebrow: "Outcomes (sample)",
        title: "Numbers we’d show our own families.",
        stats:
        [
            { value: 87, prefix: "", suffix: "%", label: "hired within six months (sample)" },
            { value: 21, prefix: "+$", suffix: "k", label: "median salary change (sample)" },
            { value: 420, prefix: "", suffix: "", label: "alumni (sample)" },
            { value: 14, prefix: "", suffix: "", label: "students per cohort (sample)" }
        ],
        caveat: "Sample figures from our invented records — ask any real school for theirs."
    },
    tuition:
    {
        eyebrow: "Tuition & financing",
        title: "Priced like a decision, not a mystery.",
        plans:
        [
            { name: "Upfront", figure: "$8,400", line: "one payment, $600 off", note: "One less thing to think about." },
            { name: "Installments", figure: "$8,900", line: "six monthly payments (sample plan)", note: "A little breathing room.", highlighted: true },
            { name: "Scholarship line", figure: "50% tuition", line: "two seats per cohort at 50% — short form, honest criteria (sample)", note: "Room for a different starting point." }
        ],
        choose: "Choose",
        demo: "Demo — no payment or financing agreement",
        badge: "Spread it out",
        scholarship: "Scholarship line: two seats per cohort at 50% — short form, honest criteria (sample).",
        sample: "All plans are sample pricing for a fictional school.",
        selected: "Selected for comparison:",
        selectionNote: "This is a demo selection, not a checkout or financing agreement."
    },
    instructors:
    {
        eyebrow: "Who teaches",
        title: "Three people, thirty-one cohorts.",
        rows:
        [
            { name: "Marcus Bell", role: "Foundations lead", line: "taught 31 cohorts and still reads every repo", image: "./images/instructor-marcus.webp", alt: "Portrait of instructor Marcus Bell" },
            { name: "Dana Whitfield", role: "Full-stack lead", line: "breaks things on purpose so you learn to fix them", image: "./images/instructor-dana.webp", alt: "Portrait of instructor Dana Whitfield" },
            { name: "Yuna Park", role: "Careers lead", line: "has heard every interview answer and rates half of them", image: "./images/instructor-yuna.webp", alt: "Portrait of instructor Yuna Park" }
        ],
        caption: "Placeholder portraits — AI-generated fictional people (swap in your real staff).",
        note: "All staff, teaching records, figures and policies on this page are invented sample content."
    },
    application:
    {
        eyebrow: "Application",
        title: "Two minutes, honestly.",
        intro: "Tell us where you’re starting from; we reply to every application (a real school would — this demo just saves yours locally).",
        note: "No essays required. The why box is 40 characters minimum because two words can’t hold a plan.",
        privacy: "Browser-only demo. No email, application or payment is sent. Your draft stays on this device.",
        labels: { name: "Your name", email: "Email address", track: "Choose your cohort", why: "Why this change, and why now?" },
        placeholders: { name: "Alex Morgan", email: "alex@example.com", track: "Select a sample cohort", why: "A little about where you are, and where you want to go…" },
        tracks:
        [
            { value: "autumn", label: "Autumn cohort · Full-time", format: "Full-time" },
            { value: "winter", label: "Winter cohort · Part-time", format: "Part-time" },
            { value: "spring", label: "Spring cohort · Full-time (opening soon)", format: "Full-time" }
        ],
        errors: { name: "Please enter your name.", email: "Enter a valid email address.", track: "Choose a sample cohort.", why: "Tell us a little more — at least 40 characters." },
        counter: "characters · 40 minimum",
        submit: "Submit application",
        clear: "Clear saved draft",
        draft: "Draft saved in this browser.",
        cleared: "Saved draft cleared.",
        unavailable: "Browser storage is unavailable. You can explore the form, but this demo cannot save an application.",
        successTitle: "Application saved",
        success: "Application saved — this demo keeps it in this browser; a real school would email apply@copperline.com within two days.",
        successNote: "Nothing was sent. No seat has been reserved.",
        edit: "Edit saved application"
    },
    faq:
    {
        eyebrow: "A few fair questions",
        title: "Before you make the leap.",
        rows:
        [
            { question: "Do I need experience?", answer: "Some comfort with a computer; none with code — week one assumes zero." },
            { question: "What if I fall behind?", answer: "Every cohort has office hours four nights a week and a no-questions reset into the next one (sample policy)." },
            { question: "Is it remote?", answer: "Fully remote with two in-person meetups per cohort where geography allows." },
            { question: "Do you guarantee a job?", answer: "No honest school does; we guarantee the sprint, the coaching and the introductions (sample)." },
            { question: "What about the vending machine?", answer: "Remote campus — bring your own snacks." }
        ]
    },
    footer:
    {
        email: "apply@copperline.com",
        emailNote: "Illustrative address · not an admissions service",
        copyright: "© Copperline. A fictional bootcamp with honest sample numbers.",
        credit: "Template by VibeFather",
        creditUrl: "https://vibefather.ai/t/coding-bootcamp-website",
        notice: "Source & licenses",
        noticeUrl: "./NOTICE.txt"
    }
};
