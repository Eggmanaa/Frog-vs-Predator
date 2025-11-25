// Interaction system - drag and drop pieces like tabletop simulator

import * as THREE from 'three';
import { pixelToAxial, axialToPixel, hexKey } from './utils.js';
import { animateHopUp, animateHopDown, updateFloatAnimation, stopFloatAnimation, lerpPiecePosition } from './animations.js';
import { BOARD_LAYOUT } from './config.js';

// Interaction state
let selectedPiece = null;
let isDragging = false;
let dragPlane = null;
let hoveredHex = null;
let floatBaseY = 0;
let dragStartY = 0;

// Raycaster for mouse picking
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Store camera reference
let _camera = null;

/**
 * Setup interaction system
 */
export function setupInteraction(camera, scene, canvas, pieces, boardHexes) {
    _camera = camera;
    
    // Create invisible drag plane at board level
    const planeGeometry = new THREE.PlaneGeometry(3000, 3000);
    planeGeometry.rotateX(-Math.PI / 2);
    const planeMaterial = new THREE.MeshBasicMaterial({ visible: false });
    dragPlane = new THREE.Mesh(planeGeometry, planeMaterial);
    dragPlane.position.y = 20;
    scene.add(dragPlane);
    
    // Mouse event listeners
    canvas.addEventListener('mousedown', (e) => {
        if (e.button === 0) { // Left click only
            onMouseDown(e, camera, pieces, boardHexes);
        }
    });
    
    canvas.addEventListener('mousemove', (e) => onMouseMove(e, camera, canvas, boardHexes));
    
    canvas.addEventListener('mouseup', (e) => {
        if (e.button === 0) {
            onMouseUp(e, boardHexes);
        }
    });
    
    // Touch event listeners for mobile
    canvas.addEventListener('touchstart', (e) => {
        if (e.touches.length === 1) {
            e.preventDefault();
            const touch = e.touches[0];
            const fakeEvent = { clientX: touch.clientX, clientY: touch.clientY, button: 0 };
            onMouseDown(fakeEvent, camera, pieces, boardHexes);
        }
    }, { passive: false });
    
    canvas.addEventListener('touchmove', (e) => {
        if (e.touches.length === 1 && isDragging) {
            e.preventDefault();
            const touch = e.touches[0];
            const fakeEvent = { clientX: touch.clientX, clientY: touch.clientY };
            onMouseMove(fakeEvent, camera, canvas, boardHexes);
        }
    }, { passive: false });
    
    canvas.addEventListener('touchend', (e) => {
        if (isDragging) {
            e.preventDefault();
            onMouseUp({}, boardHexes);
        }
    }, { passive: false });
    
    // Cursor change on hover
    canvas.addEventListener('mousemove', (e) => {
        updateCursor(e, camera, pieces, canvas);
    });
}

/**
 * Update cursor based on what's being hovered
 */
function updateCursor(event, camera, pieces, canvas) {
    if (isDragging) {
        canvas.style.cursor = 'grabbing';
        return;
    }
    
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(pieces, true);
    
    if (intersects.length > 0) {
        canvas.style.cursor = 'grab';
    } else {
        canvas.style.cursor = 'default';
    }
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
 * Mouse down handler - pick up piece
 */
function onMouseDown(event, camera, pieces, boardHexes) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(pieces, true);
    
    if (intersects.length > 0) {
        // Find the root piece group
        let piece = intersects[0].object;
        while (piece.parent && piece.parent.type !== 'Scene' && !piece.userData.isPiece) {
            piece = piece.parent;
        }
        
        if (piece.userData && piece.userData.isPiece) {
            selectedPiece = piece;
            dragStartY = piece.position.y;
            floatBaseY = piece.position.y + 30; // Lift height
            isDragging = true;
            
            // Set drag plane height
            dragPlane.position.y = floatBaseY;
            
            // Animate hop up
            animateHopUp(piece);
            
            // Change cursor
            document.getElementById('game-canvas').style.cursor = 'grabbing';
        }
    }
}

/**
 * Mouse move handler - drag piece
 */
function onMouseMove(event, camera, canvas, boardHexes) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
    if (isDragging && selectedPiece) {
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObject(dragPlane);
        
        if (intersects.length > 0) {
            const point = intersects[0].point;
            
            // Smoothly move piece to mouse position
            lerpPiecePosition(selectedPiece, point.x, point.z);
            
            // Find which hex we're over
            const hexCoords = pixelToAxial(point.x, point.z);
            const key = hexKey(hexCoords.q, hexCoords.r);
            
            // Clear previous highlight
            if (hoveredHex && hoveredHex !== key) {
                const prevHexData = boardHexes.get(hoveredHex);
                if (prevHexData && prevHexData.mesh) {
                    prevHexData.mesh.material.emissive.setHex(0x000000);
                    prevHexData.mesh.material.emissiveIntensity = 0;
                }
            }
            
            // Highlight current hex if valid
            const hexData = boardHexes.get(key);
            if (hexData && hexData.mesh) {
                hexData.mesh.material.emissive.setHex(0xFFEB3B);
                hexData.mesh.material.emissiveIntensity = 0.4;
                hoveredHex = key;
            } else {
                hoveredHex = null;
            }
        }
    }
}

/**
 * Mouse up handler - drop piece
 */
function onMouseUp(event, boardHexes) {
    if (isDragging && selectedPiece) {
        let targetY = dragStartY;
        let targetX = selectedPiece.position.x;
        let targetZ = selectedPiece.position.z;
        
        // If over a valid hex, snap to it
        if (hoveredHex) {
            const hexData = boardHexes.get(hoveredHex);
            
            if (hexData) {
                const { q, r } = hexData.coords;
                const { x, z } = axialToPixel(q, r);
                
                targetX = x;
                targetZ = z;
                targetY = hexData.elevation;
                
                // Update piece data
                selectedPiece.userData.q = q;
                selectedPiece.userData.r = r;
                selectedPiece.userData.onBoard = true;
                
                // Clear highlight
                hexData.mesh.material.emissive.setHex(0x000000);
                hexData.mesh.material.emissiveIntensity = 0;
            }
        }
        
        // Snap position
        selectedPiece.position.x = targetX;
        selectedPiece.position.z = targetZ;
        
        // Animate drop
        stopFloatAnimation(selectedPiece);
        animateHopDown(selectedPiece, targetY);
        
        // Reset state
        selectedPiece = null;
        isDragging = false;
        hoveredHex = null;
        
        // Reset cursor
        document.getElementById('game-canvas').style.cursor = 'default';
    }
}

/**
 * Get currently selected piece
 */
export function getSelectedPiece() {
    return selectedPiece;
}

/**
 * Check if currently dragging
 */
export function getIsDragging() {
    return isDragging;
}
