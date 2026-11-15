# Prestige Properties

Original: `data\prompts\206-realestate-agency-homepage\206-realestate-agency-homepage.md`; design: `src\workflows\AI Agent\DESIGN.md`.
HTML/CSS/JavaScript by actual model `gpt-6.1-sol`, public label `GPT-6`. Source is this directory; standalone export is `out\`.

Coastal luxury homepage with buy/rent, location/type/budget and lifestyle filters, saved homes, image reframing, listing and agent dialogs, testimonials, market report and illustrative valuation. Navy/gold, editorial typography and responsive layouts. Property photo: Unsplash (photo-1600596542815-ffad4c1539a9); monograms stand in for agent portraits. Listings, people, statistics and valuations are fictional; repeated property image uses alternate crops. Contact/map links are explicit external actions. No request is sent.

Run a static HTTP server on `out\`; verify from repository root with `node out\pages\206-realestate-agency-homepage\GPT-6\verify.mjs`. Actual QA is in `.checks\qa.json` and desktop/mobile captures. Reusable lifecycle utility stays outside export.
Expected public path: `pages/realestate-agency-homepage/GPT-6/index.html`. No environment variables, backend, builds, installs or publication.
