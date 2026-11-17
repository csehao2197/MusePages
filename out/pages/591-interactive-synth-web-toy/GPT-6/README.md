# Moonbleep

- Original: `data\prompts\591-interactive-synth-web-toy\591-interactive-synth-web-toy.md`.
- Generator: **gpt-6.1-sol**; public collection label: **GPT-6**.
- Source: this directory's HTML, CSS and native JavaScript modules; independent static export: `out\`.
- Public subpath: `pages/interactive-synth-web-toy/GPT-6/index.html`.
- Prompt by [VibeFather](https://vibefather.ai/t/interactive-synth-web-toy), mirrored from [liyupi/awesome-vibe-coding-websites](https://github.com/liyupi/awesome-vibe-coding-websites/blob/85431a57f231fa59269dad62c757193d6a3fd0ff/templates/interactive-synth-web-toy/prompt.md). Prompt adaptation is CC BY-NC 4.0; see `LICENSE`. Non-commercial use only; commercial use requires separate authorization.

## Play

The instrument includes the three specified oscillator voices, gain envelopes, per-voice lowpass filters, 12-voice stealing, compressor, tempo-synced feedback delay, quadratic master volume and a live, rising-crossing waveform scope. Audio starts only after a gesture. Hold keyboard keys or use multiple pointers for chords. Blur, visibility change and pointer cancellation stop the transport and release notes.

The 16×8 pentatonic grid supports tap, accessible buttons and mouse/pen painting. The look-ahead clock schedules real oscillators; the visual playhead follows audio time. All three original starter sequences are preserved. Voice, tone, tempo and every grid edit round-trip through the versioned URL hash; volume does not. Copy has an accessible selected-input fallback. Knobs support drag, Shift, arrows, PageUp/PageDown, Home/End and double-click reset. Octave range is −2 to +2. Mobile has an independently scrolling keyboard and two stacked sequencer bars. Reduced-motion mode uses a static voice-shaped scope.

## Static adaptation and limits

The execution authorization explicitly allows a build-free HTML/CSS/browser-JavaScript adaptation. This deliverable therefore uses native ES modules instead of the requested Vite 5 / strict TypeScript build pipeline. No build was run and no Vite dependencies were installed. Locally hosted Fontsource font files and individually rendered Lucide SVGs retain their original licenses. Visible application copy is centralized in `content.js`; pitch names, numeric readouts and static HTML fallback metadata are generated or declarative.

There is no backend, account, storage, analytics, external runtime request, sample, fake audio or mock service. The browser synthesizes audio; actual speaker output depends on the device and browser sound settings. A shared link loads stopped and requires the visitor's gesture. High polyphony deliberately steals the oldest voice. Starting a new preset preserves playback. A suspended hidden tab does not generate a catch-up burst. Source maps and development files are excluded from `out\`.

## Run and verify

From the repository root, serve only the export with the existing preview helper (temporary loopback HTTP; no build):

```powershell
node src\workflows\script\generate-preview.mjs out\pages\591-interactive-synth-web-toy\GPT-6\out
```

Reproduce the private assertions and screenshots:

```powershell
node out\pages\591-interactive-synth-web-toy\GPT-6\.checks\verify.mjs
```

The private `.checks\qa.json` records actual browser checks, viewports, audio-signal measurements, interactions, errors and resource closure. `.checks\desktop.png` and `.checks\mobile.png` are actual static-page captures; `out\preview.png` is the separately captured 1200×900 collection preview. The final private report records visual review and registration. Registration is disabled and undeployed; no collection build, deployment or upload is part of this delivery.

Verified on 2026-11-16: **83 browser assertions passed**, with zero HTTP/resource/request/console/page errors. Viewports: 1200×900, 1440×900, 820×1000 and touch-enabled 390×844, all DPR 1. Tests include nonzero real analyser signals for all voices, exact oscillator frequencies and signal settings, silent master mute, short-note offline PCM rendering, suspended-context resume, voice stealing, transport catch-up protection, pad painting, hash restoration, clipboard success/denial branches, reduced motion, unavailable Web Audio and mobile two-finger chords. The clipboard branches use controlled browser permission outcomes; no external service is mocked.

Both real desktop/mobile PNGs were opened and visually reviewed. The initial desktop grid's bottom-row spacing was refined and its containment is now asserted. The separately generated preview was also opened; the preview helper uses a reduced-motion static voice trace. No AudioContext exists before a gesture. Tests verify rendered PCM, not a human listening to physical speakers.
