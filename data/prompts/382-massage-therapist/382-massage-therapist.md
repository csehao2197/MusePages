# SOLACE — Massage Therapy Studio Website Prompt

**Tech Stack:** React + Vite + TypeScript + Tailwind CSS + Framer Motion (`motion/react`) + shadcn/ui + lucide-react
**Niche:** Massage Therapist Studio

---

## Design System

### Colors (HSL in :root CSS custom properties)

```css
:root {
  --background: 38 50% 96%;      /* warm cream #FAF6EF */
  --foreground: 20 8% 12%;       /* deep stone #2C1A10 */
  --primary: 24 52% 61%;         /* amber #C8956C */
  --primary-foreground: 38 50% 96%;
  --secondary: 130 14% 60%;      /* sage #8FA68C */
  --muted: 38 30% 92%;
  --muted-foreground: 20 8% 40%;
  --border: 38 20% 85%;
  --card: 38 50% 98%;
  --card-foreground: 20 8% 12%;
  --radius: 1rem;
}
```

### Typography

```css
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400;1,700&family=Jost:wght@300;400&display=swap');

/* Headings: Cormorant Garamond (400, 600, 700 italic) */
/* Body: Jost (300, 400) */
```

Apply globally:
```css
body {
  font-family: 'Jost', sans-serif;
  font-weight: 300;
  background-color: hsl(var(--background));
  color: hsl(var(--foreground));
}
h1, h2, h3, h4 {
  font-family: 'Cormorant Garamond', serif;
}
```

---

## Signature Animation: Steam Particles

Implement 12 floating steam particles in the hero section. These are tiny cream/white dots (~4px) that drift upward slowly and fade out in an infinite loop. Use Framer Motion.

```tsx
// SteamParticles component
// Create an array of 12 particles with randomised properties

const particles = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  x: Math.random() * 90 + 5,       // random % position across container width (5–95%)
  delay: Math.random() * 4,          // random delay 0–4s
  duration: Math.random() * 4 + 4,   // random duration 4–8s
  size: Math.random() * 2 + 3,       // random size 3–5px
}));

// Each particle rendered as:
<motion.div
  key={particle.id}
  className="absolute rounded-full"
  style={{
    left: `${particle.x}%`,
    bottom: '20%',
    width: particle.size,
    height: particle.size,
    backgroundColor: 'hsl(38 50% 96% / 0.8)',
  }}
  animate={{
    y: [0, -160],
    opacity: [0, 0.7, 0],
  }}
  transition={{
    duration: particle.duration,
    delay: particle.delay,
    repeat: Infinity,
    ease: 'easeOut',
  }}
/>

// Wrapper: absolute inset-0 z-10 pointer-events-none overflow-hidden
```

---

## Section 1: Navbar

```tsx
// Fixed top navbar
// z-50, backdrop-blur-sm, bg-[hsl(var(--background)/0.9)]
// Transitions: add shadow-sm when scrollY > 20 (use useEffect + scroll listener)

// Logo: "SOLACE" — font-family Cormorant Garamond, font-weight 700, font-style italic
// Style: text-2xl tracking-wider text-[hsl(var(--foreground))]
// No icon — typography-only logo

// Desktop nav links (hidden on mobile, shown lg:flex):
// "Treatments" | "About" | "Pricing" | "Book Now"
// Style: font-family Jost, font-weight 300, text-sm, text-[hsl(var(--foreground)/0.7)]
// Hover: text-[hsl(var(--foreground))] transition-colors

// "Book Now" CTA button:
// bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] px-5 py-2 rounded-lg
// hover:opacity-90 transition-opacity font-family Jost font-weight 400 text-sm

// Mobile: hamburger icon (Menu from lucide-react), onClick toggles mobile menu
// Mobile menu: fixed top-[64px] left-0 right-0 bg-[hsl(var(--background))] shadow-lg
// slides down with Framer Motion: initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
// Contains all nav links stacked vertically, py-4 px-6, border-b border-[hsl(var(--border))]
// Each link: py-3 border-b border-[hsl(var(--muted))] font-family Jost font-weight 300 text-base

// Navbar height: 64px (h-16)
// Max container width: max-w-7xl mx-auto px-4 sm:px-6 lg:px-8
// Flex layout: justify-between items-center
```

---

## Section 2: Hero

```tsx
// Full viewport height: h-[100dvh]
// Position: relative overflow-hidden
// Background: soft radial gradient
// background: radial-gradient(ellipse at center, hsl(var(--muted)) 0%, hsl(var(--background)) 70%)

// Layer 1 (z-10): SteamParticles component — absolute inset-0 pointer-events-none

// Layer 2 (z-20): Main content
// absolute inset-0 flex flex-col items-center justify-center
// text-center px-6

// Content max-w: max-w-2xl mx-auto

// Pre-headline:
// Text: "Private Massage Therapy Studio"
// Style: font-family Jost, font-weight 300, text-sm, tracking-[0.2em], uppercase
// Color: text-[hsl(var(--secondary))]
// Margin: mb-6

// Main headline:
// Text: "Restore. Release. Return."
// Style: font-family Cormorant Garamond, font-weight 700, font-style italic
// Size: text-[72px] leading-none (desktop) → text-[48px] (mobile: text-5xl)
// Color: text-[hsl(var(--foreground))]
// Margin: mb-6

// Subtext:
// Text: "Experience the art of therapeutic touch in a private, sanctuary-style studio in the heart of London. Every session is tailored to you."
// Style: font-family Jost, font-weight 300, text-lg, leading-relaxed
// Color: text-[hsl(var(--foreground)/0.7)]
// Max width: max-w-xl mx-auto
// Margin: mb-10

// CTA Buttons (flex gap-4 flex-wrap justify-center):
// Primary: "Book a Session"
//   bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] px-8 py-3 rounded-lg
//   hover:opacity-90 transition-opacity font-family Jost font-weight 400
// Ghost: "View Treatments"
//   border border-[hsl(var(--foreground))] text-[hsl(var(--foreground))] px-8 py-3 rounded-lg
//   hover:bg-[hsl(var(--foreground)/0.05)] transition-colors font-family Jost font-weight 300

// Divider + stats row:
// mt-12 pt-6 border-t border-[hsl(var(--border))/0.5] max-w-lg mx-auto
// "60 min from £65 · Hot Stone from £95 · Couples from £170"
// Style: font-family Jost, font-weight 300, text-sm, text-[hsl(var(--foreground)/0.5)]
// tracking-wide

// Decorative image (bottom-right corner):
// Position: absolute right-0 bottom-0 w-72 h-72 lg:w-96 lg:h-96
// Overflow: overflow-hidden opacity-60 pointer-events-none
// Gradient overlay: gradient from transparent to hsl(var(--background)) on left and top edges
{/* Image: spa treatment room with warm lighting, folded white towels and a lit candle on marble surface, soft amber glow, editorial wellness photography */}
<img src="" alt="Massage therapy studio ambiance" className="w-full h-full object-cover object-center" />

// Entrance animations (Framer Motion):
// Headline:
//   initial={{ opacity: 0, filter: 'blur(12px)', y: 20 }}
//   animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
//   transition={{ duration: 0.9, ease: 'easeOut', delay: 0 }}
// Subtext:
//   transition: delay 0.3s, duration 0.7s
// CTAs:
//   transition: delay 0.5s, duration 0.7s
// Stats row:
//   transition: delay 0.7s, duration 0.7s
```

---

## Section 3: Treatments

```tsx
// Background: bg-[hsl(var(--muted))]
// Padding: py-24
// Container: max-w-7xl mx-auto px-4 sm:px-6 lg:px-8

// Section label:
// Text: "WHAT WE OFFER"
// Style: tracking-[0.3em] uppercase font-family Jost font-weight 300 text-xs
// Color: text-[hsl(var(--secondary))]
// Margin: mb-4

// Heading:
// Text: "Tailored treatments for every body."
// Style: font-family Cormorant Garamond font-weight 700 font-style italic
// Size: text-5xl (desktop) → text-4xl (mobile)
// Color: text-[hsl(var(--foreground))]
// Margin: mb-12

// Grid: grid grid-cols-1 md:grid-cols-2 gap-6

// Treatment Card Component:
// Container: bg-[hsl(var(--background))] rounded-2xl p-8 border border-[hsl(var(--border))]
//   hover:shadow-lg transition-shadow duration-300
// Use Framer Motion for scroll entrance:
//   whileInView={{ opacity: 1, y: 0 }}
//   initial={{ opacity: 0, y: 20 }}
//   viewport={{ once: true }}
//   transition={{ duration: 0.5, delay: index * 0.15 }}

// Card image (top):
// h-48 w-full rounded-xl overflow-hidden mb-6 object-cover

// Card body:
// Icon label (Jost 300 text-xs tracking-[0.2em] uppercase text-[hsl(var(--secondary))] mb-2)
// Treatment name (Cormorant Garamond 700 italic text-2xl text-[hsl(var(--foreground))] mb-3)
// Description (Jost 300 text-sm leading-relaxed text-[hsl(var(--foreground)/0.7)] mb-4)
// Duration/Price row (Jost 400 text-sm text-[hsl(var(--primary))] font-weight 400)

// CARD 1: Swedish Massage
{/* Image: hands performing gentle Swedish massage on back, warm candlelit spa, soft focus, wellness photography */}
<img src="" alt="Swedish massage at Solace studio" className="w-full h-full object-cover" />
// Label: "Signature Treatment"
// Name: "Swedish Massage"
// Description: "The original restorative. Long, flowing strokes encourage circulation, ease muscle tension, and melt stress. Perfect for first-time clients and regular maintenance. Emma's Swedish technique draws on eight years of refined practice — each stroke calibrated to your body's needs on the day."
// Price: "60 min — £65 · 90 min — £85"

// CARD 2: Deep Tissue
{/* Image: focused deep tissue massage therapy on shoulders, professional spa setting, calm blue-green tones */}
<img src="" alt="Deep tissue massage therapy" className="w-full h-full object-cover" />
// Label: "Therapeutic"
// Name: "Deep Tissue"
// Description: "Targeted pressure on deeper muscle layers to release chronic tension and postural strain. Ideal for active people, desk workers, or anyone carrying persistent tension. This treatment works with the body's deeper fascial structures — methodical, precise, and profoundly effective."
// Price: "60 min — £70 · 90 min — £90"

// CARD 3: Hot Stone
{/* Image: hot stone massage with basalt stones lined along spine, warm amber lighting, dark towels, luxurious spa atmosphere */}
<img src="" alt="Hot stone massage treatment" className="w-full h-full object-cover" />
// Label: "Signature Ritual"
// Name: "Hot Stone"
// Description: "Smooth volcanic basalt stones, heated to the perfect temperature, glide across the body — dissolving tension at its source. A deeply warming, meditative experience that creates a profound sense of calm in the nervous system. No other treatment achieves the same depth of relaxation."
// Price: "90 min — £95"

// CARD 4: Couples Massage
{/* Image: couple's massage room with two treatment tables, rose petals, candles, warm romantic spa lighting */}
<img src="" alt="Couples massage at Solace" className="w-full h-full object-cover" />
// Label: "Shared Experience"
// Name: "Couples Massage"
// Description: "Share the experience. Two therapists, two tables, one serene room. A perfect gift or anniversary treat for you and someone you love. The couples suite is thoughtfully designed — rose quartz diffuser, champagne on arrival, and a curated playlist that sets the perfect tone."
// Price: "90 min — £170 per couple"
```

---

## Section 4: Benefits Stats Bar

```tsx
// Background: bg-[hsl(var(--primary)/0.08)]
// Border: border-y border-[hsl(var(--border))]
// Padding: py-16

// Container: max-w-7xl mx-auto px-4 sm:px-6 lg:px-8

// Grid: grid grid-cols-2 lg:grid-cols-4 gap-8

// Each stat item: text-center (with lg: vertical dividers using border-r border-[hsl(var(--border))] on first 3)

// Stat value:
// Font: Cormorant Garamond 700 italic
// Size: text-5xl (desktop) → text-4xl (mobile)
// Color: text-[hsl(var(--primary))]
// Margin: mb-2

// Stat label:
// Font: Jost 300
// Size: text-sm
// Color: text-[hsl(var(--foreground)/0.6)]
// Style: uppercase tracking-wider

// 4 Stats:
// "500+" — "clients served"
// "4.9★" — "average rating"
// "8 years" — "in practice"
// "100%" — "tailored sessions"

// Animate values on scroll with IntersectionObserver:
// whileInView={{ opacity: 1, scale: 1 }}
// initial={{ opacity: 0, scale: 0.8 }}
// viewport={{ once: true }}
// transition={{ duration: 0.4, delay: index * 0.1 }}
```

---

## Section 5: About the Therapist

```tsx
// Background: bg-[hsl(var(--background))]
// Padding: py-24
// Container: max-w-6xl mx-auto px-4 sm:px-6 lg:px-8

// Grid: grid grid-cols-1 lg:grid-cols-2 gap-16 items-center

// LEFT COLUMN — Image:
// rounded-3xl overflow-hidden aspect-[3/4] max-w-sm w-full
// Framer Motion: whileInView={{ opacity: 1, x: 0 }} initial={{ opacity: 0, x: -30 }} viewport={{ once: true }} transition={{ duration: 0.7 }}
{/* Image: professional portrait of female massage therapist, warm smile, spa uniform, soft natural light, confident and calming presence */}
<img src="" alt="Solace massage therapist portrait" className="w-full h-full object-cover" />

// RIGHT COLUMN — Text:
// py-8
// Framer Motion: whileInView={{ opacity: 1, x: 0 }} initial={{ opacity: 0, x: 30 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.2 }}

// Label: "MEET YOUR THERAPIST"
// Style: Jost 300 text-xs tracking-[0.3em] uppercase text-[hsl(var(--secondary))] mb-4

// Name: "Emma Walsh"
// Style: Cormorant Garamond 700 italic text-5xl text-[hsl(var(--foreground))] mb-6 leading-tight

// Bio paragraph 1:
// "With over eight years of dedicated practice, Emma brings a rare combination of clinical precision and intuitive care to every session. Trained at the London School of Massage and certified in Swedish, Deep Tissue, Hot Stone, and Myofascial Release techniques, she approaches each client as an individual — never applying a one-size-fits-all protocol to what is, by definition, a deeply personal experience."
// Style: Jost 300 text-base leading-relaxed text-[hsl(var(--foreground)/0.75)] mb-4

// Bio paragraph 2:
// "SOLACE was born from a simple belief: that everyone deserves access to professional, thoughtful bodywork in a space that feels genuinely calming — not clinical. Every detail of the studio, from the temperature of the room to the pressure of the stones, is intentional. Emma's approach is rooted in listening — to what you say, and to what your body tells her."
// Style: same as paragraph 1, mb-8

// Qualifications (flex flex-wrap gap-2 mb-8):
// Each: bg-[hsl(var(--muted))] text-[hsl(var(--foreground)/0.7)] text-xs px-3 py-1.5 rounded-full border border-[hsl(var(--border))] font-family Jost font-weight 300
// "ITEC Level 3 Certified" | "CPD Accredited" | "CNHC Registered" | "First Aid Trained"

// CTA Link:
// "Book with Emma →"
// Style: Jost 400 text-sm text-[hsl(var(--primary))] hover:underline cursor-pointer transition-all
```

---

## Section 6: Booking

```tsx
// Background: bg-[hsl(var(--muted))]
// Padding: py-24
// Container: max-w-2xl mx-auto px-4 sm:px-6 lg:px-8

// Glassmorphism card:
// bg-[hsl(var(--background)/0.7)] backdrop-blur-md
// rounded-3xl p-8 lg:p-12
// border border-[hsl(var(--border))]
// shadow-xl

// Heading: "Ready to begin?"
// Style: Cormorant Garamond 700 italic text-5xl text-[hsl(var(--foreground))] mb-4 text-center

// Subtext: "Sessions available Tuesday–Saturday, 9am–7pm. Same-week appointments often available. New clients welcome."
// Style: Jost 300 text-base text-[hsl(var(--foreground)/0.65)] mb-8 text-center leading-relaxed

// Form (space-y-4):

// Input base class: w-full px-4 py-3 rounded-xl border border-[hsl(var(--border))]
//   bg-[hsl(var(--background))] text-[hsl(var(--foreground))]
//   font-family Jost font-weight 300 text-sm
//   focus:outline-none focus:ring-1 focus:ring-[hsl(var(--primary))]
//   placeholder:text-[hsl(var(--foreground)/0.35)] transition-shadow

// Field 1: Full Name
// <label> "Full Name" Jost 300 text-xs text-[hsl(var(--foreground)/0.6)] uppercase tracking-wider mb-1
// <input type="text" placeholder="Your full name" />

// Field 2: Email Address
// <label> "Email Address"
// <input type="email" placeholder="your@email.com" />

// Field 3: Phone Number
// <label> "Phone Number"
// <input type="tel" placeholder="+44 7700 000 000" />

// Field 4: Treatment (select)
// <label> "Treatment"
// <select>
//   <option value="">Select a treatment...</option>
//   <option value="swedish-60">Swedish Massage — 60 min (£65)</option>
//   <option value="swedish-90">Swedish Massage — 90 min (£85)</option>
//   <option value="deep-60">Deep Tissue — 60 min (£70)</option>
//   <option value="deep-90">Deep Tissue — 90 min (£90)</option>
//   <option value="hotstone-90">Hot Stone Massage — 90 min (£95)</option>
//   <option value="couples-90">Couples Massage — 90 min (£170)</option>
// </select>

// Field 5: Preferred Date
// <label> "Preferred Date"
// <input type="date" min={today} />

// Field 6: Message / Notes
// <label> "Additional Notes"
// <textarea rows={3} placeholder="Any areas of focus, health conditions, or preferences we should know about?" className="resize-none" />

// Submit button:
// "Request Appointment"
// className: w-full bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]
//   py-4 rounded-xl font-family Jost font-weight 400 text-base
//   hover:opacity-90 transition-opacity mt-2 tracking-wide

// Below form:
// "Or call us: 07700 900 123 · emma@solacestudio.co.uk"
// Style: Jost 300 text-sm text-[hsl(var(--foreground)/0.5)] text-center mt-6
```

---

## Section 7: Testimonials

```tsx
// Background: bg-[hsl(var(--background))]
// Padding: py-24
// Container: max-w-6xl mx-auto px-4 sm:px-6 lg:px-8

// Heading: "What clients say."
// Style: Cormorant Garamond 700 italic text-5xl text-[hsl(var(--foreground))] text-center mb-12

// Grid: grid grid-cols-1 md:grid-cols-3 gap-6

// Testimonial card:
// bg-[hsl(var(--muted)/0.5)] rounded-2xl p-8 border border-[hsl(var(--border))]
// Framer Motion: whileInView={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 20 }} viewport={{ once: true }} transition={{ delay: index * 0.15 }}

// Stars: "★★★★★" text-[hsl(var(--primary))] text-lg mb-4

// Quote:
// Jost 300 italic text-base leading-relaxed text-[hsl(var(--foreground)/0.8)] mb-6
// Wrapped in: <blockquote className="...">

// Attribution:
// name: Jost 400 text-sm text-[hsl(var(--foreground))]
// treatment: Jost 300 text-xs text-[hsl(var(--foreground)/0.5)] mt-1

// TESTIMONIAL 1:
// Quote: "Emma has genuine magic in her hands. I came in with a shoulder I'd been babying for weeks — I left pain-free and utterly relaxed. The studio itself is just beautiful. It doesn't feel like a medical setting at all — it feels like a sanctuary. I've already booked again."
// Name: "Sarah T." | Treatment: "Deep Tissue Massage"

// TESTIMONIAL 2:
// Quote: "I've had massages at five-star hotels that didn't come close to this. The hot stone treatment is a full hour and a half of pure bliss. Emma explains everything she's doing, so you feel completely at ease throughout. I book monthly now and genuinely look forward to it."
// Name: "James R." | Treatment: "Hot Stone Massage"

// TESTIMONIAL 3:
// Quote: "My husband and I booked the couples treatment for our anniversary. From the moment we walked in we felt totally at ease — the room, the music, the attention to detail. We've already rebooked for next month. I cannot recommend SOLACE highly enough."
// Name: "Claire & Mark B." | Treatment: "Couples Massage"
```

---

## Section 8: Packages & Pricing

```tsx
// Background: bg-[hsl(var(--muted))]
// Padding: py-24
// Container: max-w-6xl mx-auto px-4 sm:px-6 lg:px-8

// Heading: "Simple, transparent pricing."
// Style: Cormorant Garamond 700 italic text-5xl text-[hsl(var(--foreground))] text-center mb-12

// Grid: grid grid-cols-1 lg:grid-cols-2 gap-12 items-start

// LEFT — Pricing Table:
// bg-[hsl(var(--background))] rounded-2xl p-8 border border-[hsl(var(--border))]
// "Individual Sessions" — Jost 400 text-sm uppercase tracking-wider text-[hsl(var(--foreground)/0.5)] mb-6

// Table rows (divide-y divide-[hsl(var(--border))]):
// Each row: flex justify-between items-center py-4
// Treatment name: Jost 300 text-base text-[hsl(var(--foreground)/0.8)]
// Price: Jost 400 text-base text-[hsl(var(--primary))]

// Rows:
// "Swedish Massage — 60 min" / "£65"
// "Swedish Massage — 90 min" / "£85"
// "Deep Tissue — 60 min" / "£70"
// "Deep Tissue — 90 min" / "£90"
// "Hot Stone Massage — 90 min" / "£95"
// "Couples Massage — 90 min" / "£170"

// RIGHT — Package Highlight Card:
// bg-[hsl(var(--primary))] rounded-2xl p-10 text-[hsl(var(--primary-foreground))]
// relative overflow-hidden

// "BEST VALUE" badge:
// absolute top-6 right-6
// bg-[hsl(var(--background)/0.2)] text-[hsl(var(--primary-foreground))] text-xs px-3 py-1 rounded-full
// Jost 400 tracking-wider uppercase

// Package name: "5-Session Package"
// Style: Cormorant Garamond 700 italic text-4xl mb-2

// Price: "£290"
// Style: Cormorant Garamond 700 text-7xl leading-none mb-2

// Save line: "Save £35 vs pay-as-you-go"
// Style: Jost 300 text-sm text-[hsl(var(--primary-foreground)/0.75)] mb-8

// Includes list (space-y-3):
// Each item: flex items-start gap-3
// Check icon (CheckCircle2 from lucide-react, size 16, text-[hsl(var(--primary-foreground)/0.8)])
// Text: Jost 300 text-sm text-[hsl(var(--primary-foreground)/0.85)]
// Items:
// "Choose any 5 × 60-minute treatments"
// "Mix and match Swedish & Deep Tissue"
// "Valid for 6 months from purchase date"
// "Non-transferable · One client per package"

// CTA Button: "Buy Package →"
// bg-[hsl(var(--background))] text-[hsl(var(--primary))] w-full py-3 rounded-xl mt-8
// font-family Jost font-weight 400 hover:opacity-90 transition-opacity
```

---

## Section 9: FAQ

```tsx
// Background: bg-[hsl(var(--background))]
// Padding: py-24
// Container: max-w-2xl mx-auto px-4 sm:px-6 lg:px-8

// Heading: "Common questions."
// Style: Cormorant Garamond 700 italic text-5xl text-[hsl(var(--foreground))] text-center mb-12

// Use shadcn/ui Accordion component:
// import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

// Accordion: type="single" collapsible className="w-full space-y-2"

// Each AccordionItem: border border-[hsl(var(--border))] rounded-xl px-6
// AccordionTrigger: Jost 400 text-base text-[hsl(var(--foreground))] py-5
// AccordionContent: Jost 300 text-sm leading-relaxed text-[hsl(var(--foreground)/0.7)] pb-5

// Q1: "How do I prepare for my first session?"
// A1: "Please arrive 5 minutes early to complete a brief health intake form. Wear comfortable clothing — you'll undress to your comfort level and be modestly draped at all times during your treatment. Avoid heavy meals or alcohol for at least two hours beforehand. If you have any health conditions, injuries, or medications, please mention these when booking so Emma can adapt the session safely."

// Q2: "What should I do if I have a medical condition?"
// A2: "Please mention any medical conditions, injuries, medications, or recent surgeries when booking. Emma will review your intake form before the session and adapt the treatment to ensure it's safe and beneficial for you. In some cases she may ask for GP clearance before proceeding — this is standard practice and always in your best interest."

// Q3: "Do you offer gift vouchers?"
// A3: "Yes — gift vouchers for any treatment or a fixed monetary value are available to purchase online or directly in studio. They arrive in a beautifully presented envelope and make a thoughtful gift for birthdays, anniversaries, or simply someone who deserves a treat. Vouchers are valid for 12 months from purchase date."

// Q4: "What is your cancellation policy?"
// A4: "We ask for 24 hours' notice for cancellations or rescheduling. Late cancellations (under 24 hours) or no-shows may be charged at 50% of the treatment cost. We understand that life is unpredictable — if something comes up, please contact us as soon as possible and we will always try to find a solution."

// Q5: "Is the studio accessible?"
// A5: "The studio is on the ground floor with step-free access from the street. A private changing room and shower are available for use before and after your treatment. The treatment table is height-adjustable. If you have any specific accessibility requirements, please contact us before booking so we can ensure everything is arranged for your comfort."
```

---

## Section 10: Footer

```tsx
// Background: bg-[hsl(var(--foreground))]
// Color: text-[hsl(var(--background))]
// Padding: py-16

// Container: max-w-7xl mx-auto px-4 sm:px-6 lg:px-8
// Grid: grid grid-cols-1 md:grid-cols-3 gap-12

// Column 1 — Logo + Tagline:
// Logo: "SOLACE" — Cormorant Garamond 700 italic text-2xl text-[hsl(var(--background))] tracking-wider
// Tagline: "Private Massage Therapy Studio · London" — Jost 300 text-sm text-[hsl(var(--background)/0.55)] mt-2 leading-relaxed
// Strapline: "Where rest is taken seriously." — Jost 300 italic text-sm text-[hsl(var(--background)/0.4)] mt-4

// Column 2 — Navigation:
// "Navigation" — Jost 300 text-xs tracking-[0.3em] uppercase text-[hsl(var(--background)/0.4)] mb-4
// Links: "Treatments" | "About Emma" | "Pricing" | "Book a Session" | "Gift Vouchers"
// Each: block Jost 300 text-sm text-[hsl(var(--background)/0.65)] hover:text-[hsl(var(--background))] py-1 transition-colors

// Column 3 — Contact + Social:
// "Contact" — same label style
// "07700 900 123" — Jost 400 text-sm text-[hsl(var(--background)/0.65)] mb-1
// "emma@solacestudio.co.uk" — same style mb-4
// "Tuesday – Saturday · 9am – 7pm" — Jost 300 text-sm text-[hsl(var(--background)/0.5)] mb-6
// Social icons: flex gap-4
//   Instagram icon (from lucide-react) + Facebook icon
//   Each: w-8 h-8 rounded-full border border-[hsl(var(--background)/0.2)] flex items-center justify-center
//   hover:border-[hsl(var(--background)/0.5)] hover:text-[hsl(var(--background))] transition-colors
//   Color: text-[hsl(var(--background)/0.5)]

// Footer bottom:
// mt-12 pt-8 border-t border-[hsl(var(--background)/0.1)]
// flex flex-col sm:flex-row justify-between items-center gap-4
// "© 2025 SOLACE. All rights reserved." — Jost 300 text-xs text-[hsl(var(--background)/0.35)]
// "Made with care in London." — Jost 300 text-xs text-[hsl(var(--background)/0.25)]
```

---

## Complete App Structure

```
src/
├── App.tsx                          # Main app with all sections
├── main.tsx                         # Entry point
├── index.css                        # Global styles, CSS variables, font imports
├── components/
│   ├── Navbar.tsx                   # Fixed navbar with mobile menu
│   ├── SteamParticles.tsx           # 12 animated steam particle dots
│   ├── HeroSection.tsx              # Full-viewport hero
│   ├── TreatmentsSection.tsx        # 4-card treatment grid
│   ├── StatsBars.tsx                # 4-stat benefits bar
│   ├── AboutSection.tsx             # Therapist bio 2-col layout
│   ├── BookingSection.tsx           # Glassmorphism booking form
│   ├── TestimonialsSection.tsx      # 3-card testimonials
│   ├── PricingSection.tsx           # Table + package card
│   ├── FAQSection.tsx               # shadcn Accordion FAQ
│   └── Footer.tsx                   # Dark footer 3-col
└── components/ui/                   # shadcn/ui components (accordion, button, input, etc.)
```

```tsx
// index.css — paste this at the top:
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400;1,700&family=Jost:wght@300;400&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 38 50% 96%;
    --foreground: 20 8% 12%;
    --primary: 24 52% 61%;
    --primary-foreground: 38 50% 96%;
    --secondary: 130 14% 60%;
    --muted: 38 30% 92%;
    --muted-foreground: 20 8% 40%;
    --border: 38 20% 85%;
    --card: 38 50% 98%;
    --card-foreground: 20 8% 12%;
    --radius: 1rem;
  }
  
  body {
    font-family: 'Jost', sans-serif;
    font-weight: 300;
    background-color: hsl(var(--background));
    color: hsl(var(--foreground));
    -webkit-font-smoothing: antialiased;
  }
  
  h1, h2, h3, h4, h5, h6 {
    font-family: 'Cormorant Garamond', serif;
  }
}

@layer utilities {
  .text-balance {
    text-wrap: balance;
  }
}
```

```tsx
// App.tsx
import { useEffect } from 'react'
import { motion } from 'motion/react'
import Navbar from './components/Navbar'
import HeroSection from './components/HeroSection'
import TreatmentsSection from './components/TreatmentsSection'
import StatsBar from './components/StatsBar'
import AboutSection from './components/AboutSection'
import BookingSection from './components/BookingSection'
import TestimonialsSection from './components/TestimonialsSection'
import PricingSection from './components/PricingSection'
import FAQSection from './components/FAQSection'
import Footer from './components/Footer'

export default function App() {
  return (
    <main className="min-h-screen bg-[hsl(var(--background))]">
      <Navbar />
      <HeroSection />
      <TreatmentsSection />
      <StatsBar />
      <AboutSection />
      <BookingSection />
      <TestimonialsSection />
      <PricingSection />
      <FAQSection />
      <Footer />
    </main>
  )
}
```

---

## Tailwind Config Additions

```js
// tailwind.config.js — extend colors to use CSS variables
module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        border: 'hsl(var(--border))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      fontFamily: {
        display: ['Cormorant Garamond', 'serif'],
        body: ['Jost', 'sans-serif'],
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [],
}
```

---

## shadcn/ui Setup Commands

```bash
# 1. Create project
npm create vite@latest solace-studio -- --template react-ts
cd solace-studio
npm install

# 2. Install Tailwind
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# 3. Install shadcn/ui
npx shadcn-ui@latest init

# 4. Add components used
npx shadcn-ui@latest add accordion
npx shadcn-ui@latest add button
npx shadcn-ui@latest add input
npx shadcn-ui@latest add select
npx shadcn-ui@latest add textarea

# 5. Install Framer Motion
npm install motion

# 6. Install lucide-react
npm install lucide-react
```

---

## Dependencies (package.json)

```json
{
  "dependencies": {
    "motion": "^11.0.0",
    "lucide-react": "^0.400.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.1",
    "autoprefixer": "^10.4.19",
    "postcss": "^8.4.38",
    "tailwindcss": "^3.4.4",
    "typescript": "^5.2.2",
    "vite": "^5.3.1"
  }
}
```

---

## Key Implementation Notes

1. **Steam Particles**: The SteamParticles component should render outside the main content flow (absolute positioning, pointer-events-none) so it doesn't interfere with user interaction. Each particle uses Framer Motion's animate prop with repeat: Infinity.

2. **Scroll-triggered Animations**: Use `whileInView` with `viewport={{ once: true, margin: '-50px' }}` for all section cards and content elements. This prevents re-animating on scroll back.

3. **Navbar Shadow on Scroll**: In the Navbar component, use `useEffect` with a scroll event listener: `const handleScroll = () => setScrolled(window.scrollY > 20)`. Apply `shadow-sm` class conditionally based on `scrolled` state.

4. **Glassmorphism Booking Form**: The `backdrop-blur-md` class requires a translucent background to work. Ensure the parent section has a visual background that shows through — the `bg-[hsl(var(--muted))]` on the section handles this.

5. **Mobile Responsiveness**: All grids use responsive prefixes (`md:grid-cols-2`, `lg:grid-cols-3`). The navbar collapses to a hamburger below `lg` breakpoint. Text sizes use responsive variants (`text-5xl md:text-6xl`).

6. **Image Handling**: All `<img>` tags have empty `src=""` attributes. The AI code generation tool will need these to be replaced with actual image URLs or image import statements. The descriptive comments above each image tag provide the exact visual context needed.

7. **Form Submission**: The booking form uses controlled React state for each field. On submit, prevent default and optionally send to a mailto link or API endpoint. For a basic implementation: `window.location.href = 'mailto:emma@solacestudio.co.uk?subject=Appointment Request'`.

8. **Color Consistency**: Always reference colors using `hsl(var(--variable-name))` notation, never hardcode hex values. This ensures the design system remains editable from a single source of truth.
