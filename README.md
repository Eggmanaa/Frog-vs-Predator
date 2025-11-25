# Frog Versus Predator - 3D Tabletop Simulation

A fully interactive 3D recreation of the "Frog Versus Predator" board game built with Three.js. This tabletop simulator allows you to pick up and move game pieces just like playing with a physical board game.

## 🎮 Live Demo

**Production**: https://frogsvspredators.pages.dev

## ✨ Features

### Completed Features
- **Accurate Board Recreation**: 5 concentric hexagonal rings with proper terrain types
  - Deep water (dark blue) at center
  - Medium water (blue) in ring 1
  - Light water/green mix in ring 2
  - Various green and dirt tiles in rings 3-4
  - Orange/coral and green border tiles in ring 5
  
- **Game Pieces**: All pieces are draggable 3D models
  - 🐸 Frogs in 4 colors (green, yellow, purple, orange)
  - 🐟 Fish pieces
  - 🐦 Herons (wading birds)
  - 🐍 Snakes
  - 🌳 Trees with seasonal foliage (green, orange, red, bare)
  - ☀️ Sun token
  - ☁️ Cloud tokens
  - 🌧️ Rain cloud with droplets

- **Tile Icons**: Silhouette icons on tiles showing:
  - Frogs, snakes, herons, fish
  - Bugs, mosquitoes, dragonflies
  - Deer, foxes

- **Tabletop Controls**:
  - Click & drag pieces to move them
  - Right-click + drag to rotate the view
  - Scroll wheel to zoom in/out
  - Touch support for mobile devices

- **Smooth Animations**:
  - Hop up animation when picking up pieces
  - Float animation while dragging
  - Bounce landing animation when dropping
  - Hex highlighting when hovering over valid placement

## 🕹️ Controls

| Action | Desktop | Mobile |
|--------|---------|--------|
| Pick up piece | Left click + drag | Tap + drag |
| Rotate view | Right click + drag | Two-finger drag |
| Zoom | Scroll wheel | Pinch |
| Reset view | Click "Reset View" button | Tap button |

## 🛠️ Technology Stack

- **Three.js** - 3D rendering engine
- **ES Modules** - Modern JavaScript modules via ESM.sh
- **Cloudflare Pages** - Edge deployment

## 📁 Project Structure

```
webapp/
├── index.html          # Main HTML entry point
├── style.css           # UI styles and animations
├── src/
│   ├── main.js         # Entry point, scene setup
│   ├── config.js       # Game configuration, board layout
│   ├── board.js        # Hexagonal board generation
│   ├── pieces.js       # 3D game piece models
│   ├── environment.js  # Lighting, camera, table
│   ├── interaction.js  # Drag & drop system
│   ├── animations.js   # Movement animations
│   └── utils.js        # Hex math utilities
└── ecosystem.config.cjs # PM2 config for local dev
```

## 🚀 Development

### Local Development
```bash
# Start local server
npm install -g serve
serve -l 3000 .

# Or with PM2
pm2 start ecosystem.config.cjs
```

### Deploy to Cloudflare Pages
```bash
npx wrangler pages deploy . --project-name frogsvspredators
```

## 📊 Data Architecture

- **Board Layout**: Hexagonal grid using axial coordinates (q, r)
- **Terrain Types**: 8 terrain types with unique colors and heights
- **Pieces**: Stored in scene with userData for position tracking

## 🎯 User Guide

1. **Moving Pieces**: Click on any game piece and drag it to a new hex tile
2. **Valid Placements**: Hexes highlight yellow when you can drop a piece
3. **Rotating View**: Right-click and drag to rotate around the board
4. **Zooming**: Use scroll wheel to get closer or further from the board
5. **Reset**: Click "Reset View" to return to default camera position

## 📝 Deployment Status

- **Platform**: Cloudflare Pages
- **Status**: ✅ Active
- **Last Updated**: November 25, 2025

## 🔗 Links

- **Production**: https://frogsvspredators.pages.dev
- **GitHub**: https://github.com/Eggmanaa/Frog-vs-Predator

## 📜 License

MIT License - Feel free to use and modify for your own projects!
