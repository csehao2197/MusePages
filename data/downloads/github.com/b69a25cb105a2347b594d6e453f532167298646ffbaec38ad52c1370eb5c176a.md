# Coding Bootcamp Website

Build this website exactly as described below. Replace the [VARIABLES] with your own values; keep everything else.

## Brief
A single-page site for [SCHOOL], a sixteen-week bootcamp teaching [PROGRAM]: curriculum timeline, three sample cohorts, sample outcomes, tuition and financing, an instructor trio, an application form (client-side only) and a short FAQ. One page, index.html; everything runs in the browser.

- Audience: A career-switcher reading on a lunch break, skeptical of marketing: they want the week-by-week plan, the price, the payment options and proof the teaching is real — specifics over slogans.
- Goal: Applications. Within ten seconds the visitor sees the promise and the apply button; within two minutes they've read the curriculum and opened the form.
- Tone: Campus-plain: concrete weeks, named projects, honest sample labeling. One joke about vending machines.

## Stack
- Framework: Vite 5 + React 18 + TypeScript
- Styling: Tailwind CSS 3.4
- Libraries: react (MIT), react-dom (MIT), motion (motion.dev, import from 'motion/react') (MIT), lucide-react (ISC), tailwindcss (MIT), postcss (MIT), autoprefixer (MIT), vite (MIT), @vitejs/plugin-react (MIT), typescript (Apache-2.0), @fontsource/zilla-slab (OFL-1.1), @fontsource-variable/inter (OFL-1.1)
- Build: `npm run build` → static files in `dist/`. No backend, no server code, no external APIs.
- Setup:
  - Scaffold with npm create vite@latest using the react-ts template (pin the version if the latest template targets newer majors), then keep one real HTML page: index.html (entry src/main.tsx).
  - vite.config.ts: base './', plugins [react()], build { outDir 'dist', sourcemap false, assetsInlineLimit 0 }. Do not copy src/ into dist/.
  - Tailwind 3.4 through PostCSS, content ['./index.html', './src/**/*.{ts,tsx}']. In tailwind.config.ts add every color under Design to theme.extend.colors with kebab-case keys (chalk, panel, cream, line, ink, softink, green, green-deep, green-mist, clay, slateink, good) and fontFamily display ['Zilla Slab', 'Georgia', 'serif'], sans ['Inter Variable', 'system-ui', 'sans-serif']. Set borderRadius DEFAULT to 10px and add maxWidth { container: '1160px', read: '720px' }.
  - In src/fonts.ts import '@fontsource/zilla-slab/400.css', '@fontsource/zilla-slab/600.css', '@fontsource/zilla-slab/500-italic.css' and '@fontsource-variable/inter'; import src/fonts.ts and src/index.css from the entry file.
  - File layout: src/content.ts (school, program phrase, phases, cohorts, outcomes, tuition plans, instructors, FAQ rows and every string, typed), src/lib/brand.ts (schoolSlug = [SCHOOL] lowercased with every run of non-alphanumeric characters replaced by '-', emailDomain = schoolSlug without hyphens + '.com', applyMail = 'apply@' + emailDomain), src/lib/storage.ts (safe localStorage get/set wrapped in try/catch, key schoolSlug + ':app').
  - State: src/store/app.ts is a tiny external store (useSyncExternalStore) holding the application draft { name, email, track, format, why } persisted to localStorage; submit marks sent.
  - Components in src/components/: Header.tsx, Reveal.tsx (Motion whileInView wrapper), Eyebrow.tsx, Footer.tsx; Hero.tsx (NextCohortChip.tsx), Curriculum.tsx (PhaseRow.tsx with TopicTags.tsx), Cohorts.tsx (CohortTable.tsx), Outcomes.tsx (StatCard.tsx), Tuition.tsx (PlanCard.tsx), Instructors.tsx (InstructorCard.tsx), Apply.tsx (Field.tsx, TrackSelect.tsx), Faq.tsx (FaqRow.tsx). src/pages/Home.tsx composes them.
  - The application form validates on blur (Clay text under fields): name non-empty, email format, track chosen, why at least 40 characters with a live counter; submit disabled until valid; success crossfades to a Good panel: 'Application saved — this demo keeps it in this browser; a real school would email ' + applyMail + ' within two days.'
  - Before the first build, download every image listed under Assets into public/images/ with curl -L -o using the exact file names given. The build itself never fetches anything.
  - public/favicon.svg as described under Assets. index.html: lang en, <meta name='theme-color' content='#FCFBF7'>, <link rel='icon' href='./favicon.svg' type='image/svg+xml'>, <title>[SCHOOL] — sixteen weeks to [PROGRAM]</title>.
  - Write ASSETS.md at the project root as described under Assets.
  - dist/ holds index.html, hashed JS/CSS, the woff2 fonts, favicon.svg and three portraits. Keep it under 7 MB.

## Variables
- [SCHOOL] — School name (default: "Copperline"). The invented school's name, one word. Used in the wordmark, title, footer and email (apply@ + schoolSlug without hyphens + '.com'). Never a real school.
- [PROGRAM] — Program phrase (default: "full-stack web development"). One lowercase phrase naming what's taught. Rewrites the H1, phase topics, project names and FAQ so the curriculum fits. Keep it concrete.
- [CREDIT] — keep a small "Template by VibeFather" link to https://vibefather.ai/t/coding-bootcamp-website in the footer (default: yes; delete this line to remove it)

The copy under Pages & Sections is written for the default values. If your values differ, rewrite every headline, paragraph, label and image for them — same length, tone and structure. Layout, colors, type and motion stay as described.
Keep all copy, image paths and links in one content file (for example `src/content.ts`), keyed by section, so the content can be swapped later without touching components.

## Design
### Colors
- Chalk `#FCFBF7` — Page background throughout.
- Panel `#FFFFFF` — Cards, table, form panel.
- Cream `#F4F1E8` — Alternate sections (Curriculum, Tuition), chip fills.
- Line `#E4E0D4` — 1px hairlines: table rows, card borders, timeline rail.
- Ink `#20221C` — Headlines and body ink, icons.
- Soft Ink `#5D6055` — Standfirsts, captions, eyebrows, sample-label lines.
- Green `#2E7D54` — The one accent: primary buttons, phase numbers, links, focus ring, selected plans.
- Green Deep `#236242` — Hover and pressed primary.
- Green Mist `#E7F1EA` — Chip fills, hover rows, selected tracks.
- Clay `#B4543A` — Validation errors and the caveat asterisk.
- Slate Ink `#0F1A14` — Text on green fills.
- Good `#2E7D54` — Success states (alias kept simple).

### Typography
- Display: H1, H2, phase titles, plan names — Zilla Slab, campus slab serif: Zilla Slab (OFL), weights 400/600
- Text and UI: body, table, forms, tags — Inter; tabular numerals for stats and seats: Inter (OFL), weights 400/500/600

### Layout & motion
- Spacing: 8px base unit. Container max-width 1160px, centered, side padding 48px desktop, 32px tablet, 20px under 640px. Section vertical padding 96px desktop, 72px under 1024px, 56px under 640px. Type scale: H1 clamp(36px, 5vw, 60px) Zilla 600 line-height 1.08; H2 clamp(26px, 3.4vw, 40px) Zilla 600; phase titles Zilla 600 22px; body 15.5px / 1.7; standfirst 17px / 1.65 Soft Ink; eyebrow 12px 600 uppercase letter-spacing 0.14em Soft Ink; captions and sample labels 12.5px; stats 32px Zilla 600 tabular. Buttons: height 48px, Inter 600 14px; primary Green fill with white text, secondary 1px Line border on Panel. Inputs/selects: height 48px, Panel fill, 1px Line border, focus Green border + 2px offset ring. Focus everywhere: 2px Green outline, 3px offset.
- Radius: 10px on cards, panels, buttons, inputs; 8px on table wrapper; 999px for chips.
- Motion: Easing: --ease-out cubic-bezier(0.22, 0.61, 0.36, 1). Campus-steady: one reveal per block, no theatrics.
- Motion: Reveal: sections wrapped in <Reveal> rise 12px over 600ms at 15% viewport (Motion whileInView, once); siblings stagger 70ms.
- Motion: Curriculum: phase rows reveal in order; the timeline rail draws as you scroll (scaleY driven by useScroll on the section); topic tags fade 40ms staggered.
- Motion: Cohort table: rows reveal with a 40ms stagger; hover fills Green Mist.
- Motion: Stats: figures count up once on first view (700ms, tabular).
- Motion: Plan cards: the middle (installments) card carries a Green 1.5px border and lifts 4px on hover; the selected state is visual only — no real checkout.
- Motion: Form: field errors fade in 160ms; the live character counter ticks; success crossfades 260ms to the Good panel.
- Motion: Links: .link-draw grows a 1px currentColor underline over 240ms on hover and focus-visible.
- Motion: prefers-reduced-motion: reduce — no reveals, no rail draw, no counting (final values shown); everything at rest and usable. Use CSS @media in index.css plus Motion's useReducedMotion.
- Imagery: Three instructor portraits, all AI-generated fictional people in one consistent style: natural light against a chalk-white studio wall, business-casual, warm and approachable, varied in age and ethnicity (a Black man in his 30s, a white woman in her 40s, an East Asian woman around 30), not resembling any real individuals. Portraits object-fit cover, 10px corners, 1px Line outline; captions in Inter 12.5px Soft Ink noting they are placeholder portraits. No other photos; everything else is typography, tables and chips. Icons: lucide-react only, stroke width 1.75. The favicon is drawn SVG.

## Pages & Sections
### Bootcamp site (`index.html`)
1. **Content file and copy rules** — All copy below is written for the defaults ([SCHOOL] = Copperline, [PROGRAM] = full-stack web development). Put every string, phase, cohort, stat, plan, instructor and FAQ row in src/content.ts and render from it. If any variable differs, rewrite the H1, all four phases' topics and projects, the cohort table, outcomes, tuition names and FAQ so they fit that program, keeping the same structure and counts (4 phases; 3 cohorts; 4 stats; 3 plans; 3 instructors; 5 FAQ rows). Phases (weeks · title · topics · milestone): 'Weeks 1–4' 'Foundations' ['HTML & CSS the honest way','JavaScript, gently at first','git, and apologizing to git','pair programming'] milestone 'Ship a personal site you're not embarrassed by'; 'Weeks 5–8' 'Full-stack, really' ['React with guardrails','APIs you build, not just call','databases beyond SELECT *','auth without fear'] milestone 'A full app with login, data and deployment'; 'Weeks 9–12' 'Product weeks' ['working from tickets','code review, giving and taking','testing that pays rent','accessibility pass'] milestone 'A team-built product for a real brief (sample)'; 'Weeks 13–16' 'Career sprint' ['portfolio sharpening','interview practice, kindly','salary conversations','alumni show-and-tell'] milestone 'A portfolio, a story, and a plan'. Cohorts (name · format · schedule · seats sample): 'Autumn cohort' full-time 'Mon–Fri, 9–5' '4 seats left (sample)'; 'Winter cohort' part-time 'Tue/Thu eve + Sat am' '12 seats (sample)'; 'Spring cohort' full-time 'Mon–Fri, 9–5' 'opening soon'. Outcomes (sample stats with the caveat): '87% hired within six months (sample)'; '+$21k median salary change (sample)'; '420 alumni (sample)'; '14 students per cohort'; the caveat line reads 'Sample figures from our invented records — ask any real school for theirs.' Tuition plans: 'Upfront' '$8,400' 'one payment, $600 off'; 'Installments' '$8,900' 'six monthly payments (sample plan)' [highlighted]; 'Scholarship line' 'two seats per cohort at 50% — short form, honest criteria (sample)'. Instructors (name · role · one-liner): 'Marcus Bell' 'Foundations lead' 'taught 31 cohorts and still reads every repo'; 'Dana Whitfield' 'Full-stack lead' 'breaks things on purpose so you learn to fix them'; 'Yuna Park' 'Careers lead' 'has heard every interview answer and rates half of them'. FAQ: 'Do I need experience?' 'Some comfort with a computer; none with code — week one assumes zero.'; 'What if I fall behind?' 'Every cohort has office hours four nights a week and a no-questions reset into the next one (sample policy).'; 'Is it remote?' 'Fully remote with two in-person meetups per cohort where geography allows.'; 'Do you guarantee a job?' 'No honest school does; we guarantee the sprint, the coaching and the introductions (sample).'; 'What about the vending machine?' 'Remote campus — bring your own snacks.' All names, figures and policies are invented sample content.
   Layout: n/a
   Motion: n/a
2. **Header** — Left: the wordmark '[SCHOOL]' (Zilla 600 20px) with a small Green square glyph; over 'SIXTEEN-WEEK BOOTCAMP' (10px uppercase Soft Ink). Right nav (Inter 500 14px): 'Curriculum' → #curriculum, 'Tuition' → #tuition, and a compact primary 'Apply' → #apply. Under 720px: wordmark + apply.
   Layout: Sticky top, 64px, Chalk at 95% with backdrop blur, Line bottom border.
3. **Hero** — Eyebrow 'COHORTS FORMING NOW (SAMPLE)'; H1 'Sixteen weeks to [PROGRAM].'; standfirst 'Small cohorts, named projects, and a schedule that respects a career change. Taught by people who still ship.' CTA row: primary 'Apply for the autumn cohort' → #apply, secondary 'Read the curriculum' → #curriculum. Beside the CTAs, NextCohortChip: a Green Mist pill 'Next cohort: Autumn · 4 seats (sample)'. Trust row (Green checks): '14 students per cohort', 'Fully remote', 'Scholarship seats (sample)'.
   Layout: Chalk background, centered-left column max-width 680px, 120px top padding; no hero photo — typography is the hero.
4. **Curriculum timeline** — Section id='curriculum' on Cream. Eyebrow 'THE SIXTEEN WEEKS'; H2 'A plan, week by week.' Four PhaseRows on a vertical Line rail: a Green week label (mono-ish Inter 600 13px, fixed 110px column), the phase title, TopicTags (Green Mist chips), and a milestone line set in Zilla 500-italic ('Milestone — …').
   Layout: Reading column max-width 860px; rail at left 12px; 48px between phases (stacked under 760px with the week label above the title).
5. **Cohorts table** — Section id='cohorts'. Eyebrow 'COHORTS'; H2 'Three ways in (sample schedule).' CohortTable on Panel with Line border: columns Cohort / Format / Schedule / Seats; rows from the roster; the seats cell carries a Green chip when 'left' appears, Soft Ink otherwise; a caption line 'Formats and seats are sample content — the next real cohort updates here.'
   Layout: Reading column max-width 860px; real <table> semantics; rows 52px; stacked cards under 720px.
6. **Outcomes** — Section id='outcomes'. Eyebrow 'OUTCOMES (SAMPLE)'; H2 'Numbers we'd show our own families.' Four StatCards in a row (2x2 under 900px): figure (Zilla 600 32px tabular) + label; every card carries the word '(sample)' in its label. Beneath, the caveat line with a Clay asterisk.
   Layout: Chalk background; 4 columns 24px gap; caveat centered max-width 560px.
7. **Tuition** — Section id='tuition' on Cream. Eyebrow 'TUITION & FINANCING'; H2 'Priced like a decision, not a mystery.' Three PlanCards: name (Zilla 600 20px), figure (Zilla 600 30px), the line, and a ghost 'Choose [name]' button (inert demo anchor to #apply with title 'Demo'); the Installments card highlighted per Design. Under the cards: the scholarship line and the small print 'All plans are sample pricing for a fictional school.'
   Layout: 3 columns 24px gap (1 under 860px); middle card raised 8px with a Green border.
8. **Instructors** — Section id='instructors'. Eyebrow 'WHO TEACHES'; H2 'Three people, thirty-one cohorts.' Three InstructorCards: portrait (3:4), name (Zilla 600 19px), role (13px Green), one-liner (Inter 15px Soft Ink). Caption under the row: 'Placeholder portraits — AI-generated fictional people (swap in your real staff).'
   Layout: Chalk background; 3 columns 24px gap (1 under 860px); portraits 4 cols width each.
9. **Apply form** — Section id='apply'. A wide Panel card with a Green 1px top rail: left — eyebrow 'APPLICATION'; H2 'Two minutes, honestly.'; the body 'Tell us where you're starting from; we reply to every application (a real school would — this demo just saves yours locally).' and the note 'No essays required. The why box is 40 characters minimum because two words can't hold a plan.' Right — the form: name, email, TrackSelect (the three cohort formats), and the why textarea with its live counter; primary 'Submit application'. Success: the Good panel per Setup.
   Layout: Chalk background; card max-width 1040px, two columns 40px padding (stacked under 900px).
10. **FAQ and footer** — Five FaqRows (plus rotates to cross) on Panel rows. Footer: left wordmark + 'apply@' + emailDomain; right '© [SCHOOL]. A fictional bootcamp with honest sample numbers.' and 'Built with a VibeFather template' linking https://vibefather.ai.
   Layout: FAQ single column max-width 760px; footer 72px, Line top border.

## Assets
- image: Template portraits made for this design (free to redistribute with the template), all AI-generated fictional people, not resembling any real individual. Download each with curl -L -o into public/images/: https://media.vibefather.ai/assets/ee8294a2-56de-453f-9a6d-d822541395c7/instructor-marcus.webp → public/images/instructor-marcus.webp (Instructor 1; alt 'Portrait of instructor Marcus Bell'); https://media.vibefather.ai/assets/ee8294a2-56de-453f-9a6d-d822541395c7/instructor-dana.webp → public/images/instructor-dana.webp (Instructor 2; alt 'Portrait of instructor Dana Whitfield'); https://media.vibefather.ai/assets/ee8294a2-56de-453f-9a6d-d822541395c7/instructor-yuna.webp → public/images/instructor-yuna.webp (Instructor 3; alt 'Portrait of instructor Yuna Park'). Three files in total. If the variables change, keep the portraits as fictional placeholders and change only the names in content.ts.
- image: Write ASSETS.md at the project root with a table: path, source URL, author, license — one row per portrait (source 'media.vibefather.ai, made for this template', author 'VibeFather', license 'Distributed with the template'), plus rows for @fontsource/zilla-slab and @fontsource-variable/inter (OFL-1.1) and lucide-react (ISC). State that portraits are AI-generated fictional people used as template placeholders.
- icon: lucide-react only: ArrowRight, Check, GraduationCap, MapPin, Plus, Users. Stroke width 1.75, 16–22px, color inherits. public/favicon.svg: viewBox 0 0 32 32, a 32x32 rounded square filled #2E7D54, a white open-book bracket glyph (a book with code brackets). No brand logos.
- font: Install @fontsource/zilla-slab and @fontsource-variable/inter and import them in src/fonts.ts as listed in Setup. Vite bundles the woff2 files into dist/.

## Don'ts
- No backend, no form submission, no fetch to API, no payments: the application saves in localStorage only and the copy says so; plan buttons are inert demo anchors.
- Every internal link points to a file name or anchor (./index.html, #curriculum, #apply) — never to a bare directory; there is exactly one page.
- No real schools, bootcamps, curricula or their copy; the school, staff, phases, policies and every number are invented sample content, and every stat carries '(sample)'.
- No employment or salary guarantees presented as fact; the FAQ answer says honest schools don't guarantee jobs.
- Instructor portraits are AI-generated fictional people, varied in age and ethnicity, not resembling any real individuals; no student photos or testimonials as real people.
- No dates or years: cohort names are seasonal sample labels, schedules are weekday patterns, and nothing prints today's date.
- Self-host everything: fonts through Fontsource, icons as npm packages or inline SVG, portraits downloaded into public/images/. No CDN <script> or <link> tags, no Google Fonts, no analytics.
- Production build: minified, no source maps, no src/ copied into dist/, single command npm run build, output in dist/ under 7 MB.
- Never mention VibeFather inside the site except the footer credit link; all copy is invented US English.
- Respect prefers-reduced-motion: no reveals, no rail draw, no counting; everything at rest and usable.
- The site must work at 1440x900 desktop and 390x844 mobile (table becomes stacked cards) with zero console errors; nav, form, FAQ and buttons work with keyboard only and visible focus rings.

---
— Prompt by VibeFather · https://vibefather.ai/t/coding-bootcamp-website · CC BY-NC 4.0 (non-commercial; commercial use needs a VibeFather Pro license) · Request removal: https://vibefather.ai/takedown
