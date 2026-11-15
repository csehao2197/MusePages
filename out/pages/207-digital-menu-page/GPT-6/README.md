# Umami House

Input: `data\prompts\207-digital-menu-page\207-digital-menu-page.md` plus `src\workflows\AI Agent\DESIGN.md`. Actual model `gpt-6.1-sol`; label `GPT-6`. Standalone HTML source: `index.html`, `style.css`, `app.js`, local images; export: `out\`.

Rose/cream digital menu, seven categories, intersecting dietary filters, ingredients/allergens, spice/add-on customization, removable basket, live Pacific opening hours, print-to-PDF styles, sharing link and local QR. English/romanized names preserve the collection's English-language requirement instead of a Chinese UI. Fictional menu and prices; basket is in-memory and sends nothing. Local Unsplash photography illustrates serving inspiration rather than exact recipes: IDs 1579871494447-9811cf80d66c, 1563245372-f21724e3856d, 1569718212165-3a8278d5f624, 1467003909585-2f8a72700288, 1512621776951-a57141f2eefd, 1488477181946-6428a0291777 and 1544145945-f90425340c7e. QR from api.qrserver.com encodes only the expected public page URL; that page is not yet published.

Serve `out\` with any static HTTP server. From repo root: `node out\pages\207-digital-menu-page\GPT-6\verify.mjs`. Actual browser evidence: `.checks\qa.json`, desktop/mobile captures. PDF uses browser print. Expected path: `pages/digital-menu-page/GPT-6/index.html`. No environment variables/backend, builds, installs or publication.
