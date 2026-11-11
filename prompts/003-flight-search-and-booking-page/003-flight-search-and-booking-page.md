Build a polished, conversion-optimized flight search results and booking page for a travel platform called "FlyFair" — a flight comparison site that aggregates fares from multiple airlines. The page shows results for a round-trip search from New York (JFK) to Tokyo (NRT), departing April 15 and returning April 29, 2026, for 2 adults. The design should feel fast, trustworthy, and data-dense without overwhelming the user.

1. NAVIGATION BAR
- Logo: "FlyFair" in bold sans-serif, navy blue (#1E3A5F), with a minimal paper-airplane icon
- Links: Flights, Hotels, Car Rental, Packages, Travel Guides
- Right side: currency dropdown (USD), "My Trips" link, user avatar or "Sign In" button
- White background, thin bottom border (#E2E8F0), sticky on scroll
- Mobile: logo + hamburger + "My Trips" icon

2. SEARCH MODIFICATION BAR (sticky below nav)
- Compact horizontal bar on light gray (#F8FAFC) background
- Fields inline: From (JFK - New York) | To (NRT - Tokyo Narita) | Depart (Apr 15) | Return (Apr 29) | Travelers (2 Adults) | Class (Economy)
- Swap origin/destination button between From and To fields
- "Search" CTA button on right (solid #2563EB blue-600, white text)
- Trip type tabs above: Round Trip (active), One Way, Multi-City
- Each field: white input box, icon prefix, click to open dropdown/calendar
- Mobile: collapsed to "JFK → NRT · Apr 15-29 · 2 Adults" summary bar with "Modify" button that expands full search form

3. RESULTS SUMMARY BAR
- Left: "247 flights found · JFK → NRT · Round trip · Apr 15 – Apr 29"
- Right: Sort dropdown — "Best" (default), "Cheapest", "Fastest", "Earliest Departure", "Latest Departure"
- "Best" combines price and duration factors with a small info tooltip explaining the ranking

4. FILTER SIDEBAR (left column, 280px)
- Price Range: dual-handle slider $650–$4,200, with histogram showing fare distribution
- Stops: checkboxes — Nonstop (3 results), 1 Stop (89 results), 2+ Stops (155 results), result count in gray
- Airlines: checkboxes with airline logos (24px):
  - All Nippon Airways (ANA) — 42 results
  - Japan Airlines (JAL) — 38 results
  - Delta Air Lines — 35 results
  - United Airlines — 31 results
  - American Airlines — 28 results
  - Korean Air — 22 results
  - Others (show more expand)
- Departure Time: 4-slot grid buttons — Morning (6AM-12PM), Afternoon (12PM-6PM), Evening (6PM-12AM), Red-Eye (12AM-6AM)
- Arrival Time: same 4-slot grid
- Duration: slider 13h–36h
- Layover Airport: multi-select (LAX, SFO, ORD, ICN, etc.)
- Alliance: checkboxes — Star Alliance, SkyTeam, Oneworld
- "Reset All Filters" text link at bottom
- Mobile: filters collapse into a "Filters" button that opens a bottom sheet modal with all options

5. FLIGHT RESULT CARDS (main content area)
- Each card: white background, 12px border-radius, 1px #E2E8F0 border, 16px padding
- Card layout (single row, left to right):

  A. AIRLINE INFO (120px):
  - Airline logo (40px)
  - Airline name: "ANA" (bold)
  - Flight number: "NH 9" (gray, small)

  B. OUTBOUND FLIGHT (flex, largest section):
  - Departure: "10:55 AM" (large, bold) · "JFK" (gray)
  - Arrow/line with duration: "14h 10m" and stop info (e.g., "Nonstop" in green or "1 stop · LAX" with dot indicator)
  - Arrival: "2:05 PM+1" (large, bold) · "NRT" (gray), +1 day indicator in orange
  - Below: "Boeing 777-300ER · Economy" in small gray

  C. RETURN FLIGHT (same layout):
  - Departure: "5:30 PM" · "NRT"
  - Arrow line: "12h 45m · Nonstop"
  - Arrival: "4:15 PM" · "JFK" (same day)

  D. PRICE & CTA (right-aligned, 160px):
  - Price: "$892" (large, bold, #1E3A5F navy)
  - Per person label: "/person" (small gray)
  - Total: "$1,784 total" (small)
  - "Select" button (solid #2563EB, white text, full width, 8px radius)
  - Below button: "Price lock available" green text link (optional badge)

- CARD VARIATIONS:
  - "Best Value" badge (amber #F59E0B outline) on top card
  - "Cheapest" badge (green #10B981 outline) on lowest-price card
  - "Fastest" badge (blue #3B82F6 outline) on shortest-duration card
  - Hover: subtle shadow increase, slight lift transform

- EXPANDED CARD (click to expand any card):
  - Full leg-by-leg breakdown with timeline visual:
    - Departure gate, terminal info
    - In-flight amenities: WiFi, meal service, entertainment, power outlet icons
    - Seat pitch: "31 inches" | Seat width: "17.2 inches"
    - Aircraft type and age
  - Layover details (if connecting): layover city, duration, terminal change indicator
  - Fare class options (3 columns):
    - Basic Economy ($892): no seat selection, no changes, 1 personal item
    - Economy ($958): seat selection included, $200 change fee, 1 carry-on + 1 checked bag
    - Premium Economy ($1,340): extra legroom, free changes, 2 checked bags, priority boarding
  - Baggage policy summary with weight limits
  - "Select This Fare" CTA for each fare class

6. SPONSORED RESULT (after 3rd result)
- Slightly different card: very subtle blue-tinted background (#F0F7FF)
- "Sponsored" label (small, gray, top-right)
- Airline-specific upsell: "Fly ANA Premium Economy — Extra legroom, lounge access, 2 bags included. From $1,190/person"
- "View Deal" button

7. PRICE CALENDAR WIDGET (collapsible section above results)
- Headline: "Flexible dates? See the cheapest fares"
- 7-day horizontal bar chart centered on selected date:
  - Apr 12: $945, Apr 13: $892, Apr 14: $1,102, **Apr 15: $892** (highlighted, selected), Apr 16: $934, Apr 17: $1,245, Apr 18: $876
- Cheapest date highlighted in green
- "Show full month view" expands to calendar grid with prices in each cell
- Green/amber/red color coding for cheap/mid/expensive

8. TRUST & INFO BAR (after first few results)
- Horizontal banner: light green background (#F0FDF4)
- "✓ No hidden fees · ✓ Price match guarantee · ✓ Free cancellation within 24 hours · ✓ 24/7 support"
- Small FlyFair logo

9. PAGINATION & LOAD MORE
- "Show 20 more flights" button (outline style) after initial 10 results
- Infinite scroll option with loading skeleton cards
- Bottom summary: "Showing 10 of 247 flights"

10. SIDEBAR WIDGETS (below filters)
- "Price Alert" widget: "Get notified when prices drop for JFK → NRT" — email input + "Set Alert" button
- "Similar Routes" links: JFK→HND, EWR→NRT, JFK→KIX
- "FlyFair Tip" card: "Booking 3-6 weeks in advance typically saves 15-25% on transpacific flights"

11. FOOTER
- 4 columns on #F8FAFC background:
  - Explore: Top Destinations, Flight Deals, Airline Reviews, Airport Guides
  - Company: About FlyFair, How We Rank, Press, Careers
  - Support: Help Center, Contact, Refund Policy, Accessibility
  - Legal: Privacy Policy, Terms of Service, Cookie Settings
- Trust badges: Norton Secured, IATA member, BBB A+ rating
- "© 2026 FlyFair Inc. All rights reserved."

Design: Data-dense but breathable. Primary: #2563EB (blue-600 for CTAs and interactive elements), secondary: #1E3A5F (navy for headings and prices), accent: #F59E0B (amber for badges and deals). Success green: #10B981 for nonstop/savings indicators. Backgrounds: white for cards, #F8FAFC for page background. Typography: Inter for all text — weights 400 (body), 500 (labels), 600 (prices, CTAs), 700 (headings). Cards with 12px border-radius, subtle 1px borders, hover shadows. Flight route lines rendered as SVG or CSS with airplane icon midway. Time displayed in departure city local timezone with arrival timezone noted.

Responsive: Mobile-first. Search bar collapses to summary strip. Filter sidebar becomes bottom sheet modal triggered by "Filters" floating button. Flight cards stack vertically — airline info on top, outbound and return legs stacked, price/CTA at bottom full-width. Price calendar becomes horizontal scroll. Expanded fare comparison becomes vertical cards. All touch targets 44px minimum. Sticky bottom bar on mobile showing "247 flights from $876" with "Sort" and "Filter" action buttons.