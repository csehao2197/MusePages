# Rillcast

- Original input: `data\prompts\617-danmaku-video-platform\617-danmaku-video-platform.md`.
- Generator: actual **gpt-6.1-sol**, public **GPT-6**. HTML/CSS/browser ES modules; source here, static export in `out\`.
- Provenance: [VibeFather](https://vibefather.ai/t/danmaku-video-platform), via [liyupi/awesome-vibe-coding-websites](https://github.com/liyupi/awesome-vibe-coding-websites/blob/85431a57f231fa59269dad62c757193d6a3fd0ff/templates/danmaku-video-platform/prompt.md). Prompt license: [CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/). See `LICENSE.txt`.

## Features

English, responsive discovery feed; search by title, maker or subject; category filtering and sorting; two hash routes. Six original, silent, local Canvas-animated WebM films with matching original thumbnails. The watch page has real play/pause, seeking, keyboard shortcuts, synchronized transform-only lane comments, seekable density map, comment-type and density filters, local timed comment submission, uploader follow, save, share and related films.

Saves, follows, comment preferences and added comments persist in localStorage. Playback position stays in memory. Storage failures fall back to memory; clipboard failures expose a selectable link. Text is escaped and restricted to Latin-script English content. Seeded reactions, makers and view counts are fictional, clearly disclosed demonstration content.

## Scope and adaptations

This is a non-commercial, homepage-collection adaptation, **not** a production social service. There are no accounts, authentication, remote comments, uploads, analytics or backend. Follow/save/comment actions affect this browser only. The original prompt's private Pro sections were not supplied; this work follows only the complete available public brief and makes no exact live-demo fidelity claim.

The authorized no-build static implementation replaces the requested Vite 5 / React 18 / TypeScript / Tailwind stack. `content.js` is the central editorial catalogue and interface copy. `film.js` draws the original scenes with Canvas; the recording process exports actual silent VP8 WebM clips, remuxed with duration and seek cues. The player fully fetches each local clip into a temporary Blob URL so seek works even on static hosts without HTTP Range support; Blob URLs and pending fetches are cleaned up on route changes. The player decodes those local clips rather than presenting a fake player or static image. Danmaku uses the real media clock; paused/seeked video and comments remain synchronized. All source and public assets stay inside this model directory.

Lucide icons are local SVG symbols (ISC). Inter, Space Grotesk and JetBrains Mono are bundled locally as unmodified variable TTFs from the Google Fonts source repository, with full OFL 1.1 notices in `out\assets\`; this replaces unavailable Fontsource packages without installing dependencies. System sans/monospace fallbacks remain usable. No external runtime requests or environment variables are required. WebM playback requires a current compatible browser; there is no audio track.

## Run and verify

From the repository root, use the existing `startPreviewServer` in `src\workflows\script\generate-preview.mjs` with this directory's `out\`. It serves only this static export at `/pages/danmaku-video-platform/GPT-6/index.html`. Do not run a production build. Desktop/mobile browser evidence, actual assertions and screenshot paths are saved in `.checks\qa.json`; see that record for completed checks rather than assuming this README is a test result.

Public export: `out\pages\617-danmaku-video-platform\GPT-6\out\`. Future collection destination, **not deployed by this task**: `pages\danmaku-video-platform\GPT-6\`. The gallery option is registered disabled only after successful static, browser and preview checks.

Private QA includes 1200×900 desktop and 390×844 mobile first-screen screenshots, actual playback/seek/pause/comment synchronization, local persistence, discovery and mobile keyboard checks, no-overflow assertions, network/console/page error capture, and visual inspection of both actual PNGs. Final validation state is recorded in `metadata.json` and the private coordinator report.

2026-11-16 verification: **18 Chromium assertion groups passed**, including decoding/play/seek of all six films, end/replay, synchronized comment motion and paused stability, real timed injection and density totals, reload persistence, mobile touch/keyboard flows, storage/clipboard fallbacks and zero browser/network errors. Desktop and mobile home/watch PNGs were opened and visually reviewed; outline icon rendering and title balance were refined before the passing run. Layout, spacing, hierarchy, contrast, readable primary typography and responsive stacking were accepted. Some secondary editorial metadata is intentionally compact.
