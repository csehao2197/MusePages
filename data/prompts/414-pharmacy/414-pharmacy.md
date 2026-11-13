# Harbourside Pharmacy — Independent Pharmacy Website Prompt

## 1. Goal Statement
Build a calm, service-led independent pharmacy website for **Harbourside Pharmacy**, defined by clean white, soft mint, and a clear split between the three things people actually come for: prescriptions, vaccinations, and asking a pharmacist a question without booking a doctor.

## 2. Tech Stack
```
React + Vite + TypeScript + Tailwind CSS + Framer Motion (motion/react) + shadcn/ui + lucide-react
```

## 3. Design System — Colors
```css
:root {
  --background: hsl(0, 0%, 100%);
  --foreground: hsl(190, 22%, 16%);     /* #1f3033 */
  --primary: hsl(168, 44%, 36%);        /* #34846f mint green */
  --primary-foreground: hsl(0, 0%, 100%);
  --muted-foreground: hsl(190, 8%, 46%);
  --border: hsl(180, 16%, 90%);
  --card: hsl(170, 34%, 96%);           /* pale mint wash */
  --accent-coral: hsl(8, 74%, 62%);     /* urgent / flu clinic */
}
```

## 4. Typography
```html
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&family=Inter:wght@300;400;500&display=swap" rel="stylesheet" />
```
- **H1:** Outfit 700, clamp(36px, 4.4vw, 60px), letter-spacing -0.02em
- **H2:** Outfit 600, 30–42px
- **H3:** Outfit 500, 18–20px
- **Body:** Inter 300–400, 17px, line-height 1.75
- **Eyebrows:** Inter 600, uppercase, letter-spacing 0.16em, 11px, mint
- **Opening hours / phone:** Outfit 600, tabular-nums

## 5. Visual Effects

**Effect 1 — Live open/closed status pill.** A pill in the navbar that computes from the current time and the opening hours object, showing a green dot and `Open until 6:30pm` or an amber dot and `Closed — opens 9am tomorrow`.

```tsx
const now = new Date();
const today = hours[now.getDay()];
const open = today && now >= today.from && now < today.to;

<span className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm"
      style={{ borderColor: 'var(--border)' }}>
  <span className="h-2 w-2 rounded-full animate-pulse"
        style={{ background: open ? 'var(--primary)' : 'var(--accent-coral)' }} />
  {open ? `Open until ${today.label}` : 'Closed — opens 9am tomorrow'}
</span>
```

**Effect 2 — Three-route service chooser.** Directly under the hero, three large cards — repeat prescription, book a vaccination, ask a pharmacist — each with an icon in a mint circle and a bottom rule that scales in on hover.

## 6. Component Breakdown

1. **Navbar** — 74px, sticky, white with 1px bottom border. Left mark plus wordmark, centre links, live status pill and `Order Repeat Prescription` mint button right.
2. **Hero** — split, text left in columns 1–6, image right. Eyebrow, H1, subline, two CTAs, trust strip. *Image: bright modern pharmacy counter interior, clean shelving, soft natural daylight, calm and uncluttered.*
3. **Three-route chooser** — the primary conversion block (Effect 2).
4. **Services grid** — 2x4 cards: NHS prescriptions, private prescriptions, vaccinations, blood pressure checks, medicine reviews, travel health, minor ailments, delivery.
5. **Vaccination clinics** — pale mint band with a table of clinics, price, and who is eligible free of charge, plus a booking CTA.
6. **Meet the pharmacists** — 3 cards with portraits, name, registration number, and a one-sentence specialism. *Image: friendly pharmacist in a white coat behind a counter, warm approachable expression, clinical background.*
7. **Repeat prescriptions explainer** — four numbered steps from request to collection, with expected turnaround.
8. **Delivery** — coverage area, free threshold, and cut-off times.
9. **Health advice** — three short article cards, each answering one common question.
10. **Location and hours** — full week table, parking and accessibility notes, map.
11. **Footer** — deep slate, four columns, GPhC registration, superintendent pharmacist name, complaints procedure link.

## 7. Animations
- Status pill dot: gentle 2s opacity pulse
- Hero: text fades up 0.7s; image reveals with a `clipPath` wipe from the right, 1s
- Route cards: bottom rule `scaleX 0 → 1` on hover, 0.35s; card lifts `-4px`
- Service cards: stagger `i * 0.06`, `y: 20 → 0`
- Clinic table rows: fade in staggered 0.04s
- Pharmacist cards: stagger 0.1s
- Steps: numbered circles pop `scale 0.85 → 1` staggered 0.12s
- Nothing bounces — this is a healthcare site

## 8. Responsive
- **Mobile (<768px):** hamburger; status pill moves under the wordmark; hero image stacks above text; route chooser becomes three full-width cards; services 1-col; clinic table becomes stacked cards; `Order Repeat Prescription` pinned as a sticky bottom bar.
- **Tablet:** services 2-col, pharmacists 2-col, hero stays split.
- **Desktop:** max width 1160px, `px-16`, `py-24`.

## 9. Full Copy

**Brand:** HARBOURSIDE PHARMACY · Whitstable, Kent

**Navbar:** Services · Vaccinations · Prescriptions · Our Team · Find Us · [Button] Order Repeat Prescription

**Hero**
- Eyebrow: `WHITSTABLE · INDEPENDENT SINCE 1974 · NHS & PRIVATE`
- H1: `Your pharmacist has time to answer that.`
- Subline: `Independent community pharmacy on Harbour Street. Repeat prescriptions ready in 48 hours, vaccinations without an appointment, and free advice from someone who is not watching a ten-minute clock.`
- CTAs: `Order Repeat Prescription` · `Book a Vaccination`
- Trust strip: `GPhC Registered #1029844` · `NHS Contracted` · `Free local delivery` · `Open Saturdays`

**Three routes**
1. **Repeat prescription** — Order online, we handle the surgery. Ready in 48 hours.
2. **Book a vaccination** — Flu, travel, shingles, and childhood catch-up. Walk-ins welcome.
3. **Ask a pharmacist** — Free, confidential, no appointment. Most days you will not wait.

**Services** — `NHS Prescriptions` · `Private Prescriptions` · `Vaccinations` · `Blood Pressure Checks` · `Medicine Use Reviews` · `Travel Health Clinic` · `Minor Ailments Service` · `Free Local Delivery`

**Vaccination clinics**
- `Flu` — £18, free if eligible on the NHS — Walk-in, October to January
- `Covid booster` — Free if eligible — By appointment, seasonal
- `Shingles` — £220 for the two-dose course — By appointment
- `Travel package` — From £45 depending on destination — Appointment, allow six weeks before travel
- `Childhood catch-up` — Free — By appointment

**Pharmacists**
1. **Nadia Rahman, MPharm** — Superintendent Pharmacist · GPhC 2078441 — Independent prescriber with a special interest in respiratory care and inhaler technique.
2. **Tom Osei, MPharm** — Pharmacist · GPhC 2103562 — Runs the travel health clinic and the medicine review service.
3. **Grace Fenton, MPharm** — Pharmacist · GPhC 2145209 — Focuses on elderly care, blister packs, and coordinating with local care homes.

**Repeat prescriptions**
1. **Request** — Order online, by phone, or drop the slip in. Takes about a minute.
2. **We contact the surgery** — You do not need to. This is the step most people find annoying, so we do it.
3. **We dispense** — Usually within 48 hours. We text you when it is ready.
4. **Collect or have it delivered** — Free delivery within three miles, same day if ordered before 11am.

**Delivery** — `Free within three miles of Harbour Street. Same-day if ordered before 11am, next day after. We deliver to CT5 and parts of CT2.`

**Health advice** — `Do I actually need antibiotics for this?` · `How to use an inhaler properly, in ninety seconds` · `What to pack in a travel first aid kit`

**Hours** — Mon–Fri 9:00–18:30 · Sat 9:00–13:00 · Sun closed · Closed for lunch 13:00–13:30

**Footer** — HARBOURSIDE PHARMACY · `42 Harbour Street, Whitstable, Kent CT5 1AQ` · `01227 555 0118` · Superintendent Pharmacist: Nadia Rahman, GPhC 2078441 · Premises registration 1029844 · Complaints procedure · © 2026

## 10. Key Dependencies
```json
{
  "motion": "^12.0.0",
  "lucide-react": "^0.460.0",
  "clsx": "^2.1.0",
  "tailwind-merge": "^2.5.0"
}
```
