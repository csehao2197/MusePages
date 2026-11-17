export const content =
{
    brand: "Stonewater University",
    location: "Millhaven, Vermont",
    audience: "first-year, transfer, and graduate applicants",
    hero:
    {
        title: "Study where the\nriver bends.",
        description: "Stonewater University is a university of 11,400 students built on small seminars, freshwater science and sustainability studies, and quads that actually get used. Filter our programs, sketch a sample net cost, and come walk the riverwalk yourself.",
        stats: [["11,400", "students"], ["140+", "programs"], ["15 : 1", "student–faculty ratio"], ["86%", "receive aid"]]
    },
    filters:
    {
        Level: ["All", "Undergraduate", "Graduate"],
        Area: ["All", "Arts & Humanities", "Business", "Computing", "Science & Engineering", "Health & Education"],
        Format: ["All", "On campus", "Hybrid", "Online"]
    },
    programs:
    [
        ["B.A. Environmental Humanities", "Undergraduate", "Arts & Humanities", "On campus", "Literature, ethics, and the living world, taught beside the river."],
        ["B.S. Computer Science", "Undergraduate", "Computing", "On campus", "Systems and software craft, capped by a build for a regional partner."],
        ["B.B.A. Sustainable Business", "Undergraduate", "Business", "Hybrid", "Markets and supply chains with the long view built in."],
        ["B.S. Freshwater Science", "Undergraduate", "Science & Engineering", "On campus", "Rivers, lakes, and fieldwork from week one — our signature program."],
        ["B.S. Nursing", "Undergraduate", "Health & Education", "On campus", "Simulation labs first, community clinics from the start."],
        ["B.A. Digital Media Design", "Undergraduate", "Arts & Humanities", "Hybrid", "Interfaces, motion, and storytelling in studio cohorts."],
        ["M.S. Data Engineering", "Graduate", "Computing", "Online", "Pipelines and platforms on a part-time calendar."],
        ["M.F.A. Creative Writing", "Graduate", "Arts & Humanities", "Hybrid", "Short campus residencies between online workshop terms."],
        ["M.B.A. for Working Professionals", "Graduate", "Business", "Hybrid", "Evening seminars that respect your day job."],
        ["M.S. Environmental Policy", "Graduate", "Science & Engineering", "Online", "Policy craft for water, land, and climate work."],
        ["M.Ed. Learning Design", "Graduate", "Health & Education", "Online", "Curriculum and technology for working educators."]
    ],
    campus:
    [
        ["library-arches", "A stone library arcade in warm evening light.", "The main quad at golden hour — where seminars spill outside."],
        ["riverwalk", "A riverside path on campus with low sun on the water.", "The riverwalk between the library and the boathouse."],
        ["studio-lab", "A bright fabrication studio with workbenches in late-afternoon light.", "Fabrication studios, open late for cohort projects."],
        ["lower-green", "Distant students playing on a green lawn at golden hour, seen from behind.", "Pick-up games on the lower green, most Thursdays."]
    ],
    timeline:
    [
        ["Apply", "One essay, one recommendation, your transcripts. Choose the Early round (decisions sooner, no binding promise) or the Regular round."],
        ["Review", "Admissions readers reply in four to six weeks. Every application is read twice, by humans."],
        ["Decide", "Celebrate, compare, and claim your spot by the national reply window in spring."]
    ],
    rounds:
    [
        ["Early", "Decisions arrive first, typically within four weeks. Best when Stonewater University is your clear first choice."],
        ["Regular", "One cycle, six weeks at most. Best when you want to compare offers."]
    ],
    estimator:
    {
        tuition: 34800,
        books: 1100,
        housing: [12400, 10900, 4200],
        living: ["On campus", "Off campus in Millhaven", "With family"],
        grant(contribution)
        {
            return Math.max(0, Math.min(28000, Math.round((50000 - contribution) * 0.6 / 100) * 100));
        }
    },
    visit:
    {
        days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        times: ["9:30", "11:00", "14:00"],
        types: ["Campus tour", "Program deep-dive", "Aid & cost walkthrough"]
    },
    address: "12 Riverwalk Terrace, Millhaven, Vermont",
    footerNote: "This is a fictional university created for a website template — programs, rates, and figures are invented samples.",
    ui:
    {
        storageWarning: "Browser storage is unavailable. Your choices remain here until you leave this page.",
        home: " home",
        admissions: "Admissions",
        shortlist: "Shortlist",
        shortlisted: "Shortlisted",
        results: (count) => `Showing ${count} of 11 programs`,
        emptyTitle: "A different path, perhaps.",
        emptyMessage: "No programs match those filters — try clearing one.",
        reset: "Reset filters",
        perYear: " per year",
        living: "Living ",
        costLabels: ["Tuition & fees", "Housing & meals", "Books & supplies"],
        grant: " Grant",
        nameRequired: "Please enter your name.",
        nameLong: "Please use a name of 120 characters or fewer.",
        emailInvalid: "Please enter a valid email address.",
        requestSaved: (value) => `Request saved — ${value.day} at ${value.time} · ${value.type}.`,
        requestSavedTitle: "Request saved.",
        requestSelectedTitle: "Request selected.",
        requestSelected: (value) => `Request selected — ${value.day} at ${value.time} · ${value.type}. Not saved to browser storage.`,
        campusNote: (location) => `Eleven hundred acres of it, ten minutes from downtown ${location} by the foot ferry.`
    }
};
export const slug = content.brand.toLowerCase().replace(/[^a-z0-9]+/g, "-");

// Canonical section copy and markup; index.html is its static, readable materialization.
export const pageTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${content.brand}</title>
    <link rel="icon" href="./favicon.svg" type="image/svg+xml">
    <link rel="stylesheet" href="./styles.css">
    <script type="module" src="./app.js"></script>
</head>
<body>
    <a class="skip" href="#programs">Skip to programs</a>
    <header>
        <div class="shell header-inner">
            <a class="wordmark" href="#top" aria-label="${content.brand} home"><span>${content.brand.toUpperCase().split(" ").slice(0, -1).join(" ")}</span><small>${content.brand.toUpperCase().split(" ").at(-1)}</small></a>
            <nav aria-label="Primary navigation">
                <a href="#programs">Programs</a>
                <a href="#campus">Campus life</a>
                <a href="#admissions">Admissions</a>
                <a href="#cost">Cost &amp; aid</a>
            </nav>
            <a class="button blue header-visit" href="#visit">Sign up for a visit <span data-icon="ArrowRight"></span></a>
        </div>
    </header>
    <main id="top">
        <section class="hero" aria-labelledby="hero-title">
            <img id="hero-image" src="./images/quad-golden-hour.webp" alt="A campus quad with stone halls in golden-hour light." fetchpriority="high">
            <div class="hero-scrim"></div>
            <div class="shell hero-inner">
                <div class="hero-copy">
                    <p class="eyebrow" id="hero-eyebrow"></p>
                    <h1 id="hero-title"></h1>
                    <p class="hero-description" id="hero-description"></p>
                    <div class="hero-actions">
                        <a class="button brass" href="#programs">Explore programs <span data-icon="ArrowRight"></span></a>
                        <a class="button outline" href="#visit">Sign up for a visit day</a>
                    </div>
                </div>
                <div class="stats" id="stats"></div>
                <div class="photo-credit">A place to put down roots. A place to begin.</div>
            </div>
        </section>
        <section id="programs" class="section">
            <div class="shell">
                <div class="section-heading reveal"><p class="eyebrow">Find your fit</p><h2>Programs, filtered<br>your way.</h2><p>Eleven of our most-asked-about programs below — the full catalog lists 140+. Shortlist the ones you like.</p></div>
                <div class="finder">
                    <aside class="filter-rail" aria-label="Program filters"><div id="filters"></div><button class="reset" id="reset" hidden><span data-icon="RotateCcw"></span> Reset filters</button><p class="rail-note">A small seminar.<br>A bigger possibility.</p></aside>
                    <div class="results">
                        <div class="results-head"><p id="results-count" aria-live="polite"></p><button id="shortlist-view" aria-pressed="false"><span data-icon="Bookmark"></span> <span id="shortlist-count">Shortlist (0)</span></button></div>
                        <div class="program-grid" id="program-grid"></div>
                    </div>
                </div>
            </div>
        </section>
        <section id="campus" class="section parchment">
            <div class="shell">
                <div class="section-heading reveal"><p class="eyebrow">Campus life</p><h2>Stone halls, green quads,<br>a working river.</h2></div>
                <div class="campus-grid" id="campus-grid"></div>
                <p class="campus-note" id="campus-note"></p>
            </div>
        </section>
        <section id="admissions" class="section">
            <div class="shell">
                <div class="section-heading reveal"><p class="eyebrow">How to apply</p><h2>Three steps, two rounds,<br>zero application-fee games.</h2></div>
                <div class="admissions-grid">
                    <div class="timeline" id="timeline"></div>
                    <div class="rounds reveal"><img src="./images/lecture-hall.webp" alt="A warm wooden lecture hall with tall windows and empty seats." loading="lazy"><div class="round-card"><h3>Which round fits you?</h3><div id="round-copy"></div></div></div>
                </div>
            </div>
        </section>
        <section id="cost" class="section deep-stone">
            <div class="shell">
                <div class="section-heading reveal"><p class="eyebrow">Cost &amp; aid</p><h2>A sample net price,<br>in two sliders.</h2><p>A little clarity goes a long way. Explore an invented undergraduate year, before you come talk with us.</p></div>
                <div class="cost-grid">
                    <div class="sliders">
                        <div class="slider-block"><label for="contribution">Family contribution per year</label><output id="contribution-value" for="contribution">$15,000</output><input id="contribution" type="range" min="0" max="60000" step="2500" value="15000"><div class="range-ends"><span>$0</span><span>$60,000</span></div></div>
                        <div class="slider-block"><label for="living">Living arrangement</label><output id="living-value" for="living">On campus</output><input id="living" type="range" min="0" max="2" step="1" value="0"><div class="living-labels" id="living-labels"></div></div>
                        <a class="button ghost" href="#visit">Ask about aid on a visit <span data-icon="ArrowRight"></span></a>
                    </div>
                    <div class="cost-card reveal">
                        <p class="eyebrow">One sample undergraduate year</p>
                        <dl id="cost-lines"></dl>
                        <div class="cost-bar" aria-label="Sample costs and grant"><span class="tuition"></span><span class="housing"></span><span class="books"></span><span class="grant"></span></div>
                        <p class="bar-note">Hatched area: sample university grant</p>
                        <div class="net"><span>Sample net cost</span><strong id="net-value">$27,300</strong><span>/ year</span></div>
                        <p class="disclaimer">Invented sample figures for this demo — not a financial aid offer or a promise of aid.</p>
                    </div>
                </div>
            </div>
        </section>
        <section id="visit" class="section visit-band">
            <div class="shell">
                <div class="section-heading reveal"><p class="eyebrow">Visit</p><h2>Come see the golden<br>hour yourself.</h2><p>Pick a weekday and a morning or afternoon slot. Tours leave from Founders Gate, deep-dives start in the program halls, and aid walkthroughs happen in the welcome center — every visit ends on the quad.</p></div>
                <div class="visit-card">
                    <form id="visit-form" novalidate>
                        <fieldset><legend>01 &nbsp; Pick your day</legend><div class="chips" id="days"></div></fieldset>
                        <fieldset><legend>02 &nbsp; Choose a time</legend><div class="chips slots" id="times"></div></fieldset>
                        <fieldset><legend>03 &nbsp; Make it your visit</legend><div class="visit-types" id="types"></div></fieldset>
                        <div class="form-fields"><div><label for="name">Your name</label><input id="name" name="name" autocomplete="name" required aria-describedby="name-error"><p class="error" id="name-error"></p></div><div><label for="email">Email address <span>(local only)</span></label><input id="email" name="email" type="email" autocomplete="email" required aria-describedby="email-error"><p class="error" id="email-error"></p></div></div>
                        <button class="button blue submit" type="submit">Save my visit-day request <span data-icon="ArrowRight"></span></button>
                        <p class="form-note">Prefer a virtual session? Choose any weekday slot and say so in the confirmation step.</p>
                    </form>
                    <div id="confirmation" hidden aria-live="polite">
                        <p class="eyebrow">Your next chapter starts here</p><h3>Request saved.</h3><p id="confirmation-details"></p><p>This demo stores your request in this browser; a live site would send it to the visit office.</p>
                        <label class="virtual"><input type="checkbox" id="virtual"> I would prefer a virtual session</label>
                        <button class="reset" id="change-request" type="button">Change my request <span data-icon="ArrowRight"></span></button>
                    </div>
                    <p class="error" id="storage-warning" role="status"></p>
                </div>
            </div>
        </section>
    </main>
    <footer><div class="shell footer-inner"><div><a class="wordmark" href="#top"><span>${content.brand.toUpperCase().split(" ").slice(0, -1).join(" ")}</span><small>${content.brand.toUpperCase().split(" ").at(-1)}</small></a><p id="address"></p></div><nav aria-label="Footer navigation"><a href="#programs">Programs</a><a href="#campus">Campus life</a><a href="#admissions">Admissions</a><a href="#cost">Cost &amp; aid</a><a href="#visit">Sign up for a visit</a></nav><div class="footer-note"><p id="footer-note"></p><a href="https://vibefather.ai/t/university-admissions-website">Template by VibeFather ↗</a></div></div></footer>
</body>
</html>
`;
