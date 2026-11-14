# Designer Portfolio Website Prompt
# websiteprompts.ai

Build a personal portfolio website for **Paul Smith** — a product and UI/UX designer crafting clean, modern digital experiences. Near-black dark foundation, white type, abstract 3D accent object in hero. Minimal, confident, typographically bold. Inspired by high-end digital product studios.

## Tech Stack
React + Vite + TypeScript + Tailwind CSS + Framer Motion (motion/react) + shadcn/ui + lucide-react

## Design System
```css
:root {
  --background: 0 0% 4%;            /* #0a0a0a near-black */
  --surface: 0 0% 7%;               /* #121212 card surface */
  --surface-raised: 0 0% 10%;       /* #1a1a1a raised */
  --border: 0 0% 14%;               /* #242424 border */
  --foreground: 0 0% 96%;           /* #f5f5f5 off-white */
  --muted: 0 0% 45%;                /* #737373 muted */
  --primary: 270 80% 68%;           /* #a855f7 purple accent */
  --primary-dark: 270 84% 55%;      /* #8b25f0 hover */
  --primary-glow: 270 80% 68% / 0.15; /* glow tint */
  --mono: 'JetBrains Mono', monospace;
}
```

## Typography
Import: `https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700;800&family=JetBrains+Mono:wght@400&display=swap`
- Display / H1–H2: Sora 700–800, letter-spacing -0.04em
- Body / UI: Sora 300–500
- Labels / Tags: JetBrains Mono 400

## Visual Effects

**3D abstract hero object** — centered glowing 3D shape (fluid or floral abstract form):
```
{/* 3D Object: abstract fluid sculptural shape, glossy near-black metallic surface with subtle purple iridescent highlights, floating centered on pure black background, studio lighting from above */}
<img src="" alt="Abstract 3D sculptural design object"
  className="w-full h-full object-contain" />
```
Wrap in div with `filter: drop-shadow(0 0 60px hsl(270 80% 68% / 0.3))`. Animate: `animate={{ y: [0, -12, 0] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}`.

**Glow card hover** — portfolio and service cards on hover:
```css
transition: border-color 0.18s, box-shadow 0.18s;
&:hover { border-color: hsl(var(--primary)); box-shadow: 0 0 40px hsl(270 80% 68% / 0.15); }
```

**Clip-path text reveal** — H1 lines: `initial={{ clipPath: 'inset(0 100% 0 0)' }}` → `animate={{ clipPath: 'inset(0 0% 0 0)' }}`, duration 0.65s, `ease: [0.76, 0, 0.24, 1]`, stagger 0.1s per line.

**Cursor glow** — 200px soft purple radial gradient follows cursor:
```css
.cursor-glow { position: fixed; width: 200px; height: 200px; border-radius: 50%;
  background: radial-gradient(circle, hsl(270 80% 68% / 0.06), transparent 70%);
  pointer-events: none; transform: translate(-50%, -50%); z-index: 0; }
```
Update position with `mousemove` event listener.

## Sections

**1. Navbar** — fixed, `background: hsl(var(--background) / 0.92)`, blur 12px, border-bottom 1px border. Left: "Paul Smith" Sora 700 16px white. Center: Portfolio · About · Services · Technologies · Hire me. Right: "Hire me →" — purple filled button, border-radius 6px, Sora 600 12px.

**2. Hero** — full viewport, flex center column, text-align center, position relative. Badge: purple tint pill "Available for hire" with pulsing purple dot. H1 clip-path reveal, Sora 800, clamp(52px, 7vw, 96px), line-height 0.92, letter-spacing -0.04em, white:
```
Product designer crafting
clean & modern designs.
```
Sub: Sora 300 16px muted, "Turning complex problems into intuitive interfaces. 5 years · 40+ projects." centered, max-width 460px, margin-top 20px.
CTAs: "Explore →" (purple filled, Sora 600 13px, border-radius 8px) + "Download CV" (ghost border). Below CTAs: 3D object centered, ~500×500px, with glow. Bottom: row of 4 tech logo marks (Figma · Framer · Webflow · Adobe) in muted white 30%.

**3. Selected Work** — padding 100px 64px. H2 "Selected work." Sora 800 clamp(40px, 5vw, 64px). Below: 2-column asymmetric project grid, gap 16px. Large card (col-span 2 on first): project screenshot/mockup image + overlay on hover (project name + category + "View case study →"). Small cards (2 per row): same pattern. 5 projects total. Each card `background: hsl(var(--surface))`, border, border-radius 12px, overflow hidden, aspect-ratio 16/9 for image, glow hover.
```
{/* Project image brief: clean product UI mockup on dark background, purple accent colors, modern dashboard or mobile app design */}
```

**4. About** — two-column, padding 96px 64px. Left: H2 "Crafting products people love." Sora 800. 3 paragraphs (background, process, tools). Credential chips: Sora 700 · Product Design · 5 yrs exp · 40+ projects · Remote-friendly.
Right: portrait + floating stack card showing tools grid (Figma / Framer / Adobe / Webflow icons in small surface cards).
```
{/* Image: young male designer at minimal dark desk setup, dual monitors, ambient purple light, calm focused atmosphere */}
```

**5. Services** — surface bg, padding 96px 64px. H2 "What I do." 3-column card grid. Each card: JetBrains Mono 10px category tag + Sora 700 18px service name + 2-line desc + starting price. Glow hover. Services: UI/UX Design from $2,400 · Framer Development from $1,800 · Design Systems from $3,200.

**6. Technologies** — centered strip, padding 60px 64px. H2 "Technologies." Icon grid 6 across — Figma · Framer · Webflow · React · Adobe · Notion. Each: icon placeholder + name in JetBrains Mono 10px. Muted default, white on hover.

**7. Testimonials** — padding 96px 64px. H2 "From clients." 3 cards in row. Each: purple top border 2px + quote Sora 300 italic 14px + name Sora 600 + role JetBrains Mono 10px muted. Stagger fade-up.

**8. CTA** — full-width near-black, padding 80px 64px, centered. Radial purple glow behind text (opacity 0.08). H2 Sora 900: "Let's build something." Sub muted. "Start a project →" (purple filled large) + "Or email me" (text link purple). Below: response time note JetBrains Mono muted.

**9. Footer** — `hsl(0 0% 3%)`, padding 40px 64px 24px. Left: "Paul Smith" + role. Right: social links (Dribbble, Behance, LinkedIn, GitHub). Bottom: copyright JetBrains Mono 10px muted.

## Responsive
Mobile: nav hamburger overlay · hero H1 clamp(40px, 12vw, 64px) · 3D object 280px · work grid single column · services stack · about single column.

## Animations Summary
| Element | Animation | Trigger |
|---|---|---|
| Hero H1 | Clip-path reveal stagger | On mount |
| 3D object | Float loop y 0→-12→0, 5s | Always |
| Cursor glow | Follow cursor | Always |
| Work cards | Stagger fade-up | Scroll |
| Service cards | Stagger fade-up + glow hover | Scroll |
| CTA | Fade-up | Scroll |

## Key Dependencies
```json
{ "motion": "^12.x", "lucide-react": "^0.400.x" }
```

> **Quick notes:** Purple accent swaps easily to any brand color via `--primary`. 3D object is image-described — Bolt/Lovable will generate an abstract shape. Case study links need real portfolio URLs or CMS. Swap "Paul Smith" with real name throughout.
