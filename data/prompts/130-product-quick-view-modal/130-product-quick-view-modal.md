Create a product quick view modal:

1. MODAL STRUCTURE
- Overlay background (dark, semi-transparent)
- Centered modal (max-width: 900px)
- Close button (X in top right)
- Click outside to close
- Escape key to close

2. MODAL LAYOUT (two columns)
Left side (50%):
- Product image gallery
- Main image
- Thumbnail strip below
- Click thumbnail to change main
- Zoom not necessary in quick view

Right side (50%):
- Product information
- Add to cart functionality

3. PRODUCT INFORMATION
- Product title
- Brand (linked)
- Rating (stars + review count)
- Price (with sale price if applicable)
- Short description (2-3 lines max)
- Color options (swatches)
- Size options (buttons)
- Quantity selector
- "Add to Cart" button (full width)
- "View Full Details" link

4. ADDITIONAL INFO
- Stock status
- Estimated shipping
- Return policy (one line)

5. MOBILE BEHAVIOR
Option A: Full-screen bottom sheet
- Slides up from bottom
- Swipe down to close
- Scrollable content

Option B: Full-page takeover
- Close button top left
- Product image top
- Info below

6. ANIMATIONS
- Fade in overlay
- Scale up modal
- Smooth transitions

7. FUNCTIONALITY
- Add to cart without closing
- Success feedback: "Added to cart!"
- Continue shopping or view cart option
- Update cart icon count

8. LOADING STATE
- Skeleton loader while fetching
- Image placeholder
- Text placeholders

Design: Fast, lightweight. Essential info only. Full details on PDP. Focus on conversion.
