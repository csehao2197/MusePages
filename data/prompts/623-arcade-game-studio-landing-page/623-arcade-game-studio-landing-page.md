# Arcade Game Studio Landing Page

Build this website exactly as described below. Replace the [VARIABLES] with your own values; keep everything else.

## Brief
A single-page pixel-art arcade landing page for [BRAND], [STUDIO_PITCH]. The hero is an arcade cabinet drawn in CSS. Its screen runs a playable canvas runner called [HERO_GAME]: a pixel character jumps over or ducks under obstacles, the speed rises over time, and the game has a score counter plus attract, playing, paused and game-over states. Next to the cabinet is a top-5 high-score board with 3-letter initials entry, saved in localStorage and reset-able. Below come a scrolling ticker of game titles, a grid of games shown as arcade cartridges, a studio section, a front-end-only newsletter sign-up and a footer. A CRT treatment (scanlines, vignette, curvature, faint flicker) sits over the screen. There is no audio anywhere.

- Audience: Players, press and publishers discovering a small independent studio based in [HOME_BASE]. They should get the studio's taste within five seconds, ideally by playing.
- Goal: Get visitors to play [HERO_GAME] in the hero, beat a score, look through the studio's games and join the [NEWSLETTER_NAME] newsletter.
- Tone: Playful, warm and confident. Arcade-cabinet language (INSERT COIN, PLAYER 1, CONTINUE?) in short uppercase display lines, with friendly, plain sentences in the body. Never cynical, never corporate.

## Stack
- Framework: Vite 5 + vanilla TypeScript
- Styling: Hand-written vanilla CSS
- Libraries: vite (MIT), typescript (Apache-2.0), @fontsource/press-start-2p (OFL-1.1), @fontsource/vt323 (OFL-1.1)
- Build: `npm run build` → static files in `dist/`. No backend, no server code, no external APIs.
- Setup:
  - Scaffold with npm create vite@latest using the vanilla-ts template. Do not add any UI framework, game engine, animation library or icon package.
  - vite.config.ts: base './', build.outDir 'dist', build.sourcemap false, build.assetsInlineLimit 0. Do not copy src/ into dist/.
  - npm install @fontsource/press-start-2p @fontsource/vt323, then import '@fontsource/press-start-2p/400.css' and '@fontsource/vt323/400.css' at the top of src/main.ts. Both fonts come in weight 400 only.
  - File layout: index.html, src/main.ts (boot and section wiring), src/content.ts (every variable and every piece of copy, including the games list, stats, ticker items and messages), src/game/runner.ts (game loop, physics, states), src/game/sprites.ts (pixel grids as string arrays plus palette map), src/game/input.ts (keyboard, pointer and touch-button input), src/scores.ts (localStorage high-score board), src/pixelart.ts (helper that turns a string grid and a palette into an SVG string of <rect> cells with shape-rendering='crispEdges'), src/styles/base.css, src/styles/crt.css, src/styles/components.css.
  - Define all colors as CSS custom properties on :root in base.css (--bg, --screen, --panel, --edge, --magenta, --green, --amber, --ink, --muted). Keep every @keyframes in crt.css (CRT effects) or components.css (UI effects). Put all prefers-reduced-motion overrides in a single block at the end of each CSS file.
  - Render the canvas at a fixed logical resolution of 320×180. Scale it with CSS (width:100%, aspect-ratio:16/9, image-rendering:pixelated) and set ctx.imageSmoothingEnabled=false.
  - Before the first canvas text is drawn, await document.fonts.load('8px "Press Start 2P"') so the HUD never shows a fallback font.
  - Wrap every localStorage access in try/catch and fall back to in-memory state so private browsing never throws.
  - public/favicon.svg: a 16×16 pixel coin (amber #ffb627 disc, #05060f outline, a magenta #ff2e88 vertical slot mark), drawn as crispEdges rects. Link it from index.html with <title>[BRAND] — Insert Coin</title>.
  - Write ASSETS.md at the project root listing the two Fontsource font packages (source URL, author, OFL-1.1) and stating that every sprite, icon and illustration is drawn in code.

## Variables
- [BRAND] — Studio name (default: "Lanternbyte Games"). Used in the nav, hero, footer, title and localStorage key prefix
- [HERO_GAME] — Playable hero game title (default: "Lantern Dash"). Shown on the cabinet marquee, on the attract screen and in the primary CTA
- [STUDIO_PITCH] — One-line studio pitch (default: "a three-person studio making pocket-sized pixel games you can finish on a lunch break"). Lowercase fragment that follows the brand name in a sentence
- [HOME_BASE] — City / home base (default: "Tallinn, Estonia")
- [NEWSLETTER_NAME] — Newsletter name (default: "The Save Point")
- [CREDIT] — keep a small "Template by VibeFather" link to https://vibefather.ai/t/arcade-game-studio-landing-page in the footer (default: yes; delete this line to remove it)

The copy under Pages & Sections is written for the default values. If your values differ, rewrite every headline, paragraph, label and image for them — same length, tone and structure. Layout, colors, type and motion stay as described.
Keep all copy, image paths and links in one content file (for example `src/content.ts`), keyed by section, so the content can be swapped later without touching components.

---
**This is the public part of a VibeFather Pro prompt.** The page sections, layout, motion and asset instructions that make the live demo look the way it does are for Pro members: https://vibefather.ai/templates/arcade-game-studio-landing-page?utm_source=github&utm_medium=readme&utm_campaign=awesome-vibe-coding-websites&utm_content=pro-prompt
— Prompt by VibeFather · https://vibefather.ai/t/arcade-game-studio-landing-page · CC BY-NC 4.0 (non-commercial; commercial use needs a VibeFather Pro license) · Request removal: https://vibefather.ai/takedown
