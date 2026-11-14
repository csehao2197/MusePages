# FuelRight Nutrition

Original HTML/CSS/JavaScript concept made by **gpt-6.1-sol**; `GPT-6` is the user-selected directory label. Inputs: `data\prompts\039-nutrition-coaching\039-nutrition-coaching.md` and `src\workflows\AI Agent\DESIGN.md`.

Source is in this directory; clean static export is `out\`, for `pages/nutrition-coaching/GPT-6/index.html`. Serve that directory with any static HTTP server. Website environment variables: none. Local Outfit, Source Sans 3, Lucide icons and stock-image credits/licenses are in `assets\`.

Features: exact monthly/annual pricing, local support-tier/fictional-coach assessment, validated call preview, mobile navigation, accessible native dialogs, FAQ and downloadable sample meal day. Forms remain in memory and clear on close; nothing is sent, stored or booked.

All coaching services, qualifications, client counts and testimonials are illustrative. No recipe library, app, dashboard, clinical analysis, subscription or real consultations are implemented. Health stories are fictional, not evidence or medical promises. The sample is educational, not a dietary prescription; supplied macros imply 2,058 kcal versus the brief's 2,020 kcal, disclosed on-page and in the download. Photos are illustrative, not exact recipes or real coaches.

Validation: JavaScript syntax and all seven browser tests passed, including 1440/1024/768/390/320px, image/font loading, local network/privacy checks, pricing, both forms, download bytes and keyboard/touch controls. Desktop/mobile screenshots and the actual 1200×900 preview were visually reviewed; captures and receipt are in `.checks\`. The test command `node --test out\pages\039-nutrition-coaching\GPT-6\page.test.mjs` requires a live generation-lock owner and matching `MUSEPAGES_GENERATION_SESSION` (test-only).

Registered in `deploy\config.json` with `staticDir: "out"`, disabled and undeployed. Static validation and preview fingerprints are saved. No install, build, dist, publication or upload was run.
