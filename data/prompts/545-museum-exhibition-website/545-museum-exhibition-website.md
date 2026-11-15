# Museum Exhibition Website

Build this website exactly as described below. Replace the [VARIABLES] with your own values; keep everything else.

## Brief
A one-page site for an invented museum exhibition: a hero anchored by one striking object photograph under an oversized serif show title, six zoomable object highlights (click to inspect — scale and pan with local CSS transforms), a quiet visit block, a timed-ticket picker that saves locally, a four-event sample programme and a code-drawn shop teaser — gallery white with one museum blue accent.

- Audience: Weekend visitors planning a timed slot, members, students and design-minded tourists who browse exhibitions before booking.
- Goal: Slow the visitor down over the objects, then turn that interest into a saved timed-entry pick or an event plan.
- Tone: Calm catalog voice: exact materials, short captions, unhurried sentences; the objects do the talking.

## Stack
- Framework: Vite 5 + React 18 + TypeScript
- Styling: Tailwind CSS 3.4
- Libraries: motion (MIT), lucide-react (ISC), @fontsource/fraunces (MIT), @fontsource/inter (MIT), @fontsource/ibm-plex-mono (MIT)
- Build: `npm run build` → static files in `dist/`. No backend, no server code, no external APIs.
- Setup:
  - vite.config.ts: base './', build.sourcemap false, nothing from src/ copied into dist/.
  - tailwind.config.js: extend colors gallery #FAF8F3, ink #17181C, museum #2545C8, stone #F1EEE7, line #E4E0D6, plate #DEDBD4; fontFamily display 'Fraunces', body 'Inter', mono 'IBM Plex Mono'.
  - All copy, objects, captions, events, ticket data and shop items live in src/content.ts as typed objects; components never hard-code copy.
  - Zoom inspector: src/components/ObjectImage.tsx renders a figure with a fixed-aspect frame and the img inside; inspection state (scale 1–3, pan x/y) is applied as one inline CSS transform; pointerdown/move/up handle drag, wheel and buttons clamp the scale; Escape and a reset button return to 1x. No tile service, no network calls.
  - The ticket pick persists to localStorage under the key [BRAND_SLUG]-slot, where [BRAND_SLUG] is [BRAND] lowercased with hyphens.

## Variables
- [BRAND] — Museum name (default: "The Meridian House"). Wordmark, hero caption, footer and the localStorage key via [BRAND_SLUG].
- [CITY] — City (default: "Ashport"). Hero eyebrow, address and directions copy.
- [SHOW_NAME] — Exhibition title (default: "Measure of Days"). The oversized serif hero headline and page copy.
- [TICKET_PRICE] — Adult ticket (default: "$18"). Adult timed-entry price used by the picker and total line.
- [CREDIT] — keep a small "Template by VibeFather" link to https://vibefather.ai/t/museum-exhibition-website in the footer (default: yes; delete this line to remove it)

The copy under Pages & Sections is written for the default values. If your values differ, rewrite every headline, paragraph, label and image for them — same length, tone and structure. Layout, colors, type and motion stay as described.
Keep all copy, image paths and links in one content file (for example `src/content.ts`), keyed by section, so the content can be swapped later without touching components.

## Design
### Colors
- gallery `#FAF8F3` — Warm white page ground
- ink `#17181C` — Near-black text and rules
- museum `#2545C8` — The single accent: links, buttons, active chips, column top rules, inspector frame
- stone `#F1EEE7` — Alternating quiet band tint (intro, visit)
- line `#E4E0D6` — Hairlines, image borders, table rules
- plate `#DEDBD4` — Neutral gray photo backdrop referenced in captions and imagery

### Typography
- Display / oversized serif: Fraunces (OFL), weights 300/400/600
- Body: Inter (OFL), weights 400/500
- Mono / labels, times, captions: IBM Plex Mono (OFL), weights 400/500

### Layout & motion
- Spacing: Airy editorial: sections py-28 desktop / py-20 mobile; hero py-32; container max-w-[1200px] px-6; object rows gap-16; hairline rules between sections.
- Radius: Almost none: 2px on chips, buttons and time slots; images keep square corners with a 1px line border; the only pill is the small 'LOOK CLOSER' chip (999px).
- Motion: Gentle reveals: sections fade up 16px over 500ms with a 60ms stagger (Motion whileInView, once) — slower and quieter than a product page.
- Motion: Hero: the show title's words rise 12px in a 600ms stagger; the hero photograph settles from scale 1.02 to 1 over 700ms.
- Motion: Zoom inspector: entering inspection scales the image from 1 to 2.4 over 300ms ease-out; drag pans with the pointer (cursor grab/grabbing); wheel zoom clamps 1–3x; plus, minus and reset buttons animate the same transform; a 1px museum frame appears around the active image and the 'LOOK CLOSER' chip fades out.
- Motion: Chips and steppers press to scale 0.97 with a 150ms ease; the ticket confirmation panel fades and slides 12px.
- Motion: prefers-reduced-motion: reveals appear instantly; the zoom still works (it is user-initiated) but enters without the scale animation.
- Imagery: Museum studio photography on a seamless neutral gray (#DEDBD4) backdrop: one invented artifact per frame, centered, generous margin, soft diffused light from the upper left with one gentle long shadow — like catalog plates. Invented artifacts only; no real artworks, no identifiable cultural items, no people, no hands, no text in frame.

## Pages & Sections
### [BRAND] — [SHOW_NAME] (`index.html`)
1. **Site header** — Sticky 72px header on gallery; a 1px line bottom appears once scrolled. Left: wordmark [BRAND] in Fraunces 600 20px ink. Center nav: Exhibition, Objects, Visit, Events — Inter 500 14px ink/70, hover ink with a 2px museum underline. Right: text link 'Timed tickets' in Inter 500 museum → #tickets. Mobile: nav collapses behind a lucide menu button opening a full-width drawer with the same links stacked.
   Layout: Inner container max-w-[1200px]; header transparent over the hero until scroll.
   Motion: Hairline and a faint gallery tint fade in after 80px of scroll (300ms); the drawer slides down 250ms.
2. **Hero — one object, one title** — Eyebrow mono 12px museum uppercase: 'CURRENT EXHIBITION · [CITY]'. H1 = [SHOW_NAME] in Fraunces 300 at clamp(64px, 11vw, 148px), ink, tight leading, broken onto two lines for the default ('Measure' / 'of Days' — break after the first word). Sub Inter 400 18px ink/70 max-w-[52ch]: 'Timekeeping before the clock: forty-one objects that measured, counted and marked the day — from spiral water clocks to knotted cords.' Link 'Plan a visit ↓' Inter 500 museum → #visit. The hero object photograph public/images/spiral-water-clock.webp (4:3, 1px line border), alt 'A cast bronze spiral basin with stepped walls, photographed on a neutral gray backdrop'; caption below the image in mono 12px ink/60: 'SPIRAL WATER CLOCK · CAST BRONZE · COLLECTION OF [BRAND]'.
   Layout: Editorial overlap: lg:grid-cols-[52%_48%]; the photograph sits right and its left edge tucks 40px under the H1's last line (H1 z-10 over the photo z-0); on mobile the photo follows the sub copy at full width.
   Motion: The title's words rise in a 600ms stagger; the photograph settles from 1.02 to 1; nothing else moves.
3. **Introduction strip** — One paragraph Inter 400 16px ink/80 max-w-[68ch]: 'Before mainsprings, people kept time with water, sand, knots and light. [SHOW_NAME] gathers the tools they built — humble, exact and quietly beautiful — across five galleries on the first floor.' Three stat lines in a quiet row (mono 12px ink/60 labels, Fraunces 300 32px ink values): '41 OBJECTS', '5 GALLERIES', '40 MIN SLOW VISIT'.
   Layout: Band on stone; the stats row is grid-cols-3 with hairline dividers in line.
   Motion: Fades up once, 500ms.
4. **Object highlights — look closer** — H2 Fraunces 300 'Six objects, held still.' Intro line ink/70: 'Click any object to look closer — the image zooms inside its frame; drag to pan.' Six objects as alternating editorial rows, each with an image frame (1px line border, cursor zoom-in, a small pill 'LOOK CLOSER' in mono 11px museum at top right on hover) and a caption block (object name Fraunces 400 28px ink, material line mono 12px museum, note Inter 15px ink/70): 1. Spiral water clock — cast bronze — 'Water entered at the rim and reached the center in one measured hour; the steps marked the quarters.' — public/images/spiral-water-clock.webp (4:3, reused from the hero), alt 'A cast bronze spiral basin with stepped walls on a neutral gray backdrop'. 2. Notched tide bowl — speckled stoneware — 'A rim of forty notches; one pebble moved per day kept the household's count.' — public/images/tide-bowl.webp (1:1), alt 'A wide stoneware bowl with a notched rim on a neutral gray backdrop'. 3. Black sand glass — blown glass, black sand — 'Turned at the knock of the night watch; runs in four minutes.' — public/images/black-sand-glass.webp (1:1), alt 'A two-bulb glass vessel with black sand on a neutral gray backdrop'. 4. Counting cord — flax fiber — 'Knots in clusters of days; a year could be held in two hands.' — public/images/counting-cord.webp (1:1), alt 'A knotted flax cord coiled into a flat spiral on a neutral gray backdrop'. 5. Ring dial — pierced brass — 'Three rings, three holes; aligned to the noon shadow it gave the month.' — public/images/ring-dial.webp (1:1), alt 'Three nested pierced brass rings on a neutral gray backdrop'. 6. Day tile — fired clay, white slip — 'A pressed grid of thirty dots per face, scratched off at dusk.' — public/images/day-tile.webp (1:1), alt 'A square clay tile incised with a grid of dots on a neutral gray backdrop'. Clicking an image opens the inspector in place: the frame locks its size, the image scales to 2.4x over 300ms, cursor becomes grab, drag pans, wheel zooms 1–3x, a small control cluster (plus, minus, reset icon buttons) appears bottom right; reset or Escape returns to 1x. Captions stay in place under the frame. All transforms are local CSS on the img; no tile service, no fetching.
   Layout: Rows alternate image-left / image-right; image column about 55% width; rows separated by line hairlines; identical on mobile with the image on top.
   Motion: Per the motion list: staggered row reveals; the inspector entry scale, drag pan, clamped wheel zoom and control-button zoom; museum frame on the active image.
5. **Visit** — Band on stone. H2 Fraunces 'Visit'. Three quiet columns, each opening with a 24px top rule in museum: HOURS — table mono 13px: Tue–Fri 10:00–18:00, Sat 10:00–20:00, Sun 11:00–17:00, Mon closed; note 'Last timed entry 60 minutes before close.' FIND US — '3 Quillon Street, [CITY]' and 'Two blocks from the Harbor tram stop; the door is under the blue awning.' ADMISSION — 'Adults [TICKET_PRICE] · Under 18 free · Pay-what-you-wish after 16:00.'
   Layout: grid md:grid-cols-3 gap-10 with museum top rules per column.
   Motion: Columns fade up staggered 80ms.
6. **Timed tickets** — H2 'Timed tickets'. Left copy Inter 16px ink/70: 'Entry is by ninety-minute slot. Pick a day and a time below — the pick saves on this device. It is a sample planner: no payment is taken and tickets are not held.' Steppers: Adults [TICKET_PRICE], Under-18 free, Reduced $12 — minus/plus buttons with mono counts. Right picker card (white, 1px line border): 'DAY' chips MON–SUN; 'TIME' slot buttons — 10:00 AVAILABLE, 11:30 FEW LEFT (sub-label), 13:00 disabled 'SOLD OUT', 14:30 AVAILABLE, 16:00 'PAY-WHAT-YOU-WISH'; total line mono 13px ink 'TOTAL $36' (with defaults: two adults); primary button 'Reserve a slot' (museum fill, white text). After saving, an inline panel with a lucide check: 'Saved to this device. Sample picker — nothing was charged; tickets are not held.' State persists under [BRAND_SLUG]-slot and rehydrates on load.
   Layout: lg:grid-cols-2 gap-12; picker card p-8; the confirmation panel replaces the button row.
   Motion: Chips and steppers press to 0.97; the panel fades and slides 12px.
7. **Events** — H2 'Events'. Four rows with line hairlines, each: weekday and time mono 13px museum, title Fraunces 400 24px ink, place and tag Inter 14px ink/70 — SAT 11:00, 'The Long Noon', curator's talk, Gallery II, 'Included with a ticket.'; SUN 14:00, 'Knot a Counting Cord', family workshop, Learning Studio, 'Materials $6.'; THU 18:00, 'Measures at Dusk', late opening, whole museum, 'Bar in the atrium.'; WED 10:00, 'Quiet Hour', low light and low sound, Gallery I, 'Sensory-friendly.' Footnote mono 12px ink/50: 'Sample programme — a weekly pattern, not a live calendar.'
   Layout: Rows list max-w-3xl, single column.
   Motion: Rows fade up staggered 60ms.
8. **Shop teaser and footer** — H2 'Take the day home.' Three code-drawn product cards (inline SVG on white, 1px line border, square 1:1): CATALOGUE — a drawn book cover: ink rectangle with a museum spine band and a small spiral mark — $34; COUNTING-CORD KIT — a drawn coiled cord: concentric circles with knot dots — $16; BLACK-SAND GLASS — a drawn two-bulb vessel: two circles joined by a narrow waist, lower bulb half-filled black — $48. Labels mono 12px ink/60, prices Fraunces 20px ink; line under the grid, Inter 14px ink/70: 'At the museum shop, by the atrium.' (plain text, no link). Footer: wordmark [BRAND], address '3 Quillon Street, [CITY]', small print 12px ink/50: 'Objects, events and prices shown are invented sample content.' plus [CREDIT].
   Layout: Cards grid md:grid-cols-3 gap-6; footer py-12 with a line hairline top.
   Motion: Cards fade up staggered; the SVGs are static.

## Assets
- image: Six generated museum studio photographs, downloaded into public/images/ and used nowhere else: spiral-water-clock.webp (4:3, hero and object 1), tide-bowl.webp (1:1), black-sand-glass.webp (1:1), counting-cord.webp (1:1), ring-dial.webp (1:1), day-tile.webp (1:1) — the object highlights. Each downloads from https://media.vibefather.ai/assets/d6bc3e92-31ba-4d4e-b2ed-0047c7a2cf43/<file>. Alt text for each is written in the object section above. Credit in ASSETS.md: 'Generated by VibeFather with qwen-image-3.0-pro, redistributable with this template.'
- icon: lucide-react npm package (ISC): menu, x, plus, minus, rotateCcw (reset), zoomIn, check, mapPin, clock. No other icon sets, no brand logos.
- font: Fontsource packages (MIT): @fontsource/fraunces 300/400/600; @fontsource/inter 400/500; @fontsource/ibm-plex-mono 400/500. Imported in main.tsx; no font CDN links.

## Don'ts
- No real museums, exhibitions, artists or artworks: the show, objects, captions, events and shop items are invented; nothing may imply a real collection or loan.
- Objects are invented artifacts — generic materials and forms only; no identifiable cultural, religious or national items, no real artworks or replicas.
- The zoom is a local CSS-transform demo on the delivered image files: no tile servers, no image APIs, no network requests on interaction.
- Tickets and events are sample weekday patterns labeled as samples; no dates or times computed from the real clock; no JavaScript Date-based logic.
- No booking or payment: the picker saves to localStorage only and its confirmation says nothing was charged and tickets are not held.
- Self-host everything: Fontsource fonts, downloaded images, no CDN script or link tags, no Google Fonts, no analytics.
- Vite base './' with relative asset paths; internal links point to anchors on index.html or real file names, never to bare directories.
- Production build minified, no source maps, dist/ under 20 MB.
- prefers-reduced-motion: reveals appear instantly and the zoom enters without its scale animation (user-initiated zoom and pan still work).
- Keep the palette disciplined: gallery white, ink, one museum blue; no gradients, no drop shadows on UI (the only shadows are inside the photographs).
- No SEO scaffolding beyond a plain <title> with [BRAND] and a favicon.
- No copied code, copy, imagery or fonts from any real museum site or collection.

---
— Prompt by VibeFather · https://vibefather.ai/t/museum-exhibition-website · CC BY-NC 4.0 (non-commercial; commercial use needs a VibeFather Pro license) · Request removal: https://vibefather.ai/takedown
