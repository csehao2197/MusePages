# Geometric Art School Website

Build this website exactly as described below. Replace the [VARIABLES] with your own values; keep everything else.

## Brief
Build [BRAND], an invented independent art/design school at [ADDRESS], [CITY], teaching [FOCUS]. Original primary geometry is both visual identity and student-work material.

- Audience: Curious beginners, developing creative practitioners and prospective students comparing practical programs.
- Goal: Filter courses, inspect substantial student projects, meet fictional faculty, plan an open-day visit and preview a local-only application.
- Tone: Clear, encouraging and serious about process; no accreditation, employment or admissions guarantees.

## Stack
- Framework: Vite + React + TypeScript
- Styling: Vanilla CSS
- Libraries: vite (MIT), react (MIT), react-dom (MIT), typescript (Apache-2.0), @fontsource/league-spartan (OFL-1.1), @fontsource/public-sans (OFL-1.1)
- Build: `npm run build` → static files in `dist/`. No backend, no server code, no external APIs.
- Setup:
  - Set Vite base to ./ and build.sourcemap to false. Use a single src/content.ts for all editable content and fully rewrite its data for variable changes.
  - Implement responsive components and CSS tokens in src/styles.css. Bundle fonts through the listed Fontsource packages; import only the weights actually used.
  - Provide semantic native controls and keyboard/touch alternatives; implement focus-managed dialogs and local-only validated form feedback.

## Variables
- [BRAND] — Brand (default: "Formhouse School"). Rewrite every related headline, item, label, alt and confirmation for this value.
- [CITY] — City (default: "East Marlow"). Rewrite every related headline, item, label, alt and confirmation for this value.
- [FOCUS] — Focus (default: "graphic design, illustration, and objects"). Rewrite every related headline, item, label, alt and confirmation for this value.
- [ADDRESS] — Address (default: "26 Assembly Lane"). Rewrite every related headline, item, label, alt and confirmation for this value.
- [CREDIT] — keep a small "Template by VibeFather" link to https://vibefather.ai/t/geometric-art-school-website in the footer (default: yes; delete this line to remove it)

The copy under Pages & Sections is written for the default values. If your values differ, rewrite every headline, paragraph, label and image for them — same length, tone and structure. Layout, colors, type and motion stay as described.
Keep all copy, image paths and links in one content file (for example `src/content.ts`), keyed by section, so the content can be swapped later without touching components.

## Design
### Colors
- Primary red `#E63946` — Hero circle and large program panels. WCAG relative-luminance calculations: #111111 text on #E63946: 4.53:1; #111111 text on #FFC300: 11.74:1; #FFFFFF text on #1D3FBB: 8.46:1; #111111 text on #FFF9ED: 18.01:1. Use these pairs for every normal-size label/body/button. Decorative overlaps/gradients carry no text; readable text gets a solid backing.
- Primary yellow `#FFC300` — Hero square field and open-day/application panels.
- Primary blue `#1D3FBB` — Hero triangle field, showcase wall and footer.
- Warm white `#FFF9ED` — Explicit brief reading ground.
- Ink `#111111` — Body on red/yellow/warm white.
- White `#FFFFFF` — Type on primary blue.

### Typography
- Display: League Spartan (OFL), weights 700
- Body: Public Sans (OFL), weights 400/700

### Layout & motion
- Spacing: 1200px max, 48px desktop/20px mobile gutters, strict 12-column grid, 1px rules; 8px unit and 96px desktop/56px mobile sections. Display 92px/54px, body 18px/1.6, labels 13px.
- Radius: 0px rectangles and buttons; circles exist only in art/portrait language. No rounded bento dashboard panels.
- Motion: Geometry enters 16px once over 350ms with only small 4-degree rotation, no looping floating blocks.
- Motion: Project hover/focus reveals process label via instant border, not hidden essential text. Reduced motion shows all final geometry and removes slide transitions.
- Imagery: Code-drawn original primary-color student-work artworks: geometric posters, constructed vessels, abstract print sheets and a spatial paper model. Hero is a carefully lit CSS/SVG studio pinboard with overlapping physical sheets, a folded paper model, crop marks, cast shadows and actual visual composition. Faculty use four original AI-created-in-code geometric cut-paper portraits of fictional people, not resembling any real individual: head/shoulder shapes, distinct hair silhouettes and clothing, varied skin-tone shapes and ages, intentionally stylized with no photoreal face. These portraits are permitted and required consistently in imagery/assets/donts. No external photos, real school artwork or initials-only avatars.

## Pages & Sections
### [BRAND] — Make a practice of making (`index.html`)
1. **School and studio wall** — Header [BRAND], Courses, Student work, Faculty, Open studio, 'Start an application'. Eyebrow '[CITY] / Independent creative learning'. H1 'Make a practice of making.' Intro 'Study [FOCUS] through small studio groups, patient critique, and work you can hold in your hands.' CTAs 'Find your course' and 'Plan an open-studio visit'. Small fact strip '6 practical courses / studio groups up to 14 / beginner routes available'; these are fictional course specifications, not outcome claims. Hero artwork pinboard caption 'Original fictional student work, drawn for this school concept'. No certificate/accreditation badge.
   Layout: Warm white #FFF9ED header/ink #111111. Hero left 42% large red #E63946 text field with black H1, right 58% constructed yellow #FFC300 and blue #1D3FBB pinboard, each strong hue covers >=20% opening. Art includes 3 original layered posters and a folded geometric paper object; not a few empty circles. 92px League Spartan H1 on red, 54px mobile. 2cols desktop/stacked mobile, full visual anchor at least 340px tall.
   Motion: One 350ms geometry arrival; no continuous drift.
2. **Course finder** — Heading 'A clear way into your next discipline.' Filters Discipline All / Graphic / Illustration / Objects and Format All / Evening / Full-time / Weekend; show result count and Reset. Six records: Graphic Foundations, Graphic, Evening, 8 weeks, Tue/Thu 6–8 PM, $640, beginner, outputs a 6-piece identity system; Editorial Systems, Graphic, Full-time, 6 weeks, Mon–Thu 10 AM–3 PM, $1480, intermediate, outputs a 24-page publication; Image and Story, Illustration, Evening, 8 weeks, Mon/Wed 6–8 PM, $680, beginner, outputs a sequence of 8 original images; Print Experiments, Illustration, Weekend, 4 weeks, Sat 10 AM–2 PM, $420, all levels, outputs a 3-ink print set; Object Study, Objects, Full-time, 6 weeks, Mon–Thu 10 AM–3 PM, $1520, intermediate, outputs a small-material prototype; Paper Structures, Objects, Weekend, 4 weeks, Sun 10 AM–2 PM, $440, beginner, outputs a foldable spatial model. Every card 'View outline' opens modal with 3 specific learning modules, materials included/bring list and assessment-by-critique explanation. 'Choose this course' carries course ID to application and scrolls it. Combine filters, provide real no-results state and preserve selection. No enrollment/seat availability claims.
   Layout: Warm white #FFF9ED grid, ink #111111 with visible 1px rules. Six equal cards 3col desktop/1col mobile, category shape red #E63946/black, yellow #FFC300/black or blue #1D3FBB/white; form area never patterned. Search/filter rows wrap.
   Motion: Instant filters, outline modal focus managed; no content hidden behind hover.
3. **Student work wall** — Heading 'The work tells you what learning feels like.' Eight original projects with maker, medium and 60-word process note: Common Ground by Ada Penn, Graphic, modular poster grid; Three Small Rooms by Ivo Reed, Objects, folded paper spatial study; Borrowed Light by Tia Moss, Illustration, 3-color window print; Useful Errors by Ren Vale, Graphic, deliberately misaligned typographic blocks with original text only; Moving Still by Neri Hale, Illustration, 6-frame abstract motion sequence; A Cup in Parts by Sol Fen, Objects, stackable paper vessel; The Quiet Route by Mae Lin, Graphic, an invented wayfinding grid; Held Together by Kian North, Objects, interlocking cardboard joints. Art is detailed original SVG/CSS, not blank placeholder blocks. All / Graphic / Illustration / Objects filters update wall/count. Clicking a project opens large view, project title/maker/medium, 60-word process and 3 bullet decisions. Prev/Next cycle within current filter, Escape closes. 'Save work' local favorites with saved-only toggle and clear. No real designer attribution or copied school exercise artwork.
   Layout: Primary blue #1D3FBB whole wall with white #FFFFFF headings; 4-column strict tile grid / 2 mobile with minimum 150px tile. Original artwork switches red #E63946/yellow #FFC300/blue #1D3FBB/white in layered print-like compositions; captions on opaque warm white #FFF9ED/ink. Feature first tile 2×2 desktop only, normal flow mobile.
   Motion: Art focus border 3px yellow; project dialog instant or 180ms fade except reduced motion.
4. **Faculty with a point of view** — Heading 'Learn with people who keep making.' Four fictional faculty: Mara Ellin, Graphic lead, builds small publication systems and teaches grid as a useful constraint; Davi Rowan, Illustration tutor, works with shape sequences and narrating without literal pictures; Amara Senn, Objects tutor, tests paper joints and low-waste prototyping; Jules Taro, Studio mentor, supports portfolios through clear feedback and reflective process. Each has a 55-word original bio, current practice note and 'See teaching approach' dialog with a specific exercise and linked course. All fictional, no real schools/employers/awards. Provide actual stylized cut-paper portraits, not initials.
   Layout: Warm white #FFF9ED with ink #111111 text, 4 equal profiles desktop/2 then1 mobile. Each 220px original portrait is geometric head-and-shoulders with distinct silhouettes: Mara short curved dark hair/red square jacket, Davi angular salt-and-pepper hair/blue circle collar, Amara tall rounded hair/yellow triangular neckline, Jules wavy hair/red semicircle collar; varied warm skin-tone paper shapes, no real-person resemblance. Primary color grounds strong and opaque.
   Motion: Portrait paper layer lifts 2px on focus; no gaze following or morphing faces.
5. **Open studio local plan** — Heading 'Come with questions. Leave with a direction.' 'Illustrative recurring Saturday open studio; this page does not reserve a real visit.' Agenda: 10–10:20 AM Welcome and building walk; 10:30–11:10 AM Course studio visits; 11:20 AM–noon Portfolio conversation; noon–12:30 PM Materials demonstration. Choose one or more checkbox sessions, group size 1–4, accessibility note optional max200 chars, name/email. Selected sessions build local itinerary; overlapping options not present. Submit 'Preview my studio visit' validates name/email and at least one session, opens summary with chosen weekday/times and group size. Explicit 'Local demo only. No visit, email or accessibility request was sent.' Edit/Reset work; no invented remaining seats or confirmation number.
   Layout: Yellow #FFC300 full section with ink #111111, 55/45 agenda/form. Agenda has blue #1D3FBB/white time tags and red #E63946/ink geometric markers; form on warm white #FFF9ED. Mobile single column, sessions remain visible and checkbox targets44px.
   Motion: Local itinerary updates aria-live; errors focus first field.
6. **Application desk and footer** — Heading 'Show us what you are curious about.' Intro 'You do not need a finished practice to begin. Tell us what you want to explore.' Form fields name, email, course dropdown, experience Beginner / Developing / Returning, motivation textarea 60–600 chars with count, optional portfolio URL text (validate URL format only, never fetch it), checkbox 'I understand this is a local application demo'. Selected course from finder prepopulates. Submit 'Preview application'. Inline validation, local summary displays all entered content and selected course price/duration, 'Nothing was submitted, uploaded, reviewed or emailed. This preview stays in your browser.' Edit, Clear and Download local summary .txt; do not persist personal data automatically, only explicit Save draft on this device stores with Clear draft. FAQ 'Is this accredited?' — Fictional school demo, no accreditation claimed; 'Is equipment provided?' — Course outlines show illustrative materials; 'Does the form reach admissions?' — No backend. Footer [BRAND], [ADDRESS], [CITY], Back to courses, local demo note; no years/calendar dates.
   Layout: Primary red #E63946 band with ink #111111 heading; large warm white #FFF9ED form panel, blue #1D3FBB/white button, yellow #FFC300 helper strips. 2cols desktop form/FAQ, single mobile. Footer blue #1D3FBB with white body and yellow decorative square.
   Motion: Accessible validation and local file download; no fake submission loader.

## Assets
- font: Self-host League Spartan, Public Sans using the Fontsource packages listed in Stack; OFL-1.1, no external font requests.
- image: Create all eight student project artworks and the layered studio-wall hero in original inline SVG/CSS. Draw detailed compositions and physical paper folds using red #E63946, yellow #FFC300, blue #1D3FBB and warm white #FFF9ED. Original AI-created project artwork, no copied poster/artist/logo; list authored components and origin in ASSETS.md.
- image: Required faculty imagery: author four original geometric cut-paper head/shoulder SVG portraits in one consistent style as specified in Faculty. They depict AI-created fictional people, not resembling any real individual; intentionally nonphotorealistic, varied silhouettes and skin-tone paper shapes, no initials-only substitute. Treat as original project portrait assets and record that origin in ASSETS.md. No external photo URLs needed.

## Don'ts
- Build a static-only demo: no backend, API routes, databases, authentication, payments, third-party APIs, analytics, telemetry, or forms that send network requests. Confirmations must explicitly say local demo; never claim an order, booking, generated service result, or email was sent.
- Use Vite base ./, relative local assets, hash routes or real .html filenames; no bare-directory links. Direct-open every route and ensure any detail route without an ID renders its first item. Build minified dist/ with npm run build, no source maps or source files, total dist under 20 MB.
- Keep all editable copy, fictional sample data, prices, interaction labels, alt text and A/B content in a single src/content.ts module. Keep 3–6 variables. When variables change, rewrite all related content consistently; never leave the default brand or subject in the second case.
- All visible language and alt text use US English. Do not render calendar dates, years, dated copyright lines, fake freshness or popularity metrics. Operational weekdays and times, track durations, relative timers, issue identifiers and dimensions are permitted.
- Use only original code/art/copy, permissive MIT/ISC/BSD/Apache/CC0 dependencies and locally bundled OFL fonts. No copied site code, existing logos, famous characters, commercial fonts, restricted components or recognizable real-person likeness. List every font, dependency and generated artwork in ASSETS.md with source and license.
- Everything is local at runtime: no hotlinked pictures, font CDNs, remote scripts, remote music or placeholder-image services. Download exactly the specified template-hosted images before build; record full source URL, target path, alt text and generated credit in ASSETS.md.
- At 1440×900 and 390×844 keep zero console errors and no horizontal overflow. Touch targets at least 44px, visible keyboard focus and labeled inputs, Escape/outside close and focus restore for dialogs, drawer focus trap, scroll lock and aria-live for result changes. Hover effects need equivalent focus/tap paths.
- Respect prefers-reduced-motion: remove looping transforms, scroll scrub and parallax, show final static states, never autoplay audio/video, no flashing, strobe or rapid full-screen luminance changes. Do not hide essential content pending animation.
- Preserve the assigned palette with at least two strong hero colors occupying large areas. No neutral cream/charcoal fallback, no gradients behind normal text, no low-contrast small labels. Use the calculated AA text/background pairs in Design.
- Do not omit faculty visuals or use initials-only avatars. Geometric AI-authored fictional cut-paper portraits are explicitly allowed and required, consistent across imagery/assets/donts; no real-person likeness, celebrity, copied portrait or external photo.
- Do not substitute famous artworks, real student work, copied design-school posters or empty color placeholders for the eight original detailed works. Every course outline and project dialog needs substantial original content.
- Open-day visit previews and applications stay fully local: no network submit, uploads, admissions promise, sent email, actual reservation, invented vacancy or accreditation claim. Optional portfolio URL is never fetched. Explicit saved drafts can be cleared; do not silently store personal data.
- For Common Shape Institute rewrite all six courses to spatial design/print/motion with appropriate filter labels, all eight project titles/process descriptions, faculty names/bios and both form copy sets for Lake Fen. Retain primary palette, geometric cut-paper people, grid, local interactions and course-to-form state. No default school, city or focus left behind.

---
— Prompt by VibeFather · https://vibefather.ai/t/geometric-art-school-website · CC BY-NC 4.0 (non-commercial; commercial use needs a VibeFather Pro license) · Request removal: https://vibefather.ai/takedown
