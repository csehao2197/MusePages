# Yoga Studio Website Prompt
# websiteprompts.ai

Build a calm, grounded yoga studio website called "Solis Studio" using React + Vite + TypeScript + Tailwind CSS + Framer Motion (motion/react) + shadcn/ui + lucide-react.

## Design System

### Colors
```css
:root {
  --background: 38 25% 97%;        /* warm white #faf7f2 */
  --foreground: 25 20% 18%;        /* warm near-black */
  --primary: 145 22% 52%;          /* sage green #6b9e7a */
  --primary-foreground: 0 0% 100%;
  --surface: 38 20% 93%;           /* warm sand */
  --surface-raised: 38 18% 89%;
  --muted-foreground: 25 12% 52%;
  --border: 38 18% 84%;
}
```

### Typography
- Import: `https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500&display=swap`
- Headlines: DM Serif Display (italic for accents)
- Body: DM Sans 300–500
- Labels: DM Sans 500 uppercase 10px letter-spacing 0.12em

## Sections

### 1. Navbar
- Sticky warm white bg, `backdrop-filter: blur(10px)`
- Left: DM Serif Display wordmark "Solis Studio" with small sage leaf icon (lucide Leaf)
- Right: Classes · About · Pricing · Contact + "Book a class →" sage green button

### 2. Hero
- Full-viewport, warm white background
- Split layout: left content, right large square image (aspect-ratio 1/1, rounded-2xl)
- Left: DM Sans 500 uppercase 10px sage label "— Yoga & Mindfulness Studio"
- DM Serif Display `clamp(48px, 7vw, 96px)` headline: "Find Your\nStillness"
- Italic accent word in sage green
- DM Sans 300 sub: "In-studio and online yoga classes for every level, in the heart of Bristol"
- Two CTAs: "Explore classes →" (sage filled) + "Free first class" (ghost sage)
- Below CTAs: 3 trust chips in warm surface: "200+ members · Est. 2019 · 4.9★ on Google"

{/* Image brief: woman in yoga pose, natural light studio, wooden floors, plants, peaceful warm tones */}

### 3. Class Types Strip
- Full-width warm surface strip
- 4 class type chips with lucide icons: Hatha · Vinyasa Flow · Yin · Meditation
- DM Sans 500 labels, sage icon, each chip separated by thin border
- Slide-in from left on scroll, stagger 0.08s

### 4. Schedule Teaser
- "This Week's Classes" in DM Serif Display with sage underline rule (scaleX 0→1)
- 5 class rows as horizontal list items with `border-bottom: 1px solid hsl(var(--border))`
- Each row: day + time (DM Sans 500 left) · class name in DM Serif Display (center) · instructor + spots left (DM Sans 300 right) · "Book →" sage link
- "View full timetable →" sage outlined button below

### 5. Instructors
- "Meet the Teachers" in DM Serif Display
- 3 instructor cards: portrait image (square, rounded-xl), name in DM Serif Display, style specialty in sage DM Sans 500 uppercase, short bio DM Sans 300
- Hover: sage glow `box-shadow: 0 0 24px hsl(145 22% 52% / 0.15)`

{/* Image brief: female yoga instructor, calm confident expression, natural light studio, plants in background */}
{/* Image brief: male yoga instructor, seated meditation pose, natural light, warm tones */}
{/* Image brief: female instructor in warrior pose, studio with wooden floors, bright natural light */}

### 6. Studio Gallery
- Full-width gallery strip: 4 images, equal height 320px, no gap, slight scale on hover
- Stagger fade-in on scroll

{/* Image brief: bright yoga studio interior, wood floors, large windows, plants, morning light */}
{/* Image brief: group yoga class, instructor adjusting student, warm light, communal feeling */}
{/* Image brief: studio changing room detail, warm towels, candles, peaceful aesthetic */}
{/* Image brief: outdoor yoga class, morning light, green surroundings, group of students */}

### 7. Membership Pricing
- "Join the Studio" in DM Serif Display with sage rule
- 3 cards: Drop-in (single class £18) · Monthly (unlimited classes £89/mo) · Annual (unlimited + workshops £799/yr)
- Each card: DM Serif Display name, DM Sans 300 features with lucide Check in sage, price tag in DM Serif Display large
- Middle "Monthly" card: sage border + "Most popular" badge
- Hover: soft sage glow

### 8. Testimonials
- Warm surface section
- 3 cards: DM Serif italic quote, member name + membership type in DM Sans 10px muted
- 5-star row in sage

### 9. CTA Banner
- Full-width sage green `#6b9e7a` background
- DM Serif Display italic white: "Your First Class Is Free"
- DM Sans 300 white sub: "No experience needed — just bring yourself"
- "Claim your free class →" white bg dark text button
- "No commitment · Cancel anytime" in DM Sans 10px white 70% below

### 10. Footer
- Warm near-black background
- Left: sage wordmark + lucide Leaf icon
- Center: nav links DM Sans 300
- Right: Instagram · Facebook icons
- "© 2026 Solis Studio · Bristol, UK · Online classes worldwide"
- Thin sage top border

## Animations
- Hero image: gentle float animation `y: 0→-6→0`, 6s loop
- Schedule rows: stagger fade-up on scroll
- Sage rules: scaleX 0→1, 0.5s
- Gallery: stagger fade-in on scroll
- All hover: 0.2s ease

## Responsive
- Mobile: stacked hero (image above content), single-column schedule, hamburger nav

## Full Copy
- Wordmark: "Solis Studio"
- Tagline: "Yoga & Mindfulness · Bristol"
- Hero: "Find Your Stillness" / "In-studio and online yoga classes for every level, in the heart of Bristol"
- Schedule: Monday 07:00 Hatha — Sarah · Tuesday 18:30 Vinyasa Flow — James · Wednesday 12:00 Yin — Elena · Thursday 19:00 Meditation — Sarah · Saturday 09:00 Weekend Flow — James
- Pricing: Drop-in £18 · Monthly Unlimited £89/mo · Annual £799/yr
- Testimonial: "Solis completely changed my relationship with my body and mind. I've been coming for two years and it still feels like the best hour of my week." — Laura M., member since 2024
- CTA: "Your First Class Is Free" / "No experience needed — just bring yourself"
- Footer: "© 2026 Solis Studio · 12 Queen's Road, Bristol BS8 · Online classes available worldwide"
