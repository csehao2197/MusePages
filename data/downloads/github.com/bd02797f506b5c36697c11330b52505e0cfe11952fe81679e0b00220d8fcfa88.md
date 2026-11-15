# Jelly Squish Physics Toy

Build this website exactly as described below. Replace the [VARIABLES] with your own values; keep everything else.

## Brief
Build a complete original single-page jelly squish playground for [BRAND]. The hero is a real-time, physically deformable fluted jelly dessert, not an image or a rigid model. It can be poked, grabbed, stretched, squashed and dropped onto a plate with mouse or touch. Include three flavors, adjustable stiffness and synthesized squelch sound.

- Audience: People taking a short playful break and creative coding fans, on phones or desktop.
- Goal: Make the object immediately inviting and functional on the first screen, then let the user change its feel and appearance without navigating away.
- Tone: Warm, lightly humorous, tactile and concise. Never describe health benefits or make wellness claims.

## Stack
- Framework: Vite + TypeScript + Three.js
- Styling: Vanilla CSS
- Libraries: three (MIT), @fontsource/dm-sans (OFL-1.1), @fontsource/fraunces (OFL-1.1)
- Build: `npm run build` → static files in `dist/`. No backend, no server code, no external APIs.
- Setup:
  - Use npm with Vite and TypeScript; install every library locally and lock dependencies. Set Vite base to ./, build sourcemap false, and build minify true.
  - Keep all visitor-facing copy, flavor names and colors in src/content.ts. The BRAND, HEADLINE, INTRO, FLAVORS and ACCENT variables must control all edition-specific content; rewrite related labels naturally when changed.
  - Import local Latin font files through Fontsource. A plain document title naming [BRAND] and a code-drawn favicon are sufficient.
  - Use Three.js WebGLRenderer for the stage, native pointer events for input and Web Audio for all sound. No physics library, external model or external media is necessary.
  - Write ASSETS.md listing the original code artwork, Three.js MIT and both font packages with source URLs and licenses. Finish with npm run build producing only static distribution files.

## Variables
- [BRAND] — Toy studio (default: "Softside Studio"). An invented studio name.
- [HEADLINE] — Main invitation (default: "A little less serious."). A short playful phrase, not a technical feature list.
- [INTRO] — Short introduction (default: "Poke it. Pull it. Let the day wobble away.")
- [FLAVORS] — Three flavors (default: "Peach #f08e72, Grape #a69cda, Mint #8bbda9"). Exactly three flavor names and matching jelly color hex values.
- [ACCENT] — Interface accent (default: "#a84e3d"). Use a sufficiently dark shade for readable labels and buttons.
- [CREDIT] — keep a small "Template by VibeFather" link to https://vibefather.ai/t/jelly-squish-physics-toy in the footer (default: yes; delete this line to remove it)

The copy under Pages & Sections is written for the default values. If your values differ, rewrite every headline, paragraph, label and image for them — same length, tone and structure. Layout, colors, type and motion stay as described.
Keep all copy, image paths and links in one content file (for example `src/content.ts`), keyed by section, so the content can be swapped later without touching components.

## Design
### Colors
- Studio cream `#faf4e9` — Main page and warm studio background
- Peach wash `#f0ded1` — Stage horizon and subtle surface gradient
- Ink `#443d37` — Main text and strongest outlines
- Muted clay `#786b60` — Secondary copy with readable contrast
- Edition accent `[ACCENT]` — Primary button, active flavor outline, focus state and slider thumb
- Plate ivory `#fffaf0` — Glazed ceramic plate and control tray

### Typography
- Display headline and wordmark: Fraunces (OFL), weights 500/600
- Body, controls and measurements: DM Sans (OFL), weights 400/500/600/700

### Layout & motion
- Spacing: Desktop: 40px outer gutters, centered content max-width 1360px, 24px header padding. Hero intro sits upper left and the large stage occupies the center-right; control tray is centered beneath the object. Use an 8px spacing grid, 16px compact gaps and 24px tray gaps. Mobile: 20px gutters, header 58px, headline 40px, intro 14px, scene 300–340px tall; place the complete first interaction controls within or very near a 390×844 viewport. Do not create a tall blank gap before the object.
- Radius: Control tray 24px, buttons and flavor chips 999px, small instruction labels 8px. Use thin #d8cabe borders and soft warm shadows rather than many cards.
- Motion: The deformation itself is the main animation; avoid perpetual floating or camera rotation. The jelly rests visibly on its plate.
- Motion: Model a closed, non-watermelon fluted dome with approximately 16–20 latitude rings and 40–48 longitudinal nodes. Use a position/velocity or Verlet mass-spring solver with structural and diagonal neighbor constraints, damped rest-shape restoring forces and stable fixed-timestep substeps. Update the actual BufferGeometry positions and normals after solving; highlights must follow the deformed surface.
- Motion: Use bounded steps, velocity clamping and enough solver iterations to keep rapid dragging stable. Soft volume or radial restoration preserves a recognizable dessert silhouette. The lower ring can slide/compress against the plate rather than falling through it. Nearby rings should follow the grabbed node with smoothly decreasing influence.
- Motion: Pointer-down raycasts onto the mesh and grabs a local vertex cluster in a camera-facing drag plane. Moving drags the cluster toward the pointer with spring force, allowing a clear local indentation or stretch; release removes the grab and produces damped oscillation. A quick click or tap applies a short inward impulse. Clamp extreme stretch to keep the shape recoverable.
- Motion: Drop it releases the jelly from about one jelly-height above the plate; gravity, collision, compression and damped rebound visibly change the mesh before it settles. The button must work repeatedly. The stiffness range maps to solver restoration and damping so its endpoints feel clearly different, without numerical explosions.
- Motion: Reduced-motion preference disables decorative transitions and reduces drop height, impulse amplitude and rebound duration, while retaining deliberate direct manipulation. Pause simulation when hidden; cap device pixel ratio at 1.75 desktop and 1.5 mobile. Use touch-action none only on the stage, not the whole page.
- Imagery: Create all visuals procedurally in Three.js. Jelly is an original rounded, fluted pudding dome, about 2.6 units wide and 1.8 high, with soft scalloped edges and a small top dimple. Use a translucent MeshPhysicalMaterial or equivalent physically shaded material: roughness around 0.13, clearcoat 1, transmission around 0.45, thickness around 0.8, and color from the active flavor. A few subtle bubbles can follow nearby deformation nodes but no seeds or rind. Use a code-built ivory plate with two soft concentric rims, a warm floor, contact shadow, large soft key light upper left and muted rim light. Build any reflection environment locally using Three.js RoomEnvironment or code-drawn CanvasTexture. Include a restrained fine studio grain in CSS. No external photograph, generated image, watermelon wedge, identifiable logo or copied composition.

## Pages & Sections
### [BRAND] jelly playground (`index.html`)
1. **Header** — Left: [BRAND] wordmark beside a small original loop-shaped jelly doodle. Right: a text button initially reading Sound off with a small speaker icon; toggles to Sound on with aria-pressed. No navigation links or shop CTAs.
   Layout: One horizontal row, 24px vertical rhythm, bottom thin line optional; 20px wordmark desktop and 17px mobile. Sound control minimum 44px tap area.
2. **Invitation and playable studio** — Small eyebrow A SMALL PLAYFUL BREAK. H1 [HEADLINE]. Supporting line [INTRO]. A compact gesture hint reads Grab a little. Let go. The scene is fully rendered before interaction. Add unobtrusive flavor label near the plate and a small status readout initially Resting, switching to Stretching, Wobbling or Dropping as appropriate. Keep scene labels as legible DOM overlays, never rasterized text.
   Layout: Desktop: intro at left occupying about 35% width, a 600×500px scene centered in the remaining space and extending behind the whitespace but never behind the text. Main headline 76px/0.98 and limited to 5–7 words. Mobile: intro above a full-width 300–340px scene, headline 40px/1.05; the jelly occupies about 65–75% of stage width with visible plate and clearance for deformation. The first screen must contain the actual object and Drop it control.
   Motion: Render a stable composed view immediately, with perspective camera around (4,3.2,5.5) aimed at the jelly center. Use no orbit control during grabbing. Resize to container without overflow. A keyboard-accessible Squish button may be a small overlay and must trigger the same physical impulse as tapping.
3. **Tasting controls** — A single tray holds Flavor with exactly three named swatches parsed from [FLAVORS], a Stiffness range from 0 to 100 initially 45 with endpoint labels Soft and Firm, and the main Drop it button with a down-arrow icon. Each flavor is a real button with visible name, active ring and aria-pressed. Changing flavor changes the jelly body tint and active label while preserving simulation state. Show a useful short hint under controls: Drag to stretch · Tap to poke. A small Reset button restores the rest shape if desired.
   Layout: Desktop: one horizontal 780px-max tray with flavor group left, stiffness center, solid accent Drop it right. Mobile: a compact tray with three flavor chips in the first row and slider plus Drop it in the second; every touch target at least 44px and no horizontal scrolling. Keep tray in normal document flow so it never covers the plate or the gesture area.
   Motion: Use 140ms control color transitions; the flavor material crossfades within 220ms unless reduced motion. Range input supports native arrow keys and clear focus outline. Space on focused Drop it must trigger one drop without double-firing.
4. **Sound and footer** — Web Audio is initialized or resumed only from explicit pointer/key interaction. Sound remains off until the visitor turns it on. Synthesize a short filtered noise squelch plus low sine pitch bend on tap/release/drop; intensity follows impulse speed with bounded gain and a master limiter or gentle gain envelope. No sample files, autoplay or background soundtrack. Footer reads Made for a moment of play. If the public CREDIT variable is enabled, include its optional template credit link.
   Layout: A quiet thin footer below the tray with 12px secondary text. No dates, counters implying popularity, newsletter form or lengthy explanation. Audio control must remain understandable when browser audio is unavailable.
   Motion: Close or suspend unneeded audio nodes; debounce rapid impulses to avoid clicks and excessive gain. All keyboard controls are real DOM elements. Provide a polite live status for flavor changes and drops, without announcing animation every frame.

## Assets
- font: Install @fontsource/fraunces (https://fontsource.org/fonts/fraunces, OFL-1.1), Latin 500/600 only, imported locally. Install @fontsource/dm-sans (https://fontsource.org/fonts/dm-sans, OFL-1.1), Latin 400/500/600/700 only. List package versions and license locations in ASSETS.md.
- image: All jelly geometry, bubbles, ceramic plate, reflections, shadows, grain and favicon are original code-generated artwork. Do not fetch images or generate bitmaps. Document original artwork and the local Three.js MIT dependency in ASSETS.md.
- icon: Draw simple original speaker, arrow and loop icons with inline SVG paths; no logo library or downloaded icon assets.

## Don'ts
- Do not copy the reference prompt, code, copy, composition, palette, logo, images or unique icons. Do not use its watermelon wedge, rind, seeds or product names. Do not mention other products or competitors on the site.
- Do not fake the jelly physics with whole-object CSS scale, a rigid mesh wobble or a canned animation. Actual surface vertices must respond to grabbing, neighbor springs, collision and release. Do not let the mesh tear, fall through its plate or remain permanently stretched.
- No backend, API calls, accounts, analytics, remote forms, checkout, storage service or third-party runtime requests. All functionality is browser-local.
- Do not load scripts, fonts, icons, reflections, models, audio or other assets from a CDN. Install and bundle libraries; self-host fonts. No commercial fonts, restricted components or assets with non-redistributable licenses.
- Use only Three.js, Canvas and GLSL for 3D/graphics, and native Web Audio synthesized sound. Do not use pre-rendered video or external physics engines.
- Produce minified static files in dist/ under 20 MB, relative asset paths with base ./, no source maps and no copied src directory. Internal links, if any, must target HTML filenames or hash routes.
- All copy, flavor names, labels and alt text must be US English and live in the content file. Rewrite relevant copy when variables change. No visible dates, invented social-proof figures, health claims or filler.
- Do not gate the first view behind a loading splash, consent modal or instruction screen. Do not autoplay audio. Make the toy usable at 1440×900 and 390×844 with no horizontal overflow or console errors, keyboard alternatives, visible focus and touch controls.
- Honor prefers-reduced-motion and pause when hidden. Do not capture touch scrolling outside the scene or place controls over the draggable object.
- Do not use real people, recognizable characters, branded objects, external photographs or AI-generated images. Keep the original code-built dessert and studio as the visual anchor.

---
Inspired by Watermelon Jelly Squishy soft-body study by @UPGPTs Team — https://upgpts.com/en/tutorials/chatgpt/gpt-6.1-sol-test-cases
— Prompt by VibeFather · https://vibefather.ai/t/jelly-squish-physics-toy · CC BY-NC 4.0 (non-commercial; commercial use needs a VibeFather Pro license) · Request removal: https://vibefather.ai/takedown
