// Game configuration and constants

export const HEX_RADIUS = 50;

export const TERRAIN_HEIGHTS = {
    WATER: 0,
    GRASS: 10,
    DIRT: 8,
    ORANGE_ROCKS: 20,
    SPECIAL: 10,
    BASE: -5
};

export const TERRAIN_COLORS = {
    WATER: 0x5DADE2,
    GRASS: 0x27AE60,
    DIRT: 0xD4B896,
    ORANGE_ROCKS: 0xE67E22,
    SPECIAL: 0x1E8449,
    BASE: 0x8B4513
};

export const PIECE_TYPES = {
    FROG: 'frog',
    FISH: 'fish',
    FOX: 'fox',
    BIRD: 'bird'
};

// Board layout based on original reference
// Using axial coordinates (q, r)
// Terrain types: W=Water, G=Grass, D=Dirt, O=Orange Rocks, S=Special
export const BOARD_LAYOUT = [
    // This is a simplified representation - actual layout will be more detailed
    // Row by row from top-left
    [
        { q: -5, r: 0, type: 'ORANGE_ROCKS' }, { q: -4, r: 0, type: 'ORANGE_ROCKS' }, { q: -3, r: 0, type: 'ORANGE_ROCKS' },
        { q: -2, r: 0, type: 'GRASS' }, { q: -1, r: 0, type: 'GRASS' }, { q: 0, r: 0, type: 'GRASS' },
        { q: 1, r: 0, type: 'GRASS' }, { q: 2, r: 0, type: 'ORANGE_ROCKS' }, { q: 3, r: 0, type: 'ORANGE_ROCKS' }
    ],
    [
        { q: -5, r: 1, type: 'ORANGE_ROCKS' }, { q: -4, r: 1, type: 'GRASS' }, { q: -3, r: 1, type: 'WATER' },
        { q: -2, r: 1, type: 'WATER' }, { q: -1, r: 1, type: 'GRASS' }, { q: 0, r: 1, type: 'GRASS' },
        { q: 1, r: 1, type: 'WATER' }, { q: 2, r: 1, type: 'GRASS' }, { q: 3, r: 1, type: 'ORANGE_ROCKS' }
    ],
    [
        { q: -5, r: 2, type: 'ORANGE_ROCKS' }, { q: -4, r: 2, type: 'GRASS' }, { q: -3, r: 2, type: 'WATER' },
        { q: -2, r: 2, type: 'SPECIAL' }, { q: -1, r: 2, type: 'WATER' }, { q: 0, r: 2, type: 'WATER' },
        { q: 1, r: 2, type: 'GRASS' }, { q: 2, r: 2, type: 'GRASS' }, { q: 3, r: 2, type: 'ORANGE_ROCKS' }
    ],
    [
        { q: -5, r: 3, type: 'GRASS' }, { q: -4, r: 3, type: 'GRASS' }, { q: -3, r: 3, type: 'WATER' },
        { q: -2, r: 3, type: 'WATER' }, { q: -1, r: 3, type: 'DIRT' }, { q: 0, r: 3, type: 'WATER' },
        { q: 1, r: 3, type: 'WATER' }, { q: 2, r: 3, type: 'GRASS' }, { q: 3, r: 3, type: 'GRASS' }
    ],
    [
        { q: -5, r: 4, type: 'GRASS' }, { q: -4, r: 4, type: 'GRASS' }, { q: -3, r: 4, type: 'DIRT' },
        { q: -2, r: 4, type: 'WATER' }, { q: -1, r: 4, type: 'WATER' }, { q: 0, r: 4, type: 'WATER' },
        { q: 1, r: 4, type: 'SPECIAL' }, { q: 2, r: 4, type: 'GRASS' }, { q: 3, r: 4, type: 'ORANGE_ROCKS' }
    ],
    [
        { q: -5, r: 5, type: 'ORANGE_ROCKS' }, { q: -4, r: 5, type: 'GRASS' }, { q: -3, r: 5, type: 'GRASS' },
        { q: -2, r: 5, type: 'WATER' }, { q: -1, r: 5, type: 'WATER' }, { q: 0, r: 5, type: 'GRASS' },
        { q: 1, r: 5, type: 'GRASS' }, { q: 2, r: 5, type: 'GRASS' }, { q: 3, r: 5, type: 'ORANGE_ROCKS' }
    ],
    [
        { q: -5, r: 6, type: 'ORANGE_ROCKS' }, { q: -4, r: 6, type: 'ORANGE_ROCKS' }, { q: -3, r: 6, type: 'GRASS' },
        { q: -2, r: 6, type: 'GRASS' }, { q: -1, r: 6, type: 'GRASS' }, { q: 0, r: 6, type: 'GRASS' },
        { q: 1, r: 6, type: 'GRASS' }, { q: 2, r: 6, type: 'ORANGE_ROCKS' }, { q: 3, r: 6, type: 'ORANGE_ROCKS' }
    ]
];

// Initial piece positions
export const INITIAL_PIECES = [
    // Frogs (left side)
    { type: PIECE_TYPES.FROG, q: -5, r: 0, color: 0x2ECC71 },
    { type: PIECE_TYPES.FROG, q: -5, r: 1, color: 0x27AE60 },
    { type: PIECE_TYPES.FROG, q: -5, r: 2, color: 0x1E8449 },
    { type: PIECE_TYPES.FROG, q: -4, r: 6, color: 0x58D68D },

    // Fish (in water)
    { type: PIECE_TYPES.FISH, q: -3, r: 1, color: 0x3498DB },
    { type: PIECE_TYPES.FISH, q: -1, r: 2, color: 0x2E86C1 },
    { type: PIECE_TYPES.FISH, q: 0, r: 4, color: 0x5DADE2 },

    // Foxes (right side)
    { type: PIECE_TYPES.FOX, q: 3, r: 0, color: 0xE67E22 },
    { type: PIECE_TYPES.FOX, q: 3, r: 2, color: 0xD35400 },
    { type: PIECE_TYPES.FOX, q: 2, r: 6, color: 0xCA6F1E },

    // Birds (around edges)
    { type: PIECE_TYPES.BIRD, q: 2, r: 0, color: 0x5DADE2 },
    { type: PIECE_TYPES.BIRD, q: 3, r: 3, color: 0x85C1E9 },
    { type: PIECE_TYPES.BIRD, q: 3, r: 5, color: 0x7FB3D5 }
];

// Animation settings
export const ANIMATION_CONFIG = {
    hopUp: {
        duration: 250,
        height: 30,
        scaleIncrease: 0.1
    },
    hopDown: {
        duration: 400,
        bounceCount: 2,
        bounceDecay: 0.4
    },
    float: {
        amplitude: 3,
        period: 1500,
        wobbleAngle: 5 // degrees
    },
    follow: {
        lerpFactor: 0.15
    }
};
