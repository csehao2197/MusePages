# Harvest & Hearth farm-to-table homepage

- **Original prompt**: `data/prompts/014-farm-to-table-restaurant/014-farm-to-table-restaurant.md`, combined with `src\workflows\AI Agent\DESIGN.md`
- **Model**: Claude Opus 5.5 (`claude-opus-5-5`), directory `Opus-5.5`
- **Type**: Static HTML/CSS/browser JavaScript (no framework, no build)
- **Source**: `index.html`, `styles.css`, `app.js`, `assets/art.js`; browser checks in `page.test.mjs`
- **Static homepage**: `out/` (same files) with `out/preview.png` (1200×900)
- **Publish path**: `pages/farm-to-table-restaurant/Opus-5.5/index.html` (registered disabled in `deploy/config.json`)

## Features

- **Hero:** full-viewport, an overhead plated dish on reclaimed wood. Wheat and vine line drawings animate around the title, with both CTAs and a bouncing scroll indicator.
- **Philosophy:** faded botanical illustrations and a leaf divider.
- **Spring menu:** accessible tabs (click and arrow keys) for Starters, Mains and Desserts; a dropdown on mobile.
- **Farm Family:** three cards with distance badges and product lists. "Learn More" highlights the farm on a radius map.
- **Chef:** story with pull quote and award badges.
- **Gallery:** six-image masonry with hover zoom and captions, plus a lightbox (arrows, keyboard, swipe). A swipe carousel with dots on mobile.
- **Events:** Farm Dinner booking (seat count, total, live seats left) and Private Dining inquiry (up to 24 guests, Tuesday–Sunday) on a linen texture.
- **Testimonials:** carousel that auto-advances every 6s, pauses on hover or focus, with dots and swipe.
- **Reservations:** time slots follow the hours (5:00–9:30 PM dinner, Sunday brunch 10:00 AM–1:30 PM, Mondays closed; past times removed), with party size 1–12, validation and a confirmation.
- **Visit and footer:** live open/closed status in Pacific time, today's hours highlighted, address, map, contact and parking. Then the newsletter and footer.
- **Mobile:** a sticky "Reserve a Table" button that hides when the reservation form is on screen.

## Mocks and limitations

- Food, farm and chef photography is replaced by original SVG illustrations. No licensed photos are bundled.
- Reservations, farm dinner, private dining and newsletter are local demos; nothing is sent or charged. Seat counts reset on reload.
- The added navigation bar and philosophy stats, the farm details in "Learn More", the seats-left count and the reservation reference are invented placeholders.
- "View Full Menu" shows a note because the full menu changes weekly. The Yelp icon is a simple custom glyph.
- Fonts load from Google Fonts with serif/sans fallbacks.

## Run and verify

Serve `out/` from any static server (relative URLs; works under `/pages/farm-to-table-restaurant/Opus-5.5/`). From the repo root, `node out/pages/014-farm-to-table-restaurant/Opus-5.5/page.test.mjs` runs 11 Playwright checks at 1440×900 and 390×844 (touch):

- line-drawing completion
- tabs and keyboard
- farm/map highlight
- lightbox
- farm dinner totals and seats
- private dining Monday rule
- 6s carousel
- reservation slots per day, validation and confirmation
- mobile dropdown, sticky CTA, gallery carousel and stacked cards
- no overflow, and no runtime, resource or non-GET request errors

Desktop and mobile screenshots were reviewed visually.
