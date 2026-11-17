# Stillform

A quiet, editorial music-library homepage with three hash views, six original instrumental previews, and synchronized original lyric text.

## Identity and provenance

- Actual generator: `gpt-6.1-sol`; public model label: `GPT-6`.
- Original input: `data\prompts\608-music-streaming-app-with-lyrics\608-music-streaming-app-with-lyrics.md`.
- Design guidance: `src\workflows\AI Agent\DESIGN.md`.
- Prompt: **Music Streaming App with Lyrics**, VibeFather, via [liyupi/awesome-vibe-coding-websites](https://github.com/liyupi/awesome-vibe-coding-websites/blob/85431a57f231fa59269dad62c757193d6a3fd0ff/templates/music-streaming-app-with-lyrics/prompt.md).
- Prompt license: [CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/); commercial use requires the author's separate permission. Original license snapshot: `data\downloads\github.com\liyupi-awesome-vibe-coding-websites\85431a57f231fa59269dad62c757193d6a3fd0ff\LICENSE`.
- Source: this model directory. Static export: `out\`. Local checks and screenshots: `.checks\`, outside the public export.
- Public mount: `pages/music-streaming-app-with-lyrics/GPT-6/index.html`.

## Implementation and limits

The authorized build-free adaptation uses native HTML, CSS, ES modules, and one persistent HTML audio element instead of the requested Vite/React/TypeScript/Tailwind/Motion build. The local Fontsource Fraunces Variable, DM Sans Variable, and IBM Plex Mono fonts and selected Lucide SVGs retain their original licenses. Native dialogs supply modal keyboard behavior. CSS provides reduced-motion-aware transitions. No framework build, install, backend, service, external API, account, analytics, or streaming infrastructure is used.

Library, Charts, and Now Playing share continuous playback. Play/pause, previous/restart, next, actual audio seek, line seek, volume/mute, track search, collection play/save/queue, sample charts, and queue order/removal/clear/restore operate locally. Likes, notes, saves, removed queue entries, queue order, and last track use the guarded `stillform:v1` storage namespace. Reload always restores paused at zero. Confirmed reset clears only this namespace's visitor state. Comments are never submitted to a server. All people, statistics, lyrics, and compositions are fictional original demo content, not live activity.

The six bundled WAVs are original procedural instrumental compositions, **not sung vocals**. The six written lyric lines per track are time-cued companion text at 0/3/6/9/12/15 seconds, driven by actual `audio.currentTime`. Nothing imitates an existing song or records a performer. Browser/device audio permissions, output level, and physical speakers remain outside the page's control. Audio begins only through a visitor gesture or continuation of an already playing queue.

Content is in `content.js`; browser interaction code is in `app.js`; appearance is in `styles.css`. The exact supplied image filenames remain stable while all visible artist/song/playlist proper nouns and lyrics are newly authored for Stillform. All browser resources are local; the optional attribution link is external navigation only.

## Run and regenerate

Serve only `out\` at the public mount above using `startPreviewServer` from `src\workflows\script\generate-preview.mjs` (repository root as workspace). No development server or routing fallback is needed. The index hash routes are `#/`, `#/charts`, and `#/now-playing`; unknown hashes fall back to Library.

Run `node out\pages\608-music-streaming-app-with-lyrics\GPT-6\scripts\generate-audio.mjs` from the repository root to regenerate six deterministic 18-second 22050 Hz mono 16-bit PCM WAVs. It uses only Node built-ins and this page's content data. It does not build the page. Copy changed public resources to the existing static export and repeat static/browser/preview validation.

Private verification entry: `node src\workflows\script\.ai-gpt6-608-qa.mjs`. It serves only this static folder, performs assertions, and closes its own browser/server in `finally`. `.checks\qa.json` is the authoritative detailed result; `desktop.png` and `mobile.png` are actual browser captures. Final validation and visual-review results are recorded below after execution. Registration is disabled and undeployed; no dist, publish, or upload is authorized.

## Verification

Passed 22 recorded verification groups in Chromium at 1200×900, 1440×900, and 390×844 (DPR 1). No HTTP/resource/request/console/page errors or page-level horizontal overflow were observed across all three views before and after interaction. All six tracks were individually played using real decoded WAV audio. A nonzero Web Audio analyser waveform and advancing HTMLAudio currentTime were asserted; this verifies software audio signal, not physical loudspeaker audibility.

Playback/navigation continuity, synchronized and clickable lyrics, keyboard seeking, volume/mute, natural queue advance/final stop/replay, queue edits and focus return, local comments/likes/saves/search, paused reload, confirmed reset, unavailable storage, and reduced motion passed. Both actual desktop/mobile Library PNGs and both additional Now Playing PNGs were opened and visually reviewed. The mobile hero was refined to reveal cover art above the fixed player. The fresh `ensurePreview` 1200×900 first-screen PNG was also opened and reviewed. Static and screenshot SHA-256 fingerprints were verified.

Local WAVs are fully fetched into Blob URLs before playback, so seeking works even on static hosts without byte-range support. These are the six real bundled files, not streams or simulated output. Public resources remain below 20 MB.

Registration was verified unique with `enabled: false`, `deployed: false`. All previous configuration entries were preserved. No production build, dist, publish, or deployment ran.

See `ASSETS.md` and `LICENSE` for source-specific credits and conditions.
