# Iron Tide

- Input: `data\prompts\035-crossfit-gym\035-crossfit-gym.md` and `src\workflows\AI Agent\DESIGN.md` (root `DESIGN.md` absent).
- Actual selected model: **gpt-6.1-sol**; `GPT-6` is only the directory label. Original HTML/CSS/JS static homepage, source in this folder, public assets in `assets\`.
- Features: scaled workout, seven-day keyboard schedule, local reserve/waitlist/intro previews, program dialogs, annual billing, mobile menu, journal/FAQ, community moodboard and original location diagram.
- Static export: `out\`; future public route `pages/crossfit-gym/GPT-6/index.html`. Registration is separate from collection assembly/deployment.
- Completed: `generated`, `preview`, `validated`, `config_added` are true. Registered at weight **1**, `enabled:false`, `deployed:false`; every prior configuration value and ordering was verified preserved. Collection assembly/deployment was not run.
- Checks passed: `node --check out\pages\035-crossfit-gym\GPT-6\app.js`; `node --test out\pages\035-crossfit-gym\GPT-6\page.test.mjs` — **10/10** (9 focused browser subtests plus parent). Five widths (1440/1024/768/390/320), 48px mobile targets, keyboard/touch, unsafe/whitespace input, exact annual math, all schedule/program/info actions, export equality, decoded images/fonts, reduced motion; 29 GETs, zero page/resource/external-request failures or stored data. Receipt: `.checks\validation.json`.
- Actually viewed full-page and first-fold desktop 1440/mobile 390 screenshots and `out\preview.png` (1200×900). Review/fixes: `.checks\visual-review.txt`.
- Preview: `node src\workflows\generate-preview.mjs out\pages\035-crossfit-gym\GPT-6\out`; uses a temporary random-port static server, no build.
- Assets: local Unsplash stock photos, Barlow Condensed/Inter (OFL), Lucide (ISC), original SVG logo/map. Sources/licenses in `assets\CREDITS.txt`.
- Fictional business, people, quotes, prices, hours and availability. No verified rating, certifications, affiliation, transformations, health outcomes, backend, payment, real reservations, accounts or connected social feed. No environment variables. Planner inputs are ephemeral and cleared on close; use invented details.
- Safety adaptations: stock still image rather than video; fictional story concepts rather than unverified before/after results; honest non-affiliate footer; illustrative local map rather than a remote embed. No installs, builds, publication or uploads.
