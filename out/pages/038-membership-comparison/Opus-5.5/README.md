# Kinetic Fitness Club — membership comparison page

- **Original prompt**: `data/prompts/038-membership-comparison/038-membership-comparison.md`, combined with `src\workflows\AI Agent\DESIGN.md`
- **Model**: Claude Opus 5.5 (`claude-opus-5-5`), directory `Opus-5.5`
- **Type**: Static HTML/CSS/browser JavaScript (no framework, no build)
- **Source**:
  - `index.html`, `styles.css`, `app.js`
  - `assets/art.js`: facility illustrations and location map
  - browser checks in `page.test.mjs`
- **Static homepage**: `out/` with `out/preview.png` (1200×900)
- **Publish path**: `pages/membership-comparison/Opus-5.5/index.html` (registered disabled in `deploy/config.json`)

## Features

- **Promotion banner:** dismissible "first month FREE" banner.
- **Hero:** trust badges and a Monthly/Annual toggle that reprices the cards, the table header, the mobile bar, the calculator and the join wizard.
- **Plan cards:** four tiers with the brief's features. The "Most Popular" Standard card is raised and uses the primary button.
- **Comparison table:**
  - the brief's feature matrix plus an "All 3 Locations" row
  - check and X marks, with the Standard column highlighted
  - on desktop, a sticky header with names, prices and Join buttons pins under the nav
  - on mobile, the table scrolls sideways with a sticky feature column
- **Classes:** per-tier list with included or locked classes and "Popular" flags, plus a weekly schedule preview that marks what each tier includes.
- **Facility access:** eight illustrated areas with icons. Picking a plan greys out the areas it doesn't include.
- **Add-ons:** five add-ons with a live estimate of monthly and one-time costs. Towel service counts as included on Premium and Elite.
- **Other sections:**
  - testimonials by tier
  - one-open FAQ
  - five special offers
  - the guarantee band
  - the four-step "what to expect" flow
- **Location selector:** three clubs with an illustrated map.
- **Join wizard (four steps):** plan, start date (within 30 days, plus home gym), a $0-today payment step (demo) and orientation, ending in a welcome summary.
- **Final CTA:**
  - day-pass and tour dialogs
  - phone number
  - an advisor chat demo with canned answers
- **Mobile bar:** sticky "Join Now" bar.

## Mocks and limitations

- **Invented brand:** the brief names no gym, so "Kinetic Fitness Club" (Denver, three locations), its ratings and award, member quotes, schedule and phone number are invented; the footer says so.
- **Annual pricing:** the brief's annual prices ($24/$39/$65/$125) save 16–20%, not exactly 20% on every tier. The toggle says "Save up to 20%" and each card shows its actual saving.
- **Elite guest passes:** the cards follow the brief and only inherit Premium's 2/month, while the table lists the brief's 4/month for Elite.
- **Images:** facility "photos" and the map are original SVG illustrations, not a live map.
- **Demos:**
  - the join flow, payment, passes, tours and chat send nothing and charge nothing
  - "View Full Schedule" shows a notice
- **Mobile table:** the plan header doesn't pin vertically, because the table scrolls horizontally; the feature column stays pinned instead.

## Run and verify

From the repo root, `node out/pages/038-membership-comparison/Opus-5.5/page.test.mjs` runs 8 Playwright checks:

- hero, cards, annual toggle and promo dismissal
- comparison table and sticky header
- classes and facility filtering by tier
- add-on totals
- testimonials, FAQ, offers, guarantee, flow and locations
- the full join wizard
- day pass and chat
- mobile layout, sticky bar and 44px targets
- no runtime or request errors

Desktop and mobile screenshots were reviewed visually.
