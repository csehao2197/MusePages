# Keystone Realty Group home valuation page

- **Original prompt**: `data/prompts/020-home-valuation-landing-page/020-home-valuation-landing-page.md`, combined with `src\workflows\AI Agent\DESIGN.md`
- **Model**: Claude Opus 5.5 (`claude-opus-5-5`), directory `Opus-5.5`
- **Type**: Static HTML/CSS/browser JavaScript (no framework, no build); everything is in `index.html`, `styles.css` and `app.js`
- **Source**: `index.html`, `styles.css`, `app.js`; browser checks in `page.test.mjs`
- **Static homepage**: `out/` (same files) with `out/preview.png` (1200×900)
- **Publish path**: `pages/home-valuation-landing-page/Opus-5.5/index.html` (registered disabled in `deploy/config.json`)

## Features

- **Hero:** 50vh on a house-line pattern, with a rounded 60px address bar, trust badges and social proof.
- **Address autocomplete:** keyboard navigable, over 60 sample addresses in Springfield, Riverside and Oakwood, OR. Address validation.
- **Instant estimate report:**
  - Deterministic per address: the same address always gives the same result.
  - Range bar with estimate marker, confidence (High for matched records, Medium otherwise), and six property factors.
  - 12-month trend sparkline and three nearby comparable sales.
  - CTAs to request a CMA or email the report.
- **Sample report:** shows exactly the prompt's data with a "Sample Report" badge; scrolls horizontally on mobile.
- **Three-step process:** dashed connectors, becoming a vertical timeline on mobile.
- **Market snapshot:** four stat cards (2×2 on mobile) and an accessible area chart of the median price with hover and keyboard tooltips.
- **Trust and reviews:** points with an illustrated team photo; testimonials.
- **CMA form:** the address is pre-filled from the latest estimate until edited; validation and a confirmation.
- **FAQ:** one answer open at a time.
- **Closing banner and footer:** gradient banner with a second address bar, then the footer with Equal Housing Opportunity statement and licensing.
- **Mobile CTA:** floating "Get Your Estimate" button that hides over the hero, CMA and banner, and focuses the address field.

## Mocks and limitations

- The estimate is an illustrative, deterministic model over sample addresses, not a real AVM, MLS or Google Places lookup. Market figures come from the prompt; the 12 monthly chart points are illustrative.
- The team photo is an original SVG illustration. The Equal Housing mark is a simple drawn icon.
- The CMA request and "email report" are local demos; nothing is sent.

## Run and verify

Serve `out/` from any static server (relative URLs; works under `/pages/home-valuation-landing-page/Opus-5.5/`). From the repo root, `node out/pages/020-home-valuation-landing-page/Opus-5.5/page.test.mjs` runs 9 Playwright checks at 1440×900 and 390×844 (touch):

- sample data
- address validation
- keyboard autocomplete to estimate, with CMA pre-fill
- deterministic and medium-confidence estimates
- banner form
- chart keyboard tooltip
- FAQ
- CMA confirmation
- mobile layouts and floating CTA
- no overflow, and no runtime, resource or non-GET request errors

Desktop and mobile screenshots were reviewed visually.
