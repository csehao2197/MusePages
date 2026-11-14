# Harmonic Academy — Music School Website Prompt

## Goal
Build a warm, inviting music school website for "Harmonic Academy" — warm white background, deep mahogany structure, warm amber accents, DM Serif Display editorial headlines, intimate golden-hour photography, and a free trial conversion focus.

## Tech Stack
React + Vite + TypeScript + Tailwind CSS + Framer Motion (motion/react) + shadcn/ui + lucide-react

## Design System

### Colors
```css
:root {
  --background: 40 33% 97%;
  --foreground: 22 75% 10%;
  --primary: 33 65% 52%;
  --primary-foreground: 40 33% 97%;
  --muted-foreground: 40 18% 50%;
  --border: 40 28% 82%;
  --accent: 35 45% 88%;
}
```

Hex reference:
- Background: #faf8f2 (warm off-white)
- Foreground (deep mahogany): #2a1505
- Primary (warm amber): #d4903a
- Light cream (card backgrounds): #f0e8d8
- Muted text: #9e8a70
- Border: #d8c8a8

### Typography
Google Fonts import:
`https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Plus+Jakarta+Sans:wght@300,400,600&display=swap`

- Display/Headlines: DM Serif Display 400 (warm editorial, no bold weight needed — the font is inherently striking at large sizes)
- Sub-headlines: Plus Jakarta Sans 600
- Body: Plus Jakarta Sans 400
- Captions/labels: Plus Jakarta Sans 300

## Visual Effects

### Effect 1: Floating Trial Lesson Card
Below hero CTAs, a floating card animates in:
Background: #f0e8d8 (light cream). Border: 0.5px solid #2a1505 (mahogany). Border-radius: 12px. Padding: 16px 20px. Max-width: 300px.
Box-shadow: 0 8px 28px rgba(42,21,5,0.12).
Contents:
- Amber chip: background: rgba(212,144,58,0.15), border: 0.5px solid #d4903a, Plus Jakarta 600, 10px, letter-spacing: 0.12em, amber color, border-radius: 100px, padding: 4px 12px: "FREE FIRST LESSON"
- Plus Jakarta 600, 14px, mahogany (#2a1505), margin-top: 10px: "Your first lesson is on us"
- Plus Jakarta 300, 12px, muted, margin-top: 4px: "30 minutes · Any instrument · Any age"
- Amber link: Plus Jakarta 400, 12px, amber (#d4903a), margin-top: 10px, underline on hover: "Check availability →"
Framer Motion: initial={{ scale: 0.9, opacity: 0 }}, animate={{ scale: 1, opacity: 1 }}, transition={{ delay: 0.5, duration: 0.55, ease: [0.16,1,0.3,1] }}

### Effect 2: Instrument Card Amber Glow Hover
Each of the 6 instrument cards: hover produces box-shadow: 0 4px 24px rgba(212,144,58,0.22). Icon color transitions from mahogany to amber (#d4903a). Transition: 0.22s ease.

### Effect 3: Age Group Card Scale Entry
Three age group cards animate in with Framer Motion scale stagger: initial={{ scale: 0.95, opacity: 0 }}, whileInView={{ scale: 1, opacity: 1 }}, transition={{ delay: index * 0.12, duration: 0.6, ease: [0.16,1,0.3,1] }}

### Effect 4: Rightward Directional Gradient (Hero Left Panel)
The left hero panel uses a gradient that fades into the photography on the right:
```css
background: linear-gradient(
  to right,
  rgba(250,248,242,1) 0%,
  rgba(250,248,242,0.95) 80%,
  transparent 100%
);
```
Ensures the ivory text panel reads cleanly regardless of photography subject position.

### Effect 5: Exam Results Marquee
Amber-accented trust strip on mahogany background scrolling at 35s linear infinite:
"ABRSM Exam Centre · Grade 1–8 · Trinity College London · 94% Pass Rate 2024 · Grade 8 Distinction available"
Plus Jakarta 400, 13px, cream (#f0e8d8). Amber "·" separators (#d4903a).

## Component Breakdown

### 1. Navbar
- Fixed top, background: rgba(250,248,242,0.96), backdrop-filter: blur(12px), border-bottom: 1px solid hsl(var(--border))
- Height: 64px
- Left: "Harmonic" in DM Serif Display, 20px, mahogany (#2a1505) + " Academy" in Plus Jakarta 300, 20px, muted
- Center: Plus Jakarta 400, 13px, mahogany links — Instruments / For Kids / For Adults / Our Tutors / Book
- Right: "Book a Free Trial" — amber bg (#d4903a), cream text (#faf8f2), Plus Jakarta 600, 12px, border-radius: 8px, padding: 10px 22px
- Hover on links: amber (#d4903a). Transition: 0.18s.

### 2. Hero
Split layout, min-height: 100vh.

**Left Panel — 45% width:**
Display: flex, flex-direction: column, justify-content: center, padding: 0 6% 0 8%. Max-width: 540px.

Right-edge gradient fading to photography:
```css
background: linear-gradient(to right, rgba(250,248,242,1) 0%, rgba(250,248,242,0.95) 80%, transparent 100%);
```

Content:
- Eyebrow chip: background: rgba(212,144,58,0.12), border: 0.5px solid #d4903a, color: #d4903a, Plus Jakarta 600, 10px, letter-spacing: 0.12em, border-radius: 100px, padding: 5px 14px, display: inline-block, margin-bottom: 20px. Text: "Music Lessons · Notting Hill & Online"

- Headline: "Learn Music. Love it for Life." — DM Serif Display, clamp(42px,5.8vw,104px), mahogany (#2a1505), line-height: 1.05, margin-bottom: 20px
- Framer Motion: initial={{ opacity: 0, y: 28 }}, animate={{ opacity: 1, y: 0 }}, transition={{ duration: 0.85, ease: [0.16,1,0.3,1] }}

- Sub: "Expert tuition in piano, guitar, vocals, and more — for ages 5 to adult. Lessons in Notting Hill and online." — Plus Jakarta 400, 16px, muted (#9e8a70), line-height: 1.6, margin-bottom: 32px
- Framer Motion: delay: 0.15s

- CTAs (flex, gap: 12px, margin-bottom: 32px):
  - "Book a Free Trial" — amber bg (#d4903a), mahogany text (#2a1505), Plus Jakarta 600, 14px, border-radius: 8px, padding: 14px 28px
  - "Browse Instruments" — transparent, border: 1.5px solid #2a1505, mahogany text, same font, same padding
  - Framer Motion: delay: 0.25s

- Floating Trial Lesson Card (below CTAs, not overlapping CTA row):
  Scale 0.9→1, opacity 0→1 at delay 0.5s.

**Right Panel — 55% width:**
Full-bleed warm photography, position: relative, overflow: hidden.
No border-radius. Object-fit: cover, object-position: center.

{/* Image: Intimate interior photography of a young adult woman sitting at an upright piano in a warm, cosy practice room. She is focused on the sheet music on the piano stand, fingers on the keys. The room has wooden floorboards, warm afternoon sunlight streaming through a window on the right side of frame, casting long golden rays across the piano. A music stand is visible in soft focus background. Warm, honey-toned golden hour light fills the room. Mood: intimate, aspirational, joy of learning, cosy productivity. */}
<img src="" alt="Woman playing upright piano in warm golden afternoon light" style={{ objectFit: 'cover', objectPosition: 'center', width: '100%', height: '100%' }} />

### 3. Instruments Grid
Background: hsl(var(--background)). Padding: 100px 6%.

**Header:**
- Plus Jakarta 600, 11px, amber (#d4903a), letter-spacing: 0.15em, uppercase, margin-bottom: 12px: "INSTRUMENTS"
- DM Serif Display, clamp(30px,4vw,56px), mahogany, margin-bottom: 56px: "Play the music you love."

**6 Instrument Cards — 3×2 grid, gap: 16px:**
Each: background: #f0e8d8 (light cream), border: 1px solid hsl(var(--border)), border-radius: 12px, padding: 28px 24px.
Hover: box-shadow: 0 4px 24px rgba(212,144,58,0.22), icon color: amber. Transition: 0.22s ease.

Card structure (vertical, centered):
- Lucide icon, 28px, mahogany (→ amber on hover): instrument representation
- Plus Jakarta 600, 16px, mahogany, margin-top: 12px: instrument name
- Plus Jakarta 300, 13px, muted, line-height: 1.55, margin-top: 6px: short description
- Plus Jakarta 400, 13px, amber (#d4903a), margin-top: 12px, hover: underline: "Learn more →"

**The 6 instruments:**
1. Piano (icon: Music, Keyboard) / "From absolute beginner to Grade 8 and beyond. Classical, jazz, and contemporary styles."
2. Guitar (icon: Music2) / "Acoustic, electric, and classical. Rock, folk, blues, and fingerpicking techniques."
3. Vocals (icon: Mic) / "Breath control, range extension, technique, and performance confidence. All styles."
4. Violin (icon: Music) / "Beginner to advanced. Classical and folk repertoire. Full-size and 3/4 instruments available."
5. Drums (icon: Radio) / "Kit fundamentals to reading music. Acoustic and electronic practice options available."
6. Music Theory (icon: BookOpen) / "ABRSM theory grades 1–8, ear training, composition, and harmony."

Framer Motion: stagger 0.08s, opacity 0→1, y 18→0, whileInView, viewport={{ once: true }}

### 4. Age Groups Section
Background: #f0e8d8 (light cream). Padding: 100px 6%.

**Header:**
- Plus Jakarta 600, 11px, amber, letter-spacing: 0.15em, uppercase: "WHO WE TEACH"
- DM Serif Display, 56px, mahogany, margin-bottom: 64px: "Music lessons for every age."

**3 Age Group Cards — 3-column grid, gap: 24px:**
Each: background: #faf8f2, border: 1px solid hsl(var(--border)), border-radius: 16px, padding: 40px 32px.
Framer Motion: scale 0.95→1, opacity 0→1, stagger 0.12s, whileInView.

Card structure:
- Amber chip: amber bg 15%, amber border 0.5px, Plus Jakarta 600, 10px, letter-spacing: 0.12em, amber color, border-radius: 100px, padding: 4px 12px: age range
- DM Serif Display, 26px, mahogany, margin-top: 16px, margin-bottom: 12px: group name
- Plus Jakarta 400, 15px, muted, line-height: 1.65, margin-bottom: 20px: description
- Plus Jakarta 400, 13px, amber, hover underline: "See curriculum →"

**The 3 groups:**
1. Chip: "AGES 5–12" / "Young Musicians" / "Structured, playful, and aligned with ABRSM grades. We make music fun first — the grades follow naturally. Instruments from violin and piano to drums." / "See curriculum →"
2. Chip: "AGES 13–17" / "Teen Learners" / "Technique and creativity in equal measure. Rock bands, songwriting workshops, and ABRSM exam preparation for those who want it." / "See curriculum →"
3. Chip: "AGES 18+" / "Adult Learners" / "No pressure, no exams unless you want them. Pick up where you left off, or start completely fresh. Pure love of music." / "See curriculum →"

### 5. Tutor Profiles
Background: hsl(var(--background)). Padding: 100px 6%.

**Header:**
- Plus Jakarta 600, 11px, amber, letter-spacing: 0.15em, uppercase: "OUR TUTORS"
- DM Serif Display, 56px, mahogany, margin-bottom: 56px: "Exceptional teachers. Lifelong musicians."

**3 Tutor Cards — 3-column grid, gap: 24px:**
Each: background: #f0e8d8, border-radius: 12px, overflow: hidden, border: 1px solid hsl(var(--border)).

Card structure:
- Top: square headshot (1:1 ratio), full-bleed
- Padding: 24px
- Plus Jakarta 600, 18px, mahogany: tutor name
- Amber chip (same style as age group chips): specialism
- Plus Jakarta 400, 14px, muted, line-height: 1.6, margin-top: 12px: bio
- Plus Jakarta 400, 13px, amber, margin-top: 14px, hover underline: "Book with [name] →"

**The 3 tutors:**

1. Emma Clarke LRAM — chip: "Piano & Music Theory"
{/* Image: Professional headshot of a female music tutor in her mid-30s, European appearance, seated at a piano or in front of a bookcase of music scores. She is wearing smart casual clothing in warm tones. Warm studio lighting, slightly warm background. Friendly, professional smile. Square crop 1:1. Mood: expert, warm, approachable teacher. */}
<img src="" alt="Emma Clarke LRAM — Piano and Music Theory tutor" style={{ objectFit: 'cover', objectPosition: 'center', width: '100%', aspectRatio: '1/1' }} />
Bio: "Emma holds a Licentiate of the Royal Academy of Music and has 15 years of teaching experience across all grades. She has helped over 60 students achieve Distinction in their ABRSM exams."
Link: "Book with Emma →"

2. Tom Bradley BMus Hons — chip: "Guitar & Songwriting"
{/* Image: Professional headshot of a male guitar tutor in his early 30s, light-brown skin, wearing a relaxed denim jacket. He may be holding an acoustic guitar or photographed near one. Warm, slightly informal studio setting. Broad, easy smile. Square crop 1:1. Mood: friendly, creative, accessible, passionate. */}
<img src="" alt="Tom Bradley BMus Hons — Guitar and Songwriting tutor" style={{ objectFit: 'cover', objectPosition: 'center', width: '100%', aspectRatio: '1/1' }} />
Bio: "Tom graduated with a BMus Hons from Leeds Conservatoire and specialises in acoustic, electric, and classical guitar. His songwriting workshops are particularly popular with teenage students."
Link: "Book with Tom →"

3. Aiko Tanaka MA — chip: "Vocals & Performance"
{/* Image: Professional headshot of a female vocal tutor in her late 20s, Japanese appearance, dressed in elegant professional clothing. She is photographed in a clean light-filled studio or practice room. Warm, confident smile. Square crop 1:1. Mood: polished, expert, warm, confident performer. */}
<img src="" alt="Aiko Tanaka MA — Vocals and Performance tutor" style={{ objectFit: 'cover', objectPosition: 'center', width: '100%', aspectRatio: '1/1' }} />
Bio: "Aiko holds an MA in Vocal Performance from the Royal College of Music and performs professionally as a mezzo-soprano. She specialises in classical technique, musical theatre, and performance coaching."
Link: "Book with Aiko →"

Framer Motion: stagger 0.12s, opacity 0→1, y 20→0, viewport={{ once: true }}

### 6. Exam Results Strip
Background: #2a1505 (mahogany). Padding: 32px 6%. Overflow: hidden.
Border-top: none (flows from content above).

Horizontal scrolling marquee: 35s linear infinite.
"ABRSM Exam Centre · Grade 1–8 · Trinity College London · 94% Pass Rate 2024 · Grade 8 Distinction available · Over 400 Students Examined ·"
Plus Jakarta 400, 13px, #f0e8d8 (cream). Separator "·" in amber (#d4903a). Duplicate for seamless loop.

### 7. Testimonials
Background: hsl(var(--background)). Padding: 80px 6%. Max-width: 760px, margin: auto.

**2 testimonials:**
Each: border-left: 2px solid #d4903a, padding-left: 28px, margin-bottom: 48px.
- Plus Jakarta 400, 16px, mahogany, line-height: 1.65: quote
- Plus Jakarta 600, 12px, amber (#d4903a), letter-spacing: 0.12em, margin-top: 14px: attribution
- 5 amber star icons (lucide Star, fill: #d4903a, 13px) above quote

Quote 1: "Emma has transformed my daughter's relationship with the piano. She went from dreading practice to playing for 40 minutes without being asked. Grade 3 Distinction last month. — Helen R., parent"
Quote 2: "I hadn't played guitar since school — about 25 years ago. Tom made it feel completely natural to pick it up again. I'm now learning Bossa Nova, which I never thought possible. — Michael D., adult learner"

Framer Motion: opacity 0→1, x -16→0, stagger 0.18s, viewport={{ once: true }}

### 8. Amber CTA Section
Background: #d4903a (amber). Padding: 120px 6%. Text-align: center.

- DM Serif Display, clamp(36px,5.5vw,88px), mahogany (#2a1505), italic (DM Serif Display renders slightly italicised at display sizes): "Your First Lesson Is on Us."
- Plus Jakarta 400, 17px, mahogany 80%, margin-top: 16px, margin-bottom: 40px: "No commitment. No experience needed. Just a genuine love of music."
- "Book Your Free Trial" button: mahogany bg (#2a1505), cream text (#faf8f2), Plus Jakarta 600, 14px, border-radius: 8px, padding: 16px 40px
- Below: Plus Jakarta 300, 12px, mahogany 60%, margin-top: 14px: "30-minute free session · Any instrument · Any age · Online or in studio"

Framer Motion: y 24→0, opacity 0→1, whileInView, duration: 0.7s.

### 9. Footer
Background: #2a1505 (mahogany). Padding: 64px 6%.
4-column grid:

Column 1: "Harmonic Academy" DM Serif Display, 16px, cream (#f0e8d8). Below: Plus Jakarta 300, 13px, muted cream 60%: "Music lessons for ages 5 to adult. Notting Hill & online." Amber Instagram/Facebook icons, hover: cream.

Column 2: "Instruments" — Plus Jakarta 600, 10px, amber, letter-spacing header. Links: Plus Jakarta 300, 13px, cream 65%: Piano / Guitar / Vocals / Violin / Drums / Music Theory

Column 3: "Studio" — same header. Plus Jakarta 300, 13px, cream 65%: "4 Pembridge Road, Notting Hill, London W11 3HN" / "Mon–Fri: 9am–8pm / Sat: 9am–5pm / Sun: 10am–4pm" / "Also available online via Zoom"

Column 4: "Book" — same. Plus Jakarta 300, 13px, cream 65%: "hello@harmonicacademy.co.uk" / "+44 (0)20 7654 3210" / "Free trial available for all new students"

Bottom: Plus Jakarta 300, 11px, cream 35%: "© 2025 Harmonic Academy Ltd. All rights reserved. ABRSM Registered Exam Centre No. 12345."

## Animations

| Element | Animation | Duration | Delay | Easing |
|---|---|---|---|---|
| Hero headline | opacity 0→1, y 28→0 | 0.85s | 0s | [0.16,1,0.3,1] |
| Hero sub + CTAs | opacity 0→1, y 22→0 | 0.85s | 0.15s | [0.16,1,0.3,1] |
| Floating trial card | scale 0.9→1, opacity 0→1 | 0.55s | 0.5s | [0.16,1,0.3,1] |
| Instrument cards | opacity 0→1, y 18→0 | 0.5s | i×0.08s | ease |
| Age group cards | scale 0.95→1, opacity 0→1 | 0.6s | i×0.12s | [0.16,1,0.3,1] |
| Tutor cards | opacity 0→1, y 20→0 | 0.6s | i×0.12s | ease |
| Testimonials | opacity 0→1, x -16→0 | 0.6s | i×0.18s | ease |
| CTA block | opacity 0→1, y 24→0 | 0.7s | 0s | ease |
| Instrument card hover | box-shadow + icon color | 0.22s | — | ease |
| Marquee | translateX loop | 35s | — | linear, infinite |

All whileInView: viewport={{ once: true }}

## Responsive

**Desktop (≥1024px):**
- Hero: 45% left / 55% right split
- Instruments: 3×2 grid
- Age groups: 3-column grid
- Tutors: 3-column grid
- Footer: 4-column

**Tablet (768–1023px):**
- Hero: stacks (image top 40vh, content below)
- Instruments: 2×3 grid
- Age groups: 1×3 vertical stack
- Tutors: 1×3 vertical stack
- Footer: 2×2 grid

**Mobile (<768px):**
- Navbar: hamburger, DM Serif Display links in warm overlay
- Hero: full-width left content, floating card below CTAs
- Instruments: 2×3 grid (smaller padding)
- Age groups: 1 column
- Tutors: 1 column
- Marquee: same speed
- Footer: 1 column

## Full Copy

**Navigation:** Harmonic Academy · Instruments · For Kids · For Adults · Our Tutors · Book

**Hero:**
- Eyebrow chip: "Music Lessons · Notting Hill & Online"
- Headline: "Learn Music. Love it for Life."
- Sub: "Expert tuition in piano, guitar, vocals, and more — for ages 5 to adult. Lessons in Notting Hill and online."
- CTA 1: "Book a Free Trial"
- CTA 2: "Browse Instruments"
- Floating card chip: "FREE FIRST LESSON"
- Floating card: "Your first lesson is on us"
- Floating card sub: "30 minutes · Any instrument · Any age"
- Floating card link: "Check availability →"

**Instruments label:** "INSTRUMENTS"
**Instruments headline:** "Play the music you love."
- Piano: "From absolute beginner to Grade 8 and beyond. Classical, jazz, and contemporary styles."
- Guitar: "Acoustic, electric, and classical. Rock, folk, blues, and fingerpicking techniques."
- Vocals: "Breath control, range extension, technique, and performance confidence. All styles."
- Violin: "Beginner to advanced. Classical and folk repertoire. Full-size and 3/4 instruments available."
- Drums: "Kit fundamentals to reading music. Acoustic and electronic practice options available."
- Music Theory: "ABRSM theory grades 1–8, ear training, composition, and harmony."

**Age Groups label:** "WHO WE TEACH"
**Age Groups headline:** "Music lessons for every age."
- Ages 5–12 / "Young Musicians" / "Structured, playful, and aligned with ABRSM grades. We make music fun first — the grades follow naturally. Instruments from violin and piano to drums."
- Ages 13–17 / "Teen Learners" / "Technique and creativity in equal measure. Rock bands, songwriting workshops, and ABRSM exam preparation for those who want it."
- Ages 18+ / "Adult Learners" / "No pressure, no exams unless you want them. Pick up where you left off, or start completely fresh. Pure love of music."

**Tutors label:** "OUR TUTORS"
**Tutors headline:** "Exceptional teachers. Lifelong musicians."
- Emma Clarke LRAM / "Piano & Music Theory" / "Emma holds a Licentiate of the Royal Academy of Music and has 15 years of teaching experience across all grades. She has helped over 60 students achieve Distinction in their ABRSM exams." / "Book with Emma →"
- Tom Bradley BMus Hons / "Guitar & Songwriting" / "Tom graduated with a BMus Hons from Leeds Conservatoire and specialises in acoustic, electric, and classical guitar. His songwriting workshops are particularly popular with teenage students." / "Book with Tom →"
- Aiko Tanaka MA / "Vocals & Performance" / "Aiko holds an MA in Vocal Performance from the Royal College of Music and performs professionally as a mezzo-soprano. She specialises in classical technique, musical theatre, and performance coaching." / "Book with Aiko →"

**Exam Results marquee:** "ABRSM Exam Centre · Grade 1–8 · Trinity College London · 94% Pass Rate 2024 · Grade 8 Distinction available · Over 400 Students Examined ·"

**Testimonials:**
- "Emma has transformed my daughter's relationship with the piano. She went from dreading practice to playing for 40 minutes without being asked. Grade 3 Distinction last month. — Helen R., parent" ★★★★★
- "I hadn't played guitar since school — about 25 years ago. Tom made it feel completely natural to pick it up again. I'm now learning Bossa Nova, which I never thought possible. — Michael D., adult learner" ★★★★★

**CTA Section:**
- Headline: "Your First Lesson Is on Us."
- Sub: "No commitment. No experience needed. Just a genuine love of music."
- Button: "Book Your Free Trial"
- Fine print: "30-minute free session · Any instrument · Any age · Online or in studio"

**Footer:**
- Tagline: "Music lessons for ages 5 to adult. Notting Hill & online."
- Address: "4 Pembridge Road, Notting Hill, London W11 3HN"
- Hours: "Mon–Fri: 9am–8pm / Sat: 9am–5pm / Sun: 10am–4pm"
- Online: "Also available online via Zoom"
- Email: "hello@harmonicacademy.co.uk"
- Phone: "+44 (0)20 7654 3210"
- Note: "Free trial available for all new students"
- Legal: "© 2025 Harmonic Academy Ltd. All rights reserved. ABRSM Registered Exam Centre No. 12345."

## Key Dependencies
```json
{
  "motion": "^12.x",
  "lucide-react": "^0.4xx",
  "tailwindcss": "^3.x"
}
```
