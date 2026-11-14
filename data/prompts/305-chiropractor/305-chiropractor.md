# Align Clinic — Chiropractor Website Prompt

## Goal
Build a clean, professional chiropractic clinic website for "Align Clinic" — pure white background, deep navy structure, electric blue CTAs, DM Serif Display editorial headlines, clinical yet warm in feel, conversion-optimised for appointment bookings.

## Tech Stack
React + Vite + TypeScript + Tailwind CSS + Framer Motion (motion/react) + shadcn/ui + lucide-react

## Design System

### Colors
```css
:root {
  --background: 0 0% 100%;
  --foreground: 222 42% 18%;
  --primary: 208 76% 47%;
  --primary-foreground: 0 0% 100%;
  --muted-foreground: 220 10% 55%;
  --border: 220 15% 88%;
  --accent: 208 76% 47%;
}
```

Hex reference:
- Background: #ffffff
- Foreground (navy): #1a2440
- Primary (electric blue): #1a8cd4
- Light grey background sections: #f5f5f7
- Muted text: #8a8fa8
- Border: #dde1ea

### Typography
Google Fonts import:
`https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Plus+Jakarta+Sans:wght@300,400,600&display=swap`

- Display/Headlines: DM Serif Display 400
- Sub-headlines/Buttons: Plus Jakarta Sans 600
- Body: Plus Jakarta Sans 400
- Captions/Labels: Plus Jakarta Sans 300

## Visual Effects

### Effect 1: Floating Availability Card
White background card, bottom-left of hero panel. Shadow: 0 8px 32px rgba(26,36,64,0.12). Border-radius: 12px. Border: 0.5px solid hsl(var(--border)). Padding: 16px 20px.
Contents: blue chip "FREE POSTURAL ASSESSMENT" + Plus Jakarta 600 "Available this week — 5 spots remaining" + Plus Jakarta 300 small "No obligation · 30 minutes · Clinic or video"
Framer Motion: initial={{ scale: 0.9, opacity: 0 }}, animate={{ scale: 1, opacity: 1 }}, transition={{ delay: 0.5, duration: 0.55, ease: [0.16,1,0.3,1] }}

### Effect 2: Faded Step Numbers
Behind each process step: Plus Jakarta Sans 600, 72px, navy (#1a2440) at 5% opacity, position: absolute, top: 0, left: 0, user-select: none, pointer-events: none.

### Effect 3: Condition Chip Grid Hover
Each condition chip: border: 1px solid hsl(var(--border)), background: white, color: navy, border-radius: 8px, padding: 20px 16px, transition: 0.2s ease.
Hover: background: hsl(var(--primary)) (#1a8cd4), color: white, border-color: transparent, box-shadow: 0 4px 16px rgba(26,140,212,0.25).

### Effect 4: Trust Strip Scroll
Horizontal scrolling strip at a moderate pace: 30s linear infinite. Navy icons, navy text, light grey dividers.

## Component Breakdown

### 1. Navbar
- Fixed top, background: rgba(255,255,255,0.96), backdrop-filter: blur(12px), border-bottom: 1px solid hsl(var(--border))
- Height: 68px
- Left: "Align" in DM Serif Display, 20px, navy + "Clinic" in Plus Jakarta 300, 20px, navy (slightly lighter), together reading "Align Clinic"
- Center: Plus Jakarta 400, 14px, navy links — Conditions / Our Team / Pricing / Book
- Right: "Book Free Assessment" — navy background (#1a2440), white text, Plus Jakarta 600, 13px, border-radius: 6px, padding: 10px 22px
- Hover on nav links: electric blue, transition 0.2s

### 2. Hero
Split layout, min-height: 100vh.

**Left Panel — 48% width:**
Background: white. Padding: 0 6% 0 8%. Display: flex, flex-direction: column, justify-content: center. Max-width: 560px.

Gradient on right edge (fading from white to transparent):
```css
background: linear-gradient(to right, rgba(255,255,255,1) 0%, rgba(255,255,255,0.97) 75%, transparent 100%);
```
This fades the left panel into the photography.

- Small label chip above headline: background: rgba(26,140,212,0.1), color: #1a8cd4, Plus Jakarta 600, 11px, letter-spacing: 0.12em, border-radius: 100px, padding: 5px 14px, display: inline-block, margin-bottom: 20px. Text: "Chiropractic Care · Clapham & Chelsea"

- Headline: "Move Without Pain." — DM Serif Display, clamp(42px,6vw,108px), navy (#1a2440), line-height: 1.0, margin-bottom: 20px
- Framer Motion: initial={{ opacity: 0, y: 30 }}, animate={{ opacity: 1, y: 0 }}, transition={{ duration: 0.85, ease: [0.16,1,0.3,1] }}

- Sub: "Evidence-based chiropractic care for back pain, neck pain, sciatica, and sports injuries. Clinics in Clapham and Chelsea." — Plus Jakarta 400, 16px, muted (#8a8fa8), line-height: 1.6, margin-bottom: 36px

- CTAs (flex, gap: 12px):
  - "Book Free Assessment" — navy bg (#1a2440), white text, Plus Jakarta 600, 14px, border-radius: 8px, padding: 14px 28px
  - "Learn More" — transparent bg, border: 1.5px solid navy, navy text, same font, same padding
  - Framer Motion: delay: 0.15s

- Floating Availability Card (positioned below CTAs, margin-top: 32px):
  Background: white. Border-radius: 12px. Border: 0.5px solid hsl(var(--border)). Box-shadow: 0 8px 32px rgba(26,36,64,0.10). Padding: 16px 20px. Max-width: 320px.
  - Blue chip: background: rgba(26,140,212,0.1), color: #1a8cd4, Plus Jakarta 600, 10px, letter-spacing: 0.12em, border-radius: 100px, padding: 4px 12px: "FREE POSTURAL ASSESSMENT"
  - Plus Jakarta 600, 14px, navy, margin-top: 10px: "Available this week — 5 spots remaining"
  - Plus Jakarta 300, 12px, muted, margin-top: 4px: "No obligation · 30 minutes · Clinic or video"
  - Framer Motion: scale 0.9→1, opacity 0→1, delay: 0.5s

**Right Panel — 52% width:**
Full-bleed clinical photography, no border-radius.

{/* Image: Professional clinical photography of a chiropractor performing a spinal adjustment on a patient lying face-down on a treatment table. The chiropractor's hands are positioned on the patient's lower back, applying precise pressure. Warm clinical lighting from above. The treatment room is clean and modern with white walls. Both chiropractor and patient appear calm and professional. Shot from the side at mid-height. Mood: clinical expertise, trust, care, relief. */}
<img src="" alt="Chiropractor performing spinal adjustment on patient" style={{ objectFit: 'cover', objectPosition: 'center', width: '100%', height: '100%' }} />

### 3. Conditions Grid
Background: #f5f5f7. Padding: 100px 6%.

**Header:**
- Plus Jakarta Sans 600, 11px, electric blue (#1a8cd4), letter-spacing: 0.15em, uppercase, margin-bottom: 12px: "CONDITIONS WE TREAT"
- DM Serif Display, clamp(30px,4vw,52px), navy: "Expert care for the conditions that hold you back."
- Margin-bottom: 56px

**6 chips — 3×2 grid, gap: 16px:**
Each chip card: white bg, border: 1px solid hsl(var(--border)), border-radius: 8px, padding: 24px 20px, cursor: pointer.
Hover: bg: #1a8cd4, color: white, border-color: transparent, box-shadow: 0 4px 16px rgba(26,140,212,0.25). Transition: 0.2s ease.

Chip structure:
- Lucide icon, 22px, electric blue (turns white on hover): above
- Plus Jakarta 600, 15px, navy (turns white on hover): condition name
- Plus Jakarta 300, 13px, muted (turns white/80% on hover): short description

**The 6 conditions:**
1. Back Pain (icon: Activity) / "Lower back, upper back, and chronic pain"
2. Neck Pain (icon: Zap) / "Tension, stiffness, and nerve-related neck pain"
3. Headaches & Migraines (icon: Brain) / "Cervicogenic and tension-type headaches"
4. Sciatica (icon: Zap) / "Shooting leg pain from nerve compression"
5. Sports Injury (icon: Medal) / "Muscle, joint, and impact injuries"
6. Posture Correction (icon: AlignCenter) / "Desk posture, hyperkyphosis, and forward head"

Framer Motion: whileInView chips, stagger 0.07s between chips, initial={{ opacity: 0, y: 16 }}, animate={{ opacity: 1, y: 0 }}, transition: 0.45s ease, viewport={{ once: true }}

### 4. 3-Step Process
Background: white. Padding: 100px 6%.

**Header:**
- Plus Jakarta 600, 11px, blue, letter-spacing: 0.15em: "HOW IT WORKS"
- DM Serif Display, 48px, navy: "Your route to recovery in three steps."
- Margin-bottom: 64px

**3 Steps — 3-column grid on desktop:**
Each step: position: relative, padding-top: 8px.

Behind step number (absolute, top: -8px, left: 0): Plus Jakarta 600, 72px, navy (#1a2440) at 5% opacity, user-select: none, line-height: 1.

Step structure:
- Blue horizontal line, 40px wide, 2px tall, margin-bottom: 20px
- Plus Jakarta 600, 18px, navy: step name
- Plus Jakarta 400, 15px, muted, line-height: 1.6: step description
- Plus Jakarta 300, 12px, blue, margin-top: 12px: duration/note

**Steps:**
1. "Assessment" (01) — "We begin with a thorough consultation and biomechanical assessment. We listen to your history, assess your movement, and identify the root cause — not just the symptom." | 30–45 minutes
2. "Treatment Plan" (02) — "You receive a personalised care plan. We explain exactly what we're treating, how many sessions we recommend, and what to expect. No surprises." | Agreed together
3. "Recover & Move" (03) — "Treatment begins. Most patients feel meaningful improvement within 3–5 sessions. We also give you stretches and exercises to support your progress between visits." | Ongoing support

Framer Motion: whileInView stagger 0.15s, opacity 0→1, y 20→0, viewport={{ once: true }}

### 5. Team Section
Background: #f5f5f7. Padding: 100px 6%.

**Header:**
- Plus Jakarta 600, 11px, blue, letter-spacing: 0.15em: "OUR TEAM"
- DM Serif Display, 48px, navy: "Three experienced clinicians. One shared goal."
- Margin-bottom: 56px

**3 Team Cards — 3-column grid, gap: 24px:**
Each card: white bg, border-radius: 12px, overflow: hidden, border: 1px solid hsl(var(--border)).

Card structure:
- Top: 1:1 headshot photography, no border-radius (inherits from card)
- Padding: 24px
- Plus Jakarta 600, 18px, navy: name
- Blue chip: background: rgba(26,140,212,0.1), blue text, Plus Jakarta 600, 11px, letter-spacing: 0.1em, border-radius: 100px, padding: 3px 10px, margin-top: 6px: specialty
- Plus Jakarta 400, 14px, muted, line-height: 1.6, margin-top: 12px: bio
- Plus Jakarta 400, 14px, blue, margin-top: 16px, hover underline: "Book with [name] →"

**The 3 clinicians:**
1. "Dr. Sarah Chen DC" — chip: "Sports & Rehabilitation"
{/* Image: Professional headshot of a female chiropractor in her mid-30s, East Asian appearance, wearing a clean white clinical uniform. Warm studio lighting from the front-left, neutral light grey background. Confident, warm smile. Square crop, 1:1. Mood: professional, approachable, expert. */}
<img src="" alt="Dr. Sarah Chen, Chiropractor specialising in sports injury" style={{ objectFit: 'cover', objectPosition: 'center', width: '100%', aspectRatio: '1/1' }} />
Bio: "Dr. Chen specialises in sports injury rehabilitation and has treated elite-level athletes. She completed her Doctorate of Chiropractic at the AECC and has 9 years of clinical experience."

2. "Dr. Marcus Webb DC" — chip: "Chronic Pain & Posture"
{/* Image: Professional headshot of a male chiropractor in his early 40s, light skin, wearing a dark navy clinical uniform. Warm studio lighting, neutral background. Calm, confident expression. Square crop, 1:1. Mood: experienced, trustworthy, considered. */}
<img src="" alt="Dr. Marcus Webb, Chiropractor specialising in chronic pain" style={{ objectFit: 'cover', objectPosition: 'center', width: '100%', aspectRatio: '1/1' }} />
Bio: "Dr. Webb focuses on chronic pain management and postural correction. He trained at the Anglo-European College of Chiropractic and has 14 years of experience helping desk workers and manual labourers alike."

3. "Dr. Priya Patel DC" — chip: "Women's Health & Paediatrics"
{/* Image: Professional headshot of a female chiropractor in her late 30s, South Asian appearance, wearing a teal clinical uniform. Bright, warm studio lighting, neutral background. Warm, inviting smile. Square crop, 1:1. Mood: kind, expert, safe. */}
<img src="" alt="Dr. Priya Patel, Chiropractor specialising in pregnancy and paediatric care" style={{ objectFit: 'cover', objectPosition: 'center', width: '100%', aspectRatio: '1/1' }} />
Bio: "Dr. Patel specialises in pregnancy-related back pain and paediatric chiropractic care. She is Webster Technique certified and has worked with hundreds of expectant mothers across Clapham and Chelsea."

Framer Motion: stagger 0.12s between cards, opacity 0→1, y 24→0, viewport={{ once: true }}

### 6. Insurance & Trust Strip
Background: #1a2440 (navy). Padding: 32px 6%. Overflow: hidden.

Horizontal scroll marquee — 30s linear infinite:
"BUPA Recognised · AXA PPP · Cigna · Vitality Health · 5★ Google Reviews · Est. 2009 · GCC Registered · Over 2,400 Patients Treated ·"
Plus Jakarta 400, 13px, white 80% opacity. Separator "·" in electric blue (#1a8cd4).

### 7. Pricing
Background: white. Padding: 100px 6%. Max-width: 760px, margin: auto.

**Header:**
- Plus Jakarta 600, 11px, blue, letter-spacing: 0.15em: "PRICING"
- DM Serif Display, 48px, navy: "Transparent fees. No hidden costs."
- Margin-bottom: 48px

**Pricing rows — 3 rows:**
Each: flex, justify-content: space-between, align-items: center. Padding: 24px 0. Border-top: 1px solid hsl(var(--border)).

Left: Plus Jakarta 600, 17px, navy: service name. Below: Plus Jakarta 400, 14px, muted: description.
Right: Plus Jakarta 600, 20px, navy: price.

1. "Initial Assessment" / "90-minute first appointment including full assessment and first treatment." / £75
2. "Follow-Up Treatment" / "45-minute treatment session." / £55
3. "Package of 6 Sessions" / "Includes one initial assessment and five follow-up treatments. Save £50." / £380

Last row: border-bottom: 1px solid hsl(var(--border)).
Below table: Plus Jakarta 300, 13px, muted, text-align: center, margin-top: 20px: "BUPA, AXA PPP, Cigna, and Vitality patients — please contact us to confirm coverage before booking."

### 8. Testimonials
Background: #f5f5f7. Padding: 80px 6%. Max-width: 720px, margin: auto.

**2 testimonials:**
Each: white bg, border-radius: 12px, padding: 28px 32px, border: 1px solid hsl(var(--border)).

- Plus Jakarta 400, 16px, navy, line-height: 1.65, italic: quote
- Plus Jakarta 600, 13px, blue, margin-top: 16px: name and location
- Star rating: 5 lucide Star icons, fill: #1a8cd4, size: 14px, margin-bottom: 12px

Quote 1: "First time in three years I've woken up without back pain. Dr. Webb found the cause in the first session — nobody else had. — Mark S., Clapham" ★★★★★
Quote 2: "I came in for sciatica and was barely able to sit. Four sessions in and I ran a 5k last Sunday. The difference is remarkable. — Lisa M., Chelsea" ★★★★★

Framer Motion: stagger 0.15s, opacity 0→1, y 16→0, viewport={{ once: true }}

### 9. Navy CTA Section
Background: #1a2440. Padding: 120px 6%. Text-align: center.

- DM Serif Display, clamp(30px,4.5vw,68px), white: "Ready to Move Without Pain?"
- Plus Jakarta 400, 18px, white 70%, margin-top: 16px, margin-bottom: 40px: "Free 30-minute assessment available this week. Clinics in Clapham and Chelsea."
- "Book Your Free Assessment" button: electric blue bg (#1a8cd4), white text, Plus Jakarta 600, 15px, border-radius: 8px, padding: 16px 40px
- Below button: Plus Jakarta 300, 13px, white 50%, margin-top: 16px: "Online booking · Instant confirmation · No deposit required"

Framer Motion: scale 0.96→1, opacity 0→1, viewport={{ once: true }}, duration: 0.65s

### 10. Footer
Background: white. Border-top: 1px solid hsl(var(--border)). Padding: 56px 6%.
4-column grid:

Column 1: "Align Clinic" DM Serif, 18px, navy. Plus Jakarta 300, 13px, muted: "Evidence-based chiropractic care. Clapham & Chelsea."

Column 2: "Conditions" — Plus Jakarta 600, 11px, blue, letter-spacing header. Links: Plus Jakarta 400, 13px, muted: Back Pain / Neck Pain / Sciatica / Sports Injury / Posture

Column 3: "Visit Us" — Same header. Plus Jakarta 400, 13px, muted: "Clapham Clinic: 12 Clapham High Street, London SW4 7UT" / "Chelsea Clinic: 8 King's Road, London SW3 4ND" / "Mon–Fri: 8am–7pm / Sat: 9am–3pm"

Column 4: "Book" — Same header. Plus Jakarta 400, 13px: "hello@alignclinic.co.uk" / "+44 (0)20 7890 1234" / "Online booking available 24/7"

Bottom: Plus Jakarta 300, 11px, muted 50%: "© 2025 Align Clinic Ltd. GCC Registered. All rights reserved."

## Animations

| Element | Animation | Duration | Delay | Easing |
|---|---|---|---|---|
| Hero headline | opacity 0→1, y 30→0 | 0.85s | 0s | [0.16,1,0.3,1] |
| Hero sub + CTAs | opacity 0→1, y 24→0 | 0.85s | 0.15s | [0.16,1,0.3,1] |
| Floating card | scale 0.9→1, opacity 0→1 | 0.55s | 0.5s | [0.16,1,0.3,1] |
| Condition chips | opacity 0→1, y 16→0 | 0.45s | i×0.07s | ease |
| Process steps | opacity 0→1, y 20→0 | 0.6s | i×0.15s | ease |
| Team cards | opacity 0→1, y 24→0 | 0.6s | i×0.12s | ease |
| Testimonials | opacity 0→1, y 16→0 | 0.5s | i×0.15s | ease |
| CTA block | scale 0.96→1, opacity 0→1 | 0.65s | 0s | ease |
| Chip hover | bg, color, shadow | 0.2s | — | ease |
| Trust marquee | translateX loop | 30s | — | linear, infinite |

All whileInView: viewport={{ once: true }}

## Responsive

**Desktop (≥1024px):**
- Hero: 48% left panel / 52% right image side-by-side
- Conditions: 3×2 grid
- Process: 3-column horizontal
- Team: 3-column grid
- Footer: 4-column grid

**Tablet (768–1023px):**
- Hero: stacks — image on top (40vh), content below
- Conditions: 2×3 grid
- Process: 3-column (narrower)
- Team: 1×3 vertical stack
- Footer: 2×2 grid

**Mobile (<768px):**
- Navbar: hamburger, dark overlay menu
- Hero: stacked, floating card below CTAs inline
- Conditions: 2×3 grid (smaller padding)
- Process: vertical numbered list
- Team: single column
- Footer: single column

## Full Copy

**Navigation:** Align Clinic · Conditions · Our Team · Pricing · Book

**Hero:**
- Chip label: "Chiropractic Care · Clapham & Chelsea"
- Headline: "Move Without Pain."
- Sub: "Evidence-based chiropractic care for back pain, neck pain, sciatica, and sports injuries. Clinics in Clapham and Chelsea."
- CTA 1: "Book Free Assessment"
- CTA 2: "Learn More"
- Floating card chip: "FREE POSTURAL ASSESSMENT"
- Floating card: "Available this week — 5 spots remaining"
- Floating card sub: "No obligation · 30 minutes · Clinic or video"

**Conditions label:** "CONDITIONS WE TREAT"
**Conditions tagline:** "Expert care for the conditions that hold you back."
- Back Pain / "Lower back, upper back, and chronic pain"
- Neck Pain / "Tension, stiffness, and nerve-related neck pain"
- Headaches & Migraines / "Cervicogenic and tension-type headaches"
- Sciatica / "Shooting leg pain from nerve compression"
- Sports Injury / "Muscle, joint, and impact injuries"
- Posture Correction / "Desk posture, hyperkyphosis, and forward head"

**Process label:** "HOW IT WORKS"
**Process tagline:** "Your route to recovery in three steps."
- Assessment: "We begin with a thorough consultation and biomechanical assessment. We listen to your history, assess your movement, and identify the root cause — not just the symptom." | 30–45 minutes
- Treatment Plan: "You receive a personalised care plan. We explain exactly what we're treating, how many sessions we recommend, and what to expect. No surprises." | Agreed together
- Recover & Move: "Treatment begins. Most patients feel meaningful improvement within 3–5 sessions. We also give you stretches and exercises to support your progress between visits." | Ongoing support

**Team label:** "OUR TEAM"
**Team tagline:** "Three experienced clinicians. One shared goal."
- Dr. Sarah Chen DC / "Sports & Rehabilitation" / "Dr. Chen specialises in sports injury rehabilitation and has treated elite-level athletes. She completed her Doctorate of Chiropractic at the AECC and has 9 years of clinical experience." / "Book with Sarah →"
- Dr. Marcus Webb DC / "Chronic Pain & Posture" / "Dr. Webb focuses on chronic pain management and postural correction. He trained at the Anglo-European College of Chiropractic and has 14 years of experience helping desk workers and manual labourers alike." / "Book with Marcus →"
- Dr. Priya Patel DC / "Women's Health & Paediatrics" / "Dr. Patel specialises in pregnancy-related back pain and paediatric chiropractic care. She is Webster Technique certified and has worked with hundreds of expectant mothers across Clapham and Chelsea." / "Book with Priya →"

**Trust strip:** "BUPA Recognised · AXA PPP · Cigna · Vitality Health · 5★ Google Reviews · Est. 2009 · GCC Registered · Over 2,400 Patients Treated ·"

**Pricing label:** "PRICING"
**Pricing tagline:** "Transparent fees. No hidden costs."
- Initial Assessment / "90-minute first appointment including full assessment and first treatment." / £75
- Follow-Up Treatment / "45-minute treatment session." / £55
- Package of 6 Sessions / "Includes one initial assessment and five follow-up treatments. Save £50." / £380
- Note: "BUPA, AXA PPP, Cigna, and Vitality patients — please contact us to confirm coverage before booking."

**Testimonials:**
- "First time in three years I've woken up without back pain. Dr. Webb found the cause in the first session — nobody else had. — Mark S., Clapham" ★★★★★
- "I came in for sciatica and was barely able to sit. Four sessions in and I ran a 5k last Sunday. The difference is remarkable. — Lisa M., Chelsea" ★★★★★

**CTA section:**
- Headline: "Ready to Move Without Pain?"
- Sub: "Free 30-minute assessment available this week. Clinics in Clapham and Chelsea."
- Button: "Book Your Free Assessment"
- Fine print: "Online booking · Instant confirmation · No deposit required"

**Footer:**
- Tagline: "Evidence-based chiropractic care. Clapham & Chelsea."
- Clapham: "12 Clapham High Street, London SW4 7UT"
- Chelsea: "8 King's Road, London SW3 4ND"
- Hours: "Mon–Fri: 8am–7pm / Sat: 9am–3pm"
- Email: "hello@alignclinic.co.uk"
- Phone: "+44 (0)20 7890 1234"
- Note: "Online booking available 24/7"
- Legal: "© 2025 Align Clinic Ltd. GCC Registered. All rights reserved."

## Key Dependencies
```json
{
  "motion": "^12.x",
  "lucide-react": "^0.4xx",
  "tailwindcss": "^3.x"
}
```
