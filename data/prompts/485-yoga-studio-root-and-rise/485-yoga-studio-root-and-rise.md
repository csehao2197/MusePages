# Root & Rise — Yoga & Mindfulness Studio Website Prompt

## 1. Goal Statement
Build a grounding, community-centered website for Root & Rise, a yoga and mindfulness studio brand with warm earth-tone aesthetics, organic shapes, and breathing visual animations that make visitors feel calm and welcome.

## 2. Tech Stack
```
React + Vite + TypeScript + Tailwind CSS + Framer Motion (motion/react) + shadcn/ui + lucide-react
```

## 3. Design System — Colors
```css
:root {
  --background: 33 67% 92%;         /* warm sand #f5ede0 */
  --foreground: 20 20% 15%;         /* deep warm dark #2a2218 */
  --primary: 118 12% 54%;           /* sage green #7d9b76 */
  --primary-foreground: 0 0% 100%;
  --secondary: 22 47% 54%;          /* terracotta #c97b4c */
  --secondary-foreground: 0 0% 100%;
  --muted-foreground: 25 15% 45%;   /* warm mid-tone brown */
  --border: 33 35% 82%;             /* warm sand border */
  --card: 36 50% 96%;               /* near-white warm */
  --accent: 118 12% 54%;            /* sage */
}
```

## 4. Typography
```html
<link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet" />
```
- **Display headings (H1, H2):** DM Serif Display, regular, letter-spacing -0.01em, line-height 1.1
- **Italic accent / pull quotes:** DM Serif Display Italic
- **Body / navigation / buttons / labels:** DM Sans, 300–500, letter-spacing 0.02em
- **Section eyebrows:** DM Sans 500, 0.7rem, letter-spacing 0.2em, uppercase, color: var(--primary)
- **Body copy:** DM Sans 300–400, 1rem, line-height 1.85, color: var(--muted-foreground)
- **Prices/numbers:** DM Serif Display, 2.5–3rem, color: var(--foreground)

## 5. Visual Effects

### Effect 1 — Hero Breathing Circle Animation + Background Photo
```tsx
// BreathingCircle.tsx
import { motion } from 'motion/react'

export function BreathingCircle() {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
      {/* Outermost ring */}
      <motion.div
        className="absolute rounded-full border opacity-15"
        style={{ width: 700, height: 700, borderColor: 'var(--primary)' }}
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* Middle ring */}
      <motion.div
        className="absolute rounded-full border opacity-20"
        style={{ width: 500, height: 500, borderColor: 'var(--primary)' }}
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
      />
      {/* Inner ring */}
      <motion.div
        className="absolute rounded-full opacity-10"
        style={{ width: 300, height: 300, background: 'var(--primary)' }}
        animate={{ scale: [1, 1.12, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
      />
    </div>
  )
}

// Hero section structure:
<section className="relative w-full min-h-screen overflow-hidden flex items-center" style={{ background: 'var(--background)' }}>
  {/* Background yoga photo behind circles */}
  <div className="absolute right-0 top-0 w-full lg:w-1/2 h-full">
    {/* Image: woman in warrior pose at sunrise, warm morning golden light filtering through studio windows, soft bokeh background, calm and powerful, terracotta and sage tones in clothing, barefoot on wooden floor */}
    <img src="" alt="Yoga practice — warrior pose in morning light" className="w-full h-full object-cover object-center" />
    {/* Gradient fade to left */}
    <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, var(--background) 0%, rgba(245,237,224,0.85) 40%, transparent 100%)' }} />
  </div>
  {/* Breathing circles behind content */}
  <BreathingCircle />
  {/* Content left side */}
  <div className="relative z-10 px-8 md:px-16 lg:px-24 max-w-2xl">
    ...hero text content...
  </div>
</section>
```

### Effect 2 — Organic SVG Blob Dividers Between Sections
```tsx
// BlobDivider.tsx
// Sand-to-white organic wave transition between sections
export function BlobDivider({ from = '#f5ede0', to = '#ffffff' }: { from?: string; to?: string }) {
  return (
    <div className="relative w-full overflow-hidden leading-none" style={{ marginTop: '-2px' }}>
      <svg viewBox="0 0 1440 120" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-[80px] md:h-[120px]">
        <path
          d="M0,40 C180,100 360,0 540,60 C720,120 900,20 1080,70 C1260,120 1380,30 1440,60 L1440,120 L0,120 Z"
          fill={to}
        />
        <rect width="1440" height="40" fill={from} />
      </svg>
    </div>
  )
}
```

### Effect 3 — Staggered Class Card Entrance on Scroll
```tsx
import { motion } from 'motion/react'

{classTypes.map((cls, index) => (
  <motion.div
    key={cls.id}
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-50px' }}
    transition={{
      duration: 0.65,
      delay: index * 0.1,
      ease: [0.22, 1, 0.36, 1]
    }}
    className="group relative rounded-2xl border-2 p-8 cursor-pointer transition-colors duration-300"
    style={{ borderColor: 'var(--border)', background: 'var(--card)' }}
    whileHover={{ borderColor: 'var(--primary)' }}
  >
```

### Effect 4 — Sage Green Gradient CTA Section
```tsx
// Full-width community join section with sage-to-sand gradient
<section
  className="py-24 px-8 md:px-16 text-white relative overflow-hidden"
  style={{
    background: 'linear-gradient(135deg, #5d7a57 0%, #7d9b76 50%, #9ab594 100%)',
  }}
>
  {/* Organic blob shape bg decoration */}
  <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-20" style={{ background: 'rgba(255,255,255,0.3)' }} />
  <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full opacity-15" style={{ background: 'rgba(255,255,255,0.3)' }} />
```

### Effect 5 — Fixed Texture Overlay (Linen/Paper Feel)
```tsx
// GrainOverlay.tsx
export function GrainOverlay() {
  return (
    <div
      className="fixed inset-0 z-50 pointer-events-none select-none"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        mixBlendMode: 'overlay',
        opacity: 0.04,
      }}
    />
  )
}
```

## 6. Component Breakdown

### 6.1 Navbar
```tsx
// Fixed, top-0, z-40, w-full
// Height: h-18 (72px)
// Background: transparent → var(--background)/95 backdrop-blur-sm after 80px scroll
// Layout: px-8 md:px-16, flex items-center justify-between
// Left: logo — leaf icon (lucide) + "ROOT & RISE" — DM Sans 500, letter-spacing 0.15em, uppercase, 0.9rem
// Center (desktop): nav links ["Classes", "Schedule", "Instructors", "Pricing", "Community"]
//   DM Sans 400, 0.85rem, gap-8, color var(--foreground)/70, hover var(--primary)
//   transition 0.2s
// Right: "Try a Class Free" — sage green bg, white text, px-5 py-2.5, rounded-full, DM Sans 500, 0.8rem
// Mobile: hamburger, full-screen overlay menu, sage bg, white links
```

### 6.2 Hero Section
```tsx
// min-h-screen, relative, sand bg
// Left content column (lg:w-1/2): z-10
//   - Eyebrow: "Yoga & Mindfulness Studio" — DM Sans 500, 0.7rem, tracking-widest, uppercase, text-primary, mb-5
//   - H1: DM Serif Display, clamp(3rem, 6vw, 5rem), 3–4 lines, line-height 1.05, mb-6
//   - Subtext: DM Sans 300, 1.1rem, text-muted-foreground, line-height 1.8, mb-8, max-w-md
//   - CTA buttons: flex flex-col sm:flex-row gap-4
//     Primary: "Try a Class Free" — bg-primary text-white, px-8 py-4, rounded-full, DM Sans 500
//     Secondary: "View Schedule" — border-2 border-primary text-primary, px-8 py-4, rounded-full, DM Sans 500
//   - Breathing cue: small text + pulsing dot: "Inhale. Exhale. Begin." — DM Sans 300 italic, text-muted-foreground, mt-8
// Right side: yoga photo + breathing circles
// Blob divider below hero into next section
```

### 6.3 Class Types Section
```tsx
// py-24 px-8 md:px-16, bg-white (after blob divider from sand hero)
// Header: centered
//   - Eyebrow: "WHAT WE OFFER"
//   - H2: DM Serif Display, 3rem, mb-4
//   - Subtext: DM Sans 300, 1rem, text-muted-foreground, max-w-lg, mx-auto, mb-16
// Grid: grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 (or flex wrap)
// Actually: grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5, gap-5
// Each class card:
//   - Rounded-2xl, border-2 border-border, p-8, bg-card, hover:border-primary
//   - Icon (lucide): 32px, color var(--primary), mb-4
//   - Name: DM Serif Display, 1.3rem, mb-2
//   - Level: "All Levels" badge — DM Sans 400, 0.7rem, bg-primary/10, text-primary, px-2 py-0.5, rounded-full, mb-3
//   - Desc: DM Sans 300, 0.9rem, text-muted-foreground, line-height 1.7
//   - Duration: DM Sans 500, 0.85rem, text-foreground, mt-4
// Stagger: delay index * 0.1s
// Blob divider below → terracotta/sand
```

### 6.4 Schedule Section
```tsx
// py-24 px-8 md:px-16, bg-[var(--background)]
// Centered header:
//   - Eyebrow: "WEEKLY SCHEDULE"
//   - H2: DM Serif Display, 3rem, mb-12
// 7-day table: bg-white, rounded-2xl, shadow-sm, overflow-hidden
// Table header row: bg-primary/10, 7 columns (Mon–Sun), DM Sans 500, 0.75rem, uppercase, text-center, py-3
// Data rows: alternating bg-white / bg-card
// Each cell: text-center, py-4, px-3
//   - Class name: DM Serif Display, 1rem
//   - Time: DM Sans 400, 0.8rem, text-muted-foreground
//   - Instructor initial: DM Sans 300, 0.75rem, text-primary
//   Empty cells: "—" in text-border
// CTA below table: "View Full Schedule →" sage link, centered
```

### 6.5 Instructors Section
```tsx
// py-24 px-8 md:px-16, bg-white
// Header: centered, "Our Teachers" — DM Serif Display, 3rem, mb-4
// Subtext: DM Sans 300, centered, mb-16
// Grid: grid-cols-1 md:grid-cols-3, gap-10
// Each instructor:
//   - Photo: circular (w-48 h-48 mx-auto mb-6), object-cover, object-top, border-4 border-[var(--primary)]/20
//   - Name: DM Serif Display, 1.5rem, text-center, mb-1
//   - Specialty: DM Sans 400, 0.85rem, text-primary, text-center, mb-4
//   - Bio: DM Sans 300, 0.9rem, text-center, text-muted-foreground, line-height 1.7, max-w-[260px] mx-auto
//   - Certifications: small pills — DM Sans 400, 0.7rem, bg-primary/10, text-primary, px-2 py-0.5, rounded-full

// Instructor photos:
// {/* Image: female yoga instructor in meditation pose, seated cross-legged, warm studio, peaceful expression, earth-toned clothing */}
// {/* Image: female instructor in tree pose, confident and grounded, natural light studio, sage green accents */}
// {/* Image: male instructor in downward dog or forward fold, casual smile, wood floor yoga studio */}
```

### 6.6 Philosophy Section
```tsx
// py-24 px-8 md:px-16
// Background: sage green (#7d9b76), text white
// Centered layout, max-w-4xl, mx-auto
// Eyebrow: "OUR PHILOSOPHY" — DM Sans 500, 0.7rem, letter-spacing 0.3em, text-white/60
// H2: DM Serif Display Italic, 3rem, text-white, mb-16
// 3 core values: grid-cols-1 md:grid-cols-3, gap-12
// Each value:
//   - Icon: 32px, white, mb-4
//   - Title: DM Serif Display, 1.5rem, text-white, mb-3
//   - Desc: DM Sans 300, 0.95rem, text-white/75, line-height 1.8
// Blob dividers: white-to-sage above, sage-to-sand below
```

### 6.7 Pricing Section
```tsx
// py-24 px-8 md:px-16, bg-[var(--background)]
// Centered header
// Grid: grid-cols-1 md:grid-cols-3, gap-8
// Each card: bg-card, rounded-2xl, border-2 border-border, p-10, text-center
//   Middle card: border-primary, slight scale 1.02, tag "Most Popular" — terracotta bg, white text, rounded-full, above card
//   - Tier name: DM Sans 500, 0.75rem, letter-spacing 0.2em, uppercase, text-primary, mb-2
//   - Price: DM Serif Display, 3.5rem, text-foreground, mb-1
//   - Per: DM Sans 300, 0.9rem, text-muted-foreground, mb-8
//   - Features list: DM Sans 300, 0.9rem, text-foreground, line-height 2.2, check icon (primary) + text
//   - CTA: full-width button, primary bg for middle, outlined for others, rounded-full, mt-8
```

### 6.8 Testimonials Section
```tsx
// py-24 px-8 md:px-16, bg-[var(--background)]
// Centered header: DM Serif Display Italic, 3rem
// Grid: grid-cols-1 md:grid-cols-3, gap-8
// Each card: bg-white, rounded-2xl, p-8, no border
//   - Large quote mark: DM Serif Display, 5rem, text-primary/20, leading-none, mb-2
//   - Quote: DM Serif Display Italic, 1.05rem, line-height 1.8, text-foreground/80, mb-6
//   - Author: flex items-center gap-3
//     - Avatar: circular, w-10 h-10
//     - Name: DM Sans 500, 0.9rem + desc: DM Sans 300, 0.8rem, text-muted-foreground
```

### 6.9 Community / Newsletter Section
```tsx
// py-24 px-8 md:px-16, terracotta (#c97b4c) background, text white
// Centered, max-w-xl
// Eyebrow: "JOIN OUR COMMUNITY"
// H2: DM Serif Display, 2.5rem, text-white, mb-4
// Body: DM Sans 300, 1rem, text-white/75, mb-8
// Email form: flex gap-3, max-w-md, mx-auto
//   Input: bg-white/15 backdrop-blur-sm, border border-white/30, text-white, placeholder-white/50, rounded-full, px-6 py-4, flex-1
//   Button: bg-white, text-[#c97b4c], px-6 py-4, rounded-full, DM Sans 500, 0.875rem
// Privacy note: DM Sans 300, 0.75rem, text-white/50, mt-4
// Decorative blob circles: absolute top/bottom corners, white/10 opacity
```

### 6.10 Footer
```tsx
// py-16 px-8 md:px-16, bg-[var(--foreground)], text-white
// Top: grid grid-cols-2 md:grid-cols-4, gap-10, pb-12, border-b border-white/10
//   Col 1: Logo + tagline + social icons (Instagram, YouTube)
//   Col 2: Classes — Vinyasa, Yin, Meditation, Prenatal, Beginners
//   Col 3: Studio — About, Instructors, Schedule, Pricing, Blog
//   Col 4: Visit — address + hours + phone
// Bottom: flex justify-between, pt-8
//   Copyright: DM Sans 300, 0.75rem, text-white/30
//   Links: Privacy Policy · Terms
```

## 7. Animations

### Breathing circles
```tsx
// Outermost: scale 1→1.08→1, 4s ease-in-out infinite
// Middle: scale 1→1.1→1, 4s ease-in-out infinite, delay 0.2s
// Inner: scale 1→1.12→1, 4s ease-in-out infinite, delay 0.4s
```

### Hero text entrance
```tsx
// Eyebrow: initial={{ opacity: 0, y: 10 }}, delay 0.2s
// H1: initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}, delay 0.4s, duration 0.9s
// Subtext: initial={{ opacity: 0, y: 20 }}, delay 0.6s
// CTAs: initial={{ opacity: 0, y: 20 }}, delay 0.8s
// Breathing cue: initial={{ opacity: 0 }}, delay 1.1s, duration 1s
```

### Blob dividers
```tsx
// No animation — static SVG path fills for organic section breaks
// Consistent wave style for brand cohesion
```

### Class cards
```tsx
// Stagger: index * 0.1s delay
// whileInView: opacity 0→1, y 40→0
// whileHover: borderColor transition to --primary, y -4
// transition duration 0.65s ease [0.22, 1, 0.36, 1]
```

### Philosophy value icons
```tsx
initial={{ opacity: 0, scale: 0.8 }}
whileInView={{ opacity: 1, scale: 1 }}
viewport={{ once: true }}
transition={{ duration: 0.5, delay: index * 0.15 }}
```

### Pricing card hover
```tsx
whileHover={{ y: -6 }}
transition={{ duration: 0.3, ease: 'easeOut' }}
// Middle card: always slightly elevated (y: -4 default)
```

### Testimonial entrance
```tsx
initial={{ opacity: 0, y: 20 }}
whileInView={{ opacity: 1, y: 0 }}
viewport={{ once: true }}
transition={{ duration: 0.6, delay: index * 0.15 }}
```

## 8. Responsive

### Mobile (< 768px)
- Navbar: logo + hamburger only, full-screen sage overlay nav
- Hero: single column, text above, photo below (or semi-transparent overlay), breathing circles smaller (300px outer)
- H1: clamp(2.5rem, 8vw, 3.5rem)
- CTAs: full-width, stacked vertically
- Class types: 2 columns (or 1 column on very small)
- Schedule: horizontal scroll on mobile (overflow-x-auto, table scrollable)
- Instructors: 1 column stacked
- Philosophy values: 1 column stacked
- Pricing: 1 column, stacked cards
- Newsletter: input + button stacked vertically
- Footer: 2 column grid on mobile, single below sm

### Desktop (>= 1024px)
- Navbar: full horizontal links + CTA button
- Hero: 2 column split (text left, photo right with circles behind)
- Class types: 5 columns (or wrap)
- Schedule: full 7-column table
- Instructors: 3 columns
- Philosophy: 3 columns on sage bg
- Pricing: 3 columns, middle elevated
- Footer: 4 columns

## 9. Full Copy

### Brand Name
Root & Rise

### Navbar
- Logo text: ROOT & RISE
- Links: Classes · Schedule · Instructors · Pricing · Community
- CTA: Try a Class Free

### Hero
- Eyebrow: Yoga & Mindfulness Studio
- H1: Move. Breathe. Transform.
- Subtext: A community built on breath, intention, and showing up — for beginners just starting out and practitioners who've been on the mat for years.
- Primary CTA: Your First Class Is On Us
- Secondary CTA: View This Week's Schedule
- Breathing cue: Inhale. Exhale. Begin.

### Class Types Section
- Eyebrow: WHAT WE OFFER
- H2: Find Your Practice
- Subtext: From energising morning flows to restorative evening sessions — we have a class for where you are right now.
- **Class 1 — Vinyasa**
  - Icon: Flame (lucide)
  - Level: All Levels
  - Desc: Dynamic, breath-linked sequences that build strength, flexibility, and focus. A full-body practice that moves at your pace.
  - Duration: 60 min
- **Class 2 — Yin**
  - Icon: Moon (lucide)
  - Level: All Levels
  - Desc: Long-held, passive postures that target the deeper connective tissues. Perfect for unwinding, recovery, and deep release.
  - Duration: 75 min
- **Class 3 — Meditation**
  - Icon: Circle (lucide)
  - Level: Beginners Welcome
  - Desc: Guided seated practice focused on breath awareness, mindfulness, and building a sustainable inner stillness.
  - Duration: 45 min
- **Class 4 — Prenatal**
  - Icon: Heart (lucide)
  - Level: All Trimesters
  - Desc: Gentle, nurturing practice adapted for pregnancy. Focuses on hip-opening, breathing, and community support.
  - Duration: 60 min
- **Class 5 — Beginners**
  - Icon: Sprout (lucide)
  - Level: No Experience Needed
  - Desc: A welcoming, non-intimidating introduction to yoga fundamentals. The perfect starting point, no matter where you're beginning.
  - Duration: 60 min

### Schedule Section
- Eyebrow: WEEKLY SCHEDULE
- H2: This Week at Root & Rise
- Schedule grid:
  - Mon: 7am Vinyasa (Sara) · 12pm Meditation (Leo) · 6pm Yin (Mia)
  - Tue: 7am Beginners (Mia) · 5:30pm Vinyasa (Sara) · 7:30pm Meditation (Leo)
  - Wed: 9am Prenatal (Sara) · 12pm Yin (Leo) · 6pm Vinyasa (Mia)
  - Thu: 7am Vinyasa (Mia) · 5:30pm Beginners (Leo) · 7pm Yin (Sara)
  - Fri: 7am Vinyasa (Sara) · 12pm Meditation (Mia) · 6pm Yin (Leo)
  - Sat: 8am Vinyasa (All) · 10am Beginners (Sara) · 2pm Workshop TBC
  - Sun: 9am Yin & Meditation (Leo) · 11am Vinyasa (Mia)
- CTA: View Full Schedule & Book →

### Instructors Section
- Heading: Our Teachers
- Subtext: Every instructor at Root & Rise is committed to creating a practice that meets you where you are.
- **Instructor 1 — Sara Okonkwo, RYT 500**
  - Specialty: Vinyasa & Prenatal
  - Certifications: RYT 500 · Prenatal Certified · Mindfulness Coach
  - Bio: Sara found yoga during a difficult season of her life and has spent the last ten years sharing its transformative power with others. Her classes are warm, energising, and genuinely inclusive.
- **Instructor 2 — Leo Park, E-RYT 200**
  - Specialty: Yin & Meditation
  - Certifications: E-RYT 200 · Yin Certified · Sound Healing
  - Bio: Leo's background in psychology informs every class he teaches. His sessions are quiet, intentional, and give students real tools for managing stress and cultivating presence.
- **Instructor 3 — Mia Torres, RYT 200**
  - Specialty: Beginners & Vinyasa
  - Certifications: RYT 200 · Trauma-Informed · Kids Yoga
  - Bio: Mia teaches with playfulness and precision. She believes that yoga belongs to everyone, and she specialises in making the practice feel approachable and genuinely joyful.

### Philosophy Section
- Eyebrow: OUR PHILOSOPHY
- H2: "A practice is not a performance."
- **Value 1 — Root**
  - Icon: Anchor
  - Title: Root
  - Desc: Every practice starts by arriving — in your body, in the room, in the present moment. Groundedness is not a goal; it is the beginning.
- **Value 2 — Breathe**
  - Icon: Wind
  - Title: Breathe
  - Desc: The breath is your greatest teacher. Every class at Root & Rise returns to this — slowing down, tuning in, and trusting the exhale.
- **Value 3 — Rise**
  - Icon: TrendingUp
  - Title: Rise
  - Desc: Growth here isn't measured in flexibility. It's measured in showing up, again, with patience and intention. That's the practice.

### Pricing Section
- Eyebrow: PRICING
- H2: Simple, Honest Pricing
- Subtext: No contracts. No complications. Just show up.
- **Tier 1 — Drop-In**
  - Price: £18
  - Per: per class
  - Features: Access to any single class · Book up to 7 days in advance · Cancel up to 2 hours before
  - CTA: Book a Class
- **Tier 2 — Monthly Unlimited** (Most Popular)
  - Price: £75
  - Per: per month
  - Features: Unlimited classes all month · Priority booking (14 days early) · Access to workshops at 20% off · New member welcome gift · Community app access
  - CTA: Start Monthly
- **Tier 3 — Annual**
  - Price: £650
  - Per: per year (save £250)
  - Features: Unlimited classes all year · Priority booking (21 days early) · All workshops included free · Dedicated member support · Annual retreat discount (15%)
  - CTA: Go Annual

### Testimonials Section
- Heading: What the Community Says
- **Quote 1**
  - Text: "I started coming to Root & Rise with zero yoga experience and a lot of scepticism. Six months later I'm here four times a week and it genuinely changed how I handle stress. Sara's classes are extraordinary."
  - Author: Rachel B. · Member for 6 months
- **Quote 2**
  - Text: "Leo's Yin classes are the most restorative hour of my week. I come in wound up and leave feeling genuinely lighter. I don't know how else to describe it — it just works."
  - Author: David K. · Member for 1 year
- **Quote 3**
  - Text: "I joined the prenatal classes at 14 weeks and they were the highlight of my pregnancy. The community here is warm, non-competitive, and exactly what you need when you're growing a human."
  - Author: Amara T. · New mum

### Community/Newsletter Section
- Eyebrow: JOIN OUR COMMUNITY
- H2: Stay Rooted.
- Body: Get weekly class updates, mindfulness tips, and early access to workshops and special events. We send one email a week. That's it.
- Input placeholder: Your email address
- Button: Join the Community
- Privacy note: No spam, ever. Unsubscribe anytime.

### Footer
- Tagline: Move. Breathe. Transform.
- Classes: Vinyasa · Yin · Meditation · Prenatal · Beginners
- Studio: About · Instructors · Schedule · Pricing · Blog · Gift Cards
- Visit: 22 Fernwood Lane, Bristol BS1 · Mon–Fri 6:30am–8:30pm · Sat–Sun 7:30am–5pm · 0117 923 4567
- Copyright: © 2025 Root & Rise. All rights reserved.

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
