# NHM — Timeless Wonders

- Original input: `data\prompts\583-neo-museum-learning-homepage\583-neo-museum-learning-homepage.md`.
- Actual generator: `gpt-6.1-sol`; public model label: `GPT-6`.
- Source: this directory; independent static export: `out\`.
- Provenance: [Neo Museum prompt by DexZane](https://github.com/DexZane/awesome-web-prompts/blob/804bf8dd7fa5b23846ea050d754350e3b542db13/prompts/pages/website/neo-museum/prompt.md), MIT, copyright 2026 DexZane. Full terms in `LICENSE`.

## Experience

Monochrome museum homepage with the specified NHM polygon wordmark, specimen-led hero, topic exploration, five synchronized collection chapters, a pausable 3.5-second tour, and an evidence lab. Keyboard arrows/Home/End select chapters; native dialogs support Escape and focus restoration. Correct answers unlock local field notes. Notes persist only on this device when browser storage is available and can be cleared.

## Adaptation and limits

This authorized, build-free adaptation uses semantic HTML, CSS and browser JavaScript rather than the requested React 19/Vite 6/Tailwind 4/Motion/TypeScript stack. Lucide SVGs are rendered from the existing dependency. No runtime framework, backend, account, booking, network requests, analytics, environment variables or external fonts are required. Local font fallbacks replace Google-hosted Inter/JetBrains Mono.

The supplied Cloudinary chapter reference returned HTTP 401 during discovery. Original SVG interpretations replace hosted images and video; they are illustrative, not authentic specimens, exact asset replicas, or measured scientific reconstructions. The delayed video and SVG turbulence sand transition are adapted to a delayed specimen reveal and lightweight dissolve. Reduced-motion preferences disable animations and automatic cycling. Educational text distinguishes direct evidence, interpretation and uncertainty. This is a digital learning exhibit, not an operating physical museum.

## Run and verify

From the repository root, serve only this model’s `out\` using `startPreviewServer` from `src\workflows\script\generate-preview.mjs`; it mounts the final `/pages/neo-museum-learning-homepage/GPT-6/index.html` path. No build is needed.

Private verification: `.checks\qa.mjs`, `.checks\qa.json`, `.checks\desktop.png`, `.checks\mobile.png`. Run with `node out\pages\583-neo-museum-learning-homepage\GPT-6\.checks\qa.mjs`. It uses installed Playwright Chromium, real HTTP, desktop/mobile interactions, keyboard, storage, reduced motion, overflow and error checks. See QA JSON for actual results; screenshot visual review is recorded only after opening both images. `out\preview.png` is captured separately by `StaticHomepage.ensurePreview`.

Verified on 2026-11-16: all 22 assertion groups passed at 1200×900 and 390×844, with no horizontal overflow or browser/resource errors. Both homepage PNGs, both additional collection PNGs, and the fresh 1200×900 preview were opened for visual review. Refinements separated the desktop specimen from its information panel, restored word spacing on mobile, and improved dark-section specimen contrast. Artwork remains interpretive rather than photorealistic. The first QA run exposed a screenshot/auto-cycle timing assumption; the test now compares the actual paused chapter, without changing tour behavior.

Registration is disabled and undeployed. No production build, collection assembly, publication or upload is part of this delivery.
