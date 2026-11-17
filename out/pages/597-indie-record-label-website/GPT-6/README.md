# Static Bloom Records

- Actual generator: `gpt-6.1-sol`; public model: `GPT-6`.
- Input: `data\prompts\597-indie-record-label-website\597-indie-record-label-website.md`, with the complete shared `src\workflows\AI Agent\DESIGN.md`.
- Original prompt: [VibeFather](https://vibefather.ai/t/indie-record-label-website), collected via [liyupi/awesome-vibe-coding-websites](https://github.com/liyupi/awesome-vibe-coding-websites/blob/85431a57f231fa59269dad62c757193d6a3fd0ff/templates/indie-record-label-website/prompt.md). CC BY-NC 4.0; see LICENSE. Noncommercial demo only.
- Source: this directory. Independent public static files: `out\`. No deployment has been run.

## Implementation

Three English pages: eight seeded SVG sleeves and animated vinyl, five query-routed artist profiles, seven fictional seasonal shows, six vinyl variants, persistent validated local cart with quantity/removal, release filtering/search and an original synthesized listening preview. All artwork is original code; no external runtime requests or recorded music.

The explicitly authorized no-build adaptation uses semantic HTML, CSS and browser ES modules instead of Vite/React/TypeScript/Tailwind/Motion. `content.js` centralizes label data. `lib\cover.js` is the pure mulberry32 cover engine. CSS and IntersectionObserver implement reduced-motion-aware animation. Self-hosted Fontsource fonts and the permitted Lucide icons retain licenses. Public export is `out`, not the original prompt's build-generated `dist`.

The site is fictional: no ticket sales, payments, shipping, accounts, API or backend. Cart only persists locally, has a 99-unit per-variant limit, and can be reset by removing items. The listening player makes original short synthetic sketches in the browser, not artist recordings; audio requires a user gesture and pauses when the page is hidden. Prices, stock descriptions, people and venues are sample copy.

## Run and verify

From repository root, use the existing `startPreviewServer` from `src\workflows\script\generate-preview.mjs` with this model's `out` directory. It serves only static output at `/pages/indie-record-label-website/GPT-6/index.html`. No build, development framework server, environment variables or credentials required.

Actual QA results and viewport evidence are recorded privately in `.checks\qa.json`; desktop and mobile images in `.checks\desktop.png` and `.checks\mobile.png`. `out\preview.png` is the workflow-generated 1200×900 first-screen image; hidden input and preview fingerprints stay outside the export.

## Verified result

The final Chromium run passed 62 assertions at 1200×900, 1440×900 and touch-enabled 390×844, all DPR 1. Checks covered independent public-path loading, deterministic covers, every desktop catalog/mobile shop sleeve reveal, filters/search/empty results, five artist routes and both fallbacks, actual nonzero 18-second audio buffers with a running AudioContext, play/pause/seek/volume, ticket demo disclosure, cart quantities/subtotals/shipping/persistence/removal, keyboard focus trapping/Escape/restoration, malformed storage/denied storage/quantity limits and reduced motion. No HTTP, request, resource, console or page errors occurred; every browser request stayed on the local static server. The initial mobile sleeve-reveal overflow was fixed and reverified before the final pass.

Desktop/mobile homepage and catalog PNGs were opened and visually reviewed for hierarchy, typography, spacing, contrast and responsive geometry. Additional real roster, shop, artist and mobile-cart screenshots and the newly generated `out\preview.png` were opened and reviewed. All owned QA browsers and static servers closed in `finally`. Static validation, input fingerprint and preview fingerprint were verified. Registration is disabled and undeployed; no production build, collection assembly or publication was executed.

Run the retained private check from the repository root with `node "out\pages\597-indie-record-label-website\GPT-6\.checks\qa.mjs"` only when authorized to refresh this result's QA and static export. It is not a build command. Registration and preview finalization use the repository's existing helpers separately.
