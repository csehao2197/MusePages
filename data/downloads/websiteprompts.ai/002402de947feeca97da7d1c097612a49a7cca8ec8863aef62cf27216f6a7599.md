# Florist Website Prompt
# websiteprompts.ai

Build a dark, editorial luxury florist and flower studio website called "Bloom Studio" using React + Vite + TypeScript + Tailwind CSS + Framer Motion (motion/react) + shadcn/ui + lucide-react.

## Design System

### Colors
```css
:root {
  --background: 145 12% 11%;          /* deep forest #1a2e1e */
  --foreground: 38 22% 93%;           /* warm ivory */
  --primary: 145 14% 30%;             /* muted forest */
  --primary-foreground: 38 22% 93%;
  --accent: 15 38% 62%;               /* dusty rose #c4917a */
  --surface: 145 10% 15%;
  --surface-raised: 145 8% 19%;
  --muted-foreground: 38 10% 60%;
  --border: 145 8% 22%;
}
```

### Typography
- Import: `https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600;1,700&family=DM+Sans:wght@300;400;500&display=swap`
- Headlines: Cormorant Garamond 700 italic — monumental scale
- Body: DM Sans 300–400
- Labels: DM Sans 500 uppercase 10px letter-spacing 0.14em

## Sections

### 1. Navbar
- Sticky, `background: hsl(var(--background))`, `backdrop-filter: blur(12px)`
- Left: Cormorant italic wordmark "Bloom Studio" in dusty rose
- Right: Arrangements · Weddings · About · Care + "Order flowers →" dusty rose outlined button

### 2. Hero
- Full-viewport height, deep forest background
- Split layout: left 45% editorial panel, right 55% full-bleed photography (no border-radius, flush with viewport right edge)
- Left panel deep forest background, `padding: 0 4rem`:
  - DM Sans 500 uppercase 10px rose label: "London Florist · Bespoke Arrangements"
  - Cormorant Garamond 700 italic `clamp(62px, 8vw, 115px)` ivory, line-height 0.92: "Flowers\nThat Say\nEverything."
  - Dusty rose accent on "Everything."
  - DM Sans 300 muted sub: "Hand-tied arrangements, seasonal wedding flowers, and same-day London delivery — made by hand, never from a catalogue"
  - CTAs: "Browse arrangements →" (rose filled) + "Wedding flowers" (ghost)
  - Floating detail image: `position: absolute`, 180px square crop of single stem, right edge of panel overlapping photo boundary, `z-index: 10`, no border-radius, Framer Motion scale from 0.85 on mount (0.6s delay)
- Right photography: `object-fit: cover; object-position: center`, full-height, no overlay

{/* Image brief: close-up of dark luxuriant bouquet — deep burgundy roses, black dahlias, eucalyptus, moody dark studio lighting, editorial, Vogue floral photography style */}

- Hero stagger fade-up on mount: label (0s), heading (0.15s), sub (0.3s), CTAs (0.45s)

### 3. Arrangement Types
- "Our Work" — Cormorant 700 italic ivory with rose underline rule (scaleX 0→1)
- 3 full-width hover-raise rows:
  - Bespoke Arrangements (hand-tied, seasonal stems, from £45)
  - Event Florals (corporate events, intimate dinners, installations — from £180)
  - Wedding Flowers (full styling from bridal party to reception — from £800)
- Each: Cormorant 600 italic large name left + DM Sans 300 muted description right + rose "→" + price right-aligned
- `border-bottom: 1px solid hsl(var(--border))`
- Hover: `background: hsl(var(--surface-raised))`, name turns rose

### 4. Signature Collection
- "This Season" — Cormorant 700 italic ivory
- 4-image editorial grid: 2 tall (3/4 ratio) + 2 wide (4/3 ratio), no border-radius, 2px gap
- Hover: ivory overlay `opacity 0→0.12` + Cormorant italic arrangement name in center
- Stagger fade-in on scroll

{/* Image brief: hand-tied arrangement of pampas grass, dried flowers, warm amber tones, moody studio background */}
{/* Image brief: tall vase arrangement, tropical leaves and white anthuriums, dark editorial photography */}
{/* Image brief: wedding arch of white florals and greenery, sun-drenched outdoor venue */}
{/* Image brief: single flower close-up — black dahlia, water droplets, near-macro editorial */}

### 5. Process
- "How It Works" — Cormorant 700 italic
- 3 horizontal steps: Choose Your Stems → We Build It By Hand → Same-Day Delivery
- Large faded ivory Cormorant number (opacity 0.05) behind each step
- DM Sans 300 muted description, stagger fade-up on scroll

### 6. About
- "The Studio" — Cormorant 700 italic
- Split: right image, left text
- Cormorant 300 italic pull quote: "Every arrangement is made the day you order it. No warehouse. No batch production. Just flowers, cut fresh."
- DM Sans 300 muted 2-paragraph bio
- Rose chips: "London · Est. 2018 · Sustainable Sourcing"

{/* Image brief: florist at work, hands arranging stems on worn timber table, warm light from window, editorial lifestyle photography */}

### 7. Weddings
- "Wedding Florals" — Cormorant 700 italic
- Full-width dark surface section
- Cormorant 300 italic: "From bouquets to full venue styling — we work with you from the first consultation to the last petal."
- 3 floating image chips in a row (ceremony / reception / bridal party)
- "Start your wedding enquiry →" rose button

### 8. Testimonials
- 3 cards: Cormorant italic ivory quote, client name + occasion in DM Sans 10px muted, 5-star row in rose
- Stagger fade-up on scroll

### 9. Delivery CTA
- Full-width dusty rose `#c4917a` background
- Cormorant 700 italic dark forest: "Same-Day London Delivery"
- DM Sans 300 dark: "Order before 11am for same-day delivery across Central and Greater London — or choose your date at checkout"
- "Order now →" forest button
- "Free delivery over £80 · Recyclable packaging · Sustainably sourced" DM Sans 10px dark 70%

### 10. Footer
- Deep forest background, Cormorant italic wordmark in rose
- Instagram · Pinterest · Google
- "© 2026 Bloom Studio · Floral Design · London EC1 · Same-Day Delivery Available"

## Animations
- Hero: stagger fade-up on mount, floating detail image scale 0.85→1 at 0.6s
- Arrangement rows: hover raise + rose transition 0.2s
- Grid: stagger fade-in on scroll
- Rose rules: scaleX 0→1, 0.5s

## Responsive
- Mobile: stacked hero (photo top, text below), single-column grid, hamburger nav

## Full Copy
- Wordmark: "Bloom Studio"
- Hero: "Flowers That Say Everything." / "Hand-tied arrangements, seasonal wedding flowers, and same-day London delivery"
- Types: Bespoke from £45 · Event from £180 · Wedding from £800
- Process: Choose → Build by Hand → Same-Day Delivery
- Testimonial: "I ordered a bouquet at 9am and it arrived by 2pm. The arrangement was nothing like anything you'd find in a supermarket — genuinely beautiful." — Alice K., Islington
- CTA: "Same-Day London Delivery" / "Order before 11am"
