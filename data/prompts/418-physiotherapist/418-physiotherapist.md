# Physiotherapist Website Prompt
# websiteprompts.ai

Build a clean, modern physiotherapy and sports rehab clinic website called "Motion Clinic" using React + Vite + TypeScript + Tailwind CSS + Framer Motion (motion/react) + shadcn/ui + lucide-react.

## Design System

### Colors
```css
:root {
  --background: 0 0% 100%;
  --foreground: 215 28% 12%;          /* deep navy near-black */
  --primary: 215 60% 32%;             /* deep navy #1a2a4a */
  --primary-foreground: 0 0% 100%;
  --accent: 210 72% 50%;              /* electric blue #2a7dd4 */
  --surface: 215 14% 96%;
  --surface-raised: 215 12% 92%;
  --muted-foreground: 215 10% 52%;
  --border: 215 14% 88%;
}
```

### Typography
- Import: `https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap`
- All text: Plus Jakarta Sans
- Headlines: Plus Jakarta Sans 700–800
- Body: Plus Jakarta Sans 300–400
- Labels: Plus Jakarta Sans 600 uppercase 10px letter-spacing 0.12em

## Sections

### 1. Navbar
- Sticky white, thin navy border on scroll
- Left: Plus Jakarta Sans 700 "Motion Clinic" + small lucide Activity icon in electric blue
- Right: Conditions · Services · Our Physios · Book + "Book appointment →" navy button

### 2. Hero
- Full-viewport height, white background
- Split layout: left 55% content + floating UI card, right 45% photography
- Left panel `padding: 0 4vw 0 7vw`:
  - Plus Jakarta Sans 600 uppercase 10px blue label: "Physiotherapy & Sports Rehab · Shoreditch"
  - Plus Jakarta Sans 800 `clamp(38px, 5vw, 68px)` foreground: "Get Back to\nWhat You Love."
  - Plus Jakarta Sans 300 muted sub: "Expert physiotherapy for sports injuries, chronic pain, and post-surgical rehab — same-week appointments available"
  - CTAs: "Book assessment →" (navy filled) + "See our services" (ghost)
  - Trust chips: "HCPC Registered · CSP Members · Same-Week Appointments"
  - Floating UI card below CTAs: `background: white; border: 0.5px solid #e2e8f0; border-radius: 12px; padding: 16px 20px; max-width: 320px; margin-top: 2rem`
    - Plus Jakarta Sans 600 12px navy: "Free Body Assessment"
    - Plus Jakarta Sans 300 13px muted: "Book a 20-minute assessment and find out what's causing your pain"
    - Blue "Book free →" link
    - Framer Motion: scale from 0.9, fade in at 0.5s delay
- Right: close-up physiotherapy session photography, `object-fit: cover; object-position: center`, rounded-2xl

{/* Image brief: physiotherapist working with athlete on treatment table, professional clinical setting, focused hands-on technique, bright clean environment */}

- Hero stagger fade-up on mount

### 3. Conditions
- "What We Treat" — Plus Jakarta Sans 800
- 6 condition chips in 3×2 grid:
  - Back & Neck Pain · Sports Injuries · Post-Surgical Rehab · Shoulder & Knee · Running Injuries · Postural Pain
- Each chip: navy lucide icon, Plus Jakarta Sans 700 condition, Plus Jakarta Sans 300 muted one-line description, "Learn more →" blue link
- Hover: navy border + soft navy glow

### 4. Services
- "How We Help" — Plus Jakarta Sans 800
- 3 hover-raise rows:
  - 1-to-1 Physiotherapy (60-min assessment and treatment — from £85)
  - Sports Massage (deep tissue and sports recovery — from £60)
  - Biomechanical Assessment (full gait and movement analysis — from £120)
- Each: Plus Jakarta Sans 700 large service left + 300 description right + blue "→" + price
- `border-bottom: 1px solid hsl(var(--border))`
- Hover: surface-raised background, service name turns blue

### 5. Why Motion
- "Why Patients Choose Us" — Plus Jakarta Sans 800
- Split: left text, right image
- Plus Jakarta Sans 300 2 paragraphs — no generic 30-minute slots. Every appointment is 60 minutes with the same physio. We explain every diagnosis and every decision.
- 4 navy checkpoints: "60-min sessions — always · HCPC registered · Same-week availability · Specialist sports rehab track"

{/* Image brief: physio and patient reviewing movement assessment, patient in athletic wear, bright clinical setting */}

### 6. Our Physios
- "Your Clinicians" — Plus Jakarta Sans 800
- 3 physio cards: portrait (square, rounded-xl), Plus Jakarta Sans 700 name, blue HCPC chip, Plus Jakarta Sans 300 speciality bio
- Hover: soft blue glow

{/* Image brief: male physiotherapist, professional headshot, white clinical jacket, approachable expression */}
{/* Image brief: female physio, clinical setting, sports rehab background, confident */}
{/* Image brief: physio professional headshot, clean studio, warm smile */}

### 7. Process
- "Your Recovery Journey" — Plus Jakarta Sans 800
- 4 steps: Book Assessment → Diagnosis & Plan → Treatment → Return to Sport
- Large faded navy number (opacity 0.07) behind each step
- Plus Jakarta Sans 300 muted description, stagger fade-up on scroll

### 8. Testimonials
- Surface section
- 3 cards: 5-star blue row, Plus Jakarta Sans 300 italic quote, client name + condition in 10px muted
- Stagger fade-up on scroll

### 9. Booking CTA
- Full-width navy `#1a2a4a` background
- Plus Jakarta Sans 800 white: "Stop Managing Pain. Start Solving It."
- Plus Jakarta Sans 300 white: "Same-week appointments available — book online in under 60 seconds"
- "Book appointment →" white button
- "HCPC Registered · CSP Members · Shoreditch, London" Plus Jakarta Sans 10px white 70%

### 10. Footer
- Near-black, Plus Jakarta Sans 700 "Motion Clinic" in electric blue
- LinkedIn · Instagram · Google
- "© 2026 Motion Clinic · Physiotherapy & Sports Rehab · 34 Curtain Road, Shoreditch EC2A · Mon–Sat 7am–8pm"

## Animations
- Hero: stagger fade-up on mount, floating UI card scale 0.9→1 at 0.5s
- Conditions grid: stagger fade-up on scroll
- Process steps: stagger fade-up on scroll
- Navy rules: scaleX 0→1, 0.5s

## Responsive
- Mobile: stacked hero (photo top, text below), single-column conditions, hamburger nav

## Full Copy
- Wordmark: "Motion Clinic"
- Hero: "Get Back to What You Love." / "Expert physiotherapy for sports injuries, chronic pain, and post-surgical rehab"
- Conditions: Back Pain · Sports Injuries · Post-Surgical · Shoulder & Knee · Running Injuries · Postural
- Services: 1-to-1 from £85 · Sports Massage from £60 · Biomechanical from £120
- Free Body Assessment: "Book a 20-minute assessment — find out what's causing your pain"
- Testimonial: "I had a knee injury that three other physios couldn't fix. Motion Clinic diagnosed it in the first session and had me back running in 6 weeks." — Tom R., marathon runner
- CTA: "Stop Managing Pain. Start Solving It."
