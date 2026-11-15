# TaskFlow features

Source prompt: `data\prompts\217-saas-features-page\217-saas-features-page.md`; design: `src\workflows\AI Agent\DESIGN.md`. Actual model `gpt-6.1-sol`, display `GPT-6`. HTML/CSS/JavaScript source is here; standalone export is `out`, public path `pages/saas-features-page/GPT-6/index.html`.

Cobalt product-led homepage with draggable/keyboard-operable board moves, task creation, timeline, current-task reports, CSV/Excel export, browser PDF printing, custom-field preview, local document/comments/file selection, use-case tabs and honest trial/integration/demo dialogs.

Run `node out\pages\217-saas-features-page\GPT-6\verify.mjs` at repository root; existing Playwright checks static subpath, interactions and desktop/mobile layouts. `.checks` stores screenshots/results; `out\preview.png` is a real desktop capture. Serve `out` through any static HTTP server.

All work stays in the current browser tab. Presence, organizations, stories, integration catalog, pricing, analytics artwork and security assurances are illustrative; no real multiuser sync, OAuth, uploads, bookings, encryption audit or certification. No environment variables or runtime backend. Builds, installs, dist and publication were not performed.
