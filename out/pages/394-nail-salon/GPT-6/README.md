# LUNE

Original: `data\prompts\394-nail-salon\394-nail-salon.md`; design: `src\workflows\AI Agent\DESIGN.md`.
Actual generator: `gpt-6.1-sol`; public label: `GPT-6`.

Standalone HTML/CSS/JavaScript adaptation, with system serif fonts and original vector illustrations. Source: this directory; deployable homepage: `out\index.html`; expected public path: `pages/nail-salon/GPT-6/index.html`.

Features: eight services, twelve illustrated studies with dialogs, pricing levels, artist profiles, review controls, FAQ and validated local visit planner. All profiles, reviews, address and prices are sample content. Artwork is illustrative, not client photography. No real appointments, availability, payments, messages or treatment guarantees. No environment variables or backend.

Serve `out` using any static HTTP server. From repository root run `node out\pages\394-nail-salon\GPT-6\verify.mjs`. Export contains only homepage, CSS, browser JS, SVG and real preview. Builds and publication are outside this task.

Verified: 38 browser/export checks + 3 registration/preservation checks. Desktop and mobile images actually opened: Opened desktop and mobile full-page PNGs. Balanced rose editorial hierarchy, clear service rows and readable stacked mobile pricing. Original hand illustration fits the brief; gallery studies and sample artist marks are explicitly illustrative. No clipping, overlap or blank sections observed. Evidence: .checks\qa.json and desktop/mobile.png. Registered disabled/undeployed. No builds, installs, dist or publication.

Final audit: 33 additional fingerprint, export, registration, evidence, console/resource, navigation and responsive checks passed; prompt lock released.
