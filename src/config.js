// Game configuration and constants - Frog Versus Predator
// Exact recreation of the physical board game

export const HEX_RADIUS = 28;
export const HEX_HEIGHT = 6;

// Terrain types matching the board
export const TERRAIN_TYPES = {
    WATER_DEEP: 'WATER_DEEP',      // Dark blue center
    WATER_MED: 'WATER_MED',        // Medium blue
    WATER_LIGHT: 'WATER_LIGHT',    // Light blue
    GRASS_DARK: 'GRASS_DARK',      // Dark green
    GRASS_MED: 'GRASS_MED',        // Medium green  
    GRASS_LIGHT: 'GRASS_LIGHT',    // Light sage green
    DIRT: 'DIRT',                   // Brown/tan
    ORANGE: 'ORANGE'               // Orange/coral
};

// Colors extracted from the image
export const TERRAIN_COLORS = {
    WATER_DEEP: 0x2874A6,
    WATER_MED: 0x5DADE2,
    WATER_LIGHT: 0x85C1E9,
    GRASS_DARK: 0x1E8449,
    GRASS_MED: 0x27AE60,
    GRASS_LIGHT: 0x82B693,
    DIRT: 0xB8956C,
    ORANGE: 0xD68910,
    BASE: 0xF5F5F5  // Light gray board base
};

// Terrain heights (for 3D effect)
export const TERRAIN_HEIGHTS = {
    WATER_DEEP: 2,
    WATER_MED: 3,
    WATER_LIGHT: 4,
    GRASS_DARK: 6,
    GRASS_MED: 6,
    GRASS_LIGHT: 5,
    DIRT: 5,
    ORANGE: 7,
    BASE: 0
};

// Icon types that appear on tiles
export const ICON_TYPES = {
    FROG: 'frog',
    SNAKE: 'snake',
    HERON: 'heron',
    FISH: 'fish',
    BUG: 'bug',
    MOSQUITO: 'mosquito',
    DRAGONFLY: 'dragonfly',
    DEER: 'deer',
    FOX: 'fox',
    NONE: 'none'
};

// Piece types
export const PIECE_TYPES = {
    FROG: 'frog',
    HERON: 'heron',
    FISH: 'fish',
    SNAKE: 'snake',
    TREE: 'tree',
    SUN: 'sun',
    CLOUD: 'cloud',
    RAIN: 'rain'
};

// Frog colors matching the board
export const FROG_COLORS = {
    GREEN: 0x2ECC71,
    YELLOW: 0xF4D03F,
    PURPLE: 0x8E44AD,
    ORANGE: 0xE67E22
};

// Board layout - using offset coordinates for pointy-top hexagons
// The board has 5 concentric rings forming a hexagonal shape
// Ring 0 = center, Ring 1 = 6 hexes, Ring 2 = 12 hexes, etc.

// Generate hexagonal board with proper rings
function generateHexBoard() {
    const hexes = [];
    const boardRadius = 5; // 5 rings from center
    
    for (let q = -boardRadius; q <= boardRadius; q++) {
        const r1 = Math.max(-boardRadius, -q - boardRadius);
        const r2 = Math.min(boardRadius, -q + boardRadius);
        for (let r = r1; r <= r2; r++) {
            const distance = Math.max(Math.abs(q), Math.abs(r), Math.abs(-q-r));
            hexes.push({ q, r, distance });
        }
    }
    return hexes;
}

// Assign terrain types based on ring distance and position
function assignTerrain(q, r, distance) {
    // Center - deep water
    if (distance === 0) return { type: TERRAIN_TYPES.WATER_DEEP, icon: ICON_TYPES.NONE };
    
    // Ring 1 - medium blue water with fish/heron icons
    if (distance === 1) {
        const icons = [ICON_TYPES.FISH, ICON_TYPES.HERON, ICON_TYPES.FISH, ICON_TYPES.HERON, ICON_TYPES.FISH, ICON_TYPES.HERON];
        const index = ((q + 10) * 7 + (r + 10) * 3) % icons.length;
        return { type: TERRAIN_TYPES.WATER_MED, icon: icons[index] };
    }
    
    // Ring 2 - light blue/green mix
    if (distance === 2) {
        const mixTypes = [TERRAIN_TYPES.WATER_LIGHT, TERRAIN_TYPES.GRASS_DARK];
        const icons = [ICON_TYPES.FROG, ICON_TYPES.SNAKE, ICON_TYPES.DRAGONFLY, ICON_TYPES.FISH];
        const typeIndex = ((q + r) % 2 === 0) ? 0 : 1;
        const iconIndex = Math.abs((q * 3 + r * 5)) % icons.length;
        return { type: mixTypes[typeIndex], icon: icons[iconIndex] };
    }
    
    // Ring 3 - green and some dirt
    if (distance === 3) {
        const types = [TERRAIN_TYPES.GRASS_MED, TERRAIN_TYPES.GRASS_LIGHT, TERRAIN_TYPES.DIRT];
        const icons = [ICON_TYPES.FROG, ICON_TYPES.SNAKE, ICON_TYPES.BUG, ICON_TYPES.MOSQUITO, ICON_TYPES.DRAGONFLY];
        const typeIndex = Math.abs(q + r * 2) % types.length;
        const iconIndex = Math.abs(q * 5 + r * 3) % icons.length;
        return { type: types[typeIndex], icon: icons[iconIndex] };
    }
    
    // Ring 4 - mostly green and orange at corners
    if (distance === 4) {
        // Orange at the pointed ends of the hex board
        const isCorner = (Math.abs(q) === 4 && r === 0) || (q === 0 && Math.abs(r) === 4) || (Math.abs(q + r) === 4 && (q === 0 || r === 0));
        const isNearCorner = Math.abs(q) === boardRadius - 1 || Math.abs(r) === boardRadius - 1;
        
        if (Math.abs(q) === 4 || Math.abs(r) === 4 || Math.abs(-q-r) === 4) {
            const types = [TERRAIN_TYPES.ORANGE, TERRAIN_TYPES.GRASS_LIGHT, TERRAIN_TYPES.GRASS_MED];
            const typeIndex = Math.abs(q + r) % 3;
            const icons = [ICON_TYPES.FROG, ICON_TYPES.FOX, ICON_TYPES.SNAKE, ICON_TYPES.DEER];
            const iconIndex = Math.abs(q * 2 + r) % icons.length;
            return { type: types[typeIndex], icon: icons[iconIndex] };
        }
        const icons = [ICON_TYPES.FROG, ICON_TYPES.SNAKE, ICON_TYPES.BUG];
        return { type: TERRAIN_TYPES.GRASS_LIGHT, icon: icons[Math.abs(q + r) % icons.length] };
    }
    
    // Ring 5 (outer) - alternating orange and green
    if (distance === 5) {
        // Orange at corners of hexagonal board
        const s = -q - r;
        const isVertexDirection = (q === 5 || q === -5 || r === 5 || r === -5 || s === 5 || s === -5);
        
        if (isVertexDirection && (q === 0 || r === 0 || s === 0)) {
            return { type: TERRAIN_TYPES.ORANGE, icon: ICON_TYPES.NONE };
        }
        
        const altPattern = (q + r + 100) % 2;
        const types = altPattern === 0 ? TERRAIN_TYPES.ORANGE : TERRAIN_TYPES.GRASS_LIGHT;
        const icons = [ICON_TYPES.FROG, ICON_TYPES.SNAKE, ICON_TYPES.FOX, ICON_TYPES.DEER];
        return { type: types, icon: icons[Math.abs(q * r) % icons.length] };
    }
    
    return { type: TERRAIN_TYPES.GRASS_LIGHT, icon: ICON_TYPES.NONE };
}

const boardRadius = 5;

// Generate the complete board layout
export const BOARD_LAYOUT = (() => {
    const layout = [];
    
    for (let q = -boardRadius; q <= boardRadius; q++) {
        const r1 = Math.max(-boardRadius, -q - boardRadius);
        const r2 = Math.min(boardRadius, -q + boardRadius);
        for (let r = r1; r <= r2; r++) {
            const distance = Math.max(Math.abs(q), Math.abs(r), Math.abs(-q-r));
            const { type, icon } = assignTerrain(q, r, distance);
            layout.push({ q, r, type, icon, distance });
        }
    }
    
    return layout;
})();

// Initial piece positions - matching the board game
// Green frogs bottom-right, Yellow frogs right, Purple frogs left
export const INITIAL_PIECES = [
    // Green frogs (bottom-right corner area) - 3 pieces
    { type: PIECE_TYPES.FROG, color: FROG_COLORS.GREEN, position: 'corner_br_1' },
    { type: PIECE_TYPES.FROG, color: FROG_COLORS.GREEN, position: 'corner_br_2' },
    { type: PIECE_TYPES.FROG, color: FROG_COLORS.GREEN, position: 'corner_br_3' },
    
    // Yellow frogs (right side) - 3 pieces
    { type: PIECE_TYPES.FROG, color: FROG_COLORS.YELLOW, position: 'corner_r_1' },
    { type: PIECE_TYPES.FROG, color: FROG_COLORS.YELLOW, position: 'corner_r_2' },
    { type: PIECE_TYPES.FROG, color: FROG_COLORS.YELLOW, position: 'corner_r_3' },
    
    // Purple frogs (left side) - 3 pieces
    { type: PIECE_TYPES.FROG, color: FROG_COLORS.PURPLE, position: 'corner_l_1' },
    { type: PIECE_TYPES.FROG, color: FROG_COLORS.PURPLE, position: 'corner_l_2' },
    { type: PIECE_TYPES.FROG, color: FROG_COLORS.PURPLE, position: 'corner_l_3' },
    
    // Additional green frogs (top area)
    { type: PIECE_TYPES.FROG, color: FROG_COLORS.GREEN, position: 'corner_t_1' },
    { type: PIECE_TYPES.FROG, color: FROG_COLORS.GREEN, position: 'corner_t_2' },
    { type: PIECE_TYPES.FROG, color: FROG_COLORS.GREEN, position: 'corner_t_3' },
    
    // Herons on the board
    { type: PIECE_TYPES.HERON, color: 0x2C3E50, position: 'water_1' },
    { type: PIECE_TYPES.HERON, color: 0x2C3E50, position: 'water_2' },
    
    // Fish on water tiles
    { type: PIECE_TYPES.FISH, color: 0xE67E22, position: 'water_3' },
    { type: PIECE_TYPES.FISH, color: 0x3498DB, position: 'water_4' },
    
    // Trees in corners with different seasonal colors
    { type: PIECE_TYPES.TREE, color: 0x27AE60, position: 'tree_1', foliageColor: 0x27AE60 }, // Green (summer)
    { type: PIECE_TYPES.TREE, color: 0x935116, position: 'tree_2', foliageColor: 0xE67E22 }, // Orange (fall)
    { type: PIECE_TYPES.TREE, color: 0x935116, position: 'tree_3', foliageColor: 0xC0392B }, // Red (fall)
    { type: PIECE_TYPES.TREE, color: 0x5D4E37, position: 'tree_4', foliageColor: 0x5D4E37 }, // Brown (winter/bare)
    
    // Weather tokens on the right side
    { type: PIECE_TYPES.SUN, color: 0xF4D03F, position: 'weather_1' },
    { type: PIECE_TYPES.CLOUD, color: 0xBDC3C7, position: 'weather_2' },
    { type: PIECE_TYPES.RAIN, color: 0x5DADE2, position: 'weather_3' }
];

// Off-board positions for pieces (around the board edge)
export const OFF_BOARD_POSITIONS = {
    // Bottom-right corner (green frogs)
    corner_br_1: { x: 280, z: 200 },
    corner_br_2: { x: 310, z: 220 },
    corner_br_3: { x: 340, z: 200 },
    
    // Right side (yellow frogs)
    corner_r_1: { x: 320, z: 50 },
    corner_r_2: { x: 350, z: 30 },
    corner_r_3: { x: 320, z: 10 },
    
    // Left side (purple frogs)
    corner_l_1: { x: -320, z: 100 },
    corner_l_2: { x: -350, z: 120 },
    corner_l_3: { x: -320, z: 140 },
    
    // Top area (green frogs)
    corner_t_1: { x: -50, z: -280 },
    corner_t_2: { x: 0, z: -300 },
    corner_t_3: { x: 50, z: -280 },
    
    // Water positions (on board)
    water_1: { x: -40, z: 0 },
    water_2: { x: 40, z: 40 },
    water_3: { x: 0, z: 40 },
    water_4: { x: 40, z: -20 },
    
    // Tree positions (corners of board)
    tree_1: { x: -300, z: -250 },
    tree_2: { x: 300, z: -250 },
    tree_3: { x: -300, z: 200 },
    tree_4: { x: -250, z: -200 },
    
    // Weather tokens (right side)
    weather_1: { x: 350, z: -100 },
    weather_2: { x: 350, z: -50 },
    weather_3: { x: 350, z: 0 }
};

// Animation settings
export const ANIMATION_CONFIG = {
    hopUp: {
        duration: 200,
        height: 25,
        scaleIncrease: 0.15
    },
    hopDown: {
        duration: 350,
        bounceCount: 2,
        bounceDecay: 0.4
    },
    float: {
        amplitude: 2,
        period: 1200,
        wobbleAngle: 3
    },
    follow: {
        lerpFactor: 0.2
    }
};

// Board title
export const BOARD_TITLE = "FROG VERSUS PREDATOR";
