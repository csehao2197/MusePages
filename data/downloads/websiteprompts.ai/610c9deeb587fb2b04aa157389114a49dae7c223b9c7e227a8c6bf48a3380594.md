# Little Sprig: Vegan Cafe Website Prompt

## 1. Goal
Build a bright, sunny, generous website for **Little Sprig**, a plant based café and bakery on St James's Street in Kemptown, Brighton. Big confident blocks of lemon yellow and leaf green, soft rounded corners, and bright overhead food photography that makes you hungry. It should feel like a sunny Saturday brunch with the windows open, not a health food lecture.

## 2. Tech Stack
```
React + Vite + TypeScript + Tailwind CSS + Framer Motion (motion/react) + lucide-react
```
Single page. No component libraries, no ordering system, no carousel, no map library. Cake orders go to a mailto link.

## 3. Design system
```css
:root {
  --paper: #FFFBEA;         /* warm cream, base */
  --ink: #14301E;           /* deep green, main text */
  --lemon: #FFE14D;         /* lemon yellow, large surfaces */
  --leaf: #1E6B3A;          /* leaf green, large surfaces and buttons */
  --on-leaf: #FFF6C2;       /* pale lemon text on leaf */
  --surface: #F3EFD4;
  --muted: #4F5E4F;
  --line: rgba(20,48,30,0.18);
}
```
Checked: ink on paper 13.8 to 1 and on lemon 11 to 1, leaf on lemon 5 to 1, pale lemon on leaf 6 to 1, muted 6.6 to 1 on paper, 5.9 to 1 on surface and 5.3 to 1 on lemon. Never muted text on leaf. Every text colour must reach at least 4.5 to 1 against the surface it sits on, and no text is smaller than 14px.

Rounded and soft: 28px radius on photo frames and colour panels, buttons fully rounded. Photos are always framed: inset inside a colour panel with 28px radius, never edge to edge. No shadows, no borders on photos.

## 4. Typography
```html
<link href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;600;800&display=swap" rel="stylesheet" />
```
One family, three weights, a friendly grotesk set heavy and tight.
- **Display:** Hanken Grotesk 800, sentence case, clamp(52px, 7.6vw, 128px), line-height 0.95, letter-spacing -0.035em.
- **Section headings:** Hanken Grotesk 800, clamp(36px, 4.6vw, 72px), line-height 1, letter-spacing -0.03em.
- **Dish names:** Hanken Grotesk 800, 22px.
- **Body:** Hanken Grotesk 400, 18px, line-height 1.6.
- **Small labels:** Hanken Grotesk 600, 14px, letter-spacing 0.04em, no uppercase.
- **Prices:** Hanken Grotesk 600, tabular numbers.

## 5. Buttons
Soft and round:
- **Primary:** leaf green pill, pale lemon text, Hanken Grotesk 800 17px, padding 18px 30px, fully rounded. Hover: darkens to #17552E and grows 2px wider.
- **Secondary:** a pill with a 2px ink border, transparent fill, ink text. Hover: fills lemon.
- No arrow icons, no circles inside buttons, no square buttons.

## 6. Sections

1. **Navbar:** paper, 80px. Wordmark `little sprig` in lowercase Hanken 800 26px, links centred, `Order a cake` secondary pill right.

2. **Hero, split:** two halves edge to edge, `min-height: clamp(560px, 82vh, 860px)`. Left half is a solid lemon panel: small label, the display heading in ink, one sentence, primary pill and a secondary pill. Right half is leaf green with the photo framed inside it, inset 28px on all sides, 28px radius. *Photograph: a bright overhead brunch table on a pale wooden surface, a stack of fluffy pancakes with blueberries and maple, a smashed avocado toast with chilli and lime, a flat white with leaf latte art, a glass of fresh orange juice, morning sunlight, crisp shadows, lots of colour.*

3. **On the counter today:** paper. Heading left, a short note right. Three framed photos in a row, each in a soft panel alternating lemon, surface, lemon, with dish name and price under the photo. *Photographs from above: a lemon and poppy seed loaf sliced on a plate; a big rainbow bowl with roast squash, chickpeas, pickled red cabbage and tahini; a cinnamon bun glistening with glaze.*

4. **The big line:** leaf green panel across the full content width with 28px radius and 96px padding, one sentence in display size in pale lemon, nothing else.

5. **The menu:** paper. Three columns with ink headings: Breakfast, Lunch, Bakes. Each item has name in 800, a short line in muted text and a price on the right. Hairlines between items.

6. **Coffee and drinks:** lemon panel with 28px radius. Left: heading and two sentences about the roaster. Right: a short two column price list in ink.

7. **The room:** a single wide framed photo inside a surface panel, 16:9 at desktop, with a caption under it in muted text. *Photograph: a sunny café interior with big shopfront windows, green tiled counter, hanging trailing plants, mismatched wooden chairs, a few people chatting, a dog under a table.*

8. **Cakes to order:** paper. Split: left a framed photo inside a lemon panel, right the heading, a paragraph, three lines with sizes and prices, and the primary pill linking to email. *Photograph: a tall three layer lemon and elderflower celebration cake with fresh flowers on top, on a pale green cake stand, bright daylight.*

9. **Visit:** surface panel with 28px radius. Three columns: address, hours as a short table, and getting there. No map.

10. **Footer:** paper, three quiet rows: the wordmark and a one line sign off, a row of links, and a small line with the company details.

## 7. Motion
One idea: things pop up softly, like a plate set down.
- Hero heading lines rise 24px with a 0.08s stagger, 0.5s. The framed photo scales from 0.97 to 1 with a soft spring.
- Panels rise 20px and fade in on scroll, 0.06s stagger within a row.
- Framed photos zoom to 1.04 inside their frame on hover, 0.5s.
- Respect `prefers-reduced-motion`: simple fades only.

## 8. Responsive
- **Mobile under 768px:** hero stacks, lemon text panel on top, green photo panel under it at 4:5. Panels keep 28px radius with 16px gutters. Counter, menu, drinks and cakes all become one column. Navbar shows the wordmark and a round `Menu` pill opening a full screen lemon panel with links in 800 at 40px. A leaf green `Order a cake` pill is fixed at the bottom with safe area padding.
- **Desktop:** content max-width 1240px, section padding 96px, hero runs full width.

## 9. Full copy

**Name:** Little Sprig
**Nav:** Today, Menu, Coffee, Cakes, Visit. Button: `Order a cake`

**Hero**
- Label: `Plant based café and bakery, Kemptown`
- Heading: `Brunch so good nobody asks where the bacon went.`
- Text: `Pancakes, proper coffee and cakes baked every morning on St James's Street. Everything is plant based, nothing tastes like a compromise.`
- Buttons: `See the menu`, `Order a cake`

**On the counter today**
- Heading: `On the counter today`
- Note: `Baked at six, gone by two.`
- `Lemon and poppy seed loaf` £3.80
- `Rainbow roast squash bowl` £11.50
- `Cardamom cinnamon bun` £3.60

**The big line**
`We just make breakfast, lunch and cake. It happens to be vegan.`

**The menu**
- Breakfast: `Blueberry pancakes` `Maple, oat yoghurt, lemon zest` £10.50 · `Avocado toast` `Sourdough, chilli, lime, toasted seeds` £9.50 · `The Sprig fry up` `Tofu scramble, beans, mushrooms, hash browns` £13
- Lunch: `Rainbow bowl` `Roast squash, chickpeas, red cabbage, tahini` £11.50 · `Smoked carrot reuben` `Rye, sauerkraut, Russian dressing` £10.50 · `Soup of the day` `With sourdough and olive oil` £7
- Bakes: `Cardamom cinnamon bun` £3.60 · `Lemon and poppy seed loaf` £3.80 · `Chocolate and hazelnut brownie` £3.50 · `Seasonal fruit galette` £4.20
- Allergens: `Most dishes can be made gluten free. Please ask about nuts, we use them in the kitchen.`

**Coffee and drinks**
- Heading: `Coffee from up the road`
- Text: `Our beans are roasted by Small Batch in Hove, a fifteen minute cycle away. Oat milk is the default, soya and almond are free.`
- `Flat white £3.40` · `Oat latte £3.60` · `Batch brew £2.80` · `Iced matcha £4.20` · `Fresh orange juice £3.90`

**The room**
- Caption: `Thirty two seats, a sunny window and room for your dog.`

**Cakes to order**
- Heading: `A cake for the occasion`
- Text: `Birthdays, weddings or a Tuesday that needs it. Tell us a flavour and a date, we will do the rest. Seven days notice please.`
- `6 inch, serves 10, from £45` · `8 inch, serves 16, from £65` · `Two tier, serves 40, from £160`
- Button: `Email us about a cake`

**Visit**
- Address: `Little Sprig, 88 St James's Street, Kemptown, Brighton BN2 1TH`
- Hours: `Mon to Fri 08:00 to 16:00` · `Sat 08:30 to 17:00` · `Sun 09:00 to 15:00`
- Getting there: `Seven minutes on foot from the Palace Pier. The number 7 bus stops right outside.`

**Footer**
- `little sprig` · `Come hungry, leave a little bit greener.`
- `Instagram`, `Email`, `Allergen guide`
- `Little Sprig Ltd, registered in England and Wales.`

## 10. Never
Lemon or white text on lemon, muted text on leaf, edge to edge photos, square buttons, gradients, glow, neon, glassmorphism, leaf or sprout clip art, icon grids, "guilt free" or "clean eating" language, emoji, dashes of any kind in the copy, lorem ipsum, `100vh` heroes, an embedded map, a carousel.

## 11. Dependencies
```json
{ "motion": "^12.0.0", "lucide-react": "^0.460.0", "clsx": "^2.1.0" }
```
