# Wanderly Tokyo destination guide

Original input: `data\prompts\001-destination-guide\001-destination-guide.md`, with root `DESIGN.md`.
Actual generating model: `gpt-6.1-sol`, directly through the current GPT-6 session (not an external model service). Directory label: `GPT-6`.

Type: standalone HTML, inline CSS and browser JavaScript, local JPEG assets. Source: this directory's `index.html` and `assets\`. No dependencies, environment variables, build or backend required. Typography uses locally available Inter / DM Serif Display with Arial / Georgia fallbacks; webfont files are not bundled.

Open through a static HTTP server. The prepared independent homepage is `out\index.html`; `out\preview.png` is the actual 1200x900 first viewport. Intended publication path: `deploy\dist\MusePages\pages\destination-guide\GPT-6\`; registration alone does not publish.

Features: category filters, locally saved attractions, 3/5/7-day itineraries, month selector, mobile facts accordion and navigation, native dialog planner and browser print-to-PDF guide. Planning is an explicitly labeled browser-only mock; no messages, reservations, payments or personal data are transmitted. Prices, climate, traveler stories and itineraries are illustrative. Verify current visas, attraction locations, tickets and transport before travel; TeamLab uses its current Azabudai Hills location rather than the outdated source location.

Photography is downloaded from Unsplash image identifiers `photo-1540959733332-eab4deabeeaf`, `photo-1528360983277-13d401cdc186`, and `photo-1519608487953-e999c86e7455`. Unsplash's license applies; photos are editorial inspiration, not guarantees of the exact venue pictured. Retain source credits and independently verify reuse rights. No additional rights are granted by this collection. Initials replace fictional reviewer portraits.

Validation uses the existing static validator and screenshot generator, plus the private `checks.mjs` browser checks for filters, saved state, itinerary changes, weather and demo planning. `.checks\mobile.png` records 390x844 responsive rendering; `.checks\verified.json` records actual results. Neither source documentation, tests, state nor hidden records are copied into the static export. Desktop/mobile visual review is required before accepting validation.
