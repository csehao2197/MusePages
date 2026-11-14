# Copywriter Website Prompt
# websiteprompts.ai

Build a personal copywriter portfolio website for **Mara Cole** — a freelance copywriter specialising in brand voice, landing pages, and email sequences. Warm, editorial, confident. Tone: "words that sell, not shout." Warm off-white foundation, burnt orange accent, dark ink type.

## Tech Stack
React + Vite + TypeScript + Tailwind CSS + Framer Motion (motion/react) + shadcn/ui + lucide-react

## Design System
```css
:root {
  --background: 36 20% 97%;        /* #faf8f5 warm off-white */
  --surface: 36 16% 93%;           /* #f0ece4 warm grey */
  --border: 36 12% 84%;            /* #ddd7ca border */
  --ink: 30 20% 10%;               /* #1c1610 near-black */
  --muted: 30 10% 50%;             /* #8c7f70 warm grey */
  --primary: 26 88% 48%;           /* #e8700a burnt orange */
  --primary-dark: 26 90% 38%;      /* #b85508 hover */
  --primary-light: 26 60% 94%;     /* #fdf0e6 orange tint */
  --foreground: 30 20% 10%;
}
```

## Typography
Import: `https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400&display=swap`
- Display / H1–H2: Libre Baskerville 700, italic accents in orange
- Body / UI: Plus Jakarta Sans 300–600
- Labels / Tags: JetBrains Mono 400

## Visual Effects

**Underline draw animation** — orange underline below key headline words:
```css
.underline-draw { position: relative; }
.underline-draw::after {
  content: ''; position: absolute; bottom: -4px; left: 0;
  width: 100%; height: 3px; background: hsl(var(--primary));
  transform: scaleX(0); transform-origin: left;
  transition: transform 0.5s cubic-bezier(0.76, 0, 0.24, 1);
}
.underline-draw.in-view::after { transform: scaleX(1); }
```

**Stagger fade-up** — all sections: `initial={{ opacity: 0, y: 24 }}` → `animate={{ opacity: 1, y: 0 }}`, `duration: 0.5, ease: 'easeOut'`, triggered by `useInView`.

**Marquee ticker** — scrolling services strip between hero and work:
```css
.marquee { display: flex; gap: 48px; animation: scroll 18s linear infinite; }
@keyframes scroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }
```

## Sections

**1. Navbar** — sticky, `background: hsl(var(--background)/0.97)`, blur 12px. Left: "Mara Cole" wordmark in Libre Baskerville italic. Center nav: Work · Services · About · Process. Right: "Let's talk" — orange filled button, border-radius 4px, Inter 13px.

**2. Hero** — centered, padding 140px 64px 100px. Badge pill: orange bg tint, "Available for projects · 2026" in JetBrains Mono 10px. H1 in Libre Baskerville 700, clamp(56px, 7vw, 96px), line-height 0.95, max-width 900px:
```
Transforming ideas into
compelling copy.
```
"copy." in Libre Baskerville italic, color primary, with underline-draw animation.
Sub: Plus Jakarta Sans 16px muted, max-width 480px, centered: "Brand voice, landing pages, email sequences — written to convert without feeling like a sales pitch."
Two CTAs: "See my work" (orange filled) + "Download rate card" (ghost border). Below: row of 5 client logo placeholders in muted grey.

**3. Services ticker** — full-width warm surface strip, 48px tall, overflow hidden. Repeating marquee: "Brand Voice · Landing Pages · Email Sequences · Case Studies · Website Copy · Ad Copy · Brand Voice · Landing Pages ···" — JetBrains Mono 11px, separated by orange dots.

**4. Selected Work** — padding 96px 64px. Header: H2 "Work that speaks." (italic "speaks." in orange). 3-card vertical list layout (not grid) — each card full-width, `border-top: 1px solid hsl(var(--border))`, padding 32px 0, flex row: left (project number + client + tags) + center (project name + 1-line description) + right (read case study → link in orange). Hover: background tints to `hsl(var(--primary-light))`. 3 projects: Brand voice overhaul for a SaaS company · Launch sequence for a DTC skincare brand · Website copy for a fintech startup.

**5. About** — two-column, 1fr 1fr, padding 96px 64px, background surface. Left: portrait photo:
```
{/* Image: confident young woman freelancer at a tidy desk with warm natural light, laptop open, plants and books in background, candid professional portrait, warm tones */}
```
Right: H2 "Words are my design tool." + 3 short paragraphs (personal approach, process, values). Below: row of credential chips in JetBrains Mono — 5 yrs freelance · 80+ clients · UK & remote · Featured in Copyhackers.

**6. Process** — centered, padding 96px 64px. H2 "How we'll work together." 4-step horizontal row on desktop, stacked on mobile. Each step: large number in Libre Baskerville 700 80px faded orange (opacity 0.15) behind step name. Steps: 01 Discovery call → 02 Brief & proposal → 03 First draft → 04 Revisions & delivery.

**7. Testimonials** — background surface, padding 96px 64px. H2 "From clients." 3-column card grid. Each: star row (★★★★★ orange) + quote in Libre Baskerville italic 15px + client name + company. Stagger fade-up entrance.

**8. CTA Banner** — full-width orange background `hsl(var(--primary))`, padding 80px 64px, centered. H2 in Libre Baskerville 900 italic white: "Let's write something great." Sub in white 70% opacity. Two buttons: "Book a discovery call" (white bg, orange text) + "Email me directly" (ghost white border). Below: "Usually responds within 24 hours" — JetBrains Mono 11px white 50%.

**9. Footer** — dark ink background `hsl(var(--ink))`, padding 48px 64px 28px. Left: "Mara Cole" wordmark white + "Freelance Copywriter · London & Remote". Center: nav links in muted white. Right: social links (LinkedIn, Twitter/X, Substack). Bottom bar: copyright + "Built with Framer" in JetBrains Mono 10px muted.

## Responsive
Mobile: nav → hamburger overlay · hero H1 clamp(42px, 11vw, 64px) · work cards stack vertically · about single column · process 2×2 grid · testimonials horizontal scroll snap.

## Animations Summary
| Element | Animation | Trigger |
|---|---|---|
| Hero H1 | Fade-up + underline draw | On mount |
| Marquee ticker | Continuous scroll | Always |
| Work cards | Stagger fade-up | Scroll |
| Step numbers | Count fade-up | Scroll |
| Testimonials | Stagger fade-up | Scroll |
| CTA banner | Fade-up | Scroll |

## Key Dependencies
```json
{ "motion": "^12.x", "lucide-react": "^0.400.x" }
```

> **Quick notes:** "Mara Cole" and all copy are placeholders — swap name, location, and project examples. The rate card download link needs a real PDF. Logo strip in hero should use real client logos or be removed if none available.
