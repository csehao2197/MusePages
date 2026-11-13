# Cocktail Bar Website Prompt
# websiteprompts.ai

Build a cinematic, dark cocktail bar and craft spirits website called "Dusk Bar" using React + Vite + TypeScript + Tailwind CSS + Framer Motion (motion/react) + shadcn/ui + lucide-react.

## Design System

### Colors
```css
:root {
  --background: 0 0% 2%;              /* pure near-black #050505 */
  --foreground: 38 16% 88%;           /* warm cream */
  --primary: 38 16% 88%;
  --primary-foreground: 0 0% 2%;
  --accent: 28 55% 50%;               /* deep amber #c97a2a */
  --surface: 0 0% 6%;
  --surface-raised: 0 0% 10%;
  --muted-foreground: 38 8% 52%;
  --border: 0 0% 16%;
}
```

### Typography
- Import: `https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Cormorant+Garamond:ital,wght@1,400;1,600&family=Inter:wght@300;400;500&display=swap`
- Display: Bebas Neue — cinematic, maximum scale
- Accent: Cormorant Garamond italic — used for sub-labels and pull quotes
- Body: Inter 300–400
- Labels: Inter 500 uppercase 10px letter-spacing 0.16em

## Sections

### 1. Navbar
- Sticky pure black, `backdrop-filter: blur(14px)`
- Left: Bebas Neue letter-spacing 0.15em "DUSK" in warm cream
- Right: Menu · Reservations · Events · About + "Reserve a table →" amber outlined button

### 2. Hero
- Full-viewport height, black background
- Full-bleed cinematic cocktail photography `position: absolute inset-0 w-full h-full object-cover object-center`
- Minimal overlay — just enough for text: `background: linear-gradient(to right, rgba(5,5,5,0.88) 0%, rgba(5,5,5,0.45) 55%, rgba(5,5,5,0.15) 100%)`
- Large background display text: "DUSK" in Bebas Neue `font-size: clamp(300px, 42vw, 600px)` at `opacity: 0.025`, `position: absolute; right: -3%; top: 50%; transform: translateY(-50%); z-index: 1; letter-spacing: -0.02em`
- Content `z-index: 10`, left-aligned `padding-left: 7vw`, centered vertically:
  - Inter 500 uppercase 10px amber label: "Craft Cocktail Bar · Soho, London"
  - Bebas Neue `clamp(78px, 11vw, 165px)` warm cream, line-height 0.84:
    "CRAFTED\nBY HAND.\nSERVED WITH\nINTENT."
  - Amber accent on "INTENT."
  - Inter 300 muted cream sub: "A rotating menu of 24 craft cocktails, an obsessive spirits selection, and a room designed to make you stay later than you planned"
  - CTAs: "Reserve a table →" (amber filled, dark text) + "See the menu" (ghost cream)
  - 3 floating chips: "24 Cocktails · 200+ Spirits · Tues–Sun from 5pm"

{/* Image brief: cinematic close-up of craft cocktail being poured — dark amber liquid, dramatic back-lighting, smoke or ice vapour, black background, film-still quality photography */}

- Stagger fade-up on mount: label (0s), headline (0.1s), sub (0.28s), CTAs (0.44s), chips (0.6s)

### 3. The Menu
- "What We Make" — Bebas Neue `clamp(52px, 7vw, 90px)` warm cream
- 4 cocktail category rows, hover-raise:
  - Signature Cocktails (our rotating originals, each named for a time of night — from £14)
  - Classics Reworked (the canon, our way — from £12)
  - Low ABV & Zero (the same obsession, less spirit — from £10)
  - Spirits & Highballs (rare pour-overs, seasonal highballs — ask your bartender)
- Each: Bebas Neue 32px category name left + Inter 300 muted description right + amber "→"
- `border-bottom: 1px solid hsl(var(--border))`
- Hover: surface-raised, name turns amber

### 4. Signature Drinks
- "Current Signatures" — Bebas Neue large
- 3 cocktail cards, dark surface, no border-radius:
  - The Last Light (mezcal, aperol, blood orange, activated charcoal — £15)
  - Midnight Sour (bourbon, black sesame, lemon, honey — £14)
  - Fog of Dusk (gin, elderflower, cucumber, dry ice serve — £14)
- Each: large 4/3 cocktail image, Bebas Neue cocktail name, Cormorant italic description, amber price tag
- Hover: amber border, image scale 1.02

{/* Image brief: dark moody cocktail — mezcal sour with smoked rim, black background, theatrical presentation, cinematic photography */}
{/* Image brief: bourbon cocktail, amber liquid, single large ice sphere, dark bar background, editorial */}
{/* Image brief: gin drink with dry ice smoke effect, dramatic, dark surface, artistic serve */}

### 5. The Bar
- "The Room" — Bebas Neue large
- Split: left text, right image
- Cormorant Garamond italic pull quote: "We built Dusk for people who think a good drink deserves a good hour."
- Inter 300 muted: 2 paragraphs — no TVs, no DJ after 10pm, no rush. 40 covers. Reservations recommended. Walk-ins always welcome if there's space.
- Amber chips: "40 Covers · No TVs · Walk-ins Welcome · Soho"

{/* Image brief: intimate cocktail bar interior, dark wood and brass, warm backlit spirits shelves, moody candles, cinematic atmosphere */}

### 6. Events
- "Private Hire & Events" — Bebas Neue large
- Centered dark surface section
- Inter 300 muted: "Full bar buyout available Sunday–Monday. Cocktail masterclasses for groups of 8–20. Seasonal supper club nights announced monthly."
- "Enquire about events →" amber button + "Join the mailing list" ghost

### 7. Testimonials
- 3 cards: Bebas Neue 18px amber cocktail name as header, Inter 300 italic cream quote, guest name in Inter 10px muted
- Stagger fade-up on scroll

### 8. Reservation CTA
- Full-width deep amber `#c97a2a` background
- Bebas Neue `clamp(52px, 7vw, 90px)` dark: "YOUR TABLE IS WAITING"
- Inter 300 dark: "Reserve online or walk in — we'll always try to find you a seat"
- "Reserve a table →" dark near-black button
- "Tues–Sun from 5pm · Last seating 10:30pm · Soho, London" Inter 10px dark 70%

### 9. Footer
- Pure black, Bebas Neue "DUSK" in warm cream
- Instagram · Google Maps
- "© 2026 Dusk Bar · 12 Beak Street, Soho, London W1F · Tues–Sun 5pm–1am"

## Animations
- Hero: aggressive stagger fade-up on mount, "DUSK" bg text fade in 1.2s delay
- Menu rows: hover raise + amber transition 0.15s
- Cocktail cards: stagger fade-up + scale 0.96→1 on scroll
- All hover: 0.15s ease

## Responsive
- Mobile: stacked hero, single-column cocktail cards, hamburger nav

## Full Copy
- Wordmark: "DUSK"
- Hero: "CRAFTED BY HAND. SERVED WITH INTENT." / "A rotating menu of 24 craft cocktails, an obsessive spirits selection"
- Menu: Signatures from £14 · Classics from £12 · Low ABV from £10 · Spirits ask bartender
- Cocktails: The Last Light £15 · Midnight Sour £14 · Fog of Dusk £14
- Hours: Tues–Sun from 5pm, last seating 10:30pm
- Testimonial: "Every cocktail at Dusk is genuinely considered. They've taken a mezcal sour and made it the best drink I've had this year." — Marcus T., Soho
- CTA: "YOUR TABLE IS WAITING" / "Reserve online or walk in"
