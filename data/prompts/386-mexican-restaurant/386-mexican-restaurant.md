# Casa Lupita: Mexican Restaurant Website Prompt

## 1. Goal
Build a warm, lively website for **Casa Lupita**, a family run Mexican restaurant in Austin, Texas, known for handmade tortillas, slow cooked moles and a long mezcal list. Warm sand background, deep brown text, terracotta and teal, a chunky friendly serif. It should feel bright and generous like the dining room on a Friday night, with big food photography and a menu you can actually read.

## 2. Tech Stack
```
React + Vite + TypeScript + Tailwind CSS + Framer Motion (motion/react) + lucide-react
```
Single page. No component libraries, no reservation widget. `Book a table` links out.

## 3. Design system
```css
:root {
  --paper: #FBF3E9;         /* warm sand */
  --ink: #2A1A12;           /* deep brown */
  --accent: #B5401F;        /* terracotta */
  --on-accent: #FFFFFF;
  --teal: #0F5257;          /* second colour, used for one full section and the footer, cream text on it */
  --surface: #F2E2CF;
  --muted: #6B5446;
  --line: rgba(42,26,18,0.15);
}
```
Every text colour must reach at least 4.5 to 1 against its background. No text under 14px.

## 4. Typography
```html
<link href="https://fonts.googleapis.com/css2?family=Young+Serif&family=Manrope:wght@400;600;700&display=swap" rel="stylesheet" />
```
- **Headings:** Young Serif 400, clamp(40px, 6vw, 96px), line-height 1.02
- **Dish names:** Young Serif 400, 22px
- **Body:** Manrope 400, 17px, line-height 1.6
- **Labels:** Manrope 700, 14px, uppercase, letter-spacing 0.1em, terracotta

## 5. Buttons
Chunky and playful:
- **Primary:** terracotta fill, white Manrope 700 text, fully rounded, padding 16px 28px, and a solid hard shadow offset 4px down and 4px right in deep brown (no blur). Hover: the button moves 2px down and right and the shadow shrinks to 2px, like pressing it.
- **Secondary:** paper fill, brown 2px border, same rounded shape and the same hard shadow.
- No arrow icons, no glow.

## 6. Sections

1. **Navbar:** paper, 84px. Restaurant name in Young Serif left, links centred, primary button `Book a table` right. A thin terracotta stripe 6px tall runs across the very top of the page above the navbar.
2. **Hero, photo collage:** the heading spans the left half with one paragraph and both buttons. On the right three photos in rounded 20px frames overlap slightly at different angles (-3, 2 and -1 degrees). *Photographs: a plate of three tacos al pastor with pineapple and cilantro; hands pressing fresh masa tortillas on a comal; a smoky mezcal cocktail with an orange slice on a wooden bar.*
3. **Our story:** surface. A short story in two paragraphs next to a portrait of the family in the kitchen. A label `SINCE 2009` above the heading. *Photograph: a smiling Mexican family of three generations in a restaurant kitchen, aprons, steam rising from pots, warm light.*
4. **The menu:** paper. A simple tab bar with four tabs: Tacos, Platos, Sides, Drinks. Tabs are rounded pills, the active one terracotta with white text. Under them, dishes in two columns: name, short description, price. Vegetarian dishes marked with a small `V` badge in teal.
5. **Mole night:** a full width teal section with cream text. A large heading, one paragraph about the Thursday mole night and a photo on the right with 20px radius. *Photograph: a dark rich mole poblano over chicken, sesame seeds, rice and warm tortillas, overhead.*
6. **Mezcal and tequila:** paper. A ruled list of eight bottles in two columns: name, region, a short note and price per pour. A line under it about flights.
7. **Reviews:** surface. Three short reviews in rounded cards with the reviewer's first name and where the review came from.
8. **Visit:** two columns. Left: address, phone, hours as a small table and the primary button. Right: a photo of the terrace. *Photograph: a colourful restaurant patio with string lights, papel picado banners and wooden tables at dusk.*
9. **Footer:** teal, cream text. Name in Young Serif, a line in Spanish and English, social links and the address.

## 7. Motion
- Hero photos drop in one after another with a small rotation, 0.5s each, 0.12s apart.
- Menu tab switch: dishes fade and slide 8px, 0.25s.
- Buttons use the pressed effect described above.
- Respect `prefers-reduced-motion`.

## 8. Responsive
- **Mobile under 768px:** hero photos become a single row of three smaller photos under the text. Menu tabs scroll horizontally, dishes one column. Teal section stacks with the photo first. Navbar shows the name and a rounded `Menu` button. A terracotta `Book a table` button sits fixed at the bottom with safe area padding.
- **Desktop:** max-width 1200px, section padding 100px.

## 9. Full copy

**Name:** Casa Lupita
**Nav:** Menu, Our Story, Mezcal, Visit. Button: `Book a table`

**Hero**
- Heading: `Handmade tortillas, slow moles and a very long Friday.`
- Text: `Family cooking from Oaxaca and Puebla in East Austin. Everything is made here, from the masa to the hot sauce.`
- Buttons: `Book a table`, `See the menu`

**Our story**
- Label: `SINCE 2009`
- Heading: `Lupita's kitchen, three generations later`
- `Guadalupe Ramos opened Casa Lupita with eight tables and her mother's mole recipe. Today her son runs the kitchen and her granddaughter runs the bar, and the mole recipe has not changed.`
- `We grind our own corn every morning, buy chiles straight from Oaxaca and cook the way we eat at home: slowly, and with too much food on the table.`

**Menu**
- Tacos: `Al pastor` pork, pineapple, cilantro, onion $4.50 · `Barbacoa` slow braised beef, salsa verde $5.00 · `Pescado` crispy fish, cabbage, chipotle crema $5.50 · `Hongos` (V) roasted mushrooms, epazote, queso fresco $4.50
- Platos: `Mole poblano` chicken, sesame, rice, tortillas $22 · `Cochinita pibil` achiote pork, pickled onion $21 · `Chile relleno` (V) poblano, cheese, tomato broth $18 · `Carne asada` skirt steak, nopales, beans $26
- Sides: `Guacamole and totopos` $11 · `Elote` grilled corn, mayo, cotija, chile $7 · `Frijoles charros` $6 · `Arroz rojo` $5
- Drinks: `Horchata` $5 · `Agua de jamaica` $5 · `House margarita` $12 · `Mexican lager` $7

**Mole night**
- Heading: `Thursday is mole night.`
- Text: `Three moles, slow cooked for two days, served with chicken, pork or roasted squash. Live son jarocho music from 7 pm. Book ahead, it is the busiest night of the week.`

**Mezcal and tequila**
- `Del Maguey Vida` Oaxaca, `Smoky and bright, our house pour.` $9
- `Montelobos Espadín` Oaxaca, `Herbal and clean.` $11
- `Rey Campero Tobalá` Oaxaca, `Wild agave, floral, rare.` $18
- `Mezcal Vago Elote` Oaxaca, `Distilled with roasted corn.` $14
- `Fortaleza Blanco` Jalisco, `Classic tequila, sweet agave.` $12
- `Siete Leguas Reposado` Jalisco, `Gentle oak and vanilla.` $13
- `G4 Añejo` Jalisco, `Rich, caramel, long finish.` $16
- `Raicilla La Venenosa` Jalisco, `Wild and funky. Try it once.` $15
Line: `Ask for a flight of three, served with orange and sal de gusano. $24`

**Reviews**
- `The mole is the best thing I have eaten in Austin this year. Go on a Thursday.` Kate, Google
- `Tortillas are made right in front of you. The kids were mesmerised.` Mike, Yelp
- `Our server walked us through the mezcal list like a friend. Lovely night.` Sara, Google

**Visit**
- `Casa Lupita, 1810 E Cesar Chavez St, Austin TX 78702`
- `(512) 555 0164`
- Hours: `Tue to Thu 5 pm to 10 pm` · `Fri and Sat 5 pm to 11 pm` · `Sun 11 am to 3 pm, brunch` · `Closed Mondays`
- Button: `Book a table`

**Footer**
`Casa Lupita` · `Mi casa es tu casa. Our house is your house.` · `Instagram`, `Facebook` · `1810 E Cesar Chavez St, Austin TX`

## 10. Never
Sombrero or cactus clip art, fake Mexican display fonts, neon, gradients, glow, glassmorphism, emoji, stock icons for every dish, dashes of any kind in the copy, lorem ipsum.

## 11. Dependencies
```json
{ "motion": "^12.0.0", "lucide-react": "^0.460.0", "clsx": "^2.1.0" }
```
