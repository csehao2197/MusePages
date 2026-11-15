# 3D Wooden Fish Tapping Toy

Build this website exactly as described below. Replace the [VARIABLES] with your own values; keep everything else.

## Brief
Build [BRAND], an immediately playable wooden-fish percussion toy in a dark, warm contemplative room. A finely modeled [WOOD_FINISH] wooden fish floats just above a circular display plinth. Click or tap the instrument, activate the strike button, or press Space to animate a mallet strike, a damped dip and rebound, gold ripples, a short particle burst, a floating [CALM_MESSAGE] message, and a resonant Web Audio knock. Include a combo counter, optional auto-tap mode, separately controlled synthesized ambience, and a locally saved daily total.

- Audience: People taking a brief playful pause at their desk or on a phone; no medical or spiritual claims.
- Goal: Make the first tap possible immediately, then reward repeated input with coordinated tactile, visual and audio feedback.
- Tone: Quiet, tactile, humane and precise. Write all interface copy in US English. Keep all content in src/content.ts and rewrite finish descriptions and setting copy when variables change.

## Stack
- Framework: Vite + TypeScript + Three.js
- Styling: Vanilla CSS
- Libraries: three (MIT), vite (MIT), typescript (Apache-2.0), @fontsource/instrument-serif (OFL-1.1), @fontsource/dm-sans (OFL-1.1)
- Build: `npm run build` → static files in `dist/`. No backend, no server code, no external APIs.
- Setup:
  - Install all dependencies in this project. Use Vite base ./, minification, and build.sourcemap false.
  - Use Three.js WebGLRenderer for the scene and native Web Audio for all sound. Create geometry and all surface textures procedurally; no remote models, photos, HDRIs, audio or API calls.
  - Import only local Latin woff2 subsets of Instrument Serif 400 and DM Sans 400, 500, 600. Put tokens, responsive rules and reduced-motion styles in src/style.css.
  - Build a static index.html entry with all text and swappable copy in src/content.ts. Save daily count and preferences to localStorage with try/catch fallback when storage is unavailable.
  - Clamp renderer pixel ratio to at most 1.75, cap particles, reuse geometry and materials, handle resize, and suspend animation and automatic tapping when the document is hidden.

## Variables
- [BRAND] — Toy identity (default: "Hushwood"). An invented short name for the experience.
- [WOOD_FINISH] — Wood finish (default: "Honey walnut"). A wood species and finish; preserve the warm dark design while adapting the instrument grain and color.
- [ROOM_SETTING] — Room setting (default: "Amber temple"). An abstract architectural room, without religious icons or people.
- [CALM_MESSAGE] — Floating tap message (default: "+1 calm"). A short, nonmedical phrase shown above each strike.
- [CREDIT] — keep a small "Template by VibeFather" link to https://vibefather.ai/t/3d-wooden-fish-tapping-toy in the footer (default: yes; delete this line to remove it)

The copy under Pages & Sections is written for the default values. If your values differ, rewrite every headline, paragraph, label and image for them — same length, tone and structure. Layout, colors, type and motion stay as described.
Keep all copy, image paths and links in one content file (for example `src/content.ts`), keyed by section, so the content can be swapped later without touching components.

## Design
### Colors
- Room `#151915` — Deep green charcoal background and atmospheric room.
- Panel `#20251F` — Low-contrast control dock and inset fields.
- Ivory `#EEE8D8` — Primary typography and readable controls.
- Muted `#B2B8A6` — Secondary labels with strong contrast.
- Amber `#D8AD64` — Active controls, impact ripples, fine accents.
- Walnut `#8D542F` — Default instrument base, with procedural darker grain.

### Typography
- Display invitation and brand: Instrument Serif (OFL), weights 400
- Body, controls and counters: DM Sans (OFL), weights 400/500/600

### Layout & motion
- Spacing: Desktop composition fits 1440×900 with 40px outer inset, 64px top identity rail, 112px bottom utility area, and the instrument centered in the remaining stage. Use an 8px spacing unit. A 270px left caption rail and 160px right metric rail flank the roughly 760px-wide scene; keep the 3D object unobstructed. At 390×844 use 20px side insets, a 54px top rail, a compact 34px two-line invitation, 330px-high scene, a two-column metric row, a 52px strike button, and a wrapping two-row settings dock. Allow ordinary vertical scrolling on short screens; never clip controls or horizontally scroll.
- Radius: Use 10px control dock radius, 6px secondary controls, a 28px capsule for the primary strike button, and hairline #3D4438 dividers. Avoid a grid of floating glass cards.
- Motion: Keep scene ready at first paint; no splash screen, loading overlay or entrance sequence that blocks play.
- Motion: Idle drift is a 0.035-unit vertical sine over 5 seconds. Strike animation: mallet swings from the upper right into the sound slit in 85ms, body dips 0.12 units and tilts 0.06 radians, and a damped spring returns it over about 500ms. A new strike restarts from the current physical state.
- Motion: Each strike emits one thin amber ground ripple expanding from radius 0.4 to 2.3 over 700ms, no more than 18 small warm particles, and one screen-space [CALM_MESSAGE] drifting upward 30px over 900ms. Pool and cap effects.
- Motion: Reduced motion disables idle movement, floating messages and particle travel; retain a small 120ms material highlight and immediate counter updates. Automatic mode still advances counts at its slow pace with restrained feedback.
- Imagery: Use only original procedural Three.js geometry, Canvas-generated grain and hand-authored SVG icons. The wooden fish must read as a crafted percussion instrument, not a plain sphere: a flattened rounded oval body about 2.5×1.7×1.8 units, two softly raised face lobes, a narrow dark carved sound slit, a small scalloped tail, subtle routed ridges around its sides, a tiny inset eye detail on each front lobe, and polished bevel-like highlights. Generate coherent longitudinal wood grain with a canvas texture or shader and subtle roughness variation. Model a separate wooden mallet with a slim handle and wrapped cream padded head. Float the instrument just above a broad stone plinth with a soft contact shadow. Create an architectural alcove with tall dim vertical fins, a warm side light, a sparse dust field and slight depth fog. Keep architecture subdued, without religious symbols, figures or copied decorations. For [ROOM_SETTING] adapt the atmospheric light and short caption; for Rainlit pavilion use a cooler side window light with abstract static rain-like vertical traces, still inside the same composition. No downloaded images or generated bitmaps.

## Pages & Sections
### [BRAND] — A quiet moment (`index.html`)
1. **Identity rail** — Left: [BRAND] in 27px Instrument Serif with a tiny original two-line woodcut mark. Right: a small status dot and Quiet by design. Do not add navigation to nonexistent pages.
   Layout: A single full-width line with a subtle bottom divider. On phones retain both ends without wrapping.
   Motion: No moving or blinking status indicator.
2. **Playable sculpture and invitation** — Left eyebrow: A SMALL DAILY RITUAL. Main invitation: A little less noise. Beneath: One tap. One breath. A moment of your own. Below it show [WOOD_FINISH] / [ROOM_SETTING] as a small scene caption. Center the original wooden fish and poised mallet, immediately visible and tappable. A small stage instruction says Tap the wood or press Space. Use a large button labeled Strike the wood with a small outlined spacebar keycap on desktop. A compact helper below the button reads Sound begins with your first tap.
   Layout: Asymmetric open composition around the large 3D scene; no text layered across the instrument. The scene is the main visual anchor and occupies at least half the desktop screen. Place a visible HTML strike button immediately beneath the scene; hide the spacebar keycap on touch widths. On mobile stack invitation, scene, counters and button with the toy visible in the first viewport. The canvas has an accessible label, and the strike button supplies a keyboard-equivalent interaction if WebGL is unavailable. Render an original Canvas 2D instrument fallback if WebGL initialization fails.
   Motion: Use pointer raycasting to strike only the instrument, not arbitrary blank background. Handle pointer events for mouse and touch without double firing. Space and Enter on the primary button strike; a global Space shortcut prevents page scrolling only when focus is not on another interactive control. Animate synchronized mallet, wooden body, ripple, particles and [CALM_MESSAGE].
3. **Ritual counters** — Show Today with a large count starting at 0, and a smaller Session count. Show Rhythm with combo count and the helper Keep a gentle rhythm. A combo increments for strikes less than 1.6 seconds apart and resets after that window. Each accepted strike increments session and today by exactly one. Store today using a hidden local-day key and reset on the first strike of a new local day. Never show a calendar date, timestamp or calendar UI. A small state label changes to In rhythm at a combo of 3 or more.
   Layout: On desktop the right metric rail aligns near the upper-middle of the stage with tabular numerals, open typography and dividers. On mobile place Today and Rhythm in a compact row under the scene; show Session as a small secondary line. Keep counts out of the 3D object silhouette. Use polite accessible announcements that avoid flooding screen readers during auto mode.
   Motion: A 140ms amber number flash on a strike. Do not animate large numeric jumps or shake the layout.
4. **Sound and rhythm dock** — A bottom dock contains Sound with an on/off button, Ambience with an independent on/off button, and Auto tap with a labeled switch. Defaults: Sound on, Ambience off, Auto tap off. Auto tap runs once every 1.2 seconds, updates the same counts and effects, and has a clear active state and Stop auto accessible label. Starting Auto tap is a user gesture that may unlock audio. Show Slow rhythm · 50 taps/min while active. A subtle footer reads Made for a small pause. and includes the optional [CREDIT] link.
   Layout: Desktop dock is a 560px-wide centered strip with thin vertical dividers and 44px minimum targets. Small helper text sits outside it. On 390px screens it wraps cleanly into two rows with every control at least 44px and labels never truncated. Show pressed/checked state both visually and with aria-pressed or switch semantics. Tab focus uses a 2px ivory outline.
   Motion: Initialize or resume AudioContext only after a user gesture and never throw when unsupported. Synthesize a short wooden knock from layered decaying sine/triangle oscillators around 180Hz and 470Hz plus a very short filtered noise transient; use soft gain envelopes and a low-volume synthesized reverb tail. Ambience uses a quiet low-passed generated noise buffer and a soft detuned drone, fading in/out over 300ms. No audio files. Sound off silences strikes without disabling visual play; ambience remains separately controllable. Stop automatic strikes and suspend audio when hidden; require a deliberate resume after returning rather than unexpectedly restarting.

## Assets
- image: All instrument geometry, plinth, room, grain texture, ripple and particle art are authored in code in this project. No external images, media, 3D models or HDRIs. Record procedural authorship in ASSETS.md.
- icon: Create small original inline SVG icons for sound, ambience, automatic rhythm and the brand woodcut mark; no brand icons or external icon service.
- font: Install @fontsource/instrument-serif and @fontsource/dm-sans; import local Latin woff2 files only. Record the Fontsource source package URLs and OFL-1.1 licenses in ASSETS.md.

## Don'ts
- Do not copy the reference prompt, code, composition, branding, slogans, screenshots, audio, fonts or marks; do not use merit, worries or salary reward text. Use original [BRAND] copy and geometry.
- Do not use a plain sphere as a substitute for the carved wooden fish, a flat illustration as the primary scene, or a mallet that clips through the body at rest.
- Do not use image generation, photographs, remote models, HDRIs or downloaded audio. Graphics must use Three.js, Canvas or GLSL only; sound must be synthesized with Web Audio.
- Do not use CDN scripts, font CDNs, hotlinked images, external runtime requests, analytics, backend code, auth, APIs or forms that submit anywhere. All dependencies and assets must be installed locally.
- Do not show dates, timestamps, real people, real brands, copied logos, commercial fonts, restricted component code, filler copy or medical promises. All site copy and alt text must be US English.
- Do not add source maps, source directories or unminified source copies to dist/. Use relative asset paths, a single npm run build command, and static output in dist/ smaller than 20 MB. Any internal page link must point to an actual .html filename or hash route, never a bare directory.
- Do not block initial play with an intro, cookie modal or audio permission overlay. Never autoplay audio before a gesture; handle unavailable AudioContext, WebGL and localStorage gracefully.
- Do not allow horizontal overflow or hide controls at 1440×900 or 390×844. Support touch, mouse, keyboard, visible focus, high-contrast control labels and prefers-reduced-motion.
- Do not use references to VibeFather in the site beyond the optional [CREDIT] footer. Keep all copy in src/content.ts and adapt all scene captions and messages when variables differ.

---
Inspired by 3D Cyber Mokugyo (Native Audio Synthesis) by @UPGPTs Team — https://upgpts.com/en/tutorials/chatgpt/gpt-6.1-sol-test-cases
— Prompt by VibeFather · https://vibefather.ai/t/3d-wooden-fish-tapping-toy · CC BY-NC 4.0 (non-commercial; commercial use needs a VibeFather Pro license) · Request removal: https://vibefather.ai/takedown
