# Interactive Science Explainer

Build this website exactly as described below. Replace the [VARIABLES] with your own values; keep everything else.

## Brief
A single-page scrollytelling science explainer titled 'Silence, made of sound', published by the invented magazine [BRAND]. It explains how [DEVICE] cancel [NOISE_SOURCE] in four chapters. (1) Sound as a pressure wave: a sticky live canvas changes state with each scroll step. (2) The anti-noise phase lab: the reader drags a coral anti-noise wave or a 0–360° slider, and the summed wave flattens at 180° while a live readout shows the resulting level. (3) Inside the earcup: a hand-drawn SVG cut-away builds up part by part with numbered callouts. (4) Limits: an animated SVG bar chart of active versus passive cancellation by frequency. A four-question quiz with instant feedback closes the page. Everything is drawn in Canvas 2D or inline SVG. There is no audio, no microphone and no images.

- Audience: [READER]: curious, non-specialist readers who enjoy a well-made magazine feature and learn best by touching the idea, not by reading formulas.
- Goal: Make one idea click: adding a wave that is exactly out of phase with the noise makes the noise disappear. Let readers prove it to themselves with the slider, see where it happens inside the device, and check their understanding with the quiz.
- Tone: Calm, precise, warm, like a good science-magazine feature. Short declarative sentences, no exclamation marks, no hype, no jargon left unexplained. Figure numbers, captions and quiet confidence.

## Stack
- Framework: Vite 5 + vanilla TypeScript
- Styling: Plain CSS (custom properties)
- Libraries: vite (MIT), typescript (Apache-2.0), @fontsource-variable/newsreader (OFL-1.1), @fontsource/ibm-plex-sans (OFL-1.1), @fontsource/ibm-plex-mono (OFL-1.1)
- Build: `npm run build` → static files in `dist/`. No backend, no server code, no external APIs.
- Setup:
  - Scaffold with npm create vite@5 quietwave -- --template vanilla-ts. Add no framework and no runtime libraries beyond the three Fontsource packages.
  - vite.config.ts: base: './', build.outDir 'dist', build.sourcemap false, build.minify true. No plugins.
  - Import fonts in src/main.ts: '@fontsource-variable/newsreader/wght.css', '@fontsource-variable/newsreader/wght-italic.css', '@fontsource/ibm-plex-sans/400.css', '/500.css', '/600.css', '@fontsource/ibm-plex-mono/400.css', '/500.css'.
  - File layout: src/content.ts (every visible string, quiz data and variable values), src/styles/tokens.css (colors, type scale, spacing as CSS custom properties), src/styles/base.css, src/styles/sections.css, src/lib/canvas.ts (DPR-aware canvas setup with ResizeObserver), src/lib/motion.ts (prefers-reduced-motion flag plus lerp/ease helpers), src/figures/pressure.ts (Figure 1), src/figures/phaseLab.ts (Figure 2), src/figures/earcup.ts (builds the SVG for Figure 3), src/figures/bands.ts (Figure 4), src/scrolly.ts (IntersectionObserver step engine), src/quiz.ts, src/main.ts.
  - Define the variables at the top of src/content.ts as a const VARS object (BRAND, DEVICE, NOISE_SOURCE, READER, ISSUE_LABEL) and build every string from it with template literals. If the values differ from the defaults, rewrite the section copy so it reads naturally for the new device and noise source. Keep the structure, step count and quiz length.
  - index.html holds only the semantic skeleton (header, main with section ids hero, chapter-1, chapter-2, chapter-3, chapter-4, quiz, footer). main.ts fills text from content.ts and mounts the figures.
  - Every canvas: set width/height to CSS size × devicePixelRatio (cap DPR at 2), scale the context, redraw on ResizeObserver, and run requestAnimationFrame only while the canvas is on screen (IntersectionObserver), cancelling the frame when it leaves.
  - All keyframes and transitions live in src/styles/sections.css. JS changes state only through data-attributes (data-step, data-active, data-state) and CSS custom properties.
  - public/favicon.svg: a 32×32 square in #F6F2EA with a teal (#1F7A7A) sine wave and a coral (#E0654A) inverted sine wave crossing, and a flat ink (#1B1E23) line through the middle. Link it from index.html. Document <title>: '[BRAND] — How [DEVICE] work'.
  - package.json scripts: dev = vite, build = tsc --noEmit && vite build, preview = vite preview.

## Variables
- [BRAND] — Publication name (default: "Kestrel Review"). The invented magazine that publishes the explainer; shown in the masthead and footer.
- [DEVICE] — Device being explained (plural noun phrase) (default: "noise-cancelling headphones"). Used in the title, dek and chapter copy, e.g. 'How [DEVICE] work'.
- [NOISE_SOURCE] — Steady noise being cancelled (default: "the low hum of a jet cabin"). Lower-case phrase used mid-sentence; should be a steady, low-pitched sound.
- [READER] — Who the piece is for (default: "curious commuters"). Plural noun phrase used in the hero byline and the closing step.
- [ISSUE_LABEL] — Issue / section label (default: "Issue 14 · Acoustics"). Short label in the masthead, next to the brand.
- [CREDIT] — keep a small "Template by VibeFather" link to https://vibefather.ai/t/interactive-science-explainer in the footer (default: yes; delete this line to remove it)

The copy under Pages & Sections is written for the default values. If your values differ, rewrite every headline, paragraph, label and image for them — same length, tone and structure. Layout, colors, type and motion stay as described.
Keep all copy, image paths and links in one content file (for example `src/content.ts`), keyed by section, so the content can be swapped later without touching components.

---
**This is the public part of a VibeFather Pro prompt.** The page sections, layout, motion and asset instructions that make the live demo look the way it does are for Pro members: https://vibefather.ai/templates/interactive-science-explainer?utm_source=github&utm_medium=readme&utm_campaign=awesome-vibe-coding-websites&utm_content=pro-prompt
— Prompt by VibeFather · https://vibefather.ai/t/interactive-science-explainer · CC BY-NC 4.0 (non-commercial; commercial use needs a VibeFather Pro license) · Request removal: https://vibefather.ai/takedown
