# Travel Agency Website Prompt
# websiteprompts.ai

Build a bold, cinematic luxury travel agency website called "Meridian Travel" using React + Vite + TypeScript + Tailwind CSS + Framer Motion (motion/react) + shadcn/ui + lucide-react.

## Design System

### Colors
```css
:root {
  --background: 218 22% 10%;          /* deep slate #151c2c */
  --foreground: 42 18% 90%;           /* warm pearl */
  --primary: 218 22% 10%;
  --primary-foreground: 42 18% 90%;
  --accent: 185 52% 40%;              /* deep teal #1fa8b4 */
  --accent-warm: 42 48% 60%;          /* warm sand #c9b47a */
  --surface: 218 18% 14%;
  --surface-raised: 218 16% 18%;
  --muted-foreground: 42 8% 56%;
  --border: 218 14% 22%;
}
```

### Typography
- Import: `https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@300;400;500&display=swap`
- Headlines: Bebas Neue — maximum condensed editorial
- Body: Inter 300–400
- Labels: Inter 500 uppercase 10px letter-spacing 0.14em

## Sections

### 1. Navbar
- Sticky deep slate, `backdrop-filter: blur(12px)`
- Left: Inter 600 uppercase letter-spacing 0.2em "MERIDIAN" in warm sand
- Right: Destinations · Experiences · About · Contact + "Plan your trip →" teal outlined button

### 2. Hero
- Full-viewport height
- Full-bleed landscape photography `position: absolute inset-0 w-full h-full object-cover object-center`
- Composition-independent gradient: `linear-gradient(to right, rgba(21,28,44,0.96) 0%, rgba(21,28,44,0.65) 55%, rgba(21,28,44,0.2) 100%)`
- Large background text: "WORLD" in Bebas Neue `font-size: clamp(280px, 40vw, 560px)` at `opacity: 0.04`, `position: absolute; right: -2%; bottom: -5%; z-index: 1`
- Content `z-index: 10`, left-aligned `padding-left: 7vw; padding-top: 0`, centered vertically:
  - Inter 500 uppercase 10px teal label: "Luxury Travel · Since 2008"
  - Bebas Neue `clamp(70px, 10vw, 145px)` pearl, line-height 0.88: "DISCOVER THE\nWORLD ON YOUR\nTERMS."
  - Teal accent on "YOUR\nTERMS."
  - Inter 300 muted pearl sub: "Bespoke itineraries, private guides, and handpicked stays for travellers who refuse the ordinary"
  - CTAs: "Start planning →" (teal filled, dark text) + "See destinations" (ghost pearl)
  - Floating destination chips below CTAs, horizontal row: "Morocco · Japan · Patagonia · Maldives · Iceland" — each Inter 500 10px uppercase teal, separated by thin sand dividers, stagger fade-in 0.6s delay

{/* Image brief: dramatic mountain landscape at golden hour — vast scale, lone traveller silhouetted against sky, cinematic wide-angle, adventure photography */}

- Stagger fade-up on mount: label (0s), headline (0.12s), sub (0.26s), CTAs (0.4s), chips (0.6s)

### 3. Destinations
- "Where We'll Take You" — Bebas Neue `clamp(52px, 7vw, 90px)` pearl
- 6-destination 3×2 grid, full-bleed image cards (no border-radius), hover scale 1.03:
  - Morocco · Japan · Patagonia · Maldives · Iceland · Tanzania
- Each card: `height: 320px`, Bebas Neue 28px white destination name bottom-left over dark gradient, Inter 300 10px muted sub (best season), teal "Explore →"
- Stagger fade-up on scroll

{/* Image brief: Moroccan medina at dusk, warm amber light, lanterns, narrow alleys */}
{/* Image brief: Japanese mountain temple in autumn, red maples, mist, serene */}
{/* Image brief: Patagonian glacier, dramatic peaks, turquoise water */}
{/* Image brief: Maldives overwater villa at sunrise, crystal water, luxury */}
{/* Image brief: Iceland Northern Lights over black sand landscape */}
{/* Image brief: Tanzania savanna at golden hour, wildlife silhouettes */}

### 4. What We Offer
- "The Meridian Difference" — Bebas Neue large
- 3 hover-raise rows:
  - Bespoke Itineraries (every trip custom-built — zero off-the-shelf packages)
  - Private & Small-Group (no more than 8 — always your own guide)
  - Handpicked Stays (every property personally vetted by our team)
- Each: Bebas Neue large name left + Inter 300 muted description right + teal "→"
- `border-bottom: 1px solid hsl(var(--border))`
- Hover: surface-raised, text turns teal

### 5. Stats Strip
- Full-width teal `#1fa8b4` background, 72px
- 4 dark Inter 700 stats: "18 Years" · "60+ Destinations" · "4.9★ Trustpilot" · "100% Bespoke"
- Framer Motion count-up on scroll, dark dividers

### 6. About
- Split: left text, right image
- Bebas Neue large pearl: "WE'VE BEEN WHERE YOU WANT TO GO"
- Inter 300 muted: 2 paragraphs — Meridian Travel founded 2008. Every destination researched first-hand. Our network of local guides goes far beyond guidebook recommendations.
- Teal chips: "Est. 2008 · ABTA Member · 60+ Destinations"

{/* Image brief: travel specialist at work, maps and destination photos on desk, warm professional setting */}

### 7. Testimonials
- 3 cards: Bebas Neue 18px pearl destination label, Inter 300 italic pearl quote, client name + trip in Inter 10px muted, 5-star teal row
- Stagger fade-up on scroll

### 8. Plan Your Trip CTA
- Full-width warm sand `#c9b47a` background
- Bebas Neue `clamp(52px, 7vw, 90px)` dark slate: "WHERE DO YOU WANT TO GO?"
- Inter 300 dark: "Tell us your dream trip in 60 seconds — we'll come back with a bespoke itinerary, no obligation"
- "Start planning →" dark slate button
- "No booking fees · ABTA protected · Available 7 days" Inter 10px dark 70%

### 9. Footer
- Deep slate, Inter 600 uppercase "MERIDIAN" in sand
- Instagram · Pinterest · LinkedIn
- "© 2026 Meridian Travel · Luxury Bespoke Travel · London · ABTA Member"

## Animations
- Hero: aggressive stagger fade-up on mount
- Background "WORLD" text: fade in 1.2s delay
- Destination grid: stagger fade-up + scale 0.95→1 on scroll
- Stats strip: count-up on scroll
- All hover: 0.18s ease

## Responsive
- Mobile: stacked hero, single-column destinations, hamburger nav

## Full Copy
- Wordmark: "MERIDIAN"
- Hero: "DISCOVER THE WORLD ON YOUR TERMS." / "Bespoke itineraries, private guides, and handpicked stays for travellers who refuse the ordinary"
- Destinations: Morocco · Japan · Patagonia · Maldives · Iceland · Tanzania
- Stats: 18 Years · 60+ Destinations · 4.9★ Trustpilot · 100% Bespoke
- Testimonial: "Meridian built us a three-week Japan itinerary that covered things we would never have found ourselves. Not one moment felt like tourism." — David & Clare H., London
- CTA: "WHERE DO YOU WANT TO GO?" / "Bespoke itinerary, no obligation"
