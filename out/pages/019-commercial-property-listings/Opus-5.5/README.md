# Vanguard Commercial listings page

- **Original prompt**: `data/prompts/019-commercial-property-listings/019-commercial-property-listings.md`, combined with `src\workflows\AI Agent\DESIGN.md`
- **Model**: Claude Opus 5.5 (`claude-opus-5-5`), directory `Opus-5.5`
- **Type**: Static HTML/CSS/browser JavaScript (no framework, no build)
- **Source**: `index.html`, `styles.css`, `app.js`, `assets/art.js`; browser checks in `page.test.mjs`
- **Static homepage**: `out/` (same files) with `out/preview.png` (1200×900)
- **Publish path**: `pages/commercial-property-listings/Opus-5.5/index.html` (registered disabled in `deploy/config.json`)

## Features

- **Nav and search:** sticky nav with phone and CTAs (condensed "Contact" on mobile). Navy search header with a location autocomplete (keyboard navigable, Austin submarkets and ZIPs), type and transaction selects, and five quick-filter chips.
- **Filter sidebar:** collapsible groups with counts. Dual-handle price sliders with For Lease ($/SF/yr) and For Sale modes, and a size slider; all sliders have manual inputs that accept 2.5M or 750k. Also building class, year built, amenities (all must match), certifications and availability. Active-filter chips can be removed one by one, plus Clear All. On tablet and mobile the sidebar becomes a slide-in drawer with a live result count and a count badge.
- **Results:** live result count, sort (newest, price, size), and grid, list and map views.
- **Cards:** three-photo carousel (arrows, swipe, dots), lease/sale/sublease and class badges, specs, monthly-rent math, tags, broker, save (persists in `localStorage`), tour and details.
- **Featured listing and pagination:** featured banner after the sixth card; 9 per page.
- **Map view:**
  - Color-coded pins with hover tooltips and click-to-open cards, synced with the list.
  - Clusters that zoom in on click; zoom, satellite and fullscreen controls.
  - Drag-to-pan with "Search this area", and "Draw on Map" polygon search.
  - On mobile: a full-screen map with a bottom-sheet list.
- **Details modal:** a rent calculator for lease listings, or a debt-service estimate for sale listings.
- **Other modals:** tour scheduling, save-search alert with a filter summary, and sign-in.
- **Market and contact:** market snapshot with a CSV download; lead form (submarket multi-select) that routes to the matching broker; three-broker team panel; footer type links pre-filter the results.
- **Mobile bar:** sticky Map/Filters bar.

## Mocks and limitations

- The listing inventory is 18 sample Austin properties: the 3 from the prompt plus 15 invented. Counts reflect this sample, not the "2,400+" in the header copy, and non-Austin searches return none.
- Photos, broker headshots and the map are original SVG illustrations, not real imagery or map tiles. Pin positions are illustrative.
- Tours, alerts, sign-in and the lead form are local demos; nothing is sent. Calculators are estimates.
- Prices below the lease slider minimum (industrial at $9.50/SF) are only hidden once the minimum is raised above the default.

## Run and verify

Serve `out/` from any static server (relative URLs; works under `/pages/commercial-property-listings/Opus-5.5/`). From the repo root, `node out/pages/019-commercial-property-listings/Opus-5.5/page.test.mjs` runs 12 Playwright checks at 1440×900 and 390×844 (touch):

- counts and pagination
- spec'd prices
- sidebar filters and chips
- price inputs
- autocomplete, submarket, transaction and quick chips
- sorting
- list view and photo carousel
- detail calculator and tour request
- map clusters, pins and area search
- drawn-polygon search
- save search, CSV download and lead routing
- mobile drawer, badge and map sheet
- no overflow, and no runtime, resource or non-GET request errors

Desktop, map and mobile screenshots were reviewed visually.
