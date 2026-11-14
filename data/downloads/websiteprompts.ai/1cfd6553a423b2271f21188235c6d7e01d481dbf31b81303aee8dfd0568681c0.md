# Threshold: Smart Home Installer Website Prompt

## 1. Goal
Build a calm, architectural website for **Threshold**, a smart home and lighting installer working with architects and builders. Warm ivory ground, near black ink, a terracotta accent, a grotesk display face and one signature: a line drawn floor plan where rooms fill in sequence as the evening scene runs. Quiet and precise, more like a practice than a gadget shop.

## 2. Tech Stack
```
React + Vite + TypeScript + Tailwind CSS + Framer Motion (motion/react)
```
No component libraries, no configurators, no smart home integrations. Enquiry buttons link to email or telephone.

## 3. Design system
```css
:root {
  --paper: #F4EFE6;              /* warm ivory */
  --ink: #1B1916;                /* warm near black */
  --accent: #A4532E;             /* terracotta */
  --on-accent: #FFFFFF;
  --surface: #EBE5DA;            /* tinted ground */
  --muted: #6B6459;              /* secondary text */
  --line: rgba(27,25,22,0.15);   /* hairlines */
  --radius: 8px;
  --panel-radius: 24px;
}
```
Section rhythm: light, light, surface, dark, light, accent, dark footer.

## 4. Typography
```html
<link href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@500;700&family=DM+Sans:wght@300;500&family=IBM+Plex+Mono:wght@400&display=swap" rel="stylesheet" />
```
- **Display:** Hanken Grotesk 700, letter-spacing -0.035em, line-height 0.98. Hero 78 to 128px, section titles 40 to 62px.
- **Body:** DM Sans 300, 16px, line-height 1.55.
- **Meta layer:** IBM Plex Mono 400, 11px, uppercase, letter-spacing 0.06em. Room counts, lead times, prices, index labels.
- No italics. Emphasis by one line in terracotta.

## 5. Signature element
**A floor plan that runs the evening scene.** A single storey plan drawn in 1.5px ink hairlines: six rooms, a hallway, door openings left as gaps, no furniture. When the section enters view, the rooms fill one after another with a flat terracotta tint at 12 per cent opacity, 500ms apart, in the order the evening scene actually runs: hall, kitchen, dining, living, landing, bathroom. Each room's name appears in mono beside it as it fills, then the whole plan holds.

Flat tint only. No glow, no gradient, no bulb icons. Under `prefers-reduced-motion` all rooms are shown already filled.

## 6. Sections, each a different skeleton

1. **Navbar**: 74px, ivory, one hairline beneath. Wordmark left, four links right, terracotta pill with a round arrow circle.
2. **Hero, corners**: a full bleed photograph of a finished interior with no headline block at all. The wordmark sits top left, the nav top right, the place and year bottom left in mono, and a small CTA bottom right. Min height `clamp(560px, 80vh, 860px)`. *Photograph: a calm modern living room at dusk, warm pools of lamp light, plaster walls, a large window.*
3. **Statement**: light. One long paragraph at 26px in the display face starting at one third, with the label `001/ The idea` in the left column.
4. **The plan, signature panel**: dark ink ground, inset 16px, `--panel-radius`. The floor plan (section 5) drawn in ivory hairlines on the dark ground, with the fill in terracotta, and a mono caption.
5. **What we install, Swiss list**: surface. Label column `002/ What we install`, four stacked names from one third of the width, each with a price band in mono on the right and one line of description.
6. **Projects, loose editorial grid**: light. Five projects at different sizes and vertical offsets, each with a photograph and mono meta giving the place, the number of rooms and the year. *Photographs: a Georgian townhouse hallway, a new build kitchen, a converted barn, a garden room at night, a basement cinema.*
7. **How we work with your architect, numbered rows**: light. Five rows on hairlines with mono stage markers, RIBA style, each with a title and one sentence.
8. **What we do not do, index**: light. A short honest list on hairlines: no proprietary apps we cannot hand over, no subscriptions, no voice assistants unless asked.
9. **One quote**: surface. A single centred quote in Hanken Grotesk at 30px with a signature line in mono.
10. **Enquiry, accent panel**: terracotta ground, inset panel. One line, two actions, and a mono line about lead times.
11. **Footer**: dark ink. Giant cropped `THRESHOLD` wordmark, studio address, accreditations, four small links.

## 7. Motion
- The hero photograph settles from `scale 1.03` to `1` over 1.2s. The corner text fades in at 0.4s.
- The floor plan fills room by room, once.
- Project images settle from `scale 1.03` over 1.1s, with 0.08s stagger.
- Hover: images zoom to 1.03, arrow circles slide 4px.
- Ease `cubic-bezier(.22,1,.36,1)`. Respect `prefers-reduced-motion`.

## 8. Responsive
- **Mobile under 768px:** hero min height `clamp(420px, 66vh, 600px)`, the bottom corner items stack into one column. The floor plan scales to 300px wide and room names move into a list beneath the plan rather than beside it. Projects become one column with offsets removed. Nav keeps the wordmark and the pill, links behind a `Menu` toggle. No horizontal page scroll.
- **Tablet:** projects two columns, plan at 480px.
- **Desktop:** 1200px content width, gutters 40px, section padding 120 to 140px.

## 9. Full copy

**Wordmark:** THRESHOLD. Meta: `LIGHTING AND CONTROL. LONDON AND THE HOME COUNTIES.`

**Nav:** What we install, Projects, Working with us, Contact. Button: `Start a project`

**Hero**
- Mono bottom left: `PRIVATE HOUSE, HIGHBURY. 2026.`
- Small CTA bottom right: `Start a project`

**Statement** (label `001/ The idea`)
`A good smart home is one nobody in the house notices. The lights come up at the right level when you walk in, the heating knows the difference between a Tuesday and a Sunday, and nothing requires a phone. We design the control layer alongside your architect and electrician, before the walls close, which is the only time it is cheap to do properly.`

**Plan caption:** `The evening scene at a house in Highbury. Six rooms, one press, 22 seconds from hall to landing.`

**What we install** (label `002/ What we install`)
- **Lighting control.** `Dimming, scenes and keypads that replace the wall of switches. The part that changes how a house feels.` `6 TO 25K GBP`
- **Heating and shading.** `Zoned heating, blinds and curtains, set up so they behave without being asked.` `4 TO 15K GBP`
- **Audio.** `Ceiling speakers where they belong, and nowhere they do not.` `3 TO 20K GBP`
- **Networks and security.** `Wired where possible, cameras and door entry that keep working when the internet does not.` `3 TO 12K GBP`

**Projects** (label `003/ Projects`)
- **Highbury townhouse** `LONDON N5. 9 ROOMS. 2026.`
- **New build, Chilterns** `BUCKINGHAMSHIRE. 14 ROOMS. 2026.`
- **Barn conversion** `SUFFOLK. 7 ROOMS. 2025.`
- **Garden room and pool house** `SURREY. 3 ROOMS. 2025.`
- **Basement cinema** `LONDON W11. 1 ROOM. 2024.`

**Working with us** (label `004/ Stages`)
- `STAGE 2` **Concept.** `We join the first design meeting and mark up the drawings before anything is priced.`
- `STAGE 4` **Technical design.** `Cable routes, keypad positions and a schedule your electrician can actually build from.`
- `STAGE 5` **First fix.** `We supervise the cabling on site. This is the stage that decides whether the rest goes well.`
- `STAGE 5` **Second fix and programming.** `Keypads on, scenes set, then a week of living with it before we adjust.`
- `HANDOVER` **Handover.** `A printed plan, every password, and a two hour walk through with whoever runs the house.`

**What we do not do** (label `005/ Honest`)
- `No proprietary apps you cannot hand to the next owner.`
- `No monthly subscriptions for your own lights.`
- `No voice assistants unless you ask for them.`
- `No retrofit promises we cannot keep once we have seen the floors.`
- `No work without a main contractor or electrician on site.`

**Quote:** `They moved three keypads at first fix because of where we actually stood in the room. Nobody else would have noticed.`
Signature: `Ellen Vaughan, architect, Highbury project`

**Enquiry panel**
- Line: `The best time to call us is before the plaster.`
- Actions: `Start a project`, `Send drawings`
- Mono: `CURRENT LEAD TIME FOR DESIGN WORK: FOUR WEEKS.`

**Footer**
`THRESHOLD`, `Studio 6, Bow Wharf, London E3 5SN`, `hello@threshold.build`, `020 7946 0388`
Mono: `KNX PARTNER. NICEIC APPROVED CONTRACTOR. FULLY INSURED.`
Links: `What we install`, `Projects`, `Working with us`, `Contact`

## 10. Never
Glassmorphism, gradients, glow, neon, drop shadowed cards, icon grids, emoji, animated dashboards in the hero, stat soup, lorem ipsum, dashes of any kind in the copy, more than two fonts plus the mono meta layer, `100vh` heroes, identical stripes.

## 11. Dependencies
```json
{
  "motion": "^12.0.0",
  "lucide-react": "^0.460.0",
  "clsx": "^2.1.0"
}
```
