# Clearview Dermatology

Source: `data\prompts\322-dermatology-clinic\322-dermatology-clinic.md` and shared `DESIGN.md`. HTML/CSS/JS by **gpt-6.1-sol**, display **GPT-6**. System serif/sans fonts, original local clinic SVG and schematic map.

Medical/cosmetic tabs, expandable treatment details, 20 condition selectors, location selection, six FAQs, cost enquiry and validated visit preview work in the browser. Neutral information replaces unsupported provider credentials, clinical guarantees and reviews. Locations, fees and practice are illustrative; no real appointments, diagnosis, insurance acceptance or messages.

Serve `out\` locally; from repository root run `node out\pages\322-dermatology-clinic\GPT-6\verify.mjs`. Export: `out\index.html` plus browser assets and preview. Expected path: `pages/dermatology-clinic/GPT-6/index.html`. QA artifacts and scripts remain outside export. Contact data is transient; use fictional details. No environment variables, build, install or publication.

Actual QA: 46 browser/export assertions and 3 registration/preservation checks passed. Desktop 1200×900 and mobile 390×844 full-page screenshots opened and inspected: Viewed both full-page desktop and mobile captures. White/blue-green clinical rhythm, serif hierarchy, arched original studio art and distinct medical/cosmetic controls are clear. Treatment details, condition chips, map and stacked enquiry remain aligned and readable on mobile; fixed CTA does not cover footer content. Evidence: `.checks\qa.json`, desktop/mobile PNGs. Registered disabled/undeployed. No build, install, dist or publication.
