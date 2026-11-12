# Wanderlust Chronicles

Input: `data\prompts\007-travel-blog\007-travel-blog.md` with root `DESIGN.md`. Model label: `GPT-6`; actual generating model: `gpt-6.1-sol`, used directly in the current session.

Standalone HTML/CSS/JavaScript. Source: `index.html`, `styles.css`, `app.js`, and `assets\`. Independent static export: `out\`; no build, dependencies at runtime, environment variables or backend. Serve the export through any static HTTP server. Intended public path: `pages\travel-blog\GPT-6\index.html`.

Features: editorial hero, category filters, recent/popular sorting, twelve sample grid stories (nine initially), local reading-list persistence, edition-wide search, original article-preview dialogs, four Portugal notes, author filtering, responsive navigation and photo gallery, newsletter demo feedback, temporary packing checklist, budget arithmetic, storage clearing and back-to-top.

`checks.mjs` verifies browser interactions at desktop/mobile sizes; `.checks\` holds private screenshots and actual results. The existing static validator and preview workflow check resources at the intended public subpath. `out\preview.png` is the actual 1200 × 900 first viewport. Execution flags in model metadata and the matching option in `deploy\config.json` record verification/registration separately; new registration is disabled and this task does not publish.

Verified 87 browser scenarios across 1440, 1200, 1100, 1024, 768, 390 and 320px, with no runtime/resource errors or page overflow. Actual desktop/mobile screenshots were visually reviewed; dialog focus wrapping and the narrow-phone carousel gutter were repaired during verification.

Authors, biographies, dates, read times, archive counts, audience figures, endorsements and travel claims are fictional design fixtures. Expanded articles are original short previews, not complete reported guides; named venues, offers, prices and itineraries are not verified. Portraits and travel photos are illustrative, sometimes deliberately generic rather than depicting the exact destination or subject in the brief. Source/license notes are in `assets\IMAGE-CREDITS.txt`. No booking, live archive, monthly scheduler, financial recommendation, social feed, RSS, analytics, affiliate, email or payment service is connected.

Search, newsletter and budget calculations stay in the browser; signup does not store or transmit email. Only saved article IDs persist in local storage when available; Cookie Settings can clear them. If storage is unavailable, saves last for the current page session. Local Inter / Playfair Display fonts use SIL OFL; Lucide icons use ISC. License notices ship with the export. Photography retains its source terms; independently verify image reuse rights before redistribution or commercial use.
