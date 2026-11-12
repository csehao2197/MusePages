# Verdant Journeys

Original input: `data\prompts\002-eco-tourism-landing-page\002-eco-tourism-landing-page.md`, combined with root `DESIGN.md`.
Authored directly by GPT-6 using actual model **gpt-6.1-sol**. Type: dependency-free HTML/CSS/JavaScript; no build or runtime backend.

## Files and operation

Source: this directory's `index.html` and `assets\`. Static delivery: `out\index.html`, `out\assets\`, and the actual rendered `out\preview.png` (1200 × 900). Open through a static HTTP server; the repository preview workflow starts its own temporary loopback server without `npm start`.

The future publication target is `deploy\dist\MusePages\pages\eco-tourism-landing-page\GPT-6\`; registration defaults to disabled. This task does not publish it.

## Features

Nature-led editorial layout, six filterable trip cards and details dialogs, four snap-scrolling eco-lodges, bounded traveler stepper, distance-based carbon calculator, testimonial carousel with touch/manual navigation and reduced-motion support, illustrative impact counters, subscription feedback, mobile navigation and sticky CTA.

## Validation

`checks.mjs` exercises trip filtering/details, calculator changes and limits, carousel navigation, lodge scrolling and subscription feedback. The session runner validates the exported resources at the actual public subpath, captures a real 1200 × 900 preview, tests desktop/mobile overflow and mobile navigation, and saves browser evidence under `.checks\`. The execution metadata records the actual result; existence of this README alone does not establish a pass.

## Mock data and limits

All trips, reviews, partner relationships, certifications, impact figures and membership claims are fictional demonstration content and are labeled as such. Forms send no data; no booking, payment, subscription, tree planting, offset purchase or audited impact service is connected. The complete 24-trip catalog is intentionally not fabricated: its link explains that only six samples exist.

Carbon estimates support the five listed departure cities, use great-circle round-trip flight distance × 0.115 kg/passenger-km, indicative absorption of 21 kg/tree/year and offset pricing of $20/tonne. These are illustrative assumptions, not professional or lifecycle carbon accounting. Initials replace fictional headshots. Georgia/Arial provide offline serif/sans typography.

Photographs are illustrative, not verified pictures of the named properties. Sources and license information are preserved in `assets\IMAGE-CREDITS.txt`, including the accurately identified Wikimedia orangutan and fjord images with visible attribution and CC BY-SA licenses. Other photos come from the public Unsplash CDN; individual attribution and licensing remain to be independently reviewed before commercial redistribution. This collection grants no additional image rights.

`assets\icons.svg` is generated from the repository's existing Lucide React package (ISC licensed); no package installation or runtime React dependency is required. No environment variables are used.
