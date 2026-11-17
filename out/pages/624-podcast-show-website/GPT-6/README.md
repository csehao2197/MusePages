# Tangent & Tide

- Generator: `gpt-6.1-sol`; public model label: `GPT-6`.
- Input: `data\prompts\624-podcast-show-website\624-podcast-show-website.md`.
- Design: `src\workflows\AI Agent\DESIGN.md`.
- Source: `out\pages\624-podcast-show-website\GPT-6\`.
- Independent static export: the source directory's `out\` folder.
- Public mapping: `pages/podcast-show-website/GPT-6/index.html`.

## Implementation

Four editorial pages: latest episode, eight-record searchable/filterable archive, query-selected episode notes and chapters, and guest/host directory. All pages use the same local content module. Responsive parchment/oxblood design, six exact supplied studio/portrait assets, original deterministic SVG episode covers, local Fraunces/Inter/IBM Plex Mono, and ISC Lucide icons.

The real HTML audio element plays a locally synthesized 24-second mono PCM electric-piano preview only after a user action. Controls use real playback state: pause, seek, speed, mute, volume, and duration-aware skips. The local WAV is fetched into a browser Blob so seeking also works on static hosts without byte-range responses. A 30-second forward skip is correctly disabled for this shorter sample. Full-episode chapter timestamps select reading panels, never falsely seek the preview. The expandable transcript is explicitly a scripted demo text companion, not transcribed speech.

Copy actions copy the current site's show URL. RSS is a local eight-entry demonstration feed. Email validation, storage, confirmation, persistence, and removal operate solely in localStorage. Addresses are never transmitted. People, show, stories, and episode runtimes are fictional; full-length audio and delivery subscriptions do not exist.

## Static adaptation and operation

The authorized build-free HTML/CSS/ES-module adaptation replaces the requested Vite 5, React 18, TypeScript, and Tailwind 3.4 application and `dist` build. It preserves the four explicit file routes, local assets, content data, interactions, and design tokens. Fontsource files are reused from existing licensed packages and self-hosted with `@font-face`, rather than imported by a Vite entry. No installation, build, backend, environment variables, external APIs, or CDN is required.

From the repository root, an existing preview server can serve only this page's `out` directory:

```powershell
node src\workflows\script\generate-preview.mjs out\pages\624-podcast-show-website\GPT-6\out
```

That command captures a real preview and closes its server; it does not deploy. The private `.checks\qa.mjs` uses the existing `startPreviewServer` helper and installed Playwright Chromium to exercise the final public subpath. Run it from the repository root with `node out\pages\624-podcast-show-website\GPT-6\.checks\qa.mjs`.

Regenerate original preview media with `python out\pages\624-podcast-show-website\GPT-6\generate-audio.py`. Source media stays in `public`; the completed static copy includes only HTML/CSS/browser modules, required media/fonts, RSS, favicon, and license notices.

## Verification

Validation status and actual assertions are recorded privately in `.checks\qa.json`; real desktop/mobile captures are `.checks\desktop.png` and `.checks\mobile.png`. Twenty real Chromium assertion groups passed at 1200×900, 1440×900, and 390×844, covering actual audio/time/seek/rate/volume, keyboard controls, all eight episode routes, search/filter combinations and empty states, chapter selection, transcript disclosure, guest links, RSS, local email validation/persistence/removal, clipboard, mobile menu, reduced motion, public size, and overflow before/after interactions. No browser console/page/request/HTTP errors occurred in the final run.

The actual desktop and mobile PNGs were opened and visually reviewed, as were archive, guest, host, notes, and expanded mobile text-companion captures. Fraunces hierarchy, warm image palette, fine rules, readable prose, aligned player, responsive spacing, and mobile studio/play visibility were checked. The complete studio image and main play button fit within the first 844px without hiding intro copy. Initial QA caught and resolved static-host WAV seeking and the chapter scroller's minimum-width overflow; final QA passes include those regressions.

The workflow separately checks source, static resources/subpath, preview PNG and SHA-256 fingerprints, and unique disabled registration. No collection build, publish, or deployment is authorized.

## Attribution and license

Original prompt by **VibeFather**, [Podcast Show Website](https://vibefather.ai/t/podcast-show-website), [CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/). Snapshot: https://github.com/liyupi/awesome-vibe-coding-websites/blob/85431a57f231fa59269dad62c757193d6a3fd0ff/templates/podcast-show-website/prompt.md.

Applicable original license: `data\downloads\github.com\liyupi-awesome-vibe-coding-websites\85431a57f231fa59269dad62c757193d6a3fd0ff\LICENSE`. This is a noncommercial adaptation; commercial use requires independent rights review and the source's applicable Pro license. See `ASSETS.md` and the public `NOTICE.txt`/font/icon license texts. No ownership of VibeFather media is claimed.
