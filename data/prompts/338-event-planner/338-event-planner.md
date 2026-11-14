# Event Planner Website Prompt
# websiteprompts.ai

Build a cinematic, editorial luxury event planning website called "Canvas Events" using React + Vite + TypeScript + Tailwind CSS + Framer Motion (motion/react) + shadcn/ui + lucide-react.

## Design System

### Colors
```css
:root {
  --background: 220 12% 10%;          /* deep charcoal #161820 */
  --foreground: 42 22% 90%;           /* warm ivory */
  --primary: 42 22% 90%;
  --primary-foreground: 220 12% 10%;
  --accent: 42 55% 65%;               /* champagne gold #d4b87a */
  --surface: 220 10% 14%;
  --surface-raised: 220 9% 18%;
  --muted-foreground: 42 8% 58%;
  --border: 220 8% 22%;
}
```

### Typography
- Import: `https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600;1,700&family=Inter:wght@300;400;500&display=swap`
- Headlines: Cormorant Garamond 700 italic — cinematic scale
- Body: Inter 300–400
- Labels: Inter 500 uppercase 10px letter-spacing 0.14em

## Sections

### 1. Navbar
- Sticky charcoal background, `backdrop-filter: blur(14px)`
- Left: Cormorant italic wordmark "Canvas Events" in champagne gold
- Right: Services · Events · About · Contact + "Start planning →" gold outlined button

### 2. Hero
- Full-viewport height
- Full-bleed event photography `position: absolute inset-0 w-full h-full object-cover object-center`
- Cinematic gradient overlay: `linear-gradient(to bottom, rgba(22,24,32,0.55) 0%, rgba(22,24,32,0.15) 40%, rgba(22,24,32,0.88) 100%)`
- Content `z-index: 10`, centered, `display: flex; flex-direction: column; align-items: center; justify-content: flex-end; padding-bottom: 7vh`:
  - Inter 500 uppercase 10px gold label centered: "Luxury Event Planning · London & Destination"
  - Cormorant Garamond 700 italic `clamp(58px, 9vw, 130px)` ivory centered, line-height 0.88:
    "We Don't Plan Events.\nWe Build Memories."
  - Gold accent on "Build Memories."
  - Inter 300 muted ivory centered `max-width: 560px`: "Galas, corporate dinners, brand launches, and weddings — each one designed from the first brief to the final toast"
  - Two CTAs centered: "See our events →" (gold filled, dark text) + "Talk to us" (ghost ivory)

{/* Image brief: luxury gala ballroom event, round tables with tall floral centrepieces, soft candle and pendant lighting, formal black-tie guests, editorial event photography */}

- Stagger fade-up on mount: label (0s), headline (0.15s), sub (0.3s), CTAs (0.45s)

### 3. Services Strip
- Full-width surface with gold top border
- 4 chips slide-in from left on scroll, stagger 0.1s:
  - Corporate Events (brand launches, product reveals, galas)
  - Private Celebrations (milestone birthdays, anniversaries)
  - Weddings (full-service destination and London)
  - Brand Experiences (immersive activations)
- Each: Cormorant italic gold label + Inter 300 muted description

### 4. Signature Events
- "What We've Built" — Cormorant 700 italic ivory
- 3 full-width hover-raise rows:
  - Corporate & Brand (galas, product launches, award evenings for FTSE 100 clients)
  - Private Celebrations (milestone events up to 400 guests)
  - Weddings & Elopements (full venue sourcing, styling, and day coordination)
- Each: Cormorant 600 italic large event type left + Inter 300 description right + gold "→"
- `border-bottom: 1px solid hsl(var(--border))`
- Hover: background raises, text turns gold

### 5. Gallery
- "The Events" — Cormorant 700 italic
- 2-column masonry grid, 6 images, alternating 3/4 and 4/3 aspect ratios, no border-radius, 3px gap
- Hover: dark overlay `opacity 0→0.75` + Cormorant italic event name + year

{/* Image brief: rooftop cocktail event at dusk, London skyline, fairy lights, guests with champagne */}
{/* Image brief: intimate formal dinner table, long runner, tall candles, floral, moody warm light */}
{/* Image brief: brand activation space — dramatic backlit display, immersive atmosphere */}
{/* Image brief: marquee wedding exterior at golden hour, fairy lights */}
{/* Image brief: award ceremony stage, dramatic lighting, empty podium, pre-event atmosphere */}
{/* Image brief: close-up of event detail — place card, gold cutlery, flower, editorial */}

### 6. Process
- "How We Work" — Cormorant 700 italic
- 4 horizontal steps: Discovery Call → Creative Brief → Full Coordination → Event Day
- Large faded gold Cormorant italic number (opacity 0.06) behind each
- Inter 300 muted description per step

### 7. About
- Split: right image, left text
- Cormorant 700 italic: "Built on 12 years of delivering the extraordinary"
- Inter 300 muted 2 paragraphs — founded by two former luxury hotel event directors. Full-service: venue, catering, production, AV, floral, entertainment.
- Gold chips: "12 Years · 400+ Events · London & International"

{/* Image brief: event planner at work, behind-the-scenes setup, elegant venue background */}

### 8. Testimonials
- 3 cards: Cormorant italic quote, client name + event type in Inter 10px muted, 5-star row in gold
- Stagger fade-up on scroll

### 9. Contact CTA
- Full-width champagne gold `#d4b87a` background
- Cormorant 700 italic dark charcoal: "Your Next Event Starts Here"
- Inter 300 dark: "Every event begins with a 30-minute discovery call — no commitment, just a conversation about what you're imagining"
- "Book a discovery call →" dark charcoal button
- "Available for events across the UK and internationally" Inter 10px dark 70%

### 10. Footer
- Deep charcoal background, Cormorant italic wordmark in gold
- Instagram · Pinterest · LinkedIn
- "© 2026 Canvas Events · Luxury Event Planning · London · Available Worldwide"

## Animations
- Hero: stagger fade-up on mount (bottom-positioned content)
- Services strip: slide-in from left, stagger 0.1s on scroll
- Gallery: stagger fade-in on scroll
- Gold rules: scaleX 0→1, 0.5s

## Responsive
- Mobile: hero text full-width stacked, single-column gallery, hamburger nav

## Full Copy
- Wordmark: "Canvas Events"
- Hero: "We Don't Plan Events. We Build Memories." / "Galas, corporate dinners, brand launches, and weddings"
- Services: Corporate Events · Private Celebrations · Weddings · Brand Experiences
- Process: Discovery Call → Creative Brief → Full Coordination → Event Day
- Testimonial: "Canvas Events delivered an evening our guests are still talking about six months later. Every detail, down to the menu card typography, was considered." — James H., CEO, London
- CTA: "Your Next Event Starts Here" / "30-minute discovery call, no commitment"
