# Forge & Grain

Original: `data\prompts\318-craft-brewery\318-craft-brewery.md`; applied full `DESIGN.md`. Generator **gpt-6.1-sol**, label **GPT-6**. HTML/CSS/JS static adaptation, system serif/sans, original copper-kettle SVG and tap/merch CSS illustrations. Source here, export `out`, public path `pages/craft-brewery/GPT-6/index.html`.

Features: keyboard/touch/hover beer labels, combined style/flavour filtering, archived event disclosures, adult group enquiry validation and total, merch bag with size/removal/reset. Brief’s 2025 events are explicitly historical; no fictional live spaces. Brewery details/prices are illustrative. No bookings, checkout, payments, stock API or shipping. Browser-only forms/bag reset on reload. Environment variables: none. Original artwork replaces photos; reduced motion supported.

Root verification: `node out\pages\318-craft-brewery\GPT-6\verify.mjs`. Export contains homepage/assets/preview. No build/install/publication.

Actual QA: 49 browser/export assertions and 3 registration/preservation checks passed. Desktop 1200×900 and mobile 390×844 full-page screenshots opened and inspected: Viewed both full-page desktop/mobile renders after correcting an escaped ampersand in the copper SVG and rerunning all checks. Warm charcoal, wheat serif headings, copper kettle and six label cards form a coherent brewery identity. Archive dates are clear, merchandise drawings and local bag are balanced, and mobile forms/cards fit without clipping or empty image regions. Evidence: `.checks\qa.json`, desktop/mobile PNGs. Registered disabled/undeployed. No build, install, dist or publication.
