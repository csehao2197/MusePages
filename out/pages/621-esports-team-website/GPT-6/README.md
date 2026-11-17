# Static Vale

- Actual generator: `gpt-6.1-sol`; public model label: `GPT-6`.
- Original input: `data\prompts\621-esports-team-website\621-esports-team-website.md`.
- Design guidance: `src\workflows\AI Agent\DESIGN.md`.
- Source: `https://github.com/liyupi/awesome-vibe-coding-websites/blob/85431a57f231fa59269dad62c757193d6a3fd0ff/templates/esports-team-website/prompt.md`.
- Prompt by **VibeFather**, <https://vibefather.ai/t/esports-team-website>, **CC BY-NC 4.0**, <https://creativecommons.org/licenses/by-nc/4.0/>. Non-commercial use only; commercial use requires the author's separate permission/license. Original license retained as `LICENSE`; photograph/font/icon credits in `ASSETS.md`.

## Implementation

Static HTML, CSS and browser JavaScript; no build is needed or authorized. Source lives in this model directory; `out\` contains only the independent public website and required assets. `src\content.ts` is the canonical editorial dataset, copied without compilation to `out\content.js`. Six exact supplied fictional team photographs are self-hosted with nine local Fontsource weights. Team slashes, merchandise illustrations, sponsor marks and preparation bracket are original SVG. Lucide icons are rendered from the existing installed package and served locally.

The cinematic homepage includes season stats, three featured players, upcoming/latest matches, fictional sponsors, merchandise and news. Hash routes provide five-player role filtering and player detail sheets with four statistics and recent performances; six fixtures with expandable maps and text-card downloads; six products with category filters, size/quantity selection, persistent cart, two-step local demo checkout and clearable order reference; four complete original articles with category filters and previous/next reading. Native modal dialogs provide focus containment, Escape/backdrop dismissal and focus restoration. Mobile navigation, roster carousel controls and reduced-motion behavior are included.

## Run and verify

From the repository root, use the existing `startPreviewServer` export in `src\workflows\script\generate-preview.mjs` with this model's `out` directory. It serves only static content at `/pages/esports-team-website/GPT-6/index.html`, on loopback with an ephemeral port. Do not serve the source directory.

Private repeatable QA: `node out\pages\621-esports-team-website\GPT-6\.checks\qa.mjs`. It uses installed Playwright Chromium, real assertions and the repository static preview service; its `finally` block closes the owned browser and server. Evidence: `.checks\qa.json`, `.checks\desktop.png`, `.checks\mobile.png`. Final static validation, preview fingerprint and disabled registration use existing repository helpers, not a production build.

Executed on 2026-11-16: 28 assertion groups passed at 1200×900 and 390×844, DPR 1, plus a 1440×900 normal-motion check. Verified route recovery, keyboard player/match controls, role/category filters, downloads and their actual text contents, player statistics, focus containment/restoration, product variants, quantities, persistence, contact validation, two-step checkout, order clearing, article selection, mobile menu/carousel, resource loading and overflow before/after interaction. No request/HTTP/console/page errors occurred in either primary viewport. An initial route-test timing race was corrected; a real mobile footer overflow was fixed and the full checks rerun successfully.

Opened and visually reviewed both fresh primary PNGs and full-page evidence: the supplied arena group remains visible in the first mobile viewport; the oversized condensed/outlined heading, single volt accent, restrained angular panels and four-column stats establish a clear esports hierarchy. Desktop roster alignment, product artwork, mobile carousel peek, stacked fixtures, two-column merchandise, spacing and footer fit were checked. Final screenshots show no horizontal clipping.

## Adaptation and limits

- This authorized no-build adaptation uses native browser modules/CSS/dialog rather than the requested Vite/React/TypeScript compilation, Tailwind and Motion runtime. CSS supplies essential transitions. Public static directory is `out`, not Vite `dist`.
- A fixed, coherent default Static Vale editorial dataset is supplied. No runtime brand-swapping/content-rewriting factory is advertised. Editorial text is centralized in `src\content.ts`; some structural accessibility/control labels and metadata remain in renderer/HTML. This is not a framework template.
- Every roster record, opponent, tournament, statistic, story, partner and product is fictional. Fixtures have no live scores, refreshes or external connection.
- Cart and order reference stay in this browser's localStorage. Checkout validates email/country locally; contact data is used only in transient order review and is not saved with the order. No payment, stock reservation, fulfillment, email or backend exists. Storage-disabled sessions retain an in-memory bag and display a warning.
- Contact addresses use reserved `.example` domains. No remote form submission, analytics, remote runtime assets, real sponsor or real-person likeness is included.
- QA/visual completion is recorded only after actual execution in `.checks\qa.json`; model flags describe actual workflow stages, not production readiness.
- New registration is disabled and undeployed. No collection build, deployment, upload or publication is authorized or performed.
