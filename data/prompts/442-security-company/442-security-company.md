# Vantage Security — Security Company Website Prompt

## 1. Goal Statement
Build a hard, credibility-first commercial security website for **Vantage Security**, defined by near-black surfaces, a cold cyan signal colour, and monospace data labels — a site that reads like a control room rather than a brochure.

## 2. Tech Stack
```
React + Vite + TypeScript + Tailwind CSS + Framer Motion (motion/react) + shadcn/ui + lucide-react
```

## 3. Design System — Colors
```css
:root {
  --background: hsl(220, 18%, 7%);       /* #0e1116 */
  --foreground: hsl(210, 16%, 94%);      /* #ecf0f3 */
  --primary: hsl(186, 92%, 46%);         /* #0ad4e0 signal cyan */
  --primary-foreground: hsl(220, 20%, 6%);
  --muted-foreground: hsl(215, 10%, 55%);
  --border: hsl(220, 14%, 18%);
  --card: hsl(220, 16%, 10%);
  --card-elevated: hsl(220, 15%, 14%);
  --alert: hsl(14, 88%, 56%);            /* incident red */
}
```

## 4. Typography
```html
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=IBM+Plex+Mono:wght@400;500&family=Inter:wght@300;400;500&display=swap" rel="stylesheet" />
```
- **H1:** Space Grotesk 700, clamp(38px, 5vw, 74px), letter-spacing -0.03em
- **H2:** Space Grotesk 600, 32–46px
- **H3:** Space Grotesk 500, 18–21px
- **Body:** Inter 300–400, 16px, line-height 1.7
- **Data labels / eyebrows:** IBM Plex Mono 500, uppercase, letter-spacing 0.14em, 11px, cyan
- **Metrics:** Space Grotesk 700, tabular-nums

## 5. Visual Effects

**Effect 1 — Live monitoring ticker.** A monospace strip beneath the hero that cycles through anonymised status lines on a 3-second interval, mimicking a control room feed.

```tsx
const lines = [
  'SITE 0412 · PERIMETER CLEAR · 03:42',
  'SITE 0117 · PATROL LOGGED · 03:44',
  'SITE 0288 · ALARM ACK 41s · 03:46',
  'SITE 0503 · KEYHOLDER NOTIFIED · 03:49',
];
const [i, setI] = useState(0);
useEffect(() => {
  const t = setInterval(() => setI(v => (v + 1) % lines.length), 3000);
  return () => clearInterval(t);
}, []);

<AnimatePresence mode="wait">
  <motion.span key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.3 }}
    className="font-mono text-sm tracking-wider text-[var(--primary)]">
    {lines[i]}
  </motion.span>
</AnimatePresence>
```

**Effect 2 — Scanline grid overlay.** A fixed pointer-events-none overlay with 1px horizontal lines at 4px intervals at 3% opacity, giving every section a faint monitor texture.

## 6. Component Breakdown

1. **Navbar** — 74px, fixed, `rgba(14,17,22,0.94)` with blur, cyan 1px bottom border after scroll. Wordmark left, links centre, 24/7 control room number in mono and `Request a Site Survey` cyan button right.
2. **Hero** — 92vh, full-bleed night image with heavy left gradient. Mono eyebrow, H1, subline, two CTAs, four accreditation badges. *Image: security operations centre at night, wall of monitors glowing, dark room, cool blue light, cinematic.*
3. **Monitoring ticker** — the live strip (Effect 1) on a card band.
4. **Services** — 2x3 grid: manned guarding, mobile patrols, alarm response, CCTV monitoring, access control, event security. Cyan left border, mono service code above each title.
5. **Response metrics** — four count-up figures on `--card`: average alarm response, sites monitored, officers SIA licensed, control room uptime.
6. **How a call-out runs** — five-step horizontal timeline with mono timestamps, from alarm trigger to written incident report.
7. **Sectors** — four blocks: construction, retail, logistics, education, each with a two-sentence description and a specific risk it addresses.
8. **Accreditations** — text badge row: SIA Approved Contractor, NSI Gold, ISO 9001, Safe Contractor, ACS Pacesetter.
9. **Case snapshot** — one anonymised incident told in four short beats with mono timestamps.
10. **Request a survey** — split: form on the left, control room contact block on the right.
11. **Footer** — darkest slate, cyan top border, four columns, SIA licence number, 24/7 number repeated.

## 7. Animations
- Hero: H1 fades up 0.7s; badges stagger 0.06s
- Ticker: `AnimatePresence` swap every 3s, 0.3s transition
- Scanlines: static, no animation (motion here would be nauseating)
- Service cards: cyan left border grows 3px → 6px on hover, 0.25s
- Metrics: count-up 1600ms on `useInView`
- Timeline: cyan connecting line `scaleX 0 → 1`, 0.9s; nodes pop staggered 0.1s
- Case snapshot beats: fade in as the reader scrolls, `x: -16 → 0`

## 8. Responsive
- **Mobile (<768px):** hamburger with a tap-to-call control room button pinned in the overlay; H1 clamps to 38px; ticker text shortens to site code and status; services 1-col; metrics 2x2; timeline vertical with a left cyan rule; survey form full-width.
- **Tablet:** services 2-col, sectors 2x2, timeline stays horizontal.
- **Desktop:** max width 1240px, `px-16`, `py-24`.

## 9. Full Copy

**Brand:** VANTAGE SECURITY · Manchester

**Navbar:** Services · Sectors · Response · Accreditations · Contact · `0161 555 0100` · [Button] Request a Site Survey

**Hero**
- Eyebrow: `MANCHESTER · SIA APPROVED CONTRACTOR · CONTROL ROOM STAFFED 24/7/365`
- H1: `Someone is watching. Actually watching.`
- Subline: `Manned guarding, mobile patrols, and alarm response across the North West, run from our own control room. No call centre, no answering service, no forty-minute wait to speak to a human at 3am.`
- CTAs: `Request a Site Survey` · `Call the Control Room`
- Badges: `SIA APPROVED` · `NSI GOLD` · `ISO 9001` · `ACS PACESETTER`

**Ticker lines:** `SITE 0412 · PERIMETER CLEAR · 03:42` · `SITE 0117 · PATROL LOGGED · 03:44` · `SITE 0288 · ALARM ACK 41s · 03:46` · `SITE 0503 · KEYHOLDER NOTIFIED · 03:49`

**Services**
1. `SVC-01` **Manned Guarding** — SIA licensed officers on site, vetted to BS 7858. Static posts, gatehouse control, and reception security with documented handovers every shift.
2. `SVC-02` **Mobile Patrols** — Randomised patrol schedules with GPS-logged checkpoints. You get a timestamped report every morning showing exactly where we were and when.
3. `SVC-03` **Alarm Response** — Keyholding and response, average acknowledgement in forty-one seconds. We attend, assess, secure, and file a written incident report before we leave.
4. `SVC-04` **CCTV Monitoring** — Live remote monitoring from our control room with audio challenge. Intruders are spoken to on site, which resolves most incidents before anyone has to attend.
5. `SVC-05` **Access Control** — Design, installation, and management of card, fob, and biometric systems, including visitor management and audit trails.
6. `SVC-06` **Event Security** — Crowd management, search teams, and stewarding for events from two hundred to twelve thousand, with a documented safety plan.

**Metrics** — `41s` Average alarm acknowledgement · `340` Sites monitored · `100%` Officers SIA licensed · `99.98%` Control room uptime

**Call-out timeline**
1. `T+0s` **Alarm triggers** — Signal reaches the control room directly, not via a third party.
2. `T+41s` **Operator acknowledges** — A named operator picks it up and pulls the camera feed for the zone.
3. `T+2m` **Audio challenge or dispatch** — Most incidents end here. If not, the nearest patrol is dispatched.
4. `T+18m` **Officer on site** — Average attendance across our North West coverage. Site is checked, secured, and photographed.
5. `T+90m` **Written report** — A timestamped incident report with images lands in your inbox before the morning.

**Sectors**
- **Construction** — Plant theft, fuel theft, and metal. We secure compounds during the highest-risk window, which is almost always between 1am and 4am on a Sunday.
- **Retail** — Loss prevention, opening and closing cover, and a visible presence during trading hours that reduces incidents without making customers uneasy.
- **Logistics** — Gatehouse control, vehicle checks, and load verification, with audit trails that stand up when a customer disputes a delivery.
- **Education** — Out-of-hours campus patrols and lone-worker cover, delivered by officers who have been enhanced DBS checked as standard.

**Case snapshot** — H2 `ONE NIGHT IN NOVEMBER`
`02:14` Perimeter beam triggered at a construction compound in Salford. `02:15` Operator pulled the feed and identified three individuals near a plant store. `02:16` Audio challenge issued over the site speakers. Two left immediately. `02:31` Patrol officer on site, third individual gone, no plant taken, one damaged padlock. Written report with stills issued at 03:40.

**Survey form** — Company / Contact name / Email / Phone / Site type / What are you trying to protect? → [Button] `Request a Site Survey`
Note: `Surveys are free, take about an hour, and we will tell you if you need less than you think.`

**Footer** — VANTAGE SECURITY · `Control room staffed 24/7/365` · `Unit 4, Trafford Point, Manchester M17 1AB` · `0161 555 0100` · SIA Approved Contractor #ACS-0084412 · © 2026

## 10. Key Dependencies
```json
{
  "motion": "^12.0.0",
  "lucide-react": "^0.460.0",
  "clsx": "^2.1.0",
  "tailwind-merge": "^2.5.0"
}
```
