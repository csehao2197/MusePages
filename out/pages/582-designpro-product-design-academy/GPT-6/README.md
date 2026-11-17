# DesignPro

- Actual generator: `gpt-6.1-sol`; public model label: `GPT-6`.
- Original input: `data\prompts\582-designpro-product-design-academy\582-designpro-product-design-academy.md`.
- Design guidance: `src\workflows\AI Agent\DESIGN.md`.
- Source: `out\pages\582-designpro-product-design-academy\GPT-6\`.
- Independent static export: the `out\` subdirectory. Public path: `/pages/designpro-product-design-academy/GPT-6/index.html`.
- Prompt provenance: [RupakThapa/motionsites, pinned original](https://github.com/RupakThapa/motionsites/blob/f518e5d1f162f7e249e488589c3c5c4ec711522b/prompts/DesignPro_Academy.md). MIT, Copyright (c) 2026 Aayushsoam; full original license retained in `LICENSE`.

## Implementation

Full-screen exact-URL video hero, circular logo, desktop pill navigation, mobile menu, oversized blue-white three-second shiny text, enrollment CTA, pause/play, and reduced-motion support. Supplementary editorial sections provide a three-stage curriculum, keyboard-operated tabs, stage-specific practice lessons with reasoning feedback, fictional mentor profiles, a clearly illustrative learner story, and readable journal articles.

Enrollment and contact dialogs validate their fields and display only a local preview. Data remains in page memory; nothing is sent, persisted, reserved, or submitted. Sample lessons issue no certificate. All counts and academy claims are concept copy from or inspired by the prompt, not independently verified.

## Static adaptation and assets

The authorized build-free HTML/CSS/browser-JavaScript adaptation replaces the requested React/TypeScript/Vite/Tailwind/Framer Motion stack. `ShinyText` is represented by `.shiny-text` using an equivalent continuous 100-degree, three-second CSS gradient, not a React component or Framer Motion. Inline SVG paths are from the installed Lucide icon package; no runtime framework dependency is required.

The exact mandatory CloudFront MP4 remains remotely embedded, autoplaying, muted, looping, and inline. It is not downloaded or relicensed. Its availability, browser autoplay policy, playback, and network access remain external dependencies; a black fallback and user-visible accessibility status cover failure. Inter is locally hosted under the SIL OFL; see `assets\OFL.txt`. `NOTICE` retains font, icon, prompt attribution, and third-party media limitations.

## Run and verify

No build, package installation, secrets, environment variables, or backend is needed. From the repository root:

```powershell
node src\workflows\script\generate-preview.mjs out\pages\582-designpro-product-design-academy\GPT-6\out
```

For browsing or automated checks, import `startPreviewServer` from that module and pass the same static directory. It serves only this export at its final public subpath.

Private `.checks\qa.json` records actual static/browser assertions, viewports, errors, screenshot paths, and visual-review status. `.checks\desktop.png` and `.checks\mobile.png` are actual browser captures; `out\preview.png` is the workflow-generated 1200×900 first screen. Input and preview digests are maintained at model root. Read the QA record and metadata for actual completion state; files existing alone do not prove validation.

Final Chromium QA passed 37 verification groups at desktop 1200×900 and mobile 390×844, DPR 1, plus a 320px overflow check. It covered the exact playing video, pause/resume, curriculum tabs, all three sample lessons with incorrect/correct feedback, modal keyboard cycling and Escape/focus return, enrollment validation/editing, contact preview, journal keyboard controls, reduced motion, and overflow before/after interaction. No HTTP, request, console, or page errors occurred. Both actual viewport PNGs and full-page captures were visually inspected: title spacing was refined and desktop/mobile hierarchy, contrast, content spacing, and responsive stacking reviewed. Intermediate QA records retain harness timing issues and the modal focus-cycle fix rather than hiding them.

No production build, gallery assembly, publication, upload, or real enrollment has been performed. Registration, when verified, remains disabled and undeployed.
