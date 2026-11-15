# Bella Cucina

Input `data\prompts\210-restaurant-homepage\210-restaurant-homepage.md` plus `src\workflows\AI Agent\DESIGN.md`. Actual model `gpt-6.1-sol`; label `GPT-6`. HTML/CSS/JS source here; static homepage/resources in `out\`.

Burgundy/cream Italian restaurant, local Playfair Display/Lato fonts, photographic hero, chef story, signature dishes, dinner/dessert/wine dialog, keyboard gallery, validated date/name reservation preview, newsletter preview, location diagram and external Google Maps link. Offline diagram replaces a network-dependent map iframe. All restaurant, review and verification content is fictional; forms transmit nothing and make no booking/subscription. No backend/environment variables.

Unsplash photos: pasta 1551183053-bf91a1d81141, chef 1577219491135-ce391730fb2c, bar 1514933651103-005eec06c04b; interior/pizza/salmon reused from adjacent generated sources with their Unsplash attribution. Images illustrate the concept. Google Fonts Playfair Display and Lato use included OFL licenses.

Serve `out\` with a static HTTP server. QA from root: `node out\pages\210-restaurant-homepage\GPT-6\verify.mjs`; evidence in `.checks\`. Public path `pages/restaurant-homepage/GPT-6/index.html`. No builds, installs or publication.
