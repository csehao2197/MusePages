# Kestrel Precision — Manufacturing Website Prompt

## 1. Goal Statement
Build a technical, spec-driven contract manufacturing website for **Kestrel Precision**, defined by machined steel grey, a cold cyan, and monospace data — a site that sells tolerances, certifications and lead times to engineers who will never read a paragraph of marketing copy.

## 2. Tech Stack
```
React + Vite + TypeScript + Tailwind CSS + Framer Motion (motion/react) + shadcn/ui + lucide-react
```

## 3. Design System — Colors
```css
:root {
  --background: hsl(215, 16%, 10%);      /* #15181d machined dark */
  --foreground: hsl(210, 14%, 93%);      /* #eaedf0 */
  --primary: hsl(190, 90%, 48%);         /* #0cbde8 cold cyan */
  --primary-foreground: hsl(215, 18%, 8%);
  --muted-foreground: hsl(212, 8%, 55%);
  --border: hsl(215, 12%, 20%);
  --card: hsl(215, 14%, 13%);
  --card-elevated: hsl(215, 12%, 17%);
  --spec: hsl(45, 92%, 58%);             /* tolerance highlight */
}
```

## 4. Typography
```html
<link href="https://fonts.googleapis.com/css2?family=Barlow:wght@500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet" />
```
- **H1:** Barlow 700, clamp(38px, 5vw, 72px), letter-spacing -0.025em
- **H2:** Barlow 600, 30–44px
- **H3:** Barlow 600, 18–20px
- **Body:** Barlow 500, 16px, line-height 1.68
- **Specs / eyebrows / part numbers:** IBM Plex Mono 500, uppercase, letter-spacing 0.12em, 11px, cyan
- **Tolerances and capacities:** Barlow 700, tabular-nums

## 5. Visual Effects

**Effect 1 — Capability matrix.** A dense table of processes against materials, with cells marked by a cyan dot for standard capability, a hollow ring for available on request, and empty for not offered. Rows animate in with a stagger, and hovering a cell surfaces the tolerance achievable.

```tsx
const processes = ['CNC milling', 'CNC turning', 'Wire EDM', 'Surface grinding', 'Sheet fabrication'];
const materials = ['Aluminium', 'Stainless', 'Tool steel', 'Titanium', 'Brass', 'Engineering plastics'];

{processes.map((p, r) => (
  <motion.tr
    key={p}
    initial={{ opacity: 0, x: -12 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.4, delay: r * 0.06 }}
  >
    <th className="py-3 pr-6 text-left font-mono text-[11px] uppercase tracking-wider">{p}</th>
    {materials.map(m => {
      const level = matrix[p][m];
      return (
        <td key={m} className="group relative py-3 text-center">
          <span
            className="inline-block h-3 w-3 rounded-full transition-transform group-hover:scale-125"
            style={{
              background: level === 2 ? 'var(--primary)' : 'transparent',
              border: level === 1 ? '1.5px solid var(--primary)' : 'none',
            }}
          />
        </td>
      );
    })}
  </motion.tr>
))}
```

**Effect 2 — Tolerance callout.** A cyan monospace figure that counts down from a coarse tolerance to the achievable one on scroll, landing on the headline number the whole site is built to communicate.

## 6. Component Breakdown

1. **Navbar** — 70px, fixed, dark with blur, cyan 1px bottom border after scroll. Wordmark left, links centre, `Request a Quote` cyan button and an `Upload drawings` text link right.
2. **Hero** — 84vh, split. Text left, machine photograph right. Mono eyebrow, H1, subline, two CTAs, four certification chips. *Image: a five-axis CNC machining centre mid-cut with coolant spray, close crop, cold industrial lighting, sharp mechanical detail.*
3. **Capability matrix** — the section engineers actually scroll to (Effect 1).
4. **Tolerances and capacity** — four count-up figures: achievable tolerance, largest envelope, spindle count, and typical lead time.
5. **Processes** — 2x3 cards: CNC milling, CNC turning, wire EDM, surface grinding, sheet fabrication, assembly, each with axis counts and envelope sizes.
6. **Quality and certification** — ISO 9001 and AS9100 with audit dates, CMM inspection equipment listed by make, and a statement on first article inspection reports.
7. **Sectors** — four blocks: aerospace, medical devices, motorsport, industrial automation, each naming the specific constraint that sector brings.
8. **How to get a quote** — three steps with accepted file formats and the twenty-four hour turnaround on standard enquiries.
9. **Prototype to production** — a short section on batch sizes from one-off to ten thousand and how pricing changes across them.
10. **Machine list** — a plain monospace table of every machine with make, model, axes and working envelope. Nothing sells a machine shop like the machine list.
11. **Quote form** — file upload note, quantity, material, tolerance and required date.
12. **Footer** — darkest slate, cyan top rule, four columns, registration, ISO certificate numbers, address.

## 7. Animations
- Hero: text fades up 0.6s; image reveals with a clipPath wipe from the right, 0.9s; certification chips stagger 0.06s
- Capability matrix: rows slide in from the left, staggered 0.06s; cell dots scale 1.25 on hover
- Tolerance callout: counts from 0.1 down to 0.005 over 1.6s
- Capacity figures: count-up 1600ms on useInView
- Process cards: cyan 1px border fades in on hover, no transform
- Machine table rows: fade in staggered 0.03s
- Motion is precise and minimal — a machine shop site should feel engineered, not designed

## 8. Responsive
- **Mobile (<768px):** hamburger; H1 clamps to 38px; capability matrix becomes a per-process accordion listing materials, since a six-column matrix cannot work at 375px; capacity figures 2x2; machine table becomes stacked cards; `Request a Quote` pinned as a sticky bottom bar.
- **Tablet:** matrix keeps table form with material headers rotated; processes 2-col.
- **Desktop:** max width 1240px, `px-16`, `py-22`.

## 9. Full Copy

**Brand:** KESTREL PRECISION · Contract manufacturing · Coventry

**Navbar:** Capabilities · Quality · Sectors · Machines · Quote · [Button] Request a Quote

**Hero**
- Eyebrow: `CONTRACT MANUFACTURING · COVENTRY · ISO 9001 & AS9100 · SINCE 1994`
- H1: `Five microns, repeatably, at volume.`
- Subline: `Precision CNC machining and fabrication for aerospace, medical and motorsport. Fourteen machines, in-house CMM inspection, and a quote back within twenty-four hours on standard enquiries.`
- CTAs: `Request a Quote` · `See Capabilities`
- Chips: `ISO 9001:2015` · `AS9100 Rev D` · `ITAR REGISTERED` · `UKAS CALIBRATED`

**Capability matrix** — Eyebrow `CAPABILITY` — H2 `What we cut and what we cut it in`
Processes: CNC milling · CNC turning · Wire EDM · Surface grinding · Sheet fabrication
Materials: Aluminium · Stainless · Tool steel · Titanium · Brass · Engineering plastics
Legend: `Filled dot = standard capability` · `Ring = available on request` · `Empty = not offered`

**Capacity figures** — `±0.005mm` Achievable tolerance · `1200 × 600 × 500mm` Largest envelope · `14` CNC machines · `9 days` Typical lead time

**Processes**
1. **CNC Milling** — 3, 4 and 5-axis. Largest envelope 1200 × 600 × 500mm. Simultaneous 5-axis on two machines for complex geometry in a single setup.
2. **CNC Turning** — Up to 350mm diameter, 900mm between centres, with live tooling and sub-spindle for done-in-one parts.
3. **Wire EDM** — 400 × 300 × 250mm, ±0.003mm positional, for hardened tool steel and profiles milling cannot reach.
4. **Surface Grinding** — 600 × 300mm table, Ra 0.2 achievable, for flatness and finish requirements beyond machining.
5. **Sheet Fabrication** — Laser cutting to 12mm mild steel, press brake to 3m, TIG and MIG welding with coded welders.
6. **Assembly and Sub-assembly** — Kitting, mechanical assembly, helicoil insertion, and packing to customer specification.

**Quality and certification** — H2 `Inspection is not an afterthought here`
`ISO 9001:2015 since 2003, AS9100 Rev D since 2011, both last audited March 2026 with no major non-conformances. ITAR registered. All measurement equipment UKAS calibrated on a twelve-month cycle with certificates available per job.`
`Inspection equipment: Zeiss Contura G2 CMM with 700 × 1000 × 600 envelope · Mitutoyo Crysta-Apex S574 · Keyence IM-8000 optical comparator · Full surface finish and hardness testing in house.`
`First Article Inspection Reports to AS9102 supplied as standard on all new part numbers, at no additional cost. We do not charge for proving that we made it right.`

**Sectors**
- **Aerospace** — AS9100 flowdown, full material traceability to mill certificate, and the documentation burden handled properly rather than reluctantly.
- **Medical Devices** — Cleanroom-compatible packing, validated processes, and change control that will survive an audit.
- **Motorsport** — Turnaround measured in days rather than weeks, because a part needed for Friday practice is needed for Friday practice.
- **Industrial Automation** — Repeat batch work with call-off scheduling and consigned stock holding.

**How to get a quote**
1. **Send drawings** — STEP, IGES, DXF, PDF or native SolidWorks and Fusion files. If all you have is a sketch and a sample, send that.
2. **Tell us quantity and material** — Price per part changes considerably between one and a hundred, and we will show you the break points rather than quoting one number.
3. **We come back within 24 hours** — On standard enquiries. Complex multi-part assemblies take two to three days and we will tell you which yours is.

**Prototype to production** — `One-off prototypes through to batches of ten thousand. Below about twenty parts you are paying mostly for setup, which is why quantity break pricing matters so much at the low end. We will always show you what the next break costs, because ordering forty when you asked for twenty-five is sometimes cheaper in absolute terms.`

**Machine list**
```
MILL   Hermle C42U          5-axis    800 × 800 × 550
MILL   Hermle C32U          5-axis    650 × 600 × 500
MILL   DMG Mori DMU 50      5-axis    500 × 450 × 400
MILL   Haas VF-4SS          3-axis   1270 × 508 × 635
MILL   Haas VF-3            3-axis   1016 × 508 × 635
MILL   Haas VF-2            3-axis    762 × 406 × 508
MILL   Matsuura MX-520      5-axis    520 × 460 × 400
TURN   DMG Mori NLX 2500    Live tooling, sub-spindle, Ø366 × 705
TURN   Doosan Puma 2600SY   Y-axis, sub-spindle, Ø350 × 900
TURN   Haas ST-20           Ø356 × 559
EDM    Sodick AQ400LS       Wire, 400 × 300 × 250
GRIND  Jones & Shipman 1400 Surface, 600 × 300
LASER  Trumpf TruLaser 3030 12mm mild steel
BRAKE  Amada HFE 1303       3m, 130 tonne
```

**Quote form** — Company / Contact / Email / Part name or number / Quantity / Material / Critical tolerance / Required date / Drawing upload → [Button] `Request a Quote`
Note: `Drawings are treated as confidential and covered by our standard NDA from the moment they arrive. A signed mutual NDA is available on request before you send anything.`

**Footer** — KESTREL PRECISION · `Five microns, repeatably, at volume.` · `Unit 7, Bayton Road Industrial Estate, Coventry CV7 9EJ` · `024 7655 0140` · ISO 9001:2015 cert 4482019 · AS9100 Rev D cert 4482020 · Company registration 02918844 · © 2026

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
