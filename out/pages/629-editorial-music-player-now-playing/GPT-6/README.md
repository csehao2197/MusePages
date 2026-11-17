# Off Hours — Editorial Music Player

- Actual generator: `gpt-6.1-sol`; public model: `GPT-6`.
- Input: `data\prompts\629-editorial-music-player-now-playing\629-editorial-music-player-now-playing.md`; design: `src\workflows\AI Agent\DESIGN.md`.
- Prompt: **Editorial Music Player (Now Playing)** by Superdesign, CC0-1.0. Source: https://github.com/superdesigndev/superdesign-prompts/blob/6c60906945208df5aa2187f19f8ddfe9b2948aa0/prompts/editorial-music-player-now-playing/README.md
- Implementation: standalone HTML, CSS and browser JavaScript. Source is this directory; independent static export is `out\`. No framework, build, backend, credentials, API or remote assets.
- Public path: `/pages/editorial-music-player-now-playing/GPT-6/index.html`. Not built, assembled or deployed.

## Listening room

Cream and forest-green stacked mobile player, coral transport accents, original sunset artwork, local Sora and Inter fonts. Desktop adds editorial margin typography without changing the narrow player.

Four original synthesized instrumental studies (32 / 36 / 40 / 32 seconds) play through a real HTML audio element only after user action. The fictional artist is clearly disclosed. There are no borrowed songs, lyrics, samples or implied streaming-service integrations.

Playback, pause, seek, previous/restart, next, shuffle, repeat-one, volume, mute, queue selection/reordering, saved-track local storage, collapsed player and information dialog are functional. Space toggles playback outside controls; native sliders support arrow keys. This is a homepage listening demonstration, not a catalog, commercial release or streaming backend. Queue order is session-only. Browser/device audio policies can affect physical output and volume.

## Running and verification

From the repository root, `node src\workflows\script\generate-preview.mjs out\pages\629-editorial-music-player-now-playing\GPT-6\out` serves only the static export temporarily and captures the real preview without a build.

Private repeatable QA: `node src\workflows\script\.ai-gpt6-629-check.mjs qa`. Results: `.checks\qa.json`; actual desktop/mobile images: `.checks\desktop.png`, `.checks\mobile.png`. Generated publication preview: `out\preview.png`; input and static/preview digests remain private in this model directory. Validation status and the visual review are recorded only after execution in `.checks\qa.json` and the private coordinator report.

Executed Chromium checks at 1200×900/DPR1 and 390×844/DPR1 passed: actual advancing audio, play/pause, seek, queue changes/reordering/automatic advance, repeat, shuffle, volume/mute, saved persistence, keyboard controls, dialog/collapse, decoded audio duration and nonzero energy, and no horizontal overflow or browser/resource errors. Desktop, mobile and final preview PNGs were opened and visually reviewed. Cream/coral artwork, Sora title hierarchy, centered transport glyphs and forest queue remain clear at both sizes; remaining queue rows are reached by normal vertical scrolling. Audio is fetched into local Blob URLs so seeking works even on static hosts without byte-range support.

## Credits and licensing

Original artwork and synthesized compositions are dedicated to CC0-1.0 for this demonstration. Fonts retain SIL Open Font License notices; Lucide icons retain their ISC/MIT notices. See `assets\NOTICE.txt`, `assets\INTER-OFL.txt`, `assets\SORA-OFL.txt`, `assets\LUCIDE-LICENSE.txt` and `LICENSE`. Only public runtime files and license notices are exported. No photographs or third-party music are used.
