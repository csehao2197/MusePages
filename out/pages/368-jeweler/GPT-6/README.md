# Break Surf Co.

Actual original `data\prompts\368-jeweler\368-jeweler.md` requests **Break Surf Co., a surf school**, despite its filename. Implemented the original contents with `src\workflows\AI Agent\DESIGN.md`; input unchanged. Model `gpt-6.1-sol`, label `GPT-6`.

Standalone HTML/CSS/JS with original aerial-ocean SVG and CSS board art. Three lesson levels, seven-day/three-slot timetable, level filtering, disabled full slots, capacity/price calculations, invalid/empty form states and explicit no-reservation result. Source here; export `out\`; expected public mapping `pages/jeweler/GPT-6/index.html` retains the configured original slug.

Serve `out\` by static HTTP; QA `node out\pages\368-jeweler\GPT-6\verify.mjs` at root. System fonts replace external families; illustration replaces photographs. Sample availability and pricing are local mocks; no backend, storage, weather, real credentials/reviews, payment or bookings. No environment variables/build/publication.

Actual QA: 40 browser/export assertions and 3 registration/preservation checks. Desktop 1200×900 and mobile 390×844 images opened: Viewed refreshed desktop and mobile images after fixing synthetic-heavy Impact type. Ocean artwork, condensed headings, level prices and horizontal mobile timetable are now readable and unclipped. Earlier stale-export validation failure retained in append-only log; actual original is surf school despite jeweler filename. Evidence: .checks\qa.json and desktop/mobile.png. Registered disabled/undeployed. No build, install, dist or publication.
