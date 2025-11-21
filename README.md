# Frog vs Predator 3D

A fully interactive 3D board game recreation with a clay/plastic toy aesthetic, built with Three.js.

![Game Screenshot](docs/game_screenshot.png)

## 🎮 Play the Game

Simply open `index.html` in a modern web browser (Chrome, Firefox, Safari, or Edge).

**Requirements:**
- Modern browser with WebGL support
- Internet connection (for Three.js CDN on first load)

## 🎯 Features

- **3D Hexagonal Board** - Accurate recreation with multiple terrain types
- **Clay/Plastic Aesthetic** - Soft shadows, rounded edges, toy-like materials
- **Interactive Pieces** - Drag and drop frogs, fish, foxes, and birds
- **Smooth Animations** - Hop up, float, and bounce down effects
- **Isometric Camera** - Orbit controls for rotation and zoom
- **Decorative Environment** - Sun, clouds, trees, and wooden table

## 🕹️ How to Play

1. **Select a piece** - Click on any frog, fish, fox, or bird
2. **Move it** - Drag to any hex on the board
3. **Release** - Piece will bounce into place
4. **Rotate view** - Right-click + drag to orbit camera
5. **Zoom** - Scroll to zoom in/out
6. **Reset** - Click "Reset Camera" to return to default view

## 🛠️ Technology Stack

- **Three.js r168** - 3D graphics library
- **Vanilla JavaScript** - ES Modules
- **WebGL** - Hardware-accelerated rendering
- **OrbitControls** - Camera manipulation

## 📁 Project Structure

```
├── index.html              # Entry point
├── style.css              # Styling
└── src/
    ├── main.js            # Scene orchestration
    ├── config.js          # Game constants & board layout
    ├── utils.js           # Hexagon math utilities
    ├── board.js           # Hex grid generation
    ├── pieces.js          # 3D piece models
    ├── animations.js      # Movement animations
    ├── interaction.js     # Drag-and-drop system
    └── environment.js     # Camera, lighting, decorations
```

## 🎨 Aesthetic Details

The game features a toy-like aesthetic inspired by clay and plastic board games:

- **Soft Shadows** - PCFSoftShadowMap for realistic toy appearance
- **Rounded Geometry** - Beveled edges on all hexagons
- **Material Variety** - Glossy water, matte grass, rough clay rocks
- **Smooth Animations** - 60fps with elastic easing and bounce effects

## 🚀 Development

No build process required! The project uses ES Modules loaded directly in the browser.

To modify the game:
1. Edit files in the `src/` directory
2. Refresh your browser to see changes
3. Check browser console for any errors

### Key Configuration

Edit `src/config.js` to modify:
- Board layout (hex terrain types)
- Initial piece positions
- Animation timings
- Terrain colors and heights

## 📝 License

MIT License - Feel free to use and modify!

## 🎉 Credits

Created as a 3D recreation of the Frog Versus Predator board game.

Built with ❤️ using Three.js
