# Lantern Guides

An English, long-scroll visual explanation of next-token generation. Actual generator: `gpt-6.1-sol`; public collection label: `GPT-6`.

## Input and provenance

- Original: `data\prompts\560-how-large-language-models-work\560-how-large-language-models-work.md`.
- Design: `src\workflows\AI Agent\DESIGN.md`.
- Source: https://github.com/liyupi/awesome-vibe-coding-websites/blob/85431a57f231fa59269dad62c757193d6a3fd0ff/templates/how-large-language-models-work/prompt.md
- Prompt by VibeFather, https://vibefather.ai/t/how-large-language-models-work. Adaptation under CC BY-NC 4.0; noncommercial use only. See `LICENSE`.
- Source license snapshot: `data\downloads\github.com\liyupi-awesome-vibe-coding-websites\85431a57f231fa59269dad62c757193d6a3fd0ff\LICENSE`.

## Implementation

Source is in this directory; independent static export is `out\`. All teaching copy, token IDs, map coordinates, attention rows and eight starting probabilities are in `content.js`. `sampler.js` implements Mulberry32, stable temperature-adjusted softmax and cumulative sampling. `app.js` implements eight reversible scroll stages, token selection with causal attention weights, a keyboard-operable temperature slider, reproducible seed-42 draws/reset, persisted theme, recap, glossary and native FAQ disclosure.

All numbers are invented educational data, not actual inference. The 2D map is a cartoon, attention is one illustrative normalized row, and prediction uses only eight fixed candidates. Only one ending token is sampled. No training, backend, external API, model runtime or user-text transmission exists.

## Running and validation

From the repository root, serve the export with the existing `startPreviewServer` from `src\workflows\script\generate-preview.mjs`, or use the preview CLI:

`node src\workflows\script\generate-preview.mjs out\pages\560-how-large-language-models-work\GPT-6\out`

Final subpath: `/pages/how-large-language-models-work/GPT-6/index.html`.

QA is private in `.checks\qa.json`; actual screenshots are `.checks\desktop.png`, `.checks\mobile.png` and interaction screenshots. Chromium testing passed at 1200×900 and 390×844, DPR 1: token fragments/IDs, map coordinates, causal attention selection, temperature math and keyboard input, seeded sampling/reroll/reset, reverse navigation, keyboard FAQ, theme persistence, no horizontal overflow and no HTTP/resource/request/console/page errors. No external requests occurred. Sampler tests cover normalization, deterministic seeds and cumulative boundary values.

Both actual homepage PNGs, the interaction screenshots and the fresh preview were opened for visual review. The warm-paper/forest-green palette, serif hierarchy, original sentence illustration, spacing and responsive typography were reviewed. Mobile navigation was refined so the caption heading starts below the sticky lab, with an explicit browser assertion. `out\preview.png` is the actual 1200×900 first screen maintained by `StaticHomepage.ensurePreview`; input/static/PNG digests were verified. No build was run.

## Authorized static adaptation and limitations

The original requests Vite 5, React 18, TypeScript, Tailwind, GSAP and Fontsource. This authorized no-build adaptation instead uses native HTML/CSS/ES modules, system sans/Georgia/monospace fonts, requestAnimationFrame scroll tracking and reduced-motion CSS. The pinned stage is mixed HTML/SVG, not a GSAP-driven all-SVG transition timeline. Mobile uses a compact sticky lab above scroll captions. The geometric artwork is original CSS/SVG; no demo screenshots or proprietary Pro assets are reproduced. The supplied public prompt does not include the Pro-only layout instructions; this is an independent editorial design, not an exact reproduction of that undisclosed demo.

No dependencies installed, builds, dist, publication or deployment. Registration is disabled and undeployed by default. No environment variables or credentials needed.
