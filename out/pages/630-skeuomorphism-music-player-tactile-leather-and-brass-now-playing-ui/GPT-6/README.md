# RESONANT — The pocket listening room

- Actual generator: `gpt-6.1-sol`; public model label: `GPT-6`.
- Input: `data\prompts\630-skeuomorphism-music-player-tactile-leather-and-brass-now-playing-ui\630-skeuomorphism-music-player-tactile-leather-and-brass-now-playing-ui.md`, with `src\workflows\AI Agent\DESIGN.md`.
- Original prompt: Superdesign team, [source](https://github.com/superdesigndev/superdesign-prompts/blob/6c60906945208df5aa2187f19f8ddfe9b2948aa0/prompts/skeuomorphism-music-player-tactile-leather-and-brass-now-playing-ui/README.md), CC0-1.0. Applicable original license: `data\downloads\github.com\superdesigndev-superdesign-prompts\6c60906945208df5aa2187f19f8ddfe9b2948aa0\LICENSE-DATA`.
- Source: this directory's `index.html`, `styles.css`, `app.js`, and `assets\`. Independent HTML/CSS/JavaScript export: `out\`. No framework, build, backend, environment variables, analytics, external assets or runtime dependencies.
- Public mount: `/pages/skeuomorphism-music-player-tactile-leather-and-brass-now-playing-ui/GPT-6/index.html`. No collection assembly or deployment is performed.

## Experience

A machined graphite chassis encloses original glossy dusk artwork, a grooved vinyl record, amber time display, knurled sliders and a stitched, grained cognac leather transport with a raised brass knob. Desktop presentation adds an editorial listening-room surround; mobile retains the actual pocket player.

Play/pause, native audio seeking, previous/next, shuffle without immediate repeats, single-track repeat, automatic queue advancement, track selection, volume, mute and per-track favorites are functional. Favorites use local storage, with an explicit visit-only fallback. Queue/library, liner notes, music disclosure, current audio download, restart, shortcuts and device information are functional. Native AirPlay is used only when supported; otherwise its limitation is explained, with no fake connection.

The three local WAV files are fetched into browser-owned Blob URLs before playback, retaining real native audio and reliable seeking even on a static server without HTTP Range support. Initial loading does not play audio.

## Audio and limitations

“Resonant Studio” and the release are fictional. All three 36-second WAV tracks are original, locally synthesized instrumental miniatures created for this page, not licensed commercial songs or recorded musicians. No borrowed samples or lyrics. They are intentionally short demonstrators, not a streaming catalog or production audio service. Audio never autoplays on page load. Liner notes replace a lyrics tab because the original audio has no vocals.

All artwork and textures are original CSS/SVG. Lucide icons are distributed under their ISC license (see public `LICENSE.txt`). Inter is used only if locally installed; otherwise system sans-serif. System monospace replaces Share Tech Mono to avoid network/font redistribution dependencies. No remote device discovery, account synchronization, subscription or backend is simulated.

## Run and verify

From the repository root, serve the isolated export with the existing preview helper:

```powershell
node src\workflows\script\generate-preview.mjs out\pages\630-skeuomorphism-music-player-tactile-leather-and-brass-now-playing-ui\GPT-6\out
```

The helper validates/captures a 1200×900 first screen and closes its server. Private browser QA is `.checks\qa.mjs`; run it from the repository root with Node. It starts only an isolated preview server at the final public subpath. Private results and actual screenshots: `.checks\qa.json`, `.checks\desktop.png`, `.checks\mobile.png`. Public preview: `out\preview.png`; input and static/preview digests remain private.

Actual browser verification: 41 assertion groups passed at 1200×900/DPR 1 and touch-enabled 390×844/DPR 1, plus a 320px overflow check. All three recordings decoded into non-silent, unclipped PCM; actual native playback, pause, seek, queue, shuffle, repeat/end advancement, volume, mute, persisted favorites, download, dialogs and keyboard controls passed. Zero HTTP/resource/request/console/page errors in the final run. Browsers and preview servers closed in `finally`.

Four additional real touchscreen checks passed at 390×844: Play tap, queue/track-selection taps, mute tap and pause tap. Evidence: `.checks\touch.json`.

Both real desktop/mobile PNGs were opened and visually reviewed. The warm album artwork anchors the hierarchy; highlights, metal grooves, deep channel shadows and leather stitching give distinct physical material cues. The full mobile player fits the first 844px screen without clipping or horizontal overflow. Bottom labels were enlarged after desktop review. An initial static-server Range/seek issue was fixed by fetching original audio into Blob URLs; modal Tab wrapping was also corrected. The official preview's stricter font check caught a missing optional local font declaration; a regular CSS fallback stack now avoids failed font faces. Initial failure records remain private alongside the final passing QA.

The public preview is generated and fingerprinted by `StaticHomepage.ensurePreview`, then independently opened for final visual review. Registration remains disabled and undeployed; metadata records only verified stages. Physical loudspeaker/headphone listening and native Safari AirPlay are not claimed as tested.
