# Surf School Website

Build this website exactly as described below. Replace the [VARIABLES] with your own values; keep everything else.

## Brief
A single-page marketing site for a surf school: a sun-bleached film-grain identity (faded ocean blues, sandy neutrals, a warm grain overlay over everything), a full-bleed faded wave hero, a five-day sample forecast strip drawn in SVG, three lesson levels, camps and packages as editorial rows, coach cards with candid from-behind shots, a client-side booking form and a stylized coastline map strip.

- Audience: Surf, kite, SUP and other beach schools, and the designers who build sites for them.
- Goal: Sell the feeling first — haze, warm grain, empty waves — then make booking feel easy: understand the levels, trust the coaches, check the sample forecast, and leave a saved booking request.
- Tone: Laid-back and warm with dry humor; short sentences that sound like they were said squinting into the sun; competence shown through specifics, not adjectives.

## Stack
- Framework: Vite 5 + React 18 + TypeScript
- Styling: Tailwind CSS 3.4
- Libraries: tailwindcss (MIT), motion (MIT), lucide-react (ISC), @fontsource/bricolage-grotesque (OFL), @fontsource/archivo (OFL), @fontsource/space-mono (OFL)
- Build: `npm run build` → static files in `dist/`. No backend, no server code, no external APIs.
- Setup:
  - Scaffold with npm create vite@latest surf-school-website -- --template react-ts; add tailwindcss@3.4, postcss and autoprefixer as dev dependencies; add motion, lucide-react, @fontsource/bricolage-grotesque, @fontsource/archivo and @fontsource/space-mono as dependencies.
  - vite.config.ts: base './', build.sourcemap false, build output dist/.
  - tailwind.config.js: extend colors sand #F4EDE3, dune #E7DCCC, driftwood #B9A88F, fadedblue #8FB4C2, deeptide #3E6474, ink #2E3438, fog #6E7A78, sunbleach #DFA95C; fontFamily display 'Bricolage Grotesque', sans 'Archivo', mono 'Space Mono'.
  - postcss.config.js: tailwindcss + autoprefixer.
  - Film grain overlay: in src/index.css define .grain-overlay as a fixed, inset-0, pointer-events-none layer with opacity 0.06, mix-blend-mode multiply and a repeating background-image built from an inline SVG data URI (feTurbulence type fractalNoise, baseFrequency 0.9, 300px tile); render it once in App above every page and photo — this warm grain is the signature of the whole site.
  - src/components/forecast.tsx: three pure SVG pieces taking values from content.ts — WaveArc (a smooth arc path whose amplitude scales with wave height), WindArrow (a line with an arrowhead rotated to the wind direction) and TideCurve (a sine path with a positioned dot); src/components/BeachMap.tsx: a stylized coastline map drawn in code — fadedblue sea, dune-shaped sand polygons, a jetty line, one sunbleach pin.
  - src/lib/motion.ts: shared Motion variants — fadeUp (opacity 0→1, y 20→0, 600ms ease-out, 80ms stagger, whileInView once), hoverLift (y -2px, 200ms) — with useReducedMotion falling back to plain 200ms opacity fades.
  - Keep every user-facing string (brand, beach, prices, forecast sample rows, levels, camps, coaches, booking copy, address, hours) in src/content.ts; sections read from it so values swap in one place.
  - index.html: <title>[BRAND] — Surf School at [BEACH]</title> plus a drawn-in-code favicon.svg (a single fadedblue wave arc on a sand ground); no other meta work.

## Variables
- [BRAND] — School name (default: "Driftline"). Invented name used for the wordmark, page title, contact email (hello@driftline.surf, from content.ts) and every mention in the copy.
- [BEACH] — Beach name (default: "Sanderling Bay"). The invented home spot: hero label, forecast intro, map pin caption and the 'find us' directions.
- [PRICE_LESSON] — Entry lesson price (default: "$55"). The first-timer level price ('from [PRICE_LESSON]') and any 'lessons from' copy.
- [CLASS_SIZE] — Max group size (default: "6"). Small-group promise in the hero sub-line and the booking form's party-size maximum.
- [CREDIT] — keep a small "Template by VibeFather" link to https://vibefather.ai/t/surf-school-website in the footer (default: yes; delete this line to remove it)

The copy under Pages & Sections is written for the default values. If your values differ, rewrite every headline, paragraph, label and image for them — same length, tone and structure. Layout, colors, type and motion stay as described.
Keep all copy, image paths and links in one content file (for example `src/content.ts`), keyed by section, so the content can be swapped later without touching components.

## Design
### Colors
- Sand `#F4EDE3` — Page ground everywhere; the hero photo melts into it with a bottom gradient.
- Dune `#E7DCCC` — Raised surfaces: level cards, coach cards, forecast cells, footer band.
- Driftwood `#B9A88F` — Hairlines, card borders, rules; darkens on hover.
- Faded blue `#8FB4C2` — Primary faded ocean accent: links, active chips, wave arcs, forecast highlights, the map's sea.
- Deep tide `#3E6474` — Strong accent: primary buttons, level card headings, the map pin outline.
- Ink `#2E3438` — Primary text — soft near-black with a blue undertone, never pure #000.
- Fog `#6E7A78` — Secondary text: intros, meta lines, captions, sample-data label.
- Sunbleach `#DFA95C` — The one warm highlight: the map pin fill, underline accents, the tide dot — used sparingly.

### Typography
- Display — headlines, camp names, coach names (laid-back, slightly quirky): Bricolage Grotesque (OFL), weights 600/700/800
- Text — body copy, lists, form labels: Archivo (OFL), weights 400/500/600
- Mono — forecast readouts, small uppercase labels, prices: Space Mono (OFL), weights 400/700

### Layout & motion
- Spacing: Loose and unhurried: sections py-28 (112px) desktop / py-20 (80px) mobile; content max-w-6xl px-6/px-10; cards breathe with 28px padding; hairlines (1px driftwood) carry structure instead of shadows.
- Radius: Soft but not pill: 12px on cards and photos, 8px on buttons and inputs, 999px only on tiny chips; nothing sharper, nothing perfectly round.
- Motion: Reveals: sections and cards fade up (y 20→0, 600ms ease-out) with 80ms stagger via Motion whileInView, firing once.
- Motion: Hero: the wave photo scales 1.05→1 over 3s on load and parallaxes at 0.1 of scroll; the headline rises 120ms after the photo settles; the sand gradient at the bottom keeps the melt into the page static.
- Motion: Forecast strip: each wave arc drifts (translateY ±3px) on a 4s ease-in-out loop, staggered 200ms per cell; wind arrows ease from 0° to their rotation on reveal (400ms).
- Motion: Card and row hovers lift 2px and darken the driftwood hairline to fadedblue (200ms); chips fill dune and the label shifts to Space Mono 700.
- Motion: The beach map pin pops in (scale 0→1, 300ms spring) when the section enters; the map itself is static.
- Motion: The grain overlay never animates — it is the constant of the page.
- Motion: prefers-reduced-motion: parallax, load zoom and all loops off; reveals become plain 200ms opacity fades; hover effects become color changes only.
- Imagery: One roll of film: 35mm photographs on sun-bleached color negative stock — faded ocean blues and sandy neutrals, warm visible grain, hazy soft highlights, slightly lifted blacks. Empty waves, boards on sand, and people only small in frame or from behind with faces not identifiable. No text in frame, no logos, no recognizable breaks or landmarks. The six photographs are generated by VibeFather, downloaded into public/images, with the site-wide warm grain overlay sitting on top of them too.

## Pages & Sections
### [BRAND] — Surf School at [BEACH] (`index.html`)
1. **Header** — Fixed top bar, 72px, transparent over the hero. Left: the [BRAND] wordmark in Bricolage Grotesque 700, 24px, lowercase ('driftline' feel), ink on sand after scroll / sand over the photo before. Right (desktop): anchor links 'Lessons', 'Camps', 'Coaches', 'Find us' in Archivo 15px; then a quiet button 'Book a lesson' (deep tide ground, sand text, 8px radius). Mobile: wordmark + button + lucide menu/x toggle opening a sand panel with the four links stacked.
   Layout: position fixed, z-40; after 80px of scroll the bar gains the sand ground at 94% opacity, a 1px driftwood bottom hairline and a slight backdrop blur (300ms).
   Motion: Ground and hairline fade in at the 80px threshold; mobile panel slides down 250ms; links underline with sunbleach on hover.
2. **Hero** — Full-bleed faded wave photograph (public/images/hero-wave.webp) under the grain overlay. Label above the headline in Space Mono 12px uppercase, sunbleach: 'SURF SCHOOL AT [BEACH]'. Headline in Bricolage Grotesque 700, clamp(3rem, 7vw, 5.5rem), line-height 1.05, sand #F4EDE3: 'The ocean sets the schedule.' Sub-line, Archivo 400 18px, sand at 92%, max-w 48ch: 'Surf lessons, weekend camps and private coaching at [BEACH] — soft boards, groups of [CLASS_SIZE] max, and coaches who grew up on this sand.' CTAs: 'Book a lesson' (deep tide ground, sand text) → #book; 'See the levels' (ghost, sand text, sunbleach underline) → #lessons.
   Layout: min-h 92vh, relative; photo absolute inset-0 object-cover object-center; a bottom gradient from transparent sand to solid #F4EDE3 over the last 180px so the photo melts into the page; text block bottom-left on the 12-column grid (columns 1–8, padding-bottom 120px).
   Motion: Photo scales 1.05→1 over 3s on load and parallaxes at 0.1 of scroll; label, headline, sub and CTAs fade up in sequence (80ms stagger, starting 400ms); reduced motion: static photo, single 200ms fade.
3. **Forecast strip** — Small heading row: 'The mood out back' in Bricolage 600 20px ink, plus a Space Mono 11px uppercase chip in dune with fog text: 'SAMPLE FORECAST'. Five weekday cells (Mon–Fri, static sample rows from content.ts): each cell shows the weekday in Space Mono 12px fog, a WaveArc sized to the swell with the height in Space Mono 14px ink ('2 ft'), a WindArrow with direction label ('Offshore 6 kn' in Archivo 13px fog), and a TideCurve with a sunbleach dot and label ('low tide morning'). Sample rows: Mon 2 ft Offshore 6 kn low tide morning · Tue 3 ft Offshore 8 kn high tide midday · Wed 4 ft Cross-shore 11 kn low tide morning · Thu 3 ft Offshore 9 kn high tide midday · Fri 2 ft Glassy 4 kn low tide evening. Footnote, Archivo 13px fog: 'Sample forecast for the demo — the real one is chalked on the shop door every morning.'
   Layout: A single dune band directly under the hero (py-10): five cells in an equal grid with 1px driftwood hairline separators; cells stack on mobile with hairlines between.
   Motion: Wave arcs drift ±3px on a 4s loop staggered 200ms per cell; wind arrows rotate in on reveal; the sample chip never animates. Reduced motion: everything static.
4. **Lessons — three levels** — id=lessons. Heading Bricolage 700 clamp(2rem, 4vw, 3.25rem) ink: 'Three levels, one beach.' Intro Archivo fog max-w 52ch: 'Nobody gets thrown in the deep end. You start where the water is kind and move out when you're ready.' Three level cards on dune, 28px padding, 12px radius, driftwood hairline: Card 1 'First timer' — tag line 'Waist-deep white water' (Space Mono 12px fadedblue) — You'll learn: 'Beach safety, and where not to paddle'; 'The pop-up — on the sand first, always'; 'Riding broken waves all the way back to the sand'. Meta row Space Mono 13px fog: '90 MIN · GEAR INCLUDED · FROM [PRICE_LESSON]'. Card 2 'Improver' — 'Out the back' — 'Paddling through the impact zone without drama'; 'Catching unbroken green waves'; 'Trimming along the wave face'. '2 HRS · SMALL GROUPS · $75'. Card 3 'Advanced' — 'The whole line-up' — 'Bottom turns that hold their line'; 'Cutbacks that use the whole wave'; 'Positioning when it's crowded'. '2 HRS · VIDEO FEEDBACK · $95'. Each card ends with a text link 'Book this level →' (deep tide) to #book.
   Layout: 3-column grid (1 column on mobile, stacked) with 28px gaps; cards top-aligned, tags above the names.
   Motion: Cards fade up with 100ms stagger; hover lifts 2px and turns the hairline fadedblue; the arrows nudge 2px on link hover.
5. **Camps and packages** — Heading: 'Stay longer, surf better.' Three editorial rows separated by 1px driftwood hairlines (not cards): Row 1 'Weekend Camp' — 'Two days, four sessions, one very good tired.' Includes (Archivo 15px, dot-separated): '4 lessons · board & wetsuit hire · breakfast at the surf house · Sunday video debrief' — price Space Mono 700 20px '$290'. Row 2 'Surf & Stay Week' — 'Seven mornings in the water, evenings on the deck.' — '10 sessions · 7 nights at the surf house · daily forecast briefing · airport pickup' — '$1,150'. Row 3 'Private Coaching' — 'One coach, one surfer, one focus.' — '1:1 session · video analysis · a drill plan to take home' — '$140 / session'. Each row ends with 'Book this →' to #book. Beside the rows (desktop), surfer-small.webp as a tall mood photo: a lone surfer tiny in the frame paddling out at dawn.
   Layout: 12-column grid: rows in columns 1–8 (each row a 2-column inner grid: name+line left, includes+price+link right), photo in columns 9–12 (full section height, object-cover, 12px radius, 3:4 crop). Mobile: photo first (280px), then rows stacked.
   Motion: Rows fade up on scroll with 100ms stagger; photo gets a gentle 0.06 parallax; prices slide in 80ms after their row.
6. **Coaches** — Heading: 'Coached by locals.' Intro: 'Between them: forty seasons on this beach, two ex-lifeguards, and one judge who will take your takeoff apart frame by frame.' Three coach cards: photo (3:4, from behind, no identifiable faces), name in Bricolage 700 20px ink, role in Space Mono 12px fadedblue, one line in Archivo fog, one specialty chip (dune pill, Space Mono 11px). Mara Quinn — Head coach — 'Twelve seasons on this sand; reads the rip like a paperback.' — chip 'Whitewater'. Tomas Ferreira — Improver lead — 'Ex-lifeguard, endlessly patient, allergic to egos.' — chip 'Green waves'. Jun Park — Advanced coach — 'Contest judge by winter; breaks your takeoff down frame by frame.' — chip 'Video analysis'. Captions under photos in Archivo 12px fog: 'Watching the line-up', 'First push into the white water', 'Off to check the point'.
   Layout: 3-column grid, 28px gaps; photos 3:4 with 12px radius and the grain overlay over them; cards have no border — the photo anchors each card.
   Motion: Cards fade up staggered 120ms; photos get a slow 1.02→1 zoom-out over 1s once on reveal; hover lifts the specialty chip's underline.
7. **Book a lesson** — id=book. Heading: 'Book a lesson.' Intro: 'Tell us what fits and we'll hold a slot — or just come by the shop.' Left column, contact block on dune (12px radius): lucide map-pin '12 Dock Road, [BEACH]'; clock 'Shop daily 8:00–17:00 · lessons dawn to mid-morning'; phone '(555) 014-8890'; mail 'hello@driftline.surf' (from content.ts, changes with [BRAND]). Right column, the form (labels Archivo 600 13px ink, inputs sand ground, driftwood border, 8px radius): name, email, level chips (First timer / Improver / Advanced, single select), when chips ('Weekday dawn', 'Weekday mid-morning', 'Weekend mornings', single select), surfers stepper 1–[CLASS_SIZE] (minus/plus buttons and a Space Mono count). Button 'Save my request' (deep tide). On click: save the selection to localStorage key 'bookingRequest' and show an inline note (dune panel, 300ms fade): 'Saved on this device only — this demo form sends nothing. Call or email us to confirm.' Nothing submits anywhere.
   Layout: 12-column grid: contact columns 1–4, form columns 6–12; mobile stacks contact above the form.
   Motion: Chips toggle to deep tide ground with sand text (200ms); the stepper count ticks with a small y-bounce; the saved note fades in; reduced motion keeps color-only transitions.
8. **Find us — map strip** — Heading: 'Find us.' A full-width stylized coastline map drawn in code (BeachMap.tsx): fadedblue sea with two subtle wave-arc lines, dune-colored land shapes, a jetty line reaching into the water, and one sunbleach pin with a deep tide outline at the northern end. Beside/below the map: Archivo 16px ink 'Northern end of [BEACH], beside the old jetty. Park on Dock Road — the shop is the blue container with the boards out front.' and boards-sand.webp as a 3:4 photo (boards standing in the sand) with caption 'The fleet, ready for the morning session.'
   Layout: Map strip 320px tall, full-bleed width (SVG scales, viewBox 0 0 1440 320); text and photo in a 2-column row beneath (photo columns 1–4 at 3:4, text columns 6–12 self-center).
   Motion: The pin pops in (scale 0→1, 300ms spring) when the section enters; the map and photo are otherwise static; photo fades up.
9. **Footer** — Dune band with a driftwood top hairline. Left: the [BRAND] wordmark and one line Archivo fog 'See you at dawn.' Right: anchor links 'Lessons · Camps · Coaches · Book' in ink; contact 'hello@driftline.surf · (555) 014-8890'. Optional [CREDIT] link in fog. No dates, no social row.
   Layout: py-12, max-w-6xl, flex row wrapping to column on mobile.
   Motion: None.

## Assets
- image: Download https://media.vibefather.ai/assets/57a81e6a-056a-40ad-9286-45f1c8694f6a/hero-wave.webp to public/images/hero-wave.webp. Alt: 'An empty wave peeling down a sandy point at soft morning light.' Used full-bleed as the hero anchor (16:9). Generated by VibeFather with qwen-image-3.0-pro, redistributable with this template.
- image: Download https://media.vibefather.ai/assets/57a81e6a-056a-40ad-9286-45f1c8694f6a/surfer-small.webp to public/images/surfer-small.webp. Alt: 'A lone surfer, tiny in the frame, paddling out over glassy water at dawn.' Used as the camps mood photo (3:4 crop). Generated by VibeFather with qwen-image-3.0-pro, redistributable with this template.
- image: Download https://media.vibefather.ai/assets/57a81e6a-056a-40ad-9286-45f1c8694f6a/coach-lineup.webp to public/images/coach-lineup.webp. Alt: 'A coach in a wetsuit seen from behind, standing in waist-deep water and watching the line-up.' Coach card 1 (3:4). Generated by VibeFather with qwen-image-3.0-pro, redistributable with this template.
- image: Download https://media.vibefather.ai/assets/57a81e6a-056a-40ad-9286-45f1c8694f6a/coach-push.webp to public/images/coach-push.webp. Alt: 'From behind, a coach steadying a beginner's board into the white water.' Coach card 2 (3:4). Generated by VibeFather with qwen-image-3.0-pro, redistributable with this template.
- image: Download https://media.vibefather.ai/assets/57a81e6a-056a-40ad-9286-45f1c8694f6a/coach-walk.webp to public/images/coach-walk.webp. Alt: 'A coach walking away down the beach with a surfboard under one arm, seen from behind.' Coach card 3 (3:4). Generated by VibeFather with qwen-image-3.0-pro, redistributable with this template.
- image: Download https://media.vibefather.ai/assets/57a81e6a-056a-40ad-9286-45f1c8694f6a/boards-sand.webp to public/images/boards-sand.webp. Alt: 'Plain soft-top surfboards standing upright in the sand.' Used in the 'Find us' strip (3:4). Generated by VibeFather with qwen-image-3.0-pro, redistributable with this template.
- icon: lucide-react (ISC) via npm — arrow-right in links and CTAs, map-pin, clock, phone and mail in the contact block, plus and minus in the party-size stepper, menu and x for the mobile header. No other iconography: no emoji, no wave logos, no brand marks.
- font: @fontsource/bricolage-grotesque (OFL, weights 600, 700, 800), @fontsource/archivo (OFL, weights 400, 500, 600) and @fontsource/space-mono (OFL, weights 400, 700), imported in src/main.tsx; never loaded from fonts.googleapis.com or any CDN. List all three families and the six photographs in ASSETS.md at the project root: path, source, generator or author, license.

## Don'ts
- No backend, no network calls, no analytics, no weather API: the forecast strip is invented sample data from src/content.ts with its visible SAMPLE FORECAST label, and the booking form saves to localStorage only with an inline note saying so — no form ever submits.
- No CDN anything: fonts ship through Fontsource packages, icons from lucide-react, photographs from public/images; never hotlink, never use Unsplash/Pexels/Pixabay or placeholder-image services.
- Production build: single command, minified, no source maps, no src/ in the output, relative paths (Vite base './'); keep dist/ under 20 MB by compressing each photograph to ≤ 350 KB WebP.
- Single page with anchor navigation only; must render cleanly at 1440×900 and 390×844 with zero console errors, and respect prefers-reduced-motion (parallax, zoom and forecast loops off; fades only).
- No real surf schools, surf brands, board logos or recognizable breaks: the school, coaches, spot and streets are invented, and [BRAND] is used everywhere a name appears.
- Photographs carry no readable text or logos, and any person is small in frame, from behind, or otherwise not identifiable — never a portrait-style face shot; if a generated image ever shows a face or writing, replace it.
- No dates from the real clock: the forecast is a static Mon–Fri sample, session times are weekday patterns, and no publish dates or years appear anywhere.
- Keep the sun-bleached direction locked: sand and dune grounds, faded ocean blue, deep tide and one warm sunbleach highlight, soft ink text, and the warm grain overlay over the entire page including photos; no saturated cyan, no neon, no dark mode, no glassmorphism.
- All copy, labels, sample data and alt text in US English, living in src/content.ts; when [BRAND], [BEACH], [PRICE_LESSON] or [CLASS_SIZE] change, rewrite coach names, spot details and sport-specific lines to fit the new school instead of leaving surf copy under another sport's brand.
- List every third-party file (three Fontsource families, lucide icons, six photographs) in ASSETS.md at the project root: path, source, license.

---
— Prompt by VibeFather · https://vibefather.ai/t/surf-school-website · CC BY-NC 4.0 (non-commercial; commercial use needs a VibeFather Pro license) · Request removal: https://vibefather.ai/takedown
