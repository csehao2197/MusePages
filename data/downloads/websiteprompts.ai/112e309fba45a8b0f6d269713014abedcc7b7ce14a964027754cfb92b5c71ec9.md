# Wedding Venue Website Prompt
# websiteprompts.ai

Build a luxury wedding venue and events estate website called "Ashford Manor" using React + Vite + TypeScript + Tailwind CSS + Framer Motion (motion/react) + shadcn/ui + lucide-react.

## Design System

### Colors
```css
:root {
  --background: 220 20% 10%; /* deep slate #161b26 */
  --foreground: 45 30% 92%; /* pearl off-white */
  --primary: 220 20% 10%;
  --primary-foreground: 45 30% 92%;
  --accent: 43 50% 65%; /* warm gold #d4b87a */
  --surface: 220 20% 14%;
  --muted-foreground: 220 10% 60%;
  --border: 220 15% 20%;
}
```

### Typography
- Import: `https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600;1,700&family=Inter:wght@300;400;500&display=swap`
- Headlines: Cormorant Garamond 600–700 — italic gold accents
- Body: Inter 300–400
- Labels: Inter 500 uppercase 10px letter-spacing 0.15em

## Sections

### 1. Navbar
- Sticky deep slate, `backdrop-filter: blur(12px)`, scroll-triggered hairline gold border-bottom
- Left: Cormorant Garamond italic wordmark "Ashford Manor" in pearl
- Right: The Estate · Weddings · Packages · Gallery + "Enquire →" gold-outlined button

### 2. Hero
- Full-viewport cinematic hero
- Full-bleed estate exterior image behind dual-layer gradient overlay:
  - Layer 1: `linear-gradient(to bottom, rgba(22,27,38,0.55) 0%, rgba(22,27,38,0.2) 50%, rgba(22,27,38,0.75) 100%)`
  - Layer 2: `linear-gradient(to right, rgba(22,27,38,0.4) 0%, transparent 60%)`
- Content absolute center, z-10:
  - Inter 500 uppercase pearl muted 10px: "Wedding Venue & Events Estate · Wiltshire"
  - Cormorant Garamond 700 `clamp(52px, 7.5vw, 120px)`: "Where Moments\nBecome\nMemories"
  - Italic gold accent: "Memories"
  - Inter 300 pearl muted: "An exclusive hire estate set in 40 acres of private Wiltshire countryside"
  - CTAs: "Enquire about your date →" (gold filled) + "Take the tour" (pearl ghost)

{/* Image brief: luxury manor house exterior at golden hour, warm stone facade, manicured grounds, romantic evening light */}

### 3. Key Details Strip
- 4-chip strip: gold icon + Inter 500 label + Inter 300 value
  - Exclusive Hire · Capacity 250 guests
  - 40 Acres · Private estate
  - Overnight stays · 18 bedrooms
  - Licensed · Civil ceremonies

### 4. The Spaces
- "Our Spaces" — Cormorant Garamond 700 with gold italic subtitle "Where your day unfolds"
- 3 hover-raise rows (translateY -4px on hover, 0.3s):

**The Great Hall**
- Split: left large image (60%), right content (40%)
- Cormorant 600: "The Great Hall"
- Inter 300: "Grand vaulted ceilings, original stone fireplace, chandeliers. Ceremony and reception for up to 250 guests."
- Chips: Ceremony · Reception · 250 guests

**The Walled Garden**
- Split reversed: left content (40%), right large image (60%)
- Cormorant 600: "The Walled Garden"
- Inter 300: "Restored Victorian walled garden with copper-beech canopy. Outdoor ceremonies for up to 150 guests."
- Chips: Outdoor Ceremony · Summer · 150 guests

**The Orangery**
- Split: left large image (60%), right content (40%)
- Cormorant 600: "The Orangery"
- Inter 300: "Floor-to-ceiling glass, iron columns, festoon lighting. Intimate dinners and morning-after brunches."
- Chips: Intimate Dining · Morning After · 80 guests

{/* Image brief: grand hall interior with chandelier, elegant wedding table setting, warm evening light */}
{/* Image brief: beautiful walled garden outdoor wedding ceremony, floral arch, wooden chairs */}
{/* Image brief: glass orangery interior, festoon lights, intimate dinner setting, evening */}

### 5. Gallery
- "The Estate" — Cormorant Garamond 700
- 2-column masonry grid, 6 images, gap 12px
- Hover: gold overlay at 20% + scale 1.02

{/* Image brief: aerial view of manor house and manicured grounds, English countryside */}
{/* Image brief: bride and groom walking through estate grounds, romantic golden hour */}
{/* Image brief: wedding reception table centerpiece, flowers, candles, elegant styling */}
{/* Image brief: stone staircase with floral arrangements, wedding ceremony setup */}
{/* Image brief: sunset view from estate terrace, romantic golden sky */}
{/* Image brief: wedding cake detail, luxury styling, elegant backdrop */}

### 6. Weddings
- "For Your Wedding Day" — Cormorant 700
- 50/50 split: left editorial photography, right content
- Cormorant italic gold pull quote: "We take just one wedding at a time. Your day is the only day that matters."
- Inter 300: 2 paragraphs — exclusive use, dedicated team, no other events on site.
- "Download our brochure →" gold outlined button

{/* Image brief: intimate moment — couple at first look, manor background, candid emotional photography */}

### 7. Testimonials
- 3 cards, surface background, gold top-border-left
- Cormorant italic 600 quote, Inter 300 name + date + type
- 5 gold stars per card
- Stagger fade-up on scroll

### 8. Packages
- "Investment" — Cormorant 700 + Inter 300 subtitle
- 3 clean price rows with dividers:
  - Midweek Estate Hire · Mon–Thu · from £4,500
  - Weekend Estate Hire · Fri–Sun · from £7,500
  - Full Weekend · Fri check-in → Sun check-out · from £14,000
- Inter 300 inclusions list per row (6 items)
- "Request bespoke quote →" pearl button

### 9. Accommodation
- "Rest Your Head" — Cormorant 700
- Centered section, estate image
- Inter 300: "Eighteen individually decorated bedrooms accommodate up to 38 guests across the Manor House and Gate Cottage. Your party has the run of the estate from Friday evening to Sunday checkout."
- Chips: 18 bedrooms · 38 guests · Gate Cottage included

{/* Image brief: luxury country house bedroom, period features, four-poster bed, warm elegant styling */}

### 10. Enquiry CTA
- Full-width gold (#d4b87a) background
- Cormorant 700 italic slate: "Begin Your Story at Ashford Manor"
- Inter 300 slate: "We hold a limited number of weddings each year to ensure every couple receives our complete attention"
- "Enquire about availability →" deep slate filled button

### 11. Footer
- Deep slate, Cormorant italic wordmark "Ashford Manor" in gold
- "© 2026 Ashford Manor Estate · Great Wishford, Wiltshire SP2 · hello@ashfordmanor.co.uk"

## Animations
- Hero content: stagger fade-up on mount (y: 40→0, 0.8s ease)
- Spaces rows: whileInView fade-slide-in, 0.6s stagger 0.15s
- Gallery: whileInView stagger fade-in
- Hover: 0.25s ease throughout

## Responsive
- Mobile: single-column spaces, 1-col gallery, stacked hero, hamburger nav

## Full Copy
- Estate: "Ashford Manor · Great Wishford, Wiltshire"
- Packages: Midweek from £4,500 · Weekend from £7,500 · Full Weekend from £14,000
- Accommodation: 18 bedrooms, 38 guests, Gate Cottage
- Testimonial: "Ashford Manor gave us the most perfect day we could have imagined. The team thought of everything." — Emma & James, September 2025
