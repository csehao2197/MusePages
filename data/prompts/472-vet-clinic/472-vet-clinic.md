# Vet Clinic Website Prompt
# websiteprompts.ai

Build a warm, modern veterinary clinic website called "Petal & Paw Veterinary" using React + Vite + TypeScript + Tailwind CSS + Framer Motion (motion/react) + shadcn/ui + lucide-react.

## Design System

### Colors
```css
:root {
  --background: 40 20% 97%;           /* warm white #faf7f2 */
  --foreground: 195 22% 14%;          /* deep teal near-black */
  --primary: 185 42% 38%;             /* deep teal #2a6b73 */
  --primary-foreground: 0 0% 100%;
  --accent: 38 60% 56%;               /* warm amber #c9913a */
  --surface: 40 16% 92%;
  --muted-foreground: 195 10% 52%;
  --border: 40 14% 83%;
}
```

### Typography
- Import: `https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap`
- All text: Plus Jakarta Sans
- Headlines: Plus Jakarta Sans 700–800
- Body: Plus Jakarta Sans 300–400
- Labels: Plus Jakarta Sans 600 uppercase 10px letter-spacing 0.10em

## Sections

### 1. Navbar
- Sticky warm white background, `backdrop-filter: blur(10px)`
- Left: Plus Jakarta Sans 700 wordmark "Petal & Paw" + small lucide Heart icon in teal
- Right: Services · Our Vets · About · Contact + "Book appointment →" teal button

### 2. Hero
- Full-viewport height, warm white background
- Full-bleed hero photograph fills entire viewport: `position: absolute inset-0 w-full h-full object-cover object-center`
- Composition-independent text backing overlay (bottom-left corner panel):
  `position: absolute; bottom: 0; left: 0; width: 48%; padding: 3rem 3.5rem 3.5rem;`
  `background: linear-gradient(to top right, rgba(250,247,242,0.98) 55%, transparent 100%);`
- Content inside backing panel:
  - Plus Jakarta Sans 600 uppercase 10px teal label: "Veterinary Clinic · Richmond, Surrey"
  - Plus Jakarta Sans 800 `clamp(34px, 4.5vw, 62px)` deep foreground: "Your Pet's Health\nIs Our Everything."
  - Plus Jakarta Sans 300 muted sub: "Compassionate, expert care for dogs, cats, and small animals — routine check-ups to specialist treatment"
  - CTAs: "Book an appointment →" (teal filled) + "Our services" (ghost teal)
  - Trust chips: "RCVS Accredited · Emergency Line 24/7 · 5★ Google"

{/* Image brief: large happy golden retriever in warm sunlit veterinary consultation room, dog looking at camera, professional vet clinic environment, soft natural light, warm and inviting */}

- Hero stagger fade-up on mount (panel content only, y: 25→0)

### 3. Services
- "How We Help" — Plus Jakarta Sans 800
- 6-service 3×2 grid:
  - Health & Vaccinations (annual check-ups, boosters, health certificates)
  - Dental Care (dental checks, cleaning, extractions)
  - Surgery (soft tissue and orthopaedic procedures)
  - Diagnostics (in-house blood testing, X-ray, ultrasound)
  - Microchipping (quick, safe, legally required)
  - Emergency Care (24-hour emergency line, same-day appointments)
- Each card: teal lucide icon, Plus Jakarta Sans 700 service name, 300 description, teal "Book →" link
- Hover: teal border + soft teal glow

### 4. Our Approach
- Split: left text, right image
- Plus Jakarta Sans 800: "We Know How Much They Mean to You"
- Plus Jakarta Sans 300: 2 paragraphs — every pet treated as if it were our own. No rushing appointments. We always explain what we're doing and why.
- 4 teal checkpoints: "RCVS accredited vets · In-house diagnostics · No hidden fees · Same-day appointments available"

{/* Image brief: veterinarian gently examining small kitten, warm clinic environment, genuine care and attention, natural light */}

### 5. Our Vets
- "Meet Your Vets" — Plus Jakarta Sans 800
- 3 vet cards: portrait (square, rounded-xl), Plus Jakarta Sans 700 name, teal RCVS chip, Plus Jakarta Sans 300 short specialism bio
- Hover: soft teal glow

{/* Image brief: female veterinarian in white coat, warm professional headshot, clinic background, confident and approachable */}
{/* Image brief: male vet with small dog on examination table, natural light, professional setting */}
{/* Image brief: female vet professional headshot, warm smile, clinic uniform */}

### 6. What to Expect
- "Your First Visit" — Plus Jakarta Sans 800
- 4-step process: Book Online → Arrive 5 Mins Early → Full Consultation → Treatment Plan
- Large faded teal number (opacity 0.08) behind each step
- Plus Jakarta Sans 300 muted description per step

### 7. Testimonials
- Warm surface section
- 3 cards: 5-star row in teal, Plus Jakarta Sans 300 italic quote, owner name + pet name/breed in Plus Jakarta Sans 10px muted
- Stagger fade-up on scroll

### 8. Emergency & Booking CTA
- Full-width deep teal `#2a6b73` background
- Plus Jakarta Sans 800 white: "Worried About Your Pet? We're Here."
- Plus Jakarta Sans 300 white: "Book a same-day appointment online, or call our emergency line any time — 24 hours a day, 7 days a week"
- "Book appointment →" ivory button + "Emergency: 020 8123 4567" ivory outlined button
- "RCVS Accredited · No Hidden Fees · Richmond, Surrey" Plus Jakarta Sans 10px ivory 70%

### 9. Footer
- Near-black background, Plus Jakarta Sans 700 wordmark "Petal & Paw" in teal
- Facebook · Instagram · Google Maps
- "© 2026 Petal & Paw Veterinary · 22 George Street, Richmond, Surrey TW9 · Mon–Sat 8:30am–6:30pm · Emergency: 020 8123 4567"

## Animations
- Hero: fade-up on mount (panel content only)
- Service grid: stagger fade-up on scroll
- Vet cards: stagger fade-up on scroll
- Teal glow on hover: 0.2s ease

## Responsive
- Mobile: stacked hero (photo full width, text panel below), single-column services, hamburger nav

## Full Copy
- Wordmark: "Petal & Paw"
- Hero: "Your Pet's Health Is Our Everything." / "Compassionate, expert care for dogs, cats, and small animals"
- Services: Vaccinations · Dental Care · Surgery · Diagnostics · Microchipping · Emergency
- Process: Book → Arrive → Consultation → Treatment Plan
- Emergency: 020 8123 4567 (24/7)
- Testimonial: "Our dog Archie had emergency surgery last year. The care was extraordinary — the whole team kept us updated throughout. We wouldn't go anywhere else." — Emma R., Richmond
- CTA: "Worried About Your Pet? We're Here." / "Emergency line 24/7"
