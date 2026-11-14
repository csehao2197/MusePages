# Recruitment Agency Website Prompt
# websiteprompts.ai

Build a dark, bold recruitment and talent agency website called "Apex Talent" using React + Vite + TypeScript + Tailwind CSS + Framer Motion (motion/react) + shadcn/ui + lucide-react.

## Design System

### Colors
```css
:root {
  --background: 0 0% 7%;              /* near-black #111111 */
  --foreground: 0 0% 95%;             /* white */
  --primary: 0 0% 95%;
  --primary-foreground: 0 0% 7%;
  --accent: 20 82% 50%;               /* electric orange #e85c1a */
  --surface: 0 0% 10%;
  --surface-raised: 0 0% 14%;
  --muted-foreground: 0 0% 55%;
  --border: 0 0% 18%;
}
```

### Typography
- Import: `https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&family=Inter:wght@300;400;500&display=swap`
- Headlines: Space Grotesk 700 — sharp, confident
- Body: Inter 300–400
- Labels: Inter 500 uppercase 10px letter-spacing 0.14em

## Sections

### 1. Navbar
- Sticky near-black, `backdrop-filter: blur(12px)`
- Left: Space Grotesk 700 "APEX" uppercase in orange
- Right: For Companies · For Candidates · Sectors · About + "Hire talent →" orange button

### 2. Hero
- Full-viewport height, near-black background
- Full-bleed photography `position: absolute inset-0 w-full h-full object-cover object-center`
- Composition-independent overlay: `linear-gradient(to right, rgba(17,17,17,0.97) 0%, rgba(17,17,17,0.78) 52%, rgba(17,17,17,0.30) 100%)`
- Large background text: "TALENT" in Space Grotesk 700 `font-size: clamp(200px, 28vw, 420px)` at `opacity: 0.04`, `position: absolute; left: -1%; top: 50%; transform: translateY(-50%); z-index: 1`
- Content `z-index: 10`, left-aligned `padding-left: 7vw`, centered vertically:
  - Inter 500 uppercase 10px orange label: "Executive Recruitment · London & Remote"
  - Space Grotesk 700 `clamp(48px, 7vw, 105px)` white, line-height 0.88: "WE FIND THE\nPEOPLE WHO\nCHANGE COMPANIES."
  - Orange accent on "CHANGE COMPANIES."
  - Inter 300 muted sub: "Executive search and mid-level recruitment across technology, finance, and creative industries — hired in 21 days or we work for free"
  - CTAs: "Hire talent →" (orange filled, dark text) + "Find a role" (ghost white)
  - Floating stat chips: "21-Day Hire Guarantee · 400+ Placements · 94% Retention Rate"

{/* Image brief: professional office environment, confident executive in modern glass building, dramatic overhead lighting, commercial photography, editorial corporate style */}

- Stagger fade-up on mount: label (0s), headline (0.1s), sub (0.25s), CTAs (0.4s), chips (0.55s)

### 3. What We Do
- "Who We Place" — Space Grotesk 700 white
- 3 hover-raise rows:
  - Technology & Product (engineers, product managers, CTOs — startups to enterprise)
  - Finance & Operations (CFOs, FDs, analysts — Series A to FTSE 100)
  - Creative & Marketing (CMOs, creative directors, brand teams)
- Each: Space Grotesk 700 large sector left + Inter 300 muted description right + orange "→"
- `border-bottom: 1px solid hsl(var(--border))`
- Hover: surface-raised, name turns orange

### 4. Stats Strip
- Full-width orange `#e85c1a`, 80px
- 4 dark Space Grotesk 700 stats: "400+ Placements" · "21-Day Guarantee" · "94% Retention" · "12 Years"
- Framer Motion count-up on scroll, dark dividers

### 5. Process — For Companies
- "How We Hire For You" — Space Grotesk 700 white
- 4 steps: Brief & Search → Screened Shortlist → Interviews → Offer & Onboard
- Large faded orange number (opacity 0.06) behind each step
- Inter 300 muted description, stagger fade-up on scroll

### 6. Why Apex
- Split: left text, right image
- Space Grotesk 700 white: "We're Not a CV Forwarding Service"
- Inter 300 muted: 2 paragraphs — every candidate is spoken to by a senior consultant, not a junior researcher. We present 4 candidates, not 40. Quality, not volume.
- 4 orange checkpoints: "21-day hire guarantee · Senior consultants only · 4 candidates, not 40 · Post-placement check-ins"

{/* Image brief: recruitment consultant and client in meeting, professional conference room, collaborative, city view */}

### 7. For Candidates
- "Looking for Your Next Role?" — Space Grotesk 700
- Centered surface-raised section
- Inter 300 muted: "Register with Apex and get access to exclusive roles — many never advertised publicly"
- "Register as a candidate →" orange button + "Browse open roles" ghost

### 8. Testimonials
- Surface-raised section
- 3 cards: 5-star orange row, Inter 300 italic white quote, company name + role placed in Inter 10px muted

### 9. CTA
- Full-width near-black, orange top border 3px
- Space Grotesk 700 white `clamp(42px, 5vw, 72px)`: "YOUR NEXT HIRE STARTS TODAY"
- Inter 300 muted: "21-day hire guarantee, or we work for free on the next search — no risk, no obligation"
- "Start a search →" orange button
- "Executive Search · Technology · Finance · Creative · London & Remote" Inter 10px muted

### 10. Footer
- Near-black, Space Grotesk 700 "APEX" in orange
- LinkedIn · Twitter/X · Email
- "© 2026 Apex Talent · Executive Recruitment · London · EST. 2012"

## Animations
- Hero: stagger fade-up, "TALENT" bg text fade in 1s delay
- Stats strip: count-up on scroll
- Process steps: stagger fade-up
- All hover: 0.15s ease

## Responsive
- Mobile: stacked hero, single-column sectors, hamburger nav

## Full Copy
- Wordmark: "APEX"
- Hero: "WE FIND THE PEOPLE WHO CHANGE COMPANIES." / "Executive search and mid-level recruitment — hired in 21 days or we work for free"
- Sectors: Technology & Product · Finance & Operations · Creative & Marketing
- Stats: 400+ Placements · 21-Day Guarantee · 94% Retention · 12 Years
- Guarantee: 21-day hire guarantee or we work for free on the next search
- Testimonial: "Apex placed our Head of Product in 14 days. Every candidate they presented was genuinely hireable — which has never happened with any other agency." — Sarah T., CTO, London
- CTA: "YOUR NEXT HIRE STARTS TODAY"
