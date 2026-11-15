# Jet Engine Interactive Explainer

Build this website exactly as described below. Replace the [VARIABLES] with your own values; keep everything else.

## Brief
Build a one-page interactive engineering explainer for [BRAND]'s [ENGINE] ([MODEL_ID]), aimed at [AUDIENCE]. The default is an original high-bypass turbofan modeled entirely from Three.js primitives and custom blade geometry. A large working engine leads into five scroll-driven cutaway states covering the fan and bypass, compressor, combustor, and turbine with exhaust. A synchronized throttle changes two coaxial spool groups and directional airflow particles. When variable values change, redesign the procedural engine architecture, stage data, captions, guide, and quiz to fit the new [ENGINE] while preserving the layout, interaction model, and visual system.

- Audience: [AUDIENCE], plus educators, museum interpreters, technical creators, and aviation enthusiasts who need a clear visual explanation without CAD software or prior thermodynamics knowledge. The default copy welcomes engineering students and explains specialist terms in plain language.
- Goal: Help visitors identify the major engine stages, trace bypass and core airflow, connect each turbine to the components it drives, and test their understanding. The primary action, [PRIMARY_CTA], enters the scroll tour. A persistent throttle and motion pause control make cause and effect inspectable rather than a passive animation.
- Tone: Precise, curious, calm, and educational. Use short declarative explanations, concrete mechanical relationships, and honest labels for simplified sample data. The page should feel like a carefully art-directed engineering exhibit, not an aircraft cockpit, military interface, game HUD, or generic technology landing page.

## Stack
- Framework: Vite 6 + React 19 + TypeScript
- Styling: Vanilla CSS
- Libraries: three (MIT), lucide-react (ISC), @fontsource/space-grotesk (OFL), @fontsource/inter (OFL), @fontsource/ibm-plex-mono (OFL)
- Build: `npm run build` → static files in `dist/`. No backend, no server code, no external APIs.
- Setup:
  - Use Vite with React and TypeScript. Set base: './' and build.sourcemap: false in vite.config.ts; the production command must emit only static files to dist/. Do not substitute another framework, renderer, styling system, physics engine, or state library.
  - Install and import three, lucide-react, and the three listed Fontsource packages locally. Import OrbitControls and RoomEnvironment from three/examples/jsm; use PMREMGenerator with RoomEnvironment for metallic reflections instead of downloading an HDRI.
  - Create src/content.ts as the single source for resolved variable values, navigation labels, hero copy, tour states, geometry parameters, stage records, airflow explanations, quiz questions, and footer copy. Include the default [BRAND], [ENGINE], [AUDIENCE], [PRIMARY_CTA], and [MODEL_ID] values there, rewrite all engine-specific content when those values change, and never leave square-bracket variable tokens visible in the rendered site.
  - Build the default engine along the X axis from original lathed nacelle and casing bands, an exhaust cone, two coaxial shafts, 22 wide fan blades, three low-pressure and six high-pressure compressor rotor rows with static stator rows between them, an annular combustor with 12 small fuel-nozzle markers, one high-pressure turbine row, and three low-pressure turbine rows. Use custom tapered, slightly twisted BufferGeometry blades and InstancedMesh for repeated blades. Keep the model recognizably turbofan-like but do not copy any real engine or CAD design.
  - Use MeshStandardMaterial for titanium, steel, and dark casing, a neutral procedural environment, one broad key light, a cooler rim light, and a code-generated contact-shadow plane. Enable antialiasing and alpha; cap pixel ratio at 1.6 on desktop and 1.35 on mobile. Use one Points geometry for 160 desktop or 80 mobile airflow particles with deterministic seeded paths, and pause requestAnimationFrame work while the scene is offscreen or the document is hidden.
  - Keep one shared React engine state: throttle, motionPaused, showCoreFlow, showBypassFlow, scrollProgress, activeStage, selectedStage, and controlMode. At throttle 0 all rotors and particles stop; at throttle 1 the N1 fan, low-pressure compressor, and low-pressure turbine rotate at 4.8 radians per second while the N2 high-pressure compressor and turbine rotate at 12.5 radians per second. Interpolate linearly between those endpoints and label the 2.6:1 relationship as a visual teaching ratio, not measured RPM. Drive particle velocity from the same throttle value.
  - Create a reusable EngineScene component for the hero, tour, and lab, with shared geometry definitions and only the visible scene rendering. Provide an original inline SVG longitudinal cutaway as a no-WebGL fallback, including intake, fan, compressor, combustor, turbine, bypass duct, exhaust, and stage labels; all controls must still update the HTML readouts when WebGL is unavailable.
  - Use Lucide icons only for ArrowDown, Play, Pause, RotateCcw, Gauge, Wind, Layers3, Check, X, ChevronRight, and Menu. Give every icon button an accessible text label and 44px minimum touch targets.
  - Centralize responsive rules and keyframes in src/styles.css. Support 1440×900 and 390×844 without horizontal overflow or console errors, include visible keyboard focus, and implement prefers-reduced-motion by stopping continuous rotor and particle movement, removing camera easing and entrance animation, and retaining instant cutaway states, manual controls, quiz feedback, and all explanatory content.

## Variables
- [BRAND] — Brand (default: "Aerofield Lab"). Invented educational studio or engineering lab name used in the header, lesson copy, and footer.
- [ENGINE] — Engine subject (default: "High-Bypass Turbofan"). An air-breathing engine that can be modeled from code and divided into four meaningful teaching stages.
- [AUDIENCE] — Audience (default: "engineering students"). Lowercase descriptive audience phrase that fits naturally after for in the hero copy.
- [PRIMARY_CTA] — Primary action (default: "Explore the engine"). Short button label that scrolls to the engine tour and remains suitable for the selected subject.
- [MODEL_ID] — Model identifier (default: "AF-09"). Short invented alphanumeric identifier used in technical labels and the lesson recap, never a real engine designation.
- [CREDIT] — keep a small "Template by VibeFather" link to https://vibefather.ai/t/jet-engine-interactive-explainer in the footer (default: yes; delete this line to remove it)

The copy under Pages & Sections is written for the default values. If your values differ, rewrite every headline, paragraph, label and image for them — same length, tone and structure. Layout, colors, type and motion stay as described.
Keep all copy, image paths and links in one content file (for example `src/content.ts`), keyed by section, so the content can be swapped later without touching components.

---
**This is the public part of a VibeFather Pro prompt.** The page sections, layout, motion and asset instructions that make the live demo look the way it does are for Pro members: https://vibefather.ai/templates/jet-engine-interactive-explainer?utm_source=github&utm_medium=readme&utm_campaign=awesome-vibe-coding-websites&utm_content=pro-prompt
Inspired by Kimi 3D Make Showcase — https://www.kimi.com/showcases/3dmake
— Prompt by VibeFather · https://vibefather.ai/t/jet-engine-interactive-explainer · CC BY-NC 4.0 (non-commercial; commercial use needs a VibeFather Pro license) · Request removal: https://vibefather.ai/takedown
