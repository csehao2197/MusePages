# Alder & Grey — Funeral Home Website Prompt

## 1. Goal Statement
Build a calm, dignified website for **Alder & Grey Funeral Directors**, an independent family-run funeral home — warm off-white paper tones, a soft sage accent, a large quiet serif, and a slow unhurried rhythm that makes a grieving visitor feel looked after rather than sold to.

## 2. Tech Stack
```
React + Vite + TypeScript + Tailwind CSS + Framer Motion (motion/react) + lucide-react
```
No component libraries. Use native HTML elements only — the pricing details use a native `<details>` element.

## 3. Design System — Colors
```css
:root {
  --background: hsl(40, 30%, 97%);       /* warm paper */
  --foreground: hsl(150, 8%, 16%);       /* soft charcoal with green undertone */
  --primary: hsl(140, 14%, 42%);         /* muted sage */
  --primary-foreground: hsl(40, 30%, 97%);
  --muted-foreground: hsl(150, 5%, 45%);
  --border: hsl(40, 16%, 86%);
  --card: hsl(40, 28%, 93%);             /* slightly deeper paper for panels */
}
```
No black, no pure white, no bright colour anywhere. Everything is softened.

## 4. Typography
```html
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400&family=Inter:wght@300;400;500&display=swap" rel="stylesheet" />
```
- **H1:** Cormorant Garamond 400, clamp(40px, 5.5vw, 76px), line-height 1.08, letter-spacing -0.01em
- **H2:** Cormorant Garamond 400, clamp(32px, 3.5vw, 48px)
- **Italic emphasis:** Cormorant Garamond italic, used for one or two words per headline
- **Body:** Inter 300, 17px, line-height 1.8
- **Labels:** Inter 500, 11px, uppercase, letter-spacing 0.16em, sage

## 5. Visual Effects

**Effect 1 — Slow hero crossfade.** The hero image area cycles through three calm landscape photographs, crossfading every 7 seconds over 2.5 seconds with a very slight scale from 1.04 to 1. No arrows, no dots, no controls. It should feel like light changing, not a slideshow.

```jsx
<AnimatePresence mode="sync">
  <motion.img
    key={index}
    src=""
    alt={slides[index].alt}
    initial={{ opacity: 0, scale: 1.04 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 2.5, ease: "easeInOut" }}
    className="absolute inset-0 h-full w-full object-cover object-center"
  />
</AnimatePresence>
```
Image briefs, in order:
1. *Image: misty English meadow at dawn, soft diffuse light, muted greens, very calm*
2. *Image: old oak tree in a quiet churchyard, overcast sky, gentle and still*
3. *Image: sunlight through birch leaves, shallow depth of field, soft warm tones*

**Effect 2 — Paper grain.** A fixed, pointer-events-none SVG noise overlay at 4% opacity with `mix-blend-mode: multiply` across the whole page, so the background reads as paper rather than screen.

## 6. Component Breakdown

1. **Navbar** — 84px, paper background, thin bottom border. Wordmark left in Cormorant. Links centre. Right: a sage text link `Call us any time — 01225 480 316` with a small phone icon. Sticky, with background staying solid.
2. **Hero** — split layout. Left 50%: label, H1, subline, two actions. Right 50%: the crossfading images (Effect 1) in a tall container with 4px radius, height 78vh.
3. **If someone has just died** — a card-coloured panel, three numbered steps in a row, each with a large Cormorant numeral, a heading, and two sentences. Ends with the phone number set large.
4. **How we can help** — two-column layout: short intro left, list of five services right, each separated by a thin border, name in Cormorant 26px and one line beneath.
5. **Our prices** — three plain columns, each a funeral type with a price in Cormorant, a short sentence, and a native `<details>` element titled `What's included` revealing a simple list. No cards, no shadows.
6. **The family** — one wide portrait image with a short paragraph beside it about the family business. *Image: three generations of a family standing outside a stone building, natural light, warm and unposed.*
7. **Recent notices** — four funeral notices as a simple list: name, dates, service date and place. Link `View all notices`.
8. **What families say** — one large testimonial in Cormorant italic, centred, with name beneath. Only one. No carousel.
9. **Visit or call** — two columns: address and opening hours left; a calm sentence and phone number right.
10. **Footer** — sage background with paper-coloured text, three columns, small print about membership of professional associations.

## 7. Animations
Everything slow and gentle. Nothing bounces, nothing slides in from the side.
- Section content: `opacity 0 → 1` and `y 16 → 0`, duration 1.1s, easeOut, triggered once when 20% in view
- Stagger between child items: 0.15s
- Hero crossfade as described in Effect 1
- Link underlines: grow from left over 0.5s on hover
- No counters, no parallax, no marquee

## 8. Responsive
- **Mobile (<768px):** hero stacks with images first at 52vh, then text; the three steps stack vertically; price columns stack; navbar collapses to wordmark, a phone icon button and a `Menu` text button that opens a full-screen paper overlay with large Cormorant links.
- **Tablet:** hero stays split at 55/45; prices go to a single column list.
- **Desktop:** max-width 1240px, `px-10`, section spacing `py-28`.

## 9. Full Copy

**Brand:** ALDER & GREY · Funeral Directors · Bath since 1962

**Navbar:** Arranging a funeral · Our prices · Notices · About us · Contact

**Hero**
- Label: `INDEPENDENT FUNERAL DIRECTORS IN BATH`
- H1: `When someone dies, you shouldn't have to *know* what to do next.`
- Subline: `We are a family-run funeral home. We answer the phone ourselves, day or night, and we will guide you through every decision at whatever pace is right for you.`
- Primary action: `Call 01225 480 316`
- Secondary action: `See our prices`

**If someone has just died** — Label `WHERE TO START`
1. **Call us, at any hour.** `Someone from our family answers every call. We will come to you, whether at home, in hospital or in a care home.`
2. **Register the death.** `This needs to happen within five days. We will explain exactly what to bring and where to go.`
3. **Take your time.** `There is no rush to decide anything else. We can meet at our home, or at yours, when you are ready.`
- Large line: `01225 480 316 — day or night`

**How we can help** — H2 `Every funeral is *different*.` Intro: `Some families know exactly what they want. Others have never been asked the question. Either is fine.`
- **Burial and cremation** — `Traditional services at churches, crematoria and cemeteries across Somerset.`
- **Direct cremation** — `A simple cremation without a service, with ashes returned to you.`
- **Woodland burial** — `Natural burial grounds within twenty miles of Bath.`
- **Celebrations of life** — `Non-religious services in the place that meant most to them.`
- **Pre-paid funeral plans** — `Decide your wishes now, so your family won't have to later.`

**Our prices** — H2 `Clear prices, *written down*.` Intro: `We publish our prices so that you never have to ask.`
- **Direct cremation** — `£1,650` — `No service, no mourners, ashes returned by hand.` Included: collection and care · simple coffin · crematorium fee · return of ashes
- **Cremation with service** — `£3,450` — `A service at the crematorium or a place of your choosing.` Included: collection and care · chapel of rest · limousine hearse · coffin · crematorium fee · arranging the service
- **Burial** — `from £4,200` — `A traditional funeral and burial, cemetery fees quoted separately.` Included: collection and care · chapel of rest · hearse and one limousine · coffin · four bearers · arranging the service

Note: `Doctors' fees, flowers and notices are shown separately and never added without asking.`

**The family** — H2 `Three generations, *one* front door.` `Alder & Grey was started by Thomas Alder in 1962, in the same stone building on Widcombe Hill where we work today. His granddaughter Ruth now leads the business with her husband Daniel. We are not part of a group, and we never will be.`

**Recent notices** — Label `FUNERAL NOTICES`
- **Margaret Ellen Hurst** — 1934 – 2026 — Service at St Mark's Church, Lyncombe, Thursday 24 September, 11am
- **David John Pryce** — 1951 – 2026 — Haycombe Crematorium, Friday 25 September, 2pm
- **Anne Lucas** — 1940 – 2026 — Private family service
- **Robert Charles Fenwick** — 1948 – 2026 — Bath Abbey Cemetery, Monday 28 September, 10:30am

**What families say** — `"Ruth sat with us at our kitchen table for two hours and never once looked at her watch. We will never forget that kindness."` — *The Morgan family, Combe Down*

**Visit or call**
- Left: `Alder & Grey, 14 Widcombe Hill, Bath BA2 6AA` · `Monday to Friday 9am – 5pm` · `Saturday by appointment` · `Parking at the rear`
- Right: `You can call us at any time, including nights, weekends and bank holidays. You will always speak to one of us.` · `01225 480 316` · `care@alderandgrey.co.uk`

**Footer** — ALDER & GREY Funeral Directors · Arranging a funeral · Prices · Funeral plans · Notices · Contact · `Members of the National Association of Funeral Directors` · © 2026

## 10. Key Dependencies
```json
{
  "motion": "^12.0.0",
  "lucide-react": "^0.460.0",
  "clsx": "^2.1.0"
}
```
