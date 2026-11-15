# Private K-12 School Website

Build this website exactly as described below. Replace the [VARIABLES] with your own values; keep everything else.

## Brief
Build a one-page site for [BRAND], the independent K-12 day school led by head of school [FOUNDER] in [CITY], serving 540 students across three divisions for [EXPERIENCE]. The page is bright and institutional — school red, navy, chalk white, a crest-free serif wordmark — with division cards, a day-in-the-life timeline per division, a five-step admissions rhythm with seasonal deadlines, a tuition-and-aid estimator with visible sample math, athletics and arts grids, campus tour booking and a news feed. Photos show classrooms, a library and fields with people far away or from behind. All stats, staff and events are invented sample data.

- Audience: Primary: parents researching independent schools around [CITY] — skimming for division fit, a real sense of the day, and the number. Secondary: charter networks and small academies re-pointing divisions and the estimator.
- Goal: Move a parent from 'another nice school site' to a booked tour: make the day vivid enough to imagine their child in it, make admissions feel like a rhythm instead of a wall, let the estimator answer the money question honestly enough to keep the conversation going.
- Tone: Warm institutional prose — specific, unhurried, lightly proud. The school sounds like teachers and a head who know every kid, not like a marketing committee.

## Stack
- Framework: Vite 6 + React 18 + TypeScript
- Styling: Tailwind CSS 3.4
- Libraries: react (MIT), react-dom (MIT), vite (MIT), typescript (Apache-2.0), tailwindcss (MIT), motion (MIT), lucide-react (ISC), @fontsource/source-serif-4 (OFL-1.1), @fontsource/inter (OFL-1.1)
- Build: `npm run build` → static files in `dist/`. No backend, no server code, no external APIs.
- Setup:
  - Create a Vite 6 + React 18 + TypeScript project with base './', build.outDir 'dist', build.sourcemap: false. No router, no backend, no server code.
  - Install Tailwind CSS 3.4 with PostCSS and Autoprefixer. Extend the theme with the exact palette below, fontFamily.display 'Source Serif 4' and fontFamily.body 'Inter'.
  - Self-host Source Serif 4 weights 600 and 700 and Inter weights 400, 500, 600, 700 through @fontsource/source-serif-4 and @fontsource/inter, imported in src/main.tsx. Never load fonts from a CDN.
  - Use Motion from 'motion/react' (motion, useInView, useReducedMotion) for reveals and the timeline draw; gate every animation on useReducedMotion().
  - Keep all copy and data in src/content.ts: brand strings, hero copy, the three divisions, the day-in-the-life stops per division, admissions steps with seasonal anchors, the estimator tables (base tuition, aid bands, size adjustments), athletics and arts grids, news items, tour options. When variable values change, rewrite the dependent copy there and derive storage keys and the tel: link from [BRAND] and [PHONE] so no default-brand remnants remain.
  - Day-in-the-life, exactly six stops per division with fixed times of day: Lower K–4 — '8:15 morning circle' (greetings, weather, one poem by heart), '8:45 reading workshop' (small groups by readiness), '10:30 the woods walk' (nature study on the trail), '12:00 family-style lunch' (teachers at the table), '1:15 studio: art & music' (alternate days), '2:30 pick-up line' (garden club for stayers); Middle 5–8 — '8:00 advisory check-in' (eight kids, one adult, every morning), '8:20 math by readiness' (not by birthday), '10:00 humanities seminar' (tables, not rows), '11:45 lunch + clubs' (forty to choose from), '12:45 science lab' (real benches, real goggles), '2:00 athletics & arts block' (everyone moves), '3:20 optional study hall' (quiet room, math teacher on duty); Upper 9–12 — '8:15 Harkness English' (fourteen chairs, one table), '9:40 advanced math tracks' (through multivariable), '11:15 electives' (robotics, studio art, debate), '12:30 lunch senate' (student-run budget for clubs), '1:15 lab sciences' (physics first in ninth grade), '2:45 team practice or rehearsal' (everyone belongs somewhere), '4:00 ensembles' (jazz before dinner). Tabs switch the timeline with a 200ms crossfade; the timeline draws as a navy line with red nodes.
  - Tuition & aid estimator, exactly: base tuition by division — Lower $19,800, Middle $23,400, Upper $25,900; aid percentage by income band — under $80k: 45%, $80–150k: 28%, $150–250k: 15%, over $250k: 5%; household-size adjustment — 1–3: ×1.0, 4: ×1.05, 5: ×1.08, 6+: ×1.12 (applied to the aid percentage, capped at 60%); estimated tuition = base × (1 − min(0.60, aid% × sizeAdj)), rounded to nearest $10; the result panel prints every line ('Upper division base — $25,900', 'Income $80–150k — 28% aid', 'Household of 4 — ×1.05', 'Estimated: $18,340 / year') plus 'Illustrative only — aid decisions are made by committee with your full application.' Inputs persist to localStorage under [BRAND_SLUG]-estimator.
  - Draw the crest-free wordmark in code: the school name set in Source Serif 700 with a small red rule beneath and an open-book-free simple red square glyph; no coats of arms, shields or seals anywhere.
  - Use only these lucide-react icons: Phone, GraduationCap, BookOpen, FlaskConical, Palette, Trophy, Users, MapPin, Clock, CalendarCheck, CheckCircle2, ChevronRight, ArrowRight, Menu, X, Bus, Star, Newspaper.
  - Persist the estimator inputs and tour request to localStorage, namespaced with [BRAND_SLUG]; validate restored JSON and recover silently from malformed data.
  - Download the six generated photos to the exact public paths listed in Assets before building. Create ASSETS.md at the project root listing every file's path, source URL, author or generator, and license.
  - A plain <title> of [BRAND] and a favicon (the navy square with the red rule mark) are enough; no meta descriptions, Open Graph tags, JSON-LD, or sitemaps.

## Variables
- [BRAND] — School name (default: "Redgate School"). Invented school name; the wordmark and red-rule logomark derive from it in code.
- [CITY] — City (default: "Windmere"). Where the campus is; appears in hero, tour copy and footer.
- [FOUNDER] — Head of school (default: "Dr. Althea Rowe"). Invented head of school, named in hero and admissions copy.
- [PHONE] — Phone (default: "(555) 448-7700"). Admissions line; links as tel: with digits only.
- [EXPERIENCE] — Years (default: "61 years"). Plain phrase like '61 years'; used in hero copy.
- [CREDIT] — keep a small "Template by VibeFather" link to https://vibefather.ai/t/private-k-12-school-website in the footer (default: yes; delete this line to remove it)

The copy under Pages & Sections is written for the default values. If your values differ, rewrite every headline, paragraph, label and image for them — same length, tone and structure. Layout, colors, type and motion stay as described.
Keep all copy, image paths and links in one content file (for example `src/content.ts`), keyed by section, so the content can be swapped later without touching components.

## Design
### Colors
- School red `#C62E2E` — Accent: eyebrows, CTAs, timeline nodes
- Navy `#16325C` — Type, dark bands, wordmark
- Navy deep `#0F2440` — Footer ground
- Red tint `#FAE8E8` — Chips and highlight panels
- Chalk white `#FBFBF8` — Page ground
- White `#FFFFFF` — Cards
- Steel `#5A6474` — Secondary text
- Hairline `#E5E6E1` — Hairline rules and card borders

### Typography
- Display: headlines, division names, prices: Source Serif 4 (OFL), weights 600/700
- Body: paragraphs, timelines, forms: Inter (OFL), weights 400/500/600/700

### Layout & motion
- Spacing: Traditional generosity: sections separated by 96px desktop / 64px mobile; section headers use a 13px letter-spaced red eyebrow over a Source Serif 700 title at clamp(30px, 3.4vw, 46px); cards 26px padding, 22px gaps.
- Radius: Institutional restraint: 6px cards, 4px chips, 2px buttons; photos 6px with a 1px navy border.
- Motion: Fade-rise reveals (14px, 550ms, 70ms stagger) via useInView, once.
- Motion: Division tabs crossfade the timeline 200ms; the timeline's navy line draws 700ms with red nodes popping 1.1× staggered.
- Motion: Estimator outputs tween 200ms on change; news cards stagger 50ms.
- Motion: All motion disables instantly under prefers-reduced-motion; no parallax, no scroll-jacking, no autoplay media.
- Imagery: Sunlit campus photography from one shoot: a brick schoolhouse with a lawn, a bright lower-school classroom with children seen from behind, a science lab with middle-schoolers at benches from behind, a warm library with students far away, an athletic field with a team in the distance, and a lit auditorium stage — no identifiable faces, no close-ups of minors, no readable signage.

## Pages & Sections
### [BRAND] — Independent K-12 in [CITY] (`index.html`)
1. **Header and hero** — Header (chalk at 95% with backdrop blur, 72px): wordmark (name in Source Serif 700 navy with the red rule) + no crest; nav anchors Divisions, A day here, Admissions, Tuition, Arts & athletics; right: phone chip Phone icon + [PHONE] (tel:) and red pill 'Book a tour'. At 390px: wordmark, phone icon button, menu button on one line; anchors in a chalk dropdown. Hero: full-bleed campus photo (brick schoolhouse, lawn, morning light, people far away, 78vh desktop / 540px mobile) under a bottom gradient from navy #16325C at 92% to transparent 55%; content bottom-left: eyebrow red 'INDEPENDENT K-12 — [CITY]'; H1 Source Serif 700 white 'Small school. Whole child. Full day.'; paragraph '#D5DDEA' 'Head of school [FOUNDER] leads 540 students across three divisions on one fourteen-acre campus — [EXPERIENCE] of knowing every name by the second week.'; red pill 'Book a campus tour' (anchor) and white-outline pill 'See a day here' (anchor); chips in 12px white on translucent navy: 'K through 12th grade' · '40% receive aid (sample)' · 'Bus routes county-wide'.
   Layout: Copy columns 1–7; chips wrap two rows max at 390px; scrim guarantees AA contrast.
   Motion: Photo scales 1.04→1 over 800ms; copy rises 14px staggered 70ms.
2. **Divisions** — Chalk band. Eyebrow 'THREE DIVISIONS' (red); title 'One campus, three schools.' Three cards (white, navy hairline): 'Lower School · K–4' — classroom-lower photo — 'Two teachers per classroom, reading by readiness, and a woods walk that outranks any worksheet.'; 'Middle School · 5–8' — science-lab photo — 'Advisories of eight, math tracked to the kid not the birthday, labs with real benches.'; 'Upper School · 9–12' — library photo — 'Seminar tables, physics-first science, and electives from robotics to debate.' Each card footer: red link 'See a day in [division] →' switching the timeline tab below and scrolling to it.
   Layout: Three cards in a row (1-column under 900px); photos 4:3 tops with the navy border.
   Motion: Cards rise 14px staggered 70ms.
3. **A day here** — White band, the first signature section. Eyebrow 'A DAY HERE' (red); title 'The schedule is the philosophy.' Division tabs (Lower / Middle / Upper — red underline on active); the timeline: a navy line drawn left-to-right with red time nodes and stop cards alternating above and below (vertical on mobile), the six stops per division exactly as listed in setup (times in Inter 600, stop names in Source Serif 700, one detail line each). A footnote 12px steel: 'Times are the typical rhythm; specials and electives shift by term.'
   Layout: Tabs above; timeline max-width 980px; mobile vertical with cards below their nodes.
   Motion: Tab switch crossfades 200ms; line draws 700ms; nodes pop staggered; reduced-motion renders statically.
4. **Admissions** — Chalk band. Eyebrow 'ADMISSIONS' (red); title 'Five steps, no mystery.' Five step cards with red numerals: 01 'Inquire' — 'any season — the form takes three minutes and unlocks the visit calendar'; 02 'Visit' — 'fall through winter — a weekday morning walk-through with a student guide'; 03 'Apply' — 'by mid-January — one application per child, teacher references included'; 04 'Aid application' — 'by mid-January — same deadline as the application, no separate chase'; 05 'Decisions' — 'mid-March — every family hears by the same week, yes or no or waitlist'. Footer line 13px steel: 'Rolling admissions after March as space allows — deadlines follow the seasonal rhythm, not a live calendar.'
   Layout: Five steps in a horizontal strip (2×2+1 wrapped under 900px, 1-column under 640px); numerals Source Serif 700 red 36px.
   Motion: Steps rise 14px staggered 80ms.
5. **Tuition and aid estimator** — Navy band, the signature tool. Eyebrow 'TUITION & AID' (red-tint on navy); title 'The number, with its math showing.' Controls in a white panel (left, 5 columns): division chips (Lower / Middle / Upper); household size chips (1–3 / 4 / 5 / 6+); income band chips (Under $80k / $80–150k / $150–250k / Over $250k). Result panel (chalk, right, 7 columns): 'ESTIMATED TUITION' eyebrow red; the figure in Source Serif 700 navy at clamp(36px, 4vw, 52px), e.g. '$18,340 / year'; the line list 13px steel with navy values ('Upper division base — $25,900', 'Income $80–150k — 28% aid', 'Household of 4 — ×1.05'); footnote 12px 'Illustrative only — aid decisions are made by committee with your full application. Sample rates for this template.'; red pill 'Talk to admissions about aid' anchoring the tour form. Inputs persist.
   Layout: 5/7 columns desktop; stacked mobile; result non-sticky.
   Motion: Figure and lines tween 200ms on change; no layout shift.
6. **Athletics and arts** — Chalk band. Two halves. Left: 'ATHLETICS' eyebrow; the athletic-field photo in a navy-border frame; a season grid — Fall: soccer (fields), cross country (trail); Winter: basketball (gym), swim (pool at the YMCA-shared? no — 'the natatorium'); Spring: lacrosse, track, tennis — each as a chip with facility note; a line 'No cuts before eighth grade — everyone belongs to a team.' Right: 'ARTS' eyebrow; the arts-hall photo; program chips — Studio art (two studios + kiln), Music (three ensembles + private lessons), Theater (two productions a year, everyone who auditions is cast), Debate (the lunch league) — and a line 'The spring musical casts everyone; the stage crew is why it works.'
   Layout: 6/6 columns; chips wrap; photos 4:3 with captions.
   Motion: Photos rise 14px; chips fade 50ms staggered.
7. **Campus tour booking** — White band. Eyebrow 'BOOK A TOUR' (red); title 'A weekday morning, with a student guide.' Form (chalk panel, max-width 720px): entering-grade select (K through 12 grouped by division); party-size chips ('Parent(s) only' / 'Family visit' / 'Student shadow morning'); time-window chips (Weekday mornings · 8:30 or 10:00 / 'Open House Saturdays'); Name (required), Phone (required), Email (optional); red pill 'Request the tour'. Validation inline (2px red borders, 13px notes), no native popups. Success: CheckCircle2 red, 'See you on campus.' Source Serif 700, 'Admissions calls within one business day to confirm the morning. Tours start at the front porch — look for the red door. This demo stores your request in this browser only.' and an outline pill 'Book another'. Persists to localStorage.
   Layout: Two-column field rows desktop, 1-column mobile with 96px bottom padding clear of the sticky bar.
   Motion: Success crossfades with a 12px rise; check pops 1.15×.
8. **News and events** — Chalk band. Eyebrow 'THIS SEASON' (red); title 'The school, lately.' Six news cards in a 3×2 grid (white, hairline), each with a category chip (Academics / Athletics / Arts / Community), a headline in Source Serif 600 18px, and one line: 'Robotics takes the regional — the upper-school team's bridge-bot held 41 pounds' (Academics); 'The fall festival returns — cider, the eighth-grade pie stand, and the famous faculty dunk tank' (Community); 'Middle school play sells out both nights — seventy kids in the cast, zero missed rehearsals' (Arts); 'Cross country sweeps the county meet — the trail on campus hosted, and the Lower School made signs' (Athletics); 'A new kiln for the studio — fired by an anonymous family gift, first load in November' (Arts); 'Grandparents' Day RSVPs open — the fourth graders will give the tours, obviously' (Community). Note 12px steel: 'Invented news items for this template demo.'
   Layout: 3-column grid (2 under 900px, 1 under 640px).
   Motion: Cards stagger 50ms.
9. **Footer** — Navy-deep band. Column 1: wordmark + red rule; 13px #B9C4D6 lines '1 Redgate Circle, [CITY]', 'Admissions [PHONE] (tel:)', 'Bus routes across the county'. Column 2 'School': anchors Divisions, A day here, Admissions, Tuition. Column 3 'Small print': 'Sample site for a template — students, staff, stats and news invented', 'The school claims no accreditations or affiliations', optional [CREDIT] link in red-tint. Mobile sticky bar (under 768px): fixed bottom navy 96% + blur; red pill 'Inquire' (tel:) and white-outline pill 'Tour' (anchor), safe-area padding.
   Layout: Footer grid 4/4/4 to 1-column mobile; body padding-bottom 80px under 768px.
   Motion: None.

## Assets
- image: Campus. Download https://media.vibefather.ai/assets/5047866d-2dda-419a-9105-122841ba8957/hero-campus.webp to public/images/hero-campus.webp. Alt: 'A brick schoolhouse with a lawn in morning light, people far away.' The hero anchor. Generated by VibeFather with qwen-image-3.0-pro, redistributable with this template; record that exact credit in ASSETS.md.
- image: Lower classroom. Download https://media.vibefather.ai/assets/5047866d-2dda-419a-9105-122841ba8957/classroom-lower.webp to public/images/classroom-lower.webp. Alt: 'A bright lower-school classroom with children seen from behind.' The Lower School card. Generated by VibeFather with qwen-image-3.0-pro, redistributable with this template; record that exact credit in ASSETS.md.
- image: Science lab. Download https://media.vibefather.ai/assets/5047866d-2dda-419a-9105-122841ba8957/science-lab.webp to public/images/science-lab.webp. Alt: 'Middle-school students at lab benches, seen from behind.' The Middle School card. Generated by VibeFather with qwen-image-3.0-pro, redistributable with this template; record that exact credit in ASSETS.md.
- image: Library. Download https://media.vibefather.ai/assets/5047866d-2dda-419a-9105-122841ba8957/library.webp to public/images/library.webp. Alt: 'A warm school library with students far away among the shelves.' The Upper School card. Generated by VibeFather with qwen-image-3.0-pro, redistributable with this template; record that exact credit in ASSETS.md.
- image: Athletic field. Download https://media.vibefather.ai/assets/5047866d-2dda-419a-9105-122841ba8957/athletic-field.webp to public/images/athletic-field.webp. Alt: 'A school athletic field with a team in the distance.' The athletics half. Generated by VibeFather with qwen-image-3.0-pro, redistributable with this template; record that exact credit in ASSETS.md.
- image: Arts hall. Download https://media.vibefather.ai/assets/5047866d-2dda-419a-9105-122841ba8957/arts-hall.webp to public/images/arts-hall.webp. Alt: 'A lit auditorium stage with red curtains.' The arts half. Generated by VibeFather with qwen-image-3.0-pro, redistributable with this template; record that exact credit in ASSETS.md.
- icon: Lucide (ISC) via the lucide-react package, restricted to the icon list in setup, plus the code-drawn crest-free wordmark. No other icon source.
- font: Source Serif 4 (OFL) and Inter (OFL) self-hosted through @fontsource/source-serif-4 and @fontsource/inter; no CDN font loading.

## Don'ts
- No real schools, districts, accreditations or rankings claimed or named; [BRAND], staff, stats and news are invented, and the footer states no affiliations are claimed.
- No identifiable faces of minors anywhere: people appear far away or from behind — inspect every photo; no close-ups of children.
- No real standardized tests, scholarship programs or rival schools/leagues named; admissions and athletics stay generic.
- Tuition and aid figures are illustrative samples with visible math and the committee disclaimer — never a promise of financial aid.
- No religious or governance affiliation implied; the school is independent and nonsectarian generically.
- No dates tied to the real clock: deadlines are seasonal anchors ('mid-January', 'mid-March'), news says 'this season', no calendar dates, no copyright year.
- Forms are local-only samples: no submit to any server, no APIs, no analytics. Persist to localStorage only and validate restored data.
- No backend, server code, databases or auth. Static output in dist/ from the single build command, under 20 MB, with Vite's base relative.
- Self-host fonts through the Fontsource packages only; never load Google Fonts, Adobe Fonts or any CDN stylesheet or script.
- No source maps in production and no src/ copied into dist/.
- No Unsplash, Pexels, Pixabay, Google Images, placeholder-image services or hotlinked files; use only the six generated photos and code-drawn SVG art.
- No SEO work: no meta descriptions, Open Graph tags, JSON-LD, sitemaps or keyword-stuffed headings. A plain title with [BRAND] and a favicon are enough.
- One math source: the estimator, division cards and copy all derive from the content.ts tables; never hard-code a second copy of a number.
- No scroll-jacking, page parallax, custom cursor or autoplay media; motion limited to the specified reveals, crossfades, timeline draw and pops, all respecting prefers-reduced-motion.
- Keep the mobile header on one line at 390px and never let the sticky bottom bar cover the tour form's submit button.
- Build brand-derived strings (storage keys, tel: link) from [BRAND] and [PHONE] so alternate variable values never leave default-brand remnants.
- Every internal link is a file name or in-page anchor, never a bare directory; the site stays one index.html.

---
— Prompt by VibeFather · https://vibefather.ai/t/private-k-12-school-website · CC BY-NC 4.0 (non-commercial; commercial use needs a VibeFather Pro license) · Request removal: https://vibefather.ai/takedown
