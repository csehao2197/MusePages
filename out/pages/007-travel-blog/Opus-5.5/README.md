# Wanderlust Chronicles travel blog

- **Original prompt**: `data/prompts/007-travel-blog/007-travel-blog.md`, combined with root `DESIGN.md`
- **Model**: Claude Opus 5.5 (`claude-opus-5-5`), directory `Opus-5.5`
- **Type**: Static HTML/CSS/browser JavaScript (no framework, no build)
- **Source**: `index.html`, `styles.css`, `app.js`, `assets/scenes.js`
- **Static homepage**: `out/index.html` + assets; preview `out/preview.png` (1200×900)
- **Publish path**: `pages/travel-blog/Opus-5.5/index.html` (registered disabled in `deploy/config.json`)

## Features

- **Navigation**:
  - Sticky nav whose category links filter the grid; a search overlay with live title/author matching (press "/" to open).
  - A full-screen mobile menu with category counts.
  - A sticky category pill bar with counts, which gains a shadow when it sticks.
- **Hero**: 85vh Santorini golden-hour hero with byline, excerpt and an animated scroll cue.
- **Story grid**:
  - Nine cards in 3 columns (2 on tablet, 1 on mobile), with Editor's Pick and Popular badges, bookmarks, 2-line excerpt clamp and hover lift/zoom.
  - Recent / Most Popular ordering, and Load More reveals nine older demo stories.
- **Trending sidebar**: sticky on desktop; a horizontal rail below the grid on smaller screens.
- **Portugal deep-dive spotlight**, and four writer cards with illustrated portraits (horizontal scroll on mobile; "View All Posts" searches by writer).
- **Bottom of page**: teal newsletter with a topographic pattern and validation, a 6-tile photo feed with location overlays, a footer with disclosure, and a back-to-top button.

## Mocks and limitations

- Photography and author photos are generated SVG illustrations (no licensed photos are bundled).
- The nine stories beyond the prompt's set are sample archive items. Category counts (42, 28, …) are the prompt's archive totals; the demo holds 18 stories, so filtered views say "Showing N of total".
- Article pages, Instagram and outbound links are not implemented (a toast explains this). Newsletter signup is local only.
- "As featured in" names are text, not publisher logos. Fonts (Playfair Display, Inter) load from Google Fonts with fallbacks.

## Run and verify

Open `out/index.html` from any static server. Verified with Playwright at 1440×900 and 390×844 (the layout viewport stays 390px): no console, page or resource errors, no horizontal overflow. Also verified: category filters (pills, nav, overlay), ordering, bookmarks, load more, search, the writer hover link, the newsletter, back-to-top, column counts, and the mobile horizontal rails. Desktop and mobile screenshots were reviewed visually.
