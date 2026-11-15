# Escape Room Website

Build this website exactly as described below. Replace the [VARIABLES] with your own values; keep everything else.

## Brief
A one-page site for [BRAND], an escape room venue in [CITY] with four invented rooms. The page sells mood first: a near-black textured ground, one amber glow, wide-tracked noir type, and room photography shot in deep shadow with a single practical light. Visitors browse rooms, hold an evening slot for their party, and read team-building packages. Everything runs in the browser.

- Audience: Groups of friends, after-work teams and corporate organizers in [CITY] looking for a 60-minute challenge and a way to lock in an evening without a phone tag.
- Goal: Get a visitor to pick a room, hold a slot with their party size (saved locally, honestly labeled), or call about a private team night.
- Tone: Film-noir confident: short declarative lines, a little dry humor, never campy. The rooms whisper; the amber glow does the shouting.

## Stack
- Framework: Vite 5 + React 18 + TypeScript
- Styling: Tailwind CSS 3.4
- Libraries: react + react-dom 18 (MIT), motion (motion.dev) 11 (MIT), lucide-react (ISC), @fontsource/bebas-neue, @fontsource/barlow, @fontsource/space-mono (OFL)
- Build: `npm run build` → static files in `dist/`. No backend, no server code, no external APIs.
- Setup:
  - Scaffold with npm create vite@latest using the react-ts template. One HTML page at the project root: index.html (entry src/main.tsx).
  - vite.config.ts: base './', plugins [react()], build { outDir 'dist', sourcemap false, assetsInlineLimit 0 }. Never copy src/ into dist/.
  - Tailwind 3.4 through PostCSS, content ['./index.html', './src/**/*.{ts,tsx}']. In tailwind.config.ts add the Design colors as theme.extend.colors (ink, char, smoke, bone, ash, amberGlow, amberDeep, rule), font families display/text/mono, and letter-spacing tokens (tracking-noir 0.16em, tracking-wide-caps 0.12em).
  - src/fonts.ts imports @fontsource/bebas-neue, @fontsource/barlow/400.css, 500.css, 600.css, and @fontsource/space-mono/400.css, 700.css. Import fonts.ts from src/main.tsx.
  - Global CSS in src/index.css: body background ink with a fixed fine-grain texture (an inline SVG feTurbulence data-URI at 3% opacity, pointer-events none, z-0), selection color amberGlow on ink, focus-visible outline 1px amberGlow.
  - src/content.ts holds every string and data structure: rooms (slug, name, locks 1-5, players, teaser, image, alt), dayChips, slots with the dark-hours rule, party range, packages, faqs, address, hours, phone, rate, brand. No copy lives anywhere else; the builder rewrites this file when the variables change.
  - src/lib/brand.ts: brandSlug = [BRAND] lowercase with non-alphanumerics collapsed to hyphens; localStorage key `${brandSlug}:hold` storing { room, day, slot, players } as JSON.
  - Components in src/components/: Header.tsx, Hero.tsx (contains DustCanvas), Reveal.tsx (Motion whileInView wrapper, fade + 24px rise, 480ms, 80ms stagger), RoomCard.tsx, Booking.tsx (DayChips, SlotGrid, Stepper, SummaryPanel), TeamBuilding.tsx, Faq.tsx, Footer.tsx.
  - DustCanvas: a 60-particle canvas over the hero photo, particles 1-2px amber at 3% opacity drifting slowly up-left via requestAnimationFrame; under prefers-reduced-motion it draws one static frame and stops.
  - public/favicon.svg: a 64px rounded square of #0B0A08 with a simple amber key silhouette (code-drawn). Download the six photos from Assets into public/images/ before building; write ASSETS.md at the project root.
  - dist/ holds index.html, hashed JS/CSS, the woff2 fonts, favicon.svg and six webp images. Keep it under 20 MB.

## Variables
- [BRAND] — Venue name (default: "Vault Nine"). Invented escape room brand. Wordmark, page title, brandSlug (localStorage keys) and every mention. Never a real venue or franchise.
- [CITY] — City (default: "Portland, Oregon"). Where the venue is. Appears in the hero eyebrow and the footer address. Real cities are fine.
- [SIGNATURE_ROOM] — Flagship room (default: "The Last Signal"). The headline room: first room card, default selection in the booking panel, and the room the hero copy leans on.
- [RATE] — Per-player rate (default: "$38"). Price string per player per room. Used on every room card, the booking total math (players × RATE) and the team-building intro.
- [CREDIT] — keep a small "Template by VibeFather" link to https://vibefather.ai/t/escape-room-website in the footer (default: yes; delete this line to remove it)

The copy under Pages & Sections is written for the default values. If your values differ, rewrite every headline, paragraph, label and image for them — same length, tone and structure. Layout, colors, type and motion stay as described.
Keep all copy, image paths and links in one content file (for example `src/content.ts`), keyed by section, so the content can be swapped later without touching components.

## Design
### Colors
- Ink `#0B0A08` — Page ground everywhere — the room with the lights off, carrying a 3% fine-grain noise texture.
- Char `#15120D` — Card wells, the booking summary panel, FAQ rows, the mobile menu overlay.
- Smoke `#1F1B15` — Hover surfaces, chip fills, stepper buttons.
- Bone `#EDE5D3` — Primary text: headlines, body, nav, buttons on dark.
- Ash `#9C9080` — Secondary text: eyebrows, teasers, captions, unselected slots.
- Amber Glow `#E2A13C` — The single accent: CTA fill, lock icons, prices, selected chips, glow pulse, focus ring.
- Amber Deep `#B87E23` — Amber hover and pressed state.
- Rule `#2B261E` — 1px hairlines: card borders, header bottom, FAQ dividers, stepper outlines.

### Typography
- Display — wordmark, H1, H2, room names, panel titles. Bebas Neue, always uppercase, letter-spacing 0.16em (0.12em on room cards), tight line-height 1.05: Bebas Neue (OFL), weights 400
- Text — body copy, teasers, nav, buttons (Barlow 600 caps at 0.12em tracking for labels): Barlow (OFL), weights 400/500/600
- Mono — slot times, prices, party count, phone number, the room index under the hero: Space Mono (OFL), weights 400/700

### Layout & motion
- Spacing: Sections separated by 112px on desktop, 72px on mobile; container 1200px with 32px side padding. Cards breathe: 32px internal padding, 32px grid gap. The hero is 92vh with copy vertically centered.
- Radius: Sharp, like the business: 2px on cards, panels and images; 999px only on day chips and slot pills; CTAs are 2px rectangles.
- Motion: Slow is the point: reveals fade and rise 24px over 480ms with 80-90ms stagger; nothing snaps.
- Motion: The amber accent breathes — CTA and wordmark underline run a 6s text-shadow/box-shadow pulse (opacity 1.0 to 1.15) that stops entirely under prefers-reduced-motion.
- Motion: Dust motes: 60 amber particles drift up-left across the hero at 3% opacity; reduced-motion draws one static frame.
- Motion: Hover: room photos brighten from 0.9 to 1.05 over 300ms; chips scale to 0.96 on press; the booking total crossfades 180ms when the party changes.
- Motion: Accordion: 220ms height ease with a 180deg ChevronDown rotation.
- Imagery: One noir shoot: every photograph is a room or prop in deep shadow lit by a single warm amber practical light, fine film grain, no people, no readable text, no logos. The hero shows the vault room wide; room cards show that room's key prop; the team section shows the briefing lounge. Never brighten beyond the grade.

## Pages & Sections
### [BRAND] — rooms, booking, team nights and FAQ on one dark page (`index.html`)
1. **Header** — Sticky header, transparent over the hero, then solid Ink with a 1px Rule bottom hairline once scrolled 24px. Left: wordmark [BRAND] in Bebas Neue 24px, 0.18em tracking, Bone, with a 2px Amber Glow underline under the final word that pulses slowly. Center nav (desktop): Rooms, Book, Teams, FAQ — Barlow 500, 12px uppercase, 0.12em tracking, Ash to Bone on a 150ms fade; each scrolls to its anchor. Right: phone (503) 555-0173 in Space Mono 13px with a Phone icon (16px, Ash), and a compact CTA 'Book a room' — Amber Glow fill, Ink text, Barlow 600 caps, 2px radius. Mobile: wordmark plus a burger (two 1px Bone lines) opening a full-screen Ink overlay with the four anchors stacked in Bebas Neue 32px and the phone number at the bottom.
   Layout: Single row, 1200px container, 20px vertical padding. Mobile overlay covers the viewport, content left-aligned and vertically centered.
   Motion: Header background crossfades to solid on scroll; the burger overlay fades and rises 12px in 200ms; links stagger 40ms.
2. **Hero** — Full-bleed hero-vault-room.webp at 92vh, object-cover, with a left-to-right Ink gradient (rgba(11,10,8,0.92) to transparent at 60%) over the photo and the global noise texture above both. Copy block, left-aligned and vertically centered: eyebrow 'ESCAPE ROOMS — [CITY]' in Barlow 600 caps 12px, 0.32em tracking, Ash. H1 is [BRAND] in Bebas Neue at clamp(64px, 10vw, 148px), 0.16em tracking, Bone, with a faint amber text-shadow (0 0 24px rgba(226,161,60,0.25)). Sub-line: 'Four rooms. Sixty minutes each. One way out — bring people you trust.' Barlow 400 18px, Ash, max-width 46ch. CTAs: 'Book a room' (Amber Glow solid) and 'See the rooms' (ghost, 1px Rule border, Bone text). Bottom-left, above the fold's edge: the four room names as a quiet index in Space Mono 11px separated by amber slashes — 'THE LAST SIGNAL / THE CLOCKMAKER'S DEBT / THE RED LEDGER / HALL OF SECOND THOUGHTS'.
   Layout: Copy in the left 55% of a 1200px container; photo fills the viewport width behind it. Mobile: photo as full background, copy bottom-aligned with 24px padding.
   Motion: On load, eyebrow, H1, sub and CTAs stagger in 80ms apart (fade + 24px rise, 500ms). The H1 letter-spacing settles from 0.28em to 0.16em over 900ms — subtle, once. DustCanvas runs over the photo; reduced-motion skips all of it and the tracking renders final.
3. **Rooms** — Eyebrow 'THE ROOMS' (Barlow 600 caps, 0.32em, Ash) and H2 'Pick your hour.' in Bebas Neue 44px. Four cards in a 2×2 grid (1 column on mobile). Each card: the room's prop photo at 4:3 (saturate 0.8, brightness 0.9; hover brightness 1.05), a 1px Rule border, Char background, 32px padding. Under the photo: room name in Bebas Neue 28px 0.12em; difficulty as five Lock icons (16px) with n filled Amber Glow and the rest Rule-colored, followed by the label like '4 of 5'; players '2–6 players' with a Users icon; a one-line teaser in Barlow 15px Ash; price '[RATE] per player' in Space Mono 15px Amber Glow. Exact room data: The Last Signal — 4 locks, 2–6 players, 'The radio tower answers one question before midnight.' The Clockmaker's Debt — 3 locks, 2–5 players, 'Wind the wrong spring and the workshop keeps you.' The Red Ledger — 2 locks, 2–4 players, 'A burnt-out detective left the case half-solved.' Hall of Second Thoughts — 5 locks, 4–8 players, 'The mirrors disagree about the exit.' Each card ends with a 'Choose this room' text link (Barlow 600 caps, amber, arrow) that scrolls to the booking panel and preselects that room.
   Layout: 2×2 grid, 32px gap, cards 1fr; the section sits on Ink with the noise texture.
   Motion: Cards reveal on scroll in pairs (fade + rise 24px, 480ms, 90ms stagger). 'Choose this room' scrolls smoothly and the booking panel's room select updates, flashing its border Amber Glow once.
4. **Booking** — Two columns, 7/5 on desktop, stacked on mobile, under H2 'Hold an evening.' Left column: seven day chips — MON TUE WED THU FRI SAT SUN — as 999px pills (Rule border, Space Mono 13px, Ash; selected: Amber Glow border and text on Char). These are a sample weekly pattern, never dates. Below, five slot buttons in Space Mono 15px: 17:00, 18:30, 20:00, 21:30, 23:00. Monday to Thursday, the 23:00 slot renders dimmed at 40% opacity with the caption 'dark hours — ask us'; Friday and Saturday keep all five. One slot is always selectable. Right column: summary panel on Char, 1px Rule border, 2px radius, 32px padding — a room select (the four rooms, default [SIGNATURE_ROOM]), a party stepper from 2 to 8 (Minus / count in Space Mono 20px / Plus), then summary lines 'Room', 'Evening' (day + slot), 'Players' and a total row showing the math: '4 × [RATE] = $152' with the total in Space Mono 24px Amber Glow. Button 'Hold this slot' (Amber Glow, full width). On press it saves { room, day, slot, players } to localStorage under `${brandSlug}:hold` and swaps the panel content to a confirmation state: a Check icon, 'Held on this device', and 'Nothing was paid or sent. Call (503) 555-0173 to confirm — we answer Wed–Sun from noon.' plus a 'Change hold' link that returns to the form pre-filled.
   Layout: 7/5 grid with 48px column gap; the summary panel is sticky on desktop at top 96px while day chips scroll.
   Motion: Chips and slots scale to 0.96 on press; selection crossfades 180ms; the total row crossfades when the party changes; the confirmation state fades and rises 12px in 240ms.
5. **Team building** — H2 'Nights that build teams.' with an intro line in Ash: 'Same rooms, private floor, and a leaderboard nobody forgets.' Left: lounge-team.webp at 4:3 in the noir grade, 1px Rule border. Right: three package rows separated by Rule hairlines — The Warm-Up, '$49 per player', 'one room, coffee after'; The Full Night, '$79 per player', 'two rooms, pizza between'; The Lockout, '$119 per player', 'private floor, three rooms, engraved trophy'. Names in Bebas Neue 24px, prices in Space Mono Amber Glow, descriptions in Barlow 15px Ash. Footnote line: 'Packages are sample tiers for this template — weekday blocks from 17:00, up to 32 players. Call (503) 555-0173 and ask for the night desk.'
   Layout: 5/7 image-to-list split, 48px gap; stacks on mobile with the image first.
   Motion: Image and rows reveal with the standard 480ms fade-rise; each row's price brightens from Ash to Amber Glow on row hover (200ms).
6. **FAQ** — H2 'Before you knock.' Four accordion rows on Char with Rule dividers. What if we get stuck? — 'Ask the radio. Hints are unlimited and the game master is paid to be mysterious, not cruel.' Is it scary? — 'Tense, never horror. Our darkest room still has a light switch — finding it is the puzzle.' Can two people play? — 'Yes. The Hall prefers three or more; the Ledger was built for pairs.' What should we bring? — 'Nothing but wits and closed shoes. Lockers, pencils and nerves provided.' Questions in Barlow 600 17px Bone; answers in Barlow 400 15px Ash, max 60ch.
   Layout: Single 760px column, left-aligned, 1px Rule dividers between rows.
   Motion: Row click opens with a 220ms height ease; ChevronDown rotates 180deg; only one row open at a time; the first row starts open.
7. **Footer** — Rule hairline, then a three-part footer on Ink: the wordmark repeated in Bebas Neue 20px; contact block — 'Sublevel 3, 44 Mercer Lane, [CITY]' with MapPin, 'Wed–Sun 16:00–23:30' with Clock, '(503) 555-0173' with Phone; and the four anchor links repeated in Barlow 12px caps. Bottom line in Ash 13px: 'Every room, price and package on this page is an invented example.' followed by the optional [CREDIT] link.
   Layout: Three columns on desktop (wordmark left, contact center, links right), stacked on mobile with 32px gaps.
   Motion: None — the footer is still.

## Assets
- image: Six noir photographs made for this template, redistributable with it. Download each into public/images/ with curl -L -o before building. https://media.vibefather.ai/assets/7212bd1d-e397-44e0-af1e-bba82a902104/hero-vault-room.webp -> public/images/hero-vault-room.webp (hero background; alt 'A brick vault room in near darkness, one hanging bulb over a table of brass cogs and an open blank ledger'); https://media.vibefather.ai/assets/7212bd1d-e397-44e0-af1e-bba82a902104/prop-radio.webp -> public/images/prop-radio.webp (The Last Signal card; alt 'A vintage valve radio in the dark, its unmarked dial glowing amber'); https://media.vibefather.ai/assets/7212bd1d-e397-44e0-af1e-bba82a902104/prop-clockwork.webp -> public/images/prop-clockwork.webp (The Clockmaker's Debt card; alt 'A workshop wall of brass gears lit by one amber lamp'); https://media.vibefather.ai/assets/7212bd1d-e397-44e0-af1e-bba82a902104/prop-desk.webp -> public/images/prop-desk.webp (The Red Ledger card; alt 'A brass lamp glowing over a rotary telephone and blank ledger pages'); https://media.vibefather.ai/assets/7212bd1d-e397-44e0-af1e-bba82a902104/prop-mirror.webp -> public/images/prop-mirror.webp (Hall of Second Thoughts card; alt 'An ornate mirror at the end of a dark corridor catching one amber light'); https://media.vibefather.ai/assets/7212bd1d-e397-44e0-af1e-bba82a902104/lounge-team.webp -> public/images/lounge-team.webp (team-building section; alt 'A briefing lounge of worn leather chairs around a low table, lit by one floor lamp'). In ASSETS.md credit each: 'Generated by VibeFather with qwen-image-3.0-pro, redistributable with this template.'
- icon: lucide-react only: Phone, Lock, Users, Clock, MapPin, ChevronDown, Check, Plus, Minus, ArrowRight. Stroke width 1.75, 16-24px, color inherits. The key favicon is code-drawn SVG, not an icon font. No other icon sets.
- font: @fontsource/bebas-neue (400), @fontsource/barlow (400, 500, 600), @fontsource/space-mono (400, 700), imported in src/fonts.ts so Vite bundles the woff2 files into dist/. Never load fonts from a CDN.

## Don'ts
- No backend, no APIs, no form submission: the booking hold saves to localStorage only, and the confirmation copy states plainly that nothing was paid or sent.
- No real escape room brands, franchises or room names; the four rooms, packages, leaderboard line and phone number are invented for this template.
- Photographs show rooms and props only — no actors' faces, no hands, no readable text, no logos; never add photos of people to the demo.
- No calendar dates and no live clock: day chips are the fixed MON–SUN sample pattern, slots are the five fixed sample times, and the site never shows today's date.
- Team-building tiers are invented sample pricing; name no real team-building companies.
- Self-host everything: fonts via Fontsource, icons via lucide-react, images downloaded into public/images/ — no CDN script or link tags, no analytics.
- Static build: minified, no source maps, no src/ copied into dist/, one command npm run build, output in dist/ under 20 MB.
- Internal links are anchors into ./index.html (#rooms, #book, #teams, #faq); never link to a bare directory.
- Respect prefers-reduced-motion: no glow pulse, no dust drift, no tracking settle — reveals become instant, the page stays fully readable.
- Works at 1440×900 desktop and 390×844 mobile with zero console errors; all interactive controls are keyboard reachable with a visible amber focus ring.
- No SEO machinery: a plain title with [BRAND] and the favicon are enough — no meta descriptions, Open Graph tags, JSON-LD or sitemaps.
- Never mention VibeFather or any real brand inside the site; all copy is invented US English and every string lives in src/content.ts.

---
— Prompt by VibeFather · https://vibefather.ai/t/escape-room-website · CC BY-NC 4.0 (non-commercial; commercial use needs a VibeFather Pro license) · Request removal: https://vibefather.ai/takedown
