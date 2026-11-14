Build a full single-page cleaning service website called **PRISTINE** — professional, trustworthy, and conversion-optimized. Light background with deep navy and bright blue accent, clean sans-serif typography, and a floating booking form in the hero. The site should instantly communicate reliability and cleanliness — the kind of site that makes someone pick up the phone.

---

## Global Layout Rule — Centering

**Every section must be horizontally centered on the page.** No section, form, or block should ever be flush-left or left-aligned to the viewport edge.

```jsx
<section className="w-full px-6 md:px-12">
  <div className="max-w-6xl mx-auto">
    {/* section content here */}
  </div>
</section>
```

Narrower content (text blocks, FAQ) uses `max-w-3xl mx-auto`. Forms use `max-w-lg mx-auto` when standalone. `mx-auto` is required on every container — never omit it.

---

## Tech Stack

```
React + Vite + TypeScript + Tailwind CSS + Framer Motion (motion/react) + lucide-react
```

---

## Design System

```css
:root {
  --background: 210 20% 98%;       /* near-white #F8FAFC */
  --foreground: 222 47% 11%;       /* deep navy #0F1F3D */
  --primary: 217 91% 50%;          /* bright blue #1D6FEB */
  --primary-foreground: 0 0% 100%;
  --primary-dark: 222 70% 20%;     /* dark navy #0A1F44 — for navbar, footer */
  --muted: 210 16% 96%;            /* light grey #F1F5F9 — alternate sections */
  --muted-foreground: 215 20% 45%; /* mid grey */
  --border: 214 20% 88%;
  --success: 142 71% 38%;          /* green #16A34A — checkmarks, trust badges */
}
```

No texture overlay — this is a clean, light-mode site. All sections clearly separated by background color alternation (white → grey → white).

---

## Typography

```html
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@300;400;500&display=swap" rel="stylesheet">
```

| Role | Font | Style |
|------|------|-------|
| H1 / hero headline | Plus Jakarta Sans | 800, 3rem–4.5rem |
| Section headings H2 | Plus Jakarta Sans | 700, 2rem–3rem |
| Sub-labels / tags | Inter | 500, 0.7rem, tracking-[0.2em] uppercase |
| Body / descriptions | Inter | 400, 1rem, leading-relaxed |
| Button text | Inter | 600, 0.875rem, tracking-[0.05em] |
| Stats | Plus Jakarta Sans | 800, 3rem |

---

## Button System

Three explicit button sizes — always `inline-flex items-center justify-center gap-2 shrink-0 whitespace-nowrap`:

```jsx
// Primary — bright blue fill
<button className="h-12 px-8 inline-flex items-center justify-center gap-2 shrink-0 whitespace-nowrap bg-[hsl(var(--primary))] text-white font-inter text-sm font-semibold rounded-lg shadow-[0_4px_16px_rgba(29,111,235,0.3)] hover:bg-blue-700 transition-colors">
  Book a Free Appointment
</button>

// Secondary — navy outline
<button className="h-12 px-8 inline-flex items-center justify-center gap-2 shrink-0 whitespace-nowrap border-2 border-[hsl(var(--primary-dark))] text-[hsl(var(--primary-dark))] font-inter text-sm font-semibold rounded-lg hover:bg-[hsl(var(--primary-dark))] hover:text-white transition-colors">
  View All Services
</button>

// Ghost / phone CTA
<button className="h-10 px-6 inline-flex items-center justify-center gap-2 shrink-0 whitespace-nowrap bg-white/15 border border-white/30 text-white font-inter text-sm font-medium rounded-full backdrop-blur-sm hover:bg-white/25 transition-colors">
  <Phone className="w-4 h-4 shrink-0" /> Call Us Now
</button>
```

---

## Visual Effects

**Hero booking form card (glassmorphism on dark overlay):**
```css
.booking-card {
  background: rgba(255,255,255,0.96);
  border: 1px solid rgba(255,255,255,0.6);
  border-radius: 16px;
  box-shadow: 0 24px 64px rgba(15,31,61,0.2);
}
```

**Trust badge pill:**
```css
.trust-pill {
  background: white;
  border: 1px solid hsl(var(--border));
  border-radius: 9999px;
  padding: 6px 14px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}
```

**Service card hover:**
```
translateY(-4px) + shadow increase
transition: all 200ms ease-out
border-top: 3px solid hsl(var(--primary)) appears on hover
```

**Stat counter animation:**
```
requestAnimationFrame count 0 → target
duration: 1600ms, ease-out cubic
triggered by IntersectionObserver on first entry
```

**Staggered section entrance:**
```
Each card: initial={{ opacity: 0, y: 24 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.5, ease: 'easeOut', delay: index * 0.1 }}
triggered by IntersectionObserver
```

---

## Component Breakdown

### 1. Top Bar
```
bg-[hsl(var(--primary-dark))] py-2 px-6 text-white
Layout: flex justify-between items-center text-sm

Left: "Mon–Fri 7am–7pm  ·  Sat 8am–5pm" — Inter 300 text-xs text-white/70
Right: phone number — Inter 500 text-sm text-white
  "+ 1 (800) 774-7846" with Phone icon w-3.5 h-3.5 inline
```

### 2. Navbar
```
Position: sticky top-0 z-40 bg-white border-b border-[hsl(var(--border))]
Padding: px-6 py-4
Layout: flex justify-between items-center max-w-6xl mx-auto

Left: Logo — "PRISTINE" Plus Jakarta Sans 700 text-xl text-[hsl(var(--primary-dark))]
  + sparkle or leaf icon in blue before the text (lucide Sparkles)

Center (desktop): nav links — Home · About · Services · Pricing · Contact
  Inter 500 text-sm text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--primary))] transition-colors

Right: "Book Now" primary button h-10 px-6 rounded-lg

Mobile: hamburger → slide-down menu, nav links stacked
```

### 3. Hero
```
Position: relative overflow-hidden min-h-[620px] flex items-center
Background: absolute inset-0 — full-bleed cleaning photography

[Media brief: image | professional cleaning team working in a bright modern home — smiling cleaner in uniform vacuuming or mopping bright living room, large windows, natural light, clean and fresh atmosphere | any composition — gradient overlay handles legibility]

Gradient overlay: absolute inset-0
  linear-gradient(to right, rgba(15,31,61,0.85) 0%, rgba(15,31,61,0.65) 45%, rgba(15,31,61,0.2) 100%)

Hero content: relative z-10 max-w-6xl mx-auto px-6 w-full
  Layout: grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-20

LEFT COLUMN (text):
  Trust badge row: flex gap-2 mb-6
    "★ 4.9 Google Rating" trust-pill — text-[hsl(var(--primary-dark))] text-xs
    "10,000+ Happy Clients" trust-pill

  H1: Plus Jakarta Sans 800, text-4xl md:text-5xl text-white leading-tight
    "Spotless Homes &"
    "Pristine Offices,"
    "Guaranteed."

  Subline: Inter 400, text-base text-white/75 mt-4 max-w-md
    "Professional cleaning services you can trust. Fully insured, background-checked cleaners, and a 100% satisfaction guarantee — every time."

  Checklist row: flex flex-col gap-2 mt-6
    3 items with CheckCircle icon in --success green:
    "Instant online booking — no phone tag"
    "Eco-friendly products, pet and child safe"
    "Cancel or reschedule anytime, no fees"

  CTA row: flex flex-wrap gap-3 mt-8
    "Book a Free Appointment" (primary button h-12)
    "Call Us Now" (ghost/phone button h-12) with Phone icon

RIGHT COLUMN (booking form card):
  .booking-card — white card, shadow, rounded-2xl p-6 lg:p-8

  Heading: Plus Jakarta Sans 700 text-xl text-[hsl(var(--primary-dark))]
    "Book A Free Appointment"
  Sub: Inter 400 text-sm text-[hsl(var(--muted-foreground))] mt-1
    "Get a quote in under 2 minutes."

  Form fields (mt-5 flex flex-col gap-3):
    Full Name — h-11 input, rounded-lg border bg-[hsl(var(--muted))] px-4 text-sm
    Email Address — h-11 input
    Phone Number — h-11 input
    Service Type — h-11 select:
      options: House Cleaning / Office Cleaning / Deep Cleaning / Move-in/Move-out / Carpet Cleaning / Window Cleaning
    Preferred Date — h-11 date input
    Frequency — h-11 select: One-time / Weekly / Bi-weekly / Monthly

  Submit: "Book Free Appointment" primary button h-12 w-full mt-2 rounded-lg

  Trust line below button: Inter 300 text-xs text-[hsl(var(--muted-foreground))] text-center mt-3
    "🔒  No commitment. No credit card. We'll call within 2 hours."
```

### 4. Trust Bar / Logo Strip
```
Section: bg-white border-y border-[hsl(var(--border))] py-6
Content: max-w-6xl mx-auto px-6

Layout: flex flex-col md:flex-row items-center justify-between gap-6

Left label: Inter 500 text-xs tracking-[0.2em] uppercase text-[hsl(var(--muted-foreground))]
  "TRUSTED & REVIEWED ON"

Right: flex gap-8 items-center flex-wrap justify-center
  3 review platform badges — each: flex items-center gap-2

  Google Reviews: Google "G" colored icon + "Google Reviews" text + "★★★★★" in gold + "4.9/5"
  Yelp: Yelp logo red + "Yelp" + "★★★★★" + "4.8/5"
  Trustpilot: Trustpilot star icon green + "Trustpilot" + "★★★★★" + "4.9/5"

  Each badge: trust-pill styling, flex items-center gap-2 text-sm font-medium
```

### 5. Stats Bar
```
Section: bg-[hsl(var(--primary))] py-14 px-6
Content: max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white

4 stats — counter animation on IntersectionObserver:
  "10,000+" — "Homes & Offices Cleaned"
  "98%" — "Client Satisfaction Rate"
  "8 Yrs" — "In Business"
  "50+" — "Trained Professionals"

Each stat:
  Number: Plus Jakarta Sans 800 text-4xl md:text-5xl
  Label: Inter 400 text-sm text-white/75 mt-1

Thin dividers between columns on desktop: border-r border-white/20 last:border-0
```

### 6. About / Why Us
```
Section: bg-white py-24 px-6
Content: max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center

LEFT — image block:
  Relative container, rounded-2xl overflow-hidden aspect-[4/3]
  [Media brief: image | friendly professional cleaning team smiling in uniform, bright indoor setting, equipment in hand, warm and approachable | any composition]

  Floating badge (absolute bottom-4 left-4):
    White card, rounded-xl, shadow, px-4 py-3
    "★ 4.9 / 5.0" in gold — Plus Jakarta Sans 700 text-lg
    "Based on 2,400+ reviews" — Inter 300 text-xs text-grey

RIGHT — text:
  Section label: Inter 500 text-xs tracking-[0.2em] uppercase text-[hsl(var(--primary))] mb-3
    "WHY PRISTINE"
  H2: Plus Jakarta Sans 700 text-3xl md:text-4xl text-[hsl(var(--foreground))] leading-tight
    "Cleaning you can rely on. Every single visit."
  Body: Inter 400 text-base text-[hsl(var(--muted-foreground))] mt-4 leading-relaxed
    "We started Pristine because we were tired of cleaning services that showed up late, rushed the job, and left streaks on the windows. Every cleaner on our team is background-checked, trained in-house, and held to a strict quality checklist after every visit."

  4 feature items (mt-8 flex flex-col gap-4):
    Each: flex items-start gap-3
    Icon: CheckCircle, w-5 h-5 text-[hsl(var(--success))] shrink-0 mt-0.5
    Title + body: Plus Jakarta Sans 600 text-sm + Inter 400 text-sm text-muted-foreground

    "Background-Checked & Insured — Every cleaner passes a thorough vetting process before their first job."
    "Eco-Friendly Products — We use non-toxic, biodegradable cleaning solutions that are safe for kids and pets."
    "Satisfaction Guarantee — If you're not happy, we come back and re-clean within 24 hours. No questions asked."
    "Real-Time Notifications — We send a text when your cleaner is on their way and when the job is done."

  "Learn About Us" secondary button h-11 mt-8
```

### 7. Services Grid
```
Section: bg-[hsl(var(--muted))] py-24 px-6
Content: max-w-6xl mx-auto

Section label + H2 (text-center):
  "OUR SERVICES" / "Everything clean, handled."
  Subline: Inter 400 text-base text-muted-foreground max-w-xl mx-auto mt-3
    "Whether it's your home, your office, or a one-time deep clean — we've got the crew and the tools."

Grid: mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6

6 service cards — hover: translateY(-4px) + blue top border:
  bg-white rounded-2xl p-7 shadow-sm border border-[hsl(var(--border))] transition-all duration-200
  hover:shadow-md hover:border-t-[hsl(var(--primary))] hover:border-t-[3px]

  Icon: lucide icon in blue, w-10 h-10, bg-blue-50 rounded-xl p-2 mb-5
  Title: Plus Jakarta Sans 700 text-base text-[hsl(var(--foreground))]
  Body: Inter 400 text-sm text-muted-foreground mt-2 leading-relaxed
  "From $X" label: Inter 600 text-sm text-[hsl(var(--primary))] mt-4

  Card 1 — Home icon: "House Cleaning"
    "Regular maintenance cleaning for bedrooms, kitchens, bathrooms, and living areas. Weekly, bi-weekly, or monthly. From $89"

  Card 2 — Building icon: "Office Cleaning"
    "Commercial cleaning for offices, co-working spaces, and retail — before hours, after hours, or weekends. From $120"

  Card 3 — Zap icon: "Deep Cleaning"
    "Floor-to-ceiling detailed clean including inside appliances, baseboards, grout, and hard-to-reach spots. From $180"

  Card 4 — Truck icon: "Move In / Move Out"
    "Leave your old place spotless or arrive to a fresh start. Covers every surface, inside cabinets, and all fixtures. From $200"

  Card 5 — Layers icon: "Carpet Cleaning"
    "Hot water extraction removes deep-set dirt, stains, and allergens. Safe for all carpet types. From $75/room"

  Card 6 — Sun icon: "Window Cleaning"
    "Interior and exterior window cleaning for homes and offices. Streak-free finish guaranteed. From $60"

"View All Services" secondary button — centered below grid, mt-10
```

### 8. How It Works — 3 Steps
```
Section: bg-white py-24 px-6
Content: max-w-6xl mx-auto

Section label + H2 (text-center):
  "HOW IT WORKS" / "Effortless Cleaning in 3 Steps"

Grid: mt-14 grid grid-cols-1 md:grid-cols-3 gap-8 relative

Connector line (desktop only): absolute top-10 left-[calc(16.67%+32px)] right-[calc(16.67%+32px)] h-px bg-[hsl(var(--border))]

3 step cards (text-center):
  Step number circle: w-16 h-16 rounded-full bg-[hsl(var(--primary))] text-white
    Plus Jakarta Sans 800 text-2xl — "01" / "02" / "03"
    mx-auto mb-5

  Title: Plus Jakarta Sans 700 text-lg text-[hsl(var(--foreground))] mt-4
  Body: Inter 400 text-sm text-muted-foreground mt-2 leading-relaxed max-w-xs mx-auto

  Step 1 — "Book Online"
    "Choose your service, pick a date and time, and submit your details. Takes less than 2 minutes — no phone calls needed."

  Step 2 — "We Show Up"
    "Your vetted, uniformed cleaning pro arrives on time with all equipment and supplies included. Nothing for you to prepare."

  Step 3 — "Enjoy the Clean"
    "Sit back and relax while we take care of everything. You'll receive a completion summary and can rebook in one click."
```

### 9. Testimonials
```
Section: bg-[hsl(var(--muted))] py-24 px-6
Content: max-w-6xl mx-auto

Section label + H2 (text-center):
  "REVIEWS" / "What our clients say"
  Aggregate: "★★★★★  4.9 out of 5 — from 2,400+ verified reviews" — Inter 500 text-sm text-muted-foreground mt-2

Grid: mt-12 grid grid-cols-1 md:grid-cols-3 gap-6

3 testimonial cards — bg-white rounded-2xl p-7 shadow-sm border border-[hsl(var(--border))]:

  Stars: "★★★★★" text-[#F59E0B] text-sm mb-4

  Quote: Inter 400 text-sm text-[hsl(var(--foreground))] leading-relaxed italic
  Attribution: flex items-center gap-3 mt-5
    Avatar: w-10 h-10 rounded-full object-cover
      [Media brief: image | friendly woman or man, casual portrait, smiling, neutral background, realistic photo]
    Name: Plus Jakarta Sans 600 text-sm
    Source: "via Google" or "via Yelp" — Inter 300 text-xs text-muted-foreground

  Review 1:
    "I've tried four different cleaning services in the past two years. Pristine is the only one I've kept. They're on time, thorough, and the apartment actually smells clean when they leave — not just like chemicals."
    — Sarah M., New York · via Google

  Review 2:
    "Booked a deep clean before listing my apartment. The team did an incredible job — my realtor couldn't believe it wasn't freshly renovated. Worth every penny."
    — James T., Chicago · via Yelp

  Review 3:
    "We use Pristine for our office every Friday morning. It's the one thing on our facilities list I never have to think about. They're just reliable, which is rare."
    — Elena R., Office Manager · via Trustpilot
```

### 10. Pricing (Optional — 3 tiers)
```
Section: bg-white py-24 px-6
Content: max-w-5xl mx-auto

Section label + H2 (text-center):
  "PRICING" / "Simple, transparent pricing."
  Subline: "No hidden fees. No surprises. Cancel anytime."

Grid: mt-12 grid grid-cols-1 md:grid-cols-3 gap-6

3 pricing cards:
  Card 1 — "Standard Clean" — $89/visit
    bg-white border border-[hsl(var(--border))] rounded-2xl p-8

  Card 2 — "Deep Clean" — $180/visit (POPULAR — highlighted)
    bg-[hsl(var(--primary))] text-white rounded-2xl p-8 shadow-[0_8px_32px_rgba(29,111,235,0.3)] scale-[1.02]
    "Most Popular" pill badge top-center: bg-white text-[hsl(var(--primary))] rounded-full px-4 py-1 text-xs font-semibold

  Card 3 — "Move In/Out" — $200/visit
    bg-white border border-[hsl(var(--border))] rounded-2xl p-8

  Each card:
    Plan name: Plus Jakarta Sans 700 text-lg
    Price: Plus Jakarta Sans 800 text-4xl — "$XX"
    Per: Inter 400 text-sm — "/visit"
    Feature list: mt-6 flex flex-col gap-3
      Each: CheckCircle icon + Inter 400 text-sm
    CTA button: h-11 w-full mt-8 — "Book This Plan"
```

### 11. FAQ Accordion
```
Section: bg-[hsl(var(--muted))] py-24 px-6
Content: max-w-3xl mx-auto

Section label + H2 (text-center):
  "FAQ" / "Common questions"

6 accordion items — AnimatePresence height animation:
  Each: border-b border-[hsl(var(--border))] py-5
  Question row: flex justify-between items-center cursor-pointer gap-4
    Question: Plus Jakarta Sans 600 text-base text-[hsl(var(--foreground))]
    Icon: ChevronDown, rotates 180° when open, text-[hsl(var(--primary))]
  Answer: Inter 400 text-sm text-muted-foreground leading-relaxed mt-3

  Q1: "Do I need to be home during the cleaning?"
  A1: "No — many of our clients leave a key or door code. We're background-checked and fully insured, so you can go about your day while we clean."

  Q2: "What's included in a standard clean?"
  A2: "Standard cleaning covers all bedrooms, bathrooms, kitchen, and living areas — including vacuuming, mopping, surface wiping, bathroom sanitation, and kitchen surfaces. A full checklist is provided at booking."

  Q3: "Do you bring your own cleaning supplies?"
  A3: "Yes. We bring all equipment and supplies — eco-friendly, non-toxic, and safe for children and pets. Just let us know if you have any product preferences or allergies."

  Q4: "What if I'm not happy with the results?"
  A4: "We offer a 100% satisfaction guarantee. If you're not happy with any area of your clean, contact us within 24 hours and we'll send a team back to re-clean it at no charge."

  Q5: "How far in advance do I need to book?"
  A5: "We recommend 48 hours notice for standard cleans, and 72 hours for deep cleans. That said, we sometimes have same-day or next-day slots — check availability when you book."

  Q6: "Can I change or cancel my booking?"
  A6: "Yes — you can reschedule or cancel up to 24 hours before your appointment with no fee. Cancellations within 24 hours may incur a small late-cancellation fee."
```

### 12. Final CTA Section
```
Section: bg-[hsl(var(--primary-dark))] py-24 px-6 relative overflow-hidden
Decorative: absolute large circle shapes in blue/20 opacity, blurred, non-interactive — bg decoration only

Content: max-w-3xl mx-auto text-center relative z-10

H2: Plus Jakarta Sans 800 text-3xl md:text-5xl text-white leading-tight
  "Ready for a spotless"
  "home or office?"

Body: Inter 400 text-base text-white/70 mt-4
  "Book in 2 minutes. No commitment. Our team is ready."

CTA row: flex flex-col sm:flex-row gap-4 justify-center mt-10
  "Book Free Appointment" — primary button h-13 px-10
  "Call (800) 774-7846" — ghost/phone button h-12 px-8 text-white border-white/40

Trust line: Inter 300 text-sm text-white/50 mt-6
  "✓ No credit card required  ·  ✓ Cancel anytime  ·  ✓ 100% satisfaction guarantee"
```

### 13. Footer
```
Section: bg-[hsl(var(--primary-dark))] border-t border-white/10 py-12 px-6

Content: max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10

Col 1 — Brand:
  "PRISTINE" Plus Jakarta Sans 700 text-lg text-white
  "Professional Cleaning Services" Inter 300 text-sm text-white/50 mt-1
  Phone + email: Inter 400 text-sm text-white/70 mt-4
    "(800) 774-7846" / "hello@pristineclean.com"

Col 2 — "Services":
  Label: Inter 500 text-xs tracking-[0.2em] uppercase text-white/40 mb-4
  Links: House Cleaning, Office Cleaning, Deep Cleaning, Move In/Out, Carpet Cleaning, Window Cleaning
  Inter 400 text-sm text-white/60 hover:text-white block mb-2

Col 3 — "Company":
  About Us, Blog, Careers, Press, Contact

Col 4 — "Service Areas":
  New York, Los Angeles, Chicago, Houston, Phoenix, Miami

Bottom bar: mt-10 flex flex-col md:flex-row justify-between items-center border-t border-white/10 pt-6 gap-4
  "© 2026 Pristine Cleaning Services. All rights reserved." Inter 300 text-xs text-white/40
  Social icons (Facebook, Instagram, TikTok) — white/40, hover:white
  "Schedule an Appointment Today →" — Inter 500 text-sm text-[hsl(var(--primary))]
```

---

## Animations Summary

| Element | Animation | Trigger |
|---------|-----------|---------|
| Hero text + checklist | fade-up, staggered 0.1s per item | on load |
| Booking form card | fade-in + slight scale-up, 0.4s delay | on load |
| Stats counters | count 0 → target, 1600ms | IntersectionObserver |
| Service cards | fade-up, staggered 0.1s | IntersectionObserver |
| Step cards | fade-up, staggered | IntersectionObserver |
| Testimonials | fade-up, staggered | IntersectionObserver |
| Service card hover | translateY(-4px) + shadow | hover |
| FAQ accordion | height expand + opacity | click |
| Pricing card featured | scale(1.02) — static emphasis | always |

---

## Responsive

**Mobile (< 768px):**
- Hero: single column — text first, booking form below
- Stats: 2×2 grid
- Services: single column
- How It Works: stacked, connector line hidden
- Testimonials: single column
- Pricing: stacked, no scale effect on featured
- Footer: stacked columns

**Desktop (≥ 768px):**
- Hero: 2-column with floating form card
- Services: 3-column grid
- Stats: 4-column
- All grids as specified

---

## All Copy

**Brand:** PRISTINE — Professional Cleaning Services
**Tagline:** "Spotless Homes & Pristine Offices, Guaranteed."
**Subline:** "Professional cleaning services you can trust. Fully insured, background-checked cleaners, and a 100% satisfaction guarantee — every time."
**Phone:** (800) 774-7846
**Email:** hello@pristineclean.com
**Hours:** Mon–Fri 7am–7pm · Sat 8am–5pm

**Nav:** Home · About · Services · Pricing · Contact · Book Now

**Hero checklist:** Instant online booking — no phone tag · Eco-friendly products, pet and child safe · Cancel or reschedule anytime, no fees

**Stats:** 10,000+ Homes & Offices Cleaned · 98% Client Satisfaction Rate · 8 Yrs In Business · 50+ Trained Professionals

**Services:** House Cleaning ($89) · Office Cleaning ($120) · Deep Cleaning ($180) · Move In/Out ($200) · Carpet Cleaning ($75/room) · Window Cleaning ($60)

**Steps:** Book Online · We Show Up · Enjoy the Clean

**Pricing tiers:** Standard Clean ($89) · Deep Clean ($180, featured) · Move In/Out ($200)

**Final CTA:** "Ready for a spotless home or office?" / "Book in 2 minutes. No commitment."

---

## Key Dependencies

```json
{
  "motion": "^12.x",
  "lucide-react": "^0.4xx"
}
```

---

*Quick notes:*
- *Booking form in hero is the highest-converting pattern from the reference sites — keep it above the fold on desktop*
- *Review badges (Google, Yelp, Trustpilot) use text + colored SVG icons — no external logo URLs needed*
- *The pricing section is optional — remove if the client prefers quote-based pricing*
