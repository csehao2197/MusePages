# FareFinder travel deals page

- **Original prompt**: `data/prompts/008-travel-deals-page/008-travel-deals-page.md`, combined with `src\workflows\AI Agent\DESIGN.md`
- **Model**: Claude Opus 5.5 (`claude-opus-5-5`), directory `Opus-5.5`
- **Type**: Static HTML/CSS/browser JavaScript (no framework, no build)
- **Source**: `index.html`, `styles.css`, `app.js`, `assets/scenes.js`
- **Static homepage**: `out/index.html` + assets; preview `out/preview.png` (1200×900)
- **Publish path**: `pages/travel-deals-page/Opus-5.5/index.html` (registered disabled in `deploy/config.json`)

## Features

- **Hero**: navy gradient with a dotted world-map pattern, a pulsing live deal counter, a quick search (From / To / Dates / Travelers) that maps to filters, and trust badges.
- **Flash deals**: four deals with live monospaced countdowns, a master "next deal ends" timer, the "Almost gone!" label and a glowing hover border. The rail auto-scrolls on desktop (pausing on hover/focus), and has arrows plus swipe and dots on mobile.
- **Filter bar**: sticky, with Deal Type, Destination, Budget and Travel Dates menus (live option counts, removable chips) and four sort orders. It becomes an accordion on mobile, and a live "deals found" count updates as filters change.
- **Deal grid**: 12 cards in the prompt's curated order (Load More reveals 6 more). Savings badges, type labels, ratings, struck-through prices, total savings, urgency lines and hearts.
- **Rest of the page**:
  - A deal modal with the 2-traveler total; opening a deal adds it to Recently Viewed.
  - Browse-by-type cards that filter the grid, and a Portugal spotlight with three deals.
  - A price alert form with validation; Recently Viewed and Recommended rails; and a newsletter.
  - A footer with payment marks, and a sticky mobile "N Deals / Filter" bar.

## Mocks and limitations

- Photography is replaced by generated SVG illustrations (no licensed photos are bundled).
- The deals beyond the prompt's eight grid cards (flights, the cruise, Bali, Portugal, Athens, Sri Lanka, Paris) are sample data reusing prompt figures where given. Category counts (124, 89, …) are display figures from the prompt.
- Countdowns start from the prompt's remaining times when the page opens. The live counter occasionally increments locally.
- Booking, alerts, newsletter, car rental and experiences are local demos; nothing is sent. Payment marks are text renderings, not official logos.
- The prompt's emoji are replaced with Lucide-style icons, per `DESIGN.md`. Fonts (Plus Jakarta Sans, Inter, JetBrains Mono) load from Google Fonts with fallbacks.

## Run and verify

Open `out/index.html` from any static server. Verified with Playwright at 1440×900 and 390×844 (the layout viewport stays 390px): no console, page or resource errors, no horizontal overflow. Also verified: flash countdowns ticking and the master timer, filter combinations and counts, chips, sorting, load more, the deal modal and recently viewed, type cards, quick search, Portugal links, recommendations, the price alert and newsletter validation, the mobile accordion and bottom bar, and the carousels. Desktop and mobile screenshots were reviewed visually.
