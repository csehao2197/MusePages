# Hikari sushi restaurant homepage

- **Original prompt**: `data/prompts/017-sushi-restaurant/017-sushi-restaurant.md`, combined with `src\workflows\AI Agent\DESIGN.md`
- **Model**: Claude Opus 5.5 (`claude-opus-5-5`), directory `Opus-5.5`
- **Type**: Static HTML/CSS/browser JavaScript (no framework, no build)
- **Source**: `index.html`, `styles.css`, `app.js`, `assets/art.js`; browser checks in `page.test.mjs`
- **Static homepage**: `out/` (same files) with `out/preview.png` (1200×900)
- **Publish path**: `pages/sushi-restaurant/Opus-5.5/index.html` (registered disabled in `deploy/config.json`)

## Features

- **Nav:** transparent over the hero, turning navy on scroll, with an English/光 logotype. On mobile, a slide-down panel.
- **Hero:** full-screen chef-at-the-counter illustration on a 20s Ken Burns cycle, brush-script 鮨処 光, both CTAs and a Japanese-style line-and-circle divider.
- **Philosophy:** vertical 一期一会 margin text.
- **Seasonal selection:** three cards with origins and gold season badges, plus an à la carte and sake menu modal.
- **Omakase:** a staggered three-photo strip and a 2×2 details grid.
- **Chef profile:** circular portrait.
- **Gallery:** six-photo grid with a warm "+" hover and a lightbox (arrows, keys, swipe); two columns on mobile.
- **Press and reviews:** typographic press marks and gold-bordered review cards that swipe on mobile.
- **Reservation form:**
  - Choosing Omakase limits times to 6:00 or 8:30 PM and requires 48 hours' notice; the bar offers seven slots from 6:00 to 9:00 PM.
  - Sundays and Mondays are rejected.
  - Party of 6–8 shows a private dining hint.
  - Validation, then a confirmation.
- **Location and footer:** map and transit details; newsletter and social links in the footer.
- **Motion:** sections fade in on scroll with 300ms-style transitions, all disabled under reduced motion.

## Mocks and limitations

- Photography is replaced by original SVG illustrations. Press names are typographic marks, not official logos.
- Reservations and newsletter are local demos; nothing is sent.
- The à la carte and sake list, the open status (visitor's local clock), and the gallery captions are invented to fill out the page.
- The brush font (Yuji Syuku) is loaded only for the specific Japanese characters used, with system Mincho fallbacks. The Google icon is a simple custom glyph.

## Run and verify

Serve `out/` from any static server (relative URLs; works under `/pages/sushi-restaurant/Opus-5.5/`). From the repo root, `node out/pages/017-sushi-restaurant/Opus-5.5/page.test.mjs` runs 9 Playwright checks at 1440×900 and 390×844 (touch):

- nav state and scroll reveals
- seasonal badges
- menu modal
- lightbox looping
- time rules per preference
- closed-day and 48-hour validation
- private-dining hint and confirmation
- newsletter
- mobile menu and layouts
- no overflow, and no runtime, resource or non-GET request errors

Desktop and mobile screenshots were reviewed visually.
