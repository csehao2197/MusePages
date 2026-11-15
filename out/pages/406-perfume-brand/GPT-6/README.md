# Maison Solenne

Source brief: `data\prompts\406-perfume-brand\406-perfume-brand.md`; full `DESIGN.md` applied. Actual model **gpt-6.1-sol**, label **GPT-6**. HTML/CSS/JavaScript, system serif fonts, original bottle SVG and botanical/portrait CSS illustrations; a static adaptation of the requested React/motion presentation.

Features: cinematic hero, four fragrances, notes pyramid, materials, fictional perfumer, discovery set, boutique, responsive menu, query-linked product detail views with correct size/prices, delivery information and validated local newsletter preview. No cart logic. Product links use the same deployable entry with `?fragrance=…`.

Serve `out\` using `python -m http.server 8080 --directory out`. Verify from repository root: `node out\pages\406-perfume-brand\GPT-6\verify.mjs`. Export: `out\`; intended public entry `pages/perfume-brand/GPT-6/index.html`.

All business stories, prices, address and refund offer are fictional brief content. Artwork is illustrative, not product photography or a real person's portrait. Newsletter stays in memory; no purchasing, real appointment, delivery, backend or environment variables. No build or publication.

Verified: 34 browser/export checks, 3 registration/preservation checks and 21 final audit checks. Both desktop/mobile PNGs opened and inspected: Opened both desktop and mobile full-page PNGs. Champagne typography and cinematic amber glass have clear hierarchy; botanical panels and the single ivory perfumer section provide balanced contrast. Mobile fragrance snap row, stacked feature and centered wordmark are contained and legible. Evidence: `.checks`. Registered disabled/undeployed. No build, install, dist or publication.
