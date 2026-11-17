# Brandly

- Original input: `data\prompts\507-brandly-brand-design-agency\507-brandly-brand-design-agency.md`; design: `src\workflows\AI Agent\DESIGN.md`.
- Actual generator: `gpt-6.1-sol`; public model label: `GPT-6`.
- Source: this directory. Independent static export: `out\`. Public subpath: `/pages/brandly-brand-design-agency/GPT-6/index.html`.
- A cream, black, and sculptural orange single-screen brand studio hero, six distinct brand marks, responsive navigation, project-scope planner, package guide, accessible FAQ, portfolio concept panels, and video pause control.
- Static HTML/CSS/browser JavaScript adapts the requested React/Tailwind implementation without a build or runtime backend. Lucide React icons are rendered to inline SVG using the installed dependency. Inter and Anton are self-hosted Google Fonts under their supplied OFL licenses.
- The CloudFront video has no supplied media-reuse license. It is not downloaded or redistributed. Its role is adapted with an original local ribbon artwork and a muted, looping inline WebM background; no exact visual match to the unspecified original footage is claimed. UI elements do not animate. Reduced-motion users see the still artwork.
- Launch totals, experience, portfolio concepts, package prices, and social-channel descriptions are illustrative prompt/demo content, not verified commercial claims. Account registration and sign-in are disabled and collect no credentials. The project planner runs only in the browser and sends/saves nothing; there is no backend or environment-variable requirement.
- Provenance: RupakThapa/motionsites, commit `f518e5d1f162f7e249e488589c3c5c4ec711522b`. The original MIT notice credits Aayushsoam (2026); retained in `LICENSE`. This provenance does not grant rights to the external video.
- Run static QA from the repository root: `node src\workflows\script\.ai-gpt6-507.mjs qa`. It serves only this static output using the existing preview helper, verifies the real public subpath, video playback, desktop/mobile no-scroll/no-overflow layout, keyboard and project interactions, resources and console errors. Actual evidence: `.checks\qa.json`, `.checks\desktop.png`, `.checks\mobile.png`.
- Preview generation uses `StaticHomepage.ensurePreview` and the existing Chromium screenshot workflow, with 1200 × 900 CSS pixels at DPR 1. Desktop/mobile screenshots are reviewed separately before completion; the private QA record and coordinator report describe the actual results.
- Only disabled deployment registration is authorized. No build, collection assembly, publication, or deployment is performed.

## Verified outcome

Static validation and real Chromium desktop/mobile QA passed at the final public subpath. The actual desktop/mobile PNGs and fresh preview were opened and visually reviewed: full single-screen composition, clear typography and CTA, legible metrics, responsive 3×2 mobile brand grid, no clipping or horizontal overflow. Planner, FAQ, all portfolio/social panels, keyboard focus restoration, account safety, and video pause/play were exercised. Reduced-motion playback is disabled. Browser/server resources were closed. Registration was uniquely verified with `enabled: false`, `deployed: false`; other config entries were unchanged. No build or deployment occurred. See `.checks\qa.json` for assertions and exact viewport measurements.
