# TechVault — headphone comparison page

- **Original prompt**: `data/prompts/058-product-comparison/058-product-comparison.md`, combined with `src\workflows\AI Agent\DESIGN.md`
- **Model**: Claude Opus 5.5 (`claude-opus-5-5`), directory `Opus-5.5`
- **Type**: Static HTML/CSS/browser JavaScript (no framework, no build)
- **Source**: `index.html`, `styles.css`, `app.js` (product/spec data, table renderer, interactions); browser checks in `page.test.mjs`
- **Static homepage**: `out/` with `out/preview.png` (1200×900)
- **Publish path**: `pages/product-comparison/Opus-5.5/index.html` (registered disabled in `deploy/config.json`)

## Features

- **Navigation:** sticky nav with "Compare" active, wishlist and cart badges, and an Account dropdown. On mobile: logo, search, cart and hamburger.
- **Page header:** breadcrumb and title, with "Edit comparison" (pick 2–3 products) and Share (copies a `?compare=` URL that the page reads on load).
- **Comparison table:** a data-driven, accessible table (role=table) with a 200px label column.
  - Header row: 200px product art, ratings, prices with strikethrough, purple Add to Cart and color swatches (selected color shown and used for the art); remove buttons.
  - The Quick Verdict row sits directly under the header.
  - 17 spec rows in four groups with ✓/✗ cells, alternating backgrounds and computed green "Best" highlights.
- **Controls:** "Compare at a glance" toggle (hides identical rows) and spec-group chips.
- **Compact sticky bar:** name, price and Add to Cart per product, shown after you scroll past the header.
- **Ratings:** "How They Rate" brand-colored bars animate in, with trophy markers on category winners (ties included).
- **Reviews and recommendations:** pros and cons, expert mini-reviews with dialogs, buyer quotes, Best For cards, a one-open-at-a-time FAQ and a cross-sell carousel.
- **Footer:** newsletter form and payment marks.
- **Mobile:** the table scrolls horizontally with a sticky label column, one product at a time with arrows and swipe. The compact bar and bottom sticky Add to Cart follow the current product. All targets, including swatches, are 44px.

## Mocks and limitations

- **Sample content:** specs, prices, ratings, reviews and reviewer names are illustrative sample content from the brief, plus two invented expert reviewers and review text.
- **Products and images:** product names are used descriptively. Images are generic headphone illustrations, not manufacturer photos or logos.
- **Demo store:** cart, wishlist, account and newsletter are demo-only.
- **"Best" logic:** computed by rule (lowest price and weight, highest battery, driver size and Bluetooth version), plus the brief's explicit picks for spatial audio and water resistance. The brief marks both 35mm and 40mm drivers "Best"; the page marks only the largest (40mm). Bluetooth 5.3 is also marked "Best".
- **Emoji:** the brief's trophy emoji is an icon.

## Run and verify

From the repo root, `node out/pages/058-product-comparison/Opus-5.5/page.test.mjs` runs 8 Playwright checks:

- nav and header
- product header row
- verdict placement
- spec values and Best highlights
- glance toggle, chips, edit, remove and share URL
- compact sticky bar and cart
- ratings, pros and cons, reviews, best-for, FAQ, cross-sells and footer
- mobile swipe table, arrows, bottom bar and 44px targets
- no runtime or request errors

Desktop and mobile screenshots were reviewed visually.
