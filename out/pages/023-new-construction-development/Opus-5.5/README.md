# Ridgeline at Cedar Creek by Crestwood Homes

- **Original prompt**: `data/prompts/023-new-construction-development/023-new-construction-development.md`, combined with `src\workflows\AI Agent\DESIGN.md`
- **Model**: Claude Opus 5.5 (`claude-opus-5-5`), directory `Opus-5.5`
- **Type**: Static HTML/CSS/browser JavaScript (no framework, no build)
- **Source**: `index.html`, `styles.css`, `app.js`, `assets/art.js`; browser checks in `page.test.mjs`
- **Static homepage**: `out/` (same files) with `out/preview.png` (1200×900)
- **Publish path**: `pages/new-construction-development/Opus-5.5/index.html` (registered disabled in `deploy/config.json`)

## Features

- **Navigation:** sticky nav with the roof-peak logomark, phone and tour CTA; hamburger menu on mobile.
- **Hero:** golden-hour community rendering with a "14 Homesites Remaining" badge (pulsing dot) and an animated counter bar.
- **Community:** highlights, photo collage, and a brochure PDF generated in the browser.
- **Floor plans:** filters for bedrooms, a dual square-footage slider, price and stories; on mobile the filters sit in an accordion. The four plan cards have badges.
- **Plan modal:** per-level line-drawn floor plan with room highlighting, room dimensions, included features, customization options and a "Request Pricing" button that pre-fills the contact form.
- **Site plan:** SVG of all 86 lots with exactly 14 available, 23 under contract, 46 sold and 3 model homes.
  - Phase labels and a legend.
  - Under-contract and sold lots show tooltips only.
  - Available lots open a popover with size, orientation, compatible plans, premium features and "Request Info on This Lot".
  - "Check Availability" highlights the lots that fit a plan.
  - On mobile, a lot-card list sorted available-first, plus a scrollable map tab.
- **Model homes:** a drag/keyboard 360°-style panorama tour, in-person tour pre-fill, hours and directions, and a six-photo strip with a lightbox (a swipe carousel on mobile).
- **Standard vs. Premium:** side-by-side comparison (tabbed on mobile) and a spec-sheet PDF.
- **Financing:** incentive cards and a pre-qualification estimator (5.99%, 30-year, 28/43 ratios).
- **Testimonials and contact:** testimonials; a validated contact/tour form with plan checkboxes, intent radios and date; an illustrated map.
- **Footer:** four columns, an accordion on mobile, and a sticky "Schedule a Tour" bar on mobile.

## Mocks and limitations

- All renderings, interiors, the panorama and the maps are original SVG illustrations. There are no photos, Matterport or video embeds, or map tiles.
- These are invented to complete the brief:
  - lot geometry
  - which specific lots have which status
  - lot sizes and premium features
  - room dimensions
  - plan feature lists
  - the third model home
- The contact form, lot requests and pre-qualification are local demos. Nothing is sent, and the estimate is not a credit decision.
- "Get directions" opens an external Google Maps search for the fictional address.

## Run and verify

Serve `out/` from any static server (relative URLs). From the repo root, `node out/pages/023-new-construction-development/Opus-5.5/page.test.mjs` runs 12 Playwright checks at 1440×900 and 390×844 (touch):

- hero and counters
- brochure and spec PDFs (xref validated)
- plan filters and modal
- the 86-lot status counts, popover and tooltip behaviour
- plan-fit highlighting
- tour panorama and lightbox
- pre-qualification
- form validation
- mobile menu, accordions, lot list, tabs and the 44px touch-target minimum
- no overflow, and no runtime, resource or non-GET request errors

Desktop and mobile screenshots were reviewed visually.
