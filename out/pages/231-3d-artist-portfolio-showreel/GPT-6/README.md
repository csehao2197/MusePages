# Noah Vale — artist portfolio

- Original: `data\prompts\231-3d-artist-portfolio-showreel\231-3d-artist-portfolio-showreel.md`; design: `src\workflows\AI Agent\DESIGN.md`.
- Actual model `gpt-6.1-sol`, display `GPT-6`. Standalone HTML/CSS/JavaScript with original local artwork. Source here, deployable export in `out`; public path `pages/3d-artist-portfolio-showreel/GPT-6/index.html`.
- Six projects, category filters, project detail/breakdown views, related angle gallery, playable local showreel with autoplay-on-open and pause-on-close, motion hover preview, about/process and local inquiry preview.
- Original GLSL artwork: `.checks\art.js`; `.checks\render-assets.mjs` renders six PNGs and records the silent local WebM. This asset-rendering step uses existing Playwright, not a website build. No external video embed or tracking; the six-second original motion study substitutes for a hosted showreel.
- Run from repository root: `node out\pages\231-3d-artist-portfolio-showreel\GPT-6\.checks\verify.mjs`. It serves `out` temporarily under the eventual public subpath and records browser assertions and desktop/mobile screenshots. Visual review is recorded separately.
- Fictional artist, hardware/toolbox and commission availability. Actual artwork uses WebGL/GLSL; breakdown modes are browser visualizations rather than production mesh exports. Gallery studies are explicitly labeled related work. Social links are platform homepages; Discord explains the mock; inquiry sends/stores nothing.
- No environment variables or backend. Registration disabled/undeployed. No installs, builds, dist, publication or Git commits.
