# Hand-Drawn Scroll Explainer

Build this website exactly as described below. Replace the [VARIABLES] with your own values; keep everything else.

## Brief
A single-page, scroll-driven explainer for [BRAND] that teaches how [TOPIC] works in six hand-drawn scenes plus a recap. An original stick-figure narrator called [NARRATOR_NAME] stands beside an index card taped to ruled paper. Scroll progress draws every SVG stroke (stroke-dashoffset scrubbed by GSAP ScrollTrigger). It draws the scene's doodle, a highlighter scribble fill, labels with curved arrows, and a speech bubble that writes itself letter by letter. The six scenes follow the six [KEY_PARTS] in order. A closing recap brings all six doodles together into one flow diagram with a hand-drawn CTA. Everything is drawn in code. There are no bitmaps.

- Audience: [AUDIENCE]. The visitor arrives curious and wants to understand a process in about three minutes without reading a textbook.
- Goal: Make the visitor understand [TOPIC] step by step, one idea per scene, and leave with the recap diagram in their head. The CTA invites them to replay the page or print the recap.
- Tone: Warm, playful and plain-spoken, like a friendly older sibling doodling in a notebook. Short sentences, one gentle joke per scene, no jargon unless a label explains it. All copy below is written for the default values. If any variable differs from its default, rewrite every headline, note, bubble, label and recap line to fit the new values, keeping the same lengths and structure. Keep all copy in src/content.ts.

## Stack
- Framework: Vite 5 + TypeScript (vanilla)
- Styling: Vanilla CSS
- Libraries: gsap (core + ScrollTrigger) (GSAP Standard License (free, commercial use allowed)), @fontsource/caveat-brush (OFL-1.1), @fontsource/patrick-hand (OFL-1.1), @fontsource/atkinson-hyperlegible (OFL-1.1), vite (MIT), typescript (Apache-2.0)
- Build: `npm run build` → static files in `dist/`. No backend, no server code, no external APIs.
- Setup:
  - Scaffold with: npm create vite@5 . -- --template vanilla-ts, then delete the starter counter.ts, the starter CSS and the starter SVGs.
  - Install: npm i gsap@3 @fontsource/caveat-brush @fontsource/patrick-hand @fontsource/atkinson-hyperlegible.
  - vite.config.ts: export defineConfig({ base: './', build: { outDir: 'dist', sourcemap: false, minify: true, assetsInlineLimit: 0 } }).
  - File layout: src/content.ts (variables + every piece of copy + the scenes array), src/glyphs.ts (the 12-glyph doodle library), src/narrator.ts (stick figure SVG + pose path data), src/draw.ts (stroke-draw helpers), src/scenes.ts (builds scene DOM and timelines), src/progress.ts (progress trail), src/recap.ts, src/main.ts, src/styles.css.
  - src/content.ts exports VARS = { BRAND, TOPIC, AUDIENCE, KEY_PARTS, NARRATOR_NAME } and a typed scenes array: { id: 1-6, part: string, glyph: GlyphKey, glyphText?: string[], accent: string, title: string, note: string, bubble: string, labels: [{ text, corner: 'tl'|'tr'|'bl'|'br' }, { text, corner }], pose: PoseKey }, plus intro, recap, cheatSheet and footer copy objects. The DOM is built from this file at startup. No copy is hard-coded in index.html.
  - In src/main.ts import '@fontsource/caveat-brush/400.css', '@fontsource/patrick-hand/400.css', '@fontsource/atkinson-hyperlegible/400.css' and '@fontsource/atkinson-hyperlegible/700.css', then import './styles.css'.
  - gsap.registerPlugin(ScrollTrigger). Use gsap.matchMedia() with three conditions: desktop '(min-width: 900px) and (prefers-reduced-motion: no-preference)', mobile '(max-width: 899px) and (prefers-reduced-motion: no-preference)', reduce '(prefers-reduced-motion: reduce)'.
  - draw.ts: prepStroke(path) reads path.getTotalLength(), sets style.strokeDasharray = length and style.strokeDashoffset = length. drawTo(tl, paths, start, dur) adds a tween of strokeDashoffset to 0 with ease 'none', staggered evenly across the paths. Never use the DrawSVG plugin.
  - Call ScrollTrigger.refresh() after document.fonts.ready resolves, and again on a debounced (200 ms) resize.
  - All CSS custom properties (colours, fonts, spacing) live in :root in src/styles.css. All CSS @keyframes (scroll-cue wiggle, wave, blink fallback) also live at the bottom of src/styles.css.
  - index.html: <title>[BRAND] — How [TOPIC] works</title>, <link rel='icon' href='./favicon.svg'>. public/favicon.svg is a 32×32 ink circle scribble with a yellow #FFD84D dot inside.
  - Add a print stylesheet (@media print) that hides the top bar, progress trail, intro and scenes 1–6 and prints only the recap and cheat sheet on white.
  - Write ASSETS.md at the project root listing the three Fontsource font packages (OFL-1.1, source npm) and stating that every illustration is original inline SVG drawn in code.

## Variables
- [BRAND] — Brand / publisher name (default: "Scrawlhouse"). Invented studio or product that publishes the explainer
- [TOPIC] — Process being explained (default: "Photosynthesis"). Any process that splits cleanly into six steps
- [AUDIENCE] — Who it's for (default: "curious kids aged 9–13 and the grown-ups who get asked “but how?”")
- [KEY_PARTS] — Six key parts, in scene order (default: "Sunlight, Leaf, Water, Carbon dioxide, Glucose, Oxygen"). Exactly six, comma-separated. Each becomes one scene. Pick a glyph for each from the glyph library.
- [NARRATOR_NAME] — Narrator's name (default: "Pip")
- [CREDIT] — keep a small "Template by VibeFather" link to https://vibefather.ai/t/hand-drawn-scroll-explainer in the footer (default: yes; delete this line to remove it)

The copy under Pages & Sections is written for the default values. If your values differ, rewrite every headline, paragraph, label and image for them — same length, tone and structure. Layout, colors, type and motion stay as described.
Keep all copy, image paths and links in one content file (for example `src/content.ts`), keyed by section, so the content can be swapped later without touching components.

---
**This is the public part of a VibeFather Pro prompt.** The page sections, layout, motion and asset instructions that make the live demo look the way it does are for Pro members: https://vibefather.ai/templates/hand-drawn-scroll-explainer?utm_source=github&utm_medium=readme&utm_campaign=awesome-vibe-coding-websites&utm_content=pro-prompt
— Prompt by VibeFather · https://vibefather.ai/t/hand-drawn-scroll-explainer · CC BY-NC 4.0 (non-commercial; commercial use needs a VibeFather Pro license) · Request removal: https://vibefather.ai/takedown
