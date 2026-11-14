# Grace Commons — Church Website Prompt

## 1. Goal Statement
Build a warm, genuinely welcoming church website for **Grace Commons**, defined by soft stone, muted gold, and an open humanist serif — designed around the two questions a first-time visitor actually has (when do you meet, and what will it be like) rather than around internal ministry structure.

---

## 2. Tech Stack
```
React + Vite + TypeScript + Tailwind CSS + Framer Motion (motion/react) + shadcn/ui + lucide-react
```

---

## 3. Design System — Colors

```css
:root {
  --background: hsl(36, 30%, 96%);       /* #f8f4ee warm stone */
  --foreground: hsl(24, 16%, 17%);       /* #2e2823 warm near-black */
  --primary: hsl(28, 34%, 38%);          /* #7d5c40 clay brown */
  --primary-foreground: hsl(36, 30%, 97%);
  --muted-foreground: hsl(24, 8%, 45%);
  --border: hsl(34, 18%, 86%);
  --card: hsl(36, 32%, 92%);
  --accent-gold: hsl(40, 52%, 56%);      /* muted gold */
  --deep: hsl(24, 22%, 20%);             /* dark band sections */
}
```

---

## 4. Typography

```html
<link href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;1,400&family=Karla:wght@300;400;500;600&display=swap" rel="stylesheet" />
```

- **H1 / hero:** `'Lora', serif;` weight 500, clamp(36px, 4.8vw, 64px), line-height: 1.14
- **H2:** Lora 500, 30–42px
- **H3:** Karla 600, 18–21px
- **Body:** `'Karla', sans-serif;` weight 300–400, 17px, line-height: 1.8
- **Eyebrows:** Karla 600, uppercase, letter-spacing: 0.18em, 11px, clay
- **Service times (large):** Lora 600, tabular-nums, 40–56px
- **Scripture quotes:** Lora italic 400, 22–26px

---

## 5. Visual Effects

### Effect 1 — Service Times Card (the single most important element)
```jsx
<div className="rounded-2xl border-2 p-8 text-center" style={{ borderColor: 'var(--accent-gold)', background: 'var(--card)' }}>
  <span className="text-[11px] uppercase tracking-[0.18em] text-[var(--primary)]">This Sunday</span>
  <div className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10">
    {['9:00 AM', '11:00 AM'].map(t => (
      <div key={t}>
        <div className="font-serif text-5xl tabular-nums">{t}</div>
        <div className="mt-1 text-sm text-[var(--muted-foreground)]">Identical services</div>
      </div>
    ))}
  </div>
  <p className="mt-6 text-[var(--muted-foreground)]">
    1420 Ashland Avenue · Kids programming at both services · Coffee from 8:30
  </p>
</div>
```

### Effect 2 — Sermon Card with Inline Audio Player
```tsx
<div className="flex items-center gap-4 rounded-xl border border-[var(--border)] bg-white/60 p-5">
  <button
    onClick={togglePlay}
    className="grid h-12 w-12 shrink-0 place-items-center rounded-full transition-transform duration-200 hover:scale-105"
    style={{ background: 'var(--primary)', color: 'var(--primary-foreground)' }}
    aria-label={playing ? 'Pause sermon' : 'Play sermon'}
  >
    {playing ? <Pause size={18} /> : <Play size={18} />}
  </button>
  <div className="min-w-0">
    <div className="font-semibold truncate">When Waiting Is the Work</div>
    <div className="text-sm text-[var(--muted-foreground)]">Pastor Dana Whitfield · Feb 2 · 34 min</div>
    {/* Thin gold progress bar animates width with audio currentTime */}
    <div className="mt-2 h-[3px] w-full rounded-full bg-[var(--border)]">
      <div className="h-full rounded-full transition-[width] duration-200" style={{ width: `${pct}%`, background: 'var(--accent-gold)' }} />
    </div>
  </div>
</div>
```

### Effect 3 — Soft Fade-Up
```
initial={{ opacity: 0, y: 22 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.72, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
```

---

## 6. Component Breakdown

### Section 1 — Navbar
- 76px, `sticky top-0 z-40`, stone background with blur, 1px bottom border after scroll
- Left: simple gold arch/doorway SVG mark + "GRACE COMMONS" (Lora 500, tracking 0.04em)
- Center: I'm New · Sundays · Sermons · Ministries · Events · Give
- Right: `Plan Your Visit` (clay filled, rounded-full)
- Mobile: mark + hamburger; overlay menu, Lora 28px links, `Plan Your Visit` pinned at the bottom

### Section 2 — Hero (Image with Warm Scrim)
- `min-h-[78vh]`, content centered, max-w-3xl
```jsx
{/* Image: congregation gathered in a bright welcoming church space, warm natural light through tall windows, diverse group of people, candid and unposed, hopeful atmosphere */}
<img src="" alt="Sunday gathering at Grace Commons" className="absolute inset-0 w-full h-full object-cover object-center" />
<div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(46,40,35,0.55) 0%, rgba(46,40,35,0.3) 45%, rgba(46,40,35,0.7) 100%)' }} />
```
- Eyebrow: `NASHVILLE, TENNESSEE`
- H1: `Come as you are.\nReally.`
- Subline: `A church for people who have questions, doubts, and a complicated history with religion — as well as for people who do not.`
- CTA row: `Plan Your Visit` (gold filled) + `Watch a Sermon` (white ghost)

### Section 3 — Service Times
- Overlaps the hero by `-64px` on desktop (`relative -mt-16 z-20`), centered max-w-2xl
- Service times card (Effect 1)

### Section 4 — I'm New
- `--background`, eyebrow `FIRST TIME?` + H2 `What to Expect`
- **4-col grid** of short reassurance cards, each with a gold-outlined icon
- What do I wear · How long is it · What about my kids · Will I be singled out

### Section 5 — Latest Sermons
- `--card` background, eyebrow `TEACHING` + H2 `Recent Sermons`
- Current series banner at the top: series title, 1-line description, `4 of 6 parts`
- List of 5 sermon cards with inline audio (Effect 2)
- `Browse the full archive →` link

### Section 6 — Ministries
- `--background`, eyebrow `GET CONNECTED` + H2 `Find Your People`
- **3-col grid**, each with an image, title, 2-sentence description, meeting cadence line, and `Learn more →`
- Kids · Students · Small Groups · Young Adults · Women · Men (6 cards, 3x2)
```jsx
{/* Image: small group of adults talking around a living room, warm lamp light, relaxed and genuine conversation, documentary style */}
```

### Section 7 — Values / What We Believe
- `--deep` dark band, stone text, centered max-w-3xl
- Eyebrow `WHAT WE BELIEVE` + H2 in Lora
- 4 short belief statements separated by thin gold rules — plain language, no jargon
- Below: `Read our full statement of faith →` in gold

### Section 8 — Events
- `--background`, eyebrow `WHAT'S COMING UP` + H2 `Events`
- Horizontal scroll row of 5 event cards on desktop; each: date block (gold), title, time + location, `Details →`

### Section 9 — Serve & Give
- 2-col split on `--card`
- Left: **Serve** — 3 short opportunities with icons + `See all serving roles →`
- Right: **Give** — short honest paragraph about where money goes, a small 3-line breakdown, and a `Give Online` button + text-to-give number

### Section 10 — Visit / Location
- `--background`, 2-col: left address card with parking notes, accessibility info, and what door to enter; right map image
```jsx
{/* Image: simple neighbourhood map with a single marked location, muted warm palette, clean cartographic style */}
```

### Section 11 — Final CTA
- Gold band, deep text: H2 `We would love to meet you this Sunday.` + service times repeated + `Plan Your Visit` CTA

### Section 12 — Footer
- `--deep`, stone text, 4 columns: brand + address / Sundays / Connect / Contact
- Newsletter: `Weekly email, sent Thursdays.`
- Bottom strip: © line, privacy, and a discreet `Staff login` link

---

## 7. Animations

- **Hero:** H1 fades up 0.8s; subline at +0.18s; CTAs at +0.34s
- **Service times card:** rises `y: 28 → 0` with a soft shadow appearing, 0.8s, on load
- **Section headings:** fade-up 0.72s, ease `[0.22, 1, 0.36, 1]`
- **Reassurance cards:** stagger `i * 0.08`
- **Sermon cards:** stagger 0.06s; play button scales 1.05 on hover; gold progress bar width updates from audio `currentTime`
- **Ministry cards:** image scales 1 → 1.04 on hover over 0.6s; card lifts `-4px`
- **Belief statements:** gold rules scale from left, 0.6s, staggered 0.12s
- **Events row:** on desktop, cards translate slightly on horizontal scroll (`scroll-snap-type: x mandatory`)
- Motion is intentionally gentle throughout — nothing snaps or bounces

---

## 8. Responsive

### Mobile (< 768px)
- Navbar: mark + hamburger; overlay with `Plan Your Visit` pinned bottom
- Hero: H1 clamps to 36px, CTAs stacked full-width
- Service times card: no negative overlap, times stack vertically, full-width with `mx-4`
- Reassurance cards: 2x2 grid
- Sermons: cards full-width, metadata wraps to two lines
- Ministries: 1-col
- Events: horizontal scroll retained with `snap-center`
- Serve & Give: stacked, Give first
- Location: address card above map

### Tablet (768–1024px)
- Reassurance 2x2 · Ministries 2-col · Events 3 visible with scroll · Serve & Give stays 2-col

### Desktop (> 1024px)
- Max width 1180px, `px-16`, `py-24`

---

## 9. Full Copy

### Brand
**GRACE COMMONS** — Nashville, Tennessee

### Navbar
I'm New · Sundays · Sermons · Ministries · Events · Give · [Button] Plan Your Visit

### Hero
- Eyebrow: `NASHVILLE, TENNESSEE`
- H1: `Come as you are. Really.`
- Subline: `A church for people who have questions, doubts, and a complicated history with religion — as well as for people who do not.`
- CTA 1: `Plan Your Visit` · CTA 2: `Watch a Sermon`

### Service Times
Eyebrow: `THIS SUNDAY`
`9:00 AM` and `11:00 AM` — identical services
`1420 Ashland Avenue · Kids programming at both services · Coffee from 8:30`

### I'm New
Eyebrow: `FIRST TIME?` — H2: `What to Expect`
1. **What do I wear?** (icon: `Shirt`) — Whatever you own. You will see suits and you will see shorts, and nobody is keeping score.
2. **How long is it?** (icon: `Clock`) — About seventy minutes. Music for roughly twenty, a message for about thirty, and time on either side to actually talk to people.
3. **What about my kids?** (icon: `Baby`) — Kids from six weeks to fifth grade have their own space at both services, with background-checked volunteers and a secure check-in. Or keep them with you — nobody minds the noise.
4. **Will I be singled out?** (icon: `EyeOff`) — No. We do not ask visitors to stand up, raise a hand, or wear anything. If you want to stay anonymous for six months, that is completely fine.

### Sermons
Eyebrow: `TEACHING` — H2: `Recent Sermons`
Current series: **Slow Faith** — *Six weeks in the Psalms, on what happens when God takes longer than you hoped.* — `4 of 6 parts`

1. **When Waiting Is the Work** — Pastor Dana Whitfield · Feb 2 · 34 min
2. **The Honest Complaint** — Pastor Dana Whitfield · Jan 26 · 31 min
3. **Nobody Prays in a Straight Line** — Marcus Ibe · Jan 19 · 28 min
4. **What the Psalms Do With Anger** — Pastor Dana Whitfield · Jan 12 · 36 min
5. **Beginning in the Middle** — Pastor Dana Whitfield · Jan 5 · 33 min

### Ministries
Eyebrow: `GET CONNECTED` — H2: `Find Your People`
1. **Kids** — Six weeks through fifth grade, at both services. Background-checked volunteers, secure check-in, and a curriculum that does not talk down to children. *Sundays, 9 & 11 AM*
2. **Students** — Sixth through twelfth grade. Wednesday nights are loud, Sunday mornings are quieter, and both are safe places to ask uncomfortable questions. *Wednesdays, 6:30 PM*
3. **Small Groups** — Twelve to fifteen people meeting in homes across the city. This is where church actually happens for most of us. *Weekly, various nights*
4. **Young Adults** — Twenties and thirties, married and single, together. Dinner, discussion, and no pressure to have your life figured out. *2nd & 4th Thursdays*
5. **Women** — Studies, mentoring, and a monthly gathering that is equal parts scripture and honesty. *Tuesdays, 9:30 AM & 7 PM*
6. **Men** — Early mornings, real conversation, and a standing invitation to bring someone who would never come on a Sunday. *Saturdays, 7 AM*

### What We Believe
Eyebrow: `WHAT WE BELIEVE`
1. **Jesus is the centre.** — Not our politics, not our building, not our preferences. Everything else is negotiable.
2. **Doubt is not the opposite of faith.** — Some of the most faithful people here are the ones with the most questions. Bring them.
3. **Everyone is welcome, exactly as they are.** — You do not need to clean yourself up first. That has never been how this works.
4. **Grace is not a reward.** — It is not earned, it cannot be lost, and it is not a prize for people who behave well.
Link: `Read our full statement of faith →`

### Events
Eyebrow: `WHAT'S COMING UP` — H2: `Events`
1. `FEB 14` — **Marriage Night** — 6:30 PM · Main Hall · Dinner provided, childcare available
2. `FEB 22` — **Neighbourhood Serve Day** — 9:00 AM · Meet in the parking lot
3. `MAR 1` — **Newcomers Lunch** — 12:30 PM · Room 120 · No commitment, just lunch
4. `MAR 8` — **Baptism Sunday** — Both services · Talk to any staff member
5. `MAR 21` — **Youth Spring Retreat** — Departs 4:00 PM · Registration closes March 7

### Serve & Give
**Serve** — `Sunday teams` (welcome, coffee, kids, tech) · `Neighbourhood partnerships` (food pantry, tutoring, refugee resettlement) · `Behind the scenes` (setup, admin, meals for families in crisis) — `See all serving roles →`

**Give** — `We try to be straightforward about money. Roughly two-thirds of what comes in pays for ministry and staff, a fifth goes out to local and global partners, and the rest keeps the building running. Our annual report is published every February and we mean it when we say you should read it.`
- `64%` Ministry & staff
- `21%` Local and global partners
- `15%` Facilities & operations
CTA: `Give Online` · `Or text GIVE to (615) 555-0134`

### Visit
Eyebrow: `FIND US` — H2: `Visiting Us`
- Address: `1420 Ashland Avenue, Nashville, TN 37212`
- `Free parking in the west lot. Enter through the glass doors under the awning — someone will be there to point you the right way.`
- `The building is fully accessible, and we have a quiet room with a live feed for anyone who needs a break from the noise.`

### Final CTA
H2: `We would love to meet you this Sunday.`
Subline: `9:00 and 11:00 AM. Coffee from 8:30. No pressure, no sign-up, no strings.`
CTA: `Plan Your Visit`

### Footer
- GRACE COMMONS · `Come as you are. Really.`
- Address: `1420 Ashland Avenue, Nashville, TN 37212` · `(615) 555-0134`
- Newsletter label: `Weekly email, sent Thursdays.`
- © 2026 Grace Commons Church. All rights reserved. · Privacy Policy · Staff login

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
        serif: ['Lora', 'Georgia', 'serif'],
        sans: ['Karla', 'system-ui', 'sans-serif'],
      },
      colors: {
        'gc-stone': '#f8f4ee',
        'gc-clay': '#7d5c40',
        'gc-gold': '#c69a4f',
      },
    },
  },
};
```
