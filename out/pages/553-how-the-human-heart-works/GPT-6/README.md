# Cutaway Lab — How the human heart works

- Actual generator: `gpt-6.1-sol`; public model/directory: `GPT-6`.
- Input: `data\prompts\553-how-the-human-heart-works\553-how-the-human-heart-works.md`, with `src\workflows\AI Agent\DESIGN.md`.
- Source: this directory. Independent static export: `out\`. Private browser evidence: `.checks\qa.json`, `.checks\desktop.png`, `.checks\mobile.png`. Real homepage preview: `out\preview.png`.
- Public path: `pages\how-the-human-heart-works\GPT-6\index.html`. Registration is disabled and not deployed.

## Implementation

The SVG factory uses the specified 1000 × 900 geometry, closed Catmull–Rom splines, chamber anchors, vessel draw order, lung trees, muscle hatch, four valves, conduction segments and 90 particles per live plate. The person's right is on the viewer's left. A pure timing module controls every live chamber, valve, electrical spark, particle and synthesized ECG from one application animation loop. Frozen phase thumbnails use the same factory and model. Rate changes preserve cycle fraction. Hidden tabs do not advance; frame deltas are clamped to 50 ms.

The page includes ten scroll spotlights and a scrubbed blood drop, five held phases with Previous/Next/Back to live, synchronized native rate sliders and computed duration bars, focus/hover/tap trace highlights, live valve closeups and native classroom disclosures. Reduced motion holds mid-ejection, hides particles, draws two static beats and exposes hero phase controls.

This is the authorized **build-free HTML/CSS/native JavaScript adaptation** of the requested Vite 5/strict TypeScript project. No Vite or TypeScript build, `dist\`, backend, APIs, sensor data or mock backend exists. Modules are browser-ready JavaScript rather than `.ts`; all explanatory copy, links and labels are centralized in `content.js`. GSAP and ScrollTrigger are locally hosted and used only for scroll/reveal behavior, not the beat clock. Individual Lucide icon data is reused from the installed `lucide-react` package rather than adding React to the browser. Fonts are self-hosted Gloock, Hanken Grotesk Variable and Martian Mono Variable. CSS font faces replace bundler font imports.

The geometry is a stylized frontal teaching cross-section, not a clinical anatomical atlas. Three-cusp/three-leaflet valves are represented by two leaflets in the slice as specified. The Gaussian ECG and rate formulas illustrate sequencing, not measurements; phase boundaries intentionally use short ramps. Cobalt/scarlet indicate oxygen content, not actual blood colors. No diagnostic or treatment claims are made.

## Running and verification

From repository root, serve only the export with the existing helper:

```powershell
node src\workflows\script\generate-preview.mjs out\pages\553-how-the-human-heart-works\GPT-6\out
```

The helper renders the final model subpath, captures a preview and closes its server. For an interactive local session, call `startPreviewServer` from that module, open its returned `url`, then close its returned server. Private reproducible QA is `.checks\verify.mjs`, run from repository root using `node out\pages\553-how-the-human-heart-works\GPT-6\.checks\verify.mjs`. It uses the existing Playwright Chromium and repository static helpers without production builds. Actual results and visual review are recorded after execution in `.checks\qa.json`.

Verified on 2026-11-16: **38 passing assertion groups**, including 30 pure timing/phase combinations, six duration rows, all five held moments, ten desktop blood-path stops, slider fraction preservation, keyboard controls, touch interactions, disclosure answers, 1200 × 900 and 1440 × 900 desktop, 390 × 844 mobile and reduced-motion mobile. All tested contexts had zero horizontal page overflow and zero HTTP/resource/request/console/page errors. Both final private PNGs were opened and visually reviewed; desktop actions and mobile full trace were refined to fit the first screen. The repository-generated 1200 × 900 preview was also opened: that helper deliberately uses reduced motion, so its real screenshot shows held Ejection and two static beats. Preview/input SHA-256 records remain private. All owned browser/server resources were closed. No build, collection assembly or publication was performed.

## Attribution and license

Original prompt by **VibeFather**, retained non-commercial attribution link: https://vibefather.ai/t/how-the-human-heart-works. Snapshot provenance: https://github.com/liyupi/awesome-vibe-coding-websites/blob/85431a57f231fa59269dad62c757193d6a3fd0ff/templates/how-the-human-heart-works/prompt.md.

The prompt and its adapted text are **CC BY-NC 4.0**: https://creativecommons.org/licenses/by-nc/4.0/. Applicable original license: `data\downloads\github.com\liyupi-awesome-vibe-coding-websites\85431a57f231fa59269dad62c757193d6a3fd0ff\LICENSE`, copied to `LICENSE`. Commercial use requires separate permission/a VibeFather Pro license. Original prompt-specified colophon names are retained as template copy, not a claim that those people implemented or clinically reviewed this adaptation. The actual implementation is generated by the model identified above. See `ASSETS.md` and local asset licenses for fonts, GSAP and Lucide. No third-party images or ECG recordings are used.
