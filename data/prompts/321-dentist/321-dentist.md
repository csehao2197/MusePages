Build a full single-page dental clinic website for **DENTORA** — modern, trustworthy, and conversion-focused. Dark photo hero with teal accent, Plus Jakarta Sans throughout, pill-shaped buttons, a 4-step progress bar, animated stat counters, and a service card grid. Feels premium and calm — a clinic that makes patients feel comfortable before they even walk through the door.

---

## Global Layout Rule — Centering

Every section's content must be wrapped in a centered container:
```jsx



  {/* section content */}



```
Never let content stretch full-width or sit flush to the left. The `max-w-[1200px]` and `mx-auto` must be on every section's inner wrapper. Narrow text blocks (FAQ, centered copy) use `max-w-3xl mx-auto`. On mobile, reduce to `px-6`.

---

## Tech Stack

```
React + Vite + TypeScript + Tailwind CSS + Framer Motion (motion/react) + shadcn/ui + lucide-react
```

---

## Design System — Colors

```css
:root {
  --background: 210 42% 5%;          /* deep dark navy #060C14 */
  --foreground: 0 0% 98%;            /* white */
  --surface-dark: 210 38% 8%;        /* slightly lighter dark #0A1520 */
  --surface-light: 213 25% 96%;      /* cool off-white #EEF2F7 */
  --primary: 180 91% 39%;            /* teal #0BB8B8 */
  --primary-light: 180 70% 95%;      /* pale teal tint #EBF9F9 */
  --primary-foreground: 0 0% 100%;
  --muted-foreground: 213 15% 55%;   /* cool grey #7A8BA0 */
  --border: 213 20% 90%;             /* light border #DDE4EE */
  --success: 142 71% 38%;            /* green checkmarks */
  --warning: 38 92% 50%;             /* star rating gold */
}
```

**Section rhythm:**
- Hero → dark (`--background`)
- Progress bar → white with border
- About/Stats → white
- Services → `--surface-light`
- Why Choose Us → white
- Team → `--surface-light`
- Process → `--surface-dark`
- Testimonials → white
- Photo CTA → full-bleed photo
- FAQ → `--surface-light`
- Final CTA → `--primary` (teal)
- Footer → `--surface-dark`

---

## Typography

**Import:**
```html
https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap
```

| Role | Font | Style |
|------|------|-------|
| H1 / hero | Plus Jakarta Sans | 800, letter-spacing -0.03em |
| H2 | Plus Jakarta Sans | 700–800, letter-spacing -0.02em |
| H3 / card titles | Plus Jakarta Sans | 700 |
| Sub-labels / overlines | Plus Jakarta Sans | 600, 0.62rem, tracking-[0.2em] uppercase |
| Body | Plus Jakarta Sans | 300–400, leading-relaxed |
| Buttons | Plus Jakarta Sans | 600–700, 0.82rem |
| Stats | Plus Jakarta Sans | 800, letter-spacing -0.035em |
| Nav | Plus Jakarta Sans | 400–600, 0.72rem |

---

## Button System

All buttons: `inline-flex items-center justify-center gap-2 shrink-0 whitespace-nowrap` with `border-radius: 100px`:

```jsx
// Primary — teal pill

  Book Appointment 

// Secondary — dark pill (on light sections)

  About Us


// Ghost — on dark/photo backgrounds

  Learn More


// Tag pill — service label (non-interactive)

  Dental Checkup

```

---

## Visual Effects

### 1. Hero photo gradient overlay
```css
/* Directional fade — text always legible from left */
background: linear-gradient(
  to right,
  rgba(6,12,20,0.95) 0%,
  rgba(6,12,20,0.80) 38%,
  rgba(6,12,20,0.45) 65%,
  rgba(6,12,20,0.15) 100%
);
/* Bottom fade into next section */
+ linear-gradient(to top, hsl(var(--background)) 0%, transparent 20%)
```

### 2. Staggered entrance animations (Framer Motion)
```jsx
const fadeUp = {
  hidden: { opacity: 0, y: 22, filter: 'blur(6px)' },
  visible: (i: number) => ({
    opacity: 1, y: 0, filter: 'blur(0px)',
    transition: { duration: 0.55, ease: 'easeOut', delay: i * 0.1 }
  })
}
// Usage: custom={index} variants={fadeUp} initial="hidden" animate/whileInView="visible" viewport={{ once: true }}
```

### 3. Animated stat counters
```
requestAnimationFrame — count 0 → target over 1,400ms
easing: cubic-bezier(0.25, 0.1, 0.25, 1)
IntersectionObserver: fires once when stats row enters viewport (threshold: 0.3)
```

### 4. Service card hover
```
translateY(-5px) + box-shadow: 0 20px 56px rgba(0,0,0,0.09)
transition: all 220ms ease-out
Inner photo: scale(1.05) on hover, overflow:hidden
```

### 5. Doctor card subtle lift
```
hover: translateY(-3px) + shadow-md
transition: 200ms ease-out
```

### 6. Progress step indicator
```
Active step: border-bottom: 2px solid hsl(var(--primary)) + text-[hsl(var(--foreground))]
Inactive: text-[hsl(var(--muted-foreground))]
Smooth left-to-right slide transition on step change: translate-x animation
```

---

## Component Breakdown

### 01 — Navbar

**Layout:** `position: absolute; top: 0; left: 0; right: 0; z-index: 30;` — transparent over hero. `padding: 22px 60px; display: flex; justify-content: space-between; align-items: center;`

**Left — Logo:**
- Small tooth icon in rounded box: `w-7 h-7 bg-white/15 border border-white/25 rounded-[7px]` + tooth SVG icon white
- Brand: `DENTORA` — Plus Jakarta Sans 700, `text-[0.95rem] tracking-[-0.01em]` white

**Center (desktop):** `Services · About Us · Testimonials · Contact`
- Plus Jakarta Sans 400, `text-[0.72rem]` white/70, `hover:text-white`, `gap-8`

**Right:**
- Phone: `(800) 559-2648` — Plus Jakarta Sans 500, `text-[0.72rem]` white/60
- `Book a Call` — primary teal pill button, `h-9 px-5 text-[0.72rem]`

**Mobile:** Hamburger → full-screen dark overlay menu

---

### 02 — Hero

**Layout:** `min-height: 90vh; position: relative; overflow: hidden; display: flex; align-items: flex-end;` — no max-width, full bleed

**Background photo:** `absolute inset-0 w-full h-full object-cover object-center z-0`
```jsx
{/* Image: dental patient close-up — woman smiling in dental chair, dentist's gloved hands with dental tools, bright clinic light, teal-tinted professional setting, high contrast, photorealistic */}

```

**Gradient overlay (2 layers):**
```jsx
{/* Left-to-right fade for text legibility */}



{/* Bottom fade into section below */}



```

**Content:** `relative z-10 max-w-[1200px] mx-auto px-[60px] w-full pb-14 pt-28`

- Badge pill: `inline-flex items-center gap-2 bg-[hsl(var(--primary))]/15 border border-[hsl(var(--primary))]/30 rounded-full px-4 py-1.5 mb-7`
  - Dot: `w-1.5 h-1.5 rounded-full bg-[hsl(var(--primary))]`
  - Text: Plus Jakarta Sans 600, `text-[0.62rem] tracking-[0.12em] text-[hsl(var(--primary))]`
  - Copy: `BEST DENTAL CARE · PORTLAND, OR`

- H1: Plus Jakarta Sans 800, `text-[clamp(3rem,5.5vw,5.5rem)] leading-[1.0] letter-spacing-[-0.03em] text-white max-w-[580px] mb-6`
  ```
  Experience
  Comfortable
  Dental Care.   ← last word or line in text-[hsl(var(--primary))]
  ```
  Word-by-word stagger animation (custom={index} on each word span)

- Subline: Plus Jakarta Sans 300, `text-[0.92rem] text-white/55 leading-[1.75] max-w-[380px] mb-10`
  "Your family's dental health, handled with care. Modern technology, gentle hands, and transparent pricing — always."

- CTA row: `flex gap-4 items-center mb-12`
  - `Book Appointment →` primary teal pill `h-12 px-8`
  - `Or Call: (800) 559-2648` — Plus Jakarta Sans 400 `text-[0.82rem] text-white/50`

- Service tag pills row: `flex flex-wrap gap-2.5`
  ```
  Dental Checkup · Teeth Cleaning · Tooth Whitening · Gum Treatment · Implants · Root Canal
  ```
  Each: `bg-white/8 border border-white/15 rounded-full px-4 py-2 text-[0.72rem] font-[500] text-white/65`

**Mobile:** H1 `text-[2.8rem]`, subline `max-w-full`, service tags wrap, CTA stacks vertically.

---

### 03 — Progress Steps Bar

**Layout:** `bg-white border-b border-[hsl(var(--border))] px-[60px]`

**Inner:** `max-w-[1200px] mx-auto grid grid-cols-4`

Each step: `py-5 px-6 border-r border-[hsl(var(--border))] last:border-r-0 cursor-pointer transition-colors`

- **Active step** (first one by default): `border-b-2 border-[hsl(var(--primary))]`
  - Text: Plus Jakarta Sans 600, `text-[0.7rem] text-[hsl(var(--foreground))] tracking-[0.06em]`
- **Inactive steps:** Plus Jakarta Sans 400, `text-[0.7rem] text-[hsl(var(--muted-foreground))]`

**Steps copy:**
1. `Smile Assessment`
2. `Care Planning`
3. `Treatment Process`
4. `Dental Maintenance`

**Click behavior:** clicking a step makes it active (state toggle). Animate `border-b` sliding across. No actual content switch needed — decorative interactive element.

---

### 04 — About / Stats

**Background:** white

**Padding:** `py-20 px-[60px]`

**Section label:** `ABOUT US` — Plus Jakarta Sans 600, `text-[0.62rem] tracking-[0.2em] text-[hsl(var(--primary))] uppercase mb-12`

**Large editorial statement:** `max-w-[760px] mb-14`
- Plus Jakarta Sans 700, `text-[clamp(1.6rem,3vw,2.8rem)] leading-[1.3] letter-spacing-[-0.02em] text-[hsl(var(--surface-dark))]`
- Key phrase in teal: wrap `personalized dental treatments` in `text-[hsl(var(--primary))]`
- Copy: `"We deliver personalized dental treatments with modern technology and gentle care ensuring healthy confident smiles for every patient."`

**Stats row:** `flex items-center gap-10 py-8 border-t border-b border-[hsl(var(--border))] mb-10`

- Left label: Plus Jakarta Sans 300, `text-[0.68rem] text-[hsl(var(--muted-foreground))] max-w-[130px] leading-[1.6]` — "Thousands trust us for smiles!"
- Stats (flex gap-12):
  ```
  98%   — Satisfaction Rate
  2k+   — Smiles Transformed
  4.9★  — Customer Rating  (★ in teal)
  ```
  Number: Plus Jakarta Sans 800, `text-[2.8rem] letter-spacing-[-0.03em] leading-[1]`
  Label: Plus Jakarta Sans 400, `text-[0.7rem] text-[hsl(var(--muted-foreground))] mt-1`
  Animated with stat counter on scroll

- Right (margin-left: auto): small clinic photo `w-[210px] h-[160px] rounded-2xl overflow-hidden object-cover`
```jsx
{/* Image: modern dental clinic interior — clean white exam room, dental chair, professional equipment, bright and welcoming */}

```

**Doctor profile card:** `flex items-center gap-4 mt-2`
```jsx
{/* Image: professional dentist portrait — male doctor in white coat, friendly smile, stethoscope, clinic background */}

```
- Name: Plus Jakarta Sans 700, `text-[0.9rem] text-[hsl(var(--surface-dark))]` — `Dr. Daniel Carter`
- Role: Plus Jakarta Sans 400, `text-[0.72rem] text-[hsl(var(--muted-foreground))] mt-1` — `Lead Dental Specialist · ★ 4.9 (40+ reviews)`

---

### 05 — Services Grid

**Background:** `bg-[hsl(var(--surface-light))]`

**Padding:** `py-24 px-[60px]`

**Header row:** `flex justify-between items-end mb-14`
- Left:
  - Label: `FEATURE TREATMENT` — Plus Jakarta Sans 600, `text-[0.62rem] tracking-[0.2em] text-[hsl(var(--primary))] uppercase mb-3`
  - H2: Plus Jakarta Sans 800, `text-[clamp(1.8rem,3vw,2.8rem)] letter-spacing-[-0.025em] leading-[1.2]`
    - `"Advanced Dental Care\nfor a Healthier Smile"`
- Right: `View All Services →` secondary pill button `h-10`

**Grid:** `grid grid-cols-3 gap-5`

6 service cards — `bg-white rounded-2xl overflow-hidden border border-[hsl(var(--border))] cursor-pointer`
- Hover: `translateY(-5px) shadow-[0_20px_56px_rgba(0,0,0,0.09)]` + inner photo scale(1.05)
- Photo: `h-[148px] overflow-hidden`
- Content: `p-5`
  - Price chip: `inline-flex bg-[hsl(var(--primary-light))] text-[hsl(var(--primary))] text-[0.65rem] font-semibold tracking-[0.08em] px-3 py-1 rounded-full mb-3`
  - Title: Plus Jakarta Sans 700, `text-[0.95rem] text-[hsl(var(--surface-dark))] mb-2`
  - Body: Plus Jakarta Sans 300, `text-[0.78rem] text-[hsl(var(--muted-foreground))] leading-[1.65]`
  - Link: `Learn more →` — Plus Jakarta Sans 600, `text-[0.78rem] text-[hsl(var(--primary))] mt-4 inline-flex items-center gap-1 group-hover:gap-2 transition-all`

**Cards:**

Card 1 — light blue photo bg:
```jsx
{/* Image: dental checkup — dentist examining patient's teeth with mirror and explorer tool, professional lighting, clean clinic */}
```
`"FROM $80"` / `"Dental Check-Up"` / `"Comprehensive examination of your teeth, gums, and jaw. Includes digital X-rays and a full treatment plan."`

Card 2 — soft teal photo bg:
```jsx
{/* Image: teeth cleaning procedure — ultrasonic scaler, close-up of clean teeth, professional hygiene appointment */}
```
`"FROM $120"` / `"Teeth Cleaning"` / `"Professional scaling and polishing to remove plaque, tartar, and surface stains for a healthier smile."`

Card 3 — warm photo bg:
```jsx
{/* Image: tooth whitening treatment — custom trays on teeth, before/after visible, bright clean result */}
```
`"FROM $299"` / `"Tooth Whitening"` / `"Professional in-office or at-home whitening to brighten your smile by up to 8 shades."`

Card 4 — coral/pink photo bg:
```jsx
{/* Image: dental implant model — titanium implant with crown, illustrated cross-section or dental table close-up */}
```
`"FROM $1,800"` / `"Dental Implants"` / `"Permanent, natural-looking replacements for missing teeth — surgically placed and built to last a lifetime."`

Card 5 — light grey photo bg:
```jsx
{/* Image: dental veneer application — ceramic veneer being placed on front tooth, close-up, transformation visible */}
```
`"FROM $650"` / `"Veneers & Crowns"` / `"Custom-crafted porcelain shells and crowns to restore shape, color, and strength to damaged teeth."`

Card 6 — dark urgent photo bg:
```jsx
{/* Image: emergency dental care — dentist treating patient urgently, focused close-up, caring and professional atmosphere */}
```
`"SAME DAY"` / `"Emergency Care"` / `"Same-day emergency appointments for toothaches, broken teeth, lost fillings, and dental pain. Call anytime."`

---

### 06 — Why Choose Us

**Background:** white

**Padding:** `py-24 px-[60px]`

**Layout:** `grid grid-cols-2 gap-20 items-center`

**Left — text:**
- Label: `WHY CHOOSE US` — teal uppercase tracking `mb-4`
- H2: Plus Jakarta Sans 800, `text-[clamp(1.8rem,3vw,2.8rem)] leading-[1.2] letter-spacing-[-0.02em] mb-4`
  `"Are you looking for a dentist to give you that special smile?"`
- Body: Plus Jakarta Sans 300, `text-[0.85rem] text-[hsl(var(--muted-foreground))] leading-[1.8] max-w-md mb-10`
  "Dentora Clinic provides the highest quality dental care in Los Angeles with a group of experienced dentists and specialists."
- Checklist: `grid grid-cols-2 gap-x-6 gap-y-3 mb-10`
  Each: `flex items-center gap-2`
  - CheckCircle `w-4 h-4 text-[hsl(var(--primary))]` + Plus Jakarta Sans 400 `text-[0.82rem] text-[hsl(var(--surface-dark))]`
  ```
  ✓ Dental check-ups          ✓ Root canal treatment
  ✓ Hygiene treatments        ✓ Dental implant restoration
  ✓ Crowns, veneers & bridges ✓ Professional tooth whitening
  ```
- `Meet Our Team →` secondary pill button `h-11`

**Right — photo:**
```jsx
{/* Image: dental team — two or three dentists and assistants in matching scrubs, standing together, smiling confidently, modern clinic background */}

```

---

### 07 — Process (How It Works)

**Background:** `bg-[hsl(var(--surface-dark))]` — dark navy

**Padding:** `py-24 px-[60px]`

**Header:** centered, `max-w-[560px] mx-auto text-center mb-16`
- Label: `HOW IT WORKS` — teal uppercase tracking
- H2: Plus Jakarta Sans 800, `text-[clamp(1.8rem,3vw,2.8rem)] letter-spacing-[-0.025em] text-white mt-3`
  `"Your journey to a healthier smile."`

**4-step grid:** `grid grid-cols-4 gap-5`

Each step card — `bg-white/[0.04] border border-white/[0.08] rounded-2xl p-6 relative`
- Step number: Plus Jakarta Sans 800, `text-[3rem] letter-spacing-[-0.04em] text-white/[0.07] leading-[1] mb-5`
- Step photo: `h-[130px] rounded-xl overflow-hidden mb-5`
- Badge + title row: `flex items-center gap-2.5 mb-3`
  - Number pill: `w-7 h-7 rounded-full bg-[hsl(var(--primary))] flex items-center justify-center text-white text-[0.65rem] font-bold shrink-0`
  - Title: Plus Jakarta Sans 700, `text-[0.88rem] text-white`
- Body: Plus Jakarta Sans 300, `text-[0.78rem] text-white/50 leading-relaxed`

```jsx
{/* Step 1 image: person booking appointment on smartphone or laptop at home, casual and relaxed */}
{/* Step 2 image: dental hygienist welcoming patient at clinic reception, warm and professional */}
{/* Step 3 image: dentist showing X-ray or tablet results to patient, explaining clearly */}
{/* Step 4 image: happy patient leaving dental clinic, bright smile, thumbs up or waving goodbye */}
```

Steps:
1. `"01"` · **Book Online** · "Fill out our quick form or call us — we'll confirm your appointment within the hour."
2. `"02"` · **Welcome Visit** · "Arrive at your scheduled time, meet your dentist, and we'll go over your dental history."
3. `"03"` · **Smile Assessment** · "Digital X-rays, full examination, and a transparent care plan with pricing before we start."
4. `"04"` · **Treatment & Care** · "Treatment completed, results reviewed, aftercare explained. We follow up to make sure you're happy."

---

### 08 — Testimonials

**Background:** white

**Padding:** `py-24 px-[60px]`

**Header:** centered `text-center mb-14`
- Label: `PATIENT REVIEWS`
- H2: Plus Jakarta Sans 800, `text-[clamp(1.8rem,3vw,2.8rem)] letter-spacing-[-0.025em] mt-3`
  `"Don't take our word for it."`
- Subline: Plus Jakarta Sans 400, `text-[0.85rem] text-[hsl(var(--muted-foreground))] mt-2`
  `★★★★★  4.9 average from 1,200+ verified reviews`

**Grid:** `grid grid-cols-3 gap-6`

3 cards — `bg-[hsl(var(--surface-light))] rounded-2xl p-7 border border-[hsl(var(--border))]`
- Stars: `★★★★★` — Plus Jakarta Sans, `text-[hsl(var(--warning))] text-sm tracking-[2px] mb-4`
- Quote: Plus Jakarta Sans 400, `text-[0.92rem] leading-[1.75] text-[hsl(var(--surface-dark))]`
- Attribution: `flex items-center gap-3 mt-6`
  - Avatar photo `w-11 h-11 rounded-full object-cover`
  - Name: Plus Jakarta Sans 600, `text-[0.82rem]`
  - Source: Plus Jakarta Sans 300, `text-[0.68rem] text-[hsl(var(--muted-foreground))]` — `"Verified Google Review"`

```jsx
{/* Images: 3 patient portrait photos — diverse, friendly, smiling, casual photos, natural light */}
```

**Reviews:**
1. `"I've been going to Dentora for two years and I won't go anywhere else. They explained every step of my treatment clearly and I never felt pressured. Best dental experience I've had."` — Emily K. · Patient
2. `"As someone who used to dread the dentist, Dentora completely changed my experience. Painless, quick, and the results were incredible. My smile has never looked better."` — Marcus T. · Patient
3. `"Brought my whole family here after a recommendation. The team is patient and gentle with my kids, which means everything. We're Dentora patients for life."` — Sarah L. · Patient

---

### 09 — Full-Width Photo CTA Banner

**Layout:** Full bleed, `relative h-[300px] overflow-hidden flex items-center`

**Background photo:** `absolute inset-0 w-full h-full object-cover object-center z-0`
```jsx
{/* Image: happy dental patient with bright smile in dental chair, giving thumbs up, warm professional lighting, real and candid atmosphere */}

```

**Overlay:** `absolute inset-0 bg-gradient-to-r from-[rgba(6,12,20,0.90)] via-[rgba(6,12,20,0.65)] to-[rgba(6,12,20,0.15)] z-[1]`

**Content:** `relative z-10 max-w-[1200px] mx-auto px-[60px] w-full flex justify-between items-center flex-wrap gap-8`
- Left:
  - H2: Plus Jakarta Sans 800, `text-[clamp(1.8rem,3.5vw,3rem)] letter-spacing-[-0.025em] text-white`
    `"Ready for your best smile?"`
  - Body: Plus Jakarta Sans 300, `text-[0.88rem] text-white/60 mt-2`
    `"Same-day appointments available. No waiting lists."`
- Right: `flex gap-3 flex-wrap`
  - `Book Appointment` primary teal pill `h-12 px-9`
  - `(800) 559-2648` ghost pill `h-12 px-8` with Phone icon

---

### 10 — FAQ

**Background:** `bg-[hsl(var(--surface-light))]`

**Padding:** `py-24 px-[60px]`

**Content:** `max-w-3xl mx-auto`

**Header:** centered `text-center mb-12`
- Label: `FAQ`
- H2: Plus Jakarta Sans 800, `text-[clamp(1.8rem,3vw,2.8rem)] letter-spacing-[-0.025em] mt-3`
  `"Common questions, clear answers."`

**7 accordion items — AnimatePresence height animation:**
- `border-b border-[hsl(var(--border))] py-5`
- Question row: `flex justify-between items-center cursor-pointer gap-4`
  - Question: Plus Jakarta Sans 600, `text-[0.92rem] text-[hsl(var(--surface-dark))]`
  - ChevronDown: `w-5 h-5 text-[hsl(var(--primary))] transition-transform duration-200` — `rotate-180` when open
- Answer: Plus Jakarta Sans 300, `text-[0.82rem] text-[hsl(var(--muted-foreground))] leading-relaxed mt-3 pb-2`

**Q&As:**

Q1: `"Do you accept new patients?"`
A1: `"Yes — we're always welcoming new patients and their families. You can book online, call us, or simply walk in during opening hours. Same-day appointments are often available."`

Q2: `"Is dental treatment painful?"`
A2: `"We prioritize your comfort at every step. All treatments are performed with local anesthesia so you don't feel pain during the procedure. We also offer sedation options for anxious patients."`

Q3: `"How often should I come in for a check-up?"`
A3: `"We recommend a dental check-up and professional cleaning every 6 months. Some patients may benefit from more frequent visits — your dentist will advise based on your individual needs."`

Q4: `"Do you offer payment plans?"`
A4: `"Yes. We offer flexible monthly payment plans through our financing partners. Ask our team about 0% interest options on qualifying treatments over $300."`

Q5: `"What should I do in a dental emergency?"`
A5: `"Call our emergency line immediately — (800) 559-2648. We offer same-day emergency slots for toothaches, broken teeth, lost crowns, and dental trauma. Don't wait if you're in pain."`

Q6: `"Can children be patients at Dentora?"`
A6: `"Absolutely. We treat patients of all ages, including children from their first tooth onwards. Our team is experienced in making young patients feel comfortable and confident about dental care."`

Q7: `"How long do treatments take?"`
A7: `"It depends on the treatment. A standard check-up takes 45–60 minutes. Cleaning is 45 minutes. More complex procedures like implants or crowns involve multiple visits — your dentist will give you a full timeline at your consultation."`

---

### 11 — Final CTA

**Background:** `bg-[hsl(var(--primary))]` — solid teal

**Padding:** `py-20 px-[60px]`

**Content:** `max-w-2xl mx-auto text-center`
- H2: Plus Jakarta Sans 800, `text-[clamp(2rem,4vw,3.5rem)] letter-spacing-[-0.03em] text-white leading-tight`
  `"Your healthiest smile starts today."`
- Body: Plus Jakarta Sans 300, `text-[0.92rem] text-white/70 mt-5 leading-relaxed`
  `"Request a free consultation in under 2 minutes. Same-day appointments available. Transparent pricing, no surprises."`
- CTA row: `flex gap-4 justify-center flex-wrap mt-10`
  - `Book Free Consultation` — `bg-white text-[hsl(var(--primary))] rounded-full h-12 px-10 font-semibold hover:bg-white/90 transition-colors`
  - `(800) 559-2648` — `border border-white/35 text-white rounded-full h-12 px-8 font-[400] hover:bg-white/10 transition-colors` with Phone icon
- Trust line: `flex justify-center gap-8 flex-wrap mt-8`
  Plus Jakarta Sans 300 `text-[0.8rem] text-white/55`
  `"✓ No waiting list" · "✓ Transparent pricing" · "✓ All ages welcome"`

---

### 12 — Footer

**Background:** `bg-[hsl(var(--surface-dark))]` — dark navy

**Padding:** `py-16 px-[60px]`

**Grid:** `grid grid-cols-4 gap-12 mb-14`

Col 1 — Brand:
- Logo + `DENTORA` — Plus Jakarta Sans 800 `text-[1.1rem] text-white tracking-[-0.01em]`
- `"Your Family's Dental Clinic"` — Plus Jakarta Sans 300 `text-[0.7rem] text-white/40 tracking-[0.1em] mt-1`
- Phone: Plus Jakarta Sans 600, `text-sm text-white mt-5` — `(800) 559-2648`
- Email: `hello@dentoraclinic.com` — Plus Jakarta Sans 300, `text-sm text-white/50`

Col 2 — `SERVICES`:
- Label: Plus Jakarta Sans 600 `text-[0.6rem] tracking-[0.2em] uppercase text-white/30 mb-5`
- Links: Dental Check-Up · Teeth Cleaning · Whitening · Implants · Veneers · Emergency Care
- Plus Jakarta Sans 400 `text-sm text-white/55 hover:text-white block mb-3`

Col 3 — `CLINIC`:
- About Us · Meet the Team · Patient Reviews · Blog · Careers
- Same link style

Col 4 — `HOURS`:
- Label: `OPENING HOURS`
- `Mon – Fri: 8:00am – 7:00pm`
- `Saturday: 9:00am – 5:00pm`
- `Sunday: Emergency only`
- `24/7 Emergency: (800) 559-2648` — `text-white/70 mt-2`
- Social row: `flex gap-5 mt-5` — Facebook · Instagram · Google · Yelp icons `text-white/30 hover:text-white`

**Bottom bar:** `pt-8 border-t border-white/10 flex justify-between items-center flex-wrap gap-4`
- `© 2026 Dentora Dental Clinic. All rights reserved.` — Plus Jakarta Sans 300 `text-xs text-white/30`
- `Privacy Policy · Terms of Service` — same style `hover:text-white/60`

---

## Animations

```
Navbar: no entrance animation — static absolute
Hero badge: fade-up, delay 0s, duration 0.4s
Hero H1 (word-by-word): custom={wordIndex} stagger 0.08s, blur-up
Hero subline: delay 0.5s, fade-up
Hero CTAs: delay 0.65s, fade-up
Hero service tags: delay 0.8s, fade-up as group

Progress bar: static — click to animate active step indicator

Stats counters: IntersectionObserver (once, threshold 0.3)
  Count 0→target, 1400ms cubic-bezier(0.25,0.1,0.25,1)

Service cards: IntersectionObserver stagger 0.08s each
  Hover: translateY(-5px) + shadow + inner photo scale(1.05)

Why Choose Us: left text fade-up, right photo fade-up, delay 0.15s each

Process steps: stagger 0.1s, fade-up from y:20

Testimonials: stagger 0.1s, fade-up

FAQ accordion: AnimatePresence height expand
  Question click → open: height 0 → auto, opacity 0 → 1, 220ms easeOut
  ChevronDown: rotate(0) → rotate(-180deg) on open

Final CTA: fade-up on scroll entry, H2 then subtext then buttons
```

---

## Responsive

```
Desktop (lg+): all as specified
Tablet (md–lg):
  Hero: same layout, smaller type
  About/Stats: stats row wraps
  Services: grid-cols-2 (3×2)
  Why Choose Us: grid-cols-2, smaller gap
  Process: grid-cols-2
  Footer: grid-cols-2

Mobile (< md):
  Navbar: logo left, hamburger right → dark overlay menu
  Hero: min-h-[80vh], type smaller (clamp bottom value)
    service tags: 3 visible, +N more indicator
  Progress bar: horizontal scroll, 2 visible at once
  About: stats wrap to 2-column grid
  Services: grid-cols-1
  Why Choose Us: single column, photo below
  Process: grid-cols-1
  Testimonials: single column
  Photo CTA: stacked, text then button
  FAQ: full width
  Footer: grid-cols-1 stacked
  Padding everywhere: px-6
```

---

## All Copy

**Brand:** DENTORA — Your Family's Dental Clinic

**Nav:** `Services · About Us · Testimonials · Contact`
**Phone:** `(800) 559-2648` · **Email:** `hello@dentoraclinic.com`

**Hero:**
- Badge: `BEST DENTAL CARE · PORTLAND, OR`
- H1: `Experience Comfortable Dental Care.`
- Subline: `Your family's dental health, handled with care. Modern technology, gentle hands, and transparent pricing — always.`
- CTAs: `Book Appointment →` · `Or Call: (800) 559-2648`
- Service tags: `Dental Checkup · Teeth Cleaning · Tooth Whitening · Gum Treatment · Implants · Root Canal`

**Progress bar:** `Smile Assessment · Care Planning · Treatment Process · Dental Maintenance`

**About:**
- Label: `ABOUT US`
- Statement: `"We deliver personalized dental treatments with modern technology and gentle care ensuring healthy confident smiles for every patient."`
- Stats: `98% Satisfaction Rate · 2k+ Smiles Transformed · 4.9★ Customer Rating`
- Doctor: `Dr. Daniel Carter — Lead Dental Specialist · ★ 4.9 (40+ reviews)`

**Services:**
- Label: `FEATURE TREATMENT`
- H2: `Advanced Dental Care for a Healthier Smile`
- Cards: Dental Check-Up ($80+) · Teeth Cleaning ($120+) · Tooth Whitening ($299+) · Dental Implants ($1,800+) · Veneers & Crowns ($650+) · Emergency Care (Same Day)

**Why Choose Us:**
- Label: `WHY CHOOSE US`
- H2: `Are you looking for a dentist to give you that special smile?`
- Checklist: Dental check-ups · Hygiene treatments · Crowns, veneers & bridges · Root canal treatment · Dental implant restoration · Professional tooth whitening
- CTA: `Meet Our Team →`

**Process:** `Your journey to a healthier smile.`
- Book Online · Welcome Visit · Smile Assessment · Treatment & Care

**Testimonials:** `Don't take our word for it. · ★★★★★ 4.9 from 1,200+ verified reviews`

**Photo CTA:** `Ready for your best smile?` / `Same-day appointments available. No waiting lists.`

**FAQ:** `Common questions, clear answers.` — 7 Q&As (see component breakdown)

**Final CTA:** `Your healthiest smile starts today.` / trust line: `No waiting list · Transparent pricing · All ages welcome`

**Footer:**
- `DENTORA · Your Family's Dental Clinic`
- `© 2026 Dentora Dental Clinic. All rights reserved.`
- Hours: Mon–Fri 8am–7pm · Sat 9am–5pm · Emergency 24/7

---

## Key Dependencies

```json
{
  "motion": "^12.x",
  "lucide-react": "^0.469.0",
  "@radix-ui/react-collapsible": "latest"
}
```

---

## Quick Notes

- **Progress steps bar** (section 03) is a decorative interactive element — clicking changes the active step visually but doesn't need to load separate content. It signals a structured patient journey, which builds trust.
- **Stat counters** need IntersectionObserver — only trigger once when the stats row enters the viewport, not on every scroll pass.
- **Service cards** use `overflow-hidden` on the photo container + separate `scale` on the inner `<img>` for the parallax hover — do not scale the card itself.
- **Teal color** `hsl(180 91% 39%)` = `#0BB8B8` — used consistently for all primary actions, labels, and accents. No blue anywhere.
- **Photo CTA banner** (section 09) uses left-to-right gradient so text stays readable regardless of what the photo looks like — do not rely on "empty space" in the image.
