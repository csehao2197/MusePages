# Street Burgers

Original: `data\prompts\348-food-truck\348-food-truck.md`; `src\workflows\AI Agent\DESIGN.md` applied. Actual **gpt-6.1-sol**, label **GPT-6**. HTML/system condensed display font and original truck/burger SVG. React/motion/photo briefs adapted without build or external assets.

Source is this folder; export `out\`, public entry `pages/food-truck/GPT-6/index.html`. Includes saffron night-street hero, floating top-picks card, category links, three signature burgers, day-filtered route with Monday empty state, 13 searchable menu items, quantity/removal tray and stop-prefilled local order review.

Concept schedule shows only the three supplied locations; no live GPS, opening status, invented stops, ratings or sales totals. Food artwork has labelled tonal variations. Dietary descriptions are not allergen guarantees. Tray clears on reload; review sends nothing, charges nothing and starts no kitchen preparation. No backend, storage or environment variables.

Serve `out\` through static HTTP. Repository root: `node out\pages\348-food-truck\GPT-6\verify.mjs`. Actual browser/image QA below. No build, installation or publication.

QA revision: original-art loading assertion caught a malformed SVG closing tag. Corrected the tag and reran both viewport suites successfully.

Verified: 50 browser/export assertions and 3 registration/preservation checks. Desktop 1200×900 and mobile 390×844 screenshots opened: Opened final desktop and mobile full-page PNGs after truck SVG correction. Strong condensed saffron street-food hierarchy, clear truck and burger artwork, aligned menu pricing and route cards. Mobile top-picks card, tray and stacked menu remain readable and unclipped. Evidence: .checks\qa.json and desktop/mobile.png. Registered disabled/undeployed. No build, install, dist or publication.
