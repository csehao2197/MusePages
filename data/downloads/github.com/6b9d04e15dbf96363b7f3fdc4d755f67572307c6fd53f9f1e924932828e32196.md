# Theme Park Website

Build this website exactly as described below. Replace the [VARIABLES] with your own values; keep everything else.

## Brief
A single-page theme park site drawn entirely in code: a candy-palette identity, an illustrated SVG park map as the hero anchor with zones, flat-vector landmarks and filterable ride dots, a matching ride list, chunky ticket and pass comparison with demo buttons, a sample hours-and-shows strip, and a locally saved plan-your-day checklist with reorderable itinerary.

- Audience: Theme parks, water parks, family attractions and adventure venues, plus the studios building their summer pages.
- Goal: Get a family from 'ooh, look' to a planned day: play with the map, filter rides to the kids' height, pick a ticket, and leave with a saved itinerary — all honestly labeled as sample data with no ticketing connected.
- Tone: Joy-forward and a little sugary, but never shouty — puns allowed, exclamation rationed; the colors shout so the copy can stay friendly.

## Stack
- Framework: Vite 5 + React 18 + TypeScript
- Styling: Tailwind CSS 3.4
- Libraries: tailwindcss (MIT), motion (MIT), lucide-react (ISC), @fontsource/fredoka (OFL), @fontsource/dm-sans (OFL)
- Build: `npm run build` → static files in `dist/`. No backend, no server code, no external APIs.
- Setup:
  - Scaffold with npm create vite@latest theme-park-website -- --template react-ts; add tailwindcss@3.4, postcss and autoprefixer as dev dependencies; add motion, lucide-react, @fontsource/fredoka and @fontsource/dm-sans as dependencies.
  - vite.config.ts: base './', build.sourcemap false, build output dist/.
  - tailwind.config.js: extend colors cream #FFF8F0, bubblegum #FF7DA5, sky #79C7F2, lemon #FFD23F, mint #7BD9B0, grape #4A3560, lilac #8E7AAE, snow #FFFFFF; fontFamily display 'Fredoka' and sans 'DM Sans'; radius: chunky defaults (chip 14px, card 24px, blob 32px).
  - postcss.config.js: tailwindcss + autoprefixer.
  - src/components/ParkMap.tsx: the illustrated map in one SVG, viewBox 0 0 900 560 — four zone blobs as rounded organic polygons in flat fills (Candy Canyon bubblegum, Sky Harbor sky, Lemon Grove lemon, Mint Meadow mint), a lilac entrance strip at the bottom with two path lines connecting zones, a small lake shape in Sky Harbor, tree dots (12px mint/grape circles at fixed positions), flat-vector landmarks (a ferris wheel as a circle with 8 spokes in Sky Harbor, a double-loop coaster as a single looping path in Candy Canyon, a carousel as a circle with a triangle roof in Mint Meadow), and fourteen ride dots (12px white-stroked circles in their zone colors at fixed positions from content.ts); dots pop in staggered on load; a filter prop (thrill | height) dims non-matching dots to 15% with grayscale (250ms); clicking a dot opens a popover card; keyboard focus moves through dots as buttons.
  - src/components/RideIcon.tsx: six tiny flat-vector ride glyphs drawn in SVG (coaster loop, spinner, drop tower, flume splash, carousel, ferris wheel) — simple geometry, zone-colored, 28px, no outlines beyond grape 2px.
  - src/components/Confetti.tsx: a one-shot burst of six small candy shapes (circles, triangles, squares in the four zone colors) rising 40px and fading over 600ms from a trigger point, aria-hidden, disabled under prefers-reduced-motion.
  - src/hooks/useDayPlan.ts: the plan-your-day state — an ordered array of ride/show ids persisted to localStorage key 'dayPlan'; exposes add/remove/moveUp/moveDown/clear; adding fires the Confetti burst once.
  - src/lib/motion.ts: springy variants — popIn (scale 0.6→1, spring stiffness 260 damping 18), reveal (opacity 0→1, y 22→0, 500ms ease-out, 70ms stagger, whileInView once) — with useReducedMotion falling back to plain 200ms fades and no confetti or springs.
  - Keep every user-facing string and data set (park, town, ticket price, ride count, zones, rides array {id, name, zone, thrill 'mild'|'wild'|'max', height 'any'|'102'|'122', icon, blurb, mapAt{x,y}}, shows, hours, tickets) in src/content.ts; sections read from it so values swap in one place.
  - index.html: <title>[BRAND] — [CITY]'s Theme Park</title> plus a drawn-in-code favicon.svg (a bubblegum balloon circle on cream); no other meta work.

## Variables
- [BRAND] — Park name (default: "Jubilee Junction"). Invented park name for the wordmark, hero headline, page title and footer.
- [CITY] — Town (default: "Fernhollow"). The invented town the park lives in — hero sub-line, address and footer.
- [TICKET_DAY] — Day pass price (default: "$58"). The day-pass price on the tickets comparison and the header CTA's expectation.
- [RIDES] — Ride count (default: "24"). The sample total ride count in the hero stat row ('[RIDES] rides, four zones — sample'); the map shows fourteen of them.
- [CREDIT] — keep a small "Template by VibeFather" link to https://vibefather.ai/t/theme-park-website in the footer (default: yes; delete this line to remove it)

The copy under Pages & Sections is written for the default values. If your values differ, rewrite every headline, paragraph, label and image for them — same length, tone and structure. Layout, colors, type and motion stay as described.
Keep all copy, image paths and links in one content file (for example `src/content.ts`), keyed by section, so the content can be swapped later without touching components.

## Design
### Colors
- Cream `#FFF8F0` — Page ground everywhere — warm candy-shop cream.
- Bubblegum `#FF7DA5` — Zone 1 (Candy Canyon) and the primary accent: CTAs, active chips, the flagged ticket.
- Sky `#79C7F2` — Zone 2 (Sky Harbor); secondary chips and info tints.
- Lemon `#FFD23F` — Zone 3 (Lemon Grove); highlight tags, the hours strip's sun icon.
- Mint `#7BD9B0` — Zone 4 (Mint Meadow); success states, added-to-plan checks.
- Grape ink `#4A3560` — Primary text and all SVG outlines — deep grape, never black.
- Lilac `#8E7AAE` — Secondary text, the map's entrance strip, meta lines.
- Snow `#FFFFFF` — Cards, panels, ride-dot strokes — crisp white against cream.

### Typography
- Display — park name, headlines, zone names, ticket prices (chunky rounded): Fredoka (OFL), weights 500/600/700
- Text — body, chips, ride blurbs, checklist (labels uppercase tracked 0.08em): DM Sans (OFL), weights 400/500/700

### Layout & motion
- Spacing: Playful and roomy: sections py-24 (96px) desktop / py-16 mobile; content max-w-6xl px-6/px-10; chunky cards carry 24px padding and generous 24px gaps; the map panel gets full content width with 32px of clear space.
- Radius: Chunky everywhere: 24px on cards and the map panel, 14px on chips and inputs, 999px pills on buttons, 32px blob radii on zone shapes; nothing square.
- Motion: Map dots pop in on load (scale 0.6→1, spring stiffness 260 damping 18, staggered 40ms) — the park switching its lights on.
- Motion: Filters: non-matching dots and ride cards dim to 15% with grayscale (250ms); matching items bounce once (scale 1→1.04→1); counts in the mono-ish caption update instantly.
- Motion: Ride popover: card pops from its dot (scale 0.8→1 spring) and closes on outside click, Escape or its X.
- Motion: Add-to-plan: the checklist row pops in with a six-shape Confetti burst (600ms, once per add); move up/down slides rows 200ms.
- Motion: Reveals: sections and cards rise (y 22→0, 500ms ease-out) with 70ms stagger via Motion whileInView, once; ticket cards land with a small overshoot.
- Motion: prefers-reduced-motion: no pops, springs or confetti; dots and cards render at rest; filters switch instantly; all reveals become 200ms opacity fades.
- Imagery: Zero photography — the whole park is flat-vector code drawing: candy-colored zone blobs, geometric landmarks (wheel, looping coaster, carousel), simple tree and crowd dots without faces, tiny ride glyphs, and confetti shapes. Everything shares one flat-illustration language: 2px grape outlines, flat fills, no gradients, no textures, no characters or mascots with faces.

## Pages & Sections
### [BRAND] — [CITY]'s Theme Park (`index.html`)
1. **Header** — Fixed top bar, 64px, cream ground at 94% opacity with a soft shadow. Left: the [BRAND] wordmark in Fredoka 700 20px grape. Right (desktop): anchor links 'Map', 'Rides', 'Tickets', 'Shows', 'Plan' in DM Sans 700 14px grape → bubblegum on hover; then a bubblegum pill 'Get tickets' (snow text) → #tickets. Mobile: wordmark + pill + lucide menu/x toggle opening a snow panel with the five links stacked.
   Layout: position fixed, z-40.
   Motion: Mobile panel bounces down 300ms; link hovers 150ms; the pill squashes 0.96 on press.
2. **Hero — the illustrated map** — Left block above the map: label in DM Sans 700 12px uppercase tracked 0.12em bubblegum: '[RIDES] RIDES · FOUR ZONES · [CITY]'; headline Fredoka 700 clamp(2.75rem, 6vw, 4.75rem) grape: 'Pick your thrill.'; sub DM Sans 400 17px lilac max-w 42ch: 'Tap a dot, check the height, build your day. [BRAND] is a demo park — every number on this page is sample copy.' CTAs: 'Plan your day' (bubblegum pill) → #plan; 'See tickets' (outline grape) → #tickets. Then the ParkMap panel (snow ground, 24px radius, grape 2px border): the four zone blobs with their names in Fredoka 600 16px grape set on the blobs, landmarks, ride dots, and a floating filter bar docked at the panel's bottom (snow pill row): THRILL [All / Mild / Wild / Max] × HEIGHT [All / Any height / 102 cm+ / 122 cm+]. Clicking a dot opens the ride popover: name Fredoka 600 18px grape, zone chip, thrill meter (three filled/empty grape dots), height chip, blurb line, and 'Add to my day +' (mint pill) — which adds to the checklist and fires confetti.
   Layout: min-h auto: text block constrained to max-w-2xl above the map; map panel full content width (aspect ~16:10) with the filter bar inside its bottom edge; mobile: map scrolls horizontally in its panel at 4:3 before stacking filters below.
   Motion: Dots pop in staggered on load; filters dim non-matching dots (250ms) and matching dots bounce once; popovers pop from dots; reduced motion: dots at rest, instant filters.
3. **Ride list** — id=rides. Label 'ALL RIDES' bubblegum; heading Fredoka: 'Nine of [RIDES], filtered.' The same THRILL/HEIGHT filters mirrored here (shared state with the map). Ride cards (snow, 24px radius, grape 2px border) in a 3-column grid: a RideIcon in the zone color, name Fredoka 600 18px grape, blurb DM Sans 14px lilac, a zone chip, thrill meter (three dots) and height chip, and 'Add to my day +' (mint pill, turns into a mint check 'In your day' when added). Rides: 'Gumdrop Coaster' — Candy Canyon — mild, any height — 'First loops, gentle speed, endless grins.' / 'Taffy Twister' — Candy Canyon — wild, 102 cm+ — 'Spins until the horizon disagrees.' / 'Sky Diver' — Sky Harbor — max, 122 cm+ — 'Straight down, politely.' / 'Cloud Carousel' — Sky Harbor — mild, any height — 'Bobbing seahorses, vintage paint.' / 'Big Wheel' — Sky Harbor — mild, any height — 'The view, at a civilized speed.' / 'Lemon Drop Tower' — Lemon Grove — wild, 122 cm+ — 'Up slowly, down immediately.' / 'Citrus Splash' — Lemon Grove — wild, 102 cm+ — 'The flume with the famous final wave.' / 'Mint Express' — Mint Meadow — mild, any height — 'A family coaster through the mint beds.' / 'Meadow Racers' — Mint Meadow — wild, 102 cm+ — 'Head-to-head karts, one winner's photo.' Caption: 'HEIGHTS AND THRILL LEVELS ARE SAMPLE DATA.'
   Layout: 3-column grid (2 tablet, 1 mobile) with 24px gaps; chips wrap within cards.
   Motion: Filtering bounces matching cards once and dims non-matching (250ms); cards reveal staggered 70ms; adding pops a mint check and fires confetti; reduced motion: instant filters, plain fades.
4. **Tickets** — id=tickets. Label 'TICKETS' bubblegum; heading: 'Pick your wristband.' Three chunky cards (snow, 24px radius, grape 2px border): 'DAY PASS' — '[TICKET_DAY]' Fredoka 700 44px grape — rows with lucide check (mint): 'All [RIDES] rides' / 'Both daily shows' / 'Free parking after noon'. 'SEASON PASS' — '$149' — flagged with a bubblegum ribbon 'PICKED FOR SUMMER' and a bubblegum border: 'Every open day' / 'Bring-a-friend mornings' / '10% off snacks'. 'FAMILY FOUR' — '$199' — 'Two grown-ups, two kids' / 'All rides and shows' / 'One souvenir photo'. Each card's 'Buy — demo' button (grape pill) reveals the shared inline note (300ms): 'Demo button — no ticketing is connected; nothing is charged.' Caption: 'PRICES ARE SAMPLE DATA.'
   Layout: 3-column grid (stacked on mobile) with 24px gaps; the season card lifts 8px on desktop; ribbon across its top border.
   Motion: Cards land with a small overshoot on reveal; the ribbon sways once (±3°, 500ms); demo note fades in and stays.
5. **Hours and shows** — id=shows. A lemon-tinted strip: 'TODAY'S HOURS' in DM Sans 700 12px tracked grape, '10:00 — 20:00' in Fredoka 700 32px grape, and the lilac sample note 'SAMPLE HOURS — NO REAL CLOCK.' Then three show rows (snow cards, 24px radius): 'Parade of Sprinkles' — '13:00 & 17:00 · Main Street' — 'Floats, brass, one very slow tortoise.' / 'Harbor Stunt Dive' — '14:30 · Sky Harbor stage' — 'Kites, trampolines, a suspicious amount of confetti.' / 'Lantern Glow' — '19:30 · Mint Meadow' — 'A quiet end; bring the sleepy ones.' Each show row carries an 'Add to my day +' mint pill feeding the same checklist.
   Layout: Hours strip full-width with a lemon sun icon (drawn SVG); show rows in a 3-column grid (stacked on mobile).
   Motion: Strip fades up; show cards reveal staggered 70ms; the sun icon rotates 360° once on reveal (800ms); reduced motion: no rotation.
6. **Plan your day** — id=plan. Label 'PLAN YOUR DAY' bubblegum; heading: 'Your day, in order.' Intro DM Sans 16px lilac: 'Tap rides and shows anywhere on this page — they land here, saved on this device.' The itinerary panel (snow, 24px radius, grape 2px border): ordered rows with a numbered bubblegum badge, the name in Fredoka 600 16px grape, its zone chip, and controls (lucide arrow-up, arrow-down, x, all ≥ 44px); empty state: a mint dashed outline card saying 'Nothing yet — go tap something fun on the map.' Buttons: 'Clear the day' (outline grape) and a summary line '6 stops · 3 rides · 2 shows · 1 parade' (updates live). Note DM Sans 13px lilac: 'Saved on this device only — this demo sends nothing.'
   Layout: Panel max-w-3xl mx-auto; rows 64px tall with 12px gaps; controls right-aligned; mobile keeps the same order.
   Motion: New rows pop in (spring) with the confetti burst at the panel's top-right; move up/down slides rows 200ms; clear fades rows out 200ms; reduced motion: plain fades, no confetti.
7. **Footer** — Cream ground with a grape 2px top border (the only strong rule on the page). Left: the [BRAND] wordmark and one line DM Sans 13px lilac: '1 Confetti Way, [CITY] — an invented park; rides, heights, hours and prices on this page are sample copy.' Right: anchor links 'Map · Rides · Tickets · Shows · Plan' in grape; optional [CREDIT] link. No dates, no social row.
   Layout: py-12, max-w-6xl, flex row wrapping to column on mobile.
   Motion: None.

## Assets
- icon: lucide-react (ISC) via npm — check on ticket rows and the added-to-plan state, arrow-up, arrow-down and x on itinerary controls, plus and minus where needed, sun and clock on the hours strip, map-pin in the footer, menu and x for the mobile header. No other iconography: no emoji, no park-chain marks, no ride logos. Everything visual — the park map, zone blobs, landmarks, ride glyphs, confetti and the sun — is drawn in SVG by the builder following the section specs; no image files are used anywhere.
- font: @fontsource/fredoka (OFL, weights 500, 600, 700) and @fontsource/dm-sans (OFL, weights 400, 500, 700), imported in src/main.tsx; never loaded from fonts.googleapis.com or any CDN. List both families and the lucide icon package in ASSETS.md at the project root: path, source, license — there are no image assets to list.

## Don'ts
- No ticketing backend, no payments, no network calls: buy buttons are demo anchors that reveal the inline note ('no ticketing is connected; nothing is charged'), and the plan saves to localStorage only with its honest note.
- No real theme parks, ride names, shows or franchises: the park, rides, shows and prices are invented; no castles, characters, mouse ears or any silhouette resembling a real park or franchise — map landmarks stay generic geometry (wheel, loop, carousel).
- Heights, thrill levels, hours and show times are sample data and stay labeled; no dates tied to the real clock — 'today's hours' is a static sample, never time-aware.
- Everything is code-drawn flat vector: no photographs, no generated images, no placeholder-image services; people are only faceless crowd dots — no figures with faces, no mascots.
- No CDN anything: fonts ship through Fontsource packages, icons from lucide-react; no third-party scripts or embeds.
- Production build: single command, minified, no source maps, no src/ in the output, relative paths (Vite base './'); keep dist/ tiny (well under 20 MB — there are no bitmaps).
- Single page with anchor navigation; must render cleanly at 1440×900 and 390×844 with zero console errors; map dots, filters and itinerary controls must be keyboard operable buttons with visible focus; all motion must respect prefers-reduced-motion (no pops, springs or confetti; plain fades).
- Keep the candy direction locked: cream ground, the four zone colors (bubblegum, sky, lemon, mint) plus grape ink, Fredoka over DM Sans, chunky 14–24px radii, flat fills only; no dark mode, no gradients, no glassmorphism, no neon glow, nothing faster than a 300ms interface transition.
- All copy, labels, sample data and alt text in US English, living in src/content.ts; when [BRAND], [CITY], [TICKET_DAY] or [RIDES] change, rewrite zone names, rides and shows to fit the new park instead of leaving dry-ride copy under a water park.
- List every third-party file (two Fontsource families, lucide icons) in ASSETS.md at the project root: path, source, license.

---
— Prompt by VibeFather · https://vibefather.ai/t/theme-park-website · CC BY-NC 4.0 (non-commercial; commercial use needs a VibeFather Pro license) · Request removal: https://vibefather.ai/takedown
