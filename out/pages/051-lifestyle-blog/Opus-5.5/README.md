# The Sunday Edit — lifestyle magazine homepage

- **Original prompt**: `data/prompts/051-lifestyle-blog/051-lifestyle-blog.md`, combined with `src\workflows\AI Agent\DESIGN.md`
- **Model**: Claude Opus 5.5 (`claude-opus-5-5`), directory `Opus-5.5`
- **Type**: Static HTML/CSS/browser JavaScript (no framework, no build)
- **Source**:
  - `index.html`, `styles.css`, `app.js` (article data and interactions)
  - `assets/art.js`: SVG editorial "photographs" with a grain filter, author portraits and the team image
  - browser checks in `page.test.mjs`
- **Static homepage**: `out/` with `out/preview.png` (1200×900)
- **Publish path**: `pages/lifestyle-blog/Opus-5.5/index.html` (registered disabled in `deploy/config.json`)

## Features

- **Navigation:** lavender announcement bar and a sticky nav with the centered Playfair logo, section links, search, Subscribe and "Shop Our Picks". On mobile: hamburger left, logo center, search and Subscribe right.
- **Hero:** 70vh (50vh on mobile) with a bottom gradient, fuchsia pill, byline, slow zoom on hover and an animated headline underline.
- **Category bar:** sticky, with a shadow once stuck. Eight pills filter the Latest grid, including Interviews and Gift Guides; the nav and footer section links filter too.
- **Editor's Picks:** three 3:2 cards (a snap carousel on mobile).
- **Latest:** mixed grid (large plus two small, three equal, one wide feature).
- **Saving:** a heart on each card saves it to a reading list kept in `localStorage`.
- **Reading:** clicking any story opens a reader dialog with an excerpt.
- **Newsletter:** lavender grain section with a cup-and-paper illustration and email validation. The footer form works the same way.
- **Trending:** five numbered snap cards with large faded numbers and read counts.
- **Slow Living Guide:** collection box with four linked stories and an "Explore" dialog.
- **Instagram:** six tiles with hover overlays (likes and caption) and a lightbox; on mobile, four visible with scrolling.
- **Search:** overlay (also opens with `/`) that matches titles, authors and categories.
- **Dialogs:** Shop Our Picks, Meet the Team and a Write for Us pitch form.
- **About and footer:** about section with the founders' image; stone-900 footer with four columns.
- **Mobile:** sticky "Subscribe" bar that hides once you subscribe.
- **Lazy rendering:** all illustrations below the fold render only when they near the viewport.

## Mocks and limitations

- **Images:** all photos (hero, cards, Instagram, team) are original SVG illustrations; there is no Instagram feed connection.
- **Demos:** subscriptions, pitches and shop links send nothing. Article pages are short preview excerpts.
- **Sample content:** articles, authors, read counts and follower numbers are illustrative; the footer says so.
- **Additions:** a few extra stories fill the Interviews and Gift Guides filters.
- **Edits to the brief:**
  - the brief's past date (March 12, 2026) is kept
  - "Made with ☕" uses a coffee icon instead of emoji
  - the Substack/Beehiiv badge is a neutral "independent newsletter platform" line rather than a brand logo

## Run and verify

From the repo root, `node out/pages/051-lifestyle-blog/Opus-5.5/page.test.mjs` runs 7 Playwright checks:

- nav and hero
- category filtering and sticky bar
- picks, saving and reader
- newsletter
- trending, collection and Instagram
- search, shop, team, pitch and footer
- mobile layout, carousels, sticky bar and 44px targets
- no runtime or request errors

Desktop and mobile screenshots were reviewed visually.
