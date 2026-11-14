# Ninefold: Game Studio Website Prompt

## 1. Goal
Build a confident, restrained website for **Ninefold**, an eleven person independent game studio. Near black, bone text, one signal green accent, a heavy grotesk, and one signature: a small pixel character that walks along a hairline across the page. Studio, not storefront.

## 2. Tech Stack
```
React + Vite + TypeScript + Tailwind CSS + Framer Motion (motion/react)
```
No component libraries, no video player, no game embeds. Store buttons are links. `lucide-react` only for the arrow glyph.

## 3. Design system
```css
:root {
  --paper: #ECE8E1;            /* bone, used as text on dark */
  --ink: #131417;              /* the default ground */
  --accent: #79C043;           /* signal green */
  --on-accent: #131417;
  --surface: #1C1E22;
  --muted: #8D9099;
  --line: rgba(236,232,225,0.15);
  --radius: 8px;
  --panel-radius: 24px;
}
```
This site is dark led: `--ink` is the ground and `--paper` is the text. Rhythm: dark, dark, surface, light, dark, accent, dark footer. One light section, deliberately, for the team.

## 4. Typography
```html
<link href="https://fonts.googleapis.com/css2?family=Archivo:wght@500;700;900&family=Inter:wght@300;400&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet" />
```
- **Display:** Archivo 900, uppercase, clamp(52px, 8vw, 132px), line-height 0.9, letter-spacing -0.04em
- **Body:** Inter 300, 16px, line-height 1.6
- **Meta layer:** IBM Plex Mono 400, 11px, uppercase, letter-spacing 0.06em. Release dates, platforms, player counts, index labels.
- No italics. Emphasis by a whole line in signal green.

## 5. Signature element
**A pixel walker.** A 16 by 16 pixel character, drawn as a grid of small divs in bone and green, walks along the hairline that separates the hero from the next section. It moves in steps rather than smoothly, using a CSS `steps()` animation for both the walk cycle and the travel, so it reads as a sprite and not as a tween. It crosses the screen once every 40 seconds, left to right, then starts again.

No canvas, no sprite sheet, no sound. One character, one line, nothing else.

## 6. Sections, each a different skeleton

1. **Navbar**: 70px, transparent over the hero, wordmark left, four links right in mono, green pill with a round arrow circle. Solid after 80px of scroll.
2. **Hero, signature word**: the studio name set across the full width along the bottom edge in Archivo 900, with a full bleed key art image above it and a short line top left. Min height `clamp(560px, 80vh, 860px)`. *Image: moody key art of a lone figure on a rope bridge above fog, painterly, no text.*
3. **The pixel line**: the walker (section 5) on the hairline directly beneath the hero.
4. **Games, index swap**: dark. Three game titles listed large on the left. Hovering one swaps the key art on the right and a mono line of platforms and release date. *Images: three distinct key arts, a rope bridge, an underwater station, a snowbound village.*
5. **Currently making, statement**: surface. One paragraph at 24px starting at one third, label `001/ In development` in the left column, and a mono line with the target year.
6. **The studio, credits list**: light bone ground, inset 16px, `--panel-radius`. Eleven names in rows with roles on the right in mono, dark text on bone. Hovering a row shows a small portrait near the cursor.
7. **How we work, numbered rows**: dark. Four rows on hairlines: small team, one game at a time, no crunch, published by ourselves.
8. **Press and awards, ruled list**: dark. Six rows: publication or festival, quote or award, year in mono.
9. **One quote**: dark. A single centred quote in Archivo 500 at 26px with a signature line in mono.
10. **Work with us, accent panel**: green ground, dark text, inset panel. One line about the two open roles, two actions, and a mono note about where the studio is.
11. **Footer**: dark. Giant cropped `NINEFOLD` wordmark, address, three small links, and the walker resting at the end of its line.

## 7. Motion
- Hero wordmark rises 24px once, 1s.
- Key art settles from `scale 1.04` over 1.3s.
- Pixel walker runs continuously in steps, as described.
- Index swap crossfades key art over 0.2s.
- Credits portrait follows the cursor with a soft spring.
- Ease `cubic-bezier(.22,1,.36,1)`, respect `prefers-reduced-motion` by parking the walker at the left end.

## 8. Responsive
- **Mobile under 768px:** wordmark drops to two lines at 52px. Index swap loses the hover art and shows a small thumbnail per row. Credits list loses the cursor portrait. The walker still walks but at half speed. No horizontal page scroll.
- **Tablet:** index swap keeps the art at reduced size.
- **Desktop:** content max-width 1280px, gutters 40px, section padding 120px.

## 9. Full copy

**Wordmark:** NINEFOLD. Meta: `ELEVEN PEOPLE. BRISTOL. ONE GAME AT A TIME.`

**Nav:** Games, Studio, Press, Jobs. Button: `Press kit`

**Hero**
- Line top left: `We make small games about difficult places.`
- Wordmark across the bottom: `NINEFOLD`

**Games** (label `000/ Games`)
- **ROPE**: `A climbing game with no combat and one very long bridge.` `PC, SWITCH, PS5. MARCH 2025.`
- **TIDEHOLD**: `Maintaining an underwater station while it slowly floods.` `PC, XBOX. NOVEMBER 2023.`
- **LAST BUS TO VELKA**: `A snowbound village, one night, eleven conversations.` `PC. JUNE 2022.`

**Currently making** (label `001/ In development`)
`We are two years into a game about a lighthouse keeper who is also a cartographer, and we are not going to say much more than that until it is playable. It has no combat either. Our publisher is us, so the only deadline is the one where the money runs out, which is currently the autumn after next.`
Mono: `TARGET: 2028. PC FIRST.`

**The studio** (label `002/ Eleven people`)
- `MAUD FERRIS` ... `Creative director`
- `TOBY ANAND` ... `Studio lead`
- `SOFIA KLEIN` ... `Lead engineer`
- `JONAH PRICE` ... `Engine and tools`
- `AMARA OBI` ... `Gameplay engineer`
- `RUAIRI DOYLE` ... `Art director`
- `ELSA BERG` ... `Environment art`
- `KIT NAKAMURA` ... `Character art`
- `PAVEL RUZICKA` ... `Animation`
- `NORA HALL` ... `Audio and music`
- `DANIEL OKE` ... `Production`

**How we work** (label `003/ Principles`)
- **01 Eleven people, and that is the ceiling.** `Every person we add makes the game slower before it makes it better.`
- **02 One game at a time.** `No side projects, no contract work, no ports handled in house.`
- **03 No crunch, and we mean the boring version.** `Thirty five hour weeks, tracked. Two people are part time and always will be.`
- **04 We publish ourselves.** `Slower, smaller, and nobody asks us to add a battle pass.`

**Press and awards** (label `004/ Press`)
- **Eurogamer**: `A game that trusts you to be bored for ten minutes.` `2025`
- **Edge**: `8 out of 10.` `2025`
- **BAFTA Games**: `Nominated, Original Property.` `2024`
- **IGF**: `Honourable mention, Excellence in Narrative.` `2023`
- **Rock Paper Shotgun**: `The best thing we played all November.` `2023`
- **Develop:Brighton**: `Indie Studio of the Year, shortlist.` `2023`

**Quote:** `They shipped a climbing game with no failure state and somehow it is the tensest thing on the platform.`
Signature: `Edge, issue 402`

**Work with us panel**
- Line: `Two roles open: a gameplay engineer and an environment artist.`
- Actions: `See both roles`, `Ask a question first`
- Mono: `BRISTOL, THREE DAYS IN THE STUDIO. NO FULLY REMOTE, SORRY.`

**Footer**
`NINEFOLD`, `Unit 2, Jamaica Street, Bristol BS2 8JP`, `hello@ninefold.games`
Links: `Games`, `Press kit`, `Jobs`

## 10. Never
Glassmorphism, gradients, glow, neon, drop shadowed cards, icon grids, emoji, autoplaying trailers, stat soup like "2 million players", lorem ipsum, dashes of any kind in the copy, more than two fonts plus the mono meta layer, `100vh` heroes, identical stripes.

## 11. Dependencies
```json
{ "motion": "^12.0.0", "lucide-react": "^0.460.0", "clsx": "^2.1.0" }
```
