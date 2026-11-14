# Ellipse Dance Studio — Dance Studio Website Prompt

## Goal
Build a dark, dramatic dance studio website for "Ellipse Dance Studio" — near-black background, rose copper accents, warm ivory typography, Cormorant Garamond 700 italic at massive scale, moody stage-lit dancer photography, timetable grid, and showcase section.

## Tech Stack
React + Vite + TypeScript + Tailwind CSS + Framer Motion (motion/react) + shadcn/ui + lucide-react

## Design System

### Colors
```css
:root {
  --background: 3 8% 4%;
  --foreground: 30 45% 93%;
  --primary: 8 38% 60%;
  --primary-foreground: 3 8% 4%;
  --muted-foreground: 3 5% 64%;
  --border: 3 5% 18%;
  --accent: 3 12% 14%;
}
```

Hex reference:
- Background: #0a0808 (near-black with warm undertone)
- Foreground (warm ivory): #f5f0e8
- Primary (rose copper): #c47a6a
- Dark rose (inner sections): #3a1510
- Muted: #a09898
- Border: #2e2626

### Typography
Google Fonts import:
`https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,700&family=Inter:wght@300,400&display=swap`

- ALL Headlines: Cormorant Garamond 700 italic
- Body text: Cormorant Garamond 300 italic
- Labels/UI/captions: Inter 300 (non-italic)

## Visual Effects

### Effect 1: Background Brand Text (Rose Copper Tint)
```css
.bg-brand-text {
  position: absolute;
  font-family: 'Cormorant Garamond', serif;
  font-style: italic;
  font-weight: 700;
  font-size: clamp(200px, 28vw, 440px);
  opacity: 0.03;
  color: #c47a6a;
  right: -4%;
  top: 50%;
  transform: translateY(-50%);
  user-select: none;
  pointer-events: none;
  white-space: nowrap;
  z-index: 0;
  letter-spacing: -0.01em;
}
```
Text: "ELLIPSE"

### Effect 2: Layered Hero Gradient
Two overlapping gradients to create a moody vignette that frames the dancer while keeping content readable:
```css
/* Gradient 1 — radial center vignette */
background: radial-gradient(
  ellipse at 50% 45%,
  rgba(10,8,8,0) 0%,
  rgba(10,8,8,0.2) 45%,
  rgba(10,8,8,0.7) 100%
);

/* Gradient 2 — top and bottom fade */
background: linear-gradient(
  to bottom,
  rgba(10,8,8,0.6) 0%,
  transparent 35%,
  rgba(10,8,8,0.8) 100%
);
```
Stack both as pseudo-elements or as two absolute divs on top of the hero image (z-index: 1 and 2), content at z-index: 10.

### Effect 3: Rose Copper Divider Lines and Hover Borders
On dance style rows: hover reveals a 3px solid #c47a6a left border. Plus y: -4px lift, box-shadow: 0 4px 20px rgba(196,122,106,0.2). Transition: 0.25s ease.
Also used as: thin 1px horizontal accent lines below CTAs, between sections, and as the timetable current-slot highlight.

### Effect 4: Timetable Hover Highlight
Schedule slots hover: background: rgba(196,122,106,0.15), border-color: #c47a6a (0.5px). Transition: 0.15s ease.

## Component Breakdown

### 1. Navbar
- Fixed top, background: rgba(10,8,8,0.92), backdrop-filter: blur(14px)
- Height: 60px
- Left: "Ellipse" in Cormorant Garamond 700 italic, 22px, rose copper (#c47a6a), letter-spacing: 0.04em
- Center: Inter 300, 11px, letter-spacing: 0.14em, uppercase, ivory (80% opacity) — Classes / Timetable / Instructors / Showcase / Contact
- Right: "First Class Free" — ghost button, 0.5px rose copper border, Cormorant 300 italic, 14px, rose copper text, padding: 8px 20px, no border-radius
- Bottom border: 0.5px solid hsl(var(--border))
- Nav link hover: rose copper (#c47a6a). Transition: 0.2s.

### 2. Hero
Full-viewport, position: relative, overflow: hidden.

**Background Image:**
{/* Image: Dramatic stage-photography of a contemporary female dancer caught mid-movement in a deep arabesque or a dynamic leap. The dancer is wearing a simple dark leotard. Motion blur is visible on the extended limbs, suggesting speed and power. The stage lighting is from above and slightly to the right, creating a single warm spotlight that separates the dancer from the near-black background. The background is pure theatre darkness. Shot on a long lens with shallow depth of field. The dancer's face is serene and focused. Mood: mastery, drama, controlled power, beauty in motion. */}
<img src="" alt="Contemporary dancer mid-arabesque in dramatic stage spotlight" style={{ objectFit: 'cover', objectPosition: 'center', width: '100%', height: '100%', position: 'absolute', inset: 0 }} />

**Gradient Layer 1 (z-index: 1, absolute, inset: 0):**
```css
background: radial-gradient(ellipse at 50% 45%, rgba(10,8,8,0) 0%, rgba(10,8,8,0.2) 45%, rgba(10,8,8,0.7) 100%);
```

**Gradient Layer 2 (z-index: 2, absolute, inset: 0):**
```css
background: linear-gradient(to bottom, rgba(10,8,8,0.6) 0%, transparent 35%, rgba(10,8,8,0.8) 100%);
```

**Background Text (z-index: 0, behind the image):**
"ELLIPSE" — Cormorant 700 italic, clamp(200px,28vw,440px), opacity: 0.03, rose copper (#c47a6a), right: -4%, top: 50%, translateY(-50%).

**Content (z-index: 10):**
Position: absolute, bottom: 8vh, left: 6%, max-width: 600px.

- Eyebrow: Inter 300, 10px, rose copper, letter-spacing: 0.2em, uppercase, margin-bottom: 16px: "DANCE STUDIO · SHOREDITCH"

- Headline: "Move Like You Mean It." — Cormorant 700 italic, clamp(52px,7.5vw,128px), letter-spacing: -0.01em, ivory (#f5f0e8), line-height: 1.0, margin-bottom: 20px
- Framer Motion: initial={{ opacity: 0, y: 36 }}, animate={{ opacity: 1, y: 0 }}, transition={{ duration: 0.95, ease: [0.16,1,0.3,1] }}

- Sub: "Professionally choreographed classes for adults and children across Ballet, Contemporary, Latin, and Hip-Hop. Studios in Shoreditch." — Cormorant 300 italic, 18px, ivory 75%, max-width: 460px, margin-bottom: 32px
- Framer Motion: delay: 0.18s

- CTAs (flex, gap: 14px, margin-bottom: 24px):
  - "Find Your Class" — rose copper bg (#c47a6a), dark text (#0a0808), Cormorant 300 italic, 16px, letter-spacing: 0.06em, padding: 13px 36px, no border-radius
  - "First Class Free" — transparent, border: 0.5px solid ivory (#f5f0e8), ivory text, same font, same padding
  - Framer Motion: delay: 0.28s

- Thin 1px rose copper divider line (width: 60px) below CTAs.

### 3. Dance Styles Section
Background: hsl(var(--background)). Padding: 120px 6%.

**Header:**
- Inter 300, 10px, rose copper, letter-spacing: 0.2em, uppercase, margin-bottom: 12px: "OUR CLASSES"
- Cormorant 700 italic, clamp(38px,5vw,78px), ivory, margin-bottom: 72px: "Something for everyone."

**4 Style Rows:**
Each: position: relative, padding: 36px 0. Border-top: 1px solid hsl(var(--border)). Display: flex, justify-content: space-between, align-items: center. Cursor: pointer.

Left border indicator: position: absolute, left: 0, top: 0, bottom: 0, width: 3px, background: #c47a6a, opacity: 0, transition: opacity 0.25s.
On hover: left border opacity → 1, row: translateY(-4px), box-shadow: 0 4px 20px rgba(196,122,106,0.2). Transition: 0.25s ease.

Left column:
- Cormorant 700 italic, clamp(28px,3.5vw,52px), ivory: style name
- Cormorant 300 italic, 15px, muted (#a09898), max-width: 400px, line-height: 1.65, margin-top: 6px: description

Right column (flex-shrink: 0, flex, align-items: center, gap: 24px):
- Cormorant 300, 14px, rose copper: price per class
- Cormorant 700 italic, 24px, rose copper: "→"

**The 4 styles:**
1. "Ballet" / "From absolute beginners to pre-professional. Graded RAD syllabus alongside open adult classes. All ages welcome." / £14/class
2. "Contemporary" / "Influenced by Forsythe, Cunningham, and release technique. Expect to work. Expect to feel something." / £14/class
3. "Latin" / "Salsa, Bachata, Cha-Cha, and competition-level coaching. All levels from social to competitive." / £14/class
4. "Hip-Hop" / "Old school foundations with new school energy. Breaking, locking, popping, and freestyle. All levels." / £14/class

Last row: border-bottom: 1px solid hsl(var(--border)).

Framer Motion: whileInView, stagger 0.1s, opacity 0→1, y 18→0, viewport={{ once: true }}

### 4. Weekly Timetable
Background: #0d0a0a (slightly lighter near-black). Padding: 100px 6%.

**Header:**
- Inter 300, 10px, rose copper, letter-spacing: 0.2em, uppercase: "TIMETABLE"
- Cormorant 700 italic, 64px, ivory: "This week's classes."
- Margin-bottom: 48px

**Grid:**
7 columns (Mon–Sun) × 4 rows (header + 3 time slots).
CSS Grid: grid-template-columns: repeat(7, 1fr), gap: 2px.

Day header row: Cormorant 700 italic, 14px, ivory, text-align: center, padding: 12px 0.
Time slots:
- Available: background: rgba(196,122,106,0.08), border: 0.5px solid rgba(196,122,106,0.2), padding: 14px 8px, text-align: center.
  Cormorant 300 italic, 14px, ivory 80%: class name. Inter 300, 11px, muted: time.
  Hover: background: rgba(196,122,106,0.15), border-color: #c47a6a. Transition: 0.15s.
- Booked Full: background: rgba(255,255,255,0.02), Inter 300, 11px, muted 40%, text-decoration: line-through: "Full"

**3 time rows:** 9am Morning / 6pm Evening / 10am Weekend

**Schedule sample:**
- Mon Morning: "Ballet Beg." (9am) | Mon Evening: "Contemporary" (6pm) | Mon Weekend: —
- Tue Morning: "Hip-Hop" (9am) | Tue Evening: "Ballet Adv." (6pm) | Tue Weekend: —
- Wed Morning: "Latin" (9am) | Wed Evening: "Contemporary" (6pm) | Wed Weekend: —
- Thu Morning: Full | Thu Evening: "Ballet Int." (6pm) | Thu Weekend: —
- Fri Morning: "Hip-Hop" (9am) | Fri Evening: Full | Fri Weekend: —
- Sat: Weekend times: "Ballet Beg." (10am) / "Latin" (12pm) / "Hip-Hop" (2pm) [3 rows for Sat]
- Sun: Weekend: "Contemporary" (10am) / "Ballet Beg." (12pm) / Full (2pm)

Below grid: Cormorant 300 italic, 14px, muted, margin-top: 20px: "Timetable subject to change. Book in advance to secure your spot."
Rose copper link: "See full timetable →"

### 5. Instructors Section
Background: hsl(var(--background)). Padding: 100px 6%.

**Header:**
- Inter 300, 10px, rose copper, letter-spacing: 0.2em, uppercase: "OUR INSTRUCTORS"
- Cormorant 700 italic, 64px, ivory, margin-bottom: 56px: "Trained to teach. Born to move."

**3 Instructor Cards — 3-column grid, gap: 20px:**
Each: position: relative, overflow: hidden, no border-radius.
Background: #141010.

Card layout:
- Full-bleed square portrait photography (1:1 aspect ratio)
- Overlay at bottom (gradient inside image area): linear-gradient(to top, rgba(10,8,8,0.85) 0%, transparent 50%)
- On top of overlay (z-index: 10, position: absolute, bottom: 0, left: 0, padding: 20px):
  - Rose copper chip: background: rgba(196,122,106,0.2), border: 0.5px solid #c47a6a, Inter 300, 10px, letter-spacing: 0.12em, rose copper, border-radius: 100px, padding: 4px 12px: specialty
  - Cormorant 700 italic, 24px, ivory, margin-top: 8px: name
  - Cormorant 300 italic, 13px, muted: credentials

Hover: scale: 1.02 on the image (the card itself doesn't scale, only the image within). Transition: 0.4s ease.

**The 3 instructors:**

1. Elena Vasquez
{/* Image: Professional portrait headshot of a female ballet dancer in her mid-30s, Hispanic appearance, wearing a simple black leotard with hair pulled back in a tight bun. She is posed in a graceful half-turn with one arm extended upward. Shot against a dark charcoal background with soft dramatic lighting from above-left, creating elegant shadow play. Mood: classical, graceful, authoritative. */}
<img src="" alt="Elena Vasquez — Ballet Instructor" style={{ objectFit: 'cover', objectPosition: 'center', width: '100%', aspectRatio: '1/1' }} />
Chip: "Ballet · 12 Years Royal Ballet School"
Name: "Elena Vasquez"
Credentials: "R.A.D. Associate · Royal Ballet School graduate"
"Book with Elena →"

2. James Okafor
{/* Image: Professional portrait of a male contemporary dancer in his late 20s, Black British, wearing fitted dark rehearsal clothes. He is caught mid-contemporary movement — perhaps a deep side stretch or a floor-based pose — shot in a black-walled studio with a single dramatic top-light. Mood: raw, artistic, powerful, intellectual. */}
<img src="" alt="James Okafor — Contemporary Dance Instructor" style={{ objectFit: 'cover', objectPosition: 'center', width: '100%', aspectRatio: '1/1' }} />
Chip: "Contemporary · Formerly Rambert Dance"
Name: "James Okafor"
Credentials: "B.A. Dance Theatre · 8 years professional stage"
"Book with James →"

3. Sofia Reyes
{/* Image: Professional portrait of a female Latin dance instructor in her early 40s, Brazilian appearance, wearing a vibrant jewel-toned latin dress. She is posed in a confident Latin stance — weight shifted, arms in a classic frame position — against a dark matte background. Warm studio lighting gives her skin a warm glow. Mood: confidence, passion, expertise, joy. */}
<img src="" alt="Sofia Reyes — Latin Dance Instructor" style={{ objectFit: 'cover', objectPosition: 'center', width: '100%', aspectRatio: '1/1' }} />
Chip: "Latin · 2× World Latin Champion"
Name: "Sofia Reyes"
Credentials: "ISTD Licentiate · 2× World Latin Dance Champion"
"Book with Sofia →"

Framer Motion: stagger 0.12s, opacity 0→1, y 24→0, viewport={{ once: true }}

### 6. Showcase Section
Background: #0d0a0a. Padding: 100px 6%. Text-align: center.

- Inter 300, 10px, rose copper, letter-spacing: 0.2em, uppercase, margin-bottom: 16px: "UPCOMING PERFORMANCES"

- "ELLIPSE PRESENTS" in Cormorant 700 italic, clamp(60px,9vw,160px), ivory, letter-spacing: -0.01em, line-height: 1.0, margin-bottom: 56px. [This is a typographic statement, no photography.]

**2 Performance events:**
Each: display: inline-flex, align-items: center, gap: 24px, background: rgba(196,122,106,0.06), border: 0.5px solid hsl(var(--border)), padding: 28px 36px, no border-radius, width: 100%, max-width: 600px, margin: 12px auto, cursor: pointer, hover: border-color: #c47a6a, transition: 0.2s.

- Rose copper date chip (Inter 300, 11px, letter-spacing: 0.12em, rose copper bg 20%, rounded: 100px): date
- Cormorant 700 italic, 24px, ivory: performance title
- Cormorant 300 italic, 14px, muted: venue
- Rose copper "Buy Tickets →" link (Inter 300, 12px, rose copper, right-aligned, flex: auto)

**The 2 performances:**
1. Date chip: "SAT 14 DEC" / "Winter Showcase" / "Hackney Empire, London" / "Buy Tickets →"
2. Date chip: "SAT 22 MAR" / "Spring Showcase" / "Barbican Centre, London" / "Buy Tickets →"

Framer Motion: cards scale 0.96→1, opacity 0→1 on whileInView.

### 7. Free Trial CTA
Full-width section. Background: #3a1510 (dark rose). Border: inner shadow or outer 0.5px rose copper border on top. Padding: 120px 6%. Text-align: center.

- Cormorant 700 italic, clamp(44px,6vw,102px), ivory, margin-bottom: 16px: "Your First Class Is Free."
- Cormorant 300 italic, 19px, ivory 70%, margin-bottom: 40px: "No commitment. No registration. Just come and move."
- "Book Your Free Class" — ivory bg (#f5f0e8), dark text (#0a0808), Cormorant 300 italic, 16px, letter-spacing: 0.06em, padding: 15px 44px, no border-radius

Framer Motion: scale 0.96→1, opacity 0→1, viewport={{ once: true }}, duration: 0.7s.

### 8. Footer
Background: #0a0808. Border-top: 0.5px solid hsl(var(--border)). Padding: 64px 6%.
3-column grid:

Column 1: "Ellipse" Cormorant 700 italic, 20px, rose copper. Below: Cormorant 300 italic, 14px, muted: "Dance Studio · Shoreditch, London". Social icons hover: rose copper.

Column 2: "Classes" — Inter 300, 10px, rose copper, letter-spacing header. Links: Cormorant 300, 14px, muted: Ballet / Contemporary / Latin / Hip-Hop / Trial Class

Column 3: "Visit" — same header. Cormorant 300, 14px, muted: "12 Rivington Street, Shoreditch, London EC2A 3DU" / "Mon–Fri: 8am–9pm / Sat–Sun: 9am–6pm" / "hello@ellipsedance.co.uk" / "+44 (0)20 7123 9876"

Bottom: Inter 300, 11px, muted 45%: "© 2025 Ellipse Dance Studio Ltd. All rights reserved."

## Animations

| Element | Animation | Duration | Delay | Easing |
|---|---|---|---|---|
| Hero headline | opacity 0→1, y 36→0 | 0.95s | 0s | [0.16,1,0.3,1] |
| Hero sub | opacity 0→1, y 28→0 | 0.95s | 0.18s | [0.16,1,0.3,1] |
| Hero CTAs | opacity 0→1, y 22→0 | 0.95s | 0.28s | [0.16,1,0.3,1] |
| Style rows | opacity 0→1, y 18→0 | 0.5s | i×0.1s | ease |
| Instructor cards | opacity 0→1, y 24→0 | 0.65s | i×0.12s | ease |
| Showcase events | scale 0.96→1, opacity 0→1 | 0.5s | i×0.1s | ease |
| CTA block | scale 0.96→1, opacity 0→1 | 0.7s | 0s | ease |
| Style row hover | y 0→-4, red border appear | 0.25s | — | ease |
| Instructor image hover | scale 1→1.02 | 0.4s | — | ease |
| Timetable slot hover | bg color | 0.15s | — | ease |
| Showcase card hover | border-color | 0.2s | — | ease |

All whileInView: viewport={{ once: true }}

## Responsive

**Desktop (≥1024px):**
- Hero: full viewport, content bottom-left
- Styles: full-width rows
- Timetable: 7-column grid
- Instructors: 3-column grid
- Showcase: centered, max-width 600px cards
- Footer: 3-column

**Tablet (768–1023px):**
- Styles: rows (same, narrower text)
- Timetable: horizontal scroll (overflow-x: auto)
- Instructors: 3-column (tighter)
- Footer: 2-column

**Mobile (<768px):**
- Navbar: hamburger, Cormorant italic links in dark overlay
- Hero: full-width, floating card hidden, text-align: left
- "ELLIPSE" bg text: opacity 0.02, clamp to 120px max
- Styles: rows, type slightly smaller
- Timetable: horizontal scroll, min-width: 600px
- Instructors: single column stack
- Showcase: single column
- Footer: single column

## Full Copy

**Navigation:** Ellipse · Classes · Timetable · Instructors · Showcase · Contact

**Hero:**
- Eyebrow: "DANCE STUDIO · SHOREDITCH"
- Headline: "Move Like You Mean It."
- Sub: "Professionally choreographed classes for adults and children across Ballet, Contemporary, Latin, and Hip-Hop. Studios in Shoreditch."
- CTA 1: "Find Your Class"
- CTA 2: "First Class Free"

**Classes label:** "OUR CLASSES"
**Classes headline:** "Something for everyone."
- Ballet: "From absolute beginners to pre-professional. Graded RAD syllabus alongside open adult classes. All ages welcome." | £14/class
- Contemporary: "Influenced by Forsythe, Cunningham, and release technique. Expect to work. Expect to feel something." | £14/class
- Latin: "Salsa, Bachata, Cha-Cha, and competition-level coaching. All levels from social to competitive." | £14/class
- Hip-Hop: "Old school foundations with new school energy. Breaking, locking, popping, and freestyle. All levels." | £14/class

**Timetable label:** "TIMETABLE"
**Timetable headline:** "This week's classes."
**Timetable note:** "Timetable subject to change. Book in advance to secure your spot."

**Instructors label:** "OUR INSTRUCTORS"
**Instructors headline:** "Trained to teach. Born to move."
- Elena Vasquez / "Ballet · 12 Years Royal Ballet School" / "R.A.D. Associate · Royal Ballet School graduate" / "Book with Elena →"
- James Okafor / "Contemporary · Formerly Rambert Dance" / "B.A. Dance Theatre · 8 years professional stage" / "Book with James →"
- Sofia Reyes / "Latin · 2× World Latin Champion" / "ISTD Licentiate · 2× World Latin Dance Champion" / "Book with Sofia →"

**Showcase:**
- Label: "UPCOMING PERFORMANCES"
- "ELLIPSE PRESENTS"
- "Winter Showcase" / "SAT 14 DEC" / "Hackney Empire, London" / "Buy Tickets →"
- "Spring Showcase" / "SAT 22 MAR" / "Barbican Centre, London" / "Buy Tickets →"

**Trial CTA:**
- Headline: "Your First Class Is Free."
- Sub: "No commitment. No registration. Just come and move."
- Button: "Book Your Free Class"

**Footer:**
- Tagline: "Dance Studio · Shoreditch, London"
- Address: "12 Rivington Street, Shoreditch, London EC2A 3DU"
- Hours: "Mon–Fri: 8am–9pm / Sat–Sun: 9am–6pm"
- Email: "hello@ellipsedance.co.uk"
- Phone: "+44 (0)20 7123 9876"
- Legal: "© 2025 Ellipse Dance Studio Ltd. All rights reserved."

## Key Dependencies
```json
{
  "motion": "^12.x",
  "lucide-react": "^0.4xx",
  "tailwindcss": "^3.x"
}
```
