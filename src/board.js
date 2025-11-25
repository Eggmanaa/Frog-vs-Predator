// Board generation - Frog Versus Predator
// Creates hexagonal board matching the physical game

import * as THREE from 'three';
import { HEX_RADIUS, HEX_HEIGHT, TERRAIN_COLORS, TERRAIN_HEIGHTS, BOARD_LAYOUT, ICON_TYPES, BOARD_TITLE } from './config.js';
import { axialToPixel, getHexCorners, hexKey } from './utils.js';

/**
 * Create hexagon geometry with extruded height (pointy-top orientation)
 */
export function createHexGeometry(radius, height) {
    const shape = new THREE.Shape();
    const corners = getHexCorners(radius);
    
    shape.moveTo(corners[0].x, corners[0].y);
    for (let i = 1; i < corners.length; i++) {
        shape.lineTo(corners[i].x, corners[i].y);
    }
    shape.closePath();
    
    const extrudeSettings = {
        depth: height,
        bevelEnabled: true,
        bevelThickness: 0.8,
        bevelSize: 0.5,
        bevelSegments: 2
    };
    
    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    geometry.rotateX(-Math.PI / 2);
    
    return geometry;
}

/**
 * Create material for terrain type
 */
export function createHexMaterial(terrainType) {
    const color = TERRAIN_COLORS[terrainType];
    
    if (terrainType.startsWith('WATER')) {
        return new THREE.MeshStandardMaterial({
            color: color,
            metalness: 0.1,
            roughness: 0.3,
            transparent: true,
            opacity: 0.95
        });
    }
    
    if (terrainType === 'ORANGE') {
        return new THREE.MeshStandardMaterial({
            color: color,
            roughness: 0.7,
            metalness: 0.05
        });
    }
    
    // Grass and dirt - matte finish
    return new THREE.MeshStandardMaterial({
        color: color,
        roughness: 0.8,
        metalness: 0
    });
}

/**
 * Create icon geometry for hex tiles
 */
function createIconGeometry(iconType) {
    switch (iconType) {
        case ICON_TYPES.FROG:
            return createFrogIcon();
        case ICON_TYPES.SNAKE:
            return createSnakeIcon();
        case ICON_TYPES.HERON:
            return createHeronIcon();
        case ICON_TYPES.FISH:
            return createFishIcon();
        case ICON_TYPES.BUG:
        case ICON_TYPES.MOSQUITO:
        case ICON_TYPES.DRAGONFLY:
            return createBugIcon();
        case ICON_TYPES.DEER:
            return createDeerIcon();
        case ICON_TYPES.FOX:
            return createFoxIcon();
        default:
            return null;
    }
}

function createFrogIcon() {
    const group = new THREE.Group();
    
    // Simple frog silhouette
    const bodyGeom = new THREE.CircleGeometry(6, 16);
    const material = new THREE.MeshBasicMaterial({ 
        color: 0x333333,
        transparent: true,
        opacity: 0.6,
        side: THREE.DoubleSide
    });
    const body = new THREE.Mesh(bodyGeom, material);
    
    // Eyes
    const eyeGeom = new THREE.CircleGeometry(2, 8);
    const leftEye = new THREE.Mesh(eyeGeom, material);
    leftEye.position.set(-3, 4, 0.1);
    const rightEye = new THREE.Mesh(eyeGeom, material);
    rightEye.position.set(3, 4, 0.1);
    
    group.add(body, leftEye, rightEye);
    group.rotation.x = -Math.PI / 2;
    
    return group;
}

function createSnakeIcon() {
    const group = new THREE.Group();
    
    // Wavy snake path
    const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-8, 0, 0),
        new THREE.Vector3(-4, 0, 3),
        new THREE.Vector3(0, 0, -3),
        new THREE.Vector3(4, 0, 3),
        new THREE.Vector3(8, 0, 0)
    ]);
    
    const geometry = new THREE.TubeGeometry(curve, 20, 1.5, 8, false);
    const material = new THREE.MeshBasicMaterial({ 
        color: 0x333333,
        transparent: true,
        opacity: 0.6
    });
    const snake = new THREE.Mesh(geometry, material);
    
    group.add(snake);
    return group;
}

function createHeronIcon() {
    const group = new THREE.Group();
    const material = new THREE.MeshBasicMaterial({ 
        color: 0x333333,
        transparent: true,
        opacity: 0.6,
        side: THREE.DoubleSide
    });
    
    // Body
    const bodyShape = new THREE.Shape();
    bodyShape.moveTo(0, 0);
    bodyShape.lineTo(-3, 5);
    bodyShape.lineTo(-2, 10);
    bodyShape.lineTo(0, 12);
    bodyShape.lineTo(5, 10); // beak
    bodyShape.lineTo(0, 8);
    bodyShape.lineTo(2, 5);
    bodyShape.lineTo(3, 0);
    bodyShape.closePath();
    
    const bodyGeom = new THREE.ShapeGeometry(bodyShape);
    const body = new THREE.Mesh(bodyGeom, material);
    body.rotation.x = -Math.PI / 2;
    body.position.y = 0.5;
    body.scale.set(0.7, 0.7, 0.7);
    
    group.add(body);
    return group;
}

function createFishIcon() {
    const group = new THREE.Group();
    const material = new THREE.MeshBasicMaterial({ 
        color: 0x333333,
        transparent: true,
        opacity: 0.6,
        side: THREE.DoubleSide
    });
    
    // Fish body
    const fishShape = new THREE.Shape();
    fishShape.moveTo(-8, 0);
    fishShape.quadraticCurveTo(-4, 4, 4, 2);
    fishShape.lineTo(8, 4);
    fishShape.lineTo(6, 0);
    fishShape.lineTo(8, -4);
    fishShape.lineTo(4, -2);
    fishShape.quadraticCurveTo(-4, -4, -8, 0);
    
    const fishGeom = new THREE.ShapeGeometry(fishShape);
    const fish = new THREE.Mesh(fishGeom, material);
    fish.rotation.x = -Math.PI / 2;
    fish.position.y = 0.5;
    fish.scale.set(0.6, 0.6, 0.6);
    
    group.add(fish);
    return group;
}

function createBugIcon() {
    const group = new THREE.Group();
    const material = new THREE.MeshBasicMaterial({ 
        color: 0x333333,
        transparent: true,
        opacity: 0.6,
        side: THREE.DoubleSide
    });
    
    // Simple bug shape
    const bodyGeom = new THREE.CircleGeometry(3, 8);
    const body = new THREE.Mesh(bodyGeom, material);
    body.rotation.x = -Math.PI / 2;
    
    // Wings
    const wingGeom = new THREE.CircleGeometry(4, 8);
    const leftWing = new THREE.Mesh(wingGeom, material);
    leftWing.rotation.x = -Math.PI / 2;
    leftWing.position.set(-3, 0.1, 2);
    leftWing.scale.set(0.6, 0.8, 1);
    
    const rightWing = leftWing.clone();
    rightWing.position.set(3, 0.1, 2);
    
    group.add(body, leftWing, rightWing);
    return group;
}

function createDeerIcon() {
    const group = new THREE.Group();
    const material = new THREE.MeshBasicMaterial({ 
        color: 0x333333,
        transparent: true,
        opacity: 0.6,
        side: THREE.DoubleSide
    });
    
    // Simple deer silhouette
    const bodyGeom = new THREE.CircleGeometry(5, 8);
    bodyGeom.scale(1.5, 1, 1);
    const body = new THREE.Mesh(bodyGeom, material);
    body.rotation.x = -Math.PI / 2;
    
    // Head
    const headGeom = new THREE.CircleGeometry(3, 8);
    const head = new THREE.Mesh(headGeom, material);
    head.rotation.x = -Math.PI / 2;
    head.position.set(6, 0.1, -2);
    
    group.add(body, head);
    return group;
}

function createFoxIcon() {
    const group = new THREE.Group();
    const material = new THREE.MeshBasicMaterial({ 
        color: 0x333333,
        transparent: true,
        opacity: 0.6,
        side: THREE.DoubleSide
    });
    
    // Fox body
    const bodyGeom = new THREE.CircleGeometry(5, 8);
    bodyGeom.scale(1.3, 1, 1);
    const body = new THREE.Mesh(bodyGeom, material);
    body.rotation.x = -Math.PI / 2;
    
    // Ears (triangles)
    const earGeom = new THREE.CircleGeometry(2, 3);
    const leftEar = new THREE.Mesh(earGeom, material);
    leftEar.rotation.x = -Math.PI / 2;
    leftEar.position.set(-3, 0.1, -4);
    
    const rightEar = leftEar.clone();
    rightEar.position.set(3, 0.1, -4);
    
    // Tail
    const tailGeom = new THREE.CircleGeometry(3, 8);
    tailGeom.scale(2, 0.5, 1);
    const tail = new THREE.Mesh(tailGeom, material);
    tail.rotation.x = -Math.PI / 2;
    tail.position.set(-8, 0.1, 0);
    
    group.add(body, leftEar, rightEar, tail);
    return group;
}

/**
 * Create the game board
 */
export function createBoard(scene) {
    const boardHexes = new Map();
    
    BOARD_LAYOUT.forEach(hexData => {
        const { q, r, type, icon, distance } = hexData;
        const height = TERRAIN_HEIGHTS[type] || HEX_HEIGHT;
        
        // Create hex geometry
        const geometry = createHexGeometry(HEX_RADIUS * 0.98, height);
        const material = createHexMaterial(type);
        
        const mesh = new THREE.Mesh(geometry, material);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        
        // Position hex
        const { x, z } = axialToPixel(q, r);
        mesh.position.set(x, 0, z);
        
        // Store hex data
        mesh.userData = { q, r, type, icon, elevation: height };
        
        scene.add(mesh);
        
        // Add icon on top
        if (icon && icon !== ICON_TYPES.NONE) {
            const iconMesh = createIconGeometry(icon);
            if (iconMesh) {
                iconMesh.position.set(x, height + 0.5, z);
                scene.add(iconMesh);
            }
        }
        
        // Store in map
        boardHexes.set(hexKey(q, r), {
            mesh,
            terrain: type,
            coords: { q, r },
            elevation: height,
            icon
        });
    });
    
    return boardHexes;
}

/**
 * Add board base with white/light gray color
 */
export function addBoardBase(scene) {
    // Calculate board bounds
    const baseWidth = 420;
    const baseHeight = 15;
    const baseDepth = 380;
    
    const geometry = new THREE.BoxGeometry(baseWidth, baseHeight, baseDepth);
    const material = new THREE.MeshStandardMaterial({
        color: TERRAIN_COLORS.BASE,
        roughness: 0.6,
        metalness: 0.05
    });
    
    const base = new THREE.Mesh(geometry, material);
    base.position.y = -baseHeight / 2 - 1;
    base.receiveShadow = true;
    base.castShadow = true;
    
    scene.add(base);
    
    // Add title text on the edge
    addBoardTitle(scene);
}

/**
 * Add the "FROG VERSUS PREDATOR" title
 */
function addBoardTitle(scene) {
    // Create a simple 3D text representation
    const loader = new THREE.FontLoader ? new THREE.FontLoader() : null;
    
    // For now, create a simple plate with the title
    const titleGeometry = new THREE.PlaneGeometry(350, 30);
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    
    ctx.fillStyle = '#F5F5F5';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#5D4037';
    ctx.font = 'bold 72px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(BOARD_TITLE, canvas.width / 2, canvas.height / 2);
    
    const texture = new THREE.CanvasTexture(canvas);
    const titleMaterial = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true
    });
    
    const titleMesh = new THREE.Mesh(titleGeometry, titleMaterial);
    titleMesh.rotation.x = -Math.PI / 2;
    titleMesh.position.set(0, 0.5, -200);
    
    scene.add(titleMesh);
}

/**
 * No grass textures needed - using smooth colored hexes
 */
export function addGrassTexture(scene, boardHexes) {
    // Intentionally empty - board uses clean colored hexes
}
