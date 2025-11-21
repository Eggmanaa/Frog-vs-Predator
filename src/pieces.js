// 3D game pieces with clay/plastic toy aesthetic

import * as THREE from 'three';
import { PIECE_TYPES, INITIAL_PIECES } from './config.js';
import { axialToPixel } from './utils.js';

/**
 * Create a frog piece with clay toy style
 * @param {number} color - Hex color value
 * @returns {THREE.Group}
 */
export function createFrog(color) {
    const frog = new THREE.Group();

    // Body (flattened sphere for squat pose)
    const bodyGeometry = new THREE.SphereGeometry(12, 16, 16);
    bodyGeometry.scale(1, 0.7, 1); // Flatten for squat look
    const bodyMaterial = new THREE.MeshStandardMaterial({
        color: color,
        roughness: 0.3,
        metalness: 0
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 8;
    body.castShadow = true;
    frog.add(body);

    // Eyes (2 spheres on top)
    const eyeGeometry = new THREE.SphereGeometry(4, 12, 12);
    const eyeMaterial = new THREE.MeshStandardMaterial({
        color: 0xFFFFFF,
        roughness: 0.1,
        metalness: 0.1
    });

    const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    leftEye.position.set(-5, 14, 8);
    leftEye.castShadow = true;
    frog.add(leftEye);

    const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    rightEye.position.set(5, 14, 8);
    rightEye.castShadow = true;
    frog.add(rightEye);

    // Pupils
    const pupilGeometry = new THREE.SphereGeometry(1.5, 8, 8);
    const pupilMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });

    const leftPupil = new THREE.Mesh(pupilGeometry, pupilMaterial);
    leftPupil.position.set(-5, 14, 12);
    frog.add(leftPupil);

    const rightPupil = new THREE.Mesh(pupilGeometry, pupilMaterial);
    rightPupil.position.set(5, 14, 12);
    frog.add(rightPupil);

    // Legs (4 rounded capsules)
    const legGeometry = new THREE.CapsuleGeometry(2, 6, 4, 8);
    const legMaterial = bodyMaterial;

    const positions = [
        { x: -8, y: 3, z: -5, rot: 0.3 },
        { x: 8, y: 3, z: -5, rot: -0.3 },
        { x: -8, y: 3, z: 5, rot: 0.3 },
        { x: 8, y: 3, z: 5, rot: -0.3 }
    ];

    positions.forEach(pos => {
        const leg = new THREE.Mesh(legGeometry, legMaterial);
        leg.position.set(pos.x, pos.y, pos.z);
        leg.rotation.z = pos.rot;
        leg.castShadow = true;
        frog.add(leg);
    });

    return frog;
}

/**
 * Create a fox piece with clay toy style
 * @param {number} color - Hex color value
 * @returns {THREE.Group}
 */
export function createFox(color) {
    const fox = new THREE.Group();

    // Body (rounded box)
    const bodyGeometry = new THREE.BoxGeometry(15, 10, 20, 4, 4, 4);
    const bodyMaterial = new THREE.MeshStandardMaterial({
        color: color,
        roughness: 0.7,
        metalness: 0
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 8;
    body.castShadow = true;
    fox.add(body);

    // Head (sphere)
    const headGeometry = new THREE.SphereGeometry(7, 12, 12);
    headGeometry.scale(1.2, 1, 1);
    const head = new THREE.Mesh(headGeometry, bodyMaterial);
    head.position.set(0, 10, 12);
    head.castShadow = true;
    fox.add(head);

    // Snout (small cone)
    const snoutGeometry = new THREE.ConeGeometry(3, 5, 8);
    snoutGeometry.rotateX(Math.PI / 2);
    const snout = new THREE.Mesh(snoutGeometry, bodyMaterial);
    snout.position.set(0, 9, 17);
    snout.castShadow = true;
    fox.add(snout);

    // Ears (2 small cones)
    const earGeometry = new THREE.ConeGeometry(2, 5, 6);
    const leftEar = new THREE.Mesh(earGeometry, bodyMaterial);
    leftEar.position.set(-4, 15, 11);
    leftEar.castShadow = true;
    fox.add(leftEar);

    const rightEar = new THREE.Mesh(earGeometry, bodyMaterial);
    rightEar.position.set(4, 15, 11);
    rightEar.castShadow = true;
    fox.add(rightEar);

    // Tail (capsule with white tip)
    const tailGeometry = new THREE.CapsuleGeometry(3, 10, 4, 8);
    const tail = new THREE.Mesh(tailGeometry, bodyMaterial);
    tail.position.set(0, 8, -12);
    tail.rotation.x = -0.5;
    tail.castShadow = true;
    fox.add(tail);

    // Eyes
    const eyeGeometry = new THREE.SphereGeometry(1, 8, 8);
    const eyeMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });

    const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    leftEye.position.set(-3, 11, 16);
    fox.add(leftEye);

    const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    rightEye.position.set(3, 11, 16);
    fox.add(rightEye);

    return fox;
}

/**
 * Create a bird piece with clay toy style
 * @param {number} color - Hex color value
 * @returns {THREE.Group}
 */
export function createBird(color) {
    const bird = new THREE.Group();

    // Body (egg shape)
    const bodyGeometry = new THREE.SphereGeometry(8, 12, 12);
    bodyGeometry.scale(0.8, 1.2, 0.8);
    const bodyMaterial = new THREE.MeshStandardMaterial({
        color: color,
        roughness: 0.4,
        metalness: 0.1
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 12;
    body.castShadow = true;
    bird.add(body);

    // Neck (long curved cylinder)
    const neckGeometry = new THREE.CylinderGeometry(2, 2, 15, 8);
    const neckMaterial = new THREE.MeshStandardMaterial({
        color: 0xECF0F1,
        roughness: 0.4
    });
    const neck = new THREE.Mesh(neckGeometry, neckMaterial);
    neck.position.set(0, 22, 3);
    neck.rotation.x = 0.3;
    neck.castShadow = true;
    bird.add(neck);

    // Head (small sphere)
    const headGeometry = new THREE.SphereGeometry(4, 10, 10);
    const head = new THREE.Mesh(headGeometry, neckMaterial);
    head.position.set(0, 30, 5);
    head.castShadow = true;
    bird.add(head);

    // Beak (cone)
    const beakGeometry = new THREE.ConeGeometry(1.5, 4, 6);
    beakGeometry.rotateX(Math.PI / 2);
    const beakMaterial = new THREE.MeshStandardMaterial({
        color: 0xF39C12,
        roughness: 0.5
    });
    const beak = new THREE.Mesh(beakGeometry, beakMaterial);
    beak.position.set(0, 30, 8);
    beak.castShadow = true;
    bird.add(beak);

    // Legs (2 thin cylinders)
    const legGeometry = new THREE.CylinderGeometry(0.8, 0.8, 10, 6);
    const legMaterial = new THREE.MeshStandardMaterial({
        color: 0x34495E,
        roughness: 0.6
    });

    const leftLeg = new THREE.Mesh(legGeometry, legMaterial);
    leftLeg.position.set(-3, 5, 0);
    leftLeg.castShadow = true;
    bird.add(leftLeg);

    const rightLeg = new THREE.Mesh(legGeometry, legMaterial);
    rightLeg.position.set(3, 5, 0);
    rightLeg.castShadow = true;
    bird.add(rightLeg);

    return bird;
}

/**
 * Create a fish piece with clay toy style
 * @param {number} color - Hex color value
 * @returns {THREE.Group}
 */
export function createFish(color) {
    const fish = new THREE.Group();

    // Body (stretched sphere)
    const bodyGeometry = new THREE.SphereGeometry(8, 12, 12);
    bodyGeometry.scale(1.8, 0.8, 0.8);
    const bodyMaterial = new THREE.MeshStandardMaterial({
        color: color,
        roughness: 0.3,
        metalness: 0.2
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 8;
    body.rotation.y = Math.PI / 2;
    body.castShadow = true;
    fish.add(body);

    // Tail (fan shape using cone)
    const tailGeometry = new THREE.ConeGeometry(6, 8, 3);
    tailGeometry.rotateX(Math.PI / 2);
    tailGeometry.scale(0.5, 1, 1);
    const tail = new THREE.Mesh(tailGeometry, bodyMaterial);
    tail.position.set(-12, 8, 0);
    tail.castShadow = true;
    fish.add(tail);

    // Fins (simplified planes)
    const finGeometry = new THREE.ConeGeometry(3, 5, 3);

    const topFin = new THREE.Mesh(finGeometry, bodyMaterial);
    topFin.position.set(0, 14, 0);
    topFin.rotation.x = Math.PI;
    topFin.castShadow = true;
    fish.add(topFin);

    const sideFin1 = new THREE.Mesh(finGeometry, bodyMaterial);
    sideFin1.position.set(2, 8, 5);
    sideFin1.rotation.z = Math.PI / 2;
    sideFin1.scale.setScalar(0.6);
    sideFin1.castShadow = true;
    fish.add(sideFin1);

    const sideFin2 = new THREE.Mesh(finGeometry, bodyMaterial);
    sideFin2.position.set(2, 8, -5);
    sideFin2.rotation.z = Math.PI / 2;
    sideFin2.scale.setScalar(0.6);
    sideFin2.castShadow = true;
    fish.add(sideFin2);

    // Eyes
    const eyeGeometry = new THREE.SphereGeometry(1.5, 8, 8);
    const eyeMaterial = new THREE.MeshStandardMaterial({
        color: 0xFFFFFF,
        roughness: 0.2
    });

    const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    leftEye.position.set(8, 10, 4);
    leftEye.castShadow = true;
    fish.add(leftEye);

    const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    rightEye.position.set(8, 10, -4);
    rightEye.castShadow = true;
    fish.add(rightEye);

    return fish;
}

/**
 * Create a piece by type
 * @param {string} type - Piece type
 * @param {number} color - Hex color
 * @param {{q: number, r: number}} position - Hex coordinates
 * @param {number} elevation - Y position based on hex
 * @returns {Object} - Piece data
 */
export function createPiece(type, color, position, elevation = 0) {
    let mesh;

    switch (type) {
        case PIECE_TYPES.FROG:
            mesh = createFrog(color);
            break;
        case PIECE_TYPES.FOX:
            mesh = createFox(color);
            break;
        case PIECE_TYPES.BIRD:
            mesh = createBird(color);
            break;
        case PIECE_TYPES.FISH:
            mesh = createFish(color);
            break;
        default:
            mesh = createFrog(color);
    }

    // Position piece
    const { x, z } = axialToPixel(position.q, position.r);
    mesh.position.set(x, elevation + 5, z);

    // Store metadata
    mesh.userData = {
        type,
        q: position.q,
        r: position.r,
        color,
        isPiece: true
    };

    return mesh;
}

/**
 * Initialize all game pieces
 * @param {THREE.Scene} scene - Three.js scene
 * @param {Map} boardHexes - Board hex map
 * @returns {Array<THREE.Group>} - Array of piece meshes
 */
export function initializePieces(scene, boardHexes) {
    const pieces = [];

    INITIAL_PIECES.forEach(pieceData => {
        const hexData = boardHexes.get(`${pieceData.q},${pieceData.r}`);
        const elevation = hexData ? hexData.elevation : 0;

        const piece = createPiece(
            pieceData.type,
            pieceData.color,
            { q: pieceData.q, r: pieceData.r },
            elevation
        );

        scene.add(piece);
        pieces.push(piece);
    });

    return pieces;
}
