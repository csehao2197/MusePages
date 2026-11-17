# Silence, made of sound

- Actual generator: `gpt-6.1-sol`; public model: `GPT-6`.
- Original: `data\prompts\536-interactive-science-explainer\536-interactive-science-explainer.md`.
- Design: `src\workflows\AI Agent\DESIGN.md`.
- Source: this directory’s `index.html`, `favicon.svg` and `assets\`.
- Static output: `out\`; public path: `/pages/interactive-science-explainer/GPT-6/index.html`.
- Provenance: VibeFather, via `liyupi/awesome-vibe-coding-websites` commit `85431a57f231fa59269dad62c757193d6a3fd0ff`, under CC BY-NC 4.0. See `LICENSE`; non-commercial use only without separate permission.

## Experience

An English magazine feature with four chapters: scroll-responsive pressure/particle canvas; a draggable and keyboard-operable 0–360° phase lab; a progressively revealed hand-drawn SVG earcup; illustrative active/passive frequency bars. Four radio-choice questions give instant explanations, track current correct answers and reset.

The phase lab computes the actual sum of equal-amplitude sine waves. Its residual amplitude is `2|cos(phase/2)|`; level is `20 log10(amplitude)` relative to the original wave. At 180° the ideal result is zero amplitude and negative-infinite dB, explicitly distinguished from real headphone performance. Pressure is proportional to the negative spatial derivative of particle displacement. Air particles oscillate locally while the pressure pattern travels.

## Static adaptation and limits

This authorized no-build adaptation uses browser ES modules instead of the requested Vite 5/TypeScript scaffold. CSS is split into tokens/base/sections; content, figures, canvas lifecycle, scrolly steps and quiz remain separate modules. No packages were installed and no build was run. Fontsource fonts were unavailable locally; Georgia, Segoe UI/Arial and Consolas system fallbacks are used, not network fonts.

All graphics are original Canvas 2D/inline SVG; there are no image assets, audio, microphone access, APIs or backend mocks. Canvas uses capped DPR, ResizeObserver and visibility-gated animation; reduced-motion users get static diagrams. Mobile uses an unpinned single-column figure and accessible explicit step controls, avoiding a sticky figure obscuring short screens. The public prompt does not supply its Pro-only detailed layout/copy; this is an original interpretation of the available specification, not a replica of the private live demo. Frequency values and component geometry are explanatory, not measured specifications.

## Running and validation

From the repository root, preview only the static folder with the existing helper:

```powershell
node src\workflows\script\generate-preview.mjs out\pages\536-interactive-science-explainer\GPT-6\out
```

This captures a preview, not a build or deployment. Private browser QA is stored in `.checks\qa.json`, `.checks\desktop.png` and `.checks\mobile.png`; the reusable one-page check is `.checks\verify.mjs`. Run `node out\pages\536-interactive-science-explainer\GPT-6\.checks\verify.mjs` from the repository root. It serves only this output at its final public subpath and closes owned Chromium/server resources.

Actual browser QA passed 29 recorded checks at 1200×900 and 390×844, plus reduced-motion/DPR2 coverage. Checks include the pressure/displacement relationship, phase sum and decibel states at 0°/90°/179°/180°/360°, pointer/touch dragging, native mobile range tapping, keyboard controls, scroll-driven state changes, cumulative earcup layers, frequency explanations, wrong/correct quiz feedback and reset. All browser resources returned HTTP 200; there were no page, console, request or resource errors, and no horizontal overflow before or after interaction. Owned browsers and preview servers were closed.

The desktop and mobile homepage PNGs and additional phase-lab/earcup/frequency-chart PNGs were opened for visual review. The cream/teal/coral palette, editorial hierarchy and spacing were verified; mobile headline sizing, the earcup control grid and mobile diagram label sizes were refined and the full QA rerun. Actual SVG bar heights were checked against all five data bands. A narrow scroll activation band corrected an initially premature chapter-step switch. These are checks of the real static page, not a production build or hardware performance test.

Final states and preview verification are recorded in `.checks\qa.json`, `metadata.json` and the private coordinator report `src\workflows\script\.ai-gpt6-report-536.json`. Preview is `out\preview.png`; SHA-256 records are private. Registration remains disabled and undeployed. No collection build, publication or remote upload is part of this delivery.
