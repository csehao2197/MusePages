# Atelier Blanche — Hair Salon Website Prompt

## 1. Goal Statement
Build a premium beauty studio website for Atelier Blanche, a high-end hair salon brand with a warm editorial aesthetic that feels like a luxury fashion magazine — cream backgrounds, rose gold accents, and rich serif typography.

## 2. Tech Stack
```
React + Vite + TypeScript + Tailwind CSS + Framer Motion (motion/react) + shadcn/ui + lucide-react
```

## 3. Design System — Colors
```css
:root {
  --background: 40 33% 97%;        /* warm cream #faf6f0 */
  --foreground: 25 14% 10%;        /* near-black #1a1612 */
  --primary: 15 35% 62%;           /* rose gold #c4907a */
  --primary-foreground: 0 0% 100%;
  --muted-foreground: 25 10% 55%;  /* warm mid-tone */
  --border: 30 20% 88%;            /* warm light border */
  --card: 38 30% 94%;              /* warm card bg */
  --accent: 15 35% 62%;            /* rose gold */
}
```

## 4. Typography
```html
<link href="https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Raleway:wght@300;400;500;600&display=swap" rel="stylesheet" />
```
- **Display headings (H1, H2):** Libre Baskerville, 400–700, italic variant for pull quotes
- **Body / navigation / labels / buttons:** Raleway, 300–600, letter-spacing 0.05–0.15em
- **Price / emphasis numbers:** Libre Baskerville, 400
- **Uppercase labels / tags:** Raleway 500, letter-spacing 0.2em, uppercase, 0.7rem
- **Body text:** Raleway 300–400, 1rem, line-height 1.8, color: var(--muted-foreground)

## 5. Visual Effects

### Effect 1 — Hero Full-Bleed Hair Editorial Video/Photo
```jsx
<section className="relative w-full h-screen overflow-hidden">
  {/* Image: professional hair model in upscale salon environment, warm editorial lighting from overhead and side, tight crop emphasizing movement in freshly styled hair, deep amber/warm tones, luxury feel, close-medium shot */}
  <img src="" alt="Atelier Blanche hair styling editorial" className="w-full h-full object-cover object-center" />
  {/* Dark gradient overlay left side — text legibility */}
  <div
    className="absolute inset-0"
    style={{ background: 'linear-gradient(to right, rgba(26,22,18,0.92) 0%, rgba(26,22,18,0.75) 45%, transparent 100%)' }}
  />
  {/* Subtle bottom gradient */}
  <div
    className="absolute inset-0"
    style={{ background: 'linear-gradient(to top, rgba(26,22,18,0.4) 0%, transparent 30%)' }}
  />
</section>
```

### Effect 2 — Service Cards Staggered Slide-In on Scroll
```tsx
import { motion } from 'motion/react'

{serviceCards.map((service, index) => (
  <motion.div
    key={service.id}
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-80px' }}
    transition={{
      duration: 0.65,
      delay: index * 0.15,
      ease: [0.22, 1, 0.36, 1]
    }}
    className="bg-card border border-border rounded-sm p-8 hover:shadow-lg transition-shadow duration-300"
  >
```

### Effect 3 — Infinite Horizontal Marquee (Service Tags)
```tsx
// InfiniteMarquee.tsx
import { motion } from 'motion/react'

const tags = ['CUT', 'COLOR', 'BALAYAGE', 'EXTENSIONS', 'BLOWOUT', 'TREATMENTS', 'BRIDAL', 'GLOSS', 'KERATIN']

export function InfiniteMarquee() {
  const doubled = [...tags, ...tags]
  return (
    <div className="overflow-hidden py-5 border-y" style={{ borderColor: 'var(--border)', background: 'var(--card)' }}>
      <motion.div
        className="flex gap-12 whitespace-nowrap"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
        style={{ width: 'max-content' }}
      >
        {doubled.map((tag, i) => (
          <span
            key={i}
            className="text-sm font-medium tracking-[0.25em] uppercase"
            style={{ color: 'var(--muted-foreground)', fontFamily: 'Raleway, sans-serif' }}
          >
            {tag}
            <span className="mx-6" style={{ color: 'var(--primary)' }}>·</span>
          </span>
        ))}
      </motion.div>
    </div>
  )
}
```

### Effect 4 — Before/After Comparison Slider
```tsx
// BeforeAfterSlider.tsx
import { useState, useRef, useCallback } from 'react'
import { motion } from 'motion/react'

export function BeforeAfterSlider() {
  const [position, setPosition] = useState(50)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    setPosition(Math.min(Math.max(x, 5), 95))
  }, [])

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[500px] overflow-hidden cursor-col-resize select-none rounded-sm"
      onMouseMove={handleMouseMove}
    >
      {/* BEFORE image */}
      {/* Image: natural hair color, no treatment, hair appears dull and lacking dimension, neutral salon lighting */}
      <img src="" alt="Before hair color treatment" className="w-full h-full object-cover object-center absolute inset-0" />

      {/* AFTER image — clipped */}
      <div className="absolute inset-0 overflow-hidden" style={{ width: `${position}%` }}>
        {/* Image: same model after balayage color service, hair glowing with warm honey/caramel tones, movement, richly lit, professional salon, stunning transformation */}
        <img src="" alt="After balayage color transformation" className="absolute inset-0 w-full h-full object-cover object-left" style={{ width: `${100 / (position / 100)}%` }} />
      </div>

      {/* Drag handle */}
      <motion.div
        className="absolute top-0 bottom-0 w-0.5 bg-white"
        style={{ left: `${position}%` }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center">
          <span style={{ color: 'var(--primary)', fontSize: '18px' }}>⇔</span>
        </div>
      </motion.div>

      {/* Labels */}
      <span className="absolute top-4 left-4 text-xs font-medium tracking-widest uppercase bg-black/50 text-white px-3 py-1">Before</span>
      <span className="absolute top-4 right-4 text-xs font-medium tracking-widest uppercase bg-black/50 text-white px-3 py-1">After</span>
    </div>
  )
}
```

### Effect 5 — Portfolio Gallery Horizontal Auto-Scroll Strip
```tsx
// HorizontalGallery.tsx
import { motion } from 'motion/react'

const galleryImages = Array(8).fill(null) // 8 portfolio photos

export function HorizontalGallery() {
  return (
    <div className="overflow-hidden py-2">
      <motion.div
        className="flex gap-3"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 35, repeat: Infinity, ease: 'linear' }}
        whileHover={{ animationPlayState: 'paused' }}
        style={{ width: 'max-content' }}
      >
        {[...galleryImages, ...galleryImages].map((_, i) => (
          <div key={i} className="w-64 h-80 flex-shrink-0 overflow-hidden rounded-sm">
            {/* Image descriptions for 8 slots: */}
            {/* 0: dramatic balayage transformation, warm honey tones, movement blur */}
            {/* 1: sleek blowout, model looking over shoulder, studio light */}
            {/* 2: textured curls treatment, voluminous and defined, natural light */}
            {/* 3: bridal updo with loose waves, elegant, soft window light */}
            {/* 4: platinum blonde color with face-framing highlights, editorial */}
            {/* 5: rich brunette gloss, smooth and reflective, professional styling */}
            {/* 6: before/after color correction, vibrant rich auburn, side-by-side crop */}
            {/* 7: lived-in highlights, casual luxe styling, natural outdoor light */}
            <img src="" alt={`Hair portfolio ${i % 8 + 1}`} className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-700" />
          </div>
        ))}
      </motion.div>
    </div>
  )
}
```

## 6. Component Breakdown

### 6.1 Navbar
```tsx
// Fixed top-0, z-40, w-full
// Height: h-18 (72px)
// Background: transparent on hero scroll, transitions to bg-[#faf6f0]/95 backdrop-blur-sm
// Layout: px-8 md:px-16, flex items-center justify-between
// Left: nav links desktop ["Services", "Portfolio", "Team", "About"] — Raleway 400, 0.8rem, letter-spacing 0.12em, uppercase, gap-8
//       active link: rose-gold underline (2px, offset 4px)
// Center: wordmark "ATELIER BLANCHE" — Libre Baskerville 400, 1.1rem, letter-spacing 0.2em, centered, absolute
// Right: "Book Now" button — rose gold bg, white text, px-6 py-2.5, Raleway 500, 0.75rem, letter-spacing 0.15em, uppercase
// Mobile: hide nav links, show hamburger, center wordmark
```

### 6.2 Hero Section
```tsx
// h-screen, relative, overflow-hidden
// Full-bleed editorial hair photo with dark left gradient
// Content: absolute left-8 md:left-16 bottom-16 max-w-xl
// Eyebrow: "Premium Hair Studio" — Raleway 400, 0.75rem, letter-spacing 0.3em, uppercase, text-white/60, mb-4
// H1: "Your Most\nConfident\nVersion\nStarts Here." — Libre Baskerville 700, clamp(2.5rem, 6vw, 5rem), text-white, line-height 1.05, mb-6
// Subtext: "Expert colour. Effortless style. Every time." — Raleway 300, 1.1rem, text-white/75, mb-8
// CTA buttons: flex gap-4
//   Primary: "Book Your Appointment" — bg-[#c4907a] text-white, px-8 py-4, Raleway 500, 0.875rem
//   Secondary: "View Our Work" — border border-white/50 text-white, px-8 py-4, same type
```

### 6.3 Infinite Marquee Strip
```tsx
// Position: immediately below hero
// bg-card, border-y border-border
// py-5
// See Effect 3 — InfiniteMarquee component
// Tags loop continuously, rose gold dot separator
// On hover: animation pauses
```

### 6.4 Services Section
```tsx
// py-24 px-8 md:px-16
// Header: flex justify-between items-end, mb-16
//   Left: label "OUR SERVICES" + H2 "Expert Services,\nHair as Art"
//   Right: "View all services →" link (Raleway 400, rose gold)
// Grid: grid-cols-1 sm:grid-cols-2 lg:grid-cols-4, gap-6
// Each card:
//   - bg-card, border border-border, rounded-sm, p-8, overflow-hidden
//   - Top: service icon placeholder (32px square, rose gold tint)
//   - Title: Libre Baskerville, 1.3rem, mb-2, text-foreground
//   - Description: Raleway 300, 0.9rem, text-muted-foreground, line-height 1.7, mb-4
//   - Price from: "From £45" — Raleway 500, 0.875rem, text-primary, mb-6
//   - Bottom: "Book Now →" link
//   - Rose gold top-border accent (3px) on hover, transition 0.3s
//   - Stagger entrance: delay index * 0.15s

// Service card photos:
// Card 1: {/* Image: model receiving professional haircut from stylist, scissors detail, salon bg */}
// Card 2: {/* Image: color application close-up, foils, balayage brush, rich color tones */}
// Card 3: {/* Image: deep conditioning treatment application, luxe salon environment, towel wrap */}
// Card 4: {/* Image: bridal hair trial updo, bride-to-be, flower accents, warm dressing-room light */}
```

### 6.5 Before/After Color Section
```tsx
// py-24 px-8 md:px-16, bg-card
// Heading: "The Transformation" — centered, Libre Baskerville Italic, 3rem, mb-4
// Subtext: centered, Raleway 300, 1rem, text-muted-foreground, mb-12
// BeforeAfterSlider component (see Effect 4) — max-w-4xl, mx-auto
// Below slider: caption text + "Book a Colour Consultation →" CTA link
```

### 6.6 Portfolio Gallery Strip
```tsx
// py-16, overflow-hidden (no px padding — full bleed strip)
// Label above: "PORTFOLIO" — centered, Raleway 500, 0.75rem, letter-spacing 0.3em, mb-6, text-muted-foreground
// HorizontalGallery component (see Effect 5)
// Caption below: centered, Raleway 300, 0.875rem, text-muted-foreground
```

### 6.7 About Section
```tsx
// py-24 px-8 md:px-16
// Layout: grid grid-cols-1 lg:grid-cols-2, gap-20, items-center
// Left column (text):
//   - Label "OUR STORY" — Raleway 500, 0.7rem, letter-spacing 0.3em, uppercase, mb-4, text-primary
//   - H2: Libre Baskerville, 2.5rem, mb-6
//   - Body: 2 paragraphs, Raleway 300, 1rem, line-height 1.85, text-muted-foreground
//   - Italic pull quote: Libre Baskerville Italic, 1.2rem, border-l-4 border-primary, pl-5, my-8, text-foreground
//   - Stats: flex gap-12, 3 stats (Years, Clients, Awards)
// Right column (photo):
//   {/* Image: warm bright salon interior — exposed brick or white wall, floor-to-ceiling mirror, luxury styling chairs, ambient warm light, elevated and aspirational feel */}
//   <img src="" alt="Atelier Blanche salon interior" className="w-full h-[600px] object-cover object-center rounded-sm" />
```

### 6.8 Team Section
```tsx
// py-24 px-8 md:px-16, bg-card
// Centered header: "Meet the Team" — Libre Baskerville, 2.5rem, mb-16
// Grid: grid-cols-1 md:grid-cols-3, gap-10
// Each card:
//   - Circular photo (w-48 h-48 rounded-full mx-auto mb-6 object-cover)
//   - Name: Libre Baskerville, 1.25rem, text-center, mb-1
//   - Specialty: Raleway 400, 0.85rem, text-primary, text-center, mb-2
//   - Instagram handle: @handle, Raleway 300, 0.8rem, text-muted-foreground, text-center
//   - Short bio: Raleway 300, 0.875rem, text-center, text-muted-foreground, max-w-[260px], mx-auto

// Team photo descriptions:
// {/* Image: female hairstylist, professional styling apron, warm confident smile, salon background, head & shoulders portrait */}
// {/* Image: female colorist holding color brush, artistic pose, salon environment, warm studio portrait */}
// {/* Image: male stylist, modern look, arms crossed, salon backdrop, friendly expression, head & shoulders */}
```

### 6.9 Testimonials
```tsx
// py-24 px-8 md:px-16
// Centered heading: "What Our Clients Say" — Libre Baskerville, 2.5rem, mb-16
// Grid: grid-cols-1 md:grid-cols-3, gap-8
// Each card: bg-card, border border-border, rounded-sm, p-8
//   - Stars: 5 × ★ in rose gold (#c4907a), mb-4, font-size 1rem
//   - Quote: Libre Baskerville Italic, 1rem, line-height 1.8, text-foreground/80, mb-6
//   - Author: flex items-center gap-3
//     - Circular avatar photo (w-10 h-10 rounded-full object-cover)
//     - Name: Raleway 500, 0.9rem + date: Raleway 300, 0.75rem, text-muted-foreground
```

### 6.10 Booking Section
```tsx
// py-24 px-8 md:px-16, bg-[#1a1612], text-white (dark section)
// Layout: grid grid-cols-1 lg:grid-cols-2, gap-16, items-center
// Left:
//   - Eyebrow: "BOOK AN APPOINTMENT" — Raleway 500, 0.7rem, letter-spacing 0.3em, text-primary, mb-4
//   - H2: Libre Baskerville, 3rem, text-white, mb-4
//   - Body: Raleway 300, 1rem, text-white/60, line-height 1.8, mb-8
//   - Contact info: phone, email, address — each with lucide icon, Raleway 300, 0.9rem, text-white/60
// Right:
//   - Glassmorphism booking frame:
//     border border-white/10, bg-white/5, backdrop-blur-sm, rounded-sm, p-8
//   - Inside: Name, Email, Service (select), Date preference, Message inputs
//   - Raleway 300 placeholder text, rose gold focus ring
//   - Submit: full-width bg-primary button
```

### 6.11 Footer
```tsx
// py-16 px-8 md:px-16, bg-[#1a1612], border-t border-white/10
// Top: grid grid-cols-2 md:grid-cols-4, gap-12, pb-12, border-b border-white/10
//   Col 1: Wordmark + tagline + social icons
//   Col 2: Services links
//   Col 3: Studio links (About, Team, Press, Careers)
//   Col 4: Contact (address, hours, phone)
// Bottom: flex justify-between, pt-8
//   Left: copyright text — Raleway 300, 0.75rem, text-white/30
//   Right: Privacy Policy · Terms — same style
```

## 7. Animations

### Navbar scroll
```tsx
const [scrolled, setScrolled] = useState(false)
// After 60px: 'bg-[#faf6f0]/95 backdrop-blur-sm shadow-sm' : 'bg-transparent'
transition={{ duration: 0.25 }}
```

### Hero text entrance (staggered)
```tsx
// Eyebrow: delay 0.3s
// H1: delay 0.5s, y: 40→0
// Subtext: delay 0.7s
// Buttons: delay 0.9s, opacity 0→1
// All: duration 0.8s, ease [0.22, 1, 0.36, 1]
```

### Marquee
```tsx
// x: '0%' → '-50%', duration 22s, repeat Infinity, ease 'linear'
// whileHover: set animation to paused state
```

### Service card hover
```tsx
// border-top: 0→3px rose gold, transition 0.3s
// shadow: sm→lg, transition 0.3s
// whileHover: y: -4, transition duration 0.3s
```

### Before/after slider
```tsx
// Smooth mouse tracking, no transition on position for real-time feel
// Handle: slight scale on mousedown (scale 1→1.1)
```

### Gallery strip
```tsx
// x: '0%' → '-50%', duration 35s, repeat Infinity, ease 'linear'
// Image hover: scale 1→1.05, duration 0.7s ease
```

### Section headings entrance
```tsx
initial={{ opacity: 0, y: 20 }}
whileInView={{ opacity: 1, y: 0 }}
viewport={{ once: true }}
transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
```

## 8. Responsive

### Mobile (< 768px)
- Navbar: wordmark centered, hamburger right, no nav links visible
- Hero: gradient shifts to full-overlay (text over darker image), H1 3rem
- Marquee: slightly faster (18s), same implementation
- Services: single column, each card full-width
- Before/After slider: full-width, touch events supported
- Gallery strip: same (works naturally), slightly smaller images (w-48 h-64)
- About: photo full-width top, text below
- Team: single column, stacked
- Testimonials: single column, swipeable (add touch scroll)
- Booking: single column, form below text
- Footer: 2-column grid top, stacked below md

### Desktop (>= 1024px)
- All multi-column layouts activated
- Navbar: full horizontal nav, wordmark centered
- Hero: text max-w-xl, positioned left-16 bottom-16
- Services: 4 columns
- About: 2 equal columns
- Team: 3 columns
- Booking: 2 columns (text left, form right)
- Footer: 4 columns

## 9. Full Copy

### Brand Name
Atelier Blanche

### Navbar
- Wordmark: ATELIER BLANCHE
- Links: Services · Portfolio · Team · About
- CTA: Book Now

### Hero
- Eyebrow: Premium Hair Studio
- H1: Your Most Confident Version Starts Here.
- Subtext: Expert colour. Effortless style. Every time.
- Primary CTA: Book Your Appointment
- Secondary CTA: View Our Work

### Marquee Tags
CUT · COLOR · BALAYAGE · EXTENSIONS · BLOWOUT · TREATMENTS · BRIDAL · GLOSS · KERATIN ·

### Services Section
- Label: OUR SERVICES
- H2: Expert Services, Hair as Art
- Subtext: From precision cuts to complex colour — every service is performed with intention and expertise.
- **Card 1 — Cut & Style**
  - Desc: Precision cutting tailored to your face shape, lifestyle, and hair texture. Every cut is a conversation, every finish is art.
  - From: From £65
- **Card 2 — Colour**
  - Desc: Balayage, highlights, full colour, glossing — our colour specialists bring depth, dimension, and radiance to every shade.
  - From: From £120
- **Card 3 — Treatments**
  - Desc: Keratin smoothing, deep conditioning masks, scalp treatments, and bond repair. Healthier hair from root to tip.
  - From: From £55
- **Card 4 — Bridal**
  - Desc: Comprehensive bridal hair packages for your most important day. Includes trials, morning-of styling, and full bridal party coordination.
  - From: From £200

### Before/After Section
- Heading: The Transformation
- Subtext: Drag to reveal the before and after on our latest colour transformation.
- Caption: Balayage colour service — 3 hours with our senior colour specialist.
- CTA: Book a Colour Consultation →

### Portfolio Section
- Label: PORTFOLIO
- Caption: Follow us @atelierblanche for daily inspiration

### About Section
- Label: OUR STORY
- H2: Where Hair Meets Art
- Para 1: Atelier Blanche was born from a simple conviction: that your hair should make you feel like yourself — only more. We opened our doors in the heart of the city with a small team of exceptional stylists and a shared obsession with craft.
- Para 2: Every appointment here is deliberate. We don't rush. We don't over-book. We listen, we create, and we make sure you walk out looking exactly how you imagined — and better.
- Pull quote: "Hair is the most intimate form of personal expression. We take that seriously."
- Stats: 8+ Years · 2,400+ Clients · 3 Awards

### Team Section
- Heading: Meet the Team
- **Stylist 1 — Marie Laurent**
  - Specialty: Senior Colourist
  - Instagram: @marielaurent
  - Bio: 12 years of colour expertise across London and Paris. Known for her signature balayage and bespoke colour blending.
- **Stylist 2 — Chloe Park**
  - Specialty: Master Stylist
  - Instagram: @chloepark_hair
  - Bio: A precision cutting specialist with a gift for understanding how hair moves with (and for) each individual client.
- **Stylist 3 — Tom Ashby**
  - Specialty: Texture & Extensions
  - Instagram: @tomashbyhair
  - Bio: From textured cuts to seamless extensions, Tom brings technical precision and an effortless eye for dimension.

### Testimonials Section
- Heading: What Our Clients Say
- **Testimonial 1**
  - Quote: "I've been going to salons my whole life and never felt truly seen until I found Atelier Blanche. Marie understood my hair and gave me exactly what I'd been trying to describe for years."
  - Author: Jessica T. — 3 months ago
- **Testimonial 2**
  - Quote: "The balayage I came in for was stunning. But the entire experience — the consultation, the care, the result — was genuinely unlike any salon I've ever been to."
  - Author: Priya S. — 1 month ago
- **Testimonial 3**
  - Quote: "Atelier Blanche did my hair for my wedding and I cried when I saw it. In the best way. Chloe is an absolute genius. Booked them for every client event since."
  - Author: Hannah W. — 2 months ago

### Booking Section
- Eyebrow: BOOK AN APPOINTMENT
- H2: Ready to Transform?
- Body: Book online or call us directly. We do our best to accommodate requests within 48 hours and have cancellation slots available most weeks.
- Contact: 020 7123 4567 · hello@atelierblanche.com · 14 Marylebone Lane, London W1U 2NE
- Form labels: Full Name · Email Address · Service · Preferred Date · Message (optional)
- Button: Request Appointment
- Note: We'll confirm your appointment within 24 hours.

### Footer
- Col 1: Atelier Blanche · Luxury hair studio in the heart of London · [Instagram, Pinterest icons]
- Col 2: Services — Cut & Style · Colour · Balayage · Bridal · Treatments · Extensions
- Col 3: Studio — About · Our Team · Press · Gift Cards · Careers
- Col 4: Visit — 14 Marylebone Lane, London W1U 2NE · Mon–Sat 9am–7pm · Sun 10am–5pm · 020 7123 4567
- Copyright: © 2025 Atelier Blanche. All rights reserved.

## 10. Key Dependencies
```json
{
  "motion": "^12.0.0",
  "lucide-react": "^0.462.0",
  "@radix-ui/react-select": "^2.1.0",
  "@radix-ui/react-dialog": "^1.1.0",
  "clsx": "^2.1.0",
  "tailwind-merge": "^2.3.0"
}
```
