# Aquarium Exhibits and Tickets Website

Build this website exactly as described below. Replace the [VARIABLES] with your own values; keep everything else.

## Brief
A one-page site for an invented city aquarium: five color-coded zones with a drawn floor map, four animal residents in portrait cards, a weekly feeding-and-talks schedule, a timed-entry picker that saves locally, and three quiet membership tiers, all on deep midnight-blue water lit by slowly drifting CSS caustics.

- Audience: Families and school groups planning a half-day visit, members returning for the feedings, and tourists picking a time slot before they travel.
- Goal: Move the visitor from wonder to a chosen time slot: browse the zones and animals, check the feeding schedule, save a timed-entry pick, and consider membership.
- Tone: Hushed and precise, like a night dive with a good guide: short sentences, concrete animals and depths, no nature-documentary grandstanding.

## Stack
- Framework: Vite 5 + React 18 + TypeScript
- Styling: Tailwind CSS 3.4
- Libraries: motion (MIT), lucide-react (ISC), @fontsource/outfit (MIT), @fontsource/inter (MIT), @fontsource/ibm-plex-mono (MIT)
- Build: `npm run build` → static files in `dist/`. No backend, no server code, no external APIs.
- Setup:
  - vite.config.ts: base './', build.sourcemap false, nothing from src/ copied into dist/.
  - tailwind.config.js: extend colors abyss #041220, deep #0B2740, line #16405E, foam #E8F4F8, mist #9DB9C9, glow #5FE9D6, reef #FF9A62, kelp #A8D46F, twilight #7C8CFF, shore #F2C14E; fontFamily display 'Outfit', body 'Inter', mono 'IBM Plex Mono'.
  - All copy, zones, residents, schedule, ticket and membership data live in src/content.ts as typed objects; components never hard-code copy and rebuild cleanly if the values are swapped.
  - Caustics: src/components/Caustics.tsx renders two absolutely-positioned full-size layers (an inline SVG feTurbulence blob pattern and a repeating radial-gradient mesh), mix-blend-mode screen, opacity 0.16, drifting via CSS keyframes in src/index.css (drift-a 90s, drift-b 70s reverse; translate ±4% and rotate ±2deg loops). One instance overlays the hero, a second overlays the Visit image band at opacity 0.10.
  - The ticket picker persists to localStorage under the key [BRAND_SLUG]-visit, where [BRAND_SLUG] is [BRAND] lowercased with hyphens.

## Variables
- [BRAND] — Aquarium name (default: "Lumen Bay Aquarium"). Wordmark, hero, footer and the localStorage key via [BRAND_SLUG].
- [CITY] — City / harbor (default: "Port Meridian"). Used in the hero eyebrow, address and directions copy.
- [HERO_ANIMAL] — Hero resident (default: "Aurelia, the moon jelly"). The celebrity in the hero headline; the hero portrait shows it.
- [TICKET_PRICE] — Adult ticket (default: "$24"). Adult timed-entry price used by the picker and total line.
- [CREDIT] — keep a small "Template by VibeFather" link to https://vibefather.ai/t/aquarium-exhibits-and-tickets-website in the footer (default: yes; delete this line to remove it)

The copy under Pages & Sections is written for the default values. If your values differ, rewrite every headline, paragraph, label and image for them — same length, tone and structure. Layout, colors, type and motion stay as described.
Keep all copy, image paths and links in one content file (for example `src/content.ts`), keyed by section, so the content can be swapped later without touching components.

## Design
### Colors
- abyss `#041220` — Page ground, midnight navy water
- deep `#0B2740` — Cards, picker panel, caption plates
- line `#16405E` — Hairlines, card borders, header rule
- foam `#E8F4F8` — Primary text and headlines
- mist `#9DB9C9` — Muted text, captions, footnotes
- glow `#5FE9D6` — Bioluminescent cyan accent: links, chips, slot states, focus rings
- zone hues `#FF9A62 #5FE9D6 #A8D46F #7C8CFF #F2C14E` — Zone markers only: reef / gardens / kelp / twilight / shore, used as 3px card borders, dots and 8-22% map fills

### Typography
- Display / headlines: Outfit (OFL), weights 300/600
- Body: Inter (OFL), weights 400/500
- Mono / times, depths, chips, captions: IBM Plex Mono (OFL), weights 400/500

### Layout & motion
- Spacing: Section padding py-24 desktop / py-16 mobile; container max-w-[1160px] px-6; cards p-6 to p-8; hero min-h-[92vh]; vertical rhythm in multiples of 8px.
- Radius: Cards and the portrait frame rounded-2xl (16px); day chips and slot buttons rounded-full; stepper inputs rounded-[10px].
- Motion: Caustic layers drift continuously and very slowly (90s and 70s loops, opposite directions, translate ±4%, rotate ±2deg); they never pulse, strobe or exceed opacity 0.16.
- Motion: The hero portrait floats ±6px on a 9s ease-in-out loop beneath its caustic layer.
- Motion: Scroll reveals: sections fade up 24px over 500ms with a 60ms stagger between siblings (Motion whileInView, once).
- Motion: Day-filter and slot clicks cross-fade lists in 200ms; all buttons press to scale 0.96.
- Motion: prefers-reduced-motion: caustics and float stop on a static gradient, reveals appear instantly, click states remain.
- Imagery: Underwater photography from inside dark tanks: one subject per frame lit by a single spotlight from above, deep navy water, faint cyan rim light, drifting particles, animals treated like portraits. No people, no divers, no hands, no readable signage, no logos. Six generated images (see assets); no stock photos.

## Pages & Sections
### [BRAND] — [CITY] aquarium (`index.html`)
1. **Site header** — Sticky header, 72px, background rgba(4,18,32,0.72) with backdrop-blur and a bottom hairline in line. Left: wordmark [BRAND] in Outfit 600, 18px, tracking-wide, foam. Center nav: Exhibits, Animals, Schedule, Tickets, Membership — Inter 500 14px, mist, hover foam with a 2px glow underline. Right: pill CTA 'Timed tickets' (glow text, deep fill, 1px glow border) → #tickets. Mobile: nav collapses behind a lucide menu button that opens a full-width drawer with the same links stacked.
   Layout: Inner container max-w-[1160px]; header sits over the hero and is transparent until scrolled.
   Motion: After 80px of scroll the header gains its tint and hairline (300ms); the drawer slides down 250ms.
2. **Hero — under the spotlight** — Two-column hero. Left: eyebrow in mono 12px glow, uppercase: 'CITY AQUARIUM · [CITY] HARBOR'; H1 in Outfit 300 at clamp(48px, 7vw, 84px), foam: 'Meet [HERO_ANIMAL].' with the animal's name in glow; paragraph, mist, max-w-[46ch]: 'Forty-one tanks across five zones, lit like a night dive. Pick a time slot, walk slow, and stay until the jellies turn with the current.' CTAs: primary pill 'Choose a time' → #tickets (glow fill, abyss text), ghost pill 'Today's feedings' → #schedule. Right: hero portrait public/images/hero-moon-jelly.webp (3:4) in a rounded-2xl frame with a 1px line border, alt 'A moon jellyfish drifting through a spotlight beam in dark blue water'; caption plate absolute bottom-left inside the frame, mono 11px foam on deep/85: 'ZONE 2 · DRIFTING GARDENS'.
   Layout: lg:grid-cols-[55%_45%], items-center, min-h-[92vh], px-6; portrait height clamp(420px, 70vh, 640px), object-cover; on mobile the portrait sits below the text at a 4:5 crop.
   Motion: Headline lines fade up 500ms staggered 90ms; the portrait scales from 1.04 to 1 and settles; the Caustics component overlays the whole hero at 0.16; the portrait floats ±6px on a 9s loop (paused under reduced motion).
3. **Zones — five zones, one slow crossing** — Intro line in mist: 'Every visit is one loop: shallow light to twilight and back.' Left rail: an SVG floor map — a rounded-outline floorplan with five numbered blocks (1 Shallow Reef top-left, 2 Drifting Gardens top-right, 3 Kelp Cathedral mid, 4 Twilight Depths bottom-left, 5 Shore Pools bottom-right, entrance arrow at the bottom), stroke line, fills at 8% of each zone hue, mono numerals; clicking a block smooth-scrolls to its card. Right: five stacked zone cards, each with a 3px top border in its zone hue, zone number in mono glow, name in Outfit 600 24px foam, depth tag mono 12px mist, one-liner Inter 14px mist: 1 · Shallow Reef — 2 m — reef — 'Coral heads, damselfish, and the first warm light.' 2 · Drifting Gardens — 4 m — glow — 'Moon jellies in a slow turning current.' 3 · Kelp Cathedral — 6 m — kelp — 'Forty-foot stalks that sway on a ten-second beat.' 4 · Twilight Depths — 9 m — twilight — 'Sharks, groupers, and the last blue of the light.' 5 · Shore Pools — 0 m — shore — 'Tidepools you can lean over; sleeves roll up.'
   Layout: lg:grid-cols-[320px_1fr] gap-10; map sticky top-28; cards p-6 on deep with 1px line borders, 16px gaps.
   Motion: Each card fades up on scroll (500ms); when a card crosses mid-viewport its map block fills to 22% of its hue for 400ms.
4. **Residents — the residents** — Four spotlight cards. Card anatomy: image (h-56 object-cover rounded-xl), name in Outfit 600 22px foam, species line mono 12px mist, fact 14px mist, and a 'meet-at' pill with a 1px zone-hue border and mono 12px text. Data from content.ts: Old Halimeda — green sea turtle — 'Arrived in a transport-tank mishap; now patrols the kelp each morning at a turtle's pace.' — chip 'FEEDS 10:00 · ZONE 3' (kelp) — public/images/turtle-portrait.webp, alt 'A green sea turtle gliding through a spotlight beam'. Octavia — giant Pacific octopus — 'Opens jar lids in under a minute and remembers which keeper hides the crab.' — chip 'ENRICHMENT 14:30 · ZONE 4' (twilight) — public/images/octopus-rock.webp, alt 'A red-brown octopus draped over dark rock, one arm raised'. The Cobalt Pair — lined seahorses — 'Trade anchoring spots each dawn like two neighbors trading chairs.' — chip 'LIVE FEED 11:15 · ZONE 2' (glow) — public/images/seahorse-pair.webp, alt 'Two lined seahorses curled around one kelp frond'. Ember — lionfish — 'Fans her banded spines when the lights dim; eats only what she hunts.' — chip 'KEEPER TALK 15:00 · ZONE 1' (reef) — public/images/lionfish.webp, alt 'A lionfish hovering above reef rock with spines fanned wide'.
   Layout: grid md:grid-cols-2 gap-6; cards p-6 on deep with 1px line borders, rounded-2xl.
   Motion: Cards fade up staggered 80ms; chip borders brighten on hover; the images themselves are static.
5. **Schedule — feedings and talks** — Day filter: seven pill chips MON–SUN in mono 12px (SAT active by default). Below, the active day's list from content.ts — weekday pattern (Mon–Fri): 10:00 Turtle breakfast · Zone 3; 11:15 Seahorse live feed · Zone 2; 14:30 Octopus enrichment · Zone 4; 15:00 Lionfish keeper talk · Zone 1. Weekend pattern (Sat–Sun) adds 16:00 Twilight walk · Zone 4 and 17:30 Jelly turn · Zone 2. Row anatomy: time mono 14px glow, title Inter 500 foam, zone tag (a 6px dot in the zone hue plus mono 12px mist). Footnote 12px mist: 'Sample week — a planning pattern, not a live calendar.'
   Layout: Chips row wraps; the list is a single column max-w-3xl with hairline dividers in line.
   Motion: Switching days cross-fades the list (200ms); the active chip fills glow/10 with glow text.
6. **Timed entry — ticket picker** — Two columns. Left copy: H2 Outfit 300 'Timed entry, calm water'; paragraph mist: 'We admit a small crowd every ninety minutes. Pick a day and a slot below — the pick saves on this device. It is a sample planner: nothing is charged and nothing is reserved.' Steppers: Adult [TICKET_PRICE], Youth $12, Senior $16 — minus/plus buttons with mono counts. Right picker card on deep with a 1px line border: 'DAY' row of MON–SUN chips; 'SLOT' row with four slot buttons — 09:30 AVAILABLE (glow border), 11:00 FEW LEFT (shore border, 'FEW LEFT' sub-label), 13:30 disabled ('SOLD OUT', mist/40), 15:15 AVAILABLE; total line mono 'TOTAL $48' (with defaults: two adults); primary button 'Save my visit' (glow fill, abyss text). After saving, an inline panel slides in with a lucide check: 'Saved to this device. Sample picker — no payment taken, nothing reserved. See you at the wharf.' State persists under [BRAND_SLUG]-visit and rehydrates on load.
   Layout: lg:grid-cols-2 gap-10; picker card p-8 rounded-2xl; steppers in the left column; the confirmation panel replaces the button row.
   Motion: Slot and stepper presses scale to 0.96; the confirmation panel fades and grows 250ms.
7. **Membership — come back with the tide** — Line under the H2, mist: 'Quiet tiers; no badges, nothing on your lanyard.' Three cards with 1px line borders on transparent (no glow): Tidepool $60 / year — 'Unlimited timed entry · Member hour before opening on Mondays · 10% off the café.'; Reef Line $120 / year, tagged 'MOST CHOSEN' in mono 11px glow — 'Everything in Tidepool · Two guest passes a season · Reserved seats at weekend feedings.'; Deep Range $240 / year — 'Everything in Reef Line · Behind-the-scenes tour for four · Adopt-a-tank update card.'
   Layout: grid md:grid-cols-3 gap-6; the middle card sits 4px higher on a deep fill; prices in Outfit 300 40px foam.
   Motion: Cards fade up staggered 80ms; nothing else moves.
8. **Visit and footer** — Visit band: full-bleed 16:9 image public/images/kelp-cathedral.webp (h-[320px] object-cover with an abyss/40 overlay), alt 'Kelp stalks fading into dark water with shafts of light'. Below, three columns on deep: FIND US — '12 Anchorline Wharf, [CITY] Harbor' and 'Harbor tram 6 to Wharf stop, four minutes on foot.'; HOURS — mono 13px table: Mon 10:00–17:00, Tue–Thu 10:00–18:00, Fri 10:00–20:00, Sat–Sun 09:00–19:00, note 'Last timed slot 90 minutes before close.'; CAFÉ — 'Second-floor counter over the kelp: chowder, brown bread, no straws.' Footer: wordmark, nav repeat, small print 12px mist: 'Zones, residents and feeding times shown are invented sample content.' plus [CREDIT].
   Layout: Image band full-width; columns grid md:grid-cols-3 gap-10 p-10 on deep; footer py-10 with a line hairline top.
   Motion: The band fades in with a second Caustics instance at 0.10 over it; the columns fade up staggered.

## Assets
- image: Six generated underwater photographs, downloaded into public/images/ and used nowhere else: hero-moon-jelly.webp (3:4, hero portrait), turtle-portrait.webp (4:3), octopus-rock.webp (1:1), seahorse-pair.webp (1:1), lionfish.webp (1:1) — the four resident cards — and kelp-cathedral.webp (16:9, visit band). Each downloads from https://media.vibefather.ai/assets/da51006a-5ff5-4d15-9f70-b2d879c35658/<file>. Alt text for each is written in the section copy above. Credit in ASSETS.md: 'Generated by VibeFather with qwen-image-3.0-pro, redistributable with this template.'
- icon: lucide-react npm package (ISC): menu, x, ticket, clock, waves, fish, check, minus, plus, mapPin. No other icon sets, no brand logos anywhere.
- font: Fontsource packages (MIT): @fontsource/outfit weights 300 and 600; @fontsource/inter 400 and 500; @fontsource/ibm-plex-mono 400 and 500. Imported in main.tsx; no font CDN links anywhere.

## Don'ts
- No backend: no server code, API routes, databases, auth, or forms that submit anywhere. The ticket picker is a local sample that saves to localStorage only, and its confirmation states plainly that no payment was taken and nothing is reserved.
- No real aquariums, zoos or conservation organizations: the venue, zones, animals, staff and address are invented; nothing may imply an official partnership or accreditation.
- Feeding times, opening hours and slot availability are sample weekday patterns and must stay labeled as samples ('Sample week — a planning pattern, not a live calendar'); no dates or times computed from the real clock, no JavaScript Date-based logic.
- Photographs show aquatic animals and tanks only: no identifiable people or faces, no divers, no hands, no readable signage, no logos in imagery.
- No ticketing, payment or membership checkout flow of any kind; membership cards are informational only.
- Self-host everything: fonts via Fontsource, images downloaded into the project, no CDN script or link tags, no Google Fonts, no analytics.
- Vite base './' with relative asset paths; internal links point to anchors on index.html or real file names, never to bare directories.
- Production build minified with no source maps; dist/ under 20 MB.
- prefers-reduced-motion: stop the caustic drift, the portrait float and scroll reveals (show content instantly); keep click states.
- Keep the light slow and low-contrast: no strobing, pulsing or large opacity swings; one cyan accent plus the five zone hues, used only as thin markers.
- No SEO work: a plain <title> with [BRAND] and a favicon are enough; no meta descriptions, Open Graph tags, JSON-LD or sitemaps.
- No copied code, copy, imagery or fonts from any reference site; no brand names in template names, slugs, copy or alt text.

---
— Prompt by VibeFather · https://vibefather.ai/t/aquarium-exhibits-and-tickets-website · CC BY-NC 4.0 (non-commercial; commercial use needs a VibeFather Pro license) · Request removal: https://vibefather.ai/takedown
