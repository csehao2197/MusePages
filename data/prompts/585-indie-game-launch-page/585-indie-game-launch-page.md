# Indie Game Launch Page

Build this website exactly as described below. Replace the [VARIABLES] with your own values; keep everything else.

## Brief
A single-page launch site for an invented indie game: a full-bleed hand-painted key-art hero with the title set into the painting, three parallax feature beats, an honest trailer placeholder, a painted world-map teaser with glowing location chips, a season-only release window with drawn generic store buttons, and a client-side wishlist/newsletter close.

- Audience: Indie game studios and solo developers launching one atmospheric game, and the agencies building their reveal pages.
- Goal: Sell the mood in one painting, prove the concept in three beats, ground it in a world, and close on a wishlist — while staying honest that this demo sends nothing and ships no video.
- Tone: Hushed and literary, like a note pinned inside a lantern: short evocative lines, warm and slightly solemn; the trailer and store rows speak plainly about being placeholders.

## Stack
- Framework: Vite 5 + React 18 + TypeScript
- Styling: Tailwind CSS 3.4
- Libraries: tailwindcss (MIT), motion (MIT), lucide-react (ISC), @fontsource/cinzel (OFL), @fontsource/alegreya (OFL)
- Build: `npm run build` → static files in `dist/`. No backend, no server code, no external APIs.
- Setup:
  - Scaffold with npm create vite@latest indie-game-launch-page -- --template react-ts; add tailwindcss@3.4, postcss and autoprefixer as dev dependencies; add motion, lucide-react, @fontsource/cinzel and @fontsource/alegreya as dependencies.
  - vite.config.ts: base './', build.sourcemap false, build output dist/.
  - tailwind.config.js: extend colors dusk #141019, duskraised #1E1822, ashline #3A2F33, ember #E86A33, emberdeep #B34A22, parchment #F2E6D4, ashrose #A89599; fontFamily display 'Cinzel' and sans 'Alegreya'; radius: panel 6px and pill 999px.
  - postcss.config.js: tailwindcss + autoprefixer.
  - src/components/ParallaxScene.tsx: wraps a painting in an overflow-hidden frame (6px radius); the img is scaled 1.12 and translated ±2.5% toward the pointer (lerped rAF, enabled only via a matchMedia('(pointer:fine)') check) and ±4% with the section's scroll progress (Motion useScroll + useTransform); both transforms stop under prefers-reduced-motion, where the painting renders at scale 1.02 static.
  - src/components/EmberMotes.tsx: twelve 3px ember dots rising slowly across the hero — positions and durations from a fixed constant array (8–14s loops, alternating delays), pure CSS keyframes, aria-hidden, disabled under prefers-reduced-motion.
  - Store buttons are drawn generic in code: a duskraised pill, a lucide icon (store, gamepad-2, tag), and the literal labels 'Store A', 'Store B', 'Store C' with an ashrose caption 'generic buttons for the demo — no real storefronts'; they anchor to #wishlist, never to external URLs.
  - The trailer block is a placeholder: the poster painting under a 72px ember circle with a lucide play glyph, the caption 'TRAILER — PLACEHOLDER' and the subline 'A painted placeholder; no video ships with this demo.'; clicking nudges the glyph 2px and does nothing else; there is no <video> element anywhere.
  - src/lib/motion.ts: reveal variants (opacity 0→1, y 26→0, 800ms cubic-bezier(0.16,1,0.3,1), 110ms stagger, whileInView once) with useReducedMotion falling back to plain 200ms fades.
  - Keep every user-facing string (game, studio, world name, release window, hero lines, three beats, map chips, form copy) in src/content.ts; sections read from it so values swap in one place.
  - index.html: <title>[GAME] — a hand-painted adventure by [STUDIO]</title> plus a drawn-in-code favicon.svg (an ember dot on the dusk ground); no other meta work.

## Variables
- [GAME] — Game title (default: "Emberveil"). The invented game's name — set into the key art as the masthead, the page title and the wishlist copy.
- [STUDIO] — Studio name (default: "Hollowmoor Games"). The invented studio credited under the title, in the release section and footer.
- [WORLD] — World name (default: "the Ashen Vale"). The invented world the map teaser and copy describe ('the fires went out in [WORLD]').
- [WINDOW] — Release window (default: "the ember season"). A season-style label only — 'coming in [WINDOW]' — never a date, month-number pair or year.
- [CREDIT] — keep a small "Template by VibeFather" link to https://vibefather.ai/t/indie-game-launch-page in the footer (default: yes; delete this line to remove it)

The copy under Pages & Sections is written for the default values. If your values differ, rewrite every headline, paragraph, label and image for them — same length, tone and structure. Layout, colors, type and motion stay as described.
Keep all copy, image paths and links in one content file (for example `src/content.ts`), keyed by section, so the content can be swapped later without touching components.

---
**This is the public part of a VibeFather Pro prompt.** The page sections, layout, motion and asset instructions that make the live demo look the way it does are for Pro members: https://vibefather.ai/templates/indie-game-launch-page?utm_source=github&utm_medium=readme&utm_campaign=awesome-vibe-coding-websites&utm_content=pro-prompt
— Prompt by VibeFather · https://vibefather.ai/t/indie-game-launch-page · CC BY-NC 4.0 (non-commercial; commercial use needs a VibeFather Pro license) · Request removal: https://vibefather.ai/takedown
