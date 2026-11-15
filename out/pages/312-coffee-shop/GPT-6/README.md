# Groundwork Coffee

Original: `data\prompts\312-coffee-shop\312-coffee-shop.md`; applied `src\workflows\AI Agent\DESIGN.md`. Actual model **gpt-6.1-sol**, label **GPT-6**. HTML/CSS/JS static adaptation using system fonts and original café SVG/CSS artwork. Source lives here; independently served export is `out`; public mapping `pages/coffee-shop/GPT-6/index.html`.

Features: origin selector, takeaway planner with oat surcharge, quantities/removal/reset, group enquiry validation and mobile navigation. Menu, testimonials and origins are illustrative. Browser-only estimates/enquiries send/store nothing; stock, availability, allergens and final prices require café confirmation. Environment variables: none. Framework motion/remote photography adapted to lightweight local graphics and reduced-motion-aware CSS.

Run from root: `node out\pages\312-coffee-shop\GPT-6\verify.mjs`. Export contains HTML/CSS/browser JS/SVG/real preview; QA scripts and metadata remain in source. No build or publication performed.

Actual QA: 35 browser/export assertions and 3 registration/preservation checks passed. Desktop 1200×900 and mobile 390×844 full-page screenshots opened and inspected: Opened desktop and mobile full-page PNGs. Warm cream/espresso palette, café illustration and serif hierarchy are cohesive; menu illustrations, prices and order planner align cleanly. Mobile cards/forms stack without clipping, gallery scroll is contained, and all sections remain readable. Fixed hidden milk label before final passing capture. Evidence: `.checks\qa.json`, desktop/mobile PNGs. Registered disabled/undeployed. No build, install, dist or publication.
