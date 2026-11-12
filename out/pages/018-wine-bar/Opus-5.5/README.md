# Terroir & Vine wine bar homepage

- **Original prompt**: `data/prompts/018-wine-bar/018-wine-bar.md`, combined with `src\workflows\AI Agent\DESIGN.md`
- **Model**: Claude Opus 5.5 (`claude-opus-5-5`), directory `Opus-5.5`
- **Type**: Static HTML/CSS/browser JavaScript (no framework, no build)
- **Source**: `index.html`, `styles.css`, `app.js`, `assets/art.js`; browser checks in `page.test.mjs`
- **Static homepage**: `out/` (same files) with `out/preview.png` (1200×900)
- **Publish path**: `pages/wine-bar/Opus-5.5/index.html` (registered disabled in `deploy/config.json`)

## Features

- **Nav:** transparent over the hero, turning solid on scroll; a slide-out drawer on mobile.
- **Hero:** full-bleed bar interior illustration with parallax (off under reduced motion), thin-serif logotype and both CTAs.
- **Introduction:** grape-icon divider.
- **Featured wines:** three cards with SVG region flags, tasting notes and per-glass prices, lifting on hover. "Add to tasting" carries chosen wines into the booking.
- **Wine list modal:** filter by color and search, with glass and bottle prices.
- **Private tastings:** tasting modal with dates, times, guests, a live total and a 21+ confirmation. Events inquiry for 8–24 guests that rejects Mondays.
- **Upcoming events:** date badges and green/amber/red availability dots. Booking lowers the remaining spots live. Horizontal scroll on mobile.
- **Gallery:** masonry with hover captions and a lightbox (keys, swipe); two columns on mobile.
- **Testimonials:** carousel that auto-advances every 5s, pauses on hover or focus, with dots and swipe.
- **Visit:** map, open/closed status, today's hours highlighted, and a happy-hour callout that shows "On now" during happy hour.
- **Vine Club and footer:** newsletter, social links and the 21+ notice.

## Mocks and limitations

- Interior, bottle and event imagery is replaced by original SVG illustrations, and the map is illustrative, not an embedded Google Map. No licensed photos are bundled.
- Tastings, events, inquiries and newsletter are local demos; nothing is sent or charged. Event spots reset on reload, and the event dates are the prompt's (April) dates.
- The tasting price ($48), the extended wine list and the gallery captions are invented to fill out the page. Open status uses the visitor's clock. The Yelp icon is a simple custom glyph.

## Run and verify

Serve `out/` from any static server (relative URLs; works under `/pages/wine-bar/Opus-5.5/`). From the repo root, `node out/pages/018-wine-bar/Opus-5.5/page.test.mjs` runs 9 Playwright checks at 1440×900 and 390×844 (touch):

- parallax and nav
- wine card flags, prices and hover lift
- wine-list filters
- tasting picks, total and age gate
- event spot updates
- inquiry limits and Monday rule
- lightbox and 5s carousel
- hours highlight and newsletter
- mobile drawer and layouts
- no overflow, and no runtime, resource or non-GET request errors

Desktop and mobile screenshots were reviewed visually.
