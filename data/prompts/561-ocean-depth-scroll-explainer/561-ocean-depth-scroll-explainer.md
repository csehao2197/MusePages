# Ocean Depth Scroll Explainer

Build this website exactly as described below. Replace the [VARIABLES] with your own values; keep everything else.

## Brief
A single-page interactive explainer for [BRAND] called [TITLE]: one very tall scroll is a dive through [SUBJECT], from 0 m at the surface down to the bottom of the last zone in [ZONES]. A full-screen intro shows the waterline. Then the dive section maps scroll to depth: every zone in [ZONES] gets an equal share of the scroll and depth runs linearly inside each share. A fixed depth gauge shows the live metre readout, the zone name, light, pressure and temperature. The page background color is interpolated by depth from sunlit cyan to near-black. Two short serif chapters per zone fade in and out on alternating sides. Six real public-domain NOAA photographs pass as framed plates in the first three zones and desaturate as the water darkens. A canvas draws marine snow, surface light shafts, jellyfish, a lanternfish school and an anglerfish that react to the cursor, and a seafloor at the bottom. The page ends on the seafloor with one glowing organism the visitor can press and hold to make it flare, followed by a visit line and a button back to the surface. Static site, no backend, no audio.

- Audience: Visitors of a small ocean science centre, school classes aged 9–14 and their teachers, and curious adults on phones or laptops. Also science centres, museums, teachers and science writers who want a layered subject (ocean, atmosphere, rock strata) to feel physical.
- Goal: Make the scale of the ocean felt rather than read: the reader should finish knowing the zone names, roughly how deep each goes, and one memorable fact per zone, and should want to visit [BRAND]'s Deep Room in person.
- Tone: Quiet, precise, slightly poetic. Short declarative sentences, real numbers, no exclamation marks, no hype. Headlines read like captions in a good museum; body lines are one or two sentences of plain science.

## Stack
- Framework: Vite 5 + vanilla TypeScript
- Styling: Plain CSS, custom properties
- Libraries: gsap 3 (core + ScrollTrigger) (GSAP Standard 'no charge' license), lenis (MIT), vite (MIT), typescript (Apache-2.0), @fontsource-variable/fraunces (OFL-1.1), @fontsource-variable/manrope (OFL-1.1), @fontsource/dm-mono (OFL-1.1)
- Build: `npm run build` → static files in `dist/`. No backend, no server code, no external APIs.
- Setup:
  - Scaffold with npm create vite@latest using the vanilla-ts template. No UI framework. One page: index.html plus src/main.ts.
  - vite.config.ts: base './', build { outDir: 'dist', sourcemap: false, assetsInlineLimit: 0 }. Do not copy src/ into dist/.
  - File layout: src/content.ts (every string, the ZONES list, chapters, plates, credits), src/depth.ts (scroll→depth mapping, color stops, light/pressure/temperature functions), src/scene/ (Ocean.ts canvas loop, Snow.ts, Shafts.ts, Jelly.ts, Lanternfish.ts, Angler.ts, Seafloor.ts, Glow.ts), src/ui/ (Intro.ts, Gauge.ts, Chapters.ts, Plates.ts, Finale.ts, Cursor.ts), src/styles.css.
  - Fonts: in src/main.ts import '@fontsource-variable/fraunces', '@fontsource-variable/fraunces/wght-italic.css', '@fontsource-variable/manrope', '@fontsource/dm-mono/400.css' and '@fontsource/dm-mono/500.css'. CSS families: 'Fraunces Variable', 'Manrope Variable', 'DM Mono', each with a serif / sans-serif / monospace fallback.
  - Smooth scroll: new Lenis({ lerp: 0.085, wheelMultiplier: 0.9, smoothWheel: true }); lenis.on('scroll', ScrollTrigger.update); gsap.ticker.add(t => lenis.raf(t * 1000)); gsap.ticker.lagSmoothing(0). gsap.registerPlugin(ScrollTrigger). Under prefers-reduced-motion do not create Lenis (native scroll).
  - ZONES parsing in src/content.ts: split [ZONES] on ', ', each item 'Name start–end' (en dash or hyphen) gives { name, start, end } in metres. Validate that zones are contiguous and start at 0; MAX = last zone end. The page supports 3 to 6 zones.
  - Section heights are set in px from window.innerHeight on load and recomputed only when the viewport width changes (so mobile toolbars do not jump the page): #intro = 1 × vh, #dive = N × 3.6 × vh (N = number of zones), #finale = 1.8 × vh.
  - Photos live in public/images/ under the exact file names in Assets and are referenced with relative paths ('./images/plate-1-kelp-canopy.jpg'). Write ASSETS.md at the project root before building.
  - All colors are CSS custom properties on :root in src/styles.css and mirrored in src/depth.ts for the canvas and the interpolation.
  - dist/ contains index.html, hashed JS/CSS, woff2 files, favicon.svg and the six photos (about 3 MB). Keep it under 20 MB.

## Variables
- [BRAND] — Organisation or project name (default: "Tidewell Ocean Lab"). Shown top-left, in the intro eyebrow, the finale and the <title>.
- [TITLE] — Title of the dive (default: "Six Thousand Metres"). Two to four words. The last word is set in italic on its own line in the intro.
- [SUBJECT] — What the reader descends through (default: "the open ocean"). Lower-case phrase used inside sentences, e.g. 'a deep ocean trench'.
- [ZONES] — Zones with depth ranges in metres, top to bottom (default: "Sunlight 0–200, Twilight 200–1000, Midnight 1000–4000, Abyss 4000–6000"). 3–6 zones, contiguous, first starts at 0. The last end is the maximum depth. Two chapters are written per zone.
- [VISIT_LINE] — Practical line: place, hours, price (default: "Deep Room, 14 Brinewater Quay, Port Halden · Tue–Sun 10:00–17:30 · Adults $14, under-16s free")
- [CREDIT] — keep a small "Template by VibeFather" link to https://vibefather.ai/t/ocean-depth-scroll-explainer in the footer (default: yes; delete this line to remove it)

The copy under Pages & Sections is written for the default values. If your values differ, rewrite every headline, paragraph, label and image for them — same length, tone and structure. Layout, colors, type and motion stay as described.
Keep all copy, image paths and links in one content file (for example `src/content.ts`), keyed by section, so the content can be swapped later without touching components.

---
**This is the public part of a VibeFather Pro prompt.** The page sections, layout, motion and asset instructions that make the live demo look the way it does are for Pro members: https://vibefather.ai/templates/ocean-depth-scroll-explainer?utm_source=github&utm_medium=readme&utm_campaign=awesome-vibe-coding-websites&utm_content=pro-prompt
Inspired by Descent — an interactive scroll journey from the ocean surface to the abyss by @ohmiler — https://ohmiler.github.io/opus-5.5/underwater-journey/
— Prompt by VibeFather · https://vibefather.ai/t/ocean-depth-scroll-explainer · CC BY-NC 4.0 (non-commercial; commercial use needs a VibeFather Pro license) · Request removal: https://vibefather.ai/takedown
