# Childcare / Nursery Website Prompt
# websiteprompts.ai

Build a warm, premium childcare and nursery website called "Sunbeam Nursery" using React + Vite + TypeScript + Tailwind CSS + Framer Motion (motion/react) + shadcn/ui + lucide-react.

## Design System

### Colors
```css
:root {
  --background: 42 22% 97%;           /* warm white #faf8f2 */
  --foreground: 185 22% 14%;          /* deep teal near-black */
  --primary: 185 38% 35%;             /* deep teal #2a6b73 */
  --primary-foreground: 0 0% 100%;
  --accent: 48 72% 65%;               /* warm yellow #f0d060 */
  --accent-warm: 18 55% 65%;          /* warm coral #d4805a */
  --surface: 42 18% 92%;
  --muted-foreground: 185 10% 52%;
  --border: 42 14% 84%;
}
```

### Typography
- Import: `https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&family=Inter:wght@300;400;500&display=swap`
- Headlines: Nunito 700–800 — rounded, warm, but strong
- Body: Inter 300–400
- Labels: Inter 500 uppercase 10px letter-spacing 0.10em

## Sections

### 1. Navbar
- Sticky warm white, `backdrop-filter: blur(10px)`
- Left: Nunito 800 "Sunbeam" + small lucide Sun icon in warm yellow
- Right: Ages & Stages · Day in the Life · Our Team · Visit + "Book a visit →" teal button

### 2. Hero
- Full-viewport height, warm white background
- Full-bleed photography occupies right 58% of viewport: `position: absolute; right: 0; top: 0; width: 58%; height: 100%; object-fit: cover; object-position: center left`
- Left content panel: `position: absolute; left: 0; top: 0; width: 50%; height: 100%; display: flex; flex-direction: column; justify-content: center; padding: 0 5vw`
  `background: linear-gradient(to right, rgba(250,248,242,1) 0%, rgba(250,248,242,0.95) 80%, transparent 100%)`
- Content inside panel:
  - Inter 500 uppercase 10px teal label: "Nursery & Pre-School · Chiswick, London"
  - Nunito 800 `clamp(38px, 5vw, 65px)` foreground, line-height 1.05: "Where Every\nDay Feels Like\nan Adventure."
  - Warm yellow accent: small `3px solid #f0d060` left-border on headline, `padding-left: 1rem`
  - Inter 300 muted sub: "Full and part-time childcare for children aged 6 weeks to 5 years — Ofsted Outstanding, warm, and genuinely fun"
  - CTAs: "Book a visit →" (teal filled) + "Learn about our approach" (ghost)
  - Trust chips: "Ofsted Outstanding · Ages 6 weeks–5 years · Nursery Funding Accepted"

{/* Image brief: young child painting in bright nursery classroom, warm natural light, colourful but not cluttered environment, child focused and happy, genuine editorial photography not stock */}

- Stagger fade-up on mount (panel content)

### 3. Age Groups
- "Tailored to Every Stage" — Nunito 800
- 3 cards, horizontal: Babies (6 weeks–18 months) · Toddlers (18 months–3 years) · Pre-School (3–5 years)
- Each card: large teal age group icon, Nunito 700 name, Inter 300 description, warm surface background, teal "See curriculum →" link
- Framer Motion stagger fade-up on scroll, scale 0.95→1

### 4. A Day at Sunbeam
- "What a Day Looks Like" — Nunito 800
- Horizontal timeline, 5 key times:
  - 8:00 Morning Welcome (settling activity, free play)
  - 9:30 Structured Learning (phonics, numeracy, creativity)
  - 11:30 Outdoor Play (garden, nature, movement)
  - 12:30 Lunch (freshly cooked on-site, dietary requirements always catered)
  - 14:00 Rest, Story & Afternoon Activity
- Each: Nunito 700 time in teal, Inter 300 muted activity description

### 5. Our Approach
- "Learning Through Play" — Nunito 800
- Split: left text, right image
- Inter 300 muted: 2 paragraphs — EYFS curriculum delivered through play-based learning. Small key-worker groups. Every child's development tracked and shared with parents weekly.
- 4 teal checkpoints: "Ofsted Outstanding · EYFS qualified staff · Key-worker system · Weekly parent updates"

{/* Image brief: nursery teacher reading to small group of toddlers, warm classroom, engaged children, natural light */}

### 6. Our Team
- "Meet Your Child's Key Workers" — Nunito 800
- 3 team member cards: portrait (square, rounded-2xl), Nunito 700 name, teal qualification chip (EYFS / Level 3 qualified / Paediatric First Aid), Inter 300 short bio
- Hover: soft yellow border

{/* Image brief: nursery teacher with warm smile, indoor classroom, child-safe environment, professional and approachable */}
{/* Image brief: male nursery worker reading with child, warm and caring, natural light */}
{/* Image brief: nursery key worker headshot, warm professional, classroom background */}

### 7. Fees & Funding
- "Fees & Funding" — Nunito 800
- 3 clean rows: Full Day (8am–6pm, from £82/day) · Half Day (8am–1pm or 1pm–6pm, from £46/session) · Nursery Funding (15–30 hours government funding accepted)
- Nunito 700 tier name left, Inter 300 description right, teal price right-aligned
- Border-bottom separators
- "Check your funding eligibility →" teal link

### 8. Testimonials
- Warm surface section
- 3 cards: 5-star teal row, Inter 300 italic quote, parent name + child age in Inter 10px muted
- Stagger fade-up on scroll

### 9. Visit CTA
- Full-width deep teal `#2a6b73` background
- Nunito 800 white: "Come and See for Yourself"
- Inter 300 white: "We offer informal show-arounds every week — bring your little one, ask every question, and see if Sunbeam feels right"
- "Book a visit →" ivory button
- "Ofsted Outstanding · Places Available · Chiswick, London" Inter 10px ivory 70%

### 10. Footer
- Near-black, Nunito 800 "Sunbeam" + Sun icon in yellow
- Facebook · Instagram · Google
- "© 2026 Sunbeam Nursery · 18 Devonshire Road, Chiswick, London W4 · Mon–Fri 8am–6pm · Ofsted Outstanding"

## Animations
- Hero: stagger fade-up on mount (panel content)
- Age group cards: stagger scale 0.95→1 + fade-up on scroll
- Timeline: stagger slide-in from left
- Team cards: stagger fade-up

## Responsive
- Mobile: stacked hero (photo top, text panel below), single-column age groups, hamburger nav

## Full Copy
- Wordmark: "Sunbeam"
- Hero: "Where Every Day Feels Like an Adventure." / "Full and part-time childcare for children aged 6 weeks to 5 years — Ofsted Outstanding"
- Ages: Babies 6wks–18m · Toddlers 18m–3yr · Pre-School 3–5yr
- Fees: Full Day from £82 · Half Day from £46 · 15–30hr Funding Accepted
- Testimonial: "Sunbeam has been a second home for our son since he was 8 months old. The staff genuinely know and love him — we can see it every day." — Sophie & Tom R., Chiswick
- CTA: "Come and See for Yourself" / "Show-arounds every week"
