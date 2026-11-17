# Marisol Wave — Slow Static

An English, single-page listening room for a **fictional** ambient soul artist from New Orleans.

## Input and identity

- Original: `data\prompts\625-musician-website\625-musician-website.md`.
- Design: `src\workflows\AI Agent\DESIGN.md`.
- Actual generator: `gpt-6.1-sol`; public model label: `GPT-6`.
- Source: `out\pages\625-musician-website\GPT-6\`.
- Independent static export: the model's `out\` folder, served at `/pages/musician-website/GPT-6/index.html`.
- Prompt source: [liyupi/awesome-vibe-coding-websites, pinned snapshot](https://github.com/liyupi/awesome-vibe-coding-websites/blob/85431a57f231fa59269dad62c757193d6a3fd0ff/templates/musician-website/prompt.md). Prompt by [VibeFather](https://vibefather.ai/t/musician-website), [CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/). Non-commercial use only; commercial use requires the original author's permission/license.

## Features

Amber stage photography, self-hosted Oswald and Work Sans, original vinyl/tote artwork, a real Web Audio loop player, analyser-driven bars, play/pause, seeking, keyboard shortcuts, gain/mute, six album listings, five fictional tour rooms, local show-information dialogs, four merch items, a persistent quantity-aware demo bag, five truthful press-kit previews, three invented quotes, and a device-only email list. Dialogs use native modal focus containment and Escape. Reduced motion disables decorative movement.

## No-build static adaptation

This authorized delivery uses HTML, CSS and browser ES modules, not the requested Vite/React/TypeScript/Tailwind/Motion component tree. No framework scaffolding, installation, production build or `dist` was run. CSS implements the motion; inline SVG paths adapt Lucide icons with the upstream license retained. `content.js` centralizes copy and item data; `player.js` owns the Web Audio graph. The native volume slider replaces the rotating-knob treatment. The tour row height expands for readable venue notes. The mobile hero preserves readable copy and the immediately visible play control. All six exact template photos are local; the fourth merch image is original drawn tote art, with the room photo retained in Join.

The original deterministic Am-pentatonic sample is generated **once during no-build setup** by `node out\pages\625-musician-website\GPT-6\scripts\make-sample.mjs`. It is 12 seconds, PCM 16-bit, 44.1kHz mono (1,058,444 bytes), with sine plucks, a soft kick and filtered noise. The inherited “build-generated” UI label refers to this generated asset; no build was performed. No third-party recordings, lyrics or artist likenesses are used. Playback starts only following a user action and fetches only the local WAV.

## Run and verify

From the repository root:

```powershell
node src\workflows\script\generate-preview.mjs out\pages\625-musician-website\GPT-6\out
node out\pages\625-musician-website\GPT-6\.checks\qa.mjs
```

The QA script uses installed Playwright Chromium and `startPreviewServer`, serving **only** the static export at its final public subpath. No framework runtime or environment variables are needed. Do not use `file://` for ES modules/audio.

Private evidence is in `.checks\qa.json`, `.checks\desktop.png`, `.checks\mobile.png` and interaction screenshots. Actual Chromium QA passed 28 assertion groups at 1200×900 and 390×844, with an additional 1440×900 layout check and denied-storage case. Tests verified real decoded WAV playback and analyser output, looping, keyboard transport, volume/mute, bag arithmetic and persistence, all five press previews, tour states, mobile menu, email validation/forgetting, reduced motion, local images/fonts, and no horizontal overflow before or after interactions. There were no console, page, failed-request or HTTP errors. The first run exposed an over-broad test assumption that hidden mobile lazy images should load; the test now correctly checks displayed images, with the original result retained in `.checks\qa-initial.json`.

The actual desktop/mobile first-screen and full-page PNGs were opened and visually reviewed: stage photography and oversized type form a clear hierarchy, the amber play control is visible on both first screens, player controls and tour rows remain readable, the four-column merch layout becomes a clean single column, and cream/amber contrast, spacing and type are coherent throughout. Final preview review is recorded with the QA evidence. `out\preview.png` is a real 1200×900 first-screen capture maintained by `StaticHomepage.ensurePreview`; digests are outside the public export.

## Honest limits

The artist, album, venues, goods, quotes and outlets are invented. Only the title track plays the original sample; the other five titles are album listings, not false play controls. No calendar dates or years appear in the rendered page. Tour actions offer local information, not ticket sales or booking. Press assets are labeled **placeholder previews**: no fabricated PDF or high-resolution download is offered. Photos retain actual resolutions rather than claiming 3000px masters; the bio preview does not claim complete 60/240-word documents. The displayed contact address is fictional, non-clickable and explicitly not for use.

Email and bag data stay in this browser under `marisol-wave:listener`; joining sends nothing and is not a real subscription. Forgetting the email removes it from the stored state. Storage failures show a warning and keep an in-memory session. Bag capacity is 100 demo items. Checkout and backend services are deliberately absent. No analytics, external scripts/fonts or runtime APIs are used. Only the optional template-credit link leaves the site.

Registration is disabled and undeployed. No collection assembly, publication or upload is authorized. See `ASSETS.md`, `LICENSE` and `NOTICE` for provenance and license details.
