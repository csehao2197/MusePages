# Makeup Artist Website Prompt
# websiteprompts.ai

Build a dark, editorial makeup artist and beauty portfolio website called "Ariel Beaumont" using React + Vite + TypeScript + Tailwind CSS + Framer Motion (motion/react) + shadcn/ui + lucide-react.

## Design System

### Colors
```css
:root {
  --background: 0 0% 4%;              /* near-black #0a0a0a */
  --foreground: 38 14% 90%;           /* warm pearl */
  --primary: 38 14% 90%;
  --primary-foreground: 0 0% 4%;
  --accent: 38 42% 58%;               /* warm gold #c9a55a */
  --surface: 0 0% 8%;
  --surface-raised: 0 0% 12%;
  --muted-foreground: 38 8% 52%;
  --border: 0 0% 16%;
}
```

### Typography
- Import: `https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,wght@0,400;0,700;1,400;1,700&family=Inter:wght@300;400;500&display=swap`
- Headlines: Bodoni Moda 700 italic — editorial, fashion-forward
- Body: Inter 300–400
- Labels: Inter 500 uppercase 10px letter-spacing 0.16em

## Sections

### 1. Navbar
- Sticky near-black background, `backdrop-filter: blur(12px)`
- Left: Bodoni Moda italic wordmark "Ariel Beaumont" in warm gold
- Right: Work · Services · About · Contact + "Enquire →" gold outlined button

### 2. Hero
- Full-viewport height, near-black background
- Right side: full-bleed editorial beauty portrait, occupies 55% of viewport width, `position: absolute; right: 0; top: 0; height: 100%; width: 55%; object-fit: cover; object-position: center top`
- Left-side overlay for text: `position: absolute; left: 0; top: 0; height: 100%; width: 52%`
  `background: linear-gradient(to right, rgba(10,10,10,1) 0%, rgba(10,10,10,0.9) 70%, transparent 100%)`
- Content `z-index: 10`, left `padding: 0 5vw`, centered vertically:
  - Inter 500 uppercase 10px gold label: "Makeup Artist · London & International"
  - Bodoni Moda 700 italic `clamp(58px, 8vw, 115px)` pearl, line-height 0.88: "Art\non Skin."
  - Inter 300 muted: "Editorial, bridal, commercial, and film — makeup designed to be seen, photographed, and remembered"
  - CTAs: "View my work →" (gold filled, dark text) + "Book a session" (ghost)
  - Small floating portfolio chip: one 120×160px crop, `position: absolute; bottom: 10%; right: 5%; z-index: 20`, no border-radius, Framer Motion scale from 0.8 on mount

{/* Image brief: close-up editorial beauty portrait, woman with dramatic avant-garde makeup — deep burgundy lip, architectural eye, flawless skin, dark studio background, high-contrast fashion photography */}

- Stagger fade-up on mount: label, headline, sub, CTAs (0.12s delay per)

### 3. Selected Work
- "Selected Work" — Bodoni Moda 700 italic pearl, centered
- Masonry grid, 6 images: 3 tall (3/4) + 3 wide (4/3), no border-radius, 3px gap
- Hover: dark overlay `0→0.6` + Inter 500 uppercase white label (Editorial / Bridal / Commercial / Film)
- Stagger fade-in on scroll

{/* Image brief: bridal makeup close-up, soft romantic skin, glowing natural light, warm tones */}
{/* Image brief: editorial avant-garde makeup, model in profile, dark dramatic studio */}
{/* Image brief: commercial beauty — lipstick close-up, vibrant red, fashion magazine style */}
{/* Image brief: film set makeup — actress being touched up between takes, candid BTS */}
{/* Image brief: bold editorial eye look, close-up, dark background, high contrast */}
{/* Image brief: natural bridal party group, outdoor golden hour, soft elegant looks */}

### 4. Services
- "What I Offer" — Bodoni Moda 700 italic
- 4 service rows, hover-raise:
  - Editorial & Fashion (shoots, campaigns, lookbooks — from £350/day)
  - Bridal (trial + wedding day, bridal party available — from £280)
  - Commercial & Film (TV, advertising, product — day rate available)
  - Special Occasions (events, galas, press nights — from £150)
- Each: Bodoni italic large name left + Inter 300 description right + gold "→" + price
- `border-bottom: 1px solid hsl(var(--border))`
- Hover: background raises, name turns gold

### 5. About
- "The Artist" — Bodoni 700 italic
- Split: left text, right portrait image
- Bodoni italic pull quote: "Makeup is the one art form that disappears at the end of the day — which means every application is its own original."
- Inter 300 muted bio: 2 paragraphs — trained at London College of Fashion. 12 years working across editorial, film, and bridal. Clients include Vogue, BBC, and independent brides who want something genuinely considered.
- Gold chips: "LCF Trained · 12 Years · Film & Bridal Specialist"

{/* Image brief: makeup artist in action, artist's face focused, brushes in hand, editorial studio setting */}

### 6. Testimonials
- Surface section
- 3 cards: 5-star gold row, Bodoni italic pearl quote, client name + project type Inter 10px muted
- Stagger fade-up on scroll

### 7. FAQ
- 4 items via shadcn/ui:
  - "Do you travel for bookings?"
  - "How far in advance should I book for my wedding?"
  - "What's included in a bridal trial?"
  - "Do you work internationally?"
- Gold left border on open item

### 8. Enquiry CTA
- Full-width warm gold `#c9a55a` background
- Bodoni 700 italic dark: "Let's Make Something Beautiful"
- Inter 300 dark: "Every project starts with a conversation — tell me what you're creating and I'll tell you how I can help"
- "Send an enquiry →" dark near-black button
- "Based in London · Available nationwide and internationally" Inter 10px dark 70%

### 9. Footer
- Near-black, Bodoni italic "Ariel Beaumont" in gold
- Instagram · Pinterest · LinkedIn
- "© 2026 Ariel Beaumont · Makeup Artist · London"

## Animations
- Hero: stagger fade-up on mount, floating portfolio chip scale 0.8→1
- Gallery: stagger fade-in on scroll
- Service rows: hover raise 0.2s
- Gold rules: scaleX 0→1, 0.5s

## Responsive
- Mobile: hero portrait full-width top, text below with gradient, single-column grid, hamburger nav

## Full Copy
- Wordmark: "Ariel Beaumont"
- Hero: "Art on Skin." / "Editorial, bridal, commercial, and film — makeup designed to be seen, photographed, and remembered"
- Services: Editorial from £350/day · Bridal from £280 · Commercial day rate · Occasions from £150
- Testimonial: "Ariel did my makeup for our wedding and then for a Vogue editorial the following month. The work on both was extraordinary." — Sophie M., London
- CTA: "Let's Make Something Beautiful" / "Every project starts with a conversation"
