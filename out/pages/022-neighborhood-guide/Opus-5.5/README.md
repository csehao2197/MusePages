# HomeScope Realty neighborhood guide

- **Original prompt**: `data/prompts/022-neighborhood-guide/022-neighborhood-guide.md`, combined with `src\workflows\AI Agent\DESIGN.md`
- **Model**: Claude Opus 5.5 (`claude-opus-5-5`), directory `Opus-5.5`
- **Type**: Static HTML/CSS/browser JavaScript (no framework, no build)
- **Source**: `index.html`, `styles.css`, `app.js`, `assets/art.js`; browser checks in `page.test.mjs`
- **Static homepage**: `out/` (same files) with `out/preview.png` (1200×900)
- **Publish path**: `pages/neighborhood-guide/Opus-5.5/index.html` (registered disabled in `deploy/config.json`)

## Features

- **Hero:** aerial suburb illustration with a dark-to-transparent overlay. The search has keyboard autocomplete over popular neighborhoods by name, city or ZIP.
- **Featured neighborhoods:** six cards with a Walk Score badge, price and tags. Arrows scroll the rail; on mobile the cards swipe. Selecting any neighborhood re-renders the whole guide.
- **Maplewood Heights (default):** breadcrumb, overview and key stats, plus four animated score rings, all matching the brief.
- **Amenities map:** SVG map with the neighborhood boundary and pins filterable by category. The sidebar list is synced with hover, focus and tooltips, and collapses on tablet.
- **Schools:** table with green/yellow/red rating badges and GreatSchools attribution.
- **Commutes and market:** commute cards; a 2×2 market grid; a 12-month price chart with hover values.
- **Reviews:** resident reviews with the 4.7/5 average.
- **Compare:** teaser table against two nearby neighborhoods, and a side-by-side modal with three pickers that highlights the best value in each row.
- **Contact:** agent card, a neighborhood tour request modal and a market-alerts signup.

## Mocks and limitations

- Imagery, the map and the agent portrait are original SVG illustrations. There are no Mapbox or Google Maps tiles and no licensed photos.
- Only Maplewood Heights uses the brief's figures. The other five neighborhoods, the restaurant and clinic names, the price history and the agent are invented.
- The listings link, tour request and alerts are local demos; nothing is sent.

## Run and verify

Serve `out/` from any static server (relative URLs). From the repo root, `node out/pages/022-neighborhood-guide/Opus-5.5/page.test.mjs` runs 11 Playwright checks at 1440×900, 900×1000 and 390×844 (touch):

- brief data in every section
- score ring animation
- map filters and list/map sync
- chart tooltip
- search autocomplete with full re-render
- compare modal
- tour and alerts validation
- tablet sidebar collapse
- mobile overflow and swipe
- no runtime, resource or non-GET request errors

Desktop and mobile screenshots were reviewed visually.
