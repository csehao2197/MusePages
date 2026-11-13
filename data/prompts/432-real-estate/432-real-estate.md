# Real Estate Agent Website Prompt
# websiteprompts.ai

Build a premium real estate agent personal website called "James Harlow Properties" using React + Vite + TypeScript + Tailwind CSS + Framer Motion (motion/react) + shadcn/ui + lucide-react.

## Design System

### Colors
```css
:root {
  --background: 0 0% 100%;
  --foreground: 224 20% 12%;        /* deep charcoal #1a1c2e */
  --primary: 38 50% 56%;            /* warm gold #c9a060 */
  --primary-foreground: 0 0% 100%;
  --surface: 220 14% 96%;
  --surface-dark: 224 20% 12%;      /* charcoal for dark sections */
  --muted-foreground: 224 10% 52%;
  --border: 220 14% 88%;
}
```

### Typography
- Import: `https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,400&family=Inter:wght@300;400;500;600&display=swap`
- Headlines: Cormorant Garamond 600–700
- Body/UI: Inter 300–600
- Property data/prices: Inter 600, gold for prices

## Sections

### 1. Navbar
- Sticky white bg with subtle shadow on scroll
- Left: Cormorant wordmark "James Harlow" + "Properties" in Inter 300 muted
- Right: Listings · About · Process · Contact + "Get a free valuation →" gold button

### 2. Hero
- Split layout: left content (55%), right large property image with rounded-2xl (45%)
- Left content:
  - Inter 500 uppercase 10px muted label: "Prime London Property Specialist"
  - Cormorant 700 `clamp(48px, 6vw, 88px)`: "Finding Your\nPerfect\nHome"
  - Gold italic accent on "Perfect"
  - Inter 300 sub: "Specialist in prime London residential property — Mayfair, Kensington, Chelsea"
  - Two CTAs: "Browse listings →" (gold filled) + "Free valuation" (ghost gold)
  - Three trust chips: "£200M+ sold · 15 yrs experience · 4.9★ Google"

{/* Image brief: luxury London townhouse exterior, white stucco facade, black iron railings, bright day, premium residential street */}

### 3. Stats Strip
- Full-width charcoal `#1a1c2e` background, 90px tall
- 4 white stats in Cormorant italic: "£200M+ Sold" · "320+ Homes" · "15 Years" · "4.9★ Avg Rating"
- Gold dividers between stats
- Framer Motion useSpring count-up on scroll (numbers only)

### 4. Featured Listings
- "Featured Properties" in Cormorant 700 with gold underline rule (scaleX 0→1)
- 3 property cards in a row:
  - Each: full-width image (aspect-ratio 4/3), property name + area chip (Inter 500), beds/baths/sqft row with lucide icons, gold price tag (Inter 600)
  - Hover: gold border + card lifts `translateY(-4px)`, `box-shadow: 0 8px 32px rgba(0,0,0,0.12)`
  - "View details →" gold link at bottom
- "See all listings →" outlined gold button below

{/* Image brief: luxury London apartment interior, large windows, elegant minimal decor, natural light */}
{/* Image brief: Georgian townhouse living room, high ceilings, period features, warm lighting */}
{/* Image brief: modern penthouse with city skyline view, open plan, premium finishes */}

### 5. About
- Split: right portrait image, left text
- Inter 500 uppercase 10px gold label: "About James"
- Cormorant 700: "15 Years of Placing People in Exceptional Homes"
- Inter 300 bio: 2 paragraphs — personal approach, deep market knowledge, trusted by families and investors alike
- Four gold chips: "Mayfair · Kensington · Chelsea · Notting Hill"
- "Book a discovery call →" gold link

{/* Image brief: professional male real estate agent portrait, suit, confident warm smile, bright office background */}

### 6. Process Steps
- "How It Works" in Cormorant 700
- 4-step horizontal row: Discovery Call → Market Appraisal → Curated Shortlist → Keys in Hand
- Large faded gold Cormorant number (opacity 0.10) behind each step title
- Inter 300 description per step

### 7. Testimonials
- White surface section
- 3 cards: 5-star gold row, Cormorant italic quote, client name + property area in Inter 10px muted
- Stagger fade-up on scroll

### 8. Valuation CTA
- Full-width charcoal `#1a1c2e` background
- Cormorant 700 italic white: "What Is Your Property Worth?"
- Inter 300 white sub: "Get a free, no-obligation market appraisal from James"
- Large gold "Book a free valuation →" button
- Inter 10px muted white: "No obligation · Honest market insight · Usually within 48 hours"

### 9. Footer
- Charcoal background, 3 columns: Brand + tagline · Links · Contact (phone, email, address)
- Inter 10px muted: "James Harlow is a member of the Property Ombudsman. Registered in England & Wales."
- "© 2026 James Harlow Properties"

## Animations
- Hero image: subtle float `y: 0→-5→0`, 7s loop
- Stats: useSpring count-up on scroll
- Listing cards: stagger fade-up on scroll
- Gold rules: scaleX 0→1, 0.5s
- All hover: 0.2s ease

## Responsive
- Mobile: stacked hero, single-column listings, hamburger nav

## Full Copy
- Wordmark: "James Harlow Properties"
- Tagline: "Prime London Residential Property Specialist"
- Hero: "Finding Your Perfect Home" / "Specialist in prime London residential property — Mayfair, Kensington, Chelsea"
- Stats: £200M+ Sold · 320+ Homes · 15 Years · 4.9★ Rating
- Listings: The Kensington Residence · 4 bed · £3,200,000 | Chelsea Mews House · 3 bed · £2,850,000 | Mayfair Penthouse · 2 bed · £4,500,000
- Process: Discovery Call → Market Appraisal → Curated Shortlist → Keys in Hand
- Testimonial: "James didn't just find us a house — he found us a home. His knowledge of Kensington is unmatched." — The Harrison Family, 2025
- CTA: "What Is Your Property Worth?" / "Free, no-obligation market appraisal"
