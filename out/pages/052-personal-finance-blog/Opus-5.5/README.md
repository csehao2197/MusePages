# Penny Wise — personal finance blog homepage

- **Original prompt**: `data/prompts/052-personal-finance-blog/052-personal-finance-blog.md`, combined with `src\workflows\AI Agent\DESIGN.md`
- **Model**: Claude Opus 5.5 (`claude-opus-5-5`), directory `Opus-5.5`
- **Type**: Static HTML/CSS/browser JavaScript (no framework, no build)
- **Source**:
  - `index.html`, `styles.css`, `app.js` (articles, calculators and interactions)
  - `assets/art.js`: SVG couch hero, article thumbnails and author portrait
  - browser checks in `page.test.mjs`
- **Static homepage**: `out/` with `out/preview.png` (1200×900)
- **Publish path**: `pages/personal-finance-blog/Opus-5.5/index.html` (registered disabled in `deploy/config.json`)

## Features

- **Navigation:** sticky nav with the serif logo (an upward trend line forms the "W"), six links, a search panel and a pill "Subscribe". On mobile: logo, search and hamburger.
- **Hero:** 55/45 layout with a 52px Lora headline (36px on mobile) and a CTA to the featured guide. The illustration shows a person on a couch with floating chart, piggy bank, coffee and coin icons, plus a "Featured in" trust bar.
- **Featured article:** 40/60 card that opens a reader dialog.
- **Category pillars:** four cards with gradient top borders (2×2 on tablet, 1 column on mobile) that filter the article grid.
- **Latest Articles:** 3×2 grid with 16:9 thumbnails and hover zoom. "View All" shows 10 articles; on mobile, cards are horizontal.
- **Budget calculator:** formats the input and updates an animated SVG donut with Needs, Wants and Savings amounts. It shows the $4,500 placeholder as a muted example and validates input.
- **Newsletter:** dark section with validation, perks and social proof.
- **Free tools:**
  - the Budget Spreadsheet and Net Worth Tracker download real CSV files (with formulas) generated in the browser
  - the Debt Payoff Calculator simulates snowball vs avalanche month by month (interest, months, debt-free date)
  - the footer's "Investment Quiz" gives ordered next steps
- **About and footer:**
  - about section with a 160px portrait, plus "Read My Story" and "How We Make Money" dialogs
  - four-column footer that becomes an accordion on mobile

## Mocks and limitations

- **Sample content:** Sarah Mitchell, her credentials (CFA, JP Morgan), press mentions, reader numbers and the Reddit quote come from the brief and are **illustrative**; the footer says so. Press names are text, not logos.
- **Article content:** article pages are short preview excerpts. Four extra articles fill the topic filters.
- **Demos:** subscriptions send nothing. Contact, RSS and similar links show a notice.
- **Calculators:** budget and debt results are educational estimates (fixed rates, on-time payments), not financial advice.
- **Images:** all images are SVG illustrations.
- **Edits to the brief:**
  - the brief's emoji icons are replaced with line icons
  - the brief's March 8, 2026 date is kept

## Run and verify

From the repo root, `node out/pages/052-personal-finance-blog/Opus-5.5/page.test.mjs` runs 7 Playwright checks:

- nav and hero
- featured card and pillar filtering
- article grid
- budget calculator
- newsletter
- downloads, debt calculator, quiz, about, footer and search
- mobile layout, footer accordion and 44px targets
- no runtime or request errors

Desktop and mobile screenshots were reviewed visually.
