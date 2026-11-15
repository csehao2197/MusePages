# SCOOP

Input: `data\prompts\363-ice-cream-shop\363-ice-cream-shop.md` plus `src\workflows\AI Agent\DESIGN.md`. Actual model `gpt-6.1-sol`; public label `GPT-6`. HTML/CSS/JS here; standalone export `out\`, public path `pages/ice-cream-shop/GPT-6/index.html`.

Original pastel SVG, system serif, searchable nine-flavour menu, vegan-variant filtering, keyboard-accessible eight-segment cup wheel/mobile buttons, three-scoop limit, remove/reset, gift previews and validated event estimates. Shared-kitchen allergy caveat remains visible. Cup prices, location, menu, event packages and gifts are illustrative. No backend, storage, orders, booking, payment or redeemable cards. Framework, remote fonts/photos, automatic rotation and live social feed are outside this static slice.

Serve `out\` with a static HTTP server. QA from repository root: `node out\pages\363-ice-cream-shop\GPT-6\verify.mjs`. No environment variables; no build or publication.

Actual QA: 40 browser/export assertions and 3 registration/preservation checks. Desktop 1200×900 and mobile 390×844 images opened: Viewed desktop and mobile full-page PNGs: warm cream/pastel editorial hierarchy and cone artwork feel cohesive; flavour rows, desktop wheel, mobile selection grid, event cards and gift amounts are aligned and unclipped. Evidence: .checks\qa.json and desktop/mobile.png. Registered disabled/undeployed. No build, install, dist or publication.
