# Olivia — New design era

Input: `data\prompts\501-olivia-bold-uiux-portfolio\501-olivia-bold-uiux-portfolio.md` and `src\workflows\AI Agent\DESIGN.md`.
Actual generator: `gpt-6.1-sol`; public label: `GPT-6`.

Standalone HTML/CSS/JavaScript static adaptation; no framework build was run. Vermilion-orange full-screen portfolio hero, massive condensed typography, original brush-masked vector portrait, ambient name and glow, responsive brand strip, project selector, journal/about/resume panels, real local resume download and validated hire inquiry.

Deviations and limitations: Approved standalone vanilla adaptation of React/Tailwind. No source portrait was supplied; the central portrait is an original stylized SVG illustration with a paint-stroke mask, not a photograph. System condensed/sans fonts replace Anton/Inter. Brand names are illustrative text, not affiliation claims. Resume and contact are fictional local demos; no email is sent. Original local SVG/CSS artwork replaces third-party media with unverified usage rights; locally available system fonts replace remote fonts. No environment variables or runtime backend.

Source: this directory. Independent static export: `out\`. Eventual public path: `pages/olivia-bold-uiux-portfolio/GPT-6/index.html`; registration is disabled and undeployed.

From repository root, run/verify: `node src\tools\page-qa487.mjs out\pages\501-olivia-bold-uiux-portfolio\GPT-6`. Reusable browser assertions: `.checks\verify.mjs`; actual evidence: `.checks\qa.json`, `desktop.png`, `mobile.png`. Browser checks cover 1200×900 and 390×844, public-subpath loading, meaningful interactions, console/resource/HTTP errors and horizontal overflow. Both screenshots require actual visual review before registration. Workflow source/static validation, real 1200×900 preview capture and stage results are recorded independently in metadata and the append-only run log.

Prompt provenance: [Olivia bold UI UX portfolio](https://github.com/RupakThapa/motionsites/blob/f518e5d1f162f7e249e488589c3c5c4ec711522b/prompts/Bold_Portfolio_Hero.md), MIT. Original authors retain their rights; see exported `NOTICE` and `LICENSE`. Prompt licensing does not license referenced third-party media.
