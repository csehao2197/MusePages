# D’FOOTPRINT

From this model folder: `python -m http.server 8080 --bind 127.0.0.1 --directory out` serves the site; `node verify.mjs` reruns QA using the batch-local runner in the Schema Studio sibling folder.

HTML storefront slice of `data\prompts\259-handmade-footwear-store-implementation-plan\259-handmade-footwear-store-implementation-plan.md`, with `src\workflows\AI Agent\DESIGN.md`. Actual model `gpt-6.1-sol`; public label `GPT-6`.

Source: `index.html`, `style.css`, `app.js`; independent export: `out\`. Features: original sandal artwork, collection filters, wishlist, bag/removal, nonstacking coupon, checkout preview, size guide and validated duplicate-aware newsletter. State is session-memory only. Prices/ratings/stock are examples. Resend, analytics pixels, payments, shipping and backend remain unconnected. No environment variables.

Serve `out\` through a static HTTP server. Expected entry: `pages/handmade-footwear-store-implementation-plan/GPT-6/index.html`. Reusable Playwright checks: `verify.mjs`; executed assertions and actual desktop/mobile inspection: `.checks\evidence.json`. Preview is a real 1200×900 capture. No builds, installs, dist or publication performed. Original source rights remain applicable.
