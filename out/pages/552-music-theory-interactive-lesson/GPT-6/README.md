# Overtone Night School

- Original input: `data\prompts\552-music-theory-interactive-lesson\552-music-theory-interactive-lesson.md`; design: `src\workflows\AI Agent\DESIGN.md`.
- Actual generator: **gpt-6.1-sol**; public model directory: **GPT-6**.
- Prompt by [VibeFather](https://vibefather.ai/t/music-theory-interactive-lesson), mirrored by [liyupi/awesome-vibe-coding-websites](https://github.com/liyupi/awesome-vibe-coding-websites/blob/85431a57f231fa59269dad62c757193d6a3fd0ff/templates/music-theory-interactive-lesson/prompt.md). Non-commercial CC BY-NC 4.0; see `LICENSE` and `ASSETS.md`.
- Source: this directory. Independently served static output: `out\`. Intended public path: `/pages/music-theory-interactive-lesson/GPT-6/index.html`. No deployment performed.

## Implementation

A real browser-synthesized two-octave piano, linked intervals and circle of fifths, correctly spelled nine-quality chord builder, three key-relative progressions, four earned wins, shuffled eight-round ear quiz, replayable cheat sheet, course information and native FAQ. Pointer multi-touch/glissando, computer keyboard and focused button/slider keyboard operation are supported. Quiz notes are withheld until answering, including the dock.

The authorized no-build static adaptation uses native browser ES modules and CSS instead of the requested Vite 5 / React 18 / TypeScript / Tailwind / Motion stack. `content.js` holds section copy, musical data and quiz rounds; `theory.js` holds scales and chord spelling; `audio.js` owns the lazy Web Audio engine; `app.js` owns one shared state and generated UI labels. CSS easing approximates circle springs; chord polygons update directly rather than spring-morphing, and score updates are immediate rather than counting up. Public files are readable browser JavaScript, not a minified Vite build. Original licensed photos and self-hosted Fontsource fonts are retained. No backend, forms, APIs, audio samples, analytics, secrets, or runtime CDN dependencies.

The school, instructor, contacts, testimonials and statistics are fictional illustrative content, disclosed on the page. No real booking or enrollment. Progress is session-local. Sound depends on browser/device sound settings.

## Running and verification

Serve only `out\` with the repository `startPreviewServer` helper. From the repository root run `node out\pages\552-music-theory-interactive-lesson\GPT-6\.checks\verify.mjs`. This is browser/static validation, not a build. QA evidence and real desktop/mobile PNGs are private in `.checks\`; `out\preview.png` is the actual 1200 × 900 first-screen collection preview. Final results are recorded in `.checks\qa.json`.

Registration is disabled and undeployed; generation, QA, preview and registration are separately gated in `metadata.json`. Neither `dist` nor `publish` is executed.

Actual validation: 16 browser assertion groups passed at 1200×900 and 390×844, with additional 1440×900, 768px and 320px checks. Audio probes confirmed 440/880 Hz oscillators and a nonzero synthesized waveform, lazy initialization, the 3200 Hz low-pass graph, mute ramps and ten-voice stealing. Tests exercised keyboard/touch/glissando, musical spelling, circle/chord linkage, earned wins, quiz answer privacy and 0/7/8 scores. There were zero HTTP, request, console or page errors and no horizontal overflow. Desktop/mobile first-screen PNGs, mobile quiz feedback and the newly captured 1200×900 preview were opened and visually reviewed for hierarchy, spacing, legibility and responsiveness. Full machine evidence is in `.checks\qa.json`.
