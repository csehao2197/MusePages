Create a portfolio for a 3D artist/animator:

1. HERO SECTION
- Full-screen 3D render or animation loop
- Name and title overlay
- "Explore Work" CTA
- Reel/showreel play button
- Dark theme to make renders pop

2. SHOWREEL MODAL
- Video player (Vimeo/YouTube embed)
- Autoplay on open
- List of projects featured
- Close button

3. WORK CATEGORIES
- All Work
- Character Design
- Environment Art
- Product Visualization
- Motion Graphics
- Personal Projects

4. PROJECT GRID
Each item:
- Hero render/thumbnail (GIF preview on hover)
- Project title
- Category
- Click to open project

5. PROJECT PAGE TEMPLATE
Layout:
- Hero image/video
- Project title and year
- Client (if commercial)
- Software used (icons: Blender, Maya, C4D, etc.)
- Role: Modeling, Texturing, Lighting, Animation

Content sections:
- Project overview
- Concept/Reference (mood boards)
- Work in progress shots
  - Wireframe renders
  - Clay renders
  - Lighting tests
- Final renders gallery (multiple angles)
- Turntable video (for characters/products)
- Breakdown video (if available)

6. ABOUT PAGE
- Artist photo or avatar
- Bio and background
- Software proficiency
- Hardware specs (3D artists care about this)
- Process overview
- Currently learning/exploring
- Available for: Freelance / Full-time / Collaborations

7. RESOURCES/TUTORIALS (optional)
- Free 3D models
- Tutorial links
- Blog posts about techniques
- Builds community and backlinks

8. CONTACT
- Email for inquiries
- Social links (ArtStation, Behance, Instagram)
- Discord for community
- Commission status
- Rate sheet download (optional)

Design: Dark theme works best for 3D work. Allow renders to load in high quality. Consider WebGL interactive elements for homepage.


THREE.JS VARIANT
Start with an accessible static portfolio. Add a Three.js GLB viewer only after the visitor selects View in 3D. Use an approved, compressed model, limit texture resolution and pixel ratio, pause rendering off-screen, and dispose of geometry, materials and event listeners on teardown. Keep a labeled poster image and project description visible if the viewer cannot load. Support keyboard controls and a reset-camera button.

WEBGL VARIANT
Detect WebGL support and context loss before initializing the canvas. Offer the same project as still images and video with controls. Disable automatic camera movement for prefers-reduced-motion, avoid scroll hijacking, and do not make navigation depend on a canvas. Document asset budgets and test on a low-powered mobile device.

HOW TO USE WITH CLAUDE / CLAUDE CODE
In Claude, attach your approved renders and explain the project, your role and audience. Ask for the static gallery before the interactive version. In Claude Code, inspect repository instructions and existing dependencies, implement the static fallback first, then progressively add the viewer. Run the build, test keyboard and touch input, and simulate unavailable WebGL and a missing model. Never invent production credits or use third-party models without permission.
