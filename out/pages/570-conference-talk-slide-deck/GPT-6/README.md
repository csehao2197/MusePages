# Ship Small, Sleep Well

- Actual generator: `gpt-6.1-sol`; public model label: `GPT-6`.
- Input: `data\prompts\570-conference-talk-slide-deck\570-conference-talk-slide-deck.md`; design: `src\workflows\AI Agent\DESIGN.md`.
- Original prompt: [VibeFather](https://vibefather.ai/t/conference-talk-slide-deck), mirrored by [liyupi/awesome-vibe-coding-websites](https://github.com/liyupi/awesome-vibe-coding-websites/blob/85431a57f231fa59269dad62c757193d6a3fd0ff/templates/conference-talk-slide-deck/prompt.md).
- Source adaptation and talk copy: CC BY-NC 4.0, attribution retained in `LICENSE.md` and `NOTICE.md`. Fonts and Lucide retain their separate licenses in `licenses\`.

## Implementation

Nine substantive slides in seven types for an invented 20-minute talk by Elena Marsh. Keyboard: arrows, Space/Backspace, Home/End, 1–9, G overview, S speaker notes, Escape close. The overview contains scaled actual slide renders, arrow selection and Enter jump. Code lines step with ↑/↓. Notes contain a complete 20-minute rehearsal outline. Hash deep links work in both directions. Touch the left/right stage halves to navigate. Print handout prints all nine slides, one per landscape page.

All talk and UI copy lives in `content.js`. Browser state is ephemeral; only the hash persists. No backend, forms, API calls, analytics, external assets, environment variables, real conference claims or production deployment functionality.

## Static adaptation and limits

The task authorizes a no-build HTML/CSS/JavaScript adaptation instead of the requested Vite 5/React 18/TypeScript/Tailwind 3.4 project. No framework scaffolding, Motion dependency, build command or hashed bundler output is used. Native DOM rendering, one keydown handler, CSS motion/reduced-motion, modal dialogs, a safe text-node tokenizer, and installed Lucide SVG geometry replace framework components. Source is intentionally readable. Latin self-hosted Fontsource Bricolage Grotesque, Inter, and JetBrains Mono are reused from existing licensed packages. The tiny closing credit follows the prompt’s final, more restrictive credit instruction.

No build, collection assembly, publication or deployment is authorized or performed. Registration is disabled and not deployed. `task\TASK.md` is absent; the explicit one-job instruction supplies the scope.

## Files and validation

Source: this directory. Independent public static copy: `out\` (HTML, CSS, browser JS, fonts, SVG favicon, license notices only).

Run from the repository root with the existing `startPreviewServer` helper in `src\workflows\script\generate-preview.mjs`, passing this model’s `out\` directory. It serves only that static folder at `/pages/conference-talk-slide-deck/GPT-6/index.html`. No dependency installation or build is required.

Private repeatable Playwright checks: `.checks\qa.mjs`; execute `node out\pages\570-conference-talk-slide-deck\GPT-6\.checks\qa.mjs`. Actual results, viewports, assertions, browser errors and screenshots: `.checks\qa.json`, `.checks\desktop.png`, `.checks\mobile.png`. Additional interaction captures and the nine-page PDF are private under `.checks\`. The real homepage preview is `out\preview.png`; workflow digests remain outside public output.

Actual validation passed: 69 recorded assertion groups across 1200×900, 1440×900 and touch-enabled 390×844, all DPR 1. Every slide was checked for horizontal overflow and control/header collisions before and after navigation. Keyboard shortcuts, overlay selection, code focus, note mirrors, hash reloads, invalid hashes, touch halves, focus outlines, reduced motion and native print invocation passed without console, request, resource, HTTP or page errors. Chromium generated an actual nine-page handout PDF.

The real desktop/mobile PNGs, both overview PNGs, code and mobile notes captures were opened and visually reviewed. The review refined wide-screen code spacing and capped overview rows to fit the viewport; typography, alignment, spacing, contrast and mobile controls passed final review. The workflow-generated 1200×900 `out\preview.png` was separately opened and reviewed. Detailed evidence and digests are retained in `.checks\qa.json` and the private coordinator report. Metadata flags reflect only completed gates, never a deployment claim.
