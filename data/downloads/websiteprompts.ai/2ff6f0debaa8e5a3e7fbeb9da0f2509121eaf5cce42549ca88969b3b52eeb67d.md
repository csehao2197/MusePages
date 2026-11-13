# Fielding Practice — Private GP Clinic Website Prompt

## 1. Goal Statement
Build a warm, unhurried private GP clinic website for **Fielding Practice**, defined by soft bone, a muted sage green, and a humanist serif — a medical site that sells time with a doctor rather than a list of conditions.

## 2. Tech Stack
```
React + Vite + TypeScript + Tailwind CSS + Framer Motion (motion/react) + shadcn/ui + lucide-react
```

## 3. Design System — Colors
```css
:root {
  --background: hsl(44, 26%, 96%);       /* #f8f5ee bone */
  --foreground: hsl(174, 18%, 16%);      /* #212f2d */
  --primary: hsl(158, 26%, 36%);         /* #43745f muted sage */
  --primary-foreground: hsl(44, 26%, 97%);
  --muted-foreground: hsl(174, 6%, 45%);
  --border: hsl(42, 16%, 87%);
  --card: hsl(44, 28%, 92%);
  --accent-urgent: hsl(18, 68%, 54%);    /* same-day slots */
}
```

## 4. Typography
```html
<link href="https://fonts.googleapis.com/css2?family=Petrona:wght@400;500;600&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet" />
```
- **H1:** Petrona 500, clamp(36px, 4.4vw, 60px), line-height 1.14
- **H2:** Petrona 500, 30–42px
- **H3:** Inter 600, 18–20px
- **Body:** Inter 300–400, 17px, line-height 1.8
- **Eyebrows:** Inter 600, uppercase, letter-spacing 0.16em, 11px, sage
- **Appointment lengths / prices:** Petrona 600, tabular-nums

## 5. Visual Effects

**Effect 1 — Appointment length comparison.** A visual bar comparing a standard NHS appointment with the clinic's three appointment types, drawn as horizontal bars whose widths animate on scroll. The NHS bar is deliberately short, which is the entire proposition.

```tsx
const slots = [
  { label: 'Typical NHS appointment', minutes: 10, muted: true },
  { label: 'Standard consultation',   minutes: 30 },
  { label: 'Extended consultation',   minutes: 45 },
  { label: 'Full health assessment',  minutes: 90 },
];
const max = 90;

{slots.map((s, i) => (
  <div key={s.label} className="mb-5">
    <div className="mb-1.5 flex justify-between text-sm">
      <span className={s.muted ? 'text-[var(--muted-foreground)]' : ''}>{s.label}</span>
      <span className="font-serif tabular-nums">{s.minutes} min</span>
    </div>
    <div className="h-2.5 rounded-full bg-[var(--card)]">
      <motion.div className="h-full rounded-full"
        style={{ background: s.muted ? 'var(--border)' : 'var(--primary)' }}
        initial={{ width: 0 }} whileInView={{ width: `${(s.minutes / max) * 100}%` }}
        viewport={{ once: true }} transition={{ duration: 0.9, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }} />
    </div>
  </div>
))}
```

**Effect 2 — Same-day availability strip.** A thin band under the hero showing how many same-day appointments remain today, with a soft pulse on the count and an orange dot. It is the one urgent element on an otherwise calm page.

## 6. Component Breakdown

1. **Navbar** — 76px, sticky, bone background, 1px bottom border. Wordmark left, links centre, phone and `Book an Appointment` sage button right.
2. **Hero** — split, text left, image right with a soft rounded frame. Eyebrow, serif H1, subline, two CTAs, four trust points. *Image: warm consulting room interior with a desk, plants and natural window light, calm and domestic rather than clinical.*
3. **Same-day strip** — availability count (Effect 2).
4. **Appointment lengths** — the proposition section (Effect 1) with a short paragraph on why time matters.
5. **Services** — 2x4 grid: GP consultations, health assessments, blood tests, vaccinations, minor procedures, sexual health, travel clinic, private referrals.
6. **Our doctors** — 3 cards with portraits, name, GMC number, specialism and a two-sentence bio. *Image: doctor portrait in soft daylight, warm and approachable, neutral background, not wearing a white coat.*
7. **Pricing** — a plain table of consultation types, duration and fee, with an explicit note that there is no membership requirement.
8. **Membership** — two optional annual plans for families and individuals, with what each includes.
9. **What to expect** — four steps from booking to follow-up, including how results are communicated.
10. **Tests and results** — turnaround times for common blood panels, stated in working days.
11. **FAQ** — accordion, six questions on referrals, insurance, prescriptions and NHS interaction.
12. **Visit** — address, hours, parking, step-free access, and an out-of-hours line.
13. **Footer** — deep sage, four columns, CQC registration, GMC numbers, privacy notice.

## 7. Animations
- Hero: text fades up 0.75s; image reveals with a soft opacity and 8px rise, 0.9s
- Availability count: gentle 2.4s pulse on the orange dot only
- Appointment bars: width animates 0.9s with a 0.12s stagger — the NHS bar animates first so the contrast lands
- Service cards: fade-up stagger 0.07s
- Doctor cards: stagger 0.1s, no hover transform beyond a 1px sage underline
- Motion is slow and calm throughout — the site is selling unhurriedness and should feel it

## 8. Responsive
- **Mobile (<768px):** hamburger; image stacks above text; H1 clamps to 36px; appointment bars keep full width with labels above; services 1-col; pricing table becomes stacked rows; `Book an Appointment` pinned as a sticky bottom bar.
- **Tablet:** hero split retained, services 2-col, doctors 2-col with the third centred.
- **Desktop:** max width 1140px, `px-16`, `py-24`.

## 9. Full Copy

**Brand:** FIELDING PRACTICE · Private GP · Bath

**Navbar:** Appointments · Services · Our Doctors · Pricing · Membership · Visit · `01225 555 0177` · [Button] Book an Appointment

**Hero**
- Eyebrow: `BATH · PRIVATE GP · CQC REGISTERED · NO MEMBERSHIP REQUIRED`
- H1: `Thirty minutes with a doctor who has read your notes.`
- Subline: `A small private GP practice on Great Pulteney Street. Same-day appointments, thirty minutes as standard, and the same doctor every time if you want one.`
- CTAs: `Book an Appointment` · `See Pricing`
- Trust points: `CQC registered` · `Same-day slots daily` · `No membership needed` · `Results within 48 hours`

**Same-day strip:** `Four same-day appointments left today · Call 01225 555 0177 or book online`

**Appointment lengths** — Eyebrow `WHY WE ARE DIFFERENT` — H2 `Ten minutes is not enough and everybody knows it`
`The average NHS GP appointment is ten minutes, which is barely enough to describe a problem, let alone examine it and discuss what to do. Our standard consultation is thirty. It is the single reason most of our patients came, and the reason most of them stay.`

**Services**
1. **GP Consultations** — Thirty minutes as standard, in person or by video. Same-day appointments held open every weekday.
2. **Health Assessments** — Ninety-minute full assessment with bloods, ECG, spirometry and a written report you actually keep.
3. **Blood Tests** — Over two hundred panels taken on site, most results back within forty-eight hours.
4. **Vaccinations** — Travel, flu, shingles, HPV and childhood catch-up, given the same day where stock allows.
5. **Minor Procedures** — Mole and cyst removal, joint injections, ear irrigation and wound care under local anaesthetic.
6. **Sexual Health** — Confidential screening and treatment, same-day results on several tests, no referral needed.
7. **Travel Clinic** — Destination risk assessment, vaccinations and antimalarials. Book six weeks before you travel where possible.
8. **Private Referrals** — Direct referral to consultants and imaging, usually within a week, with your notes sent ahead.

**Our doctors**
1. **Dr. Helen Fielding, MBBS MRCGP** — GMC 4128866 — Founded the practice in 2014 after fifteen years in NHS general practice. Special interest in women's health and menopause.
2. **Dr. Samuel Adeyemi, MBBS MRCGP** — GMC 6203411 — Twelve years as a GP partner and a former emergency medicine registrar. Handles most of the minor surgery list.
3. **Dr. Priya Nair, MBBS MRCGP DRCOG** — GMC 7188034 — Special interest in paediatrics and travel medicine. Sees children from birth upwards.

**Pricing** — Eyebrow `PRICING` — H2 `No membership required`
| Appointment | Duration | Fee |
|---|---|---|
| Standard consultation | 30 minutes | £110 |
| Extended consultation | 45 minutes | £150 |
| Video consultation | 20 minutes | £75 |
| Full health assessment | 90 minutes | £395 |
| Minor procedure | 30–45 minutes | From £250 |
| Blood panel, basic | — | From £85 |
| Travel consultation | 30 minutes | £95 plus vaccines |

Note: `You do not need to be a member to book. Membership exists because some families prefer a fixed annual cost, not because we gate appointments behind it.`

**Membership**
- **Individual — £480 a year** — Four standard consultations included · Unlimited video consultations · Priority same-day booking · Ten percent off tests and procedures
- **Family — £1,150 a year** — Two adults and up to three children · Eight standard consultations included · Unlimited video consultations · Priority booking for all members · Fifteen percent off tests and procedures

**What to expect**
1. **Book** — Online or by phone. Same-day slots are held open until 2pm each weekday.
2. **Before you come** — Bring a list of medications and any recent test results. Ten minutes of preparation saves half the appointment.
3. **Your appointment** — Thirty minutes, unhurried, with an examination if it is needed. You will not be rushed to a conclusion.
4. **Afterwards** — A written summary in your patient portal the same day, results within forty-eight hours, and a call from your doctor either way.

**Tests and results** — `Full blood count, 24 hours` · `Liver and kidney function, 24 hours` · `Thyroid panel, 48 hours` · `HbA1c and lipids, 48 hours` · `Vitamin D and B12, 3 working days` · `Hormone panels, 3–5 working days`

**FAQ**
1. **Do I need to be registered with an NHS GP?** — No, but we recommend staying registered. We work alongside NHS care rather than replacing it, and we write to your NHS GP with your consent.
2. **Do you take insurance?** — Many patients claim back consultations through their policy. We provide itemised receipts with codes, but we bill you directly rather than the insurer.
3. **Can you prescribe?** — Yes. Private prescriptions are issued at the appointment and can be dispensed at any pharmacy.
4. **Can I see the same doctor every time?** — Yes, and most patients do. Choose your doctor when booking and we hold continuity wherever the diary allows.
5. **Do you see children?** — Yes, from birth. Dr. Nair has a paediatric special interest and children's appointments run to the same thirty minutes.
6. **What about out of hours?** — Members have an out-of-hours line. For anything urgent outside our hours, call 111, and for an emergency call 999.

**Visit** — `18 Great Pulteney Street, Bath BA2 4BT` · Mon–Fri 8:00–19:00 · Sat 9:00–13:00 · Sun closed
`Pay and display on Great Pulteney Street, and a step-free entrance on the right-hand side of the building.`

**Footer** — FIELDING PRACTICE · `Private GP care in Bath since 2014` · `01225 555 0177` · CQC registered provider 1-8842019 · Privacy notice · © 2026
Disclaimer: `This website provides general information and does not constitute medical advice. In an emergency call 999.`

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
