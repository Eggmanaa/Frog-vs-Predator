// Interaction system - drag and drop pieces

import * as THREE from 'three';
import { pixelToAxial, hexKey } from './utils.js';
import { animateHopUp, animateHopDown, updateFloatAnimation, stopFloatAnimation, lerpPiecePosition } from './animations.js';

// Interaction state
let selectedPiece = null;
let isDragging = false;
let dragPlane = null;
let hoveredHex = null;
let floatBaseY = 0;

// Raycaster for mouse picking
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

/**
 * Setup interaction system
 * @param {THREE.Camera} camera - Camera
 * @param {THREE.Scene} scene - Scene
 * @param {HTMLCanvasElement} canvas - Canvas element
 * @param {Array} pieces - Array of piece meshes
 * @param {Map} boardHexes - Board hex map
 */
export function setupInteraction(camera, scene, canvas, pieces, boardHexes) {
    // Create invisible drag plane at board level
    const planeGeometry = new THREE.PlaneGeometry(2000, 2000);
    planeGeometry.rotateX(-Math.PI / 2);
    const planeMaterial = new THREE.MeshBasicMaterial({ visible: false });
    dragPlane = new THREE.Mesh(planeGeometry, planeMaterial);
    dragPlane.position.y = 10;
    scene.add(dragPlane);

    // Mouse event listeners
    canvas.addEventListener('mousedown', (e) => onMouseDown(e, camera, pieces, boardHexes));
    canvas.addEventListener('mousemove', (e) => onMouseMove(e, camera, canvas, boardHexes));
    canvas.addEventListener('mouseup', (e) => onMouseUp(e, boardHexes));

    // Touch event listeners for mobile
    canvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent('mousedown', {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        canvas.dispatchEvent(mouseEvent);
    });

    canvas.addEventListener('touchmove', (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent('mousemove', {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        canvas.dispatchEvent(mouseEvent);
    });

    canvas.addEventListener('touchend', (e) => {
        e.preventDefault();
        const mouseEvent = new MouseEvent('mouseup', {});
        canvas.dispatchEvent(mouseEvent);
    });
}

/**
 * Update interaction state each frame
 */
export function updateInteraction() {
    if (isDragging && selectedPiece) {
        updateFloatAnimation(selectedPiece, floatBaseY);
    }
}

/**
 * Mouse down handler
 */
function onMouseDown(event, camera, pieces, boardHexes) {
    // Update mouse position
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Raycast to pieces
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(pieces, true);

    if (intersects.length > 0) {
        // Find the root piece group
        let piece = intersects[0].object;
        while (piece.parent && !piece.userData.isPiece) {
            piece = piece.parent;
        }

        if (piece.userData.isPiece) {
            selectedPiece = piece;
            floatBaseY = piece.position.y;
            isDragging = true;

            // Animate hop up
            animateHopUp(piece);
        }
    }
}

/**
 * Mouse move handler
 */
function onMouseMove(event, camera, canvas, boardHexes) {
    // Update mouse position
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    if (isDragging && selectedPiece) {
        // Raycast to drag plane to get world position
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObject(dragPlane);

        if (intersects.length > 0) {
            const point = intersects[0].point;

            // Smoothly move piece to mouse position
            lerpPiecePosition(selectedPiece, point.x, point.z);

            // Find which hex we're hovering over
            const hexCoords = pixelToAxial(point.x, point.z);
            const key = hexKey(hexCoords.q, hexCoords.r);

            // Clear previous highlight
            if (hoveredHex && hoveredHex !== key) {
                const prevHexData = boardHexes.get(hoveredHex);
                if (prevHexData) {
                    prevHexData.mesh.material.emissiveIntensity = 0;
                }
            }

            // Highlight current hex
            const hexData = boardHexes.get(key);
            if (hexData) {
                hexData.mesh.material.emissive = new THREE.Color(0xFFEB3B);
                hexData.mesh.material.emissiveIntensity = 0.3;
                hoveredHex = key;
            }
        }
    }
}

/**
 * Mouse up handler
 */
function onMouseUp(event, boardHexes) {
    if (isDragging && selectedPiece) {
        // Get hovered hex
        if (hoveredHex) {
            const hexData = boardHexes.get(hoveredHex);

            if (hexData) {
                // Snap to hex position
                const { q, r } = hexData.coords;
                const targetY = hexData.elevation + 5;

                // Update piece data
                selectedPiece.userData.q = q;
                selectedPiece.userData.r = r;

                // Animate hop down
                stopFloatAnimation(selectedPiece);
                animateHopDown(selectedPiece, targetY);

                // Clear highlight
                hexData.mesh.material.emissiveIntensity = 0;
            }
        }

        selectedPiece = null;
        isDragging = false;
        hoveredHex = null;
    }
}

/**
 * Reset all pieces to initial positions
 * @param {Array} pieces - Piece array
 * @param {Map} boardHexes - Board hex map
 */
export function resetPieces(pieces, boardHexes) {
    // This would reset pieces to INITIAL_PIECES positions
    // Implementation depends on whether you want to reload or just reset positions
    console.log('Reset pieces functionality');
}
