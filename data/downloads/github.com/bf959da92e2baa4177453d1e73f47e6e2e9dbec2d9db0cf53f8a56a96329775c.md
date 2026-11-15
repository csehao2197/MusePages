# Movie Theater Showtimes Website

Build this website exactly as described below. Replace the [VARIABLES] with your own values; keep everything else.

## Brief
A two-page site for an invented independent cinema: a bulb-lit marquee hero, six now-showing films with code-drawn abstract posters, showtimes by weekday, a film detail page with a drawn auditorium seat picker, three membership tiers and a visit footer — velvet red and black, every visual drawn in code.

- Audience: Neighborhood moviegoers checking tonight's times, film-club regulars choosing between the 7:00 and the 9:30, and families picking a matinee.
- Goal: Move the visitor from 'what's on' to 'these are my seats': browse films, pick a day and time, play with the seat map, and consider membership.
- Tone: Warm and a little theatrical, like a well-loved usher: short marquee lines, program-note details, no corporate polish.

## Stack
- Framework: Vite 5 + React 18 + TypeScript
- Styling: Tailwind CSS 3.4
- Libraries: motion (MIT), lucide-react (ISC), @fontsource/bungee (MIT), @fontsource/karla (MIT), @fontsource/courier-prime (MIT)
- Build: `npm run build` → static files in `dist/`. No backend, no server code, no external APIs.
- Setup:
  - vite.config.ts: base './', build.sourcemap false, nothing from src/ copied into dist/.
  - tailwind.config.js: extend colors house #150A0E, velvet #5E1520, ticket #C13A47, cream #F2E7CE, bulb #FFD98A, dim #6B5335, line #3A1B22; fontFamily display 'Bungee', body 'Karla', mono 'Courier Prime'.
  - All copy, films, poster compositions, showtime patterns, taken-seat patterns and tiers live in src/content.ts as typed objects; components never hard-code copy.
  - Marquee frame: src/components/Marquee.tsx renders two horizontal rows of bulb dots (18 per row, 10px circles, even gaps) around the sign; each dot cycles between bulb and dim over 2.6s with a 120ms stagger via CSS keyframes in src/index.css.
  - Film grain: a fixed full-page overlay div using an inline SVG feTurbulence data-URI at 5% opacity, pointer-events none, never animated.
  - The seat hold persists to localStorage under [BRAND_SLUG]-hold, where [BRAND_SLUG] is [BRAND] lowercased with hyphens.

## Variables
- [BRAND] — Cinema name (default: "The Ruby Lantern"). Marquee headline, header, footer and the localStorage key via [BRAND_SLUG].
- [CITY] — Town (default: "Old Milltown"). Used in the address and directions copy.
- [TICKET_PRICE] — Ticket price (default: "$11"). Standard adult seat price used by the seat-map tally.
- [DISCOUNT_DAY] — Cheap night (default: "Tuesday"). Weekday for the discount banner under Showtimes.
- [CREDIT] — keep a small "Template by VibeFather" link to https://vibefather.ai/t/movie-theater-showtimes-website in the footer (default: yes; delete this line to remove it)

The copy under Pages & Sections is written for the default values. If your values differ, rewrite every headline, paragraph, label and image for them — same length, tone and structure. Layout, colors, type and motion stay as described.
Keep all copy, image paths and links in one content file (for example `src/content.ts`), keyed by section, so the content can be swapped later without touching components.

## Design
### Colors
- house `#150A0E` — Page ground, near-black with a plum cast
- velvet `#5E1520` — Curtains, sign slab, membership panels
- ticket `#C13A47` — Primary buttons, active day chips, links on hover
- cream `#F2E7CE` — Program text, headlines on dark
- bulb `#FFD98A` — Lit marquee bulbs, selected seats, highlights
- dim `#6B5335` — Unlit bulbs, sign borders, quiet rules
- line `#3A1B22` — Hairlines, card borders

### Typography
- Display / marquee and film titles: Bungee (OFL), weights 400
- Body / program text: Karla (OFL), weights 400/500/700
- Mono / showtimes, seats, tallies: Courier Prime (OFL), weights 400/700

### Layout & motion
- Spacing: Section padding py-24 desktop / py-16 mobile; container max-w-[1160px] px-6; poster grid gap-8; cards p-5 to p-8.
- Radius: Posters and panels rounded-md (6px); membership cards rounded-xl; day chips and time pills rounded-full.
- Motion: Marquee bulbs twinkle gently: each dot alternates between bulb and dim over 2.6s with a 120ms stagger around the frame; opacity only (1 to 0.45), no scale, no strobe.
- Motion: The now-showing ticker under the marquee scrolls film titles left on a 40s loop (CSS translateX keyframes with duplicated content for a seamless wrap).
- Motion: Scroll reveals: sections fade up 20px over 400ms with a 60ms stagger (Motion whileInView, once).
- Motion: Seat interaction: hover lifts a seat 2px, press scales to 0.9, selection fills bulb over 150ms; the tally recomputes.
- Motion: Film grain is static at 5% and never animates; a hover on a film card raises its border to dim and scales the poster to 1.02 over 300ms.
- Motion: prefers-reduced-motion: bulbs hold a static 70%-lit pattern, the ticker stops into a wrapped static row, reveals appear instantly; seat selection still changes state without transforms.
- Imagery: None photographic. Everything is drawn in code: velvet curtain gradients (layered linear-gradients with soft fold shadows), spotlight cones (low-opacity conic gradients), bulb-dot marquee frames, six geometric SVG film posters, the auditorium seat map and its screen arc, and a 5% film-grain overlay that unifies the page.

## Pages & Sections
### [BRAND] — now showing (`index.html`)
1. **Site header** — Thin 60px header, cream on house, bottom hairline in line. Left: wordmark [BRAND] in Bungee 16px cream. Center nav: Now showing, Showtimes, Membership, Visit — Karla 500 14px cream/70, hover cream. Right: pill CTA 'Tonight's shows' (ticket fill, cream text) → #showtimes. Mobile: nav collapses behind a lucide menu button opening a full-width drawer with the same links stacked.
   Layout: Inner container max-w-[1160px]; header is transparent over the marquee hero and gains a house tint after 60px of scroll.
   Motion: Tint fades in over 300ms; the drawer slides down 250ms.
2. **Marquee hero** — Full-viewport hero on layered velvet: house ground; a wide velvet curtain across the top made of three overlapping linear-gradient swags with soft fold shadows fading into house; two spotlight cones from the top corners (conic gradients in cream at 8%, mix-blend-mode screen, static). Centered marquee sign: a rounded-[24px] slab filled velvet with a 4px dim border, wrapped above and below by rows of bulbs (18 per row). Inside the sign: [BRAND] in Bungee at clamp(44px, 8vw, 96px), cream, tight leading, centered; subline Karla 500 16px cream/80: 'Now showing · six films · three screens'; CTAs: 'See showtimes' (ticket pill, cream text) → #showtimes and 'Become a member' (cream outline pill) → #membership. Under the sign, a line in Courier Prime 13px bulb: 'DOORS 30 MIN BEFORE FIRST SHOW'.
   Layout: min-h-[92vh], flex column centered; the sign is max-w-[880px] w-[92%] py-12 px-8; the doors line sits 24px below the sign.
   Motion: Bulbs twinkle in stagger; on load the sign scales from 0.97 with a 500ms ease and the headline letters fade in with a 30ms stagger; spotlights never move.
3. **Now-showing ticker** — Full-width strip between two hairlines (velvet/60 ground, dim borders) carrying a scrolling line in Courier Prime 14px cream, film titles separated by diamond glyphs: 'MIDNIGHT ORCHARD ◆ SIGNAL TO SOLACE ◆ THE FOX OF FETTER LANE ◆ IRON LULLABY ◆ AUNT MARIGOLD'S AEROPLANE ◆ BACKLOT HONEYMOON ◆ ' — content duplicated once for a seamless 40s loop.
   Layout: h-12, content single-line, overflow hidden, whitespace nowrap.
   Motion: translateX loop 40s linear infinite; under reduced motion the strip becomes a static wrapped row of the same titles.
4. **Now showing — poster grid** — H2 in Bungee 36px cream: 'Now showing'. Grid of six film cards; card: 2:3 poster SVG, film title in Bungee 20px cream, meta line Courier Prime 12px cream/70, link 'Film page →' Karla 500 bulb to ./film.html?film=<slug>. One-line blurbs and poster compositions (inline SVG, viewBox 300x450, flat color blocks, two tones plus one accent each, no letters, no numbers, no gradients): Midnight Orchard — thriller · 104 min · PG — slug midnight-orchard — blurb 'Something is taking the fruit in the dark, one circle at a time.' — poster: field #0E1F16, one pale moon circle top-right, six dark vertical trunk bars, a single brass dot #C9A227 low center. Signal to Solace — science fiction · 131 min · PG — signal-to-solace — 'A lighthouse operator answers a signal that shouldn't exist.' — field #101B33, three concentric cream arcs beaming from a bottom-left dot, one small drifting diamond top-right. The Fox of Fetter Lane — animated family · 88 min · G — fox-of-fetter-lane — 'A fox with a market habit trades favors down one long street.' — field #C25B2E, cream crescent top-left, three black leaf silhouettes, one cream curled-tail curve bottom-right. Iron Lullaby — noir · 117 min · PG-13 — iron-lullaby — 'One last fare, and the city has quietly changed hands.' — field #14161A, forty thin vertical rain lines in cream/25, one amber lamp dot with a small light cone. Aunt Marigold's Aeroplane — adventure comedy · 116 min · G — aunt-marigolds-aeroplane — 'A retired pilot and her great-niece rebuild a biplane from barn parts.' — sky #F3E3C2, red biplane built from two triangles and a circle prop, one dotted loop trail. Backlot Honeymoon — screwball romance · 91 min · PG — backlot-honeymoon — 'Two rival publicists must stage a wedding neither wants.' — field #E9C8C8, one large cream circle, one red diagonal ribbon, three bulb dots in a corner.
   Layout: grid md:grid-cols-2 lg:grid-cols-3 gap-8; posters w-full aspect-[2/3] rounded-md with a line border; cards p-5.
   Motion: Cards fade up staggered 60ms; poster scales to 1.02 on card hover (300ms).
5. **Showtimes by day** — H2 'Showtimes'. Day chips MON–SUN in Courier Prime 13px (FRI active by default, ticket fill when active). Films listed as rows: film title Karla 700 18px cream plus genre tag Courier Prime 12px cream/60, then time pills linking to ./film.html?film=<slug>&day=Fri&time=19:00 — pill Courier Prime 13px cream, 1px cream/30 border, hover ticket border. Sample pattern in content.ts: Midnight Orchard 16:15 / 19:00 / 21:30; Signal to Solace 13:45 / 17:15 / 20:30 (Sat–Sun extra 23:00); The Fox of Fetter Lane 11:00 / 14:00 (weekends only); Iron Lullaby 18:00 / 20:45; Aunt Marigold's Aeroplane 10:30 / 13:15 / 16:00; Backlot Honeymoon 15:00 / 17:45 / 20:15. Banner under the H2, Karla 14px cream/70: 'Cheap [DISCOUNT_DAY]: every screening before 17:00 is $7 at the door.' Footnote Courier Prime 12px cream/50: 'Sample week — times follow a weekday pattern, not a live calendar.'
   Layout: Films as rows with hairline dividers; each row grid-cols-[280px_1fr] on desktop and stacked on mobile; pills wrap.
   Motion: Day switch cross-fades the rows (200ms); the active chip fills ticket.
6. **Membership** — H2 'Membership'. Three tiers on velvet panels with dim borders: Matinee Member $9 / month — 'One ticket a month · Cheap [DISCOUNT_DAY] included · No booking fees.'; Double Feature $17 / month, tagged 'MOST CHOSEN' in Courier Prime 11px bulb — 'Two tickets a month · One guest pass a season · Free popcorn refills.'; Season Pass $149 / year — 'Unlimited standard shows · Four preview invitations · Your name on the lobby wall.' Note under the grid, Karla 13px cream/60: 'Memberships shown for information — this demo has no signup flow.'
   Layout: grid md:grid-cols-3 gap-6; the middle card sits 4px higher; prices in Bungee 32px cream.
   Motion: Cards fade up staggered; nothing else moves.
7. **Visit and footer** — Visit block 'Find the house': address '14 Marquee Lane, [CITY]' plus 'Night bus 12 stops at the fountain; two minutes on foot.'; hours table Courier Prime 13px cream/80: Mon–Thu 15:00–23:00, Fri 13:00–24:00, Sat–Sun 10:30–24:00, note 'Doors open 30 minutes before the first show.'; house notes Karla 14px cream/70: 'Screen One seats 96; screens Two and Three seat 48. The concession takes cards only.' Footer: wordmark, nav repeat, small print Courier Prime 12px cream/50: 'Films, showtimes and seats shown are invented sample content.' plus [CREDIT].
   Layout: grid md:grid-cols-3 gap-10; footer py-10 with a line hairline top.
   Motion: Fade up only; the grain overlay continues over the footer.

### [BRAND] — film and seats (`film.html`)
1. **Film header** — Back link '← All films' to ./index.html#now-showing (Karla 500 cream/70). Two columns: left, the film's poster SVG exactly as drawn in the grid, w-full max-w-[380px] rounded-md with a line border; right, title in Bungee clamp(36px, 5vw, 64px) cream, meta line Courier Prime 13px cream/70 'GENRE · RUNTIME MIN · RATING', then a two-paragraph program note in Karla 15px cream/85. Program notes for all six films live in content.ts — Midnight Orchard: 'A keeper walks the orchard rows after the last bus leaves. Something has been taking the fruit in the dark, one precise circle at a time.' / 'Shot over nineteen nights in a single field, with a score for tape and bowed saw.' Signal to Solace: 'A lighthouse operator answers a signal that shouldn't exist, in a code she half remembers from childhood.' / 'Every beacon in the film was built and lit in camera.' The Fox of Fetter Lane: 'A fox with a market habit and a baker with a soft heart trade favors across one long street.' / 'Hand-inked at twelve frames a second; the smell of bread is almost visible.' Iron Lullaby: 'A night-shift driver takes one last fare and finds the city has quietly changed hands.' / 'Rain, neon and a brass score; the shadows do the talking.' Aunt Marigold's Aeroplane: 'A retired pilot and her great-niece rebuild a biplane from barn parts and borrowed afternoons.' / 'A comedy that lands softly; the loop-the-loop is real.' Backlot Honeymoon: 'Two rival studio publicists must stage a wedding neither wants, for a studio that no longer exists.' / 'Screwball pace, matinee heart; romance by way of the props department.' When ?film= is missing or unknown, show the first film (midnight-orchard) with day FRI and time 19:00 preselected — never an empty or not-found state.
   Layout: grid md:grid-cols-[380px_1fr] gap-10; py-16.
   Motion: Title and poster fade up 400ms.
2. **Screening picker and seat map** — Screening bar: day chips MON–SUN plus time pills for the selected film (the same sample pattern as index.html); the selection updates the map heading in Courier Prime 13px bulb: 'SCREEN ONE · FRI · 19:00' (built from the chosen day and time). Seat map, drawn: at top a shallow screen arc (a 70%-width bar with border-radius 50% 50% 0 0, cream/25 fill) labeled 'SCREEN' in Courier Prime 11px cream/60; below, eight rows A–H of twelve seats each — 34px squares rounded-[8px], a 28px aisle gap after seat 6 — with the row letter in Courier Prime 12px cream/50 on each side. States: available (1px cream/40 border, transparent fill), taken (cream/15 fill, disabled, cursor-not-allowed), selected (bulb fill, house text). Taken seats are a fixed sample pattern in content.ts, identical on every visit: rows D–F seats 4–9, plus singles A2, A3, B7, B8, C5, G10, H2. Legend row under the map shows the three states. Tally right-aligned in Courier Prime 14px cream: '3 SEATS · $33' with the total computed as seat count × [TICKET_PRICE]. Button 'Hold seats' (ticket fill): reveals an inline panel with a lucide check: 'Held on this device — this is a local demo. No booking was made and nothing was charged.' The hold saves under [BRAND_SLUG]-hold. Note under the map, Karla 13px cream/60: 'Row H end seats are step-free; ask an usher at the door.'
   Layout: Screening bar (chips and pills wrap) above the map; map centered max-w-[640px]; seats gap-1.5; tally and hold button right-aligned above the map.
   Motion: Hover lifts a seat 2px, press scales to 0.9; selection fills over 150ms; switching day or time resets the selection with a 200ms cross-fade.
3. **Film page footer** — Thin footer: back link '← All films' to ./index.html, wordmark [BRAND], small print Courier Prime 12px cream/50: 'Seat map is a local demo — no real booking.' plus [CREDIT].
   Layout: py-10, line hairline top, inner container max-w-[1160px].
   Motion: None beyond the page grain.

## Assets
- image: No photographs and no downloads. Every visual is drawn in code: the six film posters as inline SVG color-block compositions (exact geometry listed per film in the Now showing section), velvet curtain gradients, spotlight cones, bulb-dot marquee frame, ticker strip, auditorium seat map and screen arc. The only raster-like element is an inline SVG feTurbulence film-grain data-URI at 5% opacity.
- icon: lucide-react npm package (ISC): menu, x, ticket, clock, armchair, arrowLeft, check. No other icon sets, no brand logos.
- font: Fontsource packages (MIT): @fontsource/bungee 400; @fontsource/karla 400/500/700; @fontsource/courier-prime 400/700. Imported in main.tsx; no font CDN links.

## Don'ts
- No real cinemas, films, studios, distributors or film titles — every film, showtime and price is invented sample content.
- Posters are code-drawn abstractions: no photographs, no real film art, and no readable letters or numbers inside the poster SVGs; typography lives only in the HTML around them.
- Showtimes follow a fixed weekday pattern; no dates or times computed from the real clock and no JavaScript Date-based logic; the page labels times as samples.
- No booking backend or payment: the seat picker is a local demo that saves to localStorage only and says so in the hold panel and the footer.
- No photographs of people; no photographs at all — every visual is SVG or CSS.
- Self-host everything (Fontsource fonts, inline SVG art); no CDN script or link tags, no Google Fonts, no analytics.
- Vite base './' with relative paths; internal links point to real file names (./index.html, ./film.html), never bare directories; film.html without a valid ?film= shows the first film, never an error state.
- Production build minified, no source maps, dist/ under 20 MB.
- prefers-reduced-motion: bulbs static at a 70%-lit pattern, ticker paused into a wrapped static row, reveals instant; seat selection still works without transforms.
- Bulbs twinkle gently (opacity only, 2.6s, no strobing); film grain is static at 5% and never animates.
- No SEO scaffolding beyond a plain <title> with [BRAND] and a favicon.
- No copied code, copy, lettering or artwork from any real cinema site, film poster or film material.

---
— Prompt by VibeFather · https://vibefather.ai/t/movie-theater-showtimes-website · CC BY-NC 4.0 (non-commercial; commercial use needs a VibeFather Pro license) · Request removal: https://vibefather.ai/takedown
