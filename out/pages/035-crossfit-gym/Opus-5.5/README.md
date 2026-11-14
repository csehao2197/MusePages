# Iron Tide CrossFit — gym homepage

- **Original prompt**: `data/prompts/035-crossfit-gym/035-crossfit-gym.md`, combined with `src\workflows\AI Agent\DESIGN.md`
- **Model**: Claude Opus 5.5 (`claude-opus-5-5`), directory `Opus-5.5`
- **Type**: Static HTML/CSS/browser JavaScript (no framework, no build)
- **Source**:
  - `index.html`, `styles.css`, `app.js`
  - `assets/art.js`: SVG scenes, portraits and map
  - browser checks in `page.test.mjs`
- **Static homepage**: `out/` with `out/preview.png` (1200×900)
- **Publish path**: `pages/crossfit-gym/Opus-5.5/index.html` (registered disabled in `deploy/config.json`)

## Features

- **Navigation:** dark nav with the wave-and-barbell mark and a red CTA. On mobile, a "Free Class" mini button, a hamburger menu and a sticky bottom CTA.
- **Hero:**
  - an illustrated synchronized-clean scene with a slow drift, behind a 70% overlay
  - two CTAs
  - an infinite red class-time ticker
- **Today's WOD:** "TIDAL WAVE" with an Rx/Scale toggle that swaps in the beginner modifications, plus a top-three morning leaderboard with medals.
- **Programs:** three cards with badges and 4:3 images. On hover, the image zooms, the card lifts and a red bottom border appears. "Learn More" opens a details dialog.
- **Schedule:**
  - Mon–Sun tabs, with today's real weekday highlighted
  - eight weekday classes with green, yellow or red availability (Saturday and Sunday have their own timetables)
  - "Reserve Your Spot" and "Join Waitlist" dialogs; a reservation marks the row as reserved
  - on mobile, swipeable tabs and card rows
- **Coaches:** 120px circular portraits; horizontal snap scrolling on mobile.
- **Transformation stories:** three dark cards with red result highlights.
- **Pricing:** three tiers. The "Pay annually and save 15%" toggle recalculates the prices: Unlimited $157/mo ($1,887/yr), Competitor $191/mo ($2,295/yr). Unlimited comes first on mobile.
- **Community:** six-scene masonry collage and three Instagram-style post tiles.
- **Find Us:** illustrated Pacific Beach map with a pin, contact details and a Google Maps "Get Directions" link.
- **Closing sections:** final CTA and a four-column footer.

## Mocks and limitations

- **Images:**
  - There is no video. The hero is an animated SVG illustration with a slow zoom, as the brief allows a still fallback.
  - All other photos (classes, coaches, transformations, community, Instagram) are original SVG illustrations.
  - Rachel's before/after slot is a blurred placeholder.
- **Map:** the map is illustrative, not an embedded live map.
- **Dates:** the WOD date "Thursday, March 12, 2026" is kept as written. Availability counts for other weekdays are generated from the brief's Monday/Thursday pattern.
- **Demos:** bookings, waitlists and purchases send nothing and take no payment. Footer pages show a notice.
- **Branding:** the CrossFit affiliate mark is a plain text badge, not the official logo.
- **Sample content:** athlete names, scores and stories are illustrative; the footer says so.

## Run and verify

From the repo root, `node out/pages/035-crossfit-gym/Opus-5.5/page.test.mjs` runs 7 Playwright checks:

- nav, hero and ticker
- WOD scaling toggle and leaderboard
- program hover and dialog
- schedule tabs, availability, reserve and waitlist
- coaches, stories, annual pricing, collage, Instagram and map details
- intro booking validation and footer
- mobile layout and 48px targets
- no runtime or request errors

Desktop and mobile screenshots were reviewed visually.
