# Star Lanes

Original: `data\prompts\290-bowling-alley\290-bowling-alley.md`, read with `src\workflows\AI Agent\DESIGN.md`. Actual model **gpt-6.1-sol**, display **GPT-6**. Standalone HTML/CSS/JS adaptation with system fonts and original SVG alley artwork in place of photography.

Twelve selectable lanes, date/time-dependent sample availability, peak/off-peak pricing, shoe calculation, party-package enquiry and menu/gallery sections. Availability and summaries are browser-only mocks; nothing is reserved, charged or sent. Party estimates exclude tax/extras. No environment variables.

Source here; static export `out\`; eventual public path `pages\bowling-alley\GPT-6\index.html`. Serve with static HTTP; run `node out\pages\290-bowling-alley\GPT-6\verify.mjs`. Local QA evidence in `.checks`. No build, install or publication. Original art/code; source rights retained.

Actual QA: 36 browser/export assertions plus registration/preservation checks. Desktop 1200×900 and mobile 390×844 full-page screenshots were opened and inspected: Opened desktop and mobile full-page PNGs. Midnight teal alley perspective, coral headline and mustard bands create clear retro hierarchy. Lane tiles, party packages, diner menu and opening hours remain readable and contained at 390px; horizontal gallery intentionally scrolls. Evidence: `.checks\qa.json`, desktop/mobile PNGs. Registered disabled/undeployed; no build, install, dist or publication.
