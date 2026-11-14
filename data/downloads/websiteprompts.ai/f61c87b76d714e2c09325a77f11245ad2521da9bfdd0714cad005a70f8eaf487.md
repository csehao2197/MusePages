# Boutique Hotel Website Prompt
# websiteprompts.ai

Build a dark, editorial boutique hotel and luxury B&B website called "The Aldwick" using React + Vite + TypeScript + Tailwind CSS + Framer Motion (motion/react) + shadcn/ui + lucide-react.

## Design System

### Colors
```css
:root {
  --background: 215 16% 9%;           /* deep slate #13181f */
  --foreground: 38 20% 88%;           /* warm pearl */
  --primary: 38 20% 88%;
  --primary-foreground: 215 16% 9%;
  --accent: 38 46% 56%;               /* warm gold #c9a55a */
  --surface: 215 14% 13%;
  --surface-raised: 215 12% 17%;
  --muted-foreground: 38 8% 56%;
  --border: 215 10% 22%;
}
```

### Typography
- Import: `https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600;1,700&family=Inter:wght@300;400;500&display=swap`
- Headlines: Cormorant Garamond 700 italic — editorial luxury
- Body: Inter 300–400
- Labels: Inter 500 uppercase 10px letter-spacing 0.14em

## Sections

### 1. Navbar
- Sticky deep slate, `backdrop-filter: blur(14px)`
- Left: Cormorant italic "The Aldwick" in warm gold
- Right: Rooms · Dining · Experiences · Location + "Book a stay →" gold outlined button

### 2. Hero
- Full-viewport height
- Full-bleed hotel photography `position: absolute inset-0 w-full h-full object-cover object-center`
- Cinematic dual gradient: `linear-gradient(to bottom, rgba(19,24,31,0.7) 0%, rgba(19,24,31,0.1) 35%, rgba(19,24,31,0.1) 60%, rgba(19,24,31,0.92) 100%)`
- Content `z-index: 10`, centered at bottom: `display: flex; flex-direction: column; align-items: center; padding-bottom: 8vh`
  - Inter 500 uppercase 10px gold label centered: "Boutique Hotel · Cotswolds"
  - Cormorant Garamond 700 italic `clamp(62px, 9vw, 135px)` pearl centered, line-height 0.88: "A Place\nUnlike Any Other."
  - Gold accent on "Unlike Any Other."
  - Inter 300 muted pearl centered `max-width: 520px`: "12 individually designed rooms, a restaurant serving seasonal Cotswolds produce, and grounds that change with every season"
  - CTAs centered: "Book a stay →" (gold filled, dark text) + "See the rooms" (ghost pearl)
- Below hero CTA strip (within hero, bottom `z-index: 10`, centered horizontal row):
  - 5 small gold chips: "12 Rooms · Dog Friendly · Restaurant · Free Parking · Cotswolds"
  - Slide-in from left, stagger 0.08s on mount

{/* Image brief: boutique hotel exterior at dusk, warm windows glowing, stone building, manicured garden, atmospheric twilight, luxury countryside hotel photography */}

- Stagger fade-up on mount: label (0s), headline (0.15s), sub (0.3s), CTAs (0.45s), chips (0.6s)

### 3. The Rooms
- "The Rooms" — Cormorant 700 italic pearl with gold underline rule
- 3 full-width hover-raise rows:
  - Classic Rooms (6 rooms, original features, garden view, from £180/night)
  - Deluxe Rooms (4 rooms, freestanding bath, countryside view, from £240/night)
  - The Suite (master suite, private terrace, from £380/night)
- Each: Cormorant 600 italic large room type left + Inter 300 description right + gold "→" + price
- `border-bottom: 1px solid hsl(var(--border))`
- Hover: surface-raised, text turns gold

### 4. Gallery
- "The Aldwick in Detail" — Cormorant 700 italic
- 2-column masonry grid, 6 images, alternating 3/4 and 4/3, no border-radius, 3px gap
- Hover: dark overlay `0→0.7` + Cormorant italic room/space label

{/* Image brief: boutique hotel bedroom, four-poster bed, stone walls, warm lamp light, luxurious linens */}
{/* Image brief: hotel bathroom with roll-top bath, window overlooking countryside, golden light */}
{/* Image brief: hotel restaurant, candles, intimate dinner table, stone fireplace glowing */}
{/* Image brief: hotel lounge, deep armchairs, bookshelves, warm firelight */}
{/* Image brief: hotel grounds at sunrise, mist, rolling fields, stone walls */}
{/* Image brief: hotel terrace, morning coffee, countryside view, peaceful */}

### 5. Dining
- "The Restaurant" — Cormorant 700 italic
- Split: left text, right image
- Cormorant 300 italic pull quote: "Everything on the menu was either grown here, reared locally, or foraged from the surrounding countryside."
- Inter 300 muted: 2 paragraphs — Head Chef James Cole. Seasonal tasting menu changes weekly. Breakfast available to all guests. Restaurant open to non-residents Thursday–Sunday.
- Gold chips: "Seasonal Menu · Locally Sourced · Open to Non-Residents Thu–Sun"

{/* Image brief: hotel restaurant plated dish, beautifully presented seasonal food, candlelit table, warm editorial food photography */}

### 6. Experiences
- "What to Do" — Cormorant 700 italic
- 3 horizontal chips: Walking & Cycling (we provide maps and bikes) · Private Dining (exclusive hire available) · Spa Treatments (in-room therapist bookings)

### 7. Testimonials
- 3 cards: Cormorant italic pearl quote, guest name + room type in Inter 10px muted, 5-star gold row
- Stagger fade-up on scroll

### 8. Location
- "Getting Here" — Cormorant 700 italic
- Inter 300 muted: "Two hours from London, five minutes from Bourton-on-the-Water — the heart of the Cotswolds, without the tourist crowds"
- Two columns: by car / by train, Inter 300 muted directions

### 9. Book CTA
- Full-width warm gold `#c9a55a` background
- Cormorant 700 italic dark slate: "Is Your Date Available?"
- Inter 300 dark: "We take a limited number of bookings each month — check availability and reserve your room directly for our best rate"
- "Check availability →" dark slate button
- "Best rate direct · Dog friendly · Free parking" Inter 10px dark 70%

### 10. Footer
- Deep slate, Cormorant italic "The Aldwick" in gold
- Instagram · Pinterest · TripAdvisor
- "© 2026 The Aldwick · Boutique Hotel & Restaurant · Bourton-on-the-Water, Cotswolds GL54 · +44 1451 123 456"

## Animations
- Hero: stagger fade-up on mount (bottom-positioned), chips slide-in from left
- Room rows: hover raise + gold transition 0.2s
- Gallery: stagger fade-in on scroll
- Gold rules: scaleX 0→1, 0.5s

## Responsive
- Mobile: hero full-width, single-column gallery, hamburger nav

## Full Copy
- Wordmark: "The Aldwick"
- Hero: "A Place Unlike Any Other." / "12 individually designed rooms, a restaurant serving seasonal Cotswolds produce"
- Rooms: Classic from £180 · Deluxe from £240 · Suite from £380
- Dining: Seasonal tasting menu, locally sourced, open Thu–Sun
- Testimonial: "We stayed for three nights and genuinely didn't want to leave. The food was exceptional and every room detail had been thought about." — Charlotte & Ben W.
- CTA: "Is Your Date Available?" / "Reserve directly for our best rate"
