# The Long Weekend: Magazine Website Prompt

## 1. Goal
Build the homepage of **The Long Weekend**, an independent online magazine about food, travel and slow living, published every Friday. Classic editorial layout: white page, black type, one red accent used sparingly, a strong serif for headlines and a clean sans for everything else. It should look like the front page of a good weekend paper, dense but easy to scan.

## 2. Tech Stack
```
React + Vite + TypeScript + Tailwind CSS + Framer Motion (motion/react) + lucide-react
```
Single homepage with static data in a `stories.ts` file. No CMS, no component libraries, no infinite scroll.

## 3. Design system
```css
:root {
  --paper: #FFFFFF;
  --ink: #111111;
  --accent: #C8102E;        /* red, for section labels and one button only */
  --on-accent: #FFFFFF;
  --surface: #F3F3F1;
  --muted: #5A5A5A;
  --line: #D9D9D6;
}
```
Every text colour must reach at least 4.5 to 1 against its background. No text under 14px.

## 4. Typography
```html
<link href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,500;0,6..72,700;1,6..72,500&family=Inter+Tight:wght@400;500;600&display=swap" rel="stylesheet" />
```
- **Masthead:** Newsreader 700, 64px desktop, letter-spacing -0.02em
- **Lead headline:** Newsreader 700, clamp(36px, 4.4vw, 60px), line-height 1.05
- **Story headlines:** Newsreader 500, 22px to 26px, line-height 1.2
- **Standfirst and body:** Inter Tight 400, 17px, line-height 1.55
- **Section labels and bylines:** Inter Tight 600, 14px, uppercase, letter-spacing 0.06em, labels in red

## 5. Buttons and links
- Headlines are the links. Hover: underline in red, 2px, offset 3px.
- **Subscribe button:** small red rectangle, 4px radius, white Inter Tight 600 text, padding 10px 18px. This is the only filled button on the site.
- **Secondary:** text link with a small right arrow from lucide, e.g. `More travel`.
- No pills and no large buttons.

## 6. Sections

1. **Top line:** a thin bar with today's date on the left, `Issue 212` in the middle and `Sign in` plus the red `Subscribe` button on the right.
2. **Masthead:** the magazine name centred, a one line tagline under it in italic Newsreader, then a category bar with eight section links separated by thin vertical rules, with a 1px rule above and below.
3. **Lead story:** a large photograph across 8 of 12 columns with the label, headline, standfirst and byline under it. To the right, in 4 columns, a vertical list of four smaller stories, each with a label, headline and byline, separated by rules. *Photograph: a long wooden table set outdoors under olive trees, plates of grilled vegetables and bread, late afternoon light, people's hands reaching for food.*
4. **Three across:** three stories in equal columns with a 4:3 photo, label, headline and a two line standfirst. *Photographs: a quiet ferry deck at dawn; a stack of ceramic bowls in a pottery studio; a bakery counter with dark sourdough loaves.*
5. **The weekend recipe:** a surface coloured band. A square photo on the left, on the right the label `THE WEEKEND RECIPE`, the recipe name, prep time, serves and a short intro, then a text link `Get the recipe`. *Photograph: a pan of slow roasted tomatoes with garlic and thyme, overhead, rustic linen.*
6. **Opinion:** four columnists in a row, each with a small round portrait at 56px, their name, and the headline of their latest column in italic Newsreader. *Portraits: four different people photographed in natural light against plain walls.*
7. **Most read:** a numbered list of five headlines, numbers in large red Newsreader, headlines in black. Placed next to a newsletter box in the same row: surface background, a heading, one sentence and an email field with the red button.
8. **Travel:** section label in red, then one wide horizontal story (photo left, text right) and two small text only stories below it. *Photograph: a narrow cobbled street in a hill town at blue hour, warm windows lit.*
9. **Footer:** black background, white text. Masthead name smaller, four columns of links (sections, about, help, follow), and a line with the copyright and the address of the publisher.

## 7. Motion
Very little, it is a newspaper. Photos fade in when they load. Headline underline animates from left to right on hover in 0.2s. No scroll animations on text. Respect `prefers-reduced-motion`.

## 8. Responsive
- **Mobile under 768px:** the top line keeps only the date and the subscribe button. Masthead at 40px. The category bar becomes a horizontal scroll row with no visible scrollbar. Lead story full width, side stories below. Three across becomes one column. Opinion becomes a 2 by 2 grid. Most read and newsletter stack.
- **Tablet:** three across becomes two columns plus one.
- **Desktop:** 12 column grid, max-width 1240px, 32px gutters, section spacing 64px separated by 1px rules.

## 9. Full copy

**Top line:** `Friday 16 October 2026` · `Issue 212` · `Sign in` · Button `Subscribe`
**Masthead:** `The Long Weekend` · Tagline: `Food, travel and the art of doing less. Every Friday.`
**Categories:** Food, Travel, Home, Gardens, Culture, Recipes, Opinion, Shop

**Lead story**
- Label: `FOOD`
- Headline: `The long lunch is back, and it never really left the south of Italy`
- Standfirst: `In Puglia, Sunday lunch still starts at one and finishes when the light goes. We spent a month at other people's tables to find out how.`
- Byline: `BY SOFIA MARINO`

**Side stories**
- `TRAVEL` `Twelve hours in Porto without a single queue` `BY DAN HOLLIS`
- `HOME` `Why everyone is painting their kitchen the colour of bread` `BY RUTH ADEYEMI`
- `GARDENS` `What to plant in October if you only have a balcony` `BY TOM FIELDING`
- `CULTURE` `The quiet comeback of the paper map` `BY ELLA NG`

**Three across**
- `TRAVEL` `The slowest way across the Baltic is also the best` `A night ferry, a cabin with a window and nothing to do until Helsinki.`
- `CRAFT` `Inside the pottery that makes bowls for half of London's restaurants` `Six people, two kilns and a waiting list that runs into next summer.`
- `FOOD` `Is this the best sourdough in the north?` `We ate a loaf a day for a week in Leeds, Newcastle and York to find out.`

**The weekend recipe**
- Label: `THE WEEKEND RECIPE`
- Name: `Slow roasted tomatoes with garlic and thyme`
- Meta: `Prep 10 minutes` · `Cook 2 hours` · `Serves 4`
- Intro: `The one thing worth turning the oven on for all afternoon. Eat them on toast, stir them into pasta or keep them in oil for a week.`
- Link: `Get the recipe`

**Opinion**
- `Grace Whitfield` `I have stopped apologising for going to bed at nine`
- `Owen Price` `The case for eating dinner at the same table every night`
- `Leila Haddad` `Holidays are better when you go back to the same place`
- `Marcus Bell` `Nobody needs a smart kettle`

**Most read**
1. `The long lunch is back, and it never really left the south of Italy`
2. `Why everyone is painting their kitchen the colour of bread`
3. `Twelve hours in Porto without a single queue`
4. `Slow roasted tomatoes with garlic and thyme`
5. `The quiet comeback of the paper map`

**Newsletter**
- Heading: `The Friday letter`
- Text: `The week's best stories, one recipe and nothing you did not ask for. Free, every Friday at 7 am.`
- Placeholder: `Your email` · Button: `Subscribe`

**Travel**
- Wide story: `TRAVEL` `A week in the hill towns of Umbria, by bus` `No car, no plan and the best dinner of the year in a town of 400 people.` `BY SOFIA MARINO`
- Small: `Where to swim in the sea in November, if you are brave` · `The best train journeys in Europe under four hours`

**Footer**
`The Long Weekend` · Columns: Sections (Food, Travel, Home, Culture), About (Our story, Writers, Advertise), Help (Contact, Subscriptions, Privacy), Follow (Instagram, Newsletter, RSS) · `© 2026 The Long Weekend Ltd, 14 Hope Street, Edinburgh EH2 4DB`

## 10. Never
Card shadows, rounded photo corners larger than 2px, gradients, glow, emoji, carousels, pop ups, autoplay video, dashes of any kind in the copy, lorem ipsum, giant hero banners that push the stories below the fold.

## 11. Dependencies
```json
{ "motion": "^12.0.0", "lucide-react": "^0.460.0", "clsx": "^2.1.0" }
```
