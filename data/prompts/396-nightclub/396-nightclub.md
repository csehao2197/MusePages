# Substrata — Nightclub Website Prompt

## 1. Goal Statement
Build a hard, club-culture nightclub website for **Substrata**, defined by true black, an acid green, and a stretched technical sans — built around a lineup listing and a table booking flow, with the door policy stated honestly rather than left as a surprise at 1am.

## 2. Tech Stack
```
React + Vite + TypeScript + Tailwind CSS + Framer Motion (motion/react) + shadcn/ui + lucide-react
```

## 3. Design System — Colors
```css
:root {
  --background: hsl(0, 0%, 3%);          /* #080808 true black */
  --foreground: hsl(0, 0%, 96%);         /* #f5f5f5 */
  --primary: hsl(88, 96%, 56%);          /* #b6f81f acid green */
  --primary-foreground: hsl(0, 0%, 4%);
  --muted-foreground: hsl(0, 0%, 52%);
  --border: hsl(0, 0%, 14%);
  --card: hsl(0, 0%, 7%);
  --card-elevated: hsl(0, 0%, 11%);
  --sold-out: hsl(340, 88%, 58%);        /* magenta, sold out */
}
```

## 4. Typography
```html
<link href="https://fonts.googleapis.com/css2?family=Anton&family=Space+Mono:wght@400;700&family=Inter:wght@300;400;500&display=swap" rel="stylesheet" />
```
- **H1:** Anton 400, uppercase, clamp(48px, 8vw, 140px), letter-spacing -0.02em, line-height 0.85
- **H2:** Anton 400, uppercase, 36–64px
- **H3 / artist names:** Anton 400, uppercase, 20–26px
- **Body:** Inter 300–400, 16px, line-height 1.68
- **Dates, times, ticket prices:** Space Mono 700, uppercase, tabular-nums
- **Eyebrows:** Space Mono 400, uppercase, letter-spacing 0.2em, 11px, acid green

## 5. Visual Effects

**Effect 1 — Lineup list with hover artwork.** Events as a full-width list of monospace dates and huge Anton artist names. Hovering a row fades in the event artwork as a fixed background panel behind the list at low opacity, so the page changes mood as the pointer moves down the lineup.

```tsx
const [hovered, setHovered] = useState(null);

<div className="relative">
  <AnimatePresence>
    {hovered && (
      <motion.img
        key={hovered}
        src=""
        alt="Event artwork"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.22 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        className="pointer-events-none fixed inset-0 h-full w-full object-cover object-center"
      />
    )}
  </AnimatePresence>

  {events.map(e => (
    <a
      key={e.id}
      onMouseEnter={() => setHovered(e.id)}
      onMouseLeave={() => setHovered(null)}
      className="group relative z-10 flex items-baseline gap-8 border-b border-[var(--border)] py-7"
    >
      <span className="w-28 font-mono text-sm text-[var(--primary)]">{e.date}</span>
      <span className="font-display text-4xl uppercase transition-transform duration-300 group-hover:translate-x-2 md:text-6xl">
        {e.artist}
      </span>
      <span className="ml-auto font-mono text-sm">{e.soldOut ? 'SOLD OUT' : e.price}</span>
    </a>
  ))}
</div>
```
Media brief per event: abstract club photography with heavy colour cast, crowd silhouettes and light beams, high contrast and grain.

**Effect 2 — Acid green scanline sweep.** A single thin acid-green horizontal line that sweeps down the hero once on load over 1.2 seconds and disappears, referencing a laser sweep without becoming a strobe. Disabled entirely under reduced motion.

## 6. Component Breakdown

1. **Navbar** — 68px, fixed, true black, acid green 1px bottom border after scroll. Wordmark left, links centre, `Tickets` acid green square button right.
2. **Hero** — 94vh, near-empty. Huge Anton wordmark or headline, a monospace line naming the next event, and two CTAs. Minimal imagery, maximum type. Scanline sweep on load.
3. **Next event bar** — a monospace strip with the next event, date, doors time and remaining ticket tier.
4. **Lineup** — the primary section (Effect 1), twelve upcoming events.
5. **The rooms** — three rooms described with capacity, sound system make and musical policy. Sound system specifics matter enormously to this audience.
6. **Tables and booking** — four table tiers with minimum spend, capacity and what is included, plus a booking form.
7. **Door policy** — the honesty section: age, ID accepted, dress, phone policy on the dancefloor, and the behaviour that gets people removed. Stated plainly.
8. **Safety and welfare** — welfare team, drink covers, anti-spiking measures, and how to find a marshal. This section is now expected by the audience and most club sites still omit it.
9. **Residents** — four resident DJs with a one-line description and a mix link.
10. **Venue hire** — private hire for launches and label nights with capacity and contact.
11. **Getting home** — night bus routes, taxi rank location, and the last train, which is the most-used practical information on any club site.
12. **Footer** — black, acid green top rule, four columns, licence number, address, socials.

## 7. Animations
- Hero: scanline sweeps down once over 1.2s on load; headline letters fade up staggered 0.03s
- Lineup rows: artwork cross-fades to 0.22 opacity behind the list on hover, 0.4s; artist name translates 8px right, 0.3s
- Sold-out rows: magenta text, no hover artwork, cursor not-allowed
- Table tiers: acid green border fades in on hover, no lift
- Room cards: capacity figure counts up on entry
- Everything else is deliberately still — the movement lives in the lineup interaction

## 8. Responsive
- **Mobile (<768px):** hamburger with a full-screen black overlay; H1 clamps to 48px; lineup rows stack date above artist name with the price beneath, and hover artwork is replaced by a small inline thumbnail since hover does not exist; tables 1-col; getting-home section pinned high because that is what people open at 2am.
- **Tablet:** lineup keeps the single-row layout at 40px names; tables 2x2.
- **Desktop:** max width 1320px, `px-16`, `py-20`.

## 9. Full Copy

**Brand:** SUBSTRATA · Nightclub · Rotterdam

**Navbar:** Lineup · Rooms · Tables · Door Policy · Venue Hire · [Button] Tickets

**Hero**
- Eyebrow: `ROTTERDAM · THREE ROOMS · 23:00 – 06:00 · SINCE 2016`
- H1: `SUBSTRATA`
- Next line: `FRI 12 SEP — ANSWER CODE / HELENA VOSS / KIN — DOORS 23:00 — €18 THIRD RELEASE`
- CTAs: `See the Lineup` · `Tickets`

**Next event bar:** `NEXT: FRI 12 SEP · ANSWER CODE · DOORS 23:00 · THIRD RELEASE €18 · 60 LEFT`

**Lineup** — Eyebrow `UPCOMING` — H2 `LINEUP`
- `FRI 12 SEP` — **ANSWER CODE** — €18
- `SAT 13 SEP` — **HELENA VOSS** — SOLD OUT
- `FRI 19 SEP` — **KIN + RESIDENTS** — €14
- `SAT 20 SEP` — **NEROLI B2B TESSELLATE** — €20
- `FRI 26 SEP` — **BASEMENT SERIES 04** — €12
- `SAT 27 SEP` — **MARCEL DETTMANN** — €26
- `FRI 03 OCT` — **LOW FREQUENCY COLLECTIVE** — €14
- `SAT 04 OCT` — **ANASTASIA KOVA** — €22
- `FRI 10 OCT` — **RESIDENTS ALL NIGHT** — €10
- `SAT 11 OCT` — **OCTO OCTA** — SOLD OUT
- `FRI 17 OCT` — **SUBSTRATA X NACHTLAB** — €16
- `SAT 18 OCT` — **FIVE YEAR ANNIVERSARY** — €30

**The rooms**
1. **Main** — Capacity 700 — Funktion-One Vero, four-point. Techno, hard groove, and whatever the headliner brought. No phones on the floor during headline sets.
2. **Basement** — Capacity 240 — Void Incubus with a custom sub array. Dub, electro and the stuff that would empty the main room. Where the residents actually want to play.
3. **The Annex** — Capacity 160 — Martin Audio, warmer and quieter. House, disco and breaks, and the only room where you can hold a conversation.

**Tables and booking**
- **Booth, Annex — €250 minimum spend** — Up to 6 · Two bottles of spirits with mixers · Queue jump · Table until 04:00
- **Booth, Main — €450 minimum spend** — Up to 8 · Three bottles with mixers · Queue jump · Table all night · Host
- **Balcony, Main — €700 minimum spend** — Up to 12 · Five bottles with mixers · Private entrance · Table all night · Host
- **Basement Corner — €350 minimum spend** — Up to 8 · Three bottles with mixers · Best sound in the building and the worst view, which is the point

**Door policy** — Eyebrow `DOOR` — H2 `READ THIS BEFORE YOU COME`
`18+, ID required, no exceptions and no arguments. We accept passport, national ID card and EU driving licence. We do not accept photographs of documents, expired ID, or your mate vouching for you.`
`There is no dress code. There is a behaviour code. If you are aggressive, if you touch people who have not invited it, or if you spend the night filming strangers, you will be removed and refused re-entry. That is the entire policy and it is not negotiable.`
`No phones on the dancefloor during headline sets in Main. Stickers over cameras at the door. People hate this for about ten minutes and then thank us.`
`Last entry 03:00. Re-entry is not permitted after 02:00.`

**Safety and welfare** — H2 `WELFARE`
`Two trained welfare staff on every night, in pink hi-vis, in the corridor between Main and Basement. They are not security and they are not there to get you in trouble. Free water at every bar, always, no queue.`
`Drink covers available free at every bar and at the cloakroom. If you think your drink has been tampered with, tell any staff member and we will get you to welfare, keep the drink, and call someone if you want us to. We test and we report.`
`If you feel unsafe for any reason, ask any staff member for Angela. There is nobody here called Angela. It tells us to get you out quietly.`

**Residents**
1. **KIN** — Basement resident since 2016. Electro, breaks, and a records-only policy that is genuinely not a pose.
2. **Tessellate** — Main room. Hard groove and the closing set most Saturdays.
3. **Neroli** — Annex. House and disco, and the only person here who will play something with a vocal.
4. **Low Frequency Collective** — A rotating three-person crew running the last Friday of every month.

**Venue hire** — `Full venue hire for label nights, launches and showcases. 1,100 capacity across three rooms, in-house production, and a technical rider we can usually meet without hiring anything in. Weeknights from €2,800. Contact bookings@substrata.nl.`

**Getting home** — H2 `AT 06:00`
`Night bus B4 from Schiedamse Vest, every thirty minutes until 05:30 · Taxi rank on Westblaak, sixty metres left out of the door, and it is a proper rank rather than a place cars sometimes stop · First metro from Beurs at 05:54 · If you need a taxi and have no money, ask at the cloakroom. We have an account and we would rather you got home.`

**Footer** — SUBSTRATA · `Three rooms. 23:00 – 06:00.` · `Schiedamse Vest 148, 3011 BG Rotterdam` · Licence 2016-NL-4482 · `hello@substrata.nl` · © 2026

## 10. Key Dependencies
```json
{
  "motion": "^12.0.0",
  "lucide-react": "^0.460.0",
  "clsx": "^2.1.0",
  "tailwind-merge": "^2.5.0"
}
```
