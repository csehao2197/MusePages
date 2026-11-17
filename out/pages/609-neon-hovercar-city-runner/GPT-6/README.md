# Lumenlane

Actual generator: `gpt-6.1-sol`; public model: **GPT-6**.

Original: `data\prompts\609-neon-hovercar-city-runner\609-neon-hovercar-city-runner.md`.
Source: [VibeFather prompt, via liyupi](https://github.com/liyupi/awesome-vibe-coding-websites/blob/85431a57f231fa59269dad62c757193d6a3fd0ff/templates/neon-hovercar-city-runner/prompt.md).

## Play

One original, code-built Three.js canyon; wedge hovercar, bending lane, keyboard/touch steering, pace, limited surge, crystals, recharge arches, drones, wall damage, increasing speed, destination, frame depletion, pause/resume, reset, local best haul, procedural engine sound, pilot notes, reduced-motion setting and route map. No network service, account, API, backend or mock gameplay.

Use A/D or arrows to steer, W/up to push pace, Space to surge, P/Escape to pause. Mobile controls use press-and-hold.

## Static adaptation

Source is `index.html` plus `src\*.js` and CSS in this directory; public export is `out\`. This authorized no-build adaptation uses native JavaScript modules rather than the requested Vite/TypeScript compilation. Dependencies are local Three.js, Lucide paths and self-hosted Rajdhani/Outfit fonts. Three.js example bloom ships locally. No production build was run. The public prompt omits its Pro-only geometry/layout; the canyon, meshes and interface here are original, not a reconstruction of that demo.

Run the existing repository `startPreviewServer` helper on this model's `out` directory. It serves only the export at `/pages/neon-hovercar-city-runner/GPT-6/index.html`. Do not serve the source or node_modules publicly. No environment variables required. Prepared static files can deploy independently, but this task does not assemble or deploy the collection.

QA records and browser screenshots are private in `.checks\`; actual validation and visual-review results are recorded there and in the coordinator report. `out\preview.png` is a real 1200×900 browser capture. Browser storage contains only one integer best haul under the brand-derived key. Audio needs a user gesture. WebGL is required. Reduced motion removes hover/roll/pickup animation and reduces bloom; forward travel remains essential gameplay.

From the repository root, `node out\pages\609-neon-hovercar-city-runner\GPT-6\.checks\qa.mjs` runs focused simulation checks and Playwright's full keyboard/touch success-and-failure runs against the actual public subpath. The browser test uses a controlled browser clock, without changing game state, for repeatable driving. The visibility handler is exercised using a synthetic hidden/visible transition. `node ...\.checks\visual.mjs` captures unmodified first screens. All owned browsers and temporary static servers close in `finally`.

Verified: five focused simulation checks; complete keyboard runs at 1440×900 and native multi-touch runs at 390×844, each reaching the berth with 13 crystals, 12 arches, one drone hit, one wall scrape and 2,400 haul in 36.43 simulated seconds using pace/surge; a second run depletes the frame. Pause, reset, reduced motion, audio controls and local best haul pass. A separate 1200×900 real-time keyboard steering/surge/pause smoke test passes. No HTTP, request, page or application-console errors, and no horizontal overflow before/after interactions. Chromium emitted four software-WebGL `GPU stall due to ReadPixels` performance warnings on desktop; the console was therefore not literally empty. These driver warnings are retained in QA.

The actual 1200×900 and 390×844 PNGs were opened and visually reviewed. The cyan launch action, contrasting display type, corner telemetry, spacing and responsive hierarchy were checked. The phone camera composition was refined to keep the live hovercar visible above the start card. Private gameplay screenshots also show the reached berth and depleted-frame results.

## Attribution and license

Prompt by **VibeFather**, inspired by the neoncity hovercar game by **@JulianGoldieSEO**. [Template](https://vibefather.ai/t/neon-hovercar-city-runner), [inspiration](https://agentos.guide/grok-4-7-agent-os). Adaptation under [CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/); non-commercial only. Commercial use requires a VibeFather Pro license. See `LICENSE` and `out\NOTICE` for source and dependency notices. No third-party demo media is redistributed.
