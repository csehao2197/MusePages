# OpenShelf — digital library catalog

- **Original prompt**: `data/prompts/043-e-library-catalog/043-e-library-catalog.md`, combined with `src\workflows\AI Agent\DESIGN.md`
- **Model**: Claude Opus 5.5 (`claude-opus-5-5`), directory `Opus-5.5`
- **Type**: Static HTML/CSS/browser JavaScript (no framework, no build)
- **Source**:
  - `index.html`, `styles.css`, `app.js`
  - `assets/art.js`: generated SVG covers and thumbnails
  - browser checks in `page.test.mjs`
- **Static homepage**: `out/` with `out/preview.png` (1200×900)
- **Publish path**: `pages/e-library-catalog/Opus-5.5/index.html` (registered disabled in `deploy/config.json`)

## Features

- **Hero search:**
  - a 640px search bar with a clear button
  - a suggestion list (matching titles, recent and popular searches) with keyboard navigation
  - four quick-filter chips and the stats bar
- **Sidebar filters (280px):**
  - type, subject (with "Show 81 more subjects"), level, language and availability
  - a dual-handle publication-year slider (2015–2026) and "Clear All Filters"
  - on tablet and mobile, a slide-in drawer opened by "Filters (n)"
- **Results header:** live "Showing 1–24 of N" count, removable filter pills, grid/list toggle, and sort (Relevance, Newest, Most Popular, Highest Rated).
- **Resource cards:**
  - type-colored badges: blue books, purple videos, green papers, orange tutorials, pink podcasts
  - access badges, ratings, journal and citations, duration, modules and progress bars
  - a hover lift with a blue left accent
  - actions: Read/Watch/Continue (opens a preview), bookmark, share (copies a link) and Cite (APA/MLA with copy)
  - the brief's four example cards come first
- **List view:** compact 60×80 thumbnails for denser browsing.
- **Pagination:** 24 per page.
- **Reading list:** count plus the last three saves; bookmarks update it.
- **Popular Collections:** three cards with cover mosaics; clicking one filters the sample catalog.
- **Recently Viewed:** a row updated when you open a resource, with "Clear History".
- **Footer:** newsletter, quick links and help links. On mobile the search bar sticks to the top on scroll.

## Mocks and limitations

- **Catalog size:** the page loads a 48-resource sample, so result counts and pagination reflect that sample. The facet counts and stats (12,450 resources) are the brief's figures for the full catalog; the page says so under the results.
- **Sample content:**
  - all titles, authors, institutions (such as "Prof. James Carter, MIT"), journals, ratings and citations are illustrative
  - covers and thumbnails are generated SVGs, not publisher artwork
  - the footer says so
- **Previews:** readers and players show placeholder content.
- **Storage:** recent searches, saves and history persist in `localStorage` when available and fall back silently.
- **Demos:** the newsletter, the librarian contact and "View All" are demos.

## Run and verify

From the repo root, `node out/pages/043-e-library-catalog/Opus-5.5/page.test.mjs` runs 7 Playwright checks:

- search suggestions (keyboard) and chips
- all facet types, the year range, pills and clear all
- count, sort, pagination and list view
- the brief's four cards
- cite and copy, bookmarks, recently viewed and share
- collections, history, newsletter and footer
- mobile drawer, sticky search and 44px targets
- no runtime or request errors

Testing found and fixed a mobile bug: the filter drawer was taller than the screen, so its "Show results" button was unreachable. Desktop and mobile screenshots were reviewed visually.
