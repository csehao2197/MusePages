# Pilates Studio Website Prompt
# websiteprompts.ai

Build a calm, body-focused pilates and reformer studio website called "Forma Studio" using React + Vite + TypeScript + Tailwind CSS + Framer Motion (motion/react) + shadcn/ui + lucide-react.

## Design System

### Colors
```css
:root {
  --background: 40 18% 97%;         /* warm white #faf9f5 */
  --foreground: 150 12% 14%;        /* deep warm near-black */
  --primary: 155 20% 42%;           /* sage green #528a6e */
  --primary-foreground: 0 0% 100%;
  --accent: 15 35% 72%;             /* warm clay #c9927a */
  --surface: 40 14% 91%;            /* warm linen */
  --muted-foreground: 150 8% 52%;
  --border: 40 12% 82%;
}
```

### Typography
- Import: `https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500&display=swap`
- Headlines: DM Serif Display — italic sage accents
- Body: DM Sans 300–400
- Labels: DM Sans 500 uppercase 10px letter-spacing 0.12em

## Sections

### 1. Navbar
- Sticky warm white background, `backdrop-filter: blur(10px)`
- Left: DM Serif Display italic wordmark "Forma" in sage green
- Right: Classes · Schedule · Pricing · About + "Book a class →" sage button

### 2. Hero
- Full-viewport, warm white background
- Split layout: left content (50%), right tall portrait image (aspect-ratio 2/3, no border-radius)
- Left:
  - DM Sans 500 uppercase 10px sage label: "Reformer & Mat Pilates · Notting Hill"
  - DM Serif Display `clamp(46px, 6vw, 90px)`: "Stronger.\nLonger.\nCalmer."
  - DM Serif italic clay accent on "Calmer."
  - DM Sans 300 sub: "Small-group reformer and mat pilates for every body — from first-timers to advanced practitioners"
  - CTAs: "Book your intro →" (sage filled) + "View timetable" (ghost)
  - Trust chips: "APPI Certified · Max 6 Per Class · £30 Intro Offer"
- Hero image: Framer Motion float `y: 0→-6→0`, 8s loop

{/* Image brief: woman in pilates reformer position, focused expression, clean white studio, natural light, serene atmosphere */}

### 3. Class Types
- "What We Offer" — DM Serif Display with sage underline rule (scaleX 0→1)
- 4-card 2×2 grid, warm surface background:
  - Reformer Pilates (equipment-based, spring resistance, full body — from £22)
  - Mat Pilates (classical method, core-focused, all levels — from £16)
  - Reformer & Barre (cardio-sculpt fusion, reformer + barre work — from £24)
  - 1-2-1 Private (fully personalised, your pace, your goals — from £75)
- Each card: DM Serif name, DM Sans 300 description, sage price tag, clay lucide icon
- Hover: sage border + soft sage glow

### 4. Why Forma
- Split: left text, right image
- DM Serif Display: "Small Classes. Big Results."
- DM Sans 300: 2 paragraphs — max 6 people per class means genuine attention, genuine correction, genuine progress. APPI certified instructors. Every reformer individually set before you arrive.
- 4 check points with lucide Check in sage:
  - "Maximum 6 per class — always"
  - "APPI certified instructors"
  - "Reformers pre-set before you arrive"
  - "Beginners welcome — no experience needed"

{/* Image brief: small pilates reformer class, two students with instructor, bright minimal studio, attentive coaching, natural light */}

### 5. Timetable
- "This Week's Classes" — DM Serif Display
- 7-day horizontal scroll timetable (days as tabs, classes listed per day)
- Each class: DM Serif Display name, DM Sans 300 instructor + time, sage "spaces left" indicator, "Book →" link
- Tabs: Mon / Tue / Wed / Thu / Fri / Sat / Sun (shadcn/ui Tabs component)

### 6. Meet the Instructors
- "Your Instructors" — DM Serif Display
- 3 cards: portrait square (rounded-xl), DM Serif name, sage specialty chips, DM Sans 300 short bio
- Hover: soft sage glow

{/* Image brief: female pilates instructor, white studio, calm professional expression, natural light, minimal setting */}
{/* Image brief: female instructor headshot, pilates studio background, warm smile, sage tones */}
{/* Image brief: male pilates instructor, clean studio setting, athletic and approachable */}

### 7. Pricing
- "Choose Your Plan" — DM Serif Display
- 3 tier cards:
  - Drop In (any class, any time, £22–£24)
  - Studio Pass (8 classes/month, from £149/mo, save 15%)
  - Unlimited (unlimited classes + 1 private/month, from £199/mo — featured middle)
- Middle "Unlimited" card: sage border + "Most popular" badge
- DM Sans 300 feature list, lucide Check in sage, hover: soft sage glow

### 8. Testimonials
- Warm surface section
- 3 cards: 5-star row in sage, DM Serif italic quote, client name + class type in DM Sans 10px muted
- Stagger fade-up on scroll

### 9. Intro Offer CTA
- Full-width sage green `#528a6e` background
- DM Serif Display italic white: "Try Your First Class for £30"
- DM Sans 300 white: "No commitment — just show up, breathe, and move"
- "Book your intro →" ivory button
- "New clients only · All levels welcome · Cancel anytime" DM Sans 10px ivory 70%

### 10. Footer
- Warm near-black background, DM Serif italic wordmark in sage
- Instagram · YouTube · Google Maps
- "© 2026 Forma Studio · 12 Westbourne Park Road, Notting Hill, London W2"

## Animations
- Hero image: gentle float y: 0→-6→0, 8s loop
- Class cards: stagger fade-up on scroll
- Sage rules: scaleX 0→1, 0.5s
- Timetable tab transitions: 0.2s ease

## Responsive
- Mobile: stacked hero, single-column classes, scrollable timetable, hamburger nav

## Full Copy
- Wordmark: "Forma Studio"
- Hero: "Stronger. Longer. Calmer." / "Small-group reformer and mat pilates for every body"
- Classes: Reformer from £22 · Mat from £16 · Reformer & Barre from £24 · 1-2-1 from £75
- Pricing: Drop-in £22–24 · Studio Pass from £149/mo · Unlimited from £199/mo
- Testimonial: "I've tried every pilates studio in London. Forma is the only one where I've actually seen my body change in 8 weeks." — Emma K., member since 2024
- CTA: "Try Your First Class for £30" / "No commitment — just show up, breathe, and move"
