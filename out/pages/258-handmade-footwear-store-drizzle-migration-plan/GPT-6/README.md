# Solecraft Schema Studio

From this model folder: `python -m http.server 8080 --bind 127.0.0.1 --directory out` serves the site; `node verify.mjs` reruns read-only static/browser QA and closes its helper.

Standalone HTML/CSS/JavaScript frontend based on `data\prompts\258-handmade-footwear-store-drizzle-migration-plan\258-handmade-footwear-store-drizzle-migration-plan.md` and `src\workflows\AI Agent\DESIGN.md`. Actual model: `gpt-6.1-sol`; display: `GPT-6`.

Source: `index.html`, `style.css`, `app.js`. Features include safety confirmations, schema inspection, existing/fresh baseline selection and guarded simulation. Data and operations are browser-only samples; database access, migrations and backups are not performed. No environment variables.

Static export: `out\`; expected public entry: `pages/handmade-footwear-store-drizzle-migration-plan/GPT-6/index.html`. Serve this folder with a static HTTP server. `verify.mjs` exports reusable Playwright interaction checks; `.checks\evidence.json` records executed checks and image inspection. `.checks\lifecycle.mjs` is the authorized serial-run QA/registration driver, not a published resource.

Desktop/mobile screenshots and real preview accompany validation. Builds, installation and publication are outside this run. Original author rights remain applicable.
