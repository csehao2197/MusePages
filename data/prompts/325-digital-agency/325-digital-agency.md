# Digital Agency Website Prompt
# websiteprompts.ai

Build a dark, bold digital and creative agency website called "Vortex Studio" using React + Vite + TypeScript + Tailwind CSS + Framer Motion (motion/react) + shadcn/ui + lucide-react.

## Design System

### Colors
```css
:root {
  --background: 250 14% 6%;           /* near-black deep #0a0a0f */
  --foreground: 0 0% 96%;             /* white */
  --primary: 256 72% 58%;             /* electric violet #6b3ce8 */
  --primary-foreground: 0 0% 96%;
  --accent: 256 72% 58%;
  --surface: 250 12% 10%;
  --surface-raised: 250 10% 14%;
  --muted-foreground: 250 8% 54%;
  --border: 250 8% 20%;
}
```

### Typography
- Import: `https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&family=Inter:wght@300;400;500&display=swap`
- Headlines: Space Grotesk 700 — geometric, bold
- Body: Inter 300–400
- Labels: Inter 500 uppercase 10px letter-spacing 0.14em

## Sections

### 1. Navbar
- Sticky, near-black, `backdrop-filter: blur(14px)`
- Left: Space Grotesk 700 "VORTEX" in violet
- Right: Work · Services · About · Contact + "Start a project →" violet button

### 2. Hero
- Full-viewport height, near-black background
- Background: `position: absolute; right: 0; top: 0; width: 50%; height: 100%;`
  Radial gradient: `background: radial-gradient(ellipse at 70% 50%, rgba(107,60,232,0.25) 0%, rgba(107,60,232,0.06) 50%, transparent 70%)`
  Additional: subtle grid pattern overlay `background-image: linear-gradient(rgba(107,60,232,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(107,60,232,0.04) 1px, transparent 1px); background-size: 60px 60px`
- Content `z-index: 10`, left-aligned `padding-left: 7vw`, centered vertically, `max-width: 55%`:
  - Inter 500 uppercase 10px violet label: "Digital · Branding · Web · Motion"
  - Space Grotesk 700 `clamp(52px, 7.5vw, 115px)` white, line-height 0.88: "WE BUILD\nBRANDS THAT\nDOMINATE."
  - Violet accent on "DOMINATE."
  - Inter 300 muted sub: "Brand identity, web design, and digital experiences for companies that refuse to be ignored — from seed to Series B"
  - CTAs: "Start a project →" (violet filled) + "View our work" (ghost)
  - 3 floating project preview cards stacked bottom-right (`position: absolute; right: 7vw; bottom: 8vh; z-index: 20`), each 220×130px, dark surface with violet border, scaled and rotated slightly: card1 `rotate(-2deg)`, card2 `rotate(1deg) translateY(-20px)`, card3 `rotate(-1deg) translateY(-40px)`. Each shows a mockup thumbnail + Space Grotesk 12px project name
  - Cards animate in from right, stagger 0.15s

{/* Image brief: floating project cards showing: (1) brand identity mockup — logo on dark bg; (2) web UI mockup — clean dark dashboard; (3) motion design still — abstract visual */}

- Stagger fade-up on mount: label, headline, sub, CTAs (0.1s delay each)

### 3. Selected Work
- "Selected Work" — Space Grotesk 700 white, `clamp(42px, 5vw, 72px)`
- 4 full-width project rows, hover-raise:
  - Aura Finance — Brand Identity + Web Design (Fintech · 2025)
  - Construct — Architecture Website (Property · 2025)
  - Zeno Health — Product UI + Motion (Health Tech · 2024)
  - Meridian — E-commerce Brand (Retail · 2024)
- Each row: large project number (opacity 0.06) left, Space Grotesk 700 project name center-left, Inter 300 muted type + year right, violet "→" far right
- `border-bottom: 1px solid hsl(var(--border))`
- Hover: surface-raised, project name turns violet, row expands slightly

### 4. Services
- "What We Do" — Space Grotesk 700 white
- 3×2 grid, dark surface cards:
  - Brand Identity (strategy, naming, visual identity, brand guidelines)
  - Web Design & Dev (Webflow, Framer, custom — conversion-led)
  - Motion & Animation (brand motion, UI animation, video)
  - UI/UX Design (product design, prototyping, user testing)
  - Content & Copy (brand voice, web copy, campaign content)
  - Digital Strategy (brand positioning, audience, digital roadmap)
- Each: violet lucide icon, Space Grotesk 700 name, Inter 300 description
- Hover: violet border + `box-shadow: 0 0 20px hsl(256 72% 58% / 0.14)`

### 5. Process
- "How We Work" — Space Grotesk 700 white
- 4 steps: Discovery → Strategy → Design & Build → Launch
- Large faded violet number (opacity 0.05) behind each step
- Inter 300 muted description, stagger fade-up on scroll

### 6. About
- Split: left text, right image
- Space Grotesk 700 white: "We're a studio of 8. Small on purpose."
- Inter 300 muted: 2 paragraphs — founded 2018. No junior teams, no outsourcing. Every project is handled by the same senior team from brief to launch. 92% of clients return.
- Violet chips: "Est. 2018 · 8 People · London · 92% Repeat Clients"

{/* Image brief: small creative agency team at work, open studio, dark monitors, collaborative energy, contemporary workspace */}

### 7. Testimonials
- Surface-raised section
- 3 cards: 5-star violet row, Inter 300 italic white quote, company + project type Inter 10px muted
- Stagger fade-up on scroll

### 8. Start a Project CTA
- Full-width, `background: hsl(256 72% 58%)` violet
- Space Grotesk 700 white `clamp(42px, 5vw, 72px)`: "Ready to Build Something Great?"
- Inter 300 white: "Tell us what you're building — we'll tell you what it could become"
- "Start a project →" white button (dark text)
- "Brand · Web · Motion · London & Remote" Inter 10px white 70%

### 9. Footer
- Near-black, Space Grotesk 700 "VORTEX" in violet
- Instagram · Behance · LinkedIn
- "© 2026 Vortex Studio · Brand & Digital Agency · London · Available Globally"

## Animations
- Hero: stagger fade-up on mount, project cards scale from 0.9 + translate from right, stagger 0.15s
- Work rows: hover raise + violet transition 0.2s
- Service grid: stagger fade-up on scroll
- Violet rules: scaleX 0→1, 0.5s

## Responsive
- Mobile: hero cards hidden on mobile (hero content full-width), single-column services, hamburger nav

## Full Copy
- Wordmark: "VORTEX"
- Hero: "WE BUILD BRANDS THAT DOMINATE." / "Brand identity, web design, and digital experiences for companies that refuse to be ignored"
- Services: Brand Identity · Web Design & Dev · Motion · UI/UX · Content · Strategy
- Work: Aura Finance · Construct · Zeno Health · Meridian
- Stats: Est. 2018 · 8 People · 92% Repeat Clients
- Testimonial: "Vortex redesigned our entire brand and website in 8 weeks. Our conversion rate doubled. We've been working with them for 3 years." — Alex R., Founder, Aura Finance
- CTA: "Ready to Build Something Great?" / "Tell us what you're building"
