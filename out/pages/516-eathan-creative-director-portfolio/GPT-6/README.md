# Eathan — illustrated creative director portfolio

Actual generator: **gpt-6.1-sol**. Public model label: **GPT-6**.

## Input and provenance

Full original: `data\prompts\516-eathan-creative-director-portfolio\516-eathan-creative-director-portfolio.md`; design guide: `src\workflows\AI Agent\DESIGN.md`.

Prompt source: [frostmute/msites-prompt-collection / 135-eathan-portfolio](https://github.com/frostmute/msites-prompt-collection/blob/d4974f4296e2851e05eabddb9240170cc423dd46/motionsites-prompts/135-eathan-portfolio/working-prompt.md), MIT, copyright © 2026 Nomaan Khan. The accompanying LICENSE preserves attribution. The referenced DigitalOcean cut-out has unverified reuse rights and is neither fetched nor embedded. `portrait.svg` is an original invented character, **not an exact likeness of Eathan**. The composition is an accurately disclosed illustrated adaptation, not pixel-perfect reproduction of the referenced photo.

## Implementation

Source lives in this model folder: `index.html`, `style.css`, `app.js`, `portrait.svg`. Public static export is `out\`; no runtime dependencies, external fonts, APIs, or environment variables.

Deep-space blue, acid-lime typography, an outlined headline, a prominent grayscale original character, a rotating scrambled PURPOSE/IMPACT/INTENT headline, repeating bio reveal, pointer-reactive 15,000-point/530-trace field, and outlined footer marquee. Accessible modal drawer includes project case studies, process, design notes, about, downloadable concept resume, interactive field intensity, and an inquiry form. Native validation, keyboard Escape, modal focus containment/restoration, and reduced-motion support are included.

Authorized build-free adaptation uses HTML/CSS/browser JavaScript and Canvas rather than React/Vite/TypeScript/Tailwind/Framer Motion/Three.js. Font stacks use installed Impact/Arial/system/Consolas fallbacks instead of downloading Anton or other webfonts. Canvas approximates the energy aesthetic; it does not implement exact 3D geometry, additive WebGL materials, bloom, or spring simulation. Bio uses a timed CSS reveal rather than per-character React remounts.

Case studies, profile, and resume are explicitly fictional. Contact prepares a downloadable local text draft; nothing is sent or persisted. No genuine commission, employment, or client metrics are claimed.

## Run and verify

From repository root: `node src\workflows\script\generate-preview.mjs out\pages\516-eathan-creative-director-portfolio\GPT-6\out`.

Preview serves only the export at `/pages/eathan-creative-director-portfolio/GPT-6/index.html`. For interactive browsing, use the exported `startPreviewServer` helper from that module and close the server after use. No build is necessary.

Scoped QA runner: `node src\workflows\script\.ai-gpt6-516.mjs qa` (source preservation and coordinator lock prerequisites apply). Real assertions/results are in `.checks\qa.json`; desktop 1200×900/DPR1 and mobile 390×844/DPR1 screenshots are `.checks\desktop.png` and `.checks\mobile.png`. `out\preview.png` is the real 1200×900 homepage preview. Input and preview SHA-256 records remain private.

QA checks source, independent static resources, HTTP status, visible content, horizontal overflow before/after interactions, errors, project detail navigation, contact preparation, resume, about, process, labs, Escape/focus restoration, and timed headline motion. Both QA screenshots and the preview are visually reviewed before final completion. Registration is disabled and undeployed; no build, collection assembly, publishing, or upload is performed.
