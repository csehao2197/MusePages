# Ashgrove Tennis Club — Tennis Club Website Prompt

## 1. Goal Statement
Build a bright, club-life tennis website for **Ashgrove Tennis Club**, defined by clay terracotta, court white, and a clean geometric sans — organised around court booking, coaching and the social side that actually keeps members renewing.

## 2. Tech Stack
```
React + Vite + TypeScript + Tailwind CSS + Framer Motion (motion/react) + shadcn/ui + lucide-react
```

## 3. Design System — Colors
```css
:root {
  --background: hsl(36, 30%, 97%);       /* #fbf7f2 court white */
  --foreground: hsl(14, 24%, 17%);       /* #35241f */
  --primary: hsl(14, 58%, 48%);          /* #c1533a clay terracotta */
  --primary-foreground: hsl(36, 30%, 98%);
  --muted-foreground: hsl(14, 8%, 46%);
  --border: hsl(30, 16%, 88%);
  --card: hsl(34, 30%, 93%);
  --accent-court: hsl(150, 32%, 38%);    /* grass court green */
  --net: hsl(14, 20%, 24%);              /* dark bands */
}
```

## 4. Typography
```html
<link href="https://fonts.googleapis.com/css2?family=Sora:wght@500;600;700&family=Inter:wght@300;400;500&display=swap" rel="stylesheet" />
```
- **H1:** Sora 700, clamp(38px, 5vw, 70px), letter-spacing -0.03em
- **H2:** Sora 600, 30–44px
- **H3:** Sora 600, 18–20px
- **Body:** Inter 300–400, 17px, line-height 1.74
- **Eyebrows:** Inter 600, uppercase, letter-spacing 0.2em, 11px, terracotta
- **Court numbers / times / fees:** Sora 700, tabular-nums

## 5. Visual Effects

**Effect 1 — Court booking grid.** A time-by-court grid for the selected day: six courts across, hourly slots down, each cell green for free, terracotta for booked, and grey for floodlight-only. Selecting a free cell adds it to a booking summary.

```tsx
const courts = ['1 Clay', '2 Clay', '3 Clay', '4 Hard', '5 Hard', '6 Indoor'];
const hours = ['08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00'];

<div className="grid gap-1" style={{ gridTemplateColumns: `72px repeat(${courts.length}, 1fr)` }}>
  <span />
  {courts.map(c => <span key={c} className="pb-2 text-center text-[11px] uppercase tracking-wider">{c}</span>)}
  {hours.map(h => (
    <Fragment key={h}>
      <span className="py-2 pr-2 text-right text-xs tabular-nums text-[var(--muted-foreground)]">{h}</span>
      {courts.map(c => {
        const state = getState(c, h);
        return (
          <motion.button key={c + h} whileTap={{ scale: 0.94 }}
            disabled={state !== 'free'}
            className="h-9 rounded-md transition-colors duration-150"
            style={{ background: state === 'free' ? 'var(--accent-court)' : state === 'booked' ? 'var(--primary)' : 'var(--border)', opacity: state === 'free' ? 0.85 : 0.55 }} />
        );
      })}
    </Fragment>
  ))}
</div>
```

**Effect 2 — Ball-bounce section marker.** A small terracotta circle beside each H2 that compresses vertically and rebounds once when the heading enters view, a 0.6s spring — a light nod to a bouncing ball, used sparingly.

## 6. Component Breakdown

1. **Navbar** — 74px, sticky, court white, 1px bottom border. Wordmark left, links centre, `Book a Court` terracotta button and a `Member login` text link right.
2. **Hero** — split, text left, image right. Eyebrow, H1, subline, two CTAs, four club facts. *Image: clay tennis courts from a raised angle in warm afternoon light, net and lines crisp, a few players in the distance.*
3. **Today strip** — courts free right now, current weather, and floodlight availability.
4. **Court booking** — the primary interaction (Effect 1) with a day selector and a booking summary.
5. **Membership** — four tiers: full adult, off-peak, junior, family, with joining fee, annual subscription and what each allows.
6. **Coaching** — 2x3 grid: adult group, adult individual, junior academy, mini tennis, cardio tennis, performance squad, each with day, time and price.
7. **Courts and facilities** — a plain description of the six courts, surfaces, floodlights, and the clubhouse.
8. **Teams and leagues** — men's, ladies' and mixed teams with divisions and match nights.
9. **Social calendar** — the section most club sites forget: club nights, American tournaments, the summer barbecue and the winter quiz.
10. **Juniors** — a dedicated block covering the pathway from mini tennis to squad, with age groups and safeguarding note.
11. **Visitors** — guest fees, court hire without membership, and how to book as a non-member.
12. **Footer** — dark net colour, four columns, LTA affiliation, safeguarding officer contact.

## 7. Animations
- Hero: text fades up 0.7s; image reveals with a clipPath wipe from the right, 1s
- Booking grid: cells fade in with a 0.008s stagger by row; selected cell scales 0.94 on tap and gets a 2px outline
- Section markers: ball-bounce spring on heading entry (Effect 2)
- Membership cards: lift `-4px` with a terracotta 1px border on hover
- Coaching rows: fade-up stagger 0.06s
- Social calendar: date blocks pop `scale 0.9 → 1` staggered 0.08s

## 8. Responsive
- **Mobile (<768px):** hamburger; image stacks above text; H1 clamps to 38px; booking grid becomes a single-court view with a court selector above and hours listed vertically; membership 1-col; coaching 1-col; `Book a Court` pinned as a sticky bottom bar.
- **Tablet:** booking grid keeps all six courts at narrower cells; membership 2x2; coaching 2-col.
- **Desktop:** max width 1180px, `px-16`, `py-22`.

## 9. Full Copy

**Brand:** ASHGROVE TENNIS CLUB · Est. 1934 · Harrogate

**Navbar:** Book a Court · Membership · Coaching · Teams · Juniors · Visitors · `Member login` · [Button] Book a Court

**Hero**
- Eyebrow: `HARROGATE · FOUNDED 1934 · SIX COURTS · LTA AFFILIATED`
- H1: `Four clay, two hard, one very competitive Tuesday night.`
- Subline: `A friendly members club with six courts, floodlights until ten, and coaching from mini tennis to county squad. Visitors welcome, and you do not need whites.`
- CTAs: `Book a Court` · `See Membership`
- Facts: `6 courts` · `Floodlit to 10pm` · `420 members` · `LTA affiliated`

**Today strip:** `Three courts free this afternoon · Floodlights on from 4pm · Clay courts open, hard courts dry`

**Court booking** — Eyebrow `BOOK` — H2 `Courts one to six`
`Members book free up to seven days ahead. Non-members can book from twenty-four hours ahead at the visitor rate. Peak is weekday evenings after five and weekend mornings.`

**Membership**
- **Full Adult — £315 a year** — Joining fee £50 · Unlimited court booking · Team eligibility · Club nights included · Guest rate £8
- **Off-Peak Adult — £185 a year** — Joining fee £50 · Weekdays before 5pm and all day Sunday · Club nights included · Guest rate £10
- **Junior — £95 a year** — No joining fee · Under 18 · Unlimited booking before 6pm · Free access to junior club nights
- **Family — £560 a year** — Joining fee £50 · Two adults and all children under 18 · Full access for everyone · Two free guest passes a month

**Coaching**
1. **Adult Group** — Tue and Thu, 7–8pm · £11 per session, or £90 for a ten-block · All standards, split into three groups on the night.
2. **Adult Individual** — By arrangement · £42 per hour with Head Coach, £34 with assistant coaches.
3. **Junior Academy** — Sat 9–11am · £14 per session · Ages 8–14, grouped by standard rather than age.
4. **Mini Tennis** — Sat 11am–12pm · £8 per session · Ages 4–8, red and orange ball, soft courts.
5. **Cardio Tennis** — Mon and Wed, 6–7pm · £9 per session · No technique instruction, just an hour of moving and hitting.
6. **Performance Squad** — Mon and Thu, 5–7pm · By invitation · County-level juniors, three coaches on court.

**Courts and facilities** — `Courts 1 to 4 are artificial clay, resurfaced in 2024 and playable in almost all weather. Courts 5 and 6 are acrylic hard courts. Court 6 is under the airhall from November to March. All six are floodlit until 10pm, and the lights are on a member card system rather than a token meter.`
`The clubhouse has changing rooms, showers, a bar open Thursday to Sunday, and a viewing balcony over courts one and two.`

**Teams and leagues** — `Men's teams in Yorkshire Divisions 2, 4 and 6 · Ladies' teams in Divisions 1, 3 and 5 · Mixed team in Division 2 · Match nights are Tuesday and Thursday, home matches from 6:30pm, and there is always tea afterwards because that is the rule.`

**Social calendar**
- `Club Night` — Every Wednesday 6:30pm · Turn up, no partner needed, we pair you.
- `American Tournament` — First Sunday monthly, 10am · £4 including lunch.
- `Summer Barbecue` — Second Saturday in July · Free for members, £10 guests.
- `Finals Day` — First Sunday in September · Club championships, Pimm's, mild controversy.
- `Winter Quiz` — Third Friday in January · £5 a head, teams of six, fiercely contested.

**Juniors** — H2 `From red ball to county squad`
`Mini tennis red for four to eight year olds, orange and green through to nine and ten, then full ball in the junior academy. Players who want more move into the performance squad by invitation. Every coach is DBS checked and LTA accredited, and our safeguarding officer's contact is in the footer rather than buried in a policy page.`

**Visitors** — `You do not need to be a member to play. Courts are £14 an hour off-peak and £20 peak, bookable from twenty-four hours ahead. Racket hire is £3 and there are always balls behind the bar. If you play three times, joining works out cheaper, and we will say so.`

**Footer** — ASHGROVE TENNIS CLUB · `Founded 1934` · `Ashgrove Lane, Harrogate HG2 8QR` · `01423 555 0120` · LTA affiliated club 2140884 · Safeguarding officer: Kate Lindsay, safeguarding@ashgrovetennis.co.uk · © 2026

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
