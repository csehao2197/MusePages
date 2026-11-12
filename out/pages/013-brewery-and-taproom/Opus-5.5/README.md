# Iron Ridge Brewing Co. homepage

- **Original prompt**: `data/prompts/013-brewery-and-taproom/013-brewery-and-taproom.md`, combined with `src\workflows\AI Agent\DESIGN.md`
- **Model**: Claude Opus 5.5 (`claude-opus-5-5`), directory `Opus-5.5`
- **Type**: Static HTML/CSS/browser JavaScript (no framework, no build)
- **Source**: `index.html`, `styles.css`, `app.js`, `assets/art.js`; browser checks in `page.test.mjs`
- **Static homepage**: `out/` (same files) with `out/preview.png` (1200×900)
- **Publish path**: `pages/brewery-and-taproom/Opus-5.5/index.html` (registered disabled in `deploy/config.json`)

## Features

- **Nav:** dark bar blending into the hero, with an Oswald wordmark and a mountain peak over the "R". On mobile: logo, "Visit" mini CTA and hamburger.
- **Hero:** illustrated taproom (copper tanks behind glass, bar taps, flights). A live hours badge is computed from the taproom schedule in Asheville time; it shows open/opens/closed and moves below the CTAs on mobile.
- **On Tap Right Now:** all 12 beers with ABV/IBU, a bitterness bar, family-colored left borders and NEW / LIMITED / SEASONAL / BREWERY ONLY badges. Style filters, and a beer menu PDF generated in the browser.
- **Taproom:** hours with today highlighted, Google Maps address and directions, amenities, quick-info chips and a kitchen menu modal. A three-image collage becomes a swipe gallery with dots on mobile.
- **Tours:** Standard and VIP cards on a grain-textured dark section. The booking modal offers only valid upcoming dates (weekends or Fridays) and times, 1–12 guests with a live total, contact validation and a 21+ confirmation.
- **Events:** four cards with live dates for the weekly ones. Each downloads a real `.ics` calendar file (weekly RRULE for trivia). Horizontal scroll on mobile.
- **Beer finder:** WNC map with clickable, keyboard-focusable pins synced to the list. Searching by zip uses exact codes and 3-digit areas; searching by text matches name, city or beer.
- **Shop and about:** four product cards with add-to-cart feedback; founders story with stats.
- **Footer:** newsletter validation and four columns that become accordions on mobile.

## Mocks and limitations

- Photography is replaced by original SVG illustrations. No licensed photos are bundled.
- Tour booking, cart, shop link, newsletter and "See All Events" are local demos; nothing is sent or charged.
- Stockist names and zip areas come from the prompt. Locations on the map are illustrative, not geocoded.
- The prompt's "Open Today: 12PM–10PM" badge text is computed from the stated weekly hours instead, since the two conflict.
- Prompt emoji are rendered as Lucide icons; fonts load from Google Fonts with condensed/system fallbacks.

## Run and verify

Serve `out/` from any static server (relative URLs; works under `/pages/brewery-and-taproom/Opus-5.5/`). From the repo root, `node out/pages/013-brewery-and-taproom/Opus-5.5/page.test.mjs` runs 11 Playwright checks at 1440×900 and 390×844 (touch):

- hours badge
- tap filters
- PDF validity
- VIP and standard booking dates, totals and age gate
- `.ics` download
- zip and text finder with pins
- newsletter
- mobile layout, accordion footer and gallery dots
- no overflow, and no runtime, resource or non-GET request errors

Desktop and mobile screenshots were reviewed visually.
