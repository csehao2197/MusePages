# Retro Roller Rink Website

Build this website exactly as described below. Replace the [VARIABLES] with your own values; keep everything else.

## Brief
Build [BRAND], a fictional roller rink in [CITY] at [ADDRESS]. [TAGLINE] is its human welcome; keep a groovy 1970s interior and the specific burnt-orange/mustard visual identity.

- Audience: Families, first-time skaters, adults meeting friends and party organizers.
- Goal: Find an appropriate session, check rental fit, compare party costs and submit an honest local-only reservation preview.
- Tone: Friendly, clear, community-minded, with useful safety and age information.

## Stack
- Framework: Vite + React + TypeScript
- Styling: Vanilla CSS
- Libraries: vite (MIT), react (MIT), react-dom (MIT), typescript (Apache-2.0), @fontsource/fredoka (OFL-1.1), @fontsource/dm-sans (OFL-1.1)
- Build: `npm run build` → static files in `dist/`. No backend, no server code, no external APIs.
- Setup:
  - Set Vite base to ./ and build.sourcemap to false. Use a single src/content.ts for all editable content and fully rewrite its data for variable changes.
  - Implement responsive components and CSS tokens in src/styles.css. Bundle fonts through the listed Fontsource packages; import only the weights actually used.
  - Provide semantic native controls and keyboard/touch alternatives; implement focus-managed dialogs and local-only validated form feedback.

## Variables
- [BRAND] — Brand (default: "Rollerloop"). Rewrite every related headline, item, label, alt and confirmation for this value.
- [CITY] — City (default: "Cedar Quay"). Rewrite every related headline, item, label, alt and confirmation for this value.
- [ADDRESS] — Address (default: "48 Marigold Lane"). Rewrite every related headline, item, label, alt and confirmation for this value.
- [TAGLINE] — Tagline (default: "Good wheels. Great company."). Rewrite every related headline, item, label, alt and confirmation for this value.
- [CREDIT] — keep a small "Template by VibeFather" link to https://vibefather.ai/t/retro-roller-rink-website in the footer (default: yes; delete this line to remove it)

The copy under Pages & Sections is written for the default values. If your values differ, rewrite every headline, paragraph, label and image for them — same length, tone and structure. Layout, colors, type and motion stay as described.
Keep all copy, image paths and links in one content file (for example `src/content.ts`), keyed by section, so the content can be swapped later without touching components.

## Design
### Colors
- Burnt orange `#E8590C` — Hero large field and full-width wavy stripes. WCAG relative-luminance calculations: #32170E text on #E8590C: 4.64:1; #32170E text on #F2B807: 9.20:1; #FFFDF5 text on #32170E: 16.31:1; #FFFDF5 text on #546B24: 5.88:1; #32170E text on #FFFDF5: 16.31:1. Use these pairs for every normal-size label/body/button. Decorative overlaps/gradients carry no text; readable text gets a solid backing.
- Mustard `#F2B807` — Hero large field, form selections, tickets.
- Chocolate `#32170E` — All dark text; footer and deep rules.
- Avocado `#546B24` — Schedule feature panels and wave strip.
- Paper `#FFFDF5` — Reading/form panels, not the primary hero background.

### Typography
- Display: Fredoka (OFL), weights 700
- Body: DM Sans (OFL), weights 400/700

### Layout & motion
- Spacing: 1180px max width, desktop 40px/mobile 20px gutters. 8px spacing unit, 88px section gaps desktop and 56px mobile. Hero 55/45 split, schedule 3-column, party 3-column.
- Radius: 36px photo arch corners, 20px package panels, 999px pill buttons, 3px chocolate borders. Wavy dividers are authored SVG, never cover labels.
- Motion: Decorative disco sparkles slowly change opacity between .65 and 1 over 3 seconds without flashing; Pause decoration toggle persists.
- Motion: Cards lift 3px for 180ms on hover/focus, section reveal maximum 16px once; reduced motion removes both. No horizontal auto-marquee.
- Imagery: Five consistent photorealistic warm editorial photographs of one fictional 1970s roller rink, burnt orange/mustard/avocado/chocolate and polished maple flooring, soft tungsten lighting with mild film grain. Hero is wide rink architecture, not a face. No text, logos or branded equipment. One family action scene shows only legs/skates from behind, no identifiable faces. Photos are AI fictional venue placeholders, not a real address representation. Never replace with vector-only business imagery.

## Pages & Sections
### [BRAND] — [TAGLINE] (`index.html`)
1. **Groovy welcome** — Header [BRAND], Sessions, Rentals, Parties, Snack bar, 'Plan a visit'. H1 '[TAGLINE]'. Intro 'A warm floor, a good groove, and room for every kind of skater in [CITY].' CTAs 'Find your session' and 'Plan a party'. Info pills '[ADDRESS], [CITY]', 'Rentals from $5', 'First-timers welcome'. Photo caption 'A fictional rink, shown with generated venue photography'. Compact helper 'No outside skates with exposed metal parts. Helmets welcome.'
   Layout: Header mustard #F2B807/chocolate #32170E. Hero has 55% solid #E8590C text panel and 45% #F2B807 photo frame, both large visible first-screen blocks; #32170E H1 82px/0.98 Fredoka 700. hero-rink.webp arch-cropped 560×480 with disco-ball detail, underneath an avocado #546B24/chocolate wave. Mobile H1 50px then large photo, no face close-up.
   Motion: Single 450ms arrival; no bouncing text.
2. **Pick your roll** — Heading 'There is a session for your kind of good time.' Filters All / Family / Adults / Learn and weekday select All / Tuesday / Thursday / Friday / Saturday / Sunday. Data: Tuesday Learn to Roll 4–5 PM, 7+, $14 includes rentals, capacity-demo note; Thursday Easy Eight 6–8 PM, all ages, $12 + $5 rental; Friday Afterglow 8–11 PM, 18+, $18 + $5; Saturday Family Spin 11 AM–1 PM, all ages, $12 + $5; Saturday Groove Club 7–10 PM, 16+, $16 + $5; Sunday First Wheels 10–11 AM, 5–10 with adult, $14 includes rentals. A ticket is admission only unless noted; spectators $3. Results count, Reset filters, explicit no-result state. 'Choose session' selects it and scrolls reservation form, showing the carried choice. Show 'Recurring weekly sessions; this demo does not display live capacity.'
   Layout: Mustard #F2B807 background with #32170E labels; 3-column white #FFFDF5 ticket cards with ticket-notches and orange #E8590C bottom rule. Adult badge chocolate/white; filtered state never color alone. On mobile vertical cards, wrap filters.
   Motion: Immediate filtering; focus remains on triggering control.
3. **Find your rental fit** — 'Your wheels are waiting.' Youth Y8–Y13 and adult US 1–13 segmented selectors; selectable size buttons. Helper 'Rental sizes are a guide, not a live inventory check. Start with your usual sneaker size; our counter team helps with fit.' Youth/adult toggle resets incompatible size; selected size appears in planner. Controls 'Add $5 rentals' checkbox (disabled and explanatory if selected session includes rental). Note 'Socks required. Bring your own or add a $3 pair at the counter.' Adjacent story 'Learning is allowed to look wobbly' and 'Hold the rail, take a breath, and ask for a hand. Our floor hosts make space for beginners.'
   Layout: Avocado #546B24 band, white #FFFDF5 title, white content panel/chocolate text. rental-skates.webp 4:3 on left, selector right, secondary family-roll.webp small 220px photo below. 2-col desktop, stacked mobile. Orange #E8590C/chocolate selected sizes.
   Motion: Tap and keyboard select; no drag-only interaction.
4. **Make it a party** — Three packages: Little Wheels $180 for 8 guests, reserved booth 90 minutes, admission and rentals, two pizzas and water; Big Groove $280 for 12 guests, booth 2 hours, admission/rentals, three pizzas and two pitchers; Full Orbit $390 for 16 guests, booth 2 hours, admission/rentals, four pizzas, three pitchers and a floor-host welcome. Extra guests $18 each, max 24. All parties include rentals, no separate rental surcharge. CTAs 'Choose Little Wheels' etc populate form. Package does not promise exclusive rink use. 'Cake is welcome. Outside hot food stays at home.'
   Layout: Burnt orange #E8590C panel/chocolate #32170E copy. party-booth.webp wide banner above 3 mustard #F2B807 package cards, middle outlined chocolate. Mobile cards stack; prices 42px Fredoka.
   Motion: Selected package gets a check and border, not scale.
5. **Local visit planner** — Heading 'Put a little roll in your plans.' Mode Visit / Party. Fields name, email, selected recurring session, guest count 1–24, rental needed, rental size optional unless rentals selected, package only for Party, notes max 240 chars. Visit total = guest count × session admission + guest count × $5 rentals unless included. Party total = package base + max(0, guests-included) × $18; guest count minimum included and maximum 24. Display all arithmetic and age rule, require checkbox 'I have checked the age rules for my group'. Submit 'Preview my plan'. Validate inline, do not clear successful values; receipt lists session weekday/time, guests, rental size, package and total, and 'Local demo only. No booking, message, or payment was sent. This does not reserve a space.' Buttons Edit plan / Clear plan. No phone or real email destination.
   Layout: Chocolate #32170E section with white #FFFDF5 copy; mustard #F2B807 form title and white form field panels/chocolate body. 2-col form/summary with sticky summary only desktop, mobile in normal flow. 44px inputs, 3px borders and white focus ring on dark.
   Motion: Live totals in aria-live polite; error focus moves to first invalid input.
6. **Snack break and house notes** — 'One more lap, then a snack.' Menu: cheese slice $4 vegetarian; tomato pie slice $4 vegan; soft pretzel $5 vegetarian; orange float $6 dairy; lime fizz $4 vegan; water bottle $2. Menu category buttons Food / Drinks / All filter locally; no ordering controls. House notes accordion: 'Do I need to book?' — This demo cannot reserve places; operational site owners should connect their own system; 'Can beginners join?' — Yes, use Learn sessions or arrive early for a floor orientation; 'Can I bring my own skates?' — Clean indoor wheels and secure stops required; 'What should I wear?' — Comfortable clothes and socks, no loose trailing accessories. Address [ADDRESS], [CITY]. Counter hours Tue 3–7 PM, Thu 5–9 PM, Fri 6–11 PM, Sat 10 AM–10 PM, Sun 9 AM–3 PM. Footer [BRAND], local demo note, Back to top, no dates.
   Layout: Mustard #F2B807 and avocado #546B24 split with chocolate text on mustard and white on avocado. snack-counter.webp large left photo, price list on opaque white panel. Mobile stack; house rules use semantic details/summary.
   Motion: Accessible accordion and instant category switch.

## Assets
- font: Self-host Fredoka, DM Sans using the Fontsource packages listed in Stack; OFL-1.1, no external font requests.
- image: Download https://media.vibefather.ai/assets/f9ea4954-55d7-4e17-a65a-fbd2a7691a35/hero-rink.webp to public/images/hero-rink.webp and reference only the local relative URL. Alt: Wide wooden roller rink with warm striped walls. Used in hero. Generated by VibeFather with qwen-image-3.0-pro, redistributable with this template. Record URL, path, alt, generator and this permission in ASSETS.md. The asset is supplied after generation/upload; fail clearly if it cannot download, never replace it with unrelated stock or a broken placeholder.
- image: Download https://media.vibefather.ai/assets/f9ea4954-55d7-4e17-a65a-fbd2a7691a35/rental-skates.webp to public/images/rental-skates.webp and reference only the local relative URL. Alt: Caramel quad skates ready at the rental counter. Used in rental fit. Generated by VibeFather with qwen-image-3.0-pro, redistributable with this template. Record URL, path, alt, generator and this permission in ASSETS.md. The asset is supplied after generation/upload; fail clearly if it cannot download, never replace it with unrelated stock or a broken placeholder.
- image: Download https://media.vibefather.ai/assets/f9ea4954-55d7-4e17-a65a-fbd2a7691a35/party-booth.webp to public/images/party-booth.webp and reference only the local relative URL. Alt: Orange and avocado party booth beside the rink. Used in parties. Generated by VibeFather with qwen-image-3.0-pro, redistributable with this template. Record URL, path, alt, generator and this permission in ASSETS.md. The asset is supplied after generation/upload; fail clearly if it cannot download, never replace it with unrelated stock or a broken placeholder.
- image: Download https://media.vibefather.ai/assets/f9ea4954-55d7-4e17-a65a-fbd2a7691a35/snack-counter.webp to public/images/snack-counter.webp and reference only the local relative URL. Alt: Pizza, pretzel and sodas at a warm snack counter. Used in snack bar. Generated by VibeFather with qwen-image-3.0-pro, redistributable with this template. Record URL, path, alt, generator and this permission in ASSETS.md. The asset is supplied after generation/upload; fail clearly if it cannot download, never replace it with unrelated stock or a broken placeholder.
- image: Download https://media.vibefather.ai/assets/f9ea4954-55d7-4e17-a65a-fbd2a7691a35/family-roll.webp to public/images/family-roll.webp and reference only the local relative URL. Alt: Skaters of different sizes rolling together from behind. Used in beginner welcome. Generated by VibeFather with qwen-image-3.0-pro, redistributable with this template. Record URL, path, alt, generator and this permission in ASSETS.md. The asset is supplied after generation/upload; fail clearly if it cannot download, never replace it with unrelated stock or a broken placeholder.
- image: Draw original groovy wave dividers and a small disco-ball ornament in inline SVG using orange #E8590C/mustard #F2B807/chocolate #32170E/avocado #546B24; original project artwork, no external logo.

## Don'ts
- Build a static-only demo: no backend, API routes, databases, authentication, payments, third-party APIs, analytics, telemetry, or forms that send network requests. Confirmations must explicitly say local demo; never claim an order, booking, generated service result, or email was sent.
- Use Vite base ./, relative local assets, hash routes or real .html filenames; no bare-directory links. Direct-open every route and ensure any detail route without an ID renders its first item. Build minified dist/ with npm run build, no source maps or source files, total dist under 20 MB.
- Keep all editable copy, fictional sample data, prices, interaction labels, alt text and A/B content in a single src/content.ts module. Keep 3–6 variables. When variables change, rewrite all related content consistently; never leave the default brand or subject in the second case.
- All visible language and alt text use US English. Do not render calendar dates, years, dated copyright lines, fake freshness or popularity metrics. Operational weekdays and times, track durations, relative timers, issue identifiers and dimensions are permitted.
- Use only original code/art/copy, permissive MIT/ISC/BSD/Apache/CC0 dependencies and locally bundled OFL fonts. No copied site code, existing logos, famous characters, commercial fonts, restricted components or recognizable real-person likeness. List every font, dependency and generated artwork in ASSETS.md with source and license.
- Everything is local at runtime: no hotlinked pictures, font CDNs, remote scripts, remote music or placeholder-image services. Download exactly the specified template-hosted images before build; record full source URL, target path, alt text and generated credit in ASSETS.md.
- At 1440×900 and 390×844 keep zero console errors and no horizontal overflow. Touch targets at least 44px, visible keyboard focus and labeled inputs, Escape/outside close and focus restore for dialogs, drawer focus trap, scroll lock and aria-live for result changes. Hover effects need equivalent focus/tap paths.
- Respect prefers-reduced-motion: remove looping transforms, scroll scrub and parallax, show final static states, never autoplay audio/video, no flashing, strobe or rapid full-screen luminance changes. Do not hide essential content pending animation.
- Preserve the assigned palette with at least two strong hero colors occupying large areas. No neutral cream/charcoal fallback, no gradients behind normal text, no low-contrast small labels. Use the calculated AA text/background pairs in Design.
- Do not show calendar dates, event years, sold-out counts or claimed live availability. Schedule is recurring weekday/time only. Rental sizing is illustrative and must not claim stock. Party/visit previews never reserve, email, charge or send a network request.
- Do not omit or replace the supplied five realistic photographs. Do not use faces, branded skates, visible signage, copied roller-rink identity, vintage posters or copyrighted music. AI venue/legs are fictional and locally bundled; this permission agrees with imagery/assets.
- For Orbit Rollhouse rewrite session names and weekdays, all descriptive copy, package names and prices, snack names and staff-free story around Juniper Bay. Retain roller-rink setting, photo set, pricing formulas, exact palette and section structure; no leftover Rollerloop or Cedar Quay.

---
— Prompt by VibeFather · https://vibefather.ai/t/retro-roller-rink-website · CC BY-NC 4.0 (non-commercial; commercial use needs a VibeFather Pro license) · Request removal: https://vibefather.ai/takedown
