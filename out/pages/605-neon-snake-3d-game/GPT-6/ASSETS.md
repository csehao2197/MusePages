# Assets and attribution

The entire 3D scene is code-drawn from Three.js primitives and a grid shader. No external image file, downloaded model, texture, bitmap, HDRI, video, or audio file is used. The original local `favicon.svg` is one sea-glass arc on a dark square. All sound comes from Web Audio oscillators.

- Three.js 0.181.2, Three.js Authors, MIT, https://www.npmjs.com/package/three. Only `three.module.min.js` and `three.core.min.js` are vendored.
- Lucide 0.468.0, Lucide contributors, ISC, https://www.npmjs.com/package/lucide. Only Pause, Volume2, and VolumeX nodes plus the Lucide `createElement` implementation are included. Pad chevrons are CSS. The vendor source-map comment is removed because source maps are intentionally not distributed.
- Syne, https://www.npmjs.com/package/@fontsource/syne, OFL 1.1. Bundled notice copyright line: “Google Inc.” Local files: `fonts/syne-latin-700-normal.woff2`, `fonts/syne-latin-800-normal.woff2`.
- Outfit Variable, https://www.npmjs.com/package/@fontsource-variable/outfit, OFL 1.1. “Copyright 2021 The Outfit Project Authors (https://github.com/Outfitio/Outfit-Fonts)”. Local file: `fonts/outfit-latin-wght-normal.woff2`.
- IBM Plex Mono, https://www.npmjs.com/package/@fontsource/ibm-plex-mono, OFL 1.1. Bundled notice copyright line: “Google Inc.” Local file: `fonts/ibm-plex-mono-latin-500-normal.woff2`.

Complete bundled license notices accompany the static page in `licenses\`.

Original prompt by VibeFather, https://vibefather.ai/t/neon-snake-3d-game, obtained through liyupi/awesome-vibe-coding-websites at commit `85431a57f231fa59269dad62c757193d6a3fd0ff`. Licensed CC BY-NC 4.0, https://creativecommons.org/licenses/by-nc/4.0/. This is a new static adaptation, not the original live demo source. Noncommercial distribution only; commercial use requires the original author's permission. Request removal: https://vibefather.ai/takedown.
