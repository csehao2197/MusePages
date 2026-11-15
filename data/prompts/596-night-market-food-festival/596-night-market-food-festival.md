# Night Market Food Festival

Build this website exactly as described below. Replace the [VARIABLES] with your own values; keep everything else.

## Brief
Build a one-page site for [BRAND], an invented night market food festival held at [VENUE] in [CITY], open [HOURS]. The identity is neon night: deep indigo ground, lantern amber as the working accent, restrained neon pink highlights, cream type, and one consistent dusk grade across the photography, with CSS glow used only on accent words and active states. The hero anchors on a lantern-lit stall photograph; below it sit a code-drawn filterable vendor map with eighteen stalls across eight cuisines and two stages, a weekday-pattern schedule for both stages, a tickets-and-tokens explainer with three pass tiers, a vendor application form that saves locally, and a festival FAQ.

- Audience: Hungry locals planning a night out in [CITY], families choosing a weekend, and food vendors applying for a stall — plus market organizers, food-truck rally crews, and cultural festival teams adapting the page.
- Goal: Get a visitor from craving to plan in one scroll: set the night's mood with the lantern hero, answer 'what's there and where' with the map and its cuisine filters, answer 'when' with the schedule pattern, price the night honestly with passes and tokens, and give cooks a real-feeling application that stays local.
- Tone: Warm night-out energy — a friend waving you down a lantern-lit lane. Short lines, honest demo notes in plain sight, glow used like lantern light, not like a nightclub.

## Stack
- Framework: Vite 6 + React 18 + TypeScript
- Styling: Tailwind CSS 3.4
- Libraries: react (MIT), react-dom (MIT), vite (MIT), typescript (Apache-2.0), tailwindcss (MIT), motion (MIT), lucide-react (ISC), @fontsource-variable/bricolage-grotesque (OFL-1.1), @fontsource/plus-jakarta-sans (OFL-1.1)
- Build: `npm run build` → static files in `dist/`. No backend, no server code, no external APIs.
- Setup:
  - Create a Vite 6 + React 18 + TypeScript project with base './', build.outDir 'dist', and build.sourcemap: false. No router, no backend, no server code.
  - Install Tailwind CSS 3.4 with PostCSS and Autoprefixer. Extend the theme with the exact palette below and fontFamily.display 'Bricolage Grotesque Variable' and fontFamily.body 'Plus Jakarta Sans'; enable tabular numerals for schedule times in CSS.
  - Self-host Bricolage Grotesque variable (or weights 700/800) and Plus Jakarta Sans 400/500/600/700 through @fontsource packages imported in src/main.tsx. Never load fonts from a CDN.
  - Use Motion from 'motion/react' (useReducedMotion, AnimatePresence) for pin filters, the info card, and section reveals; gate every animation on useReducedMotion().
  - Keep all copy and data in src/content.ts: festival strings, cuisines list, eighteen vendors (name, cuisine, signature dish, token price, stall number), schedule blocks for both stages, ticket tiers, token rules, FAQ, application-form labels. When variable values change, rewrite the dependent copy there and derive the application storage key from [BRAND_SLUG].
  - Draw the market map in code as src/components/MarketMap.tsx: a 900x520 viewBox SVG with a rounded irregular yard outline, lane paths in hairline indigo, two labeled stage blocks (Lantern Stage top-left, Backyard Stage bottom-right), twenty stall rectangles laid out along three lanes, and one numbered circular pin per vendor plus two utility stalls (tokens booth, first aid). Pins render from the vendor records; no map image file.
  - Implement cuisine filtering as chip state: matching pins keep full opacity with an amber glow ring, non-matching pins drop to 25% opacity with no glow, stage blocks and lanes stay constant; clicking a pin opens the vendor card next to the map on desktop and as a bottom sheet on mobile.
  - Implement the glow as CSS text-shadow (amber, two soft stops) on accent words and box-shadow on active chips only — restrained, never animated by default.
  - Persist the vendor application to localStorage under the key [BRAND_SLUG] + '-vendor-application'; validate restored JSON and recover silently; never submit anywhere.
  - Download the six generated photos to the exact public paths listed in Assets before building. Create ASSETS.md at the project root listing every file's path, source URL, author or generator, and license.
  - Use only these lucide-react icons: MapPin, Ticket, Coins, Clock, Music2, ChevronDown, Check, X, ArrowRight, UtensilsCrossed, Sparkles.
  - A plain <title> of '[BRAND] — [CITY]' and a favicon (an indigo rounded square with a glowing amber lantern dot) are enough; no meta descriptions, Open Graph tags, JSON-LD, or sitemaps.

## Variables
- [BRAND] — Festival name (default: "Lantern Row Night Market"). Invented market name; the logomark wordmark, hero copy, footer and storage key derive from it.
- [CITY] — City (default: "Ashport"). The city the market lives in; appears in the hero chip, schedule note, FAQ and footer.
- [VENUE] — Venue (default: "the Old Cannery Yard"). The market's physical home in plain words; appears in the hero chip, map intro and footer.
- [HOURS] — Hours pattern (default: "Fridays & Saturdays, 5 PM till late"). A weekday-pattern hours phrase — never a real calendar date or year.
- [CREDIT] — keep a small "Template by VibeFather" link to https://vibefather.ai/t/night-market-food-festival in the footer (default: yes; delete this line to remove it)

The copy under Pages & Sections is written for the default values. If your values differ, rewrite every headline, paragraph, label and image for them — same length, tone and structure. Layout, colors, type and motion stay as described.
Keep all copy, image paths and links in one content file (for example `src/content.ts`), keyed by section, so the content can be swapped later without touching components.

## Design
### Colors
- Indigo night `#131233` — Page ground
- Raised indigo `#1B1A42` — Cards, panels, the map plate, form fields
- Lantern amber `#FFB25E` — Working accent: CTAs, active chips, glowing pins, accent words
- Neon pink `#FF5FA2` — Highlight accent: badges, links, one glow word, stage markers
- Warm cream `#FFF4E2` — Primary text on indigo
- Soft lilac `#AFA9D8` — Secondary text, metadata, inactive chips
- Hairline indigo `#2E2C5E` — Dividers, card borders, lane lines

### Typography
- Display: headline, section titles, tier names: Bricolage Grotesque Variable (OFL), weights 700/800
- Body: paragraphs, chips, schedule, forms: Plus Jakarta Sans (OFL), weights 400/500/600/700

### Layout & motion
- Spacing: 8px base grid. Shell max-width 1120px with 32px desktop and 20px mobile side padding. Header 72px. Sections 96px vertical padding on desktop, 64px on mobile. Map chips wrap at 12px gaps; schedule rows 16px vertical padding; prose max 62 characters per line.
- Radius: 16px on cards, panels, photos and the map plate; 999px pills for chips, buttons and badges; 12px on inputs and the info card's inner elements.
- Motion: Cuisine filter changes crossfade pin states over 240ms: matches gain an amber glow ring and scale 1.05 once, non-matches fade to 25% opacity; stages and lanes never move.
- Motion: The vendor info card slides in beside the map over 240ms on desktop and rises as a bottom sheet over 280ms on mobile; it closes with an X.
- Motion: Schedule rows reveal in a 60ms stagger; hovering a row slides a 2px amber underline under the time block.
- Motion: The hero scrims and headline rise 16px in an 80ms stagger on load; photos settle from scale 1.03 over 600ms.
- Motion: Sections reveal once on scroll with a 14px rise and a 420ms fade, staggered 60ms.
- Motion: Under prefers-reduced-motion every animation becomes an instant state change; pin filters and the info card stay fully functional.
- Imagery: Six photographs from one market shoot after dusk: deep indigo sky, strings of warm amber paper lanterns, out-of-focus neon glows, steam drifting through lantern light, 35mm lens, gentle film grain, one consistent dusk grade with rich shadows and warm highlights. People appear only as distant backs or silhouettes — no identifiable faces — and no shot contains readable signage, text, or logos.

## Pages & Sections
### [BRAND] — night market in [CITY] (`index.html`)
1. **Header and hero** — Header (72px, raised indigo at 85% with backdrop blur, hairline bottom border): a code-drawn logomark — a small rounded-rectangle lantern with an inner amber glow dot — beside [BRAND] in Bricolage Grotesque 800; nav anchors Map, Schedule, Tickets, Vendors; right-aligned amber pill 'Get tickets'. Hero: full-bleed lantern-lit stall photograph cropped 16:9 from the top, an indigo-to-transparent gradient scrim from the left; a glass chip row — 'Every [HOURS]' with a Clock icon, '[VENUE], [CITY]' with a MapPin; H1 'Follow the lanterns.' with the word 'lanterns' carrying the restrained amber CSS glow; sub line 'Eighteen food stalls, two stages, and one long lane strung with light — [CITY]'s night market for people who eat late.'; buttons: amber solid 'Get night passes' and cream-outline 'Browse the vendor map'. A stat chip row under the buttons: '18 food stalls', '8 cuisines', '2 stages'. A thin decorative string of code-drawn lantern dots hangs across the hero's top edge.
   Layout: Copy sits in the left 7 columns of a 12-column grid over the photo, vertically centered below the header; stat chips wrap at 12px gaps; buttons 48px tall. Mobile: photo fills the viewport height minus the header, copy stacks with buttons full-width, and every tap target is at least 44px.
   Motion: The headline, chip row and buttons rise 16px in an 80ms stagger; the photo settles from scale 1.03 over 600ms; the lantern string sways ±2 degrees on a 6s ease loop, static under reduced motion.
2. **Vendor map** — Eyebrow 'THE LANE' in pink; title 'Find your flavor.'; intro 'Eighteen stalls around the yard at [VENUE] — filter by what you're craving, tap a pin for the dish.' Filter chips: All, Taiwanese, Korean, Japanese, Vietnamese, Mexican, Turkish, Sweets, Vegan. The code-drawn map: a stylized top-down yard with the Lantern Stage top-left and Backyard Stage bottom-right, three lanes of stalls, a tokens booth and first aid marked plainly. The eighteen vendors with stall numbers, signature dishes and token prices: Ah-Ma's Table — Taiwanese — pork belly bao — 2 tokens (B2); Golden Cricket — Taiwanese — popcorn chicken — 1 (B5); Two Suns BBQ — Korean — short-rib skewers — 3 (B8); Haemill Kitchen — Korean — gochujang tteok — 2 (B11); Ember Lane — Japanese — yakitori thigh — 2 (A3); Shaved Moon — Japanese — matcha shaved ice — 1 (A7); Lemongrass Cart — Vietnamese — bún bowls — 2 (A10); Noodle & Nest — Vietnamese — pho cups — 2 (A14); Comal Rojo — Mexican — blue-corn quesadillas — 2 (C4); Siete Salsas — Mexican — tacos al pastor — 2 (C8); Copper Kebab — Turkish — adana wraps — 3 (C12); Pide Post — Turkish — flatbread boats — 2 (C15); Sugar Lantern — Sweets — hot cinnamon donuts — 1 (A1); Mochi Monthly — Sweets — toasted mochi — 1 (A18); Green Griddle — Vegan — mushroom anticuchos — 2 (B14); Tofu Tower — Vegan — loaded mapo fries — 2 (B17); Nightcap Noodles — Taiwanese — midnight sesame noodles — 2 (B20); Canela Churros — Sweets — churros con cajeta — 1 (C18). Tapping a pin opens the vendor card: name, cuisine chip, 'Signature: {dish}', '{n} tokens', stall number, and a pink link 'See the map legend'.
   Layout: Chips row above the map, wrapping; the map SVG fills the shell at a 900x520 aspect, its plate on raised indigo at 16px radius; the vendor card sits in a 320px column beside the map on desktop and as a bottom sheet on mobile. Non-matching pins dim to 25% opacity; stage blocks stay full. A small legend bottom-right maps pin colors: amber for active vendors, pink for stages, lilac for utilities.
   Motion: Filter changes crossfade pin states over 240ms with a one-time 1.05 scale on matches; the vendor card slides in 240ms (desktop) or rises 280ms (mobile); pins hover-grow 1.1 with an amber glow ring.
3. **Stage schedule** — Eyebrow 'TWO STAGES'; title 'The weekend, hour by hour.' Two stage cards side by side. Lantern Stage (Music2 icon): 'Fri 17:30 — Lantern lighting & welcome pours'; 'Fri 19:00 — Warm Static (house DJ)'; 'Fri 21:00 — [CITY] Brass Collective'; 'Sat 18:00 — Dumpling speed-eating contest'; 'Sat 20:00 — Neon karaoke hour'; 'Sat 22:30 — Late set: The Moonworms'. Backyard Stage: 'Fri 18:00 — Vinyl-only selector series'; 'Fri 20:30 — Student jazz combos'; 'Sat 17:30 — Kids' lantern parade'; 'Sat 19:00 — Folk trio: Harrow & Reed'; 'Sat 21:30 — DJ Cassetta'. Footnote: 'A typical weekend pattern, not a real calendar — this demo posts no dates.'
   Layout: Two equal cards on raised indigo (16px radius), each with a stage header row and time rows at 16px vertical padding split by hairline dividers; times in tabular numerals with the act name after an em dash. Below 800px the cards stack.
   Motion: Rows reveal in a 60ms stagger; hover slides a 2px amber underline under the time; no other movement.
4. **Market moments strip** — A four-photo strip between schedule and tickets: the lantern strings overhead, skewers smoking on a stall grill, the steaming noodle bowl, and the crowd lane seen from behind — each 4:3 at 16px radius, no captions beyond alt text, carrying the dusk grade across the page.
   Layout: 4 columns at 16px gap on desktop, a horizontal scroll-snap row on mobile with 78vw cards.
   Motion: Photos reveal with the standard rise; the mobile strip scrolls with snap points and no autoplay.
5. **Tickets and tokens** — Eyebrow 'AT THE GATE'; title 'Passes, tokens, no mystery.' Three tier cards: 'Night Pass — $12 — entry for one, all night.'; 'Feast Pass — $35 — entry plus 10 tokens (best value).'; 'Family Pack — $28 — two adults, two kids, 6 tokens.' Each with an amber 'Get the pass' demo anchor to '#tickets' plus the small-print line 'Demo — passes aren't sold here.' Token explainer strip beneath, three steps with Coins icons: 'One token = $2.50 at the booth.'; 'Dishes cost 1–3 tokens — each stall's price is on its pin.'; 'Leftover tokens keep for the next market — in this demo, at least.'
   Layout: 3 equal cards on raised indigo with the Feast Pass carrying a pink 'BEST VALUE' badge and sitting 8px higher; the explainer is a 3-column strip split by hairlines. Mobile: cards stack, explainer rows stack.
   Motion: Cards reveal in a 60ms stagger; the badge pops in after the reveal; hover lifts a card 4px with a soft amber edge glow (restrained).
6. **Vendor application** — Split section. Left: the dessert-stall photograph at 4:3. Right: a form card titled 'Cook with us.' with copy 'Stalls are 3×2 m, power on request, tokens-only sales. Tell us what you'd bring to the lane.' Fields: contact name, business name, cuisine select (the eight cuisines plus 'Other'), signature dish, email, weekday chips 'Fridays / Saturdays / Both', and a short message. Validate locally — name, dish and email required — and on submit swap to a success panel: Check icon, 'Application saved in your browser — a live market would reply by email; this demo keeps it local.', and a 'Start over' link. Side bullets under the photo: 'We look for dishes that survive a queue.'; 'One signature dish beats a long menu.'; 'Tokens settle weekly — demo terms.'
   Layout: 5/7 split: photo column left, form card right on raised indigo (16px radius, 12px inputs). Errors render inline in pink under fields, never alerts; the success panel is aria-live='polite'. Mobile: photo first at 4:3, then the form; chips wrap at 44px targets.
   Motion: Chips pop to 1.06 on selection (180ms); the success panel crossfades in 240ms; nothing else moves.
7. **FAQ and footer** — FAQ 'Before you come.' as five details/summary items: 'Is it really outside?' — 'Yes — the whole lane is open air under awnings; the market runs rain or shine, and the lanes drain fast.'; 'How do tokens work?' — 'Buy at the booth or with a Feast Pass — $2.50 each, dishes cost 1–3. Leftovers keep for next time in this demo's story.'; 'Can I bring the kids?' — 'Please do — the Family Pack covers two little eaters, and the lantern parade is theirs on Saturdays.'; 'Pets?' — 'Leashed dogs are welcome on the lane ends, not in the food rows — hot grills and curious noses don't mix.'; 'Allergens?' — 'Ask at each stall; vendors cook their own food and we don't track ingredients centrally, so come ask rather than assume.' Footer on indigo night with a hairline top rule: logomark and [BRAND], the line '[VENUE], [CITY] · [HOURS]', nav anchors (Map, Schedule, Tickets, Vendors), 'A fictional night market built as a website template.', '© [BRAND]' with no year, and the optional [CREDIT] link.
   Layout: FAQ single column max-width 760px with hairline dividers and a rotating ChevronDown; footer in two rows — brand block left, nav right — stacking on mobile.
   Motion: A 160ms chevron rotation on toggle with no height animation that could clip text; footer static.

## Assets
- image: Hero photograph. Download https://media.vibefather.ai/assets/c7bea4f5-3b6f-4c3d-8b07-8f9187be5d04/hero-market.webp to public/images/hero-market.webp. Alt: 'A lane of food stalls glowing under strings of paper lanterns at night.' Used full-bleed behind the hero. Generated by VibeFather with qwen-image-3.0-pro, redistributable with this template; record that exact credit in ASSETS.md.
- image: Lantern detail. Download https://media.vibefather.ai/assets/c7bea4f5-3b6f-4c3d-8b07-8f9187be5d04/lantern-string.webp to public/images/lantern-string.webp. Alt: 'Strings of warm amber paper lanterns crossing the market lane overhead.' First card in the market-moments strip. Generated by VibeFather with qwen-image-3.0-pro, redistributable with this template; record that exact credit in ASSETS.md.
- image: Stall grill. Download https://media.vibefather.ai/assets/c7bea4f5-3b6f-4c3d-8b07-8f9187be5d04/stall-grill.webp to public/images/stall-grill.webp. Alt: 'Skewers smoking on a market stall grill with a vendor's hands turning them.' Second card in the market-moments strip. Generated by VibeFather with qwen-image-3.0-pro, redistributable with this template; record that exact credit in ASSETS.md.
- image: Noodle bowl. Download https://media.vibefather.ai/assets/c7bea4f5-3b6f-4c3d-8b07-8f9187be5d04/noodle-bowl.webp to public/images/noodle-bowl.webp. Alt: 'A steaming bowl of noodles on a stall counter with lantern light behind.' Third card in the market-moments strip. Generated by VibeFather with qwen-image-3.0-pro, redistributable with this template; record that exact credit in ASSETS.md.
- image: Crowd lane. Download https://media.vibefather.ai/assets/c7bea4f5-3b6f-4c3d-8b07-8f9187be5d04/crowd-lane.webp to public/images/crowd-lane.webp. Alt: 'Visitors strolling away from the camera down a lantern-lit market lane.' Fourth card in the market-moments strip. Generated by VibeFather with qwen-image-3.0-pro, redistributable with this template; record that exact credit in ASSETS.md.
- image: Dessert stall. Download https://media.vibefather.ai/assets/c7bea4f5-3b6f-4c3d-8b07-8f9187be5d04/dessert-stall.webp to public/images/dessert-stall.webp. Alt: 'A dessert stall counter with stacked sweets under a warm lantern glow.' Used beside the vendor application form. Generated by VibeFather with qwen-image-3.0-pro, redistributable with this template; record that exact credit in ASSETS.md.
- image: Draw the entire vendor map in code as an SVG component (src/components/MarketMap.tsx): yard outline, lanes, stage blocks, stall rectangles and numbered pins — no map image, tiles, or external map service.
- icon: Install lucide-react (ISC) and use only MapPin, Ticket, Coins, Clock, Music2, ChevronDown, Check, X, ArrowRight, UtensilsCrossed, and Sparkles. Draw no brand logos; the lantern logomark is original code. Record the package and license in ASSETS.md.
- font: Self-host Bricolage Grotesque (variable or weights 700/800) through @fontsource-variable/bricolage-grotesque (OFL-1.1). Record the package and license in ASSETS.md; do not use a font CDN.
- font: Self-host Plus Jakarta Sans 400/500/600/700 through @fontsource/plus-jakarta-sans (OFL-1.1). Record the package and license in ASSETS.md; do not use a font CDN.

## Don'ts
- No real festivals, city events, vendor brands, bands or venues: the market, vendors, stages, acts and prices are invented, and the footer says so.
- Photographs contain no identifiable faces (distant backs and silhouettes only), no readable signage, text, letters or logos — every sign in frame stays an unreadable glow.
- The schedule is a weekday-pattern sample with HH:MM times only: never render real dates, years, countdowns, or anything computed from the visitor's clock, and no copyright year in the footer.
- Tickets and the vendor application are local demos and say so: no payment, no checkout, no form submission, no email services, no APIs, no analytics; persistence is localStorage only with validation on restore.
- Neon glow is restrained CSS (text-shadow on accent words, box-shadow on active states) — no glow animations, no glow on body text, no strobe or flashing effects.
- The vendor map is code-drawn SVG — no map tiles, no external map services, no screenshots of real maps.
- No backend, server code, databases, auth, or third-party scripts. Static output in dist/ from the single build command with relative paths.
- Self-host fonts through the listed Fontsource packages only; never load Google Fonts, Adobe Fonts, or any CDN stylesheet or script.
- No source maps in production, no src/ copied into dist/, keep dist/ under 20 MB, and keep Vite's base relative.
- No Unsplash, Pexels, Pixabay, Google Images, placeholder-image services, or hotlinked files; use only the six generated photos.
- Every internal link is an in-page anchor or file name, never a bare directory; the single page must render at 1440×900 and 390×844 with zero console errors.
- Keep cuisine filters, pins and the vendor card fully keyboard-operable: chips are buttons with aria-pressed, pins are focusable, and the info card closes with Escape.
- Respect prefers-reduced-motion: pin fades, card slides and reveals become instant; the lantern string sway stops; every interaction stays functional.
- Keep all copy in US English and derive the application storage key from [BRAND] and [BRAND_SLUG] so alternate variable values never leave default-brand remnants.
- No SEO work: no meta descriptions, Open Graph tags, JSON-LD, sitemaps, or keyword-stuffed headings. A plain title with [BRAND] and a favicon are enough.

---
— Prompt by VibeFather · https://vibefather.ai/t/night-market-food-festival · CC BY-NC 4.0 (non-commercial; commercial use needs a VibeFather Pro license) · Request removal: https://vibefather.ai/takedown
