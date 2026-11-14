# Flowline — blog and content hub

- **Original prompt**: `data/prompts/063-saas-content-hub/063-saas-content-hub.md`, combined with `src\workflows\AI Agent\DESIGN.md`
- **Model**: Claude Opus 5.5 (`claude-opus-5-5`), directory `Opus-5.5`
- **Type**: Static HTML/CSS/browser JavaScript (no framework, no build)
- **Source**: `index.html`, `styles.css`, `app.js`, `assets/art.js` (original SVG illustrations and portraits); browser checks in `page.test.mjs`
- **Static homepage**: `out/` with `out/preview.png` (1200×900)
- **Publish path**: `pages/saas-content-hub/Opus-5.5/index.html` (registered disabled in `deploy/config.json`)

## Features

- **Navigation:** sticky nav that gains a border on scroll. The Resources dropdown (Blog, Guides, Webinars, Case Studies, API Docs) supports the keyboard and Escape. Also includes a search icon, Sign In and Start Free, plus a hamburger menu on mobile.
- **Hero:** 50vh gradient with a 480px live search and 7 topic pills. On mobile the pills scroll horizontally.
- **Featured article:** 400px card with a 55/45 split and hover lift; it stacks on mobile.
- **Article catalog:** 108 posts: the 10 from the brief plus 98 archive posts. Topic counts (28/22/19/15/14/10) are computed from the catalog.
  - 3-column grid with 9 cards per page, colored category badges, 2-line clamps, image zoom on hover
  - pills, topic cards and the Case Studies menu item all filter the grid
  - search covers titles, excerpts, topics and authors, with an empty state
- **Newsletter:** banner after row 2 with validation and a remembered subscription.
- **Pagination:** Load More appends 9 posts. Numbered pages run ← 1 2 3 … 12 → with "Showing 9 of 108 articles".
- **Right rail:** Popular This Month (opens articles) and Free Resources:
  - Remote Team Playbook: an email gate, then a real one-page PDF generated in the browser
  - Project Health Scorecard: a CSV template download
  - Masterclass: a simulated player with chapters
- **Reader dialog:** article preview with a deep link (`#post/<slug>`), Copy link and "More in topic".
- **Footer:** Explore by Topic grid, footer CTA and footer.

## Mocks and limitations

- **Fictional content:** Flowline, its authors, customers and articles are fictional. Thumbnails and portraits are original SVG illustrations.
- **No backend:** newsletter and gate emails are stored only in this browser's `localStorage` (`fl-sub`), and nothing is sent.
- **Article previews:** articles open as short previews; full article text isn't included.
- **Demo player:** the masterclass player simulates progress and streams no video.
- **Placeholder links:** Product, Pricing, Guides, Webinars, API Docs, Sign In and the trial/demo buttons show a toast.
- **Fonts:** Outfit stands in for "Cal Sans or similar".
- **Emoji:** the brief's emoji are replaced by cover illustrations and icons.
- **Dates:** article dates (Feb–Mar 2026 and earlier) are sample data.

## Run and verify

From the repo root, `node out/pages/063-saas-content-hub/Opus-5.5/page.test.mjs` runs 8 Playwright checks:

- nav, dropdown and hero
- featured card, grid, newsletter position, badge colors and rail
- topic counts, filters, search and empty state
- Load More and pagination
- reader dialog and deep links
- newsletter, PDF/CSV downloads and player
- Case Studies filter, search focus and CTA
- mobile layout, menu and 44px targets
- no runtime or request errors

Desktop and mobile screenshots were reviewed visually.
