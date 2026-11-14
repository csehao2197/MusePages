# FuelRight Nutrition — nutrition coaching page

- **Original prompt**: `data/prompts/039-nutrition-coaching/039-nutrition-coaching.md`, combined with `src\workflows\AI Agent\DESIGN.md`
- **Model**: Claude Opus 5.5 (`claude-opus-5-5`), directory `Opus-5.5`
- **Type**: Static HTML/CSS/browser JavaScript (no framework, no build)
- **Source**:
  - `index.html`, `styles.css`, `app.js`
  - `assets/art.js`: SVG meal art, result graphics and portraits
  - browser checks in `page.test.mjs`
- **Static homepage**: `out/` with `out/preview.png` (1200×900)
- **Publish path**: `pages/nutrition-coaching/Opus-5.5/index.html` (registered disabled in `deploy/config.json`)

## Features

- **Hero:** split layout with an illustrated meal-prep spread and floating stats, on a white-to-#F0FFF4 gradient. Includes the CTA and three trust badges.
- **Problem → solution:** cards with X icons, then cards with checks, linked by an animated arrow divider.
- **Plans:** three tiers with the Pro tier highlighted. The monthly/annual switch saves 20% ($79 / $143 / $239 per month). "Start Now" collects an email, then starts the assessment.
- **How it works:** four-step timeline alternating left and right (vertical on mobile).
- **Coaches:** four coach cards (2×2) with portraits. "Book a Call" picks a time slot and email.
- **Client results:** three cards with a green left border: a before/after silhouette, a progress chart and a blood-sugar graphic.
- **A Day on the FuelRight Plan:**
  - five-meal timeline with food illustrations
  - daily totals match the brief: 2,020 cal | 141g protein | 198g carbs | 78g fat
  - each meal has a swap button that cycles to an alternative and recalculates the totals and macro bars
- **FAQ:** accordion.
- **Lead capture:** green-gradient email form that opens the assessment.
- **Assessment:** six-step quiz (goal, diet, allergies, cooking time, support level, email) that recommends a plan and matches a coach.

## Mocks and limitations

- **Images:** the food spread, meals, result graphics and coach portraits are original SVG illustrations, not photos.
- **Per-meal macros:** the brief gives only daily carb and fat totals, so the per-meal split was chosen to sum to those totals. The swap alternatives are sample meals.
- **Demos:** the assessment, calls and plan sign-ups send nothing and take no payment.
- **Sample content:** coaches, credentials and client results are illustrative; the page says so, and the footer notes it isn't medical advice.

## Run and verify

From the repo root, `node out/pages/039-nutrition-coaching/Opus-5.5/page.test.mjs` runs 7 Playwright checks:

- hero
- problem/solution
- plans and annual toggle
- timeline, coaches with call booking, and results
- meal swaps and totals
- FAQ, lead form and full assessment
- mobile layout and 44px targets
- no runtime or request errors

Desktop and mobile screenshots were reviewed visually.
