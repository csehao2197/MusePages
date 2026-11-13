# Coffee Shop Website Prompt
# websiteprompts.ai

Build a warm, artisanal coffee shop and café website called "Groundwork Coffee" using React + Vite + TypeScript + Tailwind CSS + Framer Motion (motion/react) + shadcn/ui + lucide-react.

## Design System

### Colors
```css
:root {
 --background: 35 30% 97%; /* warm cream #faf6ef */
 --foreground: 22 40% 12%; /* espresso near-black */
 --primary: 22 55% 28%; /* espresso brown #6b3a1f */
 --primary-foreground: 35 30% 97%;
 --accent: 38 65% 55%; /* warm amber #c9833a */
 --surface: 35 25% 91%; /* warm oat */
 --muted-foreground: 22 15% 50%;
 --border: 35 20% 82%;
}
```

### Typography
- Import: `https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,400;1,600&family=DM+Sans:wght@300;400;500&display=swap`
- Headlines: Playfair Display 600–700 — italic amber accents
- Body: DM Sans 300–400
- Labels: DM Sans 500 uppercase 10px letter-spacing 0.12em

## Sections

### 1. Navbar
- Sticky warm cream background, `backdrop-filter: blur(10px)`
- Left: Playfair italic wordmark "Groundwork" in espresso + small lucide Coffee icon in amber
- Right: Menu · Our Coffee · About · Find Us + "Order ahead →" espresso button

### 2. Hero
- Full-viewport height, warm cream background
- Full-bleed café image, 68% viewport height, no border radius
- Gradient bottom fade: `linear-gradient(to top, rgba(250,246,239,1) 0%, transparent 45%)`
- Content z-10 below image in page flow, centered:
 - DM Sans 500 uppercase 10px muted label: "Specialty Coffee · Dalston, London"
 - Playfair Display 700 `clamp(52px, 7vw, 110px)`: "Good Coffee.\nGood People.\nGreat Days."
 - Italic amber accent on "Great Days."
 - DM Sans 300: "Single-origin espresso, seasonal filter, and everything baked from scratch"
 - CTAs: "See our menu →" (espresso filled) + "Find us" (ghost)
 - Trust chips: "Specialty Roaster · Organic Milk · Dog Friendly"

{/* Image brief: warm independent coffee shop interior, wooden tables, Edison bulbs, exposed brick, morning light, cozy inviting atmosphere */}

### 3. Menu Highlights
- "What's On" — Playfair 700 with amber underline rule (scaleX 0→1)
- 4 cards in 2×2 grid, warm surface background:
 - Espresso Drinks (flat white, cortado, oat latte — from £3.20)
 - Filter Coffee (V60, Chemex, cold brew — from £3.50)
 - All-Day Brunch (avocado toast, eggs, granola — from £8)
 - Baked Goods (croissants, banana bread, seasonal cakes — from £2.80)
- Each card: large image (4/3 aspect), Playfair 600 name, DM Sans 300 description, amber price tag
- Hover: espresso border + image scale 1.02

{/* Image brief: close-up of flat white with latte art on warm wooden table, natural morning light */}
{/* Image brief: V60 pour over coffee being brewed, ceramic dripper, steam, editorial close-up */}
{/* Image brief: avocado toast brunch plate, artisan bread, eggs, café table setting */}
{/* Image brief: fresh croissants and pastries on marble counter, warm light, artisan bakery feel */}

### 4. Brew Methods Strip
- Full-width warm amber strip with opacity 15% background
- 4 brew method icons with DM Sans 500 names: Espresso · V60 · Chemex · Cold Brew
- Playfair italic below each: short description (1 line)
- Slide-in from left on scroll, stagger 0.1s

### 5. Our Coffee
- "From Farm to Cup" — Playfair 700
- Split: left text, right stacked image pair
- Playfair 300 italic quote: "Every bag tells the story of the farmer who grew it."
- DM Sans 300: 2 paragraphs — direct trade sourcing, single-origin focus, 3 rotating seasonal origins. Roasted in East London.
- Espresso chips: "Direct Trade · Single Origin · Seasonal Rotating"
- "Shop our beans →" espresso outlined button

{/* Image brief: coffee beans being poured from burlap sack, warm studio lighting, rustic artisan atmosphere */}

### 6. About
- Split: right café/founder image, left text
- Playfair 700: "Opened with One Machine and a Big Idea"
- DM Sans 300 bio: 2 paragraphs — founded 2019 by Jamie Walsh, former accountant who quit to open the café he always wanted.
- Amber chips: "Est. 2019 · Specialty SCA · Community Hub"

{/* Image brief: coffee shop owner behind the bar, smiling, casual apron, warm café background, natural light */}

### 7. Gallery Strip
- 5 images, 280px height, horizontal strip, scale on hover, no border radius

{/* Image brief: latte art being poured into ceramic cup, skilled barista hands, close-up */}
{/* Image brief: cozy coffee shop corner, two friends chatting over coffee, warm afternoon light */}
{/* Image brief: coffee shop exterior, independent shopfront, plants, chalkboard sign */}
{/* Image brief: barista grinding coffee beans, morning routine, café equipment */}
{/* Image brief: seasonal filter coffee served in glass, ice, summer menu editorial */}

### 8. Events & Space
- "Hire the Space" — Playfair 700
- Centered warm surface section
- DM Sans 300: "Available for private hire evenings and weekends — coffee cuppings, team breakfasts, and popup events"
- Two option chips: Private Hire · Coffee Cuppings
- "Enquire about events →" espresso button

### 9. Testimonials
- Warm surface section
- 3 cards: Playfair italic quote, customer name + visit type in DM Sans 10px muted, 5-star row in amber
- Stagger fade-up on scroll

### 10. Find Us CTA
- Full-width espresso background
- Playfair 700 italic cream: "Come and Say Hello"
- DM Sans 300 cream: "Monday–Friday 7am–5pm · Saturday–Sunday 8am–5pm"
- "Get directions →" cream button

### 11. Footer
- Espresso background, Playfair italic wordmark in amber
- "© 2026 Groundwork Coffee · 14 Kingsland Road, Dalston, London E8"

## Animations
- Hero: stagger fade-up on mount (y: 30→0, 0.7s)
- Menu cards: stagger fade-up on scroll
- Amber rules: scaleX 0→1, 0.5s
- All hover: 0.2s ease

## Responsive
- Mobile: single-column menu grid, stacked hero, hamburger nav

## Full Copy
- Wordmark: "Groundwork Coffee"
- Hero: "Good Coffee. Good People. Great Days." / "Single-origin espresso, seasonal filter, and everything baked from scratch"
- Menu: Espresso from £3.20 · Filter from £3.50 · Brunch from £8 · Baked from £2.80
- Hours: Mon–Fri 7am–5pm · Sat–Sun 8am–5pm
- Testimonial: "Best flat white in Dalston, no competition. The banana bread is dangerous." — @coffeelover, Google Review
