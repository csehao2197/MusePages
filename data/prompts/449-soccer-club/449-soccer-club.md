# Rose City Rovers: Soccer Club Website Prompt

## 1. Goal
Build a confident, sporty website for **Rose City Rovers**, a community soccer club in Portland, Oregon with youth teams from under 8 to adults. Dark navy ground, white type, one bright pitch green, tall condensed headings. It should feel like a club with a proper kit and a busy Saturday, not like a fitness app.

## 2. Tech Stack
```
React + Vite + TypeScript + Tailwind CSS + Framer Motion (motion/react) + lucide-react
```
Single page. No component libraries, no calendar library, no booking system.

## 3. Design system
```css
:root {
  --paper: #0E1A2B;         /* navy, main background */
  --ink: #F4F6F8;
  --accent: #22B573;        /* pitch green */
  --on-accent: #0E1A2B;
  --surface: #16253A;
  --muted: #A9B4C2;
  --line: rgba(244,246,248,0.14);
}
```
One full width white section in the middle (the fixtures) breaks up the navy. Text there uses navy ink. Every text colour must reach at least 4.5 to 1 on its background, no text under 14px.

## 4. Typography
```html
<link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700;800&family=Barlow:wght@400;500;600&display=swap" rel="stylesheet" />
```
- **Display:** Barlow Condensed 800, uppercase, clamp(52px, 8vw, 128px), line-height 0.92, letter-spacing -0.01em
- **Subheads:** Barlow Condensed 700, uppercase, 28px
- **Body:** Barlow 400, 17px, line-height 1.6
- **Small labels:** Barlow 600, 14px, uppercase, letter-spacing 0.08em

## 5. Buttons
Square and sporty, like a kit number:
- **Primary:** solid green, navy text, no border radius at all, Barlow Condensed 700 uppercase 18px, padding 16px 28px. Hover: background turns white.
- **Secondary:** transparent with a 2px white border, square corners, same type. Hover: fills white, text navy.
- No arrows inside buttons, no pills, no rounded corners anywhere on the site except the club crest.

## 6. Sections

1. **Navbar:** navy, 76px. Round club crest left (a simple green circle with `RCR` in white), links in the middle, primary button `Join the club` right. Sticky with a 1px bottom line after scrolling.
2. **Hero:** full width photograph with a navy gradient from the bottom (navy at 100% to transparent at 60%). Headline in huge condensed caps bottom left, one line of body text and both buttons. Min height `clamp(560px, 80vh, 860px)`. *Photograph: youth soccer players in green and navy kit celebrating a goal on a grass pitch, golden evening light, crowd of parents in the background, energetic.*
3. **Next match bar:** a thin green strip directly under the hero, navy text: `NEXT HOME GAME` + date, opponent and kick off time, plus a text link `All fixtures`.
4. **Our teams:** navy. A grid of eight team tiles (2 rows of 4). Each tile is a surface coloured rectangle with the age group in big condensed type, the training night underneath and the coach's name. Hover: the top border turns green.
5. **Fixtures and results:** white section with navy text. Two columns: upcoming fixtures on the left (five rows: date, team, opponent, home or away, time) and recent results on the right (five rows with the score in bold). Simple ruled rows, no cards.
6. **Training at Delta Park:** navy. Photo left, text right with a short list of what to bring and where to park. *Photograph: a coach setting out orange cones on a floodlit grass pitch at dusk, kids arriving with balls.*
7. **Numbers:** three big figures in green condensed type in a row: players, volunteer coaches, years. One line under each.
8. **Join:** surface coloured block. Heading, two sentences about registration and fees, a fee list (three rows) and the primary button. A note about the hardship fund.
9. **Sponsors:** a single row of six sponsor names set in muted condensed type, separated by thin vertical lines. Text only, no logo images.
10. **Footer:** navy. Crest and club name, ground address, email, training phone line, and links to the parents handbook and safeguarding policy.

## 7. Motion
- Hero headline slides up 30px and fades in, 0.7s.
- Team tiles fade in with a 0.06s stagger when the grid enters view.
- Numbers count up once from zero over 1.2s.
- Respect `prefers-reduced-motion`.

## 8. Responsive
- **Mobile under 768px:** hero headline at 52px, buttons full width stacked. Team grid becomes 2 columns. Fixtures and results stack, results below fixtures. Navbar collapses to crest plus a square `Menu` button that opens a full screen navy menu with large condensed links.
- **Desktop:** max-width 1240px, section padding 100px.

## 9. Full copy

**Club name:** Rose City Rovers
**Nav:** Teams, Fixtures, Training, Join
**Primary button:** Join the club

**Hero**
- Headline: `Every kid gets a shirt. Every kid gets a game.`
- Text: `Community soccer in Northeast Portland since 1994. Eight teams, 340 players and a Saturday morning that runs on orange slices.`
- Buttons: `Join the club`, `See the teams`

**Next match bar:** `NEXT HOME GAME  Sat 18 Oct, U12 Rovers vs Eastside United, 10:00 at Delta Park` and link `All fixtures`

**Our teams**
- U8 Mixed, Tuesdays 5:00 pm, Coach Dana Ortiz
- U10 Girls, Tuesdays 5:30 pm, Coach Priya Shah
- U10 Boys, Wednesdays 5:30 pm, Coach Marcus Bell
- U12 Rovers, Mondays 6:00 pm, Coach Tom Reilly
- U14 Girls, Thursdays 6:00 pm, Coach Ana Ruiz
- U16 Boys, Thursdays 6:30 pm, Coach Ben Okafor
- Women's Open, Wednesdays 7:30 pm, Coach Liz Chen
- Men's Open, Mondays 7:30 pm, Coach Sam Patel

**Fixtures**
- Sat 18 Oct, U12 Rovers vs Eastside United, Home, 10:00
- Sat 18 Oct, U10 Girls vs Lake Oswego FC, Away, 11:30
- Sun 19 Oct, Women's Open vs Bridgetown Ladies, Home, 2:00 pm
- Sat 25 Oct, U14 Girls vs Beaverton Blue, Away, 9:00
- Sat 25 Oct, U16 Boys vs Gresham Rangers, Home, 1:00 pm

**Results**
- U12 Rovers 3, Sellwood SC 1
- U10 Girls 2, Hillsboro Hawks 2
- Men's Open 1, Tigard Town 0
- U14 Girls 4, Milwaukie FC 2
- U16 Boys 0, Westside Select 2

**Training at Delta Park**
- Heading: `Tuesdays to Thursdays under the lights.`
- Text: `Most teams train at Delta Park fields 3 and 4. Arrive ten minutes early, bring water and shin guards, and park in the north lot, not on the grass.`
- Bring list: `Water bottle`, `Shin guards and boots`, `A ball with your name on it`, `A layer for after dark`

**Numbers**
- `340` registered players
- `46` volunteer coaches
- `31` seasons and counting

**Join**
- Heading: `Registration for spring opens 1 December.`
- Text: `All teams play from March to June. Fees cover kit, referees and field rental, and nobody is turned away for money.`
- Fees: `U8 and U10: $95 a season`, `U12 to U16: $140 a season`, `Adult teams: $160 a season`
- Button: `Join the club`
- Note: `Ask about the hardship fund. It is confidential and it is there to be used.`

**Sponsors:** Burnside Tire Co, Mississippi Pizza, Alberta Street Dental, Hollis Hardware, Kenton Coffee, Rose City Print

**Footer**
`Rose City Rovers`, `Delta Park, 10737 N Union Ct, Portland OR 97217`, `hello@rosecityrovers.org`, `Training line (503) 555 0187`
Links: `Parents handbook`, `Safeguarding policy`, `Volunteer`

## 10. Never
Rounded buttons, pill shapes, glassmorphism, glow, gradients except the photo overlay, emoji, stock icons for every list item, logo image placeholders, dashes of any kind in the copy, lorem ipsum.

## 11. Dependencies
```json
{ "motion": "^12.0.0", "lucide-react": "^0.460.0", "clsx": "^2.1.0" }
```
