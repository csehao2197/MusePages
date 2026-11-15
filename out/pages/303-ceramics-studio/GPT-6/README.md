# Clay & Form

HTML static adaptation using `data\prompts\303-ceramics-studio\303-ceramics-studio.md` and `src\workflows\AI Agent\DESIGN.md`. Actual model `gpt-6.1-sol`; label `GPT-6`. Source here, standalone export `out`, public path `pages/ceramics-studio/GPT-6/index.html`.

Original textured SVG vessel still life, CSS workshop studies, serif clay-accent split hero, collection enquiries, eight sample sessions with class/availability filters, capacity-aware workshop planner and contextual commissions.

Serve `out` over HTTP. Root QA: `node out\pages\303-ceramics-studio\GPT-6\verify.mjs`. Schedule is fixed demonstration data for early 2027; form makes an in-memory plan only. No bookings, payments, stock or email transmission. Collection and commission links open the visitor's email app. Fictional artist narrative; original art replaces photography. No environment variables, build, install or publication.

Actual QA: 39 browser/export assertions plus registration/preservation checks. Desktop 1200×900 and mobile 390×844 full-page screenshots were opened and inspected: Viewed desktop and mobile full-page PNGs. Tactile original vessel artwork, clay headline rule, ceramic studies and serif scale are cohesive. Schedule controls and disabled full states align; mobile art-first order, stacked cards and dark commission section are clean and unclipped. Evidence: `.checks\qa.json`, desktop/mobile PNGs. Registered disabled/undeployed; no build, install, dist or publication.
