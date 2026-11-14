# Dog Groomer Website Prompt
# websiteprompts.ai

Build a warm, friendly dog grooming salon website called "Pawfect Groom" using React + Vite + TypeScript + Tailwind CSS + Framer Motion (motion/react) + shadcn/ui + lucide-react.

## Design System

### Colors
```css
:root {
  --background: 40 30% 97%; /* warm white #faf8f3 */
  --foreground: 190 20% 15%; /* near-black */
  --primary: 185 45% 40%; /* warm teal #38929a */
  --primary-foreground: 40 30% 97%;
  --accent: 38 65% 55%; /* warm amber #c9833a */
  --surface: 40 25% 92%; /* warm oat surface */
  --muted-foreground: 190 10% 50%;
  --border: 40 20% 82%;
}
```

### Typography
- Import: `https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;700;800&display=swap`
- All text: Plus Jakarta Sans 700–800 (display) / 400–500 (body)

## Sections

### 1. Navbar
- Sticky warm white, `backdrop-filter: blur(8px)`, teal bottom hairline on scroll
- Left: Plus Jakarta 800 wordmark "Pawfect" teal + "Groom" near-black + small scissors lucide icon in teal
- Right: Services · About · Gallery · FAQ + "Book Now →" teal filled button

### 2. Hero
- Split: left content 52%, right portrait image 48%
- Floating portrait image: `border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%`, no border radius on edges
- Portrait gently floats on 7s loop: `translateY(0→-12px→0)`, ease-in-out
- Left content:
  - Plus Jakarta 800 uppercase muted: "Richmond's No-Cage Dog Groomer"
  - Plus Jakarta 800 `clamp(40px, 6vw, 88px)`: "Your Dog Deserves\nThe Best Groom."
  - Teal amber accent on "Best Groom."
  - Plus Jakarta 400: "Professional, stress-free grooming with zero cage time. All breeds welcome."
  - CTAs: "Book a groom →" (teal filled) + "See pricing" (ghost)
  - Trust chips: "No Cage Drying · All Breeds · Dog Friendly"

{/* Image brief: happy golden retriever looking up at camera, warm soft background, clean fluffy coat, friendly portrait */}

### 3. Services
- "What We Offer" — Plus Jakarta 800 with amber underline rule
- 6 cards in 3×2 grid, warm surface background, teal top accent bar:
  1. The Bath & Dry — from £35 · shampoo, conditioning, blow-dry
  2. Full Groom — from £55 · bath, dry, breed-style cut
  3. Puppy's First Groom — from £30 · gentle intro experience
  4. De-Shedding Treatment — from £45 · intensive brush-out
  5. Nail Trim — from £12 · clipping and filing
  6. Teeth Brushing — from £10 · pet-safe toothpaste
- Card hover: teal border + amber price chip lifts

### 4. Why Pawfect
- "Why Choose Pawfect" — Plus Jakarta 800
- 50/50 split: left teal background with 4 checkpoints, right editorial image
- 4 checkpoints with amber check icons:
  1. No Cage Drying — air dried with space to move
  2. One Dog at a Time — your dog has our full attention
  3. Fully Insured — City & Guilds qualified
  4. All Breeds Welcome — specialist in long-coated and anxious dogs

{/* Image brief: professional dog groomer carefully trimming a dog, calm professional environment, warm lighting */}

### 5. Gallery Strip
- 5 images, 280px height, horizontal strip, scale 1.03 on hover
- Breed variety across images

{/* Image brief: freshly groomed fluffy white dog on grooming table, professional result, clean coat */}
{/* Image brief: golden doodle before and after groom, side by side editorial */}
{/* Image brief: close-up of dog being carefully scissor-cut around face, skilled groomer hands */}
{/* Image brief: happy spaniel with bow, freshly groomed, salon environment */}
{/* Image brief: groomer washing a dog at a dog wash station, warm water, gentle care */}

### 6. Breed Guide
- "We Work With All Breeds" — Plus Jakarta 800
- 3 category chips with breed examples:
  - Short-Coated — Labs, Beagles, Boxers
  - Long-Coated — Cockers, Spaniels, Setters
  - Doodles — Goldendoodles, Labradoodles, Cockapoos

### 7. Meet the Groomers
- "The Team" — Plus Jakarta 800
- 3 cards: circular portrait, Plus Jakarta 700 name, Inter 400 years + specialty chip + 1-line bio
  - Sarah — 8 years · Specialist: anxious dogs
  - Jake — 5 years · Specialist: long-coated breeds
  - Priya — 3 years · Specialist: doodles

{/* Image brief: friendly female dog groomer smiling, professional apron, salon background */}
{/* Image brief: male dog groomer working with a dog, calm professional environment */}
{/* Image brief: young female dog groomer with a puppy, warm friendly smile */}

### 8. Testimonials
- Warm white section, 3 cards
- Plus Jakarta 700 quote, name + dog name + breed in muted 10px, 5-star row amber
- stagger fade-up on scroll

### 9. FAQ Accordion
- "Questions" — Plus Jakarta 800
- 4 accordion items, teal icon rotates on open:
  1. How long does a groom take? — 2–3 hours depending on breed and coat condition.
  2. Do you use cages for drying? — Never. We air dry with towels and a low-heat dryer, always with space to move.
  3. My dog is anxious — can you still help? — Yes. Sarah specialises in nervous dogs. We go at your dog's pace.
  4. How often should I book? — Every 6–8 weeks for most coats. Doodles every 6 weeks to avoid matting.

### 10. Booking CTA
- Full-width teal (#38929a) background
- Plus Jakarta 800 warm white: "Ready to Book?"
- Plus Jakarta 400: "Monday–Saturday 8am–6pm · 020 8123 4567 · hello@pawfectgroom.co.uk"
- "Book online →" warm white filled button + "Call us" ghost

### 11. Footer
- Teal background, Plus Jakarta 800 wordmark
- "© 2026 Pawfect Groom · 14 Hill Rise, Richmond, TW10 · Fully insured · City & Guilds qualified"

## Animations
- Hero: split fade-in on mount (left y: 30→0, right scale 0.95→1), 0.7s stagger
- Portrait float: keyframe loop 7s ease-in-out
- Service cards: whileInView stagger 0.08s
- FAQ accordion: AnimatePresence height expand/collapse

## Responsive
- Mobile: single-column services grid, stacked hero, full-width portrait image

## Full Copy
- Wordmark: "Pawfect Groom"
- Hero: "Your Dog Deserves The Best Groom." / "Professional, stress-free grooming with zero cage time. All breeds welcome."
- Location: 14 Hill Rise, Richmond, TW10
- Hours: Mon–Sat 8am–6pm
- Testimonial: "Sarah is absolutely amazing with our anxious rescue. He actually wags his tail when we arrive now!" — @goldenrescuemum, Google Review
