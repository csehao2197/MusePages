# DRIFT HOUSE — Vacation Rental Website Prompt
## For Bolt, v0, Lovable, Claude — React + Vite + TypeScript + Tailwind CSS + Framer Motion + shadcn/ui + lucide-react

---

Build a complete, production-ready vacation rental website for **DRIFT HOUSE** — a premium privately owned coastal/lakeside property available for holiday rental. The brand is luxurious yet warmly personal, editorial in its photography references, and understated in tone. The website must be fully self-contained with all copy written out in full, all animations implemented with Framer Motion (`motion/react`), and no placeholder text anywhere.

---

## DESIGN SYSTEM

### Colors — HSL custom properties in :root

```css
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;1,400;1,700&family=Jost:wght@300;400&display=swap');

:root {
  --background: 0 0% 100%;
  --foreground: 207 40% 25%;
  --primary: 207 40% 25%;
  --primary-foreground: 0 0% 100%;
  --accent: 36 80% 89%;
  --muted: 36 50% 95%;
  --card: 0 0% 100%;
  --border: 207 20% 88%;
  --muted-foreground: 207 20% 50%;
}
```

### Typography
- **Headings**: Cormorant Garamond — weights 400 italic, 700 italic, 600 upright. The quintessential luxe editorial serif. All major headings use italic variant.
- **Body**: Jost — weights 300 (light, for body text) and 400 (regular, for labels, buttons). Clean, modern, unfussy.

### Signature Animation: Hero Crossfade Gallery

The hero section must implement a full-screen crossfading image gallery with the following behaviour:

- **5 images**, each displayed for **4 seconds**, crossfading over **1 second** (so total loop = 25 seconds)
- All 5 images are stacked with `position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover;`
- Only one image is visible at any given time (opacity 1), the others are opacity 0
- Transition between images: `transition: opacity 1s ease-in-out`
- A state variable `activeIndex` (0–4) cycles via `setInterval` every 4000ms in a `useEffect`
- The active image gets `opacity-100`, all others get `opacity-0`
- **Crossfade dot indicator**: a row of 5 circular dots `8px × 8px rounded-full` sits at `absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-20`. Active dot: `bg-white`, inactive: `bg-white/40`. Clicking a dot sets `activeIndex` immediately.

### Availability Widget
A non-functional but fully styled UI widget for checking availability. It sits inside the hero as a glassmorphism card. It uses `<input type="date" />` and `<select>` elements styled with custom CSS to match the design. No real booking system — it is a mockup that looks and feels real. On "Check Availability" click: shows a toast or keeps state, does not navigate anywhere.

---

## SECTION 1: NAVBAR

```tsx
// Navbar component with scroll-aware styling

// State: const [scrolled, setScrolled] = useState(false)
// useEffect: window.addEventListener('scroll', () => setScrolled(window.scrollY > 60))

// Container: className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
// When not scrolled: className="bg-transparent"
// When scrolled: className="bg-white shadow-sm border-b border-[hsl(var(--border))]"

// Inner: max-w-7xl mx-auto px-6 h-20 flex items-center justify-between

// LOGO (left):
// Text: "DRIFT HOUSE"
// Font: Cormorant Garamond 700 italic, 24px
// Color: when not scrolled → text-white; when scrolled → text-[hsl(var(--foreground))]
// Transition: transition-colors duration-500

// NAV LINKS (center, hidden on mobile):
// Items: The House | Amenities | Location | Gallery | Book
// Font: Jost 400, text-sm, tracking-wider
// Color: when not scrolled → text-white/80 hover:text-white; when scrolled → text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]

// CTA BUTTON (right):
// Text: "Check Availability"
// When not scrolled: border border-white text-white bg-transparent hover:bg-white hover:text-[hsl(var(--foreground))]
// When scrolled: bg-[hsl(var(--primary))] text-white border-transparent hover:opacity-90
// Shape: rounded-full px-5 py-2 Jost 400 text-sm transition-all duration-300

// Mobile: hamburger icon (Menu from lucide-react) that opens a slide-down menu
```

---

## SECTION 2: HERO

```tsx
// Full-screen hero with crossfading image gallery

// Outer: <section className="relative h-[100dvh] overflow-hidden">

// --- IMAGE LAYER ---
// 5 images stacked, each: <div className="absolute inset-0 transition-opacity duration-1000"
//   style={{ opacity: activeIndex === i ? 1 : 0 }}>
//   {/* Image: [description] */}
//   <img src="" alt="..." className="w-full h-full object-cover" />
// </div>

// Image 1: {/* Image: luxury coastal stone house at golden hour, dramatic clifftop setting with ocean panorama, warm amber sunset light flooding the facade, architectural editorial photography */}
// <img src="" alt="Drift House exterior at golden hour, Cornish clifftop" className="w-full h-full object-cover" />

// Image 2: {/* Image: bright airy open-plan living room with floor-to-ceiling glass windows revealing an uninterrupted ocean view, white walls, driftwood-toned furniture, scattered natural linen throws, warm morning light streaming in */}
// <img src="" alt="Drift House living room with ocean view" className="w-full h-full object-cover" />

// Image 3: {/* Image: private outdoor terrace with a glass-edged infinity pool merging visually with the ocean horizon, a couple lounging on sun chairs in the late afternoon golden light, champagne glasses on a stone ledge */}
// <img src="" alt="Drift House private infinity pool terrace" className="w-full h-full object-cover" />

// Image 4: {/* Image: luxury master bedroom with panoramic coastal view, king-sized bed dressed in crisp white linen, natural oak headboard and bedside tables, morning mist visible through the window, calm serene atmosphere */}
// <img src="" alt="Drift House master bedroom with sea view" className="w-full h-full object-cover" />

// Image 5: {/* Image: aerial drone shot looking down on a large stone coastal property surrounded by lush garden and clifftop landscape, turquoise sea visible, dramatic birds-eye perspective on a clear day */}
// <img src="" alt="Drift House aerial view, Cornish coast" className="w-full h-full object-cover" />

// --- GRADIENT OVERLAY ---
// <div className="absolute inset-0 bg-gradient-to-b from-[rgba(0,0,0,0.40)] via-[rgba(0,0,0,0.05)] to-[rgba(0,0,0,0.60)] z-10" />

// --- HERO CONTENT ---
// <div className="absolute inset-0 z-20 flex flex-col items-center justify-end pb-28 px-6 text-center text-white">

//   Location tag:
//   <motion.p
//     initial={{ opacity: 0, y: 10 }}
//     animate={{ opacity: 1, y: 0 }}
//     transition={{ duration: 0.8, delay: 0.2 }}
//     className="font-[Jost] font-light text-xs tracking-[0.35em] uppercase text-white/70 mb-4"
//   >
//     CORNISH COAST, UK
//   </motion.p>

//   Headline:
//   <motion.h1
//     initial={{ opacity: 0, filter: 'blur(16px)' }}
//     animate={{ opacity: 1, filter: 'blur(0px)' }}
//     transition={{ duration: 1.2, delay: 0.4 }}
//     className="font-[Cormorant_Garamond] font-bold italic text-white leading-tight
//                text-[80px] max-md:text-[52px] max-sm:text-[40px] mb-3"
//   >
//     Where the world slows down.
//   </motion.h1>

//   Subheading:
//   <motion.p
//     initial={{ opacity: 0 }}
//     animate={{ opacity: 1 }}
//     transition={{ duration: 1, delay: 0.9 }}
//     className="font-[Jost] font-light text-lg text-white/80 max-w-xl leading-relaxed mb-8"
//   >
//     A privately owned retreat for those who believe a great holiday should feel effortless.
//     Arrive. Breathe. Stay a while.
//   </motion.p>

//   --- AVAILABILITY WIDGET (GLASSMORPHISM) ---
//   <motion.div
//     initial={{ opacity: 0, y: 20 }}
//     animate={{ opacity: 1, y: 0 }}
//     transition={{ duration: 0.8, delay: 1.1 }}
//     className="bg-white/10 backdrop-blur-md border border-white/25 rounded-2xl px-8 py-6
//                inline-flex flex-wrap gap-6 items-end max-sm:flex-col max-sm:w-full max-sm:px-4"
//   >
//     {/* CHECK IN field */}
//     <div className="flex flex-col gap-1">
//       <label className="font-[Jost] font-light text-[10px] tracking-[0.25em] uppercase text-white/60">
//         CHECK IN
//       </label>
//       <input
//         type="date"
//         className="bg-transparent border-b border-white/40 text-white font-[Jost] text-sm
//                    py-1 focus:outline-none focus:border-white cursor-pointer w-36
//                    [color-scheme:dark]"
//       />
//     </div>

//     {/* CHECK OUT field */}
//     <div className="flex flex-col gap-1">
//       <label className="font-[Jost] font-light text-[10px] tracking-[0.25em] uppercase text-white/60">
//         CHECK OUT
//       </label>
//       <input
//         type="date"
//         className="bg-transparent border-b border-white/40 text-white font-[Jost] text-sm
//                    py-1 focus:outline-none focus:border-white cursor-pointer w-36
//                    [color-scheme:dark]"
//       />
//     </div>

//     {/* GUESTS select */}
//     <div className="flex flex-col gap-1">
//       <label className="font-[Jost] font-light text-[10px] tracking-[0.25em] uppercase text-white/60">
//         GUESTS
//       </label>
//       <select
//         className="bg-transparent border-b border-white/40 text-white font-[Jost] text-sm
//                    py-1 focus:outline-none focus:border-white cursor-pointer w-24 appearance-none"
//       >
//         {[1,2,3,4,5,6,7,8,9,10].map(n => (
//           <option key={n} value={n} className="text-[hsl(var(--foreground))]">{n} {n === 1 ? 'guest' : 'guests'}</option>
//         ))}
//       </select>
//     </div>

//     {/* Check Availability button */}
//     <button
//       className="bg-white text-[hsl(var(--foreground))] font-[Jost] font-normal text-sm
//                  px-6 py-2.5 rounded-full hover:bg-[hsl(var(--accent))] transition-colors
//                  duration-300 whitespace-nowrap max-sm:w-full"
//     >
//       Check Availability
//     </button>
//   </motion.div>

// </div>

// --- CROSSFADE DOT INDICATORS ---
// <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-20">
//   {[0,1,2,3,4].map(i => (
//     <button
//       key={i}
//       onClick={() => setActiveIndex(i)}
//       className={`w-2 h-2 rounded-full transition-all duration-300 ${
//         activeIndex === i ? 'bg-white scale-125' : 'bg-white/40'
//       }`}
//       aria-label={`View image ${i + 1}`}
//     />
//   ))}
// </div>
```

---

## SECTION 3: THE HOUSE

```tsx
// py-24 bg-white
// max-w-7xl mx-auto px-6
// Desktop: grid grid-cols-2 gap-16 items-center
// Mobile: flex flex-col gap-12

// LEFT COLUMN — Text

// Eyebrow:
// <p className="font-[Jost] font-light text-xs tracking-[0.3em] uppercase text-[hsl(var(--muted-foreground))] mb-4">
//   THE PROPERTY
// </p>

// Heading:
// <motion.h2
//   initial={{ opacity: 0, y: 30 }}
//   whileInView={{ opacity: 1, y: 0 }}
//   viewport={{ once: true }}
//   transition={{ duration: 0.8 }}
//   className="font-[Cormorant_Garamond] font-bold italic text-[52px] max-md:text-[38px]
//              text-[hsl(var(--foreground))] leading-tight mb-6"
// >
//   A house made for gathering.
// </motion.h2>

// Body:
// <p className="font-[Jost] font-light text-base leading-relaxed text-[hsl(var(--muted-foreground))] mb-8">
//   Drift House sits on three acres of coastal land with uninterrupted views from every room.
//   Built by the current owners as a family retreat and opened to guests in 2021, it sleeps 10
//   across five bedrooms, each styled individually using local materials, antiques, and
//   custom-made furniture. The kitchen is large enough for a chef and a crowd. The garden
//   runs to the clifftop. And on a clear day, you can see the sea from every window on the
//   south side of the house.
// </p>

// PROPERTY STATS — row of 6 stats
// <div className="grid grid-cols-3 gap-y-6 gap-x-4 border-t border-[hsl(var(--border))] pt-8">
//   {[
//     { number: '5', label: 'Bedrooms' },
//     { number: '10', label: 'Sleeps' },
//     { number: '3', label: 'Bathrooms' },
//     { number: '∞', label: 'Sea Views' },
//     { number: '1', label: 'Private Garden' },
//     { number: '3', label: 'Acres' },
//   ].map(stat => (
//     <div key={stat.label} className="flex flex-col">
//       <span className="font-[Cormorant_Garamond] font-bold italic text-4xl
//                        text-[hsl(var(--primary))] leading-none">
//         {stat.number}
//       </span>
//       <span className="font-[Jost] font-light text-sm text-[hsl(var(--muted-foreground))] mt-1">
//         {stat.label}
//       </span>
//     </div>
//   ))}
// </div>

// RIGHT COLUMN — 2×2 image grid
// <div className="grid grid-cols-2 gap-3">

//   {/* Image 1 */}
//   {/* Image: panoramic sea view framed by a house window, interior windowsill detail in soft foreground, editorial lifestyle photography with a serene coastal mood */}
//   <div className="rounded-xl overflow-hidden h-56">
//     <img src="" alt="Sea view from Drift House window" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
//   </div>

//   {/* Image 2 */}
//   {/* Image: traditional stone fireplace in a cosy sitting room, armchairs with linen cushions on either side, warm evening light with a fire beginning to catch, interior lifestyle photography */}
//   <div className="rounded-xl overflow-hidden h-56">
//     <img src="" alt="Stone fireplace in Drift House living room" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
//   </div>

//   {/* Image 3 */}
//   {/* Image: spacious coastal-style kitchen with marble island, open shelving with local ceramics, morning light through a large window, warm and inviting domestic interior photography */}
//   <div className="rounded-xl overflow-hidden h-56">
//     <img src="" alt="Drift House kitchen with marble island" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
//   </div>

//   {/* Image 4 */}
//   {/* Image: wide wooden outdoor dining table set for ten people on a stone terrace, coastal plants and wildflowers in the background, golden hour light, lifestyle summer holiday photography */}
//   <div className="rounded-xl overflow-hidden h-56">
//     <img src="" alt="Outdoor dining terrace at Drift House" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
//   </div>

// </div>
```

---

## SECTION 4: AMENITIES

```tsx
// <section className="py-24 bg-[hsl(var(--muted))]">
// <div className="max-w-7xl mx-auto px-6">

// Heading:
// <motion.h2
//   initial={{ opacity: 0, y: 20 }}
//   whileInView={{ opacity: 1, y: 0 }}
//   viewport={{ once: true }}
//   transition={{ duration: 0.7 }}
//   className="font-[Cormorant_Garamond] font-bold italic text-[48px] max-md:text-[36px]
//              text-[hsl(var(--foreground))] leading-tight text-center mb-4"
// >
//   Everything included.
// </motion.h2>
// <p className="font-[Jost] font-light text-center text-[hsl(var(--muted-foreground))] mb-14 text-base">
//   Nothing you'll need to bring, nothing you'll have to think about.
// </p>

// Grid: grid grid-cols-4 max-xl:grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-1 gap-4

const amenities = [
  {
    icon: 'Waves', // lucide-react Waves
    label: 'Private Beach Path',
    description: 'Beach access via private gate, 5-minute walk from the house.',
  },
  {
    icon: 'Droplets', // lucide-react Droplets
    label: 'Hot Tub',
    description: 'Outdoor 8-person hot tub, heated year-round, open-to-the-sky.',
  },
  {
    icon: 'Wifi', // lucide-react Wifi
    label: 'Fast WiFi',
    description: 'Gigabit broadband throughout the property — work-from-anywhere ready.',
  },
  {
    icon: 'Zap', // lucide-react Zap
    label: 'EV Charging',
    description: 'Two dedicated EV charging spaces, Tesla and universal compatible.',
  },
  {
    icon: 'ShoppingBasket', // lucide-react ShoppingBasket
    label: 'Welcome Hamper',
    description: 'Locally sourced provisions, wine, and fresh flowers await your arrival.',
  },
  {
    icon: 'UtensilsCrossed', // lucide-react UtensilsCrossed
    label: 'Full Kitchen',
    description: 'Professional range, espresso machine, dishwasher, and everything in between.',
  },
  {
    icon: 'Flame', // lucide-react Flame
    label: 'Wood Burner',
    description: 'Cast iron log burner in the sitting room — logs and kindling provided.',
  },
  {
    icon: 'PawPrint', // lucide-react PawPrint
    label: 'Pet Friendly',
    description: 'Well-behaved dogs welcome. £30 supplement per stay, towels provided.',
  },
  {
    icon: 'Tv', // lucide-react Tv
    label: 'Smart TV',
    description: 'Netflix, Prime Video, and HDMI in every bedroom and the main sitting room.',
  },
  {
    icon: 'ChefHat', // lucide-react ChefHat
    label: 'Outdoor Dining',
    description: 'Covered stone terrace with a gas BBQ, seating for 12, and string lights.',
  },
  {
    icon: 'Gamepad2', // lucide-react Gamepad2
    label: 'Games Room',
    description: 'Pool table, table tennis, board games, and a record player.',
  },
  {
    icon: 'Star', // lucide-react Star
    label: 'Concierge Service',
    description: 'Restaurant bookings, surf lessons, local experiences — just ask.',
  },
]

// Each card:
// <motion.div
//   key={amenity.label}
//   initial={{ opacity: 0, y: 20 }}
//   whileInView={{ opacity: 1, y: 0 }}
//   viewport={{ once: true }}
//   transition={{ duration: 0.5, delay: index * 0.05 }}
//   className="bg-white rounded-xl p-6 text-center border border-[hsl(var(--border))]
//              hover:shadow-md hover:border-[hsl(var(--primary)/0.3)] transition-all duration-300"
// >
//   <div className="flex justify-center mb-3">
//     <Icon className="w-6 h-6 text-[hsl(var(--primary))]" /> {/* lucide icon by name */}
//   </div>
//   <h3 className="font-[Jost] font-normal text-sm text-[hsl(var(--foreground))] mb-1.5">
//     {amenity.label}
//   </h3>
//   <p className="font-[Jost] font-light text-xs text-[hsl(var(--muted-foreground))] leading-relaxed">
//     {amenity.description}
//   </p>
// </motion.div>
```

---

## SECTION 5: GALLERY

```tsx
// <section className="py-24 bg-white">
// <div className="max-w-7xl mx-auto px-6">

// Heading:
// <h2 className="font-[Cormorant_Garamond] font-bold italic text-[48px] text-[hsl(var(--foreground))]
//                leading-tight mb-2">
//   See for yourself.
// </h2>
// <p className="font-[Jost] font-light text-[hsl(var(--muted-foreground))] mb-12">
//   Every corner of Drift House has been considered.
// </p>

// Masonry-style 4-column grid desktop, 2-column mobile, gap-4
// <div className="columns-4 max-lg:columns-3 max-md:columns-2 max-sm:columns-1 gap-4 space-y-4">

// 8 gallery images with varied heights:

// {/* Image: master bedroom at Drift House — floor-to-ceiling panoramic windows with morning ocean mist view, king bed with crisp white linen, organic cotton cushions, calm serene dawn atmosphere, luxury coastal interiors photography */}
// <div className="rounded-2xl overflow-hidden break-inside-avoid mb-4 h-80">
//   <img src="" alt="Master bedroom with ocean view" className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-300" />
// </div>

// {/* Image: clawfoot roll-top bathtub positioned beside a bathroom window overlooking the sea, candles lit on the bath ledge, bath salts and folded white towels, luxury spa home atmosphere */}
// <div className="rounded-2xl overflow-hidden break-inside-avoid mb-4 h-64">
//   <img src="" alt="Bathroom with sea view and clawfoot tub" className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-300" />
// </div>

// {/* Image: architectural detail of a spiral wooden staircase inside the house, white walls and natural oak treads, dramatic natural light from a high skylight, coastal house interior architecture photography */}
// <div className="rounded-2xl overflow-hidden break-inside-avoid mb-4 h-48">
//   <img src="" alt="Spiral staircase interior detail" className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-300" />
// </div>

// {/* Image: the outdoor hot tub at dusk with the water steaming, string lights suspended above in the garden, the distant sea visible on the horizon, atmospheric twilight lifestyle photography */}
// <div className="rounded-2xl overflow-hidden break-inside-avoid mb-4 h-80">
//   <img src="" alt="Hot tub at twilight with sea horizon" className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-300" />
// </div>

// {/* Image: cosy window seat reading nook with a harbour view, a pile of well-thumbed books, a mug of tea on the ledge, soft afternoon light, interior lifestyle home photography */}
// <div className="rounded-2xl overflow-hidden break-inside-avoid mb-4 h-64">
//   <img src="" alt="Window reading nook with harbour view" className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-300" />
// </div>

// {/* Image: two children running across a wide private lawn with the ocean in the background, one child carrying a kite, summer holiday lifestyle family photography, warm and joyful */}
// <div className="rounded-2xl overflow-hidden break-inside-avoid mb-4 h-56">
//   <img src="" alt="Children playing on Drift House lawn" className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-300" />
// </div>

// {/* Image: aerial view of a Cornish coastal village at dusk from above — winding narrow streets, white-painted houses, fishing boats moored in a small harbour, golden evening light */}
// <div className="rounded-2xl overflow-hidden break-inside-avoid mb-4 h-72">
//   <img src="" alt="Cornish coastal village at dusk aerial view" className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-300" />
// </div>

// {/* Image: outdoor terrace breakfast scene — a wooden table set with pastries, fresh berries, sliced fruit, and a French press coffee, morning sea view in the background, lifestyle food photography with a holiday mood */}
// <div className="rounded-2xl overflow-hidden break-inside-avoid mb-4 h-56">
//   <img src="" alt="Breakfast on the terrace with sea view" className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-300" />
// </div>

// </div>
```

---

## SECTION 6: LOCATION

```tsx
// <section className="py-24 bg-[hsl(var(--accent)/0.4)]">
// <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">

// LEFT — Map placeholder
// <div className="bg-[hsl(var(--foreground)/0.06)] rounded-3xl h-96 flex flex-col items-center
//                 justify-center text-center gap-3 border border-[hsl(var(--border))]">
//   <span className="text-4xl">📍</span>
//   <p className="font-[Cormorant_Garamond] italic text-xl text-[hsl(var(--foreground))]">
//     Mawgan Porth, Cornwall
//   </p>
//   <p className="font-[Jost] font-light text-sm text-[hsl(var(--muted-foreground))]">
//     TR8 4BA
//   </p>
//   <p className="font-[Jost] font-light text-xs text-[hsl(var(--muted-foreground))] mt-2 max-w-[200px]">
//     Interactive map available on booking confirmation
//   </p>
// </div>

// RIGHT — Location text
// <div>
//   <p className="font-[Jost] font-light text-xs tracking-[0.3em] uppercase
//                 text-[hsl(var(--muted-foreground))] mb-4">
//     GETTING THERE
//   </p>
//   <h2 className="font-[Cormorant_Garamond] font-bold italic text-[48px] max-md:text-[36px]
//                  text-[hsl(var(--foreground))] leading-tight mb-6">
//     Where you'll wake up.
//   </h2>
//   <p className="font-[Jost] font-light text-base leading-relaxed text-[hsl(var(--muted-foreground))] mb-8">
//     Set in Mawgan Porth on the north Cornish coast — one of the least developed, most
//     spectacularly beautiful stretches of coastline in England. The nearest beach is a
//     5-minute walk. The nearest pub is 4 minutes. And the nearest city feels very, very
//     far away. That is, we think, the point.
//   </p>

//   Nearby list:
//   <ul className="space-y-3">
//     {[
//       { emoji: '🏖️', place: 'Mawgan Porth Beach', time: '5 min walk' },
//       { emoji: '🍺', place: 'The Merrymoor Inn', time: '4 min walk' },
//       { emoji: '☕', place: 'Retorrick Mill café', time: '8 min drive' },
//       { emoji: '🛒', place: 'Newquay (Tesco, restaurants)', time: '12 min drive' },
//       { emoji: '🏄', place: 'Surf hire & lessons', time: '15 min drive' },
//       { emoji: '🏰', place: 'Tintagel Castle', time: '40 min drive' },
//     ].map(item => (
//       <li key={item.place} className="flex items-center gap-3">
//         <span className="text-lg">{item.emoji}</span>
//         <span className="font-[Jost] font-light text-sm text-[hsl(var(--foreground))]">
//           {item.place}
//         </span>
//         <span className="ml-auto font-[Jost] font-light text-xs text-[hsl(var(--muted-foreground))] whitespace-nowrap">
//           {item.time}
//         </span>
//       </li>
//     ))}
//   </ul>

// </div>
```

---

## SECTION 7: RATES & AVAILABILITY

```tsx
// <section className="py-24 bg-white">
// <div className="max-w-4xl mx-auto px-6">

// Heading:
// <h2 className="font-[Cormorant_Garamond] font-bold italic text-[48px] text-[hsl(var(--foreground))]
//                leading-tight mb-4">
//   Rates & booking.
// </h2>
// <p className="font-[Jost] font-light text-[hsl(var(--muted-foreground))] mb-12 text-base leading-relaxed">
//   Drift House is available exclusively as a whole-property rental — no room shares, no
//   other guests. What you see is what you get, from the first key to the last glass of wine.
// </p>

// PRICING TABLE
// <div className="border border-[hsl(var(--border))] rounded-2xl overflow-hidden mb-8">
//   {[
//     { season: 'Low Season', months: 'January – March, November', price: 'from £950', unit: '/ week' },
//     { season: 'Mid Season', months: 'April – June, September – October', price: 'from £1,450', unit: '/ week' },
//     { season: 'High Season', months: 'July – August', price: 'from £2,100', unit: '/ week' },
//     { season: 'Christmas / New Year', months: 'Min. 4 nights', price: 'from £2,800', unit: '/ stay', highlight: true },
//   ].map((row, i) => (
//     <div
//       key={row.season}
//       className={`flex items-center justify-between px-8 py-6 border-b border-[hsl(var(--border))] last:border-b-0
//         ${row.highlight ? 'bg-[hsl(var(--accent)/0.3)]' : ''}`}
//     >
//       <div>
//         <p className="font-[Cormorant_Garamond] font-semibold text-xl text-[hsl(var(--foreground))]">
//           {row.season}
//         </p>
//         <p className="font-[Jost] font-light text-sm text-[hsl(var(--muted-foreground))] mt-0.5">
//           {row.months}
//         </p>
//       </div>
//       <div className="text-right">
//         <span className="font-[Cormorant_Garamond] font-bold italic text-3xl text-[hsl(var(--primary))]">
//           {row.price}
//         </span>
//         <span className="font-[Jost] font-light text-sm text-[hsl(var(--muted-foreground))] ml-1">
//           {row.unit}
//         </span>
//       </div>
//     </div>
//   ))}
// </div>

// Notes:
// <p className="font-[Jost] font-light text-sm text-[hsl(var(--muted-foreground))] leading-relaxed mb-10">
//   Prices based on whole-property rental (sleeps up to 10). Weekend breaks (3 nights minimum)
//   available October through March — contact us for pricing. Cleaning fee: £180. Refundable
//   damage deposit: £500, held until 48 hours after departure.
// </p>

// CTAs:
// <div className="flex flex-wrap gap-4">
//   <button className="bg-[hsl(var(--primary))] text-white font-[Jost] font-normal px-8 py-3
//                      rounded-full text-base hover:opacity-90 transition-opacity">
//     Check Availability
//   </button>
//   <button className="border border-[hsl(var(--primary))] text-[hsl(var(--primary))] font-[Jost]
//                      font-normal px-8 py-3 rounded-full text-base hover:bg-[hsl(var(--accent)/0.3)]
//                      transition-colors">
//     Make an Enquiry
//   </button>
// </div>
```

---

## SECTION 8: GUEST REVIEWS

```tsx
// <section className="py-24 bg-[hsl(var(--muted))]">
// <div className="max-w-7xl mx-auto px-6">

// Heading:
// <h2 className="font-[Cormorant_Garamond] font-bold italic text-[48px] max-md:text-[36px]
//                text-[hsl(var(--foreground))] leading-tight text-center mb-14">
//   What our guests say.
// </h2>

// 3-column grid desktop, 1-col mobile
// <div className="grid grid-cols-3 max-lg:grid-cols-1 gap-6">

const reviews = [
  {
    stars: 5,
    quote: "We booked Drift House for a milestone birthday and it was everything we hoped for. The house is even more beautiful than the photographs — the light that comes through those windows in the morning is something else entirely. The hot tub is a revelation, the location is just stunning, and we were a group of nine with room to breathe everywhere. We've already looked at dates for next year.",
    reviewer: "The Morrison Family",
    date: "August",
    context: "Birthday celebration, 9 guests"
  },
  {
    stars: 5,
    quote: "We've done a great many holiday lets over the years and this is, without question, the finest we've ever stayed in. The beds are extraordinary — we haven't slept that well in years. The kitchen has everything you could want. And the view from the sitting room window is something that stays with you. We genuinely did not want to leave.",
    reviewer: "James & Catherine W.",
    date: "September",
    context: "Anniversary stay"
  },
  {
    stars: 5,
    quote: "We brought our two dogs (the owners are brilliant about it — they left dog towels, water bowls, and a little note about the local dog-friendly beaches, which we thought was a lovely touch). The coastal walk from the front gate is spectacular. We can't recommend Drift House highly enough to anyone who loves the Cornish coast.",
    reviewer: "The Keller family",
    date: "October",
    context: "Family holiday with dogs"
  },
]

// Each card:
// <motion.div
//   key={review.reviewer}
//   initial={{ opacity: 0, y: 20 }}
//   whileInView={{ opacity: 1, y: 0 }}
//   viewport={{ once: true }}
//   transition={{ duration: 0.6, delay: index * 0.15 }}
//   className="bg-white rounded-2xl p-8 shadow-sm border border-[hsl(var(--border))]"
// >
//   {/* Stars */}
//   <div className="flex gap-1 mb-5">
//     {[...Array(review.stars)].map((_, s) => (
//       <Star key={s} className="w-4 h-4 fill-[hsl(var(--accent))] text-[hsl(var(--accent))]" />
//     ))}
//   </div>
//   {/* Quote */}
//   <p className="font-[Jost] font-light italic text-base text-[hsl(var(--foreground))] leading-relaxed mb-6">
//     "{review.quote}"
//   </p>
//   {/* Reviewer */}
//   <div className="border-t border-[hsl(var(--border))] pt-4">
//     <p className="font-[Jost] font-normal text-sm text-[hsl(var(--foreground))]">
//       {review.reviewer}
//     </p>
//     <p className="font-[Jost] font-light text-xs text-[hsl(var(--muted-foreground))] mt-0.5">
//       {review.context} · {review.date}
//     </p>
//   </div>
// </motion.div>
```

---

## SECTION 9: ENQUIRY / CONTACT

```tsx
// <section className="py-24 bg-[hsl(var(--accent)/0.3)]">
// <div className="max-w-xl mx-auto px-6 text-center">

// Heading:
// <h2 className="font-[Cormorant_Garamond] font-bold italic text-[48px] max-md:text-[36px]
//                text-[hsl(var(--foreground))] leading-tight mb-4">
//   Plan your stay.
// </h2>
// <p className="font-[Jost] font-light text-base text-[hsl(var(--muted-foreground))] leading-relaxed mb-10">
//   Tell us a little about what you're planning and we'll get back to you within 24 hours.
//   We love hearing about the occasion — whether it's a landmark birthday, a family reunion,
//   or simply a long overdue escape.
// </p>

// FORM — all fields left-aligned, labels above inputs
// <form className="text-left space-y-5">

//   Name:
//   <div>
//     <label className="font-[Jost] font-light text-xs tracking-[0.2em] uppercase
//                        text-[hsl(var(--muted-foreground))] block mb-1.5">Name</label>
//     <input type="text" placeholder="Your full name"
//            className="w-full border border-[hsl(var(--border))] rounded-lg px-4 py-3
//                       font-[Jost] font-light text-sm focus:outline-none
//                       focus:border-[hsl(var(--primary))] transition-colors bg-white" />
//   </div>

//   Email:
//   <div>
//     <label className="font-[Jost] font-light text-xs tracking-[0.2em] uppercase
//                        text-[hsl(var(--muted-foreground))] block mb-1.5">Email address</label>
//     <input type="email" placeholder="hello@yourname.com"
//            className="w-full border border-[hsl(var(--border))] rounded-lg px-4 py-3
//                       font-[Jost] font-light text-sm focus:outline-none
//                       focus:border-[hsl(var(--primary))] transition-colors bg-white" />
//   </div>

//   Phone:
//   <div>
//     <label className="font-[Jost] font-light text-xs tracking-[0.2em] uppercase
//                        text-[hsl(var(--muted-foreground))] block mb-1.5">Phone number</label>
//     <input type="tel" placeholder="+44 7700 000000"
//            className="w-full border border-[hsl(var(--border))] rounded-lg px-4 py-3
//                       font-[Jost] font-light text-sm focus:outline-none
//                       focus:border-[hsl(var(--primary))] transition-colors bg-white" />
//   </div>

//   Two-column row: Arrival date + Departure date
//   <div className="grid grid-cols-2 gap-4">
//     <div>
//       <label className="font-[Jost] font-light text-xs tracking-[0.2em] uppercase
//                          text-[hsl(var(--muted-foreground))] block mb-1.5">Arrival date</label>
//       <input type="date"
//              className="w-full border border-[hsl(var(--border))] rounded-lg px-4 py-3
//                         font-[Jost] font-light text-sm focus:outline-none
//                         focus:border-[hsl(var(--primary))] transition-colors bg-white" />
//     </div>
//     <div>
//       <label className="font-[Jost] font-light text-xs tracking-[0.2em] uppercase
//                          text-[hsl(var(--muted-foreground))] block mb-1.5">Departure date</label>
//       <input type="date"
//              className="w-full border border-[hsl(var(--border))] rounded-lg px-4 py-3
//                         font-[Jost] font-light text-sm focus:outline-none
//                         focus:border-[hsl(var(--primary))] transition-colors bg-white" />
//     </div>
//   </div>

//   Guests:
//   <div>
//     <label className="font-[Jost] font-light text-xs tracking-[0.2em] uppercase
//                        text-[hsl(var(--muted-foreground))] block mb-1.5">Number of guests</label>
//     <select className="w-full border border-[hsl(var(--border))] rounded-lg px-4 py-3
//                        font-[Jost] font-light text-sm focus:outline-none
//                        focus:border-[hsl(var(--primary))] transition-colors bg-white appearance-none">
//       {[2,3,4,5,6,7,8,9,10].map(n => (
//         <option key={n}>{n} guests</option>
//       ))}
//     </select>
//   </div>

//   How did you hear:
//   <div>
//     <label className="font-[Jost] font-light text-xs tracking-[0.2em] uppercase
//                        text-[hsl(var(--muted-foreground))] block mb-1.5">How did you hear about us?</label>
//     <select className="w-full border border-[hsl(var(--border))] rounded-lg px-4 py-3
//                        font-[Jost] font-light text-sm focus:outline-none
//                        focus:border-[hsl(var(--primary))] transition-colors bg-white appearance-none">
//       <option>Airbnb listing</option>
//       <option>Instagram</option>
//       <option>Word of mouth / friend recommendation</option>
//       <option>Google search</option>
//       <option>Cornwall holiday guide</option>
//       <option>Other</option>
//     </select>
//   </div>

//   Message:
//   <div>
//     <label className="font-[Jost] font-light text-xs tracking-[0.2em] uppercase
//                        text-[hsl(var(--muted-foreground))] block mb-1.5">
//       Tell us about your stay (optional)
//     </label>
//     <textarea rows={4}
//               placeholder="Is it a special occasion? Are you bringing children or dogs? Any questions about the property or the area?"
//               className="w-full border border-[hsl(var(--border))] rounded-lg px-4 py-3
//                          font-[Jost] font-light text-sm focus:outline-none
//                          focus:border-[hsl(var(--primary))] transition-colors bg-white resize-none" />
//   </div>

//   Submit:
//   <button type="submit"
//           className="w-full bg-[hsl(var(--primary))] text-white font-[Jost] font-normal
//                      text-base py-4 rounded-full hover:opacity-90 transition-opacity mt-2">
//     Send Enquiry
//   </button>

// </form>
```

---

## SECTION 10: FOOTER

```tsx
// <footer className="bg-[hsl(var(--foreground))] text-[hsl(var(--accent))] py-16">
// <div className="max-w-7xl mx-auto px-6">

//   Top row: logo + tagline left, links right
//   <div className="flex flex-col lg:flex-row justify-between items-start gap-12 pb-12
//                   border-b border-white/10">

//     {/* Brand */}
//     <div className="max-w-xs">
//       <p className="font-[Cormorant_Garamond] font-bold italic text-[hsl(var(--accent))] text-3xl mb-2">
//         DRIFT HOUSE
//       </p>
//       <p className="font-[Jost] font-light text-sm text-white/50 leading-relaxed">
//         Where the world slows down.
//       </p>
//       <p className="font-[Jost] font-light text-sm text-white/40 mt-4">
//         A privately owned holiday property on the Cornish coast, available for whole-house rental.
//       </p>
//     </div>

//     {/* Nav links */}
//     <nav className="flex flex-wrap gap-x-10 gap-y-3">
//       {['The House', 'Amenities', 'Location', 'Gallery', 'Reviews', 'Enquire'].map(link => (
//         <a key={link} href="#"
//            className="font-[Jost] font-light text-sm text-white/60 hover:text-[hsl(var(--accent))]
//                       transition-colors">
//           {link}
//         </a>
//       ))}
//     </nav>

//   </div>

//   Bottom row:
//   <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8">

//     {/* Address */}
//     <p className="font-[Jost] font-light text-xs text-white/40">
//       📍 Mawgan Porth, Cornwall, TR8 4BA
//     </p>

//     {/* Social icons */}
//     <div className="flex items-center gap-5">
//       <a href="#" aria-label="Instagram"
//          className="text-white/40 hover:text-[hsl(var(--accent))] transition-colors">
//         <Instagram className="w-5 h-5" />
//       </a>
//       <a href="#" aria-label="Airbnb listing"
//          className="font-[Jost] font-light text-xs text-white/40 hover:text-[hsl(var(--accent))] transition-colors">
//         Airbnb listing →
//       </a>
//     </div>

//     {/* Copyright */}
//     <p className="font-[Jost] font-light text-xs text-white/30">
//       © 2025 Drift House. All rights reserved.
//     </p>

//   </div>

// </div>
```

---

## COMPLETE IMPLEMENTATION NOTES

### Dependencies to install:
```bash
npm install framer-motion lucide-react
npx shadcn-ui@latest init
npx shadcn-ui@latest add button input select textarea card accordion toast
```

### Key React state variables:
```tsx
const [activeIndex, setActiveIndex] = useState(0)        // Hero gallery
const [scrolled, setScrolled] = useState(false)           // Navbar scroll state
const [navOpen, setNavOpen] = useState(false)             // Mobile nav
```

### Hero gallery interval:
```tsx
useEffect(() => {
  const interval = setInterval(() => {
    setActiveIndex(prev => (prev + 1) % 5)
  }, 4000) // 4 seconds per image
  return () => clearInterval(interval)
}, [])
```

### Scroll listener:
```tsx
useEffect(() => {
  const handleScroll = () => setScrolled(window.scrollY > 60)
  window.addEventListener('scroll', handleScroll, { passive: true })
  return () => window.removeEventListener('scroll', handleScroll)
}, [])
```

### Global CSS additions:
```css
* { font-family: 'Jost', sans-serif; }
h1, h2, h3, .heading { font-family: 'Cormorant Garamond', serif; }
html { scroll-behavior: smooth; }
```

### Performance notes:
- Preload the first hero image with `<link rel="preload" as="image" href="" />`
- Use `loading="lazy"` on all gallery images below the fold
- The crossfade gallery uses CSS opacity transitions — no JS animation library needed for this effect
- Framer Motion used only for entrance animations (whileInView, initial/animate)

### Accessibility:
- All images have descriptive `alt` text
- Dot indicators have `aria-label` props
- Form fields all have associated `<label>` elements
- Focus states are visible on all interactive elements
- Colour contrast ratios meet WCAG AA on all text/background combinations
