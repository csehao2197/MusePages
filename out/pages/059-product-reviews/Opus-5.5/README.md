# Northwind Outfitters — product reviews page

- **Original prompt**: `data/prompts/059-product-reviews/059-product-reviews.md`, combined with `src\workflows\AI Agent\DESIGN.md`
- **Model**: Claude Opus 5.5 (`claude-opus-5-5`), directory `Opus-5.5`
- **Type**: Static HTML/CSS/browser JavaScript (no framework, no build)
- **Source**:
  - `index.html`, `styles.css`
  - `app.js`: a deterministic generator for 1,247 sample reviews, plus filters, pagination and the write-a-review flow
  - `assets/art.js`: SVG product and customer-photo scenes
  - browser checks in `page.test.mjs`
- **Static homepage**: `out/` with `out/preview.png` (1200×900)
- **Publish path**: `pages/product-reviews/Opus-5.5/index.html` (registered disabled in `deploy/config.json`)

## Features

The brief names no product, so this page reviews a fictional **Trailblazer Waterproof Hiking Boot** from **Northwind Outfitters**, which suits the size and color filters.

- **Overview:** breadcrumb and product summary, then:
  - average (partial-star display), review count and recommend %, all computed from the data
  - a clickable 5→1 distribution that filters the list
  - five category ratings
- **Review highlights:** mention counts and common pros and cons, computed from review text. Mention chips filter the list.
- **Media:** customer photo and video gallery with a "+N" tile, an all-media dialog, and a lightbox with review context, arrow keys, swipe and "Go to this review".
- **Most helpful:** three featured long-form reviews with helpful counts and a seller response.
- **Filters and sort:**
  - filters for star checkboxes, verified only, with media, posting window, size and color
  - sort by recent, helpful, highest, lowest or with images
  - debounced search with highlighting, removable active-filter pills, and "Clear all"
- **Review cards:**
  - verified badge, variant, recommend flag, and pros/cons tags
  - "Read more", media thumbnails and seller responses
  - "Was this helpful?" votes saved in `localStorage`; report dialog; share-link copy
- **Pagination:** 20 per page with page numbers, ellipses and "Jump to page". `#review-ID` links open the right page.
- **Write a review:**
  - guest or "verify my purchase" flow (demo order `NW-48213`)
  - star selector, title, 50-character minimum body with counter, size and color, pros and cons, recommend yes/no
  - local photo/video previews
  - submitted reviews appear first as "Pending moderation" and aren't counted in the average
- **Guidelines and related:** expandable guidelines and "Customers also reviewed".
- **Mobile:** sticky quick-filter chips, a bottom-sheet filter drawer, single-column cards and a sticky "Write a Review / Filters" bar. All controls are at least 44px.

## Mocks and limitations

- **Sample data:** all reviews, reviewers, photos, responses and the store are fictional sample data generated deterministically in the browser. Dates are relative to today. New reviews, votes and reports stay in the page or `localStorage`.
- **Computed figures:**
  - the average is **4.6**: the brief's own distribution (847/312/56/20/12) works out to 4.57, not the stated 4.7
  - recommend % (94%), mention counts and pros/cons counts are computed and so differ from the brief's sample mention numbers
  - category ratings are the brief's values
- **AI summary:** the "AI-generated summary" is a client-side keyword summary, labeled "Summarized automatically from review text".
- **Media:** videos are represented by still-frame previews. Uploaded files are never sent anywhere.

## Run and verify

From the repo root, `node out/pages/059-product-reviews/Opus-5.5/page.test.mjs` runs 9 Playwright checks:

- overview math
- distribution filtering and sync
- all filters, sorting, search and mentions
- highlights, gallery and lightbox
- featured reviews
- card actions, votes, report, read more, responses and pagination with jump
- write-a-review validation, verification and pending post
- guidelines and related products
- mobile drawer, sticky bars and 44px targets
- no runtime or request errors

Desktop and mobile screenshots were reviewed visually.
