# Solar System 3D Explainer

- Actual generator: `gpt-6.1-sol`; public model label: `GPT-6`.
- Original: `data\prompts\557-solar-system-3d-explainer\557-solar-system-3d-explainer.md`.
- Design guidance: `src\workflows\AI Agent\DESIGN.md`.
- Source: this directory's `index.html`, `styles.css`, `content.js`, `main.js`, `scene.js`.
- Independent static export: `out\`. Final subpath: `/pages/solar-system-3d-explainer/GPT-6/index.html`.

## Experience

Original, full-viewport WebGL 2 sphere geometry with directional sunlight, procedural surfaces, Saturn's rings, three-dimensional orbit controls, body picking, keyboard orbit/zoom, nine body fact panels, animated true-scale geometry and perspective-correct Earth pixel readout. Orbital time can be scrubbed, played, paused and sped up. A nine-stop scroll tour flies between bodies and ends with an explicit true-scale reveal. An adjustable street model computes all diameters and mean distances with one ratio. All site copy is English.

## Adaptation and scientific limits

The public original ends before its members-only page sections, design palette, surface recipes and fallback specification. No private demo assets or unpublished instructions are claimed or copied. This is an original interpretation of the supplied public brief.

The user authorizes a build-free static adaptation: native WebGL 2 and browser ES modules replace Vite, TypeScript, three.js, Tailwind and GSAP. System Georgia/Arial/Consolas replace requested font packages. No dependency installation, production build, backend, external API, analytics, mock service or external runtime asset is used. Renderer uses standard perspective depth with dynamic near/far planes rather than three.js logarithmic-depth shaders. A text/data fallback is shown when WebGL 2 is unavailable.

Rounded mean body diameters and orbital distances follow NASA planetary fact sheets. Orbits are circular/coplanar, phases composed rather than ephemeris-based, no moons or asteroid geometry, no eclipses, no physical atmosphere scattering. Only Saturn's major rings are represented, with illustrative opacity. Original procedural surfaces are not geographically exact. True-scale body radii and orbital distances share the Sun-diameter ratio; readable geometry intentionally does not. Pixel readout uses current camera projection, so focusing a body changes its apparent size. Negative rotation follows retrograde spin; tilts are represented consistently with that sign convention. Reduced-motion settings remove camera interpolation; model time starts paused.

## Run and verify

From repository root, use the existing `startPreviewServer` helper in `src\workflows\script\generate-preview.mjs` with this model's `out` directory. Serve only that folder, at the final public subpath. No build is needed.

Private browser assertions and actual desktop/mobile screenshots belong in `.checks\`; the public 1200×900 first-screen capture is `out\preview.png`. Actual verification results are recorded in `.checks\qa.json` and the coordinator's private report. No collection build, deployment or publication is authorized.

Verified with installed Playwright Chromium: 15 assertion groups passed at the final public subpath. Coverage includes real WebGL, sphere picking, pointer orbit, keyboard orbit/zoom, true-scale diminution, body focus/facts, changing orbital geometry, elapsed time/speed/pause, nine tour stops/final reveal, street ratios/input validation, mobile touch/selection, overflow, reduced motion and unavailable-WebGL fallback. No HTTP, request, console or page errors occurred. The actual desktop 1200×900 and mobile 390×844 PNGs were opened and visually reviewed: clear editorial hierarchy, restrained gold instruments, balanced orbit/fact layout and readable single-column mobile flow. The scale controls are reached by normal vertical scrolling on mobile; body navigation scrolls locally. The fresh workflow preview is independently reviewed before final metadata completion.

All body data and teaching facts are in `content.js`; fixed layout/interface copy remains in HTML. This differs from the original's request to configure every string centrally.

## Attribution and license

Prompt by **VibeFather**, via [liyupi/awesome-vibe-coding-websites](https://github.com/liyupi/awesome-vibe-coding-websites/blob/85431a57f231fa59269dad62c757193d6a3fd0ff/templates/solar-system-3d-explainer/prompt.md).
Original prompt: https://vibefather.ai/t/solar-system-3d-explainer.
Adapted for non-commercial use under [CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/).
Commercial use requires appropriate permission; this output grants no rights to the private live demo. See `LICENSE` and public `out\LICENSE`.
Science reference: https://nssdc.gsfc.nasa.gov/planetary/factsheet/.
