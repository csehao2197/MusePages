# Keyway Circuit

- Actual generator: `gpt-6.1-sol`; public model label: `GPT-6`.
- Original: `data\prompts\593-typing-speed-race-game\593-typing-speed-race-game.md`.
- Source: this directory; independent static export: `out\`.
- Provenance: [Typing Speed Race Game](https://github.com/liyupi/awesome-vibe-coding-websites/blob/85431a57f231fa59269dad62c757193d6a3fd0ff/templates/typing-speed-race-game/prompt.md), prompt by [VibeFather](https://vibefather.ai/t/typing-speed-race-game), CC BY-NC 4.0. Noncommercial use only; commercial use requires the author's separate permission/license.
- Public path: `pages/typing-speed-race-game/GPT-6/index.html`.

## Implementation

Playable local typing race with the six exact default Night Drive passages, three fixed ghost paces, a four-stage countdown, Unicode code-point comparisons, one unresolved mistake, Backspace repair, entry-based accuracy and matching-prefix WPM. Timing uses `performance.now()` and excludes manual and hidden-tab pauses; neither clock nor ghost moves before the first printable input. Restart with progress requires a second click.

Completed runs, lifetime per-difficulty best WPM/accuracy and last active time are validated and saved locally. Recent history retains ten actual finishes; clearing requires confirmation. Storage failure falls back to session memory. Results include a real Canvas PNG download, plain-text clipboard copy and visible manual-copy fallback. Canvas artwork and the checkered mark are original, with no third-party game imagery, APIs, fake multiplayer, accounts, remote scores or backend mocks.

### Authorized static adaptation

This is a build-free HTML/CSS/native browser-module adaptation, not the requested Vite 5/React 18 runtime. There is no `dist` build, React component tree, graphics library, server or environment variable. `src\content.ts` is the canonical content file, copied byte-for-byte to browser-compatible `content.js`; `src\scoring.ts` contains pure scoring/storage-validation functions, likewise copied to `scoring.js`. These `.ts` files deliberately use JavaScript-compatible TypeScript syntax; a strict TypeScript build is not claimed. `app.js`, `renderer.js` and the selected bundled Lucide SVG definitions run directly. Fonts are self-hosted at the exact requested weights.

Only HTML, CSS, browser JS, required WOFF2 fonts and notices are exported. Source records, package files and private QA remain outside `out\`. No production build or deployment is authorized or performed.

## Running and verification

From the repository root, use the existing preview helper:

```powershell
node src\workflows\script\generate-preview.mjs out\pages\593-typing-speed-race-game\GPT-6\out
```

For interactive testing, import `startPreviewServer` from that helper and close its returned service after use, or serve only this page's `out` directory with a static HTTP server. No installation or build is needed for the exported page.

Private repeatable verification: `node out\pages\593-typing-speed-race-game\GPT-6\.checks\verify.mjs`. Actual assertions, viewport sizes, errors, resource cleanup and visual-review status are recorded in `.checks\qa.json`; images are `.checks\desktop.png`, `.checks\mobile.png` and public `out\preview.png`. Automated checks use native keyboard/text entry, real wall-clock checks and explicitly controlled browser-clock checks for long target-pace boundaries.

Final QA: 24 assertion groups passed at 1200×900, 1440×900 and 390×844, with no browser/console/request/HTTP errors or horizontal overflow before/after gameplay. All six passages, every ghost pace, scoring, error correction, pause/visibility handling, restart, persistence, ten-run retention, clearing, copying/fallback and the actual 1200×630 PNG download were exercised. Completed harness runs are private test data, not sample or human scores. Fresh-page screenshots contain no seeded records.

The actual desktop/mobile PNGs and downloaded result card were opened for visual review. Cyan/coral hierarchy, mono passage readability, clipped cockpit spacing, original track geometry and stacked results were checked. The mobile layout was refined so the passage beginning and full Start race button fit the first 844px; the passage scrolls internally. Visible mobile touch targets are at least 44×44. All owned QA browsers and preview servers close in `finally`.

Registration is a disabled, undeployed option only. Browser records are device/origin-specific, not cloud-synchronized; downloads and clipboard behavior depend on browser permissions. Touch emulation tests the native input route, not a physical phone keyboard.

See `ASSETS.md`, `LICENSE` and `NOTICE` for attribution and separate dependency licenses.
