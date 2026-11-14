# Inkwell Studio — Tattoo Studio Website Prompt

## 1. Goal Statement
Build a raw, bold, artist-portfolio-forward website for Inkwell Studio, a premium tattoo studio brand with a pure black and electric red aesthetic — underground zine meets editorial art gallery, powered by glitch effects, noise texture, and infinite marquee.

## 2. Tech Stack
```
React + Vite + TypeScript + Tailwind CSS + Framer Motion (motion/react) + shadcn/ui + lucide-react
```

## 3. Design System — Colors
```css
:root {
  --background: 0 0% 2%;             /* near-pure black #050505 */
  --foreground: 30 10% 94%;          /* off-white #f0ede8 */
  --primary: 0 73% 45%;              /* electric red #cc2222 */
  --primary-foreground: 0 0% 100%;
  --muted-foreground: 30 8% 58%;     /* warm gray */
  --border: 0 0% 12%;                /* dark border */
  --card: 0 0% 6%;                   /* near-black card */
  --accent: 0 73% 45%;               /* electric red */
  --red-glow: rgba(204, 34, 34, 0.3);
}
```

## 4. Typography
```html
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet" />
```
- **Display headings / wordmark (H1, large hero text):** Bebas Neue, letter-spacing 0.05em, line-height 0.95
- **Body / navigation / UI / labels:** Space Mono 400–700, letter-spacing 0.05em, monospace feel
- **Section eyebrows / tags:** Space Mono 700, 0.7rem, letter-spacing 0.2em, uppercase, color: var(--primary)
- **Body copy paragraphs:** Space Mono 400, 0.9rem, line-height 1.9, color: var(--muted-foreground)
- **Price / accent numbers:** Bebas Neue, 3–4rem, text-primary
- **Nav links:** Space Mono 400, 0.8rem, letter-spacing 0.12em, uppercase, text-foreground/70 hover:text-foreground

## 5. Visual Effects

### Effect 1 — Hero Glitch Animation on "INKWELL" Wordmark
```tsx
// GlitchText.tsx
import { motion } from 'motion/react'
import { useState, useEffect } from 'react'

export function GlitchText({ text }: { text: string }) {
  const [glitching, setGlitching] = useState(false)

  useEffect(() => {
    // Trigger glitch every 3 seconds
    const interval = setInterval(() => {
      setGlitching(true)
      setTimeout(() => setGlitching(false), 400)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative inline-block">
      {/* Main text */}
      <span
        className="relative z-10 font-display text-foreground"
        style={{ fontFamily: 'Bebas Neue, sans-serif', letterSpacing: '0.05em' }}
      >
        {text}
      </span>
      {/* Red glitch layer */}
      <span
        className="absolute inset-0 font-display text-primary"
        style={{
          fontFamily: 'Bebas Neue, sans-serif',
          letterSpacing: '0.05em',
          clipPath: glitching ? 'inset(15% 0 50% 0)' : 'inset(50% 0 50% 0)',
          transform: glitching ? 'translateX(-4px)' : 'translateX(0)',
          opacity: glitching ? 0.9 : 0,
          transition: 'clip-path 0.08s steps(2), transform 0.08s steps(2), opacity 0.05s',
        }}
      >
        {text}
      </span>
      {/* White glitch layer */}
      <span
        className="absolute inset-0 font-display text-foreground"
        style={{
          fontFamily: 'Bebas Neue, sans-serif',
          letterSpacing: '0.05em',
          clipPath: glitching ? 'inset(55% 0 25% 0)' : 'inset(50% 0 50% 0)',
          transform: glitching ? 'translateX(5px)' : 'translateX(0)',
          opacity: glitching ? 0.7 : 0,
          transition: 'clip-path 0.1s steps(2), transform 0.1s steps(2), opacity 0.05s',
          transitionDelay: '0.04s',
        }}
      >
        {text}
      </span>
    </div>
  )
}
```

### Effect 2 — Dual-Row Portfolio Ticker (Infinite Marquee, Opposite Directions)
```tsx
// PortfolioTicker.tsx
import { motion } from 'motion/react'

// 8 tattoo photos per row = 16 total (both rows)
const row1Images = Array(8).fill(null)
const row2Images = Array(8).fill(null)

function MarqueeRow({ images, reverse = false }: { images: null[]; reverse?: boolean }) {
  const doubled = [...images, ...images]
  return (
    <div className="overflow-hidden">
      <motion.div
        className="flex gap-3"
        animate={{ x: reverse ? ['-50%', '0%'] : ['0%', '-50%'] }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        style={{ width: 'max-content' }}
      >
        {doubled.map((_, i) => (
          <div key={i} className="w-56 h-72 flex-shrink-0 overflow-hidden relative group">
            {/* Row 1 image descriptions (indices 0–7): */}
            {/* 0: fine line botanical tattoo — delicate fern frond on inner arm, black ink, healed state, clean white BG close-up */}
            {/* 1: traditional rose tattoo — classic bold red rose, black outline, forearm, vibrant, medium shot */}
            {/* 2: blackwork geometric tattoo — intricate mandala/geometric on upper arm, striking pattern, skin BG close-up */}
            {/* 3: realism portrait tattoo — lifelike female face in profile, shading technique, shoulder, studio light */}
            {/* 4: fine line minimalist — tiny constellation tattoo on wrist, delicate single-needle style */}
            {/* 5: Japanese traditional — koi fish and waves, bold color and line, upper arm, vibrant */}
            {/* 6: blackwork animal — fox silhouette with geometric elements, thigh, artistic composition */}
            {/* 7: realism nature — hyper-realistic moth with luna pattern, black and grey, forearm */}
            {/* Row 2 image descriptions (same slots in row 2, different tattoos): */}
            {/* 0: traditional dagger and rose — bold lines, forearm sleeve segment, classic American traditional */}
            {/* 1: fine line script — elegant handwritten quote, ribcage placement, delicate and precise */}
            {/* 2: blackwork architecture — cityscape skyline, ankle, detailed crosshatch shading */}
            {/* 3: realism animal — black and grey wolf portrait, shoulder blade, incredible detail */}
            {/* 4: fine line portrait — minimal face with floral elements, collarbone, delicate */}
            {/* 5: neo-traditional flower — ornate peony with decorative shading, watercolor influence, upper arm */}
            {/* 6: geometric abstract — sacred geometry intersecting circles, sternum, precise linework */}
            {/* 7: traditional eagle — bold American traditional, chest piece, powerful composition */}
            <img
              src=""
              alt={`Tattoo portfolio piece ${i % 8 + 1}`}
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            />
            {/* Red hover overlay */}
            <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors duration-300" />
          </div>
        ))}
      </motion.div>
    </div>
  )
}

export function PortfolioTicker() {
  return (
    <section className="py-6 space-y-3 overflow-hidden">
      <MarqueeRow images={row1Images} reverse={false} />
      <MarqueeRow images={row2Images} reverse={true} />
    </section>
  )
}
```

### Effect 3 — Noise/Grain Texture Overlay (Critical for Raw Feel)
```tsx
// GrainOverlay.tsx — MUST render at root level, z-50
export function GrainOverlay() {
  return (
    <div
      className="fixed inset-0 z-[999] pointer-events-none select-none"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.92' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        mixBlendMode: 'overlay',
        opacity: 0.35,
      }}
    />
  )
}
```

### Effect 4 — Artist Cards with Deep Red Left Border Hover
```tsx
import { motion } from 'motion/react'

<motion.div
  className="relative bg-card border border-border p-8 cursor-pointer overflow-hidden group"
  whileHover={{ borderColor: 'rgba(204,34,34,0.4)' }}
  transition={{ duration: 0.25 }}
>
  {/* Red left accent border — slides in on hover */}
  <motion.div
    className="absolute left-0 top-0 bottom-0 w-1 bg-primary"
    initial={{ scaleY: 0 }}
    whileHover={{ scaleY: 1 }}
    transition={{ duration: 0.25, ease: 'easeOut' }}
    style={{ originY: 0 }}
  />
  {/* Card content */}
</motion.div>
```

### Effect 5 — Red Glow on Booking CTA Section
```tsx
<section
  className="py-24 px-8 md:px-16 relative overflow-hidden"
  style={{ background: 'var(--background)' }}
>
  {/* Red glow blob */}
  <div
    className="absolute inset-0 flex items-center justify-center pointer-events-none"
    style={{ zIndex: 0 }}
  >
    <div
      className="w-[600px] h-[300px] rounded-full blur-[120px]"
      style={{ background: 'rgba(204,34,34,0.15)' }}
    />
  </div>
  <div className="relative z-10">
    {/* CTA content */}
  </div>
</section>
```

## 6. Component Breakdown

### 6.1 Navbar
```tsx
// Fixed, top-0, z-40, w-full, bg-[#050505]/90 backdrop-blur-sm, border-b border-border
// Height: h-16 (64px)
// Layout: px-6 md:px-12, flex items-center justify-between
// Left: "INKWELL" wordmark — Bebas Neue, 1.8rem, letter-spacing 0.1em, text-foreground
//       With a small red dot/underscore accent after wordmark
// Center (desktop): nav links ["Portfolio", "Artists", "Styles", "Process", "FAQ", "Book"]
//   Space Mono 400, 0.75rem, letter-spacing 0.12em, uppercase, gap-8, text-foreground/60, hover text-foreground
// Right: "Book Now" — border border-primary text-primary, px-5 py-2, Space Mono 700, 0.75rem, uppercase
//        hover: bg-primary text-white, transition 0.2s
// Mobile: hamburger (3 horizontal lines, 20px, text-foreground), full-screen black menu
//         Links in Bebas Neue, 3rem, centered, with red hover color
```

### 6.2 Hero Section
```tsx
// min-h-screen, relative, bg-[#050505]
// Layout: flex flex-col items-center justify-center, px-6 md:px-12, text-center
// Top accent line: w-16 h-px bg-primary mx-auto mb-8
// Eyebrow: "EST. 2014 — LONDON, UK" — Space Mono 400, 0.75rem, letter-spacing 0.2em, text-primary/80, mb-6
// Main wordmark: GlitchText component
//   "INKWELL STUDIO" in Bebas Neue, clamp(5rem, 15vw, 14rem), text-foreground
//   Each word on its own line (or two lines), massive
// Red divider line: w-24 h-0.5 bg-primary mx-auto my-6
// Subtext: "Fine Line · Traditional · Blackwork · Realism" — Space Mono 400, 0.85rem, letter-spacing 0.15em, text-foreground/50
// CTA buttons: flex gap-4, mt-10
//   Primary: "Book a Consultation" — bg-primary text-white, px-8 py-4, Space Mono 700, 0.8rem, uppercase
//   Secondary: "View Portfolio" — border border-foreground/30 text-foreground/70, px-8 py-4, Space Mono 400, 0.8rem
// Bottom scroll indicator: "SCROLL" + line, absolute bottom-8, centered, Space Mono 400, 0.65rem, letter-spacing 0.3em, text-foreground/30
//   + animated ChevronDown pulsing
// Background: pure black, no image — hero IS the glitch type
```

### 6.3 Portfolio Ticker
```tsx
// Immediately below hero
// No horizontal padding (full bleed)
// Section label: "PORTFOLIO" — Space Mono 700, 0.7rem, letter-spacing 0.3em, uppercase, text-primary, px-6 md:px-12, mb-4
// PortfolioTicker component (see Effect 2)
// Two rows, opposite scroll directions
// py-2 between rows
```

### 6.4 Artists Section
```tsx
// py-24 px-6 md:px-12
// Heading: "MEET THE ARTISTS" — Bebas Neue, 5rem, text-foreground, mb-4
// Red accent line below heading: w-16 h-0.5 bg-primary, mb-16
// Grid: grid-cols-1 md:grid-cols-3, gap-6
// Each artist card (see Effect 4 — red border slide):
//   - Photo: aspect-square, object-cover, object-center, mb-6, grayscale (filter: grayscale(100%)) hover:grayscale(0) transition 0.4s
//   - Name: Bebas Neue, 2.5rem, text-foreground, mb-1
//   - Specialty: Space Mono 400, 0.8rem, text-primary, letter-spacing 0.1em, uppercase, mb-4
//   - Bio: Space Mono 400, 0.85rem, text-muted-foreground, line-height 1.9, mb-6
//   - Style tags: flex gap-2, wrap — each tag: border border-border text-muted-foreground, px-2 py-0.5, Space Mono 400, 0.7rem, uppercase
//   - "View Portfolio →" link: Space Mono 700, 0.8rem, text-primary, hover:underline, mt-auto

// Artist photo descriptions:
// {/* Image: male tattoo artist at work — close-up of tattooing a client, hands and machine in focus, dark studio lighting, artistic atmosphere, dramatic side light on concentrated artist face */}
// {/* Image: female tattoo artist — studio portrait with visible tattoo sleeves, arms crossed, confident expression, studio environment with tattoo flash art on wall behind */}
// {/* Image: tattoo artist examining stencil design on paper/skin, focused, moody dark studio light, artistic close-up, tattooed hands visible */}
```

### 6.5 Styles Section
```tsx
// py-24 px-6 md:px-12, bg-card (very dark, subtle differentiation from pure black)
// Heading: "OUR STYLES" — Bebas Neue, 5rem, text-foreground, mb-16
// Grid: grid-cols-1 sm:grid-cols-2 lg:grid-cols-4, gap-4
// Each style card:
//   - Image: aspect-[3/4], object-cover, grayscale, hover:grayscale-0, transition 0.5s
//   - Below image: bg-[#050505], p-5
//     - Style name: Bebas Neue, 2rem, text-foreground, mb-2
//     - Red accent line: w-8 h-0.5 bg-primary, mb-3
//     - Desc: Space Mono 400, 0.8rem, text-muted-foreground, line-height 1.9
//   - Bottom border: border-b-2 border-primary/0 hover:border-primary/100 transition 0.3s

// Style image descriptions:
// {/* Image: fine line tattoo close-up — intricate botanical or geometric single-needle work, high detail, clean skin, macro photography style */}
// {/* Image: traditional American tattoo — bold classic design, strong black outline, primary colors, historic sailor tattoo aesthetic */}
// {/* Image: blackwork tattoo — solid black ink geometric or tribal large-scale piece, striking contrast, dramatic photograph */}
// {/* Image: realism tattoo — photorealistic portrait or nature scene, incredible shading detail, black and grey, side-lit to show dimension */}
```

### 6.6 Process Section
```tsx
// py-24 px-6 md:px-12
// Heading: "THE PROCESS" — Bebas Neue, 5rem, text-foreground, mb-16
// Horizontal timeline: flex flex-col md:flex-row, gap-0 (connected by lines)
// 4 steps:
//   Each step: flex-1, relative
//     - Connector line between steps: absolute, horizontal, top center of number, bg-primary/30, h-px
//     - Step number: "01"–"04" — Bebas Neue, 4rem, text-primary/20, mb-2
//     - Red dot indicator: w-3 h-3 rounded-full bg-primary, mb-4, mx-auto (on horizontal layout)
//     - Title: Bebas Neue, 2rem, text-foreground, mb-3
//     - Desc: Space Mono 400, 0.85rem, text-muted-foreground, line-height 1.9
```

### 6.7 FAQ Section
```tsx
// py-24 px-6 md:px-12, border-t border-border
// Heading: "FAQ" — Bebas Neue, 5rem, text-foreground, mb-16
// Layout: max-w-3xl, mx-auto
// Accordion: each item — border-b border-border, py-5
//   Question: Space Mono 700, 0.95rem, text-foreground, cursor-pointer
//   Expand icon: + / − in text-primary, transition rotation 0.2s
//   Answer: Space Mono 400, 0.875rem, text-muted-foreground, line-height 1.95, mt-4
//   Active state: question color text-primary
//   Use Framer Motion AnimatePresence for accordion expand
```

### 6.8 Booking CTA Section
```tsx
// py-32 px-6 md:px-12, bg-[#050505], red glow bg effect (see Effect 5)
// Centered, max-w-2xl, mx-auto
// Eyebrow: "READY?" — Space Mono 700, 0.7rem, letter-spacing 0.4em, text-primary, mb-6
// Heading: Bebas Neue, clamp(4rem, 10vw, 8rem), text-foreground, line-height 0.95, mb-8
// Subtext: Space Mono 400, 0.9rem, text-muted-foreground, line-height 1.9, mb-10, max-w-lg, mx-auto
// CTA: large primary button
//   "Book a Consultation" — bg-primary text-white, px-12 py-5, Bebas Neue, 1.5rem, letter-spacing 0.05em
//   hover: bg-primary/90, box-shadow: 0 0 40px rgba(204,34,34,0.4), transition 0.25s
// Secondary: "Or call us: 020 7890 1234" — Space Mono 400, 0.85rem, text-muted-foreground, mt-6
// Aftercare link below: "Download Aftercare Guide →" — Space Mono 400, 0.8rem, text-foreground/40, hover:text-foreground, mt-8
```

### 6.9 Footer
```tsx
// py-16 px-6 md:px-12, bg-[#050505], border-t border-border
// Top: grid grid-cols-2 md:grid-cols-4, gap-10, pb-12, border-b border-border
//   Col 1: INKWELL wordmark (Bebas Neue, 2rem) + tagline + social icons (Instagram, TikTok)
//   Col 2: Studio — Artists, Portfolio, Styles, Process, FAQ
//   Col 3: Visit — address, hours, phone, email
//   Col 4: Policy — Booking Policy, Aftercare Guide, Deposit Info, Age Policy (18+)
// Bottom: flex justify-between, pt-8
//   Copyright: Space Mono 400, 0.75rem, text-foreground/25
//   "18+ ONLY · NO WALK-INS" — Space Mono 700, 0.7rem, text-primary, letter-spacing 0.15em
```

## 7. Animations

### Glitch effect timing
```tsx
// Trigger: every 3000ms
// Active duration: 400ms
// Red layer clip-path: inset(50%→15%) / translate(-4px)
// White layer clip-path: inset(50%→55%) / translate(+5px)
// Both: transition steps(2) for hard/digital feel
// Steps between: 2 (not smooth — jerky = authentic glitch)
```

### Hero entrance
```tsx
// Eyebrow: initial={{ opacity: 0 }}, animate={{ opacity: 1 }}, delay 0.3s
// Wordmark: initial={{ opacity: 0, letterSpacing: '0.5em' }}, animate={{ opacity: 1, letterSpacing: '0.05em' }}
//   delay 0.5s, duration 0.8s
// Red divider: initial={{ scaleX: 0 }}, animate={{ scaleX: 1 }}, delay 0.9s, duration 0.4s
// Subtext: initial={{ opacity: 0 }}, delay 1.1s
// CTAs: initial={{ opacity: 0, y: 20 }}, delay 1.3s
```

### Ticker rows
```tsx
// Row 1: x '0%' → '-50%', duration 30s, repeat Infinity, ease 'linear'
// Row 2: x '-50%' → '0%', duration 30s (opposite), repeat Infinity, ease 'linear'
// Image hover: scale 1→1.05, grayscale on non-hover image bg
```

### Artist card hover
```tsx
// Red left border: scaleY 0→1, originY: 0, duration 0.25s
// Card borderColor transition: 0.25s
// Photo: grayscale(100%)→grayscale(0), duration 0.4s
// whileHover: card y: 0→-2
```

### Style card
```tsx
// Image grayscale: 100%→0%, duration 0.5s ease-out
// Bottom border: border-primary/0→border-primary/100, duration 0.3s
```

### Process timeline entrance
```tsx
// Steps stagger: delay index * 0.15s
// Step number: initial={{ opacity: 0, y: 30 }}, whileInView{{ opacity: 1, y: 0 }}
// Connector lines: initial={{ scaleX: 0 }}, whileInView{{ scaleX: 1 }}, delay after step appears
```

### FAQ accordion
```tsx
// AnimatePresence, height: 0 → auto
// motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
// transition: { duration: 0.3, ease: 'easeInOut' }
// + icon: rotate 0 → 45deg on open
```

### Booking CTA
```tsx
// Button hover: boxShadow 0 0 40px rgba(204,34,34,0.4), transition 0.25s
// Red glow blob: animate={{ scale: [1, 1.05, 1], opacity: [0.15, 0.2, 0.15] }}, 4s infinite
```

### Section headings entrance
```tsx
initial={{ opacity: 0, x: -30 }}
whileInView={{ opacity: 1, x: 0 }}
viewport={{ once: true }}
transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
```

## 8. Responsive

### Mobile (< 768px)
- Navbar: wordmark + hamburger; full-screen black overlay, links in Bebas Neue 3rem
- Hero: wordmark clamp(4rem, 15vw, 8rem), subtext smaller, CTAs stacked full-width
- Ticker: slightly faster (25s), images w-44 h-60
- Artists: single column, stacked
- Styles: 2 columns on mobile (2×2 grid)
- Process: stacked vertically (single column), connector lines become horizontal bars above each step
- FAQ: full-width, accordion same behavior
- Booking CTA: H2 4rem, button full-width
- Footer: 2 columns top, stacked single below sm

### Desktop (>= 1024px)
- Navbar: full horizontal nav, all links visible
- Hero: massive typography centered, max-w unrestricted
- Ticker: full 2-row display
- Artists: 3 columns
- Styles: 4 columns
- Process: horizontal 4-step timeline with connecting lines
- FAQ: max-w-3xl centered
- Booking CTA: max-w-2xl centered
- Footer: 4 columns

## 9. Full Copy

### Brand Name
Inkwell Studio

### Navbar
- Wordmark: INKWELL
- Links: Portfolio · Artists · Styles · Process · FAQ · Book
- CTA: Book Now

### Hero
- Eyebrow: EST. 2014 — LONDON, UK
- H1 (GlitchText): INKWELL STUDIO
- Red divider line: visual element only
- Subtext: Fine Line · Traditional · Blackwork · Realism
- Primary CTA: Book a Consultation
- Secondary CTA: View Portfolio
- Scroll indicator: SCROLL

### Portfolio Ticker
- Section label: PORTFOLIO
- (Ticker runs continuously, no additional copy)

### Artists Section
- Heading: MEET THE ARTISTS
- **Artist 1 — Marcus Kane**
  - Specialty: Fine Line & Realism
  - Style tags: Fine Line · Realism · Portraits
  - Bio: Marcus brings a photographer's eye to every piece. His fine line work is architectural, precise, and built to last. His realism portraits are among the most technically accomplished in the city.
  - Link: View Portfolio →
- **Artist 2 — Jade Rivers**
  - Specialty: Traditional & Neo-Traditional
  - Style tags: Traditional · Neo-Traditional · Color
  - Bio: Jade studied classic American traditional tattooing before developing her own bold neo-traditional voice. Her colour work is saturated, deliberate, and unmistakably hers.
  - Link: View Portfolio →
- **Artist 3 — Sol Mercer**
  - Specialty: Blackwork & Geometric
  - Style tags: Blackwork · Geometric · Ornamental
  - Bio: Sol creates tattoos that feel like architecture on skin. Precision blackwork, sacred geometry, and ornamental patterns that cover and connect in ways that feel inevitable.
  - Link: View Portfolio →

### Styles Section
- Heading: OUR STYLES
- **Style 1 — Fine Line**
  - Desc: Delicate, single-needle precision work. Botanicals, portraits, script, and minimalist geometric — built for clients who want something subtle but lasting.
- **Style 2 — Traditional**
  - Desc: Bold outlines, solid fills, timeless subjects. American traditional tattooing done the way it was meant to — confident lines, strong colour, built to age beautifully.
- **Style 3 — Blackwork**
  - Desc: Statement pieces in solid black ink. Large-scale geometric, tribal-inspired, and architectural designs that command attention and hold their power over time.
- **Style 4 — Realism**
  - Desc: Photorealistic portraits, nature, and objects rendered in black & grey or full colour. The most technically demanding style we offer — and the most breathtaking when done right.

### Process Section
- Heading: THE PROCESS
- **Step 01 — Consultation**
  - Title: Consultation
  - Desc: Every piece starts here. We talk through your idea, placement, size, and references. No design work begins until we both feel aligned on the vision.
- **Step 02 — Design**
  - Title: Design
  - Desc: Your artist creates a custom design based on the consultation. You'll receive a preview for review and revision before your session is booked.
- **Step 03 — Session**
  - Title: Session
  - Desc: Come prepared, fed, and rested. Your artist will walk you through the stencil placement before any ink touches skin. We don't rush.
- **Step 04 — Aftercare**
  - Title: Aftercare
  - Desc: We provide a full written aftercare guide and remain available for questions during your healing period. A well-healed tattoo is a good tattoo.

### FAQ Section
- Heading: FAQ
- **Q1:** Do I need to book in advance?
  - A: Yes. All sessions at Inkwell are by appointment only. We do not accept walk-ins. Most of our artists are booked 4–8 weeks in advance, so we recommend reaching out early.
- **Q2:** How much does a tattoo cost?
  - A: Pricing varies significantly by size, placement, complexity, and artist. Our minimum is £150. Larger custom pieces are quoted after consultation. We're happy to give you an estimate once we understand your project.
- **Q3:** Do you require a deposit?
  - A: Yes. A non-refundable deposit is required to secure your booking. This goes toward the total cost of your tattoo. Deposits are lost if you cancel within 48 hours of your appointment.
- **Q4:** What should I do to prepare for my session?
  - A: Eat a good meal beforehand, stay hydrated, avoid alcohol the night before, and wear or bring clothing that gives easy access to the tattoo area. No sunburn or skin irritation on the area.
- **Q5:** Will it hurt?
  - A: Yes, to varying degrees depending on placement. Most people describe it as a scratching or burning sensation. Our artists work at a pace that keeps the session manageable. If you need a break, just ask.
- **Q6:** Can I bring someone with me?
  - A: One support person is welcome. We ask that they remain seated and quiet during the session to help maintain focus and hygiene.

### Booking CTA Section
- Eyebrow: READY?
- H2: Book Your Next Piece.
- Subtext: Every piece starts with a conversation. Tell us your idea, your placement, your timeline. We'll match you with the right artist and get you booked in.
- CTA: Book a Consultation
- Phone: Or call us: 020 7890 1234
- Aftercare link: Download Aftercare Guide →

### Footer
- Wordmark: INKWELL
- Tagline: Art Etched for Life
- Col 2 — Studio: Artists · Portfolio · Styles · Process · FAQ
- Col 3 — Visit: 19 Brick Lane, Shoreditch, London E1 6PU · Tue–Sat 11am–7pm, Sun 12pm–5pm · 020 7890 1234 · ink@inkwellstudio.co.uk
- Col 4 — Policy: Booking Policy · Aftercare Guide · Deposit Info · Age Policy (18+) · Touch-Up Policy
- Copyright: © 2025 Inkwell Studio. All rights reserved.
- Policy badge: 18+ ONLY · NO WALK-INS

## 10. Key Dependencies
```json
{
  "motion": "^12.0.0",
  "lucide-react": "^0.462.0",
  "@radix-ui/react-accordion": "^1.2.0",
  "@radix-ui/react-dialog": "^1.1.0",
  "clsx": "^2.1.0",
  "tailwind-merge": "^2.3.0"
}
```
