Build a complete, production-ready electrician website for **VOLTEX**, a licensed residential and commercial electrical contractor. The design is dark industrial with electric yellow (#F5C518) as the sole accent color — high contrast, bold typography, and a grid texture that gives everything a precision, technical feel. Think premium trades company, not a generic handyman site.

---

## Tech Stack

```
React + Vite + TypeScript + Tailwind CSS + Framer Motion (motion/react) + shadcn/ui + lucide-react
```

---

## Design System — Colors

```css
:root {
  --background: 222 25% 5%;        /* #0A0C0F — near black */
  --surface: 222 26% 7%;           /* #0D1016 — section dark */
  --surface-elevated: 222 28% 10%; /* #121520 — card hover */
  --foreground: 0 0% 100%;         /* white */
  --foreground-muted: 0 0% 100% / 0.45; /* 45% white */
  --foreground-dim: 0 0% 100% / 0.25;
  --primary: 47 91% 53%;           /* #F5C518 — electric yellow */
  --primary-foreground: 222 25% 5%; /* dark text on yellow */
  --primary-glow: 47 91% 53% / 0.12;
  --border: 0 0% 100% / 0.06;
  --border-accent: 47 91% 53% / 0.25;
}
```

---

## Typography

```
Google Font: Plus Jakarta Sans
Weights: 300, 400, 500, 700, 800, 900
URL: https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;700;800;900&display=swap

Headings: Plus Jakarta Sans 900, letter-spacing -0.04em
Subheadings: Plus Jakarta Sans 700–800, letter-spacing -0.02em
Body: Plus Jakarta Sans 300–400, line-height 1.8
Labels/badges: Plus Jakarta Sans 600, letter-spacing 0.16em, UPPERCASE
UI buttons: Plus Jakarta Sans 700, letter-spacing 0.02em
```

---

## Global Layout Rule — Centering

**Every section must have an inner wrapper with `max-w-[1200px] mx-auto w-full`.**
Never let content bleed to the screen edge. All sections use `px-16` horizontal padding on desktop, `px-6` on mobile.

---

## Button System

```tsx
// Primary — yellow fill
<button className="inline-flex items-center justify-center gap-2 shrink-0 whitespace-nowrap h-[52px] px-9 rounded-lg bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] text-sm font-bold tracking-wide hover:opacity-90 transition-opacity">
  Get a Free Quote
</button>

// Ghost — transparent with border
<button className="inline-flex items-center justify-center gap-2 shrink-0 whitespace-nowrap h-[52px] px-7 rounded-lg bg-white/5 text-white text-sm font-medium border border-white/10 hover:bg-white/10 transition-colors">
  (800) 559-2648
</button>

// Outline yellow — on yellow bg sections
<button className="inline-flex items-center justify-center gap-2 shrink-0 whitespace-nowrap h-[52px] px-9 rounded-lg border-2 border-[hsl(var(--primary-foreground))] text-[hsl(var(--primary-foreground))] text-sm font-bold hover:bg-[hsl(var(--primary-foreground))] hover:text-[hsl(var(--primary))] transition-all">
  See All Services
</button>
```

---

## Visual Effects

### Grid Texture Background
Apply to all dark sections as an `::after` or nested absolute div:
```css
background-image:
  linear-gradient(hsl(47 91% 53% / 0.04) 1px, transparent 1px),
  linear-gradient(90deg, hsl(47 91% 53% / 0.04) 1px, transparent 1px);
background-size: 64px 64px;
```

### Yellow Radial Glow
Used in hero — right side ambient glow:
```css
position: absolute;
right: -100px;
top: 50%;
transform: translateY(-50%);
width: 600px; height: 600px;
border-radius: 50%;
background: radial-gradient(circle, hsl(47 91% 53% / 0.12) 0%, transparent 65%);
pointer-events: none;
```

### Ghost Number Watermark
Hero background: oversized "24" in near-invisible yellow
```css
font-size: clamp(16rem, 28vw, 28rem);
font-weight: 900;
color: hsl(47 91% 53% / 0.03);
position: absolute; right: 60px; top: 50%; transform: translateY(-50%);
letter-spacing: -0.05em; line-height: 0.8;
pointer-events: none; user-select: none;
```

### Stat Counter Animation
requestAnimationFrame counter from 0 → target on scroll entry:
```tsx
const useCountUp = (target: number, duration = 1600) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        let start = 0;
        const step = (timestamp: number) => {
          if (!start) start = timestamp;
          const progress = Math.min((timestamp - start) / duration, 1);
          const ease = 1 - Math.pow(1 - progress, 3);
          setCount(Math.floor(ease * target));
          if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
        observer.disconnect();
      }
    }, { threshold: 0.3 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);
  return { count, ref };
};
```

### Scroll Fade-Up Animation
Wrap every section's content in a motion.div:
```tsx
<motion.div
  initial={{ opacity: 0, y: 32 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, margin: '-80px' }}
  transition={{ duration: 0.6, ease: 'easeOut' }}
>
```

---

## Section 1 — Navbar

```
Position: absolute top-0 left-0 right-0, z-30
Background: transparent (becomes bg-[hsl(var(--background))]/90 backdrop-blur-md on scroll)
Height: 72px
Padding: px-16
Layout: flex justify-between items-center

Logo left:
  - Yellow square 34×34 px, border-radius 8px, bg-[hsl(var(--primary))]
  - SVG lightning bolt inside in dark color (#0A0C0F): <path d="M13 2L4.5 13.5H11L10 22L19.5 10.5H13L13 2Z"/>
  - "VOLTEX" text: font-size 1.05rem, font-weight 800, letter-spacing -0.02em, color white

Nav center: SERVICES · ABOUT · REVIEWS · CONTACT
  - font-size 0.72rem, font-weight 400, color white/50, letter-spacing 0.06em

CTA right: "GET A QUOTE" primary button, height 40px, px-5, rounded-lg
```

---

## Section 2 — Hero

```
Min-height: 100vh
Background: hsl(var(--background))
Position: relative, overflow hidden

LAYERS (back to front):
1. Grid texture overlay (absolute inset-0, z-0)
2. Yellow radial glow right side (z-0)
3. Ghost "24" watermark (absolute right 60px, vertically centered, z-0)
4. Content grid (relative z-10)

Content grid: two columns (1fr 1fr), gap-20, align-items center
Padding: pt-[120px] pb-[80px]

── LEFT COLUMN ──

Badge (top):
  display inline-flex, items-center gap-2
  border border-[hsl(var(--border-accent))] rounded-[6px]
  padding 6px 14px, margin-bottom 36px
  • Yellow dot 6×6 px (rounded-full, bg-[hsl(var(--primary))])
  • Text: "LICENSED · INSURED · AVAILABLE NOW"
    font-size 0.62rem, font-weight 600, color hsl(var(--primary)/0.75), letter-spacing 0.18em

H1:
  font-size clamp(3.2rem, 6vw, 6.2rem)
  font-weight 900, line-height 0.92, letter-spacing -0.04em
  color white, margin-bottom 28px
  Text:
    "Electrical
     Work Done
     Right."
  "Right." → color hsl(var(--primary))

  Animation: word-by-word stagger
    Each word wrapped in motion.span:
      initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ duration: 0.5, ease: 'easeOut', delay: index * 0.08 }}

Body text:
  font-size 0.92rem, font-weight 300, color white/45, line-height 1.8
  max-width 360px, margin-bottom 44px
  "Licensed master electricians for homes and businesses. Wiring, panels, EV chargers, and emergency repairs — same-day service, flat-rate pricing."

CTA row (gap-3):
  1. Primary button: "Get a Free Quote"
  2. Ghost button with Phone icon: "(800) 559-2648"

Stats row (below CTAs, margin-top 52px):
  3 columns, width fit-content, gap-0
  Dividers: border-right border-[hsl(var(--border))]
  Padding: pr-8 | px-8 | pl-8

  Col 1: "12k+" white 900 / "JOBS DONE" white/35 0.62rem tracking-wide
  Col 2: "18yr" white 900 / "EXPERIENCE" white/35 0.62rem tracking-wide
  Col 3: "24/7" hsl(var(--primary)) 900 / "EMERGENCY" white/35 0.62rem tracking-wide

── RIGHT COLUMN ──

Photo container (aspect-ratio 4/5, position relative):
  Main image:
    Full 4/5 container, rounded-2xl, overflow hidden
    [Media brief: image | licensed electrician at work — hands at electrical panel, blue work shirt, professional tools, focused expression, dark industrial workshop setting | any composition works — layout uses gradient overlay for contrast]
    Gradient overlay: linear-gradient(to top, hsl(var(--background)) 0%, transparent 40%)

  Yellow corner accent frame:
    position absolute top -16px right -16px
    width 80px height 80px
    border 3px solid hsl(var(--primary))
    rounded-xl z-[-1]

  Floating card — Certificate (bottom-left):
    position absolute bottom-8 left-[-32px]
    bg hsl(var(--background))
    border border-[hsl(var(--border-accent))]
    rounded-xl px-5 py-4
    box-shadow 0 16px 48px rgba(0,0,0,0.5)
    • "CERTIFIED" label: 0.58rem, font-weight 600, hsl(var(--primary)/0.6), letter-spacing 0.16em, mb-1.5
    • "Master Electrician" white, 0.88rem font-weight 700
    • "License #EL-2031-IL" white/40, 0.68rem font-weight 300

  Floating card — Response (top-right):
    position absolute top-6 right-[-28px]
    bg hsl(var(--primary))
    rounded-xl px-4.5 py-3.5
    • "60min" in hsl(var(--primary-foreground)), font-size 1.6rem, font-weight 900
      "min" inline smaller 0.9rem font-weight 600
    • "RESPONSE TIME" below, 0.6rem, font-weight 600, dark/65, letter-spacing 0.06em
```

---

## Section 3 — Emergency Strip

```
Background: hsl(var(--primary))
Padding: py-4 px-16

Layout: flex justify-between items-center (inner max-w-[1200px] mx-auto)

Left:
  - Lightning bolt icon (Lucide Zap, 18px, dark)
  - "24/7 EMERGENCY SERVICE" font-weight 800, font-size 0.88rem, dark, letter-spacing 0.04em

Center:
  - Dot separator • repeated with thin dividers
  - "No extra charge on weekends · Same-day dispatch · Licensed & insured"
    font-size 0.78rem, font-weight 500, dark/70

Right:
  - Phone icon + "(800) 559-2648" font-weight 800, dark
  - "Call Now →" underline link, dark/60
```

---

## Section 4 — Services Grid

```
Background: hsl(var(--surface))
Padding: py-24 px-16

Section header (flex justify-between items-end, mb-16):
  Left:
    - "WHAT WE DO" label: 0.6rem, font-weight 600, hsl(var(--primary)), tracking-[0.24em], uppercase, mb-3
    - H2: "Every electrical service,\nhandled properly."
      font-size clamp(2rem, 3.5vw, 3rem), font-weight 900, letter-spacing -0.03em, white, line-height 1.05
  Right:
    - "ALL SERVICES →" text-link: 0.72rem, font-weight 600, white/40, border-bottom border-white/15, pb-1

6-card grid (grid-cols-3 gap-[2px] bg-[hsl(var(--border))]):
Each card:
  background hsl(var(--surface))
  padding p-9
  border-top-2 border-transparent
  hover: bg-[hsl(var(--surface-elevated))] border-t-[hsl(var(--primary))]
  transition-all duration-200

  Icon container: w-10 h-10 bg-[hsl(var(--primary-glow))] rounded-[10px] flex items-center justify-center mb-5
    Icon: Lucide icon in hsl(var(--primary)), size 18

  Price label: 0.6rem, font-weight 600, hsl(var(--primary)/0.55), letter-spacing 0.18em, uppercase, mb-2.5
  Title: 1rem, font-weight 700, white, mb-2.5
  Description: 0.8rem, font-weight 300, white/40, line-height 1.7

THE 6 SERVICES:

Card 1 — Panel Upgrades (icon: Zap)
  Price: FROM $850
  Title: Panel Upgrades
  Body: 200A upgrades, breaker replacement, and full panel replacement for older homes and new builds.

Card 2 — Lighting Installation (icon: Sun)
  Price: FROM $149
  Title: Lighting Installation
  Body: Recessed lighting, fixtures, dimmer switches, and smart lighting setup for any room or outdoor space.

Card 3 — EV Charger Install (icon: Car)
  Price: FROM $599
  Title: EV Charger Install
  Body: Level 2 home charger installation for all EV models. Permit filing and inspection included.

Card 4 — Outlet & Wiring (icon: Plug)
  Price: FROM $95
  Title: Outlet & Wiring
  Body: Add new outlets, fix faulty wiring, GFCI installations, and whole-home rewiring projects.

Card 5 — Emergency Repairs (icon: AlertTriangle)
  Price: FLAT-RATE
  Title: Emergency Repairs
  Body: Available 24/7 for power outages, sparking outlets, and tripped breakers. No overtime surcharge.

Card 6 — Smart Home Wiring (icon: Wifi)
  Price: FROM $299
  Title: Smart Home Wiring
  Body: Structured wiring, smart switches, whole-home automation prep, and low-voltage cabling.
```

---

## Section 5 — Why Choose VOLTEX (Split)

```
Background: hsl(var(--background))
Padding: py-24 px-16

Two-column grid (1fr 1fr), gap-20, align-items center

── LEFT: Photo ──
Aspect-ratio 4/3, rounded-2xl, overflow hidden
[Media brief: image | professional electrician team — two workers in VOLTEX yellow vests, inside modern home, inspecting electrical panel, natural window light | gradient overlay bottom for fade]
Bottom fade: linear-gradient(to top, hsl(var(--background)) 0%, transparent 30%)

Yellow accent badge floating bottom-right of photo:
  bg hsl(var(--primary)), rounded-xl, px-5 py-4
  "Since 2006" — dark, font-weight 900, 1.4rem
  "18 Years of Excellence" — dark/65, 0.65rem, uppercase, tracking wide

── RIGHT: Text ──
"WHY CHOOSE US" label: hsl(var(--primary)), 0.6rem, tracking-[0.24em], mb-4
H2: "Electrical work\nyou can trust."
  font-size clamp(2rem, 3vw, 2.8rem), font-weight 900, white, letter-spacing -0.03em, line-height 1.1, mb-6

Body: "From a simple outlet repair to a complete commercial wiring project, VOLTEX shows up on time, does the work right, and backs it with a full warranty. No guesswork — flat-rate pricing on every job."
  font-size 0.9rem, white/50, line-height 1.8, mb-10

Checklist (6 items, gap-4):
Each item: flex items-start gap-3
  - Yellow checkmark circle (w-5 h-5, bg hsl(var(--primary-glow)), border border-[hsl(var(--primary)/0.3)], rounded-full, flex center)
    → Lucide Check icon, 12px, hsl(var(--primary))
  - Text: 0.88rem, font-weight 500, white/80

Items:
  1. Licensed Master Electricians on every job
  2. Flat-rate pricing — no surprise charges
  3. Same-day & emergency availability
  4. All work permit-filed and inspected
  5. 2-year workmanship warranty
  6. Residential, commercial & industrial

Primary CTA: "Get a Free Quote" below checklist, mt-10
```

---

## Section 6 — Process (4 Steps)

```
Background: hsl(var(--surface))
Padding: py-24 px-16

Section header (text-center, mb-16):
  "HOW IT WORKS" label: hsl(var(--primary)), 0.6rem, tracking-[0.24em], mb-3
  H2: "Simple. Fast. Done right."
    font-size clamp(1.8rem, 3vw, 2.6rem), font-weight 900, white, letter-spacing -0.03em

4-column step grid (gap-8):

Each step:
  Step number: hsl(var(--primary)), font-size 0.62rem, font-weight 700, letter-spacing 0.2em, uppercase, mb-4
    + thin yellow line across full width of card underneath number (h-[1px] bg-[hsl(var(--primary)/0.3)] mb-6)
  Icon: w-12 h-12, bg hsl(var(--primary-glow)), rounded-xl, Lucide icon in hsl(var(--primary)), mb-5
  Title: 1rem, font-weight 700, white, mb-3
  Body: 0.8rem, white/40, line-height 1.7, font-weight 300

Step 1 — "01 / CALL OR BOOK" — PhoneCall icon
  "Request a quote by phone or online. Tell us what's wrong or what you need — we'll schedule the right time."

Step 2 — "02 / ON-SITE ASSESSMENT" — ClipboardCheck icon
  "A licensed electrician visits your property, diagnoses the issue, and gives you a clear flat-rate price — before any work begins."

Step 3 — "03 / WORK COMPLETED" — Wrench icon
  "We complete the job cleanly and efficiently. All materials, permits, and inspections are handled by our team."

Step 4 — "04 / GUARANTEED" — ShieldCheck icon
  "Every VOLTEX job is backed by a 2-year workmanship warranty. If anything isn't right, we come back — at no cost."
```

---

## Section 7 — Stats / Trust Bar

```
Background: hsl(var(--primary))
Padding: py-16 px-16

4-column grid (divide-x divide-[hsl(var(--primary-foreground)/0.15)]):
Each column: text-center, px-8

Numbers animate on scroll entry using useCountUp hook.
Number: font-size clamp(2.4rem, 4vw, 3.4rem), font-weight 900, hsl(var(--primary-foreground))
Suffix ("+" or "yr" or "★"): same style but smaller 1.8rem
Label: 0.7rem, font-weight 600, hsl(var(--primary-foreground)/0.6), letter-spacing 0.16em, uppercase, mt-2

Stats:
  12,000+ → "JOBS COMPLETED"
  18yr → "IN BUSINESS"
  4.9★ → "GOOGLE RATING"
  500+ → "5-STAR REVIEWS"
```

---

## Section 8 — Testimonials

```
Background: hsl(var(--background))
Padding: py-24 px-16

Section header (text-center, mb-14):
  "WHAT CLIENTS SAY" label: hsl(var(--primary)), 0.6rem, tracking-[0.24em], mb-3
  H2: "Trusted by homeowners\nand contractors alike."
    font-size clamp(1.8rem, 3vw, 2.6rem), font-weight 900, white

3-card grid (grid-cols-3, gap-6):
Each card:
  Background: hsl(var(--surface))
  Border: 1px solid hsl(var(--border))
  Border-radius: 1rem
  Padding: p-8
  Hover: border-[hsl(var(--border-accent))] transition-colors

  Stars row: 5 × Star icon filled hsl(var(--primary)), size 14, mb-5
  Quote: 0.9rem, white/75, line-height 1.75, mb-6, font-weight 300, italic
  Divider: 1px hsl(var(--border)), mb-5
  Client row: flex items-center gap-3
    - Avatar: w-10 h-10 rounded-full bg hsl(var(--surface-elevated))
      [Media brief: image | person portrait — friendly homeowner, neutral background, square format]
    - Name: 0.88rem, font-weight 700, white
    - Detail: 0.72rem, white/40, font-weight 300

TESTIMONIALS:

Card 1:
  Stars: 5
  Quote: "VOLTEX upgraded our entire electrical panel and added 4 new circuits for our kitchen renovation. Done in a single day, clean work, permit handled. Incredibly professional team."
  Name: Mark T.
  Detail: Homeowner, Chicago IL

Card 2:
  Stars: 5
  Quote: "Called at 11pm for a sparking outlet — they had someone out within the hour. Fixed it fast, explained exactly what happened, no inflated emergency fee. Absolutely the best."
  Name: Sarah K.
  Detail: Homeowner, Evanston IL

Card 3:
  Stars: 5
  Quote: "We've used VOLTEX for three commercial builds now. Always on schedule, always permit-compliant. Their EV charger installations at our parking facility were flawless."
  Name: James P.
  Detail: Commercial Contractor
```

---

## Section 9 — Photo CTA Banner

```
Background: hsl(var(--surface))
Padding: py-0 (image-driven)
Position: relative, overflow hidden, min-height 380px

Full-bleed background photo:
  absolute inset-0, w-full h-full, object-cover, object-center
  [Media brief: image | residential electrical work — electrician routing cables through walls, clean modern new build interior, overhead lighting, professional equipment | any composition — gradient overlays handle legibility]

Overlays:
  1. bg-[hsl(var(--background)/0.82)] full cover
  2. linear-gradient(to right, hsl(var(--background)) 0%, transparent 50%, hsl(var(--background)) 100%)

Content (absolute inset-0, flex items-center justify-center, text-center, z-10):
  "READY TO GET STARTED?" label: hsl(var(--primary)), 0.62rem, tracking-[0.22em], mb-4
  H2: "Get a free quote today."
    font-size clamp(2.2rem, 4vw, 3.8rem), font-weight 900, white, letter-spacing -0.04em, mb-4
  Subtext: "Same-day response. Flat-rate pricing. No obligation."
    white/50, 0.9rem, font-weight 300, mb-10
  Two CTAs side by side:
    1. Primary: "Book an Electrician"
    2. Ghost: "(800) 559-2648"
```

---

## Section 10 — FAQ

```
Background: hsl(var(--background))
Padding: py-24 px-16

Two-column layout (grid-cols-2, gap-20):

LEFT — sticky heading:
  "FAQ" label: hsl(var(--primary)), 0.6rem, tracking-[0.24em], mb-3
  H2: "Common questions\nabout our work."
    font-size clamp(1.8rem, 3vw, 2.6rem), font-weight 900, white, letter-spacing -0.03em, line-height 1.1, mb-6
  Body: "Can't find your answer? Call us at (800) 559-2648 or send a message — we respond same day."
    white/45, 0.88rem, line-height 1.75

RIGHT — Accordion (7 questions):
  Each item:
    border-bottom border-[hsl(var(--border))]
    Question row: flex justify-between items-center, py-5, cursor-pointer
      - Q text: 0.92rem, font-weight 600, white
      - Chevron: Lucide ChevronDown, hsl(var(--primary)), rotate 0→180deg when open (transition-transform)
    Answer: AnimatePresence + motion.div
      initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
      transition={{ duration: 0.25, ease: 'easeInOut' }}
      - Text: 0.85rem, white/50, font-weight 300, line-height 1.75, pb-5

QUESTIONS:

Q1: How much does an electrical panel upgrade cost?
A: Panel upgrades typically range from $850 to $2,500 depending on amperage and complexity. A standard 200A upgrade with permit and inspection is $850–$1,200 for most homes. We provide exact flat-rate pricing after a free on-site assessment — no surprises.

Q2: Do you pull permits for electrical work?
A: Yes. All work that requires a permit — panel upgrades, new circuits, EV chargers — is filed and inspected by our team. Permit fees are included in our quote. We never skip inspections.

Q3: How fast can you respond to an emergency?
A: We aim for 60 minutes or less for emergency calls in our service area. We're available 24 hours a day, 7 days a week — including holidays. There is no after-hours surcharge.

Q4: Can you install a Level 2 EV charger at my home?
A: Yes. We install Level 2 (240V) hardwired chargers for all EV brands — Tesla, Rivian, Ford, GM, and more. The service includes assessment, installation, permit filing, and inspection. Typical timeline is 3–4 hours.

Q5: Are you licensed and insured?
A: VOLTEX holds a Master Electrician license and full liability insurance. All technicians are licensed journeymen or apprentices working under a licensed master electrician. License and insurance documentation are available on request.

Q6: What areas do you serve?
A: We serve the greater metro area including all surrounding suburbs within a 40-mile radius. Call us to confirm your location — we may be able to accommodate areas outside our standard zone.

Q7: Do you offer a warranty on your work?
A: All VOLTEX installations and repairs carry a 2-year workmanship warranty. If something we installed or repaired fails within that period due to our work, we return and fix it at no charge.
```

---

## Section 11 — Final CTA

```
Background: hsl(var(--primary))
Padding: py-20 px-16
Text-align: center
Position: relative, overflow hidden

Background decoration:
  Grid texture with dark lines (opposite of sections — use dark/primary-foreground lines at 4%):
  background-image: linear-gradient(hsl(var(--primary-foreground)/0.04) 1px, transparent 1px),
                    linear-gradient(90deg, hsl(var(--primary-foreground)/0.04) 1px, transparent 1px);
  background-size: 64px 64px;

Content (relative z-10):
  Label: "LET'S GET TO WORK" — dark/70, 0.62rem, tracking-[0.22em], mb-4
  H2: "Your electrical problem,\nsolved today."
    font-size clamp(2.4rem, 4.5vw, 4rem), font-weight 900, hsl(var(--primary-foreground)), letter-spacing -0.04em, line-height 1.0, mb-4
  Subtext: "Same-day service. Flat-rate pricing. 2-year warranty on every job."
    dark/60, 0.9rem, font-weight 400, mb-10

CTAs (flex justify-center gap-3):
  1. Dark fill button: "Book Now — It's Free" — bg hsl(var(--primary-foreground)) text hsl(var(--primary))
  2. Outline button: "(800) 559-2648"
```

---

## Section 12 — Footer

```
Background: hsl(var(--surface))
Border-top: 1px solid hsl(var(--border))
Padding: py-16 px-16

Grid (grid-cols-4, gap-12, mb-12):

Col 1 — Brand:
  Logo + VOLTEX (same as nav)
  Body: "Licensed master electricians serving homes and businesses since 2006. Available 24/7 for emergency calls."
    white/35, 0.82rem, font-weight 300, line-height 1.75, mt-4, max-w-[220px]
  Social icons row (mt-6): Twitter/X, Facebook, Instagram — circle ghost buttons

Col 2 — Services:
  "SERVICES" label (hsl(var(--primary)), tracking-[0.2em], 0.62rem, mb-5)
  Links (column gap-3, 0.82rem white/50 hover:white/90):
  Panel Upgrades · Lighting Installation · EV Charger Install · Outlet & Wiring · Emergency Repairs · Smart Home Wiring

Col 3 — Company:
  "COMPANY" label
  Links: About Us · Our Team · Reviews · Service Areas · Careers · Contact

Col 4 — Contact:
  "CONTACT" label
  Phone: "(800) 559-2648" — white, font-weight 700, 0.9rem
  Email: hello@voltex.com — white/50
  Address: 1440 N. Industrial Ave, Chicago, IL 60610
  Hours block (mt-4):
    Mon–Fri: 7am–8pm
    Sat–Sun: 8am–6pm
    Emergency: 24/7

Bottom bar (border-top hsl(var(--border)), pt-8, flex justify-between):
  "© 2025 VOLTEX Electrical. All rights reserved." — white/30, 0.75rem
  "Privacy Policy · Terms · Sitemap" — white/30, 0.75rem
```

---

## Animations Summary

```
Navbar:
  - Transparent → blur bg on scroll (useScrollY + motionValue threshold 80px)
  - Logo: initial opacity 0 scale 0.9, animate 1 scale 1, duration 0.4

Hero:
  - Badge: fade up, delay 0s, duration 0.4
  - H1 words: stagger 0.08s per word, blur+fade+slide, starting delay 0.2s
  - Body text: fade up, delay 0.5s
  - CTAs: fade up, delay 0.7s
  - Stats row: fade up, delay 0.9s
  - Photo: fade in + slight scale 0.95→1, delay 0.3s, duration 0.7s
  - Floating cards: fade up from y+16, delay 0.8s

All other sections:
  - motion.div whileInView, once:true, margin -80px
  - opacity 0→1, y 32→0, duration 0.6 easeOut
  - Service cards: stagger delay 0.05s per card (index * 0.05)
  - Stats counters: triggered on viewport entry

FAQ:
  - AnimatePresence on answer height
  - Chevron rotate transition-transform duration-250
```

---

## Responsive — Mobile Breakpoints

```
Navbar (< md):
  - Hamburger menu replacing nav links
  - Logo left, hamburger right

Hero (< md):
  - grid-cols-1 (stack)
  - Photo below text
  - H1 font-size 2.8rem
  - Stats row: grid-cols-3, smaller numbers

Emergency Strip (< md):
  - flex-col, text-center, gap-2

Services Grid (< md):
  - grid-cols-1

Why Choose Us (< md):
  - grid-cols-1, photo first

Process (< md):
  - grid-cols-2 (2×2), then grid-cols-1 on very small

Stats Bar (< md):
  - grid-cols-2

Testimonials (< md):
  - grid-cols-1

FAQ (< md):
  - grid-cols-1 (header above accordion)

Final CTA (< md):
  - flex-col CTAs
  - H2 font-size 2.2rem

Footer (< md):
  - grid-cols-2, then grid-cols-1 below sm
```

---

## Key Dependencies

```json
{
  "framer-motion": "^12.x",
  "lucide-react": "^0.400.x",
  "@radix-ui/react-accordion": "latest",
  "tailwindcss": "^3.x"
}
```

Icons used: Zap, Sun, Car, Plug, AlertTriangle, Wifi, PhoneCall, ClipboardCheck, Wrench, ShieldCheck, Check, ChevronDown, Star, Phone

---

## Quick Notes

- Brand name is **VOLTEX** — replace with client's business name before publishing.
- Phone **(800) 559-2648** and license **#EL-2031-IL** are placeholder — update before use.
- The ghost "24" watermark in the hero references 24/7 emergency availability — works well as a design element.
- All 6 service cards use a uniform dark background — the active/highlight card (Emergency Repairs) can be swapped to a yellow fill for visual variety if desired.
