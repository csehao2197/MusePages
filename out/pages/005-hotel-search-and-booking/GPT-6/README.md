# StayFinder

Original: `data\prompts\005-hotel-search-and-booking\005-hotel-search-and-booking.md`; combined with root `DESIGN.md`. Directly authored by GPT-6 using actual model **gpt-6.1-sol**. Plain HTML/CSS/JavaScript with no backend, build or runtime dependencies.

Source is `index.html` plus `assets\`. Delivery is `out\index.html`, `out\assets\`, and the actual rendered `out\preview.png` (1200 × 900). The repository preview workflow serves it temporarily over loopback HTTP. Future publication target: `deploy\dist\pages\hotel-search-and-booking\GPT-6\`. Registration is disabled; not deployed. No environment variables or installation.

## Features

Editable search with native date pickers and guest steppers; four complete hotel fixtures; price/stars/rating/type/neighborhood/amenity filters; removable active chips; sorting; list/grid layouts; four-photo card carousels; session-only saves and recently viewed stays; detailed room/gallery/review dialog with room selection and total; occupancy-aware demo reservation; interactive schematic map with markers, zoom and terrain styling; responsive filter sheet and mobile navigation.

## Validation

`checks.mjs` exercises filters/chips, sorting, layouts, photo navigation, saves, room selection/reservation, recently viewed entries, map controls, changed-night totals and invalid dates. The session runner validates the export at the intended public subpath, captures actual desktop/mobile screenshots, checks overflow/navigation and records browser errors under `.checks\`. Actual statuses are maintained in model metadata.

## Mock data and limitations

All properties are illustrative fixtures based on the prompt, not verified current listings. Photographs are generic room/travel inspiration, not images of the named hotels. Room types, ratings, amenities, prices, taxes, dated cancellation claims, addresses, scarcity, reviews and payment/trust claims are explicitly mock. No actual room, payment, account, inventory search or provider contact service is connected.

The headline 245 and filter counts illustrate a larger catalog. Only four local sample listings exist; the more-stays action explains this instead of inventing pages of inventory. The map is an original SVG area diagram, not geographic data or satellite imagery; it cannot navigate or search live areas. Every marker interaction works with local sample data.

Prices are per room/night, multiplied by nights and rooms. Capsule capacity is one adult per capsule; other room fixtures support two guests each, with a demo warning when insufficient rooms are selected. Child pricing and property-specific occupancy rules are not modeled. Price slider starts at zero rather than the prompt's $50 so its $38 capsule example remains visible. Currency display uses fixed illustrative EUR 0.92 / GBP 0.79 per USD.

Only Tokyo is supported; other destinations show an honest limitation message. Date ranges are limited to 60 nights. Forms send no data; session state is not persisted across reloads. Offline Arial replaces Inter to keep assets self-contained.

Local photo sources: Unsplash CDN `photo-1611892440504-42a792e24d32`, `photo-1566665797739-1674de7a421a`, `photo-1618773928121-c32242e63f39`, `photo-1578683010236-d716f9a3f461`, `photo-1571896349842-33c89424de2d`, `photo-1540959733332-eab4deabeeaf`. Individual author/license pages remain to be verified before commercial redistribution; no additional rights are granted. Lucide SVG symbols were generated from the existing repository package; ISC license is included in `assets\LUCIDE-LICENSE.txt`.
