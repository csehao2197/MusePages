# Aperture Journal — photography blog homepage

- **Original prompt**: `data/prompts/053-photography-blog/053-photography-blog.md`, combined with `src\workflows\AI Agent\DESIGN.md`
- **Model**: Claude Opus 5.5 (`claude-opus-5-5`), directory `Opus-5.5`
- **Type**: Static HTML/CSS/browser JavaScript (no framework, no build)
- **Source**:
  - `index.html`, `styles.css`, `app.js` (stories, gallery data and interactions)
  - `assets/art.js`: a parametric SVG landscape generator (layered ridges, fog, water reflections, stars, aurora, Milky Way) plus gear, portrait and flat-lay art
  - browser checks in `page.test.mjs`
- **Static homepage**: `out/` with `out/preview.png` (1200×900)
- **Publish path**: `pages/photography-blog/Opus-5.5/index.html` (registered disabled in `deploy/config.json`)

## Features

- **Navigation:** thin lowercase logo with an aperture icon. The nav is transparent over the hero and turns white with a border on scroll. On mobile: logo and hamburger, with a full-screen dark overlay menu.
- **Hero:** full-viewport Dolomites golden-hour scene with a Ken Burns pan/zoom, a gold-underlined badge, Instrument Serif headline, meta and a gold "Read Story" link.
- **Recent Stories:** asymmetric 2-large + 3-small grid with 1px dividers, gradient overlays and hover zoom. Stacked on mobile.
- **Destinations:** near-black band of six tinted 3:4 cards with arrow buttons and snap scrolling. Each card opens a dialog with that destination's stories.
- **Selected Work:** nine-frame mosaic (panoramic and tall spans, zoom-in cursor). The lightbox shows EXIF (camera, lens, settings, location) and supports arrow keys and swipe; 2 columns on mobile.
- **Gear Talk:** three reviews with gold score badges and review dialogs.
- **From RAW to Final:** before/after slider (accessible range input: drag, tap or keyboard) comparing a filtered "RAW" render with the final. The five numbered steps move the reveal; camera settings shown.
- **About:** Elena's portrait, bio, stats and grayscale "featured in" names.
- **Newsletter:** set over a night-sky campsite scene, with a gold Subscribe button and a latest-issue preview.
- **Print shop:** framed mockups and a print dialog with size and frame pricing (demo cart).
- **Footer:** four columns and a Cookie Preferences dialog stored in `localStorage`.
- **Search:** full-screen overlay.
- **Mobile:** no floating bars, as the brief requests.

## Mocks and limitations

- **Images:**
  - every "photograph" is an original SVG illustration, not real photography
  - the "RAW" side is a CSS-filtered copy of the same artwork
  - EXIF values are plausible sample data
- **Sample content:** Elena Voss, her stories, stats and press names are illustrative; the footer says so. Press names are grayscale text, not logos.
- **Demos:**
  - story, review and destination pages are preview excerpts
  - the print shop has no checkout and the newsletter sends nothing
  - the footer email is the brief's fictional address
- **Dates:** the brief's dates are kept.

## Run and verify

From the repo root, `node out/pages/053-photography-blog/Opus-5.5/page.test.mjs` runs 7 Playwright checks:

- nav state and hero
- editorial grid
- destinations
- mosaic and lightbox
- gear and before/after slider
- about, newsletter, prints, cookies, footer and search
- mobile overlay, layouts, touch slider, no fixed bars and 44px targets
- no runtime or request errors

Desktop and mobile screenshots were reviewed visually.
