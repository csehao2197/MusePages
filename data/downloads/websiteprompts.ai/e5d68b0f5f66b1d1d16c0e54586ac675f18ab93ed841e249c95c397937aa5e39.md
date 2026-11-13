# Willow Kennels — Pet Boarding & Kennels Website Prompt

## 1. Goal Statement
Build a warm, anxiety-reducing pet boarding website for **Willow Kennels**, defined by soft sand, a friendly moss green, and rounded typography — built entirely around the one thing owners actually want, which is proof their dog is fine while they are away.

## 2. Tech Stack
```
React + Vite + TypeScript + Tailwind CSS + Framer Motion (motion/react) + shadcn/ui + lucide-react
```

## 3. Design System — Colors
```css
:root {
  --background: hsl(40, 36%, 96%);       /* #f9f4ea sand */
  --foreground: hsl(120, 16%, 17%);      /* #263224 */
  --primary: hsl(120, 30%, 34%);         /* #3d703e moss green */
  --primary-foreground: hsl(40, 36%, 97%);
  --muted-foreground: hsl(120, 6%, 45%);
  --border: hsl(38, 18%, 87%);
  --card: hsl(40, 38%, 92%);
  --accent-paw: hsl(28, 76%, 58%);       /* warm amber */
}
```

## 4. Typography
```html
<link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&family=Inter:wght@300;400;500&display=swap" rel="stylesheet" />
```
- **H1:** Nunito 800, clamp(36px, 4.8vw, 66px), letter-spacing -0.02em
- **H2:** Nunito 700, 30–42px
- **H3:** Nunito 700, 18–21px
- **Body:** Inter 300–400, 17px, line-height 1.76
- **Eyebrows:** Inter 600, uppercase, letter-spacing 0.18em, 11px, moss
- **Prices / capacities:** Nunito 800, tabular-nums

## 5. Visual Effects

**Effect 1 — Daily routine timeline.** A vertical timeline of a boarding day from 7am to 9pm, each entry with a small amber icon, a time in tabular numerals and a one-line description. The connecting line draws itself downward as the section scrolls into view, using `scaleY` bound to scroll progress.

```tsx
const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.7', 'end 0.5'] });

<motion.div className="absolute left-5 top-0 w-[3px] origin-top rounded-full bg-[var(--primary)]"
  style={{ height: '100%', scaleY: scrollYProgress } } />
{day.map((step, i) => (
  <motion.div key={step.time}
    initial={{ opacity: 0, x: -14 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
    transition={{ duration: 0.5, delay: i * 0.06 }}
    className="relative mb-8 pl-14">
    <span className="absolute left-0 grid h-10 w-10 place-items-center rounded-full"
      style={{ background: 'var(--accent-paw)' }}>{step.icon}</span>
    <span className="font-display tabular-nums">{step.time}</span>
    <p className="text-[var(--muted-foreground)]">{step.text}</p>
  </motion.div>
))}
```

**Effect 2 — Photo update mockup.** A phone-shaped frame showing a mock daily photo update message, tilted 3 degrees, with the message bubbles animating in one after another. It sells the single most reassuring feature without needing a paragraph.

## 6. Component Breakdown

1. **Navbar** — 74px, sticky, sand, 1px bottom border. Paw-mark wordmark left, links centre, phone and `Book a Stay` moss button right.
2. **Hero** — split, text left, image right with rounded corners. Eyebrow, H1, subline, two CTAs, four trust points. *Image: a happy dog in a large grass run with a handler crouched nearby, warm natural daylight, relaxed and unstaged.*
3. **Reassurance strip** — licence number, insurance, vet on call, and staff-to-dog ratio.
4. **A day at Willow** — the routine timeline (Effect 1), the emotional core of the page.
5. **Photo updates** — split section with the phone mockup (Effect 2) and a short explanation of the daily update.
6. **Accommodation** — three options: standard kennel, deluxe suite, and cat cabin, each with size, bedding, heating and price.
7. **Pricing** — a plain table of nightly rates by dog size, plus multi-dog discounts, and peak-season surcharge stated openly.
8. **What to bring** — a practical checklist that reduces the phone calls staff would otherwise get.
9. **Requirements** — vaccinations, flea and worm treatment, neutering policy for long stays, and the trial-day requirement for first-timers.
10. **Meet the team** — three staff cards with name, years at the kennels, and which dog they secretly favour.
11. **Reviews** — three quotes, each naming the dog and the length of stay.
12. **Booking** — form with dates, dog details, and an availability note for school holidays.
13. **Footer** — deep moss, four columns, licence number, opening times for drop-off and collection.

## 7. Animations
- Hero: text fades up 0.7s; image rises and fades, 0.9s
- Timeline: connecting line `scaleY` bound to scroll progress; entries slide `x: -14 → 0` staggered 0.06s
- Phone mockup: message bubbles animate in sequentially, 0.4s apart, with a small scale-in
- Accommodation cards: lift `-4px` on hover with an amber 1px border
- Checklist items: check icons pop `scale 0.7 → 1` staggered 0.05s
- Everything is soft and rounded — spring easing rather than sharp cubic-bezier

## 8. Responsive
- **Mobile (<768px):** hamburger; image stacks above text; H1 clamps to 36px; timeline keeps vertical form with the line at `left-3`; phone mockup centres above its text; accommodation 1-col; pricing table becomes stacked rows; `Book a Stay` pinned as a sticky bottom bar.
- **Tablet:** hero split retained, accommodation 3-col at tighter padding, team 3-col.
- **Desktop:** max width 1140px, `px-16`, `py-22`.

## 9. Full Copy

**Brand:** WILLOW KENNELS · Boarding kennels and cattery · Cheshire

**Navbar:** A Day Here · Accommodation · Pricing · Requirements · About · `01565 555 0134` · [Button] Book a Stay

**Hero**
- Eyebrow: `CHESHIRE · LICENSED BOARDING KENNELS · FIVE STAR RATED · SINCE 1998`
- H1: `Photos every day, so you actually enjoy the holiday.`
- Subline: `Licensed boarding kennels and cattery on eleven acres near Knutsford. Big grass runs, two long walks a day, and a photo update in your inbox every evening.`
- CTAs: `Book a Stay` · `See a Day Here`
- Trust points: `Licence CWC/2019/0842` · `Vet on call 24/7` · `1 handler per 8 dogs` · `Fully insured`

**Reassurance strip:** `Cheshire West licensed, five star rating · Insured with Pet Business Insurance · Vet on call 24 hours · One handler per eight dogs, always`

**A day at Willow** — Eyebrow `THE ROUTINE` — H2 `What actually happens between drop-off and pick-up`
- `07:00` **Morning check** — Every dog seen individually, bedding checked, medication given, water changed.
- `07:30` **First run** — Twenty minutes in a grass paddock, in small compatible groups or alone if your dog prefers it.
- `08:30` **Breakfast** — Your own food, your own portions, your own schedule. We do not switch dogs onto our food.
- `10:00` **Long walk** — Forty-five minutes on the estate paths. Every dog goes out, whatever the weather.
- `12:30` **Rest** — Quiet period in kennels. Dogs sleep more than owners expect and they need this.
- `14:30` **Second run and play** — Another paddock session, plus one-to-one time and enrichment toys.
- `16:30` **Second walk** — Forty-five minutes, different route, so it stays interesting.
- `18:00` **Dinner** — Your food again, then a settle-down period.
- `19:30` **Photo update** — We send you a photo and a line about their day. Every day, without you asking.
- `21:00` **Last check and lights out** — Final toilet break, bedding sorted, and a walk-through by the duty handler.

**Photo updates** — H2 `You will hear from us every evening`
`Every dog gets a photo and a short message each evening — what they did, who they played with, and how much they ate. It is the single most common reason people book with us again, and it costs you nothing.`
Sample messages: `Bramble had a brilliant day` · `Two long walks and half an hour chasing a football with a spaniel called Ted` · `Ate everything, slept like a log by seven`

**Accommodation**
- **Standard Kennel — from £26 a night** — 2m by 3m indoor with a heated bed, plus an attached 2m by 4m covered outdoor run the dog can access all day.
- **Deluxe Suite — from £38 a night** — 3m by 4m indoor, underfloor heating, raised bed and a sofa, plus a private 5m grass run. Best for older dogs and nervous first-timers.
- **Cat Cabin — from £16 a night** — 1.5m by 2m with a heated shelf, window view onto the garden, and a separate quiet building away from the dogs.

**Pricing**
| | 1 night | 7 nights | 14 nights |
|---|---|---|---|
| Small dog, under 10kg | £26 | £168 | £322 |
| Medium dog, 10–25kg | £30 | £196 | £378 |
| Large dog, over 25kg | £34 | £224 | £434 |
| Deluxe suite, any size | £38 | £252 | £490 |
| Cat | £16 | £98 | £182 |

Notes: `Second dog sharing a kennel is half price. Peak season — school holidays, Christmas and Easter — carries a £4 per night surcharge, and we will always tell you before you book rather than at checkout.`

**What to bring** — `Their own food, measured into daily bags · Any medication in its original packaging with written instructions · One bed or blanket that smells of home · Their collar with an ID tag · A favourite toy, though it may not come back in one piece · Vaccination card`

**Requirements**
1. **Vaccinations** — Up to date DHP and leptospirosis, plus kennel cough at least two weeks before arrival. We check the card on drop-off, every time, no exceptions.
2. **Flea and worm treatment** — Within the last month. We can treat on arrival for £12 if you have forgotten.
3. **Trial day for first-timers** — Every new dog does a free half-day before their first overnight stay. It tells us how they cope and it tells you whether you are comfortable.
4. **Neutering** — Required for stays over fourteen nights, and for any dog over eight months sharing a paddock group.

**Team**
1. **Sue Willoughby** — Owner · 28 years — Started the kennels in 1998 and still does the 7am check most mornings. Secretly favours the greyhounds.
2. **Dan Reilly** — Head Handler · 9 years — Runs the paddock groups and knows which dogs will get on before they meet. Favours anything scruffy.
3. **Marta Kovac** — Handler · 4 years — Qualified veterinary nurse, handles all medication and the nervous first-timers. Favours the ones who hide at the back.

**Reviews**
1. `Two weeks in Portugal and I got a photo of Bramble every single evening. My husband started looking forward to them more than the beach.` — **Rachel D.**, Bramble, 14 nights
2. `Our rescue is terrified of everything. The free trial day was the reason we booked, and by day three he was in a paddock group with two labradors.` — **Ian M.**, Otto, 8 nights
3. `They called us in Spain because he was off his food. Turned out to be nothing, but the fact they rang rather than waited is why we go back.` — **Priya K.**, Chester, 10 nights

**Booking** — Form: Arrival date / Departure date / Dog name / Breed and weight / Any medication / First stay with us? → [Button] `Check Availability`
Note: `School holidays and Christmas book out three to four months ahead. Everything else usually has space within a fortnight.`

**Footer** — WILLOW KENNELS · `Photos every day, so you actually enjoy the holiday.` · `Willow Farm, Chelford Road, Knutsford, Cheshire WA16 8QT` · `01565 555 0134` · Cheshire West licence CWC/2019/0842, five star rated · Drop-off 8–11am and 3–5pm, collection 9–11am and 3–5pm · © 2026

## 10. Key Dependencies
```json
{
  "motion": "^12.0.0",
  "lucide-react": "^0.460.0",
  "react-day-picker": "^9.0.0",
  "clsx": "^2.1.0",
  "tailwind-merge": "^2.5.0"
}
```
