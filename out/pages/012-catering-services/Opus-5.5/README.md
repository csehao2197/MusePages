# Savory Affairs Catering homepage

- **Original prompt**: `data/prompts/012-catering-services/012-catering-services.md`, combined with `src\workflows\AI Agent\DESIGN.md`
- **Model**: Claude Opus 5.5 (`claude-opus-5-5`), directory `Opus-5.5`
- **Type**: Static HTML/CSS/browser JavaScript (no framework, no build)
- **Source**: `index.html`, `styles.css`, `app.js`, `assets/art.js`; browser checks in `page.test.mjs`
- **Static homepage**: `out/` (same files) with `out/preview.png` (1200×900)
- **Publish path**: `pages/catering-services/Opus-5.5/index.html` (registered disabled in `deploy/config.json`)

## Features

- **Nav:** a fixed charcoal/gold bar (added for navigation) with a mobile menu.
- **Hero:** full-bleed overhead table spread with a parallax background (off under reduced motion), both CTAs and trust stats.
- **Services:** three cards with prices and a hover lift. Each card's link pre-selects the event type in the form.
- **Sample menus:** accessible tabs (click and arrow keys) for Classic, Premium and Luxury. Each shows its courses and a "Start with…" button that pre-fills the package in the form.
- **How it works:** four-step timeline with a connecting line; vertical on mobile.
- **Past events:** six-image masonry with category badges and captions (event, guests, venue). Category filters, and a lightbox that pages within the current filter (keyboard, swipe).
- **Testimonials:** three-review slider with stars and verified badges. Dots, arrows and swipe; auto-advances every 7s and pauses on hover or focus.
- **Inquiry form:** every field from the prompt plus an optional package, with inline validation (20–500 guests, a date at least a week out, phone, email). A live price estimate updates by event type or package and guest count, and submission shows a confirmation with a reference.
- **FAQ and footer:** FAQ accordion showing one answer at a time; footer with quick links, contact details, social links and service area.

## Mocks and limitations

- Event and food photography is replaced by original SVG illustrations. No licensed photos are bundled.
- The form validates locally and does not send data. The estimate is an illustrative per-person range, not a quote.
- The added navigation bar and hero stats (1,400+ events, 4.9 rating, est. 2009) and the gallery event and venue names are invented placeholders that fill out the page.
- Pinterest uses a simple custom glyph; fonts load from Google Fonts with serif/sans fallbacks.

## Run and verify

Serve `out/` from any static server (relative URLs; works under `/pages/catering-services/Opus-5.5/`). From the repo root, `node out/pages/012-catering-services/Opus-5.5/page.test.mjs` runs 10 Playwright checks at 1440×900 and 390×844 (touch):

- parallax and nav state
- card hover lift
- tabs by click and keyboard
- package pre-fill and estimate math
- gallery filter and lightbox
- slider controls and touch swipe
- form validation and confirmation
- FAQ single-open behavior
- mobile menu and layout
- no overflow, and no runtime, resource or non-GET request errors

Desktop and mobile screenshots were reviewed visually.
