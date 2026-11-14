# Wedding Photographer Website Prompt
# websiteprompts.ai

Build a romantic editorial wedding photographer portfolio website called "Clara Bloom Photography" using React + Vite + TypeScript + Tailwind CSS + Framer Motion (motion/react) + shadcn/ui + lucide-react.

## Design System

### Colors
```css
:root {
  --background: 40 33% 97%;        /* warm cream #fdf8f0 */
  --foreground: 20 15% 15%;
  --primary: 5 40% 61%;            /* blush rose #c97a6d */
  --primary-foreground: 0 0% 100%;
  --surface: 38 30% 93%;
  --muted-foreground: 20 10% 50%;
  --border: 30 20% 85%;
}
```

### Typography
- Import: `https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,400;1,600&family=Plus+Jakarta+Sans:wght@300;400;500&display=swap`
- Headlines: Cormorant Garamond 600–700 — italic rose accents
- Body: Plus Jakarta Sans 300–400
- Labels: Plus Jakarta Sans 500 uppercase 10px letter-spacing 0.1em

## Sections

### 1. Navbar
- Sticky cream background with `backdrop-filter: blur(12px)`, thin rose bottom border on scroll
- Left: Cormorant italic wordmark "Clara Bloom" in primary rose
- Right: Portfolio · About · Investment · Contact + "Book a consultation →" rose button

### 2. Hero
- Full-viewport cream background, centered layout
- Cormorant Garamond 700 `clamp(56px, 9vw, 120px)`: "Documenting\nLove\nStories" — italic rose on "Love"
- Plus Jakarta Sans 300 sub: "Wedding & elopement photography across the UK & Europe"
- Two CTAs: "View portfolio →" (rose filled) + "See packages" (ghost)
- Below CTAs: row of 5 square thumbnails 80px each, rounded-sm, stagger fade-in
- Below thumbnails: "200+ couples · Featured in Brides Magazine · Booked 12 months ahead" Inter 10px muted

{/* Image brief: romantic couple portrait, soft golden hour light, outdoor garden, editorial film style */}
{/* Image brief: bride adjusting veil in window light, soft bokeh, warm tones, intimate */}
{/* Image brief: couple walking through wildflower field, backlit sun, dreamy haze */}
{/* Image brief: outdoor ceremony under floral arch, wide angle, natural light */}
{/* Image brief: reception candid, fairy lights, guests laughing, documentary style */}

### 3. Portfolio Grid
- "Selected Work" in Cormorant italic 700, rose underline rule scaleX 0→1 on scroll
- Asymmetric 3-column grid, 6 images, alternating aspect-ratios (4/5, 3/4, 1/1)
- Hover: cream overlay opacity 0→1 with couple name + location in Cormorant italic centered
- Stagger fade-up: y: 20→0, opacity: 0→1, 0.4s, index * 0.08s delay

{/* Image brief: outdoor wedding ceremony wide shot, floral decor, warm afternoon light, countryside */}
{/* Image brief: bride and groom portrait against stone wall, editorial, soft light */}
{/* Image brief: intimate coastal elopement, cliffs, misty light, couple embracing */}
{/* Image brief: reception table detail, candles, flowers, warm bokeh */}
{/* Image brief: bride laughing candidly with bridesmaids, natural light */}
{/* Image brief: first dance silhouette, warm backlight, romantic blur */}

### 4. Stats Strip
- Full-width warm surface strip 80px tall
- 4 stats in Cormorant italic: "200+ Couples" · "8 yrs experience" · "UK & Europe" · "Booked for 2026"
- Thin rose dividers between stats, stagger fade-in on scroll

### 5. About
- Two-column: left portrait photo, right text
- Cormorant 700: "Hi, I'm Clara"
- Plus Jakarta Sans 300 bio: 2 short paragraphs — natural light, candid storytelling over posing
- Three rose chips: "Natural Light · Candid Moments · Film-Inspired"

{/* Image brief: female photographer portrait, warm indoor light, editorial pose, cream background */}

### 6. Packages
- "Investment" in Cormorant 700 with rose rule
- 3 cards: Elopement (half day, 200 images, from £1,200) · Wedding Day (full day, 400+ images, engagement session, from £2,400) · Destination (2 days, 600+ images, travel included, from £4,200)
- Middle "Wedding Day" card: rose border + "Most popular" badge
- Hover: soft rose glow `box-shadow: 0 0 24px hsl(5 40% 61% / 0.15)`
- Features listed with lucide Check icons in rose

### 7. Testimonials
- 3 cream surface cards: 5-star row in rose, Cormorant 400 italic quote, couple name + date in Plus Jakarta Sans 10px muted
- Stagger fade-up on scroll

### 8. CTA Banner
- Full-width blush rose `#c97a6d` background
- Cormorant 700 italic white: "Let's Tell Your Story"
- Sub: "Limited dates available for 2026 — enquire early"
- Buttons: "Book a consultation" (white bg, dark text) + "View full portfolio" (ghost white)
- "Usually responds within 24 hours" in Plus Jakarta Sans 10px white 70% below

### 9. Footer
- Near-black background, italic Cormorant wordmark in rose
- Nav links center, Instagram + Pinterest icons right
- "© 2026 Clara Bloom Photography · London, UK · Available worldwide"
- Thin rose top border

## Animations
- Hero: stagger fade-up on mount (y: 30→0, 0.7s)
- Portfolio grid: IntersectionObserver stagger
- Rose rules: scaleX 0→1, 0.5s
- All hover: 0.2s ease

## Responsive
- Mobile: single-column grid, clamp(40px, 8vw, 80px) hero type, hamburger nav

## Full Copy
- Wordmark: "Clara Bloom Photography"
- Hero: "Documenting Love Stories" / "Wedding & elopement photography across the UK & Europe"
- Nav: Portfolio · About · Investment · Contact
- Packages: Elopement from £1,200 · Wedding Day from £2,400 · Destination from £4,200
- Testimonial: "Clara captured moments we didn't even know were happening — the photos are beyond anything we imagined." — Sophie & James, June 2025
- CTA: "Let's Tell Your Story" / "Limited dates available for 2026 — enquire early"
- Footer: "© 2026 Clara Bloom Photography · London, UK · Available worldwide"
