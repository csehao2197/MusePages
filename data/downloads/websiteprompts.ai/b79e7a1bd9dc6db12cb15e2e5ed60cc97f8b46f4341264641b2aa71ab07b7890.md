# Online Course / E-Learning Website Prompt
# websiteprompts.ai

Build a clean, modern online course and e-learning platform website called "Craft Academy" using React + Vite + TypeScript + Tailwind CSS + Framer Motion (motion/react) + shadcn/ui + lucide-react.

## Design System

### Colors
```css
:root {
  --background: 42 10% 98%;           /* warm white #fafaf7 */
  --foreground: 215 28% 12%;          /* deep navy */
  --primary: 215 48% 22%;             /* deep navy #1a2440 */
  --primary-foreground: 0 0% 100%;
  --accent: 38 62% 52%;               /* amber #d4903a */
  --surface: 42 10% 94%;
  --surface-raised: 42 8% 98%;
  --muted-foreground: 215 10% 50%;
  --border: 42 12% 86%;
}
```

### Typography
- Import: `https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap`
- All text: Plus Jakarta Sans
- Headlines: Plus Jakarta Sans 700–800
- Body: Plus Jakarta Sans 300–400
- Labels: Plus Jakarta Sans 600 uppercase 10px letter-spacing 0.10em

## Sections

### 1. Navbar
- Sticky warm white, thin border on scroll
- Left: Plus Jakarta Sans 700 "Craft Academy" + small lucide GraduationCap icon in amber
- Right: Courses · Instructors · Community · Pricing + "Start free →" navy button

### 2. Hero
- Full-viewport height, warm white background
- Split: left 55% editorial content + floating course card, right 45% photography (rounded-2xl)
- Left panel `padding: 0 4vw 0 7vw`:
  - Plus Jakarta Sans 600 uppercase 10px amber label: "Online Courses · Learn at Your Own Pace"
  - Plus Jakarta Sans 800 `clamp(38px, 5vw, 68px)` foreground, line-height 1.05: "Learn From\nExperts.\nNot Algorithms."
  - Plus Jakarta Sans 300 muted sub: "Real skills from real practitioners — design, development, marketing, and business. Short courses with lifetime access."
  - CTAs: "Browse courses →" (navy filled) + "See how it works" (ghost)
  - Trust chips: "4,200+ Students · 4.9★ Rated · Lifetime Access"
  - Floating course preview card below CTAs:
    `background: white; border: 0.5px solid var(--color-border); border-radius: 12px; padding: 16px 18px; max-width: 300px; margin-top: 2rem; box-shadow: 0 2px 12px rgba(0,0,0,0.06)`
    - Amber category chip: "MOST POPULAR"
    - Plus Jakarta Sans 700 14px navy: "UI Design Fundamentals"
    - Plus Jakarta Sans 300 12px muted: "6 modules · 4.2hrs · Lifetime access"
    - 5-star amber row + "4.9 (312 reviews)"
    - Amber "Enrol now →" link
    - Framer Motion: scale from 0.9, fade in at 0.5s

{/* Image brief: person learning at desk with laptop, notebook open, warm focused atmosphere, modern home workspace, natural light — genuine concentration, not staged */}

- Hero stagger fade-up on mount

### 3. Featured Courses
- "Our Courses" — Plus Jakarta Sans 800
- 6-course 3×2 grid:
  - UI Design Fundamentals (6 modules, 4.2hrs, from £49)
  - Framer for Designers (8 modules, 5.5hrs, from £59)
  - Brand Strategy (5 modules, 3hrs, from £49)
  - Copywriting That Converts (4 modules, 2.5hrs, from £39)
  - No-Code Web Dev (10 modules, 8hrs, from £79)
  - Product Management 101 (7 modules, 6hrs, from £59)
- Each card: amber category chip, Plus Jakarta Sans 700 course name, Plus Jakarta Sans 300 module + duration, 5-star rating, amber price tag
- Hover: navy border + soft navy glow

### 4. How It Works
- "Learn Differently" — Plus Jakarta Sans 800
- 4 steps: Browse & Enrol → Watch at Your Pace → Practice Projects → Get Certified
- Large faded navy number (opacity 0.07) behind each step
- Plus Jakarta Sans 300 muted description, stagger fade-up on scroll

### 5. Instructors
- "Taught by Practitioners" — Plus Jakarta Sans 800
- 3 instructor cards: portrait (square, rounded-xl), Plus Jakarta Sans 700 name, amber speciality chip, Plus Jakarta Sans 300 bio (2 lines — working in the field, not just teaching it)
- Hover: soft amber glow

{/* Image brief: designer at work in professional studio, relaxed and expert, clean modern environment */}
{/* Image brief: developer with multiple monitors, focused, professional home studio setup */}
{/* Image brief: marketing professional headshot, confident and approachable, warm light */}

### 6. Stats Strip
- Full-width navy `#1a2440`, 72px
- 4 amber Plus Jakarta Sans 700 stats: "4,200+ Students" · "24 Courses" · "4.9★ Average Rating" · "Lifetime Access"
- Framer Motion count-up on scroll, amber dividers

### 7. Pricing
- "Simple Pricing" — Plus Jakarta Sans 800
- 3 tiers:
  - Single Course (buy once, keep forever, from £39)
  - All Access Monthly (every course + new releases, £19/mo)
  - All Access Annual (every course + community + coaching calls, £149/yr — featured, amber border + "Best value" badge)
- Plus Jakarta Sans 700 tier name, Plus Jakarta Sans 300 feature list, lucide Check in amber
- Hover: soft amber glow

### 8. Testimonials
- Warm surface section
- 3 cards: 5-star amber row, Plus Jakarta Sans 300 italic quote, student name + course in Plus Jakarta Sans 10px muted
- Stagger fade-up on scroll

### 9. Enrol CTA
- Full-width navy `#1a2440`
- Plus Jakarta Sans 800 white: "Start Learning Today — First Lesson Free"
- Plus Jakarta Sans 300 white: "No credit card required — browse every course, watch the first lesson, and only pay if you love it"
- "Start for free →" amber button (dark text)
- "No commitment · Lifetime access when you buy · Cancel monthly anytime" Plus Jakarta Sans 10px white 70%

### 10. Footer
- Near-black, Plus Jakarta Sans 700 "Craft Academy" in amber
- Twitter/X · LinkedIn · YouTube
- "© 2026 Craft Academy · Online Courses · Learn Anywhere · Lifetime Access"

## Animations
- Hero: stagger fade-up on mount, floating course card scale 0.9→1 at 0.5s
- Course grid: stagger fade-up on scroll
- Stats strip: count-up on scroll
- Pricing cards: stagger fade-up

## Responsive
- Mobile: stacked hero, single-column courses, hamburger nav

## Full Copy
- Wordmark: "Craft Academy"
- Hero: "Learn From Experts. Not Algorithms." / "Real skills from real practitioners — design, development, marketing, and business"
- Courses: UI Design £49 · Framer £59 · Brand Strategy £49 · Copywriting £39 · No-Code Dev £79 · Product Management £59
- Stats: 4,200+ Students · 24 Courses · 4.9★ Rating · Lifetime Access
- Pricing: Single from £39 · All Access £19/mo · Annual £149/yr
- Testimonial: "I finished the Framer course on a Saturday and had my first freelance client by the following Thursday. The quality is genuinely professional level." — James T., freelance designer
- CTA: "Start Learning Today — First Lesson Free"
