# Tokyo destination guide (Wanderly Travel)

- **Original prompt**: `data/prompts/001-destination-guide/001-destination-guide.md`, combined with root `DESIGN.md`
- **Model**: Claude Opus 5.5 (`claude-opus-5-5`), directory `Opus-5.5`
- **Type**: Static HTML/CSS/browser JavaScript (no framework, no build)
- **Source**: `index.html`, `styles.css`, `app.js`, `assets/scenes.js`
- **Static homepage**: `out/index.html` + assets; preview `out/preview.png` (1200×900)
- **Publish path**: `pages/destination-guide/Opus-5.5/index.html` (registered disabled in `deploy/config.json`)

## Features

Sticky header with shadow on scroll and mobile menu, breadcrumb, 70vh dusk skyline hero with quick stats, sticky "At a Glance" sidebar (an accordion on mobile), overview with highlight grid and collage, attraction cards with category filters and save toggles (a horizontal snap carousel on mobile), 3/5/7-day itinerary tabs (arrow keys and touch swipe) with day timelines and meal stops, neighborhood cards, insider tips, a 12-month temperature/rainfall chart (scrolls horizontally on mobile) with seasonal events, reviews, a dark-teal CTA, footer, and a sticky mobile CTA bar.

## Mocks and limitations

- Photography is replaced by generated SVG illustrations (no licensed photos are bundled).
- "Plan My Trip" opens a local form with validation; nothing is sent, and a reference is generated in the browser.
- PDF download, packages and hotel links show demo notices. Footer links are in-page anchors.
- The prompt's emoji are rendered as Lucide-style inline SVG icons, per `DESIGN.md`. The Japan flag is drawn in CSS.
- Fonts load from Google Fonts, with system fallbacks when offline.

## Run and verify

Open `out/index.html` from any static server. Verified with Playwright at 1440×900 and 390×844: no console, page or resource errors, no horizontal overflow; filters, save, tabs (click/keyboard), accordion, menu, carousel/chart scrolling, and form validation/submit/close all work. Desktop and mobile screenshots were reviewed visually.
