# StayFinder hotel search results (Tokyo)

- **Original prompt**: `data/prompts/005-hotel-search-and-booking/005-hotel-search-and-booking.md`, combined with root `DESIGN.md`
- **Model**: Claude Opus 5.5 (`claude-opus-5-5`), directory `Opus-5.5`
- **Type**: Static HTML/CSS/browser JavaScript (no framework, no build)
- **Source**: `index.html`, `styles.css`, `app.js`, `assets/photos.js`
- **Static homepage**: `out/index.html` + assets; preview `out/preview.png` (1200×900)
- **Publish path**: `pages/hotel-search-and-booking/Opus-5.5/index.html` (registered disabled in `deploy/config.json`)

## Features

- **Nav**: currency switcher (USD/EUR/JPY), saved-hotels counter, and a compact search pill that appears in the nav after scrolling.
- **Search card**: destination autocomplete (keyboard support), dates with validation, a guests popover and rooms. Nights and totals recompute. On mobile it collapses to a summary panel.
- **Filter sidebar** (sticky and scrollable):
  - Map preview, a dual price slider with a histogram.
  - Star, guest-rating, property-type, neighborhood (show more) and amenity filters, with live counts. The default counts match the prompt.
  - Clear-all and removable chips.
  - On mobile it becomes a bottom sheet.
- **Sorting and views**: Recommended / price / rating / distance (horizontal chips on mobile), and list/grid toggle.
- **Hotel cards**: four-photo carousels (arrows, dots, swipe), sponsored "Ad", badges, amenity icons, strike-through prices and % off, totals, cancellation/urgency text and a save heart.
- **Paging**: 20 per page with numbered pagination (1 … 13) plus Load More.
- **Map**: full-screen, a stylized Tokyo SVG. Clustered markers (click to zoom), price bubbles, gray sold-out markers, mini cards, zoom, satellite style, drag to pan, and "Search this area" filtering.
- **Hotel detail modal**:
  - Photo grid with "View all 32 photos" (a swipe carousel on mobile), and a rating breakdown.
  - Description, a selectable room table with the "Most Popular" tag, amenities grid, location with nearby walking times, house rules, and three reviews with hotel responses.
  - Sticky Reserve bar with a live total.
- **Lower page**: trust badges and payment marks, a recently viewed rail (kept in `localStorage`, safe if unavailable), and a footer with currency/language selectors.
- **Mobile bar**: sticky bottom bar that follows the card in view ("View Deal"), with Filters and Map.

## Mocks and limitations

- All 245 hotels are generated deterministically in the browser (seeded). The four named properties are pinned with the prompt's prices; other names, prices and amenities are fictional.
- Photos are procedural SVG illustrations. The map is a stylized illustration, not a real map or tile service, and positions are approximate.
- Payment marks are text renderings, not official logos.
- Search outside Tokyo shows the sample Tokyo results with a notice. Booking, reserve, sign-in and property listing are local demos; nothing is sent or charged.
- The Inter font loads from Google Fonts, with fallbacks.

## Run and verify

Open `out/index.html` from any static server. Verified with Playwright at 1440×900 and 390×844 (the layout viewport stays 390px): no console, page or resource errors, no horizontal overflow. Also verified: pinned card content and totals, prompt filter counts, filters and chips, sorting, grid view, pagination and load more, the detail modal (rooms/totals/photos/reserve) and repeated opening, recently viewed, the map (clusters, mini card, zoom, area search, satellite), search validation and night recalculation, currency, the compact nav, the mobile sheet and sort chips, the mobile bar and the gallery swipe. Desktop, mobile, modal and map screenshots were reviewed visually.
