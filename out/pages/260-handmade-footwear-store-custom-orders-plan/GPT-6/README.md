# D’FOOTPRINT Atelier

From this model folder: `python -m http.server 8080 --bind 127.0.0.1 --directory out` serves the site; `node verify.mjs` reruns QA using the batch-local runner in the Schema Studio sibling folder.

HTML frontend from `data\prompts\260-handmade-footwear-store-custom-orders-plan\260-handmade-footwear-store-custom-orders-plan.md` and `src\workflows\AI Agent\DESIGN.md`. Model `gpt-6.1-sol`; display `GPT-6`.

Source: `index.html`, `style.css`, `app.js`; static export: `out\`. Three entry paths, condensed four-step designer, persisted local draft, reference/new-idea checks, fixed edit estimate, size/quantity/date/contact validation, local request conversation, quote/deposit/balance/dispatch preview. Image uploads, real makers, photo approval timers, authentication, email and Paystack are outside this frontend slice. Illustrative pricing; no size surcharge assumed. Contact drafts stay in localStorage until cleared; chat is memory-only.

Serve `out\` with a static HTTP server; public entry `pages/handmade-footwear-store-custom-orders-plan/GPT-6/index.html`. Run the exported `run(page, assert)` in `verify.mjs` with existing Playwright; actual results/screenshots/visual observations are in `.checks\`. No environment variables, builds, installs or publication. Original rights preserved.
