# Ember & Bloom coffee shop homepage

- **Original prompt**: `data/prompts/010-artisan-coffee-shop/010-artisan-coffee-shop.md`, combined with `src\workflows\AI Agent\DESIGN.md`
- **Model**: Claude Opus 5.5 (`claude-opus-5-5`), directory `Opus-5.5`
- **Type**: Static HTML/CSS/browser JavaScript (no framework, no build)
- **Source**: `index.html`, `styles.css`, `app.js`, `assets/art.js`; browser checks in `page.test.mjs`
- **Static homepage**: `out/` (same files) with `out/preview.png` (1200×900)
- **Publish path**: `pages/artisan-coffee-shop/Opus-5.5/index.html` (registered disabled in `deploy/config.json`)

## Features

Sticky cream nav with backdrop blur, Order Ahead, and a cart badge. On mobile it collapses to logo, cart and hamburger, with a slide-out drawer that keeps Order Ahead. Hero (90vh, 70vh on mobile) with an illustrated barista pour, warm left-to-right overlay, both CTAs and micro-stats. "What's Brewing" drink cards with arrows and add-to-order (a swipe rail on mobile). Split origin story with fact strip. Three-column menu with dotted leaders, V/GF badges and a working **menu PDF download** generated in the browser. Dark press strip. Four location cards with map thumbnails, hours, a live "open now" status in Portland time, and Google Maps directions links. "Brew at Home" bean cards with roast badges and Add to Cart. Newsletter with validation, rewards stamp card with a join form, and a four-column footer with social links.

The cart (drinks + beans) has quantity controls, a subtotal, pickup location and time, and is saved in `localStorage`. "Place pickup order" shows a demo confirmation.

## Mocks and limitations

- Photography is replaced by original SVG illustrations (hero, drinks, beans, bags, maps). No licensed photos are bundled.
- Ordering, checkout, newsletter and rewards are local demos; nothing is sent or charged. Press names are styled text, not official logos.
- The prompt's icons and stars use Lucide-style inline SVG; TikTok uses a simple custom glyph because Lucide has no brand icon for it.
- Fonts load from Google Fonts, with serif/sans fallbacks offline. Directions and social links open external sites.

## Run and verify

Serve `out/` from any static server (relative URLs; works under `/pages/artisan-coffee-shop/Opus-5.5/`). From the repo root, `node out/pages/010-artisan-coffee-shop/Opus-5.5/page.test.mjs` runs 10 Playwright checks at 1440×900 and 390×844 (touch):

- drink row fit
- cart add, quantity and persistence
- checkout confirmation
- PDF validity (header, xref offset, EOF)
- newsletter and rewards validation
- mobile drawer, overflow and product rail
- no runtime, resource or non-GET request errors

Desktop and mobile screenshots were reviewed visually.
