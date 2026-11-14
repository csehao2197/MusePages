# Golden Crumb bakery & cafe homepage

- **Original prompt**: `data/prompts/011-bakery-and-cafe/011-bakery-and-cafe.md`, combined with `src\workflows\AI Agent\DESIGN.md`
- **Model**: Claude Opus 5.5 (`claude-opus-5-5`), directory `Opus-5.5`
- **Type**: Static HTML/CSS/browser JavaScript (no framework, no build)
- **Source**: `index.html`, `styles.css`, `app.js`, `assets/art.js`; browser checks in `page.test.mjs`
- **Static homepage**: `out/` (same files) with `out/preview.png` (1200×900)
- **Publish path**: `pages/bakery-and-cafe/Opus-5.5/index.html` (registered disabled in `deploy/config.json`)

## Features

Fixed nav that is transparent over the hero and turns white with a shadow on scroll; a full-screen overlay menu on mobile. The hero has a script tagline, a Ken Burns zoom (off under reduced motion) and a cream scalloped bottom edge.

Sections, in order:

- **Fresh out of the oven:** three specials with tags and Add to Order.
- **Menu:** tabbed and keyboard accessible, with 26 items across Breads, Pastries, Breakfast, Lunch and Coffee & Drinks. Each item has an 80px thumbnail and vegan, gluten-free and nut icons. On mobile the tabs become scrolling pills.
- **Story:** arched baker portrait and a script signature.
- **Ordering steps:** three steps joined by a dashed line.
- **Gallery:** six-photo masonry with hover captions and a lightbox (keyboard, swipe). Two columns on mobile.
- **Reviews:** carousel that auto-advances every 5s, pauses on hover or focus, and has a pause toggle, dots and swipe.
- **Catering:** quote form validating 10–200 guests and a future date.
- **Weekly Bread Box:** subscription with a gift option that computes the first Saturday.
- **Visit:** live open/closed status, today's hours highlighted, map illustration, and a tel: link.
- **Crumb Club** newsletter, then a footer with social and payment badges.

The order drawer has quantities, subtotal and pickup windows taken from today's real hours (or tomorrow's when closed), and is saved in `localStorage`. On mobile a sticky bottom bar shows **Order Now** and the order summary.

## Mocks and limitations

- Photography is replaced by original SVG illustrations. No licensed photos are bundled.
- Ordering, catering, subscriptions and newsletter are local demos; nothing is sent or charged. Payment badges are simple text marks, not official logos.
- Opening status uses the visitor's local clock (the prompt gives no time zone). "View Full Menu" switches tabs, since the tabs already hold the full menu.
- The prompt's emoji are rendered as Lucide icons; TikTok uses a simple custom glyph.

## Run and verify

Serve `out/` from any static server (relative URLs; works under `/pages/bakery-and-cafe/Opus-5.5/`). From the repo root, `node out/pages/011-bakery-and-cafe/Opus-5.5/page.test.mjs` runs 11 Playwright checks at 1440×900 and 390×844 (touch):

- nav state on scroll
- menu tabs by click and arrow keys
- order totals, quantities and checkout
- gallery lightbox
- carousel timing and pause
- catering, subscription and newsletter validation
- mobile bar, overlay menu, pills and two-column gallery
- no overflow, and no runtime, resource or non-GET request errors

Desktop and mobile screenshots were reviewed visually.
