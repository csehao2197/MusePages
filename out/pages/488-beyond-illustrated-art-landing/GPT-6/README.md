# Beyond Hero

Input: `data\prompts\488-beyond-illustrated-art-landing\488-beyond-illustrated-art-landing.md` and `src\workflows\AI Agent\DESIGN.md`.
Actual generator: `gpt-6.1-sol`; public label: `GPT-6`.

Standalone HTML/CSS/JavaScript static adaptation; no framework build was run. Orange 120vh hero, four-layer BEYOND lettering, original blue-braided character with green turtleneck, sticky type, exact scroll-driven word positions and 18-second seamless marquee.

Deviations and limitations: Requested React/Vite/TypeScript/Tailwind composition is adapted directly to HTML; original illustration is not the referenced 3D photograph or exact proprietary display font. Reduced-motion preference pauses the marquee. Original local SVG/CSS artwork replaces third-party media with unverified usage rights; locally available system fonts replace remote fonts. No environment variables or runtime backend.

Source: this directory. Independent static export: `out\`. Eventual public path: `pages/beyond-illustrated-art-landing/GPT-6/index.html`; registration is disabled and undeployed.

From repository root, run/verify: `node src\tools\page-qa487.mjs out\pages\488-beyond-illustrated-art-landing\GPT-6`. Reusable browser assertions: `.checks\verify.mjs`; actual evidence: `.checks\qa.json`, `desktop.png`, `mobile.png`. Browser checks cover 1200×900 and 390×844, public-subpath loading, meaningful interactions, console/resource/HTTP errors and horizontal overflow. Both screenshots require actual visual review before registration. Workflow source/static validation, real 1200×900 preview capture and stage results are recorded independently in metadata and the append-only run log.

Prompt provenance: [Beyond illustrated art landing](https://github.com/DexZane/awesome-web-prompts/blob/804bf8dd7fa5b23846ea050d754350e3b542db13/prompts/pages/creative/sparkform/prompt.md), MIT. Original authors retain their rights; see exported `NOTICE` and `LICENSE`. Prompt licensing does not license referenced third-party media.
