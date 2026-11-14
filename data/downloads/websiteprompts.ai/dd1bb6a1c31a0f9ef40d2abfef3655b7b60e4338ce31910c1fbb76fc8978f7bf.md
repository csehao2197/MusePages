# Dog Groomer Website Prompt — Pawhouse Studio
# websiteprompts.ai

Build a complete, production-ready boutique dog grooming studio website called **Pawhouse Studio** using React + Vite + TypeScript + Tailwind CSS + Framer Motion (motion/react) + shadcn/ui + lucide-react. The mood is warm, joyful, and artisanal — this is a beloved neighbourhood grooming studio, not a chain. Think hand-illustrated bakery meets premium pet care.

---

## 1. Goal Statement

Build a boutique dog grooming website that communicates professionalism, warmth, and genuine care — converting dog owners into bookings through trust signals, transparent packages, and joyful photography.

---

## 2. Tech Stack

- **Framework:** React + Vite + TypeScript
- **Styling:** Tailwind CSS (JIT, extend theme with CSS custom properties)
- **Animation:** Framer Motion (import as `motion` from `motion/react`)
- **Components:** shadcn/ui (Button, Input, Badge, Card)
- **Icons:** lucide-react
- **Fonts:** Google Fonts (Fraunces + Plus Jakarta Sans)

---

## 3. Design System

```css
:root {
  /* Backgrounds */
  --background: 40 38% 98%;          /* warm cream #fdfaf5 */
  --surface: 38 28% 95%;             /* warm off-white #f5f0e8 */
  --surface-warm: 35 40% 92%;        /* warm biscuit #ede4d4 */

  /* Foregrounds */
  --foreground: 28 22% 16%;          /* rich warm brown #302519 */
  --foreground-muted: 28 14% 48%;    /* mid warm brown #7e6e5c */

  /* Primary — deep teal */
  --primary: 164 59% 26%;            /* #1a6b5a */
  --primary-light: 164 42% 38%;      /* #358a74 */
  --primary-foreground: 0 0% 100%;

  /* Secondary — warm terracotta */
  --terracotta: 17 52% 53%;          /* #c4704a */
  --terracotta-light: 17 48% 68%;    /* #d9997a */
  --terracotta-foreground: 0 0% 100%;

  /* Accents */
  --cream: 40 38% 98%;               /* matches background */
  --warm-white: 42 25% 96%;

  /* Borders */
  --border: 36 22% 82%;              /* #d9cfbf */
  --border-muted: 36 15% 90%;        /* #ece8e0 */

  --radius: 0px;
}
```

Apply to `body`: `background-color: hsl(var(--background)); color: hsl(var(--foreground)); font-family: 'Plus Jakarta Sans', sans-serif;`

---

## 4. Typography

### Google Fonts Import
```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,700;1,9..144,400;1,9..144,700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
```

### Usage
| Element | Font | Weight | Style | Size | Line-height |
|---|---|---|---|---|---|
| H1 Display | Fraunces | 700 | italic | clamp(40px, 5.8vw, 100px) | 1.05 |
| H2 Section | Fraunces | 700 | italic | clamp(30px, 4vw, 60px) | 1.12 |
| H3 Cards/Names | Fraunces | 700 | italic | clamp(20px, 2.2vw, 28px) | 1.25 |
| Package names | Fraunces | 700 | italic | 22px | 1.2 |
| Quote text | Fraunces | 400 | italic | 17px | 1.8 |
| Body text | Plus Jakarta Sans | 400 | normal | 16px | 1.75 |
| Body small | Plus Jakarta Sans | 400 | normal | 14px | 1.7 |
| Label | Plus Jakarta Sans | 700 | normal | 11px, letter-spacing 0.14em | 1 |
| Nav items | Plus Jakarta Sans | 500 | normal | 14px | 1 |
| Button | Plus Jakarta Sans | 600 | normal | 14px, letter-spacing 0.04em | 1 |
| Price chip | Plus Jakarta Sans | 700 | normal | 15px | 1 |

---

## 5. Visual Effects

### Effect 1 — Hero Gradient Overlay
A left-anchored gradient overlay sits `z-10` over the hero photography panel, keeping the content column always legible:
```css
background: linear-gradient(
  to right,
  hsl(40, 38%, 98%) 0%,
  hsl(40, 38%, 98%) 38%,
  hsla(40, 38%, 98%, 0.95) 52%,
  hsla(40, 38%, 98%, 0.70) 65%,
  hsla(40, 38%, 98%, 0.20) 80%,
  transparent 100%
);
```
The gradient is a `position: absolute inset-0` div inside the hero's relative container, not on the image itself.

### Effect 2 — "PAW" Background Watermark
A large typographic watermark sits in the right half of the hero behind the photo:
```jsx
<div
  aria-hidden="true"
  className="absolute right-0 bottom-0 pointer-events-none select-none z-0"
  style={{
    fontFamily: '"Fraunces", serif',
    fontWeight: 700,
    fontStyle: 'italic',
    fontSize: 'clamp(220px, 32vw, 480px)',
    lineHeight: 0.85,
    color: 'hsl(var(--primary))',
    opacity: 0.025,
    letterSpacing: '-0.04em',
    transform: 'translateY(20%)',
    userSelect: 'none',
  }}
>
  PAW
</div>
```

### Effect 3 — Floating "Book a Groom" Availability Card
A small card below the hero CTAs that simulates live availability. Spring-entry then permanent gentle float:
```jsx
// Entry animation
initial={{ opacity: 0, scale: 0.90, y: 12 }}
animate={{ opacity: 1, scale: 1, y: 0 }}
transition={{ type: "spring", stiffness: 200, damping: 22, delay: 0.5 }}

// Permanent float (wrap in second motion.div)
animate={{ y: [0, -6, 0] }}
transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut", delay: 1.0 }}
```

### Effect 4 — Gallery Image Hover Scale
Each gallery image scales up gently on hover using CSS transforms:
```css
.gallery-img { transition: transform 0.32s cubic-bezier(0.22,1,0.36,1); }
.gallery-img:hover { transform: scale(1.042); }
```
Images are inside an `overflow: hidden` container so the scale is clipped cleanly.

### Effect 5 — Package Card Teal Left-Border on Hover
Package cards transition their left border from transparent to teal on hover with a shadow:
```css
border-left: 3px solid transparent;
transition: border-color 0.22s ease, box-shadow 0.22s ease, transform 0.22s ease;
```
Hover:
```css
border-left-color: hsl(164, 59%, 26%);
box-shadow: 0 6px 32px hsla(164, 59%, 26%, 0.12);
transform: translateY(-2px);
```

---

## 6. Component Breakdown

### Section 1 — Navbar

```
Layout: fixed top-0, w-full, z-50, h-16
Background: hsl(var(--background)) at 95% opacity, backdrop-blur-sm
Bottom border: 1px solid hsl(var(--border-muted))
Padding: px-6 md:px-12 lg:px-20
```

**Left:** Logo — paw print icon (lucide `PawPrint`, 18px, teal) followed by "Pawhouse" in Fraunces 700 italic 20px, foreground, then "Studio" in Plus Jakarta Sans 400 20px, foreground-muted. Gap: 6px between icon and text.

**Center (desktop):** `Services` / `About` / `Gallery` / `FAQs` — Plus Jakarta Sans 500, 14px, color hsl(var(--foreground-muted)), hover: hsl(var(--foreground)), gap: 36px.

**Right:** `Book Now` button — `background: hsl(var(--primary))`, white, Plus Jakarta Sans 600, 13px, letter-spacing 0.04em, padding `10px 22px`, border-radius: 0, hover: `background: hsl(var(--primary-light))`, transition 0.2s.

**Mobile:** Hamburger (lucide `Menu`), slide-down full-width drawer.

---

### Section 2 — Hero

```
Layout: relative, min-h-screen, overflow-hidden
Background photo: position absolute inset-0 w-full h-full object-cover object-center z-0
```

```jsx
{/* Image: Freshly groomed golden retriever or cream-coloured poodle looking directly into camera. Professional studio photography — warm, slightly elevated lighting, neutral warm cream background, the dog is clearly happy and impeccably groomed. Fluffy, clean coat. Shot at eye level, shallow depth of field, 85mm equivalent. Fills the right two-thirds of the frame. */}
<img
  src=""
  alt="Freshly groomed fluffy dog at Pawhouse Studio — happy, clean, looking at camera"
  className="w-full h-full object-cover object-center absolute inset-0"
  style={{ zIndex: 0 }}
/>
```

**PAW watermark** (see Effect 2 — sits behind photo, z-index: 0, visible through photo edges)

**Gradient overlay** (Effect 1 — position: absolute inset-0, z-index: 2):
The left-to-right gradient ensures the content column is always readable.

**Content column** (position: relative, z-index: 10, left side):
```
width: 50% on desktop (min-width: 520px, max-width: 620px)
padding: pl-6 md:pl-12 lg:pl-20, pt-28 pb-20
display: flex flex-col justify-center min-h-screen
```

Content (top to bottom):

1. **Eyebrow:** "BOUTIQUE DOG GROOMING · BRISTOL" — Plus Jakarta Sans 700, 11px, letter-spacing 0.14em, `color: hsl(var(--terracotta))`, margin-bottom 20px. Motion: `initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{duration:0.45,delay:0.1}}`

2. **H1:** "Your Dog Deserves to Feel Their Best." — Fraunces 700 italic, `clamp(40px,5.8vw,100px)`, line-height 1.05, `color: hsl(var(--foreground))`, max-width 540px. Motion: `transition={{duration:0.65,delay:0.2,ease:[0.22,1,0.36,1]}}`

3. **Subheadline:** "Professional grooming for dogs of all breeds — in a calm, one-dog-at-a-time studio where your pet's comfort always comes first." — Plus Jakarta Sans 300, `clamp(16px,1.3vw,19px)`, line-height 1.7, `color: hsl(var(--foreground-muted))`, max-width 440px, margin-top 20px. Motion: `transition={{duration:0.55,delay:0.35}}`

4. **CTA row** (margin-top 32px, flex gap-4, flex-wrap):
   - Primary: "Book a Groom" — `background: hsl(var(--primary))`, white, Plus Jakarta Sans 600, 15px, padding `14px 28px`, border-radius: 0, hover `background: hsl(var(--primary-light))`
   - Secondary: "See Our Packages →" — no background, border-bottom `1px solid hsl(var(--terracotta))`, `color: hsl(var(--terracotta))`, Plus Jakarta Sans 500, 15px
   Motion: `transition={{duration:0.5,delay:0.45}}`

5. **Availability card** (margin-top 40px, Effect 3):
   ```
   background: hsl(var(--background))
   border: 1px solid hsl(var(--border))
   border-left: 4px solid hsl(var(--primary))
   padding: 18px 22px
   max-width: 340px
   border-radius: 0
   ```
   - Top row: `BOOK A GROOM` — Plus Jakarta Sans 700, 10px, letter-spacing 0.16em, `color: hsl(var(--primary))`, margin-bottom 10px
   - Slot line: "Next available: Thu 14 Nov · 10:00am" — Plus Jakarta Sans 600, 14px, `color: hsl(var(--foreground))`, flex items-center gap-2 with `Calendar` lucide icon 14px teal
   - Urgency line: "2 spots remaining this week" — Plus Jakarta Sans 500, 13px, `color: hsl(var(--terracotta))`, margin-top 6px
   - CTA link: "Book Online →" — Plus Jakarta Sans 600, 14px, `color: hsl(var(--primary))`, border-bottom `1px solid hsl(var(--primary))`, margin-top 14px, hover opacity 0.75

---

### Section 3 — Grooming Packages

```
Section: py-24 md:py-32, background: hsl(var(--background))
Container: max-w-5xl mx-auto px-6 md:px-12
```

**Heading block** (margin-bottom 56px):
- Label: "OUR SERVICES" — Plus Jakarta Sans 700, 11px, letter-spacing 0.14em, `color: hsl(var(--terracotta))`, margin-bottom 12px
- H2: "Find the Right Groom for Your Dog" — Fraunces 700 italic, `clamp(30px,4vw,56px)`
- Subtext: "Every session is one-on-one. No cages, no rushing — just care." — Plus Jakarta Sans 300, 17px, `color: hsl(var(--foreground-muted))`, margin-top 12px

**4-card grid:** `grid grid-cols-1 sm:grid-cols-2 gap-6`

Each card:
```
background: hsl(var(--surface))
border-left: 3px solid transparent
padding: 28px 28px 24px
transition: border-color 0.22s ease, box-shadow 0.22s ease, transform 0.22s ease
hover: border-left-color hsl(var(--primary)), box-shadow 0 6px 32px hsla(164,59%,26%,0.12), translateY(-2px)
```

Card structure:
```
Top row: Price chip (right-aligned) + Package name (left)
Price chip: background hsl(var(--terracotta)), white, Plus Jakarta Sans 700, 14px, padding 4px 12px, border-radius 0
Package name: Fraunces 700 italic, 22px, color hsl(var(--foreground))

Duration/category: Plus Jakarta Sans 600, 11px, letter-spacing 0.10em, color hsl(var(--primary)), margin-top 6px

Divider: border-top 1px solid hsl(var(--border-muted)), margin: 18px 0

Includes list: checkmark (✓) items in Plus Jakarta Sans 400, 14px, color hsl(var(--foreground-muted)), line-height 2
```

**Packages:**

**Package 1 — The Tidy**
Price: £35
Duration: 1 hr · Small breeds
Includes: ✓ Bath & blowdry · ✓ Brush-out · ✓ Nail trim · ✓ Ear clean · ✓ Spritz & finish

**Package 2 — The Full Groom**
Price: £55
Duration: 1.5 hrs · All breeds
Includes: ✓ Full scissor cut · ✓ Bath & blowdry · ✓ Brush-out · ✓ Nail trim & file · ✓ Ear clean · ✓ Spritz & bandana
Note chip: `MOST POPULAR` — Plus Jakarta Sans 800, 9px, letter-spacing 0.16em, `background: hsl(var(--primary))`, white, padding 3px 10px, positioned top-right of card heading

**Package 3 — The Pamper**
Price: £75
Duration: 2 hrs · All breeds
Includes: ✓ Full groom · ✓ Teeth brushing · ✓ Blueberry facial · ✓ Deep conditioning mask · ✓ Nail trim, file & buff · ✓ Paw balm · ✓ Bandana or bow

**Package 4 — The Puppy First**
Price: £30
Duration: 45 min · Puppies under 12 months
Includes: ✓ Introductory bath · ✓ Gentle brush · ✓ Nail trim · ✓ Positive reward grooming · ✓ Completion certificate
Note chip: `PUPPY SPECIAL` — terracotta background

**Stagger animation (Framer Motion):**
```jsx
<motion.div
  variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, margin: "-60px" }}
>
  {packages.map(pkg => (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22,1,0.36,1] } }
      }}
    />
  ))}
</motion.div>
```

---

### Section 4 — Why Pawhouse

```
Section: py-20 md:py-28, background: hsl(var(--primary))
Container: max-w-5xl mx-auto px-6 md:px-12
```

**Heading** (centered, white, margin-bottom 48px):
- Label: "WHY CHOOSE US" — Plus Jakarta Sans 700, 11px, letter-spacing 0.14em, `color: hsla(0,0%,100%,0.55)`, margin-bottom 12px
- H2: "Grooming Done Differently" — Fraunces 700 italic, `clamp(28px,3.5vw,52px)`, white

**4 trust points:** `grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8`

Each trust point:
```
text-align: center
padding: 8px 16px
```
- Icon: lucide, 32px, `color: hsl(var(--terracotta-light))`, stroke-width 1.5, margin-bottom 16px, centered
- Heading: Plus Jakarta Sans 700, 16px, white, margin-bottom 8px
- Text: Plus Jakarta Sans 300, 14px, line-height 1.7, `color: hsla(0,0%,100%,0.65)`

**Trust points:**

1. Icon: `Shield` — "Fear-Free Certified" — Every groomer at Pawhouse holds a Fear-Free certification. We read body language, go at your dog's pace, and stop if needed.

2. Icon: `User` — "One Dog at a Time" — We never share our studio with multiple dogs simultaneously. Your dog has our full attention, in a calm, stress-free space.

3. Icon: `Leaf` — "Natural & Non-Toxic" — Every shampoo, conditioner, and product we use is paraben-free, sulphate-free, and safe for sensitive skin.

4. Icon: `Award` — "20+ Breeds Groomed" — From Maltese to Old English Sheepdogs, we have experience with over 20 breeds and growing — including doodles and double coats.

**WhileInView stagger:** `staggerChildren: 0.10`, `y: 24→0`, `opacity: 0→1`, `duration: 0.55`

---

### Section 5 — The Groomers

```
Section: py-24 md:py-32, background: hsl(var(--background))
Container: max-w-5xl mx-auto px-6 md:px-12
```

**Heading block** (margin-bottom 56px):
- Label: "MEET THE TEAM" — Plus Jakarta Sans 700, 11px, letter-spacing 0.14em, `color: hsl(var(--terracotta))`, margin-bottom 12px
- H2: "People Who Genuinely Love Dogs" — Fraunces 700 italic, `clamp(28px,3.5vw,52px)`

**3-card grid:** `grid grid-cols-1 md:grid-cols-3 gap-8`

Each groomer card:
```
background: hsl(var(--surface))
overflow: hidden
```

Photography area:
```
aspect-ratio: 3/4
overflow: hidden
```
```jsx
{/* Groomer 1 image: Female dog groomer in her mid-30s, smiling warmly, holding a fluffy poodle-mix. Light apron over a casual cotton top. Warm studio photography, shallow depth of field, soft cream/neutral background. Hair pulled back, approachable and professional expression. */}
<img src="" alt="Emma — Pawhouse Studio dog groomer" className="w-full h-full object-cover object-center" />
```

Card content (padding: 22px):
- Name: Fraunces 700 italic, 20px, margin-bottom 6px
- Years: Plus Jakarta Sans 400, 13px, `color: hsl(var(--foreground-muted))`
- Specialty chip: `background: hsl(var(--surface-warm))`, `color: hsl(var(--primary))`, Plus Jakarta Sans 700, 10px, letter-spacing 0.10em, padding 4px 12px, margin-top 14px, border-radius 0
- Short bio: Plus Jakarta Sans 400, 14px, line-height 1.7, `color: hsl(var(--foreground-muted))`, margin-top 12px

**Groomers:**

**Emma Clarke**
8 years experience
Specialty chip: `DOODLES & POODLES`
Bio: Emma trained at the British Dog Groomers' Association and has a special love for curly and wavy coats. She's the reason half our doodle clients won't go anywhere else.

**Jack Santos**
5 years experience
Specialty chip: `TERRIERS & SPANIELS`
Bio: Jack came to grooming from a career working with rescue dogs. His patience and calm presence make him brilliant with nervous or reactive dogs.

**Priya Mehta**
3 years experience
Specialty chip: `DOUBLE COATS & LARGE BREEDS`
Bio: Priya handles our big fluffy clients — Samoyeds, Bernese, Huskies — with a gentleness that's earned her a devoted following of large-breed families.

---

### Section 6 — Gallery

```
Section: py-24 md:py-32, background: hsl(var(--surface))
Container: max-w-5xl mx-auto px-6 md:px-12
```

**Heading block** (margin-bottom 48px):
- Label: "THE WORK" — Plus Jakarta Sans 700, 11px, letter-spacing 0.14em, `color: hsl(var(--terracotta))`, margin-bottom 12px
- H2: "The Results Speak for Themselves" — Fraunces 700 italic, `clamp(28px,3.5vw,52px)`, max-width 440px

**6-image grid:** `grid grid-cols-2 md:grid-cols-3 gap-3`

Each cell:
```
aspect-ratio: 1/1
overflow: hidden
background: hsl(var(--surface-warm))
```

Each image:
```
transition: transform 0.32s cubic-bezier(0.22,1,0.36,1)
hover: scale(1.042)
```

```jsx
{/* Gallery image 1: Fluffy cream Bichon Frise freshly groomed — round head shape, white fluffy coat, bright eyes, sitting perfectly, warm studio photography */}
<img src="" alt="Bichon Frise after professional grooming at Pawhouse Studio" className="w-full h-full object-cover object-center" />

{/* Gallery image 2: Golden-brown Cockapoo with freshly scissored coat, slightly wavy, ear feathering trimmed neatly — warm natural light, photographed at eye level, bright happy expression */}
<img src="" alt="Cockapoo freshly groomed — wavy coat, neat trim" className="w-full h-full object-cover object-center" />

{/* Gallery image 3: Miniature Schnauzer showing classic breed cut — salt-and-pepper coat, tidy beard, alert expression. Clean white/cream studio background. */}
<img src="" alt="Miniature Schnauzer with classic breed cut, freshly groomed" className="w-full h-full object-cover object-center" />

{/* Gallery image 4: Large Samoyed with brilliantly white fluffy coat, freshly washed and dried, coat standing full and clean, panting happily. Warm studio, soft shadow behind. */}
<img src="" alt="Samoyed with full fluffy white coat after professional grooming" className="w-full h-full object-cover object-center" />

{/* Gallery image 5: Chocolate Labradoodle with freshly scissored teddy-bear cut, wavy mid-length coat, bright eyes, head slightly tilted. Warm cream background, natural light. */}
<img src="" alt="Labradoodle teddy-bear cut at Pawhouse Studio" className="w-full h-full object-cover object-center" />

{/* Gallery image 6: Cavalier King Charles Spaniel with long silky ears, freshly groomed, coat lying sleek and shiny, gentle sweet expression looking slightly off-camera. Warm-toned photography. */}
<img src="" alt="Cavalier King Charles Spaniel freshly groomed, silky coat" className="w-full h-full object-cover object-center" />
```

**Gallery stagger whileInView:**
```jsx
staggerChildren: 0.06
initial: { opacity: 0, scale: 0.97 }
visible: { opacity: 1, scale: 1, transition: { duration: 0.45, ease: [0.22,1,0.36,1] } }
```

---

### Section 7 — Reviews

```
Section: py-24 md:py-32, background: hsl(var(--background))
Container: max-w-5xl mx-auto px-6 md:px-12
```

**Heading block** (centered, margin-bottom 56px):
- Label: "REVIEWS" — Plus Jakarta Sans 700, 11px, letter-spacing 0.14em, `color: hsl(var(--terracotta))`, margin-bottom 12px
- H2: "From Dog Parents Who Know" — Fraunces 700 italic, `clamp(28px,3.5vw,52px)`, centered

**3-card grid:** `grid grid-cols-1 md:grid-cols-3 gap-6`

Each review card:
```
background: hsl(var(--surface))
border-left: 3px solid hsl(var(--terracotta))
padding: 28px 28px 24px
```

Card structure:
- Stars: 5× filled star (lucide `Star`, 16px, fill: `hsl(var(--terracotta))`, stroke: none), flex row gap-1, margin-bottom 20px
- Quote: Fraunces 400 italic, 16px, line-height 1.85, `color: hsl(var(--foreground))`, font-style italic
- Attribution: Plus Jakarta Sans 600, 12px, letter-spacing 0.04em, `color: hsl(var(--foreground-muted))`, margin-top 20px

**Reviews:**

**Review 1:**
Stars: ★★★★★
Quote: "We've tried three other groomers and Bertie always came back stressed. At Pawhouse he came out wagging his tail and looking immaculate. Emma knew exactly what to do with his doodle coat. We won't go anywhere else."
Attribution: — Bertie's owner, Clifton

**Review 2:**
Stars: ★★★★★
Quote: "Jack is incredible with our rescue, who's usually terrified of new places and people. He took his time, let Biscuit set the pace, and by the end she was letting him brush her without a fuss. We cried on the way home. Genuinely."
Attribution: — Biscuit's owner, Cotham

**Review 3:**
Stars: ★★★★★
Quote: "The Pamper package for my Samoyed sounds insane but it's so worth it. Priya handles his coat like she was born to do it — the blueberry facial and paw balm are a bonus I didn't expect to care about. He smells incredible for two weeks."
Attribution: — Mishka's owner, Redland

---

### Section 8 — Booking CTA

```
Section: py-28 md:py-40
Background: hsl(var(--primary)) — deep teal #1a6b5a
Position: relative, overflow: hidden
```

Decorative watermark: Large paw print shape — use a big `PawPrint` lucide icon at 480px, `position: absolute, right: -60px, bottom: -60px, color: white, opacity: 0.04, z-index: 0, pointer-events: none`

Container: `max-w-3xl mx-auto px-6 text-center relative z-10`

- Label: "READY TO BOOK?" — Plus Jakarta Sans 700, 11px, letter-spacing 0.14em, `color: hsla(0,0%,100%,0.55)`, margin-bottom 16px
- H2: "Book Your Dog's Next Groom" — Fraunces 700 italic, `clamp(36px,5vw,80px)`, white, line-height 1.08
- Subtext: "We book up fast — spots are limited and we work with one dog at a time. Secure your slot now." — Plus Jakarta Sans 300, `clamp(16px,1.3vw,20px)`, `color: hsla(0,0%,100%,0.72)`, margin-top 16px, margin-bottom 44px, max-width 480px, mx-auto

**CTA button row** (flex gap-4 justify-center flex-wrap):
```jsx
<button
  style={{
    background: 'hsl(var(--terracotta))',
    color: 'white',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    fontWeight: 600,
    fontSize: '15px',
    letterSpacing: '0.04em',
    padding: '16px 36px',
    borderRadius: '0',
    border: 'none',
    cursor: 'pointer',
  }}
>
  Book a Groom Online
</button>
<button
  style={{
    background: 'transparent',
    color: 'white',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    fontWeight: 500,
    fontSize: '15px',
    padding: '16px 36px',
    borderRadius: '0',
    border: '1px solid hsla(255,255%,255%,0.35)',
    cursor: 'pointer',
  }}
>
  Call Us: 0117 946 2830
</button>
```

**WhileInView entrance:**
```jsx
initial={{ opacity: 0, y: 32 }}
whileInView={{ opacity: 1, y: 0 }}
viewport={{ once: true, margin: "-100px" }}
transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
```

---

### Section 9 — Footer

```
Section: py-16
Background: hsl(var(--foreground)) — warm near-black
```

**3-column grid** (gap-12 on desktop):

**Column 1 — Brand:**
- `PawPrint` icon (16px, terracotta-light) + "Pawhouse Studio" in Fraunces 700 italic 18px, white. Flex items-center gap-2.
- Tagline: "Bristol's boutique dog grooming studio — one dog at a time, always." — Plus Jakarta Sans 300, 14px, line-height 1.75, `color: hsla(0,0%,100%,0.5)`, margin-top 12px
- Trust badges (flex gap-2, margin-top 20px): `Fear-Free Certified` / `BDGA Member` — Plus Jakarta Sans 700, 9px, letter-spacing 0.12em, `border: 1px solid hsla(0,0%,100%,0.2)`, white at 50% opacity, padding 4px 10px

**Column 2 — Studio:**
Heading: "STUDIO" — Plus Jakarta Sans 700, 10px, letter-spacing 0.14em, `color: hsl(var(--terracotta-light))`, margin-bottom 16px
Links (Plus Jakarta Sans 400, 14px, `color: hsla(0,0%,100%,0.55)`, hover white, block, margin-bottom 10px):
- Services & Packages
- Meet the Groomers
- Gallery
- Dog Breed Guide
- FAQs
- Book a Groom

**Column 3 — Find Us:**
Heading: "FIND US" — same style as column 2 heading
Info (Plus Jakarta Sans 400, 14px, `color: hsla(0,0%,100%,0.55)`, line-height 1.8):
- Pawhouse Studio
- 12 Chandos Road
- Bristol BS6 6PG
- hello@pawhousestudio.co.uk
- 0117 946 2830
- Mon–Sat: 8am–6pm · Sun: Closed

**Bottom bar** (border-top: `1px solid hsla(0,0%,100%,0.08)`, margin-top 48px, padding-top 24px, flex between, flex-wrap gap-4):
- "© 2025 Pawhouse Studio. All rights reserved." — Plus Jakarta Sans 400, 13px, `color: hsla(0,0%,100%,0.4)`
- "Fear-Free Certified · BDGA Member" — same style, text-right

---

## 7. Animations — Complete Reference

| Element | Initial | Animate/WhileInView | Transition |
|---|---|---|---|
| Navbar | `{ opacity:0, y:-8 }` | `{ opacity:1, y:0 }` | `duration:0.4, delay:0.05` |
| Hero eyebrow | `{ opacity:0, y:12 }` | `{ opacity:1, y:0 }` | `duration:0.45, delay:0.1` |
| Hero H1 | `{ opacity:0, y:22 }` | `{ opacity:1, y:0 }` | `duration:0.65, delay:0.2, ease:[0.22,1,0.36,1]` |
| Hero subhead | `{ opacity:0, y:16 }` | `{ opacity:1, y:0 }` | `duration:0.55, delay:0.35` |
| Hero CTAs | `{ opacity:0, y:12 }` | `{ opacity:1, y:0 }` | `duration:0.5, delay:0.45` |
| Availability card | `{ opacity:0, scale:0.90, y:12 }` | `{ opacity:1, scale:1, y:0 }` | `type:"spring", stiffness:200, damping:22, delay:0.5` |
| Card float (infinite) | — | `{ y:[0,-6,0] }` | `duration:4.2, repeat:Infinity, ease:"easeInOut", delay:1.0` |
| Package cards | `{ opacity:0, y:20 }` | `{ opacity:1, y:0 }` | `staggerChildren:0.12, duration:0.55, ease:[0.22,1,0.36,1]` |
| Trust points | `{ opacity:0, y:24 }` | `{ opacity:1, y:0 }` | `staggerChildren:0.10, duration:0.55` |
| Groomer cards | `{ opacity:0, y:20 }` | `{ opacity:1, y:0 }` | `staggerChildren:0.12, duration:0.6` |
| Gallery images | `{ opacity:0, scale:0.97 }` | `{ opacity:1, scale:1 }` | `staggerChildren:0.06, duration:0.45, ease:[0.22,1,0.36,1]` |
| Review cards | `{ opacity:0, y:20 }` | `{ opacity:1, y:0 }` | `staggerChildren:0.10, duration:0.55` |
| Booking CTA | `{ opacity:0, y:32 }` | `{ opacity:1, y:0 }` | `duration:0.7, ease:[0.22,1,0.36,1]` |

---

## 8. Responsive Behaviour

### Desktop (≥1024px)
- Hero: full-viewport, content column left 50%, photo fills full viewport behind gradient
- Packages: 2×2 grid
- Trust points: 4-column horizontal
- Groomers: 3-column
- Gallery: 3×2 grid
- Reviews: 3-column

### Tablet (768px–1023px)
- Hero: content column 58%, photo behind, hero min-height 90vh
- Packages: 2 columns
- Trust points: 2×2 grid
- Groomers: 2 columns (third card full-width)
- Gallery: 2×3 grid
- Reviews: stacked (1 column)

### Mobile (<768px)
- Navbar: hamburger, slide-down overlay
- Hero: photo becomes bg at 75vh with `hsl(var(--background))` at 88% opacity overlay + backdrop-blur-sm on the content area; content is full-width, left-padded
- All grids: 1 column (packages 2 columns still if space)
- Availability card: full width
- PAW watermark: hidden on mobile (too distracting)
- CTA buttons: stacked full-width
- Footer: 1 column stacked

---

## 9. Full Copy

### Navigation
Logo: `Pawhouse Studio` (with PawPrint icon)
Links: `Services` · `About` · `Gallery` · `FAQs`
CTA: `Book Now`

### Hero
Eyebrow: `BOUTIQUE DOG GROOMING · BRISTOL`
H1: `Your Dog Deserves to Feel Their Best.`
Subheadline: `Professional grooming for dogs of all breeds — in a calm, one-dog-at-a-time studio where your pet's comfort always comes first.`
Primary CTA: `Book a Groom`
Secondary CTA: `See Our Packages →`
Card label: `BOOK A GROOM`
Slot: `Next available: Thu 14 Nov · 10:00am`
Urgency: `2 spots remaining this week`
Card link: `Book Online →`

### Packages
Section label: `OUR SERVICES`
H2: `Find the Right Groom for Your Dog`
Subtext: Every session is one-on-one. No cages, no rushing — just care.

Package 1 — The Tidy — £35 — 1 hr · Small breeds
Includes: Bath & blowdry · Brush-out · Nail trim · Ear clean · Spritz & finish

Package 2 — The Full Groom — £55 — 1.5 hrs · All breeds · MOST POPULAR
Includes: Full scissor cut · Bath & blowdry · Brush-out · Nail trim & file · Ear clean · Spritz & bandana

Package 3 — The Pamper — £75 — 2 hrs · All breeds
Includes: Full groom · Teeth brushing · Blueberry facial · Deep conditioning mask · Nail trim, file & buff · Paw balm · Bandana or bow

Package 4 — The Puppy First — £30 — 45 min · Puppies under 12 months · PUPPY SPECIAL
Includes: Introductory bath · Gentle brush · Nail trim · Positive reward grooming · Completion certificate

### Why Pawhouse
Section label: `WHY CHOOSE US`
H2: `Grooming Done Differently`

Fear-Free Certified: Every groomer at Pawhouse holds a Fear-Free certification. We read body language, go at your dog's pace, and stop if needed.
One Dog at a Time: We never share our studio with multiple dogs simultaneously. Your dog has our full attention, in a calm, stress-free space.
Natural & Non-Toxic: Every shampoo, conditioner, and product we use is paraben-free, sulphate-free, and safe for sensitive skin.
20+ Breeds Groomed: From Maltese to Old English Sheepdogs, we have experience with over 20 breeds — including doodles and double coats.

### The Groomers
Section label: `MEET THE TEAM`
H2: `People Who Genuinely Love Dogs`

Emma Clarke — 8 years experience — DOODLES & POODLES
Emma trained at the British Dog Groomers' Association and has a special love for curly and wavy coats. She's the reason half our doodle clients won't go anywhere else.

Jack Santos — 5 years experience — TERRIERS & SPANIELS
Jack came to grooming from a career working with rescue dogs. His patience and calm presence make him brilliant with nervous or reactive dogs.

Priya Mehta — 3 years experience — DOUBLE COATS & LARGE BREEDS
Priya handles our big fluffy clients — Samoyeds, Bernese, Huskies — with a gentleness that's earned her a devoted following of large-breed families.

### Gallery
Section label: `THE WORK`
H2: `The Results Speak for Themselves`

### Reviews
Section label: `REVIEWS`
H2: `From Dog Parents Who Know`

Review 1: "We've tried three other groomers and Bertie always came back stressed. At Pawhouse he came out wagging his tail and looking immaculate. Emma knew exactly what to do with his doodle coat. We won't go anywhere else." — Bertie's owner, Clifton

Review 2: "Jack is incredible with our rescue, who's usually terrified of new places and people. He took his time, let Biscuit set the pace, and by the end she was letting him brush her without a fuss. We cried on the way home. Genuinely." — Biscuit's owner, Cotham

Review 3: "The Pamper package for my Samoyed sounds insane but it's so worth it. Priya handles his coat like she was born to do it — the blueberry facial and paw balm are a bonus I didn't expect to care about. He smells incredible for two weeks." — Mishka's owner, Redland

### Booking CTA
Section label: `READY TO BOOK?`
H2: `Book Your Dog's Next Groom`
Body: We book up fast — spots are limited and we work with one dog at a time. Secure your slot now.
Primary CTA: `Book a Groom Online`
Secondary CTA: `Call Us: 0117 946 2830`

### Footer
Tagline: Bristol's boutique dog grooming studio — one dog at a time, always.
Trust badges: `Fear-Free Certified` · `BDGA Member`

Column heading: `STUDIO`
Links: Services & Packages · Meet the Groomers · Gallery · Dog Breed Guide · FAQs · Book a Groom

Column heading: `FIND US`
Info: Pawhouse Studio · 12 Chandos Road · Bristol BS6 6PG · hello@pawhousestudio.co.uk · 0117 946 2830 · Mon–Sat: 8am–6pm · Sun: Closed

Bottom bar: © 2025 Pawhouse Studio. All rights reserved. · Fear-Free Certified · BDGA Member

---

## 10. Key Dependencies

```json
{
  "dependencies": {
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "motion": "^11.0.0",
    "lucide-react": "^0.400.0",
    "@radix-ui/react-slot": "latest",
    "class-variance-authority": "latest",
    "clsx": "latest",
    "tailwind-merge": "latest"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.3.0",
    "typescript": "^5.5.0",
    "vite": "^5.4.0",
    "tailwindcss": "^3.4.0",
    "autoprefixer": "latest",
    "postcss": "latest"
  }
}
```

**shadcn/ui components:**
```bash
npx shadcn@latest add button input badge card
```

**Tailwind config additions:**
```js
theme: {
  extend: {
    colors: {
      background: 'hsl(var(--background))',
      foreground: 'hsl(var(--foreground))',
      primary: {
        DEFAULT: 'hsl(var(--primary))',
        foreground: 'hsl(var(--primary-foreground))',
      },
      terracotta: 'hsl(var(--terracotta))',
      surface: 'hsl(var(--surface))',
    },
    fontFamily: {
      display: ['"Fraunces"', 'serif'],
      sans: ['"Plus Jakarta Sans"', 'sans-serif'],
    },
  },
}
```
