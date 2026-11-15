# Good Boy Supply Co.

Original: `data\prompts\413-pet-store\413-pet-store.md`; full `DESIGN.md` applied. Actual model **gpt-6.1-sol**, label **GPT-6**. HTML/CSS/JavaScript with chunky system typography, original dog SVG and CSS pet/product/bath artwork. Static adaptation without React build dependencies.

Features: sunny/cobalt waves, hard-shadow pressable controls, four pet categories, searchable/filterable four-item shelf, query-linked product details, self-wash size/price selector, local benefits, Biscuit story, supplied reviews, opening hours, copy-address fallback and full-screen mobile menu. No cart logic. Empty small-pet/bird categories explicitly reflect that the brief supplies only four staff picks. Category counts are fictional, not live stock.

All business/food/product/review claims, address and offers are illustrative. No allergy suitability guarantee, checkout, payment, live inventory, delivery, loyalty account or bath booking. Delivery preview reconciles the brief's three-mile area with its over-£30 threshold. Original illustrations replace photos. No backend, persistence or environment variables.

Source: this folder. Export: `out\`; intended public entry `pages/pet-store/GPT-6/index.html`. Serve here: `python -m http.server 8080 --directory out`. Root verification: `node out\pages\413-pet-store\GPT-6\verify.mjs`. No build, install or publication.

QA repair: bounded clipboard fallback and narrower mobile rotated Polaroid fixed two initial failures; the complete browser checks were rerun. Failure history remains in the append-only run log.

Verified: 40 browser/export checks, 3 registration/preservation checks and 21 final audit checks. Both desktop/mobile PNGs opened and inspected: Opened final desktop and mobile full-page PNGs after clipboard and mobile Polaroid repairs. Sunny yellow/cobalt waves, chunky outlined controls, original pets and product illustrations are joyful and distinct from boarding. Mobile two-column products are legible, rotated art is contained, speech bubbles and hours align cleanly; final checks report no page overflow. Evidence: `.checks`. Registered disabled/undeployed. No build, install, dist or publication.
