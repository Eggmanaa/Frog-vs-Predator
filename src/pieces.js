// 3D game pieces - Frog Versus Predator
// Creates cute clay-style pieces matching the board game

import * as THREE from 'three';
import { PIECE_TYPES, FROG_COLORS, INITIAL_PIECES, OFF_BOARD_POSITIONS } from './config.js';

/**
 * Create a cute frog piece
 */
export function createFrog(color) {
    const frog = new THREE.Group();
    
    const material = new THREE.MeshStandardMaterial({
        color: color,
        roughness: 0.4,
        metalness: 0.1
    });
    
    // Body - rounded, squat shape
    const bodyGeometry = new THREE.SphereGeometry(10, 24, 24);
    bodyGeometry.scale(1.2, 0.7, 1.1);
    const body = new THREE.Mesh(bodyGeometry, material);
    body.position.y = 6;
    body.castShadow = true;
    frog.add(body);
    
    // Head bump
    const headGeometry = new THREE.SphereGeometry(6, 20, 20);
    headGeometry.scale(1, 0.8, 1);
    const head = new THREE.Mesh(headGeometry, material);
    head.position.set(0, 9, 6);
    head.castShadow = true;
    frog.add(head);
    
    // Eyes (big bulging eyes)
    const eyeWhiteMaterial = new THREE.MeshStandardMaterial({
        color: 0xFFFFFF,
        roughness: 0.2,
        metalness: 0.1
    });
    
    const eyeGeometry = new THREE.SphereGeometry(3.5, 16, 16);
    
    const leftEye = new THREE.Mesh(eyeGeometry, eyeWhiteMaterial);
    leftEye.position.set(-4, 12, 8);
    leftEye.castShadow = true;
    frog.add(leftEye);
    
    const rightEye = new THREE.Mesh(eyeGeometry, eyeWhiteMaterial);
    rightEye.position.set(4, 12, 8);
    rightEye.castShadow = true;
    frog.add(rightEye);
    
    // Pupils
    const pupilMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const pupilGeometry = new THREE.SphereGeometry(1.5, 12, 12);
    
    const leftPupil = new THREE.Mesh(pupilGeometry, pupilMaterial);
    leftPupil.position.set(-4, 12, 11);
    frog.add(leftPupil);
    
    const rightPupil = new THREE.Mesh(pupilGeometry, pupilMaterial);
    rightPupil.position.set(4, 12, 11);
    frog.add(rightPupil);
    
    // Front legs
    const legGeometry = new THREE.CapsuleGeometry(2, 5, 6, 12);
    
    const frontLeftLeg = new THREE.Mesh(legGeometry, material);
    frontLeftLeg.position.set(-7, 3, 5);
    frontLeftLeg.rotation.z = 0.5;
    frontLeftLeg.rotation.y = -0.3;
    frontLeftLeg.castShadow = true;
    frog.add(frontLeftLeg);
    
    const frontRightLeg = new THREE.Mesh(legGeometry, material);
    frontRightLeg.position.set(7, 3, 5);
    frontRightLeg.rotation.z = -0.5;
    frontRightLeg.rotation.y = 0.3;
    frontRightLeg.castShadow = true;
    frog.add(frontRightLeg);
    
    // Back legs (bigger, bent)
    const backLegGeometry = new THREE.CapsuleGeometry(2.5, 6, 6, 12);
    
    const backLeftLeg = new THREE.Mesh(backLegGeometry, material);
    backLeftLeg.position.set(-8, 3, -4);
    backLeftLeg.rotation.z = 0.7;
    backLeftLeg.rotation.y = -0.5;
    backLeftLeg.castShadow = true;
    frog.add(backLeftLeg);
    
    const backRightLeg = new THREE.Mesh(backLegGeometry, material);
    backRightLeg.position.set(8, 3, -4);
    backRightLeg.rotation.z = -0.7;
    backRightLeg.rotation.y = 0.5;
    backRightLeg.castShadow = true;
    frog.add(backRightLeg);
    
    return frog;
}

/**
 * Create a heron (wading bird) piece
 */
export function createHeron(color = 0x2C3E50) {
    const heron = new THREE.Group();
    
    const bodyMaterial = new THREE.MeshStandardMaterial({
        color: 0x34495E,
        roughness: 0.5,
        metalness: 0.1
    });
    
    const whiteMaterial = new THREE.MeshStandardMaterial({
        color: 0xECF0F1,
        roughness: 0.4,
        metalness: 0.1
    });
    
    // Body (oval)
    const bodyGeometry = new THREE.SphereGeometry(6, 16, 16);
    bodyGeometry.scale(0.8, 1.2, 0.8);
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 15;
    body.castShadow = true;
    heron.add(body);
    
    // Neck (long curved cylinder)
    const neckGeometry = new THREE.CylinderGeometry(1.5, 2, 18, 12);
    const neck = new THREE.Mesh(neckGeometry, whiteMaterial);
    neck.position.set(0, 26, 2);
    neck.rotation.x = 0.2;
    neck.castShadow = true;
    heron.add(neck);
    
    // Head
    const headGeometry = new THREE.SphereGeometry(3, 12, 12);
    const head = new THREE.Mesh(headGeometry, whiteMaterial);
    head.position.set(0, 36, 4);
    head.castShadow = true;
    heron.add(head);
    
    // Beak (long pointed)
    const beakGeometry = new THREE.ConeGeometry(1, 8, 8);
    beakGeometry.rotateX(Math.PI / 2);
    const beakMaterial = new THREE.MeshStandardMaterial({
        color: 0xF4D03F,
        roughness: 0.4
    });
    const beak = new THREE.Mesh(beakGeometry, beakMaterial);
    beak.position.set(0, 36, 9);
    beak.castShadow = true;
    heron.add(beak);
    
    // Legs (long thin)
    const legGeometry = new THREE.CylinderGeometry(0.6, 0.6, 15, 8);
    const legMaterial = new THREE.MeshStandardMaterial({
        color: 0x34495E,
        roughness: 0.6
    });
    
    const leftLeg = new THREE.Mesh(legGeometry, legMaterial);
    leftLeg.position.set(-2, 6, 0);
    leftLeg.castShadow = true;
    heron.add(leftLeg);
    
    const rightLeg = new THREE.Mesh(legGeometry, legMaterial);
    rightLeg.position.set(2, 6, 0);
    rightLeg.castShadow = true;
    heron.add(rightLeg);
    
    // Eye
    const eyeMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const eyeGeometry = new THREE.SphereGeometry(0.8, 8, 8);
    const eye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    eye.position.set(2, 37, 5);
    heron.add(eye);
    
    return heron;
}

/**
 * Create a fish piece
 */
export function createFish(color) {
    const fish = new THREE.Group();
    
    const material = new THREE.MeshStandardMaterial({
        color: color,
        roughness: 0.3,
        metalness: 0.2
    });
    
    // Body
    const bodyGeometry = new THREE.SphereGeometry(6, 16, 16);
    bodyGeometry.scale(1.8, 0.8, 0.7);
    const body = new THREE.Mesh(bodyGeometry, material);
    body.position.y = 5;
    body.castShadow = true;
    fish.add(body);
    
    // Tail fin
    const tailGeometry = new THREE.ConeGeometry(4, 6, 3);
    tailGeometry.rotateZ(Math.PI / 2);
    tailGeometry.scale(0.4, 1, 1);
    const tail = new THREE.Mesh(tailGeometry, material);
    tail.position.set(-10, 5, 0);
    tail.castShadow = true;
    fish.add(tail);
    
    // Dorsal fin
    const dorsalGeometry = new THREE.ConeGeometry(2, 4, 3);
    const dorsal = new THREE.Mesh(dorsalGeometry, material);
    dorsal.position.set(0, 10, 0);
    dorsal.rotation.z = Math.PI;
    dorsal.castShadow = true;
    fish.add(dorsal);
    
    // Eye
    const eyeMaterial = new THREE.MeshStandardMaterial({
        color: 0xFFFFFF,
        roughness: 0.2
    });
    const eyeGeometry = new THREE.SphereGeometry(1.2, 8, 8);
    const eye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    eye.position.set(6, 6, 3);
    fish.add(eye);
    
    const pupilMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const pupilGeometry = new THREE.SphereGeometry(0.5, 6, 6);
    const pupil = new THREE.Mesh(pupilGeometry, pupilMaterial);
    pupil.position.set(6.5, 6, 4);
    fish.add(pupil);
    
    return fish;
}

/**
 * Create a snake piece
 */
export function createSnake(color = 0x27AE60) {
    const snake = new THREE.Group();
    
    const material = new THREE.MeshStandardMaterial({
        color: color,
        roughness: 0.5,
        metalness: 0.1
    });
    
    // Coiled body
    const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-6, 2, 0),
        new THREE.Vector3(-3, 3, 4),
        new THREE.Vector3(0, 4, 0),
        new THREE.Vector3(3, 5, -4),
        new THREE.Vector3(6, 8, 0),
        new THREE.Vector3(4, 12, 2)
    ]);
    
    const tubeGeometry = new THREE.TubeGeometry(curve, 32, 2, 12, false);
    const body = new THREE.Mesh(tubeGeometry, material);
    body.castShadow = true;
    snake.add(body);
    
    // Head
    const headGeometry = new THREE.SphereGeometry(3, 12, 12);
    headGeometry.scale(1.2, 0.8, 1);
    const head = new THREE.Mesh(headGeometry, material);
    head.position.set(4, 13, 3);
    head.rotation.y = -0.5;
    head.castShadow = true;
    snake.add(head);
    
    // Eyes
    const eyeMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const eyeGeometry = new THREE.SphereGeometry(0.8, 8, 8);
    
    const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    leftEye.position.set(3, 14, 5);
    snake.add(leftEye);
    
    const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    rightEye.position.set(5.5, 14, 4.5);
    snake.add(rightEye);
    
    // Tongue
    const tongueGeometry = new THREE.CylinderGeometry(0.2, 0.1, 4, 4);
    tongueGeometry.rotateZ(Math.PI / 2);
    const tongueMaterial = new THREE.MeshBasicMaterial({ color: 0xE74C3C });
    const tongue = new THREE.Mesh(tongueGeometry, tongueMaterial);
    tongue.position.set(4.5, 12.5, 6);
    snake.add(tongue);
    
    return snake;
}

/**
 * Create a tree piece
 */
export function createTree(trunkColor, foliageColor) {
    const tree = new THREE.Group();
    
    const trunkMaterial = new THREE.MeshStandardMaterial({
        color: trunkColor || 0x8B4513,
        roughness: 0.9,
        metalness: 0
    });
    
    const foliageMaterial = new THREE.MeshStandardMaterial({
        color: foliageColor || 0x27AE60,
        roughness: 0.7,
        metalness: 0
    });
    
    // Trunk
    const trunkGeometry = new THREE.CylinderGeometry(4, 6, 25, 8);
    const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
    trunk.position.y = 12;
    trunk.castShadow = true;
    tree.add(trunk);
    
    // Foliage (multiple spheres for fuller look)
    const foliagePositions = [
        { x: 0, y: 32, z: 0, scale: 1.2 },
        { x: -8, y: 28, z: 0, scale: 0.8 },
        { x: 8, y: 28, z: 0, scale: 0.8 },
        { x: 0, y: 28, z: -8, scale: 0.8 },
        { x: 0, y: 28, z: 8, scale: 0.8 }
    ];
    
    foliagePositions.forEach(pos => {
        const foliageGeometry = new THREE.SphereGeometry(12 * pos.scale, 12, 12);
        const foliage = new THREE.Mesh(foliageGeometry, foliageMaterial);
        foliage.position.set(pos.x, pos.y, pos.z);
        foliage.castShadow = true;
        tree.add(foliage);
    });
    
    // Branches (optional visual)
    const branchGeometry = new THREE.CylinderGeometry(1, 2, 10, 6);
    
    const leftBranch = new THREE.Mesh(branchGeometry, trunkMaterial);
    leftBranch.position.set(-6, 20, 0);
    leftBranch.rotation.z = 0.8;
    leftBranch.castShadow = true;
    tree.add(leftBranch);
    
    const rightBranch = new THREE.Mesh(branchGeometry, trunkMaterial);
    rightBranch.position.set(6, 20, 0);
    rightBranch.rotation.z = -0.8;
    rightBranch.castShadow = true;
    tree.add(rightBranch);
    
    return tree;
}

/**
 * Create a sun token
 */
export function createSun(color = 0xF4D03F) {
    const sun = new THREE.Group();
    
    const material = new THREE.MeshStandardMaterial({
        color: color,
        roughness: 0.3,
        metalness: 0.2,
        emissive: color,
        emissiveIntensity: 0.3
    });
    
    // Center
    const centerGeometry = new THREE.SphereGeometry(10, 20, 20);
    const center = new THREE.Mesh(centerGeometry, material);
    center.position.y = 10;
    center.castShadow = true;
    sun.add(center);
    
    // Rays
    const rayGeometry = new THREE.ConeGeometry(2, 8, 6);
    for (let i = 0; i < 8; i++) {
        const ray = new THREE.Mesh(rayGeometry, material);
        const angle = (i / 8) * Math.PI * 2;
        ray.position.set(
            Math.cos(angle) * 14,
            10,
            Math.sin(angle) * 14
        );
        ray.rotation.z = -angle + Math.PI / 2;
        ray.rotation.order = 'YXZ';
        ray.rotation.y = angle;
        ray.castShadow = true;
        sun.add(ray);
    }
    
    return sun;
}

/**
 * Create a cloud token
 */
export function createCloud(color = 0xBDC3C7) {
    const cloud = new THREE.Group();
    
    const material = new THREE.MeshStandardMaterial({
        color: color,
        roughness: 0.8,
        metalness: 0
    });
    
    // Multiple spheres for fluffy cloud
    const positions = [
        { x: 0, y: 10, z: 0, r: 8 },
        { x: -8, y: 8, z: 0, r: 6 },
        { x: 8, y: 8, z: 0, r: 6 },
        { x: -4, y: 12, z: 3, r: 5 },
        { x: 4, y: 12, z: -3, r: 5 }
    ];
    
    positions.forEach(pos => {
        const geometry = new THREE.SphereGeometry(pos.r, 12, 12);
        const sphere = new THREE.Mesh(geometry, material);
        sphere.position.set(pos.x, pos.y, pos.z);
        sphere.castShadow = true;
        cloud.add(sphere);
    });
    
    return cloud;
}

/**
 * Create a rain cloud token
 */
export function createRain(color = 0x5DADE2) {
    const rain = new THREE.Group();
    
    // Cloud part (darker)
    const cloudMaterial = new THREE.MeshStandardMaterial({
        color: 0x7F8C8D,
        roughness: 0.8,
        metalness: 0
    });
    
    const positions = [
        { x: 0, y: 15, z: 0, r: 6 },
        { x: -6, y: 13, z: 0, r: 5 },
        { x: 6, y: 13, z: 0, r: 5 }
    ];
    
    positions.forEach(pos => {
        const geometry = new THREE.SphereGeometry(pos.r, 12, 12);
        const sphere = new THREE.Mesh(geometry, cloudMaterial);
        sphere.position.set(pos.x, pos.y, pos.z);
        sphere.castShadow = true;
        rain.add(sphere);
    });
    
    // Rain drops
    const dropMaterial = new THREE.MeshStandardMaterial({
        color: color,
        roughness: 0.2,
        metalness: 0.3,
        transparent: true,
        opacity: 0.8
    });
    
    const dropGeometry = new THREE.CapsuleGeometry(0.8, 3, 4, 8);
    
    for (let i = 0; i < 5; i++) {
        const drop = new THREE.Mesh(dropGeometry, dropMaterial);
        drop.position.set(
            (i - 2) * 4,
            5 - (i % 2) * 3,
            (i % 2) * 2 - 1
        );
        rain.add(drop);
    }
    
    return rain;
}

/**
 * Create piece by type
 */
export function createPiece(pieceData) {
    let mesh;
    
    switch (pieceData.type) {
        case PIECE_TYPES.FROG:
            mesh = createFrog(pieceData.color);
            break;
        case PIECE_TYPES.HERON:
            mesh = createHeron(pieceData.color);
            break;
        case PIECE_TYPES.FISH:
            mesh = createFish(pieceData.color);
            break;
        case PIECE_TYPES.SNAKE:
            mesh = createSnake(pieceData.color);
            break;
        case PIECE_TYPES.TREE:
            mesh = createTree(pieceData.color, pieceData.foliageColor);
            break;
        case PIECE_TYPES.SUN:
            mesh = createSun(pieceData.color);
            break;
        case PIECE_TYPES.CLOUD:
            mesh = createCloud(pieceData.color);
            break;
        case PIECE_TYPES.RAIN:
            mesh = createRain(pieceData.color);
            break;
        default:
            mesh = createFrog(pieceData.color || FROG_COLORS.GREEN);
    }
    
    // Position piece
    const pos = OFF_BOARD_POSITIONS[pieceData.position];
    if (pos) {
        mesh.position.set(pos.x, 0, pos.z);
    }
    
    // Store metadata
    mesh.userData = {
        type: pieceData.type,
        color: pieceData.color,
        isPiece: true,
        initialPosition: pieceData.position
    };
    
    return mesh;
}

/**
 * Initialize all game pieces
 */
export function initializePieces(scene, boardHexes) {
    const pieces = [];
    
    INITIAL_PIECES.forEach(pieceData => {
        const piece = createPiece(pieceData);
        scene.add(piece);
        pieces.push(piece);
    });
    
    return pieces;
}
