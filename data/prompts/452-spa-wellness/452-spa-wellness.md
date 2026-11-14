# Spa & Wellness Website — SEREN

Build a luxury spa and wellness center website called "SEREN" — warm cream background, terracotta accent (#B5694A), Cormorant Garamond serif italic display typography mixed with Inter. Airy, feminine, premium. Oval-cropped service images, split-layout sections, and a tabbed booking/pricing section. Inspired by high-end Russian wellness clinics and European day spas.

---

## Tech Stack

```
React + Vite + TypeScript + Tailwind CSS + Framer Motion (motion/react) + lucide-react
```

---

## Design System

```css
:root {
  --background: 36 40% 97%;         /* warm cream #FAF8F5 */
  --foreground: 20 35% 11%;         /* deep warm brown #231710 */
  --primary: 18 43% 50%;            /* terracotta #B5694A */
  --primary-foreground: 36 40% 97%;
  --muted: 32 30% 91%;              /* warm sand #F0EBE3 */
  --muted-foreground: 20 12% 49%;   /* warm taupe #8A7A72 */
  --border: 25 20% 87%;             /* soft warm border #E5DDD5 */
  --card: 36 35% 95%;
}
```

---

## Typography

```html
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500;1,600&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
```

- **Display headings**: Cormorant Garamond — mix regular + italic within same heading for editorial contrast
- **Section headings**: Cormorant Garamond 600, not italic
- **Body / UI / labels**: Inter 400–500
- **Accent labels**: Inter 500, uppercase, tracking-[0.18em], text-xs, text-primary

**Heading mix pattern** (key visual signature of this design):
```tsx
// Regular word + italic word in same line — creates editorial luxury feel
<h2 className="font-['Cormorant_Garamond'] text-5xl leading-tight">
  Philosophy of{" "}
  <em className="italic font-light">perfection</em>
</h2>
```

---

## Button System — Apply to every button, no exceptions

```tsx
// Small — navbar, links
className="h-10 px-6 rounded-full inline-flex items-center justify-center gap-2 shrink-0 whitespace-nowrap text-sm font-medium transition-all duration-200"

// Default CTA — section buttons
className="h-12 px-8 rounded-full inline-flex items-center justify-center gap-2 shrink-0 whitespace-nowrap text-sm font-medium transition-all duration-200"

// Large CTA — hero, booking
className="h-13 px-10 rounded-full inline-flex items-center justify-center gap-2 shrink-0 whitespace-nowrap text-base font-medium transition-all duration-200"
```

Note: use `rounded-full` throughout — pill buttons suit the spa aesthetic. Never `rounded-xl` or `rounded-lg` in this design.
- Always explicit `h-{n}` height — never rely on padding alone
- Always `inline-flex items-center justify-center`
- Always `shrink-0 whitespace-nowrap`
- Icons: `w-4 h-4 shrink-0`

---

## Visual Effects

### 1. Oval image treatment — services section signature

```tsx
// Portrait oval: aspect-ratio 3/4, fully rounded
<div className="w-[200px] aspect-[3/4] rounded-[50%] overflow-hidden shrink-0">
  <img src="" alt="..." className="w-full h-full object-cover object-center" />
</div>

// Landscape oval: aspect-ratio 4/3, fully rounded
<div className="w-[260px] aspect-[4/3] rounded-[50%] overflow-hidden shrink-0">
  <img src="" alt="..." className="w-full h-full object-cover object-center" />
</div>
```

### 2. Staggered fade-up (Framer Motion)

```tsx
initial={{ opacity: 0, y: 24 }}
whileInView={{ opacity: 1, y: 0 }}
transition={{ duration: 0.6, ease: "easeOut", delay: index * 0.1 }}
viewport={{ once: true, margin: "-60px" }}
```

### 3. Horizontal services scroll (desktop + mobile)

```tsx
// Scrollable row of oval-cropped service images
// Desktop: overflow-x-auto, snap-x snap-mandatory, scrollbar hidden
// Mobile: same behavior, touch-pan-x
<div className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-4 scrollbar-hide">
  {services.map(s => (
    <div key={s} className="flex flex-col items-center gap-4 shrink-0 snap-start">
      {/* oval image */}
      {/* service name label below */}
    </div>
  ))}
</div>
```

### 4. Warm gradient hero overlay

```tsx
// On hero image — warm cream fades in from bottom, not black
<div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[hsl(var(--background))]" />
<div className="absolute inset-0 bg-gradient-to-r from-[hsl(var(--background))/80] to-transparent" />
```

### 5. Tabbed pricing section

```tsx
// Three tabs: Silver | Diamond | Gold
// Active tab: bottom border-b-2 border-primary, text-foreground
// Inactive: text-muted-foreground, hover:text-foreground
// Tab content animates: opacity 0 → 1, y 8 → 0 on tab switch, duration 0.3s
const [activeTab, setActiveTab] = useState("Diamond")
```

---

## Component Breakdown

### 1 — Navbar

- Fixed top, h-[64px], z-50, bg-[hsl(var(--background))]/90 backdrop-blur-md
- Border-bottom: 1px solid hsl(var(--border))
- max-w-[1120px] mx-auto px-6, flex justify-between items-center
- Left: `<span className="font-['Cormorant_Garamond'] text-xl font-semibold italic tracking-wide text-[hsl(var(--foreground))]">Seren.</span>`
- Center (desktop): nav links `text-sm font-medium text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors` — "Home · Services · Specialists · Blog · Wellness · Contact"
- Right:
  ```tsx
  <button className="h-10 px-6 rounded-full inline-flex items-center justify-center gap-2 shrink-0 whitespace-nowrap bg-[hsl(var(--primary))] text-white text-sm font-medium hover:opacity-90 transition-opacity">
    Book Now
  </button>
  ```
- Mobile: logo left + Book Now button right, center nav hidden

---

### 2 — Hero

- `min-h-[90vh] relative flex items-center overflow-hidden`

```tsx
{/* Image: woman receiving luxury facial treatment in elegant spa, warm golden light, cream and beige tones, soft focus background, serene expression, professional wellness photography */}
<img
  src=""
  alt="Luxury spa facial treatment"
  className="absolute inset-0 w-full h-full object-cover object-center"
/>
{/* Warm overlay — cream from bottom, soft left panel */}
<div className="absolute inset-0 bg-gradient-to-b from-transparent via-[hsl(36,40%,97%,0.1)] to-[hsl(var(--background))]" />
<div className="absolute inset-0 bg-gradient-to-r from-[hsl(var(--background))/85] via-[hsl(var(--background))/40] to-transparent" />
```

- Content: `relative z-10 max-w-[1120px] mx-auto px-6 w-full`
- Inner: `max-w-[560px]`

**Label:** `text-xs font-medium uppercase tracking-[0.2em] text-[hsl(var(--primary))] mb-6` — "Wellness Center & Clinic"

**H1:**
```tsx
<h1 className="font-['Cormorant_Garamond'] font-medium leading-[1.08] text-[hsl(var(--foreground))]"
    style={{ fontSize: "clamp(3rem, 6vw, 5.5rem)" }}>
  Center of complete<br />
  beauty, recovery<br />
  and <em className="italic font-light text-[hsl(var(--primary))]">rejuvenation.</em>
</h1>
```

**Sub:** `text-sm text-[hsl(var(--muted-foreground))] mt-6 leading-relaxed max-w-[380px]` — "We help you create a culture of care and a new approach to balance and genuine love for yourself."

**CTAs:** `flex gap-3 mt-9 flex-wrap`
```tsx
<button className="h-12 px-8 rounded-full inline-flex items-center justify-center gap-2 shrink-0 whitespace-nowrap bg-[hsl(var(--primary))] text-white text-sm font-medium hover:opacity-90 transition-opacity">
  Book a Session
</button>
<button className="h-12 px-8 rounded-full inline-flex items-center justify-center gap-2 shrink-0 whitespace-nowrap border border-[hsl(var(--border))] text-[hsl(var(--foreground))] text-sm font-medium hover:border-[hsl(var(--primary))] transition-colors">
  Our Services
</button>
```

**Small image grid** — floating bottom-right on desktop (hidden mobile):
```tsx
<div className="absolute bottom-8 right-8 grid grid-cols-2 gap-2 hidden md:grid">
  {/* 4 small oval images: massage hands, facial close-up, spa interior, skincare products */}
  {/* Each: w-24 h-28 rounded-[50%] overflow-hidden */}
  {[
    "close-up of therapist hands performing back massage, warm spa lighting, soft focus",
    "woman relaxing during facial treatment, cucumber on eyes, white towel, serene spa",
    "luxury spa interior with candles, stone basins, warm amber lighting, zen atmosphere",
    "premium skincare products arranged on marble surface, cream and gold packaging"
  ].map((desc, i) => (
    <div key={i} className="w-24 h-28 rounded-[50%] overflow-hidden border-2 border-[hsl(var(--background))]">
      {/* Image: {desc} */}
      <img src="" alt="Spa detail" className="w-full h-full object-cover object-center" />
    </div>
  ))}
</div>
```

---

### 3 — About / Philosophy

- `py-24 md:py-32 bg-[hsl(var(--background))]`
- max-w-[1120px] mx-auto px-6
- `grid grid-cols-1 md:grid-cols-2 gap-16 items-center`

**Left — text:**
- Label: `text-xs font-medium uppercase tracking-[0.2em] text-[hsl(var(--primary))] mb-5` — "About Us"
- H2:
  ```tsx
  <h2 className="font-['Cormorant_Garamond'] font-medium leading-tight text-[hsl(var(--foreground))]"
      style={{ fontSize: "clamp(2.4rem,4vw,3.8rem)" }}>
    Philosophy of perfection<br />
    and a new approach to the{" "}
    <em className="italic font-light">balance of life</em>
  </h2>
  ```
- Body: `text-sm text-[hsl(var(--muted-foreground))] leading-relaxed mt-6` — "We help create a culture of care and a new approach to balance — and genuine love for yourself. Each visit is a step toward the best version of you."
- CTA:
  ```tsx
  <button className="mt-8 h-12 px-8 rounded-full inline-flex items-center justify-center gap-2 shrink-0 whitespace-nowrap border border-[hsl(var(--primary))] text-[hsl(var(--primary))] text-sm font-medium hover:bg-[hsl(var(--primary))] hover:text-white transition-all">
    Book a Session
  </button>
  ```

**Right — 4 feature rows:**
```tsx
<div className="flex flex-col gap-5">
  {features.map((f, i) => (
    <div key={i} className="flex gap-4 p-4 rounded-2xl bg-[hsl(var(--muted))] border border-[hsl(var(--border))]">
      {/* small oval image */}
      <div className="w-14 h-16 rounded-[50%] overflow-hidden shrink-0">
        <img src="" alt={f.title} className="w-full h-full object-cover object-center" />
      </div>
      <div>
        <p className="text-sm font-semibold text-[hsl(var(--foreground))] mb-1">{f.title}</p>
        <p className="text-xs text-[hsl(var(--muted-foreground))] leading-relaxed">{f.body}</p>
      </div>
    </div>
  ))}
</div>
```

Feature rows data (4 items):

| Title | Body | Image brief |
|---|---|---|
| Signature & Personalized Method | Correction methodology HN Maros | therapist applying facial serum, close-up skilled hands, warm spa lighting |
| Wide Range of Procedures | Over 60 unique aesthetic and medical procedures | range of professional beauty tools on white marble, organized, clean |
| Innovative Equipment | Premium European medical grade equipment | modern spa treatment device, clinical aesthetic, clean white tones |
| Premium Cosmetology | Linda Kristel, Thalasso, Ren, JULIETTE ARMAND | luxury skincare brand products, elegant bottles, warm cream tones |

---

### 4 — Services

- `py-24 md:py-32 bg-[hsl(var(--muted))]`
- max-w-[1120px] mx-auto px-6
- Label + H2 left-aligned:
  - Label: "Our Services"
  - H2: `font-['Cormorant_Garamond'] font-medium text-4xl md:text-5xl` — `Our top <em className="italic font-light">services</em>`
- Top-right: `<button className="h-10 px-6 rounded-full inline-flex items-center justify-center gap-2 shrink-0 whitespace-nowrap border border-[hsl(var(--border))] text-sm font-medium hover:border-[hsl(var(--primary))] transition-colors">All services</button>`
- Horizontal scroll row — `mt-12 flex gap-8 overflow-x-auto snap-x snap-mandatory pb-4 scrollbar-hide`

Each service item: `flex flex-col items-center gap-3 shrink-0 snap-start cursor-pointer group`
- Oval image: `w-[190px] h-[240px] rounded-[50%] overflow-hidden group-hover:opacity-90 transition-opacity`
- Label: `text-sm font-medium text-[hsl(var(--foreground))] text-center`

Services (8 items):

| Name | Image brief |
|---|---|
| Facials | woman receiving facial massage, eyes closed, serene, white spa towel, soft warm lighting |
| Swedish Massage | therapist performing back massage, hotel spa setting, warm amber candles |
| Body Scrubs | body scrub treatment hands on back, exfoliation, warm spa, natural textures |
| Manicure | close-up elegant manicure hands, neutral nails, clean spa aesthetic |
| Injectable Cosmetology | clinical aesthetic treatment close-up, professional medical spa setting |
| Yoga & Pilates | woman in elegant yoga pose, studio with natural light, white and wood tones |
| IV Therapy | wellness drip therapy, clean clinical spa setting, soft light |
| Diagnostics | wellness consultation, professional spa clinic, calm and organized space |

---

### 5 — Team / Specialists

- `py-24 md:py-32 bg-[hsl(var(--background))]`
- max-w-[1120px] mx-auto px-6
- Header row: `flex justify-between items-end mb-12`
  - H2: `font-['Cormorant_Garamond'] font-medium text-4xl md:text-5xl` — `Team of leading <em className="italic font-light">professionals</em>`
  - Arrow buttons: `flex gap-2` — two `<button>` each `w-10 h-10 rounded-full inline-flex items-center justify-center border border-[hsl(var(--border))] hover:border-[hsl(var(--primary))] transition-colors shrink-0`
    - lucide `ChevronLeft` and `ChevronRight`, `w-4 h-4`
- Horizontal scroll: `flex gap-6 overflow-x-auto scrollbar-hide pb-2`

Specialist card: `shrink-0 w-[200px]`
- Portrait photo: `w-full h-[260px] rounded-2xl overflow-hidden mb-3`
  ```tsx
  {/* Image: professional female spa therapist, white uniform, warm neutral studio background, clean portrait photography */}
  <img src="" alt="Spa specialist" className="w-full h-full object-cover object-center" />
  ```
- Name: `text-sm font-semibold text-[hsl(var(--foreground))]`
- Role: `text-xs text-[hsl(var(--muted-foreground))] mt-0.5`

Specialists (6):

| Name | Role |
|---|---|
| Tatyana Merzaeva | Head Cosmetologist |
| Polina Voronova | Massage Therapist |
| Liliya Khusnutdinova | Yoga & Wellness Coach |
| Luiza Murzagalieva | Injectable Specialist |
| Oksana Timchenko | Aesthetic Nurse |
| Alina Saifulina | Beauty Therapist |

---

### 6 — Booking / Pricing

- `py-24 md:py-32 bg-[hsl(var(--muted))]`
- max-w-[1120px] mx-auto px-6 text-center
- H2: `font-['Cormorant_Garamond'] font-medium text-4xl md:text-5xl mb-12` — `Book an <em className="italic font-light">appointment</em>`
- Tabs row: `flex justify-center gap-8 border-b border-[hsl(var(--border))] mb-12`
  - Each tab: `pb-3 text-sm font-medium cursor-pointer transition-colors border-b-2 -mb-px`
  - Active: `border-[hsl(var(--primary))] text-[hsl(var(--foreground))]`
  - Inactive: `border-transparent text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]`
  - Tabs: "Silver" · "Diamond" · "Gold"
- Tab content: `grid grid-cols-1 md:grid-cols-2 gap-12 items-center text-left`

**Left — image:**
```tsx
<div className="rounded-[2rem] overflow-hidden h-[420px]">
  {/* Image: luxury spa interior with arched doorway, indoor pool, candles, natural stone, warm atmospheric lighting */}
  <img src="" alt="Luxury spa interior" className="w-full h-full object-cover object-center" />
</div>
```

**Right — package info:**
- Package name: `font-['Cormorant_Garamond'] font-semibold text-3xl text-[hsl(var(--foreground))] mb-4`
- Description: `text-sm text-[hsl(var(--muted-foreground))] leading-relaxed mb-6`
- Checklist: `flex flex-col gap-3 mb-8`
  - Each item: `flex items-center gap-2 text-sm text-[hsl(var(--foreground))]`
  - lucide `CircleCheck` `w-4 h-4 text-[hsl(var(--primary))] shrink-0`
- Price: `font-['Cormorant_Garamond'] font-semibold text-4xl text-[hsl(var(--foreground))] mb-6`
- CTA:
  ```tsx
  <button className="h-12 px-8 rounded-full inline-flex items-center justify-center gap-2 shrink-0 whitespace-nowrap bg-[hsl(var(--primary))] text-white text-sm font-medium hover:opacity-90 transition-opacity">
    Reserve
  </button>
  ```

Packages:

| Tab | Description | Features | Price |
|---|---|---|---|
| Silver | A curated selection of our most loved treatments — perfect for a first visit or a regular wellness ritual. | Essential relaxation · Choice of 2 treatments · Refreshments included | $149.99 |
| Diamond | Our signature full-day experience. A complete wellness journey from arrival to departure, fully personalized. | Comprehensive wellness · Luxury and exclusivity · Access to exclusive amenities | $325.99 |
| Gold | The ultimate SEREN experience — every treatment, every amenity, every moment crafted around you. | All Diamond features · Private suite access · Personal therapist for the day | $580.00 |

---

### 7 — Testimonials

- `py-24 md:py-32 bg-[hsl(var(--background))]`
- max-w-[1120px] mx-auto px-6
- H2: `font-['Cormorant_Garamond'] font-medium text-4xl md:text-5xl mb-3` — `They trust us with what <em className="italic font-light">matters most</em>`
- Horizontal scroll: `flex gap-6 mt-12 overflow-x-auto scrollbar-hide pb-2`

Testimonial card: `shrink-0 w-[360px] p-6 rounded-2xl bg-[hsl(var(--muted))] border border-[hsl(var(--border))]`
- Author row top: `flex items-center gap-3 mb-4`
  - Avatar: `w-10 h-10 rounded-full overflow-hidden shrink-0`
    ```tsx
    {/* Image: smiling woman portrait, warm natural light, clean background, friendly spa client */}
    <img src="" alt="Client" className="w-full h-full object-cover object-center" />
    ```
  - Name: `text-sm font-semibold text-[hsl(var(--foreground))]` + date `text-xs text-[hsl(var(--muted-foreground))]`
- Quote: `text-sm text-[hsl(var(--foreground))] leading-relaxed`
- "Read more": `text-xs font-medium text-[hsl(var(--primary))] mt-4 inline-flex items-center gap-1 hover:gap-2 transition-all`

| Author | Date | Quote |
|---|---|---|
| Diana | 26.11.2021 | The result from 70 to 54 — from 21 January. Diana came to us at Irina Maros for face correction. By that moment she had already tried many procedures. Diana's results are the results that prove: our approach works. |
| Kristina | 15.03.2022 | I want to thank the team for the care and attention. You literally changed my appearance. I always feel myself among the most professional staff. Highly recommend every detail — the atmosphere, service, and warmth. |
| Maria | 04.07.2023 | Four visits later I can say — this is the most honest professional care I've ever received. The results are visible and lasting. SEREN is not just a spa, it's a place where you feel genuinely seen. |

---

## Animations

```
Navbar: opacity 0 → 1, duration 0.4s
Hero label: opacity 0, y 12 → 0, delay 0.1s, duration 0.5s
Hero H1 (per line): delay 0.2s + index*0.12, duration 0.65s
Hero sub: delay 0.55s, duration 0.5s
Hero CTAs: delay 0.7s, y 16 → 0, opacity 0 → 1
Hero floating grid: opacity 0 → 1, x 20 → 0, delay 0.9s, duration 0.6s
About section: left text stagger 0.1s, right feature rows stagger 0.12s, both on scroll
Services row: clip-path reveal on section enter, then individual ovals fade-in stagger 0.08s
Team cards: horizontal stagger 0.07s per card, y 20 → 0
Pricing tabs: content opacity 0 → 1, y 8 → 0, duration 0.3s on tab change
Testimonials: horizontal stagger 0.09s per card, y 20 → 0
All sections: useInView once:true, margin "-60px"
```

---

## Responsive

```
Navbar: full links desktop → logo + Book Now button mobile
Hero: full layout desktop → stacked mobile, floating grid hidden mobile
Hero H1: clamp(3rem, 6vw, 5.5rem) auto-scales
Hero CTAs: flex-row desktop → flex-col w-full max-w-[280px] mx-auto mobile
About: 2-col desktop → 1-col mobile (text first, feature rows below)
Services scroll: same behavior desktop + mobile, touch-friendly
Team scroll: same behavior desktop + mobile
Pricing: 2-col desktop → 1-col mobile (image above content)
Testimonials scroll: same behavior, card w-[320px] mobile
```

---

## Full Copy

| Element | Copy |
|---|---|
| Brand | Seren. |
| Nav links | Home · Services · Specialists · Blog · Wellness · Contact |
| Nav CTA | Book Now |
| Hero label | Wellness Center & Clinic |
| Hero H1 | Center of complete beauty, recovery and rejuvenation. |
| Hero sub | We help you create a culture of care and a new approach to balance — and genuine love for yourself. |
| Hero CTA primary | Book a Session |
| Hero CTA secondary | Our Services |
| About label | About Us |
| About H2 | Philosophy of perfection and a new approach to the balance of life |
| About body | We help create a culture of care and a new approach to balance — and genuine love for yourself. Each visit is a step toward the best version of you. |
| Features | Signature & Personalized Method · Wide Range of Procedures · Innovative Equipment · Premium Cosmetology |
| Services label | Our Services |
| Services H2 | Our top services |
| Services list | Facials · Swedish Massage · Body Scrubs · Manicure · Injectable Cosmetology · Yoga & Pilates · IV Therapy · Diagnostics |
| Team H2 | Team of leading professionals |
| Pricing H2 | Book an appointment |
| Tabs | Silver · Diamond · Gold |
| Testimonials H2 | They trust us with what matters most |
| Footer copyright | © 2025 SEREN Wellness Center |

---

## Key Dependencies

```json
{
  "motion": "^12.x",
  "lucide-react": "^0.4xx"
}
```
