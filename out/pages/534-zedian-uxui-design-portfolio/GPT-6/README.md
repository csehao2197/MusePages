# Zedian — UX/UI portfolio

- Actual generator: `gpt-6.1-sol`; public collection model: `GPT-6`.
- Original: `data\prompts\534-zedian-uxui-design-portfolio\534-zedian-uxui-design-portfolio.md`; design guide: `src\workflows\AI Agent\DESIGN.md`.
- Source: `index.html`, `styles.css`, `app.js`. Static export: `out\`. Private browser evidence: `.checks\qa.json`, `.checks\desktop.png`, `.checks\mobile.png`.
- Public route: `/pages/zedian-uxui-design-portfolio/GPT-6/index.html`.
- Prompt source: [Nomaan Khan / frostmute, msites-prompt-collection](https://github.com/frostmute/msites-prompt-collection/blob/d4974f4296e2851e05eabddb9240170cc423dd46/motionsites-prompts/467-zedian/working-prompt.md), MIT; source notice preserved in `LICENSE`.

## Experience

Dark slate, neon-green outlined typography, a floating photographic ID with pointer drag and keyboard control, a selectable 3D project stack with synchronized descriptions and case studies, a project index, six animated process accordions, responsive navigation, and a local project-brief composer. Dialogs support native keyboard focus and Escape. Reduced-motion preferences suppress animation.

## Static adaptation and limitations

The requested React/Vite, Tailwind, and React Framer Motion component structure is adapted to plain HTML/CSS/browser JavaScript to honor the no-build static-homepage authorization. The installed Framer Motion browser DOM runtime drives spring reset (stiffness 600, damping 20), text/scroll/chip and accordion animation. Pointer capture implements constrained drag with 0.2 edge elasticity; this is not React's `motion.div drag` or `AnimatePresence`. CSS provides the 3D deck curve, floating badge, glass surfaces, and responsive styling. Lucide/Feather SVG paths are embedded with license notices. System sans-serif fonts avoid external font dependencies.

Biography, awards, brand identity, case studies, and outcomes are explicitly fictional. The portrait is an Unsplash photographic placeholder, not AI-generated and not the real designer. Three concept projects use locally stored Unsplash placeholders, including two example source assets; image sources and license terms are retained in `out\NOTICE`. The email address is reserved `.example`; briefs are composed in browser memory, not submitted. Social buttons disclose the demo and link to platforms, not invented accounts. No API, backend, analytics, storage, cookies, environment variables, builds, publication, or deployment.

## Run and validate

From the repository root: `node out\pages\534-zedian-uxui-design-portfolio\GPT-6\.checks\qa.mjs`. It uses the installed Playwright Chromium and `startPreviewServer`, serves only `out\` at the actual final model subpath, performs static and desktop/mobile interaction checks, and closes its own server/browser in `finally`.

Validation on 2026-11-15: **76 real assertions passed** in installed Playwright Chromium at desktop 1200 × 900 and touch mobile 390 × 844, both DPR 1, plus reduced-motion mobile. Checks covered successful HTTP, locally loaded images/Motion, English content, overflow before and after interaction, desktop/mobile navigation, mouse/touch elastic badge drag and keyboard spring reset, front/back project cards, keyboard dots, project index and case studies, accordion expansion/collapse, native form validation, local brief generation, real clipboard copying, email draft contents, social/credit disclosures, and modal Escape/focus return. No HTTP, resource, request, console, or page errors occurred.

The actual `.checks\desktop.png`, `.checks\mobile.png`, and both work-section PNGs were opened and visually reviewed. Refinements removed a desktop-visible mobile menu and tightened mobile title gutters and badge spacing. An initial QA stability wait on the continuously floating badge was replaced with native scrolling; the final complete QA passed after refinements. The fresh `out\preview.png` was also opened and reviewed: it preserves the actual high-contrast title, photographic badge, button hierarchy, and balanced first-screen composition.

Detailed evidence is in `.checks\qa.json` and `.checks\preview-result.json`. The collection preview is 1200 × 900, with `.generation-input.sha256` and `.generation-preview.sha256` maintained by workflow helpers. Source HTML/CSS/JS and required runtime assets in `out\assets\` form the static adaptation; serve only the actual `out\` export, not the source directory. Registration is disabled and undeployed; no collection build is performed.
