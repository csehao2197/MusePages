# Blackthorn Paintball — Paintball Website Prompt

## 1. Goal Statement
Build a high-adrenaline outdoor paintball website for **Blackthorn**, defined by woodland black, a hot safety orange, and a stencilled military-inflected display face — built around a group booking calculator and a game zone map, because every enquiry starts with "how much for twelve of us".

## 2. Tech Stack
```
React + Vite + TypeScript + Tailwind CSS + Framer Motion (motion/react) + shadcn/ui + lucide-react
```

## 3. Design System — Colors
```css
:root {
  --background: hsl(100, 10%, 9%);       /* #161a14 woodland black */
  --foreground: hsl(60, 12%, 92%);       /* #ecece6 */
  --primary: hsl(20, 96%, 54%);          /* #fb5b13 safety orange */
  --primary-foreground: hsl(100, 12%, 8%);
  --muted-foreground: hsl(90, 6%, 56%);
  --border: hsl(100, 8%, 19%);
  --card: hsl(100, 9%, 13%);
  --card-elevated: hsl(100, 8%, 17%);
  --accent-olive: hsl(80, 24%, 38%);     /* olive drab */
}
```

## 4. Typography
```html
<link href="https://fonts.googleapis.com/css2?family=Oswald:wght@500;600;700&family=Inter:wght@300;400;500&display=swap" rel="stylesheet" />
```
- **H1:** Oswald 700, uppercase, clamp(42px, 6.2vw, 92px), letter-spacing 0.005em, line-height 0.95
- **H2:** Oswald 600, uppercase, 32–50px
- **H3:** Oswald 600, 19–22px
- **Body:** Inter 300–400, 16px, line-height 1.7
- **Eyebrows:** Inter 600, uppercase, letter-spacing 0.22em, 11px, orange
- **Prices / player counts / paintball counts:** Oswald 700, tabular-nums

## 5. Visual Effects

**Effect 1 — Group booking calculator.** Player count, package tier and extra paintballs produce a live per-person and total price, with the group discount applying automatically at ten and twenty players. It answers the only question the enquiry email ever contains.

```tsx
const packages = [
  { id: 'rookie',  name: 'Rookie',  base: 25, balls: 100 },
  { id: 'regular', name: 'Regular', base: 35, balls: 300 },
  { id: 'assault', name: 'Assault', base: 45, balls: 600 },
];
const [players, setPlayers] = useState(12);
const [pkg, setPkg] = useState('regular');
const [extra, setExtra] = useState(0);

const p = packages.find(x => x.id === pkg);
const discount = players >= 20 ? 0.85 : players >= 10 ? 0.9 : 1;
const perPerson = Math.round((p.base + extra * 0.04) * discount);

<motion.div key={perPerson * players} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.22 }}>
  <p className="font-display text-6xl tabular-nums text-[var(--primary)]">£{perPerson * players}</p>
  <p className="mt-1 text-[var(--muted-foreground)]">
    £{perPerson} per player · {players} players · {p.balls + extra} paintballs each
  </p>
</motion.div>
```

**Effect 2 — Paint splat reveal.** Section headings are preceded by a small orange SVG splat whose scale animates 0 to 1 with a hard overshoot spring and a slight random rotation per instance, giving each section a different splat without needing multiple assets.

## 6. Component Breakdown

1. **Navbar** — 72px, fixed, woodland black with blur, orange 2px bottom border after scroll. Stencilled wordmark left, links centre, `Book Your Group` orange square button right.
2. **Hero** — 92vh, full-bleed action photograph with a heavy bottom gradient. Eyebrow, huge uppercase H1, subline, two CTAs, four facts. *Image: paintball players advancing through woodland with paint smoke, dramatic backlight, motion and grit, action sports photography.*
3. **Booking calculator** — the primary conversion element (Effect 1), directly under the hero.
4. **Packages** — three tiers with what is included, paintball count, and who each suits.
5. **Game zones** — six numbered zones on a stylised map, each with a name, terrain description and the game type it suits.
6. **A typical day** — an eight-step timeline from arrival briefing to the last game, with times.
7. **Safety and kit** — the section parents read: full-head protection, marker velocity testing, marshal ratios, and the minimum age.
8. **Parties and corporate** — two blocks covering birthdays and team days, with catering options and private hire pricing.
9. **What to wear and bring** — a practical list that reduces the phone calls.
10. **Reviews** — three quotes with group type and size.
11. **Booking** — date picker, group size, package, and a deposit note.
12. **Footer** — darkest woodland, orange top rule, four columns, insurance, UKPSF affiliation, address.

## 7. Animations
- Hero: H1 lines reveal with a clipPath wipe staggered 0.09s; facts fade in at 0.6s
- Splat markers: scale 0 to 1 with a hard spring, random rotation per instance
- Calculator: total re-mounts and fades on any change, 0.22s; the discount badge pops in when the threshold is crossed
- Package cards: middle tier at scale 1.03 at rest; all lift 5px on hover with an orange border
- Zone map: numbered pins pop staggered 0.1s; hovering a pin highlights its row in the list
- Timeline: orange connecting line scales from left, 0.9s
- Motion is punchy — springs and short durations throughout

## 8. Responsive
- **Mobile (<768px):** hamburger with a full-screen dark overlay; H1 clamps to 42px; calculator inputs stack full width with the total pinned as a sticky bottom bar; packages 1-col with the popular tier first; zone map becomes a vertical list with the map image above; timeline vertical.
- **Tablet:** packages 3-col, zones 2-col, calculator side-by-side with the total.
- **Desktop:** max width 1200px, `px-16`, `py-20`.

## 9. Full Copy

**Brand:** BLACKTHORN PAINTBALL · 40 acres of woodland · Kent

**Navbar:** Book · Packages · Game Zones · Safety · Parties · Find Us · [Button] Book Your Group

**Hero**
- Eyebrow: `KENT · 40 ACRES · SIX GAME ZONES · AGES 12+ · OPEN ALL YEAR`
- H1: `FORTY ACRES. SIX ZONES. ONE VERY LONG SHOWER AFTERWARDS.`
- Subline: `Outdoor woodland paintball in Kent, forty minutes from London. Real terrain rather than an inflatable arena, full-face protection, and marshals who actually marshal.`
- CTAs: `Book Your Group` · `See the Zones`
- Facts: `40 acres` · `6 game zones` · `Ages 12+` · `1 marshal per 8 players`

**Booking calculator** — Eyebrow `WORK OUT THE COST` — H2 `HOW MUCH FOR YOUR GROUP`
Inputs: player count stepper, package tier, extra paintballs slider
Discounts: `10+ players, 10% off · 20+ players, 15% off`
Note: `Minimum group size is six. Below that, join an open day on Saturdays and we will put you into a team.`

**Packages**
- **Rookie — £25 per player** — 100 paintballs · Full kit and overalls · Half day, four games · Best for first-timers, under-16 parties and anyone unsure they will enjoy being shot at.
- **Regular — £35 per player** *(most booked)* — 300 paintballs · Full kit, overalls and gloves · Full day, eight games across all six zones · The right choice for almost every group.
- **Assault — £45 per player** — 600 paintballs · Full kit, overalls, gloves and a barrel upgrade · Full day, eight games, plus priority zone selection · For groups who have done it before and ran out of paint by lunch.
Extras: `Additional paintballs £4 per 100 · Smoke grenade £8 · Paint grenade £6 · Barrel upgrade £5 · Overalls upgrade to camo £4`

**Game zones**
1. **The Village** — Twelve wooden buildings, tight lanes, and no long sightlines. Close-quarters, fast respawns, and the loudest zone on site.
2. **Trench Line** — Two hundred metres of dug trench and sandbag positions. Slow, tactical, and the zone that decides most tournaments.
3. **The Chapel** — A two-storey ruin with a bell tower. Attack and defend, and whoever holds the tower usually wins until they do not.
4. **Deep Wood** — Natural woodland with no built cover. Pure movement and communication. Nowhere to hide and no map to memorise.
5. **The Yard** — Shipping containers, pallets and vehicle wrecks. Cover everywhere, sightlines nowhere, chaos throughout.
6. **The Bridge** — A single crossing over a dry stream bed with steep banks. Simple objective, brutal execution, always the last game of the day.

**A typical day**
- `09:30` **Arrival and registration** — Sign in, waivers, and a coffee while we sort kit sizes.
- `09:50` **Safety briefing** — Fifteen minutes, mandatory, and genuinely important. Nobody enters a zone without it.
- `10:10` **Kit issue and chrono** — Overalls, mask, marker and hopper. Every marker velocity tested at 280 feet per second.
- `10:30` **Games one and two** — Starting in The Village to get everyone moving and shooting.
- `12:30` **Lunch** — An hour. Bring your own or add catering.
- `13:30` **Games three to six** — Rotating through the remaining zones.
- `15:45` **The Bridge** — Always last, always everyone, always the one people talk about in the car.
- `16:15` **Kit return and photos** — Hand back kit, collect valuables, look at the state of yourselves.

**Safety and kit** — H2 `THE BORING SECTION THAT MATTERS`
`Full-face masks with thermal lenses, tested to EN166. Every marker chronographed at 280 feet per second before every session and spot-checked between games. One marshal per eight players, all first-aid trained, all with the authority to stop a game and use it.`
`Minimum age twelve, with a lower-velocity marker and a separate junior programme for twelve to fifteens. Under 18s need a parent or guardian signature on the waiver, and we will not accept a photo of one.`
`Overalls, gloves, neck protector and body armour are included in every package. Bruises are normal. Injuries are not, and in eleven years we have had four requiring more than a plaster.`

**Parties and corporate**
- **Birthdays** — Minimum eight players. Private party room for two hours, hot food option at £9 a head, and the birthday person gets fifty free paintballs and a hat they will hate.
- **Corporate and team days** — Private site hire from £1,400 for up to forty players, exclusive use of all six zones, catering, and a scoring format that is deliberately not just the fittest person wins.

**What to wear and bring** — `Old trainers or walking boots with ankle support · Long socks · A hoodie or jumper under the overalls, even in summer · A change of clothes and a bin bag for the muddy ones · Lunch, unless you have added catering · Cash or card for extra paint, which you will buy`
`Do not bring: white clothes, anything you like, or contact lenses if you can help it.`

**Reviews**
1. `Stag do, sixteen of us, most of them hungover. The marshals were funny, firm and did not let it get stupid. Best day of the weekend by a mile.` — **Danny F.**, Stag group of 16
2. `Twelve-year-old's birthday and I was nervous about it. The junior setup is genuinely different, not just the same thing with a warning. He has asked to go back twice.` — **Suzanne A.**, Birthday party of 10
3. `Company away day. The scoring format meant our least sporty person's team won, which was worth every penny of the site hire.` — **Rob K.**, Corporate group of 34

**Booking** — Date / Number of players / Package / Contact details → [Button] `Check Availability`
Note: `£10 per player deposit to confirm, balance on the day. Free to move your date up to seven days before. We run whatever the weather except lightning, and woodland in the rain is genuinely better.`

**Footer** — BLACKTHORN PAINTBALL · `Forty acres. Six zones.` · `Blackthorn Woods, Bethersden Road, Ashford, Kent TN26 3DY` · `01233 555 0182` · UKPSF affiliated · £5m public liability · Open Sat and Sun year-round, weekdays for private bookings · © 2026

## 10. Key Dependencies
```json
{
  "motion": "^12.0.0",
  "lucide-react": "^0.460.0",
  "@radix-ui/react-slider": "^1.2.0",
  "react-day-picker": "^9.0.0",
  "clsx": "^2.1.0",
  "tailwind-merge": "^2.5.0"
}
```
