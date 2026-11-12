# The Meridian Penthouse showcase

- **Original prompt**: `data/prompts/021-luxury-property-showcase/021-luxury-property-showcase.md`, combined with `src\workflows\AI Agent\DESIGN.md`
- **Model**: Claude Opus 5.5 (`claude-opus-5-5`), directory `Opus-5.5`
- **Type**: Static HTML/CSS/browser JavaScript (no framework, no build)
- **Source**: `index.html`, `styles.css`, `app.js`, `assets/art.js`; browser checks in `page.test.mjs`
- **Static homepage**: `out/` (same files) with `out/preview.png` (1200×900)
- **Publish path**: `pages/luxury-property-showcase/Opus-5.5/index.html` (registered disabled in `deploy/config.json`)

## Features

- **Hero:** full-viewport living room at dusk with a slow Ken Burns zoom, serif title, framed price and an animated scroll cue.
- **Details bar:** sticks below the nav; collapsible on mobile.
- **Overview:** MLS number and agent.
- **Gallery:** 16-photo cinematic grid with fade-in. The lightbox shows a "3 of 16" counter and supports keys and swipe. On mobile, a swipe carousel.
- **Floor plan:** interactive SVG where rooms are selectable from the plan or the dimension list, with zoom on mobile. A vector floor-plan PDF is generated in the browser.
- **Features and amenities:** six feature groups (an accordion on mobile); building amenities in a horizontal rail with arrows.
- **Neighborhood:** map, travel times and animated Walk/Transit/Bike score gauges.
- **Virtual tour:** drag or arrow-key panorama with room hotspots and fullscreen, plus a video-walkthrough fallback with simulated playback.
- **Mortgage calculator:** price, down-payment slider, rate and term; it matches the prompt at $21,793/mo.
- **Viewing and comparables:** private-viewing form with an agent card; three comparable listings.
- **Footer and mobile CTA:** footer with Equal Housing statement and MLS disclaimer; floating "Schedule Viewing" button on mobile.

## Mocks and limitations

- All photography, the panorama and the "video" are original SVG illustrations. There is no Matterport or video embed, no real map tiles, and no licensed photos.
- The viewing request, pre-approval and "View All Luxury Listings" are local demos; nothing is sent.
- The agent contact details, amenity descriptions and room square footage are invented to complete the listing.

## Run and verify

Serve `out/` from any static server (relative URLs; works under `/pages/luxury-property-showcase/Opus-5.5/`). From the repo root, `node out/pages/021-luxury-property-showcase/Opus-5.5/page.test.mjs` runs 9 Playwright checks at 1440×900 and 390×844 (touch):

- sticky details bar
- 16-photo lightbox counter
- floor plan selection and PDF structure
- feature groups
- tour hotspots, keyboard panning and video
- mortgage maths
- viewing form
- comparables
- mobile details toggle, carousel, accordion, plan zoom-scroll and floating CTA
- no overflow, and no runtime, resource or non-GET request errors

Desktop and mobile screenshots were reviewed visually.
