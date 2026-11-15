# Indie Record Label Website

Build this website exactly as described below. Replace the [VARIABLES] with your own values; keep everything else.

## Brief
Build a three-page riso-poster site for [BRAND], an invented independent record label in [CITY] pressing [GENRE]. The identity is ink black on cream riso paper with exactly two spot colors — hot coral and deep violet — heavy Anton poster type printed with misregistration, and a generated paper-grain overlay. Every visual is drawn in code: an oversized spinning vinyl anchors the hero beside the wordmark, seeded generative two-color sleeves fill an eight-release catalog, a five-artist roster links to query-routed artist pages, a tour feed lists season-label sample rows, and a variant vinyl shop runs on a local cart drawer that admits it is a demo.

- Audience: [GENRE] listeners and vinyl collectors dropping by the label's page, plus the labels, tape and zine imprints, and music collectives adapting this layout for their own catalog.
- Goal: Make the label feel pressed and real inside one screen: win with the spinning vinyl and the misregistered wordmark, pull visitors into the catalog with sleeves that slide their records out on hover, hand them the tour feed and the shop in two more scrolls, and stay honest throughout — demo cart, sample dates, nothing for sale for real.
- Tone: Loud but crafted — a screen-printed gig poster that happens to be a website. Short confident lines, mono catalog numbers, zero hype words. Playful about the demo cart, never pretending money changes hands.

## Stack
- Framework: Vite 6 + React 18 + TypeScript
- Styling: Tailwind CSS 3.4
- Libraries: react (MIT), react-dom (MIT), vite (MIT), typescript (Apache-2.0), tailwindcss (MIT), motion (MIT), lucide-react (ISC), @fontsource/anton (OFL-1.1), @fontsource/space-grotesk (OFL-1.1), @fontsource/space-mono (OFL-1.1)
- Build: `npm run build` → static files in `dist/`. No backend, no server code, no external APIs.
- Setup:
  - Create a Vite 6 + React 18 + TypeScript project with base './', build.outDir 'dist', and build.sourcemap: false. No router, no backend, no server code.
  - Install Tailwind CSS 3.4 with PostCSS and Autoprefixer. Extend the theme with the exact palette below and fontFamily.display 'Anton', fontFamily.body 'Space Grotesk', fontFamily.mono 'Space Mono'.
  - Self-host Anton 400, Space Grotesk 400/500/700, and Space Mono 400/700 through @fontsource packages imported in src/main.tsx. Never load fonts from a CDN.
  - Use Motion from 'motion/react' (AnimatePresence, useReducedMotion) for scroll reveals and the cart drawer; gate every animation on useReducedMotion().
  - Keep all copy and data in src/content.ts: label strings, five artists (name, slug, one-liner, bio, stamp shape), eight releases (catalog number, title, artist, format, numeric seed), seven tour rows, six shop products, pressing notes. When variable values change, rewrite the dependent copy there and derive the cart key and slugs from [BRAND] and [BRAND_SLUG] so no default-brand remnants remain.
  - Write the generative cover engine in src/lib/cover.ts as a pure function coverArt(seed): a mulberry32 PRNG seeded per release draws a 400x400 SVG — cream paper ground, six to nine shapes chosen from circle, ring, half-disc, bar, quarter-arc, dot-grid and triangle, filled only coral, violet or ink with overlapping areas using mix-blend-mode multiply — plus the catalog number in Space Mono in one corner. Same seed, same cover, so two builds match.
  - Build src/components/Vinyl.tsx as an SVG record: ink disc, seven thin groove circles, a 12%-opacity paper sheen wedge, and a coral center label carrying a small violet geometry mark and the [BRAND] initial in Anton. It rotates with a 28s linear infinite CSS animation.
  - Add the riso grain as a fixed full-viewport overlay div (pointer-events none) using an inline SVG feTurbulence filter, baseFrequency 0.9, opacity 0.06, mix-blend-mode multiply — generated noise, never a scanned texture.
  - Implement misregistration as the utility class .riso-shift in src/index.css: display text carries coral and violet copies via text-shadow (-3px -2px 0 coral, 3px 2px 0 violet); on hover the offsets widen by 1px each over 200ms.
  - Implement the marquee ticker as one duplicated inline track on a 30s translateX loop in src/index.css; pause on hover; render static under prefers-reduced-motion.
  - Implement the cart as React state plus a right-side drawer: line items with mini generative sleeves, quantity plus/minus, remove, subtotal, the honest demo line, and persistence to localStorage under the key [BRAND_SLUG] + '-cart'; validate restored JSON and recover silently.
  - Route artist.html by reading ?artist= with URLSearchParams, matching artist slugs from content.ts, and always falling back to the first artist — never a not-found state. Every internal link is a file name like ./index.html or ./shop.html.
  - Use only these lucide-react icons: Disc3, ShoppingBag, Plus, Minus, X, ArrowRight, ArrowUpRight.
  - This template uses zero photographic or downloaded image files. Create ASSETS.md at the project root listing the Fontsource packages and lucide-react with their licenses.
  - A plain <title> of '[BRAND] — independent record label' and a favicon (a paper square with a coral circle) are enough; no meta descriptions, Open Graph tags, JSON-LD, or sitemaps.

## Variables
- [BRAND] — Label name (default: "Static Bloom Records"). Invented label name; the hero wordmark, logomark initials, vinyl label and cart key all derive from it.
- [GENRE] — Sound (default: "noise-pop, dubbed-out techno and tape loops"). One plain phrase for what the label presses; appears in the hero paragraph, ticker and footer.
- [CITY] — City (default: "Milhaven"). Where the label lives; appears in the hero eyebrow, roster copy, tour rows, pressing notes and footer.
- [PRESS_LINE] — Manifesto line (default: "Cut loud, pressed heavy, packaged by hand."). The label's one-line creed that closes the hero paragraph; rewrite it when the label changes.
- [CREDIT] — keep a small "Template by VibeFather" link to https://vibefather.ai/t/indie-record-label-website in the footer (default: yes; delete this line to remove it)

The copy under Pages & Sections is written for the default values. If your values differ, rewrite every headline, paragraph, label and image for them — same length, tone and structure. Layout, colors, type and motion stay as described.
Keep all copy, image paths and links in one content file (for example `src/content.ts`), keyed by section, so the content can be swapped later without touching components.

## Design
### Colors
- Riso ink `#17130E` — Ink black: dark bands, hero type, vinyl disc, footer
- Paper cream `#F3EDDE` — Riso paper: page ground and card stock
- Hot coral `#FF4B33` — Spot color one: CTAs, chips, vinyl label, tour Tickets state
- Deep violet `#5B2DB3` — Spot color two: links on ink, sleeve geometry, Sold out chips
- Faded ink `#CFC5AC` — Hairlines, dividers, secondary text on paper

### Typography
- Display: wordmark, titles, prices: Anton (OFL), weights 400
- Body: paragraphs, buttons, nav: Space Grotesk (OFL), weights 400/500/700
- Meta: catalog numbers, eyebrows, ticker, chips: Space Mono (OFL), weights 400/700

### Layout & motion
- Spacing: 8px base grid. Shell max-width 1200px with 40px desktop and 20px mobile side padding. Header 64px with a 2px ink bottom rule. Sections 96px vertical padding on desktop, 64px on mobile. Catalog grid gap 24px. Tour rows 20px vertical padding split by 1px dividers. Paragraphs max 56 characters per line.
- Radius: 0px everywhere — paper trimmed square: cards, buttons, chips, inputs and photos all take sharp corners. The only circles on the site are drawn art: the vinyl, artist stamps, dot grids and the logomark ring.
- Motion: The hero vinyl rotates once every 28s, linear, infinite; the animation pauses entirely under prefers-reduced-motion and the record stays fully readable.
- Motion: The ink ticker band scrolls one seamless loop every 30s; it pauses on hover and renders static under reduced motion.
- Motion: Release sleeves: hover rotates the sleeve 3deg and slides the vinyl 56px out from behind over 240ms ease-out; touch devices toggle the same state on tap; both reset on leave.
- Motion: Display headings sit on misregistered coral and violet copies; the offsets settle from 6px to 3px on load and widen by 1px each on hover over 200ms.
- Motion: Sections reveal once on scroll with a 16px rise and a 420ms fade, staggered 60ms per card or row; under reduced motion everything appears instantly.
- Motion: The cart drawer slides in from the right over 280ms with a 60% ink backdrop; the cart count badge pops to 1.15 scale for 160ms on every add.
- Imagery: Zero photographs — the entire site is drawn in code. Sleeves are seeded generative SVG (two-color geometry, multiply overlaps); the vinyl, artist stamps and logomark are hand-built SVG; riso paper grain is a generated feTurbulence overlay at 6% multiply across the whole page; misregistration is layered color copies on type, never a texture file. No scanned paper, no stock art, no photos of people.

## Pages & Sections
### [BRAND] — independent record label (`index.html`)
1. **Header, hero and ticker** — Header (64px, paper cream, 2px ink bottom rule): a code-drawn logomark — a 36px ink circle with the label's two initials knocked out in paper and a coral ring offset 2px behind it — beside the uppercase label name in Anton; nav anchors Catalog, Roster, Tour, Shop; on the right a ShoppingBag cart button with a coral count badge. This header and the cart drawer are global and repeat on every page: a 380px paper panel sliding from the right with line items (mini generative sleeve, title, variant, price), quantity plus/minus, remove X, subtotal, the line 'Demo cart — nothing is charged or shipped.', and a 'Keep browsing' close button; state persists in localStorage. Hero: Space Mono eyebrow 'SMALL LABEL · HEAVY VINYL · CAT. SR-001 → SR-024'; the H1 is the wordmark — [BRAND] in uppercase Anton at clamp(56px, 9vw, 132px), ink with coral and violet misregistered copies, wrapping to at most two lines; paragraph '[BRAND] is a small label in [CITY] pressing [GENRE]. [PRESS_LINE]'; buttons: solid ink 'Browse the catalog' and coral-outline 'Tour dates'. To the right, an oversized vinyl (min(520px, 44vw)) overlaps the wordmark's baseline and bleeds off the right margin, spinning slowly, its coral center label carrying a violet geometry mark and the label initial. Below the hero a full-width ink ticker band scrolls in uppercase Space Mono: 'SR-024 FLOOD ROOMS — OUT NOW · SR-018 REISSUE — FEW LEFT · [GENRE], ON HEAVY VINYL · '
   Layout: 12-column grid: copy in columns 1–6, vinyl absolutely positioned over columns 7–12 and cropped by the viewport edge. Buttons are square-edged, ink fill and coral outline, 48px tall. The header content shares the 1200px shell. Mobile: vinyl renders above the copy at 78vw centered, the wordmark caps at 64px, buttons stack full-width, and every tap target is at least 44px.
   Motion: The vinyl spins on the 28s loop; the wordmark's misregistration offsets settle from 6px to 3px over 700ms on load; the eyebrow, H1, paragraph and buttons rise 16px in a 60ms stagger; the ticker scrolls its 30s loop and pauses on hover.
2. **Catalog** — Space Mono eyebrow 'THE CATALOG'; title 'Fresh off the press.' in Anton; intro line 'Eight sleeves, two spot colors, no two covers alike — every cover is generated from the record's catalog number.' Eight release cards: SR-024 Mote — 'Flood Rooms' — 12″ LP; SR-023 Diorama Kid — 'Night Bus Hymns' — 12″ LP; SR-022 Cassia Vale — 'Dub Test 04' — 12″ single; SR-021 Cassia Vale — 'Echo Test 02' — 7″; SR-020 Grove Static — 'Field Notes Vol. 2' — 12″ LP; SR-019 Anaïs Ward — 'Coral Static' — 12″ LP; SR-018 Mote — 'Rearview' — 12″ LP reissue; SR-017 Diorama Kid — 'Playground Static' — 7″. Each card shows the seeded generative sleeve at 1:1, then title in Space Grotesk 700, artist, and a Space Mono line 'SR-024 · 12″ LP'.
   Layout: 4-column grid on desktop, 2 columns on tablet, 1 on mobile, 24px gap. Each sleeve sits on a paper card with a 1px faded-ink border; a code-drawn vinyl peeks 8px from the sleeve's right edge at rest.
   Motion: Hover rotates the sleeve 3deg and slides the vinyl 56px out over 240ms; tap toggles the same state on touch; cards reveal in a 60ms stagger with the standard rise.
3. **Roster** — Eyebrow 'THE ROSTER'; title 'Five loud friends.' Five poster cards, each anchored by a code-drawn stamp — the artist's initials in Anton inside a shape that varies per artist (coral circle, violet triangle, ink square, coral half-disc, violet ring) with paper knockouts. Mote — 'Two brothers, one tape machine, songs about flood plains.' — mono 'SR-018–024'; Diorama Kid — 'Night-bus synth pop for the last train home.' — 'SR-017–023'; Cassia Vale — 'Dub chambers and echo tests from a basement in [CITY].' — 'SR-021–022'; Grove Static — 'Field recordings folded into ambient techno.' — 'SR-020'; Anaïs Ward — 'A voice like a paper lantern; songs that hum.' — 'SR-019'. Each whole card links to ./artist.html?artist=mote (and the matching slug for the others).
   Layout: 5 columns on desktop wrapping 3 plus 2, 2 on tablet, 1 on mobile. Stamps are 120px; name in Space Grotesk 700, one-liner in body text, catalog range in Space Mono; the entire card is the link with an ArrowUpRight that appears on hover.
   Motion: The stamp rotates 4deg and back on hover over 200ms; cards reveal in a 60ms stagger.
4. **Tour feed** — Full-width ink band with paper text. Coral Space Mono eyebrow 'LIVE'; title 'On the road.' in Anton. Seven rows, each a season label in Space Mono, city and venue, a status chip, and an ArrowUpRight: 'Early spring — Milhaven, The Foundry — Sold out'; 'Early spring — Dunmoor, Klub Nord — Tickets'; 'Mid spring — Ashport, Cannery Hall — Tickets'; 'Late spring — Port Ellis, The Anchor Room — TBA'; 'Summer — Bell Harbor, Pier 9 — Tickets'; 'Early fall — Milhaven, The Foundry — TBA'; 'Fall — Greyfield, Old Market — Tickets'. Status chips: Tickets is coral-filled ink text, TBA is paper-outline, Sold out is violet-filled paper text. Ticket chips link to '#' as demo anchors. Footnote in Space Mono: 'Sample dates for a template demo — seasons, not calendars; ticket links go nowhere.'
   Layout: Single column max-width 900px. Rows are 20px vertical padding split by 1px paper-at-20% dividers; the season column is a fixed 140px; the status chip sits right-aligned before the arrow.
   Motion: Rows reveal in a 40ms stagger; hover shifts the row 4px right, raises its background to paper at 6%, and translates the arrow 2px up-right.
5. **Shop teaser** — Eyebrow 'THE SHOP'; title 'Take one home.' Three cards for the newest release's variants: 'Flood Rooms — Standard black LP — $18'; 'Flood Rooms — Coral vinyl, limited 300 — $24'; 'Flood Rooms — Deluxe 2×LP + riso print — $42'. Each card shows the mini generative sleeve, the variant name in Space Grotesk 700, the price, and a full-width ink 'Add to cart' button that adds the item and opens the drawer. Below the grid, a text link 'Full shop →' to ./shop.html.
   Layout: 3-column grid, 2 on tablet, 1 on mobile. Cards are paper with a 1px faded-ink border and 24px padding; prices repeat in Anton at 32px.
   Motion: Hover lifts a card 2px and casts a 4px coral offset shadow — like a second pass of ink; adding pops the cart badge to 1.15 for 160ms and slides the drawer in over 280ms.
6. **Footer** — Ink ground. A giant outline wordmark — [BRAND] in Anton with a 1px paper stroke and transparent fill — runs as a background band behind the content. Foreground: the logomark and [BRAND], anchor nav (Catalog, Roster, Tour, Shop), a Space Mono line 'Pressed in [CITY] · [GENRE]', the honest line 'All labels, artists, releases, venues and prices on this site are invented for a template demo.', '© [BRAND]' with no year, and the optional [CREDIT] link.
   Layout: Two rows on desktop — brand block with the mono line left and nav right; honest line, copyright and [CREDIT] on a second row in faded ink. Stacked on mobile. This footer repeats on every page.
   Motion: None — the footer is static.

### The shop — [BRAND] (`shop.html`)
1. **Shop grid** — The global header, cart drawer and footer repeat. Title 'The shop.' in Anton with the intro 'Six things for sale, zero real transactions — this whole store lives in your browser.' Six products: 'SR-024 Flood Rooms — Standard black LP — $18'; 'SR-024 Flood Rooms — Coral vinyl, limited 300 — $24'; 'SR-024 Flood Rooms — Deluxe 2×LP + riso print — $42'; 'SR-023 Night Bus Hymns — Standard black LP — $18'; 'SR-023 Night Bus Hymns — Violet vinyl, limited 300 — $24'; 'SR-022 Dub Test 04 — Black 12″ single — $15'. Each card: generative sleeve, title in Space Grotesk 700, a Space Mono line 'SR-024 · CORAL / 300', the price in Anton, and an ink 'Add to cart' button.
   Layout: 3-column grid, 2 on tablet, 1 on mobile, 24px gap, cards matching the teaser's paper style.
   Motion: Sleeves reuse the catalog hover (tilt and vinyl slide); adding to cart pops the badge and opens the drawer as on the home page.
2. **Pressing notes** — Paper band with three Space Mono notes set side by side: 'Pressed at a fictional plant in [CITY] — 140g unless noted.'; 'Color editions are one press run — when they're gone, they're gone.'; 'Flat $4 demo shipping anywhere; nothing actually ships.'
   Layout: 3 columns split by 1px faded-ink dividers on desktop; single column on mobile with 16px gaps.
   Motion: Static.

### Artist — [BRAND] (`artist.html`)
1. **Artist hero** — Reads ?artist= from the URL and matches slugs in content.ts, always falling back to the first artist (mote) when the query is missing or unknown. The page title becomes the artist's name. The hero shows the artist's stamp at 180px, the artist name in Anton with misregistration, a Space Mono catalog line ('SR-024 · SR-018' for Mote), and a roughly 50-word bio — for Mote: 'Mote started as two brothers trading four-track tapes across a flood plain. A decade on they still cut to tape first and argue about it after — songs about water tables, basement shows, and the long drive home. Flood Rooms is their fourth LP for the label.' Write one bio per artist in content.ts at the same length.
   Layout: 12-column grid: stamp and name in columns 1–7, bio in columns 8–12 vertically centered. On mobile the stamp centers above the stacked name and bio.
   Motion: The stamp rotates from -4deg to 0 as it settles over 400ms; the name and bio reveal with the standard rise.
2. **Artist releases** — Eyebrow 'ON THE LABEL'; title 'Their records.' The catalog grid filtered to this artist's releases, using the identical cards and hover behavior (for Mote: SR-024 and SR-018).
   Layout: Same 4/2/1 grid as the home catalog; with fewer items the grid keeps left alignment.
   Motion: Same sleeve tilt and vinyl slide; standard staggered reveal.
3. **Back link and footer** — A paper-outline '← Back to the roster' link to ./index.html#roster, then the shared global footer.
   Layout: Left-aligned link with 48px top padding above the footer.
   Motion: Standard link underline offset transition only.

## Assets
- image: No image files at all. Every visual is drawn in code: generative sleeves from src/lib/cover.ts (seeded two-color SVG geometry with multiply overlaps), the SVG vinyl record, artist stamps, the logomark, the misregistered display type, and a generated feTurbulence riso grain overlay at 6% multiply. Nothing is downloaded, scanned, or hotlinked; ASSETS.md records that all artwork is original code.
- icon: Install lucide-react (ISC) and use only Disc3, ShoppingBag, Plus, Minus, X, ArrowRight, and ArrowUpRight. Draw no brand logos or real label marks; the logomark and stamps are original code. Record the package and license in ASSETS.md.
- font: Self-host Anton 400 through @fontsource/anton (OFL-1.1). Record the package and license in ASSETS.md; do not use a font CDN.
- font: Self-host Space Grotesk 400/500/700 through @fontsource/space-grotesk (OFL-1.1). Record the package and license in ASSETS.md; do not use a font CDN.
- font: Self-host Space Mono 400/700 through @fontsource/space-mono (OFL-1.1). Record the package and license in ASSETS.md; do not use a font CDN.

## Don'ts
- No real labels, artists, albums, venues, pressing plants or festivals anywhere — every name, sleeve, city, price and stat is invented, and the footer says so.
- All cover art is code-drawn generative two-color geometry: no real album art references, no photos of people, no stock or scanned artwork anywhere on the site.
- Tour rows use season labels or TBA only — never real dates, years, day-of-week calendar logic, or anything tied to the visitor's clock, and no copyright year in the footer.
- The cart is a local demo and says so on its face: no payment, no checkout beyond the drawer, no APIs, no analytics, no email capture; persistence is localStorage only with validation on restore.
- The risograph texture is generated in code (SVG feTurbulence with multiply blending); never scan paper, download textures, or hotlink any file.
- No backend, server code, databases, auth, or form submissions. Static output in dist/ from the single build command with relative paths.
- Self-host fonts through the listed Fontsource packages only; never load Google Fonts, Adobe Fonts, or any CDN stylesheet or script.
- Production build is minified with no source maps, no src/ copied into dist/, and dist/ stays under 20 MB.
- No Unsplash, Pexels, Pixabay, Google Images, placeholder-image services, or any external or hotlinked asset — this template ships zero photographic files.
- Every internal link is a file name (./index.html, ./shop.html, ./artist.html?artist=…) or an in-page anchor, never a bare directory; artist.html opened without a query shows the first artist, never a not-found state.
- Respect prefers-reduced-motion: pause the vinyl spin and the ticker and skip reveals; every interaction stays fully functional without animation.
- Keep the two spot colors strict — coral and violet on ink and paper only; no gradients, no drop shadows except the coral print-offset hover, no glow.
- Do not use rounded corners anywhere; the sharp paper-trimmed aesthetic is part of the design, with circles only inside drawn art.
- Keep all copy in US English and derive the cart storage key, slugs and alt text from [BRAND] and [BRAND_SLUG] so alternate variable values never leave default-brand remnants.
- No SEO work: no meta descriptions, Open Graph tags, JSON-LD, sitemaps, or keyword-stuffed headings. A plain title with [BRAND] and a favicon are enough.
- The site must render at 1440×900 and 390×844 with zero console errors, including the query-routed artist page.

---
— Prompt by VibeFather · https://vibefather.ai/t/indie-record-label-website · CC BY-NC 4.0 (non-commercial; commercial use needs a VibeFather Pro license) · Request removal: https://vibefather.ai/takedown
