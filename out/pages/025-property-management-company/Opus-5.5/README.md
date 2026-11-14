# Keystone Property Group

- **Original prompt**: `data/prompts/025-property-management-company/025-property-management-company.md`, combined with `src\workflows\AI Agent\DESIGN.md`
- **Model**: Claude Opus 5.5 (`claude-opus-5-5`), directory `Opus-5.5`
- **Type**: Static HTML/CSS/browser JavaScript (no framework, no build)
- **Source**: `index.html`, `styles.css`, `app.js`, `assets/art.js`; browser checks in `page.test.mjs`
- **Static homepage**: `out/` (same files) with `out/preview.png` (1200×900)
- **Publish path**: `pages/property-management-company/Opus-5.5/index.html` (registered disabled in `deploy/config.json`)

## Features

- **Color coding:** blue for owners, emerald for tenants, used throughout.
- **Navigation:** sticky nav with Tenant Portal and Free Rental Analysis CTAs; on mobile, a hamburger menu and a portal icon button.
- **Hero and trust bar:** golden-hour street hero; scrolling trust bar that pauses on hover and is static with reduced motion.
- **Audience cards:** owner and tenant split cards with stats.
- **Services:** six service cards with expandable "Learn More" panels that include a pricing note.
- **Portfolio:** carousel with an Available/Occupied filter. Available units open a listing dialog with "Apply Online"; on mobile the carousel swipes with snap.
- **ROI calculator:** real-time results, described below.
- **Why Keystone and testimonials:** four differentiators and three five-star owner testimonials.
- **Pricing:** three tiers; on mobile the Portfolio tier comes first. Each "Get Started" carries the chosen plan into the analysis form.
- **FAQ:** accordion.
- **Final CTA:** navy grid-pattern section with a validated address/email/phone form and trust badges.
- **Footer:** four columns with service areas, license number, legal links and badges.
- **Tenant portal dialog:** sign-in validation, a rent payment preview and a maintenance request with urgency and a ticket number.
- **Mobile bottom bar:** shows "Free Analysis" on owner sections and "Browse Rentals" on the portfolio section, based on scroll position.

## ROI model and limitations

**ROI figures.** The brief's sample figures are not internally consistent:
- Its revenue ignores the vacancy input.
- Its "+$2,160/year after our fee" never subtracts the fee.

The calculator uses one transparent model:
- current revenue = units × rent × 12 × (1 − vacancy)
- with Keystone = gross × 1.10 market-rent uplift × 98% occupancy
- fee = 8% of collected rent
- net benefit = Keystone revenue − fee − current revenue

The defaults give $19,440 → $23,285, a fee of $1,863, and +$1,982/yr ($165/mo).

**Other limitations:**
- All imagery is original SVG illustration; there are no photos.
- These are local demos, and nothing is sent or charged:
  - analysis form
  - listing applications
  - portal sign-in, payments and maintenance requests
- "View All Properties" and listing details only cover the six sample properties.
- Invented to complete the brief: phone, email, office address, listing addresses, service detail bullets and the per-service pricing notes.

## Run and verify

Serve `out/` from any static server (relative URLs). From the repo root, `node out/pages/025-property-management-company/Opus-5.5/page.test.mjs` runs 8 Playwright checks at 1440×900 and 390×844 (touch):

- hero, trust bar and audience colors
- service expanders
- portfolio filter and listing dialog
- ROI maths
- pricing and FAQ
- analysis form validation and plan carry-over
- tenant portal flows
- mobile overflow, stacking, snap, Portfolio-first order, audience-switching bar and the 44px touch-target minimum
- no runtime, resource or non-GET request errors

Desktop and mobile screenshots were reviewed visually.
