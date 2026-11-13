# Architect / Architecture Firm Website Prompt
# websiteprompts.ai

Build an ultra-minimal architecture firm portfolio website called "Forma Studio" using React + Vite + TypeScript + Tailwind CSS + Framer Motion (motion/react) + shadcn/ui + lucide-react.

## Design System

### Colors
```css
:root {
  --background: 0 0% 98%;           /* near-white #fafafa */
  --foreground: 0 0% 8%;            /* near-black #141414 */
  --primary: 0 0% 8%;               /* black — no color accent */
  --primary-foreground: 0 0% 98%;
  --surface: 0 0% 94%;
  --muted-foreground: 0 0% 52%;
  --border: 0 0% 88%;
}
```

No color accent. Pure black and white. All depth comes from typography scale and spacing.

### Typography
- Import: `https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;700&display=swap`
- All text: Space Grotesk
- Headlines: Space Grotesk 700 — very large
- Body: Space Grotesk 300–400
- Labels: Space Grotesk 500 uppercase 10px letter-spacing 0.15em

## Sections

### 1. Navbar
- Minimal sticky white navbar, no background color (transparent on load, white on scroll)
- Left: "FORMA" in Space Grotesk 700 uppercase letter-spacing 0.2em
- Right: Work · Studio · Services · Contact (Space Grotesk 400 uppercase 11px) + thin "→ Get in touch" text link

### 2. Hero
- Full-viewport height, white background
- Large full-bleed project image covers 70% of viewport height, full width, no border radius, object-cover
- Gradient overlay bottom only: `linear-gradient(to top, rgba(250,250,250,1) 0%, transparent 40%)`
- Below image: left-aligned content in normal page flow
  - Space Grotesk 300 uppercase 10px muted label: "Architecture & Interior Design — London"
  - Space Grotesk 700 `clamp(56px, 8vw, 128px)` bold headline: "Space.\nLight.\nPurpose."
  - One CTA: "View our work →" (black filled, Space Grotesk 500) + "About the studio" text link

{/* Image brief: modern minimalist building exterior, clean lines, large glass facade, overcast natural light, architectural photography */}

### 3. Project Grid
- "Selected Work" — Space Grotesk 700 large + "( 12 projects )" in Space Grotesk 300 muted right-aligned
- Masonry grid: 2 columns, 6 project images, varying heights (aspect-ratio 4/3 and 3/4 alternating)
- Each image: on hover, black overlay opacity 0→0.85 with project name (Space Grotesk 700 white large) + category (Space Grotesk 300 uppercase 10px muted) + year
- `transition: 0.3s ease`
- No border radius on images
- Stagger fade-in: opacity 0→1, 0.4s, index * 0.1s

{/* Image brief: minimalist residential interior, concrete walls, large windows, natural light, Scandinavian aesthetic */}
{/* Image brief: modern office building exterior, geometric facade, glass and steel, daytime */}
{/* Image brief: luxury apartment interior, open plan, floor to ceiling windows, city view */}
{/* Image brief: cultural building architecture, clean concrete, dramatic shadows, wide angle exterior */}
{/* Image brief: minimalist kitchen interior, white cabinets, marble island, natural light */}
{/* Image brief: architectural detail, concrete staircase, dramatic light and shadow */}

### 4. Services
- "What We Do" — Space Grotesk 700 + thin `border-top: 1px solid hsl(var(--border))`
- 4 service rows as horizontal list items, full-width, `border-bottom: 1px solid hsl(var(--border))`
- Each: Space Grotesk 700 large service name left + Space Grotesk 300 description right + "→" icon far right
- On hover: background transitions to near-black, all text inverts to white, `transition: 0.2s`
- Services: Architecture · Interior Design · Renovation & Extension · Planning Consultancy

### 5. About / Studio
- Large Cormorant italic pull quote — wait, use Space Grotesk 300 italic: "We believe the best spaces are felt before they are understood."
- `font-size: clamp(28px, 3vw, 48px)`, centered, max-width 800px
- Below: two-column grid: left portrait of founding architect, right studio info
- Space Grotesk 700: "Tom Hargreaves, Founder"
- Space Grotesk 300 bio + awards chips: RIBA Award 2023 · Dezeen Shortlist · ARB Registered

{/* Image brief: male architect portrait, minimal office, architectural drawings, natural light, serious professional */}

### 6. Stats Strip
- Full-width near-black `#141414` background, 80px tall
- 4 white stats in Space Grotesk 700: "48 Projects" · "12 Countries" · "RIBA Award 2023" · "Est. 2014"
- Space Grotesk 300 uppercase 10px labels below each stat
- Framer Motion useSpring count-up on scroll (numbers)

### 7. Process
- "How We Work" — Space Grotesk 700
- 4 phases as numbered horizontal steps: `01 Brief & Vision → 02 Concept Design → 03 Planning & Build → 04 Handover`
- Large faded black Space Grotesk 700 number (opacity 0.06) behind each step
- Space Grotesk 300 description per phase

### 8. Contact CTA
- Full-width near-black background
- Space Grotesk 700 white `clamp(48px, 6vw, 96px)`: "Let's Build\nSomething\nExtraordinary"
- Space Grotesk 300 white muted sub: "We take on a select number of projects each year"
- "Start a conversation →" white bg black text button
- "hello@formastudio.co.uk" Space Grotesk 300 muted white below

### 9. Footer
- White background, minimal
- Left: "FORMA" uppercase Space Grotesk 700
- Center: Work · Studio · Services · Contact
- Right: Instagram · LinkedIn
- Bottom: "© 2026 Forma Studio · London, UK · ARB Registered · RIBA Member"

## Animations
- Hero image: instant mount, no animation — let the image breathe
- Project grid: stagger fade-in on scroll (opacity only — no y movement)
- Service rows: hover invert — 0.2s ease
- Stats: count-up on scroll
- CTA headline: clip-path reveal per word, `clipPath: 'inset(0 100% 0 0)'→'inset(0 0 0 0)'`, 0.6s, stagger 0.15s

## Responsive
- Mobile: single-column project grid, stacked hero, full-width service rows

## Full Copy
- Wordmark: "FORMA"
- Tagline: "Architecture & Interior Design — London"
- Hero: "Space. Light. Purpose."
- Services: Architecture · Interior Design · Renovation & Extension · Planning Consultancy
- About: "We believe the best spaces are felt before they are understood. Forma Studio was founded in 2014 by Tom Hargreaves on a single principle: that thoughtful design improves the quality of daily life."
- Stats: 48 Projects · 12 Countries · RIBA Award 2023 · Est. 2014
- Process: Brief & Vision → Concept Design → Planning & Build → Handover
- CTA: "Let's Build Something Extraordinary" / "We take on a select number of projects each year"
- Contact: "hello@formastudio.co.uk · +44 20 7234 5678"
