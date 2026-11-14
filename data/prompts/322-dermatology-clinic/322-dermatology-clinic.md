# Clearview Dermatology — Dermatology Clinic Website Prompt

## 1. Goal Statement
Build a calm, clinically credible dermatology website for **Clearview Dermatology**, defined by clinical white, a soft blue-green, and a clear structural split between medical dermatology and cosmetic treatments — so a patient with a suspicious mole and a patient booking filler both land in the right place within one scroll.

---

## 2. Tech Stack
```
React + Vite + TypeScript + Tailwind CSS + Framer Motion (motion/react) + shadcn/ui + lucide-react
```

---

## 3. Design System — Colors

```css
:root {
  --background: hsl(0, 0%, 100%);
  --foreground: hsl(200, 20%, 16%);       /* #212e33 */
  --primary: hsl(186, 44%, 34%);          /* #30797d blue-green */
  --primary-foreground: hsl(0, 0%, 100%);
  --muted-foreground: hsl(200, 8%, 47%);
  --border: hsl(195, 18%, 90%);
  --card: hsl(190, 34%, 97%);             /* faint clinical wash */
  --medical: hsl(200, 52%, 38%);          /* medical-side accent */
  --cosmetic: hsl(338, 34%, 56%);         /* cosmetic-side accent */
}
```

---

## 4. Typography

```html
<link href="https://fonts.googleapis.com/css2?family=Newsreader:opsz,wght@6..72,400;6..72,500&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet" />
```

- **H1 / hero:** `'Newsreader', serif;` weight 400, clamp(36px, 4.6vw, 62px), line-height: 1.12
- **H2:** Newsreader 400, 30–42px
- **H3 / treatment names:** Inter 600, 17–20px
- **Body:** Inter 300–400, 17px, line-height: 1.78
- **Eyebrows:** Inter 600, uppercase, letter-spacing: 0.16em, 11px
- **Credentials / small print:** Inter 400, 13px, muted

---

## 5. Visual Effects

### Effect 1 — Medical / Cosmetic Path Toggle
```tsx
const [track, setTrack] = useState<'medical' | 'cosmetic'>('medical');

<div className="inline-flex rounded-full border border-[var(--border)] p-1 bg-white">
  {(['medical','cosmetic'] as const).map(t => (
    <button
      key={t}
      onClick={() => setTrack(t)}
      className="relative rounded-full px-6 py-2.5 text-sm font-medium capitalize transition-colors duration-200"
      style={{ color: track === t ? '#fff' : 'var(--muted-foreground)' }}
    >
      {track === t && (
        <motion.span
          layoutId="track-pill"
          className="absolute inset-0 rounded-full"
          style={{ background: t === 'medical' ? 'var(--medical)' : 'var(--cosmetic)' }}
          transition={{ type: 'spring', stiffness: 380, damping: 32 }}
        />
      )}
      <span className="relative z-10">{t} dermatology</span>
    </button>
  ))}
</div>
{/* Treatment grid below swaps with AnimatePresence keyed on `track` */}
```

### Effect 2 — Treatment Card with Expandable Detail
```tsx
<div className="rounded-xl border border-[var(--border)] p-6 transition-shadow duration-300 hover:shadow-[0_8px_30px_rgba(33,46,51,0.07)]">
  <div className="flex items-start justify-between gap-4">
    <h3 className="font-semibold text-lg">Skin Cancer Screening</h3>
    <span className="shrink-0 rounded-full px-3 py-1 text-[11px] uppercase tracking-wider" style={{ background: 'var(--card)', color: 'var(--medical)' }}>
      Covered by insurance
    </span>
  </div>
  <p className="mt-3 text-[var(--muted-foreground)]">Full-body examination with dermoscopy…</p>
  <button className="mt-4 text-sm font-medium" style={{ color: 'var(--primary)' }}>
    What to expect ↓
  </button>
  {/* Expanded panel: height auto, 0.35s, lists duration, prep, downtime */}
</div>
```

### Effect 3 — Soft Clinical Fade-Up (no blur — clinical sites should feel stable)
```
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.6, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
```

---

## 6. Component Breakdown

### Section 1 — Navbar
- 76px, `sticky top-0 z-40`, white, 1px bottom border, subtle shadow after `scrollY > 40`
- Left: simple blue-green circular mark + "CLEARVIEW" (Newsreader 500) + "DERMATOLOGY" (Inter 600, 9px)
- Center: Medical · Cosmetic · Our Providers · Patient Info · Locations
- Right: phone number (Inter 600, blue-green) + `Book Appointment` (blue-green filled, rounded-full)
- Mobile: mark + phone icon + hamburger

### Section 2 — Hero (Split, Text Left)
- `min-h-[78vh]`, 12-col: text cols 1–6, image cols 7–12
- Eyebrow: `SEATTLE, WA · BOARD-CERTIFIED DERMATOLOGY · ACCEPTING NEW PATIENTS`
- H1: `Expert skin care,\nwithout the\nsix-month wait.`
- Subline: `Medical and cosmetic dermatology for adults and children. Most new patients are seen within two weeks, and urgent lesion checks within five days.`
- CTA row: `Book Appointment` (filled) + `Call (206) 555-0143` (outline)
- Trust strip: `Board-Certified` · `Most Insurance Accepted` · `Same-Week Urgent Slots` · `4.9 ★ from 800+ reviews`
```jsx
{/* Image: bright modern dermatology clinic interior, clean white and pale wood surfaces, soft natural window light, calm and uncluttered medical environment */}
<img src="" alt="Dermatology clinic interior" className="w-full h-full object-cover object-center rounded-l-3xl" />
```

### Section 3 — Urgent Notice Bar
- `--card` background, thin, centred: icon + `Concerned about a changing mole or spot? Call us — we hold same-week slots for urgent lesion checks.` + inline phone link

### Section 4 — Two Tracks
- White, centred, eyebrow `WHAT WE TREAT` + H2 `Two Kinds of Visits`
- **Path toggle** (Effect 1) centred beneath the heading
- Below toggle: 3-col grid of treatment cards (Effect 2) that swaps content between medical and cosmetic
- Medical cards carry an `Insurance` badge; cosmetic cards carry a `Self-pay` badge with a starting price

### Section 5 — Conditions We Treat
- `--card`, eyebrow `CONDITIONS` + H2 `Common Reasons Patients Come In`
- 4-col chip grid of 20 conditions as pill links (acne, eczema, psoriasis, rosacea, melanoma…)
- Each pill: white background, 1px border, hover fills blue-green

### Section 6 — Providers
- White, eyebrow `YOUR CARE TEAM` + H2 `Board-Certified Providers`
- 3-col grid
```jsx
{/* Image: physician portrait in white coat, warm approachable expression, soft neutral clinical background, professional medical photography */}
<img src="" alt="Board-certified dermatologist portrait" className="w-full aspect-[4/5] object-cover object-center rounded-2xl" />
```
- Each: name + credentials (MD, FAAD), specialty line in blue-green, 2-sentence bio, `Full profile →`

### Section 7 — What to Expect
- `--card`, 4-step horizontal timeline with connecting hairline
- Steps: Book · Before your visit · During the exam · After
- Each: numbered circle, title, 2-sentence description

### Section 8 — Insurance & Billing
- White, 2-col: left H2 `Insurance & Costs` + honest paragraph + list of accepted plans in two columns; right a bordered card with self-pay pricing notes and a `Request a cost estimate` button

### Section 9 — Patient Reviews
- `--card`, 3 review cards with 5-star row, quote, first name + last initial, and a small `Verified patient` line

### Section 10 — Locations
- White, 2-col: left two location cards (address, hours, parking note, phone, `Directions →`); right map image
```jsx
{/* Image: clean minimal city map view with two marked locations, muted palette, cartographic style */}
```

### Section 11 — FAQ
- Centred accordion, max-w-3xl, 6 questions

### Section 12 — Final CTA
- Blue-green full-bleed band: H2 `Get your skin looked at.` + short line + white CTA + phone

### Section 13 — Footer
- Deep slate, white text, 4 columns: brand + tagline / Medical / Cosmetic / Contact + locations
- Bottom strip: © line, Privacy Policy, Notice of Privacy Practices (HIPAA), Accessibility Statement
- Medical disclaimer: `This website is for general information only and does not constitute medical advice. If you are experiencing a medical emergency, call 911.`

---

## 7. Animations

- **Hero:** H1 fades up 0.7s; image reveals with a 1.1s `clipPath` wipe from the right; trust strip staggers 0.06s
- **Track toggle:** `layoutId` pill slides between options with a spring (stiffness 380, damping 32) and changes colour
- **Treatment grid:** `AnimatePresence mode="wait"` on track change, `opacity 0→1, y 12→0`, 0.32s
- **Treatment cards:** hover raises a soft shadow over 0.3s; expandable panel animates height auto over 0.35s
- **Condition pills:** stagger `i * 0.02`; hover fills background and inverts text, 0.2s
- **Provider cards:** fade-up stagger 0.1s
- **Timeline:** connecting hairline scales from left 0.8s, step circles pop `scale 0.8 → 1` staggered 0.12s
- All motion is deliberately calm — no parallax, no bounce, nothing that reads as playful on a medical site

---

## 8. Responsive

### Mobile (< 768px)
- Navbar: mark + tap-to-call phone icon + hamburger; `Book Appointment` pinned as a full-width sticky bar at the bottom of the viewport
- Hero: image moves above the text, `rounded-3xl`, `aspect-[4/3]`; H1 clamps to 36px; CTAs stacked
- Trust strip: 2x2 grid
- Track toggle: full-width, two equal halves
- Treatment cards: 1-col
- Condition pills: 2-col wrap
- Providers: 1-col
- Timeline: vertical with left-side connecting rule
- Insurance: plan list becomes a single column
- Locations: cards stack above map

### Tablet (768–1024px)
- Hero stays split · treatments 2-col · providers 2-col with third centred · conditions 3-col

### Desktop (> 1024px)
- Max width 1200px, `px-16`, `py-24` sections

---

## 9. Full Copy

### Brand
**CLEARVIEW DERMATOLOGY** — Seattle, Washington

### Navbar
Medical · Cosmetic · Our Providers · Patient Info · Locations · `(206) 555-0143` · [Button] Book Appointment

### Hero
- Eyebrow: `SEATTLE, WA · BOARD-CERTIFIED DERMATOLOGY · ACCEPTING NEW PATIENTS`
- H1: `Expert skin care, without the six-month wait.`
- Subline: `Medical and cosmetic dermatology for adults and children. Most new patients are seen within two weeks, and urgent lesion checks within five days.`
- CTA 1: `Book Appointment` · CTA 2: `Call (206) 555-0143`
- Trust strip: `Board-Certified` · `Most Insurance Accepted` · `Same-Week Urgent Slots` · `4.9 ★ from 800+ reviews`

### Urgent Bar
`Concerned about a changing mole or spot? Call us — we hold same-week slots for urgent lesion checks.`

### Medical Track
1. **Skin Cancer Screening** · *Covered by insurance* — Full-body examination with dermoscopy, performed by a board-certified dermatologist. Anything suspicious is photographed, measured, and either biopsied that day or scheduled for close follow-up.
2. **Mole & Lesion Removal** · *Covered by insurance* — Shave, punch, or excisional removal under local anaesthetic, usually in a single visit. Tissue goes to a dermatopathology lab and results come back in five to seven days.
3. **Acne Treatment** · *Covered by insurance* — Topical and oral therapy, hormonal management, and isotretinoin for severe cases, with the monitoring that requires. We treat scarring as a separate conversation once the acne is controlled.
4. **Eczema & Psoriasis** · *Covered by insurance* — Topical regimens, phototherapy, and biologic therapy for moderate to severe disease. We handle the prior-authorisation paperwork in-house.
5. **Rosacea Management** · *Covered by insurance* — Trigger identification, topical and oral therapy, and vascular laser for persistent redness.
6. **Pediatric Dermatology** · *Covered by insurance* — Birthmarks, warts, molluscum, atopic dermatitis, and anything a worried parent wants a second opinion on. Appointments run longer by design.

### Cosmetic Track
1. **Botulinum Toxin** · *From $12 per unit* — Forehead, glabella, and crow's feet, injected by a physician rather than delegated. Results appear in three to seven days and last three to four months.
2. **Dermal Filler** · *From $700 per syringe* — Midface, nasolabial, lips, and jawline using hyaluronic acid fillers. We are conservative by default and would rather do a second session than overfill.
3. **Laser Resurfacing** · *From $900 per session* — Fractional laser for texture, sun damage, and acne scarring. Expect three to seven days of visible healing.
4. **Chemical Peels** · *From $250* — Superficial to medium-depth peels for pigmentation, dullness, and congestion. Minimal downtime on superficial depths.
5. **Microneedling with PRP** · *From $650* — Collagen induction for scarring and texture, with platelet-rich plasma drawn on the day.
6. **Vascular & Pigment Laser** · *From $400 per session* — Broken capillaries, sun spots, and persistent facial redness.

### Conditions
Eyebrow: `CONDITIONS` — H2: `Common Reasons Patients Come In`
`Acne` · `Eczema` · `Psoriasis` · `Rosacea` · `Melanoma` · `Basal cell carcinoma` · `Moles` · `Warts` · `Hair loss` · `Hyperhidrosis` · `Vitiligo` · `Shingles` · `Cysts` · `Keratosis` · `Nail disorders` · `Rashes` · `Hives` · `Sun damage` · `Scarring` · `Melasma`

### Providers
Eyebrow: `YOUR CARE TEAM` — H2: `Board-Certified Providers`
1. **Dr. Naomi Hsu, MD, FAAD** — Medical Dermatology & Skin Cancer — Dr. Hsu completed her residency at the University of Washington and has performed over 4,000 skin cancer screenings. She treats complex inflammatory skin disease and leads the clinic's biologics program.
2. **Dr. Adrian Bell, MD, FAAD** — Cosmetic & Laser Dermatology — Adrian trained in Mohs surgery before focusing on aesthetic and laser work. His approach is deliberately conservative — patients regularly leave with a smaller plan than they arrived with.
3. **Dr. Priya Raman, MD, FAAD** — Pediatric Dermatology — Priya is double board-certified in pediatrics and dermatology. Her appointments run longer than standard because she believes worried parents deserve unhurried answers.

### What to Expect
Eyebrow: `YOUR VISIT` — H2: `What to Expect`
1. **Book** — Request online or call. New patient visits are 30 minutes; urgent lesion checks are held open each week.
2. **Before your visit** — Come without makeup if the concern is facial, and remove nail polish for nail complaints. Bring a list of current medications.
3. **During the exam** — For a full-body check you will change into a gown and a chaperone is available on request. Nothing is biopsied without explaining why first.
4. **After** — Pathology results come back in five to seven days and we call you either way — including when it is good news.

### Insurance
H2: `Insurance & Costs`
Paragraph: `Medical dermatology is billed to insurance. Cosmetic treatments are self-pay and quoted before anything is booked — you will never be surprised by an invoice. If a treatment sits in a grey area, we tell you before we perform it, not after.`
Accepted: `Aetna` · `Blue Cross Blue Shield` · `Cigna` · `First Choice Health` · `Kaiser PPO` · `Medicare` · `Premera` · `Regence` · `UnitedHealthcare` · `Molina`

### Reviews
1. `I had a spot on my back for two years that two other doctors dismissed. Dr. Hsu biopsied it the same visit. It was an early melanoma. I owe her.` — **James P.** · Verified patient
2. `I asked for filler in three areas and Dr. Bell talked me down to one. Six months later I still think that was the right call.` — **Anika S.** · Verified patient
3. `My four-year-old is terrified of doctors. Dr. Raman spent ten minutes just letting him look at her equipment before she touched him.` — **Carla T.** · Verified patient

### Locations
1. **Downtown Seattle** — `1420 Fifth Avenue, Suite 800, Seattle, WA 98101` · Mon–Fri 8am–5pm · Validated garage parking
2. **Bellevue** — `310 108th Avenue NE, Suite 210, Bellevue, WA 98004` · Mon–Thu 8am–6pm, Fri 8am–3pm · Free surface lot

### FAQ
1. **How soon can I be seen?** — New medical patients are typically scheduled within two weeks. Urgent lesion checks are usually within five days — call rather than booking online for those.
2. **Do you take my insurance?** — We accept most major plans. Medical visits are billed to insurance; cosmetic treatments are self-pay and always quoted in advance.
3. **Do I need a referral?** — Most plans do not require one, but a few HMO plans do. Check with your insurer, or call us and we will help you find out.
4. **What happens if you find something concerning?** — We biopsy it, explain exactly what we are looking for, and call you with results within a week — whether the news is good or bad.
5. **Can I combine a medical and cosmetic visit?** — Yes, and it is common. The medical portion is billed to insurance and the cosmetic portion is billed separately at the quoted rate.
6. **Do you see children?** — Yes. Dr. Raman is double board-certified in pediatrics and dermatology, and pediatric appointments are scheduled with extra time.

### Final CTA
H2: `Get your skin looked at.`
Subline: `Two weeks for a routine visit. Five days if something is changing. Both are better than waiting and wondering.`
CTA: `Book Appointment` · Phone: `(206) 555-0143`

### Footer
- CLEARVIEW DERMATOLOGY · `Medical and cosmetic dermatology in Seattle and Bellevue.`
- © 2026 Clearview Dermatology PLLC. All rights reserved.
- Privacy Policy · Notice of Privacy Practices · Accessibility Statement
- Disclaimer: `This website is for general information only and does not constitute medical advice. If you are experiencing a medical emergency, call 911.`

---

## 10. Key Dependencies

```json
{
  "motion": "^12.0.0",
  "lucide-react": "^0.460.0",
  "@radix-ui/react-accordion": "^1.2.0",
  "clsx": "^2.1.0",
  "tailwind-merge": "^2.5.0"
}
```

**Tailwind config additions:**
```js
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        serif: ['Newsreader', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        'cv-teal': '#30797d',
        'cv-medical': '#2e6f94',
        'cv-cosmetic': '#b96f8d',
      },
    },
  },
};
```
