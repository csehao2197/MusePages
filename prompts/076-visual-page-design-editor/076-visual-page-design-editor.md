# Framer Clone Product Requirements Document (PRD)

## Overview
This project is a simplified clone of the design tool **Framer** built with Next.js, React, Tailwind CSS, and Recoil for state management. The application enables users to create and manipulate frames on a canvas, adjust properties, and view layers. The goal is to provide a minimal yet extendable design playground in the browser.

## Objectives
- Provide a canvas where users can add, move, rotate, and align frames.
- Offer a properties panel allowing modification of frame attributes such as fill color, opacity, rotation, and position.
- Display a layer panel for managing the list of frames.
- Support basic panning and zooming of the canvas using mouse and keyboard controls.

## Features
### Canvas
- **Panning and Zooming**: Users can pan the canvas while holding the space bar and scroll to zoom. Implementation in `components/canvas.js` shows adjustable offset and zoom level when dragging and scrolling.
- **Frame Rendering**: Frames added to the `canvasStore` are rendered inside the canvas via the `Frame` component.

### Frame
- **Draggable and Rotatable**: Frames are draggable and rotatable using the `react-moveable` library as defined in `components/frame.js`.
- **Transform Properties**: Each frame maintains `translateX`, `translateY`, and `rotate` values in Recoil state.

### Property Panel
- **Alignment Tools**: Buttons to align and distribute elements (see `components/alignment.js`).
- **Color Picker**: Allows setting background color of the selected frame (see `components/colorPicker.js`).
- **Opacity Control**: Slider and number input to modify opacity (see `components/opacity.js`).
- **Rotation Control**: Number input to change rotation (see `components/rotation.js`).
- **Position Inputs**: Inputs to adjust X and Y translation (see `components/position.js`).
- **Add Frame**: Button that calls `useAddFrame` to append a new frame to the canvas (see `store/hooks.js`).

### Layer Panel
- Displays a list of frames present on the canvas. Updates whenever frames are added (see `components/layerPanel.js`).

## Non‑Goals
- Advanced prototyping features such as animations, transitions, or component states.
- Real-time collaboration or cloud storage.
- Exporting designs to production-ready code.

## Milestones
1. **MVP** – Current functionality: canvas with panning/zooming, ability to draw frames, property and layer panels working with Recoil state.
2. **Enhanced Editing** – Additional property controls (e.g., borders, corner radius), multiple selection, and improved alignment behavior.
3. **User Experience** – Keyboard shortcuts, undo/redo history, and improved styling.
4. **Persistence** – Save and load projects via local storage or external database.

## Future Considerations
- Integration with a design system for reusable components.
- Collaboration features to allow multiple users to work on the same project.
- Export options (e.g., PNG/SVG) and possibly code generation for React components.

