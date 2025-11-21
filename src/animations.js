// Animation system for smooth piece movement

import { ANIMATION_CONFIG } from './config.js';

/**
 * Animate piece hop up (selection)
 * @param {THREE.Group} piece - Piece mesh
 * @param {Function} onComplete - Callback when complete
 */
export function animateHopUp(piece, onComplete) {
    const startY = piece.position.y;
    const targetY = startY + ANIMATION_CONFIG.hopUp.height;
    const startTime = performance.now();
    const duration = ANIMATION_CONFIG.hopUp.duration;

    function animate() {
        const elapsed = performance.now() - startTime;
        const t = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - t, 3); // cubic ease-out

        piece.position.y = startY + (targetY - startY) * eased;
        piece.scale.setScalar(1 + ANIMATION_CONFIG.hopUp.scaleIncrease * eased);

        // Add emissive glow to all meshes
        piece.traverse(child => {
            if (child.isMesh && child.material) {
                child.material.emissive = child.material.color;
                child.material.emissiveIntensity = 0.3 * eased;
            }
        });

        if (t < 1) {
            requestAnimationFrame(animate);
        } else if (onComplete) {
            onComplete();
        }
    }

    animate();
}

/**
 * Animate piece hop down (placement)
 * @param {THREE.Group} piece - Piece mesh
 * @param {number} targetY - Target Y position
 * @param {Function} onComplete - Callback when complete
 */
export function animateHopDown(piece, targetY, onComplete) {
    const startY = piece.position.y;
    const startTime = performance.now();
    const duration = ANIMATION_CONFIG.hopDown.duration;

    function animate() {
        const elapsed = performance.now() - startTime;
        const t = Math.min(elapsed / duration, 1);

        // Elastic ease-out with bounce
        let eased;
        if (t < 0.5) {
            // First half: fall down
            eased = 1 - Math.pow(1 - t * 2, 2);
        } else {
            // Second half: bounce
            const bounceT = (t - 0.5) * 2;
            const bounce = Math.sin(bounceT * Math.PI * 2) * Math.pow(1 - bounceT, 2) * 0.4;
            eased = 1 + bounce;
        }

        piece.position.y = startY + (targetY - startY) * eased;

        // Scale back to normal
        const scaleT = Math.min(t * 1.5, 1);
        piece.scale.setScalar(1 + ANIMATION_CONFIG.hopUp.scaleIncrease * (1 - scaleT));

        // Fade emissive glow
        piece.traverse(child => {
            if (child.isMesh && child.material) {
                child.material.emissiveIntensity = 0.3 * (1 - scaleT);
            }
        });

        if (t < 1) {
            requestAnimationFrame(animate);
        } else {
            // Ensure final values
            piece.position.y = targetY;
            piece.scale.setScalar(1);
            piece.traverse(child => {
                if (child.isMesh && child.material) {
                    child.material.emissiveIntensity = 0;
                }
            });
            if (onComplete) {
                onComplete();
            }
        }
    }

    animate();
}

/**
 * Floating animation state
 */
let floatStartTime = 0;

/**
 * Update floating animation (call each frame while dragging)
 * @param {THREE.Group} piece - Piece mesh
 * @param {number} baseY - Base Y position
 */
export function updateFloatAnimation(piece, baseY) {
    if (!floatStartTime) floatStartTime = performance.now();

    const elapsed = performance.now() - floatStartTime;
    const period = ANIMATION_CONFIG.float.period;
    const t = (elapsed % period) / period;
    const angle = t * Math.PI * 2;

    // Sine wave for vertical bob
    const bob = Math.sin(angle) * ANIMATION_CONFIG.float.amplitude;
    piece.position.y = baseY + bob;

    // Subtle rotation wobble
    const wobbleRad = (ANIMATION_CONFIG.float.wobbleAngle * Math.PI) / 180;
    const wobble = Math.sin(angle * 2) * wobbleRad;
    piece.rotation.y = wobble;
}

/**
 * Stop floating animation
 * @param {THREE.Group} piece - Piece mesh
 */
export function stopFloatAnimation(piece) {
    floatStartTime = 0;
    piece.rotation.y = 0;
}

/**
 * Smoothly interpolate piece position (lerp for following mouse)
 * @param {THREE.Group} piece - Piece mesh
 * @param {number} targetX - Target X position
 * @param {number} targetZ - Target Z position
 */
export function lerpPiecePosition(piece, targetX, targetZ) {
    const factor = ANIMATION_CONFIG.follow.lerpFactor;
    piece.position.x += (targetX - piece.position.x) * factor;
    piece.position.z += (targetZ - piece.position.z) * factor;
}
