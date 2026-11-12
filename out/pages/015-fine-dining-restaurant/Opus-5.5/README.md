# Aurelian fine dining homepage

- **Original prompt**: `data/prompts/015-fine-dining-restaurant/015-fine-dining-restaurant.md`, combined with `src\workflows\AI Agent\DESIGN.md`
- **Model**: Claude Opus 5.5 (`claude-opus-5-5`), directory `Opus-5.5`
- **Type**: Static HTML/CSS/browser JavaScript (no framework, no build)
- **Source**: `index.html`, `styles.css`, `app.js`, `assets/art.js`; browser checks in `page.test.mjs`
- **Static homepage**: `out/` (same files) with `out/preview.png` (1200×900)
- **Publish path**: `pages/fine-dining-restaurant/Opus-5.5/index.html` (registered disabled in `deploy/config.json`)

## Features

- **Look:** editorial black, cream and gold with sharp edges and centered typography, in Cormorant Garamond and Montserrat Light.
- **Nav:** transparent over the hero, turning solid #0F0F0F on scroll; a full-screen dark overlay on mobile.
- **Hero:** 100vh cinematic side-lit dish with a slow Ken Burns zoom (off under reduced motion), spaced logotype, gold divider, both CTAs and a scroll cue.
- **Philosophy** with gold line accents.
- **Autumn tasting menu:** seven courses separated by gold rules, wine pairings that can be shown or hidden, and a vegetarian-menu toggle.
- **Gallery:** editorial masonry with no headline, dark hover overlay with captions and scroll parallax; two columns on mobile.
- **Chef spotlight and Cellar:** chef credentials and quote; three wine programs, four featured bottles (a horizontal scroll on mobile) and a filterable wine-list modal.
- **Private dining:** a panel over the private room, with an inquiry form (8–24 guests and a live estimate).
- **Recognition:** a horizontal row of press and awards, stacked on mobile.
- **Reservation widget:**
  - Custom calendar with Monday/Tuesday and past days closed, plus "limited" markers.
  - Party size 1–8; choosing 9+ opens the private dining inquiry.
  - 5:30 or 8:30 seating; a seating that is fully booked on the chosen date is disabled.
  - Occasion select, a Check Availability step, then a name/email hold and confirmation.
- **Location and footer:** live open/closed status in New York time with today's hours highlighted. Minimal footer with newsletter and the health notice.
- **Mobile:** a sticky gold "Reserve" bar that hides over the reservation section.

## Mocks and limitations

- Photography is replaced by original SVG illustrations, and press names are typographic marks, not official logos. No licensed photos or logos are bundled.
- Availability is generated deterministically from the date, not live. Reservations, private dining and newsletter are local demos; nothing is sent.
- The vegetarian course substitutions and the extended wine-list selections are invented to fill out those features.
- Fonts load from Google Fonts with serif/sans fallbacks.

## Run and verify

Serve `out/` from any static server (relative URLs; works under `/pages/fine-dining-restaurant/Opus-5.5/`). From the repo root, `node out/pages/015-fine-dining-restaurant/Opus-5.5/page.test.mjs` runs 9 Playwright checks at 1440×900 and 390×844 (touch):

- nav transition
- menu pairings and vegetarian toggles
- gallery parallax
- wine filter
- private dining limits and estimate
- calendar closures, availability, hold and confirmation
- 9+ redirect to private dining
- hours status
- mobile overlay, sticky bar, two-column gallery and stacked press
- no overflow, and no runtime, resource or non-GET request errors

Desktop and mobile screenshots were reviewed visually.
