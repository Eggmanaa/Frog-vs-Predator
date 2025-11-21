// Main entry point - orchestrates everything

import * as THREE from 'three';
import { setupCamera, setupControls, setupLighting, createTableSurface, createDecorations, createBackground, resetCamera } from './environment.js';
import { createBoard, addBoardBase, addGrassTexture } from './board.js';
import { initializePieces } from './pieces.js';
import { setupInteraction, updateInteraction } from './interaction.js';

// Get canvas and loading screen
const canvas = document.getElementById('game-canvas');
const loadingScreen = document.getElementById('loading-screen');

// Scene setup
const scene = new THREE.Scene();

// Renderer setup
const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;

// Camera & controls
const camera = setupCamera(window.innerWidth / window.innerHeight);
const controls = setupControls(camera, canvas);

// Environment
setupLighting(scene);
createBackground(scene);
createTableSurface(scene);
createDecorations(scene);

// Game board & pieces
console.log('Creating board...');
const boardHexes = createBoard(scene);
addBoardBase(scene);
addGrassTexture(scene, boardHexes);

console.log('Creating pieces...');
const pieces = initializePieces(scene, boardHexes);

// Interaction
setupInteraction(camera, scene, canvas, pieces, boardHexes);

// UI Buttons
document.getElementById('reset-camera').addEventListener('click', () => {
    resetCamera(camera, controls);
});

document.getElementById('reset-game').addEventListener('click', () => {
    // Reload page for now
    window.location.reload();
});

// Hide loading screen after everything is loaded
setTimeout(() => {
    loadingScreen.classList.add('hidden');
    console.log('Game loaded!');
}, 500);

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    // Update controls
    controls.update();

    // Update interaction animations
    updateInteraction();

    // Render scene
    renderer.render(scene, camera);
}

// Start animation loop
animate();

// Handle window resize
window.addEventListener('resize', () => {
    const aspect = window.innerWidth / window.innerHeight;
    const frustumSize = 600;

    camera.left = -frustumSize * aspect / 2;
    camera.right = frustumSize * aspect / 2;
    camera.top = frustumSize / 2;
    camera.bottom = -frustumSize / 2;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

console.log('Frog Versus Predator 3D - Game Initialized!');
