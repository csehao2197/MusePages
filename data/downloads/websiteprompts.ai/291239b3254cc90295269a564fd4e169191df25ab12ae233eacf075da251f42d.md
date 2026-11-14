# Sports Coach Website Prompt
# websiteprompts.ai

Build a sports coach and personal trainer website for **Jake Perform** — an elite cycling and endurance sports coach. Full-bleed dark action photo hero, dark surface, bold white type, fresh green accent. High-energy but precise — this is serious performance, not a gym bro brand.

## Tech Stack
React + Vite + TypeScript + Tailwind CSS + Framer Motion (motion/react) + shadcn/ui + lucide-react

## Design System
```css
:root {
  --background: 220 18% 8%;         /* #0f1118 near-black blue-grey */
  --surface: 220 14% 11%;           /* #161b24 surface */
  --surface-raised: 220 12% 14%;    /* #1e2530 raised */
  --border: 220 10% 20%;            /* #2a3040 border */
  --foreground: 210 20% 95%;        /* #f0f3f8 off-white */
  --muted: 220 10% 50%;             /* #707a90 muted blue-grey */
  --primary: 142 68% 48%;           /* #20c758 performance green */
  --primary-dark: 142 72% 36%;      /* #189840 hover */
  --primary-glow: 142 68% 48% / 0.15;
  --mono: 'JetBrains Mono', monospace;
}
```

## Typography
Import: `https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700;800&family=JetBrains+Mono:wght@400&display=swap`
- Display / H1–H2: Sora 700–800, letter-spacing -0.03em
- Body / UI: Sora 300–500
- Stats / Labels / Data: JetBrains Mono 400

## Visual Effects

**Full-bleed hero photo** — composition-independent with gradient:
```
{/* Image: elite cyclist in full racing kit riding at speed on an empty road, motion blur background, dramatic low angle, overcast moody sky, high intensity athletic action */}
```
Gradient overlay (independent of subject position):
```css
background: linear-gradient(
  to bottom,
  rgba(15,17,24,0.3) 0%,
  rgba(15,17,24,0.5) 40%,
  rgba(15,17,24,0.92) 80%,
  rgba(15,17,24,1) 100%
);
```

**Green glow stat** — performance stat numbers with green text-shadow:
```css
.stat-num { color: hsl(var(--primary)); text-shadow: 0 0 30px hsl(142 68% 48% / 0.4); }
```

**Count-up stats** — useSpring + useInView, triggered on scroll.

**Stagger fade-up** — 0.5s per-section, IntersectionObserver.

## Sections

**1. Navbar** — fixed, `background: hsl(var(--background)/0.94)`, blur 12px, border-bottom. Left: "Perform" Sora 800 18px white + JetBrains Mono 10px green tag "Sports Coach". Center: Training · Results · About · Contact. Right: "Get started" — green filled, border-radius 6px. Visible star row "★★★★★" in JetBrains Mono 10px + "350+ athletes coached" next to CTA.

**2. Hero** — full viewport, position relative, overflow hidden. Background: full-bleed action photo + gradient overlay (Visual Effects). Content z-10, positioned bottom of viewport, padding 0 64px 80px: JetBrains Mono 10px green uppercase "ELITE PERFORMANCE COACHING". H1 Sora 800, clamp(56px, 8vw, 100px), line-height 0.92, white:
```
Level Up Your
Performance.
```
"Performance." in green. Sub Sora 300 15px muted, max-width 420px: "Structured training programmes for cyclists, runners, and endurance athletes. Data-driven. Results-proven." Two CTAs: "Start training →" (green filled) + "See results" (ghost white). Below CTAs: client proof row — 5 avatar image placeholders + "Joined by 350+ athletes" JetBrains Mono 11px muted.

**3. Stats strip** — full-width surface, border-top + bottom, padding 24px 64px. 4 stats with count-up: 350+ athletes coached · 12 yrs coaching · 4.9★ avg rating · 87% hit PB in 12 weeks. Each: JetBrains Mono number green glow + Sora 12px muted label. Dividers between items.

**4. Training Programmes** — padding 96px 64px. H2 "Choose your programme." 3-column card grid. Each card surface bg, border, border-radius 10px, padding 32px. JetBrains Mono 10px green tag + Sora 700 20px name + description 2 lines muted + included features list (3 items, lucide `Check` green icons) + price JetBrains Mono 14px green + "Enquire →" green link. Middle card: featured, green border, "Most popular" badge. Programmes: Foundations 8-week · Performance 16-week · Elite 6-month.

**5. Results** — surface bg, padding 96px 64px. H2 "Real results." 3-column grid. Each card: athlete photo (square, rounded-lg) + name Sora 700 + sport JetBrains Mono 10px muted + key result in green + short quote italic Sora 300 14px. Results examples: "Finished first Ironman" · "-8 min marathon PB" · "Qualified for nationals".
```
{/* Athlete photo: athlete portrait outdoors, post-race or training environment, determined expression, sports kit */}
```

**6. About** — two-column, padding 96px 64px. Left: H2 "The coach behind the plan." Sora 800. 3 paragraphs: background, coaching philosophy, certifications. Credential chips JetBrains Mono 10px: UCI Level 3 · British Cycling · 12 yrs experience · Data-driven approach. Right: coach portrait photo:
```
{/* Image: athletic male sports coach outdoors, professional confident pose, cycling or running context, natural light, high contrast */}
```

**7. How It Works** — centered, padding 96px 64px. H2 "From day one to new PB." 4 horizontal steps: 01 Free strategy call → 02 Custom training plan → 03 Weekly coaching check-ins → 04 Hit your goal. Each: JetBrains Mono large faded number (opacity 0.1 green) + step name Sora 700 + 1-line description.

**8. CTA Banner** — green bg `hsl(var(--primary))`, padding 72px 64px, centered. Dark diagonal texture overlay (black 5% opacity). H2 Sora 800 dark: "Ready to train smarter?" Sub dark 70%. CTAs: "Book a free call" (black bg, white text) + "See all programmes" (ghost dark border). JetBrains Mono 11px dark 50%: "Free 30-min strategy call · No commitment."

**9. Footer** — `hsl(220 18% 5%)`, padding 48px 64px 28px. 3-column: Brand (logo + tagline + socials) / Programmes links / Company links. Bottom: copyright + "Certified sports coach · Regulated by British Cycling" JetBrains Mono 10px muted.

## Responsive
Mobile: nav hamburger · hero H1 clamp(44px, 12vw, 72px) · stats strip 2×2 · programmes stack single column · results 2-column · about single column · steps 2×2.

## Animations Summary
| Element | Animation | Trigger |
|---|---|---|
| Hero content | Stagger fade-up | On mount |
| Stats | Count-up useSpring | Scroll |
| Programme cards | Stagger fade-up | Scroll |
| Results cards | Stagger fade-up | Scroll |
| Steps | Stagger fade-up | Scroll |
| CTA | Fade-up | Scroll |

## Key Dependencies
```json
{ "motion": "^12.x", "lucide-react": "^0.400.x" }
```

> **Quick notes:** "Jake Perform" brand name is a placeholder — swap throughout. Hero photo must be high-quality action photography for full effect. Certification mentions should reflect real credentials. Pricing is indicative only.
