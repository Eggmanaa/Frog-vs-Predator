// Board generation with clay/plastic aesthetic

import * as THREE from 'three';
import { HEX_RADIUS, TERRAIN_HEIGHTS, TERRAIN_COLORS, BOARD_LAYOUT } from './config.js';
import { axialToPixel, getHexCorners, hexKey } from './utils.js';

/**
 * Create hexagon geometry with extruded height
 * @param {number} radius - Hex radius
 * @param {number} height - Extrusion height
 * @returns {THREE.ExtrudeGeometry}
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
        bevelThickness: 1,
        bevelSize: 0.5,
        bevelSegments: 2
    };

    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    geometry.rotateX(-Math.PI / 2); // Rotate to lie flat

    return geometry;
}

/**
 * Create material for terrain type with clay/plastic aesthetic
 * @param {string} terrainType - Type of terrain
 * @returns {THREE.Material}
 */
export function createHexMaterial(terrainType) {
    const color = TERRAIN_COLORS[terrainType];

    if (terrainType === 'WATER') {
        // Glossy plastic for water
        return new THREE.MeshStandardMaterial({
            color: color,
            metalness: 0.3,
            roughness: 0.2,
            clearcoat: 0.5,
            clearcoatRoughness: 0.2
        });
    } else if (terrainType === 'ORANGE_ROCKS') {
        // Rough clay texture
        return new THREE.MeshStandardMaterial({
            color: color,
            roughness: 0.8,
            metalness: 0
        });
    } else {
        // Matte clay for grass, dirt
        return new THREE.MeshStandardMaterial({
            color: color,
            roughness: 0.7,
            metalness: 0
        });
    }
}

/**
 * Create the game board with all hexes
 * @param {THREE.Scene} scene - Three.js scene
 * @returns {Map<string, Object>} - Map of hex meshes by coordinate key
 */
export function createBoard(scene) {
    const boardHexes = new Map();

    // Flatten board layout array
    const allHexes = BOARD_LAYOUT.flat();

    allHexes.forEach(hexData => {
        const { q, r, type } = hexData;
        const height = TERRAIN_HEIGHTS[type];

        // Create geometry and material
        const geometry = createHexGeometry(HEX_RADIUS, Math.abs(height) + 5);
        const material = createHexMaterial(type);

        // Create mesh
        const mesh = new THREE.Mesh(geometry, material);
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        // Position hex
        const { x, z } = axialToPixel(q, r);
        mesh.position.set(x, height, z);

        // Store hex data
        mesh.userData = { q, r, type, elevation: height };

        // Add to scene
        scene.add(mesh);

        // Store in map
        boardHexes.set(hexKey(q, r), {
            mesh,
            terrain: type,
            coords: { q, r },
            elevation: height
        });
    });

    return boardHexes;
}

/**
 * Add board base/foundation
 * @param {THREE.Scene} scene - Three.js scene
 */
export function addBoardBase(scene) {
    const baseSize = 800;
    const baseHeight = 20;

    const geometry = new THREE.BoxGeometry(baseSize, baseHeight, baseSize);
    const material = new THREE.MeshStandardMaterial({
        color: TERRAIN_COLORS.BASE,
        roughness: 0.7,
        metalness: 0
    });

    const base = new THREE.Mesh(geometry, material);
    base.position.y = TERRAIN_HEIGHTS.BASE - baseHeight / 2;
    base.receiveShadow = true;

    scene.add(base);
}

/**
 * Add decorative grass blades on grass hexes
 * @param {THREE.Scene} scene - Three.js scene
 * @param {Map} boardHexes - Board hex map
 */
export function addGrassTexture(scene, boardHexes) {
    const grassGeometry = new THREE.ConeGeometry(1, 8, 3);
    const grassMaterial = new THREE.MeshStandardMaterial({
        color: 0x1E8449,
        roughness: 0.9
    });

    boardHexes.forEach(hexData => {
        if (hexData.terrain === 'GRASS') {
            const { x, z } = axialToPixel(hexData.coords.q, hexData.coords.r);

            // Add 5-8 grass blades per hex
            const bladeCount = 5 + Math.floor(Math.random() * 3);
            for (let i = 0; i < bladeCount; i++) {
                const blade = new THREE.Mesh(grassGeometry, grassMaterial);

                // Random position within hex
                const angle = Math.random() * Math.PI * 2;
                const radius = Math.random() * HEX_RADIUS * 0.6;
                blade.position.set(
                    x + Math.cos(angle) * radius,
                    hexData.elevation + 5,
                    z + Math.sin(angle) * radius
                );

                blade.rotation.z = (Math.random() - 0.5) * 0.2;
                blade.scale.setScalar(0.5 + Math.random() * 0.5);

                scene.add(blade);
            }
        }
    });
}
